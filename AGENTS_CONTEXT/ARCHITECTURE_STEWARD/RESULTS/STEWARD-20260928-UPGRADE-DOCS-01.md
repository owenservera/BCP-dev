# Steward Result — Agent Upgrade Docs (goals + independent design)
## 2026-09-28

```text
SESSION_STATUS: INVESTIGATED
SESSION_ID: STEWARD-20260928-UPGRADE-DOCS-01
CFA / AGENT: Architecture Steward (solo DELIBERATE session; no CFA spawned — independence from dossier authorship is the point of the exercise)
IDENTITY: architecture-steward (ratified coordination role)
AGENT_ID: architecture-steward
TARGET_REF: main
BASE_MAIN_SHA: 53e0cfb3f4a881b9589d234ce71427c55b0d8c1e
TASK: owner-directed — (1) document the non-technical team-upgrade goals as a durable doc; (2) run an independent steward design session + architecture, documented; (3) assess which approach is faster to set up, easier to maintain, provides more value
EXECUTION_STRATEGY: solo deliberation — re-read all 12 dossier files whole from main; one observed-fact check (installed opencode CLI surface for resume/continue/fork/attach/session/export/stats); two docs authored; §9 log; receipt; single commit; final re-read + validator run. No spawns (would dilute independence), no runtime execution, no domain-semantic claims beyond steward scope.
STRATEGY_RATIONALE: the requested product is steward judgment contrasting with, not derived from, CFA-owned design work; all evidence already durable on main; the only new fact needed (resume-capable CLI surface) is obtainable read-only in seconds
RESULT: INVESTIGATED — (1) AGENT-TEAM-UPGRADE-GOALS-2026-09-28.md: 7 goals, current-state plain version, 4-step decision path, hold-firm principle; (2) AGENT-TEAM-UPGRADE-INDEPENDENT-DESIGN-2026-09-28.md: premise challenge (residency=cache with priced miss vs holding cost), Design B warm-standby (homes + M2 envelopes + observed resume/continue/fork + inbox-at-boot peer async), adopt-now dossier deltas, comparison table, recommendation (ratify B now, gate A behind R0-serve probe + caps), 4 ordered open probes, 3 falsifiers. Assessment: B faster to set up (days, ~80% exists) and easier to maintain (no new subsystem); A wins only on interactive latency IF it qualifies; risk-adjusted B-first with kill criteria. No implementation, no Ω change, no boundary activation.
FILES_CHANGED:
- docs/agent-system/AGENT-TEAM-UPGRADE-GOALS-2026-09-28.md (new)
- docs/agent-system/AGENT-TEAM-UPGRADE-INDEPENDENT-DESIGN-2026-09-28.md (new)
- docs/agent-system/FULL-INTEGRATION-TASK-LIST.md (§9 turn-log line)
- AGENTS_CONTEXT/ARCHITECTURE_STEWARD/RESULTS/STEWARD-20260928-UPGRADE-DOCS-01.md (this receipt)
COMMIT_SHA: PENDING-DELIVERY-COMMIT (single delivery commit; SHA in chat verification)
PREDECESSOR_VERIFIED: YES — HEAD 53e0cfb3 at session start (= merge-all delivery); tree clean except 2 known untracked auto-exports left alone; delegation standing (no spawn used or needed)
OWNER_ALIGNMENT: direct owner direction this turn (document goals; independent design; compare approaches)
LESSONS_UPDATED: NO
COMMONS: NONE
UNRESOLVED:
- resume probe (Task-issued ses_ IDs resumable?) — 5-minute probe, not run here
- measured spawn latency/cost baseline (prices Design B miss cost honestly)
- R0-serve probe (go/no-go for residency) — still the gating experiment
- standing: S.3b run; P2.4/U1 BLOCKED; H.1/H.2 BLOCKED; Phase 3 gated; owner question queue
BLOCKERS: NONE
BOUNDARIES_ACTIVATED: NONE
OMEGA_LAW_CHANGED: NO
IMPLEMENTATION_STARTED: NO (documentation only; validator untouched; runtime src untouched)
NEXT_REQUIRED_STEP: commit → final re-read + validator PASS → report DONE with assessment summary; S.3b remains the next execution frontier
```

## M1 metadata (v1.2 exemplar, DELIBERATE)

```text
MODE: DELIBERATE
SURFACE: LOCAL
WORK_ID: AGENT-UPGRADE-DOCS-01
goal_id: owner-direct-docs
attempt_id: 1
```

## Observed CLI facts (installed 1.18.4, this machine — evidence for Design B3)

`opencode run`: `-c/--continue`, `-s/--session <id>`, `--fork`, `--attach <url>`,
`--dir`, `--port`, `--file`, `--title`, `--share`, `--agent`, `--variant`,
`--auto`, `--format json`, `--print-logs`, `--log-level`. Top level:
`serve`, `attach`, `web`, `session`, `export [sessionID]`, `import`, `stats`,
`db`, `mcp`, `acp`, `agent`, `debug`, `providers`, `models`, `pr`, `github`,
`plugin`, `completion`. Serve/API surface CLI-confirmed present; BEHAVIOR
(wake reliability, ten-session cost) explicitly NOT proven — that is the R0 probe.
