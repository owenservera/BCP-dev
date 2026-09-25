# Self-Knowledge / Freshness Core — Research Result

> Classification: DERIVED — CURRENT RESEARCH / DESIGN CONVERGENCE
> Status: research complete; no production implementation; no Ω law changes.
> Date: 2026-09-25
> Lane: `docs/destination/self-knowledge-core/`

## 1. Research execution and source basis

The launch prompt was executed against the current repository baseline.

The research branch `research/D-self-knowledge` was verified to be **5 commits ahead and 0 behind** `main`, with merge/base commit:

`d57d5bce13925828b98fc86800b4f97dd6dafa6e`.

A direct local `git clone` was attempted but the execution container could not resolve `github.com`. Source inspection therefore used the authenticated GitHub repository interface against the same current `main` baseline and the destination research branch. The local falsifier harness below was run locally from the resulting research model; no repository production code was changed or executed as a substitute for unavailable owner-machine runs.

Primary evidence read:

- `docs/destination/system-intelligence/pass-3/README.md`
- `docs/destination/system-intelligence/pass-3/EXPERIMENT-MATRIX.md`
- `docs/destination/system-intelligence/pass-3/indexes/DEPENDENCIES.json`
- `docs/destination/DATA-MEMORY-CONTEXT-RECONCILIATION.md`
- `docs/destination/WORLD-WORKSPACE-CANVAS-RECONCILIATION.md`
- `docs/destination/REQUIREMENT-EVIDENCE-TRACEABILITY.md`
- `omega-baseline/omega-final/plugins/vivim-mind/src/index.ts`
- `omega-baseline/omega-final/plugins/vivim-mind/src/derive.ts`
- `omega-baseline/omega-final/plugins/vivim-mind/plugin.json`
- `omega-baseline/omega-final/plugins/vivim-mind/test/mind.test.ts`
- `omega-baseline/omega-final/plugins/vivim-vault/src/sql.ts`
- `omega-baseline/omega-final/plugins/vivim-vault/src/changelog.ts`
- `omega-baseline/omega-final/plugins/vivim-law/src/policy.ts`
- `omega-baseline/omega-final/docs/decisions/D-423-process-self-model.md`
- `omega-baseline/omega-final/docs/decisions/D-424-process-publish-seam.md`
- `docs/agent-system/workstreams/WS-003/PHASE-1-ONTOLOGY-BASELINE.md`

The parallel canonical World/Object lane and Product Instance lane were also checked; both remain scaffold-only research lanes, so this result does not depend on unfinished outputs.

## 2. What exists today

### 2.1 `vivim.mind` is already the correct ownership boundary

Current `vivim.mind` is a read-only plugin. It derives a `WorldModel` from:

- `law.registry@1`;
- bounded vault reads;
- composition configuration.

Its derivation machinery is pure: `buildWorldModel(evidence, config, opts)` has no I/O and no internal clock. Snapshot, query, control, and portrait are multiple views over the same derivation.

The current tests prove deterministic repeated derivation over unchanged evidence. The plugin explicitly refuses to guess: malformed evidence causes degradation rather than fabrication.

This is the correct foundation to extend.

### 2.2 The vault already supplies strong canonical revision identity

The Ω vault has:

- `objects(ns,id,rev,cid,...)`;
- cold-history preservation;
- append-only Merkle-linked changelog;
- content-addressed blobs;
- provenance reference edges `{ns,id,rev}`;
- latest-revision and exact-revision reads.

A source revision therefore already has a stable identity suitable for a self-knowledge basis reference. The minimal basis reference should use the strongest available source token, not a timestamp.

### 2.3 The current mind model does not retain a complete basis

The current `WorldModel` contains `v` and `t`, but those are not sufficient freshness proof:

- `v` is a deterministic function of a few evidence counts, not a complete source basis;
- `t` is supplied clock time;
- plugin versions in the kernel view are honestly reported as `"unknown"`;
- the model does not expose the exact vault revisions/CIDs or contract/manifest/policy dependency vector that produced the result.

Therefore a previously persisted `WorldModel` cannot, from its current shape alone, prove that it still represents the same canonical basis after a restart or later source change.

### 2.4 D-423/D-424 establish an important precedent

D-423 keeps runtime self-knowledge and the development filesystem/git genome as separate evidence classes.

D-424 defines a runtime-visible process snapshot that carries a source-tip SHA and generation time; readers compare the recorded source-tip against the live tip and report a stale snapshot as stale, never current.

That is a useful *pattern*, but the ontology baseline explicitly says D-424 is not universal Ω freshness law. This research must therefore generalize the **mechanism**, not silently promote D-424 into constitutional law.

## 3. Smallest semantic model

The smallest reusable unit is a **derived-view envelope**, not a new ontology.

Conceptual shape:

```ts
interface DerivedView<T> {
  value: T;

  // Canonical sources actually used by the derivation.
  basisRefs: BasisRef[];

  // Digest of the canonicalized basis vector + dependency vector + derivation identity.
  basisDigest: string;

  // Exact immutable/versioned dependency tokens needed to reproduce/validate the view.
  dependencyVersions: Record<string, string>;

  // Informational only; never a freshness proof.
  computedAt: number;

  // Immutable identity/version of the derivation algorithm and output contract.
  derivationRef: string;

  // Derived diagnostic, recomputed on validation; persisted value is advisory only.
  freshness: "CURRENT" | "STALE" | "CONFLICTED" | "UNRESOLVABLE";

  // Local diagnostic details; not an authority or epistemic system.
  conflicts?: ConflictDiagnostic[];
}
```

### 3.1 `BasisRef`

For a vault-backed source, use the existing canonical revision identity:

```ts
interface BasisRef {
  sourceKind: string;     // local derivation domain, not a global ontology
  sourceId: string;       // e.g. namespace/object id
  rev: number;
  contentDigest: string;  // vault CID where available
}
```

For a source with no revision mechanism, the adapter must supply the strongest available observation token (for example an observation id + payload digest + observed-at), and that source is inherently less authoritative for currentness.

### 3.2 `basisDigest`

The digest should be computed over a canonical encoding of:

```text
canonical(basisRefs, dependencyVersions, derivationRef)
```

This is a compact equivalence token.

It is **not** the authority source. The source revisions, dependency records, and derivation identity remain the inspectable evidence.

### 3.3 `dependencyVersions`

The vector must cover dependencies whose change can alter the meaning of the derived result, including at least:

- contract/version identity;
- plugin manifest version **and/or immutable content digest**;
- policy version/content digest;
- relevant composition/config revision.

Version-only checking is insufficient when a mutable artifact can change without changing its declared version. Where possible, use an immutable content-addressed token.

### 3.4 `derivationRef`

This is necessary even if dependency versions are present.

A new derivation algorithm can produce different output from exactly the same source basis. Therefore the derived artifact must identify the derivation algorithm/output contract version that produced it.

This closes a subtle failure mode:

```same source basis + changed derivation algorithm
                 ↓
       old result looks "fresh"
```

It must instead become `STALE` or be recomputed.

## 4. Freshness rule

**Freshness is a comparison result, not a stored fact.**

On every load/serve of a persisted derived view:

1. Load its `basisRefs`, `dependencyVersions`, and `derivationRef`.
2. Resolve current values for those basis/dependency tokens.
3. Recompute the comparison.
4. Do not trust a previously stored `freshness: "CURRENT"`.
5. Return the current diagnostic state.

Recommended diagnostic meanings:

| State | Meaning |
|---|---|
| `CURRENT` | Every required basis/dependency token matches and the derivation is still valid. |
| `STALE` | A known basis/dependency/derivation token changed. |
| `CONFLICTED` | The current sources are present but the derivation detects incompatible evidence for the same semantic claim. |
| `UNRESOLVABLE` | A required basis/dependency can no longer be resolved, so currentness cannot be proved. |

These labels are **local freshness diagnostics**. They do not create a new global epistemic ontology or authority layer.

### Critical invariant

> A derived view may only say CURRENT when the current basis is actually checked against its recorded basis.

A timestamp, cached flag, successful serialization, or previously green computation is never enough.

## 5. Invalidation: no mandatory global bus

A global invalidation bus is not required for correctness.

The smallest correct mechanism is:

```text
persisted derived view
       ↓
lazy basis check at read/serve
       ↓
CURRENT? ───── yes ───→ serve
       |
       no
       ↓
known current basis?
       ├── yes → recompute → persist replacement → serve
       └── no  → return STALE / CONFLICTED / UNRESOLVABLE
```

Push-style invalidation events may be added later as a performance optimization, but correctness must not depend on them.

Why this is preferable:

- no repository-wide event coupling;
- no missed-event correctness hole;
- one mechanism works after restart;
- new derived-view producers opt into the envelope without changing every canonical source;
- invalidation remains a property of the derived consumer and its declared basis.

## 6. Recomposition / recomputation

When a basis change is detected and all current inputs remain readable:

1. Re-run the same deterministic derivation against the current evidence.
2. Produce a new basis vector.
3. Produce a new basis digest.
4. Carry the current dependency vector and derivation identity.
5. Replace the persisted derived view atomically.

Do not mutate canonical source records as part of self-knowledge recomputation.

When recomputation cannot be completed because evidence is unavailable or contradictory, retain the prior artifact as historical evidence if desired, but do not serve it as CURRENT.

## 7. External observation TTL

TTL belongs only to **observation freshness**, not canonical currentness.

For an external source with no revision/version comparison mechanism, an observation may carry an explicit retention/observation window:

```text
observedAt + observationTTL
```

Rules:

- before TTL expiry: the observation is merely *recent enough to use under that observation contract*;
- after TTL expiry: it becomes `STALE`;
- not-yet-expired does **not** prove that the external world is unchanged;
- TTL can therefore never upgrade an unversioned external observation to an authoritative CURRENT claim by itself.

This avoids the classic error:

```TTL not expired  ≠  source proven unchanged```

## 8. Contradictory sources

Contradiction detection must stay local to the derivation that understands the semantic claim.

Do **not** add a universal `CONTRADICTED` ontology state here; the ontology baseline explicitly keeps that producer-dependent.

Instead:

- a derivation defines the semantic keys it is allowed to compare;
- it records conflicting current source refs in `conflicts`;
- `freshness` becomes `CONFLICTED`;
- the derived view does not become an authority deciding which source is true.

Example diagnostic shape:

```ts
interface ConflictDiagnostic {
  semanticKey: string;
  refs: string[];
  reason: string;
}
```

The important separation is:

```
conflict diagnosis → informs the reader
authority/policy      → decides what may be done
```

Self-knowledge never crosses that boundary.

## 9. Persisted derived views and restart

Persistence is compatible with trustworthiness only when persistence stores the **basis**, not just the output.

Required restart behavior:

```text
persisted value + basis metadata
             ↓
restart
             ↓
revalidate basis
             ↓
CURRENT / STALE / CONFLICTED / UNRESOLVABLE
```

A persisted `freshness: CURRENT` bit is only a cache hint.

A restart with an unchanged basis must remain CURRENT.

A restart after a basis change must not remain CURRENT.

This directly addresses the failure mode where an application stores a derived JSON blob, reloads it later, and implicitly treats it as current because it deserializes successfully.

## 10. Current Ω gaps exposed by the research

The existing architecture already has most of the primitives, but several dependency adapters are not yet complete:

| Gap | Current situation | What is required |
|---|---|---|
| Canonical world revision token | Vault revisions/CIDs exist; world-object canonical revision contract is still in research | Stable World/Object `BasisRef` adapter |
| Contract version vector | Contracts are versioned, but `vivim.mind` does not expose a dependency vector | Deterministic dependency token reader |
| Plugin manifest identity | Manifest has version; immutable tree/content identity is a separate kernel concern | Version + immutable digest where needed |
| Policy dependency | Policy is versioned data (`LAW_POLICY_V1.version = 1.9.0`) but mind output does not capture it | Policy version/digest adapter |
| Derivation identity | Current mind identifies its plugin but its WorldModel does not carry a derivation pin | Stable derivation/output contract id |
| Contradiction semantics | No universal producer exists | Domain-local conflict diagnostics only |
| External observation freshness | No universal TTL law | Source-specific observation contract |
| Persisted derived artifact | Current `vivim.mind` recomputes per call rather than persisting a generic view envelope | Optional derived-view cache/persistence layer |

## 11. Architectural recommendation

Keep the existing decomposition:

```
canonical sources
   ↓
domain derivation
   ↓
generic DerivedView envelope
   ↓
lazy validation
   ↓
recompute or explicit stale/conflict state
```

The generic machinery should be a small pure utility/package plus thin adapters, while `vivim.mind` remains the domain self-knowledge plugin.

Do **not** introduce:

- a second ontology;
- a second provenance store;
- a global freshness registry;
- a mandatory invalidation bus;
- a self-knowledge authority role;
- LLM calls in the freshness decision path.

## 12. Implementation blueprint (research-only, not landed)

### Phase A — pure kernel

Define a tiny, runtime-neutral module for:

- `DerivedView<T>` shape;
- canonical serialization;
- basis digest;
- dependency vector comparison;
- freshness computation;
- conflict diagnostics;
- explicit recomputation outcome.

No host dependencies.

### Phase B — source adapters

Add readers for:

1. Ω vault revision/CID;
2. canonical world-object revision;
3. contract/version identity;
4. plugin manifest immutable identity;
5. policy version/digest;
6. derivation version.

Every adapter should fail closed when it cannot establish the required token.

### Phase C — mind integration

Have `vivim.mind` emit or wrap its WorldModel/portrait with the derived-view metadata rather than maintaining an independent freshness subsystem.

The existing pure `buildWorldModel` should remain the derivation function.

### Phase D — optional persistence

If a derived result is expensive enough to persist, store the value plus the complete basis envelope in a reserved derived namespace.

On load, always validate before serving as CURRENT.

### Phase E — proof suite

Add bounded deterministic tests for every falsifier in `FALSIFIERS.md`, then add cross-workstream integration tests once the World/Object and Product Instance research packets are available.

No code should be promoted by this research result itself.

## 13. Why this is the smallest design

The design deliberately reuses existing mechanisms:

- vault revision + CID instead of inventing source identity;
- existing plugin/contract version semantics instead of a new registry;
- existing policy versioning instead of a second policy model;
- existing pure mind derivation instead of a new self-model engine;
- lazy comparison instead of a global invalidation bus;
- local conflict diagnostics instead of a universal contradiction ontology.

The only genuinely new conceptual object is the **DerivedView evidence envelope** that records what produced a derived answer and how to revalidate it.

That is enough to make the central statement provable:

> “This self-description is current” means “the exact basis that produced it still matches the current basis.”

## 14. Open frontier

1. Final World/Object revision contract from lane B.
2. Canonical immutable contract/version identity for every dependency kind.
3. Exact plugin content-hash exposure from the executable manifest/tree work.
4. Policy digest/version adapter exposed to self-knowledge without giving mind policy authority.
5. Domain-specific contradiction semantics and human-readable conflict explanation.
6. Source adapters for external observations and their TTL contracts.
7. Persistence/retention rules for derived-view caches.
8. Bounding strategies when a world projection depends on very large source sets.
9. Atomic recompute/replacement semantics under concurrent source changes.
10. Whether a future push invalidation hint path is worth the complexity after lazy validation is measured.
11. Cross-domain proof that a canonical object can change revision while every dependent self-view becomes non-current without any global event bus.
12. Product UX for showing “current / stale / conflict / cannot verify” without exposing unnecessary internal architecture.

## 15. Final finding

The repository does not need a new self-knowledge architecture.

It needs a **small freshness contract around existing deterministic derivations**:

```
basisRefs
   + dependencyVersions
   + derivationRef
   ↓
basisDigest
   ↓
lazy comparison
   ↓
CURRENT / STALE / CONFLICTED / UNRESOLVABLE
   ↓
recompute when provable
```

The essential rule is:

**Freshness is computed from canonical basis comparison; time is metadata; persistence is not proof; self-knowledge is descriptive, never authoritative.**

This satisfies Pass 3 E8 and the destination self-knowledge charter without inventing another ontology, provenance system, authority model, or mandatory global invalidation bus.
