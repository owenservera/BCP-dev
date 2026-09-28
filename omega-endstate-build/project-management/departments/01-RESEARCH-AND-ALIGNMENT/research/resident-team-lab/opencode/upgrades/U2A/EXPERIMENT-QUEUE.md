# U2A Experiment Queue

## E-U2A-01 — Resident/session split
Create one resident identity, execute work, replace its OpenCode session, and continue from durable state.

## E-U2A-02 — Capability fan-out
Run two independent work items using the same worker capability and prove distinct worker instances.

## E-U2A-03 — Dormant presence
Stop model activity while keeping resident state/subscriptions alive.

## E-U2A-04 — Single-trigger wake
Emit one durable trigger and prove exactly one bounded model activation.

## E-U2A-05 — Event coalescing
Emit a burst of related changes and compare one coalesced activation with one activation per event.

## E-U2A-06 — Micro-context sentinel
Give a background sentinel trigger + policy + relevant durable state and compare with a larger context bundle.

## E-U2A-07 — Attention contention
Create concurrent foreground and background demand. Measure admission, starvation, cancellation, and fairness.

## E-U2A-08 — Session rollover
Force resident session replacement after context growth/compaction and verify continuation from durable state.

## E-U2A-09 — Restart recovery
Terminate and restart the resident runtime with dormant residents and one active worker.

## E-U2A-10 — Background authority boundary
Have a sentinel detect a consequential condition and require a governed work request instead of direct protected mutation.