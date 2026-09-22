# BCP-dev — full snapshot (code + control plane + context)

Snapshot of the BCP-dev workspace as of 2026-09-22: two product baselines, the
BCP-SPEED control plane with its agentic automation, lane builds, and the full
context docs. Board state: Paths A+B merged (all L2, fixture-proven), Path C
released but unstarted, automation Tasks 1–6 PASS.

## Layout

| Path | Contents |
|---|---|
| `bcp-speed/bcp/` | BCP-SPEED control plane: `bcp_tool.py`, `validate.py`, `sweep.py`, `state/`, `log/`, `agents/`, `views/`, `work/` (lane builds), `mcp-servers/`, `.opencode/plugins/`, `serve-control.py`, `ops-*.ps1`, `workspaces/` (per-task RESULTs) |
| `omega-baseline/omega-final/` | Landing forge (product target, Chrome-canonical) |
| `vivim-original-baseline/vivim-final-enhanced/` | Legacy monolith (adapter seam, import source, NLCL mine) |
| `docs/` | `EXPERIMENTAL-PATHS.md`, chats, `CONTEXT-system.md`, `CONTEXT-product.md`, `CONTEXT-appendix.md` — read in that order |
| `TRACKER.md` | Owner one-glance board view |
| `ORCHESTRATION-REDESIGN.md` | Canonical automation design (wins over the brief on conflict) |
| `master-.md`, `session-ses_f371.md` | Past-session logs |

## Resume here

1. Read `docs/CONTEXT-system.md` → `docs/CONTEXT-product.md` → `docs/CONTEXT-appendix.md`.
2. `cd bcp-speed/bcp`; `python validate.py` (expect 0 errors); `python generate_views.py`.
3. Register timers: `powershell -ExecutionPolicy Bypass -File ops-install.ps1`.
4. Lanes resume by inbox (`agents/inbox/WN.md`) with `BCP_LANE_CAP`/`BCP_AGENT` set.

## What was left out (heavy / regenerable)

- `**/node_modules/`, `**/__pycache__/`, `*.pyc`, `**/.test-tmp/` — reinstall / regenerate.
- `bcp-speed.zip` — redundant copy of `bcp-speed/`.
- `vivim-final-enhanced/.opencode/` (~53MB plugin caches) — reinstall via bun.
- `vivim-final-enhanced/bundles/` (~45MB strip artifacts) — rebuild from repo.
- `omega-baseline/vivim-omega-final.bundle` (~3MB git bundle backup) — local only.
- Nested git histories (bcp 5d–5n, omega-final, vivim-final-enhanced) were detached
  so this snapshot is one clean tree; full `.git` backups live next to the source
  machine at `BCP-dev-gitbackups/` (local only, never pushed).
