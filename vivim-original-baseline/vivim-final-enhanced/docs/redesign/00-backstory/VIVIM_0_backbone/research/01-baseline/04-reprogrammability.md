# Step 1.4: Reprogrammability Module — The "User-Configurable Programs" Substrate

**Date:** 2026-08-28
**Read:** 
- `work/forge/src/reprogrammability/contract.ts` (181 lines)
- `work/forge/src/reprogrammability/registry.ts` (234 lines)
- `work/forge/src/reprogrammability/mutation-schema.ts` (185 lines)
- `work/forge/src/reprogrammability/schema/spec.ts` (201 lines)
- `work/forge/src/reprogrammability/index.ts` (82 lines)
- `work/forge/src/reprogrammability/canonical-surfaces.ts` (373 lines, partial)
- **Status:** READ + ANALYZED

**Migration note:** The `reprogrammability/` directory exists in the **forge** (the source-of-truth) but is NOT in `VIVIM-next/` — the migration to vivim-next was incomplete for this card. The plugin-system in vivim-next still imports `../reprogrammability/contract.js` etc., but the files don't exist in the new tree. This research is therefore reading from the forge; any design output must migrate or recreate the module in vivim-next.

---

## What the code does

The `reprogrammability/` module is the system's **substrate for user-configurable programs**. It treats every visible element in the app as a "reprogrammable surface" with a typed spec, and every change as a typed "mutation" against a discriminated union of 8 ops. The contract is locked to `CONTRACT_VERSION = 1`.

**Key abstractions:**

1. **`SurfaceKind`** (contract.ts:42) — `'card' | 'panel' | 'layer' | 'primitive' | 'chrome' | 'slot' | 'custom'`. Every visible thing in the app is one of these. `custom` is an explicit escape hatch; the codebase flags `custom` surfaces for promotion to first-class kinds via an audit.

2. **`MutationProvenance`** (contract.ts:57) — `'manual' | 'nlcl' | 'prefix' | 'plugin' | 'llm-harness' | 'system'`. Every mutation carries a tag identifying who produced it. Order from most-trusted (manual) to least-trusted (system). Used by trust scoring.

3. **`MutationOp`** (contract.ts:73-81) — exactly 8 ops, no escape hatch. `replace`, `insert`, `remove`, `reorder`, `restyle`, `rebind`, `set_property`, `set_slot`. The contract is closed; new ops require a "contract amendment" (Phase 10).

4. **`ReprogrammableSurface`** (contract.ts:95-140) — the contract every visible element implements. Has: `id`, `kind`, `label`, optional `slot`, optional `capabilities`, optional `tags`, `getSpec()`, `mutate(mutation)`, `supportedOps` (declared or `*`), optional `specSchema` (Zod). Mutations must be atomic — on failure, roll back.

5. **`SurfaceSpec`** (schema/spec.ts) — discriminated union of 7 spec kinds, each with a Zod schema. The `kind` field is the discriminator. Each spec is the *shape* of a surface's data, not its behavior.

6. **`SurfaceMutation`** (mutation-schema.ts) — a Zod `discriminatedUnion('op', [...])` with 8 variants. Every mutation has `target`, `provenance`, optional `idempotencyKey` (24h window), optional `reason` (max 280 chars), optional `planId`. Specific ops add their own `payload` shape.

7. **`SurfaceMutationPlan`** (mutation-schema.ts:156-170) — an ordered sequence of mutations applied transactionally. Optional `rollback[]` array. Optional `description` and `parentPlanId`. Used by Composer (single mutations from NLCL), LLM Harness (multi-mutation plans from an LLM), Visual Builder (multi from graph edits), and Plugins (Phase 9).

8. **`SurfaceRegistry`** (registry.ts) — singleton (`surfaceRegistry`) that aggregates surfaces from three origins:
   - **Frontend class registrations** (UniversalComponentRegistry)
   - **Backend descriptor registrations** (Prisma, Phase 8)
   - **Plugin-provided factories** (Phase 9)
   
   API: `register(surface)` (idempotent, hot-swap), `unregister(id)`, `get(id)` (throws `SurfaceNotFoundError`), `getOrNull(id)`, `has(id)`, `list()`, `listByKind(kind)`, `listBySlot(slot)`, `listByCapability(capabilityId)`. Also: `saveVariant` / `listVariants` / `getActiveVariant` / `setActiveVariant` / `deleteVariant` (variants are an A/B testing / theme mechanism on top of the spec). `subscribe(listener)` for live updates.

9. **`InMemorySurface`** (canonical-surfaces.ts:29) — a permissive default implementation of `ReprogrammableSurface` that supports all 8 ops and clones on read/write. Doesn't enforce per-kind schema validation (Phase 10 will). This is what most user-created surfaces would use.

10. **Custom errors**: `UnsupportedMutationError` (surface doesn't support the op), `InvalidMutationPayloadError` (Zod issues attached), `SurfaceNotFoundError`, `DuplicateSurfaceError` (line 38 — currently unused in the registry; the registry is idempotent and re-registers silently, but the error class exists).

---

## Key observations

- **The contract is closed by design.** 8 ops, no escape hatch. 7 spec kinds, with `custom` as a flagged escape hatch. This is a *deliberate* design constraint: novel operations or kinds require a contract amendment, not a workaround. This is a strong, opinionated foundation.

- **Provenance is a first-class field.** Every mutation has a `provenance` tag. The system has a trust ordering. Plugins are mid-trust (between NLCL and llm-harness). System mutations are the *lowest* trust despite being the most privileged — the comment at line 53-55 says "system. Highest privilege, lowest trust — always logs + may notify user." This is a security insight: privilege and trust are decoupled.

- **Idempotency is built in.** `idempotencyKey` is a 24h no-op window. Required for `llm-harness` and `system` provenance. LLM-driven mutations can be retried safely; system mutations can be replayed. Plugin mutations do not require idempotency keys — likely because plugins are presumed to know what they are doing.

- **Atomicity is required, not optional.** The contract (lines 117-118) says implementations MUST apply atomically, rolling back on failure. Plus a constraint: mutations must NOT have side effects beyond the spec change (no DOM, no network). Side effects are the executor's job (Phase 3). This separates *what changed* from *what happened* — a clean actor-model division.

- **The registry is the convergence point.** It is a singleton. It accepts surfaces from three different origins (frontend, backend, plugins). It uses a pub/sub for live updates (used by the frontend `useSyncExternalStore`). Variants are a parallel concept — different active specs for the same surface — likely for the Reprogram Modal's "preview my changes" UX.

- **Variants are a quasi-feature-flag system.** Per-surface, the registry supports multiple `SurfaceVariant` records, one of which is `isActive`. Variants can be `isLocked` (not deletable). This is essentially A/B testing for surfaces; probably the "you can fork this surface, try a change, and roll back if you don't like it" model. Phase 4-7 of the roadmap uses this.

- **The trust score system exists separately.** `kernel/security/trust-score.ts` (referenced from `Select-String` earlier) implements the actual scoring. The provenance tag is a category; the score is computed.

- **UniversalComponentRegistry is mentioned but not in this module.** Line 87-88 of contract.ts: "Implementations may be: Frontend classes registered in `UniversalComponentRegistry` (the existing hot-swap registry)." This is in the frontend, not in `reprogrammability/`. The contract is cross-module.

- **The DSL exists.** Lines 76-80 in the file listing: `dsl/grammar.ts` (955 lines), `dsl/parser.ts` (11,338 lines — large!), `dsl/executor.ts` (10,905 lines). This is a domain-specific language for surface mutations. It compiles to a `SurfaceMutationPlan`. This is the "user-configurable programs" UX — users write something in a DSL, it parses to a plan, the plan executes.

- **The 4 user-facing producers are codified:** Composer (Phase 4, NLCL), Reprogram Modal (Phase 5, manual JSON edits), Visual Builder (Phase 6, graph edits), LLM Harness (Phase 7, AI-generated plans). Plus Plugins (Phase 9). Each produces `SurfaceMutationPlan`s the same way.

- **Phase 10 is the audit/enforcement layer.** It codifies the invariants (1: every visible element is a surface, 2: every mutation is one of 8, 3: every mutation is logged, 4: every mutation is reversible) and a check script that fails CI on violations.

- **Provenance `plugin` is a first-class category.** Line 56 in mutation-schema.ts lists it in `PROVENANCE_TAGS`. So plugins producing mutations are an expected, designed-for thing — not a hack.

- **Engines in `reprogrammability/` are different.** The forge also has `src/engines/reprogrammability/`: `llm-harness-agent.ts`, `llm-prompt.ts`, `plugin-builder.ts`, `version-store.ts`. These are the LLM-side and plugin-builder-side of the system, not the contract. Step 1.6 will look at plugin-builder.

- **`InMemorySurface` is the de facto default.** Most user extensions would create `InMemorySurface` instances, not custom classes. The 8 ops are all supported. Validation is minimal (no per-kind schema enforcement yet). This is a deliberate "easy to start, hard to break" model.

- **Zod is pervasive.** Every spec kind, every mutation op, every plan, every variant has a Zod schema. Runtime validation is everywhere. This is a *runtime-checked* system, not a type-only system.

---

## Key questions raised

1. **Is the `SurfaceRegistry` actually populated today?** The contract says three origins feed it. Which ones are actually used in production? If only `InMemorySurface` instances are registered, the whole backend-descriptor (Phase 8) and plugin (Phase 9) origin is aspirational. Need to count registered surfaces.

2. **How is the DSL exposed to users?** Is it a text file the user edits? A textbox in a UI? A guided builder? The DSL is the language; what is the *user surface* of that language?

3. **What does "user-configurable program" actually look like in practice?** A user extension is presumably a JSON spec + optional handler. But the system has a full DSL with a parser. Is the DSL for *users* or for *us*? Can a user write a `.dsl` file and load it?

4. **Is `InMemorySurface` the right unit for a user extension?** Or should a user extension contribute a *kind* (a new spec shape) plus ops? Adding a kind requires a contract amendment (Phase 10), so this is heavyweight. Is there a middle ground?

5. **What's the relationship between `SurfaceRegistry` and `PluginManager`?** Both are singleton registries. The `PluginManager.register()` in plugin-system.ts lazy-imports `surfaceRegistry` to register plugin surfaces. Are these two registries one day meant to merge? Or are they parallel and forever?

6. **Who owns the spec → render pipeline?** A `ReprogrammableSurface` has a `getSpec()`. Something turns that spec into a rendered UI. The contract doesn't say what. Where is the renderer?

7. **Where is the executor?** Mutations are plans. Plans are applied. Where is the code that walks a `SurfaceMutationPlan`, calls `surface.mutate()` on each, handles rollback? (`dsl/executor.ts` is the closest candidate; need to read it.)

8. **What is `version-store.ts` in the engines folder?** Probably persists surface versions for undo/redo. The contract says mutations are reversible; the store is the mechanism.

9. **Is `trust-score.ts` consulted on every mutation, or only on some?** The provenance field is required, but is the trust score actually computed at the mutation point, or only at the rendering point (e.g. UI shows a warning for low-trust mutations)?

10. **What is the activation model for a plugin-supplied surface?** A plugin registers surfaces via `plugin.surfaces: ReprogrammableSurface[]` in `plugin-system.ts` (Phase 9). When are they activated? At plugin register? At first use? On user opt-in? (Step 1.2 will help — hot-reload loads plugin files, plugin-system registers them.)

---

## Cross-references

- **Step 1.1 (plugin-system.ts)** — `ProviderPlugin` has optional `surfaces: ReprogrammableSurface[]` and `mutationHandlers`. This module is what those types point to.
- **Step 1.2 (plugin-hot-reload.ts)** — the loader that *produces* plugin modules. Those modules declare `ProviderPlugin`s with surfaces.
- **Step 1.3 (router-capability-bridge.ts)** — orthogonal; doesn't touch surfaces.
- **Step 1.5 (surface system)** — what consumes a `SurfaceSpec`? The canvas frontend has a `live-config.ts` etc. That is the renderer.
- **Phase 4-7 of ROADMAP-REPROGRAMMABLE-CANVAS.md** — the four user-facing producers (Composer, Modal, Builder, Harness). Not in the repo (or not findable); referenced in comments.
- **`kernel/security/trust-score.ts`** — implements the trust scoring that uses `MutationProvenance`.
- **`reprogrammability/dsl/`** — grammar.ts, parser.ts, executor.ts. The DSL is the user-facing language.
- **`reprogrammability/canonical-surfaces.ts`** — `InMemorySurface` and presumably `BackendSurface`, `FrontendSurface`. The three reference implementations.
- **`engines/reprogrammability/`** — `llm-harness-agent.ts`, `plugin-builder.ts`, `version-store.ts`. The supporting engines.
