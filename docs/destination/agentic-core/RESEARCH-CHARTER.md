# Research Charter — Deterministic-First Agentic Core

## Mission

Deeply characterize the minimum reusable execution substrate VIVIM needs to support modern agentic automation while remaining deterministic-first, local-first, governed, durable, and compatible with later AI providers.

This is a research/design task, not a greenfield framework exercise.

## Primary questions

1. What is an Agent in VIVIM if an LLM is absent?
2. What is the semantic difference between Agent, Workflow, Automation, Work, Plan, Step, Task, Run, Attempt and Capability?
3. Which of these are canonical world objects, which are execution records, and which are projections or ephemeral runtime state?
4. What survives process restart?
5. What is the durable identity of a Work?
6. Where is the checkpoint boundary?
7. How is duplicate external effect prevented after a crash?
8. Which failures retry automatically, which pause, which compensate, and which require a human?
9. How do time triggers, event triggers, manual triggers and dependency triggers wake work?
10. Can “sleeping compositions” run with no canvas open?
11. How are workers, queues, slots and resources represented?
12. How do concurrency limits and leases interact with Work?
13. How do human approval/input/selection gates pause and resume exact Work state?
14. How do budgets, deadlines, iteration limits and resource limits behave?
15. What does deterministic verification mean?
16. What is replay, and when is replay safe?
17. How can a Work produce or modify canonical World Objects?
18. How are Artifacts/Documents/Files attached to Work without duplicate truth?
19. How does Attention/standing intent connect long-running Work to the human experience?
20. What can an Agent delegate to another Agent without creating a second authority system?
21. What is a Skill relative to a Capability and Workflow?
22. What is the minimum sandbox/compute boundary for local deterministic execution?
23. Where can AI later enter without becoming a hidden execution authority?
24. What must be provider-neutral?
25. What must remain implementation-specific?
26. Which Legacy mechanisms should be harvested?
27. Which modern harness ideas are genuinely generic versus vendor-shaped?
28. What is the smallest useful V1 implementation?
29. Which semantic questions cannot be closed without external/provider reality?
30. Which pieces can be implemented and tested entirely locally now?

## Required distinctions

Investigators must test, not assume:

`Agent ≠ Work ≠ Workflow ≠ Plan ≠ Run ≠ Step ≠ Capability ≠ Tool ≠ Skill ≠ Trigger`

and:

`Plan ≠ Authority`

`Execution ≠ Evidence`

`AI proposal ≠ execution authority`

`Schedule/Trigger ≠ Work`

`Surface ≠ canonical automation state`

## Required external research

Use current primary documentation and implementation evidence for modern systems, including as appropriate:

- OpenAI Agents / Responses / Codex harness patterns;
- Anthropic Claude Code / Agent SDK patterns;
- LangGraph / Deep Agents;
- Temporal durable workflows;
- OpenHands;
- other materially different modern runtimes selected by the investigator.

The point is comparative extraction of primitives, not framework shopping.

Record publication/currentness dates and distinguish product claims from observed implementation behavior.

## Required Legacy archaeology

Characterize, at minimum:

- ActionPlan / compiler / bridge;
- Plan Validation Gate;
- AutonomousGoal / AutonomousTask / AutonomousStep;
- HITL gates;
- budgets;
- AutonomousExecutionEngine;
- AutonomousReplay / branching;
- WorkflowDefinition / Node / Edge;
- WorkflowCompiler;
- WorkflowEngine;
- retry queue;
- AutomationSchedule / AutomationRun;
- scheduler;
- objective engine;
- execution policy;
- execution memoization;
- outcome tracking;
- background execution;
- agent builder / agentic loop;
- relevant storage contracts and schemas.

Legacy behavior is evidence and harvest material, not destination law.

## Exit condition

A useful conclusion must show the smallest VIVIM-native substrate that supports:

`trigger → durable Work → deterministic plan → governed step execution → checkpoint → result/evidence → world update → continuity`

and explain precisely where AI can later plug in.
