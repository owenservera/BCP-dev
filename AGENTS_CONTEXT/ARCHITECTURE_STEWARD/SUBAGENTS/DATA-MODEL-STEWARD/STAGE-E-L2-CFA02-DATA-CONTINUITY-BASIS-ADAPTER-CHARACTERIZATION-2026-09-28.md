# CFA-02 — Stage E L2 Data Continuity Basis Adapter Characterization
## 2026-09-28

> Status: **CLOSED — OWNER CHARACTERIZATION COMPLETE / IMPLEMENTATION-PROOF DEFERRED**
> CFA: CFA-02 — Data / Identity / Persistence
> agent_id: `data-model`
> Scope: Stage-E L2 readiness characterization only. No runtime adapter implementation.

## 1. Adapter identity

- **adapterId:** `cfa02.data-continuity.revision-basis@1`
- **ownerCFA:** CFA-02
- **basisKind:** `DURABLE_RECORD_REVISION`
- **purpose:** provide the strongest existing durable Data-plane basis sufficient for a DerivedView to determine whether the canonical durable input it depends on is unchanged, changed, contradictory, or no longer resolvable.

This adapter does not create a new identity registry, continuity store, Event/State primitive, or canonical graph.

## 2. Canonical source / evidence

The strongest current canonical durable source is the existing Ω vault and its revision/changelog substrate.

Current repository evidence establishes:

- exact durable World/Object revision identity is `(ns,id,rev)`;
- `cid` is a distinct content identity and may accompany a revision;
- changelog history preserves revision continuity;
- vault durability/recovery/export/import provide the existing continuity and reconstruction substrate;
- semantic identity, source identity, representation identity and durable record identity remain distinct.

Primary evidence:

- `docs/destination/world-object-core/ADDRESSING.md`
- `docs/destination/world-object-core/CANONICAL-MODEL.md`
- `docs/destination/world-object-core/REVISION-LIFECYCLE.md`
- `omega-baseline/omega-final/docs/decisions/D-432-vault-durability.md`
- `omega-baseline/omega-final/plugins/vivim-vault/src/changelog.ts`
- `omega-baseline/omega-final/docs/VAULT-NAMESPACES.md`
- CFA-02 `OWNER-ALIGNMENT-2026-09-27.md`
- CFA-02 `BOUNDARY-ROUND-2-ADDENDUM-2026-09-27.md`
- Stage-E L1 `STAGE-E-L1-DERIVED-VIEW-FRESHNESS-CONTRACT-2026-09-27.md`

## 3. Source identity / comparison token available today

### Primary token

`(ns,id,rev)`

This is the canonical durable revision reference already present in the Data substrate.

### Optional stronger content binding

`cid`

Where the source exposes a content identity, the BasisRef may carry it as `contentDigest`.

### Optional lineage dependencies

Where a derived view materially depends on ancestry, migration, merge/split or provenance continuity, the adapter may expose typed durable lineage/evidence references as dependencies. It must not invent a universal lineage digest merely for convenience.

The adapter therefore maps into the generic L1 shape as:

```
canonicalRef = { ns, id }
revisionRef  = { ns, id, rev }
contentDigest = cid (when available)
evidenceRefs = existing vault/changelog/provenance refs
```

These are references to existing owner-controlled data; they are not a new universal identity.

## 4. Resolver characterization

Resolution is through the existing durable vault/read/reconstruction authority:

1. resolve the declared canonical record reference;
2. resolve the declared exact revision where the DerivedView basis is revision-pinned;
3. where the derivation requires the current durable head, resolve the current revision/head independently;
4. when a content identity is present and materially required, verify that the resolved content corresponds to the declared CID/content digest;
5. resolve required lineage/provenance references when the particular derivation declares them material.

No process-local cache is treated as authoritative.

## 5. Freshness comparison rule

The comparison is **derivation-specific but Data-basis-owned**:

- **Historical/revision-pinned view:** the declared revision remains the comparison target. It is CURRENT when the required exact revision and any required content/lineage dependencies resolve consistently.
- **Current-head-dependent view:** resolve the current canonical head for the declared `(ns,id)`; a changed revision token makes the prior DerivedView STALE.
- **Content-bound view:** where CID/content identity is declared material, a changed content identity is freshness-relevant even if the record address remains unchanged.
- **Lineage-bound view:** where a declared durable lineage dependency changes or becomes unavailable, the view becomes STALE or UNRESOLVABLE according to whether the new basis is resolvable.

Stored `freshness` remains only a cache hint; L1 requires recomputation against current basis.

## 6. STALE behavior

A dependent derived view becomes **STALE** when a required, resolvable durable basis differs from the basis used to compute the stored result, including:

- current `rev` differs for a current-head-dependent derivation;
- material `cid`/content identity differs;
- a required durable lineage/revision dependency changes;
- a required governing Data-plane revision used by the derivation is superseded.

STALE does not mean false and does not erase the historical derived result.

## 7. UNRESOLVABLE behavior

A derived view becomes **UNRESOLVABLE** when a required durable basis cannot be established sufficiently to compare currentness, including:

- canonical record reference cannot be resolved;
- required exact revision is missing;
- required current head cannot be established;
- required content identity cannot be resolved/verified;
- required lineage/reconstruction reference is unavailable or corrupted;
- the durable source is in a state that prevents a trustworthy currentness comparison.

The adapter must not substitute filename, timestamp, source-provider identity, display label or another weaker value to manufacture CURRENT.

## 8. CONFLICTED behavior

The Data adapter may report **CONFLICTED** when required durable evidence resolves but materially contradicts itself for the same declared basis, for example:

- the same declared revision reference resolves to incompatible content identity evidence;
- durable revision/changelog linkage is internally inconsistent;
- a required continuity relation has incompatible attributable endpoints.

CFA-02 records the contradiction and evidence references; it does not choose semantic authority to resolve it.

## 9. Evidence classification

### OBSERVED / CURRENT

- `(ns,id,rev)` is the existing exact durable revision address.
- `cid` is a distinct content identity where exposed.
- vault changelog/revision history and D-432 durability mechanisms provide the existing persistence/reconstruction substrate.
- Data owns durable record identity, revision, lineage and reconstruction.

### DERIVED / CURRENT

A current-head-derived view can use `(ns,id,rev)` plus optional CID as the strongest current Data-plane basis without introducing a new identity system.

### PROPOSED / CURRENT

Typed lineage/evidence dependencies are added only when a particular derivation materially depends on them.

## 10. Falsifier set

**F-02-L2-01 — Changed current revision**

1. compute a current-head-dependent DerivedView against `(ns,id,rev=N)`;
2. append/commit revision `N+1`;
3. lazy freshness recomputation must produce **STALE** unless the view is recomputed.

**F-02-L2-02 — Missing basis**

Remove or make unavailable the required canonical record/revision basis.

Expected result: **UNRESOLVABLE**, never guessed CURRENT.

**F-02-L2-03 — Content contradiction**

Present a declared revision whose resolved content identity conflicts with its required CID/content evidence.

Expected result: **CONFLICTED** or **UNRESOLVABLE** according to whether the contradictory basis can be fully attributed.

**F-02-L2-04 — Reconstruction after derived-view loss**

Remove the derived projection while retaining canonical durable records/revisions and their required lineage.

Expected result: the projection can be reconstructed from the existing durable continuity substrate, within the guarantees of that corridor.

**F-02-L2-05 — Identity collapse**

Replace a provider/source identifier while retaining the same canonical record/revision.

Expected result: the Data adapter does not manufacture a new canonical identity solely from source replacement.

## 11. Unknown / deferred items

- exact universal physical storage shape for BasisRef mappings;
- exact relation vocabulary for every lineage/provenance corridor;
- final minimum information-loss representation;
- AuthorityCitation physical storage/join remains UNKNOWN / DEFERRED;
- merge/split semantic rules remain owner-scoped and are not inferred by Data;
- Product Instance full export/restore remains incomplete beyond vault-level continuity;
- cross-provider equivalence remains outside this adapter;
- runtime self-knowledge joins remain gated by the central Stage-E readiness sequence.

## 12. Boundary and non-authority statement

This adapter:

- does not create a second identity store;
- does not make persistent projections canonical;
- does not evaluate Authority;
- does not define World semantic identity;
- does not define Work, Capability, Composition or Evolution meaning;
- does not alter Ω law;
- does not implement runtime joins;
- does not claim live external/provider proof.

It exposes existing durable basis references to the generic L1 freshness machinery while retaining Data ownership of durable continuity.

## 13. L2 closure verdict

All required L2 characterization items are explicitly named:

| Closure item | Result |
|---|---|
| canonical/current source identity | **CLOSED** — existing vault durable record/revision |
| comparison token | **CLOSED** — `(ns,id,rev)`, optional CID |
| resolver | **CLOSED** — existing vault/read/reconstruction authority |
| STALE condition | **CLOSED** |
| UNRESOLVABLE condition | **CLOSED** |
| evidence refs | **CLOSED** |
| falsifier | **CLOSED** as proof target; execution remains downstream |
| UNKNOWN / DEFERRED | **EXPLICIT** |

**CFA-02 Stage-E L2 adapter: CLOSED — design-characterized / implementation and live-proof deferred.**
