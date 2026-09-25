# State and Recovery

## State

`DRAFT → VALIDATING → WAITING_AUTHORITY → QUEUED → RUNNING → WAITING_RESOURCE|WAITING_EXTERNAL|WAITING_HUMAN → VERIFYING → SUCCEEDED`.

Failure paths include `RETRY_WAIT → QUEUED`, FAILED, REFUSED, CANCELLED and RECONCILING.

## Restart invariant

Process death must reconstruct runnable state from durable Work/Step/Attempt/Evidence records. No worker, in-memory queue or timer is authoritative.

## Checkpoint invariant

A checkpoint identifies Work/Plan revision, Step, effect identity, inputs, possible effect status, evidence and legal next transitions.

## Recovery

- before dispatch: resume;
- after dispatch before acknowledgement: UNKNOWN_EFFECT/reconcile;
- verified success: continue downstream;
- human gate: wait and resume same Work;
- lease loss: reclaim/requeue with fencing;
- Plan changes: active Work remains pinned unless explicitly migrated.

## Replay

Replay reconstructs coordinator decisions from history; it never silently performs live side effects. Branching, if added, creates new Work lineage.
