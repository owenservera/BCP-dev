# CFA-03 Semantic Continuity Steward — Round-2 Reconciliation Addendum

> Date: 2026-09-27
> Classification: CFA-03 current reconciliation claim; shared boundaries remain unactivated
> Basis: repository `main` as inspected after CFA-01 Round-2 addendum
> Identity: RATIFIED / FOUNDATION-SEEDED
>
> Evidence labels: OBSERVED / DERIVED / PROPOSED / UNKNOWN / CONFLICTED.
> Freshness: CURRENT / STALE / UNRESOLVABLE where material.

## Round-2 posture

**OBSERVED / CURRENT:** CFA-03's identity is ratified as Semantic Continuity Steward and its responsibility is continuity across grounding, interpretation, Intent/Plan, execution meaning, evidence and representation without becoming the semantic owner of every participating plane.

**OBSERVED / CURRENT:** CFA-01 Round-2 proposes a World-side `WorldReferenceResult` separating `worldMeaning`, reference resolution, correspondence, evidence/source basis and freshness.

**OBSERVED / CURRENT:** CFA-04 Round-1 keeps authorization/permission semantics separate from World existence, canonical identity, Intent construction and Work lifecycle.

**OBSERVED / CURRENT:** CFA-02 Round-1 keeps durable canonical identity, revision, lineage, reconciliation and reconstruction separate from World meaning.

**DERIVED / CURRENT:** CFA-03 can now define the minimum semantic-continuity inputs and outputs around these peer-owned endpoints without creating a universal semantic or identity store.

---

## RP-01 — CFA-03 Semantic Continuity ↔ CFA-01 World

### Question

What exact World-side reference/result does Semantic Continuity require for resolved, ambiguous, stale, unresolvable and conflicted grounding?

### Minimum input contract

**PROPOSED / CURRENT — ACCEPTED AS CFA-03 INPUT SHAPE:** CFA-03 requires the World-side result to preserve six distinct dimensions:

```text
WorldReferenceInput
  referenceRef(s)
  worldMeaning
  resolutionState
  correspondenceState
  evidence/source basis
  freshness
  unresolved/conflict detail
```

CFA-03 does not require CFA-01 to expose its internal ontology, cases, graph structures or session model.

### Required dimensions

| Dimension | Semantic Continuity requirement | Boundary rule |
|---|---|---|
| Reference identity | A stable World subject/candidate reference that can be carried through interpretation | Reference identity is not command identity and not authority |
| World meaning | Meaning of the referenced World subject/candidate | World meaning remains CFA-01 owned |
| Resolution | `RESOLVED / AMBIGUOUS / STALE / UNRESOLVABLE / CONFLICTED` | Resolution is not permission |
| Correspondence | Explicit correspondence support/status and candidate relations | Correspondence is not automatically equivalence or proof |
| Evidence/basis | References sufficient to explain why grounding result was produced | Evidence constrains semantic claim; it does not authorize |
| Freshness | `CURRENT / STALE / UNRESOLVABLE` when age/basis materially affects interpretation | Freshness cannot be silently upgraded |
| Unknown/conflict detail | Preserve unresolved alternatives and incompatibilities | Unknown/conflicted must survive into downstream semantic state |

### State treatment

**DERIVED / CURRENT:**

- **RESOLVED:** Semantic Continuity may treat the World reference as the current grounded target subject to the stated basis; this does not authorize an effect.
- **AMBIGUOUS:** Interpretation must preserve candidate alternatives or refuse to collapse them; it must not manufacture a unique target.
- **STALE:** The prior World reference remains lineage/evidence, but current semantic interpretation must retain its stale qualification.
- **UNRESOLVABLE:** No World target is asserted as grounded; the semantic pipeline must preserve the unresolved state.
- **CONFLICTED:** Competing World/correspondence claims remain explicit; deterministic interpretation must not flatten the conflict into a false unique target.

### Important separation

**INVARIANT / DERIVED:**

```text
World meaning       != grounding result
grounding result    != interpretation
interpretation      != Intent
Intent              != authorization
evidence            != authority
confidence          != proof
```

A grounded reference is an input to semantic continuity, not a completed semantic decision about the entire command.

### RP-01 status

**AGREED / CURRENT — CFA-03 SIDE:** CFA-03 accepts the proposed World-side result as the minimum interoperable input contract, with one clarification: the result must remain a seam contract rather than a mandate for CFA-01's internal representation.

**Shared-boundary note / UNKNOWN:** This is acceptance by CFA-03 of the proposed input shape; it does not by itself activate the World ↔ Semantic boundary.

---

## RP-02 — CFA-03 Semantic Continuity ↔ CFA-04 Authority

### Question

What minimum semantic package crosses from canonical Intent/Plan meaning into live authorization, and how does expiry/revocation return without becoming semantic meaning?

### Semantic → Authority package

**PROPOSED / CURRENT:** The smallest useful package is:

```text
AuthorizationRequest
  actorRef
  behalfRef (nullable where not applicable)
  intentRef / planRef
  intendedEffect
  targetRef(s)
  capabilityRef + operationRef
  relevantContextRef / scopeRef
  semanticProvenanceRefs
  declaredRiskContext (when already available)
```

#### 1. actor / behalf

**DERIVED / CURRENT:** CFA-03 forwards the semantic actor/behalf references carried by the canonical request. CFA-03 does not create or validate canonical principal identity.

**Authority owns:** live principal/standing/delegation/consent semantics.

#### 2. intended effect

**DERIVED / CURRENT:** CFA-03 supplies the semantic description of what the request intends to cause.

The effect description must be distinguishable from the mechanism used to realize it.

**Invariant:** interpretation of an intended effect does not grant permission to produce it.

#### 3. target reference

**DERIVED / CURRENT:** CFA-03 passes the World/Data-backed semantic target reference produced by grounding.

The target remains a reference to a subject/effect domain, not an authority verdict.

#### 4. capability / operation reference

**PROPOSED / CURRENT:** CFA-03 supplies the known capability/operation reference needed to express what realization path is contemplated.

CFA-06 remains the owner of capability semantics and realization.

#### 5. context / scope

**PROPOSED / CURRENT:** CFA-03 supplies only the semantic context/scope relevant to intended meaning.

Any authority scope narrowing, principal-relative visibility, standing or delegation constraint is evaluated by CFA-04 rather than inferred by CFA-03.

#### 6. semantic provenance

**DERIVED / CURRENT:** Carry the provenance needed to connect authorization back to canonical semantic meaning and its World grounding basis.

This is continuity provenance, not a general-purpose authority proof.

#### 7. risk information

**PROPOSED / CURRENT:** CFA-03 may carry a risk declaration already established by the relevant domain contract. It does not independently redefine capability risk or permission thresholds.

### Authority resolves

**OBSERVED / CURRENT from CFA-04 Round 1:** Authority owns:

- authorization/permission semantics;
- authority basis;
- scope and duration;
- consent;
- standing;
- delegation/attenuation;
- revocation/expiry;
- authority ↔ invocation binding;
- authority-specific refusal/escalation.

### Authority → Semantic Continuity result

**PROPOSED / CURRENT:** Return a distinct live authorization result:

```text
AuthorizationResult
  authorizationState
  authorityRef
  scope/duration constraints
  consent/standing/delegation constraints
  invalidation/revocation/expiry state
  refusal/escalation reason
  checkedAt / freshness
```

The exact authority-internal representation remains CFA-04's responsibility.

### Durable versus live

**DERIVED / CURRENT:**

| Item | Durable / semantic continuity | Live authority |
|---|---|---|
| Intent/Plan meaning | Durable canonical semantic artifact | Consumed |
| Target reference | Durable/citable semantic reference | Consumed |
| Semantic provenance | Durable lineage/evidence references | Consumed |
| Capability/operation reference | Durable semantic/capability citation as available | Resolved against live state |
| Authority basis | Citation/reference only | Live validity must be re-resolved |
| Expiry/revocation | Historical result may be preserved for reconstruction | Current state controls the gate |
| Authorization verdict | Prior verdict may be evidence/history | Current verdict belongs to Authority |

### Expiry and revocation return path

**PROPOSED / CURRENT:** Expiry or revocation returns to Semantic Continuity as **live authorization status attached to the same semantic request**, not as a mutation of the request's meaning.

Example:

```text
Intent meaning: unchanged
Target meaning: unchanged
Requested effect: unchanged
Authorization state: EXPIRED / REVOKED / REFUSED
```

**INVARIANT / DERIVED:** A revoked or expired authority state must not cause CFA-03 to rewrite the Intent from “perform X” to “X means something else.”

Where a later user or system action changes the intended meaning, that is a new semantic transformation and must be represented separately.

### Orthogonal states that must remain distinct

**INVARIANT / DERIVED:**

```text
Grounding        != Authorization
Interpretation   != Permission
Confidence       != Authority
Representation   != Authority
Intent validity  != Permission
Execution result != Authorization meaning
```

### RP-02 status

**UNKNOWN / CURRENT:** The minimum package and return-path are defined from the current CFA-03 and CFA-04 Round-1 evidence, but CFA-04 has not yet supplied a Round-2 acceptance statement. The precise live/durable authority citation form remains open.

**Most important unresolved RP-02 point:** the minimum authority citation and re-resolution contract carried across Intent → Work → Authority must be shared without turning semantic artifacts into an authority cache.

---

## RP-06 — CFA-03 Semantic Continuity ↔ CFA-02 Data

### Question

How can semantic continuity and durable data continuity refer to the same event/meaning without collapsing multiple identity dimensions?

### Minimal crosswalk

| Identity / subject | Semantic Continuity responsibility | Data responsibility | Crossing artifact | Must not become |
|---|---|---|---|---|
| Semantic identity | Preserve meaning across transformations and references | Preserve mappings/lineage to durable records | semantic reference + explicit mapping relation | Universal identity |
| Record identity | Consume durable record reference | Own canonical record identity | canonical record ref | World semantic identity |
| Intent identity | Preserve semantic meaning/continuity of the Intent artifact | Persist canonical Intent record/revision identity | intent semantic ref + record/revision ref | Permission or Work identity |
| Revision identity | Interpret semantic consequence/continuity of revisions | Own durable revision/history | revision ref + semantic continuity relation | New semantic identity by itself |
| Evidence identity | Preserve evidentiary/provenance links needed for semantic continuity | Persist evidence/lineage references as required by data continuity | evidence refs + relation to semantic artifact | Authority by citation |
| Representation identity | Track continuity from canonical meaning to representations | Persist representation metadata/references when durable | representation ref + derivation relation | Canonical meaning |
| Event identity | Preserve what event means in the semantic chain | Persist durable event record identity/revision/lineage where applicable | event semantic role + durable event ref | Universal Event primitive |
| State identity | Preserve semantic meaning of a state when used | Persist durable state representation/revision where applicable | semantic state relation + durable ref | Authorization or ontology by naming |

### Required pattern

**PROPOSED / CURRENT:** Use **explicit relations between identities**, not one shared identifier:

```text
semanticMeaningRef
   ↕ derives-from / represents / records / evidences / revises
recordRef
   ↕
revisionRef
   ↕
evidenceRef
   ↕
representationRef
```

An Intent can therefore refer to the same semantic target/meaning while the durable record, revision, evidence item and representation each keep their own identity.

### Event / meaning case

**DERIVED / CURRENT:** When multiple planes refer to the “same event,” they may be referring to different aspects:

- semantic event meaning;
- durable event record;
- execution attempt;
- observation/evidence item;
- representation of the event.

These are related by explicit provenance/derivation/correspondence, not collapsed into one universal event ID.

### RP-06 status

**UNKNOWN / CURRENT:** This crosswalk is sufficient as a Semantic Continuity proposal, but CFA-02 has not supplied a Round-2 acceptance statement. The exact durable relation vocabulary and minimum lineage guarantees remain open.

**Peer question:** Which explicit mapping/lineage relation can CFA-02 guarantee so a semantic reference can survive record revision or representation change without reusing durable record identity as semantic identity?

---

## Evidence basis

### OBSERVED / CURRENT

- `AGENTS_CONTEXT/ARCHITECTURE_STEWARD/SUBAGENTS/WORLD-ONTOLOGY-CONTEXT/BOUNDARY-ROUND-2-ADDENDUM-2026-09-27.md`
- `AGENTS_CONTEXT/ARCHITECTURE_STEWARD/SUBAGENTS/SELF-KNOWLEDGE-COMMAND-COMPILER/CORE-AGENT-IDENTITY.md`
- `AGENTS_CONTEXT/ARCHITECTURE_STEWARD/SUBAGENTS/SELF-KNOWLEDGE-COMMAND-COMPILER/STATE.md`
- `AGENTS_CONTEXT/ARCHITECTURE_STEWARD/SUBAGENTS/SELF-KNOWLEDGE-COMMAND-COMPILER/BOUNDARY-ROUND-1-DECLARATION-2026-09-26.md`
- `AGENTS_CONTEXT/ARCHITECTURE_STEWARD/SUBAGENTS/AUTHORITY-GOVERNANCE/BOUNDARY-ROUND-1-DECLARATION-2026-09-26.md`
- `AGENTS_CONTEXT/ARCHITECTURE_STEWARD/SUBAGENTS/DATA-MODEL-STEWARD/BOUNDARY-ROUND-1-DECLARATION-2026-09-26.md`
- `omega-baseline/omega-final/docs/decisions/D-411-integration.md` (canonical Intent/law citation seam referenced by CFA-03 Round-1 evidence)
- `omega-baseline/omega-final/docs/decisions/D-452-invocation.md` (live authority resolution evidence referenced by CFA-04 Round-1)
- `omega-baseline/omega-final/docs/decisions/D-453-standing.md`
- `omega-baseline/omega-final/docs/decisions/D-454-delegation.md`

### DERIVED / CURRENT

Semantic Continuity is best served by explicit semantic and provenance relations across peer-owned identities, not by creating another identity namespace or universal database.

### UNKNOWN / CURRENT

- Exact authority citation shape and live re-resolution contract accepted by CFA-04.
- Exact durable semantic↔record mapping accepted by CFA-02.
- Complete multi-step Plan/Work authorization package.
- Whether every Event/State occurrence warrants durable first-class identity.

## Unresolved items

1. **UNKNOWN / CURRENT:** Authority citation/re-resolution form remains open with CFA-04.
2. **UNKNOWN / CURRENT:** Data mapping/lineage relation vocabulary remains open with CFA-02.
3. **UNKNOWN / CURRENT:** Multi-step Plan/Work authorization semantics remain to be reconciled with CFA-05 later.
4. **UNKNOWN / CURRENT:** Event/State cross-plane identity remains intentionally non-universal.
5. **UNKNOWN / CURRENT:** No shared boundary activation is justified yet.

## Completion classification

| RP | Status | Rationale |
|---|---|---|
| RP-01 | AGREED | CFA-03 accepts CFA-01's minimum World reference/result shape with the boundary-preserving clarification recorded above. |
| RP-02 | UNKNOWN | Minimum semantic/authority package is proposed; CFA-04 Round-2 acceptance is not yet evidenced. |
| RP-06 | UNKNOWN | Crosswalk is proposed; CFA-02 Round-2 acceptance and exact relation guarantees are not yet evidenced. |

## Human-owner intervention

**NO / DERIVED:** Current evidence does not require owner intervention. Escalate only if peer Round-2 reconciliation produces an irreducible ownership conflict, an Ω-law collision, or a product-policy choice that cannot be reduced to a seam contract.

## Completion note

This addendum does not reopen CFA-03 identity, activate a shared boundary, redefine World ontology, define Authority policy, create a universal identity database, or modify Ω law.
