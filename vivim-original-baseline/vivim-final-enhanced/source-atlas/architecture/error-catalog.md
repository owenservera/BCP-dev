# Error Catalog — Every Failure Has a Type (from `src/errors.ts` 365 lines)

> Base: `CapStoreError{code, message, details?, toJSON()->{error,code,details}}`.
> HTTP mapping: `src/server/errors.ts`; wire envelope: `src/schema/response-schemas.ts`
> (`{ok,data,error}` + pagination); transport: `server/response.ts:json/errorResponse/dispatch`.
> Recovery chain: `capability.ts:55 DEFAULT_RECOVERY`. All errors below extend the base
> (grep `extends CapStoreError` = complete list; tail `errors.ts:101-365` holds domain extensions).

## 1. Ingress & lookup (400s — caller can fix and retry same input shape)

| Class | Thrown when | HTTP | Fix |
|-------|-------------|------|-----|
| `ValidationError` | zod/schema guard fails at ingress (`validate.ts`) or engine boundary | 400 | fix input to match `src/schema/*` (+ `mcp/zod-schema.ts` for tools) |
| `NotFoundError` | store get-by-id miss | 404 | check ULID / `slave:/cap:/bind:/prog:/sel:` derivation |
| `ConflictError` | unique violation (binding/program promotion races) | 409 | re-read then promote (optimistic retry) |
| `AuthRequired` / `AuthError` | `auth-gate.ts` rejects (bad/missing Bearer) | 401 | set `CAP_STORE_AUTH_TOKEN`, send `Authorization: Bearer` |
| `CapabilityNotFoundError(slug)` | registry has no such slug | 404 | register taxonomy→binding→program first |
| `CapabilityCompositionError` | composite/macro DAG invalid | 400 | `validateActionPlan` + `topologicalOrder` |
| `HarnessCommandNotFoundError(id,version?)` | harness registry miss | 404 | `seedHarnessCommands` / version bump |
| `UnknownPrefix/Command`, `MissingArgs`, `InvalidArg`, `UnknownProvider`, `ContextNotFound`, `NlpMatch/LowConfidence/ComboAmbiguousError` | command-language / NLCL parse failures (`command-language/`, `nlcl/`) | 400/422 | rephrase, disambiguate combo, raise confidence (more context) |

## 2. Browser fleet (503/504/408 — retry with backoff, then recovery chain)

| Class | Means | Recovery |
|-------|-------|----------|
| `SlaveNotRunningError(slaveId)` | profile allocated but Chrome not launched (lazy startup) | launch via setup `launch-visible` → `verify` → `complete`; governor auto-launches on first need |
| `SlaveBusyError(slaveId)` | singleton busy (one profile per account) | queue (`request-queue.ts`) / `lock-manager.ts` / pick another account |
| `CdpTimeoutError(method)` | CDP command >30s (`cdp.ts` default) | `retry_selector` → `retry_with_fallback`; check `cdp-error-classifier.ts` |
| `CdpConnectionError` | WS down / auto-reconnect exhausted (3 retries, 30s ping) | `restart_chrome`; `port-reaper` sweep orphans |
| `CircuitOpenError(slaveId)` | breaker open after 5 fails/60s | fast-fail; wait reset window (`CAP_STORE_CIRCUIT_RESET_MS`) or inspect health |
| `ChromeNotFoundError` | no Chrome binary | set `CAP_STORE_CHROME_PATH` |
| `PortOccupiedError(range)` | 9222–9250 (or 9300–9400 discovery) exhausted | kill zombies (consult `/api/opencode/instances` first), widen range |
| `ChromeGovernorError` | governor policy refusal | read `details` (fleet/circuit/profile cause) |
| `SendResilienceError{recoveryKind,retryAfterMs,autoReconnectAttempted}` | classified send failure (`chrome_crash|cdp_down|session_expired|circuit_open|relogin|unknown`) | `session_expired/relogin` → relogin flow (`isAuthenticated()` false → setup wizard); else chain to `mark_broken` |

## 3. Memory, budget, HITL, sync (429/409/410 — human or policy decides)

| Class | Means | Action |
|-------|-------|--------|
| `MemoryError` / `MemoryBackendLimitError(existing,rejected)` | harvest failure / second external backend rejected (only one allowed) | keep single backend; check harvester |
| `MemoryWardenQuotaError(agentId,used,limit)` | per-agent write quota breached | raise quota or compact (`compaction-manager`, `eviction-manager`) |
| `BudgetExceededError(budget,used,limit)` | `BudgetEngine`/`cortex-budget`/`cost-optimizer` cap hit | approve raise or reduce scope |
| `SandboxTimeout/Budget/PermissionError(handler,…)` | QuickJS run over CPU/memory/permission budget | shrink handler, raise budget, narrow sandbox whitelist |
| `HitlGateExpired/DeniedError(gateId,by?)` | autonomous step awaiting human timed out / denied | re-issue gate or abort plan |
| `SyncConflictError(table,recordId)` | `SyncLog`/`MirrorState` convergence clash | last-writer-wins via `OptimisticUpdate` replay or manual merge |
| `ConsentViolationError(host)` | outbound to un-consented host | obtain consent / allowlist host |
| `CanvasSpawn/MutationError` | layer spawn / mutation-cap failure | check `mutation-caps` input + oracle visibility |
| `IntentDecompositionError` | planner cannot split intent | simplify goal / add capability coverage |
| `HarnessRepair/RetryExhaustedError(attempts,lastError)` | repair engine gave up | inspect `RepairSession` + `FailureClassification` + `TestRun` |
| `UpdateError` / `EngineError` / `OpenCodeServe/PermissionDeniedError(tool,tier)` | updater / generic engine / opencode tier>3 denial | check version-manager / supervisor ledger |

## 4. How errors travel (so on-call knows where to look)

```
engine throws CapStoreError{code} → server/errors.ts maps code→status
  → response.ts json({error,message,code,details?,traceId?}, status) + X-Trace-Id + CORS
  → telemetry-aggregator (TraceEntry + CapabilityTelemetry) + error-tracker/audit-trail
  → capability recovery chain (retry_selector→…→mark_broken) + BindingStatusLog/Outcome rows
  → alerter pipeline (sliding-window→dedup→cooldown→webhook) if threshold crossed
CLI: non-OK API → throw API error {status} (never masked as Unknown); usage errors exit(1).
MCP: {content:[{type:'text', text}], isError?} (unknown tool → isError + 'Unknown tool: <name>').
WS:  error frame on same socket (trace-id correlated).
```
