import { createOpencodeClient } from "@opencode-ai/sdk"
import { spawn, spawnSync } from "node:child_process"
import { existsSync, mkdirSync } from "node:fs"
import { dirname, resolve } from "node:path"
import { openDb, resolveDbPath } from "./db.ts"
import { MessageBus } from "./bus.ts"
import { SwarmMemory } from "./memory.ts"
import { SwarmState } from "./state.ts"
import { Orchestrator, type SwarmEvent, type SwarmResult } from "./orchestrator.ts"
import type { SwarmConfig } from "./config.ts"
import { sendNotification } from "./notify.ts"

/**
 * Locate the swarm plugin to inject into the spawned opencode server:
 * 1. OPENCODE_SWARM_PLUGIN env (containers / custom layouts)
 * 2. the source plugin, when running from the repo / npm package
 * 3. swarm-plugin.js next to the executable (compiled-binary releases)
 */
function resolveSwarmPluginPath(): string {
  if (process.env.OPENCODE_SWARM_PLUGIN) return process.env.OPENCODE_SWARM_PLUGIN
  const dev = resolve(import.meta.dir, "../plugin/swarm.ts")
  if (existsSync(dev)) return dev
  const adjacent = resolve(dirname(process.execPath), "swarm-plugin.js")
  if (existsSync(adjacent)) return adjacent
  throw new Error(
    "cannot locate the swarm plugin — set OPENCODE_SWARM_PLUGIN to the path of swarm-plugin.js (shipped alongside the swarm binary)",
  )
}

/**
 * Spawn `opencode serve` in its own process group so close() can kill the whole
 * tree. The SDK's createOpencodeServer only SIGTERMs the direct child, which the
 * opencode binary survives — that leaked CPU-burning servers in production
 * (software-factory finding, 2026-06-11).
 */
/**
 * Terminate the whole process tree.
 *
 * WINDOWS ADAPTATION (VIVIM): upstream used `process.kill(-pid)` exclusively. Negative-PID
 * signalling is POSIX process-group semantics; Windows has no POSIX process group, so those
 * calls fail or no-op and the `opencode serve` child SURVIVES, still holding its port.
 *
 * This was observed rather than assumed: running upstream's own e2e test on this machine
 * orphaned two `opencode serve` processes on ports 24695 and 25694, which had to be killed by
 * exact PID afterwards. That is the exact leak class the upstream comment warns about, reached
 * a different way.
 *
 * Behaviour is otherwise identical to upstream: SIGTERM, wait up to 3s, then SIGKILL, on POSIX.
 * On Windows we use `taskkill /T /F` to take the tree, and additionally target the process that
 * owns the listening socket, because opencode spawns a child that binds the port while the
 * launcher is a different PID.
 */
async function terminateTree(pid: number, port: number, log: (m: string) => void): Promise<void> {
  if (process.platform === "win32") {
    // Prefer the listener: the launcher may already be gone while its child still serves.
    const listenerPids = await findListenerPids(port)
    for (const target of new Set([...listenerPids, pid])) {
      try {
        spawnSync("taskkill", ["/T", "/F", "/PID", String(target)], {
          stdio: "ignore",
          windowsHide: true,
        })
        log(`[swarm] terminated tree pid=${target}`)
      } catch {
        /* already gone */
      }
    }
    return
  }

  const groupAlive = () => {
    try {
      process.kill(-pid, 0)
      return true
    } catch {
      return false
    }
  }
  try {
    process.kill(-pid, "SIGTERM")
  } catch {
    return // group already gone
  }
  for (let waited = 0; waited < 3_000 && groupAlive(); waited += 100) {
    await new Promise((r) => setTimeout(r, 100))
  }
  if (groupAlive()) {
    try {
      process.kill(-pid, "SIGKILL")
    } catch {}
  }
}

/** PIDs owning a LISTEN socket on `port`, found without extra dependencies. */
async function findListenerPids(port: number): Promise<number[]> {
  if (process.platform !== "win32") return []
  try {
    const r = spawnSync(
      "powershell",
      [
        "-NoProfile",
        "-NonInteractive",
        "-Command",
        `(Get-NetTCPConnection -LocalPort ${port} -State Listen -ErrorAction SilentlyContinue | Select-Object -ExpandProperty OwningProcess) -join ','`,
      ],
      { encoding: "utf8", windowsHide: true, timeout: 10_000 },
    )
    const out = (r.stdout ?? "").trim()
    if (!out) return []
    return out
      .split(",")
      .map((s) => Number(s.trim()))
      .filter((n) => Number.isInteger(n) && n > 0)
  } catch {
    return []
  }
}

async function spawnOpencodeServer(opts: {
  port: number
  config: Record<string, unknown>
  timeoutMs?: number
  log?: (m: string) => void
}): Promise<{ url: string; close(): Promise<void> }> {
  const proc = spawn("opencode", ["serve", "--hostname=127.0.0.1", `--port=${opts.port}`], {
    env: { ...process.env, OPENCODE_CONFIG_CONTENT: JSON.stringify(opts.config) },
    detached: true,
    stdio: ["ignore", "pipe", "pipe"],
  })
  proc.unref()

  // WINDOWS ADAPTATION: teardown delegates to terminateTree(), which takes the whole tree and
  // also targets the process that owns the listening socket. Upstream's inline
  // process.kill(-pid) version is retained only for POSIX, inside terminateTree().
  //
  // ORDERING FIX (VIVIM): this cleanup function is declared here, BEFORE the Promise below that
  // schedules the startup timeout, instead of after it. The timeout callback references `close`,
  // so when `close` was declared below the await it sat in the temporal dead zone for the whole
  // startup window. On a startup timeout the callback threw
  // `ReferenceError: Cannot access 'close' before initialization` *instead of cleaning up*,
  // which orphaned the detached `opencode serve` tree. That orphan then held swarm.db open, and
  // the caller's `rmSync(dir)` in the finally failed with EBUSY on Windows — so one leaked handle
  // surfaced as an unrelated-looking cleanup error. Declaring the cleanup first means the timeout
  // path can actually reach it. The error handler and exit handler below also clean up for the
  // same reason.
  const close = async (): Promise<void> => {
    if (!proc.pid) return
    await terminateTree(proc.pid, opts.port, opts.log ?? (() => {}))
  }

  const url = await new Promise<string>((resolvePromise, reject) => {
    const timeout = setTimeout(() => {
      reject(new Error(`timeout waiting for opencode serve to start after ${opts.timeoutMs ?? 30_000}ms`))
      void close()
    }, opts.timeoutMs ?? 30_000)
    let output = ""
    const onData = (chunk: Buffer) => {
      output += chunk.toString()
      const match = output.match(/opencode server listening.*?on\s+(https?:\/\/\S+)/)
      if (match?.[1]) {
        clearTimeout(timeout)
        resolvePromise(match[1])
      }
    }
    proc.stdout?.on("data", onData)
    proc.stderr?.on("data", onData)
    proc.on("error", (err) => {
      clearTimeout(timeout)
      void close()
      reject(err)
    })
    proc.on("exit", (code) => {
      clearTimeout(timeout)
      void close()
      reject(new Error(`opencode serve exited with code ${code}${output.trim() ? `\n${output}` : ""}`))
    })
  })

  return { url, close }
}

export type RunOptions = {
  /** Project directory the agents work in. Default: cwd. */
  dir?: string
  /** Attach to an existing opencode server instead of spawning one. */
  serverUrl?: string
  /** Resume an existing swarm by id. */
  resumeSwarmId?: string
  port?: number
  onEvent?: (e: SwarmEvent) => void
  /** Skip the completion notification (used by tests). */
  quiet?: boolean
}

/** Run a swarm end-to-end: spawn server (with the swarm plugin), orchestrate, report, notify. */
export async function runSwarm(config: SwarmConfig, opts: RunOptions = {}): Promise<SwarmResult> {
  const dir = resolve(opts.dir ?? process.cwd())
  const prevCwd = process.cwd()
  process.chdir(dir) // createOpencodeServer spawns `opencode serve` in cwd
  const db = openDb(resolveDbPath(dir))

  let serverUrl = opts.serverUrl
  let server: { close(): Promise<void> } | null = null
  let result: SwarmResult
  // The spawned server must come down the moment orchestration ends — before the
  // report/notify tail — so nothing in that tail can leave `opencode serve` running.
  try {
    if (!serverUrl) {
      const spawned = await spawnOpencodeServer({
        port: opts.port ?? 21000 + Math.floor(Math.random() * 8000),
        config: { plugin: [resolveSwarmPluginPath()] },
      })
      serverUrl = spawned.url
      server = spawned
    }
    const client = createOpencodeClient({ baseUrl: serverUrl })
    const orchestrator = new Orchestrator(client, db, { onEvent: opts.onEvent })
    result = await orchestrator.run(config, { resumeSwarmId: opts.resumeSwarmId })
  } finally {
    await server?.close()
    process.chdir(prevCwd)
  }

  // WINDOWS ADAPTATION (VIVIM): this Database is opened at the top of runSwarm and upstream never
  // closes it. On POSIX an open file may be unlinked, so the leak is invisible. On Windows the
  // handle keeps swarm.db and its -wal/-shm sidecars locked for the whole run, and any later removal
  // of the run directory fails with EBUSY — that is what tests/e2e.test.ts hits when its `finally`
  // calls rmSync(dir). The close is placed after writeReport (which still reads through it) and
  // inside a finally so a throwing notify cannot keep the handle either.
  try {
    const reportPath = await writeReport(dir, db, result.swarmId)
    if (!opts.quiet) {
      await sendNotification(
        `swarm · ${config.name}`,
        `${result.status} — ${result.agents.map((a) => `${a.name}: ${a.status}`).join(", ")}`,
      )
    }
    return { ...result, reportPath } as SwarmResult & { reportPath: string }
  } finally {
    db.close()
  }
}

// DURABILITY FIX (VIVIM), not a Windows adaptation — this is a real upstream defect on every
// platform. Upstream called `Bun.write(...)` and discarded the promise, returning the path
// immediately, and src/cli.ts then calls `process.exit()`. `process.exit` does not wait for
// pending writes, so the report is truncated. Observed, not theorised: on run
// sw_9695d4c9c66246f3 the run completed and this function returned a path, yet the file was
// 0 bytes. The report is the run's human-readable evidence, so a silently empty evidence artifact
// is worse than a loud failure. Now awaited, and the function is async so callers cannot forget.
export async function writeReport(dir: string, db: ReturnType<typeof openDb>, swarmId: string): Promise<string> {
  const state = new SwarmState(db)
  const swarm = state.getSwarm(swarmId)
  const agents = state.getAgents(swarmId)
  const memory = new SwarmMemory(db, swarmId).list()
  const messages = new MessageBus(db, swarmId)

  const lines = [
    `# Swarm report: ${swarm?.name ?? swarmId}`,
    ``,
    `- id: ${swarmId}`,
    `- status: ${swarm?.status}`,
    `- total cost: $${state.totalCost(swarmId).toFixed(4)}`,
    `- finished: ${new Date().toISOString()}`,
    ``,
    `## Agents`,
    ...agents.flatMap((a) => [``, `### ${a.name} [${a.status}] ($${a.costUsd.toFixed(4)})`, ``, a.result ?? "(no result)"]),
    ``,
    `## Shared memory`,
    ...(memory.length === 0
      ? [``, `(empty)`]
      : memory.flatMap((e) => [``, `### ${e.key} (by ${e.updatedBy ?? "?"})`, ``, e.value])),
    ``,
    `## Messages`,
    ...agents.flatMap((a) =>
      messages.inbox(a.name, { all: true }).map((m) => `- ${m.from} → ${m.to}: ${m.body.slice(0, 200)}`),
    ),
    ``,
  ]
  const reportsDir = `${dir}/.swarm/reports`
  mkdirSync(reportsDir, { recursive: true })
  const path = `${reportsDir}/${swarmId}.md`
  await Bun.write(path, lines.join("\n"))
  return path
}
