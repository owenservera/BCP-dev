# L3 — Subsystems (zones L1 left shallow: executor, ai, canvas, fleet, intel, + rest)

> Each section: files observed on disk → role in one paragraph → key exports/deps →
> which L2 cluster + L4 contracts it feeds. All paths measured via directory scan.

## 1. `src/executor/` — Chrome CDP substrate (19 files, L5)

Files: `cdp.ts` (277 lines: `BunCdpClient{connect/send/on/disconnect}`, 30s timeout, 3 retries, 30s ping), `cdp-transport.ts` (adapter: `CdpTransportImpl`, the mock seam), `cdp-types.ts` (`CdpClientOptions{timeoutMs,maxRetries,retryDelayMs,pingIntervalMs}`, `CommandOptions`), `cdp-error-classifier.ts`, `content-blocks.ts`, `launcher.ts` (Chrome spawn), `chrome-instance-profile.ts` + `profile-allocator.ts` (singleton dir per `slave:{provider}:{account}`), `slave-states.ts`/`slave-read.ts`/`slave-write.ts` (triple-layer state), `fleet-config.ts`/`fleet-limiter.ts`/`fleet-supervisor.ts` (concurrency caps), `circuit-breaker.ts`, `system-pressure.ts`, `port-reaper.ts` (orphan sweep), `async-mutex.ts`, `ids.ts` (executor-local ids).

Role: the ONLY place that opens a WebSocket to Chrome. `engines/chrome-governor*.ts` is the sole engine caller (Governor Canon I-1); every other engine requests browser work through the governor, which applies fleet + circuit + profile policy then delegates to `CdpTransportImpl`. Mock `CdpTransportImpl` and the whole browser becomes deterministic.

Feeds: L2-C2 (provider fleet) · contracts `governor-store`, `slave-setup-store`, `stealth-store` · errors `CdpTimeout/ConnectionError`, `SlaveNotRunning/Busy`, `CircuitOpen`, `ChromeNotFound`, `PortOccupied`.

## 2. `src/ai/` — AI gateway + adapters + policy (40+ files)

Layout observed: `factory.ts`, `index.ts`, `core/{errors,invariants,types}.ts`, `events/{bus,in-memory-bus,event-record-bridge}.ts`, `execution/{manager,internal,in-memory-manager,types}.ts`, `gateway/{gateway,vivim-ai-gateway}.ts`, `plugins/{manager,plugin-manager-impl}.ts` (IPluginManager stub — migration moves to `plugin-kernel/plugin-manager/`), `policy/{policy,default-policy,store-backed-policy}.ts`, `protocol/{adapter,legacy-adapter-wrappers,opencode-adapter,simulator-adapter}.ts` + `protocol/openai-compatible/{adapter,auth,error-mapper,index,manifest,request-builder,stream-parser}.ts`, `registry/{registry,in-memory-model-registry,in-memory-provider-registry}.ts`, `routing/{router,default-router,strategies}.ts`, `runtime/{supervisor,ts-supervisor,resources,in-memory-resource-manager}.ts`, `tools/{orchestrator,tool-orchestrator-impl}.ts` (facade target of `engines/tool-orchestrator-facade.ts`).

Role: canonical AI execution layer behind `AI_GATEWAY_ENABLED=1` (else `cap:ai:execute` returns not-enabled). Gateway boots in-memory stores + simulator + optional OpenCode adapter; router picks model/provider; policy gates tiers; execution manager runs with budgets; events bridge to `EventRecord`. Gated by `config.aiGatewayEnabled` + `executionKernel{enabled,allowDestructive/Financial/Communication/SecuritySensitive,maxRiskTier}` (default-deny, alpha-off).

Feeds: L2-C5/C6 (autonomous/tool use) · contracts `ai-execution-store` (`AIExecution`, `AIExecutionEvent`, `AIProviderInstance`) · `src/plugin-kernel/adapter/impl/{openai-compatible,simulator}/*` mirrors.

## 3. `src/canvas/` — scene graph + capability projection (15 files)

Files: `canvas-engine.ts` (composable layers; full boot wires `InMemoryCanvasStore` + `ServerLayerHost` + `RegistryCapabilityExecutor` + oracle + primitive providers, `seedCoreLayers()`, `registerCapabilities(registry)`), `canvas-registry.ts`, `canvas-mirror.ts` (converge with frontend memory impls via `MirrorState`), `capability-layer.ts` + `capability-bridge.ts` + `layer-mounter.ts` (mount capability renderers into layers), `mutation-caps.ts` (`registerCanvasMutationCaps`, NL mutation; `HistoryInput/MutationServices/UndoInput`), `designer.ts`, `oracle-reader.ts` (visibility over DB), `primitives.ts`, `schema.ts`, `types.ts`, `in-memory-store.ts`, `index.ts`, `canvas-agent-tools.ts`.

Role: backend owns WHAT (layers + `UiComponent`/`SlotBinding`/`Primitive` rows), frontend owns HOW (pixels). Mutations flow `canvas-router.ts` (HTTP) + `canvas-ws.ts` (WS deltas: `attachCanvasWs(engine)`, `ServerLayerHost`, `corePrimitiveProviders`) → `mirror-engine` convergence. NL mutations go through `mutation-caps`.

Feeds: L2-C10 · contracts `canvas-store`, `ui-component-store`, `workspace-store`, `collection-store` · shared `canvas-types.ts`, `ui-component.ts`, `ui-slots.ts` · system models `Primitive`, `UiComponent`, `SlotBinding`.

## 4. `src/fleet/` + `src/engines/chrome/` + `browser-automation/` + `stealth/` — fleet implementation

`src/fleet/`: `fleet-manager.ts`, `remote-cdp.ts`, `worker-node.ts`, `index.ts` (pool + remote + workers above executor primitives). `src/engines/chrome/*`: governor pool impls. `browser-automation/*`: scripted flows. `stealth/*`: evasion modules backed by `StealthLaunchProfile/ModuleProfile/Policy` rows.

Role: fleet-manager allocates `slave:{provider}:{account}` singletons within `fleetPortRangeStart/End` (9222–9250) under `autoStartFleet` (default false); `remote-cdp` + `worker-node` scale beyond one host; stealth profiles keep slaves undetected (`humanized-interaction.ts`, `anti-detection.ts`).

## 5. `src/intel/` — intelligence substrate overlays (12 subdirs)

Subdirs observed: `auth, canvas, cleanup, domain, executor, identity, integration, nlcl, resource, router, routing, runtime/`. Each is a thin overlay (auth/identity scoping, routing preferences, resource budgets, NLCL extensions, runtime hooks) over the matching `engines/*` family — not a parallel engine set. Read `intel/<name>/` alongside `engines/<name>*`, not instead of it.

## 6. Remaining `src/*` zones (each measured)

| Zone | Files | Role | Feeds |
|------|-------|------|-------|
| `alerting/` | `alerter.ts, sliding-window.ts, dedup.ts, cooldown.ts, webhook.ts, index.ts` | `logger → telemetry-aggregator → otel-sink`; `alerter+sliding-window+dedup+cooldown → webhook` | C9, `alert-store` |
| `automation/` | `scheduler.ts, automation-router.ts, ui-automator.ts` | Schedules + UI automation (server router mounted at `/api/automate/*`) | C5, `automation-store` |
| `api/` | `index.ts, setup-client.ts` | Typed client (base URL + auth + retry); mirrors `shared/api-types` + `schema/api-types` | all surfaces |
| `arch/` | `index.ts, boundary-rules.ts` (345 lines, 10 layers), `boundary-scanner.ts` | Self-lint: longest-prefix `classifyPath`, `isImportAllowed`, `resolveAlias`; CI gate | LA all |
| `cleanup/` | `index.ts, unused-exports.ts, deprecated-events.ts` | Barrel hygiene (`src/index.ts` 462 lines = public surface) + dead-event sweeps | I-10 |
| `config/` | `provider-registry.ts` (+ root `config.ts` 524 lines) | Provider + app config; validated by `schema/config.ts`, persisted via `config-store` | C11 |
| `desktop/` | `frontend-route-mount.ts`, `sidecar-entry.ts`, shims | Tauri sidecar: true binary entry (server `import.meta.main` removed to avoid double-boot stealing DB lock); ported App Router bag with exact-path precedence | surfaces |
| `domain/` | services | Shared domain helpers over `schema/*` | cross-cluster |
| `executor/` | see §1 | L5 CDP substrate | C2 |
| `framing/` | `engine.ts, schemas.ts, frame-version.ts, index.ts, __tests__/engine.test.ts` | Frame envelopes + versioning | WS/sync |
| `integration/` | `index.ts, flag-registry.ts` | Feature flags (`flag-registry.ts` gates governor behavior) | all |
| `lib/` | `catch-logger.ts`, `logger.ts` (pino), `safe-json.ts`, … | Small utilities; `getLogger(name)` everywhere | all |
| `observability/` + `observatory/` | sinks, taps, digests | Telemetry + inspection (`otel-sink`, `observation-tap`) | C9 |
| `plugin-kernel/` | 18 files: `airgap,error-tracker,metrics` + `adapter/impl/{openai-compatible(4),simulator(1)}` + `bootstrap/orchestrator.ts` (K0-15 glue, 5 phases) + `core/{invariants,types-new}` + `event-bus/in-memory.ts` + `plugin-manager/{certifier,contract,install-router,manager}` + `sandbox/runner.ts` | Kernel boundary mid-migration (6/17 subsystems; `plugins/core/` empty; K0 still imports K1 in orchestrator — allow-listed, must not spread) | I-8, risks R-1/R-3 |
| `reprogrammability/` + `resilience/` + `shared/` | surface regen + retry/circuit + helpers | `config-universal-surface.ts` parity target; `retry-engine` wraps every step | C7/C11 |
| `router/` | specs + targets + events | Route resolution (`RouteSpec/Request/Target/Event`) | C8, `router-store` |
| `transform/` | `types.ts, transform-engine.ts, index.ts` | Shape↔row transforms over `schema/*` | ingestion |
| `__generated__/` | `provider-protocol.ts`, `.dev.ts` | Codegen output of `provider-protocol-generator.ts` (never hand-edit) | C6 |

## 7. `frontend/src/` mirrors (22 zones — backend-owned WHAT vs frontend-owned HOW)

`app/{api,canvas}` (top routes; desktop bag ports exact paths) · `actions/` (server actions) · `api/{client,schemas,transformers}.ts` (1:1 router mirrors) · `canvas/`+`render/` (scene) · `components/`+`ui/{slots(29),registry,defaults/,context.tsx}` (design system + slot catalog) · `registry/index.ts` (slot→renderer map — THE file for new renderers) · `engines/` (canvas/workspace/plugin/rbac/presence mirrors) · `features/` (user moments) · `storage/contracts/` (26: account/agent/annotation/audit/automation/canvas-definition/capability-tier/document/document-edit/drawer/media/notification/onboarding/presence/primitive/provider/provider-type/rbac/search-index/shell-command/template/ui-component/user-layout/workspace/z-layer + `index.ts`) + `impl/memory-*` (26 memory doubles + `prisma-onboarding-store`) + `provider/{memory-storage-provider,prisma-storage-provider,storage-provider,not-implemented-proxy}` + `health/probe.ts` + `__tests__/storage-provider.parity.test.ts` · `schema/` (frontend zod mirrors `src/schema` — drift risk R-6) · `cli/commands/{shell(746 lines, 43 cmds),storage-inspect}.ts` · `hooks|lib|ml|sdk|seeds|shared|test-utils|types|typings/`.
Real persistence NEVER lives here — memory impls converge via WS/mirror rows.
