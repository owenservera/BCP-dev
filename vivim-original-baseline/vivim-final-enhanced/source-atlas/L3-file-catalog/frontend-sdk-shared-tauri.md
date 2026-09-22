# L3 — File Catalog: `frontend/` + `sdk/` + `shared/` + `src-tauri/` + `seeds/` + `tests/`

## `frontend/src/` — Next.js UI (22 zones)

`app/` (routes; top dirs observed: `api/`, `canvas/`) · `actions/` (server actions) ·
`api/` (fetch clients, mirror `src/server/*-router`) · `canvas/` + `render/` (scene rendering) ·
`components/` + `ui/` (design system) · `engines/` (frontend mirrors: canvas, workspace, plugin,
rbac, presence…) · `features/` (user moments) · `hooks/` (React hooks) · `lib/` (utils) ·
`ml/` (on-device scoring) · `registry/` (UI component registry — capability-global slots) ·
`schema/` (frontend zod, mirrors `src/schema`) · `sdk/` (frontend SDK shim) · `seeds/`
(demo seeds) · `shared/` (isomorphic helpers) · `storage/` (`contracts/` + `impl/memory` —
memory impls only; real persistence stays backend) · `test-utils/` · `types/` + `typings/` ·
`cli/` (canvas-scaffold etc.).
Entry: `frontend/src/app/` (App Router). Dev: `bun run --cwd frontend dev` (port 3000).
Key file pair: `frontend/src/ui/slots.ts` + `registry.ts` + `ui/defaults/` (slot → renderer map).

## `sdk/src/` — programmatic client

Thin wrapper over `src/api/` + `shared/api-types.ts`. Consumed by scripts, tests, and
external agents. (File list regenerable via `build-atlas.ts`; shape mirrors server routers 1:1.)

## `shared/` — isomorphic types (8 entries)

`api-types.ts` (request/response envelopes) · `canvas-types.ts` (scene nodes/edges) ·
`conceptual-model.ts` (concept graph) · `screenshot-budget.ts` (capture budgets) ·
`stream-blocks.ts` (stream block union) · `ui-component.ts` (component manifest) ·
`ui-slots.ts` (slot contract) · `parser/` (parser helpers shared BE/FE).

## `src-tauri/` — desktop shell (Rust)

Tauri V2 scaffolding (Rust). Commands bridge to `frontend/` build output
(`frontend:build:tauri`). No TS domain logic — shell, updater, deep-links only.

## `seeds/` — boot data (11 dirs + 2 files)

Dirs: `adapters/` · `automation/` · `capabilities/` · `command-descriptions/` ·
`conceptual-model/` · `harness/` · `intent-templates/` · `parsers/` · `providers/` ·
`system/` · `taxonomy/` · `user/`. Files: `memory-intelligence.ts` · `og-capability-port.ts`.
Loaded by `src/server/bootstrap-seeds.ts` + `src/cli/commands/seed.ts`
(`seedAutomation`, `seedHarnessCommands` are re-exported from `src/index.ts`).

## `tests/` — safety net (11 suites)

`unit/` (per-function) · `integration/` (engine × mocked store) · `e2e/` (full stack) ·
`arch/` (kernel boundary T-01..T-28 + certifier) · `fuzz/` (manifest fuzzer, 12 attack vectors) ·
`chaos/` · `load/` · `stress/` · `docs/` · `fixtures/` · `helpers/`.
Canonical gate (from repo conventions observed in `tests/arch`): `bun test tests/arch tests/fuzz`.
