# Self-Descriptive Constitution (M-layer)

> **The new dimension the user asked for: the kernel is natively self-descriptive — both for machines and for humans.** Every subsystem, contract, plugin, capability, and configuration value can answer four questions: (1) **what am I?** (2) **where did I come from?** (3) **why am I the way I am?** (4) **how do I fit with the rest?** A future coding agent, a UI, a user typing a question, or an LLM can ask these and get a precise answer — without reading the source code.
>
> This file is the **M-layer** (Meta-layer). It sits *alongside* the existing four layers (KERNEL / FIRST-PARTY / GENERIC / SANDBOXED) but is *orthogonal* to them. The M-layer is a kernel-level primitive: the kernel owns a self-descriptive surface; plugins contribute to it. The constitution guarantees the surface is **always correct** (the kernel cannot lie), **always complete** (every subsystem is described), and **always current** (the surface is generated at boot from the same source the kernel boots from).
>
> **Read this if you want to understand the kernel's self-descriptive architecture.** The artifacts below extend the existing contracts (`inventory/KERNEL-CONTRACTS.md` adds C-33..C-39), the trust model (`inventory/PLUGIN-TRUST-MODEL.md` adds an M-tier), the tests (`inventory/KERNEL-BOUNDARY-TESTS.md` adds 4 tests), the migration plan (`inventory/BOUNDARY-MIGRATION-PLAN.md` adds a sub-phase P0-1.y), and the I-2 probe spec (`evidence/I-2-PROBE-SPEC.md` adds 2 probes).

---

## 0. The single sentence

> **A self-descriptive kernel is one that can answer "what am I, where did I come from, why am I this way, and how do I fit" — for any of its subsystems, contracts, or plugins — without reading source code, without ambiguity, and without a separate documentation pipeline that can drift.**

---

## 1. The four questions (the M-quadruple)

| # | Question | Codename | What it produces | Example |
|---|---|---|---|---|
| **1** | **What am I?** | **M1 — IDENTITY** | A structured `IdentityCard` for every kernel subsystem, every contract, every plugin, every capability, every configuration value. | `IPluginManager` is `interface`, lives in `src/ai/plugins/manager.ts:27`, version `1.0`, stability `stable`, owner `kernel`, supersedes `TrustedPluginManager` (deprecated). |
| **2** | **Where did I come from?** | **M2 — PROVENANCE** | A `ProvenanceRecord` for every artifact: who created it, who approved it, who depends on it, when it was last changed, why, and the diff trail. | The `enforceCapabilityInvocation` contract was added 2026-08-28 in response to REASSESSMENT Change-8; it was approved in P0-1.x; the upstream cause was "VIVIM-as-its-own-plugin" risk #10. |
| **3** | **Why am I the way I am?** | **M3 — RATIONALE** | A `RationaleNote` for every architectural decision: the alternative considered, the reason the alternative was rejected, the consequences. | The kernel uses dot-namespace (not colon) because colon conflicts with bus event-kind conventions; the rejection of colon was a REASSESSMENT Gap-13 fix; the consequence is the V1 bus legacy prefix. |
| **4** | **How do I fit?** | **M4 — GRAPH** | A `RelationGraph` that maps every artifact to its consumers, dependencies, and adjacent contracts. | `IProviderRegistry.setState` (C-06) is consumed by `Gateway` and `IProviderAdapter`; it depends on `PROVIDER_TRANSITIONS` (K0) and `IProviderManifest` (C-05); its `expectedFrom` parameter was added in P0-2 (REASSESSMENT Gap-7). |

Every artifact in the kernel answers all four. The four answers are **co-generated** at boot from the same source the kernel boots from — so they cannot drift.

---

## 2. The M-layer surface (M1–M4 contracts)

The M-layer surface is exposed to K1/K2/K3 as a set of kernel-registered capabilities (per the same pattern as C-25..C-32 in `KERNEL-CONTRACTS.md`). The contracts below extend that surface; the migration plan §P0-1.y adds them.

### C-33 — `IIdentityCatalog` (M1)

```ts
export type IdentityKind =
  | 'kernel-subsystem'        // e.g. 'IPluginManager'
  | 'kernel-contract'         // e.g. 'C-01'
  | 'kernel-class'            // e.g. 'PluginHost'
  | 'kernel-type'             // e.g. 'NodeType'
  | 'plugin'                  // e.g. 'plugin:discord'
  | 'plugin-capability'       // e.g. 'plugin:discord:send'
  | 'plugin-node-type'        // e.g. 'plugin:discord.message'
  | 'plugin-event'            // e.g. 'plugin:discord.message.sent'
  | 'config-key'              // e.g. 'config.engine.provider-mux.timeout-ms'
  | 'bus-event'               // e.g. 'kernel.plugin.installed'
  | 'prisma-model'            // e.g. 'Conversation'

export interface IdentityCard {
  readonly id: string                       // reverse-DNS or dot-namespaced, e.g. 'kernel.contracts.ipluginmanager'
  readonly kind: IdentityKind
  readonly displayName: string              // human: 'IPluginManager (host)'
  readonly shortDescription: string        // human: 1 sentence
  readonly longDescription: string         // human: 1-3 paragraphs, structured markdown
  readonly sourceLocation: string          // file:line, e.g. 'src/ai/plugins/manager.ts:27'
  readonly contractVersion: { major: number; minor: number }  // numeric, where applicable
  readonly stability: 'experimental' | 'stable' | 'deprecated' | 'removed'
  readonly supersedes: readonly string[]   // prior identity ids
  readonly supersededBy: string | null     // the next identity id
  readonly tags: readonly string[]         // e.g. ['security-boundary', 'p0', 'kernel']
  readonly examples: readonly { readonly description: string; readonly code: string }[]
  readonly children: readonly string[]     // sub-identities (e.g. for a subsystem: its methods)
  readonly parent: string | null           // parent identity
  readonly capabilities: readonly string[]  // kernel capabilities this exposes
  readonly see: readonly string[]          // M2 / M3 / M4 references
}

export interface IIdentityCatalog {
  list(filter?: { readonly kind?: IdentityKind; readonly tag?: string }): Promise<readonly IdentityCard[]>
  get(id: string): Promise<IdentityCard | undefined>
  /** Human-readable: returns a markdown summary of one identity. */
  describe(id: string, opts?: { readonly include?: ('children' | 'provenance' | 'rationale' | 'graph')[] }): Promise<{ readonly markdown: string }>
  contractVersion: { major: 1; minor: 0 }
}
```

**Enforcement point:** at boot, the kernel walks `src/kernel/**`, `src/storage/contracts/**`, and the installed plugins' manifests, and generates one `IdentityCard` per artifact. The generation is **deterministic from source** (the `longDescription` is parsed from a `@doc` JSDoc tag on the export; the `shortDescription` is the first line of the long). No documentation pipeline can drift.

**Consumer:** the kernel's own `/kernel.identity` API; any plugin that wants to introspect the system (including `plugin:plugin-authoring` from the cake).

### C-34 — `IProvenanceStore` (M2)

```ts
export type ArtifactKind = 'contract' | 'subsystem' | 'plugin' | 'capability' | 'class' | 'config' | 'adr' | 'doc'

export interface ProvenanceRecord {
  readonly artifactId: string                              // the IdentityCard.id
  readonly kind: ArtifactKind
  readonly createdAt: string                              // ISO-8601
  readonly createdBy: string                              // 'agent (E2E owner)' | 'I-2 deep probe' | 'human:<name>' | ...
  readonly approvedBy: readonly string[]                   // e.g. ['two-reviewer gate (P0-1)', 'I-1 formalization']
  readonly parent: readonly string[]                       // upstream artifact ids this was derived from
  readonly children: readonly string[]                     // downstream artifact ids derived from this
  readonly supersededBy: string | null
  readonly reason: string                                  // 'VIVIM-as-its-own-plugin' / 'TOCTOU defense' / 'capability-abuse defense' / ...
  readonly evidence: readonly string[]                     // ['REASSESSMENT.md Gap-7', 'inventory/FALSE-CORE-AND-MISSING.md item 13']
  readonly change: { readonly summary: string; readonly ticket?: string }
  readonly tags: readonly string[]
}

export interface IProvenanceStore {
  get(artifactId: string): Promise<ProvenanceRecord | undefined>
  list(filter?: { readonly kind?: ArtifactKind; readonly tag?: string; readonly approvedBy?: string }): Promise<readonly ProvenanceRecord[]>
  /** Human-readable: returns a "why does this exist" markdown summary. */
  why(artifactId: string): Promise<{ readonly markdown: string }>
  contractVersion: { major: 1; minor: 0 }
}
```

**Enforcement point:** the `REASSESSMENT.md` and the per-decision ADRs are parsed at boot; the `inventory/FALSE-CORE-AND-MISSING.md`, `inventory/ATOMIC-INVENTORY-v3.md`, and `inventory/PLUGIN-BUILDER-CAKE.md` are similarly parsed. The `inventory/REASSESSMENT.md` table-of-gaps is the source of the `evidence` field for post-REASSESSMENT records.

**Consumer:** `IIdentityCatalog.describe(id, { include: ['provenance'] })`; the `why` capability is exposed to the user (e.g. "why does the kernel namespace with dots?").

### C-35 — `IRationaleCatalog` (M3)

```ts
export type DecisionType = 'architectural' | 'security' | 'naming' | 'compatibility' | 'performance' | 'ergonomics' | 'other'

export interface AlternativeConsidered {
  readonly name: string
  readonly description: string
  readonly rejectedBecause: string
}

export interface RationaleNote {
  readonly id: string                                    // e.g. 'rationale.kernel.dot-namespace'
  readonly decision: string                              // 'Kernel uses dot-namespaced event kinds, not colon.'
  readonly type: DecisionType
  readonly context: string                               // why this decision was on the table
  readonly chosen: string                                // the choice
  readonly alternatives: readonly AlternativeConsidered[]
  readonly consequences: readonly string[]               // what this enables / blocks
  readonly supersedes: readonly string[]                  // prior rationale ids this overrides
  readonly supersededBy: string | null
  readonly refs: readonly string[]                       // 'REASSESSMENT.md Gap-13', 'KERNEL-CONTRACTS.md §5', ...
}

export interface IRationaleCatalog {
  get(id: string): Promise<RationaleNote | undefined>
  list(filter?: { readonly type?: DecisionType; readonly ref?: string }): Promise<readonly RationaleNote[]>
  /** Human-readable: returns a "why is it this way" markdown summary. */
  why(decision: string, opts?: { readonly depth?: 'one-line' | 'short' | 'full' }): Promise<{ readonly markdown: string }>
  contractVersion: { major: 1; minor: 0 }
}
```

**Enforcement point:** the rationale is **co-generated** with the source. Every `RationaleNote` is either (a) extracted from a `@rationale` JSDoc tag on the relevant contract, (b) parsed from the `BOUNDARY-CONSTITUTION.md` 6 rules, (c) parsed from the 7 ADRs, or (d) parsed from the 14 REASSESSMENT gaps. The kernel cannot lie about its own rationale because the rationale is in the same file as the contract.

**Consumer:** `IRationaleCatalog.why(decision)` is exposed as a kernel capability (`kernel.why`) that the user can invoke. A user typing "why is the namespace dot-separated?" gets a markdown answer.

### C-36 — `IRelationGraph` (M4)

```ts
export type RelationKind =
  | 'consumes'             // A's API is called by B
  | 'depends-on'           // A imports B at runtime
  | 'supersedes'           // A replaces B (B is deprecated)
  | 'paired-with'          // A and B are designed to be used together
  | 'migrates-to'          // A's data is moved to B
  | 'enforces'             // A is enforced by B (e.g. IPolicyEnforcer is enforced by IExecutionManager)

export interface RelationEdge {
  readonly from: string                                    // identity id
  readonly to: string                                      // identity id
  readonly kind: RelationKind
  readonly note: string                                    // short explanation
  readonly evidence: readonly string[]                     // file:line references
}

export interface IRelationGraph {
  /** Outgoing relations from a given identity. */
  outgoing(id: string, opts?: { readonly kind?: RelationKind }): Promise<readonly RelationEdge[]>
  /** Incoming relations to a given identity. */
  incoming(id: string, opts?: { readonly kind?: RelationKind }): Promise<readonly RelationEdge[]>
  /** Direct neighbors (one hop). */
  neighbors(id: string): Promise<readonly string[]>
  /** Shortest path between two identities. */
  path(from: string, to: string): Promise<readonly string[]>
  /** All identities within N hops of a given identity. */
  reachable(id: string, hops: number): Promise<readonly string[]>
  /** "What breaks if I change X?" — the transitive closure of inbound consumers. */
  impact(id: string): Promise<readonly string[]>
  contractVersion: { major: 1; minor: 0 }
}
```

**Enforcement point:** the relation graph is **co-generated** with the source. Every `RelationEdge` is either (a) extracted from a `@consumes`, `@depends-on`, `@paired-with`, `@enforces` JSDoc tag, (b) detected by static import analysis (the I-2 deep probe produces the per-file truth map; the relations are derived from `import` statements + the boundary rules), or (c) declared in the `BOUNDARY-MIGRATION-PLAN.md` "Consequences" sections.

**Consumer:** the `impact` capability is the killer feature — a future agent or LLM can ask "what breaks if I change `IPluginManager.install`?" and get the transitive closure of all inbound consumers. **No more archaeology.**

### C-37 — `IConfigurationCatalog` (M1 for config)

```ts
export interface ConfigCard {
  readonly key: string                                     // e.g. 'engine.provider-mux.timeout-ms'
  readonly displayName: string
  readonly currentValue: unknown                           // what the running kernel has
  readonly defaultValue: unknown
  readonly type: 'string' | 'number' | 'boolean' | 'object' | 'array' | 'duration' | 'bytes'
  readonly description: string
  readonly envVar: string | null                          // e.g. 'VIVIM_PROVIDER_MUX_TIMEOUT_MS'
  readonly owner: string                                   // identity id of the subsystem that reads this
  readonly hotReload: boolean                              // can it change at runtime without restart?
  readonly since: { major: number; minor: number }         // which contract version introduced it
  readonly deprecated: { since: { major: number; minor: number }; replacement: string | null } | null
}

export interface IConfigurationCatalog {
  list(filter?: { readonly owner?: string; readonly hotReload?: boolean }): Promise<readonly ConfigCard[]>
  get(key: string): Promise<ConfigCard | undefined>
  contractVersion: { major: 1; minor: 0 }
}
```

**Enforcement point:** every `config-manager.ts` schema registration auto-generates a `ConfigCard`. The `currentValue` is read from the live `ConfigManager` instance at call time. The `envVar` is derived from a `@env` JSDoc tag.

**Consumer:** UI panel (admin), `plugin:audit` (logs config changes), `plugin:cli-debug`.

### C-38 — `IEventCatalog` (M1 for events)

```ts
export interface EventCard {
  readonly kind: string                                    // e.g. 'kernel.plugin.installed'
  readonly direction: 'emitted' | 'consumed' | 'both'
  readonly source: string                                  // identity id of the emitter
  readonly description: string
  readonly payloadSchema: string                            // Zod schema as a string (so the catalog is self-describing)
  readonly examples: readonly { readonly description: string; readonly payload: unknown }[]
  readonly consumers: readonly string[]                    // identity ids of consumers
  readonly since: { major: number; minor: number }
  readonly deprecated: { since: { major: number; minor: number }; replacement: string | null } | null
}

export interface IEventCatalog {
  list(filter?: { readonly source?: string; readonly direction?: 'emitted' | 'consumed' | 'both' }): Promise<readonly EventCard[]>
  get(kind: string): Promise<EventCard | undefined>
  contractVersion: { major: 1; minor: 0 }
}
```

**Enforcement point:** every `IEventBus.publish` call site has a `@emits` JSDoc tag; every `IEventBus.on` call site has a `@consumes` tag. The static analyzer walks the source. (Same pattern as `IIdentityCatalog` — the catalog cannot lie because it is co-generated with the source.)

### C-39 — `IWhy` (the user-facing entry point)

```ts
export interface IWhy {
  /**
   * The single user-facing entry point to the M-layer. Takes a free-text question
   * (a substring of a name, a kind, a tag) and returns a markdown answer.
   *
   * The kernel does NOT use an LLM. It uses a deterministic text-matching algorithm
   * over the four catalogs. The answer is grounded in source — it cannot hallucinate.
   *
   * Examples:
   *   why("why is the namespace dot-separated?")  → M3 lookup
   *   why("what breaks if I change IPluginManager.install?")  → M4 impact()
   *   why("IPluginManager")  → M1 describe()
   *   why("where did enforceCapabilityInvocation come from?")  → M2 why()
   *   why("what is VIVIM_PROVIDER_MUX_TIMEOUT_MS?")  → M37 get()
   */
  why(question: string): Promise<{
    readonly answer: string  // markdown
    readonly sources: readonly string[]   // the catalog entries that grounded the answer
  }>
  contractVersion: { major: 1; minor: 0 }
}
```

**Enforcement point:** the `why(question)` function is a **deterministic router** — it parses the question, classifies it into M1/M2/M3/M4/M37/M38, calls the appropriate catalog, and returns a markdown answer. The router's rules are themselves an `IdentityCard` (`kernel.catalog.why-router`). The kernel's answer cannot lie because the catalog is co-generated with the source.

**This is the user's hook.** A user types "why is the namespace dot-separated?" → the kernel returns a markdown answer with a link to `BOUNDARY-CONSTITUTION.md` and `REASSESSMENT.md Gap-13`. The user types "what breaks if I change IPluginManager.install?" → the kernel returns a markdown answer with the transitive closure of inbound consumers. The user types "IPluginManager" → the kernel returns the `IdentityCard` for `IPluginManager`.

---

## 3. The self-descriptive guarantees

| # | Guarantee | How it is enforced |
|---|---|---|
| **1** | **The M-layer is always correct** | The catalog is co-generated at boot from the same source the kernel boots from. A change to a contract file automatically updates the catalog on the next boot. No documentation pipeline. |
| **2** | **The M-layer is always complete** | `KERNEL-BOUNDARY-TESTS.md` test **T21** asserts that every export in `src/kernel/**`, `src/storage/contracts/**`, and the installed plugin manifests has an `IdentityCard`. Any artifact without one fails the build. |
| **3** | **The M-layer is always current** | Same as #1 — co-generation. The catalog cannot drift because it is regenerated every boot from the source. |
| **4** | **The M-layer is consistent** | The `RelationGraph` is built from the same import statements that the boundary tests use (test **T22** asserts that the M4 graph matches the boundary tests' import graph within a 1% tolerance for dynamic imports). |
| **5** | **The M-layer is honest** | The `IWhy.why()` function does not use an LLM. It uses deterministic text-matching. The answer cannot hallucinate because the catalog is generated from the source. |
| **6** | **The M-layer is queryable** | The `IWhy` capability is registered as `kernel.why` (per the dot-namespace convention). Any user (via CLI) or any plugin (via `ctx.capabilities.invoke('kernel.why', ...)`) can ask a question. |
| **7** | **The M-layer does not leak** | The M-layer is **K0** (kernel). It exposes only `IdentityCard`, `ProvenanceRecord`, `RationaleNote`, `RelationEdge`, `ConfigCard`, `EventCard` — no kernel internals, no secrets, no host internals. |
| **8** | **The M-layer is independent of the AI protocol** | The AI protocol (C-05) and the M-layer (C-33..C-39) are separate concerns. A plugin can use the AI protocol without ever touching the M-layer. The M-layer is for the *operator and the agent*, not for the *user-facing capability*. |

---

## 4. The M-layer is a kernel-level primitive

The M-layer is not a separate component. It is **part of the kernel's boot sequence**:

1. `bootKernel()` initializes the bus, the storage, the registry, the event bus, the catalog, the contracts, the runtime.
2. **Step 1.5: boot self-descriptive layer.** The kernel walks the source tree, the installed plugins' manifests, the ADRs, the constitution, the rationale catalog, and generates the M-layer.
3. `bootFirstPartyPlugins(manifests)` registers the first-party plugins.

The M-layer is the kernel's **reflection** — the kernel knows what it is. This is not a documentation system; it is a **runtime contract** that the kernel itself honors. The `IIdentityCatalog` is callable from any plugin; the kernel can be introspected at runtime by any user.

---

## 5. The M-layer's relationship to the cake

The plugin-builder cake (P0..P5) gets the M-layer for free:

- **P0 (introspect)** — the cake's P0 reads `IContractCatalog.list()`. Now it can also read `IIdentityCatalog.list()` to get *human-readable descriptions* of every contract. The codegen backend (rules + LLM) can show the user "here's what `IProviderAdapter` does" with a one-sentence summary.
- **P1 (codegen)** — the codegen can read the M-layer's `RelationGraph` to see "what does this contract depend on" and "what consumes it" — the codegen can choose the right imports.
- **P3 (certify)** — the certifier can read the M-layer to give a *better* failure message. "Permission `ui:custom-scripturl` required for `scriptUrl`" becomes "Permission `ui:custom-scripturl` required for `scriptUrl` because `SandboxPolicy.csp` (C-13) requires a non-default policy when `scriptUrl` is non-empty — see the rationale for C-13 in `inventory/PLUGIN-BUILDER-CAKE.md` §2."
- **P5 (authoring)** — the user-facing UI shows the M-layer as "?" tooltips on every contract, every capability, every configuration value. The user can click on "IProviderManager" and see its identity card, its provenance, its rationale, and its relation graph — all without leaving the UI.

The M-layer is what makes the cake **truly generative** instead of "yet another prompt-engineering tool."

---

## 6. The four laws of the M-layer

**Law 1 — Co-generation.** The M-layer is generated at boot from the same source the kernel boots from. It cannot drift.

**Law 2 — Honesty.** The M-layer never claims a property the kernel does not have. Every `IdentityCard.stability` is `experimental` until the kernel has been running in production for 90 days; every `RationaleNote.chosen` is the *actual* decision in the source; every `RelationEdge` is verified by static analysis.

**Law 3 — Self-application.** The M-layer applies to itself. `IIdentityCatalog` has an `IdentityCard`. The `RelationGraph` includes itself. The user can ask "what is the IIdentityCatalog?" and get a complete answer.

**Law 4 — Bounded cost.** The M-layer is computed once at boot and cached. Runtime queries are O(1) lookups against in-memory maps. The M-layer does not slow the kernel down.

---

## 7. The contract addition (forward-reference)

The new contracts **C-33..C-39** are added in **`KERNEL-CONTRACTS.md`** (the catalog table + the per-contract sections) and in **`PLUGIN-CONTRUST-MODEL.md`** (the M-tier — a sub-axis of K0). The migration plan adds **`P0-1.y`** (the self-descriptive phase). The arch tests add **T21..T24**. The I-2 probe spec adds **2 probes** (`probe-self-descriptive.ts` and `probe-relation-graph.ts`).

The implementation cost is small (each M-layer contract is a thin in-memory map populated at boot). The value is **enormous** — a future coding agent can navigate the kernel without grep archaeology; a user can ask "why" and get a grounded answer; an LLM can read the catalog and propose changes that respect the kernel's invariants.

---

## 8. What this changes for the existing artifacts

This is **additive**. It does not change the constitution, the contracts, the trust model, the plugin surface, the cake, or the migration plan. It adds:

- **C-33..C-39** in `KERNEL-CONTRACTS.md` (7 new contracts)
- **M-tier** in `PLUGIN-TRUST-MODEL.md` (the self-descriptive sub-axis of K0)
- **§0** in `KERNEL-CONTRACTS.md` — the new M-layer surface catalog
- **P0-1.y** in `BOUNDARY-MIGRATION-PLAN.md` — the self-descriptive phase (~5 small PRs, 1 sprint)
- **T21..T24** in `KERNEL-BOUNDARY-TESTS.md` — 4 new tests
- **2 probes** in `evidence/I-2-PROBE-SPEC.md` — `probe-self-descriptive.ts` + `probe-relation-graph.ts`
- **`inventory/SELF-DESCRIPTIVE.md`** — this file

**The success statement is unchanged** (and is now *testable via the M-layer* — a future agent can ask "is the success statement still true?" and get a grounded answer).

---

## 9. The single sentence

> **A self-descriptive kernel is one that can answer "what am I, where did I come from, why am I this way, and how do I fit" — for any of its subsystems, contracts, or plugins — without reading source code, without ambiguity, and without a separate documentation pipeline that can drift. The kernel's M-layer is the answer; the four laws are the discipline; `IWhy.why(question)` is the user-facing hook.**

The next file in the inventory is the per-contract update to `KERNEL-CONTRACTS.md` (C-33..C-39), then the trust-model M-tier, then the arch tests, then the migration phase.
