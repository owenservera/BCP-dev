# CFA-05 — Wave 3 Peer Reconciliation Addendum

> Date: 2026-09-27
> Session: CFA05-W3-20260927
> CFA: CFA-05 — Agency / Work / Execution
> agent_id: `agency-work-execution`
> Identity: **Work & Execution Steward**
> Status: **WAVE-3 COMPLETE — RECONCILIATION RECORDED / SHARED BOUNDARIES UNACTIVATED**
> Classification: bounded peer-reconciliation evidence; not Ω law; not a production contract.
> Baseline current-main SHA verified immediately before authoring: `949038d10f0dab1cca7d209277c57f383a699940`

## 1. Scope and method

This turn executes only the CFA-05 row of the Architecture Steward Wave-3 queue.

Required seams:

- Q05-03 — CFA-03 semantic Plan → executable Work basis.
- Q05-04 — CFA-04 authority citation and retry/resume re-resolution.
- Q05-02 — CFA-02 durable Work/Attempt/Outcome linkage.
- Q05-06 — CFA-06 realization/effect evidence.
- Q05-10 — CFA-10 runtime lifecycle/fencing facts.

The classification rule is strict:

`RECONCILED` requires the current CFA-05 position and the relevant peer to have both explicitly answered the same bounded question.

Where current evidence supplies compatible ownership but not the exact peer answer required by the queue, this addendum records `UNKNOWN` or `DEFERRED` rather than manufacturing agreement.

No shared boundary is activated by this document.

## 2. Baseline inheritance

The Wave-2 Steward reconciliation is **COMPLETE — WAVE 3 READY**.

The current six-CFA responsibility map remains:

- CFA-03 — semantic Intent/Plan meaning and continuity.
- CFA-04 — live authority, consent, standing, delegation, expiry/revocation.
- CFA-02 — durable record identity, persistence, revision, lineage and reconstruction; explicitly provisional.
- CFA-05 — Work/Attempt/execution continuity, recovery/reconciliation and Outcome semantics.
- CFA-06 — Capability/Provider/Account/Model/Realization/Session/Resource and realization-specific evidence.
- CFA-10 — domain-neutral runtime admission, isolation, invocation, lifecycle containment, fencing and fail-closed recovery.

Wave-2 found no material ownership conflict, but explicitly left the execution-specific seam contracts for this ordered peer pass.

## 3. Q05-03 — CFA-03: Plan → executable Work basis

### CFA-05 current claim

**PROPOSED / CURRENT from the Wave-1 baseline:** the executable Work basis must be attributable to a semantic Plan/version, immutable/versioned for execution, and must not silently rewrite canonical semantic meaning.

Candidate flow:

`semantic Plan meaning (CFA-03)
→ semantic Plan/version reference
→ immutable executable Plan basis (CFA-05)
→ Work Steps / Attempts`

CFA-05 also requires explicit handling when semantic input is ambiguous, stale or conflicted, and a return path for execution findings that materially affect later semantic interpretation.

### Peer evidence actually available

**CURRENT / PEER CLAIM:** CFA-03 `CORE-AGENT-IDENTITY.md` explicitly owns canonical Intent/Plan meaning and excludes Work/execution implementation.

**CURRENT / PEER CLAIM:** CFA-03 `BOUNDARY-ROUND-2-ADDENDUM-2026-09-27.md` defines the semantic-to-execution continuity seam and says CFA-03 does not replace Work ownership.

**CURRENT / PEER CLAIM:** CFA-03's addendum states that the minimum semantic package can carry intent/plan references, intended effect, target references, capability/operation reference, semantic context and provenance, while preserving the distinction between semantic meaning and execution.

**CURRENT / PEER STATUS:** the available CFA-03 material does not explicitly accept the exact CFA-05 executable snapshot/reference contract, immutable-basis representation choice, required cardinality, or execution-evidence return semantics as a shared bounded contract.

### Classification

**UNKNOWN**

Ownership is clear, but the exact Q05-03 peer answer required for reconciliation is not explicit enough to classify the seam as RECONCILED.

### Exact handoff proposal

CFA-03 → CFA-05:

`semanticPlanRef + semanticPlanVersion + semantic provenance + semantic resolution state + intended-effect/target references`

CFA-05 → execution:

`immutableExecutablePlanRefOrSnapshot + attributableSemanticBasis + executableVersion`

Execution → semantic continuity, only when material:

`executionFindingRef + affectedSemanticRef + reasonForReinterpretationOrProjection`

This is a proposed seam shape, not an implementation mandate.

### Falsifier

The seam fails if execution must silently reinterpret canonical Plan meaning, or if materially different execution meaning can be produced from the same semantic basis without a new attributable executable basis/version.

### Residual state

- Exact executable snapshot/reference representation: **UNKNOWN**
- Cardinality/version semantics: **UNKNOWN**
- Ambiguous/stale/conflicted semantic input handling at the handoff: **UNKNOWN**
- Execution → semantic return path: **UNKNOWN**
- Shared boundary activation: **DEFERRED**

---

## 4. Q05-04 — CFA-04: authority citation and retry/resume re-resolution

### CFA-05 current claim

A Work/Attempt may preserve historical authorization citation for reconstruction, but retry/resume at a consequential gate must use a current authorization result. Scheduling, wakeup, retry eligibility or historical approval cannot itself authorize an effect.

CFA-05 needs the authority/effect context required to bind the live decision to the Work/Attempt.

### Peer evidence actually available

**CURRENT / PEER CLAIM:** CFA-04 `OWNER-ALIGNMENT-2026-09-27.md` owns live authority semantics including authority basis, scope, duration, consent, standing, delegation/attenuation, expiry, revocation and invocation binding.

**CURRENT / PEER CLAIM:** CFA-04 boundary material preserves `durable authority reference != live authority decision`.

**CURRENT / PEER CLAIM:** the CFA-04 Round-2 addendum states that authority returns a distinct live result and preserves expiry/revocation as authority state rather than semantic meaning.

**CURRENT / PEER CLAIM:** CFA-04's domain roadmap explicitly requires resumed Work attempts never to assume prior authorization remains live when re-check is required.

**LIMITATION:** none of the currently available peer artifacts explicitly closes the CFA-05-specific minimum durable citation payload or the exact retry/resume/multi-step behavior requested by Q05-04.

### Classification

**UNKNOWN**

The semantic ownership and live-vs-historical rule are independently explicit, but the exact CFA-05 peer contract is not fully answered.

### Exact handoff proposal

Work → Authority at every consequential gate:

`actor/behalf + intent/planRef + intendedEffect + targetRef(s) + capability/operation + relevant scope/context + invocation/Attempt frame`

Authority → Work:

`authorizationState + authorityRef + scope/time constraints + expiry/revocation/invalidation + refusal reason + checkedAt + invocation binding`

Work durable history:

`historicalAuthorityCitationRef`

The historical reference must never serve as a cached authorization verdict.

### Falsifier

A retry/resume succeeds solely because a prior approval was stored even though the current authority state is expired, revoked, narrowed or refused.

### Residual state

- Minimum durable AuthorityCitation fields: **UNKNOWN**
- Step/Attempt versus grouped citation cardinality: **UNKNOWN**
- Multi-step/batched authorization: **UNKNOWN**
- Exact expiry/revocation → Work state mapping: **UNKNOWN**
- Shared boundary activation: **DEFERRED**

---

## 5. Q05-02 — CFA-02: durable Work/Attempt/Outcome linkage

### CFA-05 current claim

CFA-05 owns Work/Attempt/Outcome semantics. CFA-02 owns durable identity, persistence, revision, lineage and reconstruction mechanics.

The Work execution plane must not create a competing store or duplicate canonical Work identity.

### Peer evidence actually available

**CURRENT / PEER CLAIM:** CFA-02 `OWNER-ALIGNMENT-2026-09-27.md` explicitly confirms that CFA-05 owns Work, Attempt and Outcome semantics while CFA-02 owns durable linkage, persistence, revision and reconstruction.

**CURRENT / PEER CLAIM:** the same record explicitly places durable Work/Attempt/Outcome linkage at the CFA-05/CFA-02 boundary.

**CURRENT / PEER CLAIM:** CFA-02 preserves canonical-vs-derived distinctions and says persistence alone does not make a representation canonical.

**LIMITATION:** the peer record does not supply the exact minimum Work/Attempt/Outcome envelope, field cardinality, revision algebra or physical join required by Q05-02.

### Classification

**UNKNOWN**

The ownership split is directly answered, but the minimum continuity contract requested by the Wave-3 question remains open.

### Exact handoff proposal

CFA-05 semantic requirements → CFA-02 durable plane:

`workId + attemptId + outcomeRef + lifecycle relation + semantic ancestry + executableBasisRef + effectRef + attributionRefs`

CFA-02 → CFA-05 durable guarantees:

`stable durable identity + revision/lineage + reconstruction/read-back + durable relation to evidence/target/effect where applicable`

Physical schema/storage remains CFA-02-owned.

### Falsifier

Restart or replacement cannot reconstruct the Work lifecycle without process-local memory, or durable persistence requires a second competing Work identity.

### Residual state

- Minimum Work/Attempt/Outcome envelope: **UNKNOWN**
- Mandatory/optional field set: **UNKNOWN**
- Revision and lineage algebra: **UNKNOWN**
- Physical join/storage shape: **UNKNOWN**
- Shared boundary activation: **DEFERRED**

---

## 6. Q05-06 — CFA-06: realization/effect evidence

### CFA-05 current claim

After an ambiguous invocation, CFA-05 needs realization-specific facts sufficient to decide whether Work must wait, reconcile, safely retry, refuse or complete. CFA-06 owns provider/realization/session meaning and the realization-specific evidence.

Unknown external effect must remain explicit.

### Peer evidence actually available

**CURRENT / PEER CLAIM:** CFA-06 `OWNER-ALIGNMENT-2026-09-27.md` states that CFA-05 owns Work, Attempts, recovery, Work-level reconciliation and Outcome while CFA-06 supplies realization/account/session context and provider-specific external-effect knowledge.

**CURRENT / PEER CLAIM:** CFA-06 retains Provider/Account/Realization/Session semantics and treats routing as separate from authorization.

**CURRENT / PEER CLAIM:** CFA-06's alignment explicitly preserves realization replacement without changing semantic Capability identity.

**LIMITATION:** the available peer evidence does not explicitly specify the minimum external-effect evidence package, the exact UNKNOWN representation, or the effect-identity contract by realization class.

### Classification

**UNKNOWN**

The responsibility split is explicit, but the minimum evidence and effect identity demanded by Q05-06 remain unanswered at the required precision.

### Exact handoff proposal

CFA-05 → CFA-06:

`workId + attemptId + effectIdentity + targetRef + realizationRef/sessionRef + invocation context`

CFA-06 → CFA-05:

`effectStatus ∈ {APPLIED, NOT_APPLIED, PENDING, UNKNOWN}`
plus
`evidenceRefs + observedAt + realization/provider context + reconciliation basis`

Interpretation of the evidence remains provider/realization-owned; Work owns the lifecycle consequence.

### Falsifier

After crash or uncertain invocation, Work must blindly classify external success/failure because no realization-specific reconciliation/evidence path exists.

### Residual state

- Exact effect identity across realization classes: **UNKNOWN**
- Minimum evidence package: **UNKNOWN**
- Provider query/reconciliation capability: **UNKNOWN**
- Exact external UNKNOWN envelope: **UNKNOWN**
- Shared boundary activation: **DEFERRED**

---

## 7. Q05-10 — CFA-10: runtime lifecycle/fencing facts

### CFA-05 current claim

CFA-10 provides generic invocation, lifecycle containment, termination/crash fencing and fail-closed runtime recovery. CFA-05 interprets relevant runtime facts as Work/Attempt consequences and owns Work-level recovery/reconciliation.

Runtime state must not become canonical Work state.

### Peer evidence actually available

**CURRENT / PEER CLAIM:** CFA-10 `OWNER-ALIGNMENT-2026-09-27.md` explicitly assigns safe invocation, compartment lifecycle, termination/crash fencing and runtime recovery primitives to CFA-10 while keeping Work/Attempt/Outcome semantics with CFA-05.

**CURRENT / PEER CLAIM:** CFA-10 identifies active Work replacement proof as unresolved and B1 executable-entry confinement as an unclosed test.

**CURRENT / PEER CLAIM:** CFA-10 defines the runtime boundary as mechanical and domain-neutral, with Work meaning outside K0.

**LIMITATION:** CFA-10 does not yet provide the exact minimum runtime→Work event envelope, generation/attempt pin, or replacement-fencing contract required by Q05-10.

### Classification

**UNKNOWN**

The ownership seam is explicitly compatible, but the exact recoverable runtime fact set remains open.

### Exact handoff proposal

Runtime → Work:

`invocationRef + attempt/workerGenerationRef + lifecycleEvent + fencingState + observedAt`

Minimum relevant lifecycle events:

`STARTED / READY / STOPPED / TERMINATED / CRASHED / FENCED / RECOVERED`

Work → Runtime:

`governedInvocationRef + workId + attemptId + executionGenerationRef`

Runtime facts describe containment/execution status; Work derives its semantic Attempt/Work consequence.

### Falsifier

A terminated/replaced worker can continue exercising a governed effect after fencing, or Work recovery requires embedding K0-specific runtime state into canonical Work.

### Residual state

- Exact runtime→Work event envelope: **UNKNOWN**
- Generation/attempt pinning: **UNKNOWN**
- Replacement-fencing guarantee: **UNKNOWN**
- Minimal persisted runtime facts: **UNKNOWN**
- Shared boundary activation: **DEFERRED**

---

## 8. Cross-seam reconciliation summary

| Seam | Classification | What is established | Blocking residue |
|---|---|---|---|
| Q05-03 CFA-03 | **UNKNOWN** | Semantic Plan meaning stays CFA-03; Work may own executable basis | exact handoff, immutable representation/version, ambiguity handling, return path |
| Q05-04 CFA-04 | **UNKNOWN** | Live authority stays CFA-04; historical citation is not permission | exact citation, re-check mechanics, multi-step behavior |
| Q05-02 CFA-02 | **UNKNOWN** | Work semantics vs durable continuity ownership is separated | minimum envelope, revision/lineage, physical join |
| Q05-06 CFA-06 | **UNKNOWN** | CFA-06 supplies realization/effect knowledge; CFA-05 owns reconciliation | effect identity, evidence minimum, UNKNOWN envelope |
| Q05-10 CFA-10 | **UNKNOWN** | Runtime enforces lifecycle/fencing; CFA-05 owns Work consequences | runtime event envelope, generation/fencing semantics |

**No CFA-05 seam qualifies as RECONCILED under the strict Wave-3 acceptance rule.**

This is intentional. Compatible owner-alignment language is insufficient to close an exact peer contract.

## 9. Conflict assessment

**CONFLICTED: NONE IDENTIFIED.**

No material ownership contradiction was found across the five seams.

The unresolved state is contractual/evidentiary, not a detected dispute between peers.

## 10. Deferred items

**DEFERRED:**

- shared-boundary activation;
- production implementation;
- Graph attachment;
- Ω-law changes;
- live restart/retry/replacement proof;
- any decision that would require CFA-02 to cease being provisional;
- broader scheduler/temporal substrate design;
- universal Event/State/identity mechanisms.

## 11. Handoff register for later ordered reconciliation

| From | To | Handoff subject | Required next evidence |
|---|---|---|---|
| CFA-03 | CFA-05 | semantic Plan/version → immutable executable Work basis | explicit peer acceptance/refutation of payload and version semantics |
| CFA-04 | CFA-05 | live authorization + historical citation | explicit citation minimum and retry/resume/multi-step rule |
| CFA-02 | CFA-05 | durable Work/Attempt/Outcome continuity | explicit minimum envelope + reconstruction guarantee |
| CFA-06 | CFA-05 | realization-specific effect evidence | explicit effect identity + evidence minimum |
| CFA-10 | CFA-05 | runtime lifecycle/fencing facts | explicit event envelope + generation/replacement safety |

## 12. Falsifier corpus

The current CFA-05 boundary is invalidated or requires challenge if any peer evidence demonstrates:

1. Work must become the semantic owner of Plan meaning to execute.
2. Historical authority citation can legitimately substitute for live authorization at a consequential gate.
3. Work cannot be reconstructed without a competing persistence/identity system.
4. Provider/realization replacement necessarily changes Work identity without a semantic reason.
5. Runtime lifecycle state must become canonical Work meaning rather than a peer-owned runtime fact.
6. Executor success can establish external truth without realization-specific evidence where the external system can differ.
7. No safe representation exists for an external effect whose status is genuinely unknown.
8. A peer can no longer preserve its stated ownership boundary without transferring unrelated semantic responsibility into CFA-05.

## 13. Final Wave-3 result

**SESSION_STATUS: COMPLETE**

**CFA-05 Wave-3 result:** bounded peer reconciliation executed.

**Seam classifications:**
- Q05-03: **UNKNOWN**
- Q05-04: **UNKNOWN**
- Q05-02: **UNKNOWN**
- Q05-06: **UNKNOWN**
- Q05-10: **UNKNOWN**

**CONFLICTED:** NONE

**DEFERRED:** shared activation, implementation, graph, Ω-law change and all unproven live corridors.

The strongest current conclusion is:

`Work = durable execution subject`

while:

`semantic meaning = CFA-03`
`durable continuity = CFA-02`
`live authority = CFA-04`
`realization-specific evidence = CFA-06`
`runtime enforcement/fencing = CFA-10`

The next useful step is not to fill these gaps by invention. The remaining exact contracts must be supplied through the ordered peer answers required by the Wave-3 queue and then reconciled by the Steward.

**WAVE-3 STOP CONDITION SATISFIED.**

No production implementation.
No shared-boundary activation.
No Ω-law change.
No Graph work.
