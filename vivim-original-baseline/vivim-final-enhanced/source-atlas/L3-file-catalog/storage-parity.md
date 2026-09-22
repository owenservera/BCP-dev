# L3 — Storage Parity (67 contracts × 71 impls; complete list in `generated/gen-storage.md`)

> Law: engines import `contracts/` only. `impl/<name>-impl.ts` = Prisma; `impl/<name>-mem.ts` = test double.
> `store-contract-parity.test.ts` fails on divergence. Naming convention: `<domain>-store.ts` → `<domain>-store-impl.ts`.

## Contract → impl → mem matrix (from disk enumeration)

| # | Contract (`contracts/`) | Impl (`impl/`) | Mem | Note |
|---|------------------------|----------------|-----|------|
| 1 | `agent-loop-store.ts` | — (via `agentic`/`autonomous` impls) | — | loop runs over autonomous+agentic rows |
| 2 | `agentic-store.ts` | `agentic-store-impl.ts` | — | no mem-double (gap) |
| 3 | `ai-execution-store.ts` | `ai-execution-store-impl.ts` | — | `AIExecution/Event/Instance` |
| 4 | `alert-store.ts` | `alert-store-impl.ts` | — | `AlertCondition/Event` |
| 5 | `automation-store.ts` | `automation-store-impl.ts` | — | `AutomationSchedule/Run` |
| 6 | `autonomous-store.ts` | `autonomous-store-impl.ts` | — | `AutonomousTask/Step`, `HitlGate`→`hitl-gate-store-impl.ts` |
| 7 | `canvas-store.ts` | — (canvas `in-memory-store.ts` + mirror) | memory-native | scene is memory-first |
| 8 | `capability-resolution-store.ts` | `capability-resolution-store-impl.ts` | — | resolution cache |
| 9 | `capability-store.ts` | `capability-store-impl.ts` | — | taxonomy/binding/program/selectors (40-col row) |
| 10 | `channel-store.ts` | `channel-store-impl.ts` | — | streaming channels |
| 11 | `collection-item-store.ts` + `collection-store.ts` | `collection-store-impl.ts` | — | 2 contracts, 1 impl |
| 12 | `command-description-store.ts` | `command-description-store.ts` (non-`-impl` name) | — | naming exception |
| 13 | `command-store.ts` | `command-store.ts` (non-`-impl` name) | — | naming exception |
| 14 | `config-store.ts` | — (via `config_entry` + tunables file) | — | `ConfigEntry/Audit` |
| 15 | `content-unit-store.ts` | `content-unit-store-impl.ts` + `content-item-store-impl.ts` | — | unit vs item split |
| 16 | `context-assembly-store.ts` | `context-assembly-store-impl.ts` | — | `ContextLayerRow`, budgets |
| 17 | `conversation-store.ts` | `conversation-store-impl.ts` + `conversation-sync-store-impl.ts` | — | sync split-out |
| 18 | `cost-store.ts` | `cost-store-impl.ts` | — | `ProviderCostLog` |
| 19 | `cross-conversation-synthesis-store.ts` | `cross-conversation-synth-store-impl.ts` | — | name shortened in impl |
| 20 | `discovery-store.ts` | `discovery-store-impl.ts` | — | `DiscoverySession/Result` |
| 21 | `fleet-supervisor.ts` | — (executor `fleet-supervisor.ts`) | — | contract lives in executor boundary |
| 22 | `governor-store.ts` | `governor-store-impl.ts` | — | slave allocation |
| 23 | `harness-repair-store.ts` | `harness-repair-store-impl.ts` + `harness-checkpoint-store-impl.ts` | — | checkpoint split-out |
| 24 | `health-digest-store.ts` | `health-digest-store-impl.ts` | — | `HealthDigest` |
| 25 | `health-store.ts` | `health-store-impl.ts` | — | `ProviderHealth/History` |
| 26 | `hpe-session-store.ts` | `hpe-session-store-impl.ts` | — | `HpeSession` |
| 27 | `intent-template-store.ts` | `intent-template-store-impl.ts` | — | `TaskTemplate` |
| 28 | `kernel-store.ts` | — (kernel rows via `Kernel*` models, no single impl) | — | `KernelSpan/Provenance/Topology/Event` |
| 29 | `knowledge-extractor-store.ts` | `knowledge-extractor-store-impl.ts` | — | extraction jobs |
| 30 | `knowledge-ingestion-store.ts` | `knowledge-ingestion-store-impl.ts` | — | ingestion batches |
| 31 | `local-agent-store.ts` | `local-agent-store-impl.ts` | — | on-device loops |
| 32 | `memory-curated-store.ts` | `memory-curated-store-impl.ts` | — | curated facts |
| 33 | `memory-intelligence-store.ts` | `memory-intelligence-store-impl.ts` + `episodic/semantic/procedural-memory-store-impl.ts` | — | 3 kind impls |
| 34 | `mirror-store.ts` | `mirror-store-impl.ts` | — | `MirrorState/Snapshot`, `OptimisticUpdate` |
| 35 | `mux-store.ts` | `mux-store-impl.ts` | — | `MuxSession/ResponseRow` |
| 36 | `node-store.ts` | `node-store-impl.ts` | — | universal nodes |
| 37 | `organization-store.ts` | — (`entity-container-store-impl.ts` covers) | — | org via containers |
| 38 | `parser-execution-log-store.ts` | `parser-execution-log-store-impl.ts` | — | parser runs |
| 39 | `parser-store.ts` | `parser-store-impl.ts` | — | `ProviderParser` (DB-only logic) |
| 40 | `primitive-store.ts` | `primitive-store-impl.ts` | — | `Primitive` catalog |
| 41 | `program-store.ts` | `program-store-impl.ts` + **`program-store-mem.ts` (only mem-double in backend)** | mem | reference double pattern |
| 42 | `provider-store.ts` | `provider-store-impl.ts` | — | 9 provider models |
| 43 | `provider-type-store.ts` | `provider-type-store-impl.ts` | — | `ProviderType` |
| 44 | `registration-store.ts` | `registration-store-impl.ts` | — | `RegistrationEvent`, drift |
| 45 | `router-store.ts` | `router-store-impl.ts` | — | `RouteSpec/Request/Target/Event` |
| 46 | `sandbox-audit-store.ts` | `sandbox-audit-store-impl.ts` | — | `SandboxAudit` |
| 47 | `selector-heal-store.ts` | — (via `SelectorHealthHistory` + healer) | — | heal state, no dedicated impl |
| 48 | `semantic-search-store.ts` | `semantic-search-store-impl.ts` + `cozo-semantic-search.ts` | — | Cozo ANN exception file |
| 49 | `shape-binding-store.ts` | `shape-binding-store-impl.ts` | — | shape projections |
| 50 | `situation-store.ts` | `situation-store-impl.ts` | — | `SituationLog/Detection` |
| 51 | `slave-setup-store.ts` | `slave-setup-store-impl.ts` | — | profile setup |
| 52 | `stealth-store.ts` | `stealth-store-impl.ts` | — | stealth profiles |
| 53 | `stream-block-store.ts` | `stream-block-store-impl.ts` | — | `StreamBlock` |
| 54 | `stream-config-store.ts` | `stream-config-store-impl.ts` | — | `ProviderStreamConfig` |
| 55 | `telemetry-store.ts` | `telemetry-store-impl.ts` | — | `TraceEntry`, summaries |
| 56 | `ui-component-store.ts` | `ui-component-store-impl.ts` | — | `UiComponent`, `SlotBinding` |
| 57 | `user-identity-store.ts` | `user-identity-store-impl.ts` | — | users, onboarding |
| 58 | `version-store.ts` | `version-store-impl.ts` + `workflow-version-store-impl.ts` + `workflow-store-impl.ts` + `workflow-retry-queue-store-impl.ts` | — | version family |
| 59 | `workspace-store.ts` | — (via `WorkspaceMode/Backup/Template` models + container impls) | — | workspace assembly |
| 60 | `onboarding/` (7): `capability-binding-store, discovered-dom-entity-store, index, onboarding-session-store, parser-candidate-store, protocol-fingerprint-store, webapp-taxonomy-store` | — (backed by discovery/parser rows) | — | onboarding phase stores |

Extra impl-only files (no 1:1 contract): `contact/notification/sync/media/entity-container/content-item` impls (Phase-1 resource routers), `policy-store-impl.ts`, `prisma-like.ts` (test helper). Migration: `storage/migration/{types,migrations-registry,migration-runner,index}.ts` + `prisma.ts` + `store-factory.ts` + `snapshot.ts` + `factory.ts` (see `storage.md`).

Full paths in `generated/gen-storage.md`.
