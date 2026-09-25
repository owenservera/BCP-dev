# Architecture Steward — Initial Housekeeping Plan

> Classification: DERIVED — STEWARD OPERATING PLAN
> Status: ACTIVE
> Established: 2026-09-25
> Baseline: main @ 90d7b9d0f8211da88d8f4f14ed9dfcf79b07fe1a

## Purpose

This is the first operating queue of the Architecture Steward. It converts the Steward mandate into a repeatable repository housekeeping sequence.

The goal is not to reduce the number of documents. The goal is to make existing work legible as one architecture without manufacturing a second authority or ontology.

## Guardrails

- Ω ratified law remains technical authority.
- BCP state remains controlled state and is not hand-edited.
- Existing source artifacts remain intact.
- Workstream ownership remains with the originating workstream.
- Canonical destination views remain derived representations.
- No new documentation depth is created unless the Steward's depth test is satisfied.
- No branch is deleted or merged merely because it is old, duplicated in topic, or inconvenient.
- No semantic dependency is inferred solely from imports or document proximity.
- No "done" claim is upgraded because an artifact has merely been mapped.

## Housekeeping sequence

### H0 — Freeze the observation point

Record the exact main ref and the authority map before reconciliation.

Output:
- current main SHA;
- authority hierarchy;
- major canonical views;
- current open contradictions/frontiers;
- branch/PR topology snapshot.

### H1 — Establish the Steward control surface

Confirm where each Steward view belongs and prevent hierarchy duplication.

Current anchor:
- navigation: `docs/destination/architecture/README.md`
- Steward operating rules: `AGENTS_CONTEXT/ARCHITECTURE_STEWARD/`
- existing destination views remain authoritative for their scopes until registry-backed replacements are proven.

Output:
- documented map of current architectural views and their scopes;
- explicit identification of overlapping/derived views.

### H2 — Seed the responsibility universe

Use the existing 125-row destination responsibility inventory as the initial canonical responsibility universe.

For every row, preserve:
- responsibility identity;
- semantic owner;
- authority boundary;
- current maturity;
- evidence basis;
- replacement seam;
- falsifier/open question.

Do not redesign the 125-row model during seeding.

Output:
- one canonical responsibility registry candidate;
- unresolved/under-modelled rows explicitly marked.

### H3 — Ingest System Intelligence

Treat the System Intelligence corpus as evidence/derived research, not authority.

Current source corpus:
- 44 atoms;
- 65 edges;
- 99 unique evidence records.

Map useful atoms/edges to responsibility, boundary, evidence, implementation, journey and frontier subjects.

Output:
- responsibility ↔ SI mapping;
- evidence lineage;
- contradiction/open-frontier links;
- list of SI atoms with no current canonical placement.

### H4 — Reconcile existing architectural views

Compare the responsibility universe and System Intelligence against:
- destination master map;
- dependency/keystone view;
- requirement/evidence traceability;
- vertical-slice registry;
- evolution/reconciliation;
- Core-vs-Plugin boundary package;
- current workstream authority.

Classify mismatches using:
INCORPORATED / REFINEMENT / DUPLICATE / CONTRADICTION / HISTORICAL / UNKNOWN / PARTIAL / PROMOTION-CANDIDATE.

Output:
- stale-view list;
- duplicate/overloaded concept list;
- explicit contradictions;
- required revalidation set.

### H5 — Build the dependency graph in layers

Do not attempt the full graph in one pass.

Order:
1. responsibility → responsibility;
2. boundary/contract dependencies;
3. runtime/data/authority dependencies;
4. implementation and evidence links;
5. journey/dependency links;
6. lifecycle/change edges;
7. frontier and transitive analysis.

For consequential edges, record why/evidence and whether the edge is current/target and direct/transitive.

Output:
- canonical edge registry candidate;
- expanded dependency graph;
- keystone projection derived from the larger graph.

### H6 — Run the first repository-wide drift sweep

Sweep for:
- path drift;
- vocabulary drift;
- status/maturity drift;
- dependency drift;
- ownership drift;
- authority drift;
- freshness drift;
- boundary drift;
- depth drift.

Start with the highest-centrality current views and recently changed workstreams rather than attempting indiscriminate repository rewriting.

Output:
- drift register with severity, evidence, owner, and repair action.

### H7 — Repair views, not sources

For each confirmed drift:
SOURCE → NORMALIZE → MAP → RECONCILE → UPDATE VIEW → VALIDATE

Preserve source history and add lineage rather than copying canonical prose into local artifacts.

Output:
- refreshed canonical views;
- explicit source incorporation status;
- change records for substantive reclassification/refinement/expansion/etc.

### H8 — Make housekeeping self-sustaining

Once H0–H7 have a stable implementation shape:
- define the machine-readable registry location/schema;
- define generated-view conventions;
- define branch-local promotion/archive rules;
- define revalidation triggers;
- define a repeatable drift sweep entry point;
- define architecture versioning.

This is where automation belongs—not before the semantic model is stable enough to automate safely.

## First execution order

The first concrete Steward cycle is:

1. H0 observation snapshot.
2. H1 scope the existing architecture views.
3. H2 seed the 125 responsibilities.
4. H3 map the 44/65/99 System Intelligence corpus.
5. H4 reconcile contradictions and stale views.
6. H5 expand dependency edges.
7. H6 run drift sweep.
8. H7 repair affected views.
9. H8 automate only the proven repeatable portions.

## Explicitly not first

- no production runtime implementation;
- no new Ω law;
- no K0 redesign;
- no new documentation depth;
- no wholesale rewrite of destination prose;
- no branch purge;
- no second project board;
- no generated graph before the underlying registry semantics are stable.

## Exit condition for the first Steward cycle

The first cycle is complete when a fresh agent can answer, from repository artifacts alone:

- where the canonical architecture model lives;
- which document owns each architectural view;
- how the 125 responsibilities map into that model;
- where System Intelligence evidence lands;
- which dependencies are explicit versus unknown;
- which views are stale;
- which contradictions remain open;
- what changed and what must be revalidated next.
