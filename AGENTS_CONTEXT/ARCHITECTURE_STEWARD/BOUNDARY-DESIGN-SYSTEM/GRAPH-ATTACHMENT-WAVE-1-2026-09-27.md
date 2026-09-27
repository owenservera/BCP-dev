# GRAPH-ATTACHMENT-WAVE-1 — 2026-09-27

> Status: **READY — DESIGN / BASELINE / PILOT**
> Authority: Architecture Steward derived workstream packet; not Ω law and not semantic authority.
> Gate: **OPEN** by Wave-4 Steward completion audit.
> Purpose: connect the existing documentation-first Architecture Graph to implementation evidence without creating a competing architecture graph.

## 1. Starting authority

Wave-4 completion receipt:
AGENTS_CONTEXT/ARCHITECTURE_STEWARD/BOUNDARY-DESIGN-SYSTEM/WAVE-4-COMPLETION-AUDIT-2026-09-27.md

Existing architecture graph:
- docs/destination/architecture/graph/README.md
- docs/destination/architecture/graph/SCHEMA.json
- docs/destination/architecture/graph/NODES.json
- docs/destination/architecture/graph/EDGES.json
- docs/destination/architecture/graph/CURRENT-BUILD-VIEW.md
- AGENTS_CONTEXT/ARCHITECTURE_STEWARD/tools/build-destination-architecture-graph.ts

Prior graph validation repair:
AGENTS_CONTEXT/ARCHITECTURE_STEWARD/CHANGE-RECORDS/2026-09-25-destination-architecture-graph-validation.md

## 2. Non-negotiable boundary

There remains exactly one Architecture Steward graph.

The graph is:

- documentation-first;
- derived;
- source-lineage-bearing;
- evidence-aware;
- non-authoritative over semantic domains;
- incapable of upgrading maturity by node presence.

Do not create:
- a second architecture graph;
- a graph-owned ontology;
- a graph-owned authority store;
- a graph-owned canonical identity registry;
- a graph-owned evidence authority.

## 3. Wave-1 objective

Move from the existing destination-only graph toward a linked implementation projection in controlled steps:

1. Revalidate the current Architecture Graph on current main.
2. Freeze/confirm the implementation-projection contract.
3. Build one bounded Source-Code Graph pilot against documented responsibility/contract nodes.
4. Attach proof/evidence only where evidence actually exists.
5. Do not attach runtime self-knowledge joins until their separate design/evidence gate is ready.

## 4. Stage A — Architecture Graph revalidation

Required checks:

- regenerate using the existing builder;
- validate schemaVersion 0.2;
- validate all edge endpoints;
- validate sourceRefs and basis fields;
- validate deterministic edge lineage;
- verify the 10 keystone projections remain represented;
- verify Journey → Responsibility mappings remain explicit/source-backed;
- verify Composition → Journey / Vertical Slice test links remain explicit;
- verify evidence identity uniqueness;
- report node/edge/count deltas rather than silently rewriting history.

Acceptance:
- validation receipt committed;
- any delta is explained as source change, builder change, or stale artifact;
- no architecture relationship is inferred from imports or file proximity.

## 5. Stage B — linked implementation projection contract

The implementation layer is a projection from code/repository evidence into existing architectural responsibilities and contracts.

Minimum implementation node vocabulary:

repo
package
module/file
symbol
export
import
call
contract
test
fixture
config/manifest
commit/change

Minimum evidence-bearing edge vocabulary:

implements
satisfies
depends_on
imported_by
calls
tested_by
verified_by
produces
governed_by
affects
supersedes
realizes
traces_to

Rules:

- every implementation node has repository/path or equivalent stable source identity;
- every implementation→architecture claim has a source/evidence basis;
- an import edge means code coupling, not architecture ownership;
- a call edge means observed implementation relation, not semantic necessity;
- a test edge means the test exercises something, not that the test proves the full contract;
- a commit/change edge records change lineage, not semantic correctness;
- unresolved mapping stays UNKNOWN.

## 6. Stage C — bounded Source-Code Graph pilot

Pilot size should be deliberately small.

Select one existing, evidence-bearing destination responsibility corridor with:

- an explicit canonical responsibility owner;
- an existing contract or design source;
- identifiable implementation files/symbols;
- identifiable tests or fixtures;
- at least one attributable change/commit.

The pilot must demonstrate:

implementation
→ responsibility/contract
→ test/fixture
→ evidence/proof state

without requiring a new universal graph schema.

Preferred first pilot criterion:
choose the smallest corridor that is well-supported by current repository evidence and does not require unresolved CFA-02, B1, live-provider proof, or a new semantic authority decision.

## 7. Stage D — proof/evidence attachment

Evidence levels remain separate:

design
≠ implementation
≠ integration
≠ live proof
≠ product proof

A graph edge may point to an evidence record without promoting that evidence to authority.

No fixture may be presented as live/external proof.

## 8. Stage E — runtime self-knowledge

Runtime self-knowledge remains a later linked view.

The intended relationship is:

Architecture Graph
→ implementation projection
→ proof/evidence
→ runtime self-knowledge view

Runtime self-knowledge must not become a second architecture network.

## 9. Stop conditions

Stop the wave if any task requires:

- inventing semantic ownership;
- converting UNKNOWN to inferred dependency;
- replacing the existing architecture graph;
- introducing a universal identity/event/state abstraction;
- treating imports as architectural authority;
- asserting live proof from static fixtures;
- selecting the B1 production mechanism without its evidence gate;
- ratifying CFA-02 or changing Ω law.

## 10. Required receipts

Stage A:
GRAPH-W1-A-REVALIDATION-RECEIPT-2026-09-27.md

Stage B:
GRAPH-W1-B-IMPLEMENTATION-PROJECTION-CONTRACT-2026-09-27.md

Stage C:
GRAPH-W1-C-SOURCE-CODE-PILOT-RECEIPT-2026-09-27.md

Do not merge these into an untraceable omnibus claim.

## 11. Human / agent routing

This is a Steward-controlled workstream.

The central sequence is:

A — revalidate existing graph
→ B — freeze implementation projection contract
→ C — bounded Source-Code Graph pilot
→ D — proof/evidence attachment
→ E — runtime self-knowledge joins

CFA consultation is required only where the pilot crosses a semantic boundary owned by that CFA.

## 12. Completion condition

Graph Attachment Wave 1 is complete only when:

- the existing Architecture Graph has a current validation receipt;
- the implementation projection contract is explicit;
- one bounded Source-Code Graph pilot is source-backed;
- implementation/contract/test/evidence links are traceable;
- no architecture authority is inferred from code structure alone;
- unresolved seams remain explicit;
- the next work can be selected from evidence rather than from graph topology alone.
