# STATE.md — AMP-1 mission state (mutable; this IS the handoff)

> **Classification: DERIVED — CURRENT**

```yaml
mission_id: AMP-1
agent_id: IMPL-04
branch: mission/amp-1
last_commit_inspected: fbef973
updated: 2026-09-24
status: ACTIVE
```

## POSITION

PAUSED per owner (parallel-agent commit review). Verified: 945282e intact
locally and on origin (14 files, 1640 insertions, 0 deletions — matches the
report); zero path overlap between mission/amp-1 and
coord/p1-10-program-observatory-v0, so nothing was superseded and a future
merge to main is conflict-free. Cause of the mid-mission worktree switch
identified (shared worktree); recorded as ADOPTED insight. Self-test is
mid-§5.2 (fixture files written, fixture commit refused by own L1 gate for
missing STATE touch — correct behavior; wip snapshot taken).

## DONE

- Required reads (AGENTS.md, BUILD_CONTEXT.md, CURRENT-CONTEXT.md, SYSTEM.md, CURRENT.md, WORKSTREAMS.md, ROSTER.md, ENVELOPE.md, CHATGPT-BOOT.md, DIR-003, CONTEXT-INDEX.md, bcp-ralph.js, ops-install.ps1).
- Recon: git status/branch/log; branched mission/amp-1 off main.
- Mission scaffold: CHARTER.md (ACTIVE, owner-approved in chat 2026-09-24) and this STATE.md.
- agent-tools built (stdlib only): lint (banners, links, immutability, CURRENT budget, STATE fields, branch match, clean-claim, allowlist + allowlist_ignore, DONE+escalations, L1 message rules), views (digest/brief/index/queue/resume), ingest (hash, byte-identical archive, deposit parser, receipts), wip (temp-index snapshots to refs/wip, prune 20).
- 30 unittest cases pass; real-repo `agent_lint.py` reports GREEN.
- Phase 2: AUTONOMY.md, context/INGEST.md, context/THINKER-PROTOCOL.md (verbatim boot prompt), context/inbox + insights dirs, 2 ADOPTED insights (allowlist_ignore decision, hook-target finding), generated DIGEST.md (22 lines), THINKER-BRIEF.md (33 lines), context/INDEX.md, missions/INDEX.md.
- Phase 3: agent-tools/hooks/pre-commit (chains BCP validate, then lint --pre-commit) + commit-msg (STATE-touch/trailer, Decision-trailer rules); core.hooksPath set; bcp-speed/bcp/.opencode/plugins/context-flush.js (session.idle only, disjoint from bcp-ralph, node --check clean); commented hourly WIP schtasks line in ops-install.ps1 (NOT registered, Tier 2); AGENTS.md L4 fallback rule (6 lines); CHARTER allowlist extended with AGENTS.md (owner-authorized via AMP-1 3.4/3.7).
- Incident: worktree was moved to coord/p1-10-program-observatory-v0 mid-mission by an outside process; recovered via backup + checkout, verified identical, added "verify branch before every commit" to DO_NOT/RESUME discipline.
- Phase 4: SYSTEM.md AMENDMENT 2026-09-24 + [SUPERSEDED by AMP-1] marks on 7/11/12/13-integration/13-tip (old text retained); CHATGPT-BOOT.md trimmed to ~25 lines pointing at thinker protocol (also fixed duplicate-read-line defect); CONTEXT-INDEX.md mission/ledger rows; ROSTER IMPL-04 ACTIVE + Tip abolished; DIR-003 status SUPERSEDED with forward pointer; FALSIFIERS.md F-AGENT-MISSION-RECOVERY added, explicitly NOT proven.
- Self-test §5.1 done: evidence/gate-refusals.log (T1 live hook refusal, T2 trailer pass, T3 Decision refusal, T4 insight-immutability, T5 transcript-immutability, T6 allowlist — all refused/passed as specified).
- Pause verification: 945282e == origin/coord (14 files/1640+/0- per report); `git diff main...<branch> --name-only` on both branches shows zero overlap; ADOPTED insight 20260924-194500-shared-worktree (one agent = one worktree).

## IN_PROGRESS

- PAUSED per owner direction; self-test resumes on owner go-ahead.

## NEXT_ACTION

On resume: commit MISSION-000-selftest fixture WITH this STATE touched (prior attempt correctly refused for missing STATE touch), then continue self-test §5.2 (wip ref already refs/wip/MISSION-000-selftest/20260924T194148Z) through §5.5, regenerate views, final STATE, report.

## UNCOMMITTED

- docs/agent-system/missions/amp-1/evidence/gate-refusals.log (new)
- docs/agent-system/missions/MISSION-000-selftest/CHARTER.md + STATE.md (new, uncommitted — fixture commit refused by L1 gate, see NEXT_ACTION)
- docs/agent-system/missions/MISSION-000-selftest/scratch.txt (new, deliberate uncommitted fixture work)
- docs/agent-system/context/insights/20260924-194500-shared-worktree.md (new)
- wip ref: refs/wip/MISSION-000-selftest/20260924T194148Z
- Hands-off untracked (never touched): bcp-algos/, setupdocs.zip, docs/REPO-CLEANUP-PROMPT-V2.md.

## DECISIONS_IN_FORCE

- Charter allowlist + tier ceiling 1 (no Tier 2: no self-merge to main, no OS task registration).

## OPEN_QUESTIONS

- None.

## ESCALATIONS

- None.

## DO_NOT

- Do not touch vivim-original-baseline/, RATIFIED Omega decisions, BCP state YAML by hand, hands-off surfaces, or the P1-02 branch.
- Do not push main; do not self-merge in this bootstrap run.
- Do not register OS scheduled tasks.
- Verify `git branch --show-current` (expect mission/amp-1) before every commit.

## RESUME

1. Read AGENTS.md, then docs/agent-system/context/DIGEST.md, then this file.
2. Check `git status` and `git branch --show-current` (expect mission/amp-1).
3. Continue from NEXT_ACTION above; update this STATE and commit on the mission branch.
