# Implementation Shape

## Boundary

The implementation is a wrapper/extension layer around the unchanged swarm core.

Recommended conceptual layout:

```
generic-bootstrap/
  bootstrap/
    input.ts
    designer.ts
    evaluator.ts
    projector.ts
    types.ts
    iterations.ts
  adapters/
    reference-swarm-config.ts
  cli/
    bootstrap-command.ts
  tests/
    bootstrap/
```

The existing reference swarm core may live beside this layer or be installed as a dependency.

## Components

### BootstrapDesigner

Takes `BootstrapInput` and proposes a candidate team.

It is responsible only for team design.

### BootstrapEvaluator

Checks the candidate against the objective, constraints, completion coverage, redundancy, and bootstrap limits.

It does not execute swarm work.

### BootstrapProjector

Converts the accepted candidate to the exact reference `SwarmConfig`.

This component should be deterministic for a supplied candidate.

### BootstrapSession

Maintains the bounded iteration history while the team is being designed.

It does not share the reference swarm DB unless there is a deliberate reason to persist the bootstrap transcript there.

## Optional runtime adapters

The initial implementation can use the same OpenCode session mechanism as the reference system for the bootstrap designer.

However, the bootstrap engine itself should be represented as an abstract design step so another host can eventually provide the designer.

## No new execution engine

After projection:

```
BootstrapProjector
       |
       v
SwarmConfig
       |
       v
reference runSwarm(...)
```

There must be no second orchestrator hidden below this boundary.

## Plugin rule

A bootstrap-specific plugin may expose team-design tools if useful, but those tools must finish by producing configuration for the existing swarm core.

Do not add a second set of agent-to-agent communication tools.

## Persistence rule

Bootstrap persistence is optional.

If persistence is implemented, it must be separate from the reference swarm state unless the implementation proves that adding records to the existing DB is backward-compatible and does not alter its core schema semantics.

For the first implementation, a durable Markdown/JSON bootstrap artifact is sufficient.
