# L1 — Zone Map (every top-level code territory, from directory scan)

> How to read: each zone = one `src/*` directory (28 total) plus 7 outer areas.
> For each: what lives there (measured file list), what it depends on (from imports),
> and which L2 cluster / L4 contract family it feeds.

## L1.0 `src/` zones (28)

| # | Zone | Files (measured) | Role in one line | Key deps → |
|---|------|------------------|------------------|------------|
| 1 | `src/engines/` | **186** `*.ts` + 33 subdirs `actor, adapters, automation, browser-automation, capability-bootstrap, chrome, code-audit, command-language, events, generative, harness, kernel, local-agent, local-server, memory, nlcl, observability, onboarding, opencode, p2p-node, parsers, pool, providers, reliability, reprogrammability, resource, runtime, scheduler, stealth, tunnel-client, tunnel-orchestrator, workflow-templates` | All domain logic — capability, provider, conversation, memory, workflow, resilience | `storage/contracts/*`, `schema/*`, `errors.js`, `ids.js` |
| 2 | `src/storage/` | `store-factory.ts, prisma.ts, snapshot.ts, verify-compat.ts, migration/{types,migrations-registry,migration-runner,index}.ts, contracts/(67 = 60 top + 7 onboarding/), impl/(71)` | Persistence law + adapters | `prisma/*` models |
| 3 | `src/schema/` | **38** files (`agentic, api-types, api-validators, automation, chrome, command-description, conceptual-model, config, contact, content, core, document, email, event, harness, health, index, learning, media, message, node-data, node, provider-manifest, provider, repair-metadata, response-schemas, rich-text, routing, schemas, session, social, streaming, task, telemetry, transfer, types, validators, versioning`) | Zod + TS domain shapes, request/response validators | — (leaf, imported everywhere) |
| 4 | `src/server/` | `index.ts, bootstrap-engines.ts, bootstrap-seeds.ts, service-container.ts, module-registry.ts, engines-catalog.ts, response.ts, validate.ts, auth-gate.ts, websocket.ts, canvas-ws.ts, agent-canvas-router.ts + ~30 *-router.ts + routes/(10: contacts, containers, content, knowledge, media, notifications, sync, tunnel, update, users) + bootstrap/ + middleware/` | HTTP/WS serving plane | `engines/*`, `storage/contracts/*`, `schema/*` |
| 5 | `src/cli/` | `index.ts, command-registry.ts, pipeline-engine.ts, discovery-stack.ts, provider-harness.ts, repl.ts, output-formatter.ts, json-schema.ts, commands/(7)` | Operator plane | `engines/*`, `seeds/*` |
| 6 | `src/mcp/` | `server.ts, index.ts, browser-mcp.ts, browser-session.ts, browser-tools.ts, discovery-tools.ts, nlcl-tools.ts, types.ts, zod-schema.ts, serp-parser.ts, in-memory-heal-store.ts` | Agent tool plane | `engines/*`, `schema/*` |
| 7 | `src/canvas/` | 15 files (`canvas-engine, canvas-registry, canvas-mirror, capability-layer, capability-bridge, layer-mounter, mutation-caps, designer, oracle-reader, primitives, schema, types, in-memory-store, index, canvas-agent-tools`) | Canvas scene graph + capability projection | `engines/canvas-layer-mounter`, `storage/contracts/canvas-store` |
| 8 | `src/ai/` | `tools/{tool-orchestrator-impl, orchestrator}.ts, runtime/{ts-supervisor, supervisor, resources, in-memory-resource-manager}.ts` | Tool orchestration + supervised runtimes | `engines/tool-orchestrator-facade`, `sandbox-runner` |
| 9 | `src/fleet/` | (fleet supervisor impls) | Chrome slave fleet + allocation | `engines/chrome-governor`, `contracts/governor-store, slave-setup-store` |
| 10 | `src/fleet/` + `src/engines/chrome/` | governor + pool + watchdog files | Single CDP owner + health | `BunCdpClient` (only here) |
| 11 | `src/router/` | routing specs + targets + events | Route resolution | `contracts/router-store`, `engines/router-capability-bridge` |
| 12 | `src/executor/` | execution kernel harnesses | Sandboxed execution | `engines/execution-kernel, sandbox-runner*` |
| 13 | `src/transform/` | `types.ts, transform-engine.ts, index.ts` | Shape ↔ row transforms | `schema/*` |
| 14 | `src/framing/` | `engine.ts, schemas.ts, frame-version.ts, index.ts, __tests__/engine.test.ts` | Frame versioning/envelopes | `schema/*` |
| 15 | `src/alerting/` | `alerter.ts, sliding-window.ts, dedup.ts, cooldown.ts, webhook.ts, index.ts` | Alert pipeline | `contracts/alert-store`, `engines/*` telemetry |
| 16 | `src/automation/` | `scheduler.ts, automation-router.ts, ui-automator.ts` | Schedules + UI automation | `contracts/automation-store`, `engines/automation/*` |
| 17 | `src/api/` | `index.ts, setup-client.ts` | Typed API client surface | `shared/api-types.ts`, `schema/api-types` |
| 18 | `src/arch/` | `index.ts, boundary-rules.ts, boundary-scanner.ts` | Repo self-lint: kernel boundary rules | filesystem scan (no runtime deps) |
| 19 | `src/cleanup/` | `index.ts, unused-exports.ts, deprecated-events.ts` | Dead-code + deprecated-event sweeps | barrel `index.ts` |
| 20 | `src/config/` | `provider-registry.ts` (+ root `src/config.ts`) | Provider + app configuration | `schema/config.ts`, `contracts/config-store` |
| 21 | `src/desktop/` | Tauri bridge shims | Desktop shell glue | `src-tauri/` |
| 22 | `src/domain/` | domain services | Shared domain helpers | `schema/*` |
| 23 | `src/integration/` | `index.ts, flag-registry.ts` | Feature flags + integration seams | — |
| 24 | `src/intel/` | `auth, canvas, cleanup, domain, executor, identity, integration, nlcl, resource, router, routing, runtime/` (12 subdirs) | Intelligence substrate (auth/identity/routing overlays) | `engines/*` |
| 25 | `src/lib/` | shared lib helpers | Small utilities | — |
| 26 | `src/observability/` + `src/observatory/` | sinks, taps, digests | Telemetry + inspection | `contracts/telemetry-store, health-store` |
| 27 | `src/plugin-kernel/` | (new zone, empty at scan — target of migration) | Kernel plugin boundary | `src/arch/boundary-rules` |
| 28 | `src/reprogrammability/` + `src/resilience/` + `src/shared/` | surface regen + retry/circuit + shared helpers | Cross-cutting | `engines/config-universal-surface`, `retry-engine` |

Plus root leaves: `src/config.ts`, `src/errors.ts` (365 lines), `src/ids.ts` (52 lines),
`src/index.ts` (462-line barrel), `src/__generated__/provider-protocol{,.dev}.ts`.

## L1.1 Outer areas (7)

| Area | Contents (measured) | Role |
|------|---------------------|------|
| `prisma/` | `schema.prisma` (legacy root) + `system/schema.prisma` (111 models) + `user/schema.prisma` (90 models) + `migrations/`, `migrations.bak/` | The two databases; L4 ground truth |
| `seeds/` | 11 dirs + `memory-intelligence.ts`, `og-capability-port.ts` | Boot rows for taxonomy/capabilities/parsers/providers |
| `shared/` | `api-types.ts, canvas-types.ts, conceptual-model.ts, screenshot-budget.ts, stream-blocks.ts, ui-component.ts, ui-slots.ts, parser/` | Isomorphic types shared with frontend |
| `sdk/` | `sdk/src/` | Programmatic client (wraps `src/api/`) |
| `frontend/` | `frontend/src/` 22 zones; `app/` has `api, canvas` top routes; `engines/, storage/, schema/, ui/, canvas/, features/, registry/` mirror backend | Next.js UI; capability-global slots |
| `src-tauri/` | Rust shell | Tauri V2 desktop wrapper |
| `tests/` | 11 suites (`unit, integration, e2e, arch, fuzz, chaos, load, stress, docs, fixtures, helpers`) | Safety net; `arch` enforces kernel boundary |

## L1.2 Dependency skeleton (no cycles allowed)

```
 schema/* ──┐
 shared/* ──┼──► storage/contracts/* ──► storage/impl/* ──► prisma/*
 ids/errors ┘         ▲
                      │ imports types only
 engines/* ───────────┘ (never impl/)
      ▲
      │ constructed by
 server/bootstrap-engines.ts + service-container.ts
      ▲
 cli / server routers / mcp tools / frontend api routes
```

Rule read from code: engines import `../storage/contracts/*.js` + `../schema/*.js` +
`../errors.js` + `../ids.js`. Only `chrome-governor*.ts` + `fleet/*` touch CDP.
Only `stream-parser.ts` loads parser logic from DB. These are enforced by `src/arch/*`
and `tests/arch/*`.
