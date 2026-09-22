# Coverage — How Full Is Full (v2.0 lock)

> Measured 2026-09-18 by `bun run source-atlas/build-atlas.ts` (no docs read).
> Denominator = TS/TSX files on disk per area. Numerator = files present in
> `ATLAS-FILES.json` + the `generated/*.md` index for that area (always 100% by
> construction — the generator walks the same dirs). Semantic depth (header →
> paragraph) varies; the table below is honest about which layer is human vs machine.

## Totals (disk = atlas)

| Area | Files | Human catalog | Generated index | Depth |
|------|-------|---------------|-----------------|-------|
| `src` | 1047 | L2 clusters + L3 engines/subsystems/storage-parity/server/mcp/cli + LA all | `gen-engines-*, gen-storage, gen-server, gen-cli, gen-mcp, gen-executor-*, gen-src-misc, gen-schema` | full list + family semantics |
| `src/engines` total/flat/sub | 460 / 186 / 274 | `engines.md` (flat) + `engines-subfolders.md` (33 dirs) | `gen-engines-flat.md`, `gen-engines-sub.md` | every file: header + export count; families have paragraphs |
| `frontend/src` | 575 (incl. 90 `route.ts`) | `frontend-routes.md`, `frontend-engines-storage.md`, `frontend-architecture.md` | `gen-frontend-routes.md`, `gen-frontend-engines-storage.md`, `gen-frontend-misc.md` | every route/engine/store listed; 90 routes grouped |
| `shared` / `sdk` | 12 / 3 | `shared-kernel.md`, `frontend-sdk-shared-tauri.md`, `ops-surfaces.md` | `gen-shared-sdk.md` | every file listed |
| `seeds` | 36 TS (+ JSON manifests) | `seed-inventory.md` | `gen-seeds.md`, `gen-seeds-detail.md` | every loader + manifest listed |
| `tests` | 499 (unit 378 / integration 59 / e2e 24 / rest 38) | `testing-and-quality.md` | `gen-tests-unit.md`, `gen-tests-integration-e2e-arch.md` | every file listed; 9 arch tests have paragraphs |
| `scripts` | 69 | `ops-surfaces.md`, `operations.md` | `gen-scripts.md` | every file listed; top-25 grouped |
| `devops` | 183 | `ops-surfaces.md`, `cli-complete.md` §9 | `gen-devops.md` | every file listed; 13 dirs grouped |
| `prisma` | 201 models (111+90) | `prisma-models.md`, `data-dictionary.md`, `prisma-columns.md` | `gen-prisma-columns-system/user.md` | every model + every `field:Type` |
| `src/schema` | 38 | `zod-schemas.md`, `zod-full.md` | `gen-schema.md`, `gen-zod-full.md` | every file + top exports |
| `src/server` | 30 routers + 10 routes + bootstrap | `surfaces.md`, `server-routers-full.md`, `boot-and-runtime.md` | `gen-server.md`, `gen-server-routers-detail.md` | every router + prefix hits |
| `src/cli` + `src/mcp` | 7 cmds + 11 mcp files (37 tools) | `cli-complete.md`, `mcp-cli-full.md`, `api-reference.md` | `gen-cli.md`, `gen-mcp.md` | every tool/command listed |
| **Total TS** | **2424** | — | `ATLAS-FILES.json` | 100% file presence |

## What "100%" does and doesn't mean
- DOES: any file path can be found in `ATLAS-FILES.json` → its area's `generated/*.md` (header+exports) → its human catalog (family semantics). `build-atlas --check` fails otherwise.
- DOESN'T: every file has a hand-written paragraph (274 engine-sub + 378 unit tests + 183 devops get one line + family paragraph — deliberate; paragraphs live at family level).
- Non-TS (Rust `src-tauri/`, SQL baselines, JSON manifests, root configs) is inventoried by name in `ops-surfaces.md` + `seed-inventory.md`, not line-parsed.

## Keeping it full (the lock)
1. Add a file → it appears in the next `build-atlas.ts` run; `--check` fails until `ATLAS-FILES.json` is regenerated (commit it).
2. Add a capability/table/route/tool → update the human catalog in the same PR (taxonomy→binding→program→slot→parity order; see `01-AUDIENCES.md` §5).
3. Rename/delete → generator drops it; `--check` fails until the human catalog reference is removed.
4. Weekly: `bun run source-atlas/build-atlas.ts --check` in CI (lefthook pre-push runs it).
