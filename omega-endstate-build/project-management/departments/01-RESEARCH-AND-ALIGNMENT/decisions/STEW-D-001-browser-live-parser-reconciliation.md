# STEW-D-001 — Reconcile the browser live parser, do not delete it

> Agent: STEW-01
> Date: 2026-09-28
> Status: PROPOSED — awaiting independent verification before implementation
> Authority: branch-local design decision for `team/omega-endstate`
> Evidence: `state/REALITY-AUDIT-STEW-01.md` §2
> Affects: `omega-baseline/omega-final/plugins/provider-browser/src/live.ts`

## Prior authority

`P1-08` implementation commits `1507e9e7`, `9ff6142f`, `4d34a611`; manifest contract in
`plugins/provider-browser/plugin.json`; parser pin rationale `D-355` (M7).

## Problem

`live.ts` declares `parseChatGptStream` twice in one module scope and therefore fails to load
with `SyntaxError: Cannot export a duplicate function name`. The browser composition's M0
falsifier (`D-357`) fails and compartment `vivim.law` crashes.

## Options considered

**A. Delete the re-export (lines 20–21), keep the local function.**
Cheapest. Rejected: the local function at line 529 is already bypassed on the live path, which
calls `resolveParser(PARSER_VERSION).transform(...)` at line 676. Keeping it preserves a second,
divergent parse implementation and leaves the `D-355` pin unenforced by the module surface.

**B. Delete the local function (line 529), keep the import + re-export.**
Cheapest, and restores a single pinned parser. **Rejected as incomplete:** the local variant
returns `{ providerMessageId?, chunks }`; `parsers.ts:118` returns only `ParsedChunk[]`.
`providerMessageId` is a declared live-only field in `plugin.json` and is carried by
`LiveSendResult`. Option B silently drops a declared capability.

**C. Reconcile: keep the pinned parser as the sole chunk producer; retain `providerMessageId`
extraction as a thin, separately-named concern in `live.ts`.**
Preserves the `D-355` pin, preserves the declared result field, and leaves exactly one parse
implementation.

## Decision

**Option C.**

`live.ts` will:
1. import `PARSER_VERSION` and `resolveParser` from `./parsers.ts`;
2. drop the local `parseChatGptStream` declaration and the conflicting re-export;
3. keep `providerMessageId` extraction, exposed under a distinct name (e.g.
   `extractChatGptProviderMessageId`) so the module surface no longer contains two
   same-named parse entry points;
4. continue to source ordered chunks from `resolveParser(PARSER_VERSION).transform(...)`, so the
   fixture-replay and live-SSE legs remain covered by one version pin.

## Explicitly branch-local

This repairs a defect that is **also present on `origin/main`** (ancestor `4d34a611`). Repairing
it here does not change `main`. If this is correct, it is a candidate for a separate
mainline-targeted change; that decision is not made by this record.

## Verification required before merge

- `bun test plugins/provider-browser` — 16/16, M0 falsifier green, no compartment crash.
- A test asserting `providerMessageId` survives the live parse leg (it is currently untested
  independently of the crash, which is why the break went unnoticed).
- A mechanical guard against duplicate exported/imported module-scope names, so this class of
  break cannot recur silently. Candidate: a `tooling/gates/` check, since the project already
  maintains that surface.

## Falsifier

If, after reconciliation, the live leg cannot produce `providerMessageId` from the ChatGPT SSE
body, then Option B was correct and the field was never reliably derivable — in which case the
`plugin.json` declaration, not the code, is what must change.
