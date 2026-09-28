# STEW-01 — Swarm Core Validation Evidence

> Date: 2026-09-28
> Subject: `omega-endstate-build/runtime/vendor/opencode-swarm` (vendored reference core, Windows-adapted)
> Machine: Windows 10.0.29661, opencode 1.18.4, bun 1.3.14
> Status: core is sound; the first end-to-end run was **invalid as a plugin test** and is corrected below

## 1. Why this exists

The end-state team needs a proven way to run several agents in parallel. Rather than invent one,
the reference `opencode-swarm` core was vendored and adapted only where Windows requires it. This
file records what was actually measured, and — more importantly — what a first run got wrong.

## 2. Unit evidence (valid)

| Check | Result |
|---|---|
| `bunx tsc --noEmit` | clean, exit 0 |
| `bun test tests/` excluding e2e | **50 pass / 0 fail** across 9 files, 8.67s |
| before the adaptations | 46 pass / 4 fail, 3 of them `EBUSY` in `afterEach` with zero assertion failures |

The `EBUSY` class is Windows-specific and now closed:

- `src/mcp.ts` opened the swarm Database in six places and closed none. On POSIX an open file may
  be unlinked, so the leak is invisible. On Windows the handle keeps `swarm.db` and its
  `-wal`/`-shm` sidecars locked, so the test's own `rmSync` of the temp directory failed. Fixed
  with a `withDb` helper that closes in a `finally`.
- `src/runner.ts` `runSwarm` opened a Database and never closed it. Fixed; closed after the
  report is written, inside a `finally`.
- The tests themselves leaked handles (`tests/mcp.test.ts` fake runner, `tests/e2e.test.ts`
  final read). Fixed, otherwise they trip their own teardown.

## 3. Real 2-agent run (first attempt — INVALID as a plugin test)

Run `sw_9695d4c9c66246f3`, 2026-09-28 14:59:19 → 15:02:10, port 29951.

What the run reported:

```
status: "completed", totalCostUsd: 0
analyst  status done  result "WAITING"  cost 0
scout    status done  result ""        cost 0
```

What the database actually contained:

```
memory   : 0 rows
messages : 0 rows
```

### 3.1 Withdrawal

Commit `ff461817` states that "swarm_* tools [are] reachable from a tools-restricted agent,
shared memory written and read back, message bus delivered". **That claim was false.** It was an
inference from the first turn completing, never verified against the artifacts. The database shows
no tool call was ever made. Withdrawn here so no later agent inherits it.

### 3.2 Root cause — my harness, not the core

The validator started a bare `opencode serve` and then attached with `swarm run --server`. That
bypasses the per-spawn `OPENCODE_CONFIG_CONTENT` injection which `runSwarm` performs, so the
**swarm plugin was never loaded** and the `swarm_*` tools did not exist.

This is a silent failure and the most dangerous kind: the orchestrator reported `completed`,
`analyst` dutifully said `WAITING` (exactly what its task instructed when no message has arrived),
and nothing errored. The orchestrator is not at fault — it provably re-enables the coordination
tools over a restrictive map, which `tests/orchestrator.test.ts` asserts. The only way those
tools can be absent is plugin absence.

Two generalisable consequences are recorded as lessons 19 and 20.

## 4. Teardown defect found in the same run (harness)

```
teardown: taskkill listener pid=13668 exit=128
teardown: port 29951 listeners remaining = 13668
```

`taskkill` was treated as successful by its exit code, on a single attempt, without re-reading
the listener PID. It returned 128 and **the port kept accepting**. Killing a parent can leave a
child holding the socket under a PID that was never the one targeted. The child survived until the
owner's manual termination; PID 13668 is now gone and ports 29951/29999 are free.

Fixed in `scripts/validate-swarm.ps1`: `Stop-ServerAndVerify` re-reads the listener PID on every
attempt and defines success as **the port being free**, not as `taskkill` returning zero. Recorded
as lesson 21.

## 5. Upstream durability defect found (not yet patched)

`.swarm/reports/sw_9695d4c9c66246f3.md` is **0 bytes**, even though the run completed and
`writeReport` returned a path.

Cause: `src/runner.ts` `writeReport` calls `Bun.write(path, ...)` **without awaiting it**, and
`src/cli.ts` then calls `process.exit(exitCode)` immediately. `process.exit` does not wait for
pending writes, so the report is truncated. The report is the run's human-readable evidence
artifact, so this is a real durability bug in the reference, not a Windows issue. It also means
the report cannot currently be trusted as proof of anything. Recorded as lesson 23; patching is an
open decision (patch the vendored copy, or require `--json` output as the authoritative record).

## 6. Cost finding

`opencode/space-bunny-free` reports `cost: 0` and `cost_usd: 0` for every turn. Therefore
`SwarmConfig.budgetUsd` — the soft brake — **can never trip against this model**, and
`totalCostUsd` is always 0. Any real spend ceiling for this team needs an outer guard (turn
count, wall-clock, or token accounting via the `agent-turn-done` token counts) rather than
`budgetUsd`. This matches the reference's own warning that providers reporting zero cost never
trip the brake.

## 7. What is now proven vs unproven

**Proven**
- The Windows adaptations work: no orphaned `opencode serve`, no locked run directory. The
  database was re-opened exclusively after the run, which it could not have been under upstream's
  handle lifetime.
- Unit suite 50/50, typecheck clean.
- Real sessions are created against a real `opencode serve`; `session.prompt` blocks for the turn
  and returns text; the orchestrator completes and settles; the result JSON is emitted.
- Server cold start on this machine is ~5.4s, so the 30s default in `spawnOpencodeServer` is not
  the constraint here.

**Unproven — needs one re-run with the corrected harness**
- That the plugin actually loads via `OPENCODE_CONFIG_CONTENT` on this machine.
- That `swarm_memory_set` / `swarm_send` are callable by an agent whose `tools` map is
  `{"*": false}`.
- Turn-boundary message delivery between two agents. This remains the central mechanism of the
  whole design and is still unverified against a live model.

## 8. Harness changes made in response

- `OPENCODE_CONFIG_CONTENT` is now set with an absolute plugin path, and the script **asserts the
  plugin file exists** before starting the server.
- `Stop-ServerAndVerify` retries and verifies by port state.
- A completion marker (`validate.status.json`) is written in the `finally` block. Marker present =
  the run finished *and* teardown completed. Marker absent = still running or killed. This is the
  only trustworthy answer to "did it finish?" once the Steward session is gone.
- The script is parse-checked before it is ever launched.
