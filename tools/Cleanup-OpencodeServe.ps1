# Cleanup-OpencodeServe.ps1 — find and terminate orphaned `opencode serve` processes (Windows)
#
# Usage:
#   pwsh tools/Cleanup-OpencodeServe.ps1                    # report only (dry run, always side-effect free)
#   pwsh tools/Cleanup-OpencodeServe.ps1 -Kill              # terminate confirmed orphans, then verify
#   pwsh tools/Cleanup-OpencodeServe.ps1 -Kill -Json        # machine-readable, for agent/CI assertions
#   pwsh tools/Cleanup-OpencodeServe.ps1 -IncludeAttached   # also consider serves with a live supervisor (never kills without -Kill)
#
# Exit codes:  0 = no orphans remain   1 = orphans present (report mode) or survived the kill pass, or the script failed
#
# WHAT IT ANSWERS
#   - Which `opencode serve` processes are orphaned (supervisor gone) and still burning CPU?
#   - Which are ATTACHED to a live supervisor, and must therefore be left alone?
#   - After a kill pass, did anything survive? Success is verified, never assumed.
#
# WHY THIS EXISTS
# A leaked `opencode serve` holds the stdout pipe write-end it inherited from whatever
# spawned it. The opencode `bash` tool completes on pipe EOF, not on process exit, so a
# surviving server pins the tool in `status: "running"` forever and the session has to be
# terminated by hand, losing in-memory context. Windows makes this near-certain:
#   - children inherit the parent's Job Object, so `detached: true` + `unref()` is not a
#     real detach (anomalyco/opencode #24731)
#   - overlapped pipes fail to emit `end` when a grandchild keeps the handle (#24784)
#   - the pipe buffer is 8KB on Windows vs 64KB on Linux, so a blocked writer deadlocks
#     fast (#32504)
# The usual trigger is a test or script whose cleanup runs only on the success path, or a
# `const` referenced by a callback defined before its declaration (temporal dead zone),
# which throws ReferenceError and skips the kill entirely. Observed 2026-09-28 at
# runtime/vendor/opencode-swarm/src/runner.ts:135.
#
# SAFETY POSTURE (fail-closed)
#   - Dry run unless -Kill is passed. Reporting is always side-effect free.
#   - Only processes whose CommandLine carries a `serve` token are ever candidates.
#     `opencode --auto` sessions are NEVER candidates, including the one running this.
#   - ORPHAN means the supervisor PID is absent from the process table. A serve whose
#     parent is still alive is reported ATTACHED and never killed implicitly.
#   - This script's own ancestor chain is hard-excluded from the candidate set.
#   - Two independent gates (-IncludeAttached AND -Kill) before touching a serve that
#     still has a live supervisor.
#   - Termination is tree-wide: `taskkill /T /F`. Negative-PID signalling
#     (`process.kill(-pid)`) is POSIX process-group semantics and is a no-op here;
#     killing only the launcher also leaves the child that owns the listening socket alive.
#   - A post-kill pass re-reads the process table. Survivors are reported and force a
#     nonzero exit.
#
# Authority: diagnostics tooling, outside runtime authority. Not Omega law, not semantic
# authority, not a task system. Orphan/attached classification and the taskkill itself are
# MECHANICAL; the decision to run it remains with the operator.

[CmdletBinding()]
param(
  # Actually terminate. Without this the script is a pure reporter.
  [switch]$Kill,

  # Also consider `serve` processes whose supervisor is still alive. Reported either way;
  # never killed unless -Kill is ALSO passed.
  [switch]$IncludeAttached,

  # Ignore orphans younger than this (minutes). Guards against racing a spawn whose
  # supervisor is momentarily absent. 0 = act on any confirmed orphan.
  [ValidateRange(0, 1440)]
  [int]$MinAgeMinutes = 0,

  # Emit a JSON object instead of the human-readable report.
  [switch]$Json
)

$ErrorActionPreference = "Stop"

# --- process table access -------------------------------------------------------
# Get-CimInstance is an in-process cmdlet: it spawns no OS child and holds no pipe, so it
# cannot itself hang the calling tool. This is the only discovery mechanism used.

function Get-OpencodeProcesses {
  # Name LIKE 'opencode%' rather than an equality filter so shim/launcher variants
  # (opencode.exe, opencode-x64.exe) are all seen. Nothing unrelated matches.
  @(Get-CimInstance Win32_Process -Filter "Name LIKE 'opencode%'" -ErrorAction SilentlyContinue)
}

function Test-IsServeCommand {
  param([string]$CommandLine)
  if ([string]::IsNullOrWhiteSpace($CommandLine)) { return $false }
  # --auto is a live interactive session. Excluded before any serve matching so a
  # path or flag containing "serve" can never promote a live session to a candidate.
  if ($CommandLine -match '(?i)--auto') { return $false }
  # Require `serve` as a whitespace-delimited token, not a substring.
  return ($CommandLine -match '(?i)(^|\s)serve(\s|$)')
}

function Get-ServePort {
  param([string]$CommandLine)
  $m = [regex]::Match([string]$CommandLine, '(?i)--port[= ]+(\d+)')
  if ($m.Success) { return [int]$m.Groups[1].Value }
  return $null
}

function Get-CpuSeconds {
  # Win32_Process reports kernel+user time in 100-nanosecond units. One query, no
  # per-PID Get-Process round trips.
  param($Proc)
  try {
    return [math]::Round((([double]$Proc.KernelModeTime + [double]$Proc.UserModeTime) / 1e7), 1)
  } catch {
    return 0.0
  }
}

function Get-AgeMinutes {
  param($Proc)
  try {
    return [math]::Round(((Get-Date) - [datetime]$Proc.CreationDate).TotalMinutes, 1)
  } catch {
    return 0.0
  }
}

# Walk the parent chain to build the set of PIDs this script must never touch. Includes
# $PID (the pwsh running this file) and every ancestor up to the init/root process.
function Get-AncestorPidSet {
  param([int]$StartPid, [hashtable]$ByPid)
  $set = @{}
  $cur = $StartPid
  $guard = 0
  while ($cur -gt 0 -and $guard -lt 64) {
    if ($set.ContainsKey($cur)) { break }          # cycle guard
    $set[$cur] = $true
    if (-not $ByPid.ContainsKey($cur)) { break }   # reached a non-opencode or dead ancestor
    $cur = [int]$ByPid[$cur].ParentProcessId
    $guard++
  }
  return $set
}

# --- classification -------------------------------------------------------------

function Get-ServeInventory {
  param([int]$SelfPid)

  $all = Get-OpencodeProcesses

  $byPid = @{}
  foreach ($p in $all) { $byPid[[int]$p.ProcessId] = $p }

  $serve = @($all | Where-Object { Test-IsServeCommand $_.CommandLine })
  $servePidSet = @{}
  foreach ($p in $serve) { $servePidSet[[int]$p.ProcessId] = $true }

  $ancestors = Get-AncestorPidSet -StartPid $SelfPid -ByPid $byPid

  # A shim launch pair looks like: parent = `opencode ... serve` (shim), child =
  # `"...\tools\opencode.exe" serve ...` (real binary). The child inherits the Job
  # Object and owns the listening socket. Treat the outermost serve as the root and
  # attribute the whole serve subtree to it, so one root maps to one kill decision.
  $rootOf = @{}
  foreach ($p in $serve) {
    $cur = $p
    $guard = 0
    while ($servePidSet.ContainsKey([int]$cur.ParentProcessId) -and $guard -lt 32) {
      if (-not $byPid.ContainsKey([int]$cur.ParentProcessId)) { break }
      $cur = $byPid[[int]$cur.ParentProcessId]
      $guard++
    }
    $rootOf[[int]$p.ProcessId] = [int]$cur.ProcessId
  }

  $rows = @()
  foreach ($p in $serve) {
    $pid_ = [int]$p.ProcessId
    $parentPid = [int]$p.ParentProcessId
    $rootPid = $rootOf[$pid_]
    $supervisorAlive = ($parentPid -gt 0) -and $byPid.ContainsKey($parentPid)
    $isProtected = $ancestors.ContainsKey($pid_) -or $ancestors.ContainsKey($rootPid)

    $rows += [pscustomobject]@{
      Pid           = $pid_
      ParentPid     = $parentPid
      RootPid       = $rootPid
      IsRoot        = ($pid_ -eq $rootPid)
      Port          = Get-ServePort $p.CommandLine
      CpuSeconds    = Get-CpuSeconds $p
      AgeMinutes    = Get-AgeMinutes $p
      SupervisorAlive = $supervisorAlive
      IsProtected   = $isProtected
      CommandLine   = [string]$p.CommandLine
    }
  }

  return @{
    All       = $all
    ByPid     = $byPid
    Rows      = $rows
    Ancestors = $ancestors
  }
}

function Get-CandidateRoots {
  param($Inventory, [int]$MinAge)

  $candidates = @()
  foreach ($r in $Inventory.Rows) {
    if (-not $r.IsRoot) { continue }        # one decision per tree, made at the root
    if ($r.IsProtected) { continue }        # never touch our own ancestry
    if ($r.SupervisorAlive) { continue }    # attached: only via -IncludeAttached -Kill

    if ($MinAge -gt 0 -and $r.AgeMinutes -lt $MinAge) { continue }

    # Collect the whole serve subtree under this root so the report shows what the
    # tree-kill will actually take down. CPU is summed across the subtree: the launcher
    # shim sits near zero while the child that owns the socket is the one burning cycles,
    # so reporting the root's CPU alone would understate the leak and invite a skip.
    $members = @($Inventory.Rows | Where-Object { $_.RootPid -eq $r.RootPid })
    $subtree = @($members | ForEach-Object { $_.Pid })
    $subtreeCpu = [math]::Round((($members | Measure-Object -Property CpuSeconds -Sum).Sum), 1)
    $busiest = ($members | Sort-Object -Property CpuSeconds -Descending | ForEach-Object { $_.Pid })[0]

    $candidates += [pscustomobject]@{
      RootPid        = $r.RootPid
      SubtreePid     = $subtree
      Port           = $r.Port
      CpuSeconds     = $subtreeCpu
      BusiestPid     = $busiest
      AgeMinutes     = $r.AgeMinutes
      CommandLine    = $r.CommandLine
    }
  }
  return @($candidates)
}

function Invoke-TreeKill {
  param([int]$TargetPid)
  # Short-lived native command. No pipeline truncation, no backgrounding, so it does not
  # engage the inherited-pipe hang class. Tree-wide on purpose.
  $out = & taskkill /T /F /PID $TargetPid 2>&1
  return @{ Exit = $LASTEXITCODE; Out = (($out | Out-String).Trim()) }
}

# --- main -----------------------------------------------------------------------

$selfPid = $PID
$inventory = Get-ServeInventory -SelfPid $selfPid

$orphanRoots = Get-CandidateRoots -Inventory $inventory -MinAge 0
$attachedRoots = @($inventory.Rows | Where-Object { $_.IsRoot -and $_.SupervisorAlive -and -not $_.IsProtected })

# Age gate applies to the orphan set only.
if ($MinAgeMinutes -gt 0) {
  $orphanRoots = @($orphanRoots | Where-Object { $_.AgeMinutes -ge $MinAgeMinutes })
}

# Attached trees are gated behind BOTH switches.
$attachedKillable = ($IncludeAttached -and $Kill)
$attachedTargets = @()
if ($attachedKillable) {
  $attachedTargets = @($attachedRoots | Where-Object { $_.AgeMinutes -ge $MinAgeMinutes })
}

$targets = @($orphanRoots) + $attachedTargets

$killed = @()
$killErrors = @()
if ($Kill -and $targets.Count -gt 0) {
  foreach ($t in $targets) {
    # Only ever tree-kill a root that was proven to have a dead supervisor, or one the
    # operator explicitly opted into via -IncludeAttached -Kill.
    $r = Invoke-TreeKill -TargetPid $t.RootPid
    if ($r.Exit -eq 0) {
      $killed += $t.RootPid
    } else {
      $killErrors += [pscustomobject]@{ Pid = $t.RootPid; Detail = $r.Out }
    }
  }
}

# --- verify: re-read the table, never assume success ----------------------------
$survivors = @()
$stillAttached = @()
if ($Kill) {
  Start-Sleep -Milliseconds 400
  $post = Get-ServeInventory -SelfPid $selfPid
  $postOrphanRoots = Get-CandidateRoots -Inventory $post -MinAge $MinAgeMinutes
  $survivors = @($postOrphanRoots | ForEach-Object { $_.RootPid })
  $stillAttached = @($post.Rows | Where-Object { $_.IsRoot -and $_.SupervisorAlive -and -not $_.IsProtected })
} else {
  $stillAttached = @($attachedRoots)
}

# Clean means "no orphaned serve remains". In REPORT mode nothing was removed, so
# pre-existing orphans ARE the finding and must never be reported as clean — otherwise a
# CI/agent gate built on this exit code would pass a dirty machine.
$clean = if ($Kill) { ($survivors.Count -eq 0) } else { ($orphanRoots.Count -eq 0) }

# --- report ---------------------------------------------------------------------
if ($Json) {
  [pscustomobject]@{
    SelfPid        = $selfPid
    OrphanRoots    = @($orphanRoots | ForEach-Object {
      [pscustomobject]@{
        RootPid = $_.RootPid; SubtreePid = $_.SubtreePid; Port = $_.Port
        CpuSeconds = $_.CpuSeconds; BusiestPid = $_.BusiestPid
        AgeMinutes = $_.AgeMinutes; CommandLine = $_.CommandLine
      }
    })
    AttachedRoots  = @($stillAttached | ForEach-Object {
      [pscustomobject]@{
        RootPid = $_.RootPid; Port = $_.Port; CpuSeconds = $_.CpuSeconds
        AgeMinutes = $_.AgeMinutes; CommandLine = $_.CommandLine
      }
    })
    Killed         = $killed
    KillErrors     = @($killErrors)
    Survivors      = $survivors
    Clean          = $clean
  } | ConvertTo-Json -Depth 6
} else {
  Write-Output "Cleanup-OpencodeServe — self pid=$selfPid  mode=$(if ($Kill) { 'KILL' } else { 'REPORT' })"
  Write-Output ""

  if ($orphanRoots.Count -eq 0 -and $stillAttached.Count -eq 0) {
    Write-Output "CLEAN: no `opencode serve` processes found."
  } else {
    if ($orphanRoots.Count -gt 0) {
      Write-Output ("ORPHANED serve trees (supervisor gone) — {0} tree(s), {1} process(es):" -f $orphanRoots.Count, (@($orphanRoots | ForEach-Object { $_.SubtreePid }).Count))
      foreach ($t in $orphanRoots) {
        $portTxt = if ($null -eq $t.Port) { "port=?" } else { "port=$($t.Port)" }
        Write-Output ("  root pid={0} {1} subtree_cpu={2}s (busiest pid {3}) age={4}min subtree=[{5}]" -f $t.RootPid, $portTxt, $t.CpuSeconds, $t.BusiestPid, $t.AgeMinutes, ($t.SubtreePid -join ','))
        Write-Output ("    {0}" -f $t.CommandLine)
      }
      if (-not $Kill) {
        Write-Output "  -> reported only. Re-run with -Kill to terminate."
      } else {
        Write-Output ("  -> killed root pids: {0}" -f $(if ($killed.Count) { $killed -join ',' } else { "none" }))
        foreach ($e in $killErrors) {
          Write-Output ("  -> KILL FAILED pid={0}: {1}" -f $e.Pid, $e.Detail)
        }
      }
      Write-Output ""
    }

    if ($stillAttached.Count -gt 0) {
      Write-Output ("ATTACHED serve trees (supervisor ALIVE) — left alone: {0} tree(s)" -f $stillAttached.Count)
      foreach ($t in $stillAttached) {
        $portTxt = if ($null -eq $t.Port) { "port=?" } else { "port=$($t.Port)" }
        Write-Output ("  root pid={0} {1} cpu={2}s age={3}min" -f $t.RootPid, $portTxt, $t.CpuSeconds, $t.AgeMinutes)
      }
      if ($attachedKillable) {
        Write-Output "  -> -IncludeAttached -Kill given: these WERE targeted above."
      } else {
        Write-Output "  -> not orphans; not killed. Use -IncludeAttached -Kill only if you are certain."
      }
      Write-Output ""
    }
  }

  if ($Kill) {
    if ($clean) {
      Write-Output "VERIFY: clean — no orphaned serve remains."
    } else {
      Write-Output ("VERIFY: FAILED — orphan root(s) survived: {0}" -f ($survivors -join ','))
    }
  } else {
    if ($clean) {
      Write-Output "RESULT: clean — nothing to do."
    } else {
      Write-Output ("RESULT: {0} orphaned serve tree(s) present. Exit 1. Re-run with -Kill." -f $orphanRoots.Count)
    }
  }
}

if ($clean) { exit 0 }
exit 1
