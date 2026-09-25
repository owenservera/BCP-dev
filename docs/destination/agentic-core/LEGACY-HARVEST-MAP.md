# Legacy VIVIM Harvest Map

## Known evidence from the current repository

Legacy contains a substantial deterministic/agentic implementation surface, including:

`action-plan.ts`

Canonical ActionPlan validation includes capability existence, schema validation, acyclic dependencies, risk matching, confirmation requirements and topological execution ordering.

`autonomous-types.ts`

Provides task/step state, action classification, HITL gate types/status, budgets, browser allowance, token/iteration limits and optional planner-provider selection.

`autonomous-planner.ts`

Separates pure planning helpers from execution and supports an offline planner alongside optional model-based planning.

`autonomous-execution.ts`

Large autonomous execution engine to characterize for useful lifecycle, failure, budget and execution semantics.

`autonomous-replay.ts`

Provides branch replay with a new run identity while preserving the original timeline.

`workflow-engine.ts` + `workflow-compiler.ts`

Workflow graph execution with human-in-the-loop and compilation from visual workflow JSON into an executable DAG.

The Legacy source atlas also identifies:

- automation stores;
- autonomous stores;
- agent-loop stores;
- agentic stores;
- AI execution stores;
- command stores;
- intent-template stores;
- WorkflowExecution / WorkflowNodeExecution;
- WorkflowRetryQueue;
- AutomationSchedule / AutomationRun;
- AgentDefinition;
- AIExecution / AIExecutionEvent;
- AgentBuilderRun;
- RunInbox;
- retry/failure machinery;
- execution policy;
- outcome tracking;
- background synchronization;
- notification/attention-adjacent mechanisms.

## Required classification

Every harvested mechanism must be placed in one of:

- PRESERVE SEMANTICALLY;
- REBUILD UNDER Ω;
- USE AS IMPLEMENTATION REFERENCE;
- EXPERIMENT;
- REJECT AS HISTORICAL COUPLING.

Never import a Legacy class hierarchy merely because it already works.

## Especially investigate

1. ActionPlan as possible deterministic execution IR.
2. Plan Validation Gate as pre-side-effect contract enforcement.
3. AutonomousTask as possible historical Work precursor.
4. AutonomousStep as possible historical step model.
5. HITL Gate as possible waiting-state primitive.
6. BudgetUsage as possible Work constraint model.
7. Replay branching as historical provenance-safe replay.
8. Workflow DAG as reusable composition representation.
9. WorkflowRetryQueue as queue/retry evidence.
10. AutomationSchedule as temporal trigger evidence.
11. Objective/Outcome tracking as goal/result semantics.
12. Background execution as the precursor to “sleeping compositions.”

The investigator must determine whether these should converge into fewer VIVIM primitives rather than reproduce them one-for-one.
