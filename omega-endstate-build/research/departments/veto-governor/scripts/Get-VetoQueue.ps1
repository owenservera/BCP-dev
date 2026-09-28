param(
  [ValidateSet("ALL","NEW","CLAIMED","IN_PROGRESS","BLOCKED","DONE","DEFERRED")]
  [string]$Status = "ALL"
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

$department = Split-Path -Parent $PSScriptRoot
$tasks = Join-Path $department "tasks"

if (-not (Test-Path $tasks)) {
  Write-Output "No task directory."
  exit 0
}

$items = Get-ChildItem -Path $tasks -Filter "VG-*.md" | Sort-Object Name
foreach ($item in $items) {
  $content = Get-Content -Raw -Path $item.FullName
  $match = [regex]::Match($content, '(?m)^Status:s*(S+)')
  $current = if ($match.Success) { $match.Groups[1].Value } else { "UNKNOWN" }

  if ($Status -eq "ALL" -or $current -eq $Status) {
    $lines = $content -split [Environment]::NewLine
    $heading = $lines | Where-Object { $_ -match '^# ' } | Select-Object -First 1
    Write-Output ("{0,-12} {1,-12} {2}" -f $item.BaseName, $current, $heading)
  }
}
