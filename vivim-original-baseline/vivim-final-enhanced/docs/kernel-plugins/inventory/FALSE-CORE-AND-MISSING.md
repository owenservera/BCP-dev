# False CORE Candidates + Missing Kernel Primitives

> **Companion to `ATOMIC-INVENTORY-v3.md`.** Two complementary sections from the forensic reclassification. **FALSE CORE CANDIDATES** lists every subsystem in the *prior* proposal that was labeled CORE but should be elsewhere (ranked by severity, with migration impact). **MISSING KERNEL PRIMITIVES** lists kernel-mechanisms the *current* codebase has not actually defined as stable contracts but should have, if the success statement is to become true in code.

---

# Part 1 — FALSE CORE CANDIDATES

A "false CORE candidate" is a subsystem the prior proposal labels CORE but the forensic reclassification says is K1 (first-party), K2 (plugin surface), or DEFERRED. Ranked by severity.

## CRITICAL — these are the "this is VIVIM-as-its-own-plugin" requirements

### F-CRITICAL-1 — `src/engines/capability-taxonomy.ts:25` `CAPABILITY_TAXONOMY_V2` (60 entries) → **K1 `plugin:canon-nlcl`**

**Why false CORE:** The taxonomy is VIVIM's product vocabulary (`cap:conversation:send_message`, `cap:document:read`, etc.). A third-party plugin author writing a Discord plugin does not need any of these; they need their own. The *shape* `CapabilityTaxonomyEntry` is kernel; the *content* is product.

**Code evidence:** `src/engines/capability-taxonomy.ts:25-60` (60 entries like `cap:conversation:send_message`, `cap:document:read`, `cap:media:play`, ...).

**Migration impact:** Move the file from `src/engines/` to `plugins/core/plugin-canon-nlcl/src/capability-taxonomy.ts` (or equivalent) and update 30+ importers.

---

### F-CRITICAL-2 — All 200 Prisma models in `prisma/system/schema.prisma` (110) + `prisma/user/schema.prisma` (90) → **mostly K1, ~15 K0**

**Why false CORE:** The "200-table schema" being labeled CORE is a smokescreen. The kernel data model is **Node** + **NodeVersion** + **NodeAlias** + **NodeEdge** + **SchemaMeta** + **Registry/Topology/Audit/Provenance** (the observability kernel's tables) + **PluginRegistry** + **SandboxAudit** + **EventRecord**. Everything else — `Conversation`, `EpisodicMemory`, `DiscordVoiceState`, `NotionPageMeta`, `WorkflowDefinition`, `AutonomousTask`, `McpTool`, `StealthPolicy`, `ProviderManifestVersion`, `CapabilityTelemetry`, `RouteSpec`, `HarnessCheckpoint`, etc. — is a VIVIM first-party or plugin data shape.

**Code evidence:** `prisma/system/schema.prisma` (110 models) + `prisma/user/schema.prisma` (90 models). Per-row: `provider_definition`, `provider_endpoint`, `provider_parser`, `provider_capability`, `provider_config`, `provider_model`, `provider_account`, `provider_stream_config`, `trace_entry`, `capability_taxonomy`, `capability_tier`, `capability_binding`, `provider_override`, `capability_intent`, `capability_program`, `selector_strategy`, `outcome`, `parser_execution_log`, `provider_manifest_version`, `registration_event`, `manifest_drift`, `capability_taxonomy_version`, `binding_status_log`, `program_version_metric`, `provider_health_history`, `capability_telemetry`, `selector_health_history`, `telemetry_summary_daily`, `manifest_change_log`, `telemetry_cycle_log`, `config_entry`, `config_audit`, `harness_checkpoint`, `harness_command`, `repair_session`, `capability_macro`, `mcp_server_config`, `health_tick`, `circuit_breaker_state`, `drift_event`, `fleet_event`, `provider_health`, `automation_schedule`, `automation_run`, `alert_condition`, `alert_event`, `route_spec`, `route_request`, `route_target`, `route_event`, `transfer_pattern`, `transfer_candidate`, `transfer_attempt`, `learning_event`, `rule`, `binding_event`, `failure_classification`, `test_run`, `capability_shape`, `capability_shape_binding`, `provider_archetype`, `provider_shape_binding`, `discovery_session`, `discovery_result`, `mirror_state`, `optimistic_update`, `latency_measurement`, `mirror_snapshot`, `observation_event`, `workflow_definition`, `workflow_node`, `workflow_edge`, `workflow_execution`, `workflow_node_execution`, `workflow_webhook`, `workflow_credential`, `mcp_tool`, `mcp_tool_call`, `routing_preference`, `provider_cost_log`, `provider_latency_log`, `policy_rule`, `kernel_span`, `kernel_provenance`, `kernel_topology`, `kernel_event`, `nlcl_graph_node`, `nlcl_graph_edge`, `stealth_launch_profile`, `stealth_module_profile`, `stealth_policy`, `sandbox_audit`, `health_digest`, `provider_type`, `primitive`, `ui_component`, `workflow_retry_queue`, `workflow_version`, `agent_builder_run`, `run_inbox`, `slot_binding`, `event_record`, `agent_definition`, `command_description`, `provider_onboarding_session`, `discovered_dom_entity`, `protocol_fingerprint`, `parser_candidate`, `parser_test_result`, `web_app_taxonomy`, `taxonomy_generation_run`, `surface_version`, `ai_execution`, `ai_execution_event`, `ai_provider_instance` (system) and `schema_meta`, `vivim_session`, `provider_session`, `profile_session`, `conversation`, `conversation_message`, `collection`, `collection_item`, `message_attachment`, `state_transition`, `session_checkpoint`, `stream_block`, `node`, `node_version`, `node_alias`, `node_edge`, `mirror_state`, `optimistic_update`, `latency_measurement`, `mirror_snapshot`, `observation_event`, `episodic_memory`, `semantic_memory`, `procedural_rule`, `agent_decision_log`, `agent_loop_run`, `agent_step`, `entity`, `entity_mention`, `decision_record`, `pattern_extract`, `topic`, `project`, `conversation_topic`, `import_job`, `memory_embedding`, `mux_session`, `mux_response_row`, `situation_log`, `context_layer_row`, `token_budget_row`, `workspace_mode`, `user_preference`, `plugin_registry`, `memory_curated`, `memory_feedback`, `autonomous_task`, `autonomous_step`, `hitl_gate`, `task_template`, `sync_log`, `sync_peer`, `hpe_session`, `content_unit`, `message_link`, `message_entity`, `memory_link`, `memory_access`, `reflection_log`, `context_budget_config`, `situation_detection`, `user`, `user_onboarding`, `agent_session`, `agent_permission_decision`, `agent_file_edit`, `workspace_backup`, `workspace_template_row`, `entity_container`, `entity_container_membership`, `content_item`, `notification`, `contact`, `contact_identity`, `sync_state`, `media_attachment`, `provider_capability_taxonomy`, `discord_voice_state`, `discord_member_meta`, `slack_channel_meta`, `slack_thread_meta`, `whatsapp_encryption_meta`, `whatsapp_contact_meta`, `reddit_subreddit_meta`, `reddit_post_meta`, `notion_block_meta`, `notion_database_meta`, `notion_page_meta`, `conversation_sync_state`, `conversation_sync_log` (user).

**Migration impact:** In the future, the **storage machinery** (Prisma client, `SchemaMeta`, `MigrationRunner`, dual-DB boundary, `verifySchemaCompat`) is kernel; the **data shapes** are first-party storage. Today all 200 live in the same `prisma/schema.prisma`; the migration splits them into `prisma/kernel/` and `prisma/plugins/*/`.

**The truly kernel models** (from the 200): `SchemaMeta`, `Node`, `NodeVersion`, `NodeAlias`, `NodeEdge`, `PluginRegistry`, `SandboxAudit`, `EventRecord`, `KernelSpan`, `KernelProvenance`, `KernelTopology`, `KernelEvent`, `ConfigEntry`, `ConfigAudit`, `SchemaMeta` — about **15 tables** in the kernel data model. Everything else migrates with its owning plugin.

---

### F-CRITICAL-3 — `src/engines/unified-registry.ts:31` `UnifiedCapabilityRegistry` + all 90+ `build*Caps` builders → **K0 shape / K1 content**

**Why false CORE:** The `Map<slug, UnifiedCapability>` is a kernel primitive; the 90+ `cap:conversation:*`, `cap:document:*`, `cap:media:*` registrations are VIVIM product. The `registerDefaultCapabilities` function in `src/engines/capability-bootstrap/default.ts` is 738 lines because it builds a VIVIM-shaped catalog inline.

**Code evidence:** `src/engines/capability-bootstrap/default.ts:1-50` (imports 11 builder functions), `src/engines/capability-bootstrap/default-caps.ts:1-50` (imports 12 builder helpers), 8 files in `src/engines/capability-bootstrap/`.

**Migration impact:** Split the registry class into a K0 kernel file (`src/kernel/registry/unified-capability-registry.ts`) and the 11 builders into `plugins/core/*/src/caps.ts` files. The bootstrap phase's `registerDefaultCapabilities` call becomes a composition of plugin activations.

---

### F-CRITICAL-4 — `src/engines/conversation-manager.ts` (1165 lines) + `src/engines/nlcl/*` (60 files) + `src/engines/chat-frontend` → **K1 `plugin:chat`**

**Why false CORE:** ConversationManager is VIVIM's chat product. It owns the 8-step send pipeline, the message-identity dedup, the 1165-line send orchestration, the stream-block store integration, the conversation history sync, the topic model. None of this is a kernel mechanism.

**Code evidence:** `src/engines/conversation-manager.ts:1-40` ("orchestrates an 8-step send pipeline. RESOLVE → DERIVE SLAVE → LOCK → ENSURE → SEND → CAPTURE → PARSE → STORE+EMIT") + 60 files in `src/engines/nlcl/`.

**Migration impact:** Largest single move. NLCL is 60 files; the chat plugin is at least 80 files across backend and frontend.

---

### F-CRITICAL-5 — `src/engines/provider-registrar.ts` (in-tree seed data) → **K1 `plugin:providers-api`**

**Why false CORE:** The `PROVIDER_MANIFESTS` array in `seeds/providers/manifests.ts` is VIVIM's catalog — Claude, ChatGPT, Gemini, Discord, Notion, Slack, WhatsApp, Reddit, OpenAI-API, Anthropic-API, OpenRouter. None of this is kernel. The `ProviderRegistrar` *engine* and the `IProviderRegistry` *contract* are K0 (D7).

**Code evidence:** `seeds/providers/manifests.ts:1-50` (9 manifests), `src/engines/provider-registrar.ts:7` ("Seeds provider intel from the canonical in-repo manifests (seeds/providers/manifests.ts) into the DB").

**Migration impact:** Move 9 manifests to `plugins/core/provider-{claude,chatgpt,gemini,discord,notion,slack,whatsapp,reddit,openai-api,anthropic-api,openrouter}/` or to a single `plugin:providers-bundled` that ships them. `provider-registrar.ts` loses its in-tree data dependency.

---

### F-CRITICAL-6 — `src/engines/chrome-governor.ts` (800 lines) + `src/engines/stealth/*` (19 files) + `src/engines/browser-automation/*` (19 files) → **K1 `plugin:providers-browser`**

**Why false CORE:** ChromeGovernor owns the entire browser-automation substrate — CDP proxy, Chrome slave lifecycle, health, watchdog, 800 lines, plus 19 stealth modules, plus 19 browser-automation engines. The *only* kernel-level browser concern is the **iframe host** (`SandboxedNode.tsx`) and the `IRuntimeSupervisor` *contract* (C-11).

**Code evidence:** `src/engines/chrome-governor.ts:1-50` ("ChromeGovernor — single I/O authority for all Chrome interaction. Manages ChromeSlave lifecycle, CDP proxy, trace logging, and health monitoring"), 19 files in `src/engines/stealth/`, 19 in `src/engines/browser-automation/`.

**Migration impact:** Second-largest move. The 19 stealth modules are *especially* first-party product policy (Rule D: "policy is not").

---

### F-CRITICAL-7 — `src/engines/memory-engine.ts` + `src/engines/memory/*` (8 files) + `prisma/user/schema.prisma` EpisodicMemory/SemanticMemory/ProceduralRule/MemoryEmbedding/MemoryCurated/MemoryFeedback/MemoryAccess/MemoryLink → **K1 `plugin:memory`**

**Why false CORE:** Memory is a VIVIM product feature. The FSRS scheduler, the EpisodicMemory model, the embedding integrations, the memory fabric — all are first-party. The kernel has `Node` (universal record); that is what the memory plugin uses.

**Code evidence:** `src/engines/memory-engine.ts:1-50` ("MemoryEngine — episodic, semantic, and procedural memory with learning"), `src/engines/memory/*` (8 files including `memory-fabric.ts`, `memory-oracle.ts`, `memory-warden.ts`, `node-backend.ts`, `skill-scaffolding.ts`, `streaming-context-scrubber.ts`, `background-sync.ts`).

**Migration impact:** Medium. The 8 memory-engine files and the 8 memory-related Prisma models move together.

---

### F-CRITICAL-8 — `src/engines/harness/*` (17 files) + `prisma/system/schema.prisma` `HarnessCheckpoint` + `HarnessCommand` + `RepairSession` + `WorkflowRetryQueue` → **K1 `plugin:canon-harness`**

**Why false CORE:** The harness is VIVIM's browser-automation recipe language. The 17 files include the recipe compiler, the binding status ladder, the circuit breaker adapter, the confidence promotion, the content pipeline adapter, the fleet lifecycle adapter, the health probe adapter, the observability streaming, the timeout guard, the stream capture reconstruct, the harness contract, the harness executor engine, the program schema, the recipe types, the make harness capability. None of this is kernel.

**Code evidence:** `src/engines/harness/harness-executor-engine.ts:1-30` ("The cap-store 'program -> recipe -> CDP injection' boundary. The actual CDP injection happens ONLY inside ChromeGovernor.executeHarnessPlan (Governor Canon)") + 16 sibling files.

**Migration impact:** Large. The harness command registry itself (`harness-command-registry.ts`) is K0 shape (the `HarnessCommandRow` model + the registry class), but the 100+ seeded commands + the executor are K1.

---

### F-CRITICAL-9 — `src/engines/workflow-engine.ts` + `prisma/user/schema.prisma` `WorkflowDefinition`/`Node`/`Edge`/`Execution`/`Webhook`/`Credential` → **K1 `plugin:workflows`**

**Why false CORE:** Workflows are a VIVIM product. The DAG execution, the human-in-the-loop gates, the credentials, the webhooks — all first-party.

**Code evidence:** `src/engines/workflow-engine.ts:1-60` ("WorkflowEngine - execute visual workflow DAGs with human-in-the-loop").

**Migration impact:** Medium. The DAG execution *primitive* could be a kernel contract; the workflow *engine* is product.

---

### F-CRITICAL-10 — `src/engines/agent-builder.ts` + `src/engines/autonomous-execution.ts` + `src/engines/autonomous-planner.ts` + `src/engines/autonomous-replay.ts` + `src/engines/opencode/*` (8 files) + `src/engines/local-agent/*` (2 files) → **K1 `plugin:agents`**

**Why false CORE:** Agent building, autonomous execution, OpenCode bridging, and local-agent execution are VIVIM product. The kernel has no opinion on whether VIVIM should have agents or how.

**Code evidence:** `src/engines/agent-builder.ts:1-50` ("AgentBuilderEngine - agent construction subsystem (human_led + agent_led)"), `src/engines/autonomous-execution.ts:1-30`, 8 OpenCode files, 2 local-agent files.

**Migration impact:** Medium. The execution *kernel* (`src/engines/execution-kernel.ts` — `policy → execute → verify → journal`) stays K0; the agent *engine* moves to K1.

---

## HIGH — significant misattribution

### F-HIGH-1 — `src/engines/parsers/{gemini,claude,chatgpt}-import.ts` → **K1 (provider-specific); SSE parser stays K0**

**Why false CORE:** Provider-specific parsers are not kernel. The generic SSE parser is universal and stays kernel; the gemini/claude/chatgpt parsers move with their owning provider plugin.

**Code evidence:** `src/engines/parsers/` (6 files: `sse-parser.ts`, `gemini-import.ts`, `claude-import.ts`, `chatgpt-import.ts`, `artifact-extractor.ts`, `to-content-parts.ts`).

**Migration impact:** Low (move 4 files; SSE parser stays).

---

### F-HIGH-2 — `src/engines/parsers/artifact-extractor.ts` + `to-content-parts.ts` → **K1 `plugin:chat`**

**Why false CORE:** Artifact extraction (e.g., code blocks, file references) and the part-shape transformer are chat product. The kernel just stores `ContentBlock` (universal shape from `src/schema/streaming.ts`).

**Code evidence:** those 2 files.

**Migration impact:** Low.

---

### F-HIGH-3 — `src/engines/capability-resolution.ts` (3-layer override chain) → **K1 `plugin:providers-api`**

**Why false CORE:** The free/pro/max/enterprise tier chain is VIVIM's product. A third-party plugin author does not need to know about plan tiers.

**Code evidence:** `src/engines/capability-resolution.ts:1-50` ("CapabilityResolutionEngine - resolve capability UI contracts for a provider + plan tier via the 3-layer override chain").

**Migration impact:** Low (move 1 file).

---

### F-HIGH-4 — `src/engines/capability-shape-registry.ts` (shape vocabulary primitive) → **K0 (the types) / K1 (concrete shapes)**

**Why false CORE:** The `CapabilityShape` type is universal. The 30+ concrete shapes VIVIM registers are first-party. The registry class splits the same way `UnifiedCapabilityRegistry` does.

**Code evidence:** `src/engines/capability-shape-registry.ts`; `CapabilityShape`+`CapabilityShapeBinding`+`ProviderShapeBinding` models.

**Migration impact:** Low.

---

### F-HIGH-5 — `src/engines/capability-snapshot.ts` (boot loader) → **K1 `plugin:chat` (or merge with `plugin:providers-api`)**

**Why false CORE:** The boot-time snapshot loader for VIVIM's per-provider bindings is a VIVIM product decision. A third-party plugin loader uses a different mechanism (`activate(ctx)`).

**Code evidence:** `src/engines/capability-snapshot.ts:1-30` ("DB-driven capability execution: boot loader into an in-memory map").

**Migration impact:** Low.

---

### F-HIGH-6 — `src/engines/capability-discovery-loop.ts` → **K1 `plugin:chat`**

**Why false CORE:** Discovery is a product feature (a "smart" loop that finds capabilities across surfaces). A third-party plugin does not need this.

**Code evidence:** `src/engines/capability-discovery-loop.ts`.

**Migration impact:** Low.

---

### F-HIGH-7 — `src/engines/capability-macro.ts` + `capability-composer.ts` + `builtin-capability-wrappers.ts` → **K1 `plugin:chat`**

**Why false CORE:** Macro/composition/wrapping is VIVIM product; the kernel has no opinion on whether chat capabilities should be composable.

**Code evidence:** those 3 files.

**Migration impact:** Low.

---

### F-HIGH-8 — `src/ai/protocol/openai-compatible/*` (7 files) → **K1 `plugin:providers-api`**

**Why false CORE:** The OpenAI-compatible adapter is one specific adapter. The `IProviderAdapter` *contract* is K0 (C-05); the OpenAI-shape *implementation* is VIVIM's choice.

**Code evidence:** `src/ai/protocol/openai-compatible/` (7 files: `adapter.ts`, `auth.ts`, `error-mapper.ts`, `index.ts`, `manifest.ts`, `request-builder.ts`, `stream-parser.ts`).

**Migration impact:** Low (move 1 directory; the auth contract stays, the OpenAI-shape impl moves).

---

### F-HIGH-9 — `src/ai/protocol/simulator-adapter.ts` + `legacy-adapter-wrappers.ts` → **REMOVE (K0)**

**Why false CORE:** A simulator is a test artifact; legacy wrappers around a future-stable API are debt. Both should be deleted; the kernel does not need a "fake provider" in production.

**Code evidence:** those 2 files.

**Migration impact:** Negligible.

---

### F-HIGH-10 — `src/ai/manifests/*` (4 JSON files: openai.json, ollama-v1.json, opencode.json, local-tiny-experts.json) → **K1 `plugin:providers-api`**

**Why false CORE:** Provider manifests are first-party catalog data, not kernel definitions.

**Code evidence:** those 4 files.

**Migration impact:** Low.

---

### F-HIGH-11 — `src/engines/protocol-discovery.ts` + `manifest-inference.ts` + `provider-discovery.ts` + `provider-test-harness.ts` + `cdp-discovery.ts` → **K1 `plugin:providers-browser` (browser) and `plugin:providers-api` (API)**

**Why false CORE:** Discovery is a VIVIM product feature (the on-the-fly provider integration tool).

**Code evidence:** those 5 files.

**Migration impact:** Medium (5 files).

---

### F-HIGH-12 — `src/engines/selector-healer.ts` + `selector-refiner.ts` + `selector-cache.ts` → **K1 `plugin:providers-browser`**

**Why false CORE:** Selector repair is a VIVIM product feature. The kernel has no opinion on whether selectors should self-heal.

**Code evidence:** those 3 files.

**Migration impact:** Low.

---

### F-HIGH-13 — `src/engines/execution-policy.ts` + `src/engines/policy-engine.ts` + `src/engines/consent-engine.ts` + `src/engines/governance-engine.ts` → **K1 `plugin:policy` (Constitution Rule D)**

**Why false CORE:** Per Constitution Rule D, security enforcement is kernel; policy *content* is product. These four files are the content; the *enforcer* (`IPolicyEnforcer` in `src/ai/policy/policy.ts`) is K0.

**Code evidence:** those 4 files; `src/ai/policy/policy.ts:1-50` ("doc2 collapsed 'evaluate candidates' and 'enforce network policy' into one IPolicyEngine. That reads fine until you notice they're different kinds of authority").

**Migration impact:** Medium. P0-2 splits the `IPolicyEnforcer` contract out and moves the 4 product engines to a first-party `plugin:policy`.

---

### F-HIGH-14 — `src/engines/knowledge-extractor.ts` + `knowledge-extractor-continuous.ts` + `knowledge-ingestion.ts` + `knowledge-index-pipeline.ts` + `cross-conversation-synthesis.ts` + `knowledge-envelope.ts` → **K1 `plugin:knowledge`**

**Why false CORE:** Knowledge extraction and synthesis are VIVIM product.

**Code evidence:** those 6 files.

**Migration impact:** Medium.

---

### F-HIGH-15 — `src/engines/situation-detector.ts` → **K1 `plugin:memory` or `plugin:canon-nlcl`**

**Why false CORE:** Situation detection is a VIVIM product feature (a particular heuristic for what the user is doing).

**Code evidence:** `src/engines/situation-detector.ts:1-30` ("SituationDetector - classify user's current task type from message + history").

**Migration impact:** Low.

---

### F-HIGH-16 — `src/engines/cost-optimizer.ts` + `cortex-budget.ts` → **K1 `plugin:cost`**

**Why false CORE:** Cost optimization is a VIVIM product concern. The kernel has `IResourceManager`; the *budget policy* is product.

**Code evidence:** those 2 files.

**Migration impact:** Low.

---

### F-HIGH-17 — `src/engines/contact-engine.ts` + `notification-engine.ts` → **K1 `plugin:contacts` and `plugin:notifications`**

**Why false CORE:** Contacts and notifications are first-party. The kernel has no opinion on what counts as a contact.

**Code evidence:** those 2 files.

**Migration impact:** Low.

---

### F-HIGH-18 — `src/engines/collection-engine.ts` → **K1 `plugin:collections`**

**Why false CORE:** Collections (folders) are a first-party product concept.

**Code evidence:** `src/engines/collection-engine.ts`.

**Migration impact:** Low.

---

### F-HIGH-19 — `src/engines/conversation-history-sync.ts` + `sync-engine.ts` + `sync.ts` + `file-sync.ts` + `crdt-sync.ts` → **K1 `plugin:sync`**

**Why false CORE:** Multi-device sync is a VIVIM product feature.

**Code evidence:** those 5 files.

**Migration impact:** Medium.

---

### F-HIGH-20 — `src/engines/observation-tap.ts` + `src/engines/mirror-engine.ts` → **K1 `plugin:knowledge` (or new `plugin:mirror`)**

**Why false CORE:** Mirror engine + observation tap are a VIVIM product feature for keeping a live view of external state.

**Code evidence:** those 2 files.

**Migration impact:** Low.

---

### F-HIGH-21 — `src/engines/cdp-capability-registrar.ts` → **K1 `plugin:providers-browser`**

**Why false CORE:** The CDP→capability bridge is a VIVIM product decision. The kernel has `IProviderAdapter`; the CDP *binding* is one specific shape.

**Code evidence:** `src/engines/cdp-capability-registrar.ts:1-50` ("Per capability-driven-chat, every CDP command is an atomic capability backed by a registry row. This module turns a discovered CdpMethodDescriptor into a UnifiedCapability").

**Migration impact:** Low.

---

### F-HIGH-22 — `src/engines/safe-eval.ts` (the "denylist" guard) → **REMOVE or strictly sandbox only (K0)**

**Why false CORE:** The file's own header says "HAZARD H9 - denylist is fundamentally incomplete (fail-open). Proper fix is allowlist via safe-expression.ts + quickjs-only sandbox." It is a known-insecure fallback. Today the file's only consumer is `stream-parser.ts` for the DB-backed inline parser. After migration, all parser code runs in `SandboxRunner` (QuickJS); the denylist guard is unnecessary and dangerous.

**Code evidence:** `src/engines/safe-eval.ts:1-15` ("Hazard H9 - denylist is fundamentally incomplete").

**Migration impact:** Low. **P0-3** removes it; the only consumer (parser runtime) becomes 100% QuickJS-sandboxed.

---

### F-HIGH-23 — `src/engines/safe-expression.ts` (AST allowlist) → **K0 (KEEP) but used everywhere**

**Why KEEP:** The AST allowlist is a kernel security primitive. Today only the workflow-compiler and workflow-engine use it (the parser runtime is the only outlier using `safe-eval.ts`). After P0-3, every expression evaluation goes through it.

**Code evidence:** `src/engines/safe-expression.ts` (AST-based, allowlist — security-correct).

**Migration impact:** None (it stays kernel; the migration is to *use* it from more sites).

---

### F-HIGH-24 — `src/engines/event-record-store.ts` (outbox) → **K0 (KEEP)**

**Why KEEP:** The durable outbox is kernel infrastructure.

**Code evidence:** `src/engines/event-record-store.ts`.

**Migration impact:** None.

---

### F-HIGH-25 — `src/engines/audit-trail.ts` + `error-tracker.ts` → **K0 (KEEP)**

**Why KEEP:** Audit + error tracking are kernel observability.

**Code evidence:** those 2 files.

**Migration impact:** None.

---

## MEDIUM — capability / registry / tax subsystems that are first-party

### F-MED-1 — `src/engines/live-capability-registry.ts` → **K0 (KEEP) or REMOVE (duplicate)**

**Why false CORE or duplicate:** If it duplicates `UnifiedCapabilityRegistry`, REMOVE. Otherwise K0 (the in-memory map of `Map<id, capability>` is universal). Code review required.

**Code evidence:** `src/engines/live-capability-registry.ts`.

**Migration impact:** Low.

---

### F-MED-2 — `src/engines/streaming-protocol.ts` + `streaming-response-analyzer.ts` + `streaming-channel-caps.ts` → **K1 `plugin:providers-api` (or `plugin:chat`)**

**Why false CORE:** Response analysis is a VIVIM product concern. The kernel has `IEventBus` for events; how a stream's protocol is detected is first-party.

**Code evidence:** those 3 files.

**Migration impact:** Low.

---

### F-MED-3 — `src/engines/provider-mux.ts` + `messaging-archetypes.ts` → **K1 `plugin:providers-api`**

**Why false CORE:** Provider routing between Claude/ChatGPT/Gemini is VIVIM's product choice. The kernel has `IRouter` (C-08); the *strategies* are first-party.

**Code evidence:** those 2 files.

**Migration impact:** Low.

---

### F-MED-4 — `src/engines/send-capability.ts` + `send-resilience.ts` → **K1 `plugin:chat` (Constitution Rule C — same surface as ConversationManager)**

**Why false CORE:** Per Rule C, VIVIM's send pipeline uses the *same* kernel primitives a third-party plugin would use (`IProviderAdapter`, `IExecutionManager`, `RetryEngine`, `IdempotencyGuard`, `LockManager` — all K0). The wrapper around them is product.

**Code evidence:** those 2 files.

**Migration impact:** Low.

---

### F-MED-5 — `src/engines/observability-streaming.ts` → **K1 `plugin:canon-harness` (or merge with `plugin:ui-panels`)**

**Why false CORE:** The observability stream is a VIVIM product surface; the kernel has `IEventBus`.

**Code evidence:** `src/engines/harness/observability-streaming.ts`.

**Migration impact:** Low.

---

### F-MED-6 — `src/engines/semantic-search.ts` + `embedding-classifier.ts` + `classifier-nli.ts` + `embedding-{minilm,ollama,hf}.ts` → **K0 (interface) / K1 (impl)**

**Why split:** The `EmbeddingProvider` *contract* is kernel (any plugin can use it). The concrete MiniLM/Ollama/HF implementations are first-party.

**Code evidence:** those 5 files.

**Migration impact:** Low (split the interface from the impls).

---

### F-MED-7 — `src/engines/reference-grounding.ts` + `semantic-grounding.ts` + `reflection-log.ts` → **K1 `plugin:memory`**

**Why false CORE:** Grounding + reflection are VIVIM product features.

**Code evidence:** those 3 files.

**Migration impact:** Low.

---

### F-MED-8 — `src/engines/image-gen-bridge.ts` + `connector/*` → **K1 `plugin:tools-image`**

**Why false CORE:** Tool bridges are first-party.

**Code evidence:** those files.

**Migration impact:** Low.

---

### F-MED-9 — `src/engines/agent-decision-log.ts` (provenance writer) → **K0 (shape) / K1 (writes)**

**Why split:** The `AgentDecisionLog` *table* is kernel observability; the *writer* is the agents plugin. Equivalent to A03 (manifest drift).

**Code evidence:** that file; `AgentDecisionLog` model.

**Migration impact:** Low.

---

### F-MED-10 — `src/engines/belief-store.ts` + `trust-score.ts` + `objective-engine.ts` → **K1 `plugin:memory` (or `plugin:agents`)**

**Why false CORE:** Beliefs, trust, and objectives are VIVIM product concepts.

**Code evidence:** those 3 files.

**Migration impact:** Low.

---

### F-MED-11 — `src/engines/user-identity.ts` (User primitive) → **KERNEL (KEEP)**

**Why KEEP:** User identity is a kernel primitive. Move from `src/engines/user-identity.ts` to `src/kernel/identity/` to make the layer explicit.

**Code evidence:** that file.

**Migration impact:** Low (move 1 file).

---

### F-MED-12 — `src/engines/export.ts` + `import.ts` → **K1 `plugin:workspace`**

**Why false CORE:** Export/import is a VIVIM product operation (the kernel has `IPluginContext.storage.scoped()` for raw access; export is convenience).

**Code evidence:** those 2 files.

**Migration impact:** Low.

---

### F-MED-13 — `src/engines/console.ts`-style logging + `src/engines/otel-sink.ts` → **K0 (KEEP)**

**Why KEEP:** Structured logging + OTEL sink is kernel infrastructure.

**Code evidence:** those files.

**Migration impact:** None.

---

### F-MED-14 — `src/engines/encryption.ts` + `db-encryption.ts` → **K0 (KEEP)**

**Why KEEP:** Crypto primitives are kernel.

**Code evidence:** those files.

**Migration impact:** None.

---

### F-MED-15 — `src/engines/idempotency-guard.ts` + `lock-manager.ts` + `retry-engine.ts` → **K0 (KEEP)**

**Why KEEP:** Concurrency primitives are kernel.

**Code evidence:** those files.

**Migration impact:** None.

---

## LOW — already-misattributed but small

### F-LOW-1 — `src/engines/session-caps.ts` → **K1 `plugin:chat`**

**Code evidence:** `src/engines/session-caps.ts:1-30` ("SessionCapabilities").

### F-LOW-2 — `src/engines/objective-engine.ts` → **K1 `plugin:agents`** (already in F-MED-10)

### F-LOW-3 — `src/engines/humanized-interaction.ts` → **K1 `plugin:providers-browser`**

### F-LOW-4 — `src/engines/sla-monitor.ts` + `outcome-tracker.ts` + `registration-auditor.ts` → **K1 `plugin:audit` (H14) + `plugin:sla` (H15) + `plugin:providers-browser` (H08/H11)**

### F-LOW-5 — `src/engines/storage-relocation-engine.ts` → **K0 (KEEP, kernel storage)**

### F-LOW-6 — `src/engines/compaction-manager.ts` + `lifecycle-engine.ts` + `backup-manager.ts` → **K0 (KEEP, kernel storage hygiene)**

### F-LOW-7 — `src/engines/message-identity.ts` → **K0 (KEEP, universal record hash)**

### F-LOW-8 — `src/engines/execution-kernel.ts` → **K0 (KEEP, the execution *primitive* is universal)**

### F-LOW-9 — `src/engines/action-plan*.ts` (3) → **K0 (KEEP, the `ActionPlan` shape is universal)**

### F-LOW-10 — `src/engines/airgap.ts` → **K0 (KEEP)**

### F-LOW-11 — `src/engines/lock-manager.ts` → **K0 (KEEP)**

### F-LOW-12 — `src/engines/config-manager.ts` + `config-universal-surface.ts` → **K0 (KEEP, kernel config machinery)**

### F-LOW-13 — `src/engines/reprogrammability/*` (5 files: contract.ts, registry.ts, mutation-schema.ts, schema/spec.ts, variant-schema.ts) → **K1 `plugin:ui-canvas`**

The `ReprogrammableSurface` contract is VIVIM's UI model; the registry that aggregates them is product. Note this is a *VIVIM-internal* contract, not a kernel contract. (The contract version `CONTRACT_VERSION = 1 as const` is a VIVIM version, not a kernel version.)

### F-LOW-14 — `src/engines/parsers/artifact-extractor.ts` → **K1 (chat)**

### F-LOW-15 — `src/engines/parsers/to-content-parts.ts` → **K0 (universal transform) / K1 (mapping)**

### F-LOW-16 — `src/engines/ai-execution.ts` → **K0 (KEEP, the `AIExecution` events are kernel audit)**

### F-LOW-17 — `src/engines/safe-eval.ts` → **REMOVE (P0-3)** (already in F-HIGH-22)

### F-LOW-18 — `src/engines/safe-expression.ts` → **K0 (KEEP)** (already in F-HIGH-23)

---

# Part 2 — MISSING KERNEL PRIMITIVES

These are kernel-mechanisms the codebase does **not** have as stable, versioned contracts but the success statement (`Vivim is a general-purpose local-first application kernel capable of hosting Vivim itself as a first-party plugin suite, while allowing third-party plugins to use the same stable contracts without modifying the kernel.`) requires. Listed in priority order.

## 1. `IPluginContext` — does not exist (CRITICAL)

**Symptom:** First-party plugins today receive either a `BootstrapContext` (`src/server/bootstrap/context.ts:37`) — 60+ fields of internal state — or, in the agent builder, a raw store. There is no closed, permission-gated `IPluginContext` shape that an external developer could consume.

**Why missing:** The `src/plugin-kernel/permissions.ts` and `src/plugin-kernel/plugin-context.ts` files proposed in the prior `PLAN.md` were never written. The `BootstrapContext` is a kernel-internal mutable bag; an external plugin must never receive it.

**What must be added:** A closed `IPluginContext` (KERNEL-CONTRACTS C-02) with `events`, `storage.scoped()`, `schema.register()`, `capabilities.invoke()`, `sandbox`, `manifest`, `telemetry`. **No `require()` access to other modules. No `globalThis` access. No capability call to anything not in the contract.** This is the "no VIVIM-only fast path" enforcement.

**Migration status:** P0-1.

---

## 2. `contractVersion` field on every kernel contract (CRITICAL)

**Symptom:** The compatibility guarantee is in the constitution but is not enforceable in code. `VIVIM_AI_PROTOCOL` (`src/ai/core/types.ts:18`) is the only versioned contract; every other contract is unversioned.

**What must be added:** A `contractVersion: { major: N; minor: M }` field on:
- `IPluginManager`
- `IPluginContext`
- `IEventBus` (already added in the proposed V2 bus)
- `IProviderRegistry`
- `IModelRegistry`
- `IRouter`
- `IPolicyEnforcer` + `IPolicyEvaluator` (split first)
- `IExecutionManager`
- `IRuntimeSupervisor`
- `IResourceManager`
- `SandboxPolicy`
- `INodeStoreContract`
- `SchemaRegistry`
- `IProviderRegistrar.registerOne()`
- `StorageNamespace` / `MigrationRunner`
- `KernelProvenance` + `KernelEvent`
- `KernelTracer`
- `EncryptionEngine`
- `IProviderStore`
- `StreamParserEngine` + `SandboxRunner`
- branded ID types

**Migration status:** P1 (parallel work, one PR per contract).

---

## 3. `PluginId` is unused at runtime (HIGH)

**Symptom:** `PluginId` is defined in `src/ai/core/types.ts:48` but no plugin actually receives a `PluginId` — the `PluginManagerImpl` (`src/engines/plugin-system.ts:69`) only stores `ProviderPlugin` keyed by `providerId`, and the `TrustedPluginManager` (`src/ai/plugins/plugin-manager-impl.ts:28`) stores `PluginDescriptor` keyed by `PluginId` but only as a single in-process map.

**Why missing:** The `IPluginContext` does not exist (item 1). The certifier is stubbed (item 4). The whole plugin host is a stub.

**What must be added:** A `PluginId` is **passed into the `activate(ctx)` call** as `ctx.pluginId`. Every audit event carries `pluginId` as a first-class field. The bus checks `event.kind.startsWith('plugin:' + ctx.pluginId + '.')`. The storage scope is `plugin:<pluginId>:*`.

**Migration status:** P0-1.

---

## 4. `IPluginManager.certify()` is a 4-step stub (CRITICAL — security boundary)

**Symptom:** `src/ai/plugins/plugin-manager-impl.ts:96-140` certifier checks: (1) manifest has id/name, (2) integrity hash present, (3) capabilities count. **It does not check**: namespace uniqueness, `permissions ↔ contributes` cross-check, `scriptUrl` origin, `event.type` prefix on sampled emits, schema Zod compiles, activate dry-run, schema prefix collision, OpenAI-shape `auth` method is a registered env var.

**Why missing:** The certification suite is incomplete because the contracts (P-15) are incomplete. This is the security boundary for K2 plugins. **Until this is real, installing a third-party plugin is unsafe.**

**What must be added:** The full P-15 compliance suite (PLUGIN-CONTRACTS §3). Each check is a function returning `{ pass: boolean, reason: string }`. The certifier produces a `report: readonly string[]` with PASS/FAIL/WARN per check.

**Migration status:** P0-1 (must ship before any K2 plugin can be installed).

---

## 5. `IPluginManager.discover()` and `install()` are stubs (CRITICAL — security boundary)

**Symptom:** `src/ai/plugins/plugin-manager-impl.ts:35-50` both throw "not yet implemented (C4 phase 1)".

**What must be added:** A real `PluginHost` (per the prior `PLAN.md` P0-1) that:
- Extracts the archive to `tmpdir()/vivim-plugin-staging/install-<ulid>`.
- Computes the sha256 (already exists at `plugin-router.ts:20`).
- Parses the manifest with `PluginManifestSchema` (P-01).
- Runs the certifier (item 4).
- If certify passes, promotes the staging dir to `plugins/<id>/` and writes the `PluginRegistry` row.
- Registers each contribution through the per-axis registry (schema → `SchemaRegistry.register(..., { caller: { pluginId } })`; services → `IProviderRegistry.register()`; ui → `UiComponentStore.create()`).
- Constructs `IPluginContext` and calls `plugin.activate(ctx)`.
- Emits `plugin:installed` on `IEventBus`.

**Migration status:** P0-1. **Unifies the existing real `plugin-router.ts:100-431` HTTP path with the stubbed `plugin-manager-impl.ts:35-50` path** — that is the only way to have a single install surface.

---

## 6. `IPluginContext.storage.scoped()` does not exist (CRITICAL)

**Symptom:** Plugins today access storage through `BootstrapContext.db` (the `CapStoreDb`), which is a Prisma client — the entire database, with no per-plugin isolation. A malicious plugin can read every user's memory.

**Why missing:** The closed context (item 1) does not exist. There is no per-plugin namespace in the DB layer.

**What must be added:** An `IPluginScopedStore` (KERNEL-CONTRACTS C-02) that:
- Stores rows under a `plugin:<pluginId>:*` key namespace in the existing storage.
- Rejects any operation that touches a key not under that namespace.
- Supports `get/put/delete/list(prefix?)` only — no raw query, no schema drop, no cross-namespace read.

**Implementation:** Wrap `NodeStoreContract` with a key-prefix filter. The `Node` model already has the right shape (`data: unknown` + ACL).

**Migration status:** P0-1.

---

## 7. `IProviderRegistrar.registerOne()` does not exist (HIGH)

**Symptom:** `src/engines/provider-registrar.ts:7` only reads `PROVIDER_MANIFESTS` from the in-tree seed. No runtime path exists for a plugin to add a provider. The `plugin-router.ts:256` `registrar.register(parsedManifest)` exists but is the HTTP path; it reuses the seed-time `register()` method, not a new runtime entry.

**What must be added:** `ProviderRegistrar.registerOne(manifest, { source: 'plugin', pluginId })` alongside `seedAll()` (unchanged) that:
- Sets `provider_definition.pluginId = pluginId` (FK already exists).
- Does the same 7-table upsert as `register()`.
- Does not touch the in-tree seed data.
- Invalidates the in-memory protocol cache (C-07).

**Migration status:** P0-2.

---

## 8. Provider protocol cache is not in-memory (HIGH)

**Symptom:** `src/engines/provider-protocol-generator.ts` reads the DB into a generated static file `src/__generated__/provider-protocol.ts` and assumes a rebuild. A plugin installed after the process starts is not queryable until restart.

**Why missing:** No runtime cache; D7 in the prior plan flagged this.

**What must be added:** An in-memory `Map<providerId, Protocol>` rebuilt on `registerOne`/uninstall, and read by the AI gateway's data plane first (disk second as a snapshot for cold boot). The generator file becomes a snapshot.

**Migration status:** P0-2.

---

## 9. `SchemaRegistry.register()` does not accept a `caller` parameter (HIGH)

**Symptom:** `src/schema/node.ts:207` `class SchemaRegistry` is `Map<NodeType, NodeSchema>` with `register/get/has/all/validate/indexContent/embeddingText`. The `register()` method takes `(schema)` — no caller info. Without `caller`, the registry cannot enforce the `plugin:${id}.` prefix.

**What must be added:** `register(schema, opts: { caller: 'boot' | { pluginId: string } })`; if `caller` is a plugin, the stored key is `plugin:${pluginId}.${localType}`. Reject `cap-store.*` for plugin callers. Two plugins with the same local name get different stored keys.

**Migration status:** P2.

---

## 10. `NodeType` is a closed union (HIGH)

**Symptom:** `src/schema/node.ts:56` `NodeType` is 34 string literals. A plugin cannot register a new type without `as any`.

**What must be added:** `type BuiltinNodeType = <the 34 literals>` + `type NodeType = BuiltinNodeType | (string & {})`. Existing `registerAllSchemas()` calls stay typed; new plugin registrations accept strings.

**Migration status:** P2.

---

## 11. `IEventBus.publish` does not enforce plugin-id namespace on event types (HIGH)

**Symptom:** Both V1 and V2 bus implementations allow any `kind` string. A plugin can publish `provider:seeded` and impersonate the kernel.

**What must be added:** `IEventBus.publish(source, kind, ...)`: if `source` is a plugin id (matches the `pluginId` of the calling context), `kind` must start with `plugin:<pluginId>.`. If `source` is `'kernel'`, `kind` may be any of the well-known kernel events.

**Migration status:** P1-3.

---

## 12. `IPolicyEnforcer` is mixed with `IPolicyEvaluator` (HIGH — security boundary)

**Symptom:** `src/ai/policy/policy.ts:40-68` defines `IPolicyEnforcer` (the deny-at-egress primitive) and `IPolicyEvaluator` (the advisory scoring) in the same file. The two are conflated; the enforce path can accidentally return a score.

**What must be added:** Split into two files. `IPolicyEnforcer` returns only `PolicyDecision = { allowed } | { allowed: false, reason, code }`; `IPolicyEvaluator` returns a score. The kernel calls only `IPolicyEnforcer` at egress. The router calls only `IPolicyEvaluator`. Different types, different call sites, different owners (enforcer K0, evaluator K1).

**Migration status:** P0-2.

---

## 13. `HarnessCommandRegistry` has no namespace enforcement (MEDIUM — security boundary) — REVISED post-REASSESSMENT

**Symptom:** `src/engines/harness-command-registry.ts:54` accepts any `commandId` and silently overwrites on collision (the original `register` was last-look-wins). A third-party plugin registering `send_message` would shadow a kernel built-in.

**What must be added (REVISED per REASSESSMENT Gap-7):** the harness command registry *shape* is K0, but the *content* (100+ seeded commands) is K1. The migration splits the file:

- `harness-command-registry.ts` (the `HarnessCommandRegistry` *class* and its core methods) → moves to `src/kernel/harness/registry.ts` (K0). The kernel owns the *registry shape*; the kernel enforces namespace uniqueness.
- `seeds/harness/commands/*.ts` (the 100+ recipe modules) → moves to `plugins/core/canon-harness/commands/*.ts` (K1). First-party recipes are first-party content; they do not live in the kernel.

**The unified registry signature:**

```ts
register(
  commandId: string,
  recipe: HarnessRecipe,
  opts: {
    caller: 'kernel' | { pluginId: string }
  }
): Promise<{ readonly commandId: string; readonly version: number }>
```

**Rules:**

- If `caller` is a kernel caller, the `commandId` is stored as-is.
- If `caller` is a plugin, the stored `commandId` is `<pluginId>.<commandId>` (dot, post-REASSESSMENT). The plugin may NOT self-prefix.
- Reject collisions across the kernel + all installed plugins.
- Reject any `commandId` starting with `cap-store.` for plugin callers.

**Migration status:** Deferred to v2 (when `harness` is enabled for K2). For v1, the registry is K1 (not yet split); the namespace enforcement ships with v2.

**REASSESSMENT reconciliation:** this item was contradicted in the prior `PLUGIN-TRUST-MODEL.md` (which marked the file K0) and the prior `BOUNDARY-MIGRATION-PLAN.md` (which split it as K0 shape / K1 content). The split is now explicit: `harness-command-registry.ts` (the class) is K0; the 100+ seeded commands in `seeds/harness/commands/` are K1 first-party content.

---

## 14. `SandboxPolicy` iframe and QuickJS shapes are not unified (MEDIUM)

**Symptom:** `frontend/src/components/canvas/SandboxedNode.tsx:30-51` defines a `SandboxPolicy` for the iframe host; `src/engines/sandbox-runner.ts:5-16` defines a different shape (`SandboxPermissions`+`SandboxBudget`) for the in-process QuickJS sandbox. Plugins shipping a K3 component need to declare both.

**What must be added:** One `SandboxPolicy` type that covers iframe + QuickJS (KERNEL-CONTRACTS C-13). Render via `SandboxedNode` (iframe) or via `SandboxRunner` (QuickJS) depending on the component's `sandboxBackend` field. The kernel validates the policy at the certifier.

**Migration status:** P1-1.

---

## 15. `scriptUrl` write sites are not kernel-controlled (MEDIUM — security boundary)

**Symptom:** `frontend/src/components/canvas/SandboxedNode.tsx:154-156` allows `scriptUrl` as an HTML attribute. Today the source of `scriptUrl` is not enforced to be a kernel-asset origin; a future plugin contribution could supply any URL.

**What must be added:** A kernel asset store (a single well-known origin, e.g. `/_kernel/plugins/<pluginId>/<assetId>.js`). The certifier validates every `UiGeneratedContribution.scriptUrl` is a URL under that origin. The renderer checks at mount time. The kernel refuses to render if the script's response is not `Content-Type: application/javascript` with the expected `X-Kernel-Asset` header.

**Migration status:** P0-3 (the security review gate in 1.5 + 2.3 from the prior plan).

---

## 16. `vm` sandbox fallback is privileged-by-config (LOW)

**Symptom:** `src/engines/sandbox-runner.ts:36-44` requires `VIVIM_UNSAFE_VM=1` to use the `vm` fallback. This is correct but a stronger guarantee is needed: the `vm` mode should not be selectable at all in a production build.

**What must be added:** Build-time `if (process.env.NODE_ENV === 'production')` check that throws if `VIVIM_SANDBOX_MODE=vm` is set. (Optionally: the `vm` code is dead-code-eliminated in production.)

**Migration status:** P0-3.

---

## 17. `globalThis.__pluginManager` and `require()` lazy imports are architectural debt (HIGH)

**Symptom:** `src/ai/plugins/plugin-manager-impl.ts:162-171` exposes the manager as `globalThis.__pluginManager` and uses `require('../../engines/plugin-system.js')` "to avoid circular deps" (`bootstrap/phases/capabilities.ts:42-48` does the same with `activatePluginManager`). `phases/capabilities.ts:62` also writes to `globalThis.__harnessRepair`.

**Why missing:** These are workarounds for circular deps that the kernel boundary would solve.

**What must be added:** The kernel's `BootstrapContext` threads `PluginHost` (and other engines) through the boot phases. `globalThis.__pluginManager` is deleted. The `require()` hack is replaced with a proper import or with the kernel's DI. The `globalThis` writes are the same pattern in the wrong place.

**Migration status:** P0-1.

---

## 18. `User` model in `prisma/user/schema.prisma:90` is K0 but lives in user DB (MEDIUM)

**Symptom:** Today the `User` table is in the *user* database. The kernel's user identity is in the *user* DB; the *system* DB has the registry/observability tables.

**What must be added:** The dual-DB boundary (`src/storage/db.ts` and `prisma.ts`) is fine as-is. The boundary just needs an explicit test that a fresh kernel boot with no first-party plugin can create a `User` row (Constitution Rule F).

**Migration status:** P2.

---

## 19. `CapabilityEventBus` V1 is a separate class from V2 (MEDIUM)

**Symptom:** Both V1 (`src/engines/capability-event-bus.ts:165`) and V2 (`src/engines/capability-event-bus-v2.ts:46`) are live in production code. The bridge in `src/plugin-kernel/events.ts` is not yet written.

**What must be added:** A one-way V1.emit → V2.publish mirror; the kernel's plugins only ever see V2; V1 is kept alive for legacy engine consumers. The bridge emits `'legacy:<type>'` kinds on V2 so legacy subscribers do not double-fire.

**Migration status:** P0-1 (parallel to the PluginHost implementation).

---

## 20. `PluginManifest` Zod schema with strict `contributes` does not exist (HIGH)

**Symptom:** The current `plugin-router.ts:140-156` parses manifests ad-hoc with `JSON.parse(manifestRaw)` and `(manifest.provider as Record<string, unknown>)?.slug` casts. There is no unified `PluginManifest` Zod schema. A plugin can sneak in unknown fields.

**What must be added:** `PluginManifestSchema` per PLUGIN-CONTRACTS P-01. Strict on `contributes` (unknown keys fail with `Unsupported contribution 'harness' — not yet available`). The schema enforces the `permissions ↔ contributes` cross-check at parse time.

**Migration status:** P0-1.

---

# Total: 20 missing primitives, ranked

| Rank | Item | Migration | P# |
|---|---|---|---|
| CRITICAL | 1. `IPluginContext` | P0-1 | 1 |
| CRITICAL | 4. `IPluginManager.certify()` real | P0-1 | 1 |
| CRITICAL | 5. `IPluginManager.discover()/install()` real | P0-1 | 1 |
| CRITICAL | 6. `IPluginContext.storage.scoped()` | P0-1 | 1 |
| CRITICAL | 17. Remove `globalThis.__pluginManager` + `require()` hacks | P0-1 | 1 |
| CRITICAL | 20. `PluginManifestSchema` strict | P0-1 | 1 |
| HIGH | 2. `contractVersion` on every contract | P1 (parallel) | — |
| HIGH | 3. `PluginId` at runtime | P0-1 | 1 |
| HIGH | 7. `ProviderRegistrar.registerOne()` | P0-2 | 1 |
| HIGH | 8. In-memory protocol cache | P0-2 | 1 |
| HIGH | 9. `SchemaRegistry.register(..., { caller })` | P2 | 1 |
| HIGH | 10. `NodeType` widened | P2 | 1 |
| HIGH | 11. Bus event-type namespace enforcement | P1-3 | 1 |
| HIGH | 12. `IPolicyEnforcer` split from `IPolicyEvaluator` | P0-2 | 1 |
| MEDIUM | 13. `HarnessCommandRegistry` namespace | v2 (H10/J13) | 1 |
| MEDIUM | 14. `SandboxPolicy` iframe+QuickJS unified | P1-1 | 1 |
| MEDIUM | 15. `scriptUrl` kernel-asset origin | P0-3 | 1 |
| MEDIUM | 18. `User` in user-DB: explicit boundary test | P2 | 1 |
| MEDIUM | 19. V1→V2 event bus bridge | P0-1 | 1 |
| LOW | 16. `vm` fallback privileged-by-config | P0-3 | 1 |

**7 items are CRITICAL — block P0-1.** They are the security boundary of plugin installation. Without them, no third-party plugin can be safely installed.

**8 items are HIGH — block specific migration phases** (P0-2, P1, P2).

**4 items are MEDIUM and one is LOW** — cleanups that harden the boundary.
