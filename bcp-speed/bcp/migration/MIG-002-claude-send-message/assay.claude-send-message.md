# Assay — MIG-002 Claude send_message (what the legacy subsystem actually does)

> Method: source inspection (OBSERVED) + inference labeled as such.
> Shared legs already assayed by MIG-001 are CITED BY RECORD-REF, not re-pinned
> (first use of the SharedLeg mechanism — see MIGRATION_MODEL.md).
> Only Claude-differentiating sources are pinned below.

## A. Claude-differentiating source locations (all OBSERVED, hashes in record)

- Declarative: `seeds/providers/manifests.ts` Claude block, lines 147–297
  (file sha e1cc3418…, identical bytes to MIG-001's pin — same file, new block).
  slug claude · per_account · fleet ports 9222–9250 · models sonnet-4 (default,
  ctx 200k) / opus-4 / haiku-4 · capabilities send_message + select_model +
  toggle_extended_thinking + deep_research (+ edit/regenerate/upload/navigate
  adjacent, out of slice).
- Imperative: `src/engines/providers/plugins/claude.ts` (57 lines, sha
  eb85aa57…) — ClaudePlugin: claude.ai urls, ProseMirror composer selectors,
  composerType contenteditable, typing contenteditable delayMs 30, claude-override
  anti-detection, capabilities claude_send → send_message.
- Stream grammar: `seeds/parsers/claude-streaming-sse.ts` (119 lines, sha
  1321bf94…) — Anthropic SSE: message_start → content_block_start(text |
  thinking | tool_use | image) → content_block_delta(text_delta |
  thinking_delta) → content_block_stop → message_stop. Block kinds: text,
  reasoning, tool-call, file, meta. Completion rule: `message_stop` or `[DONE]`
  (OBSERVED — resolves the L-3 class of unknown for Claude specifically).
  Confidence: data-lines + content_block markers → 1, else degraded.
- Registry duplication (OBSERVED, new finding): `src/engines/providers/
  plugin-registry.ts` (340 lines, sha c977d6be…) + `provider-plugin-interface.ts`
  (119 lines, sha 87bbac2f…) declare a UNIFIED plugin interface + factory
  registry whose header states existing providers "implement the older
  ProviderPlugin in plugin.ts and are unaffected". Third representation of the
  provider concept: manifest row + old plugin class + unified interface.
  Which registry drives the live turn: UNKNOWN (extends MIG-001's U-authority).
- Ω contracts inspected: `contracts/src/parser.ts` (147 lines — ParsedChunk +
  buildChunkEnvelope exactly-one-final law), `contracts/src/chat.ts` (135
  lines — ChatMessage.content flat string; streamRef counts chunks, kinds not
  distinguished), `contracts/src/computation.ts` (75 lines — ComputationKind is
  a decision-routing axis, NOT a content-block vocabulary).

## B. Shared legs (cited, not re-pinned — see MIG-001 record for hashes)

Governor/CDP authority chain · stream-parser fallback chain (cycle-guarded,
DB-backed + zero-DB hot path) · conversation-manager turn lifecycle ·
unified-registry + capability-binder · provider-registrar wiring ·
Prisma schema (200 models, partition-never-port).

## C. Entry points / inputs / outputs / side effects (Claude deltas only)

- Entry (INFERRED): intent send_message → binding `claude_send` → program →
  recipe → harness → Governor → CDP → claude.ai/chat (same chain shape as #1,
  different binding id — OBSERVED in plugin capabilities arrays).
- Composer addressing (OBSERVED): ProseMirror
  `div[contenteditable="true"].ProseMirror` + `[data-placeholder]`; send
  `[aria-label='Send Message']` (case variants) — triple-redundant like #1 but
  contenteditable-addressed, and typing policy differs (delayMs 30 vs 50,
  type contenteditable vs textarea).
- Recovery (OBSERVED difference): Claude chain is
  retry_selector → retry_with_fallback(fallback_selector 'textarea') →
  navigate_home — one MORE edge than ChatGPT. The fallback crosses composer
  technologies (prosemirror → textarea), which is itself a semantic claim:
  the fallback assumes a textarea exists on the page (UNVERIFIED assumption).
- Stream → blocks (OBSERVED in seed parser): deltas accumulate into typed
  blocks; thinking deltas accumulate into reasoning blocks; message_start
  mints a meta message_id block; message_stop/error appends a stopped meta
  block unless tail is already meta. Unparseable lines SKIPPED SILENTLY
  (catch{} — OBSERVED data-loss edge: malformed SSE lines vanish without a
  ParserExecutionLog entry at this layer; whether the engine layer logs it:
  UNKNOWN).
- Completion (OBSERVED): `detectCompletion` = includes message_stop or [DONE].
- Fallback when nothing parses (OBSERVED): raw body returned as a single text
  block — a lossy downgrade (typed stream → untyped text) with no marker that
  degradation occurred: UNKNOWN whether callers can distinguish.
- Outputs/side effects/state: same shapes as #1 via shared legs (INFERRED same,
  no Claude-specific persistence code found — OBSERVED absence in slice paths).

## D. Invariants extracted (confidence-tagged)

1. ProseMirror addressing is triple-redundant on both paths (OBSERVED).
2. Claude recovery has the extra textarea-fallback edge (OBSERVED).
3. Claude completion rule is message_stop/[DONE] (OBSERVED — stronger than #1).
4. Thinking/tool_use/image content kinds exist in the VIVIM block model
   (OBSERVED) but have NO Ω-native distinction (OBSERVED in chat.ts).
5. Cookie files are login truth; one profile per (provider, account) (shared
   leg, OBSERVED in #1 — applies unchanged: manifest per_account).
6. Ordering/identity/content preservation across the turn (INFERRED
   requirement, same as #1; live proof outstanding).
