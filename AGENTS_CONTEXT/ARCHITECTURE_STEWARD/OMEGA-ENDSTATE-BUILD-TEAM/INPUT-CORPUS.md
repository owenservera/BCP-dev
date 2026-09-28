# Ω End-State Build Team — Input Corpus

> Status: STARTING MATERIALS
> Date: 2026-09-28

This file distinguishes what the team is intentionally handed from what it is expected to discover itself.

The active project/control-plane home for the local Steward and the new team is `omega-endstate-build/`. The team should place its own durable project artifacts there as it evolves.

## Primary inputs — start from these

### Operational bootstrap home

Read and use:

- `../omega-endstate-build/README.md`
- `../omega-endstate-build/STEWARD-BOOTSTRAP.md`
- `../omega-endstate-build/GIT-MANAGEMENT.md`
- `../omega-endstate-build/PROJECT-STRUCTURE.md`

These define the active project workspace and local development-system bootstrap. They do not replace the product/destination corpus below.


### Owner-provided destination scaffold

Before forming its roadmap, the team must read:

- `END-STATE-SEED.md` — minimum product/destination goals supplied by the owner;
- `KNOWN-COMPLEXITY-AREAS.md` — known engineering/design frontiers that are likely to remain difficult regardless of implementation choice.

These files are deliberately **guidance, not architecture or backlog**. The team must preserve the stated destination while independently deciding how to realize it.

### A. Current Ω

Use the current contents of:

`omega-baseline/omega-final/`

At minimum, understand:

- `README.md`
- `docs/decisions/CURRENT-INVARIANTS.md`
- current decision records relevant to architecture;
- current contracts / host / shim / platform structure;
- plugins and surfaces;
- tests and gates;
- Forge/design material;
- current Ω end-state material.

Ω is the team's **technical starting substrate**.

### B. End-state vision

Treat these as the starting product-direction corpus:

- `omega-baseline/omega-final/docs/forge/OMEGA-ENDSTATE-VISION.md`
- `omega-baseline/omega-final/docs/forge/OMEGA-FORGE-ARCHITECTURE.md`
- `docs/destination/NORTH-STAR.md`
- `docs/destination/DESTINATION-MASTER-MAP.md`
- `docs/destination/HUMAN-EXPERIENCE.md`
- `docs/destination/FOUNDATIONAL-PRINCIPLES.md`

The team should discover additional destination/end-state documents rather than assuming this list is exhaustive.

## Secondary context — available, not inherited

The complete repository is available for investigation:

- `vivim-original-baseline/vivim-final-enhanced/`
- `bcp-speed/bcp/`
- `docs/destination/`
- `AGENTS_CONTEXT/`
- other branches;
- existing tests, tools, research, decisions and evidence.

Use these when they answer a question.

Do not convert secondary context into an inherited backlog.

## Input interpretation

The team should mentally separate:

```
VISION
  = where we are trying to go

OMEGA
  = where we are starting technically

EVERYTHING ELSE
  = information that may help us get there
```

The last category is deliberately broad.

It is not a list of obligations.

## Anti-migration rule

When old VIVIM contains a useful behavior, the preferred reasoning chain is:

`observe behavior → understand product value → design the right end-state form → implement it on/through Ω → verify`

not:

`copy old architecture → migrate → rationalize later`

## Discovery rule

Do not assume the listed inputs contain the complete end state.

The team's first research pass should discover:

- missing vision documents;
- contradictory vision statements;
- under-specified journeys;
- unmodeled product capabilities;
- hidden assumptions in Ω;
- infrastructure constraints;
- useful prior experiments;
- available agent/tooling capabilities;
- opportunities to simplify the route.
