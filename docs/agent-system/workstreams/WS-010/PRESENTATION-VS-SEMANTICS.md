# WS-010 Round 2 — Presentation vs Semantics

> **Classification: DERIVED — PROPOSED (WS-010 research, not authority)**
> The five-layer separation the corrected model must enforce. Layer
> confusion is the failure mode behind V1–V5 (Round-1 FINDINGS §4).

## S-LAYERS — the five strata

1. **Source/domain objects** — owned elsewhere (decisions, state rows,
   commits, packets, genome layers). WS-010 holds KEYS, never the objects.
2. **Source assertions** — values read from cells (status fields, invariant
   sentences, signal rows). Stored with (cell, tip, axis).
3. **Observatory-derived assertions** — outputs of named rules over source
   assertions (sweep re-derivations, freshness comparisons, attention
   projections, normalized visual mappings). Stored with (rule-id, version,
   inputs, tips). Rebuildable, deletable.
4. **Presentation grouping** — `shown-with` sets: territories, zoom levels,
   attention neighborhoods, corpus selections. Asserts NOTHING; carries no
   receipt because it claims nothing; must never be serialized as edges.
5. **Visual projection** — shape/fill/border/size/halo/badge/text per a
   versioned mapping table over layers 1–3. Two mappings may coexist; neither
   edits layers 1–3. Unmapped values fall back to `unknown` rendering.

## S-GROUP — the mandatory grouping rule (tested on corpus)

`PROGRAM → TERRITORY → WORKSTREAM` is a layer-4 grouping path. It creates
zero `contains` assertions (C1/C2 placement renders without any Y-row —
verified in RELATIONSHIP-FALSIFIER-MATRIX §Y-JUST). The ONLY `contains`
edges in V0 are layer-2-sourced true containments: repo→dir→file,
composition→spec, workstream→launch-folder-files, ledger-wave→record.
A grouping that *looks like* containment (nested boxes on canvas) MUST
carry a `grouping-not-containment` marker in its layer-5 spec wherever the
underlying Y-matrix has no `contains` row — this is Q10's answer rendered
as construction rule. Zoom traversal (Z0→Z5) changes layer-4 membership
and layer-5 detail, never layers 1–3.

## S-VIS — visual-mapping provenance

The V0-BLUEPRINT §6 grammar (shape=kind, fill=state, border=lifecycle/
epistemic, edge=relationship, halo=attention, text=meaning) is a layer-5
convention. Round 2 binds it: every channel maps from NAMED axes via the
versioned mapping table (X-NORM); `size = structural significance` maps
from explicit fan-out counts (edge/dependent counts), never from importance
judgments; color is redundant with text tokens (F-14). The mapping table is
a derived artifact under the same rebuild/delete discipline as the model.

## S-ATT — attention as layer-3 projection

Attention conditions (conflicts, blocks, recorded waits, stale, unknowns)
are rule outputs over layers 1–2 with the same receipts as any derived
assertion. C15's ownerless wait and C12's owned-by-integration conflict
both project WITHOUT inventing priority, owner, or next action. Global vs
contextual attention = full projection vs visible-neighborhood filter —
both layer 3, one model (O9 holds).
