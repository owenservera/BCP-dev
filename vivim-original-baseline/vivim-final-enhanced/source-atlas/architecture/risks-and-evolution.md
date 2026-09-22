# Risks & Evolution — where the architecture stands and where it's going

> Status derived from measured code state (2026-09-18), not roadmaps.
> Each risk: evidence → impact → cheapest next move.

## R-1 Kernel migration is 6/17 subsystems (T-02 red)

- **Evidence:** `tests/arch/kernel-isolation.test.ts` T-02 expects 17 K0 dirs under
  `src/plugin-kernel/` (`plugin-manager, plugin-context, event-bus, registry, adapter,
  execution, runtime, policy, router, sandbox, observability, schema, migration, crypto,
  host, capabilities, bootstrap`). Disk holds 6 (`adapter, bootstrap, core, event-bus,
  plugin-manager, sandbox`) + 3 loose files (`airgap, error-tracker, metrics`) = 18 TS files.
  `plugins/core/` is empty; `src/engines/kernel/` is still K0-today.
- **Impact:** T-01/T-02/T-19/T-22 arch tests cannot pass; kernel still imports K1 engine
  paths (`../../engines/...`, `../../server/bootstrap/...` in the K0 orchestrator).
- **Next:** land stubs in dependency order — `plugin-context` (closes BootstrapContext leak),
  `registry`, `runtime`, `policy` — before moving any more engine code. Each stub unblocks
  one T-test; don't move behavior until the stub's contract test is green.

## R-2 BootstrapContext is a 60+ field god-object (IPluginContext pending)

- **Evidence:** `src/server/bootstrap/context.ts` — every field optional, every phase reads/writes
  any field, impl concrete types imported at K1 (`CapabilityStoreImpl`, …).
- **Impact:** no least-privilege at boot; a phase typo (`ctx.convStore` vs `ctx.nodeStore`)
  compiles (both optional) and fails at 3am in `resolveResult` (`ctx.x!` non-null asserts).
- **Next:** introduce `IPluginContext{storage(ns), bus(ns), log}` alongside (not instead of)
  `BootstrapContext`; migrate one phase per PR (seeds first — smallest surface); assert
  `resolveResult` with explicit missing-field errors instead of `!`.

## R-3 K0 orchestrator imports K1 (known, temporary, must not spread)

- **Evidence:** `src/plugin-kernel/bootstrap/orchestrator.ts` imports
  `../../engines/unified-registry.js`, `../../server/bootstrap/phases/*.js`,
  `../../server/bootstrap/context.js` — header comment marks it "K0-15 glue, MIGRATE".
- **Impact:** T-01 violation by design; any new file copying this import pattern
  normalizes the violation.
- **Next:** lint-ban new `plugin-kernel → engines|server` imports (allow-list only this file);
  each phase migration deletes one import line — track count in CI (18 files → target 17 dirs, 0 K1 imports).

## R-4 Coupling hotspots (high fan-in, change with care)

| Hotspot | Fan-in (measured) | Why it's hot | Rule for edits |
|---|---|---|---|
| `CapabilityEventBus` (+v2) | every phase + all engines (singleton in context) | the process nervous system | additive event kinds only (`plugin.<id>.*`); never rename `kernel.*` |
| `ChromeGovernor` | all browser work funnels here | fleet/circuit/profile policy lives here | behavior behind flags (`flag-registry.ts`); load-test fleet-limiter deltas |
| `UnifiedCapabilityRegistry` | routers + MCP + CLI + parity checker | the capability phonebook | registry change → run parity + `api-contract.test.ts` same PR |
| `StreamParserEngine` | every streamed response | DB-loaded code execution | parser change → seed version bump + `ParserTestResult` row, never silent |
| `ServiceContainer` string keys | stringly-typed DI | typo = boot crash | add `resolveRequired<'literal-union'>` typing before adding services |

## R-5 Data risks (low probability, high blast radius)

- **`*Json` TEXT columns** (20+ across contracts): flexible but unqueryable — a future
  "find all bindings with `requiresUserConfirmation`" needs a backfill into a real column.
  Mitigation: new queryable flags go in real columns from day one; JSON stays for opaque blobs.
- **Epoch-number times:** no TZ bugs, but no DB-level TTL/index help either — retention jobs
  (`compaction-manager`, `eviction-manager`, `backup-scheduler`) must stay scheduled; verify
  in `automation/scheduler.ts` after any cron change.
- **In-memory doubles drift:** `program-store-mem.ts`, `mcp/in-memory-heal-store.ts`,
  `canvas/in-memory-store.ts`, frontend memory impls can silently diverge from Prisma impls.
  `store-contract-parity.test.ts` is the guard — run it when touching either side.

## R-6 Frontend drift (parity is a test, not a hope)

- `FRONTEND = BACKEND = SDK = CLI = API` is enforced by `capability-parity.ts` +
  `api-contract.test.ts`. The observed risk: `frontend/src/schema/` and `frontend/src/api/`
  mirror (not import) backend shapes for bundle reasons — mirrors rot. Cheapest guard:
  codegen check in `build-atlas.ts --check` future work (diff `src/schema/*` exports vs
  `frontend/src/schema/*` exports).

## Evolution map (suggested PR order, smallest-unblocks-biggest first)

```
1. plugin-context stub + IPluginContext iface      (unblocks R-2, enables R-1)
2. registry + runtime + policy stubs               (T-02: 6/17 → 10/17)
3. move bus auto-recording behind IEventBus        (T-22)
4. BootstrapContext → IPluginContext, seeds phase  (first leak closed)
5. remaining 7 K0 stubs (crypto, host, …)          (T-02 green)
6. forbid new K0→K1 imports in lefthook            (locks R-3)
7. schema-mirror codegen check in build-atlas      (locks R-6)
```
