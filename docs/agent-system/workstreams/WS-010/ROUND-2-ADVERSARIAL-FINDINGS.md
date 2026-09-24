# WS-010 Round 2 — Adversarial Findings (12 questions + test rollup)

> **Classification: DERIVED — PROPOSED (WS-010 research, not authority)**
> Corpus: ROUND-2-CORPUS.md (C1–C15). Matrices: ASSERTION / RELATIONSHIP /
> IDENTITY falsifier files. Verdict: see §V (QUALIFIED).

## Q — the twelve adversarial questions, answered with corpus witnesses

**Q1. Two sources name the same thing differently?** Both names render as
aliases on ONE node only if an explicit bridge exists (mapping rows C1/Y9,
registry collision note Z3, rename commit). Otherwise two nodes +
`possibly-same-as` HEURISTIC edge (dashed). Witness: `Ω-0` vs `D-431` vs
`D-449` — three nodes until the registry row bridges them. No silent
aliasing.

**Q2. Two sources use the same name for different things?** Lineage/scope
tags split them at key level (Z3 tree-vs-spec `D-449`; Z6 era-tagged
WS-002; Z1 agent namespaces). A bare-name reference renders
lineage-ambiguous with resolution affordance, never a guessed pick.
Witness: `AGT-coordinator` vs `COORD-01` stay separate despite role-word
similarity (Z2 — rejected even below heuristic candidacy).

**Q3. Object exists, no registry entry?** Renders as unindexed-work with
honesty label, full axes, and explicit index-absence (C11/MIG-003: assay
OBSERVED, mapping PROPOSED-unratified, lifecycle `unindexed-work`).
Index absence is data, not a defect to auto-repair. No observatory-side
registration invented.

**Q4. Registry entry exists, object unfound?** Reference preserved, target
marked ABSENT (C8's deleted branch; Z7: identity of the reference survives
the referent's death). Freshness `unresolvable`; epistemic capped at
`weakly-inferred`. Never dangling-pointer-erased, never ghost-rendered.

**Q5. Two sources give different current states?** Both render with scope
tags + `CONFLICTED` on the axis (C12's three temporal truth values; C10's
proof-quad). Resolution ONLY by a sourced authority rule (AGENTS.md
hierarchy, ratify-ceremony, PR-merge state); otherwise the conflict stands
visible (C8/E8 pattern). Silent selection is the failure; coexistence is
the feature.

**Q6. Older source more authoritative than newer?** Authority (A1) and
recency (A5) are DIFFERENT axes — the model cannot prefer newer by
construction. Witnesses: RATIFIED D-456 beats any newer unmarkered prose;
directive scope wording (immutable history, correct-at-issue) beats newer
branch text for historical claims. Freshness never outranks authority.

**Q7. Branch holds main-absent information?** Renders tip-pinned with
`proposed@branch` status while the PR is OPEN (C12-side-a; Z9: same path +
different tip = different nodes). Merge flips status via the MECHANICALLY
DERIVED merge edge (Y11); the observatory never pre-merges. PR #11's own
WS-010 files are the live demonstration.

**Q8. Inferred relationship conflicts with explicit?** Explicit wins;
inference preserved as rejected-candidate with reason (Y14/C14:
H-PATHSIM rejected by D-456/D-420; Y-CONF rule: rejection is
preservation, audit-projection-only rendering). The trap stays documented.

**Q9. Ownership absent?** Renders `unknown` with scope of checked sources
(C3/C4/C15; Y20: zero ownership edges in corpus and that absence is
correct). No activity/recency/authorship inference (F3). The card's owner
field cites a cell or reads `unknown` — no third option.

**Q10. Grouping looks like containment without evidence?** Layer-4
grouping carries `grouping-not-containment` marking wherever the Y-matrix
has no `contains` row (S-GROUP). Zoom path PROGRAM→TERRITORY→WORKSTREAM
asserts nothing. True containment edges enumerated closed-world (repo,
composition, launch-folder, ledger-wave); anything else is grouping.

**Q11. Source gives no meaningful value for a dimension?** Applicability
table (X-APPL) decides: categorically-inapplicable → `N/A` (e.g.
operational for RATIFIED records, ownership for law); applicable-but-
unsourced → `UNKNOWN` (e.g. C4 ownership, C11 operational). Inventing a
cross-domain filler enum is forbidden; the two nulls are distinct and
both render visibly.

**Q12. Evidence deleted / projection rebuilt from scratch?** Deleting the
projection destroys NOTHING (layers 1–2 live in source systems; layer 3
rebuilds from named rules + pinned tips; rebuild receipt schema B1 owed
in Round 3 prep). Deleted SOURCE evidence degrades honestly: dependents
flip to `unresolvable`/capped-epistemic with preserved receipts (doctruth
blast-radius pattern is the precedent). The observatory is never
load-bearing for project truth — the hypothesis's core claim, upheld.

## T — per-test rollup (10 required tests × corpus)

| Test | Coverage | Result |
|---|---|---|
| Identity (non-name keys) | Z-KEYS 16/16 + Z-TRAPS 9/9 | PASS |
| Meaning (name-independent comprehension) | E1–E9 + C1–C15 cards, L1–L6 | PASS |
| State (9 axes, no collapse) | X-ROWS 12/12 incl. X-MULTI, X-VOCAB | PASS |
| Evidence (every fact traced) | Y-JUST 20/20 receipted | PASS |
| Relationship (classified + justified) | Y-CLASS 20/20 + Y-PROX zero-leak | PASS |
| Conflict (coexistence, no silent pick) | Q5, C12, Y17, X-A1 | PASS |
| Freshness (stale-with-age) | X-A5, C9, Q6, F-02 rule adopted | PASS |
| Unknown (visible, non-error) | C11, C15, E9, X-A8/A9, Q9/Q11 | PASS |
| Grouping (no false containment) | S-GROUP, Y-JUST ladder absence, Q10 | PASS |
| Cross-domain identity | Z-TRAPS, Q1/Q2 | PASS |

## N-VOCAB — new rule adopted this round

Vocabulary ≠ population: a defined term with empty extension
(`work_item`: 0 instances; genome non-`implemented` statuses: 0/32 rows)
renders its definition + honest empty set. No synonyms fill the gap.
(Generalizes M-WRK; witnessed C6 status-census this round.)

## V — verdict: QUALIFIED

Semantic correctness over the full adversarial corpus: PASS (30/30 probes,
12/12 questions, 0 FAIL). QUALIFIED overall SOLELY on implementation
feasibility: B1 rebuild-receipt schema formalization · B2 visual-mapping
table versioning · B3 Work-Map family→axis bindings · B4 Agent-Map
scope-switch rendering · B5 volume sampling rules · B6 name-stripping card
test (from Z-NAME). No blueprint contradiction found — V0 blueprint NOT
modified (per instructions, contradictions would be recorded; there were
none at the semantic level — Round-1 V1–V5 deltas stand as the correction
set). No implementation gate opens until B1–B6 close or the owner
consciously accepts them.
