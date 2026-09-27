# CFA-09 — Stage-E L2 Change / Compatibility Basis Adapter
## 2026-09-27

> Status: **CLOSED — OWNER CHARACTERIZATION COMPLETE / IMPLEMENTATION-PROOF DEFERRED**
> CFA: CFA-09 — Evolution / Compatibility / Self-Maintenance
> agent_id: `evolution-compatibility-self-maintenance`
> Scope: Stage-E L2 owner characterization only. No runtime self-knowledge join implementation.
> Authority: CFA-local basis adapter characterization; not Ω law and not shared-boundary activation.

## 1. Adapter identity

- **adapterId:** `evolution.change-compatibility.basis.v1`
- **ownerCFA:** CFA-09
- **basisKind:** `change-compatibility`

Purpose:

Provide the minimum owner-defined basis references needed for a derived view whose result depends materially on a governed Change and/or its compatibility assessment.

The adapter is intentionally a reference projection over existing Change, subject, revision, evidence and compatibility information. It is **not** a new canonical Change record, Evolution database, compatibility registry, identity system, or invalidation bus.

## 2. Canonical source / reference locations

Current durable source/design evidence:

1. `AGENTS_CONTEXT/EVOLUTION/CANONICAL-MODEL.md`
   - current design for Change subject/state/evidence/lifecycle fields.
2. `AGENTS_CONTEXT/EVOLUTION/CONSTITUTION.md`
   - proposed evolution rules for impact, compatibility, authority separation, rollback and uncertainty.
3. `AGENTS_CONTEXT/ARCHITECTURE_STEWARD/SUBAGENTS/EVOLUTION-COMPATIBILITY-SELF-MAINTENANCE/M1-MINIMUM-CHANGE-CONTRACT-CHARACTERIZATION-2026-09-27.md`
   - current evidence-derived characterization of the minimum reusable Change relation.
4. `AGENTS_CONTEXT/ARCHITECTURE_STEWARD/SUBAGENTS/EVOLUTION-COMPATIBILITY-SELF-MAINTENANCE/M1-PEER-RECONCILIATION-2026-09-27.md`
   - current cross-CFA reconciliation and explicit residual unknowns.
5. `AGENTS_CONTEXT/ARCHITECTURE_STEWARD/SUBAGENTS/EVOLUTION-COMPATIBILITY-SELF-MAINTENANCE/BOUNDARY-BASELINE-DECLARATION-2026-09-27.md`
   - current CFA ownership and peer seam boundaries.

Supporting mechanism evidence:

- `omega-baseline/omega-final/docs/decisions/D-315-quarantine-semantics.md`
- `omega-baseline/omega-final/docs/decisions/D-326-healing-writes.md`
- `omega-baseline/omega-final/docs/decisions/D-333-migration-substrate.md`

These establish reusable lifecycle/version/history/evidence patterns but do not constitute a ratified universal Change implementation.

## 3. Source identity / revision token available today

There is **no currently ratified universal canonical Evolution record ID or compatibility revision namespace**.

Therefore the adapter uses a layered token rather than inventing one:

### 3.1 Change subject token

`subjectBasis`

One or more opaque peer-owned references identifying the changed subject and its relevant recorded revision/state.

Examples of admissible source kinds:

- World/object revision reference;
- durable Data record/revision reference;
- capability/realization reference;
- composition/member reference;
- policy/configuration reference;
- Work/Plan basis reference;
- surface/projection reference.

CFA-09 does not mint or reinterpret those peer identities.

### 3.2 Change relation token

`changeBasis`

When a concrete governed Change exists, use its stable `changeId` plus the references needed to identify:

- prior state;
- proposed state;
- application/active state where applicable;
- change class;
- semantic delta reference where applicable;
- impact/compatibility evidence references.

Where a stable `changeId` does not yet exist in the durable target corridor, the adapter remains **UNKNOWN** rather than substituting a path name or timestamp as semantic identity.

### 3.3 Compatibility basis token

`compatibilityBasis`

Represent only the compatibility assessments material to the derived view:

```
{
  evaluatorRef,
  evaluatorVersion,
  dimensions[],
  assessmentRefs[],
  evidenceRefs[]
}
```

The dimensions are owner-defined where applicable; the current CFA-09 constitution names structural, semantic, identity, relationship, behavior, authority, evidence, persistence/recovery, projection and resource compatibility as possible dimensions.

**Important:** this is a reference envelope, not a universal compatibility score and not an authority decision.

### 3.4 Source revision for the design itself

The design/source documents above are revisioned by their repository commit/blob identity when a derived artifact needs to prove which design definition it used.

A repository commit/blob is **implementation/source provenance**, not semantic Change identity.

## 4. Output BasisRef / dependency-token shape

Conceptual output:

```
BasisRef {
  sourceKind: "evolution-change" | "subject-revision" | "compatibility-assessment",
  sourceId: string,
  revisionToken: string | null,
  contentDigest?: string,
  observedAt?: string,
  observationTTL?: string
}
```

Derived dependency vector, when relevant:

```
DependencyVersion {
  dependencyKey: string,
  dependencyVersion: string,
  immutableDigest?: string,
  ownerRef?: string,
  sourceRef?: string
}
```

For CFA-09, the minimum owner-defined dependency set is:

- changed subject revision/state basis;
- Change relation/lifecycle basis, when a concrete Change exists;
- compatibility evaluator/version and material assessment references, when the derived view depends on compatibility;
- semantic-delta basis, when the view depends on meaning-changing change;
- impact basis, when the view depends on affected-dependency classification.

Do not include unrelated peer state merely because it exists.

## 5. Resolution rule

Given a requested Change/compatibility-derived view:

1. Resolve each required peer-owned subject/revision reference.
2. Resolve the concrete Change relation when the view claims to describe one.
3. Resolve the compatibility evaluator/version and material assessment evidence when compatibility is part of the view's basis.
4. Resolve any declared semantic-delta/impact reference required by the view.
5. Produce the exact BasisRef set actually used.
6. Canonicalize the resolved set under the Stage-E L1 deterministic digest rules.
7. Compare that current basis with the recorded DerivedView basis.

The adapter does **not** infer a Change from:
- filename;
- folder location;
- Git commit message alone;
- graph adjacency;
- import/call relationship;
- semantic similarity;
- compatibility wording without an attributable assessment.

## 6. Freshness comparison rule

For a Change/compatibility-derived view:

### CURRENT

All required source references resolve and their relevant revision/evaluator/evidence identities match the recorded basis, with no owner-defined contradiction.

### STALE

All required current sources resolve, but one or more relevant subject, Change, evaluator or compatibility identities differ from the recorded basis.

Examples:

- subject revision advanced;
- Change moved to a different attributable revision/state;
- compatibility evaluator version changed;
- a material compatibility assessment was superseded by a new assessment.

### UNRESOLVABLE

A required source cannot be resolved sufficiently to establish currentness.

Examples:

- referenced Change identity unavailable;
- required subject revision cannot be reconstructed;
- required compatibility assessment is unavailable;
- a declared basis dependency has no currently resolvable source.

The adapter must not substitute repository recency, wall-clock time, cached freshness or another peer's unrelated revision.

### CONFLICTED

A resolved current basis contains an owner-defined contradiction that the Change/compatibility derivation is allowed to report.

Examples:

- mutually incompatible peer assessments for the same explicitly defined compatibility dimension;
- contradictory active/proposed lineage that the domain's relation model declares irreconcilable.

The adapter reports the conflict; it does not choose an authority.

## 7. Interaction with compatibility

Compatibility is a dimensioned, evidence-backed result, not a single trust bit.

Therefore:

```
verified != compatible
compatible != authorized
compatible != promoted
promoted != active
```

A derived view may depend on compatibility without treating compatibility as permission.

Unknown compatibility remains UNKNOWN and must not be normalized to compatible or incompatible solely because evidence is incomplete.

## 8. Interaction with Change lifecycle

The adapter may expose lifecycle information already attributable to the Change source:

```
OBSERVED
→ CHARACTERIZED
→ PROPOSED
→ IMPACTED
→ COMPATIBILITY-CHECKED
→ AUTHORIZED
→ APPLIED
→ VERIFIED
→ PROMOTED
→ ACTIVE
```

Terminal/intermediate conditions such as:

```
REFUSED | BLOCKED | QUARANTINED | ROLLED-BACK | RETIRED
```

remain distinguishable.

The lifecycle is evidence about the change process, not a substitute for peer semantic meaning.

## 9. External observation boundary

CFA-09 does not define an external-provider observation token.

When a Change/compatibility-derived view includes external observations produced by another CFA, the external adapter remains owner-scoped.

CFA-09 may consume that observation through an explicit evidence/reference link.

An observation timestamp or TTL never establishes canonical currentness by itself.

## 10. Falsifier

### F09-L2-01 — Governing Change basis mutation

1. Create a derived view whose declared basis includes a concrete Change subject/revision and compatibility evaluator/version.
2. Replace or supersede the governing subject revision, Change state, or material compatibility assessment.
3. Re-resolve the current basis.
4. Verify the old DerivedView becomes **STALE** (or **UNRESOLVABLE** when the replacement basis cannot be resolved).
5. Verify compatibility change does not itself grant permission or activate the replacement.

Expected failure of the adapter:

- old view remains CURRENT despite a changed governing basis; or
- compatibility is silently interpreted as authorization; or
- the adapter invents a substitute identity when a required Change source is unavailable.

## 11. Evidence and freshness

### OBSERVED / CURRENT

- `CANONICAL-MODEL.md` defines the minimum Change record information and lifecycle.
- D-315 demonstrates version-pinned behavior admission, preserved historical execution context, quarantine and rollback evidence.
- D-326 demonstrates realization revision/supersession and evidence-bearing healing lifecycle.
- Stage-E L1 defines computed freshness from basis/dependency/derivation identity and forbids trusting stored freshness.

### DERIVED / CURRENT

- A self-knowledge view should depend only on the subset of Change/compatibility basis actually material to that view.
- Subject/revision identity must remain peer-owned.
- A compatibility evaluator/version can participate in freshness without becoming a global compatibility authority.
- Change and compatibility information can be represented as references in a DerivedView basis without creating a second Evolution store.

### PROPOSED / CURRENT

- `evolution.change-compatibility.basis.v1` as the owner-scoped adapter characterization.
- The layered token model in Section 3.
- The minimum dependency set in Section 4.

### UNKNOWN / CURRENT

- Exact canonical persistent `changeId` storage/join across concrete corridors.
- Universal revision token for Change relation instances.
- Final immutable identity exposure for all compatibility evaluators/assessments.
- Exact shared semantic-delta vocabulary.
- Exact impact-set representation and revision semantics.
- Whether every future compatibility assessment can expose a stable immutable digest.
- Atomicity semantics when a Change and one of its peer-owned revisions advance concurrently.

No CONFLICTED condition is currently evidenced.

## 12. Deferred

- central BasisRef normalization implementation;
- runtime self-knowledge joins;
- universal Change persistence;
- compatibility evaluator implementation;
- live/provider/product proof;
- L3 graph bundle;
- L4 cross-plane grounding;
- L5 falsifier harness implementation;
- L6 bounded pilots;
- L7 Stage-E gate audit.

## 13. Non-authority statement

This adapter:

- does not create or own a canonical Evolution store;
- does not define peer identities;
- does not decide compatibility policy for other domains;
- does not authorize or deny actions;
- does not activate or fence runtime generations;
- does not become the source of semantic truth;
- does not alter Ω law.

It exists only to make the Evolution-owned basis required by a derived view explicit and freshness-comparable.

## 14. L2 closure verdict

**CLOSED — CFA-09 owner characterization complete.**

The adapter has an explicit owner, source locations, currently available identity/revision tokens, resolution rule, BasisRef/dependency shape, freshness semantics, falsifier and residual unknowns.

The unresolved items are real evidence/representation gaps and are intentionally not filled by invention.

**No runtime self-knowledge join has been implemented.**
**No shared boundary has been activated.**
**No Ω law has changed.**
