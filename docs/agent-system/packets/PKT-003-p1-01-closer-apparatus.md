# PKT-003 — DIR-002 closer apparatus (independence proofs staged, not simulated)

> **Classification: DERIVED — CURRENT**
> **packet id:** PKT-003 · **workstream:** WS-001 (P1-01)
> **source transcripts:** none new (no external conversation this drill)
> **source handoffs:** HANDOFF-005 (sealed closer), HANDOFF-006 (close)
> **source directive:** DIR-002 (`directives/IMPL-02/DIRECTIVE-002-close-p1-01-proof-gaps.md`)
> **extraction session:** `20260923-224219-dir-002-stage-sealed-closers-for-the-two`
> (Ω ledger) · **base:** `b5cdb24` · **branch:** `impl-02/p1-01-closers`
> **freshness:** CURRENT · **supersedes:** — (extends PKT-002; no claim changed)

## Facts

| # | Claim | Source | Status |
|---|---|---|---|
| F1 | Sealed multi-agent closer staged: HANDOFF-005 (bootstrap manifest, forbidden list, continuation mission, recording obligations, PROVEN rubric) | this branch, `handoffs/HANDOFF-005.md` | DERIVED-CURRENT |
| F2 | Sealed cross-ChatGPT closer staged: CROSS-CHATGPT-CLOSER.md (owner procedure, verbatim brief + 6-question orientation, PROVEN rubric) | this branch, `workstreams/WS-001/CROSS-CHATGPT-CLOSER.md` | DERIVED-CURRENT |
| F3 | MULTI-AGENT verdict: PARTIAL (unchanged) — falsifier exercised in drill; bounded unmet condition = independent thread; closer staged | PKT-002 + HANDOFF-005 rubric | DERIVED-CURRENT |
| F4 | CROSS-CHATGPT verdict: NOT PROVEN (unchanged) — no independent ChatGPT session exists yet; closer staged | PKT-002 + closer package §3 | DERIVED-CURRENT |
| F5 | P1-01 verdict: PARTIALLY PROVEN (unchanged — a proof attempt was staged, not passed; per DIR-002 verdict rule) | completion criteria, DIR-002 | DERIVED-CURRENT |
| F6 | No simulation performed: no second identity role-played, no mock ChatGPT run, no transcript/packet treated as independence proof | drill discipline, ledger log | DERIVED-CURRENT |
| F7 | No P1-02..P1-09, Phase-1 rebuild, RATIFIED, BCP-state, or baseline contact | branch file inventory (all paths under `docs/agent-system/`) | DERIVED-CURRENT |

## Discovered concepts

- **Seal-before-run:** independence proofs need launcher-fault isolation — the
  closer package must define forbidden context and a breach-stop rule BEFORE
  any run, otherwise the run's independence is unjudgeable after the fact.
- **Rubric-before-run:** PROVEN checklists published in the sealed package let
  the coordinator rule mechanically instead of by impression.
- **Attempt ≠ pass:** staging a closer is progress but changes no verdict —
  the packet records the apparatus, the verdict moves only on run evidence.

## Proposals

- P-1: owner launches IMPL-03 (or any distinct thread) with HANDOFF-005 + repo only.
- P-2: owner runs the CROSS-CHATGPT-CLOSER procedure in a fresh ChatGPT session.
- P-3: coordinator registers IMPL-03 on launch (MERGE_REQUEST ITEM-003).

## Contradictions / Unknowns

- None new. U1/U2 still owned by the two staged closers; U3 unchanged.

## Reasoning lineage

- **Why sealed packages instead of attempts:** DIR-002 forbids simulation and
  the single thread cannot supply independence — the only honest executable
  work is making the closers launch-ready with breach detection built in.
- **Why the closer missions are verification-shaped:** link-audit +
  cold-start-audit (agent) and orientation questionnaire (ChatGPT) exercise
  exactly the continuity property under test while producing checkable output.
- **Why no packet versions:** no prior claim changed — PKT-001 STANDS,
  PKT-002 findings stand; this packet adds apparatus + unchanged verdicts.
- **Explicitly rejected:** role-played second identity; mock fresh-session
  output; marking anything green on staging alone.

## Recommended reads

1. HANDOFF-005 + CROSS-CHATGPT-CLOSER.md (the apparatus itself).
2. HANDOFF-006 + MERGE_REQUEST ITEM-003 (rulings owed).
