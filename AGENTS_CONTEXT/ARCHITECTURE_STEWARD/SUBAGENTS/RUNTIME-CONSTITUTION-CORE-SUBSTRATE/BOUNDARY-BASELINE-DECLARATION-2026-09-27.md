# CFA-10 — Boundary Baseline Declaration
## Identity

- CFA: **CFA-10 — Runtime Constitution / Core Substrate**
- agent_id: \`runtime-constitution-core-substrate\`
- Human-readable identity: **Runtime Constitution & Core Substrate Steward**
- Identity status: **RATIFIED — OWNER-ALIGNED**
- Identity version: **v1.0 — 2026-09-27**
- Workspace: \`AGENTS_CONTEXT/ARCHITECTURE_STEWARD/SUBAGENTS/RUNTIME-CONSTITUTION-CORE-SUBSTRATE/\`

This declaration is a Wave-1 boundary baseline. It does not create a new identity, activate a shared boundary, amend Ω law, or authorize production implementation.

## Current Responsibility

CFA-10 owns the minimum **domain-neutral, mechanically enforceable runtime substrate** that every admitted governed composition must pass through so that execution remains safely admitted, isolated, invoked, fenced, activated and recoverable.

Standing responsibility corridor:

\`verify/admit → isolate/transport → enforce egress/authority fence → invoke → contain lifecycle → atomically activate/replace → recover/fail closed\`

K0 membership is determined by **universal non-bypassability plus domain-neutrality**, not by code location, product importance, or whether a mechanism currently resides under \`host/src\`.

The current Ω host is an implementation witness. Whole-host ownership is not implied.

## OWNS

### 1. Admission and integrity
- signed Recipe admission;
- trust-root verification required to admit a composition;
- manifest identity/signature verification required for admitted entries;
- integrity verification of execution content;
- fail-closed refusal of unverifiable admission;
- the minimum containment relation necessary to ensure the admitted executable target belongs to the admitted integrity boundary, once proven by evidence.

### 2. Compartment and Port transport
- the generic execution compartment boundary;
- governed Port transport between host and guest;
- the lifecycle-safe creation/start/ready/stop/crash boundary;
- the minimum runtime transport mechanics needed to prevent guest execution from bypassing the governed host path.

Worker/thread isolation is owned only as the current proven mechanism. No stronger OS/process isolation claim is implied.

### 3. Capability egress and runtime fencing
- host-side enforcement of structurally granted capability use;
- token validity, ownership and scope checks;
- revocation/fencing mechanics;
- call-lifetime generation/fencing primitives only where a universal runtime invariant proves them necessary.

CFA-10 enforces the structural boundary; capability semantics remain with CFA-06.

### 4. Generic Authority-gate enforcement
- mechanical enforcement that required consequential effects pass the configured Authority gate;
- fail-closed runtime refusal when the gate denies or cannot be established;
- generic transport of the gate result into invocation control.

CFA-10 does not decide what permission, consent, standing, delegation, scope, risk or authorization means.

### 5. Atomic activation and fail-closed recovery
- verification-before-activation;
- atomic replacement/durability boundaries;
- preservation of known-good state during invalid replacement;
- fail-closed behavior for corrupt/unverifiable active state;
- runtime fencing required during replacement/recovery where a universal runtime invariant demands it.

### 6. Generic lifecycle containment
- generic create/start/ready/stop/degraded/crashed/recovered state transitions required to contain admitted execution;
- safe termination/fencing mechanics;
- recovery mechanics that expose runtime facts without becoming Work, Outcome or semantic reconciliation.

### 7. Minimum crypto/canonical/platform primitives
Only crypto, canonicalization, hashing, atomicity and owner-scoped platform primitives that are **proven necessary** for the above invariants are CFA-10 candidates.

Reduction is mandatory; convenience is not constitutional authority.

## CONTRIBUTES

CFA-10 contributes mechanically bounded runtime facts and enforcement surfaces to neighboring domains:

| Peer | CFA-10 contribution | Boundary retained by peer |
|---|---|---|
| CFA-01 World | generic execution/reference envelope where needed | World meaning, ontology, identity, context and truth |
| CFA-02 Data (PROVISIONAL) | generic atomicity/integrity primitive where proven necessary | canonical identity, persistence, revisions, lineage, reconstruction |
| CFA-03 Semantic | safe transport/reference envelope | language, grounding, Intent/Plan meaning, semantic continuity |
| CFA-04 Authority | mechanical gate/fence and refusal enforcement | authorization, consent, standing, delegation, scope, duration, revocation semantics |
| CFA-05 Work | safe invocation, lifecycle, termination and runtime recovery facts | Work, Plan snapshots, Attempts, scheduling, retries, Outcome, effect reconciliation |
| CFA-06 Capability | structural token/egress enforcement and fencing | Capability, Provider, Account, Model, Realization, Session, Resource and routing semantics |
| CFA-07 Composition | admission/integrity/isolation/activation substrate | composition identity, membership, plugin/Forge semantics and candidate structure |
| CFA-08 Experience | generic lifecycle/status facts needed for truthful projection | presentation, interaction, projection, navigation and re-entry |
| CFA-09 Evolution | activation/fencing/atomic recovery mechanics and runtime facts | Change, compatibility, migration, promotion, rollback, quarantine and self-maintenance semantics |

## CONSULTS

CFA-10 consults, rather than absorbs, peer-owned decisions where runtime enforcement depends on their semantics.

### CFA-04 — Authority / Governance
Consult for:
- which effects require an Authority gate;
- live authorization/re-authorization semantics;
- refusal conditions;
- authority lifetime and revocation implications.

CFA-10 must mechanically enforce the resulting gate; it must not interpret the policy.

### CFA-05 — Agency / Work / Execution
Consult for:
- the safe invocation boundary;
- Attempt/Work identity needed for runtime attribution;
- termination/replacement handoff;
- external-effect uncertainty.

CFA-10 must not turn runtime success/failure into Work Outcome.

### CFA-06 — Capability / Provider / Realization
Consult for:
- capability identity and scope semantics;
- realization/session references;
- generation semantics when call-lifetime pinning is required;
- provider-specific realization evidence.

CFA-10 must not become a provider or routing authority.

### CFA-07 — Composition / Plugin / Forge
Consult for:
- Manifest / CompositionSpec / Recipe distinctions;
- admitted implementation identity;
- composition membership and candidate/admitted/active semantics;
- replacement handoff.

CFA-10 provides the admission membrane; Forge does not receive a privileged runtime route.

### CFA-09 — Evolution / Compatibility / Self-Maintenance
Consult for:
- replacement and rollback conditions;
- compatibility-triggered activation/fencing requirements;
- migration/recovery handoff;
- change evidence relevant to runtime activation.

CFA-10 implements only the runtime mechanics required to enforce those boundaries.

### CFA-02 — Data / Identity / Persistence
Consult for:
- whether a durability/integrity primitive is truly constitutional;
- the physical runtime-to-canonical-data join.

CFA-02 remains explicitly **PROVISIONAL** and no claim of ratification is made here.

## OUT-OF-SCOPE

The following are not owned by CFA-10 merely because the current host or tooling may implement them:

- World / Ontology / Context meaning;
- canonical Data identity, persistence, revisions and reconstruction;
- semantic Intent / Plan meaning or language interpretation;
- Authority policy semantics;
- Capability / Provider / Account / Model / Realization / Session / Resource meaning;
- routing and candidate selection;
- Work lifecycle, scheduling policy, Attempts, Outcome or external-effect reconciliation;
- Composition identity/membership semantics;
- Forge authoring/candidate generation/promotion meaning;
- Surface / Canvas / Workspace / presentation / interaction semantics;
- Change / compatibility / migration semantics;
- generic architecture graph ownership;
- product CLI or authoring flow;
- broad analytics/projections;
- full StateArbitrator;
- full capability graph;
- full AuditLog/history store;
- full generation registry/range resolver;
- worker-pool optimization;
- product orchestration or queueing policy;
- vault UX, credential UX or product storage setup;
- any second ontology, identity registry, authority store, data store, evidence system or communication system;
- OS/process sandboxing unless a future threat-model decision and falsifying experiment establish it as required.

## Primary Seams

### S1 — Authority ↔ Runtime
**Classification: RECONCILED AT BASELINE LEVEL**

CFA-04 owns the semantic authorization decision.

CFA-10 owns:
\`required gate result → mechanical allow/refuse/fence\`

Invariant:
**A consequential effect that requires live Authority cannot reach governed invocation by bypassing the Authority gate.**

Unresolved:
- exact future Authority Trace/runtime evidence join;
- multi-step/batched authorization details remain CFA-04/CFA-05 work.

### S2 — Work ↔ Runtime
**Classification: RECONCILED AT BASELINE LEVEL**

CFA-05 owns Work/Attempt/Outcome semantics.

CFA-10 owns:
- safe invocation;
- worker lifecycle;
- termination and fencing;
- generic runtime recovery facts.

Invariant:
**Runtime lifecycle failure cannot be silently converted into Work success or semantic Outcome.**

Unresolved:
- active Work replacement and external-effect reconciliation remain evidence-dependent;
- exact Work↔Runtime event/reference envelope is not yet fully closed.

### S3 — Capability ↔ Runtime
**Classification: RECONCILED AT BASELINE LEVEL**

CFA-06 owns capability and realization meaning.

CFA-10 owns:
- structural token validation;
- ownership/scope checks;
- revocation/fencing;
- mechanical dispatch gating.

Invariant:
**A guest invocation cannot reach a governed capability route with an unknown, foreign, out-of-scope or revoked authorization token.**

Unresolved:
- exact minimum call-lifetime generation representation;
- realization-specific evidence remains outside K0.

### S4 — Composition ↔ Runtime
**Classification: BASELINE ALIGNED; B1 REMAINS UNDERPROVEN**

CFA-07 owns Composition/Plugin/Forge semantics.

CFA-10 owns:
- admission;
- integrity;
- isolation;
- activation enforcement.

Invariant:
**Only a composition that is mechanically admitted and integrity-verifiable may enter governed execution.**

Critical open B1 issue:
- executable-entry containment and verify→execute byte binding remain underproven;
- source-root symlink containment is also not yet proven in the actual Ω host.

The current \`vivim.law\` boot-phase rule remains an Ω-law fact, not a CFA-10-created privilege.

### S5 — Evolution ↔ Runtime
**Classification: RECONCILED AT BASELINE LEVEL**

CFA-09 owns change semantics and compatibility.

CFA-10 owns:
- admission of the replacement implementation;
- fencing of runtime execution;
- atomic activation;
- fail-closed recovery.

Invariant:
**An invalid replacement cannot become active merely because a change has been proposed, and a retired/fenced generation cannot remain callable through the governed runtime path.**

Unresolved:
- full active-Work replacement proof;
- exact compatibility-to-runtime transition envelope.

### S6 — Experience ↔ Runtime
**Classification: RECONCILED AT BASELINE LEVEL**

CFA-08 owns projection and presentation.

CFA-10 contributes only generic runtime facts such as:
- booting;
- ready;
- active;
- degraded;
- stopped;
- refused/recovery facts where already available.

Invariant:
**Runtime status is a factual input to presentation, not a second presentation or semantic truth.**

Unresolved:
- exact final stale/refused/degraded projection contract remains CFA-08-owned.

### S7 — Data ↔ Runtime
**Classification: PROVISIONAL / UNKNOWN**

CFA-02 retains canonical persistence, identity and revision ownership.

CFA-10 may retain atomicity/integrity mechanics only where a universal runtime invariant proves they cannot be delegated.

Invariant:
**The runtime must not depend on a second canonical persistence authority to enforce activation or fencing.**

Unresolved:
- exact runtime-to-canonical-data durability join;
- which persistence guarantees, if any, are genuinely K0 rather than Data-owned.

## Crosses the Boundary

CFA-10 crosses into a peer boundary only through an explicit typed mechanical handoff:

- **Authority:** gate result / refusal / re-resolution trigger;
- **Work:** invocation, lifecycle, termination and runtime facts;
- **Capability:** structural token/egress/fencing checks;
- **Composition:** admitted implementation reference, integrity result and activation state;
- **Evolution:** activation/fencing/recovery mechanics and facts;
- **Experience:** generic runtime lifecycle/status projection facts;
- **Data:** only proven generic atomicity/integrity primitives.

The handoff is a boundary crossing, not a transfer of semantic ownership.

## Must Not Cross

CFA-10 must not cross into:

- deciding what a user intends;
- deciding what an entity or World state means;
- deciding whether a person is authorized in semantic terms;
- selecting a Provider or Model based on product policy;
- defining Work completion or external truth;
- declaring a composition candidate semantically valid;
- choosing compatibility policy;
- making a UI projection canonical;
- promoting implementation location into architecture authority;
- creating a universal identity/ownership registry;
- creating a second authority/data/evidence/ontology store;
- changing Ω law without the established constitutional process.

## Inputs Required

Minimum inputs to CFA-10:

1. A mechanically well-formed Recipe/admission object.
2. Trusted root material required to verify admission.
3. Manifest/integrity material required for execution admission.
4. Composition/implementation references sufficient to determine what is proposed for activation.
5. Authority-gate requirement/result where the governed action requires it.
6. Structural capability grant/token facts needed for egress enforcement.
7. Runtime lifecycle inputs such as start, stop, replace and recover requests from owning domains.
8. Change/replacement facts required to apply runtime fencing or atomic activation.
9. Canonical durability guarantees from CFA-02 only where proven applicable.

CFA-10 does not require semantic domain payloads merely to enforce its mechanical invariants.

## Outputs Provided

CFA-10 provides:

- admission/refusal result;
- integrity verification result;
- compartment/lifecycle state;
- structural capability-gate result;
- fencing/revocation result;
- Authority-gate enforcement result;
- activation/recovery result;
- generic termination/crash/degraded facts;
- runtime evidence references sufficient for owning peers to interpret their own semantics.

Outputs are facts/enforcement outcomes, not semantic ownership.

## Invariants

### Constitutional
1. **No admitted execution without valid admission/integrity.**
2. **No governed guest execution outside the required compartment/Port path.**
3. **No governed capability dispatch without independent structural enforcement.**
4. **No required consequential invocation without the configured Authority gate.**
5. **No invalid replacement becomes active.**
6. **No fenced/dead runtime generation remains callable through the governed path.**
7. **No runtime recovery path bypasses admission or integrity checks.**
8. **No K0 mechanism is retained solely because it is convenient, product-important or currently located in \`host/src\`.**

### Anti-collapse
9. **runtime enforcement != semantic policy**
10. **evidence != authority**
11. **capability != permission**
12. **candidate != admitted != active**
13. **surface != canonical truth**
14. **historical implementation != current authority**
15. **unknown != failure**
16. **CFA-02 provisional evidence != ratified Data authority**

## Evidence and Freshness

**Declaration baseline:** current \`main\` at the time of this Wave-1 verification: \`7393339c9cfd3e0df2ed145f0d4c2eda3cbd323f\`.

### CURRENT / OWNER-ALIGNED
- CFA-10 \`CORE-AGENT.md\` and \`OWNER-ALIGNMENT-2026-09-27.md\`.
- CFA-05–10 Boundary Baseline & Reconciliation protocol.
- CFA-01–04 Round-2 Completion Audit.
- CFA-10 strategic roadmap and M1 K0 evidence/falsifier matrix.
- Current destination K0/B1 evidence and runtime source.
- Current peer owner-alignments for CFA-04 through CFA-09.

### CURRENT / EXPERIMENTAL
- CFA-10 B1 containment/byte-binding experiment: primitive-level evidence confirms relative traversal escape, source-root symlink following in the reproduced walker, and verify→execute byte substitution risk; the real Ω-host target-runtime replay remains unexecuted in the hosted environment.
- Therefore B1 is **not** promoted to PROVEN by this declaration.

### FRESHNESS RULE

This declaration is a boundary baseline, not a substitute for later evidence. A seam becomes eligible for later reconciliation only when:
- its owner-side contract is current;
- its evidence has an attributable commit/source;
- stale or historical material is labeled as such;
- unresolved questions remain explicit.

## Falsifiers

### F-10.1 Admission bypass
Remove or bypass a required admission/integrity check and demonstrate an unverifiable composition executing.

**Expected:** no execution; refusal before governed spawn/dispatch.

### F-10.2 Compartment bypass
Route guest behavior around the governed Worker/Port path.

**Expected:** impossible under the enforced runtime route; stronger isolation claims require separate evidence.

### F-10.3 Egress bypass
Present a forged, foreign, wrong-scope or revoked token.

**Expected:** structural refusal before governed dispatch.

### F-10.4 Authority bypass
Invoke a consequential operation that requires Authority without a live allowed gate result.

**Expected:** refusal/fence.

### F-10.5 Atomic activation bypass
Inject corrupt/unverified replacement state between validation and activation.

**Expected:** invalid state never becomes active; known-good recovery or fail-closed refusal.

### F-10.6 Lifecycle bypass
Attempt invocation after stop/crash/fence.

**Expected:** governed route refuses or remains fenced.

### F-10.7 B1 executable-entry containment
Use traversal, out-of-tree, root-symlink, entry-symlink or non-file targets.

**Expected:** deterministic refusal before governed Worker execution.

### F-10.8 B1 byte-binding
Verify bytes A, mutate/replace the execution path with bytes B, then launch.

**Expected:** execution is impossible for B; either exact A bytes are executed by a proved binding mechanism or the launch is refused.

### F-10.9 Peer-semantic leakage
Make a runtime invariant require knowledge of Work meaning, Provider policy, Authority semantics, Composition meaning or Surface state.

**Expected:** the invariant is rejected as a K0 design unless it is reduced to a domain-neutral mechanical fact.

### F-10.10 First-party bypass
Allow a first-party/system plugin to bypass a boundary that applies to an ordinary governed plugin without an explicit constitutional rule.

**Expected:** refusal or explicit escalation; first-party status is not an undocumented trust class.

## UNKNOWN / CONFLICTED / DEFERRED

### UNKNOWN
- exact production B1 executable-entry containment primitive;
- exact verify→execute byte-binding mechanism;
- native Windows drive-letter/UNC behavior under supported Bun runtime;
- exact regular-file/non-file target refusal semantics;
- exact manifest-root/source-root containment proof in the full Ω host;
- minimum State primitive;
- minimum Graph implementation lookup;
- minimum Grant provenance/integrity representation;
- minimum Generation call-lifetime pin;
- exact owner-scoped platform seam;
- OS/process containment requirement under the final extension threat model;
- exact active Work replacement/fencing proof;
- exact CFA-02 runtime↔canonical durability join;
- final K0 reduction after safe extraction.

### CONFLICTED
No direct peer ownership conflict is established by this baseline.

There is one design tension, not a settled conflict:
- current Ω law designates \`vivim.law\` as bootPhase 0;
- a generic signed bootstrap role remains a possible future reduction direction.

This declaration does not resolve or alter that constitutional rule.

### DEFERRED
- shared-boundary activation;
- Ω-law amendment;
- production K0 restructuring;
- Graph Kernel / Source-Code Graph attachment;
- zero-plugin boot implementation;
- hostile-plugin OS containment;
- State/Graph/Grant/Generation promotion;
- active Work replacement implementation;
- Commons signed birth test in the hosted session.

## Handoff Proposals

### H1 — Authority gate
\`CFA-04 → CFA-10:\` provide the canonical gate result and required live re-resolution trigger.

\`CFA-10 → CFA-04:\` provide only mechanical allow/refuse/fence facts and runtime evidence references.

### H2 — Work invocation/lifecycle
\`CFA-05 → CFA-10:\` provide the governed invocation/lifecycle request and Work/Attempt reference required for attribution.

\`CFA-10 → CFA-05:\` provide runtime lifecycle, termination, fencing and recovery facts.

### H3 — Capability egress
\`CFA-06 → CFA-10:\` provide structural capability/token facts.

\`CFA-10 → CFA-06:\` provide allow/refuse/fence and revocation facts.

### H4 — Composition admission
\`CFA-07 → CFA-10:\` provide the composition/admitted implementation object.

\`CFA-10 → CFA-07:\` provide admission/integrity/activation outcomes without redefining composition semantics.

### H5 — Evolution replacement
\`CFA-09 → CFA-10:\` provide replacement/change activation conditions.

\`CFA-10 → CFA-09:\` provide mechanical admission/fencing/activation/recovery facts.

### H6 — Experience projection
\`CFA-10 → CFA-08:\` provide only generic runtime state/status facts necessary for truthful projection.

### H7 — Data durability
\`CFA-02 → CFA-10:\` provide canonical-data durability guarantees only where ratified/proven and applicable.

No handoff proposal itself activates a shared boundary.

## Non-Authority Statement

CFA-10 is **not** an authority system.

It does not determine:
- what is permitted in semantic terms;
- what a user intends;
- what a Work outcome means;
- what a Provider/Capability means;
- what a Composition means;
- what a Change is semantically;
- what a World state means.

CFA-10 may enforce a configured gate and refuse execution when its mechanical conditions are not satisfied.

The existence of a runtime allow/refuse result is not itself semantic proof or authorization meaning.

## Evidence Index

1. \`AGENTS_CONTEXT/ARCHITECTURE_STEWARD/BOUNDARY-DESIGN-SYSTEM/CFA-05-10-BOUNDARY-BASELINE-AND-RECONCILIATION-2026-09-27.md\`
2. \`AGENTS_CONTEXT/ARCHITECTURE_STEWARD/BOUNDARY-DESIGN-SYSTEM/ROUND-2-COMPLETION-AUDIT-2026-09-27.md\`
3. \`AGENTS_CONTEXT/ARCHITECTURE_STEWARD/SUBAGENTS/RUNTIME-CONSTITUTION-CORE-SUBSTRATE/CORE-AGENT.md\`
4. \`AGENTS_CONTEXT/ARCHITECTURE_STEWARD/SUBAGENTS/RUNTIME-CONSTITUTION-CORE-SUBSTRATE/OWNER-ALIGNMENT-2026-09-27.md\`
5. \`AGENTS_CONTEXT/ARCHITECTURE_STEWARD/SUBAGENTS/RUNTIME-CONSTITUTION-CORE-SUBSTRATE/STATE.md\`
6. \`AGENTS_CONTEXT/ARCHITECTURE_STEWARD/SUBAGENTS/RUNTIME-CONSTITUTION-CORE-SUBSTRATE/DOMAIN-ROADMAP-2026-09-27.md\`
7. \`AGENTS_CONTEXT/ARCHITECTURE_STEWARD/SUBAGENTS/RUNTIME-CONSTITUTION-CORE-SUBSTRATE/M1-K0-EVIDENCE-FALSIFIER-MATRIX-2026-09-27.md\`
8. \`AGENTS_CONTEXT/ARCHITECTURE_STEWARD/SUBAGENTS/RUNTIME-CONSTITUTION-CORE-SUBSTRATE/EXPERIMENTS/B1-CONTAINMENT-BYTE-BINDING-EXPERIMENT-2026-09-27.md\`
9. \`docs/destination/core-vs-plugin-boundary/DESTINATION-RESPONSIBILITY-MATRIX.md\`
10. \`docs/destination/core-vs-plugin-boundary/EVIDENCE-INDEX.md\`
11. \`omega-baseline/omega-final/docs/decisions/CURRENT-INVARIANTS.md\`
12. \`omega-baseline/omega-final/host/src/recipe.ts\`
13. \`omega-baseline/omega-final/host/src/boot.ts\`
14. \`omega-baseline/omega-final/host/src/worker.ts\`
15. \`omega-baseline/omega-final/host/src/canon.ts\`
16. \`omega-baseline/omega-final/host/test/adversarial.test.ts\`

## Wave-1 Boundary Verdict

**BASELINE COMPLETE — CFA-10 remains ALIGNED / OWNER-RETAINED.**

The boundary is intentionally narrow:
- K0 owns universal runtime enforcement mechanics;
- peer CFAs retain semantic ownership;
- B1 remains explicitly UNDERPROVEN;
- CFA-02 remains explicitly PROVISIONAL;
- no shared boundary is activated;
- no Ω law is changed;
- no production implementation is authorized by this declaration.
