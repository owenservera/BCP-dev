# Steward Change Record — Collaboration + Development Acceleration Design

> Date: 2026-09-27
> Status: COMPLETE
> Class: design/control-plane
> Scope: Architecture Steward only; no production implementation

## Change

Created the central design set for a **CFA Collaboration + Development Acceleration Substrate** combining:
- shared vocabulary/evidence/claim mechanics;
- question and dependency tracking;
- decision readiness and handoffs;
- bounded context compilation;
- deterministic scaffolding;
- targeted replay/proof;
- evidence receipts;
- derived orchestration;
- session/bottleneck measurement.

## Why now

The ten CFA roadmaps and M1 boundary work are now sufficiently established to expose a systemic cost: every CFA would otherwise repeatedly reconstruct context, dependencies, proof mechanics and development ceremony.

The design therefore makes development speed a shared architectural concern without centralizing domain meaning.

## Repository evidence reused

The design explicitly reuses rather than reinvents:
- FSSP-1.3 / Agent Commons;
- Boundary Protocol;
- historical Ω genome/context folding;
- historical Ω falsifier-first scaffolding;
- historical Ω orchestration graph;
- historical Ω design simulation;
- historical Ω development-vault/session-ledger;
- historical Ω program-acceleration review.

Historical Ω artifacts are treated as prior evidence/implementation precedent, not automatic BCP authority.

## Central vs CFA boundary

Central design/build may own generic mechanics that are domain-neutral and mechanically reusable.

CFA input is required for:
- domain vocabulary and anti-definitions;
- ownership and canonical identity choices;
- seam contract content;
- domain invariants and falsifiers;
- authoritative evidence maps;
- canonical fixtures/scenarios;
- authority, Work, realization, surface, evolution and runtime semantics;
- live proof conditions and human decision points.

## Implementation status

**No shared implementation has been started by this design round.**

The implementation gate is CFA input reconciliation, after which the Steward may build only the generic kernel that does not encode unresolved domain semantics.
