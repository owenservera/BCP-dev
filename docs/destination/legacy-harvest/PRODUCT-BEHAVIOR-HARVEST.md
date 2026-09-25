# Product Behavior Harvest

## User behavior surface

| User intent | Legacy behavior | Destination |
|---|---|---|
| tell VIVIM what to do | NLCL → plan | Intent |
| inspect planned effects | ActionPlan/risk/verify | Preview |
| run several actions | DAG/autonomous/workflow | Work + Composition |
| stop before an external effect | HITL gate | Authority boundary |
| leave and return | persisted task/automation/history | Continuity |
| cap use | cost/token/iteration | Policy |
| retry transient failure | retry engine/queue | Recovery |
| see what happened | task history/events/results | Evidence |
| compare alternative | replay branch/diff | Lineage |
| schedule a task | cron/interval/event | Standing Intent |
| keep a long-term pursuit | ObjectiveEngine | Standing Intent / Work series |
| organize conversations | Project/Topic tree | Space / Context |
| change UI mode | workspace modes/presets | Surface |
| protect/move data | backup/export/recovery | Sovereignty |

## Product loop

```text
Intent → Work → Authority → Attempt(s) → Result → Evidence
      → World change → Attention → Review
```

This is the more coherent product behavior than exposing separate “autonomous”, “workflow”, “automation” and “replay” silos.

## Preserve

Inspectability, human boundaries, background persistence, truthful history, replayability, recovery, organization and portability.

## Rebuild as one experience

The user should be able to say what outcome they want, see what will happen, leave, return later, and understand what changed and what still needs them.

## Reject

Separate product authority for autonomous/workflow/automation subsystems; old admin UX as the primary control model.
