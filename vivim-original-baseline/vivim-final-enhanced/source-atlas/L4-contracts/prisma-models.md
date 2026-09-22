# L4 — Contracts: Prisma models (201 = 111 system + 90 user)

> Split read directly from `prisma/system/schema.prisma` (`^model ` ×111) and
> `prisma/user/schema.prisma` (`^model ` ×90). Grouped by prefix family for navigation.
> Column details live in the schema files; this atlas records grouping + key relations
> implied by model names + `ids.ts` derivation keys.

## System DB — `prisma/system/schema.prisma` (111 models)

**Provider plane (13):** `ProviderDefinition, ProviderEndpoint, ProviderParser, ProviderCapability, ProviderConfig, ProviderModel, ProviderAccount, ProviderStreamConfig, ProviderType, ProviderArchetype, ProviderShapeBinding, ProviderHealth, ProviderHealthHistory`.

**Capability graph (16):** `CapabilityTaxonomy, CapabilityTier, CapabilityBinding, CapabilityProgram, CapabilityIntent, CapabilityShape, CapabilityShapeBinding, SelectorStrategy, SelectorHealthHistory, Outcome, BindingEvent, BindingStatusLog, ProgramVersionMetric, CapabilityMacro, CapabilityTelemetry, ProviderOverride`.

**Registration + drift (6):** `RegistrationEvent, ManifestDrift, ManifestChangeLog, ProviderManifestVersion, CapabilityTaxonomyVersion, DriftEvent`.

**Telemetry + health (9):** `TraceEntry, TelemetrySummaryDaily, TelemetryCycleLog, CapabilityTelemetry, ProviderHealthHistory, SelectorHealthHistory, ProviderCostLog, ProviderLatencyLog, HealthTick`.

**Config + policy (5):** `ConfigEntry, ConfigAudit, PolicyRule, CircuitBreakerState, FleetEvent`.

**Harness + macros (6):** `HarnessCheckpoint, HarnessCommand, RepairSession, CapabilityMacro, TestRun, FailureClassification`.

**Automation + routes + transfers (13):** `AutomationSchedule, AutomationRun, AlertCondition, AlertEvent, RouteSpec, RouteRequest, RouteTarget, RouteEvent, TransferPattern, TransferCandidate, TransferAttempt, LearningEvent, Rule`.

**Discovery + protocols (10):** `DiscoverySession, DiscoveryResult, DiscoveredDomEntity, ProtocolFingerprint, ParserCandidate, ParserTestResult, WebAppTaxonomy, TaxonomyGenerationRun, NlclGraphNode, NlclGraphEdge`.

**Workflows + MCP (12):** `WorkflowDefinition, WorkflowNode, WorkflowEdge, WorkflowExecution, WorkflowNodeExecution, WorkflowWebhook, WorkflowCredential, WorkflowRetryQueue, WorkflowVersion, McpServerConfig, McpTool, McpToolCall`.

**Kernel + stealth + sandbox (12):** `KernelSpan, KernelProvenance, KernelTopology, KernelEvent, StealthLaunchProfile, StealthModuleProfile, StealthPolicy, SandboxAudit, HealthDigest, RoutingPreference, SlotBinding, EventRecord`.

**Builders + misc (9):** `AgentBuilderRun, RunInbox, AgentDefinition, CommandDescription, ProviderOnboardingSession, SurfaceVersion, AIExecution, AIExecutionEvent, AIProviderInstance, SchemaMeta`.

## User DB — `prisma/user/schema.prisma` (90 models)

**Sessions (4):** `VivimSession, ProviderSession, ProfileSession, AgentSession` (+ `HpeSession`).

**Conversations + messages (12):** `Conversation, ConversationMessage, Collection, CollectionItem, MessageAttachment, MessageLink, MessageEntity, StateTransition, SessionCheckpoint, StreamBlock, Node, NodeVersion` (+ `NodeAlias, NodeEdge`).

**Mirror + sync (10):** `MirrorState, MirrorSnapshot, OptimisticUpdate, ObservationEvent, LatencyMeasurement, SyncLog, SyncPeer, SyncState, ConversationSyncState, ConversationSyncLog`.

**Memory + knowledge (16):** `EpisodicMemory, SemanticMemory, ProceduralRule, MemoryEmbedding, MemoryCurated, MemoryFeedback, MemoryLink, MemoryAccess, ReflectionLog, Entity, EntityMention, DecisionRecord, PatternExtract, Topic, Project, ConversationTopic`.

**Agent loops (6):** `AgentLoopRun, AgentStep, AgentDecisionLog, AgentPermissionDecision, AgentFileEdit, ImportJob`.

**Mux + situations + context (7):** `MuxSession, MuxResponseRow, SituationLog, SituationDetection, ContextLayerRow, TokenBudgetRow, ContextBudgetConfig`.

**Workspace + identity (10):** `WorkspaceMode, WorkspaceBackup, WorkspaceTemplateRow, UserPreference, User, UserOnboarding, PluginRegistry, EntityContainer, EntityContainerMembership, ContentItem`.

**Engagement (5):** `ContentUnit, Notification, Contact, ContactIdentity, MediaAttachment`.

**Provider taxonomy mirror (1):** `ProviderCapabilityTaxonomy`.

**Chat-platform mirrors (9):** `DiscordVoiceState, DiscordMemberMeta, SlackChannelMeta, SlackThreadMeta, WhatsAppEncryptionMeta, WhatsAppContactMeta, RedditSubredditMeta, RedditPostMeta, NotionBlockMeta, NotionDatabaseMeta, NotionPageMeta` (11 observed — sync adapters per platform).

**Autonomous (4):** `AutonomousTask, AutonomousStep, HitlGate, TaskTemplate` + `SchemaMeta`.

## Cross-DB key rules (from `ids.ts` + row types)

- All PKs are ULIDs (`newId()`); time is epoch-ms numbers.
- `slave:{provider}:{account}` joins `ProviderAccount` (system) ↔ `ProviderSession/ProfileSession` (user).
- `cap:{provider}:{slug}` joins `CapabilityTaxonomy` ↔ `ProviderCapability` ↔ `CapabilityBinding`.
- `bind:{global}:{provider}` ↔ `CapabilityProgram` via `prog:{binding}:v{n}`.
- `identityHash` (`hashContent`) dedupes `ConversationMessage` + universal `Node`s.
