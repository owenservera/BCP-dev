# Canonical World Integration — Agentic Objects

## Starting point

The existing destination Object envelope is:

`ObjectRef → objectId, kind, ownerScope, sourceIdentities, relationshipRefs, lifecycle, revisionRef, provenanceRefs, evidenceRefs, projectionRefs, workRefs, timestamps`

This task must determine how agentic concepts enter that model.

## Candidate mapping

### AgentDefinition

Potential semantic meaning:

> A durable reusable actor configuration: identity, purpose, permitted capabilities, constraints, context rules and execution policy.

Questions:
- Is this a world object or merely a composition/plugin declaration?
- Does an AgentDefinition have user-owned identity?
- Can it be versioned?
- Can it own Work?
- Is “agent” needed at all for deterministic execution?

### WorkflowDefinition

Potential semantic meaning:

> A reusable deterministic composition of capabilities/steps/dependencies.

Questions:
- canonical object or Recipe-like executable composition?
- how does it differ from an Ω Recipe?
- can it be user-owned without changing authority law?
- can it produce Work?

### Automation

Potential semantic meaning:

> A durable binding that causes Work to start because of a trigger.

Possible shape:

`Automation = trigger + target + policy + activation state`

Do not assume Automation is a separate semantic object until tested.

### Trigger / Schedule

Potential semantic meaning:

> A condition that makes Work eligible to start.

Candidates:
- manual;
- time;
- interval;
- cron-like;
- event;
- object/world change;
- dependency completion;
- external signal.

A Trigger should not itself be confused with Work.

### Work

Existing destination candidate:

> durable outcome identity for an intended piece of execution.

Agentic Work may contain:
- request/goal;
- plan reference;
- state;
- attempts;
- checkpoint;
- result;
- evidence;
- produced/changed object refs;
- attention status.

### Plan

Potential semantic meaning:

> versioned executable intent/graph associated with Work.

Plan must never confer authority by itself.

### Step

Investigate whether Step should be:
- durable child execution record;
- immutable plan node plus mutable StepAttempt records;
- event-derived state;
- embedded Work substructure.

Avoid premature object explosion.

### Attempt

Useful candidate:

> one concrete execution attempt of a plan step.

Must support retries without rewriting prior evidence.

### Artifact / Document / File

Work outputs should point to canonical world objects rather than duplicate content in Work state.

### Attention / Standing Intent

Candidate bridge:

`ongoing Work → user attention state → return experience`

This should unify:
- notifications;
- watches;
- scheduled reports;
- pending approvals;
- stalled Work;
- completed Work summaries.

## New-object falsifier

Create a deterministic automation that produces a new Artifact.

Verify:

`Trigger → Automation → Work → Plan → Steps → Artifact → Evidence → World → Surface → Restart`

If this requires another storage system or another lifecycle framework, record the architectural failure.
