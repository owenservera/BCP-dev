# Audit Findings — Verified Against the Codebase

Every claim below was checked against actual file contents (paths and line
context included) as of this clone, not inferred from filenames or comments
alone. Organized as: corrections to the earlier drafts, then new findings
those drafts missed entirely.

---

## A. Corrections to the earlier drafts

### A1. The frontend sandbox already exists and is well-built — earlier drafts flagged this as an open risk it isn't

**Earlier claim:** "need to verify... whether plugin-authored JS is actually
sandboxed... this is the single highest-value thing to audit before
shipping third-party UI plugins."

**Actual state:** `frontend/src/components/canvas/SandboxedNode.tsx` renders
untrusted `html`/`css`/`scriptUrl` inside an `<iframe sandbox="allow-scripts">`
— deliberately **without** `allow-same-origin`, which gives the frame an
opaque origin with no access to parent DOM, cookies, or storage. Inline
`<script>` tags are stripped from `html` at render time (`allowInlineScript`
is additionally forced `false` at the type level — the component throws if
this invariant is ever violated). Communication happens over a
`MessageChannel` bridge with a host-side capability allow-list
(`sandbox.allowCapabilities`), a CSP delivered via a `<meta>` tag, and a
watchdog that kills unresponsive frames after `sandbox.budgetMs`. The
comments cite internal spec IDs (`P8`, `S92`, `S93`) confirming this was a
deliberate, reviewed security design, not incidental.

**Correction to the design:** Phase 2 of the task list should be
*"verify and extend"*, not *"audit and possibly build."* The one real
follow-up: confirm that wherever `scriptUrl` values originate (plugin
manifests, once that path exists) is restricted to trusted asset storage —
the iframe sandbox protects the host from the frame, but nothing in
`SandboxedNode.tsx` itself restricts *which* URLs `scriptUrl` may point to;
that has to be enforced at the point where the URL is written, which is
upstream of this component.

### A2. `UiComponent`'s fields are `html`/`css`/`scriptUrl`, not "HTML/CSS/JS" — no raw inline-JS field exists

**Earlier claim:** described `UiComponent` as storing "hot-swappable
HTML/CSS/JS."

**Actual state** (`shared/ui-component.ts`): the row has `html: string`,
`css: string`, and `scriptUrl: string | null` — a *reference* to an
external script, not an inline code field — plus `sandboxJson`,
`constraintsJson`, `contractJson`. This is a materially safer shape than
"inline JS blob," and it's exactly what `SandboxedNode.tsx` (A1) expects.

### A3. The UI resolution chain has 6 tiers, not 5, and lives in a third, newer registry the earlier drafts never found

**Earlier claim:** described reconciling `UiComponent`'s "5-tier scope" with
`UiSlotClaim`'s "3-tier scope" into one model.

**Actual state:** `frontend/src/shared/conceptual-model.ts` defines
`RESOLUTION_CHAIN` as **six** tiers, most-specific to least:
`provider+variant, provider, family+variant, family, cross-type, system`.
More importantly, there is a **third** registry —
`frontend/src/shared/universal-registry.ts` (`UniversalComponentRegistry`)
— whose own header comment states it *"supersedes the Phase 1
UIComponentRegistry (slot-only) and the Phase 2 register-slot SDK. Both are
now thin wrappers around this."* That means `UiComponent`/`UiSlotClaim`
(the DB-driven dynamic layer) and `UniversalComponentRegistry` (a
compiled-React-component live registry with `useSyncExternalStore` hot-swap)
are two different, both-current layers serving different needs — dynamic
generated UI vs. statically compiled UI — not two generations of the same
thing to merge.

**Correction to the design:** the UI axis needs to target
`UniversalComponentRegistry` as the live consumer-facing registry for
plugin-contributed *compiled* components, and `UiComponent`/`resolve()` for
plugin-contributed *dynamic/generated* ones — both are real, both stay.

### A4. `bootstrap-engines.ts` is already a thin facade over a 5-phase pipeline — it is not the monolith the migration plan assumed

**Earlier claim:** treated `bootstrap-engines.ts` as a large, hand-wired
function to be decomposed into `ModuleRegistry` modules.

**Actual state:** `src/server/bootstrap-engines.ts` is 12 lines — a
re-export facade. The real logic lives in `src/server/bootstrap/`:
`orchestrator.ts` runs five named, individually-testable phases in a fixed
order (`seeds → stores → knowledge → capabilities → lifecycle`), threading
a mutable `BootstrapContext`. This decomposition (from a prior
"single-mega-function," per the orchestrator's own comment) already did
most of the hard ordering work the migration plan assumed still needed
doing.

**Correction to the design:** the core-features task list changes from
"decompose the monolith" to "wrap each of the 5 existing phase modules with
`activationEvents`, and change what `capabilities.ts` (738 lines — by far
the largest phase, and the one that already does ad hoc plugin
activation — see B1 below) does today into the kernel path."

### A5. `NodeSchemaRegistry` doesn't exist under that name — the real class is `SchemaRegistry`, and it's already runtime-mutable

**Earlier claim:** referred to `NodeSchemaRegistry` as the schema
extensibility mechanism, flagged as "referenced but not directly inspected."

**Actual state** (`src/schema/node.ts`): the class is `SchemaRegistry`
(the file's header *comment* says "NodeSchemaRegistry," but the exported
symbol is `SchemaRegistry` — a doc/code drift worth fixing while touching
this file anyway). It's a plain `Map<NodeType, NodeSchema>` with
`register/get/has/all/validate/indexContent/embeddingText` — genuinely
callable at runtime, not just at boot, despite the comment saying "register
every node schema at boot." A singleton `schemaRegistry` is populated by
`registerAllSchemas()` in `schemas.ts`, which registers ~19 built-in types,
notably **all using `as any` casts** at the call site because Zod's
discriminated-union inference is too broad here — an existing, accepted
pattern, which lowers the bar for a plugin registering a new type through
the same path.

**Real gap confirmed:** `NodeType` (line 56 in `node.ts`) is a **hardcoded
string-literal union**, not `string`. `SchemaRegistry.register()` accepts
any `NodeType` at the type level, so a plugin registering a genuinely new
type string needs either a cast (matching the existing `as any` precedent)
or `NodeType` needs to widen to accept an open string with the fixed union
as a documented subset (e.g. `NodeType | (string & {})`). This is a small,
concrete fix — call it out explicitly in the schema-axis task rather than
leaving it implicit.

---

## B. New findings the earlier drafts missed entirely

### B1. There is already a plugin trust/install layer — and it's a stub on every real code path

`src/ai/plugins/plugin-manager-impl.ts` defines `TrustedPluginManager`,
wrapping `PluginManagerImpl` (from `src/engines/plugin-system.ts`, the file
the earlier drafts already knew about). Its own header comments cite a
prior internal audit directly:

> *"Per [AUDIT R-6]: PluginManagerImpl is latent (rg "new PluginManagerImpl"
> src = 0)... C4 step 0: activate PluginManagerImpl at boot as the ONE
> installer/loader. Then wrap it with this trust layer."*

It's activated at boot — `src/server/bootstrap/phases/capabilities.ts`
calls `activatePluginManager(eventBus)` and stores the result on
`globalThis.__pluginManager` — but inspect the methods themselves:

- `discover()` always returns `{ valid: false, reason: "not yet implemented
  (C4 phase 1)" }`.
- `install()` always throws `"Install not yet implemented (C4 phase 1)"`.
- `certify()` does real work, but shallow: checks manifest has an `id` and
  `name`, warns (doesn't fail) if there's no integrity hash, warns if no
  capabilities are declared. No signature verification, no sandbox
  re-validation.

**Implication for the design:** this is exactly the kernel's `PluginHost`
install/activate boundary — already scaffolded, already named, already
wired into boot — but functionally empty. The task list should complete
*this* class rather than invent a parallel one. It also means the earlier
drafts' assumption that `plugin-router.ts`'s tar.gz install flow was "the"
install path was incomplete: there are (at least) **two** separate
"install a plugin" entry points in the codebase today —
`plugin-router.ts` (HTTP, tar.gz, UI-component-focused) and
`TrustedPluginManager.install()` (AI-gateway-focused, stubbed) — and they
don't call each other. Unifying these two is now a first-class kernel task,
not a footnote.

Two more code smells worth fixing while this class is being completed:
`activatePluginManager()` uses `globalThis.__pluginManager` as an ambient
singleton (exactly the pattern the kernel's `PluginContext` is meant to
replace) and reaches `PluginManagerImpl` via a CommonJS `require()` inside
an otherwise-ESM file "to avoid circular deps" — a sign the current module
graph has a real circularity between `ai/plugins` and `engines` that the
kernel's dependency-direction rule (v1/v2 §9 and Phase 1.5 arch test) needs
to resolve properly rather than route around with `require()`.

### B2. The project already has its own audit trail flagging this exact fragmentation — cross-reference it, don't duplicate it

Searching `src/` for `[AUDIT R-` turns up a numbered internal finding
series (at least R-1 through R-12) embedded in code comments across
`src/ai/policy/store-backed-policy.ts`, `src/ai/protocol/legacy-adapter-wrappers.ts`,
`src/ai/tools/tool-orchestrator-impl.ts`, `src/ai/plugins/plugin-manager-impl.ts`,
and `src/engines/tool-orchestrator-facade.ts` (which also cites a
`CONVERGENCE-PLAN §4 C3`). Most directly relevant:

> **[AUDIT R-7]**, quoted in full because it's the single most relevant
> sentence found in this whole audit: *"three modules named 'registry'
> exist with different roles — (1) `config/provider-registry.ts` = live
> protocol config cache; (2) `engines/providers/registry.ts` +
> `providers/plugin-registry.ts` = dormant provider-plugin scaffolding;
> (3) DB `ProviderDefinition` / `ProviderModel` = CDP-provider
> definitions. C4/C5 must cite the exact module per namespace."*

That finding is about providers specifically; B3 below shows the actual
scope is far larger. The `CONVERGENCE-PLAN` and `C1`–`C5` phase references
are not visible as a standalone doc in the current working tree (only as
inline code comments and one test file, `tests/unit/ai/convergence-c1-c4.test.ts`)
— it may live outside this repo (the `.genome/DECISIONS.md` file references
an external `control-plane\CANON.md` path) or in prior history. Either way:
**this package's Phase-0/Phase-1 work should locate and read that plan
before writing new kernel code**, since "C4" (plugin convergence) and what
this package calls the kernel's `PluginHost` are very likely the same
initiative under two names.

### B3. The registry-naming collision is much larger than R-7 already flagged — 30 files, not 3

A repo-wide search for `*registry*.ts` (excluding tests) returns 30 files.
Non-exhaustive sample beyond what R-7 already named: `src/ai/registry/registry.ts`
+ `in-memory-model-registry.ts` + `in-memory-provider-registry.ts`,
`src/reprogrammability/registry.ts`, `src/canvas/canvas-registry.ts`,
`src/server/module-registry.ts`, `src/engines/unified-registry.ts`,
`src/engines/capability-shape-registry.ts`, `src/engines/live-capability-registry.ts`,
`src/engines/harness-command-registry.ts`, `src/engines/kernel/kernel-registry.ts`,
`src/cli/command-registry.ts`, plus frontend-side
`frontend/src/shared/universal-registry.ts`,
`frontend/src/render/registry.ts`, `frontend/src/actions/registry.ts`,
`frontend/src/ui/registry.ts`, `frontend/src/engines/canvas-registry.ts`,
and more. Not all of these need to collapse into the kernel's registries —
several are legitimately scoped to one subsystem (e.g. `harness-command-registry.ts`
is exactly the harness axis's existing mechanism, correctly named). The
point is naming alone can't be trusted to tell you which "registry" a given
task means; every task in `03-TASKS.md` that touches a registry names the
exact file path, not just "the registry," for this reason.

### B4. Naming collision: `src/engines/kernel/` already exists and means something different

`src/engines/kernel/kernel-registry.ts` defines `KernelRegistry` — a
runtime introspection/health registry (tracks `EngineDescriptor`,
`StoreDescriptor`, `CapabilityDescriptor`, `RouteDescriptor` for
observability, alongside sibling files named `oracle-event-stream.ts`,
`oracle-diagnostic.ts`, `oracle-actuator.ts`, `oracle-query.ts`). This is a
**diagnostics/observability kernel**, unrelated to plugin activation.

**Correction to the design:** the new plugin-activation package must not be
placed at `src/kernel/` — a bare `grep -r "kernel"` or an agent skimming
directory names would conflate the two. `02-BOUNDARY-DESIGN.md` renames it
to `src/plugin-kernel/`. `KernelRegistry` becomes a natural consumer of the
plugin kernel's events (a plugin's contributed features can register as
`EngineDescriptor` rows the same way core engines do today), not something
the plugin kernel needs to touch structurally.

### B5. The harness command registry has no collision protection today — confirms rather than contradicts the earlier plan

Checked `src/engines/harness-command-registry.ts` directly: the only
guard-rails present are "not found" errors (`HarnessCommandNotFoundError`)
on lookup; there is no check at registration time for an already-used
`commandId`. This confirms (rather than corrects) the earlier plan's Task
6.2 (kernel-enforced namespace prefixing) — flagged here because it's the
one earlier claim that fully held up under verification and is worth
distinguishing from A1–A5 above.

### B6. This repo has an active, automated architecture-governance system (`.genome/`) worth knowing about, not modeling

`.genome/DECISIONS.md`, `CENSUS.md`, `CHALLENGES.md`, `GENOME.md`,
`HYGIENE.md`, plus JSON state files (`branch-reconciliation.json`,
`lineage.json`, `topology.json`, `sota-report.json`) show this project has
been through automated, evidence-based git-archaeology and branch
reconciliation (e.g. a ratified decision merging a `master`/`experimental-dev`
split, with the dual `prisma/system`/`prisma/user` schema — which this
clone already reflects — as the outcome). This isn't something the plugin
kernel design needs to touch, but it explains why so much prior art exists
in fragmented form: multiple AI-agent tool configurations
(`.opencode/`, `.devin/`, `.cip/`) have worked on this codebase across its
history, each leaving its own scaffolding. Worth a one-line mention so a
future reader isn't surprised by the volume of overlapping mechanisms
found in this audit — it's a natural consequence of that history, not a
sign of a single bad design pass.

---

## C. Net effect on the plan

| Axis | Original plan | Corrected plan |
|---|---|---|
| UI | Build/verify sandboxing from scratch | Sandboxing exists and is solid (A1); target the real live registry, `UniversalComponentRegistry` (A3), alongside `UiComponent` for dynamic content |
| Core features | Decompose a monolithic `bootstrap-engines.ts` | Already decomposed into 5 phases (A4); wrap phases with `activationEvents` instead |
| Schema | Wrap an assumed `NodeSchemaRegistry` | Wrap the real `SchemaRegistry` (A5), fix the `NodeType` union-vs-string gap explicitly |
| Packaging/trust | Assumed `plugin-router.ts` was the install path | Two competing stubbed/partial install paths exist (B1) — unify `TrustedPluginManager` + `plugin-router.ts` as an explicit task, don't build a third |
| Naming | Proposed `src/kernel/` | Renamed to `src/plugin-kernel/` to avoid colliding with the existing `src/engines/kernel/` diagnostics registry (B4) |
| Harness | Namespace-prefix commands | Unchanged — confirmed necessary (B5) |
| Prior art | Not referenced | `[AUDIT R-1..12]` and `CONVERGENCE-PLAN C1-C5` should be located and read before new kernel code is written (B2) |
