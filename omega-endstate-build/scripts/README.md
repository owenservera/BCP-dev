# Local Git / Workspace Tooling

These PowerShell scripts are executable helpers for the local Steward and its agents.

They are development-system tooling, not project-management material.

They do not replace Git. They automate the safety protocol around isolated execution.

## Scripts

### `New-AgentWorkspace.ps1`

Allocates an isolated local worktree or clone for a task.

The agent ID identifies **who is executing the task**. The Git branch identifies **the task/change**, not the agent.

Default branch form:

`work/omega-endstate/<TASK>`

Default workspace root is a machine-local sibling directory outside the tracked repository. It is operational state, not project-management state.

### `Verify-AgentWorkspace.ps1`

Checks that an agent is operating in the workspace recorded in its local manifest and reports dirty state and branch/base information.

### `PreIntegration.ps1`

Performs a non-mutating integration preflight: verifies the workspace is clean, checks the recorded base, fetches current refs, compares the task branch with the current team integration line, and reports divergence/change set.

### `Retire-AgentWorkspace.ps1`

Safely removes a completed agent worktree after verification. Branch deletion is never implicit.

### `Bootstrap-Steward.ps1`

Convenience wrapper for allocating the first Steward workspace and printing the exact next local actions.

## Local state

Machine-specific registry and manifests live under the configured workspace root. They are never project-management state and must never contain secrets.

## Workspace model

One concurrently active agent session gets one isolated execution workspace.

That workspace may use a Git worktree or clone.

Agent identity is separate from Git branch identity.

Branches are task/change mechanisms and may be created, integrated, renamed or retired independently of the agent that performed the work.

The tooling does not create a permanent agent workspace hierarchy inside the repository.

## First Steward launch

From a trusted BCP-dev checkout:

```powershell
.\omega-endstate-build\scripts\Bootstrap-Steward.ps1
```

The bootstrap creates a task workspace outside the tracked repository and a task branch based on the exact current `team/omega-endstate` SHA.

Inside the allocated workspace:

```powershell
.\omega-endstate-build\scripts\Verify-AgentWorkspace.ps1
opencode
```

The Steward then reads:

`omega-endstate-build/project-management/departments/03-CEO-AND-MVP-BUILDER/control-plane/STEWARD-BOOTSTRAP.md`
