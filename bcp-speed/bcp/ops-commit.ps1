# BCP-SPEED auto-commit - hourly checkpoint (Task Scheduler: BCP-Commit).
# Commits tracked working-tree changes ONLY if validate.py reports 0 errors.
# Scope: state/ log/ agents/ tests/ plus top-level automation (*.ps1, ops-hooks/)
# (never work/ - gitignored scratch by design; never views/ - generated).
# Push: never (owner calls pushes).
# Safe to run by hand: powershell -ExecutionPolicy Bypass -File ops-commit.ps1
$ErrorActionPreference = "Continue"
Set-Location -LiteralPath $PSScriptRoot

$stamp = Get-Date -Format "yyyy-MM-ddTHH:mm:ssZ"
$dirty = git status --porcelain -- state log agents tests ./*.ps1 ops-hooks 2>$null
if (-not $dirty) { Write-Host "[$stamp] commit: tree clean, nothing to do"; exit 0 }

python validate.py 2>$null | Out-Null
# Re-parse counts from a fresh validate run (cheap, read-only).
$report = python validate.py 2>&1 | Select-Object -Last 1
if ($report -notmatch "0 error\(s\)") {
    Write-Host "[$stamp] commit: REFUSED - validate reports errors, state left untouched:" -ForegroundColor Red
    Write-Host "  $report" -ForegroundColor Red
    exit 1
}
git add -- state log agents tests 2>$null
$staged = git diff --cached --name-only 2>$null
if (-not $staged) { Write-Host "[$stamp] commit: nothing stageable, nothing to do"; exit 0 }
git commit -m ("BCP auto-checkpoint {0} - validate 0 errors" -f $stamp) 2>&1 | Select-Object -First 2
Write-Host "[$stamp] commit: checkpoint landed"
