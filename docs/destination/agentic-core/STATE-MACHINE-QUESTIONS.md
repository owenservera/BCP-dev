# State Machine Questions

## Closed by design
Work is durable execution identity; Plan is versioned and non-authorizing; Attempt is distinct from Step; waits are durable; workers are disposable; human approval resumes the same Work; replay does not perform live side effects.

## Open
Exact canonical state names; whether VERIFYING is Work or Step/Attempt substate; cancellation compensation; branch joins; cross-namespace event ordering; terminal retention.

Invariant: `fromState + event + guard → toState + evidence/effect`. No transition may be inferred from surface/UI state alone.