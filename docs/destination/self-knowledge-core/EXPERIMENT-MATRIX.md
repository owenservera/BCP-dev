# Experiments

D1 canonical revision changes
D2 contract version changes
D3 plugin manifest changes
D4 policy changes
D5 source disappears
D6 source contradiction
D7 persisted view reload after restart
D8 lazy basis check without global invalidation bus

Every result records basis, derived state, freshness outcome, evidence and falsifier.

## Executed research results — 2026-09-25

> These results are local design-harness evidence. They are not claims that the production Ω tree has already implemented the proposed DerivedView envelope.

| ID | Experiment | Outcome | Evidence |
|---|---|---|---|
| D1 | Canonical revision change | PASS — previous view becomes non-current when source rev/CID changes | `FALSIFIERS.md` + local harness |
| D2 | Contract version change | PASS — dependency vector mismatch makes prior result non-current | `FALSIFIERS.md` + local harness |
| D3 | Plugin manifest change | PASS — manifest dependency mismatch makes prior result non-current | `FALSIFIERS.md` + local harness |
| D4 | Policy change | PASS — policy dependency mismatch makes prior result non-current | `FALSIFIERS.md` + local harness |
| D5 | Source disappearance | PASS — currentness becomes `UNRESOLVABLE`, never CURRENT | `FALSIFIERS.md` + local harness |
| D6 | Source contradiction | PASS — derivation-local conflict diagnostic makes view `CONFLICTED`; no authority selection | `FALSIFIERS.md` + local harness |
| D7 | Persisted reload after restart | PASS — persisted freshness bit is ignored; basis is rechecked | `FALSIFIERS.md` + local harness |
| D8 | Lazy check without global invalidation bus | PASS — correctness survives absence of push invalidation | `FALSIFIERS.md` + local harness |

Additional research invariants:

- `computedAt` is informational and cannot establish currentness.
- A changed but resolvable basis can be recomputed into a new current view.
- The current basis must be inspectable; the digest is a compact comparison token, not authority.

## Design disposition

**PROMOTION-CANDIDATE after implementation evidence.** The semantic model is sufficiently small to proceed to an implementation record, but the production proof obligations remain open and are explicitly listed in `RESEARCH.md`. No Ω law change is made by this lane.
