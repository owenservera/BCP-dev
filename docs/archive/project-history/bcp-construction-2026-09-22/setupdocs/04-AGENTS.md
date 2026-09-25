# AGENTS.md — BCP-dev Build Governance
> STATUS: HISTORICAL GOVERNANCE DRAFT (cleanup 2026-09-23). Principles stand;
> superseded as the entry point by the root `/AGENTS.md`. Read this for
> genealogy, not for orders.

## Mission

BCP-dev is the integration forge for the next VIVIM.

There are three distinct assets:

```text
vivim-original-baseline/vivim-final-enhanced
    = VIVIM prototype / accumulated product knowledge
    = behavioral mine
    = evidence of what VIVIM already knows and does

bcp-speed/bcp
    = BCP
    = forensic analysis + extraction + transformation + verification
    = integration forge

omega-baseline/omega-final
    = VIVIM Ω
    = destination architecture
    = fresh, everything-is-a-plugin runtime
```

The intended direction is:

```text
VIVIM prototype
    ↓
assay / understand / preserve
    ↓
BCP
    ↓
forge Ω-native contracts, plugins, packs, data, tests
    ↓
VIVIM Ω
    ↓
FINAL VIVIM
```

## Architectural North Star

Ω is an **everything-is-a-plugin architecture**.

The µhost is intentionally minimal. Plugins provide the system's capabilities, implementations, providers, discovery engines, language contributions, storage, surfaces, and other functionality.

The core stability boundary is:

```text
CONTRACT
    ↓
IMPLEMENTATION PLUGIN
    ↓
COMPOSITION
    ↓
RUNTIME
```

A capability must be replaceable without requiring unrelated consumers or the µhost to change.

The desired lifecycle is:

```text
implementation v1
    ↓
implementation v2
    ↓
same stable contract
    ↓
conformance
    ↓
new composition
    ↓
safe activation
```

### Critical Principle

**Do not turn VIVIM's existing architecture into Ω's architecture merely because VIVIM already contains it.**

VIVIM provides accumulated knowledge.

Ω provides the architectural model.

BCP performs the semantic translation between them.

## Migration Rules

### 1. Never port the VIVIM monolith

Do not copy large VIVIM subsystems into Ω merely to make a feature work.

First determine:

- what behavior actually matters
- what is semantic versus implementation-specific
- what should become a contract
- what should become a plugin
- what belongs in data
- what is merely historical or accidental complexity

### 2. Contracts before implementations

When migrating functionality:

```text
behavior
  ↓
semantic identity
  ↓
contract
  ↓
plugin implementation
  ↓
composition
  ↓
evidence
```

Do not allow an implementation detail to become an accidental contract.

### 3. Preserve semantics, not source structure

Source-level similarity is not the migration goal.

The goal is:

```text
old useful behavior
        ≈
new Ω behavior
```

with explicit evidence for important equivalence claims.

### 4. Prefer extraction over embedding

When a VIVIM subsystem contains several independent responsibilities, look for natural plugin boundaries.

Prefer:

```text
A contract
B contract
C contract

plugin A
plugin B
plugin C
```

over:

```text
one giant plugin containing A+B+C
```

unless there is a demonstrated reason that they must remain together.

### 5. Shared components must remain replaceable

A component used by many plugins is not automatically "core."

Ask:

> Can this remain behind a stable contract and be upgraded independently?

The answer should be yes whenever practical.

### 6. Data may be more appropriate than code

Provider knowledge, vocabulary, parser metadata, capability mappings, selectors, policy metadata, and similar knowledge should be modeled as data when Ω's architecture permits it.

Do not hard-code knowledge simply because the old VIVIM implementation did.

### 7. BCP must not create a second ontology unnecessarily

Reuse Ω's existing vocabulary and contracts wherever they genuinely fit.

Do not introduce a parallel:

```text
BCP capability model
BCP provider model
BCP plugin model
BCP contract model
```

when Ω already provides the appropriate abstraction.

## Required Thinking for Every Migration

For every significant VIVIM capability, identify:

```text
1. Behavioral purpose
2. Existing VIVIM implementation(s)
3. Existing data/knowledge
4. Semantic contract
5. Candidate Ω contribution kind
6. Candidate plugin boundary
7. Dependencies
8. Upgrade boundary
9. Conformance evidence
10. Retirement path for the old implementation
```

## Upgradeability Test

Before accepting an Ω design, ask:

> Could we replace this implementation with a substantially better implementation without modifying the µhost or unrelated consumers?

If the answer is no, investigate whether the boundary is wrong.

## Evidence

Claims about migration are not accepted merely because the code compiles.

Prefer:

```text
fixture
→ test
→ conformance
→ live proof where applicable
→ recorded evidence
```

For browser/provider functionality, distinguish clearly between:

```text
recorded fixture proof
simulated proof
live execution proof
```

Never describe one as another.

## Working Order

When uncertainty exists, prefer this order:

```text
understand Ω
→ define stable boundary
→ assay VIVIM
→ map behavior
→ forge plugin
→ prove plugin
→ compose
→ replace
→ retire legacy
```

Do not reverse this into "find a place for the legacy code."

## Repository Rules

- Read the nearest applicable `AGENTS.md` before modifying a subtree.
- More-specific nested `AGENTS.md` rules govern that subtree.
- Ω's own `omega-baseline/omega-final/AGENTS.md` governs Ω-specific implementation rules.
- Treat ratified Ω decisions as immutable; supersede rather than edit.
- Do not weaken Ω gates to make migration easier.
- Never silently convert an unproven assumption into an architectural fact.
- Keep BCP, VIVIM, and Ω responsibilities conceptually separate.

## Default Agent Behavior

When a migration question is ambiguous:

1. inspect the existing Ω contracts and plugin architecture;
2. inspect the relevant VIVIM behavior;
3. identify the smallest stable semantic boundary;
4. explain the mapping;
5. implement only after the boundary is understood.

The agent's job is not to maximize migrated code.

The job is to maximize **useful behavior successfully transformed into a replaceable Ω architecture**.
