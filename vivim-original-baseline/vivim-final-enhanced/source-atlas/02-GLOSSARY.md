# Glossary — Ubiquitous Language (every term traced to code)

> Rule: each entry names the file where the term is defined or most strongly
> evidenced. If a term has no code home, it is not in this glossary.
> Sources: `src/ids.ts`, `src/errors.ts`, `src/storage/contracts/*`,
> `prisma/system/schema.prisma`, `prisma/user/schema.prisma`, `src/engines/*`,
> `src/executor/*`, `frontend/src/ui/slots.ts`, `shared/*`, `src/server/*`.

## A. Capability graph (the core mental model)

| Term | Means | Home |
|------|-------|------|
| **Capability (global)** | Provider-independent action (e.g. `chat.send`). Has `slug`, `category`, `uiComponent`, `minPlanTier`, `interactionMode`. | `contracts/capability-store.ts: CapabilityTaxonomyRow` (40+ cols), `CapabilityTaxonomy` model |
| **Taxonomy** | Catalog of all global capabilities + tiers + shapes. Seeded at boot. | `engines/capability-taxonomy.ts`, `seeds/taxonomy/*`, `CapabilityTaxonomyVersion` |
| **Binding** | Global cap × provider (e.g. `bind:chat.send:openai`). Lifecycle `prospect→test-1→test-2→stable→flaky→broken→retired`. Has `bestProgramId`, `confidence`, `promotionHistoryJson`. | `CapabilityBindingRow`, `capability-binder.ts`, `BindingStatusLog`, `BindingEvent` |
| **Program** | Versioned implementation of a binding (`prog:{binding}:v{n}`). Only one `isActive` per binding. Promotion picks best by confidence+health. | `CapabilityProgramRow`, `ProgramVersionMetric`, `WorkflowVersion` |
| **Selector strategy** | How to find the DOM element for a capability (`sel:{cap}:{provider}:{name}`): `strategyType`, `selectorValue`, `priority`, `hitCount`. Healed at runtime. | `SelectorStrategyRow`, `selector-healer.ts`, `selector-cache.ts`, `SelectorHealthHistory` |
| **Shape / shape binding** | Input/output schema contract for a capability; provider-specific projections. | `CapabilityShape`, `CapabilityShapeBinding`, `capability-shape-registry.ts` |
| **Resolution** | Runtime pick of best binding/program by confidence + tier + health. Cached, invalidated by drift. | `capability-resolution.ts`, `capability-resolution-store.ts`, `live-capability-registry.ts` |
| **Execution** | `CapabilityEngine.execute(slug, providerId, accountId, input)` → governor CDP → parser → blocks → memory → telemetry. Recovery chain on failure. | `engines/capability.ts` (265 lines), `CapabilityExecutionResult{ok,traceId,latencyMs,recoveryStrategies}` |
| **Outcome** | Logged result of an execution (success/failure, latency, recovery path). | `Outcome` model, `outcome-tracker.ts` |
| **Parity** | Guarantee FRONTEND = BACKEND = SDK = CLI = API for every capability. | `capability-parity.ts`, `command-parity-capabilities.ts`, `tests/arch/api-contract.test.ts` |
| **Macro / composite** | Named multi-step sequence / DAG of capabilities. | `capability-macro.ts`, `capability-composer.ts`, `CapabilityMacro` |

## B. Provider fleet + browser

| Term | Means | Home |
|------|-------|------|
| **Provider** | External chat surface (manifest in `seeds/providers/manifests.ts` + `*.json`: anthropic-api, openai-api, openrouter, discord, slack, whatsapp, notion, reddit). Has definition/endpoints/models/accounts/stream-config. | `contracts/provider-store.ts`, `ProviderDefinition`, `provider-registrar.ts` |
| **Slave** | One governed Chrome instance per `(provider, account)`, key `slave:{provider}:{account}` (`deriveSlaveId`). Singleton profile dir. | `src/ids.ts:12`, `governor-store.ts`, `engines/chrome-governor.ts` |
| **Governor** | Sole CDP owner. Allocates slaves, enforces fleet limits + circuit breaker + profile allocation. All browser work funnels here. | `chrome-governor.ts`, `chrome-governor-resilience.ts`, `src/executor/*` |
| **CDP** | Chrome DevTools Protocol. Only `BunCdpClient` (`src/executor/cdp.ts`, 277 lines: auto-reconnect, per-command timeout 30s, 3 retries) + `cdp-transport.ts` touch the wire. | `executor/cdp.ts`, `executor/cdp-transport.ts`, `Governor Canon` |
| **Profile** | Chrome user-data dir per slave. Cookie files on disk = source of truth for "logged in" (not DB flag). | `executor/profile-allocator.ts`, `chrome-instance-profile.ts`, `ProfileSession` |
| **Mux (session)** | Multi-provider fan-out: one prompt → N providers → `MuxResponseRow`s. | `provider-mux.ts`, `mux-store.ts`, `MuxSession`, `server/mux-router.ts` (`/api/route/*`) |
| **Stealth** | Launch/module profiles + policies to avoid bot detection. | `stealth-store.ts`, `StealthLaunchProfile`, `engines/stealth/*`, `anti-detection.ts`, `humanized-interaction.ts` |
| **Health (provider)** | Score + history per provider/slave; feeds resolution + circuit breaker. | `provider-health.ts`, `ProviderHealth`, `ProviderHealthHistory`, `ProviderLatencyLog`, `ProviderCostLog` |

## C. Conversation + streaming + memory

| Term | Means | Home |
|------|-------|------|
| **Conversation / message** | `Conversation{title,state,messageCount,lastMessageAt}` + `ConversationMessage{role,content,blocksJson,sequenceIndex,identityHash}`. Dedupe via `hashContent` (SHA-256). | `contracts/conversation-store.ts`, user models `Conversation`, `ConversationMessage` |
| **Stream block / part** | Progressive output unit. Wire type `ContentPart`/`ContentBlock`; legacy migration via `migrateLegacyBlock`. | `shared/stream-blocks.ts` (re-export of `@/schema/streaming.js`), `stream-block-store.ts`, `StreamBlock` |
| **Parser logic** | Provider-specific streaming parser, loaded ONLY from DB (`parser_logic_code WHERE logic_type='inline'`), never disk. Seeded, versioned, hot-fixable. | `engines/stream-parser.ts`, `contracts/parser-store.ts`, `ProviderParser`, `ParserExecutionLog`, `seeds/parsers/*` |
| **Node (universal)** | Deduped content atom (`Node` + `NodeVersion` + `NodeAlias` + `NodeEdge`), keyed by content hash. Backs memory + sync + canvas. | `contracts/node-store.ts`, user models `Node*`, `hashContent` |
| **Mirror / sync** | `MirrorState` + `MirrorSnapshot` + `OptimisticUpdate` (canvas) and `SyncLog`/`SyncState`/`ConversationSync*` (conversations). WS converges replicas. | `mirror-engine.ts`, `sync-engine.ts`, `sync.ts`, `server/websocket.ts`, `canvas-ws.ts` |
| **Memory (3 kinds)** | Episodic (events) + Semantic (facts + `MemoryEmbedding`) + Procedural (`ProceduralRule`). Curated + feedback + links + access log. Quota via `MemoryWardenQuotaError`. | `memory-engine.ts`, `EpisodicMemory`, `SemanticMemory`, `MemoryEmbedding`, `MemoryCurated`, `ReflectionLog` |
| **Knowledge** | Ingestion batches → extraction jobs → index pipeline → semantic search → cross-conversation synthesis. | `knowledge-ingestion.ts`, `knowledge-extractor*.ts`, `semantic-search.ts`, `cross-conversation-synthesis.ts` |
| **Session** | `VivimSession` (app) + `ProviderSession` (provider login) + `ProfileSession` (profile dir) + `AgentSession`/`HpeSession`. Checkpoints + lifecycle manager. | `session-lifecycle-manager.ts`, `session-checkpoint.ts`, `session-state-persistence.ts` |
| **Channel** | Streaming channel capability (pub/sub scope for live updates). | `streaming-channel-caps.ts`, `streaming-protocol.ts`, `channel-store.ts` |

## D. Workflow + automation + harness + NLCL

| Term | Means | Home |
|------|-------|------|
| **Workflow** | `WorkflowDefinition` + nodes/edges → `WorkflowExecution` + node executions; webhooks/credentials/retry-queue/versions. | `workflow-engine.ts`, `workflow-compiler.ts`, system models `Workflow*` |
| **Automation** | Scheduled runs (`AutomationSchedule` → `AutomationRun`) via `AutomationScheduler`/`automation/scheduler.ts`; UI automation via `ui-automator.ts`. CLI `automate` has 10 subactions. | `contracts/automation-store.ts`, `server/automation-router.ts` (`/api/automate/*`), `cli/commands/automate.ts` |
| **Autonomous task** | `AutonomousTask` + steps + HITL gates (`HitlGate`: approve/deny/expire) driven by planner + executor + replay. | `autonomous-execution.ts`, `autonomous-planner.ts`, `autonomous-replay.ts`, `server/autonomous-router.ts` |
| **Harness** | Test/repair runtime for providers and commands: checkpoints, command registry, feedback coordinator, repair engine/sessions. | `harness-runtime.ts`, `harness-*`, `HarnessCheckpoint`, `HarnessCommand`, `RepairSession`, `server/llm-harness-router.ts` (`/api/harness/*`) |
| **Action plan** | Zod-validated DAG (`ActionNodeSchema`/`ActionPlanSchema`) with `RISK_TIER`, `topologicalOrder`, `requiresConfirmation`. | `engines/action-plan.ts`, `action-plan-bridge.ts`, `action-plan-compiler.ts` |
| **NLCL** | Natural-language command language: 60 files in `engines/nlcl/` + `nlcl-engine.ts`; routes `/api/nlcl/*` + `POST /api/interpret`; REPL `vivim>` sends identical contract; MCP `nl_command`/`nl_list_commands`/`nl_help`. | `engines/nlcl/*`, `server/nlcl-router.ts`, `interpret-router.ts`, `cli/repl.ts`, `mcp/nlcl-tools.ts` |
| **Discovery** | Live provider surface discovery: session → navigate → DOM/a11y → match shape → infer caps → generate/validate/edit manifest → test parser → approve/reject. 27 MCP tools `discover_*`. | `protocol-discovery.ts`, `discovery-session-runner.ts`, `DiscoverySession`, `DiscoveredDomEntity`, `mcp/discovery-tools.ts` (341 lines) |

## E. Platform + UI + ops

| Term | Means | Home |
|------|-------|------|
| **Slot** | Fixed UI position rendering a swappable component (29 `SLOT_IDS`: 13 chat.* + 16 canvas/session/panel/tab.*). Resolved via `UIComponentRegistry`: exact → provider default → global default → skeleton. | `frontend/src/ui/slots.ts` (139 lines), `SLOT_META`, `shared/ui-slots.ts` (`UiSlotClaim`) |
| **Primitive / UI component** | Catalog building blocks (`Primitive`) + composed renderers (`UiComponent`) + `SlotBinding` rows declaring availability. | `Primitive`, `UiComponent`, `SlotBinding`, `contracts/ui-component-store.ts`, `canvas/primitives.ts` |
| **Surface** | One of cli/ui/api/mcp (capability `surface:'cli'` auto-registers CLI commands; `surface:'api'` declares `apiEndpoint{method,path}`). Universal dispatcher routes any declared endpoint without a dedicated route. | `cli/commands/registry-bridge.ts`, `server/index.ts:matchCapabilityEndpoint`, `UnifiedCapability` |
| **Store contract / impl / mem** | `contracts/<name>.ts` = `*Row` + `<Name>Store` interface (law); `impl/<name>-impl.ts` = Prisma impl; `impl/<name>-mem.ts` = in-memory double for tests. Engines import contracts only. | `src/storage/contracts/` (67), `src/storage/impl/` (71) |
| **Boot phase** | Strict order `seeds → stores → knowledge → capabilities → lifecycle` (`orchestrateBootstrap`). `BootstrapContext` (60+ optional fields) is the mutable bag; `BootstrapEnginesResult` (40+ fields) is the fixed product; `ServiceContainer` (string keys, LIFO teardown) hosts it. | `plugin-kernel/bootstrap/orchestrator.ts`, `server/bootstrap/*`, `server/service-container.ts` (203 lines) |
| **Event kind** | Namespaced `kernel.*` \| `plugin.<id>.*` \| `legacy.*` (regex-enforced). Auto-recorded to `EventRecord`. | `capability-event-bus-v2.ts`, `KernelEvent`, `EventRecord` |
| **Sandbox** | QuickJS primary (`sandbox-runner-quickjs.ts`) + isolated-vm; `vm`/`safe-eval` removed. Per-run CPU/memory budgets; permission denials typed. | `sandbox-runner*.ts`, `SandboxAudit`, `SandboxTimeout/Budget/PermissionError` |
| **Tunable** | Runtime-reconfigurable key (`server.port`, `fleet.*`, `storage.*`, … 13 keys) overridden via `devops toolkit config set` → `.runtime/config.tunables.json`. Static rest lives in `config` const + env vars. | `src/config.ts` (524 lines: `TUNABLE_SCHEMA`, `getTunable/setTunable/listTunables`, `getServerPort`, ports 9420/9222-9250/9300-9400) |
