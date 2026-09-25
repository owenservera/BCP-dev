# CFA-02 — Boundary Design System

> Status: **BOOTSTRAP / PROVISIONAL**
> Core Function Area: CFA-02 — Data / Identity / Persistence
> Workspace: `AGENTS_CONTEXT/ARCHITECTURE_STEWARD/SUBAGENTS/DATA-MODEL-STEWARD/`
>
> This document is an operational design instrument for discovering and maintaining data-bearing architectural boundaries. It is not a ratified Core Agent Identity, Ω law, canonical ontology, or universal data schema.

## 1. Purpose

CFA-02 operates across data-bearing boundaries rather than owning every domain's data semantics.

The boundary-design system exists to make each consequential data crossing answerable:

> **What is entering or leaving the boundary, what does it represent, what identity and lineage does it carry, what transformation occurs, what becomes durable, what remains external or derived, and how is continuity preserved when either side changes?**

The system is deliberately lightweight. It should expose missing contracts and continuity failures without becoming another architecture bureaucracy.

## 2. The basic unit: a data corridor

Treat a consequential flow as a **data corridor**, not as an isolated model or table.

Typical corridor:

```text
SOURCE / OBSERVATION
        ↓
EXTERNAL REPRESENTATION
        ↓
CAPTURE
        ↓
PARSE / ALIGN / REPAIR
        ↓
NORMALIZE
        ↓
IDENTIFY / RECONCILE
        ↓
CANONICAL DOMAIN DATA
        ↓
PERSIST / REVISE
        ↓
DERIVE / PROJECT
        ↓
TRANSLATE
        ↓
REALIZE EXTERNALLY
        ↓
OBSERVE AGAIN
```

The exact stages vary. The important property is that the whole path remains traceable.

A corridor may run in either direction:

- **read/acquisition:** external → VIVIM;
- **write/realization:** VIVIM → external;
- **round-trip/reconciliation:** external ↔ VIVIM.

## 3. Boundary is multidimensional

A boundary is not adequately described by one owner or one API.

For each boundary, examine at least these dimensions:

| Dimension | Question |
|---|---|
| Meaning | Who owns what the data means? |
| Representation | What shape is it in at this boundary? |
| Identity | Which identity identifies the thing at this layer? |
| Lineage | Can its origin and transformation history be traced? |
| Provenance | What evidence supports the data or claim? |
| Revision | What changed and how is history represented? |
| Durability | Must this survive restart/export/evolution? |
| Authority | Can this data authorize anything, and who decides that? |
| Epistemic state | Is it observed, derived, proposed, unknown or conflicted? |
| Transformation | What operation converts input into output? |
| Information loss | What cannot be recovered after the transformation? |
| Reconciliation | How are competing or repeated observations resolved? |
| Projection | Is this canonical data or a regenerable view? |
| Externality | Is the state actually owned by VIVIM or by an external system? |
| Evolution | What happens when the producer/consumer/representation changes? |
| Recovery | Can the user's durable state be reconstructed without the original implementation? |

No single dimension should silently stand in for the others.

## 4. Ownership model

Use four questions at every seam:

1. **Semantic owner** — who defines what the thing means?
2. **Canonical/data owner** — who maintains its durable record and lifecycle?
3. **Authority owner** — who determines whether an operation/change is permitted?
4. **Realization owner** — who controls the implementation that observes or changes an external system?

These may be four different owners.

CFA-02 primarily stewards the **data continuity between them**.

It does not acquire another owner's semantic or authority ownership merely because their data crosses the corridor.

## 5. Boundary card

For each important corridor, create the smallest useful record containing:

### Boundary

- Name
- Source domain
- Destination domain
- Direction: READ / WRITE / ROUND-TRIP
- Trigger
- External system, when applicable

### Data

- Input representation
- Output representation
- Canonical target
- Durable vs derived vs runtime vs external classification
- Identity at each layer
- Revision behavior
- Retention/lifecycle expectation

### Transformation

- Capture mechanism
- Parser / adapter
- Alignment / reconciliation logic
- Normalization
- Canonicalization
- Translation / serialization
- Information loss
- Idempotency / deduplication considerations

### Evidence

- Source observation
- Evidence references
- Provenance requirements
- Parser/adapter version where consequential
- Epistemic status
- Confidence vs proof distinction

### Ownership

- Semantic owner
- Data/canonical owner
- Authority owner
- Realization owner
- Evolution owner
- Required peer interfaces

### Continuity

- What identity must survive?
- What lineage must survive?
- What history must survive?
- What must remain reconstructable?
- What may be regenerated?
- What happens if the provider/implementation/storage/surface changes?

### Failure states

- stale
- ambiguous
- conflicted
- partial
- missing
- externally changed
- parser drift
- identity mismatch
- unsupported transformation
- unreconstructable

### Evidence status

Use only:

`OBSERVED | DERIVED | PROPOSED | UNKNOWN | CONFLICTED`

## 6. Identity ladder

Never use “the ID” as if a boundary has only one identity.

A single concept can have several valid identities:

```text
SEMANTIC IDENTITY
      ↕
CANONICAL RECORD ID
      ↕
REVISION ID
      ↕
EVENT ID
      ↕
EVIDENCE ID
      ↕
EXTERNAL / PROVIDER ID
      ↕
REPRESENTATION ID
```

The boundary record should state which relationship is being asserted.

Core invariant:

> **Representation identity must never become semantic identity merely because it is convenient.**

Likewise:

- provider ID ≠ canonical identity;
- event ID ≠ record identity;
- revision ID ≠ semantic identity;
- evidence ID ≠ authority;
- session ID ≠ account identity;
- projection ID ≠ source identity.

## 7. Transformation contract

Every consequential transformation should be understandable as:

```text
INPUT IDENTITY
+ INPUT REVISION / OBSERVATION
+ TRANSFORMATION
+ VERSION / BASIS
+ OUTPUT IDENTITY
+ OUTPUT REVISION
+ PROVENANCE
+ EPISTEMIC STATUS
+ INFORMATION LOSS
```

This is especially important for:

- provider parsers;
- stream alignment;
- parser repair;
- imports;
- normalization;
- identity reconciliation;
- export;
- write-back;
- migrations;
- projections used as inputs to later transformations.

A parser is therefore not merely an implementation detail when its output can change durable user data. Its **data transformation contract** becomes part of the corridor.

## 8. Read-path discipline

For external → canonical acquisition:

```text
OBSERVE
→ CAPTURE
→ PRESERVE RAW / SOURCE REFERENCE WHERE NEEDED
→ PARSE
→ ALIGN
→ NORMALIZE
→ IDENTIFY / RECONCILE
→ CLASSIFY EPISTEMIC STATUS
→ ATTACH PROVENANCE
→ PERSIST / REVISE
→ DERIVE PROJECTIONS
```

The key question is not “did the parser produce an object?”

It is:

> **Can we explain why this canonical record corresponds to this observation, what was transformed, what remains uncertain, and what source evidence remains available?**

## 9. Write-path discipline

For canonical → external realization:

```text
CANONICAL STATE
→ AUTHORIZED CHANGE
→ TRANSLATION
→ PROVIDER / EXTERNAL REPRESENTATION
→ REALIZATION
→ EXTERNAL EFFECT
→ OBSERVATION
→ RECONCILIATION
→ CANONICAL REVISION / EVIDENCE
```

Do not treat a successful write call as proof that external state equals canonical state.

The post-write observation is part of the round trip when correctness depends on it.

## 10. Round-trip continuity test

A corridor is not complete merely because both directions exist.

For a round trip ask:

1. Can the original canonical identity be traced to the external representation?
2. Can the resulting external observation be traced back to that canonical record?
3. Are revisions distinguishable?
4. Is external mutation observable?
5. Is information loss explicit?
6. Can conflicts be represented without silent overwrite?
7. Can durable user data still be reconstructed after the external representation changes?

The strongest practical test is:

```text
CANONICAL A
→ REPRESENT
→ EXTERNAL
→ OBSERVE
→ RECONCILE
→ CANONICAL B
```

Then determine whether A and B are:

- semantically equivalent;
- an authorized revision;
- a partial observation;
- a conflict;
- an information-losing transformation;
- unknown.

Do not force false equality merely because the pipeline completed.

## 11. Continuity under change

The governing data-continuity invariant is:

> **Canonical meaning may change through authorized architectural evolution, but durable user data must never lose identity, lineage, or reconstructability merely because its storage representation, implementation, provider realization, or surface changes.**

Test every major boundary against four change classes:

| Change | Continuity question |
|---|---|
| Storage change | Can existing durable records still be recovered? |
| Implementation change | Can old data be interpreted without the old implementation? |
| Provider/realization change | Can canonical data survive replacement of its external mechanism? |
| Surface change | Can presentation/layout changes occur without mutating canonical meaning? |

Then add architectural semantic evolution:

| Change | Continuity question |
|---|---|
| Canonical meaning evolves | Is the evolution explicit, authorized, versioned, and history-preserving? |

The rule is **not** “never change meaning.”

The rule is **“never silently erase the continuity needed to understand what happened.”**

## 12. Peer seam protocol

CFA-02 should usually collaborate rather than absorb.

### CFA-01 — World / Ontology / Context

Ask:

- What does the data mean?
- What semantic identity/correspondence is being asserted?
- Which relationships are domain meaning?

Return:

- data identity mechanics;
- persistence/revision implications;
- correspondence mappings;
- continuity risks.

### CFA-03 — Semantic Continuity

Ask:

- Does the transformation preserve semantic meaning?
- Which representation is canonical at this stage?
- Is the transformation interpretive, canonicalizing, or merely representational?

Return:

- identity/lineage implications;
- durable representation requirements;
- reconciliation and reconstructability constraints.

### CFA-04 — Authority / Governance

Ask:

- Which data is authoritative?
- What authority references must travel with the record?
- Does a mutation require authorization?

Return:

- persistence and auditability requirements;
- authority-state preservation;
- distinction between authority data and data merely carrying an authority reference.

### CFA-05 — Agency / Work / Execution

Ask:

- What data describes Work, execution and outcomes?
- What history must survive recovery?
- Which records are durable versus runtime state?

Return:

- continuity and reconstruction requirements;
- identity/revision/event relationships;
- external-effect reconciliation implications.

### CFA-06 — Capability / Provider / Realization

Ask:

- What was actually observed externally?
- What provider representation produced it?
- What parser/adapter/realization version was involved?
- What external identity is being mapped?

Return:

- canonical data boundary contract;
- preservation/provenance requirements;
- provider-independent identity and continuity constraints.

### CFA-07 — Composition / Plugin / Forge

Ask:

- Is this data owned by a plugin/composition?
- Can the implementation be replaced?
- Which records are composition identity versus product/user data?

Return:

- persistence portability requirements;
- replacement compatibility requirements;
- canonical data references that must outlive an implementation.

### CFA-08 — Experience / Interaction / Surfaces

Ask:

- Is this canonical data or presentation state?
- Is a user edit semantic or presentation-only?
- What must round-trip through the surface?

Return:

- representation/write-back contracts;
- durable layout/presentation state boundaries;
- protection against representation becoming canonical meaning.

### CFA-09 — Evolution / Compatibility / Self-Maintenance

Ask:

- What changes?
- What compatibility dimensions are affected?
- What migration/replacement mechanism is proposed?

Return:

- data continuity constraints;
- migration invariants;
- identity/history preservation requirements;
- reconstructability and rollback requirements.

### CFA-10 — Runtime Constitution / Core Substrate

Ask:

- What persistence/transport/lifecycle primitives are actually guaranteed?
- Which guarantees are mechanical rather than semantic?

Return:

- required durability/recovery properties;
- storage substrate assumptions;
- constraints that must remain implementation-neutral.

## 13. Evidence hierarchy at a boundary

A boundary analysis should preserve the distinction:

```text
EVIDENCE
≠ REPRESENTATION
≠ DESCRIPTION
≠ AUTHORITY
```

Examples:

- DOM is evidence about an external provider page, not automatically canonical conversation truth.
- A parser output is a representation/derivation, not automatically authority.
- A database row proves storage behavior, not semantic correctness.
- A signed Commons message proves attribution, not architectural truth.
- Confidence can help rank candidates, but is not proof.
- Unknown is a valid state.

## 14. What the Data Steward should watch for

Boundary smells:

- one table serves as ontology + cache + registry + history;
- external provider IDs are used as canonical IDs;
- parser output is treated as unquestionable truth;
- derived projections are written back as though canonical;
- runtime state is persisted simply because it is available;
- raw source evidence is discarded before reconciliation is proven;
- write success is treated as external-state truth without observation;
- migrations rewrite immutable history without lineage;
- exports depend on internal implementation details;
- plugin replacement makes user data unreadable;
- visual identity becomes semantic identity;
- authority information becomes implied rather than explicit;
- two agents both believe they own the same canonical record;
- data is copied between stores without lineage.

## 15. Minimal operating loop

Use the smallest loop that closes the current question:

```text
OBSERVE
→ TRACE
→ CLASSIFY
→ MAP OWNERS
→ IDENTIFY TRANSFORMATIONS
→ TEST CONTINUITY
→ RECORD UNKNOWN / CONFLICT
→ RECONCILE WITH PEERS
→ PROPOSE SMALLEST CONTRACT
→ RECHECK AFTER CHANGE
```

Do not instantiate a new registry, schema, database, graph or service until recurring work proves that the current lightweight representation is insufficient.

## 16. When a boundary deserves a durable artifact

Create or update a durable boundary record when at least one is true:

- data crosses a domain ownership boundary;
- a provider/external representation becomes canonical data;
- canonical data is translated back to an external system;
- identity correspondence matters;
- information loss is possible;
- a transformation can alter durable user data;
- persistence/recovery behavior is consequential;
- export/import or migration depends on the seam;
- two agents disagree about ownership;
- implementation replacement could break reconstructability.

Routine internal transformations do not automatically require a new artifact.

## 17. Boundary evolution

A boundary is living.

When evidence changes the design, record:

- previous boundary;
- new boundary;
- evidence causing the change;
- affected peer;
- continuity impact;
- migration requirement;
- whether durable identity or terminology should change.

Do not silently move semantic ownership by changing a data structure.

## 18. First practical application

The first high-value corridors to trace should be:

1. **Provider conversation acquisition**

```text
ChatGPT / Claude / Gemini observation
→ Chrome / provider representation
→ provider parser
→ stream alignment / repair where applicable
→ conversation/message data
→ canonical local record
→ memory/context projections
```

2. **Canonical conversation write / provider realization**

```text
canonical message / action
→ provider translation
→ Chrome/provider realization
→ external effect
→ observation
→ reconciliation
```

3. **Intent → Work → Outcome → Evidence**

```text
canonical Intent
→ Work
→ execution
→ Outcome
→ Evidence
→ durable history / projections
```

4. **Export → restore**

```text
durable vault state
→ export representation
→ new instance
→ import
→ reconstruction
→ continuity verification
```

5. **Provider / implementation replacement**

```text
old realization
→ canonical data
→ new realization
→ same user-owned identity/history
```

These are not implementation commitments. They are boundary probes chosen because they exercise the central continuity problem.

## 19. Current status

This system is **PROPOSED / BOOTSTRAP**.

It is intentionally a working instrument, not a final CFA-02 constitution.

Next refinement should come from tracing real repository corridors and observing which dimensions repeatedly matter in practice.
