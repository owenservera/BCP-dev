# Assay — MIG-001 ChatGPT send_message (what the legacy subsystem actually does)

> Method: source inspection (OBSERVED) + inference labeled as such.
> Every claim carries confidence; nothing inferred is presented as proven.

## A. Source locations (all OBSERVED, hashes in migration-record.json)

- Declarative: `seeds/providers/manifests.ts` (1221 lines, sha e1cc3418…)
  ChatGPT block: slug/auth/fleet/capabilities/endpoints/models/recovery.
- Imperative: `src/engines/providers/plugins/chatgpt.ts` (59 lines, sha d8c63c5e…)
  ChatGPTPlugin: urls/selectors/composer/typing/anti-detection/capabilities.
- Registrar/wiring: `src/engines/provider-registrar.ts` (406 lines, sha 06d3c123…).
- Browser authority: `chrome-governor.ts` (801) + `chrome/cdp-proxy.ts` (373) +
  `executor/fleet-supervisor.ts` (655) + `executor/cdp-transport.ts` (336).
- Stream: `src/engines/stream-parser.ts` (601 lines, sha ea496614…).
- Conversation: `src/engines/conversation-manager.ts` (1166 lines, sha 546fe934…).
- Binding: `unified-registry.ts` (232) + `capability-binder.ts` (66).
- Data: `prisma/schema.prisma` (4157 lines, 200 models, sha dc1f4d61…).

## B. Entry points / inputs / outputs / side effects

- Entry (INFERRED, needs runtime trace): intent `send_message` → binding
  `chatgpt_send` → program → recipe → harness → Governor → CDP → chatgpt.com.
- Inputs (OBSERVED from manifest+plugin): provider=chatgpt, account (per_account
  profile), conversation identifier, body text, model selection.
- Outputs (OBSERVED): streamed response blocks → final assistant message;
  trace/fleet/health rows; parser execution log rows.
- Side effects (OBSERVED): Chrome slave launch/reuse; profile cookie use;
  vault/DB persistence of conversation + telemetry.
- Error behavior (OBSERVED): retry_selector + navigate_home recovery;
  parser fallback chain with ParserExecutionLog; circuit breakers (mechanism).
- State changes (OBSERVED): conversation/message/block rows; session rows;
  health/telemetry rows.
- Observable user behavior (INFERRED): typed prompt appears in ChatGPT composer,
  send triggers streaming reply, reply persists in conversation order.
- Tests/fixtures (OBSERVED inventory): unit/integration/e2e/arch/fuzz exist;
  slice-relevant live test does not exist yet (gap, not claim).
- Unknowns (UNKNOWN): live path authority (manifest vs plugin); completion
  detection exactness; dedup/replay; auth recovery production-readiness.

## C. Invariants extracted (confidence-tagged)

1. Composer addressing is triple-redundant on both paths (OBSERVED).
2. Parser logic loads from DB only; fallback chain is cycle-guarded (OBSERVED).
3. Cookie files are login truth, not DB rows (OBSERVED invariant).
4. One profile per (provider, account) (OBSERVED invariant).
5. Governor is the claimed sole CDP authority (DOCUMENTED — scan outstanding).
6. Ordering/identity/content preservation across the turn (INFERRED requirement —
   the semantic core MIG-001 must preserve; proven only by future live run).
