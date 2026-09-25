# VIVIM → Ω Build Context
> STATUS: HISTORICAL CONTEXT DRAFT (cleanup 2026-09-23). Superseded as the
> entry point by the root `/BUILD_CONTEXT.md`. Read this for genealogy.

## The Problem

VIVIM already contains years of accumulated product behavior, provider knowledge, browser automation knowledge, parsing logic, data models, discovery machinery, and user-facing semantics.

Ω is a deliberate redesign of the underlying architecture.

The task is therefore not:

> "rewrite VIVIM."

It is:

> **preserve the valuable knowledge and behavior of VIVIM while transforming it into the Ω architecture.**

## The Three Roles

### VIVIM

VIVIM is the mine.

It contains:

- working behavior
- provider knowledge
- implementation history
- data schemas
- parsers
- browser execution behavior
- discovery logic
- capability semantics
- accumulated edge cases

Treat it as evidence, not architectural authority.

### BCP

BCP is the forge.

BCP determines:

```text
what VIVIM knows
        ↓
what is worth preserving
        ↓
what the semantic capability is
        ↓
how that capability fits Ω
        ↓
how to implement it
        ↓
how to prove it
```

### Ω

Ω is the destination architecture.

Its governing idea is:

> **Everything is a plugin except the smallest machinery required to safely compose and execute plugins.**

The goal is not merely modularity.

The goal is **replaceability**.

## Replaceability

A healthy Ω feature should look like:

```text
stable contract
      ↑
      │
 ┌────┴────┐
 │         │
impl v1   impl v2
 │         │
 └────┬────┘
      ↓
 composition chooses implementation
```

The contract is the durable semantic boundary.

Implementations are replaceable.

## Important Consequence

Do not ask:

> "Where do we put ChromeGovernor?"

Ask:

> "What stable capabilities does ChromeGovernor currently provide, and which of those should become independently replaceable Ω contributions?"

Likewise, do not ask:

> "How do we move the Prisma schema?"

Ask:

> "What durable information and behavior does the schema represent, and what should the Ω data contracts be?"

## Migration Unit

The preferred migration unit is:

```text
behavior
→ semantic capability
→ Ω contract
→ Ω plugin
→ composition
→ conformance evidence
```

not:

```text
source file
→ source file
```

## Final Outcome

The desired final VIVIM should be capable of evolving like this:

```text
new requirement
    ↓
new or amended contract
    ↓
new plugin / replacement plugin
    ↓
conformance
    ↓
composition update
    ↓
safe activation
```

without requiring the system to be structurally rewritten.

## Architectural Question to Keep Asking

> **"What allows us to improve this later without breaking everything around it?"**

That question should influence contracts, plugin boundaries, data representation, provider architecture, discovery, browser execution, and the migration itself.
