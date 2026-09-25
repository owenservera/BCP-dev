# REPOSITORY-CLEANUP-REPORT — 2026-09-23

- Cleanup date: 2026-09-23
- Starting SHA: `18242a3b5db3db4cd672201e69a7fda88bfdf3f2`
- Ending SHA: the commit carrying this report (see `git log --oneline -1 -- docs/cleanup/`).
- Working state at freeze: clean tracked tree (`git status` showed only 4
  untracked paths, all left untouched). No other agent's committed work disturbed.

## Files moved (8, all via `git mv`, history preserved)

- `master-.md` → `docs/archive/sessions/master-.md`
- `session-ses_f371.md` → `docs/archive/sessions/session-ses_f371.md`
- `docs/chat-Git Bundle Vision and Core Capabilities_9-16.txt` → `docs/archive/conversations/`
- `docs/chat-Git Bundle Vision and Core Capabilities1-8 (MASTER UPDATE).txt` → `docs/archive/conversations/`
- `docs/chat-Git Bundle Vision and Core Capabilities1-8.txt` → `docs/archive/conversations/`
- `docs/chat-Omega-9-16 core upgrades_.txt` → `docs/archive/conversations/`
- `docs/Untitled.txt` → `docs/archive/conversations/`
- `docs/# Thoughts on a response.txt` → `docs/archive/conversations/Thoughts on a response.txt`

## Files modified (18, prepend-only banners / reference repairs — no history rewritten)

- `docs/archive/project-history/bcp-construction-2026-09-22/ORCHESTRATION-REDESIGN.md` — HISTORICAL banner (plan executed, Tasks 1–6 PASS)
- `docs/archive/project-history/bcp-construction-2026-09-22/TRACKER.md` — parked-snapshot note (time-bound 2026-09-22 orders expired)
- `README.md` — cold-start pointer + archived session-log path repair
- `docs/CONTEXT-system.md` — session-log path repair (1 line)
- `bcp-speed/bcp/agents/lanes.md` — universal-rules-current / first-leases-stale banner
- `bcp-speed/bcp/agents/inbox/W1..W5.md` — per-file STATUS banners (parked/stale/standing)
- `docs/archive/project-history/bcp-construction-2026-09-22/setupdocs/01,02,03-*.md` — SUPERSEDED CONSTRUCTION PACKET banners
- `docs/archive/project-history/bcp-construction-2026-09-22/setupdocs/04-AGENTS.md`, `05-BUILD_CONTEXT.md` — HISTORICAL-entry notes
- `bcp-speed/bcp/README.md` — generic-vs-instance (140 vs 49 caps) NOTE
- `omega-…/docs/forge/OMEGA-FORGE-ARCHITECTURE_plus.md` — SUPERSEDED PACKET banner (Wave 0 landed)

## Files created (10)

- `/AGENTS.md`, `/BUILD_CONTEXT.md`, `docs/CURRENT-CONTEXT.md` — cold-start path (§12)
- `docs/archive/README.md`, `docs/archive/sessions/README.md`,
  `docs/archive/conversations/README.md`, `docs/archive/project-history/bcp-construction-2026-09-22/setupdocs/README.md`
- `docs/cleanup/AUTHORITY-MAP.md`, `docs/cleanup/CONFLICT-REGISTER.md`, this report

## Files deleted (0)

No deletions. Cleanup ≠ deletion held throughout.

## Files deliberately retained in place

- All Ω decision records, forge docs, migration docs, annex (bannered where stale;
  Ω's own banner discipline — D-418/D-456 markers, annex "never law" README,
  migration README staleness notices — verified healthy, extended by 1 banner).
- BCP `state/` + `log/` (control-plane truth; untouched — not even line endings).
- VIVIM tree (read-only mine; zero modifications).
- All untracked paths (`bcp-algos/`, Ω `docs/architecture/`, `examples/plugin-echo2/`,
  `setupdocs.zip`) — another workstream's possible active surface; see C11.

## Code ambiguities found (all KEEP / INVESTIGATE — no code moved or removed)

| Path | Finding | Disposition |
|---|---|---|
| `bcp-speed/bcp/mcp-servers/bcp-mcp/server.py` vs `bcp_tool.py` | deliberate thin transport, grep-guarded against direct writes | KEEP |
| `serve-control.py` vs `ops-serve.ps1` | companion layers (HTTP control vs scheduled task) | KEEP |
| `patterns/`, `caps/` (README-only placeholders) | intentional growth points | KEEP |
| `work/` (gitignored lane scratch, `.gitkeep` only tracked) | by design | KEEP |
| `bcp-algos/` (untracked "Project Chameleon") | unknown relation to BCP; possibly active | INVESTIGATE (C11) |
| `omega-…/examples/plugin-echo2/` (untracked) | Prompt-4 substitution experiment | INVESTIGATE (C11) |
| `omega-…/docs/architecture/` (untracked) | Prompt-4 analysis docs | INVESTIGATE (C11) |

## Documentation ambiguities found

12 conflicts registered in `CONFLICT-REGISTER.md`: 7 resolved, 2 explained
(era-true, no action), 1 clarified (terminology), 3 open (C8 model counts,
C11 untracked workstream, C12 engine counts) — all with named owners.

## Broken references fixed (2)

- `README.md` root table → `docs/archive/sessions/` paths.
- `docs/CONTEXT-system.md` §8 predecessor-context → `docs/archive/sessions/` paths.
- Verified: no remaining references to old root paths of moved files
  (`git grep` for all 8 filenames returns only the new paths + in-file self-mentions).

## Known unresolved questions

- C8 / C12 (legacy counts) — owned by next assay touching those surfaces.
- C11 (untracked workstream) — owned by the repo owner, not by any agent.
- MIGRATION_MODEL.md promotion wording ("promote after #2") left verbatim:
  the deferral decision lives in MIGRATION_COMPARISON; editing the model doc
  (another workstream's active file) was judged riskier than the residual
  misread risk, which CURRENT-CONTEXT.md now covers.

## Cleanup scorecard

```text
total files audited (tracked) ............ 4143 (+4 untracked clusters noted)
significant documents classified ......... ~230 (rest: bulk mine/code by class)
  CURRENT ................................ ~60
  LAW .................................... ~150 (Ω D-records + BCP taxonomy/tie-breaker +
                                           invariants synthesis + decision contract)
  HISTORICAL ............................. ~40
  ARCHIVED ............................... 8 (+4 new archive READMEs)
  RAW-RESEARCH ........................... 8 (moved out of active paths)
  UNKNOWN ................................ 3 open conflicts + 4 hands-off paths
files moved .............................. 8
files modified (banners/repairs) ......... 18
files deleted ............................ 0
links repaired ........................... 2 files
duplicate document clusters .............. 2 (Ω PROPOSAL/ARCHITECTURE active+archive —
                                           already bannered + archive README; no action)
duplicate implementation clusters ........ 0 actionable (1 deliberate transport pair, kept)
instruction conflicts .................... 3 (C1/C2/C3 — all resolved via banners)
architectural conflicts .................. 4 (C4/C5/C6/C9 — explained or resolved)
unresolved conflicts ..................... 3 (C8/C11/C12 — named + owned)
```
