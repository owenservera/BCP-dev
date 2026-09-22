# Operations — Deploy, Migrate, Seed, Back Up, Observe, Shut Down

> From `package.json` scripts, `scripts/*.ts` (25), `src/server/index.ts`
> (`startOnFreePort`, `gracefulShutdown`, `BootPhase`), `src/storage/migration/*`,
> `prisma/*`, `src/server/bootstrap-seeds.ts` + `cli/commands/seed.ts`,
> `service-container.ts` (LIFO teardown), `devops/*`, `src-tauri/`.

## 1. Deploy shapes (three binaries, one repo)

| Shape | Build | Run | Notes |
|-------|-------|-----|-------|
| Backend (Bun) | `bun run build` (`tsup src/index.ts --format esm --no-dts`) | `bun run serve` / `dev:backend` (`cli serve` → `createServerWithEngines(9420)`) | Auto-walks 9420→9620 on clash; writes `.runtime/backend.port`; `BootPhase db-only→seeds-done→engines-ready→fully-booted`; `readyz` gates traffic |
| Web (Next.js) | `bun run web:build` / `frontend:build` (`--cwd frontend build`) | `bun run web:dev` / `frontend:dev` (port 3000) or serve via `FRONTEND_DIR` (backend serves `Bun.file` + SPA fallback) | CORS pre-approved for 3000/3001; desktop bag ports exact paths |
| Desktop (Tauri V2) | `bun run frontend:build:tauri` then `cargo tauri dev` / `tauri:build` | sidecar `src/desktop/sidecar-entry.ts` (TRUE binary entry; server `import.meta.main` removed to stop double-boot DB-lock theft) | Rust shell in `src-tauri/` (shell/updater/deep-links only, no TS domain logic) |

`scripts/dev.ts` / `stop.ts` wrap the full lifecycle; `devops/desktop/*` (build/spawn/verify/state) automates it; `devops/production-build.ts` is the release path.

## 2. Migrate + seed (order matters — seeds before stores before capabilities)

```bash
bun run migrate                 # cli migrate --source all → createServerWithEngines(PORT) (boot migrates)
bun run seed                    # cli seed all (same boot-seeds path)
bun run prisma:migrate:dev:system && bun run prisma:migrate:dev:user     # per-DB dev
bun run prisma:migrate:prod:system && bun run prisma:migrate:prod:user   # per-DB prod deploy
bun run prisma:generate:* | prisma:push:* | prisma:studio:*              # client/gen/push/inspect
bun run prisma:baseline:system/user  # regenerate baseline SQL (from-empty diff)
bun run seed:snapshot           # scripts/seed-snapshot.ts (snapshot/restore pair with storage/snapshot.ts)
```
Layers: raw SQL baselines (`prisma/*/migrations/`, + `migrations.bak/`) UNDER the TS runner (`storage/migration/{types,migrations-registry,migration-runner,index}.ts`: `Migration{id,description,up,down}` + ordered registry + apply/rollback + `SchemaMeta` record) UNDER seed loaders (`bootstrap-seeds.ts` + `seed.ts`: `seedAutomation`, `seedHarnessCommands` re-exported from `src/index.ts`; 11 seed dirs + `memory-intelligence.ts` + `og-capability-port.ts`). Never edit SQL + TS registry out of sync; parser changes need a seed version bump + `ParserTestResult` row, never silent.

## 3. Back up + restore + doctor

```bash
bun run db:doctor    # scripts/db-doctor.ts — compat matrix (sqlite|postgres|mysql via StoreFactory) + integrity
bun run db:backup    # scripts/backup-db.ts (+ BackupScheduler cadence, WorkspaceBackup rows)
bun run db:restore   # scripts/restore-db.ts
```
Retention jobs must stay scheduled after any cron change (`compaction-manager`, `eviction-manager`, `backup-scheduler` + `automation/scheduler.ts`); epoch-number times mean retention is application-driven (no DB TTL). Storage paths are runtime-mutable (`setStoragePaths` Phase 4 SWITCH, `setDatabaseUrl` repoint) — caller closes/reopens Prisma.

## 4. Observe (health → metrics → traces → alerts)

```
GET /health → {status,version}   GET /readyz → 503|{ready,uptime}   X-Trace-Id on every response
logger.ts (pino 10.3.1 + pretty) → telemetry-aggregator.ts → TelemetrySummaryDaily/CycleLog
  + CapabilityTelemetry + ProviderLatency/CostLog + HealthTick → otel-sink.ts (no-op without OTEL_EXPORTER_OTLP_ENDPOINT)
alerting/alerter.ts + sliding-window.ts + dedup.ts + cooldown.ts → webhook.ts (AlertCondition→AlertEvent)
health-digest.ts + HealthDigest rows → health.panel / fleet.controls slots
devops/activity-sink.ts + automation-activity-log.ts (repo self-observation)
```

## 5. Shut down (LIFO, no orphans)

`ServiceContainer.stopAll()` reverses registration (routers drain → orchestrators cancel → governor closes slaves → stores flush → `snapshot.ts` persists). `gracefulShutdown(SIGTERM/SIGINT)` runs `shutdownHooks[]` with per-hook try/catch then `process.exit(0)`; in-flight HTTP gets 503; `port-reaper.ts` sweeps orphan Chrome; `system-pressure.ts` backpressures before OOM. Compiled-binary note: sidecar entry owns signals (server module must not install its own `import.meta.main` listener).
