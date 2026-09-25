# Design Convergence

> Classification: DERIVED — FINAL RESEARCH DESIGN CANDIDATE

## Required spine

~~~text
World
  -> Canonical Objects
  -> Relationships / Revisions / Evidence
  -> Work references
  -> Projections
  -> Export / Restore
~~~

## Core canonical substrate

1. Canonical object: existing vault namespace + stable id + append-only revisions.
2. Relationship: ordinary canonical record expressing a semantic assertion between object refs.
3. Source identity / alias: identity-mapping record; never a replacement for local identity.
4. Lifecycle: active / archived / deleted as product semantics; tombstone is a revision.
5. Content: typed semantic payload or content reference; content identity is distinct from object identity.

## Typed object kinds

Core V1 kinds:
- Conversation
- Message
- Project
- Document
- File
- Space

Future kinds use the same substrate. Artifact is a role over a canonical produced object, not a mandatory superclass.

## Revision

Revision is already supplied by the vault identity tuple (ns,id,rev) and changelog.

No second Revision entity is required by current evidence.

## Relationship

Relationship is canonical and independently addressable because it has assertion history, provenance and conflict semantics.

Vault provenance refs remain provenance, not semantic graph edges.

## Projections

Derived:
- World
- graph/index/search results
- Current Context
- ProviderKnowledgeView
- self-knowledge views
- summaries
- workspace/canvas presentations

Caches may be persisted for performance but must be rebuildable.

## External references

Provider/source identities, paths, URLs, external conversation IDs and external file ids are source references. They may support mapping but do not own VIVIM identity.

## Explicitly rejected

- universal semantic inheritance;
- UI/canvas as canonical truth;
- duplicate Work/artifact content as authoritative state;
- CID equality as object merge;
- source disappearance as local deletion;
- relationship last-write-wins as universal truth;
- a second world database.

## Promotion boundary

The package is ready to guide contract implementation, but the following remain experiment-required:
- real vault new-object fixture;
- real relationship conflict handling;
- whole-world export/restore;
- source refresh/disappearance;
- binary content lifecycle;
- existing-world merge/import.

No Ω law, evidence ontology or plugin runtime is changed by this lane.
