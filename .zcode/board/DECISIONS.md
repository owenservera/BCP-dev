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
- **Revisit if:** the dashboard's UI decides to read or mutate gate-owned artifacts.

### D-TEAM-006 — UI-surface governance record
- **Severity:** S2 · **Status:** TEAM-DECIDED
- **Decision:** Establish by decision record that a UI surface may live in `tooling/` (D-414/D-422 are CLI precedents that do not cover it), written under WS-1 conventions.
- **Reason:** without it the placement is an undocumented convention, and undocumented conventions are drift.
- **Evidence:** WS-3 entry questions; D-414, D-422.
- **Alternatives:** plugin governance (rejected: a dashboard is not a runtime capability); no record (rejected: drift).
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

## Historic owner-ratified entries (for continuity, not re-decided)

- BQ-7/BQ-8 (2026-09-29): Steward owns reconciliation; the pass runs ahead of the dashboard — **owner-ratified**, kept.
- WS-4 item 3 (commit `.zcode/`) was executed and is the basis for this ledger's existence.
