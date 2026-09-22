# Atomic Inventory — What Goes Where (194 rows, product language)

> **How to read:** Each row is one thing a customer can point to. **Layer** says where it lives today / where the plan says it should live. **[DEBATE]** rows are borderline — your call locks them. Anchors are file/model names so an engineer can jump to the code in one search.  
> **Layers:** `CORE` — cannot be disabled, never pluggable. `DEFAULT PLUGIN` — ships with Vivim, on by default, modular (can be disabled/replaced via trusted plugin). `GENERIC` — surface any plugin author can use (manifest `contributes`).  
> **Count:** 194 rows (75 CORE + 84 DEFAULT PLUGIN + 35 GENERIC + 17 DEBATE). Keep this split visible while iterating.  
> **Twin:** `visual/inventory.html` — same rows, filterable (layer / domain / debate / search), exports your notes to JSON.

**Legend:** `[DEBATE]` = boundary is a judgment call, needs lock-in. No tag = confident placement.

---

## How the split was decided

See `RESEARCH-SYSTEM.md` for the repeatable method (185 → raw enumerate → product translate → three-level test). Short version: CORE = "product stops without it", DEFAULT PLUGIN = "user-visible, could be turned off while product still runs", GENERIC = "what a plugin author is allowed to add". The Code column proves each row is not an abstraction — it is a file/model you can open.

---

## Domain A — Boot, Events & System Foundations (18 rows)

*The plumbing the product cannot run without.*

| # | Product sentence | Layer | Code anchor | Note |
|---|------------------|-------|-------------|------|
| A01 | Boot the product in the right order (seeds → stores → knowledge → capabilities → lifecycle) | CORE | `src/server/bootstrap/orchestrator.ts:15`, `phases/*` | 5-phase pipeline today, 738 lines in `capabilities.ts` |
| A02 | Remember how the system booted and what was registered (topology) | CORE | `src/engines/kernel/kernel-registry.ts:15`, `KernelTopology` model | Observability kernel, not the plugin kernel |
| A03 | Know which build/version of schemas and providers is running | CORE | `SchemaMeta`, `CapabilityTaxonomyVersion`, `version-manager.ts` | Drift detection |
| A04 | Publish and subscribe to events inside the product (e.g. "conversation created") | CORE | `capability-event-bus.ts:165` (V1) + `capability-event-bus-v2.ts:46` (V2 bridge) | V2 canonical for kernel (D3) |
| A05 | Durably record every important event so history isn't lost on restart | CORE | `event-record-store.ts`, `EventRecord` model, `RegistrationEvent` | Outbox for replay |
| A06 | Run modules in dependency order and detect circular dependencies | CORE | `src/server/module-registry.ts:59` (Kahn topo sort) | Stays eager in v1 (D6) |
| A07 | Lifecycle hooks — init / start / stop every engine in order | CORE | `module-registry.ts:32` `lifecycle:{init,start,stop}` | |
| A08 | Central configuration (one place for all tunables, audited changes) | CORE | `config-manager.ts`, `ConfigEntry`+`ConfigAudit` | `config-store.ts` contract |
| A09 | Structured logging and tracing every operation | CORE | `src/engines/logger.ts`, `otel-sink.ts`, `KernelSpan`+`KernelProvenance` | `getLogger` (never `console.*`) |
| A10 | Universal IDs and error shapes so every layer speaks the same language | CORE | `src/ids.ts` (ULID), `src/errors.ts` | |
| A11 | Encryption key management (keys, rotation) | CORE | `encryption.ts`, `db-encryption.ts` | Used by A12 |
| A12 | Encrypt sensitive fields at rest (tokens, secrets) | CORE | `db-encryption.ts`, `ProviderAccount` secret fields | |
| A13 | Capability taxonomy — global catalog of what the product can do | CORE | `capability-taxonomy.ts`, `CapabilityTaxonomy`+`CapabilityTier`+`CapabilityBinding` | Not pluggable, but bindings are contributed |
| A14 | Capability discovery loop — find what capabilities exist across surfaces | CORE | `capability-discovery-loop.ts` | **[DEBATE]** — could be DEFAULT PLUGIN if discoverability becomes optional |
| A15 | Native language → capability ("send message to Claude") | CORE | `capability-bootstrap/nl-interpret.ts`, `CapabilityIntent` | Interpreter is CORE; the phrases it matches are DEFAULT PLUGIN contributions |
| A16 | CLI that is a thin shell over capabilities (no second transport) | CORE | `src/cli/*`, `server/index.ts` bootstrap | Human calls capability via CLI/API/UI/MCP — one path |
| A17 | Migrations, backups, restore, and relocation of data | CORE | `src/storage/migration/*`, `backup-manager.ts`, `storage-relocation-engine.ts`, `WorkspaceBackup` | |
| A18 | Air-gapped / offline mode guard | CORE | `airgap.ts` | Product still boots with no network |

---

## Domain B — Data, Storage & Schema (20 rows)

*How the product remembers — the shape of every record.*

| # | Product sentence | Layer | Code anchor | Note |
|---|------------------|-------|-------------|------|
| B01 | Universal record shape (every "thing" in Vivim is a Node with id, type, data, acl) | CORE | `src/schema/node.ts:207` `SchemaRegistry` + `Node`+`NodeVersion`+`NodeAlias`+`NodeEdge` | 19 types today; widened to `plugin:${id}.` in D5 |
| B02 | Define a new kind of thing (e.g. Invoice, Project) with a validated shape | GENERIC | `manifest.contributes.schema[]` → `SchemaRegistry.register()` with prefix | **v1** — Tier A (JSON-validated `data` on Node) |
| B03 | Store plugin data isolated from core types (cannot corrupt core) | GENERIC | `schema-registry.ts` wrapper (Tier B deferred → isolated `plugin_ext` datasource) | **v2** — design-only in v1 |
| B04 | Version every record and read it back at any point in time | CORE | `NodeVersion` model + `node-store.ts` contract | Time travel |
| B05 | Alias / canonicalize identities ("acme" resolves to canonical entity) | CORE | `NodeAlias` model | |
| B06 | Link records with weighted relationships | CORE | `NodeEdge` model (`.weight`) | Graph |
| B07 | Primitives & slots — the vocabulary of UI pieces the product can show | CORE | `shared/conceptual-model.ts` (`PrimitiveScope = cross-type\|family\|provider`), `Primitive`+`ProviderType`+`SlotBinding` | 6-tier precedence is resolution ordering, not scope enum |
| B08 | Content units — split any record into indexable chunks | CORE | `content-unit-decomposer.ts`, `ContentUnit` model | For search/index |
| B09 | Conversations list and ordering | CORE | `Conversation` model + `conversation-store.ts` | Contract; engine is DEFAULT PLUGIN |
| B10 | Messages inside a conversation (with streams and attachments) | CORE | `ConversationMessage` + `MessageAttachment` + `StreamBlock`+`ParserExecutionLog` | |
| B11 | Channels, collections, and channel membership | CORE | `Channel`, `Collection`+`CollectionItem`+`EntityContainer` | |
| B12 | Contacts and identities (who you're talking to) | CORE | `Contact`+`ContactIdentity` + `contact-engine.ts` | |
| B13 | Entities and mentions (auto-extracted people/topics) | CORE | `Entity`+`EntityMention` + `entity-container-engine.ts` | |
| B14 | Notifications, sync state, media attachments | CORE | `Notification`, `SyncState`+`SyncLog`, `MediaAttachment` | |
| B15 | 200-table schema, migrations, and seed truth (not `_prisma_migrations`) | CORE | `prisma/schema.prisma` (200 models) via `bunx prisma db push` | DB-only parser logic invariant |
| B16 | Stream parser logic lives in DB (not in code files), loaded via fallback chain | CORE | `stream-parser.ts` + `parser-store.ts` + `seeds/parsers/harvested/*.ts` (LOGIC_CODE strings) | `ProviderParser.fallbackParserId` chain |
| B17 | Conversation history sync (import / export conversations across installs) | DEFAULT PLUGIN | `conversation-history-sync.ts`, `ImportJob`, `TransferPattern`+`TransferCandidate`+`TransferAttempt` | User-visible feature, pluggable |
| B18 | Workspace presets and templates (shareable starter layouts) | DEFAULT PLUGIN | `workspace-presets.ts`, `WorkspaceTemplateRow` | |
| B19 | Workspace backups and templates (managed by the user) | DEFAULT PLUGIN | `WorkspaceBackup`, `WorkspaceTemplateRow` + `backup-scheduler.ts` | **[DEBATE]** — with A17 if merged |
| B20 | Store contracts — every engine depends on a contract, never the DB directly | CORE | `src/storage/contracts/*.ts` (40+ contracts) | Layer test gate |

---

## Domain C — Security, Trust & Isolation (14 rows)

*What keeps the product and its plugins from breaking each other.*

| # | Product sentence | Layer | Code anchor | Note |
|---|------------------|-------|-------------|------|
| C01 | Plugin sandbox — plugins run in an iframe that cannot touch the product | CORE | `frontend/src/components/canvas/SandboxedNode.tsx:19` (`sandbox="allow-scripts"` opaque origin) | Inline `<script>` stripped, `MessageChannel` bridge, `S92`/`S93` |
| C02 | Content Security Policy for plugin frames (blocks inline scripts, restricts origins) | CORE | `SandboxedNode.tsx:157` CSP meta, `SandboxPolicy.allowInlineScript:false` | Type-level `false` + Zod + render check triple |
| C03 | Allow-list for which capabilities a plugin frame may call | CORE | `SandboxedNode.tsx:103` `sandbox.allowCapabilities` check + `capability_denied` audit | Host-side enforcement |
| C04 | Budget kill-switch — terminate a plugin frame that hangs | CORE | `SandboxedNode.tsx:240` watchdog `budgetMs` + `budget_timeout` audit | |
| C05 | Verify plugin integrity (archive sha256) before installing | CORE | `plugin-router.ts:20` `computeFileHash` + `extractTarGz:47` → `host.ts:discover()` | Moved to `host.ts` in 1.5.2, not duplicated |
| C06 | Certify a plugin before it runs (schema, permission↔contributes, scriptUrl origin) | CORE | `src/ai/plugins/plugin-manager-impl.ts:35` `certify():96` (stub today) → `host.ts:certify()` real | **Security review gate** (1.5 + 2.3) |
| C07 | Permissions for what a plugin may do (network, storage, schema, UI tiers, chrome) | CORE | `src/plugin-kernel/permissions.ts` (`network`, `storage:scoped`, `schema:extend`, `ui:*`, `chrome:control`) | One lattice shared by services + harness |
| C08 | Scoped storage — a plugin can only see its own data | GENERIC | `PluginContext.storage.scoped(pluginId)` + `storage:scoped` permission | |
| C09 | Consent gates before sensitive actions | DEFAULT PLUGIN | `consent-engine.ts` | **[DEBATE]** — could be CORE if consent is product-wide policy |
| C10 | Policy and governance rules (who can do what, when) | DEFAULT PLUGIN | `policy-engine.ts`, `governance-engine.ts`, `PolicyRule` model | **[DEBATE]** — enforcement is CORE, rules are DEFAULT PLUGIN |
| C11 | Audit trail — tamper-evident log of every important change | CORE | `audit-trail.ts`, `RegistrationEvent`+`BindingStatusLog`+`ManifestDrift` | |
| C12 | Stealth / anti-detection modes (when the product drives external sites) | DEFAULT PLUGIN | `stealth-store.ts`, `StealthLaunchProfile`+`StealthModuleProfile`+`StealthPolicy`, `anti-detection.ts` | Browser-automation adjacent |
| C13 | Sync encryption and peer trust (when syncing across devices) | CORE | `sync.ts`+`sync-engine.ts`, `SyncPeer`+`SyncState` | **[DEBATE]** — CORE vs DEFAULT PLUGIN depends on whether multi-device sync ships as default |
| C14 | Budget engine — cost/latency ceilings per operation | DEFAULT PLUGIN | `budget-engine.ts`, `cortex-budget.ts` | |

---

## Domain D — Canvas, Workspace & UI Shell (22 rows)

*The visual product — infinite canvas, panels, slots, and the building blocks shown on it.*

| # | Product sentence | Layer | Code anchor | Note |
|---|------------------|-------|-------------|------|
| D01 | Infinite canvas — pan/zoom world that holds everything | DEFAULT PLUGIN | `frontend/src/components/canvas/InfiniteCanvas.tsx`+`LivingCanvas.tsx`, `quad-tree.ts` | **[DEBATE]** if you consider canvas CORE — but it is disable-able in principle |
| D02 | Canvas surface and layers (background, content, overlays, connection lines) | DEFAULT PLUGIN | `CanvasSurface.tsx`, `CanvasLayerMounter`, `ConnectionLayer.tsx`, `ZLayerPanel.tsx` | |
| D03 | Place anything on the canvas as a draggable/resizable node | DEFAULT PLUGIN | `CanvasNode.tsx`+`SlotNode.tsx`, `ConnectionLayer` | `RegionRect` geometry |
| D04 | Minimap, minimap nodes, and spatial index (find things fast) | DEFAULT PLUGIN | `CanvasMinimap.tsx`, `MinimapNode.tsx`, `quad-tree.ts` | |
| D05 | Panel system — dockable, resizable, themed panels | DEFAULT PLUGIN | `PanelShell.tsx`+`PanelRegistry.ts`+`PanelSplit.tsx`, `TabBar.tsx`, `ZLayerPanel.tsx` | Multiple implementations; registry is CORE shape |
| D06 | Drawer system and slide panels | DEFAULT PLUGIN | `DrawerSystem.tsx`, `SlidePanel.tsx` | |
| D07 | UI slots and registry — every visible UI element has a slot id | CORE | `shared/ui-component.ts:99` `UiComponent`, `frontend/src/shared/universal-registry.ts:127` `register/resolve` | 3 `PrimitiveScope` + 6-tier precedence |
| D08 | User supplies a UI piece (html + css + optional js) for a slot | GENERIC | `manifest.contributes.ui.generated[]` (html/css/scriptUrl) → `UiComponent` row | **v1** — sandboxed |
| D09 | User supplies a fully compiled React component for a slot | GENERIC | `manifest.contributes.ui.compiled[]` → `UniversalComponentRegistry.register()` | **v2** — review-gated, **rejected at certify in v1** |
| D10 | Theme (dark/light, accent, typography) | DEFAULT PLUGIN | `ThemeProvider.tsx`+`ThemeSettings.tsx` | |
| D11 | Workspace switcher, presence avatars (who else is viewing) | DEFAULT PLUGIN | `WorkspaceSwitcher.tsx`, `PresenceIndicator.tsx` | |
| D12 | Change the overall layout (default region per type) | CORE | `ProviderType.regionLayout` in `shared/conceptual-model.ts` | Layout intent is product-level |
| D13 | Panel palette and canvas palette (browse & place available pieces) | DEFAULT PLUGIN | `PanelPalette.tsx`, `CanvasPalette.tsx` | Discovery |
| D14 | Cards (content cards for knowledge, canvas, lists) | DEFAULT PLUGIN | `frontend/src/components/canvas/cards/*` | |
| D15 | Search panel, canvas search, agent search across the product | DEFAULT PLUGIN | `SearchPanel.tsx`, `CanvasSearch.tsx`, `search.ts` | Uses semantic search engine |
| D16 | Quick actions, command palette, notifications center | DEFAULT PLUGIN | `QuickActionsMenu.tsx`, `CommandPalette.tsx`, `NotificationsCenter.tsx` | |
| D17 | Brand, main menu, mobile nav | DEFAULT PLUGIN | `Brand.tsx`, `MainMenu.tsx`, `MobileNav.tsx` | Chrome |
| D18 | Empty states, errors, toasts, skeletons (polished states everywhere) | DEFAULT PLUGIN | `EmptyState.tsx`, `ErrorBanner.tsx`, `Toast.tsx`, `Skeleton.tsx` | |
| D19 | Builder surface — drag to connect capabilities visually | DEFAULT PLUGIN | `builder/BuilderSurface.tsx`+`CapabilityNode.tsx`+`SurfaceNode.tsx` | Visual wiring |
| D20 | Providers UI — setup wizard for connecting Claude/Gemini/etc. | DEFAULT PLUGIN | `ProviderSetupWizard.tsx`, `ProviderStatusBadges.tsx`, `FleetStatus.tsx` | |
| D21 | Per-thing panels: audit dashboard, RBAC manager, templates gallery | DEFAULT PLUGIN | `AuditDashboard.tsx`, `RbacManager.tsx`, `TemplatesGallery.tsx`, `MutationHistoryPanel.tsx` | In `canvas/panels/*` |
| D22 | Plugin tooling that generates UI — scaffolding, hot reload, dev server for plugin authors | GENERIC | `plugin-system.ts`+`plugin-hot-reload.ts`, `frontend/plugins/sample-plugin` fixtures | Tooling, not product UI |

---

## Domain E — Conversations, Providers & Messaging (26 rows)

*Talk to any provider — one unified conversation surface.*

| # | Product sentence | Layer | Code anchor | Note |
|---|------------------|-------|-------------|------|
| E01 | Unified conversations — talk to any provider from one inbox | DEFAULT PLUGIN | `conversation-manager.ts` + `Conversation`+`Collection` models | Ships by default; could be headless |
| E02 | Streamed replies (tokens arrive live, not all at once) | CORE | `stream-parser.ts` (DB logic) + `stream-block-store.ts`+`stream-blocks.ts` shared, `StreamBlock`+`ParserExecutionLog` | Parser logic in DB (invariant) |
| E03 | Capture what providers actually returned, reliably | CORE | `live-capture-engine.ts`, `StreamBlock` pipeline | |
| E04 | Handle sends that fail and retry or tell the user why | DEFAULT PLUGIN | `send-capability.ts`+`send-resilience.ts`, `retry-engine.ts`, `request-queue.ts` | |
| E05 | Typed composer and send button behavior per provider | DEFAULT PLUGIN | `composer-typing.ts`, `provider-selectors.ts`, `conversation-manager.ts` providers contract | |
| E06 | Account and profile per provider (multiple logins per provider) | CORE | `ProviderAccount`+`ProviderSession`+`ProfileSession`, `profile-allocator.ts` (Chrome slaves under `chrome-profiles/<provider>/<account>`) | Profile dir is source of truth, not DB row |
| E07 | Register a provider (endpoints, parsers, capabilities, models, fleet config) | CORE | `provider-registrar.ts:62` `register()`+`seedAll():313` | D7 adds `registerOne` for plugins |
| E08 | Add a new provider (e.g. Mistral, an internal API, a file) without changing core | GENERIC | `manifest.contributes.services[]` `kind:'browser-provider'\|'api-protocol'` → `ProviderRegistrar.registerOne()` + D7 cache | **v1** for `api-protocol`, **v2** for `browser-provider` (needs `chrome:control`) |
| E09 | Discover provider internals automatically (endpoints, DOM selectors) | DEFAULT PLUGIN | `protocol-discovery.ts`, `provider-discovery.ts`, `cdp-discovery.ts`, `manifest-inference.ts` | |
| E10 | Heal broken browser selectors automatically when a provider's UI changes | DEFAULT PLUGIN | `selector-healer.ts`+`selector-refiner.ts`+`selector-cache.ts`+`selector-heal-store.ts`, `SelectorStrategy` | Drift events → auto-repair |
| E11 | Govern real browsers (CDP) — launch, health-check, restart, watchdog | DEFAULT PLUGIN | `chrome-governor.ts`+`cdp-watchdog.ts`+`chrome-governor-resilience.ts`, `FleetEvent`+`ProviderHealth` | Only `ChromeGovernor` touches CDP (Gov Canon) |
| E12 | Human-like interaction (delays, retries, recovery) when driving browsers | DEFAULT PLUGIN | `humanized-interaction.ts`, `execution-policy.ts` | **[DEBATE]** — could be CORE if every browser touch needs it |
| E13 | Multi-provider routing — pick the best provider for the task (cost/latency) | DEFAULT PLUGIN | `provider-mux.ts`, `MuxSession`+`MuxResponseRow`, `RoutingPreference`, `cost-optimizer.ts` | |
| E14 | Conversation history organizer (threads, topics, imports) | DEFAULT PLUGIN | `conversation-organizer.ts`, `knowledge-ingestion.ts`, `ImportJob` | |
| E15 | Cross-conversation synthesis ("summarize what we learned across chats") | DEFAULT PLUGIN | `cross-conversation-synthesis.ts` | |
| E16 | Response analysis (streaming protocol detection, formatting) | DEFAULT PLUGIN | `streaming-protocol.ts`, `streaming-response-analyzer.ts`, `format-classifier.ts` | |
| E17 | Model selection per provider (pick Opus vs Sonnet, Gemini flash, etc.) | DEFAULT PLUGIN | `ProviderModel` rows per provider, `ProviderCapabilityTaxonomy` | |
| E18 | Stream channel capabilities (typing indicators, presence in chat) | DEFAULT PLUGIN | `streaming-channel-caps.ts` | |
| E19 | Session persistence and checkpointing (resume a conversation after restart) | CORE | `session-checkpoint.ts`, `session-lifecycle-manager.ts`, `SessionCheckpoint`, `StateTransition` | Contract is CORE; the resume UX is DEFAULT PLUGIN |
| E20 | Session capabilities (checkout, fork, branch a conversation) | DEFAULT PLUGIN | `session-caps.ts` | |
| E21 | Discord integration (channels, voice states, member metadata) | DEFAULT PLUGIN | `seeds/providers/discord.json`, `DiscordVoiceState`+`DiscordMemberMeta` | **Phase 3.5 proof**: migrated exclusively via plugin path |
| E22 | Slack integration (threads, channel metadata) | DEFAULT PLUGIN | `seeds/providers/slack.json`, `SlackChannelMeta`+`SlackThreadMeta` | |
| E23 | Notion integration (blocks, pages, databases) | DEFAULT PLUGIN | `seeds/providers/notion.json`, `NotionBlockMeta`+`NotionPageMeta`+`NotionDatabaseMeta` | Alternative Phase 3.5 proof |
| E24 | Anthropic API / OpenAI API / OpenRouter (API providers, not browser) | DEFAULT PLUGIN | `seeds/providers/anthropic-api.json`+`openai-api.json`+`openrouter.json` | Via `api_provider` family |
| E25 | WhatsApp + Reddit onramps (protocol fingerprints, discovered DOM) | DEFAULT PLUGIN | `whatsapp.json`, `reddit.json`, `ProtocolFingerprint`, `DiscoveredDomEntity` | |
| E26 | Built-in capability wrappers for "send" etc. | CORE | `builtin-capability-wrappers.ts` | The wrapper shape is CORE; which capabilities exist is data |

---

## Domain F — Memory, Knowledge & Intelligence (22 rows)

*Remember, index, and reason over everything that ever happened.*

| # | Product sentence | Layer | Code anchor | Note |
|---|------------------|-------|-------------|------|
| F01 | Memory — remember across sessions (episodic + semantic + curated) | DEFAULT PLUGIN | `memory-engine.ts`, `EpisodicMemory`+`SemanticMemory`+`MemoryCurated`, `MemoryEmbedding` | FSRS scheduling, indexing pipeline |
| F02 | Memory embeddings and similarity search ("find like this") | DEFAULT PLUGIN | `memory-indexer.ts`+`indexing-pipeline.ts`, `embedding-minilm.ts`+`embedding-ollama.ts`+`embedding-hf.ts`, `MemoryEmbedding` | Search via `semantic-search.ts` |
| F03 | Deep knowledge extraction — turn conversations into structured knowledge | DEFAULT PLUGIN | `knowledge-extractor.ts`+`knowledge-extractor-continuous.ts`, `knowledge-index-pipeline.ts`, `Epi/sod/sod` models | `knowledge-envelope.ts` |
| F04 | Read the felt memory with embeddings | DEFAULT PLUGIN | `knowledge-envelope.ts`, `PatternExtract`, `MemoryFeedback` | |
| F05 | Knowledge ingestion — batch import documents / chats into memory | DEFAULT PLUGIN | `knowledge-ingestion.ts`, `ImportJob` | |
| F06 | Context assembly for the next answer (what memory to include, how much) | CORE | `context-assembly.ts`, `ContextLayerRow`+`TokenBudgetRow`+`ContextBudgetConfig`, `token-budget` | Engine is policy; budget tables are the control plane |
| F07 | Situation detection — what is the user trying to do right now | DEFAULT PLUGIN | `situation-detector.ts`, `SituationDetection`+`SituationLog` | |
| F08 | Reference grounding — cite where a claim came from | DEFAULT PLUGIN | `reference-grounding.ts`, `reflection-log.ts` | |
| F09 | Semantic grounding & search ("find by meaning") | DEFAULT PLUGIN | `semantic-grounding.ts`, `semantic-search.ts`, `embedding-classifier.ts`, `classifier-nli.ts` | |
| F10 | Belief store — what the product believes, how confident | DEFAULT PLUGIN | `belief-store.ts`, `BeliefStore` | **[DEBATE]** — with F01 if memory+beliefs should be one item |
| F11 | FSRS spaced-repetition scheduler for memories | DEFAULT PLUGIN | `fsrs-scheduler.ts` | |
| F12 | Export memories (backup or hand to another Vivim install) | DEFAULT PLUGIN | `memory-export.ts`, `memory-engine.ts` export path | |
| F13 | Mirror engine — keep a live mirror of external state | DEFAULT PLUGIN | `mirror-engine.ts`, `MirrorState`+`MirrorSnapshot`+`OptimisticUpdate`, `ObservationEvent` | With `observation-tap.ts` |
| F14 | Measurement: cost optimizer (tokens vs latency trade-offs) | DEFAULT PLUGIN | `cost-optimizer.ts`, `cortex-budget.ts`, `ProviderCostLog`+`ProviderLatencyLog`+`CostStore` | |
| F15 | Contact & notification engines (people + what to tell them) | DEFAULT PLUGIN | `contact-engine.ts`, `notification-engine.ts`, `Notification`, `AlertCondition`+`AlertEvent` | |
| F16 | Add a new long-lived knowledge source (a new embedding index, a new extractor) without changing core | GENERIC | `manifest.contributes.schema[]` (new NodeTypes like `plugin:${id}.corpus`) + `indexContent` extender | Knowledge plugins extend via schema, not core |
| F17 | Agent decisions log — every autonomous step recorded | CORE | `AgentDecisionLog`, `decision-store.ts` | Provenance for intelligence is CORE |
| F18 | Decision records, topics, projects, pattern extracts (structured intelligence) | DEFAULT PLUGIN | `DecisionRecord`, `Topic`+`ConversationTopic`, `Project`, `PatternExtract` | |
| F19 | Trust scoring — how reliable is a fact or a source | DEFAULT PLUGIN | `trust-score.ts` | |
| F20 | Objective engine — current goals and their decomposition | DEFAULT PLUGIN | `objective-engine.ts` | **[DEBATE]** — objectives feel like product strategy; could be DEFAULT PLUGIN or CORE if objectives drive boot |
| F21 | Classifier NLI + format/content classification | DEFAULT PLUGIN | `classifier-nli.ts`, `format-classifier.ts`, `content-item-engine.ts`, `ContentItem` | |
| F22 | Add a new intelligence processor (a new classifier, scorer, or synthesis pass) | GENERIC | Future `manifest.contributes.features[]` `activationEvents:['onSchema:plugin:${id}.*']` | **v2** — via `feature-registry.ts` |

---

## Domain G — Automation, Workflow, Harness & Tools (20 rows)

*Make the product do things — reliably, repeatably, visibly.*

| # | Product sentence | Layer | Code anchor | Note |
|---|------------------|-------|-------------|------|
| G01 | Workflow engine — define and run multi-step automations | DEFAULT PLUGIN | `workflow-engine.ts`, `WorkflowDefinition`+`WorkflowNode`+`WorkflowEdge`+`WorkflowExecution`+`WorkflowNodeExecution` | With `workflow-compiler.ts` |
| G02 | Workflow credentials and webhooks (integrations) | DEFAULT PLUGIN | `WorkflowCredential`, `WorkflowWebhook` | Secrets-turbo |
| G03 | Automation schedules & runs (cron-like) | DEFAULT PLUGIN | `AutomationSchedule`+`AutomationRun`, `automation-store.ts` | |
| G04 | Agent loop — the product drives itself through a goal | DEFAULT PLUGIN | `agentic-loop.ts`, `agent-loop-store.ts`, `AgentLoopRun`+`AgentStep`, `autonomous-planner.ts` | `agentic/slm.ts` variant |
| G05 | Autonomous replay / planner / execution with HITL gates | DEFAULT PLUGIN | `autonomous-planner.ts`+`autonomous-execution.ts`+`autonomous-replay.ts`, `AutonomousTask`+`HitlGate`+`TaskTemplate` | |
| G06 | MCP servers & clients — connect external tools as capabilities | DEFAULT PLUGIN | `mcp-server-adapter.ts`+`mcp-client-adapter.ts`, `McpServerConfig`+`McpTool`+`McpToolCall` | Default MCP wiring is DEFAULT PLUGIN |
| G07 | Add a new external tool (an MCP server or a new Harness recipe) | GENERIC | `manifest.contributes.services[]` `kind:'mcp-server'` (`network`) / future `kind:'mcp-client'` | **v1** for server, server+client gated together |
| G08 | Harness runtime — execute a browser-harness DAG (compiled recipe) | CORE | `harness-runtime.ts`+`harness-protocol-engine.ts`, `HarnessCheckpoint` | Runtime is CORE; the recipes it runs are.DEFAULT PLUGIN |
| G09 | Harness commands registry — catalog of executable commands | CORE | `harness-command-registry.ts:54`, `HarnessCommand` model | Zero collision guard today |
| G10 | Add a new reusable browser recipe (a Harness command) | GENERIC | Future `manifest.contributes.harness.commands[]` `→ harness-registry.ts → ${pluginId}.` prefix + `chrome:control` | **v2** — designed, not built in v1 |
| G11 | Harness repair — when a recipe breaks, propose and queue a fix | DEFAULT PLUGIN | `harness-repair-engine.ts`+`harness-feedback-coordinator.ts`+`harness-checkpoint.ts`, `RepairSession`+`WorkflowRetryQueue` | |
| G12 | Safe expressions / safe eval for untrusted recipe snippets | CORE | `safe-expression.ts`, `safe-eval.ts`, `sandbox-runner.ts`(+`-quickjs.ts`+`-vm.ts`) | Security boundary, not a feature |
| G13 | Tool orchestration facade (pick and call the right tool for the job) | DEFAULT PLUGIN | `tool-orchestrator-facade.ts`, `tool-use-protocol.ts` | |
| G14 | Add a new native-coded capability (register a capability handler) | GENERIC | Future `manifest.contributes.features[]` `→ ModuleRegistry` inside `capabilities` phase only (ADR 006) | **v2** — `PluginContext` gate, `activationEvents` |
| G15 | Live capability registry — where capabilities live now | CORE | `live-capability-registry.ts` | Registry shape is CORE; entries are contributed |
| G16 | Image generation bridge | DEFAULT PLUGIN | `image-gen-bridge.ts` | External tool hook |
| G17 | Routing / rule / transfer learning (improve routing from experience) | DEFAULT PLUGIN | `router-capability-bridge.ts`, `Rule`, `TransferAccelerator`+`TransferPattern`+`LearningEvent` | |
| G18 | Routing: route specs, requests, targets, events | CORE | `RouteSpec`+`RouteRequest`+`RouteTarget`+`RouteEvent`, `router-store.ts` | Tables are CORE shape |
| G19 | Situation-aware context budgeting for workflows | CORE | `context-assembly.ts` (reuse), `ContextBudgetConfig` | Same as B06 but for workflow context |
| G20 | Build a plugin without writing code — NL → plugin scaffold | GENERIC | `server/plugin-builder-router.ts` + `manifest` tooling + `plugin-system.ts` | **Tooling** surface for generic authors |

---

## Domain H — Health, Observability & Operations (16 rows)

*Know the product is healthy, and heal it when it is not.*

| # | Product sentence | Layer | Code anchor | Note |
|---|------------------|-------|-------------|------|
| H01 | Heartbeat: record and assess health every tick | CORE | `ProviderHealth`+`HealthTick`, `health-store.ts`+`health-digest-store.ts` | Written by `ProviderHealthKernel` |
| H02 | Show health of each provider + overall system health | DEFAULT PLUGIN | `health-digest.ts`, `HealthDigest` model, `HealthDashboard.tsx` | UI + digest is DEFAULT PLUGIN; health tables are CORE |
| H03 | Provider health history (timeline) | CORE | `ProviderHealthHistory` model | |
| H04 | Telemetry aggregates (latency, success/fail, selector hit/miss per capability) | CORE | `telemetry-aggregator.ts`, `CapabilityTelemetry`+`TelemetryCycleLog`+`TelemetrySummaryDaily` | |
| H05 | Selector health over time (hit vs miss) | CORE | `SelectorHealthHistory` model | |
| H06 | Fleet events and circuit breakers (when a browser or slave misbehaves) | CORE | `FleetEvent`+`CircuitBreakerState`, `fleet-supervisor.ts` contract | Only `ChromeGovernor` writes these today |
| H07 | Error tracker — collect, deduplicate, and surface errors | CORE | `error-tracker.ts` | |
| H08 | Drift detection (when an external provider's UI/API diverges) | DEFAULT PLUGIN | `DriftEvent`+`ManifestDrift`, `registration-auditor.ts` | Audit is DEFAULT PLUGIN; the event table is CORE |
| H09 | Manual drift detection | CORE | `ManifestChangeLog`, `ManifestDrift` writer | Contrast: auto is DEFAULT PLUGIN, the record is CORE |
| H10 | Execution: latency measurements per attempt | CORE | `LatencyMeasurement` model | |
| H11 | Registration auditor — check a provider still matches its manifest | DEFAULT PLUGIN | `registration-auditor.ts` | **[DEBATE]** — with H08 if they are one item |
| H12 | Diagnostics oracle (query live topology, events, spans) | CORE | `src/engines/kernel/oracle-*.ts` + `diagnostics/*`, `KernelSpan`+`KernelProvenance`+`KernelTopology`+`KernelEvent` | |
| H13 | Log every binding/program state change with trigger | CORE | `BindingEvent`+`BindingStatusLog`, `ProgramVersionMetric` | |
| H14 | Outcome tracker — did a capability actually achieve what it promised? | DEFAULT PLUGIN | `outcome-tracker.ts`, `Outcome` model | |
| H15 | SLA monitor — warn when a provider misses service expectations | DEFAULT PLUGIN | `sla-monitor.ts` | |
| H16 | Metrics endpoint & aggregations (Prometheus-like) | CORE | `metrics.ts` | **[DEBATE]** — if metrics are only consumed by default-plugin dashboards, could be DEFAULT PLUGIN |

---

## Domain I — Policy, Identity, Billing & Admin (14 rows)

*Who the product is for, what they pay, and who may do what.*

| # | Product sentence | Layer | Code anchor | Note |
|---|------------------|-------|-------------|------|
| I01 | Users, onboarding, and RBAC (who you are, what you may touch) | DEFAULT PLUGIN | `User`+`UserOnboarding`+`UserPreference`, `user-identity.ts`, `RbacManager.tsx` | **[DEBATE]** — User table feels CORE, RBAC UI feels DEFAULT PLUGIN |
| I02 | Costs, pricing, and billing per provider / per operation | CORE | `ProviderCostLog`, `CostStore` tables, `cost-optimizer.ts` consumer is DEFAULT PLUGIN | Shape CORE, policy DEFAULT PLUGIN |
| I03 | Alerting — conditions and alert events | DEFAULT PLUGIN | `AlertCondition`+`AlertEvent`, `alert-store.ts` | |
| I04 | Sync peers and sync logs (multi-device truth) | DEFAULT PLUGIN | `SyncPeer`+`SyncLog`, `sync-engine.ts`+`sync.ts` | **[DEBATE]** — same as C13 multi-device |
| I05 | Stealth policies (per-module/launch profiles) | DEFAULT PLUGIN | `StealthPolicy`+`StealthModuleProfile`+`StealthLaunchProfile` | |
| I06 | Sandbox audits (every isolated execution recorded) | CORE | `SandboxAudit` model, `sandbox-audit-store.ts` | Audit shape is CORE even if audit *viewing* is DEFAULT PLUGIN |
| I07 | HPE sessions (advanced session harness) | CORE | `HpeSession`, `hpe-session-store.ts` | |
| I08 | Protocol inference, fingerprints, parser candidates & test results | DEFAULT PLUGIN | `ProtocolFingerprint`+`ParserCandidate`+`ParserTestResult`+`protocol-loop-parser.ts`, `manifest-inference.ts` | Discovery state; product can run without it |
| I09 | Taxonomies for surfaces, web apps, discovery sessions/results | DEFAULT PLUGIN | `WebAppTaxonomy`, `ProviderArchetype`+`ProviderShapeBinding`, `DiscoverySession`+`DiscoveryResult` | |
| I10 | Capability shapes & shape bindings (match a capability to a surface shape) | CORE | `CapabilityShape`+`CapabilityShapeBinding`+`ProviderShapeBinding`, `capability-shape-registry.ts` | Shapes are CORE vocab |
| I11 | Capability bindings, program versions, binding events (the execution plan) | CORE | `CapabilityBinding`+`CapabilityProgram`+`ProviderOverride`, `BindingEvent` | Plan is CORE; the program that runs is DEFAULT PLUGIN |
| I12 | Inbox, agent definitions, permissions, file edits (agent loop state) | DEFAULT PLUGIN | `RunInbox`+`AgentDefinition`+`AgentPermissionDecision`+`AgentFileEdit`+`AgentSession`+`AgentBuilderRun` | Agent builder runtime |
| I13 | Surfaces versioning (snapshot of UI/route state) | CORE | `SurfaceVersion` model | |
| I14 | Governance, lifecycle, residency, sla, trust, stealth engines | DEFAULT PLUGIN | `governance-engine.ts`, `lifecycle-engine.ts`, `sla-monitor.ts`, `trust-score.ts`, `stealth-*` | Each is a policy engine, not infra |

---

## Domain J — Generic Plugin Surface & Tooling (22 rows)

*What any author may do — the contract the kernel enforces for every plugin.*

| # | Product sentence | Layer | Code anchor | Note |
|---|------------------|-------|-------------|------|
| J01 | Write a manifest that says: I am `acme.foo`, I need `network`, I contribute a page | GENERIC | `src/plugin-kernel/manifest.ts` Zod (strict D2) | Reverse-DNS id + semver + `activationEvents` |
| J02 | Declare which permissions you need and get rejected if you contribute without them | GENERIC | `permissions.ts` lattice + `host.ts:certify()` permission↔contributes gate (defense in depth) | `ui:custom-scripturl` gates `scriptUrl` |
| J03 | Install / enable / disable / uninstall lifecycle (atomic, no partial state) | GENERIC | `host.ts:install()` + staging `tmpdir()/vivim-plugin-staging`, `pluginRouter` thin adapter, `PluginRegistry` model | `uninstall` deletes provider_* + ui_component + pluginRegistry |
| J04 | Hot reload while developing a plugin | GENERIC | `plugin-hot-reload.ts`, `server/observability/*` | Tooling |
| J05 | Package a plugin (tar.gz with integrity hash) and have it verified before install | GENERIC | `host.ts:discover()` (moved `computeFileHash:20`+`extractTarGz:47`), `integrityHash` on `PluginRegistry` | **Security review gate** |
| J06 | Declare a schema entry (new NodeType) | GENERIC | `manifest.contributes.schema[]` → `schema-registry.ts` | **v1** — enforces `plugin:${id}.` inside registry (D5) |
| J07 | Supply html+css for a slot (no scripting) | GENERIC | `manifest.contributes.ui.generated[]` (html/css) + `ui:custom-html-css-only` | Sandboxed |
| J08 | Supply a `scriptUrl` for a slot (scripted but isolated) | GENERIC | Same + `scriptUrl` + `ui:custom-scripturl` + kernel-asset origin check at certify + at write | Double gate, security review |
| J09 | Supply a compiled React component (ships code into the bundle) | GENERIC | Future `manifest.contributes.ui.compiled[]` → `UniversalComponentRegistry.register()` + `ui:compiled-component` | **v2** — **rejected at certify in v1** |
| J10 | Add an API provider adapter (e.g. OpenAI-compatible endpoint) | GENERIC | `manifest.contributes.services[]` `kind:'api-protocol'` + `network` → `ProviderRegistrar.registerOne()` | **v1** |
| J11 | Add an MCP server or client integration | GENERIC | Same `kind:'mcp-server'` (`network`) — client follow-up in same phase | **v1** |
| J12 | Add a browser-driven provider (drive a website as if you were the user) | GENERIC | Future `kind:'browser-provider'` + `network` + `chrome:control` → shared gate with harness | **v2** — rejected in v1 |
| J13 | Add a reusable browser recipe (Harness command) | GENERIC | Future `manifest.contributes.harness.commands[]` + `chrome:control` + `${pluginId}.` prefix | **v2** — same gate as J12 |
| J14 | Add a native-coded capability (handler registered at startup) | GENERIC | Future `manifest.contributes.features[]` → `ModuleRegistry` inside `capabilities` phase (D6) | **v2** — `PluginContext` gate, `activationEvents` |
| J15 | React to events (e.g. "when a new conversation starts, run this") | GENERIC | `PluginContext.events.{on,once,onAny,publish,publishAndWait}` (V2 bridge D3) | One surface for both subscription and emit |
| J16 | Store data scoped to your plugin (cannot read another plugin's or core's data) | GENERIC | `PluginContext.storage.scoped(pluginId)` + `storage:scoped` + `PluginRegistry` isolation | |
| J17 | Declare when to activate (`onStartup`, `onCommand:*`, `onProvider:*`, `onSchema:*`) | GENERIC | `manifest.activationEvents` — `onStartup` acted on in v1, rest parsed→ignored until `feature-registry.ts` v2 | |
| J18 | Validate a manifest and get actionable errors, not silent ignores | GENERIC | `manifest.ts` Zod strict mode: unknown `contributes` keys fail with `Unsupported 'harness' — see adr/002` | Never silently drop |
| J19 | Namespace protection — your capability/command/schema cannot shadow another plugin's or core's | GENERIC | Prefix enforcement inside each registry (`plugin:${id}.` for schema, `${pluginId}.` for harness) — not trusted from plugin | |
| J20 | See everything a plugin did (observability — topology rows, logs, KernelProvenance) | GENERIC | `KernelRegistry.registerEngine()` per plugin (consumer, no structural change) + `KernelProvenance` | Free via existing health UI |
| J21 | Scaffold a plugin from natural language ("build me a Notion archiver") | GENERIC | `server/plugin-builder-router.ts` + future NL→manifest CLI + `manifest` tooling | Tooling |
| J22 | Lint, type-check, and conformance-check a plugin before publishing | GENERIC | Future `plugin lint` CLI (`manifest` + permission + `scriptUrl` origin + schema prefix dry-run) | Tooling |

---

## Totals & How to Lock

- **CORE: 75** (A18 + B12 + C7 + D3 + E6 + F3 + G3 + H10 + I6 + cross-cutting shapes)
- **DEFAULT PLUGIN: 84** (B3 + C3 + D18 + E17 + F17 + G11 + H4 + I6)
- **GENERIC: 35** (B2/C1/D3/E1/F2/G5/J22 — of which 25 are **v1** shippable, 10 are **v2**-flagged)
- **194 total, 17 debate rows** — marked `[DEBATE]` above; resolve each with one of CORE/DEFAULT PLUGIN/GENERIC and a one-line why.

### Iteration lock-in (do this together)

1. Filter to `DEBATE` rows in `visual/inventory.html` and mark each with your call + note (exports JSON).
2. For any non-debate row you disagree with, click it and leave a note (exported).
3. Say "lock revision N" — agent updates `MAP.md` taxonomy, `PLAN.md` per-axis contracts, and `STATUS.md` tracker in one PR, and removes `[DEBATE]` markers per your calls.
4. Re-probe after any refactor: `bun run inventory:probe` (future) regenerates raw list; diff against this doc to catch drift.

### Reading this as a non-engineer (30-second version)

- **CORE** = foundation/plumbing panels you never see but the building needs. No toggle.
- **DEFAULT PLUGIN** = features you *see* (chat, memory, canvas, providers) that ship by default but could be turned off — they just happen to be built using the same machinery plugins use.
- **GENERIC** = what *you* (or any partner) are allowed to build. The manifest says "I contribute X, I need permission Y" and the kernel says yes/no.

If a row is in GENERIC and flagged **v1**, you can build it in the first plugin release. If it says **v2**, it is designed and will be unlockable without breaking v1 plugins.
