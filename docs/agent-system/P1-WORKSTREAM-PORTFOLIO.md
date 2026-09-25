# P1-WORKSTREAM-PORTFOLIO.md — Ω Program Core Workstreams

> **Classification: DERIVED — CURRENT**
> **Status:** P1 portfolio baseline
> **Purpose:** program-level charter and boundary map; not Ω constitutional law and does not authorize implementation.
> **Established:** 2026-09-24

## 1. Portfolio purpose

The Ω program is divided into ten Priority-1 workstreams. Each is a durable research/architecture thread with a dedicated ChatGPT conversation and local-agent team.

A workstream owns a question, boundary, evidence base, and proof obligation — not an arbitrary directory of code.

Each P1 workstream must maintain: **MISSION, BOUNDARY, DEPENDENCIES, AUTHORITATIVE INPUTS, DEFINITION OF PROOF**.

ChatGPT conversations, transcripts, packets, and agent opinions are evidence/working material, not authority. Existing Ω law, BCP rules, repository authority, and established decision machinery remain superior.

## 2. Portfolio

| # | Workstream | Core question |
|---|---|---|
| P1-01 | **Cooperative Agent System** | How do humans, ChatGPT sessions, and local agents work as one persistent development system? |
| P1-02 | **Repository Truth, Cleanup & Drift** | What actually exists, what is authoritative, what is obsolete, and where has the program diverged from its intended architecture? |
| P1-03 | **Ω Ontology, Evidence & Representation** | What does the system know, how does it know it, and how is that knowledge represented and proven? |
| P1-04 | **Ω Self-Knowledge & Context** | How can Ω understand itself, its environment, its current situation, and assemble the right context deterministically? |
| P1-05 | **Ω Plugin Kernel & Runtime** | What is the minimal substrate that makes the everything-is-a-plugin architecture actually work? |
| P1-06 | **Ω Agency, Execution & Governance** | Who may cause what, under which authority, capabilities, consent, constraints, budgets, and proofs? |
| P1-07 | **Provider Intelligence & Autonomous Maintenance** | How does Ω learn external web-app behavior and continue operating as those applications change? |
| P1-08 | **Forge / VIVIM Harvest & Migration** | How do we systematically extract proven value from VIVIM and convert it into generalized Ω knowledge/mechanisms? |
| P1-09 | **Ω Integration & End-to-End Proof** | Do all of the above actually compose into the system we claim to be building? |
| P1-10 | **Program Observatory / Visual State** | How can the program be represented as a read-only, evidence-traceable living architecture and mission-control view? |

## 3. P1-01 — Cooperative Agent System

**Mission:** Provide durable coordination and context so independent ChatGPT conversations and unlimited local agents collaborate without one session having to remember the project.

**Boundary:** Agent identity for collaboration, workstream routing, transcripts, packets, handoffs, context loading, and cross-session continuity. It does not become a second Ω authority system, session ledger, provenance system, or execution-policy engine.

**Dependencies:** Repository Truth; Ω session ledger; doctruth; agent runtime; context/aperture substrate.

**Authoritative inputs:** AGENTS.md, BUILD_CONTEXT.md, CURRENT-CONTEXT.md, existing Ω law, and canonical mechanisms referenced by the cooperative protocol.

**Proof:** A fresh ChatGPT session and fresh local agent can enter a workstream, recover context, distinguish authority from history/proposal, reproduce prior work, and leave durable state sufficient for continuation.

## 4. P1-02 — Repository Truth, Cleanup & Drift

**Mission:** Maintain a reconciled map of repository reality: duplicates, stale docs, orphaned code, conflicting implementations, ambiguous ownership, generated-artifact drift, terminology drift, and program/architecture divergence.

**Boundary:** Repository archaeology, cleanup, disambiguation, source-of-truth mapping, stale/superseded classification, cross-surface drift detection, and reconciliation proposals. It does not decide Ω law or independently harvest VIVIM behavior.

**Dependencies:** All workstreams as domain sources; cooperative system; Ω and BCP authority systems.

**Proof:** A fresh agent can identify the current source of truth for a concept, distinguish active from historical material, detect known contradictions, and verify cleanup preserves genealogy and evidence.

## 5. P1-03 — Ω Ontology, Evidence & Representation

**Mission:** Establish the canonical semantic substrate for identity, entities, evidence, provenance, lineage, epistemic status, revision, conflict, staleness, canonicalization, and representation.

**Boundary:** Owns what an object/claim/evidence/representation is and how relationships and epistemic state are represented. It does not own task-specific context assembly, plugin execution, or authorization policy.

**Dependencies:** Repository Truth; Ω genome/decisions; vault/event/provenance mechanisms; Self-Knowledge.

**Proof:** Underlying reality can be represented deterministically with explicit provenance and lineage; conflicting, stale, unsupported, or ambiguous claims remain distinguishable.

## 6. P1-04 — Ω Self-Knowledge & Context

**Mission:** Turn governed knowledge into task-relevant understanding: self-model, world model, intent/context, semantic code knowledge, reflection, system description, knowledge projection, and context compilation.

**Boundary:** Owns how Ω consumes ontology/evidence to construct useful views and context. It does not redefine canonical ontology, grant authority, or implement the plugin kernel.

**Dependencies:** Ontology/Evidence; D-443 context substrate; D-448/D-451 aperture; vivim.mind; D-424 process bridge; semantic source/code knowledge.

**Proof:** A cold agent can ask Ω what it is, what it knows, what is happening, what is uncertain, and what context is relevant; answers derive from live governed evidence rather than hidden memory.

## 7. P1-05 — Ω Plugin Kernel & Runtime

**Mission:** Make plugins the compositional unit of Ω while preserving minimal host, contracts, lifecycle, ports, composition, realization mechanics, and loading/unloading boundaries.

**Boundary:** Computational composition and runtime mechanics. It does not decide whether an invocation is authorized; that belongs to Agency/Governance.

**Dependencies:** Ontology/Evidence; Agency/Governance; Ω B1–B5; Forge.

**Proof:** A plugin can be discovered, loaded, composed, and invoked through the intended substrate with host/import-surface constraints mechanically enforced and no hidden policy path.

## 8. P1-06 — Ω Agency, Execution & Governance

**Mission:** Integrate principal identity, authority, consent, standing, delegation, invocation, capability authorization, law checks, budgets, execution records, refusals, and governed events into one coherent agency chain.

**Boundary:** Owns whether an intended computation/effect is authorized and how authorization is proven and recorded. It does not own plugin loading/composition mechanics.

**Dependencies:** Plugin Kernel; Ontology/Evidence; agent runtime; D-452 invocation; D-453 standing; D-454 delegation; D-455 adaptation; aperture/privacy and budgets.

**Proof:** Any attempted effect can reconstruct principal → authority → consent/standing/delegation → invocation → capability → execution → governed event, including deterministic refusal when any link is invalid.

## 9. P1-07 — Provider Intelligence & Autonomous Maintenance

**Mission:** Empirically discover provider behavior in real Chrome and turn it into evidence-backed, replayable, verifiable realizations that can be watched, drift-detected, rediscovered, repaired, verified, and promoted.

**Boundary:** Provider/browser reality, experiments, observation, probing, behavioral models, streams/parsers, replay, failures, healing experiments, drift response, and provider-realization maintenance. The experimental laboratory is a mode inside this workstream, not a separate destination.

**Dependencies:** Plugin Runtime; Agency/Governance; Ontology/Evidence; Forge; real Chrome.

**Proof:** A provider capability can be discovered from reality, captured as evidence, replayed where possible, verified behaviorally, generalized only when cross-provider evidence supports it, and maintained through watch → drift → rediscovery → repair → verification → promotion.

## 10. P1-08 — Forge / VIVIM Harvest & Migration

**Mission:** Operate VIVIM as a behavioral mine and BCP as a disciplined extraction pipeline: assay, characterize, compare, generalize, verify, and migrate.

**Boundary:** Harvesting and migration between legacy VIVIM evidence, BCP/Forge mechanisms, and Ω candidates. It does not treat legacy implementation as authority and does not own provider reality.

**Dependencies:** Repository Truth; Provider Intelligence; Ω workstreams; BCP migration machinery.

**Proof:** Every harvested mechanism has traceable source, behavioral characterization, canonicality/generalization verdict, Ω mapping, independent verification, and explicit rejection/unknown state when evidence is insufficient.

## 11. P1-09 — Ω Integration & End-to-End Proof

**Mission:** Continuously test composition between workstreams and ultimately prove the integrated Ω system end-to-end.

**Boundary:** Integration falsifiers, cross-workstream contract tests, end-to-end scenarios, composition gaps, and integrated proof. It does not become a competing implementation team.

**Dependencies:** All other P1 workstreams.

**Proof:** Early thin integration proofs establish that critical contracts compose before subsystems are complete; end-state proof demonstrates an integrated Ω lifecycle across boot, composition, governed context, authorization, execution, evidence/events, self-knowledge, external reality, and relevant drift/recovery.

## 12. P1-10 — Program Observatory / Visual State

**Mission:** Design and eventually prove a read-only visual observatory of the
program: living architecture plus mission-control visibility.

**Boundary:** visual projection of existing program/repository state; human-readable
context; entity/relationship visualization; semantic zoom; state/attention
projection; evidence/provenance presentation. It does not own task mutation,
decision-making, source authority, ontology law, BCP state, Ω law, or any existing
workstream's source of truth.

**Hard invariant:** identifiers are references; language carries meaning.

**Experience:** infinite canvas with VIVIM MINE, BCP / FORGE and Ω DESTINATION
territories; P1 workstreams float across/within them; multiple views project one
derived model.

**Agent model:** dedicated external ChatGPT research agent paired with a local
OpenCode research/builder agent.

**Proof:** contextual human comprehension, source traceability, authority
preservation, unknown preservation, relationship/state correctness, semantic zoom,
read-only integrity, multi-view consistency, rebuildability, attention discipline,
and boundary discipline.

**Status:** REGISTERED — V0 blueprint established; not proven and not implementation-active.

**Blueprint:** `docs/agent-system/workstreams/WS-010/V0-BLUEPRINT.md`.

## 13. Hard separations

| Boundary | Owner A | Owner B |
|---|---|---|
| What is known vs how Ω uses it | P1-03 Ontology/Evidence | P1-04 Self-Knowledge/Context |
| How computation composes vs whether it may act | P1-05 Plugin Runtime | P1-06 Agency/Governance |
| What providers actually do vs what should be extracted | P1-07 Provider Intelligence | P1-08 Forge/Harvest |
| Implementation vs proof of composition | P1-01..P1-08 | P1-09 Integration/Proof |

## 13. Dependency shape

~~~text
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

P1-07 + P1-08 + P1-03..P1-06
        ↓
P1-09 Integration / Proof
~~~

This is a dependency map, not a mandatory implementation order. P1-09 must run thin integration falsifiers early, even though its major end-state proof comes later.

## 14. Conversation rule

The ten P1 workstreams are durable portfolio entries. Dedicated workstream conversations and setup prompts are created one at a time after the relevant research boundary is established; this portfolio is the shared program charter, not a substitute for those researched execution contracts. Each future prompt must reference this portfolio, the cooperative system, current repository authority, and that workstream's proof obligations.