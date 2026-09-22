# L3 — File Catalog: `src/storage/` (factory + prisma wiring + 71 impls + migration)

## Core wiring (5 files)

| File | Purpose (from header/exports) |
|------|-------------------------------|
| `store-factory.ts` | `StoreFactory{backend: sqlite\|postgres\|mysql, db: CapStoreDb}` + `getBackend/getDb/isPostgres/isSQLite`. Backend selector — the only place backend branches. |
| `prisma.ts` | Prisma client instantiation for system + user DBs. Imported by all `impl/*`. |
| `snapshot.ts` | DB snapshot / restore (pairs with `backup-scheduler` engine + `seed-snapshot` script). |
| `verify-compat.ts` | Backend compat verification (sqlite vs postgres vs mysql feature matrix). |
| `migration/{types,migrations-registry,migration-runner,index}.ts` | Migration types + registry (ordered list) + runner (apply/rollback) + barrel. Separate from Prisma `migrations/` SQL. |

## Contracts → impls matrix (67 contracts : 71 impls — 60 top + 7 onboarding/)

Convention read from code: `contracts/<name>.ts` declares `*Row` interfaces + `<Name>Store`
interface; `impl/<name>-impl.ts` implements it with Prisma; `impl/<name>-mem.ts` (where present)
is the in-memory fallback used by tests/MCP (`program-store-mem.ts`, `in-memory-heal-store.ts`
pattern also in `src/mcp/` + `src/canvas/in-memory-store.ts`).

Impl files observed (71): `workflow-version-store-impl`, `workflow-store-impl`,
`workflow-retry-queue-store-impl`, `version-store-impl`, `user-identity-store-impl`,
`ui-component-store-impl`, `telemetry-store-impl`, `sync-store-impl`, `stream-config-store-impl`,
`stream-block-store-impl`, `stealth-store-impl`, `slave-setup-store-impl`, `situation-store-impl`,
`shape-binding-store-impl`, `semantic-search-store-impl`, `semantic-memory-store-impl`,
`sandbox-audit-store-impl`, `router-store-impl`, `registration-store-impl`,
`provider-type-store-impl`, `provider-store-impl`, `program-store-mem` (+ ~50 more following
the same `<domain>-store-impl.ts` naming; full list regenerable via `build-atlas.ts`).

## How to read any impl (pattern verified in `stream-block-store-impl.ts`, `provider-store-impl.ts`)

1. Import `Row` + `Store` types from `../contracts/<name>.js` (type-only import).
2. Import Prisma client from `../prisma.js`.
3. Class `XStoreImpl implements XStore` with one method per contract method; Prisma table
   names are the lowercase plural of the Prisma model (e.g. `capabilityTaxonomy` →
   `CapabilityTaxonomy` model in `prisma/system`).
4. Time fields are Unix-epoch numbers (`createdAt: number`), booleans are `0|1`
   (`isActive: number`) — SQLite-compatible convention used across all rows.

## Migration subsystem

- `migration/types.ts` — `Migration{id, description, up, down}` shape.
- `migration/migrations-registry.ts` — ordered registry (source of truth for sequence).
- `migration/migration-runner.ts` — applies pending, records in `SchemaMeta`, supports rollback.
- `prisma/migrations/` (SQL) + `prisma/migrations.bak/` — raw SQL baselines; the TS runner
  sits above them for data migrations and compat checks.
