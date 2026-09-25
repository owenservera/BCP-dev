# VIVIM Destination Architecture Graph

> Status: ACTIVE / SEEDED
> Classification: DERIVED — documentation-first architecture system
> Scope: destination/end-vision → architecture → evidence → current reality → build

## Purpose

This graph is the **destination-anchored architectural network** for VIVIM.

It starts from the documented end vision and connects that vision to the architectural responsibilities and evidence already present in the repository. Implementation is a later evidence-bearing projection.

```
END VISION
  ↓
DESTINATION MODEL
  ↓
ARCHITECTURE GRAPH
  ↓
CURRENT / HISTORICAL EVIDENCE
  ↓
CODE + PROOF
```

## Seed coverage

The initial seed is built from existing repository material, not from code dependencies.

It includes:

- 4 vision anchors;
- 25 destination concepts;
- 125 destination responsibilities;
- 13 destination requirements;
- 8 canonical journeys;
- 9 vertical slices;
- 10 keystone projections;
- 44 System Intelligence atoms;
- 99 unique System Intelligence evidence records;
- typed System Intelligence relationships;
- first-party/reference pieces;
- the first **Research → Evidence → World** composition;
- source-document lineage.

Exact counts and validation are in `GRAPH-MANIFEST.json`.

## One network, many views

The graph is one underlying network. Views are projections:

```
Destination
Responsibility
Dependency
Journey
Authority
Evidence / provenance
Implementation
Change impact
Frontier
Build / proof
```

Do not create competing graphs for each view.

## Node model

Core node kinds:

```
VISION
DOCUMENT
DESTINATION CONCEPT
RESPONSIBILITY
REQUIREMENT
JOURNEY
VERTICAL SLICE
KEYSTONE
SYSTEM INTELLIGENCE ATOM
EVIDENCE
REFERENCE PIECE
COMPOSITION
WORKSTREAM
```

Every node has identity, layer, authority/status, source references and relevant properties.

Presence in the graph **never upgrades maturity**.

## Edge model

Relations are typed and provenance-bearing.

Examples:

```
DEFINES
ELABORATES
FRAMES
INVENTORIES
REGISTERS
DEPENDS_ON
SERVES
DESCRIBES
INFORMS
CONTRIBUTES_TO
EVIDENCES
AUTHORIZES
GOVERNS
ENABLES
REQUIRES
SUPERSEDES
VARIANT_OF
PARTICIPATES_IN
TESTS
```

The graph distinguishes descriptive framing from runtime dependency, and current dependency from target dependency.

## Why this exists before coding

A coding agent should not have to reconstruct architecture from documents every time.

The graph lets it ask:

> What destination requirement does this change advance? What journey does it exercise? What does it depend on? Who owns the meaning? What authority governs it? What evidence supports it? What is the replacement seam? What would falsify the assumption?

The intended build query is:

```
Find the smallest currently supported composition
that advances a destination requirement
without introducing an unowned dependency.
```

For the present nucleus:

```
World
→ Address
→ Intent
→ Context
→ Capability
→ Realization
→ Authority
→ Work
→ Execution
→ Evidence
→ World
→ Product Instance continuity
```

with **Research → Evidence → World** as the first composition.

## Source and authority discipline

The graph follows:

```
VISION
  ↓
DESTINATION
  ↓
ARCHITECTURE
  ↓
EVIDENCE
  ↓
CURRENT REALITY
  ↓
IMPLEMENTATION
  ↓
PROOF
```

Lower layers may falsify or refine upper layers, but may not silently rewrite them.

Research is not authority merely because it is indexed.

Legacy is evidence/history, not destination authority.

Evidence supports a relationship or claim; it does not grant permission.

## When code arrives

Implementation will be added as a new evidence layer:

```
Destination responsibility
      ↓
contract / boundary
      ↓
Ω implementation
      ↓
integration
      ↓
live / E2E proof
      ↓
productization
```

A code node with no legitimate destination owner is drift.

A destination node with no implementation/evidence remains unimplemented or unproven.

Both are useful states.

## Regeneration

The intended source-to-graph path is:

```
canonical destination docs
+ responsibility / requirement / slice registries
+ System Intelligence indexes
+ validated research
→ graph builder
→ NODES.json / EDGES.json
→ derived views
```

The builder is under the Architecture Steward context.

Generated data should not be hand-edited except through an explicitly curated layer.

## Non-goals

This is not:

- a new Ω law;
- a new ontology;
- a project-management system;
- a code-only dependency visualizer;
- proof that every destination feature exists;
- permission to infer hidden dependencies;
- a fixed instance UX specification.

The purpose is to make the **documented destination, architectural relationships, evidence and eventual implementation traversable as one system**.
