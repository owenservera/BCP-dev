> **Classification: DERIVED — PROPOSED**
> **Workstream:** WS-002 (P1-02) · **Status:** PROPOSED research charter (not Ω law, not BCP state, not ontology)
> **Provenance:** research conversation result, preserved verbatim as the proposed basis for the authority-pointer pilot
> **Deposited:** 2026-09-24 on branch `impl-04/p1-02-authority-pointer-slice` (durability fix; pilot itself unchanged)
> **Authority note:** INHERITED / INDEPENDENTLY ESTABLISHED / PROPOSED / UNKNOWN distinctions below are part of the charter and are preserved as written.

# P1-02 / WS-002 — Repository Truth, Cleanup & Drift

> **Status:** PROPOSED charter
> **Research basis:** `owenservera/BCP-dev` `main`
> **Repository state researched:** current `main`; repository-level HEAD currently resolves beyond the substantive P1-01 integration marker recorded in `CURRENT.md`.
> **Implementation status:** NOT PROVEN; no repository changes made by this research.

---

## 0. Epistemic status

### INHERITED

The P1 portfolio defines P1-02 as the workstream for maintaining a reconciled map of repository reality — duplicates, stale docs, orphaned code, conflicting implementations, ambiguous ownership, generated drift, terminology drift, and program/architecture divergence. Its boundary is repository archaeology, cleanup, source-of-truth mapping, stale/superseded classification, cross-surface drift detection, and reconciliation proposals; it does not decide Ω law or independently harvest VIVIM behavior. (`docs/agent-system/P1-WORKSTREAM-PORTFOLIO.md` §4, L44-L52)

The same boundary is registered in the active workstream registry, where P1-02 remains research-first and has no implementation substrate or setup prompt yet. (`docs/agent-system/WORKSTREAMS.md` L22-L28; L120-L127)

The repository itself explicitly says it is a migration forge rather than a single product repository, with three deliberately different assets: VIVIM as read-only source mine, BCP as coordination/migration forge, and Ω as gated destination architecture. (`AGENTS.md` L3-L15)

### INDEPENDENTLY ESTABLISHED

The authority system is **federated**, not centralized in one file. The repository explicitly assigns different authorities to Ω law, BCP vocabulary/state, current context, live BCP state, migration records, and the VIVIM evidence mine. (`AGENTS.md` L29-L38)

There is already substantial mechanical truth-checking inside individual subsystems: BCP validation/sweep, Ω decision validation, document scanning, librarian source hashing, genome folding, process self-description, and surface-parity verification. These mechanisms are real code, not merely planned architecture. (`bcp-speed/bcp/validate.py` L1-L12; `bcp-speed/bcp/sweep.py` L1-L20; `omega-baseline/omega-final/tooling/gates/docscan.ts` L1-L10; `omega-baseline/omega-final/tooling/gates/doctruth.ts` L1-L9; `omega-baseline/omega-final/tooling/gates/genome.ts` L343-L390; `omega-baseline/omega-final/tooling/gates/surfacesync.ts` L117-L190)

The existing cleanup pass already demonstrated that many apparent duplicates are actually different semantic roles, while several genuine competing paths remain unresolved. (`docs/cleanup/REPOSITORY-CLEANUP-REPORT.md` L54-L70; `docs/cleanup/PLUGIN-AUTHORING-PATH-AUDIT.md` L15-L29; L45-L61)

### PROPOSED

P1-02 should therefore be a **reconciliation function**, not an additional authority system:

> **P1-02 establishes and maintains an evidence-backed map of what artifacts exist, what role they play, which authority governs them, what lifecycle state they occupy, what they derive from, who owns the decision about them, where they conflict, and what can safely be changed without destroying evidence or genealogy.**

### UNKNOWN

A complete repository-wide “truth graph” does not currently exist. The current system provides several local truth mechanisms and a human-maintained authority map, but there is no demonstrated single mechanism that reconciles the entire repository across BCP, Ω, VIVIM, root documentation, generated artifacts, local/untracked surfaces, and workstream ownership.

---

# 1. MISSION

## Proposed

Maintain a **reconciled, evidence-backed map of repository reality** across the BCP-dev migration forge.

P1-02 answers:

> **“Given a concrete repository artifact or concept, what is it, what governs it, what does it derive from, what is its lifecycle state, what conflicts with it, what is unknown, and what may safely happen to it?”**

The mission is intentionally narrower than “clean the repository.”

Cleanup is an **action consequent to reconciliation**, not the primary objective.

The governing principle is:

> **Reduce ambiguity without reducing evidence.**

This is consistent with the repository's existing cleanup behavior: eight historical files were moved with `git mv`, eighteen files were modified through prepend-only banners/reference repairs, and **zero files were deleted**. (`docs/cleanup/REPOSITORY-CLEANUP-REPORT.md` L9-L18; L20-L42)

---

# 2. BOUNDARY

## INHERITED

The registered boundary is:

> Repository archaeology, cleanup, disambiguation, source-of-truth mapping, stale/superseded classification, cross-surface drift detection, and reconciliation proposals.

It explicitly excludes deciding Ω law and independently harvesting VIVIM behavior. (`docs/agent-system/P1-WORKSTREAM-PORTFOLIO.md` L46-L52)

## PROPOSED refinement

P1-02 owns the **relationship between artifacts**, not the semantics that belong to another authority.

### P1-02 owns

* artifact inventory and classification;
* authority-pointer reconciliation;
* conflict and ambiguity detection;
* stale/superseded/unknown identification;
* generated/derived artifact relationship checking;
* ownership ambiguity reporting;
* duplicate/competing-implementation investigation;
* cross-surface drift detection where existing authorities can be compared;
* cleanup safety classification;
* reconciliation proposals and evidence packages.

### P1-02 reports to other workstreams

* Ω law changes → Ω decision mechanism / owner;
* semantic ontology → P1-03;
* self-knowledge/context behavior → P1-04;
* plugin-runtime mechanics → P1-05;
* authorization/governance → P1-06;
* provider reality → P1-07;
* VIVIM harvesting/migration → P1-08;
* integrated proof → P1-09.

This preserves the explicit portfolio separations. (`docs/agent-system/P1-WORKSTREAM-PORTFOLIO.md` L54-L122)

---

# 3. WHAT “REPOSITORY TRUTH” ACTUALLY MEANS

## Proposed definition

Repository truth is **not**:

* the newest document;
* whatever is in the root directory;
* whatever a current-looking README says;
* whatever Git HEAD happens to contain;
* whatever an agent believes;
* whatever a generated artifact claims without checking its derivation.

Instead:

> **Repository truth is a set of individually traceable claims about repository reality, each bound to the authority, evidence, lifecycle, provenance, ownership, and conflict state that makes the claim meaningful.**

This follows the repository's own epistemic separation:

`LAW ≠ SOURCE EVIDENCE ≠ DERIVED STATE ≠ TRANSCRIPT ≠ PROPOSAL ≠ HISTORY ≠ AGENT OPINION`. (`docs/agent-system/SYSTEM.md` L28-L45)

The existing authority map already expresses a hierarchy of this kind, separating repo entry documents, BCP state, Ω law, VIVIM evidence, historical material, and unknown/hands-off surfaces. (`docs/cleanup/AUTHORITY-MAP.md` L7-L48)

### The critical consequence

P1-02 should not replace those authorities.

It should answer:

> **“Which authority applies here, and is the artifact consistent with it?”**

That is a fundamentally different job.

---

# 4. ARTIFACT CLASSIFICATION MODEL

## Proposed: do NOT make the requested labels one enum

The research shows that the requested categories are **orthogonal dimensions**, not one mutually exclusive status list.

The existing Ω cooperative protocol already separates `CLASS` from `FRESHNESS`. (`docs/agent-system/SYSTEM.md` L74-L101)

P1-02 should extend that principle rather than collapse everything into one status field.

| Dimension        | Values                                                                                       | Meaning                                               |
| ---------------- | -------------------------------------------------------------------------------------------- | ----------------------------------------------------- |
| **Authority**    | authoritative / supporting / non-authoritative / unknown                                     | What can govern another artifact                      |
| **Lifecycle**    | current / proposed / historical / superseded / stale / conflicted / unknown                  | Where the artifact sits in time/state                 |
| **Origin**       | authored / generated / derived / imported / transcript / experimental                        | How it came into existence                            |
| **Visibility**   | tracked / ignored / untracked / environment-local / absent                                   | Whether it is observable from a given repository view |
| **Ownership**    | subsystem / workstream / owner-directed / shared / unknown                                   | Who controls decisions about it                       |
| **Relationship** | implements / derives-from / supports / supersedes / conflicts-with / duplicate-of / orphaned | How artifacts relate                                  |
| **Governance**   | protected / generator-only / tool-governed / cleanup-safe / owner-required                   | What actions are legally or procedurally permitted    |

This model is **PROPOSED**, not current repository schema.

The need for it is independently established by the repository's existing distinctions. For example:

* Ω distinguishes AUTHORITATIVE/CURRENT/DERIVED/PROPOSED/HISTORICAL/UNKNOWN. (`docs/agent-system/SYSTEM.md` L74-L101)
* Ω distinguishes RATIFIED/PROPOSED/SUPERSEDED/REJECTED decision lifecycle. (`omega-baseline/omega-final/docs/decisions/README.md` L28-L66)
* BCP distinguishes current control state from history and generated views. (`bcp-speed/bcp/RECONCILIATION.md` L42-L49)
* VIVIM is explicitly evidence, not authority. (`AGENTS.md` L21-L27; `BUILD_CONTEXT.md` L30-L35)
* generated Ω artifacts have explicit generator/derivation relationships. (`omega-baseline/omega-final/docs/librarian.json` L3-L18)

---

# 5. DISTINCTION BETWEEN THE REQUIRED CLASSES

## Current

An artifact participating in present operational reality.

This does **not** automatically mean authoritative.

For example, `docs/agent-system/CURRENT.md` is explicitly `DERIVED — CURRENT`, not Ω law. (`docs/agent-system/CURRENT.md` L1-L6; `docs/agent-system/SYSTEM.md` L94-L101)

## Authoritative

The artifact that another mechanism is obligated to treat as governing.

Ω's current law is explicitly `CURRENT-INVARIANTS.md` plus the decision index/records. (`AGENTS.md` L29-L32)

BCP's vocabulary/state authority is explicitly `state/*.yaml`, `taxonomy.yaml`, and `RECONCILIATION.md`, with state writes constrained through `bcp_tool.py`. (`AGENTS.md` L34-L38; `bcp-speed/bcp/RECONCILIATION.md` L42-L49)

## Historical

A record whose facts may remain valuable but which is no longer the current design/input.

The repository explicitly identifies `ORCHESTRATION-REDESIGN.md`, setup packets, archived material, and several Ω migration-era documents as historical. (`docs/CURRENT-CONTEXT.md` L35-L42)

## Proposed

A candidate or unfinished work product which has not become governing state.

Ω decision records explicitly use `PROPOSED` before ratification. (`omega-baseline/omega-final/docs/decisions/README.md` L52-L58)

## Superseded

Historical material for which a successor is explicitly known.

Ω requires successor linkage rather than deletion. (`omega-baseline/omega-final/docs/decisions/README.md` L30-L32; L54-L66)

The cooperative protocol similarly requires old packets to remain, marked `SUPERSEDED` with a forward pointer. (`docs/agent-system/SYSTEM.md` L94-L101; L274-L281)

## Generated

Produced by a defined generator and therefore governed by its derivation relationship.

For example, `build/genome.md` is registered as generated from `genome/layers.json` and `docs/BUILD-DECISIONS.md` by `omega:genome`. (`omega-baseline/omega-final/docs/librarian.json` L3-L18)

## Derived

Computed from other evidence but not necessarily mechanically regenerated by one dedicated writer.

The cooperative system itself is explicitly derived procedure rather than law. (`docs/agent-system/SYSTEM.md` L1-L7)

## Experimental

Created to test a proposition rather than represent settled program reality.

The interrupted Prompt-4 material is explicitly uncommitted, incomplete, and not to be treated as DONE, VERIFIED, CURRENT, or RATIFIED absent authority. (`docs/cleanup/PROMPT-4-CHECKPOINT.md` L1-L24)

## Orphaned

An artifact whose declared relationship has lost its counterpart, owner, route, or authority.

This already appears in several domain-specific mechanisms. Ω genome detects decision/layer orphan conditions. (`omega-baseline/omega-final/tooling/gates/genome.ts` L374-L385)

Surface parity detects bindings to operations that are no longer routed. (`omega-baseline/omega-final/tooling/gates/surfacesync.ts` L154-L170)

BCP flags long-unowned work through `ORPHAN_DETECTED`. (`bcp-speed/bcp/agents/fullscope-builder.md` L31-L34; L46-L50)

## Unknown

**Unknown is a valid result.**

The cooperative protocol explicitly says UNKNOWN is honest and preferred over guessing. (`docs/agent-system/SYSTEM.md` L94-L101)

This is particularly important for local untracked surfaces: the repository records `bcp-algos/`, Ω `docs/architecture/`, `examples/plugin-echo2/`, and `setupdocs.zip` as hands-off/unknown, and the cleanup explicitly took no action on them. (`AGENTS.md` L59-L61; `docs/cleanup/CONFLICT-REGISTER.md` L86-L97)

---

# 6. CURRENT SOURCE-OF-TRUTH BOUNDARIES

The repository already contains the beginnings of a strong authority graph.

## Repository / program layer

`/AGENTS.md` → `/BUILD_CONTEXT.md` → `docs/CURRENT-CONTEXT.md` is the cold-start path. (`AGENTS.md` L63-L66; `docs/agent-system/CONTEXT-INDEX.md` L19-L36)

`docs/CURRENT-CONTEXT.md` explicitly says it is a **map, not a constitution**; when it conflicts with linked authority, the linked authority wins. (`docs/CURRENT-CONTEXT.md` L1-L5)

## BCP layer

BCP state is authoritative through `state/*.yaml`, but mutations must pass through `bcp_tool.py`; history resides in append-only `log/*.yaml`; generated views are derived visualizations. (`bcp-speed/bcp/RECONCILIATION.md` L42-L49)

`validate.py` detects structural and semantic state/log inconsistencies. (`bcp-speed/bcp/validate.py` L31-L47; L89-L115; L116-L161; L210-L225)

## Ω decision layer

Ω maintains an append-only decision index plus per-decision records, with a checker enforcing consistency, record shape, evidence, and generated-era index integrity. (`omega-baseline/omega-final/docs/decisions/README.md` L8-L24; L68-L89)

## Ω derived-state layer

`genome` folds registry + decisions + tests into committed derived artifacts and mechanically checks exactness and orphan/incomplete states. (`omega-baseline/omega-final/tooling/gates/genome.ts` L206-L260; L343-L390)

## Ω document-provenance layer

The librarian machinery checks source hashes, generated re-derivation, and citation resolvability. (`omega-baseline/omega-final/tooling/gates/doctruth.ts` L101-L155; L159-L187)

## Ω process-observation layer

The process model consolidates existing readers rather than becoming a second authority system. (`omega-baseline/omega-final/tooling/gates/process.ts` L19-L32; L161-L198)

## Conclusion

**P1-02 should sit above these mechanisms as a reconciler, not beside them as another competing parser or authority.**

---

# 7. EXISTING MECHANISMS THAT ALREADY PERFORM PARTS OF P1-02

| Mechanism                            | Already proves/detects                                                               | P1-02 implication                                                                                                      |
| ------------------------------------ | ------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------- |
| `bcp_tool.py`                        | Controlled state mutation + atomicity + taxonomy/dependency checks                   | Reuse, never duplicate BCP mutation logic. (`bcp-speed/bcp/bcp_tool.py` L1-L15; L402-L419)                             |
| `validate.py`                        | Duplicate keys, bad refs, cycles, lease drift, state/log drift                       | Reuse BCP findings. (`bcp-speed/bcp/validate.py` L31-L47; L89-L115; L210-L225)                                         |
| `sweep.py`                           | Deterministic repair/signals for known BCP conditions                                | Do not become a second sweeper. (`bcp-speed/bcp/sweep.py` L1-L20; L150-L180)                                           |
| `decisions.ts`                       | Decision index ↔ record integrity                                                    | P1-02 should consume it. (`omega-baseline/omega-final/docs/decisions/README.md` L17-L24; L68-L80)                      |
| `docscan.ts`                         | Broken supersession refs, citations, section pointers, annex parity, banner coverage | P1-02 should extend around it, not fork it. (`omega-baseline/omega-final/tooling/gates/docscan.ts` L12-L27; L101-L180) |
| `doctruth.ts`                        | Generated source hashes, derivation drift, citation resolution                       | Existing provenance substrate. (`omega-baseline/omega-final/tooling/gates/doctruth.ts` L101-L155)                      |
| `genome.ts`                          | Deterministic derived-state fold and orphan/incomplete detection                     | Existing Ω structural truth mechanism. (`omega-baseline/omega-final/tooling/gates/genome.ts` L343-L390)                |
| `surfacesync.ts`                     | Live op/surface drift and orphan bindings                                            | Narrow cross-surface truth example. (`omega-baseline/omega-final/tooling/gates/surfacesync.ts` L117-L190)              |
| cleanup authority/conflict documents | Human reconciliation                                                                 | Current seed knowledge for P1-02. (`docs/cleanup/AUTHORITY-MAP.md` L51-L69; `docs/cleanup/CONFLICT-REGISTER.md` L1-L4) |

---

# 8. VERIFIED CURRENT PROBLEMS

## 8.1 Root README contains a stale authority pointer

This is the clearest immediately actionable contradiction.

`README.md` says `ORCHESTRATION-REDESIGN.md` is the **“Canonical automation design”** and that it wins on conflict. (`README.md` L15-L18)

But `ORCHESTRATION-REDESIGN.md` is explicitly bannered as a **HISTORICAL CONSTRUCTION PLAN**, says its tasks have already been executed, and points to current automation truth elsewhere. (`ORCHESTRATION-REDESIGN.md` L1-L7)

`AGENTS.md` independently classifies the same document as historical. (`AGENTS.md` L40-L46)

`CURRENT-CONTEXT.md` also explicitly puts `ORCHESTRATION-REDESIGN.md` in historical material. (`docs/CURRENT-CONTEXT.md` L35-L42)

### Verdict

**INDEPENDENTLY ESTABLISHED: real cross-surface authority drift.**

It is not a theoretical problem.

It demonstrates exactly why P1-02 is needed.

---

## 8.2 `BUILD_CONTEXT.md` is a dated snapshot with freshness risk

`BUILD_CONTEXT.md` identifies itself as the repository state “today” for 2026-09-23 and references an earlier substantive HEAD/cleanup state. (`BUILD_CONTEXT.md` L1-L9)

Current `main` has subsequently moved through the WS-001/P1-01 proof and coordinator integration, while `CURRENT.md` intentionally carries a substantive rather than literal Git tip marker. (`docs/agent-system/CURRENT.md` L8-L13)

### Important lesson

This is **not** evidence that `CURRENT.md` is wrong merely because the literal Git HEAD differs.

`CURRENT.md` explicitly says the substantive tip is `de147d6` and that later coordinator consolidation commits roll that marker. (`docs/agent-system/CURRENT.md` L8-L13)

Therefore:

> **Literal `HEAD != referenced SHA` is not sufficient to classify a document stale.**

P1-02 must understand **semantic tip references**.

---

## 8.3 Real competing plugin-authoring mechanisms exist

The cleanup audit identifies three plugin creators:

1. `tooling/builder`
2. `tooling/generate plugin`
3. `plugins/forge-author`

The audit identifies `plugins/forge-author` as the canonical implementation, `tooling/builder` as a compatible bootstrap surface, and `tooling/generate plugin` as an unreconciled duplicate. (`docs/cleanup/PLUGIN-AUTHORING-PATH-AUDIT.md` L15-L29; L45-L61)

This is a genuine P1-02 problem because the difference cannot safely be inferred from filenames alone.

---

## 8.4 Raw duplication detection would generate false positives

The cleanup audit explicitly distinguishes deliberate layers such as the BCP MCP server versus `bcp_tool.py`, and `serve-control.py` versus `ops-serve.ps1`. (`docs/cleanup/REPOSITORY-CLEANUP-REPORT.md` L54-L64)

The SDK audit also distinguishes an honest re-export from a duplicate implementation: `contentHashDir` and related functions are re-exported from a single implementation rather than forked. (`docs/cleanup/SDK-ANVIL-ACCOUNTING.md` L18-L36)

Therefore:

> **Same basename, similar code, or similar functionality is evidence of a relationship — not proof of a duplicate.**

---

## 8.5 There are known unresolved conflicts that should remain unresolved

C8: Prisma-model count discrepancy.
C11: untracked Prompt-4/Chameleon work.
C12: engine-count discrepancy.

These are explicitly registered as OPEN with named ownership/next steps. (`docs/cleanup/CONFLICT-REGISTER.md` L61-L67; L86-L97; L99-L105)

P1-02 must not “solve” an unknown by selecting one side.

---

## 8.6 Current generated/provenance coverage is local, not repository-wide

Ω's librarian registry currently contains one governed generated artifact: `build/genome.md`, with two source hashes and `omega:genome` as generator. (`omega-baseline/omega-final/docs/librarian.json` L1-L21)

That is strong local provenance, but it is not a repository-wide provenance registry.

This is a **structural gap**, not a reason to immediately create one.

---

# 9. WHAT CAN BE DETECTED MECHANICALLY

## Strongly mechanical

* file existence/nonexistence;
* hashes and content equality;
* generated artifact re-derivation drift;
* decision index ↔ record mismatch;
* known reference resolution;
* explicit supersession target resolution;
* BCP schema/taxonomy/graph/log consistency;
* explicit orphan relationships;
* surface dispatch drift;
* generated derivation stamps;
* known generated artifacts differing from their fold;
* status artifacts stale relative to the repository tip **when their semantics explicitly require tip equality**.

These capabilities already exist in the repository. (`omega-baseline/omega-final/tooling/gates/docscan.ts` L12-L27; `omega-baseline/omega-final/tooling/gates/doctruth.ts` L117-L147; `bcp-speed/bcp/validate.py` L31-L47; `omega-baseline/omega-final/tooling/gates/surfacesync.ts` L117-L190)

## Interpretation required

* whether two implementations are actually competing;
* whether a historical document is intentionally retained or accidentally active;
* whether a folder is authoritative — the repository explicitly warns that folders are not authority. (`AGENTS.md` L48-L56)
* whether an untracked path belongs to another workstream;
* whether terminology differs semantically or merely lexically;
* whether old prose is a dated measurement or stale architectural instruction;
* whether a “current” pointer is semantic or literal;
* whether a proposed cleanup would destroy useful genealogy.

That distinction is central to P1-02.

---

# 10. SAFE VS DANGEROUS CLEANUP

## Safe by default

### Report-only classification

No repository mutation; creates evidence first.

### Reference repair

Repairing known broken paths without rewriting historical content was already used successfully. (`docs/cleanup/REPOSITORY-CLEANUP-REPORT.md` L72-L77)

### Explicit historical banners

The cleanup precedent used prepend-only banners rather than rewriting the historical substance. (`docs/cleanup/REPOSITORY-CLEANUP-REPORT.md` L20-L32)

### `git mv` archival movement

The previous cleanup moved history using `git mv`, preserving genealogy. (`docs/cleanup/REPOSITORY-CLEANUP-REPORT.md` L9-L18)

### Regeneration through a canonical generator

Generated artifacts may be regenerated where the repository already declares the generator and the corresponding gate verifies exactness. (`omega-baseline/omega-final/docs/librarian.json` L3-L18; `omega-baseline/omega-final/tooling/gates/doctruth.ts` L129-L143)

## Dangerous

* deleting “stale” documentation;
* rewriting historical claims into current values;
* editing RATIFIED Ω records;
* hand-editing BCP state;
* retiring an implementation without its governing decision;
* modifying another workstream's untracked surface;
* silently choosing between conflicting implementations;
* changing terminology merely to make names look cleaner;
* hand-editing generated artifacts.

The repository explicitly mandates supersession rather than rewriting of ratified history and state-machine discipline for BCP. (`omega-baseline/omega-final/docs/decisions/README.md` L52-L66; `AGENTS.md` L21-L27)

The SDK audit provides a particularly useful example: even when some symbols look like candidates for decomposition, the audit refuses to move/remove them under the existing freeze without a superseding D-record. (`docs/cleanup/SDK-ANVIL-ACCOUNTING.md` L38-L55)

---

# 11. DEPENDENCIES

## INHERITED

P1-02 depends on:

* all workstreams as domain evidence;
* cooperative system;
* Ω authority machinery;
* BCP authority machinery. (`docs/agent-system/P1-WORKSTREAM-PORTFOLIO.md` L50-L52)

## PROPOSED interpretation

P1-02 should **consume** existing mechanisms rather than depend on new semantic infrastructure:

`AGENTS.md`
→ current repository context
→ subsystem authority
→ existing checker/generator/test
→ reconciliation result.

P1-02 should not require P1-03's future ontology system to begin producing useful evidence.

---

# 12. OPEN QUESTIONS

### 1. What constitutes ownership when no explicit owner exists?

The repository contains workstream ownership, subsystem ownership, owner directives, and hands-off areas, but these do not yet form one repository-wide ownership relation. (`docs/agent-system/SYSTEM.md` L214-L238; `docs/cleanup/CONFLICT-REGISTER.md` L86-L97)

### 2. How should semantic duplicates be identified?

There is no evidence that lexical similarity is sufficient. The plugin-authoring and SDK audits show otherwise. (`docs/cleanup/PLUGIN-AUTHORING-PATH-AUDIT.md` L25-L29; `docs/cleanup/SDK-ANVIL-ACCOUNTING.md` L31-L36)

### 3. How much of provenance should be centralized?

The librarian currently covers a very small governed set, while other subsystems carry their own provenance models. (`omega-baseline/omega-final/docs/librarian.json` L3-L18)

### 4. How should local-only state be represented?

GitHub/main cannot establish the truth of untracked working-tree paths; the repository itself intentionally records some of them as unknown/hands-off. (`AGENTS.md` L59-L61; `docs/cleanup/CONFLICT-REGISTER.md` L86-L97)

### 5. Which terminology drift is merely lexical and which is architectural?

BCP and Ω intentionally use different vocabularies and explicitly must not be conflated. (`bcp-speed/bcp/RECONCILIATION.md` L7-L16)

### 6. When should report-only drift become blocking?

Ω explicitly uses an adopt → observe → enforce pattern for several drift mechanisms. (`omega-baseline/omega-final/tooling/gates/docscan.ts` L1-L10; `omega-baseline/omega-final/docs/decisions/CURRENT-INVARIANTS.md` L62-L70)

---

# 13. PROPOSED MECHANISMS

## 13.1 Repository Truth Ledger — eventually

A lightweight relationship representation for:

`artifact → classification → authority → provenance → owner → relationship → evidence → action constraint`

This is **future**, not first implementation.

## 13.2 Authority-pointer reconciliation

The first concrete mechanism.

Given an entry/current document containing a statement such as:

> “X is canonical/current/authoritative”

resolve X and compare the assertion against X's explicit classification and the authoritative map.

This mechanism can begin without a database or ontology.

## 13.3 Conflict register as durable output

Reuse the repository's existing pattern:

`CLAIM A + source + status`
vs
`CLAIM B + source + status`
→ governing authority / unresolved state.

This matches the cooperative conflict rule already in place. (`docs/agent-system/SYSTEM.md` L214-L228)

## 13.4 Existing-checker federation

P1-02 should ingest existing findings from:

* BCP validation/sweep;
* Ω document scan;
* decisions;
* genome;
* librarian;
* surface parity;
* process model.

It should not create parallel parsers for these domains.

## 13.5 Confidence through explicit unknowns

No inference from folder location, filename, proximity, or recency alone.

This directly follows the repository's “folder ≠ authority” rule and UNKNOWN discipline. (`AGENTS.md` L48-L56; `docs/agent-system/SYSTEM.md` L94-L101)

---

# 14. FIRST CONCRETE IMPLEMENTATION

## Proposed implementation: `authority-pointer` truth slice

**Do not build a repository-wide cleaner yet.**

Build one tiny, read-only verifier that answers:

> **“When a current/entry document claims another document is canonical/current/authoritative, does the referenced document and the known authority map support that claim?”**

### Bounded corpus

Start only with:

* `README.md`
* `AGENTS.md`
* `BUILD_CONTEXT.md`
* `docs/CURRENT-CONTEXT.md`
* `docs/agent-system/CURRENT.md`
* `docs/cleanup/AUTHORITY-MAP.md`
* `docs/cleanup/CONFLICT-REGISTER.md`

and the explicitly referenced target documents.

The corpus is intentionally small.

### First real test case

The checker must identify:

`README.md:17`
→ `ORCHESTRATION-REDESIGN.md`
→ claimed as canonical

while the target and higher-level authority say:

`ORCHESTRATION-REDESIGN.md:2-7`
→ historical construction plan

`AGENTS.md:40-46`
→ historical

`docs/CURRENT-CONTEXT.md:35-42`
→ historical.

This should produce a **DRIFT / AUTHORITY-CONTRADICTION** finding, not an automatic edit.

### Critical negative test

The checker must **not** report `docs/agent-system/CURRENT.md` merely because its substantive tip `de147d6` differs from the literal Git HEAD.

`CURRENT.md` explicitly defines the semantic-tip convention: the substantive P1-01 integration tip remains `de147d6`, while later coordinator consolidation commits roll the marker. (`docs/agent-system/CURRENT.md` L8-L13)

This is an essential test of whether the model understands repository semantics rather than merely comparing SHAs.

### Third test

The checker must preserve the three known unresolved conflicts as unresolved:

* Prisma count discrepancy;
* Prompt-4/untracked work;
* engine-count discrepancy.

They must not be auto-resolved. (`docs/cleanup/CONFLICT-REGISTER.md` L61-L67; L86-L97; L99-L105)

### Output

For each assertion:

| Field                 | Example                            |
| --------------------- | ---------------------------------- |
| source                | `README.md`                        |
| source line           | `17`                               |
| claim                 | canonical automation design        |
| target                | `ORCHESTRATION-REDESIGN.md`        |
| target classification | historical                         |
| governing authority   | `AGENTS.md` / `CURRENT-CONTEXT.md` |
| verdict               | contradiction                      |
| confidence            | deterministic                      |
| action                | report-only                        |
| evidence              | all cited paths/lines              |

The exact implementation location is deliberately **not fixed by this charter**. The implementation agent should choose the smallest repository-native location without creating another major subsystem.

---

# 15. DEFINITION OF PROOF

P1-02 is **not proven** when the checker runs successfully.

It becomes evidence toward proof only when the bounded implementation demonstrates all of the following:

### P1-02-P1 — Authority resolution

For a known contradiction, the tool identifies the governing authority and gives exact evidence.

### P1-02-P2 — Historical preservation

Historical material is recognized without rewriting it.

### P1-02-P3 — Semantic distinction

The mechanism does not classify a deliberate support/adapter relationship as a competing implementation merely because similar code exists.

### P1-02-P4 — Unknown discipline

Unknown ownership/untracked state remains unknown rather than being inferred.

### P1-02-P5 — Determinism

Same tree + same authority inputs produce byte-identical output.

### P1-02-P6 — Existing-mechanism reuse

The first mechanism does not duplicate or contradict an existing domain checker.

### P1-02-P7 — Safe action boundary

The mechanism reports contradictions but does not delete, rewrite, ratify, or otherwise assume authority.

---

# 16. FALSIFIERS

## F-TRUTH-01 — False authority resolution

A document claims X is canonical, the existing authority map says otherwise, and the implementation fails to flag it.

**Would falsify:** authority-pointer model.

## F-TRUTH-02 — False duplicate

A deliberate adapter/transport/re-export pair is classified as a competing implementation.

Known negative examples exist in the cleanup evidence. (`docs/cleanup/REPOSITORY-CLEANUP-REPORT.md` L54-L64; `docs/cleanup/SDK-ANVIL-ACCOUNTING.md` L31-L36)

**Would falsify:** naive duplicate model.

## F-TRUTH-03 — False freshness

A semantically meaningful reference such as `CURRENT.md` is marked stale solely because its stored substantive tip differs from Git HEAD.

**Would falsify:** naive freshness model.

## F-TRUTH-04 — Unknown becomes guessed

An unresolved owner, untracked surface, or conflict is silently assigned a winner.

**Would falsify:** epistemic model.

## F-TRUTH-05 — Genealogy destruction

Cleanup removes or rewrites historical evidence instead of preserving and superseding it.

**Would falsify:** cleanup safety model.

## F-TRUTH-06 — Authority pollution

A transcript, packet, handoff, generated summary, or agent opinion becomes treated as Ω law.

This would violate the established epistemic separation. (`docs/agent-system/SYSTEM.md` L28-L45)

## F-TRUTH-07 — Mechanism duplication

P1-02 implements a second parser for a truth mechanism already owned by BCP or Ω and the two can disagree.

**Would falsify:** “federating existing mechanisms” architectural principle.

## F-TRUTH-08 — Non-determinism

Same repository state produces different classifications/report ordering.

**Would falsify:** truth-ledger/reconciliation approach.

## F-TRUTH-09 — Automatic cleanup leap

The tool turns “detected ambiguity” directly into delete/move/rename behavior.

**Would falsify:** P1-02 boundary.

## F-TRUTH-10 — Scope blindness

A repository-wide claim is made while local/untracked state is not observable.

The existing repository explicitly identifies such surfaces as unknown/hands-off. (`AGENTS.md` L59-L61)

---

# 17. WHAT P1-02 SHOULD OWN VS REPORT

| Question                                            | P1-02                                          |
| --------------------------------------------------- | ---------------------------------------------- |
| “Which file is supposed to govern this concept?”    | **Own**                                        |
| “Do two artifacts contradict one another?”          | **Own/report**                                 |
| “Is this artifact historical, current, or unknown?” | **Own classification**                         |
| “Is this generated artifact stale?”                 | **Detect/report**, consume generator authority |
| “Should Ω law change?”                              | **Report to Ω decision authority**             |
| “Should this BCP state row change?”                 | **Report**, change only through BCP owner/tool |
| “Should a plugin implementation be retired?”        | **Propose**, owner + decision required         |
| “What does VIVIM actually do?”                      | **Out of scope; P1-08/P1-07 domain**           |
| “Is the integrated Ω system correct end-to-end?”    | **P1-09**                                      |
| “What should Ω's ontology be?”                      | **P1-03**                                      |

---

# 18. MINIMAL IMPLEMENTATION-AGENT CONTEXT PACKAGE

The implementation agent does **not** need the whole repository in its first context window.

## Required reads

1. `/AGENTS.md`
2. `/BUILD_CONTEXT.md`
3. `/docs/CURRENT-CONTEXT.md`
4. `docs/agent-system/SYSTEM.md`
5. `docs/agent-system/CURRENT.md`
6. `docs/agent-system/P1-WORKSTREAM-PORTFOLIO.md`
7. `docs/agent-system/WORKSTREAMS.md`

These are the established cold-start sequence. (`docs/agent-system/CONTEXT-INDEX.md` L19-L36)

## Then only the bounded evidence

* `docs/cleanup/AUTHORITY-MAP.md`
* `docs/cleanup/CONFLICT-REGISTER.md`
* `README.md`
* `ORCHESTRATION-REDESIGN.md`

## One rule to carry explicitly

> **Do not implement generalized repository truth. Implement one read-only authority contradiction detector, prove it against the README/ORCHESTRATION contradiction, and use the result to learn what the model gets wrong.**

---

# 19. WHAT SHOULD NOT YET BE BUILT

## Explicitly defer

### 1. Repository-wide ontology/database

Do not build a universal artifact graph or ontology yet.

P1-03 owns the future semantic representation problem, and the cooperative system itself explicitly avoided building an ontology DB in v1. (`docs/agent-system/P1-WORKSTREAM-PORTFOLIO.md` L54-L62; `docs/agent-system/SYSTEM.md` L283-L287)

### 2. Generic semantic duplicate detector

Do not build a system that concludes “duplicate” from filenames, imports, similarity, or code shape.

The repository already contains deliberate similar structures and genuine competing implementations. (`docs/cleanup/REPOSITORY-CLEANUP-REPORT.md` L54-L64; `docs/cleanup/PLUGIN-AUTHORING-PATH-AUDIT.md` L25-L29)

### 3. Automatic cleanup engine

No auto-delete, auto-retire, auto-rename, or automatic archival.

### 4. New Ω authority mechanism

P1-02 must not compete with:

* decision records;
* current invariants;
* genome;
* doctruth;
* session ledger;
* BCP state.

### 5. New BCP state machinery

Do not create P1-02 state inside `bcp-speed/bcp/state/` or hand-edit it. (`AGENTS.md` L21-L23; `SYSTEM.md` L148-L159)

### 6. Runtime self-awareness

P1-02 is repository truth, not Ω runtime self-knowledge. The Ω process model already explicitly distinguishes development/repository evidence from runtime mind evidence. (`omega-baseline/omega-final/tooling/gates/process.ts` L1-L17)

### 7. Provider or VIVIM harvesting

That would cross the registered boundaries of P1-07/P1-08. (`docs/agent-system/P1-WORKSTREAM-PORTFOLIO.md` L94-L112)

### 8. Full cross-workstream integration framework

That belongs to P1-09. (`docs/agent-system/P1-WORKSTREAM-PORTFOLIO.md` L114-L122)

---

# 20. FINAL CHARTER

## MISSION

Maintain a reconciled, evidence-backed map of repository reality so agents can distinguish authority, current state, history, proposal, derivation, ownership, conflict, and uncertainty without silently destroying genealogy.

## BOUNDARY

Repository archaeology, classification, source-of-truth reconciliation, conflict/drift detection, cleanup safety, and reconciliation proposals. No Ω-law decisions, no VIVIM behavior harvesting, no replacement of existing authority/checking mechanisms.

## DEPENDENCIES

Existing repository authority; BCP control mechanisms; Ω decision/gate/provenance machinery; cooperative system; domain evidence from other workstreams.

## AUTHORITATIVE INPUTS

`AGENTS.md`; `BUILD_CONTEXT.md`; `docs/CURRENT-CONTEXT.md`; BCP `state/` + `RECONCILIATION.md`; Ω `CURRENT-INVARIANTS.md`; Ω `BUILD-DECISIONS.md` + decision records; established generators/checkers; VIVIM only as evidence.

## CURRENT STATE

Repository truth is already partially mechanized but fragmented across subsystem-specific mechanisms. A human-maintained authority map and conflict register bridge some gaps. No demonstrated unified reconciliation mechanism yet.

## KNOWN PROBLEMS

At minimum:

* root README authority drift concerning `ORCHESTRATION-REDESIGN.md`;
* freshness hazards caused by dated snapshots;
* genuine competing plugin-authoring paths;
* unresolved Prisma/engine/untracked-work conflicts;
* semantic ambiguity that lexical duplicate detection cannot safely resolve;
* provenance/derivation coverage that is strong locally but not globally.

## OPEN QUESTIONS

Ownership semantics, semantic duplicate definition, breadth of centralized provenance, local-state representation, terminology drift, and when report-only drift should become blocking.

## PROPOSED MECHANISMS

Start with authority-pointer reconciliation, then expand to conflict classification and cross-surface reconciliation only as concrete experiments justify them. Reuse existing checkers; never create competing domain parsers.

## FIRST CONCRETE IMPLEMENTATION

A small, deterministic, read-only authority-pointer checker over a bounded corpus. First proof case: detect `README.md:17` claiming `ORCHESTRATION-REDESIGN.md` is canonical when multiple higher-authority surfaces classify it as historical.

## DEFINITION OF PROOF

Correct authority resolution, historical preservation, semantic distinction, explicit unknowns, deterministic output, reuse of existing mechanisms, and no unauthorized mutation.

## FALSIFIERS

False authority resolution; false duplicate; false freshness; guessed unknowns; genealogy loss; authority pollution; duplicate mechanisms; non-determinism; automatic cleanup; inability to represent local-state blindness.

## OUT-OF-SCOPE

Ω law, BCP state mutation, VIVIM harvesting, provider intelligence, runtime self-knowledge, ontology design, automatic deletion/retirement, repository-wide semantic indexing, and full end-to-end integration proof.

---

## Bottom line

**P1-02 is best understood as the repository’s reconciliation function, not its constitution and not its janitor.**

The repository already has many strong local truth mechanisms. The missing capability is the ability to look **across their boundaries** and say, with evidence:

> “These two claims refer to the same thing; this authority governs; this artifact is historical; this one is generated; this one is genuinely competing; this one is unknown; and this cleanup is safe because the evidence remains intact.”

The first experiment should therefore be deliberately small: **detect one real authority contradiction, correctly ignore one real semantic non-contradiction, preserve one real unknown, and prove the detector is deterministic.**

That would produce evidence about what P1-02 actually needs before any larger architecture is justified.

The charter is intentionally **PROPOSED, not proven**. The strongest next move is the bounded authority-pointer implementation above; the plugin-authoring conflict should become the next test once that first model survives its initial falsifiers.
