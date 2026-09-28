# Residency, Functional Departments, and the Presence Kernel

> Status: PROPOSED RESEARCH / DESIGN INPUT
> Reviewed: 2026-09-28

## 1. The design gap

U1 proves resident -> native Task -> bounded worker.

The next problem is qualitatively different: Ω needs durable functional areas, a persistent reasoning anchor for each area, reusable worker capabilities, temporary worker instances, and an always-on background layer that can notice relevant change without keeping an LLM turn alive forever.

This is not simply a larger swarm. It is an organizational runtime.

## 2. Research conclusion

Current OpenCode provides primary/subagent agent modes and fresh foreground/background child sessions, but does not itself define a durable organizational department, a residency lifecycle, event-driven dormancy, or a cross-cutting always-on presence layer. Working extensions add orchestration state outside the native session abstraction: opencode-swarm uses an SDK orchestrator plus persistent SQLite state; oh-my-opencode adds team mode, task state, background members, and specialist routing. OpenCode V2 also exposes just-in-time context hooks immediately before model dispatch.

Long-running agent research similarly converges on durable state plus event-driven dormancy/wakeup rather than a perpetually thinking loop.

Therefore Ω should add a layer above the session substrate instead of stretching the session abstraction until it becomes an organization.

## 3. Fundamental object model

| Object | Meaning | Lifetime |
|---|---|---|
| Organization | Container for functional areas | durable |
| Department | Functional identity, mandate, authority, capability repertoire | durable |
| Master / Resident | Long-lived reasoning anchor for a department | long-lived, replaceable session |
| Worker Capability | Reusable kind of work | durable catalog |
| Worker Instance | Computational capacity assigned to a work item | temporary |
| Work Item | Durable unit of organizational work | durable until closed |
| Session Incarnation | OpenCode execution context | temporary/recyclable |
| Presence | Runtime ability to notice triggers and obtain capacity | durable state |

The critical invariant is: identity, capability, capacity, session, and work are different concepts.

A session may disappear while a resident survives. A worker may disappear while its work item survives. A capability may be materialized many times.

## 4. A department is not a fixed team

Do not default to master + N permanently running teammates.

Use master + capability catalog + dynamic capacity.

Example:

    Department
      Master
        research
        forensic
        implementation
        verification
        synthesis

A work item might materialize three workers; another might materialize one.

Team is therefore a composition of capability, lifecycle, and capacity rather than a fixed population.

## 5. The master / resident

The master is the department's persistent intellectual anchor.

Owns:
- department purpose and bounded mandate;
- active work inventory;
- local priorities and hypotheses;
- interpretation of worker evidence;
- requests for worker capacity.

Does not own:
- global scheduling;
- admission quotas;
- global resource allocation;
- authority outside its mandate;
- unilateral creation of new organizational identities.

The master decides intellectual decomposition. The runtime decides whether requested capacity is admitted.

## 6. Residency is not an OpenCode mode

OpenCode's primary/subagent/background semantics describe sessions. Ω residency must be independent.

Proposed resident lifecycle:

    ABSENT -> BOOTING -> PRESENT -> ACTIVE -> DORMANT
                              ^             |
                              |             v
                         REAWAKENING <------
                              |
                           RETIRING -> RETIRED

A resident record survives session replacement.

Conceptually:

    resident_id + session_incarnation -> OpenCode session

Replacing the session does not create a new resident.

## 7. The unique layer: Presence Kernel

Ω needs a Presence Kernel above OpenCode.

Its responsibilities are:

### Trigger intake
Receive durable triggers from work, dependencies, repository drift, research freshness, provider changes, evidence conflicts, worker failures, schedules, user input, and recovery.

### Eligibility
Determine which resident or background capability is eligible to react.

### Wake
Materialize a bounded model activation with a context projection.

### Coalesce
Combine related events before waking a model.

Example: dozens of repository changes plus several failed tests should normally become one repository-change wake bundle, not dozens of model turns.

### Attention admission
Limit background inference so the always-on layer cannot become an always-spending layer.

### Dormancy
Return a resident to a non-thinking state when there is no active obligation.

### Checkpoint and recovery
Persist enough state to reconstruct the next activation after a restart or session replacement.

### Session rollover
Replace an overgrown or stale session while preserving resident identity and durable state.

Core principle:

> Presence is persistent; inference is intermittent.

## 8. Always-on does not mean always-thinking

Bad:

    while true: ask model, wait, ask model, wait

Good:

    persistent runtime
      -> wait for durable trigger
      -> assemble minimal context
      -> bounded model turn
      -> persist state
      -> sleep

This is the main architectural distinction between an ambient runtime and an endless agent loop.

## 9. Background population is cross-cutting

The background layer should not simply mean all departments running continuously.

It is a population of sentinels and maintainers such as:
- repository drift sentinel;
- research freshness sentinel;
- runtime health sentinel;
- evidence consistency sentinel;
- provider drift sentinel;
- dependency/security watcher;
- stale-work detector.

Normal outcomes should be:

    NO_ACTION | OBSERVATION | PROPOSAL | ALERT | WORK_ITEM_REQUEST

Background observation must not silently become consequential authority.

## 10. Context projection is a runtime service

Every activation should build a context projection from durable state:

    durable state
       -> identity context
       -> work context
       -> relevant evidence
       -> recent session tail
       -> tool/context budget
       -> model request

Do not make the resident's OpenCode transcript the canonical memory.

OpenCode V2 context hooks are particularly relevant because they can modify the outgoing system instructions, messages, and tools immediately before model dispatch without mutating persisted history.

## 11. Worker lifecycle is orthogonal to capability

| Worker mode | Semantics |
|---|---|
| Ephemeral | spawn -> work -> evidence -> terminate |
| Continuity | spawn -> work -> checkpoint -> pause -> resume -> terminate |
| Background | subscribe -> wake -> bounded work -> persist -> sleep |

The same capability may use any of these modes.

## 12. Attention budget

Resource management must include model attention, not only process concurrency.

Conceptually:

    attention budget = foreground + resident work + background + recovery + maintenance

The Presence Kernel therefore needs at least:
- priority;
- estimated turn cost;
- concurrency limit;
- deduplication/coalescing;
- cooldown/suppression;
- cancellation;
- starvation detection.

This is a new design requirement missing from the original worker-pool framing.

## 13. Context epochs

Each resident should have a context epoch.

Roll to a new session incarnation when:
- context becomes bloated or stale;
- compaction is no longer giving useful continuity;
- role revision changes;
- durable state changes materially;
- recovery requires a clean context.

Thus:

    resident identity -> context epoch -> OpenCode session

Session reset becomes routine maintenance, not organizational failure.

## 14. New anti-patterns

| ID | Anti-pattern |
|---|---|
| RP-01 | Eternal session: resident identity is tied to one never-resetting session |
| RP-02 | Always-thinking daemon: continuous model calls while idle |
| RP-03 | Fixed-team inflation: permanent child sessions for idle capability |
| RP-04 | Session-as-memory: hidden transcript becomes canonical department memory |
| RP-05 | Trigger-to-LLM explosion: every low-level event creates a model turn |
| RP-06 | Background-equals-authority: watchers mutate consequential state directly |
| RP-07 | Worker-type-equals-identity: every capability gets a permanent identity |
| RP-08 | Scheduler-inside-master: master reimplements admission and queues |
| RP-09 | Context-inheritance-by-default: workers receive unrelated department history |
| RP-10 | Dormancy-as-failure: a sleeping resident is treated as dead |
| RP-11 | Context-reset-loses-work: session replacement destroys durable continuation |
| RP-12 | Background-starvation: maintenance can be indefinitely starved by foreground work |

## 15. Upgrade integration

U1 remains unchanged. It proves native governed delegation.

Insert a new intermediate capability:

### U2A — Resident Organization and Presence Kernel

Prove:
1. durable department identity independent of session ID;
2. one master/resident anchor;
3. capability catalog separate from worker instances;
4. dynamic worker materialization;
5. resident dormancy and wake;
6. trigger intake and coalescing;
7. context projection;
8. session replacement without identity loss;
9. a bounded background sentinel;
10. attention-budget admission.

The existing U2 worker-pool goal becomes a capacity component inside this architecture.

### U2 — Resident-owned worker pool

Scale dynamic worker capacity only after U2A establishes the organizational runtime.

### U3 — Durable lineage/evidence

Harden the durable history and recovery semantics around the now-separated department, resident, worker, work-item, and session identities.

## 16. Minimal U2A topology

    Presence Kernel
       |
       +-- Department Masters
       |      +-- capability catalogs
       |      +-- dynamic workers
       |
       +-- Background Sentinels
              +-- event subscriptions
              +-- bounded wake turns
       |
       +-- Context Projection
              +-- OpenCode sessions
              +-- durable Ω state

## 17. Explicit non-goals

U2A should not become a workflow engine, a distributed scheduler, an OpenCode replacement, an uncontrolled autonomous swarm, or an implicit source of Ω constitutional authority.

The first implementation should prove presence, context projection, and bounded background behavior on one Windows machine.

## 18. Falsifying experiments

- resident can rotate sessions with no unacceptable loss of continuity;
- event coalescing reduces model turns without delaying important reactions;
- a sentinel can operate effectively with micro-context;
- resume history provides measurable benefit over fresh handoff when continuity is chosen;
- attention budgets prevent background runaway and starvation;
- dynamic capability composition is useful without fixed rosters;
- restart reconstructs dormant residents from durable state.

## Research anchors

- OpenCode V2 Agents: https://opencode.ai/v2/docs/agents
- OpenCode V2 Plugins/context: https://opencode.ai/v2/docs/build/plugins
- OpenCode V2 Compaction: https://opencode.ai/v2/docs/compaction
- opencode-swarm: https://github.com/ibraheem-111/opencode-swarm
- oh-my-opencode orchestration: https://github.com/lovicho/oh-my-opencode/blob/dev/docs/guide/orchestration.md
- Google ADK long-running agents: https://developers.googleblog.com/build-long-running-ai-agents-that-pause-resume-and-never-lose-context-with-adk/

## Evidence classes

- SOURCE-EXACT
- OFFICIAL-DOCS
- EXTERNAL-CORROBORATION
- DESIGN-CONCLUSION
- LIVE-PROOF-REQUIRED