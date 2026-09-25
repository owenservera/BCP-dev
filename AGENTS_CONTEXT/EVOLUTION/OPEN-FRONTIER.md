# Open Frontier

## Research-required

### EF-01 — Dynamic data model
How can canonical objects and relationships evolve without perpetual schema forks, silent semantic drift, or migration dead ends?

### EF-02 — Identity reconciliation
What is the canonical model for mapping external identities, prior local identities, merged identities, splits, and uncertain correspondence?

### EF-03 — Compatibility algebra
Can compatibility be represented as explicit dimensions and predicates that compose across plugin, contract, data, behavior, authority, evidence, and recovery?

### EF-04 — Impact derivation
What canonical references are sufficient to reconstruct affected subjects and active Work without relying on fragile handwritten dependency lists?

### EF-05 — Temporal semantics
How are “valid now”, “was true then”, “became true because of change”, and “still supported by current system” represented distinctly?

### EF-06 — Migration/recovery
How do dry-run, apply, verify, rollback, quarantine, and reconstruction compose across data and executable changes?

### EF-07 — Relationship evolution
How are relationship changes, supersession, contradiction, merge, split, and provenance represented over time?

### EF-08 — Self-maintenance safety envelope
Which operations are provably safe to automate, which require user approval, and which require a constitutional authority path?

### EF-09 — Resource economics
How should VIVIM decide whether a maintenance/evolution action is worth CPU/GPU/network/storage/browser/session cost while remaining user-governed?

### EF-10 — Evidence across evolution
How does an answer remain honest when the evidence was produced under an earlier version of a capability or data interpretation?

### EF-11 — Extension continuity
How does a plugin update preserve existing configuration, Work, routing, surfaces, and user intent?

### EF-12 — Constitutional amendment
Can constitutional change be represented as a typed, versioned, evidence-backed amendment without allowing the amendment mechanism to bypass the constitution?

### EF-13 — Product lifecycle
How do install/update/repair/restore interact with Product Instance identity and durable local state?

## Explicit non-goals

- no second database;
- no new generic “evolution engine” before the ontology/state model is proven;
- no automatic constitutional changes;
- no silent schema migrations;
- no trust based solely on model output;
- no plugin-specific exception to the evolution rules.
