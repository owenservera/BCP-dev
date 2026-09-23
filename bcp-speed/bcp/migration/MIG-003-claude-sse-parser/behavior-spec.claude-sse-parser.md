# Behavioral Specification — Claude SSE parse (implementation-independent)

## CAPABILITY
Transform recorded Claude SSE stream text into ordered, typed ParsedChunk rows
with exactly one final row, or refuse with a named error.

## INPUTS
- text: non-empty string (recorded SSE body; fixtures only, never live network)

## BEHAVIOR
1. Split into lines; consider `data:` payloads only.
2. message_start → meta(message_id) row.
3. content_block_start → typed row (text/reasoning/tool_use/file per block type).
4. content_block_delta → append text/thinking to the matching tail row, else push.
5. content_block_stop → close current block (no row).
6. message_stop or [DONE] → done row (final:true) carrying block count,
   terminator kind, skipped-line count.
7. Refuse: empty input, zero `data:` lines, zero emitted rows, unterminated
   stream (no message_stop/[DONE]).

## INVARIANTS
- I-1 Determinism: identical text → identical rows (both implementations).
- I-2 Exactly-one-final: last row final:true, no other final row.
- I-3 Typed provenance: reasoning/tool_use/file rows never merge into text.
- I-4 Fail-closed refusals with the reason in the message.
- I-5 Purity: no clock, no network, no ports, no vault (D-354).

## FAILURES (named)
- `empty-stream` · `no-data-lines` · `zero-rows` · `unterminated-stream`
  (names the last frame kind observed, mirroring the llm-parser precedent).

## UNKNOWN (explicit)
- U-1 `input_json_delta` streaming (out-of-domain both versions).
- U-2 Multi-message bodies in one text (single message_stop assumed).
- U-3 `[DONE]`-after-message_stop ordering variants in the wild.
