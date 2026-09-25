# Runtime Design

The runtime is a deterministic state reducer around durable Work.

```
load Work revision
→ resolve pinned Plan
→ select ready Step
→ authority check
→ acquire resource lease
→ execute Capability
→ verify
→ persist evidence/checkpoint
→ advance Work revision
→ release lease
→ schedule next ready Step
```

Workers are disposable. Durable state is recovery authority.

## Checkpoint

Side-effecting Step transitions:

`READY → RUNNING → VERIFYING → SUCCEEDED|FAILED|WAITING|REFUSED`.

Before dispatch, persist Attempt + stable effect identity. After completion, persist result/evidence before downstream readiness.

## Effect identity

`effectId = stable(workId, planRevision, stepId, logicalAttempt)`.

If the external realization cannot guarantee idempotency, UNKNOWN_EFFECT must reconcile rather than blindly retry.

## Verification

Verification is explicit: deterministic postcondition, observation, revision check, independent capability readback, or human confirmation. Executor success alone is not proof.

## Failure classes

REFUSED, INVALID, TRANSIENT, TIMEOUT, CONFLICT, UNKNOWN_EFFECT, PERMANENT, HUMAN_WAIT, RESOURCE_WAIT.

Coordinator logic, dependency resolution, retry policy and budgets must be deterministic/testable without AI/browser.
