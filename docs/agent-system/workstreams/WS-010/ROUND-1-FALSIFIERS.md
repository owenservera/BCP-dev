# WS-010 Round 1 — Falsifiers (result matrix)

> **Classification: DERIVED — PROPOSED (WS-010 research, not authority)**
> **Scale:** PASS = model+rules handle it on paper against repository
> evidence · QUALIFIED = handled with a recorded correction (→ MODEL-DELTA)
> · FAIL = model as written mishandles it (must fix before Round 3).
> No implementation exists; these are paper runs of PROOF-PLAN's suite.

| # | Adversarial case (PROOF-PLAN) | Result | Deciding evidence / correction |
|---|---|---|---|
| F-01 | P1-02 displayed by ID only | PASS | L-RULES + E2 card; layout order L6 enforced |
| F-02 | Historical doc looks newer by mtime | QUALIFIED | A5 freshness is tip/banner-derived, never mtime — but no rule said so; add "mtime is not a source" to ASSERTION-STATE-MODEL A5 (→ D-STATE) |
| F-03 | Branch ahead of main, unmerged (PR #11 itself) | PASS | M-PR: PR ≠ branch ≠ merge; branch content PROPOSED while PR OPEN |
| F-04 | Generated artifact disagrees with source | PASS | A6 `derivation-drift` + BLUEPRINT §13 rule; librarian generator-drift precedent |
| F-05 | Similar files semantically distinct (`provider.llm` vs `provider.browser`) | QUALIFIED | H-NEARDUP + H-PATHSIM; needs standing rule that similarity edges are HEURISTIC-only (→ D-REL.3) |
| F-06 | Genuine duplicates exist (PKT-004→005 bytes) | PASS | `duplicate-of` RESTRICT + mapping-row bridge (M-PKT) |
| F-07 | Sources conflict, no governing authority | PASS | A1 `contested` + preserved loser (C8/E8 pattern); A4 `contested` |
| F-08 | Owner absent (P1-03..09 TBD; artifact owners) | PASS | A8 default `unknown`; F3 forbidden pattern; E9 exemplar |
| F-09 | Untracked local surface exists | PASS | A7 `untracked` + hands-off; E9 exemplar; never content-surmised |
| F-10 | Agent report contradicts repo state | PASS | A1 non-authoritative tier for packets/handoffs; claim-vs-state `conflicts-with` edge |
| F-11 | Attention with no authoritative priority | PASS | P-11 attention discipline; unranked conditions only; F4 forbidden |
| F-12 | A view tries to mutate state | PASS | O1/OBS-001 read-only; renderer has no write affordance by construction (thin-slice constraint) |
| F-13 | Cache deleted and rebuilt | QUALIFIED | Rebuild receipt required (D-STATE.4) but receipt schema is still prose — formalize (inputs + rule versions + tips) in Round 2 |
| F-14 | Color unavailable | PASS | Text-token state encoding mandatory (O8/visual grammar); E1–E9 cards carry no color-only meaning |
| F-15 | Relationship from adjacency only | PASS | R-GRAPH receipt rule; receipt-less edges do not render; `shown-with` absorbs layout needs |

## Boundary conditions still open (Round 2+)

- B1. Formal rebuild-receipt schema (from F-13 QUALIFIED).
- B2. Work-Map family → axis-value binding table (MODEL-DELTA §D-VIEW.2).
- B3. Multi-hop Agent-Map scope-switch rendering (MODEL-DELTA §D-VIEW.1).
- B4. Volume behavior: 136 decisions / 49 capabilities / 42 edges exceed
  the 9-object thin slice — sampling/selection rules must themselves be
  explicit (no silent curation) before Round 3.
- B5. GitHub-side (review/CI) and branch-feed readers: in or out of V0 —
  owner decision (affects U5/U8, F-03 depth).
