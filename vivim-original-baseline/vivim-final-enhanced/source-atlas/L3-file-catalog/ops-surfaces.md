# L3 — Ops Surfaces (scripts 69 + devops 183 + sdk 3 + tauri + misc; lists in `generated/`)

> Operator surfaces are CLIs that operate on the repo itself. Backend CLI serves
> users; these CLIs serve the repo. Complete file lists: `generated/gen-scripts.md`
> (69), `generated/gen-devops.md` (183), `generated/gen-shared-sdk.md` (12+3),
> `generated/gen-src-misc.md` (non-engine/server/cli/mcp/storage/schema zones).

## scripts/ (69 = 25 top + 44 in subdirs `_archive/`, `db-reports/`, `devops/`, `tauri/`, `taxonomy-gen/`)
Top-25 purpose groups (names from disk): `dev.ts/stop.ts` (lifecycle), `provider-harness.ts` (`providers:smoke`), `verify-cross-surface.ts` (4-mode parity gate: offline/live/runtime/runtime-registry), `db-doctor/backup-db/restore-db/seed-snapshot.ts`, `taxonomy-gen/*` (openclaw generator), `openapi-gen/manual-gen.ts`, `setup-slaves/ensure-accounts.ts`, `debug-parser/test-parser/test-claude-parser.ts`, `ci.ts`, `runtime-test.ts`. Subdirs: `taxonomy-gen/` (generation pipeline), `db-reports/` (doctor reports), `tauri/` (desktop build helpers), `devops/` (repo-ops scripts), `_archive/` (retired, do not revive).

## devops/ (183, 13 top dirs)
`agentic/`, `audit-arch/` (graph/cycles/boundaries/coupling/cohesion/layering/commands), `audit-code/checks/{architecture,correctness,dependencies,drift,performance,quality,security,testing}`, `commands/`, `deep-scan/passes/{async-correctness,cross-surface,hot-path}`, `desktop/` (build/spawn/verify/state), `llm-testing/adapters/{api,cli,mcp,provider,surface,ui,workflow}`, `opencode/`, `roadmap/`, `router/`, `runtime-test/` (preflight/port/process-guard/ensure-browser/discover-cdp/discover-protocol/test-cap/test-harness/iterate/engage/10 stress scenarios/multiturn), `toolkit/` (regen/surface-parity), `truth/` (scanner/interface/design-comparator/gap-generator). Entry: `devops/index.ts` (`bun run devops <cmd>` 20 aliases — see `cli-complete.md` §9).

## sdk/ (3) + shared/ (12) + src-tauri + root configs
- `sdk/src/{client,index,react-sdk}.ts` — thin typed wrapper over backend routers (see `frontend-sdk-shared-tauri.md`).
- `shared/` 12 = 8 root (`api-types, canvas-types, stream-blocks, ui-component, ui-slots, …`) + `shared/parser/` (parser shape helpers). Rule: frontend may import `shared/` only.
- `src-tauri/`: `Cargo.toml`, `tauri.conf.json`, `capabilities/default.json`, `src/lib.rs`, `src/main.rs`, `build.rs`, `icons/`, `data/seeds/{parsers×8,providers×8}` (desktop-bundled shadow seeds).
- `src/*` misc (see `generated/gen-src-misc.md`): `api/{index,setup-client}`, `arch/{index,boundary-rules,boundary-scanner}`, `cleanup/{index,unused-exports,deprecated-events}`, `config/provider-registry`, `desktop/{frontend-route-mount,sidecar-entry}`, `domain/{index,slave-state-store,types}`, `framing/{engine,schemas,frame-version}`, `integration/{index,flag-registry}`, `lib/{catch-logger,logger,safe-json}`, `observability/*`, `observatory/*`, `reprogrammability/*`, `resilience/*`, `router/*`, `shared/*`, `transform/{types,transform-engine,index}`, `__generated__/{provider-protocol,.dev}` (codegen output, never hand-edit).

Root configs: `package.json` (~60 scripts), `bunfig.toml`, `tsup.config.ts`, `tsconfig.json`, `tsconfig.verify.json`, `biome.json`, `lefthook.yml`, `opencode.json`, `swarmvault.config.json`.
