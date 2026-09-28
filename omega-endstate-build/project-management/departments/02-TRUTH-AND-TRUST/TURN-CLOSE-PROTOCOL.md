# Ω End-State Build — Turn-Close Protocol

> Status: FOUNDATIONAL OPERATING RULE
> Enforcement: INFORMATIONAL / NOT YET MACHINE-ENFORCED

Every agent turn or session operating in the Ω End-State Build should end by publishing the current task queue visible to that participant.

## Required closing publication

The final response/message for a turn should contain a detailed Markdown table with one row per known task in the participant's active queue.

| Task ID | Class | Status | Owner/Claimant | Objective | Target | Mission Connection | Requested Output | Blocker / Next Action |
|---|---|---|---|---|---|---|---|---|

Use the authoritative task file as the source of truth.

## Rules

1. Do not silently omit a known task merely because it is not active.
2. Mark unknown fields as UNKNOWN rather than inventing them.
3. Distinguish task status from the agent's opinion about the task.
4. Include completed tasks when they remain part of the current durable queue/history.
5. The table is a publication surface, not a second source of truth.
6. If the queue is too large for the available response surface, publish the full queue when practical and explicitly identify any omitted rows and the reason.
7. A task-table publication must not be used to imply authority, completion, verification or ownership that the durable task record does not contain.
8. The turn may not be considered closed until the queue publication is present.

## Truth-chain role

Queue publication makes the current work state observable.

It does not establish that the tasks are correct, that claimed work is complete, or that the underlying conclusions are true.

QUEUE PUBLICATION != TASK TRUTH

It is a visibility aid inside the larger trust chain.

## Evolution

This protocol may later become machine-generated.

Any automated publisher must preserve the authoritative task files and their lineage rather than replacing them with an independent queue representation.