# WS-3 — Team Dashboard v1 (operational control panel)

> Status: **ACTIVE after WS-2 (TEAM-DECIDED)** — unblocked 2026-09-30 by D-TEAM-004 (standalone in
> `tooling/`), D-TEAM-005 (parallel sequencing), D-TEAM-006 (D-458 placement record), D-TEAM-003
> (instruction path). Dependency on WS-2 remains real evidence, not a human gate.
> Owner: DELIVERY-01 (build) · CEO-01 (scope)
> Serving workflows: `omega-build` (corridors), `omega-verify` (acceptance)

## Purpose

The owner's requirement (2026-09-29): a functional realtime team dashboard — see the full team
commons, individual rooms, live activity; engage and respond to teams' questions; leave
instructions — **the owner as a roster member**. Primary interface stays ZCode; the dashboard
is the operational control panel.

## Board shape (P1/P2 as amended)

v1 leads with the Commons bootstrap (WS-2), then the read-only projection, with the owner
instruction channel alongside. Placement: standalone local web surface in `tooling/`
(re-opens nothing); the Tauri OS shell remains the future host if the OS lane reopens —
the Governor's advisory veto on using the shell now is recorded in the minutes.

## Entry questions (owner)

- **BQ-4** Standalone surface or the landed Tauri OS shell as host?
  [Recommendation: standalone in `tooling/`, migrate later if the OS lane reopens]
- **BQ-5** Sequenced behind the red gate stages or in parallel?
  [Recommendation: parallel — WS-3 touches no gate-gated code; round-close stays gated on green]
- **BQ-6** Governance: a decision record establishing "a UI surface may live in tooling"
  (D-414/D-422 precedents are CLI rounds) or plugin governance?
  [Recommendation: decision record D-458]

## Backlog (v1 slice)

| # | Item | Notes |
|---|---|---|
| 1 | D-458 decision record (placement + governance) | via WS-1 conventions |
| 2 | Dashboard server + UI reading Commons state: rooms, attention, DMs, event stream, roster, agent-home queues | Git transport refs + filesystem watch; reuse `commons` CLI/runtime |
| 3 | Realtime rendering: live activity per room/agent; the owner visible as a roster member | polling/WebSocket on the refs + event files |
| 4 | Owner instruction path: compose → Commons DM/attention to the target agent → agent pickup loop visible in the dashboard | the operational control panel, BQ-3 |
| 5 | Acceptance: owner sees live rooms and sends one instruction that an agent acts on, with the full loop visible | `omega-verify` receipt |

## Exit criteria (v1)

Acceptance item 5 demonstrated and verified; the daily standup and Board minutes link into the
dashboard's surfaces; no gate red attributable to this lane.
