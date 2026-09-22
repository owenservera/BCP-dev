# L0 — System Overview (derived from `package.json` + entry points)

Package: `vivim-final@1.0.0` — "cap-store v1 Knowledge Graph Rebuild — local-first AI conversation platform".
Module type: `module`. Main: `src/index.ts`. Binary: `vivim → src/cli/index.ts`.
Runtime requirement: `bun >= 1.3.14`, `node >= 20` (engines field).

## L0.1 Runtime + toolchain (from `package.json` + root configs)

| Concern | Evidence in code/root | Value |
|---------|----------------------|-------|
| Runtime | `package.json.engines` | Bun 1.3.14+ (primary), Node 20+ (compat) |
| Language | `tsconfig.json`, all `src/**/*.ts` | TypeScript strict, ESM (`type: module`) |
| ORM | `prisma/system/schema.prisma`, `prisma/user/schema.prisma` | Prisma 6.19.3, two databases (system + user) |
| Validation | `src/schema/*`, `src/mcp/zod-schema.ts`, zod dep | zod 4.4.3 |
| IDs | `src/ids.ts` | ULID (`ulid` + `ulidx`), deterministic `slave:`, `cap:`, `bind:`, `prog:`, `sel:` derivations + SHA-256 `hashContent` |
| Errors | `src/errors.ts` (365 lines) | `CapStoreError{code,message,details}` base; `ValidationError, NotFoundError, ConflictError, AuthRequired, SlaveNotRunning/Busy, CdpTimeout, CircuitOpen, Memory*, UpdateError…` |
| Logging/otel | `src/engines/logger.ts`, `otel-sink.ts`, `observation-tap.ts`, pino dep | pino 10.3.1 + pretty |
| Build | `tsup.config.ts`, `scripts.build` | tsup ESM (`tsup src/index.ts --format esm --no-dts`) |
| Lint/format | `biome.json`, `lefthook.yml` | Biome 2.5.8, lefthook git hooks |
| Tests | `bun.test.config.ts`, `tests/*`, scripts `test*` | `bun test` — `unit | integration | e2e | arch | fuzz | chaos | load | stress` |
| Crypto/P2P | deps | `@noble/ed25519`, `@noble/hashes`, `libp2p` stack (tcp, websockets, kad-dht, noise, yamux…), `cozo-node`, `alasql` |
| Sandbox | deps + `src/engines/sandbox-runner*.ts` | `quickjs-emscripten` (primary) + `isolated-vm`; `sandbox-runner.ts` facade over `sandbox-runner-quickjs.ts` + `sandbox-runner-vm.ts` |
| AI | deps | `@ai-sdk/openai-compatible`, `@huggingface/transformers` |
| Desktop | `src-tauri/`, scripts `tauri:dev/build` | Tauri V2 shell (Rust) + `frontend` web UI |
| Frontend | `frontend/` package `vivim-frontend@0.2.0` | Next.js 16 + React 19 + Tailwind 4 (App Router at `frontend/src/app/`) |

## L0.2 The three roots (from entry files)

```
                    ┌─────────────────────────────┐
                    │        src/index.ts         │  462-line public barrel
                    │  VERSION + ~200 re-exports  │  (every engine + store + schema)
                    └──────────────┬──────────────┘
                                   │ imports
        ┌──────────────────────────┼──────────────────────────┐
        ▼                          ▼                          ▼
 src/cli/index.ts           src/server/index.ts        src/mcp/server.ts
 operator root              serving root               agent root
 serve|migrate|seed         bootstrap-engines +        stdio/HTTP tools
 pipeline-engine +          service-container +        browser/discovery/
 command-registry (7 cmds)  ~30 routers + ws + mw      nlcl tools
```

- **Operator root** — `src/cli/index.ts` + `src/cli/command-registry.ts` + `src/cli/commands/*.ts`
  (7): `seed.ts`, `migrate.ts`, `automate.ts`, `builtins.ts`, `moments.ts`,
  `onboard-provider.ts`, `registry-bridge.ts`. Plus `pipeline-engine.ts`, `discovery-stack.ts`,
  `provider-harness.ts`, `repl.ts`, `output-formatter.ts`, `json-schema.ts`.
- **Serving root** — `src/server/index.ts` + `bootstrap/` + `bootstrap-engines.ts` +
  `bootstrap-seeds.ts` + `service-container.ts` + `module-registry.ts` + `engines-catalog.ts` +
  `middleware/` + `auth-gate.ts` + `validate.ts` + `response.ts` + `websocket.ts` +
  `canvas-ws.ts` + ~30 `*-router.ts` + `routes/*.ts` (10).
- **Agent root** — `src/mcp/server.ts` + `index.ts` + `browser-mcp.ts` + `browser-tools.ts` +
  `discovery-tools.ts` + `nlcl-tools.ts` + `types.ts` + `zod-schema.ts` + `serp-parser.ts`.

## L0.3 Data plane (from storage + prisma entry files)

```
 src/storage/store-factory.ts   backend: 'sqlite'|'postgres'|'mysql' + CapStoreDb handle
 src/storage/prisma.ts          Prisma client wiring (system + user)
 src/storage/snapshot.ts        snapshot/restore
 src/storage/verify-compat.ts   backend compat check
 src/storage/migration/         types.ts + migrations-registry.ts + migration-runner.ts + index.ts
 src/storage/contracts/ (67 = 60 top + 7 onboarding/) ──► THE LAW: Row types + Store interfaces (see L4)
 src/storage/impl/ (71) ───────► Prisma-backed implementations, one per contract
 prisma/system/schema.prisma     111 models — provider/capability/telemetry/workflow/kernel/…
 prisma/user/schema.prisma       90 models — session/conversation/memory/entity/sync/…
 seeds/* (11 dirs)               initial rows for taxonomy, capabilities, parsers, providers…
```

ID derivation (`src/ids.ts`, 52 lines) is the key to reading every foreign key:

- `newId()` → ULID (monotonic, sortable). Everything primary-keyed with this.
- `deriveSlaveId(providerId, accountId)` → `slave:{provider}:{account}` — Chrome slave singleton key.
- `deriveCapabilityId(providerId, slug)` → `cap:{provider}:{slug}`.
- `deriveBindingId(globalCapId, providerId)` → `bind:{global}:{provider}`.
- `deriveProgramId(bindingId, version)` → `prog:{binding}:v{n}`.
- `deriveSelectorId(capabilityId, providerId, name)` → `sel:{cap}:{provider}:{name}`.
- `hashContent(content)` → SHA-256 hex (node:crypto) with FNV-1a fallback (dedup-only, not integrity).

## L0.4 Request lifecycle (assembled from router + engine + store imports)

1. **Ingress** — CLI (`command-registry`) | HTTP (`server/*-router.ts` + `routes/*`) |
   WS (`websocket.ts`, `canvas-ws.ts`) | MCP (`mcp/server.ts` tools).
2. **Auth/validate** — `auth-gate.ts` → `validate.ts` (zod `src/schema/*`) → `response.ts` envelope.
3. **Capability resolution** — `capability-resolution.ts` + `capability-taxonomy.ts` +
   `capability-binder.ts` + `live-capability-registry.ts` read `CapabilityStore` contract.
4. **Execution** — `capability.ts` (CapabilityEngine) → `chrome-governor.ts` (only CDP owner) →
   `stream-parser.ts` (DB-loaded parser logic) → `stream-block-store.ts`.
5. **Memory/knowledge** — `memory-engine.ts` + `knowledge-ingestion.ts` + `knowledge-extractor*.ts` +
   `semantic-search.ts` write `memory-*` / `knowledge-*` stores + `MemoryEmbedding`.
6. **Resilience** — `retry-engine.ts`, `circuit` (`CircuitBreakerState`), `idempotency-guard.ts`,
   `request-queue.ts`, `lock-manager.ts`, `sla-monitor.ts` wrap every step.
7. **Observe** — `logger.ts` → `telemetry-aggregator.ts` → `TelemetrySummaryDaily` + `otel-sink.ts`;
   `alerting/alerter.ts` + `sliding-window.ts` + `dedup.ts` + `cooldown.ts` → `webhook.ts`.
8. **Automate** — `automation/scheduler.ts` + `workflow-engine.ts` + `workflow-compiler.ts` +
   `harness-runtime.ts` drive scheduled/replayed runs; `backup-scheduler.ts` snapshots.

## L0.5 Scale snapshot (measured)

- 1047 `src/**/*.ts` files; largest single flat namespace is `src/engines` (186 files).
- Public barrel `src/index.ts`: 462 lines, ~200 export statements — the authoritative
  "what is public" list. Anything not re-exported there is internal.
- 201 Prisma models across 2 DBs; 67 store contracts; 71 store impls; 38 schema files.
- 30+ HTTP routers + 10 grouped `routes/` + 2 WS channels + 11 MCP tool files + 7 CLI commands.
- 22 `frontend/src` zones; 11 `seeds` groups; 11 `tests` suites.
