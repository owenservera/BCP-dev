# Vivim Boundary Constitution (v3)

> **The single architectural constitution a future coding agent can follow without this prompt.** It replaces the assumption-laden CORE / DEFAULT PLUGIN / GENERIC labels of the prior proposal with four levels grounded in the actual repository. The constitution is the **rule**; the rest of the artifacts (`PLUGIN-TRUST-MODEL.md`, `KERNEL-CONTRACTS.md`, `PLUGIN-CONTRACTS.md`, `BOUNDARY-MIGRATION-PLAN.md`, `AT-FORENSIC-VERDICT.md`) are the **proof, contracts, and execution** of the rule.

---

## 1. The success statement (must remain true in code, not just docs)

> **Vivim is a general-purpose local-first application kernel capable of hosting Vivim itself as a first-party plugin suite, while allowing third-party plugins to use the same stable contracts without modifying the kernel.**

If a proposed change makes that statement false, it is wrong.

---

## 2. Four levels, one dependency direction

```
KERNEL
   │   (thin, capability-gated interfaces — see KERNEL-CONTRACTS.md)
   ▼
FIRST-PARTY PLUGIN
   │   (Vivim product features built on the SAME kernel contracts available to external developers)
   ▼
GENERIC PLUGIN
   │   (third-party extensions, the same contracts, signed/manifested, narrower privilege)
   ▼
SANDBOXED COMPONENT
       (untrusted UI/code executed under iframe + QuickJS + allow-list, no kernel reach)
```

The arrow is the **only** direction. There is no VIVIM-only fast path. There is no "internal API" the kernel exposes to first-party plugins that it refuses to expose to generic plugins. If a generic plugin cannot implement an equivalent, the kernel is hiding something and the contract is incomplete.

---

## 3. Definition of each level

### 3.1 KERNEL — the trusted minimum substrate

KERNEL is the set of **mechanisms, contracts, security boundaries, and universal primitives** that the four lower systems need to function and that **cannot be meaningfully implemented in a first-party plugin without duplicating kernel state**.

It is **not** defined by what the product uses most. VIVIM-specific capability taxonomies (cap:conversation:send_message, cap:document:read, etc.) live in VIVIM first-party plugins, not in the kernel, because any plugin author writing a chat plugin needs those.

**What is in KERNEL** (exact, code-grounded):

| Subsystem | What it does | File evidence |
|---|---|---|
| Plugin host lifecycle | discover / certify / install / enable / disable / uninstall with integrity, atomicity, namespace enforcement | `src/ai/plugins/manager.ts`, `src/engines/plugin-system.ts`, `src/server/plugin-router.ts` (unification target) |
| Plugin context (IPluginContext) | The ONLY object a plugin may receive from the host: bus, scoped storage, schema register | **MISSING** — must be extracted from `IPluginManager` (see `MISSING KERNEL PRIMITIVES`) |
| Capability bus (V2) | Typed, envelope-shaped, DLQ-backed pub/sub | `src/engines/capability-event-bus-v2.ts:46` |
| Capability bus (V1) | Legacy flat pub/sub, preserved behind bridge for migration | `src/engines/capability-event-bus.ts:165` |
| Storage machinery | Prisma client, schema-versioning, dual-DB boundary (system/user), migration runner, integrity check, backup | `src/storage/`, `src/storage/migration/`, `prisma/schema.prisma`, `prisma/system/`, `prisma/user/` |
| Storage contracts | Pure interfaces — engines depend on these, never on impls | `src/storage/contracts/*` (40+) |
| Node registry | Universal record (Node + NodeVersion + NodeAlias + NodeEdge) with type validation | `src/schema/node.ts:207` (`SchemaRegistry`) |
| Schema registry | Runtime-mutable typed schema catalog with namespace enforcement | `src/schema/node.ts:207` |
| Sandbox runtime | QuickJS-WASM isolation; `vm` fallback is **privileged** and gated | `src/engines/sandbox-runner.ts`, `src/engines/sandbox-runner-quickjs.ts`, `src/engines/sandbox-runner-vm.ts` |
| Sandbox audit | Every isolated execution recorded for postmortem | `src/storage/contracts/sandbox-audit-store.ts` |
| Iframe sandbox (host-side enforcement) | Opaque-origin `<iframe sandbox="allow-scripts">`, CSP, `allowCapabilities` allow-list, `budgetMs` watchdog, inline `<script>` strip, MessageChannel bridge | `frontend/src/components/canvas/SandboxedNode.tsx:19` |
| Process boundary (Tauri) | OS-level isolation for native runtime, GPU ownership, OS resources; TypeScript never spawns processes directly | `src/ai/runtime/supervisor.ts:7` ("The TypeScript layer never spawns or kills OS processes directly") |
| Permission enforcement | Deny-by-default; permissions gate capabilities; enforcement is the only thing KERNEL owns in this area | (must extract from `src/ai/policy/policy.ts` `IPolicyEnforcer` — see BOUNDARY-MIGRATION-PLAN P0-2) |
| Identity primitive | Plugin ID, session ID, provider ID — branded types only | `src/ai/core/types.ts:42-49` (`RequestId`, `ProviderId`, `PluginId`, ...) |
| Audit / Provenance | Every load, every install, every uninstall, every cross-tier event, recorded | `src/engines/kernel/kernel-provenance.ts`, `src/storage/contracts/kernel-store.ts` (`KernelSpan`, `KernelProvenance`, `KernelEvent`) |
| Crypto primitives | AES-256-GCM, PBKDF2, sha256 message identity | `src/engines/encryption.ts:1`, `src/engines/db-encryption.ts:8`, `src/engines/message-identity.ts:7` |
| Capability **invocation protocol** (data plane) | The request/event shape that flows between caller and capability, including AI gateway data plane | `src/ai/core/types.ts:1` ("the most expensive file in the system to get wrong"), `src/ai/protocol/adapter.ts:14` ("the ONLY behavioral contract a provider integration implements") |
| Lifecycle orchestration | The phase pipeline that boots a kernel: seeds → stores → knowledge → capabilities → lifecycle | `src/server/bootstrap/orchestrator.ts:15` |

**What is NOT in KERNEL** (despite current placement):

- `CapabilityTaxonomyV2` and the 60-entry `CAPABILITY_TAXONOMY_V2` array in `src/engines/capability-taxonomy.ts:25` — **VIVIM-specific taxonomy**, not kernel; should move to first-party plugin
- `UnifiedCapabilityRegistry` itself (`src/engines/unified-registry.ts:31`) — its shape is kernel, but the 90+ `build*Caps` builders and `cap:conversation:send_message` registrations are first-party product definitions
- `NLCLEngine` (`src/engines/nlcl/nlcl-engine.ts:11`) — VIVIM's natural language command layer, not a kernel mechanism
- `CapabilityResolutionEngine`, `CapabilityEventBus` V1, `ConversationManager`, `MemoryEngine`, `KnowledgeExtractor`, `WorkflowEngine`, `AgentBuilderEngine`, `ContextAssemblyEngine`, `ProviderHealthKernel`, `ProviderRegistrar`, all `Harness*` — these are **VIVIM first-party implementations** of contracts the kernel provides
- Any data model specific to a domain (Conversation, Memory, DiscordVoiceState, NotionPageMeta, WorkflowDefinition, etc.) — these are first-party domain objects living in first-party storage; the kernel owns the storage machinery that persists them, not the data shapes themselves
- All 19 `Prisma` models under `prisma/system/` and `prisma/user/` are **NOT** automatically kernel — see FALSE CORE CANDIDATES §1
- `frontend/src/components/canvas/InfiniteCanvas.tsx`, `LivingCanvas.tsx`, `CanvasSurface.tsx` — first-party UI plugins, not kernel; kernel UI is the slot system and the `SandboxedNode` host

### 3.2 FIRST-PARTY PLUGIN — VIVIM's own product, on the same contracts as third parties

A first-party plugin implements VIVIM's user-visible features. It uses the **same `IPluginContext`, same `IProviderAdapter`, same `NodeStoreContract`, same `IProviderRegistry`, same `IModelRegistry`, same `IExecutionManager`, same `IRouter`, same `IPolicyEvaluator`** that an external developer would use.

**It is not privileged to import kernel internals or to bypass sandbox enforcement.** A `VIVIM:` prefix in package names or in ownership has no architectural meaning. If a change requires VIVIM to reach past the kernel contract, the contract is wrong.

First-party plugins ship with the product, are trusted to run inside the host process (not sandboxed), and can be disabled without breaking boot. They are **not** required to be present for a kernel boot.

Concrete examples (VIVIM-as-its-own-plugin):

- `plugin:chat` — `ConversationManager`, `CapabilityResolutionEngine`, `StreamParserEngine`, conversation UI, models → uses kernel contracts for `ProviderAdapter`, `IProviderRegistry`, `NodeStoreContract`
- `plugin:memory` — `MemoryEngine`, `EpisodicMemoryStoreImpl`, `KnowledgeExtractor`, embeddings, FSRS → uses kernel contracts for `NodeStoreContract`, `IEventBus`, plugin storage namespace
- `plugin:knowledge` — knowledge extraction, content units, semantic search, embeddings → first-party
- `plugin:providers-browser` — `ChromeGovernor`, `SelectorHealer`, `Stealth*`, browser profile allocation → first-party, uses `IRuntimeSupervisor` for OS process ownership
- `plugin:providers-api` — `OpenAICompatibleAdapter`, `provider-protocol-generator`, `ProviderRegistrar` → first-party, manifest-driven
- `plugin:workflows` — `WorkflowEngine`, `AutomationOrchestrator` → first-party
- `plugin:agents` — `AgentBuilderEngine`, `AutonomousExecutionEngine`, `LocalAgentProvider`, `OpenCodeExecutor` → first-party
- `plugin:canon-nlcl` — `NLCLEngine`, intent resolvers, command executors → first-party
- `plugin:kernel-observability` — `KernelRegistry`, `KernelTracer`, `Oracle*` engines → first-party, observability
- `plugin:canon-harness` — `HarnessExecutorEngine`, `HarnessCommandRegistry`, `HarnessRepairEngine` → first-party, gated by `chrome:control` shared trust tier
- `plugin:ui-canvas` — `InfiniteCanvas`, `LivingCanvas`, `CanvasSurface`, `CanvasNode`, `ConnectionLayer`, `LivingCanvas` (frontend) → first-party UI plugin
- `plugin:ui-shell` — `MainMenu`, `Brand`, `CommandPalette`, `NotificationsCenter`, `OnboardingTour` → first-party UI plugin
- `plugin:ui-panels` — `AuditDashboard`, `RbacManager`, `TemplatesGallery`, `HealthDashboard` → first-party UI plugin
- `plugin:ui-cards` — `DocCard`, `MediaCard`, `AutomationCard`, `AgentCard`, `ShellCard` → first-party UI plugin

### 3.3 GENERIC PLUGIN — third-party extensions, same contracts, narrower privilege

Implements the same `IPluginContext`, `IProviderAdapter`, `IModelRegistry`, `IProviderRegistry`, `INode*` contracts. Loaded via `IPluginManager.install(PluginPackageRef)`, integrity-verified, certified, namespaced.

Examples a third-party should be able to ship:

- `plugin:discord` — `kind:'browser-provider'` + `kind:'api-protocol'` Discord integration (today in `seeds/providers/discord.json`, should migrate to plugin path)
- `plugin:notion-enhanced` — domain NodeTypes + a `kind:'api-protocol'` Notion integration
- `plugin:acme-archiver` — custom NodeType, scoped storage, event subscription, no browser, no model
- `plugin:custom-summarizer` — wraps a new LLM protocol adapter

### 3.4 SANDBOXED COMPONENT — untrusted UI/code

Anything running in `SandboxedNode` (host iframe), in `SandboxRunner` (QuickJS-WASM), or in a third-party plugin's UI code that crosses into a render frame:

- Iframe with `sandbox="allow-scripts"` and **no** `allow-same-origin` (opaque origin, `SandboxedNode.tsx:268`)
- CSP via `<meta http-equiv="Content-Security-Policy">` (`SandboxedNode.tsx:157`)
- `allowInlineScript:false` type-level + Zod + render-time triple-gate (`SandboxedNode.tsx:73` — P8 invariant)
- `<script>` body stripped at render (`SandboxedNode.tsx:153`)
- `MessageChannel` only communication (`SandboxedNode.tsx:220`)
- `allowCapabilities` allow-list enforced host-side (`SandboxedNode.tsx:103` — S92)
- `budgetMs` watchdog (`SandboxedNode.tsx:240` — S93)
- QuickJS-WASM via `SandboxRunner` (no shared host heap, no native addon reach)

A plugin may run inside the sandbox or in the host process. The same plugin author may ship both. The kernel enforces; the plugin author decides what crosses the boundary.

---

## 4. Six constitutional rules (the law)

### Rule A — Minimum kernel

KERNEL may only contain things required to:
- boot the platform (a valid kernel must boot with NO first-party plugin installed)
- establish identity (plugin ID, session ID, provider ID — branded types)
- establish namespaces (the storage machinery + the IPluginContext isolation)
- load/version/certify/install/validate plugins (`IPluginManager`)
- enforce permissions (deny-by-default permission checks, NOT policy content)
- isolate untrusted execution (QuickJS + iframe + MessageChannel + CSP)
- provide secure capability invocation (the data-plane `IProviderAdapter` and `IExecutionManager` contracts)
- provide universal storage primitives (Prisma, schema-versioning, contract/impl split, migration runner)
- provide event/message primitives (V2 + V1 bridge)
- provide lifecycle primitives (`BootstrapContext`, phase pipeline, graceful stop)
- provide integrity / provenance / audit primitives (`KernelProvenance`, `KernelSpan`, `KernelEvent`, sandbox audit)
- provide migration/version compatibility primitives (`SchemaMeta`, `ManifestDrift`, `BindingStatusLog`)
- execute trusted runtime mechanisms (Tauri supervisor interface; `IRuntimeSupervisor`)
- expose stable contracts to plugins

If a subsystem fails Rule F's "boot-without-it" test, it is not kernel.

### Rule B — Mechanism vs product

Every subsystem is split into:

```
CORE MECHANISM         ← KERNEL
PRODUCT IMPLEMENTATION ← FIRST-PARTY PLUGIN
PRODUCT DATA           ← FIRST-PARTY PLUGIN storage
PLUGIN CONTRACT        ← KERNEL (interface) / FIRST-PARTY PLUGIN (its concrete implementations)
```

A single file that mixes mechanism + implementation is a **splitting candidate** (see `AT-FORENSIC-VERDICT.md` "Top 20 changes"). The fact that something is important to VIVIM does not make it kernel.

### Rule C — VIVIM must eat its own dog food

VIVIM's own features must use the same plugin interfaces available to external developers. **There is no "special secret path for VIVIM."** Where VIVIM uses something third parties cannot, the gap is recorded in `MISSING KERNEL PRIMITIVES` and fixed in P0/P1 of the migration plan.

Examples that must hold after migration:
- VIVIM's own `Chat` is `plugin:chat` (a first-party plugin) using `IProviderAdapter` and `IProviderRegistry`
- VIVIM's own `Memory` is `plugin:memory` using `NodeStoreContract` + the same Node registry as everyone else
- VIVIM's own `Canvas` is `plugin:ui-canvas` using `UniversalComponentRegistry` + the same slot system
- VIVIM's own `Workflow` is `plugin:workflows` using the same harness/runtime contract as third parties
- VIVIM's own `Harness commands` (today `harness-command-registry.ts:54`) live in `plugin:canon-harness`, exposed via the same DAC-prefixed harness registry that plugins use (after P0-3)

### Rule D — Security is CORE, policy is not

KERNEL may own:
- permission boundaries (deny-by-default checks)
- sandboxing (QuickJS, iframe, CSP, allow-list)
- capability checks (whether a caller MAY call)
- integrity verification (sha256 of plugin archive, manifest signature)
- audit guarantees (every install/uninstall/load/emit recorded)
- resource budgets (CPU, memory, time)

KERNEL must NOT own:
- which actions require approval (`P0PolicyEngine`, `ConsentEngine`, `ExecutionPolicyEngine` — all product policy, move to first-party)
- which providers are preferred (`ProviderMuxEngine` — product routing, move to first-party)
- which workflows are trusted (product policy)
- which stealth rules VIVIM uses (product policy, browser-automation plugin)
- which UI panels exist or how they look (product UI)

The split: the kernel **enforces** the policy that the policy engine **evaluated**. Both are real; only the enforcer is kernel.

### Rule E — Universal primitives vs domain vocabulary

KERNEL may own:

- `Node`, `NodeVersion`, `NodeAlias`, `NodeEdge` (universal record)
- `SchemaRegistry` (universal typed schema)
- `Capability` (universal invocation)
- `CapabilityBinding` (universal binding shape)
- `Identity`, `Event`, `Session`, `StorageNamespace` (universal identifiers)
- `Provenance`, `AuditEvent` (universal observability)
- `MessageChannel` host, `SandboxRunner` host (universal isolation)

KERNEL does NOT own (today's `prisma/system` and `prisma/user` tables are misattributed):

- `Conversation`, `ConversationMessage`, `StreamBlock` (chat is VIVIM)
- `EpisodicMemory`, `SemanticMemory`, `ProceduralRule`, `MemoryEmbedding` (memory is VIVIM)
- `Node` is universal; `Memory` is not. A generic Node-based memory plugin exists; VIVIM's particular `EpisodicMemory` engine is first-party
- `Entity`, `EntityMention`, `EntityContainer`, `Topic`, `Project`, `DecisionRecord` (domain objects)
- `DiscordVoiceState`, `NotionPageMeta`, `SlackChannelMeta`, `WhatsAppEncryptionMeta`, etc. (provider-specific — these are especially egregious; see FALSE CORE CANDIDATES)
- `McpTool`, `McpToolCall`, `McpServerConfig` (MCP is a transport; not kernel)
- `WorkflowDefinition`, `WorkflowNode`, `WorkflowEdge`, `AutomationSchedule` (workflow is VIVIM)
- `PolicyRule`, `AutonomousTask`, `HitlGate`, `TaskTemplate` (autonomy policy is VIVIM)
- `DiscordVoiceState` (VIVIM-specific Discord integration) — REGRESSION, not kernel
- `CapabilityShape`, `ProviderArchetype`, `WebAppTaxonomy` (taxonomy for first-party; third-party plugins do not need VIVIM's shape model)

**The data model IS the domain vocabulary.** Prisma is kernel machinery; the schemas in `prisma/system/*.prisma` and `prisma/user/*.prisma` are overwhelmingly first-party. The 200-table count is a smokescreen; the actual kernel data model is ~10–15 tables (see "Final minimal kernel" in `AT-FORENSIC-VERDICT.md`).

### Rule F — Removing first-party plugins

The kernel boot test:

> If ALL VIVIM first-party plugins were removed, would a valid kernel still boot, discover plugins, validate them, and install/run them safely?

If **no** → CORE is too large. Today this test **fails** for the proposed CORE; after migration P0–P2 it passes (see `AT-FORENSIC-VERDICT.md` "Architectural risk").

---

## 5. What can cross each boundary

| From → To | What may cross | What must not |
|---|---|---|
| KERNEL → FIRST-PARTY | Stable contracts (interfaces, branded types) | Engine implementations, VIVIM taxonomy, VIVIM-specific models |
| FIRST-PARTY → KERNEL | Calls to stable contracts | Reaching past the contract; importing `engines/*` to read internals; calling `globalThis.__pluginManager`; lazy `require()` to break circular deps |
| GENERIC → FIRST-PARTY | The same stable contracts the FIRST-PARTY uses | Reaching into FIRST-PARTY internals; importing FIRST-PARTY files |
| KERNEL → GENERIC | Plugin host, certifier, namespace enforcer, capability invocation protocol | The ability to define domain objects the kernel doesn't own (a third-party plugin can't put a `NotionPageMeta` into kernel) |
| GENERIC → SANDBOXED | Pluggable UI through `SandboxedNode` (the plugin supplies html/css, optionally `scriptUrl` from kernel-controlled origin) | The plugin may NOT ship compiled React bundles; `allowInlineScript` is `false`; CSP applies |
| SANDBOXED → GENERIC | `__vivim.requestCapability()` over `MessageChannel`, audited | Reading the parent DOM, calling arbitrary host APIs |
| KERNEL → SANDBOXED | Capability invocation **only** via the `allowCapabilities` allow-list; every call audited | Any other channel; the iframe must never see host internals |

## 6. Compatibility guarantee for plugins

A plugin compiled against a kernel contract version is forward-compatible with newer kernel minors until the major version of that contract moves.

`src/ai/core/types.ts:18` already does this for AI protocol (`VIVIM_AI_PROTOCOL = { major: 1, minor: 1, version: '1.1' }`). The plugin host's own contract version (`IPluginContext`'s implied version) and the sandbox contract version (`SandboxPolicy` shape) need the same treatment (see `MISSING KERNEL PRIMITIVES` §2).

**What this means in practice:**

- A v1 plugin (certified against `plugin-host-contracts@1.x`) loads on a kernel exposing `plugin-host-contracts@1.0` through `1.N`.
- A v1 plugin does **not** load on `plugin-host-contracts@2.0` — a major version bump is a breaking change, and the certifier is the gate.
- The kernel may add a v2 capability in a v1 minor release; v1 plugins ignore it.

---

## 7. Authority and amendment

- This constitution is the highest-authority architectural document in the project. It is referenced from `00-README.md` and overrides any prior proposal that conflicts with it.
- Amending this file requires updating `AT-FORENSIC-VERDICT.md` "Top 20 changes" if any boundary change is made.
- Any code change that conflicts with a rule here is a P0 defect; the PR is rejected regardless of CI status.

---

*This constitution is the law. The migration plan is the work.*
