import { test, expect, beforeEach } from "bun:test"
import { openDb } from "../src/db.ts"
import { SwarmState } from "../src/state.ts"

let state: SwarmState

beforeEach(() => {
  state = new SwarmState(openDb(":memory:"))
})

test("create and fetch a swarm", () => {
  const id = state.createSwarm("review-swarm", { agents: [] })
  const swarm = state.getSwarm(id)
  expect(swarm?.name).toBe("review-swarm")
  expect(swarm?.status).toBe("created")
  expect(swarm?.config).toEqual({ agents: [] })
})

test("swarm ids are unique", () => {
  const a = state.createSwarm("a", {})
  const b = state.createSwarm("b", {})
  expect(a).not.toBe(b)
})

test("update swarm status", () => {
  const id = state.createSwarm("s", {})
  state.setSwarmStatus(id, "running")
  expect(state.getSwarm(id)?.status).toBe("running")
})

test("upsert and list agents", () => {
  const id = state.createSwarm("s", {})
  state.upsertAgent(id, "coder", { status: "spawning" })
  state.upsertAgent(id, "coder", { sessionId: "ses_123", status: "running" })
  state.upsertAgent(id, "reviewer", { status: "spawning" })
  const agents = state.getAgents(id)
  expect(agents.length).toBe(2)
  const coder = agents.find((a) => a.name === "coder")
  expect(coder?.sessionId).toBe("ses_123")
  expect(coder?.status).toBe("running")
})

test("upsert without status never resets an existing status", () => {
  const id = state.createSwarm("s", {})
  state.upsertAgent(id, "coder", { status: "done", result: "v1" })
  state.upsertAgent(id, "coder", { result: "v2" })
  const coder = state.getAgents(id)[0]
  expect(coder?.status).toBe("done")
  expect(coder?.result).toBe("v2")
})

test("agent result is persisted", () => {
  const id = state.createSwarm("s", {})
  state.upsertAgent(id, "coder", { status: "done", result: "wrote 3 files" })
  expect(state.getAgents(id)[0]?.result).toBe("wrote 3 files")
})

test("findAgentBySession resolves swarm identity from a session id", () => {
  const id = state.createSwarm("s", {})
  state.upsertAgent(id, "coder", { sessionId: "ses_abc" })
  const found = state.findAgentBySession("ses_abc")
  expect(found?.swarmId).toBe(id)
  expect(found?.name).toBe("coder")
  expect(state.findAgentBySession("ses_missing")).toBeNull()
})

test("listSwarms returns newest first", () => {
  state.createSwarm("first", {})
  const second = state.createSwarm("second", {})
  const all = state.listSwarms()
  expect(all.length).toBe(2)
  expect(all[0]?.id).toBe(second)
})
