# L4 — Data Dictionary (which table holds what, which keys join, what is hot)

> Built from `prisma/system/schema.prisma` (111 models, names enumerated from
> `^model `), `prisma/user/schema.prisma` (90 models), `src/storage/contracts/*`
> (67 files), `src/ids.ts` (6 derivations + hash). Column details live in the
> schema files; this file is the NAVIGATION layer (group → model → contract →
> writer → reader). Row conventions: epoch-ms `number` times, `0|1` booleans,
> `*Json` TEXT blobs, string status enums (see `data-architecture.md` §3).

## 0. How to read any FK in this repo (60-second rule)

```
slave:{provider}:{account}  → ProviderAccount (sys) ↔ ProviderSession/ProfileSession (user)
cap:{provider}:{slug}       → CapabilityTaxonomy ↔ ProviderCapability ↔ CapabilityBinding
bind:{global}:{provider}    → CapabilityBinding ↔ CapabilityProgram candidates
prog:{binding}:v{n}         → CapabilityProgram version + ProgramVersionMetric
sel:{cap}:{provider}:{name} → SelectorStrategy ↔ SelectorHealthHistory
sha256 hex / fnv1a:*        → ConversationMessage.identityHash + Node dedup (fnv1a = dedup-only)
ULID (newId())              → every PK in both DBs (sortable, merge-safe)
```

If a string FK matches none of the six, flag it as ad-hoc join (probable tech debt).

## 1. System DB (`prisma/system/schema.prisma`, 111 models)

**Provider plane (9):** `ProviderDefinition, ProviderEndpoint, ProviderParser, ProviderCapability, ProviderConfig, ProviderModel, ProviderAccount, ProviderStreamConfig, ProviderType` (+ `ProviderArchetype`, `ProviderShapeBinding`, `ProviderOverride`). Contract `provider-store.ts` + `provider-type-store.ts`. Writers: `provider-registrar.ts`, `bootstrapSeedsPhase` (`seeds/providers/manifests.ts` + 8 `*.json`: anthropic/openai/openrouter/discord/slack/whatsapp/notion/reddit). Hot read: active definitions for snapshot (`POST /api/system/refresh-provider-snapshot`).

**Capability graph (12):** `CapabilityTaxonomy (40+ cols)`, `CapabilityTier`, `CapabilityBinding{globalId,providerId,status,bestProgramId,confidence,promotionHistoryJson}`, `CapabilityProgram{bindingId,version,isActive,status,configJson}`, `CapabilityIntent`, `CapabilityShape`, `CapabilityShapeBinding`, `SelectorStrategy`, `Outcome`, `BindingEvent`, `BindingStatusLog`, `ProgramVersionMetric` (+ `CapabilityMacro`, `CapabilityTelemetry`). Contracts: `capability-store`, `capability-resolution-store`, `capability-binding-store`, `shape-binding-store`, `primitive-store`, `program-store`. Writers: binder → promotion → resolution → `CapabilityEngine.execute` → outcome. Hot read: `Binding(globalId,providerId)` + best `Program` + selector set (cached in `selector-cache.ts`, invalidated by drift).

**Registration + drift (6):** `RegistrationEvent, ManifestDrift, ManifestChangeLog, ProviderManifestVersion, CapabilityTaxonomyVersion, DriftEvent`. Contract `registration-store.ts`. Writer: `registration-auditor.ts`. Invalidation source for resolution cache.

**Telemetry + health + cost (11):** `TraceEntry, TelemetrySummaryDaily, TelemetryCycleLog, CapabilityTelemetry, ProviderHealth, ProviderHealthHistory, SelectorHealthHistory, ProviderCostLog, ProviderLatencyLog, HealthTick, CircuitBreakerState`. Contracts `telemetry-store`, `health-store`, `health-digest-store`, `cost-store`. Pipeline: `logger.ts` (pino) → `telemetry-aggregator.ts` → daily/cycle rows + `otel-sink.ts`; `alerter+sliding-window+dedup+cooldown → webhook` (`alerting/*`, `AlertCondition`, `AlertEvent`).

**Config + policy + fleet (7):** `ConfigEntry, ConfigAudit, PolicyRule, CircuitBreakerState, FleetEvent, RoutingPreference, SurfaceVersion`. Contracts `config-store`, `version-store`, `kernel-store`. Tunables overlay in `.runtime/config.tunables.json` (14 keys).

**Harness + test (6):** `HarnessCheckpoint, HarnessCommand, RepairSession, TestRun, FailureClassification, CapabilityMacro`. Contract `harness-repair-store.ts`. Writer: `harness-runtime.ts`, `harness-repair-engine.ts`.

**Automation + routes + transfers + learning (13):** `AutomationSchedule, AutomationRun, AlertCondition, AlertEvent, RouteSpec, RouteRequest, RouteTarget, RouteEvent, TransferPattern, TransferCandidate, TransferAttempt, LearningEvent, Rule`. Contracts `automation-store`, `router-store`. Routers: `/api/automate/*`, `/api/route/*`.

**Discovery + protocols + NLCL (12):** `DiscoverySession, DiscoveryResult, DiscoveredDomEntity, ProtocolFingerprint, ParserCandidate, ParserExecutionLog, ParserTestResult, WebAppTaxonomy, TaxonomyGenerationRun, NlclGraphNode, NlclGraphEdge` (+ `ProviderOnboardingSession`). Contracts `discovery-store`, `discovered-dom-entity-store`, `protocol-fingerprint-store`, `parser-store`, `parser-execution-log-store`, `parser-candidate-store`, `webapp-taxonomy-store`, `onboarding/*` (7). Writers: `discovery-session-runner.ts`, 27 `discover_*` MCP tools. Seeds: `seeds/parsers/*`, `seeds/adapters/*`.

**Workflows + MCP + agents (15):** `WorkflowDefinition, WorkflowNode, WorkflowEdge, WorkflowExecution, WorkflowNodeExecution, WorkflowWebhook, WorkflowCredential, WorkflowRetryQueue, WorkflowVersion, McpServerConfig, McpTool, McpToolCall, AgentDefinition, AIExecution, AIExecutionEvent, AIProviderInstance` (+ `AgentBuilderRun`, `RunInbox`, `CommandDescription`). Contracts `agent-loop-store`, `autonomous-store`, `agentic-store`, `ai-execution-store`, `command-store`, `command-description-store`, `intent-template-store`. Seeds: `seeds/automation/*`, `seeds/harness/*`, `seeds/command-descriptions/*`, `seeds/intent-templates/*`.

**Kernel + stealth + sandbox + UI catalog (14):** `KernelSpan, KernelProvenance, KernelTopology, KernelEvent, EventRecord, StealthLaunchProfile, StealthModuleProfile, StealthPolicy, SandboxAudit, Primitive, UiComponent, SlotBinding, HealthDigest, SchemaMeta`. Contracts `kernel-store`, `stealth-store`, `sandbox-audit-store`, `ui-component-store`, `situation-store`. Bus law: `kernel.*|plugin.<id>.*|legacy.*`.

## 2. User DB (`prisma/user/schema.prisma`, 90 models)

**Sessions (5):** `VivimSession, ProviderSession, ProfileSession, AgentSession, HpeSession` (+ contract `hpe-session-store.ts`). Joined to system via `slave:{provider}:{account}`. Writers: `session-lifecycle-manager.ts`, `session-state-persistence.ts`, setup `complete` endpoint.

**Conversations + messages + nodes (14):** `Conversation{providerSessionId,title,state,messageCount,lastMessageAt}`, `ConversationMessage{conversationId,role,content,blocksJson,sequenceIndex,identityHash,isPinned,isArchived,readStatus}`, `MessageAttachment, MessageLink, MessageEntity, StateTransition, SessionCheckpoint, StreamBlock, Node, NodeVersion, NodeAlias, NodeEdge`. Contracts `conversation-store`, `stream-block-store`, `stream-config-store`, `node-store`. Writer: `ConversationManager` → parser → blocks → nodes. Hot read: conversation tail by `sequenceIndex` + `StreamBlock(conversationId)` paginated.

**Mirror + sync + realtime (10):** `MirrorState, MirrorSnapshot, OptimisticUpdate, ObservationEvent, LatencyMeasurement, SyncLog, SyncPeer, SyncState, ConversationSyncState, ConversationSyncLog`. Contracts `mirror-store`, `channel-store`. Converged over `/ws` + `canvas-ws.ts`.

**Memory + knowledge (16):** `EpisodicMemory, SemanticMemory, ProceduralRule, MemoryEmbedding (ANN over hf/minilm/ollama providers), MemoryCurated, MemoryFeedback, MemoryLink, MemoryAccess, ReflectionLog, Entity, EntityMention, DecisionRecord, PatternExtract, Topic, Project, ConversationTopic`. Contracts: `memory-curated-store`, `memory-intelligence-store`, `knowledge-extractor-store`, `knowledge-ingestion-store`, `semantic-search-store`, `cross-conversation-synthesis-store`, `collection-store`, `collection-item-store`, `content-unit-store`, `context-assembly-store`. Quota: `MemoryWardenQuotaError`. Seeds: `seeds/memory-intelligence.ts`, `seeds/taxonomy/*`, `seeds/capabilities/*`.

**Agent loops + autonomous (10):** `AgentLoopRun, AgentStep, AgentDecisionLog, AgentPermissionDecision, AgentFileEdit, ImportJob, AutonomousTask, AutonomousStep, HitlGate, TaskTemplate` (+ `SchemaMeta`). Contracts `agent-loop-store`, `autonomous-store`, `workspace-store`.

**Mux + situations + context budgets (7):** `MuxSession, MuxResponseRow, SituationLog, SituationDetection, ContextLayerRow, TokenBudgetRow, ContextBudgetConfig`. Contract `situation-store.ts`, `mux-store.ts`.

**Workspace + identity + engagement (15):** `WorkspaceMode, WorkspaceBackup, WorkspaceTemplateRow, UserPreference, User, UserOnboarding, PluginRegistry, EntityContainer, EntityContainerMembership, ContentItem, ContentUnit, Notification, Contact, ContactIdentity, MediaAttachment`. Contracts `workspace-store`, `organization-store`, `local-agent-store`, `user-identity-store`.

**Chat-platform mirrors (11):** `DiscordVoiceState, DiscordMemberMeta, SlackChannelMeta, SlackThreadMeta, WhatsAppEncryptionMeta, WhatsAppContactMeta, RedditSubredditMeta, RedditPostMeta, NotionBlockMeta, NotionDatabaseMeta, NotionPageMeta` + `ProviderCapabilityTaxonomy`. One family per sync adapter in `seeds/providers/*.json`.

## 3. Freshness + ownership (who writes, who reads hot, what invalidates)

| Write path | Tables appended | Hot readers | Invalidation |
|------------|----------------|-------------|--------------|
| resolution | `CapabilityBinding` + `BindingStatusLog` + `ProgramVersionMetric` | resolution cache + selector cache | `ManifestDrift`/`ManifestChangeLog` |
| conversation | `Conversation` + `Message(identityHash)` → `StreamBlock` → `Node/Version` + `MessageLink/Entity` | thread tail + blocks by conversation | new message (append-only, no invalidation) |
| memory | `Episodic/Semantic/Procedural` + `MemoryEmbedding` → `MemoryLink/Access` + `ReflectionLog` | ANN search → `SemanticMemory` → `Entity/Mention` | embedding provider swap (knowledge phase) |
| telemetry | `TraceEntry` → `TelemetrySummaryDaily/CycleLog` + `HealthTick` + `CapabilityTelemetry` + `Cost/LatencyLog` | health panels (`fleet.controls`, `health.panel` slots) | retention jobs (`compaction-manager`, `eviction-manager`, `backup-scheduler`) |
| workflow | `WorkflowExecution` + `NodeExecution` (+ `RetryQueue` on failure) | orchestrator + replay | version bump |
| discovery | `DiscoverySession` → `DiscoveryResult` + `DiscoveredDomEntity` + `ProtocolFingerprint` + `ParserCandidate` + `ParserTestResult` | registrar + harness | `discover_approve/reject` |

Cross-DB rule (I-3): zero Prisma `@relation` across DBs (`dual-db-boundary.test.ts` fails build on intersection). All cross-DB correlation is string-key joins above — greppable in a SQLite shell, no JOIN syntax needed.
