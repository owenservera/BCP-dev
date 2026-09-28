# omega-endstate-build — Local Project Instructions

This directory is the canonical project/control-plane home for the Ω End-State Build Team.

## Core constitutional-document ownership

Department 03 owns and maintains the four root-level Omega seeds: `../../Vision.md`, `../../Motivation.md`, `../../Invariants.md`, and `../../Anti-Patterns.md`. Changes should preserve lineage, reflect current evidence and decisions, and remain compact enough to serve as the workspace's primary orientation layer.

## Primary company mission for this roadmap phase

**Full VIVIM beta ready to distribute for free.**

Treat this as the governing outcome. Development-system evolution is an enabling objective, not a replacement objective.

## Foundational trust contract

Read: `../02-TRUTH-AND-TRUST/TRUTH-CHAIN-SEED.md`

This is the first workspace-wide seed contract for truth, provenance, authority, execution and outcome lineage.

It is currently informational and not machine-enforced, but every agent, subagent, Steward, department, tool and experiment operating in this workspace is expected to understand and follow its principles.

The central rule is:

**Trust belongs to a traceable chain, not to an agent, role, model, authority position or consensus.**

## Turn close

Read: `../02-TRUTH-AND-TRUST/TURN-CLOSE-PROTOCOL.md`

Every turn/session operating in this workspace should end by publishing the current visible task queue as a detailed Markdown table.

The table is a visibility surface, not a second source of truth. Use authoritative task records, label unknowns explicitly, and never imply completion, verification or authority that the durable records do not establish.

## Read first

- README.md
- TRUTH-CHAIN-SEED.md
- TURN-CLOSE-PROTOCOL.md
- STEWARD-BOOTSTRAP.md
- GIT-MANAGEMENT.md
- PROJECT-STRUCTURE.md
- team/README.md
- `../02-TRUTH-AND-TRUST/state/BOOTSTRAP-CHECKLIST.md`

Then read the complete inherited seed corpus under:

AGENTS_CONTEXT/ARCHITECTURE_STEWARD/OMEGA-ENDSTATE-BUILD-TEAM/

For a specific resident agent, also read its durable home under its owning department:

departments/<DEPARTMENT>/<AGENT_ID>/

An agent home is durable identity/context/control-plane memory; it is not the agent's execution workspace.

## Scope

This project is an independent end-to-end VIVIM build path.

Do not inherit the mainline P1/CFA backlog merely because it exists elsewhere in BCP-dev.

Do not treat legacy VIVIM or current Ω implementation as mandatory architecture.

Use them as starting substrate, evidence and reusable material.

## Department organization

The local Steward owns progressive creation of the team's three departments and their resident roles. The department roots are siblings under `omega-endstate-build/departments/`.

Start from the current seeded topology in team/AGENT-ROSTER.json. Additional specialists may be proposed, provisioned, combined or retired as observed workload justifies them.

## Workspace safety

This directory is shared tracked project state.

It is not a shared autonomous-agent checkout.

Every concurrently active agent must use its own isolated worktree or clone and its own work branch.

Read GIT-MANAGEMENT.md before creating or modifying agent work.

## Project state

Durable team state belongs under this project home.

Machine-specific workspace paths, process state, credentials, browser profiles and other local secrets/data must never be committed.

## Changes to Ω

Branch-local architectural changes are allowed when the product requires them.

Record consequential decisions and preserve lineage.

Do not imply that a branch-local decision changed main or global repository authority.

## Truth-chain minimum

For consequential work, preserve enough lineage to answer:

- Who performed the action?
- What were they authorized to do?
- What did they actually observe?
- What evidence supports the claim?
- What was inference versus fact?
- Who decided?
- What actually changed?
- What happened afterward?
- What remains unknown?
- Where is the durable record?