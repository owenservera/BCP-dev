# CFA-01 World / Ontology / Context — Research Queue

> Status: BOOTSTRAP ROUND 1 / ACTIVE
> Updated: 2026-09-25
> Principle: evidence quality > document volume.

## Round 1 — Essential now

### TODO-001 — Characterize the minimum World semantic primitives

Determine the smallest useful set of concepts required to describe the user's world without collapsing:

- entity;
- atomic unit;
- relationship;
- event;
- state;
- space;
- identity/correspondence;
- resource;
- evidence;
- representation.

Output target: a concise proposed semantic boundary, not a full ontology implementation.

### TODO-002 — Characterize Context

Define Context as a semantic construct before designing a Context engine.

Questions to resolve:

- What makes an item legitimately belong to a Context?
- What is the purpose/scope of a Context?
- Is Context always transient, or can a context definition/recipe be durable?
- What belongs to the canonical bundle versus derived optimization metadata?
- How are provenance, freshness, epistemic status and authority constraints carried?

Output target: provisional Context contract.

### TODO-003 — ACU/DCB archaeology

Trace:

```
AtomicChatUnit
  -> Node / content-unit representations
  -> Conversation / Memory
  -> DynamicContextBundle
  -> Context Assembly
  -> DCB projection
  -> relevant Ω concepts
```

Classify each useful concept as:

- retain;
- adapt;
- rename;
- split;
- reject;
- unresolved.

Output target: evidence-backed harvest findings.

### TODO-004 — World / Data identity seam

Characterize:

- semantic identity;
- record identity;
- revision identity;
- external identity;
- correspondence;
- merge/split semantics.

Output target: boundary note with explicit ownership.

### TODO-005 — Space semantics

Resolve:

```
World
  -> Space?
  -> Workspace?
  -> Surface
  -> Layout / interaction state
```

Determine whether Space is canonical world meaning, a projection/configuration concept, or both with separate senses.

### TODO-006 — Context continuity seam

Trace the semantic transition:

```
WORLD
  -> CONTEXT
  -> INTERPRETATION / GROUNDING
  -> INTENT
  -> WORK
  -> EVIDENCE
```

Goal: identify exactly which parts belong to CFA-01 and which belong to peer CFAs.

## Round 1.5 — Only if Round 1 reveals the need

### TODO-007 — Canonical World Model document

Create `WORLD-MODEL.md` only when the semantic primitives are sufficiently stable that a canonical view would reduce confusion rather than freeze speculation.

### TODO-008 — Canonical Context Model document

Create `CONTEXT-MODEL.md` once Context has a stable enough contract to warrant durable canonical wording.

### TODO-009 — Cross-CFA Boundary Map

Create `BOUNDARY-MAP.md` if repeated work reveals ownership ambiguity that cannot be kept safely in the seed/state documents.

### TODO-010 — Semantic Continuity Map

Create a dedicated semantic continuity artifact if ACU/DCB and Ω investigations demonstrate that cross-identity continuity is a recurring problem rather than a one-off explanation.

## Evolution sequence

This CFA should evolve in rounds rather than lock its whole architecture at birth.

### Round 1 — Self-description and orientation

Goal:
- establish provisional mandate;
- establish operating method;
- start evidence/register discipline;
- identify the minimum research frontier.

Exit condition:
- owner can understand what the agent thinks it is and where it is uncertain.

### Round 2 — Semantic characterization

Goal:
- establish World primitives;
- establish Context semantics;
- resolve major boundary questions;
- compare legacy evidence against Ω destination concepts.

Exit condition:
- core semantic vocabulary is coherent enough to write canonical views.

### Round 3 — Canonical model

Goal:
- ratify the smallest useful permanent identity;
- publish canonical World/Context views;
- establish cross-CFA contracts where necessary.

Exit condition:
- fresh sessions can use the artifacts without reconstructing the model from research history.

### Round 4 — Operational contracts

Goal:
- define durable interfaces/seams for context derivation, world querying/addressability and identity correspondence where proven necessary.

Exit condition:
- implementation agents can build against stable contracts rather than inferred prose.

### Round 5 — Implementation / proof

Goal:
- support or review implementation;
- connect canonical semantics to code;
- validate with executable evidence;
- preserve semantic/provenance continuity.

Exit condition:
- implemented behavior matches characterized semantics and known boundaries.

### Round 6 — Evolution and self-maintenance

Goal:
- detect semantic drift;
- re-evaluate inherited terminology;
- repair canonical views when evidence changes;
- learn which artifacts deserve automation.

Exit condition:
- the steward can maintain itself from observed repository change without becoming a process bureaucracy.

## Defer list

Do not design these fully in Round 1:

- universal world graph runtime;
- universal ontology engine;
- full context ranking/optimization engine;
- dynamic context scheduler;
- context caching strategy;
- generalized semantic database;
- automatic ontology learning;
- full Context UI;
- cross-device context synchronization;
- automated self-healing of ontology/semantic models.

They may become legitimate later. They are not justified yet.
