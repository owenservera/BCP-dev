# Generic Bootstrap Contract

## Purpose

Create a concrete agent roster and per-agent instructions from a task without requiring the user to predefine a methodology-specific roster.

## Inputs

```ts
type BootstrapInput = {
  objective: string
  constraints?: string[]
  availableContext?: string[]
  completionCriteria?: string[]
  resourceHints?: {
    maxAgents?: number
    model?: string
    maxConcurrent?: number
    budgetUsd?: number
  }
  interactionMode?: "interactive" | "autonomous"
}
```

The bootstrap engine may inspect the repository and current context as part of deciding the team. It must not assume the task is software development.

## Output

The bootstrap engine returns a concrete configuration compatible with the reference swarm:

```ts
type BootstrapResult = {
  reasoningSummary: string
  teamRationale: string
  config: SwarmConfig
  iterations: BootstrapIteration[]
}
```

The `config` MUST use only the already-supported reference fields:

- `name`
- `model`
- `agents[].name`
- `agents[].task`
- `agents[].system?`
- `agents[].model?`
- `agents[].tools?`
- `maxRounds?`
- `budgetUsd?`
- `maxConcurrent?`
- `tools?`
- `notify?`

No new swarm-core configuration field is introduced.

## Generic team model

A participant is defined by:

- a unique name;
- a mission/task;
- optional system framing;
- optional model preference;
- optional tool restrictions.

No required role names exist.

Examples of valid participant intents include, but are not limited to:

- inspect a domain;
- challenge an assumption;
- synthesize evidence;
- implement;
- validate;
- test;
- compare alternatives;
- perform a narrowly scoped transformation.

The bootstrap engine chooses the set from the objective rather than selecting from a fixed enum.

## Bootstrap quality questions

Every bootstrap iteration should ask:

1. What work must exist for the objective to be satisfied?
2. Which pieces are independent enough to execute in parallel?
3. Which responsibilities genuinely require distinct contexts?
4. What information must flow between participants?
5. Which tools are actually required by each participant?
6. Is the team larger than necessary?
7. Is any responsibility missing?
8. Does the proposed team have a clear completion condition?

These are design checks, not permanent role definitions.
