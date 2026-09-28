# Ω End-State Build Team — Bootstrap

> Status: OPEN
> Date: 2026-09-28
> Branch: `team/omega-endstate`

## Bootstrap mission

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

## Phase 3 — design the development system

The team itself must decide how it wants to build.

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

## Phase 4 — create the roadmap

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

## Phase 5 — establish the first build frontier

Populate:

`TASKS.md`

The first implementation frontier should emerge from the roadmap.

Do not import a mainline task list merely to make the queue look populated.

## Bootstrap completion

Bootstrap is complete when:

1. the team understands Ω independently;
2. the team understands the end-state independently;
3. the team has explicitly characterized major gaps and tensions;
4. the team has designed its own development system;
5. the team has produced its own full-product roadmap;
6. the team has selected an initial build frontier;
7. the team records what evidence would make it change course.

## Non-goals

Bootstrap does not require:

- migration;
- legacy porting;
- synchronization with the mainline program;
- production completion;
- integration into `main`.

The team may begin coding after its own development system and first frontier are sufficiently formed.
