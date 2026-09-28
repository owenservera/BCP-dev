[CmdletBinding()]
param(
    [Parameter(Mandatory = $true)]
    [ValidatePattern('^[A-Za-z0-9][A-Za-z0-9._-]*$')]
    [string]$AgentId,

    [Parameter(Mandatory = $true)]
    [ValidatePattern('^[A-Za-z0-9][A-Za-z0-9._-]*$')]
    [string]$Task,

    [ValidateSet('worktree','clone')]
    [string]$Mode = 'worktree',

    [string]$WorkspaceRoot,

    [string]$BaseBranch = 'team/omega-endstate'
)

$ErrorActionPreference = 'Stop'

function Invoke-Git {
    param([Parameter(Mandatory=$true)][string[]]$Args)
    & git @Args
    if ($LASTEXITCODE -ne 0) {
        throw "git $($Args -join ' ') failed with exit code $LASTEXITCODE"
    }
}

function Invoke-GitText {
    param([Parameter(Mandatory=$true)][string[]]$Args)
    $out = & git @Args 2>&1
    if ($LASTEXITCODE -ne 0) {
        throw "git $($Args -join ' ') failed: $out"
    }
    return (($out -join [Environment]::NewLine).Trim())
}

$repoRoot = Invoke-GitText @('rev-parse','--show-toplevel')
$repoRoot = (Resolve-Path $repoRoot).Path
$remoteUrl = Invoke-GitText @('remote','get-url','origin')

if (-not $WorkspaceRoot) {
    $WorkspaceRoot = Join-Path (Split-Path $repoRoot -Parent) 'omega-endstate-workspaces'
}
$WorkspaceRoot = [IO.Path]::GetFullPath($WorkspaceRoot)
New-Item -ItemType Directory -Force -Path $WorkspaceRoot | Out-Null

Write-Host "Fetching repository refs..."
Invoke-Git @('fetch','origin','--prune')

$baseSha = Invoke-GitText @('rev-parse',"refs/remotes/origin/$BaseBranch")
$branch = "work/omega-endstate/$AgentId/$Task"
$workspace = Join-Path $WorkspaceRoot "$AgentId-$Task"
$workspace = [IO.Path]::GetFullPath($workspace)
$manifestDir = Join-Path $workspace '.omega-agent'
$registryPath = Join-Path $WorkspaceRoot 'workspace-registry.json'
$lockPath = Join-Path $WorkspaceRoot 'workspace-registry.lock'

$repoPrefix = $repoRoot.TrimEnd('\','/') + [IO.Path]::DirectorySeparatorChar
if ($workspace.StartsWith($repoPrefix, [StringComparison]::OrdinalIgnoreCase)) {
    throw "Workspace must be outside the tracked repository: $workspace"
}

& git show-ref --verify --quiet "refs/heads/$branch"
$localExists = ($LASTEXITCODE -eq 0)

$remoteExists = (& git ls-remote --heads origin $branch 2>$null)
if ($LASTEXITCODE -ne 0) { throw "Could not inspect remote branch $branch" }
if ($localExists -or $remoteExists) {
    throw "Ref already exists: $branch. Refusing to reuse an existing agent branch."
}

$worktreePorcelain = & git worktree list --porcelain 2>&1
if ($LASTEXITCODE -ne 0) { throw "Could not inspect git worktrees: $worktreePorcelain" }
if (($worktreePorcelain -join [Environment]::NewLine) -match [regex]::Escape("refs/heads/$branch")) {
    throw "Branch $branch is already attached to a worktree."
}

if (Test-Path $workspace) {
    throw "Workspace path already exists: $workspace. Refusing to overwrite it."
}

$lockStream = $null
$workspaceCreated = $false
$registry = [ordered]@{
    version = 1
    updatedAt = (Get-Date).ToUniversalTime().ToString('o')
    workspaces = @()
}
try {
    $deadline = (Get-Date).AddSeconds(15)
    do {
        try {
            $lockStream = [IO.File]::Open($lockPath,[IO.FileMode]::OpenOrCreate,[IO.FileAccess]::ReadWrite,[IO.FileShare]::None)
            break
        } catch [IO.IOException] {
            if ((Get-Date) -ge $deadline) { throw "Timed out acquiring workspace registry lock: $lockPath" }
            Start-Sleep -Milliseconds 200
        }
    } while ($true)

    if (Test-Path $registryPath) {
        $raw = Get-Content -Raw $registryPath
        if ($raw.Trim()) { $registry = $raw | ConvertFrom-Json }
    }
    if (-not $registry.workspaces) { $registry.workspaces = @() }
    $existing = @($registry.workspaces | Where-Object { $_.agentId -eq $AgentId -and $_.status -ne 'retired' })
    if ($existing.Count -gt 0) {
        throw "Registry already has an active workspace for agent $AgentId."
    }

    Write-Host "Creating $Mode workspace..."
if ($Mode -eq 'worktree') {
    Invoke-Git @('worktree','add','-b',$branch,$workspace,$baseSha)
} else {
    Invoke-Git @('clone',$remoteUrl,$workspace)
    Invoke-GitText @('-C',$workspace,'fetch','origin',$BaseBranch) | Out-Null
    Invoke-Git @('-C',$workspace,'switch','-c',$branch,$baseSha)
}
$workspaceCreated = $true

New-Item -ItemType Directory -Force -Path $manifestDir | Out-Null
$now = (Get-Date).ToUniversalTime().ToString('o')
$manifest = [ordered]@{
    version = 1
    agentId = $AgentId
    task = $Task
    mode = $Mode
    repository = 'owenservera/BCP-dev'
    workspacePath = $workspace
    branch = $branch
    baseBranch = $BaseBranch
    baseSha = $baseSha
    createdAt = $now
    status = 'active'
}
$manifest | ConvertTo-Json -Depth 5 | Set-Content -Encoding UTF8 (Join-Path $manifestDir 'manifest.json')

$entry = [ordered]@{
    agentId = $AgentId
    task = $Task
    mode = $Mode
    workspacePath = $workspace
    branch = $branch
    baseBranch = $BaseBranch
    baseSha = $baseSha
    status = 'active'
    currentSha = $baseSha
    createdAt = $now
    updatedAt = $now
}

$registry.workspaces = @($registry.workspaces) + [pscustomobject]$entry
$registry.updatedAt = $now
$registry | ConvertTo-Json -Depth 8 | Set-Content -Encoding UTF8 $registryPath
} catch {
    if ($workspaceCreated) {
        if ($Mode -eq 'worktree') {
            & git worktree remove $workspace 2>$null
            & git branch -D $branch 2>$null
        } else {
            Remove-Item -LiteralPath $workspace -Recurse -Force -ErrorAction SilentlyContinue
        }
    }
    throw
} finally {
    if ($null -ne $lockStream) { $lockStream.Dispose() }
}

Write-Host ""
Write-Host "ALLOCATED"
Write-Host "Agent:     $AgentId"
Write-Host "Task:      $Task"
Write-Host "Mode:      $Mode"
Write-Host "Branch:    $branch"
Write-Host "Base SHA:  $baseSha"
Write-Host "Workspace: $workspace"
Write-Host ""
Write-Host "Next:"
Write-Host ('  Set-Location "' + $workspace + '"')
Write-Host "  .\omega-endstate-build\scripts\Verify-AgentWorkspace.ps1"
Write-Host "  opencode"
