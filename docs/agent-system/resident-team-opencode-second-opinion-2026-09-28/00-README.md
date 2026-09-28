# Resident Team + OpenCode Serve — Second-Opinion Dossier

**Date:** 2026-09-28  
**Status:** RESEARCH / ARCHITECTURAL SECOND OPINION — NOT YET IMPLEMENTATION AUTHORITY  
**Repository:** `owenservera/BCP-dev`  
**Design baseline reviewed:** `e181820502f1a5ea572ed51b98cebd3af0b9c5ae`  
**Question:** How should the ten ratified CFA agents remain resident, continuously available, stateful, peer-communicating members of one team session, while preserving the Steward's coordinating role and allowing real delegation/back-and-forth decision making?

## Purpose

This dossier exists to provide a fresh, independent architectural examination of the resident-team idea against:

- the current BCP-dev agent architecture;
- the current Agent Commons design;
- the existing persistence/capability model;
- OpenCode's current `serve`, service, session, event and API model;
- known failure modes around asynchronous server prompting;
- the required evidence and recovery discipline.

This dossier is deliberately separate from the main upgrade documents so it can be reviewed as a genuine second opinion rather than silently becoming part of the original design assumptions.

## Executive conclusion

The repository currently contains the conceptual pieces for persistent identity, sessions, Commons communication, handoffs, and capability discovery, but it does **not yet implement the resident-ten-CFA runtime described by the owner**.

The most important finding is that OpenCode's current server architecture is a credible substrate for that runtime:

`opencode serve` starts a headless HTTP server exposing an OpenAPI 3.1 interface. The current API includes server health, an SSE global event stream, session creation/listing/status/details, synchronous and asynchronous session messaging, abort, session fork, agent discovery, and related controls.

That means we should not invent a second model-hosting/session engine merely to keep the ten CFAs alive. A dedicated team-runtime supervisor can sit above OpenCode's server and manage **team residency, lifecycle, identity mapping, liveness, recovery and Commons delivery**, while OpenCode remains the session/LLM/tool execution substrate.

However, OpenCode's API acknowledgement is not itself proof that an assistant turn actually happened. Public issue reports document cases where `prompt_async` returned `204` while an inference did not occur or a child session remained empty/frozen. Therefore the proposed supervisor must use **observable postconditions** rather than treating HTTP acceptance as execution success.

## The target mental model

The owner's intended operating model is:

- the Steward and owner establish goals/objectives and global architectural intent;
- all ten CFAs are resident for the lifetime of the team session;
- every CFA has its own identity, session, context/home, permissions and runtime state;
- CFAs can communicate directly with one another;
- CFAs can request evidence, issue objections, propose designs, hand off bounded work, and participate in decision formation;
- the Steward coordinates and reconciles the team but is not a mandatory message relay;
- the owner can communicate with the Steward and, where appropriate, individual CFAs;
- work may shift between DELIBERATE and EXECUTION without changing the resident team;
- work may switch between LOCAL and CHATGPT-WEBAPP without changing the logical agent identity;
- durable repository state remains the continuity bridge;
- Commons is communication, not truth/authority/task management;
- the resident runtime manages process/session lifecycle, not architecture semantics.

## Two graphs, not one

### Governance / delegation

```
OWNER
  |
  v
STEWARD
  |
  +-- CFA-01
  +-- CFA-02
  +-- ...
  +-- CFA-10
```

### Communication / reasoning

```
CFA-01 <-> CFA-02 <-> ... <-> CFA-10
   ^             ^              ^
   |             |              |
   +-------------STEWARD--------+
```

The governance graph establishes enduring responsibility and owner delegation. The communication graph permits peer reasoning.

## Core architectural sentence

> **The Steward coordinates the minds; it does not replace them.**

## Canonical distinctions to preserve

- Surface != Role
- Surface != Mode
- Surface != Authority
- Session != Agent identity
- Runtime instance != Agent identity
- Commons != Authority
- HTTP acknowledgement != Execution proof
- Presence != Truth
- Capability != Authority
- Delegation != Ownership transfer
- Communication != Canonization
- Persistence != Continuous thinking

## Documents in this dossier

| File | Focus |
|---|---|
| `01-OPENCODE-SERVE-RESEARCH.md` | Current OpenCode serve/service/server evidence |
| `02-RESIDENT-TEAM-ARCHITECTURE.md` | Proposed resident ten-CFA topology |
| `03-PERSISTENCE-RECOVERY-RUNTIME.md` | Session persistence, residency, restart and recovery |
| `04-COMMUNICATION-DELEGATION-AMBIT.md` | Peer communication, delegation ambit and Steward boundaries |
| `05-SECURITY-EVIDENCE-FAILURE-MODEL.md` | Evidence, identity, security and fail-closed requirements |
| `06-IMPLEMENTATION-BLUEPRINT.md` | Concrete implementation sequence and acceptance tests |
| `07-SECOND-OPINION-QUESTIONS.md` | Questions that should be independently challenged before build |
| `08-SECOND-OPINION-RECONCILIATION.md` | Reconciled second-opinion findings and revised proof gates |
| `10-FIRST-LOCAL-AGENTIC-SYSTEM-CLEANUP-AND-MIGRATION.md` | Cleanup and migration plan for the first local agentic attempt |

## External evidence consulted

Primary OpenCode documentation:

- https://dev.opencode.ai/docs/server/
- https://opencode.ai/v2/docs/cli/web
- https://opencode.ai/v2/docs/cli/commands/
- https://opencode.ai/v2/docs/troubleshooting
- https://opencode.ai/v2/docs/cli

Relevant public issue reports used only as failure evidence, not as architectural authority:

- https://github.com/anomalyco/opencode/issues/21524
- https://github.com/anomalyco/opencode/issues/26635
- https://github.com/anomalyco/opencode/issues/32010
- https://github.com/anomalyco/opencode/issues/33394

## Evidence classification

**CONFIRMED FROM CURRENT OPENCode DOCUMENTATION**

- `opencode serve` exists as a headless server mode.
- Default documented port for `serve` is 4096 and default hostname is 127.0.0.1.
- Server exposes OpenAPI 3.1 at `/doc`.
- Server exposes global health and global SSE event endpoints.
- Server exposes multiple session APIs.
- Server exposes synchronous and asynchronous message APIs.
- OpenCode's current architecture explicitly supports programmatic interaction and multiple clients.
- `opencode service` manages a background server.
- `opencode serve` is the foreground/standalone server path.

**HIGH-CONFIDENCE DESIGN INFERENCE**

- One OpenCode server can be used as the runtime substrate for multiple resident CFA sessions.
- A supervisory process can maintain a mapping between stable CFA identities and OpenCode session IDs.
- The supervisor should treat async HTTP response success as an acceptance signal, not proof of model execution.
- Direct CFA-to-CFA messaging is cleaner than routing every peer interaction through the Steward.

**RUNTIME FACTS REQUIRING LOCAL PROOF**

- Installed OpenCode version on the actual target Windows machine.
- Exact `serve` behavior on that version.
- Whether the target release reliably wakes already-idle sessions through `prompt_async`.
- Whether server events provide every lifecycle transition needed for our supervisor.
- Actual process/terminal/service behavior on Windows.
- Actual provider authentication and concurrent-model limits.
- Actual CPU/RAM/token-cost behavior with ten resident sessions.

## Non-goals

This dossier does not:

- activate A2A or MCP;
- alter Ω law;
- create a second task database;
- redefine the ten CFAs;
- authorize production consequential effects;
- claim OpenCode behavior on the target machine without local evidence;
- declare the resident runtime implementation-ready without the stated acceptance tests.

