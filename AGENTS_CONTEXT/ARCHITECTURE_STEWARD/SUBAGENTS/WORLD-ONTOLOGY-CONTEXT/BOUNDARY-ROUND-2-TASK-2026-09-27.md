# CFA-01 — World & Context Steward
## Boundary Round 2 Task — 2026-09-27

> Coordinator: Architecture Steward
> Status: READY
> This file is the complete task for CFA-01's next boundary-reconciliation step.

## Start here

Read, in this order:

1. `AGENTS_CONTEXT/ARCHITECTURE_STEWARD/SUBAGENTS/WORLD-ONTOLOGY-CONTEXT/README.md`
2. `AGENTS_CONTEXT/ARCHITECTURE_STEWARD/SUBAGENTS/WORLD-ONTOLOGY-CONTEXT/STATE.md`
3. `AGENTS_CONTEXT/ARCHITECTURE_STEWARD/SUBAGENTS/WORLD-ONTOLOGY-CONTEXT/BOUNDARY-ROUND-1-DECLARATION-2026-09-26.md`
4. `AGENTS_CONTEXT/ARCHITECTURE_STEWARD/BOUNDARY-DESIGN-SYSTEM/BOUNDARY-PROTOCOL.md`
5. `AGENTS_CONTEXT/ARCHITECTURE_STEWARD/BOUNDARY-DESIGN-SYSTEM/ROUND-1-RECONCILIATION-2026-09-27.md`

Then perform only the seam tasks below.

## Important

Do NOT:
- redo Round-1;
- redesign CFA-01;
- decide peer-owned semantics;
- activate boundaries;
- change Ω law;
- build tooling;
- perform broad implementation work.

Your job is to make the World-side contracts precise enough for peer reconciliation.

## RP-01 — World ↔ CFA-03 Semantic Continuity

### Question

What exact World-side reference/result should be returned to Semantic Continuity for:

- resolved;
- ambiguous;
- stale;
- unresolvable;
- conflicted

grounding?

### You must distinguish

`World meaning`
from
`grounding / interpretation state`.

### Produce

Define the smallest World-side semantic result that CFA-03 can consume without:
- turning command semantics into World ontology;
- turning World projection into command authority;
- turning grounding into authorization.

Explicitly state:
- target/reference identity;
- resolution state;
- ambiguity/conflict information;
- evidence/provenance basis;
- freshness where material;
- what remains unknown.

Do not prescribe CFA-03's internal representation.

## RP-03 — World ↔ CFA-04 Authority

### Question

What exact distinction should World expose among:

`existent`
`addressable`
`visible`
`accessible`
`authorized`
`nonexistent`
`not observed`

when a World subject participates in a governed operation?

### Required invariants

- hidden must not imply nonexistent;
- existence must not imply permission;
- addressability must not imply authorization;
- failed authorization must not rewrite World ontology;
- absence from a projection must not prove nonexistence.

### Produce

A minimal World-side state vocabulary/crosswalk and identify:
- which states World can assert;
- which states belong to Authority;
- which states require a cross-boundary handoff;
- what World evidence is required.

Do not define CFA-04's authorization semantics.

## RP-04 — World ↔ CFA-02 Data

### Question

Which decisions belong to World versus Data for:

- semantic identity;
- correspondence;
- canonical record identity;
- revision;
- relationship identity;
- merge;
- split;
- alias;
- source identity;
- Event / State;
- canonical versus derived World fields?

### Produce

A dimensional crosswalk.

Use this shape:

| Subject | World responsibility | Data responsibility | Crossing artifact | Open issue |
|---|---|---|---|---|

Do NOT create a universal identity model.

Focus on the minimum seam contract required for durable World reconstruction.

## Evidence discipline

Every substantive claim must be labeled:
- OBSERVED
- DERIVED
- PROPOSED
- UNKNOWN
- CONFLICTED

Use CURRENT / STALE / UNRESOLVABLE freshness when material.

Do not convert peer interpretations into facts.

## Required durable output

Update this task file's corresponding declaration by adding a clearly marked section to:

`BOUNDARY-ROUND-1-DECLARATION-2026-09-26.md`

or create a dedicated addendum beside it if that is cleaner.

Do not replace or erase the original Round-1 declaration.

Use a heading:

`## Round-2 Reconciliation Addendum — 2026-09-27`

Include:
- RP-01 answer;
- RP-03 answer;
- RP-04 answer;
- evidence;
- unresolved items;
- peer questions that remain.

## Commit

Work directly on `main`.

Do not create a branch or pull request.

Suggested commit message:

`CFA-01: reconcile World boundary seams Round 2`

## Completion report

Return:

- exact file path changed;
- exact commit SHA;
- RP-01 status: AGREED / UNKNOWN / CONFLICTED / DEFERRED;
- RP-03 status;
- RP-04 status;
- one sentence on the most important unresolved issue;
- whether human-owner intervention is required.

Then stop.
