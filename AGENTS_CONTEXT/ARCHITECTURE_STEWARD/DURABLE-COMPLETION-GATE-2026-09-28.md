# Durable Completion Gate
## 2026-09-28

> Status: ACTIVE — EXECUTION INVARIANT
> Purpose: prevent chat-reported completion from diverging from durable repository state.
> Authority: process/control-plane contract only; not Ω law or semantic authority.

## Rule

A substantive task has two separate states:

- work conclusion — what the agent believes it achieved;
- durable completion — what the repository can independently verify.

Only durable completion advances a task, stage, or portfolio gate.

A chat message saying DONE / COMPLETE / CONFIRMED is never sufficient to advance durable state. Until the repository verifies the completion surface, the claim is REPORTED-UNVERIFIED.

## Mandatory completion transaction

Before an agent reports a substantive task as DONE or COMPLETE, it must perform this sequence against the actual delivery ref (normally current main):

1. perform the bounded task;
2. create/update the required durable artifacts;
3. create the canonical <AGENT-HOME>/RESULTS/<SESSION_ID>.md receipt;
4. update the matching TASKS.md entry to DONE, BLOCKED, PARTIAL, or SUPERSEDED as justified;
5. record the exact commit/ref in the receipt;
6. re-read current main after the write and verify the receipt and task-state update are both present at that ref;
7. only then use DONE / COMPLETE in the final chat report.

The final re-read is mandatory. A successful write call alone is not evidence that the final delivery ref contains the intended state.

## Concurrency / race handling

If a concurrent write causes a stale-ref or non-fast-forward failure:

- refresh current main;
- re-read the affected files;
- apply the same bounded change to the refreshed state;
- retry without force-moving main;
- re-run the final verification in the numbered sequence above.

Do not report DONE from a branch or local state merely because the work exists somewhere else. The report must identify the actual durable delivery ref.

## Failure states

Use:

- DONE — receipt + task-state closure are verified on the delivery ref;
- PARTIAL — substantive work is incomplete, but useful durable evidence exists;
- BLOCKED — the required work/evidence cannot be completed with the available environment;
- REPORTED-UNVERIFIED — the agent believes it finished, but the durable completion transaction has not been verified; this state must not advance a downstream gate.

## Steward rule

The Architecture Steward computes completion from repository evidence, not chat assertions. When a chat report says DONE but the receipt or TASKS.md closure is absent on current main, classify the work as REPORTED-UNVERIFIED, do not silently treat it as complete, and route the next action to the missing durable completion step rather than duplicating the substantive work.

## L2-specific rule

For Stage-E L2 owner adapters, a characterization is not complete merely because the adapter artifact exists. The owner must also leave the canonical result receipt and close the exact L2 task state on the delivery ref. Only then may Steward L2 reconciliation count that owner input.

## Anti-loop invariant

Once a substantive task has been reported as REPORTED-UNVERIFIED, a subsequent Next must first attempt durable completion verification. It must not automatically repeat the underlying research/characterization.
