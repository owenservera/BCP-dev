# Stage E L1 — DerivedView / Freshness Contract Closure
## 2026-09-27

> Status: **L1 COMPLETE — GENERIC CONTRACT CLOSED FOR DOWNSTREAM ADAPTER WORK**
> Owner: Architecture Steward
> Lead consultation: CFA-03 Semantic Continuity
> Scope: generic DerivedView/freshness semantics only; domain basis adapters remain L2.
> Authority: derived readiness contract; not Ω law and not semantic authority.
> Baseline main: `02ba4dae32623fc44e183ceb1c014473206903e5`

## 1. Purpose

Close the generic L1 contract required by Stage-E readiness without freezing domain-specific source adapters or implementing runtime joins.

L1 establishes:

`recorded basis + dependencies + derivation identity
→ deterministic basis digest
→ current-basis comparison
→ CURRENT / STALE / CONFLICTED / UNRESOLVABLE`

The contract is deliberately reusable across self-knowledge views and does not create a second ontology, freshness registry, provenance authority or invalidation bus.

## 2. Evidence basis

The contract is grounded in the current repository research/design:

- `docs/destination/self-knowledge-core/RESEARCH.md`
- `docs/destination/system-intelligence/pass-3/SELF-KNOWLEDGE-DESIGN.md`
- `AGENTS_CONTEXT/ARCHITECTURE_STEWARD/SELF-KNOWLEDGE-AND-DEVELOPMENT-GROUNDING-DESIGN.md`
- `BOUNDARY-DESIGN-SYSTEM/STAGE-E-READINESS-CONTRACT-2026-09-27.md`
- `BOUNDARY-DESIGN-SYSTEM/GRAPH-W1-E-SELF-KNOWLEDGE-READINESS-ASSESSMENT-RECEIPT-2026-09-27.md`

Existing evidence establishes that `vivim.mind` is a deterministic, read-only derivation boundary, while the current `WorldModel` does not retain enough basis identity to prove currentness after restart or source change.

No claim of runtime implementation or production readiness is made here.

## 3. Minimum DerivedView envelope

Conceptual minimum:

```text
DerivedView<T>
  viewId
  result
  basisRefs[]
  basisDigest
  dependencyVersions[]
  derivationRef
  computedAt
  freshness
  conflicts[]
  unknowns[]
  evidenceRefs[]
```

Semantics:

- `viewId` identifies the derived view kind/instance within its owning domain.
- `result` is the derived descriptive result.
- `basisRefs[]` identifies the canonical/observational inputs actually used.
- `basisDigest` is a reproducible digest of the recorded basis/dependency/derivation identity.
- `dependencyVersions[]` records relevant contract, manifest, policy, composition/config or other owner-defined dependency tokens.
- `derivationRef` identifies the derivation algorithm/output-contract version that produced the result.
- `computedAt` is informational metadata only.
- `freshness` is a diagnostic result that MUST be recomputable; it is not authoritative state.
- `conflicts[]` carries derivation-local contradiction diagnostics.
- `unknowns[]` carries unresolved basis/derivation conditions.
- `evidenceRefs[]` points to the evidence supporting the derivation without becoming authority.

No field creates semantic ownership outside the existing owner CFA.

## 4. BasisRef minimum

Conceptual minimum:

```text
BasisRef
  sourceKind
  sourceId
  revisionToken
  contentDigest?
  observedAt?
  observationTTL?
```

Rules:

1. A revisioned canonical source should use its strongest existing revision identity.
2. Where available, pair a revision with an immutable content identity/digest.
3. An unversioned external observation may carry observation metadata, but TTL does not prove that the external source remained unchanged.
4. `BasisRef` is a local source reference, not a universal identity system.
5. The exact mapping of each domain's source to `BasisRef` is L2-owned by the responsible CFA.

## 5. Dependency identity

Dependencies are explicit only where their change can alter the derived result.

The generic vector may include:

```text
dependencyKey
dependencyVersion
immutableDigest?
ownerRef
sourceRef
```

At minimum, participating self-knowledge derivations should characterize, where applicable:

- contract/version identity;
- plugin manifest version and immutable content identity when needed;
- policy version/digest;
- relevant composition/config revision.

Version-only identity is insufficient when the underlying artifact can mutate without a version change and an immutable token is available.

Dependency vectors do not create a repository-wide invalidation bus.

## 6. Derivation identity

`derivationRef` is mandatory for freshness proof.

It identifies the immutable/versioned derivation mechanism and output contract that produced the result.

Therefore:

```text
same source basis + changed derivation identity
→ prior result cannot remain CURRENT
```

A derivation change may be handled by recomputation or explicit STALE state according to the owning runtime path.

## 7. Basis digest

The digest is computed over a canonical representation of:

```text
canonical(
  basisRefs
  + dependencyVersions
  + derivationRef
)
```

Canonicalization requirements:

- deterministic ordering of equivalent reference collections;
- stable field encoding;
- no wall-clock or transient process data;
- no dependence on object/property insertion order;
- source identities remain individually inspectable even though a compact digest is produced.

The digest is an equivalence token for revalidation. It is not authority.

The exact cryptographic/hash implementation remains a central mechanical implementation detail and is not frozen by L1.

## 8. Freshness computation

Freshness MUST be computed by comparing recorded basis/dependency/derivation identity with currently resolvable values.

Deterministic decision order:

1. If any required basis/dependency cannot be resolved, return **UNRESOLVABLE**.
2. Else if the domain derivation detects an owner-defined contradiction among current inputs, return **CONFLICTED**.
3. Else if any required basis/dependency/derivation identity differs from the recorded envelope, return **STALE**.
4. Else return **CURRENT**.

Additional diagnostics must retain the concrete mismatch/conflict/unknown reasons so the state enum never becomes a lossless substitute for evidence.

This ordering is a deterministic diagnostic rule, not an epistemic hierarchy.

## 9. Mandatory state meanings

| State | Exact meaning |
|---|---|
| CURRENT | All required current basis/dependency identities resolve and match the recorded envelope, with no unresolved or owner-defined contradictory condition. |
| STALE | Required current identities are resolvable but at least one relevant identity changed. |
| CONFLICTED | Required current inputs are resolvable, but the derivation detects an owner-defined contradiction for a semantic key it is allowed to compare. |
| UNRESOLVABLE | A required basis/dependency cannot be resolved sufficiently to establish currentness. |

Important separations:

- CURRENT does not mean authoritative truth.
- STALE does not mean false.
- UNRESOLVABLE does not mean failure of the underlying source.
- CONFLICTED does not authorize one source over another.

## 10. Persistence and restart

A persisted derived view is trustworthy for currentness only when its basis envelope is persisted with it.

Required restart behavior:

```text
persisted result + recorded basis
→ restart/load
→ resolve current basis
→ recompute freshness
→ serve current result OR explicit non-current state
```

A stored `freshness = CURRENT` value is only a cache hint.

Successful deserialization, a recent timestamp, or previous successful computation is never sufficient proof of CURRENT.

## 11. Lazy validation

Correctness does not require a global invalidation bus.

Minimum mechanism:

```text
load/serve
→ basis validation
→ CURRENT
   OR
→ recompute when current basis is fully resolvable
   OR
→ explicit STALE / CONFLICTED / UNRESOLVABLE
```

Push invalidation may be added later as an optimization, but missed or delayed invalidation events must not create a correctness hole.

## 12. Recompute semantics

When a recorded basis is known to have changed and current inputs are available:

1. execute the same declared derivation against the current inputs;
2. produce a new basis vector;
3. recompute the basis digest;
4. carry current dependency identity and derivation identity;
5. persist the new derived envelope atomically where persistence is used.

The recomputation path does not mutate canonical source records.

When recomputation cannot establish a valid result, the prior artifact may remain historical evidence, but it must not be served as CURRENT.

## 13. External observation boundary

External sources without a comparable canonical revision mechanism are weaker evidence.

A source adapter may expose:

`observedAt + observationTTL`

but the contract forbids:

`TTL not expired Rightarrow canonical source unchanged`

An observation can be recently usable under its own source contract without establishing canonical CURRENT.

Therefore L2 must state explicitly whether an external observation contributes:

- a currentness-comparable token;
- observation freshness only;
- or insufficient basis for CURRENT.

## 14. Conflict semantics

Contradiction remains local to the derivation that understands the semantic claim.

Minimum diagnostic:

```text
ConflictDiagnostic
  semanticKey
  refs[]
  reason
```

The generic contract does not define a universal contradiction ontology.

The separation is:

```text
conflict diagnosis → informs reader
authority/policy    → decides what may be done
```

Self-knowledge must never promote itself to the decision-maker.

## 15. Ownership / boundary discipline

Central L1 owns only the generic mechanics/contract:

- envelope shape;
- basis comparison;
- digest determinism;
- dependency vector structure;
- derivation identity requirement;
- freshness state semantics;
- restart/lazy-validation rule.

L1 does NOT choose:

- domain canonical identities;
- World/Object revision semantics;
- authority/policy meaning;
- capability/provider/realization observation meaning;
- composition/manifest survivor rules;
- change/compatibility semantics;
- runtime generation semantics.

Those are explicit L2 adapter responsibilities.

## 16. L1 readiness mapping

| Stage-E gate | L1 outcome |
|---|---|
| E-R1 Derived-view contract | **CLOSED BY L1** |
| E-R2 Basis identity concept | **CLOSED GENERICALLY; domain mapping L2** |
| E-R3 Deterministic basis digest rule | **CLOSED GENERICALLY; algorithm implementation not frozen** |
| E-R4 Dependency identity | **CLOSED GENERICALLY; adapters L2** |
| E-R5 Derivation identity | **CLOSED** |
| E-R6 Freshness computed, not trusted | **CLOSED** |
| E-R7 Freshness vocabulary | **CLOSED** |

L1 closure does **not** make Stage E READY. E-R8 through E-R17 remain open and require later lanes.

## 17. L1 falsifiers

These are closure requirements for the downstream L5 proof harness:

- changing a required source revision/digest prevents an old result from remaining CURRENT;
- changing a relevant dependency identity prevents an old result from remaining CURRENT;
- changing `derivationRef` prevents an old result from remaining CURRENT;
- deleting/unresolving a required basis yields UNRESOLVABLE;
- an owner-defined contradiction yields CONFLICTED without source selection;
- a persisted CURRENT hint is insufficient after restart;
- TTL alone cannot establish canonical currentness for an unversioned external source;
- self-knowledge cannot grant permission or mutate Ω law.

L1 defines these falsifiers; L5 must make them executable.

## 18. Residual UNKNOWN / DEFERRED

**UNKNOWN**

- exact source-specific revision/CID adapters;
- exact plugin immutable identity exposure;
- exact policy digest adapter;
- exact composition/config dependency adapter;
- exact runtime generation/source token;
- final hash primitive choice;
- concurrent source-change/recompute atomicity;
- storage/retention policy for persisted derived views.

**DEFERRED**

- runtime self-knowledge implementation;
- cross-plane grounding;
- graph bundle implementation;
- falsifier harness implementation;
- bounded pilots;
- final Stage-E gate audit.

**CONFLICTED**

None established by the L1 evidence.

## 19. Non-authority statement

This contract describes how derived self-knowledge can establish the provenance and currentness of its own result.

It does not authorize actions, change Ω law, decide semantic truth, replace CFA ownership, or create a new canonical architecture network.

`descriptive self-knowledge != semantic authority != live authorization`

## 20. Completion

**L1 RESULT: COMPLETE**

The generic DerivedView/freshness contract is now closed enough for independent L2 basis-adapter characterization.

Next bounded work is **L2 — source and runtime basis adapters**.

No runtime self-knowledge joins are authorized by this document.
