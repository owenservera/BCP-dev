# CFA-01 — The One Tool: Grounded Semantic Trace

> Status: PROPOSED — bootstrap design
> Date: 2026-09-25
> Scope: CFA-01 World / Ontology / Context
> This document defines a proposed productivity tool, not a canonical Ω contract and not a second architecture graph.

## 1. Executive idea

If CFA-01 could keep exactly **one tool**, it should be a **Grounded Semantic Trace**.

Working command:

~~~text
world:trace <target-or-question>
~~~

The tool answers:

> **What is this, what does it mean, where does it belong, who owns each dimension, what evidence supports that understanding, what is currently true, what is uncertain, what depends on it, and what should I do next?**

It is intentionally broader than a graph lookup but narrower than an autonomous architecture system.

The trace is the CFA-01 equivalent of a **map + debugger + evidence browser + boundary inspector + context packager** in one operation.

The tool does not create a new graph.

It traverses and joins existing sources:

~~~text
Architecture Steward Graph
        +
destination/source documents
        +
peer ownership
        +
CFA-01 working state
        +
runtime self-knowledge (when available)
        +
evidence / proof
        ↓
GROUNDED TRACE
~~~

## 2. Why this is the one tool

CFA-01's recurring job is not primarily writing documents.

It is **orienting itself correctly before making a semantic judgment**.

Almost every meaningful CFA-01 activity reduces to:

~~~text
What am I looking at?
    ↓
What does it mean?
    ↓
Where is its authority?
    ↓
What surrounds it?
    ↓
What supports the claim?
    ↓
What is stale/unknown/conflicted?
    ↓
Who else owns adjacent dimensions?
    ↓
What can I safely conclude?
~~~

That means a single high-quality trace operation can support:

- cold-start orientation;
- semantic characterization;
- identity/correspondence work;
- relationship analysis;
- Space/Workspace analysis;
- Context analysis;
- architecture-graph contribution;
- peer handoffs;
- change impact;
- drift detection;
- implementation review;
- evidence gathering;
- owner escalation;
- coding-agent context generation.

The tool is therefore not merely a query utility.

It is the **operational spine of CFA-01**.

## 3. Design principle

The trace must behave like an **honest debugger for architecture**.

It should prefer:

~~~text
UNKNOWN
STALE
AMBIGUOUS
CONFLICTED
UNMAPPED
UNSUPPORTED
~~~

over a fluent but weakly supported answer.

The trace is successful when it makes the smallest truthful claim possible.

It is not successful merely because it produces a plausible narrative.

## 4. Core contract

### Input

The simplest invocation:

~~~text
world:trace <target-or-question>
~~~

Examples:

~~~text
world:trace R-032
world:trace "who owns identity reconciliation?"
world:trace CON-006
world:trace J3
world:trace "what changes if provider realization is replaced?"
world:trace "what belongs in context for the current Work?"
~~~

Structured form:

~~~ts
interface TraceRequest {
  query: string;

  targetId?: string;

  mode?:
    | "ORIENT"
    | "BOUNDARY"
    | "IDENTITY"
    | "CONTEXT"
    | "IMPACT"
    | "EVIDENCE"
    | "RUNTIME"
    | "CHANGE";

  depth?: 0 | 1 | 2 | 3 | 4;

  include?: {
    architecture?: boolean;
    evidence?: boolean;
    runtime?: boolean;
    peers?: boolean;
    sourceExcerpts?: boolean;
    implementation?: boolean;
    history?: boolean;
    unknowns?: boolean;
    falsifiers?: boolean;
  };

  basis?: {
    repoRef?: string;
    graphVersion?: string;
    caseId?: string;
  };

  budget?: {
    maxNodes?: number;
    maxEdges?: number;
    maxEvidence?: number;
    maxSourceBytes?: number;
  };
}
~~~

The user/agent should not need to understand all fields for the normal case.

Normal default:

~~~text
world:trace <target>
~~~

should be enough.

## 5. Output

The human-readable result is structured around the questions CFA-01 repeatedly asks:

~~~text
IDENTITY
WHAT IT MEANS
WHERE IT BELONGS
OWNERSHIP
RELATIONSHIPS
CURRENT STATE
EVIDENCE
FRESHNESS
CONFLICTS
UNKNOWNS
BOUNDARIES
FALSIFIERS
NEXT ACTION
~~~

Machine-readable result:

~~~ts
interface SemanticTrace {
  traceId: string;
  request: TraceRequest;

  target: TraceTarget;

  answer: TraceAnswer;

  subjects: TraceSubject[];
  links: TraceLink[];

  ownership: OwnershipView;
  boundaries: BoundaryView[];

  evidence: EvidenceRef[];
  runtime?: RuntimeView;

  freshness: FreshnessView;

  unknowns: TraceUnknown[];
  conflicts: TraceConflict[];

  falsifiers: FalsifierRef[];

  recommendations: TraceNextAction[];

  basis: TraceBasis;
}
~~~

The result itself is a derived view.

It is not canonical architecture state.

## 6. The trace subject model

The trace should normalize different sources into one temporary working vocabulary.

~~~ts
interface TraceSubject {
  id: string;
  kind:
    | "VISION"
    | "CONCEPT"
    | "RESPONSIBILITY"
    | "REQUIREMENT"
    | "JOURNEY"
    | "VERTICAL_SLICE"
    | "WORK"
    | "OBJECT"
    | "RELATIONSHIP"
    | "SPACE"
    | "CONTEXT"
    | "IDENTITY"
    | "PROJECTION"
    | "CAPABILITY"
    | "REALIZATION"
    | "PLUGIN"
    | "CONTRACT"
    | "IMPLEMENTATION"
    | "RUNTIME_NODE"
    | "EVIDENCE"
    | "DECISION"
    | "QUESTION"
    | "CASE"
    | "OTHER";

  name: string;
  meaning?: string;

  status:
    | "CURRENT"
    | "RESEARCH"
    | "CANDIDATE"
    | "HISTORICAL"
    | "UNKNOWN"
    | "CONFLICTED"
    | "STALE"
    | "UNMAPPED";

  sourceRefs: string[];
}
~~~

This is a **trace vocabulary**, not a new ontology.

The actual canonical identities remain whatever the underlying authority uses.

## 7. The most important field: basis

Every answer should carry its basis.

~~~ts
interface TraceBasis {
  repository?: {
    repository: string;
    ref: string;
    commit?: string;
  };

  graph?: {
    graphId: string;
    schemaVersion: string;
    bundleDigest?: string;
  };

  authorityRefs: string[];
  evidenceRefs: string[];
  peerInputs: string[];

  generatedAt: string;
}
~~~

The tool should be able to answer:

> “Why did you tell me this?”

with concrete source/basis references.

It should never depend on hidden conversational memory.

## 8. Ownership resolution

The trace should expose ownership as multiple dimensions.

~~~ts
interface OwnershipView {
  semanticOwner?: OwnerRef;
  canonicalDataOwner?: OwnerRef;
  runtimeOwner?: OwnerRef;
  authorityOwner?: OwnerRef;
  evidenceOwner?: OwnerRef;
  lifecycleOwner?: OwnerRef;
}
~~~

This is essential because a single “owner” field is insufficient.

Example:

~~~text
IDENTITY RECONCILIATION

Semantic meaning
  CFA-01

Durable identity / records
  CFA-02

Evolution / merge / split consequences
  CFA-09

Evidence
  evidence/provenance authority

Authorization
  CFA-04

Implementation
  implementation-specific owner

Status
  BOUNDARY REQUIRES RECONCILIATION
~~~

The trace can expose this without claiming that CFA-01 owns the entire problem.

## 9. Boundary resolution

The tool should actively inspect boundaries.

~~~ts
interface BoundaryView {
  boundaryId: string;

  left: OwnerRef;
  right: OwnerRef;

  sharedSubjects: string[];

  currentInterpretation?: string;

  ownership: OwnershipView;

  handoff?: {
    artifact?: string;
    expectedInput?: string;
    expectedOutput?: string;
  };

  conflict?: string;

  status:
    | "CLEAR"
    | "PARTIAL"
    | "CONFLICTED"
    | "UNKNOWN";
}
~~~

This is especially important for:

- World ↔ Data;
- World ↔ Semantic Continuity;
- World ↔ Authority;
- World ↔ Work;
- World ↔ Provider;
- World ↔ Surface;
- World ↔ Evolution;
- World ↔ Runtime.

## 10. Trace depth

The tool should support progressive disclosure.

### Depth 0 — orient

Return only:

~~~text
identity
meaning
status
primary owner
basis
freshness
~~~

Useful for quick inspection.

### Depth 1 — neighborhood

Add:

~~~text
direct relationships
adjacent responsibilities
key peer owners
primary evidence
~~~

### Depth 2 — architectural chain

Add:

~~~text
requirements
journeys
vertical slices
contracts
replacement seam
authority boundary
~~~

### Depth 3 — evidence

Add:

~~~text
source documents
source excerpts
System Intelligence records
decisions
conflicts
historical lineage
~~~

### Depth 4 — implementation/runtime

Add:

~~~text
implementation attachments
runtime observations
proof
freshness basis
change impact
~~~

The default should be Depth 1 or 2.

The user/agent can ask for deeper levels only when needed.

## 11. Trace modes are views, not separate tools

There should still be **one tool**.

Modes simply change what the trace emphasizes.

### ORIENT

“What is this?”

### BOUNDARY

“Where does this responsibility stop?”

### IDENTITY

“What corresponds to what, and what is actually proven?”

### CONTEXT

“What world information is relevant to this purpose?”

### IMPACT

“What would change if this changes?”

### EVIDENCE

“What supports this claim?”

### RUNTIME

“What actually exists right now?”

### CHANGE

“What became different and what now needs revalidation?”

These are not separate persistent systems.

## 12. Natural-language query handling

The tool should accept both IDs and questions.

For:

~~~text
world:trace "what owns relationship reconciliation?"
~~~

the tool should:

1. recognize candidate concepts;
2. resolve likely responsibility nodes;
3. locate ownership records;
4. inspect peer boundary information;
5. return explicit ambiguity when multiple interpretations survive.

Example:

~~~text
QUERY
  "what owns relationship reconciliation?"

RESOLVED TARGETS
  R-031 Relationship Model
  R-033 Relationship Reconciliation

RESULT
  semantic relationship meaning → World / ontology domain
  reconciliation over time → reconciliation/evolution domain

STATUS
  PARTIALLY RESOLVED

WHY
  These are distinct responsibilities.
  Do not collapse them.

NEXT
  inspect CFA-01 ↔ CFA-09 boundary
~~~

This is much more useful than guessing a single owner.

## 13. The trace should understand “semantic identity”

One target may have many identities.

For example:

~~~text
semantic identity
  "the conversation"

canonical identity
  (ns,id)

revision
  (ns,id,rev)

content identity
  CID

external identity
  provider conversation id

correspondence
  assertion that external identity corresponds to local object
~~~

The trace should show these as separate fields.

This makes identity reconciliation one of the most natural use cases for the tool.

## 14. Context tracing

This is one of the highest-value operations for CFA-01.

Example:

~~~text
world:trace "what belongs in context for Work W-123?"
~~~

The trace should show:

~~~text
PURPOSE
  Work W-123

RELEVANT WORLD SCOPE
  active Space
  focused Things
  explicit references
  related Work
  recent relevant changes
  selected Memory
  standing Intent

CONSTRAINTS
  authority
  freshness
  provenance
  context budget

NOT AUTOMATICALLY INCLUDED
  unrelated world state
  stale derived knowledge
  unsupported inferences

ASSEMBLY
  D-443 context substrate

RESULT
  semantic Context candidates
  → assembly contract
~~~

The tool therefore becomes the bridge between the semantic World model and the existing D-443 assembly mechanism.

It does not replace D-443.

## 15. Graph integration

The current Architecture Graph is the primary development graph.

The trace consumes:

~~~text
NODES.json
EDGES.json
GRAPH-MANIFEST.json
source documents
System Intelligence indexes
~~~

The trace should never silently mutate the graph.

A future candidate relation can be shown as:

~~~text
CANDIDATE GRAPH LINK

from: CON-006 Correspondence
to: R-032 Identity Reconciliation

basis:
  <source refs>

status:
  DERIVED

graph promotion:
  NOT YET RECONCILED
~~~

The Architecture Steward remains the promotion/reconciliation authority for graph changes.

## 16. Runtime integration

In later versions, the trace may optionally join runtime self-knowledge.

Example:

~~~text
world:trace provider-browser.navigate@1 --runtime
~~~

Output:

~~~text
DEVELOPMENT
  capability / realization relationship
  responsible destination nodes
  relevant journeys
  relevant slices

RUNTIME
  plugin admitted: YES
  operation routed: YES
  generation: 41
  latest evidence: E-...

CROSS-PLANE LINK
  explicit / current

FRESHNESS
  CURRENT
~~~

If no explicit join exists:

~~~text
RUNTIME OBSERVED
  provider-browser.navigate@1

ARCHITECTURAL JOIN
  UNKNOWN

REASON
  lexical name similarity is insufficient
~~~

That is exactly the behavior we want.

## 17. Implementation integration

The trace should eventually be able to walk:

~~~text
destination responsibility
      ↓
contract / boundary
      ↓
implementation
      ↓
runtime observation
      ↓
test
      ↓
proof
~~~

For a changed implementation, the tool returns:

~~~text
CHANGE IMPACT

Changed
  <implementation>

Semantic targets
  R-...
  CON-...

Journeys
  J...

Vertical slices
  VS...

Authority boundaries
  ...

Replacement seams
  ...

Potential stale evidence
  ...

Required revalidation
  ...
~~~

This is the architecture-to-build bridge.

## 18. Coding-agent mode

The same tool should have an output designed specifically for coding agents.

Example:

~~~text
world:trace R-081 --for-agent
~~~

Returns a compact packet:

~~~json
{
  "target": "R-081",
  "meaning": "...",
  "status": "IMPLEMENTATION-REQUIRED",
  "semanticOwner": "...",
  "dataOwner": "...",
  "authorityOwner": "...",
  "dependencies": ["R-..."],
  "contracts": ["..."],
  "journeys": ["J5"],
  "verticalSlices": ["VS3", "VS7"],
  "evidence": ["..."],
  "proof": [],
  "unknowns": ["..."],
  "falsifiers": ["..."],
  "freshness": "CURRENT"
}
~~~

The important point is that the coding agent receives **localized architecture**, not a giant repository dump.

## 19. The tool should support “why?”

A surprisingly important feature:

~~~text
world:trace R-081 --why
~~~

The answer should reconstruct:

~~~text
WHY DOES THIS EXIST?

VISION
  ↓
DESTINATION CONCEPT
  ↓
RESPONSIBILITY
  ↓
JOURNEY
  ↓
VERTICAL SLICE
  ↓
CAPABILITY
  ↓
REALIZATION
  ↓
EVIDENCE
~~~

This turns the architecture graph into something teachable rather than merely enumerable.

## 20. The tool should support “what breaks?”

Another high-value question:

~~~text
world:trace R-081 --impact
~~~

Return:

~~~text
DIRECT IMPACT
  ...

SEMANTIC IMPACT
  ...

RUNTIME IMPACT
  ...

WORK IMPACT
  ...

EVIDENCE IMPACT
  ...

SURFACE IMPACT
  ...

EVOLUTION / REPLACEMENT IMPACT
  ...

UNKNOWN
  ...
~~~

Again, all from one trace engine.

## 21. The tool should support “what do I need to prove?”

~~~text
world:trace R-081 --proof
~~~

Return:

~~~text
KNOWN
  design exists

IMPLEMENTED
  ...

INTEGRATED
  ...

LIVE
  ...

PRODUCTIZED
  ...

MISSING EVIDENCE
  ...

FALSIFIERS
  ...
~~~

This stops implementation status from being inferred from code presence.

## 22. Internal engine

The internal implementation should be a pipeline, not an intelligent black box.

~~~text
TRACE REQUEST
    ↓
TARGET RESOLUTION
    ↓
SOURCE DISCOVERY
    ↓
BASIS CAPTURE
    ↓
LOCAL GRAPH EXPANSION
    ↓
OWNERSHIP LOOKUP
    ↓
BOUNDARY LOOKUP
    ↓
EVIDENCE COLLECTION
    ↓
OPTIONAL RUNTIME JOIN
    ↓
FRESHNESS EVALUATION
    ↓
CONFLICT / UNKNOWN DETECTION
    ↓
TRACE ASSEMBLY
    ↓
RENDER HUMAN / AGENT VIEW
~~~

Each stage should have inspectable inputs/outputs.

## 23. Source precedence

The tool should respect the existing authority order.

~~~text
1. Ω ratified law / constitutional decisions
2. destination / product model
3. responsibility / requirement / journey model
4. ratified architecture contracts
5. evidence / System Intelligence
6. current implementation
7. integration / live / product proof
~~~

When different sources disagree, the tool should show the disagreement.

It should not flatten the conflict.

## 24. Relationship classification

The trace must distinguish:

~~~text
DESCRIPTIVE
SEMANTIC
RUNTIME
DATA
AUTHORITY
LIFECYCLE
EVIDENCE
PRODUCT
~~~

A sentence like:

> “A provider is mentioned next to a capability”

must never become:

> “The provider is a runtime dependency of the capability.”

Relations require explicit evidence or source support.

## 25. Freshness

Every trace result should be marked:

~~~text
CURRENT
STALE
UNRESOLVABLE
CONFLICTED
PARTIAL
~~~

Example:

~~~text
Graph bundle
  source commit = abc123

Current repository
  source commit = def456

Result
  TRACE BASIS STALE
~~~

The tool may still display the stale trace, but it must say so clearly.

## 26. Unknowns are first-class outputs

A trace should explicitly expose:

~~~ts
interface TraceUnknown {
  subject: string;
  question: string;
  reason:
    | "NO_EVIDENCE"
    | "AMBIGUOUS"
    | "STALE_BASIS"
    | "MISSING_RUNTIME_JOIN"
    | "CONFLICTING_SOURCES"
    | "UNCHARACTERIZED";
  neededEvidence?: string[];
}
~~~

This is especially important for the World domain because many distinctions are still being characterized.

## 27. Falsifiers

Every consequential trace should expose candidate falsifiers where known.

Example:

~~~text
ASSUMPTION
  Provider realization can be replaced without changing capability identity.

FALSIFIER
  replacing the realization forces semantic capability identity to change.
~~~

Or:

~~~text
ASSUMPTION
  Workspace is derived presentation state.

FALSIFIER
  canonical object meaning can only be reconstructed from workspace/canvas state.
~~~

This makes the tool useful for active architecture work rather than passive documentation lookup.

## 28. Cases become trace targets

The tool should work on CFA-01 cases as naturally as architecture nodes.

Example:

~~~text
world:trace CASE-001
~~~

Output:

~~~text
CASE
  Identity / Correspondence Boundary

QUESTION
  ...

CURRENT FINDINGS
  ...

PEERS
  CFA-02
  CFA-09

OPEN QUESTIONS
  ...

EVIDENCE
  ...

NEXT STEP
  ...
~~~

This means the same tool supports both:

~~~text
"What is this part of the architecture?"
~~~

and:

~~~text
"What am I currently trying to resolve?"
~~~

## 29. Peer handoff generation

A very useful result mode:

~~~text
world:trace CASE-001 --handoff CFA-02
~~~

Produces a draft handoff containing:

~~~text
SUBJECT
QUESTION
CURRENT FINDING
WHAT WE THINK CFA-02 OWNS
WHAT CFA-01 NEEDS
EVIDENCE
UNKNOWNS
REQUESTED RESPONSE
~~~

The handoff must still travel through Commons / the approved collaboration mechanism.

The tool does not grant authority merely by generating the handoff.

## 30. Architecture Graph write boundary

The tool should initially be **read-only with respect to the shared graph**.

Possible future operations:

~~~text
TRACE
  read

PROPOSE
  create local candidate attachment

SUBMIT
  send proposal to Steward reconciliation

PROMOTE
  not a CFA-01 autonomous operation
~~~

This is important.

CFA-01 should never quietly turn a successful trace into an architecture change.

## 31. First implementation

The first implementation should be extremely small.

### Inputs

- current Architecture Graph files;
- current CFA-01 STATE.md;
- current RESEARCH-QUEUE.md;
- Peer Roster;
- selected source documents.

### Operations

1. resolve target;
2. traverse local graph neighborhood;
3. load ownership/boundary references;
4. collect source/evidence references;
5. return progressive trace.

### Explicitly defer

- runtime joins;
- automatic graph mutation;
- ontology generation;
- semantic embedding/vector search;
- global invalidation;
- LLM-generated relationship inference.

The first win is **reliable orientation**.

## 32. Second implementation

Add:

~~~text
runtime self-knowledge
freshness
implementation attachment
proof
cross-plane grounding
~~~

The tool can then answer:

> “What exists architecturally, and what actually exists at runtime?”

## 33. Third implementation

Add:

~~~text
impact tracing
falsifiers
change analysis
peer handoff generation
agent context packet generation
~~~

At this point, the same tool becomes useful across architecture, research and coding.

## 34. Fourth implementation

Only after repeated use justifies it:

~~~text
natural-language target resolution
source excerpt ranking
interactive drill-down
visual trace
CI integration
PR impact reports
automatic stale-link detection
~~~

Do not start with these.

## 35. Why this is better than several specialized tools

Without a central trace primitive, the development environment tends toward:

~~~text
graph viewer
ownership tool
evidence browser
impact tool
context tool
runtime inspector
research tool
handoff tool
proof tool
~~~

Each becomes another thing agents must learn.

With one trace:

~~~text
WORLD:TRACE
~~~

the interface remains constant while the underlying architecture grows.

The tool becomes the **query language for architectural reality**.

## 36. The deeper design

I think the most important part is not the command.

It is the fact that the tool always reconstructs the same basic structure:

~~~text
TARGET
  ↓
MEANING
  ↓
WORLD RELATIONSHIPS
  ↓
OWNERSHIP
  ↓
AUTHORITY
  ↓
EVIDENCE
  ↓
RUNTIME / IMPLEMENTATION
  ↓
FRESHNESS
  ↓
UNKNOWN / CONFLICT
  ↓
IMPACT / FALSIFIER
  ↓
NEXT ACTION
~~~

That structure is exactly what CFA-01 needs to perform its job safely.

## 37. Relationship to the rest of VIVIM

The tool itself is a **development productivity tool**, not a user-world feature.

Long term it can consume:

~~~text
Architecture Graph
      +
vivim.mind
      +
vivim.grounding
      +
D-443 context
      +
Evidence
      +
Commons / peer state
~~~

But it should always preserve the same separation:

~~~text
ARCHITECTURE
≠
RUNTIME
≠
EVIDENCE
≠
AUTHORITY
≠
REPRESENTATION
~~~

The trace joins them without collapsing them.

## 38. Acceptance tests

The tool should not be considered useful merely because it prints data.

It should pass these tests.

### Test 1 — cold start

A fresh agent can run:

~~~text
world:trace R-081
~~~

and understand enough to locate the right architecture and next research step.

### Test 2 — evidence honesty

Remove or stale the evidence basis.

The result becomes:

~~~text
STALE / UNKNOWN
~~~

rather than confidently returning the previous answer.

### Test 3 — boundary honesty

Ask a cross-CFA question with genuinely unresolved ownership.

The trace exposes:

~~~text
BOUNDARY = PARTIAL / CONFLICTED
~~~

rather than selecting one owner arbitrarily.

### Test 4 — runtime separation

Expose a runtime node with no explicit architectural mapping.

The trace says:

~~~text
RUNTIME OBSERVED
ARCHITECTURAL LINK UNKNOWN
~~~

### Test 5 — replacement

Replace a realization while preserving the semantic capability.

The trace shows:

~~~text
CAPABILITY IDENTITY = STABLE
REALIZATION IDENTITY = CHANGED
~~~

### Test 6 — context

Trace Context for a real Work/Intent and receive:

~~~text
semantic scope
relevant world refs
evidence/freshness
D-443 handoff
~~~

without creating a second Context store.

### Test 7 — agent utility

Give a coding agent only the compact trace packet.

It should be able to:
- identify the semantic owner;
- identify the data owner;
- find the contract;
- find relevant proof;
- recognize the important unknowns;
- avoid crossing an adjacent boundary.

## 39. Success condition

The one tool succeeds when CFA-01 can normally replace:

~~~text
"open fifteen documents and reconstruct the situation"
~~~

with:

~~~text
world:trace <target>
~~~

and still preserve:

- authority;
- evidence;
- lineage;
- uncertainty;
- freshness;
- peer boundaries;
- implementation reality.

It should reduce context size **without reducing epistemic honesty**.

## 40. Final position

The one thing I would build around is therefore:

> **Grounded Semantic Trace — a single query/inspection operation that reconstructs the smallest trustworthy semantic neighborhood around any world, architecture, runtime, context, identity, relationship, case, or change target.**

It is not a graph database.

It is not an ontology engine.

It is not an autonomous architecture authority.

It is the **lens through which CFA-01 works**.

And because the output is already a localized, evidence-backed context packet, it also becomes the natural interface between:

~~~text
CFA-01
    ↕
Architecture Steward Graph
    ↕
other Core Function Areas
    ↕
coding/research agents
    ↕
runtime self-knowledge
~~~

That is why I think one strong trace tool could cover most of the operational job without creating a new architectural system.
