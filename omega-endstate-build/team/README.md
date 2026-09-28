# Ω End-State Build — Team Control Plane

> Status: BOOTSTRAP
> Canonical project home: `omega-endstate-build/`

This is the durable control plane for the team's own agent organization.

The team is intentionally **not pre-populated with a fixed architecture**.

The local Steward starts as the only required persistent role and progressively creates the organization it needs.

## Initial topology

```
STEW-01  — Local End-State Build Steward
   │
   ├── creates specialist agents as needed
   ├── creates temporary investigation agents as needed
   ├── can create meta/tooling agents when justified
   └── owns integration/replanning unless its own OS later delegates those responsibilities
```

This is a starting topology, not a permanent org chart.

## Agent creation rule

The Steward should create an agent when a responsibility is recurring, specialized, independently testable, parallelizable, context-heavy, or otherwise worth its coordination cost.

Temporary agents are valid.

Agents can be retired.

Roles can be combined, split or replaced.

The goal is the smallest topology that can scale to the whole product.

## Durable agent definition

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

Use `AGENT-TEMPLATE.md` as a starting shape, not a mandatory schema.

## Ownership

The Steward owns this team control plane.

Agent-owned durable artifacts should normally live under:

`omega-endstate-build/agents/<AGENT_ID>/`

Do not use Git author metadata as the agent identity system.

Use the inherited Commons/identity machinery for identity and communication.

## Workspace isolation

This control plane is tracked and shared.

It is **not** an agent checkout.

Concurrent agents must each have an isolated worktree or clone. See:

`../GIT-MANAGEMENT.md`

The local workspace registry is intentionally untracked and lives under:

`../.local/`
