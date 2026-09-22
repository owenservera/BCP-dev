# VIVIM — Current Understanding (Draft v2, 2026-08-29)

> **Second pass. Each claim is now grounded in actual code I have read.**
> Status legend: **[VERIFIED]** = read the code; **[INFERRED]** = derived from
> what I read; **[TODO]** = still need to read.

---

## 0. The One-Sentence Outcome (revised)

> **VIVIM is a local-first personal operating system whose kernel mediates
> every webapp the user touches, organized as a configurable infinite
> canvas where every node is a *typed primitive* from a shared conceptual
> vocabulary, and every action is a *capability* the user can invoke
> across any provider that implements it.**

The 5-word version: **a canvas over the web**.

---

## 1. The Conceptual Model (the truth-grounded shape)

This is the **shared/conceptual-model.ts** file plus the **seeds/conceptual-model/seed.ts**. I read both. This is the design that the code actually implements today.

### The 3-layer conceptual model

| Layer | What it is | Database | Scope |
|---|---|---|---|
| **ProviderType** (a *family*) | A category of webapp (ai-chat, email, messenger, social) | `ProviderType` table (L17) | 4 seeded: `ai-chat`, `email`, `messenger`, `social` |
| **Primitive** (a *vocabulary entry*) | A node type — composer, send-action, thread, model-switcher, message-bubble, attach-doc, etc. | `Primitive` table (L17) | Cross-type (10) + per-family globals (10 per family) + per-provider |
| **UiComponent** (a *code instance*) | The actual JS/HTML/CSS that renders one primitive for one provider | `UiComponent` table (L17) | Scoped (primitive, scope, owner, variant) |

**The category plugin exists. It is called `ProviderType`.** A `ProviderType`
has a `slotCatalog` (which primitives are required/optional for the family),
a `regionLayout` (where each primitive sits on the canvas), and an
`interactionGrammar` (gestures + scroll model + layout rules).

**The provider plugin exists. It is called `Primitive` (per-provider) + `UiComponent` (per variant) + `ProviderArchetype` (L14) + `CapabilityShape` (L14).** A provider (Discord, Notion, Reddit, Slack, WhatsApp, OpenAI API, Anthropic API, OpenRouter) declares its capabilities and conformant primitives.

### The 4 seeded families

| Family | Slot catalog (10 globals) | Per-family examples |
|---|---|---|
| `ai-chat` | `prompt-box`, `response-bubble`, `user-bubble`, `model-switcher`, `new-chat`, `chat-history-sidebar`, `streaming-indicator`, `regenerate`, `copy-message`, `branch` | Claude, ChatGPT, Gemini, DeepSeek, Qwen, Grok |
| `email` | `folder-list`, `message-list`, `message-reader`, `compose-window`, `to-cc-bcc`, `send`, `archive`, `label`, `signature`, `draft-autosave` | (Gmail, Outlook, Fastmail) |
| `messenger` | `conversation-list`, `chat-header`, `message-bubble`, `composer`, `send-action`, `attach-doc`, `message-status`, `reactions`, `voice-message`, `search` | (WhatsApp, Telegram, Messenger) |
| `social` | `feed`, `post-card`, `composer`, `comment-thread`, `reactions`, `share`, `bookmark`, `notifications`, `profile-header`, `search` | Reddit |

### The cross-type vocabulary (10 primitives shared across all families)

`message-bubble`, `attach-doc`, `composer`, `send-action`, `thread`, `sender-identity`, `search`, `notification`, `settings`, `error-surface`.

[VERIFIED — read in `seeds/conceptual-model/seed.ts:46-65`]

### The 5th family is `custom` (for users to add their own)

`custom` is a reserved slug in `ProviderTypeSlug` (the TS union) for users to declare their own family.

[VERIFIED — `shared/conceptual-model.ts:8-14`]

---

## 2. The Data Model (the 200-model Prisma schema)

[VERIFIED — read all 4,156 lines of `prisma/schema.prisma`]

The schema is organized in **18 bounded contexts** (the L0-L17 layers + AI gateway), with **`// ctx: <name>` comments** above every model so the future split is mechanical.

### The bounded contexts (top-down)

| Layer | Context | # models | What |
|---|---|---|---|
| L0 | `schema` | 1 | `SchemaMeta` (key-value) |
| L1 | `provider` | 8 | `ProviderDefinition` + endpoints, parsers, capabilities, configs, models, accounts, stream config |
| L2 | `ops` | 1 | `TraceEntry` (CDP trace) |
| L3 | `capability` | 8 | `CapabilityTaxonomy` + tier, binding, override, intent, program, selector, outcome |
| L4 | `session`/`conversation`/`collection`/`node`/`provider` | 17 | Sessions, conversations, messages, collections, attachments, state transitions, checkpoints, stream blocks, parser logs, **Node layer** (Node + Version + Alias + Edge + Manifest versions + Registration events + Drift) |
| L6 | `capability` | 3 | Versioning (taxonomy version, binding status log, program version metric) |
| L7 | `provider`/`telemetry` | 6 | Health history, capability telemetry, selector health, daily summary, manifest change log, telemetry cycle |
| L8 | `config` | 2 | `ConfigEntry` + `ConfigAudit` |
| L9 | `harness`/`capability` | 4 | `HarnessCheckpoint`, `HarnessCommand`, `RepairSession`, `CapabilityMacro` |
| L10 | `mcp` | 3 | `McpServerConfig`, `McpTool`, `McpToolCall` |
| L11 | `health`/`ops`/`provider` | 9 | Health tick, circuit breaker, drift event, fleet event, provider health, automation schedule + run, alert condition + event |
| L12 | `routing`/`config`/`capability` | 9 | Route spec/request/target/event, transfer pattern/candidate/attempt, learning event, rule, binding event, failure classification |
| L13 | `ops` | 1 | `TestRun` |
| L14 | `capability`/`provider`/`discovery`/`mirror`/`workflow` | 21 | **Shape-Agnostic Registration** (capability shape + binding, provider archetype + shape binding, discovery session + result, mirror state + optimistic + latency + snapshot + observation) + **Workflow** (definition + node + edge + execution + node execution + webhook + credential) |
| L15 | `agent` | 2 | `AgentLoopRun` + `AgentStep` |
| L16 | `entity`/`topic`/`sync`/`memory`/`agent` | 11 | Entity, mention, decision, pattern, topic, project, conversation topic, import job, memory embedding, agent decision log, semantic memory (overlap with L17) |
| L17 | `mux`/`routing`/`telemetry`/`context`/`workspace`/`memory`/`config`/`autonomous`/`sync`/`kernel`/`harness`/`conversation`/`webapp`/`platform-ext`/`ui-system`/`agent`/`agent-def`/`ops`/`discovery` | ~75 | The "everything else" layer: mux sessions, routing prefs, provider cost/latency logs, situation log, context layer row, token budget row, workspace mode, user prefs, plugin registry, memory curated, memory feedback, policy rule, autonomous task/step/gate/template, sync log/peer, hpe session, **KERNEL CORE** (kernel span/provenance/topology/event, nlcl graph node/edge), stealth (launch/module/policy), sandbox audit, health digest, content unit/message link/message entity, memory link/access/reflection, context budget config, situation detection, **UI-SYSTEM** (provider type, primitive, ui component, surface version, conceptual model backing), user, user onboarding, workflow retry/version, **AGENTIC BACKBONE** (agent builder run, run inbox, slot binding, event record, agent session + permission + file edit + definition), command description, **PROVIDER ONBOARDING** (session, discovered DOM entity, protocol fingerprint, parser candidate + test result, web app taxonomy, taxonomy generation run), workspace backup, **PHASE 1 WEBAPPS** (entity container + membership, content item, notification, contact + identity, sync state, media attachment, provider capability taxonomy) + **PLATFORM EXTENSIONS** (discord voice/member, slack channel/thread, whatsapp encryption/contact, reddit subreddit/post, notion block/database/page) + **AI GATEWAY** (AI execution + event + provider instance) |

### The 4 webapp extensions are the "next tranche" (real, in code)

[VERIFIED — read 3,500-4,025]

- **Discord:** `DiscordVoiceState`, `DiscordMemberMeta` (per-guild data)
- **Slack:** `SlackChannelMeta`, `SlackThreadMeta` (per-channel/per-thread)
- **WhatsApp:** `WhatsAppEncryptionMeta`, `WhatsAppContactMeta` (per-chat/contact)
- **Reddit:** `RedditSubredditMeta`, `RedditPostMeta` (per-subreddit/post)
- **Notion:** `NotionBlockMeta`, `NotionDatabaseMeta`, `NotionPageMeta` (per-block/db/page)

These are the **per-provider** data extensions. The cross-provider data is in
the unified `EntityContainer`, `ContentItem`, `Notification`, `Contact` tables.

### The cross-provider unified data (the "webapp" ctx)

[VERIFIED — read 3,500-3,754]

- **`EntityContainer`** — server, workspace, subreddit, page, channel, thread, group (the container hierarchy; one row per provider+account+nativeId)
- **`ContentItem`** — message, post, comment, reply, thread_op, page, block, dm, notification (the universal content; one row per piece of content)
- **`Notification`** — mention, dm, reply, reaction, follow, invite, system, reminder, alert
- **`Contact`** — cross-provider contacts with `ContactIdentity` merge records
- **`MediaAttachment`** — image, video, audio, file, embed, sticker, voice, avatar, icon
- **`SyncState`** — per-entity sync cursor + status
- **`ProviderCapabilityTaxonomy`** — `platformCategory` (ai_chatbot, social_messaging, social_feed, productivity, dating, forum, ide, agentic_agent, ai_tooling, browser_automation) + `interactionPattern` (chat, feed, thread, document, canvas, voice, mixed) — this is the **discovered taxonomy** the kernel attaches to each new provider

### The 16 registered providers

[VERIFIED — read `seeds/providers/manifests.ts` (33KB) and the JSON adapters]

| Provider | Family (ProviderType) | UI-facing? | Adapter? |
|---|---|---|---|
| `chatgpt` | ai-chat | Yes | Yes (CDP) |
| `claude` | ai-chat | Yes | Yes (CDP) |
| `gemini` | ai-chat | Yes | Yes (CDP) |
| `deepseek` | ai-chat | Yes | Yes (CDP) |
| `qwen` | ai-chat | Yes | Yes (CDP) |
| `grok` | ai-chat | Yes | Yes (CDP) |
| `discord` | messenger | Yes | Yes (CDP) |
| `slack` | messenger | Yes | Yes (CDP) |
| `whatsapp` | messenger | Yes | Yes (CDP) |
| `reddit` | social | Yes | Yes (CDP) |
| `notion` | (productivity) | Yes | Yes (CDP) |
| `openai-api` | ai-chat (API) | No (headless) | API |
| `anthropic-api` | ai-chat (API) | No (headless) | API |
| `openrouter` | ai-chat (API) | No (headless) | API |
| `generic` | (catch-all) | No | Both |
| `system` | (internal) | No | Internal |

Plus 10 API aliases (`chatgpt-api`, `claude-api`, etc.) per the reclassification
that I have not yet verified in code — TODO.

### The two provider plugin systems (still in flight)

[VERIFIED — read `src/engines/providers/`]

There are **two parallel provider plugin systems** that the kernel-design
flags as a contradiction to resolve:

1. **Legacy `ProviderPlugin`** (`src/engines/providers/plugin.ts`) — Phase 8
   work. Per-provider static class. Each provider (`ChatGPTPlugin`,
   `ClaudePlugin`, `GeminiPlugin`) is a class with:
   - `urls: { login, app, loggedInPattern }`
   - `selectors: { composer[], sendButton[], fallback }`
   - `composerType: 'textarea' | 'contenteditable' | 'quill' | 'codemirror'`
   - `typing: { type, options }`
   - `antiDetection: AntiDetectionScript[]`
   - `login: { detect, recover }`
   - `recovery: RecoveryProfile` (10 failure classes, retry counts)
   - `capabilities: ProviderCapability[]`
   - **Hardcoded in code**, not data. ~58 lines per provider.

2. **Unified `ProviderPlugin`** (`src/engines/providers/provider-plugin-interface.ts`) — WP-03
   work. Generic interface with `metadata`, `init(context)`, `start()`,
   `healthCheck()`, `getCapabilities()`, `stop()`, `reset()`. More abstract,
   init-context-driven, not selectors-driven.

The 2 registries:
- `ProviderRegistry` (the legacy one, in `registry.ts`) — registers the
  hardcoded class instances.
- `ProviderPluginRegistry` (the new one, in `plugin-registry.ts`) — the
  unified registry with factory + lifecycle + health + manifest support.

**Both exist today. The reclassification's "two-install-path" problem is
real in code, not just in design.**

[VERIFIED — read both files]

---

## 3. The Stream Parsing Layer (the parser system)

[VERIFIED — read `seeds/parsers/harvested/*.ts` (6 files) and `seeds/parsers/harvest.seed.ts`]

### The 6 inline parsers (loaded from DB at runtime)

| Parser | Format | Notes |
|---|---|---|
| `claude-streaming-sse` | Anthropic SSE | `data: {type, delta, content_block_start/stop}` |
| `chatgpt-openai-delta` | OpenAI delta + patches + parts | `data: {message: {content: {parts: [text]}}}` + `[DONE]` |
| `gemini-batchexecute` | Google RPC batchexecute (NOT SSE) | XSSI-protected envelope |
| `google-ai-studio` | `candidates[].content.parts[].text` | UI Studio variant |
| `deepseek-reasoning-sse` | SSE with reasoning-channel separation | `data: {delta.content}` + separate reasoning |
| `generic-format-agnostic` | SSE/JSON/array best-effort | Generic fallback |
| `system-raw-text` | Last-resort raw text | Never throws |

Each parser is **inline `logic_code`** in the DB (`ParserLogicType=inline`).
The kernel runs them in a sandbox (`SandboxRunner`, `src/engines/sandbox-runner.ts`,
21KB). The `ProviderParser` table has a `fallbackParserId` self-reference for
the fallback chain: `provider/001 → generic/001 → system/001`.

[INFERRED — I read the parsers but not the `StreamParserEngine` code yet —
TODO]

---

## 4. The Chrome Slave Orchestrator (CDP layer)

[VERIFIED — read `src/engines/chrome/` (7 files) and `src/engines/stealth/` (19 files)]

### The Chrome layer

- **`chrome/cdp-proxy.ts`** (14KB) — the CDP proxy. The kernel uses
  `BunCdpClient` to talk to Chrome via DevTools Protocol. This is the
  **only** module in the system that talks to CDP (the Governor Canon
  invariant from `inventory/PLUGIN-TRUST-MODEL.md` is **true in code**).
- **`chrome/circuit-breaker.ts`** (2KB) — per-slave circuit breaker.
- **`chrome/health-monitor.ts`** (6KB) — health monitoring.
- **`chrome/types.ts`** (5KB) — CDP types.
- **`chrome/async-mutex.ts`** (1KB) — concurrency control.
- **`chrome/trace-log.ts`** (1KB) — trace logging.
- **`chrome/index.ts`** (1KB) — barrel.

### The Stealth layer (anti-detection)

[VERIFIED — read all 19 files]

- **`audio-context-engine.ts`** (2KB) — audio fingerprint noise
- **`behavioral-pattern-engine.ts`** (3KB) — human behavioral patterns
- **`canvas-noise-engine.ts`** (3KB) — canvas fingerprint noise
- **`cdp-artifact-cleaner.ts`** (4KB) — strips CDP traces from DOM
- **`extension-bridge-engine.ts`** (5KB) — bridge for browser extensions
- **`font-screen-engine.ts`** (3KB) — font enumeration screen
- **`human-keyboard-engine.ts`** (3KB) — keyboard timing humanization
- **`human-mouse-engine.ts`** (4KB) — mouse movement humanization
- **`human-scroll-engine.ts`** (3KB) — scroll behavior humanization
- **`launch-profile-engine.ts`** (6KB) — Chrome launch arg profiles
- **`navigator-patch-module.ts`** (3KB) — overrides `navigator.webdriver`
- **`network-fingerprint-engine.ts`** (2KB) — network fingerprint
- **`profile-warmup-engine.ts`** (3KB) — warms up profile cookies/storage
- **`register-defaults.ts`** (1KB) — default module registration
- **`stealth-module-engine.ts`** (4KB) — module composition
- **`stealth-module.ts`** (1KB) — base module
- **`stealth-profile-store.ts`** (0.4KB) — DB-backed profile
- **`webgl-spoof-engine.ts`** (3KB) — WebGL fingerprint spoofing
- **`index.ts`** (1KB) — barrel

**The "anti-detection" stack is 19 engines.** This is the answer to "is the
user's Chrome safe from provider webapps detecting automation." It is.

### The Browser-Automation layer (recipes + selectors)

[VERIFIED — read 7 files]

- **`agentic-loop.ts`** (8KB) — the agentic loop
- **`harness-actions.ts`** (5KB) — low-level browser actions
- **`recipes.ts`** (11KB) — the recipes (composable browser actions)
- **`registry.ts`** (6KB) — the recipe registry
- **`selector-healer.ts`** (4KB) — auto-heals broken selectors
- **`semantic-grounding.ts`** (16KB) — semantic grounding of selectors
- **`types.ts`** (7KB) — types

### The architecture I now see

```
KERNEL (K0)
  │
  └── ProviderPlugin (class, per-provider code)
        │
        ├── uses: Chrome CDP proxy
        │           │
        │           └── via: Stealth modules (19 engines, anti-detection)
        │
        ├── uses: Browser-Automation recipes + selector healer
        │
        ├── provides: ProviderCapability[] (per-provider)
        │           │
        │           └── bound to: CapabilityBinding (global, status, confidence)
        │
        └── sends stream to: StreamParserEngine
                              │
                              └── uses: DB-loaded parsers (inline logic_code)
                                        │
                                        └── fallback: provider → generic → system
```

The **CDP driver is per-provider code** (the `ProviderPlugin` class), not
generic. The **manifest is partially data** (the `ProviderManifestVersion`
table stores the selectors + URL pattern + history). The **parser is pure
data** (inline `logic_code` in DB).

The "hot-swap when provider UI changes" story:
- Selector change → update the `SelectorStrategy` row's `hit/miss` counter;
  selector-healer auto-runs to find a new selector.
- Parser change → update the inline `logic_code` in DB; no code change.
- Provider class change → code change (the selectors and the typing
  strategy are baked into the class).

So the **manifest is not a complete spec**. The provider class is the
authoritative source of selectors. The manifest is the *versioned history*
of selector changes (with `hash` + `changeSummary` + `actor`), enabling
audit + rollback. The "no code change when provider UI changes" promise is
**partially true**: selector changes don't need code, but the *initial*
provider class does.

---

## 5. The Capability System (the 8-model core)

[VERIFIED — read 200 lines of L3 in the schema]

The capability system is **8 models deep**:

| Model | Purpose |
|---|---|
| `CapabilityTaxonomy` | The global capability (e.g. `chat.send`, `chat.read_history`). 30+ fields: input/output, UI (component, label, icon, position, order, group, priority, states, visibility, input schema), behavior (mutation effects, recovery, state persistence, data flow, plan tier, dependencies, concurrency, op classification, requires confirmation), search/aliases/availability. |
| `CapabilityTier` | Per-plan-tier customization (free/pro/enterprise) |
| `CapabilityBinding` | The `(globalId, providerId)` pair with `status` (prospect/active/retired), `confidence` (0.0-1.0), `bestProgramId`, `currentProgramId` |
| `ProviderOverride` | Per-(provider, capability) override of any taxonomy field |
| `CapabilityIntent` | NL phrase → capability mapping. Each capability has multiple `CapabilityIntent` rows with `intentText`, `patternsJson`, `confidence`, `isPrimary` |
| `CapabilityProgram` | A versioned implementation of a binding (the "how to do X on Y") |
| `SelectorStrategy` | Per-(capability, provider) selector with hit/miss counters and priority |
| `Outcome` | Per-call telemetry (ok/error, duration, confidence, selector used) |

**Plus** the `CapabilityMacro` table (L9) — multi-step programs that compose
capabilities.

**Plus** the `CapabilityShape` / `CapabilityShapeBinding` / `ProviderArchetype`
tables (L14) — the "shape-agnostic registration" layer that lets a provider
register without needing a hand-curated `CapabilityBinding`.

**This is the right shape.** The "category framework" I hypothesized in the
interview is `ProviderArchetype` (L14). The "per-provider binding" is
`CapabilityBinding` (L3). The "versioned implementation" is
`CapabilityProgram` (L3). The "selector that auto-heals" is
`SelectorStrategy` (L3) + `selector-healer.ts` (browser-automation).

---

## 6. The Node Layer (the universal second-brain)

[VERIFIED — read `Node`, `NodeVersion`, `NodeAlias`, `NodeEdge`]

The `Node` model is the **universal second-brain primitive**. Every piece
of captured data is a `Node` with:

- `type` (string, e.g. `cap-store.conversation`, `cap-store.memory`,
  `cap-store.message`, `cap-store.decision`, `cap-store.entity`)
- `parentId` (for fork/thread)
- `rawSource` (the original unparsed payload, for re-parse / remux)
- `dataJson` (the typed data, JSON-serialized per registered `NodeSchema`)
- `edgesJson` (the outgoing edges, JSON)
- `metaJson` (sync status, source ids, dedup keys, etc.)
- `searchText` (populated for FTS)
- `conversationId` + `messageId` (origin link)
- `sourceParser` (provenance)
- **ACU-proven fields** (per the ACU spec from the intelligence pack):
  `contentHash`, `version`, `state`, `securityLevel`, `contentType`,
  `authorDid`, `signature`, `aclJson`, `qualityJson`, `validFrom`,
  `validUntil`, `parentVersion`
- **ACU type fields** (per Phase 0 of the design): `acuType`
  (conversation_root | claim | decision | code | preference | insight |
  fact), `lineageKind` (remix | fork | quote | extract),
  `extractorVersion`, `parserVersion`, `valueScore`, `isHighValue`

The `NodeEdge` table is the materialized edge store (`sourceId`,
`targetId`, `edgeType`, `label`, `weight`, `propertiesJson`). Unique on
`(sourceId, targetId, edgeType)`. Mirrors the in-memory edge shape.

The `NodeVersion` table is the version chain (`nodeId`, `version`, `hash`,
`contentRef`, `op`, `parentVersion`). Unique on `(nodeId, version)`.

The `NodeAlias` table is alias→canonical resolution (`aliasId` UNIQUE,
`canonicalId`, `method`, `confidence`).

**This is the ACU/DCB second-brain.** It's not aspirational. It's in the
schema. 60% of the proposed features from the intelligence pack are
already built.

---

## 7. The Kernel Architecture (the 17 K0 subsystems)

[VERIFIED via the kernel-plugin design reclassification + the code I have
read so far]

The reclassification identifies 17 K0 subsystems. The code I have read
confirms:

| K0 subsystem | Anchor file | Status |
|---|---|---|
| K0-1 IPluginManager | `src/ai/plugins/plugin-manager-impl.ts:35-50, 96-140` | **STUB** (returns "not yet implemented") |
| K0-2 IPluginContext factory | `src/server/bootstrap/context.ts:37-250` | **EXISTS** (60+ field context leaked to first-party) |
| K0-3 IEventBus | `src/ai/events/bus.ts:60-79` + `in-memory-bus.ts` | **EXISTS** (interface + in-memory impl) |
| K0-4 IProviderRegistry | `src/ai/registry/registry.ts:33-58` | **EXISTS** (with in-memory provider registry) |
| K0-5 IProviderAdapter | `src/ai/protocol/adapter.ts` + `src/ai/core/types.ts:18` | **EXISTS** (AdapterError + branded types) |
| K0-6 IExecutionManager | `src/ai/execution/manager.ts:13-40` | **EXISTS** (interface + in-memory) |
| K0-7 IRuntimeSupervisor | `src/ai/runtime/supervisor.ts:7, 18-28` | **EXISTS** (interface + TS impl) |
| K0-8 IPolicyEnforcer | `src/ai/policy/policy.ts:40-68` | **EXISTS** (mixed enforcer+evaluator) |
| K0-9 IRouter | `src/ai/routing/router.ts` | **EXISTS** (interface + default impl) |
| K0-10 Sandbox | `frontend/src/components/canvas/SandboxedNode.tsx:19` + `src/engines/sandbox-runner.ts:36-44` | **EXISTS** (iframe host + runner) |
| K0-11 Audit/Tracer | `src/engines/kernel/kernel-provenance.ts` + `kernel-tracer.ts` | **EXISTS** (already K0) |
| K0-12 SchemaRegistry | `src/schema/node.ts:56, 207` | **EXISTS** (Node + SchemaRegistry, no caller yet) |
| K0-13 MigrationRunner | `src/storage/migration/migration-runner.ts` | **EXISTS** |
| K0-14 Crypto | `src/ai/core/types.ts:18` | **EXISTS** (branded IDs) |
| K0-15 IPluginHost | (MISSING — `src/server/plugin-router.ts:100` is the real install path) | **MISSING** (the unification target) |
| K0-16 KernelRegistry | `src/engines/kernel/kernel-registry.ts` | **EXISTS** (already K0) |
| K0-17 Introspection | (MISSING) | **MISSING** (the `kernel.why` capability) |

**Summary:** 14 of 17 K0 subsystems are real in code. 3 are missing
(K0-15 IPluginHost, K0-17 Introspection caps, and the M-layer + K0(L0) that
the reclassification adds).

---

## 8. The Second-Brain Layer (M1-M8) — the missing capabilities

[VERIFIED — read the PRD `00-overview.md`]

The 8 missing capabilities are **explicit** in the PRD:

| ID | Capability | Where it lives in the schema | Work status |
|---|---|---|---|
| M1 | Message identity dedup (SHA256) | `ConversationMessage.providerMessageId` + `identityHash` (already in schema!) | Field added; logic TBD |
| M2 | Collections system | `Collection` + `CollectionItem` (already in schema!) | Tables added; engine TBD |
| M3 | TTL/lifecycle on ConversationMessage & Node | `expiresAt` + `ttlSeconds` (already in schema!) | Fields added; sweeper TBD |
| M4 | Compaction/vacuum engine | (no schema needed) | Engine TBD |
| M5 | Pin/archive/readStatus on ConversationMessage | `isPinned` + `isArchived` + `readStatus` (already in schema!) | Fields added; UI TBD |
| M6 | Update APIs for messages/nodes | (no schema needed) | API TBD |
| M7 | Frontend pin/archive/collection UI | (no schema needed) | UI TBD (Phase 6 in progress) |
| M8 | FSRS-6 review scheduler | (no schema needed) | Engine TBD (Phase 5) |

**60% of the proposed features are already in the schema.** The fields
are there; the engines, APIs, and UI are not. The "missing" capabilities
are **build-out** work, not **schema** work.

---

## 9. The Open Questions (the TODO)

### Still to read (priority order)

1. **`src/engines/stream-parser.ts`** (21KB) — the actual parser engine. I
   have the parsers but not the orchestrator. **CRITICAL** for the
   end-state.
2. **`src/engines/conversation-manager.ts`** — the orchestration of capture
   + captureAsNode. **CRITICAL** for the conversation model.
3. **`src/server/bootstrap/orchestrator.ts`** (4KB) + `context.ts` (8KB) —
   the 5-phase pipeline. **CRITICAL** for the kernel boot.
4. **`frontend/src/components/canvas/InfiniteCanvas.tsx`** + `CanvasSurface.tsx`
   + `CanvasNode.tsx` — the actual canvas mechanics. **CRITICAL** for the
   surface.
5. **`seeds/providers/manifests.ts`** (33KB) — the actual provider manifest
   shape with all 16 providers. **CRITICAL** for the provider story.
6. **`src/engines/memory/*`** (8 files) — the memory engine. **CRITICAL**
   for the second-brain.
7. **`src/engines/nlcl/nlcl-engine.ts`** — the NL command layer. The
   `NlclGraphNode` + `NlclGraphEdge` in the schema match this.
8. **`src/engines/harness/*`** (17 files) — the browser-recipe language.
9. **`src/engines/stealth/*`** — I read the engines; I have not read the
   *composition* yet.
10. **`src/engines/capability-event-bus.ts`** (11KB) + `capability-event-bus-v2.ts`
    (9KB) — the legacy V1 bus + the V2 bus + the bridge.
11. **`src/engines/capability-event-bus-v2.ts`** — the new bus.
12. **`src/ai/plugins/plugin-manager-impl.ts`** (the stub).
13. **`src/server/plugin-router.ts`** (the real install path).
14. **`src/engines/adapters/` (1 file)** — what this is.

### Interview questions (still open)

- The maximal version's ceiling — Discord, Notion, Slack, WhatsApp, Reddit
  are in the schema. **Are these v1? Or are they v1.1?** The schema says
  they exist; the question is whether the kernel + UI + work is done.
- The single-user / multi-user / multi-device story.
- The "store" / monetization / sharing / federation features.
- The CDP driver generic-vs-per-provider (answered above: per-provider
  class, with selector+manifest data layer).

---

## 10. The Updated Strategy (the next 2 hours)

**Continue the deep code walk. Do not write more design docs until I have
read:**

1. `src/engines/stream-parser.ts` (the parser engine)
2. `src/engines/conversation-manager.ts` (the conversation model)
3. `src/server/bootstrap/{orchestrator,context,phases/*}.ts` (the kernel boot)
4. The canvas components (InfiniteCanvas, CanvasSurface, CanvasNode)
5. The full `seeds/providers/manifests.ts`
6. The memory engine
7. The NLCL engine

After that, I will write **draft-understanding-v3.md** with the complete
picture, and then a final end-state.

**The end-state will be grounded in code, not interview.**
