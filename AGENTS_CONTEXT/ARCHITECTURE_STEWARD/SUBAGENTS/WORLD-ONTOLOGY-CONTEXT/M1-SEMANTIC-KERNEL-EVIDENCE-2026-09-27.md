# CFA-01 — M1 Semantic World Kernel Evidence

> Date: 2026-09-27
> Status: **COMPLETE — EVIDENCE CANDIDATE ESTABLISHED**
> Classification: CFA-01-owned evidence/reasoning packet; not Ω law, not a ratified cross-CFA contract, and not production implementation.
> Basis: repository `main` at `7d17b99ffd6cbde15a305f8956b3c480bc6d2e2f` as inspected for this task.
> Task: `WORLD-M1-SEMANTIC-KERNEL-EVIDENCE-2026-09-27`

## 1. Task outcome

The minimum semantic World kernel can currently be characterized without introducing a universal identity/data model.

The evidence supports a small semantic core around:

1. **World** — a derived coherent view of accessible canonical reality.
2. **Thing/Object** — the generic durable semantic subject represented canonically by an existing durable record.
3. **Relationship** — a semantic assertion connecting World subjects.
4. **Semantic Identity** — the semantic continuity/identity of a World subject, distinct from storage identity.
5. **Source Identity** — an identity asserted inside an external authority/realm/scope.
6. **Correspondence** — an explicit claim that a source identity corresponds to a local World subject; correspondence is not equivalence and is not proof by itself.
7. **Presence / Observation State** — what the current evidence supports about a subject's existence/observation, without collapsing absence into nonexistence.
8. **Evidence/Basis Reference** — the support/basis carried with semantic claims; evidence constrains claims but does not become authority.
9. **Addressability** and **Projection** are boundary roles over this kernel, not alternate canonical object stores.
10. **Context is deliberately not part of the M1 kernel**; it is a later bounded World projection contract (M3).

The principal M1 result is therefore a **minimal semantic vocabulary plus non-collapse invariants**, not a complete ontology.

## 2. Epistemic evidence matrix

| Kernel subject | Current characterization | Epistemic state | Freshness | Strongest basis | Material gap |
|---|---|---|---|---|---|
| World | Derived, reconstructable view over canonical objects + semantic relationships + scope | DERIVED / EVIDENCE-SUPPORTED | CURRENT | `WORLD-PROJECTION.md`, `RESEARCH-SYNTHESIS.md` | Exact projection basis/freshness contract remains open |
| Thing / Object | Generic canonical semantic record with typed payload and durable ref | DERIVED — DESIGN-CANDIDATE | CURRENT | `CANONICAL-MODEL.md`, `OBJECT-TAXONOMY.md` | Final universal-envelope boundary still experimental |
| Relationship | First-class semantic assertion, distinct from structural provenance refs | DERIVED — DESIGN-CANDIDATE | CURRENT | `RELATIONSHIP-MODEL.md`, `RESEARCH-SYNTHESIS.md` | Predicate vocabulary/conflict policy unresolved |
| Semantic Identity | Meaning-level identity must remain distinct from record/revision/provider/UI identity | DERIVED | CURRENT | CFA-01 `STATE.md`, Core Agent, `RESEARCH-SYNTHESIS.md` | Merge/split over time unresolved |
| Source Identity | External authority/realm/scope + external id; never silently becomes local identity | DERIVED — DESIGN-CANDIDATE | CURRENT | `SOURCE-IDENTITY.md`, CFA-02 Owner Alignment | Exact minimum envelope/multiplicity open |
| Correspondence | Evidence-backed mapping/assertion between external and local identities | DERIVED — DESIGN-CANDIDATE | CURRENT | `SOURCE-IDENTITY.md`, CFA-01 Round-2 addendum | Peer acceptance and promotion semantics open |
| Presence / observation | Existent, non-existent, not-observed, unknown are distinct dimensions; observation does not equal World truth | PROPOSED / DERIVED | CURRENT | CFA-01 Round-2 addendum, exit interview, red-team | Exact observation-to-World assertion protocol open |
| Evidence / basis | Claims retain evidence/provenance/basis; evidence does not confer authority | DERIVED / EVIDENCE-SUPPORTED | CURRENT | `RELATIONSHIP-MODEL.md`, `WORK-EVIDENCE-INTEGRATION.md`, Steward reconciliation | Cross-CFA evidence envelope still being standardized |
| Addressability | Resolves known identity; search/retrieval may only produce candidates; ambiguity can survive | DERIVED — DESIGN-CANDIDATE | CURRENT | `ADDRESSING.md` | Final WorldReferenceResult awaits CFA-03/CFA-04 reconciliation |
| Projection | Rebuildable derivation from canonical state; omission is not nonexistence | EVIDENCE-SUPPORTED / DESIGN-CANDIDATE | CURRENT | `WORLD-PROJECTION.md`, red-team | Scope/viewpoint/freshness envelope not closed |
| Space | Durable semantic environment, not workspace/presentation | DESIGN-CANDIDATE | CURRENT | `WORLD-PROJECTION.md`, OBJECT-TAXONOMY | M1 does not require full Space contract |
| Context | Purpose-bounded selection/projection over World, not a second database | DERIVED / EVIDENCE-SUPPORTED for substrate, semantic contract still open | CURRENT + HISTORICAL implementation evidence | CFA-01 `STATE.md`, D-443, `context.ts` | Relevance, viewpoint and accessibility semantics deferred to M3 |

## 3. Minimum non-collapse invariants

These are the essential M1 protections. They are stronger than naming conventions because later implementation must be able to falsify them.

| ID | Invariant | State | Falsifier |
|---|---|---|---|
| M1-I01 | Semantic meaning != durable storage record | DERIVED / CURRENT | A required World meaning can only be expressed by choosing a storage schema/row type |
| M1-I02 | Semantic identity != record identity != revision identity | DERIVED / CURRENT | A semantic continuity case cannot be expressed without changing or reusing a record/revision identifier |
| M1-I03 | Source identity != local canonical identity | DERIVED / CURRENT | An external id must replace the local canonical id to preserve identity |
| M1-I04 | Correspondence != equivalence | DERIVED / CURRENT | A correspondence assertion forces automatic local merge without an explicit semantic decision |
| M1-I05 | Correspondence != proof | DERIVED / CURRENT | Merely naming a source/local mapping is accepted as sufficient proof for a consequential claim |
| M1-I06 | Content identity != object identity | DERIVED / CURRENT | Equal content/CID causes distinct semantic objects to collapse |
| M1-I07 | Relationship != structural provenance | EVIDENCE-SUPPORTED / CURRENT | Vault provenance refs alone are treated as semantic containment/causal relation truth |
| M1-I08 | Conflicting relationships remain representable | DESIGN-CANDIDATE / CURRENT | A later relationship silently erases a contradictory historical assertion |
| M1-I09 | World != canonical storage | EVIDENCE-SUPPORTED / CURRENT | A persistent World materialization becomes required as the second source of truth |
| M1-I10 | World != raw observation | DERIVED / CURRENT | An observation is treated as the World assertion without an explicit semantic/evidentiary step |
| M1-I11 | Projection != evidence | DERIVED / CURRENT | Being present in a projection is itself treated as proof of the underlying fact |
| M1-I12 | Projection omission/hidden != nonexistent | DERIVED / CURRENT | Absence from a scoped projection is taken as proof of nonexistence |
| M1-I13 | Addressability != authorization | DERIVED / CURRENT | A resolvable address is accepted as permission to act |
| M1-I14 | Accessibility/visibility != authorization | DERIVED / CURRENT | A visible/accessible subject is accepted as authorized solely because it is available in a view |
| M1-I15 | Denial must not rewrite World ontology | PROPOSED / CURRENT | A failed authorization changes `existent` into `nonexistent` or removes the semantic subject |
| M1-I16 | Evidence can support a claim without becoming authority | EVIDENCE-SUPPORTED / CURRENT | An evidence record is used as live permission or policy authority |
| M1-I17 | Unknown != failure | DERIVED / CURRENT | Missing evidence is coerced to false/failed when the correct state is unresolved |
| M1-I18 | No universal Event/State primitive is required by M1 | PROPOSED / CURRENT | Multiple essential domains cannot express their semantics without one universal Event/State ontology |

## 4. Minimum kernel candidate

The smallest current candidate is:

```text
WORLD
  ├─ SUBJECT / OBJECT
  ├─ RELATIONSHIP
  ├─ SEMANTIC IDENTITY
  ├─ SOURCE IDENTITY
  ├─ CORRESPONDENCE
  ├─ PRESENCE / OBSERVATION STATE
  └─ EVIDENCE / BASIS

BOUNDARY ROLES
  ├─ ADDRESSABILITY
  └─ PROJECTION

LATER CONTRACT
  └─ CONTEXT
```

### Why this is the minimum useful shape

A World model needs a subject to mean anything, relationships to connect subjects, identity to persist meaning across representations, source identity/correspondence to model external origins without surrendering local identity, and explicit observation/evidence state to avoid turning an unobserved projection into false ontology.

Addressability and projection are required operationally, but they are better treated as contracts over the kernel than as new canonical nouns.

Context is intentionally deferred because the current repository already supplies a realization substrate (D-443) while the semantic relevance/selection contract remains an M3 decision.

## 5. Explicit exclusions from M1

The following are **not** admitted as new universal primitives by this task:

- universal identity service/database;
- universal Event primitive;
- universal State primitive;
- provider/session/account ontology;
- authority/permission verdict as World state;
- Work/Attempt/Outcome semantics;
- workspace/canvas/layout as World concepts;
- evidence/provenance as a replacement semantic ontology;
- a materialized World table as a second source of truth;
- a universal inheritance tree for every object kind.

These may be domain concepts elsewhere or future bounded contracts, but M1 does not absorb them.

## 6. Round-1 central input contribution: A–D

This section is deliberately shaped to satisfy the Architecture Steward Development Acceleration Input Register without turning the Steward into a World semantic owner.

### A. Domain kernel

| Term | Definition | Anti-definition | Owner | Evidence |
|---|---|---|---|---|
| World | Derived coherent model of accessible canonical reality | Not a second database or ontology store | CFA-01 | `WORLD-PROJECTION.md` |
| Thing/Object | Generic durable semantic subject | Not a request to create one storage type per domain | CFA-01 meaning / CFA-02 durability | `CANONICAL-MODEL.md` |
| Relationship | Semantic assertion between subjects | Not a generic provenance ref | CFA-01 meaning / CFA-02 durability | `RELATIONSHIP-MODEL.md` |
| Semantic Identity | Meaning-level continuity of a subject | Not synonymous with local record/revision/provider/UI id | CFA-01 | CFA-01 Core Agent + STATE |
| Source Identity | External identity scoped to a source authority/realm/scope | Not the local canonical identity | CFA-01 meaning / CFA-02 persistence | `SOURCE-IDENTITY.md` |
| Correspondence | Explicit claim that identities/subjects correspond | Not equivalence, merge, or proof | CFA-01 | `SOURCE-IDENTITY.md` |
| Presence / Observation | What a supported basis says about presence/observation | Not an authority verdict or raw storage status | CFA-01 | Round-2 addendum + red-team |
| Evidence / Basis | Support and provenance attached to a semantic claim | Not permission or semantic truth merely because it exists | Cross-cutting evidence; CFA-01 consumes | relationship/work evidence artifacts |
| Addressability | Ability to resolve a World subject/reference | Not search certainty and not authorization | CFA-01 | `ADDRESSING.md` |
| Projection | Rebuildable derivation of World information | Not canonical truth and not evidence by itself | CFA-01 | `WORLD-PROJECTION.md` |

### B. Minimum responsibility

CFA-01 must keep the semantic meaning of World subjects and relationships coherent across:
- canonical vs derived representation;
- source/local identity;
- semantic correspondence;
- observation/presence;
- addressability;
- projection;
- Context selection.

It contributes:
- semantic definitions and anti-definitions;
- world-side resolution states;
- correspondence meaning;
- projection basis requirements;
- semantic invariants and falsifiers;
- peer-facing seam semantics.

It needs from peers:
- CFA-02: durable identity/revision/reference consequences;
- CFA-03: accepted grounding/reference handoff;
- CFA-04: clear separation of World state from authority verdict;
- later CFA-09: temporal merge/split/replacement semantics.

It explicitly does not own:
- canonical persistence mechanics;
- live authorization;
- command/Intent/Plan interpretation;
- Work execution;
- provider realization;
- surface/workspace realization;
- migration implementation;
- K0 enforcement.

### C. Top three seams

#### C1 — World ↔ CFA-02 Data

**Subject:** semantic subject/reference continuity.

**World provides:** semantic identity meaning, correspondence meaning, relationship meaning, semantic interpretation of current World state.

**Data provides:** canonical record identity, revision, lineage, persistence, reconstruction and durable mappings.

**Crossing:** semantic reference + durable record/revision references + correspondence/lineage basis.

**Prohibited crossings:**
- Data schema does not become World ontology.
- Storage identity does not redefine semantic identity.
- Persistence does not grant authority.
- Durable mapping does not automatically merge semantic subjects.

**Invariant:** `semantic identity != record identity != revision identity`; source identity != canonical identity; persistence != authority.

**Falsifier:** a reconstruction/continuity case cannot be expressed without making storage schema the semantic authority.

**Unresolved:** exact merge/split survivor semantics, source-identity envelope, final relationship predicate vocabulary.

#### C2 — World ↔ CFA-03 Semantic Continuity

**Subject:** grounded World references and semantic resolution.

**World provides:** target/reference identity, World meaning, resolution state, ambiguity/conflict information, evidence refs and freshness where material.

**CFA-03 provides/consumes:** language/command interpretation, grounding and semantic continuity across representations, Intent/Plan meaning.

**Crossing:** minimum World reference/result; exact internal semantic representation remains CFA-03-owned.

**Prohibited crossings:**
- World must not absorb command semantics.
- Grounding must not grant authorization.
- A World projection must not become command truth.
- A lexical match must not be treated as resolved identity.

**Invariant:** resolved/ambiguous/stale/unresolvable/conflicted remain distinguishable.

**Falsifier:** a semantic scenario requires coercing ambiguity to one subject or requiring World to understand the command/Intent model.

**Unresolved:** CFA-03 acceptance of the proposed minimum World-side result contract.

#### C3 — World ↔ CFA-04 Authority

**Subject:** World state vs governed permission.

**World provides:** World subject refs, semantic meaning, presence, addressability, projection/view basis, scoped accessibility where materially observable, evidence and freshness.

**CFA-04 provides:** live authority/permission/consent/delegation/revocation result for a principal/effect.

**Crossing:** descriptive World state in; authority verdict out as a separate dimension.

**Prohibited crossings:**
- addressability != authorization;
- visibility != authorization;
- accessibility != authorization;
- denial must not rewrite World existence;
- projection omission must not imply nonexistence.

**Invariant:** authority is not set by World.

**Falsifier:** a governed action can only be safely modeled by turning a World state into `authorized`.

**Unresolved:** exact semantic ownership of `accessible` as a composed/scoped state.

## 7. Authoritative evidence map

| Artifact | Evidence class | What it is trusted for | Freshness / caveat |
|---|---|---|---|
| `docs/destination/world-object-core/RESEARCH-SYNTHESIS.md` | architecture/research source | central World/Object convergence and invariants | CURRENT; promotion-candidate |
| `CANONICAL-MODEL.md` | architecture/research source | object envelope, identity dimensions, canonical-vs-derived split | CURRENT; design-candidate |
| `OBJECT-TAXONOMY.md` | architecture/research source | requested semantic nouns and anti-redundancy distinctions | CURRENT; design-candidate |
| `RELATIONSHIP-MODEL.md` | architecture/research source | relationship meaning vs provenance and conflict representation | CURRENT; design-candidate |
| `SOURCE-IDENTITY.md` | architecture/research source | source/local identity and correspondence/collision semantics | CURRENT; experiments still required |
| `WORLD-PROJECTION.md` | architecture/research source | World/projection/Space/workspace/surface distinctions | CURRENT; some design-candidate areas remain |
| `ADDRESSING.md` | architecture/research source | exact/current/alias/source addressing and ambiguity | CURRENT; final grounding seam open |
| `REVISION-LIFECYCLE.md` | architecture/research source | revision and lifecycle separation | CURRENT; tombstone/restore partly design-candidate |
| `RED-TEAM.md` | adversarial design evidence | explicit rejected semantic collapses | CURRENT; repository-runtime proofs still owed |
| `GENERICITY-FALSIFIER.md` | experiment evidence | synthetic new-object genericity result | CURRENT as experiment result; does not prove production |
| CFA-01 `STATE.md` / Core Agent / Round-2 addendum | CFA-owned semantic evidence | current ownership and seam claims | CURRENT; peer acceptance not equivalent to evidence |
| CFA-02 Owner Alignment | peer-owned boundary evidence | durable data ownership and identity separation | CURRENT; peer claim, not World authority |
| Steward central roadmap synthesis | derived planning source | shared dependencies and M1 frontier | CURRENT; planning authority only |
| `omega-baseline/omega-final/docs/decisions/D-443-context-substrate.md` + `plugins/vivim-run/src/context.ts` | historical implementation evidence | existing deterministic Context assembly substrate | HISTORICAL / implementation precedent; not semantic authority |

## 8. Gaps and named falsifiers still open

### G1 — Semantic identity over time
**State:** UNKNOWN / CURRENT.
Need a concrete merge/split/time case that proves semantic identity can remain meaningful without absorbing durable lineage mechanics.

### G2 — Observation → World assertion
**State:** UNKNOWN / CURRENT.
The repository identifies the distinction but does not yet close one universally accepted observation-to-World assertion envelope.

### G3 — World reference result acceptance
**State:** UNKNOWN / CURRENT.
CFA-03 has not yet recorded acceptance of the proposed minimum World-side resolution result.

### G4 — Accessible vs authority
**State:** UNKNOWN / CURRENT.
CFA-04 reconciliation is required to decide whether `accessible` is a World projection property, an authority-derived property, or a deliberately composed seam state.

### G5 — Event / State universality
**State:** UNKNOWN / CURRENT.
No evidence currently justifies a universal Event/State primitive; retain as non-primitive unless a required corridor falsifies this.

### G6 — Provider/source realism
**State:** UNKNOWN / CURRENT.
Real external source disappearance, refresh and provider identity correspondence remain experiment-required.

### G7 — Projection basis/freshness
**State:** UNKNOWN / CURRENT.
Projection must carry enough basis/scope/freshness to explain itself; exact reusable contract remains future M3 work.

## 9. M1 falsifier suite

A future machine-checkable semantic fixture should be able to fail the M1 candidate with these cases:

- **F-M1.1 — Storage capture:** a new semantic concept can only be represented by adding/changing a storage-semantic type.
- **F-M1.2 — Identity collapse:** semantic identity cannot survive a record/revision/provider change without changing meaning.
- **F-M1.3 — Source capture:** same/different source ids force an incorrect local merge.
- **F-M1.4 — Correspondence overclaim:** correspondence is accepted as equivalence/proof without additional basis.
- **F-M1.5 — Relation/provenance collapse:** structural refs are sufficient only if semantic relationship meaning is lost.
- **F-M1.6 — Projection overclaim:** hidden/omitted projection is treated as nonexistence.
- **F-M1.7 — Authority pollution:** authorization state has to be encoded inside World existence/identity to perform a governed operation.
- **F-M1.8 — Evidence authority:** an evidence record can authorize an effect merely because it exists.
- **F-M1.9 — Universal state pressure:** a required semantic case cannot be expressed without adding a universal Event/State ontology.
- **F-M1.10 — Genericity failure:** a genuinely new object kind requires bespoke semantic storage or a second source of truth.

## 10. Completion decision

**M1 COMPLETE at design/evidence level.**

The task has met its bounded completion condition:
- minimum kernel candidate documented;
- required non-collapse invariants documented;
- falsifiers named;
- evidence gaps named;
- no storage/authority semantics were absorbed;
- no boundary was activated;
- no Ω law changed;
- no production implementation was started.

The next progression should be **peer evidence reconciliation of the M1 seam contracts**, not a broad implementation cycle. M2 reference-resolution work should remain dependent on accepted World-side seam semantics from CFA-03/CFA-04.

## 11. Development-acceleration handoff implication

This packet is intentionally reusable by the central development-acceleration substrate:
- domain terms and anti-definitions are explicit;
- top seams have subjects, crossing artifacts and falsifiers;
- evidence classes and freshness are named;
- unresolved inputs are isolated rather than hidden.

The central Steward may index and validate this structure mechanically. It must not infer additional World semantics from the existence of the packet.
