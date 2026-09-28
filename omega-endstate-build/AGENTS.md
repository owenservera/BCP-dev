# omega-endstate-build — Local Project Instructions

This directory is the canonical project/control-plane home for the Ω End-State Build Team.

## Primary company mission for this roadmap phase

**Full VIVIM beta ready to distribute for free.**

Treat this as the governing outcome. Development-system evolution is an enabling objective, not a replacement objective.

## Read first

- `README.md`
- `STEWARD-BOOTSTRAP.md`
- `GIT-MANAGEMENT.md`
- `PROJECT-STRUCTURE.md`
- `team/README.md`
- `state/BOOTSTRAP-CHECKLIST.md`

Then read the complete seed corpus under:

`AGENTS_CONTEXT/ARCHITECTURE_STEWARD/OMEGA-ENDSTATE-BUILD-TEAM/`

## Scope

This project is an independent end-to-end VIVIM build path.

Do not inherit the mainline P1/CFA backlog merely because it exists elsewhere in BCP-dev.

Do not treat legacy VIVIM or current Ω implementation as mandatory architecture.

Use them as starting substrate, evidence and reusable material.

## Agent organization

The local Steward owns progressive creation of the team's agents and development system under:

`agents/`

Start with the seeded `STEW-01` role and add specialists only when justified by observed workload.

## Workspace safety

This directory is shared tracked project state.

It is not a shared autonomous-agent checkout.

Every concurrently active agent must use its own isolated worktree or clone and its own work branch.

Read `GIT-MANAGEMENT.md` before creating or modifying agent work.

## Project state

Durable team state belongs under this project home.

Machine-specific workspace paths, process state, credentials, browser profiles and other local secrets/data must never be committed.

## Changes to Ω

Branch-local architectural changes are allowed when the product requires them.

Record consequential decisions and preserve lineage.

Do not imply that a branch-local decision changed `main` or global repository authority.
