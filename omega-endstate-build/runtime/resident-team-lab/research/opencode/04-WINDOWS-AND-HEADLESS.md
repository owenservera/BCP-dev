# Windows and Headless OpenCode Notes

> Scope: Windows execution, unattended agents, plugin loading, filesystem lifecycle, and permission-prompt hazards.

## 1. Windows is part of the substrate, not a portability afterthought

The resident-team lab targets Windows.

That means any capability claim needs to survive:

- PowerShell launch;
- Windows path semantics;
- process lifecycle;
- SQLite file locking;
- plugin resolution;
- unattended permission behavior;
- environment/config selection.

The lab already uses an isolated PowerShell launch with `OPENCODE_CONFIG`.

Local launch reference:
`../../README.md`

## 2. Vendored opencode-swarm provides a real Windows lesson

The retained E2E test includes a Windows-specific database lifecycle correction.

Local source:
`../../vendor/opencode-swarm/tests/e2e.test.ts`

The test closes the SQLite database before removing the temporary directory because WAL/SHM sidecars may remain locked on Windows.

This is a concrete example of why POSIX-successful infrastructure should not automatically be considered Windows-proven.

## 3. Plugin execution

OpenCode plugins receive:

- project;
- directory;
- worktree;
- SDK client;
- Bun shell API.

Current docs:
https://dev.opencode.ai/docs/plugins/

The V1.18.4 plugin source also loads external plugins and dispatches hooks/events through the plugin subsystem.

Exact source:
https://github.com/anomalyco/opencode/blob/v1.18.4/packages/opencode/src/plugin/index.ts

U1 should therefore test:

1. plugin loads from the isolated config;
2. plugin loads in child sessions where expected;
3. `tool.execute.before` is actually invoked for Task;
4. a denial thrown from the hook stops the Task path;
5. event records correlate parent/child sessions.

## 4. Headless execution changes the meaning of "ask"

Unattended workers can stall if a required permission request reaches a surface that cannot answer it.

A current OpenCode ACP issue demonstrates this failure class for Task-child permissions:
https://github.com/anomalyco/opencode/issues/48232

This issue is not v1.18.4 proof.

It does establish a useful research warning:

> For unattended worker paths, avoid depending on an interactive permission ask unless the exact client/session routing has been proven.

For U1 this supports using explicit allow/deny rules for required worker operations rather than a required human approval mid-task.

## 5. Windows-specific permission/path watch

Issue #39086 reports a Windows Task-tool exposure mismatch in OpenCode Desktop:
https://github.com/anomalyco/opencode/issues/39086

Issue #26747 reports an older Windows subagent permission inheritance problem:
https://github.com/anomalyco/opencode/issues/26747

These are external corroboration only.

The lab must still inspect:

- actual loaded config;
- actual effective child permissions;
- actual child `directory`;
- actual Task refusal/allowance.

## 6. Configuration isolation

The lab intentionally keeps its own config:

`../../config/opencode.team-lab.jsonc`

Repository command:

```powershell
$env:OPENCODE_CONFIG = (Resolve-Path .\omega-endstate-build\runtime\resident-team-lab\config\opencode.team-lab.jsonc).Path
opencode
```

This isolates the U1 experiment from the normal project config and makes experimental behavior reproducible.

## 7. Alternate launchers are part of the threat model

The following can produce behavior different from the CLI path:

- OpenCode Desktop;
- ACP client;
- direct `opencode run`;
- `opencode serve`;
- plugin-driven child tools;
- MCP clients.

Never generalize a proof from one launch surface to all launch surfaces without a compatibility record.

## 8. Headless-worker contract

For a future long-lived worker, the research target should be:

```
known config
+ explicit permission surface
+ no unresolved interactive asks
+ bounded execution
+ observable completion
+ durable evidence
```

A zero process exit code is not enough.

## 9. Windows evidence checklist

Before declaring a capability proven on Windows, capture:

- OpenCode exact version;
- launch surface;
- config path;
- worktree/directory;
- parent session;
- child session;
- child agent;
- relevant permission outcome;
- process exit/result;
- durable artifact.

This should be represented in future U1 evidence receipts, not only in prose logs.
