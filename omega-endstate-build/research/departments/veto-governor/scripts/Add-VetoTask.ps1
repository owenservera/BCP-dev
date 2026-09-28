param(
  [Parameter(Mandatory=$true)][string]$Title,
  [Parameter(Mandatory=$true)][string]$Requester,
  [Parameter(Mandatory=$true)][string]$Objective,
  [Parameter(Mandatory=$true)][string]$Target,
  [Parameter(Mandatory=$true)][string]$MissionConnection,
  [Parameter(Mandatory=$true)][string]$RequestedOutput,
  [string]$Class = "RESEARCH",
  [string]$Scope = "",
  [string]$StartingEvidence = ""
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

$department = Split-Path -Parent $PSScriptRoot
$queue = Join-Path $department "TASK-QUEUE.md"
$tasks = Join-Path $department "tasks"

if (-not (Test-Path $queue)) { throw "Missing TASK-QUEUE.md" }
New-Item -ItemType Directory -Force -Path $tasks | Out-Null

$existing = Get-ChildItem -Path $tasks -Filter "VG-*.md" -ErrorAction SilentlyContinue |
  ForEach-Object { if ($_.Name -match '^VG-(\d+)') { [int]$Matches[1] } }

$next = if ($existing) { (($existing | Measure-Object -Maximum).Maximum + 1) } else { 1 }
$id = "VG-{0:D4}" -f $next
$date = (Get-Date).ToUniversalTime().ToString("yyyy-MM-dd")

$task = @"
# $id — $Title

Status: NEW
Requester: $Requester
Class: $Class
Created: $date

## Objective

$Objective

## Target

$Target

## Primary mission connection

$MissionConnection

## Requested output

$RequestedOutput
"@

$nl = [Environment]::NewLine
if ($Scope) { $task += $nl + "## Scope" + $nl + $nl + $Scope + $nl }
if ($StartingEvidence) { $task += $nl + "## Starting evidence" + $nl + $nl + $StartingEvidence + $nl }

$taskPath = Join-Path $tasks "$id.md"
Set-Content -Path $taskPath -Value ($task.Trim() + $nl) -Encoding utf8

$entry = $nl + $nl + "## $id — $Title" + $nl + $nl +
  "- Status: NEW" + $nl +
  "- Requester: $Requester" + $nl +
  "- Class: $Class" + $nl +
  "- Objective: $Objective" + $nl +
  "- Target: $Target" + $nl +
  "- Primary mission connection: $MissionConnection" + $nl +
  "- Requested output: $RequestedOutput" + $nl +
  "- Created: $date" + $nl +
  "- Task file: tasks/$id.md" + $nl

Add-Content -Path $queue -Value $entry

Write-Output "$id created at $taskPath"
