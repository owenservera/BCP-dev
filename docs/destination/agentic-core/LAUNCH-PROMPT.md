# Launch Prompt — VIVIM Deterministic-First Agentic Core Research

You are opening a dedicated deep research/design task for VIVIM.

Repository:

https://github.com/owenservera/BCP-dev

Clone the repository and work from the current `main`.

This is **one focused task**:

> Determine and design the core agentic automation substrate VIVIM needs even when no AI provider and no browser are available.

Do not implement production code during this research phase.

## First read

Read:

1. `docs/destination/NORTH-STAR.md`
2. `docs/destination/FOUNDATIONAL-PRINCIPLES.md`
3. `docs/destination/CONCEPTUAL-MODEL.md`
4. `docs/destination/DESTINATION-MASTER-MAP.md`
5. `docs/destination/BUILD-AND-HARVEST-PLAN.md`
6. `docs/destination/INTERACTION-INTENT-WORK-RECONCILIATION.md`
7. `docs/destination/AGENCY-BACKGROUND-ATTENTION-RECONCILIATION.md`
8. `docs/destination/DATA-MEMORY-CONTEXT-RECONCILIATION.md`
9. `docs/destination/agentic-core/README.md`
10. `RECONCILIATION-MAP.md` and the latest System Intelligence Pass 1–3 artifacts available in the repository.
11. Relevant Ω runtime/plugin/evidence/law/authority/work files.
12. Legacy VIVIM files identified in `LEGACY-HARVEST-MAP.md`.

## Critical framing

Do not build another agent operating system.

Do not make “agent” the universal noun.

Do not assume an LLM is required.

VIVIM's core should be deterministic-first:

`trigger → intent/target → capability → plan → governed execution → evidence → world update`

AI later becomes an optional planner, interpreter, researcher, diagnostician, proposal generator or other bounded capability.

## Deep research requirement

Study both:

### Legacy VIVIM

Characterize the existing:
- ActionPlan;
- plan validation;
- autonomous task/step model;
- HITL gates;
- budgets;
- execution engine;
- replay/branching;
- workflow DAG/compiler/runtime;
- automation scheduler;
- retry queue;
- objective/outcome;
- background execution;
- agent loop;
- relevant storage contracts.

### Modern agentic/runtime systems

Use current primary sources and implementation evidence to investigate materially different systems, including:

- OpenAI Agents / Responses / Codex harness patterns;
- Anthropic Claude Code / Agent SDK;
- LangGraph / Deep Agents;
- Temporal;
- OpenHands;
- at least 1–2 additional systems if they add a genuinely different primitive.

Do not rank frameworks.

Extract primitives.

For each primitive ask:

> Is this actually a reusable systems concept that VIVIM needs, or merely a framework implementation choice?

## Canonical World requirement

This work must explicitly extend the canonical World/Object model already being developed.

Determine the correct semantic boundaries for:

- AgentDefinition;
- WorkflowDefinition;
- Automation;
- Trigger/Schedule;
- Work;
- Plan;
- Step;
- Attempt;
- Artifact/Document/File;
- Attention/Standing Intent.

Do not assume they all deserve separate persistent entities.

The goal is to prevent agentic infrastructure from becoming a parallel data model.

## Core investigation

Characterize the full lifecycle:

`CREATE → DEFINE → VALIDATE → AUTHORIZE → SCHEDULE/TRIGGER → START → EXECUTE → VERIFY → CHECKPOINT → WAIT/RETRY → COMPLETE/FAIL/REFUSE/CANCEL → EVIDENCE → WORLD UPDATE → CONTINUE/REVIEW`

Investigate:

- idempotency;
- duplicate external effect protection;
- retries;
- compensation;
- crash recovery;
- checkpoint boundaries;
- human approval/input;
- budgets;
- deadlines;
- worker capacity;
- queue semantics;
- concurrency;
- resource leasing;
- temporal/event triggers;
- sleeping compositions;
- context snapshots;
- sandbox execution;
- deterministic verification;
- replay and branching;
- child Work/delegation;
- observability;
- attention/continuity.

## Important philosophical constraint

Separate:

`GOAL`

`PLAN`

`AUTHORITY`

`EXECUTION`

`EVIDENCE`

An Agent/Plan cannot grant itself authority.

A successful execution is not automatically proof of desired truth.

AI output is never authority.

A scheduler can wake Work but cannot authorize it.

A surface can display Work but cannot become its canonical state.

## No-browser path

Design and test the entire local deterministic substrate without browser access.

At minimum, define deterministic capabilities such as:

- create/read/update local objects;
- transform data;
- create artifacts;
- filesystem operations within a governed sandbox;
- schedule Work;
- wait;
- retry;
- verify;
- checkpoint;
- export/restore;
- user approval/input.

Browser and provider realizations become later capability implementations.

## Required synthesis

Produce:

1. `RESEARCH-SYNTHESIS.md`
2. `MODERN-PRIMITIVES.md`
3. `LEGACY-HARVEST.md`
4. `CANONICAL-MODEL.md`
5. `RUNTIME-DESIGN.md`
6. `STATE-AND-RECOVERY.md`
7. `TEMPORAL-SUBSTRATE.md`
8. `RESOURCE-AND-CONCURRENCY.md`
9. `AUTHORITY-AND-HUMAN-GATES.md`
10. `AI-INSERTION-BOUNDARY.md`
11. `WORLD-WORK-ATTENTION-INTEGRATION.md`
12. `MINIMUM-V1-SUBSTRATE.md`
13. `EXPERIMENT-REPORT.md`
14. `OPEN-FRONTIER.md`
15. `RED-TEAM.md`

Also create machine-readable:

- `indexes/PRIMITIVES.json`
- `indexes/OBJECTS.json`
- `indexes/STATE-TRANSITIONS.json`
- `indexes/DEPENDENCIES.json`
- `indexes/EVIDENCE.json`

## Final question

End with one answer:

> **What is the smallest deterministic VIVIM agentic substrate that gives the product durable automation, recovery, scheduling, verification, human governance and continuity — while allowing AI providers to be added later without replacing the core?**

Do not answer with a framework recommendation.

Answer with VIVIM primitives, boundaries, evidence, experiments and build consequences.

Label conclusions:

- OBSERVED
- EVIDENCE-SUPPORTED
- DESIGN-CANDIDATE
- EXPERIMENT-REQUIRED
- UNRESOLVED
- REJECTED
- PROMOTION-CANDIDATE

No production-code changes until the design synthesis is reviewed.


## Mandatory repository landing requirement

**The research package is not complete when it exists only in the agent workspace, chat output, or a downloadable bundle.**

Before declaring the task complete, you MUST:

1. Write all required research/design deliverables into this repository under:
   `docs/destination/agentic-core/`
   using the output structure defined by `README-OUTPUTS.md`.
2. Include the required synthesis, indexes, evidence/source register, experiment results and any supporting artifacts.
3. Update `STATE.md` with the final research status and exact commit SHA.
4. Commit the complete research package to your research branch.
5. Return the commit SHA and the exact repository paths of the key deliverables.
6. Open/update the PR from that branch so the research is reviewable in GitHub.

A ZIP/downloadable bundle may also be produced, but it is **secondary**. The repository commit is the canonical landing place for this research.

If local cloning is unavailable, use the accessible repository interface/API against the exact pinned commit and still complete the GitHub commit/PR requirement. Do not stop merely because a literal local clone could not be performed.

Do not claim repository completion until the required files are actually committed and visible on the branch.
