# restore.ps1 — restore the 6 curated units into a target dir (drop-in repo layout).
# Usage: pwsh scripts/bundles/restore.ps1 -Target <dir>
# Add source-atlas/ from source-atlas.bundle for the complete tree.
param([string]$Target = "restored")
$ErrorActionPreference = "Stop"
$bundlesDir = Join-Path (Split-Path -Parent (Split-Path -Parent $PSScriptRoot)) "bundles"
New-Item -ItemType Directory -Force $Target | Out-Null
$pairs = @(
  @("vivim-backend","unit/backend"), @("vivim-frontend","unit/frontend"),
  @("vivim-tests","unit/tests"), @("vivim-ops","unit/ops"),
  @("vivim-docs","unit/docs"), @("vivim-root","unit/root")
)
foreach ($p in $pairs) {
  $b = $p[0]; $br = $p[1]
  $tmp = Join-Path ([IO.Path]::GetTempPath()) ("restore-" + $b)
  if (Test-Path -LiteralPath $tmp) { Remove-Item -LiteralPath $tmp -Recurse -Force }
  & git -c core.autocrlf=false clone --quiet --branch $br (Join-Path $bundlesDir ($b + ".bundle")) $tmp
  if ($LASTEXITCODE -ne 0) { throw "clone failed: $b" }
  Get-ChildItem -LiteralPath $tmp -Force | Where-Object { $_.Name -ne ".git" } | ForEach-Object {
    Copy-Item -LiteralPath $_.FullName -Destination (Join-Path $Target $_.Name) -Recurse -Force
  }
  Remove-Item -LiteralPath $tmp -Recurse -Force
  Write-Output "restored: $b"
}
Write-Output "DONE -> $Target (add source-atlas/ from source-atlas.bundle for the full tree)"
