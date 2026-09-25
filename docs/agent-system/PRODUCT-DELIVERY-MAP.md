# PRODUCT-DELIVERY-MAP.md — Practical VIVIM Delivery View

> **Classification: DERIVED — CURRENT**
> **Purpose:** provide a practical, product-grounded lens over the architectural P1 workstreams.
> **Authority:** this map does not replace or override P1 workstream evidence, Ω law, BCP state, code, tests, or release criteria.
> **Relationship:** P1 is the architectural/proof decomposition; this document is the delivery decomposition.
> **Created:** 2026-09-25.

## 1. Why this view exists

The ten P1 workstreams answer important architectural questions:

> What is truth? What is ontology? How does the kernel work? Who may act?
> How do providers work? How do we harvest VIVIM? How do we prove the system?

That is necessary, but it is not the same as answering:

> What product are we actually making? What can a user do next?
> What is missing for a usable VIVIM? What has real user value?
> Which architectural workstreams contribute to that outcome?

This document supplies that second view.

**Do not add a new workstream just because a delivery track spans several P1s.**

A healthy program has two axes:

```text
ARCHITECTURAL / PROOF LENS                 PRODUCT / DELIVERY LENS
(P1-01 … P1-10)                            (D1 … D6)
        │                                           │
        │         many-to-many mapping              │
        └───────────────────────────────────────────┘
```

P1 remains the durable research/architecture taxonomy.
D1–D6 are outcome-oriented delivery tracks and may draw on several P1s.

---

## 2. The practical delivery tracks

| Track | Outcome | Main P1s | Current state |
|---|---|---|---|
| **D1 — Sovereign Product Foundation** | A local, installable VIVIM environment with durable local state, storage/vault, lifecycle, diagnostics, and a usable application shell. | P1-03, P1-05, P1-04 | **NOT YET EXPLICITLY OWNED** at P1 level |
| **D2 — AI Data & Workspace** | A user can bring AI history/data into VIVIM, see it coherently, navigate/search it, and work with it as their own local corpus/workspace. | P1-03, P1-04, P1-08 + product-surface work | **NOT YET PLANNED AS A DELIVERY TRACK** |
| **D3 — Governed AI Action** | A user intent becomes an authorized action in a real provider, with consent, execution, refusal, and evidence. | P1-05, P1-06, P1-08, P1-09 | **ACTIVE FOUNDATION** — Phase-1 live proof |
| **D4 — Provider Network & Healing** | VIVIM can operate across real providers and survive provider UI/protocol change through discovery, verification, repair, and promotion. | P1-07, P1-08, P1-06 | **NOT STARTED / DEPENDENCY BLOCKED** |
| **D5 — Self-Knowledge & Evolution** | VIVIM can explain itself, assemble relevant context, author/compose capabilities, and evolve through governed evidence rather than hidden assumptions. | P1-04, P1-05, P1-07, P1-08 | **FUTURE / RESEARCH-FIRST** |
| **D6 — Trust, Proof & Delivery Control** | Every meaningful capability has a truthful status, evidence trail, integration proof, and clear next action; releases do not depend on chat memory. | P1-01, P1-02, P1-09, P1-10 | **FOUNDATION EXISTS** |

### Important ownership observation

D1 and D2 are the largest visible gaps in the current program decomposition.

The repository contains Ω surfaces, vault/runtime mechanisms, and a substantial VIVIM legacy product, but the P1 portfolio does **not currently give a dedicated product-delivery owner** to:

- the final VIVIM application shell;
- the user workspace/canvas experience;
- local-first product lifecycle;
- import/onboarding experience;
- the user-facing data model and everyday interaction loop;
- packaging/distribution/update experience.

That does **not** mean those capabilities do not exist anywhere in the repository. It means they are not currently represented as an explicit *delivery responsibility* in the P1 management model.

P1-10 is specifically the **program observatory**, so it should not silently absorb these responsibilities.

---

## 3. Grounded user-value milestones

These are deliberately phrased as outcomes that can be demonstrated, not architecture documents.

### V0 — The foundation is honest

**Outcome:** the repository can demonstrate one real governed action and its refusal path, with evidence sufficient for independent reconstruction.

Maps to: D3 + D6.

Current state: **IN PROGRESS**.

Exit evidence:
- P1-08 M4 real test/gate result.
- P1-06 M4 success + refusal events.
- P1-06 M5 evidence-only reconstruction.
- P1-09 integration proof.

### V1 — I can run my own VIVIM

**Outcome:** a user can install/start VIVIM locally, create/open their local workspace, and know where their durable data lives.

Maps to: D1 + D6.

Current state: **NOT YET DEFINED**.

Minimum questions:
- What is the supported local install/start path?
- What is the durable user-data location and backup model?
- What is the first-run experience?
- What does "local-first" mean operationally, not just architecturally?
- What is the minimum product shell?

This milestone should be researched before implementation rather than inferred from the existing Ω surface.

### V2 — I can bring my AI history into my workspace

**Outcome:** a user can import supported conversation history and see a coherent local representation without losing source identity or provenance.

Maps to: D2 + P1-03 + P1-08.

Current state: **NOT YET DEFINED**.

Minimum vertical slice:
```text
source export / capture
      ↓
import
      ↓
canonical conversation representation
      ↓
provenance / source identity
      ↓
local workspace
      ↓
search / browse / inspect
```

First providers should be explicit, not implied. The likely starting set is the providers already present in the migration/provider evidence.

### V3 — I can use VIVIM to act across providers

**Outcome:** a user can express an intent, review/confirm when required, execute an authorized provider action, and inspect exactly what happened.

Maps to: D3 + D4 + P1-06/P1-07/P1-08/P1-09.

Current foundation:
```text
intent
  ↓
authority / consent
  ↓
capability
  ↓
provider realization
  ↓
execution
  ↓
governed event
  ↓
inspectable evidence
```

Phase-1 `message.send@1` is the first thin vertical slice through this stack.

### V4 — VIVIM survives provider change

**Outcome:** a provider UI/protocol change causes a detectable drift condition rather than silent corruption, and the system can rediscover/repair/verify/promote a realization.

Maps to: D4 + D5.

Current state: **NOT PROVEN**.

This is where the provider laboratory becomes product infrastructure rather than an isolated experiment.

### V5 — VIVIM understands its own state

**Outcome:** VIVIM can answer grounded questions about itself, its capabilities, its current state, relevant evidence, uncertainty, and the context needed for the task at hand.

Maps to: D5 + P1-03/P1-04/P1-10.

Current state: **FUTURE**.

### V6 — VIVIM becomes an extensible sovereign environment

**Outcome:** capabilities can be authored/composed as governed plugins, local knowledge remains user-owned, and new capability behavior can be introduced through an evidence-backed path.

Maps to: D1 + D3 + D5 + P1-05/P1-08.

Current state: **LONG-HORIZON**.

Marketplace/distribution economics are later concerns; they are not required to make the local sovereign core work.

---

## 4. What the current P1 list gets right

The existing P1 decomposition has several excellent boundaries that should remain intact:

| Boundary | Why it matters |
|---|---|
| P1-03 ontology/evidence vs P1-04 context/self-knowledge | Prevents "useful model" from becoming canonical truth |
| P1-05 runtime vs P1-06 governance | Prevents execution mechanics from quietly becoming authorization |
| P1-07 provider reality vs P1-08 Forge | Prevents legacy code from becoming provider truth |
| P1-09 integration/proof vs subsystem implementation | Prevents individually plausible components from being mistaken for an integrated system |
| P1-01/P1-02 as cross-cutting controls | Prevents the project from depending on hidden conversation memory or stale repository claims |

Those are **architecture boundaries**, and they remain useful.

---

## 5. What the current P1 list does not show well

### 5.1 User-visible product ownership

There is no explicit P1 owner for the actual product surface and user journey.

That is the largest structural omission from a product-delivery perspective.

### 5.2 Product data lifecycle

Ontology describes meaning, but a product also needs an owned lifecycle:

```text
capture/import
→ store
→ index
→ retrieve
→ edit/annotate
→ export/backup
→ delete
→ recover
```

Those are user-visible responsibilities and should not emerge accidentally from P1-03/P1-04.

### 5.3 Capability portfolio

`message.send@1` is an excellent first proof slice, but it is not the product.

The delivery view eventually needs a small capability ladder:

```text
message.send
conversation.read
conversation.search
conversation.organize
conversation.export
context.compose
provider.act
provider.discover
provider.repair
plugin.author
plugin.compose
...```

The exact list is a research/product decision, not something to invent prematurely. The important thing is that the portfolio exists as a **user-facing capability roadmap** rather than only as technical primitives.

### 5.4 Release readiness

"Gate green" is necessary but not sufficient for a product release.

A practical delivery view eventually needs separate readiness dimensions:

```technical correctness
+ data safety
+ recoverability
+ user workflow completeness
+ provider coverage
+ observability
+ installation/update confidence
```

These should be evidenced independently rather than collapsed into one score.

---

## 6. How delivery tracks map into P1 without creating bureaucracy

A delivery milestone can be owned by one product outcome while consuming several P1 outputs.

Example:

```text
V3 — Act across providers
│
├── P1-03  canonical event/evidence semantics
├── P1-05  plugin/runtime substrate
├── P1-06  authority/consent/execution
├── P1-07  real provider behavior
├── P1-08  harvested provider realization
└── P1-09  integration proof
```

This is exactly the kind of relationship that the architectural workstream view hides.

Conversely:

```text
P1-03 Ontology
│
├── V1 local product foundation
├── V2 AI data/workspace
├── V3 governed action
└── V5 self-knowledge
```

One P1 workstream can therefore support multiple product milestones.

---

## 7. Management rule

**Do not replace the P1 portfolio with the delivery map.**

Use:

```P1 = "what architectural problem are we solving?"
D-track = "what useful product outcome are we creating?"
Milestone = "what can we demonstrate?"
Evidence = "why do we believe it?"
```

That four-level distinction is sufficient for management.

No separate task tracker is needed for the delivery tracks.

The current task system can continue to hold only the immediate executable actions.

---

## 8. Recommended program shape

For the next period, think of the program as:

```text
              PROGRAM
                 │
       ┌─────────┴─────────┐
       │                   │
 ARCHITECTURE           DELIVERY
 P1-01 … P1-10        D1 … D6
       │                   │
       └────────┬──────────┘
                │
          DEMONSTRABLE
           MILESTONES
             V0 … V6
                │
             EVIDENCE
                │
             RELEASE
```

The immediate focus remains V0 / D3: prove the governed action honestly.

But **after V0**, the program should not automatically continue by inventing another architecture workstream. It should ask:

> Which product outcome are we building next?

That is the practical lens currently missing.

---

## 9. Current gaps to resolve later

These are deliberately **questions, not work orders**:

1. Who owns D1/D2 product delivery?
2. What is the minimum V1 local-first user journey?
3. What exactly constitutes the V2 import/workspace slice?
4. Which capability sequence gives the fastest useful product progression after `message.send@1`?
5. What belongs in "final VIVIM surface" versus Ω's generic surfaces?
6. Which release/readiness checks are product gates versus architectural proof?
7. When does P1-10 become useful enough to justify implementation?

Until these are answered by evidence/research, do not quietly let existing technical work absorb them.

---

## 10. Librarian rule

This file is a **view**, not a second source of truth.

Every delivery track points to its P1 sources.
Every milestone points to its evidence.
No copied implementation details belong here.

When a milestone changes:
- update the milestone state here;
- update the relevant P1 workstream row when its state/evidence changes;
- do not copy detailed evidence into this file.

**The goal is to make the program easier to understand, not to create another layer of paperwork.**

## 11. D5 integration: evolution is now a cross-cutting semantic boundary

D5 — **Self-Knowledge & Evolution** should consume the dedicated destination evolution design rather than treating evolution as a Forge-only concern.

```
Self-Knowledge
      ↓
change detection / explanation
      ↓
Evolution / Reconciliation
      ↓
Impact + Compatibility
      ↓
Authority
      ↓
Work / Maintenance
      ↓
Evidence
      ↓
Self-Knowledge
```

D5 therefore spans self-description, self-maintenance, governed extension, migration, rollback, provider healing, and continuity under change. Forge remains one execution/authoring mechanism inside that broader model.
