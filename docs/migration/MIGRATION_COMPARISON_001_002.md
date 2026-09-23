# Migration #1 vs #2 — generalization comparison (Prompt 2, §21)

> Question: did we build a genuine migration mechanism, or merely encode
> Migration #1? Evidence below.

## Structural difference (why #2 is a valid test)
| Axis | MIG-001 (ChatGPT) | MIG-002 (Claude) |
|---|---|---|
| Composer | textarea `#prompt-textarea` | ProseMirror contenteditable |
| Typing policy | textarea, delayMs 50 | contenteditable, delayMs 30 |
| Recovery chain | retry_selector → navigate_home | + extra retry_with_fallback(textarea) edge |
| Stream grammar | not assayed to pin (L-3) | SSE typed blocks, message_stop rule (OBSERVED) |
| Content model | single-kind (assumed) | text/reasoning/tool-call/file/meta |
| Representations | dual (manifest + plugin) | TRIPLE (+ unified interface) |
| New semantic | — | I-7 typed-block provenance; silent-skip defect |

## Reuse measurement
| Item | #1 cost | #2 cost | Verdict |
|---|---|---|---|
| Governor/CDP chain assay | 4 files pinned + hashed | 0 (SharedLeg cite) | REUSED |
| Stream fallback-chain assay | pinned + hashed | 0 (cite) | REUSED |
| Conversation lifecycle | pinned + hashed | 0 (cite) | REUSED |
| Binder/registry wiring | pinned + hashed | 0 (cite, authority-Q extended) | REUSED |
| Ω provider/recipe/plugin legs | 4 files pinned | 0 (cite) | REUSED |
| New pins required | 16 | 8 (all Claude-differentiating) | 50% fewer pins for equal rigor |
| Record schema change | created | none (conformed unchanged) | GENERAL |
| Checker change | created (hardcoded) | generalized --record/--all, back-compat green | GENERALIZED (1 fix) |
| New Ω contracts | 0 | 0 | mechanism holds: data moves, law doesn't |
| Ω core edits | 0 | 0 | boundary holds twice |

## Manual vs deterministic split, #2 vs #1
Deterministic (unchanged set): V-1..V-6 re-ran unmodified on a new record.
Newly deterministic: cross-record verification (--all), registry status.
Still agent judgment (correctly): source selection, confidence tags,
canonicality, mapping, I-7 framing, risk calls. Still human: OBSOLETE verdicts,
commit approval, live witness, block-kind vocabulary decision (U-5 — explicitly
NOT invented by the agent; deferred to Ω design).

## Generalization failures found and fixed
1. **Checker hardcoded MIG-001 path** (found during #2 setup, before any claim).
   Fixed: `--record` / `--all`, V-3 hoisted to global-once. Back-compat
   verified (default invocation byte-identical output shape). No record-specific
   branches were needed for #2 — the fix generalized on first contact.
2. **No record registry** (found: --all globs directories; nothing tracks
   lifecycle status). Fixed: `index.json` (id → status → record path).
   Promotion to `state/migrations.yaml` + sweep guards still deferred —
   two examples justify a registry file, not a state-table migration.
3. **NOT fixed (deliberately):** assay/spec prose templates. Two migrations show
   similar shapes but #2's I-7 proves new semantics still appear per provider;
   templating now would freeze the wrong shape. Revisit after #3 (Gemini).

## Friction log (self-improvement input, §20)
- Manual: sha256 + line-count pinning per file (8 files × shell) — reusable
  tooling opportunity (pin helper emitting record-ready JSON).
- Manual: contracts_touched accuracy depends on agent having actually read the
  files — checker verifies names resolve, not that content was understood.
  Accepted: understanding is agent judgment by design.
- One-off: triple-representation discovery — watch whether Gemini makes it a
  pattern (then it becomes ontology: RepresentationVariant).
- Human-required: block-kind vocabulary (U-5), OBSOLETE verdicts, live witness.

## Conclusion
Genuine mechanism, scoped honestly: the record schema + checker + registry +
SharedLeg citation carried a materially different migration with half the new
pins, one real generalization fix, zero Ω edits, and no silent promotions.
The factory is proven for the provider-variation class; non-provider
migrations (browser authority, discovery machinery, storage) remain untested —
that is what #3 (Gemini, completes the triangle) and #4 (first non-provider
slice) are for. Scale (backlog inventory) is NOT yet justified: 2/2 provider
slices ≠ all migration classes.
