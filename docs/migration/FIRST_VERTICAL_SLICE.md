# First Vertical Slice — MIG-001: ChatGPT send_message → Ω

> The slice that teaches BCP what the migration machine must become.
> Honest proof ladder: STATIC + INTEGRATION(recorded-fixture) claimed;
> LIVE explicitly UNVERIFIED with the exact unblock step named.

## 1. Why this capability

- Exists substantially in the prototype: TWO parallel representations
  (manifest + plugin, both OBSERVED) — richest assay target in the tree.
- Observable behavior: typed text reaches ChatGPT; streamed response returns;
  conversation persists. Falsifiable end to end.
- Exercises meaningful Ω architecture: archetype slug, realization lifecycle,
  four send bars, parser pins + governed fence, session attach/release, vault
  provenance, stream sequence discipline, composition grants — 8+ laws in one turn.
- Not trivial: dual-path contradiction + DB-only parser law + redaction ordering
  + profile identity make it the hardest honest first slice, which is the point.
- Testable without live credentials: recorded-fixture integration proves the
  contract path; live proof is deferred with its own unblock procedure ( §6 ).

## 2. Exact execution path (MIG-001 contract)

```
Ω caller
  → message.send@1 {sessionId, to, subject, body}   [pack-schema inputs, fail-closed]
  → bar 1: day-one fence holds (forbidden entries registered at onInit)
  → bar 2: session attached (row resolves, ATTACHED, provider browser, archetype message.send)
  → bar 3: realization PROMOTED (verify-written, never self-declared)
  → bar 4: parser pin covers session + manifest versions (D-355/D-385)
  → replay emits ordered chunks via meta.emit (D-352 sequence discipline)
  → vault append ns "email"-today / chat-pack-schema future (pack-schema-exact + provenance refs)
  → Outcome {messageId, rev, sentAt, chunks} with EvidenceRefs
```

VIVIM knowledge feeding the slice (one-way adapter, never an import):
manifest chat endpoint (URL, composer, send button, composer type, send method),
plugin selector variants + typing policy + anti-detection note, capability
`chatgpt_send → send_message`, recovery strategies, model list — all pinned in
`bcp-speed/bcp/migration/MIG-001-chatgpt-send-message/` with source hashes.

## 3. Exact files touched (this slice — additive only, zero Ω core edits)

```
docs/migration/VIVIM_FORENSIC_MODEL.md        (new — Phase 0 ground truth)
docs/migration/VIVIM_TO_OMEGA_MAPPING.md      (new — concept + runtime matrices)
docs/migration/CHROME_GOVERNOR_CONTRACT.md    (new — G-1..G-17, mech vs doc)
docs/migration/PROVIDER_DATA_MODEL.md         (new — 7 semantic layers)
docs/migration/FIRST_VERTICAL_SLICE.md        (this file)
docs/migration/MIGRATION_RISK_REGISTER.md     (new — risks with severity+action)
bcp-speed/bcp/migration/migration-record.schema.json   (new — minimal record)
bcp-speed/bcp/migration/MIG-001-chatgpt-send-message/  (new — record + artifacts)
bcp-speed/bcp/migration/verify_migration.py            (new — deterministic checks)
```

Ω tree (`omega-baseline/`), VIVIM tree (`vivim-original-baseline/`), BCP state
YAMLs (hand-edit forbidden — only via `bcp_tool.py`), and the B5-frozen host
are untouched. No new Ω contract, no new registry, no monolith import.

## 4. Exact contracts introduced / reused

- Introduced: NONE in Ω. The slice reuses 6 existing contract surfaces
  (§4 of the mapping doc) and introduces exactly one BCP-side schema
  (migration record) — forge machinery, not runtime law.
- Reused: `message.send@1`, `browser.attach/release@1`, `ProviderRealization`,
  `RealizationStatus`, `EvidenceRef`, `CompositionSpec/Recipe`, D-355 pins,
  D-385 fence, D-352 sequencing, D-386 containment probe.

## 5. Exact verification procedure

```
1. python bcp-speed/bcp/migration/verify_migration.py   # deterministic, offline
   checks: record schema conformance; source-hash presence; UNKNOWNs explicit
   (no inferred→proven promotion); Ω contract names resolve against
   omega-baseline/omega-final/contracts/src; no VIVIM-source import in new code;
   proof ladder labels honest (fixture ≠ live).
2. python bcp-speed/bcp/validate.py                     # BCP state still healthy
3. python bcp-speed/bcp/sweep.py                        # dry run, expect no drift
4. Recorded-fixture integration (Ω side, existing harness — W1 pattern):
   bun run omega:fixtures:check                          # 4/4 recorded rows (pre-existing)
```

## 6. Exact evidence generated

- `migration-record.json` (schema-pinned) + `assay.chatgpt-send-message.md`
  + `behavior-spec.chatgpt-send-message.md` + `omega-mapping.json` +
  `verification-report.md` — all under the MIG-001 directory.
- BCP `discovery add` entries (via `bcp_tool.py`, never hand-edited) for the
  dual-path finding and the DB-only parser law.
- Proof ladder in the record: STATIC: PROVEN (verify script green) /
  INTEGRATION: PROVEN-recorded-fixture / LIVE: UNVERIFIED (see below) /
  REGRESSION: UNVERIFIED.

## 7. Known limitations (explicit, not buried)

- L-1 LIVE UNVERIFIED: no authenticated ChatGPT profile + live Chrome run was
  performed in this environment. Unblock: existing profile infra +
  `browser.attach → message.send → parser → persist` live run with trace +
  ParserExecutionLog, witnessed by an independent verifier. Nothing in the
  slice pretends otherwise.
- L-2 Manifest-vs-plugin authority unresolved (UNKNOWN carried, adapter verdict).
- L-3 ChatGPT stream grammar + completion detection not assayed to pin level.
- L-4 Dedup/replay, auth recovery, reconnect exactness not proven.
- L-5 Chat pack-schema for vault message rows does not exist yet (email exact
  today); slice writes are fixture-level, not vault chat rows.

## 8. Next two conformance steps

- Migration #2 (per Master Prompt 2): Claude `send_message` — different composer
  (contenteditable/ProseMirror), different stream format, different parser,
  different recovery. Tests whether MIG-001's machinery generalizes or merely
  encoded ChatGPT. Must reuse the record schema + verify script unchanged or
  record exactly why they changed.
- Migration #3: Gemini `send_message` (Quill composer, button submit,
  Google stream transport) — completes the provider-variation triangle and
  forces the manifest-vs-plugin authority verdict.
