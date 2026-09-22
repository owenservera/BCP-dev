# Plugin Builder System — Layer Cake of Primitives (REVISED)

> **The major conceptual primitive.** A user with a hyper-capable plugin-builder system and (almost) no LLM help should be able to build every plugin VIVIM defines as first-party. To make that true, we design the builder first, then **decompose** it into a layer cake of narrower-scoped but dependency-layered capabilities. The cake layers are themselves exposed **as first-party plugins** that the user can invoke, compose, or extend. The kernel stays minimal; the **builder is itself a K2 plugin** using the same kernel contracts every other plugin uses.
>
> **Post-REASSESSMENT changes** to this file: P1-04 is rewritten (the previous "Zod schema from sample" claim produces `z.literal` traps); the layer order is reordered to P0, P1, **P3**, P2, P4, P5 (certify is between codegen and compose, as the data flow requires); the §3 table adds a `time-to-build-hours` column for honesty; namespace uses dots throughout (REASSESSMENT Gap-13).

---

## 0. The framing — how to ideate the primitives

The user requested a strategy for finding the primitives. Here is the framing I used, which I will apply throughout this file.

**Step 0 — Imagine the *hyper-capable* authoring system, no kernel constraints, no LLM budget.**

What would the *most* capable plugin builder look like? It would:
- Accept a natural-language goal from a user.
- Look at the current installed plugins.
- Look at the kernel contracts.
- Generate a `PluginManifest` (Zod-valid).
- Generate the `activate(ctx)` function with the right `ctx` calls.
- Compile any `scriptUrl`, `html`, `css`, Zod schema, or capability handler it needs.
- Lint, type-check, and dry-run the result.
- Submit to `IPluginManager.certify()`.
- If certify passes, install.
- If certify fails, surface the report and fix.

That imaginary system is the *target* — the "hyper-capable" cake. **It uses every kernel contract and probably a few LLM-side things we cannot yet name.** It is not the system we ship. It is the system we **decompose** into narrower capabilities.

**Step 1 — Identify the irreducible primitives the hyper-capable system uses.**

Looking at the hyper-capable system's behaviour, the *irreducible* operations are the things it *cannot* simulate without kernel help:

1. Ask the kernel "what contracts exist + their versions"
2. Ask the kernel "what plugins are installed and what they contribute"
3. Ask the kernel "what does an installed plugin's manifest look like"
4. Ask the kernel "what does a Zod-valid manifest for a goal X look like"
5. Generate code (LLM-side; not kernel)
6. Validate generated code against contracts (kernel side)
7. Dry-run the generated `activate(ctx)` in a sandbox (kernel side)
8. Submit to `IPluginManager.certify()` (kernel side)
9. Install the plugin (kernel side)
10. Subscribe to bus events to report status (kernel side)

Of these, items 1, 2, 3, 4, 6, 7, 8, 9, 10 are **kernel-exposed** operations. Item 5 is not.

**Step 2 — Cluster by capability tier.**

- **P0 (universal, the "ask the kernel what exists")** — 1, 2, 3, 4, 6. These are read-only inspection operations a user (or any plugin) can do.
- **P1 (capability, the "register a capability")** — the LLM generates a `CapabilityContribution`; the kernel validates and registers. This is the *first thing* a generated plugin must produce.
- **P3 (certify, the "will this manifest pass?")** — *between* codegen and compose. The generated manifest must be certifier-validated before it can be composed or installed.
- **P2 (UI, the "place it visually")** — the generated plugin contributes a `UiGeneratedContribution`; the kernel renders it in `SandboxedNode`.
- **P4 (compose, the "combine plugins")** — given a certified manifest, combine it with existing plugins to make a composite.
- **P5 (authoring, the user-facing UI)** — the user-facing "build me a plugin" experience that orchestrates P0..P4.

**Step 3 — Each layer is itself a plugin the user invokes.**

When the user says "build me a Discord archiver," the chain is:
- `plugin:plugin-introspect` (P0) — read the kernel's contract catalog.
- `plugin:plugin-codegen` (P1) — given a goal, produce a `PluginManifest`.
- `plugin:plugin-certify` (P3) — call `IPluginManager.certify()`; if it fails, loop back to P1.
- `plugin:plugin-compose` (P2/P4) — combine with other plugins if needed.
- `plugin:plugin-authoring` (P5) — the user-facing UI that orchestrates P0..P4.

**The user never sees the kernel directly. The user sees a small set of *user-facing* capabilities**, each of which is itself a plugin that calls the kernel through the same contracts every other plugin uses.

**Step 4 — Each layer is also a kernel exposure.**

The "ask the kernel what exists" capability is `ctx.capabilities.invoke('kernel.contracts.list', ...)` — itself a kernel-registered capability. The kernel exposes read-only inspection as a capability so that *any* plugin (including the user's plugin-builder) can use it.

The result: **the kernel does not grow; the *plugin space* grows. The user can build any plugin because the builder is itself a plugin that recursively builds plugins.**

---

## 1. The Layer Cake (REVISED ordering)

The cake is a dependency DAG: each layer can only depend on layers below it. P0 is the bottom; P5 is the top. The user-facing authoring flow runs from P5 down to P0, with a loop on P3 (certify) that returns to P1 (codegen) on failure.

```
                 P5  PLUGIN-AUTHORING    (the user-facing "build me a plugin" UI)
                 │   uses
                 ▼
              P4  PLUGIN-COMPOSE       (combine two certified plugins into one)
                 │   uses
                 ▼
              P2  PLUGIN-UI-EXTEND     (contribute a generated UI component to a slot)
                 │   uses
                 ▼
              P3  PLUGIN-CERTIFY       (will this manifest pass? — loop with P1)
                 ▲   │
                 │   │
              P1  PLUGIN-CODEGEN       (given a goal, produce a manifest)
                 │   uses
                 ▼
              P0  PLUGIN-INTROSPECT    (what does the kernel expose?)
                 │   uses
                 ▼
       ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
                       KERNEL CONTRACTS
       ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

**Important: P0–P5 are not in the kernel.** They are *first-party plugins* that the user can install, upgrade, replace, or even rebuild. The kernel is the *contracts layer*; everything above is in the plugin space.

The cake is *also* the user's mental model. When a user opens the plugin builder, they see:

1. **P0 — "what's installed"** (introspection)
2. **P1 — "code generation"** (given a goal, produce a manifest + activate)
3. **P3 — "certify"** (will the manifest pass? — feedback into P1)
4. **P2 — "place it visually"** (extend a UI slot with the generated component)
5. **P4 — "compose"** (combine two existing plugins into one)
6. **P5 — "authoring"** (the user-facing UI that orchestrates P0–P4)

Each layer's UI is a slot the user navigates to. The kernel does not change. The user's *power* is the cake.

---

## 2. The Primitives (per layer)

### P0 — PLUGIN-INTROSPECT ("what does the kernel expose?")

**Purpose:** read-only inspection of kernel state. A plugin (or the user's CLI) asks "what is available?"

| ID | Capability (dot namespace) | Kernel surface | Returns |
|----|------------|---------------|---------|
| P0-01 | `kernel.contracts.list` | C-25 `IContractCatalog.list` | `readonly IContractDescriptor[]` (id, version, signature, doc, location) |
| P0-02 | `kernel.contracts.get` | same | the full `IContractDescriptor` (types, enforcement, evidence) |
| P0-03 | `kernel.plugins.list` | C-01 `IPluginManager.list` | `readonly PluginDescriptor[]` (id, version, state, contributes summary) |
| P0-04 | `kernel.plugins.get` | C-01 `IPluginManager.get` | full `PluginDescriptor` (manifest + installed resources) |
| P0-05 | `kernel.registry.list` | C-26 `IPluginRegistry.list` | `readonly { id, kind, state, contributes }[]` |
| P0-06 | `kernel.bus.trace` | C-27 `IEventBus.trace({kind, since})` | `readonly EventEnvelope[]` (recent for that kind) |
| P0-07 | `kernel.sandbox.audit` | C-28 `ISandboxAuditStore.query` | `readonly SandboxAuditEvent[]` (filtered by plugin, kind, since) |
| P0-08 | `kernel.node.query` | C-29 `INodeStoreContract.query` | `readonly Node[]` (filtered by type, owner) |
| P0-09 | `kernel.capability.invoke` | C-02 `ctx.capabilities.invoke` (plugin-side wrapper; kernel-side dispatcher is C-10 `IExecutionManager`) | invokes any plugin's capability with policy + audit + telemetry |
| P0-10 | `kernel.sandbox.run` | C-30 `ISandboxRunnerContract.run` | runs a piece of code in QuickJS with a `SandboxPolicy`; returns `SandboxResult` |

**Why these are kernel-registered capabilities, not new methods on the host:**
A capability is a *thing a user can invoke by name*. By making these kernel-registered capabilities, the user (and the plugin-builder) can call them via `ctx.capabilities.invoke('kernel.contracts.list', ...)` — the same call shape they would use for any other plugin's capability. **This is the dog-fooding principle in action.**

### P1 — PLUGIN-CODEGEN ("given a goal, produce activate(ctx)") — REVISED

**Purpose:** turn a natural-language goal into a `PluginManifest` + a body for `activate(ctx)`.

| ID | Capability | Surface |
|----|------------|---------|
| P1-01 | `codegen.goal-to-manifest` | given `{ goal, targetSlot?, targetCapabilityName? }` returns a `PluginManifest` (Zod-valid) |
| P1-02 | `codegen.capability-handler` | given `{ name, intentPatterns, surfaces, inputSchema, outputSchema }` returns the handler body for one `cap.<category>.<action>` |
| P1-03 | `codegen.ui-generated` | given `{ slotId, scope, variant?, ownerId?, html, css, contract? }` returns the `UiGeneratedContribution` entry |
| P1-04 | `codegen.schema-contribution` | given `{ schema: z.ZodType, sample?: unknown, intentPatterns?: string[] }` returns a `SchemaContribution` — **REVISED (see below)** |
| P1-05 | `codegen.service-contribution` | given `{ kind, manifest }` returns a `ProviderContribution` |
| P1-06 | `codegen.activate-body` | given a `PluginManifest`, returns the body of `activate(ctx)` as a TypeScript source string (compiles to JS at install) |

**P1-04 REVISION (REASSESSMENT Gap-9):** the previous text claimed "the Zod schema is generated from the sample." **This is wrong** — generating a Zod schema from a single sample produces `z.literal("hello")` constraints, which reject any other valid value. The contract is now: the plugin author (or LLM) supplies the **Zod schema explicitly**; the codegen backend takes the schema and the optional sample for *indexable text + verification* (not for schema inference). The intentPatterns are for discovery (P4-02), not for schema generation.

**Implementation:** the codegen is itself a first-party plugin (`plugin:plugin-codegen`). It uses one of three backends:

- `codegen-backend:rules` — pure deterministic, no LLM. Maps a small DSL to manifest entries. For example, "every hour, send a message to a provider and store the response" is a known pattern with a known manifest.
- `codegen-backend:llm` — calls an LLM with the `PluginManifest` Zod schema as the structured-output constraint. Falls back to `rules` on failure.
- `codegen-backend:human` — produces a form for the user to fill in.

The user picks the backend. **A user with no LLM and no money can use `rules` to build many plugins; a user with a cheap local model can use `llm`; a user with money can use a frontier model.** All three are themselves plugins (P0-09 + P0-10 + `plugin:plugin-codegen`).

### P2 — PLUGIN-UI-EXTEND ("place it visually")

**Purpose:** the generated plugin contributes a `UiGeneratedContribution`; the kernel renders it in `SandboxedNode`.

| ID | Capability | Surface |
|----|------------|---------|
| P2-01 | `ui.generate-component` | given `{ slotId, scope, intentPatterns, sample }` returns html+css+contract (delegates to P1-03 + P1-04) |
| P2-02 | `ui.contribute` | given a `UiGeneratedContribution`, runs the P-05 certifier checks (size caps, CSS deny-list, `scriptUrl` origin) and registers as a `UiComponent` row |

**Implementation:** `plugin:plugin-ui-extend`. Uses the codegen (P1-03 + P1-04) and the kernel's `IUiComponentStore`.

### P3 — PLUGIN-CERTIFY ("will this manifest pass?") — REPOSITIONED between P1 and P2

**Purpose:** dry-run a `PluginManifest` against the kernel's certifier and return the report without installing. The user's plugin-builder calls this *after* P1 (codegen) and *before* P2/P4 (compose/install) to surface errors early.

| ID | Capability | Surface |
|----|------------|---------|
| P3-01 | `certify.run` | given a `PluginManifest`, returns `{ passed: boolean; report: string[] }` (the same shape the kernel's `IPluginManager.certify` returns) |
| P3-02 | `certify.explain` | given a `PluginManifest`, returns a structured list of failures with `where` (which P-15 check), `why` (the Zod message), and `fix` (a suggested manifest patch) |
| P3-03 | `certify.simulate-activate` | given a `PluginManifest` and a mock `IPluginContext`, runs the `activate` in `SandboxRunner` (K0-10 / C-30) and reports side effects (bus emits, schema registrations, capability invocations) |

**Implementation:** `plugin:plugin-certify`. The kernel's `IPluginManager.certify` is the authority (P-15); the plugin just exposes it as a capability with a friendlier report format.

**Why P3 is between P1 and P2:** the data flow is **codegen → certify → compose/install**. If certify fails, the loop returns to P1. P3 is *not* the last step; P2 (UI extension) and P4 (compose) consume the certified manifest.

### P4 — PLUGIN-COMPOSE ("combine two certified plugins into one")

**Purpose:** wrap multiple certified plugin contributions into a single plugin manifest. Useful for "package my Discord + Notion + summary into one install."

| ID | Capability | Surface |
|----|------------|---------|
| P4-01 | `compose.select-contributions` | given a set of plugin ids, returns a combined `contributes` block |
| P4-02 | `compose.resolve-conflicts` | given a combined `contributes` block, returns the namespace conflicts (slugs, slot ids, NodeType names) and a resolution proposal |
| P4-03 | `compose.derive-manifest` | given a resolved `contributes` block, returns a single `PluginManifest` |
| P4-04 | `compose.install-composite` | installs a composite plugin (registers all contributions under one plugin id) |

**Implementation:** `plugin:plugin-compose`. Uses the kernel's `IProviderRegistry`, `UniversalComponentRegistry`, `SchemaRegistry` to discover contributions, and the codegen to write the manifest + activate body (which is just `await Promise.all([ctx.capabilities.invoke('plugin:other1:cap', ...), ctx.capabilities.invoke('plugin:other2:cap', ...)])`).

### P5 — PLUGIN-AUTHORING ("the user-facing 'build me a plugin' UI")

**Purpose:** the user-facing authoring tool. Wraps P0–P4 into a single experience.

| ID | What the user does | What the system does |
|----|-------------------|----------------------|
| P5-01 | Opens "New plugin" | Shows the form (name, description, permissions, contributions) |
| P5-02 | Types "I want to archive Discord messages to Notion" | Suggests permissions: `['network']`. Suggests slot: `archive-card`. Suggests a manifest skeleton. |
| P5-03 | Selects contributions (capability, ui, schema) | Calls P1-01 (codegen) for each, shows the result inline. |
| P5-04 | Hits "Verify" | Calls P3-01 (certify), shows the report. If fail, loops to P1. |
| P5-05 | Hits "Dry-run" | Calls P3-03 (simulate-activate), shows side effects. |
| P5-06 | Hits "Install" | Calls `kernel.plugins.install` (C-31) |

**Implementation:** `plugin:plugin-authoring` — a React UI plugin in the frontend. It uses the same `use-capability` SDK hook that every other UI plugin uses. **It does not reach into the kernel directly.** It calls capabilities.

---

## 3. Mapping every first-party plugin to the primitives (REVISED with time-to-build)

For each plugin in the **36 first-party plugins** listed in `AT-FORENSIC-VERDICT.md` §4, the table below shows:

- **P0..P5** — which primitives the plugin uses (the cake layers)
- **Time to build** — honest estimate of hours for a user with the cake (rules backend for `🟢`; LLM backend for `🟡`; not for `🔴`)
- **Can a user build it?** — `🟢` (yes, with cake alone), `🟡` (partially — some content is first-party), `🔴` (no — needs `chrome:control` v2 gate)
- **What the user must supply** — the *content* the user must write or generate beyond what the cake produces

| Plugin | P0 | P1 | P2 | P3 | P4 | P5 | Time-to-build (h) | Can a user build it? | What the user must supply |
|---|---|---|---|---|---|---|---|---|---|
| `plugin:chat` (ConversationManager + NLCL 60 files) | 🟢 | 🟢 | 🟢 | 🟢 | 🟢 | 🟡 | **40-80** | **🟡 partial** | Routing strategies (`MuxSession`, `RoutingPreference`); intent resolvers; composer UI beyond a default |
| `plugin:memory` | 🟢 | 🟢 | 🟢 | 🟢 | 🟢 | 🟡 | **24-40** | **🟡 partial** | FSRS scheduler state machine; knowledge extraction patterns; embedding adapters |
| `plugin:knowledge` | 🟢 | 🟢 | 🟢 | 🟢 | 🟢 | 🟢 | **4-8** | **🟢 yes** | Small surface |
| `plugin:agents` | 🟢 | 🟢 | 🟢 | 🟢 | 🟢 | 🟡 | **30-60** | **🟡 partial** | Agent execution runtime (ExecutionKernel); planner; OpenCode or local-agent adapter |
| `plugin:workflows` | 🟢 | 🟢 | 🟢 | 🟢 | 🟢 | 🟢 | **8-16** | **🟢 yes** | |
| `plugin:canon-nlcl` | 🟢 | 🟢 | 🟢 | 🟢 | 🟢 | 🟡 | **80-120** | **🟡 partial** | The full 60-file engine is *content*; the cake produces the manifest + activate, not the resolvers |
| `plugin:canon-harness` | 🔴 | 🟢 | 🟢 | 🟢 | 🟢 | 🟡 | **v2 only** | **🔴 no** | Harness recipes drive `chrome:control`-gated execution; v2 gate |
| `plugin:policy` | 🟢 | 🟢 | 🟢 | 🟢 | 🟢 | 🟢 | **4-8** | **🟢 yes** | The policy content is a JSON file the user writes |
| `plugin:cost` | 🟢 | 🟢 | 🟢 | 🟢 | 🟢 | 🟢 | **2-4** | **🟢 yes** | |
| `plugin:collections` | 🟢 | 🟢 | 🟢 | 🟢 | 🟢 | 🟢 | **1-2** | **🟢 yes** | |
| `plugin:contacts` | 🟢 | 🟢 | 🟢 | 🟢 | 🟢 | 🟢 | **1-2** | **🟢 yes** | |
| `plugin:notifications` | 🟢 | 🟢 | 🟢 | 🟢 | 🟢 | 🟢 | **1-2** | **🟢 yes** | |
| `plugin:workspace` | 🟢 | 🟢 | 🟢 | 🟢 | 🟢 | 🟢 | **4-8** | **🟢 yes** | |
| `plugin:sync` | 🟢 | 🟢 | 🟢 | 🟢 | 🟢 | 🟡 | **20-40** | **🟡 partial** | Cross-device CRDT merge engine; one-device sync is buildable |
| `plugin:mirror` | 🟢 | 🟢 | 🟢 | 🟢 | 🟢 | 🟢 | **2-4** | **🟢 yes** | |
| `plugin:routing-learning` | 🟢 | 🟢 | 🟢 | 🟢 | 🟢 | 🟢 | **4-8** | **🟢 yes** | |
| `plugin:discovery` | 🟢 | 🟢 | 🟢 | 🟢 | 🟢 | 🟢 | **4-8** | **🟢 yes** | |
| `plugin:audit` | 🟢 | 🟢 | 🟢 | 🟢 | 🟢 | 🟢 | **2-4** | **🟢 yes** | |
| `plugin:search` | 🟢 | 🟢 | 🟢 | 🟢 | 🟢 | 🟢 | **2-4** | **🟢 yes** | |
| `plugin:tools` | 🟢 | 🟢 | 🟢 | 🟢 | 🟢 | 🟢 | **4-8** | **🟢 yes** | |
| `plugin:tools-image` | 🟢 | 🟢 | 🟢 | 🟢 | 🟢 | 🟢 | **1-2** | **🟢 yes** | |
| `plugin:tools-mcp` | 🟢 | 🟢 | 🟢 | 🟢 | 🟢 | 🟡 | **8-16** | **🟡 partial** | MCP client transport is first-party content; the contract surface is a thin adapter |
| `plugin:providers-api` (OpenAI-compatible + 9 seed manifests) | 🟢 | 🟢 | 🟢 | 🟢 | 🟢 | 🟡 | **16-32** | **🟡 partial** | The OpenAI-compatible *impl* is first-party; the 9 bundled manifests are seeds |
| `plugin:providers-browser` (ChromeGovernor + stealth + browser-automation) | 🔴 | 🟢 | 🟢 | 🟢 | 🟢 | 🟡 | **v2 only** | **🔴 no** | `ChromeGovernor` requires a real browser binary; the user cannot build the binary |
| `plugin:claude` / `plugin:openai-api` / `plugin:openrouter` | 🟢 | 🟢 | 🟢 | 🟢 | 🟢 | 🟢 | **1-2** | **🟢 yes** | Each is a `kind:'api-protocol'` manifest + an `IProviderAdapter` impl |
| `plugin:discord` / `plugin:slack` / `plugin:whatsapp` / `plugin:reddit` | 🔴 | 🟢 | 🟢 | 🟢 | 🟢 | 🟡 | **v2 only** | **🔴 no** | `kind:'browser-provider'` requires `chrome:control` (v2) |
| `plugin:notion` | 🟢 | 🟢 | 🟢 | 🟢 | 🟢 | 🟢 | **1-2** | **🟢 yes** | `kind:'api-protocol'` (Notion has a JSON-over-HTTPS API) |
| `plugin:ui-canvas` | 🟢 | 🟢 | 🟢 | 🟢 | 🟢 | 🟡 | **40-80** | **🟡 partial** | The infinite-canvas UX (pan/zoom, ConnectionLayer, CommandStack) is *content*; the cake produces the slot, not the canvas |
| `plugin:ui-panels` | 🟢 | 🟢 | 🟢 | 🟢 | 🟢 | 🟢 | **4-8** | **🟢 yes** | |
| `plugin:ui-shell` | 🟢 | 🟢 | 🟢 | 🟢 | 🟢 | 🟢 | **2-4** | **🟢 yes** | |
| `plugin:ui-cards` | 🟢 | 🟢 | 🟢 | 🟢 | 🟢 | 🟢 | **2-4** | **🟢 yes** | |
| `plugin:ui-builder` | 🟢 | 🟢 | 🟢 | 🟢 | 🟢 | 🟡 | **40-80** | **🟡 partial** | The drag-to-connect visual builder is *content*; the data model is easy |
| `plugin:dev-tooling` | 🟢 | 🟢 | 🟢 | 🟢 | 🟢 | 🟢 | **8-16** | **🟢 yes** | |

**Summary (REVISED with time-to-build):**
- **24 of 36** first-party plugins can be built by a user with the primitives alone (🟢). Total time across all 24: roughly 60-100 hours. (e.g. 9 of them are 1-2 hours each; 7 are 2-4; 5 are 4-8; 2 are 8-16; 1 is 16-32.)
- **8 of 36** are partially buildable (🟡). Total time for the buildable part: roughly 200-400 hours. The remaining part (the kernel-internal content) is first-party.
- **4 of 36** cannot be built by a user at all today (🔴) — they require `chrome:control` (browser provider + harness) which is v2.
- **0 of 36** require a primitive that does not exist in the cake.

**The cake is sufficient.** No new kernel primitive is needed. What is needed is the *v2 gate* (`chrome:control`) for the 🔴 4 plugins. The user can build everything else.

---

## 4. The Meta-Primitive: the plugin-builder is itself a K2 plugin

This is the most important architectural point: **the plugin-builder is itself a K2 plugin using the same kernel contracts every other plugin uses.** The kernel does not grow to support plugin building; the plugin-builder *is* a plugin that recursively builds plugins.

The chain:

```
User says: "build me a Discord archiver"
                 │
                 ▼
plugin:plugin-authoring  (P5) — the user-facing UI
                 │  uses ctx.capabilities.invoke
                 ▼
plugin:plugin-certify    (P3) — runs the certifier, returns the report
                 │  uses ctx.capabilities.invoke('kernel.plugins.certify', manifest)
                 ▼
plugin:plugin-codegen    (P1) — generates the manifest + activate
                 │  uses codegen-backend:rules OR codegen-backend:llm
                 ▼
plugin:plugin-introspect (P0) — reads the kernel contract catalog
                 │  uses ctx.capabilities.invoke('kernel.contracts.list', ...)
                 ▼
                KERNEL — exposes the contracts and the install/certify pipeline
```

The plugin-builder is a **stack of first-party plugins**, each thin, each contributing one capability, each using only the kernel contracts.

**The kernel does not know that "the user is building a plugin."** The kernel just sees: a plugin calls `kernel.contracts.list`, gets a list, calls `kernel.plugins.certify` with a manifest, gets a report, calls `kernel.plugins.install`, gets a result. **This is the dog-fooding principle in action.**

---

## 5. The Decomposition Algorithm (the recipe to ship the builder)

To actually build the cake, the team applies the 4-step algorithm from §0 of this file to *each* capability they want to ship. The algorithm is mechanical; the only creativity is in naming and in identifying the "irreducible" set.

For each new plugin-builder capability:

1. **Imagine the hyper-capable version** — what would the *most* capable version of this capability do? No LLM budget, no kernel constraints, no engineering reality.
2. **Identify the irreducible primitives** — what would the hyper-capable version need that *no other capability* can provide? Those are the irreducibles.
3. **Cluster by capability tier** — P0 (introspect) / P1 (codegen) / P2 (UI extend) / P3 (certify) / P4 (compose) / P5 (authoring). Each cluster is itself a plugin.
4. **Make each layer a kernel-exposed capability** — the layer is callable by name through `ctx.capabilities.invoke`. Verify the layer is reachable *from a user without code* (e.g. through a no-LLM codegen path).

**Test for the cake's completeness:** for each first-party plugin in §3, can a user with the cake alone (and a 1B-parameter LLM) build an equivalent plugin in the time-to-build estimate? If yes, the cake is sufficient. If no, either (a) the user needs a primitive that does not exist, or (b) the first-party plugin should be re-classified as a kernel contract (rare — only when the *mechanism* is universal).

The §3 table is the result of that test. 24 🟢 (60-100 hours), 8 🟡 (200-400 hours partial), 4 🔴 (v2-gated). **The cake is sufficient for v1.**

---

## 6. The Kernel Surface Additions (new contracts, in priority order)

To make the cake work, the kernel needs the following new contracts. **These are *capability* exposures — they do not add new mechanisms; they expose existing mechanisms as capabilities.** Each is in v1.0 of the kernel (P0-1 of the migration plan + 1 additional PR per capability, all small).

| Contract | ID | Source already in repo | New | v1.0 priority |
|---|---|---|---|---|
| C-25 | `IContractCatalog.list/get` | none | new | required for P0-01 |
| C-26 | `IPluginRegistry.list` exposed as `kernel.plugins.list` capability | `src/ai/registry/registry.ts:33-58` | wrap as capability | required for P0-03 / P0-05 |
| C-27 | `IEventBus.trace({kind, since})` | none | new | required for P0-06 |
| C-28 | `ISandboxAuditStore.query` | `src/storage/contracts/sandbox-audit-store.ts` | wrap as capability | required for P0-07 |
| C-29 | `INodeStoreContract.query` | `src/storage/contracts/node-store.ts` | wrap as capability | required for P0-08 |
| C-30 | `ISandboxRunnerContract.run(code, policy, input)` | `src/engines/sandbox-runner.ts` | wrap as capability | required for P0-10 |
| C-31 | `IPluginManager.install/upgrade/uninstall` exposed as `kernel.plugins.install` etc. | `src/ai/plugins/manager.ts:27-45` (interface exists; impl stubbed) | wrap as capability + real impl | required for the builder's "Install" button |
| C-32 | `IPluginManager.certify` exposed as `kernel.plugins.certify` | same | wrap as capability | required for P3 |

**Implementation cost:** each is a 5-30 line wrapper that translates a capability call into a method invocation. **No new mechanism in the kernel.** **No new dependency direction.** **No new "VIVIM-only fast path" — every existing plugin that can use the kernel can use these capabilities.**

The kernel *does* grow the `IPluginContext.capabilities.invoke` surface (already in C-02) by ~8 names. **This is the same surface that the user-facing builder and every other plugin use.**

**Namespace (REVISED post-REASSESSMENT Gap-13):** all kernel capabilities use **dot** separator (`kernel.contracts.list`, `kernel.plugins.install`, etc.). All kernel bus events use **dot** separator (`kernel.plugin.installed`, `kernel.provider.state_changed`, etc.). All plugin events use `plugin.<pluginId>.<name>`. All legacy V1 events mirrored to V2 use the `legacy.<type>` prefix. **No colon namespace anywhere.**

---

## 7. The Migration Impact

The cake does not change the migration plan in `inventory/BOUNDARY-MIGRATION-PLAN.md`. **Every phase of P0 is still required.** The cake *extends* the plan: after P0-1 (real PluginHost + IPluginContext + certifier), a new PR series can add the 8 capability wrappers (C-25..C-32) and ship the 6 builder plugins (P0..P5) as first-party plugins.

**New P0-1 sub-phase: P0-1.x — "the kernel introspection capabilities."**

- After `PluginHost` ships, ship `src/kernel/plugin-kernel/capabilities/` with 8 files, each ~20 lines: `kernel-contracts.ts`, `kernel-plugins-list.ts`, `kernel-plugins-certify.ts`, `kernel-plugins-install.ts`, `kernel-registry-list.ts`, `kernel-bus-trace.ts`, `kernel-sandbox-audit.ts`, `kernel-node-query.ts`, `kernel-sandbox-run.ts`. Each registers a capability with the kernel.
- These are the *kernel's own contributions* (first-party, but signed by the kernel itself).
- The plugin-builder chain (§4) is then built on top.

**This is the right place to add the introspection surface** because (a) it requires the certifier to be real (so the builder's "Verify" button works), (b) it requires the closed `IPluginContext` (so the builder can call `ctx.capabilities.invoke` without reaching into the kernel), and (c) it requires the unified install path (so the builder's "Install" button goes through the same flow every other plugin uses).

**Estimated cost:** P0-1.x is ~10 small PRs (one per capability + one for the contract catalog), ~1 sprint. **No change to the success statement** — VIVIM is still a kernel hosting VIVIM as a first-party plugin suite, and the user can build *more* plugins because the cake exists.

---

## 8. What the Cake Does Not Solve (the honest list — REVISED)

A user with the cake alone still cannot build:

1. **Plugins that need `chrome:control`** — the v2 gate (browser-driven provider + harness recipes). Until the gate exists, the user has to wait. This is intentional: a user with no LLM, no money, and no time should not be able to drive an authenticated browser in the kernel without the kernel's permission.
2. **Plugins that need OS-level capabilities not in the kernel** — raw GPU access, kernel-bypass, etc. The kernel deliberately does not expose these. (Constitution Rule D: security is core, policy is not.)
3. **Plugins that need a new kernel contract** — if the user's goal requires a primitive that does not exist, the user must add a kernel contract. The cake makes this *discoverable* (P0-01 surfaces the contract catalog), but the user must still ship a kernel change to add a new one. **This is the correct outcome** — adding a new mechanism is a kernel change, not a plugin change.
4. **Plugins that require deep knowledge of the host's internals** — the cake deliberately does not expose host internals. A user who wants to write a "browserify" of the host cannot. **This is the correct outcome** — the constitution's Rule C says plugins must use the *same* contracts VIVIM uses; if VIVIM doesn't use the host internals, plugins shouldn't either.
5. **(NEW)** **Content knowledge that is not in the kernel** — building a Discord plugin requires knowing Discord's auth flow, block model, and rate limits. The cake produces the manifest + activate + certifier, not the *content* about Discord. The §3 table column "What the user must supply" enumerates this for each plugin. The cake is a speed multiplier, **not an automation oracle**.

The cake is **deliberately bounded**. It is not "anything the user wants" — it is "anything the kernel's contracts allow, and only after the user has the content knowledge." The boundary is the security boundary *and* the content-knowledge boundary.

---

## 9. The Cakes in v2

In v2, the cake expands by **adding the missing primitive** (`chrome:control` gate) and by **adding 4 more cake layers**:

- **P6 — NATIVE-HOST-ACTION** — for plugins that need to talk to OS processes (browser, native tools, etc.). Uses `IRuntimeSupervisor`.
- **P7 — COMPILED-COMPONENT** — for plugins that want to ship a compiled React component. Uses `UniversalComponentRegistry`.
- **P8 — FEATURE-REGISTRATION** — for plugins that want to register a new kernel-managed capability at boot. Uses `feature-registry.ts`.
- **P9 — HARNESS-RECIPE** — for plugins that want to publish a browser-automation recipe. Uses `HarnessCommandRegistry` (with `<pluginId>.` prefix).

Each layer follows the same pattern: a thin first-party plugin that uses only kernel contracts. **The kernel does not grow.** The cake does.

---

## 10. The Final Picture

```
USER
  │
  ▼
plugin:plugin-authoring (P5)         — the user-facing "build me a plugin" UI
  │
  ▼
plugin:plugin-compose (P4)           — combine two certified plugins into one
  │
  ▼
plugin:plugin-ui-extend (P2)         — contribute a generated UI to a slot
  │
  ▼
plugin:plugin-certify (P3)           — certifier (loop with P1 on fail)
  │
  ▼
plugin:plugin-codegen (P1)           — produces manifest + activate
  │
  ▼
plugin:plugin-introspect (P0)        — reads the kernel contract catalog
  │
  ▼
KERNEL                              — exposes the contracts and the install/certify pipeline
   ▲                                  (C-01..C-32)
   │
FIRST-PARTY PLUGINS                 — VIVIM's product features, built on the same contracts
   │
   ▼
THIRD-PARTY PLUGINS                 — community + user-built plugins
```

**The user can build any plugin that does not require a missing kernel primitive, *with the content knowledge the user supplies*.** The user can use any LLM (or none) via the codegen backend. The kernel does not grow. The cake does.

---

## 11. Why this matters (closing thought)

The user said: *"this is not an easy ask — so think about how to frame your investigation."* The framing is:

> **Imagine the most-capable builder. Decompose it into layers. Each layer is a thin first-party plugin. The kernel does not grow.**

The framing works because:

1. **The hyper-capable builder is bounded by the kernel's contracts** (anything else it might want, it cannot have — the constitution forbids host access).
2. **The decomposition is mechanical**: "what does this layer need that only the kernel can provide?" → list the irreducibles → those are the kernel's new capabilities.
3. **The cake is itself testable**: for each layer, the test is "can a user build plugin X using only this layer + lower in the time-to-build estimate?" — the §3 table is the result of that test.
4. **The kernel does not change**: every layer is a plugin; the kernel is the contracts.
5. **The user has power proportional to the cake they can install, *and* the content knowledge they bring**. A user with the rules backend (no LLM) can build a lot; a user with a frontier model can build more; a user with the *content* (Discord API, Notion blocks, infinite-canvas UX) can build everything (modulo the v2 gate).

**The cake is the user-facing authoring surface. The kernel is the contracts. The user's power is the cake they install *and* the content they bring. The kernel's discipline is the boundary.**

That's the conceptual primitive.
