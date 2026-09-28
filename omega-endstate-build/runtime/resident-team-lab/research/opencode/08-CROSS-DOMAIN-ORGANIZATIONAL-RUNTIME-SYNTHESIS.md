# Cross-Domain Research: Organizational Runtime for Ω

> **Status:** PROPOSED RESEARCH SYNTHESIS
> **Reviewed:** 2026-09-28
> **Question:** Given the new model of functional departments, persistent masters, dynamic workers, and an always-on background layer, what existing systems teach us about the missing Ω runtime?

## 1. Executive conclusion

The research does not point to another swarm pattern. It points toward a hybrid of several mature ideas:

- virtual actors for durable logical identity with replaceable runtime activations;
- controller/reconciliation loops for desired-vs-actual state;
- supervision trees for failure isolation and restart policy;
- blackboards for asynchronous shared-state coordination;
- capability-based task allocation for dynamic worker formation;
- resource-bounded agent contracts for delegation budgets;
- checkpointed/interruptible runtimes for pause/resume;
- context engineering and memory tiers for long-horizon coherence.

None of these is sufficient alone.

The Ω-specific synthesis is a **Resident Organizational Runtime** in which durable organizational identities are reconciled into temporary execution capacity, with model inference treated as an expensive activatable resource rather than the definition of presence.

## 2. Why the conventional 'team of agents' model is too small

Typical multi-agent teams focus on who talks to whom and how a task ends. AutoGen, for example, provides explicit team presets and termination conditions; Magentic-One adds a lead Orchestrator with a task ledger and progress ledger to decompose, assign, detect stalls, and re-plan. These are useful execution patterns, but they still center the run/session as the primary unit of orchestration.

Magentic-One's ledgers are especially instructive: the orchestration state is externalized from the individual specialist trajectories into a task-level representation of plan and progress. That validates the direction of making durable work state distinct from worker session history.

Sources:
- AutoGen teams/termination: https://microsoft.github.io/autogen/dev/user-guide/agentchat-user-guide/tutorial/teams.html
- AutoGen termination: https://microsoft.github.io/autogen/dev/user-guide/agentchat-user-guide/tutorial/termination.html
- Magentic-One: https://arxiv.org/abs/2411.04468

## 3. Virtual identity: learn from Orleans

Orleans uses a logical grain identity with temporary in-memory activations. The runtime can collect idle activations while retaining the logical object, and persistent reminders can reactivate a grain later even when no activation is present.

That is almost exactly the missing semantic for Ω residency:

    resident_id
         |
         +--> activation/session A
         |
         +--> activation/session B
         +--> dormant

The durable thing is the identity/state. The process instance is merely an activation.

This suggests a strong invariant:

> **Residence must survive activation loss.**

Sources:
- Orleans grain lifecycle: https://learn.microsoft.com/en-us/dotnet/orleans/grains/grain-lifecycle
- Orleans activation collection: https://learn.microsoft.com/en-us/dotnet/orleans/host/configuration-guide/activation-collection
- Orleans reminders: https://learn.microsoft.com/en-us/dotnet/orleans/grains/timers-and-reminders

## 4. Control loop: learn from Kubernetes

Kubernetes controllers continuously compare desired state with actual state and reconcile the difference. The controller watches events, reads current state, decides whether a change is required, and produces changes that move the system toward the desired state.

For Ω, this suggests that Presence should not be a static process list.

Instead:

    desired organizational posture
              |
         Presence Controller
              |
        actual runtime state
              |
       reconcile / repair

Examples of desired posture:
- resident should be PRESENT;
- research sentinel should be subscribed to source-change events;
- work item should have one verifier admitted;
- failed worker should have recovery disposition;
- department must remain below attention budget.

The controller should not decide the intellectual content of work. It reconciles declared organizational state with runtime state.

Sources:
- Kubernetes Controllers: https://kubernetes.io/docs/concepts/architecture/controller/
- 2026 controller-runtime reconciliation explanation: https://kubernetes.io/blog/2026/07/29/controller-runtime-cache-explained/

## 5. Failure domains: learn from Erlang/OTP

Erlang supervisors distinguish the supervisor role from worker role and define restart strategies, shutdown behavior, and restart intensity. Dynamic children can be added, but supervision semantics and organizational semantics are not the same thing.

This leads to a subtle Ω design rule:

> **The organizational hierarchy and the failure hierarchy should not be assumed to be identical.**

A department may own a capability, but a worker failure may be isolated and restarted without restarting the department master. Conversely, a context-corruption event might justify replacing the resident activation while preserving the department.

Therefore Ω should have:

    ORGANIZATIONAL TOPOLOGY
          != 
    SUPERVISION TOPOLOGY

Use organizational relations to answer ownership and responsibility. Use supervision relations to answer failure and restart.

Restart intensity is particularly relevant. An agent that repeatedly fails and is endlessly recreated can become an inference-spending crash loop. Ω needs a failure-rate budget analogous to Erlang's restart intensity.

Source:
- Erlang Supervisor Behaviour: https://www.erlang.org/doc/system/sup_princ.html

## 6. Activation versus wake is an important distinction

Orleans gives us activation/deactivation. Kubernetes gives us reconciliation. Ω should combine these with model inference:

    dormant resident
         |
      trigger
         |
      activation
         |
      context build
         |
      bounded model turn
         |
      durable state update
         |
      dormant

An activation is not necessarily a long-lived session. A wake may instantiate a session, run a bounded turn, and terminate it.

Thus the Presence Kernel should own **activation policy**, while OpenCode remains the execution substrate.

## 7. Blackboard: coordination without transcript coupling

Blackboard architectures let specialists react to shared persistent state rather than requiring direct conversational coordination. Recent work applies this pattern to LLM multi-agent systems, selecting agents based on blackboard state and repeating until a consensus or stopping condition is reached; one 2025 implementation reported competitive performance with lower token spend in its tested settings.

The key lesson for Ω is not 'build a blackboard chat room.'

It is:

> **Shared work state should be addressable independently of the workers that produced it.**

That aligns directly with Ω's distinction between evidence, representation, description, and authority.

Sources:
- Blackboard pattern overview: https://multiagentsystems.sites.markushanses.de/en/pattern/blackboard/
- 2025 LLM blackboard paper: https://arxiv.org/abs/2507.01701

## 8. Dynamic worker formation: learn from Contract Net

Contract Net Protocol models dynamic allocation around capabilities: a manager announces a task, eligible contractors evaluate it, and one or more are selected.

Classic contract-net and later variants show the value of capability-aware allocation, but also reveal communication overhead and the need for better bid filtering and constraints.

Ω should therefore not broadcast every work item to every worker capability.

Instead:

    work requirement
         -> capability filter
         -> policy/authority filter
         -> resource filter
         -> candidate capacity
         -> admission

This suggests a **capability registry + admission broker** rather than a pure swarm broadcast mechanism.

Sources:
- Contract Net analysis: https://www.sciencedirect.com/science/article/abs/pii/S0005109806000057
- Dynamic task allocation example: https://www.mdpi.com/1999-4893/12/4/70

## 9. Resource-bounded execution contracts

A 2026 preprint, Agent Contracts, extends task allocation into explicit resource-bounded execution contracts with input/output specifications, resource constraints, time limits, success criteria, and hierarchical budget conservation.

The research is especially relevant to Ω because worker spawning is not merely a concurrency question. Every worker consumes model attention, context, wall-clock time, tools, and potentially external side effects.

Therefore a worker admission should conceptually carry a contract:

    worker contract
      capability
      objective
      scope
      allowed resources
      time/turn bound
      evidence requirement
      completion condition
      parent budget bound

The paper is a preprint and its quantitative findings should be treated as external evidence, not as Ω proof.

Source:
- Agent Contracts: https://arxiv.org/abs/2601.08815

## 10. Long-running execution: checkpoints and reincarnation

LangGraph provides persistent checkpoints and explicit interrupts/resume. Temporal similarly models durable execution with replayable workflow history, while its agent integration demonstrates carrying long-running agent state across workflow continuations. OpenHands persists conversation state/events, supports paused/finished/stuck states, and uses persisted conversation state for resumption.

The transferable pattern is:

    execution state is durable
    activation is replaceable
    resume is explicit
    interruptions are first-class

For Ω, this means session rollover should be a normal lifecycle event rather than an exceptional recovery hack.

Sources:
- LangGraph persistence/checkpoints: https://github.com/langchain-ai/docs/blob/main/src/oss/langgraph/checkpointers.mdx
- LangGraph interrupts: https://github.com/langchain-ai/docs/blob/main/src/oss/langgraph/interrupts.mdx
- Temporal agent integration: https://docs.temporal.io/develop/python/integrations/strands-agents
- Temporal child workflows: https://docs.temporal.io/child-workflows
- OpenHands SDK state: https://github.com/OpenHands/software-agent-sdk/blob/main/openhands-sdk/openhands/sdk/conversation/state.py

## 11. Context and memory: learn from current agent runtimes

Anthropic explicitly frames context engineering as the curation of system instructions, tools, MCP, external data, and message history into the best model-visible state for each inference call. Their long-running-agent guidance uses incremental sessions plus durable artifacts between runs.

OpenAI's current Agents SDK similarly separates sessions from other state mechanisms and supports session compaction; its documentation emphasizes that long histories can overwhelm even large context windows.

Letta separates in-context core memory from out-of-context archival memory. That maps well to the Ω distinction between compact always-available state and retrievable durable state.

The resulting Ω principle is stronger than 'use memory':

> **Each activation should compile a task-specific context projection from durable state.**

Sources:
- Anthropic context engineering: https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents
- Anthropic long-running harnesses: https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents
- OpenAI Agents SDK sessions: https://openai.github.io/openai-agents-js/guides/sessions/
- Letta memory architecture: https://github.com/letta-ai/skills/blob/main/letta/agent-development/references/memory-architecture.md

## 12. AIOS: useful warning, useful inspiration

AIOS frames scheduling, context switching, memory management, storage, tool management, and access control as kernel-level concerns for LLM agents. This validates the idea that these concerns belong below individual agent logic.

However, Ω should not simply reproduce AIOS.

AIOS is primarily an agent runtime/kernel. Ω additionally needs durable organizational semantics: departments, responsibilities, work ownership, evidence, authority, and resident presence.

Source:
- AIOS: https://arxiv.org/abs/2403.16971

## 13. The synthesis: Ω needs two interacting planes

The research strongly suggests a control-plane/data-plane split.

### Organizational Control Plane

Durable and mostly symbolic:
- organization/departments;
- resident identities;
- responsibilities;
- capabilities;
- subscriptions;
- desired presence;
- work state;
- budgets;
- policies;
- evidence/authority references.

### Execution Data Plane

Ephemeral and computational:
- OpenCode sessions;
- worker instances;
- tool execution;
- provider turns;
- temporary team formations;
- intermediate context;
- process handles.

The Presence Kernel connects the two.

    CONTROL PLANE
      desired state
      work
      policy
      budgets
          |
       reconcile
          |
    PRESENCE KERNEL
      wake/admit
      context compile
      supervise
          |
    EXECUTION PLANE
      OpenCode sessions
      workers/tools
          |
      evidence/state
          |
       back to control plane

## 14. New concepts Ω should add

### 14.1 Resident Record
Durable logical identity independent of session incarnation.

### 14.2 Presence Declaration
Desired state for whether/how a resident or sentinel should be able to react.

### 14.3 Activation
A bounded period in which a resident receives model capacity.

### 14.4 Context Epoch
A versioned projection boundary allowing session replacement without identity replacement.

### 14.5 Capability Cell
A reusable capability definition that can materialize worker instances.

### 14.6 Worker Contract
The explicit resource/scope/evidence envelope under which a worker instance executes.

### 14.7 Wake Bundle
Coalesced trigger set that causes one activation.

### 14.8 Attention Budget
Model-resource budget across foreground, resident, background, recovery, and maintenance demand.

### 14.9 Supervision Domain
Failure/restart grouping independent of organizational ownership.

### 14.10 Context Compiler
Deterministic/relevance-driven assembly of model-visible context from durable state.

### 14.11 Return Capsule
Compact, evidence-linked representation returned from an activation.

## 15. The new runtime loop

The entire model can be expressed as:

    desired state / new event
            |
       wake eligibility
            |
       attention admission
            |
       context compilation
            |
       OpenCode activation
            |
       bounded reasoning
            |
       worker formation if needed
            |
       evidence + state writes
            |
       supervision / reconciliation
            |
       dormancy or next wake

The loop is persistent even when no model is running.

That is the real meaning of an always-on organization.

## 16. What is genuinely novel in the combination

Existing systems separately provide pieces:

- OpenCode: sessions, agents, Task, background execution, context hooks;
- Erlang: supervision;
- Orleans: durable logical identity + replaceable activation;
- Kubernetes: reconciliation;
- Blackboard: shared asynchronous state;
- Contract Net: capability allocation;
- Agent Contracts: resource-bounded delegation;
- LangGraph/Temporal/OpenHands: checkpointed execution;
- Anthropic/OpenAI/Letta: context and memory management;
- AIOS: agent runtime services.

Ω's opportunity is to combine these around a **sovereign organizational state model** where authority and evidence are first-class and where model activations are disposable projections.

That is materially different from a framework-specific team manager.

## 17. New anti-patterns derived from the cross-domain synthesis

| ID | Anti-pattern |
|---|---|
| XD-01 | Org tree = supervision tree | Treating functional ownership and failure containment as the same hierarchy |
| XD-02 | Resident = activation | Replacing an OpenCode session accidentally creates a new organizational identity |
| XD-03 | Desired presence = running process | Keeping processes alive simply to represent persistence |
| XD-04 | Event = immediate model turn | No coalescing or admission control |
| XD-05 | Worker = capability definition | Permanent identities created for reusable capabilities |
| XD-06 | Controller = scheduler | Reconciliation loop grows hidden allocation logic |
| XD-07 | Blackboard = authority | Shared state is mistaken for permission to act |
| XD-08 | Contract = prompt | Resource/scope constraints exist only as natural-language instructions |
| XD-09 | Restart = retry | Failure recovery repeats a bad activation without intensity limits |
| XD-10 | Checkpoint = transcript | Persisting conversation text instead of durable work state |
| XD-11 | Memory = retrieval dump | Retrieval increases context without relevance selection |
| XD-12 | Background = second user | Background activity competes with foreground without explicit attention governance |
| XD-13 | Activation = work item | One execution instance becomes the durable owner of organizational work |
| XD-14 | Status = observation | Reported model state is accepted without independent evidence |

## 18. Research direction now

The next research should no longer ask only 'how do we spawn ten residents?'

It should answer five deeper questions:

1. **Activation semantics:** what exactly causes a resident to become computationally active?
2. **Context compilation:** how is the smallest sufficient context assembled?
3. **Capacity economics:** how are worker and attention budgets conserved across hierarchy?
4. **Supervision/reconciliation:** how do failures and drift repair themselves without changing organizational identity?
5. **Organizational state:** what durable representation makes a department recoverable without its session history?

Those are now the primary U2A research questions.

## 19. Evidence boundary

Cross-domain frameworks provide transferable mechanisms, not proof of Ω behavior.

Any concrete Ω runtime claim must still be validated on the Windows/OpenCode substrate with explicit fixtures and durable evidence.
