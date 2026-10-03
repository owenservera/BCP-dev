# Ω decision ledger — TEAM-DECIDED entries

> Status: ACTIVE · opened 2026-09-30 under the owner directive "never allow human decisions as
> a blocking … decide and always move forward" ([../DECISIONS-POLICY.md](../DECISIONS-POLICY.md)).
> **Every entry is effective immediately.** The owner may override any entry at any time by
> saying so; an override is recorded here with lineage, the team adapts without argument, and
> silence means the entry stands. Severity: S1 (1 member) / S2 (proposer + challenger) /
> S3 (3 members, rollback required, dissent recorded).

## Owner-override register (inform, never block)

| Entry | One line | Severity |
|---|---|---|
| D-TEAM-001 | Commons bootstrap authorized now under `agent:steward-zcode` | S2 |
| D-TEAM-002 | Owner principal `user:owen` + human-principal amendment record | S3 |
| D-TEAM-003 | Owner instruction channel ships in dashboard v1 | S2 |
| D-TEAM-004 | Dashboard host = standalone surface in `tooling/` (not the Tauri shell) | S2 |
| D-TEAM-005 | Dashboard builds in parallel with gate work | S1 |
| D-TEAM-006 | Governance record D-458: "a UI surface may live in tooling" | S2 |
| D-TEAM-007 | WS-5 opens only after WS-1 green; first lane named by an S3 panel from BACKLOG criteria | S3 |
| D-TEAM-008 | Decision-SHA provenance: document boundary + repair resolvable citations; no full history restore for now | S3 |
| D-TEAM-009 | Push main only on a clean or receipted tree with WS-1 exit green | S2 |
| D-TEAM-010 | One writer corridor per worktree; gate results cite the tree snapshot | S2 |
| D-TEAM-011 | Ratified records get dated annotations, never rewrites (D-427, D-436:28, WS-1.3 cross-refs) | S3 |
| D-TEAM-012 | Write the beta-cut definition from ratified law + BACKLOG lineage; MATURITY-AND-GAPS cited as input only | S3 |
| D-TEAM-013 | Model policy: session model `new-provider/space-bunny-free` everywhere + fallback ladder on deterministic provider stops only | S2 |
| D-TEAM-014 | The 13 untracked entries: evidence committed, heavy artifacts parked, nothing deleted | S2 |
| D-TEAM-015 | Deliberation cost: corpus read once, challengers verify cited paths, sweeps on demand | S2 |
| D-TEAM-016 | WS-5's first lane = Wave 1 mine wave (`forge.mine-capture` + `forge-mine`) | S3 |
| D-TEAM-017 | A writer corridor registers before it writes; a gate run with a corridor live is CONTAMINATED, not a measurement | S2 |
| D-TEAM-018 | The swarm grows by capability, not by seat: two workflows added (`omega-redproof`, `omega-fixture`), zero roster members | S2 |
| D-TEAM-019 | `forge-surface` runs in `omega:quick`; the gate's own `--quick` comment under-describes its stage list and is annotated, not rewritten | S1 |
| D-TEAM-020 | WS-5 corridor 2 (`forge-mine`) is adopted from an abandoned unattributed writer: 5 failing tests were all test defects, the implementation was correct, and the corridor lands | S2 |
| D-TEAM-021 | The Ω suite runs serially by DEFAULT in code (`gate.ts` + `omega:test`); the `bunfig.toml` "fix" that did nothing is deleted | S2 |
| D-TEAM-022 | `omega-build`'s gate argv was inert (bun exits 0 on usage); fixed, and a gate now reads **red** when its output shows it never ran | S1 |
| D-TEAM-023 | **SF2 is NOT blocked.** CAS blobs written by the existing capture seam; all three recorded collisions refuted at the cited file | S1 |
| D-TEAM-024 | Suite is SHARDED across short-lived processes, not serial: `--max-concurrency` was measured inert. 326s/fatal 19.45GB -> ~249s/6.06GB | S1 |
| D-TEAM-025 | Workflow registry + automated governance/dispatch; the charter's dead owner-ratification gate is deleted | S1 |
| D-TEAM-026 | **No scheduled automations.** All four crons deleted; duty cycles become event-driven | S1 |

## Decisions

### D-TEAM-001 — Commons bootstrap proceeds now
- **Severity:** S2 · **Status:** TEAM-DECIDED (effective 2026-09-30)
- **Decision:** Stand up the first live Commons principal now under agent_id `agent:steward-zcode`; push `commons/steward-zcode` to origin.
- **Reason:** WS-2 exit criterion is an outstanding gate item; the runtime is already verified (`AGENTS_CONTEXT/AGENT-COMMONS/runtime/`), so the bootstrap is the smallest artifact that discharges it.
- **Evidence:** WS-2 purpose + evidence lines; S.3 two-process exchange (fold-based discovery) proved.
- **Alternatives:** defer until the dashboard exists (rejected: the dashboard is a Commons client — this is its dependency); wait for the owner to pick the id (rejected by policy).
- **Rollback:** the principal ref can be retired and the gate item re-opened with lineage.
- **Revisit if:** the smoke exchange shows the steward identity colliding with an existing principal, or Commons transport fails over Git.
- **Dissent:** none recorded.

### D-TEAM-002 — Human principal in Commons
- **Severity:** S3 · **Status:** TEAM-DECIDED
- **Decision:** Adopt `user:owen` as the owner's Commons identity and write the lineage-preserving amendment record (Ω law already carries `user:<id>` via D-336/D-353/D-412; the Commons protocol text lacks a human principal).
- **Reason:** the owner is a roster member in the target design (WS-3 requirement); the amendment closes a real gap between Ω law and Commons protocol text.
- **Evidence:** WS-2 BQ-2 note; D-336, D-353, D-412.
- **Alternatives:** no human principal in v1 (rejected: makes the owner a spectator); reuse an agent id for the owner (rejected: collapses IDENTITY≠AUTHORITY).
- **Rollback:** amendment record superseded by a later dated record; the id retired.
- **Revisit if:** Ω law's `user:<id>` semantics turn out to constrain Commons differently than assumed.
- **Dissent:** none recorded; OWNER-INFORM — this names the owner's own identity, so the override path is explicitly open.

### D-TEAM-003 — Owner instruction channel in v1
- **Severity:** S2 · **Status:** TEAM-DECIDED
- **Decision:** Ship the owner's reply/instruction path in dashboard v1 (compose → Commons DM/attention → agent pickup loop, visible in the dashboard).
- **Reason:** DELIVERY-01's finding that deferring it is "a choice dressed as a derivation" — an operational control panel without an instruction path is a monitor, not a panel.
- **Evidence:** WS-3 purpose + backlog item 4; WS-2 runtime capability set (DMs, attention).
- **Alternatives:** read-only dashboard v1, instructions in a follow-on (rejected: fails the stated purpose).
- **Rollback:** the instruction path is one surface; it can be hidden without touching the projection.
- **Revisit if:** the pickup loop proves unreliable over Git transport.
- **Dissent:** none recorded.

### D-TEAM-004 — Dashboard host
- **Severity:** S2 · **Status:** TEAM-DECIDED
- **Decision:** Host the dashboard as a standalone local web surface in `tooling/`; the Tauri OS shell stays a future host if the OS lane reopens — not now.
- **Reason:** the Ω lane is active and the OS lane is on hold (owner directive 2026-09-29); a standalone surface re-opens nothing and depends on no parked lane.
- **Evidence:** WS-3 board shape; board session #2 minutes (Governor's advisory veto on the shell).
- **Alternatives:** Tauri shell now (rejected: revives a parked lane, carries the veto); no dashboard (rejected: owner requirement 2026-09-29).
- **Rollback:** a static directory removal; nothing else references it.
- **Revisit if:** the OS lane is revived by the owner.
- **Dissent:** Governor's earlier advisory veto on the shell stands as the reason for this choice, not as objection to it.

### D-TEAM-005 — Parallel sequencing
- **Severity:** S1 · **Status:** TEAM-DECIDED
- **Decision:** Build the dashboard in parallel with gate work; round-close ceremony remains gated on `omega:quick` green as always.
- **Reason:** WS-3 touches no gate-gated code, so parallel costs no gate integrity; serializing it buys nothing.
- **Evidence:** WS-3 backlog (tooling-only surface); gate scope in `tooling/gates/gate.ts`.
- **Alternatives:** strictly behind WS-1 (rejected: idle capacity for a dependency-free lane).
- **Rollback:** stop sequencing WS-3 in parallel and place it behind WS-1. Nothing to revert in code — the decision is only about ordering.
- **Revisit if:** the dashboard's UI decides to read or mutate gate-owned artifacts.

### D-TEAM-006 — UI-surface governance record
- **Severity:** S2 · **Status:** TEAM-DECIDED
- **Decision:** Establish by decision record that a UI surface may live in `tooling/` (D-414/D-422 are CLI precedents that do not cover it), written under WS-1 conventions.
- **Reason:** without it the placement is an undocumented convention, and undocumented conventions are drift.
- **Evidence:** WS-3 entry questions; D-414, D-422.
- **Alternatives:** plugin governance (rejected: a dashboard is not a runtime capability); no record (rejected: drift).
- **Rollback:** withdraw the record; a UI surface in `tooling/` then needs its own decision, and the dashboard's placement is re-opened.
- **Revisit if:** the surface grows runtime authority.

### D-TEAM-007 — WS-5 sequencing rule
- **Severity:** S3 · **Status:** TEAM-DECIDED
- **Decision:** WS-5 does not open while `omega:quick` is red; when WS-1 exits green, the first BACKLOG lane is named by an S3 decision panel (3 members) from `docs/forge/BACKLOG.md`'s four open lanes, ranked by: (1) unblocks the most downstream work, (2) smallest verifiable increment toward the beta, (3) no dependency on unresolved law/boundary questions. The board's recommendation (don't open WS-5 before WS-1's exit criterion) is adopted as the gate.
- **Reason:** the corpus states no intended first lane; the rule makes the choice evidence-driven and repeatable instead of waiting for a human.
- **Evidence:** BACKLOG.md lines 40–84 (four open lanes, unranked); D-410 sequencing; D-416 (Core Phase CLOSED); board session 2026-09-30.
- **Alternatives:** pick a lane now without reading BACKLOG (rejected: unevidenced); wait for the owner (rejected by policy).
- **Rollback:** a lane choice is a sequencing decision — re-decidable at any boundary without touching landed work.
- **Revisit if:** WS-1 exit slips beyond the next board session, or a lane's unblocking value changes.
- **Dissent:** none recorded.

### D-TEAM-008 — Decision-SHA provenance boundary
- **Severity:** S3 · **Status:** TEAM-DECIDED
- **Decision:** Document the provenance boundary (canonical Ω repo vs this snapshot checkout, `e724a517` squash) and repair resolvable citations (already executed: D-456's evidence citation repaired to resolvable lineage in `b6e3cad5`). Do **not** restore full history from the bundle for now.
- **Reason:** the boundary plus repaired citations restore verifiability where it matters; a full history restore is a large, risky operation whose benefit is confined to SHAs no current gate checks.
- **Evidence:** `git cat-file -t d678dd0` → not a valid object (board session); 226 evidence SHA tokens across 137 records; `b6e3cad5` repair; the repo-root bundle available if needed.
- **Alternatives:** restore history from the bundle now (deferred, not rejected); leave citations broken (rejected: the `decisions` gate red is real).
- **Rollback:** the bundle remains available; restoring history later is a superseding decision.
- **Revisit if:** any gate or verification must resolve a pre-`e724a517` SHA.
- **Dissent:** none recorded.

### D-TEAM-009 — Push policy
- **Severity:** S2 · **Status:** TEAM-DECIDED
- **Decision:** `main` is pushed when the tree is clean (or its dirty state is attributable and receipted) **and** WS-1 exit is green. Never push while a writer corridor is live. The Steward performs the push and records the receipt.
- **Reason:** pushing during concurrent corridor writes ships a tree no gate result can be attributed to (measured: tree moved ahead 6→7→10 during one session).
- **Evidence:** WS-1's own concurrency finding; board session 2026-09-30.
- **Alternatives:** push now (rejected: unattributable); never push (rejected: the remote then diverges permanently).
- **Rollback:** a push is reversible by a revert commit; no external publication beyond the repo remote is involved.
- **Revisit if:** the remote becomes the coordination surface for another machine.
- **Dissent:** none recorded. OWNER-INFORM — this is the first outward-facing action the team authorizes itself.

### D-TEAM-010 — Corridor concurrency discipline
- **Severity:** S2 · **Status:** TEAM-DECIDED
- **Decision:** One **writer** corridor per worktree at a time. Read-only runs (sweeps, audits, research, verification) may run concurrently. When concurrency is unavoidable, every gate result must cite the tree snapshot it ran against (HEAD + `git status` excerpt) so it stays attributable.
- **Reason:** two writers in one worktree make a gate result unattributable to either change — observed twice, once by WS-1 itself and once by the board.
- **Evidence:** WS-1 item-2/3 finding; board session 2026-09-30; continuing tree deltas.
- **Alternatives:** per-corridor git worktrees (stronger, adopted as the escalation if collisions recur); accept unattributable gates (rejected).
- **Rollback:** a process rule; relaxed by a superseding entry.
- **Revisit if:** a second collision occurs — then worktrees become mandatory.

### D-TEAM-011 — Ratified records get annotations, not rewrites
- **Severity:** S3 · **Status:** TEAM-DECIDED
- **Decision:** D-427 ("the merge verdict IS the full gate"), D-436:28 (surface sweep lands in `gov.ts:381` under `omega:accept`, not `gate.ts`), and the WS-1 item-3 cross-references receive dated annotation notes appended to the records, preserving original text and lineage. The `gate.ts` `--quick` comment is corrected in addition.
- **Reason:** the records are append-only law; the observed defects are expectation/description gaps, not false decisions — annotating preserves the chain and removes the drift.
- **Evidence:** WS-1 item 3 precedent; board session 2026-09-30 (three officers agreed D-427 is true of gate.ts's own stage set; the gap is the omitted gov-owned stages).
- **Alternatives:** rewrite the records (rejected: violates append-only law); annotate nothing (rejected: drift persists).
- **Rollback:** annotations are additive; a later dated note supersedes.
- **Revisit if:** a verified claim shows a record's decision itself (not its description) is wrong.

### D-TEAM-012 — The beta cut gets a written definition
- **Severity:** S3 · **Status:** TEAM-DECIDED
- **Decision:** Write the beta-cut definition: what ships, what is explicitly excluded, and what a recipient receives. Derive it from ratified law + `BACKLOG.md`/D-410 lineage; `docs/destination/MATURITY-AND-GAPS.md` may be cited as an input but is never promoted into the sequence of record (it declares itself a derived working model).
- **Reason:** the board identified the cut as the missing link between the mission ("Full VIVIM beta ready to distribute for free") and a testable exit; the hierarchy objection was to sourcing it from a level-4 document, not to writing it.
- **Evidence:** board session 2026-09-30 (P1 rejection + dissent); BACKLOG/D-410; MATURITY-AND-GAPS.md:3.
- **Alternatives:** no written cut (rejected: exit stays unfalsifiable); derive from MATURITY-AND-GAPS (rejected by the hierarchy ruling).
- **Rollback:** a definition document is supersedable with lineage.
- **Revisit if:** the corpus has no defensible cut and the definition would have to be invented — then the gap escalates to a research task, not a decision.

### D-TEAM-013 — Model policy and fallback
- **Severity:** S2 · **Status:** TEAM-DECIDED
- **Decision:** Workflow subagents default to `new-provider/space-bunny-free`. On a **deterministic** provider stop only, relaunch via `AmendWorkflow` (settings-only) down the ladder `openrouter/free` → `openrouter/auto`, returning to the session model. **Updated 2026-09-30 (owner directive):** every agent — subagents, workflow runs, automations — runs on the session model `new-provider/space-bunny-free`; this supersedes the earlier `space-bunny-alpha` default (the Zen-tier failures that motivated it are historical). Transient errors (network, timeout, rate limit) get no action — the runtime retries. Never touch a run stopped `reason: user`; never apply the ladder to a script error.
- **Reason:** the free tiers have been observed failing live (network errors/timeouts on WS-1.1), and the ladder converts a dead run into a resumable one without losing cached work.
- **Evidence:** TEAM.md model-policy observation 2026-09-29/30; live Zen-tier failures.
- **Alternatives:** hard-pin one model (rejected: single point of failure); per-role tuning (deferred: no evidence yet that a role needs a different model).
- **Rollback:** settings-only change; ladder rungs can be reordered.
- **Revisit if:** `openrouter/free` is verified serving, or a role is shown to need a distinct model.
- **Annotation 2026-10-01 (peer intake, [AGENTS_CONTEXT/PEER-ZCODE-SETUP-CAPABILITY-OWNER.md](../../../AGENTS_CONTEXT/PEER-ZCODE-SETUP-CAPABILITY-OWNER.md)):** the ladder's runtime ids are `openrouter/openrouter/free` and `openrouter/openrouter/auto` (owner-side ListModels verification; `openrouter/free` / `openrouter/auto` as written above are not runtime ids — the first rung would fail on an invalid model id). `new-provider/space-bunny-free` unchanged. The watchdog (automation-48094acf, created 2026-10-01) runs the corrected prompt and loads the `dynamic-workflows` skill before calling `AmendWorkflow`. Rung-1 live serving remains UNKNOWN — the watchdog's first fire is the test.

### D-TEAM-014 — Untracked-entry disposition
- **Severity:** S2 · **Status:** TEAM-DECIDED (largely executed already)
- **Decision:** The 13 formerly untracked entries are owned as follows: evidence-bearing material (OS phase specs, `docs/Reality-engine/`) is **committed as evidence** (executed in `82fb8a7e`); heavy artifacts (738 KB worktree zip, the `.bundle`) are **parked** via `.gitignore` patterns (executed in `11e4c1c5`) and stay available outside the history; nothing is **deleted**.
- **Reason:** preserves evidence and lineage at zero history cost; deletion destroys the only copy of material nobody has finished judging.
- **Evidence:** WS-4 item 2; commits `82fb8a7e`, `11e4c1c5`; the board's 13-entry finding.
- **Alternatives:** commit the heavy artifacts (rejected: 738 KB zip + bundle inflate history permanently for no evidence value); delete (rejected: irreversible, no benefit).
- **Rollback:** parked files remain on disk and can be committed later; ignore patterns are one line each.
- **Revisit if:** a parked artifact becomes evidence for a live question.

### D-TEAM-015 — Deliberation cost discipline: verify citations, never re-derive the corpus
- **Severity:** S2 · **Status:** TEAM-DECIDED (2026-09-30, after owner challenged 5M-token spend)
- **Decision:** In a deliberation session the corpus is read **once** (by the proposer). Challengers open the **cited paths** and falsify the claims within their specialty; a missing citation is an evidence-gap finding, not a reason to re-derive a parallel ground truth. Default severity is S1/S2; S3 is reserved for irreversible, law/boundary, security, or product-intent matters. Sweeps (`omega-reality-check`) and deep audits run **on demand**, not as a session-start ritual, and their reports are consumed as evidence by the next decision rather than re-read by every member.
- **Reason:** measured burn showed the deliberation layer buying questions instead of decisions — the first board session spent 9.5M tokens to produce 8 owner questions that were then answered as team decisions in a near-zero-token ledger edit; the S3 session spent 2.1M tokens and was stopped before it decided anything. The build corridors, by contrast, paid: WS-1 landed the D-213 gate fix, the D-456 citation repair, the genome re-fold, and the 1500 host-wall correction with green gates.
- **Evidence:** run journal spends (153407eb = 9.5M, 7604c55a = 9.3M, 0c458495 = 3.3M, c58e30c7 = 2.1M stopped, ca04737e = landed); commit 08ddf708 + b6e3cad5; the design flaw was in omega-board's own challenger brief, which instructed each member to "establish its own ground truth … independently of the proposer".
- **Alternatives:** keep full independent ground truth per member (rejected: pays the corpus read N times for the same evidence); drop verification entirely (rejected: that is how the D-427 and D-436 defects survived); cap tokens per session (rejected: an arbitrary ceiling truncates reasoning rather than removing waste).
- **Rollback:** the challenger brief is one ask text; reverting restores the old behaviour at the old cost.
- **Revisit if:** a decision is later refuted on evidence a challenger would have caught by re-deriving ground truth — then the rule is too tight and gets relaxed for S3 only.
- **Dissent:** none recorded.

### D-TEAM-016 — WS-5's first lane is the Wave 1 mine wave
- **Severity:** S3 · **Status:** TEAM-DECIDED (2026-10-03)
- **Decision:** WS-5 opens on **Wave 1 (the mine wave)**: run `forge.mine.capture@1` against `fixtures/mines/synthetic-v0/`, and land `forge-mine-capture` + `forge-mine` as the first lane pair. D-409's partition is already decided and is not re-litigated.
- **Reason:** it is the only candidate that is simultaneously unblocked, first in the corpus's own words, and load-bearing for the next lane. `BACKLOG.md:40` heads it "**first lane pair**"; `D-419:69-70` says the register's Wave-1 pair "stays the first lane pair" and that the CDP lane "runs alongside it, not after the Wave-1+ buildout". Lane 2 (forge build-out) is downstream — its mine-id discipline "gets their first real consumers once a capture receipt exists" (`BACKLOG.md:49-50`), and only Wave 1 produces that receipt. Lane 4 (assembly plugin) is forward-gated: "design opens with Wave 2, never before" (`BACKLOG.md:77`). Lane 3 (CDP) carries an unmet precondition — §G5 requires writing down what "byte-identical" means *before* the substitution test is coded (`ARCHITECTURE-NEXT-STEPS.md:93`, restated as lane law in `D-419:31`), and no definition document exists on disk.
- **Evidence:** `fixtures/mines/synthetic-v0/MANIFEST.json` is present and pinned (`fileCount: 42`, rootHash `a8a75d8e…`); neither `forge-mine-capture` nor `forge-mine` exists in `plugins/` (27 plugins, no `forge-mine*`) — greenfield, nothing to un-ship; the lane needs **zero** `host/src` LOC against the frozen 1500/1500 wall (`omega:quick` reports `hostLoc: 1500`). Two independent challengers were run against this pick under D-TEAM-015 — each opened the cited paths and tried to refute it rather than re-deriving the corpus — and **both returned UPHELD**.
- **Panel:** proposer (Steward, from first-hand gate evidence) + 2 challengers, per the three-member rule in D-TEAM-007 and the ≤3 cap in [../ROSTER.md](../ROSTER.md). Deliberation cost ~3.2k tokens against the 79M-token ledger in [../LESSONS.md](../LESSONS.md) — D-TEAM-015 working as written.
- **Alternatives:** CDP substrate first (rejected: its §G5 precondition is unmet, and D-419 places it alongside rather than ahead); forge build-out first (rejected: it waits on the capture receipt Wave 1 produces); assembly plugin first (rejected: explicitly gated behind Wave 2).
- **Rollback:** a lane choice is a sequencing decision — re-decidable at any corridor boundary without touching landed work. No landed artifact depends on it yet.
- **Revisit if:** §G5's byte-identity definition lands and removes the CDP lane's only blocker, or if the mine capture proves to need `host/src` LOC (which would need a D-record to move the B5 wall first).
- **Dissent:** none recorded. OWNER-INFORM — the owner may re-rank the lane at any time; silence means this stands.
- **Stale text noted, not edited:** `BACKLOG.md:6-10` still says plugin work is "PARKED until core-omega-ready". That is superseded by D-417's un-park (`:21`, `:38`). Correcting it is WS-1 housekeeping.

### D-TEAM-017 — A writer corridor registers before it writes
- **Severity:** S2 · **Status:** TEAM-DECIDED (2026-10-03)
- **Decision:** Every writer corridor records a row in the `Live writer corridors` table of [../TRACKING.md](../TRACKING.md) **before** its first write, naming owner (session/agent id, or `UNKNOWN` as a recorded defect) and the exact file paths it owns. **A gate result taken while any row is open is CONTAMINATED and is not a measurement** — it is logged as such and supersedes no earlier figure.
- **Reason:** D-TEAM-010 has mandated "one writer corridor per worktree" since 2026-09-30 but named no mechanism to register one, so the rule was unenforceable. Measured on 2026-10-03: an unattributed writer built `plugins/forge-mine/` in this worktree over 12:25–12:31 with no workflow run, automation, or session accounting for it, while the Steward took a 13-failure test run whose result was meaningless because it straddled the live corridor. Two of the three registry fields are unfillable-by-default; the rule needed teeth.
- **Evidence:** `ListWorkflowRuns` (all 15 runs terminal, dated Sept 29–30); the opencode session table (all idle, days old); filesystem mtimes 12:25:37 → 12:31:25 across six files plus `compositions/forge-mine.json` and an 82-line `_matrix.json` diff. Gap rows G-01/G-02 in [GAP-LEDGER.md](GAP-LEDGER.md).
- **Alternatives:** adopt the escalation D-TEAM-010 already names (per-corridor git worktrees) — rejected *for now*: it is heavier than the failure it prevents, and the registry detects the collision first. Keep the rule as written and rely on the Monday audit — rejected: the audit runs weekly and this collision lasted nine minutes.
- **Rollback:** delete the table and the rule; the underlying D-TEAM-010 text is untouched.
- **Revisit if:** corridors routinely exceed one session, at which point worktrees become the cheaper instrument.
- **Dissent:** none recorded. OWNER-INFORM.

### D-TEAM-018 — The swarm grows by capability, not by seat
- **Severity:** S2 · **Status:** TEAM-DECIDED (2026-10-03)
- **Decision:** Two capabilities are stood up as workflows — `omega-redproof` (red-fixture falsification of gate checks) and `omega-fixture` (pinned second corpus). **No roster member is added.** The full capability assessment is in [../TEAM.md](../TEAM.md#the-swarm--which-agents-this-work-actually-needs-assessed-2026-10-03) and the gaps in [GAP-LEDGER.md](GAP-LEDGER.md).
- **Reason:** the assessment found no gap that a new deliberating seat would close. The board already seats up to 3 members from a 5-member roster; the missing instruments are execution capabilities, and the charter's expansion path is for officers and standing duties. Adding a seat for work that is not deliberation would misapply the roster's own purpose.
- **Evidence:** `docs/forge/BACKLOG.md:110-113` already states the standing lesson this session's own findings re-confirm — *"every gate check needs a red fixture on the REAL tree before it is trusted"* — and the repo's three most recent near-misses (docscan's never-firing exemptions, forge-author's fence that never ran on Windows, three `>= 0` assertions) are all instances of it. `forge.proof.replay@1` / `secondmine@1` (`packs/builder/contract/forge-ops.md:38,40`) have no second corpus to run against; only `synthetic-v0` exists.
- **Alternatives:** add a FALSIFIER-01 officer — rejected: it would be an execution role seated in a deliberation registry. Build the live-integration capability now for the CDP lane — rejected: that lane's §G5 precondition is unmet, so the capability would have no first consumer. Extend `omega-verify` to cover red fixtures — rejected: verify checks claims against evidence; a red fixture *manufactures* a failure, and conflating them would blunt both.
- **Rollback:** each is a standalone saved workflow; deleting it restores the prior instrument set with no other change.
- **Revisit if:** `omega-redproof` shows a low red-fixture rate, meaning the checks are already falsifiable and the instrument is idle — then it is ceremony and should be retired under METHODS-01.
- **Dissent:** none recorded. OWNER-INFORM.

### D-TEAM-019 — `forge-surface` runs in `omega:quick`
- **Severity:** S1 · **Status:** TEAM-DECIDED (2026-10-03)
- **Decision:** Record, as a dated annotation on the gate's own `--quick` comment, that `--quick` executes **more** stages than its comment lists: the comment at `tooling/gates/gate.ts:309-310` names six stages and omits `anvil-loc`, `anvil-surface`, `forge-surface`, `invariants-freshness`, `process` and `genome`. The comment is annotated rather than rewritten, per D-TEAM-011.
- **Reason:** "quick" has been read — including in this session's first pass — as a narrow subset. It is not, and the omitted stages are the ones a plugin-authoring corridor actually trips. Any reader reasoning about "will `--quick` catch this?" from the comment alone will be wrong.
- **Evidence:** the 2026-10-03 `omega:quick` run reported `forge-surface` and `genome` failures under `--quick`; both are absent from the comment's list.
- **Alternatives:** correct the comment's list — rejected under D-TEAM-011 (dated annotation preserves lineage and the gate file is gate-owned). Narrow `--quick` to match the comment — rejected: it would remove real coverage from the inner loop, which is the loop every corridor runs.
- **Rollback:** the annotation is additive.
- **Revisit if:** a gate-owner session rewrites the stage list deliberately.
- **Dissent:** none recorded.

### D-TEAM-020 — WS-5 corridor 2 is adopted from the abandoned writer and lands
- **Severity:** S2 · **Status:** TEAM-DECIDED (2026-10-03)
- **Decision:** The `forge-mine` READ-sibling corridor — built by an unattributed writer that stopped mid-flight and never returned — is **adopted by the team and landed**. Its five failing tests were all defects in the *tests*, not the implementation; each was fixed against what the code actually does. `forge-mine`, `compositions/forge-mine.json`, the `_matrix.json` row, the `forge-surface.test.ts` split assertion, and the regenerated genome fold land together with a single receipt.
- **Reason:** the implementation was correct in every one of the five cases, and in two of them the test was asserting something the plugin's own manifest and the frozen schema contradict. Landing it was the cheaper and more honest move than parking good work. Parking would also have left the genome fold permanently out of step with the tree, which is the same false-red this session opened with.
- **Evidence:** `bun test plugins/forge-mine/` went 57 pass / 5 fail → **62 pass / 0 fail**, 400 `expect()` calls across 2 files. Each fix was checked against source, not assumed: (1) `not.toContain("forge-mine-capture")` and (2) `not.toContain("node:fs")` were substring searches over raw source that tripped on the code's *own comments* explaining the rule — replaced with an import-specifier extractor (`importSpecifiers`) that tests what the file reaches for; (3) `crlfAffected > 0` demanded both CRLF branches from the **ambient checkout**, which fails on this repo's `core.autocrlf=true` (all 42 files arrive pre-normalised) — replaced with a hermetic two-file probe mine so the branch coverage is guaranteed on any host; (4) the diff test expected `"none"` in `diff` on passing checks, but `check()` in `src/mine.ts:154` is explicit that a *failing* check carries its reason, and `ProofReportSchema` (`packs/builder/src/schemas.ts:223`) types the field `string | null`; (5) the "REAL difference" test expected `README.md` in `added`, but `fixtures/mines/synthetic-v0/` already contains a `README.md`, so `added` is correctly only `src/main.ts` — **the diff was right and the test was wrong.** Its expectation also demanded `MANIFEST.json` in `removed` while the receipt excludes `MANIFEST.json` by declared policy.
- **Falsifier — the tests were mutation-tested, not trusted.** Two mutations were injected and both were caught: neutering the `added` delta (`const added = [] as string[]`) failed the diff test; making passing checks carry `"none"` instead of `null` failed two tests. Sources restored from backup afterwards and re-verified at 62/62 with zero mutation residue. A green suite that has never been shown to go red is the exact failure class G-05 exists for.
- **Alternatives:** park the corridor untouched (rejected: it is good work, it is the lane D-TEAM-016 named, and parking would leave `forge-surface` and `genome` red for the same reason they were red when this session opened); delete it (rejected outright under D-TEAM-014); regenerate the genome fold without fixing the tests (rejected — that would have produced a green fold over a red suite, which is how this repo's tracker claimed green while `bun test` stood at 41 failures).
- **Rollback:** one revert commit. No law was amended; the genome fold is regenerated by the repo's own `omega:genome`, never hand-edited.
- **Revisit if:** `forge.mine`'s ops are found to depend on the ledger holding a capture receipt the READ class cannot itself produce — the composition boots both halves for exactly this reason, and that coupling is the thing to watch.
- **Dissent:** none recorded. OWNER-INFORM — the work was authored by an agent nobody can name, and the team is landing it on the strength of its own verification rather than its author's.

### D-TEAM-021 — Serial by default, in code; two inert "fixes" deleted
- **Severity:** S2 · **Status:** TEAM-DECIDED (2026-10-03), **rationale corrected twice the same day**
- **Decision:** `tooling/gates/gate.ts` defaults `testMaxConc` to **1** (was `max(4, min(20, cpus))`), and `package.json`'s `omega:test` passes **`bun test --max-concurrency 1 --timeout 60000`** — the flag, not the environment variable. The `bunfig.toml` is deleted. `OMEGA_TEST_CONCURRENCY` continues to be honoured *by gate.ts only*.
- **Reason:** a full run at Bun's default concurrency exhausts memory and dies: RSS 8.70–8.86 GB, commit ~19.5 GB, ~2.9M page faults on a 23.52 GB machine, always at ~900 of 1591 tests. Bun's own message is **"Bun has run out of memory"** (one run printed "Stack overflow" instead — same failure, different wording). At `--max-concurrency 1` the same suite completed: 1586 pass / 2 skip / 3 fail in 326 s.
- **Two corrections this decision absorbed, both from fixing a fix that did nothing.**
  1. **The `bunfig.toml` was inert.** `[test] maxConcurrency` is not a key in Bun's bunfig schema (the only documented one is `concurrentTestGlob`, which sets per-file concurrency and does not cap workers), and Bun silently ignores unknown keys. A full run *with the file present* crashed exactly as before.
  2. **The env var is inert too, outside gate.ts.** `OMEGA_TEST_CONCURRENCY` is read in exactly one place — `tooling/gates/gate.ts:312` — which forwards it to the runner as a `--max-concurrency` **flag** at line 327. Writing `OMEGA_TEST_CONCURRENCY=1 bun test` into `package.json` set a variable the spawned `bun test` never reads. That run was therefore at **default concurrency** and died at 896 tests with the same OOM profile.
- **Evidence for the flag being the real lever:** the three runs' own crash banners record their argv. The run that completed was invoked with `--timeout 60000` **by gate.ts, i.e. with `--max-concurrency 1` too**; both runs that died were invoked without `--max-concurrency`. Cross-checked with `grep`: the variable appears in `gate.ts` and one comment in `verify-status.ts`, nowhere else.
- **Alternatives:** leave the default and rely on discipline (rejected — prose-only rules have been the failure mode here twice today); a bunfig entry (rejected — measurably inert); a wrapper script (rejected — the flag is a one-line change in a file the repo already owns).
- **Rollback:** two one-line reversions.
- **Revisit if:** Bun fixes the leak, or the suite's memory profile changes enough that serial is unnecessary.
- **Dissent:** none recorded. **OWNER-INFORM — and an operational warning:** this crash has twice taken the owner's ZCode client down with it, because the suite's ~19.5 GB commit starves everything else on a 23.5 GB box. **Full-suite runs need the owner's machine and should not be run unattended in a live session.**

### D-TEAM-022 — `omega-build`'s gate could not fail, because it never ran
- **Severity:** S1 · **Status:** TEAM-DECIDED (2026-10-03)
- **Decision:** Both gate invocations in `.zcode/workflows/omega-build.dwf.ts` are corrected to the argv form Bun actually executes (`bun run --cwd <dir> <script>`), and the gate is made **structurally incapable of reporting green without having run**: an `executed()` predicate treats Bun's usage banner as a non-execution, so an inert invocation reads **red**. The inert branch deliberately does **not** spawn the gate-fixer. `WS-1-truth-repair.md`'s exit criterion, which carried the same inert command, is corrected in place.
- **Reason:** `bun --cwd <dir> run <script>` does not name a script Bun can resolve. Bun prints its usage banner and the package's script list, then **exits 0**. `omega-build` read `exitCode === 0` as green, so every corridor it ran reported `omega:test` and `omega:quick` green **without executing either**, the gate-fixer never fired on a red suite, and the run's `verified` array published the literal claim *"omega:test ran after implementation (exit 0)"* — false by construction, in the artifact the owner reads. A gate that cannot fail is worse than no gate: it manufactures evidence.
- **Evidence — both forms run back to back on bun 1.3.14, same env, same cwd, seconds apart.**
  - `bun --cwd omega-baseline/omega-final run omega:quick` → 203 lines of **usage text plus a script list**, exit **0**, no gate output.
  - `bun run --cwd omega-baseline/omega-final omega:quick` → the twelve stage results and `{"ok": true, "failed": 0, "hostLoc": 1500}`, exit 0.
  The distinction is entirely argv order. **Blast radius measured, not assumed:** `grep` for `world.run` across all ten saved workflows returns **two hits, both in this file** — no other saved workflow runs a deterministic gate. One durable doc (`WS-1-truth-repair.md:34`) carried the inert command as its exit criterion. `omega:quick` was re-measured after the change: `ok:true, failed:0, hostLoc 1500`.
- **Why the fixer branch was changed, not just the argv.** The obvious shape — "inert, therefore red, therefore send the fixer" — would have handed an agent `omega:test failed:` followed by **empty stderr**, because an inert run has no failures. The obedient response is to go and "repair" working code until it produces output that was never missing. **A phantom failure is strictly worse than a real one, because the repair damages a correct tree and the run still reports green.**
- **Alternatives:** leave the argv and rely on authors invoking the gate by hand — rejected; the workflow *is* the standing implementation path (TEAM.md's build loop), so an inert gate there disables gating for every corridor, not just some. Assert on `stdout` only — rejected as insufficient: `bun test`'s summary format is not a contract, whereas the usage banner is a stable signal that the command did not run. Add a red-fixture test for the workflow script itself — deferred; `omega-redproof` is the right instrument for it and is tracked as T-21, but the output-based predicate is the fix that costs nothing and holds today.
- **Rollback:** one revert commit (`597c941e`). No law amended, no gate logic changed, no repository code touched.
- **Revisit if:** `omega-redproof` is pointed at the workflow scripts and proves the predicate itself can fail.
- **Dissent:** none recorded.
- **UNVERIFIED, stated precisely rather than broadly.** The corrected **argv** is verified — both forms were executed above. The corrected **script** was syntax-parsed (`bun build --no-bundle`): the parser consumed the file through every edited line and stopped at the top-level `return`, which is a property of workflow scripts and **reproduces identically on the pre-edit file** (`git show 51d8fd01`, same error at the corresponding `artifact.markdown` line) — so it is not introduced by this change. That discharges **syntax**. What remains unverified is the workflow compiler's **facade typing** and end-to-end behaviour, because both require submitting the workflow, which starts a build. Treat "omega-build still works" as unproven until its first real corridor reports.

### D-TEAM-023 — SF2 is decided: CAS blobs, populated by the capture seam. **NOT blocked.**
- **Severity:** S1 · **Status:** TEAM-DECIDED (2026-10-03)
- **Decision:** SF2 resolves to **CAS blobs**, written by `forge.mine-capture@1` as part of the filesystem seam it already owns, with the receipt's existing `casRef` as the address. `forge-survey` resolves `casRef` → bytes through a read port and stays what the catalog already declares it to be — *"pure: pinned snapshot → inventory"*. **SF2 was never blocked.** All three resolutions recorded as blocked were tested against the files they name and **none of the three collisions holds**.
- **Method.** `omega-decide` was dispatched twice on this question and both runs hung on their first step at 0 tokens (`dwfrun-55b8ed4d`, stopped by the owner; `dwfrun-4975a8fe`, still retrying). Rather than pay a third run on an input the instrument cannot complete, the falsification was done inline by opening each cited file directly — the same discipline `omega-decide` exists to apply, executed by hand. **The runs are not evidence and nothing is inferred from them.**
- **The three claimed blockers, each refuted at the source.**
  1. *"capture emitting inventory rows collides with `FORGE_CONTRACT_DRIFT`, the catalog is frozen."* **It would not fire.** `forge-surface.ts:139-152` fires on exactly two conditions: a declared op absent from `FORGE_OP_CATALOG`, or a declared risk differing from the catalog's pin. Emitting content under the **same op id at the same risk** triggers neither. `forge-ops.md:20` fixes `forge.mine.capture@1` as `EXTERNAL_MUTATION` — unchanged. **The objection that survives is a design one, not a gate one:** producing inventory rows would duplicate `forge.survey.run@1`'s declared result and blur capture's own. So it is still the wrong move — just not for the reason recorded.
  2. *"a filesystem port in `host/src` collides with the frozen 1500/1500 budget (D-391)."* **True but avoidable by construction, so not a blocker.** `host-loc` reports 1500 with zero headroom, so any host LOC is over budget — yet **`forge-mine-capture` already performs its filesystem work as a plugin with zero `host/src` LOC.** The port does not need to live in the host; this lane never proposed one.
  3. *"survey re-walking the disk collides with `FORGE_CLASS_SPAN`."* **It would not fire.** `forge-surface.ts:103-112` fires when a plugin's *declared* `contributions.contract` span more than one risk class. `forge-survey` would declare `forge.survey.run@1` and `forge.survey.render@1`, **both `READ`** (`forge-ops.md:23-24`) — one class. The rule's *intent* is genuinely violated by a disk-walking READ op; **no mechanical check catches it** (filed as **G-11**).
- **Reason.** The chosen path changes **no op id, no risk class, no payload, and no receipt shape** — the CAS is a side effect of a seam capture already owns. So `FORGE_CONTRACT_DRIFT` cannot fire, `FORGE_CLASS_SPAN` cannot fire (capture remains the sole `EXTERNAL_MUTATION` contributor), and **zero `host/src` LOC is added**. Every frozen rule is untouched because nothing frozen is touched.
- **The corpus had already answered this; the blocker was a claim about files nobody opened.** `CaptureReceiptSchema` (`packs/builder/src/schemas.ts:73-90`) is a `z.strictObject` whose every file row already carries `casRef`, and `casRefFor` (`plugins/forge-mine-capture/src/receipt.ts:142`) returns `cas:${hash}` — **a pure function of content, deliberately not a storage location**, with the rationale written down: *"A casRef that named a storage location would have made the undecided fork into a fact by accident."* A test is named for it outright: *"every row's casRef is a pure function of its content (**SF2 stays open**)"* (`test/happy/capture.test.ts:121`). **Corridor 1 did not merely leave SF2 open — it built the seam that lets SF2 land later without re-capturing any mine.** The `casRef` was designed for exactly this decision.
- **Evidence for "survey has no other way in":** `forge-ops.md:20` calls capture *"the ONE filesystem seam"*, and `forge.survey.run@1` takes `{mineId}` — **not `{mineRoot}`**. Survey is specified as pure and is given no filesystem handle. The design already requires the bytes to arrive by `casRef`.
- **Alternatives.** (a) *capture emits inventory rows* — rejected: duplicates `forge.survey.run@1`'s declared result and erodes the one-seam rule, for no gain. (c) *survey re-walks the disk* — rejected: violates the stated intent of `FORGE_CLASS_SPAN`, and doing it silently is worse than doing it loudly, because the gate would not object. A host-provided CAS port — rejected as unnecessary: no host LOC is required, so D-391 is never reopened.
- **Rollback:** one revert. The change is additive at the seam capture already owns; no ratified record is amended by this entry.
- **Revisit if:** the CAS needs a location that is neither the mine tree nor plugin-local writable state, in which case a storage decision — not a host port — is what lands.
- **Where the ratified record goes:** D-409:30 says SF2 *"lands with its own evidence in the implementing records, post-core."* **This entry decides the direction; the `docs/decisions/` record is written by the corridor that implements it**, with the CAS location and the incremental-hashing budget as its evidence.
- **Dissent:** none recorded. OWNER-INFORM — the recorded blocker was real to everyone who read the ledger and did not exist in the code.
- **Independent confirmation, added 2026-10-03 after the decision.** Two `omega-decide` runs — `dwfrun-55b8ed4d` (6 options) and `dwfrun-4975a8fe` (9 options) — each independently reached **NOT BLOCKED**, with **6 of 8 blocker claims refuted at the cited file** and **2 upheld**. Both upheld claims are the same one: **a 25th catalog op is amendment-class**, hard-pinned by four `toBe(24)` assertions across two test files (`plugin-identification.test.ts:41,:60`, `packs/builder/test/schema.test.ts:126`) plus a shape rule at `schema.test.ts:130-134` requiring `forge.<area>.<verb>@1` with the area in `FORGE_PLUGIN_IDS`. **So the routes that survive are precisely the ones that change no catalog entry — which is what this entry chose.** **G-11 is upgraded from "refuted by reading the check" to proven by execution:** each run injected a disk-walking `READ` plugin into the *real* gate input and got zero issues, each with a negative control that did fire. **Correction to the question those runs were handed:** it cited `tooling/gates/anvil-loc.ts`, which does not exist — the file is `tooling/gates/anvil.ts`, and the `anvil-loc` check is over `sdk/src`, not `host/src`. Verified it never reached a durable record; it lived only in the workflow prompt. Two further gaps surfaced and are filed as **G-12** (host ops bypass the law gate entirely, `ports.ts:270,:439` short-circuiting before `callLaw` at `:284`) and **G-13** (no gate checks manifest-`requested` ⊆ composition-granted, observed live on the SF2 landing while `omega:quick` stayed green).

### D-TEAM-024 — The suite is sharded, not serial; the flag that was holding it back does nothing
- **Severity:** S1 · **Status:** TEAM-DECIDED (2026-10-03) · **owner-requested** ("remove those rules and design for speed")
- **Decision:** `omega:test` and the full gate run **`tooling/gates/sharded-test.ts`**, which splits the suite into short-lived `bun test` processes run **4 at a time**, with `surfaces` and `host` given the box exclusively in a serial phase first. **D-TEAM-021's serial-by-default rule and HOUSEKEEPING's one-run-at-a-time rule are superseded**, and `OMEGA_TEST_CONCURRENCY` now means *process-pool width* rather than a flag that did nothing.
- **Reason.** The finding that makes this a decision rather than a tuning change: `--max-concurrency` is inert on this suite. Four slow plugin files, same box, seconds apart: one process at `--max-concurrency 4` **39.7 s**, at `--max-concurrency 1` **39.6 s**, four **separate processes 18.8 s**. Identical to within 0.1 s. The runner was always sequential, so D-TEAM-021 was buying nothing — and the fault was never too many workers but **one long-lived process accumulating** until it OOM'd. The fix is a **shorter process**, not a smaller number.
- **Evidence.** Measured, full suite, same machine, end to end:

  | | wall | memory | result |
  |---|---|---|---|
  | baseline (serial, one process) | 326 s | **19.45 GB commit — fatal** | 1586 / 2 / 3 |
  | **sharded, width 4** | **~249 s** | **6.06 GB peak** | **1582 / 2 / 2** |

  The two remaining failures are the two declared Windows environment limits (a `python3` Store alias `Bun.spawn` cannot resolve; a symlink `EPERM` with no `SeCreateSymbolicLinkPrivilege`). The baseline's third failure was the load-flaky MCP stdio timeout, which **does not fire** now that no single process lives long enough to starve it.
- **Width chosen by measurement.** Width 6 is **worse on both axes**: 4 failures instead of 2 — adding a `< 2 ms` keystroke-latency assertion and a gate e2e test — and the slowest shard grew 147 s → 168 s. Width 4 ships.
- **Why two areas stay serial.** Measured both. `surfaces/daemon/test/pool.test.ts` **stack-overflowed** under 4-way load (`panic(thread): Stack overflow`, RSS 2.47 GB / Commit 5.99 GB — *not* out of memory, a genuine deep-recursion crash, logged right after `workers_spawned(95)`), and passes alone. `host/test/lazy.test.ts` asserts on dormant-spawn and singleflight timing and fails under contention while passing 6/6 alone. **Testing a scheduler's timing while three other shards compete for the same cores is not a fair test of it.**
- **Two defects found in the new runner by running it — both are this session's own lesson, committed against myself.** (1) Reading shard output over a **pipe** wedged the runner forever: a grandchild inherits the write end and never closes it, so the read waits for an EOF that never comes — **3 of 4 shards finished in 14–35 s and the parent sat there with every child already exited.** Output now goes to files. (2) **A crashed shard was summed into an authoritative-looking `1134 pass / 1 fail`** while silently discarding ~450 tests that never ran. A shard with no verdict line is now reported as `INCOMPLETE` and fails the gate. **A summary that cannot tell "no failures" from "a third of the suite vanished" is worse than no summary.**
- **One thing deliberately not done.** A size-weighted LPT shard balancer was written to fix a real imbalance (two 35-file shards measured 56 s and 147 s) and then **removed**. File size is a proxy for cost, not cost, and an unmeasured "probably faster" is not worth the complexity. Round-robin is what the suite was verified against, so round-robin ships — with the imbalance recorded as known headroom rather than papered over.
- **Rollback:** revert `gate.ts` and `package.json` to the single `bun test` line; delete `sharded-test.ts`.
- **Revisit if:** a shard crashes again, or the imbalance is worth a real cost model rather than a size proxy.
- **Dissent:** none. OWNER-INFORM — this removes two standing rules the team had enforced for a week, on the strength of measurement rather than preference, and one of them (`one run at a time`) was written after crashing the owner's client twice.

### D-TEAM-025 — Governance, housekeeping and dispatch are automated; the charter's dead gate is removed
- **Severity:** S1 · **Status:** TEAM-DECIDED (2026-10-03) · **owner directive** ("yes fully automate governance, housekeeping and dev")
- **Decision.** Three things stand up, each **removing** a manual step rather than adding a ritual:
  1. **`.zcode/WORKFLOW-REGISTRY.md`** — one row per standing instrument: what it is for, what authorises it, who owns it. `.zcode/checks/governance-check.ts` **fails** on an orphaned workflow, a row with no lineage, or a charter count that disagrees with the disk.
  2. **`.zcode/checks/dispatch-queue.ts`** — answers "is there work safe to start *right now*", and returns the exact `omega-build` call. It **never dispatches by itself**; the checked preconditions are the safety argument.
  3. **The charter's dead ratification gate is deleted.** Its expansion path and mandate clause both required "owner ratification", written 2026-09-30 — the same day [DECISIONS-POLICY.md](../DECISIONS-POLICY.md) was opened superseding it. **The two governing documents contradicted each other for three days and nothing reconciled them.** Decide-and-inform wins.
- **Reason.** The finding that prompted this. Ten workflows existed with **no owner, no registry, and no rule covering modification** — the charter governed *adding* an instrument and was silent on *changing* one, so editing `omega-build.dwf.ts` (whose gate had never once executed, D-TEAM-022) required no process step at all. Meanwhile [../TEAM.md](../TEAM.md) still claimed **"7 saved workflows"** against **10** on disk. The instruments that spend the owner's tokens and write to the repo were owned by nobody. Git authorship could not arbitrate: all ten carry the owner's identity, because the agent commits under their configured user whichever session wrote the file.
- **Dispatch safety is a checked precondition, not a promise.** The queue refuses unless **no writer corridor is OPEN**, **the working tree has no unexplained changes**, and **a READY task sits in an implementation lane**. Verified live: with `forge-survey` open it refused and named both blockers. **Auto-dispatch is lane-scoped** — of the four READY tasks, all four are research or design lanes (`T-08` Path-A, `T-09` boundary, `T-10` evolution, `T-12` product vision) and none is a bounded implementation. `READY` means *unblocked*, not *the same kind of work*; handing a builder a contract-design task produces code where a decision was wanted. **So the honest state today is: no implementation task is dispatchable, because the only one is the corridor currently running.** Full dev automation cannot invent work, and this does not pretend to.
- **What the governance check does NOT do.** It answers "does this instrument exist on purpose", nothing wider. Whether a workflow earns its tokens is `omega-verify`'s job. The registry also refuses to flatter itself: it records that **six rows pre-date the rule** (the original substrate, ratified by use rather than by a gap row) and that **`omega-decide` has never completed a run** — dispatched twice, 0 tokens each, which is why SF2 was decided by hand in minutes. **A workflow that has never completed a run is an untested instrument, not a working one.**
- **Evidence.** Ten workflows on disk with no registry and no owner; [../TEAM.md](../TEAM.md):30 claiming "7 saved workflows" against 10; the charter expansion path requiring owner ratification against [../DECISIONS-POLICY.md](../DECISIONS-POLICY.md) superseding it the same day; and `dispatch-queue.ts` refusing live, naming both blockers, against a tree with `forge-survey` open.
- **Net-ceremony:** removes the manual "does the registry match reality" pass, the manual "which task is READY, go start it" step, and a contradictory clause nobody could satisfy. Adds one file, two scripts, two cron entries. Success measure: **a workflow added without a registry row turns the next sweep red, and a READY implementation task starts without a human noticing it.**
- **Rollback:** delete the registry, the two scripts and the crons; revert the charter paragraph.
- **Dissent:** none. OWNER-INFORM — this governs the owner's own instruments, and the first audit it produced found that three of ten had never been run to completion.

### D-TEAM-026 — No scheduled automations; duty cycles are event-driven
- **Severity:** S1 · **Status:** TEAM-DECIDED (2026-10-03) · **owner directive** ("Remove timebound audits this is always on project")
- **Decision:** All four cron automations are **deleted** — the daily standup (`automation-85b0ebf5`), the Monday completion-gate + housekeeping audit (`automation-cdeac028`), the model-fallback watchdog (`automation-48094acf`), and the hourly dev corridor queue (`automation-745130bd`, created hours earlier under D-TEAM-025). `CronList` now returns an empty set. **Duty is event-driven instead**: audit where the event happens, not when a clock says so.
- **Reason.** Not simply "the crons were removed": Scheduling exists to catch drift *while nobody is working*. On a project that is always live it inverts: a fired session runs against a tree **nobody is in**, and the watchdog could resume a provider-stopped run whose owner had already walked away from it. Event-driven auditing is also **strictly better at the job it was doing** — a drift introduced on Tuesday is caught on Tuesday, at the moment of introduction, instead of up to seven days later on a Monday.
- **What replaces each duty, and where it now fires:**

  | Duty | Fired at | Instrument |
  |---|---|---|
  | Standing-state sweep | session start | the same read set, run in-session |
  | Completion-gate audit | corridor close | `omega-verify`, inside the corridor's own script |
  | Housekeeping sweep | corridor close + session close | `git status --porcelain` vs HOUSEKEEPING.md |
  | Governance drift | every gate run | `.zcode/checks/governance-check.ts` |
  | Next-task dispatch | corridor close + session close | `.zcode/checks/dispatch-queue.ts` |
  | Provider-failure repair | when a run reports `stop_reason: provider` | the D-TEAM-013 ladder, applied in-session |

- **The ladder survives; only the clock was removed.** `openrouter/openrouter/free` → `auto` → session model still applies, handled by whoever is in the session. **Rung 1 has therefore never been exercised and stays UNKNOWN** — the honest state, rather than a false "served" inferred from a watchdog that never fired on anything.
- **Evidence.** What the schedules were actually worth, recorded because it is the same defect class twice. The Monday audit was created 2026-09-30 and **never fired once** before deletion (`runCount: 0`). The watchdog was recorded as **T-13 DONE on the strength of "it was created"** — it had never run against a run that needed it. **A duty cycle celebrated in the ledger as DONE without ever executing is a gate that reports green without running (D-TEAM-022), one layer up.** Both were caught by asking a question nobody had asked — which is what the registry and `governance-check.ts` now mechanise.
- **Net-ceremony:** removes four automations, one prompt block, and every schedule reference in TEAM.md / TRACKING.md / HOUSEKEEPING.md. Adds nothing. **The two scripts from D-TEAM-025 were already the real mechanism — the crons were only wrappers that fired them on a clock, and the wrappers are now gone.**
- **Rollback:** re-create any of the four; their full prompts are preserved in this session's history.
- **Dissent:** none. OWNER-INFORM — this removes three automations the team had recorded as delivered, one of them as DONE, and every one of them was unverified in exactly the way this project keeps getting burned.

## Historic owner-ratified entries (for continuity, not re-decided)

- BQ-7/BQ-8 (2026-09-29): Steward owns reconciliation; the pass runs ahead of the dashboard — **owner-ratified**, kept.
- WS-4 item 3 (commit `.zcode/`) was executed and is the basis for this ledger's existence.
