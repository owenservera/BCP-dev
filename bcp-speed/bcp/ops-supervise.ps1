# BCP-SPEED supervisor - session restart, no LLM calls (Task Scheduler: BCP-Supervise, every 2 min).
# Keeps BCP-Watchdog untouched. For each ACTIVE lease past stall without renew,
# and for master inactivity (no log signal from master IDs within N hours):
#   (a) release the stale lease as failed via bcp_tool (validated tool path),
#   (b) requeue per failure policy (failure entry, applies_to the cap),
#   (c) resolve agent->session via state/sessions.yaml, abort + delete +
#       recreate via serve-control.py, re-issue the lane inbox pointer.
# Master-is-watched: the master session is registered under its agent ID like
# any worker; same timestamp math, no exemptions. RESUME.md IS state
# (leases + inbox + discoveries) - no new file.
# ASCII-only, PS 5.1-safe. Dry run: powershell -ExecutionPolicy Bypass -File ops-supervise.ps1 -DryRun
param(
    [double]$StallHours = 2.0,
    [double]$MasterHours = 2.0,
    [string]$MasterIds = "AGT-coord,AGT-master",
    [switch]$DryRun
)
$ErrorActionPreference = "Continue"
Set-Location -LiteralPath $PSScriptRoot
$stamp = Get-Date -Format "yyyy-MM-ddTHH:mm:ssZ"
$prefix = "[supervise $stamp]"
if ($DryRun) { Write-Host "$prefix DRY RUN - no writes, no restarts" }

# 1. stale actives via the shared lib (same math as sweep: expires_at + stall)
$staleJson = python -c "import json, bcp_lib as lib; ws=lib.Workspace(); ents,_=lib.read_logs(); out=[]; [out.append({'cap':c,'holder':l.get('leased_to'),'why':lib.lease_health(l,ents,lib.now(),$StallHours)[1]}) for c,l in ws.leases.items() if isinstance(l,dict) and l.get('status')=='active' and lib.lease_health(l,ents,lib.now(),$StallHours)[0]!='ok']; print(json.dumps(out))" 2>&1 | Select-Object -Last 1
$stale = @()
try { $stale = $staleJson | ConvertFrom-Json } catch { Write-Host "$prefix state read failed: $staleJson" -ForegroundColor Red; exit 1 }
if (-not $stale -or $stale.Count -eq 0) { Write-Host "$prefix leases: no stale actives (stall ${StallHours}h)" }
foreach ($s in $stale) {
    $cap = $s.cap; $holder = $s.holder; $why = $s.why
    Write-Host "$prefix STALE $cap holder $holder ($why)" -ForegroundColor Yellow
    if ($DryRun) { continue }
    python bcp_tool.py lease release $cap --agent $holder --note "supervise: stalled ($why), status=failed" 2>&1 | Select-Object -First 1
    python bcp_tool.py failure add --agent AGT-supervise --applies-to $cap --text "supervise: $cap requeued after stall ($holder, $why); next holder resumes from state" 2>&1 | Select-Object -First 1
    # session restart via registry + serve API (best effort; serve may be down)
    $reg = python -c "import yaml; d=yaml.safe_load(open('state/sessions.yaml')) or {}; s=(d.get('sessions') or {}).get('$holder',{}); print(s.get('session_id',''))" 2>&1 | Select-Object -Last 1
    if ($reg -and $reg.Trim() -ne "") {
        $sid = $reg.Trim()
        python serve-control.py abort $sid 2>&1 | Select-Object -First 1
        python serve-control.py destroy $sid 2>&1 | Select-Object -First 1
        $inbox = "W1"; if ($holder -eq "AGT-b1") { $inbox = "W2" } elseif ($holder -eq "AGT-b2") { $inbox = "W3" } elseif ($holder -eq "AGT-c1") { $inbox = "W4" } elseif ($holder -like "AGT-coord*" -or $holder -like "AGT-master*") { $inbox = "W5" }
        $new = python serve-control.py create $holder 2>&1 | Out-String
        $m = [regex]::Match($new, '"id":\s*"([^"]+)"')
        if ($m.Success) {
            $nid = $m.Groups[1].Value
            python serve-control.py reg-set $holder $nid 2>&1 | Select-Object -First 1
            python serve-control.py message $nid "Resume. Read agents/inbox/$inbox.md and obey it every heartbeat. State (leases + inbox + discoveries) is your resume context." 2>&1 | Select-Object -First 1
            Write-Host "$prefix restarted $holder -> $nid (inbox $inbox re-issued)" -ForegroundColor Green
        } else { Write-Host "$prefix recreate for $holder failed: $new" -ForegroundColor Red }
    } else { Write-Host "$prefix no registry entry for $holder - lease requeued, no session to restart" }
}

# 2. master liveness: any log signal from master IDs within MasterHours?
$masterList = $MasterIds -split ","
$found = python -c "import datetime as dt, bcp_lib as lib; ids=set('$MasterIds'.split(',')); ents,_=lib.read_logs(); at=lib.now(); cut=at-dt.timedelta(hours=$MasterHours); print(any(e.get('agent') in ids and (lib.try_ts(e.get('ts')) or at) >= cut for e in ents))" 2>&1 | Select-Object -Last 1
if ($found -match "True") { Write-Host "$prefix master: live (signal within ${MasterHours}h)" }
else {
    Write-Host "$prefix master: QUIET past ${MasterHours}h (ids: $MasterIds)" -ForegroundColor Yellow
    if (-not $DryRun) { Write-Host "$prefix master quiet - restart on next registry hit; state (leases+inbox+discoveries) is the resume context, no RESUME.md" }
}
Write-Host "$prefix done"
