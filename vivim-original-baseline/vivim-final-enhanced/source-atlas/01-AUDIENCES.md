# Atlas for All Audiences — Who Reads What, In What Order

> Every path below is a file in `source-atlas/` or a source file it describes.
> No prior docs were read — all routes were derived from `src/`, `prisma/`,
> `frontend/src/`, `shared/`, `package.json`, `src/index.ts`, `src/config.ts`.

## 1. Pick your audience

| You are… | You want… | Read in this order | Skip |
|----------|-----------|-------------------|------|
| **Executive / PM** | What is this, why does it exist, what can it do today? | `L0-system-overview.md` §L0.4 → `01-AUDIENCES.md` (this file) §7 → `architecture/00-ARCH-README.md` → `architecture/risks-and-evolution.md` → `L2-module-clusters.md` C1–C5 headers only | L3/L4 (too deep) |
| **New engineer (day 1)** | Run it, break it safely, make first change | `03-QUICKSTART.md` → `L1-zone-map.md` → `architecture/boot-and-runtime.md` → `architecture/dependency-graph.md` → `L2-module-clusters.md` C1+C3 → `architecture/capability-lifecycle.md` | `risks-and-evolution` until week 2 |
| **Backend contributor** | Add/fix an engine, store, router without breaking invariants | `architecture/dependency-graph.md` → `architecture/boundaries-and-invariants.md` → `architecture/boot-and-runtime.md` → `L3-file-catalog/engines.md` + `subsystems.md` → `L4-contracts/storage-contracts.md` + `data-dictionary.md` → `architecture/error-catalog.md` | frontend files |
| **Frontend contributor** | Add a slot renderer, wire a capability button | `architecture/frontend-architecture.md` → `L3-file-catalog/frontend-sdk-shared-tauri.md` → `frontend/src/ui/slots.ts` (29 slots) → `frontend/src/registry/` + `storage/` mirror rule → `L3-file-catalog/api-reference.md` §frontend-consumed | `executor/`, `prisma/system` internals |
| **Operator / SRE** | Install, configure, back up, upgrade, debug prod | `architecture/configuration.md` → `architecture/operations.md` → `03-QUICKSTART.md` §ops → `architecture/security-and-auth.md` → `architecture/testing-and-quality.md` §gates | engine internals |
| **AI-agent integrator** | Drive the system via MCP / HTTP / CLI | `L3-file-catalog/api-reference.md` (all `/api/*` + WS + MCP tools) → `L3-file-catalog/cli-complete.md` → `shared/api-types.ts` → `architecture/security-and-auth.md` §auth | DB schemas |
| **Auditor / security reviewer** | Where are the trust boundaries, what can go wrong? | `architecture/boundaries-and-invariants.md` (I-1…I-10) → `architecture/security-and-auth.md` → `architecture/error-catalog.md` → `architecture/data-architecture.md` + `data-dictionary.md` §PII | UI polish |
| **Data engineer** | What is stored where, what are the keys? | `architecture/data-architecture.md` → `L4-contracts/data-dictionary.md` → `L4-contracts/prisma-models.md` → `L4-contracts/storage-contracts.md` → `src/ids.ts` | routers |

## 2. 10-minute map (read this if you read nothing else)

```
vivim-final@1.0.0  (package.json: name, version, bin vivim → src/cli/index.ts)
  local-first AI conversation platform — every browser action is a versioned
  capability (taxonomy → binding → program), executed only through one Chrome
  governor, persisted through typed store contracts, projected into hot-swappable UI.

Three roots (src/index.ts 462-line barrel + cli/index.ts + server/index.ts + mcp/server.ts):
  operator (CLI, 4 CLIs) · serving (HTTP 30+ routers + 2 WS + /health /readyz) · agent (MCP 27+3 tools)

Two databases (prisma/system 111 models + prisma/user 90 models, never joined at DB level):
  system = providers/taxonomy/telemetry/workflows (ships with release)
  user   = sessions/conversations/memories (survives reinstall, exportable)

One law for IDs (src/ids.ts 52 lines): ULID PKs + slave:/cap:/bind:/prog:/sel: derivations
One law for errors (src/errors.ts 365 lines): CapStoreError{code,message,details} hierarchy
One law for layers (src/arch/boundary-rules.ts 10 layers): shared → foundation → contracts
  → impl/infra → engines → executor → server/cli → frontend(only shared) → devops(anything)
```

## 3. Layer → audience matrix

| Atlas layer | Answers | Primary audience | Source of truth |
|-------------|---------|------------------|-----------------|
| L0 system | How do I run it? | everyone | `package.json`, `src/index.ts`, `src/cli/index.ts`, `src/server/index.ts` |
| L1 zones | Where does code live? | new eng, architect | `src/*` (31 dirs on disk) + `frontend/src/*` (22) + `prisma/*` + `seeds/*` |
| L2 clusters | What functional families? | backend, PM | 186 `src/engines/*.ts` prefix families (C1–C12) |
| L3 files | What does each file do? | contributor | per-file headers + exports + imports |
| L3 api-reference (NEW) | What can I call? | integrator, frontend, operator | `src/server/index.ts` fetch() + `src/mcp/*` + `src/cli/*` |
| L3 subsystems (NEW) | What do executor/ai/canvas/fleet/intel do? | backend | `src/executor/*` (19), `src/ai/*` (40+), `src/canvas/*` (15), `src/fleet/*`, `src/intel/*` (12) |
| L4 contracts | What shapes are persisted/validated? | backend, data | 67 contracts + 201 Prisma models + 38 zod schemas + `ids` + `errors` |
| L4 data-dictionary (NEW) | Which table holds what, which keys join? | data, auditor | `prisma/system` (111) + `prisma/user` (90) + `src/ids.ts` |
| LA architecture | Why shaped this way? | architect, auditor | `src/arch/*` + `tests/arch/*` + bootstrap + container |
| LA capability-lifecycle (NEW) | How does one capability execute end-to-end? | everyone technical | `capability.ts` + `capability-resolution.ts` + `chrome-governor.ts` + `stream-parser.ts` |
| LA security-and-auth (NEW) | Who can call what, what is sandboxed? | auditor, operator | `auth-gate.ts`, `config.ts`, `consent-engine`, `sandbox-runner*`, `db-encryption` |
| LA configuration (NEW) | How do I configure ports/paths/models? | operator | `src/config.ts` TUNABLE_SCHEMA (13 keys) + env vars |
| LA operations (NEW) | How do I deploy/backup/migrate/observe? | operator, SRE | `package.json` scripts (~60) + `scripts/*` (25) + `devops/*` + `service-container.ts` |
| LA testing-and-quality (NEW) | How do I verify a change? | contributor | `tests/*` (498 files: 378 unit + 59 integration + 24 e2e + 11 arch) |
| LA error-catalog (NEW) | What failed and how do I recover? | everyone on-call | `src/errors.ts` (40+ classes) + `response.ts` + recovery chain |
| Glossary + Quickstart (NEW) | What do words mean, how do I boot? | newcomer | code identifiers only |

## 4. Anti-routes (what NOT to read first)

- Do not start at `src/engines/` (186 flat files, no folder guidance) — start at `L2-module-clusters.md`.
- Do not start at `prisma/system/schema.prisma` (111 models) — start at `data-dictionary.md`.
- Do not start at `frontend/src/` (22 zones) — start at `frontend-architecture.md` + slots list.
- Do not copy `BootstrapContext` into new code — it is boot-only privileged memory (see `boot-and-runtime.md` §2); routers/engines must never accept it.

## 5. Contribution lanes (smallest safe change per role)

- Backend: 1 contract method + 1 impl method + 1 mem-double method + 1 arch test (`store-contract-parity`) — never import `impl/` from `engines/`.
- Frontend: 1 slot renderer in `frontend/src/registry/` + 1 `SLOT_META` entry if new slot — never import backend beyond `shared/`.
- Capability: taxonomy row → binding row → program row → slot renderer → parity check (`capability-parity.ts` + `api-contract.test.ts`) in that order.
- Boot: add a phase module that writes to `BootstrapContext` + append in `plugin-kernel/bootstrap/orchestrator.ts` — never reorder existing 5 phases.

## 6. Glossary of atlas shorthands

- **K0** = kernel (`src/plugin-kernel/`, 18 files today, 17-subsystem target). **K1** = first-party surfaces (`src/server/`, `src/engines/`, `src/cli/`).
- **Governor Canon** = only `chrome-governor*.ts` via `src/executor/` touches CDP.
- **Parity** = FRONTEND = BACKEND = SDK = CLI = API (enforced by `capability-parity.ts` + `api-contract.test.ts`).
- **Slave** = one Chrome profile per `(provider, account)` keyed `slave:{provider}:{account}`.
- **Seeds → stores → knowledge → capabilities → lifecycle** = the only legal boot order.

## 7. What this system can do today (capability inventory for PMs)

From routers + MCP tools + CLI observed in code (see `api-reference.md` for full list):

- Converse with versioned providers through governed Chrome slaves (`/api/conversations/*`, `/api/chrome/*`, `/api/route/*` mux fan-out).
- Resolve any global capability to best provider program (`/api/capabilities/*`, `capability-resolution.ts` confidence+tier+health).
- Parse streamed provider output with DB-versioned parsers (`stream-parser.ts`, `/api/generative/*`).
- Remember across sessions (episodic/semantic/procedural + embeddings + entities, `/api/memory/*`, `/api/knowledge/*`).
- Automate on schedule or via harness replay (`/api/automate/*`, `/api/autonomous/*`, `/api/harness/*`, `automate` CLI 10 subactions).
- Discover new provider capabilities from live DOM (`discover_*` 27 MCP tools, `/api/nlcl/*`, `POST /api/interpret` NL shell).
- Project everything into hot-swappable canvas/UI slots (29 `SLOT_IDS`, `/api/canvas/*`, `/api/agent/canvas/*`, `/api/surface/*`, `/api/mutation/*`, `/api/template/*`, `/api/variant/*`).
- Sync/collaborate realtime (WS `/ws`, `canvas-ws.ts`, `/api/sync/*`, `/api/containers/*`, `/api/content/*`, `/api/notifications/*`, `/api/contacts/*`, `/api/media/*`, `/api/nodes/*`, `/api/collections*`).
- Operate the fleet (`/api/setup/*` workspace/profiles/launch-visible/verify/complete/restore, `/api/version/*`, `/api/update/*`, `/api/tunnel/*`, `/api/storage/*`, `/health`, `/readyz`, `/api/openapi.json`, `/docs` Swagger).
