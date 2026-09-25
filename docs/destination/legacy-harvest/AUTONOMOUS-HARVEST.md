# Autonomous Harvest

## Evidence

- `src/engines/autonomous-types.ts`
- `src/engines/autonomous-planner.ts`
- `src/engines/autonomous-execution.ts`
- `src/engines/autonomous-replay.ts`
- `src/engines/objective-engine.ts`
- `tests/unit/engines/autonomous-budgets.test.ts`
- `tests/unit/engines/autonomous-pause.test.ts`
- `tests/unit/engines/autonomous-replay.test.ts`

## Useful behavior

Legacy supports durable goal state, step state, approval/question gates, cancellation, budgets, pause/resume, local-first planning, templates, replay and task history.

### Lifecycle

The task model distinguishes planning/executing/waiting/paused/complete/failed/cancelled.

**Invariant:** lifecycle is semantic state, not a UI spinner.

### Steps

Steps retain identity, order, action, inputs, classification, status, result/error and timestamps.

**Invariant:** execution can be reconstructed after the fact.

### Human gates

A step can create a durable `HitlGate`, move Work to waiting, then resume after approval/answer/expiry.

**Invariant:** human control is part of Work state.

### Budgets

Cost/token/iteration budgets can pause work with a machine-readable reason.

**Invariant:** resource limits can stop execution without losing the work item.

### Pause/resume

Pause persists cursor, plan state and provenance root. Resume checks continuity; mismatch triggers re-planning.

**Invariant:** resume is conditional, not blind.

### Planner egress

Local is the default; an explicitly selected non-local planner requires consent.

**Invariant:** remote reasoning is an explicit egress, not a hidden dependency.

## Destination action

REBUILD under Ω as Work + WorkStep + Attempt + Gate + Authority + Evidence. An agent is an actor operating on Work, not the owner of the outcome.

## Important weakness

The resume test compares cursor/provenance-root continuity, not a complete dependency/world fingerprint. This proves the concept of guarded resume but not general world safety.

## Reject

Dedicated autonomous engine authority, process-local active-task maps, Legacy action classifications and browser-specific recovery embedded in generic Work.
