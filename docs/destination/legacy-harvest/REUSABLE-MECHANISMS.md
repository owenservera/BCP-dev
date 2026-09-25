# Reusable Mechanisms

## RM-01 Typed plan lowering
One deterministic execution representation with capabilities, inputs, dependencies and verification; compilation has no side effects.

## RM-02 Preflight gate
`shape/schema → references → dependency → authority → budget → readiness`.

## RM-03 Durable state machine
Use explicit Work states with terminal evidence/refusal/failure, not UI-only status.

## RM-04 WorkStep + Attempt
Separate what should be done from what was actually tried.

## RM-05 Durable gate
Persist reason, proposed action, authority basis, options, expiry, resolver and response.

## RM-06 Bounded execution
Track resource budgets with visible burn-down.

## RM-07 Retry as time
Persist attempt number, next eligible time, policy, reason and terminal disposition.

## RM-08 Branch lineage
Create a causal child/variant; preserve original evidence.

## RM-09 Temporal triggers
Clock/event conditions wake standing intent; they create Work instead of bypassing it.

## RM-10 Restart reconstruction
Restart from persisted Work/evidence/resource refs; never assume in-memory maps are truth.

## RM-11 Cache invalidation
Invalidate acceleration caches on semantic change; never treat cache as canonical state.

## RM-12 Return continuity
Project Completed / Running / Waiting / Changed / Failed / Found / Next with links to evidence.

## RM-13 Export manifest
Declare scope, contract revision, counts, encryption and portability coverage.

## RM-14 Crash marker
Persist enough migration state to detect interrupted cutover and choose recovery.
