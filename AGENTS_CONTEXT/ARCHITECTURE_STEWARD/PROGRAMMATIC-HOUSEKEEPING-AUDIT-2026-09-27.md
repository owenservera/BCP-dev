# Programmatic Housekeeping & Tooling Audit
## 2026-09-27 — Architecture Steward Research

> Classification: DERIVED — RESEARCH / HOUSEKEEPING
> Status: CURRENT AUDIT
> Observation point: current `main` at audit start
> Purpose: identify missing seams, overlooked tooling, duplicated process, and machine-checkable housekeeping opportunities without prematurely redesigning the architecture.

---

## 0. Executive finding

The repository is not suffering primarily from a lack of architectural concepts.

It already has:

- a cold-start chain;
- an Architecture Steward operating model;
- ten Core Function Areas;
- durable identity contracts for the ratified CFAs;
- an explicit boundary-design system;
- an Owner Alignment process;
- Agent Commons schemas/runtime/tests;
- a destination responsibility universe;
- requirement/evidence traceability;
- a vertical-slice registry;
- a destination architecture graph;
- Core-vs-Plugin boundary research;
- extensive legacy and Ω evidence.

The main housekeeping risk is now **state divergence between these surfaces**.

The most important immediate issue observed is that the central CFA register still contains stale bootstrap-era statuses for CFA-05 through CFA-10 even though those CFAs have since become owner-ratified. CFA-01 and CFA-02 are intentionally still in alignment. The Architecture Graph was generated before the present CFA ratification wave and therefore is also stale relative to current role identity/boundary state.

The next major opportunity is not to add another management layer. It is to build a **small control-plane validation toolkit** that can mechanically detect:

1. identity/register drift;
2. owner-alignment/core-agent consistency;
3. stale cross-links and path references;
4. boundary coverage gaps;
5. graph freshness;
6. requirement/slice traceability gaps;
7. contradictory status claims;
8. missing evidence lineage;
9. cold-start breakage;
10. unauthorized or misplaced architectural machinery.

After the CFA-01/02 owner-alignment catch-up, the correct sequence is:

```
CFA-01/02 alignment
→ 10-CFA constellation reconciliation
→ control-plane drift validation
→ graph regeneration
→ boundary activation
→ minimum contracts
→ proving vertical slice
→ implementation
```

Do not reverse this by building tooling before the semantic ownership state is stable enough to validate.

---

# 1. Pass One — Whole-System View

## 1.1 What is already strong

The repository has a deliberate separation between:

```
VISION
DESTINATION
ARCHITECTURE
EVIDENCE
IMPLEMENTATION
PROOF
PRODUCTIZATION
```

It also has a deliberate distinction between:

```
Ω LAW
BCP CONTROL STATE
DESTINATION MODEL
ROLE CONTEXT
HISTORY
```

That is an unusually valuable foundation.

The Architecture Steward itself explicitly owns documentation coherence, mappings, dependency graphs, drift detection, intake, lineage, and fresh-agent teachability. The repository therefore already has the **right conceptual home** for housekeeping.

The current Agent Commons implementation also has a real runtime, schemas, validation code and tests. That means communication is not merely a prose concept, even though signed/public publication remains environment-limited.

## 1.2 The main systemic risk is divergence

There are now several representations of related truth:

- Core Function Area register;
- individual CFA README;
- CFA STATE;
- Owner Alignment record;
- CORE-AGENT;
- IDENTITY-HISTORY;
- Agent Commons peer roster;
- boundary declarations;
- boundary reconciliation records;
- destination responsibility matrix;
- architecture graph;
- graph manifest;
- requirement/evidence traceability;
- vertical-slice registry;
- destination master maps;
- current context/cold-start documents.

This is not inherently bad.

The danger appears when a durable identity changes and only some of these surfaces are updated.

### Example observed now

The central CFA register still says bootstrap-era statuses for several CFAs even though durable owner-alignment records and CORE-AGENT identities now establish ratified status for CFA-04 through CFA-10.

This is exactly the kind of drift a machine validator should detect.

## 1.3 What does NOT look missing

The audit does not find evidence that we need another permanent agent merely for:

- evidence;
- provenance;
- verification;
- uncertainty;
- graph management;
- project management;
- plugin SDK management;
- generic research;
- generic testing.

Those are better handled as cross-cutting concerns or instruments unless recurring evidence proves otherwise.

Likewise, more documentation depth is not currently the answer. The repository already has significant duplicated and layered research; the next optimization is **selection, validation, freshness and lineage**.

---

# 2. Whole-System Missing-Seam Analysis

The following items deserve explicit treatment because they appear in destination material but do not map cleanly to one of the ten CFAs.

## 2.1 Product Instance / Environment Lifecycle

This is the clearest possible ownership gap.

Destination material contains a Product Instance concept and lifecycle concerns, while the current ten-CFA constellation distributes pieces across:

- CFA-02 Data continuity;
- CFA-05 Work;
- CFA-08 Experience;
- CFA-09 Evolution;
- CFA-10 Runtime;
- and general product/destination context.

That may be correct.

But it is not yet obvious who owns the **semantic identity of the user-owned running VIVIM environment itself**:

```
install
→ initialize
→ own
→ configure
→ persist
→ upgrade
→ recover
→ migrate
→ restore
→ replace
→ retire
```

This should NOT automatically become CFA-11.

First action should be to identify whether Product Instance is:

- already intentionally cross-cutting;
- a Data-owned durable subject;
- an Evolution-owned lifecycle subject;
- a separate destination concept with no standing semantic owner yet.

**Housekeeping finding:** make the ownership state explicit during constellation reconciliation.

## 2.2 Machine / OS / Platform Reality

The destination explicitly wants:

- the owner's machine;
- files;
- applications;
- desktop interaction;
- platform integration;
- native environment continuity.

Those concerns are not represented as a dedicated CFA.

This is not necessarily a missing CFA. It may belong under Capability/Provider/Realization + Experience + Runtime + Product Instance.

But the current constellation does not yet prove that this cross-cut is consciously owned.

**Finding:** create an explicit frontier/ownership map for platform reality before implementation. Do not invent a new CFA until the recurring boundary is understood.

## 2.3 Attention / Notification / Interruption Semantics

Attention is currently distributed across:

- CFA-05 Work/background continuity;
- CFA-08 presentation/re-entry;
- destination attention/notification material.

The semantic question:

> What does it mean for VIVIM to decide that something deserves human attention?

is not the same question as:

> How does the UI display the notification?

The current model correctly avoids giving CFA-08 full semantic ownership.

But the semantic owner of Attention itself remains intentionally unresolved.

**Finding:** preserve as cross-cutting for now, but add an explicit ownership placeholder and trigger for future escalation.

## 2.4 Epistemic Integrity

Evidence/provenance/verification/uncertainty are intentionally cross-cutting.

That remains defensible.

However, the same class of unresolved seam appears repeatedly:

- authority trace joins;
- provider evidence;
- Work verification;
- World observation;
- graph evidence;
- change compatibility evidence;
- reconstruction evidence.

**Finding:** do not create an Epistemic Steward yet. Instead define a machine-readable cross-cutting contract vocabulary and watch for repeated coordination failures. If the same semantics repeatedly require central arbitration, revisit.

## 2.5 Security / Secrets / Credential Integration

The architecture correctly refuses to collapse:

```
credentials
≠
authority
≠
data
≠
runtime enforcement
```

But the eventual product needs an owner-machine secret integration path.

The present model has partial references distributed among Data, Authority, Capability and Runtime.

**Finding:** track this as an explicit destination frontier with an eventual contract boundary, rather than accidentally letting credential handling disappear inside Provider or Runtime implementation.

## 2.6 Multi-device continuity and sharing

The destination wants continuity across owned machines and controlled sharing/delegation.

These are substantial concerns because they combine:

- identity;
- persistence;
- synchronization;
- authority;
- evidence;
- conflict;
- evolution;
- product instance lifecycle.

They should remain frontier work until the ten-CFA seams are clearer.

**Finding:** add explicit cross-CFA watch items, not another agent yet.

---

# 3. Pass Two — “Be Each CFA” Audit

## CFA-01 — World & Context

### What CFA-01 should watch

```
World meaning
Thing/Object identity semantics
Relationships
semantic correspondence
Space
Addressability
Context definition
World projections
existence vs accessibility
observation vs evidence
freshness
```

### Likely tooling needs

- World/Context vocabulary checker;
- canonical-vs-projection classification checker;
- existence/accessibility ambiguity tests;
- World correspondence reconciliation fixtures;
- projection freshness tests;
- World observation → Evidence trace validator.

### Potentially missed seam

**Space semantics vs addressability vs surface realization** needs to remain explicit.

A UI can represent a location without that representation becoming the semantic location.

### Important falsifier

A projection or surface must not silently become the source of World truth merely because it is persistent or interactive.

---

## CFA-02 — Data & Identity

### What CFA-02 should watch

```
semantic identity
record identity
revision identity
evidence identity
representation identity
persistence
lineage
reconstruction
migration
information loss
canonical vs derived
workspace/machine safety
```

### Likely tooling needs

- identity/revision/lineage integrity checker;
- serialize/deserialize round-trip tests;
- migration dry-run harness;
- information-loss detector;
- duplicate/collision detector;
- canonical-vs-derived schema validator;
- reconstruction test harness.

### Potentially missed seam

**AuthorityCitation durable storage/join** is repeatedly identified but still deferred.

This is more important than a cosmetic documentation issue because authority references will eventually need reconstruction without becoming a second authority store.

### Important falsifier

After migration, export/import, restart or reconstruction:

```
record identity survives
lineage survives
semantic correspondence is recoverable
authority references remain attributable
evidence references remain addressable
```

---

## CFA-03 — Semantic Continuity

### What CFA-03 should watch

```
self-knowledge
grounding
language
interpretation
canonical Intent
canonical Plan
semantic continuity
terminology/CANON
visual semantic editing
representation write-back
semantic freshness
```

### Likely tooling needs

- deterministic semantic round-trip corpus;
- terminology/CANON lint;
- parser/interpreter golden fixtures;
- semantic-diff tool;
- V1/V2 convergence tests;
- representation-to-canonical-path checker.

### Potentially missed seam

The biggest danger is **semantic duplication**.

A second “helpful” representation layer can easily become an accidental second command language or second Intent system.

### Important falsifier

The same semantic Intent/Plan should remain stable when represented through:

```
text
symbolic
visual
structured
API
re-entry
```

without silently creating a new meaning.

---

## CFA-04 — Authority Governance

### What CFA-04 should watch

```
principal
actor
behalf/deputy
requested effect
authority basis
scope
risk
duration
consent
delegation
expiry
revocation
live decision
authority citation
enforcement binding
```

### Likely tooling needs

- policy/authorization simulation harness;
- delegated-chain test generator;
- stale/revoked authority replay tests;
- authority-vs-capability checker;
- gate-time re-resolution tests;
- authority reconstruction fixtures.

### Potentially missed seam

**Multi-step / batched Work authorization** is explicitly unresolved.

This is likely to become a major contract issue between CFA-04 and CFA-05.

### Important falsifier

No path should derive permission from:

```
Intent
Capability
Identity
Evidence
Executor success
UI confirmation alone
```

---

## CFA-05 — Work & Execution

### What CFA-05 should watch

```
durable Work
executable Plan snapshot
Step
Attempt
effect identity
idempotency
checkpoint
wait
retry
recovery
external-effect uncertainty
verification
Outcome
attribution
background continuity
```

### Likely tooling needs

- crash-injection test harness;
- effect-identity/idempotency tests;
- Work reconstruction tests;
- uncertain-external-effect replay tests;
- retry safety checker;
- Outcome-vs-Evidence assertion library;
- active Work replacement tests.

### Potentially missed seam

**External effect reconciliation** should be a first-class test category, not merely a detail of execution.

The system must distinguish:

```
“I executed the request”
from
“I know what happened externally”
```

### Important falsifier

Kill the worker between execution and recording.

Then prove that restart does not blindly duplicate an uncertain external effect.

---

## CFA-06 — Capability & Provider Realization

### What CFA-06 should watch

```
Capability
Provider
Account
Model
Realization
Session
Resource
Routing
provider-specific discovery
provider-specific healing
external realization evidence
```

### Likely tooling needs

- Provider Lab;
- authenticated browser harness;
- provider protocol/shape corpus;
- DOM/AX/network/SSE/WS capture;
- replay fixtures;
- parser differential tests;
- drift detection;
- healing → verification → promotion harness;
- routing explainability tests.

### Potentially missed seam

The provider laboratory should become a **repeatable instrument**, not an informal collection of experiments.

The repository already contains the historical evidence for this, but the final BCP control plane does not yet expose a minimal standardized empirical loop.

### Important falsifier

For one capability:

```
semantic Capability unchanged
→ swap Provider/Realization
→ same governed contract
→ attribution remains correct
→ no hidden semantic fork
```

---

## CFA-07 — Composition / Plugin / Forge

### What CFA-07 should watch

```
Plugin identity
Composition identity
membership
Manifest
CompositionSpec
Recipe
candidate
admitted
active
Forge generation
proving
replacement
first-party/third-party symmetry
```

### Likely tooling needs

- Manifest/Recipe schema validator;
- candidate-state machine validator;
- first-party/third-party symmetry suite;
- zero-privilege Forge tests;
- composition replacement tests;
- plugin dependency graph checks;
- proposal-only artifact verification.

### Potentially missed seam

**Zero-plugin bootstrap** is shared with CFA-10.

It needs a proving harness that can demonstrate the empty-composition path rather than only a document statement.

### Important falsifier

A Forge-generated artifact must not be able to:

- grant authority;
- bypass admission;
- create a private runtime path;
- mutate canonical state without the normal governed path.

---

## CFA-08 — Experience / Interaction / Surfaces

### What CFA-08 should watch

```
representation
navigation
projection
workspace
canvas
direct manipulation
Intent editing
Work controls
authority presentation
provider choice
composition editing
notification/re-entry
surface configuration
typed write-back
```

### Likely tooling needs

- canonical-vs-presentation state diff tests;
- interaction-to-semantic-path tracing;
- surface contract conformance suite;
- accessibility regression tests;
- stale-projection/re-entry tests;
- typed write-back validator.

### Potentially missed seam

**Direct manipulation** is a special danger.

A gesture must never silently become canonical meaning without an explicit semantic owner.

### Important falsifier

A user-visible surface can be:

- stale;
- partial;
- wrong;
- conflicted;

without the canonical semantic state changing.

---

## CFA-09 — Change, Compatibility & Continuity

### What CFA-09 should watch

```
change subject
semantic delta
impact
compatibility
migration
replacement
promotion
quarantine
rollback
retirement
self-maintenance
re-authorization
continuity
```

### Likely tooling needs

- change-impact graph query;
- compatibility matrix checker;
- migration dry-run;
- rollback simulator;
- dependency blast-radius report;
- stale projection detector;
- change-triggered reauthorization checker.

### Potentially missed seam

Compatibility is often treated as structural.

It needs multi-dimensional checking:

```
structural
semantic
identity
relationship
behavior
authority
evidence
persistence/recovery
projection
resource/lifecycle
```

### Important falsifier

A structurally compatible replacement may still be semantically or authority-incompatible.

---

## CFA-10 — Runtime Constitution & Core Substrate

### What CFA-10 should watch

```
admission
integrity
compartment
Port
capability egress
revocation/fencing
authority gate enforcement
atomic activation
fail-closed recovery
generic lifecycle
minimum crypto/canonical primitives
```

### Likely tooling needs

- K0 adversarial test harness;
- entry-confinement fuzzing;
- hash/bytes-executed equality test;
- token/scope/revocation tests;
- generation pinning tests;
- zero-plugin boot tests;
- atomic activation fault injection;
- import-boundary / layering tests;
- first-party/third-party symmetry tests.

### Potentially missed seam

The most important K0 question is not “does host/src contain it?”

It is:

> What universal bypass exists if this primitive is delegated outside K0?

That reasoning should be represented in machine-readable evidence.

### Important falsifier

For every claimed K0 primitive:

```
universal invariant
→ exact bypass
→ minimum primitive
→ adversarial test
→ evidence
→ falsifier
```

Anything that cannot follow this chain should remain a candidate, not a K0 fact.

---

# 4. Pass Three — Holistic Reassembly

After looking through each CFA independently, several cross-CFA patterns become clearer.

## 4.1 The system has four especially important “spines”

### Spine A — Meaning

```
World
→ Context
→ Intent
→ Plan
→ Work
```

Owned primarily by:

```
CFA-01 → CFA-03 → CFA-05
```

### Spine B — Permission

```
Principal
→ Authority
→ Capability
→ Enforcement
```

Owned primarily by:

```
CFA-04 → CFA-06 → CFA-10
```

### Spine C — Realization

```
Capability
→ Provider
→ Account
→ Realization
→ Session/Resource
→ external effect
```

Owned primarily by:

```
CFA-06 → CFA-05 → evidence
```

### Spine D — Change

```
change
→ impact
→ compatibility
→ authorization implications
→ bounded application
→ verification
→ continuity
```

Owned primarily by:

```
CFA-09
```

with every domain retaining its semantic ownership.

These four spines should be treated as **queryable paths** in the architecture system.

---

# 5. The most important machine-checkable rule

The repository now has enough structure to define a generic architectural invariant:

> Every consequential object or responsibility must be able to answer four questions.

```
WHO OWNS THE MEANING?
WHO OWNS THE DURABLE RECORD?
WHO AUTHORIZES THE EFFECT?
WHAT EVIDENCE PROVES THE CLAIM?
```

A fifth question becomes important for change:

```
WHAT BREAKS IF THIS IS REPLACED?
```

This should eventually become the standard minimum metadata for:

- destination responsibility rows;
- contracts;
- vertical slices;
- implementation attachments;
- evidence records;
- architecture graph edges;
- change records.

This would connect the current responsibility matrix, graph, requirement traceability and future implementation evidence without inventing a second ontology.

---

# 6. Tooling Audit — What exists now

## Current control-plane tooling observed

### Present

- Architecture graph builder:
  `AGENTS_CONTEXT/ARCHITECTURE_STEWARD/tools/build-destination-architecture-graph.ts`
- Agent Commons runtime;
- Agent Commons schemas;
- Agent Commons tests;
- architecture/documentation protocols;
- responsibility matrix;
- traceability registry;
- vertical-slice registry;
- System Intelligence indexes;
- extensive historical test/tooling corpus in the legacy/Ω mines.

### Important observation

At the BCP-dev repository root, the current control plane is intentionally lightweight. There is no root-level:

- `.github/workflows/`
- `scripts/`
- `tools/`
- `package.json`

The working control-plane tooling lives under Architecture Steward and Agent Commons, while substantial executable tooling exists in the preserved Ω and legacy mines.

That is acceptable for the current documentation/control-plane epoch.

It does, however, mean that **machine validation of the current architecture surface is still largely a convention rather than an enforced repository gate**.

---

# 7. Tooling We Appear to Be Missing

## T0 — CFA constellation validator

Highest-value housekeeping tool.

Input:

- CFA register;
- README/STATE;
- Owner Alignment;
- CORE-AGENT;
- identity history;
- Commons roster;
- workspace path.

Checks:

- duplicate agent_id;
- missing CORE-AGENT for ratified identity;
- CORE-AGENT exists while identity remains provisional;
- register status disagrees with identity;
- name/slug mismatch;
- workspace mismatch;
- stale owner-alignment references;
- predecessor claims no longer true;
- ratified identity absent from roster.

Output:

```
PASS
DRIFT
CONFLICT
MISSING
UNKNOWN
```

This should be the first reusable validator.

## T1 — Cold-start integrity checker

Validate that the documented cold-start chain resolves:

```
AGENTS.md
→ BUILD_CONTEXT.md
→ CURRENT-CONTEXT.md
→ AGENTS_CONTEXT/README.md
→ relevant role
→ current authority
```

Check links and paths.

This protects fresh-session execution.

## T2 — Cross-link/path drift checker

Scan architecture documents for repository paths and verify:

- path exists;
- target is not archived unless intentionally historical;
- referenced filename still matches current identity;
- links do not point to removed bootstrap-era names.

This is especially valuable after renames/ratifications.

## T3 — Boundary coverage checker

Machine-readable matrix eventually mapping:

```
responsibility
→ semantic owner
→ durable data owner
→ authority owner
→ enforcement owner
→ replacement/evolution owner
→ evidence owner
```

Detect:

- zero owners;
- multiple semantic owners;
- authority owner missing;
- implementation owner masquerading as semantic owner;
- K0 classification without falsifier;
- responsibility with no evidence path.

## T4 — Graph freshness checker

The Architecture Graph has a generator but currently depends on manual regeneration.

Add a check that compares:

- source file mtimes/commit references;
- graph generatedAt;
- graph source hashes or source commit;
- current CFA identity state;
- current destination registries.

Result:

```
GRAPH-CURRENT
GRAPH-STALE
GRAPH-UNVERIFIABLE
```

This should be run whenever architecture context changes materially.

## T5 — Requirement / slice consistency checker

Cross-check:

```
Requirement
↔ Journey
↔ Vertical Slice
↔ Responsibility
↔ Evidence
↔ Current maturity
```

Detect:

- requirement with no journey;
- journey with no relevant slice;
- slice with no requirement;
- evidence that claims a maturity above its recorded proof;
- implementation with no destination anchor.

## T6 — Evidence lineage validator

For every consequential evidence record or edge:

```
source
→ claim
→ evidence
→ subject
→ status
→ freshness
```

Ensure there is no “floating evidence” whose subject or source has been lost.

This is particularly important once implementation nodes enter the Architecture Graph.

## T7 — Architectural contradiction detector

A small rules engine could detect obvious contradiction classes:

- same agent_id with different names;
- same CFA marked ratified and provisional;
- same responsibility owned by two CFAs;
- document says “current” while source register says “historical”;
- graph claims a dependency with no source reference;
- runtime claims K0 while K0 matrix says unproven;
- evidence marked current with stale source;
- “implemented” claim with no evidence gate.

This should identify contradiction, not resolve it.

## T8 — Repository topology snapshot

A repeatable snapshot of:

- current main SHA;
- major trees;
- branches;
- active workstreams;
- current CFA states;
- graph generation;
- open frontier counts.

This is H0 made machine-repeatable.

---

# 8. Proving Tooling We Should Harvest from the Mines

The legacy and Ω trees contain valuable experiments and test assets.

The rule should be:

```
HARVEST
→ CLASSIFY
→ PROVE REUSABLE
→ ISOLATE
→ PROMOTE
```

Do not copy entire tool ecosystems wholesale.

## High-value harvest candidates

### Provider laboratory

Historical VIVIM already contains:

- provider harnesses;
- real Chrome tests;
- browser automation tests;
- stream validation;
- parser tests;
- Chrome Governor/profile tests;
- discovery/healing tests.

These are highly aligned with CFA-06.

### Adversarial runtime harness

Ω has substantial:

- kernel tests;
- containment tests;
- admission tests;
- generation tests;
- capability tests;
- crash/failure tests;
- bootstrap and substrate gates.

These are candidates for CFA-10 proving, not automatic K0 truth.

### Data/reconstruction harnesses

The mine contains:

- migration tests;
- storage parity tests;
- database doctor tooling;
- schema drift reports;
- import/export tests;
- state snapshots.

The useful primitive is the **test logic**, not the historical Prisma model.

### Surface conformance

Historical frontend tests include:

- accessibility;
- route synchronization;
- canvas tests;
- UI state tests;
- cross-surface verification.

These may support CFA-08.

### Forge/proposal proving

Ω contains:

- builder tests;
- composition gates;
- Forge surface tests;
- plugin identity tests;
- proposal/generation tooling.

Potentially valuable for CFA-07.

---

# 9. Process Improvements

## P0 — Make the repository self-checking

The next maturity step is not “more agents.”

It is:

> **make the durable architecture state machine detectable by code.**

The repository should eventually be able to say:

```
10 CFA identities:
    consistent / drifted / conflicted

required peer seams:
    covered / partial / unknown

graph:
    fresh / stale

requirements:
    traced / orphaned

vertical slices:
    anchored / incomplete

evidence:
    lineage intact / broken

cold start:
    valid / broken
```

## P1 — Make every future implementation start with a machine-readable anchor

Before production implementation, require:

```
destination responsibility
+
CFA owner
+
contract
+
authority path
+
evidence plan
+
replacement seam
+
falsifier
```

This is a natural extension of the existing destination responsibility rule.

## P2 — Separate “research tooling” from “runtime tooling”

A critical discipline:

### Research/control-plane tooling

Can live under:

```
AGENTS_CONTEXT/ARCHITECTURE_STEWARD/tools/
```

and should help:

- inspect;
- validate;
- compare;
- reconcile;
- graph;
- trace;
- falsify.

### Runtime tooling

Belongs with the destination runtime and its owning CFA only when implementation is authorized.

This prevents the Steward from becoming a hidden product subsystem.

## P3 — Automate only proven repetition

Do not immediately build ten validators.

Start with the repeated pain now visible:

1. CFA identity/register drift;
2. stale links;
3. stale graph;
4. traceability drift.

Only add more when actual runs demonstrate recurring value.

---

# 10. Suggested New Control-Plane Surface

Without creating another bureaucracy, the Steward could eventually have one small machine-readable status directory:

```
AGENTS_CONTEXT/ARCHITECTURE_STEWARD/control-plane/
```

Potential artifacts:

```
cfa-status.json
boundary-status.json
traceability-status.json
graph-freshness.json
cold-start-status.json
drift-report.json
```

These should be generated views, not handwritten truth.

The source remains:

- CFA identities;
- owner-alignment records;
- responsibility matrix;
- destination registries;
- evidence.

This is a **control surface**, not another ontology.

---

# 11. What should NOT be built yet

Do not build:

- a second project tracker;
- another agent registry;
- a universal provenance database;
- a second ontology;
- a generic autonomous planner;
- a K0 scheduler;
- a new plugin SDK;
- a full graph database;
- a “universal validator” before individual invariants are proven;
- a root application framework merely to run documentation checks;
- automatic architectural rewriting.

These would create machinery faster than evidence.

---

# 12. Recommended sequence from this audit

## Now

Finish CFA-01 and CFA-02 owner alignment.

## Immediately after

Steward performs the 10-CFA constellation reconciliation:

- update stale CFA register;
- verify names/slugs/workspaces;
- reconcile all CORE-AGENT identities;
- reconcile peer ownership seams;
- preserve unresolved cross-cutting questions;
- identify Product Instance / platform / Attention explicit ownership status.

## Then

Run a **control-plane validation pilot** with only four checks:

```
CFA identity consistency
cold-start integrity
path/link drift
graph freshness
```

## Then

Regenerate the Architecture Graph from current sources.

## Then

Activate the minimum boundary contracts.

## Then

Run the first proving vertical slice:

```
USER INTENT
→ WORLD / CONTEXT
→ CAPABILITY
→ ROUTING / AUTHORITY
→ WORK / EXECUTION
→ EVIDENCE
→ USER-VISIBLE RESULT
```

The existing VS0 definition remains the natural first end-to-end proof target.

---

# 13. Final Holistic Conclusion

The architecture has reached a point where **coherence itself is becoming an engineering object**.

That changes what “housekeeping” should mean.

The job is no longer mainly:

```
organize documents
```

It is increasingly:

```
detect divergence
→ expose ownership
→ preserve lineage
→ validate boundaries
→ prove freshness
→ attach evidence
→ keep the architecture executable as a model
```

The biggest missed opportunity is therefore not a missing conceptual subsystem.

It is a missing **machine-checkable control plane for the architecture itself**.

The architecture already says:

```
source → evidence → classification → reconciliation → current view
```

The next step is to make that loop executable in the Steward tooling, starting very small.

---

## Findings status

### CONFIRMED NOW

- Central CFA register contains stale bootstrap-era statuses relative to later ratification work.
- Architecture Graph was generated before the current CFA ratification wave and should be treated as stale until regenerated.
- Root BCP-dev control-plane tooling is intentionally lightweight; substantial executable tooling lives in Agent Commons and preserved Ω/legacy trees.
- Architecture Steward already has the correct conceptual home for drift/lineage/graph validation.
- Product Instance, platform reality, Attention and security/secret integration are not cleanly represented as dedicated CFAs today; ownership should be made explicit before deciding whether a new CFA is justified.
- Provider Lab and adversarial runtime proving are high-value existing evidence/tooling families worth harvesting later.

### HIGH-VALUE CANDIDATES

- CFA constellation validator;
- cold-start integrity checker;
- path/link drift checker;
- boundary coverage checker;
- graph freshness checker;
- requirement/slice consistency checker;
- evidence lineage validator;
- contradiction detector.

### DEFERRED

- new CFA for Product Instance;
- new CFA for Attention;
- Epistemic Integrity Steward;
- generic platform/OS CFA;
- full control-plane automation suite;
- implementation/runtime promotion of historical tooling.

---

## Audit principle

> **Do not add architecture because the repository is large. Add only the smallest durable structure or tooling required to prevent a demonstrated class of loss, ambiguity, drift or unsafe inference.**
