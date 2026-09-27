# CFA-10 — Wave 3 Peer Reconciliation Addendum

> Date: 2026-09-27
> Session: CFA10-W3-20260927
> CFA: CFA-10 — Runtime Constitution / Core Substrate
> agent_id: `runtime-constitution-core-substrate`
> Identity: **Runtime Constitution & Core Substrate Steward**
> Status: **WAVE-3 COMPLETE — RECONCILIATION RECORDED / SHARED BOUNDARIES UNACTIVATED**
> Classification: bounded peer-reconciliation evidence; not Ω law; not a production contract.
> Baseline current-main SHA verified immediately before authoring: `a638ba5596e6ca991b2f8b56040ef783069887e9`

## 1. Scope and method

This turn executes only the CFA-10 row of the Architecture Steward Wave-3 queue.

Required seams:

- Q10-04 — CFA-04: mechanical Authority-gate result.
- Q10-05 — CFA-05: invocation/lifecycle attribution.
- Q10-06 — CFA-06: structural capability/token enforcement facts.
- Q10-07 — CFA-07: admissible Composition / Recipe integrity envelope.
- Q10-09 — CFA-09: activation/replacement/fencing facts.
- Q10-08 — CFA-08: generic runtime status for truthful projection.
- Q10-02 — CFA-02: atomicity/integrity without prematurely ratifying the Data/runtime join.

The deterministic router was recomputed from current `main`. CFA-05, CFA-06, CFA-07, CFA-08 and CFA-09 Wave-3 addenda are present; CFA-10's addendum was absent before authoring this document.

A seam is **RECONCILED** only where CFA-10 and the relevant peer explicitly answer the same bounded question. Compatible ownership language without an explicit peer answer remains **UNKNOWN**.

No production implementation, shared-boundary activation, Ω-law amendment or Graph attachment is performed.

## 2. Baseline inheritance

CFA-10 retains the previously aligned minimum K0 duty set:

- admission/integrity;
- compartment/Port containment;
- structural capability egress/fencing;
- generic mechanical Authority-gate enforcement;
- atomic activation and fail-closed recovery;
- only proven necessary crypto/canonical/platform primitives.

Semantic authority remains with CFA-04. Work meaning remains with CFA-05. Capability/provider/realization meaning remains with CFA-06. Composition semantics remain with CFA-07. Evolution semantics remain with CFA-09. Experience/projection semantics remain with CFA-08. CFA-02 remains explicitly provisional.

The anti-collapse invariants remain in force:

`EVIDENCE != REPRESENTATION != DESCRIPTION != AUTHORITY`

`confidence != proof`

`candidate != realization`

`selector != canonical truth`

`LLM output != authority`

`unknown != failure`

`semantic meaning != runtime enforcement`

## 3. Q10-04 — CFA-04: mechanical Authority-gate result

### CFA-10 position

CFA-10 mechanically enforces a configured Authority gate where a consequential effect requires one. K0 must not decide permission policy or interpret the semantic reason for the decision.

Minimum mechanical crossing proposed:

`currentGateResult + invocationRef + authorityResultRef + checkedAt + refusal/fence facts where applicable`

The live Authority decision itself remains owned by CFA-04. A historical authorization citation is not sufficient when the contract requires live re-resolution.

### Peer evidence

CFA-04 explicitly states that live authorization is the current result at the execution gate; historical authorization is not current permission. Its existing invocation mechanism already binds caller/behalf/op/scope/authority/intent context and performs live re-resolution at invocation checks. The peer record also preserves distinct states including `AUTHORIZED / REFUSED / UNRESOLVED / EXPIRED / REVOKED / OUT_OF_SCOPE`.

CFA-04 further distinguishes the authority result from World truth and states that runtime owns only mechanical enforcement.

### Classification

**RECONCILED** at bounded mechanical-gate level.

### Handoff

CFA-04 → CFA-10:

`current live authority result + invocation/frame binding + applicable expiry/revocation/scope constraints + refusal reason`

CFA-10 → CFA-04:

`mechanical gate enforcement result + fence/refusal fact + runtime evidence reference`

K0 consumes the configured result; it does not derive permission semantics.

### Residual UNKNOWN

- exact serialized gate-result envelope;
- multi-step/batched authorization mechanics;
- exact Authority Trace ↔ runtime evidence join.

### Falsifier

A consequential action reaches governed execution without the required current Authority result, or K0 independently interprets policy semantics to manufacture permission.

---

## 4. Q10-05 — CFA-05: invocation / lifecycle attribution

### CFA-10 position

Runtime should return only generic execution facts needed by Work to interpret its own lifecycle:

`invocationRef + attempt/workerGenerationRef + lifecycleEvent + fencingState + observedAt`

Candidate lifecycle events:

`STARTED / READY / STOPPED / TERMINATED / CRASHED / FENCED / RECOVERED`

Work remains the owner of Work/Attempt/Outcome semantics and external-effect reconciliation.

### Peer evidence

CFA-05 explicitly accepts the ownership split but records the exact runtime→Work event envelope, generation/attempt pinning and replacement-fencing guarantee as **UNKNOWN**. Its proposed return shape matches the generic categories above but is expressly a proposal rather than an accepted shared contract.

### Classification

**UNKNOWN**

Both sides align semantically, but the peer has not explicitly accepted a final minimum runtime attribution contract.

### Handoff proposal

Runtime → Work:

`invocationRef + lifecycleEvent + fencingState + workerGenerationRef + observedAt`

Work → Runtime:

`governedInvocationRef + workId + attemptId + executionGenerationRef`

Runtime facts remain evidence about runtime execution; Work derives the semantic Attempt/Outcome consequence.

### Falsifier

A stale/replaced worker can continue exercising a governed effect after fencing, or Work recovery requires promoting runtime state into canonical Work meaning.

### Residual UNKNOWN

- event cardinality and ordering;
- generation/attempt identity rules;
- active Work replacement proof;
- minimum persisted runtime fact set.

---

## 5. Q10-06 — CFA-06: structural capability / token enforcement facts

### CFA-10 position

CFA-10 owns structural egress enforcement only. It requires enough mechanical capability/token information to determine whether the guest's requested route is structurally granted, scoped to the admitted guest, valid for the relevant invocation and not fenced/revoked.

Proposed bounded input:

`capabilityGrant/tokenRef + owner/scope binding + structural permission edge + integrity/provenance reference + invocationRef`

Provider, Account, Model, Realization, Session, Resource and routing semantics remain CFA-06-owned.

### Peer evidence

The current CFA-06 Wave-3 addendum explicitly reconciles CFA-06's other bounded seams, but contains **no Q06-10 peer section and no explicit peer answer to the CFA-10 structural-enforcement question**. CFA-06 owner-alignment material does explicitly preserve CFA-10's structural token/egress/fencing responsibility, but that does not close the exact Wave-3 field-level question under the strict acceptance rule.

### Classification

**UNKNOWN**

The ownership boundary is compatible, but the required peer answer for the exact structural fact set is absent.

### Handoff proposal

CFA-06 → CFA-10:

`typed structural capability/token facts + guest/owner binding + scope constraints + integrity/provenance refs`

CFA-10 → CFA-06:

`allow/refuse/fence result + revocation/fencing fact + runtime evidenceRef`

CFA-10 must not interpret provider routing or semantic Capability meaning.

### Falsifier

A guest can exercise a capability route with a fabricated, foreign, out-of-scope or revoked structural grant, or runtime begins deciding provider/routing semantics.

### Residual UNKNOWN

- exact grant/token envelope;
- token provenance and lifetime binding;
- revocation propagation;
- distinction between semantic grant and mechanical enforcement token.

---

## 6. Q10-07 — CFA-07: admissible Composition / Recipe integrity envelope

### CFA-10 position

Only a mechanically admitted and integrity-verifiable composition may enter governed execution.

The runtime-side admission membrane may consume:

`governed Recipe/admitted composition reference + manifest/member identity refs + integrity/content hashes + trust/signature evidence + replacement/activation lineage where required`

Forge artifacts remain proposal-only.

### Peer evidence

CFA-07 explicitly accepts this boundary and classifies Q07-10 **RECONCILED** at the semantic boundary level. Its response explicitly accepts a bounded package containing the governed Recipe/admitted representation, member/manifest identity, integrity/content references, signature/trust-root evidence and candidate-versus-admitted provenance.

It also explicitly preserves that Forge output cannot grant its own authority, cannot bypass ordinary admission and cannot substitute for runtime integrity verification.

### Classification

**RECONCILED** at semantic admission-boundary level.

### Handoff

Composition → K0:

`candidate/admitted composition identity + governed Recipe representation + integrity/signature/trust evidence + activation lineage`

K0 → Composition:

`admissionResult + integrityResult + activationState + runtime evidence refs`

Admission result does not redefine Composition semantics.

### Residual UNKNOWN

- exact field/cardinality envelope;
- exact verified-bytes ↔ executable-entry binding;
- source-root / manifest-root / symlink containment;
- first-party/extension-plugin empirical symmetry;
- final replacement-lineage representation.

### Falsifier

Forge output becomes active without ordinary admission; unverifiable content executes; or verified manifest/content leads to execution of different/unbound bytes.

---

## 7. Q10-09 — CFA-09: activation / replacement / fencing facts

### CFA-10 position

CFA-10 mechanically applies admission, activation, fencing, atomic replacement and fail-closed recovery. CFA-09 owns Change, compatibility, impact, promotion/rollback/quarantine and retirement semantics.

A bounded runtime transition may carry:

`changeRef + proposedImplementationRef + requiredActivationCondition + compatibility/verification evidence refs`

Runtime returns:

`admissionResult + integrityResult + activeGenerationRef + fencingTransition + activationResult + recoveryEvidenceRef`

### Peer evidence

CFA-09 explicitly states that Evolution must not become a runtime controller and that the runtime-side facts include proposed/admitted implementation, integrity/admission evidence, activation state, fencing state and recovery evidence. However, CFA-09 classifies Q09-10 **UNKNOWN** because the exact transition envelope, generation/replacement binding and active-Work fencing proof are not jointly closed.

### Classification

**UNKNOWN**

Ownership is aligned and the evidence categories are named, but the peer has not accepted the exact transition/fencing contract and live replacement proof remains unresolved.

### Handoff proposal

CFA-09 → CFA-10:

`changeRef + proposedImplementationRef + requiredActivationCondition + compatibility/verification evidence refs`

CFA-10 → CFA-09:

`admissionResult + integrityResult + activeGenerationRef + fencingTransition + activationResult + recoveryEvidenceRef`

Evolution interprets Change and compatibility; runtime enforces the admitted transition.

### Falsifier

An implementation becomes active solely because Evolution marked it compatible, or a fenced/retired generation remains callable through the governed runtime path.

### Residual UNKNOWN

- exact transition envelope;
- generation/replacement binding;
- active Work replacement/fencing proof;
- atomic replacement semantics under crash/restart.

---

## 8. Q10-08 — CFA-08: generic runtime status for truthful projection

### CFA-10 position

CFA-10 may expose generic runtime facts required for truthful projection. Runtime status is evidence/fact, not semantic meaning.

Bounded status vocabulary proposed by current peer evidence:

`BOOTING | READY | ACTIVE | DEGRADED | STOPPED | REFUSED | RECOVERING`

The exact final vocabulary may be corridor-specific, but it must not become canonical Work Outcome, Intent result, provider truth, authority, Composition meaning or Surface canonical state.

### Peer evidence

CFA-08 explicitly accepts the minimum generic runtime status corridor and classifies Q08-10 **RECONCILED** at the bounded generic-status level. It explicitly lists generic statuses and preserves the anti-collapse rule that runtime status is a factual presentation input.

### Classification

**RECONCILED** at bounded generic-status level.

### Handoff

CFA-10 → CFA-08:

`runtimeStatus + runtimeEvidenceRef + observedAt`

CFA-08 → owning semantic corridors:

user interaction / mutation returns through the appropriate semantic or runtime owner; presentation does not authorize or complete the action merely because a status is displayed.

### Residual UNKNOWN

- exact stale/refused/degraded payload;
- event/reference envelope;
- lifecycle-to-projection timing semantics.

### Falsifier

Runtime `ACTIVE` is treated as Work completion, `READY` as provider permission/availability proof, or runtime state becomes canonical surface/domain truth.

---

## 9. Q10-02 — CFA-02: atomicity / integrity without ratifying the Data/runtime join

### CFA-10 position

CFA-10 should rely on only those atomicity/integrity guarantees that are proven necessary for a universal runtime invariant and that can be expressed without creating a second canonical Data authority.

Candidate runtime-level principle:

`required activation/fencing transition is all-or-nothing at the enforcement boundary`

with integrity evidence attached to the admitted implementation/activation object rather than copied into a competing runtime data authority.

### Peer evidence

CFA-02 is explicitly **PROVISIONAL**. Its current owner-alignment and Round-2 material state that CFA-02 owns durable identity, persistence, revision, lineage and reconstruction; exact physical storage/join remains unresolved; persistence does not make a representation canonical; and no universal Event/State primitive is justified.

The peer materials do not explicitly accept a final runtime-facing atomicity/integrity guarantee or a physical runtime↔canonical durability join.

### Classification

**UNKNOWN**

The ownership boundary is clear and CFA-02 remains provisional, but no peer-approved runtime atomicity/integrity contract is closed.

### Handoff proposal

CFA-02 → CFA-10:

Only ratified/proven generic durability or integrity guarantees that are necessary to enforce a K0 invariant.

CFA-10 → CFA-02:

Only factual runtime enforcement/evidence references required for durable reconstruction; never a second canonical record identity or persistence authority.

### Falsifier

K0 requires a private competing canonical data store, or an activation/fencing invariant can only be enforced by assuming an unratified Data/runtime physical join.

### Residual UNKNOWN / DEFERRED

- exact atomicity boundary;
- durability requirements for runtime enforcement facts;
- physical runtime↔canonical-data join;
- whether any stronger transaction primitive is actually universal enough for K0.

---

## 10. Cross-seam reconciliation summary

| Seam | Classification | Established | Blocking residue |
|---|---|---|---|
| Q10-04 CFA-04 | **RECONCILED** | live Authority remains CFA-04-owned; K0 mechanically enforces configured gate | exact serialized gate-result / trace join |
| Q10-05 CFA-05 | **UNKNOWN** | runtime lifecycle facts remain distinct from Work semantics | exact event envelope, generation pinning, replacement proof |
| Q10-06 CFA-06 | **UNKNOWN** | K0 structural egress/fencing remains distinct from Capability/provider meaning | no explicit Wave-3 peer answer; exact token/grant envelope |
| Q10-07 CFA-07 | **RECONCILED** | admission/integrity membrane remains K0-owned mechanically; Forge cannot self-admit | exact field shape and B1 byte/entry containment proof |
| Q10-09 CFA-09 | **UNKNOWN** | Change semantics remain Evolution-owned; runtime enforces transition/fencing | transition envelope, generation binding, active-Work proof |
| Q10-08 CFA-08 | **RECONCILED** | generic runtime status is factual presentation input only | exact projection payload/timing |
| Q10-02 CFA-02 | **UNKNOWN** | Data remains durable identity/persistence owner and explicitly provisional | no peer-approved runtime atomicity contract; physical join unresolved |

**CONFLICTED: NONE IDENTIFIED.**

Three seams reach **RECONCILED** at a bounded semantic/mechanical level. Four remain **UNKNOWN** because exact peer answers and/or live evidence are not yet sufficient.

---

## 11. B1 preservation

B1 remains **UNDERPROVEN** and is not promoted by this reconciliation.

Existing primitive evidence demonstrates residual concerns around:

- relative traversal from the source root;
- source-root symlink following in the reproduced hashing path;
- verify→execute byte substitution / TOCTOU;
- unverified native Windows drive-letter / UNC behavior in the supported target runtime.

The current Ω host still requires further target-runtime evidence before a production containment mechanism is chosen.

Required closure remains:

1. valid in-tree executable entry succeeds;
2. traversal, absolute, UNC, out-of-tree, source-root symlink and invalid/non-file entry forms are refused;
3. the executed bytes are exactly the bytes covered by the admitted integrity boundary;
4. B4 recovery/fencing behavior remains intact;
5. no mechanism choice is promoted to K0 solely from primitive-level evidence.

No B1 production change is made in this turn.

---

## 12. Preserved invariants

- **Runtime enforcement ≠ semantic policy**
- **Evidence ≠ Authority**
- **Capability ≠ Permission**
- **Candidate ≠ Admitted ≠ Active**
- **Compatibility ≠ Authorization**
- **Runtime status ≠ Work Outcome**
- **Historical authorization citation ≠ current permission**
- **Worker isolation ≠ OS sandbox**
- **Unknown ≠ Failure**
- **CFA-02 provisional evidence ≠ ratified Data authority**
- **B1 evidence gap ≠ permission to choose a production mechanism**
- **No peer handoff transfers semantic ownership**

---

## 13. Deferred items

- exact Q10-05 runtime↔Work event/reference contract;
- exact Q10-06 capability/token structural envelope;
- exact Q10-09 activation/replacement/generation contract;
- exact Q10-02 runtime↔canonical-data durability/atomicity join;
- B1 target-runtime closure;
- active Work replacement/fencing proof;
- hostile-plugin resource containment/security-tier claims;
- zero-plugin diagnostic boot target versus current product-specific boot rule;
- shared-boundary activation;
- Ω-law changes;
- Graph attachment;
- production K0 expansion.

---

## 14. Final Wave-3 result

**SESSION_STATUS: COMPLETE**

**CFA-10 Wave-3 seam classifications:**

- Q10-04 — **RECONCILED**
- Q10-05 — **UNKNOWN**
- Q10-06 — **UNKNOWN**
- Q10-07 — **RECONCILED**
- Q10-09 — **UNKNOWN**
- Q10-08 — **RECONCILED**
- Q10-02 — **UNKNOWN**

**CONFLICTED:** NONE

The bounded result is:

`CFA-10 = non-bypassable mechanical runtime enforcement`

while:

`Authority semantics = CFA-04`
`Work semantics = CFA-05`
`Capability/provider/realization semantics = CFA-06`
`Composition semantics = CFA-07`
`Experience semantics = CFA-08`
`Change/evolution semantics = CFA-09`
`durable data/identity/persistence = CFA-02 (provisional)`

Wave-3 closes the ordered CFA-10 reconciliation pass without asserting more than the evidence supports.

**WAVE-3 STOP CONDITION SATISFIED.**

No production implementation.
No shared-boundary activation.
No Ω-law change.
No Graph work.
