# Task 5 RESULT — External watchdog (session restart, outside all LLM sessions)

## Status
PASS — 2026-09-22. Plain script, zero LLM calls, no dependency on any agent session.

## Summary
New `ops-supervise.ps1` (2-min `BCP-Supervise` timer, wired in `ops-install.ps1`
in Task 4) keeps `BCP-Watchdog` untouched. Per cycle: stale ACTIVE leases via
shared `bcp_lib.lease_health` (same expires_at + stall math as sweep, default
2h = 2x the hourly heartbeat cycle) → (a) `lease release --note ...status=failed`
on the tool path, (b) `failure add` requeue (`applies_to` the cap), (c)
agent→session via `state/sessions.yaml` then abort+delete+recreate over the
Task-4 serve API with the lane inbox pointer re-issued. Master watched by the
same math (log signals from `AGT-coord,AGT-master` within N=2h); resume
context is state itself (leases+inbox+discoveries) — no `RESUME.md`.

## Files changed
- `ops-supervise.ps1` (new, `-DryRun` supported, ASCII-only PS 5.1-safe)
- `ops-install.ps1` (Task-4 edit: `BCP-Supervise` MINUTE/2 wired + status + BCP-Serve docs)

## Commands run
- `powershell -NoProfile -ExecutionPolicy Bypass -File ops-supervise.ps1 -DryRun` → no stale actives, master live, done
- Throwaway `BCP_ROOT` copy + injected stale `FAM-09.1` (AGT-c1, leased 10:00Z) → `lease_health` = stalled 8h15m → `lease release --note status=failed` OK → `failure add` OK FAIL-002 → `validate.py` 0/0 → temp removed
- Live `validate.py` after: 49 caps, 8 leases, 99 events, 0/0 (untouched)

## Tests run
- Live dry-run no-op correctness (parked board → zero false positives). PASS.
- Stale detection + release-as-failed + requeue on throwaway copy, single
  release + single failure (no loss, no duplication). PASS.
- Session-restart code path: registry lookup + abort/destroy/create/message
  functions are the Task-4-proven `serve-control.py` calls (live-fired there);
  no registry entry → lease requeued, restart skipped by design. PASS (logic).
- Master quiet-path: same timestamp math, resume-from-state documented. PASS (logic).
- Full kill-worker→auto-restart within 2 min end-to-end NOT live-fired (no
  live workers exist — board parked; firing one to kill it would manufacture
  risk for no signal). Detection, requeue, and restart primitives each proven
  separately above + Task 4.

## Known issues
- Serve is currently stopped (Task-4 probe torn down); restart branch logs
  and continues when serve is down — timers keep state safe regardless.
- `BCP-Supervise` registration applies on next `ops-install.ps1` run (operator
  runs it when lanes resume; current timers verified Ready: Maintain/Commit/Watchdog).
