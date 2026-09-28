# Layered Insights — Resident Team Research Synthesis

> Status: ACTIVE SYNTHESIS
> Date: 2026-09-28
> Inputs: R-01 through R-05
> Purpose: identify durable patterns without copying any framework wholesale

## Layer 0 — The shared problem

All five sources address a variant of the same problem: long-horizon work exceeds what one static prompt, one context, or one fixed workflow can reliably manage.

- Meta-Team: evolve from distributed execution experience.
- OneManCompany: make organization a first-class operating layer.
- Swarm Skills: make coordination portable and evolvable.
- SwarmAgentic: search the space of candidate organizations.
- ClawTeam: expose practical primitives for spawning, isolation, dependencies, and communication.

**Synthesis:** organizational machinery is itself part of agent capability.

## Layer 1 — Identity

### Insight 1: separate who, what, and where

OMC's Talent/Container split is the clearest external statement of this pattern.

Recommended Ω conceptual separation:

`Identity` + `Capability` + `Runtime Binding` + `Policy` + `Evidence`

**Best practice:** stable identity must survive runtime replacement.

### Insight 2: capability is more than a role label

OMC packages role, prompts, principles, tools, skills, and supporting resources into a Talent.

**Best practice:** an agent role should be backed by inspectable/versioned capability assets, not only prose.

## Layer 2 — Context

### Insight 3: preserve local context; relate it rather than flattening it

Meta-Team's collaborative scheme keeps each agent's local execution context while reconnecting it through cross-agent evidence.

**Best practice:** use local traces plus causal links rather than one universal transcript.

### Insight 4: progressive disclosure

Swarm Skills exposes minimal metadata first and loads detailed coordination instructions only when selected.

**Best practice:** discover small -> select -> load minimum -> expand on demand.

**Ω relevance:** this is a strong pattern for self-knowledge/context generation.

## Layer 3 — Work

### Insight 5: execution lineage is not the work graph

OMC and ClawTeam both make task dependencies explicit.

**Best practice:** keep these distinct:

- execution lineage;
- dependency graph;
- ownership;
- evidence;
- acceptance.

**Ω consequence:** OpenCode `parentID` must never silently become the canonical Work graph.

### Insight 6: completion is not acceptance

OMC explicitly separates completed execution from accepted output before downstream work can unblock.

**Best practice:**

`EXECUTED` != `ACCEPTED` != `AUTHORIZED`

This aligns directly with the Ω evidence/authority distinction.

### Insight 7: finite lifecycle + bounded retries

OMC uses explicit task states and bounded retry/escalation rather than allowing silent indefinite cycles.

**Best practice:** every autonomous operation needs explicit terminal states and bounded retry semantics.

## Layer 4 — Delegation

### Insight 8: let the problem owner decide demand

ClawTeam demonstrates that agents can actively decide when to spawn workers and how to split work.

**Best practice:** the resident closest to the problem normally decides needed capacity.

Ω translation:

`resident decides demand -> policy authorizes -> runtime admits -> native execution`

### Insight 9: keep control primitives small

Practical systems expose a compact vocabulary for spawn, task state, communication, and reporting.

**Best practice:** a small composable primitive set is preferable to one opaque orchestration API.

## Layer 5 — Coordination

### Insight 10: communication becomes useful when causally connected

Meta-Team uses post-task communication to explain how outputs affected downstream choices; Swarm Skills treats coordination friction as evolution input.

**Best practice:** preserve `message + cause + downstream use + outcome` where feasible.

### Insight 11: coordination is itself a versioned capability

Swarm Skills explicitly packages coordination protocol separately from the runtime.

**Best practice:** coordination assets should be inspectable, versionable, testable, promotable, and reversible.

## Layer 6 — Isolation

### Insight 12: physical boundaries beat prompt promises

ClawTeam's worktree/execution-surface isolation demonstrates a practical version of this principle.

**Best practice:** least privilege should exist in actual workspace, process, tool, and credential boundaries.

### Insight 13: workers should be disposable

ClawTeam recycles execution capacity; OMC separates identity/capability from execution container.

**Best practice:** preserve semantic identity and evidence, not necessarily the worker process.

## Layer 7 — Evaluation

### Insight 14: evolution needs held-out evaluation

Meta-Team uses Evolve -> Freeze -> Test with holdout data. SwarmAgentic preserves candidate states and metrics for evaluation.

**Best practice:** never evaluate a change only on the experiences that created it.

## Layer 8 — Self-evolution

### Insight 15: evolve at multiple scopes

Meta-Team explicitly distinguishes agent-level, interaction-level, and team-level evolution.

**Best practice:** identify the smallest scope that explains a failure before changing anything broader.

Potential Ω scopes:

`AGENT_LOCAL`
`RELATIONSHIP`
`TEAM_COORDINATION`
`TEAM_COMPOSITION`
`CONSTITUTION`

### Insight 16: friction should become structured experience

Swarm Skills turns redundant communication, circular dependencies, and premature termination into reusable evolution records.

**Best practice:** instrumentation should produce machine-readable friction classes rather than only logs.

## Layer 9 — Governance

### Insight 17: self-evolution should propose, evaluate, and promote

Several sources permit automated modification of team behavior or organization. Ω needs a stronger authority boundary.

Preferred pattern:

`observe -> diagnose -> propose -> evaluate -> authorize -> promote -> rollback-capable version`

The resident can initiate an improvement. The improvement does not become Ω law merely because a model proposed it.

### Insight 18: performance and authority remain separate

A better benchmark result does not itself create authority over identity, canonical data, policy, or Ω law.

**Best practice:** evaluate operational quality and authorization independently.

## Layer 10 — Evolution memory

The sources converge on preserving more than raw logs. Useful units include:

`experience -> failure -> cause -> friction -> proposed change -> evaluation -> promotion -> rollback`

**Best practice:** preserve the evolution lineage itself.

## Layer 11 — Anti-patterns to avoid

### A. Giant global transcript
Centralizing all experience into one analysis context recreates context overload.

### B. Session tree as complete Work model
Execution hierarchy does not fully represent dependencies, ownership, or acceptance.

### C. Static coordination forever
Recurring friction should become learnable coordination experience.

### D. Self-modification without rollback
Evolution must have versioning, curation, and recovery.

### E. Benchmark score as complete truth
Operational performance is only one dimension of Ω validity.

## Layer 12 — What should influence the Ω roadmap

### Near-term

1. governed native Task delegation;
2. explicit worker capability profiles;
3. work/evidence lineage separate from session lineage;
4. result acceptance distinct from execution completion;
5. physical worker isolation;
6. compact resident control primitives.

### Next

7. resident-local evolution memory;
8. causal cross-resident evidence exchange;
9. portable coordination assets;
10. held-out evolution evaluation;
11. promotion and rollback of evolved assets;
12. team-change proposals.

### Later Ω self-evolution

13. candidate organization generation;
14. comparative team evaluation;
15. automatic friction mining;
16. evolution-record curation;
17. organization composition/recomposition;
18. governed promotion into the live team.

## Highest-confidence practices

1. **Separate identity from runtime.**
2. **Separate execution lineage from Work dependency.**
3. **Separate completion from acceptance.**
4. **Let the problem owner decide demand; let policy decide authority.**
5. **Use physical isolation, not just instructions.**
6. **Preserve local context and connect it causally.**
7. **Make coordination versionable.**
8. **Turn friction into structured evolution experience.**
9. **Evaluate evolution on held-out work.**
10. **Make self-evolution reversible and governed.**

## Core synthesis

> **A self-evolving resident team should not be one giant mutable agent system. It should be a set of durable identities operating through replaceable capabilities and bounded runtimes, connected by explicit coordination, producing evidence, and evolving through versioned, evaluable, reversible changes.**

That is the research pattern most compatible with Ω.