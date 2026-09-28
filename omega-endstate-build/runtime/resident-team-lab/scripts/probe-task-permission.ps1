<#
.SYNOPSIS
  Probe native OpenCode Task permission matching for the Ω Resident Team Lab.

.DESCRIPTION
  This is an evidence probe, not a full team run. It validates that the isolated
  config/plugin files exist and then launches OpenCode against exactly that
  configuration.

  The repository previously carried a conflicting conclusion about name-scoped
  task permission. This probe exists to reconcile source-level evidence with
  live behavior on the installed build.

  A future version may automate all assertions end-to-end. For now, each
  conversational result must be checked against observable session evidence.
#>

$ErrorActionPreference = "Stop"

$repoRoot = Resolve-Path (Join-Path $PSScriptRoot "..\..\..\..")
$configPath = Resolve-Path (Join-Path $PSScriptRoot "..\config\opencode.team-lab.jsonc")
$pluginPath = Resolve-Path (Join-Path $PSScriptRoot "..\plugin\resident-team.ts")

Write-Host "Ω Resident Team Lab — native Task permission probe"
Write-Host "Repo   : $repoRoot"
Write-Host "Config : $configPath"
Write-Host "Plugin : $pluginPath"

if (-not (Test-Path -LiteralPath $configPath)) {
  throw "Config not found: $configPath"
}

if (-not (Test-Path -LiteralPath $pluginPath)) {
  throw "Plugin not found: $pluginPath"
}

$env:OPENCODE_CONFIG = $configPath.Path

Write-Host ""
Write-Host "Configured Task policy:"
Write-Host "  team-root         -> resident-* allowed"
Write-Host "  team-root         -> worker-* denied"
Write-Host "  research-resident -> worker-* allowed"
Write-Host "  research-worker   -> all Task denied"
Write-Host ""
Write-Host "Start the session and exercise CP-01 from docs/CHECKPOINTS.md."
Write-Host "Expected evidence is a real allow/refusal plus child-session presence/absence."
Write-Host ""

opencode
