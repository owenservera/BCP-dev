# CFA-04 Authority Governance Steward — Round-2 Reconciliation Addendum

> Date: 2026-09-27
> Classification: CFA-04 current reconciliation claim; identity remains PROPOSED / OWNER DIALOGUE REQUIRED
> Basis: repository `main` as inspected after CFA-01 and CFA-03 Round-2 addenda
>
> Evidence labels: OBSERVED / DERIVED / PROPOSED / UNKNOWN / CONFLICTED.
> Freshness: CURRENT / STALE / UNRESOLVABLE where material.
>
> This addendum reconciles seams only. It does not ratify CFA-04, activate shared boundaries, redesign World/Semantic/Data, or modify Ω law.

## Round-2 posture

**OBSERVED / CURRENT:** CFA-04 remains a proposed authority/governance function whose coherent responsibility is authorization and governance semantics, not World ontology, durable identity, Intent construction, Work lifecycle or runtime enforcement.

**OBSERVED / CURRENT:** CFA-03 Round-2 accepts CFA-01's minimum World reference/result shape and proposes a minimum semantic package entering live authorization.

**OBSERVED / CURRENT:** CFA-01 Round-2 separates World presence, addressability, projection visibility and scoped accessibility from Authority's live authorization result.

**OBSERVED / CURRENT:** D-452 requires explicit invocation framing and gate-time authority re-resolution; D-453 requires bounded, expiring, revocable standing; D-454 requires authority-chain attenuation and vault-recomputed delegation.

**DERIVED / CURRENT:** The Authority seam should preserve these dimensions separately:
`text
meaning / target / intent / capability
        ->
live authority evaluation
        ->
authorization result
        ->
durable citation / evidence
`

---

## RP-02 — CFA-04 Authority ↔ CFA-03 Semantic Continuity

### Minimum semantic input

**PROPOSED / CURRENT — AGREED WITH CFA-03:** The minimum semantic package entering authorization is:

`text
AuthorizationRequest
  actorRef
  behalfRef?
  intentRef / planRef
  intendedEffect
  targetRef(s)
  capabilityRef
  operationRef
  relevantContextRef / semanticScopeRef
  semanticProvenanceRefs
  declaredRiskContext?
`

### What Semantic Continuity supplies

**DERIVED / CURRENT:**

- **actor / behalf:** who is semantically identified as acting and for whom, using peer-owned identity references;
- **intentRef / planRef:** canonical semantic request/plan reference;
- **intendedEffect:** semantic description of the consequence being requested;
- **targetRef(s):** grounded World/Data references;
- **capabilityRef / operationRef:** the contemplated operation/realization reference without assuming capability implies permission;
- **relevantContextRef / semanticScopeRef:** semantic context needed to interpret what the request is about;
- **semanticProvenanceRefs:** continuity references linking the authorization request to its semantic derivation;
- **declaredRiskContext:** only where already supplied by the governing semantic/capability contract; CFA-04 does not invent capability risk declarations.

### What Authority resolves exclusively

**DERIVED / CURRENT:**

- principal/actor standing as applicable to the live request;
- authority basis;
- consent;
- standing;
- delegation and attenuation;
- authority scope and conditions;
- validity interval;
- revocation/invalidation;
- applicable policy/law constraints within existing authority mechanisms;
- invocation binding;
- current authorization state.

These are authority semantics, not semantic-interpretation outputs.

### Live decision output

**PROPOSED / CURRENT:**

`text
AuthorizationResult
  state:
    AUTHORIZED
    REFUSED
    UNRESOLVED
    EXPIRED
    REVOKED
    OUT_OF_SCOPE
  authorityRef
  scope/result constraints
  checkedAt
  invalidation/expiry reference where material
  refusal/escalation reason where applicable
  invocation/frame/causation reference
`

**OBSERVED / CURRENT:** The existing D-452 invocation mechanism already binds caller/behalf/op/scope/authority/intent reference and re-resolves authority at every check. The Round-2 seam contract must not duplicate that mechanism.

### Durable citation versus live decision

**DERIVED / CURRENT:**

- A **live authorization decision** is the current result at the execution gate. It can become stale immediately after expiry, revocation, scope change, target change, or another contract-defined trigger.
- A **durable authority citation** is a historical/reference package sufficient to reconstruct which authority corridor was evaluated and what result was recorded.
- Data may durably retain the citation; Authority retains semantic ownership of what the authority means and how it resolves live.
- A historical `AUTHORIZED` citation must never be presented as current permission without a fresh live evaluation where the governing contract requires re-resolution.

### Expiry / revocation return path

**PROPOSED / CURRENT:** Expiry/revocation returns to CFA-03 as a **live authority-status fact attached to the same semantic request**, not as a semantic rewrite.

Example:

`text
Intent meaning         = unchanged
Target meaning         = unchanged
Requested effect       = unchanged
Authorization state    = EXPIRED | REVOKED | REFUSED
`

A later semantic change creates a new semantic transformation/Intent rather than mutating the meaning of the prior request.

**INVARIANT / DERIVED:**

`text
Intent            != Permission
Grounding         != Authorization
Authorization     != Semantic Meaning
Authority result  != World truth
Evidence          != Authority
`

### Re-resolution triggers

**OBSERVED / CURRENT:** D-452 requires authority re-resolution at every invocation check; D-453 makes expiry/revocation live; D-454 recomputes delegation from authority rows rather than carried claims.

**PROPOSED / CURRENT:** The semantic corridor must therefore treat a previous authority result as historical once a contract-defined re-check point is reached. CFA-03 should receive the new result without importing Authority state into CANON/Intent meaning.

### RP-02 status

**AGREED / CURRENT — CFA-04 SIDE:** CFA-04 accepts the CFA-03 minimum package and the orthogonal return-path, with the clarification that risk, capability semantics and durable Intent persistence remain outside CFA-04.

**Shared-boundary note / UNKNOWN:** This is peer-side agreement on the minimum handoff, not activation of an ACTIVE boundary.

---

## RP-03 — CFA-04 Authority ↔ CFA-01 World

### Minimal crosswalk

**AGREED WITH CLARIFICATION / CURRENT:** CFA-04 accepts the World distinction, but `accessible` is best treated as a **composed seam property** rather than an Authority synonym or an unqualified World ontology state.

| State | World-side assertion | Authority-side assertion | Boundary rule |
|---|---|---|---|
| `existent` | World may assert existence when its basis supports it | Authority consumes target identity if authorization concerns it | Permission cannot change existence. |
| `addressable` | World may assert a resolvable/candidate World reference | Authority may require a resolvable target for authorization | Addressability never implies permission. |
| `visible` | World/projection may say subject is included in a stated view | Authority may constrain what a principal is allowed to receive/see | Omission from a view is not proof of nonexistence. |
| `accessible` | A scoped projection/read availability may be reported with explicit basis | Authority determines whether the principal is authorized for the relevant access/effect | Accessibility is not a synonym for authorization; it may be a composed outcome. |
| `authorized` | World does not assert this | Authority owns live permission semantics | Authority result is separate from World truth. |
| `nonexistent` | World may assert only with adequate positive basis | Authority must not manufacture nonexistence from denial | `DENIED` does not become `NONEXISTENT`. |
| `not observed` | World may assert absence of supported observation under its basis | Authority cannot infer existence/nonexistence from the absence alone | Not-observed remains epistemic, not permission. |

### State-transition boundary

**PROPOSED / CURRENT:**

`text
World subject/reference
   ↓
World presence + addressability + projection/accessibility basis
   ↓
Authority evaluation for principal/effect
   ↓
AUTHORIZED / REFUSED / UNRESOLVED / EXPIRED / REVOKED / OUT_OF_SCOPE
`

No Authority result should feed backward as an ontological rewrite.

### What cannot be inferred

**INVARIANT / DERIVED:**

- `existent` → not necessarily `authorized`
- `addressable` → not necessarily `authorized`
- `visible` → not necessarily `authorized`
- `accessible` → not necessarily `authorized`
- `not observed` → not `nonexistent`
- `refused` → not `nonexistent`
- hidden/omitted → not `nonexistent`
- possession of a capability → not `authorized`

### Authority-side refinement of accessible

**PROPOSED / CURRENT:** When a system reports an `accessible` outcome, it should make clear which of these was established:

1. World/projection availability;
2. authority permission to access/disclose;
3. both.

The seam must not compress these into one undocumented boolean.

### RP-03 status

**AGREED / CURRENT — CFA-04 SIDE:** CFA-04 accepts the World/Authority distinction and specifically agrees that `authorized` remains Authority-owned. `accessible` remains a composed seam state whose exact representation should be finalized jointly rather than assigned to one endpoint.

---

## RP-05 — CFA-04 Authority ↔ CFA-02 Data

### Question

What authority information must be durably retained with consequential data mutation?

### Minimum durable authority citation

**PROPOSED / CURRENT:** The smallest durable citation capable of reconstructing the authority corridor is:

`text
AuthorityCitation
  causationRef
  actorRef
  behalfRef?
  targetRef
  operationRef
  effectRef? / intentRef?
  authorityRef
  scopeRef / scopeDigest
  checkedAt
  authorizationState
  expiryRef? / revocationRef?
  delegationChainRef? / authorityChainDigest?
  evidenceRefs
  resultRef / mutationRef
`

Not every field must be a physical column or one record. The contract is about the information that must remain reconstructable.

### Why these fields cross

**DERIVED / CURRENT:**

- **actor / behalf** explains who acted and on whose authority;
- **target / effect / operation** identifies what was governed;
- **intentRef** ties the mutation back to semantic meaning where present;
- **authorityRef** identifies the basis that was evaluated;
- **scopeRef/digest** identifies the evaluated authority scope without turning Data into the authority interpreter;
- **checkedAt** establishes temporal context;
- **authorizationState** records what the gate returned at that time;
- **expiry/revocation/delegation references** explain why a prior authority result later ceased to be current;
- **evidenceRefs / resultRef / mutationRef** link authority evaluation to the actual data mutation and its evidence.

### Durable versus live

| Concern | Durable citation in Data | Live authority in CFA-04 |
|---|---|---|
| Actor / behalf | Retained as reconstruction references | Resolved for current request |
| Target / operation / effect | Retained | Evaluated in current scope |
| Authority basis | Retained by reference | Interpreted and checked live |
| Scope | Retained by ref/digest where needed | Matched against current authority |
| Authorization verdict | Historical fact at check time | Fresh verdict at current gate |
| Expiry | Historical timing/citation | Current validity check |
| Revocation | Historical citation | Current invalidation state |
| Delegation | Historical chain reference/digest | Current chain fold/re-resolution |
| Evidence | Retained references | Consumed as specified by authority contract |
| Mutation/result | Retained by Data | Consumed only to relate the authority check to the governed effect |

**INVARIANT / DERIVED:** Data stores the durable reconstruction trail; Data does not become the authority source. Authority evaluates the live question; Authority does not become canonical mutation storage.

### D-452 / D-453 / D-454 continuity

**OBSERVED / CURRENT:** D-452's invocation row already carries frame/authority/intent information and enforces live re-resolution; D-453 carries expiring/revocable standing; D-454 carries an authority-chain digest from a vault-recomputed delegation fold.

**DERIVED / CURRENT:** The Round-2 durable citation should reference these existing authority artifacts rather than create a second parallel authority record system.

### Mutation reconstruction

**PROPOSED / CURRENT:** A reconstructed consequential mutation should answer, at minimum:

`text
who acted?
for whom?
what effect/operation?
against which target?
under which authority reference?
under what scope/time?
what did the live gate decide?
what mutation/result followed?
what evidence ties them together?
`

Where a field was not applicable or not available, the absence must remain explicit rather than inferred.

### RP-05 status

**UNKNOWN / CURRENT:** The minimum durable contract is specified, but CFA-02 has not yet produced its Round-2 acceptance statement. In particular, the exact durable location/shape for authority citations and the join between authority verdict, mutation result and evidence remain open.

**Peer question for CFA-02:** Which durable record/reference can guarantee reconstruction of the authority corridor without interpreting or re-evaluating authority semantics inside the Data layer?

---

## Evidence basis

### OBSERVED / CURRENT

- `AGENTS_CONTEXT/ARCHITECTURE_STEWARD/SUBAGENTS/WORLD-ONTOLOGY-CONTEXT/BOUNDARY-ROUND-2-ADDENDUM-2026-09-27.md`
- `AGENTS_CONTEXT/ARCHITECTURE_STEWARD/SUBAGENTS/SELF-KNOWLEDGE-COMMAND-COMPILER/BOUNDARY-ROUND-2-ADDENDUM-2026-09-27.md`
- `AGENTS_CONTEXT/ARCHITECTURE_STEWARD/SUBAGENTS/AUTHORITY-GOVERNANCE/BOUNDARY-ROUND-1-DECLARATION-2026-09-26.md`
- `AGENTS_CONTEXT/ARCHITECTURE_STEWARD/SUBAGENTS/AUTHORITY-GOVERNANCE/AUTHORITY-MODEL.md`
- `AGENTS_CONTEXT/ARCHITECTURE_STEWARD/SUBAGENTS/AUTHORITY-GOVERNANCE/STATE.md`
- `omega-baseline/omega-final/docs/decisions/D-452-invocation.md`
- `omega-baseline/omega-final/docs/decisions/D-453-standing.md`
- `omega-baseline/omega-final/docs/decisions/D-454-delegation.md`

### DERIVED / CURRENT

The cleanest Round-2 authority seam is a three-part separation:

`text
semantic request
  ≠
live authorization decision
  ≠
durable authorization citation
`

This preserves the existing Omega pattern that authority is checked at the live gate while reconstruction remains durable.

### UNKNOWN / CURRENT

- Exact Data-side storage/join shape for authority citations.
- Final composite semantics of `accessible`.
- Full multi-step Plan/Work authority contract.
- Whether any future authority corridor requires additional durable references beyond those listed here.

## Unresolved items

1. **UNKNOWN / CURRENT:** Exact durable AuthorityCitation storage/join accepted by CFA-02.
2. **UNKNOWN / CURRENT:** Final treatment of `accessible` as a composed World/Authority seam state.
3. **UNKNOWN / CURRENT:** Multi-step and batched authorization semantics with CFA-05.
4. **UNKNOWN / CURRENT:** Any owner-level policy choice affecting principal-relative World semantics.

## Identity gate

**OBSERVED / CURRENT:** CFA-04 remains PROPOSED / OWNER DIALOGUE REQUIRED.

**INVARIANT / DERIVED:** Completing Round-2 boundary reconciliation does not ratify CFA-04 identity.

## Completion classification

| RP | Status | Rationale |
|---|---|---|
| RP-02 | AGREED | CFA-04 accepts the minimum semantic package and separate live-result return path proposed by CFA-03. |
| RP-03 | AGREED | CFA-04 accepts the World distinction; `accessible` is explicitly treated as a composed seam property, not authority. |
| RP-05 | UNKNOWN | Durable authority citation contract is specified, but CFA-02 acceptance and exact storage/join are not yet evidenced. |

## Human-owner intervention

**NO / DERIVED:** No current evidence requires human-owner intervention to complete this seam round. Owner dialogue remains required for CFA-04 identity, but this addendum does not attempt to perform that ratification.

## Completion note

This addendum does not ratify CFA-04, activate a shared boundary, modify Ω law, create a second authority store, or make Data an authority evaluator.
