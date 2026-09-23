# CONTEXT — System: BCP-SPEED, the automation around it, and what the master agent has to work with

Written 2026-09-22 by the master agent. Purpose: everything needed to understand
the machine and operate it. Companion doc: `CONTEXT-product.md` (experiments,
baselines, product built, assessment, next steps). Numbers below were re-read
from live state on the day of writing; re-run the probes before acting on them.

---

## 1. Who the master agent is and how it works

- I am the coordinator-assistant for `bcp-speed/bcp`. I activate on **any user
  message** — even "." means "sweep now" (standing orders: `agents/MY-LOOP.md`).
- Every activation runs the sweep in order: **read live state → validate →
  externally verify new depth bumps (my shell, never their transcript) → write
  inbox directives → owned commit → refresh TRACKER.md → compact report.**
- The user is a heartbeat, never a relay. I never ask the user to draft, paste,
  or check in on my behalf.
- Verify-twice rule (earned, now law): when lanes are LIVE, a failing suite gets
  exactly one immediate re-run before any verdict — agents save mid-edit and a
  first run can read a torn file (proven: 15 transient failures, green on re-run).
  Never touch their files mid-lease.

## 2. BCP-SPEED — what it is

A YAML-first **tracking substrate** (not a product): capabilities, leases, deps,
experiments, discoveries, failures, append-only log, generated views. Product
code lives in the baselines and lane `work/` dirs; BCP records what exists, who
claims what, and what was proven. Rule: **BCP tracks, Omega is the product. No
cross-repo REQUIRES edges.**

Key paths (all under `bcp-speed/bcp/`):

| Path | Role |
|---|---|
| `bcp_tool.py` | **The only write path.** Atomic locked read-modify-write, validates against taxonomy + deps, refuses invalid transitions, writes the log event in the same step |
| `bcp_lib.py` | Shared plumbing: atomic writes, lock file, duplicate-key detection, lease health math, metrics |
| `validate.py` | Full-state check. 0 errors required before any commit |
| `sweep.py` | Deterministic mechanics (see §4). `--fix --views` is what the timer runs |
| `generate_views.py` | Regenerates `views/map.html`, `workspace.html`, `graph.html` + `state/metrics.yaml` |
| `tests/test_bcp.py` | 28 end-to-end tests, green. Hermetic: `setUp` starts leases EMPTY so live lease records never leak into assertions |
| `state/*.yaml` | Source of truth: taxonomy, capabilities, leases, deps, experiments, discoveries, failures, metrics (+ `sessions.yaml`, Task-4 registry, intentionally validator-ignored) |
| `log/2026-09-22.yaml` | Append-only event bus (99 events at writing) |
| `agents/` | `bootstrap.md`, role files, `lanes.md` (LOOP PROTOCOL law), `MY-LOOP.md` (my orders), `prompts/`, `inbox/W1..W5.md` (directive channel) |
| `work/` | Gitignored lane scratch (real builds live here) |
| `maintain.ps1`, `ops-*.ps1`, `ops-hooks/`, `serve-control.py` | Automation (see §6) |

CLI surface (`python bcp_tool.py ...`, exit 0 ok / 1 refused-nothing-changed / 2 bad usage):
`lease acquire|renew|release` · `depth bump` · `log append` · `discovery|failure add` ·
`available` · `show`. Heartbeat **is** `lease renew` (~hourly; TTL 8h, stall 2h).

## 3. Law in one paragraph

- IDs: `FAM-nn.n` capabilities, `EXP-yyyy-nnn` experiments, `AGT-name` agents,
  `DISC-nnn`/`FAIL-nnn` notes. Anything off-taxonomy is REFUSED.
- Depths L0 SPEC → L1 STUB → L2 WORKS → L3 HARDENED. Depth only moves up,
  holder-only, deps must be satisfied first.
- Leases: 5 per scoped_builder / 3 per fullscope_builder, one live lease per
  capability globally, always with `--experiment` (cross-scope REFUSED),
  coordinators never hold build leases (REFUSED by design).
- Never hand-edit `state/` or `log/` — tool or MCP only; the pre-commit hook
  refuses corrupt commits.

## 4. Sweep mechanics (deterministic, no judgment)

1. Lease conflicts → earliest wins, losers dropped + logged. 2. Expired/stalled
   leases freed. 3. Unblocked agents notified. 4. All-in-scope-at-target
   experiments → `merging` + INTEGRATION_READY. 5. Findings → signals (once).
   6. Metrics recomputed. Judgment (rebalancing, invariants, require_human)
   stays with agents.

## 5. Lane architecture (zero-human design)

- Builders (W1 a1, W2 b1, W3 b2, W4 c1) loop on leases per LOOP PROTOCOL: after
  every release, same session, re-read inbox + lanes, take the next leasable cap.
  Report only in state. STOP only on: inbox STOP, zero leasable caps (log BLOCKED,
  3 heartbeats, stand by), unresolvable REFUSED (flag require_human).
- Coordinator (W5 AGT-coord) triages, never builds: validate + sweep cadence,
  inbox W5, gate checks, hygiene nudges marked `via AGT-coord`. Escalates by
  parking (log + stand by), never by messaging the user.
- Inbox `agents/inbox/WN.md` is the directive channel (newest-at-bottom, appends
  only). Owner autonomy grant (2026-09-22, in each experiment's standing_orders):
  builders decide HOW; installs/launches/live tests incl. live Chrome on
  owner-owned sessions are PRE-APPROVED in scope. Stop-and-flag only for: new
  caps/edges/invariants, cross-lane changes, production auto-publish, outside
  Chrome-only law (D-418/D-456).
- Coverage between my activations: maintain loop (mechanics) + LOOP PROTOCOL
  (leases keep moving) + inbox (standing orders). Quiet for a full TTL → leases
  expire, sweep frees, board parks clean — the designed rest state.

## 6. Automation built (hardening brief, Tasks 1–6, all PASS 2026-09-22)

| # | What | Files | Proven |
|---|---|---|---|
| 1 | Thin MCP transport over `bcp_tool` (13 `bcp_*` tools, subprocess-only, post-write `validate.py`) | `mcp-servers/bcp-mcp/server.py`, `requirements.txt`, `test_concurrent.py` | 2 concurrent acquires → exactly 1 OK; validate green; 0 direct-write paths |
| 2 | Project registration + prompt law | `opencode.json` (local `bcp` server, `bcp_*` gated, per-lane grants); +1 law line in 4 lane prompts + `lanes.md` | `opencode mcp list` → bcp connected; law 5/5 byte-present; live `available` returns `FAM-09.1` |
| 3 | Heartbeat ratification (already lease-renew; one-line prompt change) | 5 heartbeat lines | No heartbeat file exists; liveness = lease timestamps only (code search) |
| 4 | Serve control plane + session registry | `serve-control.py` (stdlib HTTP), `state/sessions.yaml`, `ops-serve.ps1` | Live on :4096: create→list→abort→destroy→recreate, cost 0; kill-serve → state safe |
| 5 | External watchdog (session restart, no LLM) | `ops-supervise.ps1` (2-min `BCP-Supervise`, wired in `ops-install.ps1`) | Dry-run clean; stale-detect + release-as-failed + requeue proven on throwaway copy |
| 6 | Idle-continuation plugin (gated on 1–5) | `.opencode/plugins/bcp-ralph.js` (`session.idle`, lane pinned via `BCP_LANE_CAP`/`BCP_AGENT`) | Syntax + 4-way matrix (prompt only when holding below target); live idle-fire deferred (board parked) |

Timers (Task Scheduler, all Ready at last check): BCP-Maintain 5m (`maintain.ps1
-Passes 1`), BCP-Commit hourly (validate-gated, never pushes), BCP-Watchdog 15m
(transition-gated DRIFT/REPAIRED + views freshness), BCP-Supervise 2m (registers
on next `ops-install.ps1` run), BCP-Serve ONSTART (on-demand, operator enables).
PowerShell discipline: ASCII-only `*.ps1`, no 3-arg Join-Path, `-NoProfile` on tasks.

Per-task evidence: `workspaces/task-N/RESULT.md`; conventions: `workspaces/DECISIONS.md`;
rollup: `workspaces/STATE.json`. vocab mapping: brief `task_id`/`lease_id` do not
exist — capability ID is the unit, lease key is the capability (holder-checked).

## 7. Live snapshot (2026-09-22, re-verify before use)

- 49 capabilities: **L2 37 · L1 7 · L0 5**. Active leases: **0** (all 8 records
  released/expired). Log 99 events · 21 discoveries · 1 failure. Validate 0/0.
- Experiments: 001 abandoned · 002 proposed (22 caps, L3) · 003 proposed (18 caps,
  L2) · **004 merging** (4 caps L2) · **005 merging** (4 caps L2) · 006 proposed
  (6 caps, entry `FAM-09.1` L0 unclaimed).
- Owed on resume: b1's formal b2-consumption word; c1's `09.1` claim.

## 8. What I have to work with, and limits

- Full shell in the workspace (PowerShell 7), file read/edit, web search/fetch,
  browser automation, image/video analysis. Installed: opencode 1.18.4, Python
  3.14.4 + pyyaml + mcp SDK 1.29.0, Node 24.
- I **cannot self-schedule** — between activations the timers + loops carry the
  system. I never push, never amend, never touch released-lease/log history,
  never modify Omega/Vivim repos from BCP-side work.
- Predecessor context: `docs/archive/sessions/master-.md` +
  `docs/archive/sessions/session-ses_f371.md` (past-session logs, archived
  2026-09-23),
  `TRACKER.md` (owner one-glance view), `ORCHESTRATION-REDESIGN.md` (canonical
  automation design — wins over the brief on conflict).
