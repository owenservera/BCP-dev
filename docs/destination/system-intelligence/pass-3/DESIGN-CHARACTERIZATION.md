# Pass 3 — Design Characterization

> Classification: DERIVED — CURRENT CHARACTERIZATION
> Status: coupled design baseline; not Ω law.

## 1. The five system flows

A V1 operation must be reconstructable through five simultaneous flows.

### Control flow
```
address → intent → capability → candidate realization → policy selection → authority → execution → outcome
```

### Data flow
```
source / input → canonical object → contextual assembly → realization input → result → canonical state / evidence
```

### Authority flow
```
principal → policy constraints → law / consent → capability token → execution
```

### Evidence flow
```
observation → evidence → selection/proof → execution receipt → world revision → derived views
```

### Lifecycle / recovery flow
```
create → identify → activate → use → degrade → recover / reconnect → continue / refuse → retire
```

A system that works in one flow while the others remain opaque is not destination-grade.

## 2. Coupling map

The highest-risk coupled seams are:

| Coupling | Current finding | Pass 3 treatment | Status |
|---|---|---|---|
| Provider ↔ Account | Provider is modeled; user relationship is not first-class in Ω | Account design candidate | DESIGN-CANDIDATE |
| Account ↔ Session | Legacy has direct accountId; Ω session lacks account identity | Require binding contract | DESIGN-CANDIDATE |
| Session ↔ Browser | Ω stores debugPort only and chooses a page heuristically | Resource ownership experiment | EXPERIMENT-REQUIRED |
| Provider ↔ Realization | Ω realization is strong and evidence-linked | Preserve | EVIDENCE-SUPPORTED |
| Provider ↔ Routing | Registry supplies candidates; resolver does not express full user route policy | Policy layer candidate | DESIGN-CANDIDATE |
| Artifact ↔ World | World needs addressable durable things beyond domain-specific rows | Common envelope + typed payload | DESIGN-CANDIDATE |
| Work ↔ Evidence | Work-shaped state is partly in intent/plan but not durable product identity | Durable Work candidate | DESIGN-CANDIDATE |
| World ↔ Surface | Canvas/layout is projection, not truth; current product integration is incomplete | Keep projection law, prove restart | EXPERIMENT-REQUIRED |
| Plugin ↔ Runtime | Plugin composition is strong inside existing contracts | Define extensibility frontier | EVIDENCE-SUPPORTED |
| Canonical Data ↔ Self-Knowledge | Mind/registry views exist; generalized freshness does not | Basis-digest freshness | DESIGN-CANDIDATE |
| Composition ↔ Product Instance | Active recipe/runtime exists; full user-owned instance boundary is incomplete | Instance boundary precedes product shell | DESIGN-CANDIDATE |
| Export ↔ Restore | Vault roundtrip/export exists; whole-instance reconstruction is not proven | Instance-level archive contract | UNRESOLVED |

## 3. External substrate characterization

### Current Ω reality — OBSERVED

`ProviderRealization` already separates:
- semantic archetype;
- provider;
- execution class;
- lifecycle status;
- discovery session;
- mappings;
- stream references;
- evidence;
- parser pins.

`provider-browser` already gates external mutation through:
- fence;
- attached session;
- PROMOTED realization;
- parser pin.

The live leg is localhost CDP and performs one exactly-once click attempt. These are strong safety and evidence boundaries.

The weakness is upstream:
- session has no canonical account reference;
- session has no profile/process/target identity;
- live descriptor is only providerId + debugPort;
- target selection is heuristic;
- session lifecycle is only ATTACHED/RELEASED;
- reconnect/expiry/isolation/concurrency are not proven.

### Legacy evidence — EVIDENCE-SUPPORTED

Legacy `ProviderAccount` stores providerId, email, login state, profileDir, chromeSlaveId, debugPort and account/user identity.

Legacy `ProviderSession` explicitly stores `accountId`, `providerId`, `vivimSessionId`, state and context.

Legacy `ProfileSession` explicitly binds providerSession → profileDir → chromeSlaveId → port/state.

Legacy architecture also identifies ChromeGovernor, watchdog, CDP discovery and mutex/concurrency as one browser subsystem.

This is behavioral evidence that the destination needs an explicit resource/identity chain. It is not evidence that the legacy class structure must be copied.

## 4. Living world / data characterization

### Current Ω reality — OBSERVED

The vault gives a strong generic storage primitive:
- namespace;
- id;
- revision;
- refs;
- append-only changelog;
- verification;
- export/import/roundtrip;
- never-delete revisions.

Current domain schemas are nevertheless uneven:
- `chat` has conversations/messages with provider/realization/stream references;
- `intent` has explicit state and evidence;
- `providers` has realization state;
- `canvas` is reserved for a future writer;
- no general Artifact/Document object traverses all product layers.

### Legacy evidence — EVIDENCE-SUPPORTED

Legacy conversation/message records carry stable conversation identity, provider/account links, provider message identity, dedupe hashes, stream blocks, attachments, links/entities and lifecycle flags.

Legacy also contains generic collections and attachment storage, giving concrete evidence that user-visible things need relationships and durable identity beyond a single domain row.

### Design conclusion — DESIGN-CANDIDATE

Do not create a universal semantic super-table.

Instead define a **canonical object envelope** shared by typed objects:

```text
objectId
kind
owner/user scope
source identities
canonical relationships
lifecycle state
current revision reference
provenance/evidence references
surface/projection references
work/context references
created/updated timestamps
```

The semantic payload remains typed and provider-aware where necessary.

This separates:
- canonical identity;
- domain meaning;
- evidence;
- representation.

## 5. Provider knowledge characterization

### Current Ω reality — OBSERVED

Provider knowledge is distributed across:
- manifests;
- discovery candidate/observation/mapping/graph rows;
- realization rows;
- parser pins;
- evidence;
- registry projections.

The provider registry is a derived read over realization rows and active plugin state.

### Legacy evidence — EVIDENCE-SUPPORTED

Legacy had a much richer provider declaration and protocol data layer:
- provider manifests;
- endpoint definitions;
- selector/stream formats;
- model/capability catalogues;
- provider/account data;
- parser fallback chains;
- protocol generation and promotion workflow.

### Design conclusion — DESIGN-CANDIDATE

Create a **ProviderKnowledgeView** as a derived assembly, not a new authoritative database.

It should answer:
- what VIVIM currently knows;
- which evidence supports each fact;
- which knowledge is provider-specific;
- current realization state;
- parser/mapping versions;
- freshness basis.

The authoritative inputs remain their existing records. The view is recomputable.

## 6. Composition / reprogrammability characterization

### Current Ω reality — EVIDENCE-SUPPORTED

The runtime is manifest/Recipe governed; plugins cross explicit ports; contracts define semantic surfaces; Forge proposal artifacts carry no authority.

A new implementation inside an existing contract is substantially more extensible than a new semantic protocol.

### Design conclusion — DESIGN-CANDIDATE

Reprogrammability has three levels:

1. **Instance-level** — config/data/routing/layout/projection can evolve without changing contracts.
2. **Plugin-level** — new realization/provider/parser/surface can be added inside existing contracts.
3. **Contract/core-level** — a new semantic protocol, authority primitive, identity rule or host surface requires explicit core/contract/developer work.

## 7. Self-knowledge characterization

### Current Ω reality — OBSERVED

The system can already expose contracts, manifests, provider realizations, lifecycle views, world/mind projections, evidence, plan state, liveness and other machine-readable observations.

### Gap — EVIDENCE-SUPPORTED

Those views do not share one generalized freshness model. A view can be semantically derived but not be able to prove that its inputs remain unchanged.

### Design conclusion — DESIGN-CANDIDATE

Every important derived self-view should carry:
```text
basisRefs
basisDigest
computedAt
freshness = CURRENT | STALE | UNRESOLVABLE | CONFLICTED
```

A derived view is CURRENT only when all basis references still resolve to the same revisions/digests and dependent contract/manifest versions match.

Time can be an external TTL for a provider observation, but time alone must not define freshness of local canonical state.

## 8. Durable Work characterization

Current `Intent` already has lifecycle states and steps. `PlanRegistry` already has dependencies, heartbeat, budget and stall logic.

The missing product object is the **outcome identity** that survives:
- process restart;
- provider change;
- session loss;
- user return.

Design candidate:
- Work owns the durable outcome identity and user-visible lifecycle.
- Intent records what the principal asked.
- Plan records how execution is structured.
- Session/resource records where execution is currently attached.
- Evidence records what happened.
- Outcome references resulting canonical objects.

This avoids turning `Intent`, `Plan`, and `Work` into three copies of the same task.

## 9. Coupled invariant candidates

These are design candidates to test:

1. No external effect without resolvable Account → Session → Browser Resource or an explicit non-browser realization path.
2. No silent account substitution.
3. A session cannot claim authenticated identity unless provider evidence supports the claim.
4. Routing cannot grant authority.
5. Learned performance can rank only inside explicit policy.
6. A surface may represent a canonical object but cannot become the object's only source of truth.
7. Work terminal state must have an outcome/evidence or an explicit refusal/failure reason.
8. Canonical object revisions are never physically deleted.
9. Derived self-knowledge cannot be CURRENT when its basis has changed.
10. Forge proposal is never equivalent to promotion or authority.
11. Provider-specific semantics must remain in the realization/extension boundary unless a second provider proves generality.
12. Product instance state must remain reconstructable independent of replaceable binaries.

## 10. Convergence decision

**PROMOTION-CANDIDATE:** the architecture should accelerate implementation only after the six design packages named in README exist as explicit contracts and experiments 1–4 have characterized the external substrate.

The highest-value unknown is not “how to model providers generally.” It is:
**how to bind a user-owned account to one intended browser resource and preserve that identity across concurrent use, expiry and restart.**
