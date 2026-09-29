# OpenCode runtime implementation evidence

Captured 2026-09-28 from upstream `anomalyco/opencode` `dev` commit `03e67171ab2dc1e7f16e8cebfbc7f778f61b89f0`.

## Why this exists

The operational docs describe intended behavior; this note records a few implementation facts from upstream source that matter when designing a multi-agent system around OpenCode.

## Subagent spawning

Source: https://github.com/anomalyco/opencode/blob/dev/packages/opencode/src/tool/task.ts

The Task tool creates or resumes a child session. The child is assigned an agent type, parent session ID, and a permission set derived from parent restrictions plus the child agent's own rules. Background tasks are explicitly supported by the Task tool and return asynchronously.

The implementation also adds default denies for `todowrite` and for the Task permission itself when the child agent did not explicitly allow them. This means delegation is a real capability boundary, not merely a prompt-level convention.

## Permission derivation

Source: https://github.com/anomalyco/opencode/blob/dev/packages/opencode/src/agent/subagent-permissions.ts

The current helper carries parent `deny` rules and `external_directory` rules into the child session, then adds default `todowrite` and `task` denies unless the child configuration permits those capabilities.

This is materially different from simply cloning the parent's complete permission configuration.

## Built-in agent definitions

Source: https://github.com/anomalyco/opencode/blob/dev/packages/opencode/src/agent/agent.ts

The runtime defines primary and subagent modes, hidden agents, task permissions, and default permission merges in code. Built-ins are therefore useful reference implementations for how an agent catalog is represented and constrained.

## Important design implication

For an Ω-managed autonomous organization, agent definitions should be treated as executable policy surfaces:

- identity/description influences discoverability and delegation;
- mode controls whether an agent is primary/subagent/all;
- permissions constrain concrete capabilities;
- task permission constrains who can be delegated to;
- hidden is UI/discoverability control, not a security primitive.

Do not infer stronger isolation than the runtime actually provides. Workspace/Git isolation remains an external engineering control and should be tested independently.

## Related live upstream reports to re-check

- Task subagents and MCP execution permissions: https://github.com/anomalyco/opencode/issues/16491
- Task subagent permission propagation / external-directory behavior: https://github.com/anomalyco/opencode/issues/30527
- Task subagent inheritance of stale parent denies: https://github.com/anomalyco/opencode/issues/45078
- ACP permission requests from Task child sessions: https://github.com/anomalyco/opencode/issues/48232

These issue reports are evidence of observed/reported behavior at particular times, not proof that the same defects remain in the current build. Re-verify against the exact OpenCode version used by the Ω team before relying on any finding.
