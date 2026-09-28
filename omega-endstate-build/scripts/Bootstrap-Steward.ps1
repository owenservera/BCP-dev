[CmdletBinding()]
param(
    [string]$AgentId = 'STEW-01',
    [string]$Task = 'bootstrap-team',
    [ValidateSet('worktree','clone')]
    [string]$Mode = 'worktree',
    [string]$WorkspaceRoot
)

$ErrorActionPreference = 'Stop'

$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$newScript = Join-Path $scriptDir 'New-AgentWorkspace.ps1'

$arguments = @{
    AgentId = $AgentId
    Task = $Task
    Mode = $Mode
}
if ($WorkspaceRoot) { $arguments.WorkspaceRoot = $WorkspaceRoot }

& $newScript @arguments
if ($LASTEXITCODE -ne 0) {
    throw "Steward workspace allocation failed."
}

Write-Host ""
Write-Host "STEWARD BOOTSTRAP COMPLETE"
Write-Host "Use the allocated workspace above for the first local OpenCode session."
Write-Host "Canonical bootstrap:"
Write-Host "  omega-endstate-build\project-management\departments\03-CEO-AND-MVP-BUILDER\control-plane\STEWARD-BOOTSTRAP.md"
