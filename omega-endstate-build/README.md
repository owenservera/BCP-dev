# VIVIM Ω End-State Build — Project Home

> Status: OWNER-DIRECTED SECOND DEVELOPMENT PATH
> Date: 2026-09-28
> Integration line: `team/omega-endstate`

This directory is the **active project home and durable control plane** for the independent Ω End-State Build Team.

## Primary company mission for this roadmap phase

> **Full VIVIM beta ready to distribute for free.**

This is the governing outcome for the current phase. The agentic development organization, research program, architecture work and tooling are enabling means. Long-horizon organizational research is valuable only insofar as it can inform or eventually accelerate this mission; it must not displace the mission.

It is intentionally separate from:

- `AGENTS_CONTEXT/ARCHITECTURE_STEWARD/OMEGA-ENDSTATE-BUILD-TEAM/` — bootstrap/seed context;
- `omega-baseline/omega-final/` — technical starting substrate;
- `main` — the parallel BCP / Architecture Steward development path.

## What belongs here

The team should place its project-owned durable artifacts here, including as the team evolves:

- team and agent definitions;
- Steward state;
- agent roster and ownership;
- workstream definitions;
- roadmap and planning artifacts;
- product architecture and design records;
- experiments;
- evidence and verification records;
- development tools created specifically for this path;
- context packs and cold-start material;
- product-specific implementation created by this path, when the team chooses this directory as the product source;
- integration and release records;
- lessons and retrospective learning.

The folder is a **workspace/control-plane boundary**, not an architectural restriction.

The Steward may reorganize it as the team learns what structure works best, provided it preserves recoverability and lineage.

## Important distinction: project home vs agent workspace

`omega-endstate-build/` is the shared, tracked **project home**.

It is **not** a shared filesystem checkout for all agents.

Every concurrently active agent must work in its own isolated Git worktree or clone.

Recommended model:

```
BCP-dev repository
   |
   +-- omega-endstate-build/        <- shared tracked project/control plane
   |
   +-- isolated local worktree A    <- AGENT A
   +-- isolated local worktree B    <- AGENT B
   +-- isolated local worktree C    <- AGENT C
```

Do not put simultaneously active agent worktrees inside the tracked project directory unless the Steward has deliberately designed and verified that arrangement.

## Bootstrap

Start with:

`STEWARD-BOOTSTRAP.md`

Then read:

`GIT-MANAGEMENT.md`

The Steward should progressively create its own team, subagents, tools, state model and development operating system under this project home.

## Product source

The team may initially inspect and use `omega-baseline/omega-final/` as the technical starting substrate.

Do **not** copy the entire Ω tree into this directory merely for symmetry.

First determine what should actually be retained.

When the team begins creating its own product implementation, its default home may be:

`omega-endstate-build/product/`

unless its own architecture establishes a better boundary.

## Recovery principle

A fresh Steward should be able to reconstruct the team from this directory plus Git history and the referenced starting/evidence corpus without depending on this conversation.
