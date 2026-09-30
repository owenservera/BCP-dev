# Ω Team decision policy — decide, inform, move forward

> Status: ACTIVE · owner directive 2026-09-30: **"Never allow human decisions as a blocking —
> always take an opinion as a team (dynamically spawned based on severity) and decide and
> always move forward."**
> This supersedes every earlier rule in this repository's ZCode layer that parked work on an
> open owner question (`BLOCKED-EVIDENCE` on a BQ, board minutes "awaiting ratification"
> before decisions take effect, `PENDING-STEWARD-COMMIT`-style waits). Human input is now
> **advisory by default**: it can arrive at any time, and when it does it *overrides* — but its
> absence never stops work.

## The rule

1. **No human answer is a gate.** A question that would previously have parked a lane is turned
   into a team decision within the same session that finds it. Work proceeds on that decision.
2. **The deciding body is spawned per severity, never larger than 3.** Deliberation is capped at
   3 agents ([ROSTER.md](ROSTER.md)); severity decides how many of those 3 are seated and who
   challenges:
   | Severity | Applies when | Panel |
   |---|---|---|
   | **S1** | Routine, reversible, local, low blast radius (a queue entry, a doc fix, a lane's internal choice) | 1 member with the fitting specialty |
   | **S2** | Consequential but reversible (sequencing, costing, tooling, a new live principal, a queue reorder) | 2 members — proposer + a challenger with a different lens |
   | **S3** | Hard to reverse, or touches ratified law / boundary / security / product intent (append-only records, public artifacts, external systems, mission-level sequencing) | 3 members — proposer + GOVERNOR-01 (law/boundary) + one more lens; rollback plan required; dissent recorded |
3. **Owner-reserved class** — irreversible external commitments, credentials/secrets, material
   financial commitments, legal/compliance, changes to product intent: the team **still does not
   block**. It takes the most conservative *reversible* action that keeps everything else moving
   (prepare, stage, draft, defer only the irreversible step itself) and records a live
   **OWNER-INFORM** item. Everything not requiring the irreversible act proceeds.
4. **Decisions are effective immediately**, recorded in [board/DECISIONS.md](board/DECISIONS.md)
   as `TEAM-DECIDED` with: decision, reason, evidence, alternatives considered, status,
   **revisit condition**, severity, dissent. The owner is informed the same turn (report, ledger,
   minutes) — informed, not asked.
5. **Override, don't re-litigate.** The owner may reverse any decision at any time; the ledger
   records the override with lineage and the team adapts without argument. Silence means the
   decision stands and work continues.
6. **Missing evidence is not a blocker either.** Decide with the best available evidence, label
   what is UNKNOWN, and state the revisit condition that would force a re-decision. Only a
   *verified* absence that makes the work impossible may pause a specific step — and then the
   team routes around it and keeps the rest moving.
7. **Escalation becomes a report, never a gate.** When something genuinely needs the owner, it
   appears as an OWNER-INFORM line in the decision ledger and the run report. It never appears
   as a reason work stopped.

## What this changes in the machinery

- `WORKSTREAMS.md`: `BLOCKED-EVIDENCE` now means *evidence* is missing (never a human answer);
  new status `TEAM-DECIDED` marks lanes running on team decisions open to owner override.
- `board/CHARTER.md`: minutes publish decisions (effective) + OWNER-INFORM items, not
  ratification requests.
- `omega-board.dwf.ts`: the settle step **decides** — it returns decisions with severity and
  rollback, and owner-inform items instead of owner questions.
- Closed lanes no longer wait for a human to unblock them: the ledger's decisions are the
  unblocking event.

## Why this is safe

The truth chain is untouched: a team decision is still labelled as what it is (INTERPRETATION →
DECISION by the team, not by the owner), self-decided results stay visible as self-decided, and
every decision carries its falsifier and revisit condition. What changes is only *who waits*:
nobody does.
