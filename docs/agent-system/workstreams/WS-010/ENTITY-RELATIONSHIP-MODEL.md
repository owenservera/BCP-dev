# WS-010 — V0 Entity / Relationship Model

> **Classification: DERIVED — PROPOSED V0**

## 1. Entity principle

Everything represented by the observatory is an entity with, where available:

- stable identity;
- human-readable name;
- contextual description;
- kind;
- source references;
- state dimensions;
- provenance;
- relationships;
- uncertainty/conflict.

An entity need not become a database row in the eventual implementation.

## 2. Initial entity kinds

Program structure: Program, Territory, Workstream, Area, Subsystem, Boundary.

Work and coordination: Work, Task, Gate, Blocker, Attention Condition, Owner,
Principal, Agent, Session, Branch, Worktree.

Engineering: Repository, Directory, File, Commit, Pull Request, Issue, Test,
Build/Gate, Generated Artifact.

Knowledge/evidence: Decision, Claim, Evidence, Packet, Handoff, Transcript,
Report, Experiment, Migration Record.

State/reference: Conflict, Unknown, Snapshot, Derivation, Source Reference.

The vocabulary is intentionally open. New kinds require a reason and source.

## 3. State dimensions

| Dimension | Examples |
|---|---|
| Authority | authoritative, supporting, non-authoritative, unknown |
| Lifecycle | current, active, proposed, historical, superseded, stale, conflicted, unknown |
| Origin | authored, generated, derived, imported, transcript, experimental |
| Visibility | tracked, untracked, ignored, environment-local, absent |
| Ownership | owner-directed, workstream, subsystem, shared, unknown |
| Governance | protected, generator-only, tool-governed, cleanup-safe, owner-required |

Not every entity needs every dimension. Absence is not a positive value.

## 4. Relationship contract

A relationship has:

- subject entity;
- predicate;
- object entity;
- source/evidence;
- derivation method;
- confidence/epistemic qualifier where justified;
- temporal validity where known;
- conflict state where applicable.

Geometric adjacency never creates a semantic relationship.

## 5. Human-readable representation

Every entity has:

**Display name** — natural-language identity.

**Context sentence** — what the entity is doing in the program.

**State sentence** — current relevant state in natural language.

**Evidence line** — where that state comes from.

**Technical references** — IDs, paths, SHAs, branches, URLs, etc., secondary.

Example:

> **Repository Truth & Drift**
>
> Determines what exists in the repository, what governs it, what is historical
> or stale, and where independent surfaces disagree.
>
> **Current state:** registered research workstream; implementation not proven.
>
> **Evidence:** P1 portfolio, WS-002 charter, current workstream registry.
>
> P1-02 · WS-002

The technical identifiers are useful but not necessary to understand the object.

## 6. Identity rules

Never merge because of same display name, similar path, same numeric identifier
in different scopes, or semantic similarity inferred only by an LLM.

Prefer canonical source IDs and explicit relationships.

Ambiguity produces unresolved identity, not a guessed merge.

## 7. Conflict representation

A conflict is itself representable:

    Claim A ── conflicts-with ── Claim B
       |                            |
    source A                     source B
       |                            |
    authority A                  authority B

If existing authority resolves the conflict, display that resolution while
preserving the losing/historical claim.

If no authority resolves it, the conflict remains visible.

## 8. Derived-model rule

The observatory model is rebuildable from source systems.

No user action in the observatory may be required to preserve project truth.

Deleting cache/projection state must not destroy source state.
