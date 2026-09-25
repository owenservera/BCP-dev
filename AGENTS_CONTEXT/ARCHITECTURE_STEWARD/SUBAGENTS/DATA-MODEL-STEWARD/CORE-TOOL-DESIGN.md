# Data Steward — Core Tool Design

> Status: **PROPOSED / FOUNDATION TOOL**
> Date: 2026-09-25
> CFA: CFA-02 — Data Steward

## Executive idea

If I get one operational tool, it should be a **Data Continuity Lens**.

Working contract name:

`data.continuity.trace@1`

The tool answers one question extremely well:

> **Given any known data reference or boundary, can I reconstruct the information's identity, lineage, transformations, current representation, derived projections, ownership seams, uncertainty, and continuity risk?**

This is the tool I want before building a large data-model abstraction.

Why: most Data Steward work is not inventing schemas. It is following information across boundaries and determining whether identity, meaning, lineage, evidence, durability and reconstructability survived.

---

## 1. The mental model

The tool treats information as a corridor:

```text
SOURCE / OBSERVATION
        ↓
CAPTURE
        ↓
PARSE / ALIGN / REPAIR
        ↓
NORMALIZE
        ↓
IDENTIFY / RECONCILE
        ↓
CANONICAL OBJECT / RELATIONSHIP
        ↓
REVISION / EVIDENCE / PROVENANCE
        ↓
DERIVED PROJECTIONS
        ↓
TRANSLATE
        ↓
EXTERNAL REALIZATION
        ↓
OBSERVE AGAIN
```

The graph, memory, search index, surface, provider, database implementation and parser are all potentially just stages or projections in that corridor.

The tool makes those stages inspectable without making any one implementation the universal source of truth.

---

## 2. Why this one tool covers most of the role

A Data Steward repeatedly needs to perform the same family of operations:

| Job | What the Lens provides |
|---|---|
| Understand a datum | Identity + type + current representation |
| Find its origin | Source genealogy + evidence |
| Understand a parser/import | Transformation chain + versions + loss |
| Debug an identity mismatch | Source↔canonical mappings + collision state |
| Audit a graph node | Graph projection → canonical source → evidence |
| Audit memory/context | Derived view → basis → canonical data |
| Evaluate provider replacement | External identity ↔ canonical identity continuity |
| Evaluate migration | Old revision → transform → new revision |
| Evaluate export | Durable records + references needed for reconstruction |
| Evaluate write-back | Canonical state → external effect → observed state |
| Investigate stale data | Basis revisions/digests + freshness |
| Resolve ownership | Semantic/data/authority/realization/evolution owners |
| Assess impact | Downstream projections and dependent corridors |

This is why it is more valuable than a generic schema browser.

---

## 3. The input

The tool accepts one target. It should be deliberately permissive about what the target is.

```text
CanonicalObjectRef
CanonicalRevisionRef
SourceIdentity
EvidenceRef
RelationshipRef
ProviderRealizationRef
Graph node reference
Boundary/corridor reference
external ID + provider/account scope
```

Conceptually:

```ts
type ContinuityTarget =
  | { kind: "canonical"; ns: string; id: string; rev?: number }
  | { kind: "source"; sourceAuthority: string; sourceRealm: string; sourceAccountScope?: string; externalId: string }
  | { kind: "evidence"; ns: string; id: string; rev: number }
  | { kind: "relationship"; ns: string; id: string; rev?: number }
  | { kind: "provider-realization"; archetypeSlug: string; providerId: string }
  | { kind: "boundary"; boundaryId: string }
  | { kind: "graph-node"; graphId: string };
```

Resolution must never silently invent correspondence. An unresolved target returns `UNKNOWN`, not a guessed object.

---

## 4. The output: a Continuity Dossier

The tool returns one structured dossier rather than a pile of unrelated records.

```text
ContinuityDossier
  target
  identity
  representations[]
  lineage[]
  transformations[]
  revisions[]
  relationships[]
  provenance[]
  evidence[]
  projections[]
  externalRealizations[]
  freshness
  ownership
  continuity
  conflicts[]
  unknowns[]
  loss[]
  risks[]
  reconstruction
  traceStatus
```

### Identity

Show the complete identity ladder where evidence exists:

```text
semantic identity
↕
canonical object
↕
revision
↕
event
↕
evidence
↕
source/provider identity
↕
representation identity
```

Explicitly label non-equivalences:

- provider ID ≠ canonical identity;
- session ID ≠ account identity;
- event ID ≠ record identity;
- revision identity ≠ semantic identity;
- evidence ≠ authority;
- projection ≠ source.

### Lineage

Show how the target got here:

```text
source observation
  → capture
  → parser@version
  → normalized representation
  → reconciliation
  → canonical revision
  → derived view
```

Each step should be independently inspectable.

### Transformations

Each consequential step should expose:

```text
input identity
input revision / observation
transformation
version / basis
output identity
output revision
provenance
epistemic status
information loss
```

### Reconstruction

The dossier should answer:

> If the current projection disappeared, what would I need to rebuild it?

and:

> If this provider, parser, storage implementation, graph implementation or UI disappeared, what durable information remains?

---

## 5. Modes — still one tool

I do not want five separate tools. The same operation gets a small mode argument.

### `trace`

Default.

Follow both backward and forward from a target within bounded depth.

```text
trace(target, { direction: "both", depth: 8 })
```

### `inspect`

Return the local dossier around one target without wide traversal.

### `compare`

Compare two representations or revisions and classify:

```text
EQUIVALENT
AUTHORIZED_REVISION
PARTIAL
CONFLICT
LOSS
UNKNOWN
```

### `validate`

Run continuity checks without mutating data.

Examples:

- source identity maps to exactly one active canonical target;
- evidence refs resolve;
- revision chain is continuous;
- derived view basis still matches;
- export references are reconstructable;
- external round trip has an observable result;
- provider replacement does not require changing canonical identity.

### `impact`

Ask:

> What breaks downstream if this representation, provider, implementation or contract changes?

This is the Data Steward equivalent of an architectural blast-radius query.

---

## 6. The especially important feature: explainable traversal

The tool should not merely return a graph traversal.

It should return a **reasoned corridor**.

For example:

```text
TARGET
Conversation (world:01H..., rev 7)

← SOURCE
ChatGPT / account:alice / conversation:abc123

← OBSERVATION
capture@2026-09-25

← TRANSFORM
chatgpt-parser@3
  timestamp normalized from provider ISO
  assistant metadata preserved
  attachment URL preserved

← RECONCILIATION
source identity → world:01H...
state = ACTIVE
basis = EV-...

→ PROJECTION
project:vivim
→ PROJECTION
mind.memory-summary@2
→ PROJECTION
architecture/context graph

CONTINUITY
identity: PASS
lineage: PASS
evidence: PASS
reconstruction: PASS
freshness: CURRENT
loss: none observed
conflicts: 0
```

The user or agent can then see not only **what** the system says, but **why that representation is connected to the durable thing**.

---

## 7. Where the information comes from

The tool should compose existing read surfaces rather than create another store.

Likely sources:

```text
vivim.vault
  vault.get@1
  vault.getmany@1
  vault.query@1
  vault.verify@1
  vault.export@1

world/object contracts
  canonical object
  relationship
  source identity mapping

provider contracts
  ProviderRealization
  parser pins
  evidence refs

self-knowledge / derived views
  basis refs
  dependency versions
  freshness

Architecture graph
  node/edge snapshot
  source/evidence lineage

host/kernel read surfaces
  graph snapshot
  audit chain

provider-specific evidence
  parser/stream/discovery records
```

The precise implementation seam still needs empirical validation. The principle is more important than the first wiring:

> **The Lens reads existing authorities; it does not become a new authority.**

---

## 8. Read-only first

Version 1 should be strictly read-oriented.

```text
READ
TRACE
COMPARE
VALIDATE
IMPACT
```

No mutation.

Why?

Because this tool's primary job is to make potentially dangerous data boundaries understandable before anyone changes them.

Later, a controlled proposal mode could emit a migration/reconciliation plan, but the first tool should not secretly repair the world while inspecting it.

---

## 9. Boundedness

A universal trace can become an accidental full database scan.

Therefore every traversal should have explicit bounds:

- maximum depth;
- maximum nodes;
- maximum evidence records;
- maximum namespace fan-out;
- time/revision window;
- optional provider/domain filter.

Default behavior should be small and inspectable.

Wide searches require explicit expansion.

---

## 10. Freshness

A dossier must distinguish current knowledge from historical knowledge.

The tool should carry:

```text
computedAt
basisRefs[]
basisDigest
dependencyVersions[]
freshness
derivationRef
```

and use the existing freshness vocabulary where applicable:

`CURRENT | LAGGING | STALE`

with higher-level unresolved states such as:

`UNRESOLVABLE | CONFLICTED`

A stale projection must never be presented as current merely because the projection exists.

---

## 11. Continuity score — do not turn it into a rating

I explicitly do **not** want a magic numeric “data integrity score”.

Instead return dimension-level factual checks:

```text
identity      PASS | FAIL | UNKNOWN
lineage       PASS | FAIL | UNKNOWN
provenance    PASS | FAIL | UNKNOWN
revisions     PASS | FAIL | UNKNOWN
reconcile     PASS | FAIL | UNKNOWN
freshness     CURRENT | STALE | UNKNOWN
reconstruct   PASS | FAIL | UNKNOWN
loss          NONE | DECLARED | UNKNOWN
```

That preserves the project's distinction between evidence, confidence and proof.

---

## 12. Intelligence graph integration

The Lens becomes the bridge between the graph and durable data.

```text
Architecture / intelligence graph
            ↓
     graph-node reference
            ↓
    Data Continuity Lens
            ↓
canonical objects / revisions
            ↓
source identities / evidence
            ↓
provider observations / transformations
```

Conversely:

```text
canonical object
      ↓
derived graph projection
      ↓
graph node
      ↓
Lens can explain its basis
```

This makes the graph **explainable** without making it canonical.

That is a major architectural property.

---

## 13. Productivity-tool example

For an external task:

```text
Linear issue ENG-123
        ↓
source identity
        ↓
provider observation
        ↓
provider parser
        ↓
canonical task object
        ↓
project relationship
        ↓
graph projection
        ↓
context / memory projection
```

The Lens can answer:

> Which canonical object does ENG-123 correspond to?

> What evidence proves that correspondence?

> Which parser version created the current representation?

> What changed between the last two observations?

> Which projections depend on it?

> What survives if Linear is replaced?

> Can the task be restored from the local vault without Linear?

That is exactly the Data Steward's job compressed into one operation.

---

## 14. Provider-conversation example

For a ChatGPT message:

```text
provider DOM / network observation
       ↓
capture evidence
       ↓
stream alignment
       ↓
parser
       ↓
message identity reconciliation
       ↓
canonical message revision
       ↓
conversation relationship
       ↓
project / memory / context / graph projections
```

The Lens should be able to expose where an apparently simple message came from and which transformations stand between source evidence and current canonical state.

This will also expose exactly where parser drift or identity loss occurs.

---

## 15. Export / recovery mode

`validate` should have a reconstruction variant.

Conceptually:

```text
reconstruct(target)
```

It does not restore anything.

It asks:

1. What durable objects are required?
2. Which revisions are required?
3. Which relationship assertions are required?
4. Which source mappings are required?
5. Which evidence refs are required?
6. Which derived state can be regenerated?
7. Which external dependencies are NOT required?

Then report whether the target is reconstructable from the durable local substrate.

This is one of the strongest tests of the central continuity invariant.

---

## 16. Evolution / replacement mode

One of the most useful future calls:

```text
impact(target, change = "replace realization")
```

The Lens should enumerate:

```text
canonical identities affected
source mappings affected
revision chains affected
evidence dependencies
derived projections
external mappings
surface projections
migration requirements
unknowns
```

This lets the Data Steward answer the Evolution Steward's question:

> “What data continuity consequences follow from this change?”

without owning the evolution process itself.

---

## 17. Relationship to existing Ω mechanisms

This tool fits naturally with current architecture rather than replacing it.

| Existing mechanism | Lens role |
|---|---|
| Ω Vault | durable source to inspect |
| CanonicalObjectRef / RevisionRef | primary identity anchors |
| SourceIdentity | external genealogy |
| WorldRelationship | semantic relationship history |
| Vault provenance/evidence refs | evidence lineage |
| ProviderRealization | current realization state |
| parser pins | transformation provenance |
| `host.graph.snapshot@1` | runtime graph observation |
| `law` / audit chain | authority-related evidence context |
| `vivim.mind` | derived self/world views |
| Architecture graph | development-network projection |

The tool therefore acts as an **observability and reasoning layer across existing authorities**, not as another persistence system.

---

## 18. What I would implement first

Do not start with a generalized graph engine.

Start with one deterministic read operation:

`data.continuity.trace@1`

with this minimal input:

```ts
{
  target: ContinuityTarget,
  mode?: "inspect" | "trace" | "validate",
  direction?: "backward" | "forward" | "both",
  maxDepth?: number,
  maxNodes?: number
}
```

And this minimal useful output:

```text
target identity
canonical resolution
source identities
revision chain
relationships
evidence/provenance
transformations
derived projections
freshness
unknowns/conflicts/loss
reconstruction verdict
```

Then run it against one real corridor.

Only after the corridor exposes a missing contract should the contract be generalized.

---

## 19. Success criterion

The tool succeeds when I can take an unfamiliar thing in VIVIM and, from one call, move from:

```text
“What is this?”
        ↓
“Where did it come from?”
        ↓
“Why do we think it is this object?”
        ↓
“What changed it?”
        ↓
“What else depends on it?”
        ↓
“What is merely derived?”
        ↓
“What is uncertain or conflicting?”
        ↓
“Can I reconstruct it?”
        ↓
“What happens if this implementation/provider/storage/surface disappears?”
```

without manually opening ten unrelated subsystems and guessing how their IDs line up.

That is the operational center of gravity I want for CFA-02.

## 20. Final design principle

> **The Data Continuity Lens should make every important datum explainable, traceable and reconstructable without becoming the authority for that datum.**

That single property gives the Data Steward a practical instrument for most of its work while preserving the architecture's separation among meaning, data, authority, evidence, realization and projection.