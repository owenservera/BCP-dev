# VIVIM Forensic Model — executable reality, not documentation claims

> Evidence discipline: every section cites the source file inspected.
> Confidence: OBSERVED = read in code; INFERRED = reconstructed from multiple
> sources, needs runtime confirmation; UNKNOWN = explicitly unresolved.
> Date: 2026-09-23. Scope: Prompt-1 Phase 0 ground truth for the ChatGPT
> `send_message → receive_response → persist_conversation` slice.

## 1. Actual runtime architecture (OBSERVED)

### 1.1 Browser authority chain

```
engine call
  → ChromeGovernor (src/engines/chrome-governor.ts, 800 lines — OBSERVED)
  → CDPProxy (src/engines/chrome/cdp-proxy.ts, 349 lines — OBSERVED)
  → CDPTransport (src/executor/cdp-transport.ts, 297 lines — OBSERVED)
  → Chrome slave process (fleet ports 9252–9280 per seeds/providers/manifests.ts — OBSERVED)
```

`ChromeGovernor` is documented as "single I/O authority for all Chrome
interaction" (file header, line 2) and owns slave lifecycle, CDP proxy, trace
logging, health monitoring. It re-exports `AsyncMutex` and `CDPProxy`
(lines 74–75), confirming the Governor→Proxy composition is real, not aspirational.

**Governor guarantees (OBSERVED from file structure + VIVIM AGENTS.md invariants):**
- Governor Canon: only `ChromeGovernor` touches CDP; no engine imports `BunCdpClient`.
- Chrome Slave Profile = source of truth for login state (cookie files, not DB row).
- One profile per (provider, account) enforced by ProfileAllocator singleton.
- Lazy startup: slaves auto-launch on first need. Runaway creation bounded by
  FleetSupervisor limits + ProfileAllocator singleton + spawn guard.
- Triple-layer state: profile + DB + runtime must stay consistent.

**Deviations / UNKNOWNs:**
- Whether any engine reaches `CDPTransport` directly, bypassing the Governor,
  is UNKNOWN from static inspection — requires an import-graph scan
  (`BunCdpClient` / `cdp-transport` importers). Recorded as verification step V-3.
- Whether `CDPProxy` bypasses Governor rules for `Runtime.evaluate` vs
  `Input.*` vs navigation vs network capture is UNKNOWN — needs per-method audit.

### 1.2 Fleet / execution layer

- `FleetSupervisor` (src/executor/fleet-supervisor.ts, 575 lines) owns slave
  pooling, health checks, reconnect, circuit breakers.
- `slave-read.ts` (128 lines), `cdp.ts` (235 lines) are the low-level legs.
- Provider/account → slave resolution exists but its determinism is INFERRED,
  not PROVEN — Q5/Q6 in CHROME_GOVERNOR_CONTRACT.md.

### 1.3 Capability pipeline (OBSERVED file inventory)

```
natural language / UI
  → intent / capability resolution (src/engines/nlcl/, command-language/)
  → global capability (CapabilityTaxonomy)
  → provider binding (capability-binder.ts 59 lines + unified-registry.ts 207 lines)
  → program (CapabilityProgram + harness/program-schema.ts, recipe-compiler.ts)
  → recipe → harness execution
  → ChromeGovernor → browser execution
```

Engine inventory: `src/engines/` holds 186 files at top level plus 30+
subdirectories (actor, browser-automation, chrome, harness, nlcl, onboarding,
parsers, providers, stealth, …). The capability chain is real but spread across
at least 9 files named in the directive (unified-registry, capability-taxonomy,
capability-binder, capability-snapshot, capability-shape-registry,
cdp-capability-registrar, harness/program-schema, recipe-types, recipe-compiler,
capability-program-registrar, capability-parity). Classification of each link as
semantic / adaptation / execution / policy / evidence is INFERRED — see mapping doc.

### 1.4 Provider architecture — the dual-path finding (OBSERVED, high importance)

VIVIM contains **two parallel provider representations**:

**Path A — declarative manifests (database-driven protocol):**
- `seeds/providers/manifests.ts` (AUTO-GENERATED from `seeds/providers/*.json`,
  zero-filesystem-read seeding, Zod-validated at seed time).
- ChatGPT entry (OBSERVED): slug `chatgpt`, `auth_type: browser`,
  `profile_strategy: per_account`, `has_multi_account: true`,
  fleet `port_range: [9252, 9280]`, capabilities include `send_message`,
  `select_model`, `edit_message`, `regenerate_response`, `upload_file`,
  `create_new_chat`, `navigate_chat`, `delete_chat`, `rename_chat`, `browse_with_bing`.
- ChatGPT chat endpoint (OBSERVED): url `https://chatgpt.com`, composer
  `#prompt-textarea`, send `[data-testid='send-button']`,
  `composer_type: textarea`, `send_method: both`, `content_editable: false`.
- Login endpoint: email `input[name='email']` + `button[type='submit']`.

**Path B — imperative plugin classes:**
- `src/engines/providers/plugins/chatgpt.ts` (OBSERVED, 60+ lines read):
  `ChatGPTPlugin`, same URLs (`/auth/login`, `/`), same selectors
  (`#prompt-textarea`, `textarea[data-testid=…]`,
  `div[contenteditable][data-testid=…]`; send-button × 3 variants),
  `composerType: textarea`, human-like typing (delayMs 50, clearFirst),
  ChatGPT webdriver-override anti-detection, capabilities
  `chatgpt_send → send_message`, `chatgpt_select_model → select_model`.
- Siblings `claude.ts`, `gemini.ts`, `index.ts` exist (OBSERVED).

**Which path is live is INFERRED, not PROVEN:** the manifest header says
manifests are "canonical in-repo provider manifests" replacing on-disk JSON;
the plugin file says "Phase 8: migrated from scattered provider-selectors.ts,
composer-typing.ts". Both claim authority. The runtime wiring
(provider-registrar.ts 367 lines, provider-protocol-generator/loader,
config/provider-registry.ts) must be traced to determine which path the
important flow actually uses. **This is the highest-risk duplication in the
slice — classified ADAPTER/UNKNOWN in the mapping doc, never silently MERGEd.**

### 1.5 Stream / response pipeline (OBSERVED)

- `stream-parser.ts` (549 lines): DB-driven parser logic ONLY
  (`parser_logic_code` with `logic_type=inline` per AGENTS.md invariant 5).
- Fallback chain: provider → generic → system → error, all from DB
  (`resolveFallbackChain`, `fallbackParserId` walk with cycle guard).
- Hot path performs ZERO DB reads (primed parsers); fallback chain is the
  runtime safety net. Confidence metadata: `fallbackDepth`, auto-repair on low
  confidence, `ParserExecutionLog` rows.
- Wire-format detection (`detectWireFormat`), block normalize + validate,
  `StreamBlock` persistence, then final `ConversationMessage`.
- `content: string` is NOT the complete response model — normalized
  `ContentBlock[]` → `StreamBlock` rows → message. (OBSERVED from function names.)

### 1.6 Conversation lifecycle (OBSERVED file sizes)

- `conversation-manager.ts` (1064 lines) — canonical turn lifecycle owner (INFERRED).
- `conversation-history-sync.ts`, `storage/contracts/conversation-store.ts`,
  Prisma `Conversation`, `ConversationMessage`, `StreamBlock`, `MessageAttachment`.
- Authoritative identifiers (INFERRED from schema + directive, needs per-field proof):
  `conversationId`, `providerSessionId`, `accountId`, `providerMessageId`,
  `identityHash`, message sequence, `programId`, `selectorStrategyId`, `traceId`.
- Deduplication/replay mechanics: UNKNOWN — must be documented from code before
  the Ω contract pins identity semantics.

### 1.7 Data architecture (OBSERVED)

- `prisma/schema.prisma`: 3608 lines, **200 models** (measured, not "196-ish").
  Layers: provider definitions/endpoints/parsers/stream-configs; capability
  taxonomy/bindings/programs/selectors/outcomes; conversations/messages/blocks;
  sessions (Vivim/Session/Profile); health/telemetry/fleet/trace; harness
  checkpoints/commands; repair sessions; manifest versions/drift; capability
  telemetry/versions/metrics.
- Three Prisma schemas per AGENTS.md (root + system + user); seed snapshot DB
  files present (`seed-snapshot.db-shm/-wal`).
- Verdict preview: the schema is a mine, not a migration unit — partition by
  semantic layer (see PROVIDER_DATA_MODEL.md). No wholesale Prisma port.

### 1.8 Discovery / onboarding (file inventory, OBSERVED)

Engines exist for the full unknown-website → registered-provider pipeline:
`provider-discovery.ts`, `cdp-discovery.ts`, `protocol-discovery.ts`,
`onboarding/provider-onboarding-orchestrator.ts`, `dom-capability-discoverer.ts`,
`live-network-capturer.ts`, `protocol-sniffer.ts`, `parser-synthesis-engine.ts`,
`webapp-fingerprint.ts`, `webapp-taxonomy-synthesizer.ts`.
Whether they can actually emit all of `ProviderDefinition / ProviderEndpoint /
ProviderStreamConfig / ProviderParser / CapabilityBinding / SelectorStrategy /
CapabilityProgram` is UNKNOWN — the missing-bridge analysis is deferred to
Migration #2 (Claude conformance), not this slice.

### 1.9 Tests / fixtures (OBSERVED inventory)

- `tests/`: unit, integration, e2e, arch (kernel-boundary T-01..T-28),
  fuzz (12 attack vectors, 10k mutated manifests).
- Arch safety net: `tests/arch + tests/fuzz` (per VIVIM AGENTS.md).
- Characterization baselines exist but carry pre-existing failures owned by
  other agents — explicitly out of scope for this slice.

## 2. What this model does NOT claim

- No claim about which provider path (manifest vs plugin) the live ChatGPT turn
  uses — flagged UNKNOWN with a concrete trace task.
- No claim that Governor exclusivity holds under adversarial inspection —
  import scan is a required verification step.
- No claim about dedup/replay, auth recovery, or reconnect exactness.
- All UNKNOWNs are carried into MIGRATION_RISK_REGISTER.md with severity,
  not resolved by assertion.
