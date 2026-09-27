# CFA-05 — Strategic Domain Roadmap
## Strategic Objective

Make entrusted Work a single durable, inspectable execution subject in VIVIM: an outcome can move from a semantically attributable Plan basis through live authority, selected realization, attributable attempts, temporal continuity, recovery and external-effect reconciliation to a truthful Outcome, without making workers, schedulers, UI surfaces, providers, or LLMs into competing sources of canonical truth.

Strategic end-state:

Intent/Plan meaning → executable Work → authority gate → governed realization → Step/Attempt → durable wait/recovery → verify/reconcile → Outcome → evidence linkage → World/Attention projection

The objective is not to build an “autonomous AI” subsystem. It is to make user-delegated outcomes durable and governable whether execution is local, browser-mediated, provider-backed, synchronous, delayed, background, interrupted, or resumed by a replacement worker.

## Responsibility Frontier

CFA-05 owns the Work-side lifecycle and its continuity consequences:

- durable Work identity and lifecycle;
- Work-facing executable Plan snapshots/references;
- Steps, Attempts, checkpoints and effect identity;
- Work-relevant scheduling, triggers, waits and background continuation;
- crash recovery and Work reconstruction;
- Work-level external-effect reconciliation;
- verification posture and Work Outcome semantics;
- execution attribution through worker/session/retry/recovery replacement.

CFA-05 does not own:

- semantic Intent/Plan meaning (CFA-03);
- canonical data identity/persistence/revision/lineage (CFA-02);
- live authority/delegation/standing semantics (CFA-04);
- capability/provider/account/realization semantics (CFA-06);
- composition/Forge mechanics (CFA-07);
- surface realization (CFA-08);
- general evolution/compatibility/self-maintenance policy (CFA-09);
- K0/runtime constitutional enforcement (CFA-10);
- a universal scheduler, universal event/state system, second data store, or second evidence/authority system.

## Current Evidence / Maturity

### OBSERVED / CURRENT

1. The destination conceptual model defines Work as an outcome entrusted to the environment and distinguishes Work from mechanism, Authority from Evidence, and Capability from realization.
2. Destination agentic-core research identifies the smallest deterministic substrate as durable Work with versioned Plan, Steps, Attempts, stable effect identities, temporal trigger/wait support, verification/evidence, leases, human gates and projections.
3. The destination agentic-core canonical model explicitly rejects a separate canonical Run root and assigns Work, Plan, Step, Attempt, Trigger, Automation and Evidence distinct meanings.
4. The Ω vivim.run surface already has durable Work/Plan/Attempt vocabulary and operations including create/get/list/transition/attempt.start/attempt.finish/reconcile/verify/cancel/recover.
5. Ω D-452 requires invocation framing and live authority re-resolution at every gate; root is not an exemption and deputy execution requires live delegation/standing.
6. Ω D-453 requires standing to be scoped, expiring and revocable; renewal is a new grant, not silent extension.
7. Ω D-454 provides attenuating delegation-chain semantics and explicit revocation/expiry behavior.
8. Ω D-435 provides an execution-debug tier with plan-state inspection and intervention evidence, showing that progress, blocking and intervention can be derived and ledgered.
9. The vault documentation has a work namespace with durable Work records, immutable per-Work Plan snapshots, Attempt records and recovery/reconciliation operations.
10. Destination reconciliation currently rates Work/background execution and continuity while away as Partial: important machinery exists, but the product-level integration remains incomplete.
11. Legacy mapping shows useful predecessor concepts—ActionPlan, AutonomousTask, AutonomousStep, WorkflowExecution, RetryQueue, TaskHistory—but these are evidence to harvest, not canonical destination identity.
12. CFA-10 explicitly identifies active Work replacement as an open proof frontier, confirming that worker/process replaceability is not yet proven at the constitutional seam.

### DERIVED / CURRENT

- Work should be the sole canonical durable execution subject.
- A Plan snapshot consumed by Work must remain attributable to canonical semantic Plan meaning without silently becoming new meaning.
- Scheduler/worker/session are mechanisms or participants; they must not become durable truth.
- Executor success is not sufficient evidence of external truth.
- Unknown external effects must be represented explicitly and reconciled before unsafe retry.
- Temporal state matters only insofar as it preserves Work continuity; the broader temporal substrate remains a separate architectural question.
- Outcome and Evidence are separate planes: Outcome describes the Work-level result; Evidence supports claims about what happened.

### PROPOSED / ROUND-1 STRATEGIC POSITION

The domain should be developed through six architectural capability milestones, each gated by evidence rather than implementation completion. The first actionable slice should characterize the canonical Work envelope/state model and its peer seams before committing to a concrete storage schema or runtime implementation.

### UNKNOWN / OPEN

- canonical Work state vocabulary and transition algebra;
- exact semantic-Plan → executable-Plan snapshot contract;
- exact Step/Attempt schema and checkpoint granularity;
- effect identity strategy across heterogeneous realization classes;
- retry/compensation semantics by effect class;
- exact multi-step/batched authority protocol;
- exact durable temporal substrate boundary;
- lease/fencing/resource-loss interaction between Work and K0;
- heterogeneous external-effect reconciliation protocol;
- exact Outcome envelope and its Data ownership;
- attribution across retry, recovery, delegated execution and worker replacement;
- product return/attention contract for completed, blocked, failed and unresolved Work.

## Conceptual Roadmap

### M1 — Canonical Work Envelope & Lifecycle Contract

**Conceptual outcome**

One domain-level Work contract explains what is being entrusted, which semantic Plan basis it derives from, which executable snapshot is being pursued, its lifecycle state, current revision, parent/decomposition relationship, trigger context, deadlines/budgets where applicable, and current need for action—without duplicating semantic Plan meaning or canonical Data ownership.

**Why it matters**

Every later capability depends on a stable execution subject. Without this, retries, scheduling, provider routing, recovery and product continuity attach to whichever implementation happens to be active.

**Evidence basis**

Destination agentic-core canonical Work model; destination Interaction/Intent/Work reconciliation; Ω work namespace and vivim.run operations; CFA-05 owner-aligned identity; legacy ActionPlan/AutonomousTask mapping as behavioral evidence only.

**Current maturity**

DESIGN: strong evidence / not fully reconciled.
IMPLEMENTATION: partial existing Ω machinery.
INTEGRATION: unproven across the full destination path.
LIVE/EXTERNAL PROOF: absent as a destination-grade end-to-end Work corridor.
PRODUCT PROOF: partial concept only.

**Design choices to make**

- authoritative Work state vocabulary and transition invariants;
- immutable vs revisioned Work envelope fields;
- relationship between canonical Intent/Plan reference and Work-facing executable snapshot;
- parent/child Work semantics;
- cancellation/refusal/review/terminal-state distinctions;
- whether trigger, attention and deadline references are embedded or referenced.

**Success criteria**

- Design: deterministic state/transition model and field ownership map exists with explicit UNKNOWNs.
- Implementation: isolated representation round-trips without inventing duplicate canonical entities.
- Integration: Work can be created from an attributable Plan basis and inspected without relying on worker memory.
- Live proof: restart preserves identity/state and does not create a second Work subject.
- Product proof: a user can inspect what was entrusted, where it is, and what it needs without seeing implementation internals.

**Falsifiers / failure conditions**

- Different subsystems require competing Work roots for the same entrusted outcome.
- Worker-local state is required to reconstruct canonical Work.
- Plan meaning is silently rewritten inside Work.
- Terminal states cannot be reconstructed deterministically from persisted history.

**Prerequisites / dependencies**

CFA-03 semantic Plan reference semantics; CFA-02 persistence/revision/lineage rules; CFA-04 authority vocabulary; CFA-10 runtime lifecycle/fencing constraints. These are information dependencies to be verified, not yet shared execution dependencies.

**Candidate implementation later**

A pure Work envelope/state module plus durable vault adapter and inspect/read projection.

**Must remain unresolved**

Universal temporal substrate; final canonical database schema; full multi-step authorization; realization-specific effect identity.

### M2 — Executable Plan, Step/Attempt & Effect-Safety Model

**Conceptual outcome**

A Work carries an immutable executable Plan basis whose Steps are explicit, each consequential execution has an attributable Attempt, and each side-effecting Step has a stable effect identity and explicit retry/compensation posture.

**Why it matters**

Durable Work without effect safety merely makes duplicate side effects easier to repeat. The core reliability boundary is the uncertain interval between external effect and local recording.

**Evidence basis**

Agentic-core Plan/Step/Attempt model; Ω Work Plan snapshots and Attempt records; destination legacy mapping of ActionPlan/AutonomousStep/Actual execution; Ω D-435 execution-debug instrumentation; CFA-05 core falsifier.

**Current maturity**

DESIGN: strong conceptual basis, effect-class details open.
IMPLEMENTATION: partial Ω vocabulary.
INTEGRATION: not proven across real provider/browser effects.
LIVE/EXTERNAL PROOF: specifically open.
PRODUCT PROOF: indirect.

**Design choices to make**

- snapshot granularity and version semantics;
- Step dependency and checkpoint structure;
- Attempt identity and retry sequence;
- stable effect identity derivation;
- compensation semantics;
- unknown/pending/final effect classifications;
- minimum execution attribution payload.

**Success criteria**

- Design: every consequential Step has a defined effect-safety posture.
- Implementation: Steps/Attempts serialize and replay deterministically enough to reconstruct execution history.
- Integration: retries use the same logical effect identity while attempts remain individually attributable.
- Live proof: crash between external invocation and record persistence never produces an unbounded blind duplicate.
- Product proof: inspection explains attempted/retried/pending/reconciled rather than merely failed.

**Falsifiers / failure conditions**

- Effect identity differs after restart for the same logical effect.
- A retry path cannot distinguish unknown external effect from confirmed no-effect.
- Compensation is treated as universal when unavailable for an effect class.
- A Step executable meaning changes without a new attributable Plan basis.

**Prerequisites / dependencies**

M1; CFA-06 realization-specific effect semantics; CFA-02 durable revision/lineage; CFA-10 fencing/isolation; CFA-04 authority frame semantics.

**Candidate implementation later**

Pure Plan/Step/Attempt contracts, effect-identity module, replay fixtures, crash-window test harness.

**Must remain unresolved**

How every provider realizes idempotency; final compensation taxonomy; exact resource/lease implementation.

### M3 — Governed Multi-Step Execution & Replacement Safety

**Conceptual outcome**

A Work can execute multiple dependent Steps through the ordinary authority path, preserve live authority at each consequential gate, attribute the actual worker/session/realization for every Attempt, and safely survive worker replacement and process termination.

**Why it matters**

The destination depends on chaining local data, provider reasoning, and external mutations under one Work. Governance and continuity must survive the chain.

**Evidence basis**

Ω D-452 live invocation framing; Ω D-453/D-454 standing and delegation; Ω D-435 plan-state/intervention; CFA-04/CFA-06 ratified boundaries; CFA-10 active Work replacement frontier; destination multi-capability Project X falsifier.

**Current maturity**

DESIGN: strong boundary evidence, multi-step seam unresolved.
IMPLEMENTATION: individual work/intervention pieces exist.
INTEGRATION: partial/fragmented.
LIVE/EXTERNAL PROOF: open.
PRODUCT PROOF: not yet destination-grade.

**Design choices to make**

- gate frequency for multi-step Work;
- authority frame propagation across child Steps/deputies;
- behavior when authority changes or is revoked during Work;
- worker/session replacement semantics;
- lease/fencing split with CFA-10;
- whether an Attempt may resume or must be superseded by a fresh Attempt.

**Success criteria**

- Design: trace shows authority, realization and attribution at each consequential boundary.
- Implementation: replacement worker resumes the same Work without creating a second canonical execution subject.
- Integration: human-gated and automatically-authorized Steps coexist in one Work lifecycle.
- Live proof: revocation/change of standing is observed at the next appropriate gate and does not silently allow later Steps.
- Product proof: users see one Work progressing across multiple actors/realizations.

**Falsifiers / failure conditions**

- Child Step invents authority rather than consuming CFA-04's live result.
- Replacement worker cannot safely claim existing Work without duplication.
- Cross-provider chain loses attribution at handoff.
- Scheduler or worker-local lease becomes de facto authority.

**Prerequisites / dependencies**

M2; CFA-04 multi-step/batched authority seam; CFA-06 realization/session attribution; CFA-10 runtime fencing/lifecycle; CFA-02 revision semantics.

**Candidate implementation later**

Cross-plugin Work corridor, replacement/termination harness, multi-step authorization fixture corpus.

**Must remain unresolved**

General self-evolving agent behavior; full provider routing policy; global orchestration engine.

### M4 — Temporal & Background Continuity

**Conceptual outcome**

Work remains durable while no interactive process is present: scheduled, event-triggered or delayed Work can sleep, wake, suspend, resume or expire from durable state rather than from an accidentally persistent process.

**Why it matters**

“Leave and return” is impossible without durable time/continuity.

**Evidence basis**

Destination Background/Attention reconciliation; destination J4/J6 delegated/background journeys; existing automation/director/tick and daemon material; Ω liveness/execution-debug substrates; current vault Work recovery vocabulary.

**Current maturity**

DESIGN: coherent concept, broader temporal boundary open.
IMPLEMENTATION: partial mechanisms exist.
INTEGRATION: fragmented across automation/daemon/work.
LIVE/EXTERNAL PROOF: limited.
PRODUCT PROOF: absent.

**Design choices to make**

- minimum durable trigger/wait model needed by Work;
- event/time/dependency trigger semantics;
- wake scheduling and missed-trigger handling;
- lease/fencing around concurrent wakeups;
- deadline/expiration interaction with authority;
- boundary between CFA-05 Work continuity and any universal temporal substrate.

**Success criteria**

- Design: dormant Work has deterministic wake condition.
- Implementation: process termination during a wait does not lose Work.
- Integration: duplicate wakeups cannot create competing Work execution subjects.
- Live proof: scheduled/background Work resumes after restart and rechecks authority where required.
- Product proof: returning users see accurate running/waiting/completed state with timestamps and reasons.

**Falsifiers / failure conditions**

- Sleeping process memory is required for correct recovery.
- Duplicate wakeups create duplicate external effects.
- Scheduler state becomes authorization state.
- Missed timers cannot be explained or reconciled.

**Prerequisites / dependencies**

M3; CFA-10 lifecycle/fencing; CFA-02 durable wait/deadline representation if applicable; CFA-04 authority expiry/revocation; CFA-08 return/attention projection.

**Candidate implementation later**

Deterministic timer/wakeup test harness, restart/replay fixtures, Work continuity adapter.

**Must remain unresolved**

Whether a universal Time/Temporal substrate becomes its own shared layer; distributed/multi-device scheduling.

### M5 — External-Effect Reconciliation, Verification & Truthful Outcome

**Conceptual outcome**

When external execution leaves an uncertain state, VIVIM explicitly suspends unsafe continuation, obtains realization-specific reconciliation evidence, distinguishes executor report from external truth, verifies consequential results, and records a Work-level Outcome with traceable evidence links.

**Why it matters**

This is the trust boundary where “the system says it ran” becomes either a truthful claim or an unresolved question.

**Evidence basis**

CFA-05 aligned split between Work-level reconciliation and CFA-06 realization-side knowledge; destination agentic-core verification/evidence model; Ω recovery discipline; Ω D-435 evidence/intervention patterns; destination result presentation.

**Current maturity**

DESIGN: strong separation rules, reconciliation protocol open.
IMPLEMENTATION: partial evidence/recovery substrate.
INTEGRATION: open across heterogeneous providers.
LIVE/EXTERNAL PROOF: required.
PRODUCT PROOF: partial concept.

**Design choices to make**

- canonical uncertain-effect states;
- reconciliation request/response contract;
- provider-side status evidence vs local evidence;
- verification policy by effect class;
- Outcome envelope and terminality;
- evidence references and freshness;
- conditions for resume/complete/refuse/escalate.

**Success criteria**

- Design: unknown external effect is first-class with an explicit safe path.
- Implementation: reconcile/verify/update operations are idempotent and history-preserving.
- Integration: provider-specific evidence is consumed without moving provider semantics into CFA-05.
- Live proof: crash-window tests plus real provider/browser corridor show no blind duplicate after uncertainty.
- Product proof: user can distinguish attempted, confirmed, unresolved, verified and completed.

**Falsifiers / failure conditions**

- Local executor success is treated as external truth.
- Missing provider evidence collapses into failed and loses uncertainty.
- Work resumes solely because a worker restarted.
- Outcome is used as an implicit proof record.

**Prerequisites / dependencies**

M3; CFA-06 realization reconciliation/evidence; CFA-02 Outcome/evidence persistence; CFA-04 live authority at resume; CFA-01 World update semantics; CFA-09 change/recovery compatibility.

**Candidate implementation later**

Failure-injection corridor harness, provider reconciliation adapters, Outcome/evidence projection, replay/diff tooling.

**Must remain unresolved**

Universal evidence architecture; final retention policy; every provider's external-status semantics.

### M6 — Destination-Grade Work Journey & Replacement Proof

**Conceptual outcome**

A single user outcome travels end-to-end through Work across local and external capabilities with durable continuity, governed authorization, live provider realization, recovery/reconciliation, truthful Outcome and user-facing continuity, while a worker can be replaced without losing or duplicating the Work.

**Why it matters**

The domain is validated by a composed product journey, not isolated Work operations.

**Evidence basis**

Destination thin falsifiers in Interaction/Intent/Work and Background/Attention reconciliation; J4/J6; D3/D5 product maturity paths; CFA-10 active Work replacement frontier; CFA-05 core falsifier.

**Strategic design choice**

Select one narrow destination corridor as the proving ground rather than building a general orchestration platform first.

Candidate corridor:

“Summarize the current Project X status and send it to John.”

Required sequence:

address → intent → context → capability plan → realization selection → authority → Work → Step/Attempt → provider/browser effect → verification/reconciliation → Outcome → evidence → World/Attention projection

Second-stage background variant:

“While I am away, monitor Project X for an important change, research it with my configured provider, prepare a summary, and tell me when I return.”

**Success criteria**

- Design: entire semantic/execution chain has one attributable Work root and explicit cross-CFA seams.
- Implementation: corridor can be exercised with deterministic fixtures before live providers.
- Integration: local data, provider realization and authority participate without parallel semantic systems.
- Live proof: real authenticated realization executes the external mutation and survives injected crash/restart/recovery.
- Product proof: normal user can leave and return to a truthful, inspectable continuity view.
- Replacement proof: current worker is terminated and a replacement resumes the same Work without duplicate external effect.

**Falsifiers / failure conditions**

- End-to-end path needs an out-of-band work store.
- Provider choice or authority becomes hidden inside the worker.
- Work cannot be reconstructed independently of the process.
- User-facing result cannot explain requested, authorized, attempted, verified and observed states.

**Prerequisites / dependencies**

M1–M5, plus live provider/Chrome evidence and runtime replacement/fencing.

**Candidate implementation later**

One bounded vertical-slice harness, not a generalized workflow product.

**Must remain unresolved**

General-purpose orchestration optimization; multi-device scheduling; arbitrary agent autonomy.

## Dependency Model

### Strategy

Round-1 dependencies are deliberately separated from peer-information requests.

A dependency becomes real only when the supplying CFA owns the requested semantic subject, the consuming decision is explicit, and reconciliation or evidence confirms that the dependency is necessary.

### Major dependencies

| Source CFA | Subject | Kind | Status | Nature | Evidence needed to confirm/falsify |
|---|---|---|---|---|---|
| CFA-03 | semantic Plan meaning and semantic→executable handoff | semantic | Target | Direct / required for M1–M3 | Stable semantic Plan reference and explicit snapshot boundary preserving meaning |
| CFA-02 | Work/Attempt/Outcome durable records, revisions and lineage | data | Target | Direct / required for M1–M5 | Canonical record/revision semantics and reconstruction contract |
| CFA-04 | live authority/standing/delegation at consequential gates | authority | Current → target | Direct / required for M2–M5 | Multi-step gate trace showing live re-resolution and bounded delegation |
| CFA-06 | realization/session context and external-effect knowledge | realization/provider | Current → target | Direct / required for M2, M3, M5, M6 | Realization-specific effect status and attribution contract |
| CFA-10 | lifecycle/fencing/termination guarantees | runtime/platform | Target | Direct / required for M3–M6 | Replacement/termination corridor with no duplicate Work or unsafe concurrency |
| CFA-08 | user projection of Work state and return continuity | surface/UX | Preferred → required for M6 | Direct / product integration | One surface explains progress/result/pending input without becoming canonical state |
| CFA-01 | World update and context consequences of Work outcome | semantic | Target | Direct for M5/M6 | Traceable result→World mapping |
| CFA-09 | compatibility, replacement and migration impact on Work | lifecycle/evolution | Target | Direct for M3–M6 | Evolved Plan/Work compatibility and recovery behavior |
| CFA-07 | composition-generated Work / replacement structure | composition | Preferred for M3/M6 | Transitive / later | Composition participates in Work without second authority or Work store |

## Tooling / Substrate

| Milestone | Tooling / substrate | Status | Decision/proof purpose |
|---|---|---|---|
| M1 | repo/query/graph inspection; schema/round-trip fixtures | ALREADY EXISTS + SMALL EXTENSION | Reconcile Work fields/state with existing Ω/destination evidence |
| M2 | deterministic Plan/Step/Attempt serializer; effect-identity corpus; crash-window harness | NEEDS SMALL EXTENSION | Falsify duplicate-effect and snapshot-drift risks |
| M3 | multi-step corridor harness; authority-gate fixtures; worker replacement/termination harness | NEW TOOL JUSTIFIED | Prove governed chaining and replacement safety |
| M4 | deterministic timer/wakeup simulator; restart/replay harness; concurrency/fencing checks | NEW TOOL JUSTIFIED | Prove durable wait and duplicate-wakeup safety before production scheduler work |
| M5 | external-effect failure-injection harness; provider reconciliation interface; evidence diff/replay lens | NEEDS SMALL EXTENSION + NEW TOOL JUSTIFIED | Separate local execution from external truth |
| M6 | one E2E fixture corridor + live browser/provider lab + return-projection test | EXISTING CAPABILITIES + SMALL EXTENSION | Move from architecture proof to live/product proof without general orchestrator |

Tooling principle: prefer small falsification instruments over new permanent runtime layers. Do not introduce a new database, event store, scheduler engine, workflow framework, or agent framework merely to make the roadmap look executable.

## Peer Intelligence Gates

### M1 — Canonical Work Envelope & Lifecycle Contract

| Peer CFA | Intelligence / evidence needed | Why the milestone depends on it | Exact decision it informs | Minimum acceptable evidence | Timing |
|---|---|---|---|---|---|
| CFA-03 | canonical semantic Plan identity, revision and executable-handoff boundary | Work must not redefine meaning | Work planRef/snapshot seam | Semantic Plan example plus explicit preservation rule | BLOCKING |
| CFA-02 | canonical identity/revision/lineage rules for Work-like records | Work needs durable lineage without a second store | Work record identity/revision | Existing canonical record/revision pattern | HIGH-VALUE |
| CFA-04 | fields needed to cite live authorization without storing authority semantics locally | Work records authority facts only | authority citation shape | Live invocation example with stable refs | HIGH-VALUE |
| CFA-06 | realization/session references required to describe actual actor | Work must name what acted | execution-reference envelope | Realization/session example with attributable IDs | HIGH-VALUE |
| CFA-10 | minimum lifecycle/fencing assumptions Work can rely on | avoids smuggling runtime law into Work | Work/K0 boundary | Runtime guarantee list and replacement seam | HIGH-VALUE |

### M2 — Executable Plan, Step/Attempt & Effect Safety

| Peer CFA | Intelligence / evidence needed | Why the milestone depends on it | Exact decision it informs | Minimum acceptable evidence | Timing |
|---|---|---|---|---|---|
| CFA-03 | Plan immutability/versioning and meaning-preservation | executable snapshot must stay attributable | snapshot/version semantics | concrete plan revision chain | BLOCKING |
| CFA-04 | gate semantics for each consequential Step and retry/re-entry | retry cannot bypass authority | authority re-check points | multi-step authority trace or explicit contract | BLOCKING |
| CFA-06 | realization-specific idempotency/effect-status capabilities | effect identity cannot be generic fiction | effect-safety class matrix | representative local + browser/provider examples | BLOCKING |
| CFA-02 | durable Attempt/revision/lineage constraints | history must survive process loss | record envelope/update strategy | deterministic round-trip record | HIGH-VALUE |
| CFA-10 | fencing/lease primitive at Attempt boundary | protects concurrent executors | Attempt ownership semantics | current runtime enforcement contract | HIGH-VALUE |

### M3 — Governed Multi-Step Execution & Replacement Safety

| Peer CFA | Intelligence / evidence needed | Why the milestone depends on it | Exact decision it informs | Minimum acceptable evidence | Timing |
|---|---|---|---|---|---|
| CFA-04 | multi-step/batched authorization and delegation propagation | one Work spans guarded effects | per-Step gate model | bounded trace across 2–3 consequential Steps | BLOCKING |
| CFA-06 | session/realization continuity across Step handoff/replacement | attribution cannot break at provider seam | Attempt actor/realization fields | representative provider/browser trace | BLOCKING |
| CFA-10 | active Work replacement and termination/fencing | replacement crosses K0 | who can claim/resume running Work | injected termination/restart test | BLOCKING |
| CFA-02 | compare/revise or append semantics under concurrent Attempts | durable conflicts must be explicit | Work/Attempt concurrency rule | deterministic conflicting-write result | HIGH-VALUE |
| CFA-08 | projection needs for multi-actor Work | surface must not invent another state | progress/approval/result projection | projection tied to Work refs | CONTEXTUAL |

### M4 — Temporal & Background Continuity

| Peer CFA | Intelligence / evidence needed | Why the milestone depends on it | Exact decision it informs | Minimum acceptable evidence | Timing |
|---|---|---|---|---|---|
| CFA-10 | wakeup concurrency/fencing and lifecycle survival | timers must not duplicate executors | wake claim/fence semantics | restart + duplicate-wakeup fixture | BLOCKING |
| CFA-04 | authority expiry/revocation during dormancy | sleeping Work cannot retain stale permission | wake/recheck policy | standing expiry/revocation example | BLOCKING |
| CFA-02 | durable trigger/wait/deadline representation | no process memory as truth | persistence shape | reconstructable wait record | HIGH-VALUE |
| CFA-08 | return/attention projection expectations | background result must surface correctly | user-return Work projection | waiting/completed result example | HIGH-VALUE |
| CFA-09 | compatibility when waiting Work outlives a change | long-lived Work must survive evolution | version compatibility/recovery | changed Work recovery example | HIGH-VALUE |

### M5 — External-Effect Reconciliation, Verification & Truthful Outcome

| Peer CFA | Intelligence / evidence needed | Why the milestone depends on it | Exact decision it informs | Minimum acceptable evidence | Timing |
|---|---|---|---|---|---|
| CFA-06 | provider-side effect status, receipt, pending/unknown semantics | Work cannot invent external truth | reconciliation states | representative browser/provider crash-window trace | BLOCKING |
| CFA-02 | Outcome/evidence reference storage and revision | result must be durable without a second evidence store | Outcome envelope/links | existing evidence-linked record pattern | BLOCKING |
| CFA-04 | authority validity at reconcile/resume time | recovery must not reuse stale permission | resume/retry authority gate | revocation-after-crash trace | HIGH-VALUE |
| CFA-01 | World update semantics after verified outcome | completion may change durable world state | result→World mapping | before/after projection example | HIGH-VALUE |
| CFA-09 | changed-provider/plan compatibility and recovery impact | drift/change can invalidate assumptions | repair/retry disposition | compatible and incompatible recovery cases | HIGH-VALUE |
| CFA-03 | semantic interpretation needed to judge satisfaction of Intent | Outcome must not redefine goal semantics | success/partial outcome semantics | canonical Intent + result interpretation | HIGH-VALUE |

### M6 — Destination-Grade Work Journey & Replacement Proof

| Peer CFA | Intelligence / evidence needed | Why the milestone depends on it | Exact decision it informs | Minimum acceptable evidence | Timing |
|---|---|---|---|---|---|
| CFA-03 | end-to-end semantic trace user request→Plan | ensures one meaning path | corridor input/plan acceptance | deterministic request→Intent→Plan trace | BLOCKING |
| CFA-04 | live authority trace across consequential effects | proves governance survives composition | gate points/refusal behavior | recorded multi-step authority trace | BLOCKING |
| CFA-06 | real provider/account/session trace + external-effect reconciliation | proves real external execution | realization selection/effect proof | authenticated browser corridor with recoverable evidence | BLOCKING |
| CFA-02 | durable Work/Attempt/Outcome reconstruction after restart | proves one canonical Work root | persistence continuity | replay from durable records | BLOCKING |
| CFA-10 | worker replacement/fencing proof | proves Work survives executor replacement | termination/restart behavior | injected kill + replacement with no blind duplicate | BLOCKING |
| CFA-01 | final World/Context update after verified result | closes semantic loop | post-Work projection | traceable World update/ref | HIGH-VALUE |
| CFA-08 | user-facing return and inspection surface | product proof needs understandable continuity | minimum continuity projection | user-grade walkthrough | HIGH-VALUE |
| CFA-09 | compatibility/change behavior for corridor | proves lifecycle resilience | Work survival under change | controlled evolution/recovery test | CONTEXTUAL |
| CFA-07 | composition participation without second Work/authority system | ensures extension symmetry | composition seam | one composed capability chain | CONTEXTUAL |

## Strategic Decision Gates

### G1 — What exactly is Work?

Freeze the smallest durable Work envelope and state machine.
Open alternatives: single mutable state vs append-derived state; parent/child semantics; placement of trigger/deadline/attention refs.
Decision owner: CFA-05 within delegated Work mechanics; cross-domain conflicts escalate.
Falsifier: no single Work root can represent the delegated-outcome journey.

### G2 — What is an executable Plan snapshot?

Define the seam between semantic Plan and Work-facing executable Plan.
Open alternatives: immutable snapshot payload vs immutable reference to Plan revision plus execution-local deltas.
Decision owner: joint semantic/data/work reconciliation, with CFA-03 retaining meaning ownership.
Falsifier: execution requires silent rewriting of semantic Plan meaning.

### G3 — What makes a retry safe?

Define effect-safety classes and when retry/refuse/reconcile/compensate is permitted.
Open alternatives: operation-specific identity; realization-class adapters; explicit manual reconciliation for unsupported effects.
Decision owner: CFA-05 for Work-side behavior; CFA-06 for realization meaning.
Falsifier: same logical effect cannot be identified across restart, or provider evidence cannot distinguish unknown from confirmed no-effect.

### G4 — Where does authority apply in a multi-step Work?

Define gate placement and propagation for consequential Steps.
Open alternatives: every Step; grouped gates with constrained subplans; explicit preauthorization for bounded sequences.
Decision owner: CFA-04 for authority semantics, CFA-05 for Work integration.
Falsifier: a later Step can execute under stale or revoked authority.

### G5 — What counts as a truthful Outcome?

Define Outcome taxonomy and terminal semantics distinct from Evidence.
Open alternatives: binary terminal result; typed partial/unresolved outcomes; result with separate verification status.
Decision owner: CFA-05 for Work Outcome semantics; peer owners for their semantic layers.
Falsifier: Outcome becomes shorthand for proof or hides unresolved external effects.

### G6 — How is long-lived Work kept alive?

Define the minimum durable temporal contract and scheduler boundary.
Open alternatives: Work-local trigger state; shared temporal substrate; adapter over existing director/daemon mechanisms.
Decision owner: CFA-05 for Work continuity consequence; broader substrate ownership deferred until evidence demands it.
Falsifier: no safe wake/resume exists without coupling truth to a running process.

### G7 — Does the Work model survive the real world?

Select and run one destination-grade end-to-end corridor.
Open alternatives: synchronous cross-domain action first vs background monitoring first.
Decision owner: CFA-05 within Work scope; central product choice remains shared/owner-level.
Falsifier: corridor requires a parallel orchestration/data/authority architecture.

## Product / Strategic Consequences

- A delegated action becomes an ordinary persistent object rather than a transient “agent run.”
- “Leave and come back” becomes a reliability property of Work, not a special autonomous-agent mode.
- Provider choice, account identity and browser session remain actual realization references without becoming Work semantics.
- The UI can present one continuity story—requested, understood, authorized, attempted, observed, verified, completed/blocked—without becoming canonical state.
- Recovery and retry become explainable through durable attempt history and explicit uncertainty handling.
- Provider/browser maturity can advance independently while Work semantics stay stable.
- The architecture avoids a generalized workflow engine unless evidence proves one is necessary.
- Approval boundaries remain user-controlled while long-lived Work continues only within applicable authority.
- The strongest trust demonstration is a falsifiable corridor with an injected crash, not a pile of happy-path tests.

## Deferred / Do Not Do

- Do not start production Work runtime implementation during this planning round.
- Do not build a generalized workflow/DAG platform.
- Do not create a second task/work database.
- Do not create a Work-specific authority store.
- Do not create a separate scheduler service as a new architectural layer.
- Do not define universal evidence infrastructure inside CFA-05.
- Do not move provider/account/session semantics into Work.
- Do not let Plan snapshots mutate semantic Intent/Plan meaning.
- Do not make worker memory, process state or UI state canonical.
- Do not turn every P1 item into a CFA-05 task.
- Do not treat P1-06/P1-07/P1-09 or Cycle-4/Cycle-5 labels as automatic mandates.
- Do not consume newly produced peer Round-1 roadmap conclusions before central reconciliation.

## Relationship to Existing Program Plans

| Existing material | Classification | CFA-05 interpretation |
|---|---|---|
| Build-and-Harvest D3 Interaction / Work | ADOPTED WITH MODIFICATION | Retain semantic path and durable Work objective; replace program-cycle sequencing with this six-milestone evidence model. |
| Build-and-Harvest D5 Agency / Evolution | ADOPTED WITH MODIFICATION | Harvest Work/background/agent behavior; keep CFA-05 limited to Work continuity and leave broader attention/evolution semantics to their owners. |
| INTERACTION-INTENT-WORK-RECONCILIATION.md | ADOPTED WITH MODIFICATION | Use its destination spine and thin falsifier as source evidence, not a ticket list. |
| AGENCY-BACKGROUND-ATTENTION-RECONCILIATION.md | ADOPTED WITH MODIFICATION | Adopt Work/agent/background distinctions and return continuity concept; do not absorb broader attention semantics. |
| Agentic-core RESEARCH-SYNTHESIS / CANONICAL-MODEL | ADOPTED | Foundational Work/Plan/Step/Attempt/Trigger/Evidence separation, subject to later contract verification. |
| P1-06 and related agency/work program material | USEFUL INPUT / NOT ADOPTED AS MANDATE | Candidate evidence/tests; this roadmap defines CFA-05 strategic ordering. |
| P1-07 provider/reality work | USEFUL INPUT / NOT ADOPTED AS CFA-05 OWNERSHIP | Required peer evidence for external effect and live proof, not provider ownership. |
| P1-09 E2E | DEFERRED TO M6 | Final product proof after Work semantics are established. |
| Build-and-Harvest Cycle 4 / Cycle 5 | USEFUL INPUT / NOT ADOPTED AS SEQUENCING AUTHORITY | Program sequence positions only. |
| Legacy ActionPlan / AutonomousTask / AutonomousStep / RetryQueue / TaskHistory | USEFUL INPUT / NOT ADOPTED | Harvest behavior/falsifiers selectively; do not inherit legacy class boundaries. |
| Provider/background Chrome laboratory work | USEFUL INPUT / CONDITIONAL DEPENDENCY | Consume when a milestone requires live realization/effect evidence; not a prerequisite for all Work design. |

## Evidence Index

1. docs/destination/CONCEPTUAL-MODEL.md
2. docs/destination/DESTINATION-MASTER-MAP.md
3. docs/destination/RECONCILIATION-MAP.md
4. docs/destination/INTERACTION-INTENT-WORK-RECONCILIATION.md
5. docs/destination/AGENCY-BACKGROUND-ATTENTION-RECONCILIATION.md
6. docs/destination/agentic-core/RESEARCH-SYNTHESIS.md
7. docs/destination/agentic-core/CANONICAL-MODEL.md
8. omega-baseline/omega-final/docs/VAULT-NAMESPACES.md
9. omega-baseline/omega-final/docs/decisions/D-452-invocation.md
10. omega-baseline/omega-final/docs/decisions/D-453-standing.md
11. omega-baseline/omega-final/docs/decisions/D-454-delegation.md
12. omega-baseline/omega-final/docs/decisions/D-435-exec-debug.md
13. omega-baseline/omega-final/plugins/vivim-run/plugin.json
14. docs/destination/legacy-harvest/DESTINATION-MAPPING.md
15. AGENTS_CONTEXT/ARCHITECTURE_STEWARD/SUBAGENTS/AGENCY-WORK-EXECUTION/CORE-AGENT.md
16. AGENTS_CONTEXT/ARCHITECTURE_STEWARD/SUBAGENTS/AGENCY-WORK-EXECUTION/STATE.md

## Round-1 Conclusion

CFA-05 should not begin by building an agent runtime or scheduler. It should first make Work itself unambiguous and durable, then make execution safe, governed, temporally continuous and reconcilable, and finally prove the model in one live destination journey.

The strategic invariant is:

The worker may disappear; the Work must remain.
