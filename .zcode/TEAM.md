# Ω ZCode Team — charter

> Status: ACTIVE · set up 2026-09-29
> Lane: **VIVIM Ω core** (`omega-baseline/omega-final`). The OpenCode OS phase specs (OS/01–05) and the resident-team lab are **on hold** — no capacity is spent there.
> Substrate: ZCode dynamic workflows (`.zcode/workflows/*.dwf.ts`) + cron automations. This file is the durable map; the workflow files are the mechanism.

> **Two layers.** This file charters the *execution* team. The strategy layer is the
> **Ω Board** — [board/CHARTER.md](board/CHARTER.md) — which seats a flexible panel (max 3
> deliberating agents, picked per task from [ROSTER.md](ROSTER.md)) that proposes and debates
> and hands the owner decision memos; the team below executes what the owner ratifies. Run a
> board session with the saved workflow `omega-board` (pass a `focus`, or name the `panel`). Standing work is organized into **workstreams**:
> [workstreams/WORKSTREAMS.md](workstreams/WORKSTREAMS.md) (WS-1 truth repair, WS-2 commons
> bootstrap, WS-3 dashboard v1, WS-4 reconciliation, WS-5 core build) — the daily standup
> reports their status.

## Design rules (why it looks like this)

1. **Repo is durable truth; ZCode runs are disposable.** Every run publishes a report artifact, and substantive results get committed to the repository by the Steward. A run dying loses nothing that was reported.
2. **Delegation is a grant, not a boolean.** Each role has an explicit grant: which workers it may spawn, how many, what they may write. `maxDepth: 1` everywhere — workers never spawn workers (substrate-enforced: workflow subagents cannot start workflows).
3. **Chat-reported completion is not completion.** Only `omega-verify` (or a committed receipt checked against the repo) promotes work to DONE.
4. **Token economy.** Workers receive paths, never file contents. Results are narrow typed objects. Fan-out is the default; joins happen only at synthesis. The plan reviewer persists across review rounds to reuse its context. Every gate is a deterministic command (`world.run`), never a worker's claim.
5. **Flexible panels, capped deliberation (owner amendment 2026-09-30).** Members are picked per task from [.zcode/ROSTER.md](ROSTER.md); a deliberation panel never exceeds **3 deliberating agents** — a bigger question means more rounds, not a bigger cast. Read-only investigation may still fan out; the cap binds deliberation, not investigation. Panel composition and pick-reasons are recorded in the minutes.
6. **No human answer ever blocks (owner directive 2026-09-30).** A question that would have parked a lane becomes a team decision in the same session: the panel is spawned per severity (S1 = 1 member, S2 = proposer + challenger, S3 = 3 with rollback), decides, records it in [board/DECISIONS.md](board/DECISIONS.md) with reason/evidence/alternatives/revisit-condition, and work continues. The owner is informed, not asked; any decision is theirs to override at any time, and silence means it stands. Full policy: [DECISIONS-POLICY.md](DECISIONS-POLICY.md).

## Roles and delegation grants

| Role (saved workflow) | Responsibility | Workers it spawns (grant) | Write scope |
|---|---|---|---|
| **Steward** (the session) | Sequencing, delegation, promoting results into the repo, owner interface | Runs any role below; never implements directly | repository (commits) |
| **Reality sweep** (`omega-reality-check`) | Standing state: Ω law, destination boundary, substrate docs, task queues, working tree; drift detection | 5 area readers (read-only) + 1 drift checker per drift claim (read-only) | none — report only |
| **Boundary resident** (`omega-boundary-audit`) | Audits the destination responsibility matrix against the real implementation; catches false "implemented" claims | 1 scout, ≤8 section auditors (read-only), 1 impl-checker per claimed-implemented row, 1 synthesizer | none — report only |
| **Research resident** (`omega-research`) | Answers one bounded question through independent lenses | 1 scout, ≤6 lens investigators (read-only), 1 confirmer per material finding, 1 synthesizer | none — report only |
| **Build resident** (`omega-build`) | Lands one bounded change with gates | 1 planner (read-only), 1 plan reviewer (read-only, ≤3 rounds), 1 builder (writes), 1 gate-fixer (conditional), 1 verifier (read-only) | builder/fixer: only files the plan names; gates `omega:test` + `omega:quick` |
| **Completion gate** (`omega-verify`) | Verifies every completion claim in a receipt/report/text against durable repo evidence | 1 claim extractor, 1 verifier per claim (read-only) | none — verdict only |

Shared worker types every role may use: **readers** (read-only, cite paths), **checkers** (read-only, reproduce one claim), **builder** (bounded writes). Workers have no Commons identity and no spawn rights; their lineage lives in the run journal and their results in the report artifact.

## Alignment with the departments / truth-chain model (Path B)

The Ω End-State Build on `team/omega-endstate` organizes itself into departments
(`omega-endstate-build/project-management/departments/`) under the governing mission
**"Full VIVIM beta ready to distribute for free"**, bound by
`TRUTH-CHAIN-SEED.md` (v0.1, informational): trust belongs to a traceable chain
(IDENTITY → SCOPE → OBSERVATION → EVIDENCE → INTERPRETATION → DECISION → EXECUTION → OUTCOME →
LEARNING), and the separations IDENTITY≠AUTHORITY, OBSERVATION≠EVIDENCE, CONFIDENCE≠PROOF,
DOCUMENTATION≠IMPLEMENTATION, CANDIDATE≠REALIZATION, UNKNOWN≠FAILURE are never collapsed.

The ZCode team is the same division of powers, mechanized:

| Path-B department / resident | ZCode counterpart |
|---|---|
| Dept 01 Research & Alignment (COORD-01, PROV-01) | `omega-research`, `omega-reality-check` — findings are labelled, never authority |
| Dept 02 Truth & Trust (VER-01 verification) | `omega-verify` + `omega-build`'s verifier and gates |
| Dept 02 VETO (advisory Mission Governor) | fresh-eyes plan reviewer + independent confirmers/challengers in every workflow (advisory, never gate-owning) |
| Dept 03 CEO & MVP Builder (DEVOPS-01, STEW-01) | `omega-build` corridor + the Steward committing results |

Operating rules adopted from the truth chain: **UNKNOWN is not PASS** (verdicts are
verified / partial / unproven / refuted, with BLOCKED-EVIDENCE available); self-evaluated
results are always **visible as self-evaluated** (per owner decision D-2026-09-28);
consequential run reports are committed to the repository as receipts so the chain survives
the run; platform/condition limits are recorded as N/A or UNKNOWN, never converted to PASS;
every turn closes by publishing the current task queue as a visibility table (TURN-CLOSE
protocol), which the daily standup automation performs on schedule.

## Model assignment (per workflow run)

ZCode sets one model per run for all that run's subagents (`subagent_model`). Owner directive
2026-09-29: the Zen free tiers are not working — **all roles run on `openrouter/stealth/space-bunny-alpha`**:

| Role (workflow) | Model |
|---|---|
| `omega-build` | `openrouter/stealth/space-bunny-alpha` |
| `omega-verify` | `openrouter/stealth/space-bunny-alpha` |
| `omega-boundary-audit` | `openrouter/stealth/space-bunny-alpha` |
| `omega-reality-check` | `openrouter/stealth/space-bunny-alpha` |
| `omega-research` | `openrouter/stealth/space-bunny-alpha` |

Token economy still applies at the workflow design level: workers receive paths not contents,
results are narrow typed objects, and fan-out joins only at synthesis — the model is strong, so
the discipline is what keeps runs lean. If the free tiers come back, the per-role split in git
history of this file can be restored.

## Model fallback ladder (owner directive 2026-09-30)

Runs carry one model for all their subagents, and ZCode has **no in-script model fallback** —
provider errors never reach the script. Two classes, handled differently:

- **Transient** (network error, timeout, rate limit, overload) — the runtime retries without limit
  and adapts the fan-out. Do nothing; a run stalled on these is *waiting*, not broken.
- **Deterministic** (quota cap, model not in plan, invalid request) — the run stops with
  `stop_reason: provider`. **This is the ladder's trigger.**

**Ladder** — applied only on the deterministic class, one rung at a time:

| Rung | Model | Notes |
|---|---|---|
| 1 | `openrouter/free` | OpenRouter free-model routing — configured in the host registry |
| 2 | `openrouter/auto` | OpenRouter automatic routing |
| 3 | `openrouter/stealth/space-bunny-alpha` | last resort; known to complete |

**Rules:** relaunch with `AmendWorkflow` changing only `subagent_model` — finished work imports as
cache, so a rung change re-pays only the unfinished steps. Never touch a run stopped
`reason: user`. Never apply the ladder to a *script* error (e.g. `args.task is required`) — those
need a script fix, not a different model. Record each rung change in the run's lineage.

**Watchdog:** a scheduled automation applies the ladder automatically (every 30 minutes). This
session holds its one automation, so create it from a fresh chat — prompt preserved below.
UNKNOWN until first fire: whether `openrouter/free` is actually serving (it is configured, but
unverified in this workspace) — the watchdog's first live action is also its test.

<details><summary>Prompt for the model-fallback watchdog automation (create from a new chat)</summary>

> You are the model-fallback watchdog for the VIVIM Ω workspace C:\0-BlackBoxProject-0\Vivim-omega\BCP-dev.
> Every 30 minutes: (1) call ListWorkflowRuns and inspect runs that are `stopped` with stop_reason
> `provider`, or `errored` with a model/provider condition (quota cap, model not in plan, invalid
> request) rather than a script error. (2) For each qualifying run, apply the next rung of the
> fallback ladder with AmendWorkflow — run id, the run's script `path`, and the new
> `subagent_model`: `openrouter/free` first, then `openrouter/auto`, then
> `openrouter/stealth/space-bunny-alpha`. (3) Never touch a run stopped `reason: user`; never apply
> the ladder to a ScriptError — those need a script fix. (4) Report one line per run touched (run
> id, old model, new rung, cache imported), or "no action". Modify no file, commit nothing, message
> nobody.

</details>

## Scheduled duty cycles (cron automations)

| Automation | Schedule | Duty |
|---|---|---|
| Ω daily standup | daily 09:00 | Read-only sweep of queues, authority docs and git state; report drift + one recommended next action. Modifies nothing. **Created** (automation-85b0ebf5). |
| Completion gate audit | Mondays 09:30 | Sample-verifies recent DONE claims in agent TASKS homes against repo evidence; flags UNVERIFIED. Read-only. **Created** 2026-09-30 (automation-cdeac028). |

## Operating rhythm

1. **Leverage, don't replace (owner directive 2026-09-29).** The existing corpus in this worktree
   is the planning ground truth: the Ω substrate's own `omega-baseline/omega-final/docs/`
   (ROADMAP, ARCHITECTURE-NEXT-STEPS, KNOWN-LIMITS, PROPOSAL-NEXT-WAVE, D-389-ALL-PHASES, WAVE-GAP-AUDIT)
   and the destination package in `docs/destination/` (incl. the responsibility matrix and maps).
   The team assesses and enhances this corpus — it does not design a competing new roadmap.
   New planning artifacts may only extend, reconcile or supersede existing ones with lineage.
2. **Session start:** run `omega-reality-check` (or read its latest report if same-day).
3. **Planning:** `omega-boundary-audit` for structural questions; `omega-research` for open questions.
4. **Landing work:** `omega-build` per bounded task; one corridor per task, not one mega-run.
5. **Claiming DONE:** `omega-verify` against the receipt/report — then the Steward commits.
6. Idle-time/off-peak capacity is available for deferred heavy jobs (deep audits, doc passes) on request.