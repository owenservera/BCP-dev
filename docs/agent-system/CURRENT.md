# CURRENT.md — Durable Shared Working-Memory Bridge

> **Classification: DERIVED — CURRENT**
> **Rule:** small enough to load every session; entries point to evidence, not evidence.
> **Coordinator-owned:** agents propose via outbox, never direct-edit in flight.
> **Updated:** 2026-09-24

## CURRENT REPOSITORY TIP

- Main currently contains the cooperative agent-system substrate, P1 portfolio baseline, merged WS-001 DIR-001 dogfood evidence, the merged P1-02 baseline-freeze (PR #6: REGISTERED charter + setup prompt durable; workstream NOT PROVEN), the IMPL-03 roster dedup (PR #7), and the P1-02 drift sweep (PR #8: denominators, hands-off lists, stale numbers).
- Current substantive P1-02 baseline marker: `537d987` (PR #8 merge; incorporates PR #6 baseline-freeze onto `2373cfd` base + PR #7 roster dedup); prior P1-01 PROVEN reconciliation merge marker `de147d6` retained as history (both closers green; before that `fde4c5b` ChatGPT line, `58bd0d7` MULTI-AGENT line).
- Untracked surfaces remain another workstream's surface: `bcp-algos/`, `setupdocs.zip`. Do not touch without owner. Ω `docs/architecture/` + `examples/plugin-echo2/` are now tracked on main (`a528ffd` checkpoint) but unratified — see `docs/cleanup/PROMPT-4-CHECKPOINT.md` + C13. `docs/REPO-CLEANUP-PROMPT-V2.md` is untracked with UNKNOWN status; triage pending owner decision.
- Board remains parked; BCP state must be written only through `bcp_tool.py`.

## CURRENT PROGRAM / P1 PORTFOLIO

The program now has nine P1 workstreams registered in
`docs/agent-system/P1-WORKSTREAM-PORTFOLIO.md` and `WORKSTREAMS.md`:

1. Cooperative Agent System
2. Repository Truth, Cleanup & Drift
3. Ω Ontology, Evidence & Representation
4. Ω Self-Knowledge & Context
5. Ω Plugin Kernel & Runtime
6. Ω Agency, Execution & Governance
7. Provider Intelligence & Autonomous Maintenance
8. Forge / VIVIM Harvest & Migration
9. Ω Integration & End-to-End Proof

Only P1-01 / WS-001 currently has an implementation substrate. The other eight
are registered boundaries, not active implementation programs, and intentionally
have no setup prompts yet.

## CURRENT ARCHITECTURAL MODEL

- VIVIM (assay) → BCP (forge) → Ω (land) → final VIVIM.
- Ω = everything-is-a-plugin under B1–B5; Chrome-master/slave-only v1; current law
  remains the Ω ratified decision system and gate.
- P1-01 is development-control infrastructure across all workstreams.
- P1-02 is the repository truth/drift function across all workstreams.
- P1-03..P1-06 define the Ω computational core.
- P1-07 joins provider experimentation and autonomous maintenance into one lifecycle.
- P1-08 extracts proven value from the mine/forge.
- P1-09 continuously challenges composition and eventually proves the whole system.

## WHAT IS ESTABLISHED

- Cooperative substrate: SYSTEM, ROSTER, WORKSTREAMS, CURRENT, CONTEXT-INDEX,
  CHATGPT-BOOT, transcript/packet/handoff/envelope conventions and falsifiers.
- P1 portfolio charter and nine workstream boundaries.
- WS-001 DIR-001 dogfood evidence is merged: 7 GREEN, 2 PARTIAL, 1 NOT-PROVEN.
- PKT-002 closes PKT-001's provenance hash gap and preserves explicit reader mappings.
- D-DOG-01 is fixed at the integration layer: canonical files must preserve/refresh packet and handoff backward links.
- F-AGENT-MULTI-AGENT is PROVEN: IMPL-03 sealed run (HANDOFF-005 rubric 6/6) integrated — 8-link chain re-verified ALIVE, cold-start path walks clean.
- F-AGENT-CROSS-CHATGPT is PROVEN: genuinely fresh session run (closer §3 rubric 6/6 countersigned) — transcript + packet + handoff deposited and merged.
- P1-01 is PROVEN: tally 7 GREEN / 1 PARTIAL / 2 PROVEN (residual: COMPACTION formal GREEN re-rule owed, cure integrated at `d8cb795`).
- The SYSTEM §13 tip-marker/link-maintenance amendment is accepted into the current procedure.
- Earlier proposed `vivim.self` WS-002 is folded into P1-04 / WS-004; it is not a
  competing workstream.

## ACTIVE WORK

- WS-001 / P1-01: Phase 2 dogfood completed; verdict PROVEN (7 GREEN / 1 PARTIAL / 2 PROVEN; residual: COMPACTION formal re-rule owed).
- Closed proofs: MULTI-AGENT independence — IMPL-03 continued from HANDOFF-004 alone (PKT-005 + HANDOFF-009 + `outbox/IMPL-03/ITEM-001-evidence-independent-verification.md`); CROSS-CHATGPT continuity — genuinely fresh session run (transcript + `packets/PKT-004-cross-chatgpt-closer-findings.md` + `handoffs/HANDOFF-007.md`, §3 rubric 6/6).
- P1-02 / WS-002 is REGISTERED with researched charter + ChatGPT setup prompt prepared (`workstreams/WS-002/`); NOT PROVEN; ACTIVE launch pending owner decision. P1-03 through P1-09 remain research-first and unopened (no setup prompts).
- Next portfolio action after the WS-001 closers: deep-research and bootstrap P1 workstreams one at a time.

## OPEN QUESTIONS

- Exact researched charter/proof boundary for each of P1-02 through P1-09.
- Which existing Ω mechanisms should be treated as canonical inputs by each new workstream.

## WS-001 EVIDENCE CHAIN

- Charter transcript: `docs/agent-system/transcripts/2026-09-23/CHAT-2026-09-23-cooperative-agent-context.md`
- PKT-001 (STANDS): `docs/agent-system/packets/PKT-001-cooperative-substrate-charter.md`
- PKT-002 (current dogfood findings): `docs/agent-system/packets/PKT-002-p1-01-dogfood-findings.md`
- HANDOFF-001: `docs/agent-system/handoffs/HANDOFF-001.md`
- HANDOFF-004: `docs/agent-system/handoffs/HANDOFF-004.md`
- TEST-01 proof table: `docs/agent-system/outbox/TEST-01/ITEM-001-proof-table.md`
- DOC-01 QA: `docs/agent-system/outbox/DOC-01/ITEM-001-packet-qa.md`
- Coordinator merge request: `docs/agent-system/outbox/IMPL-02/ITEM-002-merge-request.md`
- DIR-001: `docs/agent-system/directives/IMPL-02/DIRECTIVE-001-finish-p1-01.md`
- CROSS-CHATGPT (PROVEN §3 6/6): transcript (`transcripts/2026-09-24/CHATGPT-2026-09-24-cross-chatgpt-closer.md`), PKT-004 (`packets/PKT-004-cross-chatgpt-closer-findings.md`), HANDOFF-007 (ChatGPT closer's, CLOSED) — merged PR #3.
- Closer apparatus (DIR-002 staging): PKT-003 (`packets/PKT-003-p1-01-closer-apparatus.md`), HANDOFF-005/006 (`handoffs/HANDOFF-005.md`, `handoffs/HANDOFF-006.md`), ChatGPT closer procedure (`workstreams/WS-001/CROSS-CHATGPT-CLOSER.md`), ITEM-003/004 (`outbox/IMPL-02/ITEM-003-merge-request.md`, `outbox/IMPL-02/ITEM-004-directive-accept.md`)
- MULTI-AGENT (PROVEN HANDOFF-005 6/6): PKT-005 (`packets/PKT-005-impl-03-independent-verification.md`), HANDOFF-009 (`handoffs/HANDOFF-009.md`), IMPL-03 evidence (`outbox/IMPL-03/ITEM-001-evidence-independent-verification.md`) — ID mapping: originating IDs PKT-004/HANDOFF-007 @ `3867963`, remapped on HANDOFF-007 collision reconciliation (bytes identical; ChatGPT artifacts keep PKT-004/HANDOFF-007).
- Reconciliation (P1-01 PROVEN): HANDOFF-008 (`handoffs/HANDOFF-008.md`) + `outbox/IMPL-02/ITEM-005-merge-request-final-integration.md` + this merge.
- DIR-002 (DONE — both proofs green, criteria satisfied): `docs/agent-system/directives/IMPL-02/DIRECTIVE-002-close-p1-01-proof-gaps.md`

## KNOWN HISTORICAL TRAPS

- Folder ≠ authority; transcripts/packets/handoffs ≠ law.
- `merging` ≠ integrated; fixture-proven ≠ live-proven.
- Old Ollama/`provider.llm` passages are cited history (D-418/D-456), not v1 direction.
- Parked 2026-09-22 lane/inbox entries are not active orders.
- Never edit RATIFIED Ω decisions; supersede-only.
- Never hand-edit BCP state YAML.

## CURRENT AUTHORITY

1. Ω ratified law: `omega-baseline/omega-final/docs/decisions/CURRENT-INVARIANTS.md`
2. BCP vocabulary: `bcp-speed/bcp/state/taxonomy.yaml` + RECONCILIATION.md
3. `docs/CURRENT-CONTEXT.md`
4. live BCP state
5. migration records
6. cooperative/P1 documents as derived operating context only.

## ARCHITECTURAL CONTEXT BRIDGE

- Large cross-session design synthesis: `docs/agent-system/CHATGPT-ARCHITECTURAL-CONTEXT.md`.
- It preserves the mental model behind the P1 portfolio, Ω self-description vision, VIVIM→BCP→Ω relationship, and major open questions. It is DERIVED context, not Ω law.

## RECOMMENDED NEXT READS

1. `/AGENTS.md`
2. `/BUILD_CONTEXT.md`
3. `/docs/CURRENT-CONTEXT.md`
4. `docs/agent-system/SYSTEM.md`
5. `docs/agent-system/CURRENT.md`
6. `docs/agent-system/P1-WORKSTREAM-PORTFOLIO.md`
7. `docs/agent-system/WORKSTREAMS.md`
8. then the selected workstream's dedicated research artifacts.
