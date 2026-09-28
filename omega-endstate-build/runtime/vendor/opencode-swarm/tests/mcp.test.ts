import { test, expect, beforeEach, afterEach } from "bun:test"
import { Client } from "@modelcontextprotocol/sdk/client/index.js"
import { InMemoryTransport } from "@modelcontextprotocol/sdk/inMemory.js"
import { mkdtempSync, rmSync } from "node:fs"
import { tmpdir } from "node:os"
import { join } from "node:path"
import { createSwarmMcpServer } from "../src/mcp.ts"
import { openDb, resolveDbPath } from "../src/db.ts"
import { SwarmState } from "../src/state.ts"
import { SwarmMemory } from "../src/memory.ts"
import type { SwarmResult } from "../src/orchestrator.ts"

let dir: string
let client: Client

/** Fake runner: marks agents done in the db like the real one would, no opencode involved.
 *
 * WINDOWS ADAPTATION (VIVIM): closes the Database it opens. Upstream left the handle open,
 * which is invisible on POSIX but locks the file (and its -wal/-shm sidecars) on Windows, so
 * the afterEach `rmSync` failed with EBUSY. The two tests that call swarm_run were the only
 * ones that hit this, because they are the only ones that run a runner.
 */
async function fakeRunner(config: any, opts: any): Promise<SwarmResult> {
  const db = openDb(resolveDbPath(opts.dir))
  try {
    const state = new SwarmState(db)
    const swarmId = opts.resumeSwarmId
    await new Promise((r) => setTimeout(r, 20)) // let "running in background" be observable
    for (const agent of config.agents) {
      state.upsertAgent(swarmId, agent.name, { sessionId: `ses_${agent.name}`, status: "done", result: "fake done" })
    }
    new SwarmMemory(db, swarmId).set("finding", "fake-value", { updatedBy: config.agents[0].name })
    state.setSwarmStatus(swarmId, "completed")
    return { swarmId, status: "completed", totalCostUsd: 0, agents: [] }
  } finally {
    db.close()
  }
}

beforeEach(async () => {
  dir = mkdtempSync(join(tmpdir(), "swarm-mcp-"))
  const server = createSwarmMcpServer({ runner: fakeRunner })
  const [clientTransport, serverTransport] = InMemoryTransport.createLinkedPair()
  client = new Client({ name: "test", version: "0.0.0" })
  await Promise.all([server.connect(serverTransport), client.connect(clientTransport)])
})

afterEach(() => {
  rmSync(dir, { recursive: true, force: true })
})

const CONFIG = {
  name: "mcp-swarm",
  model: "openrouter/openai/gpt-4o-mini",
  agents: [
    { name: "a", task: "task a" },
    { name: "b", task: "task b" },
  ],
}

function firstText(result: any): string {
  return result.content?.[0]?.text ?? ""
}

test("exposes the expected tools", async () => {
  const tools = await client.listTools()
  const names = tools.tools.map((t) => t.name).sort()
  expect(names).toEqual([
    "swarm_logs",
    "swarm_memory_search",
    "swarm_run",
    "swarm_send",
    "swarm_status",
    "swarm_wait",
  ])
})

test("swarm_run returns immediately with a swarmId; swarm_wait sees completion", async () => {
  const run = await client.callTool({ name: "swarm_run", arguments: { config: CONFIG, dir } })
  const { swarmId, note } = JSON.parse(firstText(run))
  expect(swarmId).toStartWith("sw_")
  expect(note).toContain("background")

  const wait = await client.callTool({ name: "swarm_wait", arguments: { swarmId, dir, timeoutSec: 10 } })
  const [status] = JSON.parse(firstText(wait))
  expect(status.status).toBe("completed")
  expect(status.agents.every((a: any) => a.status === "done")).toBe(true)
})

test("swarm_status reports unknown swarm as an error", async () => {
  const res = await client.callTool({ name: "swarm_status", arguments: { swarmId: "sw_nope", dir } })
  expect(res.isError).toBe(true)
})

test("swarm_run rejects an invalid config without crashing", async () => {
  const res = await client.callTool({
    name: "swarm_run",
    arguments: { config: { name: "x", model: "bad", agents: [{ name: "a", task: "t" }] }, dir },
  })
  expect(res.isError).toBe(true)
  expect(firstText(res)).toContain("model")
})

test("swarm_send and swarm_memory_search work against a finished swarm", async () => {
  const run = await client.callTool({ name: "swarm_run", arguments: { config: CONFIG, dir } })
  const { swarmId } = JSON.parse(firstText(run))
  await client.callTool({ name: "swarm_wait", arguments: { swarmId, dir, timeoutSec: 10 } })

  const send = await client.callTool({ name: "swarm_send", arguments: { swarmId, to: "a", message: "hello", dir } })
  expect(firstText(send)).toContain("queued")

  const bad = await client.callTool({ name: "swarm_send", arguments: { swarmId, to: "ghost", message: "x", dir } })
  expect(bad.isError).toBe(true)

  const mem = await client.callTool({ name: "swarm_memory_search", arguments: { swarmId, query: "fake", dir } })
  expect(firstText(mem)).toContain("fake-value")

  const logs = await client.callTool({ name: "swarm_logs", arguments: { swarmId, dir } })
  const parsed = JSON.parse(firstText(logs))
  expect(parsed.messages.some((m: any) => m.body === "hello")).toBe(true)
})
