# Workflow Harvest

## Evidence

- `src/engines/workflow-engine.ts`
- `src/engines/workflow-compiler.ts`
- `src/storage/impl/workflow-retry-queue-store-impl.ts`
- `tests/unit/automation/workflow-retry.test.ts`

## Useful behavior

Workflows provide deterministic graphs: nodes/edges, cycle validation, conditions, sub-workflows, execution state, human loops, retries and capability registration.

## Semantic invariant

> Composition is data first: a valid graph can be inspected, compiled and executed deterministically without requiring an AI planner.

## Destination mapping

WorkflowDefinition → Composition; WorkflowExecution → Work; node execution → WorkStep/Attempt; human loop → WAITING + Authority; workflow version → immutable composition revision; retry queue → temporal Work recovery.

## Preserve

- explicit dependencies;
- cycle rejection;
- deterministic conditions;
- recursive sub-composition;
- compiled executable form;
- node-level state/results;
- versioning;
- human interruption.

## Rebuild

One generic Ω composition substrate should be able to lower manual plans, workflows, standing intents, templates and agent plans into Work.

## Reject

Workflow categories as ontology, hard-coded timeout/retry defaults, direct Governor/CDP access from generic composition, and implementation-specific expression evaluators as law.

## Red-team

Legacy has in-memory execution maps. Persisted workflow rows must not be mistaken for restart-safe execution by themselves.

## Acceptance seed

Validate and run a deterministic multi-node composition, pause at a human gate, restart, resume/recover, and produce durable result/evidence.
