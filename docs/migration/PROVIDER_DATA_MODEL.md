# Provider Data Model — semantic layers with ChatGPT concretes

> Rule: migrate semantics, never tables. Each layer states what it MEANS
> operationally, with the ChatGPT example pinned to observed source.

## 1. Global semantic layer — what the product promises regardless of provider

- `send_message(provider, account, conversationId, body) → ordered,
  identity-preserving assistant turn` (INFERRED contract; MIG-001 behavior spec).
- `select_model`, `receive_message` as sibling globals (manifest capability list).
- Ω form: archetype slug + versioned contract op (`message.send@1`).
- ChatGPT concrete: `chatgpt_send → send_message` (plugin capabilities array,
  OBSERVED) and manifest `global_capability_id: 'send_message'` (OBSERVED).

## 2. Provider realization layer — how ChatGPT specifically fulfills the promise

- Endpoint: `https://chatgpt.com` chat surface (manifest chat endpoint, OBSERVED).
- Composer: `#prompt-textarea` (+2 plugin variants), textarea, send both
  (button + Enter), `content_editable: false` (OBSERVED both paths).
- Send button: `[data-testid='send-button']` (+2 plugin variants) (OBSERVED).
- Models: gpt-4o (default), gpt-4o-mini, o3, o4-mini — all streaming-capable
  (manifest models array, OBSERVED).
- Recovery: `retry_selector`, `navigate_home` (manifest capabilities_config, OBSERVED).
- Anti-detection: webdriver-override at document_start (plugin, OBSERVED).
- Typing: textarea, 50ms human-like, clear-first (plugin, OBSERVED).
- Ω form: op-map + entity-map refs on the realization record; parser pins D-355.

## 3. Account layer — whose credentials, whose profile

- Per-account profiles, multi-account true (manifest, OBSERVED).
- Cookie files = login truth; ProfileAllocator singleton per (provider, account).
- Login surface: `chatgpt.com/auth/login` (plugin) / login endpoint email+submit
  (manifest) — dual representation of the same surface, recorded not reconciled.
- Ω form: `session:<…>` vault rows, fence principals, redact-before-vault ordering.

## 4. Execution layer — one specific attempt with full provenance

- Program version actually run, selector actually used, latency, trace, result,
  failure (directive's canonical list — INFERRED as the right set, matches
  ParserExecutionLog / BindingStatusLog / ProgramVersionMetric rows observed
  in schema inventory).
- Ω form: composition entry (signed manifest + content hash + grant) +
  `Outcome` with `EvidenceRef`s + four send-bar attestations.

## 5. Stream layer — bytes to meaning

- Wire → capture → wire-format recognition → provider parser (DB inline logic)
  → normalized `ContentBlock[]` → `StreamBlock` rows → final message
  (stream-parser.ts function chain, OBSERVED).
- Fallback: provider → fallbackParserId* → generic → system → error, cycle-guarded;
  hot path zero-DB; `fallbackDepth` recorded (OBSERVED).
- Completion, malformed/partial handling: provider-parser-specific, UNKNOWN in
  detail for ChatGPT — parser assay is Migration #2-adjacent work; MIG-001 pins
  the fallback LAW, not the ChatGPT grammar.
- Ω form: sequence-checked chunks + authoritative terminating result.

## 6. Conversation layer — durable product state

- `Conversation → ConversationMessage → StreamBlock (+MessageAttachment)`;
  lifecycle request → resolve → user message → execute → stream → assistant
  message → blocks → finalize → metadata/telemetry (INFERRED canonical order).
- Identity/dedup/replay: UNKNOWN — carried as risk, not assumed.
- Ω form: vault conversation/message rows (D-378 index compatible); retention,
  backfill, repair explicitly W3 (NOT STARTED) and out of slice scope.

## 7. Evidence layer — proof that the above happened

- VIVIM side: TraceEntry, FleetEvent, ParserExecutionLog, BindingStatusLog,
  ProgramVersionMetric, HealthTick, ProviderHealth (schema inventory, OBSERVED).
- Ω side: capture record (redacted bytes + integrity hash), session record,
  realization refs, outcome refs, discovery promotion events (append-only audit
  log, latest-wins realization rows — never collapsed).
- Proof ladder: STATIC (typecheck/unit) < INTEGRATION (cross-boundary) <
  LIVE (real Chrome + real provider) < REGRESSION (repeat after restart/mutation).
  MIG-001 claims STATIC + INTEGRATION(recorded-fixture); LIVE is UNVERIFIED
  by explicit record, not by omission.
