# Vivim Plugin Trust Model (K0–K4)

> **Companion to `BOUNDARY-CONSTITUTION.md`.** That file defines *where* things live; this one defines *how much* a given component is trusted. Both are normative. Every capability call and every plugin load is resolved through this model. Code-grounded against the current `src/`, `frontend/`, and `seeds/`.

---

## 1. The five tiers (K0–K4)

```
K0 — Kernel                            trusted minimum substrate
K1 — First-party plugin (Vivim)        trusted, runs in host process
K2 — Certified extension plugin        third-party, signed, host process, narrower permission
K3 — Sandboxed UI / component          untrusted render code, iframe + QuickJS, allow-list
K4 — External process / tool           hostile-by-default, only communicates through supervisor
```

**Post-Layer-0 (see `inventory/LAYER-0-INTELLIGENCE.md`):** K0 has a new sub-axis — **K0(L0)**, the deterministic intelligence substrate. K0(L0) is the *mechanism* of the kernel's NLP/CLI/intelligence (the 6-layer pipeline shape, the `ICommandPipeline` interface, the `IEmbeddingProvider` contract, the `IBudgetGuard` shape, the `IIntelligenceRegistry`). The LLM, OpenCode, agents, and the NLCL orchestrator are **K1** (VIVIM product), not K0(L0). The kernel can boot without any of them.

The numbering is the **trust** axis (most-trusted → least-trusted), not the architecture layer axis. Every cross-tier call is mediated by the next-trusted tier.

| Tier | What it can do | What it cannot do | Code-grounded evidence |
|---|---|---|---|
| **K0(L0)** | Hold the deterministic intelligence substrate: the 6-layer pipeline shape, the `ICommandPipeline`, the `IEmbeddingProvider` (TF-IDF default), the `IBudgetGuard` shape, the `IIntelligenceRegistry`. | Hold an LLM dependency, an OpenCode subprocess, an agent loop, or any product-specific policy. The kernel's `kernel.nlcl.llm-fallback` is a *capability* a plugin provides, not a kernel dependency. | `src/engines/nlcl/` (60 files, ~5,000 LOC — split into K0(L0) mechanism + K1 product per `inventory/LAYER-0-INTELLIGENCE.md` §1.2) |

| Tier | What it can do | What it cannot do | Code-grounded evidence |
|---|---|---|---|
| **K0** | Hold the boot sequence, the storage machinery, the IPluginManager, the schema registry, the IEventBus, the iframe host, the sandbox host, the audit/provenance store, the runtime supervisor contract. | Hold VIVIM product state (conversations, memories, Discord tokens, etc.); own product policy; bypass permission checks. | `src/ai/plugins/manager.ts`, `src/engines/kernel/kernel-registry.ts`, `src/engines/sandbox-runner.ts:38`, `src/ai/runtime/supervisor.ts:7`, `src/engines/capability-event-bus-v2.ts:46` |
| **K1** | Implement any product feature as long as it consumes only K0 contracts. Same package path as a third-party plugin would use. Access to the host V8 isolate; can read/write the K1 plugin's own DB rows; can publish/subscribe on the bus. | Reach past a contract; read another plugin's scoped storage; bypass sandbox enforcement. | `src/engines/conversation-manager.ts`, `src/engines/memory-engine.ts`, `src/engines/provider-registrar.ts` (today they are unprivileged; **after migration** they become K1 plugins) |
| **K2** | Same as K1, but loads from a `PluginPackageRef` (tar.gz / registry URI), is integrity-verified, namespaced. Hot-reloadable. | Read/write the host filesystem except through `PluginContext.storage.scoped(pluginId)`; open network sockets except through `IProviderAdapter` or `IExecutionManager`; touch the kernel; spawn OS processes. | `src/ai/plugins/plugin-manager-impl.ts:50` (`install()` — today throws "not yet implemented", after migration real) |
| **K3** | Render the html/css and run the optional `scriptUrl` (kernel-asset origin) in a sandboxed iframe; call allowed host capabilities over `MessageChannel`; emit `SandboxAuditEvent`. | Touch the host DOM; call host APIs except through the allow-list; read another plugin's storage. | `frontend/src/components/canvas/SandboxedNode.tsx:19`, `:103`, `:240`, `:268`; `src/engines/sandbox-runner.ts`; `src/engines/sandbox-runner-quickjs.ts` |
| **K4** | Run as a separate OS process under the Tauri supervisor; expose a network or unix-socket control plane; report health. | Reach into the host V8; read host env vars except via `IProviderAdapter` auth contract; bypass the supervisor's resource manager (`IResourceManager`). | `src/ai/runtime/supervisor.ts:14-29`, `src/ai/runtime/resources.ts:13-21` |

---

## 2. The full tier map for the current codebase (today's placement; the migration is in `BOUNDARY-MIGRATION-PLAN.md`)

> **Post-REASSESSMENT note:** this table groups by directory. The I-2 deep probe (per REASSESSMENT Gap-2) must produce a **per-file** truth map; the per-directory grouping is intentionally imprecise for directories that mix K0 and K1 files (notably `harness/*`, `parsers/*`, `sandbox-runner*`, `local-agent/*`). See the per-row footnotes for the splits.

| File / area | Today | Should be | Justification |
|---|---|---|---|
| `src/engines/kernel/*` (10 files: kernel-registry, kernel-bootstrap, kernel-context, kernel-provenance, kernel-tracer, oracle-*) | **K0** | **K0** | Pure observability kernel; not the plugin host. Becomes a consumer of plugin-host events, not its replacement. |
| `src/ai/plugins/manager.ts` (`IPluginManager` contract) | **K0** | **K0** | Contract — the only behavioural surface a plugin host exposes |
| `src/ai/plugins/plugin-manager-impl.ts` (`TrustedPluginManager` impl) | **K0** (stubbed) | **K0** (real) | After P0-1 the `discover()/install()` stubs become real; unification with `plugin-router.ts` happens in P0-1 |
| `src/server/plugin-router.ts:100` (HTTP install/uninstall/toggle/upgrade) | **K0** (real but un-unified) | **K0** (thin adapter) | Becomes a thin HTTP adapter over `PluginHost`; lifecycle logic moves to `host.ts` |
| `src/engines/plugin-system.ts:69` (`PluginManagerImpl` — in-process hook registry) | **K0** (latent) | **K1** if/when the hook surface becomes a product feature; otherwise remove (see `MISSING KERNEL PRIMITIVES` §3) | Today nothing in the codebase calls `new PluginManagerImpl` |
| `src/engines/plugin-hot-reload.ts` (file-watcher loader) | **K0** | **K1** (tooling) | Dev-only convenience; not required for kernel boot |
| `src/engines/sandbox-runner*.ts` (QuickJS, vm) | **K0** | **K0** | The only OS-isolation primitive; the `vm` backend is privileged (gated behind `VIVIM_UNSAFE_VM=1`) |
| `frontend/src/components/canvas/SandboxedNode.tsx` | **K0** (UI side) | **K0** (UI side) | The iframe host is kernel; the `allowInlineScript: false` + CSP + `allowCapabilities` + `budgetMs` are kernel enforcements |
| `src/ai/runtime/supervisor.ts` (`IRuntimeSupervisor` contract) | **K0** | **K0** | OS-process boundary contract |
| `src/ai/runtime/resources.ts` (`IResourceManager`, `IResourceMonitor`) | **K0** | **K0** | Resource leasing is kernel, not policy |
| `src/ai/policy/policy.ts` (`IPolicyEnforcer`) | **K0** | **K0** (only the enforcer) | Enforce (deny at network egress) is kernel; `IPolicyEvaluator` (advisory scoring) is first-party |
| `src/ai/core/types.ts` (branded IDs, AI protocol types) | **K0** | **K0** | Pure data types; the only kernel types file outside `shared/` |
| `src/ai/gateway/gateway.ts` (`IVIVIMGateway` contract) | **K0** (contract) | **K0** (contract) | Stable contract; VIVIM and third-party plugins both consume it |
| `src/ai/events/bus.ts` (`IEventBus` contract) | **K0** | **K0** | Cross-tier event surface |
| `src/engines/capability-event-bus-v2.ts` (`CapabilityEventBusV2`) | **K0** | **K0** | Kernel implementation of `IEventBus` |
| `src/engines/capability-event-bus.ts` (`CapabilityEventBus` V1) | **K0** | **K0** (during transition) | Preserved behind bridge per Constitution Rule F |
| `src/engines/unified-registry.ts` (`UnifiedCapabilityRegistry`) | **K0** | **K0** (registry shape) / **K1** (defaults registrations) | The `Map<slug, UnifiedCapability>` is universal; the 90+ default `cap:conversation:*` registrations are first-party |
| `src/engines/capability-bootstrap/*` (8 files) | **K0** | **K1** | All `build*Caps` builders belong to first-party plugins (chat, storage, memory, etc.) |
| `src/engines/capability-taxonomy.ts:25` (`CAPABILITY_TAXONOMY_V2` 60 entries) | **K0** | **K1** | VIVIM's taxonomy is a VIVIM product choice; not a kernel vocabulary |
| `src/engines/conversation-manager.ts` | **K0** | **K1** (`plugin:chat`) | Universal mechanism is the conversation **shape**; the manager itself is a VIVIM first-party implementation |
| `src/engines/memory-engine.ts` + `memory/memory-fabric.ts` | **K0** | **K1** (`plugin:memory`) | Memory is a VIVIM product; the kernel owns the `Node` universal record the memory plugin uses |
| `src/engines/provider-registrar.ts` + `provider-protocol-generator.ts` | **K0** | **K0** (contract) / **K1** (`plugin:providers-api` owns its data) | The `ProviderRegistrar` and the `IProviderRegistry` contract are kernel; the in-tree seed catalogs (`PROVIDER_MANIFESTS`) are first-party data |
| `src/engines/chrome-governor.ts` (CDP, 800 lines) | **K0** | **K1** (`plugin:providers-browser`) | The browser-automation substrate is first-party; the kernel only owns the `IRuntimeSupervisor` it talks to |
| `src/engines/stealth/*` (19 files) | **K0** | **K1** | Stealth is product policy, not kernel enforcement |
| `src/engines/harness-command-registry.ts:54` | **K0** | **K1** (`plugin:canon-harness`) | The registry shape may belong to kernel; the 100+ seeded harness commands are first-party recipes |
| `src/engines/harness/*` (17 files) | mixed | **K0 (registry shape) / K1 (runtime + 100+ seeded recipes)** | REVISED Gap-7: `harness-command-registry.ts` (the class) → K0; the other 16 files (`harness-executor-engine.ts`, `harness-contract.ts`, `recipe-compiler.ts`, etc.) → K1 (`plugin:canon-harness`). The 100+ seeded commands in `seeds/harness/commands/` are K1 content. The registry's namespace enforcement is v2 (per P-1-3 + `FALSE-CORE-AND-MISSING.md` item 13). |
| `src/engines/workflow-engine.ts` | **K0** | **K1** (`plugin:workflows`) | Workflow is VIVIM product |
| `src/engines/agent-builder.ts` | **K0** | **K1** (`plugin:agents`) | Agent construction is VIVIM product |
| `src/engines/autonomous-execution.ts` + `autonomous-planner.ts` + `autonomous-replay.ts` | **K0** | **K1** (`plugin:agents`) | Autonomous execution is VIVIM product |
| `src/engines/execution-policy.ts` + `policy-engine.ts` + `consent-engine.ts` + `governance-engine.ts` | **K0** | **K1** (policy content); K0 keeps the `IPolicyEnforcer` enforcement primitive | Constitution Rule D |
| `src/engines/cost-optimizer.ts` | **K0** | **K1** | Cost tracking is a VIVIM product concern, not a kernel enforcement |
| `src/engines/situation-detector.ts` | **K0** | **K1** | Situation detection is a VIVIM product feature |
| `src/engines/knowledge-extractor.ts` + `knowledge-extractor-continuous.ts` | **K0** | **K1** (`plugin:knowledge`) | Knowledge extraction is VIVIM product |
| `src/engines/knowledge-ingestion.ts` | **K0** | **K1** | Ingestion is a product operation |
| `src/engines/cross-conversation-synthesis.ts` | **K0** | **K1** | Synthesis is VIVIM product |
| `src/engines/context-assembly.ts` | **K0** | **K0** (5-stage pipeline mechanism) / **K1** (budget + priority policies live in `plugin:memory`) | The DETECT→RECALL→RANK→BUDGET→INJECT *pipeline* is universal; the *policy* is product |
| `src/engines/provider-mux.ts` | **K0** | **K1** | Routing between providers is a VIVIM product choice |
| `src/engines/provider-health.ts` (`ProviderHealthKernel`) | **K0** | **K0** (aggregation mechanism) / **K1** (the VIVIM health view) | The 6-signal weighted score mechanism is universal; the `HealthDashboard.tsx` panel is first-party |
| `src/engines/telemetry-aggregator.ts` | **K0** | **K0** (reprogrammable aggregation pipeline) | The mechanism is universal; operators define schedules; the schedules are first-party config |
| `src/engines/selector-healer.ts` + `selector-refiner.ts` + `selector-cache.ts` | **K0** | **K1** (`plugin:providers-browser`) | DOM selector repair is VIVIM product, not kernel |
| `src/engines/semantic-search.ts` + `embedding-*` (4) | **K0** | **K0** (interface) / **K1** (concrete embeddings) | The `EmbeddingProvider` contract is kernel; the concrete MiniLM/Ollama/HF impls are first-party |
| `src/engines/protocol-discovery.ts` + `manifest-inference.ts` + `provider-discovery.ts` + `provider-test-harness.ts` + `cdp-discovery.ts` | **K0** | **K1** | Discovery is VIVIM product (browser/manifest inference) |
| `src/engines/nlcl/*` (60 files — engine, intent resolvers, command executors, catalog) | **K0** | **K1** (`plugin:canon-nlcl`) | NLCL is VIVIM product — the natural-language command layer |
| `src/engines/automation/*` (orchestrator) | **K0** | **K1** (`plugin:workflows`) | Automation is VIVIM product |
| `src/engines/safe-eval.ts` + `safe-expression.ts` | **K0** | **K0** | Expression evaluation safety is a kernel security primitive; `safe-eval.ts` header explicitly says "Guard for the remaining `new Function()` evaluation site... hazard H9 - denylist is fundamentally incomplete" — must migrate to AST |
| `src/engines/encryption.ts` + `db-encryption.ts` | **K0** | **K0** | Crypto primitives are kernel |
| `src/engines/message-identity.ts` | **K0** | **K0** | SHA-256 message identity is kernel; `ConversationManager` uses it but does not own it |
| `src/engines/idempotency-guard.ts` + `lock-manager.ts` + `retry-engine.ts` | **K0** | **K0** | Concurrency primitives are kernel; their *policy* (window, timeout) is configuration |
| `src/engines/lifecycle-engine.ts` + `compaction-manager.ts` + `backup-manager.ts` | **K0** | **K0** (kernel storage machinery) | TTL sweep, VACUUM scheduling, and backup are kernel storage hygiene |
| `src/engines/execution-kernel.ts` | **K0** | **K0** | The `policy → execute → verify → journal` lifecycle manager is kernel; today it explicitly says "no second capability registry" and "no secret values in journal events" |
| `src/engines/action-plan*.ts` (3) | **K0** | **K0** | The `ActionPlan` shape is kernel; concrete plans are first-party |
| `src/engines/event-record-store.ts` (`EventRecord` model) | **K0** | **K0** | Durable outbox is kernel |
| `src/engines/storage-relocation-engine.ts` | **K0** | **K0** | Storage migration tool is kernel |
| `src/engines/collection-engine.ts` | **K0** | **K1** (moves to first-party) | Collection is a VIVIM product concept (foldering) |
| `src/engines/conversation-history-sync.ts` + `sync-engine.ts` + `sync.ts` + `file-sync.ts` + `crdt-sync.ts` | **K0** | **K1** (moves to first-party) | Multi-device sync is a VIVIM product feature |
| `src/engines/contact-engine.ts` + `notification-engine.ts` | **K0** | **K1** (moves to first-party) | Contact/notification is product |
| `src/engines/connector/*` (image-gen, export, etc.) | **K0** | **K1** (or REMOVE) | Tool bridges are first-party |
| `src/engines/audit-trail.ts` | **K0** | **K0** | Audit guarantee is kernel |
| `src/engines/error-tracker.ts` | **K0** | **K0** | Error tracking is kernel infrastructure |
| `src/engines/config-manager.ts` + `config-universal-surface.ts` | **K0** | **K0** | Config schemas, scoping, audit are kernel machinery; concrete config values are first-party |
| `src/engines/unified-registry.ts` (registry shape) | **K0** | **K0** (shape) | `Map<slug, T>` is universal; the 90+ first-party registrations are K1 |
| `src/engines/capability-resolution.ts` (3-layer override chain) | **K0** | **K1** | The override chain is a VIVIM product choice (free/pro/max/enterprise) |
| `src/engines/capability-shape-registry.ts` | **K0** | **K0** (shape vocabulary primitive) | Shape primitives are kernel; concrete shapes are first-party |
| `src/engines/capability-discovery-loop.ts` | **K0** | **K1** (or REMOVE if unused) | Discovery is product, not kernel mechanism |
| `src/engines/live-capability-registry.ts` | **K0** | **K0** (or REMOVE if duplicate) | If it duplicates `UnifiedCapabilityRegistry`, remove; otherwise K0 |
| `src/engines/capability-snapshot.ts` | **K0** | **K1** (boot loader for first-party bindings) | The boot-time loader for VIVIM's per-provider bindings is first-party |
| `src/engines/capability-macro.ts` + `capability-composer.ts` + `builtin-capability-wrappers.ts` | **K0** | **K1** | Composition/wrapping is VIVIM product |
| `src/engines/stream-parser.ts` + `stream-block-store.ts` + `stream-align.ts` | **K0** | **K0** (DB-driven parser loader + storage) | Parser logic is **stored in DB**; the *loader* is kernel; concrete parser `LOGIC_CODE` is first-party (or K2) |
| `src/engines/parsers/*` (sse-parser, gemini-import, claude-import, chatgpt-import, artifact-extractor, to-content-parts) | mixed | **K0 (sse-parser) / K1 (provider-specific; migrate to plugins/providers-*)** | REVISED Gap-7: `sse-parser.ts` (universal protocol) → K0; the 4 provider-specific parsers (`gemini-import.ts`, `claude-import.ts`, `chatgpt-import.ts`) → K1; `artifact-extractor.ts` and `to-content-parts.ts` → K1 (chat-related). |
| `src/engines/parsers/{gemini,claude,chatgpt}-import.ts` + `artifact-extractor.ts` | **K0** (in repo) | **K1** (migrate to `plugin:providers-browser` and `plugin:providers-api`) | Provider-specific; SSE parser stays K0 |
| `src/engines/cdp-capability-registrar.ts` | **K0** | **K1** (`plugin:providers-browser`) | CDP→capability is VIVIM product bridge |
| `src/engines/local-agent/*` (2) | **K0** | **K1** (`plugin:agents`) | Local-agent executor is VIVIM product |
| `src/engines/opencode/*` (8) | **K0** | **K1** (`plugin:agents`) | OpenCode bridge is VIVIM product |
| `src/ai/routing/*` (router + strategies) | **K0** | **K1** (`plugin:providers-api` includes routing) | Provider routing is VIVIM product; the IRouter *contract* is kernel |
| `src/ai/registry/*` (IProviderRegistry, IModelRegistry) | **K0** (contract) | **K0** (contract) | Stable contracts; in-memory registry implementation moves to first-party plugin |
| `src/ai/registry/in-memory-*.ts` | **K0** (impl) | **K1** | In-memory registry implementation is a first-party choice |
| `src/ai/protocol/adapter.ts` (`IProviderAdapter` contract) | **K0** | **K0** | The single behavioural contract a provider integration implements |
| `src/ai/protocol/openai-compatible/*` (7 files) | **K0** | **K1** (`plugin:providers-api`) | The OpenAI-compatible adapter is one specific impl; the contract is kernel |
| `src/ai/protocol/simulator-adapter.ts` + `legacy-adapter-wrappers.ts` + `opencode-adapter.ts` | **K0** | **REMOVE** (simulator) / **K1** (opencode-adapter) | Simulator was a test artifact; opencode-adapter is VIVIM product |
| `src/ai/protocol/manifest.ts` (`OpenAICompatibleManifest` Zod schema) | **K0** | **K0** (interface) / **K1** (impl) | The schema is universal; the OpenAI shape is a VIVIM product choice |
| `src/ai/execution/*` (`IExecutionManager` contract + types) | **K0** | **K0** | Concurrency, queueing, drain-on-uninstall are kernel enforcement |
| `src/ai/execution/in-memory-manager.ts` | **K0** (impl) | **K1** | In-memory impl is first-party |
| `src/ai/runtime/supervisor.ts` | **K0** | **K0** | OS-process boundary is kernel |
| `src/ai/runtime/ts-supervisor.ts` | **K0** (impl) | **K4** boundary | TypeScript-side adapter; the *real* supervisor is a Tauri-side Rust process |
| `src/ai/runtime/in-memory-resource-manager.ts` | **K0** (impl) | **K1** | In-memory resource manager is first-party impl |
| `src/ai/policy/policy.ts` (`IPolicyEnforcer` contract) | **K0** | **K0** | Enforce-at-egress is kernel |
| `src/ai/policy/store-backed-policy.ts` + `default-policy.ts` | **K0** (impl) | **K1** (the concrete policy content) | Per-constitution Rule D: enforcement is kernel, **content is not** |
| `src/ai/tools/*` (orchestrator + tool-orchestrator-impl) | **K0** | **K1** | Tool orchestration is VIVIM product |
| `src/ai/manifests/*` (openai.json, ollama-v1.json, opencode.json, local-tiny-experts.json) | **K0** | **K1** | Catalog is first-party data |
| `src/engines/stream-parser.ts` (`StreamParserEngine` core) | **K0** | **K0** | The chain loader (provider → generic → system) is kernel |
| `src/engines/parsers/sse-parser.ts` | **K0** | **K0** (universal SSE) | The SSE *protocol* is universal; provider-specific parsers are K1 |
| `src/engines/sandbox-runner*.ts` (QuickJS, vm) | **K0** | **K0 (QuickJS) / REMOVE (vm fallback)** | The QuickJS path is the kernel; the `vm` fallback is privileged-by-config (P0-3) and removed in production builds |
| `src/engines/local-agent/*` (2) | **K0** | **K1** (`plugin:agents`) | Local-agent executor is VIVIM product; the harness *agent exec* runtime is K0 (separate file). The split: `local-agent-executor.ts` → K1; the contract in `local-agent-executor.ts:7-9` is K0. |
| `src/engines/parsers/to-content-parts.ts` | **K0** | **K0** (mechanism) / **K1** (mapping) | The transformer is mechanism; the *mapping* is product |
| `frontend/src/components/canvas/InfiniteCanvas.tsx` + `LivingCanvas.tsx` + `CanvasSurface.tsx` + `CanvasNode.tsx` + `CanvasMinimap.tsx` + `quad-tree.ts` + `ConnectionLayer.tsx` | **K0** | **K1** (`plugin:ui-canvas`) | Canvas is a first-party UI plugin |
| `frontend/src/components/canvas/SandboxedNode.tsx` | **K0** | **K0** (the host) | The iframe host is kernel enforcement; the *host* component is the entry point for K3 |
| `frontend/src/components/canvas/UniversalComponentProvider.tsx` + `use-universal-registry.ts` + `use-stream-slot.ts` + `use-resolved-nodes.ts` + `use-canvas-events.ts` | **K0** | **K0** (shape) / **K1** (concrete registry entries in `register-all.ts`) | Same as `UnifiedCapabilityRegistry`: shape is kernel, registrations are first-party |
| `frontend/src/components/canvas/UniversalComponentProvider.tsx` (concrete `registerAllComponents` in `register-all.ts`) | **K0** | **K1** | The 30+ first-party component registrations move to a first-party plugin |
| `frontend/src/components/canvas/cards/*` | **K0** | **K1** (`plugin:ui-cards`) | First-party UI plugin |
| `frontend/src/components/canvas/panels/*` | **K0** | **K1** (`plugin:ui-panels`) | First-party UI plugin |
| `frontend/src/components/canvas/{ThemeProvider,ThemeSettings,WorkspaceSwitcher,PresenceIndicator,VCardMenu,CommandPalette,NotificationsCenter,OnboardingTour,QuickActionsMenu,AgentOverlay,DevConsole,DrawerSystem,EmptyState,ErrorBanner,Toast,Skeleton,HealthDashboard,FleetStatus,ProviderStatusBadges,ProviderSetupWizard,RbacManager,AuditDashboard,TaskManager,AutomationLauncher,SessionControls,StorageSettings,TimeMachinePanel,MutationHistoryPanel,MutationDiffPanel,LayerSwitcher,QuickActionDock,QuickSwitchProvider,StreamStatusPill,StreamingIndicator,TabBar,TabConfig,Panel*,SlidePanel,MobileNav,Brand,BrandButton,UpdateNotification,MainMenu}.tsx` | **K0** | **K1** (`plugin:ui-shell` / `plugin:ui-panels`) | Every one of these is a first-party UI component; kernel has none of them |
| `frontend/src/components/builder/*` (BuilderSurface, CapabilityNode, MutationEdge, SurfaceNode, Toolbar) | **K0** | **K1** (`plugin:ui-builder`) | First-party UI builder |
| `frontend/src/components/chat/*` (Composer, ChatHeader, ChatSidebar, ChatSurface, ChatSlotSurface, ChatSurfaceTabs, MessageBlock, ConversationList, ConversationSearch, DevConsole, HealthDashboard, HealthIndicator, LatencyBreakdown, ThreadHeader, TypingIndicator, UserMenu, WorkspaceSettings, AgentPlanCard, Breadcrumb, CapabilityCatalog, ComposerShell, EmptyState, SendButton, SurfaceContent, SurfaceTabs, TextEntryBox, addons) | **K0** | **K1** (`plugin:chat`) | First-party chat plugin |
| `frontend/src/components/chrome/*` | **K0** | **K1** | First-party UI |
| `frontend/src/components/collections/*` | **K0** | **K1** | First-party |
| `frontend/src/components/memory/*` | **K0** | **K1** | First-party |
| `frontend/src/components/ui/*` (Button, Skeleton, Toast, etc.) | **K0** | **K1** (or K0 if they implement kernel UI; currently they are primitives like Button/Skeleton that are general-purpose — K0 with explicit re-export contract) | See `BOUNDARY-MIGRATION-PLAN.md` P3 — for now leave as K0 with the note that these are *primitives shared with plugin authors via re-export* |
| `frontend/src/engines/*` (canvas-registry, canvas-layer-mounter, canvas-command-executor, plugin-hot-reload, plugin-system, document-engine, document-editor-engine, drawer-engine, media-engine, media-bridge, notification-engine, presence-engine, rbac-engine, route-sync, route-sync-workspace, search-engine, shell-command-engine, template-engine, ui-engine, audit-engine, annotation-engine, automation-builder, agents-builder, adaptive-workspace, structured-logger) | **K0** | **K1** | Mirrors backend: every frontend engine is a VIVIM first-party product. The `plugin-system.ts` / `plugin-hot-reload.ts` are K1 dev tooling |
| `frontend/src/canvas/*` (collaboration, commands, config, export, live-config, persistence, store, templates, types) | **K0** | **K1** (`plugin:ui-canvas`) | First-party UI |
| `frontend/src/sdk/web/*` (use-conversation, use-capability, use-interpret, use-mutation, use-variant, use-provider, use-session, use-conversation-sync, use-health, web-hooks) | **K0** | **K0** (shape) / **K1** (concrete hooks) | SDK is kernel surface for plugins to consume; the concrete hooks in `plugin:chat` are first-party |
| `frontend/src/sdk/*` (define-component, hot-reload, publish, register-slot, use-canvas-component, capability-bus, document-editor-client, drawer-client, unified-io-client, z-layer-client) | **K0** | **K0** (kernel SDK surface) | The *SDK* — what plugin authors call — is kernel |
| `frontend/src/registry/index.ts` (`CapabilityRegistry` for sandbox→prod renderer promotion) | **K0** | **K0** | The `Map<slug, CapabilityRenderer>` is universal; the registrations are K1 |
| `frontend/plugins/sample-plugin/*` + `demo-plugin/*` | **K2** | **K2** | Already first-third-party in shape; good. After migration they load through the real `IPluginManager` |
| `seeds/providers/*.json` (9 manifests) | **K0** | **K1** | First-party catalog data (Discord, Notion, Slack, etc.); not kernel |
| `prisma/system/schema.prisma` (110 models) | **K0** | **K0** (10–15) / **K1** (rest) | See `FALSE CORE CANDIDATES` §1 — most of these tables are VIVIM-specific, not kernel |

---

## 3. The kernel's enforcement primitive surface

These are the actual primitives the kernel uses to enforce tiers. Code-grounded:

### 3.1 Plugin host (K0 enforces K2)
- `IPluginManager` interface — `src/ai/plugins/manager.ts:27-45`
  - `discover(source)`, `install(source)`, `uninstall(pluginId)`, `enable/disable`, `get`, `list`, `certify`
  - Today: `discover`/`install` are stubbed (`plugin-manager-impl.ts:35, 50`) — P0-1 makes them real
  - Atomicity: every install lands in `tmpdir()/vivim-plugin-staging/install-<ulid>` (existing `plugin-router.ts:104` pattern) and is promoted only after success

### 3.2 Permission gate (K0 enforces K1, K2)
- `IPluginContext.permissions: PluginPermission[]` (the proposed `src/plugin-kernel/permissions.ts` to be created)
- `IPolicyEnforcer` — `src/ai/policy/policy.ts` "enforce-at-egress", returns `{ allowed: true } | { allowed: false; reason, code }` — a hard deny is a type-level `AIErrorCode`
- `SandboxPermissions` — `src/engines/sandbox-runner.ts:5-11` (`canFetch[]`, `canReadFile[]`, `canWriteFile[]`, `canUseClipboard`)

### 3.3 Iframe host (K0 enforces K3)
- `<iframe sandbox="allow-scripts">` (no `allow-same-origin`) — `SandboxedNode.tsx:268`
- CSP via `<meta http-equiv>` — `SandboxedNode.tsx:157`
- `allowInlineScript:false` type-level + Zod + render-time strip — `SandboxedNode.tsx:73, 153`
- `allowCapabilities: string[]` allow-list — `SandboxedNode.tsx:103`
- `budgetMs` watchdog — `SandboxedNode.tsx:240`
- `MessageChannel` (not `window.postMessage`) — `SandboxedNode.tsx:220`
- `SandboxAuditEvent` emits to host — `SandboxedNode.tsx:78-84`

### 3.4 Sandbox host (K0 enforces K3)
- `SandboxRunner` (QuickJS-WASM by default) — `src/engines/sandbox-runner.ts:38-55`
- `vm` fallback gated by `VIVIM_UNSAFE_VM=1` and `VIVIM_SANDBOX_MODE=vm` — `src/engines/sandbox-runner.ts:36-44` ("vm fallback is retained only for rollback and is weaker")
- `SandboxBudget { cpuMs, memoryBytes }` — `src/engines/sandbox-runner.ts:13-16`
- `SandboxAuditStore` — every run records `SandboxAuditRow` — `src/storage/contracts/sandbox-audit-store.ts`

### 3.5 Process boundary (K0 enforces K4)
- `IRuntimeSupervisor.startProvider/stopProvider/restartProvider/getHealth/getState` — `src/ai/runtime/supervisor.ts:18-26`
- `IResourceManager.acquire(request)` returning a `ResourceLease` — `src/ai/runtime/resources.ts:27`
- TS-side: `src/ai/runtime/ts-supervisor.ts` is a boundary adapter; the *real* supervisor is the Tauri Rust process
- `IRuntimeSupervisor.resources: IResourceManager` (concrete resource manager is the supervisor's view of GPU/RAM/slot) — `src/ai/runtime/supervisor.ts:28`

### 3.6 Event fabric (K0 — both V2 canonical and V1 legacy)
- `IEventBus` — `src/ai/events/bus.ts:60-79`
- `CapabilityEventBusV2` — envelopes, DLQ, `publishAndWait` — `src/engines/capability-event-bus-v2.ts:46`
- `CapabilityEventBus` V1 — `src/engines/capability-event-bus.ts:165`
- V1 → V2 bridge in `src/plugin-kernel/events.ts` (to be created in P0)

### 3.7 Storage (K0 enforces namespace)
- Prisma client + `CapStoreDb` — `src/storage/db.ts`
- `SchemaMeta` (versioning) — `prisma/system/schema.prisma` line 1
- `MigrationRunner` (data migrations) — `src/storage/migration/`
- `verifySchemaCompat` on boot — `src/server/bootstrap/phases/seeds.ts:21-22`
- Storage contract/impl split — `src/storage/contracts/*` vs `src/storage/impl/*`
- Plugin scoped storage: `PluginContext.storage.scoped(pluginId)` (proposed; backed by a `plugin_<id>_*` namespace in storage)

### 3.8 Audit / Provenance (K0)
- `KernelProvenance` — every load, install, uninstall, capability call recorded — `src/engines/kernel/kernel-provenance.ts`
- `KernelSpan` / `KernelEvent` — `prisma/system/schema.prisma`
- `KernelTracer` — ring buffer + persist threshold — `src/engines/kernel/kernel-tracer.ts:8-23`
- `ExecutionKernel` journal — no secret values in journal events (`src/engines/execution-kernel.ts:13`)

### 3.9 Identity (K0)
- Branded types — `src/ai/core/types.ts:42-49` (`RequestId`, `ProviderId`, `PluginId`, `WorkspaceId`, ...)
- ULID — `src/ids.ts`

---

## 4. Tier-specific rules

### 4.1 K0 (Kernel)
- Imports from K1: **only through the stable contracts** (the kernels' exports)
- Imports from K2: **only through the stable contracts**
- Imports from K3: **only through the iframe host's audit log + MessageChannel**
- Imports from K4: **only through `IRuntimeSupervisor` and `IResourceManager`**
- **Forbidden**: importing from `engines/*` for implementation; using `globalThis.__pluginManager`; using `require()` to break circular deps without the V0 constitution; bypassing the bus to talk to plugins directly; reading/writing plugin data without going through the contract

### 4.2 K1 (First-party plugin)
- Lives in the **host V8 isolate**
- May use the kernel contracts exactly as third parties may
- Has the **same** permission model as K2 (no special privilege; if VIVIM needs more, the kernel is hiding something)
- May declare K1 sub-plugins internally (e.g. `plugin:chat` may contain a smaller `plugin:chat-suggestions` sub-module loaded the same way) — this is fine, it is just composition
- **Forbidden**: importing kernel internals; reaching past contracts; using `globalThis.__pluginManager`; writing to plugin scoped storage of another plugin; bypassing sandbox enforcement for K3 components

### 4.3 K2 (Certified extension plugin)
- Lives in the **host V8 isolate** (same as K1)
- Identical permission model to K1
- **Mandatory**: integrity hash verification at install (`plugin-router.ts:20` `computeFileHash`)
- **Mandatory**: signature/checksum check before any write to disk
- **Mandatory**: namespace enforcement at every registry (today this is missing; P0-2 in the migration adds it)
- **Forbidden**: all of K1's forbidden list; plus modifying kernel code; impersonating K0 in any way; installing without integrity verification

### 4.4 K3 (Sandboxed component)
- Lives in an **opaque-origin iframe** (no `allow-same-origin`)
- Communication only through `MessageChannel`
- Capability calls only through `allowCapabilities` allow-list
- `allowInlineScript:false` enforced at three levels
- `scriptUrl` only from kernel-asset origin (P0-3 in the migration)
- Watchdog enforced by host
- **Forbidden**: touching parent DOM; calling host APIs beyond the allow-list; reading another plugin's storage; bypassing CSP

### 4.5 K4 (External process / hostile-by-default tool)
- Runs as a **separate OS process** under the Tauri supervisor
- Network: only through `IResourceManager`-leased `concurrent-slot`, `vram-mb`, `cpu-cores`, `ram-mb`, `disk-bytes`, `gpu-device`
- Communication: only through the `IProviderAdapter` control plane (HTTP/Unix socket) — `src/ai/protocol/adapter.ts:14-30` "the Supervisor starts the OS process and hands the adapter a `ProviderConnection`. The adapter never spawns or kills processes itself."
- **Forbidden**: any other path into the host V8; reading host env vars; spawning its own OS processes

---

## 5. Tier cross-checks (the rule of one way down)

| From → To | Mediated by | Audit recorded | Failure surface |
|---|---|---|---|
| K0 → K1 | `IPluginContext` factory; `IProviderAdapter.execute()`; `IExecutionManager`; `IRouter` | `kernel:plugin-installed` event; `KernelEvent`; `EventRecord`; `SandboxAudit` | Provider state machine, `PROVIDER_TRANSITIONS` |
| K1 → K0 | Same contracts, in reverse | Same | Same |
| K1 → K1 | Bus `publish` | Bus | DLQ |
| K1 → K2 | Same `IPluginContext`; same `IProviderAdapter` | Same | Same |
| K0 → K2 | `IPluginManager.install()/uninstall()`; `certify()`; `IProviderRegistry.register()` | `plugin:installed`, `plugin:uninstalled`; `kernel:plugin-installed`; `KernelProvenance`; `RegistrationEvent` | `Certify failure → PLUGIN_UNTRUSTED` |
| K1 → K3 | `SandboxPolicy`; `allowCapabilities`; `MessageChannel` | `SandboxAuditEvent` (csp_violation, capability_denied, crash, budget_timeout) | Kill frame; revoke plugin's iframe capability |
| K0 → K4 | `IRuntimeSupervisor`; `IResourceManager`; `IRuntimeSupervisor.resources` | `AIProviderInstance`, `AIExecution` events; resource pressure events | `startProvider` failure, `resource.lease-denied` |
| K4 → K0 | `IProviderAdapter.health`/`listModels`/`initialize`; `IProviderManifest` | `provider.health-changed`; `provider.state-changed` | `IProviderRegistry.setState` validation; `ProviderState` machine |

---

## 6. The compatibility guarantee (numeric)

The kernel commits to the following on every contract:

```
contract@<name>: { major: N, minor: M }
```

A plugin certified against `contract@<name>: { major: N, minor: <=M }` loads on any kernel exposing `contract@<name>: { major: N, minor: >=M' }` where `M' >= M` and the major has not moved.

**Today** the AI protocol has this (`VIVIM_AI_PROTOCOL = { major: 1, minor: 1, version: '1.1' }` — `src/ai/core/types.ts:18`).

**Missing** (see `MISSING KERNEL PRIMITIVES` §2): same versioning for
- `IPluginHost.contractVersion`
- `IPluginContext.contractVersion`
- `SandboxPolicy.contractVersion`
- `IProviderAdapter.contractVersion` (separate from `VIVIM_AI_PROTOCOL`)
- `IExecutionManager.contractVersion`
- `IRouter.contractVersion`
- `IRuntimeSupervisor.contractVersion`
- `IResourceManager.contractVersion`
- `IEventBus.contractVersion`
- `IProviderRegistry.contractVersion`
- `IModelRegistry.contractVersion`
- `INode*` contracts (`NodeStoreContract`, `SchemaRegistry.register()`, etc.)

This is the **only** way "v1 plugins keep working" becomes true in code rather than in a doc paragraph.

---

*Tier is the rule; contracts are the proof; migration is the work.*
