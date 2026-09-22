# Security & Auth — Trust Boundaries (from `auth-gate` + `config` + `consent` + `sandbox` + `encryption`)

> Every claim names its enforcement file. Threat model is derived from what the
> code actually gates, not from policy prose.

## 1. Perimeter: bearer gate + CORS + trace (all in `server/index.ts` fetch + `auth-gate.ts`)

- **Bearer gate** (`auth-gate.ts:13 createAuthMiddleware`): no `CAP_STORE_AUTH_TOKEN` → allow-all dev mode; else require `Authorization: Bearer <token>` else 401 `{error, code:'AuthError'}`. Same check in `config.ts:514 checkAuth(req)` / `isAuthenticated()`. Setup routes (`/api/setup/*`) + `/health` + `/readyz` + `/api/openapi.json` + `/docs` bypass auth (first-run + observability must work pre-token). WS upgrade (`/ws`) passes through the same gate before `server.upgrade`.
- **CORS quarantine** (both `fetch()` chains): allowlist `http://localhost:3000|3001` + `127.0.0.1:3000|3001` only; mismatch → fallback origin (never `*`). Exposed header: `X-Trace-Id` only. Preflight caps methods/headers (`Content-Type,Authorization,X-Source,X-Trace-Id,X-Request-Id`, 24h cache).
- **Trace binding**: `X-Trace-Id` honor-or-generate on every response; unhandled errors return `{error, code:'InternalError', traceId}` 500 (never a hung socket, never a stack leak). Shutdown in-flight → 503 `ServiceUnavailable`.
- **Frontend route precedence** is a security-relevant ordering: exact `path+verb` desktop-bag matches (`desktop/frontend-route-mount.ts`) run BEFORE prefix routers so a broad prefix router cannot swallow (and mis-authorize) a narrow frontend path.

## 2. Consent + sandbox + execution policy (untrusted code never runs raw)

- **Consent gate** (`consent-engine.ts`, `ConsentViolationError(host)`): outbound calls to hosts without user consent throw. Pair with `trust-score.ts` + `governance-engine.ts` + `policy-engine.ts` + `registration-auditor.ts` (manifest drift = trust event).
- **Sandbox purity** (I-9): `sandbox-runner.ts` facade → `sandbox-runner-quickjs.ts` (primary, per-run CPU/memory budgets) or isolated-vm. Node `vm` fallback + `safe-eval.ts`/`safe-expression.ts` paths are removed (attack surface deleted, not deprecated). Violations typed: `SandboxTimeoutError(handler,budgetMs)`, `SandboxBudgetError(handler,kind,used,budget)`, `SandboxPermissionError(handler,denied)`. Audited to `SandboxAudit` rows via `sandbox-audit-store.ts`.
- **ExecutionKernel alpha gate** (`config.ts:359 executionKernel{enabled,allowDestructive,allowFinancial,allowCommunication,allowSecuritySensitive,maxRiskTier:3}`, env `VIVIM_EXECUTION_KERNEL*`, default OFF): when on, NLCL routes P0PolicyEngine tier-blocking (default-deny destructive/communication/financial/security-sensitive) → execute → verify → journal. Per-tier allows relax for trusted callers; `maxRiskTier` caps breadth. `ActionPlan` adds `RISK_TIER` + `requiresConfirmation` + `topologicalOrder` + `validateActionPlan` (`engines/action-plan.ts`).
- **HITL gates** (`HitlGate` model, `HitlGateExpired/DeniedError(gateId)`): autonomous steps pause for human approve/deny/expire — the backstop when policy cannot decide.
- **AI gateway switch** (`config.aiGatewayEnabled`, env `AI_GATEWAY_ENABLED=1`): off → `cap:ai:execute` returns not-enabled (no silent fallback to an unvetted model path).

## 3. Data protection (at rest + in transit within the box)

- **DB encryption flag** (`config.storage.encryptDb`, env `CAP_STORE_ENCRYPT_DB`, engines `db-encryption.ts`/`encryption.ts`): opt-in SQLite encryption; key handling centralized in config authority (B5: engines never read `process.env` directly — `getConfirmationSecret()`, `getHomeDir()`, `getOtelConfig()` are the only doors).
- **HMAC confirmations**: `getConfirmationSecret()` throws in production without `VIVIM_CONFIRMATION_SECRET` (dev fallback `dev-insecure-do-not-use-in-prod` never ships). NLCL destructive confirmations are HMAC-bound.
- **PII gravity**: user DB holds message content/embeddings/entities/platform mirrors (discord/slack/whatsapp/reddit/notion metas); system DB holds manifests/telemetry. Split is a blast-radius control: user export never drags system rows and vice versa (I-3 dual-DB, `dual-db-boundary.test.ts`). `*Json` TEXT blobs keep evolving PII shapes out of indexed columns; new queryable flags must be real columns from day one.
- **Audit trail**: `audit-trail.ts` + `telemetry-audit.ts` + `observation-tap.ts` + `EventRecord` auto-recording on the namespaced bus (`kernel|plugin.<id>|legacy`) — every cross-boundary event is attributable by namespace.

## 4. Browser-fleet isolation (one profile per account is a security rule)

- `ProfileAllocator` singleton per `slave:{provider}:{account}` + cookie-files-on-disk win over DB `loginState` (I-5): prevents session theft between accounts and duplicate-login corruption. `FleetSupervisor` caps concurrency + spawn guard + `port-reaper` orphan sweep + `system-pressure` backpressure (I-6). Slaves launch lazily on first need (no boot-time cookie exposure).
- Slave allocation failures are typed, not silent: `SlaveNotRunningError(slaveId)`, `SlaveBusyError(slaveId)`, `PortOccupiedError(range)`, `ChromeNotFoundError`, `ChromeGovernorError`, `CdpConnection/TimeoutError`, `CircuitOpenError(slaveId)` (fast-fail when breaker open).

## 5. What to check before shipping a security-sensitive change

1. New ingress → `auth-gate` coverage + zod in `src/schema/*` enforced by `validate.ts` + error mapped in `server/errors.ts` (never raw `new Response(JSON.stringify)`).
2. New outbound host → consent rule + `trust-score` wiring.
3. New executed code (parser/capability/template) → QuickJS path with budgets + `SandboxAudit` row + no `vm` import (certifier attack vectors will catch it).
4. New stored PII → user DB (not system), epoch-number time, `0|1` booleans, JSON blob for evolving shape, real column for queryable flag.
5. New event kind → `^(kernel|plugin\.<id>|legacy)\.` namespace (bus regex rejects the rest).
6. New capability touching destructive/financial/communication → `RISK_TIER` + `requiresConfirmation` + HITL gate path.
