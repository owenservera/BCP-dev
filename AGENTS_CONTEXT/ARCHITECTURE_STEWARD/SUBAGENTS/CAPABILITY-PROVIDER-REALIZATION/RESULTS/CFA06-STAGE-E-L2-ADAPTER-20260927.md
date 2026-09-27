# CFA-06 — Stage E L2 Adapter Characterization Receipt
## 2026-09-27

> Status: **COMPLETE — OWNER-BOUNDED L2 CHARACTERIZATION**
> CFA: CFA-06 — Capability / Provider / Realization
> Adapter: `cfa06.provider-realization-basis.v1`

## Executed action

Completed the CFA-06 owner row of the Stage-E L2 source/runtime basis adapter workload.

The durable adapter characterization is:
`AGENTS_CONTEXT/ARCHITECTURE_STEWARD/SUBAGENTS/CAPABILITY-PROVIDER-REALIZATION/STAGE-E-L2-CFA06-CAPABILITY-REALIZATION-BASIS-ADAPTER-2026-09-27.md`

## Closed characterization

- Canonical source: existing Ω `ProviderRealization` in vault `ns="providers"`.
- Canonical identity: `realization:<archetypeSlug>:<providerId>`.
- Current basis token: existing vault record `rev` plus returned `cid`.
- Resolver: existing provider/vault read path.
- Freshness: same id + same rev/cid = CURRENT; changed rev/cid = STALE.
- Missing, malformed, or otherwise unavailable required source = UNRESOLVABLE.
- Supplemental session/evidence references remain explicitly typed dependencies; they do not become a second identity layer.
- Live and fixture observations remain distinct; fixture evidence cannot be promoted to live proof.
- Realization replacement changes realization basis/lineage but does not by itself redefine semantic Capability identity.

## Falsifier

A dependent derived view captured against realization revision N must become STALE when the same canonical realization resolves at N+1 and/or a different CID. If the canonical realization cannot be resolved, validation must produce UNRESOLVABLE. A compatible realization replacement must preserve semantic Capability identity unless independent semantic evidence establishes a Capability change.

## Residual UNKNOWN / DEFERRED

- canonical durable Account/Session/Resource join and cardinality with CFA-02;
- universal provider implementation-content digest;
- universal external-observation token across providers;
- generalized Model/Resource basis semantics;
- complete authenticated live-provider/account/routing proof;
- quantitative provider-local repair → CFA-09 generic Change threshold;
- runtime self-knowledge join implementation.

## Boundary / safety result

No runtime self-knowledge join was implemented.
No shared semantic boundary was activated.
No Ω law changed.
No second Architecture Graph, identity store, evidence store, or routing authority was introduced.
No K0/B1 mechanism was selected.
No live proof was claimed.

**CFA-06 STAGE-E L2 RECEIPT: COMPLETE**
