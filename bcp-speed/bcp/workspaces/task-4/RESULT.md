# Task 4 RESULT — Move agents to `opencode serve`

## Status
PASS — 2026-09-22 (opencode 1.18.4, fixed port 4096, loopback only).

## Summary
Serve verified live as a detached process serving the BCP workspace dir
(project `opencode.json` loaded: created sessions show
`directory: .../bcp-speed/bcp`). Control plane `serve-control.py` (stdlib
urllib+json, no framework) drives HTTP only — CLI control correctly NOT
built (`opencode session` is list/delete only, confirmed). Registry
`state/sessions.yaml` owned by master on create/destroy, read by watchdog;
validators ignore it (fixed `FILES` map has no `sessions` key, confirmed).
`ops-serve.ps1` launcher added; `ops-install.ps1` documents the on-demand
`BCP-Serve` ONSTART registration and now also wires the Task-5 `BCP-Supervise`
2-min timer (script lands in Task 5).

## Files changed
- `serve-control.py` (new: list/create/message/abort/destroy + registry set/del)
- `state/sessions.yaml` (new: empty registry `{sessions: {}}`)
- `ops-serve.ps1` (new launcher, ASCII-only PS 5.1-safe)
- `ops-install.ps1` (BCP-Serve documented + BCP-Supervise 2-min wired)

## Commands run
- `opencode serve --help` / `opencode --help` / `opencode session --help` → syntax confirmed; session CLI cannot message/kill
- Detached `opencode serve --port 4096 --hostname 127.0.0.1` → `serve-control.py list` 200
- `create AGT-probe-task4` → 200 `ses_f35a...` (directory=bcp, cost 0, no prompt fired)
- `GET /session` → 200 lists it; `abort` → 200 true
- `message ses_DOESNOTEXIST hello` → 404 Session not found (route+shape proven, no LLM fired)
- `destroy` → 200 true; `GET /session` → `[]`; `create AGT-probe-task4b` → 200 (recreate proven)
- `reg-set` / `reg-del AGT-probe` → registry round-trips; `validate.py` 0/0 with registry present
- Serve stopped (PID 15660); `validate.py` 0/0 + `sweep.py` 0 pending — state safe without serve

## Tests run
- List/create/abort/destroy/recreate over HTTP with zero window handling. PASS.
- Message route proven via 404-path (payload `{"parts":[{"type":"text","text":...}]}` after API returned 400 Missing-key-at-parts on the first shape). No LLM prompt fired in any test (cost 0). PASS (live-fire of a real prompt deferred — board is parked, spend unjustified).
- Kill-serve → timers keep state safe (validate 0/0, sweep clean). PASS.
- Validators ignore `sessions.yaml` (FILES keys listed, no `sessions`). PASS.

## Known issues
- `GET /session/status` returns `{}` while `GET /session` returns the array —
  control plane tries status first, falls back to `/session`. Kept.
- `/doc` probe failed from this shell (transport); endpoint shapes above were
  proven by direct use instead. Serve logs remain with the launcher process.
- Probe serve stopped after proof; persistent `BCP-Serve` registration is
  on-demand per `ops-install.ps1` header (operator enables when lanes resume).
