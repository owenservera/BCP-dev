# Ω End-State Build Team — Bootstrap

> Status: OPEN
> Date: 2026-09-28
> Branch: `team/omega-endstate`

## Canonical project home

The active project/control-plane home for this development path is:

`omega-endstate-build/`

Use `omega-endstate-build/STEWARD-BOOTSTRAP.md` as the executable local Steward bootstrap and `omega-endstate-build/GIT-MANAGEMENT.md` as the Git/workspace safety protocol. This folder remains the seed/context corpus from which the project home is bootstrapped.

## Bootstrap mission

A local Steward can bootstrap this path directly with `STEWARD-LOCAL-SETUP-PROMPT.md`. The prompt is intentionally broader than a normal task brief: the Steward is expected to build whatever local development machinery, subagents, research loops, verification tooling, and coordination mechanisms are needed to automate the route to the product.

Do not begin with implementation.

First build an internal answer to:

> **How would an independent team build the entire VIVIM end state from Ω if nobody handed it the current project's roadmap?**

## Phase 1 — understand the starting substrate

Characterize the current Ω system sufficiently to know:

- what it already guarantees;
- what it actually implements;
- what is merely documented;
- what is accidental;
- what is brittle;
- what is elegant;
- where the current boundaries help;
- where the current boundaries obstruct the end state.

Do not assume that passing tests mean a design is final.

## Phase 2 — understand the destination

Read and synthesize the end-state material.

Extract:

- product outcomes;
- user journeys;
- sovereignty requirements;
- intelligence model;
- provider model;
- agency/work model;
- world/memory/context model;
- surfaces;
- configuration;
- Forge;
- evolution;
- lifecycle;
- recovery/exit;
- performance/scale expectations;
- explicit and implicit falsifiers.

## Phase 3 — design the development organization

The team must design its own development organization and development system.

It should determine:

- team roles;
- agent roles;
- ownership model;
- branch model;
- planning model;
- research model;
- experiment model;
- implementation model;
- test/evidence model;
- review model;
- architecture decision process;
- documentation strategy;
- integration/release strategy;
- context/cold-start strategy;
- how the team detects when its own development system is failing.

It may reuse the repository's existing Agent Commons and useful shared protocols.

It is not required to copy the current Architecture Steward operating model.

## Phase 4 — establish the minimum useful team

Create only the first useful persistent/temporary Steward and specialist roles. Expand the organization progressively when recurring workload, specialization, parallelism, verification, or coordination bottlenecks justify it. Record the agent definitions and ownership under `omega-endstate-build/`.

## Phase 5 — create the roadmap

Create:

`ROADMAP.md`

The roadmap should describe the route to the **whole product**, not only the next Ω wave.

It should contain:

- complete target state;
- major product/system capabilities;
- foundational sequence;
- vertical slices;
- architectural choicepoints;
- development workstreams;
- dependencies;
- experiments;
- evidence gates;
- milestones;
- exit criteria;
- explicit non-goals;
- conditions that would cause the roadmap to be rewritten.

## Phase 6 — establish the first build frontier

Populate:

`TASKS.md`

The first implementation frontier should emerge from the roadmap.

Do not import a mainline task list merely to make the queue look populated.

## Bootstrap completion

Bootstrap is complete when:

1. the team understands Ω independently;
2. the team understands the end state independently;
3. the team has explicitly characterized major gaps and tensions;
4. the team has designed its development organization/system;
5. the minimum useful agent topology exists;
6. isolated workspace/branch management is established;
7. the team has produced its own full-product roadmap;
8. the team has selected an initial build frontier;
9. the team records what evidence would make it change course.

## Non-goals

Bootstrap does not require:

- migration;
- legacy porting;
- synchronization with the mainline program;
- production completion;
- integration into `main`.

The team may begin coding after its own development system and first frontier are sufficiently formed.
