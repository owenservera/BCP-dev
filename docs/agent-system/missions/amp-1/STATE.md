# STATE.md — AMP-1 mission state (mutable; this IS the handoff)

> **Classification: DERIVED — CURRENT**

```yaml
mission_id: AMP-1
agent_id: IMPL-04
branch: mission/amp-1
last_commit_inspected: 6326c60
updated: 2026-09-24
status: DONE
```

## POSITION

AMP-1 adoption complete: section 5 self-test passes with evidence in
missions/amp-1/evidence/ (5/5 parts), `agent_lint.py` GREEN, 30/30 unit
tests green, and repository-only recovery proven via resume
(MISSION-000-selftest retired PAUSED). This final STATE is the handoff.
Merge to main is owner-only (not done in this bootstrap run).

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
- Self-test §5.2: MISSION-000-selftest (retired PAUSED) — resume reconstructed position/branch/wip/NEXT_ACTION from repo files; branch mismatch + stale tip flagged (evidence/recovery.log); clean-claim refusal (T7) included.
- Self-test §5.3: deposit + raw inbox fixtures — byte-identical archival hash-verified, 2 PROPOSED thinker insights + agent judgment note, digest 28/150, brief 39/250 (evidence/ingest.log).
- Self-test §5.4: plugin dry-run 8/8 (exactly-once flush, silent-when-clean, guard, ralph coexistence; events used: session.idle only) (evidence/plugin-dry-run.mjs + .log).
- Self-test §5.5: BCP validate 0 errors; original hook exits 1 on corrupt copy / 0 on clean copy; L1 hook chains both (evidence/bcp-chain.log).
- Final: 30/30 unittests green; lint GREEN; views regenerated.

## IN_PROGRESS

- None (DONE).

## NEXT_ACTION

Owner: review branch mission/amp-1, then merge to main yourself (Tier 2;
 never push main from a mission). Next unit of work after that: open a
 first real mission by approving a charter.

## UNCOMMITTED

- docs/agent-system/missions/MISSION-000-selftest/scratch.txt (deliberate
  uncommitted fixture remnant; captured in
  refs/wip/MISSION-000-selftest/20260924T194148Z)
- Hands-off untracked (never touched): bcp-algos/, setupdocs.zip, docs/REPO-CLEANUP-PROMPT-V2.md.

## DECISIONS_IN_FORCE

- Charter allowlist + tier ceiling 1.
- context/insights/20260924-193000-allowlist-ignore.md (ADOPTED)
- context/insights/20260924-193100-hook-target.md (ADOPTED)
- context/insights/20260924-194500-shared-worktree.md (ADOPTED)

## DECISIONS_IN_FORCE

- Charter allowlist + tier ceiling 1 (no Tier 2: no self-merge to main, no OS task registration).

## OPEN_QUESTIONS

- None.

## ESCALATIONS

None.

## DO_NOT

- Do not touch vivim-original-baseline/, RATIFIED Omega decisions, BCP state YAML by hand, hands-off surfaces, or the P1-02 branch.
- Do not push main; do not self-merge in this bootstrap run.
- Do not register OS scheduled tasks.
- Verify `git branch --show-current` (expect mission/amp-1) before every commit.

## RESUME

1. Read AGENTS.md, then docs/agent-system/context/DIGEST.md, then this file.
2. Check `git status` and `git branch --show-current` (expect mission/amp-1).
3. Continue from NEXT_ACTION above; update this STATE and commit on the mission branch.
