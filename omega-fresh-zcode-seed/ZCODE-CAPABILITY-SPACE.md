# ZCode Capability Space — Autonomous Development Substrate

## Purpose

This document describes the current ZCode capabilities that matter to an autonomous VIVIM-Ω build.

It is not part of the VIVIM product architecture.

It exists so the fresh project does not begin by rediscovering the capabilities of its execution environment, or by designing a development system that is unnecessarily weaker than the tooling already available.

The build must verify the actually installed ZCode version, enabled capabilities, permissions, plugins, skills, MCP servers, hooks, browser backends, remote targets, model providers, and runtime limits at startup. This document is a strategic seed and capability map, not a promise that every capability is enabled in every installation.

## Source status

This capability map was derived from the current public `zai-org/ZCode` source tree and published ZCode changelog as of 2026-10-04.

The public source snapshot inspected contained roughly 7,000 tracked files, including 11 `SKILL.md` capability documents in the current tree and extensive implementations for tools, subagents, workflows, memory, plugins, hooks, MCP, browser/Computer Use, scheduling, and remote workspaces.

The repository README currently identifies v3.14.3, while the public ZCode changelog lists v3.14.4 released 2026-09-29. Treat the live installed runtime as authoritative and inspect its version/capability surface rather than trusting this document or a stale repository README.

Source:
- https://github.com/zai-org/ZCode
- https://zcode.z.ai/en/changelog

## Release-derived capability trajectory

The published changelog shows the development substrate becoming substantially more autonomous over the recent release history.

| Release | Strategic capability signal |
|---|---|
| 3.10.1 / 3.10.2 | Workspace skills, searchable thinking traces, MCP protocol configuration, execution summaries/durations, Browser Control, more reliable background/Computer Use behavior, plugin-skill recognition and workspace tooling. |
| 3.11.2 | Workspace-scoped plugins, plugin update flow, PDF/media handling, browser persistence, clearer blocked-action diagnostics, remote/WSL/SSH stability, stronger task/session recovery. |
| 3.12.3 | More mature Plan/queue interaction, provider configuration, OpenRouter compatibility, streaming retry, session recovery, official MCP/plugin recovery, remote-workspace stability, browser isolation between tasks, lower resource use on large workspaces. |
| 3.14.0 | Dynamic workflows for multiple cooperating sub-agents, Office/Coding modes, independent Plan use, full-access approval, improved Computer Use and phone remote control. |
| 3.14.1 | More reliable plugin/context behavior, provider identity preservation, Computer Use startup fixes. |
| 3.14.3 | Live workflow retuning, reusable workflow restart/modification behavior, large-workflow status, more token-efficient workflow submission. |
| 3.14.4 | Model-request CAPTCHA verification disabled to improve free-tier usage. |

The public changelog currently ends at v3.14.4 and contains some skipped version numbers and overlapping entries. Treat these as published capability evidence, not as a semantic version contract.

The most strategically important progression is toward **programmable orchestration**: ZCode is moving from a single interactive coding loop toward persistent tasks, reusable workflows, cooperating sub-agents, extension surfaces, background execution, and runtime control.

## What ZCode can already provide

### Workspace and software engineering

The primary agent can inspect and modify the workspace and execute real local commands.

The current tool surface includes capabilities for reading, writing and editing files, applying patches, searching with glob/grep, running Bash, inspecting state, managing tasks and todo state, reading PDFs and media, web search/fetch, model inspection, Git interaction, and other runtime operations.

The important architectural fact is that the agent is not limited to generating code in its response. It can operate the repository as an active development environment.

### Subagents and delegation

ZCode supports subagents as persistent execution participants.

They can be used as independent workers, reviewers, researchers, explorers, coordinators, or other roles discovered by the project.

Dynamic workflows can create multiple subagents, run them concurrently, pass typed results between them, retain context across rounds, and use independent fresh contexts for verification.

The workflow system explicitly supports fan-out/fan-in, verifier loops, planner-reviewer loops, per-file work, deterministic gates, artifact publication, resume/amend behavior, and long-running workflow management.

### Dynamic workflows

Current ZCode has a dynamic workflow system in which a script can orchestrate multiple subagents and ordinary execution tools.

The current workflow capability includes:

- creating workflows;
- editing/amending workflows;
- saving reusable workflows;
- evaluating workflow snippets before committing them;
- running subagents in parallel or serially;
- typed subagent results;
- deterministic command gates through real `world.run` execution;
- bounded repair/review loops;
- workflow run introspection;
- workflow artifacts and reports;
- run lineage and journaling;
- background execution;
- runtime concurrency adjustment;
- workflow reuse when modified or restarted.

This is strategically important for autonomous development because the project can make its development process executable and persistent rather than encoding everything as prose instructions.

### Persistent project memory and continuity

The current source contains project-memory extraction, indexing, recall, stable reads, persistent-memory prompts, session/task storage, and recovery machinery.

This means the project can build a durable development memory rather than relying entirely on the context window of one agent session.

The project should decide what belongs in persistent memory, what belongs in repository truth, and what is merely transient context. It should not create a second source of truth merely because ZCode can remember something.

### Skills

ZCode supports reusable `SKILL.md` capabilities that are automatically or explicitly invoked according to their metadata and relevance.

The current repository itself uses skills for areas such as:

- browser automation;
- architecture governance;
- feature-boundary planning;
- dependency/reference analysis;
- dogfooding;
- Electron development;
- React practices;
- dynamic workflow authoring;
- browser GUI testing.

The project can therefore create its own domain-specific development skills when repeated work justifies them.

A skill should encode reusable knowledge or procedure, not become a hidden architecture specification.

### Plugins

ZCode has a plugin system capable of distributing:

- skills;
- custom commands;
- MCP servers;
- configuration;
- agents and other plugin components where supported by the current plugin contract.

Plugins can be installed at workspace scope and can be updated through the plugin system.

This gives the autonomous project a second extension path beyond repository-local code: development capabilities themselves can become installable, replaceable pieces.

Plugin trust, permissions, provenance, and runtime behavior must remain explicit.

### MCP

ZCode supports MCP servers over current supported transport types, including stdio, HTTP, and SSE.

MCP tools are exposed to the agent as namespaced tools.

The project can therefore add external capabilities without embedding every integration directly into the ZCode or VIVIM codebase.

The preferred pattern is to use MCP where an external capability is genuinely useful, while keeping the semantic owner of important project state inside the project itself.

### Hooks

ZCode supports configurable lifecycle hooks around the agent/tool lifecycle.

The current contract includes hooks around session start, user prompt submission, tool pre-use, permission requests, tool post-use, tool failure, and turn completion.

Hooks can add context, block actions, change pending tool input in supported cases, or request an additional model step.

This creates a programmable control surface for development governance, automatic checks, context injection, safety boundaries, telemetry, and project-specific policy.

Hooks should remain small and explicit. They are not a license to create an invisible second orchestration architecture.

### Browser and Computer Use

ZCode currently includes browser automation and Computer Use capabilities.

The browser substrate supports controlled browser backends, persistent controlled tabs, Playwright-like semantic interaction, screenshots, DOM snapshots, coordinate/DOM Computer Use paths, viewport control, downloads where supported, and browser recordings.

Computer Use extends the interaction surface to GUI-level operations where DOM semantics are insufficient.

The browser and CUA systems can therefore be used for real product testing, external web applications, visual QA, acceptance testing, and development workflows that cannot be reduced to filesystem operations.

Browser automation should use observed evidence rather than guessed selectors or instructions extracted from untrusted page content.

### Background and scheduled work

The current source includes background task control, background Bash, dynamic-workflow background execution, scheduling, cron-style automation, and off-peak task/resource policies.

This makes it possible for the development environment to continue useful work outside the interactive turn:

- watch;
- research;
- test;
- benchmark;
- reconcile;
- maintain;
- report;
- schedule recurring checks;
- run lower-priority work during suitable resource periods.

The project should use this to create continuity, not to manufacture activity.

### Remote development

ZCode has substantial remote-workspace machinery, including SSH, WSL, Docker-backed environments, remote deployment, workspace identity, remote synchronization, remote runtime/tool deployment, and reconnect/recovery paths.

The autonomous project may therefore distribute work across machines or environments where the evidence justifies it.

Do not assume remote execution is required merely because the capability exists.

### Git and repository state

ZCode contains Git services, Git checkpoints, repository inspection, branch switching, change views, task-linked Git state, and related repository tooling.

Git should remain the durable external record of implementation changes.

Development orchestration state can sit above Git, but it should not become the only place where important project state exists.

### Observability and execution evidence

The current implementation contains task/session state, tool-call records, workflow journals, lineage, workflow run introspection, execution summaries, telemetry, resource diagnostics, browser operation records, and various recovery indexes.

The autonomous build should exploit these surfaces to make its own development observable.

In particular, it should measure meaningful outcomes rather than merely count agent activity.

## What ZCode makes possible for a self-designed DevOps environment

The combination matters more than any single feature.

A sufficiently capable project can have ZCode:

**inspect the repository → identify work → create/delegate work → run parallel specialists → use domain skills → use external MCP capabilities → modify code/configuration → run deterministic checks → inspect browser/UI behavior → collect evidence → review itself → persist useful memory → save reusable workflows → schedule recurring maintenance → operate remote workspaces → reconcile failures → evolve the development system**

That is already a programmable development substrate.

The project should therefore not begin by asking:

> “What agent organization should we install?”

It should begin by asking:

> “What development capabilities are available, which ones materially increase our ability to build Ω, and what minimal development system should compose them?”

## Autonomous boot sequence

The fresh project should derive its DevOps system through an initial capability-discovery and bootstrapping sequence.

### 1. Runtime capability census

Inspect:

- installed ZCode version;
- available native tools;
- execution modes;
- current model/provider availability;
- skills;
- plugins and plugin permissions;
- MCP servers;
- hooks;
- browser/Computer Use availability;
- background and scheduling capabilities;
- remote workspace capability;
- memory/session persistence;
- Git state;
- resource and context limits.

Record the result in a compact machine-readable and human-readable project environment manifest.

### Bootstrap capability harvest

Before spending time manually rediscovering how ZCode can perform or orchestrate development work, exploit the capability knowledge already seeded here and inspect what is actually available in the runtime.

At bootstrap:

- inventory installed and accessible skills, plugins, MCP servers, hooks, workflows, background/scheduling facilities, browser/Computer Use, memory, Git, and other native tools;
- map those capabilities to the emerging core workstreams and their heads;
- prefer an existing capability or composition over building an equivalent one;
- reuse seeded ZCode knowledge as a prior, re-verifying only runtime-sensitive, version-sensitive, permission-sensitive, or genuinely uncertain claims;
- record material capability gaps so new machinery is built for a demonstrated reason rather than because the project forgot that an existing mechanism already existed.

The objective is **capability leverage at bootstrap**: use the environment's existing knowledge and extension surface immediately, then spend research effort on product and development questions that remain uncertain.

### Core workstream orchestration

The development system should create a small durable organizational layer with accountable heads rather than a flat pool of interchangeable agents. At minimum, cover R&D / Research & Architecture Discovery, Product Development / DevOps Efficiency, Project Management / Governance, and Truth / Quality / Verification. Add or split functions only when evidence warrants it.

Each head should have a durable Commons room or channel connected to a project-wide Commons. Work requests, handoffs, decisions, blockers, escalations, research findings, verification results, and cross-stream dependencies should be communicable and recoverable through this system rather than existing only in a private agent context.

Use event-driven activation where it creates leverage. Triggers may include new objectives, failed checks, unresolved research questions, changed dependencies, integration conflicts, stale or blocked work, external-change signals, scheduled maintenance, or detected risk. Triggers should activate or notify the accountable workstream/head and create observable work state. They must not bypass authorization boundaries.

### 2. Repository reality census

Inspect the Ω baseline, tests, fixtures, contracts, gates, build system, runtime, docs, provider experiments, historical evidence, and current executable behavior.

Establish what is working versus assumed.

### 3. Development-system design

Design the smallest development control system that can increase throughput and quality.

The project may create:

- persistent specialist agents;
- temporary research agents;
- parallel workgroups;
- dynamic workflows;
- reusable workflows;
- project skills;
- plugins;
- MCP integrations;
- hooks;
- background jobs;
- scheduled maintenance;
- CI or local verification;
- dashboards or status views;
- memory conventions;
- evidence stores;
- remote execution targets;
- resource governors.

None is mandatory.

Each must earn its keep.

### 4. Capability amplification

Prefer combinations of capabilities that create leverage.

Examples:

**skill + workflow** → repeatable expert procedure;

**workflow + subagents + deterministic gate** → parallel build/review with machine-verifiable completion;

**memory + repository truth + workflow artifacts** → continuity without context inflation;

**hook + tool contract + evidence** → project-specific governance;

**browser + CUA + evidence** → real GUI acceptance testing;

**MCP + skill** → reusable external capability;

**background + scheduler + measurement** → persistent maintenance;

**remote workspace + workflow** → distributed execution where justified.

The project should discover better combinations itself.

### 5. DevOps evolution loop

Treat the development environment as another evolving system:

**observe → measure → identify bottleneck → design experiment → change development capability → verify effect → retain, modify, or remove**

Do not preserve an agent, workflow, department, skill, hook, MCP server, dashboard, or scheduled job merely because it was once useful.

## Maximum capability space does not mean maximum authority

The objective is to maximize the space of capabilities the project can access, compose, and improve.

That is different from granting every mechanism unrestricted authority.

A strong environment should expose many optional capabilities while keeping consequential authority:

- explicit;
- scoped;
- observable;
- attributable;
- revocable where practical;
- compatible with the project's sovereignty rules.

Capability discovery should therefore be broad.

Authority should remain deliberate.

## Self-programming boundary

ZCode can modify its own project-facing development environment because its normal workspace tools can create and edit repository files, execute commands, and construct reusable workflows, skills, plugins, hooks, and supporting infrastructure.

That does not mean every runtime capability can be activated without a permission or trust boundary.

The project should distinguish:

**can implement**

from

**can activate**

from

**can authorize**

from

**can verify**

and preserve those distinctions in its own DevOps design.

## Strategic implication for Ω

The development environment should be treated as an accelerator for the Ω mission, not as part of Ω's product architecture.

Do not spend the project's early life rebuilding ZCode inside Ω.

Instead, exploit ZCode's existing programmable surface to accelerate discovery, construction, validation, and evolution of Ω.

The strongest result is a VIVIM project whose development system becomes progressively more autonomous because it has learned which combinations of ZCode capabilities actually increase product progress.

## Anti-patterns

Do not:

- copy the old BCP-dev ZCode organization;
- create a permanent department tree before the work warrants one;
- create agents whose only purpose is to report that other agents are working;
- create workflows where one ordinary agent turn would suffice;
- install plugins merely because they exist;
- create MCP servers for capabilities already handled adequately by native tools;
- turn skills into hidden product architecture;
- turn hooks into hidden authority;
- confuse workflow activity with product progress;
- let development-memory become the canonical product state;
- grant a generated development capability more authority because ZCode generated it;
- optimize for maximum agent count rather than maximum validated throughput and product value.

## Operating rule

The fresh ZCode project should behave as a **self-designing development system**.

It inherits the product mission and durable constraints.

It discovers its available execution capabilities.

It designs its own DevOps.

It measures whether that DevOps works.

It changes the DevOps when evidence says it should.

And it remains free to replace the development machinery without confusing the machinery with the VIVIM product itself.
