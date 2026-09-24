# STATE.md template — copy to missions/<MISSION-ID>/STATE.md

> **Classification: DERIVED — CURRENT**

Front-matter is machine-checked by agent_lint.py. Every body section is
required (write `None.` when empty — never delete a section). When the mission
ends, set status DONE/BLOCKED/PAUSED; that final STATE IS the handoff.

```yaml
mission_id: MISSION-NNN-short-slug
agent_id: YOUR-ROSTER-ID
branch: mission/MISSION-NNN-short-slug
last_commit_inspected: <full or short SHA you verified against>
updated: YYYY-MM-DD
status: ACTIVE
```

## POSITION

One paragraph: where the mission stands right now.

## DONE

- Completed items with evidence (commits, test results).

## IN_PROGRESS

- What is being worked on in this turn.

## NEXT_ACTION

The exact, executable next step a fresh agent can run.

## UNCOMMITTED

Paths + latest wip ref (`refs/wip/<mission>/<timestamp>`), or the words
`tree clean` ONLY when `git status --porcelain` (tracked files) is empty.
Lint refuses a clean claim over a dirty tree.

## DECISIONS_IN_FORCE

Links to ADOPTED insight notes governing this mission.

## OPEN_QUESTIONS

Links to QUESTION insights (with working assumption + reversal cost).

## ESCALATIONS

Named escalation triggers hit, or `None.`

## DO_NOT

Paths and actions forbidden for this mission (Tier 2 + charter exclusions).

## RESUME

3 to 6 lines: how a fresh agent continues from repository files alone.
