# Resident Team Evolution — Design Proposal

> Status: PROPOSED
> Date: 2026-09-28
> Scope: resident-team execution model only
> Baseline: vendored `opencode-swarm` + OpenCode 1.18.4 behavior exercised on Windows

## 1. Design intent

The team should evolve from the installed swarm substrate rather than introducing a new orchestration framework before its behavior is proven.

The governing rule is:

> Preserve a working capability until a replacement capability is experimentally proven.

The lab therefore separates:

- **execution substrate** — OpenCode sessions, Task, server lifecycle, and the vendored swarm machinery;
- **VIVIM governance** — identity, delegation, evidence, Commons relationships, and durable authority;
- **durable truth** — repository artifacts and receipts.

## 2. Target shape

```text
Owner / COORD-01
        |
        v
     Steward
        |
        +----------------------+
        v                      v
 resident A               resident B
 own judgment              own judgment
        |                      |
     native Task           native Task
        v                      v
    workers                 workers
        \                      /
         +---- Commons -------+
                   |
              repository
```

The Steward coordinates owner-level goals and cross-domain sequencing.

A resident owns its domain reasoning. It may decide that additional bounded capacity is useful and request workers through the native OpenCode `Task` mechanism.

The runtime/policy layer authorizes or refuses that request. It does not decide the intellectual decomposition for the resident.

## 3. Delegation is not a boolean

The eventual Ω delegation model should be explicit enough to answer:

- who granted the right to spawn,
- who received it,
- which agent profiles may be targeted,
- maximum nesting depth,
- maximum active children,
- maximum children for a work item,
- tool/write scope,
- whether resident creation is allowed,
- and when the grant expires.

Conceptual shape:

```ts
type DelegationGrant = {
  subject: AgentId
  issuer: AgentId
  spawn: {
    allowedAgents: string[]
    maxDepth: number
    maxActiveChildren: number
    maxChildrenPerWorkItem: number
  }
  tools: ToolPolicy
  writes: WriteScope[]
  canCreateResidents: boolean
  canProposeResidents: boolean
  expiresAt?: string
}
```

This is a proposal only. It must not become runtime law until a smaller empirical prototype demonstrates the need and the enforcement boundary.

## 4. Plugin role

The VIVIM plugin should remain thin.

Its proposed responsibilities are:

1. map the OpenCode session to a durable VIVIM identity when one exists;
2. observe and eventually govern `Task` calls;
3. record parent/child lineage;
4. record lifecycle transitions;
5. inject the minimum role/delegation context needed for an experiment;
6. capture evidence receipts.

The plugin should not become a second task manager.

OpenCode's native `Task` remains the spawning primitive. The plugin is the deterministic guard/observer around it.

## 5. Resident versus worker

### Resident

A resident has:

- durable identity and home;
- a bounded domain purpose;
- durable state/lessons;
- an Agent Commons identity;
- independent judgment;
- permission to request bounded workers.

### Worker

A worker has:

- temporary execution identity;
- a parent relationship;
- least-privilege tools;
- no ability to spawn further workers;
- a result/evidence handoff to its parent.

A worker disappearing after completion must not erase lineage.

## 6. Communication

Residents should be able to communicate laterally without going through the Steward.

The vocabulary proposed for later Commons integration is:

`OBSERVATION`, `FINDING`, `HYPOTHESIS`, `OPINION`, `PROPOSAL`, `OBJECTION`, `REQUEST`, `HANDOFF`, `DECISION`.

An agent's opinion is not authority. Repetition, status, or message volume never creates authority.

## 7. Scaling

A mature resident should be capable of reasoning:

> I have four independent questions; two need live observation and one needs verification.

It can then request an appropriate bounded worker set.

The runtime should enforce global resource ceilings, but it should not become the intellectual work allocator.

This gives three distinct powers:

```text
resident decides demand
        ↓
policy decides authorization
        ↓
runtime decides resource admission
```

## 8. Migration sequence

The migration is intentionally one-way only after proof:

```text
known-working swarm
        ↓
observability
        ↓
native Task child creation
        ↓
mechanical delegation gating
        ↓
resident-owned worker pool
        ↓
durable lineage + evidence
        ↓
resident-to-resident Commons
        ↓
Ω-native governance
```

At every stage the previous working mechanism remains available as a fallback until the replacement has its own evidence.

## 9. Non-goals for this phase

Do not build yet:

- a custom scheduler;
- a second task system;
- a custom session implementation;
- a replacement message bus;
- a full resident registry service;
- a general-purpose agent operating system.

Those are future questions. The immediate purpose of this lab is to prove whether the smallest resident behavior works on the substrate already installed.
