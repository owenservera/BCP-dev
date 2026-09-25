# State

STATUS: HARVEST COMPLETE — RESEARCH ARTIFACTS WRITTEN
Browser: NOT REQUIRED
AI: NOT REQUIRED
Production code: NOT TOUCHED

Branch: `research/E-legacy-harvest`
Harvest parent: `1a100a7e22da04a266382bd04280585ba1312ce3`
Main evidence baseline: `d57d5bce13925828b98fc86800b4f97dd6dafa6e`

## Result

The Legacy mine was characterized for deterministic automation behavior across ActionPlan, autonomous execution, HITL, budgets, workflow DAGs, scheduling, retry, objectives, replay, conversation/history, workspace/canvas, export and recovery.

The durable behavioral spine is:

`Intent → Plan → Authority → Work → Attempt → Result/Evidence → Continuity`

Workflow, automation, retry, replay, objective and agent mechanisms should converge on that spine rather than become separate destination authorities.

## Evidence boundary

Source and unit-test characterization establishes local behavior. It does not establish live provider/browser proof. The richer cron test and runtime scheduler are explicitly recorded as an evidence split.

## Downstream

Use `HARVEST-SYNTHESIS.md` as the compact map; use the domain harvest files for targeted implementation evidence. Legacy remains read-only.
