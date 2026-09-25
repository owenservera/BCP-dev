
# VIVIM — Self-Knowledge & Development Grounding System

> Classification: DERIVED — ARCHITECTURE STEWARD DESIGN
> Status: DESIGN CANDIDATE / IMPLEMENTATION-READY IN PHASES
> Date: 2026-09-25
> Authority: existing Ω law, contracts, destination model and Architecture Steward graph remain authoritative within their scopes.
> Purpose: define a trustworthy runtime self-knowledge and development-grounding system that lets humans and coding agents move from runtime reality to architectural meaning, evidence, decisions and proof without creating a second architecture authority.

---

## 1. Executive decision

The proposal for a two-tier self-knowledge system is adopted in refined form.

The useful architectural idea is:

RUNTIME SELF-KNOWLEDGE
        +
DEVELOPMENT / ARCHITECTURAL GROUNDING

The following change is mandatory:

There is no K0-Graph architectural subsystem.

K0 remains narrow and constitutional. Runtime self-knowledge is a derived observation/view capability, primarily realized through vivim.mind and existing governed runtime seams. Development grounding is a normal first-party/system plugin and development tool surface.

The durable architecture is:

                CANONICAL DEVELOPMENT KNOWLEDGE
                           |
                           v
             Architecture Steward Graph
             documentation-first / derived
                           |
                graph bundle / query view
                           |
                           v
                    vivim.grounding
                           |
                 +---------+---------+
                 |                   |
                 v                   v
        runtime self-model     architecture graph
           from vivim.mind          bundle
                 |                   |
                 +---------+---------+
                           |
                           v
                    grounded trace
                           |
                           v
                human / agent context

The system therefore has one development architecture graph, one runtime self-knowledge view family, and one explicit join layer.

It does not create:
- a second ontology;
- a second architecture graph;
- a second authority model;
- a project-management system;
- a privileged developer-only runtime path.

---

## 2. Problem statement

During development, VIVIM already has the ingredients to answer important questions, but they are distributed across different representations:

- destination documents describe what the system is meant to become;
- the Architecture Steward graph connects vision, responsibilities, journeys, requirements, evidence and composition;
- System Intelligence records observed implementation/research evidence;
- Ω runtime knows what is actually registered, admitted, routed, executing and persisted;
- vivim.mind derives self-knowledge from evidence;
- tests and live runs create new proof;
- coding agents still need to reconstruct the relationship between those layers.

The desired development experience is not:

open many documents
→ search
→ infer
→ inspect code
→ guess

It is:

target something
→ obtain a localized trace
→ see runtime reality
→ see architectural intent
→ see ownership / authority
→ see evidence
→ see current status
→ see unknowns / falsifiers
→ make the smallest safe change

---

## 3. Design principles

### 3.1 One graph, many views

The Architecture Steward graph remains the single documentation-first development architecture network.

A runtime self-knowledge projection must not become a second architecture graph.

### 3.2 Runtime facts are not architecture authority

Runtime observation can establish facts such as:

- plugin X is admitted;
- operation Y is routable;
- compartment Z is active;
- Work W exists;
- Evidence E was produced;
- a derived view is stale.

It cannot decide:

- why a destination responsibility exists;
- whether a product choice is desirable;
- whether a proposal is authoritative;
- whether a source document should be rewritten.

### 3.3 Architecture knowledge is not runtime authority

The Architecture Steward graph can say:

- R-058 is required by J3;
- R-058 belongs to K1 + system plugin;
- its status is DESIGN-REQUIRED;
- its replacement seam is the grounding contract.

That does not grant runtime permission.

### 3.4 Evidence does not become authority

Evidence can support or contradict a claim.

Evidence does not automatically:
- authorize an action;
- upgrade a requirement to PROVEN;
- replace ratified law;
- rewrite canonical meaning.

### 3.5 Candidate is not realization

A proposed design path, graph edge, capability candidate or generated bundle remains a candidate until the relevant evidence exists.

### 3.6 Unknown is a valid answer

Grounding must return:

- UNKNOWN;
- STALE;
- AMBIGUOUS;
- CONTRADICTORY;
- UNSUPPORTED

when the source state cannot support a stronger answer.

### 3.7 Freshness is first-class

Every derived runtime view and graph bundle has an explicit basis.

A view is CURRENT only when its required source basis resolves and matches.

### 3.8 K0 stays narrow

Being useful to every part of VIVIM does not make a mechanism K0.

K0 should only grow when a concrete, non-bypassable, domain-neutral constitutional requirement proves it must.

---

## 4. System boundaries

### K0 — constitutional runtime

K0 contains only the minimum generic mechanisms required for:

- admission/integrity;
- isolation/transport;
- capability egress enforcement;
- generation/revocation fencing;
- activation/recovery;
- canonical/cryptographic primitives;
- other proven non-bypassable runtime invariants.

K0 does not own:
- development documentation;
- journeys;
- requirements;
- architectural decisions;
- GitHub semantics;
- destination responsibilities;
- product planning;
- a persistent architecture graph.

### K1 — shared interoperability vocabulary

K1 may define stable wire contracts used by self-knowledge/grounding surfaces, such as:

- reference identity;
- graph node/edge references;
- snapshot envelope;
- freshness envelope;
- trace request/response shapes;
- provenance/reference shapes.

K1 is vocabulary, not semantic ownership.

### vivim.mind — runtime self-knowledge lens

vivim.mind remains a system plugin.

It derives self-knowledge from governed runtime evidence and state.

It should expose facts about:
- admitted plugins;
- declared capabilities;
- contracts and ops;
- routes;
- runtime compartments;
- vault namespace observations;
- active/persisted Work;
- execution Evidence;
- applicable policy/law observations;
- derived-view freshness.

It must remain:
- read-oriented;
- evidence-derived;
- deterministic where its sources are deterministic;
- incapable of granting authority;
- incapable of mutating law merely by describing it.

### vivim.grounding — development grounding bridge

vivim.grounding is a normal isolated first-party/system plugin and development tool surface.

Its job is to join:

runtime self-knowledge
+
Architecture Steward graph
+
evidence
+
source lineage

and return a localized, attributed trace.

It is not the owner of the architecture graph.

### Architecture Steward — development architecture boundary

The Steward owns:

- graph structure;
- graph schemas;
- documentation mapping;
- graph regeneration;
- lineage;
- reconciliation;
- graph views;
- drift/repair of the development knowledge representation.

The Steward does not grant runtime authority.

---

## 5. Canonical data flow

Canonical destination documents
        |
        +-- North Star
        +-- Destination Master Map
        +-- Responsibility Matrix
        +-- Requirement Traceability
        +-- Journey Architecture Mapping
        +-- Vertical Slice Registry
        +-- Dependency / Keystone Scorecard
        +-- System Intelligence indexes
                 |
                 v
      Architecture Steward Graph
      NODES.json / EDGES.json
                 |
                 +-- derived views
                 +-- grounded graph bundle
                           |
                           v
                     vivim.grounding
                           |
          +----------------+----------------+
          v                                 v
   graph bundle query             runtime self-knowledge
                                           |
                                           v
                                      vivim.mind
          +----------------+----------------+
                           |
                           v
                     Grounded Trace
                           |
                           v
                    developer / agent

The graph bundle is a versioned snapshot of the derived Steward graph, not a new source of truth.

---

## 6. Two knowledge planes

### 6.1 Runtime plane

The runtime plane answers:

What is true about the currently executing environment?

Examples:

Plugin
Capability
Contract
Op
Route
Compartment
Vault namespace
Work
Evidence
Policy observation
Generation
Freshness

These are observed or derived runtime facts.

### 6.2 Development plane

The development plane answers:

Why does this thing exist, where does it belong, what destination obligation does it serve, and what evidence currently supports the relationship?

The existing Steward graph contains:

DOCUMENT
VISION
DESTINATION CONCEPT
RESPONSIBILITY
REQUIREMENT
JOURNEY
VERTICAL SLICE
KEYSTONE
SYSTEM INTELLIGENCE ATOM
EVIDENCE
REFERENCE PIECE
COMPOSITION
WORKSTREAM

Additional concepts such as DECISION, HYPOTHESIS, SPECIFICATION, IMPLEMENTATION, PROOF and CHANGE should be linked only where they are already canonical elsewhere or explicitly introduced through Steward reconciliation.

### 6.3 Grounding seam

The grounding seam joins identities across the planes.

Example:

runtime:
k0:cap:provider-browser.navigate@1

development:
R-081 Provider realization
J5 Provider choice
VS-3 provider/account execution
SI-050103 Capability ↔ Realization

The join must be explicit and attributable.

It must never be inferred solely from matching names, file paths, lexical similarity, plugin ownership or proximity.

---

## 7. Runtime self-knowledge model

### 7.1 Native runtime node families

The runtime model may expose:

| Kind | Example | Primary basis |
|---|---|---|
| plugin | plugin:vivim.vault | signed Recipe / Manifest |
| capability | cap:vault.append | manifest + admitted grant |
| contract | contract:vault.append@1 | contract registry |
| op | op:vault.append@1 | routed contribution |
| route | route:vault.append@1 | active routing observation |
| compartment | compartment:vivim-vault | runtime |
| vault namespace | vault_ns:evidence | vault/runtime |
| work | work:<id> | Work namespace |
| evidence | evidence:<cid> | evidence namespace |
| policy observation | policy:<id> | law observation / token metadata |

The node model must preserve basis metadata.

### 7.2 Runtime edge families

Useful runtime relations include:

EXPOSES
OFFERS_OP
BOUND_TO_CONTRACT
ROUTES_TO
ISOLATED_IN
PERSISTS_IN
EXECUTES_WORK
PRODUCES_EVIDENCE
GOVERNS
DEPENDS_ON

The edge set should grow only where a relation corresponds to an observable, stable runtime fact.

### 7.3 Runtime identity

Runtime IDs should be stable within their governed identity domain.

Do not use unstable memory addresses as canonical identity.

The k0: prefix, when used, indicates origin/namespace. It does not prove that every represented fact is a K0 responsibility.

---

## 8. Freshness and basis model

The existing self-knowledge design already establishes the right basic model:

DerivedView
  viewId
  kind
  result
  basisRefs[]
  basisDigest
  dependencyVersions[]
  computedAt
  freshness
  conflicts[]
  derivationRef

Freshness:
CURRENT
STALE
UNRESOLVABLE
CONFLICTED

### 8.1 Basis digest

A first implementation may use:

BasisDigest =
SHA256(canonical serialization of basis references + source revisions/digests + generation values)

The exact serialization must be canonical before becoming a contract.

Do not depend on delimiter concatenation without canonical encoding.

### 8.2 Basis categories

| Basis | Examples |
|---|---|
| composition | Recipe hash |
| plugin | manifest/content digest |
| runtime | route generation, compartment generation |
| authority | law generation / grant revision |
| durable state | vault namespace revision |
| external observation | provider/resource observation TTL |
| development graph | graph schema + graph bundle digest |
| source document | source commit/path digest |

### 8.3 Freshness semantics

CURRENT means all required basis refs resolve and match.

STALE means at least one required basis changed.

UNRESOLVABLE means the required basis cannot currently be obtained.

CONFLICTED means the required inputs disagree in a way that prevents a truthful derived result.

A stale or unresolved view must never silently appear as current.

### 8.4 No mandatory global invalidation bus

The first implementation uses:

derive
→ store basis
→ compare on read
→ mark stale or recompute

before introducing a global invalidation/event architecture.

---

## 9. Development graph bundle

The Architecture Steward graph is the development network consumed by grounding.

Current validated branch state at the time of this design:

- 394 nodes;
- 1,219 edges;
- 125 responsibilities;
- 8 journeys;
- 9 vertical slices;
- 13 requirements;
- 10 keystone projections;
- 44 System Intelligence atoms;
- 129 evidence nodes;
- 7 reference pieces;
- 1 first composition;
- 0 invalid endpoints;
- 0 edges without lineage.

The bundle should include:

- schema version;
- graph version;
- source repository/ref/commit;
- source document manifest;
- generation timestamp;
- graph digest;
- validation result;
- nodes;
- edges.

Suggested envelope:

interface GroundingBundle {
  schemaVersion: string;
  graphVersion: string;
  repository: string;
  sourceRef: string;
  sourceCommit: string;
  generatedAt: number;
  basisDigest: string;
  validation: {
    invalidEdges: number;
    duplicateNodeIds: number;
    duplicateEdgeIds: number;
    edgesWithoutSourceRefs: number;
  };
  nodes: GroundingNode[];
  edges: GroundingEdge[];
}

This bundle is cacheable and replaceable.

It is never the architectural authority merely because it is mounted into a runtime composition.

---

## 10. Grounding contracts

The first contract set should be small.

### self.knowledge.snapshot@1

Returns a bounded runtime self-knowledge snapshot.

Input:

{
  kinds?: string[];
}

Output:

Outcome<{
  snapshot: RuntimeKnowledgeSnapshot;
}>

### self.knowledge.query@1

Traverses runtime knowledge only.

{
  origin: string;
  edgeKinds?: string[];
  maxDepth?: number;
}

### self.knowledge.inspect@1

Returns one runtime node plus incident edges.

### self.knowledge.freshness@1

Returns:

{
  status: "CURRENT" | "STALE" | "UNRESOLVABLE" | "CONFLICTED";
  basisDigest: string;
  generation: number;
}

### grounding.trace@1

This is the primary developer operation.

Input:

{
  targetId: string;
  depth?: number;
  includeRuntime?: boolean;
  includeEvidence?: boolean;
  includeStale?: boolean;
}

Output:

Outcome<{
  target: GroundingTarget;
  runtime: RuntimeTrace;
  development: DevelopmentTrace;
  links: GroundingLink[];
  evidence: EvidenceTrace[];
  freshness: FreshnessReport;
  unknowns: GroundingUnknown[];
  conflicts: GroundingConflict[];
  falsifiers: FalsifierRef[];
}>

### grounding.diff@1

Reports mismatches between intended/developed and observed/runtime state.

It should distinguish:
- orphan runtime;
- unimplemented responsibility;
- stale evidence;
- missing linkage;
- contradicted assumption.

---

## 11. Grounding link model

A cross-plane link should be explicit.

interface GroundingLink {
  id: string;
  sourceId: string;
  targetId: string;
  kind:
    "REALIZES" |
    "IMPLEMENTS" |
    "TARGETS" |
    "SUPPORTS" |
    "EVIDENCES" |
    "FALSIFIES" |
    "PROVES" |
    "GOVERNED_BY";
  basisRefs: string[];
  evidenceRefs: string[];
  status:
    "CURRENT" |
    "STALE" |
    "CANDIDATE" |
    "CONTRADICTED";
  rationale?: string;
}

Important distinction:

architecture graph edge
≠
runtime observation
≠
grounding link

A grounding link is a join assertion whose own provenance must be inspectable.

---

## 12. Developer trace semantics

A trace should progressively answer:

### Identity
What is this?

### Architectural purpose
Why does it exist?

### Ownership
Who owns its meaning/data?

### Boundary
Core, K1, system plugin, extension or tooling?

### Dependencies
What must already exist?

### Realization
How is the capability actually exercised?

### Authority
What governs the consequential effect?

### Evidence
What supports the claim?

### Proof
What evidence establishes implementation/integration/live status?

### Replaceability
What can change without changing canonical identity?

### Freshness
How current is this answer?

### Unknowns
What remains unresolved?

### Falsification
What observation would prove the assumption wrong?

The trace must not answer unsupported questions with confident prose.

---

## 13. Example: cold-start coding-agent orientation

A fresh coding agent is assigned R-058.

A grounded trace should return approximately:

TARGET
  R-058 Language grounding

BOUNDARY
  K1 + system plugin

SEMANTIC OWNER
  nlcl + world

CANONICAL DATA OWNER
  world references

STATUS
  DESIGN-REQUIRED

REPLACEMENT SEAM
  grounding contract

JOURNEYS
  J2, J3, J8

RELATED CONCEPTS
  Intent
  Context
  Address

CURRENT RUNTIME
  actual observed contracts/capabilities, if present

CURRENT PROOF
  implementation or proof evidence, if present

UNKNOWN
  explicit unknowns where evidence does not support a stronger claim

FALSIFIER
  for example, creation of a parallel semantic command path

The agent does not need to infer this from the entire repository.

---

## 14. Example: “why does this operation exist?”

Target:

k0:op:provider-browser.navigate@1

The trace should attempt:

runtime operation
  ↓
contract
  ↓
capability
  ↓
plugin / realization
  ↓
grounding link
  ↓
responsibility
  ↓
journey
  ↓
vertical slice
  ↓
evidence
  ↓
current proof status

A useful trace might show:

Runtime:
  provider-browser.navigate@1 is currently routed

Architectural meaning:
  provider-browser realizes external browser interaction

Destination relationship:
  contributes to provider/account/realization and universal interaction responsibilities

Journeys:
  J3 / J5 / J7

Slices:
  VS3 / VS7

Evidence:
  explicit System Intelligence evidence references

Current limitation:
  live owner-side provider proof remains pending

Replacement seam:
  ProviderRealization contract

The trace is useful because it joins facts; it does not invent the joins.

---

## 15. Example: before changing routing

Developer asks:

graph:trace R-082

Expected result:

R-082 Routing / selection

Journeys:
  J5, J8, ...

Adjacent responsibilities:
  R-076 Provider
  R-077 Account
  R-078 Session
  R-081 Realization
  R-083 Constraints

Evidence:
  SI-050108 Provider ↔ Routing
  related runtime evidence

Current gap:
  durable destination routing policy remains incomplete

Replacement seam:
  routing policy / selection contract

Relevant slices:
  VS3
  VS7
  VS8

Authority:
  law and routing constraints remain separate

This provides the architecture context before code is touched.

---

## 16. Example: pre-PR architecture impact

Before opening a PR:

bun run graph:ground --target <changed-node>

The command should:

1. identify touched implementation nodes;
2. resolve their known contracts/operations;
3. map them to responsibilities and journeys;
4. collect relevant authority boundaries;
5. collect evidence and proof records;
6. detect stale graph/runtime basis;
7. identify unowned dependencies;
8. identify changed replacement seams;
9. identify downstream slices affected.

Output:

CHANGE IMPACT

Changed:
  ProviderRealization

Touches:
  R-081
  R-082
  R-083

Journeys:
  J5 / J7

Slices:
  VS3 / VS7 / VS8

Authority:
  law + routing constraints remain separate

Evidence:
  prior proof is CODE; live proof unavailable

Potential falsifier:
  routing policy becomes mandatory authority path

Freshness:
  CURRENT

The purpose is not automatic PR rejection.

The purpose is to make architectural impact explicit.

---

## 17. Example: runtime drift

Suppose a contract changes:

provider.browser.navigate@1
→ provider.browser.navigate@2

Grounding should detect:

runtime:
  new contract/version observed

development graph:
  old relation still points to @1

result:
  STALE / BROKEN LINK

The system should surface:

Architecture link requires reconciliation.
No automatic authority promotion performed.

Potentially affected:
  J3
  J5
  J7
  VS3
  VS7

This is a drift signal, not an automatic architecture rewrite.

---

## 18. Example: orphan runtime

Suppose a new runtime capability appears with:
- manifest;
- route;
- compartment;
- tests;

but no recognized architectural grounding.

Return:

RUNTIME PRESENT
ARCHITECTURAL GROUNDING UNKNOWN

Observed:
  plugin
  capability
  contract
  route
  compartment
  test evidence

Not found:
  destination responsibility
  journey linkage
  architectural owner
  replacement seam

Classification:
  ORPHANED RUNTIME NODE

The Steward can then classify it as:
- legitimate internal mechanism;
- missing mapping;
- extension;
- prototype;
- architectural drift.

---

## 19. Example: requirement without realization

A destination responsibility such as R-077 may be present while no current runtime realization supports the intended destination behavior.

Return:

DEVELOPMENT REQUIREMENT PRESENT
RUNTIME REALIZATION NOT ESTABLISHED

Status:
  unimplemented / under-modelled / proof-pending

This prevents graph presence from masquerading as implementation maturity.

---

## 20. Example: stale self-knowledge

Suppose a derived view says:

ProviderRealization X = healthy

but the route generation changed after that view was derived.

Return:

STALE
basis mismatch:
  route generation current = 41
  derived view generation = 40

The system must not silently return “healthy”.

It should return:

HEALTH STATUS UNKNOWN — DERIVED VIEW STALE

A recomputation may then produce a new view.

---

## 21. Normal developer workflow

The intended loop is:

1. ORIENT
   grounding.trace(target)

2. UNDERSTAND
   inspect local graph + runtime neighborhood

3. PLAN
   identify responsibility, contract, owner, authority and falsifier

4. CHANGE
   implement the smallest supported change

5. OBSERVE
   run tests / runtime / integration

6. PROVE
   attach resulting evidence

7. RE-GROUND
   trace changed target again

8. RECONCILE
   update Steward graph only where evidence/source truth requires it

9. VERIFY
   run architecture/drift falsifiers

10. RECORD
   record material architecture changes

Closed loop:

INTENT
→ DESIGN
→ IMPLEMENTATION
→ RUNTIME OBSERVATION
→ EVIDENCE
→ GROUNDING
→ RECONCILIATION

---

## 22. Coding-agent workflow

A coding agent should receive a compact grounding packet rather than a giant context dump.

Minimum packet:

Target
Destination responsibility
Relevant journey(s)
Relevant vertical slice(s)
Required contracts
Semantic owner
Canonical data owner
Authority boundary
Replacement seam
Current implementation/proof
Evidence refs
Unknowns
Falsifiers
Freshness

### Progressive disclosure

Level 0:
identity + current status

Level 1:
immediate neighborhood

Level 2:
journey / responsibility / contract chain

Level 3:
evidence + source excerpts + decisions

Level 4:
implementation attachment + proof history

This keeps default agent context small while preserving access to depth.

---

## 23. Implementation phases

### Phase 0 — design lock

Deliver:
- this design;
- graph/schema alignment;
- identity conventions;
- grounding link rules;
- freshness semantics;
- query contracts;
- falsifier definitions.

Exit criterion:

No unresolved architectural question requires moving logic into K0.

### Phase 1 — runtime self-knowledge read model

Extend vivim.mind only where existing runtime seams can supply stable observations.

Implement:
- runtime node projections;
- runtime edge projections;
- bounded snapshot;
- inspect/query;
- freshness.

Do not build a persistent universal graph store yet.

Exit criterion:

A fresh runtime snapshot can explain what is admitted, routed, persisted and executing without granting authority.

### Phase 2 — grounding bundle generation

Build Steward tooling that emits a versioned graph bundle from:

canonical destination docs
+ System Intelligence
+ validated research
→ graph bundle

The current Steward graph remains the source.

Exit criterion:

same source inputs
→ deterministic bundle
→ validation report

### Phase 3 — vivim.grounding MVP

Implement:
- graph bundle reader;
- runtime self-knowledge reader;
- explicit cross-plane link table;
- grounding.trace@1;
- freshness reporting.

Do not implement automatic architectural mutation.

Exit criterion:

A fresh coding agent can answer a trace question without broad manual repository reconstruction.

### Phase 4 — developer CLI

Provide:

bun run graph:trace <id>
bun run graph:inspect <id>
bun run graph:diff
bun run graph:freshness
bun run graph:impact <id>
bun run graph:orphaned

Support JSON output for agents and CI.

Exit criterion:

A developer can perform orientation, impact analysis and drift detection locally.

### Phase 5 — falsification and drift

Implement:
- freshness falsifier;
- referential-integrity falsifier;
- orphan-runtime detector;
- orphan-destination detector;
- authority-separation falsifier;
- replacement falsifier;
- provenance falsifier.

Exit criterion:

False confidence becomes harder to produce than an explicit UNKNOWN.

### Phase 6 — implementation and proof attachment

When implementation is stable enough, attach:

implementation
→ contract
→ responsibility
→ journey
→ slice
→ evidence
→ proof

Implementation is an evidence-bearing layer, not the destination authority.

Exit criterion:

the graph can explain both what architecture demands and what code actually realizes.

### Phase 7 — agent integration

Integrate traces into:
- coding-agent launch context;
- PR checks;
- change-impact tooling;
- repository drift sweeps;
- Steward/subagent handoffs.

Exit criterion:

A new agent can become productive from graph-grounded context without re-deriving the architecture from scratch.

### Phase 8 — optional interactive surface

Only after query semantics are stable:
- searchable architecture/runtime explorer;
- impact graph;
- freshness indicators;
- evidence inspector;
- decision/evidence timeline;
- “why does this exist?” view;
- “what changes if I replace this?” view.

CLI/query semantics come first.

---

## 24. Migration from the original two-tier proposal

| Original proposal | Final disposition |
|---|---|
| Tier 1 K0-Graph | replace with runtime self-knowledge views; no graph subsystem in K0 |
| vivim.mind as graph home | retain mind as runtime self-knowledge lens, not universal graph authority |
| Tier 2 vivim.grounding | keep as system plugin / development bridge |
| duplicate dev:* graph | do not create by default; consume Steward graph bundle |
| BasisDigest | keep, but canonicalize and make basis-specific |
| graph.snapshot/query/inspect/freshness | keep concept; implement through runtime self-knowledge contracts |
| grounding.trace | keep as the primary developer operation |
| grounding.diff | keep after trace/freshness are proven |
| ingest 354-node graph | consume the current validated graph/bundle; do not hard-code stale counts |
| automatic architecture mutation | reject; Steward reconciliation remains controlled |

---

## 25. What must not happen

### No K0 project-management layer

No GitHub client, markdown parser, responsibility registry, sprint state, journey semantics, or persistent architecture graph in K0.

### No two architecture graphs

Do not maintain:

Steward graph
+
Grounding graph

as competing representations.

The Grounding bundle is a projection/cache of the Steward graph.

### No ownership inference from code

A file path is not ownership.

A class name is not a destination responsibility.

A route is not authority.

An LLM explanation is not proof.

### No authority by observation

Self-knowledge may describe:
- REFUSED;
- STALE;
- DEGRADED;
- UNKNOWN.

It may not grant permission.

### No premature global invalidation bus

Basis checking on read is sufficient until evidence proves otherwise.

### No forced implementation completeness

A responsibility can remain design-required, frontier, under-modelled or otherwise unimplemented.

That is a valid graph state.

---

## 26. Security and trust

The grounding surface is read-dominant.

Runtime trust comes from:
- signed Recipe/Manifest;
- capability grants;
- law enforcement;
- generation/revocation fencing;
- governed plugin boundaries.

Development trust comes from:
- source commit;
- source documents;
- generator/schema version;
- graph digest;
- validation result.

Cross-layer trust comes from:
- explicit link;
- basis reference;
- evidence reference;
- status;
- rationale;
- freshness.

Grounding should never require raw provider credentials merely to explain architecture.

Provider account/session references should use governed identifiers or redacted descriptors.

---

## 27. Failure semantics

Use the existing Outcome vocabulary for expected-but-negative states:

UNKNOWN
UNSUPPORTED
AMBIGUOUS
CONTRADICTORY
REFUSED
VERIFICATION_FAILED
EVALUATION_FAILED

Grounding may additionally report:

CURRENT
STALE
UNRESOLVABLE
CONFLICTED
ORPHANED
UNMAPPED

These states are data distinctions and should not become exceptions merely because they are negative.

---

## 28. Proof plan

### P0 — contract proof

- contracts compile;
- schemas validate;
- identities are stable;
- malformed bundles reject.

### P1 — referential proof

- all graph links resolve;
- no undefined IDs;
- every edge has lineage;
- bundle validation succeeds.

### P2 — freshness proof

Change:
- Recipe;
- Manifest;
- route generation;
- law generation;
- vault revision.

Then verify the affected derived view becomes stale or is recomputed.

### P3 — grounding proof

For known targets:

runtime op
→ contract
→ capability
→ development responsibility
→ journey
→ slice
→ evidence

returns the expected localized trace.

### P4 — drift proof

Introduce a controlled mismatch between:
- graph bundle;
- current runtime;
- current source commit.

Verify the system reports the mismatch rather than silently reconciling it.

### P5 — replacement proof

Replace a provider realization while preserving capability identity.

Verify:
- capability identity remains stable;
- realization identity changes;
- evidence history remains addressable;
- grounding remains coherent.

### P6 — agent utility proof

Give a fresh coding agent only the grounded trace packet.

Verify it can:
- locate the correct contract;
- understand ownership;
- identify relevant proof;
- avoid forbidden boundaries;
- identify the correct falsifier.

This is the actual value test of the development system.

---

## 29. Developer command surface

Suggested initial commands:

bun run graph:trace R-058
bun run graph:trace k0:op:provider-browser.navigate@1
bun run graph:inspect J3
bun run graph:inspect COMP-FIRST-RESEARCH-EVIDENCE-WORLD
bun run graph:freshness
bun run graph:diff
bun run graph:impact R-082
bun run graph:orphaned
bun run graph:falsify

Machine-readable output:

bun run graph:trace R-082 --json

Human output should be concise by default; JSON is the agent/CI surface.

---

## 30. Development-agent handoff

A future Steward or launcher may hand a coding agent:

TARGET
  R-082 Routing / selection

WHY
  required by J5 / J8

BOUNDARY
  system plugin / shared contract

OWNER
  provider-routing semantics

DEPENDENCIES
  R-076 Provider
  R-077 Account
  R-078 Session
  R-081 Realization

AUTHORITY
  law / consent / routing constraints remain separate

REPLACEMENT SEAM
  routing policy contract

CURRENT EVIDENCE
  SI-050108
  related runtime implementation evidence

CURRENT PROOF
  code / partial

OPEN GAP
  destination-grade durable routing policy

FALSIFIER
  routing becomes an authority path

FRESHNESS
  CURRENT

This packet is sufficient to start targeted repository exploration.

---

## 31. Relationship to the first build slice

This system must not delay the first Research → Evidence → World implementation.

The intended progression is:

graph stabilization
      ↓
minimum runtime self-knowledge
      ↓
grounding trace
      ↓
first implementation slice
      ↓
implementation/proof attachments
      ↓
real traces improve grounding

The first composition is:

Research
→ Evidence
→ World

with:

Address
→ Intent
→ Context
→ Capability
→ Realization
→ Authority
→ Work
→ Execution
→ Evidence
→ World
→ Product Instance continuity

The first build becomes the first real test of the grounding model.

---

## 32. Example: a normal development day

### Morning — orient

graph:trace COMP-FIRST-RESEARCH-EVIDENCE-WORLD

Developer sees:
- destination anchor;
- affected journeys;
- reference pieces;
- current implementation attachments;
- open proof gates.

### Before changing code

graph:trace R-081

Developer sees:
- provider realization boundary;
- capability relationship;
- account/session neighbors;
- authority separation;
- replacement seam;
- current evidence;
- live-proof gap.

### During implementation

The coding agent requests a trace for the contract or implementation it is touching.

It receives only the nearby architecture it needs.

### After tests

Runtime self-knowledge reports:
- route changed;
- generation advanced;
- new evidence produced.

Grounding re-checks the trace.

### Before PR

graph:impact <changed-node>
graph:diff

Developer sees:
- affected responsibilities;
- journeys;
- slices;
- stale links;
- orphan runtime;
- proof still needed.

### After merge

The Steward reconciles:
- implementation attachment;
- new evidence;
- changed status;
- changed graph links.

No one manually reconstructs the whole system narrative.

---

## 33. Long-term target

The mature development loop is:

Human intent
   ↓
architecture-aware development environment
   ↓
localized grounded context
   ↓
implementation
   ↓
runtime observation
   ↓
evidence
   ↓
automatic drift detection
   ↓
Steward reconciliation
   ↓
new grounded context

The result is not merely self-documenting code.

The target is:

a development environment in which the distance between architectural intent, current runtime reality and proof is continuously inspectable without making any one layer the authority for all others.

This is the development analogue of VIVIM's broader separation:

meaning
realization
authority
evidence
representation

Each remains distinct, while explicit relations reconnect them.

---

## 34. Final architecture

                 +--------------------------------+
                 | Architecture Steward           |
                 | Graph + source lineage          |
                 +---------------+----------------+
                                 |
                           graph bundle
                                 |
                                 v
                           vivim.grounding
                                 ^
                                 |
                       runtime self-knowledge
                                 |
                           vivim.mind
                                 ^
                                 |
                    Ω governed observations
                                 |
                              Ω runtime

Ω remains the factory.

K0 remains narrow.

vivim.mind remains self-knowledge as a derived lens.

vivim.grounding is the bridge, not the authority.

The Architecture Steward graph remains the single development architecture network.

The first useful artifact is the grounded trace.

---

## 35. Acceptance criteria

The design is operationally successful when:

1. A fresh agent can ask what a runtime operation is and receive an attributed architectural trace.
2. The trace distinguishes runtime fact from development intent.
3. The trace distinguishes evidence from authority.
4. The trace surfaces stale, unknown and conflicted state explicitly.
5. A changed runtime basis invalidates stale derived knowledge.
6. A runtime capability with no architectural owner is surfaced as orphaned rather than silently assigned.
7. A destination responsibility with no implementation remains visibly unimplemented/unproven.
8. A realization can be replaced without changing semantic capability identity.
9. No Grounding operation can grant authority or mutate law.
10. The Steward graph remains the only development architecture graph.
11. The first Research → Evidence → World slice can be traced end-to-end.
12. The system reduces cold-start context without reducing epistemic honesty.

---

## 36. Final decision statement

The proposal's central insight is retained and the K0/duplicate-graph risks are removed.

The implementation target is therefore:

runtime self-knowledge
+
Steward architecture graph
+
explicit grounding seam
→
localized, freshness-aware, evidence-backed developer context.

The first implementation should prove the trace and freshness loop, not build a universal graph database.

The first user of the system is the development process itself.
