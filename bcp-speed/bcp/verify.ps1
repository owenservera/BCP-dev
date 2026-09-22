# BCP-SPEED Verification / Smoke Test - Windows
#   powershell -ExecutionPolicy Bypass -File verify.ps1

$ErrorActionPreference = "Continue"
$fail = 0

function Check($label, [bool]$ok) {
    if ($ok) {
        Write-Host "  PASS  $label" -ForegroundColor Green
    } else {
        Write-Host "  FAIL  $label" -ForegroundColor Red
        $script:fail++
    }
}

Write-Host "=== BCP-SPEED Verify ===" -ForegroundColor Cyan

Check "state/capabilities.yaml exists" (Test-Path "state/capabilities.yaml")
Check "state/taxonomy.yaml exists" (Test-Path "state/taxonomy.yaml")
Check "state/leases.yaml exists" (Test-Path "state/leases.yaml")
Check "state/deps.yaml exists" (Test-Path "state/deps.yaml")
Check "state/experiments.yaml exists" (Test-Path "state/experiments.yaml")
Check "all 4 agent role files exist" (
    (Test-Path "agents/scoped-builder.md") -and
    (Test-Path "agents/fullscope-builder.md") -and
    (Test-Path "agents/coordinator.md") -and
    (Test-Path "agents/maintainer.md")
)
Check "RECONCILIATION.md exists" (Test-Path "RECONCILIATION.md")
Check "git repo initialized" (Test-Path ".git")

# Capability count check via python (authoritative parse, not regex)
try {
    $countOutput = python -c "
import yaml
d = yaml.safe_load(open('state/capabilities.yaml', encoding='utf-8'))
n = sum(len(f.get('capabilities', {})) for f in d.get('families', {}).values())
print(n)
"
    $count = [int]$countOutput.Trim()
    Check "capabilities.yaml has 40 capabilities (found $count)" ($count -eq 40)
} catch {
    Check "capabilities.yaml parses via python+pyyaml" $false
}

# Views generated
Check "views/map.html generated" (Test-Path "views/map.html")

# Tools present, state valid, tests green
Check "bcp_tool.py, validate.py, sweep.py, bcp_lib.py exist" (
    (Test-Path "bcp_tool.py") -and (Test-Path "validate.py") -and
    (Test-Path "sweep.py") -and (Test-Path "bcp_lib.py")
)
python validate.py *> $null
Check "validate.py reports no errors (warnings are OK)" ($LASTEXITCODE -eq 0)
python -m unittest discover -s tests *> $null
Check "test suite passes" ($LASTEXITCODE -eq 0)

Write-Host ""
if ($fail -eq 0) {
    Write-Host "=== All checks passed ===" -ForegroundColor Green
} else {
    Write-Host "=== $fail check(s) failed ===" -ForegroundColor Red
    exit 1
}
