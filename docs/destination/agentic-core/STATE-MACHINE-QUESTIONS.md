# State / Lifecycle Questions

Do not ratify these enums during research.

## Work

Candidate:

`DRAFT → READY → RUNNING → WAITING → SUCCEEDED / FAILED / REFUSED / CANCELLED → REVIEWED`

Determine whether PAUSED, BLOCKED, RECOVERING, DEGRADED or EXPIRED require independent semantics.

## Plan

Possible lifecycle:

`DRAFT → VALIDATED → FROZEN → SUPERSEDED`

Plan mutation must never rewrite historical execution.

## Step

Separate plan-node state from execution-attempt state if evidence requires it.

## Wait reasons

A wait should be explicit, typed and resumable:

- human approval;
- human input;
- timer;
- dependency;
- resource;
- external observation;
- retry backoff.

## Retry

Retry must record:

- reason;
- attempt number;
- backoff;
- prior result/error;
- idempotency status;
- whether the side effect may already have occurred.

## Cancellation

Cancellation semantics must answer:

- before execution;
- during deterministic local execution;
- during an external effect;
- after effect but before verification;
- while waiting;
- after completion.

## Recovery

After process restart:

`durable state → reconstruct runtime → identify incomplete Work → classify safe continuation → resume or refuse`

No recovery may silently duplicate a consequential effect.

## Scheduling

Research:
- one-shot;
- interval;
- calendar;
- event-triggered;
- dependency-triggered;
- startup/resume;
- manual;
- condition-based.

The scheduler should awaken Work; it should not become a second Work store.
