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
    throw "No agent manifest at $manifestPath. This is not a managed autonomous-agent workspace."
}

$manifest = Get-Content -Raw $manifestPath | ConvertFrom-Json
$repoRoot = Invoke-GitText @('-C',$WorkspacePath,'rev-parse','--show-toplevel')
$currentBranch = Invoke-GitText @('-C',$WorkspacePath,'branch','--show-current')
$currentSha = Invoke-GitText @('-C',$WorkspacePath,'rev-parse','HEAD')
$status = @(& git -C $WorkspacePath status --short 2>&1)
if ($LASTEXITCODE -ne 0) { throw "git status failed: $status" }

$problems = New-Object System.Collections.Generic.List[string]
if ($currentBranch -ne $manifest.branch) {
    $problems.Add("BRANCH_MISMATCH: manifest=$($manifest.branch) actual=$currentBranch")
}
if ($currentBranch -in @('main','team/omega-endstate')) {
    $problems.Add("SHARED_BRANCH_FORBIDDEN:$currentBranch")
}

& git -C $WorkspacePath merge-base --is-ancestor $manifest.baseSha HEAD 2>$null
if ($LASTEXITCODE -ne 0) {
    $problems.Add("BASE_NOT_ANCESTOR:base=$($manifest.baseSha) head=$currentSha")
}

[pscustomobject]@{
    agentId = $manifest.agentId
    task = $manifest.task
    mode = $manifest.mode
    workspacePath = $repoRoot
    branch = $currentBranch
    currentSha = $currentSha
    baseBranch = $manifest.baseBranch
    baseSha = $manifest.baseSha
    dirty = ($status.Count -gt 0)
    statusLines = @($status)
    valid = ($problems.Count -eq 0)
    problems = @($problems)
} | ConvertTo-Json -Depth 8

if ($problems.Count -gt 0) { exit 2 }
