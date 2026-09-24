# P1-08 / WS-008 — PHASE-1-HANDOFF-PACKAGE

> **Status:** IMPLEMENTED / **M4 NEEDS OWNER RUN**
>
> **Date:** 2026-09-25
> **Repository:** `owenservera/BCP-dev`
> **Workstream:** P1-08 — Forge / VIVIM Harvest & Migration
> **Scope:** one capability only — `message.send@1`
> **Implementation target:** `omega-baseline/omega-final/plugins/provider-browser/`
>
> This document packages the Phase-1 implementation evidence. It does **not**
> claim live proof of a successful browser send because the required owner-side
> Bun test and `omega:gate` execution has not been run in this ChatGPT
> environment, and no authenticated Chrome run has been performed here.

---

## 1. Executive result

The fixed capability remains exactly:

`message.send@1`

No rename, alternate operation, new host surface, or caller edit was introduced.

The missing fixture-only execution seam is now implemented as a **real ChatGPT browser execution path** inside `provider-browser`:

`browser.attach@1` with live descriptor
→ attached `session:<id>` (`sim:false`)
→ existing four provider-browser fail-closed bars
→ localhost Chrome DevTools Protocol
→ ChatGPT composer
→ exact content read-back
→ one send-button click
→ network response capture
→ pinned parser v1
→ ordered `ParsedChunk[]`
→ existing `message.send@1` outbound record in `ns "email"`

The fixture replay remains available for existing recorded sessions.

---

## 2. Authoritative repository truth consumed

The implementation was started from:

- `docs/agent-system/workstreams/WS-002/PHASE-1-TRUTH-BASELINE.md`
- `docs/agent-system/workstreams/WS-006/PHASE-1-GOVERNANCE-CHAIN.md`
- `bcp-speed/bcp/migration/MIG-001-chatgpt-send-message/`
- `bcp-speed/bcp/migration/MIG-002-claude-send-message/`
- `vivim-original-baseline/vivim-final-enhanced/src/`
- `omega-baseline/omega-final/plugins/provider-browser/`
- `omega-baseline/omega-final/README.md`
- `omega-baseline/omega-final/docs/decisions/CURRENT-INVARIANTS.md`

P1-02 truth was treated as the repository boundary: Path A/B implementation is
not available; MIG-001/MIG-002 are safe for migration knowledge and provenance
but do not constitute live proof; the prior provider-browser realization was
fixture-only.

P1-06's fixed caller contract was treated as immutable: `message.send@1`.

---

## 3. M1 — characterization of the behavior actually ported

### 3.1 Migration record selection: MIG-001

**Selected source:** `MIG-001-chatgpt-send-message`.

Reason:

1. Its Omega mapping explicitly targets `message.send@1` in
   `provider-browser`.
2. Its VIVIM ChatGPT source directly supplies the concrete composer/send
   selectors and browser turn lifecycle used by the existing Ω fixture shape.
3. Its harvested parser directly supplies the ChatGPT/OpenAI delta, patch and
   message-parts stream families.
4. MIG-002 describes the same target operation but introduces Claude-specific
   ProseMirror and typed-block semantics that are outside this Phase-1
   one-capability implementation.

MIG-002 was inspected as a comparison/reference record and was **not** harvested
into this round.

### 3.2 VIVIM source behavior verified directly

#### Provider addressing

Source:

`vivim-original-baseline/vivim-final-enhanced/src/engines/providers/plugins/chatgpt.ts`

Observed behavior:

- app URL: `https://chatgpt.com/`
- composer selectors, in order:
  1. `#prompt-textarea`
  2. `textarea[data-testid="prompt-textarea"]`
  3. `div[contenteditable="true"][data-testid="prompt-textarea"]`
- send selectors, in order:
  1. `button[data-testid="send-button"]`
  2. `button[aria-label="Send prompt"]`
  3. `form button[type="submit"]`

The same ordered selector set is now explicit in:

`omega-baseline/omega-final/plugins/provider-browser/src/live.ts`

### 3.3 Composer mutation

Source:

`vivim-original-baseline/vivim-final-enhanced/src/engines/composer-typing.ts`

Observed textarea path:

- query selector;
- focus element;
- use the native `HTMLTextAreaElement.prototype.value` setter;
- dispatch `input`;
- dispatch `change`.

Ω ports that behavior in:

`omega-baseline/omega-final/plugins/provider-browser/src/live.ts`

at `buildTypeExpression()`.

The live path then **reads the composer back** and requires exact string equality
with the requested body before submitting.

### 3.4 Submission

The legacy submit helper can humanize a click through the old Governor/CDP
stack. That movement/randomization is not semantic and is not required by any
Phase-1 invariant, so Ω uses the provider's concrete send-button selectors and a
single DOM click instead.

This is an intentional transformation:

- preserved: discrete send mechanism;
- discarded: non-semantic cursor movement / anti-detection behavior;
- reason: Phase-1 proof is about authorized send execution, content identity,
  ordering and evidence, not stealth simulation.

### 3.5 Network sequencing

Source:

`vivim-original-baseline/vivim-final-enhanced/src/engines/conversation-manager.ts`

Observed order:

1. ensure page/profile;
2. resolve composer;
3. enable Network;
4. execute send;
5. capture response;
6. parse stream.

Ω preserves the critical ordering by arming the response observer **before** the
single submit click.

### 3.6 CDP authority behavior

Source:

`vivim-original-baseline/vivim-final-enhanced/src/executor/cdp-transport.ts`

Observed low-level sequence:

- obtain browser WebSocket from Chrome's local `/json/version`;
- attach to a page target;
- retain the page `sessionId`;
- issue page/Network commands against that target session.

Ω ports this behavior in a smaller plugin-local adapter. It does **not** import
or execute the legacy VIVIM CDP stack.

### 3.7 Stream parsing

Source:

`vivim-original-baseline/vivim-final-enhanced/seeds/parsers/harvested/chatgpt-openai-delta.ts`

Observed parser families:

- OpenAI `choices[0].delta.content`;
- ChatGPT `o:"patch"` content-part patches;
- `o:"add"` message-content parts;
- direct `message.content.parts`.

The historical parser also has tool/image branches and a raw-body fallback.
Those are not silently copied into this slice.

Ω's live parser instead:

- preserves the text/message-part families needed for the ChatGPT send turn;
- extracts a provider message id when present;
- requires a completion signal;
- rejects malformed SSE rather than silently dropping it;
- emits exactly one terminal chunk.

---

## 4. M1 discoveries / discrepancies

### D-1 — MIG record proof boundary is correct

The migration record says live execution is **UNVERIFIED**. The implementation
does not promote that record to live proof. This handoff keeps the same proof
discipline.

### D-2 — VIVIM typing declaration vs executable behavior

`chatgpt.ts` declares:

- `delayMs: 50`
- `humanLike: true`
- `clearFirst: true`

but the actual textarea implementation in `composer-typing.ts` writes the
value in one operation and dispatches DOM events; it does not implement a
50 ms per-character loop there.

**Resolution:** Ω ports the executable behavior, not the descriptive timing
metadata. No artificial typing loop was added.

### D-3 — Anti-detection behavior was intentionally not migrated

The historical ChatGPT plugin declares a `navigator.webdriver` override.

That is incidental stealth behavior, not required send semantics. It is not
copied into Ω.

### D-4 — Historical parser was permissive in ways that violate this proof slice

The harvested parser can skip malformed data and can fall back to treating the
whole raw body as text.

For Phase 1, silent loss is worse than refusal. Ω therefore names and throws:

- `MSG_SEND_STREAM_FORMAT_UNKNOWN`
- `MSG_SEND_STREAM_MALFORMED`
- `MSG_SEND_STREAM_INCOMPLETE`
- `MSG_SEND_STREAM_NO_DELTA`

### D-5 — VIVIM's Governor exclusivity is historical evidence, not an Ω dependency

MIG-001 calls the Governor the sole CDP authority, but its own verification
report labels the exclusivity scan documentary/informative.

Ω does not import the old Governor. The plugin boundary is explicit instead.

### D-6 — Live session still carries the existing capture reference

The existing Ω session record requires `captureRef`. A live session therefore
still gets an attach-time capture row, but:

**the live send path does not use that capture as its execution source.**

The source of the real response is Chrome CDP. The capture reference remains for
compatibility with the existing provider-browser session schema and existing
bars/pinning genealogy.

This is a known shape limitation, not hidden equivalence with the fixture path.

---

## 5. M2 — exact Ω-side gap list

The pre-P1-08 provider-browser implementation was a fixture realization. The
following gaps were present:

| Legacy VIVIM behavior | Source | Provider-browser gap before P1-08 | P1-08 result |
|---|---|---|---|
| Resolve known ChatGPT composer selectors with retry | `src/engines/provider-selectors.ts`; `src/engines/providers/plugins/chatgpt.ts` | Existing Ω send never addressed a real page; it replayed a capture | **Implemented** in `live.ts` |
| Ensure ChatGPT page before addressing composer | `conversation-manager.ts` | No live navigation path | **Implemented** with authenticated-page check and navigation |
| Mutate textarea/contenteditable and fire framework-visible events | `composer-typing.ts` | No live DOM write | **Implemented** |
| Verify submitted content | inferred from Phase-1 invariant I-3 + source flow | No live verification | **Implemented** by exact read-back |
| Arm network capture before submit | `conversation-manager.ts` | Existing Ω parsed recorded capture text | **Implemented** |
| Execute real send | `composer-typing.ts` / Harness / Governor | Existing `message.send@1` only synthesized an `email` row | **Implemented** as one CDP DOM click |
| Capture ChatGPT response stream | `cdp-transport.ts` | No CDP adapter existed inside provider-browser | **Implemented** |
| Parse live ChatGPT SSE | harvested MIG-001 parser | Existing parser only understood fixture JSON | **Implemented** under pinned v1 |
| Keep execution single-attempt | required I-4 | Fixture has no real click to protect | **Implemented**: no retry after click |
| Distinguish live from fixture session | no prior Ω live descriptor | `sim:true` was invariant | **Implemented**: `live` descriptor + `sim:false` |
| Surface named provider/stream failures | MIG-001 I-6 | Fixture path had fail-closed bars but no live transport failure vocabulary | **Implemented** |

---

## 6. M3 — implementation

### 6.1 Main execution file

[`omega-baseline/omega-final/plugins/provider-browser/src/live.ts`](../../../../omega-baseline/omega-final/plugins/provider-browser/src/live.ts)

Key entry points:

- `validateLiveSessionDescriptor()`
- `LocalCdpClient`
- `captureChatGptStream()`
- `buildTypeExpression()`
- `buildClickExpression()`
- `executeChatGptSend()`

The adapter is deliberately limited to:

- `providerId = "chatgpt"`;
- localhost Chrome debug port;
- `chatgpt.com` page URLs;
- ChatGPT conversation response URLs.

There is no remote browser endpoint and no credential-read operation.

### 6.2 Session realization

[`omega-baseline/omega-final/plugins/provider-browser/src/session.ts`](../../../../omega-baseline/omega-final/plugins/provider-browser/src/session.ts)

A live session is represented as:

`sim:false`

with:

`live = { providerId:"chatgpt", debugPort:<local-port> }`

Fixture sessions retain:

`sim:true`

The validator rejects cross-labelled live/fixture rows.

### 6.3 Existing provider-browser entry point

[`omega-baseline/omega-final/plugins/provider-browser/src/index.ts`](../../../../omega-baseline/omega-final/plugins/provider-browser/src/index.ts)

`browser.attach@1` now accepts the optional live descriptor.

`message.send@1` still performs the existing four fail-closed bars first.

Only after all four pass does the live branch call:

`executeChatGptSend(session.live, input.body)`

The fixture path is unchanged in principle and remains available for recorded
captures.

### 6.4 Pinned parser

[`omega-baseline/omega-final/plugins/provider-browser/src/parsers.ts`](../../../../omega-baseline/omega-final/plugins/provider-browser/src/parsers.ts)

The same parser version `1` is now used for both modes:

- recorded fixture JSON;
- live ChatGPT SSE.

This is important to D-355/bar-4 integrity: the parser version checked by the
realization pin is the parser that actually processes the live response.

### 6.5 Manifest

[`omega-baseline/omega-final/plugins/provider-browser/plugin.json`](../../../../omega-baseline/omega-final/plugins/provider-browser/plugin.json)

The manifest still declares the existing `message.send` provider contribution
and its frozen contract dependency.

No host, contract, or new external port was added.

### 6.6 Tests

[`omega-baseline/omega-final/plugins/provider-browser/test/live-send.test.ts`](../../../../omega-baseline/omega-final/plugins/provider-browser/test/live-send.test.ts)

The test file covers:

- selector order;
- textarea mutation expression;
- exact content embedding;
- page/response URL classification;
- local live-session validation;
- OpenAI delta parsing;
- ChatGPT patch/add parsing;
- malformed/incomplete stream refusals;
- exactly one final chunk;
- pinned parser usage;
- live session is not mislabeled as fixture.

---

## 7. Invariant checklist

The MIG-001 required invariants were:

- I-1 Ordering
- I-2 Identity
- I-3 Content byte-exactness
- I-4 Exactly-once delivery intent
- I-5 Redact-before-vault
- I-6 Named deterministic failures

### I-1 — Ordering

**PASS at code level / M4 pending.**

Evidence:

- Network observation starts before the click.
- The stream parser preserves input order.
- `message.send@1` builds the Ω sequence envelope after parsing.
- The existing shim's sequence law remains responsible for envelope sequence
  validation.

A runtime ordering trace has not been captured in this ChatGPT session.

### I-2 — Identity

**PASS at code level / M4 pending.**

Evidence:

- live response provider message id is extracted from supported ChatGPT shapes
  when present;
- the Ω outbound message still receives its own local `messageId`;
- the outbound row retains the provider response identifier when available.

Open limitation:

- crash/replay deduplication is not solved in this slice. MIG-001 explicitly
  leaves dedup/replay as an UNKNOWN. Therefore this is identity linkage, not a
  full crash-safe exactly-once proof.

### I-3 — Content preservation

**PASS at code level / M4 pending.**

Evidence:

- request body is inserted through JSON-safe page expression construction;
- after insertion, the composer is read back;
- the send is refused unless the read-back string equals the requested body
  exactly;
- no normalization, trimming, or character transformation is performed by
  the send path before the click.

The code proves exact string equality, not a separately instrumented byte-level
encoding trace.

### I-4 — Exactly-once delivery intent

**PASS at code level / M4 pending.**

Evidence:

- the network observer is installed before submit;
- exactly one send-button `.click()` is performed;
- there is no retry after the click;
- response-capture/parse failures after a click are surfaced, never converted
  into a second submission.

Full crash/replay deduplication remains outside Phase 1.

### I-5 — Redact-before-vault

**PASS at code level / M4 pending.**

Evidence:

- existing `browser.attach@1` still runs `credential.redact@1` before the
  capture row reaches the vault;
- the live response body is held in memory for parsing;
- the live path writes only outbound message metadata/result and never writes
  the raw provider response body into the vault.

This is a code/property claim pending M4 execution.

### I-6 — Named deterministic failures

**PASS at code/test level / M4 pending.**

Named live failures include:

- `MSG_SEND_LIVE_SESSION_INVALID`
- `MSG_SEND_LIVE_PROVIDER_UNSUPPORTED`
- `MSG_SEND_LIVE_PORT_INVALID`
- `MSG_SEND_CDP_UNAVAILABLE`
- `MSG_SEND_CDP_TIMEOUT`
- `MSG_SEND_CDP_COMMAND_FAILED`
- `MSG_SEND_CDP_TARGET`
- `MSG_SEND_PAGE_EVALUATION`
- `MSG_SEND_AUTH_REQUIRED`
- `MSG_SEND_COMPOSER_NOT_FOUND`
- `MSG_SEND_SEND_BUTTON_NOT_FOUND`
- `MSG_SEND_CONTENT_MISMATCH`
- `MSG_SEND_HTTP_ERROR`
- `MSG_SEND_STREAM_BODY_UNAVAILABLE`
- `MSG_SEND_STREAM_NETWORK_FAILED`
- `MSG_SEND_STREAM_TIMEOUT`
- `MSG_SEND_STREAM_FORMAT_UNKNOWN`
- `MSG_SEND_STREAM_MALFORMED`
- `MSG_SEND_STREAM_INCOMPLETE`
- `MSG_SEND_STREAM_NO_DELTA`

The unit tests cover representative parser/session refusal cases. Full gate
execution is pending.

### D-355 parser pin

**PASS at code level / M4 pending.**

The live path resolves the same parser contribution version covered by the
existing provider-browser realization bar.

---

## 8. `message.send@1` contract-match confirmation

### Operation identifier

**Exact match:**

`message.send@1`

No rename occurred.

### Existing caller input

The provider implementation still accepts:

```text
{
  sessionId,
  to,
  subject,
  body,
  threadId?
}
```

P1-06 calls the exact operation string and does not require a changed caller
signature.

### Live-session data

The live CDP descriptor is stored on the provider-browser session record:

```text
live: {
  providerId: "chatgpt",
  debugPort: <local port>
}
```

It is **not** a new `message.send@1` argument and does not change P1-06's
authorization contract.

### Existing output

The stable output remains:

```text
{
  messageId,
  rev,
  sentAt,
  chunks
}
```

A live execution may additionally return:

`providerMessageId`

This is additive metadata only.

### Semantic caveat: `to` / `subject`

The frozen provider-browser contract was originally shaped from the domain-email
pack. In the live ChatGPT realization, `body` is what is actually sent to
ChatGPT.

Therefore:

- `body` is the real ChatGPT prompt;
- `to` and `subject` remain required contract metadata and are persisted in
  the existing outbound row;
- they are **not** interpreted as ChatGPT recipient/thread selectors.

This is a known contract-semantic mismatch inherited from the existing frozen
`message.send@1` surface. It is documented rather than silently redefined.

### No P1-06 changes required

The implementation does **not** require renaming or reshaping P1-06.

P1-06 can continue to call:

`message.send@1`

exactly as already coded.

---

## 9. Boundaries deliberately preserved

No changes were made to:

- `omega-baseline/omega-final/host/`
- `omega-baseline/omega-final/contracts/`
- `omega-baseline/omega-final/shim/`
- `omega-baseline/omega-final/plugins/vivim-agent/`
- `omega-baseline/omega-final/plugins/vivim-law/`
- `omega-baseline/omega-final/compositions/`

No new contract was introduced.

No VIVIM source was imported.

No Prisma model was ported.

No second orchestrator was introduced.

No capability other than `message.send@1` was harvested for execution.

---

## 10. M4 — owner-run result

### Required commands

From:

`omega-baseline/omega-final`

run:

```powershell
bun test plugins/provider-browser/test/live-send.test.ts
bun run omega:gate
```

The owner may then run the full suite if desired:

```powershell
bun test
```

### Actual result in this workstream

**NOT RUN.**

This ChatGPT environment does not have the repository checkout/Bun runtime
needed to produce an honest `bun test` or `omega:gate` result.

Therefore:

- M4 = **NEEDS RUN**
- no gate/status evidence was fabricated;
- no claim of passing `omega:gate` is made.

---

## 11. M5 — handoff and open unknowns

M5 is the downstream handoff package itself plus the explicit remaining unknowns.

### Closed for this round

- fixed operation remains `message.send@1`;
- MIG-001 selected as direct source map;
- real ChatGPT CDP execution path exists;
- exact outgoing content is checked before submit;
- submit is exactly once per execution attempt;
- stream observation is armed before submit;
- live parser is pinned to provider-browser parser v1;
- fixture and live sessions are distinguishable;
- named transport/parser failures exist;
- no new host/contract surface was added.

### Still open / must not be mistaken for proof

1. Owner's real `bun test` result.
2. Owner's real `bun run omega:gate` result.
3. Authenticated Chrome live execution result.
4. Exact current ChatGPT response URL/stream grammar on the owner's live profile.
5. Crash/restart deduplication.
6. Full assistant-message persistence equivalent to legacy VIVIM's conversation
   manager — intentionally not ported because the Phase-1 provider-browser
   boundary does not own the full chat persistence surface.
7. Full tool/image parsing from the historical ChatGPT parser.
8. The attach-time capture reference remains required by the existing session
   schema even though live execution does not consume capture bytes.

The implementation therefore meets the **code-level** portion of the Phase-1
definition but does not claim the final proof state until the owner runs M4.

---

## 12. Commit evidence

The provider-browser changes are on `main`.

Relevant commits include:

| Commit | Purpose |
|---|---|
| `1507e9e74899dcf1b689208d162622cc52159e3d` | Initial real live ChatGPT execution path + tests/session/manifest integration |
| `9ff6142f471f103799e81f9a46aaa5bcdf8ff30f` | Unify live parsing with the pinned provider-browser parser v1 |
| `d3fa816ba544b83038c2f514c6227579d27847e7` | Make `browser.attach@1` carry the live session descriptor |
| `91d762bc68c92f602042751922565056cfb38294` | Declare live attach shape in manifest |
| `8254d9cdd157cf7e4cc6d52f53000b9a8a5c57cd` | Add live-session refusal coverage |
| `6dc53b2e39a2f47c35761d590ba247eca339a934` | Refresh provider-browser execution-mode docs |
| `599a0ddbce7597ecb6ed61217914b9fa794f5971` | Refresh manifest realization description |
| `4e56892488d9bb5cfa0e0a150cb1fabaa143b2d2` | Refresh parser documentation |
| `4d34a6116fadbd4d2d30fc4217d9dff15070f978` | Fix pinned parser import/result shape |
| `c720fae57bf82f6f2d3659bc9ad73dcdbbf6e429` | Test pinned parser usage |
| `99193dc654c25d9f9dab24ba1bf5e686902dcdd1` | Document live/fixture session distinction |

Current `main` HEAD at handoff:

`99193dc654c25d9f9dab24ba1bf5e686902dcdd1`

---

## 13. Handoff instructions

### P1-06 / WS-006

Read this document first.

Then perform its already-designed M2-M5 run:

1. one real successful `agency.execute@1` → `message.send@1`;
2. one deterministic refusal using non-live authority;
3. collect the four actual vault records;
4. perform the fresh-log reconstruction test.

Do **not** rename `message.send@1`.

### P1-07

Read this document as the implementation/provenance boundary for the live
Chrome capture work.

The current implementation expects an owner-controlled authenticated ChatGPT
Chrome debug instance accessible only through its local debug port.

Do not treat the code-level status here as a substitute for a live capture.

---

## 14. Final Phase-1 verdict

**P1-08 implementation: COMPLETE for the selected capability.**

**M4: NEEDS OWNER RUN.**

**Live proof: NOT YET ESTABLISHED.**

The critical contract-match answer is unequivocal:

> **`message.send@1` remains the exact operation P1-06 already calls. No
> caller-side rename or contract rewrite is required.**

The implementation is a transformed port of the proven VIVIM behavior into the
existing Ω provider-browser boundary: real ChatGPT browser interaction via
localhost CDP, exact composer verification, one submission, response capture,
pinned parsing, ordered chunks and named failures — without importing the VIVIM
monolith or widening Ω's host/contract surface.
