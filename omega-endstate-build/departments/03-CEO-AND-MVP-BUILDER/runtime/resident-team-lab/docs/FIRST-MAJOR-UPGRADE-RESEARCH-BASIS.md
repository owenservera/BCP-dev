# U1 Research Basis — OpenCode v1.18.4

> Status: RESEARCH BASIS
> Date: 2026-09-28
> Purpose: preserve the evidence behind U1 design decisions
> Installed target: OpenCode v1.18.4 on Windows

## Evidence classes

- **SOURCE-EXACT** — directly inspected in the OpenCode v1.18.4 source.
- **EXTERNAL-CORROBORATION** — later public issue/report that demonstrates a related failure class but is not evidence of the installed v1.18.4 behavior unless explicitly stated.
- **DESIGN-CONCLUSION** — a VIVIM response derived from the evidence.
- **LIVE-PROOF-REQUIRED** — must still be exercised on the user's machine.

Do not collapse these classes.

## 1. Native Task authorization exists and is target-specific

**Evidence:** SOURCE-EXACT.

In v1.18.4, the native Task tool:

- calculates the caller's session depth;
- refuses when the configured `subagent_depth` is reached;
- calls the permission system with `permission: task`;
- supplies the requested `subagent_type` as the permission pattern;
- resolves the target agent profile;
- creates a child session with `parentID` equal to the caller session;
- assigns the resolved agent to the new session.

Sources:

- https://github.com/anomalyco/opencode/blob/v1.18.4/packages/opencode/src/tool/task.ts
- https://github.com/anomalyco/opencode/blob/v1.18.4/packages/opencode/src/session/session.ts

**Design conclusion:** Native Task is a credible execution primitive for U1.

**Live-proof required:** CP-01 and CP-02 must still exercise the installed binary/configuration.

## 2. v1.18.4 permission matching is ordered wildcard evaluation

**Evidence:** SOURCE-EXACT.

The v1.18.4 permission evaluator searches the active rulesets and takes the last matching rule. Matching considers both permission name and target pattern.

Sources:

- https://github.com/anomalyco/opencode/blob/v1.18.4/packages/opencode/src/permission/index.ts
- https://github.com/anomalyco/opencode/blob/v1.18.4/packages/core/src/v1/config/permission.ts

**Design conclusion:** U1 must preserve rule ordering in its test evidence and must never reason from an unordered set of policy rules.

## 3. The plugin can sit before Task's native permission check

**Evidence:** SOURCE-EXACT.

The v1.18.4 generic session-tool execution path calls the plugin's `tool.execute.before` hook before executing the registered tool implementation. The Task implementation then performs its own `ctx.ask({ permission: task, ... })`.

The plugin trigger path propagates hook failure to the tool execution path.

Sources:

- https://github.com/anomalyco/opencode/blob/v1.18.4/packages/opencode/src/session/tools.ts
- https://github.com/anomalyco/opencode/blob/v1.18.4/packages/opencode/src/plugin/index.ts
- https://github.com/anomalyco/opencode/blob/v1.18.4/packages/opencode/src/tool/task.ts

**Design conclusion:** U1 can use the plugin as a narrower deterministic preflight gate rather than replacing OpenCode's own Task permissions.

**Live-proof required:** CP-03 must prove that a thrown preflight denial produces no child session.

## 4. Task resume is materially different from fresh creation

**Evidence:** SOURCE-EXACT.

The v1.18.4 Task implementation accepts optional `task_id`. When present, it retrieves an existing session and may use that session rather than creating a new child.

The visible code path does not perform an explicit check that the reused session:

- has the requested target agent;
- has the current caller as parent;
- belongs to the same governed team/work item;
- has the expected directory/workspace;
- has the expected VIVIM runtime identity.

The child-session permission derivation is also only applied to a newly created session; the reused-session path retains the existing session object.

Source:

- https://github.com/anomalyco/opencode/blob/v1.18.4/packages/opencode/src/tool/task.ts

**Design conclusion:** U1 must ban `task_id` in fresh governed spawns.

**Live-proof required:** CP-07 must exercise an unrelated existing session and prove the VIVIM layer refuses unsafe reuse.

## 5. Session creation fixes the current directory/worktree context from the running instance

**Evidence:** SOURCE-EXACT.

The v1.18.4 `Session.create` operation takes the current `InstanceState.context` directory/worktree and constructs the session's stored directory/path from that context.

The native Task child creation call does not supply an arbitrary directory of its own; therefore U1 should regard the parent runtime context as part of worker binding and verify the child's stored location.

Source:

- https://github.com/anomalyco/opencode/blob/v1.18.4/packages/opencode/src/session/session.ts

**Design conclusion:** A governed worker binding includes directory/workspace identity even when U1 intentionally uses one controlled workspace.

## 6. Child permissions are derived differently for a new child than for a reused session

**Evidence:** SOURCE-EXACT.

The v1.18.4 Task path derives child session permission from:

- selected parent-session deny/external-directory rules;
- default Task/todowrite denies when the target agent has no explicit rule.

This derivation occurs during the new-session path.

Sources:

- https://github.com/anomalyco/opencode/blob/v1.18.4/packages/opencode/src/tool/task.ts
- https://github.com/anomalyco/opencode/blob/v1.18.4/packages/opencode/src/agent/subagent-permissions.ts

**Design conclusion:** U1 must verify effective child permissions after creation and must not assume that the target profile name alone proves the resulting session policy.

## 7. Tool hooks provide a real enforcement seam

**Evidence:** EXTERNAL-CORROBORATION plus SOURCE-EXACT for the installed architecture.

Current OpenCode plugin documentation explicitly demonstrates throwing from `tool.execute.before` to prevent a tool action, such as protecting `.env` files. This matches the v1.18.4 source path inspected above.

Source:

- https://opencode.ai/docs/plugins/

**Design conclusion:** Using a throwing preflight hook for U1 is aligned with OpenCode's plugin enforcement model.

The live lab still must prove the exact combined behavior of its plugin, config, and installed binary.

## 8. Later issue: Task schema can expose disallowed targets

**Evidence:** EXTERNAL-CORROBORATION.

OpenCode issue #33334, opened 2026-06-22 against v1.17.9, reports that the Task tool schema advertised subagent types outside the active `permission.task` allow-list.

Source:

- https://github.com/anomalyco/opencode/issues/33334

**Important limitation:** This is not proof that v1.18.4 has the same UI/schema behavior.

**Design conclusion:** U1 must test authorization by attempting the actual invocation. Model-visible Task choices are discovery, not authority.

## 9. Later issue: Task resume can retain prior session permissions

**Evidence:** EXTERNAL-CORROBORATION.

OpenCode issue #41681, opened 2026-08-11, reports that resuming a Task session with a different `subagent_type` can leave the existing child session carrying permissions derived for the previous subagent.

Source:

- https://github.com/anomalyco/opencode/issues/41681

**Important limitation:** The report targets later development and is not proof of v1.18.4.

**Design conclusion:** It independently reinforces the v1.18.4 source finding that arbitrary Task resume must be a separate qualification.

## 10. Later issue: nested subagents can stall on unanswered permissions

**Evidence:** EXTERNAL-CORROBORATION.

OpenCode issue #39112, opened 2026-07-27 against v1.18.7, reports a sub-sub-agent permission request that never reaches the human-facing permission handler and leaves the session stalled.

Source:

- https://github.com/anomalyco/opencode/issues/39112

**Important limitation:** v1.18.7 is later than the installed v1.18.4.

**Design conclusion:** U1 should avoid any required `ask` permission path in headless workers. Permission-prompt handling becomes a dedicated later gate.

## 11. Asynchronous Task/session paths remain later work

Public OpenCode reports have documented failures around asynchronous prompting and busy-session state in various releases.

These are useful for later resident wake/recovery design but are intentionally outside U1.

**Design conclusion:** U1 uses foreground Task execution only and does not claim asynchronous wake reliability.

## 12. Direct session creation is not equivalent to governed delegation

Current OpenCode documentation describes direct invocation of agents as distinct from Task permission.

Source:

- https://dev.opencode.ai/docs/agents/

**Design conclusion:** U1 only calls a session a governed worker when there is a valid U1 spawn authorization and observed Task lineage. An ordinary session with the same agent profile is not automatically a worker.

## 13. What is still unknown

The following remain LIVE-PROOF-REQUIRED:

1. the exact installed v1.18.4 behavior of the lab configuration;
2. whether the plugin is loaded in every intended child session under the Windows launch path;
3. the exact observable timing/order of Task/session events in the installed runtime;
4. whether concurrent Task calls can race the lab's admission mechanism;
5. the cleanest durable receipt mechanism under abrupt process termination;
6. whether any alternate local tooling path can create agents in the user's exact installed environment.

These must not be filled by assumption.

## 14. Research rule for future updates

```text
new version
    |
    +--> re-check exact Task source
    +--> re-check permission evaluator
    +--> re-check child permission derivation
    +--> re-check plugin hook order
    +--> re-run U1 live proofs
    |
    v
only then update the design dependency
```

A later public issue can trigger a new experiment, but it must not silently rewrite the installed-version evidence record.

## 15. U1 decision boundary

The current evidence supports this design hypothesis:

> **Use OpenCode native Task for execution, VIVIM plugin preflight for narrower delegation governance, explicit leaf profiles for bounded workers, and durable evidence for lineage.**

It does **not** yet support these claims:

- that the ten-agent resident runtime is operational;
- that arbitrary Task resume is safe;
- that background Task is reliable enough for residency;
- that native Task alone provides VIVIM authority semantics;
- that a process exit means successful work;
- that an agent profile name is equivalent to a durable VIVIM identity.