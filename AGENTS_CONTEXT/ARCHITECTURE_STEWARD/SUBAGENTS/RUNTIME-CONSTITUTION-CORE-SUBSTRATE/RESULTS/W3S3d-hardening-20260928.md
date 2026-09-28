# Wave-3 S.3d — Harness Hardening: Fresh-Branch Guard + Read Observability (static; unexecuted)

```text
SESSION_STATUS: PARTIAL
SESSION_ID: W3S3d-hardening-20260928
CFA / AGENT: CFA-10 — Runtime Constitution / Core Substrate Steward
IDENTITY: Runtime Constitution & Core Substrate Steward (RATIFIED — OWNER-ALIGNED, v1.0)
AGENT_ID: runtime-constitution-core-substrate
TARGET_REF: main
BASE_MAIN_SHA: edfe49b1d2cc871fabcc0b3388128f956db908ff
TASK: finish-full-list Wave-3 unit S.3d — harness hardening against the S.3b-retry stale-ref failure (STATIC ONLY, no exchange execution)
EXECUTION_STRATEGY: deliberate-authorship-only
STRATEGY_RATIONALE: S.3b-retry steward-observed evidence isolated the F3 false-fire to stale-ref reuse plus a swallowing read() — both verifiable by code inspection; the hardening is guard/assert lines whose proof is the S.3b-retry run itself, so this unit claims no execution evidence by design.
RESULT: INVESTIGATED
FILES_CHANGED: AGENTS_CONTEXT/AGENT-COMMONS/runtime/test/s3-lib.ts, AGENTS_CONTEXT/AGENT-COMMONS/runtime/test/s3-procA.ts, AGENTS_CONTEXT/AGENT-COMMONS/runtime/test/s3-procB.ts (+ this receipt + one TASKS.md entry)
COMMIT_SHA: PENDING-STEWARD-COMMIT
PREDECESSOR_VERIFIED: main @ edfe49b1 (git log -1 matches BASE_MAIN_SHA); S.3c fix present in worktree (uncommitted, steward-pending); S.3b-retry steward-observed findings (procA S3_ASSERT:F3:self-event-missing-after-own-sync with local tip == tracking tip 217d2731; 7 event blobs with TWO seq-1 events on commons/S3-ALPHA); contract v1.2 (SESSION-RESULT-CONTRACT.md); S.3a receipt RESULTS/W3S3a-scripts-20260928.md §4; S.3c receipt RESULTS/W3S3c-fix-20260928.md
OWNER_ALIGNMENT: OWNER-ALIGNMENT-2026-09-27.md retained; no Ω-law change, no boundary activation, no production implementation
LESSONS_UPDATED: no
COMMONS: none (no Commons transport used by this static-hardening session; the harness exchanges via local bare git remote only in S.3b-retry)
UNRESOLVED: execution evidence (all S.3 assertions green on the hardened harness) — explicitly deferred to S.3b-retry; static typecheck (tsc --noEmit) not run here — S.3b-retry may run it before step (2), failure there is a harness bug to report, not to fix inline by improvising
BLOCKERS: none for the hardening; S.3b-retry requires a live shell with bun ≥1.3.14, git ≥2.51 and main-repo S3-ref hygiene per §4 below
BOUNDARIES_ACTIVATED: none (shared CFA boundaries remain UNACTIVATED)
OMEGA_LAW_CHANGED: no (unchanged)
IMPLEMENTATION_STARTED: no (test-only harness; ZERO changes under AGENTS_CONTEXT/AGENT-COMMONS/runtime/src/)
NEXT_REQUIRED_STEP: Steward S.3b-retry — run steps (0)–(5) from W3S3a-scripts-20260928.md §4 WITH the §4 deltas below (setup/teardown S3-ref hygiene), then verify + commit hardening + this receipt + TASKS.md entry
MODE: DELIBERATE
SURFACE: LOCAL
```

## 1. Mechanism confirmation (verified in code, not trusted on report)

All three links of the steward's causal chain CONFIRMED verbatim against current sources:

1. **Shared-ref cause — `ensureOwnBranch` reuses stale refs.** `s3-lib.ts` (pre-S.3d line 139–142): `rev-parse --verify refs/heads/<branch>`; when the ref is ABSENT, `git branch X HEAD`. Branch refs are REPO-GLOBAL — every worktree of the repo shares one ref namespace. The first S.3b attempt created `commons/S3-ALPHA` in that namespace; teardown removed the worktrees but not the ref; the retry's `ensureOwnBranch` saw the ref PRESENT and reused it, appending run-2 events (new keypair — identity dir lives in the fresh worktree) onto run-1 history/identity. The worktree check `git branch --list "commons/S3*"` in the main repo prints nothing NOW only because the steward deleted the refs in teardown — the hazard recurs on every retry unless setup/teardown own it (§4).
2. **Two-seq-1 cause — `verifyEventChain` cannot pass mixed history.** `runtime/src/validation.ts` lines 48–59: sorts by `stream_seq`, demands contiguous seq from 1, single `agent_id`, hash chain, and EVERY signature against ONE identity. Two seq-1 blobs (run-1 + run-2, different keypairs) trip `EVENT_STREAM_GAP` at the second seq-1 at the latest — and `runtime/src/transports/git.ts` `append` (lines 126–133) overwrites the identity blob with the runner's key, so run-1 events additionally fail `EVENT_SIGNATURE_INVALID` against the run-2 pubkey. Either error is fatal to the whole ref read.
3. **Catch-swallow cause — `read()` converts verification failure to silent empty.** `runtime/src/transports/git.ts` lines 163–172: `try { all.push(...this.readRef(...)) } catch {}` — BOTH the own-branch read and every peer-ref read swallow. procA-init then folds zero events, `seenAgents` is `[]`, and `S3_ASSERT:F3:self-event-missing-after-own-sync` (`s3-procA.ts` line 96) false-fires even though publish+sync+push demonstrably worked. v0 passes because fresh clones never hold stale refs — fully coherent with the steward's live observation.

## 2. Exact diff (S.3d-only; minimal guard/assert lines, no new files)

S.3d changes are layered ON the uncommitted S.3c worktree state (S.3c lines untouched):

1. **`s3-lib.ts` — `ensureOwnBranch(repoRoot, branch, baseline, home)` fresh-branch guard (fail CLOSED):**
   - Empty `baseline` → `S3_BASELINE_MISSING`; empty `home` → `S3_HOME_MISSING` (throw, never default).
   - Ref ABSENT → assert worktree `HEAD == baseline` (`S3_BASELINE_MISMATCH` otherwise), then `git branch X HEAD` as before.
   - Ref PRESENT → `S3_STALE_BRANCH_REUSE` unless tip is EXACTLY `baseline` AND `ls-tree` under `<home>/commons/stream/events` shows ZERO `.json` blobs (a second, independent stale-content check — tip equality alone is not trusted).
   - Setup/teardown ref-hygiene contract documented in the function comment (steward-owned steps, §4).
2. **`s3-lib.ts` — three read-observability asserts (harness-side only, pure `rev-parse`/`ls-tree`/`show`):**
   - `assertRefSynced(repoRoot, branch)` — local tip == `refs/remotes/s3remote/<branch>` tip, else `S3_SYNC_REF_MISSING` / `S3_SYNC_DIVERGED` (do-not-trust-read).
   - `assertEventBlobs(repoRoot, ref, home, minCount, label)` — `.json` count under the home events prefix ≥ min, else `S3_EVENT_BLOBS_MISSING`.
   - `assertIdentityBlob(repoRoot, ref, home, pubkey, label)` — `agent.json` blob at the ref exists and its `public_key_pem` is this run's pubkey, else `S3_IDENTITY_BLOB_MISSING` / `S3_IDENTITY_BLOB_MISMATCH`.
   - All three declared feasible WITHOUT src/ changes (verified against the transport's on-disk layout: event blobs at `<home>/commons/stream/events/`, identity at `<home>/commons/identity/agent.json`); nothing left out, nothing deferred.
3. **`s3-procA.ts` init:** call site → `ensureOwnBranch(root, branch, baselineHead, HOME)` (both already in scope); after `transport.sync()`, before `transport.read()`: `assertRefSynced` + `assertEventBlobs(...,1,"procA-post-own-sync")` + `assertIdentityBlob(...,"procA-post-own-sync")` (pubkey in scope from §8.1).
4. **`s3-procB.ts` init:** call site → `ensureOwnBranch(root, branch, baselineHead, HOME)`; after `transport.sync()`, before `transport.read()`: own-side trio (`"procB-own-post-sync"`, min 1) PLUS peer-side `assertEventBlobs(root, "s3remote/commons/S3-ALPHA", PEER_HOME, 1, "procB-peer-post-sync")` — procA's push in S.3b step (2) is proven at the ref layer before the F3 fold.

No other behavior changes. No signature change to any runtime `src/` module; `git status --short -- AGENTS_CONTEXT/AGENT-COMMONS/runtime/src/` is empty. No merge/rebase/cherry-pick/origin command added (grep over added lines: only F9-evidence comments).

## 3. No execution claimed (by design)

- No `bun run s3-proc*`, no worktree creation, no pushes, no commits, no full-suite run, no `tsc` in this session.
- Proof of the hardening is the S.3b-retry run (Steward, §4 deltas): step (2) must print `S3_PROCA_INIT_OK: true`; a deliberate stale-ref retry (skip the step-1 hygiene once, on a THROWAWAY remote) must STOP at startup with `S3_STALE_BRANCH_REUSE`, never with mystery F3.
- OBSERVED (not fixed here): transport `read()` swallows per-ref verification failure via `catch {}` (`git.ts` lines 165, 171) → silent empty. Flagged for CFA-09 as a P2-8-adjacent transport-observability defect. S.3d changes NO files under `runtime/src/` per mission bound.

## 4. S.3b command-list deltas (against W3S3a-scripts-20260928.md §4)

Steps (0), (2), (3), (4a), (4b) UNCHANGED — same commands, same order, same expectations (plus: any new `S3_SYNC_*` / `S3_EVENT_BLOBS_*` / `S3_IDENTITY_BLOB_*` failure names a harness/ref defect — STOP, paste verbatim, do not improvise). Two steps gain ref-hygiene lines:

- **Step (1) PREPEND (main repo `$REPO`, BEFORE `worktree add`):**
  ```powershell
  git -C $REPO branch -D commons/S3-ALPHA 2>$null
  git -C $REPO branch -D commons/S3-BETA 2>$null
  git -C $REPO branch --list "commons/S3*"
  ```
  Expected: the `-D` errors (if any) are IGNORED — a truly-fresh repo has nothing to delete; the `--list` MUST print NOTHING (absence verified — this is the setup half of the contract). Then proceed with the existing bare-remote + worktree commands UNCHANGED (fresh bare remote still required: stale ROOMS in a reused bare repo still pollute the fold per S.3a §5 note 4).
- **Step (5) APPEND (main repo `$REPO`, AFTER both `worktree remove --force`):**
  ```powershell
  git -C $REPO branch -D commons/S3-ALPHA
  git -C $REPO branch -D commons/S3-BETA
  git -C $REPO branch --list "commons/S3*"
  ```
  Expected: both `-D` exit 0 (a "not found" here is itself evidence the run never created that stream — record it); the final `--list` MUST print NOTHING — the main repo never retains S3 stream refs (teardown half of the contract; this is the exact residue that caused the retry failure).
- **Defense in depth:** even if the step-(1) hygiene is skipped, the in-harness guard fails the run CLOSED at proc startup (`S3_STALE_BRANCH_REUSE` with the offending tip SHA) instead of mixing histories. Hygiene + guard are complementary, not redundant.

## 5. Hardening-session verification (this unit, S.3d)

- `git log --oneline -1` → `edfe49b1` = BASE_MAIN_SHA. ✓
- `git branch --list "commons/S3*"` → empty (no stale refs in main repo). ✓
- `git worktree list` → single main checkout (no residue created or left). ✓
- `git diff --stat -- AGENTS_CONTEXT/AGENT-COMMONS/runtime/test/` → exactly the 3 s3-*.ts files (S.3c base + S.3d guard/assert lines). ✓
- `git status --short -- AGENTS_CONTEXT/AGENT-COMMONS/runtime/src/` → empty (ZERO production-source changes). ✓
- `ensureOwnBranch` callers: exactly the 2 init call sites (grep-verified), both updated to the 4-arg form; no remaining 2-arg caller. ✓
- Origin never contacted (rev-parse/status/branch-list/diff/grep only; no fetch/push/ls-remote; no command approached the ~120s bound). ✓
- No new files under the harness (existing s3-*.ts paths only). ✓
- Observed, not mine: untracked `docs/Reality-engine/` present in worktree (left alone — outside this envelope); the 2 known untracked auto-exports (`local-team.md`, `session-ses_f1fc.md`) untouched.
