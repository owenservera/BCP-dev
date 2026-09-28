# Task Format

Any authorized participant may add a task.

The queue is intentionally low-friction. Do not require a workflow tool, scheduler, API, or special UI to create work.

## Required task fields

Each task needs:

- Task ID: unique VG-NNNN
- Status: NEW, CLAIMED, IN_PROGRESS, BLOCKED, DONE, DEFERRED
- Requester: human or agent identity
- Objective: one clear sentence
- Target: what is being audited or researched
- Primary mission connection: why this can matter to beta delivery
- Requested output: what durable result should exist

Optional:

- scope;
- evidence starting points;
- deadline;
- related task;
- trigger source;
- suggested context bundle;
- known constraints.

## Queue entry template

## VG-XXXX — short title
- Status: NEW
- Requester: identity
- Class: AUDIT, REVIEW, RESEARCH, BOUNDARY-DISCOVERY, SELF-DEFINITION, SELF-EVOLUTION, OUTCOME-REVIEW
- Objective: one sentence
- Target: thing being examined
- Primary mission connection: why it matters
- Requested output: durable artifact
- Scope: optional
- Starting evidence: optional
- Created: YYYY-MM-DD

## Claiming

A worker claims a task by changing:

Status: NEW -> Status: CLAIMED

and adding:

Claimed by: agent/session

Then:

CLAIMED -> IN_PROGRESS

A task should not have two active claimants unless the task explicitly requests independent parallel audits.

## Completion

A completed task must point to its durable result:

Result: results/filename.md

and change to DONE.

Do not delete completed tasks. They are part of the department's learning history.
