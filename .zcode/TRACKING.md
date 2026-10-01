# Ω tracking — consolidated PM board

> Status: ACTIVE · set up 2026-10-01
> What this is: the single rollup view of who is doing what, in which lane, with what evidence —
> the project-management tracking layer of the team system. The daily standup reads it, the
> Steward updates it, the Monday audit verifies it.
> What this is NOT: not authority, not a second task store. Every row cites its durable home
> (workstream file, agent TASKS.md, decision ledger, run receipt) and the home stays
> authoritative. A row that cannot cite its home is a defect to fix, not content to keep.
> Lineage: discharges the WS-4 purpose ("queues truthful, every file owned") for the tracking
> layer; built under D-TEAM-014's disposition discipline and the mainline rule against parallel
> bureaucracy — this is a projection with links, not a competing store.

## Update protocol

1. **Steward** updates this file at session close and whenever a row's status changes; each
   change gets a dated line in the session log.
2. **Daily standup** (automation-85b0ebf5, 09:00) reads this file first, verifies each row
   against its cited home, and reports drift — it never silently edits rows.
3. **Monday audit** (automation-cdeac028, 09:30) sample-verifies DONE/LANDED rows against repo
   evidence and runs the housekeeping sweep ([HOUSEKEEPING.md](HOUSEKEEPING.md)).
4. Status vocabulary mirrors the workstream lifecycle: PROPOSED · ACTIVE · TEAM-DECIDED ·
   BLOCKED-EVIDENCE · LANDED (gates green; receipt pending) · DONE (verified, receipt cited) ·
   PAUSED · SUPERSEDED.

## Workstream rollup

Authority: [workstreams/WORKSTREAMS.md](workstreams/WORKSTREAMS.md) and the per-lane files.

| Lane | Status | Next action | Home |
|---|---|---|---|
| WS-1 Truth Repair | ACTIVE — items 1–6 landed; exit pending | fresh `omega-reality-check` sweep (zero confirmed high/medium drift) + per-item verify receipts | [WS-1](workstreams/WS-1-truth-repair.md) |
| WS-2 Commons Bootstrap | ACTIVE (TEAM-DECIDED D-001…003) — backlog not yet executed | item 1: D-457-style human-principal amendment record | [WS-2](workstreams/WS-2-commons-bootstrap.md) |
| WS-3 Dashboard v1 | ACTIVE after WS-2 (D-004…006) — not started | item 1: D-458 placement decision record; the live Commons client waits on WS-2's smoke exchange | [WS-3](workstreams/WS-3-dashboard-v1.md) |
| WS-4 Reconciliation & Hygiene | ACTIVE — items 1/2/3 done (D-014) | item 4: fresh queues sweep; standing hygiene cadence lives in [HOUSEKEEPING.md](HOUSEKEEPING.md) | [WS-4](workstreams/WS-4-reconciliation.md) |
| WS-5 Ω Core Build | PROPOSED (gate D-007: WS-1 green) | when the gate opens, an S3 panel names the first lane from forge BACKLOG.md | [WS-5](workstreams/WS-5-core-build.md) |

## Active task register

Cross-home tasks with an owner, a home and a next action. LANDED/DONE rows stay here until the
Monday audit verifies them, then compress into the session log.

| # | Task | Home | Lane | Status | Evidence / next action |
|---|---|---|---|---|---|
| T-01 | WS-1 item 4 — D-213 decisions-gate hole (index-only rows) | [WS-1](workstreams/WS-1-truth-repair.md) | WS-1 | LANDED — receipt pending | run dwfrun-ca04737e, commit 08ddf708; `omega:test` + `omega:quick` green |
| T-02 | WS-1 item 5 — verify-status real 1500 host-wall | [WS-1](workstreams/WS-1-truth-repair.md) | WS-1 | LANDED — receipt pending | same corridor as T-01 |
| T-03 | WS-1 exit — fresh sweep + per-item receipts | [WS-1](workstreams/WS-1-truth-repair.md) | WS-1 | ACTIVE | close WS-1 on zero confirmed high/medium drift |
| T-04 | Commons bootstrap items 1–4 | [WS-2](workstreams/WS-2-commons-bootstrap.md) | WS-2 | ACTIVE — not started | first live principal `agent:steward-zcode`; amendment record D-457-style |
| T-05 | Dashboard v1 items 1–5 | [WS-3](workstreams/WS-3-dashboard-v1.md) | WS-3 | PROPOSED after WS-2 | D-458 record first; realtime client depends on T-04 |
| T-06 | WS-4 item 4 — fresh queues sweep | [WS-4](workstreams/WS-4-reconciliation.md) | WS-4 | ACTIVE | zero confirmed high/medium queue drift closes WS-4 |
| T-07 | WS-5 first-lane selection | [WS-5](workstreams/WS-5-core-build.md) | WS-5 | PROPOSED | gate: WS-1 exit green; S3 panel picks from forge BACKLOG.md |
| T-08 | Stage-E L3 graph-bundle contract | [ARCHITECTURE_STEWARD/TASKS.md](../AGENTS_CONTEXT/ARCHITECTURE_STEWARD/TASKS.md) | Path-A portfolio | READY | one bounded L3 contract/design pass, receipt, stop |
| T-09 | Core adequacy/reduction exercise | [CORE_VS_PLUGIN_BOUNDARY/TASKS.md](../AGENTS_CONTEXT/CORE_VS_PLUGIN_BOUNDARY/TASKS.md) | boundary research | READY | targeted exercise vs the 125-row inventory; TASKS.md seeded 2026-10-01 |
| T-10 | Evolution research reconciliation | [EVOLUTION/TASKS.md](../AGENTS_CONTEXT/EVOLUTION/TASKS.md) | evolution research | READY | reconcile the twelve dimensions into the change constitution; seeded 2026-10-01 |
| T-11 | Self-knowledge resume gate | [PERSONAL_AGENT/TASKS.md](../AGENTS_CONTEXT/PERSONAL_AGENT/TASKS.md) | personal agent | PAUSED | resume only after reconciling with the owner's newer symbolic-language design |
| T-12 | Destination frontier characterization | [PRODUCT_VISION/TASKS.md](../AGENTS_CONTEXT/PRODUCT_VISION/TASKS.md) | product vision | READY | L-1 frontiers via the invariant/bypass/minimality test; seeded 2026-10-01 |
| T-13 | Model-fallback watchdog | [TEAM.md](TEAM.md) | system | DONE | created 2026-10-01 — automation-48094acf; first fire tests whether `openrouter/free` is serving (UNKNOWN until then) |

## Decisions in effect

Ledger: [board/DECISIONS.md](board/DECISIONS.md) — head **D-TEAM-015** (deliberation cost
discipline: verify citations, never re-derive the corpus). The owner-override register sits at
the top of that file; silence means a TEAM-DECIDED entry stands.

## Housekeeping

Register: [HOUSEKEEPING.md](HOUSEKEEPING.md). As of 2026-10-01 the working tree is clean of
unexplained entries: `plugins/` committed as first-party tooling; `debug.log` and the generated
testkit fixtures parked by `.gitignore` per D-TEAM-014; heavy artifacts remain parked on disk
with recorded revisit conditions.

## System heartbeat (automations)

| Automation | Schedule | Duty | State |
|---|---|---|---|
| Ω daily standup | daily 09:00 | reads this board + the queues; reports drift + one next action; modifies nothing | active — automation-85b0ebf5 |
| Ω completion-gate audit + housekeeping sweep | Mondays 09:30 | verifies DONE/LANDED rows vs repo evidence; hygiene sweep of the working tree | active — automation-cdeac028 |
| Model-fallback watchdog | every 30 min | applies the D-TEAM-013 ladder to provider-stopped runs; read-only otherwise | active — automation-48094acf · first fire = the live test of `openrouter/free` |

## Session log (append-only, newest first)

- **2026-10-01** — tracking layer set up: TRACKING.md (this file), HOUSEKEEPING.md, TASKS.md
  seeded in the four peer homes (CORE_VS_PLUGIN_BOUNDARY, EVOLUTION, PERSONAL_AGENT,
  PRODUCT_VISION) per the AGENTS.md task-queue convention. Untracked entries dispositioned per
  D-TEAM-014: `plugins/` committed (agent-observatory, first-party MCP tooling); `debug.log` +
  testkit `.gen-deep/` parked via `.gitignore`. Drift found while seeding: WORKSTREAMS.md still
  showed WS-1 items 4/5 "in flight" after they landed (08ddf708) — index corrected. Standup and
  Monday automations rewired to consume this board.
- **2026-10-01 (cont.)** — T-13 closed: model-fallback watchdog created (automation-48094acf,
  every 30 min, prompt verbatim from TEAM.md). All three designed heartbeat automations are now
  active; the one-cron-per-session limit did not block this session. UNKNOWN until first fire:
  whether `openrouter/free` is actually serving.
