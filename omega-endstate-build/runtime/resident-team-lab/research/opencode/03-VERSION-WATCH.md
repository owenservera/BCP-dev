# OpenCode Version and Drift Watch

> Reviewed: 2026-09-28

## Current boundaries

### Lab target

**OpenCode v1.18.4**

This is the version whose source is used for the U1 substrate model.

### Upstream current line

The upstream repository has released **v1.18.33 on 2026-09-28**.

Release:
https://github.com/anomalyco/opencode/releases/tag/v1.18.33

Current release listing:
https://github.com/anomalyco/opencode/releases

### Why this matters

OpenCode is sufficiently active that "the OpenCode behavior" is not one timeless fact.

For this program the correct statement is:

> "OpenCode v1.18.4 behaves as established by these exact source files and live proofs."

A current issue or current source can identify a **future risk** without rewriting v1.18.4 evidence.

## V1 -> V2 migration watch

Current V2 documentation changes the permission vocabulary:

| Concept | V1 lab | V2 docs |
|---|---|---|
| permission config | `permission` | `permissions` |
| Task authorization | `task` | `subagent` |
| shell | `bash` | `shell` |
| rule target | pattern | resource |
| action result | allow/ask/deny | allow/ask/deny via effect semantics |

Source:
https://opencode.ai/v2/docs/permissions

Plugins also have a V2 migration path that changes hook registration and lifecycle assumptions:
https://opencode.ai/v2/docs/build/plugins/migrate-v1

**Rule:** V2 documentation is migration intelligence, not V1 proof.

## Drift triggers

Any of the following should trigger a substrate review:

1. new OpenCode release changes `task.ts`;
2. permission evaluator changes;
3. child permission derivation changes;
4. session parent/agent/directory model changes;
5. plugin hook execution order changes;
6. Task background semantics change;
7. Task resume semantics change;
8. command/background-child semantics change;
9. agent configuration schema changes;
10. Windows-specific installer/path behavior changes.

## Required revalidation sequence

```
new release
   |
   +--> diff exact Task implementation
   +--> diff permission evaluator
   +--> diff subagent permission derivation
   +--> diff session model
   +--> diff plugin execution seam
   +--> inspect release/issues for related failures
   +--> rerun affected live checkpoints
   |
   v
update research + design dependency
```

## Current watched failure classes

### Task schema vs authorization

OpenCode issue #33334:
https://github.com/anomalyco/opencode/issues/33334

The report showed a Task schema exposing targets outside a configured permission allow-list.

Research implication:

`visible target != authorized target`

### Resume/session permission continuity

OpenCode issue #41681:
https://github.com/anomalyco/opencode/issues/41681

Current development report: resuming a task with a different `subagent_type` can leave prior session permissions in place.

Research implication:

`requested target != sufficient proof of resumed session identity/capability`

### Recursive spawning

Issues:

- https://github.com/anomalyco/opencode/issues/17721
- https://github.com/anomalyco/opencode/issues/18100

Research implication:

`Task permission + recursion semantics` needs explicit qualification; do not rely on prompt language alone.

### Windows Task/tool exposure

Issue #39086:
https://github.com/anomalyco/opencode/issues/39086

Research implication:

Windows-specific runtime behavior deserves direct evidence, especially when OpenCode Desktop/CLI/config paths differ.

## Historical evidence preservation

When a new release changes behavior:

- keep the v1.18.4 source link;
- keep the old experimental result;
- add the new source/result;
- mark which invariants changed;
- never overwrite old proof with a new runtime observation.

The research library is an evidence history, not a mutable summary of "what OpenCode does."
