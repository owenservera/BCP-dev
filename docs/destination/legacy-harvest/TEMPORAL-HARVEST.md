# Temporal Harvest

## Evidence

- `src/automation/scheduler.ts`
- `src/storage/contracts/automation-store.ts`
- `src/engines/retry-engine.ts`
- `src/storage/impl/workflow-retry-queue-store-impl.ts`
- `src/engines/objective-engine.ts`
- `tests/unit/automation/cron-parser.test.ts`

## Schedule

Legacy supports cron/interval/event schedules, next/last run state and run-now.

**Destination:** a standing/temporal intent wakes to create or advance Work. The scheduler itself has no independent authority to perform arbitrary effects.

### Critical evidence split

The runtime scheduler contains a stubbed cron-next implementation, while the cron test file contains a richer five-field parser implementation inline.

Therefore the test proves intended parser behavior more strongly than the production scheduler proves it.

## Retry

Legacy has generic retry policy and a durable workflow retry queue with attempt, nextRetryAt, maxAttempts, backoff and dead-letter status.

**Destination invariant:** retry is explicit temporal Work state, not hidden recursive looping.

`FAILED ATTEMPT → retry policy → WAITING(reason=retry) → time → NEW ATTEMPT`

## Objective

ObjectiveEngine supports cross-run agenda items including task, wait_for_event, human_check, sleep_until and review.

**Destination:** preserve durable pursuit and sleep/wake, but express it through Standing Intent and Work rather than add another root ontology.

## Acceptance seed

Prove `standing intent → schedule/event → Work → wait/retry → wake → attempt → result → attention` across process restart.
