# Capability Lifecycle — One Action End-to-End (traced through code)

> Trace target: user asks for something → capability executes in a governed
> browser → streamed result is parsed from DB logic → memory + telemetry fan out.
> Files: `engines/capability.ts` (265 lines), `capability-resolution.ts`,
> `capability-binder.ts`, `capability-taxonomy.ts`, `chrome-governor.ts`,
> `executor/cdp-transport.ts` + `cdp.ts`, `stream-parser.ts`,
> `stream-block-store.ts`, `memory-engine.ts`, `telemetry-aggregator.ts`,
> `server/capability-router.ts`, `server/index.ts:matchCapabilityEndpoint`.

## 1. The 9-step happy path (with file:line anchors)

```
[0] INGRESS — four doors, one contract
    CLI: registry.resolve(tokens) → handler({args,flags}) → argvToInput → reg.execute
         (cli/command-registry.ts: longest-prefix ≤4; registry-bridge.ts: argvToInput+coerce)
    HTTP: auth-gate → validate.ts(zod src/schema/*) → capability-router.ts → registry.execute
         (server/index.ts: full fetch() chain; matchCapabilityEndpoint for surface:'api')
    MCP:  callTool(name, args) → zod-schema.ts guard → same registry.execute
         (mcp/server.ts:DiscoveryMcpServer; discovery/nlcl/browser tools)
    WS:   message(ws, msg, eventBus) → capability kind (kernel|plugin.<id>|legacy)
         (websocket.ts; bus regex in capability-event-bus-v2.ts)
         │
         ▼
[1] RESOLUTION — global → best binding/program
    ResolutionEngine (capability-resolution.ts) reads CapabilityBinding(globalId,providerId)
    + candidate CapabilityPrograms + SelectorStrategy set + ProviderHealth + tier gate
    (capability-taxonomy.ts minPlanTier) → picks bestProgramId by confidence+tier+health.
    Cache: capability-resolution-store + selector-cache.ts; invalidated by ManifestDrift.
         │
         ▼
[2] BINDING CHECK — is this binding healthy?
    Status machine prospect→test-1→test-2→stable→flaky→broken→retired
    (capability-binding-store.ts + BindingStatusLog appends). Broken → fallback provider
    via mux (provider-mux.ts → MuxSession) or fail with CapabilityNotFoundError.
         │
         ▼
[3] EXECUTION — CapabilityEngine.execute(slug, providerId, accountId, input)
    (capability.ts:70): deriveSlaveId → traceId=newId() → store.getCapabilityBySlug
    → governor call. Emits bus events (kernel.*). Returns
    {ok, capabilityId, output?, traceId, latencyMs, recoveryStrategies?}.
         │
         ▼
[4] GOVERNANCE — ChromeGovernor (sole CDP owner, I-1)
    Allocates slave:{provider}:{account} singleton (profile-allocator.ts);
    checks fleet-limiter (concurrency caps 9222–9250) + circuit-breaker (5 fails/60s)
    + isAuthenticated() (cookie files on disk win over DB flag) → CdpTransportImpl.
         │
         ▼
[5] BROWSER — BunCdpClient (executor/cdp.ts: 30s timeout, 3 retries, auto-reconnect)
    CDP commands run; selectors healed (selector-healer/refiner/cache) with
    SelectorHealthHistory writes; humanized-interaction + stealth profiles applied.
    Failure modes typed: SlaveNotRunning/Busy, CdpTimeout(method), CircuitOpen(slaveId).
         │
         ▼
[6] PARSING — StreamParserEngine (DB-only logic, I-4)
    Loads parser_logic_code WHERE logic_type='inline' (ProviderParser row, seeded from
    seeds/parsers/*) → executes in SandboxRunner (QuickJS, budgeted) → emits stream
    blocks (ContentPart/ContentBlock via shared/stream-blocks.ts) → StreamBlockStore.
    Never imports parser files from disk at runtime.
         │
         ▼
[7] MEMORY/KNOWLEDGE FAN-OUT — memory-engine + knowledge-ingestion + semantic-search
    Writes Episodic/Semantic/Procedural + MemoryEmbedding (hf/minilm/ollama) +
    Entity/Mention grounding + cross-conversation-synthesis. Quota: MemoryWardenQuotaError.
    Nodes deduped by hashContent (identityHash).
         │
         ▼
[8] OBSERVE — logger (pino) → telemetry-aggregator → TelemetrySummaryDaily/CycleLog
    + CapabilityTelemetry + ProviderLatency/CostLog + otel-sink; alerter pipeline
    (sliding-window→dedup→cooldown→webhook) on thresholds. Outcome row logged.
         │
         ▼
[9] PROJECT — canvas/UI slots + sync
    UiComponent + SlotBinding rows → UIComponentRegistry.resolve(slot, {provider,capability})
    → React renderer (29 SLOT_IDS) over HTTP (canvas-router) + WS deltas (canvas-ws.ts);
    conversation/mirror sync rows converge replicas. Parity checker asserts the same
    capability resolves on cli=ui=api=mcp.
```

## 2. Recovery chain (when step 3–5 fails — `capability.ts:55 DEFAULT_RECOVERY`)

```
retry_selector → retry_with_fallback → navigate_home → restart_chrome → mark_broken
     │ each records RecoveryStrategyResult{strategy,index,ok,error?}
     │ Outcome row + BindingStatusLog append (flaky/broken transition)
     │ SendResilienceError{recoveryKind: chrome_crash|cdp_down|session_expired|circuit_open|relogin|unknown,
     │   retryAfterMs?, autoReconnectAttempted} for session-expired → relogin flow via setup endpoints
```

Outer wraps (outermost→innermost): `request-queue → lock-manager → idempotency-guard → retry-engine + sla-monitor → engine → error-tracker/audit-trail` (`boot-and-runtime.md` §4).

## 3. Promotion lifecycle (how bindings get better over time)

```
prospect (inferred by manifest-inference / discover_infer_capabilities)
  → test-1/test-2 (ParserTestResult rows, provider-test-harness 8 phases, harness checkpoints)
  → stable (bestProgramId pinned, confidence high, health green)
  → flaky (SelectorHealthHistory degrades / ManifestDrift detected)
  → broken (recovery chain exhausted → mark_broken) → retired
Promotion writes: CapabilityBinding{bestProgramId,currentProgramId,promotionHistoryJson,confidence}
+ ProgramVersionMetric per prog:{binding}:v{n}. Seeds bootstrap the prospect set
(capability-bootstrap.ts + capability-bootstrap-generated.ts + seeds/capabilities/*).
```

## 4. Minimal code trace (copy-paste anchors for debugging)

- Resolve: `capability-resolution.ts` → `contracts/capability-resolution-store.ts`
- Execute: `capability.ts:70 execute()` → `chrome-governor.ts` → `executor/cdp-transport.ts` → `executor/cdp.ts:50 connect()` / `send()`
- Parse: `stream-parser.ts` (header: "Governor Canon: never imports BunCdpClient") → `contracts/parser-store.ts` → `sandbox-runner-quickjs.ts`
- Blocks: `stream-block-store.ts` (engine) → `contracts/stream-block-store.ts` → `impl/stream-block-store-impl.ts` → `StreamBlock` model
- Memory: `memory-engine.ts` → `contracts/memory-*-store.ts` → `MemoryEmbedding` ANN
- Telemetry: `telemetry-aggregator.ts` → `contracts/telemetry-store.ts` → `TelemetrySummaryDaily`
- Registry: `unified-registry.ts` (`list({surface})`, `get(id)`, `execute(id, input)`) — the phonebook every surface calls.
