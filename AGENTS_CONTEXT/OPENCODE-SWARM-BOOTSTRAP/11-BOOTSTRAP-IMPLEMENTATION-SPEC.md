# Bootstrap Implementation Specification

## 1. Scope

This specification defines only the new generic bootstrap layer.

It does not modify the reference swarm core.

The implementation target is:

```
BootstrapInput
    -> BootstrapSession
    -> candidate team
    -> critique/refinement iterations
    -> accepted candidate
    -> exact reference SwarmConfig
    -> existing reference swarm execution
```

## 2. Canonical bootstrap artifact

A bootstrap session should be serializable as one JSON document.

Recommended location:

```
.swarm/bootstrap/<bootstrap-id>.json
```

This is a bootstrap artifact, not a replacement for `.swarm/swarm.db`.

Minimum persisted shape:

```ts
type BootstrapArtifact = {
  schemaVersion: "1"
  bootstrapId: string
  createdAt: string
  input: BootstrapInput
  iterations: BootstrapIteration[]
  accepted?: BootstrapCandidate
  projectedConfig?: SwarmConfig
  validation?: {
    accepted: boolean
    errors: string[]
  }
  status: "draft" | "iterating" | "accepted" | "rejected"
}
```

## 3. Candidate team schema

A candidate is deliberately richer than the final reference configuration so the designer can explain why a participant exists before projection.

```ts
type BootstrapCandidate = {
  swarmName: string
  defaultModel: string
  participants: CandidateParticipant[]
  maxRounds?: number
  maxConcurrent?: number
  budgetUsd?: number
  tools?: Record<string, boolean>
}

type CandidateParticipant = {
  id: string
  name: string
  mission: string
  expectedOutput: string
  rationale: string
  dependencies: string[]
  communicationNeeds: string[]
  requiredTools?: string[]
  modelPreference?: string
  system?: string
}
```

Only the fields supported by reference `SwarmConfig` survive projection.

## 4. Iteration schema

```ts
type BootstrapIteration = {
  index: number
  candidate: BootstrapCandidate
  critique: {
    missingResponsibilities: string[]
    redundantResponsibilities: string[]
    weakDependencies: string[]
    unnecessaryCommunication: string[]
    resourceConcerns: string[]
    completionGaps: string[]
  }
  changes: string[]
  decision: "refine" | "accept" | "stop"
  decisionReason: string
}
```

## 5. Bootstrap state machine

```
draft
  |
  v
designing
  |
  +--> refining --+
  |               |
  +---------------+
  |
  v
projecting
  |
  +--> invalid -> refining
  |
  v
accepted
```

Terminal non-success states:

- `rejected` — the objective cannot be represented within supplied constraints.
- `aborted` — caller explicitly stops bootstrap.

No state outside the bootstrap layer is added to the reference swarm.

## 6. Exact bootstrap loop

### 6.1 Normalize

Create a normalized input:

- objective;
- explicit constraints;
- completion criteria;
- available context references;
- resource hints;
- interaction mode.

Do not invent missing completion criteria as facts. The designer may propose candidate criteria, but they must be marked as proposed.

### 6.2 Decompose

Produce work units.

A work unit is not an agent.

```ts
type WorkUnit = {
  id: string
  purpose: string
  expectedOutput: string
  dependencies: string[]
  validationNeed: string
}
```

### 6.3 Project

Transform work units into candidate participants only where separation has a concrete reason.

### 6.4 Critique

Evaluate the candidate against:

- objective coverage;
- completion coverage;
- overlap;
- missing work;
- dependency coherence;
- communication minimization;
- tool minimization;
- resource constraints;
- boundedness of every mission.

### 6.5 Refine

Apply the critique to the candidate.

A refinement must be explainable as one or more concrete changes:

- add participant;
- remove participant;
- merge participants;
- split participant;
- change mission;
- change dependency;
- change communication need;
- change model;
- change tools;
- change resource limit.

### 6.6 Project to reference configuration

Produce only the exact fields accepted by the unchanged reference validator.

### 6.7 Validate

Run the actual reference `validateConfig()`.

A failed validation is a bootstrap projection defect and returns to refinement. Do not patch the core validator for bootstrap convenience.

## 7. Iteration bounds

The bootstrap MUST have an explicit maximum iteration count.

The exact default may be chosen by implementation, but it MUST be:

- finite;
- visible;
- configurable;
- recorded in the bootstrap artifact.

When the bound is reached, the system accepts the last candidate only if it passes validation; otherwise it ends as `rejected`.

There must be no open-ended model-driven self-redesign loop.

## 8. Interactive mode

In interactive mode, the caller can inspect the current candidate and request:

- accept;
- refine;
- reject;
- edit objective/constraints and restart from normalization.

The caller is editing the bootstrap session, not the executing swarm.

## 9. Autonomous mode

In autonomous mode, the bootstrap engine may perform multiple design/critique/refinement iterations without human intervention, subject to:

- maximum iterations;
- model/tool/resource policy;
- completion of validation.

## 10. Designer runtime

The bootstrap designer may be hosted by OpenCode.

When it is hosted by OpenCode:

- use normal OpenCode session creation/prompt mechanisms;
- do not require the reference `swarm_*` tools;
- do not insert the bootstrap designer into the final swarm unless the accepted team explicitly calls for that participant;
- keep bootstrap state outside the reference swarm database.

The bootstrap designer's job ends at projection.

## 11. Prompt/result contract

The model-facing bootstrap operation MUST request structured output equivalent to `BootstrapCandidate` or `BootstrapIteration`.

The implementation must treat model output as untrusted data:

```
model output
   -> parse
   -> structural validation
   -> bootstrap constraint validation
   -> reference config validation
   -> accept/reject
```

Free-form prose alone cannot be accepted as the final team definition.

## 12. Reference config projection

Projection must be pure:

```ts
function project(candidate: BootstrapCandidate): SwarmConfig
```

Given the same candidate, projection returns semantically identical reference configuration.

The projection MUST NOT:

- execute agents;
- send messages;
- write swarm memory;
- create sessions;
- mutate the swarm DB;
- choose hidden participants.

## 13. Resource inheritance

The bootstrap input's resource hints map only to existing reference fields:

| Bootstrap hint | Reference field |
|---|---|
| default model | `model` |
| max agents | participant count constraint before projection |
| max concurrent | `maxConcurrent` |
| budget USD | `budgetUsd` |
| participant model preference | `agents[].model` |

No new runtime resource mechanism is created.

## 14. Tool inheritance

Participant required tools are projected into the existing `tools` record.

The existing reference orchestrator remains responsible for ensuring coordination tools are available.

Bootstrap MUST NOT hard-code those tools into candidate participant data as if they were ordinary task tools.

## 15. Completion semantics

Bootstrap acceptance is different from swarm completion.

Bootstrap accepted means:

> "A concrete team definition has been produced that satisfies the bootstrap checks and can be executed by the reference swarm."

Swarm completed means whatever the reference swarm's existing execution/result semantics report.

Do not conflate these states.

## 16. CLI integration

A plug-and-play implementation SHOULD expose an additive command such as:

```
swarm bootstrap "<objective>"
```

Expected behavior:

1. create bootstrap session;
2. perform bounded design iterations;
3. write bootstrap artifact;
4. write a normal reference-compatible `swarm.json`;
5. display the artifact/config paths;
6. optionally invoke the unchanged `swarm run`.

The existing `swarm run` command remains unchanged.

## 17. Long-lived OpenCode server integration

For an externally managed server:

```
opencode serve
      |
      +--> TUI
      |
      +--> bootstrap designer
      |
      +--> reference swarm run --server <url>
```

The server MUST already have the reference swarm plugin available to the spawned swarm sessions and the correct swarm DB environment available to that server process.

The bootstrap implementation must document this prerequisite rather than altering the reference runner.

## 18. Security / trust boundary

The bootstrap candidate is advisory configuration data.

It does not grant:

- permission;
- authority;
- truth;
- access to new tools beyond configured policy;
- authority over Ω or Agent Commons.

Project/tool permissions remain governed by the underlying OpenCode/runtime configuration.

## 19. Reproducibility

A completed bootstrap artifact must make it possible to reconstruct:

- original input;
- every candidate iteration;
- critiques;
- accepted candidate;
- projected `swarm.json`;
- validation outcome.

A future implementation must not require hidden model state to understand why the final team exists.

## 20. Plug-and-play acceptance

A fresh implementation is plug-and-play when a user can:

```
install reference swarm core
install/bootstrap generic layer
start opencode serve if desired
provide objective
receive normal swarm.json
run the unchanged swarm
inspect normal swarm status/logs/reports
```

without modifying reference swarm core source.

## 21. Final implementation boundary

The implementation must stop exactly here:

```
                 GENERIC BOOTSTRAP
                         |
                         v
                  valid SwarmConfig
                         |
                         v
                REFERENCE SWARM CORE
```

Anything below that line belongs to the reference implementation and is out of scope for this bootstrap project.
