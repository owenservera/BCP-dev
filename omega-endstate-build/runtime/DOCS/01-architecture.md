# 01 — Architecture

## The shape

```
┌──────────────────────── opencode serve (one per run, spawned by us) ───────────────────────┐
│  session A (base-01)      session B (ver-01)      session C (arch-01)   session D (seam-01)│
│   cwd = its own worktree    cwd = its own worktree ...                                     │
│        │ vivim_swarm_* tools   │                     │                     │               │
└────────┼──────────────────────┼─────────────────────┼─────────────────────┼───────────────┘
         ▼                      ▼                     ▼                     ▼
   ┌──────────────────── SQLite (WAL, busy_timeout) ────────────────────┐
   │  shared memory  ·  message bus  ·  run + agent state + evidence     │
   └─────────────────────────────────────────────────────────────────────┘
         ▲                              ▲
         │ in-process plugin            │ external process
   ┌─────┴────────────────────────┐   ┌──────────────────────────────────────────────────┐
   │ opencode server process      │   │ orchestrator (bun)                                 │
   │ env: VIVIM_SWARM_DB          │◄──┤ - spawns/tears down the server (process group)    │
   │ config: OPENCODE_CONFIG_      │   │ - allocates one worktree per agent, THEN a session │
   │   CONTENT = {"plugin":[...]}  │   │ - awaits each blocking prompt concurrently         │
   └──────────────────────────────┘   │ - delivers bus messages between turns              │
                                      │ - writes receipts + run report to the repository    │
                                      └──────────────────────────────────────────────────┘
```

## Components

| Path | Responsibility |
|---|---|
| `runtime/swarm.json` | The team declaration: agents, tasks, tool maps, evidence bars, limits |
| `runtime/plugin/vivim-swarm.ts` | opencode plugin. Registers the `vivim_swarm_*` tools. **Exports the plugin and nothing else.** |
| `runtime/src/db.ts` | SQLite schema + typed accessors. WAL, `busy_timeout`, additive migration. |
| `runtime/src/bus.ts` | Message bus. Exactly-once delivery, broadcast, history. |
| `runtime/src/workspace.ts` | Per-agent worktree allocation + isolation proof. |
| `runtime/src/orchestrator.ts` | The run algorithm. Structural `SessionClient` so it is testable without a model. |
| `runtime/src/evidence.ts` | Verdict parsing, receipt writing, run report. |
| `runtime/src/cli.ts` | `run` / `status` / `logs` / `send`. JSONL events, exit-code discipline. |
| `runtime/src/mcp.ts` | MCP surface: `vivim_swarm_run` (fire-and-forget) and bounded `vivim_swarm_wait`. |
| `runtime/test/` | Unit tests with a fake client; one e2e gated on auth. |

## The five invariants

Everything else is detail. These five are the runtime.

1. **One agent, one worktree, one owned branch, allocated before its session exists.**
   No session is created for an agent that has no verified-isolated workspace. Allocation
   failure fails that agent and nothing else.

2. **Evidence or `UNRESOLVED`.** An agent ends its turn by recording a verdict from
   `CONFIRMED | REFUTED | UNRESOLVED` together with the commands that produced it. A turn that
   ends without a verdict is recorded as `UNRESOLVED` — never silently as a pass.

3. **A subagent's verdict is a claim.** The Steward re-verifies it against the repository before
   it becomes team state. The runtime records this duty in every run report.

4. **Delivery is between turns, and bounded.** opencode has no server-push, so a busy agent
   cannot be interrupted. Messaging is a bounded loop in the agent's own turn sequence plus a
   final reconciliation sweep. `maxRounds` is a hard guard, not a hint.

5. **Failures are contained and recorded.** A failed agent is marked failed; the run continues.
   A failed run still produces receipts and a report. A run is never a bare exception.

## Data flow for one run

```
1. read + validate swarm.json  (reject duplicate names, missing task, bad model string)
2. open DB; create run row
3. register every agent row BEFORE any session exists
     (a session with no agent row is unidentifiable to the plugin)
4. for each agent:  allocate worktree -> verify isolation -> record branch/baseSha
5. for each agent with a workspace:  create session (cwd = that worktree); record sessionId
6. prompt every agent CONCURRENTLY. Each prompt call blocks for its turn.
     retry up to 3x on model error with quadratic backoff
7. per agent, in its own loop, up to maxRounds:
     drain inbox -> if messages, mark delivered -> prompt(formatDelivery(msgs))
8. final sweep: deliver messages addressed to agents that already finished,
     APPENDING the reaction so a courtesy reply cannot clobber a settled result
9. mark any agent still running when the wall-clock budget expires as UNRESOLVED
10. write per-agent receipts + RUN.md into omega-endstate-build/runs/<runId>/
11. emit swarm-done; exit 0 only if every agent completed
```

Steps 3–5 are where VIVIM diverges from the reference, which does none of them.

## Why the server is spawned per run rather than shared

- The owner's own opencode is untouched. Its config, its plugins, its sessions stay theirs.
- Plugin config is injected per-spawn via `OPENCODE_CONFIG_CONTENT`, so no tracked config file
  has to carry machine-specific paths.
- Tearing the whole process group down after a run prevents the "leaked CPU-burning server" class
  of bug. On Windows, take the tree with `taskkill /T /F /PID <pid>`.
- A standing server remains available for *interactive* work via an explicit `--server <url>`,
  which is how the Steward itself will attach.

## Data flow for a tool call from an agent

```
agent calls vivim_swarm_send(to="ver-01", ...)
  -> plugin resolves caller: ctx.sessionID -> SwarmState.findAgentBySession()
     (this is what stops an agent impersonating a peer)
  -> no match => friendly "not part of a run" error, no DB write
  -> recipient validated against the roster; unknown name returns the roster
  -> INSERT into messages (delivered_at NULL)
  -> the orchestrator's next round for that agent claims and delivers it
```
