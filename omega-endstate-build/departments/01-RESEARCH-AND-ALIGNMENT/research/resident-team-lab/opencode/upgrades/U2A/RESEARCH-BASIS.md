# U2A Research Basis

> Status: PROPOSED
> Question: what organizational runtime must exist before Ω scales resident and background capacity?

## Evidence convergence

| Pattern | External system | Ω translation |
|---|---|---|
| Logical identity survives activation | Orleans | Resident survives session incarnation |
| Desired vs actual state reconciliation | Kubernetes | Presence Kernel reconciles organizational posture |
| Failure isolation and restart intensity | Erlang/OTP | Separate supervision domains + restart budgets |
| Shared asynchronous state | Blackboard systems | Durable work/evidence surface |
| Capability-based dynamic allocation | Contract Net | Capability registry + admission |
| Resource-bounded delegation | Agent Contracts | Worker contracts + parent budget conservation |
| Checkpointed pause/resume | LangGraph / Temporal / OpenHands | Session-independent continuation |
| Context curation | Anthropic / OpenAI / Letta | Context Compiler |
| Agent runtime services | AIOS | Scheduling/context/memory concerns belong below agents |

## Design propositions

### P1 — Organizational identity is virtual
A resident/depart­ment is a durable logical entity with zero, one, or many session incarnations over time.

### P2 — Presence is desired state
A resident can be PRESENT while no OpenCode session is active. Presence becomes a reconciliation target, not a process.

### P3 — Activation is bounded
Each wake receives a bounded attention allowance and must persist its outcome/state transition before returning to dormancy.

### P4 — Capability materializes capacity
A capability is reusable. Worker instances are temporary.

### P5 — Supervision is orthogonal
Restart relationships should follow failure domains, not organizational ownership.

### P6 — Work is durable
Work item ownership persists independently of the worker session assigned to it.

### P7 — Context is compiled
The active model context is generated from durable state and relevance policy rather than treated as canonical memory.

### P8 — Background is event-driven
Persistent background presence is implemented as durable subscriptions plus bounded wakeups, not permanent inference loops.

### P9 — Budgets conserve
A child contract cannot silently obtain more resource authority than its parent/work item permits.

### P10 — Evidence closes the loop
An activation may report an outcome, but durable acceptance depends on observable evidence and policy.