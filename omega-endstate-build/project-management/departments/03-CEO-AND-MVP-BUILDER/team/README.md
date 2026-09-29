# Ω End-State Build — Team Control Plane

> Status: BOOTSTRAP
> Canonical project home: omega-endstate-build/

This is the durable control plane for the team's department organization and resident roles.

## Foundational trust contract

All team participants are subject to `../../02-TRUTH-AND-TRUST/TRUTH-CHAIN-SEED.md`

The contract is currently informational and not machine-enforced. It exists so every participant starts with the same epistemic and governance boundary.

Its core distinction is:

IDENTITY != AUTHORITY != OBSERVATION != EVIDENCE != INTERPRETATION != DECISION != EXECUTION != OUTCOME

The team must not treat an agent, role, model, seniority, confidence or consensus as a substitute for provenance.

VETO-01 is the first explicit trust-chain witness, not the owner of truth or team authority.

## Initial department topology

STEW-01 — Local End-State Build Steward
  - team-level coordination, roadmap and integration in the current bootstrap shape
  - creates/retires or delegates roles as evidence justifies them

DEVOPS-01 — Agentic Development Tooling Owner
  - seeded resident owner of the local development-system / DevOps tooling domain
  - currently ready for first live bootstrap and self-definition
  - may propose or create domain specialists only within its delegated scope and established execution mechanisms

PROV-01 — Provider / Live-Environment Investigator
  - proposed specialist; provision when live-provider workload requires it

VER-01 — Independent Verifier
  - proposed specialist; provision when independent verification work requires it

VETO-01 — Mission Governor Department
  - separate experimental governance/audit function
  - advisory veto proposal only; not a team manager or truth authority

COORD-01 — Architectural / Research Auditor
  - peer external coordination/audit context where explicitly engaged
  - not part of STEW-01's local execution topology unless deliberately integrated later

This is a starting topology, not a permanent org chart.

## Department and role evolution

The Steward should create or reshape a department when a responsibility becomes a durable organizational boundary; resident roles inside departments should exist only where their coordination cost is justified.

Temporary agents remain valid as execution mechanisms.

Resident roles can be retired, combined, split or replaced.

The goal is the smallest department topology that can scale to the whole product.

## Durable resident-role definition

Each persistent agent should eventually have a durable definition containing:

- agent ID;
- role;
- mission;
- capabilities;
- authority/scope;
- owned project surfaces;
- workspace policy;
- branch policy;
- current status;
- durable context;
- task/handoff location;
- supersession/retirement information.

Use the existing seeded agent definitions as patterns, not mandatory schemas. Keep durable fields aligned with the role actually being operated.

## Ownership

The Steward owns this team control plane.

Resident-role artifacts should normally live under their department:

omega-endstate-build/project-management/departments/<DEPARTMENT>/<AGENT_ID>/

Do not use Git author metadata as the agent identity system.

Use the inherited Commons/identity machinery for identity and communication.

## Workspace isolation

This control plane is tracked and shared.

It is not an agent checkout.

Concurrent agents must each have an isolated worktree or clone. See:

../GIT-MANAGEMENT.md

The machine-local workspace registry is intentionally untracked and lives outside the tracked project home, alongside the isolated workspaces.

## Truth-chain minimum for consequential work

Participants should preserve lineage sufficient to distinguish:

- who acted;
- what scope/authority they had;
- what was observed;
- what evidence was used;
- what was inferred;
- what decision was made;
- what actually changed;
- what outcome followed.

A handoff transfers context; it does not transfer truth.