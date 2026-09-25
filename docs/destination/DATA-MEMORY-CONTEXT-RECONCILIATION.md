# D6 — Data, Memory & Context Reconciliation

> Classification: DERIVED — WORKING DESIGN / RESEARCH
> Status: initial destination reconciliation.
> Scope: connect the sovereign data model, imported/native conversations, memory, self-knowledge, and deterministic context assembly into one user experience.

## 1. Destination requirement

The user's data is not a pile of files and database rows.

It is the persistent substrate from which VIVIM understands:

- what exists;
- what happened;
- what the person knows;
- what the person is working on;
- what is relevant now;
- what can be remembered;
- what can be reconstructed.

The destination path is:

~~~text
SOURCE / EVENT
     ↓
CANONICAL RECORD
     ↓
RELATIONSHIP / REPRESENTATION
     ↓
MEMORY
     ↓
CONTEXT
     ↓
WORK / INTERACTION
     ↓
NEW EVIDENCE
~~~

The loop is continuous.

## 2. Existing Ω material

Ω already provides:

- append-only vault;
- namespace-specific retention rules;
- evidence references;
- provenance;
- epistemic kinds;
- revision history;
- deterministic mind derivation;
- context substrate;
- byte offsets / citations;
- bounded retrieval;
- principal-scoped context;
- deterministic digest;
- explicit refusal for unresolved/unlabelled context;
- export/roundtrip principles.

These should remain the constitutional substrate.

## 3. Existing VIVIM mine evidence

The legacy tree adds:

- conversation import parsers;
- conversation organization;
- memory engines;
- semantic retrieval;
- knowledge graph behavior;
- project/topic grouping;
- embeddings/search;
- context assembly;
- data import and content management.

Harvest only behavior that survives the Ω distinctions among reality, representation, evidence, and authority.

## 4. Data sovereignty model

The product should distinguish:

### Source data

What came from an external system or local file.

### Canonical local record

The local representation VIVIM stores for user control and continuity.

### Derived representation

A projection such as a summary, graph node, workspace card, or dashboard.

### Memory

A retained semantic statement/state with explicit epistemic meaning.

### Context

A temporary task-scoped assembly drawn from those records and memories.

A summary should never silently become source truth.

A model-generated belief should never silently become a FACT.

## 5. Conversation history

AI history import is important because it converts disconnected provider history into local, user-owned working material.

The existing import pack already provides:

- import source identity;
- original export provenance;
- conversation identity;
- message identity;
- role/content;
- source-native model where available;
- timestamps / estimated timestamps;
- deterministic parsing.

The destination integration is:

~~~text
provider export
   ↓
recorded parser
   ↓
canonical local conversation
   ↓
project / space relationships
   ↓
memory / search / context
~~~

The imported conversation remains identifiable as an imported source; it does not lose genealogy.

## 6. Memory model

Ω's epistemic distinction is foundational.

Useful memory kinds include:

- FACT;
- SOURCE;
- OBSERVATION;
- INFERENCE;
- OPINION;
- SUMMARY;
- MODEL-GENERATED BELIEF;
- USER ASSERTION.

Memory should answer:

> “What does VIVIM currently retain about this?”

It should also be possible to inspect:

- where it came from;
- when it was formed;
- what evidence supports it;
- whether it is stale;
- whether the user asserted it;
- whether a model inferred it.

## 7. Context is not memory

Memory is durable.

Context is assembled for the current task.

A context assembly may contain:

- the active project;
- selected conversations;
- relevant documents;
- current work state;
- user preferences;
- provider/account rules;
- recent events;
- explicit user attachments.

Most available memory does not belong in every context.

## 8. Current context

The destination needs a product-level current-context object, but not a second source of truth.

Conceptually:

~~~text
CURRENT CONTEXT
 ├── active space
 ├── active project
 ├── focused things
 ├── selected attachments
 ├── current work
 ├── recent relevant events
 ├── user constraints
 └── standing intent
~~~

This object is a derived lens.

It can change without changing canonical world identity.

## 9. Context assembly

The existing deterministic context substrate should remain responsible for:

- source selection;
- citation;
- byte ranges;
- epistemic labelling;
- budgets;
- staleness;
- digest;
- principal scope.

The product layer should provide the inputs:

- why the person is here;
- what they focused;
- what they explicitly named;
- what the current space implies;
- what work is active.

## 10. The second-brain experience

The user should be able to put an idea into VIVIM without deciding its final structure first.

For example:

> “I think we should build X.”

The environment can:

1. store the user assertion;
2. link it to current context;
3. find related conversations/documents;
4. present relevant evidence;
5. let the user turn it into a project, task, memory, or composition.

The initial idea remains a user assertion until stronger evidence or explicit user conversion changes its semantics.

## 11. Search and retrieval

Search should be a way to discover world/context candidates, not authority.

The system may combine:

- exact search;
- semantic similarity;
- recency;
- project relationship;
- explicit focus;
- user preference.

Retrieved results remain candidates until incorporated into a context or explicit decision.

## 12. Self-knowledge

`vivim.mind` is the appropriate pattern:

> derive the system's model of itself from evidence rather than maintain a second manually edited truth.

The same rule should apply to the user's world.

The product should be able to answer:

- what do I have;
- what is available;
- what is connected;
- what happened;
- what is uncertain;
- what can be done.

But every answer should be traceable to the evidence or clearly marked as inference.

## 13. Retention and deletion

Data sovereignty also means user control over persistence.

The product needs explicit semantics for:

- retention;
- archive/cold state;
- deletion;
- export;
- recovery;
- source replacement.

A derived representation can often be regenerated.

Essential source/user data cannot be treated as disposable cache.

## 14. Context privacy

Context assembly must remain scoped.

A provider or agent should receive only what the authority and user policy permit.

A user's private project should not become visible merely because another provider capability is installed.

This connects D6 directly to D4 routing and D5 agency.

## 15. Maturity path

### C0 — storage

Vault and durable namespace model.

### C1 — source genealogy

Imported/native records preserve source identity and provenance.

### C2 — world projection

Records become meaningful things/relationships.

### C3 — memory

Persistent semantic retention with explicit epistemic kind.

### C4 — context

Deterministic task-scoped evidence assembly.

### C5 — product continuity

Current project/work context survives restart.

### C6 — adaptive context

User rules, focus, standing intent, and work state shape context.

### C7 — sovereign second brain

User can inspect, correct, reorganize, export, and rebuild the retained world without surrendering its meaning.

## 16. Critical gaps

### G-C1 — unified source-to-memory lineage

The ingredients exist, but the product needs a single understandable provenance path.

### G-C2 — current-context product model

D-443 is the substrate; a first-class user-facing current-context projection still needs assembly.

### G-C3 — memory lifecycle

Creation is easier than correction, staleness handling, consolidation, and deletion.

### G-C4 — project-centered retrieval

Search exists in multiple forms; the product needs one coherent way to retrieve what matters to the current space/project.

### G-C5 — privacy-aware cross-provider context

Routing can select a provider, but the product must derive what context that provider is allowed to receive.

### G-C6 — complete exit

Export/recovery must reconstruct not only raw data but the user's working relationships and configurations.

## 17. Thin falsifier

Take an imported AI conversation and a local project.

Prove:

1. source genealogy is preserved;
2. conversation becomes a canonical world object;
3. it can be related to the project;
4. a memory/inference can cite the source;
5. current project context can select it;
6. a provider receives only the permitted context;
7. restart reconstructs the same project/context relationships;
8. export contains enough information to rebuild them.

## 18. Immediate implementation sequence

### D6-1 — source lineage map

Unify import/native source identity, canonical records, and evidence refs.

### D6-2 — project-centered memory

Connect conversations/documents/events to project relationships.

### D6-3 — current-context projection

Build the user-facing lens over D2 world + D3 work + D4 routing + D5 attention.

### D6-4 — context privacy

Derive provider-specific context subsets from authority and policy.

### D6-5 — correction/staleness

Add inspectable memory correction and stale-state behavior.

### D6-6 — exit/reconstruction

Prove export → restore retains world relationships and current workspace meaning.

## 19. Working conclusion

The second brain is not a separate app inside VIVIM.

It is the cumulative effect of:

**durable user-owned data + world relationships + memory semantics + deterministic context assembly + continual work history.**

That is why the vault remains the substrate, mind remains a derivation lens, and context remains a temporary assembly rather than a new store.

The destination experience should feel like:

> “VIVIM remembers my world.”

The architecture should make that statement provable.
