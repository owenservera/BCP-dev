# sync-txt-copies.ps1 — byte-identical .txt copies of every git bundle.
# Some web apps only accept .txt uploads; content is untouched (rename only).
# Also writes bundles/SHA256SUMS.txt. Exits 0 when no bundles exist (fresh-clone safe).
param(
  [string]$Repo = (Split-Path -Parent (Split-Path -Parent $PSScriptRoot))
)
$ErrorActionPreference = "Stop"
$Out = Join-Path $Repo "bundles"

$bundles = @()
if (Test-Path -LiteralPath $Out) {
  $bundles += @(Get-ChildItem -LiteralPath $Out -Filter "*.bundle" -File | Where-Object { $_.Name -notlike "*.bundle.txt" })
}
$rootBundle = Join-Path $Repo "source-atlas.bundle"
if (Test-Path -LiteralPath $rootBundle) { $bundles += @(Get-Item -LiteralPath $rootBundle) }

if ($bundles.Count -eq 0) {
  Write-Output "sync-txt: no bundles found, nothing to do."
  exit 0
}

$made = 0
foreach ($b in $bundles) {
  $txt = "$($b.FullName).txt"
  Copy-Item -LiteralPath $b.FullName -Destination $txt -Force
  $made++
}
# prune stale .txt copies whose .bundle is gone
foreach ($t in @(Get-ChildItem -LiteralPath $Out -Filter "*.bundle.txt" -File -ErrorAction SilentlyContinue)) {
  $orig = $t.FullName.Substring(0, $t.FullName.Length - 4)
  if (-not (Test-Path -LiteralPath $orig)) { Remove-Item -LiteralPath $t.FullName -Force }
}
$rootTxt = "$rootBundle.txt"
if ((Test-Path -LiteralPath $rootTxt) -and (-not (Test-Path -LiteralPath $rootBundle))) {
  Remove-Item -LiteralPath $rootTxt -Force
}

# checksums over bundles dir (excludes MANIFEST, includes .bundle + .txt)
$sums = @()
foreach ($f in @(Get-ChildItem -LiteralPath $Out -File | Where-Object { $_.Name -like "*.bundle*" } | Sort-Object Name)) {
  $h = (Get-FileHash -LiteralPath $f.FullName -Algorithm SHA256).Hash.ToLower()
  $sums += "$h  $($f.Name)"
}
if ($sums.Count -gt 0) {
  $sums -join "`n" | Set-Content -LiteralPath (Join-Path $Out "SHA256SUMS.txt") -Encoding utf8NoBOM
}
Write-Output "sync-txt: $made .txt copies refreshed in $(if ($Out -eq (Join-Path $Repo 'bundles')) { 'bundles/' } else { $Out }) (+ root source-atlas.bundle.txt)"
