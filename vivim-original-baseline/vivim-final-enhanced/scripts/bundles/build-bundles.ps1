# build-bundles.ps1 — build the full git-bundle suite for vivim-final-enhanced.
# Runs against a scratch clone so the working tree is never disturbed.
# Output: <repo>/bundles/*.bundle
param(
  [string]$Repo = "C:/0-BlackBoxProject-0/Vivim-omega/FullTest/vivim-final-enhanced",
  [string]$Work = "C:/Users/VIVIM.inc/AppData/Local/Temp/opencode/bundler"
)
$ErrorActionPreference = "Stop"

$Scratch = Join-Path $Work "scratch"
$Out = Join-Path $Repo "bundles"
New-Item -ItemType Directory -Force $Out | Out-Null

function G {
  & git @args
  if ($LASTEXITCODE -ne 0) { throw "git $($args -join ' ') failed (exit $LASTEXITCODE)" }
}

if (Test-Path -LiteralPath $Scratch) { Remove-Item -LiteralPath $Scratch -Recurse -Force }
G clone --quiet $Repo $Scratch
Push-Location -LiteralPath $Scratch
try {
  # Root-level tracked files (repo manifests/configs; everything not under a unit dir).
  $unitDirs = @("src","frontend","tests","docs","devops","scripts","prisma","seeds","shared","sdk","src-tauri","wiki",".github","source-atlas")
  $allTracked = @(G ls-files) | Where-Object { $_ -ne "" }
  $rootFiles = @($allTracked | Where-Object {
    $f = $_; $hit = $false
    foreach ($d in $unitDirs) { if ($f -eq $d -or $f.StartsWith("$d/")) { $hit = $true; break } }
    -not $hit
  })
  Write-Output "root files: $($rootFiles.Count)"
  $BASELINE = "tests/integration/characterization-baseline/v010-baseline.test.ts"

  # --- path-preserving unit via orphan assembly (keeps repo-relative paths) ---
  function New-PathUnit([string]$Branch, [string[]]$Paths, [string]$Message, [string]$Bundle) {
    G checkout --quiet master
    G checkout --quiet --orphan $Branch
    G rm --quiet -rf .
    G checkout --quiet master -- @Paths
    G commit --quiet -m $Message
    $bp = Join-Path $Out $Bundle
    if (Test-Path -LiteralPath $bp) { Remove-Item -LiteralPath $bp -Force }
    G bundle create $bp $Branch
    G bundle verify $bp | Out-Null
    $n = @(G ls-tree -r --name-only $Branch).Count
    Write-Output "OK $Bundle files=$n branch=$Branch"
  }

  function New-PathUnitCustom([string]$Branch, [scriptblock]$Assemble, [string]$Message, [string]$Bundle) {
    G checkout --quiet master
    G checkout --quiet --orphan $Branch
    G rm --quiet -rf .
    & $Assemble
    G commit --quiet -m $Message
    $bp = Join-Path $Out $Bundle
    if (Test-Path -LiteralPath $bp) { Remove-Item -LiteralPath $bp -Force }
    G bundle create $bp $Branch
    G bundle verify $bp | Out-Null
    $n = @(G ls-tree -r --name-only $Branch).Count
    Write-Output "OK $Bundle files=$n branch=$Branch"
  }

  # --- prefix-stripped unit via subtree split (files land at bundle root) ---
  function New-StripUnit([string]$Prefix, [string]$Branch, [string]$Bundle) {
    G checkout --quiet master
    try { G branch --quiet -D $Branch } catch {}
    G subtree split -P $Prefix -b $Branch | Out-Null
    $bp = Join-Path $Out $Bundle
    if (Test-Path -LiteralPath $bp) { Remove-Item -LiteralPath $bp -Force }
    G bundle create $bp $Branch
    G bundle verify $bp | Out-Null
    $n = @(G ls-tree -r --name-only $Branch).Count
    Write-Output "OK $Bundle files=$n branch=$Branch"
  }

  Write-Output "=== Option 2: full ==="
  G checkout --quiet master
  $fullBp = Join-Path $Out "vivim-full.bundle"
  if (Test-Path -LiteralPath $fullBp) { Remove-Item -LiteralPath $fullBp -Force }
  G bundle create $fullBp --all
  G bundle verify $fullBp | Out-Null
  Write-Output "OK vivim-full.bundle"

  Write-Output "=== Option 1: 6 curated path-preserving units ==="
  New-PathUnit "unit/backend" @("src","prisma","seeds","shared","sdk") "bundle: backend runtime (src+prisma+seeds+shared+sdk)" "vivim-backend.bundle"
  New-PathUnit "unit/frontend" @("frontend","src-tauri") "bundle: frontend + desktop shell" "vivim-frontend.bundle"
  New-PathUnit "unit/tests" @("tests") "bundle: test corpus" "vivim-tests.bundle"
  New-PathUnit "unit/ops" @("devops","scripts",".github") "bundle: ops tooling (devops+scripts+workflows)" "vivim-ops.bundle"
  New-PathUnit "unit/docs" @("docs","wiki") "bundle: docs + wiki" "vivim-docs.bundle"
  New-PathUnit "unit/root" $rootFiles "bundle: repo-root manifests + configs" "vivim-root.bundle"

  Write-Output "=== Option 3: 12 prefix-stripped units ==="
  foreach ($d in @("src","frontend","tests","docs","devops","scripts","prisma","seeds","shared","sdk","src-tauri","wiki")) {
    New-StripUnit $d "strip/$d" "strip-$d.bundle"
  }

  Write-Output "=== Option 4: lean code + baseline + remainder ==="
  New-PathUnit "unit/code" (@("src","frontend","prisma","shared","sdk","src-tauri") + $rootFiles) "bundle: lean code (no tests/docs/ops)" "vivim-code.bundle"
  New-PathUnit "unit/baseline" @($BASELINE) "bundle: characterization baseline (single file)" "vivim-tests-baseline.bundle"
  New-PathUnitCustom "unit/remainder" {
    G checkout --quiet master -- docs wiki devops scripts seeds .github tests
    G rm --quiet --cached $BASELINE
  } "bundle: remainder (docs/wiki/ops/seeds/tests-minus-baseline)" "vivim-remainder.bundle"

  Write-Output "=== bundles on disk ==="
  Get-ChildItem -LiteralPath $Out -Filter "*.bundle" | Sort-Object Name | Format-Table Name, @{L="KB";E={[math]::Round($_.Length/1KB)}} -AutoSize | Out-String -Width 200
}
finally {
  Pop-Location
}
Write-Output "BUILD DONE"
