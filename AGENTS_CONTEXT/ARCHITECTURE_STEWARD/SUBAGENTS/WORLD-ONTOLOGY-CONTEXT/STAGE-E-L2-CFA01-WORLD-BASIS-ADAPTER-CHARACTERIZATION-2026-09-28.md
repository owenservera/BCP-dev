# CFA-01 — Stage-E L2 World/Object Basis Adapter Characterization
## 2026-09-28

> Status: **CLOSED — OWNER CHARACTERIZATION COMPLETE / IMPLEMENTATION-PROOF DEFERRED**
> CFA: CFA-01 — World & Context Steward
> agent_id: `world-ontology-context`
> Scope: Stage-E L2 owner characterization only. No runtime self-knowledge join implementation.
> Authority: CFA-local basis adapter characterization; not Ω law and not shared-boundary activation.
> Task: `STAGE-E-L2-CFA01-WORLD-BASIS-ADAPTER-2026-09-27`

## 1. Adapter identity

- **adapterId:** `world.object-revision.basis.v1`
- **ownerCFA:** CFA-01
- **basisKind:** `world-object-revision`

Purpose: provide the smallest owner-defined World/Object basis a Stage-E derived view may use to determine whether a referenced canonical World/Object subject remains current.

This adapter does **not** create a World database, World identity registry, resolver service, revision store, or freshness bus.

## 2. Canonical source / evidence

The strongest current source is the existing durable vault identity/revision substrate:

- logical canonical object identity: `(ns,id)`;
- exact revision identity: `(ns,id,rev)`;
- content identity: `cid` where available.

Current evidence sources:

1. `docs/destination/world-object-core/CANONICAL-MODEL.md`
2. `docs/destination/world-object-core/RESEARCH-SYNTHESIS.md`
3. `AGENTS_CONTEXT/ARCHITECTURE_STEWARD/SUBAGENTS/WORLD-ONTOLOGY-CONTEXT/M2-REFERENCE-CORRESPONDENCE-EVIDENCE-2026-09-27.md`
4. `AGENTS_CONTEXT/ARCHITECTURE_STEWARD/SUBAGENTS/WORLD-ONTOLOGY-CONTEXT/M1-SEMANTIC-KERNEL-EVIDENCE-2026-09-27.md`
5. `AGENTS_CONTEXT/ARCHITECTURE_STEWARD/BOUNDARY-DESIGN-SYSTEM/STAGE-E-L1-DERIVED-VIEW-FRESHNESS-CONTRACT-2026-09-27.md`
6. `omega-baseline/omega-final/plugins/vivim-nlcl-pure/src/types.ts`
7. `omega-baseline/omega-final/plugins/vivim-mind/src/derive.ts`

## 3. Source token available today

### 3.1 Strong canonical token

For a canonical World/Object basis, use:

```text
canonicalRef = (ns,id)
revisionRef = (ns,id,rev)
contentDigest = cid              // optional, when supplied by the canonical source
```

The exact revision tuple is the primary freshness comparison token. A content digest may strengthen exact-content identification, but it must not replace canonical object identity.

### 3.2 Tokens explicitly rejected as freshness proof

The following are **not sufficient** World/Object freshness tokens:

- `WorldModel.v` by itself;
- `WorldModel.t`;
- `EntityView.at`;
- filesystem path;
- graph presence;
- source/alias label;
- search ranking;
- a stored DerivedView freshness flag.

Repository evidence explicitly establishes that the current `WorldModel` shape is a bounded derived projection and that its `v`/timestamp do not expose a complete canonical World/Object revision basis.

### 3.3 Important scope limit

A World/Object revision token proves only the canonical subject basis it names.

It does **not** prove that an entire World projection is current if the result also depends on:

- relationship revisions;
- source-observation changes not represented by the object revision;
- projection membership/scope;
- authority/view-scope state;
- other peer-owned dependencies.

Those inputs must enter through their own owner-scoped basis adapters. CFA-01 must not overclaim one object revision as a universal World snapshot token.

## 4. Resolver characterization

The owner-scoped resolver is:

```text
WorldReferenceResult subjectRef
        ↓
resolve canonicalRef (ns,id)
        ↓
obtain exact current revision (ns,id,rev)
        ↓
optionally obtain cid / evidence for that revision
        ↓
construct BasisRef
```

For historical or explicitly revisioned references:

```text
(ns,id,rev)
  → resolve exact durable revision
  → retain the historical revision reference
  → separately compare against the current revision when freshness is required
```

The resolver must preserve the M2 resolution states:

```text
RESOLVED | AMBIGUOUS | STALE | UNRESOLVABLE | CONFLICTED
```

It must never convert a candidate, alias, correspondence, or search result into canonical identity without the explicit World resolution step.

### Runtime-binding limitation

The repository does **not** currently expose a complete Stage-E runtime adapter that carries `(ns,id,rev)` through the existing `WorldModel`/NCLL shapes. The current `EntityView` contains an `id`, but the runtime projection inspected here does not retain a canonical revision field for each entity.

Therefore:

- **design/source token:** CHARACTERIZED;
- **runtime-visible token propagation:** UNKNOWN / implementation-deferred;
- **production adapter implementation:** NOT STARTED.

This is a real representation gap, not permission to substitute `WorldModel.v` or timestamps.

## 5. BasisRef characterization

Using the generic Stage-E L1 shape, the World/Object adapter should emit conceptually:

```text
BasisRef {
  basisId: stable owner-local basis reference,
  ownerRef: world-ontology-context,
  sourceKind: "world-object-revision",
  sourceRef: canonical source/evidence reference,
  canonicalRef: (ns,id),
  revisionRef: (ns,id,rev),
  contentDigest?: cid,
  observationRef?: owner-defined observation,
  observedAt?: timestamp,
  required: true,
  evidenceRefs: [...]
}
```

The adapter does not invent an Observation ID when the source does not expose one.

## 6. Freshness comparison

### CURRENT

The required canonical subject resolves and the current revision/content identity matches the recorded basis, with no owner-defined contradiction affecting the referenced subject.

### STALE

The canonical subject still resolves, but the current revision or required content identity differs from the recorded basis.

Example:

```text
stored:  email/msg-123@rev=7
current: email/msg-123@rev=8
→ STALE
```

A stale historical reference remains useful evidence/lineage; it must not be relabeled CURRENT merely because the old revision still exists.

### UNRESOLVABLE

Use when a required canonical subject/revision cannot be resolved sufficiently to compare currentness.

Examples:

- canonical `(ns,id)` cannot be resolved;
- required revision cannot be retrieved/reconstructed;
- a required content identity is missing where the owner-defined comparison requires it;
- the runtime representation omits the basis needed to perform the comparison.

Do not substitute recency, lexical similarity, graph proximity, or a weaker token when the stronger basis is required.

### CONFLICTED

Use only where the resolved World-owned basis contains a material contradiction that CFA-01 is authorized to report, for example incompatible correspondence/subject claims retained by the World resolution result.

The adapter reports the conflict; it does not select authority.

## 7. Comparison hierarchy

For a revisioned canonical World/Object source, freshness should prefer:

```text
exact revision identity
      >
revision + immutable content identity
      >
owner-defined observation identity
      >
observation time metadata
```

This is a strength hierarchy, not an instruction to invent the weaker levels when the stronger one is absent.

An observation timestamp may explain when a fact was inspected, but it is not proof that an external source stayed unchanged after that observation.

## 8. Relationship to WorldReferenceResult

The existing M2 seam remains:

```text
WorldReferenceResult
  subjectRef(s)
  worldMeaning
  resolutionState
  correspondenceState
  evidenceRefs
  sourceRefs
  freshness
  unknowns
  conflicts
  basisRef
```

The L2 adapter supplies the **basis** needed by that seam to participate in Stage-E freshness comparison.

It does not redefine:

- `worldMeaning`;
- semantic identity;
- correspondence semantics;
- Authority authorization;
- Data persistence/revision mechanics.

## 9. Evidence classification

| Claim | State | Freshness | Basis |
|---|---|---|---|
| Canonical World/Object logical identity is `(ns,id)` | OBSERVED / EVIDENCE-SUPPORTED | CURRENT | world-object canonical model |
| Exact canonical revision is `(ns,id,rev)` | OBSERVED / EVIDENCE-SUPPORTED | CURRENT | canonical model + research synthesis |
| CID is distinct from object identity and may strengthen content comparison | OBSERVED / EVIDENCE-SUPPORTED | CURRENT | canonical model + M1 red-team |
| WorldReferenceResult carries a basis/freshness seam | DERIVED / RECONCILED | CURRENT | M2 packet + peer acceptance |
| WorldModel.v/timestamps are complete World/Object freshness basis | **REJECTED** | — | L1 + current WorldModel shape |
| Runtime WorldModel currently propagates exact canonical revision for every EntityView | UNKNOWN | CURRENT | `types.ts` / `derive.ts` inspection |
| Exact production resolver binding exists | UNKNOWN | UNRESOLVABLE FOR THIS CLAIM | no complete runtime adapter found |
| One object revision proves complete World projection freshness | REJECTED | — | scope boundary; peer-owned basis dependencies remain |

## 10. Falsifiers

### F01 — Revision-change falsifier

1. Create a dependent derived view from `(ns,id,rev=N)`.
2. Advance the canonical object to `rev=N+1`.
3. Re-resolve the current basis.
4. The old derived view must become **STALE** and cannot remain CURRENT.

### F02 — Same version / changed content falsifier

Hold any weaker producer version marker constant while changing the canonical content identity/revision.

Expected result: the old view cannot rely on the weaker marker to remain CURRENT.

### F03 — Missing basis falsifier

Remove or make unavailable the required canonical subject/revision.

Expected result: **UNRESOLVABLE**, not guessed CURRENT.

### F04 — Candidate-versus-canonical falsifier

Present a semantic/search candidate with matching labels but no canonical resolution.

Expected result: ambiguity/unresolved state survives; no canonical subject is invented.

### F05 — Scope-limit falsifier

Change a relationship/projection dependency while holding one object revision unchanged.

Expected result: the World/Object adapter alone must not report the *whole World projection* as CURRENT. The dependent view must include the additional owner-scoped basis or remain unable to prove full currentness.

## 11. Unknown / deferred items

### UNKNOWN

1. Exact runtime propagation of canonical `rev`/CID from vault evidence into `WorldModel` entity projections.
2. Exact observation identity for World/Object external sources.
3. Exact canonical implementation of a generic World resolver.
4. Exact representation of `WorldReferenceResult` at runtime.
5. Exact aggregate basis required for multi-object/relationship World projections.
6. Exact principal-relative World visibility representation.
7. Concurrent change semantics when object revision and related relationship/source observations advance together.

### DEFERRED

- shared BasisRef normalization implementation;
- runtime Stage-E join implementation;
- full-world projection freshness algorithm;
- live external provider freshness;
- graph attachment / L3;
- cross-plane grounding / L4;
- falsifier harness / L5;
- bounded pilots / L6.

## 12. Closure verdict

**CLOSED — CFA-01 owner characterization complete.**

The adapter has an explicit owner, canonical source, comparison token, resolution rule, BasisRef shape, STALE/UNRESOLVABLE/CONFLICTED behavior, evidence basis, falsifiers, and explicit runtime unknowns.

The central Stage-E contract may therefore consume this as an owner-characterized L2 input without inventing World/Object semantics.

No shared boundary was activated.
No Ω law changed.
No runtime implementation started.
