# Plugin Kernel Migration — Atomic Task List

Derived from `PLUGIN_KERNEL_BOUNDARY_V2.md`. Each task is sized to be a
single PR (or a few hours of focused work). IDs are `PHASE.NUM`. `Depends`
lists task IDs that must merge first. `Files` are the primary files touched
(new unless marked existing). `Done when` is the acceptance check —
prefer an automated test over a description where possible.

Legend: 🔴 high risk · 🟡 medium risk · 🟢 low risk

---

## Phase 0 — Event bus consolidation (blocks everything)

- **0.1** 🟢 Diff `capability-event-bus.ts` vs `capability-event-bus-v2.ts`: list every event type each emits/consumes and every caller of each.
  Files: none (research doc) → `docs/architecture/EVENT_BUS_DIFF.md`
  Done when: diff doc lists 100% of call sites for both (`grep -rn` both symbols across `src/`, `frontend/src/`).

- **0.2** 🟡 Pick canonical bus (recommend v2 unless 0.1 shows v1 has unmigrated consumers) and add missing event types from the deprecated one into it.
  Depends: 0.1. Files: `src/engines/capability-event-bus-v2.ts` (existing)
  Done when: canonical bus's type union is a superset of both originals; existing tests for both pass against the canonical file.

- **0.3** 🟡 Migrate all call sites from the deprecated bus to the canonical one, one module at a time (batch by directory: `src/engines/`, `src/server/`, `frontend/src/`).
  Depends: 0.2. Files: every importer of the deprecated bus (grep from 0.1)
  Done when: `grep -rn "capability-event-bus['\"]" src frontend/src` (the deprecated import path) returns zero results.

- **0.4** 🟢 Delete the deprecated bus file; add an arch test asserting only one event-bus module exists under `src/engines/`.
  Depends: 0.3. Files: delete deprecated file; `tests/arch/single-event-bus.test.ts`
  Done when: CI passes with the new arch test in place.

---

## Phase 1 — Kernel scaffold (no behavior change)

- **1.1** 🟢 Create `src/kernel/` directory with `index.ts` barrel export (empty for now).
  Files: `src/kernel/index.ts`
  Done when: file exists, exports nothing yet, builds clean.

- **1.2** 🟢 Define `PluginPermission` union type + `ActivationEvent` union type.
  Files: `src/kernel/permissions.ts`, `src/kernel/activation.ts`
  Done when: types cover the full permission list from V2 §6 (`network`, `chrome:control`, `chrome:control:read-only`, `storage:scoped`, `schema:extend`, `ui:custom-js`, `ui:custom-html-css-only`) and activation events (`onStartup`, `onCommand:*`, `onProvider:*`, `onSchema:*`).

- **1.3** 🟡 Define `PluginManifest` Zod schema per V2 §6 (id, version, activationEvents, permissions, contributes — with `contributes.*` as empty placeholders for now, filled in per-axis in later phases).
  Depends: 1.2. Files: `src/kernel/manifest.ts`
  Done when: unit test validates a minimal manifest and rejects one missing `id`/`version`.

- **1.4** 🟡 Define `PluginContext` interface (empty capability surface for now — `ctx.events` only, wired to the Phase-0 canonical bus).
  Depends: 0.4, 1.3. Files: `src/kernel/plugin-context.ts`
  Done when: a stub `activate(ctx: PluginContext)` compiles and can call `ctx.events.on(...)`.

- **1.5** 🟢 Add the kernel-boundary arch test (import-direction rule) even though `src/kernel/` is nearly empty — cheapest time to add it.
  Depends: 1.1. Files: `tests/arch/kernel-boundary.test.ts`
  Done when: test fails if anything under `src/kernel/` imports from `src/engines/*` or a `plugins/*` path; passes today (nothing violates it yet).

---

## Phase 2 — UI axis (lowest risk, highest existing maturity)

- **2.1** 🔴 Audit: trace how `UiComponent.js`/`.html`/`.css` actually executes at render time in the frontend — find the renderer that consumes `shared/ui-component.ts` rows and confirm whether it goes through `sandbox-runner-quickjs.ts`/`-vm.ts` or is `eval`/`dangerouslySetInnerHTML`'d directly.
  Files: none (research) → `docs/architecture/UI_SANDBOX_AUDIT.md`
  Done when: doc states, with file:line citations, exactly which sandbox mechanism (if any) guards plugin-authored JS today, and whether CSS/HTML injection is escaped.

- **2.2** 🔴 If 2.1 finds unsandboxed execution: implement sandboxing for `UiComponent.js` (reuse `sandbox-runner-quickjs.ts` pattern, adapted for a frontend/webview context — likely an iframe + postMessage bridge rather than the backend QuickJS runner).
  Depends: 2.1. Files: TBD per audit findings, likely `frontend/src/render/*`, new `frontend/src/render/sandboxed-component.tsx`
  Done when: a component with `js: "document.cookie"` or similar cannot access the host page's DOM/storage/cookies in a test.

- **2.3** 🟡 Reconcile `UiComponent`'s 5-tier scope (`provider-unique > family-variant > family-global > cross-type > system`) with `UiSlotClaim`'s 3-tier scope (`global < plan < provider`) into one resolution order.
  Files: `shared/ui-component.ts` (existing), `shared/ui-slots.ts` (existing) → new `shared/ui-resolution.ts`
  Done when: unit test exercises all 5 tiers and confirms deterministic winner given overlapping claims.

- **2.4** 🟡 Implement `UiContribution` type + `ui-registry.ts` that expands a manifest's terse slot claims into full `UiComponent` rows at install time.
  Depends: 1.3, 2.3. Files: `src/kernel/registries/ui-registry.ts`
  Done when: unit test: given a manifest with one `slots` entry, `ui-registry.ts` produces a `UiComponent` row matching `shared/ui-component.ts`'s shape.

- **2.5** 🟡 Add `ui:custom-js` / `ui:custom-html-css-only` permission enforcement — reject/downgrade a contributed component containing a `js` field if the manifest didn't declare `ui:custom-js`.
  Depends: 2.2, 2.4. Files: `src/kernel/registries/ui-registry.ts` (existing)
  Done when: unit test: manifest without `ui:custom-js` + a slot claim with a `js` field → registration fails with a clear error.

- **2.6** 🟢 Wire `plugin-router.ts`'s install flow to call `ui-registry.ts` instead of writing `UiComponent` rows directly.
  Depends: 2.4. Files: `src/server/plugin-router.ts` (existing)
  Done when: `sample-plugin`/`demo-plugin` (existing fixtures in `frontend/plugins/`) still install successfully end-to-end through the new path; existing plugin-router tests pass.

---

## Phase 3 — External services axis

- **3.1** 🟢 Define `ExternalServiceContribution` type (kind: browser-provider | api-protocol | mcp-server | mcp-client) per V2 §4.
  Depends: 1.3. Files: `src/kernel/registries/service-registry.ts`
  Done when: type compiles and re-exports the existing `ProviderManifest` (from `src/schema/provider-manifest.ts`) and `openai-compatible/manifest.ts` shapes without duplicating them.

- **3.2** 🟡 Change `provider-registrar.ts`'s manifest source from a hardcoded import of `seeds/providers/manifests.ts` to accepting a manifest object at runtime (keep the in-tree seeds as the default caller, add a second entry point for plugin-supplied ones).
  Files: `src/engines/provider-registrar.ts` (existing)
  Done when: existing `seedAll()` behavior unchanged (regression test), plus a new `registerOne(manifest, { source: 'plugin', pluginId })` path with a unit test.

- **3.3** 🟡 Change `provider-protocol-generator.ts`'s output from disk-only static file to an in-memory cache rebuilt on demand, with the static file kept as a startup-time snapshot (not a hard rebuild requirement).
  Depends: 3.2. Files: `src/engines/provider-protocol-generator.ts` (existing)
  Done when: a provider registered at runtime (via 3.2's new path) is queryable through the generator's read API without restarting the process; existing generated-file consumers unaffected.

- **3.4** 🟡 Wire `service-registry.ts` to call 3.2/3.3's new entry points, gated on `network` permission (+ `chrome:control` for `kind: 'browser-provider'`).
  Depends: 3.1, 3.2, 3.3. Files: `src/kernel/registries/service-registry.ts` (existing)
  Done when: unit test registers a fake small provider (e.g. a synthetic manifest, not a real external one) through `service-registry.ts` end-to-end and can round-trip a capability lookup.

- **3.5** 🟢 Prove the axis with one real small provider migrated through the plugin path — recommend Discord or Notion (already exist as in-tree `seeds/providers/discord.json` / `notion.json`).
  Depends: 3.4. Files: new `plugins/core/provider-discord/` (or notion), moving logic out of `seeds/providers/discord.json` + `seeds/adapters/*`
  Done when: Discord (or Notion) provider still fully functional (existing integration tests for it pass) when loaded exclusively through the plugin path, with the in-tree seed removed.

- **3.6** 🟢 Add MCP contribution support (`mcp-server` / `mcp-client` kinds) to `service-registry.ts`, wrapping `src/mcp/server.ts` and `src/engines/mcp-client-adapter.ts`/`mcp-server-adapter.ts`.
  Depends: 3.1. Files: `src/kernel/registries/service-registry.ts` (existing)
  Done when: unit test registers a synthetic MCP tool contribution and confirms it's callable through `DiscoveryMcpServer.callTool()`.

---

## Phase 4 — Schema axis (Tier A only; Tier B deferred)

- **4.1** 🟢 Locate/confirm `NodeSchemaRegistry` (referenced but not yet directly inspected) — read `src/schema/node.ts` in full to find the registration mechanism.
  Files: none (research)
  Done when: doc note confirming the exact `register(nodeType, schema)` call shape, or a finding that it doesn't exist yet and needs to be added.

- **4.2** 🟡 If missing, implement `NodeSchemaRegistry.register()`/`.get()`/`.validate()` as a runtime-mutable map (currently likely a hardcoded switch/object per `NodeType`).
  Depends: 4.1. Files: `src/schema/node.ts` (existing)
  Done when: unit test registers a new `NodeType` string at runtime and successfully validates/rejects `data` payloads against it.

- **4.3** 🟡 Define `SchemaContribution` type + `schema-registry.ts` kernel wrapper, enforcing plugin `NodeType` namespacing (`plugin:${pluginId}.${localType}`).
  Depends: 1.3, 4.2. Files: `src/kernel/registries/schema-registry.ts`
  Done when: unit test: two plugins registering a `NodeType` with the same local name don't collide (namespace prefix disambiguates); a plugin cannot register a `NodeType` colliding with a built-in `cap-store.*` type.

- **4.4** 🟢 Prove the axis: one synthetic plugin registers a `NodeType`, writes a Node row, reads it back validated, through the kernel path only.
  Depends: 4.3. Files: test fixture under `tests/integration/kernel/schema-axis.test.ts`
  Done when: integration test passes end-to-end (register → write → read → validate).

- **4.5** 🟢 Document Tier B (relational fragment) design decision as deferred — write the `plugin_ext` datasource isolation requirement into `docs/architecture/PLUGIN_KERNEL_BOUNDARY_V2.md` §1 as a tracked follow-up, not implemented in this pass.
  Files: `docs/architecture/PLUGIN_KERNEL_BOUNDARY_V2.md` (existing, append)
  Done when: doc explicitly marks Tier B as out-of-scope-for-now with a one-line reason.

---

## Phase 5 — Core-features axis

- **5.1** 🟢 Audit `bootstrap-engines.ts`: list every engine it currently constructs eagerly, in order, with their `dependsOn` relationships inferred from constructor args.
  Files: none (research) → `docs/architecture/BOOTSTRAP_ENGINES_AUDIT.md`
  Done when: doc lists all engines + inferred dependency edges; flags any that look circular or order-sensitive in a fragile way.

- **5.2** 🟡 Define `FeatureContribution` type per V2 §2, including `activationEvents`.
  Depends: 1.2, 1.3. Files: `src/kernel/registries/feature-registry.ts`
  Done when: type compiles; unit test constructs a `FeatureContribution` and confirms it satisfies `ModuleDefinition`'s existing shape (`src/server/module-registry.ts`) via a mapping function.

- **5.3** 🔴 Change `ModuleRegistry.define()`'s `create(deps)` signature so plugin-sourced modules receive a permission-gated `PluginContext` instead of the raw `ModuleDependencies` bag. Core (in-tree) modules can keep raw access for now via a `trusted: true` flag to avoid a big-bang rewrite.
  Depends: 1.4, 5.2. Files: `src/server/module-registry.ts` (existing)
  Done when: existing bootstrap tests pass unchanged (trusted path); new unit test confirms a `trusted: false` module's `create()` cannot reach a dependency it didn't declare in `dependsOn`.

- **5.4** 🟡 Implement lazy activation: modules with `activationEvents` other than `onStartup` are registered but not `create()`'d until the triggering event fires.
  Depends: 5.3. Files: `src/server/module-registry.ts` (existing)
  Done when: unit test registers a module with `activationEvents: ['onCommand:test']`, confirms `create()` has not run, fires the event, confirms it now has.

- **5.5** 🟢 Migrate one non-critical, low-traffic engine from `bootstrap-engines.ts` eager construction to `ModuleRegistry` + lazy activation, as the reference case (recommend something like `backup-scheduler.ts` or `health-digest.ts` — low blast radius if wrong).
  Depends: 5.4. Files: `src/server/bootstrap-engines.ts` (existing), the chosen engine's registration
  Done when: app boots with that engine's construction deferred to its activation event; existing tests covering that engine still pass; startup time doesn't regress (measure before/after).

---

## Phase 6 — Harness axis (highest risk; last)

- **6.1** 🟢 Audit `harness-command-registry.ts` + `capability-program-registrar.ts`: confirm exact current registration entry point and whether `commandId` collisions are checked today.
  Files: none (research) → `docs/architecture/HARNESS_REGISTRY_AUDIT.md`
  Done when: doc confirms collision behavior (overwrite vs. error) and where `chrome:control`-equivalent access is currently gated, if at all.

- **6.2** 🟡 Implement `commandId` namespace prefixing at the kernel layer (`${pluginId}.${commandId}`), applied unconditionally — plugin cannot opt out.
  Depends: 6.1. Files: `src/kernel/registries/harness-registry.ts`
  Done when: unit test: plugin registering `commandId: "send"` results in a stored command `commandId: "acme.send"`, and cannot be resolved by the bare name `"send"`.

- **6.3** 🔴 Implement the `chrome:control` runtime confirmation prompt — first activation of any plugin with that permission (harness or browser-provider) blocks until explicit user confirmation, independent of manifest declaration.
  Depends: 3.4 (service axis shares this gate), 6.2. Files: `src/kernel/permissions.ts` (existing), a new confirmation-prompt hook surfaced to `frontend/src/` (UI for the prompt itself — coordinate with Phase 2's UI registry or keep as a simple system dialog, not a plugin-contributed component, to avoid a plugin spoofing its own confirmation).
  Done when: integration test simulates first activation of a `chrome:control` plugin and confirms execution is blocked until a confirmation callback fires.

- **6.4** 🟡 Define `HarnessContribution` type (commands + optional repair strategies) and wire into `harness-command-registry.ts` / `harness-repair-engine.ts`.
  Depends: 6.2, 6.3. Files: `src/kernel/registries/harness-registry.ts` (existing)
  Done when: unit test registers a synthetic harness command + a repair strategy through the kernel path and confirms both are reachable from `HarnessRuntime`.

- **6.5** 🟢 Migrate one existing in-tree harness capability through the new path as the reference case.
  Depends: 6.4. Files: TBD per which capability is chosen (smallest/lowest-traffic one from `capability-program-registrar.ts`'s current registrations)
  Done when: that capability still executes correctly end-to-end (existing test coverage for it passes) sourced through `plugins/core/*` instead of direct registration.

---

## Phase 7 — Batch migration of `src/engines/*`

- **7.1** 🟢 Produce a domain-grouping map of all `src/engines/*.ts` files (browser-automation, memory, canvas, mcp, resilience, observability, misc) with a recommended target `plugins/core/<domain>` bucket for each.
  Files: none (research) → `docs/architecture/ENGINES_DOMAIN_MAP.md`
  Done when: every file under `src/engines/` (150+) appears in exactly one domain bucket in the doc, or is explicitly flagged as "kernel-adjacent, do not migrate" (e.g. sandbox runners, which the kernel itself depends on).

- **7.2–7.N** 🟡 One task per domain bucket from 7.1 (e.g. "7.2 Migrate browser-automation engines to `plugins/core/browser-automation`"), each: move files, convert top-level exports to a manifest + `activate()`, update imports, confirm arch test (1.5) still passes, confirm domain's existing tests pass unchanged.
  Depends: 7.1, and the corresponding axis phase(s) that domain relies on (e.g. browser-automation depends on Phase 6 being done since it touches harness/chrome:control).
  Done when (per bucket): all moved files import only through `PluginContext`/kernel registries, zero remaining imports from old `src/engines/<domain>` paths anywhere in `src/` or `frontend/src/`, full test suite green.

---

## Cross-cutting / continuous tasks (not phase-bound)

- **X.1** 🟢 After every phase, re-run `tests/arch/kernel-boundary.test.ts` (1.5) and `tests/arch/layer-dependency.test.ts` / `boundary-cdp.test.ts` (existing) — treat any new violation as a blocking regression, not a follow-up.
- **X.2** 🟢 Keep `docs/architecture/PLUGIN_KERNEL_BOUNDARY_V2.md` updated as the source of truth when a phase's implementation diverges from the design (it will — update the doc, don't let it drift).
- **X.3** 🟡 After Phase 2 and Phase 6 specifically (the two axes with real security surface — UI JS sandboxing and chrome:control), get an explicit second-reviewer sign-off before merging, given the blast radius of getting either wrong.

---

## Suggested execution order (respecting `Depends`)

```
0.1 → 0.2 → 0.3 → 0.4
1.1 → 1.2 → 1.3 → 1.4 → 1.5
2.1 → 2.2 → 2.3 → 2.4 → 2.5 → 2.6
3.1 → 3.2 → 3.3 → 3.4 → 3.5 → 3.6
4.1 → 4.2 → 4.3 → 4.4 → 4.5
5.1 → 5.2 → 5.3 → 5.4 → 5.5
6.1 → 6.2 → 6.3 → 6.4 → 6.5
7.1 → 7.2 … 7.N
```

Phases 2, 3, and 4 have no cross-dependencies on each other (only on Phase 0
and 1) and can run in parallel across different people/sessions once Phase 1
lands. Phase 5 can also start in parallel — it only needs Phase 1. Phase 6
should stay serialized after Phase 3 (shares the `chrome:control` gate) and
ideally after Phase 2 (reuses the confirmation-prompt UI pattern). Phase 7
is last by construction — it consumes all five registries.
