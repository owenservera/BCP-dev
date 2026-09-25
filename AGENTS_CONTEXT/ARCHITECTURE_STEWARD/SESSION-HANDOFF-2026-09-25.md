# VIVIM Architecture Steward — Session Handoff
## 2026-09-25

> **Purpose:** clean-session transfer for the Architecture Steward. This document is the durable working context extracted from the prior session.

## 1. Where we are

The broad architecture/readiness preparation cycle is **closed with GO**.

The repository now has three important fresh lenses:

1. **Product Experience Archaeology** — what VIVIM is intended to feel like and enable.
2. **Journey → Architecture Mapping** — how user journeys traverse existing destination responsibilities, dependencies, authority, Work, World/Surface, evidence and vertical slices.
3. **Current Reality & Proof Audit** — what is actually implemented, integrated, live-proven, productized or merely described.

A fresh takeover then ran a bounded two-round readiness process and reached:

**CODING STATUS: GO**

The latest fresh convergence commit was:

`ebc60517e123a3b047b676d81f67111b588b8417`

PR #51:

https://github.com/owenservera/BCP-dev/pull/51

Do not treat GO as “VIVIM is complete.” It means additional broad architecture research is no longer the highest-value next action.

---

## 2. The corrected product model

The central conceptual correction from the session is:

> **VIVIM is the Legos, not the Lego box.**

Ω is the current best real **Lego factory**.

Earlier VIVIM variants are **proven prototypes**. They contain mature product/UX/behavior/provider intelligence, even where their implementation is imperfect and not composable.

The eventual VIVIM product is not one fixed application. Each person's VIVIM instance can be materially different.

The intended progression is:

`Ω factory → building language/interoperability → compelling first-party pieces → compositions/sets → user-created pieces and sets → user-specific VIVIM instance`

“Lego” remains a conceptual metaphor, not VIVIM ontology.

Canonical vocabulary remains:

`Capability · Plugin · Contract · Composition · Object · Surface · Realization · Authority · Work · Evidence · Forge · Evolution · Product Instance`

### Factory UX vs instance UX

The stable UX target is the **factory**:

- discovery;
- addressing;
- understanding;
- composition;
- configuration;
- governance;
- inspection;
- creation;
- replacement;
- evolution;
- removal.

A user's particular surfaces, workspaces, workflows and compositions are instance-level outcomes.

Therefore the architecture must be anchored on **stable factory UX invariants and compositional affordances**, not on one canonical dashboard or journey.

---

## 3. The factory still needs a building language

The session established another important middle layer:

`FACTORY → SHAPES / CONTRACTS → BASIC PIECES → COMPOSITIONS / SETS → USER-CREATED PIECES & SETS`

The factory being real is necessary but not sufficient.

We need a practical initial building language:
- small enough to be usable;
- stable enough for interoperability;
- derived from existing Ω contracts, destination responsibilities, proven behavior and UX;
- demonstrated by first-party reference pieces.

The first-party pieces have two jobs:

1. make VIVIM immediately useful;
2. establish interoperability conventions by example.

“Core shapes” do **not** automatically belong in K0.

K0 remains narrow and constitutional. Shared interoperability can be K1; product semantics belong in system plugins; legitimate extensions remain extensions.

---

## 4. The UX model is deliberately not a fixed product instance

The important formula is:

`USER OUTCOME × COMPOSABLE PIECES × GOVERNED COMPOSITION`

A journey tells us what the person is trying to accomplish.

Composition tells us what pieces they are using, changing or creating to accomplish it.

Composition is therefore cross-cutting, not merely the J7 Evolution journey.

Users are eventually intended to create both:
- individual pieces/capabilities;
- larger reusable compositions/sets.

There is no privileged developer mode implied by this model.

---

## 5. Existing intelligence that MUST be preserved

Do not restart or redo:

### Destination
- North Star
- Foundational Principles
- Human Experience
- Conceptual Model
- Destination Master Map
- Responsibility matrix
- dependency/keystone research
- requirement/evidence traceability
- vertical slices
- world/surface/interaction/provider/agency reconciliations

### Archaeology / research
- System Intelligence Pass 1–3
- Product Experience Archaeology
- Legacy Harvest
- Core vs Plugin research
- Product Vision
- Personal Agent
- Evolution
- current Ω decisions/contracts

### Fresh mapping artifacts
- `docs/destination/product-experience/research/PRODUCT-EXPERIENCE-ARCHAEOLOGY.md`
- `docs/destination/architecture/research/JOURNEY-ARCHITECTURE-MAPPING.md`
- `docs/destination/architecture/research/CURRENT-REALITY-AND-PROOF-AUDIT.md`

These are accumulated intelligence, not disposable drafts.

---

## 6. Coding readiness outcome

The fresh readiness synthesis established:

### First compositional nucleus

`Research → Evidence → World`

### Governed path

`Address → Intent → Context → Capability → Realization → Authority → Work → Execution → Evidence → World → Product Instance continuity`

### Reference substrate to verify from repository evidence

- `vivim.law`
- `vivim.vault`
- `vivim.run`
- `vivim.mind`
- existing intent / NLCL machinery
- provider-browser where a real external realization is required
- Forge as the reference for later creation/evolution

One fresh clarification:

> The research capability used by the first composition must be an explicit ordinary first-party plugin, not hidden infrastructure.

Remaining B1/bootstrap/state-generation/first-party symmetry/Work replacement/Product Instance/live browser issues were treated as implementation/proof gates unless evidence demonstrates factory redesign risk.

---

## 7. The Architecture Graph — new major milestone

A documentation-first **VIVIM Destination Architecture Graph** has now been created on:

`research/steward-destination-architecture-graph`

Files:

`docs/destination/architecture/graph/NODES.json`  
`docs/destination/architecture/graph/EDGES.json`  
`docs/destination/architecture/graph/SCHEMA.json`  
`docs/destination/architecture/graph/GRAPH-MANIFEST.json`

Current graph manifest reports:

- **354 nodes**
- **943 typed edges**
- **99 evidence nodes**
- **125 responsibility nodes**
- **8 journeys**
- **9 vertical slices**
- **13 requirements**
- **44 System Intelligence atoms**
- **7 reference pieces**
- **1 first composition**
- **0 invalid edges**
- all edge endpoints present

The graph is explicitly:

`END VISION → DESTINATION MODEL → HUMAN EXPERIENCE → CONCEPTUAL MODEL → RESPONSIBILITIES → JOURNEYS / REQUIREMENTS / VERTICAL SLICES → SYSTEM INTELLIGENCE / EVIDENCE → CURRENT ARCHITECTURAL MODEL`

It is documentation-first.

**Code is deliberately NOT in the graph yet.**

That is intentional.

The future role of code, Legacy implementation and proof is as evidence-bearing projections attached to the destination graph — not as the graph's source of truth.

### One graph, many views

The graph should ultimately support projections such as:

- responsibility;
- dependency;
- journey;
- authority;
- evidence/provenance;
- implementation;
- evolution/replacement;
- frontier;
- build/proof.

Do not build separate competing master documents for these.

---

## 8. Why the graph matters now

The next risk is no longer lack of architecture research.

The next risk is:

> **agents understand the architecture differently while implementing it.**

The graph should provide a durable bridge:

`END VISION → DESTINATION → ARCHITECTURE GRAPH → CURRENT REALITY → IMPLEMENTATION → PROOF → RECONCILIATION`

For a new capability, the graph should eventually make it possible to ask:

- What is this?
- Where does it belong?
- Who owns its meaning?
- What contracts does it speak?
- What depends on it?
- What does it enable?
- What authority governs it?
- What evidence supports it?
- What proves it?
- What is its replacement/evolution seam?

That is the reason to have the graph — not because “graphs are good architecture tooling.”

---

## 9. Current Steward posture

The Steward is now in **implementation stewardship**, not broad research mode.

The Steward should:

- keep the graph coherent with the destination;
- use the graph to guide implementation boundaries;
- protect factory-vs-instance and K0/K1/plugin boundaries;
- reconcile fresh implementation evidence back into the graph;
- prevent agents from silently inventing architectural structure;
- continue to remove process overhead.

Default:

`FIND → SYNTHESIZE → DECIDE → BUILD → LEARN`

Overhead is a failure mode.

Do not add a process/artifact unless it materially improves:
- accuracy;
- safety;
- recoverability;
- speed.

---

## 10. Immediate next work

### First

Inspect and validate the destination architecture graph against the existing destination corpus.

Do not rebuild it from scratch.

Determine whether its structure is sufficient or only needs targeted repair.

### Then

Use the graph to connect the **first coding slice**:

`factory → first-party research capability → composition → realization → authority → Work → execution → evidence → World → Product Instance continuity`

Attach current Ω implementation only as evidence/realization.

Attach Legacy implementation only as harvest/reference evidence.

### Then

Create the smallest implementation-facing handoff needed by the coding agent.

Do not create a giant roadmap.

Do not turn the graph into a second project manager.

### Hard stop

Once the first implementation boundary is clear:

**CODE.**

The next implementation result should be allowed to falsify the architecture.

---

## 11. Subagent protocol

When independent exploration is genuinely needed:

1. create a typed subfolder under `AGENTS_CONTEXT/ARCHITECTURE_STEWARD/SUBAGENTS/`;
2. write the smallest prompt that defines the question;
3. require the prompt to specify what to explore, how to explore it, exact outputs, and exact output locations;
4. tell the owner:
   - prompt path;
   - full repo URL;
   - explicit full GitHub access;
   - short mission;
   - expected output;
5. launch bounded parallel investigations when questions are orthogonal;
6. converge once questions are coupled.

Prior artifacts are inputs/history, not automatic completion.

---

## 12. Final principle for the next session

Do not ask:

> “What architecture document should we write next?”

Ask:

> **“What does the existing destination graph need to tell the builder, and what is the smallest missing piece of information required to build safely?”**

The destination is the design.

The graph is the connective tissue.

Ω is the factory.

Legacy is the mature prototype mine.

Code is a realization.

Evidence tells us what is actually true.

The user's VIVIM is the resulting composition.
