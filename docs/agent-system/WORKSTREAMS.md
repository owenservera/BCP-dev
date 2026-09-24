# WORKSTREAMS.md — Active Workstream Registry

> **Classification: DERIVED — CURRENT**
> **Maintainer:** COORD-01 · **Updated:** 2026-09-25
> **Portfolio:** `docs/agent-system/P1-WORKSTREAM-PORTFOLIO.md`

The P1 portfolio is nine durable workstreams. Setup prompts are intentionally not
created yet; each will be produced after dedicated deep research in its own
ChatGPT conversation.

## P1-01 / WS-001 — Cooperative Agent System

- **Mission:** persistent collaboration between humans, ChatGPT sessions, and local agents.
- **Status:** ACTIVE — Phase 2 dogfood complete; P1-01 PROVEN (7 GREEN / 1 PARTIAL / 2 PROVEN; residual: COMPACTION formal re-rule owed, cure integrated).
- **Owner:** owner / COORD-01.
- **Current scope:** coordination protocol, transcripts, packets, handoffs, agent roster, context bootstrap.
- **Evidence:** [PKT-001](packets/PKT-001-cooperative-substrate-charter.md), [PKT-002](packets/PKT-002-p1-01-dogfood-findings.md), [PKT-003](packets/PKT-003-p1-01-closer-apparatus.md), [HANDOFF-001](handoffs/HANDOFF-001.md), [HANDOFF-004](handoffs/HANDOFF-004.md), [HANDOFF-005](handoffs/HANDOFF-005.md), [HANDOFF-006](handoffs/HANDOFF-006.md), [TEST-01 proof table](outbox/TEST-01/ITEM-001-proof-table.md), [DOC-01 QA](outbox/DOC-01/ITEM-001-packet-qa.md), [CROSS-CHATGPT-CLOSER](workstreams/WS-001/CROSS-CHATGPT-CLOSER.md), [PKT-004 (ChatGPT)](packets/PKT-004-cross-chatgpt-closer-findings.md), [HANDOFF-007 (ChatGPT, CLOSED)](handoffs/HANDOFF-007.md), [PKT-005 (IMPL-03 verification; originating ID PKT-004 @ `3867963`)](packets/PKT-005-impl-03-independent-verification.md), [HANDOFF-009 (IMPL-03 verification; originating ID HANDOFF-007 @ `3867963`)](handoffs/HANDOFF-009.md), [IMPL-03 evidence](outbox/IMPL-03/ITEM-001-evidence-independent-verification.md), [HANDOFF-008 reconciliation](handoffs/HANDOFF-008.md).
- **Coordinator request:** [IMPL-02 final MERGE_REQUEST](outbox/IMPL-02/ITEM-005-merge-request-final-integration.md) (ITEM-003 DONE).
- **Proof state:** CROSS-CHATGPT = PROVEN (§3 rubric 6/6, countersigned on reconciliation); MULTI-AGENT = PROVEN (HANDOFF-005 rubric 6/6). Open proofs: none.
- **Launch folder:** `docs/agent-system/workstreams/WS-001/`.

## P1-02 / WS-002 — Repository Truth, Cleanup & Drift

- **Mission:** determine what actually exists, what is authoritative, what is obsolete, and where program/architecture drift exists.
- **Status:** IMPLEMENTED/COMMITTED — repository-truth baseline published; Phase-1 truth work is complete for the current baseline, with no live proof claim.
- **Owner:** TBD; owner/coordinator launch decision pending.
- **Boundary:** cleanup, disambiguation, source-of-truth mapping, stale/superseded classification, orphan/duplicate detection, program drift.
- **Dependencies:** all workstreams as evidence sources; cooperative system; Ω/BCP authority.
- **Evidence:** [PHASE-1-TRUTH-BASELINE](workstreams/WS-002/PHASE-1-TRUTH-BASELINE.md); [P1-02 research charter](workstreams/WS-002/P1-02-RESEARCH-CHARTER.md); [P1-02 README](workstreams/WS-002/README.md). Resolved drift is recorded in `docs/cleanup/CONFLICT-REGISTER.md` (C15).
- **Proof state:** baseline/cleanup work committed; no claim of live/proven status.

## P1-03 / WS-003 — Ω Ontology, Evidence & Representation

- **Mission:** establish canonical identity, entity, evidence, provenance, lineage, epistemic status, revision, conflict, staleness, and representation semantics.
- **Status:** IMPLEMENTED/COMMITTED — governance chain coded; M4/M5 awaiting real run proof.
- **Owner:** TBD; dedicated ChatGPT research conversation to be opened.
- **Boundary:** what things/claims/evidence/representations are and how their relationships are represented.
- **Dependencies:** Repository Truth; Ω decisions/genome; vault/event/provenance mechanisms.

## P1-04 / WS-004 — Ω Self-Knowledge & Context

- **Mission:** enable Ω to understand itself, its environment and current situation, and assemble the right context deterministically.
- **Status:** IMPLEMENTED/COMMITTED — `message.send@1` real provider-browser execution implemented; M4 (Bun tests + `omega:gate`) awaiting owner run result.
- **Owner:** TBD; dedicated ChatGPT research conversation to be opened.
- **Boundary:** self/world/intent models, semantic source knowledge, reflection, knowledge projection, context compilation.
- **Known lineage:** the earlier proposed WS-002 `vivim.self` work is folded into this P1 workstream; its prior proposal remains historical context, not a separate active workstream.
- **Dependencies:** P1-03; D-443 context; D-448/D-451 aperture; vivim.mind; D-424 process bridge.

## P1-05 / WS-005 — Ω Plugin Kernel & Runtime

- **Mission:** make everything-is-a-plugin composition work through the minimal governed runtime substrate.
- **Status:** P1 REGISTERED — setup prompt not yet created.
- **Owner:** TBD; dedicated ChatGPT research conversation to be opened.
- **Boundary:** µHost, contracts, ports, lifecycle, composition, loading/unloading, realization mechanics, authoring substrate.
- **Hard separation:** runtime mechanics are not authorization policy.
- **Dependencies:** P1-03; P1-06; B1–B5; Forge.

## P1-06 / WS-006 — Ω Agency, Execution & Governance

- **Mission:** integrate principal, authority, consent, standing, delegation, invocation, capability authorization, budgets, execution, refusal, and governed events.
- **Status:** P1 REGISTERED — setup prompt not yet created.
- **Owner:** TBD; dedicated ChatGPT research conversation to be opened.
- **Boundary:** whether an intended computation/effect is permitted and how that permission is proven/recorded.
- **Hard separation:** governance does not own plugin loading/composition mechanics.
- **Dependencies:** P1-03; P1-05; D-452..D-455; aperture/privacy; budgets.
- **Evidence:** [PHASE-1-GOVERNANCE-CHAIN](workstreams/WS-006/PHASE-1-GOVERNANCE-CHAIN.md); `omega-baseline/omega-final/plugins/vivim-agent/src/governance.ts` and related committed governance files.
- **Proof state:** coded/committed; M4/M5 NEEDS RUN.

## P1-07 / WS-007 — Provider Intelligence & Autonomous Maintenance

- **Mission:** empirically learn external web-app behavior and maintain provider realizations as reality changes.
- **Status:** P1 REGISTERED — setup prompt not yet created.
- **Owner:** TBD; dedicated ChatGPT research conversation to be opened.
- **Boundary:** real Chrome, discovery, probing, observation, behavioral models, streams/parsers, replay, failures, healing, drift, rediscovery, verification, probation, promotion.
- **Key principle:** the Provider Laboratory is the experimental mode/engine inside this workstream, not a separate P1 architecture.
- **Dependencies:** P1-03, P1-05, P1-06, P1-08, real Chrome.

## P1-08 / WS-008 — Forge / VIVIM Harvest & Migration

- **Mission:** systematically extract proven value from VIVIM and convert it into generalized Ω knowledge/mechanisms.
- **Status:** P1 REGISTERED — setup prompt not yet created.
- **Owner:** TBD; dedicated ChatGPT research conversation to be opened.
- **Boundary:** assay, characterize, generalize, verify, migrate, and harvest reusable mechanisms.
- **Hard separation:** Forge extracts proven value; Provider Intelligence determines external reality.
- **Dependencies:** P1-02, P1-07, Ω workstreams, BCP migration machinery.
- **Evidence:** [PHASE-1-HANDOFF-PACKAGE](workstreams/WS-008/PHASE-1-HANDOFF-PACKAGE.md).
- **Proof state:** implementation committed; M4 NEEDS RUN; live proof not established.

## P1-09 / WS-009 — Ω Integration & End-to-End Proof

- **Mission:** prove that the other workstreams actually compose into the intended Ω system.
- **Status:** P1 REGISTERED — setup prompt not yet created.
- **Owner:** TBD; dedicated ChatGPT research conversation to be opened.
- **Boundary:** integration falsifiers, cross-workstream contract tests, end-to-end scenarios, composition gaps, final proof.
- **Important:** integration proof begins early with thin falsifiers; it does not wait for subsystem completion.
- **Dependencies:** all other P1 workstreams.

## P1-10 / WS-010 — Program Observatory / Visual State

- **Mission:** design and eventually prove a read-only visual observatory of the program as living architecture + mission control.
- **Status:** REGISTERED — V0 blueprint established; dedicated research/build pair not yet launched.
- **Owner:** owner / governor.
- **Boundary:** visual reflection of repository/program state, contextual human-readable representation, entity/relationship projections, semantic zoom, state visualization, attention projection, evidence/provenance presentation.
- **Hard boundary:** no task mutation, feedback workflow, authority, decision system, or replacement for Git/GitHub, BCP, Ω, or the cooperative system.
- **Design invariant:** identifiers are references; language carries meaning.
- **Spatial model:** infinite canvas; VIVIM MINE / BCP-FORGE / Ω DESTINATION; P1 workstreams float across territories.
- **Agent pair:** external ChatGPT research lead + local OpenCode research/builder.
- **Blueprint:** `workstreams/WS-010/V0-BLUEPRINT.md`.
- **Setup:** `SETUP-PROMPT-CHATGPT.md` + `SETUP-PROMPT-LOCAL.md`.
- **Proof:** `PROOF-PLAN.md`.
- **Research agenda:** `RESEARCH-AGENDA.md`.

## Portfolio relationship

```
P1-01 Cooperative System
        │
        ├──────── development control ─────────┐
        │                                      │
P1-02 Repository Truth                         │
        │                                      │
        └────────────► all workstreams ◄───────┘

P1-03 Ontology / Evidence
        ↓
P1-04 Self-Knowledge / Context
        ↓
P1-05 Plugin Kernel / Runtime
        ↓
P1-06 Agency / Execution / Governance
        ├────────────► P1-07 Provider Intelligence
        └────────────► P1-08 Forge / Harvest

P1-03..P1-08
        ↓
P1-09 Integration / Proof
```

This is a dependency map, not a mandatory implementation order.

## Workstream setup rule

Do **not** create the remaining eight setup prompts from this registry alone.
Each prompt is to be produced after its dedicated ChatGPT conversation performs
deep repository research and establishes its own evidence-backed charter.

The portfolio charter is the shared program boundary; the future workstream
prompt is the researched execution contract.
