# GRAPH-W1-E-L1-DERIVEDVIEW-FRESHNESS-RECEIPT
## 2026-09-27

> Status: **COMPLETE**
> Work item: Stage E / L1 — DerivedView + freshness contract closure
> Owner: Architecture Steward
> Lead consultation: CFA-03 Semantic Continuity
> Scope: readiness/design closure only; runtime joins remain blocked.

## Result

The durable L1 contract is present at:

`AGENTS_CONTEXT/ARCHITECTURE_STEWARD/BOUNDARY-DESIGN-SYSTEM/STAGE-E-L1-DERIVEDVIEW-FRESHNESS-CONTRACT-2026-09-27.md`

It closes the generic contract for:

- DerivedView envelope;
- BasisRef;
- dependency identity/version vector;
- derivation identity;
- deterministic basis digest;
- CURRENT / STALE / CONFLICTED / UNRESOLVABLE semantics;
- restart behavior;
- lazy validation and cache boundary;
- external observation / TTL boundary;
- conflict and unknown handling;
- replacement and non-authority boundaries;
- downstream falsifiers.

The contract explicitly preserves:

`freshness = computed from current basis comparison`

and:

`stored freshness is only a cache hint`.

## Acceptance

**L1 = CLOSED / READY FOR L2.**

This closes only E-R1 through E-R7 at the generic contract level. Domain-specific basis mappings remain L2 work. E-R8 through E-R17 remain open.

## Hard stops preserved

- no runtime self-knowledge join implementation;
- no second Architecture Graph;
- no universal invalidation bus;
- no Ω-law amendment;
- no K0 expansion;
- no semantic ownership transfer;
- no B1 production mechanism choice.

## Next routing

**L2 — Source and runtime basis adapters**, independently characterized by responsible CFAs and reconciled centrally.
