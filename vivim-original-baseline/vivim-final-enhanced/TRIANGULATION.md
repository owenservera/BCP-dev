# TRIANGULATION — Version Map & Merge Protocol (2026-09-11)

Authoritative map of the three VIVIM versions. Both public repos carry this file.

## The three versions

| Line | Where | Base | Contents |
|---|---|---|---|
| B — baseline | `github.com/owenservera/vivim-final` @ `8a798f9` + older history | — | frozen baseline. Its history contains legacy artifacts (Chrome profile data, installers, `.env`) — **do not build on it**. Full history kept only in local archives. |
| C — enhanced (**THIS repo**) | `github.com/owenservera/vivim-final-enhanced` @ `master` (single snapshot commit) | `8a798f9` | kernel-plugin WIP: `src/plugin-kernel/`, `src/intel/`, `src/ai/` rework, 11 `migration-*` skills (`.opencode/skill/`), `docs/end-state|kernel-plugins|redesign/`, `tests/fuzz/` + arch `certifier`/`kernel-isolation` tests, swarmvault config, `CLAUDE.md` |
| A — program | `github.com/owenservera/vivim-final-program` @ `master` (single snapshot commit) | `8a798f9` | upgrade program: `docs/plan/` (MASTER-PLAN, SOLUTION-BLUEPRINT, ATOMIC-TASK-LIST, PHASE-ROADMAP, DECISIONS-AND-RISKS, `corpus/`), `migration/` (SOURCE_FREEZE `SF-797ADDECFB061F78`, census 990 Atomic Records, ADR-000), Round-2 P0 build repairs (stream-parser recursion fix, `stamp-schema-version.ts`, dual-DB empty-boot gate) — P0 complete 29/29, next round R3 = P1.1–P1.2 |

## Shared ancestry

Both public snapshots conceptually descend from base commit
`8a798f91d52574cb3d7db579da516bc1c4aee7b7` (git-level common ancestor was dropped
when publishing clean single-commit snapshots — merge with
`--allow-unrelated-histories`).

Full-history local archives (NOT published):
- C: commit `9a988ed` (+ branch `backup/pre-enhanced-snapshot` @ `8a798f9`) in `C:\0-BlackBoxProject-0\vivim-final`
- A: commit `2e0a72d` (3 program commits on top of base) in `C:\0-BlackBoxProject-0\vivim-kernel-auto\vivim-final-round2-p0\vivim-final`

## Excluded from these public snapshots

- `node_modules/`, `data/`, `.runtime*/`, `.archive/`, `chrome-profiles/`, `prov_claude/` — never published
- `.env` (secrets) — untracked; `.env.example` is the template
- C only: `.cip/`, `.claude/`, `.cursor/`, `.devin/`, `.genome/`, `snapshots/`, root images (`ChatGPT Image*.png`, `download.png`, `FALCONS.webp`), `docs/librarian/*.zip`
- A only: nothing beyond `.env` (tree already clean of binaries)

## SECURITY NOTE (pre-existing exposure — action required)

`github.com/owenservera/vivim-final` is **public** and its history ≤ `8a798f9`
contains `prov_claude/acc_1/` (Chrome **Login Data**, **Network/Cookies**, Web
Data, History — 677 files), `chrome-profiles/discovery/protocol-probe/Default/Network/Cookies`,
and `.env` (`OPENCODE_SERVER_PASSWORD=opencode-test-pw`). Treat those browser
sessions/credentials as compromised: revoke sessions and rotate. Neither new
snapshot repo carries any of this history.

## Merge protocol (for the agent continuing work)

1. THIS repo and `vivim-final-program` are siblings from one base. Register each
   as a remote of the other:
   `git remote add program https://github.com/owenservera/vivim-final-program.git`
2. Port work via a branch + `git merge --allow-unrelated-histories` (or
   cherry-pick). Expect conflicts in: `src/engines/stream-parser.ts`,
   `src/storage/db.ts`, `seeds/`, `AGENTS.md` (both lines modified them).
3. Program-line law: docs change in the same commit as behavior; decisions go to
   `docs/plan/DECISIONS-AND-RISKS.md`; never rewrite published history.
4. `.env` stays untracked everywhere. No binaries/credentials in commits.
