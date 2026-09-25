# Pass 3 — Self-Knowledge Design

> Classification: DERIVED — DESIGN CANDIDATE
> Status: machine-readable self-description is established; freshness is the missing convergence rule.

## 1. Existing evidence

Current Ω can describe:
- registered capabilities/plugins;
- provider realizations and lifecycle;
- process/plan state;
- liveness;
- context assemblies;
- layout;
- trust/aperture/badge/analytics;
- world/mind views;
- Forge proposal state.

These are substantial self-knowledge mechanisms.

## 2. Missing freshness model

A view that was correct yesterday is not necessarily current today.

The current system has local derivation mechanisms but no single cross-view freshness contract that answers:
**“Can I prove this view still matches the canonical sources?”**

## 3. Candidate derived-view envelope

```
DerivedView
  viewId
  kind
  result
  basisRefs[]
  basisDigest
  dependencyVersions[]
  computedAt
  freshness
  conflicts[]
  derivationRef
```

Freshness:
- CURRENT
- STALE
- UNRESOLVABLE
- CONFLICTED

## 4. Freshness rule

```
CURRENT
iff every basis ref resolves
AND every basis revision/digest matches
AND every dependent contract/manifest version matches
AND no unresolved source conflict invalidates the derivation
```

A source may also declare an external observation TTL. TTL is an input to freshness, not a replacement for basis identity.

## 5. Invalidation / recomputation

Preferred low-complexity mechanism:
1. derived view records basis;
2. read checks basis against current source revisions;
3. mismatch returns STALE or recomputes;
4. recompute writes a new derived snapshot if persistence is useful;
5. old derived snapshot remains history/evidence, not silently overwritten.

This avoids introducing a mandatory global invalidation bus before one is needed.

## 6. Self-knowledge is not authority

A self-view may say:
- “realization X is DEGRADED”;
- “view Y is STALE”;
- “provider knowledge has unresolved contradiction”.

It may not grant authority.

Authority remains law/consent/capability grants.

## 7. Mandatory freshness falsifier

E8 changes one authoritative source:
- realization status;
- contract version;
- canonical relationship;
- routing policy.

Then queries the previously derived view.

Pass criteria:
- stale basis is surfaced or fresh recomputation occurs;
- basis refs/digest are inspectable;
- no stale view is presented as current;
- changed authority is never inferred from stale derived text.

## 8. Automatic evolution boundary

Safe automatic evolution:
- derive/recompute;
- compare;
- flag;
- propose.

Human/developer boundary:
- changes canonical meaning;
- changes authority;
- changes system contracts.

**Conclusion: PROMOTION-CANDIDATE after E8.**
