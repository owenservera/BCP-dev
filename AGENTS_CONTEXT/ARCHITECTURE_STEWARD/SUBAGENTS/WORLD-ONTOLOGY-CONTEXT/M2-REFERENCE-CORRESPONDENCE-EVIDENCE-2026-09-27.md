# CFA-01 — M2 Reference, Correspondence & Addressability Evidence

> Date: 2026-09-27
> Status: **COMPLETE — DESIGN / EVIDENCE LEVEL**
> Classification: CFA-01-owned evidence packet; not Ω law, not a production resolver implementation, and not shared-boundary activation.
> Basis: current repository `main` as inspected for M2.
> Task: `WORLD-M2-REFERENCE-CORRESPONDENCE-EVIDENCE-2026-09-27`

## 1. Outcome

The minimum World reference/result candidate is supported at design/evidence level across all five required resolution states:

```text
RESOLVED
AMBIGUOUS
STALE
UNRESOLVABLE
CONFLICTED
```

The current evidence also supports these companion invariants:

- correspondence is not equivalence;
- correspondence is not proof;
- source identity is not canonical World identity;
- alias/address is not semantic identity;
- addressability is not authorization;
- evidence/source basis and freshness remain attached to the result;
- ambiguity and conflict are preserved rather than silently collapsed;
- historical/stale references remain useful lineage rather than being rewritten as current truth.

The packet therefore closes M2 as an evidence/design exercise and does **not** authorize production resolver mechanics.

## 2. Minimum World reference/result

The current peer-accepted seam is:

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

CFA-03 explicitly accepts the minimum World-side result/input shape and its separation of World meaning, resolution state, correspondence, evidence/source basis, freshness and unresolved/conflict detail.

CFA-04 explicitly accepts that addressability and World projection state are not authorization, and that `authorized` remains Authority-owned.

This is a seam contract, not a prescription for peer internal representations.

## 3. Resolution-state evidence matrix

| Case | State | World-side assertion | Candidate refs | Evidence/basis | Freshness | Forbidden collapse | Status |
|---|---|---|---|---|---|---|---|
| R1 | RESOLVED | One World subject is supported as the referent under the stated basis | One | Required | CURRENT or explicitly qualified | Do not infer authorization | SUPPORTED / CURRENT |
| R2 | AMBIGUOUS | Multiple World subjects remain materially plausible | Many | Required | CURRENT where applicable | Do not choose one solely by lexical convenience | SUPPORTED / CURRENT |
| R3 | STALE | Prior reference remains valid lineage, but current basis is too old/insufficient for unqualified current use | One or more historical refs | Required | STALE | Do not relabel stale as current | SUPPORTED / CURRENT |
| R4 | UNRESOLVABLE | No World subject can currently be asserted from the supplied reference/basis | None required | Required when available | UNRESOLVABLE where applicable | Do not invent a target from weak similarity | SUPPORTED / CURRENT |
| R5 | CONFLICTED | Materially incompatible World/correspondence claims remain unresolved | One or more candidates | Required | CURRENT/STALE as applicable | Do not flatten conflict into one result | SUPPORTED / CURRENT |

### State independence

These are resolution states, not a universal system status enum.

A result may therefore also carry:
- projection visibility;
- scoped accessibility;
- lifecycle;
- source availability;
- authority result;
- work/execution state.

Those are separate dimensions owned by their relevant contracts.

## 4. Correspondence evidence matrix

| Correspondence case | Meaning | State | Required treatment | Evidence basis |
|---|---|---|---|---|
| Same source identity mapped to one local subject | Candidate/supporting correspondence | SUPPORTED when evidence is adequate | Preserve mapping and basis | Source Identity design + Data continuity evidence |
| One source identity mapped to multiple local subjects | Collision/ambiguity | DISPUTED or UNKNOWN | Preserve candidates; do not auto-merge | SOURCE-IDENTITY.md |
| Multiple source identities mapped to one local subject | Possible correspondence | SUPPORTED/PARTIAL as justified | Preserve each source identity separately | SOURCE-IDENTITY.md + M1 peer reconciliation |
| Matching content/CID across objects | Content coincidence | UNKNOWN as to semantic equivalence | Never merge solely on CID | CANONICAL-MODEL.md + RED-TEAM.md |
| Matching labels/paths/names | Retrieval candidate | UNKNOWN until resolved | Search result remains candidate evidence | ADDRESSING.md |
| Successful transformation | Transformation result | Does not establish equivalence | Carry transformation/evidence refs separately | CFA-02 continuity evidence |

### Core correspondence invariant

```text
correspondence
  !=
equivalence
  !=
proof
```

A correspondence claim explains a relationship among identities. It does not by itself establish semantic sameness or satisfy a consequential proof requirement.

## 5. Addressability evidence matrix

| Input kind | What it can produce | What it cannot prove |
|---|---|---|
| Exact canonical ref (ns,id) | direct address of a known local subject | authorization |
| Exact revision (ns,id,rev) | historical inspection/replay target | currentness without freshness basis |
| Alias | mapping to a canonical ref | semantic equivalence to another object |
| Source identity | candidate local mapping | canonical identity replacement |
| Full-text/semantic search | candidates | unique identity |
| Human-friendly route | grounded candidate/reference | permission to act |

**DERIVED / CURRENT:** The existing destination addressing contract explicitly separates search from address resolution. Addressing resolves known identity; search may only suggest candidates.

## 6. Historical and stale reference treatment

A stale reference is not deleted merely because the current world basis changed.

Minimum treatment:

```text
prior reference
  +
stale qualification
  +
prior evidence/basis
  +
current resolution attempt
```

The system must preserve the difference between:
- “this was once resolvable”;
- “this is resolvable now”;
- “this cannot now be re-resolved”;
- “the prior and current claims conflict.”

No state promotion from STALE → CURRENT is allowed merely because a stored row still exists.

## 7. Alias / source-identity rules

The currently supported design boundary is:

```text
source identity
      ↓ mapping / correspondence
canonical World subject
      ↓
canonical address
```

An alias is likewise a mapping:

```text
alias
  →
canonical ref
```

Neither mapping is itself a second canonical subject.

Collision behavior remains fail-safe:
- preserve candidates;
- preserve evidence;
- preserve disputed/unresolved state;
- defer merge to an explicit semantic decision.

## 8. Bounded replay corpus specification

The following cases form the minimum deterministic fixture set for an eventual machine-checkable M2 resolver test. This section is a **fixture specification**, not a claim that the repository runtime has executed these cases.

### M2-RP-01 — Unique canonical reference
Input: exact `(ns,id)`.
Expected: RESOLVED; one subjectRef; basis retained.
Falsifier: resolver returns AMBIGUOUS or another subject despite exact identity.

### M2-RP-02 — Two candidate names
Input: human route matching two canonical subjects.
Expected: AMBIGUOUS; both candidate refs retained.
Falsifier: resolver silently selects one without an explicit rule/basis.

### M2-RP-03 — Prior exact revision now stale
Input: `(ns,id,rev)` with a materially newer basis.
Expected: STALE; historical ref retained; freshness explicit.
Falsifier: result is silently labeled CURRENT.

### M2-RP-04 — Unknown source mapping
Input: source identity with no established local mapping.
Expected: UNRESOLVABLE or unresolved correspondence state; no invented target.
Falsifier: resolver guesses a local object.

### M2-RP-05 — Competing source mappings
Input: one source identity associated with multiple local candidates.
Expected: CONFLICTED/AMBIGUOUS depending evidence shape; all candidates/evidence retained.
Falsifier: silent merge or silent winner.

### M2-RP-06 — Equal CID, distinct objects
Input: two local objects sharing the same content identity.
Expected: distinct canonical refs; correspondence remains separate.
Falsifier: CID equality causes identity collapse.

### M2-RP-07 — Alias collision
Input: alias resolves to multiple candidates.
Expected: AMBIGUOUS or CONFLICTED; no arbitrary canonical target.
Falsifier: alias silently selects one.

### M2-RP-08 — Search candidate then canonical address
Input: retrieval returns candidates, followed by exact canonical selection.
Expected: candidate phase remains distinct from final address resolution.
Falsifier: retrieval itself is treated as identity proof.

### M2-RP-09 — Correspondence without equivalence proof
Input: supported source/local correspondence plus insufficient semantic proof.
Expected: correspondence retained; proof state remains insufficient/unknown.
Falsifier: correspondence is promoted automatically to equivalence.

### M2-RP-10 — Addressability plus denied authority
Input: resolvable World target + Authority refusal.
Expected: target remains addressable/existent as supported; authority result remains separate.
Falsifier: denial rewrites target to nonexistent or unresolvable.

## 9. Peer evidence closure

### World ↔ CFA-03
**AGREED / CURRENT.**

CFA-03 accepts the minimum World reference/result shape and explicitly preserves the five resolution states, correspondence state, basis and freshness.

Evidence:
- CFA-03 Round-2 addendum;
- CFA-03 M1 Semantic Baseline Trace receipt.

### World ↔ CFA-04
**AGREED / CURRENT.**

CFA-04 accepts the orthogonality of existence/addressability/visibility/accessibility and authorization. `authorized` remains Authority-owned; `accessible` remains a composed seam property.

Evidence:
- CFA-04 Round-2 addendum;
- Authority Corridor Evidence Pack.

### World ↔ CFA-02
**AGREED / CURRENT.**

CFA-02 accepts the dimensional identity/correspondence/source/alias/revision crosswalk and does not infer semantic merge from durable record mechanics.

Evidence:
- CFA-02 Round-2 addendum;
- Continuity Corridor 1 Evidence.

## 10. Explicit limits

The current evidence does **not** prove:
- production resolver execution;
- real external provider refresh/disappearance behavior;
- final semantic merge/split policy;
- complete source-identity envelope for every provider;
- final projection freshness algorithm;
- final principal-relative visibility model.

These remain named experiments/future milestone work.

## 11. M2 completion decision

**COMPLETE — DESIGN / EVIDENCE LEVEL.**

The bounded completion condition is met:
- one minimum World reference/result candidate spans all five required resolution states;
- correspondence remains distinct from equivalence and proof;
- addressability remains distinct from authority;
- evidence/source basis and freshness remain explicit;
- falsifiers are defined;
- remaining gaps are isolated;
- no production resolver mechanics were introduced.

**Next strategic progression:** M3 — Context & World Projection.

M3 must begin from the accepted M1/M2 seam vocabulary and must treat Context as bounded World selection/projection, not as a second canonical store.

**Boundaries:** UNACTIVATED  
**Ω law:** UNCHANGED  
**Production implementation:** NOT STARTED
