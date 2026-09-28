# First Major Upgrade — Governed Native Task Delegation

> Status: PROPOSED
> Upgrade: U1
> Date: 2026-09-28
> Substrate: OpenCode v1.18.4 on Windows
> Scope: one resident session autonomously creates bounded leaf workers through native Task

## 1. Purpose

The first major upgrade is deliberately smaller than the end-state resident team.

It proves one architectural fact:

> A durable-role-shaped resident can decide that it needs bounded capacity, request that capacity through OpenCode's native `Task` primitive, and receive a verifiable result without the Steward becoming a per-task scheduler.

This is the first transition from:

```
owner -> orchestrated swarm agents
```

toward:

```
owner -> resident -> native Task -> bounded worker
```

The vendored `opencode-swarm` remains available as the known-working fallback. U1 does not retire it.

## 2. Why this is the first upgrade

There are several larger pieces in the eventual resident system — persistent presence, peer Commons, recovery, ten-agent admission, deliberate mode, and surface continuity.

None of those should be built first.

U1 exercises the smallest path that contains the central architectural question:

```
LLM demand
   |
   v
policy authorization
   |
   v
native execution
   |
   v
durable evidence
```

If this path cannot be made reliable, the later resident mesh should not be built around it.

## 3. U1 boundary

### Included

- one primary/root;
- one durable-role-shaped resident;
- one registered leaf-worker profile;
- native OpenCode `Task`;
- exact caller/target binding;
- depth-two execution;
- deterministic spawn authorization;
- child/parent lineage;
- worker leafness;
- execution correlation;
- observable completion;
- durable proof receipt.

### Explicitly excluded

- resident-to-resident Commons delivery;
- ten-agent residency;
- dynamic resident creation;
- general task scheduling;
- custom child-session implementation;
- replacing the vendored swarm;
- arbitrary task-session resume;
- automatic consequential side effects based solely on peer messages;
- resource optimization beyond a small local cap.

## 4. Substrate facts that shape the design

OpenCode v1.18.4 has a native Task path that:

1. resolves the caller session;
2. checks subagent nesting depth;
3. asks the permission system for `task` against the requested `subagent_type`;
4. resolves the requested agent profile;
5. creates a child session with `parentID` equal to the caller session;
6. assigns the selected agent;
7. prompts the child.

The permission evaluator uses last-match wildcard semantics. The Task path therefore gives us a real execution primitive and a real target-specific permission boundary.

The same implementation also accepts an optional `task_id`. When present, it retrieves an existing session and can reuse that session rather than creating a fresh child. The v1.18.4 code does not prove that the existing session belongs to the requested target agent, the current parent, or the current team/work item.

That is a critical U1 boundary.

References:

- https://github.com/anomalyco/opencode/blob/v1.18.4/packages/opencode/src/tool/task.ts
- https://github.com/anomalyco/opencode/blob/v1.18.4/packages/core/src/v1/config/permission.ts
- https://github.com/anomalyco/opencode/blob/v1.18.4/packages/opencode/src/permission/index.ts

## 5. U1 invariants

### U1-I1 — Native execution

A worker is created only through native OpenCode `Task`.

The VIVIM plugin may authorize, reject, observe, and record. It does not create OpenCode child sessions itself.

### U1-I2 — Stable identity is external to the OpenCode session

```
agent_id != opencode_session_id
```

A session is an execution representation of a stable role, not the role's identity.

### U1-I3 — Authorization precedes consequential execution

The fact that a resident's model emitted a Task call is not authority.

The plugin/runtime must evaluate the delegation boundary before the native Task operation proceeds.

### U1-I4 — Target specificity

The allowed target is part of authorization.

```
resident -> research-worker
```

does not imply:

```
resident -> arbitrary-agent
```

### U1-I5 — Fresh creation is different from resume

U1's initial worker creation path does not accept `task_id`.

Resume becomes a separate experiment only after session ownership, identity, parentage, team/work-item binding, directory, and active-incarnation checks are designed and proven.

### U1-I6 — No background execution in U1

U1 uses foreground Task execution only. The experimental `background=true` path is excluded until asynchronous completion, notification, and permission behavior are separately qualified.

### U1-I7 — Parentage is evidence

A successful worker must be observable as a real child of the requesting resident session.

A result that merely names a child is not proof.

### U1-I8 — Leafness is mechanical

The worker must have no effective Task permission.

The configuration is defense in depth, not the sole proof. The runtime must observe the effective child binding.

### U1-I9 — One invocation has one correlation identity

Every governed spawn attempt receives a unique `spawn_id`.

Retries of an HTTP/runtime operation do not create a new logical spawn unless a new `spawn_id` is deliberately issued.

### U1-I10 — Failure is explicit

The system distinguishes at least:

```
AUTHORIZED
REFUSED
CREATION_FAILED
RUNNING
COMPLETED
FAILED
TIMED_OUT
UNKNOWN
RECOVERY_REQUIRED
```

Unknown is not completed.

### U1-I11 — Evidence survives completion

After a worker disappears or its session is later archived, the spawn lineage remains reconstructable from the durable receipt.

## 6. Proposed governed spawn record

This is a design object, not yet an Ω canonical object.

```ts
type GovernedSpawnAttempt = {
  spawnId: string
  teamSessionId: string
  workItemId: string
  caller: {
    agentId: string
    sessionId: string
    runtimeEpoch: string
  }
  target: {
    agentId: string
    sessionId: string | null
    kind: "LEAF"
  }
  request: {
    description: string
    promptDigest: string
  }
  authorization: {
    decision: "ALLOW" | "DENY"
    reason: string
    policyRevision: string
  }
  lifecycle:
    | "INTENDED"
    | "AUTHORIZED"
    | "REFUSED"
    | "CREATED"
    | "RUNNING"
    | "COMPLETED"
    | "FAILED"
    | "TIMED_OUT"
    | "UNKNOWN"
    | "RECOVERY_REQUIRED"
  createdAt: string
  updatedAt: string
}
```

The authoritative meaning of this record remains operational/evidentiary until Ω governance explicitly ratifies a canonical form.

## 7. Spawn authorization algorithm

Before native Task executes, the VIVIM plugin should evaluate:

1. **caller binding**
   - caller session maps to exactly one active stable agent;
   - caller runtime epoch is current;
   - caller is the expected resident role.

2. **target binding**
   - requested `subagent_type` is a registered leaf profile;
   - the target is not a resident/CFA;
   - target is not the caller;
   - target is not the Steward.

3. **delegation scope**
   - caller is permitted to spawn this exact target;
   - the applicable rule set is compiled/recorded with rule order intact, because OpenCode permission evaluation uses last-match wildcard semantics;
   - requested depth remains within the experiment boundary;
   - current work item has not exceeded child-count limits.

4. **resume safety**
   - U1 fresh creation requires no `task_id`;
   - any future resume attempt is denied unless its existing session is positively bound to the same governed lineage.

5. **runtime admission**
   - global experiment concurrency ceiling is not exceeded.

6. **correlation**
   - no existing active attempt uses the same `spawn_id`.

Only after all checks pass should native Task proceed.

## 8. Why plugin gating belongs before native Task

In OpenCode v1.18.4, the generic tool execution path invokes the plugin's `tool.execute.before` hook before the Task implementation performs its native permission check.

The plugin hook therefore has a useful position:

```
model Task call
    |
    v
VIVIM preflight gate
    |
    +-- deny -> no native Task
    |
    v
native OpenCode Task permission check
    |
    v
child creation
```

The VIVIM gate is therefore not a replacement for OpenCode permissions.

It is an additional, narrower policy boundary that can enforce stable identity, work-item scope, correlation, and lineage properties that native Task does not model.

The first implementation should exploit this position while keeping the plugin small.

## 9. Defense in depth

U1 deliberately uses several independent controls.

### Layer A — agent configuration

- root allows resident target class;
- resident allows exact worker class;
- worker has Task denied.

### Layer B — native OpenCode

- `permission.task` evaluates the requested target;
- `subagent_depth: 2` bounds hierarchy depth.

### Layer C — VIVIM plugin

- validates stable identity;
- validates target catalog;
- rejects unsafe `task_id` use;
- enforces active-child/work-item limits;
- creates spawn correlation;
- records denial/allow decisions.

### Layer D — execution-surface closure

- worker has no Task permission;
- worker has no shell capability that can launch OpenCode/swarm;
- worker has no agent-control MCP/tool capability;
- worker cannot create a second execution surface outside the governed path.

### Layer E — evidence

- verify actual child session;
- verify `parentID`;
- verify child agent;
- verify effective permission;
- verify completion;
- persist receipt.

No single layer should be considered sufficient.

## 10. The task_id trap

The native `task_id` option is valuable later for resumable work but is dangerous during U1.

The failure pattern is:

```
resident A
   |
   | Task(target = worker-A, task_id = session-of-worker-B)
   v
existing session B is reused
   |
   +-- requested target and stored session identity diverge
```

That can produce:

- wrong worker identity;
- wrong lineage;
- wrong permissions;
- wrong work context;
- duplicated or cross-owned execution.

Therefore:

> **No task_id in U1 fresh-spawn calls.**

A later resume upgrade must require a positive binding proof equivalent to:

```
existingSession.agent == requestedTarget
existingSession.parentID == expectedParent
existingSession.directory == expectedDirectory
existingSession.teamSessionId == expectedTeam
existingSession.spawnId == expectedSpawn
existingSession.runtimeEpoch is valid
existingSession is not concurrently owned
```

Only then should resume be reintroduced.

An August 2026 OpenCode report also documents a class of resume-path permission inconsistency where switching `subagent_type` on an existing task session left the prior session-level permissions in place. That report is later than v1.18.4 and is not proof of v1.18.4 behavior, but it reinforces treating resume as a separate qualification problem:

https://github.com/anomalyco/opencode/issues/41681

## 11. Model-visible capability is not authorization

A later OpenCode issue reported that the Task tool schema could advertise agents outside an active `permission.task` allow-list.

Therefore U1 must distinguish:

```
advertised target
!=
authorized target
```

The proof must exercise an actual denied invocation, not merely inspect the model's tool schema.

Reference:

https://github.com/anomalyco/opencode/issues/33334

## 12. Worker result semantics

The parent receives a Task result, but U1 must not treat the returned text as proof by itself.

A completion should contain at least:

```
spawn_id
parent_session_id
child_session_id
child_agent_id
status
result_reference
observed_at
```

Where possible, the result should point to a repository-visible artifact or other durable evidence.

The worker may say "done." The runtime proves whether the expected child execution existed and whether the expected artifact exists.

## 13. Concurrency model

U1 does not build a scheduler.

It does need a minimal admission guard.

Suggested initial bounds:

```
max_active_children_per_resident = 2
max_children_per_work_item = 2
max_task_depth = 2
max_total_experimental_children = 2
```

These values are experimental, not architectural law.

The purpose is to prevent accidental fan-out while proving semantics.

The resident decides whether it needs one or two workers. The runtime only refuses when the declared bound is exceeded.

## 14. Failure matrix

### Permission refusal

Expected:

- explicit refusal;
- no child;
- durable denial receipt.

### Unknown target

Expected:

- no child;
- explicit target-not-registered result.

### Wrong-role target

Example: resident requests another resident.

Expected:

- plugin refusal;
- no child.

### Unsafe task_id

Expected:

- plugin refusal before native Task;
- reason names resume not yet qualified.

### Duplicate spawn_id

Expected:

- second attempt rejected or reconciled to the existing attempt;
- no second child.

### Native Task creation failure

Expected:

- attempt becomes CREATION_FAILED/FAILED;
- no false child result.

### Child session exists but no observed execution

Expected:

- state remains UNKNOWN/RECOVERY_REQUIRED;
- not completed.

### Worker attempts Task

Expected:

- native permission refusal;
- plugin evidence of the attempt;
- no grandchild.

### Parent exits unexpectedly

Expected:

- child lineage remains durable;
- parent attempt becomes recoverable/unknown;
- no silent orphan adoption.

## 15. U1 proof sequence

U1 should be proven in increasing strength.

### U1-A — positive permission

```
root -> resident
```

Prove exact target authorization.

### U1-B — resident creates one worker

```
root -> resident -> worker
```

Prove real native child creation and parentage.

### U1-C — resident chooses capacity

Give the resident two genuinely separable subtasks and allow it to choose one or two workers.

The runtime must not tell it the worker count in advance.

### U1-D — negative target

Resident attempts a disallowed target.

Prove no child is created.

### U1-E — worker leafness

Worker attempts to create another Task child.

Prove deterministic refusal and no grandchild.

### U1-F — duplicate/retry

Replay the same logical spawn request or interrupt the observer around creation.

Prove that a retry does not silently create an unintended second logical child.

### U1-G — resume trap

Attempt `task_id` against an unrelated existing session.

Prove refusal.

This is required before any resume feature is admitted.

## 16. Promotion rule

U1 is promoted only when the evidence shows:

1. native Task is the actual execution primitive;
2. resident autonomy selected the worker demand;
3. the VIVIM gate prevented unauthorized targets;
4. worker leafness was mechanically enforced, including alternate spawn-surface closure;
5. no unsafe resume path is used;
6. U1 did not rely on background Task execution;
7. parent/child lineage is observable;
8. duplicate attempts do not create ambiguous lineage;
9. completion is based on observed state, not model assertion.

Until then, the installed `opencode-swarm` substrate remains a valid fallback.

## 17. What U1 unlocks

Only after U1 is proven should the design move to:

```
U2 — resident-owned bounded worker pool
U3 — durable lineage/evidence
U4 — direct resident-to-resident Commons
U5 — multi-resident lifecycle/recovery
U6 — ten-resident admission
U7 — Ω-native governance
```

U1 is therefore a capability proof, not the final resident runtime.
