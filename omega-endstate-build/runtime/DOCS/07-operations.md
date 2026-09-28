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

## Server lifecycle — Windows-first, and it is not the reference's default

### The reference's owned-server path does not work here

The reference runner spawns its own server and tears it down with **POSIX process-group
signalling**:

```ts
// opencode-swarm/src/runner.ts  (verified in the clone)
detached: true, proc.unref(),
process.kill(-proc.pid, "SIGTERM"),
process.kill(-proc.pid, "SIGKILL"),
```

Windows has no POSIX process group, so negative-PID signalling has no useful meaning there. Our
own experience matches: the launcher PID is not the listener PID, and killing the launcher left a
live server still holding the port.

**Therefore, on Windows, we do not use the owned-server path.** We use the reference's external
server path, which the runner already supports and which is explicitly *not* owned by the run:

```
opencode serve --hostname 127.0.0.1 --port 4096       # started explicitly, long-lived
vivim-swarm run swarm.json --server http://127.0.0.1:4096
```

When `--server` is supplied the runner does not start or close a server, and the server survives
the run. That is the model our long-lived setup uses.

### A long-lived server must be preconfigured

`--server` only changes where the SDK client connects. It does **not** inject the plugin, and it
does **not** set the DB environment on that server. So the long-lived server must already have:

- the swarm plugin loaded;
- `VIVIM_SWARM_DB` (or `OPENCODE_SWARM_DB`) pointing at the **same** database the controller uses.

Getting this wrong produces a run that completes with agents unable to talk, and no error — the
symptom is a run that "works" but where every shared-memory read misses and no message is ever
delivered. Assert it, do not assume it.

The plugin's resolution order is `OPENCODE_SWARM_PLUGIN` → source-relative `plugin/swarm.ts` →
`swarm-plugin.js` beside the executable. Discovery is not automatic everywhere.

**Config is read once at boot.** A long-lived server will not pick up a later edit to
`opencode.json`. This is exactly what bit me: I edited the config, restarted only the launcher
process, and a stale server answered with the old config. After any config change, confirm the
port is actually free before restarting, and confirm the resolved config afterwards.

### Auth when binding beyond loopback

We bind `127.0.0.1`, so no password is required. If anyone binds wider, set
`OPENCODE_SERVER_PASSWORD` first. Documented here so it is not discovered by exposure.

### Windows interrupt caveat — check health, do not assume

An upstream issue reports that on Windows an **attached TUI can terminate `opencode serve`** with
`STATUS_CONTROL_C_EXIT` on certain interrupt/exit paths (Escape, Ctrl+C; reported against
1.18.16). We run **1.18.4**, so whether we are affected is **unverified**.

Treat it as a runtime caveat, not a swarm semantic. After any TUI interrupt:

```powershell
Invoke-RestMethod http://127.0.0.1:4096/global/health
```

and prefer a graceful TUI exit over an interrupt where a long-lived server matters.

### Windows path rules

- JSON config paths: use forward slashes (`C:/work/plugin.swarm.ts`). PowerShell accepts normal
  Windows paths.
- WSL translation: `C:` → `/mnt/c`. Never hand a WSL path to a native Windows opencode, or the
  reverse.
- `notify-send` does not exist here. Desktop notification cannot be assumed; a portable channel
  (ntfy) or nothing is the correct default. The reference helper catches failures, so its absence
  must not wedge a run.

### Resume must reconcile config, or refuse

The reference CLI takes a config file independently of the stored one, and the orchestrator skips
completed agents *by name*. A changed config can alter roster, tasks, models, tool maps, rounds
and budgets, and persisted rows absent from the new config are never deleted — so a resume can
silently run a different swarm than the one recorded.

We therefore compare the supplied config against the stored `config_json` and **refuse an
unacknowledged mismatch**. "Resume" must never be a way to quietly change what a run means.

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
