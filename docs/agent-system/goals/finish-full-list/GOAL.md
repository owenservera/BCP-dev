# GOAL — finish the full integration task list

> Slug: `finish-full-list` · Owner objective: `docs/agent-system/FULL-INTEGRATION-TASK-LIST.md` — finish the full list
> Status: ACTIVE · Stall counter: 0 · Created: 2026-09-28 (ChatGPT steward session, base `f1c971ad`)

## Objective

Drive every row of `docs/agent-system/FULL-INTEGRATION-TASK-LIST.md` to DONE,
BLOCKED (with reason + unblock path), or PARKED/SUPERSEDED (with justification),
verified against the repo per the Durable Completion Gate — never by chat claim.

## Acceptance criteria

- P2.1 full-chain steward→CFA→worker run complete with transcript evidence (P2.2 recorded; P2.3 xhigh validated or fallback recorded).
- S.2 two-process procedure written; S.3 exchange run green; S.4 practice recorded — or each BLOCKED with evidence.
- N.3 Phase-3 input mining complete; N.4 standing rule confirmed operating.
- H.3 CFA-11 counters automated single-host, or BLOCKED with evidence.
- Phase 3 rows started only after P2/S.3 green AND explicit owner go (else remain gated-TODO, not sheepishly DONE).
- Master list §9 log updated every turn; Steward TASKS.md closed out; goal receipt left per SESSION-RESULT-CONTRACT.md.

## Wave log (append-only)

- 2026-09-28 W1: base `f1c971ad` verified clean (2 untracked: `.opencode/command/goal.md`, `local-team.md`, `session-ses_f1fc.md` — auto-exports, leave alone). Delegation↔register↔roster reconciled 10/10, no drift. Dependency assessment: P2.1 executable now (steward-driven CLI probe); S.2, N.3, H.3 INDEPENDENT of P2.1 → parallel wave of 4 units (1 steward + 3 CFA sessions, ≤10 ceiling). P2.2/P2.3 ORDERED after P2.1. Phase 3 BLOCKED (needs P2/S.3 + owner go). Phase 4–5 PARKED.
- 2026-09-28 W1 reconcile: 3/3 CFA receipts collected, each verified vs repo
  (A: 221-line procedure read whole; B: 333-line inputs read whole; C: doc +
  script re-run green, output reproduced verbatim). All reported PARTIAL with
  COMMIT_SHA PENDING-STEWARD-COMMIT per envelope — steward commit below closes
  them. CFA TASKS.md entries left untouched (one-writer rule; closure recorded
  here). Noted: Task-tool leaves returned empty in units B and C (all claims
  direct-read — relevant to P2 leaf-mechanism expectations). Counter-2 registry
  designation deferred to owner (no countable registry exists; inventing one
  would violate no-invented-semantics). Stall counter: 0 (wave changed the tree).
