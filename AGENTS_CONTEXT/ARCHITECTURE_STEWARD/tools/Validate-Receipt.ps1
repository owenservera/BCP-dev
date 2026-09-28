# Validate-Receipt.ps1 — M1 automatic completion gate (procedural, fail-closed)
#
# Usage:
#   pwsh AGENTS_CONTEXT/ARCHITECTURE_STEWARD/tools/Validate-Receipt.ps1 -ReceiptPath <path> [-DeliveryRef HEAD]
#
# What it answers (M0/M1 prompt section 5, checks C1-C9):
#   C1 receipt structurally valid (all v1.1 canonical fields present)
#   C2 requested_agent == resolved_agent when an agent was explicitly requested
#   C3 source SHA valid (resolves via git cat-file)
#   C4 referenced commit exists when implementation was claimed
#   C5 actual changed paths stay inside allowed paths when a path envelope applies
#   C6 required tests present and successful for IMPLEMENTED work
#   C7 required STATE update present/current for IMPLEMENTED work
#   C8 final delivery ref contains the receipt
#   C9 claimed completion class matches the evidence
#
# A failure is explicit (FAIL + reason + nonzero exit). Nothing silently
# downgrades to a warning. SKIP is used only for checks that do not apply
# (absent optional keys on a non-IMPLEMENTED receipt).
#
# Enforcement posture (CFA-10 ledger, 2026-09-28): every check below is
# PROCEDURAL (contract-checked), NOT mechanical enforcement. Exact-agent and
# allowlist behavior on opencode 1.18.4 is fallback-checked / roster-checked
# procedure until a name-scoped permission mechanism is verified and wired.
# Prompt-only checking is never labeled enforcement.
#
# Authority: steward-owned tooling/diagnostics; not Omega law, not semantic
# authority, not a second task system. Contract: SESSION-RESULT-CONTRACT.md v1.2.

[CmdletBinding()]
param(
  [Parameter(Mandatory = $true)]
  [string]$ReceiptPath,

  [string]$DeliveryRef = "HEAD"
)

$ErrorActionPreference = "Stop"

# --- repo root: tools/ -> ARCHITECTURE_STEWARD -> AGENTS_CONTEXT -> repo root
$RepoRoot = (Resolve-Path (Join-Path $PSScriptRoot ".." ".." "..")).Path

function Invoke-Git {
  param([string[]]$GitArgs)
  $out = & git -C $RepoRoot $GitArgs 2>&1
  return @{ Exit = $LASTEXITCODE; Out = ($out | Out-String).Trim() }
}

function Test-ShaResolves {
  param([string]$Sha)
  if ($Sha -notmatch '\b[0-9a-f]{7,40}\b') { return $false }
  $m = [regex]::Match($Sha, '\b[0-9a-f]{7,40}\b')
  $r = Invoke-Git @("cat-file", "-e", "$($m.Value)^{commit}")
  return $r.Exit -eq 0
}

function Get-FirstSha {
  param([string]$Text)
  $m = [regex]::Match($Text, '\b[0-9a-f]{40}\b')
  if ($m.Success) { return $m.Value }
  $m2 = [regex]::Match($Text, '\b[0-9a-f]{7,39}\b')
  if ($m2.Success) { return $m2.Value }
  return ""
}

$results = @()
function Add-Check {
  param([string]$Id, [string]$Verdict, [string]$Detail)
  $script:results += [pscustomobject]@{ Check = $Id; Verdict = $Verdict; Detail = $Detail }
}

# --- load receipt
if (-not (Test-Path -LiteralPath $ReceiptPath)) {
  # allow repo-relative path
  $candidate = Join-Path $RepoRoot $ReceiptPath
  if (Test-Path -LiteralPath $candidate) { $ReceiptPath = $candidate }
}
if (-not (Test-Path -LiteralPath $ReceiptPath)) {
  Write-Output "OVERALL: FAIL — receipt file not found: $ReceiptPath"
  exit 1
}
$fullPath = (Resolve-Path -LiteralPath $ReceiptPath).Path
$text = Get-Content -Raw -LiteralPath $fullPath
$relPath = [System.IO.Path]::GetRelativePath($RepoRoot, $fullPath).Replace('\', '/')

# --- parse KEY: value lines (merge all fenced text blocks; fall back to whole file)
$fenceBlocks = [regex]::Matches($text, '```text(.*?)```', [System.Text.RegularExpressions.RegexOptions]::Singleline)
$scanText = if ($fenceBlocks.Count -gt 0) {
  ($fenceBlocks | ForEach-Object { $_.Groups[1].Value }) -join "`n"
} else { $text }

$fields = @{}
$currentKey = ""
foreach ($line in ($scanText -split "`r?`n")) {
  if ($line -match '^\s*$') { $currentKey = ""; continue }  # blank line ends a value; headers below never attach
  $m = [regex]::Match($line, '^([A-Z][A-Z0-9 /_-]*):\s*(.*)$')
  if ($m.Success) {
    $currentKey = $m.Groups[1].Value.Trim()
    $fields[$currentKey] = $m.Groups[2].Value.Trim()
  } elseif ($currentKey -ne "" -and $line -match '^(\s+|-\s+)\S') {
    # continuation line: indented text or markdown list item ("- ...")
    $fields[$currentKey] += "`n" + $line.Trim()
  }
}

# --- C1: structural validity (23 canonical v1.1 fields)
$v11Keys = @(
  "SESSION_STATUS", "SESSION_ID", "CFA / AGENT", "IDENTITY", "AGENT_ID",
  "TARGET_REF", "BASE_MAIN_SHA", "TASK", "EXECUTION_STRATEGY",
  "STRATEGY_RATIONALE", "RESULT", "FILES_CHANGED", "COMMIT_SHA",
  "PREDECESSOR_VERIFIED", "OWNER_ALIGNMENT", "LESSONS_UPDATED", "COMMONS",
  "UNRESOLVED", "BLOCKERS", "BOUNDARIES_ACTIVATED", "OMEGA_LAW_CHANGED",
  "IMPLEMENTATION_STARTED", "NEXT_REQUIRED_STEP"
)
$missing = @($v11Keys | Where-Object { -not $fields.ContainsKey($_) -or [string]::IsNullOrWhiteSpace($fields[$_]) })
if ($missing.Count -eq 0) {
  Add-Check "C1" "PASS" "all 23 canonical v1.1 fields present with values"
} else {
  Add-Check "C1" "FAIL" ("missing/empty canonical fields: " + ($missing -join ", "))
}

# --- classify claim
$resultText = if ($fields.ContainsKey("RESULT")) { $fields["RESULT"] } else { "" }
$implStarted = if ($fields.ContainsKey("IMPLEMENTATION_STARTED")) { $fields["IMPLEMENTATION_STARTED"] } else { "" }
$mode = if ($fields.ContainsKey("MODE")) { $fields["MODE"] } else { "" }
$statusText = if ($fields.ContainsKey("SESSION_STATUS")) { $fields["SESSION_STATUS"] } else { "" }

$isImplemented = ($resultText -match 'IMPLEMENTED') -or ($implStarted -match '^(yes|true)') -or ($implStarted -match 'IMPLEMENTED')
$isExecMode = $mode -match 'EXECUTION'
$claimClass = "OTHER"
foreach ($c in @("IMPLEMENTED", "FALSIFIED", "INVESTIGATED", "BLOCKED", "PARTIAL", "SUPERSEDED", "PARKED")) {
  if ($resultText -match $c) { $claimClass = $c; break }
}

# REPORTED-UNVERIFIED is the honest pre-commit label, not a defect in the
# receipt itself: it passes here, while C8 (absent from the delivery ref)
# still blocks any downstream gate advance until the commit lands.
if ($statusText -match 'REPORTED-UNVERIFIED') {
  Write-Output "NOTE: SESSION_STATUS is REPORTED-UNVERIFIED — honest pending state; C8 must still pass before any gate advances."
}

# --- C2: exact-agent check
$requested = if ($fields.ContainsKey("REQUESTED_AGENT")) { $fields["REQUESTED_AGENT"].Trim() } else { "" }
$resolvedAlias = if ($fields.ContainsKey("RESOLVED_AGENT")) { $fields["RESOLVED_AGENT"].Trim() } else { "" }
$agentId = if ($fields.ContainsKey("AGENT_ID")) { $fields["AGENT_ID"].Trim() } else { "" }
$resolved = if ($resolvedAlias -ne "") { $resolvedAlias } else { $agentId }
if ([string]::IsNullOrWhiteSpace($requested) -or $requested -match '^(UNKNOWN|NONE|N/A|—|-)(\s|$)') {
  Add-Check "C2" "SKIP" "no explicit REQUESTED_AGENT (pre-M1/unspecified); exact-agent check does not apply"
} elseif ($requested -eq $resolved) {
  Add-Check "C2" "PASS" "REQUESTED_AGENT == resolved agent ($resolved) [PROCEDURAL: fallback-checked, not mechanical]"
} else {
  Add-Check "C2" "FAIL" "agent mismatch: REQUESTED_AGENT='$requested' vs resolved='$resolved'. Silent fallback (incl. to Steward) is an authority defect (CFA-04 P5): REJECT the EXECUTION/IMPLEMENTED claim; re-execute with the delegated agent, never adopt orphaned work. [PROCEDURAL fail-closed]"
}

# --- C3: source SHA valid
$baseSha = if ($fields.ContainsKey("BASE_MAIN_SHA")) { $fields["BASE_MAIN_SHA"] } else { "" }
$baseFirst = Get-FirstSha $baseSha
if ($baseFirst -ne "" -and (Test-ShaResolves $baseFirst)) {
  Add-Check "C3" "PASS" "BASE_MAIN_SHA resolves: $baseFirst"
} else {
  Add-Check "C3" "FAIL" "BASE_MAIN_SHA does not resolve to a commit: '$baseSha'"
}

# --- C4: commit exists when implementation claimed
$commitField = if ($fields.ContainsKey("COMMIT_SHA")) { $fields["COMMIT_SHA"] } else { "" }
$commitFirst = Get-FirstSha $commitField
if ($isImplemented) {
  if ($commitFirst -ne "" -and (Test-ShaResolves $commitFirst)) {
    Add-Check "C4" "PASS" "COMMIT_SHA resolves: $commitFirst"
  } else {
    Add-Check "C4" "FAIL" "IMPLEMENTED claimed but COMMIT_SHA does not resolve: '$commitField' (PENDING/NONE is not proof)"
  }
} else {
  if ($commitFirst -ne "" -and (Test-ShaResolves $commitFirst)) {
    Add-Check "C4" "PASS" "non-IMPLEMENTED receipt; referenced commit resolves (lineage only): $commitFirst"
  } else {
    Add-Check "C4" "SKIP" "non-IMPLEMENTED receipt with no resolving commit (legitimate; commit evidence required only for IMPLEMENTED)"
  }
}

# --- C5: path containment
$allowedRaw = if ($fields.ContainsKey("ALLOWED_PATHS")) { $fields["ALLOWED_PATHS"] } else { "" }
$filesRaw = if ($fields.ContainsKey("FILES_CHANGED")) { $fields["FILES_CHANGED"] } else { "" }
if ([string]::IsNullOrWhiteSpace($allowedRaw) -or $allowedRaw -match '^(UNKNOWN|NONE|N/A|—|-)(\s|$)') {
  Add-Check "C5" "SKIP" "no ALLOWED_PATHS envelope (check applies only when a path envelope exists)"
} else {
  $allowedList = @($allowedRaw -split "[`r`n,;]+" | ForEach-Object { $_.Trim().Trim('- ').Trim() } | Where-Object { $_ -ne "" -and $_ -notmatch '^(NONE|UNKNOWN)' })
  $changedList = @($filesRaw -split "`n" | ForEach-Object { $_.Trim() } | Where-Object { $_ -match '^-\s+\S' } | ForEach-Object { ($_ -replace '^-\s+', '').Split(' ')[0].Trim() })
  if ($changedList.Count -eq 0) {
    # single-line FILES_CHANGED value: treat whole value as one entry if it looks like a path
    $v = $filesRaw.Trim()
    if ($v -match '^(NONE|NO |no change)') {
      Add-Check "C5" "FAIL" "ALLOWED_PATHS envelope exists but FILES_CHANGED records no changed paths"
    } else {
      Add-Check "C5" "FAIL" "ALLOWED_PATHS envelope exists but FILES_CHANGED is unparsable as a path list; cannot prove containment (explicit failure, not silent skip). Raw: '$v'"
    }
  } else {
    $escapes = @()
    foreach ($p in $changedList) {
      $pn = $p.Replace('\', '/').TrimStart('./')
      $inside = $false
      foreach ($a in $allowedList) {
        $an = $a.Replace('\', '/').Trim().TrimStart('./').TrimEnd('/')
        if ($pn -eq $an -or $pn.StartsWith($an + "/") -or $an -eq "" ) { $inside = $true; break }
      }
      if (-not $inside) { $escapes += $p }
    }
    if ($escapes.Count -eq 0) {
      Add-Check "C5" "PASS" ("all " + $changedList.Count + " changed paths inside ALLOWED_PATHS [PROCEDURAL: steward-verified]")
    } else {
      Add-Check "C5" "FAIL" ("path-envelope escape: " + ($escapes -join ", "))
    }
  }
}

# --- C6: required tests for IMPLEMENTED
$reqTests = if ($fields.ContainsKey("REQUIRED_TESTS")) { $fields["REQUIRED_TESTS"] } else { "" }
$testResults = if ($fields.ContainsKey("TEST_RESULTS")) { $fields["TEST_RESULTS"] } else { "" }
if ($isImplemented -and $isExecMode) {
  if ([string]::IsNullOrWhiteSpace($reqTests)) {
    Add-Check "C6" "FAIL" "MODE=EXECUTION IMPLEMENTED claim without REQUIRED_TESTS"
  } elseif ([string]::IsNullOrWhiteSpace($testResults)) {
    Add-Check "C6" "FAIL" "MODE=EXECUTION IMPLEMENTED claim without TEST_RESULTS"
  } elseif ($testResults -match '(?i)(pass|success|green|0 fail)') {
    Add-Check "C6" "PASS" "REQUIRED_TESTS named; TEST_RESULTS cites success [PROCEDURAL heuristic: citation only, rerun/inspect logs before gate advance]"
  } else {
    Add-Check "C6" "FAIL" "TEST_RESULTS does not evidence success. Raw: '$testResults'"
  }
} elseif ($isImplemented) {
  Add-Check "C6" "SKIP" "IMPLEMENTED with MODE=DELIBERATE/bounded: v1.1 checks only (CFA-09 compat rule)"
} else {
  Add-Check "C6" "SKIP" "non-IMPLEMENTED receipt: no test evidence required (INVESTIGATED/FALSIFIED are legitimate terminal outcomes)"
}

# --- C7: STATE update for IMPLEMENTED
if ($isImplemented) {
  if ($text -match '(?i)STATE\.md|STATE update|STATE path|STATE freshness|STATE\.md closure') {
    Add-Check "C7" "PASS" "receipt references a STATE update surface [PROCEDURAL: presence cited; Steward verifies currency on delivery ref]"
  } else {
    Add-Check "C7" "FAIL" "IMPLEMENTED claim without any STATE update reference"
  }
} else {
  Add-Check "C7" "SKIP" "non-IMPLEMENTED receipt: no STATE currency gate"
}

# --- C8: delivery ref contains the receipt
$r = Invoke-Git @("ls-tree", "--name-only", $DeliveryRef, "--", $relPath)
if ($r.Exit -eq 0 -and $r.Out -ne "") {
  Add-Check "C8" "PASS" "receipt present on delivery ref '$DeliveryRef': $relPath"
} else {
  Add-Check "C8" "FAIL" "receipt NOT present on delivery ref '$DeliveryRef' (uncommitted or wrong ref): $relPath"
}

# --- C9: class/evidence consistency
if ($claimClass -eq "IMPLEMENTED") {
  $filesV = $filesRaw.Trim()
  if ($filesV -match '^(NONE|NO |\(none)') {
    Add-Check "C9" "FAIL" "IMPLEMENTED claimed but FILES_CHANGED records no delta"
  } elseif ($implStarted -match '^(no|false)') {
    Add-Check "C9" "FAIL" "IMPLEMENTED claimed but IMPLEMENTATION_STARTED says no"
  } else {
    Add-Check "C9" "PASS" "IMPLEMENTED claim has a files delta and no contradictory flag"
  }
} elseif ($claimClass -in @("INVESTIGATED", "FALSIFIED")) {
  if ($implStarted -match '^(yes|true)') {
    Add-Check "C9" "FAIL" "$claimClass receipt must not claim implementation started"
  } else {
    Add-Check "C9" "PASS" "$claimClass is a legitimate terminal outcome for DELIBERATE work; no implementation evidence demanded"
  }
} else {
  Add-Check "C9" "PASS" "class '$claimClass' recorded; BLOCKED/PARTIAL/SUPERSEDED/PARKED require blocker/cursor evidence (manual review)"
}

# --- report
Write-Output "Receipt: $relPath"
Write-Output "DeliveryRef: $DeliveryRef"
Write-Output "ClaimClass: $claimClass | Mode: $($mode -replace '`n',' ')"
Write-Output ""
foreach ($c in $results) {
  Write-Output ("[{0}] {1}: {2}" -f $c.Verdict, $c.Check, $c.Detail)
}
Write-Output ""
Write-Output "Enforcement posture: EXACT-AGENT: PROCEDURAL (fallback-checked) | SPAWN-ALLOWLIST: PROCEDURAL (roster-checked) | PATH/COMMAND/DOMAIN: PROCEDURAL (envelope-checked) | RECEIPT: PROCEDURAL (contract-checked) | CHANGED-PATH: PROCEDURAL (steward-verified) | TEST-GATE: PROCEDURAL (envelope + rerun) | FRESHNESS: PROCEDURAL (read-first + reconcile) | SPAWN-DEPTH: MECHANICAL (subagent_depth=2 + task:false)"
Write-Output ""

$fails = @($results | Where-Object { $_.Verdict -eq "FAIL" })
if ($fails.Count -eq 0) {
  Write-Output "OVERALL: PASS ($($results.Count) checks, 0 failures)"
  exit 0
} else {
  Write-Output ("OVERALL: FAIL ({0} failing check(s)) — explicit failure; do not silently downgrade to warning; do not advance any downstream gate" -f $fails.Count)
  exit 1
}
