# OpenCode Native Substrate

> Focus: how OpenCode v1.18.4 can host a resident -> worker execution path.

## 1. Agent model

OpenCode agents are configured execution identities with a mode, model/prompt configuration, and tool/permission surface.

For the V1 lab the relevant shape is:

`agent profile + permission rules + session`

The stable Ω identity must remain conceptually outside this.

The current official agent documentation also makes clear that agent-specific configuration can narrow or override global configuration.

Source:
https://opencode.ai/docs/agents

## 2. Native Task

The pinned v1.18.4 Task implementation performs, in sequence:

1. resolve the caller session;
2. walk the parent chain to calculate nesting depth;
3. enforce `subagent_depth`;
4. ask the permission system for `task` against the requested `subagent_type`;
5. resolve the requested agent profile;
6. optionally reuse an existing session when `task_id` is supplied;
7. otherwise create a child session with `parentID = caller session`;
8. derive child-session permissions;
9. prompt the child.

Exact source:
https://github.com/anomalyco/opencode/blob/v1.18.4/packages/opencode/src/tool/task.ts

### U1 consequence

The native Task path is a genuine execution primitive, not a simulation.

The U1 experiment should therefore wrap or observe this path instead of implementing a second child-session mechanism.

## 3. Permission model

V1 permission actions are:

- `allow`
- `ask`
- `deny`

The evaluator matches both permission name and target pattern and selects the **last matching rule**.

Exact v1.18.4 sources:
https://github.com/anomalyco/opencode/blob/v1.18.4/packages/core/src/v1/config/permission.ts
https://github.com/anomalyco/opencode/blob/v1.18.4/packages/opencode/src/permission/index.ts

This makes rule ordering evidence-bearing.

A model seeing a target in the Task schema is not evidence that the target is authorized.

Current corroborating issue:
https://github.com/anomalyco/opencode/issues/33334

## 4. Depth is a mechanical boundary, not a governance model

The v1.18.4 Task tool computes session depth from the `parentID` chain and compares it with `subagent_depth`.

Current docs describe `subagent_depth: 1` as allowing primary -> subagent but stopping that subagent from launching another level; `2` adds one additional nesting level.

Source:
https://dev.opencode.ai/docs/config/

Important distinction:

`depth` answers **how deep**.

It does not answer:

- who may delegate to whom;
- which Work item is being delegated;
- how many siblings may be created;
- whether a result is accepted;
- whether a target is an Ω resident or leaf worker.

## 5. Fresh Task vs task_id resume

Fresh creation and reuse are materially different.

With no `task_id`, v1.18.4 creates a new child session and assigns the selected agent.

With `task_id`, the implementation may retrieve an existing session instead.

The source does not establish the Ω-level binding checks needed by the lab for arbitrary resume:

- requested target agent;
- expected parent;
- team/work item;
- expected directory/workspace;
- stable identity;
- active incarnation.

Therefore U1 uses:

`fresh Task = allowed experiment`

`task_id resume = separately qualified experiment`

Current issue 41681 reinforces this as an active failure class in newer OpenCode development:
https://github.com/anomalyco/opencode/issues/41681

## 6. Child permissions

The v1.18.4 `deriveSubagentSessionPermission` helper carries selected parent restrictions and adds default `task: deny` and `todowrite: deny` when the target agent does not explicitly provide those capabilities.

Source:
https://github.com/anomalyco/opencode/blob/v1.18.4/packages/opencode/src/agent/subagent-permissions.ts

This is why the lab's leaf worker explicitly denies Task and why tests should inspect actual effective child permissions rather than infer them from the agent profile.

## 7. Plugin enforcement seam

OpenCode exposes `tool.execute.before` and `tool.execute.after` plugin hooks.

Current docs show `tool.execute.before` can throw to prevent a tool action, and the plugin receives project, directory, worktree, and SDK context.

Source:
https://dev.opencode.ai/docs/plugins/

The v1.18.4 source path also places plugin triggering before registered tool execution, while Task itself performs its native permission check.

Exact sources:
https://github.com/anomalyco/opencode/blob/v1.18.4/packages/opencode/src/session/tools.ts
https://github.com/anomalyco/opencode/blob/v1.18.4/packages/opencode/src/tool/task.ts

### Ω boundary

This gives the VIVIM plugin a useful **preflight enforcement seam**.

It does not make the plugin the authoritative scheduler.

Desired relationship:

`resident decision -> plugin admission -> native Task -> child session`

## 8. Sessions

A v1.18.4 session carries useful runtime facts:

- `id`
- `parentID`
- `agent`
- `directory`
- `permission`
- model
- metadata
- timestamps

Exact source:
https://github.com/anomalyco/opencode/blob/v1.18.4/packages/opencode/src/session/session.ts

These are strong evidence inputs.

They are not by themselves Ω identity, Work, acceptance, or constitutional authority.

## 9. Alternate execution surfaces

The Task path is not the only way an OpenCode environment can initiate work.

Relevant surfaces include:

| Surface | Research concern |
|---|---|
| Native Task | primary U1 surface. |
| Custom commands | commands may select agents and, in current V2 docs, may run background child sessions. |
| Custom/plugin tools | a plugin can expose arbitrary tools, so an agent-control tool can become an alternate spawn path. |
| MCP | external tools may indirectly create execution surfaces. |
| Shell/Bash | a worker with shell access might invoke an external OpenCode/swarmer/launcher. |
| Direct session creation | an ordinary session can exist without being a governed child. |
| Background Task | asynchronous execution introduces additional notification/recovery semantics. |

Current command docs:
https://opencode.ai/v2/docs/commands

This is the direct source of the U1 anti-pattern:

> **Task-denied-means-leaf is false unless alternate execution surfaces are also closed or governed.**

## 10. Current V2 distinction

Current V2 OpenCode documentation uses different permission vocabulary:

- V1: `permission`, `task`, `bash`
- V2: `permissions`, `subagent`, `shell`

Source:
https://opencode.ai/v2/docs/permissions

Do not mix V2 configuration examples into the V1.18.4 lab without a migration experiment.

## 11. Native substrate map

```
OpenCode configuration
        |
        +--> agent profile
        |      |
        |      +--> mode/model/prompt
        |      +--> permission rules
        |
        v
     parent session
        |
        | native Task
        v
  permission evaluation
        |
        +--> deny / ask / allow
        |
        v
  child session creation
        |
        +--> parentID
        +--> agent
        +--> directory
        +--> derived permissions
        |
        v
    child execution
        |
        v
      result
```

Ω adds a distinct layer around this:

```
stable identity
   + Work item
   + authority grant
   + spawn correlation
   + evidence
   + acceptance
```

Do not erase the distinction.
