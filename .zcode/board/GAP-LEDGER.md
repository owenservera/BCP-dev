# Ω gap ledger — every gap a session found, open until resolved or decided into expansion

> Status: ACTIVE · **backfilled 2026-10-03.**
> Named as a required session artifact by [CHARTER.md](CHARTER.md) ("Session artifacts and
> lineage") since the board stood up on 2026-09-30. The file did not exist until 2026-10-03 —
> the charter asserted an artifact the board never produced. That absence is itself G-00 below.
> The charter's expansion path reads its rows: "a gap-ledger row may propose a new officer,
> department or standing duty."
>
> A row is closed by **resolution** (the capability now exists and is proven) or by **decision**
> (a TEAM-DECIDED entry in [DECISIONS.md](DECISIONS.md) that declines to build it, with a reason).
> A gap is never closed by forgetting it.

## Open gaps

| ID | Found | Gap | Class | Severity | Status / next action |
|---|---|---|---|---|---|
| **G-00** | 2026-10-03 | **The charter named two session artifacts that did not exist**: `SESSIONS/<date>-<slug>.md` minutes and this file. Sixteen TEAM-DECIDED entries were recorded without a single minutes file, so the panel composition and pick-reasons the charter requires ("Panel composition and pick-reasons are recorded in the minutes") have no durable home. | process | P0 | **RESOLVED in part** — this ledger now exists and `SESSIONS/2026-10-03-state-assessment-and-swarm.md` backfills the first minute. Sixteen past sessions remain un-minuted; they are recoverable only from the run journals and the ledger itself. Do not reconstruct them by invention. |
| **G-01** | 2026-10-03 | **An unattributed writer was live in the worktree for ≥12 minutes with no owner anywhere in the PM system.** At 12:25 an untracked `plugins/forge-mine/` appeared and grew steadily (7 files by 12:37, plus `compositions/forge-mine.json` and a 4-key edit to `_matrix.json`). No board row, no automation, no workflow run, and no opencode session accounted for it — `ListWorkflowRuns` showed all 15 runs terminal and dated Sept 29–30. D-TEAM-010 mandates "one **writer** corridor per worktree" but nothing *registers* a corridor, so the rule is unenforceable and unattributable work is invisible until it breaks a gate. | capability | **P0** | **CLOSED — by adoption, not just by mechanism.** The registry now exists as the `Live writer corridors` table in [../TRACKING.md](../TRACKING.md) and the standing rule is that a corridor registers before it writes. The writer itself stopped at 12:37 and never returned; the team adopted its work, found all 5 of its failing tests to be test defects, and landed the corridor under **D-TEAM-020** at 62 pass / 0 fail, mutation-tested. The gap is closed by the work landing *and* the mechanism existing — either alone would have left it open. |
| **G-02** | 2026-10-03 | **Gate results were taken while a writer was live and are therefore unattributable** — exactly the failure D-TEAM-010 exists to prevent. The 13-failure `bun test` run measured today overlapped the writer; 6 of those failures are the in-flight corridor's own half-built state (`forge-surface`, `genome`, `_matrix`, count pins), not defects. TRACKING.md's WS-5 row nonetheless asserted a green gate. | process | P0 | **RESOLVED.** A gate result is now valid only when the live-corridor table is empty or the result cites the corridor it ran under. Today's run is recorded as **CONTAMINATED — not a measurement**, and the previous green claim is corrected in place rather than left standing. |
| **G-03** | 2026-10-03 | **No workflow joins "deliberate an open sub-fork" to "record it as a D-record with frozen-catalog impact analysis."** `omega-board` decides; `omega-build` implements; nothing owns the seam. This is not theoretical — it is the binding blocker on `forge-survey`. | capability | **P0** | **OPEN.** D-409's sub-fork **SF2** ("snapshot bytes: CAS blobs vs rows; incremental hashing budget") must be decided before `forge.survey.run@1` can be implemented, and all three available resolutions collide with a frozen rule (catalog drift, the 1500-line host wall, or one-risk-class-per-plugin). Owner: CEO-01 (sequence) + GOVERNOR-01 (frozen-rule collision). This is the next WS-5 decision, and it is a **decision, not an implementation**. |
| **G-04** | 2026-10-03 | **Two hard-pinned composition counts will go red on the next builder composition and no workflow tracks the obligation.** `tooling/gates/test/generate.test.ts:27` and `shippable-fence.test.ts:55` both pin `toBe(19)`; the tree now carries 20 (`forge-mine` added at `_matrix.json`). The pins are only visible in the **full** test stage, so a corridor can pass `omega:quick` and go red later. | capability | P1 | **OPEN.** Remediation is mechanical, not deliberative: the pin-bump belongs to the build corridor that adds the composition, and the check that would have caught it early is the same red-fixture falsifier as G-05. Tracked as task T-20. |
| **G-05** | 2026-10-03 | **No workflow executes a red fixture against the real tree.** `BACKLOG.md:110-113` already records this trap firing once (`GENERATED`-header regex missing `@`, so rule 6 never fired) and states the standing lesson: *"every gate check needs a red fixture on the REAL tree before it is trusted."* `omega-verify` checks claims against durable evidence; it does not prove a check can fail. | capability | P1 | **INSTRUMENT BUILT, FIRST USE ALREADY PAID.** `omega-redproof` exists and is registered (9th saved workflow). It was written for the gate; it was first needed for the code: the five failing tests in the adopted `forge-mine` corridor were all **test** defects, including two assertions that could not fail because they matched the code's own explanatory comments. The team did by hand what the workflow automates — injecting two mutations (a neutered `added` delta; passing checks carrying `"none"` instead of `null`) and confirming both turned the suite red before trusting 62/62 green. Tracked as task T-21. |
| **G-06** | 2026-10-03 | **No capability produces a pinned second corpus.** `forge.proof.replay@1` needs byte-identical regeneration *outside* authored regions and `forge.proof.secondmine@1` needs "the synthetic second mine run" (`packs/builder/contract/forge-ops.md:38,40`). Only `fixtures/mines/synthetic-v0/` exists (42 files). Whether it suffices for `secondmine` is **not stated anywhere in the corpus**. | capability | P2 | **OPEN.** Bounded and mechanical once scoped: pin a second synthetic mine the same way `synthetic-v0` is pinned, with its own `MANIFEST.json` and rootHash. New workflow `omega-fixture`. Tracked as task T-22. |
| **G-07** | 2026-10-03 | **No workflow does live/external system integration.** The CDP substrate lane (D-419) needs a real Chrome DevTools Protocol socket, process containment and an authority bar (D-338). Every saved workflow is closed-world repo work. The lane is separately blocked by §G5 (no byte-identity definition exists on disk). | capability | P2 | **OPEN — deliberately deferred.** Two independent blockers (this gap, and the unmet §G5 precondition) sit on the same lane. Building the capability before the precondition clears is exactly the ceremony the net-ceremony test forbids. Revisit when §G5 lands. |

## Closed by decision (not built)

*(none yet — a row moves here when a TEAM-DECIDED entry declines the capability, with a reason.)*

## Expansion proposals raised from this ledger

Per CHARTER.md, a row here may propose a new officer or standing duty. Two were raised on
2026-10-03; both were resolved **without** adding a roster seat, because both were mechanised
instead:

- **G-01 → a corridor registry.** Resolved as a section of the existing TRACKING board, not a
  new file and not a new officer. Net-ceremony: removes unattributable writes (observed once,
  live, this session); adds one table and one rule.
- **G-05 → a falsifier role.** Resolved as a new *workflow*, not a new roster member. The roster
  is for deliberation panels; a red-fixture run is execution, so seating an officer for it would
  have been the wrong instrument.

No roster seat has been added on the strength of this ledger. See [../ROSTER.md](../ROSTER.md).
