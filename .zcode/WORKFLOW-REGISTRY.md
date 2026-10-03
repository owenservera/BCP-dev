# Ω workflow registry — every standing instrument, and who owns it

> Status: ACTIVE · opened 2026-10-03 · **owner: the Steward**, per the charter's expansion path.
> Why this file exists: on 2026-10-03 an audit found that **ten workflows existed with no
> registry, no stated owner, and no rule covering modification** — the charter governed *adding*
> a capability and was silent on *changing* one. `TEAM.md` was simultaneously claiming the set
> was "7 saved workflows". The instruments that spend the owner's tokens and write to the repo
> were owned by nobody. This file is that ownership, written down.
>
> **What this registry is NOT:** not authority over *decisions* (that is
> [board/DECISIONS.md](board/DECISIONS.md)), and not a second task store. It answers exactly two
> questions per instrument: **what is it for, and what authorises it to exist.**

## Standing rule

A workflow may exist on disk only if it has a row here with a **lineage** — a gap-ledger row or a
D-record that justified it. Adding a row is the act of standing the instrument up; removing a
workflow removes its row. `[governance-check.ts](checks/governance-check.ts) fails the build when a
file exists in `.zcode/workflows/` without a row here**, so drift is a red gate rather than a
sentence someone eventually notices in a charter.

**Alignment (D-TEAM-025).** The charter's expansion path required "owner ratification" to stand up
a capability. That clause was written on 2026-09-30 and never reconciled with
[DECISIONS-POLICY.md](DECISIONS-POLICY.md), which since **supersedes** it: no human answer blocks
work. **A workflow is stood up by a team decision recorded in the ledger, with a gap row where the
capability was a known gap.** The owner may override any of them at any time and silence means the
decision stands. Nothing here waits on a human.

## The instruments

| Workflow | What it is for | Lineage | Owner | Last verified |
|---|---|---|---|---|
| `omega-board` | Deliberation: seats a panel of ≤3, challenges proposals, **decides** | team setup 2026-09-30 (no gap row — **pre-dates the rule**) | Steward | 2026-10-03 (decides; 3 runs) |
| `omega-build` | The implementation corridor: plan → review → build → gates → verify | team setup 2026-09-30 (**pre-dates the rule**) | Steward | 2026-10-03 (D-TEAM-022: its gate was inert and is fixed) |
| `omega-verify` | Durable completion gate — checks DONE claims against repo evidence | team setup 2026-09-30 (**pre-dates the rule**) | Steward | 2026-09-30 |
| `omega-research` | Bounded research, decomposed into lenses, findings confirmed | team setup 2026-09-30 (**pre-dates the rule**) | Steward | never run to completion |
| `omega-reality-check` | Standing-state sweep across five areas, drift confirmed before reporting | team setup 2026-09-30 (**pre-dates the rule**) | Steward | 2026-09-30 |
| `omega-boundary-audit` | Core-vs-plugin boundary audit vs the 125-row matrix | team setup 2026-09-30 (**pre-dates the rule**) | Steward | never run |
| `omega-methods` | METHODS-01: mines existing evidence for friction, net-ceremony test | **CHARTER.md §Self-governance** (METHODS-01) | Steward | 2026-09-30 (stopped; 0 of 3 miners returned) |
| `omega-redproof` | Red-fixture falsifier — proves a gate check *can* fail | **G-05** + [D-TEAM-018](board/DECISIONS.md) | Steward | built; never run |
| `omega-fixture` | Builds the pinned second synthetic mine (`secondmine`/`replay` need one) | **G-06** + [D-TEAM-018](board/DECISIONS.md) | Steward | built; never run |
| `omega-decide` | Packages an open sub-fork into a D-record-ready packet by refuting claimed blockers | **G-03** + [D-TEAM-023](board/DECISIONS.md) | Steward | **COMPLETED — 2026-10-03, after ~90 min of provider retries.** Two runs: 6 and 9 options, **6 of 8 blocker claims refuted at the cited file**, 2 upheld (both the same one: a 25th catalog op is amendment-class). **It independently confirmed D-TEAM-023, and corrected the question it was asked** — it caught that `tooling/gates/anvil-loc.ts` does not exist. The earlier `BOTH PRODUCED NOTHING` note was true when written and is superseded here |

## Honest notes on this table

**Six rows say "pre-dates the rule".** That is accurate, not a euphemism: the original substrate
was stood up on 2026-09-30, the same day the charter that later constrained it was written. They
are ratified by use, not by a gap row, and this registry records that rather than inventing
lineage for them.

**Five instruments have still never completed a run** — `omega-research`, `omega-boundary-audit`,
`omega-redproof`, `omega-fixture`, and `omega-methods` (one run, stopped with 0 of 3 miners returned).
**A workflow that has never completed a run is an untested instrument, not a working one**, and
four of these were stood up specifically to fix problems that then got fixed by hand instead:
`omega-redproof`'s mutation test was done by hand and left no receipt; `omega-decide` built the SF2
packet that was in fact decided in minutes by reading four files. **They may be good instruments
that have not earned their place yet — but the corpus's own rule is that intent is not evidence,
and only a completed run is.**
`omega-decide` is the cautionary case: it was built specifically to unblock SF2, dispatched twice,
and returned nothing both times; SF2 was actually decided by hand in a few minutes. That is not a
reason to delete it — it may be the provider, not the design — but it is a reason not to describe
it as working.

**The registry does not check that a workflow is any good.** It checks that each one exists on
purpose. Whether an instrument earns its tokens is `omega-verify`'s job and the Monday audit's.

## Changing an instrument

Adding a workflow: a gap-ledger row (if it fills a known gap) → a team decision in
[DECISIONS.md](board/DECISIONS.md) → a row here → the file. **D-TEAM-025 removed the owner-
ratification gate that used to sit between the decision and the file.**

Modifying one: **same rule, and this is the half the charter was missing.** A behavioural change to
a standing instrument — not a typo fix — gets a dated annotation in the file and a ledger entry.
Typos and crash fixes land directly with a commit message that says what was wrong, because a
gate that reports green without running is a defect, not a governance question (D-TEAM-022 is the
example: the gate had never once executed, and nothing about the *process* would have caught it).