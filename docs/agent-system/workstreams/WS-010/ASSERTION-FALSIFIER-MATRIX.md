# WS-010 Round 2 — Assertion Falsifier Matrix

> **Classification: DERIVED — PROPOSED (WS-010 research, not authority)**
> Tests the nine observation dimensions against the 15-object corpus.
> Cell values: PASS · QUALIFIED (handles with recorded correction → reference)
> · FAIL (model mishandles; none found — see verdict file).

## X-APPL — kind × axis applicability (where N/A is legal)

N/A is allowed ONLY where this table says so; everywhere else a missing
value must be UNKNOWN (applicable-but-unsourced), never blank, never a
guessed enum.

| Kind | A1 authority | A2 lifecycle | A3 operational | A4 epistemic | A5 freshness | A6 origin | A7 visibility | A8 ownership | A9 governance |
|---|---|---|---|---|---|---|---|---|---|
| Workstream | req | req | req | req | req | req | req | req (may be UNKNOWN) | req |
| BCP capability | req | depth+n/a-note* | req | req | req | req | req | req (may be UNKNOWN) | req |
| BCP experiment | req | req | req | req | req | req | req | req (may be UNKNOWN) | req |
| Decision record | req | req | N/A | req | req | req | req | N/A (ratifiers in Evidence) | req |
| Genome layer | req | req | N/A | req | req | req | req | N/A | req |
| Commit / PR | req | req | N/A | req | req | req | req | N/A (authors≠owners) | req |
| Agent (any scope) | req | req | req | req | req | req | req | N/A (tasked, not owned) | req |
| Packet / handoff | req | req | N/A | req | req | req | req | associated-only | req |
| Migration record | req | req | N/A | req (per-claim) | req | req | req | associated-only | req |
| Unindexed work (C11) | req | honesty-label† | req (may be UNKNOWN) | req | req | req | req | req (may be UNKNOWN) | req |
| Proposition-pair (C12) | req (per-side) | per-side | N/A | req (per-side) | req (per-side) | req | req | N/A | req (resolution owner) |
| Gap/unknown (C15) | req | N/A | N/A | req (=unknown) | req | N/A | req | req (=unknown) | req |

\* Capability "lifecycle" = depth-scale position + experiment-status of
participating experiments; the two are stored separately, never fused.
† `unindexed-work` is an honesty label, not an enum value (C11).

## X-ROWS — dimension probes (one per axis, corpus-witnessed)

- **X-A1 authority-separation.** Packet claims vs gate verdicts vs RATIFIED
  law on one card (C9 vs C5): three authority tiers co-render, law on top
  by AGENTS.md hierarchy, no promotion. PASS.
- **X-A2 no-collapse.** C10 carries index-status + four proof-quad values +
  per-observation confidences without fusing; C2 carries registry-status +
  charter-status separately. PASS.
- **X-A2-homonynm.** `merging` renders only as `merging@sweep-depth-math`
  (C4's experiment has no such token — proposed ≠ merging); `verified`
  only as `verified@<mechanism>` (gate vs fixture vs record). PASS.
- **X-A3 motion-vs-rest.** C4 (gate OPEN, c1 unspawned) renders parked-wait,
  not motion; C7-commit renders N/A, not idle-guessed. PASS.
- **X-A4 inference-tags.** C14 kinship tagged `H-PATHSIM · rejected`;
  C11 mapping section tagged PROPOSED-unratified; NOT-APPLICABLE never
  used to hide applicable-but-missing. PASS.
- **X-A5 stale-with-age.** C9 (base `43c4400` ≠ tip) renders
  stale-relative with age + "stands per evidence chain"; C8's deleted
  branch renders ABSENT-object with preserved row (Q4). mtime is NOT a
  source (Round-1 F-02 correction adopted). PASS.
- **X-A6 origin-receipts.** Every `derived` names rule/generator (sweep
  §N, fold, extractor id); C11 assay (authored) vs mapping (derived,
  unratified) split on one directory. PASS.
- **X-A7 hands-off.** C15-class surfaces render `untracked` + policy note,
  contents never surmised. PASS.
- **X-A8 no-inference.** C3/C4 ownership UNKNOWN despite lease-adjacent
  activity; C15 UNKNOWN despite Path-C history; F3 pattern enforced.
  PASS.
- **X-A9 protection.** C5/C10 protected (supersede-only / VERIFIED
  immutable); C11 cleanup-safe (editable work-in-progress — the ONLY kind
  where observatory-adjacent editing workflows may exist, and they live in
  source systems, not the observatory). PASS.
- **X-MULTI multi-value.** C2, C6 (directive-recorded + tree-evidence-null
  pattern for assumed layers), C10, C12 all carry same-axis multiple
  assertions with scope tags. No single-value coercion. PASS.
- **X-VOCAB vocabulary≠population.** BCP `work_item` (0 instances), genome
  non-`implemented` statuses (0 of 32 rows): vocabularies render with
  honest empty extension, never populated by synonyms (`Task` stays out).
  PASS (new rule §N-VOCAB in FINDINGS).

## X-NORM — normalized visual mapping discipline

Source-native values are stored; any visual normalization (fill/border/badge
per V0-BLUEPRINT §6) is a VERSIONED derived mapping table
(`mapping-id + version + axis-bindings`), itself tip-pinned and reviewable.
Two mappings may coexist (e.g. color-safe variant); neither edits source
values. Unmapped values fall back to `unknown` rendering, never to the
nearest color. (Implementation-feasibility item B2 in falsifier file.)
