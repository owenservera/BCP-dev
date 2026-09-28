
# Resident-Team Research Anti-Pattern Catalog

> Status: ACTIVE
> Date: 2026-09-28
> Purpose: explicit failure patterns to detect before they become architecture

An anti-pattern is a recurring way of reasoning or structuring the system that makes failure likely, obscures evidence, or collapses distinctions Ω needs to preserve.

## Identity and runtime

### AP-01 — Session-as-identity
**Pattern:** Treat an OpenCode session ID, process, or worktree as the durable agent identity.
**Why dangerous:** Restart/replacement creates identity discontinuity or duplicate active incarnations.
**Counter-practice:** Stable identity + explicit runtime binding + incarnation/epoch.

### AP-02 — Name-equals-authority
**Pattern:** Trust a session because it has a recognized agent profile name.
**Why dangerous:** A profile describes configuration, not current authority or lineage.
**Counter-practice:** Bind decisions to identity, grant, work item, and evidence.

### AP-03 — Silent role drift
**Pattern:** A governed session changes agent, parent, workspace, or work meaning without invalidating its original binding.
**Why dangerous:** Actions continue under authority that no longer matches runtime state.
**Counter-practice:** Binding drift becomes RECOVERY_REQUIRED.

### AP-04 — Split-brain incarnation
**Pattern:** Two runtimes believe they are the active incarnation of one resident.
**Why dangerous:** Duplicate work, writes, messages, and ambiguous ownership.
**Counter-practice:** Active epoch/lease/fencing.

## Delegation and execution

### AP-05 — Boolean delegation
**Pattern:** A single Task allow/deny bit is treated as the complete spawn policy.
**Why dangerous:** It hides target rights, work scope, fan-out, expiration, and authority origin.
**Counter-practice:** Native permission + VIVIM grant + runtime admission.

### AP-06 — Permission-schema-as-authority
**Pattern:** Treat model-visible Task targets as the authorized set.
**Why dangerous:** Discoverability and enforcement are different surfaces.
**Counter-practice:** Actual invocation refusal is the proof.

### AP-07 — Depth-is-delegation
**Pattern:** Treat subagent depth as the complete delegation policy.
**Why dangerous:** Depth does not encode semantic target rights, work scope, or child count.
**Counter-practice:** Depth is one mechanical defense only.

### AP-08 — Task-denied-means-leaf
**Pattern:** Assume a worker is a true leaf because native Task is denied.
**Why dangerous:** Shell, CLI, MCP, or another control surface may create agents.
**Counter-practice:** Close or govern every agent-creation surface.

### AP-09 — Task-result-as-proof
**Pattern:** Treat returned Task text as proof of successful execution.
**Why dangerous:** Model output is not independent evidence.
**Counter-practice:** Observe child state and expected artifacts.

### AP-10 — Direct-session-adoption
**Pattern:** Silently adopt a manually created session as a governed worker.
**Why dangerous:** Bypasses delegation and lineage.
**Counter-practice:** Only explicit governed admission creates governed-worker status.

### AP-11 — Resume-as-new-spawn
**Pattern:** Treat task_id reuse as equivalent to fresh bounded child creation.
**Why dangerous:** Existing sessions carry prior parentage, permissions, context, and work.
**Counter-practice:** Qualify resume separately with positive ownership/lineage checks.

### AP-12 — Hidden scheduler
**Pattern:** The plugin gradually decides semantic task allocation, priority, or decomposition.
**Why dangerous:** Infrastructure becomes an opaque authority layer.
**Counter-practice:** Resident decides demand; policy authorizes; runtime admits.

## Work and coordination

### AP-13 — Session-tree-as-work-graph
**Pattern:** Treat OpenCode parent/child relationships as the canonical Work dependency graph.
**Why dangerous:** Execution lineage does not express all dependencies, ownership, review, or acceptance.
**Counter-practice:** Keep execution lineage and Work graph distinct.

### AP-14 — Completion-equals-acceptance
**Pattern:** Child completion automatically makes output trusted or dependency-unblocking.
**Why dangerous:** Execution success is not semantic correctness.
**Counter-practice:** COMPLETED and ACCEPTED remain separate states.

### AP-15 — Central-relay coordination
**Pattern:** Every resident must communicate through the Steward.
**Why dangerous:** Bottleneck; destroys direct peer autonomy.
**Counter-practice:** Direct resident-to-resident Commons, with Steward escalation for authority, conflict, sequencing, and reconciliation.

### AP-16 — Message-is-command
**Pattern:** A peer REQUEST/HANDOFF/PROPOSAL automatically authorizes consequential execution.
**Why dangerous:** Communication becomes an authority bypass.
**Counter-practice:** Message communicates; Work + Authority authorize execution.

### AP-17 — Global-transcript-everything
**Pattern:** Flatten every resident history into one central prompt.
**Why dangerous:** Context overload, stale instructions, privacy expansion, weak local attribution.
**Counter-practice:** Local context + compact causal evidence references.

### AP-18 — Attention-by-volume
**Pattern:** Message frequency or agent activity becomes implicit authority or urgency.
**Why dangerous:** Communication volume is mistaken for epistemic weight.
**Counter-practice:** Explicit message class, evidence, urgency, and authority semantics.

## Persistence and recovery

### AP-19 — Process-exit-as-success
**Pattern:** Zero exit code or completed promise is treated as proof of intended behavior.
**Why dangerous:** Artifacts may be missing or semantically wrong.
**Counter-practice:** Define success by observable evidence state.

### AP-20 — In-memory-lineage
**Pattern:** Parent/child correlation exists only in process memory.
**Why dangerous:** Observer restart destroys reconstruction.
**Counter-practice:** Durable spawn receipt.

### AP-21 — Retry-without-idempotency
**Pattern:** Ambiguous failure causes consequential action to be retried without reconciliation.
**Why dangerous:** Duplicate children, writes, or external effects.
**Counter-practice:** Stable correlation ID + durable state + reconciliation.

### AP-22 — Clock-dependent-replay
**Pattern:** Historical replay consults current wall-clock state.
**Why dangerous:** Same event history can yield different reconstructed state.
**Counter-practice:** Deterministic historical fold; current-time queries separate.

### AP-23 — Silent-recovery-adoption
**Pattern:** Orphan or replacement runtime is silently treated as the original active work.
**Why dangerous:** False continuity and duplicate side effects.
**Counter-practice:** Explicit LOST/RECOVERING boundary and re-admission.

## Self-evolution

### AP-24 — Live-self-mutation
**Pattern:** Production team changes its own constitution during consequential work.
**Why dangerous:** Behavior and evaluator change together; attribution becomes difficult.
**Counter-practice:** Candidate team in Forge -> held-out evaluation -> governed promotion.

### AP-25 — Train-on-the-failure
**Pattern:** The same experience that exposed a failure is the sole proof the repair works.
**Why dangerous:** Overfitting and false confidence.
**Counter-practice:** Independent holdout evaluation.

### AP-26 — Broadest-possible-fix
**Pattern:** Local failure triggers team-wide or constitutional change without necessity.
**Why dangerous:** Unnecessary blast radius.
**Counter-practice:** Classify smallest explanatory scope first.

### AP-27 — Evolution-without-rollback
**Pattern:** Promoted change has no parent version, evaluator, or reversal path.
**Why dangerous:** Improvement can become unrecoverable drift.
**Counter-practice:** Versioned promotion with rollback lineage.

### AP-28 — Score-equals-truth
**Pattern:** Benchmark or performance score alone decides validity.
**Why dangerous:** Security, sovereignty, authority, evidence, and identity may regress.
**Counter-practice:** Performance + constitutional/authority/evidence gates.

## Research and knowledge

### AP-29 — Publication-as-blueprint
**Pattern:** Import an external architecture wholesale because it appears successful.
**Why dangerous:** Experimental assumptions may not match Ω.
**Counter-practice:** Mechanism -> reason -> practice -> Ω translation -> experiment.

### AP-30 — Secondary-summary-dependence
**Pattern:** Adopt an idea from summaries without reading the primary artifact.
**Why dangerous:** Constraints and implementation differences disappear.
**Counter-practice:** Primary-source-first research.

### AP-31 — Source/runtime disagreement erased
**Pattern:** Conflicting source, repository, and live-runtime evidence is silently collapsed into one story.
**Why dangerous:** Future agents inherit false proof.
**Counter-practice:** Preserve disagreement, classify each observation, run a falsifier.

**Current instance:** The worker catalog says name-scoped Task gating is unavailable on OpenCode 1.18.4, while exact upstream v1.18.4 source shows wildcard target-pattern evaluation. This remains unresolved until installed runtime behavior is exercised.

### AP-32 — Research-memory-as-authority
**Pattern:** Research synthesis silently becomes implementation law.
**Why dangerous:** External evidence and ratified Ω authority become indistinguishable.
**Counter-practice:** Research produces candidates/hypotheses; explicit decisions produce authority.

## Observability

### AP-33 — Green-dashboard fallacy
**Pattern:** Runtime health is treated as semantic correctness.
**Why dangerous:** Liveness can be green while work is wrong.
**Counter-practice:** Separate liveness, execution, evidence, and acceptance.

### AP-34 — Event-order assumption
**Pattern:** Logic assumes asynchronous events arrive exactly once and in expected order.
**Why dangerous:** Delay, duplication, and reordering are normal failure modes.
**Counter-practice:** Correlation IDs + reconciliation from durable state.

### AP-35 — Happy-path-only proof
**Pattern:** Test only successful spawn and completion.
**Why dangerous:** Governance failures cluster around denial, retry, interruption, recovery, and ambiguity.
**Counter-practice:** Positive + negative + ambiguous + recovery tests for every critical capability.

## Current U1 priorities

1. AP-06 — Permission-schema-as-authority
2. AP-08 — Task-denied-means-leaf
3. AP-11 — Resume-as-new-spawn
4. AP-19 — Process-exit-as-success
5. AP-21 — Retry-without-idempotency
6. AP-31 — Source/runtime disagreement erased

These are the patterns most likely to create a false impression that resident delegation works when the actual authority/evidence boundary remains bypassable.


## Cross-domain organizational runtime anti-patterns

### AP-36 — Organizational-tree-equals-supervision-tree
**Pattern:** Use the functional organization hierarchy as the failure/restart hierarchy.
**Why dangerous:** A worker failure can unnecessarily kill unrelated functional capacity; organizational ownership and failure containment have different semantics.
**Counter-practice:** Separate organizational, execution, and supervision topologies.

### AP-37 — Desired-presence-equals-process
**Pattern:** Keep an always-running process alive merely so a resident can be called "persistent".
**Why dangerous:** Process lifetime consumes resources while adding little semantic value.
**Counter-practice:** Persist identity/subscription/state; activate computation only when needed.

### AP-38 — Event-equals-inference
**Pattern:** Every observed event launches a model turn.
**Why dangerous:** Burst activity creates inference storms and destroys attention economics.
**Counter-practice:** durable queues + deduplication + coalesced wake bundles + attention admission.

### AP-39 — Controller-equals-scheduler
**Pattern:** A reconciliation loop gradually acquires hidden task allocation and intellectual decomposition responsibilities.
**Why dangerous:** Infrastructure becomes an opaque decision-maker.
**Counter-practice:** reconcile declared desired state; leave semantic decomposition to the responsible resident.

### AP-40 — Activation-equals-identity
**Pattern:** Replacing an OpenCode session is interpreted as replacing the resident.
**Why dangerous:** Context maintenance becomes identity mutation and encourages eternal sessions.
**Counter-practice:** durable resident identity + explicit session incarnation/epoch.

### AP-41 — Capability-equals-roster-member
**Pattern:** Every reusable capability is represented by a permanent agent identity.
**Why dangerous:** Static populations inflate context, state, and supervision overhead.
**Counter-practice:** capability catalog -> temporary worker instance.

### AP-42 — Contract-as-prompt-only
**Pattern:** Scope, resource, time, and evidence limits exist only in natural-language instructions.
**Why dangerous:** They are not mechanically enforceable or auditable.
**Counter-practice:** represent worker contracts as explicit runtime data and enforce budgets at admission/execution.

### AP-43 — Background-as-secret-supervisor
**Pattern:** A background sentinel silently repairs protected state because it is always present.
**Why dangerous:** Persistent presence turns into an authority bypass.
**Counter-practice:** observation -> proposal/work request -> authorization -> consequential execution.

### AP-44 — Session-checkpoint-equals-memory
**Pattern:** A checkpoint merely stores the transcript snapshot.
**Why dangerous:** It preserves conversation but not necessarily the durable work state needed after session replacement.
**Counter-practice:** checkpoint explicit objective, state, evidence, ownership, dependencies, and next move.

### AP-45 — Restart-without-intensity-limit
**Pattern:** Repeated worker failure causes unlimited recreation.
**Why dangerous:** A systemic defect becomes an inference and side-effect loop.
**Counter-practice:** bounded restart intensity, backoff, escalation, and recovery-required states.

### AP-46 — Shared-blackboard-equals-shared-trust
**Pattern:** Anything written to the common state surface is treated as authoritative.
**Why dangerous:** observation, hypothesis, proposal, and accepted fact collapse.
**Counter-practice:** every durable item retains provenance/evidence/authority class.

### AP-47 — Global-context-for-coordination
**Pattern:** The simplest way to coordinate departments is to inject all departments' history into every activation.
**Why dangerous:** context pollution, stale assumptions, privacy expansion, and unnecessary token cost.
**Counter-practice:** relevance-selected context projections with explicit cross-department references.

### AP-48 — Background-starvation-by-foreground
**Pattern:** background maintenance has no bounded budget but can be perpetually displaced by user work.
**Why dangerous:** neglected maintenance eventually becomes an outage or evidence-integrity problem.
**Counter-practice:** explicit low-bandwidth reserved attention plus deadline/escalation semantics.
