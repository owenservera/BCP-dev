# Ω End-State Build — Project Structure

> Status: STARTING STRUCTURE
> Purpose: give the local Steward a safe place to grow the team without prescribing its final architecture.

The directory `omega-endstate-build/` is the canonical durable project home.

The Steward may change this structure as evidence accumulates.

## Recommended initial areas

```
omega-endstate-build/
├── AGENTS.md
├── README.md
├── STEWARD-BOOTSTRAP.md
├── GIT-MANAGEMENT.md
├── PROJECT-STRUCTURE.md
│
├── team/             # team OS, roster, agent roles, ownership
├── agents/           # durable agent definitions/prompts/context
├── workstreams/      # active product/workstream definitions
├── roadmap/          # strategic and milestone planning
├── state/            # current machine-readable and human-readable state
├── decisions/        # consequential branch-local product/architecture decisions
├── research/         # research outputs and investigations
├── evidence/         # proof, verification, receipts and falsifiers
├── experiments/      # bounded experiments and live-system probes
├── scripts/           # local development/workspace automation
├── tools/            # tooling built specifically for this path
├── product/          # end-state product implementation when the team establishes it
└── integration/      # integration, release, compatibility and reconciliation records
```

Only create an area when it is useful.

The team may replace this taxonomy.

## Ownership

Artifacts belonging to this Ω End-State Build Team should prefer this directory over unrelated repository locations.

The team may read and reuse other repository areas, but it should not scatter its own durable project state across them.

## Production source

The `product/` area is the default home for newly created end-state product source if the team chooses to maintain a self-contained product tree.

The team may instead determine that some existing Ω boundaries should remain the implementation home.

That is an architectural decision for the team.

Do not duplicate large portions of Ω merely to make the folder look self-contained.

## Agent workspaces

Do not place concurrent agent worktrees inside this tracked project directory unless the team explicitly designs and verifies that arrangement.

The tracked project home is shared state.

Agent workspaces are isolated execution environments.

## Current seeded control plane

The repository already contains:

- `team/AGENT-ROSTER.json` — initial `STEW-01` roster;
- `agents/STEW-01/AGENT.md` — initial Steward definition;
- `state/TEAM-STATE.json` — initial team recovery state;
- `state/WORKSPACE-REGISTRY.schema.json` — machine-local registry contract;
- `scripts/` — local workspace/bootstrap tooling.

The Steward is expected to grow or replace these structures as evidence warrants.
