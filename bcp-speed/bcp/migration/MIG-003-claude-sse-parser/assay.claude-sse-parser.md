# Assay — MIG-003 Claude SSE streaming parser (VIVIM transform → Ω parser contribution)

> Shared legs cited from MIG-002 (SSE grammar, ContentPart model, confidence
> selection, fallback chain). This assay focuses on the TRANSFORM contract:
> what the parser consumes and emits, as an Ω `parser` contribution (D-355).

## A. Source locations (OBSERVED, hashes re-verified this session)
- `seeds/parsers/claude-streaming-sse.ts` (119 lines, sha 1321bf94… — matches
  MIG-002 pin, 0 drift): `parse(rawBody) → ContentBlock[]`,
  `detectCompletion` (message_stop/[DONE]), `getConfidence` (0/0.3/0.7/1).
- `src/schema/streaming.ts` (ContentPart union: text/reasoning/code/file/
  tool-call/tool-result/source/custom/error/meta/step-start + zod schemas +
  legacy-block migration).
- Selection: `stream-parser.ts` confidence-max selection + `resolveFallbackChain`
  (cycle-guarded, DB-backed, zero-DB hot path via generated protocol) — shared leg.

## B. Transform contract (OBSERVED from seed + schema)
- Input: raw SSE body text (Anthropic `data:` JSON lines).
- Grammar: message_start → content_block_start(text|thinking|tool_use|image)
  → content_block_delta(text_delta|thinking_delta) → content_block_stop →
  message_stop. `[DONE]` also terminates (OpenAI-compat).
- Output: ordered typed blocks (text/reasoning/tool-call/file/meta).
- Deltas append to the LAST block of matching kind, else push new.
- message_start mints meta(message_id); message_stop/error appends meta(stopped)
  unless tail is meta.
- Gaps (OBSERVED): unparseable lines SKIPPED SILENTLY; `input_json_delta`
  NOT handled (tool input never streams — snapshot-at-start only); empty parse
  falls back to raw-body-as-text (lossy, unmarked).

## C. Semantic requirement (implementation-independent)
Recorded Claude SSE text → ordered TYPED rows → exactly-one-final →
assemblable into one assistant message with reasoning channel intact.
Fail-closed: unterminated/empty streams refuse (Ω parser law, T-04 precedent).

## D. Intentional divergences from VIVIM (all documented, none silent)
1. Raw-body fallback → REFUSE (lossy downgrade becomes named error).
2. Silent line-skip → rows still skipped (faithful) BUT the transform reports
   `skippedLines` count in the done row (observable, MIG-002 I-7).
3. No clock, no DB, no transport (D-354 isolation — the seed already complies).
4. `input_json_delta` out-of-domain for BOTH V1/V2 (shared limitation, UNKNOWN
   carried — not invented).

## E. Invariants
I-1 same input → byte-identical rows, V1 and V2. I-2 exactly-one-final
(envelope-enforced). I-3 typed provenance (no silent text-merge). I-4 refuse
empty/unterminated. I-5 determinism (no clock/random/ports).
Confidence: OBSERVED (seed+schema); I-1 proven by differential test (see report).
