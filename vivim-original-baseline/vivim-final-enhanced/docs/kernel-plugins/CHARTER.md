# Plugin Kernel — Project Charter

> **Owner:** This agent (E2E responsible). Full decision rights.  
> **Workspace:** `docs/kernel-plugins/` is the project folder — single source of truth for charter, plan, status, evidence, ADRs, and visuals. No parallel trackers.  
> **Date:** 2026-08-28 · **Iteration:** 1 of N (formalization) · **Canonical plan:** `PLAN.md` (v3)

---

## 1. Mandate

Build the **Vivim Plugin Kernel** — the permission-gated, manifest-unified boundary that turns five mature-but-disconnected extensibility mechanisms into one coherent plugin surface:

| Axis | Mechanism (exists today) | Kernel wraps |
|------|--------------------------|--------------|
| Schema | `SchemaRegistry` (`src/schema/node.ts:207`) — `Map<NodeType, NodeSchema>`, runtime-mutable | `schema-registry.ts` + `NodeType` widening |
| Core features | 5-phase `bootstrap/` pipeline (`src/server/bootstrap/orchestrator.ts:15`) + `ModuleRegistry` (`src/server/module-registry.ts:59`) | `feature-registry.ts` inside `capabilities` phase only |
| Harness | `harness-command-registry.ts:54` + DAG compiler + repair/checkpoint | `harness-registry.ts` + DAC + `chrome:control` gate |
| External services | `provider-registrar.ts:62` + `ai/protocol/*` + `mcp/server.ts` | `service-registry.ts` + `registerOne` + in-memory protocol cache |
| Frontend UI | `SandboxedNode.tsx:19` + `UniversalComponentRegistry` (`frontend/src/shared/universal-registry.ts:127`) + `UiComponent` (`shared/ui-component.ts:99`) | `ui-registry.ts` (generated) |

Cross-cutting: **packaging/trust** — unify `TrustedPluginManager` (`src/ai/plugins/plugin-manager-impl.ts:35`, stubbed) and `plugin-router.ts:100` (real tar.gz→sha256→DB pipeline) into one `PluginHost` (`src/plugin-kernel/host.ts`). This is the only genuinely unbuilt piece (audit B1); everything else is a thin permission wrapper.

---

## 2. Decision Rights

- **Agent decides, human ratifies.** I take ownership of scope, sequencing, naming, manifest shape, permission lattice, and gate criteria. Human approval is sought at phase boundaries (green → next phase) and at the three security gates, not per-file.
- **ADR discipline.** Every D1–D7-class decision is recorded in `adr/` before the code that implements it merges. No decision lives only in a PR description.
- **No second source of truth.** `docs/kernel-plugins/STATUS.md` is the tracker. GitHub issues, if created, mirror it — never the reverse.
- **Docs-as-byproduct.** Code and doc ship in the same PR. A behavioral, architectural, or contract change without a doc touch in the same commit is a defect.

---

## 3. Scope — What Is In / Out For v1

**v1 ships (this charter):**
- `src/plugin-kernel/` with `manifest.ts`, `permissions.ts`, `plugin-context.ts`, `host.ts`, `events.ts`, `registries/{schema,service,ui}-registry.ts`
- `NodeType` widening + `plugin:${id}.` prefix enforcement
- `ProviderRegistrar.registerOne` + in-memory protocol cache
- `UiComponent` generated expansion + `ui:custom-scripturl` origin gate
- `PluginHost` unified lifecycle (discover/certify/install/enable/disable/uninstall) threaded through `BootstrapContext` (no `globalThis.__pluginManager`)
- One real provider migrated through the plugin path (Discord or Notion) as proof

**Explicitly out of v1 (designed, not built):**
- `harness-registry.ts` + `${pluginId}.` DAC + `chrome:control` confirmation prompt (spec + regression test in v1, wiring in v2)
- `feature-registry.ts` lazy `activationEvents` (audit + mapping in v1, wiring in v2)
- `ui.compiled[] → UniversalComponentRegistry` (parsed, rejected with review-gate error in v1)
- Tier B relational fragments / `plugin_ext` datasource (ADR only)

Why this cut: v1's blast radius is bounded to the three lowest-risk, highest-value axes. Harness and browser-provider share a real authenticated-browser trust boundary that deserves its own security review; shipping half of it in v1 would be worse than shipping none of it.

---

## 4. Layer Taxonomy (visual anchor)

The map in `visual/index.html` and `MAP.md` makes this taxonomy tangible. Four layers, one dependency direction:

```
Layer 4  EXTERNAL PLUGINS          third-party .vivim-plugin archives
             ↓  manifest contributes (permission-gated)
Layer 3  PLUGIN TOOLING            CLI scaffolding, manifest validation, dev server, hot reload, asset pipeline
             ↓  produces/consumes
Layer 2  CORE DEFAULT PLUGINS      engines migrated to plugins/core/* (shipped with product, trusted:true initially)
             ↓  registers via
Layer 1  PLUGIN KERNEL             src/plugin-kernel/ — PluginHost + PluginContext + per-axis registries
             ↓  delegates to
Layer 0  CORE (immutable)          bootstrap phases, SchemaRegistry, storage contracts, SandboxedNode, ModuleRegistry, provider/harness engines
```

**Dependency rule (enforced by `tests/arch/kernel-boundary.test.ts`):**
`plugin-kernel → {shared, src/schema, src/storage/contracts, src/lib}` only. Nothing in `src/plugin-kernel/` imports from `src/engines/*` (including `src/engines/kernel/` diagnostics) or `plugins/*`. `PluginContext` is the only capability object a plugin's `create()/activate()` ever receives. Engines never import from `plugin-kernel`.

**What lives where:**

| Layer | Example files (grounded) | Trust | Lifecycle |
|-------|--------------------------|-------|-----------|
| **Core** | `src/server/bootstrap/orchestrator.ts`, `src/schema/node.ts`, `src/storage/contracts/*`, `src/server/module-registry.ts`, `frontend/src/components/canvas/SandboxedNode.tsx`, `src/engines/harness-command-registry.ts`, `src/engines/provider-registrar.ts` | System | Eager, at boot |
| **Core Default Plugins** | Future `plugins/core/provider-discord/`, `plugins/core/schema-memory-extension/`, migrated engine domains after Phase 7 (browser-automation, memory, canvas, etc.) | `trusted:true` (in-tree, review-gated) | Eager in v1, lazy via `activationEvents` in v2 |
| **Plugin Tooling** | `src/cli/`, `src/server/plugin-router.ts` (evolves into `PluginHost` asset store), manifest Zod schema, scaffolding CLI, dev watch | System | Build/dev time |
| **External Plugins** | `.vivim-plugin` tar.gz archives produced by tooling, verified at `host.ts:discover()/certify()` | `trusted:false` → `PluginContext` only | Lazy / on-install |

---

## 5. Iterative Delivery Model

We will iterate, each pass deepening the truth-grounding and the task precision:

| Iteration | Focus | Exit artifact |
|-----------|-------|---------------|
| **I-1 Formalization (this)** | Establish charter, canonical plan, map, tracker, ADRs, and visual. No product code. | `CHARTER.md` + `PLAN.md` + `MAP.md` + `visual/index.html` + `STATUS.md` + `adr/D1-D7` + updated `00-README.md` — all green, human-approved |
| **I-2 Deep Probe** | Code-probe the three v1 axes to produce method-level task cards: exact `ProviderStore` contract methods, `UiComponentStore` write sites for `scriptUrl`, `SchemaRegistry` call-site inventory, `ProviderRegistrar.registerOne` signature, generator cache shape. Produce `evidence/` probes (small `bun run` scripts, not guesses). | `evidence/probe-*.md` + `PLAN.md` refined with per-file line anchors + `STATUS.md` with probe-verified task cards |
| **I-3 Phase 0+1 Scaffold** | Ship `events.ts` bridge + kernel scaffold + boundary arch test + manifest schema + `PluginContext` (no behavior change). | PRs `0.x` + `1.x` merged, `tests/arch/` green, `STATUS.md` updated |
| **I-4 Phase 1.5+2+3+4** | Trust/install unification, then three axes in parallel (UI, services, schema) each with integration proof. | PRs `1.5.x`–`4.x` merged, Discord/Notion proof green, security review for 1.5+2 passed |
| **I-5 Hardening** | v2 specs for harness/features/compiled UI, engine domain map, migration playbook | `MAP.md` v2, `evidence/engines-domain-map.md`, v2 plan |

Each iteration ends with a **human review of the folder** — `STATUS.md` is the agenda.

---

## 6. Risk Posture

| Risk | Mitigation | Where enforced |
|------|------------|----------------|
| Second install path reappears | `grep -rn "__pluginManager\|new PluginManagerImpl\|extractTarGz" src` → 0 after 1.5; arch test | `tests/arch/kernel-boundary.test.ts` + CI |
| Silent capability shadowing | DAC (`${pluginId}.` prefix) in v2; v1 documents gap + regression test | `PLAN.md` §6 audit + `tests/unit/engines/harness-command-registry-collision.test.ts` |
| Schema pollution of core types | Prefix enforced inside `SchemaRegistry`, not by plugin | `src/schema/node.ts:210` change + unit test |
| XSS via `scriptUrl` | Origin check at certify + at write; `SandboxedNode` opaque origin | `host.ts:certify()` + `ui-registry.ts:register()` + audit 2.1 |
| Boot regression from eager→lazy | v1 stays eager; lazy is v2 behind the same `capabilities` phase only | `PLAN.md` D6 + `03-CAPABILITIES-PHASE-AUDIT.md` |
| Half a trust boundary | `browser-provider` + harness share one `chrome:control` gate; v1 rejects `browser-provider` until gate exists | `permissions.ts` + manifest strict validation |
| Doc/code drift | Doc and code in same PR or the PR does not merge | Charter §2 + review checklist |

---

## 7. Success Criteria (v1)

- [ ] `grep -rn "__pluginManager" src` → 0; `PluginHost` threaded via `BootstrapContext`
- [ ] `NodeType` widened; `plugin:${id}.` prefix enforced; Tier A integration test green
- [ ] `ProviderRegistrar.registerOne` shipped; Discord or Notion runs exclusively via plugin path; no restart required
- [ ] `UiComponent` generated expansion green; `ui:custom-scripturl` origin gate green; `sample-plugin`/`demo-plugin` install via `PluginHost`
- [ ] `tests/arch/kernel-boundary.test.ts` + `tests/arch/single-event-bus.test.ts` + `tests/arch/layer-dependency.test.ts` (with `src/plugin-kernel` layer) all green
- [ ] `STATUS.md` every row `done`, `adr/` D1–D7 ratified, visual reviewed

---

*This charter is the contract under which the plan executes. Changing scope requires amending this file in the same PR as the scope change.*
