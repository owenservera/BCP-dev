# GATE-01 — Environment Receipt

> Gate: `../GATE-01-CLONED-BASELINE-ACCEPTANCE.md`
> Collected: 2026-09-28
> Rule (gate §"Evidence freshness"): prefer fresh reproducible evidence over inherited reports.
> Every value below was read mechanically from the local tree or toolchain, not recalled.

## Source / version receipt

| Field | Value | How observed |
|---|---|---|
| Vendored package | `@ibraheem-111/opencode-swarm` | `vendor/opencode-swarm/package.json` |
| Vendored version | `0.2.2` | same |
| **Exact vendored commit** | **`9295b0fcd82550627cb691eb1e951a49efefd27b`** (short `9295b0f`) | `git -C <clone> rev-parse HEAD` on the source clone, branch `main` |
| Vendored commit date | 2026-06-11 08:21:04 -0700 | `git log -1` |
| Vendored commit subject | "Publish as @ibraheem-111/opencode-swarm (bare npm name taken by unrelated package)" | same |
| Upstream repo | `https://github.com/ibraheem-111/opencode-swarm.git` | same |
| Vendored path | `omega-endstate-build/runtime/vendor/opencode-swarm/` | corrected from a stale pointer; see gate doc |
| Declared dependencies | `@modelcontextprotocol/sdk`, `@opencode-ai/plugin`, `@opencode-ai/sdk`, `zod` | same |
| Lockfile in vendored tree | `bun.lock` present (26,051 b) | **recovered** — see below |
| Bin entry | `swarm` → `src/cli.ts` | same |
| Exports | `./`, `./plugin/swarm`, `./plugin/notify` | same |
| License | MIT | `LICENSE` |

**Deviation FOUND and CLOSED during this campaign.** The original vendoring was incomplete: it
omitted `bun.lock`, `scripts/smoke.ts`, `scripts/build-release.sh`, `.github/workflows/ci.yml` and
`.gitignore`. Consequences were concrete, not cosmetic:

- gate §A "clean dependency installation succeeds" was **not reproducible** without the lockfile;
- the gate's automated test floor item `bun scripts/smoke.ts` **could not be run at all**,
  because `scripts/` had never been copied.

The upstream `.github/workflows/ci.yml` confirms the lockfile is contract, not convenience: it runs
`bun install --frozen-lockfile`. The five files were recovered byte-for-byte from the source clone
at `9295b0f` (`.git/` was deliberately not vendored). See "Automated test floor" below for the
post-recovery results.

## Toolchain receipt

| Field | Value |
|---|---|
| OS | Microsoft Windows NT 10.0.29661.0 — Windows 11 Pro Insider Preview |
| Bun | 1.3.14 |
| OpenCode | 1.18.4 |
| TypeScript (`bunx tsc`) | 7.0.2 |
| Shell | PowerShell 7 |

> Correction: earlier notes in this repo recorded the OS as "Windows 10.0.29661". That was wrong.
> Build 29661 is Windows 11 Pro Insider Preview. Superseded by this receipt.

## Local integration lineage

| Commit | Content |
|---|---|
| `ff461817` | Vendored core + Windows adaptations (`mcp.ts` handle lifetime, `runner.ts` process-tree teardown + DB close, test handle closes). Message contains a **withdrawn** evidence claim, corrected in `f8796860`. |
| `f8796860` | Withdrew the false plugin evidence; fixed + hardened the validation harness |
| `450e2613` | (not mine) department restructure; relocated all of the above |

Current branch `work/omega-endstate/STEW-01/bootstrap-team` at `450e2613`.

## Network / authentication requirements

- OpenCode ≥ 1.16 with at least one authenticated provider is required by the baseline.
- Local auth store present at `~/.local/share/opencode/auth.json` with providers:
  `deepseek, zai-coding-plan, nvidia, openrouter, the-grid-ai, google, zai`.
  **No secret values were read or recorded.**
- Runtime evidence in this campaign uses `opencode/space-bunny-free`.
- `swarm run` may attach to an existing `opencode serve` (`--server`) instead of spawning one.

## Effective OpenCode configuration

The swarm plugin is **not** registered in `.opencode/opencode.json`. It is injected per-spawn via
`OPENCODE_CONFIG_CONTENT` = `{"plugin":["<abs path>/plugin/swarm.ts"]}` by
`omega-endstate-build/runtime/scripts/validate-swarm.ps1`.

Consequence, and it is a gate-relevant fact: an ordinary interactive `opencode` session in this
workspace has **no `swarm_*` tools**. Plugin availability is currently a property of the harness,
not of the project configuration.

## Platform-specific exclusions and conditions

| Item | Condition | Gate treatment |
|---|---|---|
| Desktop notification | `notify-send` is Linux-only; absent on Windows | **N/A** per gate §J "unsupported conditions must be recorded as N/A" |
| ntfy push | requires `OPENCODE_NOTIFY_NTFY_TOPIC` + network; not configured | **N/A** (not exercised) |
| Process teardown | Windows has no POSIX process group; negative-PID kill no-ops. Local adaptation uses `taskkill /T /F` + listener-PID targeting | Deviation, documented, evidence in `f8796860` |
| DB handle lifetime | Windows locks open files; upstream leaked handles causing `EBUSY` | Deviation, documented, fixed |
| **Cost reporting** | `opencode/space-bunny-free` reports `cost: 0` on every turn | Per gate §H this is a **platform condition to record, not to convert into PASS or FAIL**, and it means `budgetUsd` cannot trip against this model |

## Vendor tree integrity after relocation

The department restructure (`450e2613`) relocated the whole runtime tree by git rename. Because
`node_modules/` is gitignored it was **not** relocated by Git and was left orphaned at the old
path; 8208 packages were moved manually and the emptied old tree removed. Re-verified after the
move: `bunx tsc --noEmit` exit 0, unit suite 50 pass / 0 fail.

Two hardcoded paths in `runtime/scripts/validate-swarm.ps1` referenced the pre-move location and
were repointed. A stale plugin path fails as a *silently missing plugin*, not as a loud error —
the same failure mode that invalidated the first end-to-end run.

## Automated test floor — observed status

Gate "Automated test floor" requires all appropriate tests exposed by the cloned package. Gate
rule applied: "A unit-test-only green result is insufficient."

| Floor item | Command | Result |
|---|---|---|
| Clean install | `bun install --frozen-lockfile` | **PASS** exit 0 — "Checked 117 installs across 122 packages (no changes)" |
| Typecheck | `bun run typecheck` (`tsc --noEmit`) | **PASS** exit 0 |
| Unit tests | `bun test tests/` (9 files, e2e excluded) | **PASS** 50 pass / 0 fail, 8.3s |
| Smoke | `bun scripts/smoke.ts` | **PASS** — real `opencode serve` + SDK + provider, model replied `SMOKE_OK`, exit 0 |
| E2E with authenticated provider | `bun test tests/e2e.test.ts` | **NOT RUN in this campaign** — see below |

### Smoke test observation (gate-relevant, and it corrects an assumption)

The smoke test defaults to `openrouter/openai/gpt-4o-mini`, and **that provider reports real
cost**: the run recorded `cost: 0.00654075` with tokens `input 43593, output 3`.

This corrects an assumption formed from the earlier swarm run. The zero-cost finding is a property
of `opencode/space-bunny-free`, **not** of the substrate. A cost-reporting provider is
authenticated and available on this machine, so gate §H (model id, token counts, per-turn cost,
per-agent settlement) and §I (the `budgetUsd` soft brake actually tripping) are provable — but
only against a cost-reporting model. Per gate §H the zero-cost model must be *recorded as a
platform condition*, which the table above does.

`scripts/smoke.ts` uses the SDK's own `createOpencodeServer` / `server.close()` rather than the
patched `terminateTree`. Upstream documents that the SDK's close only signals the direct child. On
this single Windows run **no orphan was observed**: port 14123 was free afterwards and no
`opencode serve` process remained. That is one observation, not a general claim — the patched
`terminateTree` remains the only teardown path the local adaptation trusts.

### E2E status

`tests/e2e.test.ts` is gated on `Bun.which("opencode")` and the presence of
`~/.local/share/opencode/auth.json`. Both are satisfied on this machine, so the test is **enabled,
not skipped** — a failure there is a real failure, not an environment skip. It was observed
failing at ~30s in earlier work and the cause was never established. It remains **unresolved** and
must be reported as neither PASS nor N/A.

## Independence requirement — REMOVED by owner decision

Originally recorded here as a structural blocker: the gate forbade the implementer from being the
sole verifier of its own consequential gate, STEW-01 authored the Windows adaptations in
`ff461817` / `f8796860` and is driving this gate, and
`omega-endstate-build/project-management/departments/03-CEO-AND-MVP-BUILDER/team/AGENT-ROSTER.json` records VER-01 as
`proposed`.

**Removed 2026-09-28 by owner decision D-2026-09-28** (recorded in both
`AGENTIC-SYSTEM-GATES.md` and `gates/GATE-01-CLONED-BASELINE-ACCEPTANCE.md`). VER-01's `proposed`
status is not a precondition for acceptance. Rationale: the owner, not the agent, is the ratifying
authority, and requiring an unprovisioned verifier made the gate uncloseable rather than merely
unproven.

This is **not** a weakening that goes unrecorded: a GATE-01 PASS now rests on owner ratification
of self-evaluated evidence, which is explicitly a weaker guarantee than independent verification.
The protections that prevent a false PASS are retained — durable reproducible evidence, UNKNOWN is
not PASS, no unobserved capability may be asserted, and the acceptance record names both evaluator
and ratifying authority.

GATE-01 additionally requires a real-world advancement exercise designed and run under
`omega-endstate-build/project-management/departments/03-CEO-AND-MVP-BUILDER/DEVOPS-01/PRE-GATE-01-FOUNDING-MANDATE.md`, whose evidence
must show at least two functional peer departments created and exercised. Three departments now
exist and were created during restructure `450e2613`, but whether that satisfies the mandate is an
open judgement, not a recorded fact.

## Corrections to earlier records in this repo

- OS was recorded as "Windows 10.0.29661". Wrong: build 29661 is **Windows 11 Pro Insider
  Preview**. Superseded above.
- `merge-base --is-ancestor` was reported as "NO" when deciding the fast-forward. That was a
  PowerShell artifact: a native command emitting no output is falsy in `if`. The merge-base value
  was authoritative, indicated a clean fast-forward, and that is what occurred.
