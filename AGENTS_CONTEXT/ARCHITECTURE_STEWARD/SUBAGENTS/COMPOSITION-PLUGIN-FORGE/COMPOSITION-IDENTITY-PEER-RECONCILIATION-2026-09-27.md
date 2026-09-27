# CFA-07 — Composition Identity / Peer Reconciliation
## 2026-09-27

> Status: DERIVED — PARTIALLY CLOSED / PROPOSED
> CFA: CFA-07 — Composition / Plugin / Forge
> agent_id: composition-plugin-forge
> Purpose: Reconcile the Composition Identity + Replacement Survivor Proof Pack with the already-persisted M1 peer evidence from CFA-02, CFA-05, CFA-06, CFA-09 and CFA-10.
> Authority: CFA-local seam artifact. It does not amend Ω law, ratify peer semantics, activate shared boundaries, or authorize production implementation.

## 1. Reconciliation result

The evidence separates two identity problems that must not be conflated.

### A. Exact installed composition identity — existing responsibility

The destination Core-vs-Plugin responsibility matrix already names R-001 Composition identity for the exact installed composition identity, with the signed Recipe as the replacement seam.

Current Ω evidence binds an admitted representation through its signed Recipe, manifest identity/signature, and member content hashes. This is concrete installed/admitted representation identity.

### B. Logical composition lineage — still open

The current CompositionSpec and Recipe shapes carry name, but there is no explicit durable logical composition identity field. The composition security scan derives compositionRef from name.

That current compositionRef is therefore an operational scan reference/display identifier, not sufficient proof of stable semantic identity across valid member or realization replacement.

### Reconciled stack

Logical Composition Identity
→ Composition Semantic Revision
→ Installed Recipe Representation

Plugin/member identity, manifest hash and content hash live at the member/installed-representation layer.

No new identity field is selected for implementation by this reconciliation.

## 2. Peer evidence closure

| Peer | Evidence | CFA-07 conclusion | Status |
|---|---|---|---|
| CFA-02 Data | Continuity Corridor 1 supports reference-oriented identity/revision/source/transformation/evidence/reconstruction links and rejects a universal semantic identity. | Composition references Data-owned records/revisions/lineage rather than redefining them. | CLOSED FOR THIS STAGE |
| CFA-05 Work | M1 Work envelope makes Work the canonical durable execution subject; provider/realization replacement does not itself create a new Work identity; active replacement is a Work-impact seam. | Composition replacement reports impact; CFA-07 does not mutate Work identity/state. | CLOSED FOR THIS STAGE |
| CFA-06 Capability/Realization | Owner alignment states a realization can be replaced without changing semantic Capability identity and preserves old/new realization lineage. | Compatible realization replacement can preserve Capability meaning while composition member/representation lineage changes. | CLOSED FOR THIS STAGE |
| CFA-09 Evolution | M1 reconciliation treats Change as a cross-domain relation over peer-owned subjects/states and keeps subject identity distinct from change identity. | Composition replacement provides composition-side lineage to CFA-09 and does not create a second Change model. | CLOSED FOR THIS STAGE |
| CFA-10 Runtime | M1 K0 matrix keeps Recipe/manifest/content admission and runtime enforcement in K0, with B1 executable-entry proof gaps still explicit. | Logical continuity never substitutes for fresh admission; changed installed representations re-enter the normal runtime boundary. | CLOSED FOR THIS STAGE |
| CFA-04 Authority | Existing boundary keeps authority distinct from history/citation and requires separate live authority handling. | Composition continuity never implies permission continuity. | SUPPORTED / FINAL CORRIDOR LATER |

Closed for this stage means the ownership and seam question is characterized sufficiently for CFA-07 planning. It does not mean the peer CFA has frozen its entire domain contract.

## 3. Reconciled identity stack

### Level 1 — Logical Composition Identity

Proposed meaning: an opaque durable identity for a logical composition lineage answering which composition lineage this represents.

Required properties:
- stable across representation-only changes;
- stable across implementation replacement when composition semantics are preserved;
- not derived from plugin id, manifest hash, content hash, Recipe signature or display name;
- contains no authority meaning;
- is not a second canonical data identity.

Exact field, storage location and wire placement remain OPEN.

### Level 2 — Composition Semantic Revision

Proposed meaning: an addressable version of the composition semantic definition used to distinguish intentional configuration or semantic changes within one logical lineage.

Exact change discriminator remains OPEN.

### Level 3 — Installed Recipe Representation

Observed meaning: the signed/grant-bearing Recipe plus member manifest/content hashes representing the exact admitted installed state.

This layer changes whenever the admitted representation changes and remains subject to normal K0 admission.

## 4. Replacement classes after peer reconciliation

| Class | Logical identity | Semantic revision | Installed Recipe | Current disposition |
|---|---|---|---|---|
| R0 implementation-only replacement, same routed contract | survives | normally survives when semantic expectations remain unchanged | changes | continuity-preserving candidate |
| R1 compatible realization replacement, same semantic Capability/operation | survives | normally survives when composition meaning remains unchanged | changes | continuity-preserving candidate; CFA-06 evidence required |
| R2 representation-only change | survives | survives | changes | continuity-preserving |
| R3 configuration change that alters behavior without changing purpose | survives provisionally | changes | changes | threshold remains OPEN |
| R4 membership change without proven purpose change | survives provisionally | changes | changes | requires semantic-delta evidence |
| R5 new plugin id, same routed op contract | survives | normally survives | changes | lineage-changing implementation replacement |
| R6 contract version change, such as X@1 to X@2 | unresolved | changes | changes | explicit compatibility/change path; never ordinary implementation replacement |
| R7 materially different composition purpose/meaning | unresolved | changes | changes | identity split rule remains OPEN |
| R8 authority/runtime bypass | invalid replacement class | n/a | n/a | refuse/stop through Authority/K0 owners |

Core survivor rule:

A Recipe change is not itself evidence of Composition identity change.

A plugin/member change is not itself evidence of Composition identity change.

A semantic-purpose change is the unresolved discriminator.

## 5. Peer-impact consequences

### Data
Composition history should use Data-owned canonical identities, revision references and lineage where durable relationships are required. No composition-owned canonical data store is justified.

### Work
Work remains the durable execution subject. Composition replacement provides dependent-impact information. It does not silently mutate Work state.

### Capability / Realization
A compatible realization replacement can preserve semantic Capability identity. CFA-07 tracks the composition-side member change; CFA-06 owns realization validity and evidence.

### Evolution
Composition replacement is a subject/change input to the generic Change lifecycle. CFA-09 owns compatibility, impact, migration, promotion, rollback and quarantine semantics.

### Runtime
Changed installed representations remain subject to ordinary Recipe/manifest/content admission. Logical continuity cannot bypass runtime verification. CFA-10's B1 proof gaps remain outside CFA-07.

### Authority
Composition identity continuity never grants permission continuity. Consequential changes re-enter the Authority path.

## 6. Falsifier disposition

| Falsifier | Expected result | Current status |
|---|---|---|
| Rename-only | logical identity should remain stable while the display/scan reference may change | NOT RUN |
| Implementation replacement | logical identity survives; installed representation changes; member lineage is visible | READY AS SMALL FIXTURE |
| Compatible realization replacement | logical identity and Capability meaning survive; realization lineage changes | PEER EVIDENCE SUPPORTS HYPOTHESIS |
| Contract version change | never silently treated as implementation replacement | READY CONCEPTUALLY |
| Active Work replacement | composition reports impact; Work owner decides recovery/reconcile posture | BLOCKED ON ACTIVE-WORK PROOF |
| Admission bypass | runtime refuses and continuity cannot substitute for admission | K0-OWNED PROOF |

## 7. Decision status

RETAINED:
- current name remains a display/representation label unless stronger evidence gives it a narrower role;
- Recipe/signature/hash material identifies an exact admitted representation;
- plugin/member identity remains distinct from composition identity;
- Capability identity remains CFA-06-owned;
- Work identity remains CFA-05-owned;
- Change identity remains CFA-09-owned;
- durable data identity/lineage remains CFA-02-owned;
- runtime admission remains CFA-10-owned;
- authority continuity is separate from composition continuity.

PROVISIONALLY ADOPTED:
- logical lineage → semantic revision → installed Recipe representation.

STILL OPEN:
1. exact logical identity representation;
2. semantic revision discriminator;
3. rename semantics;
4. membership-change semantics;
5. contract-version-change semantics;
6. durable persistence/reference join;
7. active-Work replacement proof;
8. exact K1 to K0 composition admission handoff;
9. automatic versus approval-gated promotion policy.

## 8. No-schema-change rule

This reconciliation adds no compositionId field, no Composition identity table, no new graph, no new K0 primitive, no new authority registry and no new Change store.

The next implementation unit, if authorized, should be a pure fixture/proof layer around existing composition/Recipe generation and replay.

## 9. Cross-CFA M1 assessment

CFA-07 local M1 identity evidence: PARTIALLY CLOSED.

Closed enough to proceed:
- ownership boundaries;
- exact-installed versus logical-composition distinction;
- peer-owned identity/reference boundaries;
- provisional survivor rules for implementation and realization replacement;
- runtime re-admission invariant;
- Change/Work/Data handoff semantics.

Not closed:
- logical identity representation;
- semantic revision discriminator;
- rename/membership/version-change classification;
- active-Work replacement proof;
- live runtime replacement proof;
- exact durable join.

This is sufficient for the Architecture Steward's M1 evidence-closure view, but not for a production schema or wire amendment.

## 10. Evidence index

- omega-baseline/omega-final/contracts/src/recipe.ts
- omega-baseline/omega-final/sdk/src/schema.ts
- omega-baseline/omega-final/plugins/vivim-law/src/compose-scan.ts
- omega-baseline/omega-final/docs/architecture/OMEGA_REPLACEMENT_MODEL.md
- docs/destination/core-vs-plugin-boundary/DESTINATION-RESPONSIBILITY-MATRIX.md
- CFA-02 DATA-CONTINUITY-CORRIDOR-1 evidence
- CFA-05 M1-WORK-ENVELOPE-CHARACTERIZATION
- CFA-06 OWNER-ALIGNMENT
- CFA-09 M1-PEER-RECONCILIATION
- CFA-10 M1-K0-EVIDENCE-FALSIFIER-MATRIX
- CFA-07 COMPOSITION-IDENTITY-SURVIVOR-PROOF

## 11. Final position

The repository now supports a more precise statement than Composition identity is unknown:

Exact installed composition identity is already represented through the governed Recipe/admission layer, while stable logical identity of the composition lineage across semantically valid replacement remains an unclosed CFA-07 semantic problem.

This distinction should remain explicit so that current name/compositionRef convenience does not accidentally become canonical semantic truth.