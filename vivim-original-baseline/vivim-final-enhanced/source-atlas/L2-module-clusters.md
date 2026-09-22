# L2 — Module Clusters (functional families inside zones, from filename clustering)

> Method: grouped the 186 `src/engines/*.ts` files by prefix family + merged sibling
> zone files (`canvas/`, `automation/`, `alerting/`, `server/*-router`, `mcp/*`) into the
> same family. Every file below was observed on disk.

## C1 — Capability graph (the core: taxonomy → binding → program → execution)

Files (28): `capability.ts`, `capability-binder.ts`, `capability-bootstrap.ts`,
`capability-bootstrap-generated.ts`, `capability-composer.ts`, `capability-discovery-loop.ts`,
`capability-event-bus.ts`, `capability-event-bus-v2.ts`, `capability-macro.ts`,
`capability-parity.ts`, `capability-resolution.ts`, `capability-shape-registry.ts`,
`capability-snapshot.ts`, `capability-taxonomy.ts`, `builtin-capability-wrappers.ts`,
`cdp-capability-registrar.ts`, `live-capability-registry.ts`, `router-capability-bridge.ts`,
`send-capability.ts`, `command-parity-capabilities.ts`, `canvas-layer-mounter.ts`,
`capability-layer-mounter.ts` (engines) + `src/canvas/capability-layer.ts`,
`capability-bridge.ts` + `src/server/capability-router.ts` + `src/server/module-registry.ts`.
Contracts: `capability-store.ts` (Taxonomy/Binding/Program/Selector rows),
`capability-resolution-store.ts`, `capability-binding-store.ts`, `shape-binding-store.ts`,
`primitive-store.ts`, `program-store.ts`.
Prisma: `CapabilityTaxonomy, CapabilityTier, CapabilityBinding, CapabilityProgram, CapabilityIntent, CapabilityShape, CapabilityShapeBinding, SelectorStrategy, Outcome, BindingEvent, BindingStatusLog, ProgramVersionMetric, CapabilityMacro, CapabilityTelemetry`.
Flow: `taxonomy → binder → program promotion → resolution → CapabilityEngine.execute via Governor CDP → outcome/telemetry`.

## C2 — Provider fleet + Chrome governance (all browser automation)

Files (24): `chrome-governor.ts`, `chrome-governor-resilience.ts`, `chrome-setup-wizard.ts`,
`provider-registrar.ts`, `provider-discovery.ts`, `provider-health.ts`, `provider-mux.ts`,
`provider-caps.ts`, `provider-selectors.ts`, `provider-conversation-adapter.ts`,
`provider-test-harness.ts`, `provider-protocol-generator.ts`, `provider-protocol-loader.ts`,
`gateway-provider-llm-adapter.ts`, `api-provider-adapter.ts`, `local-model-adapter.ts`,
`cdp-discovery.ts`, `cdp-watchdog.ts`, `selector-cache.ts`, `selector-healer.ts`,
`selector-refiner.ts`, `humanized-interaction.ts`, `anti-detection.ts`, `manifest-inference.ts`
+ `src/engines/chrome/*`, `browser-automation/*`, `stealth/*`, `src/fleet/*`,
`src/server/chrome-router.ts`, `mux-router.ts`, `src/mcp/browser-mcp.ts`, `browser-tools.ts`.
Contracts: `provider-store.ts`, `provider-type-store.ts`, `governor-store.ts`,
`slave-setup-store.ts`, `stealth-store.ts`, `mux-store.ts`, `selector-heal-store.ts`,
`discovery-store.ts`, `health-store.ts`.
Prisma: `ProviderDefinition, ProviderEndpoint, ProviderParser, ProviderCapability, ProviderConfig, ProviderModel, ProviderAccount, ProviderStreamConfig, ProviderHealth, ProviderHealthHistory, ProviderType, ProviderManifestVersion, ProviderCostLog, ProviderLatencyLog, SelectorHealthHistory, StealthLaunchProfile, StealthModuleProfile, StealthPolicy, MuxSession, MuxResponseRow`.
Invariant from code: only Governor touches CDP; `deriveSlaveId()` singletons one profile per (provider, account).

## C3 — Conversation + session + streaming

Files (18): `conversation-manager.ts`, `conversation-history-sync.ts`, `conversation-organizer.ts`,
`session-caps.ts`, `session-checkpoint.ts`, `session-lifecycle-manager.ts`,
`session-state-persistence.ts`, `state-transition.ts`, `stream-parser.ts`, `stream-align.ts`,
`stream-block-store.ts`, `streaming-protocol.ts`, `streaming-channel-caps.ts`,
`streaming-response-analyzer.ts`, `message-identity.ts`, `composer-typing.ts`,
`task-history.ts`, `mirror-engine.ts` + `src/server/conversation-router.ts`,
`conversation-sync-router.ts`, `interpret-router.ts`, `src/mcp/*session*`.
Contracts: `conversation-store.ts` (Conversation/ConversationMessage/ProviderAccount rows),
`stream-block-store.ts`, `stream-config-store.ts`, `mirror-store.ts`, `node-store.ts`,
`hpe-session-store.ts`, `channel-store.ts`.
Prisma (user DB): `VivimSession, ProviderSession, ProfileSession, Conversation, ConversationMessage, StreamBlock, Node, NodeVersion, NodeAlias, NodeEdge, MirrorState, MirrorSnapshot, OptimisticUpdate, StateTransition, SessionCheckpoint, MessageAttachment, MessageLink, MessageEntity, MuxSession…`.
Key detail: `stream-parser.ts` loads parser logic only from DB (`parser_logic_code`, `logic_type=inline`) — never from disk.

## C4 — Memory + knowledge + semantic search

Files (20): `memory-engine.ts`, `memory-export.ts`, `memory-indexer.ts`, `belief-store.ts`,
`knowledge-envelope.ts`, `knowledge-extractor.ts`, `knowledge-extractor-continuous.ts`,
`knowledge-index-pipeline.ts`, `knowledge-ingestion.ts`, `indexing-pipeline.ts`,
`semantic-search.ts`, `semantic-grounding.ts`, `embedding-hf.ts`, `embedding-minilm.ts`,
`embedding-ollama.ts`, `embedding-classifier.ts`, `classifier-nli.ts`, `format-classifier.ts`,
`reference-grounding.ts`, `cross-conversation-synthesis.ts` + `src/server/knowledge-router.ts`,
`memory-router.ts`, `memory-viz-router.ts`, `src/engines/memory/*`.
Contracts: `memory-curated-store.ts`, `memory-intelligence-store.ts`, `knowledge-extractor-store.ts`,
`knowledge-ingestion-store.ts`, `semantic-search-store.ts`, `cross-conversation-synthesis-store.ts`,
`collection-store.ts`, `collection-item-store.ts`, `content-unit-store.ts`, `context-assembly-store.ts`.
Prisma (user): `EpisodicMemory, SemanticMemory, ProceduralRule, MemoryEmbedding, MemoryCurated, MemoryFeedback, MemoryLink, MemoryAccess, Entity, EntityMention, Topic, Project, ConversationTopic, ReflectionLog, ImportJob…`; (system): `LearningEvent, Rule`.
Seeds: `seeds/taxonomy/*`, `seeds/capabilities/*`, `memory-intelligence.ts`.

## C5 — Workflow + automation + scheduling + harness

Files (26): `workflow-engine.ts`, `workflow-compiler.ts`, `action-plan.ts`,
`action-plan-bridge.ts`, `action-plan-compiler.ts`, `autonomous-execution.ts`,
`autonomous-planner.ts`, `autonomous-replay.ts`, `autonomous-types.ts`,
`agentic-loop.ts`, `agentic-slm.ts`, `intent-decomposer.ts`, `objective-engine.ts`,
`plan-validation-gate.ts`, `execution-kernel.ts`, `execution-memoizer.ts`, `execution-policy.ts`,
`harness-runtime.ts`, `harness-protocol-engine.ts`, `harness-command-registry.ts`,
`harness-checkpoint.ts`, `harness-feedback-coordinator.ts`, `harness-repair-engine.ts`,
`backup-manager.ts`, `backup-scheduler.ts`, `compaction-manager.ts`
+ `src/engines/automation/*`, `scheduler/*`, `workflow-templates/*`,
`src/automation/*`, `src/server/automation-router.ts`, `autonomous-router.ts`,
`llm-harness-router.ts`, `src/cli/commands/automate.ts`.
Contracts: `automation-store.ts`, `autonomous-store.ts`, `agent-loop-store.ts`, `agentic-store.ts`,
`harness-repair-store.ts`, `ai-execution-store.ts`, `command-store.ts`, `command-description-store.ts`,
`intent-template-store.ts`, `workspace-store.ts`.
Prisma: `AutomationSchedule, AutomationRun, WorkflowDefinition, WorkflowNode, WorkflowEdge, WorkflowExecution, WorkflowNodeExecution, WorkflowWebhook, WorkflowCredential, WorkflowRetryQueue, WorkflowVersion, AgentDefinition, AgentLoopRun, AgentStep, AgentDecisionLog, AutonomousTask, AutonomousStep, HitlGate, TaskTemplate, HarnessCheckpoint, HarnessCommand, RepairSession, AIExecution, AIExecutionEvent, AIProviderInstance, CommandDescription, Intent*…`.

## C6 — Parsing + protocol discovery + onboarding

Files (14): `protocol-discovery.ts`, `protocol-loop-parser.ts`, `discovery-session-runner.ts`,
`manifest-inference.ts`, `parser-repair.ts`, `live-capture-engine.ts`,
`local-model-adapter.ts`, `mcp-client-adapter.ts`, `mcp-server-adapter.ts`,
`tool-use-protocol.ts`, `tool-orchestrator-facade.ts`, `dcb-profile.ts`, `dcb-projector.ts`,
`content-unit-decomposer.ts` + `src/engines/parsers/*`, `onboarding/*`,
`src/server/onboarding-boot.ts`, `setup-router.ts`, `src/cli/commands/onboard-provider.ts`,
`src/mcp/discovery-tools.ts`, `serp-parser.ts`.
Contracts: `parser-store.ts`, `parser-candidate-store.ts`, `parser-execution-log-store.ts`,
`discovery-store.ts`, `discovered-dom-entity-store.ts`, `protocol-fingerprint-store.ts`,
`webapp-taxonomy-store.ts`, `onboarding-session-store.ts`.
Prisma: `ProviderParser, ParserExecutionLog, ParserCandidate, ParserTestResult, DiscoverySession, DiscoveryResult, DiscoveredDomEntity, ProtocolFingerprint, ProviderOnboardingSession, WebAppTaxonomy, TaxonomyGenerationRun, SurfaceVersion`.
Seeds: `seeds/parsers/*`, `seeds/providers/*`, `seeds/adapters/*`.

## C7 — Resilience + governance + policy + trust

Files (22): `retry-engine.ts`, `request-queue.ts`, `lock-manager.ts`, `idempotency-guard.ts`,
`sla-monitor.ts`, `error-tracker.ts`, `governance-engine.ts`, `policy-engine.ts`,
`consent-engine.ts`, `trust-score.ts`, `audit-trail.ts`, `registration-auditor.ts`,
`telemetry-audit.ts`, `loop-detector.ts`, `observation-tap.ts`, `health-digest.ts`,
`budget-engine.ts`, `cortex-budget.ts`, `cost-optimizer.ts`, `safe-eval.ts`,
`safe-expression.ts`, `sandbox-runner.ts`, `sandbox-runner-quickjs.ts`, `sandbox-runner-vm.ts`
+ `src/engines/reliability/*`, `resource/*`, `src/resilience/*`, `src/server/kernel-router.ts`.
Contracts: `health-store.ts`, `health-digest-store.ts`, `alert-store.ts`, `cost-store.ts`,
`registration-store.ts`, `sandbox-audit-store.ts`, `kernel-store.ts`, `event-record-store` (`event-record-store.ts` engine + contract).
Prisma: `HealthTick, CircuitBreakerState, ProviderHealth, RegistrationEvent, ManifestDrift, DriftEvent, FleetEvent, AlertCondition, AlertEvent, SandboxAudit, KernelSpan, KernelProvenance, KernelTopology, KernelEvent, EventRecord, PolicyRule, ProviderCostLog…`.
Errors: `SlaveNotRunning/Busy, CdpTimeout, CircuitOpen, MemoryWardenQuota…` (see L4 shared-kernel).

## C8 — Sync + collaboration + realtime + P2P

Files (12): `sync-engine.ts`, `sync.ts`, `conversation-history-sync.ts`, `live-capability-registry.ts`,
`notification-engine.ts`, `contact-engine.ts`, `content-item-engine.ts`,
`entity-container-engine.ts`, `transfer-accelerator.ts`, `storage-relocation-engine.ts`,
`export.ts`, `memory-export.ts` + `src/engines/p2p-node/*`, `pool/*`, `tunnel-client/*`,
`tunnel-orchestrator/*`, `src/server/sync` (`routes/sync.ts`), `websocket.ts`, `canvas-ws.ts`,
`src/server/mutation-router.ts`, `surface-router.ts`, `variant-router.ts`, `template-router.ts`.
Contracts: `node-store.ts`, `mirror-store.ts`, `organization-store.ts`, `user-identity-store.ts`,
`local-agent-store.ts`, `channel-store.ts`.
Prisma (user): `SyncLog, SyncPeer, SyncState, ConversationSyncState, ConversationSyncLog, Notification, Contact, ContactIdentity, EntityContainer, EntityContainerMembership, DiscordVoiceState, DiscordMemberMeta, SlackChannelMeta, SlackThreadMeta, WhatsAppEncryptionMeta, WhatsAppContactMeta, RedditSubredditMeta, RedditPostMeta, NotionBlockMeta, NotionDatabaseMeta, NotionPageMeta…`; (system): `RouteSpec, RouteRequest, RouteTarget, RouteEvent, TransferPattern, TransferCandidate, TransferAttempt, McpServerConfig, McpTool, McpToolCall, RoutingPreference`.

## C9 — Observability + telemetry + alerting

Files (10): `logger.ts`, `metrics.ts`, `otel-sink.ts`, `telemetry-aggregator.ts`,
`telemetry-audit.ts`, `health-digest.ts`, `observation-tap.ts`, `error-tracker.ts`,
`outcome-tracker.ts`, `situation-detector.ts` + `src/engines/observability/*`,
`src/observability/*`, `src/observatory/*`, `src/alerting/*` (6), `src/server/*health*`,
`src/server/storage-router.ts`, `version-router.ts`.
Contracts: `telemetry-store.ts`, `health-store.ts`, `health-digest-store.ts`, `alert-store.ts`,
`situation-store.ts`.
Prisma: `TraceEntry, TelemetrySummaryDaily, TelemetryCycleLog, CapabilityTelemetry, ManifestChangeLog, HealthDigest, SituationLog, ContextLayerRow, TokenBudgetRow, LatencyMeasurement…`.
Pipeline: `logger → telemetry-aggregator → TelemetrySummaryDaily + otel-sink`; `alerter + sliding-window + dedup + cooldown → webhook`.

## C10 — Canvas + UI projection + generative

Files (16, engines side): `canvas-layer-mounter.ts`, `adaptive-workspace.ts`, `workspace-presets.ts`,
`collection-engine.ts`, `content-unit-decomposer.ts`, `content-item-engine.ts`,
`context-assembly.ts`, `composer-typing.ts`, `image-gen-bridge.ts`, `media-engine.ts`,
`messaging-archetypes.ts`, `situation-detector.ts`, `update-engine.ts`, `user-identity.ts`,
`agent-builder.ts`, `entity-container-engine.ts` + `src/canvas/*` (15) + `src/engines/generative/*`
+ `src/server/canvas-router.ts`, `agent-canvas-router.ts`, `canvas-ws.ts`, `collection-router.ts`,
`conceptual-router.ts`, `generative-router.ts`, `media` (`routes/media.ts`), `src/mcp/nlcl-tools.ts`.
Contracts: `canvas-store.ts`, `collection-store.ts`, `collection-item-store.ts`, `content-unit-store.ts`,
`context-assembly-store.ts`, `ui-component-store.ts`, `primitive-store.ts`, `workspace-store.ts`,
`memory-curated-store.ts`.
Prisma: `Primitive, UiComponent, SlotBinding, Collection, CollectionItem, ContentUnit, ContentItem, ContextLayerRow, WorkspaceMode, WorkspaceBackup, WorkspaceTemplateRow, UserPreference, Canvas (`RunInbox, AgentBuilderRun`)…`.
Shared: `shared/canvas-types.ts`, `ui-component.ts`, `ui-slots.ts`, `stream-blocks.ts`.

## C11 — Config + lifecycle + versioning + reprogrammability

Files (12): `config-manager.ts`, `config-universal-surface.ts`, `lifecycle-engine.ts`,
`version-manager.ts`, `update-engine.ts`, `plugin-system.ts`, `plugin-hot-reload.ts`,
`unified-registry.ts`, `live-capability-registry.ts`, `capability-snapshot.ts`,
`eviction-manager.ts`, `db-encryption.ts`, `encryption.ts` + `src/engines/reprogrammability/*`,
`src/reprogrammability/*`, `src/config/*`, `src/server/plugin-router.ts`,
`plugin-builder-router.ts`, `setup-router.ts`, `version-router.ts`, `storage-router.ts`.
Contracts: `config-store.ts`, `version-store.ts`, `registration-store.ts`, `kernel-store.ts`.
Prisma: `ConfigEntry, ConfigAudit, SurfaceVersion, ProviderManifestVersion, CapabilityTaxonomyVersion, WorkflowVersion, ProgramVersionMetric, SlotBinding…`.

## C12 — Entry / bootstrap / cross-surface glue

Files: `src/index.ts` (barrel), `src/cli/*` (8 + 7 commands), `src/server/bootstrap-engines.ts`,
`bootstrap-seeds.ts`, `service-container.ts`, `module-registry.ts`, `engines-catalog.ts`,
`src/mcp/server.ts`, `src/api/*`, `src/integration/flag-registry.ts`,
`src/arch/*`, `src/cleanup/*`, `src/transform/*`, `src/framing/*`, `src/shared/*`,
`src/intel/*` (12 overlays), `src/plugin-kernel/` (empty — future kernel boundary).
Seeds wiring: `seeds/{adapters, automation, capabilities, command-descriptions, conceptual-model, harness, intent-templates, parsers, providers, system, taxonomy, user}/*` loaded by `bootstrap-seeds.ts` + `src/cli/commands/seed.ts`.
Tests wiring: `tests/{unit, integration, e2e, arch, fuzz, chaos, load, stress, docs, fixtures, helpers}/*`.
