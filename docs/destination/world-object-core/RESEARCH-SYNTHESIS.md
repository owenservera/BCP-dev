
# World/Object Core — Research Synthesis

> Classification: DERIVED — RESEARCH CONVERGENCE
> Status: PROMOTION-CANDIDATE with named implementation experiments still required.
> Scope: canonical VIVIM World/Object substrate. No production implementation.

## Executive finding

VIVIM does not need a second universal data system. The repository already has the correct low-level durability substrate in the Ω vault:

- logical identity = (ns, id);
- exact revision = (ns, id, rev);
- content identity = cid;
- append-only changelog with Merkle linkage;
- canonical JSON CAS;
- hot/cold revision retention;
- structural provenance refs;
- verified export/import and roundtrip machinery.

The task therefore resolves the semantic layer above that substrate, not a replacement for it.

The smallest stable rule is:

> A canonical object is a namespace-owned, addressable typed payload whose identity is the existing VIVIM vault reference (ns,id) across append-only revisions. A particular revision is (ns,id,rev). Relationships are ordinary canonical records in the same substrate. World, projections and surfaces are derived views over canonical objects and relationships.

## Evidence position

### OBSERVED
- Ω vault stores arbitrary namespace/id/revision records rather than requiring one semantic table.
- Revisions are allocated from changelog history, so compaction cannot recycle a revision.
- CAS deduplicates identical content without collapsing logical identities.
- Existing chat records demonstrate typed domain payloads inside generic vault storage.
- Legacy VIVIM has a universal Node layer, NodeVersion, NodeEdge and NodeAlias, plus a large Prisma schema.

### EVIDENCE-SUPPORTED
- World must be distinct from canvas/workspace/surface.
- Source data, canonical local records, derived representations, memory and context are distinct layers.
- Provider/account/realization must remain separate.
- Relationship semantics need more authority than the vault generic refs because refs are provenance edges.
- Legacy conversations, messages, attachments, projects and provider accounts prove the product needs stable cross-domain identity and relationships.

### DESIGN-CANDIDATE
- Common semantic object envelope with typed payload.
- First-class relationship records in the same generic vault.
- Source-identity mappings that never silently merge objects.
- Tombstone/archive as canonical lifecycle revisions.
- Artifact as a role of a canonical object, not a universal superclass.
- World as a deterministic derived projection.
- Workspace/surface/layout as projection state.

### EXPERIMENT-REQUIRED
- Large/binary content backing beyond canonical JSON CAS.
- Whole-world export/restore across all participating namespaces.
- Real source-disappearance/import-refresh behavior.
- Relationship conflict presentation and merge policy.
- Alias collision UX and promotion rules.

## The central separation

There are five different things that must never collapse:

1. Canonical object — the durable local semantic record.
2. Source identity — what an external system says this thing is.
3. Relationship — a semantic claim connecting canonical objects.
4. Revision — historical state of one canonical object.
5. Projection — a rebuildable representation of canonical state.

The vault structural refs are an additional provenance primitive, not a substitute for relationships.

## Final candidate model

~~~text
                     WORLD
                       |
             derived over canonical state
                       |
        +--------------+---------------+
        |                              |
   CANONICAL OBJECTS             RELATIONSHIP OBJECTS
        |                              |
        | typed payload                | subject/predicate/object
        | stable (ns,id)               | asserted/retracted/contested
        | revisions                    | provenance/evidence
        | source identities            | authority-attribution
        | lifecycle/tombstone          | validity interval
        |
        +-- Conversation
        +-- Message
        +-- Document
        +-- File
        +-- Project
        +-- any future object kind
                       |
                 derived projections
                       |
             Space / Workspace / Surface
~~~

## What is deliberately not canonical

- world maps;
- cards/tiles;
- graph layouts;
- current context;
- search results;
- summaries;
- workspace placement;
- aliases as lookup answers;
- model-generated projections;
- cached provider knowledge.

These are either derived state or semantic mappings over canonical state.

## Core invariants

1. A new object kind never requires a new physical storage table.
2. Logical object identity does not change when content changes.
3. Identical content may be shared by CID without implying object identity.
4. A source identity is evidence about an external record, not proof that two local records are the same object.
5. A relationship is not a provenance ref.
6. Relationship conflict does not destroy historical assertions.
7. Tombstoning changes current lifecycle state; it does not erase history.
8. Restore creates continuity of identity, not a second copy of truth.
9. A projection can be destroyed and rebuilt without changing canonical identity.
10. Work references canonical objects; it does not become a shadow object store.
11. Artifact is a role over a produced canonical object, not a mandatory inheritance layer.
12. Export/restore preserves exact canonical references wherever the imported world is restored without identity remapping.

## Disposition

PROMOTION-CANDIDATE for implementation planning after the named experiments. No Ω law, evidence contract, or plugin runtime replacement is implied.
