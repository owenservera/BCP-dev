# U2A — Resident Organization and Presence Kernel

> Status: PROPOSED

## Primary question

How can a functional area remain durably present while its reasoning session and computational workers remain replaceable, context-bounded, and resource-limited?

## Scope

U2A adds four abstractions above native OpenCode sessions:

1. Department — durable functional identity and bounded mandate.
2. Master/Resident — long-lived reasoning anchor.
3. Worker Capability — reusable kind of work.
4. Presence Kernel — triggers, wake/sleep, context projection, session incarnation, and attention-budget admission.

It also introduces the bounded background-sentinel pattern.

## Research basis

See [RESEARCH-BASIS.md](RESEARCH-BASIS.md) and [cross-domain synthesis](../../08-CROSS-DOMAIN-ORGANIZATIONAL-RUNTIME-SYNTHESIS.md) for the external convergence behind the proposed architecture.

## Why this is needed

The prior U2 framing focused on a larger worker pool. Research shows that capacity is downstream of a more fundamental runtime question: what persists, what sleeps, what wakes, what context is assembled, and what happens when an OpenCode session must be replaced.

Therefore the existing U2 worker-pool goal becomes a capacity mechanism inside U2A rather than the governing architecture.

## Core invariants

- Department identity is session-independent.
- Resident identity is session-independent.
- Worker capability is not worker identity.
- Dormant is healthy.
- Background inference is event-driven rather than an endless polling loop.
- Every wake has a durable cause.
- Context is projected from durable state.
- Session recycling preserves identity.
- Masters request capacity; runtime admits capacity.
- Background presence does not itself grant consequential authority.

## Required proposed state

Department, Resident, Capability, ResidentSubscription, WorkItem, WorkerInstance, SessionIncarnation, WakeEvent, ContextCheckpoint, AttentionBudget.

These are proposed runtime objects, not yet Ω canonical schema.

## Promotion evidence

Before U2A promotion, prove on Windows and the installed substrate:

- resident survives session replacement;
- two work items can use the same capability through distinct worker instances;
- dormant resident retains identity;
- one durable trigger causes one bounded governed wake;
- burst triggers coalesce;
- unrelated resident history is excluded from worker/sentinel context;
- attention limits constrain background inference;
- restart reconstructs dormant residents;
- no sentinel bypasses authorization.