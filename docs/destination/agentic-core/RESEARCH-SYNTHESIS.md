# Research Synthesis

## Executive answer

**The smallest deterministic VIVIM agentic substrate is a durable Work runtime with a versioned Plan, governed Capability execution, persistent Step/Attempt checkpoints, stable effect identities, a temporal trigger/wait substrate, verification and evidence, resource leases, explicit human gates, and projection into World/Work/Attention.**

An Agent is not required for those primitives. AgentDefinition is a reusable role/policy that may select capabilities, propose plans, delegate Work or interpret results.

## Core separation

`GOAL ≠ PLAN ≠ AUTHORITY ≠ EXECUTION ≠ EVIDENCE`.

A goal describes desired outcome. A plan proposes a route. Authority comes from Law/consent/capability grants. Execution records attempts. Evidence supports claims about what happened.

## Runtime graph

```
World / User Intent
        ↓
Trigger / Automation
        ↓
      Work
        ↓
 Plan(versioned)
        ↓
 Authority check
        ↓
 Step → Attempt → Capability realization
        ↓
 Checkpoint / Effect identity
        ↓
 Verify
        ↓
 Evidence
        ↓
 Canonical World update
        ↓
 Work projection + Attention / Continuity
```

AI may enter before Plan, during bounded interpretation, or after execution for diagnosis/summarization. It never bypasses Authority or writes canonical truth directly.

## Evidence-supported observations

1. Durable workflow systems converge on persisted orchestration state, retries, timers, external events and recovery. Temporal/Durable Task and Azure Durable Functions explicitly document checkpointing, long-running orchestration, timers, events and retries.
2. Modern agent SDKs expose tools, handoffs, resumable state, guardrails, approvals and traces, but these do not establish that an LLM should own durable execution.
3. Legacy VIVIM contains ActionPlan/compiler/bridge, validation, autonomous execution/replay, workflow DAG/compiler/runtime, retry storage, HITL persistence, budget and automation material.
4. Ω already provides stronger Law/Capability/Vault/Evidence/Intent primitives than the Legacy runtime.

## Semantic model

| Concept | Destination meaning | Durable? |
|---|---|---:|
| AgentDefinition | reusable role/policy | yes |
| Workflow/Recipe | reusable executable structure | yes |
| Trigger | condition requesting/waking Work | yes |
| Automation | standing Trigger→Work declaration | yes |
| Work | canonical durable execution subject | yes |
| Plan | versioned executable proposal | yes |
| Step | durable planned unit/checkpoint | yes |
| Attempt | one execution attempt | yes |
| Capability | governed semantic operation | registry |
| Tool | realization interface | usually no canonical identity |
| Artifact | canonical output object/reference | yes |
| Evidence | authoritative execution/observation record | yes |
| Run | UI/runtime synonym, not canonical root | no |
| Task | normalize to Work or Step | no |

## Promotion candidates

- Work is the sole canonical durable execution subject.
- Workers are disposable; durable state is recovery authority.
- Every side-effecting Step requires stable effect identity.
- Waits are durable state, not sleeping processes.
- Consequential Steps have explicit verification posture.
- Human gates suspend/resume the same Work.
- AI is an optional bounded capability.

## Rejected simplifications

- Agent as universal canonical entity.
- In-memory state as recovery source.
- Scheduler as authority.
- Executor success as proof.
- Blind retries of arbitrary side effects.
- UI/canvas as Work truth.
- Separate agent database beside World/Work/Vault.

## Remaining experiment frontier

Crash recovery, timer duplication, lease fencing, external-effect reconciliation, resource fairness, replay safety, corruption handling, and exact canonical namespace placement remain EXPERIMENT-REQUIRED or UNRESOLVED.
