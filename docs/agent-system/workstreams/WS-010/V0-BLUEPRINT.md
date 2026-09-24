# P1-10 / WS-010 — Program Observatory V0 Blueprint

> **Classification: DERIVED — PROPOSED V0**
> **Status:** Full design baseline for dedicated research/build workstream
> **Base tip:** fbef973c443b125c442fd674ae9a9f4f5f532207

## 1. Product statement

Program Observatory is a read-only visual model of the program's current state.

Its mental model is:

> **Living architecture + mission control.**

It should feel like an architecture system that is alive, not like a project
management board decorated with diagrams.

## 2. Core design laws

### O1 — Reflection, not authority

The observatory has no write path to project state in V0. It cannot create tasks,
assign owners, change workstream status, approve decisions, mark evidence as
authoritative, edit BCP state, edit Ω law, or rewrite repository documents.

### O2 — Context beats identifiers

An identifier is never sufficient as the primary label.

Bad: P1-02 · WS-002 · IMPL-04

Good: Repository Truth & Drift — determining what exists, what governs it, what
is obsolete, and where program/architecture drift exists.

The identifier may appear as a small reference beneath the contextual name.

### O3 — Everything is an entity

The model is not limited to tasks or documents. A node may represent any meaningful
program object for which a stable identity and source can be established.

### O4 — Relationships are first-class

The canvas is spatial, but its semantics are graph relationships. A visual
position is presentation and must never become hidden project state.

### O5 — State is multidimensional

Do not collapse authority, lifecycle, provenance, visibility, ownership and
governance into one status enum.

### O6 — Unknown is a real state

If sources cannot establish a fact, the observatory displays unknown or uncertainty.
It never upgrades inference to fact merely to make the canvas clean.

### O7 — Evidence travels with representation

Every non-trivial displayed claim has a source/evidence route.

### O8 — Semantic zoom, not label zoom

Zoom changes the amount and contextual richness of representation. It should not
merely make tiny labels larger.

### O9 — Views are projections, not databases

Program Map, System Map, Agent Map, Work Map and Evidence Map all project one model.

### O10 — Attention informs; it does not instruct

Waiting for an owner decision is valid if sourced. Asking the owner to do something
that no source states is not.

## 3. Spatial model

    VIVIM MINE             BCP / FORGE             Ω DESTINATION
   legacy evidence       coordination +           governed destination
                         migration machinery          architecture
                              |                     /
                              |                    /
           +------------- P1 WORKSTREAMS ---------+

This is a conceptual arrangement, not a claim that all relationships are linear.

## 4. Semantic zoom ladder

### Z0 — Program

Three territories, workstream clusters, high-level attention, major boundaries.

### Z1 — Territory

Major areas, workstreams crossing the territory, significant relationships,
state summaries.

### Z2 — Workstream

Mission in natural language, current lifecycle/proof state, associated agents,
evidence, dependencies, attention, and any next gate/action explicitly recorded
by source state.

### Z3 — Area / subsystem

Concrete repository areas, architectural components, relevant work, dependencies,
evidence routes and conflicting surfaces.

### Z4 — Work / artifact

Human-readable artifact description, source reference, state dimensions,
relationships, evidence, change history and branch/commit/PR references.

### Z5 — Source / evidence

Exact source, relevant metadata/excerpt, provenance, authority, timestamp/hash
where available and derivation path.

## 5. Entity card contract

Every meaningful entity should answer:

**What is it?** Natural-language name and contextual description.

**Why is it here?** Relationship(s) connecting it to the current view.

**What state is it in?** Lifecycle/epistemic/operational state, with dimensions
separated.

**Who/what is associated with it?** Only from source state.

**What supports this?** Evidence/source links.

**What is uncertain?** Explicit unknown/conflict fields.

**Where can I go next?** Navigation to related source/projection, never an invented task.

## 6. Visual grammar

| Visual channel | Meaning |
|---|---|
| Shape | entity kind |
| Fill | primary state |
| Border | lifecycle/epistemic distinction |
| Edge | relationship type |
| Edge style | relationship qualifier where justified |
| Size | structural scale/significance |
| Halo | contextual attention |
| Badge | compact exception/state marker |
| Text | semantic meaning |
| Secondary text | internal reference / technical metadata |

Color is supplemental and must not be the sole encoding.

Suggested V0 semantic family:

- green: established/proven/current;
- blue: active/operating;
- yellow: waiting/registered/gated;
- orange: blocked/dependency;
- red: conflict/failure;
- purple: proposed/research;
- grey: historical/inactive;
- neutral/dashed: unknown/unresolved.

These are presentation conventions, not authority.

## 7. Attention architecture

Global attention is a compact derived summary of conflicts, blockers, recorded
owner-decision gates, unresolved proposals, stale/superseded surfaces, unknown
critical relationships and significant changes.

No ranking or priority score is invented.

Contextual attention filters that summary to the visible neighborhood.

Clicking attention navigates to source entities. It does not create a task.

## 8. Top-level views

### Program Map
Question: Where are we?

### System Map
Question: How does the architecture fit together?

### People / Agent Map
Question: Who/which agent is associated with what recorded work?

This reflects recorded responsibility. It does not infer performance, competence,
importance or productivity.

### Work Map
Question: What is actually moving?

### Evidence / History Map
Question: Why do we believe this state?

### Time / Evolution
Question: How did this state emerge? V0+ candidate.

## 9. Data architecture

    SOURCE SYSTEMS
       Git/GitHub
       BCP state/logs/reports
       Ω law/derived artifacts/gates
       agent-system documents
       migration/evidence records
             |
             v
       INGEST / RECONCILE
       identity resolution
       relationship extraction
       state derivation
       provenance attachment
       conflict/unknown preservation
             |
             v
       OBSERVATORY MODEL
       entities
       relationships
       state dimensions
       evidence refs
       attention projections
             |
             v
       READ-ONLY PROJECTIONS
       Program / System / Agent / Work / Evidence views

The Observatory Model is a derived cache/projection, not an authority store.

## 10. Entity identity

Prefer, in order:

1. authoritative stable source identity;
2. repository path + repository identity;
3. Git/GitHub stable identifier;
4. existing workstream/agent identifier;
5. explicit composite identity;
6. unresolved identity.

Never silently merge because names look similar.

## 11. Relationship vocabulary

Minimum V0 vocabulary:

contains, part-of, depends-on, owned-by, worked-by, produces, evidenced-by,
derived-from, implements, supersedes, conflicts-with, duplicate-of, blocks,
waiting-on, changes, references.

Do not add a relationship merely because two objects are near each other.

## 12. Read-only enforcement

Separate source readers, reconciliation/derivation and rendering.

If local cache storage exists, it is derived and rebuildable and must not mutate
source authority.

## 13. Failure behavior

If a source cannot be read: show unavailable/stale and preserve the source boundary.

If two authorities conflict: show the conflict and applicable authority hierarchy.

If identity is ambiguous: show candidates as distinct or unresolved.

If generated output disagrees with its generator: show derivation drift.

If an agent report disagrees with repository state: show it as a claim/evidence
item, not as truth.

## 14. V0 implementation boundary

Implementation begins only after the dedicated research pair confirms the model and
identifies the smallest falsifiable slice.

Likely first slice:

Render the Program Map from existing repository/workstream/agent-system documents,
with contextual human-readable cards, explicit relationships, multidimensional
state, provenance, attention, and no mutation path.

Do not begin with the entire repository, 3D, an LLM-driven semantic graph, a vector
database, or autonomous prioritization.

## 15. Explicit non-goals

- Jira/Trello replacement.
- ChatGPT/agent conversation UI.
- Feedback/annotation workflow.
- Project authority.
- Universal ontology database.
- Autonomous project manager.
- AI-generated truth without evidence.
- Hidden ranking of people or work.
- A graph whose labels are mostly IDs.
- A repository tree masquerading as a program model.
