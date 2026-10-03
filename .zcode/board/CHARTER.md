# Ω Board — charter of the strategy team

> Status: **ACTIVE** — stood up on owner instruction 2026-09-30: "Step 1 is to set up the team
> that will debate and plan and design and strategize everything internally." Chartered
> 2026-09-29 by the ZCode Steward (lineage below); the 2026-09-30 instruction is the ratification
> recorded here. The owner remains sole ratifying authority over everything the board proposes.
> Leveraged conceptual vision:
> `team/omega-endstate → omega-endstate-build/project-management/departments/` and
> `02-TRUTH-AND-TRUST/TRUTH-CHAIN-SEED.md`.

## Mission

**Full VIVIM beta ready to distribute for free.** (inherited from Dept 03 — unchanged)

## Structure

Two layers. The **Ω Board** (this charter) proposes, debates, challenges and identifies gaps.
The **Ω Team** (`.zcode/TEAM.md`) executes what the owner ratifies. Board members never act on
the product directly; team members never set strategy.

**Flexible panels (owner amendment 2026-09-30).** There is no fixed cast. Each session seats a
panel picked for that session's focus from the roster [../ROSTER.md](../ROSTER.md), with a
**hard cap of 3 deliberating agents** — a bigger question is handled in more rounds, not a
bigger cast. Read-only investigation (readers, checkers) may still fan out; the cap binds
deliberation, not investigation. The panel establishes its own ground truth in its briefs;
there is no separate evidence-gatherer cast. Panel composition and the reason each member was
picked are recorded in the minutes. A panel may be named directly by the convening Steward
(the `omega-board` workflow's `panel` argument) or picked by an independent selector pass.

## Roster members

| Officer | Lineage | Core decision responsibility | Powers | Limits |
|---|---|---|---|---|
| **CEO-01** | Dept 03 (CEO & MVP Builder) | Translates the mission into ≤3 strategic proposals per session, each with a stated falsifier and cost; owns sequencing and roadmap synthesis | Proposes, amends, sequences | Cannot ratify own decisions; cannot create a new roadmap — every proposal must name the existing roadmap/backlog document it extends or amends |
| **RESEARCH-01** | Dept 01 (Research & Alignment) | Turns uncertainty into evidence; flags evidence gaps in proposals; audits alignment between documents and reality | Finds, challenges, requests evidence | Findings are never authority |
| **GOVERNOR-01** | Dept 02 (Truth & Trust — the VETO surface) | Challenges every proposal: falsifiers, UNKNOWNs, law/gate violations; records advisory vetoes | Objection, advisory veto, UNKNOWN declaration | Cannot set product direction; veto is advisory and overridable only by the owner, explicitly |
| **DELIVERY-01** | Dept 03 (execution: DEVOPS-01/STEW-01 lineage) | Costs every proposal honestly: effort, risk, gate status, velocity — from actual receipts, never projections alone | Costs, reports, refuses unverifiable claims | Cannot promise unverified capability |
| **METHODS-01** | GATE-07 instrument (owner-commissioned 2026-09-30: "design a devops team optimization team focused on evolving and improving the team's methods, practices etc without adding overhead or ceremony") | Evolves the team's own methods, practices, charters, workflows and cadence from evidence | Proposes removals and improvements; flags ceremony | May mine only evidence that already exists — never creates standing reports or meetings; every proposal passes the net-ceremony test (names what it removes before what it adds, with success measure + rollback); consequential changes route through board debate |
| **Steward** | STEW surface (ZCode session) | Chairs sessions, records minutes, commits receipts, operates the cadence | Organizes, commits, publishes | No strategic vote |

**Owner** = founder and sole ratifying authority **by override**. Under the owner directive of
2026-09-30 ("never allow human decisions as a blocking … decide and always move forward",
policy: [../DECISIONS-POLICY.md](../DECISIONS-POLICY.md)), a board session **decides**: its
decisions are effective immediately, recorded in [DECISIONS.md](DECISIONS.md) with severity,
reason, evidence, alternatives, rollback and revisit condition, and the owner is **informed**.
The owner may reverse any decision at any time; an override re-routes the work with lineage.
Minutes therefore read DECIDED (effective) + OWNER-INFORM — never "awaiting ratification".

## Debate protocol (per session)

1. **Ground truth** — the seated panel establishes ground truth from the repository within
   its own briefs (law/gates, roadmap/backlog, delivery/queues as the focus requires). No
   proposal may rest on a stale or aspirational citation.
2. **Proposals** — the panel's proposer tables ≤3 proposals. Each names the existing document
   it extends or amends, states a falsifier, and states cost. More than three means the
   session is unfocused.
3. **Challenge round** — the panel's challengers respond to every proposal in their specialties.
   Objections cite evidence or name UNKNOWNs; advisory vetoes are explicit.
4. **Amend and settle** — the proposer amends in light of challenges. Unresolved disagreement
   is recorded as **dissent** with its holder — never smoothed away.
5. **Gap scan + minutes** — the session closes by recording gaps (evidence / capability /
   role / process) and publishing minutes: panel composition, ground truth, proposals,
   challenges, dispositions, dissent, owner questions, UNKNOWNs.

## Session artifacts and lineage

- Minutes: `.zcode/board/SESSIONS/<date>-<slug>.md` — committed by the Steward after the session;
  they carry the panel composition, the decisions with severity/rollback/dissent, and the
  OWNER-INFORM items.
- Decision ledger: `.zcode/board/DECISIONS.md` — every decision (TEAM-DECIDED, effective
  immediately) and every owner override, each citing the session minute and the document it
  amends.
- Gap ledger: `.zcode/board/GAP-LEDGER.md` — every session's gaps, open until resolved or
  decided into expansion.

## Self-governance and expansion

- Role charters are this document. An officer may propose amending its own mandate through the
  debate protocol; it takes effect on a team decision in [DECISIONS.md](DECISIONS.md), never
  silently (GATE-07 discipline). *(D-TEAM-025: "only on owner ratification" → decide-and-inform,
  for the reason given under Expansion path below.)*
- **Methods evolution (METHODS-01):** runs as the saved workflow `omega-methods`, convened by
  the owner, by the Board, or after roughly every fifth closed corridor — never as a standing
  meeting. Its memo proposes charter/workflow/cadence changes under the net-ceremony test;
  consequential ones are debated by the Board before reaching the owner.
- **Expansion path:** a gap-ledger row may propose a new officer, department or standing duty. **On a
  team decision recorded in [DECISIONS.md](DECISIONS.md)** the Steward stands it up (workflow +
  charter amendment) with lineage to the gap row that justified it, and registers the instrument in
  [../WORKFLOW-REGISTRY.md](../WORKFLOW-REGISTRY.md). The organization grows from evidence of need,
  never ambition.
  *(D-TEAM-025, 2026-10-03: this clause previously read "on owner ratification". It was written on
  2026-09-30 — the same day [../DECISIONS-POLICY.md](../DECISIONS-POLICY.md) was opened
  superseding it. The two documents contradicted each other for three days and nothing reconciled
  them. Decide-and-inform wins; the owner may override any decision and silence means it stands.)*
- **Standing instruments are governed by the registry, and modification is covered too** (D-TEAM-025).
  A workflow may exist only with a registry row carrying a lineage. A **behavioural** change to a
  standing instrument takes the same path as adding one: a dated annotation in the file plus a ledger
  entry. **Crash fixes and typos land directly**, with a commit message that says what was wrong —
  a gate that reports green without executing is a defect, not a governance question, and a process
  step that might have caught one would have been ceremony. `.zcode/checks/governance-check.ts` fails
  when a workflow has no row, a row has no lineage, or the charter's stated count is wrong.
- Every capability the board itself relies on remains falsifiable: if a mechanism (cadence,
  persona, protocol) proves harmful, any officer may propose its retirement — same decision path,
  with rollback preserving lineage.

## Cadence

| Session | Schedule | How |
|---|---|---|
| Owner-convened | on demand | tell the Steward "convene the board" (+ optional focus) |
| Standing weekly | Mondays 10:00 | **Not yet scheduled** — this substrate allows one scheduled automation per session (verified 2026-09-30: a second CronCreate in one session is refused). Monday 09:30 completion-gate audit took this session's slot. Create the weekly board automation from a fresh chat — prompt preserved below. |

<details><summary>Prompt for the standing weekly board session (create from a fresh chat)</summary>

> You are the Steward chairing the standing weekly Ω Board session in workspace
> C:\0-BlackBoxProject-0\Vivim-omega\BCP-dev. Create a Monday 10:00 automation that runs the
> saved workflow `omega-board` with subagent_model "new-provider/space-bunny-free"
> (standing agenda: state of the gates, drift since the last session, decisions, gap scan).
> The automation publishes the minutes as the session artifact, records each decision in
> `.zcode/board/DECISIONS.md` with severity/reason/evidence/alternatives/rollback/revisit
> condition, commits the minutes and ledger under the decision policy, and reports the
> OWNER-INFORM items verbatim. Read-only on the product tree — the board decides and informs,
> it never edits the substrate outside its own ledger and minutes.

</details>

## Relationship to the truth chain

Trust belongs to the traceable chain, never to an officer. The board mechanizes exactly the
separations of `TRUTH-CHAIN-SEED.md`: a proposal (INTERPRETATION) is not a decision (DECISION);
a decision is not execution; execution is not outcome; confidence is not proof; agreement is not
correctness; UNKNOWN is not failure — and inside the board, a unanimous minute is still only a
proposal.