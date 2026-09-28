# Task Queue Runbook

## Queue source of truth

The durable queue is the set of files under:

`tasks/VG-*.md`

TASK-QUEUE.md is the human-readable index and starting view.

A task file is authoritative for its own state.

This permits multiple participants to add work without requiring every participant to edit one central mutable task record.

## Add work

Any authorized participant can add a task by:

1. creating a new `tasks/VG-XXXX.md` file using TASK-FORMAT.md;
2. giving it Status: NEW;
3. optionally adding an index entry to TASK-QUEUE.md.

The department's Add-VetoTask.ps1 convenience tool does both.

## Claim work

A fresh session should:

1. inspect TASK-QUEUE.md;
2. inspect tasks/ for authoritative task records;
3. choose one unclaimed task it is authorized to perform;
4. record a claim in the task file;
5. begin work.

For concurrent work, two agents should use distinct task IDs.

## Claim safety

Do not overwrite another agent's claim.

Before changing a task from NEW to CLAIMED, verify the current task contents.

A task with an existing claimant should be treated as owned unless its state explicitly permits parallel independent audits.

## Parallel independence

When a task benefits from independent audits, create distinct task IDs for each audit.

Do not have multiple agents silently edit one result.

## Blocked work

Record the exact blocker.

Do not mark a task done merely because the requested conclusion cannot yet be reached.

Use UNKNOWN or REQUEST-EVIDENCE where appropriate.

## Completion

Every completed task must point to a durable result.

Keep the original task and claim history.

## Learning

After an outcome becomes available, add an OUTCOME-REVIEW task.

The queue is therefore both intake and longitudinal organizational memory.

## Self-generated work

VETO-01 may discover useful follow-up work.

Add it to the same queue rather than maintaining a hidden private backlog.

Self-generated tasks must state the beta mission connection.

## Index drift

If TASK-QUEUE.md differs from tasks/, tasks/ wins.

Rebuild or repair the index as a low-priority maintenance action.

Do not block useful audit work because the convenience index is stale.
