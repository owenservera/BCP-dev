# CURRENT.md — Durable Shared Working-Memory Bridge

> **Classification: DERIVED — CURRENT**
> **Rule:** small enough to load every session; entries point to evidence, not evidence.
> **Coordinator-owned:** agents propose via outbox, never direct-edit in flight.
> **Updated:** 2026-09-24

## CURRENT REPOSITORY TIP

- Main currently contains the cooperative agent-system substrate, P1 portfolio baseline, and merged WS-001 DIR-001 dogfood evidence.
- Current main tip after coordinator integration: `d70fadd` for the merge; subsequent coordinator consolidation commits roll this marker.
- Existing untracked surfaces remain another workstream's surface: `bcp-algos/`, Ω `docs/architecture/`, `examples/plugin-echo2/`, `setupdocs.zip`. Do not touch without owner.
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
- The SYSTEM §13 tip-marker/link-maintenance amendment is accepted into the current procedure.
- Earlier proposed `vivim.self` WS-002 is folded into P1-04 / WS-004; it is not a
  competing workstream.

## ACTIVE WORK

- WS-001 / P1-01: Phase 2 dogfood completed; verdict remains PARTIALLY PROVEN.
- Open proof closers:
  - MULTI-AGENT independence: a second genuinely independent agent/thread must continue from HANDOFF-004 alone.
  - CROSS-CHATGPT continuity: a fresh P1-01 ChatGPT conversation must boot from CHATGPT-BOOT + CURRENT only.
- No other P1 workstream setup prompt has been created.
- Next portfolio action after the WS-001 closers: deep-research and bootstrap P1 workstreams one at a time.

## OPEN QUESTIONS

- Whether the two remaining P1-01 closers pass under genuinely independent participants.
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

## RECOMMENDED NEXT READS

1. `/AGENTS.md`
2. `/BUILD_CONTEXT.md`
3. `/docs/CURRENT-CONTEXT.md`
4. `docs/agent-system/SYSTEM.md`
5. `docs/agent-system/CURRENT.md`
6. `docs/agent-system/P1-WORKSTREAM-PORTFOLIO.md`
7. `docs/agent-system/WORKSTREAMS.md`
8. then the selected workstream's dedicated research artifacts.
