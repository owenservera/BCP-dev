# CLAUDE.md — BCP-dev Phase-1 Coordination

> **This file is the canonical go-forward document for Claude's role in
> BCP-dev.** If you are Claude, picking this conversation up cold — new
> session, new account, mid-conversation cutoff, doesn't matter — read this
> file first, in full, before doing anything else. It should tell you
> everything you need: what this project is, what's actually true right
> now, what's in flight, and what to do next.
>
> **Repository:** `https://github.com/owenservera/BCP-dev` — always clone
> or read from here directly. It is the full current state; there is no
> more-complete snapshot elsewhere (owner-confirmed).
>
> **Last synced against `main`:** commit `019f83e` (2026-09-25). If your
> clone shows a different HEAD, pull first — this file describes that
> commit's state, not necessarily right now's.

---

## 0. The one rule that keeps this file trustworthy

**Every time you generate a prompt for a ChatGPT workstream conversation,
the prompt itself must end with an instruction telling that conversation
to update this file** — specifically, to edit the relevant row(s) in
§3's table and, if warranted, §5's log, with real commit hashes, not
placeholders. This is not optional decoration. The owner is on a
rate-limited plan and may lose access to any single conversation — Claude,
ChatGPT, or otherwise — without warning. This file is the only thing that
survives that. If a prompt goes out without this instruction, whatever
that workstream produces risks becoming invisible to the next session that
picks up coordination.

The standard instruction block to append to every generated prompt:

```
BEFORE YOU FINISH: update CLAUDE.md at the repo root.
- Find your workstream's row in the "Workstream table" section.
- Update Status, Evidence (real file paths + real commit hash, not a
  placeholder), and Next action.
- If you produced a finding that changes another workstream's assumptions
  (a contradiction, a blocked dependency, a corrected fact), add one line
  to the "Cross-workstream findings log" with today's date and the
  specific downstream workstream(s) affected.
- Commit this alongside your other work, same commit or a clearly labeled
  follow-up. Do not describe what you intended to do — describe what you
  actually committed, with the real hash.
```

---

## 0.1. The coordinator has no write access — deliverables are prompts, not files

The Claude coordination session is **read-only** (clone/pull/verify only, no push/commit/PR). Every deliverable to the owner must therefore be a **self-contained execution prompt** for the write-access agent to apply, never a raw file for manual pasting — a raw file is a process violation, since it reintroduces the owner as a manual copy step.

Every such prompt gets logged in §8.

---

## 1. Conceptual vision — the mental model

**The end state this program is building toward:** a real, governed,
sovereign AI system — Ω — where every capability is a plugin, every action
an authorized principal takes is checked against real consent and
authority before it runs, and every effect (successful or refused) leaves
a reconstructable trace in an evidence log. Not a system that claims to
work — a system where a stranger, reading only the evidence log, could
correctly reconstruct what happened, who authorized it, and why, without
being told.

**Three codebases, one direction of travel:**

- **VIVIM** (`vivim-original-baseline/vivim-final-enhanced/`) — the old,
  real, *working* prototype. It actually drives browsers against ChatGPT,
  Claude, Gemini, etc. It has no plugin architecture, no capability
  tokens, no compartments. It is **evidence of what works**, never
  authority, and never the destination.
- **Ω / omega-final** (`omega-baseline/omega-final/`) — the new core,
  built deliberately fresh, not shaped around VIVIM's code. µhost,
  contracts, ports, capability tokens, compartments. This is the
  destination architecture. VIVIM's proven behavior gets *harvested into*
  it, piece by piece — never imported wholesale.
- **BCP** (`bcp-speed/bcp/`) — the coordination substrate underneath all
  of this: capabilities, leases, experiments, an append-only log. It
  tracks the work; it is not the product.

**The organizing discipline for this whole program, learned the hard way:**
this repo has a real, documented history of **status drift** — a state
file claiming a capability is "L2, proven" when the seed history shows it
was never built past "L0, stub," a claimed status that turns out to
describe code that exists nowhere. See §4 for the specific, verified
instances. The single most valuable thing any workstream can do, over and
over, is: **check the claim against the actual source, not against another
document's claim about the source.** Documents drift. Commits and grep
results don't.

**Phase-1's specific target** (the thing every currently-active workstream
converges on): one real action — `message.send@1`, a Chrome-based
send-message capability — invoked by a real principal, checked through a
real (minimal) authorization chain, executed live in real Chrome under the
Ω host, with the full trace (principal → authority → consent → invocation
→ capability → execution → governed event) reconstructable purely by
reading the evidence log. Plus: at least one invalid/unauthorized attempt,
deterministically refused and logged the same way. That's it. Small enough
to actually finish, and it forces every layer — truth, harvest,
governance, provider reality, integration — to touch reality instead of
producing another round of specification.

**Why small.** The repo already has a lot of *specified-but-unproven*
material and a lot of process/coordination scaffolding. What it lacked,
as of Phase-1's start, was a single real governed action that had actually
run, live, end to end. Getting one small thing genuinely proven teaches
the program more than another round of designing the big thing in the
abstract — and that lesson (see §4, the Path A/B finding) is precisely
what happens when you skip straight to declaring something proven.

---

## 2. Execution model — how work actually gets done right now

- **No paired local agent this round.** Each workstream is a single
  ChatGPT conversation with GitHub read/write access to this repo — no
  code execution, no real browser control from inside that conversation.
- That splits every milestone into two kinds:
  - **[SOLO]** — reading, analysis, writing, committing. Fully achievable
    inside the ChatGPT conversation alone.
  - **[NEEDS RUN]** — actually executing something (`bun test`,
    `bun run omega:gate`, a real authenticated Chrome session). The
    ChatGPT conversation prepares this fully and hands exact instructions
    to the owner, who runs them on their own machine and relays the real,
    unedited result back into the same conversation.
- **No conversation can see another conversation's context.** The owner
  (or whoever is coordinating — including a fresh Claude session reading
  this file) is the only thing that relays outputs between them. This is
  why every workstream's required output is a **named, committed file at a
  fixed path** — the next workstream is told to read that exact file, not
  to "coordinate" abstractly with a conversation it can't see.
- **Do not fabricate [NEEDS RUN] results.** Every workstream so far has
  correctly refused to invent test output, event logs, or live-run
  results it didn't actually produce. This is load-bearing, not a nice-to-
  have — a fabricated result poisons every downstream workstream that
  trusts it. If you are ever tempted to write a "plausible" result because
  the owner hasn't run something yet: don't. Say it's blocked, say
  exactly what's needed to unblock it, and stop there.

---

## 3. Workstream table — canonical, update this every time something lands

> Update this table directly whenever new information arrives — a prompt
> returns, a real run completes, a new contradiction surfaces. This
> section, plus §4, is what makes this file worth reading instead of
> re-deriving everything from scratch.

| # | Workstream | Status | Evidence (real paths + commit) | Next action |
|---|---|---|---|---|
| P1-01 | Cooperative Agent System | **PROVEN** — Phase 2 dogfood complete (7 GREEN / 1 PARTIAL / 2 PROVEN) | `docs/agent-system/workstreams/WS-001/` | None — stable. Residual: COMPACTION formal re-rule owed. |
| P1-02 | Repository Truth, Cleanup & Drift | **IMPLEMENTED/COMMITTED** — Phase-1 Truth Baseline published; status-sync fix applied | `docs/agent-system/workstreams/WS-002/PHASE-1-TRUTH-BASELINE.md`; C15 in `docs/cleanup/CONFLICT-REGISTER.md`; sync commit `6c1c392` | Dormant unless a new cross-workstream contradiction surfaces (see §4 for the trigger rule). |
| P1-03 | Ω Ontology, Evidence & Representation | **IMPLEMENTED/COMMITTED** — M1–M4 baseline published, M4 verdict PASS, no critical ontology contradiction vs P1-06/P1-08 | `docs/agent-system/workstreams/WS-003/PHASE-1-ONTOLOGY-BASELINE.md`, commit `188cbcf` | Dormant; watch two ratified-law triggers relevant to P1-09 — reopening D-324 for a CONTRADICTED state, and a new decision needed to generalize D-424's staleness rule — don't act on either preemptively. |
| P1-04 | Ω Self-Knowledge & Context | **NOT STARTED** | none | Deferred — not part of Phase-1's five-workstream convergence target. |
| P1-05 | Ω Plugin Kernel & Runtime | **IMPLEMENTED/COMMITTED** — baseline published; µhost confirmed exactly 1,500/1,500 lines; no plugin-boundary violation in P1-06 or P1-08 | `docs/agent-system/workstreams/WS-005/PHASE-1-KERNEL-BASELINE.md`, commits `ac3a0d3`, `4316c27` | Treat H-01 (proving the executable manifest entry is contained inside the content-hashed plugin tree) as the next kernel slice, under the existing B5 1,500-line constraint; don't touch P1-06/P1-08 for this. |
| P1-06 | Ω Agency, Execution & Governance | **IMPLEMENTED/COMMITTED, BLOCKED ON M4/M5** — chain coded (principal → consent → D-452 → `message.send@1` → governed event); real event log NOT yet produced | `docs/agent-system/workstreams/WS-006/PHASE-1-GOVERNANCE-CHAIN.md`; `omega-baseline/omega-final/plugins/vivim-agent/src/governance.ts`, `.../index.ts`; `omega-baseline/omega-final/plugins/vivim-law/src/policy.ts` | Blocked on P1-08's M4 real test result (see below), then on the owner running the two real chain executions (success + refusal) per the runbook already written in its own doc. |
| P1-07 | Provider Intelligence & Autonomous Maintenance | **NOT STARTED** — blocked on P1-08's handoff | none yet | Send once P1-08's `PHASE-1-HANDOFF-PACKAGE.md` has a real M4 result attached. Use `P1-08-PROMPT-NEXT.md`-style framing: read the handoff, prepare the live-Chrome runbook, wait for real captured output. |
| P1-08 | Forge / VIVIM Harvest & Migration | **IMPLEMENTED/COMMITTED, BLOCKED ON M4** — real `message.send@1` execution logic committed inside `provider-browser`; `bun test` / `omega:gate` NOT yet run by the owner | `docs/agent-system/workstreams/WS-008/PHASE-1-HANDOFF-PACKAGE.md`; `omega-baseline/omega-final/plugins/provider-browser/src/live.ts`, `.../index.ts`, `.../parsers.ts`, `.../session.ts`; test file `omega-baseline/omega-final/plugins/provider-browser/test/live-send.test.ts` | **Owner must run**, from `omega-baseline/omega-final`: `bun test plugins/provider-browser/test/live-send.test.ts` and `bun run omega:gate`. Paste real output back into the P1-08 conversation. This is the single most load-bearing blocked step in the whole chain right now — P1-06 and P1-07 both wait on it. |
| P1-09 | Ω Integration & End-to-End Proof | **NOT STARTED** — blocked on P1-06 + P1-07 + P1-08 all having real (not designed-but-unrun) output | none yet | Send last, only once all three of §Wave-2/3's outputs are real. It is the convergence point; do not implement anything new inside it. |
| P1-10 | Program Observatory / Visual State | **REGISTERED, V0 blueprint only** | `docs/agent-system/workstreams/WS-010/V0-BLUEPRINT.md` | Explicitly deferred past Phase-1. |

**Known open decision:** the capability target for Phase-1 was resolved by
P1-06 (not chosen up front) to **`message.send@1`** on
`omega-baseline/omega-final/plugins/provider-browser/`. This maps most
directly to MIG-001 (`chatgpt-send-message`) per the migration records —
confirm this against P1-08's actual handoff doc rather than assuming.

---

## 4. Cross-workstream findings log

> Append-only. Add one dated entry per real, verified finding that changes
> what a downstream workstream should assume. Do not remove old entries
> even if later superseded — mark them superseded in place instead.

**2026-09-25 — Authority-pointer pilot branch does not exist.**
`impl-04/p1-02-authority-pointer-slice`, cited in
`WS-002/README.md`/`SETUP-PROMPT-CHATGPT.md` as prior pilot evidence
(`PKT-006`, `HANDOFF-010`, `ITEM-001`), is not present on the remote
(`git ls-remote --heads` shows only `main`) and has no matching commit in
full unshallowed history. Verified independently twice — once before
P1-02 ran, once by P1-02 itself. Treat as unavailable, not "unverified."
Affects: nothing downstream directly cited it, but any future workstream
tempted to cite it should check this entry first.

**2026-09-25 — FAM-07/FAM-08 (Path A/Path B) L2 claim contradicts seed
history; no implementation exists anywhere.** `capabilities.yaml` claims
depth L2 for all of FAM-07.1–07.4 and FAM-08.1–08.4. The seeding commit
(`d949b06`, recorded in `docs/archive/sessions/session-ses_f371.md`)
states plainly "FAM-07/08/09 at L0" at creation, confirmed by a follow-up
metrics-recompute commit. Zero implementation hits across `.ts/.js/.py`
source for either family or their named capabilities. Both experiment
records show `agents_assigned: []`. Owner has confirmed this repo is the
full current state — there is no unpushed or local copy elsewhere holding
the missing implementation. **Resolution: DIRECT CONTRADICTION**, logged
formally as C15 in `docs/cleanup/CONFLICT-REGISTER.md`. Path A/B are safe
to use only as historical/planning specification, never as evidence of
working code. **Affects: P1-09** directly — its original framing assumed
Path A/B integration; its scenario must be scoped to what P1-06/07/08
actually produce, with Path A/B's absence logged as a standing composition
gap, not quietly substituted around.

**2026-09-25 — `message.send@1` contract carries legacy domain-email
metadata (`to`/`subject`) that doesn't map to ChatGPT semantics.**
P1-08 found and documented (not silently redefined) that the frozen
`message.send@1` contract surface was originally shaped for a
domain-email pack. In the live ChatGPT realization, `body` is the real
prompt; `to`/`subject` remain required contract metadata, persisted, but
are not interpreted as ChatGPT recipient/thread selectors. **Affects:
P1-06** — its event schema and any downstream reconstruction logic should
treat this as a known, documented quirk, not a surprise to debug later.
See `docs/agent-system/workstreams/WS-008/PHASE-1-HANDOFF-PACKAGE.md`,
section "Semantic caveat: to / subject."

**2026-09-25 — `WORKSTREAMS.md` and `BUILD_CONTEXT.md` both carry stale
status claims by design/by disclaimer respectively.** `WORKSTREAMS.md`'s
P1-02/06/08 status lines were corrected in commit `6c1c392` after falling
behind real committed work. `BUILD_CONTEXT.md` self-disclaims at its own
header ("Numbers below are era-true for that snapshot... Do not cite this
file's HEAD/counts as current") — it is a frozen 2026-09-23 snapshot,
intentionally not live. **Affects: anyone reading either file** — treat
`WORKSTREAMS.md` as the corrected live registry and this
`CLAUDE.md` as the faster-updating coordination layer on top of it; treat
`BUILD_CONTEXT.md` as historical only.

**2026-09-25 — P1-05 host line-count "contradiction" was a counting-method difference, not real drift.**
P1-05 claimed exactly 1,500/1,500 lines citing `CURRENT-INVARIANTS.md`;
raw `wc -l` on `host/src/*.ts` gave 1,487, a uniform 13-line gap
(+1 per file, 13 files); the root cause is the repo's gate script using
`content.split("\n").length` vs `wc -l`'s newline-count, which differ by one
whenever a file ends in a trailing newline. Running the gate's actual method
returns 1,500/1,500, matching P1-05. **Resolution: NOT a contradiction.**
**Affects:** anyone manually spot-checking line counts — use the gate's
method, not raw `wc -l`.

**Trigger rule (from the P1-02 addendum, still standing):** if a *third*
instance of "status file says X, history/source says Y" turns up beyond the
two above, that's the signal to propose a standalone
agent-system-state-integrity workstream — don't decide that in advance,
watch for the pattern.

---

## 5. Send order and parallelism — current state

```
Wave 1 — P1-02 alone                                    [DONE]
Wave 2 — P1-06 + P1-08 in parallel                       [DONE, both blocked on real runs]
Wave 2b — P1-03 + P1-05 in parallel (opportunistic,      [DONE — 188cbcf (P1-03), ac3a0d3 + 4316c27 (P1-05)]
          doesn't block the Phase-1 chain, doesn't
          need the owner's machine)
Wave 3 — P1-07, once P1-08's handoff has a real M4       [NOT SENT — blocked]
          result
Wave 4 — P1-09, once P1-06 + P1-07 + P1-08 all have      [NOT SENT — blocked]
          real (not designed-but-unrun) output
```

**The one step only the owner can do right now:** run `bun test` and
`bun run omega:gate` from `omega-baseline/omega-final` against P1-08's
commit, and paste the real output into the P1-08 conversation. Everything
in Wave 2 (P1-06's remaining milestones) and Wave 3 (P1-07 starting at
all) is downstream of this single action.


---

## 6. How to use this file as a fresh session

If you are picking this up with no memory of prior turns:

1. Read this file in full (you just did).
2. `git pull origin main`, check the HEAD commit against §"Last synced"
   above. If different, treat §3/§4 as possibly stale — spot-check the
   two or three most-recently-touched workstreams against real commits
   before trusting the table blindly.
3. Check §9 first for queued prompts, before deciding whether anything is
   safe to send. A prompt already queued there must not be duplicated.
4. Check §3 for anything marked "AWAITING RETURN" or "BLOCKED" — that's
   your queue.
5. If you're about to generate a new prompt for any workstream, append
   the §0 update-instruction block to it, unmodified, and remember you have
   no write access yourself (§0.1): the prompt, not a raw file, is the
   deliverable. Log it in §8 before handing it to the owner.
6. If you learn something that contradicts an existing row or log entry,
   update it in place — don't leave two conflicting claims standing. That's
   the exact failure mode this file exists to prevent elsewhere in the repo.
7. Before generating a prompt for any workstream that touches ratified law or
   another workstream's already-committed files, check §7's file-ownership
   map and decision-authority rule first.


---

## 7. Program governance — roles, decision authority, enforcement

### Roles

| Role | Authority / responsibility |
|---|---|
| **Owner** | Final authority, approves ratified-law changes, runs NEEDS RUN steps. |
| **Coordinator (Claude)** | Read-only, drafts and logs prompts, maintains §3–§5, flags drift; cannot push or reinterpret ratified law. |
| **Execution agent** | Read-write, implements and commits; cannot fabricate NEEDS RUN results, touch another workstream's committed files without a logged reason, or alter ratified law without an owner-approved D-### record. |

### Decision authority

D-### changes require an explicit new or amended record **and owner sign-off**, never as a side effect of a baseline document.

Status-label glossary, used consistently: **NOT STARTED / LAUNCHED / AWAITING RETURN / IMPLEMENTED-COMMITTED / ...BLOCKED ON <X> / PROVEN**.

### File ownership

A workstream may only write inside its own `WS-0##/` folder and the source paths named in its own §3 row. Touching another workstream's committed file requires proposing it as a §4 finding first, then the owning workstream makes the change itself.

### Enforcement

On every returned commit, check whether the §0 update-instruction was actually followed via the real diff, not the agent's claim; a miss gets fixed, logged as a **"Process:"** note in §4 naming the workstream and commit, and the next prompt to that workstream opens with an explicit reminder. Two consecutive misses escalate directly to the owner instead of being silently patched a third time.

A NEEDS RUN result that looks fabricated (round numbers, no raw tool noise, timing that doesn't match a real run) gets that workstream quarantined — marked **UNVERIFIED, SUSPECTED FABRICATION** in §3, every downstream dependency blocked, owner flagged immediately.

The §6 session-start pull-and-HEAD-check must actually be performed and its result stated, not assumed.

---

## 8. Prompt log (rolling — most recent 20)

> Every prompt the coordinator hands the owner per §0.1 is logged here, newest first, capped at 20 (drop oldest past that). This logs the deliverable itself, not just its outcome.

**2026-09-25 — Intent: land §0.1/§3/§4/§5/§7/§8 in one pass.**

> Open CLAUDE.md at the repo root. First run `git log -1` and confirm HEAD
> is `c44fe5f` — if it isn't, stop and report the actual HEAD before
> touching anything.
>
> Make these edits, then commit:
>
> A. Header: update "Last synced against main" to commit `c44fe5f`.
>
> B. §3 table:
> - Delete the stale "HEAD sync note (2026-09-25)" line above the table.
> - P1-03 row → Status: IMPLEMENTED/COMMITTED (M1–M4 baseline published,
>   M4 verdict PASS, no critical ontology contradiction vs P1-06/P1-08).
>   Evidence: docs/agent-system/workstreams/WS-003/PHASE-1-ONTOLOGY-BASELINE.md,
>   commit 188cbcf. Next action: dormant; watch two ratified-law triggers
>   relevant to P1-09 — reopening D-324 for a CONTRADICTED state, and a
>   new decision needed to generalize D-424's staleness rule — don't act
>   on either preemptively.
> - P1-05 row → Status: IMPLEMENTED/COMMITTED (baseline published; µhost
>   confirmed exactly 1,500/1,500 lines; no plugin-boundary violation in
>   P1-06 or P1-08). Evidence: docs/agent-system/workstreams/WS-005/PHASE-1-KERNEL-BASELINE.md,
>   commits ac3a0d3, 4316c27. Next action: treat H-01 (proving the
>   executable manifest entry is contained inside the content-hashed
>   plugin tree) as the next kernel slice, under the existing B5 1,500-line
>   constraint; don't touch P1-06/P1-08 for this.
>
> C. §4 findings log: append one new dated entry (2026-09-25) — the host
>   line-count "contradiction" was a counting-method difference, not real
>   drift. Must cover: P1-05 claimed exactly 1,500/1,500 lines citing
>   CURRENT-INVARIANTS.md; raw `wc -l` on host/src/*.ts gave 1,487, a
>   uniform 13-line gap (+1 per file, 13 files); root cause is the repo's
>   gate script using content.split("\n").length vs wc -l's newline-count,
>   which differ by one whenever a file ends in a trailing newline;
>   running the gate's actual method returns 1,500/1,500, matching P1-05.
>   Resolution: NOT a contradiction. Affects: anyone manually
>   spot-checking line counts — use the gate's method, not raw wc -l.
>
> D. §5 wave tracker: change Wave 2b from "[SENT, awaiting return]" to
>   "[DONE — 188cbcf (P1-03), ac3a0d3 + 4316c27 (P1-05)]".
>
> E. New §0.1, right after §0's instruction block, titled "The coordinator
>   has no write access — deliverables are prompts, not files." State: the
>   Claude coordination session is read-only (clone/pull/verify only, no
>   push/commit/PR); every deliverable to the owner must therefore be a
>   self-contained execution prompt for the write-access agent to apply,
>   never a raw file for manual pasting — a raw file is a process violation,
>   since it reintroduces the owner as a manual copy step. Every such prompt
>   gets logged in the new §8.
>
> F. New §7 "Program governance — roles, decision authority, enforcement",
>   after current §6. Include:
>   - Roles table: Owner (final authority, approves ratified-law changes,
>     runs NEEDS RUN steps) / Coordinator (Claude, read-only, drafts+logs
>     prompts, maintains §3–§5, flags drift; cannot push or reinterpret
>     ratified law) / Execution agent (read-write; implements+commits;
>     cannot fabricate NEEDS RUN results, touch another workstream's
>     committed files without a logged reason, or alter ratified law
>     without an owner-approved D-### record).
>   - Decision authority: D-### changes need an explicit new/amended
>     record AND owner sign-off, never as a side effect of a baseline doc.
>     Status-label glossary, used consistently: NOT STARTED / LAUNCHED,
>     AWAITING RETURN / IMPLEMENTED-COMMITTED / ...BLOCKED ON <X> / PROVEN.
>   - File ownership: a workstream may only write inside its own WS-0##/
>     folder and the source paths named in its own §3 row; touching
>     another workstream's committed file requires proposing it as a §4
>     finding first, then the owning workstream makes the change itself.
>   - Enforcement: on every returned commit, check whether the §0
>     update-instruction was actually followed via the real diff, not the
>     agent's claim; a miss gets fixed, logged as a "Process:" note in §4
>     naming the workstream and commit, and the next prompt to that
>     workstream opens with an explicit reminder; two consecutive misses
>     escalate directly to the owner instead of being silently patched a
>     third time; a NEEDS RUN result that looks fabricated (round numbers,
>     no raw tool noise, timing that doesn't match a real run) gets that
>     workstream quarantined — marked UNVERIFIED, SUSPECTED FABRICATION in
>     §3, every downstream dependency blocked, owner flagged immediately;
>     the §6 session-start pull-and-HEAD-check must actually be performed
>     and its result stated, not assumed.
>
> G. New §8 "Prompt log (rolling — most recent 20)", after the new §7.
>   Header note: every prompt the coordinator hands the owner per §0.1 is
>   logged here, newest first, capped at 20 (drop oldest past that) — logs
>   the deliverable itself, not just its outcome. Seed it with one
>   retroactive entry dated 2026-09-25 whose intent is "land §0.1/§3/§4/
>   §5/§7/§8 in one pass," quoting this prompt's own text as the entry.
>
> H. §6 step 4 — append: "and remember you have no write access yourself
>   (§0.1): the prompt, not a raw file, is the deliverable. Log it in §8
>   before handing it to the owner." Add a new step 6: "Before generating
>   a prompt for any workstream that touches ratified law or another
>   workstream's already-committed files, check §7's file-ownership map
>   and decision-authority rule first."
>
> Commit as: "docs: add governance/enforcement (§7), prompt log (§8),
>   no-write-access rule (§0.1); sync P1-03/P1-05 returns (§3/§4/§5)".
>
> BEFORE YOU FINISH: re-read the committed CLAUDE.md back and confirm every
> section above (A–H) is actually present in the diff, not just intended —
> paste the real commit hash back into this conversation.

---

## 9. Pending prompts (queued, not yet sent)

Two prompts are drafted-in-intent but not yet sent, both blocked on the same single owner action:

| # | Prompt | Blocked on | Unblocked by |
|---|---|---|---|
| 1 | P1-07 launch (Provider Intelligence & Autonomous Maintenance) | P1-08's PHASE-1-HANDOFF-PACKAGE.md needs a real M4 result attached | The owner running `bun test plugins/provider-browser/test/live-send.test.ts` and `bun run omega:gate` from omega-baseline/omega-final, pasting real output into the P1-08 conversation |
| 2 | P1-09 launch (Ω Integration & End-to-End Proof) | P1-06 + P1-07 + P1-08 all need real (not designed-but-unrun) output | P1-06's two real chain executions (success + refusal) and prompt #1 completing |

Both are gated behind the same single owner action: running P1-08's tests/gate and relaying the real output. P1-01/02/03/05 are dormant (done, no action pending). P1-04/P1-10 are explicitly deferred past Phase-1. Neither queued prompt has an entry in §8 yet — an entry is only added there once the prompt is actually sent, per §0.1.
