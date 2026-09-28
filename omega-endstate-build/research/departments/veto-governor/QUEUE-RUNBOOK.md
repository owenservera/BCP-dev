# Task Queue Runbook

## Add work

Any authorized participant can add work directly to TASK-QUEUE.md using TASK-FORMAT.md.

For larger tasks, also create a dedicated task file under tasks/.

Do not require an orchestration service merely to enqueue work.

## Claim work

A fresh session should:

1. inspect the queue;
2. choose the highest-value unclaimed task it is authorized to perform;
3. record a claim;
4. create or update the durable task record;
5. begin work.

The first task may be explicitly requested by the owner even if other work exists.

## Parallel independence

If a task benefits from independent audits, create distinct task IDs for each audit rather than having multiple agents silently edit one result.

## Blocked work

Record the exact blocker.

Do not mark a task done merely because the requested conclusion cannot yet be reached.

Use UNKNOWN or REQUEST-EVIDENCE where appropriate.

## Completion

Every task must point to a durable result.

Keep the original task and claim history.

## Learning

After the outcome becomes available, add an OUTCOME-REVIEW task.

The queue is therefore both intake and longitudinal organizational memory.

## Self-generated work

VETO-01 may discover useful follow-up work.

It should add the task to the same queue rather than maintaining a hidden private backlog.

Self-generated tasks must state the beta mission connection.
