[CmdletBinding()]
param(
    [string]$WorkspacePath = (Get-Location).Path
)

$ErrorActionPreference = 'Stop'

function Invoke-GitText {
    param([Parameter(Mandatory=$true)][string[]]$Args)
    $out = & git @Args 2>&1
    if ($LASTEXITCODE -ne 0) {
        throw "git $($Args -join ' ') failed: $out"
    }
    return (($out -join [Environment]::NewLine).Trim())
}

$WorkspacePath = (Resolve-Path $WorkspacePath).Path
$manifestPath = Join-Path $WorkspacePath '.omega-agent/manifest.json'
if (-not (Test-Path $manifestPath)) {
    throw "No agent manifest at $manifestPath."
}

$manifest = Get-Content -Raw $manifestPath | ConvertFrom-Json
$currentBranch = Invoke-GitText @('-C',$WorkspacePath,'branch','--show-current')
$currentSha = Invoke-GitText @('-C',$WorkspacePath,'rev-parse','HEAD')
$status = @(& git -C $WorkspacePath status --short 2>&1)
if ($LASTEXITCODE -ne 0) { throw "git status failed: $status" }
if ($status.Count -gt 0) {
    throw "Workspace is dirty. Commit or explicitly resolve the changes before integration."
}

& git -C $WorkspacePath fetch origin --prune
if ($LASTEXITCODE -ne 0) { throw "git fetch failed." }

$teamSha = Invoke-GitText @('-C',$WorkspacePath,'rev-parse','refs/remotes/origin/team/omega-endstate')
& git -C $WorkspacePath merge-base --is-ancestor $manifest.baseSha $currentSha
if ($LASTEXITCODE -ne 0) { throw "Agent branch no longer descends from its recorded base SHA $($manifest.baseSha)." }

& git -C $WorkspacePath merge-base --is-ancestor $teamSha $currentSha
$teamIncluded = ($LASTEXITCODE -eq 0)

$mergeBase = Invoke-GitText @('-C',$WorkspacePath,'merge-base',$currentSha,$teamSha)
$changed = @(& git -C $WorkspacePath diff --name-only "$mergeBase...$currentSha" 2>&1)
if ($LASTEXITCODE -ne 0) { throw "Could not calculate changed files." }

$result = [pscustomobject]@{
    readyForIntegration = $true
    agentId = $manifest.agentId
    task = $manifest.task
    branch = $currentBranch
    headSha = $currentSha
    recordedBaseSha = $manifest.baseSha
    currentTeamSha = $teamSha
    teamIncludedInBranch = $teamIncluded
    mergeBaseWithTeam = $mergeBase
    changedFiles = @($changed | Where-Object { $_ -and $_.Trim() })
    note = if ($teamIncluded) { "Branch includes current team integration line." } else { "Branch is stale relative to current team integration line; integration must account for divergence." }
}
$result | ConvertTo-Json -Depth 8
