
# Implementation Blueprint — Smallest Safe Build

> Classification: DERIVED — PROMOTION-CANDIDATE
> No production code is introduced by this document.

## 1. Reuse before adding

Reuse the existing:
- Ω vault identity/revision/changelog;
- CAS/content hashing;
- provenance refs;
- export/restore;
- typed domain payload contracts;
- WorldModel derivation pattern;
- existing chat/provider/domain namespaces.

Do not create:
- a second universal node database;
- a parallel evidence system;
- a world database duplicating vault objects;
- a universal Artifact table;
- a UI-owned semantic graph.

## 2. Smallest implementation seams

### Seam A — typed object envelope
Define one cross-domain contract for ref, kind, schemaVersion, lifecycle, origin, source identities, content reference and timestamps.

The semantic payload remains domain-owned.

### Seam B — relationship contract
Define a relationship record as an ordinary canonical object with subject, predicate, object, assertion state, provenance/evidence, optional authority attribution and validity interval.

### Seam C — identity mapping
Define source-identity/alias records as ordinary canonical objects with explicit collision states.

### Seam D — world projector
Build a deterministic projector over canonical objects, active relationships and access scope.

### Seam E — object lifecycle helpers
Add semantic helpers for create, append revision, archive, tombstone and restore.

These should wrap existing vault semantics, not create a second persistence engine.

## 3. Domain migration strategy

Existing typed namespaces such as chat should not be rewritten solely to match naming.

Migration is justified only when:
- the existing object cannot participate in the canonical contract;
- duplication exists;
- a cross-domain operation requires it;
- evidence shows a semantic contradiction.

Otherwise, adapt through projections and relationship records.

## 4. First domain set

Use:
1. conversation;
2. message;
3. project;
4. document;
5. file;
6. space;
7. one genuinely new test type.

Do not start with every legacy domain.

## 5. Proof gates

G-WO1: new object uses generic storage.

G-WO2: revision survives compaction and exact historical addressing.

G-WO3: relationship conflict does not erase either assertion.

G-WO4: tombstone plus restore preserves identity/history.

G-WO5: export/restore preserves canonical refs.

G-WO6: Work references object refs without payload duplication.

G-WO7: surface/layout changes do not change object CID/revision.

G-WO8: source disappearance leaves local object intact and marks source state unavailable.

## 6. Implementation order

~~~text
contract
  v
synthetic fixture
  v
real vault proof
  v
relationship proof
  v
object/project integration
  v
world projector
  v
surface integration
  v
whole-world export/restore
~~~

Stop at each failing gate rather than patching around the boundary.
