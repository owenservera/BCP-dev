import { test, expect, beforeEach } from "bun:test"
import { Database } from "bun:sqlite"
import { openDb } from "../src/db.ts"
import { MessageBus } from "../src/bus.ts"
import { SwarmState } from "../src/state.ts"
import { Orchestrator, swarmSystemPrompt, type SessionClient } from "../src/orchestrator.ts"
import type { SwarmConfig } from "../src/config.ts"

/**
 * Fake opencode client. Each prompt is routed to a per-agent script —
 * an array of handlers, one per turn — which can touch the bus/memory
 * exactly like a real agent using the swarm_* tools would.
 */
type Turn = (ctx: { text: string; swarmId: string; bus: MessageBus }) => string
let db: Database
let sessions: Map<string, string> // sessionId -> agent name (via title)
let prompts: Map<string, string[]> // agent -> prompt texts received

function fakeClient(scripts: Record<string, Turn[]>): SessionClient {
  let counter = 0
  return {
    session: {
      async create({ body }) {
        const id = `ses_fake_${++counter}`
        sessions.set(id, body.title.split("/").pop()!)
        return { data: { id } }
      },
      async prompt({ path, body }) {
        const agent = sessions.get(path.id)!
        const text = body.parts[0]?.text ?? ""
        prompts.get(agent)?.push(text) ?? prompts.set(agent, [text])
        const swarmId = new SwarmState(db).listSwarms()[0]!.id
        const turn = scripts[agent]?.shift()
        const reply = turn ? turn({ text, swarmId, bus: new MessageBus(db, swarmId) }) : "done"
        return { data: { parts: [{ type: "text", text: reply }] } }
      },
    },
  }
}

const config = (agents: SwarmConfig["agents"], extra: Partial<SwarmConfig> = {}): SwarmConfig => ({
  name: "test-swarm",
  model: "openrouter/openai/gpt-4o-mini",
  agents,
  ...extra,
})

beforeEach(() => {
  db = openDb(":memory:")
  sessions = new Map()
  prompts = new Map()
})

test("runs agents in parallel and records results", async () => {
  const orch = new Orchestrator(
    fakeClient({ alpha: [() => "alpha finished"], beta: [() => "beta finished"] }),
    db,
  )
  const result = await orch.run(config([
    { name: "alpha", task: "task a" },
    { name: "beta", task: "task b" },
  ]))
  expect(result.status).toBe("completed")
  expect(result.agents.find((a) => a.name === "alpha")?.result).toBe("alpha finished")
  expect(result.agents.find((a) => a.name === "beta")?.result).toBe("beta finished")
})

test("delivers a message sent mid-swarm as a follow-up prompt", async () => {
  const orch = new Orchestrator(
    fakeClient({
      sender: [({ swarmId, bus }) => {
        bus.send("sender", "receiver", "use port 8080")
        return "sent"
      }],
      receiver: [() => "first turn", () => "acted on message"],
    }),
    db,
  )
  const result = await orch.run(config([
    { name: "sender", task: "tell receiver the port" },
    { name: "receiver", task: "wait for config" },
  ]))
  expect(result.status).toBe("completed")
  const received = prompts.get("receiver") ?? []
  expect(received.length).toBe(2)
  expect(received[1]).toContain("From sender")
  expect(received[1]).toContain("use port 8080")
  expect(result.agents.find((a) => a.name === "receiver")?.result).toBe("acted on message")
})

test("failed prompts mark the agent and swarm failed, others still complete", async () => {
  const failing: SessionClient = {
    session: {
      async create({ body }) {
        const id = `ses_${body.title}`
        sessions.set(id, body.title.split("/").pop()!)
        return { data: { id } }
      },
      async prompt({ path }) {
        const agent = sessions.get(path.id)!
        if (agent === "bad") return { error: { message: "boom" } }
        return { data: { parts: [{ type: "text", text: "ok" }] } }
      },
    },
  }
  const orch = new Orchestrator(failing, db, { backoffMs: 1 })
  const result = await orch.run(config([
    { name: "bad", task: "explode" },
    { name: "good", task: "work" },
  ]))
  expect(result.status).toBe("failed")
  expect(result.agents.find((a) => a.name === "bad")?.status).toBe("failed")
  expect(result.agents.find((a) => a.name === "good")?.status).toBe("done")
})

test("model-level errors in info.error are retried then surfaced", async () => {
  let attempts = 0
  const flaky: SessionClient = {
    session: {
      async create({ body }) {
        const id = "ses_flaky"
        sessions.set(id, body.title.split("/").pop()!)
        return { data: { id } }
      },
      async prompt() {
        attempts++
        if (attempts < 3)
          return { data: { info: { error: { name: "APIError", data: { message: "rate limited" } } }, parts: [] } }
        return { data: { parts: [{ type: "text", text: "recovered" }] } }
      },
    },
  }
  const orch = new Orchestrator(flaky, db, { backoffMs: 1 })
  const result = await orch.run(config([{ name: "only", task: "t" }]))
  expect(attempts).toBe(3)
  expect(result.status).toBe("completed")
  expect(result.agents[0]?.result).toBe("recovered")
})

test("resume skips agents that already finished", async () => {
  const client = fakeClient({ late: [() => "late done"] })
  const orch = new Orchestrator(client, db)
  const state = new SwarmState(db)
  const cfg = config([
    { name: "early", task: "t1" },
    { name: "late", task: "t2" },
  ])
  const swarmId = state.createSwarm(cfg.name, cfg)
  state.upsertAgent(swarmId, "early", { sessionId: "ses_done", status: "done", result: "already" })

  const result = await orch.run(cfg, { resumeSwarmId: swarmId })
  expect(result.status).toBe("completed")
  expect(prompts.has("early")).toBe(false)
  expect(result.agents.find((a) => a.name === "early")?.result).toBe("already")
  expect(result.agents.find((a) => a.name === "late")?.result).toBe("late done")
})

test("final sweep delivers messages sent to agents that already finished", async () => {
  const orch = new Orchestrator(
    fakeClient({
      fast: [() => "fast done", () => "got late news"],
      slow: [({ bus }) => {
        bus.send("slow", "fast", "psst, late update")
        return "slow done"
      }],
    }),
    db,
  )
  // fast finishes its only turn before slow sends; sweep must deliver afterwards
  const result = await orch.run(config([
    { name: "fast", task: "quick job" },
    { name: "slow", task: "slow job" },
  ]))
  expect(result.status).toBe("completed")
  const fastPrompts = prompts.get("fast") ?? []
  expect(fastPrompts.some((p) => p.includes("psst, late update"))).toBe(true)
  expect(new MessageBus(db, result.swarmId).undelivered().length).toBe(0)
  // delivered either in-loop (result = reaction) or via sweep (appended) — both keep the reaction
  expect(result.agents.find((a) => a.name === "fast")?.result).toContain("got late news")
})

test("restrictive tools maps never strip the swarm coordination tools", async () => {
  const bodies: Array<Record<string, boolean> | undefined> = []
  const client: SessionClient = {
    session: {
      async create({ body }) {
        const id = `ses_${body.title}`
        sessions.set(id, body.title.split("/").pop()!)
        return { data: { id } }
      },
      async prompt({ body }) {
        bodies.push(body.tools)
        return { data: { parts: [{ type: "text", text: "ok" }] } }
      },
    },
  }
  const orch = new Orchestrator(client, db)
  await orch.run(config([{ name: "a", task: "t", tools: { "*": false, read: true } }]))
  expect(bodies[0]?.["*"]).toBe(false)
  expect(bodies[0]?.read).toBe(true)
  expect(bodies[0]?.swarm_send).toBe(true)
  expect(bodies[0]?.swarm_memory_set).toBe(true)
})

test("sweep delivery to an already-done agent appends, never clobbers", async () => {
  const client = fakeClient({
    done_agent: [() => "thanks, noted"],
    worker: [() => "worker done"],
  })
  const orch = new Orchestrator(client, db)
  const state = new SwarmState(db)
  const cfg = config([
    { name: "done_agent", task: "t1" },
    { name: "worker", task: "t2" },
  ])
  const swarmId = state.createSwarm(cfg.name, cfg)
  state.upsertAgent(swarmId, "done_agent", { sessionId: "ses_pre", status: "done", result: "settled answer" })
  sessions.set("ses_pre", "done_agent")
  new MessageBus(db, swarmId).send("worker", "done_agent", "late info")

  const result = await orch.run(cfg, { resumeSwarmId: swarmId })
  const final = result.agents.find((a) => a.name === "done_agent")
  expect(final?.status).toBe("done")
  expect(final?.result).toContain("settled answer")
  expect(final?.result).toContain("thanks, noted")
})

test("swarm system prompt names teammates and tools", () => {
  const cfg = config([
    { name: "a", task: "build the API" },
    { name: "b", task: "review it" },
  ])
  const sys = swarmSystemPrompt(cfg.agents[0]!, cfg)
  expect(sys).toContain('agent "a"')
  expect(sys).toContain("b: review it")
  expect(sys).toContain("swarm_send")
  expect(sys).toContain("swarm_memory_set")
})
