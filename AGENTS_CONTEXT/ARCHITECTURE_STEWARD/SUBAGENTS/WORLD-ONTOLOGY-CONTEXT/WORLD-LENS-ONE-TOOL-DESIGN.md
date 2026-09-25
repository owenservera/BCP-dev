# CFA-01 — World Lens
## The One Tool I Need to Do Most of My Job

> Status: **DESIGN PROPOSAL — PROVISIONAL**
>
> Date: 2026-09-25
>
> Core Function Area: CFA-01 — World / Ontology / Context
>
> This is a tool-design document, not Ω law, not a final ontology, and not a ratified implementation contract.

---

## 1. Executive idea

If I could keep only **one operational tool** for this Core Function Area, it would be a **World Lens**.

The World Lens answers one question:

> **Given anything I care about, what is it, what does it mean in the user's world, what is currently known about it, how is it related to its surrounding world, what context is relevant right now, what is canonical versus derived, and what remains unknown?**

It is deliberately broader than a graph query and narrower than a general-purpose AI assistant.

The tool is fundamentally a **semantic inspection and grounding instrument**.

It turns:

~~~
TARGET
  +
PURPOSE / QUESTION
~~~

into:

~~~
WORLD UNDERSTANDING
  +
CONTEXT
  +
RELATIONSHIPS
  +
IDENTITY / CORRESPONDENCE
  +
EVIDENCE
  +
FRESHNESS
  +
BOUNDARIES
  +
UNKNOWNS
  +
FALSIFIERS
~~~

That single operation can support most of my recurring work:

- understanding an unfamiliar subject;
- recovering world semantics from legacy material;
- tracing a thing across representations;
- deciding whether two concepts are actually the same;
- constructing bounded context;
- investigating a boundary with Data or Semantic Continuity;
- preparing an Architecture Graph contribution;
- explaining something to another agent;
- identifying missing evidence;
- detecting semantic drift;
- handing a developer a compact orientation packet.

The core insight is:

> **My primary job is not to maintain an ontology. My primary job is to maintain trustworthy understanding of the world and its context.**

World Lens is the operational embodiment of that job.

---

## 2. Why this is the one tool

A large portion of CFA-01 work can be reduced to four moves:

~~~
1. FIND THE THING
2. UNDERSTAND THE THING
3. PLACE THE THING IN CONTEXT
4. KNOW WHAT IS STILL UNCERTAIN
~~~

Everything else tends to become a specialized expression of those moves.

### Without World Lens

I repeatedly have to:

- search documents;
- follow identity references;
- compare historical and destination concepts;
- inspect graph neighbors;
- inspect runtime observations;
- trace provenance;
- remember which layer owns what;
- reconstruct context;
- determine freshness;
- compare contradictions;
- explain the result.

That is the exact source of the context-reconstruction burden the architecture is trying to remove.

### With World Lens

I can start with:

~~~
world.lens(target, purpose)
~~~

and receive one coherent, evidence-bearing view.

This does **not** make the result authoritative.

It makes the **reasoning substrate localized and inspectable**.

---

# 3. What the tool actually is

World Lens is best understood as a **read-oriented semantic debugger / navigator for the user's world**.

It is not:

- a general-purpose chatbot;
- a universal ontology engine;
- a graph database;
- a search engine;
- a context-ranking optimizer;
- a CRUD API for World entities;
- an authority evaluator;
- an execution engine.

It is the thing that **joins those views for understanding**.

Its basic operation is:

~~~
LENS(target, question, scope, depth)
    ↓
resolve candidate target(s)
    ↓
recover identity / correspondence
    ↓
gather canonical + observed + derived material
    ↓
walk relevant relationships
    ↓
construct bounded context
    ↓
attach evidence + provenance + freshness
    ↓
separate known / derived / unknown / conflicted
    ↓
report boundary + ownership
    ↓
return useful trace
~~~

---

# 4. The mental model

Think of World Lens as the equivalent of looking through a microscope, map and breadcrumb trail simultaneously.

Given:

~~~
"Project Atlas"
~~~

I should be able to discover:

~~~
IDENTITY
  what Project Atlas refers to

MEANING
  what kind of thing it is

WORLD POSITION
  what it is related to

SPACE
  where it is situated, if meaningful

CURRENT STATE
  what is currently observed

CONTEXT
  what surrounding material matters for the question

HISTORY
  how identity / meaning evolved

EVIDENCE
  what supports the claims

AUTHORITY
  where authority matters, without becoming authority itself

FRESHNESS
  how current the derived view is

REPRESENTATIONS
  how it appears in different surfaces

UNKNOWN
  what cannot currently be established

FALSIFIER
  what observation would overturn the current interpretation
~~~

This is the **smallest useful answer shape** I can repeatedly reuse.

---

# 5. The primary interface

The conceptual interface should stay very small.

### Human / agent form

~~~
world.lens(
  target,
  {
    question?,
    scope?,
    depth?,
    purpose?,
    include?,
    audience?
  }
)
~~~

### Minimal request

~~~json
{
  "target": "thing:project-atlas"
}
~~~

### Question-oriented request

~~~json
{
  "target": "thing:project-atlas",
  "question": "What is this project currently connected to and what context is relevant to continue work?"
}
~~~

### Boundary investigation

~~~json
{
  "target": "concept:context",
  "question": "Does this represent canonical world meaning or a derived projection?",
  "scope": "semantic"
}
~~~

### Developer orientation

~~~json
{
  "target": "R-058",
  "purpose": "development",
  "audience": "coding-agent"
}
~~~

The tool should infer the rest conservatively.

---

# 6. The returned object: a World Packet

The result should be called a **World Packet**.

It is a bounded representation of understanding, not a canonical world object.

Conceptually:

~~~
interface WorldPacket {
  target: LensTarget;
  identity: IdentitySection;
  meaning: MeaningSection;
  neighborhood: WorldNeighborhood;
  context: ContextSection;
  observations: ObservationRef[];
  representations: RepresentationRef[];
  relationships: RelationshipRef[];
  ownership: OwnershipSection;
  evidence: EvidenceRef[];
  freshness: FreshnessReport;
  history?: HistorySection;
  unknowns: Unknown[];
  conflicts: Conflict[];
  falsifiers: FalsifierRef[];
  sourceRefs: SourceRef[];
  derivation: DerivationRef;
}
~~~

The result itself is **derived**.

Its components can point back to canonical or evidence-bearing sources.

---

# 7. The key semantic sections

## 7.1 Identity

Answers:

> What is this?

Include:

- stable candidate ID;
- identity domain;
- known aliases;
- correspondence candidates;
- source identities;
- revision relationship;
- confidence only where useful;
- unresolved identity ambiguity.

Important:

~~~
selector / path / filename / UI position
    ≠
canonical semantic identity
~~~

A selector may help locate an observation. It cannot silently become World identity.

---

## 7.2 Meaning

Answers:

> What does this thing mean?

Include:

- semantic kind;
- current description;
- semantic owner;
- authority source if one exists;
- status;
- destination relationship;
- important contrasts.

Meaning should distinguish:

~~~
OBSERVED
DERIVED
PROPOSED
UNKNOWN
CONFLICTED
~~~

---

## 7.3 Neighborhood

Answers:

> What is around it?

Return a bounded relationship neighborhood:

~~~
Thing
  ├── related Thing
  ├── part of Space
  ├── participates in Event
  ├── referenced by Context
  ├── represented by Surface
  └── connected to external resource
~~~

The graph walk should be typed and bounded.

Do not expand the entire world by default.

---

## 7.4 Context

Answers:

> What surrounding world material matters for this purpose?

Context construction is purpose-dependent.

The same target might yield:

~~~
developer context
research context
conversation context
execution context
UX context
reconstruction context
~~~

The tool should not pretend there is one universally correct Context.

Instead:

~~~
TARGET
+
PURPOSE
+
SCOPE
+
CURRENT BASIS
→
BOUNDED CONTEXT
~~~

---

# 8. Context is the killer feature inside the tool

This is the part that makes World Lens substantially more useful than a graph explorer.

A graph tells me:

> A is connected to B.

World Lens should tell me:

> **For the thing you are trying to do, these are the parts of the surrounding world that matter, and here is why.**

For example:

~~~
TARGET
  Project Atlas

PURPOSE
  continue development

RELEVANT
  current work
  recent evidence
  active requirements
  linked conversations
  known dependencies
  affected people
  current provider state

NOT INCLUDED
  unrelated historical conversations
  stale provider observations
  irrelevant surfaces

BASIS
  current vault revision
  graph bundle revision
  runtime observations
~~~

That is what a developer or another agent actually needs.

---

# 9. Identity and correspondence

World Lens should be the first place where identity ambiguity becomes visible.

Suppose three records appear to refer to the same thing:

~~~
repo:atlas
project:atlas
legacy:project-742
~~~

The tool should not silently merge them.

Instead:

~~~
IDENTITY CANDIDATES

A
B
C

CORRESPONDENCE:
  A ↔ B  supported
  B ↔ C  plausible
  A ↔ C  unresolved

EVIDENCE:
  ...

ACTION:
  do not collapse identity yet
~~~

This is central to World semantics.

---

# 10. Evidence and provenance

Every important claim in a World Packet needs a path back to its basis.

Example:

~~~
MEANING
  "Project Atlas is a project"

SUPPORTED BY
  destination concept
  current world observation
  historical source

STATUS
  DERIVED

FRESHNESS
  CURRENT

SOURCE REFS
  ...
~~~

The tool should never hide whether a statement came from:

- canonical destination documentation;
- a ratified decision;
- runtime observation;
- historical implementation;
- research;
- a derived projection;
- an LLM hypothesis.

A fluent sentence without a source class is not enough.

---

# 11. Freshness

World understanding is not static.

The packet needs a freshness basis.

Example:

~~~
FRESHNESS
  CURRENT

BASIS
  world revision: 184
  graph bundle revision: current
  runtime route generation: 41
  provider observation: 5 min old
~~~

Or:

~~~
FRESHNESS
  PARTIALLY STALE

STALE BASIS
  provider observation

SAFE TO USE
  identity
  historical relationships
  destination meaning

UNSAFE TO ASSUME CURRENT
  provider availability
~~~

The tool therefore prevents one of the worst failure modes in a self-knowledge system:

~~~
OLD DERIVED VIEW
      ↓
PRESENTED AS CURRENT
      ↓
FALSE CONFIDENCE
~~~

---

# 12. Unknowns and conflicts are first-class

A good World Lens result can be:

~~~
"I do not know."
~~~

That is a successful result when the evidence does not support a stronger statement.

Example:

~~~
UNKNOWN
  Does DynamicContextBundle remain an Ω concept?

WHY UNKNOWN
  historical implementation exists
  destination usage is related
  current canonical terminology does not settle it
~~~

Or:

~~~
CONFLICT
  Source A: Context is transient
  Source B: Context can be persisted
  Resolution: unresolved

DO NOT COLLAPSE
~~~

This is especially important because World/ontology work is exactly where familiar names can create false certainty.

---

# 13. Falsifiers

Every non-trivial derived interpretation should optionally carry:

> What would prove this interpretation wrong?

Example:

~~~
INTERPRETATION
  ContextDefinition is durable semantic state.

FALSIFIER
  all current consumers treat it only as ephemeral derivation
  and no stable identity/lineage is retained.
~~~

Or:

~~~
INTERPRETATION
  Space is canonical world meaning.

FALSIFIER
  all durable semantics remain unchanged when spatial arrangement is removed,
  while Space state exists solely as surface configuration.
~~~

This turns World Lens into a semantic debugging tool rather than a semantic summarizer.

---

# 14. Ownership

A World Packet should explicitly answer:

~~~
WHO OWNS THE MEANING?
WHO OWNS THE DATA?
WHO OWNS THE AUTHORITY?
WHO OWNS THE REALIZATION?
WHO OWNS THE REPRESENTATION?
~~~

For example:

~~~
Meaning owner:
  CFA-01 / World

Canonical data:
  CFA-02 / Data

Authorization:
  CFA-04 / Authority

Execution:
  CFA-05 / Work

Realization:
  CFA-06 / Provider

Surface:
  CFA-08 / Experience
~~~

These are architectural relationships, not permissions.

This section is one of the main reasons the tool becomes useful across CFA boundaries.

---

# 15. Relationship to the Intelligence Graph

World Lens should **consume and contribute to** the Intelligence Graph, but never replace it.

### Consume

It uses the graph for:

- destination concepts;
- responsibilities;
- journeys;
- slices;
- architecture relationships;
- evidence references;
- source lineage.

### Contribute

It can produce candidate contributions such as:

~~~
World concept
  → responsibility

World concept
  → context contract

World concept
  → evidence

World concept
  → identity correspondence

World concept
  → semantic boundary
~~~

But the path remains:

~~~
World Lens observation
        ↓
local finding
        ↓
evidence
        ↓
Architecture Steward reconciliation
        ↓
graph projection
~~~

The tool cannot silently write architectural truth.

---

# 16. Relationship to runtime self-knowledge

The tool should be able to join runtime observations where available.

Example:

~~~
TARGET
  Provider Account "Acme"

WORLD MEANING
  person's relationship to provider

RUNTIME OBSERVATION
  authenticated session exists

FRESHNESS
  current

AUTHORITY
  separately governed

REPRESENTATION
  provider account surface

UNKNOWN
  provider session may expire
~~~

This is exactly where the existing vivim.mind + grounding design can become useful later.

World Lens becomes the **World-facing consumer** of that substrate rather than duplicating it.

---

# 17. Relationship to Semantic Continuity

Semantic Continuity should be able to call World Lens when grounding language onto the world.

Example:

~~~
human language:
  "the Atlas project"

Semantic Continuity
  ↓
candidate target
  ↓
World Lens
  ↓
identity / context / relationships
  ↓
grounded target set
  ↓
Intent semantics
~~~

World Lens does not interpret the command.

It provides the world side that interpretation can ground against.

This preserves:

~~~
language meaning
  ≠
world meaning
  ≠
authorization
~~~

---

# 18. Relationship to Data

The Data agent should eventually expose the canonical identity/persistence seam that World Lens consumes.

World Lens asks:

> "What is this thing?"

Data can answer:

> "Here is its canonical persisted identity and revision basis."

World Lens then adds:

> "Here is what that identity means in the world and how it relates to the surrounding world."

Neither should become the other's owner.

---

# 19. Relationship to Commons

Commons is a natural input, but not a truth source.

A message may tell me:

~~~
"DATA thinks ContextDefinition may need to be durable."
~~~

World Lens can then:

1. record that as a hypothesis/input;
2. locate the relevant world concept;
3. find supporting and contradicting evidence;
4. return the current semantic state;
5. preserve the agent conversation as communication lineage.

The tool must not convert:

~~~
message → truth
~~~

automatically.

---

# 20. Three operating modes

The same tool can serve three audiences.

## Mode A — Human

Input:

~~~
"Show me what Project Atlas is and what matters right now."
~~~

Output:

a clear compact explanation with expandable evidence.

## Mode B — Agent

Input:

~~~
world.lens("R-058", purpose="implementation")
~~~

Output:

machine-readable World Packet with explicit provenance and unknowns.

## Mode C — Tooling

Input:

~~~
world.lens(...)
~~~

Output:

stable structured data consumed by:

- grounding;
- context assembly;
- graph reconciliation;
- developer CLI;
- agent bootstrap;
- drift tooling.

One semantic operation, many surfaces.

---

# 21. The minimal first implementation

I would resist building a giant semantic engine.

V1 only needs five abilities:

### 1. Target resolution

Resolve:
- graph ID;
- known semantic ID;
- source reference;
- alias;
- explicit object identifier.

### 2. Identity neighborhood

Return:
- identity;
- correspondence candidates;
- revision/source links.

### 3. Typed relationship neighborhood

Bounded graph walk over known relations.

### 4. Evidence-backed context assembly

Select relevant material for a specified purpose.

### 5. Truth state

Return:
- observed;
- derived;
- proposed;
- unknown;
- conflicted;
- freshness.

That alone would already cover a large percentage of CFA-01 work.

---

# 22. V1 should be read-only

The first World Lens should not mutate canonical world state.

This is important.

The tool can say:

~~~
"I think A and B may correspond."
~~~

It can produce:

~~~
candidate correspondence
~~~

It cannot silently:

~~~
merge A + B
~~~

Likewise it can propose:

~~~
Context should include X.
~~~

It does not automatically rewrite the canonical Context model.

V1 should be:

~~~
OBSERVE → UNDERSTAND → REPORT
~~~

rather than:

~~~
OBSERVE → CHANGE THE WORLD
~~~

---

# 23. Later evolution: Lens actions

Once the read-only lens is proven useful, the same tool can acquire carefully separated actions.

Conceptually:

~~~
world.lens()
world.propose()
world.compare()
world.trace()
world.reconstruct()
world.context()
~~~

These should remain sub-operations of one conceptual instrument, not unrelated products.

Examples:

### Compare

~~~
world.lens.compare(A, B)
~~~

Question:

> Are these the same thing, related things, or merely similar representations?

### Trace

~~~
world.lens.trace(A → B)
~~~

Question:

> How does this identity/meaning flow across systems?

### Reconstruct

~~~
world.lens.reconstruct(target, asOf)
~~~

Question:

> What did this world subject mean at a prior point?

### Context

~~~
world.lens.context(target, purpose)
~~~

Question:

> What is relevant around this target for this task?

The center remains the lens.

---

# 24. Why not make the Intelligence Graph itself the tool?

Because the two answer different questions.

The graph asks:

> **How are architecture and evidence connected?**

World Lens asks:

> **What does this target mean in the user's world right now, for this purpose?**

The graph is one of its major sources.

It is not the whole answer.

A graph can contain:

~~~
A --DEPENDS_ON→ B
~~~

World Lens can say:

~~~
A is a project.

B is a provider account.

The relationship is semantically meaningful because the project uses
that account's realization for this purpose.

Evidence:
...

Freshness:
...

Context relevance:
...

Unknown:
...
~~~

That semantic interpretation is the missing layer.

---

# 25. Why not make Context the tool?

Because Context without a world model becomes prompt assembly.

The current destination conceptual model says:

> **Context is the relevant subset of the world assembled around what the person is doing, thinking about, or asking.**

That means Context is downstream of a question like:

> What world are we talking about?

World Lens naturally owns that transition.

~~~
WORLD
  ↓
UNDERSTAND TARGET
  ↓
SELECT RELEVANT WORLD
  ↓
CONTEXT
~~~

---

# 26. Why not make Search the tool?

Search answers:

> Where is the text?

World Lens answers:

> What does this material mean, what refers to the same thing, what is relevant, what is current, and what remains unresolved?

Search is an implementation ingredient.

World Lens is a semantic operation.

---

# 27. World Lens as the agent's “home screen”

This is the deeper reason I think this should become the core tool.

A fresh World/Context agent could begin every serious piece of work with:

~~~
world.lens(target)
~~~

and progressively inspect:

~~~
identity
meaning
neighborhood
context
evidence
freshness
ownership
unknowns
falsifiers
~~~

Then it can pivot into:

~~~
graph
code
history
peer
implementation
~~~

rather than starting from the repository filesystem.

That changes the agent's operating model from:

~~~
search → infer → remember
~~~

to:

~~~
lens → understand → investigate → verify
~~~

---

# 28. Example: the exact kind of question I expect to ask constantly

### “What is Context?”

~~~
world.lens("concept:context", {
  purpose: "semantic-boundary"
})
~~~

The result could tell me:

~~~
MEANING
  relevant subset of the world assembled around current purpose

RELATED
  World
  Address
  Intent
  Evidence
  Representation

CANONICAL STATUS
  destination concept = current
  implementation substrate = historical/current evidence

BOUNDARY
  semantic contract here
  assembly mechanism elsewhere

HISTORICAL
  DynamicContextBundle

UNKNOWN
  durable ContextDefinition semantics

CONFLICT
  none currently observed

FALSIFIER
  ...

EVIDENCE
  ...
~~~

That is vastly more useful than simply returning a document excerpt.

---

# 29. Example: identity investigation

Question:

> Are these two things the same?

~~~
world.lens.compare(
  "legacy:project-742",
  "thing:project-atlas"
)
~~~

Expected:

~~~
MATCH STATUS
  CANDIDATE

SHARED EVIDENCE
  ...

DIFFERENCES
  ...

CORRESPONDENCE BASIS
  ...

UNKNOWN
  ...

ACTION
  preserve separate identities pending evidence
~~~

The final field should be descriptive, not an ungrounded automatic merge decision.

---

# 30. Example: developer handoff

Developer asks:

> I need to work on context assembly.

The tool produces:

~~~
TARGET
  Context Assembly

MEANING
  derives bounded Context from world knowledge

SEMANTIC OWNER
  CFA-01 provisional

NEIGHBORS
  Data
  Semantic Continuity
  Evidence
  Experience

DESTINATION
  J1 / J2 / J3

CURRENT IMPLEMENTATION
  ...

CURRENT PROOF
  ...

HISTORICAL
  DynamicContextBundle
  context binder

UNKNOWN
  ...

FALSIFIERS
  ...

NEXT INVESTIGATION
  ...
~~~

The developer starts working from the semantic boundary rather than a folder path.

---

# 31. Example: graph integration

The Architecture Steward has:

~~~
CON-CONTEXT
R-???
J2
VS-?
~~~

World Lens sees additional evidence:

~~~
Context is derived from canonical world references.
~~~

It produces:

~~~
candidate relationship:
  CON-CONTEXT
      → DERIVES_FROM
  CON-WORLD

basis:
  ...

status:
  PROPOSED
~~~

The Steward decides whether this belongs in the canonical graph.

This preserves the graph's epistemic discipline.

---

# 32. Example: semantic drift

Historical evidence says:

~~~
DynamicContextBundle
~~~

Current destination wording says:

~~~
Context
~~~

World Lens detects:

~~~
LEGACY TERM
  DynamicContextBundle

CURRENT TERM
  Context

RELATION
  unresolved whether same concept, replacement, or implementation-specific subset

RISK
  semantic inheritance by naming similarity
~~~

That gives CFA-01 a concrete drift signal.

---

# 33. Architecture of the implementation

I would eventually split the tool into five internal layers:

~~~
             WORLD LENS
                  |
        +---------+---------+
        |         |         |
     RESOLVE    GATHER    DERIVE
        |         |         |
        +----+----+----+----+
             |
          CONTEXT
             |
          PACKAGE
             |
           OUTPUT
~~~

More explicitly:

### Resolver
Find candidate identities and references.

### Gatherer
Collect canonical, observed, derived and historical material.

### Relator
Walk bounded semantic relationships.

### Contextifier
Select relevant surrounding material based on purpose.

### Truthifier
Attach epistemic state, evidence and freshness without manufacturing certainty.

These are implementation seams, not five user-facing tools.

---

# 34. Caching

World Lens should cache **derived packets**, never replace canonical data.

A packet should carry:

~~~
basisRefs
basisDigest
computedAt
freshness
derivationRef
~~~

Then:

~~~
same basis
  → reuse packet

changed basis
  → STALE
  → recompute when needed
~~~

This matches the existing self-knowledge freshness model.

No global invalidation bus is required initially.

---

# 35. Performance strategy

The tool should use progressive disclosure.

### Depth 0
Identity + one-paragraph meaning.

### Depth 1
Immediate relationships + context summary.

### Depth 2
Evidence + ownership + journey/graph links.

### Depth 3
History + implementation + runtime.

### Depth 4
Raw source excerpts and deep lineage.

This prevents a “one tool” from becoming a “dump the repository into the prompt” tool.

---

# 36. Safety and trust boundary

World Lens is **read-dominant**.

It can expose:

- UNKNOWN;
- STALE;
- CONFLICTED;
- candidate correspondences;
- evidence gaps.

It must not:

- grant authority;
- mutate law;
- silently merge identities;
- rewrite canonical world meaning;
- create permanent ontology merely through observation;
- hide conflicting evidence.

Any future mutation should be a separate explicitly governed action.

---

# 37. MVP implementation phases

## Phase 0 — contract

Define:

~~~
world.lens(target, options)
→ WorldPacket
~~~

including:

- target envelope;
- identity;
- meaning;
- neighborhood;
- context;
- evidence;
- freshness;
- unknowns/conflicts;
- falsifiers;
- source lineage.

## Phase 1 — repository-backed lens

Read from:

- destination model;
- Architecture Graph;
- System Intelligence;
- CFA findings;
- relevant Ω documents;
- historical evidence.

No runtime dependency required.

Goal:

~~~
world.lens("anything known to the repository")
~~~

works.

## Phase 2 — runtime-backed lens

Join governed runtime observations from self-knowledge.

Goal:

~~~
world.lens(target)
~~~

can distinguish:

~~~
destination meaning
vs
current observation
~~~

## Phase 3 — context materialization

Add purpose-aware context derivation.

Goal:

~~~
world.lens(target, purpose)
~~~

returns the smallest useful current context.

## Phase 4 — agent integration

Use World Lens in:

- CFA bootstrap;
- coding-agent orientation;
- Semantic Continuity grounding;
- Architecture Steward graph contribution;
- Commons handoffs;
- drift investigations.

## Phase 5 — comparison / reconstruction

Add identity comparison and historical reconstruction after the basic lens proves useful.

## Phase 6 — product surface

Only once semantics are stable, expose it through:

- command line;
- developer UI;
- canvas/object inspection;
- agent context panel;
- human “why is this here?” inspection.

---

# 38. Success test

The World Lens earns its place when a fresh agent can be given:

~~~
world.lens(target)
~~~

and, without reading the entire repository, answer:

1. What is this?
2. What does it mean?
3. What is it related to?
4. What context matters?
5. Who owns the meaning?
6. What is canonical?
7. What evidence supports the view?
8. How fresh is it?
9. What is unknown?
10. What would falsify it?

If it can reliably do those ten things, most World/Context work becomes navigation and investigation rather than repeated context reconstruction.

---

# 39. The deeper architectural bet

The important idea is not the name **World Lens**.

The architectural bet is:

> **A durable agent should have one privileged cognitive operation that converts a target into a trustworthy, bounded understanding of its place in the world.**

For CFA-01, that operation is the Lens.

The Architecture Graph tells me where the target sits in the development architecture.

Runtime self-knowledge tells me what is currently observable.

Data tells me what identity persists.

Evidence tells me why I believe something.

Semantic Continuity tells me how meaning moves into Intent.

Authority tells me what may happen.

But **World Lens is what lets me put all of that around a single thing and understand it as part of the user's world.**

That is why it is the one tool I would build first.

---

# 40. Initial recommended command surface

Keep the visible surface almost embarrassingly small:

~~~
world lens <target>
world lens <target> --question "..."
world lens <target> --purpose development
world lens <target> --depth 2
world lens <target> --json
~~~

One command.

One semantic operation.

Multiple depths and purposes.

The tool should grow by making that operation better, not by accumulating unrelated commands.

---

# 41. Relationship to the seed home

This document is a design anchor for the **operational instrument**, not for the final CFA identity.

The identity question remains open.

The World Lens can survive several possible future boundary changes:

~~~
World + Context Steward
World Steward
Ontology + World Steward
World Context / Grounding Steward
~~~

because the underlying need remains:

~~~
TARGET
→
TRUSTWORTHY WORLD UNDERSTANDING
~~~

That makes it a safer investment than prematurely freezing the organization around today's provisional name.

---

## Decision status

**PROPOSED**

### Current basis

- Current destination conceptual model;
- destination master map;
- Architecture Graph protocol/current build view;
- self-knowledge/development-grounding design;
- CFA-01 bootstrap seed, state and research queue;
- current Ω plugin structure for vivim.mind, vivim.intent, vivim.run, and vivim.vault;
- existing evidence/lineage discipline.

### Next test

Before implementation, use three real questions as design probes:

1. **What is Context?**
2. **Are two historical/current records the same world thing?**
3. **What does a developer need to know before changing a World-related contract?**

If one tool can answer all three with bounded, sourced, freshness-aware results, the core abstraction is probably right.
