# OpenCode Evidence and Gaps

> Purpose: prevent research certainty from outrunning runtime evidence.

## Established from exact v1.18.4 source

1. Native Task resolves the caller session and checks parent-chain depth.
2. Task invokes permission evaluation against the requested target agent type.
3. Fresh Task creation creates a child session with `parentID` equal to the caller session.
4. An optional `task_id` can select an existing session.
5. New child sessions receive derived permission rules.
6. V1 permissions use ordered rules with last-match evaluation.
7. Plugin `tool.execute.before` is on the path before registered tool execution.
8. Sessions carry parent, agent, directory, permission, model, metadata, and timing information.

Exact source set:
https://github.com/anomalyco/opencode/blob/v1.18.4/packages/opencode/src/tool/task.ts
https://github.com/anomalyco/opencode/blob/v1.18.4/packages/core/src/v1/config/permission.ts
https://github.com/anomalyco/opencode/blob/v1.18.4/packages/opencode/src/permission/index.ts
https://github.com/anomalyco/opencode/blob/v1.18.4/packages/opencode/src/session/tools.ts
https://github.com/anomalyco/opencode/blob/v1.18.4/packages/opencode/src/plugin/index.ts
https://github.com/anomalyco/opencode/blob/v1.18.4/packages/opencode/src/session/session.ts
https://github.com/anomalyco/opencode/blob/v1.18.4/packages/opencode/src/agent/subagent-permissions.ts

## Established from current official documentation

1. Agent configuration supports explicit mode/model/prompt and permission surfaces.
2. V1 permissions are allow/ask/deny.
3. `subagent_depth` is a supported configuration boundary.
4. Plugins expose tool hooks and session/permission/tool events.
5. Current V2 documentation has a different permission vocabulary and plugin model.

Sources:
https://opencode.ai/docs/agents
https://dev.opencode.ai/docs/config/
https://dev.opencode.ai/docs/permissions/
https://dev.opencode.ai/docs/plugins/
https://opencode.ai/v2/docs/permissions

## Established by retained local known-working code

### K01

The vendored `opencode-swarm` has:

- parallel OpenCode sessions;
- persistent SQLite state;
- shared memory;
- message bus;
- completion sweep;
- resume;
- JSON/JSONL machine-readable output;
- real OpenCode E2E tests.

Local:
`../../vendor/opencode-swarm/`

### K02

The local swarm tests include Windows-specific lifecycle handling for SQLite.

### K03

The resident-team lab successfully has an isolated OpenCode config and observation plugin checked into the branch.

## Material gaps

| Gap | Evidence status | Next proof |
|---|---|---|
| Exact v1.18.4 target-specific permission behavior in this lab config | LIVE-PROOF-REQUIRED | CP-01 |
| Real native resident -> worker creation | LIVE-PROOF-REQUIRED | CP-02 |
| Plugin preflight denial actually prevents child creation | LIVE-PROOF-REQUIRED | CP-03 |
| Worker cannot use alternate agent-creation surface | LIVE-PROOF-REQUIRED | CP-04 |
| Resident independently chooses one vs two workers | LIVE-PROOF-REQUIRED | CP-05 |
| Retry/idempotency boundary | LIVE-PROOF-REQUIRED | CP-06 |
| Unsafe `task_id` reuse is rejected | LIVE-PROOF-REQUIRED | CP-07 |
| Durable lineage survives immediate completion | LIVE-PROOF-REQUIRED | CP-08 |
| Failure classes remain distinguishable | LIVE-PROOF-REQUIRED | CP-09 |
| Background Task is suitable for U1 residency | UNKNOWN / explicitly excluded | Future wave |
| Ten-resident resource admission | UNKNOWN | Future wave |
| Native Commons between residents | UNKNOWN | Future wave |
| Long-lived resident recovery | UNKNOWN | Future wave |

## Important non-equivalences

```
agent profile       != durable Ω identity
session ID          != resident identity
parentID            != Work dependency
Task permission     != Ω delegation authority
tool schema         != authorization
Task result text    != evidence
completed           != accepted
process exit 0      != semantic success
task_id reuse       != fresh spawn
plugin              != scheduler
```

These distinctions should remain visible in future research updates.

## Evidence promotion rule

A claim becomes a design dependency only when:

`source-exact or local evidence`
+
`scope/version identified`
+
`limitation recorded`
+
`required live proof passed where applicable`

Research synthesis without that chain remains hypothesis material.
