# Legacy Harvest Map

## Inspected family

The Legacy mine contains:
- ActionPlan / action-plan compiler / bridge;
- Plan Validation Gate;
- AutonomousGoal / Task / Step;
- AutonomousExecution / Planner / Replay;
- WorkflowDefinition / Compiler / Engine;
- workflow retry queue;
- HITL gate storage;
- budget/execution policy;
- idempotency guard / lock manager / retry engine;
- automation/scheduler material;
- objective/outcome tracking;
- agentic loop material.

Concrete source-atlas evidence includes `source-atlas/L2-module-clusters.md`, `source-atlas/L3-file-catalog/engines.md`, and the raw engine inventory.

## Harvest map

| Legacy | Destination treatment |
|---|---|
| ActionPlan IR | versioned Plan |
| ActionPlanCompiler | deterministic compiler |
| Plan Validation Gate | mandatory validation |
| AutonomousGoal | desired outcome input |
| AutonomousTask | split into Work/Step |
| AutonomousStep | durable Step |
| AutonomousExecution | coordinator lifecycle only |
| AutonomousReplay | replay semantics, not live execution |
| Workflow DAG | Plan graph |
| WorkflowCompiler | Plan compilation |
| WorkflowEngine | durable Work runtime |
| Retry Queue | temporal retry |
| HITL | durable human gate |
| Budgets | deterministic constraints |
| Lock manager | resource lease |
| Idempotency guard | effect identity |
| Scheduler | Trigger/Automation mechanism |
| Agentic loop | optional planner behavior |

## Key finding

Legacy already anticipated most of the substrate but mixed ontology, runtime, policy and storage. Harvest behavior and tests; do not migrate the old ontology wholesale.

## Ω boundary

All harvested execution mechanisms must route through existing Ω Law, Capability, Vault, Evidence and Intent boundaries. No second authority or capability registry.
