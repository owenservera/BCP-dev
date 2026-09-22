# BCP-SPEED watchdog - validate gate + transition alerts (Task Scheduler: BCP-Watchdog).
# Runs validate.py --json. On ERROR transitions (clean -> broken) it logs ONE
# DRIFT_DETECTED event via bcp_tool (valid taxonomy signal, agent AGT-watchdog);
# while broken it stays silent (no spam - the transition file records state).
# Also flags a stale dashboard (views/map.html older than 30 min).
# Safe to run by hand: powershell -ExecutionPolicy Bypass -File ops-watchdog.ps1
$ErrorActionPreference = "Continue"
Set-Location -LiteralPath $PSScriptRoot

$stamp = Get-Date -Format "yyyy-MM-ddTHH:mm:ssZ"
$stateFile = Join-Path ([System.IO.Path]::GetTempPath()) "bcp-watchdog.json"
$prev = 0
if (Test-Path -LiteralPath $stateFile) {
    try { $prev = [int](Get-Content -LiteralPath $stateFile -Raw) } catch { $prev = 0 }
}

$errors = -1
try {
    $json = python validate.py --json 2>$null
    $errors = ([string]$json | ConvertFrom-Json).errors
} catch { $errors = -1 }

if ($errors -lt 0) {
    Write-Host "[$stamp] watchdog: validate itself failed to run" -ForegroundColor Red
    exit 1
}
Set-Content -LiteralPath $stateFile -Value "$errors" -NoNewline

if ($errors -gt 0 -and $prev -eq 0) {
    python bcp_tool.py log append --agent AGT-watchdog --signal DRIFT_DETECTED --detail "watchdog: validate reports $errors error(s); state left untouched, see validate.py" 2>&1 | Select-Object -First 1
    Write-Host "[$stamp] watchdog: BROKEN ($errors errors) - one DRIFT_DETECTED logged" -ForegroundColor Red
} elseif ($errors -eq 0 -and $prev -gt 0) {
    python bcp_tool.py log append --agent AGT-watchdog --signal STATE_REPAIRED --detail "watchdog: validate clean again" 2>&1 | Select-Object -First 1
    Write-Host "[$stamp] watchdog: RECOVERED - STATE_REPAIRED logged" -ForegroundColor Green
} else {
    Write-Host "[$stamp] watchdog: errors=$errors (prev=$prev) - no transition, silent"
}

$map = Join-Path $PSScriptRoot "views\map.html"
if (Test-Path -LiteralPath $map) {
    $ageMin = ((Get-Date) - (Get-Item -LiteralPath $map).LastWriteTime).TotalMinutes
    if ($ageMin -gt 30) { Write-Host ("[{0}] watchdog: views/map.html is {1} min old - maintain loop may be down" -f $stamp, [int]$ageMin) -ForegroundColor Yellow }
} else {
    Write-Host "[$stamp] watchdog: views/map.html missing - run generate_views.py" -ForegroundColor Yellow
}
