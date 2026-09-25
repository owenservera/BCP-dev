# Destination Mapping

## Canonical mapping

| Legacy | Destination | Read |
|---|---|---|
| Intent/goal | Intent | Strong |
| ActionPlan | Plan / Composition | Strong concept; integration partial |
| Capability | Capability | Strong |
| Policy decision | Authority | Strong concept |
| AutonomousTask | Work | Partial; central missing integration |
| AutonomousStep | WorkStep | Needs canonical contract |
| Actual execution | Attempt | Open frontier |
| HitlGate | WAITING + Authority | Strong |
| BudgetUsage | Execution policy | Strong concept |
| WorkflowDefinition | Composition | Strong |
| WorkflowExecution | Work | Partial |
| AutomationSchedule | Standing Intent + Time | Partial |
| Objective | Standing Intent / long-lived pursuit | Partial |
| RetryQueue | Work recovery | Partial |
| TaskHistory | Continuity/Evidence projection | Partial |
| Conversation | World Thing / Context source | Strong |
| Project/Workspace | Space / Context | Strong |
| Canvas placement | Surface projection | Strong |
| Export/recovery | Vault portability/recovery | Strong concept |

## Destination sources already present

- `docs/destination/CONCEPTUAL-MODEL.md`
- `docs/destination/AGENCY-BACKGROUND-ATTENTION-RECONCILIATION.md`
- `docs/destination/RECONCILIATION-MAP.md`
- `docs/destination/BUILD-AND-HARVEST-PLAN.md`
- System Intelligence Pass 3 at `0121570c005112eb8875e9b8a6f484cc732d4e62`

## Core mapping rule

Do not map Legacy engine names one-to-one. Map user behavior and semantic invariant to the strongest existing destination concept, then remove the implementation coupling.

## Keystone

`Standing Intent / Intent → Work → Authority + Composition → Attempt(s) → Result/Evidence → World/Attention`
