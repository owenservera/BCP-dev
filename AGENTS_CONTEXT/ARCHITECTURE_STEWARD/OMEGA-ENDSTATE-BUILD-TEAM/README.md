# Ω End-State Build Team

> Status: OWNER-DIRECTED SECOND DEVELOPMENT PATH
> Opened: 2026-09-28
> Branch: `team/omega-endstate`
> Mission: independently build the entire VIVIM end state starting from Ω

## The two-path model

BCP-dev now intentionally supports two parallel development paths.

### Path A — Mainline program

`main` continues the existing BCP / Architecture Steward program:

legacy evidence → BCP reconciliation → Ω → destination development → controlled integration.

Its current roadmaps, CFA portfolio, migration/harvest work, and synchronization rules remain its own concerns.

### Path B — Ω End-State Build Team

`team/omega-endstate` is a separate end-to-end product-development path:

`Ω starting substrate + VIVIM end-state vision → team discovers how to build the complete product`

This path is not a migration of old VIVIM.

It is not an alternative P1 workstream.

It is not an Ω maintenance team.

It is a fresh engineering organization whose starting material happens to be a mature Ω substrate.

## The instruction to the team

Give the team:

1. the current Ω system;
2. the end-state / product vision corpus;
3. full access to everything else in BCP-dev as reference and optional evidence.

Then let the team determine:

- what the complete product should become;
- what Ω should remain;
- what Ω should change;
- what must be built around Ω;
- what should be rebuilt inside Ω;
- what should be discarded;
- what engineering/development system it needs;
- what agent topology it needs;
- what operating principles it needs;
- what roadmap gets the whole system to the end state.

The team owns the route.

## Critical non-assumption

The existence of an implementation in legacy VIVIM, BCP, current Ω, or another agent's work does **not** create an obligation to reproduce that implementation.

Legacy VIVIM can reveal useful behavior.

BCP can reveal useful machinery.

Current Ω can provide a proven substrate.

Destination documents can describe desired outcomes.

The team decides how those inputs should influence the design.

## Scope

The team's scope is the **entire solution**, including whatever combination of runtime, product environment, world/data model, intelligence, providers, agency, surfaces, configuration, Forge, evolution, lifecycle, install/update/recovery, and other capabilities are required by its interpretation of the end state.

The team must not artificially limit itself to the present Ω package boundaries.

## Autonomy

The team owns its development path.

It may:

- define its own development methodology;
- define its own team/agent roles;
- define its own roadmap and milestones;
- invent better planning, testing, simulation, evidence and review mechanisms;
- reorganize the Ω codebase;
- replace current Ω subsystems;
- change boundaries;
- change vocabulary;
- change architecture;
- amend or replace current Ω law on this branch;
- build product layers that do not yet exist;
- delete approaches that no longer make sense.

Any consequential change should remain explicit and testable, but there is no requirement to preserve the current architecture for continuity's sake.

## Shared access

The team has the same repository access surface available to the other development path:

- full BCP-dev repository;
- current `main`;
- all accessible branches;
- Ω source and evidence;
- destination documentation and product research;
- BCP machinery;
- legacy VIVIM mine;
- all current agent homes and Commons;
- shared tooling, tests and CI;
- external research/tools available through the same connected environment.

Shared access is deliberately broad.

Shared obligations are not.

## Relationship to the other path

Neither path is the parent of the other.

The two paths may:

- inspect one another;
- learn from one another;
- cherry-pick useful commits;
- compare alternative designs;
- merge selected outcomes later;
- independently discover the same solution;
- reach incompatible architectural conclusions.

A branch-local decision is not automatically a mainline decision.

A mainline decision is not automatically a constraint on this team.

Integration, if eventually desired, is its own explicit engineering/reconciliation exercise.

## Start here

- `TEAM-BRIEF.md`
- `INPUT-CORPUS.md`
- `BOOTSTRAP.md`
- `OPERATING-SYSTEM.md`
- `ROADMAP.md`
- `STATE.md`
- `TASKS.md`
- `BRANCH-PROTOCOL.md`

The first job is not to implement a backlog item. The first job is to **understand Ω and the end state, design the team's own development system, and produce its own route to the complete solution**.
