# WS-2 — Commons Bootstrap

> Status: **ACTIVE (TEAM-DECIDED)** — unblocked 2026-09-30 by decisions D-TEAM-001 (bootstrap under
> `agent:steward-zcode`), D-TEAM-002 (`user:owen` + human-principal amendment record), D-TEAM-003
> (instruction channel in v1). Owner may override any of these; silence means they stand.
> Owner: STEW-01 (execution) · GOVERNOR-01 (gate discipline)
> Serving workflows: `omega-build` (amendment record, harness work), `omega-verify` (exchange proof)

## Purpose

Stand up the first live principal in Agent Commons and discharge the outstanding Commons gate.
The dashboard (WS-3) is a Commons client and depends on this. Evidence: Board session P1
(amended and adopted); Commons runtime verified at
`AGENTS_CONTEXT/AGENT-COMMONS/runtime/` (send/receive/subscribe, rooms, attention, DMs,
events, Git transport, `commons` CLI); S.3 two-process exchange proved fold-based discovery.

## Entry questions (owner)

- **BQ-1** Authorize the first live Commons bootstrap now, and under which agent_id?
  [Steward recommendation: `agent:steward-zcode`]
- **BQ-2** Owner acts in the Commons as `user:<owner>` — requires a small Commons protocol
  amendment record (Ω law already has `user:<id>` via D-336/D-353/D-412; the Commons protocol
  text has no human principal). [Recommendation: `user:owen`, amendment D-457]
- **BQ-3** Owner response path (replies/instructions) in v1 or a named follow-on?
  [Recommendation: instruction channel in v1 — send via DM/attention; DELIVERY-01 holds that
  deferring it is "a choice dressed as a derivation"]

## Backlog

| # | Item | Notes |
|---|---|---|
| 1 | D-457-style amendment record: human principal in Commons | lineage-preserving, owner-ratified |
| 2 | Mint signing identity under the chosen agent home; push `commons/<agent>` to origin | the bootstrap itself |
| 3 | Smoke exchange: two principals, rooms + attention + DM, fold-based discovery, durable receipts | must cross a process boundary |
| 4 | Record the discharged Commons gate item with evidence | gate ledger update via WS-1 conventions |

## Exit criteria

A live two-principal exchange observed end-to-end with durable receipts; the outstanding
Commons gate item recorded as discharged; `omega-verify` receipt committed.
