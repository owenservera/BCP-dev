# Self-Knowledge / Freshness Core — Falsifier Results

> Classification: DERIVED — LOCAL RESEARCH EVIDENCE
> Date: 2026-09-25
> Scope: research semantics only; no production code changed.

## Execution note

The local repository clone could not resolve `github.com`, so these are results from a small standalone local falsifier harness implementing the proposed freshness envelope against the repository-observed revision/version semantics. This is **design evidence**, not evidence that production Ω code has already implemented the mechanism.

The harness checks the launch prompt's seven required mutation/recovery cases plus two invariants.

## Results

| ID | Basis / change | Derived state before check | Freshness result | Falsifier | Result |
|---|---|---|---|---|---|
| D1 | Canonical source revision 1/CID-a1 → revision 2/CID-a2 | Persisted view still reflects rev 1 | `CONFLICTED` / non-current | View must not remain CURRENT when canonical revision changes | PASS |
| D2 | Contract dependency token 1.0.0 → 1.0.1 | Old derived result | `CONFLICTED` / non-current | Contract change must invalidate derived meaning | PASS |
| D3 | `vivim.mind` manifest 0.1.0 → 0.2.0 | Old derived result | `CONFLICTED` / non-current | Manifest change must invalidate when it can change derivation | PASS |
| D4 | `law.policy` 1.9.0 → 1.9.1 | Old derived result | `CONFLICTED` / non-current | Policy dependency change must not leave old self-view current | PASS |
| D5 | Required source disappears | Old derived result | `UNRESOLVABLE` | Missing basis must never look CURRENT | PASS |
| D6 | Two current sources for one derivation-specific semantic key disagree | Derived result | `CONFLICTED` with source diagnostics | Contradictory evidence must be surfaced, not silently selected | PASS |
| D7 | Persisted view is reloaded after restart | Persisted freshness forced to CURRENT | CURRENT only after re-check against unchanged basis; non-current after change | Restart must revalidate rather than trust persisted freshness bit | PASS |
| D8 | No global invalidation event delivered | Persisted view exists | Lazy basis check still detects changes | Correctness must not depend on an invalidation bus | PASS |

Additional invariant tests:

| Invariant | Result |
|---|---|
| `computedAt` alone never changes freshness | PASS |
| A known changed basis can be recomputed into a new CURRENT view with a new basis | PASS |

## Harness output

```text
7 requested falsifiers + 2 invariants: ALL GREEN
  canonical revision change: PASS
  contract/version change: PASS
  plugin manifest change: PASS
  policy change: PASS
  source disappearance: PASS (UNVERIFIABLE)
  contradictory source: PASS (conflict diagnostic, not authority)
  persisted view restart: PASS (freshness revalidated)
  computedAt non-authoritative: PASS
  recomputation after verified basis change: PASS
```

## Interpretation

The harness falsifies the dangerous shortcut:

```persisted derived result + cached "CURRENT"
                ≠
           current truth
```

It also exposes why contradiction handling has to remain a derivation-local diagnostic: a generic freshness mechanism can prove that inputs disagree, but it cannot decide which domain claim is authoritative.

## Remaining proof obligation

These results validate the proposed semantics, not the production integration. The next implementation record would still need to prove:

- actual Ω vault/world basis adapters;
- actual contract/plugin/policy dependency tokens;
- persisted derived-view load/revalidation on the real Ω vault;
- atomic recomputation;
- concurrent source-change behavior;
- integration with the World/Object revision contract once lane B is complete.

Those are explicit implementation/proof obligations, not claimed by this research.
