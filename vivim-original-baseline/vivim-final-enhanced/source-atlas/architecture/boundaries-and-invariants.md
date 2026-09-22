# Boundaries & Invariants — load-bearing rules (each with code + test enforcement)

> Every rule below was read from an enforcement site (`src/arch/*`, `tests/arch/*`,
> engine header comments), not from prose docs. Format: rule → why it exists →
> where it is enforced → what breaks if violated.

## I-1 Governor Canon — only the governor touches CDP

- **Rule:** No engine except `chrome-governor*.ts` (via `src/executor/cdp-transport.ts`)
  may import `BunCdpClient` or any CDP transport. Canvas engines are explicitly banned.
- **Why:** One choke point for fleet limits, circuit breaking, profile allocation,
  audit, and mocking. N CDP owners = N competing retry/health policies.
- **Enforced by:** header comments in `stream-parser` ("Governor Canon: this engine never
  imports BunCdpClient"), `tests/arch/boundary-cdp.test.ts`, `boundary-scanner.ts` (executor
  layer check). Measured: only `executor/cdp*.ts` + governor match.
- **Breaks:** flaky-browser debugging becomes archeology; parallel slaves stomp profiles.

## I-2 Store Contracts — engines depend on contracts, never impls

- **Rule:** `src/engines/*` may import `storage/contracts/*`, `shared/*`, `src-foundation`,
  `src/schema/*` — never `storage/impl/*`.
- **Why:** Keeps 186 engines testable with in-memory doubles; lets SQLite/Postgres/MySQL
  swap under `StoreFactory{sqlite|postgres|mysql}` without touching business logic.
- **Enforced by:** `BOUNDARY_RULES.engines.mayImportFrom`, `layer-dependency.test.ts`
  (`src/engines` allow-list), `store-contract-parity.test.ts`. Measured: 65→contracts, 0→impl.
- **Breaks:** every engine test needs a real DB; dialect branches leak into domain code.

## I-3 Dual-DB — system and user schemas never join at the DB level

- **Rule:** `prisma/user/schema.prisma` contains zero `@relation` targets that name a model
  from `prisma/system/schema.prisma` (and vice versa). Cross-DB joins happen in engines
  via string ID derivations, never via Prisma relations.
- **Why:** System DB (111 models: providers/taxonomy/telemetry/workflows) ships with the app
  and migrates on release cadence; user DB (90 models: sessions/conversations/memories)
  migrates on user-data cadence and must survive reinstalls/exports. A cross-DB FK would
  weld their migration histories together.
- **Enforced by:** `tests/arch/dual-db-boundary.test.ts` (extracts `^model` sets + `@relation`
  targets from both schemas and fails on intersection).
- **Breaks:** `prisma migrate` on one DB blocks deploys of the other; user export drags system rows.

## I-4 DB-Only Parser Logic — StreamParser loads code only from DB rows

- **Rule:** `stream-parser.ts` executes `parser_logic_code WHERE logic_type='inline'` from the
  `ProviderParser` table. No `import` of parser files from disk at runtime.
- **Why:** Parsers are provider-versioned data (seeded, A/B-tested, hot-fixed) — not release
  artifacts. Disk-loaded parsers would require a full redeploy to fix one selector.
- **Enforced by:** engine header comment + `parser-store` contract shape + seed pipeline
  (`seeds/parsers/*` → `bootstrap-seeds.ts`).
- **Breaks:** provider UI change → full release train instead of a seed update.

## I-5 One Profile Per (Provider, Account) + Chrome Slave = Source of Truth

- **Rules:** `ProfileAllocator` enforces singleton profile dir per
  `slave:{provider}:{account}` (`deriveSlaveId`); cookie files on disk — not the DB
  `loginState` row — decide "logged in".
- **Why:** Two slaves sharing one Chrome profile corrupt cookies/storage; DB login flags
  go stale the moment the user logs out in a side window. Disk is the only fresh signal.
- **Enforced by:** `src/executor/profile-allocator.ts` + `slave-states.ts`/`slave-read.ts`/
  `slave-write.ts` + `fleet-supervisor.ts` limits + spawn guard.
- **Breaks:** duplicate-login loops, session theft between accounts.

## I-6 Lazy Startup + No Runaway Creation + Triple-Layer Consistency

- **Rules:** Slaves launch on first need (not at boot); `FleetSupervisor` caps concurrency;
  profile-dir + DB row + runtime handle must agree (triple-layer); agents detect expiry via
  `isAuthenticated()` and trigger relogin flow.
- **Enforced by:** `fleet-limiter.ts`, `fleet-supervisor.ts`, `system-pressure.ts`,
  `port-reaper.ts`, governor resilience wrapper.
- **Breaks:** boot storms, port exhaustion, zombie Chrome processes.

## I-7 Bus Dot-Namespace — every event kind is namespaced

- **Rule:** `eventBus.publish(kind)` requires `kind =~ ^(kernel|plugin\.<id>|legacy)\.` .
- **Why:** Lets the kernel auto-record and route without a central event registry;
  `plugin.<id>.*` isolates first-party plugins; `legacy.*` quarantines migration debt.
- **Enforced by:** `capability-event-bus-v2.ts` regex + `event-record-store` auto-recording
  + `arch-invariants.test.ts`.
- **Breaks:** unroutable events, cross-plugin eavesdropping.

## I-8 Kernel Isolation (T-01…T-24) — K0 never imports K1+

- **Rule:** Files under `src/plugin-kernel/` (K0) must not import from `/src/engines/`,
  `/plugins/core/`, or `src/ai/plugins/manager.ts`. Only the kernel may import
  `plugin-manager-impl`.
- **Why:** The kernel must survive uninstall of every first-party plugin (T-03). An upward
  import makes the kernel depend on the thing it hosts — uninstall then crashes boot.
- **Enforced by:** `tests/arch/kernel-isolation.test.ts` (T-01 K0-imports, T-02 17-subsystem
  stubs, T-03 plugin→kernel-internals, T-24 manager-impl) + `certifier.test.ts`.
- **Current status (measured):** migration mid-flight — `src/plugin-kernel/` holds
  `adapter/`, `bootstrap/`, `core/`, `event-bus/`, `plugin-manager/`, `sandbox/` (18 TS files)
  vs 17 expected subsystems; `plugins/core/` empty. T-02 fails until 11 stubs land.
  See `risks-and-evolution.md`.

## I-9 Sandbox Purity + No `vm`/`safe-eval` Fallbacks

- **Rule:** `SandboxRunner` facade routes to QuickJS (`sandbox-runner-quickjs.ts`, primary)
  or isolated-vm; the Node `vm` fallback and `safe-eval`/`safe-expression` paths are removed.
- **Why:** `vm` shares the host isolate (escape history); QuickJS gives per-run memory/time
  limits for untrusted parser/capability code.
- **Enforced by:** `certifier.test.ts` attack vectors + `sandbox/runner.ts` in plugin-kernel.
- **Breaks:** untrusted provider code escapes into the host process.

## I-10 Storage Scoping + Barrel Hygiene

- **Rules:** Per-namespace storage access (no `*` / `kernel/*` wildcards);
  `src/index.ts` 462-line barrel is the public surface — anything not re-exported is internal;
  `cleanup/unused-exports.ts` + `deprecated-events.ts` prune drift.
- **Enforced by:** `arch-invariants.test.ts`, `code-quality.test.ts`, `api-contract.test.ts`.
