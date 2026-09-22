# Plugin Kernel — Canonical Plan v3

> **Source of truth for what we build, in what order, and what "done" means.**  
> Prior docs `01-AUDIT-FINDINGS.md` / `02-BOUNDARY-DESIGN.md` / `03-TASKS.md` / `PLUGIN_KERNEL_*` are **input evidence** retained for history — this file is the instruction.  
> **Iteration:** I-1 Formalization → I-2 Deep Probe → I-3 Scaffold → I-4 Trust+Axes → I-5 Hardening (see `CHARTER.md` §5).  
> **Date:** 2026-08-28 · **Status:** I-1 draft for approval

---

## 1. Decisions Taken (D1–D7)

Every decision is an ADR in `adr/`. Summary here; detail there.

| # | Decision | One-line why | ADR | Reversible |
|---|----------|--------------|-----|------------|
| D1 | Kernel at `src/plugin-kernel/` | `src/engines/kernel/kernel-registry.ts:15` is a live diagnostics kernel; `src/kernel/` would collide silently (audit B4) | `adr/001-kernel-location.md` | No |
| D2 | v1 = 3 axes only (schema Tier-A, UI generated, services api/mcp) | Harness + `browser-provider` share an authenticated-browser trust boundary that needs its own security review; shipping half is worse than shipping none | `adr/002-v1-scope.md` | Yes (feature flag) |
| D3 | V2 is canonical for kernel, V1 stays behind a bridge | V2 (`capability-event-bus-v2.ts:46`) has envelopes/DLQ/`publishAndWait`; V1 has 23 flat types across the codebase — big-bang migration is the costliest risk | `adr/003-event-bus.md` | Yes |
| D4 | `PluginHost` unifies `TrustedPluginManager` + `plugin-router.ts` | Two install paths already diverge (B1: `plugin-manager-impl.ts:35` stubbed vs `plugin-router.ts:100` real); a third is malpractice | `adr/004-plugin-host.md` | No |
| D5 | Widen `NodeType` to `BuiltinNodeType \| (string & {})`, enforce `plugin:${id}.` inside `SchemaRegistry.register()` | `src/schema/node.ts:56` closed union vs `src/schema/node.ts:207` runtime-mutable `Map`; `as any` already pervasive — formalize it | `adr/005-schema-prefix.md` | No |
| D6 | `ModuleRegistry` stays eager in v1; lazy `activationEvents` deferred to v2 | 150+ `src/engines/*.ts` files; eager→lazy across all phases without a per-engine audit risks boot regression | `adr/006-lazy-activation.md` | Yes |
| D7 | `provider-protocol-generator.ts` → in-memory cache + disk snapshot, add `ProviderRegistrar.registerOne` | `provider-registrar.ts:313` `seedAll()` reads only `PROVIDER_MANIFESTS` import; no runtime path | `adr/007-protocol-cache.md` | Yes |

---

## 2. Package Layout (what we create)

```
src/plugin-kernel/                 # D1 — never src/kernel/
  index.ts                         # barrel
  manifest.ts                      # PluginManifest Zod schema (strict, D2)
  permissions.ts                   # PluginPermission + ActivationEvent unions
  plugin-context.ts                # PluginContext — permission-gated capability bag
  host.ts                          # PluginHost — discover/certify/install/enable/disable/uninstall (D4)
  events.ts                        # V1→V2 bridge + canonical export (D3)
  registries/
    schema-registry.ts             # wraps SchemaRegistry, Tier A only (D5)
    service-registry.ts            # wraps ProviderRegistrar + ai/protocol + mcp (D7)
    ui-registry.ts                 # wraps UiComponentStore + UniversalComponentRegistry (A1–A3)
    # v2 (designed, not built in I-1..I-4):
    # feature-registry.ts          # wraps ModuleRegistry inside capabilities phase (D6)
    # harness-registry.ts          # wraps harness-command-registry + DAC + chrome gate (D2)

src/schema/node.ts                 # D5 widening + prefix enforcement (one file)
src/engines/provider-registrar.ts  # D7 registerOne + FK pluginId
src/engines/provider-protocol-generator.ts # D7 cache
src/server/bootstrap/context.ts    # thread PluginHost via BootstrapContext
src/server/bootstrap/phases/capabilities.ts # activate PluginHost, not globalThis
```

Every `registries/*.ts` delegates. `host.ts` is the only file doing new work.

---

## 3. Unified Manifest (v1, strict)

```ts
interface PluginManifest {
  id: string                 // reverse-DNS: "acme.invoicer"  /^[a-z0-9]+(\.[a-z0-9-]+)+$/
  version: string            // semver
  displayName?: string
  description?: string
  activationEvents: ActivationEvent[]   // ['onStartup'] acted on in v1; others parsed but not acted on
  permissions: PluginPermission[]
  contributes: {
    schema?: SchemaContribution[]
    services?: ExternalServiceContribution[]
    ui?: UiContribution               // generated only in v1
  }
}

type PluginPermission =
  | 'network'
  | 'storage:scoped'
  | 'schema:extend'
  | 'ui:custom-html-css-only'
  | 'ui:custom-scripturl'
  | 'ui:compiled-component'          // parsed, rejected with review-gate error in v1
  // v2 (defined, not enforced yet):
  // | 'chrome:control' | 'chrome:control:read-only'

type ActivationEvent =
  | 'onStartup'
  | `onCommand:${string}` | `onProvider:${string}` | `onSchema:${string}` // parsed, deferred

interface SchemaContribution {
  nodeType: string          // local name, e.g. "invoice" → stored as "plugin:acme.invoicer.invoice"
  schema: z.ZodType
  indexContent?: (data: unknown) => string
  embeddingText?: (data: unknown) => string
}

interface ExternalServiceContribution {
  kind: 'browser-provider' | 'api-protocol' | 'mcp-server' | 'mcp-client'
  manifest: ProviderManifest | OpenAiCompatibleManifest | McpServerManifest
  // v1: browser-provider rejected with "requires chrome:control — not yet available"
  // v1: mcp-* optional follow-up within same phase if time allows
}

interface UiContribution {
  generated?: Array<{
    slotId: string
    scope: 'system' | 'cross-type' | 'family' | 'provider'
    variant?: string
    ownerId?: string
    html: string
    css: string
    scriptUrl?: string        // must be kernel-asset origin
    contract?: ComponentContract
    constraints?: ComponentConstraints
  }>
  compiled?: Array<{          // parsed, rejected at certify in v1
    id: string; kind: ComponentKind; category: ComponentCategory; slot?: string
  }>
}
```

**Strictness rule:** unknown `contributes` keys fail Zod with `Unsupported contribution 'harness' — not yet available in this release. See adr/002.`

---

## 4. Per-Axis Contracts (code-grounded)

### 4.1 Schema — Tier A (`src/schema/node.ts`)

- **Widen** `NodeType:56` — introduce `BuiltinNodeType` alias for the 34 literals, then `type NodeType = BuiltinNodeType | (string & {})`. Existing 19 `registerAllSchemas()` calls in `schemas.ts` stay typed; a plugin string no longer needs `as any`.
- **Prefix** inside `SchemaRegistry.register():210` — add `caller: 'boot' | { pluginId: string }`. Boot skips prefix; plugin caller is forced through `` `plugin:${pluginId}.${local}` ``. Reject `cap-store.*` for plugins, reject collisions. Two plugins registering `invoice` do not shadow each other.
- **Store** is the existing `Node` table (`data: unknown` validated against the plugin's Zod). No migration. Tier B (relational fragments, isolated `plugin_ext` datasource) is an ADR, not code.

### 4.2 External Services (`src/engines/provider-registrar.ts` + generator)

- Add `registerOne(manifest, {source:'plugin', pluginId})` alongside `seedAll():313` (unchanged — regression test proves bit-for-bit). The method does the same 7-table upsert (`provider_definition`, `provider_endpoint`, `provider_parser` with 2-pass fallback, `provider_capability`, `provider_config`, `provider_model`) but sets `provider_definition.pluginId = pluginId` (FK already exists — `plugin-router.ts:276` already links `ProviderDefinition.slug → PluginRegistry.name`).
- Generator `provider-protocol-generator.ts` output becomes **in-memory map rebuilt on `PluginHost.install/uninstall`**, disk file kept as boot snapshot. A provider registered via `registerOne` is queryable without restart; existing consumers of the generated file are unaffected (they read the in-memory map first, disk second).
- `service-registry.ts` gates on `network` always. `kind:'browser-provider'` is rejected in v1 with a chrome-gate error (shares the harness gate; one confirmation, not two, when it lands in v2).

### 4.3 Frontend UI (`shared/ui-component.ts` + `SandboxedNode.tsx` + `UniversalComponentRegistry`)

- **Dynamic path:** `UiContribution.generated[]` expands to `UiComponent` rows using the real shape `shared/ui-component.ts:99` (`html, css, scriptUrl, sandboxJson, constraintsJson, contractJson`). `scriptUrl` must resolve to kernel-controlled asset storage — checked at `host.ts:certify()` **and** at `ui-registry.ts:register()` (defense in depth). `SandboxedNode.tsx:19` stays the renderer (`sandbox="allow-scripts"` without `allow-same-origin`, opaque origin, `MessageChannel` bridge, `S92` allow-list, `S93` watchdog).
- **Compiled path:** `UniversalComponentRegistry` (`frontend/src/shared/universal-registry.ts:127` `register()`) — v1 parses `compiled[]` but rejects at certify with review-gate error. Shipping compiled React is equivalent to a core feature and gets the same scrutiny.
- **Resolution:** `UiComponent` (3 `PrimitiveScope` values `shared/conceptual-model.ts:15`, ordered as 6-tier precedence by `(scope × ownerId × variant)`) for dynamic; `UniversalComponentRegistry.resolve(slot,ctx)` for compiled — both stay, not merged.

### 4.4 `PluginContext` (the only surface a plugin touches)

```ts
interface PluginContext {
  pluginId: string
  permissions: PluginPermission[]
  events: Pick<CapabilityEventBusV2, 'publish'|'publishAndWait'|'on'|'once'|'onAny'>
  storage: { scoped(id: string): ScopedStore }   // plugin can only open its own scope
  schema: { register(c: SchemaContribution): void }
}
```

### 4.5 `PluginHost` lifecycle (unified, D4)

```
discover(tar.gz) → {valid, manifest, hash}
  certify(manifest) → {passed, report}   // Zod + hash re-verify + permission↔contributes + scriptUrl origin + schema prefix
  install(manifest) → calls per-axis registries (stubs ok until axes ship)
  enable/disable/toggle → flips pluginRegistry.isActive + providerDefinition.isActive + uiComponent.status
  uninstall → deletes provider_*, ui_component (scope:provider), pluginRegistry row, pluginDir; emits plugin:uninstalled
```

Atomicity: extract to `tmpdir()/vivim-plugin-staging/install-<ulid>` (already `plugin-router.ts:104`), `rm -rf` on any failure before DB write. No partial rows after a failed install.

---

## 5. Phased Execution

### Phase 0 — Event bus bridge [I-3, 1 PR, ~1 day, 🟢]

| Task | Files | Done when |
|------|-------|-----------|
| 0.1 Diff V1 vs V2: every event type + every importer | Research → `evidence/event-bus-diff.md` | 100% of `grep -rn "capability-event-bus"` call sites tabled |
| 0.2 Ship `src/plugin-kernel/events.ts` bridge: V1 `emit()` mirrored to V2 `publish('legacy:${type}', event)` | `src/plugin-kernel/events.ts` | Test: `V1.emit({type:'provider:seeded'})` appears in `V2.snapshot()` with correlationId; DLQ still isolates errors |
| 0.3 Arch test: at most two bus modules exist, `src/plugin-kernel/**` never imports V1 | `tests/arch/single-event-bus.test.ts` | CI green |

Exit gate: arch test green. No consumer migration — V1 stays.

### Phase 1 — Kernel scaffold, no behavior [I-3, 1 PR, ~1 day, 🟢]

| Task | Files | Done when |
|------|-------|-----------|
| 1.1 `src/plugin-kernel/` barrel | `src/plugin-kernel/index.ts` | Builds clean |
| 1.2 `PluginPermission` + `ActivationEvent` unions (D2/D5 list) | `src/plugin-kernel/permissions.ts` | Types exhaustive |
| 1.3 `PluginManifest` Zod (strict, `contributes.harness` → actionable error) | `src/plugin-kernel/manifest.ts` | Unit test: minimal validates, missing `id` rejected, `harness` rejected with ADR pointer |
| 1.4 `PluginContext` ( `ctx.events` only, wired to Phase 0 bridge) | `src/plugin-kernel/plugin-context.ts` | Stub `activate(ctx)` compiles with `ctx.events.on(...)` |
| 1.5 Kernel boundary arch test **now** while dir is empty | `tests/arch/kernel-boundary.test.ts` | Fails if `src/plugin-kernel/` imports from `src/engines/*` or `plugins/*` |
| 1.6 Locate `CONVERGENCE-PLAN` (`.genome/DECISIONS.md`'s `control-plane\CANON.md` pointer + `tests/unit/ai/convergence-c1-c4.test.ts`) | Research → `evidence/convergence-crossref.md` | Found+cross-ref'd or documented absent |

Exit gate: `tests/arch/` green, zero behavioral change.

### Phase 1.5 — Plugin trust/install, the real build [I-4, 2 PRs, ~3 days, 🟡→🟢]

| Task | Files | Done when |
|------|-------|-----------|
| 1.5.1 Document `TrustedPluginManager` vs `plugin-router.ts` method-by-method | Research → `evidence/plugin-host-unification.md` | Every public method tabled: real / stub / overlaps |
| 1.5.2 `PluginHost.discover()` for real — **move** `plugin-router.ts:47` `extractTarGz` + `computeFileHash:20` into `host.ts` | `src/plugin-kernel/host.ts` | Test: valid archive → `valid:true`, tampered hash → `valid:false` |
| 1.5.3 `PluginHost.certify()` — Zod + hash re-verify + permission↔contributes + `scriptUrl` origin | `src/plugin-kernel/host.ts` | Test: `ui.generated[0].scriptUrl` without `ui:custom-scripturl` → certify fails with actionable error |
| 1.5.4 `PluginHost.install()` → per-axis registries (stubs ok) | `src/plugin-kernel/host.ts` | Test: `contributes.services` calls service-registry stub once with correct `pluginId` |
| 1.5.5 Replace `globalThis.__pluginManager` with `BootstrapContext` threading (`src/server/bootstrap/context.ts:37` + `phases/capabilities.ts:42`) | `context.ts`, `phases/capabilities.ts` | `grep -rn "__pluginManager" src` → 0; boot test green; circular dep resolved directionally (no `require()` hack) |

**Security review gate (required, second reviewer):** hash-before-write, no `eval`/`new Function` on manifest fields, `scriptUrl` not bypassable via `../`, `//`, `data:`.

### Phase 2 — UI axis [I-4, 1 PR, ~2 days, 🟡]

| Task | Files | Done when |
|------|-------|-----------|
| 2.1 Confirm `scriptUrl` write sites are trusted-origin only | Research → addendum to `evidence/plugin-host-unification.md` §UI | Every writer (`grep -rn "scriptUrl" src shared frontend`) listed with file:line; any gap ticketed |
| 2.2 `UiContribution.generated[] → UiComponent` expansion (real shape `shared/ui-component.ts:99`) | `src/plugin-kernel/registries/ui-registry.ts` | Unit test: one entry → correct row |
| 2.3 Enforce `ui:custom-scripturl` at registry write | `ui-registry.ts` | Test: `scriptUrl` without permission → rejection |
| 2.4 Wire `PluginHost.install()` → `ui-registry.ts` | `src/plugin-kernel/host.ts` | `sample-plugin`/`demo-plugin` install via new path; existing tests pass |
| 2.5 Defer `compiled[]` → review-gate reject at certify | `manifest.ts`, `host.ts` | Test: `ui.compiled` → `certify() failed: ui:compiled-component requires review gate` |

**Security review gate (required):** `scriptUrl` XSS surface.

### Phase 3 — External services axis [I-4, 1 PR, ~2 days, 🟡]

| Task | Files | Done when |
|------|-------|-----------|
| 3.1 `ExternalServiceContribution` type | `src/plugin-kernel/registries/service-registry.ts` | Compiles against both manifest shapes |
| 3.2 `ProviderRegistrar.registerOne` alongside `seedAll()` | `src/engines/provider-registrar.ts` | Regression: `seedAll()` unchanged; new unit test for `registerOne` with `pluginId` FK |
| 3.3 Generator → in-memory cache + disk snapshot | `src/engines/provider-protocol-generator.ts` | `registerOne` provider queryable without restart |
| 3.4 Wire `service-registry.ts` gated on `network` | `service-registry.ts` | Synthetic `api-protocol` round-trips |
| 3.5 Prove: one real provider (Discord or Notion) migrated exclusively via plugin path | `plugins/core/provider-discord/` | Integration tests pass with in-tree seed removed |

### Phase 4 — Schema axis, Tier A [I-4, 1 PR, ~1 day, 🟡]

| Task | Files | Done when |
|------|-------|-----------|
| 4.1 Widen `NodeType` | `src/schema/node.ts:56` | 19 built-ins still type-check; non-builtin without `as any` passes |
| 4.2 Enforce `plugin:${id}.` inside `SchemaRegistry.register()` | `src/schema/node.ts:210` | Two plugins same local name do not collide; `cap-store.*` rejected |
| 4.3 `SchemaContribution` + `schema-registry.ts` wrapper | `src/plugin-kernel/registries/schema-registry.ts` | End-to-end via wrapper |
| 4.4 Prove: synthetic plugin writes/reads/validates a Node row via `PluginHost.install()` only | `tests/integration/plugin-kernel/schema-axis.test.ts` | Integration green |
| 4.5 Document Tier B deferral | `adr/005-schema-prefix.md` addendum | States `plugin_ext` datasource isolation |

### Phase 5 — Core-features axis [I-5, docs only in v1]

Classify every construction in `capabilities.ts:26` (738 lines) as "core, stays eager" vs "candidate for `FeatureContribution` + lazy `activationEvents`". *Do not* change `ModuleRegistry.define().create(deps)` yet. Audit doc is the exit criterion.

### Phase 6 — Harness axis [I-5, docs + regression test only in v1]

Pin today's silent-overwrite: `tests/unit/engines/harness-command-registry-collision.test.ts` (demonstrates bug → fix has before/after). Define `HarnessContribution` + shared `chrome:control` gate. No prefixing or prompt wiring until Phase 3's gate has a real UI surface.

### Phase 7 — Batch migration of `src/engines/*` [not in this pass]

Domain-group `src/engines/*.ts` (186 files, count from this clone) → buckets (browser-automation, memory, canvas, mcp, resilience, observability, misc), flag `src/engines/kernel/*` as "do not migrate — consumer of plugin events". One bucket per PR, each blocked on its axis phase + arch test.

---

## 6. Execution Order

```
0.1 → 0.2 → 0.3
1.1 → 1.2 → 1.3 → 1.4 → 1.5 → 1.6
1.5.1 → 1.5.2 → 1.5.3 → 1.5.4 → 1.5.5          ← fan-out point
2.1 → 2.2 → 2.3 → 2.4                         (needs 1.5.4)
3.1 → 3.2 → 3.3 → 3.4 → 3.5                    (3.5 needs 1.5.4)
4.1 → 4.2 → 4.3 → 4.4 → 4.5                    (4.4 needs 1.5.4)
5.audit, 6.audit, 7.map  (docs only, parallel, after 1.5.5 — v2)
```

Phases 2/3/4 parallelizable once 1.5 lands. Phases 5/6/7 are v2.

---

## 7. Gates (CI, not judgment)

| Gate | Command | Blocks merge |
|------|---------|--------------|
| Kernel boundary | `bun test tests/arch/kernel-boundary.test.ts` | Yes |
| Layer deps | `bun test tests/arch/layer-dependency.test.ts` (with `src/plugin-kernel` layer) | Yes |
| Single bus | `bun test tests/arch/single-event-bus.test.ts` | Yes |
| No ambient manager | `grep -rn "__pluginManager" src` → 0 after 1.5.5 | Yes |
| Docs-as-byproduct | Behavioral change without `docs/kernel-plugins/` touch → review fail | Yes |

Every gate is a file in `tests/arch/`, not a checklist.

---

## 8. Per-PR Checklist (paste into each plugin-kernel PR)

```
- [ ] Arch tests green (kernel-boundary + layer-dependency + single-event-bus)
- [ ] Permission check at certify() AND at registry write (defense in depth)
- [ ] Namespace prefix enforced inside registry, not trusted from plugin
- [ ] No src/plugin-kernel/ → src/engines/* import (arch test)
- [ ] No globalThis, no require() hack — BootstrapContext only
- [ ] Rollback path in PR body (which DB rows, which files)
- [ ] Docs updated in same PR (PLAN/STATUS/adr or evidence addendum)
```

---

## 9. What "Done Properly" Means

- No third install path. A new `tar.gz` extraction or `new PluginManagerImpl` outside `src/plugin-kernel/host.ts` after 1.5 is a P0.
- No silent shadowing. Two plugins registering the same local name do not collide (schema, harness in v2, UI slot).
- No plugin can corrupt core data. FK + scope + prefix + atomic `stagingDir` + `rm` on failure.
- Clean boot with zero plugins stays green. Kernel is additive — never required for existing boot.

---

*This plan is the build instruction. Changing scope requires amending this file and `CHARTER.md` in the same PR.*
