# Modern Harness Research — Evidence Plan

This file is a research instruction, not a preselected architecture.

## Investigate the recurring primitives

Across current agentic systems, identify evidence for:

- agent/run/session identity;
- tool/capability invocation;
- agent loop;
- workflow/graph execution;
- persistent state;
- checkpointing;
- resumability;
- interruptions;
- human approval;
- permissions;
- sandbox/compute isolation;
- context management;
- memory;
- scheduling/background execution;
- retries;
- task queues/workers;
- concurrency controls;
- tracing;
- replay/evaluation;
- subagents/child work;
- filesystem state;
- skills/instruction packages;
- model/provider abstraction.

For each primitive record:

`system → concrete mechanism → semantic value → VIVIM translation candidate → what VIVIM should reject`

## Current reference families

OpenAI's current agent material distinguishes the model/agent loop from the execution environment and exposes tools, approvals, tracing, state, sandbox execution and background/continuation patterns. The current documentation also says the older Agents SDK is maintenance-mode while the newer Agents API is the starting point for new applications. citeturn118947search0turn118947search1turn118947search3turn118947search5

LangGraph/Deep Agents provide useful evidence around explicit graph/state boundaries, checkpoint persistence, interrupts, retries, filesystem-backed context, subagents, permissions and human-in-the-loop execution. citeturn634269search0turn634269search2

Temporal provides the strongest non-agent-specific evidence for durable execution, recovery, task queues, worker capacity, timers/signals and durable parent/child workflow relationships. citeturn230700search1turn230700search0turn230700search2

Anthropic's Claude Code interface supplies useful evidence around resumable sessions, permission modes and programmatic output. citeturn634269search4

Do not copy any of these architectures. Extract the invariant mechanisms.

## Research red flags

Treat as suspect:

- “agent” used to mean everything from prompt to worker to run;
- state hidden in framework internals;
- model calls treated as the source of execution truth;
- durable state mixed with conversational history;
- approval represented only in UI;
- retries without idempotency semantics;
- arbitrary graph engines introduced where simple Work state machines suffice;
- subagents introduced before child Work semantics are understood;
- cloud control planes required for local-first guarantees.

## Required comparison output

Produce a comparison table with columns:

`Primitive | System | Concrete mechanism | Durable? | Deterministic? | Human gate? | Recovery? | Resource control? | VIVIM semantic candidate | VIVIM rejection`
