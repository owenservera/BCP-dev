# BCP-SPEED Setup - Windows
# Run from inside the bcp/ folder (or pass -Root to target elsewhere):
#   powershell -ExecutionPolicy Bypass -File setup.ps1

param(
    [string]$Root = "."
)

$ErrorActionPreference = "Stop"
Push-Location $Root

Write-Host "=== BCP-SPEED Setup ===" -ForegroundColor Cyan

# 1. Ensure directory structure (idempotent - safe to re-run)
$dirs = @("state", "log", "views", "work", "agents", "patterns", "caps")
foreach ($d in $dirs) {
    New-Item -ItemType Directory -Force -Path $d | Out-Null
    Write-Host "  ok: $d/"
}

# 2. Check Python + PyYAML (required by generate_views.py)
$pythonOk = $false
try {
    $ver = python --version 2>&1
    Write-Host "  found: $ver"
    $pythonOk = $true
} catch {
    Write-Host "  WARNING: python not found on PATH. Install Python 3.9+ before running generate_views.py" -ForegroundColor Yellow
}
if ($pythonOk) {
    python -c "import yaml" 2>$null
    if ($LASTEXITCODE -ne 0) {
        Write-Host "  installing pyyaml..."
        pip install pyyaml | Out-Null
    } else {
        Write-Host "  ok: pyyaml already installed"
    }
}

# 3. Confirm the required seed files are present
$required = @(
    "state/capabilities.yaml", "state/taxonomy.yaml", "state/leases.yaml",
    "state/deps.yaml", "state/experiments.yaml", "state/metrics.yaml",
    "state/discoveries.yaml", "state/failures.yaml",
    "agents/bootstrap.md", "agents/scoped-builder.md",
    "agents/fullscope-builder.md", "agents/coordinator.md", "agents/maintainer.md",
    "RECONCILIATION.md", "generate_views.py",
    "bcp_lib.py", "bcp_tool.py", "validate.py", "sweep.py"
)
$missing = @()
foreach ($f in $required) {
    if (-Not (Test-Path $f)) { $missing += $f }
}
if ($missing.Count -gt 0) {
    Write-Host "  WARNING: missing expected files:" -ForegroundColor Yellow
    $missing | ForEach-Object { Write-Host "    - $_" -ForegroundColor Yellow }
} else {
    Write-Host "  ok: all expected files present" -ForegroundColor Green
}

# 4. Git init (idempotent)
if (-Not (Test-Path ".git")) {
    git init | Out-Null
    Write-Host "  git initialized"
} else {
    Write-Host "  ok: git already initialized"
}
$__bcpErr = $ErrorActionPreference
$ErrorActionPreference = "Continue"
git add . 2>&1 | Out-Null
$status = git status --porcelain
if ($status) {
    git commit -m "BCP-SPEED setup" 2>&1 | Out-Null
    Write-Host "  committed initial state"
}
$ErrorActionPreference = $__bcpErr

# 5. First view generation
if ($pythonOk) {
    Write-Host ""
    Write-Host "  generating initial views..."
    python generate_views.py
}

Pop-Location

Write-Host ""
Write-Host "=== Setup complete ===" -ForegroundColor Cyan
Write-Host "Next:"
Write-Host "  1. Open views/map.html in a browser - should show 40 capabilities (29 L2, 7 L1, 4 L0)."
Write-Host "  2. Run verify.ps1 to smoke-test the workspace (runs validate.py and the test suite)."
Write-Host "  3. Point an agent at agents/bootstrap.md, then a role file, then state/experiments.yaml."
Write-Host "  4. Run maintain.ps1 in its own window to keep the coordinator/maintainer loop alive."
