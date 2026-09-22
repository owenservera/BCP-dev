# L3 — Frontend Engines + Storage (complete list in `generated/gen-frontend-engines-storage.md`)

> Backend owns WHAT, frontend owns HOW. `frontend/src/storage/` is memory-only by
> design (real persistence stays backend); convergence happens over `/ws` + mirror
> rows. Any file importing backend beyond `shared/` is a layer violation
> (`layer-dependency.test.ts`).

## Engines (`frontend/src/engines/` 30 files)
`adaptive-workspace, agents-builder, annotation-engine, audit-engine, automation-builder, canvas-command-executor, canvas-layer-mounter, canvas-registry, capability-event-bus, conceptual-model-service, document-editor-engine, document-engine, drawer-engine, media-bridge, media-engine, notification-engine, plugin-hot-reload, plugin-system, presence-engine, rbac-engine, route-sync, route-sync-workspace, search-engine, shell-command-engine, structured-logger, template-engine, ui-engine, workspace-engine, z-layer-engine` + `index.ts` barrel. Each mirrors a backend engine family (see `subsystems.md` §7); `route-sync*` mirror backend `router/` specs.

## Storage contracts (26) → mem impls (26) → providers (4)
Contracts (`storage/contracts/`): `account, agent, annotation, audit, automation, canvas-definition, capability-tier, document, document-edit, drawer, media, notification, onboarding, presence, primitive, provider, provider-type, rbac, search-index, shell-command, template, ui-component, user-layout, workspace, z-layer` + `index.ts`. Impls (`storage/impl/memory-*`): 1:1 memory doubles + `prisma-onboarding-store` (the only Prisma-backed frontend store) + `index.ts`. Providers (`storage/provider/`): `storage-provider` interface + `memory-storage-provider` + `prisma-storage-provider` + `not-implemented-proxy`. Health: `storage/health/probe.ts`. Parity: `storage/__tests__/storage-provider.parity.test.ts`.

## Registry / API / UI / features
- `registry/index.ts` — slot→renderer map (THE file for new renderers; 29 `SLOT_IDS` in `ui/slots.ts`).
- `api/{client,schemas,transformers}.ts` — 1:1 backend router mirrors; `actions/` server actions call these.
- `ui/{slots,registry,context,defaults/}` + `components/` + `canvas/` + `render/` — design system + scene.
- `features/{composer-addons,help-system,onboarding}` — user moments; `hooks/`, `lib/`, `ml/`, `schema/` (frontend zod mirrors `src/schema` — drift risk), `cli/commands/{shell (43 cmds),storage-inspect}`, `test-utils/`, `types/`, `seeds/`, `shared/`.

Full paths + headers in `generated/gen-frontend-engines-storage.md` (filter) and `generated/gen-frontend-misc.md` (remainder).
