# Ω Team lessons register — DevOps performance, token discipline, reliability

> Status: ACTIVE · consolidated 2026-09-30 by the Steward after the owner halted all runs and
> asked for the lessons to be written down rather than bought with another 7.5M-token run.
> Every entry cites the run that paid for it. This file is the team's operational memory;
> rules that govern behaviour live in [TEAM.md](TEAM.md) and [DECISIONS-POLICY.md](../.zcode/DECISIONS-POLICY.md);
> this file records **why** those rules exist and what they cost to learn.

## 1. The cost ledger (measured, not estimated)

Roughly **79M tokens across ~36 hours** of team runs. Sorted by what they actually bought:

| Run | Tokens | Outcome | Verdict |
|---|---|---|---|
| Standing-state sweep (2026-09-29) | 18.3M | 28 drift claims, 23 confirmed | paid — found the gate red, drove WS-1 |
| Board — dashboard (2026-09-29) | 13.3M | 8 owner questions, scope decisions | paid, but see §2 |
| **Build corridors** (genome 3.3M + corpus-docs 9.3M + tooling 6.7M) | **19.3M** | 3 gated, committed, green artifacts | **best ROI in the ledger** |
| Closure sweep (2026-09-30) | 8.5M | 11 drift claims, 10 confirmed, zero high | paid — WS-1 exit evidence |
| First board session (2026-09-30) | 9.5M | 8 owner questions | **overpriced** — the questions cost 9.5M; the decisions that answered them cost a ledger edit |
| S3 board (WS-5 lane) | 2.2M | 3 proposals + 17 challenges, **no decision** (stopped) | half-wasted — inputs paid, decision never taken |
| Team audit (2026-09-30) | 7.6M | **nothing** — 0 of 3 miners returned, no memo | **total loss** |
| Board continue-vs (stopped) | ~0 | ground-truth phase only | n/a |

**The ratio that matters:** build corridors produced every committed, gate-green artifact this
team has, at ~6M per corridor. Read-heavy passes (boards, sweeps, audits) consumed ~59M and
produced questions and reports — some useful, one of them nothing. **The team spent 3.2× more
on reading than on building, and the reading half is where the waste is.**

## 2. Deliberation is the team's most expensive instrument — and its least used one

- The first board session (9.5M) produced **8 questions for the owner**, not decisions. Those
  8 questions were then converted to 14 team decisions by a **near-zero-token ledger edit**.
  The deliberation bought framing; the decision cost nothing. That is the wrong ratio.
- The S3 session (2.2M) table proposals and challenges and was stopped before settling. Its
  inputs are paid; its output never happened. **A run that doesn't reach its decision is a
  100% loss** — the questions-to-decision step is where the value is, and it was the last phase.
- **Root cause, twice:** the deliberation layer was designed to *discuss*, not to *decide*, so
  it consumed the corpus three ways (gatherers, proposer, challengers) and only then asked
  whether anything had been settled. Fixed by D-TEAM-015 (challengers verify cited paths, not
  re-derive the corpus) and the decide-don't-defer policy — **both unproven on a live run.**

## 3. Fan-out over a small corpus is the cost sink

- The S3 panel (3 members) re-derived ground truth independently per member: the corpus read
  ~3×. Fix (D-TEAM-015): corpus read once, challengers open **cited paths**. Lesson generalizes:
  **never fan out N readers over a corpus with fewer than N distinct sections to read.**
- The team audit fanned out 3 miners over *overlapping* evidence (receipts/history both mine
  commits; the process miner read charters already summarized) and gave it no stopping rule.
  7.6M, nothing. **Lesson: an unbounded audit prompt has no floor — it reads everything because
  nothing told it to stop.** Every read-heavy pass needs a question, not a topic.

## 4. Model and provider failures cost wall-clock, not correctness

- The Zen free tiers (`openrouter/stealth/space-bunny-alpha`, `gpt-5.6-sol`) produced live
  `network_error` / `timeout` stalls on 2026-09-29/30 (WS-1.1 spun ~10 min on repeated network
  errors). Every team agent now runs on the session model (D-TEAM-013); the ladder
  (`openrouter/free` → `auto` → session model) only fires on *deterministic* provider stops.
- One-automation-per-session is real (verified by refusal): every recurring duty costs a fresh
  session to schedule. Lesson: batch automations, don't create one per idea.

## 5. Reliability: process death orphans writer corridors

- Twice, the owning process died mid-run (WS-1.4/5; the S3 board). Both left partial
  worktree state and in-flight subagents. Recovery is reliable (`ResumeWorkflowRun` replays
  settled work for free; the second time it cost zero re-paid tokens because the cache held).
  **Lesson: a dead process is recoverable, but the worktree it was writing is not — check
  `git status` at every session start and treat unexplained modifications as an orphaned run,
  not as drift to hand-fix.** (This is exactly what the closure sweep later found as
  "unattributable tree edits.")

## 6. What actually worked (keep doing this)

- **Build corridors** (plan → fresh-eyes review → build → `omega:test` → `omega:quick` →
  verify): every artifact this team has committed came through one, and every one ended
  green-gate. This is the highest-ROI instrument in the ledger.
- **Gates as the only truth**: `omega:test` + `omega:quick` exit codes replaced every
  "it should work" claim. The gate catching the D-213 hole and the stale genome fold is the
  system working.
- **One-writer-per-worktree (D-TEAM-010)**: no corruption across ~15 runs; the two deaths
  caused stale state, never conflicting writes.
- **The decision ledger + no-blocking policy**: converted ~20 parked owner questions into 15
  effective team decisions at document-edit cost. The single highest-leverage artifact.

## 7. The rules this bought (each traces to a cost above)

1. **Deliberation must end in a decision, or it is a loss.** Settle phase first-class; a run
   that cannot reach it should not start. (D-TEAM-015)
2. **Corpus read once; challengers verify cited paths.** No independent re-derivation per
   member. (D-TEAM-015)
3. **Read-heavy passes get one agent and a question, not a fan-out and a topic.** (audit lesson)
4. **Build corridors are the default unit of work.** Read-heavy passes are evidence for a
   corridor, not deliverables. (§1 ratio)
5. **S3 panels (3 deliberators) only for irreversible/law-boundary matters.** (D-TEAM-015)
6. **Check `git status` at session start**; unexplained writes = an orphaned run, resume it
   rather than hand-fixing. (§5)
7. **Resume, don't restart** — a stopped run replays settled work free. (§5)
8. **The ledger is where decisions live; minutes are the evidence.** Never re-litigate a
   settled decision; supersede it with lineage. (D-TEAM-015 precedent)

## 8. Open, unproven, and next

- **D-TEAM-015 is unproven on a live run** — the only decision runs since the fix were
  stopped before settling. The next real S2 decision is its live test; compare its cost to the
  2.2M S3 baseline.
- **The full methods audit is un-run** in a bounded form. When it runs: one agent, three
  questions, a read budget, a hard stop — never the 3-miner unbounded version that cost 7.6M
  for nothing.
- **WS-5's first lane is still undecided** (S3 inputs paid, decision not taken). The cheapest
  path: resume the S3 settle (replays free) or a single S2 decision on the BACKLOG evidence.
