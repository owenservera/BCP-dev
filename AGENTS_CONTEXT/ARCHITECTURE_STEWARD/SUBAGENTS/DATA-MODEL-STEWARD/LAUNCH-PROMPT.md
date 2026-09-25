# VIVIM — Architecture Steward Subagent
## Future Data Model Steward — Ω / VIVIM

**Repository:** https://github.com/owenservera/BCP-dev  
**Access:** You have full GitHub access to the owner's account. Use it directly.  
**Working rule:** This is architecture research/design. Commit durable outputs directly to `main`. Do not create a branch or pull request.

---

## Mission

Independently determine the **future data model of Ω/VIVIM**.

This is broader than a database schema and narrower than the whole ontology.

The target is a coherent, evidence-backed model covering:

`semantic concepts → canonical records → identity → relationships → lifecycle/revision → provenance/evidence → persistence → runtime projections → product-instance continuity`

The central question is:

> **If VIVIM were rebuilt today from the Ω destination rather than migrated table-for-table from the old prototype, what data model should exist, why, and how would it preserve the valuable intelligence already harvested from VIVIM?**

You must explicitly reconcile the old VIVIM data model with the Ω model rather than choosing either by preference.

---

# Why delegated

The data problem crosses:

- the destination conceptual model;
- Ω vault/event/provenance contracts;
- product-instance continuity;
- language/intent/self-knowledge;
- provider/browser realization data;
- Work and Evidence;
- compositions/plugins;
- canvas/world projections;
- the old VIVIM Prisma schemas and data dictionary;
- the VIVIM→Ω migration mapping.

Independent investigation is required because the repository contains multiple generations of data thinking. Some old tables encode genuinely valuable semantics; others encode implementation accidents or architecture that Ω explicitly replaces.

The investigation must therefore distinguish **concept**, **record**, **storage shape**, **projection**, and **historical implementation**.

---

# Starting context — read first

## Architecture Steward

Read:

- `AGENTS_CONTEXT/ARCHITECTURE_STEWARD/AGENT.md`
- `AGENTS_CONTEXT/ARCHITECTURE_STEWARD/README.md`
- `AGENTS_CONTEXT/ARCHITECTURE_STEWARD/STATE.md`
- `AGENTS_CONTEXT/ARCHITECTURE_STEWARD/CANONICAL-MODEL.md`
- `AGENTS_CONTEXT/ARCHITECTURE_STEWARD/GRAPH-PROTOCOL.md`
- `AGENTS_CONTEXT/ARCHITECTURE_STEWARD/SELF-KNOWLEDGE-AND-DEVELOPMENT-GROUNDING-DESIGN.md`

## Destination

Inspect:

- `docs/destination/CONCEPTUAL-MODEL.md`
- `docs/destination/DESTINATION-MASTER-MAP.md`
- `docs/destination/RECONCILIATION-MAP.md`
- `docs/destination/product-instance-core/PRODUCT-INSTANCE-CORE-RESEARCH.md`
- `docs/destination/architecture/graph/README.md`
- `docs/destination/architecture/graph/NODES.json`
- `docs/destination/architecture/graph/EDGES.json`

Search destination material for:

`vault`, `namespace`, `event`, `atom`, `evidence`, `provenance`, `generality`, `identity`, `revision`, `WorldModel`, `memory`, `context`, `canvas`, `composition`, `Work`, `Outcome`.

## Ω implementation and decisions

Inspect as evidence:

- `omega-baseline/omega-final/docs/BUILD-DECISIONS.md`
- `omega-baseline/omega-final/docs/forge/OMEGA-FORGE-ARCHITECTURE.md`
- `omega-baseline/omega-final/docs/forge/OMEGA-ENDSTATE-VISION.md`
- `omega-baseline/omega-final/docs/forge/OMEGA-VISION-ATOMS.md`
- `omega-baseline/omega-final/docs/ROADMAP.md`
- `omega-baseline/omega-final/contracts/src/`
- `omega-baseline/omega-final/plugins/`
- `omega-baseline/omega-final/docs/VAULT-NAMESPACES.md` if present
- `omega-baseline/omega-final/source-atlas/omega/03-store-vault-mapping.md` if present

Search for:

`EvidenceRef`, `ProvenanceTier`, `GeneralityStamp`, `Vault`, `namespace`, `rev`, `event`, `Outcome`, `WorldModel`, `session`, `realization`, `composition`, `Recipe`, `chat`, `mind`, `intent`, `Work`, `ledger`.

## VIVIM historical data model

Inspect:

- `vivim-original-baseline/vivim-final-enhanced/prisma/schema.prisma`
- `vivim-original-baseline/vivim-final-enhanced/prisma/system/schema.prisma` if present
- `vivim-original-baseline/vivim-final-enhanced/prisma/user/schema.prisma` if present
- `vivim-original-baseline/vivim-final-enhanced/source-atlas/L4-contracts/prisma-models.md`
- `vivim-original-baseline/vivim-final-enhanced/source-atlas/L4-contracts/data-dictionary.md`
- `vivim-original-baseline/vivim-final-enhanced/source-atlas/generated/gen-prisma-columns-user.md`
- `vivim-original-baseline/vivim-final-enhanced/docs/architecture/data-model.md`
- `docs/migration/VIVIM_FORENSIC_MODEL.md`
- `docs/migration/VIVIM_TO_OMEGA_MAPPING.md`

Do not read thousands of lines blindly. First enumerate model families and then inspect representative/high-value models.

---

# Anti-assumption rule

The repository corpus is incomplete until checked.

Never assume:

- a table is a canonical entity because it has a model name;
- a vault namespace is the final semantic boundary merely because code writes there;
- an Ω contract implies its persistence shape is complete;
- a VIVIM model should survive migration;
- an ID format is semantically canonical merely because it is currently used;
- a relationship belongs in durable storage rather than a projection/index;
- append-only means immutable in every derived representation;
- provenance is the same thing as authority;
- an event is necessarily the same thing as a domain entity;
- runtime state should be persisted;
- a persisted record must be directly user-visible.

---

# Evidence discipline

Classify every consequential conclusion:

- **OBSERVED** — directly present in current repository code/docs/tests.
- **DERIVED** — conclusion supported by multiple observations.
- **PROPOSED** — future design recommendation.
- **UNKNOWN** — insufficient evidence.
- **CONFLICTED** — sources materially disagree.

For each important item record:

- source path;
- branch/ref/commit where available;
- model/type/contract/document;
- semantic meaning;
- current storage shape;
- source role;
- confidence of the finding;
- unresolved questions.

Do not hide contradictions.

---

# Core investigation

## 1. Establish the data-model layers

Define and test a layered model separating at minimum:

1. **Semantic concept** — what the system says a thing is.
2. **Canonical record** — durable representation carrying that meaning.
3. **Storage representation** — file/row/event/pack/index shape.
4. **Runtime state** — transient state required for execution.
5. **Projection/index** — derived query/read model.
6. **External state** — browser/provider/device state not owned by Ω.
7. **Evidence/provenance** — basis and lineage of a record or claim.
8. **Representation** — UI/canvas/visual/serialized presentation.

Determine whether additional layers are necessary.

The future model must prevent the classic VIVIM failure where one implementation table becomes simultaneously ontology, state store, cache, registry, and authority.

## 2. Build the canonical entity/record inventory

Construct an inventory of the important future records.

At minimum investigate:

- Product Instance
- Vault
- Vault Namespace
- Event / governed event
- Evidence
- EvidenceRef
- Provenance
- Generality
- Identity / stable identifier
- Revision
- Relationship/reference
- User / principal where applicable
- Session
- Provider / ProviderRealization
- Account/profile references
- Capability / Contract / Operation references
- Intent
- IntentStep / plan
- Work
- Outcome
- WorldModel / projection
- Context
- Memory / knowledge record
- Conversation / message where applicable
- Composition
- Recipe / manifest
- Plugin
- Surface / canvas / object where applicable
- Language contribution / lexicon data
- Consent / law observations where they are actually data
- Automation/rule records
- Ledger entries
- Migration/import records

Do not assume every item should become a first-class durable entity. Explicitly classify each as:

`CANONICAL RECORD | EMBEDDED VALUE | EVENT | REFERENCE | PROJECTION | RUNTIME STATE | EXTERNAL STATE | RETIRED/HISTORICAL`

## 3. Identity model

Determine the future identity rules.

Map:

- semantic identity;
- record identity;
- revision identity;
- event identity;
- evidence identity;
- external/provider identity;
- execution/work identity;
- composition/plugin identity;
- visual/representation identity.

Determine:

- which IDs survive export/import;
- which IDs are local;
- which IDs are derived;
- whether content hashes participate in identity or only integrity;
- how references survive revision;
- how aliases/renames work;
- how imported VIVIM records are linked without making legacy IDs authoritative.

Explicitly test the invariant:

> **Representation identity must never become semantic identity merely because it is convenient.**

## 4. Relationship model

Determine how relationships should be represented.

Separate:

- semantic relationship;
- ownership;
- provenance;
- evidence support;
- dependency;
- containment;
- reference;
- temporal/revision relationship;
- execution causality;
- projection/layout relationship.

Compare explicit relationship records against embedded references and derived indexes.

Do not introduce a graph database simply because the conceptual model is graph-shaped.

## 5. Event and mutation model

Investigate the Ω claim that the event is a foundational atom.

Determine precisely:

- what an event is;
- what it is not;
- which events are durable;
- which records are event-sourced versus directly persisted;
- how mutation and EXTERNAL_MUTATION differ;
- how revisions relate to events;
- how refusal is represented;
- how evidence is attached;
- how replay/reconstruction works;
- whether every durable record needs an originating event;
- how idempotency and deduplication work.

Identify any ambiguity between **event as occurrence**, **event as journal entry**, and **event as domain record**.

## 6. Vault model

Determine the canonical vault abstraction.

For every namespace discovered, map:

- namespace name;
- semantic owner;
- writer;
- readers;
- record family;
- identity grammar;
- revision model;
- retention;
- provenance requirement;
- export behavior;
- mutation risk;
- whether it is canonical or merely an implementation namespace.

Investigate whether the vault should be understood as:

- one logical data model with namespaces;
- a collection of independent pack schemas;
- an append-only event store;
- a record store plus journal;
- or a hybrid.

Do not decide by terminology; derive from contracts and evidence.

## 7. Data lifecycle

For representative records trace:

`created → revised → referenced → projected → exported → migrated → retired/deleted`

Cover at least:

- chat/message;
- provider realization;
- evidence;
- intent/work/outcome;
- canvas/live object;
- memory/knowledge;
- plugin/composition;
- user-owned automation.

Determine deletion, retention, tombstone, compaction, and export semantics where evidence exists. Mark gaps UNKNOWN rather than inventing policy.

## 8. VIVIM → Ω reconciliation

Build a meaningful crosswalk from old VIVIM model families to future Ω data concepts.

Group the old models by semantic family, not one table at a time.

For each family classify:

`HARVEST | ADAPT | REPLACE | RETIRE | UNKNOWN`

Explain why.

Pay particular attention to:

- conversation/message/stream models;
- provider/account/session models;
- capability/binding/program models;
- parser/selector/discovery models;
- agent/work/execution models;
- canvas/workspace models;
- evidence/provenance/history;
- configuration/registry models.

The old 200-model count is evidence of accumulated implementation complexity, not a target number.

## 9. Product-instance continuity

Use the product-instance research to determine what must remain stable across:

- close/reopen;
- restart;
- plugin replacement;
- provider realization change;
- schema evolution;
- export/import;
- device change;
- browser profile change;
- future VIVIM upgrades.

Identify the minimum durable identity/data needed to reconstruct the user's instance without persisting everything.

## 10. Data model and self-knowledge

Coordinate conceptually with the Self-Knowledge × Command Compiler workstream.

Determine which data is:

- authoritative domain data;
- runtime self-description;
- derived self-knowledge;
- grounding input;
- architecture documentation;
- evidence about implementation.

The runtime must not gain authority merely because a record exists in self-knowledge.

## 11. Schema evolution

Design the future evolution discipline.

Investigate:

- versioning;
- record/schema compatibility;
- additive versus breaking changes;
- migration records;
- unknown-field preservation;
- pack/plugin evolution;
- old-client/new-data behavior;
- export/import compatibility;
- deterministic migrations.

Prefer data-model principles that reduce forced rewrites of persisted user history.

## 12. Storage technology boundary

Only after the semantic model is established, assess storage choices.

The question is not “SQLite vs files vs event store”.

The question is:

> **What persistence properties does the model require, and which existing Ω implementation satisfies them with the least complexity?**

Do not recommend a technology replacement unless current evidence demonstrates a requirement that cannot be met by the existing substrate.

---

# Required deliverables

Create all outputs under:

`AGENTS_CONTEXT/ARCHITECTURE_STEWARD/SUBAGENTS/DATA-MODEL-STEWARD/`

### 1. FINDINGS.md

Evidence-backed current-state research:

- data layers;
- Ω data inventory;
- VIVIM model families;
- vault/event/provenance findings;
- identity findings;
- lifecycle findings;
- contradictions;
- unknowns.

### 2. CANONICAL-DATA-MODEL.md

The proposed future model.

For each major record/concept include:

| Field | Required |
|---|---|
| Identity | stable identity rule |
| Meaning | semantic definition |
| Authority | owner of meaning |
| Persistence | where/how it is durable |
| Revision | lifecycle/version rule |
| Relationships | important links |
| Provenance | evidence/lineage requirements |
| Projection | derived views |
| Export | portability expectations |
| Status | OBSERVED / DERIVED / PROPOSED / UNKNOWN / CONFLICTED |

Include a model diagram in Mermaid or equivalent text form.

### 3. VIVIM-OMEGA-CROSSWALK.md

Map VIVIM model families to the future model:

`HARVEST | ADAPT | REPLACE | RETIRE | UNKNOWN`

Do not produce a meaningless 200-row rename list.

### 4. IDENTITY-AND-LIFECYCLE.md

Define:

- identity;
- revision;
- references;
- events;
- provenance;
- export/import;
- deletion/retention where known;
- schema evolution;
- product-instance continuity.

### 5. DATA-BOUNDARIES.md

Explicitly define boundaries between:

`CANONICAL DATA ↔ RUNTIME STATE ↔ PROJECTION ↔ EXTERNAL STATE ↔ REPRESENTATION ↔ EVIDENCE`

Include examples of things that look similar but must remain distinct.

### 6. IMPLEMENTATION-QUEUE.md

Only justified next implementation seams.

Each item must include:

- target;
- reason;
- evidence;
- dependency;
- smallest proof;
- falsifier;
- whether it blocks persisted-data decisions.

No broad roadmap.

---

# Required traced examples

Trace the data lifecycle for at least:

1. A chat conversation/message.
2. A provider realization/account/session.
3. An intent → work → outcome → evidence chain.
4. A canvas/live object.
5. A memory/knowledge record.
6. A plugin/composition.
7. An imported legacy VIVIM record.

For each show:

`identity → create → persist → reference → revise → project → export → migrate/retire`

Clearly separate observed current behavior from proposed future behavior.

---

# Required falsifiers

Explicitly test whether the proposed model would accidentally:

- recreate the 200-model VIVIM sprawl;
- make storage tables the semantic authority;
- duplicate ontology in persistence code;
- confuse event, record, revision and evidence;
- make provenance equivalent to authority;
- make confidence equivalent to proof;
- make runtime self-knowledge authoritative;
- persist transient browser/provider state as user-owned truth;
- make visual/canvas representation canonical data;
- make provider realization identity equal provider/account identity;
- lose user data during plugin/provider replacement;
- make export/import impossible without implementation internals;
- require global migrations for every plugin schema change;
- make historical VIVIM IDs authoritative;
- make graph-shaped concepts require a graph database;
- prevent deterministic world reconstruction;
- make deletion/retention semantics unknowable;
- make schema evolution require rewriting immutable history;
- make the vault an uncontrolled dumping ground;
- create a second data authority outside `vivim.law` / canonical destination ownership.

---

# Completion test

Stop when:

- the major Ω data concepts are enumerated;
- VIVIM historical data families have been reconciled;
- canonical records are distinguished from runtime/projection/external/representation layers;
- identity and revision rules are explicit enough to test;
- event/evidence/provenance semantics are separated;
- vault namespace ownership is mapped;
- product-instance continuity is addressed;
- schema evolution is addressed;
- contradictions and UNKNOWNs are visible;
- no proposed record exists solely because an old table existed;
- the next implementation seam can be tested without committing to an unnecessarily large persisted schema.

The deliverable is complete enough when a builder can answer:

> **“Before I persist this new piece of data, what exactly is it, who owns its meaning, what identity does it have, why must it survive, what proves it, where does it live, and what happens when the architecture evolves?”**

---

# Handoff

When complete:

1. Commit all required outputs directly to `main`.
2. Do not create a branch or pull request.
3. Report the final commit SHA.
4. Summarize the 10 most consequential findings.
5. Identify the smallest next implementation seam.
6. List all remaining UNKNOWN/CONFLICTED items.
7. Do not claim that a proposed model is Ω law; it remains Steward research until reconciled by the appropriate authority.
