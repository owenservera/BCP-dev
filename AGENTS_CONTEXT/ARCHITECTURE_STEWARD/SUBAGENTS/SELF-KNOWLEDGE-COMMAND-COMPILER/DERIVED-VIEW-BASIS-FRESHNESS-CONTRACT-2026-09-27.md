# CFA-03 — DerivedView / BasisRef / Freshness Contract
## Stage-E Readiness — L1

> Date: 2026-09-27  
> Status: **PROPOSED — CFA-03 WORKING CONTRACT**  
> Owner: **CFA-03 Semantic Continuity Steward**  
> Authority: derived readiness design from the Architecture Steward Stage-E workload; not Ω law and not a shared-boundary activation.

## 1. Purpose

Define the smallest implementation-neutral contract needed for Stage-E to determine whether a self-knowledge or architectural derived view is still supported by the evidence basis from which it was derived.

The contract covers:

- \`DerivedView\` — a bounded derived result, never a canonical truth store;
- \`BasisRef\` — an attributed reference to one material input/revision/observation basis;
- \`BasisDigest\` — deterministic digest of the material basis set as observed by the derivation;
- \`DependencyVector\` — the ordered, explicit material basis references used by the derivation;
- \`DerivationIdentity\` — identity of the derivation method/configuration, distinct from subject identity;
- freshness states: \`CURRENT\`, \`STALE\`, \`CONFLICTED\`, \`UNRESOLVABLE\`.

The contract is designed to be consumed by central mechanical tooling without making the central tooling the owner of World, Data, Authority, Capability, Composition, Evolution or Runtime semantics.

## 2. Contract shape

### 2.1 DerivedView

A \`DerivedView\` should carry at minimum:

| Field | Meaning | Ownership rule |
|---|---|---|
| \`viewKind\` | bounded kind of derived view | producer/CFA-defined |
| \`viewIdentity\` | identity of this derived artifact/result | producer-defined; not universal identity |
| \`subjectRefs[]\` | peer-owned subjects represented by the view | each ref keeps its semantic owner |
| \`payload\` | deterministic derived content | producer-owned |
| \`basisRefs[]\` | material inputs used for derivation | explicit; no hidden dependency |
| \`basisDigest\` | digest of the normalized basis reference set | mechanical, deterministic |
| \`dependencyVector\` | ordered material basis vector | explicit dependency surface |
| \`derivationIdentity\` | derivation algorithm/configuration identity | distinct from subject/revision identity |
| \`freshness\` | current derived freshness classification | computed, not authoritative storage |
| \`evidenceRefs[]\` | evidence supporting the view/basis where applicable | evidence remains distinct from authority |
| \`generatedAt\` | observation timestamp for this derivation | descriptive only; never sufficient alone for freshness |

Additional fields are allowed, but they must not silently turn the view into an authority store, universal identity record, or second graph.

### 2.2 BasisRef

A \`BasisRef\` identifies one material source of derivation without prescribing a universal identifier scheme.

Conceptual fields:

| Field | Meaning |
|---|---|
| \`ownerCfa\` | semantic/contract owner of the referenced basis |
| \`basisKind\` | source class: world revision, record revision, policy dependency, provider observation, composition manifest, change basis, runtime generation, etc. |
| \`opaqueRef\` | source-owned reference; interpreted by its owner/adapter |
| \`revisionRef\` | optional source revision/version reference |
| \`observationToken\` | optional external/runtime observation token |
| \`evidenceRefs[]\` | evidence needed to attribute or resolve the basis |
| \`resolutionState\` | whether the basis reference is currently resolvable |
| \`resolverHint\` | bounded adapter/protocol identity, not a selector or semantic authority |

\`BasisRef\` does not assert that \`opaqueRef\`, \`revisionRef\`, an observation token, or any digest is a universal identity.

### 2.3 BasisDigest

\`BasisDigest\` is a deterministic digest over a canonical serialization of the material basis references actually used for the derivation.

Rules:

1. Serialization order is deterministic.
2. Source-owned reference values are treated as data; the central mechanism does not infer equivalence between different owners' identifiers.
3. A digest change is evidence that the stored derived result cannot remain \`CURRENT\` unless the responsible comparator explicitly establishes that the changed input is non-material.
4. A digest match means only that the recorded comparison basis is unchanged; it is not proof that the underlying world is unchanged.
5. Hashing is a mechanical integrity aid, not an authority mechanism.

### 2.4 DependencyVector

\`DependencyVector\` is the explicit ordered set of material \`BasisRef\`s consumed by a derivation.

A derivation MUST NOT depend materially on a source that is absent from the vector merely because the source is reachable through imports, filenames, graph proximity, runtime globals or implementation convention.

Dependency membership is evidence-bearing metadata, not a semantic inference channel.

### 2.5 DerivationIdentity

\`DerivationIdentity\` identifies the derivation method and material configuration used to create the view.

It must distinguish:

- a different derivation implementation/configuration;
- the same derivation rerun over a different basis;
- a different subject/basis represented by the same derivation.

No global algorithm registry is implied by this contract.

## 3. Freshness semantics

Freshness is **derived from comparison with the currently resolvable material basis**, not trusted from a stored label.

### \`CURRENT\`

All material basis references required by the view resolve successfully, their current values satisfy source-owned comparison rules, and the derivation identity remains compatible with the stored result.

### \`STALE\`

At least one material basis reference resolves to a materially different value/revision/observation, or the derivation identity/configuration changed in a way that invalidates the stored result.

### \`CONFLICTED\`

Required basis evidence resolves, but the applicable domain comparison indicates incompatible or contradictory states and no authority is implicitly selected by the freshness mechanism.

\`CONFLICTED\` is not a verdict about which peer source is correct.

### \`UNRESOLVABLE\`

A material basis reference cannot currently be resolved, verified, or compared sufficiently to establish freshness.

\`UNRESOLVABLE\` is not equivalent to \`STALE\`, \`FAILED\`, \`REFUSED\` or \`UNKNOWN\`.

## 4. Freshness evaluation rules

The central evaluation model is:

\`stored DerivedView → resolve current material BasisRefs → compare source-owned revisions/observations → evaluate derivation identity → classify freshness\`

Rules:

1. Stored freshness is a cache hint and MUST be revalidated when currentness matters.
2. Lazy validation is permitted; eager global invalidation is not required.
3. The dependency vector is the explicit revalidation surface; no global invalidation bus is required.
4. Missing basis is explicit: failure to resolve one required material basis yields \`UNRESOLVABLE\` unless an owner-defined rule declares that basis non-material.
5. A changed derivation identity can make a previous result \`STALE\` even when source data is unchanged.
6. Comparison is owner-aware: central mechanics carry and compare references through adapters but do not invent the meaning of revisions, versions, policy digests, provider observations, or survivor identity.
7. Freshness does not grant authority or permission, mutate law, or become canonical merely because it is \`CURRENT\`.
8. Freshness does not establish semantic identity; equal basis digests do not imply equal subjects or peer-owned identities.

## 5. Restart and recovery

A process restart MUST NOT require trust in an in-memory freshness flag.

On restart:

1. Load the stored \`DerivedView\` and its \`DependencyVector\`/\`BasisRefs\`.
2. Treat stored freshness as unverified until compared.
3. Resolve required basis references lazily or eagerly according to the consumer's currentness requirement.
4. Reclassify using the four states above.
5. Preserve original derivation/evidence lineage even when the result becomes stale or unresolvable.

Failed re-resolution does not erase the previous result or rewrite its evidence; it changes the current freshness classification.

## 6. External observation boundary

Runtime/external facts enter this contract as explicitly attributed \`BasisRef\` observations.

Examples:

- World/Object revision owned by CFA-01;
- durable record/revision owned by CFA-02;
- authority/policy dependency owned by CFA-04;
- provider/account/session/resource observation owned by CFA-06;
- composition/manifest version owned by CFA-07;
- change/compatibility basis owned by CFA-09;
- runtime generation/source token owned by CFA-10.

CFA-03 consumes these observations for continuity but does not reinterpret them as universal authority.

## 7. Relation to existing Stage-E inputs

**World grounding.** Current CFA-01 Round-2 work separates reference, resolution, correspondence, meaning, evidence/basis and freshness. That result shape is compatible with a CFA-03 \`BasisRef\`; CFA-03 does not redefine World semantics.

**Intent / Authority.** The canonical Intent seam remains separate from authority. A freshness state may describe the semantic basis supporting an Intent-related derived view, but it cannot serve as an authorization decision or live authority result.

**Data continuity.** The current CFA-02 reconciliation favors explicit relations among semantic, record, revision, evidence and representation identities. \`BasisRef\` follows that pattern rather than inventing a universal identity key.

**Evolution.** CFA-09 comparison rules can determine whether a revision/version change is material for a specific derived view. CFA-03 does not decide semantic survivor rules here.

## 8. Stage-E L1 falsifiers

The contract is falsified by any proof showing that:

1. a changed material source basis can leave an old view \`CURRENT\` without an explicit non-materiality rule;
2. a changed derivation identity can leave an incompatible result \`CURRENT\`;
3. a missing required basis silently becomes \`CURRENT\`;
4. a contradiction is hidden by choosing one source inside generic freshness logic;
5. self-knowledge freshness is used as permission or authority;
6. the system requires a universal invalidation bus to make freshness truthful;
7. imports, filenames, routes, class names or proximity are used to infer material dependency;
8. replacement/survivor semantics are assumed centrally rather than supplied by the owning CFA.

## 9. Readiness acceptance checklist

Stage-E L1 is ready for reconciliation when a bounded implementation-neutral proof can show:

- a derived view carries explicit material basis references;
- basis references remain attributed to their owner;
- basis digest serialization is deterministic;
- current/stale classification is recomputed from current basis comparison;
- unresolved basis is distinguishable from stale;
- contradictions remain visible without authority selection;
- derivation identity changes are detectable;
- restart does not require an in-memory freshness flag;
- the contract creates no second graph, universal identity store, authority store, or global invalidation requirement.

## 10. Hold points

This artifact does NOT freeze:

- a universal identity model;
- an Event/State first-class primitive;
- a universal freshness law for every product artifact;
- a persistent semantic database;
- a graph implementation;
- runtime join code;
- a new command compiler or command grammar;
- live provider/product proof;
- Ω-law changes.

The next reconciliation step is peer review of basis kinds and comparison/falsifier rules owned by CFA-01, CFA-02, CFA-04, CFA-06, CFA-07, CFA-09 and CFA-10. The Architecture Steward then determines whether the Stage-E L1 contract can promote into reconciled L4 grounding/bundle work.
