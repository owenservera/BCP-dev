# CFA-09 M1 — Minimum Change Contract Characterization
## 2026-09-27

> Status: DERIVED — PROPOSED, READY FOR PEER RECONCILIATION
> Scope: M1 — Make Change a First-Class Semantic Unit
> Owner: CFA-09 — Change, Compatibility & Continuity Steward
> Authority: owner decisions + Ω ratified law + current repository evidence. This document does not amend Ω law or create a new persistence/authority system.

## 1. Question

What is the smallest reusable semantic contract that lets VIVIM describe and govern a consequential change across different domain mechanisms without creating a second canonical store?

## 2. Result

The minimum useful unit is a Change Envelope: a logical, evidence-bearing record that references canonical states and delegates canonical meaning, storage, authority, execution, and domain lifecycle semantics to their existing owners.

It is not a universal evolution database, a replacement for Data revisions, a replacement for Authority decisions, a runtime admission record, a provider-healing record, or a Forge composition record.

It is the cross-domain change semantics and lifecycle envelope that relates those existing records.

### Minimum logical shape

    ChangeEnvelope
      changeId
      subjectRefs
      previousStateRefs
      proposedStateRefs
      requestedBy
      causedBy
      reason
      changeClass = MAINTENANCE | EVOLUTION | CONSTITUTIONAL_AMENDMENT
      semanticDelta = { kind, statement?, basisRefs }
      lifecycleState = OBSERVED | CHARACTERIZED | PROPOSED | IMPACTED | COMPATIBILITY_CHECKED | AUTHORIZED | APPLIED | VERIFIED | PROMOTED | ACTIVE | REFUSED | BLOCKED | QUARANTINED | ROLLED_BACK | RETIRED
      impact = { status: KNOWN | UNKNOWN | CONFLICTED, refs, basisRefs }
      compatibility = dimensioned assessments
      authority = { status, refs }
      applicationEvidence
      verificationEvidence
      promotionState?
      rollbackReference?
      createdAt
      updatedAt?

### Compatibility assessment

    CompatibilityAssessment
      dimension = STRUCTURAL | SEMANTIC | IDENTITY | RELATIONSHIP | BEHAVIOR | AUTHORITY | EVIDENCE | PERSISTENCE_RECOVERY | PROJECTION | RESOURCE_LIFECYCLE
      result = PASS | FAIL | UNKNOWN | CONFLICTED | NOT_APPLICABLE
      evidenceRefs
      notes?

The Ref type is intentionally abstract. It points into an existing canonical or evidence-bearing namespace and never becomes a new identity authority.

## 3. Why these fields are minimum

### Change identity
changeId addresses the change itself without confusing the change's identity with the identity of the subject being changed.

### Subject and state continuity
subjectRefs, previousStateRefs, and proposedStateRefs force the change to name its semantic target and history instead of treating a changed file, plugin version, or row as the semantic unit.

### Causality and rationale
requestedBy, causedBy, and reason distinguish who or what requested a change from the domain meaning of the changed subject.

### Change class
MAINTENANCE is deterministic and bounded. EVOLUTION is governed change to data, capability, realization, configuration, composition or executable behavior. CONSTITUTIONAL_AMENDMENT changes rules governing change and leaves the ordinary lifecycle through the separate Ω constitutional process.

### Semantic delta
Every meaning-changing change needs an explicit semantic delta. Shape-only or projection changes may use lighter treatment only where equivalence is evidenced.

### Lifecycle state
Lifecycle state is separate from compatibility and authority. In particular:

    VERIFIED != COMPATIBLE
    COMPATIBLE != AUTHORIZED
    AUTHORIZED != PROMOTED
    PROMOTED != ACTIVE

Terminal alternatives remain explicit: REFUSED, BLOCKED, QUARANTINED, ROLLED_BACK, RETIRED.

### Impact
Impact has an explicit status. A missing impact calculation is never silently interpreted as zero.

### Compatibility
Compatibility is a dimensioned evidence result attached to this change. A single boolean compatible=true is insufficient.

### Authority
The envelope records authority status or references but never decides authority. Compatibility therefore cannot become permission.

### Evidence
Application evidence and verification evidence stay separate. Mutation success does not become proof of correctness.

### Promotion and rollback references
A change can point to the event/state that promoted it and the state/event needed to restore or reconstruct the prior state. Rollback never means deletion of the intervening history.

## 4. Lifecycle transition rule

    OBSERVED
      -> CHARACTERIZED
      -> PROPOSED
      -> IMPACTED
      -> COMPATIBILITY_CHECKED
      -> AUTHORIZED
      -> APPLIED
      -> VERIFIED
      -> PROMOTED
      -> ACTIVE

Any applicable state may instead resolve to REFUSED, BLOCKED, QUARANTINED, ROLLED_BACK, or RETIRED.

Constraints:
1. AUTHORIZED is never derived solely from compatibility.
2. VERIFIED is never derived solely from successful application.
3. ACTIVE is not implied by PROMOTED unless runtime activation actually establishes it.
4. ROLLED_BACK preserves evidence of the intervening change.
5. UNKNOWN and CONFLICTED evidence may prevent progression according to slice-specific policy.
6. Constitutional amendment leaves this lifecycle through the separate constitutional process.

## 5. Evidence / authority split

    subject
      -> previous state
      -> proposed state
      -> semantic delta
            -> impact
            -> compatibility
            -> authority implication
            -> authority result
            -> application
            -> verification
            -> promotion / activation
            -> continuity monitoring
            -> rollback / quarantine / retirement

No node becomes authority merely because it appears in the envelope.

## 6. Real mechanism mapping — D-315 agent version/quarantine path

OBSERVED / CURRENT:
- Active, version-pinned behavior contract is required for admission.
- Quarantined or retired agent identity is terminal.
- Post-rollback version mismatch refuses new execution.
- Every execution attempt gets a ledger row.
- Admitted executions settle while preserving the version under which they were admitted.
- A post-settle quarantine observation is annotated rather than pretending an admitted call was interrupted.

Mapping:
| Change-contract concept | D-315 evidence |
| --- | --- |
| subjectRefs | agent / behavior-contract identity |
| previousStateRefs | prior behavior-contract revision |
| proposedStateRefs | replacement or staged behavior revision |
| requestedBy / causedBy | execution/change causation metadata |
| changeClass | governed evolution semantics |
| semanticDelta | implicit today; not fully normalized |
| lifecycleState | contract state + admission/refusal + rollback |
| impact | not generic/transitive in D-315 |
| compatibility | version-pinning/admission constraint; not full compatibility vector |
| authority | law checks remain distinct |
| applicationEvidence | execution ledger + vault append |
| verificationEvidence | D-315 tests and gate evidence |
| promotionState | behavior contract lifecycle |
| rollbackReference | behavior rollback/re-activation evidence |
| history | version pin + per-attempt ledger annotation |

Interpretation: D-315 is evidence for reusable lifecycle/version/history primitives, not evidence that a generic cross-domain Change Envelope already exists.

## 7. Real mechanism mapping — D-326 provider realization healing path

OBSERVED / CURRENT:
- Provider realization status is written by the healing/verification path.
- Realization identity is derived through providerRealizationId().
- Healing writes DEGRADED and TESTING.
- Prior revision is preserved through supersedes.
- evidenceRefs cite the drift/trigger evidence and healing event.
- Verification can move the realization through REQUIRES_REDISCOVERY to PROMOTED.
- The provider registry reads the resulting status from the real vault.

Mapping:
| Change-contract concept | D-326 evidence |
| --- | --- |
| subjectRefs | provider realization identity |
| previousStateRefs | prior realization revision |
| proposedStateRefs | fresh healed/reverified realization state |
| requestedBy / causedBy | healing / verification run context |
| changeClass | governed evolution / repair |
| semanticDelta | drift/replacement exists but is not genericized |
| lifecycleState | DEGRADED -> TESTING -> REQUIRES_REDISCOVERY -> PROMOTED |
| impact | local realization impact, not generic transitive impact |
| compatibility | probe results, not a normalized compatibility vector |
| authority | separate concern |
| applicationEvidence | healing/verification evidence refs |
| verificationEvidence | probe evidence + lifecycle round-trip tests |
| promotionState | PROMOTED / verification lifecycle |
| rollbackReference | not generalized cross-domain |
| history | revision + supersedes |

Interpretation: D-326 is a second independent evidence pattern for subject state + evidence + supersession + lifecycle while retaining provider-specific ownership.

## 8. Common minimum exposed by both mechanisms

D-315 and D-326 converge on a small primitive set:

    named subject
    + addressable prior/current state
    + explicit lifecycle
    + evidence references
    + causation/run context
    + preserved predecessor history

The cross-domain gap is the layer that relates those primitives into:

    subject
      -> semantic delta
      -> impact
      -> compatibility
      -> authority implication
      -> application
      -> verification
      -> promotion/activation
      -> continuity/recovery

That is the smallest coherent addition CFA-09 should govern.

## 9. Fields intentionally not added

Do not add canonical object schemas, a universal identity resolver, a second revision system, Authority policy rules, Work scheduling/attempt semantics, provider-specific healing states, Forge composition semantics, runtime enforcement primitives, surface state models, or a global resource ledger.

These belong to existing owners.

## 10. Falsifiers

### F-01 — Cross-domain non-reuse
Two real domain mechanisms require incompatible meanings for the proposed minimum envelope before their domain-specific details can be represented.

### F-02 — Duplicate identity authority
Implementing the minimum contract requires a new identity generator/store instead of references to existing canonical identities.

### F-03 — State collapse
A real change cannot distinguish lifecycle state from compatibility or authority without ambiguity.

### F-04 — History loss
Representing rollback requires deleting or overwriting the failed/intervening state.

### F-05 — False zero-impact
A fixture with incomplete dependency knowledge produces the same representation as a proven zero-impact change.

### F-06 — Compatibility-authority leakage
A test can move a change from compatibility-checked to authorized without an independent authority result.

### F-07 — Mechanism overfit
Either D-315 or D-326 cannot map to the envelope without changing its domain-specific canonical meaning.

## 11. Current epistemic classification

| Claim | Classification | Freshness |
| --- | --- | --- |
| D-315 preserves version-pinned admission/rollback evidence | OBSERVED | CURRENT |
| D-326 preserves realization revision/supersession/evidence lifecycle | OBSERVED | CURRENT |
| Both expose a common minimum of subject + state + lifecycle + evidence | DERIVED | CURRENT |
| A logical Change Envelope should sit across those mechanisms | PROPOSED | CURRENT |
| Exact canonical persistence namespace | UNKNOWN | CURRENT |
| Generic impact representation | UNKNOWN | CURRENT |
| Generic authority-reference semantics | UNKNOWN | CURRENT |
| Full multidimensional compatibility evaluator | UNKNOWN | CURRENT |

## 12. Completion judgment

**M1 characterization is sufficient for this bounded task.** The evidence supports a small reusable semantic contract candidate without claiming it is ratified or implemented system-wide.

Next, the candidate must be peer-reconciled against canonical Data identity/revision semantics, semantic-delta vocabulary, Authority result/reference shape, and Runtime admission/activation references.

No production code, shared-boundary activation, or Ω-law change is required by this characterization.