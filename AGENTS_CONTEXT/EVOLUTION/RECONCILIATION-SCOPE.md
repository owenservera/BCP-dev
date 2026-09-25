# Reconciliation Scope

This lane exists because isolated subsystem designs are no longer enough. The hard problem is the **joins between changing domains**.

## Mandatory joins

### World ↔ Context
When an object changes, how does current context recompile without stale or contradictory representations?

### World ↔ Work
When a canonical object changes identity/state, how do active and historical Work items preserve referential continuity?

### Intent ↔ Work
When a plan or capability changes while Work is running, which version governs that Work?

### Work ↔ Agent
How does an agent remain attributable across code/version replacement?

### Work ↔ Account/Session
How are external sessions/resources preserved or invalidated by change?

### Routing ↔ Authority
When routing policy evolves, how are already-authorized and pending effects treated?

### Execution ↔ Evidence
Can evidence name the exact realization/version that produced the effect?

### Evidence ↔ Self-Knowledge
How does a changed fact automatically make derived descriptions stale/conflicted without a global correctness-dependent invalidation bus?

### Self-Knowledge ↔ Language
When capabilities/objects/semantics change, how does deterministic grounding remain current?

### Language ↔ Spatial Intent
When a semantic target changes, how does the visible/correctable intent circuit remain faithful?

### Spatial Intent ↔ Work
Which exact plan/intent revision becomes the durable Work contract?

### Work ↔ Attention
How do evolution events surface as actionable continuity to the person?

### Product Instance ↔ durable state
How does update/replacement preserve the same user's world and history?

## First-order cross-cutting problems

1. Dynamic/evolving data model and ontology.
2. Identity correspondence and reconciliation.
3. Relationship evolution and contradiction.
4. Compatibility algebra.
5. Temporal/version/causal semantics.
6. Change-impact derivation.
7. Migration + rollback + recovery.
8. Resource/lifecycle evolution.
9. Evidence semantics across versions.
10. Safe self-extension and promotion.
11. Constitutional amendment and anti-bypass.
12. Self-maintenance economics and scheduling.

The research should derive the minimum coherent model rather than create one engine per problem.
