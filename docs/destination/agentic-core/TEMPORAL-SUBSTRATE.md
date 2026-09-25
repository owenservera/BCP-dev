# Temporal Substrate

Long-running Work must continue with no canvas, chat, browser or AI provider open.

## Durable Wake

`Wake {wakeId, workId, kind, dueAt?, eventType?, dependencyRef?, status, firedAt?, dedupeKey}`

Kinds: TIME, EVENT, EXTERNAL_CALLBACK, DEPENDENCY, MANUAL, RETRY.

The scheduler changes eligibility; it does not authorize or execute side effects.

## Laws

- timers are data, not sleeping processes;
- restart reconstructs due timers;
- event delivery may be at-least-once, so wake transitions require dedupe;
- clock jumps require explicit policy;
- monotonic clocks are for local elapsed deadlines; wall time is for durable schedules.

**PROMOTION-CANDIDATE:** a durable wake layer is more fundamental than cron. Cron is one Trigger realization.
