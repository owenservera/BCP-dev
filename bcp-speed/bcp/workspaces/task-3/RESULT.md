# Task 3 RESULT — Heartbeat via lease renewal (ratification, not a build)

## Status
PASS — 2026-09-22. Heartbeat hourly per redesign; no code changed.

## Summary
Heartbeat already IS lease renewal (hourly renew, 8h TTL, 2h stall, sweep
frees). The only delta: each lane prompt's heartbeat line now reads
"call `bcp_lease_renew` after every discrete unit of work". Appended to all
four lane prompts + `agents/lanes.md` (5 files, hourly wording preserved).
No separate heartbeat file existed — nothing to remove.

## Files changed
- `agents/prompts/lane-a.md`, `lane-b1.md`, `lane-b2.md`, `lane-c.md` (+ renew-per-unit clause each)
- `agents/lanes.md` (+ renew-per-unit clause in Universal rules)

## Commands run
- `rg -n "bcp_lease_renew.*discrete" agents/prompts/lane-*.md agents/lanes.md` → 5 hits
- `rg -in "heartbeat.json|heartbeat.yaml|heartbeat-file|heartbeat_file|.heartbeat" bcp_tool.py bcp_lib.py sweep.py validate.py maintain.ps1 ops-watchdog.ps1 agents/` → empty (no separate mechanism)
- `rg -n "expires_at|leased_at|last_activity|lease_health" bcp_lib.py sweep.py` → liveness only from lease timestamps

## Tests run
- Liveness-source audit: `lease_health` reads `expires_at` + `last_activity`
  (`leased_at` + holder's log events incl. `LEASE_RENEWED`). No other signal
  consulted in `sweep.py` / `bcp_lib.py` / `ops-watchdog.ps1`. PASS.
- Prompt-law presence: 5/5 heartbeat lines carry the renew-per-unit clause. PASS.

## Known issues
- None. Watchdog (Task 5) reads liveness solely from lease timestamps — asserted by code search above.
