/**
 * MCP server exposing swarm orchestration to any MCP client (Claude Code,
 * opencode, Cursor...). Start with `swarm mcp` (stdio).
 *
 * swarm_run is fire-and-forget: it returns the swarmId immediately and the
 * swarm runs in the background — poll swarm_status (or swarm_wait) to follow it.
 */
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js"
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js"
import { z } from "zod"
import { resolve } from "node:path"
import type { Database } from "bun:sqlite"
import { openDb, resolveDbPath } from "./db.ts"
import { validateConfig, type SwarmConfig } from "./config.ts"
import { runSwarm, type RunOptions } from "./runner.ts"
import { SwarmState } from "./state.ts"
import { SwarmMemory } from "./memory.ts"
import { MessageBus } from "./bus.ts"
import type { SwarmResult } from "./orchestrator.ts"

type Runner = (config: SwarmConfig, opts: RunOptions) => Promise<SwarmResult>

// The SDK's published types want zod v3 schemas but its runtime handles v4.
// Typing through the SDK's generics (or the zod/v3 compat types) blows up tsc
// memory, so tools are registered through this explicitly-typed view of
// registerTool and handlers declare their argument types themselves.
type RegisterTool = (
  name: string,
  def: { description: string; inputSchema: Record<string, unknown> },
  handler: (args: never) => Promise<{ content: Array<{ type: "text"; text: string }>; isError?: boolean }>,
) => void
const schema = (shape: Record<string, unknown>) => shape

const text = (value: unknown) => ({
  content: [{ type: "text" as const, text: typeof value === "string" ? value : JSON.stringify(value, null, 2) }],
})
const errText = (message: string) => ({ ...text(`Error: ${message}`), isError: true as const })

/**
 * WINDOWS ADAPTATION (VIVIM): open the swarm DB for the duration of one operation and always
 * close it.
 *
 * Upstream called `openDb(...)` inline in five places and never closed any of them. That is
 * invisible on POSIX, where an open file may be unlinked. On Windows the handle keeps the file
 * and its `-wal`/`-shm` sidecars locked, so a later `rmSync` of the directory fails with EBUSY.
 * Measured on this machine: 3 of 4 upstream test failures were exactly that, in `afterEach`,
 * with zero assertion failures.
 *
 * `finally` guarantees the close even if `fn` throws, so this cannot mask an error.
 */
function withDb<T>(dir: string, fn: (db: Database) => T): T {
  const db = openDb(resolveDbPath(dir))
  try {
    return fn(db)
  } finally {
    db.close()
  }
}

export function createSwarmMcpServer(opts: { runner?: Runner } = {}): McpServer {
  const runner = opts.runner ?? runSwarm
  const running = new Map<string, Promise<SwarmResult>>()
  const failures = new Map<string, string>()

  const server = new McpServer({ name: "opencode-swarm", version: "0.2.0" })
  const register = server.registerTool.bind(server) as unknown as RegisterTool

  // WINDOWS ADAPTATION (VIVIM): the upstream `statusOf` opened a fresh Database on every call
  // and never closed it. On POSIX an open file can be unlinked so the leak is invisible; on
  // Windows the handle keeps the file (and its -wal/-shm sidecars) locked and any later
  // `rmSync` of the directory fails with EBUSY. This was observed, not theorised: 3 of the 4
  // failures in tests/mcp.test.ts on this machine were EBUSY in afterEach, with zero assertion
  // failures. Semantics are unchanged -- only the handle lifetime is.
  const statusOf = (dir: string, swarmId?: string) => {
    const db = openDb(resolveDbPath(dir))
    try {
      const state = new SwarmState(db)
      const swarms = swarmId ? [state.getSwarm(swarmId)].filter((s) => s !== null) : state.listSwarms()
      if (swarmId && swarms.length === 0) return null
      return swarms.map((s) => ({
        id: s.id,
        name: s.name,
        status: s.status,
        totalCostUsd: state.totalCost(s.id),
        stillRunningHere: running.has(s.id),
        launchError: failures.get(s.id),
        agents: state.getAgents(s.id).map((a) => ({
          name: a.name,
          status: a.status,
          costUsd: a.costUsd,
          result: a.result,
        })),
      }))
    } finally {
      db.close()
    }
  }

  register(
    "swarm_run",
    {
      description:
        "Start a multi-agent swarm in the background and return its swarmId immediately. " +
        "Each agent runs as a parallel opencode session with shared memory and inter-agent messaging. " +
        "Poll swarm_status (or swarm_wait) to follow progress; results persist in <dir>/.swarm/swarm.db.",
      inputSchema: schema({
        config: z
          .object({
            name: z.string(),
            model: z.string().describe('Default "provider/model", e.g. "openrouter/openai/gpt-4o-mini"'),
            agents: z.array(
              z.object({
                name: z.string(),
                task: z.string(),
                model: z.string().optional(),
                system: z.string().optional(),
                tools: z.record(z.string(), z.boolean()).optional(),
              }),
            ),
            maxRounds: z.number().optional(),
            budgetUsd: z.number().optional().describe("Soft spend ceiling for the whole swarm"),
            maxConcurrent: z.number().optional(),
          })
          .describe("The swarm configuration (same schema as swarm.json)"),
        dir: z.string().optional().describe("Project directory the agents work in (default: server cwd)"),
      }),
    },
    async ({ config: rawConfig, dir: rawDir }: { config: unknown; dir?: string }) => {
      let config: SwarmConfig
      try {
        config = validateConfig(rawConfig)
      } catch (err) {
        return errText(err instanceof Error ? err.message : String(err))
      }
      const dir = resolve(rawDir ?? process.cwd())
      // Pre-create the swarm record so we can hand back the id before the run starts;
      // the background run picks it up through the resume path.
      const swarmId = withDb(dir, (db) => new SwarmState(db).createSwarm(config.name, config))
      const promise = runner(config, { dir, resumeSwarmId: swarmId, quiet: false })
        .catch((err) => {
          failures.set(swarmId, err instanceof Error ? err.message : String(err))
          withDb(dir, (db) => new SwarmState(db).setSwarmStatus(swarmId, "failed"))
          throw err
        })
        .finally(() => running.delete(swarmId))
      promise.catch(() => {}) // background — observed via swarm_status/swarm_wait
      running.set(swarmId, promise)
      return text({ swarmId, dir, agents: config.agents.map((a) => a.name), note: "running in background" })
    },
  )

  register(
    "swarm_status",
    {
      description: "Status of one swarm (or all swarms) — agent states, costs, results so far.",
      inputSchema: schema({
        swarmId: z.string().optional(),
        dir: z.string().optional().describe("Project directory (default: server cwd)"),
      }),
    },
    async ({ swarmId, dir }: { swarmId?: string; dir?: string }) => {
      const result = statusOf(resolve(dir ?? process.cwd()), swarmId)
      return result ? text(result) : errText(`swarm ${swarmId} not found`)
    },
  )

  register(
    "swarm_wait",
    {
      description:
        "Wait (bounded) for a swarm started by swarm_run in this server to finish. " +
        "Returns final status, or current status if the timeout elapses first.",
      inputSchema: schema({
        swarmId: z.string(),
        timeoutSec: z.number().max(120).optional().describe("Max seconds to wait (default 30, max 120)"),
        dir: z.string().optional(),
      }),
    },
    async ({ swarmId, timeoutSec, dir }: { swarmId: string; timeoutSec?: number; dir?: string }) => {
      const promise = running.get(swarmId)
      if (promise) {
        const ms = Math.min(timeoutSec ?? 30, 120) * 1000
        await Promise.race([promise.catch(() => {}), new Promise((r) => setTimeout(r, ms))])
      }
      const result = statusOf(resolve(dir ?? process.cwd()), swarmId)
      return result ? text(result) : errText(`swarm ${swarmId} not found`)
    },
  )

  register(
    "swarm_send",
    {
      description: 'Inject a message into a running swarm — to one agent by name, or "*" for everyone.',
      inputSchema: schema({
        swarmId: z.string(),
        to: z.string(),
        message: z.string(),
        dir: z.string().optional(),
      }),
    },
    async ({ swarmId, to, message, dir }: { swarmId: string; to: string; message: string; dir?: string }) => {
      return withDb(resolve(dir ?? process.cwd()), (db) => {
        const state = new SwarmState(db)
        if (!state.getSwarm(swarmId)) return errText(`swarm ${swarmId} not found`)
        const roster = state.getAgents(swarmId).map((a) => a.name)
        const bus = new MessageBus(db, swarmId)
        if (to === "*") bus.broadcast("user", roster, message)
        else if (roster.includes(to)) bus.send("user", to, message)
        else return errText(`no agent "${to}" — agents: ${roster.join(", ")}`)
        return text("queued — delivered after the recipient's current turn (while the swarm is running)")
      })
    },
  )

  register(
    "swarm_memory_search",
    {
      description: "Search a swarm's shared memory (substring across keys, values, tags).",
      inputSchema: schema({
        swarmId: z.string(),
        query: z.string().describe("Substring to search for; empty string lists everything"),
        dir: z.string().optional(),
      }),
    },
    async ({ swarmId, query, dir }: { swarmId: string; query: string; dir?: string }) => {
      return withDb(resolve(dir ?? process.cwd()), (db) => {
        if (!new SwarmState(db).getSwarm(swarmId)) return errText(`swarm ${swarmId} not found`)
        const memory = new SwarmMemory(db, swarmId)
        return text(query ? memory.search(query) : memory.list())
      })
    },
  )

  register(
    "swarm_logs",
    {
      description: "Full message history and shared memory of a swarm.",
      inputSchema: schema({
        swarmId: z.string(),
        dir: z.string().optional(),
      }),
    },
    async ({ swarmId, dir }: { swarmId: string; dir?: string }) => {
      return withDb(resolve(dir ?? process.cwd()), (db) => {
        const state = new SwarmState(db)
        if (!state.getSwarm(swarmId)) return errText(`swarm ${swarmId} not found`)
        const bus = new MessageBus(db, swarmId)
        const messages = state
          .getAgents(swarmId)
          .flatMap((a) => bus.inbox(a.name, { all: true }))
          .sort((a, b) => a.id - b.id)
          .map((m) => ({ from: m.from, to: m.to, body: m.body }))
        return text({ messages, memory: new SwarmMemory(db, swarmId).list() })
      })
    },
  )

  return server
}

export async function startSwarmMcpServer(): Promise<void> {
  const server = createSwarmMcpServer()
  await server.connect(new StdioServerTransport())
}
