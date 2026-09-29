import { test, expect, beforeEach } from "bun:test"
import { Database } from "bun:sqlite"
import { openDb } from "../src/db.ts"
import { SwarmState } from "../src/state.ts"
import { Orchestrator, type SessionClient, type SwarmEvent } from "../src/orchestrator.ts"
import type { SwarmConfig } from "../src/config.ts"

let db: Database

beforeEach(() => {
  db = openDb(":memory:")
})

const config = (agents: SwarmConfig["agents"], extra: Partial<SwarmConfig> = {}): SwarmConfig => ({
  name: "cost-swarm",
  model: "openrouter/openai/gpt-4o-mini",
  agents,
  ...extra,
})

/** Client where every turn costs a fixed amount and replies "ok". */
function billingClient(costPerTurn: number, opts: { trackConcurrency?: { max: number; now: number } } = {}): SessionClient {
  let n = 0
  return {
    session: {
      async create({ body }) {
        return { data: { id: `ses_${body.title}_${++n}` } }
      },
      async prompt() {
        const track = opts.trackConcurrency
        if (track) {
          track.now++
          track.max = Math.max(track.max, track.now)
        }
        await new Promise((r) => setTimeout(r, 5))
        if (track) track.now--
        return {
          data: {
            info: { cost: costPerTurn, tokens: { input: 100, output: 50, reasoning: 0, cache: { read: 0, write: 0 } } },
            parts: [{ type: "text", text: "ok" }],
          },
        }
      },
    },
  }
}

test("per-turn cost is surfaced in events and totals", async () => {
  const events: SwarmEvent[] = []
  const orch = new Orchestrator(billingClient(0.25), db, { onEvent: (e) => events.push(e) })
  const result = await orch.run(config([{ name: "a", task: "t" }, { name: "b", task: "t" }]))

  const turnDone = events.filter((e) => e.type === "agent-turn-done")
  expect(turnDone.length).toBe(2)
  expect(turnDone[0]?.type === "agent-turn-done" && turnDone[0].costUsd).toBe(0.25)
  expect(turnDone[0]?.type === "agent-turn-done" && turnDone[0].tokens.input).toBe(100)
  expect(turnDone[0]?.type === "agent-turn-done" && turnDone[0].model).toBe("openrouter/openai/gpt-4o-mini")

  const done = events.find((e) => e.type === "agent-done" && e.agent === "a")
  expect(done?.type === "agent-done" && done.costUsd).toBe(0.25)

  const swarmDone = events.find((e) => e.type === "swarm-done")
  expect(swarmDone?.type === "swarm-done" && swarmDone.totalCostUsd).toBe(0.5)
  expect(result.totalCostUsd).toBe(0.5)
  expect(result.agents.find((a) => a.name === "a")?.costUsd).toBe(0.25)

  // turn ordinals are never sentinel values
  for (const e of events) {
    if (e.type === "agent-turn-done" || e.type === "agent-turn") expect(e.round).toBeGreaterThanOrEqual(0)
  }
  // every agent gets a final settlement carrying its full cost
  const settled = events.filter((e) => e.type === "agent-settled")
  expect(settled.length).toBe(2)
  expect(settled[0]?.type === "agent-settled" && settled[0].costUsd).toBe(0.25)
})

test("agent cost is persisted in the database", async () => {
  const orch = new Orchestrator(billingClient(0.1), db)
  const result = await orch.run(config([{ name: "a", task: "t" }]))
  const agent = new SwarmState(db).getAgents(result.swarmId)[0]
  expect(agent?.costUsd).toBe(0.1)
})

test("budgetUsd stops new prompts once crossed and marks the swarm stopped", async () => {
  const events: SwarmEvent[] = []
  // 4 agents, $1/turn, budget $2, serialized so spend is deterministic
  const orch = new Orchestrator(billingClient(1), db, { onEvent: (e) => events.push(e) })
  const result = await orch.run(
    config(
      [
        { name: "a1", task: "t" },
        { name: "a2", task: "t" },
        { name: "a3", task: "t" },
        { name: "a4", task: "t" },
      ],
      { budgetUsd: 2, maxConcurrent: 1 },
    ),
  )
  expect(result.status).toBe("stopped")
  expect(result.totalCostUsd).toBe(2)
  const ran = result.agents.filter((a) => a.status === "done")
  const skipped = result.agents.filter((a) => a.status === "skipped")
  expect(ran.length).toBe(2)
  expect(skipped.length).toBe(2)
  expect(events.filter((e) => e.type === "budget-exceeded").length).toBe(1)
})

test("under budget completes normally", async () => {
  const orch = new Orchestrator(billingClient(0.01), db)
  const result = await orch.run(config([{ name: "a", task: "t" }], { budgetUsd: 5 }))
  expect(result.status).toBe("completed")
})

test("maxConcurrent caps simultaneous agent turns", async () => {
  const track = { max: 0, now: 0 }
  const orch = new Orchestrator(billingClient(0, { trackConcurrency: track }), db)
  await orch.run(
    config(
      Array.from({ length: 6 }, (_, i) => ({ name: `a${i}`, task: "t" })),
      { maxConcurrent: 2 },
    ),
  )
  expect(track.max).toBe(2)
})

test("without maxConcurrent all agents run at once", async () => {
  const track = { max: 0, now: 0 }
  const orch = new Orchestrator(billingClient(0, { trackConcurrency: track }), db)
  await orch.run(config(Array.from({ length: 5 }, (_, i) => ({ name: `a${i}`, task: "t" }))))
  expect(track.max).toBe(5)
})

test("existing databases gain the cost column (migration)", () => {
  // simulate a pre-0.2 db: agents table without cost_usd
  const legacy = new Database(":memory:")
  legacy.exec(`CREATE TABLE agents (swarm_id TEXT NOT NULL, name TEXT NOT NULL, session_id TEXT,
    status TEXT NOT NULL DEFAULT 'created', result TEXT, updated_at INTEGER NOT NULL, PRIMARY KEY (swarm_id, name))`)
  legacy.exec(`INSERT INTO agents VALUES ('sw_x', 'a', null, 'done', 'r', 1)`)
  // openDb on the same handle path isn't possible for :memory:; instead verify migrate() directly
  const { migrate } = require("../src/db.ts")
  migrate(legacy)
  const row = legacy.query("SELECT cost_usd FROM agents WHERE name = 'a'").get() as { cost_usd: number }
  expect(row.cost_usd).toBe(0)
})
