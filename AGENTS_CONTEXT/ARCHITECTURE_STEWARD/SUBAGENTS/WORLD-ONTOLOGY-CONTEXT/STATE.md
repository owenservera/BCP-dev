# CFA-01 World / Ontology / Context — State

> Status: BOOTSTRAP ROUND 1 / ACTIVE / PROVISIONAL
> Updated: 2026-09-25
> Permanent core identity: NOT YET RATIFIED

## Current position

Bootstrap context recovery is substantially complete for the first self-design pass.

The current working hypothesis is that CFA-01 stewards the semantic model of the user's world and the semantic contract by which bounded context is derived from that world.

This is a provisional interpretation pending deeper archaeology and owner alignment.

## What is understood

### OBSERVED

- The destination responsibility baseline separately identifies ontology, world projection, query/retrieval and context assembly responsibilities.
- Historical VIVIM contains an AtomicChatUnit shape with rich identity, provenance, conversation linkage, quality, state and sharing metadata.
- Historical VIVIM contains a DynamicContextBundle that composes layered context items and projects them into multiple textual surfaces.
- The Architecture Steward documentation constitution requires lineage, explicit uncertainty, canonical views over document sprawl, and no false completion.
- Peer CFA practice uses a small durable identity/state foundation followed by mission-specific research artifacts rather than forcing every candidate concern into a large fixed document tree.

### DERIVED

- Context should be treated as structured composition, not merely as prompt text.
- Historical ACU is evidence for a class of independently addressable semantic/content units, but ACU is not automatically equivalent to a canonical World Entity.
- Context Items should normally reference or represent existing meaning rather than become a second source of truth.
- World meaning and persistence mechanics need a deliberate seam.
- Semantic ownership and runtime realization should remain separate.
- Round 1 should remain deliberately small.

### PROPOSED

- Provisional role: **World & Context Steward**.
- Provisional model: WORLD -> CONTEXT CONTRACT -> DYNAMIC CONTEXT -> REPRESENTATION.
- Provisional workspace: BOOTSTRAP-SEED.md, STATE.md, RESEARCH-QUEUE.md.
- A dedicated canonical world model should be created only after the current semantic primitives are characterized enough to justify it.

### UNKNOWN / UNRESOLVED

- Exact minimum taxonomy of World Entities.
- Exact status and scope of Atomic Units in Ω.
- Whether Event and State are world entities, orthogonal primitives, or both in different senses.
- Exact definition of Space and its relationship to Workspace.
- Exact boundary between world-level identity/correspondence semantics and data-layer identity mechanics.
- Exact meaning of a Context Item versus a reference/projection/derived claim.
- Whether DynamicContextBundle should survive as a concept, be renamed, or be replaced by a more self-descriptive Ω term.
- Exact ownership of Context assembly runtime versus Context semantic contract.
- Complete continuity path from Context -> Intent -> Work -> Evidence.
- Which context properties are canonical, derived, authority-gated, or purely optimization metadata.

## Initial decision log

### DEC-001 — Stay provisional in Round 1

**Decision:** Do not create a ratified CORE-AGENT identity yet.

**Reason:** The launch protocol calls for self-design followed by owner alignment; the current baseline is sufficient for a seed but not yet for a final responsibility constitution.

**Status:** ACCEPTED FOR BOOTSTRAP ROUND 1.

### DEC-002 — Keep Round 1 intentionally small

**Decision:** Start with the minimum durable documentation needed to operate methodically and defer speculative artifact design.

**Reason:** The repository already contains substantial architecture machinery; this CFA should earn additional structure through repeated work.

**Status:** ACCEPTED FOR BOOTSTRAP ROUND 1.

### DEC-003 — Treat ACU/DCB as archaeological evidence

**Decision:** Add ACU/DCB lineage tracing to the research queue.

**Reason:** The concepts provide unusually concrete historical evidence about atomic content and dynamic context composition, but historical implementation is not automatically Ω authority.

**Status:** ACCEPTED FOR BOOTSTRAP ROUND 1.

## Concept register

### CON-001 — World Entity

Meaning: provisional term for a semantically meaningful thing that VIVIM can recognize as part of the user's world.

Boundary: not yet finalized.

### CON-002 — Atomic Unit

Meaning: provisional term for an independently addressable semantic/content unit that can carry identity, lineage or provenance and participate in context composition.

Boundary: not yet established whether this is a universal Ω primitive or a family of domain-specific units.

### CON-003 — Context

Meaning: a bounded, purpose-specific composition of references/representations derived from world knowledge and possibly other governed knowledge sources.

Boundary: must not become a second source of truth.

### CON-004 — Dynamic Context Bundle

Meaning: historical VIVIM implementation concept for a structured context composition with layered items and a later projection step.

Status: historical concept under investigation; not current Ω canon.

## Problem register

### ISS-001 — Terminology / model inheritance risk

Problem: historical VIVIM concepts are rich but can accidentally become current Ω ontology through familiar naming.

Action: preserve lineage and explicitly classify harvested concepts before adoption.

Status: OPEN.

### ISS-002 — Context ownership seam

Problem: the responsibility matrix names Context Assembly, but the semantic ownership of Context versus the runtime mechanism for assembling it still needs sharper definition.

Action: characterize semantic contract separately from execution/assembly implementation.

Status: OPEN.

### ISS-003 — World / Data identity seam

Problem: semantic identity/correspondence and persistence/record identity are related but not identical responsibilities.

Action: perform explicit cross-CFA identity seam research.

Status: OPEN.

## Immediate operating rule

For each new question, append the smallest useful durable state change:

```
question -> evidence -> status -> decision / open question -> next action
```

Do not create a new document merely to hold one unresolved thought.
