# Behavioral Specification — ChatGPT send_message (implementation-independent)

## CAPABILITY
Send a user message to ChatGPT and persist the resulting conversation turn.

## INPUTS
- provider = `chatgpt` (fixed for this slice)
- account (authenticated profile; pre-existing, recovery out of scope)
- conversation identifier (new or existing thread)
- body: non-empty string
- model selection (optional; defaults to provider default gpt-4o)

## BEHAVIOR
1. Resolve (provider, account) → authenticated profile + Chrome slave.
2. Address the ChatGPT composer and deliver the body exactly once.
3. Trigger submission through the provider's send mechanism.
4. Capture the network response stream.
5. Detect streaming transport and select the ChatGPT parser; fall back along
   the governed chain only on measured failure, logging depth.
6. Extract deltas into normalized blocks; detect completion.
7. Create the final assistant message from finalized blocks.
8. Persist user message, assistant message, and stream blocks in order.
9. Record execution evidence (trace, parser log, outcome).

## INVARIANTS (must survive into Ω)
- I-1 Ordering preserved across the turn.
- I-2 Identity preserved (conversation, messages, provider message id linkage).
- I-3 Message content preserved byte-exact through normalize→block→finalize.
- I-4 Exactly-once delivery intent (no silent duplicate sends; duplicates are
  detectable via identity, full dedup proof deferred L-4).
- I-5 No credential bytes reach durable evidence (redact-before-vault).
- I-6 Every failure is visible and deterministic (named error, no silent stall).

## FAILURES (must all be named, never silent)
- unavailable account / profile → refusal with code + sentence
- missing conversation → refusal
- selector miss on composer/send → retry_selector, then navigate_home, then refusal
- malformed/partial stream → parser fallback with logged depth, then refusal
- provider timeout → refusal with evidence
- unattached session / unpromoted realization / uncovered parser pin (Ω bars) → refusal

## SIDE EFFECTS
- Local persistence (conversation rows + telemetry) — intended.
- Chrome slave reuse/launch — intended, bounded.
- No other durable mutation (no external side effects beyond the provider turn).

## UNKNOWN (explicit)
- U-1 Attachment semantics for this slice.
- U-2 Exact completion-detection rule for ChatGPT streams.
- U-3 Dedup/replay exactness.
- U-4 Multi-turn context window behavior (out of slice scope by design).
