# VIVIM Legacy Harvest — Synthesis

> Classification: DERIVED — RESEARCH
> Assay branch: `research/E-legacy-harvest`
> Legacy mine: `vivim-original-baseline/vivim-final-enhanced/` (read-only)
> Main evidence baseline: `d57d5bce13925828b98fc86800b4f97dd6dafa6e`
> No production code changed by this harvest.

## Executive finding

Legacy's useful automation behavior forms a deterministic spine:

```text
Intent → typed Plan → preflight validation → Authority/approval
      → durable Work → attempts/steps → retry/wait
      → Result + Evidence → history/replay/recovery
      → background continuity
```

The destination should preserve the behavior but collapse the implementation into one governed Work model:

```text
Intent → Capability → Authority → Work → Attempt → Effect
       → Result → Evidence → World change → Continuity/Attention
```

## Compact harvest map

| Legacy mechanism | Semantic invariant | Destination concept | Decision |
|---|---|---|---|
| ActionPlan | One inspectable execution representation | Intent → Capability → Work preparation | PRESERVE SEMANTICALLY |
| plan-validation gate | No effects before structural/policy checks | Authority + preflight | REBUILD UNDER Ω |
| GroundedReference | User references become explicit typed refs with provenance | Address / Context / Evidence | REBUILD UNDER Ω |
| topological order | Dependencies define legal order | Composition / Work graph | PRESERVE SEMANTICALLY |
| AutonomousTask | Durable goal and lifecycle | Work | REBUILD UNDER Ω |
| AutonomousStep | Durable unit of execution state | WorkStep / Attempt | REBUILD UNDER Ω |
| HITL gate | Work pauses at an authority/question boundary | Work WAITING + Authority | PRESERVE SEMANTICALLY |
| budgets | Work is resource-bounded and can pause | Policy | REBUILD UNDER Ω |
| replay branch | Variant execution has new identity and lineage | Work lineage / Evidence | PRESERVE SEMANTICALLY |
| Workflow DAG | Deterministic composition | Composition | REBUILD UNDER Ω |
| retry queue | Retry is temporal state with attempts and limits | Work recovery + Time | REBUILD UNDER Ω |
| scheduler | Time/event conditions create work | Standing Intent + Time | REBUILD UNDER Ω |
| objective agenda | Intent persists across runs and can sleep/wake | Standing Intent / long-lived Work | REBUILD UNDER Ω |
| memoizer | Cache accelerates; it is not truth | Runtime acceleration | IMPLEMENTATION REFERENCE |
| policy engine | Classification/approval/cooldown are explicit behaviors | Authority / law | REBUILD UNDER Ω |
| conversation history | Ordered durable interaction identity + incremental sync | World / Context | REBUILD UNDER Ω |
| projects/workspaces | Persistent human organization | Space / Context | PRESERVE SEMANTICALLY |
| canvas/presets | Layout is reusable surface behavior | Surface projection | IMPLEMENTATION REFERENCE |
| export/import | User can move data with scope and manifest | Exit / Portability | REBUILD UNDER Ω |
| crash recovery | Interrupted transitions are detectable and recoverable | Recovery | PRESERVE SEMANTICALLY |

## Strongest evidence

- ActionPlan: `src/engines/action-plan.ts`, `action-plan-compiler.ts`, `plan-validation-gate.ts`.
- Autonomous execution: `src/engines/autonomous-types.ts`, `autonomous-planner.ts`, `autonomous-execution.ts`.
- HITL/budget/pause: `tests/unit/engines/autonomous-pause.test.ts`, `autonomous-budgets.test.ts`.
- Replay: `src/engines/autonomous-replay.ts`, `tests/unit/engines/autonomous-replay.test.ts`.
- Workflow: `src/engines/workflow-engine.ts`, `workflow-compiler.ts`.
- Retry/schedule: `src/engines/retry-engine.ts`, `src/automation/scheduler.ts`, workflow retry queue.
- Temporal objective: `src/engines/objective-engine.ts`.
- Conversation/sync: `src/engines/conversation-manager.ts`, `conversation-history-sync.ts`.
- Organization/surfaces: `conversation-organizer.ts`, `adaptive-workspace.ts`, `workspace-presets.ts`.
- Portability/recovery: `export.ts`, `backup-manager.ts`, `storage-relocation-engine.ts`.

## Core synthesis

Do not build separate destination authorities for:

`workflow run`, `automation run`, `agent task`, `background job`, `retry`, `replay`.

They are different ways Work is created or advanced.

> Any execution that can outlive the initiating call, pause, retry, wait for authority, produce evidence, or resume later is Work.

## Evidence boundary

Legacy unit tests strongly establish local semantic behavior. They do not establish live provider/browser proof. Some runtime paths are process-local, some test logic is richer than its production implementation, and some resume checks are shallow.

## Downstream sequence

Work envelope → WorkStep/Attempt → Authority gate → deterministic composition lowering → temporal scheduling → retry/recovery → replay lineage → background/attention → provider/browser realization → one end-to-end falsifier.
