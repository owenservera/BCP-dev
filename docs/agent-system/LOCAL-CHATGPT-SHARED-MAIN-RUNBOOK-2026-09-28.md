# Local + ChatGPT Shared-Main Operating Runbook
## 2026-09-28

> Classification: derived operational guidance. This is not Ω law and does not
> replace the Architecture Steward control plane.

## Objective

Operate one repository as the shared durable baseline while keeping two independent
interfaces available:

1. ChatGPT webapp for owner-facing architecture/research/steering.
2. Local OpenCode for persistent autonomous execution.

The two surfaces alternate freely. Neither one is required to be alive for the
other to continue.

## Repository rule

main is the integrated source of truth.

Use short-lived work branches for bounded implementation when repository mechanics
require them, but integrate them back promptly. Do not maintain a long-lived
autonomous-team branch that competes with main.

Never merge commons/<agent_id> communication refs as product history.

## Local startup

From the current BCP-dev checkout:

1. Confirm the checkout is on current main and clean.
2. Confirm the installed toolchain:
   bun --version && node --version && git --version && gh --version && opencode --version.
3. Start opencode from the repository root so .opencode/ is discovered.
4. Confirm all eleven agents resolve with opencode agent list.
5. Confirm the Steward/CFA permission shape with opencode debug config.
6. The owner addresses the architecture-steward primary; the Steward compiles
   task envelopes and spawns CFAs.

## Cold start / recovery

A new local Steward session reads:

AGENTS.md → BUILD_CONTEXT.md → docs/CURRENT-CONTEXT.md →
Steward identity/state/tasks/session context → Durable Completion Gate →
Owner Delegation → CFA register + Commons roster.

Then verify unfinished work from durable receipts/TASKS before spawning anything.

## Working with ChatGPT

ChatGPT may inspect current main, research externally, audit architecture, and
write bounded findings/decisions into the repository.

The local team may subsequently read those durable artifacts and continue. Likewise,
ChatGPT may resume from local receipts and implementation state without requiring a
local session transcript.

## Safety boundaries

- consequential work still requires gate-time authority;
- completion requires durable receipts and repository verification;
- unknown remains unknown;
- design evidence is not live proof;
- no Ω-law change occurs through this setup;
- no A2A/MCP/presence capability is assumed until separately implemented and tested.

## First local objective after integration

The first local session should **not** redesign the autonomous system. It should
perform the documented current-tree verification gate, reconcile any drift, and then
take the next bounded setup item from the autonomous-team roadmap.

The current main Architecture Steward portfolio remains independently routed; local
autonomy must not silently reorder Stage-E work.