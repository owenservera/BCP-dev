# Plugin Kernel — Map & Layer Taxonomy

> Visual companion to `CHARTER.md` and `PLAN.md`.  
> Interactive version: `visual/index.html` (open directly in a browser, no build).  
> This file is the printable/textual authority; the HTML is the explorable one. Both are generated from the same taxonomy — keep them in sync (same PR).

---

## 1. Four Layers, One Dependency Direction

```
┌─────────────────────────────────────────────────────────────────────────┐
│ Layer 4  EXTERNAL PLUGINS                                                │
│          third-party .vivim-plugin archives                              │
│          e.g. acme.invoicer, community.notion-extended                   │
│          ─────────────────────────────────────                          │
│          trust: untrusted (PluginContext only) · lifecycle: on-install   │
└──────────────────────────────┬──────────────────────────────────────────┘
                               │  manifest contributes (permission-gated)
                               ▼
┌─────────────────────────────────────────────────────────────────────────┐
│ Layer 3  PLUGIN TOOLING          design & development infra              │
│          CLI scaffolding · Zod manifest validation · dev server          │
│          hot reload · asset pipeline (kernel-controlled scriptUrl store)  │
│          NL plugin builder (plugin-builder-router.ts)                    │
│          ─────────────────────────────────────                          │
│          produces / consumes Layer 4 & Layer 2                           │
└──────────────────────────────┬──────────────────────────────────────────┘
                               │  produces / consumes
                               ▼
┌─────────────────────────────────────────────────────────────────────────┐
│ Layer 2  CORE DEFAULT PLUGINS    shipped with product, in-tree           │
│          plugins/core/provider-discord/, schema extensions,               │
│          future: browser-automation, memory, canvas, mcp domains          │
│          ─────────────────────────────────────                          │
│          trust: trusted:true (review-gated) · lifecycle: eager in v1    │
│          (lazy via activationEvents in v2, capabilities phase only)       │
└──────────────────────────────┬──────────────────────────────────────────┘
                               │  registers via
                               ▼
┌─────────────────────────────────────────────────────────────────────────┐
│ Layer 1  PLUGIN KERNEL           src/plugin-kernel/                        │
│          PluginHost (discover/certify/install/enable/disable/uninstall)  │
│          PluginContext (permission-gated capability bag)                  │
│          registries: schema-registry / service-registry / ui-registry      │
│          events bridge (V1→V2) · permissions + manifest Zod               │
│          ─────────────────────────────────────                          │
│          delegates to Layer 0, never imports from engines                │
└──────────────────────────────┬──────────────────────────────────────────┘
                               │  delegates to
                               ▼
┌─────────────────────────────────────────────────────────────────────────┐
│ Layer 0  CORE (immutable)         never changed to accommodate plugins     │
│          bootstrap 5-phase pipeline (orchestrator.ts:15)                 │
│          SchemaRegistry (schema/node.ts:207) · storage contracts          │
│          ModuleRegistry (server/module-registry.ts:59)                   │
│          SandboxedNode (frontend/.../SandboxedNode.tsx:19)               │
│          provider-registrar + harness-command-registry + generated file   │
│          UniversalComponentRegistry (frontend/.../universal-registry.ts)  │
│          ─────────────────────────────────────                          │
│          dependency rule target — must remain importable by kernel         │
└─────────────────────────────────────────────────────────────────────────┘
```

**Rule:** `plugin-kernel → {shared, src/schema, src/storage/contracts, src/lib}` only (enforced by `tests/arch/kernel-boundary.test.ts`). Engines never import from `plugin-kernel`. `PluginContext` is the only object a plugin's `create()/activate()` ever receives. Violation = P0.

---

## 2. What Lives Where — Grounded File Map

| Layer | Example files (from this clone) | Trust | Lifecycle |
|-------|---------------------------------|-------|-----------|
| **Core** | `src/server/bootstrap/orchestrator.ts:15`, `src/server/bootstrap/context.ts:37`, `src/schema/node.ts:207`, `src/storage/contracts/*` (40+ contracts), `src/server/module-registry.ts:59`, `frontend/src/components/canvas/SandboxedNode.tsx:19`, `src/engines/harness-command-registry.ts:54`, `src/engines/provider-registrar.ts:62`, `frontend/src/shared/universal-registry.ts:127` | System | Eager, at boot |
| **Core Default Plugins** | Future `plugins/core/provider-discord/` (Phase 3.5 proof), `plugins/core/schema-*` (Phase 4.4 proof), later: `plugins/core/browser-automation/`, `memory/`, `canvas/`, `mcp/`, `resilience/`, `observability/`, `misc` (one bucket per PR after Phase 7 map) | `trusted:true` (in-tree, review-gated) | Eager in v1 → lazy via `activationEvents` inside `capabilities` phase in v2 |
| **Plugin Tooling** | `src/server/plugin-router.ts:100` (evolves into `PluginHost` asset store), `src/server/plugin-builder-router.ts`, `src/cli/`, manifest Zod (`src/plugin-kernel/manifest.ts`), scaffolding CLI (new), dev watch/hot reload (new) | System | Build/dev time |
| **External Plugins** | `.vivim-plugin` tar.gz archives (produced by tooling), `frontend/plugins/sample-plugin/` + `demo-plugin/` (fixtures that will install via `PluginHost` after Phase 2.4) | `trusted:false` → `PluginContext` only | Lazy / on-install |

### Counts from this clone

- `src/engines/*.ts`: **186** files (pre-migration inventory for Phase 7)
- `src/storage/contracts/*.ts`: **40+** contracts
- `frontend/src/shared/*`: **36** modules
- `src/engines/kernel/*`: **10** files (diagnostics kernel — do not migrate, see `adr/001`)
- `*registry*.ts` (excluding tests): **~30** — why every task names exact file paths, not "the registry"

---

## 3. Data Flow — Install Path (the only path after Phase 1.5)

```
.vivim-plugin (tar.gz)
      │
      ▼ discover()  ── extractTarGz + sha256 + manifest parse (plugin-router.ts:47→ host.ts)
      │
      ▼ certify()   ── Zod + hash re-verify + permission↔contributes + scriptUrl origin
      │
      ├── schema:extend? ──► schema-registry.ts ──► SchemaRegistry.register() with plugin:${id}. prefix
      ├── network?     ──► service-registry.ts ──► ProviderRegistrar.registerOne() + generator cache rebuild
      ├── ui:*?        ──► ui-registry.ts      ──► UiComponentStore / UniversalComponentRegistry
      ├── (v2) harness?  ──► harness-registry.ts ──► ${pluginId}. prefix + chrome:control gate
      └── (v2) features? ──► feature-registry.ts ──► ModuleRegistry inside capabilities phase
      │
      ▼ emit plugin:installed (V2 publish + V1 bridge)
      ▼ KernelRegistry.registerEngine() — observability (no structural change)
```

Atomicity: extract to `tmpdir()/vivim-plugin-staging/install-<ulid>` (already `plugin-router.ts:104`), `rm -rf` on failure before DB write. No partial rows.

---

## 4. Trust Tiers (permission lattice)

| Permission | What it unlocks | Trust bar |
|------------|-----------------|-----------|
| `storage:scoped` | `ctx.storage.scoped(pluginId)` only | Low |
| `schema:extend` | Register `plugin:${id}.` NodeTypes | Low–med |
| `network` | Register `api-protocol` / `mcp-*` services | Med |
| `ui:custom-html-css-only` | `generated` without `scriptUrl` | Low |
| `ui:custom-scripturl` | `generated` with `scriptUrl` → kernel-asset origin only | Med |
| `ui:compiled-component` | `UniversalComponentRegistry.register()` — ships code into bundle | **High** (review-gated, v1 rejected) |
| `chrome:control` / `read-only` | `browser-provider` + harness recipes (drive authenticated browser) | **Highest** (runtime confirmation, v2) |

`permissions.ts` is the single grant/check + confirmation-prompt site (shared by harness + `browser-provider`).

---

## 5. How to Read the Visual

Open `visual/index.html` in any browser (no build, no server). It renders the same four layers interactively:

- **Click a layer** → highlights its files, trust, and the dependency arrows that are allowed vs. forbidden (red dashed = would violate `kernel-boundary`).
- **Click a contribution type** (schema / service / ui) → traces the exact file path from manifest → registry → store → renderer.
- **Toggle v1 vs v2** → dims the v2-only contributions (`harness`, `features`, `compiled`, `browser-provider`) so scope is visually obvious.
- **Search** → filters to a file or permission string across all layers.

Keep `MAP.md` and `visual/index.html` in sync: change the taxonomy here → update the HTML's `LAYERS` const in the same PR.

---

## 6. Anti-Patterns This Map Prevents

| Anti-pattern | What the map makes visible |
|--------------|----------------------------|
| Treating `src/engines/kernel/` as the plugin kernel | Two distinct kernels with different purposes, different directories, different colors |
| Routing around a circular dep with `require()` | Red dashed arrow `plugin-kernel → engines → plugin-kernel`; the fix is `→ contracts` |
| Adding a third install path | Install flow has exactly one box (`host.ts`); anything else is off-map by definition |
| Silently ignoring a `contributes` key | Strict manifest + DIMMED v2 badges; unsupported keys are not "maybe", they're "not yet" |
| Letting doc/code drift | Map's `LAYERS` const and this file's table are the same data — a drift shows as a failing visual |

---

*This map is the shared mental model for every PR. If the map and the code disagree, fix the code or fix the map — never let them diverge.*
