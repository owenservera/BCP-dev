# Behavioral Specification — Claude send_message (implementation-independent)

## CAPABILITY
Send a user message to Claude and persist the resulting conversation turn,
preserving Claude-specific stream semantics (typed content blocks).

## INPUTS
- provider = `claude` (fixed for this slice)
- account (authenticated profile; pre-existing, recovery out of scope)
- conversation identifier (new or existing thread)
- body: non-empty string
- model selection (optional; defaults to claude-sonnet-4-20250514)

## BEHAVIOR
1. Resolve (provider, account) → authenticated profile + Chrome slave.
2. Address the ProseMirror composer and deliver the body exactly once
   (contenteditable typing policy, clear-first).
3. Trigger submission through the provider's send mechanism (send_method both).
4. Capture the network response stream.
5. Detect SSE transport (data: lines + content_block markers) and select the
   Claude parser at confidence 1; fall back along the governed chain only on
   measured failure, logging depth.
6. Extract deltas into TYPED blocks (text / reasoning / tool-call / file /
   meta); detect completion on message_stop or [DONE].
7. Create the final assistant message from finalized blocks.
8. Persist user message, assistant message, and stream blocks in order.
9. Record execution evidence (trace, parser log, outcome).

## INVARIANTS (must survive into Ω)
- I-1 Ordering preserved across the turn (shared with #1).
- I-2 Identity preserved (conversation, messages, provider message id linkage
  via message_start meta block).
- I-3 Message content preserved byte-exact through normalize→block→finalize.
- I-4 Exactly-once delivery intent (duplicates detectable via identity; full
  dedup proof deferred, shared U-3).
- I-5 No credential bytes reach durable evidence (redact-before-vault).
- I-6 Every failure is visible and deterministic (named error, no silent stall).
- I-7 Typed-block provenance: a reasoning block must never silently merge into
  a text block; degradation (raw-body fallback) must be marked, not silent.
  (NEW vs #1 — Ω has no block-kind vocabulary yet: carried as unresolved.)

## FAILURES (must all be named, never silent)
- unavailable account / profile → refusal with code + sentence
- missing conversation → refusal
- selector miss on ProseMirror composer/send → retry_selector, then
  retry_with_fallback (textarea), then navigate_home, then refusal
- malformed/partial SSE → parser fallback with logged depth, then refusal
- skipped SSE lines (seed-parser catch{}) → must surface in parser log
  (required behavior; current silence is a defect, not a contract)
- provider timeout → refusal with evidence
- unattached session / unpromoted realization / uncovered parser pin → refusal

## SIDE EFFECTS
- Local persistence (conversation rows + telemetry) — intended.
- Chrome slave reuse/launch — intended, bounded.
- No other durable mutation.

## UNKNOWN (explicit)
- U-1 Attachment semantics (shared with #1).
- U-2 Dedup/replay exactness (shared U-3 of #1, renumbered here).
- U-3 Whether the textarea fallback target exists on claude.ai pages.
- U-4 Whether skipped SSE lines reach ParserExecutionLog via engine layer.
- U-5 Ω representation of reasoning/tool-call blocks (chat.ts flattening).
- U-6 Manifest vs old-plugin vs unified-interface live authority (extends #1).
