# ZCode Autonomous Development — Best Set Assessment

Updated: 2026-09-30

## The set

### 1. ZCode — KEEP / PRIMARY SUBSTRATE

Use ZCode itself as the runtime and user experience.

Relevant native capabilities observed in the current source include plugins, subagents, background agent execution, dynamic workflows, MCP, skills, model/agent state, agent telemetry, and plugin-reference/catalog machinery.

Do not wrap ZCode inside another competing agent framework.

### 2. OpenAI Symphony — LEVERAGE / PRIMARY CONTROL-PLANE REFERENCE

This is the external repository chosen for the concrete implementation reference.

Borrow its ideas for durable orchestration:

- work-item driven execution;
- explicit lifecycle/state machine;
- scheduler versus worker separation;
- isolated workspaces;
- retry/recovery;
- long-running execution;
- status and operational observability.

Do not import Symphony wholesale.

### 3. ops120/ops120-zcode-plugins — LEVERAGE / MODEL-ROUTING REFERENCE

This is the most directly relevant ZCode-specific implementation I found for automatic per-subagent model/provider selection.

Its important pattern is empirical routing: inspect configured providers, actually probe models, create model-bound subagent definitions, and use those definitions so routing is real rather than merely stated in a prompt.

Borrow the mechanism and improve it into a policy-driven runtime router.

### 4. ZepiGit/ZCode-Agent-Kit — LEVERAGE / PROVIDER INTEROP REFERENCE

Useful for understanding how ZCode's account, quota, provider and local-proxy surface can be exposed to other coding harnesses.

Do not make it the core orchestration layer. It solves provider interoperability rather than autonomous engineering control.

### 5. Superpowers — LEVERAGE / ENGINEERING-PROCESS REFERENCE

Borrow the workflow discipline:

design before implementation, isolated worktrees, bite-sized plans, TDD, review, and explicit completion.

Translate those ideas into ZCode-native skills/agents rather than adding a second workflow runtime.

### 6. ZMem — EVALUATE FOR DURABLE MEMORY

Potentially valuable when the built-in ZCode memory behavior is insufficient for long-running autonomous work.

Do not adopt until the first local durable-state prototype demonstrates an actual gap.

### 7. ZCode Control — EVALUATE FOR BACKGROUND OPERATIONS

Useful patterns include session control, background operator behavior, parallel delegation and status/resume mechanics.

Again, borrow only the missing capability rather than making it the orchestrator.

### 8. ZCode DCP — OPTIONAL / CONTEXT EFFICIENCY

Dynamic context pruning is useful for long runs, but should be introduced only after instrumentation shows context pressure is a limiting factor.

### 9. Beads — OPTIONAL / DURABLE TASK GRAPH

Beads is particularly interesting for dependency-aware work graphs, atomic claiming, memory and multi-agent synchronization.

However, its external Dolt-backed system is a meaningful dependency. The first ZCode autonomous-dev implementation should prove whether a small local graph under `.zcode/autodev/` is sufficient before adopting Beads.

### 10. Gas Town / Prime Agent / AWS CLI Agent Orchestrator — RESEARCH PATTERNS

These contain useful ideas around persistent workers, heartbeats, supervision, autonomous continuation, isolated sessions and multi-agent control.

They are better treated as research material than first-wave runtime dependencies because combining their full architectures would create unnecessary orchestration complexity.

## Final composition

The practical first-generation stack is:

```
                    ZCODE
                      |
           AUTODEV CONTROL PLANE
             (Symphony patterns)
                      |
       +--------------+---------------+
       |              |               |
  TASK GRAPH      TEAM COMPILER    MODEL ROUTER
  local first    dynamic roles     empirical
       |              |               |
       +--------------+---------------+
                      |
              ISOLATED WORKSPACES
                      |
              EXECUTE / TEST / BUILD
                      |
                  DONE GATE
                      |
          +-----------+-----------+
          |                       |
       COMPLETE               NOT DONE
                                  |
                           REPAIR / REPLAN
                                  |
                                LOOP
```

## The key design decision

Do not build a permanent fixed "team of ten agents".

Build a **team compiler**.

Input:

`objective + repository state + constraints + available capabilities`

Output:

`roles + task graph + permissions + tools + model bindings + verification obligations`

The smallest sufficient team is generated for the objective.

## The key model-selection decision

Do not encode model assignments as agent personality.

Treat model selection as a runtime service:

```
task
 -> capability requirements
 -> eligible providers/models
 -> live availability
 -> empirical health
 -> historical task performance
 -> context/token constraints
 -> policy
 -> selected model
 -> fallback chain
```

This permits the free-model fleet to change without redesigning the team.

## The key autonomy decision

A worker finishing is never the completion event.

The state machine must distinguish:

`worker_finished`

from:

`objective_proven_complete`

The latter requires evidence.

## Recommended first build

Build one ZCode-native `autodev` command/plugin that implements only:

1. objective persistence;
2. discovery;
3. task graph;
4. dynamic team compilation;
5. model routing;
6. isolated execution;
7. verification;
8. repair/replan loop;
9. Done Gate;
10. persistent run state.

Only after this works should memory, Beads, advanced context pruning, richer automation and additional supervisor machinery be introduced.

That gives a clean experimental core while preserving the ability to add the strongest pieces later.
