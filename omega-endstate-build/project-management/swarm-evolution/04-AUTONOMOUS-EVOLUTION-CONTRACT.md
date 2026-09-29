# Autonomous Evolution Contract

> Status: GOVERNANCE CONTRACT
> Date: 2026-09-29

## Purpose

This contract defines how the Ω development swarm may improve itself while it is simultaneously building Ω.

The swarm is allowed to evolve its implementation and development process. It is not allowed to redefine its own authority merely by editing its own instructions.

## 1. Every evolution begins with an observed problem

An evolution candidate must identify:

- observed failure or bottleneck;
- affected workload;
- current baseline;
- suspected cause;
- proposed change;
- measurable acceptance criterion.

"More autonomous" is not itself an acceptance criterion.

## 2. Evolution is an experiment

Each candidate has:

```
candidate
→ isolated trial
→ evidence collection
→ comparison
→ decision
```

Possible outcomes:

- PROMOTE;
- REVISE;
- REJECT;
- HOLD.

## 3. Three evolution layers

### L1 Agent

Prompts, skills, tools, context, local procedures.

### L2 Interaction

Delegation, communication, review, handoff, scheduling.

### L3 Organization

Roles, topology, departments, work decomposition, governance mechanics.

No L3 change may be smuggled in as an L1 prompt tweak.

## 4. Protected boundaries

The swarm cannot self-authorize changes to:

- human ownership;
- irreversible external mutation policy;
- identity/trust semantics;
- evidence requirements;
- security boundaries;
- production authority;
- Ω ratified invariants.

Such proposals must be surfaced as proposals requiring the appropriate authority.

## 5. Promotion requires evidence

A promotion record must contain:

- candidate ID;
- baseline version;
- candidate version;
- experiment workload;
- relevant metrics;
- failures;
- regressions;
- evidence artifacts;
- decision;
- rollback target.

## 6. Rollback is mandatory

Every promoted evolution must have a known rollback target.

The system must be able to restore the prior configuration without relying on the same potentially defective evolution mechanism.

## 7. Learning is durable

Successful lessons must become durable artifacts:

- role contract;
- skill;
- operating rule;
- test;
- architecture decision;
- workflow;
- tool;
- or explicit anti-pattern.

Never leave critical learning only in a conversation.

## 8. No self-evolution by anecdote

A single impressive run is not enough to promote a general improvement when the workload can be evaluated repeatedly.

Use representative tasks, holdouts, regression tests, or repeated runs appropriate to the claim.

## 9. Product work and swarm work are coupled but distinct

The swarm may improve itself while building Ω.

However:

`swarm improvement ≠ product milestone completion`

Both must be tracked separately.

## 10. Ultimate acceptance

The swarm is considered successfully self-evolving when its changes demonstrably reduce coordination cost, increase delivery reliability, improve evidence quality, or expand useful capability without degrading protected properties.

The purpose of evolution is better product delivery.
