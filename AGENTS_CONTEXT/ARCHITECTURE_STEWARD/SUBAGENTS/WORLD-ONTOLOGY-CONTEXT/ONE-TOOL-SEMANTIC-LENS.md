# CFA-01 One Tool — Semantic Lens

> Status: PROPOSED / DESIGN SEED
> Date: 2026-09-25
> Owner: CFA-01 World / Ontology / Context

## 1. The one thing

If CFA-01 could keep only one serious operational tool, it would be a **Semantic Lens**.

The question it should answer is:

> What is this, how does it relate to the World, what evidence supports that understanding, who owns the adjacent meaning, what context does it belong in, and what would change if it changed?

It is not another ontology engine, graph database, search product, or Architecture Graph. It is a **lens over existing sources of truth and their projections**.

~~~text
many evidence sources
       ↓
   Semantic Lens
       ↓
one inspectable semantic answer
       ↓
human / agent decision
~~~

The Lens is intentionally read-oriented. It makes the semantic neighborhood inspectable without becoming another authority.

## 2. Why this is the right one tool

Most CFA-01 work is a variation of:

~~~text
find subject
  →
identify meaning
  →
find relationships
  →
trace identity
  →
trace evidence
  →
locate owner
  →
understand context
  →
inspect change / conflict
~~~

Today those steps are distributed across destination documentation, the Architecture Graph, System Intelligence, World/Object research, historical Ω, peer CFA context, evidence/provenance, and implementation.

The Lens is the common interrogation surface joining those sources.

## 3. Core invariant

~~~text
CANONICAL SOURCES / EVIDENCE
          ↓
       SEMANTIC LENS
          ↓
      READ / TRACE / DERIVE
          ↓
   answer + evidence + uncertainty
~~~

Not:

~~~text
sources → lens → new canonical graph
~~~

Indexes, caches and derived projections may exist for performance, but Lens output is never automatically canonical.

## 4. What it should answer

### Identity
- What is X?
- Is X the same thing as Y?
- Which source identities correspond to it?
- Which revisions and representations exist?

### Relationships
- What does X contain?
- What contains X?
- What is X related to?
- Which relationships are asserted, contested, retracted, or time-bounded?

### Evidence
- Why do we believe this?
- What source established it?
- What evidence supports this relationship?
- What is observed, derived, proposed, or unknown?

### Ownership
- Which CFA owns the meaning?
- Which CFA owns the durable record?
- Which CFA owns implementation or execution?
- What are the neighboring seams?

### Context
- What is relevant to purpose P?
- Why is an item included?
- What would be omitted?
- What freshness, provenance and authority constraints apply?

### Evolution
- What is affected if X changes?
- Which identities must survive?
- Which relationships or projections need reconsideration?

### Architecture
- Which destination concepts and responsibilities does X touch?
- Which journeys exercise it?
- What implementation or evidence supports it?
- What remains unproven?

These are different views of one inspection capability.

## 5. The mental model

The center of the tool is a subject. Around it is the semantic neighborhood:

~~~text
                 evidence
                    ↑
                    │
owner ←────── SUBJECT ──────→ relationships
                    │
                    ↓
             identity / history
                    │
          ┌─────────┴─────────┐
          ↓                   ↓
       context            architecture
          │                   │
          ↓                   ↓
       purpose            responsibility
~~~

The user or agent should not have to know whether the answer came from NODES.json, EDGES.json, a canonical object, a source identity, or a research record.

## 6. Core interface

Conceptually:

~~~text
lens.inspect(target, purpose?, scope?, options?)
~~~

"target" can be:
- semantic address;
- canonical object reference;
- external/source identity;
- architecture node;
- responsibility;
- evidence ID;
- relationship;
- natural-language question;
- repository path;
- unresolved concept.

The result is a structured semantic inspection:

~~~text
LensResult
  subject
  identity
  type
  currentMeaning
  relationships[]
  sources[]
  evidence[]
  owners[]
  contextCandidates[]
  projections[]
  history[]
  conflicts[]
  unknowns[]
  affectedByChange[]
  relatedArchitecture[]
  epistemicStatus
~~~

Unknown sections remain explicitly unknown. The tool never fabricates completeness.

## 7. Evidence is part of the answer

A useful answer is not merely:

~~~text
Project X
  contains
Task Y
~~~

It should be able to explain:

~~~text
relationship: REL-123
evidence: EV-456
source: imported Linear issue
observed: 2026-09-24
assertion state: asserted
external identity: linear/workspace/issue-789
~~~

Derived conclusions should say that they are derived and show their basis.

The critical discipline is:

~~~text
EVIDENCE ≠ AUTHORITY
CONFIDENCE ≠ PROOF
SOURCE IDENTITY ≠ CANONICAL IDENTITY
PROJECTION ≠ CANONICAL OBJECT
CONTEXT ≠ SOURCE TRUTH
UNKNOWN ≠ FAILURE
~~~

## 8. One tool, multiple operations

The tool can expose named operations without becoming multiple systems:

- "inspect" — understand one subject;
- "find" — resolve candidates from a question;
- "trace" — follow semantic relationships or a cross-domain path;
- "explain" — return the evidence/lineage chain;
- "compare" — compare competing interpretations without silently choosing;
- "context" — construct a candidate bounded Context for a stated purpose;
- "boundary" — show neighboring ownership and seams;
- "impact" — show likely effects of a semantic change.

One tool, one mental model.

## 9. Current-generation design

The first version can be small and repository-backed.

### Sources

~~~text
Architecture Graph
  ├── NODES.json
  ├── EDGES.json
  └── GRAPH-MANIFEST.json

System Intelligence
  ├── ATOMS.json
  └── EDGES.json

World/Object research
  ├── canonical object model
  ├── relationship model
  └── world projection model

Architecture / CFA context
  ├── responsibility matrix
  ├── journey mapping
  ├── peer boundaries
  └── current state

Historical Ω / VIVIM
  └── explicitly requested evidence
~~~

The first implementation can emit deterministic Markdown or JSON inspection reports.

The point of V1 is not a polished user interface. It is proving that one semantic question can traverse the repository intelligence without manually reconstructing several systems.

## 10. Future generations

### Generation 1 — Repository Lens

Documents + architecture graph + research/evidence.

Question:

> How does the architecture currently understand this?

### Generation 2 — Canonical World Lens

Canonical objects + relationships + identities + revisions + evidence.

Question:

> What is this in the user's actual World?

### Generation 3 — Context Lens

Purpose + scope + attention + current work + freshness + authority constraints.

Question:

> What bounded context is relevant to this operation?

### Generation 4 — Live World Lens

Live observations + provider realizations.

Question:

> What is canonical, what is currently observed externally, and where do they differ?

### Generation 5 — Evolution Lens

Temporal and migration reasoning.

Question:

> What semantic continuity must survive this change?

The interface survives while the substrate grows.

## 11. Productivity tools

This is where the Lens becomes especially valuable.

The user should be able to ask:

~~~text
"What do I need to finish the launch?"
~~~

without first naming a productivity provider.

The Lens can converge:

~~~text
Project
  ├── tasks
  ├── documents
  ├── conversations
  ├── people
  ├── recent work
  ├── repositories
  ├── events
  └── external source identities
~~~

Notion, Linear, Slack, GitHub, email, calendars and similar systems then become **sources or realizations of World knowledge**, rather than separate VIVIM semantic universes.

The Lens is what allows CFA-01 to inspect that convergence.

## 12. Addressing

Eventually the Lens should understand semantic addresses such as:

~~~text
project:"Launch"
task:"website copy"
person:"Maria"
conversation:"pricing"
space:"founders"
~~~

and traversals such as:

~~~text
project:"Launch"
  → tasks(status=open)
  → assignedTo:"Maria"
  → evidence(recent)
~~~

The exact language and command grammar belongs partly to Semantic Continuity. CFA-01 owns the semantic meaning of what an address resolves to.

## 13. Architecture Graph boundary

The Architecture Graph answers:

> How does the documented VIVIM architecture fit together?

The Semantic Lens answers:

> What does this particular thing mean, where does that meaning come from, and how does it connect to everything else?

Therefore:

~~~text
Architecture Graph ← Semantic Lens
Product World      ← Semantic Lens
~~~

But the Lens does not create either graph.

The current Architecture Graph is explicitly a documentation-first network with multiple views, while the World/Object research treats World as reconstructable from canonical objects and relationships. The Lens sits between those structures as an interrogation surface.

## 14. Context boundary

The Lens does not replace Context Assembly.

~~~text
Semantic Lens
     ↓
candidate semantic neighborhood
     ↓
Context contract
     ↓
Context Assembly
     ↓
bounded context
~~~

The Lens helps understand and select the semantic neighborhood. The governed context substrate remains responsible for operational assembly.

## 15. Peer boundary

For a subject, the Lens should be able to expose a neighborhood such as:

~~~text
Task
 ├── meaning / world relation → CFA-01
 ├── durable record           → CFA-02
 ├── execution / lifecycle    → CFA-05
 ├── provider realization    → CFA-06
 ├── surface                 → CFA-08
 └── migration / compatibility→ CFA-09
~~~

These are illustrative relationships, not a replacement for the current CFA register.

The Lens reports ownership; it does not invent ownership.

## 16. Change / impact mode

One especially valuable operation is:

~~~text
lens.impact(subject, proposedChange)
~~~

The result should expose:

- semantic meaning affected;
- canonical identity affected;
- relationships affected;
- context/projection consequences;
- architecture responsibilities affected;
- implementation references;
- evidence that may become stale;
- migration/reconciliation questions;
- unresolved unknowns.

This gives CFA-01 a practical bridge into evolution without taking over CFA-09.

## 17. Minimal internal architecture

The implementation should remain thin:

~~~text
SemanticLens
  ├── target resolver
  ├── source adapters
  │     ├── ArchitectureGraph
  │     ├── World
  │     ├── Evidence
  │     ├── Repository
  │     └── Peer/CFA context
  ├── traversal
  ├── identity correspondence
  ├── context candidate builder
  ├── conflict / uncertainty collector
  └── result renderer
~~~

The adapters may evolve. The semantic result contract is the durable seam.

## 18. Determinism

For a fixed source snapshot and explicit query:

~~~text
same sources
+ same query
+ same options
→ same result
~~~

Where live information or time changes the result, the Lens states that explicitly.

Every derived section should identify its basis.

## 19. Write boundary

Version 1 should be mostly read-only.

It may save:
- an inspection report;
- a research finding;
- a queue update;
- a Commons observation/question;
- a disposable cache.

It must not silently:
- create canonical World objects;
- rewrite semantic relationships;
- grant authority;
- mutate providers;
- change Ω law;
- promote a candidate interpretation into canon.

Any future mutation must use the normal governed path owned by the relevant system.

## 20. First proof

Test one known cross-domain subject, then a second from a different domain.

For each require:

1. identity;
2. source identities / representations;
3. relationships;
4. evidence;
5. destination responsibilities;
6. peer boundary;
7. candidate context;
8. explicit unknowns/conflicts.

The success criterion is:

> Can one semantic question traverse the existing repository intelligence without CFA-01 manually rebuilding five different systems?

That is more important than the UI.

## 21. Why this is enough to do most of my job

Almost every CFA-01 task reduces to:

~~~text
UNDERSTAND
    ↓
CONNECT
    ↓
CHECK EVIDENCE
    ↓
CHECK OWNERSHIP
    ↓
DERIVE CONTEXT
    ↓
UNDERSTAND CHANGE
~~~

The Semantic Lens gives me one operational surface for all six.

It does not make decisions for me. It makes the semantic neighborhood inspectable.

## 22. Seed principle

The tool should eventually feel like:

> **Show me what this means.**

Then:

> **Show me why.**

> **Show me what it touches.**

> **Show me what is uncertain.**

> **Show me what context I would need.**

> **Show me what would change.**

That is a more durable primitive for CFA-01 than a static ontology editor or a particular graph implementation.

## Current status

**PROPOSED.**

Do not implement merely because this document exists.

The next justified step is a small repository-backed proof using the current Architecture Graph, System Intelligence indexes and World/Object research, with no new source of truth.
