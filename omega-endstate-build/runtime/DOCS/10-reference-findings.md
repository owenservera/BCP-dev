# 10 — Reference Findings

> What reading `github.com/ibraheem-111/opencode-swarm` in full actually taught us.
> This document exists because the first version of this runtime was built on assumptions that
> turned out to be wrong. Those mistakes are recorded here so they are not repeated.

## The four corrections

### 1. `session.prompt` BLOCKS for the turn

I assumed prompting was fire-and-forget and that I would need to poll session state to detect
idle, then inject messages into a free agent.

**Reality:** `client.session.prompt()` resolves only when the turn is complete, and returns the
turn's `parts` plus `info` (cost, token counts, and any model-level error). The reference
orchestrator simply `await`s it.

**Consequence:** the entire "detect busy → deliver → poll" loop I wrote in the first
`orchestrator.ts` was unnecessary and based on a fabricated idle-detection contract. Parallelism
comes from `Promise.all` over agents, each holding its own blocking prompt call. Message
delivery is a *loop inside each agent's own turn sequence*, not an external watcher.

### 2. Server config is injected by ENV, not by editing opencode.json

I hit a real, confusing failure: opencode resolves relative `plugin` paths against the
directory containing `opencode.json` and **strips leading `../`**, so a plugin living in the
project home cannot be referenced relatively at all. My config edit silently produced a path
that did not exist, and the plugin never loaded — with no error.

**Reality:** the reference never touches the user's `opencode.json`. It spawns the server with
`OPENCODE_CONFIG_CONTENT` set to a JSON blob containing `{"plugin":[<path>]}`. The spawned server
gets exactly the config the swarm needs; the owner's own config is untouched.

**Consequence:** my `.opencode/opencode.json` edit, the `../` path, and the shim file were all
the wrong mechanism and have been reverted. The plugin path is now passed per-spawn.

### 3. A plugin module must export ONLY the plugin

Documented in the reference's `plugin/notify.ts`:

> opencode treats **every export of a plugin module as a plugin**, so this file must export
> nothing but the plugin itself.

My plugin exported `renderDeliveryPrompt` alongside the plugin default. That would have
registered a second, malformed plugin. Any helper the plugin needs must live in `src/` and be
imported, never re-exported from the plugin file.

### 4. Kill the process *group*, not the child

The reference spawns `opencode serve` with `detached: true` and tears it down with
`process.kill(-pid)`, documenting why:

> The SDK's `createOpencodeServer` only SIGTERMs the direct child, which the opencode binary
> survives — that leaked CPU-burning servers in production (software-factory finding, 2026-06-11).

I independently rediscovered the same fact as "the launcher PID is not the listener PID": I
killed the launcher, the child kept holding the port, and a stale server answered `/config`
from an old config. Both observations are the same bug. On Windows, the equivalent is
`taskkill /T /F /PID <pid>` to take the tree, or targeting the process that actually owns the
listening socket.

## Smaller things worth stealing verbatim

| Pattern | Why it matters |
|---|---|
| `SessionClient` is a **structural type** | Tests inject a fake with two methods and no server, no model, no network. This is why their orchestrator is unit-testable. |
| `SWARM_TOOLS` force-enabled over any `tools` map | A restrictive map like `{"*": false}` must never strip coordination tools, or agents become mute. Covered by a test. |
| `3` retries with **quadratic** backoff, and model errors read from `result.data.info.error` | Distinguishes a model-level failure from a transport failure. Both are real and need different messages. |
| `PRAGMA busy_timeout = 5000` | The DB is written by the in-process plugin *and* by the external orchestrator. Without a busy timeout, concurrent writers get `SQLITE_BUSY`. My first `db.ts` omitted this. |
| `upsertAgent` uses `COALESCE(?, col)` with the **raw param**, not `excluded.col` | On insert the default status is `'created'`; using `excluded.status` silently reset every existing agent to `created` on any partial update. Explicitly commented in their source. My first version overwrote everything and had the opposite bug. |
| `migrate(db)` for schema evolution | Additive `ALTER TABLE` on open. |
| JSONL **events file** with `flush()` per event, terminated by a `cli-exit` sentinel | This is the real answer to "realtime comms without stalling": a tailable event stream, plus a sentinel so a consumer can tell "finished and exiting" from "hung". |
| `swarm_run` is fire-and-forget; `swarm_wait` is capped (max 120s) | Never block the caller indefinitely. `Promise.race` against a timeout, then report current status. |
| `process.exit(code)` backstop after the run | Libraries can hold sockets and child stdio open. Exit 0 only on `completed`. |
| Notification channels are individually timeout-capped | A hung `notify-send` (headless, no dbus) must never wedge the agent loop. |
| `notify-send` is Linux-only | On Windows that spawn fails. A portable channel (ntfy, or nothing) is the correct default for this machine. |

## Gaps in the reference that we must close ourselves

1. **No workspace isolation.** All agents share one directory. This is unacceptable here and is
   our primary divergence (`05-workspace-isolation.md`).
2. **No evidence bar or verdict.** An agent's returned text is its result; nothing distinguishes
   a verified claim from an unverified one, and nothing forces an agent to say `UNRESOLVED`
   rather than guess (`06-evidence.md`).
3. **No durable repository record.** Results live in SQLite (`.swarm/swarm.db`) and a gitignored
   report. A fresh Steward cannot reconstruct a run from committed files (`06`).
4. **No budget in wall-clock terms.** `budgetUsd` is a soft spend brake; a free provider reports
   zero cost and never trips it, so a hung run is unbounded. We need a wall-clock budget per
   agent and per run (`02-orchestration.md`).
5. **No self-evolution path.** Nothing lets an agent propose a change to its own scope or to the
   team shape, and nothing records accept/reject reasons.

## One documentation caveat

The reference README's claim that "messages are push-delivered: when an agent finishes a turn,
anything sent to it arrives as a new prompt" is true but easy to over-read. Reading
`orchestrator.ts` shows the delivery is a bounded loop *inside* `runAgent`, plus a final
reconciliation sweep for messages that arrived after an agent finished. There is no external
push watcher racing a running agent. Both the reference and the design doc now say so precisely,
because a reader who believes the stronger claim will build a watcher that cannot work.
