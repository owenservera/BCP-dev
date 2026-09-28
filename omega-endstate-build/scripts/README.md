# Local Git / Workspace Tooling

These PowerShell scripts are executable helpers for the local Steward and its agents.

They are designed to be run from a normal BCP-dev checkout or from a compatible worktree.

They do not replace Git.

They automate the safety protocol.

## Scripts

### `New-AgentWorkspace.ps1`

Allocates a new isolated agent workspace and owned branch.

Default mode is a Git worktree.

Use `-Mode clone` for higher-risk isolation.

### `Verify-AgentWorkspace.ps1`

Checks that an agent is operating in the workspace/branch recorded in its local manifest and reports dirty state and branch/base information.

### `Retire-AgentWorkspace.ps1`

Safely removes a completed agent worktree after verification. Branch deletion is never implicit.

### `Bootstrap-Steward.ps1`

Convenience wrapper for allocating the first Steward workspace and printing the exact next local actions.

## Local state

Machine-specific registry and manifests live under:

`omega-endstate-build/.local/`

That directory is gitignored and must never contain secrets.

## Safety posture

The scripts fail closed on ambiguous ownership, existing branches, unexpected current branches, or dirty workspaces where destructive cleanup would otherwise be tempting.
