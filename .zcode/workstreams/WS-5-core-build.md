# WS-5 — Ω Core Build (flagship)

> Status: **ACTIVE — first lane named (D-TEAM-016, 2026-10-03): Wave 1, the mine wave.**
> Run `forge.mine.capture@1` against `fixtures/mines/synthetic-v0/`, and land `forge-mine-capture`
> + `forge-mine` as the first lane pair. Gate condition met — `omega:quick` exits 0
> (`ok:true, failed:0, hostLoc 1500`). D-TEAM-007's S3 panel named the lane from BACKLOG.md's
> four candidates; two independent challengers tried to refute the pick and both **upheld** it.
> Full reasoning and evidence: [../board/DECISIONS.md](../board/DECISIONS.md).
> Owner: CEO-01 (sequencing) · DELIVERY-01 (execution) · GOVERNOR-01 (challenge)
> Serving workflows: `omega-boundary-audit`, `omega-research`, `omega-build`, `omega-verify`

## Purpose

The product itself — the lane all other workstreams serve. Governing mission: **Full VIVIM
beta ready to distribute for free.**

## Entry question (owner)

**BQ-9** Which lane opens first? Evidence: `omega-baseline/omega-final/docs/forge/BACKLOG.md`
(the authoritative sequencing per D-410, ROADMAP superseded) presents four open lanes in
parallel with no ranking (lines 40–84); the Core Phase is CLOSED (D-416) and D-417's register
is UN-PARKED with parallel work OPEN. Board session found **no document states the owner's
intended first lane** — this is a genuine owner decision, not a derivable one.

**RESOLVED by D-TEAM-016** — the S3 panel ranked all four and named the mine wave. Why the
others lost, in one line each:

| Candidate | Why not first |
|---|---|
| CDP substrate (D-419) | its §G5 precondition is **unmet** — "write down what byte-identical means *before* the substitution test is coded" (`ARCHITECTURE-NEXT-STEPS.md:93`, `D-419:31`); no definition document exists on disk |
| forge build-out (Wave 1+) | **downstream** — its mine-id discipline waits on the capture receipt only this lane produces (`BACKLOG.md:49-50`) |
| assembly plugin (Wave 2) | **forward-gated** — "design opens with Wave 2, never before" (`BACKLOG.md:77`) |

## Backlog

Drawn from the authoritative corpus only — never invented here:

- the lane named by D-TEAM-016, decomposed by CEO-01 into bounded corridors;
- each corridor planned (`omega-build` planner), challenged (GOVERNOR-01/plan reviewer),
  gated (`omega:test` + `omega:quick`), and verified (`omega-verify`) before DONE.

### First corridor (the smallest verifiable increment)

Run `forge.mine.capture@1` against the already-pinned `fixtures/mines/synthetic-v0/`
(`MANIFEST.json`, `fileCount: 42`, rootHash `a8a75d8e…`) and land a capture **receipt**. This
is the artifact the next lane is waiting on, it needs zero `host/src` LOC against the frozen
1500/1500 wall, and it is deterministic — the fixture is pinned, so the result is checkable
rather than a matter of taste.

## Exit criteria

Continuous until mission; progress measured by verified receipts per corridor, not claims.
Round-close ceremony may not close any round while `omega:quick` is red (hence WS-1 first or
parallel).
