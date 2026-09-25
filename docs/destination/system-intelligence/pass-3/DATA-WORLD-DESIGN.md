# Pass 3 — Data / World Design

> Classification: DERIVED — DESIGN CANDIDATES
> Status: proposed semantic/data boundary; not a schema migration.

## 1. Canonical object envelope

A typed durable object should expose a common envelope:

```
ObjectRef
  objectId
  kind
  ownerScope
  sourceIdentities[]
  relationshipRefs[]
  lifecycle
  revisionRef
  provenanceRefs[]
  evidenceRefs[]
  projectionRefs[]
  workRefs[]
  createdAt
  updatedAt
```

The envelope is metadata commonality, not a universal ontology.

### Why this shape

It answers:
- **what is this?** — objectId/kind;
- **where did it come from?** — sourceIdentities/provenance;
- **how is it related?** — relationshipRefs;
- **what is current?** — revisionRef;
- **how is it presented?** — projectionRefs;
- **what work touched it?** — workRefs;
- **what supports it?** — evidenceRefs.

## 2. Message / Artifact / Document / File

### Message — canonical communication object

A Message represents a communication unit in a conversation.

Core semantics:
- conversation membership;
- stable local identity;
- provider/source identity;
- author/role;
- ordering;
- content representation;
- optional provider model;
- execution/stream references where applicable;
- provenance/evidence.

A Message is not merely an Artifact wrapper because communication sequence and conversation semantics are first-class.

### Document — canonical durable content object

A Document is a durable content object with its own identity and revisions.

It may be:
- locally authored;
- imported from an external source;
- generated as a Work result;
- a projection target for multiple surfaces.

Content bytes/structured content are part of the Document payload or referenced storage; the Document identity remains stable across versions.

### File — external/local resource object

A File represents a resource in a filesystem or external storage system.

It should preserve:
- source location identity;
- machine/storage scope;
- content hash where available;
- size/type/metadata;
- last-observed state;
- optional local content reference.

A File is not automatically copied into the vault as canonical bytes.

### Artifact — generic produced/deliverable object

Artifact is the broadest product concept: a user-meaningful produced object that may wrap or point to a Document, File, media asset, report, generated package or other durable output.

Do not make Artifact a mandatory inheritance layer for every semantic object. It is a product role, not a universal superclass.

**Conclusion: EVIDENCE-SUPPORTED + DESIGN-CANDIDATE.**

## 3. Canonical relationships

Design candidate:

```
Relationship
  relationId
  subjectRef
  predicate
  objectRef
  scope
  state
  provenanceRefs[]
  evidenceRefs[]
  validFrom / validTo
  revisionRef
```

Rules:
- relation identity is stable;
- relationship truth is not inferred from spatial placement alone;
- source-derived relationship and user-authored relationship can coexist with explicit provenance;
- conflicting relations remain visible until reconciled by domain rules.

## 4. Lifecycle

Use one product lifecycle sequence across typed objects:

```
CREATE
→ IDENTIFY
→ RELATE
→ READ
→ MODIFY
→ VERSION
→ DERIVE
→ PROJECT
→ REFERENCE
→ EXPORT
→ RESTORE
→ ARCHIVE / DELETE
```

Not every object needs a meaningful implementation at every stage, but the semantic question must have an answer.

### Delete/archive semantics

The vault's never-delete revision invariant remains intact.

“Delete” therefore means semantic tombstone/retire/archive at the product layer. Historical revisions stay available to evidence/replay/export rules.

Restore must not blindly resurrect an archived object when current policy or source conditions say it remains retired.

## 5. Projection and surface

A surface stores:
- object refs;
- view/surface type;
- layout/interaction state;
- optional derived context.

It does not store the only canonical object content.

Canvas placement remains projection data. The future `canvas` namespace is not yet treated as a source of semantic truth.

## 6. Work relationship

A canonical object may be:
- target of Work;
- output of Work;
- evidence subject;
- context input;
- surface projection.

The relation is via refs, not a duplicated copy of the object in the Work row.

## 7. Export / restore

Vault export/import is a proven lower-level mechanism. Product restore needs one higher-level envelope:

```
instance identity
composition reference
world/object namespace set
routing/configuration references
layout/workspace references
work references
evidence references
external-account reconnect metadata
```

Secrets remain reference-only.

Restore must:
1. verify archive integrity;
2. recreate canonical objects without identity collision;
3. preserve revisions and provenance;
4. restore projections only after canonical data is present;
5. mark external sessions/accounts needing reconnect where live identity cannot be reconstructed automatically.

## 8. New-object traversability falsifier

A genuinely new object must be able to traverse:
```
world → surface → work → evidence → export → restore
```
using existing generic mechanisms plus one typed object contract.

If it requires:
- a new core storage engine;
- a bespoke surface authority;
- a second evidence model;
- a special work engine;
then the data architecture is not yet generic enough.

This is **EXPERIMENT-REQUIRED**.

## 9. Design boundary with Legacy

Harvest:
- conversation/message identity;
- attachment/link relationships;
- collection membership;
- lifecycle fields;
- external source identity.

Rebuild:
- semantic object ownership;
- relationship authority;
- export/restore semantics;
- shared envelope;
- world projection.

Reject:
- Prisma model proliferation as the destination abstraction;
- UI trees as canonical data;
- provider-specific fields in the universal object contract.
