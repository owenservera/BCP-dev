# Ω Evolution Team — Bootstrap

> Status: OPENING SESSION CONTRACT
> Date: 2026-09-28
> Team branch: `team/omega-evolution`

## Purpose

This file starts the team. It intentionally does **not** prescribe the team's product roadmap.

The team must earn its roadmap from repository understanding, the vision, evidence, experiments and team reasoning.

## Bootstrap objective

Produce the first durable **Ω Evolution Team Roadmap** from scratch.

The bootstrap should answer:

1. What is the product we are actually trying to make?
2. What does "Omega" need to become for that product to exist?
3. Which parts of the present Ω are foundational, useful, accidental, incomplete, contradictory, or obsolete?
4. Which parts of the broader repository are valuable inputs?
5. What are the highest-leverage unknowns?
6. What should be built first and why?
7. What should explicitly **not** be built yet?
8. What should be measured or experimentally falsified before commitment?
9. Which architectural decisions belong to the team?
10. What first shippable / demonstrable outcome should the team target?

## Required exploration

Read enough of the corpus to understand, at minimum:

### Repository constitution and operating environment

- `/AGENTS.md`
- `/BUILD_CONTEXT.md`
- `/docs/CURRENT-CONTEXT.md`
- `/AGENTS_CONTEXT/README.md`
- `/AGENTS_CONTEXT/GIT-AND-GITHUB-AGENT-PROTOCOL.md`
- `/AGENTS_CONTEXT/AGENT-COMMONS/`

### Current Ω

- `/omega-baseline/omega-final/README.md`
- `/omega-baseline/omega-final/docs/decisions/CURRENT-INVARIANTS.md`
- relevant Ω decision records and current tests/gates
- `/omega-baseline/omega-final/docs/forge/OMEGA-ENDSTATE-VISION.md`
- `/omega-baseline/omega-final/docs/architecture/`

### Product destination

- `/docs/destination/`
- relevant product-vision and journey artifacts

### Available historical / implementation evidence

- `/vivim-original-baseline/vivim-final-enhanced/`
- `/bcp-speed/bcp/`
- existing CFA agent homes under `/AGENTS_CONTEXT/ARCHITECTURE_STEWARD/SUBAGENTS/`

Do not read every file by default. Build a dependency-driven reading set.

## Anti-assumption rule

Do not treat:

- the current P1 portfolio;
- current CFA roadmaps;
- current Ω decision backlog;
- legacy VIVIM architecture;
- present code topology;
- previous "next step" recommendations

as automatically correct.

They are evidence to inspect.

## Roadmap output

Create/update:

`AGENTS_CONTEXT/ARCHITECTURE_STEWARD/OMEGA-EVOLUTION-TEAM/ROADMAP.md`

The roadmap must be team-owned and should contain:

- mission;
- product thesis;
- target outcomes;
- major strategic bets;
- choicepoints;
- evidence gaps;
- build sequence;
- explicit non-goals;
- milestones/exit criteria;
- dependencies;
- decision records needed;
- conditions that would cause the roadmap to change.

Do not simply copy an existing roadmap and rename it.

## Completion condition

Bootstrap is complete when:

- the team can explain the present Ω in its own words;
- the team can identify what it would preserve and what it would reconsider;
- the first team roadmap is written;
- the first team task frontier is populated;
- the team state records the evidence basis and open uncertainties.

The roadmap may conclude that a radical redesign is appropriate. It may also conclude that large parts of current Ω should be retained. Either outcome is valid if supported by evidence.

## Non-goals

This bootstrap does not require:

- migration;
- legacy porting;
- immediate product implementation;
- integration into `main`;
- obedience to the current P1 queue;
- preserving current Ω law unchanged.

## Suggested first-team question

> **What would we build if the only starting constraint were the VIVIM vision and the capabilities already available in this repository?**

That is the team's design space.
