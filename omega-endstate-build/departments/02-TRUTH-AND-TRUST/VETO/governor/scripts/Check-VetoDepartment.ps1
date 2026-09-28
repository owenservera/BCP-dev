Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

$department = Split-Path -Parent $PSScriptRoot

$required = @(
  "AGENTS.md",
  "DEPARTMENT-CHARTER.md",
  "MISSION-AND-BOUNDARIES.md",
  "STATE.json",
  "TASK-QUEUE.md",
  "TASK-FORMAT.md",
  "SESSION-PROTOCOL.md",
  "CONTEXT-BUNDLE-PROTOCOL.md",
  "AUDIT-METHOD.md",
  "EVIDENCE-GUIDE.md",
  "SELF-DEFINITION-GUIDE.md",
  "SELF-DEFINITION-LEDGER.md",
  "SELF-EVOLUTION-GUIDE.md",
  "SELF-AUDIT-PROTOCOL.md",
  "GOVERNANCE-OF-GOVERNANCE-GUIDE.md",
  "INTELLIGENCE-MAP.md",
  "CURRENT-SYSTEM-PRIMER.md",
  "ANTI-PATTERN-CATALOG.md",
  "BOOTSTRAP-PACKET.md"
)

$missing = @()
foreach ($file in $required) {
  if (-not (Test-Path (Join-Path $department $file))) { $missing += $file }
}

if ($missing.Count -gt 0) {
  Write-Error ("Missing VETO-01 cold-start files: " + ($missing -join ", "))
  exit 1
}

$state = Get-Content -Raw -Path (Join-Path $department "STATE.json") | ConvertFrom-Json
Write-Output "VETO-01 department integrity: PASS"
Write-Output ("Mission: " + $state.primaryMission)
Write-Output ("Authority: " + $state.authority)
Write-Output ("Trigger: " + $state.triggerMode)
Write-Output ("Review layer: " + $state.reviewLayer)
Write-Output ("Active task: " + $state.activeTask)
Write-Output ("Self-audit: " + $state.selfAudit.protocol)
