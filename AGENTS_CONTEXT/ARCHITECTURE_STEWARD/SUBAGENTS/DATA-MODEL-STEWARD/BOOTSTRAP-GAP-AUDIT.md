# CFA-02 Data Steward — Final Bootstrap Gap Audit

> Status: **PROVISIONAL / BOOTSTRAP CLOSURE INPUT**
> Date: 2026-09-25

## 0. Executive finding

The bootstrap established the right center of gravity — Data Steward as continuity steward, plus the Data Continuity Lens — but it overfocused on identity/lineage and underexplored the physical and operational behavior of durable data.

The repository reveals that several important continuity dimensions deserve explicit CFA-02 treatment:

- atomicity and concurrency;
- large/binary content;
- retention/deletion/compaction;
- multi-device divergence and merge;
- external source disappearance/change;
- cross-vault merge and identity collision;
- deterministic canonicalization/deduplication;
- namespace/data-contract governance;
- derived projection consistency;
- disclosure/privacy at the data boundary;
- integrity versus semantic correctness;
- scale and repair;
- user correction;
- Product Instance continuity.

The key conclusion is:

> **Data continuity is not only lineage through representations. It is continuity through time, failure, distribution, lifecycle, storage physics, access boundaries, and replacement.**

These findings are recorded here before bootstrap closure so they are not lost when the role moves from self-design into empirical execution.

---

# 1. Gap taxonomy

| Class | Meaning |
|---|---|
| DURABILITY | Survival through failure, restart, corruption, storage movement and time. |
| CORRESPONDENCE | Correct mapping between representations and identities. |
| LIFECYCLE | Retention, archive, deletion, compaction, replacement and restoration. |
| DISTRIBUTION | Copies, devices, imports, exports and external-source divergence. |
| DERIVATION | Correctness/freshness/rebuildability of projections and indexes. |
| GOVERNANCE | Ownership, disclosure, retention and mutation constraints at the data boundary. |

---

# 2. Top missed gaps

## GAP-01 — Mutation atomicity, concurrency and crash windows

**Class:** DURABILITY
**Priority:** CRITICAL

I discussed revisions but did not initially make atomic multi-record mutation a first-class Data Steward concern.

The current Ω vault already demonstrates why it matters: single-writer discipline, append prediction, two-phase journaling, transaction boundaries, message/index critical sections, crash recovery, and plan-driven compaction.

The real question is:

> **When several pieces of durable state must move together, what exactly constitutes one data mutation, what partial states are possible, and how are they recovered or reconciled?**

Examples:

- message + conversation index;
- Work attempt + outcome;
- object + relationship;
- object + source-identity mapping;
- projection basis + repair/index state.

### Context required

**DATA-MUTATION-CONTINUITY.md** covering:
- transaction scope;
- single-writer assumptions;
- revision/CAS rules;
- cross-record atomicity;
- idempotency and retry;
- causation IDs;
- crash windows;
- recovery versus rollback;
- deliberately eventual-consistency cases.

### Tool required

**Mutation Boundary Inspector**

Given a mutation, show:

`records → ordering → transaction boundary → causation → retry/idempotency → crash windows → recovery → derived consequences`

Reuse existing vault gates and tests rather than inventing another transaction framework.

---

## GAP-02 — Large content, attachments and binary continuity

**Class:** DURABILITY / LIFECYCLE
**Priority:** CRITICAL

The bootstrap mostly treated canonical data as structured JSON. The repository explicitly leaves large/binary backing experiment-required, while legacy VIVIM contains MessageAttachment, MediaAttachment, content units and file/document distinctions.

Important distinctions already recognized in destination research:

`object identity ≠ source identity ≠ content identity`

The unresolved part is operational: how large content survives path changes, deduplication, export/restore, encryption, replacement and missing-source conditions.

### Context required

**CONTENT-RESOURCE-CONTINUITY.md** covering:
- inline versus content-ref;
- CID semantics;
- CAS lifecycle;
- large-file thresholds;
- deduplication;
- streaming;
- attachment relationships;
- missing content;
- content replacement;
- export/import;
- local path versus canonical resource identity.

### Tool required

**Content Continuity Probe**

`file → canonical object → CID → move path → duplicate → export → restore → verify → mutate → new CID/revision`

Existing CONTENT-STORAGE research already names this experiment; CFA-02 needs to own the continuity analysis around it.

---

## GAP-03 — Retention, deletion, archive, compaction and forgetting

**Class:** LIFECYCLE
**Priority:** CRITICAL

I noted retention but did not initially model it as a full data lifecycle system.

The repository has strong evidence here: namespace-specific retention, hot/cold revisions, tombstones, compaction receipts, never-delete revision law, aged-event shredding and defined-absence after shred.

These states must not collapse:

`hide | archive | tombstone | shred projection | delete content | revoke access | external deletion`

### Context required

**DATA-LIFECYCLE-MATRIX.md**

For every durable data family:
- owner;
- writer;
- retention;
- hot/cold behavior;
- tombstone meaning;
- compaction behavior;
- reference protection;
- export behavior;
- reconstruction behavior;
- physical deletion rules.

### Tool required

**Retention/Reconstruction Auditor**

Given an object or namespace, answer what remains recoverable at time T, what can be compacted, what is protected, and what becomes defined absence.

---

## GAP-04 — Multi-device sync, forks and deterministic merge

**Class:** DISTRIBUTION
**Priority:** CRITICAL

The peer analysis discussed replacement but substantially underweighted distribution.

Ω explicitly makes vault-log synchronization the substrate and treats CRDT behavior as a merge discipline over the log. The layout substrate already demonstrates fork refusal and deterministic named merge records.

The unresolved CFA-02 question is broader:

> **What happens when two durable histories independently modify related canonical data and later converge?**

Cases include:
- same object revised on two devices;
- relationship assertions diverge;
- offline device returns after source changes;
- archive on one device versus edit on another;
- source mappings disagree;
- a device is lost and later recovered.

### Context required

**DISTRIBUTED-DATA-CONTINUITY.md**

Cover causal ordering, divergence, merge ownership, conflict records, stale devices, device retirement and recovery.

### Tool required

**Fork/Merge Lab**

Input two synthetic vault histories; output common ancestor, divergence, conflicts, deterministic merge, preserved history and unresolved cases.

Reuse the existing layout merge discipline as a pattern. Do not create another CRDT substrate.

---

## GAP-05 — External source disappearance and source-state decay

**Class:** DISTRIBUTION / CORRESPONDENCE
**Priority:** HIGH

I initially modeled external systems mainly as acquisition sources.

A sovereign local record must survive events such as:

- provider access loss;
- source object deletion;
- provider schema change;
- credentials expiring;
- external URL disappearance;
- provider account disconnection.

Those source states are not the same thing as the canonical object's lifecycle.

### Context required

**EXTERNAL-SOURCE-LIFECYCLE.md**

Use explicit states such as:

`available | stale | unreachable | deleted-externally | permission-lost | changed-externally | replaced | unknown`

### Tool required

**Source Reconciliation Simulator**

`initial observation → canonical record → source change/disappearance → next observation`

Return explicit reconciliation rather than deleting the local record.

---

## GAP-06 — Cross-vault merge, collision and identity remapping

**Class:** CORRESPONDENCE / DISTRIBUTION
**Priority:** HIGH

Export/restore was discussed, but existing-world merge deserves separate treatment. Current Ω import prefers a fresh vault; merging into a non-empty world is explicitly unresolved.

Collision classes include:

- same canonical ID / different content;
- same source identity / different canonical target;
- same content / different object identity;
- revision-chain collision;
- alias collision;
- conflicting relationship assertions.

### Context required

**IDENTITY-COLLISION-AND-MERGE.md**

### Tool required

**Identity Collision Lab**

Generate controlled collision cases and classify them:

`retain | map | merge | fork | conflict | reject`

The tool must never perform an ungoverned semantic merge.

---

## GAP-07 — Canonicalization, deduplication, idempotency and data quality

**Class:** CORRESPONDENCE
**Priority:** HIGH

I had a read/parse/normalize/reconcile pipeline, but not enough operational treatment of the distinction among these operations:

`normalize ≠ canonicalize ≠ deduplicate ≠ identify ≠ reconcile ≠ merge`

Legacy VIVIM has identity hashes and message deduplication; provider import and source observations therefore need deterministic rules for repeated observations and malformed-but-recoverable data.

### Context required

**CANONICALIZATION-AND-RECONCILIATION.md**

### Tool required

**Reconciliation Differential Runner**

Run the same observation repeatedly, compare adapter versions, expose identity decisions, detect information loss and verify idempotency.

---

## GAP-08 — Namespace contracts as a real data-governance surface

**Class:** GOVERNANCE
**Priority:** HIGH

The namespace registry exists, but I initially treated it mostly as documentation.

A namespace carries operational semantics:

`owner | writer | object shape | retention | compaction | references | export | recovery`

The repository explicitly warns that an undocumented namespace is one nobody can compact, query or trust.

### Context required

**NAMESPACE-DATA-CONTRACTS.md**

### Tool required

**Namespace Contract Inspector**

Read-only checks:
- all namespaces present;
- owner/writer declared;
- retention declared;
- compaction behavior declared;
- reference semantics declared;
- export/recovery behavior declared;
- code and docs agree.

This should be one of the smallest high-value tools added after the Continuity Lens.

---

## GAP-09 — Derived index and projection consistency

**Class:** DERIVATION
**Priority:** HIGH

I correctly identified graph, memory and context as projections, but initially underweighted the wider class:

- FTS;
- conversation indexes;
- counters;
- embeddings;
- cached portraits;
- graph snapshots;
- layout digests;
- context digest caches.

Each needs a stated source basis, derivation version, freshness rule, rebuild method and corruption/failure behavior.

### Context required

**PROJECTION-CONTRACTS.md**

### Tool required

**Projection Consistency Checker**

`projection → basis → recompute → compare`

Return:

`CURRENT | STALE | DIVERGENT | UNREBUILDABLE | UNKNOWN`

This extends the Data Continuity Lens naturally.

---

## GAP-10 — Disclosure/privacy is also a data-plane problem

**Class:** GOVERNANCE
**Priority:** HIGH

Authority owns authorization semantics, but CFA-02 must understand the data shape being exposed.

D-448 shows a concrete pattern: width-limited projections, explicit elision, evidence digests, disclosure scope and widening receipts.

The missing CFA-02 question is:

> **Can the system explain exactly which representation of durable data was exposed to which consumer, from which basis, at what freshness?**

### Context required

**DATA-DISCLOSURE-CONTINUITY.md**

### Tool required

Extend the Continuity Lens with a disclosure trace:

`target + requester + width → source → elided content → scope basis → digest → receipt → freshness`

No second privacy engine.

---

## GAP-11 — Storage integrity is not semantic correctness

**Class:** DURABILITY / CORRESPONDENCE
**Priority:** HIGH

The Ω vault already provides CAS, Merkle verification and recovery evidence. But:

`byte integrity ≠ envelope integrity ≠ reference integrity ≠ provenance integrity ≠ semantic correspondence ≠ external truth`

A perfectly hashed object can still represent the wrong thing.

### Context required

**DATA-INTEGRITY-LADDER.md**

### Tool required

Make the Continuity Lens report these layers separately rather than one generic “valid” result.

---

## GAP-12 — Scale, repair and performance are data architecture

**Class:** DURABILITY / DERIVATION
**Priority:** MEDIUM-HIGH

The repository has unusually good data-performance evidence: bounded history, getmany, index probes, compaction measurements and read-hop limits.

CFA-02 needs to know when a theoretically correct representation becomes operationally unusable.

### Context required

**DATA-SCALE-PROFILES.md**

For each family:
- cardinality;
- history depth;
- payload size;
- hot set;
- index size;
- read/write pattern;
- rebuild cost;
- export cost;
- bounded query expectations.

### Tool required

Reuse the existing headless probe pattern rather than building another benchmark platform.

---

## GAP-13 — User correction without rewriting history

**Class:** LIFECYCLE / CORRESPONDENCE
**Priority:** MEDIUM-HIGH

The second-brain destination explicitly expects the user to inspect, correct and reorganize retained information.

That requires a data semantics for:

`amend | retract | supersede | archive | tombstone | correct metadata | correct interpretation | deny correspondence`

### Context required

**USER-DATA-CORRECTION.md**

### Tool required

Continuity Lens correction trace:

`current → prior revisions → source/evidence → correction → downstream projections`

History remains inspectable.

---

## GAP-14 — Product Instance is a data boundary, not just lifecycle metadata

**Class:** DURABILITY / LIFECYCLE
**Priority:** HIGH

Product Instance is the durable identity/lifecycle boundary over one user-owned vault, while runtime process is only a session.

CFA-02 therefore needs to distinguish:

`user | product instance | device | runtime session | provider account | composition`

especially during restart, upgrade, downgrade, relocation, replacement and recovery.

### Context required

**PRODUCT-INSTANCE-DATA-BOUNDARY.md**

### Tool required

Instance-aware Continuity Lens mode that shows which identity layer owns each durable reference.

---

# 3. Highest-value context/tooling bundle

I do not want fourteen new systems.

The smallest useful extension to the existing seed is:

## Core instrument

**Data Continuity Lens — `data.continuity.trace@1`**

Already designed. It remains the center.

## Four immediate companions

### 1. Mutation Boundary Inspector
Handles atomicity, concurrency, causation and crash windows.

### 2. Namespace Contract Inspector
Handles owner/writer/retention/compaction/export/recovery declarations.

### 3. Reconciliation & Collision Lab
Handles source correspondence, deduplication, collision and merge cases.

### 4. Reconstruction / Projection Auditor
Handles derived-view rebuildability, freshness and end-to-end recoverability.

The Content Probe, Fork/Merge Lab and Scale Probe can be specialized modes or test suites of those instruments rather than separate runtime products.

---

# 4. Cold-start context stack I now need

## Tier 0 — Data Steward home

- CORE-AGENT-SEED.md
- STATE.md
- OPERATING-BASELINE.md
- CORE-TOOL-DESIGN.md
- PEER-RELATIONSHIP-ATLAS.md
- this gap audit

## Tier 1 — canonical substrate

- canonical object model;
- relationship model;
- vault namespace registry;
- vault durability;
- content/storage boundary;
- export/restore;
- Product Instance boundary.

## Tier 2 — live data corridors

- provider data model;
- provider migration mapping;
- Intent → Work → Outcome;
- surface write-back;
- memory/context;
- architecture/runtime graph grounding;
- plugin replacement.

## Tier 3 — physical evidence

- vault implementation;
- migration implementation;
- export/restore implementation;
- compaction implementation;
- relevant adapter/projection code;
- associated tests/falsifiers.

## Tier 4 — historical mine

Loaded only when a live corridor needs predecessor evidence.

This progressive model is essential because the old Prisma mine contains valuable behavior but must not become the de facto destination architecture again.

---

# 5. Bootstrap boundary after the audit

I would now characterize the Data Steward boundary as:

> **Steward durable data continuity across time, transformation, mutation, lifecycle, distribution, external-source change and architectural replacement.**

Domain meaning remains with the appropriate semantic owner.
Authority remains with Authority/Governance.
Execution remains with Agency/Work.
Provider realization remains with Capability/Provider.
Evolution lifecycle remains with Evolution.
Runtime mechanics remain with Runtime Constitution.
Architecture mapping remains with the Architecture Steward.

CFA-02 owns the continuity contracts that let those meanings remain durable, attributable and reconstructable when they cross boundaries.

---

# 6. Final bootstrap judgment

The most important thing we had almost missed is that a data model is too static a mental model for VIVIM.

The real object of stewardship is:

**the life of information.**

That life includes:

`birth → observation → capture → transformation → identity → revision → relation → projection → exposure → mutation → reconciliation → migration → replication → recovery → retirement`

The Data Continuity Lens is the right first tool because it lets me see that life without turning myself into the authority for every part of it.

The remaining gaps are now sufficiently named that the bootstrap can close without pretending they are solved.