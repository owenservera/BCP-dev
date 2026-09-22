# verify-bundles.ps1 — test-clone every bundle in <repo>/bundles and SHA256-compare
# every file against the source tree. Clones use core.autocrlf=false so bytes
# match blobs exactly on Windows. Writes bundles/MANIFEST.md + bundles/restore.ps1.
param(
  [string]$Repo = "C:/0-BlackBoxProject-0/Vivim-omega/FullTest/vivim-final-enhanced",
  [string]$Work = "C:/Users/VIVIM.inc/AppData/Local/Temp/opencode/bundler"
)
$ErrorActionPreference = "Stop"

function G {
  & git @args
  if ($LASTEXITCODE -ne 0) { throw "git $($args -join ' ') failed (exit $LASTEXITCODE)" }
}

$Out = Join-Path $Repo "bundles"
$VRoot = Join-Path $Work "verify"
if (Test-Path -LiteralPath $VRoot) { Remove-Item -LiteralPath $VRoot -Recurse -Force }
New-Item -ItemType Directory -Force $VRoot | Out-Null

$BASELINE = "tests/integration/characterization-baseline/v010-baseline.test.ts"
# unit definition: name, bundle file, kind, branch, source spec
$units = @(
  [pscustomobject]@{Name="vivim-backend";  Bundle="vivim-backend.bundle";  Kind="paths"; Branch="unit/backend";  Spec=@("src","prisma","seeds","shared","sdk")},
  [pscustomobject]@{Name="vivim-frontend"; Bundle="vivim-frontend.bundle"; Kind="paths"; Branch="unit/frontend"; Spec=@("frontend","src-tauri")},
  [pscustomobject]@{Name="vivim-tests";    Bundle="vivim-tests.bundle";    Kind="paths"; Branch="unit/tests";    Spec=@("tests")},
  [pscustomobject]@{Name="vivim-ops";      Bundle="vivim-ops.bundle";      Kind="paths"; Branch="unit/ops";      Spec=@("devops","scripts",".github")},
  [pscustomobject]@{Name="vivim-docs";     Bundle="vivim-docs.bundle";     Kind="paths"; Branch="unit/docs";     Spec=@("docs","wiki")},
  [pscustomobject]@{Name="vivim-root";     Bundle="vivim-root.bundle";     Kind="paths"; Branch="unit/root";     Spec=@("__ROOT__")},
  [pscustomobject]@{Name="vivim-full";     Bundle="vivim-full.bundle";     Kind="full";  Branch="master";        Spec=@()},
  [pscustomobject]@{Name="vivim-code";     Bundle="vivim-code.bundle";     Kind="paths"; Branch="unit/code";     Spec=@("src","frontend","prisma","shared","sdk","src-tauri","__ROOT__")},
  [pscustomobject]@{Name="vivim-tests-baseline"; Bundle="vivim-tests-baseline.bundle"; Kind="paths"; Branch="unit/baseline"; Spec=@($BASELINE)},
  [pscustomobject]@{Name="vivim-remainder"; Bundle="vivim-remainder.bundle"; Kind="paths"; Branch="unit/remainder"; Spec=@("docs","wiki","devops","scripts","seeds",".github","tests","__MINUS_BASELINE__")}
)
foreach ($d in @("src","frontend","tests","docs","devops","scripts","prisma","seeds","shared","sdk","src-tauri","wiki")) {
  $units += [pscustomobject]@{Name="strip-$d"; Bundle="strip-$d.bundle"; Kind="strip"; Branch="strip/$d"; Spec=@($d)}
}

$unitDirs = @("src","frontend","tests","docs","devops","scripts","prisma","seeds","shared","sdk","src-tauri","wiki",".github","source-atlas")
$allTracked = @(G -C $Repo ls-files) | Where-Object { $_ -ne "" }
$rootFiles = @($allTracked | Where-Object {
  $f = $_; $hit = $false
  foreach ($dd in $unitDirs) { if ($f -eq $dd -or $f.StartsWith("$dd/")) { $hit = $true; break } }
  -not $hit
})

function Expected-List($u) {
  if ($u.Kind -eq "full") { return $allTracked }
  if ($u.Kind -eq "strip") { return @($allTracked | Where-Object { $_ -eq $u.Spec[0] -or $_.StartsWith("$($u.Spec[0])/") }) }
  $out = @()
  foreach ($s in $u.Spec) {
    if ($s -eq "__ROOT__") { $out += $rootFiles }
    elseif ($s -eq "__MINUS_BASELINE__") { continue }
    elseif ($s -eq "tests" -and $u.Spec -contains "__MINUS_BASELINE__") {
      $out += @(G -C $Repo ls-files -- tests ":!:$BASELINE") | Where-Object { $_ -ne "" }
    }
    else { $out += @(G -C $Repo ls-files -- $s) | Where-Object { $_ -ne "" } }
  }
  return $out | Sort-Object -Unique
}

$results = @()
foreach ($u in $units) {
  $bp = Join-Path $Out $u.Bundle
  if (-not (Test-Path -LiteralPath $bp)) { throw "missing bundle: $($u.Bundle)" }
  G bundle verify $bp | Out-Null
  $vd = Join-Path $VRoot $u.Name
  if ($u.Kind -eq "full") {
    G -c core.autocrlf=false clone --quiet $bp $vd
    G -C $vd checkout --quiet master
  } else {
    G -c core.autocrlf=false clone --quiet --branch $u.Branch $bp $vd
  }
  $expected = @(Expected-List $u)
  $mm = 0; $missing = @(); $extra = @()
  if ($u.Kind -eq "strip") {
    $prefix = $u.Spec[0]
    $actual = @(Get-ChildItem -LiteralPath $vd -Recurse -File | Where-Object { $_.FullName -notmatch "\.git\\" } | ForEach-Object {
      $_.FullName.Substring($vd.Length + 1).Replace("\","/")
    })
    $expStripped = @($expected | ForEach-Object { if ($_ -eq $prefix) { $_ } else { $_.Substring($prefix.Length + 1) } })
    $cmp = Compare-Object $expStripped $actual
    if ($cmp) { $mm = @($cmp).Count }
    foreach ($rel in $expStripped) {
      $sf = Join-Path $Repo ($prefix + "/" + $rel)
      if ($rel -eq $prefix) { $sf = Join-Path $Repo $prefix }
      $cf = Join-Path $vd ($rel.Replace("/",[IO.Path]::DirectorySeparatorChar))
      if ((Test-Path -LiteralPath $sf) -and (Test-Path -LiteralPath $cf)) {
        if ((Get-FileHash -LiteralPath $sf -Algorithm SHA256).Hash -ne (Get-FileHash -LiteralPath $cf -Algorithm SHA256).Hash) { $mm++ }
      }
    }
    $total = $expStripped.Count
  } else {
    $actual = @(Get-ChildItem -LiteralPath $vd -Recurse -File | Where-Object { $_.FullName -notmatch "\.git\\" } | ForEach-Object {
      $_.FullName.Substring($vd.Length + 1).Replace("\","/")
    })
    $cmp = Compare-Object $expected $actual
    if ($cmp) { $mm = @($cmp).Count }
    foreach ($rel in $expected) {
      $sf = Join-Path $Repo ($rel.Replace("/",[IO.Path]::DirectorySeparatorChar))
      $cf = Join-Path $vd ($rel.Replace("/",[IO.Path]::DirectorySeparatorChar))
      if ((Get-FileHash -LiteralPath $sf -Algorithm SHA256).Hash -ne (Get-FileHash -LiteralPath $cf -Algorithm SHA256).Hash) { $mm++ }
    }
    $total = $expected.Count
  }
  $kb = [math]::Round((Get-Item -LiteralPath $bp).Length / 1KB)
  $status = if ($mm -eq 0) { "PASS" } else { "FAIL" }
  Write-Output "$status $($u.Bundle) files=$total KB=$kb"
  $results += [pscustomobject]@{Name=$u.Name; Bundle=$u.Bundle; Branch=$u.Branch; Kind=$u.Kind; Files=$total; KB=$kb; Status=$status}
  if ($mm -ne 0) { throw "verification FAILED for $($u.Bundle): $mm mismatches" }
}

# completeness: 6 curated units + atlas == every tracked file
$covered = @()
foreach ($n in @("vivim-backend","vivim-frontend","vivim-tests","vivim-ops","vivim-docs","vivim-root")) {
  $u = $results | Where-Object { $_.Name -eq $n }
}
$backend = @(Expected-List ($units | Where-Object { $_.Name -eq "vivim-backend" }))
$frontend = @(Expected-List ($units | Where-Object { $_.Name -eq "vivim-frontend" }))
$tests = @(Expected-List ($units | Where-Object { $_.Name -eq "vivim-tests" }))
$ops = @(Expected-List ($units | Where-Object { $_.Name -eq "vivim-ops" }))
$docs = @(Expected-List ($units | Where-Object { $_.Name -eq "vivim-docs" }))
$root = @(Expected-List ($units | Where-Object { $_.Name -eq "vivim-root" }))
$atlas = @($allTracked | Where-Object { $_ -eq "source-atlas" -or $_.StartsWith("source-atlas/") })
$union = @($backend + $frontend + $tests + $ops + $docs + $root + $atlas) | Sort-Object -Unique
$coverageGap = @(Compare-Object $allTracked $union) | Where-Object { $_ -ne $null }
Write-Output "tracked=$($allTracked.Count) covered=$($union.Count) gap=$(@($coverageGap).Count)"

# --- MANIFEST.md (versioned: source commit + build version + per-bundle SHA256) ---
$sha = (G -C $Repo rev-parse --short HEAD).Trim()
$ver = $env:BUNDLE_VERSION
if (-not $ver) { $ver = "local-$sha-$(Get-Date -Format 'yyyyMMdd-HHmmss' -AsUTC)UTC" }
$ml = @()
$ml += "# Bundle suite manifest"
$ml += ""
$ml += "Source commit : $sha"
$ml += "Build version : $ver"
$ml += "Built (UTC)   : $(Get-Date -Format 'yyyy-MM-ddTHH:mm:ssZ' -AsUTC)"
$ml += "Method: orphan-assembly (path-preserving) / subtree-split (strip-*) / --all (full). Clones verified with core.autocrlf=false."
$ml += "Note: source-atlas/ ships in ../source-atlas.bundle (separate unit, not duplicated here)."
$ml += "Note: vivim-root includes repo-root files + tracked .opencode/skill files."
$ml += "Note: every *.bundle has a byte-identical *.bundle.txt copy (rename-only, for .txt-only uploaders)."
$ml += ""
$ml += "| bundle | shape | branch | files | KB | sha256 | verify |"
$ml += "|--------|-------|--------|-------|----|--------|--------|"
foreach ($r in $results) {
  $h = (Get-FileHash -LiteralPath (Join-Path $Out $r.Bundle) -Algorithm SHA256).Hash.ToLower()
  $ml += "| $($r.Bundle) | $($r.Kind) | $($r.Branch) | $($r.Files) | $($r.KB) | ``$h`` | $($r.Status) |"
}
$ml += ""
$ml += "Restore the 6 curated units: pwsh scripts/bundles/restore.ps1 -Target <dir>"
$ml -join "`n" | Set-Content -LiteralPath (Join-Path $Out "MANIFEST.md") -Encoding utf8NoBOM

# restore.ps1 lives in scripts/bundles/ (tracked); do not emit a stale copy here.
$staleRestore = Join-Path $Out "restore.ps1"
if (Test-Path -LiteralPath $staleRestore) { Remove-Item -LiteralPath $staleRestore -Force }

Write-Output "VERIFY DONE — all $($results.Count) bundles PASS"
