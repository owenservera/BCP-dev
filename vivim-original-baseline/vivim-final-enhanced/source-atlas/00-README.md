# SOURCE ATLAS — Master Librarian Index (v2.0: full coverage, 2424 files)

> Built from **source code only**. No prior docs were read.
> Method: full walk (src 1047 + frontend 575 + tests 499 + devops 183 + scripts 69 + seeds 36 + shared 12 + sdk 3 = 2424 TS/TSX)
> + `package.json` + `src/index.ts` barrel + `src/ids.ts` + `src/errors.ts` +
> `prisma/system` (111) + `prisma/user` (90) model parse + `src/schema/*` (38) +
> `src/server/*` (30 routers) + `src/cli/*` + `src/mcp/*` (37 tools) + `frontend/src/app` (90 routes).
> Machine inventory: `ATLAS-FILES.json` + `generated/` (23 files, every path + header + export count).
> Hand catalogs provide semantics; generated indexes provide completeness. `bun run source-atlas/build-atlas.ts --check` locks it.

## What this is

A complete, layered map of the `vivim-final` codebase from the top of the system
down to every individual persistence / validation contract found in code.

## Layer legend (L0 → L4)

| Layer | Name | Question it answers | Source of truth |
|-------|------|---------------------|-----------------|
| **L0** | System | What is this repo, how does it run, what are the entry points? | `package.json`, `src/index.ts`, `src/cli/index.ts`, `src/server/index.ts`, `bunfig.toml`, `tsup.config.ts` |
| **L1** | Zones | What are the top-level code territories? | `src/*` directories (31 on disk; v1.1 mapped 28 + `__generated__`/shared/extra) + `frontend/src/*` + `prisma/*` + `seeds/*` + `sdk/*` + `shared/*` + `src-tauri/*` |
| **L2** | Module clusters | What functional families live inside zones? | File-name clustering of `src/engines/*.ts` (186 files) + sibling zones |
| **L3** | Files | What does each file do, what does it export, what does it depend on? | Per-file header comment + export list + import list (`L3-file-catalog/`) |
| **L4** | Contracts | What are the exact persisted / validated shapes? | `src/storage/contracts/**/*.ts` (67 files: 60 top + 7 onboarding) + `prisma` models (201) + `src/schema/*.ts` (38 files) + `src/ids.ts` + `src/errors.ts` + `shared/*.ts` |
| **LA** | Architecture | Why is it shaped this way? What may import what, in what order does it boot, what must never break? | `src/arch/*` + `tests/arch/*` + `src/plugin-kernel/bootstrap/*` + `src/server/bootstrap/*` + measured imports (`architecture/`) |

Reading order: `01-AUDIENCES.md` (pick your audience first) → `L0-system-overview.md` → `L1-zone-map.md` → `L2-module-clusters.md`
→ `L3-file-catalog/*.md` (incl. `api-reference.md`, `subsystems.md`, `cli-complete.md`) → `L4-contracts/*.md` (incl. `data-dictionary.md`)
→ `architecture/*.md` (design context for all layers).
New in v1.2.0 (all audiences): `01-AUDIENCES.md` (who reads what), `02-GLOSSARY.md` (code-traced terms),
`03-QUICKSTART.md` (boot/call/break-fix), `L3 api-reference` (every `/api/*` + WS + MCP tool),
`L3 subsystems` (executor/ai/canvas/fleet/intel + rest), `L4 data-dictionary` (which table holds what),
`architecture/capability-lifecycle|security-and-auth|configuration|testing-and-quality|operations|error-catalog`.
Start at `01-AUDIENCES.md` if you don't know where you belong.

## Folder layout

```
source-atlas/
  00-README.md                  ← you are here
  01-AUDIENCES.md               ← NEW: who reads what (executive/new-eng/backend/frontend/operator/agent/auditor/data)
  02-GLOSSARY.md                ← NEW: ubiquitous language, every term traced to code
  03-QUICKSTART.md              ← NEW: boot/call/break-fix from package.json + config + server
  L0-system-overview.md         ← L0: runtime, entry points, dependency skeleton
  L1-zone-map.md                ← L1: all 31 src zones on disk (v1.1 mapped 28) + 7 outer areas
  L2-module-clusters.md         ← L2: 12 engine clusters + cross-zone families
  L3-file-catalog/
    engines.md                  ← L3: 186 flat src/engines files, clustered
    engines-subfolders.md       ← L3 NEW v2: 274 nested engine files (33 dirs, nlcl 60)
    storage.md                  ← L3: store-factory, prisma.ts, 71 impls, migration/
    storage-parity.md           ← L3 NEW v2: 67×71 contract→impl→mem matrix
    surfaces.md                 ← L3: server/routes+routers, cli/commands, mcp/, api/
    server-routers-full.md      ← L3 NEW v2: 30 routers × prefix × backing
    mcp-cli-full.md             ← L3 NEW v2: 37 MCP tools + 4 CLIs
    frontend-sdk-shared-tauri.md← L3: frontend/src, sdk/src, shared/, src-tauri/
    frontend-routes.md          ← L3 NEW v2: 90 frontend route.ts grouped
    frontend-engines-storage.md ← L3 NEW v2: 30 engines + 26+26 storage + registry/api
    ops-surfaces.md             ← L3 NEW v2: scripts 69 + devops 183 + sdk/tauri/misc
    cli-complete.md             ← L3: 4 CLIs, dual-mode dispatch, all flags/subcommands
    api-reference.md            ← L3: every /api/* + WS + MCP tool
    subsystems.md               ← L3: executor/ai/canvas/fleet/intel + remaining src/* zones
  generated/                    ← NEW v2: machine file lists (do not hand-edit; 23 files)
  L4-contracts/
    storage-contracts.md        ← L4: all 67 contract files, rows + store interfaces
    prisma-models.md            ← L4: 111 system + 90 user models, grouped
    prisma-columns.md           ← L4 NEW v2: every model field:Type (generated detail)
    zod-schemas.md              ← L4: 38 src/schema files, types + validators
    zod-full.md                 ← L4 NEW v2: per-file export names (generated detail)
    seed-inventory.md           ← L4 NEW v2: 36 loaders + JSON manifests + load order
    shared-kernel.md            ← L4: ids.ts, errors.ts, config.ts, index.ts barrel
    data-dictionary.md          ← L4: which table holds what, join keys, hot reads
  architecture/                 ← LA: design context for the whole repo
    00-ARCH-README.md           ← LA index + one-page mental model
    dependency-graph.md         ← LA: 10-layer lattice + measured coupling
    boundaries-and-invariants.md← LA: 10 load-bearing rules (I-1..I-10)
    boot-and-runtime.md         ← LA: 5 boot phases + DI lifecycle + request path
    data-architecture.md        ← LA: dual-DB, ID joins, row conventions
    frontend-architecture.md    ← LA: slots + registry + surface parity
    risks-and-evolution.md      ← LA: kernel 6/17 gap + hotspots + PR order
    capability-lifecycle.md     ← NEW: 9-step trace ingress→resolution→governor→parser→memory
    security-and-auth.md        ← NEW: bearer/CORS/trace + consent/sandbox/kernel gates + fleet isolation
    configuration.md            ← NEW: 14 tunables + env vars + ports/paths + scripts that matter
    testing-and-quality.md      ← NEW: 498 test files, 9 arch tests, gates, per-change decision tree
    operations.md               ← NEW: deploy/migrate/seed/backup/observe/shutdown
    error-catalog.md            ← NEW: 40+ CapStoreError classes + HTTP + recovery chain
    coverage.md                 ← LA NEW v2: coverage % per area + the lock.
  ATLAS-FILES.json              ← NEW v2: machine inventory of all 2424 files
  omega/                          ← MSG-01 Omega artifacts (code-only, measured)
    01-provider-pilot-table.md    ← artifact 1: 16-manifest pilot table + pilot order
  generated/                    ← NEW v2: 23 complete lists (files/columns/exports/prefixes)
  ATLAS-INDEX.json              ← machine-readable layer → file → contract index (v2.0.0)
  build-atlas.ts                ← re-scanner: regenerates counts + verifies drift
```

## Design decisions (made by the Librarian, from code evidence)

1. **L0 is the runtime system, not a doc layer.** `package.json` says `bun >= 1.3.14`,
   `src/index.ts` (462-line barrel) is the public surface, `src/cli/index.ts` is the
   operator surface (`serve | migrate | seed`), `src/server/index.ts` + `bootstrap-engines.ts`
   is the serving surface. Everything else hangs off these three roots.
2. **Storage contracts are the L4 ground truth for the backend.** Every engine imports
   types from `src/storage/contracts/*.ts`, never from `src/storage/impl/*.ts` directly
   (verified in `capability.ts`, `conversation-manager` pattern). `store-factory.ts`
   selects `sqlite | postgres | mysql`. So contracts — not impls — are documented as law.
3. **Prisma is split in two databases.** `prisma/system/schema.prisma` (111 models:
   providers, taxonomy, bindings, programs, telemetry, workflows…) vs
   `prisma/user/schema.prisma` (90 models: sessions, conversations, memories, entities…).
   The atlas keeps them separate everywhere.
4. **Engines are clustered by filename semantics, not by folder** — because `src/engines/`
   is flat (186 files, plus 33 sub-folders like `actor/`, `chrome/`, `kernel/`, `nlcl/`).
   The 12 clusters in L2 are derived from prefix families (`capability-*`, `provider-*`,
   `harness-*`, `memory-*`, `stream-*`, `workflow-*`, …).
5. **The atlas is regenerable.** `build-atlas.ts` re-counts files, models, contracts and
   fails if the checked-in counts drift, so this documentation cannot silently rot.

## Measured totals (2026-09-18 scan, v2.0 full: 2424 TS/TSX)

- `src/**/*.ts`: **1047 files** (`src/engines` total **460** = flat 186 + sub 274, 33 dirs; `nlcl/` 60 recurse)
- `src/storage/contracts`: **67 files** (60 top + 7 `onboarding/`)
- `src/storage/impl`: **71 files**
- `src/schema/*.ts`: **38 files**
- `src/server`: 30 `*-router.ts` + 10 `routes/` + bootstrap/middleware/service-container (40 router+route)
- `src/cli/commands`: **7 files** (`automate, builtins, migrate, moments, onboard-provider, registry-bridge, seed`)
- `src/mcp/`: 11 files, **37 tools** (discovery 27 + nlcl 3 + browser 7)
- `prisma`: **201 models** (111 system + 90 user; every `field:Type` in `generated/gen-prisma-columns-*.md`)
- `seeds/`: **36 TS** (11 dirs) + JSON manifests (see `generated/gen-seeds-detail.md`)
- `tests/`: **499 files** (unit 378 / integration 59 / e2e 24 / rest 38; 11 suites)
- `frontend/src`: **575 files**, 22 zones + **90 `app/api/**/route.ts`**
- `scripts/`: **69 files** (25 top + 44 subdirs) · `devops/`: **183 files** (13 dirs) · `shared`: 12 · `sdk`: 3
- `frontend/src` zones: **22** (`actions, api, app, canvas, cli, components, engines, features, hooks, lib, ml, registry, render, schema, sdk, seeds, shared, storage, test-utils, types, typings, ui`)
