# Configuration — Every Knob (from `src/config.ts` 524 lines + `package.json`)

> `src/config.ts` is the ONLY module that reads `process.env` for runtime values
> (invariant B5 config-authority). Engines call `config.*`, `getTunable()`,
> `getServerPort()`, `getOtelConfig()`, `getConfirmationSecret()`, `getHomeDir()`,
> `getDataDir()/getDbPath()` — never `process.env` directly.

## 1. Tunables (runtime-reconfigurable — 13 keys, `TUNABLE_SCHEMA`)

Persisted to `.runtime/config.tunables.json`; changed via `bun run devops toolkit config set <key> <value>`; hot-read without restart. `listTunables()` reports `{key, value, source: override|default}`.

| Key | Type | Default | Controls |
|-----|------|---------|----------|
| `server.port` | number | 9420 | HTTP bind (also `CAP_STORE_PORT` → `.runtime/backend.port` → 9420 precedence in `getServerPort()`) |
| `server.host` | string | 127.0.0.1 | Bind host |
| `server.corsOrigin` | string[] | `http://localhost:3000,http://localhost:5175` | Allowed origins (server enforces 3000/3001 subset) |
| `log.level` | string | info | `debug\|info\|warn\|error` (pino + pretty) |
| `fleet.autoStart` | boolean | false | Launch Chrome fleet at boot (default lazy on first need) |
| `fleet.portStart` | number | 9222 | First CDP port |
| `fleet.portEnd` | number | 9250 | Last CDP port |
| `health.probeIntervalMs` | number | 30000 | Health probe cadence |
| `surfaces.cliAliases` | boolean | true | Auto-derive CLI aliases from slug |
| `surfaces.enforceParity` | boolean | true | Fail boot on cross-surface parity drift |
| `storage.dataDir` | string | platform default | DB + profiles + cache + logs root |
| `storage.dbPath` | string | `<dataDir>/cap-store.sqlite` | Legacy single-DB path (dual-DB now `systemDbPath`/`userDbPath`) |
| `storage.retainOldDays` | number | 7 | Archived old location retention after relocation |

## 2. Env vars (static config — read once at import)

```
Server/data:  CAP_STORE_HOST(127.0.0.1) CAP_STORE_PORT(9420) CAP_STORE_DATA_DIR CAP_STORE_DB_PATH
              SYSTEM_DATABASE_URL(file:→system.db) USER_DATABASE_URL(file:→user.db)
              CAP_STORE_PROFILE_DIR(<dataDir>/chrome-profiles) CAP_STORE_CORS_ORIGIN CAP_STORE_LOG_LEVEL
Auth:         CAP_STORE_AUTH_TOKEN(null=dev allow-all) VIVIM_CONFIRMATION_SECRET(dev fallback, REQUIRED in prod)
Fleet/chrome: CAP_STORE_AUTO_START_FLEET CAP_STORE_CHROME_PATH CAP_STORE_FLEET_PORT_START/END(9222/9250)
              CAP_STORE_CIRCUIT_THRESHOLD(5) CAP_STORE_CIRCUIT_RESET_MS(30000) CAP_STORE_HPE_RETENTION_DAYS(30)
Storage:      CAP_STORE_ENCRYPT_DB  OTEL_EXPORTER_OTLP_ENDPOINT(null=no-op) OTEL_SERVICE_NAME(vivim-final)
AI/opencode:  AI_GATEWAY_ENABLED(0) PROVIDER_PROTOCOL_SOURCE(prod) OPENCODE_SERVE_ENABLED(0)
              OPENCODE_SERVE_PORT OPENCODE_SERVER_PASSWORD/USERNAME OPENCODE_MODEL_SYNC_ENABLED(1)
              OPENCODE_MODEL_SYNC_INTERVAL_HOURS(24) OPENCODE_MODEL_SYNC_REFRESH
Kernel:       VIVIM_EXECUTION_KERNEL(0) VIVIM_EXECUTION_KERNEL_ALLOW_DESTRUCTIVE/FINANCIAL/COMMUNICATION/SECURITY(0)
              VIVIM_EXECUTION_KERNEL_MAX_RISK_TIER(3)  MCP_PORT
Tunnel/P2P:   VIVIM_TUNNEL_ENABLED(1) VIVIM_TUNNEL_URL(wss://tunnel.vivim.live/connect) VIVIM_SUBDOMAIN
              VIVIM_TUNNEL_TOKEN VIVIM_TUNNEL_HEARTBEAT_MS(30000)/TIMEOUT(10000) RECONNECT_INITIAL(1000)/MAX(30000)
              JITTER(0.3) MAX_REQUESTS(50) REQUEST_TIMEOUT(60000)
              VIVIM_P2P_ENABLED(1) VIVIM_P2P_BOOTSTRAP VIVIM_P2P_MDNS(1)/INTERVAL(300000) DHT(1) RELAY(1)
              MAX_PEERS(50) MAX_TRANSFERS(5) MAX_FILE_SIZE(104857600) IDENTITY_PATH
Local server: VIVIM_LOCAL_SERVER_ENABLED(1) HOST(127.0.0.1) PORT(8080) CORS(1) CORS_ORIGINS RATE_LIMIT(60)
              MAX_BODY(10485760) STATIC_DIR(./workspace-ui)
Orchestrator: VIVIM_ORCHESTRATOR_HEALTH_MS(30000) RESTART_DELAY(5000) MAX_RESTARTS(3) STATUS_MS(60000)
CLI:          VIVIM_API_URL VIVIM_WORKSPACE  DEBUG  NODE_ENV(production gates confirmation secret)
```

Mutations: `setStoragePaths(dataDir, dbPath)` (migration Phase 4 SWITCH) + `setDatabaseUrl(url)` (relocation) — caller must close/reopen Prisma; `writeServerPortFile(port)` records the auto-walked port for CLI/frontend discovery. Import side effect: `mkdirSync(dataDir + profileBaseDir, recursive)` once per process (safe for tests/sidecar).

## 3. Ports & paths cheat sheet (code values, not guesses)

| Concern | Value | Source |
|---------|-------|--------|
| Backend HTTP | 9420 → scan +200, record `.runtime/backend.port` | `config.ts:getServerPort`, `server/index.ts:startOnFreePort` |
| Chrome fleet | 9222–9250 | `fleet.portStart/End`, `config.fleetPortRange*` |
| Serverless discovery | 9300–9400 | `cli/discovery-stack.ts:buildLocalDiscoveryStack` |
| Frontend dev | 3000 (CORS also 3001) | `frontend` dev script, server allowlist |
| Local static server | 8080 | `localServer.port` |
| Profiles | `<dataDir>/chrome-profiles` | `config.profileBaseDir` (single source of truth) |
| System/user DBs | `<dataDir>/prisma/data/system.db` + `user.db` | `resolveSystemDbPath/resolveUserDbPath` |
| Tunables file | `.runtime/config.tunables.json` | `TUNABLE_FILE` |
| OpenAPI | `/api/openapi.json` + `/docs` Swagger | `server/index.ts` no-auth handlers |
| Frontend static | `FRONTEND_DIR` env → `Bun.file` + SPA fallback | both `fetch()` chains |

## 4. `package.json` scripts that matter (operators only need ~12 of ~60)

```
run:      dev (scripts/dev.ts) | stop | dev:backend/serve (cli serve) | dev:frontend/frontend:dev (port 3000)
persist:  seed (cli seed all) | migrate (cli migrate --source all) | prisma:seed
          prisma:migrate:dev:system/user | prisma:migrate:prod:system/user | prisma:generate:* | prisma:push:* | prisma:studio:*
          db:doctor | db:backup | db:restore | seed:snapshot
verify:   test test:unit test:integration test:e2e test:arch test:fast | typecheck | lint | format | coverage | ci | ci:fix
          providers:smoke (scripts/provider-harness.ts) | bench
gen:      docs:openapi docs:manual | taxonomy:generate taxonomy-gen taxonomy:openclaw | generate-skills | gen:protocol
ops:      devops (devops/index.ts) | devops:toolkit | web:dev web:build frontend:build(:tauri) frontend:typecheck | tauri:dev tauri:build
```
