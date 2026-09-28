# OpenCode Context Architecture and Spawn Balance

**Evidence status:** MIXED — source-exact OpenCode implementation + official V2 documentation + Omega design conclusions  
**Scope:** resident-team substrate, session spawning, context continuity, compaction, handoff, and context-budget optimization  
**Lab boundary:** the current resident-team lab still targets the pinned V1 substrate for U1; V2 findings are forward-looking substrate research, not a silent migration.

---

## 1. The central finding

OpenCode separates **session identity/lineage** from **conversation context**.

A child created through the Task/subagent mechanism receives a new session. The child session is linked to the parent through parentID, but the parent conversation is not automatically copied into the child's model context. The child receives its own agent/system context plus the task prompt.

That distinction is extremely useful for Omega:

> **Do not treat a session as the unit of organizational memory.**

### Consequence

The optimization problem is not: 'How do we maximize context inside every session?'

It is: 'How do we keep each session's context narrowly useful while making the minimum durable state necessary to continue work available across sessions?'

## 2. What OpenCode actually does

### 2.1 Fresh child

In the V1 Task implementation (`packages/opencode/src/tool/task.ts`):

1. Resolve the calling session.
2. Enforce subagent depth.
3. Authorize the requested agent type.
4. Resolve the target agent.
5. Create a fresh child session when task_id is absent.
6. Set the child parentID to the caller's session ID.
7. Assign the child agent and derived permissions.
8. Prompt the child session with the task prompt.

The parent history is not passed as the child's message history.

**Source:** https://github.com/anomalyco/opencode/blob/dev/packages/opencode/src/tool/task.ts

### 2.2 Resume / reused session

When task_id is supplied, V1 can reuse an existing session instead of creating a fresh child. That changes the context behavior fundamentally: the resumed session carries its own prior history.

This is powerful for continuity but weak as an authority primitive because the historical session itself is not proof that it belongs to the current work item, resident, parent, workspace, or governance scope.

**Omega implication:** future resume should be an explicit ownership/state transition, not simply 'session exists, therefore resume is valid.'

### 2.3 Parent receives the result, not the child's full context

Foreground Task returns a structured task result to the caller. Background Task later injects the child's result into the parent session as synthetic context.

This creates an intentional compression boundary:

parent context -> task prompt -> child context -> child result -> parent context

The child does not need to expose its complete transcript to the parent for normal orchestration.

## 3. Context is rebuilt per provider turn

OpenCode does not treat the model's context window as a permanent session buffer.

The runner reconstructs the outgoing request from persisted session history plus runtime system context and the current agent/tool materialization.

The important distinction is:

- **persisted session history** = durable conversation record;
- **assembled model context** = what is actually sent on this provider turn;
- **runtime context** = system instructions / skills / references / tools added at assembly time;
- **compaction state** = a lossy representation of older history used to make room.

V2 explicitly exposes a context assembly hook that can modify the outgoing system instructions, messages, and tools without rewriting persisted history.

**Source:** https://opencode.ai/v2/docs/build/plugins

This is a major design lever for Omega.

## 4. Compaction is not a substitute for architecture

Current OpenCode V2 automatically compacts long sessions by summarizing older conversation and retaining a recent tail. The summary is structured around:

- objective;
- important details;
- completed / active / blocked work;
- next move;
- relevant files.

The current V2 documentation describes roughly 15k tokens of recent context by default, with configurable keep.tokens and buffer.

**Source:** https://opencode.ai/v2/docs/compaction

The implementation also makes two important facts explicit:

1. compaction is lossy;
2. earlier messages remain stored even when they are no longer sent to the model.

Therefore:

> **Storage continuity can be effectively unbounded while model continuity remains bounded.**

That is desirable. Omega should exploit it rather than trying to keep every useful fact in every resident's active context.

## 5. The optimal context hierarchy for resident teams

The research supports a layered context model.

### L0 — Constitutional / role context

Small, stable, always present.

Contains:
- resident identity;
- bounded role;
- authority boundaries;
- refusal rules;
- output contract;
- governance invariants.

This belongs in the agent configuration/system prompt.

**Rule:** L0 must remain small enough that it is never competing with work evidence.

### L1 — Work-item handoff

Small, structured, explicit, durable.

Contains:
- work item ID;
- objective;
- scope;
- current state;
- dependencies;
- files/resources in play;
- accepted constraints;
- unresolved questions;
- required output;
- evidence expectations.

This is the primary context passed when spawning a worker.

**Target:** enough information to make the worker competent, not enough to recreate the parent's transcript.

### L2 — Relevant knowledge slice

Fetched on demand from durable research / Commons / workspace state.

Contains only the subset relevant to the current assignment.

Examples:
- one prior research finding;
- one architecture decision;
- one experiment result;
- one file-specific evidence excerpt.

In V2, this is especially compatible with context hooks because outgoing context can be augmented without polluting persisted session history.

### L3 — Ephemeral execution context

Worker-local:
- tool calls;
- command output;
- intermediate hypotheses;
- temporary hypotheses;
- detailed exploration;
- provider-specific noise.

This should normally die with the worker session.

### L4 — Returned evidence artifact

What survives worker termination.

Prefer:

artifact + status + provenance + concise continuation summary

over:

entire transcript.

The artifact may be a document, patch, test result, experiment record, structured finding, or explicit blocker.

### L5 — Durable organizational memory

Long-lived facts shared across sessions:
- verified findings;
- accepted decisions;
- known anti-patterns;
- experiment outcomes;
- work-item state;
- ownership;
- provenance;
- contradictions / unresolved claims.

This belongs in Omega's durable state, not in one agent's hidden history.

## 6. Why transcript cloning is the wrong default

A tempting design is:

parent history -> copy to worker -> worker history -> copy back

It appears to maximize continuity, but it creates several costs.

### Context cost

Every worker pays for irrelevant parent history.

### Staleness cost

The worker sees historical assumptions that may already be superseded.

### Duplication cost

The same information exists in multiple sessions and must be reconciled.

### Authority confusion

A historical statement can look authoritative merely because it came from a previous agent turn.

### Parallelism cost

Two workers may independently mutate interpretations of the same copied context.

### Scope leakage

A worker receives information that is not actually required for its bounded assignment.

The better pattern is:

durable state -> relevance selection -> compact handoff -> worker

and on return:

worker -> evidence artifact -> durable state

## 7. Why long-lived residents still make sense

Long-lived sessions are valuable when the resident's continuity itself is useful.

Examples:
- research resident repeatedly maintaining the same research corpus;
- architecture steward maintaining an ongoing architectural investigation;
- provider laboratory resident accumulating empirical knowledge about one provider family.

The benefit is not that the resident can remember everything. The benefit is that it can maintain a coherent local working thread between related assignments.

But resident continuity should be bounded.

A resident should periodically emit durable checkpoints so that:

resident session history != resident memory

The durable memory must be sufficient to reconstitute a fresh resident if its session becomes stale, bloated, corrupted, or intentionally reset.

## 8. The practical balance

A useful starting policy for Omega:

### Residents

Use **long-lived anchor sessions**.

Keep:
- stable role/context;
- active workstream context;
- small recent working tail.

Persist:
- discoveries;
- decisions;
- evidence;
- blockers;
- next actions.

### Workers

Use **fresh sessions by default**.

Spawn with:
- compact work-item handoff;
- narrow relevant evidence;
- explicit acceptance criteria.

Do not inject:
- parent transcript;
- unrelated previous work;
- full Commons dump.

### Resume

Resume only when:
- the work item is still active;
- the session is durably bound to that work item;
- the same authority scope applies;
- the session's age/context state is within policy;
- the worker benefits materially from continuity.

Otherwise spawn fresh.

### Handoff

Treat handoff size as a first-class runtime metric.

Do not optimize only for 'context window utilization.' Optimize for:

useful context / total context

and:

durable useful state / transcript volume.

## 9. Context budget model

For every provider turn, conceptually measure:

B_total = context_limit

and reserve:

B_reserved = output_budget + safety_buffer

leaving:

B_available = B_total - B_reserved

The usable working context is then divided among:

B_role + B_handoff + B_retrieved + B_recent_history + B_tools

The important policy is not to maximize each term.

Instead, B_role + B_handoff + B_retrieved should be intentionally small and high-signal, while B_recent_history expands only when it materially improves the current task.

Tool definitions and fixed instructions matter too: compaction cannot rescue a session when most of the context window is consumed by fixed system/tool material.

## 10. A stronger Omega invariant

Proposed invariant:

> **Context is a projection, not the source of truth.**

The source of truth lives in durable, provenance-bearing state.

A session is a temporary projection of that state plus its execution history.

This aligns with the Omega principles already established elsewhere:

- EVIDENCE ≠ REPRESENTATION ≠ DESCRIPTION ≠ AUTHORITY
- confidence ≠ proof
- candidate ≠ realization
- unknown ≠ failure

A model-visible summary is therefore a **representation** of work state, not the work state itself.

## 11. Resident-worker topology

Recommended shape:

Resident Anchor
→ selects work item
→ emits Handoff Packet
→ Fresh Worker
→ executes
→ emits Evidence Artifact
→ durable work item / Commons update
→ Resident Anchor receives concise result

When continuity is genuinely needed:

Resident Anchor
→ resumes owned worker session
→ verifies durable lineage
→ continues from that worker's compacted history

This makes worker-session reuse an optimization, not the foundation of the organizational model.

## 12. What we should measure

Measure at minimum:

| Metric | Why |
|---|---|
| handoff tokens | cost of spawning |
| first-turn success | whether the worker had enough context |
| correction / clarification turns | missing handoff signal |
| tool-call volume | downstream context growth |
| compaction frequency | session inflation |
| returned artifact size | parent contamination |
| task completion latency | continuity benefit |
| repeated-work rate | missing durable state |
| factual contradiction rate | stale/copied context |
| resume success rate | continuity value |
| fresh-vs-resume quality | actual tradeoff |
| useful-context ratio | signal vs total context |

The most important comparison is:

**Fresh worker + compact handoff** vs **Resumed worker + existing history**

on the same work-item class.

## 13. Immediate experiments

### E-CX-01 — Fresh worker sufficiency

Give a worker only role, work-item handoff, and 1–3 relevant evidence excerpts. Compare against a worker receiving a much larger context bundle.

Goal: find the minimum viable handoff.

### E-CX-02 — Resident continuity

Run the same resident through a sequence of related work items. Compare one continuously reused session with periodic fresh sessions restored from durable checkpoints.

Goal: identify where resident continuity stops paying for its context weight.

### E-CX-03 — Resume vs fresh

Resume a verified owned worker after a pause and compare it with a fresh worker using the durable checkpoint.

Goal: quantify the actual value of historical worker context.

### E-CX-04 — Result compression

Compare full transcript return versus structured evidence artifact return.

Goal: measure parent-session pollution and downstream quality.

### E-CX-05 — Context-hook injection

For V2-compatible experiments, keep durable knowledge outside the session and inject only the relevant slice at model-dispatch time.

Goal: test whether dynamic retrieval can replace persistent transcript accumulation.

## 14. Research conclusion

The strongest current architecture is neither one giant session for everything nor a fresh stateless agent for every task.

It is:

**long-lived bounded residents + short-lived workers + explicit durable handoffs + selective context projection + evidence-based return paths.**

The session is where an agent *thinks*.
The work item is what the organization *owns*.
The durable evidence is what the system *remembers*.

That separation gives Omega room to optimize context aggressively without making context itself the organizational memory substrate.

## Primary sources

- OpenCode V1 Task implementation: https://github.com/anomalyco/opencode/blob/dev/packages/opencode/src/tool/task.ts
- OpenCode V1 session implementation: https://github.com/anomalyco/opencode/blob/dev/packages/opencode/src/session/session.ts
- OpenCode V1 prompt assembly: https://github.com/anomalyco/opencode/blob/dev/packages/opencode/src/session/prompt.ts
- OpenCode V1 compaction implementation: https://github.com/anomalyco/opencode/blob/dev/packages/opencode/src/session/compaction.ts
- OpenCode V2 compaction implementation: https://github.com/anomalyco/opencode/blob/dev/packages/core/src/session/compaction.ts
- OpenCode V2 compaction docs: https://opencode.ai/v2/docs/compaction
- OpenCode V2 agents docs: https://opencode.ai/v2/docs/agents
- OpenCode V2 plugin/context docs: https://opencode.ai/v2/docs/build/plugins

## Evidence class notes

- **SOURCE-EXACT:** claims about the OpenCode implementation are tied to the source files above.
- **OFFICIAL-DOC:** current V2 behavior/configuration descriptions are taken from official OpenCode documentation.
- **DESIGN-CONCLUSION:** Omega recommendations are architectural conclusions from the observed substrate.
- **LIVE-PROOF-REQUIRED:** any claim about quality, throughput, cost, or actual task success still requires experiment data in the resident lab.