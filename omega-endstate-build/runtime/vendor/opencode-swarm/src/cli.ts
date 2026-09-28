#!/usr/bin/env bun
/**
 * swarm — multi-agent orchestration for opencode.
 *
 *   swarm init                      scaffold a swarm.json in the current directory
 *   swarm run <config.json>         run a swarm (spawns its own opencode server)
 *     --resume <swarmId>            resume an interrupted swarm
 *     --server <url>                attach to a running `opencode serve` instead
 *     --dir <path>                  project directory (default: cwd)
 *     --db <path>                   swarm database path (default: <dir>/.swarm/swarm.db)
 *     --events <file>               append machine-readable JSONL events to a file
 *     --json                        machine-readable result on stdout, progress on stderr
 *   swarm status                    list swarms and their agents
 *   swarm logs <swarmId>            show messages + shared memory for a swarm
 *   swarm send <swarmId> <to> <msg> inject a message into a swarm from outside
 *   swarm mcp                       run the MCP server (stdio) for agent clients
 */
import { existsSync } from "node:fs"
import { resolve } from "node:path"
import pkg from "../package.json"
import { openDb, resolveDbPath } from "./db.ts"
import { validateConfig } from "./config.ts"
import { runSwarm } from "./runner.ts"
import { SwarmState } from "./state.ts"
import { SwarmMemory } from "./memory.ts"
import { MessageBus } from "./bus.ts"

const EXAMPLE_CONFIG = {
  name: "feature-swarm",
  model: "openrouter/openai/gpt-4o-mini",
  agents: [
    {
      name: "researcher",
      task: "Survey the codebase, summarize architecture and key files into shared memory under 'architecture'. Tell coder when done.",
      tools: { "*": false, read: true, glob: true, grep: true },
    },
    {
      name: "coder",
      task: "Wait for the researcher's findings (check swarm_inbox / shared memory), then propose an implementation plan in shared memory under 'plan'.",
      tools: { "*": false, read: true, glob: true, grep: true },
    },
  ],
}

function getFlag(args: string[], name: string): string | undefined {
  const i = args.indexOf(name)
  if (i === -1) return undefined
  const value = args[i + 1]
  args.splice(i, 2)
  return value
}

function fail(msg: string): never {
  console.error(`error: ${msg}`)
  process.exit(1)
}

const [command, ...args] = process.argv.slice(2)

// --db applies to every command; env (not a parameter) so the spawned opencode
// server's plugin inherits the same DB.
const dbFlag = getFlag(args, "--db")
if (dbFlag) process.env.OPENCODE_SWARM_DB = resolve(dbFlag)

switch (command) {
  case "init": {
    const path = resolve("swarm.json")
    if (existsSync(path)) fail("swarm.json already exists")
    await Bun.write(path, JSON.stringify(EXAMPLE_CONFIG, null, 2) + "\n")
    console.log(`Wrote ${path} — edit it, then: swarm run swarm.json`)
    break
  }

  case "run": {
    const dir = resolve(getFlag(args, "--dir") ?? process.cwd())
    const serverUrl = getFlag(args, "--server")
    const resumeSwarmId = getFlag(args, "--resume")
    const eventsPath = getFlag(args, "--events")
    const json = args.includes("--json")
    if (json) args.splice(args.indexOf("--json"), 1)
    const configPath = args[0]
    if (!configPath)
      fail("usage: swarm run <config.json> [--resume <id>] [--server <url>] [--dir <path>] [--db <path>] [--events <file>] [--json]")
    if (!existsSync(configPath)) fail(`config not found: ${configPath}`)
    const config = validateConfig(await Bun.file(configPath).json())

    const progress = json ? console.error : console.log
    const eventsFile = eventsPath ? Bun.file(resolve(eventsPath)).writer() : null
    progress(`swarm "${config.name}" — ${config.agents.length} agents — ${dir}`)
    const result = await runSwarm(config, {
      dir,
      serverUrl,
      resumeSwarmId,
      onEvent: (e) => {
        if (eventsFile) {
          eventsFile.write(JSON.stringify({ ts: Date.now(), ...e }) + "\n")
          eventsFile.flush()
        }
        switch (e.type) {
          case "agent-spawned":
            progress(`  [${e.agent}] session ${e.sessionId}`)
            break
          case "agent-turn":
            progress(`  [${e.agent}] turn ${e.round}`)
            break
          case "agent-turn-done":
            progress(`  [${e.agent}] turn ${e.round} done ($${e.costUsd.toFixed(4)}, total $${e.totalCostUsd.toFixed(4)})`)
            break
          case "messages-delivered":
            progress(`  [${e.agent}] ← ${e.count} message(s)`)
            break
          case "agent-done":
            progress(`  [${e.agent}] done ($${e.costUsd.toFixed(4)})`)
            break
          case "agent-skipped":
            progress(`  [${e.agent}] skipped: ${e.reason}`)
            break
          case "agent-failed":
            progress(`  [${e.agent}] FAILED: ${e.error}`)
            break
          case "budget-exceeded":
            progress(`  budget exceeded: $${e.spentUsd.toFixed(4)} >= $${e.budgetUsd}`)
            break
        }
      },
    })
    const exitCode = result.status === "completed" ? 0 : 1
    if (eventsFile) {
      // lets events-file consumers distinguish "swarm done, process exiting" from a linger
      eventsFile.write(JSON.stringify({ ts: Date.now(), type: "cli-exit", code: exitCode }) + "\n")
      await eventsFile.end()
    }
    const report = (result as { reportPath?: string }).reportPath
    if (json) {
      console.log(JSON.stringify({ ...result, reportPath: report }, null, 2))
    } else {
      progress(`\nswarm ${result.swarmId}: ${result.status} (total $${result.totalCostUsd.toFixed(4)})`)
      if (report) progress(`report: ${report}`)
    }
    // backstop: nothing held open by libraries (sockets, child stdio) may keep us alive
    process.exit(exitCode)
  }

  case "status": {
    const json = args.includes("--json")
    const db = requireDb()
    const state = new SwarmState(db)
    const swarms = state.listSwarms()
    if (json) {
      console.log(JSON.stringify(swarms.map((s) => ({ ...s, agents: state.getAgents(s.id) })), null, 2))
      break
    }
    if (swarms.length === 0) {
      console.log("no swarms yet — try: swarm init && swarm run swarm.json")
      break
    }
    for (const s of swarms) {
      console.log(`${s.id}  ${s.name}  [${s.status}]  ${new Date(s.createdAt).toLocaleString()}`)
      for (const a of state.getAgents(s.id))
        console.log(`    ${a.name} [${a.status}] $${a.costUsd.toFixed(4)} ${a.sessionId ?? ""}`)
    }
    break
  }

  case "logs": {
    const swarmId = args[0]
    if (!swarmId) fail("usage: swarm logs <swarmId>")
    const db = requireDb()
    const state = new SwarmState(db)
    const swarm = state.getSwarm(swarmId)
    if (!swarm) fail(`swarm ${swarmId} not found`)
    console.log(`# ${swarm.name} [${swarm.status}]\n`)
    console.log("## Messages")
    const bus = new MessageBus(db, swarmId)
    for (const a of state.getAgents(swarmId))
      for (const m of bus.inbox(a.name, { all: true }))
        console.log(`  ${m.from} → ${m.to}: ${m.body}`)
    console.log("\n## Shared memory")
    for (const e of new SwarmMemory(db, swarmId).list())
      console.log(`  ${e.key} (by ${e.updatedBy ?? "?"}): ${e.value.slice(0, 120)}`)
    break
  }

  case "send": {
    const [swarmId, to, ...rest] = args
    if (!swarmId || !to || rest.length === 0) fail("usage: swarm send <swarmId> <toAgent|*> <message>")
    const db = requireDb()
    const state = new SwarmState(db)
    if (!state.getSwarm(swarmId)) fail(`swarm ${swarmId} not found`)
    const bus = new MessageBus(db, swarmId)
    const roster = state.getAgents(swarmId).map((a) => a.name)
    const body = rest.join(" ")
    if (to === "*") bus.broadcast("user", roster, body)
    else if (roster.includes(to)) bus.send("user", to, body)
    else fail(`no agent "${to}" in swarm — agents: ${roster.join(", ")}`)
    console.log("queued — delivered after the recipient's current turn (while the swarm is running)")
    break
  }

  case "mcp": {
    const { startSwarmMcpServer } = await import("./mcp.ts")
    await startSwarmMcpServer()
    break
  }

  case "--version":
  case "-v":
  case "version":
    console.log(pkg.version)
    break

  case "--help":
  case "-h":
  case "help":
  case undefined:
    console.log("usage: swarm <init|run|status|logs|send|mcp> [--db <path>] — see README")
    break

  default:
    console.error(`unknown command: ${command}`)
    console.error("usage: swarm <init|run|status|logs|send|mcp> — see README")
    process.exit(1)
}

function requireDb() {
  const path = resolveDbPath(process.cwd())
  if (!existsSync(path) && !process.env.OPENCODE_SWARM_DB) fail(`no swarm database at ${path}`)
  return openDb(path)
}
