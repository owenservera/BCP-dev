# 07 — Operations

## CLI

```
vivim-swarm run    [config.json] [--server <url>] [--dir <path>] [--db <path>]
                  [--events <file.jsonl>] [--json]
vivim-swarm status [--json]
vivim-swarm logs   <runId>
vivim-swarm send   <runId> <toAgent|*> <message>
vivim-swarm mcp                      # stdio MCP server
```

Conventions, each of which exists for a reason:

- **`--db` is applied as an env var, not a parameter.** The spawned server's plugin must resolve
  the same DB the orchestrator writes. There is no other way to share a path across a process
  boundary here.
- **Result JSON on stdout, progress on stderr.** So `--json` output is pipeable while a human
  still sees what is happening.
- **Exit 0 only when every agent completed.** `failed` or `stopped` exits 1. A partial run that
  exits 0 is a lie a CI would believe.
- **`process.exit(code)` as a backstop.** Sockets and child stdio can hold the process open after
  the work is done.

## Events — the realtime channel

`--events <file.jsonl>` appends one JSON object per line, flushed per line, terminated by:

```json
{"ts":…,"type":"cli-exit","code":0}
```

The sentinel matters. A tailer reading the file cannot otherwise distinguish "run finished,
process exiting" from "the writer died mid-run" — the same ambiguity as trusting an exit code.

Event types are listed in `02-orchestration.md`.

## Never block the Steward

This is a hard operating rule, learned the hard way (see `10-reference-findings.md`).

- Long work is **detached**, not awaited. Dispatch returns in well under a second.
- Every wait is **bounded**, and the bound is explicit.
- Prefer a too-strict timeout that you extend, over one that hangs the session.
- Move anything that might block into a `.ps1`/`.bat` and invoke it in one short line, so the
  long-running logic is never inside an interactive tool call.
- `vivim_swarm_wait` (MCP) is capped at 120 s and returns current status on timeout.

## Server lifecycle

Spawned per run:

```
spawn("opencode", ["serve","--hostname=127.0.0.1","--port=<port>"], {
  env: { ...process.env, VIVIM_SWARM_DB, OPENCODE_CONFIG_CONTENT: … },
  detached: true, stdio: ["ignore","pipe","pipe"]
})
```

Teardown kills the **process group**, not the direct child. The SDK's own
`createOpencodeServer` only signals the child and opencode survives it — a documented
production failure ("leaked CPU-burning servers"). On Windows, take the tree with
`taskkill /T /F /PID <pid>`; on POSIX, `process.kill(-pid, …)`.

### Windows PID discipline

Three traps, all hit in practice:

1. **The launcher PID is not the listener PID.** `opencode serve` spawns a child that binds the
   port. Record the *listener*.
2. **Never terminate by process image name.** `Get-Process -Name opencode | Stop-Process -Force`
   kills the owner's interactive sessions and the Steward's own session. I did exactly this and
   took down every opencode window on the machine. Only ever target a PID that was recorded when
   the process was started.
3. **A stale server on the port will happily answer from an old config.** After a "restart",
   confirm the port is actually free before starting, or you will debug the wrong process.

Discover the URL by matching the server's own startup line (`opencode server listening ... on
<url>`) rather than by assuming a fixed port, and choose a random high port to avoid colliding
with anything already running.

## MCP surface

For driving swarms from any MCP client, and for the Steward itself:

| Tool | Semantics |
|---|---|
| `vivim_swarm_run` | **Fire-and-forget.** Pre-creates the run row, returns `swarmId` immediately, run proceeds in background. |
| `vivim_swarm_status` | Runs and agents with status, verdicts, cost, results so far, plus `launchError`. |
| `vivim_swarm_wait` | Bounded wait (default 30 s, max 120 s) then report current status either way. |
| `vivim_swarm_send` | Inject a message from outside the swarm, mid-run. |
| `vivim_swarm_memory_search` | Substring search; empty query lists everything. |
| `vivim_swarm_logs` | Full message history + shared memory. |

`vivim_swarm_run` pre-creating the run row before returning the id is what makes the id usable
immediately; the background run picks it up through the resume path.

## Notifications (optional)

`plugin/notify.ts` listens for `session.idle`, `session.error`, `permission.updated` and can
notify. Every channel is individually timeout-capped so a hung notifier can never wedge the
agent loop.

**On this machine `notify-send` does not exist** (it is Linux). A portable push channel (ntfy) or
nothing is the correct default. Do not assume desktop notification works on Windows.

## What is deliberately not built

- No TUI. CLI plus committed markdown.
- No daemon. Each run owns its server and tears it down.
- No automatic retirement of worktrees. Retirement is a reviewed Steward decision.
- No retry across process restarts. `resume` reuses sessions; it does not reconstruct reasoning.
