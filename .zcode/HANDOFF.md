# HANDOFF — where the build is, in one screen

> **This file exists because a dropped connection costs context, not work.** Everything durable
> is already committed and in git; what a dropped connection actually loses is *the thread* — which
> lane is live, what is blocked, what to do next. That is this file.
>
> A new session reads, in order: `AGENTS.md` → `BUILD_CONTEXT.md` → **this file** →
> `.zcode/TRACKING.md` for the full board. Do not reconstruct history from chat; it is gone by
> design. Reconstruct from the repo and this file.
>
> **Refresh rule:** update this file in the SAME commit as any change to the lane it describes.
> `resume-check.ts` fails when it drifts from HEAD.

## Where we are — 2026-10-03

**The Ω core build is green.** `omega:quick` exits 0 at `hostLoc: 1500`; the full suite runs
1670 pass / 2 skip / 3 fail, of which two are declared Windows environment limits (symlink
`EPERM` without `SeCreateSymbolicLinkPrivilege`; the `python3` Store alias) and the third,
`F-GOV-CI.7`, is pre-existing and confirmed so by re-running against HEAD.

**WS-5 Wave 1 is complete and Wave 1+ has opened.** `forge.mine-capture` (the one filesystem
seam), `forge-mine` (the READ siblings) and now **`forge-survey`** all exist. SF2 — the sub-fork
that was recorded as the binding blocker on `forge-survey` — is **decided, implemented and
ratified** as `D-460`.

**No corridor is live. No work is uncommitted.**

## What is settled, and where to read it

| Question | Answer | Home |
|---|---|---|
| What blocks `forge-survey`? | **Nothing.** SF2 was never blocked. | [D-TEAM-023](board/DECISIONS.md) |
| Where do a mine's bytes live? | CAS blobs: `cas:<sha256hex>` rows in vault ns `proposal`, written by the capture seam, addressed by the receipt's existing `casRef`. | [D-460](../omega-baseline/omega-final/docs/decisions/D-460-cas-blocks-in-the-proposal-ledger.md) |
| Does survey touch the filesystem? | **No** — it imports `node:crypto` and no `node:fs`. Held by discipline, not by a gate. | G-11 |
| Who owns the standing instruments? | The Steward, by registry. | [WORKFLOW-REGISTRY.md](WORKFLOW-REGISTRY.md) |
| Why is the test suite sharded? | `--max-concurrency` was measured inert (39.7 s vs 39.6 s). | [D-TEAM-024](board/DECISIONS.md) |

## Next action

**Build the Wave 1+ forge build-out.** The corpus's own order after survey is `forge-assay`
(`forge.assay.run@1` / `forge.assay.distill@1`). `BACKLOG.md` does not rank within Wave 1+, so
picking survey's successor is a choice, not a derivation — take it to `omega-decide` or the board
rather than assuming the file order is the priority.

Before starting, dispatch through `omega-build` so the gates run, and register the corridor in
`[TRACKING.md](TRACKING.md)`'s **Live writer corridors** table *before* the builder writes.

## If you are resuming after an interruption

Run `bun run .zcode/checks/check-all.ts`. It reports, in one call: whether the tree is dirty and
unattributed, whether a registered corridor is writing outside its declared paths, whether the
workflow registry and decision ledger are intact, and whether this file has drifted from HEAD.
Every one of those is a way this project has previously lost an hour to a silent wrong premise.

**Do not trust a green gate that has not been run in this session.** Two gates in this project's
history reported green without executing at all.