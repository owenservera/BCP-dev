<#
.SYNOPSIS
  CFA-11 quantitative review-trigger counters (single-host, read-only).

.DESCRIPTION
  Computes the three CFA-11 review triggers from
  AGENTS_CONTEXT/ARCHITECTURE_STEWARD/SUBAGENTS/CORE-FUNCTION-AREA-REGISTER.md
  ("Quantitative review trigger") against files on the current tree:

    (1) PENDING receipts simultaneously indexed in
        AGENTS_CONTEXT/ARCHITECTURE_STEWARD/RECEIPTS.md            (>10 triggers)
    (2) open contradictions in the Steward's active reconciliation state (>5 triggers)
    (3) age of the oldest pending receipt in calendar days            (>7 triggers)

  Triggers are review triggers, not automatic birth conditions: the Steward
  records the evidence and the owner decides (register, same section).

  Counter (2) honesty rule: no Steward-designated canonical
  active-reconciliation registry with a countable open-contradiction marker
  exists on this tree (verified 2026-09-28; see docs/agent-system/
  CFA11-COUNTERS-2026-09-28.md). The script therefore reports counter (2) as
  UNKNOWN — it never invents a zero — and lists every candidate file checked.
  Once the Steward designates a canonical file AND its open-marker convention,
  pass -ContradictionsFile + -OpenMarker to count mechanically.

  Read-only: never writes the repo. Exit 0 = scan succeeded (UNKNOWN is a
  successful honest result). Exit non-zero = scan failure (e.g. RECEIPTS.md
  missing or unparsable).

.EXAMPLE
  pwsh -File Get-CFA11Counters.ps1
.EXAMPLE
  pwsh -File Get-CFA11Counters.ps1 -ContradictionsFile 'AGENTS_CONTEXT/ARCHITECTURE_STEWARD/OPEN-CONTRADICTIONS.md' -OpenMarker '^\|\s*OPEN\s*\|'
#>
[CmdletBinding()]
param(
  [string]$RepoRoot = '',
  [string]$ReceiptsPath = 'AGENTS_CONTEXT/ARCHITECTURE_STEWARD/RECEIPTS.md',
  [string]$ContradictionsFile = '',
  [string]$OpenMarker = ''
)

$ErrorActionPreference = 'Stop'

if ([string]::IsNullOrWhiteSpace($RepoRoot)) {
  $root = $PSScriptRoot
  for ($i = 0; $i -lt 6; $i++) { $root = Split-Path $root -Parent }
  $RepoRoot = $root
}
$RepoRoot = (Resolve-Path -LiteralPath $RepoRoot).Path

$runUtc = [DateTime]::UtcNow

function Join-Repo([string]$rel) {
  Join-Path $RepoRoot ($rel -replace '/', [IO.Path]::DirectorySeparatorChar)
}

# --- Counter 1 + 3: parse RECEIPTS.md index table ---------------------------
$receiptsFile = Join-Repo $ReceiptsPath
if (-not (Test-Path -LiteralPath $receiptsFile)) {
  Write-Error "RECEIPTS.md not found at: $receiptsFile"
  exit 2
}

$pending = @()
foreach ($line in (Get-Content -LiteralPath $receiptsFile)) {
  $t = $line.Trim()
  if (-not $t.StartsWith('|')) { continue }
  if ($t -match '^\|\s*-+') { continue }                       # separator row
  $cells = $t.Split('|') | ForEach-Object { $_.Trim() }
  # cells[0] and cells[-1] are empty edge artifacts; expect header or data
  if ($cells.Count -lt 7) { continue }
  if ($cells[1] -eq 'SESSION_ID') { continue }                 # header row
  $status = $cells[5].ToUpperInvariant()
  if ($status -eq 'PENDING') {
    $pending += [pscustomobject]@{
      Session = $cells[1]
      Date    = $cells[2]
      Cfa     = $cells[3]
    }
  }
}

$pendingCount = $pending.Count

# --- Counter 3: oldest pending age in calendar days (UTC) --------------------
$oldestAge = $null
$oldestSession = ''
$oldestDate = ''
foreach ($p in $pending) {
  try {
    $d = [DateTime]::ParseExact($p.Date, 'yyyy-MM-dd', [Globalization.CultureInfo]::InvariantCulture)
  } catch {
    Write-Error "Unparsable DATE '$($p.Date)' for pending session '$($p.Session)' in $ReceiptsPath"
    exit 2
  }
  $age = [int]($runUtc.Date - $d.Date).TotalDays
  if ($null -eq $oldestAge -or $age -gt $oldestAge) {
    $oldestAge = $age
    $oldestSession = $p.Session
    $oldestDate = $p.Date
  }
}

# --- Counter 2: open contradictions ------------------------------------------
$candidateFiles = @(
  'AGENTS_CONTEXT/ARCHITECTURE_STEWARD/OWNER-DIGEST.md',
  'AGENTS_CONTEXT/ARCHITECTURE_STEWARD/STATE.md',
  'AGENTS_CONTEXT/ARCHITECTURE_STEWARD/CURRENT-MISSION.md',
  'AGENTS_CONTEXT/ARCHITECTURE_STEWARD/MASTER-PORTFOLIO-STATE-RECONCILIATION-2026-09-27.md',
  'AGENTS_CONTEXT/ARCHITECTURE_STEWARD/CFA-STRATEGIC-ROADMAP-CENTRAL-2026-09-27.md'
)
$checked = @()
foreach ($rel in $candidateFiles) {
  $full = Join-Repo $rel
  $checked += ('{0} [{1}]' -f $rel, ((Test-Path -LiteralPath $full) ? 'present, no canonical open-contradiction registry' : 'absent'))
}

$contraValue = 'UNKNOWN'
$contraNote = 'no Steward-designated canonical active-reconciliation registry on this tree; reporting UNKNOWN (not 0) per no-invented-semantics rule'
if (-not [string]::IsNullOrWhiteSpace($ContradictionsFile) -and -not [string]::IsNullOrWhiteSpace($OpenMarker)) {
  $cf = Join-Repo $ContradictionsFile
  if (-not (Test-Path -LiteralPath $cf)) {
    Write-Error "Designated contradictions file not found: $cf"
    exit 2
  }
  $hits = @(Select-String -LiteralPath $cf -Pattern $OpenMarker -AllMatches)
  # NOTE: Select-String -Pattern is regex; caller supplies the Steward-ratified marker.
  $contraValue = "$($hits.Count)"
  $contraNote = "counted via Steward-designated file '$ContradictionsFile' with marker '$OpenMarker'"
} elseif (-not [string]::IsNullOrWhiteSpace($ContradictionsFile) -xor -not [string]::IsNullOrWhiteSpace($OpenMarker)) {
  Write-Error 'Counter (2) override requires BOTH -ContradictionsFile and -OpenMarker.'
  exit 2
}

# --- Trigger verdicts ---------------------------------------------------------
$T1 = if ($pendingCount -gt 10) { 'TRIGGERED' } else { 'NOT-TRIGGERED' }
$T2 = if ($contraValue -eq 'UNKNOWN') { 'UNDETERMINED' } elseif ([int]$contraValue -gt 5) { 'TRIGGERED' } else { 'NOT-TRIGGERED' }
$T3 = if ($null -eq $oldestAge) { 'NOT-TRIGGERED (no pending receipts)' } elseif ($oldestAge -gt 7) { 'TRIGGERED' } else { 'NOT-TRIGGERED' }

$overall = if ($T1 -eq 'TRIGGERED' -or $T2 -eq 'TRIGGERED' -or $T3 -eq 'TRIGGERED') {
  'REVIEW-TRIGGERED (at least one trigger fired; Steward records evidence, owner decides)'
} elseif ($T2 -eq 'UNDETERMINED') {
  'INDETERMINATE (counter 2 unresolved; known counters fire no trigger)'
} else {
  'NO-TRIGGER'
}

# --- Report -------------------------------------------------------------------
Write-Output 'CFA-11 review-trigger counters'
Write-Output "run_utc: $($runUtc.ToString('yyyy-MM-dd HH:mm:ss'))Z"
Write-Output "repo_root: $RepoRoot"
Write-Output "source_receipts: $ReceiptsPath"
Write-Output "counter[1] pending_receipts = $pendingCount"
if ($pendingCount -gt 0) {
  Write-Output "counter[1] pending_sessions = $(($pending | ForEach-Object { $_.Session }) -join ', ')"
}
Write-Output "counter[2] open_contradictions = $contraValue ($contraNote)"
Write-Output 'counter[2] candidates_checked:'
foreach ($c in $checked) { Write-Output "  - $c" }
if ($null -eq $oldestAge) {
  Write-Output 'counter[3] oldest_pending_age_days = N/A (zero pending receipts)'
} else {
  Write-Output "counter[3] oldest_pending_age_days = $oldestAge (session $oldestSession, date $oldestDate)"
}
Write-Output "trigger[1] (pending > 10): $T1"
Write-Output "trigger[2] (open contradictions > 5): $T2"
Write-Output "trigger[3] (oldest pending > 7d): $T3"
Write-Output "verdict: $overall"
exit 0
