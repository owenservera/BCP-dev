# Stage E L1 — DerivedView / Freshness Contract
## 2026-09-27

> Status: **COMPLETE — L1 CONTRACT FROZEN / STAGE E REMAINS NOT READY**
> Owner: Architecture Steward
> Lead input: CFA-03 Semantic Continuity Steward
> Scope: readiness design/contract only. No runtime-join implementation.
> Authority: derived Architecture Steward contract; not Ω law and not semantic authority.

## 1. Purpose

Freeze the smallest reusable contract needed to prove that a derived self-knowledge view is current relative to the basis that produced it.

The contract extends the existing `vivim.mind` derivation boundary with explicit basis, dependency and derivation identity. It does not create a second self-knowledge engine, graph, ontology, authority system, freshness registry or mandatory invalidation bus.

The central invariant is:

> **A derived view may be marked CURRENT only when its recorded basis, dependency vector and derivation identity compare successfully with the current required basis.**

Stored freshness is a cache hint, never proof.

## 2. Evidence basis

The L1 closure is derived from current repository evidence including:

- `docs/destination/self-knowledge-core/RESEARCH.md`
- `docs/destination/self-knowledge-core/STATE.md`
- `docs/destination/self-knowledge-core/LAUNCH-PROMPT.md`
- `docs/destination/system-intelligence/pass-3/SELF-KNOWLEDGE-DESIGN.md`
- `docs/destination/system-intelligence/pass-3/DESIGN-CHARACTERIZATION.md`
- `AGENTS_CONTEXT/ARCHITECTURE_STEWARD/SELF-KNOWLEDGE-AND-DEVELOPMENT-GROUNDING-DESIGN.md`
- `AGENTS_CONTEXT/ARCHITECTURE_STEWARD/SUBAGENTS/SELF-KNOWLEDGE-COMMAND-COMPILER/STATE.md`
- `AGENTS_CONTEXT/ARCHITECTURE_STEWARD/SUBAGENTS/SELF-KNOWLEDGE-COMMAND-COMPILER/BOUNDARY-ROUND-2-ADDENDUM-2026-09-27.md`
- `AGENTS_CONTEXT/ARCHITECTURE_STEWARD/SUBAGENTS/DATA-MODEL-STEWARD/CORE-TOOL-DESIGN.md`
- existing Graph Attachment Wave-1 A/B/C/D receipts
- current Stage-E readiness contract and assessment receipt.

The repository already provides the key precedent that a source revision/content identity is stronger than a timestamp, and that D-424's source-tip comparison demonstrates the stale-snapshot pattern without becoming universal Ω freshness law.

## 3. Contract boundary

### 3.1 DerivedView

Conceptual contract:

```ts
interface DerivedView<T> {
  value: T;
  viewId: string;

  basisRefs: BasisRef[];
  basisDigest: string;

  dependencyVersions: DependencyVersion[];

  derivationRef: DerivationRef;

  computedAt: number;

  freshness: FreshnessState;

  conflicts: ConflictDiagnostic[];
  unknowns: UnknownDiagnostic[];
  evidenceRefs: string[];
}
```

Field meanings:

- `value`: derived result. It does not become canonical merely because it is persisted.
- `viewId`: stable identity of this derived-view product/contract. It is not the identity of the semantic subject it describes.
- `basisRefs`: exact canonical/observational inputs actually required to reproduce or validate the result.
- `basisDigest`: deterministic digest of the canonicalized basis vector, dependency vector and derivation identity.
- `dependencyVersions`: exact dependency tokens whose change can alter the result.
- `derivationRef`: immutable/versioned identity of the derivation algorithm and output contract.
- `computedAt`: informational timing metadata only.
- `freshness`: recomputed diagnostic, not trusted state.
- `conflicts` / `unknowns`: unresolved evidence conditions retained for inspection; they never grant authority.
- `evidenceRefs`: attributable evidence pointers supporting the derived result.

### 3.2 BasisRef

Minimum generic shape:

```ts
interface BasisRef {
  basisId: string;
  ownerRef: string;
  sourceKind: string;
  sourceRef: string;

  canonicalRef?: string;
  revisionRef?: string;
  contentDigest?: string;

  observationRef?: string;
  observedAt?: number;

  required: boolean;

  evidenceRefs: string[];
}
```

Rules:

1. A canonical revision/content identity is preferred whenever the source supports it.
2. `sourceRef` identifies the attributable source; it is not a universal ontology identifier.
3. `revisionRef` identifies a source revision, not semantic identity.
4. `contentDigest` identifies exact content where that distinction is meaningful.
5. Unversioned external observations may use `observationRef + observedAt + payload/content digest`, but their currentness is constrained by their adapter contract.
6. `required=false` permits optional evidence to be absent without converting the entire view to UNRESOLVABLE; the derivation must explicitly define whether the result remains materially valid.
7. An adapter must not substitute a weaker token when a stronger owner-defined revision/CID exists.
8. BasisRef semantics are generic; the domain-specific meaning of each source remains with the responsible CFA and is closed during L2.

### 3.3 DependencyVersion

Use an explicit vector rather than a global dependency registry:

```ts
interface DependencyVersion {
  dependencyId: string;
  ownerRef: string;
  kind: "CONTRACT" | "MANIFEST" | "POLICY" | "COMPOSITION" | "IMPLEMENTATION" | "OTHER";
  version?: string;
  contentDigest?: string;
  revisionRef?: string;
  required: boolean;
  evidenceRefs: string[];
}
```

Rules:

- include only dependencies whose change can alter the derivation result;
- mutable/versioned artifacts should use an immutable digest when needed to make identity deterministic;
- dependency vectors are bounded by the derivation, not a universal invalidation bus;
- missing required dependency identity produces UNRESOLVABLE, not a guessed substitute.

### 3.4 DerivationRef

Minimum conceptual shape:

```ts
interface DerivationRef {
  derivationId: string;
  ownerRef: string;
  contractId: string;
  version: string;
  contentDigest?: string;
}
```

A derivation change is independently freshness-relevant. Equal source basis + changed derivation identity cannot leave an old result CURRENT without recomputation.

## 4. Canonical basis digest

The digest rule is frozen as a deterministic mechanism, while source-specific adapters remain L2-owned.

### Canonical input

```text
canonical(
  viewId,
  basisRefs,
  dependencyVersions,
  derivationRef
)
```

Canonicalization rules:

1. UTF-8 canonical JSON representation.
2. Object keys are ordered lexicographically.
3. Set-like arrays (`basisRefs`, `dependencyVersions`, `evidenceRefs`) are sorted by their stable identity keys before serialization.
4. Arrays whose order is semantically meaningful retain their declared order.
5. Undefined/absent optional fields are omitted consistently; explicit null remains distinct when the contract declares null meaningful.
6. Numeric and boolean representations use standard JSON forms.
7. No timestamps, incidental paths, process IDs or nondeterministic ordering participate unless explicitly part of a basis identity.
8. The serialized canonical bytes are hashed with **SHA-256**.
9. The digest is represented as lowercase hexadecimal.

Therefore:

```text
basisDigest =
  SHA256(
    canonicalJSON(
      viewId,
      sorted basisRefs,
      sorted dependencyVersions,
      derivationRef
    )
  )
```

This is an equivalence/check token. The underlying basis references remain the inspectable evidence.

Existing repository evidence already uses SHA-256 over canonicalized serialized material for replayable identity/digest purposes, so L1 does not introduce a novel cryptographic primitive.

## 5. Freshness state vocabulary

The L1 contract freezes exactly four derived freshness states:

| State | Meaning | Required behavior |
|---|---|---|
| **CURRENT** | Every required basis/dependency token resolves and matches, derivation identity matches, and no owner-defined contradiction invalidates the result. | Result may be served as current derived knowledge. |
| **STALE** | At least one required, resolvable basis/dependency/derivation token differs from the recorded basis. | Result cannot be served as CURRENT; recompute when current inputs are available. |
| **CONFLICTED** | Required current inputs are available but the derivation detects an owner-defined contradiction for a semantic key it is authorized to compare. | Preserve conflicting refs/diagnostics; do not select authority. |
| **UNRESOLVABLE** | A required basis/dependency cannot be resolved sufficiently to establish currentness. | Do not guess; retain historical result only as historical evidence if desired. |

These states are freshness diagnostics, not a replacement for the repository's orthogonal epistemic states:

```text
OBSERVED | DERIVED | PROPOSED | UNKNOWN | CONFLICTED
```

Freshness and epistemic status must never be collapsed.

### Precedence when evaluating a view

Evaluation should first detect explicit contradiction. Otherwise:

```text
CONFLICTED
  > UNRESOLVABLE
  > STALE
  > CURRENT
```

The ordering is diagnostic precedence, not an authority ranking.

## 6. Freshness computation

For a persisted DerivedView:

1. Read the stored `basisRefs`, `dependencyVersions` and `derivationRef`.
2. Resolve current owner-provided basis tokens.
3. Recompute the current dependency vector.
4. Compare the current derivation identity.
5. Recompute the canonical basis digest.
6. Apply owner-defined contradiction detection.
7. Emit one of the four freshness states.
8. Treat any stored `freshness` value only as a cache hint.

The system must never infer CURRENT merely because:

- the artifact deserializes;
- `computedAt` is recent;
- its stored freshness says CURRENT;
- its previous digest was valid;
- the same file/path still exists.

## 7. Restart behavior

Persisted derived views are valid after restart only if their basis can be revalidated.

Required sequence:

```text
persisted value + basis metadata
            ↓
restart/load
            ↓
resolve current basis
            ↓
compute freshness
            ↓
CURRENT / STALE / CONFLICTED / UNRESOLVABLE
```

A restart with unchanged required basis remains CURRENT.

A restart after a known basis change becomes STALE or is recomputed before being served.

A restart that cannot resolve a required basis becomes UNRESOLVABLE rather than guessed CURRENT.

No process-local cache is sufficient evidence of currentness.

## 8. Lazy validation and recomputation

Correctness must not depend on a push invalidation mechanism.

Minimum behavior:

```text
load derived view
   ↓
lazy basis check
   ├── CURRENT → serve
   ├── STALE + current inputs available → recompute
   ├── CONFLICTED → preserve diagnostics; no authority choice
   └── UNRESOLVABLE → explicit inability to verify
```

A global invalidation bus is therefore optional optimization, not correctness substrate.

When recomputation is possible:

1. run the same deterministic derivation against current inputs;
2. produce a new basis vector;
3. produce a new dependency vector;
4. compute the new basis digest;
5. carry current derivation identity;
6. atomically replace the derived artifact as a new derived version.

The recomputation path must not mutate canonical sources merely because self-knowledge was refreshed.

## 9. External observation boundary

External observation has a separate freshness concern.

For sources without a comparable revision/version mechanism, an adapter may define:

```text
observedAt + observationTTL
```

but:

```TTL not expired ≠ external source proven unchanged
```

Therefore:

- observation recency is metadata/basis information;
- an expired observation may cause STALE;
- a non-expired unversioned observation does not independently prove authoritative CURRENT external truth;
- adapter-specific external evidence remains owner-scoped;
- no universal external-world TTL law is created by L1.

## 10. Contradiction boundary

Contradiction detection is local to the derivation that understands the relevant semantic claim.

A derivation may define:

```ts
interface ConflictDiagnostic {
  semanticKey: string;
  refs: string[];
  reason: string;
}
```

A conflict causes `freshness=CONFLICTED` only where the derivation is authorized by its owner to compare those sources.

Self-knowledge must not resolve the contradiction by:

- choosing a source as authoritative;
- granting permission;
- rewriting Ω law;
- changing canonical domain meaning.

## 11. Replacement and derivation change

Replacing an implementation, manifest, contract or derivation version affects freshness only according to the corresponding basis/dependency identity.

Rules:

- changed required derivation identity → STALE until recomputed;
- changed required dependency token → STALE until recomputed;
- changed canonical source revision/CID → STALE until recomputed;
- missing replacement basis → UNRESOLVABLE;
- owner-defined contradiction during replacement → CONFLICTED;
- replacement does not create a new semantic subject identity merely because the derived view was regenerated.

Semantic survivor rules remain with the responsible CFA; L1 only provides the generic freshness mechanism.

## 12. Boundedness

A DerivedView declares a bounded basis.

It must not implicitly depend on an unbounded repository/world scan.

For large source sets, the responsible adapter must expose a bounded, deterministic basis representation such as:

- explicit revision references;
- content-addressed snapshots;
- bounded dependency vectors;
- deterministic aggregate digests whose source membership is itself inspectable.

A digest without inspectable basis membership is insufficient evidence.

## 13. Non-authority and single-graph invariants

L1 preserves:

- self-knowledge is descriptive, not authoritative;
- freshness does not imply permission;
- basis identity does not become semantic identity;
- graph presence does not upgrade truth or maturity;
- implementation topology does not create grounding;
- the Architecture Steward graph remains the sole development architecture graph;
- no global freshness registry is created;
- no universal Event/State/identity primitive is introduced.

The resulting derived view is replaceable projection data over existing owner-controlled sources.

## 14. L1 acceptance matrix

| Stage-E gate | L1 closure contribution | State |
|---|---|---|
| E-R1 DerivedView contract | Typed shape, ownership, rebuild semantics | **PASS** |
| E-R2 Basis identity | Generic BasisRef shape and stronger-token rule; domain adapters deferred to L2 | **PASS / L2 dependency** |
| E-R3 Basis digest | Canonical serialization + SHA-256 rule | **PASS** |
| E-R4 Dependency identity | Explicit bounded dependency vector | **PASS / L2 dependency** |
| E-R5 Derivation identity | Versioned DerivationRef | **PASS** |
| E-R6 Computed freshness | Deterministic current-basis comparison | **PASS** |
| E-R7 Freshness vocabulary | CURRENT / STALE / CONFLICTED / UNRESOLVABLE | **PASS** |
| E-R8 Grounding | Not part of L1; L4 remains | **DEFERRED** |
| E-R9 Graph bundle | Not part of L1; L3 remains | **DEFERRED** |
| E-R10 Domain adapters | Explicitly L2-owned | **DEFERRED** |
| E-R11 Changed-basis falsifier | Design condition specified; proof remains L5 | **DEFERRED** |
| E-R12 Missing-basis falsifier | Design condition specified; proof remains L5 | **DEFERRED** |
| E-R13 Contradiction falsifier | Design condition specified; proof remains L5 | **DEFERRED** |
| E-R14 Non-authority | Preserved by contract; final proof remains L5 | **DEFERRED** |
| E-R15 Single graph | Preserved by contract; final proof remains L5 | **DEFERRED** |
| E-R16 Replacement property | Generic freshness behavior defined; semantic survivor rules remain owner-defined | **PASS / explicit domain dependency** |
| E-R17 Bounded pilots | L6 | **DEFERRED** |

L1 therefore closes the **contract-design layer**. It does not declare Stage E READY.

## 15. Falsifiers enabled by L1

The following are now explicit executable acceptance targets for later L5 closure:

1. **Changed basis:** mutate a required canonical revision/CID and prove the old derived view cannot remain CURRENT.
2. **Changed derivation:** change the derivation identity/version with unchanged source basis and prove the old result cannot remain CURRENT.
3. **Missing basis:** remove a required source/token and prove the result becomes UNRESOLVABLE.
4. **Contradiction:** provide owner-defined conflicting current inputs and prove the result becomes CONFLICTED without selecting authority.
5. **Restart:** persist a view, restart, change or remove its basis, and prove freshness is recomputed rather than trusted from storage.
6. **External observation:** exceed a source-specific observation window and prove the observation cannot continue to claim CURRENT merely from cached recency metadata.
7. **Single-graph:** attempt to materialize a second architecture network and prove the readiness gate rejects it.
8. **Replacement:** swap the derivation implementation while preserving the semantic target and prove the target identity survives while the derived view becomes STALE/recomputed.

## 16. L1 completion decision

**L1 = COMPLETE.**

The smallest generic freshness contract is sufficiently characterized to hand off to L2 domain/source adapters without inventing missing semantic authority.

**Stage E overall = NOT READY.**

The remaining readiness blockers are explicitly downstream:

- domain basis adapters;
- graph bundle contract;
- grounding contract;
- falsifier/proof harness;
- bounded pilots;
- final gate audit.

No runtime-join implementation is authorized by this L1 completion.
