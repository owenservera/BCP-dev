[CmdletBinding(SupportsShouldProcess)]
param(
    [Parameter(Mandatory=$true)]
    [string]$WorkspacePath,

    [switch]$DeleteLocalBranch
)

$ErrorActionPreference = 'Stop'

$WorkspacePath = (Resolve-Path $WorkspacePath).Path
$manifestPath = Join-Path $WorkspacePath '.omega-agent/manifest.json'
if (-not (Test-Path $manifestPath)) {
    throw "No agent manifest at $manifestPath."
}

$manifest = Get-Content -Raw $manifestPath | ConvertFrom-Json
$branch = $manifest.branch
$currentBranch = (& git -C $WorkspacePath branch --show-current 2>&1).Trim()
if ($LASTEXITCODE -ne 0) { throw "Cannot read current branch." }
if ($currentBranch -ne $branch) {
    throw "Workspace branch mismatch: manifest=$branch actual=$currentBranch"
}
if ($branch -in @('main','team/omega-endstate')) {
    throw "Refusing to retire a shared integration branch."
}

$status = @(& git -C $WorkspacePath status --short 2>&1)
if ($LASTEXITCODE -ne 0) { throw "git status failed: $status" }
if ($status.Count -gt 0) {
    throw "Workspace is dirty. Resolve or deliberately preserve the changes before retirement."
}

$mode = $manifest.mode
if ($mode -eq 'worktree') {
    if ($PSCmdlet.ShouldProcess($WorkspacePath,"remove Git worktree")) {
        & git worktree remove $WorkspacePath
        if ($LASTEXITCODE -ne 0) { throw "git worktree remove failed." }
    }
} elseif ($mode -eq 'clone') {
    throw "Clone retirement is intentionally manual. Verify the clone is no longer needed, then remove it using local filesystem tooling."
} else {
    throw "Unknown workspace mode: $mode"
}

if ($DeleteLocalBranch) {
    Write-Warning "Deleting local branch $branch because -DeleteLocalBranch was explicitly requested."
    & git branch -d $branch
    if ($LASTEXITCODE -ne 0) {
        throw "Local branch deletion failed. The branch may contain unmerged work; it was preserved."
    }
}

Write-Host "Workspace retired. The remote branch was NOT deleted."
