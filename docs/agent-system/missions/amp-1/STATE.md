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

L1-L4 are in place: versioned hooks chained with BCP validate, context-flush
plugin, commented hourly WIP line, AGENTS.md fallback rule. core.hooksPath is
set. Protocol amendments (SYSTEM, BOOT, INDEX, ROSTER, DIR-003) start next.

## DONE

- Required reads (AGENTS.md, BUILD_CONTEXT.md, CURRENT-CONTEXT.md, SYSTEM.md, CURRENT.md, WORKSTREAMS.md, ROSTER.md, ENVELOPE.md, CHATGPT-BOOT.md, DIR-003, CONTEXT-INDEX.md, bcp-ralph.js, ops-install.ps1).
- Recon: git status/branch/log; branched mission/amp-1 off main.
- Mission scaffold: CHARTER.md (ACTIVE, owner-approved in chat 2026-09-24) and this STATE.md.
- agent-tools built (stdlib only): lint (banners, links, immutability, CURRENT budget, STATE fields, branch match, clean-claim, allowlist + allowlist_ignore, DONE+escalations, L1 message rules), views (digest/brief/index/queue/resume), ingest (hash, byte-identical archive, deposit parser, receipts), wip (temp-index snapshots to refs/wip, prune 20).
- 30 unittest cases pass; real-repo `agent_lint.py` reports GREEN.
- Phase 2: AUTONOMY.md, context/INGEST.md, context/THINKER-PROTOCOL.md (verbatim boot prompt), context/inbox + insights dirs, 2 ADOPTED insights (allowlist_ignore decision, hook-target finding), generated DIGEST.md (22 lines), THINKER-BRIEF.md (33 lines), context/INDEX.md, missions/INDEX.md.
- Phase 3: agent-tools/hooks/pre-commit (chains BCP validate, then lint --pre-commit) + commit-msg (STATE-touch/trailer, Decision-trailer rules); core.hooksPath set; bcp-speed/bcp/.opencode/plugins/context-flush.js (session.idle only, disjoint from bcp-ralph, node --check clean); commented hourly WIP schtasks line in ops-install.ps1 (NOT registered, Tier 2); AGENTS.md L4 fallback rule (6 lines); CHARTER allowlist extended with AGENTS.md (owner-authorized via AMP-1 3.4/3.7).
- Incident: worktree was moved to coord/p1-10-program-observatory-v0 mid-mission by an outside process; recovered via backup + checkout, verified identical, added "verify branch before every commit" to DO_NOT/RESUME discipline.

## IN_PROGRESS

- Amending SYSTEM.md, CHATGPT-BOOT.md, CONTEXT-INDEX.md, ROSTER.md; superseding DIR-003.

## NEXT_ACTION

Edit SYSTEM.md (AMENDMENT block + inline SUPERSEDED marks), trim CHATGPT-BOOT.md to ~25 lines, update CONTEXT-INDEX.md, register IMPL-04 ACTIVE in ROSTER.md (drop Tip line), mark DIR-003 SUPERSEDED; run lint; commit with STATE touch.

## UNCOMMITTED

- docs/agent-system/missions/amp-1/CHARTER.md (new), STATE.md (new). Tree otherwise clean except hands-off untracked surfaces (bcp-algos/, setupdocs.zip, docs/REPO-CLEANUP-PROMPT-V2.md, WS-010 worktrees files) which are never touched.

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
