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
rather than a matter of taste. **LANDED** — `16f95419` + `b37dec84`, receipt verified.

### Second corridor (the READ siblings) — LANDED

`forge-mine` implementing `forge.mine.verify@1`, `forge.mine.diff@1`, `forge.mine.list@1`.
Built by an unattributed writer that stopped mid-flight and never returned; adopted by the team
and landed under **D-TEAM-020** (`5475a57b` + `766b6d92`). Zero `host/src` LOC, as the lane
requires. 62 plugin tests green and mutation-tested; `omega:quick` green at `hostLoc 1500`.

### The next thing is a DECISION, not a corridor: D-409 sub-fork SF2 — **DECIDED (D-TEAM-023)**

**Wave 1 is now structurally complete** — the EXTERNAL_MUTATION seam exists and its three READ
consumers exist, which is the pairing D-409 decided. The next lane in the corpus's own order is
the Wave 1+ build-out, and its first plugin is `forge-survey`
(`forge.survey.run@1` / `forge.survey.render@1`).

**SF2 was recorded as blocked and it was not.** All three resolutions below were tested against
the files they name, and **none of the three collisions holds**:

| Option | Claimed collision | What the file actually says |
|---|---|---|
| capture emits inventory rows | `FORGE_CONTRACT_DRIFT` — catalog frozen | **Would not fire** (`forge-surface.ts:139-152`): it fires only on an op absent from the catalog or a risk mismatch. Same id, same `EXTERNAL_MUTATION` → no drift. The surviving objection is *design*, not gate — it duplicates `forge.survey.run@1`'s own declared result |
| add a filesystem port for survey | `host/src` LOC frozen at 1500/1500 | **True, and irrelevant** — capture already does filesystem work as a plugin with **zero** `host/src` LOC, so no host port is needed and D-391 is never reopened |
| survey re-walks the disk | `FORGE_CLASS_SPAN` | **Would not fire** (`forge-surface.ts:103-112`): it reads *declared* contributions, and survey's two ops are both `READ`. The rule's intent is violated; no check catches it — now **G-11** |

**The decision: CAS blobs, written by the capture seam, addressed by the receipt's existing
`casRef`.** The corpus had already built for this. `CaptureReceiptSchema`
(`packs/builder/src/schemas.ts:73-90`, a `z.strictObject`) carries `casRef` on every file row;
`casRefFor` returns `cas:${hash}` as a *pure function of content*, deliberately not a storage
location, with a test named **"SF2 stays open"** (`capture.test.ts:121`). The seam was built so
SF2 could land **without re-capturing any mine**. The catalog already calls capture *"the ONE
filesystem seam"* and gives survey `{mineId}` — **no filesystem handle at all**
(`forge-ops.md:20,23-24`).

Full reasoning and evidence: [../board/DECISIONS.md](../board/DECISIONS.md) (D-TEAM-023). Per
D-409:30 the ratified `docs/decisions/` record is written by the implementing corridor, carrying
the CAS location and the incremental-hashing budget as its evidence.

Note the corpus is silent on the ranking *within* the six Wave 1+ forge lanes (D-417:38 — each
"can open in any order the program schedules"), so ordering among the other five is the same
kind of unranked choice the first lane was.

## Exit criteria

Continuous until mission; progress measured by verified receipts per corridor, not claims.
Round-close ceremony may not close any round while `omega:quick` is red (hence WS-1 first or
parallel).
