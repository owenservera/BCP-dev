# BCP-SPEED ops installer - registers timers + hook. Idempotent: re-run anytime.
# Creates (overwriting): BCP-Maintain (every 5 min), BCP-Commit (hourly),
# BCP-Watchdog (every 15 min), BCP-Supervise (every 2 min, Task 5 session
# restart), all as the current user, plus the git
# pre-commit hook (validate gate). Prints status at the end.
# BCP-Serve (opencode serve :4096, Task 4) is registered separately on demand:
#   schtasks /Create /F /TN "BCP-Serve" /SC ONSTART /TR "powershell.exe -NoProfile -ExecutionPolicy Bypass -WindowStyle Hidden -File `"C:\0-BlackBoxProject-0\Vivim-omega\BCP-dev\bcp-speed\bcp\ops-serve.ps1`""
#   powershell -ExecutionPolicy Bypass -File ops-install.ps1
# Remove everything: schtasks /Delete /TN "BCP-Maintain" /F (x5) + delete .git\hooks\pre-commit
$ErrorActionPreference = "Continue"
Set-Location -LiteralPath $PSScriptRoot

function Install-Task($name, $schedule, $modifier, $script, $scriptArgs) {
    $tr = "powershell.exe -NoProfile -ExecutionPolicy Bypass -WindowStyle Hidden -File `"$PSScriptRoot\$script`" $scriptArgs"
    schtasks /Create /F /TN $name /SC $schedule /MO $modifier /TR $tr 2>&1 | Select-Object -First 1
}

Install-Task "BCP-Maintain" "MINUTE" 5 "maintain.ps1" "-Passes 1"
Install-Task "BCP-Commit" "HOURLY" 1 "ops-commit.ps1" ""
Install-Task "BCP-Watchdog" "MINUTE" 15 "ops-watchdog.ps1" ""
Install-Task "BCP-Supervise" "MINUTE" 2 "ops-supervise.ps1" ""

# Git pre-commit hook: validate gate - refuses corrupt-state commits.
$hookSrc = Join-Path $PSScriptRoot "ops-hooks\pre-commit"
$hookDst = Join-Path $PSScriptRoot ".git\hooks\pre-commit"
if (Test-Path -LiteralPath $hookSrc) {
    Copy-Item -LiteralPath $hookSrc -Destination $hookDst -Force
    Write-Host "hook: installed .git/hooks/pre-commit (validate gate)"
} else {
    Write-Host "hook: MISSING source ops-hooks/pre-commit - skipped" -ForegroundColor Yellow
}

# AMP-1 L3 hourly WIP snapshot (registered 2026-09-24 as BCP-WIP-amp-1;
# re-running this script keeps it: schtasks /Create /F is idempotent).
# Full python path: the WindowsApps `python` stub cannot run under the
# scheduler (last result 267009); the pinned interpreter is verified working.
schtasks /Create /F /TN "BCP-WIP-amp-1" /SC HOURLY /MO 1 /TR "C:\Users\VIVIM.inc\AppData\Local\Python\pythoncore-3.14-64\python.exe C:\0-BlackBoxProject-0\Vivim-omega\BCP-dev\agent-tools\agent_wip.py snapshot amp-1" 2>&1 | Select-Object -First 1

Write-Host "--- status ---"
schtasks /Query /TN "BCP-Maintain" 2>$null | Select-Object -Last 1
schtasks /Query /TN "BCP-Commit" 2>$null | Select-Object -Last 1
schtasks /Query /TN "BCP-Watchdog" 2>$null | Select-Object -Last 1
schtasks /Query /TN "BCP-Supervise" 2>$null | Select-Object -Last 1
if (Test-Path -LiteralPath $hookDst) { Write-Host "hook: present" } else { Write-Host "hook: ABSENT" -ForegroundColor Red }
