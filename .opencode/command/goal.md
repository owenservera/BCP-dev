---
description: Open or resume a durable goal loop — Steward-led waves until the Durable Completion Gate passes.
agent: architecture-steward
---

# /goal — durable outcome-driven loop

You are running inside the Architecture Steward session. The owner gave a goal
($ARGUMENTS). You do not stop at one turn of work — you loop until the goal is
durably complete, blocked, or the owner stops you. This adapts the Ralph loop
(fresh sessions, file-persisted memory, same prompt re-fed) and Claude Code's
/goal (completion predicate evaluated every turn) to this repo's contracts: the
completion predicate is the **Durable Completion Gate**, not string matching.

## State (the loop's memory — files, never chat)

All goal state lives at `docs/agent-system/goals/<slug>/`:

- `GOAL.md` — objective, acceptance criteria, wave log (append-only), status
  (`ACTIVE` / `DONE` / `BLOCKED`), stall counter.
- Receipts stay in their agent homes per SESSION-RESULT-CONTRACT.md; GOAL.md
  links them, never duplicates them.

If `<slug>` doesn't exist: create it (slugify the objective), write GOAL.md
with the objective + your acceptance criteria + status ACTIVE, then begin wave 1.
If it exists with status ACTIVE: read the wave log, resume from the first
uncompleted wave — never redo a verified wave.

## Each wave

1. Assess dependencies (INDEPENDENT / ORDERED / CONDITIONAL / BLOCKED).
2. Compile envelopes (SHA+artifact+semantics prerequisites, gates, STOP).
3. Spawn (Steward→CFAs→`work-*` leaves only; delegation + catalog apply).
4. Collect RESULTS receipts; verify each against the repo.
5. Reconcile durable context; append wave entry to GOAL.md wave log.
6. Evaluate the predicate.

## Completion predicate (evaluated every wave — this replaces promise-matching)

DONE iff, at the current `main` ref: bounded artifacts exist + canonical
receipts exist + TASKS.md entries closed + exact commit recorded + re-read
verifies all of it (DURABLE-COMPLETION-GATE-2026-09-28.md). A chat claim of
completion without this is REPORTED-UNVERIFIED and the loop continues.

## Stall / block handling (no infinite loops)

- A wave that changes nothing increments the stall counter; two consecutive
  stalled waves → stop spawning, mark BLOCKED with the concrete reason, report
  to owner. Never re-run a failed wave unchanged.
- Authority denied/expired, missing keys, unresolvable ambiguity → BLOCKED
  immediately with evidence. Ambiguity is a stop, not a coin flip.
- `/goal clear` (owner message containing "clear the goal") sets status CLEARED
  and stops. `/goal` with no new objective resumes the active goal.

## Headless driver (mechanical Ralph)

In TUI, re-invoke `/goal <same objective>` each turn. Headless, loop it:

```powershell
while ($true) {
  opencode run --auto -m opencode/muse-spark-1.3-contributor-free --agent architecture-steward --command goal "$ARGUMENTS"
  if ((Select-String -Pattern "^status: (DONE|BLOCKED|CLEARED)" docs/agent-system/goals/<slug>/GOAL.md)) { break }
}
```

Each iteration is a fresh session; GOAL.md + repo are the only memory. Always
pass `--agent` explicitly (default-agent boot burns ~50k tokens) and `--auto`
(headless `ask` auto-rejects).
