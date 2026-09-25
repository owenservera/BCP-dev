# Resource and Concurrency

Resources are named capacity domains: CPU, memory budget, worker slot, filesystem sandbox, browser profile, provider account or exclusive object lock.

## Lease

`leaseId, resourceRef, workId, attemptId, epoch, acquiredAt, expiresAt`.

Epoch fencing prevents stale workers from committing after lease loss.

## Admission

Stable ready-step order → resource availability → atomic lease + Attempt start → execution → release.

Parallelism requires explicit dependency independence. Work with no capacity becomes WAITING_RESOURCE rather than spinning.

## Budgets

V1 should support deadline, attempts, capability-call count, per-step timeout and artifact size. Provider/monetary budgets can be additive.

Hard OS resource enforcement is platform-specific and must be measured honestly; worker isolation is not automatically hard memory isolation.

Only the durable transition authority advances Work revisions. Workers submit outcomes.
