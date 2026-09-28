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

  The script also writes a status marker file on completion. The marker is the
  only trustworthy answer to "did that run finish?" after the Steward session is
  gone: marker present means the run finished AND teardown completed; marker
  absent means it is either still running or was killed.

.PARAMETER ConfigPath
  swarm.json to run.

.PARAMETER WorkDir
  Scratch directory the agents work in. The swarm DB lands in <WorkDir>/.swarm/.

.PARAMETER Port
  Port for the temporary `opencode serve`.

.PARAMETER LogPath
  Progress log.

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
$script:Ready = $false
$script:ExitCode = 99   # 99 = the script died before reaching a decision
$StatusPath = [System.IO.Path]::ChangeExtension($LogPath, 'status.json')

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

# Kill the server and PROVE it is gone.
#
# A single taskkill is not sufficient, and that is measured, not theoretical: on
# the first run taskkill returned exit=128 against the listener PID and the port
# was still accepting afterwards. The listener PID is therefore re-read on every
# attempt, because killing a parent can leave a child holding the socket under a
# PID that was never the one we asked about. Success is defined as the port being
# free, not as taskkill returning zero.
function Stop-ServerAndVerify {
  param([int]$OnPort, [int]$Attempts = 4)
  for ($i = 1; $i -le $Attempts; $i++) {
    $listeners = Get-ListenerPids -OnPort $OnPort
    if ($listeners.Count -eq 0) {
      Write-Log "teardown: port $OnPort free after $(( $i - 1 )) attempt(s)"
      return $true
    }
    Write-Log "teardown: attempt ${i}/${Attempts} listeners=$($listeners -join ',')"
    foreach ($lp in $listeners) { Stop-ExactPid -ProcessId $lp -Label 'listener' }
    if ($script:LauncherPid) { Stop-ExactPid -ProcessId $script:LauncherPid -Label 'launcher' }
    Start-Sleep -Seconds 2
  }
  $left = Get-ListenerPids -OnPort $OnPort
  Write-Log "teardown: FAILED - port $OnPort still served by $($left -join ',')"
  return $false
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

  # ---- 1. start the server, WITH the swarm plugin injected ---------------
  # The plugin must be injected per-spawn through OPENCODE_CONFIG_CONTENT, which is
  # what the reference runSwarm does. Starting a bare `opencode serve` and then
  # attaching with --server skips that entirely, and the swarm_* tools simply do not
  # exist: agents asked to use them come back empty-handed with the run still
  # reporting "completed". That is exactly what the first run did, and it is a
  # silent failure, so the injection is asserted here rather than assumed.
  # WINDOWS/LAYOUT ADAPTATION: this path is repo-relative and the department restructure moved the
  # whole runtime tree under departments/03-CEO-AND-MVP-BUILDER/. The existence assertion below is
  # what catches that class of breakage, because a stale path here fails as a silently missing
  # plugin rather than as a loud error.
  $pluginPath = Join-Path $RepoRoot 'omega-endstate-build/departments/03-CEO-AND-MVP-BUILDER/runtime/vendor/opencode-swarm/plugin/swarm.ts'
  if (-not (Test-Path -LiteralPath $pluginPath)) {
    Write-Log "FAIL: swarm plugin not found at $pluginPath"
    $script:ExitCode = 4
    exit $script:ExitCode
  }
  $env:OPENCODE_CONFIG_CONTENT = (@{ plugin = @($pluginPath) } | ConvertTo-Json -Compress)
  Write-Log "OPENCODE_CONFIG_CONTENT=$($env:OPENCODE_CONFIG_CONTENT)"

  $server = Start-Process -FilePath 'opencode' `
    -ArgumentList @('serve', '--hostname=127.0.0.1', "--port=$Port") `
    -WorkingDirectory $WorkDir `
    -RedirectStandardOutput $serveOut -RedirectStandardError $serveErr `
    -PassThru -WindowStyle Hidden
  $script:LauncherPid = $server.Id
  Write-Log "server launcher pid=$($server.Id)"

  # ---- 2. wait for readiness (bounded) ------------------------------------
  $readyUrl = $null
  $sw = [System.Diagnostics.Stopwatch]::StartNew()
  while ($sw.Elapsed.TotalSeconds -lt $ReadyTimeoutSec) {
    if (Test-Path -LiteralPath $serveOut) {
      $raw = Get-Content -LiteralPath $serveOut -Raw -ErrorAction SilentlyContinue
      if ($raw -and $raw -match 'opencode server listening.*?on\s+(https?://\S+)') {
        $script:Ready = $true
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
  Write-Log ("ready={0} after {1}s url={2}" -f $script:Ready, [math]::Round($sw.Elapsed.TotalSeconds, 1), $readyUrl)

  if (-not $script:Ready) {
    Write-Log "FAIL: server never became ready"
    if (Test-Path -LiteralPath $serveOut) { Write-Log ("serve.stdout: " + ((Get-Content -LiteralPath $serveOut -Raw) -replace '\s+', ' ')) }
    if (Test-Path -LiteralPath $serveErr) { Write-Log ("serve.stderr: " + ((Get-Content -LiteralPath $serveErr -Raw) -replace '\s+', ' ')) }
    $script:ExitCode = 2
    exit $script:ExitCode
  }

  # ---- 3. run the swarm against the already-running server ----------------
  # --server means the swarm never spawns or tears down a server itself; this
  # script owns the lifecycle, so teardown cannot race the swarm.
  $swarmCli = Join-Path $RepoRoot 'omega-endstate-build/departments/03-CEO-AND-MVP-BUILDER/runtime/vendor/opencode-swarm/src/cli.ts'
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
    $script:ExitCode = 3
  } elseif ($swarm.ExitCode -eq 0) {
    $script:ExitCode = 0
  } else {
    $script:ExitCode = $swarm.ExitCode
  }
  Write-Log "swarm-exit=$($script:ExitCode)"

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
    Get-ChildItem -LiteralPath $report -Filter *.md | ForEach-Object {
      Write-Log "report: $($_.FullName) ($((Get-Item -LiteralPath $_.FullName).Length)b)"
    }
  } else {
    Write-Log 'report: NONE (swarm did not write .swarm/reports)'
  }
}
catch {
  Write-Log "EXCEPTION: $($_.Exception.Message)"
  $script:ExitCode = 9
}
finally {
  # ---- teardown: exact recorded PIDs, verified, always --------------------
  if ($script:SwarmPid) { Stop-ExactPid -ProcessId $script:SwarmPid -Label 'swarm' }
  $teardownOk = Stop-ServerAndVerify -OnPort $Port
  $left = Get-ListenerPids -OnPort $Port
  $marker = [ordered]@{
    finishedAt         = (Get-Date).ToString('o')
    exitCode           = $script:ExitCode
    port               = $Port
    serverReady        = $script:Ready
    launcherPid        = $script:LauncherPid
    swarmPid           = $script:SwarmPid
    teardownComplete   = $teardownOk
    listenersRemaining = @($left)
  }
  $marker | ConvertTo-Json | Set-Content -LiteralPath $StatusPath -Encoding utf8
  Write-Log "marker: $StatusPath"
  Write-Log '=== validate done ==='
  exit $script:ExitCode
}
