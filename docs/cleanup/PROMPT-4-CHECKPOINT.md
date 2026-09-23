# PROMPT-4-INTERRUPTED — checkpoint (master cleanup task, §3–§4)

> Status of this document: CURRENT (cleanup evidence). Status of Prompt 4:
> **PROMPT-4-INTERRUPTED** — paused, not complete. Nothing below is DONE,
> VERIFIED, CURRENT, or RATIFIED unless an authoritative record says so.

- Last known pre-Prompt-4 commit: `18242a3` (Prompts 1–3).
- Interruption boundary commit: `1a0293d` (owner cleanup; did not touch Prompt-4 files).
- Working tree at freeze: 1 modified tracked file + 5 untracked Prompt-4 paths
  (+2 pre-existing untracked: `bcp-algos/`, `setupdocs.zip` — NOT Prompt 4).
- Claimed objective: prove Ω implementation-replaceability (echo V1→V2) then
  forge the first VIVIM-derived plugin (Claude SSE parser V1+V2, MIG-003).
- Completed: Phases 0–2 (reads + 2 analysis docs), echo2 plugin + 8/8 green
  substitution suite, both parser plugins + 19/19 green (unit + differential),
  MIG-003 assay/spec/mapping (NO record, NO verification-report).
- Incomplete: parser conformance-test edit (v1 test file edited to add
  runConformance import, never re-run), experiment doc
  (OMEGA_REPLACEMENT_EXPERIMENT.md never written), composition A/B committed
  nowhere (test-only specs only), MIG-003 record, graph update, decision report,
  Gemini decision, any commit of Prompt-4 work.
- Validation status: echo2 8/8 + parsers 19/19 green AT INTERRUPTION (bun
  runs, this session); conformance runner NOT yet executed on parser dirs;
  `omega:quick` NOT re-run after plugin additions (genome-count sensitivity
  unverified — see C13); migration verifier NOT run on MIG-003 (no record).
- Architectural dependencies: `@vivim/omega-sdk` (validateComposition, test
  only), `@vivim/omega-testkit` (runConformance + FakeHost types),
  `@vivim/omega-contracts` (ParsedChunk, buildChunkEnvelope),
  `@vivim/omega-shim` (definePlugin), `@vivim/omega-platform` (omegaTmp).
- Known uncertainty: whether `plugins/parser-claude-sse*/` disturb the genome/
  composition-count gates; whether `parser:chat.complete:claude-sse` pin
  surface collides with provider-llm's `chat.complete` parser resolution;
  MIG-003 numbering vs Gemini-as-MIG-003 (Prompt 4 §6 vs §17 tension, undecided).

## Per-change classification

| PATH | ORIGIN | COMMIT? | PURPOSE | P4 OBJECTIVE | DEPS | ASSUMPTIONS | AUTHORITY | STATUS |
|---|---|---|---|---|---|---|---|---|
| `omega-…/docs/architecture/` (2 docs) | Prompt-4 Phases 1–2 | uncommitted | replaceability model + echo boundary trace | Phase 1–2 deliverables | contracts/manifest+recipe, matrix, notes/llm tests (read) | SDK-as-validation-layer (VALID — anvil, D-404); testkit-as-conformance (VALID) | cleanup agent (unratified analysis) | KEEP |
| `omega-…/examples/plugin-echo2/` (5 files) | Prompt-4 Phase 3–5 | uncommitted | V2 echo impl + substitution suite | prove routing-level substitution | sdk/testkit/contracts/shim/platform (test+runtime) | test-only specs avoid the 18-freeze (VALID); examples/ outside gate counts (VERIFY — quick not re-run) | uncommitted code + green suite | KEEP-BUT-RECONCILE (needs §33 SDK-symbol check + gate re-run) |
| `omega-…/plugins/parser-claude-sse/` (11 files) | Prompt-4 Phase 9 | uncommitted | VIVIM-derived parser V1 | first VIVIM-derived plugin | contracts/shim (runtime); testkit (fixture types) | harvested stamp mine=BCP-dev@e724a51 (VALID — bytes verified); parser-kind non-routable (VALID, D-355) | uncommitted code + green unit suite | KEEP-BUT-RECONCILE (conformance not yet run; genome-count check) |
| `omega-…/plugins/parser-claude-sse-v2/` (7 files) | Prompt-4 Phase 10 | uncommitted | independent V2 | prove parser substitution | same as V1, zero V1 imports in prod src (VALID — one TEST-ONLY relative import, flagged in-file) | decode-then-fold ≡ tail-mutation (PROVEN by differential, 19/19) | uncommitted code + green suite | KEEP-BUT-RECONCILE (same as V1) |
| `bcp-speed/bcp/migration/MIG-003-claude-sse-parser/` (3 files) | Prompt-4 Phase 7–8 | uncommitted | assay/spec/mapping | migration record foundation | MIG-002 record (SharedLeg) | assay discipline (VALID — confidence-tagged, no promotion) | unratified draft | KEEP (incomplete by design of interruption — record + report still to write on resume) |
| `omega-…/bun.lock` (+37) | `bun install` (Prompt-4 session) | uncommitted modification | workspace links for 3 new packages | test executability | — | lockfile regen is mechanical (VALID) | generated | KEEP (commit WITH the plugins or not at all — never separately) |
| echo2 test edit (runConformance import) | interrupted mid-edit | uncommitted | conformance proof | Phase 4 | testkit | — | — | INVESTIGATE (re-run suite on resume; import resolved post-install) |

## What was NOT touched (verified)
VIVIM tree (0 modifications) · BCP state/log (untouched this session) ·
ratified D-records (none edited) · `compositions/*.json` (none added —
18-freeze intact) · host/contracts (0 edits) · prior cleanup docs (read-only).
