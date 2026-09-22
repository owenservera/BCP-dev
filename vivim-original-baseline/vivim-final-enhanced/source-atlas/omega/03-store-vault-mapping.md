# OMEGA Artifact #3 — Store→Vault-ns Mapping (67/67 contracts)

> MSG-01 artifact 3. Code-only: `src/storage/contracts/` (60 top + 7 onboarding) +
> `src/ids.ts` (6 derivations + hash) + `src/ai/execution/types.ts` (`ExecutionId` brand).
> Proposed namespaces are CANDIDATES derived from the code's own groupings (L2 clusters
> C1–C12 + bus namespaces); Omega accepts/renames/rejects. Rows marked NEW-NS-PROPOSAL
> have no clean home — they are proposals for new namespaces, not silent fits.

## ID-shape facts (measured by scan, apply to all rows unless noted)

- 94× `id: string` (ULID from `newId()`, sortable PKs) · 1× `id: ExecutionId` (branded
  string, `ai/execution/types.ts`: `string & {__brand:'ExecutionId'}`) · 1× `id: number`
  (`SystemEvent` in kernel-store.ts — the only numeric id) · 1× `id?: string` (optional).
- Natural (non-PK) identity measured from Row fields: bindings `(globalId,providerId)`
  + `bind:{global}:{provider}`; programs `(bindingId,version)` + `prog:{binding}:v{n}`
  (one `isActive`); selectors `(capabilityId,providerId,name)` + `sel:{cap}:{provider}:{name}`;
  messages `(conversationId,sequenceIndex)` + `identityHash` (sha256); nodes `contentHash`;
  slaves `slave:{provider}:{account}` singleton (not ULID).
- Per-row "natural key" below says UNKNOWN where the Row's lookup fields were not
  individually extracted (contract file cited — check there, do not guess).

## Proposed ns inventory (16 candidates, code-derived)

`capability, provider, fleet, conversation, memory, workflow, parser, discovery,
onboarding, policy, sync, telemetry, ui, config, agent, kernel` (+ `ephemeral` for
session-scoped transient rows — proposed, not observed).

## The 67 rows (grouped by proposed ns)

### ns `capability` (proposal; home for taxonomy/binding/program/shape rows)

| Contract | Object-id shape | Flag |
|----------|-----------------|------|
| capability-store.ts | ULID PKs + `bind:`/`prog:`/`sel:`/`cap:` natural keys (measured Row fields) | — |
| capability-resolution-store.ts | ULID cache rows keyed `(globalId,providerId)` | — |
| capability-binding-store.ts | ULID + status-log appends, lifecycle `prospect→retired` | — |
| shape-binding-store.ts | ULID + `(shapeId,providerId)` natural key (UNKNOWN — verify in file) | — |
| primitive-store.ts | ULID catalog rows | — |
| program-store.ts | ULID + `(bindingId,version)`, one `isActive` | — |

### ns `provider` (proposal; definitions/manifests/models)

| Contract | Object-id shape | Flag |
|----------|-----------------|------|
| provider-store.ts | ULID + `slug` unique (manifest slugs = 16 pilot slugs) | — |
| provider-type-store.ts | ULID + archetype rows | — |

### ns `fleet` (proposal; runtime browser-fleet state — distinct from provider definitions)

| Contract | Object-id shape | Flag |
|----------|-----------------|------|
| governor-store.ts | `slave:{provider}:{account}` singleton keys (not ULID) | — |
| slave-setup-store.ts | ULID + per-slave setup profiles keyed by slave id | — |
| stealth-store.ts | ULID launch/module profiles + policies | — |
| mux-store.ts | ULID `MuxSession` + response rows | — |
| fleet-supervisor.ts | NO rows (supervisor contract: limits + allocation, not a store) | NEW-NS-PROPOSAL: `fleet-policy` (behavioral contract, not vault objects) — or exclude from vault |
| selector-heal-store.ts | heal attempts keyed `(selectorId)` (no dedicated impl — via `SelectorHealthHistory`) | WEAK-FIT: home by key, not by impl; confirm |

### ns `conversation` (proposal; sessions/messages/blocks/nodes)

| Contract | Object-id shape | Flag |
|----------|-----------------|------|
| conversation-store.ts | ULID + `(conversationId,sequenceIndex)` + `identityHash` (measured Row fields) | — |
| stream-block-store.ts | ULID + `(conversationId,blockIndex)` (verify in file) | — |
| stream-config-store.ts | ULID + `(providerId)` stream configs | — |
| mirror-store.ts | ULID snapshots + optimistic updates keyed `(conversationId)` | fits `conversation`; alt `sync` — PROPOSAL picks conversation (writer is ConversationManager path) |
| node-store.ts | ULID + `contentHash` dedupe (`Node/Version/Alias/Edge`) | — |
| channel-store.ts | ULID streaming channels | WEAK-FIT: pub/sub scope rows; alt `sync` |
| hpe-session-store.ts | ULID HPE sessions | WEAK-FIT: eval-session rows; alt `ephemeral` |

### ns `memory` (proposal; curated/intelligence/knowledge/collections)

| Contract | Object-id shape | Flag |
|----------|-----------------|------|
| memory-curated-store.ts | ULID curated facts | — |
| memory-intelligence-store.ts | ULID + episodic/semantic/procedural kind impls | — |
| knowledge-extractor-store.ts | ULID extraction jobs | — |
| knowledge-ingestion-store.ts | ULID ingestion batches | — |
| semantic-search-store.ts | ULID + Cozo ANN (`cozo-semantic-search.ts` exception impl) | — |
| cross-conversation-synthesis-store.ts | ULID syntheses | — |
| collection-store.ts + collection-item-store.ts | ULID collections + `(collectionId,itemId,order)` items (2 contracts, 1 impl) | — |
| content-unit-store.ts | ULID content units (+ `content-item-store-impl` split) | — |
| context-assembly-store.ts | ULID layers + budget rows | WEAK-FIT: assembly is a view over memory+conversation; alt `conversation` |

### ns `workflow` (proposal; automation/autonomous/agent/harness/version)

| Contract | Object-id shape | Flag |
|----------|-----------------|------|
| automation-store.ts | ULID schedules + runs | — |
| autonomous-store.ts | ULID tasks/steps + `HitlGate` (`hitl-gate-store-impl`) | — |
| agent-loop-store.ts | NO direct impl (runs over autonomous+agentic rows — derived view) | NEW-NS-PROPOSAL or exclude: derived view, not vault objects |
| agentic-store.ts | ULID (no mem-double — gap noted in parity matrix) | — |
| harness-repair-store.ts | ULID repair sessions (+ checkpoint split impl) | — |
| ai-execution-store.ts | branded `ExecutionId` string PK + `RequestId/SessionId` links | SHAPE-EXCEPTION (brand, still string at rest) |
| command-store.ts + command-description-store.ts | ULID (non-`-impl` filenames — naming exception only) | — |
| intent-template-store.ts | ULID task templates | — |
| workspace-store.ts | assembly over `WorkspaceMode/Backup/Template` + containers (no single impl) | WEAK-FIT: assembly, not objects; alt `ui` |

### ns `parser` (proposal; DB-only parser logic + runs)

| Contract | Object-id shape | Flag |
|----------|-----------------|------|
| parser-store.ts | ULID + `(providerId,parserName,parserVersion)` (`logic_type='inline'` only) | — |
| parser-execution-log-store.ts | ULID per-run logs | — |

### ns `discovery` (proposal; pipeline rows)

| Contract | Object-id shape | Flag |
|----------|-----------------|------|
| discovery-store.ts | ULID sessions + results | — |

### ns `onboarding` (proposal; 7 transient pipeline contracts — or `ephemeral`)

| Contract | Object-id shape | Flag |
|----------|-----------------|------|
| onboarding/capability-binding-store.ts | ULID prospect bindings | EPHEMERAL-CANDIDATE: session-scoped until promoted; alt `ephemeral` |
| onboarding/discovered-dom-entity-store.ts | ULID DOM entities | EPHEMERAL-CANDIDATE |
| onboarding/onboarding-session-store.ts | ULID sessions | EPHEMERAL-CANDIDATE |
| onboarding/parser-candidate-store.ts | ULID candidates | EPHEMERAL-CANDIDATE |
| onboarding/protocol-fingerprint-store.ts | ULID fingerprints | EPHEMERAL-CANDIDATE (fingerprints may graduate to `discovery`) |
| onboarding/webapp-taxonomy-store.ts | ULID taxonomies | EPHEMERAL-CANDIDATE |
| onboarding/index.ts | barrel (no rows) | exclude (no objects) |

### ns `policy` (proposal; governance/consent/budgets)

| Contract | Object-id shape | Flag |
|----------|-----------------|------|
| registration-store.ts | ULID registration/drift events | — |
| sandbox-audit-store.ts | ULID audit rows | — |
| kernel-store.ts | ULID spans/provenance/topology/events + numeric `SystemEvent.id: number` | SHAPE-EXCEPTION (numeric id) + NEW-NS-PROPOSAL `kernel-bus`: event-sourced bus records, not vault objects — T-03-relevant |
| cost-store.ts | ULID cost logs (verify in file) | WEAK-FIT: alt `telemetry` |
| router-store.ts | ULID specs/requests/targets/events | WEAK-FIT: route resolution state; alt `policy` kept (resolution is policy) |
| situation-store.ts | ULID situation logs/detections | WEAK-FIT: alt `telemetry` |
| user-identity-store.ts | ULID users/onboarding | WEAK-FIT: alt `identity` (no clean home — NEW-NS-PROPOSAL `identity` if Omega wants it) |
| organization-store.ts | covered by `entity-container-store-impl` (no 1:1 impl) | WEAK-FIT: home by rows, impl lives elsewhere |
| local-agent-store.ts | ULID on-device loops | WEAK-FIT: alt `agent` |
| config-store.ts | ULID `ConfigEntry` + audits (PLUS tunables file overlay — two sources) | NEW-NS-PROPOSAL or `config`: dual-sourced (DB rows + `.runtime/config.tunables.json`); vault holds rows only |
| version-store.ts | ULID versions (+ workflow version impls) | WEAK-FIT: alt per-family (taxonomy/program/workflow versions live with their families) |

### ns `sync` (proposal; collab/realtime/transfer)

| Contract | Object-id shape | Flag |
|----------|-----------------|------|
| (mirror-store listed under `conversation` — alt home noted there) | — | — |
| (channel-store listed under `conversation` — alt home noted there) | — | — |

`sync` holds no exclusive contracts under this grouping: `sync-store-impl.ts`,
`conversation-sync-store-impl.ts`, `contact/notification/media/entity-container/content-item`
impls exist WITHOUT 1:1 contracts (measured in parity matrix §extra impl-only files).
PROPOSAL: Omega either charters `sync` as a new ns for these impl-only families
(contacts, containers, content, notifications, sync, media, entity-containers) with contracts
to be written, or folds them into `conversation`. Flagged, not fitted.

### ns `telemetry` (proposal; traces/health/alerts)

| Contract | Object-id shape | Flag |
|----------|-----------------|------|
| telemetry-store.ts | ULID traces + summaries/cycles | — |
| health-store.ts | ULID ticks + history | — |
| health-digest-store.ts | ULID digests | — |
| alert-store.ts | ULID conditions + events | — |

### ns `ui` (proposal; components/scene/slots)

| Contract | Object-id shape | Flag |
|----------|-----------------|------|
| ui-component-store.ts | ULID `UiComponent` + `SlotBinding` | — |
| canvas-store.ts | memory-native scene (no ULID PKs — `in-memory-store.ts` + mirror convergence, not Prisma rows) | SHAPE-EXCEPTION + WEAK-FIT: scene is memory-first with no vault-grade ids; alt exclude until ids exist |

### ns `config` (proposal; see config-store row under `policy`)

`config-store.ts` is cross-listed here as second candidate home (rows are config versions).
Decision is Omega's; rows are vault-fittable either way except the tunables-file overlay,
which is NOT vault material (local file, `.runtime/`).

### ns `agent` (proposal; loop/agent definitions)

| Contract | Object-id shape | Flag |
|----------|-----------------|------|
| (agent-loop-store listed under `workflow` as derived view) | — | — |
| (local-agent-store listed under `policy` WEAK-FIT, alt `agent`) | — | — |

`agent` has no exclusive contracts: same treatment as `sync` — charter new or fold.
`AgentDefinition`/`AgentBuilderRun`/`RunInbox` models exist (prisma group Builders) without
dedicated contracts (covered via `agentic-store`/`automation-store`).

## New-ns proposals (require Omega charter, not silent fits)

1. `fleet-policy` (behavioral: fleet-supervisor, no rows) or exclude.
2. `kernel-bus` (event-sourced: kernel-store incl. numeric `SystemEvent`; EventRecord path).
3. `ephemeral` (session-scoped: 7 onboarding contracts; optionally HPE sessions).
4. `identity` (user-identity + organization; optional split from `policy`).
5. `sync` charter (impl-only families: contacts/containers/content/notifications/sync/media/entity-containers) or fold into `conversation`.
6. `agent` charter (AgentDefinition/BuilderRun/RunInbox models w/o contracts) or fold into `workflow`.
7. `config` dual-source ruling (DB rows vault; `.runtime/config.tunables.json` local-only).

## Counts

67 contracts mapped: clean fits 41 · weak fits 13 (alt home noted) · new-ns/exclude proposals 12
lookup fields were not extracted — contract file cited in every case.
