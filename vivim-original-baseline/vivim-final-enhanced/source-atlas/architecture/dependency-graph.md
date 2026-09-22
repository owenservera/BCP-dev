# Dependency Graph — the 10-layer lattice (from `boundary-rules.ts` + measured imports)

> Source of truth: `BOUNDARY_RULES` in `src/arch/boundary-rules.ts` (lines 46-188).
> Cross-checked against `DEPENDENCY_GRAPH` in `tests/arch/layer-dependency.test.ts`
> and live import counts. Longest-prefix classification (`classifyPath`) decides
> ambiguous paths like `src/storage/contracts/*` (contracts wins over infra).

## 1. The lattice (allowed imports — arrows point DOWN, never up)

```
L0 shared                    mayImportFrom: []                        pure types, zero runtime deps
 │  ▲ imported by EVERYONE
 ▼  │
L1 src-foundation             mayImportFrom: [shared]                 errors.ts, config.ts, ids.ts, index.ts
 │  (files directly under src/)
 ▼
L2 storage-contracts          mayImportFrom: [shared]                 67 files — Row + Store interfaces only
 │  ▲ 65 engines import from here (measured)
 ▼  │
L3a storage-infra             mayImportFrom: [shared, src-foundation, │  prisma.ts, store-factory.ts, migration/*,
 │                              storage-contracts]                   │  db setup glue
L3b storage-impl              mayImportFrom: [shared, src-foundation, │  71 Prisma-backed impls (one per contract)
 │                              storage-contracts, storage-infra]     │  (+ *-mem.ts test doubles)
 ▼  │
L4 engines                    mayImportFrom: [shared, src-foundation, │  186 flat files — ALL domain logic
 │                              storage-contracts]  + zod only        │  NEVER impl/ (0 violations measured)
 ▼  │
L5 executor (Chrome CDP)      mayImportFrom: [shared, src-foundation, │  19 files: cdp.ts, cdp-transport.ts,
 │                              engines]                             │  launcher, fleet-*, profile-*, circuit-*
 ▼  │
L6a server                    mayImportFrom: [shared, src-foundation, │  bootstrap/*, service-container, ~30 routers,
 │   (API surface)              storage-*, engines, executor]         │  routes/*, websocket, canvas-ws
L6b cli                       mayImportFrom: [same as server]         │  7 commands + pipeline + repl + harness
 │                            (sibling, not child of server)
 ══╪═════════════════════════════════════════════════════════════════
L7 frontend                   mayImportFrom: [shared] ONLY            │  Next.js — internal imports free,
 │                            (from backend: shared/ only)            │  backend imports restricted to shared/
 ▼
L8 devops                     mayImportFrom: [everything]             │  tooling may import anything
```

Externals policy (from `allowedExternals`): `node:`/`bun:` everywhere; `zod` only in
contracts/engines/frontend; `@prisma/*` only in storage impl/infra. Anything else is a violation.

## 2. Measured coupling (scanner + grep, 2026-09-18)

| Edge | Count | Verdict |
|------|-------|---------|
| `src/engines/*.ts` → `storage/contracts` | **65 files** contain the import | Healthy — contract fan-in, the intended seam |
| `src/engines/*.ts` → `storage/impl` | **0 real imports** (1 comment-only match in `workflow-engine.ts`) | Healthy — boundary holds |
| `src/server/**/*.ts` → `engines/` | **116 matches** | Expected — server is a thin composition root over engines |
| `BunCdpClient` owners | `src/executor/cdp.ts` (defines) + `cdp-transport.ts` (adapts) + `engines/chrome-governor*.ts` (sole engine caller) | Governor Canon holds |
| `frontend/*` → backend (non-shared) | 0 by rule (enforced by `boundary-cdp.test.ts` + layer test) | UI cannot reach DB/engines directly |

## 3. Why the lattice looks this way (design rationale)

1. **Contracts sit BELOW engines so engines are unit-testable.** Any engine test swaps
   the Prisma impl for a `*-mem.ts` double without touching engine code. Inverting this
   (engines → impl) would weld business logic to Postgres/SQLite dialects.
2. **Executor sits ABOVE engines, not beside them.** Only the governor engine speaks to
   `src/executor/*`; all other engines request browser work through the governor. This makes
   CDP mockable at one choke point (`CdpTransportImpl`) and lets `fleet-limiter`,
   `circuit-breaker`, `profile-allocator` enforce global policy.
3. **Server and CLI are siblings with identical powers.** Both may reach impl directly
   (for seeding/migration scripts) but production request paths go through engines.
   This is why `bootstrapStoresPhase` lazy-imports impls inside the phase function
   (avoids circular module-load deps) rather than at file top.
4. **Frontend is quarantined to `shared/`.** The UI renders capability globals through
   `UIComponentRegistry` + `slots.ts`; it never imports a store, engine, or Prisma model.
   Backend-for-frontend happens over HTTP/WS/MCP, never over imports. This is what makes
   the desktop (Tauri), web (Next.js), and CLI render the same capability differently
   without forking logic.
5. **DevOps is omnipotent by design.** Migration scripts, auditors, and the boundary
   scanner itself must cross layers to do their job; restricting them would just push
   violations underground.

## 4. Module-level flow (the happy path through the lattice)

```
CLI cmd / HTTP router / MCP tool / WS frame
  │  (L6/L8 surface — validate via src/schema zod, auth via auth-gate)
  ▼
CapabilityResolutionEngine (L4 — reads contracts/capability-*)
  │  picks best binding/program by confidence + tier + health
  ▼
CapabilityEngine.execute (L4) → ChromeGovernor (L4→L5 edge)
  │  governor allocates slave:{provider}:{account}, checks circuit + fleet limits
  ▼
CdpTransportImpl → BunCdpClient (L5 — the ONLY CDP touchpoint)
  │  CDP commands run, selectors healed via selector-* engines
  ▼
StreamParserEngine (L4 — loads parser_logic_code from DB, never disk)
  │  emits stream blocks → StreamBlockStore (L4→L2 write via contract)
  ▼
Memory/Knowledge engines (L4) → memory-*/knowledge-* contracts (L2)
  │  embeddings, entities, cross-conversation synthesis
  ▼
TelemetryAggregator → TelemetrySummaryDaily (L2) + otel-sink; Alerter → webhook (L4→L6)
```
