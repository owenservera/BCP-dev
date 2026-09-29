# Iterative Team Bootstrap Protocol

## Principle

The team is designed as a short-lived solution to the current objective.

The bootstrap process is intentionally iterative, but bounded. It produces a concrete `swarm.json`; after that point the normal reference swarm core executes it.

## Phase 0 — Objective normalization

Extract:

- objective;
- explicit constraints;
- completion criteria;
- resource ceilings;
- available context;
- requested interaction mode.

No team is assumed.

## Phase 1 — Work decomposition

Construct a candidate set of work units.

Each work unit must have:

```
id
purpose
expected_output
dependencies
evidence_or_validation_need
```

Work units are not yet agents.

## Phase 2 — Responsibility projection

Determine which work units should become distinct participants.

A separate participant is justified when at least one of these is materially true:

- isolation of context improves quality;
- execution can run independently;
- a different tool set is required;
- a different model is advantageous;
- a meaningful review/challenge boundary exists;
- the work must continue while another participant works.

Avoid splitting merely to increase agent count.

## Phase 3 — Communication design

For each participant, identify the minimum information another participant must receive.

The bootstrap engine encodes this only through the existing reference mechanisms:

- shared memory;
- `swarm_send`;
- `swarm_inbox`;
- `swarm_agents`.

It must not introduce another communication mechanism.

## Phase 4 — Tool/model assignment

Assign the smallest useful tool surface per participant.

If a restrictive tool map is used, the existing core guarantees the swarm coordination tools remain available.

Select models using the existing `provider/model` configuration convention.

## Phase 5 — Self-review

Before finalizing the team, perform a challenge pass:

- merge redundant participants;
- identify missing responsibility;
- remove unnecessary communication;
- reduce unnecessary tools;
- confirm dependencies are not circular;
- check resource constraints;
- ensure each participant has a meaningful terminal output.

## Phase 6 — Projection

Emit the exact reference `SwarmConfig`.

The projection step is mechanical and must not alter the selected responsibilities.

## Phase 7 — Bounded iteration

If `interactionMode = interactive`, allow the caller to request a refinement cycle.

If autonomous, permit only a bounded number of bootstrap iterations from explicit configuration or a safe implementation default.

Every iteration records:

```
iteration
candidate_team
changes
reason
accepted_or_rejected
```

The iteration log is bootstrap evidence; it does not become swarm memory unless deliberately written by the executing swarm.

## Bootstrap termination

Bootstrap stops when:

- every completion criterion has coverage;
- every participant has a bounded mission;
- unresolved dependencies are absent;
- no obvious redundant participant remains;
- the resulting config passes reference validation;
- the iteration limit is reached.

The last case is a valid termination state with an explicit note; it must not trigger unbounded self-redesign.
