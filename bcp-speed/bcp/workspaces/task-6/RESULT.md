# Task 6 RESULT — Continuation hook (gated on 1–5 stable)

## Status
PASS (conditional) — 2026-09-22. Gate satisfied: Tasks 1–5 all PASS in
`workspaces/STATE.json` before this built.

## Summary
Project plugin `.opencode/plugins/bcp-ralph.js` (dependency-free, Bun
runtime, auto-loaded from the project plugin dir per docs). On
`session.idle` it shells to `python bcp_tool.py show <BCP_LANE_CAP>` (lane
pinned per session via `BCP_LANE_CAP` + `BCP_AGENT` env); if this agent still
holds the lease and depth < target it re-prompts continuation through
`client.session.prompt`; every other case stays silent (released/merged,
other holder, at-target, unparseable, missing env/ids, errors logged only).
Watchdog (Task 5) stays the only dead-process catcher, as the brief requires.

## Files changed
- `.opencode/plugins/bcp-ralph.js` (new)

## Commands run
- Fetched `opencode.ai/docs/plugins` → project `.opencode/plugins/`, JS/TS,
  Bun, `{project,client,$,directory,worktree}` ctx, `session.idle` in Session
  Events, `event`-hook example. Mechanism CONFIRMED for this version family.
- Fetched `opencode.ai/docs/sdk` → `client.session.prompt({path:{id},
  body:{parts:[{type:text,text}]}})` (+ `noReply` variant), `client.app.log`.
  Shapes used verbatim.
- `node --check .opencode/plugins/bcp-ralph.js` → exit 0.
- Decision-matrix sim (same regex/rank logic): hold-below→PROMPT,
  released→silent, other-holder→silent, at-target→silent.

## Tests run
- Syntax + 4-way decision matrix. PASS.
- Live idle-fire NOT executed (would need a live lane session stopped
  mid-lease; board is parked, all leases released/expired — manufacturing one
  to idle-test would risk state for no signal). Plugin is armed for the next
  live lane: set `BCP_LANE_CAP`/`BCP_AGENT` in the lane session env.
- Idle-storm guard: any session that stops with nothing leasable (no lease,
  merged scope) hits a silent path — asserted in matrix. PASS (logic).

## Known issues
- `session.idle` payload field for the session id is read defensively
  (`properties.sessionID || sessionId || id`); if a version names it
  differently the plugin logs + stays silent instead of prompting wrong.
- First live idle-resume should be observed once lanes resume; if the event
  never fires on this version, Tasks 1–5 carry the automation alone.
