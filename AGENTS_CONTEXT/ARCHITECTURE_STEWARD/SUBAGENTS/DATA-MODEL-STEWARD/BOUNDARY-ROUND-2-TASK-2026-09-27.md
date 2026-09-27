# CFA-02 — Data Steward
## Boundary Round 2 Task — 2026-09-27

> Coordinator: Architecture Steward
> Status: READY
> This file is the complete task for CFA-02's next boundary-reconciliation step.

## Start here

Read:

1. `AGENTS_CONTEXT/ARCHITECTURE_STEWARD/SUBAGENTS/DATA-MODEL-STEWARD/README.md`
2. `AGENTS_CONTEXT/ARCHITECTURE_STEWARD/SUBAGENTS/DATA-MODEL-STEWARD/CORE-AGENT-SEED.md` if present
3. `AGENTS_CONTEXT/ARCHITECTURE_STEWARD/SUBAGENTS/DATA-MODEL-STEWARD/BOUNDARY-ROUND-1-DECLARATION-2026-09-26.md`
4. `AGENTS_CONTEXT/ARCHITECTURE_STEWARD/BOUNDARY-DESIGN-SYSTEM/BOUNDARY-PROTOCOL.md`
5. `AGENTS_CONTEXT/ARCHITECTURE_STEWARD/BOUNDARY-DESIGN-SYSTEM/ROUND-1-RECONCILIATION-2026-09-27.md`

Then perform only the seam tasks below.

## Do not

- redo Round-1;
- redesign the Data Steward;
- define World ontology;
- define Authority semantics;
- define Semantic Continuity semantics;
- activate boundaries;
- build shared tooling;
- modify Ω law.

## RP-04 — CFA-02 Data ↔ CFA-01 World

### Question

Which decisions belong to:

World:
- semantic identity;
- correspondence meaning;
- relationship meaning;
- canonical versus derived World semantics.

Data:
- canonical record identity;
- revision;
- durable lineage;
- persistence/reconstruction;
- recording correspondence evidence.

Focus on:
- merge;
- split;
- alias;
- source identity;
- relationship identity;
- Event / State;
- canonical versus derived World fields.

### Produce

A dimensional crosswalk:

| Subject | Data owns | World owns | Durable crossing | Unknown/conflict |
|---|---|---|---|---|

The goal is to make durable reconstruction possible without making storage identity the ontology.

## RP-05 — CFA-02 Data ↔ CFA-04 Authority

### Question

What authority information must be durably retained with a consequential data mutation so the system can reconstruct:

- who acted;
- under what authority;
- on what data target;
- under what scope/time;
- what was authorized;
- what result/evidence followed?

Then distinguish:

`durable authority reference`
from
`live authority decision`.

### Produce

Define the minimum durable cross-boundary references.

Explicitly state:
- what Data persists;
- what Authority resolves live;
- what may expire or be revoked;
- what must be reconstructable later;
- what Data must not interpret as permission.

Do not design CFA-04's authorization engine.

## RP-06 — CFA-02 Data ↔ CFA-03 Semantic Continuity

### Question

How should semantic continuity and durable data continuity refer to the same underlying meaning without collapsing:

- semantic identity;
- record identity;
- Intent identity;
- revision identity;
- evidence identity;
- representation identity?

### Produce

A minimal identity/provenance crosswalk for this seam only.

Defer broader identity architecture if the evidence does not support a stronger conclusion.

## Evidence discipline

Classify claims:
- OBSERVED
- DERIVED
- PROPOSED
- UNKNOWN
- CONFLICTED

Preserve freshness separately.

## Required durable output

Add:

`## Round-2 Reconciliation Addendum — 2026-09-27`

to:

`BOUNDARY-ROUND-1-DECLARATION-2026-09-26.md`

or create a clearly linked addendum without deleting Round-1 history.

Include RP-04, RP-05, RP-06, evidence and unresolved issues.

## Commit

Work directly on `main`.

Suggested commit:

`CFA-02: reconcile Data boundary seams Round 2`

## Completion report

Return:
- exact file path;
- exact commit SHA;
- status of RP-04;
- status of RP-05;
- status of RP-06;
- most important unresolved issue;
- human-owner intervention required: YES/NO.

Then stop.
