# Plugin Kernel — Status Tracker

> **Single source of truth for execution.** Every phase row moves via the PR that implements it — no out-of-band tracker.  
> **Human review cadence:** end of each iteration (see `CHARTER.md` §5). This file is the agenda.  
> **Date:** 2026-08-28 · **Iteration:** I-1 Formalization · **Plan:** `PLAN.md` v3 · **Charter:** `CHARTER.md`

---

## Iteration Tracker

| Iteration | Focus | Status | Exit artifact |
|-----------|-------|--------|---------------|
| **I-1 Formalization** | Charter + canonical plan + map + visual + tracker + ADRs | **in_progress** (this file) | `CHARTER.md`, `PLAN.md`, `MAP.md`, `visual/index.html`, `STATUS.md`, `adr/D1-D7`, updated `00-README.md` — human-approved |
| **I-2 Deep Probe** | Code-probe v1 axes to method-level task cards (`evidence/` probes, not guesses) | **upgraded 2026-08-29 per ADR 008** — deterministic probes remain evidence, **per-PR execution is LLM-driven** (read source → classify imports K0 vs K1 → decide MOVE/SPLIT/KEEP on real content → 3-gate prove) | `evidence/probe-*.md` + `adr/008-llm-driven-migration.md` + refined `PLAN.md` |
| **I-3 Scaffold** | Phase 0 bridge + Phase 1 kernel scaffold (no behavior) | pending | PRs `0.x`+`1.x` merged, `tests/arch/*` green |
| **I-4 Trust + Axes** | Phase 1.5 host unification + Phases 2/3/4 (UI/services/schema) + proofs | pending | PRs `1.5.x`–`4.x` merged, Discord/Notion proof green, security review for 1.5+2 passed |
| **I-5 Hardening** | v2 specs (harness/features/compiled), engine domain map, migration playbook | pending | `MAP.md` v2, `evidence/engines-domain-map.md`, v2 plan |

---

## Phase Tracker (I-1 → I-4)

| Phase | Task | Owner | Status | PR | Gate | Notes |
|-------|------|-------|--------|----|------|-------|
| **0.1** | Diff V1 vs V2 event bus (every event type + importer) | agent | pending | — | Research doc `evidence/event-bus-diff.md` with 100% `grep -rn "capability-event-bus"` coverage | I-2 probe will produce the diff; I-3 ships the bridge |
| **0.2** | Ship `src/plugin-kernel/events.ts` bridge (V1→V2) | agent | pending | — | Test: `V1.emit` appears in `V2.snapshot()` with correlationId; DLQ still isolates | I-3 |
| **0.3** | Arch test: single bus (at most two modules, kernel never imports V1) | agent | pending | — | `tests/arch/single-event-bus.test.ts` green | I-3 |
| **1.1** | `src/plugin-kernel/` barrel | agent | pending | — | Builds clean | I-3 |
| **1.2** | `PluginPermission` + `ActivationEvent` unions | agent | pending | — | Types exhaustive | I-3 |
| **1.3** | `PluginManifest` Zod (strict, `harness` → actionable error) | agent | pending | — | Unit test: minimal validates, missing `id` rejected, `harness` rejected with ADR pointer | I-3 |
| **1.4** | `PluginContext` (`ctx.events` only) | agent | pending | — | Stub `activate(ctx)` compiles with `ctx.events.on(...)` | I-3, needs 0.2 |
| **1.5** | Kernel boundary arch test (now, while dir empty) | agent | pending | — | `tests/arch/kernel-boundary.test.ts` fails on `src/plugin-kernel/ → src/engines/*` | I-3, cheapest time to add |
| **1.6** | Locate `CONVERGENCE-PLAN` (`.genome/DECISIONS.md` + `tests/unit/ai/convergence-c1-c4.test.ts`) | agent | pending | — | `evidence/convergence-crossref.md` (found or documented absent) | I-2/I-3 |
| **1.5.1** | Document `TrustedPluginManager` vs `plugin-router.ts` method-by-method | agent | pending | — | `evidence/plugin-host-unification.md` — real/stub/overlaps per method | I-2 probe → I-4 |
| **1.5.2** | `PluginHost.discover()` — move `extractTarGz`+`computeFileHash` from `plugin-router.ts:47` | agent | pending | — | Test: valid archive → `valid:true`, tampered → `valid:false` | I-4 |
| **1.5.3** | `PluginHost.certify()` — Zod + hash re-verify + permission↔contributes + `scriptUrl` origin | agent | pending | — | Test: `scriptUrl` without `ui:custom-scripturl` → certify fails | I-4 |
| **1.5.4** | `PluginHost.install()` → per-axis registries (stubs ok) | agent | pending | — | Test: `contributes.services` calls service-registry stub once with correct `pluginId` | I-4 |
| **1.5.5** | Replace `globalThis.__pluginManager` with `BootstrapContext` threading | agent | pending | — | `grep -rn "__pluginManager" src` → 0; boot green; no `require()` hack | I-4 · **security review** |
| **2.1** | Confirm `scriptUrl` write sites trusted-origin only | agent | pending | — | Every `grep -rn "scriptUrl"` writer listed; any gap ticketed | I-4 (before 2.2) |
| **2.2** | `UiContribution.generated[] → UiComponent` expansion | agent | pending | — | Unit test: one entry → correct row (`shared/ui-component.ts:99`) | I-4 · `src/plugin-kernel/registries/ui-registry.ts` |
| **2.3** | Enforce `ui:custom-scripturl` at registry write | agent | pending | — | Test: `scriptUrl` without permission → rejection | I-4 · **security review** |
| **2.4** | Wire `PluginHost.install()` → `ui-registry.ts` | agent | pending | — | `sample-plugin`/`demo-plugin` install via new path | I-4 |
| **2.5** | Defer `compiled[]` → review-gate reject | agent | pending | — | Test: `ui.compiled` → certify fails with review-gate error | I-4 |
| **3.1** | `ExternalServiceContribution` type | agent | pending | — | Compiles against both manifest shapes | I-4 |
| **3.2** | `ProviderRegistrar.registerOne` alongside `seedAll()` | agent | pending | — | Regression: `seedAll()` unchanged; new unit test with `pluginId` FK | I-4 · `src/engines/provider-registrar.ts` |
| **3.3** | Generator → in-memory cache + disk snapshot | agent | pending | — | `registerOne` provider queryable without restart | I-4 · `src/engines/provider-protocol-generator.ts` |
| **3.4** | Wire `service-registry.ts` gated on `network` | agent | pending | — | Synthetic `api-protocol` round-trips | I-4 |
| **3.5** | Prove: one real provider (Discord/Notion) exclusively via plugin path | agent | pending | — | Integration tests pass with in-tree seed removed | I-4 · `plugins/core/provider-discord/` |
| **4.1** | Widen `NodeType` (`BuiltinNodeType \| (string & {})`) | agent | pending | — | 19 built-ins still type-check; non-builtin without `as any` passes | I-4 · `src/schema/node.ts:56` |
| **4.2** | Enforce `plugin:${id}.` inside `SchemaRegistry.register()` | agent | pending | — | Two plugins same local name do not collide; `cap-store.*` rejected | I-4 · `src/schema/node.ts:210` |
| **4.3** | `SchemaContribution` + `schema-registry.ts` wrapper | agent | pending | — | End-to-end via wrapper | I-4 |
| **4.4** | Prove: synthetic plugin writes/reads/validates Node row via `PluginHost.install()` | agent | pending | — | `tests/integration/plugin-kernel/schema-axis.test.ts` green | I-4 |
| **4.5** | Document Tier B deferral | agent | pending | — | `adr/005-schema-prefix.md` addendum states `plugin_ext` isolation | I-4 |
| **5.audit** | Classify every construction in `capabilities.ts:26` (738 lines) | agent | docs only v1 | — | `evidence/capabilities-phase-audit.md` — core vs candidate per line | I-5 |
| **6.audit** | Pin silent-overwrite + harness gate design | agent | docs+test v1 | — | `tests/unit/engines/harness-command-registry-collision.test.ts` demonstrates bug; gate spec | I-5 |
| **7.map** | Domain-group `src/engines/*.ts` (186 files) | agent | docs only v1 | — | `evidence/engines-domain-map.md` — every file in exactly one bucket, `src/engines/kernel/*` flagged do-not-migrate | I-5 |

**Execution order:** `0.1→0.2→0.3` → `1.1→1.2→1.3→1.4→1.5→1.6` → `1.5.1→1.5.2→1.5.3→1.5.4→1.5.5` (fan-out) → `2.x`/`3.x`/`4.x` parallel after `1.5.4` → `5.audit`/`6.audit`/`7.map` (I-5, docs only).

---

## Gates (CI, not judgment)

| Gate | Command | When | Blocks merge |
|------|---------|------|--------------|
| Kernel boundary | `bun test tests/arch/kernel-boundary.test.ts` | Every PR touching `src/plugin-kernel/` | Yes |
| Layer deps | `bun test tests/arch/layer-dependency.test.ts` (with `src/plugin-kernel` layer) | Every PR | Yes after Phase 0 |
| Single bus | `bun test tests/arch/single-event-bus.test.ts` | Phase 0 onward | Yes |
| No ambient manager | `grep -rn "__pluginManager" src` → 0 after 1.5.5 | Phase 1.5 onward | Yes |
| Docs-as-byproduct | Behavioral change without `docs/kernel-plugins/` touch → review fail | Every PR | Yes |

---

## ADRs

| ADR | Decision | Status | File |
|-----|----------|--------|------|
| D1 | Kernel at `src/plugin-kernel/` | **ratified** (I-1) | `adr/001-kernel-location.md` |
| D2 | v1 = 3 axes only (schema Tier-A, UI generated, services api/mcp) | **ratified** (I-1) | `adr/002-v1-scope.md` |
| D3 | V2 canonical, V1 stays behind bridge | **ratified** (I-1) | `adr/003-event-bus.md` |
| D4 | `PluginHost` unifies `TrustedPluginManager` + `plugin-router.ts` | **ratified** (I-1) | `adr/004-plugin-host.md` |
| D5 | `NodeType` widen + `plugin:${id}.` prefix inside `SchemaRegistry` | **ratified** (I-1) | `adr/005-schema-prefix.md` |
| D6 | `ModuleRegistry` stays eager in v1 | **ratified** (I-1) | `adr/006-lazy-activation.md` |
| D7 | Generator → cache + `ProviderRegistrar.registerOne` | **ratified** (I-1) | `adr/007-protocol-cache.md` |

Rule: a D-level decision with no ADR file is not a decision — it is a hypothesis.

---

## Evidence

| Item | File | Status |
|------|------|--------|
| V1 vs V2 event bus diff | `evidence/event-bus-diff.md` | pending (I-2) |
| Convergence plan cross-ref | `evidence/convergence-crossref.md` | pending (I-2) |
| Plugin host unification | `evidence/plugin-host-unification.md` | pending (I-2) |
| `scriptUrl` write-site audit | addendum to `evidence/plugin-host-unification.md` §UI | pending (I-4, before 2.2) |
| Capabilities phase audit | `evidence/capabilities-phase-audit.md` | pending (I-5, docs only) |
| Harness collision pin | `tests/unit/engines/harness-command-registry-collision.test.ts` | pending (I-5) |
| Engine domain map | `evidence/engines-domain-map.md` | pending (I-5) |

---

## Risks & Mitigations (live)

| Risk | Status | Mitigation |
|------|--------|------------|
| Second install path reappears | mitigated by design | Arch test + `grep` gate after 1.5 |
| Silent capability shadowing | known gap, v2 fix | DAC spec in I-5, regression test pins today's bug |
| Schema pollution | mitigated by design | Prefix inside registry, not by plugin |
| XSS via `scriptUrl` | mitigated by design | Double gate (certify + write) + `SandboxedNode` opaque origin |
| Boot regression from lazy | deferred | v1 stays eager (D6) |
| Half a trust boundary | deferred | `browser-provider` rejected until shared `chrome:control` gate exists (D2) |

---

## How to Update This File

- A phase row moves `pending → in_progress → done` only in the PR that implements that phase.
- `blocked` requires a one-line reason + link to the blocking PR/issue.
- At end of each iteration, this file is the review agenda — read it top to bottom.

