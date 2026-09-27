# CFA-05 — M1 Work Envelope Characterization
> Date: 2026-09-27
> Session: CFA05-M1-20260927
> Status: PEER-READY / NOT FROZEN
> Classification: CFA-05 research artifact; not Ω law; not an implementation contract.

## 1. Task boundary
Characterize the smallest durable Work envelope and candidate lifecycle from existing Ω/destination evidence.

This artifact intentionally does not freeze the final Work state machine, freeze the semantic Plan → executable Plan snapshot seam, assign Data storage schemas, define live authority semantics, define provider/realization semantics, define runtime K0 primitives, or start production implementation.

## 2. Evidence posture
### OBSERVED / CURRENT
1. The destination canonical model defines Work as the canonical durable execution subject with workId, requestedBy, objectiveRef, planRef, state, revision and optional trigger/parent/deadline/budget/attention references.
2. The same model separates Work from Plan, Step, Attempt, Trigger, Automation, AgentDefinition and Evidence, and rejects Run as a separate canonical root.
3. Destination agentic-core research identifies durable Work, versioned Plan, Steps, Attempts, stable effect identities, temporal trigger/wait support, verification/evidence, human gates and recovery as the deterministic execution substrate.
4. The Ω work namespace contains durable Work records, immutable per-Work Plan snapshots and Attempt records, with recovery/reconciliation operations.
5. Ω D-435 provides plan-state/intervention evidence without a separate execution root.
6. Ω D-452 requires an invocation frame and live authority re-resolution at consequential checks; historical authority is not current permission.
7. CFA-03 is the semantic owner of canonical Intent/Plan meaning and explicitly excludes Work/execution implementation.
8. CFA-02 owns durable Work/Attempt/Outcome linkage, persistence, revision, lineage and reconstruction; exact AuthorityCitation storage/join remains unresolved.
9. CFA-04 owns live authority/delegation/standing semantics and preserves historical citation versus current permission.
10. CFA-06 owns selected realization/session context and provider-specific external-effect evidence; CFA-05 owns Work lifecycle/reconciliation/Outcome.
11. CFA-10 owns generic lifecycle containment and fencing/enforcement while CFA-05 retains Work, Attempts, schedules, outcomes and reconciliation.

### DERIVED / CURRENT
- Work is the correct durable execution root; no second Run root is justified by current evidence.
- Work must carry enough references to preserve semantic ancestry and reconstruct execution state, but must not absorb semantic ownership from CFA-03 or durable storage ownership from CFA-02.
- Work lifecycle state is semantic execution state, not a UI-only status label.
- Historical authority citation may be retained for explainability, but Work must obtain fresh authorization at the relevant execution gate.
- Provider/account/model/session/realization references are execution attribution, not Work identity.
- Durable worker/process state is not the recovery source; durable Work state is.
- Unknown external effect is a legitimate recovery condition and must not be flattened into failure or success.

### PROPOSED / CURRENT
The following is the candidate v0.1 contract for peer reconciliation, not a frozen schema.

## 3. Candidate Work envelope v0.1
| Field | Candidate role | Status | Owner / source |
|---|---|---|---|
| workId | stable identity of entrusted Work | PROPOSED from OBSERVED model | CFA-05 semantics; CFA-02 durable identity |
| requestedBy | requester/principal reference | PROPOSED | CFA-05 consumes identity; CFA-02 owns durable identity |
| state | current Work lifecycle state | PROPOSED | CFA-05 |
| revision | Work continuity/revision marker | PROPOSED | CFA-05 meaning; CFA-02 revision mechanics |
| objectiveRef | desired outcome/objective reference when one exists | PROPOSED / OPTIONAL | semantic source remains context-dependent |
| intentRef | canonical Intent reference when Work originates from Intent | PROPOSED / CONDITIONAL | CFA-03 meaning |
| semanticPlanRef | canonical semantic Plan meaning/version reference | PROPOSED / BLOCKING SEAM | CFA-03 owns meaning |
| executablePlanRef | immutable executable Plan basis consumed by Work | PROPOSED / BLOCKING SEAM | CFA-05 Work-facing basis; CFA-02 persists |
| triggerRef | origin/wake trigger reference | PROPOSED / OPTIONAL | CFA-05 continuity |
| parentWorkRef | parent/decomposition reference | PROPOSED / OPTIONAL | CFA-05 |
| deadlineRef | deadline/time constraint reference | PROPOSED / OPTIONAL | CFA-05; temporal boundary open |
| budgetRef | budget/policy reference | PROPOSED / OPTIONAL | CFA-05 consumes; policy owner outside |
| attentionRef | pointer for continuity/attention projection | PROPOSED / OPTIONAL | CFA-05 consumes; semantics outside |
| createdAt / updatedAt | temporal reconstruction anchors | PROPOSED | CFA-05 semantics; CFA-02 durable representation |
| authorityCitationRef | historical authority corridor citation | PROPOSED / NOT CURRENT PERMISSION | CFA-04 meaning; CFA-02 durability; join UNKNOWN |
| capabilityRef | capability/operation reference | PROPOSED / REFERENCE ONLY | CFA-06 meaning |
| realizationRef / sessionRef | actual realization context used by execution | PROPOSED / ATTRIBUTION | CFA-06 |
| activeStepRef / activeAttemptRef | convenience inspect pointers | PROPOSED / DERIVED CANDIDATE | must remain derivable from Work/Attempt history |
| outcomeRef | Work Outcome reference when available | PROPOSED | CFA-05 semantics; CFA-02 durable linkage |
| evidenceRefs | supporting execution evidence references | PROPOSED / CROSS-CUTTING | evidence semantics remain distributed |

### Minimality conclusion
The smallest defensible Work identity/lifecycle kernel is:

workId + requestedBy + state + revision + semantic ancestry + executable Plan basis

Everything else remains conditional, referenced or derived until peer evidence proves it belongs in the minimal durable Work root.

## 4. Candidate lifecycle v0.1
The current destination evidence supports the vocabulary below, but the transition algebra is PROPOSED, not ratified.

DRAFT → READY → RUNNING → WAITING → SUCCEEDED
                     ├────────→ FAILED
                     ├────────→ REFUSED
                     └────────→ CANCELLED

REVIEWED is treated as a candidate post-terminal review/projection state, not a second execution root.

| State | Candidate meaning | Key invariant |
|---|---|---|
| DRAFT | Work exists but is not execution-ready | no consequential execution |
| READY | executable basis exists and Work may seek execution | READY does not imply authorized |
| RUNNING | an execution corridor is active | live authorization still applies at required gates |
| WAITING | Work is paused on an explicit condition | condition is reconstructable |
| SUCCEEDED | terminal successful Work Outcome exists | success is not proof by itself |
| FAILED | terminal failure condition | retry/terminal semantics remain OPEN |
| REFUSED | Work cannot or may not proceed under governing conditions | refusal remains explainable |
| CANCELLED | Work intentionally terminated | history remains reconstructable |
| REVIEWED | post-terminal review/projection | not execution truth/root |

Open transition questions: retryable failure versus terminal failure; reactivation after a new authority decision; typed WAITING reasons; exact REVIEWED semantics; parent/child transition rules; transition monotonicity.

## 5. Plan meaning → executable Work seam
Candidate invariant:

canonical semantic Plan (CFA-03)
→ stable reference to meaning/version
→ immutable executable Plan basis (CFA-05)
→ Work Steps / Attempts

Requirements:
1. Work never silently rewrites canonical Plan meaning.
2. Execution consumes an immutable/versioned executable basis.
3. Every executable basis remains attributable to semantic Plan meaning where applicable.
4. Execution-local details may exist without mutating the originating semantic Plan.
5. A material execution-meaning change requires a new attributable basis/revision.
6. Exact representation remains OPEN: inline immutable snapshot versus separately identified immutable record.

BLOCKING PEER GATE: CFA-03 must reconcile and accept/refute the semantic-to-executable handoff dimensions before G2 is frozen.

## 6. Work ↔ Data seam
CFA-05 owns the meaning and lifecycle of Work/Attempt/Outcome.
CFA-02 owns durable record identity, persistence, revision, lineage, reconstruction and durable linkage across the Work corridor.

Candidate rule:
CFA-05 defines what the Work record means; CFA-02 defines how that durable meaning is identified, persisted, versioned and reconstructed.

No second Work database/store is justified. Exact AuthorityCitation storage/join remains UNKNOWN.

## 7. Work ↔ Authority seam
Work may retain a historical authority citation for explainability and reconstruction, but historical authorization citation is not current permission.

At every consequential gate, Work consumes the current CFA-04 authorization result according to the authority contract.

Open: exact citation shape; one citation per Step/Attempt versus bounded gate group; multi-step/batched authorization; state impact of expiry/revocation.

## 8. Work ↔ Capability / Realization seam
Work records the capability/operation and the realization context that actually participated in an Attempt.
CFA-06 retains Capability, Provider, Account, Model, Realization and Session semantics plus provider-specific external evidence.
CFA-05 retains Work/Step/Attempt lifecycle, execution attribution and Work-level recovery/reconciliation.
Provider/account/session replacement does not create a new Work identity by itself.

## 9. Work ↔ Runtime seam
CFA-10 supplies generic invocation/enforcement, lifecycle containment and termination/crash fencing primitives.
CFA-05 supplies Work lifecycle meaning, Work scheduling/background semantics, Attempt semantics and Work-level recovery/reconciliation.

The M1 contract depends on runtime guarantees but does not embed K0 state into Work. Active Work replacement/fencing remains a later M3 proof.

## 10. Candidate ownership map
| Concern | Owner |
|---|---|
| Work meaning / lifecycle | CFA-05 |
| semantic Intent/Plan meaning | CFA-03 |
| durable Work identity/revision/lineage | CFA-02 |
| live authority meaning/verdict | CFA-04 |
| capability/realization/session meaning | CFA-06 |
| K0 lifecycle/fencing/enforcement | CFA-10 |
| user projection | CFA-08 |
| general change compatibility | CFA-09 |

## 11. M1 falsifiers
- F-M1.1 Duplicate Work root: two subsystems require distinct canonical Work IDs for the same entrusted outcome.
- F-M1.2 Worker-memory recovery: process-local state is necessary to reconstruct Work after restart.
- F-M1.3 Plan meaning leakage: Work execution silently changes CFA-03-owned semantic Plan meaning.
- F-M1.4 Authority cache: Work continues after failed re-check because an old approval is treated as current permission.
- F-M1.5 Provider identity collapse: Provider/Account/Realization/Session replacement changes Work identity without semantic reason.
- F-M1.6 Runtime state leakage: Work requires K0 implementation-specific lifecycle state rather than domain-neutral guarantees.
- F-M1.7 Outcome/Evidence collapse: terminal Work success is treated as proof without distinct evidence/verification.

## 12. M1 resolution
### Sufficiently characterized now
- Work is the canonical durable execution subject.
- Work is distinct from worker/process, scheduler and surface.
- Work needs semantic ancestry plus an executable Plan basis.
- Durable persistence/lineage remains a CFA-02 concern; no second Work store is justified.
- Live authority remains CFA-04-owned and must be re-resolved at appropriate gates.
- Provider/realization/session semantics remain CFA-06-owned.
- K0 lifecycle/fencing remains CFA-10-owned.
- Run is not a competing canonical root.

### UNKNOWN / BLOCKING
- exact semanticPlanRef ↔ executablePlanRef contract;
- exact Work field requiredness/cardinality;
- exact Work transition algebra;
- retryable versus terminal FAILED;
- REVIEWED semantics;
- parent/child Work semantics;
- trigger/deadline/budget/attention placement;
- exact authority citation/join;
- active Work replacement/fencing;
- exact Data revision/storage envelope.

## 13. Peer reconciliation requests
| Peer | Request | Classification | Minimum response |
|---|---|---|---|
| CFA-03 | Accept/refute the proposed semantic Plan → executable Plan seam and mandatory continuity fields | BLOCKING | explicit peer statement plus example Plan revision/basis |
| CFA-02 | Identify durable identity/revision/lineage guarantees for Work/Attempt/Outcome | HIGH-VALUE | continuity contract or explicit gaps |
| CFA-04 | Confirm minimum historical authority citation needed to explain Attempts without caching permission | HIGH-VALUE | citation fields or existing mechanism |
| CFA-06 | Confirm minimum realization/session references needed for actual execution attribution | HIGH-VALUE | representative attribution trace |
| CFA-10 | Confirm minimum runtime lifecycle/fencing guarantees Work may rely on | HIGH-VALUE | runtime guarantee plus later replacement test seam |

## 14. Result
M1 CHARACTERIZATION COMPLETE.

The candidate Work model is sufficiently characterized for peer reconciliation, not for final freeze.

The core boundary is:

Work is the durable execution subject; semantic Plan meaning, live authority, realization semantics, durable record mechanics and runtime enforcement remain separately owned.

No production implementation was started. No shared CFA boundary was activated. Ω law was not changed.