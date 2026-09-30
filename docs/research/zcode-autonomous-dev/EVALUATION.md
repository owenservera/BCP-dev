# Current Set Evaluation

## Chosen source set

**Core:** ZCode + OpenAI Symphony

**Pattern references:** Beads, Gas Town, Superpowers, Prime Agent, AWS CLI Agent Orchestrator, RouteLLM/vLLM Semantic Router, OpenHands, MetaGPT, ChatDev, HyperAgent, and ZCode-specific extensions.

### Why this set

ZCode already provides the native substrate: plugins, subagents, background agents, MCP, skills, model state, memory-related machinery, dynamic workflows, and an extensible CLI/runtime.

Symphony contributes the missing control-plane discipline: durable work-item orchestration, explicit state transitions, isolated execution, recovery, and long-running scheduling.

Beads and Gas Town are highly relevant for dependency-aware task graphs, persistent workers, merge/refinery flow, and maintenance loops, but are broader systems than needed for the first implementation.

Model routers are useful as pattern references. The router should remain ZCode-native and empirically learn from the provider fleet rather than becoming a second infrastructure product.

## Proposed control loop

```
PROMPT
  -> DISCOVER
  -> DECIDE
  -> COMPILE TEAM
  -> ROUTE MODEL
  -> EXECUTE
  -> VERIFY
  -> INTEGRATE
       |
       +-- not complete --> REPAIR / REPLAN --> EXECUTE
       |
       +-- proven complete --> DONE
```

## Required invariants

1. A finished agent turn is never sufficient evidence of completion.
2. Work state survives process/session loss.
3. Parallel work has explicit ownership and isolation.
4. Model selection is based on task capability, availability, empirical health, and policy.
5. Integration is serialized and verified.
6. “Never stop” is guarded by no-progress and repeated-failure circuit breakers.
7. Human escalation is for real authority or irreducible blockers, not ordinary work.

## First implementation

Build a ZCode-native `autodev` plugin/command around a durable local control directory such as:

```
.zcode/autodev/
  objective.json
  graph.jsonl
  decisions.md
  workers.json
  models.json
  run-state.json
  evidence/
  leases/
```

Then validate it against materially different objectives before expanding dependencies.
