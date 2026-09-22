# L3 — File Catalog: `src/engines/` (186 files, clustered)

> One line per file: purpose (from header comment / name semantics) + primary export +
> primary contract import. Sub-folder engines listed after the flat 186.

## Capability family (17)

| File | Purpose | Exports → imports |
|------|---------|-------------------|
| `capability.ts` | Execute capabilities via Governor CDP + recovery chain | `CapabilityEngine, CapabilityExecutionResult, RecoveryStrategy` → `contracts/capability-store`, `capability-event-bus`, `chrome-governor` |
| `capability-binder.ts` | Bind global caps → provider programs, confidence scoring | `CapabilityBinder, BoundCapability` → `contracts/capability-store` |
| `capability-bootstrap.ts` | Seed taxonomy/bindings at boot | `bootstrapCapabilities` → `contracts/capability-store`, seeds |
| `capability-bootstrap-generated.ts` | Generated bootstrap rows (codegen output) | data table → same as above |
| `capability-composer.ts` | Composite (multi-step) capabilities DAG | `CapabilityComposer, CompositeCapability` → own store iface |
| `capability-discovery-loop.ts` | Continuous discovery of new provider caps | `DiscoveryLoop` → `discovery-store`, `provider-discovery` |
| `capability-event-bus.ts` | Legacy event bus (kernel|plugin.* namespace) | `CapabilityEventBus` |
| `capability-event-bus-v2.ts` | Namespaced bus with auto-recording | `CapabilityEventBusV2` → `event-record-store` |
| `capability-macro.ts` | Named macro sequences | `CapabilityMacroEngine` → `contracts` macro rows |
| `capability-parity.ts` | Cross-surface parity checker (cli=ui=api=mcp) | `ParityReport, ParityFinding` |
| `capability-resolution.ts` | Resolve global → best binding/program at runtime | `ResolutionEngine` → `capability-resolution-store` |
| `capability-shape-registry.ts` | Shape (input/output schema) registry | `ShapeRegistry` → `shape-binding-store` |
| `capability-snapshot.ts` | Point-in-time snapshots of registry | `Snapshotter` → `capability-store` |
| `capability-taxonomy.ts` | Taxonomy CRUD + tier gating | `TaxonomyEngine` → `capability-store` |
| `cdp-capability-registrar.ts` | Register CDP methods as atomic capabilities | `CdpRegistrar` → `capability-store`, `chrome-governor` |
| `live-capability-registry.ts` | Hot in-memory registry view | `LiveRegistry` |
| `builtin-capability-wrappers.ts` | Built-in cap shims | wrappers → `capability.ts` |

## Provider / browser family (24)

`api-provider-adapter.ts` (API-direct providers) · `gateway-provider-llm-adapter.ts` (gateway LLM) ·
`local-model-adapter.ts` (on-device) · `provider-registrar.ts` (CRUD + manifest versions) ·
`provider-discovery.ts` · `provider-health.ts` (health scoring → `ProviderHealth`) ·
`provider-mux.ts` (multi-provider fan-out → `MuxSession`) · `provider-caps.ts` (session caps) ·
`provider-selectors.ts` (selector tables) · `provider-conversation-adapter.ts` ·
`provider-test-harness.ts` (8-phase onboarding tester) · `provider-protocol-generator.ts` +
`provider-protocol-loader.ts` (codegen `__generated__/provider-protocol.ts`) ·
`chrome-governor.ts` (**only CDP owner**) · `chrome-governor-resilience.ts` ·
`chrome-setup-wizard.ts` · `cdp-discovery.ts` · `cdp-watchdog.ts` ·
`selector-cache.ts` · `selector-healer.ts` · `selector-refiner.ts` ·
`humanized-interaction.ts` · `anti-detection.ts` · `manifest-inference.ts`.
All read `contracts/provider-store, provider-type-store, governor-store, slave-setup-store, stealth-store, mux-store`.

## Conversation / session / streaming family (18)

`conversation-manager.ts` (session & state) · `conversation-history-sync.ts` ·
`conversation-organizer.ts` · `session-caps.ts` · `session-checkpoint.ts` ·
`session-lifecycle-manager.ts` · `session-state-persistence.ts` · `state-transition.ts` ·
`stream-parser.ts` (DB-only parser logic) · `stream-align.ts` · `stream-block-store.ts` (engine mirroring store) ·
`streaming-protocol.ts` · `streaming-channel-caps.ts` · `streaming-response-analyzer.ts` ·
`message-identity.ts` (dedupe hashes) · `composer-typing.ts` · `task-history.ts` · `mirror-engine.ts`.

## Memory / knowledge / semantic family (20)

`memory-engine.ts` · `memory-export.ts` · `memory-indexer.ts` · `belief-store.ts` ·
`knowledge-envelope.ts` · `knowledge-extractor.ts` · `knowledge-extractor-continuous.ts` ·
`knowledge-index-pipeline.ts` · `knowledge-ingestion.ts` · `indexing-pipeline.ts` ·
`semantic-search.ts` · `semantic-grounding.ts` · `embedding-hf.ts` · `embedding-minilm.ts` ·
`embedding-ollama.ts` · `embedding-classifier.ts` · `classifier-nli.ts` · `format-classifier.ts` ·
`reference-grounding.ts` · `cross-conversation-synthesis.ts`.

## Workflow / autonomous / harness family (26)

`workflow-engine.ts` · `workflow-compiler.ts` · `action-plan.ts` (Zod contract: ActionNode/ActionPlan/RISK_TIER) ·
`action-plan-bridge.ts` · `action-plan-compiler.ts` · `autonomous-execution.ts` · `autonomous-planner.ts` ·
`autonomous-replay.ts` · `autonomous-types.ts` · `agentic-loop.ts` · `agentic-slm.ts` ·
`intent-decomposer.ts` · `objective-engine.ts` · `plan-validation-gate.ts` · `execution-kernel.ts` ·
`execution-memoizer.ts` · `execution-policy.ts` · `harness-runtime.ts` · `harness-protocol-engine.ts` ·
`harness-command-registry.ts` · `harness-checkpoint.ts` · `harness-feedback-coordinator.ts` ·
`harness-repair-engine.ts` · `backup-manager.ts` · `backup-scheduler.ts` · `compaction-manager.ts`.

## Parsing / discovery / tool family (14)

`protocol-discovery.ts` · `protocol-loop-parser.ts` · `discovery-session-runner.ts` ·
`parser-repair.ts` · `live-capture-engine.ts` · `mcp-client-adapter.ts` · `mcp-server-adapter.ts` ·
`tool-use-protocol.ts` · `tool-orchestrator-facade.ts` (facade over `src/ai/tools/*`) ·
`dcb-profile.ts` · `dcb-projector.ts` · `content-unit-decomposer.ts` ·
`browser-action-types.ts` (Zod: BrowserAction/BrowserRef/compactSnapshot) · `send-capability.ts`.

## Resilience / governance / sandbox family (24)

`retry-engine.ts` · `request-queue.ts` · `lock-manager.ts` · `idempotency-guard.ts` · `sla-monitor.ts` ·
`error-tracker.ts` · `governance-engine.ts` · `policy-engine.ts` · `consent-engine.ts` · `trust-score.ts` ·
`audit-trail.ts` · `registration-auditor.ts` · `telemetry-audit.ts` · `loop-detector.ts` · `observation-tap.ts` ·
`health-digest.ts` · `budget-engine.ts` · `cortex-budget.ts` · `cost-optimizer.ts` ·
`sandbox-runner.ts` (facade) · `sandbox-runner-quickjs.ts` (primary) · `sandbox-runner-vm.ts` (legacy) ·
`safe-eval.ts` · `safe-expression.ts` · `event-record-store.ts`.

## Sync / realtime / transfer family (12)

`sync-engine.ts` · `sync.ts` · `notification-engine.ts` · `contact-engine.ts` ·
`content-item-engine.ts` · `entity-container-engine.ts` · `transfer-accelerator.ts` ·
`storage-relocation-engine.ts` · `export.ts` · `router-capability-bridge.ts` ·
`send-resilience.ts` · `session-state-persistence.ts` (also C3).

## Observability family (10)

`logger.ts` · `metrics.ts` · `otel-sink.ts` · `telemetry-aggregator.ts` · `telemetry-audit.ts` ·
`outcome-tracker.ts` · `situation-detector.ts` · `context-assembly.ts` · `health-digest.ts` (also C7) ·
`error-tracker.ts` (also C7).

## Canvas / content / identity family (16)

`canvas-layer-mounter.ts` · `adaptive-workspace.ts` · `workspace-presets.ts` · `collection-engine.ts` ·
`content-unit-decomposer.ts` (also C6) · `content-item-engine.ts` (also sync) · `context-assembly.ts` ·
`image-gen-bridge.ts` · `media-engine.ts` · `messaging-archetypes.ts` · `situation-detector.ts` ·
`update-engine.ts` · `user-identity.ts` · `agent-builder.ts` · `conceptual-model-service.ts` ·
`collection-engine.ts`.

## Config / lifecycle / registry family (12)

`config-manager.ts` · `config-universal-surface.ts` · `lifecycle-engine.ts` · `version-manager.ts` ·
`update-engine.ts` (also canvas) · `plugin-system.ts` · `plugin-hot-reload.ts` · `unified-registry.ts` ·
`eviction-manager.ts` · `db-encryption.ts` · `encryption.ts` · `airgap.ts`.

## Remaining singletons (each observed)

`audit-trail.ts` · `backup-manager.ts` (also harness) · `budget-engine.ts` (also resilience) ·
`composer-typing.ts` · `contact-engine.ts` · `db-encryption.ts` · `eviction-manager.ts` ·
`export.ts` · `fsrs-scheduler.ts` (spaced repetition) · `lock-manager.ts` · `logger.ts` ·
`metrics.ts` · `otel-sink.ts` · `situation-detector.ts` · `sla-monitor.ts` · `state-transition.ts` ·
`storage-relocation-engine.ts` · `task-history.ts` · `trust-score.ts` · `unified-registry.ts` ·
`user-identity.ts` · `version-manager.ts` · `workspace-presets.ts`.

## Sub-folder engines (each dir = focused subsystem)

`actor/` · `adapters/` · `automation/` · `browser-automation/` · `capability-bootstrap/` ·
`chrome/` (governor pool impls) · `code-audit/` · `command-language/` · `events/` ·
`generative/` · `harness/` · `kernel/` (K0 today) · `local-agent/` · `local-server/` ·
`memory/` · `nlcl/` (60 NLCL files — natural-language command language) ·
`observability/` · `onboarding/` · `opencode/` · `p2p-node/` (libp2p) · `parsers/` ·
`pool/` · `providers/` · `reliability/` · `reprogrammability/` · `resource/` · `runtime/` ·
`scheduler/` · `stealth/` · `tunnel-client/` · `tunnel-orchestrator/` · `workflow-templates/`.
