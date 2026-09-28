<#
.SYNOPSIS
  Validate the vendored opencode-swarm core on Windows.

.DESCRIPTION
  Exists because the Steward session must never be blocked by a long-running or
  leaking child process. This script is launched DETACHED: it starts the server,
  waits for readiness, runs the swarm, and tears the server down by exact PID --
  all inside itself, writing progress to a log the Steward only ever reads.

  Teardown is by exact recorded PID only, never by process image name. Killing by
  image name previously killed the owner's opencode TUI sessions and the Steward's
  own session. Two PIDs matter: the launcher we spawned, and the process that
  actually owns the LISTEN socket, which opencode creates as a CHILD of the
  launcher. The launcher can be gone while its child still serves.

.PARAMETER ConfigPath
  swarm.json to run.

.PARAMETER WorkDir
  Scratch directory the agents work in. The swarm DB lands in <WorkDir>/.swarm/.

.PARAMETER Port
  Port for the temporary `opencode serve`.

.PARAMETER LogPath
  Progress log. The script appends a final "DONE <exitCode>" line when finished.

.PARAMETER ReadyTimeoutSec
  How long to wait for the server to report ready.

.PARAMETER SwarmTimeoutSec
  Hard cap on the swarm run. The swarm is killed if it exceeds this.
#>
[CmdletBinding()]
param(
  [Parameter(Mandatory = $true)][string]$ConfigPath,
  [Parameter(Mandatory = $true)][string]$WorkDir,
  [Parameter(Mandatory = $true)][string]$LogPath,
  [Parameter(Mandatory = $true)][string]$RepoRoot,
  [int]$Port = 29951,
  [int]$ReadyTimeoutSec = 120,
  [int]$SwarmTimeoutSec = 300
)

$ErrorActionPreference = 'Continue'
$script:LauncherPid = $null
$script:SwarmPid = $null

function Write-Log {
  param([string]$Message)
  $line = "[{0}] {1}" -f (Get-Date -Format 'HH:mm:ss'), $Message
  Add-Content -LiteralPath $LogPath -Value $line -Encoding utf8
}

# Kill one exact PID and its tree. Never matches by image name.
function Stop-ExactPid {
  param([int]$ProcessId, [string]$Label)
  if ($ProcessId -le 0) { return }
  & taskkill /T /F /PID $ProcessId *> $null
  Write-Log "teardown: taskkill $Label pid=$ProcessId exit=$LASTEXITCODE"
}

# PIDs owning a LISTEN socket on $Port.
function Get-ListenerPids {
  param([int]$OnPort)
  try {
    @(Get-NetTCPConnection -LocalPort $OnPort -State Listen -ErrorAction SilentlyContinue |
      Select-Object -ExpandProperty OwningProcess -Unique)
  } catch { @() }
}

try {
  New-Item -ItemType Directory -Force -Path $WorkDir | Out-Null
  $serveOut = Join-Path $WorkDir 'serve.stdout.log'
  $serveErr = Join-Path $WorkDir 'serve.stderr.log'
  $swarmOut = Join-Path $WorkDir 'swarm.stdout.log'
  $swarmErr = Join-Path $WorkDir 'swarm.stderr.log'

  Write-Log "=== validate start ==="
  Write-Log "RepoRoot=$RepoRoot WorkDir=$WorkDir Port=$Port"
  Write-Log "Config=$ConfigPath"

  # ---- 1. start the server (detached, hidden, output to files) -----------
  $server = Start-Process -FilePath 'opencode' `
    -ArgumentList @('serve', '--hostname=127.0.0.1', "--port=$Port") `
    -WorkingDirectory $WorkDir `
    -RedirectStandardOutput $serveOut -RedirectStandardError $serveErr `
    -PassThru -WindowStyle Hidden
  $script:LauncherPid = $server.Id
  Write-Log "server launcher pid=$($server.Id)"

  # ---- 2. wait for readiness (bounded) ------------------------------------
  $ready = $false
  $readyUrl = $null
  $sw = [System.Diagnostics.Stopwatch]::StartNew()
  while ($sw.Elapsed.TotalSeconds -lt $ReadyTimeoutSec) {
    if (Test-Path -LiteralPath $serveOut) {
      $raw = Get-Content -LiteralPath $serveOut -Raw -ErrorAction SilentlyContinue
      if ($raw -and $raw -match 'opencode server listening.*?on\s+(https?://\S+)') {
        $ready = $true
        $readyUrl = $Matches[1]
        break
      }
    }
    if ($server.HasExited) {
      Write-Log "server exited early code=$($server.ExitCode)"
      break
    }
    Start-Sleep -Milliseconds 500
  }
  Write-Log ("ready={0} after {1}s url={2}" -f $ready, [math]::Round($sw.Elapsed.TotalSeconds, 1), $readyUrl)

  if (-not $ready) {
    Write-Log "FAIL: server never became ready"
    if (Test-Path -LiteralPath $serveOut) { Write-Log ("serve.stdout: " + ((Get-Content -LiteralPath $serveOut -Raw) -replace '\s+', ' ')) }
    if (Test-Path -LiteralPath $serveErr) { Write-Log ("serve.stderr: " + ((Get-Content -LiteralPath $serveErr -Raw) -replace '\s+', ' ')) }
    exit 2
  }

  # ---- 3. run the swarm against the already-running server ----------------
  # --server means the swarm never spawns or tears down a server itself; this
  # script owns the lifecycle, so teardown cannot race the swarm.
  $swarmCli = Join-Path $RepoRoot 'omega-endstate-build/runtime/vendor/opencode-swarm/src/cli.ts'
  $swarmArgs = @(
    $swarmCli, 'run', $ConfigPath,
    '--server', $readyUrl,
    '--dir', $WorkDir,
    '--json'
  )
  Write-Log "swarm: bun $($swarmArgs -join ' ')"
  $swarm = Start-Process -FilePath 'bun' -ArgumentList $swarmArgs `
    -WorkingDirectory $RepoRoot `
    -RedirectStandardOutput $swarmOut -RedirectStandardError $swarmErr `
    -PassThru -WindowStyle Hidden
  $script:SwarmPid = $swarm.Id

  $remaining = [math]::Max(1, $SwarmTimeoutSec - [int]$sw.Elapsed.TotalSeconds)
  if (-not $swarm.WaitForExit($remaining * 1000)) {
    Write-Log "FAIL: swarm exceeded ${SwarmTimeoutSec}s - killing pid=$($swarm.Id)"
    Stop-ExactPid -ProcessId $swarm.Id -Label 'swarm'
  } else {
    Write-Log "swarm exited code=$($swarm.ExitCode)"
  }

  # ---- 4. evidence -------------------------------------------------------
  foreach ($f in @($serveErr, $swarmOut, $swarmErr)) {
    if ((Test-Path -LiteralPath $f) -and (Get-Item -LiteralPath $f).Length -gt 0) {
      $body = (Get-Content -LiteralPath $f -Raw) -replace '\s+', ' '
      if ($body.Length -gt 4000) { $body = $body.Substring(0, 4000) + ' ...[truncated]' }
      Write-Log ("[{0}] {1}" -f (Split-Path -Leaf $f), $body)
    }
  }
  $report = Join-Path $WorkDir '.swarm/reports'
  if (Test-Path -LiteralPath $report) {
    Get-ChildItem -LiteralPath $report -Filter *.md | ForEach-Object { Write-Log "report: $($_.FullName)" }
  } else {
    Write-Log 'report: NONE (swarm did not write .swarm/reports)'
  }

  $exit = if ($swarm.HasExited) { $swarm.ExitCode } else { 3 }
  Write-Log "swarm-exit=$exit"
  exit $exit
}
catch {
  Write-Log "EXCEPTION: $($_.Exception.Message)"
  exit 9
}
finally {
  # ---- teardown: exact recorded PIDs, always ----------------------------
  $listeners = Get-ListenerPids -OnPort $Port
  if ($listeners.Count -gt 0) { Write-Log "teardown: listeners on $Port -> $($listeners -join ',')" }
  foreach ($lp in $listeners) { Stop-ExactPid -ProcessId $lp -Label 'listener' }
  if ($script:LauncherPid) { Stop-ExactPid -ProcessId $script:LauncherPid -Label 'launcher' }
  if ($script:SwarmPid) { Stop-ExactPid -ProcessId $script:SwarmPid -Label 'swarm' }
  Start-Sleep -Seconds 1
  $left = Get-ListenerPids -OnPort $Port
  Write-Log "teardown: port $Port listeners remaining = $(if ($left) { $left -join ',' } else { 'none' })"
  Write-Log '=== validate done ==='
}
