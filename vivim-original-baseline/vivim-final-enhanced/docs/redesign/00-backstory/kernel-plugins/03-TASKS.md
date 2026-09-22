# Plugin Kernel Migration — Atomic Task List (Corrected)

Re-sequenced against `01-AUDIT-FINDINGS.md`. Changes from the first pass:
Phase 2 (UI) is now "harden/extend," not "audit and possibly build."
Phase 5 (core features) targets the `capabilities` bootstrap phase
specifically instead of assuming a monolith to decompose. A new Phase 1.5
(plugin trust/install) is inserted before the axis-specific phases, because
audit finding B1 showed this is the one piece that's genuinely unbuilt
rather than merely disconnected — every other phase's "prove the axis"
task depends on `PluginHost` existing.

Legend: 🔴 high risk · 🟡 medium risk · 🟢 low risk

---

## Phase 0 — Event bus consolidation (blocks everything)

- **0.1** 🟢 Diff `capability-event-bus.ts` vs `capability-event-bus-v2.ts`: every event type and every call site for each.
  Files: none (research) → `01a-EVENT-BUS-DIFF.md`
  Done when: diff doc covers 100% of call sites (`grep -rn` both symbols across `src/`, `frontend/src/`).

- **0.2** 🟡 Pick canonical bus (default to v2 unless 0.1 shows v1 has unmigrated consumers); add any missing event types into it.
  Depends: 0.1. Files: `src/engines/capability-event-bus-v2.ts` (existing)
  Done when: canonical bus's type union is a superset of both; existing tests for both pass against the canonical file.

- **0.3** 🟡 Migrate call sites off the deprecated bus, batched by directory.
  Depends: 0.2. Files: every importer found in 0.1
  Done when: `grep -rn` for the deprecated import path returns zero results.

- **0.4** 🟢 Delete the deprecated bus file; add `tests/arch/single-event-bus.test.ts`.
  Depends: 0.3.
  Done when: CI green with the new arch test in place.

---

## Phase 1 — Kernel scaffold (no behavior change)

- **1.1** 🟢 Create `src/plugin-kernel/` (not `src/kernel/` — see audit B4) with an empty `index.ts` barrel.
  Files: `src/plugin-kernel/index.ts`
  Done when: builds clean, exports nothing yet.

- **1.2** 🟢 Define `PluginPermission` and `ActivationEvent` unions per `02-BOUNDARY-DESIGN.md` §6.
  Files: `src/plugin-kernel/permissions.ts`, `src/plugin-kernel/activation.ts`
  Done when: types cover the corrected permission list (`network`, `chrome:control`, `chrome:control:read-only`, `storage:scoped`, `schema:extend`, `ui:custom-html-css-only`, `ui:custom-scripturl`, `ui:compiled-component`).

- **1.3** 🟡 Define `PluginManifest` Zod schema.
  Depends: 1.2. Files: `src/plugin-kernel/manifest.ts`
  Done when: unit test validates a minimal manifest, rejects one missing `id`/`version`.

- **1.4** 🟡 Define `PluginContext` (start with `ctx.events` only, wired to the Phase-0 canonical bus).
  Depends: 0.4, 1.3. Files: `src/plugin-kernel/plugin-context.ts`
  Done when: a stub `activate(ctx: PluginContext)` compiles and calls `ctx.events.on(...)`.

- **1.5** 🟢 Add the kernel-boundary arch test now, while `src/plugin-kernel/` is nearly empty.
  Files: `tests/arch/kernel-boundary.test.ts`
  Done when: test fails if anything under `src/plugin-kernel/` imports from `src/engines/*` (including `src/engines/kernel/` — audit B4) or a `plugins/*` path; passes today.

- **1.6** 🟢 Locate the `CONVERGENCE-PLAN` document referenced by `[AUDIT R-*]` comments (audit B2) — search outside this repo if not found in-tree, and check `.genome/DECISIONS.md`'s `control-plane\CANON.md` pointer.
  Files: none → `01b-CONVERGENCE-PLAN-CROSSREF.md` (or a note that it could not be located)
  Done when: either the plan is found and cross-referenced against `02-BOUNDARY-DESIGN.md` §6/§7, or its absence is documented so later readers don't re-search.

---

## Phase 1.5 — Plugin trust/install (the genuinely-unbuilt piece — audit B1)

- **1.5.1** 🟡 Read `TrustedPluginManager` (`src/ai/plugins/plugin-manager-impl.ts`) and `plugin-router.ts` in full; write down exactly which method on each does real work vs. which throws/stubs, and which fields of `PluginDescriptor`/`.vivim-plugin` overlap.
  Files: none → `01c-PLUGIN-HOST-UNIFICATION-NOTES.md`
  Done when: doc has a method-by-method table for both classes with "real" / "stub" / "overlaps with X."

- **1.5.2** 🟡 Implement `PluginHost.discover()` for real, using `plugin-router.ts`'s existing tar.gz extraction + sha256 verification logic (move/adapt, don't duplicate) as the implementation `TrustedPluginManager.discover()` is currently missing.
  Depends: 1.5.1, 1.3. Files: `src/plugin-kernel/host.ts`
  Done when: unit test: a valid `.vivim-plugin` archive → `discover()` returns `{ valid: true, manifest }`; a tampered one (bad hash) → `{ valid: false }`.

- **1.5.3** 🟡 Implement `PluginHost.certify()` with real checks: manifest schema validity (via 1.3's Zod schema, not ad hoc field presence), signature/hash re-verification, and a permission-vs-manifest cross-check (does every `contributes.*` entry have its required permission declared, per the permission table in `02-BOUNDARY-DESIGN.md`).
  Depends: 1.5.2. Files: `src/plugin-kernel/host.ts` (existing)
  Done when: unit test: a manifest with a `ui.generated` entry containing `scriptUrl` but no `ui:custom-scripturl` permission fails certification with a specific, actionable error.
- **1.5.4** 🟡 Implement `PluginHost.install()` to call the five per-axis registries (stubs are fine at this point — Phases 2-6 build them out) instead of throwing "not yet implemented."
  Depends: 1.5.3. Files: `src/plugin-kernel/host.ts` (existing)
  Done when: unit test: installing a manifest with only a `features` contribution calls `feature-registry.ts`'s (stub) register function exactly once with the right args; same for each other axis stub.

- **1.5.5** 🟢 Replace `globalThis.__pluginManager` with `PluginHost` threaded explicitly through `BootstrapContext` (audit A4/B1), deleting the `require()`-based lazy import once the real circular dependency it was routing around is resolved (or documenting why it can't be, if 1.5.1 finds a genuine cycle).
  Depends: 1.5.4. Files: `src/server/bootstrap/context.ts`, `src/server/bootstrap/phases/capabilities.ts` (existing)
  Done when: `grep -rn "__pluginManager" src` returns zero results; boot sequence still activates the plugin host (existing capabilities-phase tests pass).

---

## Phase 2 — UI axis (harden + extend a working system, per audit A1–A3)

- **2.1** 🟢 Confirm `scriptUrl` values are restricted to kernel-controlled asset storage at every current write site (the one open item audit A1 flagged — `SandboxedNode.tsx` itself is not the gap, upstream is).
  Files: none (research) → note in `01-AUDIT-FINDINGS.md` addendum or a new short doc
  Done when: every current writer of a `UiComponent.scriptUrl` value is enumerated and confirmed to write only trusted-origin paths (or a gap is found and ticketed).

- **2.2** 🟡 Implement `UiContribution.generated[]` → `UiComponent` row expansion, per `02-BOUNDARY-DESIGN.md` §5's actual field shape (`html`/`css`/`scriptUrl`/`sandboxJson`/`constraintsJson`/`contractJson` — not a generic "js" field).
  Depends: 1.3. Files: `src/plugin-kernel/registries/ui-registry.ts`
  Done when: unit test: manifest with one `generated` entry produces a `UiComponent` row matching `shared/ui-component.ts`'s shape.

- **2.3** 🟡 Enforce `ui:custom-scripturl` permission: a `generated` entry with a `scriptUrl` field but no matching permission is rejected at `ui-registry.ts` registration (defense in depth alongside 1.5.3's certification-time check).
  Depends: 2.2. Files: `src/plugin-kernel/registries/ui-registry.ts` (existing)
  Done when: unit test confirms rejection with a clear error.

- **2.4** 🟡 Implement `UiContribution.compiled[]` → `UniversalComponentRegistry.register()` wiring, gated on `ui:compiled-component` (highest trust tier — treat review-wise like a core-feature contribution).
  Depends: 1.3. Files: `src/plugin-kernel/registries/ui-registry.ts` (existing)
  Done when: unit test: manifest with a `compiled` entry (referencing a component already present in the bundle, since compiled code can't be dynamically injected) registers successfully via `resolve(slot, ctx)`.

- **2.5** 🟢 Wire `PluginHost.install()` (from 1.5.4) to actually call `ui-registry.ts` for both `generated` and `compiled` contributions.
  Depends: 1.5.4, 2.2, 2.4. Files: `src/plugin-kernel/host.ts` (existing)
  Done when: `sample-plugin`/`demo-plugin` (existing fixtures in `frontend/plugins/`) install successfully end-to-end through the new path.

---

## Phase 3 — External services axis

- **3.1** 🟢 Define `ExternalServiceContribution` per `02-BOUNDARY-DESIGN.md` §4, re-exporting `ProviderManifest` and the `openai-compatible` manifest types without duplicating them.
  Depends: 1.3. Files: `src/plugin-kernel/registries/service-registry.ts`
  Done when: type compiles against both existing manifest shapes.

- **3.2** 🟡 Add `provider-registrar.ts`'s `registerOne(manifest, { source: 'plugin', pluginId })` entry point alongside the existing `seedAll()` (unchanged).
  Files: `src/engines/provider-registrar.ts` (existing)
  Done when: regression test confirms `seedAll()` behavior is bit-for-bit unchanged; new unit test covers `registerOne()`.

- **3.3** 🟡 Change `provider-protocol-generator.ts` to an in-memory cache rebuilt on demand, disk file kept as startup snapshot only.
  Depends: 3.2. Files: `src/engines/provider-protocol-generator.ts` (existing)
  Done when: a provider registered via 3.2 is queryable without a process restart; existing generated-file consumers unaffected.

- **3.4** 🟡 Wire `service-registry.ts` to 3.2/3.3, gated on `network` (+ `chrome:control`, shared with §3's harness gate, for `browser-provider`).
  Depends: 3.1, 3.2, 3.3. Files: `src/plugin-kernel/registries/service-registry.ts` (existing)
  Done when: unit test registers a synthetic provider end-to-end through `service-registry.ts`.

- **3.5** 🟢 Prove the axis with one real small provider (Discord or Notion — already exist as `seeds/providers/discord.json`/`notion.json`) migrated fully through the plugin path, in-tree seed removed.
  Depends: 3.4, 1.5.4 (needs `PluginHost.install()` to actually deliver the manifest). Files: new `plugins/core/provider-discord/` (or notion)
  Done when: existing integration tests for that provider pass sourced exclusively through the plugin path.

- **3.6** 🟢 Add `mcp-server`/`mcp-client` contribution kinds, wrapping `src/mcp/server.ts` and the two MCP adapters.
  Depends: 3.1. Files: `src/plugin-kernel/registries/service-registry.ts` (existing)
  Done when: unit test registers a synthetic MCP tool and confirms it's callable via `DiscoveryMcpServer.callTool()`.

---

## Phase 4 — Schema axis (Tier A only)

- **4.1** 🟡 Widen `NodeType` (per `02-BOUNDARY-DESIGN.md` §1 fix #1) to accept plugin-registered strings without `as any` at every call site.
  Files: `src/schema/node.ts` (existing)
  Done when: existing 19 built-in registrations in `schemas.ts` still type-check; a new test registers a non-built-in `NodeType` string without a cast.

- **4.2** 🟡 Enforce `plugin:${pluginId}.` prefixing inside `SchemaRegistry.register()` for non-boot-time callers (fix #2).
  Depends: 4.1. Files: `src/schema/node.ts` (existing)
  Done when: unit test: two plugins registering the same local type name don't collide; a plugin cannot register a `cap-store.*`-prefixed type.

- **4.3** 🟡 Define `SchemaContribution` + `schema-registry.ts` kernel wrapper.
  Depends: 1.3, 4.2. Files: `src/plugin-kernel/registries/schema-registry.ts`
  Done when: unit test registers a contribution end-to-end via the kernel wrapper.

- **4.4** 🟢 Prove the axis: synthetic plugin registers a `NodeType`, writes/reads/validates a Node row, through `PluginHost.install()` only.
  Depends: 4.3, 1.5.4. Files: `tests/integration/plugin-kernel/schema-axis.test.ts`
  Done when: integration test passes end-to-end.

- **4.5** 🟢 Document Tier B (relational fragments, isolated `plugin_ext` datasource) as explicitly deferred.
  Files: `02-BOUNDARY-DESIGN.md` (existing, append if not already sufficient)
  Done when: doc states the deferral and why.

---

## Phase 5 — Core-features axis (targets the `capabilities` bootstrap phase specifically — audit A4)

- **5.1** 🟢 Audit `bootstrap/phases/capabilities.ts` (738 lines) specifically: list everything it constructs, in order, flagging what's plugin-shaped already (it already activates `TrustedPluginManager` — see Phase 1.5) vs. genuinely core infrastructure that should stay eager.
  Files: none → `01d-CAPABILITIES-PHASE-AUDIT.md`
  Done when: doc classifies every construction in the file as "core, stays eager" or "candidate for `FeatureContribution` + lazy activation."

- **5.2** 🟡 Define `FeatureContribution` + `feature-registry.ts`, mapping to `ModuleRegistry`'s existing `ModuleDefinition` shape.
  Depends: 1.2, 1.3. Files: `src/plugin-kernel/registries/feature-registry.ts`
  Done when: unit test maps a `FeatureContribution` to a valid `ModuleDefinition`.

- **5.3** 🔴 Change `ModuleRegistry.define()`'s `create(deps)` to accept a `trusted: true` (raw `ModuleDependencies`, for in-tree modules — no behavior change) or `trusted: false` (`PluginContext`, permission-gated) module.
  Depends: 1.4, 5.2. Files: `src/server/module-registry.ts` (existing)
  Done when: existing bootstrap tests pass unchanged (trusted path); new test confirms a `trusted: false` module can't reach an undeclared dependency.

- **5.4** 🟡 Implement lazy activation for `trusted: false` modules: registered but not `create()`'d until their `activationEvents` fire.
  Depends: 5.3. Files: `src/server/module-registry.ts` (existing)
  Done when: unit test confirms deferred construction until the triggering event.

- **5.5** 🟢 Migrate one item from 5.1's "candidate" list through `feature-registry.ts` as the reference case.
  Depends: 5.4, 1.5.4. Files: `src/server/bootstrap/phases/capabilities.ts` (existing), the chosen module
  Done when: app boots with that construction deferred; existing coverage for it still passes; startup time doesn't regress (measure before/after).

---

## Phase 6 — Harness axis (last; highest real-world risk)

- **6.1** 🟢 Confirm current collision behavior in `harness-command-registry.ts` (already checked in audit B5 — no protection today; this task is writing the regression test that pins that finding before changing anything).
  Files: `tests/unit/engines/harness-command-registry-collision.test.ts` (new, or extend existing test file if one covers this registry)
  Done when: test demonstrates today's silent-overwrite behavior (documents current state before the fix, so the fix's test in 6.2 has a clear before/after).

- **6.2** 🟡 Implement kernel-enforced `${pluginId}.` prefixing for harness `commandId`s, unconditional.
  Depends: 6.1. Files: `src/plugin-kernel/registries/harness-registry.ts`
  Done when: unit test confirms prefixing and that the bare (unprefixed) name doesn't resolve.

- **6.3** 🔴 Implement the shared `chrome:control` runtime confirmation prompt (used by both this axis and §4's `browser-provider` kind) in `permissions.ts`.
  Depends: 3.4, 6.2. Files: `src/plugin-kernel/permissions.ts` (existing)
  Done when: integration test: first activation of a `chrome:control` plugin blocks until an explicit confirmation callback fires; a second plugin needing the same grant type doesn't re-prompt if already confirmed for that plugin.

- **6.4** 🟡 Define `HarnessContribution`, wire into `harness-command-registry.ts`/`harness-repair-engine.ts`.
  Depends: 6.2, 6.3. Files: `src/plugin-kernel/registries/harness-registry.ts` (existing)
  Done when: unit test registers a synthetic command + repair strategy, both reachable from `HarnessRuntime`.

- **6.5** 🟢 Migrate one existing in-tree harness capability through the new path as the reference case.
  Depends: 6.4, 1.5.4. Files: TBD (smallest/lowest-traffic capability from `capability-program-registrar.ts`'s current registrations)
  Done when: that capability still executes correctly end-to-end sourced through `plugins/core/*`.

---

## Phase 7 — Batch migration of `src/engines/*`

- **7.1** 🟢 Domain-group all `src/engines/*.ts` files (browser-automation, memory, canvas, mcp, resilience, observability, misc), explicitly flagging `src/engines/kernel/*` (audit B4 — diagnostics registry) as "kernel-adjacent infrastructure, do not migrate — becomes a consumer of plugin-kernel events instead."
  Files: none → `01e-ENGINES-DOMAIN-MAP.md`
  Done when: every file under `src/engines/` appears in exactly one bucket or is flagged as non-migrating, with a reason.

- **7.2–7.N** 🟡 One task per domain bucket: move files, convert to a manifest + `activate()`, update imports, confirm 1.5's arch test still passes, confirm domain's tests pass unchanged.
  Depends: 7.1 + the axis phase(s) that domain relies on (e.g. browser-automation needs Phase 6 done, since it touches `chrome:control`).
  Done when (per bucket): zero remaining imports from the old path anywhere in `src/`/`frontend/src/`, full suite green.

---

## Cross-cutting / continuous

- **X.1** 🟢 After every phase, re-run `tests/arch/kernel-boundary.test.ts` (1.5) and existing `layer-dependency.test.ts`/`boundary-cdp.test.ts` — any new violation blocks the merge.
- **X.2** 🟢 Keep `02-BOUNDARY-DESIGN.md` updated as implementation diverges from design — it will; update the doc, don't let it drift.
- **X.3** 🟡 Second-reviewer sign-off required after Phase 1.5 (plugin trust — audit B1 showed this was silently non-functional; the fix deserves scrutiny), Phase 2 (UI — real XSS/sandbox-escape surface even though A1 shows the foundation is solid), and Phase 6 (`chrome:control` — real browser-automation surface).

---

## Suggested execution order

```
0.1 → 0.2 → 0.3 → 0.4
1.1 → 1.2 → 1.3 → 1.4 → 1.5 → 1.6
1.5.1 → 1.5.2 → 1.5.3 → 1.5.4 → 1.5.5
2.1 → 2.2 → 2.3 → 2.4 → 2.5           (needs 1.5.4)
3.1 → 3.2 → 3.3 → 3.4 → 3.5 → 3.6     (3.5 needs 1.5.4)
4.1 → 4.2 → 4.3 → 4.4 → 4.5           (4.4 needs 1.5.4)
5.1 → 5.2 → 5.3 → 5.4 → 5.5           (5.5 needs 1.5.4)
6.1 → 6.2 → 6.3 → 6.4 → 6.5           (6.3 needs 3.4; 6.5 needs 1.5.4)
7.1 → 7.2 … 7.N
```

Phase 1.5 is now the true fan-out point: Phases 2, 3, 4, and 5 can proceed
in parallel once Phase 1.5 lands (they only need `PluginHost.install()` to
exist for their "prove the axis" task, not to be feature-complete). Phase 6
stays serialized after Phase 3 (shared `chrome:control` gate). Phase 7 is
last by construction.
