# Final Decision Report — Prompt 03 forensic integration (Phase 20)

## 1. Is VIVIM's Provider/Capability/Chrome architecture coherent enough to migrate into Ω?
PARTIALLY — and the incoherent parts are now named, which is the point. The
DATA plane is coherent (manifest→DB→generated→hot-path, one direction; turn
lifecycle with mechanical dedup; typed stream grammars). The AUTHORITY plane
is not: Governor bypasses (raw transport consumer, harness-inner tier),
account-blind slave resolution on the execution path, broken-by-default auth
recovery, 7 capability representations. Migrate the data plane with confidence;
migrate authority requirements (not shapes) with explicit Ω-side enforcement.

## 2. Which parts are genuinely reusable knowledge rather than legacy implementation?
Knowledge (port as data): provider endpoints/selectors/composer policies,
recovery chains, SSE grammars + completion rules, model lists, identityHash
dedup discipline, exactly-once intent, per-(provider,account) profile mapping.
Implementation (do not port): plugin classes, static catalogs as authority,
harness-inner raw-send pattern, non-reentrant mutex usage, best-program
mutability without version pins, silent-skip parser behavior.

## 3. Is ChromeGovernor the correct long-term browser authority for Ω, or must it be transformed?
TRANSFORMED. Keep its requirements (single I/O funnel, per-slave
serialization, circuit breaking, trace, profile identity, health/reconnect);
do NOT keep its shape. Ω must enforce mechanically what VIVIM documents:
no raw-transport escape (or a permissioned, audited one), reentrant-safe
sequencing, account-aware resolution, no vacuous-success actions. The Governor
is the requirements document, not the template.

## 4. Is ProviderDefinition → CapabilityBinding → CapabilityProgram good enough to become Ω's provider realization model?
YES as the semantic skeleton, with two amendments: (a) program resolution must
pin versions, not mutable "best" (provenance demand); (b) the missing
discovery→program/selector bridge must be built (discovered providers are
unexecutable today). Ω's realization lifecycle (PROMOTED-verify-written) is
already the stricter form — adopt it, don't retrofit VIVIM's.

## 5. What should happen to the Prisma schema?
Per-table (Phase 16): PORT semantics of ProviderDefinition/Endpoint/Parser/
StreamConfig/Binding/Program/Selector/Conversation/Message/Block as op-map +
pin + record data. PARTITION runtime/telemetry/history-sync state. RETIRE
authority claims of duplicate registries. COMPRESS the 200 models to
referenced-not-copied. Never a wholesale port.

## 6. Minimum new machinery required in Ω?
(a) Block-kind vocabulary (U-5/I-7) — human/Ω-design decision, agent must not
invent. (b) Account-aware session resolution (Q5 fix at the contract).
(c) Version-pinned program resolution. (d) Reentrancy-safe action sequencing
(deadlock lesson). (e) Nothing else — two migrations needed zero new contracts.

## 7. What does BCP still lack to perform this migration repeatedly?
Per 00-AUDIT + factory docs: behavior-spec/canonicality/mapping/disposition
state concepts (6 REDs), verifier gating on migration leases, legacy→Ω dep
edges, assay templates (correctly deferred). NEW from this prompt: a finding
severity pipeline (today's Q1–Q10/deadlock/broken-recovery findings live in a
doc, not in BCP state) and a pin-helper (manual sha+line pinning per file).

## 8. Exact next migration after ChatGPT (= Claude, done) — and after that?
MIG-002 done (verified). Next: MIG-003 Gemini (Quill, button-submit, Google
transport — completes the triangle AND forces the representation-authority
verdict, now decidable: generated-protocol-live). Then MIG-004: first
NON-provider slice (recommended: snapshot/program resolution — pins versions,
kills "best"-mutability, exercises BCP's missing state concepts directly).

## Stop conditions — checked, none triggered
- Ω has a suitable execution seam: YES (message.send bars, proven ×2).
- Governor boundary preservable: YES as requirements (transformed, §3).
- Provider model contradiction: RESOLVED (generated-protocol live path found).
- Stream model loss: NO (typed blocks preserved as requirement I-7).
- ChatGPT path live-provable: BLOCKED environmentally, unblock documented —
  not hidden, not hacked. This is a deferral, not a stop.
- Monolith import required: NO (0 Ω core edits across 2 migrations).

## Testing status (Phase 18) + live conformance (Phases 12–13)
Existing VIVIM tests: untouched paths — no VIVIM code modified, nothing to
regress. Ω tests: untouched (0 core edits). New adapter tests: deterministic
checker (--all green ×2 records). Live ChatGPT/Claude runs: BLOCKED — no
authenticated profiles + Chrome in this environment; unblock = profile infra +
browser.attach → message.send → parser → persist with trace + parser log,
independent witness. Replay/failure-injection/restart/CDP-disconnect/selector-
miss/parser-fallback/partial-stream/timeout suites: deferred to the live run by
design (fixture cannot prove them; claiming otherwise would be dishonest).
