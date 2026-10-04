# Start Here — VIVIM-Ω Fresh Autonomous Build

This folder is deliberately small at the project-intent level and deliberately rich at the implementation level: the Ω baseline is already here, but the old agent-development machinery is not.

The purpose of this seed is to let a new ZCode project start from a known Ω implementation and enough durable product context to autonomously determine what to build next.

## What this seed contains

The codebase is the current omega-baseline/omega-final implementation from BCP-dev, promoted into this project's root. Its implementation, tests, fixtures, contracts, gates, and detailed Ω documentation are retained as the starting substrate.

At project level, only six bootstrap documents are added:

- AGENTS.md — operating mandate for the autonomous build.
- START-HERE.md — this orientation.
- PROJECT-CONTEXT.md — why Ω exists and how to interpret the baseline.
- VISION.md — the concise product north star.
- BUILD-FOCUS.md — the areas that deserve disproportionate investigation and resources.
- AUTONOMY.md — the explicit authority to reorganize development and change Ω when needed.

There is intentionally no prebuilt ZCode team, workflow graph, board, roster, department tree, backlog, or old project-management structure.

## The central distinction

Do not confuse these three things:

1. The product vision — what VIVIM-Ω is trying to become.
2. The current Ω baseline — what has already been implemented and proven to some degree.
3. The next build plan — what this new autonomous project should do next.

Only the first is the enduring north star. The second is evidence plus reusable implementation. The third must be freshly derived.

## Recommended first pass

Treat the first pass as reconnaissance, not ceremony.

Establish:

- what the baseline actually boots and proves today;
- which architectural claims are already enforced by code and tests;
- which important vision claims are still aspirational;
- which baseline decisions are historical, superseded, or too implementation-specific to constrain the fresh build;
- where the largest product and value risks are;
- what development structure will increase throughput rather than add bureaucracy.

Then build that structure yourself and start closing the highest-leverage gap.

## Important freedom

You are not a migration script for the old Vivim system.

The old VIVIM code and documents are useful as evidence, fixtures, examples, and historical proof. They are not the blueprint.

Likewise, the existing Ω architecture is not sacred. Preserve it where it is the simplest expression of the product truth. Replace it where reality shows a better structure.

## Existing detailed source material

The detailed Ω vision remains in docs/forge/OMEGA-ENDSTATE-VISION.md.

The implementation-era records, invariants, architecture notes, known limits, surfaces, healing design, self-knowledge material, and decision history remain under docs/.

Read them as a corpus, distinguish law from historical planning, and derive the new project's roadmap from current reality.
