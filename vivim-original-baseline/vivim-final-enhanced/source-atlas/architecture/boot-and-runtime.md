# Boot & Runtime — how the system comes alive (from orchestrator + phases + container)

> Canonical order lives in `src/plugin-kernel/bootstrap/orchestrator.ts` (K0-15 glue):
> `seeds → stores → knowledge → capabilities → lifecycle`. The phase siblings still live
> at `src/server/bootstrap/phases/*.ts` (K1) during migration; the server shim at
> `src/server/bootstrap/orchestrator.ts` just re-exports the K0 pipeline.

## 1. Boot pipeline (5 phases — this list IS the dependency graph)

```
orchestrateBootstrap(port)
 │  ctx = createBootstrapContext(port)   // { port, eventBus: CapabilityEventBus.getInstance() }
 │  eventBus is the ONLY pre-seeded field — every phase depends on it
 ▼
┌ Phase 1: seeds (phases/seeds.ts) ─────────────────────────────────┐
│ DB scaffolding + snapshot/individual seeds + provider registry     │
│ Writes: db, providerStore, registrar, providerRegistry             │
│ Reads:  seeds/{system,taxonomy,capabilities,parsers,providers,…}   │
└────────────────────────────────────────────────────────────────────┘
 ▼
┌ Phase 2: stores (phases/stores.ts) — the "hard spine" ─────────────┐
│ Store impls + parsing/memory + governor + CDP + conversation mgr   │
│ Writes: convStore, resolutionEngine, parserEngine, streamBlocks,    │
│         memoryEngine, governor, conversationManager, cdpTransport   │
│ How: lazy `await import()` per engine (dodges circular module-load)│
│      impls constructed here (server MAY touch impl; engines may not)│
└────────────────────────────────────────────────────────────────────┘
 ▼
┌ Phase 3: knowledge (phases/knowledge.ts, OPTIONAL) ────────────────┐
│ knowledgeIngestion, semanticSearch (+embeddingProvider),           │
│ synthesizer, exportEngine, providerMux, costOptimizer              │
└────────────────────────────────────────────────────────────────────┘
 ▼
┌ Phase 4: capabilities (phases/capabilities.ts, OPTIONAL-but-central)┐
│ registry + default/generated/discovered cap sets + harness program  │
│ resolver + MCP server + per-agent memoryFabric + agentBuilder +     │
│ CDP method registrars. Entire body in try/catch — any sub-step      │
│ failure is non-fatal and skipped (system boots degraded, not dead). │
│ Writes: registry, autonomousEngine, policyEngine, relocationEngine, │
│         memoryFabric, agentBuilder, harnessRepair                   │
└────────────────────────────────────────────────────────────────────┘
 ▼
┌ Phase 5: lifecycle (phases/lifecycle.ts) ──────────────────────────┐
│ nlclEngine, automationOrchestrator, kernel, healthKernel,           │
│ lockManager, idempotencyGuard, retryEngine + router-facing stores   │
│ (nodeStore, containerStore, contentStore, notificationStore,        │
│ contactStore, syncStore, mediaStore, collectionEngine,              │
│ lifecycleEngine, compactionManager, backupManager)                  │
└────────────────────────────────────────────────────────────────────┘
 ▼
resolveResult(ctx) → BootstrapEnginesResult (fixed public shape, 40+ fields)
 ▼
ServiceContainer.register(name, instance, {lifecycle, tags}) × N
initAll() → startAll() → accept traffic (LIFO stopAll() on shutdown)
```

## 2. `BootstrapContext` — the 60+ field thread-through (and why it's a smell)

`src/server/bootstrap/context.ts` (163 lines) declares `BootstrapContext` with every
`field?: Type` optional and filled by whatever phase owns it. Representative groups:
seeds (4) → core engines (7) → governor (3) → knowledge/export (6) → mux/cost (2) →
outcome (1) → capabilities/autonomous (8) → lifecycle (7) → router stores (13) → optional (2).

- **Why it exists:** phases run sequentially and share one mutable bag — simplest thing
  that preserves the original mega-function's ordering guarantees while making stages
  individually testable.
- **Why it's flagged:** it leaks kernel internals to every phase (any phase can read/write
  any field — no capability scoping). The migration replaces it with a closed
  `IPluginContext` (per-namespace storage + namespaced bus only). Until then, treat
  `BootstrapContext` as privileged boot-only memory: routers/engines must never accept it.
- **Proof of leak in code:** `context.ts` imports `*StoreImpl` concrete classes
  (`CapabilityStoreImpl`, `ConversationStoreImpl`, …) — the ONLY place outside
  `bootstrap/phases/*` allowed to name impl types (server layer privilege, I-2 exception).

## 3. `ServiceContainer` — fail-fast DI (from `service-container.ts`, 203 lines)

- Keys are **strings** (debuggable, JSON-serializable for future REST exposure).
- `register` throws on duplicate (catches double-boot); `resolve`/`resolveRequired` throw
  on missing (catches wiring bugs at call site, not as `undefined` downstream);
  `resolveOptional` + `has` for optional deps; `findByTag('engine'|'store'|'infra')` for groups.
- Lifecycle: `init()` (after all registered) → `start()` (ready for traffic) →
  `stop()` in **reverse insertion order** (LIFO teardown: last started, first stopped).
- Hooks optional per service — most stores/engines are plain singletons.

## 4. Request runtime (steady state, after boot)

```
ingress (server router | cli command | mcp tool | ws frame)
  → auth-gate → validate.ts (zod from src/schema) → response.ts envelope
  → CapabilityResolutionEngine (confidence + tier + health)
  → CapabilityEngine.execute ──recovery chain──▶ retry_selector → fallback
        → navigate_home → restart_chrome → mark_broken (Outcome logged)
  → ChromeGovernor ──fleet-limiter + circuit-breaker + profile-allocator──▶ CdpTransportImpl
  → StreamParserEngine (DB parser_logic_code) → StreamBlockStore
  → Memory/Knowledge fan-out (embeddings, entities, synthesis)
  → TelemetryAggregator + Alerter(sliding-window→dedup→cooldown→webhook)
  → (scheduled) AutomationScheduler / WorkflowEngine / HarnessRuntime replay
```

Resilience wrapping order (outermost→innermost): `request-queue` → `lock-manager` →
`idempotency-guard` → `retry-engine` + `sla-monitor` → engine → `error-tracker`/`audit-trail`.

## 5. Shutdown

`stopAll()` reverses registration: routers drain → orchestrators cancel → governor closes
slaves (`port-reaper` sweeps orphans) → stores flush → `snapshot.ts` persists → process exits.
