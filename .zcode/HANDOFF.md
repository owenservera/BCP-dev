# HANDOFF — where the build is, in one screen

> **This file exists because a dropped connection costs context, not work.** Everything durable
> is committed; what a dropped connection actually loses is the thread — which lane is live, what
> is blocked, what to do next. That is this file.
>
> A new session reads: `AGENTS.md` → `BUILD_CONTEXT.md` → **this file** → `.zcode/TRACKING.md`.
> Do not reconstruct history from chat; it is gone by design. Reconstruct from the repo and this
> file. **Refresh it in the SAME commit as any change to the lane it describes.**

## Where we are — 2026-10-03, late

**The Ω core build is green and Wave 1+ is open.** `omega:quick` exits 0 at `hostLoc: 1500`
with thirteen stages. The suite runs **~1672 pass / 2 skip / 3 fail**; two failures are declared
Windows environment limits (symlink `EPERM` without `SeCreateSymbolicLinkPrivilege`; the
`python3` Store alias `Bun.spawn` cannot resolve). The third is **intermittent load sensitivity**,
characterised in D-TEAM-034: the observed rate is 1–3 per run out of ~1675 and **no observed
failure has ever reproduced in isolation**. If two runs in a row fail the *same* test, that is a
real defect — revisit D-TEAM-034.

**Four forge plugins exist:** `forge-mine-capture` (the ONE filesystem seam), `forge-mine` (READ
siblings), **`forge-survey`** (landed, gate-verified), and `forge-assay` **in flight** as
corridor 4.

**A corridor is registered OPEN (`forge-assay`, `dwfrun-22207cd5`).** Any gate result taken now
is CONTAMINATED, not a measurement.

## What is settled, and where to read it

| Question | Answer | Home |
|---|---|---|
| Where do a mine's bytes live? | `cas:<sha256hex>` rows in vault ns `proposal`, written by the capture seam, addressed by the receipt's `casRef`. | [D-460](../omega-baseline/omega-final/docs/decisions/D-460-cas-blocks-in-the-proposal-ledger.md) |
| Why is `forge-survey` allowed to read? | It imports `node:crypto` and **no `node:fs`** — and that is now **enforced** by `FORGE_READ_PURITY`, not asserted. | D-TEAM-032 / G-11 |
| Why was SF2 never blocked? | All three recorded collisions were refuted at the cited file; two independent falsifiers confirmed it. | D-TEAM-023 |
| Who owns the standing instruments? | The Steward, by registry, checked bidirectionally. | [WORKFLOW-REGISTRY.md](WORKFLOW-REGISTRY.md) |
| Why is the suite sharded? | `--max-concurrency` was measured inert (39.7 s vs 39.6 s). | D-TEAM-024 |
| Are host ops law-gated? | **No** — verified at the source; recorded, not fixed, because `host/src` is frozen at 1500/1500. | D-TEAM-036 / G-12 |

## Known-open, with the condition to close each

- **G-12** — host ops bypass `callLaw`. Revisit if a host op is added, or a paired removal makes the one-line routing fix affordable under D-365.
- **G-13** — no check that a plugin which *calls* a port is granted it. One real instance found and fixed (`browser.json` withheld `vault.getmany@1` from law). The check was attempted three ways and **deliberately not shipped**: one formulation was false as a premise, and the survivors fired on correct capability-guarded code. Revisit with a grant linter that understands the call graph.
- **T-16** — the broken `bun.exe` stub under the user profile. Every gate needs `TMP=/c/temp-bcp`. Owner-side; not ours to delete.

## Next action

**Land corridor 4 (`forge-assay`), then pick the lane after it.** The corpus does not rank within
Wave 1+ (D-417:38 — each "can open in any order the program schedules"), so survey's successor
was a choice; assay is that choice. Register the corridor in
[TRACKING.md](TRACKING.md)'s **Live writer corridors** table *before* any builder writes — the
pre-registration is what makes a gate taken during a build knowably contaminated rather than
assumed clean.

## If you are resuming after an interruption

Run `bun run .zcode/checks/check-all.ts`. One call reports: dirty-tree attribution, any corridor
writing outside its declared paths, workflow-registry drift, decision-ledger integrity in **both**
directions, and whether anything needs recovery.

**Do not trust a green gate you have not run in this session.** Two gates in this project's
history reported green without executing at all — one of them mine, caught only when a corridor
tried to use it.