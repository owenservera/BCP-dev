# WORKSTREAMS.md — Active Workstream Registry

> **Classification: DERIVED — CURRENT**
> **Maintainer:** COORD-01 · **Updated:** 2026-09-24
> **Portfolio:** `docs/agent-system/P1-WORKSTREAM-PORTFOLIO.md`

The P1 portfolio is nine durable workstreams. Setup prompts are intentionally not
created yet; each will be produced after dedicated deep research in its own
ChatGPT conversation.

## P1-01 / WS-001 — Cooperative Agent System

- **Mission:** persistent collaboration between humans, ChatGPT sessions, and local agents.
- **Status:** ACTIVE — Phase 2 dogfood complete; P1-01 PARTIALLY PROVEN (8 GREEN / 1 PARTIAL / 1 NOT-PROVEN; MULTI-AGENT PROVEN via independent closer, CROSS-CHATGPT still open).
- **Owner:** owner / COORD-01.
- **Current scope:** coordination protocol, transcripts, packets, handoffs, agent roster, context bootstrap.
- **Evidence:** [PKT-001](packets/PKT-001-cooperative-substrate-charter.md), [PKT-002](packets/PKT-002-p1-01-dogfood-findings.md), [HANDOFF-001](handoffs/HANDOFF-001.md), [HANDOFF-004](handoffs/HANDOFF-004.md), [TEST-01 proof table](outbox/TEST-01/ITEM-001-proof-table.md), [DOC-01 QA](outbox/DOC-01/ITEM-001-packet-qa.md), [PKT-003 closer apparatus](packets/PKT-003-p1-01-closer-apparatus.md), [HANDOFF-005 sealed closer](handoffs/HANDOFF-005.md), [HANDOFF-006 staging close](handoffs/HANDOFF-006.md), [PKT-004 independent verification](packets/PKT-004-impl-03-independent-verification.md), [HANDOFF-007 verification close](handoffs/HANDOFF-007.md), [IMPL-03 evidence](outbox/IMPL-03/ITEM-001-evidence-independent-verification.md).
- **Coordinator request:** [IMPL-02 final MERGE_REQUEST](outbox/IMPL-02/ITEM-005-merge-request-final-integration.md) (supersedes ITEM-003, now SUPERSEDED).
- **Open proof:** a fresh P1-01 ChatGPT conversation must boot from CHATGPT-BOOT + CURRENT only — runnable closer: [CROSS-CHATGPT-CLOSER.md](workstreams/WS-001/CROSS-CHATGPT-CLOSER.md). MULTI-AGENT is closed (PROVEN).
- **Launch folder:** `docs/agent-system/workstreams/WS-001/`.

## P1-02 / WS-002 — Repository Truth, Cleanup & Drift

- **Mission:** determine what actually exists, what is authoritative, what is obsolete, and where program/architecture drift exists.
- **Status:** P1 REGISTERED — setup prompt not yet created.
- **Owner:** TBD; dedicated ChatGPT research conversation to be opened.
- **Boundary:** cleanup, disambiguation, source-of-truth mapping, stale/superseded classification, orphan/duplicate detection, program drift.
- **Dependencies:** all workstreams as evidence sources; cooperative system; Ω/BCP authority.

## P1-03 / WS-003 — Ω Ontology, Evidence & Representation

- **Mission:** establish canonical identity, entity, evidence, provenance, lineage, epistemic status, revision, conflict, staleness, and representation semantics.
- **Status:** P1 REGISTERED — setup prompt not yet created.
- **Owner:** TBD; dedicated ChatGPT research conversation to be opened.
- **Boundary:** what things/claims/evidence/representations are and how their relationships are represented.
- **Dependencies:** Repository Truth; Ω decisions/genome; vault/event/provenance mechanisms.

## P1-04 / WS-004 — Ω Self-Knowledge & Context

- **Mission:** enable Ω to understand itself, its environment and current situation, and assemble the right context deterministically.
- **Status:** P1 REGISTERED — setup prompt not yet created.
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

## P1-09 / WS-009 — Ω Integration & End-to-End Proof

- **Mission:** prove that the other workstreams actually compose into the intended Ω system.
- **Status:** P1 REGISTERED — setup prompt not yet created.
- **Owner:** TBD; dedicated ChatGPT research conversation to be opened.
- **Boundary:** integration falsifiers, cross-workstream contract tests, end-to-end scenarios, composition gaps, final proof.
- **Important:** integration proof begins early with thin falsifiers; it does not wait for subsystem completion.
- **Dependencies:** all other P1 workstreams.

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
