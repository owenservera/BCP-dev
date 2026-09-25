# VIVIM Agentic Core — Deterministic Automation Foundation

> Classification: DERIVED — RESEARCH / DESIGN WORKSPACE
> Status: PROPOSED — archaeology + design convergence pending
>
> This workspace defines the research boundary for VIVIM's deterministic-first agentic automation substrate.

## Purpose

VIVIM needs an agentic runtime even when no AI model is present.

A user must be able to express a goal, capability, workflow, automation, schedule, trigger, or durable Work and have VIVIM execute it deterministically under policy, recover it, inspect it, pause it, resume it, retry it, cancel it, verify it, and preserve what happened.

AI providers should later be able to improve interpretation, planning, context selection, diagnosis, or proposal generation. They must not be required for the core execution substrate.

## Core proposition

> **Agentic means durable, stateful, goal-directed execution. It does not mean LLM-driven execution.**

The target relationship is:

`World Object → Intent → Capability → Plan → Work → Step Execution → Evidence → World Update`

with optional:

`AI → interpretation / planning / proposal]

rather than:

`AI → authority / execution`

## Scope

Characterize and design the minimum VIVIM-native substrate for:

- deterministic plans;
- workflows and reusable compositions;
- durable Work;
- steps and dependencies;
- scheduling and temporal triggers;
- event triggers;
- queues and worker execution;
- retries and backoff;
- checkpoints and restart;
- idempotency / duplicate-effect protection;
- cancellation;
- waiting;
- human approval / input gates;
- budgets and limits;
- resource leasing / concurrency;
- compensation where required;
- verification;
- replay / branching;
- observability and execution history;
- artifacts/results;
- attention/continuity;
- optional agent identity and reusable agent configuration;
- optional sub-work / delegation;
- sandboxed local execution;
- deterministic context assembly.

## Explicit non-goals

Do not create:

- a second ontology;
- a second provenance system;
- a second authority model;
- a second cooperative-agent system;
- an LLM-dependent execution engine;
- an autonomous self-authorizing system;
- a new provider architecture;
- a browser-first design.

Browser/provider realization is one future capability family.

## Canonical-world integration

This work extends the existing canonical object model.

Candidate first-class world objects:

- AgentDefinition — reusable actor/configuration identity, if evidence supports it;
- WorkflowDefinition — reusable deterministic composition;
- Automation — trigger/binding for Work or Workflow;
- Schedule / Trigger — durable activation condition;
- Work — durable execution/outcome identity;
- Plan — versioned execution intent/graph associated with Work;
- Artifact / Document / File — durable outputs;
- Attention / StandingIntent — user-facing continuity over ongoing or recurring Work.

Do not assume all of these should become independent persistent objects. The research must determine the correct semantic boundaries.

## Success

The design should let VIVIM perform useful agentic automation locally with zero AI provider and zero browser dependency, while leaving a clean insertion point for AI later.

The final design must explain:

`what the user means → what is durable → what executes → who/what may execute → how it recovers → what evidence proves it → how the world changes → how the user returns to it`
