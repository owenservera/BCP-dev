# BCP-SPEED Maintenance Loop - Windows
# Run this in its own dedicated PowerShell window, or register it with
# Windows Task Scheduler on a 5-minute trigger. Each pass runs sweep.py, which
# frees expired/stalled leases, resolves lease conflicts, notifies unblocked
# agents, recomputes metrics, and (with --views) regenerates the dashboards.
# All log events are written by sweep.py itself - nothing here edits YAML.
#
#   powershell -ExecutionPolicy Bypass -File maintain.ps1
#   powershell -ExecutionPolicy Bypass -File maintain.ps1 -IntervalSeconds 300
#   powershell -ExecutionPolicy Bypass -File maintain.ps1 -Passes 1   # single pass (Task Scheduler)

param(
    [int]$IntervalSeconds = 300,
    [int]$Passes = 0   # 0 = loop forever; N = run N passes then exit
)

$ErrorActionPreference = "Continue"
Set-Location -LiteralPath $PSScriptRoot

Write-Host "=== BCP Maintenance Loop (every $IntervalSeconds s, Ctrl+C to stop) ===" -ForegroundColor Cyan

$done = 0
while ($true) {
    Write-Host "[$(Get-Date -Format 'HH:mm:ss')] sweep..."
    python sweep.py --fix --views 2>&1 | ForEach-Object { Write-Host "  $_" }
    if ($LASTEXITCODE -ne 0) {
        Write-Host "  sweep reported errors (exit $LASTEXITCODE) - run: python validate.py" -ForegroundColor Yellow
    }
    $done++
    if ($Passes -gt 0 -and $done -ge $Passes) { break }
    Start-Sleep -Seconds $IntervalSeconds
}
