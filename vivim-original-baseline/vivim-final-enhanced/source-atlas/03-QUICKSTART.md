# Quickstart — Boot It, Call It, Break It Safely (from code, not docs)

> All commands below are read from `package.json` scripts (~60), `src/cli/index.ts`
> (182 lines), `src/server/index.ts` (1227 lines), `src/config.ts` (524 lines),
> `frontend/` package, and `scripts/*` (25 files). Ports/paths are code values.

## 1. Prerequisites (from `package.json:engines` + `src/config.ts`)

- **Bun ≥ 1.3.14** (primary), **Node ≥ 20** (compat). TypeScript strict, ESM.
- No env required for dev: `config.authToken` is `null` unless `CAP_STORE_AUTH_TOKEN` set → dev mode allows all (`auth-gate.ts:18`).
- Data lands in platform data dir (`defaultDataDir()`): Windows `%LOCALAPPDATA%\vivim\cap-store`, else `~/.local/share/vivim/cap-store`. Override with `CAP_STORE_DATA_DIR` / `CAP_STORE_DB_PATH` / `SYSTEM_DATABASE_URL` / `USER_DATABASE_URL`.
- Ports: backend **9420** (`getServerPort()`: `CAP_STORE_PORT` → `.runtime/backend.port` → 9420, scans +200 on clash); fleet **9222–9250**; serverless discovery **9300–9400**; frontend **3000**; reaching backend from CLI auto-discovers `.runtime/backend.port`.

## 2. Boot paths (pick one)

```bash
# Full production boot (ONLY caller of bootstrapEngines → orchestrateBootstrap):
bun run src/cli/index.ts serve [--port 9420]
# package.json aliases:
bun run dev:backend        # same as above
bun run serve              # same as above
bun run dev                # scripts/dev.ts — full lifecycle launcher
bun run stop               # scripts/stop.ts

# Minimal stub (db-only, no engines) — for tooling/tests/boot-phase tracker:
# createServer(port) in src/server/index.ts:253 (no bootstrapEngines call)

# Frontend (Next.js 16 + React 19, App Router at frontend/src/app/):
bun run --cwd frontend dev        # port 3000, CORS allows 3000/3001 + 127.0.0.1
bun run frontend:dev              # alias
bun run frontend:build:tauri && cargo tauri dev   # desktop shell (src-tauri/, Tauri V2)
```

Boot order inside (do not reorder — `plugin-kernel/bootstrap/orchestrator.ts:88`):
`seeds → stores → knowledge → capabilities → lifecycle` → `ServiceContainer.initAll/startAll` → `/health` + `/readyz` flip to ready → accept traffic. Failure in capabilities phase is non-fatal (boots degraded).

## 3. First calls (one per surface — same capability, four doors)

```bash
# Health / readiness (no auth):
curl localhost:9420/health            # {status:'ok', version:'1.0.0'}
curl localhost:9420/readyz            # 503 until ready, then {status:'ready', uptime}
# Interactive API docs (no auth, served from backend):
open http://localhost:9420/docs       # Swagger UI → /api/openapi.json

# CLI (Backend CLI-A, dual in-process/thin-client):
bun run src/cli/index.ts help
bun run src/cli/index.ts seed all     # createServerWithEngines(PORT) → boot seeds
bun run src/cli/index.ts migrate --source all
bun run src/cli/index.ts automate navigate https://example.com
bun run src/cli/index.ts moments list
# Pipes + REPL (same contracts as HTTP):
# pipeline-engine.ts: result.data threads as next input; repl.ts vivim> → POST /api/interpret

# HTTP (auth-gate → validate(zod) → registry.execute → governor → parser → memory):
curl -X POST localhost:9420/api/interpret -H 'Content-Type: application/json' \
  -d '{"input":"send hello via openai"}'          # NL shell contract (same as vivim> + chat box)
curl localhost:9420/api/setup/profiles            # ProfileEntry[]{providerId,accountSlug,profileDir,hasCookies,dbLinked}
curl -X POST localhost:9420/api/setup/launch-visible -H 'Content-Type: application/json' \
  -d '{"providerId":"openai","accountSlug":"main","workspace":"C:/x"}'
curl localhost:9420/api/capabilities?surface=cli # thin-client capability list (registry-bridge fetch)

# MCP (agent root: DiscoveryMcpServer + discovery/nlcl/browser tools):
#  discover_start {url} → discover_navigate/click/type/scroll/hover → discover_match_shape
#  → discover_infer_capabilities → discover_generate_manifest → discover_validate_manifest
#  → discover_test_parser → discover_approve/reject  (27 discover_* + nl_command/nl_list_commands/nl_help)

# WS (realtime fan-out over CapabilityEventBus):
#  ws://localhost:9420/ws — handleWebSocket.open/message/close(eventBus)
#  + canvas mutation forwarder + conversation forwarder + node event forwarder
```

Every response carries `X-Trace-Id` (client-supplied honored, else generated) + CORS `Access-Control-Allow-Origin` limited to localhost 3000/3001. Errors are `{error, code, details?}` (`response.ts:json/errorResponse`); unhandled route errors become 500 + `traceId` (never a hung socket).

## 4. First change (safest lanes)

| Change | Files | Verify |
|--------|-------|--------|
| New zod validator | `src/schema/<domain>.ts` + used by `server/validate.ts` | `bun test tests/unit` |
| New store method | `contracts/<d>.ts` (Row+iface) → `impl/<d>-impl.ts` → `impl/<d>-mem.ts` | `bun test tests/arch` (`store-contract-parity`) |
| New engine (no CDP) | `src/engines/<name>.ts` importing contracts only | `bunx tsc --noEmit` + layer test |
| New browser capability | `cdp-capability-registrar.ts` + selector rows + `ParserTestResult` row | `providers:smoke` + e2e |
| New slot renderer | `frontend/src/registry/` + `ui/slots.ts` if new slot + `SlotBinding` row | `verify-cross-surface.ts --offline` |
| New CLI surface | capability with `surface:'cli'` + `cliCommand` → auto-registers via `syncCliFromUnified` | `cli` thin-client fetch |
| New API endpoint | capability with `surface:'api'` + `apiEndpoint{method,path}` → universal dispatcher (no route file needed) | `/api/openapi.json` + `api-contract.test.ts` |

## 5. What to do when it breaks

- **Port clash**: server auto-walks 9420→9620 and writes `.runtime/backend.port`; CLI/frontend discover it. If zombie socket holds 9420 on Windows, kill by PID from `/api/opencode/instances` (never by image name).
- **Slave busy / not running / CDP timeout / circuit open**: typed errors (`SlaveBusyError`, `SlaveNotRunningError(slaveId)`, `CdpTimeoutError(method)`, `CircuitOpenError(slaveId)`) with recovery chain `retry_selector → retry_with_fallback → navigate_home → restart_chrome → mark_broken` (`capability.ts:55`). See `error-catalog.md`.
- **Boot crash on duplicate service**: `ServiceContainer.register` throws on double-register (fail-fast); check phase ordering, not the engine.
- **DB drift**: `bun run db:doctor`, `backup-db.ts`/`restore-db.ts`, `seed-snapshot.ts`; migrations via `prisma:migrate:dev:system/user` or `migrate --source all` (TS runner above SQL baselines). Never hand-edit `prisma/migrations/*.sql` + TS registry out of sync.
- **Parity red**: run `bun run scripts/verify-cross-surface.ts --offline|--live|--runtime|--runtime-registry` (Unit 19.4 gate, blocks PRs).
