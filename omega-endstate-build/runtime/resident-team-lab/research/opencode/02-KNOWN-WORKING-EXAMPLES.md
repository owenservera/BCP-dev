# Known-Working OpenCode Examples

> Purpose: retain practical implementations that demonstrate actual OpenCode integration patterns.

## K01 — vendored opencode-swarm

**Local path**

`../../vendor/opencode-swarm/`

**Upstream**

https://github.com/ibraheem-111/opencode-swarm

### What it demonstrates

- OpenCode official plugin system integration;
- `@opencode-ai/sdk` driven sessions;
- multiple agent sessions in parallel;
- shared SQLite memory;
- inter-agent messaging;
- persistent swarm state;
- resume;
- JSON event output;
- cost/token accounting;
- notifications;
- MCP control surface.

Its README states explicitly that it does not fork OpenCode and instead builds on the official plugin system and SDK.

### Local proof assets

| Asset | Path |
|---|---|
| Design | `../../vendor/opencode-swarm/docs/specs/2026-06-09-opencode-swarm-design.md` |
| Example | `../../vendor/opencode-swarm/examples/swarm.json` |
| Real E2E | `../../vendor/opencode-swarm/tests/e2e.test.ts` |
| Orchestration unit tests | `../../vendor/opencode-swarm/tests/orchestrator.test.ts` |
| MCP tests | `../../vendor/opencode-swarm/tests/mcp.test.ts` |
| Memory tests | `../../vendor/opencode-swarm/tests/memory.test.ts` |
| State tests | `../../vendor/opencode-swarm/tests/state.test.ts` |

### Particularly useful evidence

The E2E test actually starts a real `opencode serve` and checks that two agents share memory and pass a message.

The repository also contains Windows-specific lifecycle corrections: database handles are explicitly closed before removing temporary SQLite directories because WAL/SHM sidecars can remain locked on Windows.

This is a high-value local substrate because it is **already retained inside this build** and can remain a fallback even while native Task experiments evolve.

### What it does not prove

It does not prove:

- Ω authority semantics;
- durable resident identity;
- bounded delegation by semantic role;
- acceptance semantics;
- safe arbitrary Task resume;
- native OpenCode Task as the child-creation primitive.

It is a practical execution/orchestration reference, not Ω law.

## K02 — oh-my-opencode

Upstream:
https://github.com/lovicho/oh-my-opencode

Orchestration guide:
https://github.com/lovicho/oh-my-opencode/blob/dev/docs/guide/orchestration.md

### What it demonstrates

The current guide describes:

- the main session acting as the orchestrator;
- delegation through OpenCode's Task tool;
- background child work;
- named specialists and model/category routing;
- dependency-aware workflow runs;
- team mode for overlapping lanes that need communication;
- task send/output/cancel operations;
- specialist skills loaded into children.

This is valuable because it shows a more OpenCode-native orchestration model than a separate swarm daemon.

### Research value

It provides a living comparison point for the question:

> How much resident-team behavior can be expressed through OpenCode-native primitives before Ω needs its own coordination layer?

### What it does not prove

Its orchestration abstractions optimize for its own workflow model. They are not evidence that Ω should copy team mode, routing, or lifecycle semantics unchanged.

## K03 — current OpenCode command/subagent facilities

Current command documentation:
https://opencode.ai/v2/docs/commands

Current docs show commands can select an agent/model and can explicitly launch a background child session.

This matters because U1 must reason about **all execution surfaces**, not only the Task tool.

## K04 — VIVIM Resident Team Lab

Local:

- `../../config/opencode.team-lab.jsonc`
- `../../plugin/resident-team.ts`
- `../../docs/CHECKPOINTS.md`
- `../../docs/FIRST-MAJOR-UPGRADE-DESIGN.md`

### Current status

This is an **experimental observation layer**.

The current plugin records Task/session events but does not yet constitute proven governed delegation.

That distinction is intentional and must remain explicit until the corresponding checkpoint passes.

## Practical comparison

| Capability | opencode-swarm | oh-my-opencode | Resident Team Lab U1 |
|---|---:|---:|---:|
| Multiple agent sessions | Proven locally | Demonstrated | Target |
| Shared persistent state | Proven locally | Workflow/team mechanisms | Future |
| Native Task as spawn primitive | Not primary | Primary | Primary |
| Resident decides worker demand | Config/orchestrator driven | Main session orchestrates | Explicit U1 target |
| Governance gate before Task | No Ω gate | Framework-specific | U1 target |
| Stable Ω identity | No | Framework-specific | Explicit requirement |
| Physical worker boundary | Work/process based | Team/workflow based | Must be proven |
| Safe arbitrary resume | Supported operationally | Framework-specific | Explicitly excluded until qualified |
| Windows evidence | Local adaptation exists | Depends on environment | Explicit target |

## Rule for "known working"

A project qualifies as a known-working reference only for the capabilities actually demonstrated by its source/tests/runtime evidence.

Do not use popularity, repository claims, or README language as a substitute for inspecting the implementation or tests.
