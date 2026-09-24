# Close-out gates (trimmed run, 2026-09-24, branch mission/amp-1)

> **Classification: DERIVED — CURRENT**

Preconditions: single worktree (mine alone); `origin/main == fbef973`
(no drift, no pre-merge). STATE reopened ACTIVE (IN_PROGRESS is not a
valid STATE status — recorded as CONFLICT insight
20260924-220000-status-conflict; gate held, nothing weakened).

## 3.1 Hook safety — PASS

- (a) Non-mission branch commit succeeds with hooks active (scratch
  clone, exit 0).
- (d) `main`-branch commit succeeds with hooks active (scratch clone,
  exit 0).
- (b) Corrupt BCP state refused: temp-copy proof (original hook exit 1
  `REFUSED ...`, clean copy exit 0); versioned hook chains the same
  validate call first (source: agent-tools/hooks/pre-commit).
- (c) Bypass works and is logged: `AMP_HOOK_BYPASS=1` skips ONLY L1
  message rules with NOTICE; immutability never bypassed (unit tests
  test_bypass_skips_message_rules_and_logs,
  test_bypass_does_not_skip_immutability).
- Live finding: git SILENTLY skips hooks when hooksPath dir is missing
  (proven in clone). Fix: install.py stores forward-slash ABSOLUTE path
  + verifies; lint warns (not fails) otherwise.

## 3.2 Allowlist integrity — PASS

- `allowlist_ignore` (amp-1 CHARTER): `bcp-algos/**`, `setupdocs.zip`,
  `docs/REPO-CLEANUP-PROMPT-V2.md` — hands-off surfaces only.
- New charter-guard refuses widening/adds without `approved_by: owner`
  and refuses de-approval with entries (7 unit tests). Live-fire: it
  refused the preview merge until the retired fixture's allowlist was
  honestly emptied (evidence in commit 44a6240, gate NOT weakened).

## 3.3 Full suite — PASS

- 41/41 unittests green; `agent_lint.py` GREEN; BCP `validate.py`
  0 errors (49 caps, 8 leases, 105 log events).

## 3.4 Recovery — PASS (fresh session: YES)

- `resume amp-1` on merged result reconstructs branch/tip/wip/NEXT_ACTION.
- Genuinely fresh `opencode run` session (same model, zero context,
  scratch detached worktree, one-sentence prompt) reproduced the mission
  position AND flagged drift (detached HEAD, preview merge, missing
  closeout.md). Evidence: fresh-session.log.
- F-AGENT-MISSION-RECOVERY: PROVEN for this single same-model run;
  broader cross-model proof remains open.

## 3.5 Crash blind spot — PASS (compensated)

- Plugin fires on `session.idle` only; mid-turn crash never flushes.
- Compensating control: hourly WIP task (registered §4.3). Live proof:
  `snapshot amp-1` captured untracked probe file; HEAD identical,
  index untouched, worktree intact
  (refs/wip/amp-1/20260924T203847Z contains WIP-PROBE.tmp).
