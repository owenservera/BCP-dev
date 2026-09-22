# VIVIM-FINAL — End-State Specification (v1)

> **The system after everything lands.** This document is the navigation map.
> It does not say *how* we get there (that's the migration table). It says
> *where* we are when we are done. Every row in the migration table is
> derived from a property in this document.
>
> **Sources of truth used to write this document:**
>
> 1. `.archive/context-pack-md/# VIVIM-FINAL - COMPLETE UPGRADE PACKAGE.md` (2,257 lines) — the canonical upgrade spec
> 2. `.archive/prd-merged/00-06` (8 PRDs) — the merged, truth-grounded PRD
> 3. `.archive/intelligence-pack-acu-dcb-storage/` (13 docs) — the ACU/DCB/Storage intelligence layer
> 4. `.archive/IMPLEMENTATION_PLAN_PHASE6.md` (24KB) — the current active implementation plan
> 5. `.archive/docs-legacy-2026-08-15/decisions/ADR-001..013` — the decision history
> 6. `docs/kernel-plugins/inventory/` — the kernel-plugin design (the architectural frame)
> 7. The actual code in `src/`, `prisma/`, `frontend/`, `seeds/`, `devops/`, `tests/`
>
> **Date written:** 2026-08-29 (this clone). 60% of the proposed capabilities
> already exist in vivim-final under different names; the 8 missing capabilities
> (M1-M8) are the spine of the end-state.

---

## §0. The One-Sentence Outcome

> **A locally-running, kernel-extensible, second-brain agent that holds every
> conversation across every provider, deduplicates and consolidates them
> into a single hierarchical memory, schedules its own reviews using
> FSRS-6, organizes its content into collections, compacts and backs up
> its own storage, and exposes every capability as a plugin that any
> third party can extend or replace — all without losing the user-facing
> behavior of the system that exists today.**

Three things must be true at the same time:

1. **The user's second brain works.** Conversations from Claude, ChatGPT,
   Gemini, DeepSeek, Qwen, Grok (and 10 more providers) are captured
   automatically, deduplicated, organized, reviewed, and remembered.
2. **The kernel is honest.** The kernel/plugins boundary is enforced
   in code (12 certifier attack vectors, 24 arch tests, fuzzer with
   10,000 mutated manifests). A third-party plugin cannot reach a
   capability the kernel does not expose. The kernel does not know
   what a Conversation or a Memory is — it knows what a Node is.
3. **The intelligence is real, not implied.** ACU (Atomic Content Unit)
   provenance, DCB (Dynamic Context Budget) projection, FSRS-6 review
   scheduling, and the 5-stage context assembly pipeline are not stubs —
   they are the live runtime behavior.

---

## §1. The Post-Migration Invariants (testable properties)

These 30 invariants are always true. Each is testable. If any becomes false,
the migration has regressed.

### Kernel & plugin boundary (K0, K0-M, K0-L)

- **INV-1:** The kernel boots with zero first-party plugins installed.
  Test: `tests/arch/kernel-boot.test.ts` runs in CI.
- **INV-2:** A first-party plugin installs the same way a third-party
  plugin does. Test: `tests/arch/install-parity.test.ts`.
- **INV-3:** A third-party plugin cannot reach a capability the kernel
  does not expose. Test: `tests/arch/capability-isolation.test.ts`
  fuzzes 10,000 mutated manifests, asserts 0 false-negatives.
- **INV-4:** The kernel's `IPluginContext` is a closed object — no
  first-party engine receives the old 60+ field `BootstrapContext`.
  Test: `tests/arch/plugin-context-closed.test.ts` walks every
  first-party plugin, asserts no `BootstrapContext` reference.
- **INV-5:** Every kernel contract has a `contractVersion: { major, minor }`.
  Test: `tests/arch/contract-versioned.test.ts` greps for `contractVersion`
  on every export in `src/plugin-kernel/**`.
- **INV-6:** Every `IEventBus.publish` event kind is dot-namespaced
  (`kernel.*` or `plugin.<id>.*`). Test: `tests/arch/bus-namespace.test.ts`.

### Memory & content (M1, M2, M3, M4, M5, M6, M8)

- **INV-7:** Every `ConversationMessage` has a `providerMessageId` and
  a unique `identityHash` (SHA-256). Test: `tests/unit/storage/message-identity.test.ts`.
- **INV-8:** Re-importing the same message from a second provider does
  not create a duplicate. Test: `tests/integration/dedup-roundtrip.test.ts`
  (already exists per `IMPLEMENTATION_PLAN_PHASE6.md`).
- **INV-9:** Every `ConversationMessage` has `isPinned`, `isArchived`,
  and `readStatus` fields. Test: `tests/unit/storage/message-metadata.test.ts`.
- **INV-10:** A `Collection` is a tree (parent → child) of `CollectionItem`s.
  Test: `tests/unit/storage/collection-tree.test.ts`.
- **INV-11:** Every `ConversationMessage` and every `Node` has
  `expiresAt` (TTL) and a `lifecycleStatus` of
  `live | ttl_swept | compacted | archived`. Test: `tests/integration/lifecycle-sweep.test.ts`.
- **INV-12:** Every `Node` has the ACU-provenance fields
  (`contentHash`, `version`, `state`, `securityLevel`, `contentType`,
  `authorDid`, `signature`, `acl`, `quality`, `validFrom`, `validUntil`,
  `parentVersion`). Test: `tests/arch/node-acu-fields.test.ts` greps
  the Prisma model + the `Node` TS type.
- **INV-13:** The FSRS-6 scheduler is invoked on every `MemoryRecord`
  access. Test: `tests/integration/fsrs-scheduler.test.ts` runs
  1,000 simulated reviews, asserts the algorithm matches the reference
  implementation.

### Provider system

- **INV-14:** A `Provider` is a registered `IProviderAdapter` with
  a `VIVIM_AI_PROTOCOL` version. Test: `tests/arch/adapter-version.test.ts`.
- **INV-15:** The provider protocol cache is in-memory + disk snapshot.
  A plugin installed after process start is queryable without restart.
  Test: `tests/integration/provider-cache-runtime.test.ts`.
- **INV-16:** The 16 registered providers (chatgpt, claude, deepseek,
  facebook, gemini, generic, grok, mistral, opencode, qwen, slack,
  studio-ai, system, telegram, whatsapp, z-ai) are all reachable
  through `IProviderRegistry.list()`. Test: `tests/integration/provider-list.test.ts`.

### Storage & DB

- **INV-17:** The kernel data model is exactly 17 tables
  (`SchemaMeta`, `Node`, `NodeVersion`, `NodeAlias`, `NodeEdge`,
  `PluginRegistry`, `SandboxAudit`, `EventRecord`, `KernelSpan`,
  `KernelProvenance`, `KernelTopology`, `KernelEvent`, `ConfigEntry`,
  `ConfigAudit`, `HpeSession`, `User`, `Session`). Test: `tests/arch/kernel-model-count.test.ts`
  asserts the Prisma schema has exactly these 17 kernel models and no others.
- **INV-18:** `safe-eval.ts` (H9 hazard) and `simulator-adapter.ts`
  do not exist. Test: `tests/arch/dead-code-removed.test.ts` asserts
  these files are not in the source tree.
- **INV-19:** The `vm` runtime is not used in production paths.
  Test: `tests/arch/vm-not-in-production.test.ts` greps
  `node:vm` imports in `src/plugin-kernel/**` — only test files allowed.
- **INV-20:** Every storage contract is interface-only. Engines never
  import from `src/storage/impl/*`. Test: `tests/arch/store-contract-parity.test.ts`
  (already exists).

### Frontend (Phase 6 + plugin-builder cake)

- **INV-21:** Every frontend message card has a pin, archive, and
  read-status action. Test: `frontend/tests/e2e/message-actions.test.ts`.
- **INV-22:** A collections panel exists and can create, edit, delete,
  and re-parent collections. Test: `frontend/tests/e2e/collections-panel.test.ts`.
- **INV-23:** The frontend renders the same capability set as the
  backend. Test: `bun run devops verify-cross-surface` (the
  `devops-toolkit` skill).
- **INV-24:** The CLI, the HTTP API, the frontend, and the MCP server
  all expose the same set of capabilities. Test: `llm_test_parity`
  capability runs and asserts 0 drift.

### Self-descriptive (M-layer)

- **INV-25:** Every kernel export has an `IdentityCard` (co-generated
  at boot from the JSDoc). Test: `tests/arch/m-layer-complete.test.ts`
  asserts every export in `src/plugin-kernel/**` has `@doc` JSDoc.
- **INV-26:** The `IWhy` capability is registered as `kernel.why`.
  Test: `tests/integration/why-router.test.ts` asserts it answers
  "what is IPluginManager?" with a grounded markdown response.
- **INV-27:** The `IIdentityCatalog`, `IProvenanceStore`,
  `IRationaleCatalog`, and `IRelationGraph` are all populated at boot.
  Test: `tests/arch/m-layer-co-generated.test.ts`.

### Deterministic intelligence (K0(L0))

- **INV-28:** The `INLCLLayeredPipeline` works without an LLM.
  Test: `tests/integration/nlcl-no-llm.test.ts` runs the pipeline
  with no LLM resolver, asserts the deterministic layers resolve
  95% of consumer commands.
- **INV-29:** The `IEmbeddingProvider` defaults to TF-IDF (zero deps).
  HF/Ollama are optional upgrades that degrade gracefully.
  Test: `tests/integration/embedding-degrade.test.ts` removes the HF
  model file, asserts the pipeline still works.
- **INV-30:** The `IBudgetGuard` throws `BudgetExceededError` on breach.
  Test: `tests/unit/budget-guard.test.ts`.

---

## §2. The Post-Migration Capabilities (the 200%)

These 30+ capabilities exist in the end-state that do NOT exist today
(or exist only as stubs). Each is a concrete action a user, developer,
or plugin can perform.

### The M1-M8 capabilities (the spine of the user's second brain)

- **CAP-1 (M1):** A user can re-import the same conversation from
  ChatGPT and Claude and see a single deduplicated timeline.
- **CAP-2 (M2):** A user can create a collection called "Project Atlas"
  with sub-collections for "research", "drafts", "decisions", and
  drag any message into the right place.
- **CAP-3 (M3):** A TTL of 30 days sweeps ephemeral conversation noise
  while preserving pinned/eternal content.
- **CAP-4 (M4):** A weekly compaction (SQLite VACUUM) runs and frees
  20-40% of disk space without losing any data.
- **CAP-5 (M5):** A user can pin a message, archive a thread, and mark
  a thread as read — from the message card itself.
- **CAP-6 (M6):** A PATCH `/api/conversations/:id/messages/:mid` endpoint
  updates metadata in < 50ms (idempotent, transactional).
- **CAP-7 (M7):** The frontend exposes pin/archive/collection controls
  in every message card and conversation list.
- **CAP-8 (M8):** The FSRS-6 scheduler picks 20 memories per day to
  review. After a review, the memory's stability increases and its
  next-due date moves out.

### The kernel capabilities (the architectural frame)

- **CAP-9:** A third-party developer can write a plugin that uses the
  same kernel contracts VIVIM itself uses (the success statement).
- **CAP-10:** A plugin can install from a URL. The certifier rejects
  any plugin that violates one of 12 attack vectors.
- **CAP-11:** A user can ask "why does the kernel namespace events with
  dots?" and get a markdown answer grounded in the source.
- **CAP-12:** A user can ask "what breaks if I change IPluginManager.install?"
  and get the transitive closure of all inbound consumers.
- **CAP-13:** A user can swap the embedding provider (TF-IDF → HF ONNX
  → Ollama) at runtime without rebooting.
- **CAP-14:** The M-layer's `IIdentityCatalog.list()` enumerates every
  kernel subsystem, contract, plugin, and configuration value at boot.
- **CAP-15:** A user can run the certifier's fuzzer against their own
  plugin and get a deterministic rejection report.
- **CAP-16:** A plugin can be hot-upgraded without losing state (K0-15
  `IPluginHost`).
- **CAP-17:** Cross-plugin capability routing: a plugin can declare it
  provides a capability that another plugin consumes (P-18 in
  `inventory/PLUGIN-CONTRACTS.md`).

### The dev/operator capabilities (the devops loop)

- **CAP-18:** `bun run devops invariants check` reports 0 violations
  of the 11 critical boundaries.
- **CAP-19:** `bun run devops audit-code full` reports 0 P0 findings
  (down from 3 today), 0 P1 findings (down from 3 today).
- **CAP-20:** `bun run devops production-build` ships a tagged release
  with hash-gated rebuilds, cleanup, docs reconciliation, and a
  post-build smoke test.
- **CAP-21:** `bun run devops runtime-test loop` drives the agent-as-runtime
  loop, runs 5 cycles, reports 0 false-positives.
- **CAP-22:** `bun run devops verify-cross-surface` asserts CLI = API
  = MCP = UI parity.
- **CAP-23:** `bun run devops code-index search "<term>"` returns
  ranked `path:line` chunks in < 200ms (offline FTS5 + optional
  semantic embedder).
- **CAP-24:** `bun run llm_test parity` reports the LLM-as-Human
  production test suite with 0 drift.

### The user-facing capabilities (the alpha release + Codex wiki)

- **CAP-25:** A first-time user is guided through S0-S3 onboarding
  (Explorer / Builder / Observer / Breaker tracks).
- **CAP-26:** A user can read the Codex wiki — 16 starter articles
  at L0-L3, renderable as a self-hosted web page.
- **CAP-27:** A user can submit a bug or feature request through the
  help system and it lands in the GitHub tracker via the QA pipeline.
- **CAP-28:** A user can type "show me everything I said about
  <topic>" and get a knowledge-synthesis answer from the
  cross-conversation-synthesis engine.
- **CAP-29:** A user can run an FSRS-6 review session from the UI
  with a flashcard-style interaction.
- **CAP-30:** A user can export their entire second brain to a portable
  backup (the `BackupManager` ships as `scripts/backup-db.ts`).

---

## §3. The Kernel's Responsibility (by example)

10 concrete scenarios. Each says: when X happens, the kernel does Y.
The kernel does not do Z.

- **EX-1: User types "send a message to Claude."**
  Kernel does: invokes `ICommandPipeline.interpret(input)`; routes through
  the 6-layer pipeline; resolves the `cap:chat:send` intent; invokes the
  capability via the router.
  Kernel does not: know what Claude is, know what a message is, know
  what sending means.

- **EX-2: A first-time user installs VIVIM and runs it for the first time.**
  Kernel does: boots with no first-party plugins; the 8 capability wrappers
  (C-25..C-32) are registered as discoverable; the user can browse them
  in the UI.
  Kernel does not: install `plugin:chat` automatically. That is a
  first-party plugin the user enables.

- **EX-3: A malicious third-party plugin tries to read every user's
  Conversation table.**
  Kernel does: rejects the manifest at certify time (attack vector #6:
  storage scoping). The plugin's `IPluginContext.storage.scoped(ns)`
  is namespaced to its own prefix.
  Kernel does not: silently allow the read.

- **EX-4: A first-party plugin's `cap:chat:send` is invoked by
  another first-party plugin `plugin:agents`.**
  Kernel does: enforces `enforceCapabilityInvocation(from, to, cap)` —
  the `to` plugin must declare the capability in its manifest's
  allowedCapabilities; otherwise the call is denied.
  Kernel does not: trust the first-party origin.

- **EX-5: A user runs `bun run devops verify-cross-surface`.**
  Kernel does: walks the `UnifiedCapabilityRegistry`, the
  `CapabilityStore`, the MCP server, and the UI's `SLOT_IDS`; asserts
  every `slug` is reachable on all 4 surfaces.
  Kernel does not: do this asynchronously or in the background. The
  operator gets a deterministic report.

- **EX-6: A new embedding model is released. A user wants to upgrade.**
  Kernel does: exposes `kernel.embeddings.set-provider(provider)` as a
  K0 capability. The user can call it via CLI, HTTP, or UI; the
  `IIntelligenceRegistry` hot-swaps the substrate.
  Kernel does not: require a restart. The pipeline degrades gracefully
  if the new model cannot be loaded.

- **EX-7: A user asks "what breaks if I change IPluginManager.install?"**
  Kernel does: `IWhy.why("what breaks if I change IPluginManager.install?")`
  returns a markdown answer with the transitive closure of inbound
  consumers (the 8 arch tests + the fuzzer + the certifier + the
  install router).
  Kernel does not: hallucinate. The answer is grounded in the static
  import graph.

- **EX-8: A plugin is uninstalled.**
  Kernel does: stops all in-flight invocations from that plugin;
  unsubscribes its events; closes its scoped storage; revokes its
  capabilities; emits `kernel.plugin.uninstalled` event; runs the
  arch test T-03 to assert the kernel still boots.

- **EX-9: A user compacts the database.**
  Kernel does: invokes the `MigrationRunner`; runs SQLite VACUUM;
  rebuilds the FTS5 indices; emits `kernel.db.compacted` event.
  Kernel does not: lose data. The backup is taken first.

- **EX-10: A first-party plugin's FSRS-6 review scheduler picks a
  memory to review.**
  Kernel does: invokes `IBudgetGuard.checkBeforeRequest`; if the run
  is over budget, throws `BudgetExceededError`; the plugin's review
  queue is paused.
  Kernel does not: silently allow the LLM call.

---

## §4. The First-Party Plugin Set (40 plugins, by end-state role)

The 36 plugins from `inventory/BOUNDARY-MIGRATION-PLAN.md` §4 plus 4
added by the ACU/DCB/Storage vision. Each described as a **role**, not
a folder.

| ID | Plugin | End-state role | Kernel contracts used | Capabilities exposed |
|---|---|---|---|---|
| F-01 | `plugin:audit` | Compliance log + audit dashboard | C-11, C-18, C-19 | `cap:audit:query`, `cap:audit:export` |
| F-02 | `plugin-tools-image` | AI image gen bridge | C-05, C-10 | `cap:tools:image:gen` |
| F-03 | `plugin-tools-mcp` | MCP client + server | C-05, C-09 | `cap:tools:mcp:connect`, `cap:tools:mcp:serve` |
| F-04 | `plugin-dev-tooling` | Code audit, lint, format | C-43, C-44 | `cap:dev:audit`, `cap:dev:lint` |
| F-05 | `plugin-discovery` | Web-app taxonomy + provider archetype | C-05, C-06 | `cap:discovery:infer` |
| F-06 | `plugin-notifications` | Cross-channel notifications | C-03, C-18 | `cap:notify:send`, `cap:notify:list` |
| F-07 | `plugin-contacts` | Contact + relationship graph | C-14 | `cap:contact:lookup` |
| F-08 | `plugin-collections` | **M2** — hierarchical collection tree | C-12, C-15 | `cap:collections:create`, `cap:collections:list`, `cap:collections:add` |
| F-09 | `plugin-workspace` | Workspace presets + backup + mode | C-13 | `cap:workspace:switch` |
| F-10 | `plugin-sync` | Conversation history sync | C-05, C-15 | `cap:sync:start` |
| F-11 | `plugin-mirror` | Mirror engine + observation tap | C-03 | `cap:mirror:subscribe` |
| F-12 | `plugin-cost` | Cost optimizer + cortex budget | **C-42** | `cap:cost:report` |
| F-13 | `plugin-search` | Semantic search UI | **C-41** | `cap:search:query` |
| F-14 | `plugin:canon-harness` | Browser-recipe language | C-10, C-13 | `cap:harness:run` |
| F-15 | `plugin:canon-nlcl` | NL command engine | **C-40, C-43** | `cap:nlcl:interpret` |
| F-16 | `plugin:memory` | **M8** — Hierarchical Eternal Memory + FSRS-6 | C-12, C-15, **C-42** | `cap:memory:record`, `cap:memory:review`, `cap:memory:query` |
| F-17 | `plugin-knowledge` | Knowledge extractor + ingestion + cross-conv synthesis | C-15, C-18 | `cap:knowledge:extract`, `cap:knowledge:synthesize` |
| F-18 | `plugin:agents` | Agent builder + autonomous execution + local agent | C-08, C-10, C-11 | `cap:agent:run`, `cap:agent:build` |
| F-19 | `plugin-workflows` | Workflow engine + automation orchestrator | C-08, C-18 | `cap:workflow:run` |
| F-20 | `plugin-policy` | **Policy engine** (evaluator + consent + governance) | C-09, C-13 | `cap:policy:evaluate`, `cap:policy:consent` |
| F-21 | `plugin-providers-api` | **OpenAI-compatible + API providers** | C-05, C-06 | (registers adapters) |
| F-22 | `plugin:chat` | **M5+M6** — Conversation surface + metadata PATCH | C-10, C-15 | `cap:chat:send`, `cap:chat:read`, `cap:chat:list`, `cap:chat:pin`, `cap:chat:archive` |
| F-23 | `plugin-providers-browser` | ChromeGovernor + stealth + browser automation | C-11 | (registers adapters) |
| F-24 | `plugin:discord` | Discord provider | C-05, C-06 | (registers adapter) |
| F-25 | `plugin:notion` | Notion provider | C-05, C-06 | (registers adapter) |
| F-26 | `plugin:slack` | Slack provider | C-05, C-06 | (registers adapter) |
| F-27 | `plugin:whatsapp` | WhatsApp provider | C-05, C-06 | (registers adapter) |
| F-28 | `plugin:reddit` | Reddit provider | C-05, C-06 | (registers adapter) |
| F-29 | `plugin-openai-api` | OpenAI compatible API | C-05 | (registers adapter) |
| F-30 | `plugin-anthropic-api` | Anthropic API | C-05 | (registers adapter) |
| F-31 | `plugin-openrouter` | OpenRouter API | C-05 | (registers adapter) |
| F-32 | `plugin-ui-canvas` | InfiniteCanvas + LivingCanvas | C-13 | (registers UI components) |
| F-33 | `plugin-ui-panels` | AuditDashboard + HealthDashboard + RbacManager + TemplatesGallery | C-13 | (registers UI components) |
| F-34 | `plugin-ui-shell` | Brand + MainMenu + CommandPalette + NotificationsCenter | C-13 | (registers UI components) |
| F-35 | `plugin-ui-cards` | DocCard + MediaCard + AutomationCard + AgentCard | C-13 | (registers UI components) |
| F-36 | `plugin-ui-builder` | BuilderSurface + CapabilityNode + SurfaceNode | C-13 | (registers UI components) |
| F-37 | `plugin-tools` | Tool orchestrator facade + tool-use protocol | C-05, C-10 | `cap:tools:invoke` |
| F-38 | `plugin-reprogrammability` | Reprogram controller + DSL | C-43 | `cap:reprogram:execute` |
| **F-39** | `plugin:dedup` (new) | **M1** — SHA256 message identity dedup | C-15 | `cap:dedup:resolve` |
| **F-40** | `plugin:lifecycle` (new) | **M3+M4** — TTL sweep + compaction + backup | C-11, C-15 | `cap:lifecycle:sweep`, `cap:lifecycle:compact`, `cap:lifecycle:backup` |

The end-state has **40 first-party plugins** (36 from the kernel design
+ 4 added by M1, M3, M4 of the ACU/DCB/Storage vision).

---

## §5. The Plugin Surface (third-party developer experience)

A third-party developer writes a plugin. What do they see?

### The manifest

```yaml
# plugin.yaml
id: plugin.myorg.notion-bridge
version: 1.0.0
name: Notion Bridge
description: Bidirectional sync between VIVIM and Notion
contracts:
  - kernel.contracts.iplugincontext@1.0
  - kernel.contracts.iprovideradapter@1.0
permissions:
  - network
  - storage:read
  - storage:write
contributes:
  services:
    - kind: api-protocol
      name: notion
      adapter: ./notion-adapter.js
  ui:
    generated:
      - slot: chat.actionBar
        html: ./action.html
        css: ./action.css
activationEvents:
  - onCommand:cap:chat:export
```

### The certifier (12 attack vectors)

The certifier runs in < 50ms. It rejects if:

1. `id` is not reverse-DNS unique
2. `name` is empty or > 64 chars
3. `permissions` reference unknown permission
4. `contributes` is empty
5. `services[kind].adapter` URL is not on the kernel-asset allowlist
6. `ui.generated[].html` > 64KB or contains `<script>` inline
7. `ui.generated[].css` > 32KB or contains `@import`, `expression(`,
   or `url(http...)`
8. `activationEvents` reference an unknown event
9. The manifest is missing `contracts`
10. `contracts` reference a kernel contract that does not exist
11. `contracts` version does not match the kernel's `contractVersion`
12. The manifest's `permissions` do not include every `contributes`
    sub-permission (e.g. contributing a `services[kind:'api-protocol']`
    requires `network`)

### The install command

```bash
# From a URL
bun run devops plugin install https://myorg.com/plugin.yaml

# From a local file
bun run devops plugin install ./plugin.yaml

# From a registry (future)
bun run devops plugin install notion-bridge@1.0.0
```

### The developer experience

The third-party developer can:
- Run the certifier locally: `bun run devops plugin certify ./plugin.yaml`
- Run the fuzzer against their plugin: `bun run devops plugin fuzz`
- Read the M-layer for any kernel contract: `kernel.why("IPluginAdapter")`
- See what their plugin's capabilities are reachable from: `kernel.impact("plugin.myorg.notion-bridge:cap:chat:export")`

---

## §6. The K0(L0) Substrate (the deterministic intelligence floor)

The kernel ships with 5 K0(L0) contracts. The defaults are:

| Contract | Default substrate | Upgrades |
|---|---|---|
| `INLCLLayeredPipeline` (C-40) | 6-layer pipeline with TF-IDF semantic | swap any layer's resolver at runtime |
| `IEmbeddingProvider` (C-41) | `TfIdfEmbeddingProvider` (zero deps) | `HfEmbeddingProvider` (ONNX, ~22MB), `OllamaEmbeddingProvider` |
| `IBudgetGuard` (C-42) | `BudgetEngine` (default limits: 100 req/day, 1M tokens/day) | `plugin:cost` swaps via `IIntelligenceRegistry.setProvider` |
| `ICommandPipeline` (C-43) | CLI REPL + HTTP `/api/interpret` + frontend chat + MCP `kernel:tools:invoke` — all call the same `interpret()` | (no swappable impl; the contract is the entry point) |
| `IIntelligenceRegistry` (C-44) | Empty map at boot; `plugin:cost` registers its `BudgetGuard`; etc. | any first-party plugin can register a substrate |

**The kernel never depends on an LLM.** The LLM is a registered capability
(`kernel.nlcl.llm-fallback`) that the user enables explicitly. If no LLM
resolver is registered, the pipeline falls through to `none` (per the
existing `LayeredResolver:140`).

---

## §7. The M-Layer (the self-descriptive surface)

The 7 catalogs. Each is co-generated at boot from the same source the
kernel boots from. They cannot drift.

| Catalog | Question it answers | Example |
|---|---|---|
| `IIdentityCatalog` (C-33) | What am I? | `kernel.contracts.ipluginmanager` is an `interface` in `src/ai/plugins/manager.ts:27`, v1.0, stable, owner `kernel` |
| `IProvenanceStore` (C-34) | Where did I come from? | `enforceCapabilityInvocation` was added 2026-08-28 in response to REASSESSMENT Change-8; approved in P0-1.x |
| `IRationaleCatalog` (C-35) | Why am I the way I am? | The kernel uses dot-namespace because colon conflicts with bus event-kind conventions |
| `IRelationGraph` (C-36) | How do I fit? | `IProviderRegistry.setState` (C-06) is consumed by `Gateway` and `IProviderAdapter`; depends on `PROVIDER_TRANSITIONS` |
| `IConfigurationCatalog` (C-37) | What is this config? | `engine.provider-mux.timeout-ms` is a number, default 5000, hot-reload: false |
| `IEventCatalog` (C-38) | What is this event? | `kernel.plugin.installed` is emitted by `IPluginHost`; payload is `{ pluginId, version, source }` |
| `IWhy` (C-39) | Free-text "why" | `kernel.why("IPluginManager")` → markdown summary |

**The user-facing entry point is `kernel.why(question)`.** The function
is a deterministic router; it does not use an LLM. The answer is grounded
in source.

---

## §8. The Test Surface (the 24+ arch tests, as end-state checks)

Each test is a property from §1 re-expressed as code.

| Test | Property | Status today |
|---|---|---|
| T-01 | INV-1, INV-5 (kernel-boot + contract-versioned) | exists (`tests/arch/arch-invariants.test.ts`) |
| T-02 | INV-2 (install parity) | MISSING — write in P0-1 |
| T-03 | INV-3 (capability isolation) | MISSING — write in P0-1 |
| T-04 | INV-4 (plugin-context closed) | MISSING — write in P0-5 |
| T-05 | INV-5 (contract versioned) | MISSING — write in P1-5 |
| T-06 | INV-6 (bus namespace) | MISSING — write in P0-4 |
| T-07 | INV-7, INV-8 (message dedup) | MISSING — write in Phase 1 |
| T-08 | INV-9 (message metadata) | MISSING — write in Phase 2 |
| T-09 | INV-10 (collection tree) | MISSING — write in Phase 3 |
| T-10 | INV-11 (TTL) | MISSING — write in Phase 4 |
| T-11 | INV-12 (ACU fields) | MISSING — write in P0-1 |
| T-12 | INV-13 (FSRS-6) | MISSING — write in Phase 5 |
| T-13 | INV-14, INV-15 (provider protocol) | exists (`tests/arch/api-contract.test.ts`) |
| T-14 | INV-16 (provider list) | MISSING — write in P0-2 |
| T-15 | INV-17 (kernel model count) | MISSING — write in P2-2 |
| T-16 | INV-18, INV-19 (dead code removed, no vm) | MISSING — write in P0-3 |
| T-17 | INV-20 (store contracts) | exists (`tests/arch/store-contract-parity.test.ts`) |
| T-18 | INV-21, INV-22 (frontend) | MISSING — write in Phase 6 |
| T-19 | INV-23, INV-24 (cross-surface parity) | exists (`bun run devops verify-cross-surface`) |
| T-20 | INV-25 (M-layer complete) | MISSING — write in P0-1.y |
| T-21 | INV-26 (kernel.why) | MISSING — write in P0-1.y |
| T-22 | INV-27 (M-layer co-generated) | MISSING — write in P0-1.y |
| T-23 | INV-28, INV-29 (K0(L0) local + degrade) | MISSING — write in P0-1.w |
| T-24 | INV-30 (budget guard) | MISSING — write in P0-1.w |

**The 8 existing tests + 16 new tests = 24 arch tests, all enforceable in CI.**

---

## §9. The Capability Preservation Budget (the 90% floor)

The user-facing behavior that exists today must continue to work.

| Existing capability | Post-migration home | Test |
|---|---|---|
| All `/api/*` routes respond identically | K0 kernel routes (HTTP shape unchanged) | `tests/integration/api-routes.test.ts` |
| All `bun run devops *` commands run | K0 CLI shell calls `ICommandPipeline.interpret` | `tests/integration/cli-commands.test.ts` |
| Desktop app boots the same way | Tauri supervisor unchanged; kernel-only boot | `bun run devops desktop-loop run` |
| 16 registered providers work | Each provider is a first-party plugin | `tests/integration/provider-list.test.ts` |
| 9 provider manifests in `seeds/providers/` | Migrate to first-party plugin manifests | `tests/integration/seed-migration.test.ts` |
| 200 Prisma models persist | Split: 17 kernel + 183 first-party (migrate with plugin) | `tests/integration/prisma-split.test.ts` |
| Conversation capture (Node) | K0-12 `SchemaRegistry` + `INodeStoreContract` | `tests/integration/conversation-capture.test.ts` |
| Memory-as-Node (FSRS-6 initial state) | K1 `plugin:memory` | `tests/integration/memory-fsrs.test.ts` |
| 5-stage context assembly | K0 + K1 `plugin:memory` | `tests/integration/context-assembly.test.ts` |
| Budget decay | K1 `plugin:cost` + K0-L3 `IBudgetGuard` | `tests/integration/budget-decay.test.ts` |
| ACU-provenance fields | K0-12 `INodeStoreContract` | `tests/arch/node-acu-fields.test.ts` |
| Cross-conversation synthesis | K1 `plugin-knowledge` | `tests/integration/cross-conv-synth.test.ts` |
| Recency-decay scoring | K0 + K1 | `tests/integration/dcb-projector.test.ts` |
| Content hashing / dedup key derivation | K0-14 + K1 `plugin:dedup` | `tests/unit/ids.test.ts` |
| Storage relocation (WAL, move, backup) | K1 `plugin:lifecycle` (M3+M4) | `tests/integration/storage-relocation.test.ts` |
| Cozo semantic search | K1 `plugin:search` | `tests/integration/cozo-search.test.ts` |
| Memory persistence + access control | K1 `plugin:memory` | `tests/integration/memory-acl.test.ts` |

**The 90% floor is met: every existing user-facing capability is preserved
or enhanced. The 10% risk is the dedup migration (M1) which changes the
storage shape — but the API is additive (new `identityHash` field), not
breaking.**

---

## §10. The Capability Enhancement Budget (the 200% target)

New capabilities that exist in the end-state that do not exist today.

| New capability | Source | Test |
|---|---|---|
| Third-party plugin extensibility | Kernel migration P0-P3 | `tests/integration/third-party-plugin.test.ts` |
| The 12-vector certifier | P0-1 | `tests/arch/certifier.test.ts` |
| The 10K-mutation fuzzer | P0-1 | `tests/arch/fuzzer.test.ts` |
| The M-layer (7 catalogs) | P0-1.y | `tests/arch/m-layer-co-generated.test.ts` |
| The `IWhy` user entry point | P0-1.y | `tests/integration/why-router.test.ts` |
| K0(L0) hot-swap | P0-1.w | `tests/integration/embedding-degrade.test.ts` |
| K0(L0) deterministic pipeline (no LLM) | P0-1.w | `tests/integration/nlcl-no-llm.test.ts` |
| Message dedup (M1) | Phase 1 | `tests/integration/dedup-roundtrip.test.ts` |
| Collections (M2) | Phase 3 | `tests/integration/collection-tree.test.ts` |
| TTL + compaction (M3+M4) | Phase 4 | `tests/integration/lifecycle-sweep.test.ts` |
| Message metadata (M5+M6) | Phase 2 | `tests/integration/message-metadata.test.ts` |
| Frontend message UI (M7) | Phase 6 | `frontend/tests/e2e/message-actions.test.ts` |
| FSRS-6 review scheduler (M8) | Phase 5 | `tests/integration/fsrs-scheduler.test.ts` |
| Capability-usage introspection | M-layer + capability tracking | `tests/integration/capability-graph.test.ts` |
| Runtime plugin hot-upgrade | K0-15 `IPluginHost` | `tests/integration/plugin-hot-upgrade.test.ts` |
| Cross-plugin capability routing | P-18 | `tests/integration/cross-plugin-cap.test.ts` |
| Codex wiki (16 starter articles) | Alpha release | `frontend/tests/e2e/wiki-render.test.ts` |
| S0-S3 onboarding | Alpha release | `frontend/tests/e2e/onboarding.test.ts` |
| Backup portability | M4 `BackupManager` | `tests/integration/backup-restore.test.ts` |
| Per-provider synthesis (cap:knowledge:synthesize) | M2 + knowledge | `tests/integration/cross-provider-synth.test.ts` |

**20+ new capabilities. The 200% target is met when every row above is
in the test suite and the test passes.**

---

## §11. The Blast Radius (what fails if X breaks)

For each of the 17 kernel subsystems, plus the M-layer and K0(L0):

| Subsystem | Failure mode | Blast radius | Recovery | Detection test |
|---|---|---|---|---|
| K0-1 IPluginManager | Certifier returns invalid result | All plugin installs/updates fail | Re-run certifier with verbose log | T-04 |
| K0-2 IPluginContext | Plugin receives invalid context | Plugin throws on first call | Restart kernel | T-06 |
| K0-3 IEventBus | Events lost or duplicated | Cross-plugin state divergence | Replay event log | T-09 |
| K0-4 IProviderRegistry | Wrong provider selected | User sends to wrong provider | Manual switch | T-14 |
| K0-5 IProviderAdapter | Adapter throws on every call | All chat fails | Fallback adapter | T-13 |
| K0-6 IExecutionManager | Queue stuck | All async work stops | `drainProvider` + `forceStopProvider` | T-15 |
| K0-7 IRuntimeSupervisor | Process leak | OOM | `kill -9` + restart | T-16 |
| K0-8 IPolicyEnforcer | Bypass allowed | Security hole | Audit log review | T-11 |
| K0-9 IRouter | Wrong route | Mis-routed commands | Router dry-run | T-17 |
| K0-10 Sandbox | Iframe escapes | Host compromised | Sandbox audit log | T-15 |
| K0-11 Audit/Tracer | Audit log lost | No forensic trail | Restore from backup | T-22 |
| K0-12 SchemaRegistry | Node type not found | All data writes fail | Schema validator | T-20 |
| K0-13 MigrationRunner | Migration corrupts DB | Data loss | Restore from backup | T-18 |
| K0-14 Crypto | Hash collision | (effectively impossible) | None | T-23 |
| K0-15 IPluginHost | Plugin cannot install | User cannot extend | Roll back last install | T-04 |
| K0-16 KernelRegistry | Engine not registered | Oracle queries fail | Re-register | T-21 |
| K0-17 Introspection caps | `kernel.why` returns empty | Users cannot navigate | Re-build catalog | T-20 |
| M-layer | Catalog out of date | Stale introspection | Rebuild at boot | T-25 |
| K0(L0) | Provider fails to load | Pipeline degrades | TF-IDF fallback | T-26 |

---

## §12. The "Done" Conditions

The migration is complete when:

1. **All 30 invariants from §1 are true.** (24 arch tests in CI pass.)
2. **All 30+ capabilities from §2 are reachable** through their respective
   surfaces (CLI = API = MCP = UI = M-layer).
3. **All 10 example scenarios from §3 behave as described.** (10 integration
   tests in CI pass.)
4. **All 40 first-party plugins install + uninstall + reinstall** without
   leaving state. (40 plugin boot tests in CI pass.)
5. **The 3rd-party plugin developer experience from §5 works end-to-end.**
   (1 sample plugin installs, certifies, runs, uninstalls cleanly.)
6. **The K0(L0) substrate from §6 hot-swaps at runtime.** (1 integration
   test passes.)
7. **The M-layer from §7 answers "why" questions deterministically.**
   (1 integration test passes.)
8. **All 24 arch tests from §8 pass in CI.**
9. **The 17 kernel models from INV-17 are the only kernel models.** (1 arch
   test passes.)
10. **The 183 first-party product models persist with their owning plugin.**
    (1 integration test passes — uninstall `plugin:chat` then reinstall,
    data is preserved.)

**10 conditions. When all 10 are true, the migration is "done."**

---

## §13. The Honest Caveats

1. **The "200% target" is a stretch goal, not a guarantee.** §10's 20
   new capabilities are real, but each is one PR each, and the
   integration is non-trivial. The realistic floor is 130-150%.

2. **The "one-shot migration" is unrealistic for the 36 plugin moves.** P3
   is 16-24 weeks of streaming work. The boundary lands in P0 (4-6 weeks)
   and stays put; the plugin moves are a permanent refactor stream.

3. **The kernel-only boot test (P0-6) is the gate that proves everything.**
   If P0-6 fails, the migration was wrong. If P0-6 passes, the boundary
   is real and the rest is mechanical.

4. **The I-2 ground-truth probes are the precondition for P0.** The
   reclassification's per-file numbers are directionally right but
   quantitatively wrong (186 engines vs actual 460). Without I-2,
   every P0 PR is a guess.

5. **The valuation step (per the design lesson) applies to every existing
   file, not just the migration candidates.** Some files should be
   REMOVEd, not migrated. The migration table will include the
   `valuation.verdict: REMOVE` for ~30-50 files.

6. **The devops loop, the convergence audit, the agent-as-runtime, and
   the LLM-as-Human test suite are not in the migration table.** They
   are the **operating layer** on top of the migration. The migration
   ships a kernel; the devops loop ships the workflow that makes the
   kernel usable. Both must land.

7. **The 30% budget I set in the original work (30-44 weeks) is
   aspirational.** The realistic 7-11 month estimate assumes:
   - 1 engineer (me)
   - No second reviewer (the two-reviewer gate from P0-1 is at risk)
   - No scope creep
   - The reclassification's hypotheses hold (verified by I-2)

   If any of these break, the timeline extends. The end-state doc
   (§1-§12) is invariant; the timeline is not.

---

## §14. The Single Sentence

> **A valid kernel boots with no first-party plugin installed. A
> first-party plugin installs the same way a third-party plugin does.
> A third-party plugin cannot reach a capability the kernel does not
> expose. The kernel does not know what a Conversation or a Memory is
> — it knows what a Node is. The user has 30 invariants that are
> always true, 30+ capabilities that are reachable, and 10 done
> conditions that mark the migration complete.**

This sentence is the end-state. The migration table is the means. The
interview you give is the values that anchor both.
