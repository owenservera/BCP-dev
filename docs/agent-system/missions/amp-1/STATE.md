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

Tooling build complete and green: agent_lint.py, agent_views.py,
agent_ingest.py, agent_wip.py plus 30 unittest cases. Real-repo lint is GREEN.
Ledger + AUTONOMY + thinker protocol start next.

## DONE

- Required reads (AGENTS.md, BUILD_CONTEXT.md, CURRENT-CONTEXT.md, SYSTEM.md, CURRENT.md, WORKSTREAMS.md, ROSTER.md, ENVELOPE.md, CHATGPT-BOOT.md, DIR-003, CONTEXT-INDEX.md, bcp-ralph.js, ops-install.ps1).
- Recon: git status/branch/log; branched mission/amp-1 off main.
- Mission scaffold: CHARTER.md (ACTIVE, owner-approved in chat 2026-09-24) and this STATE.md.
- agent-tools built (stdlib only): lint (banners, links, immutability, CURRENT budget, STATE fields, branch match, clean-claim, allowlist + allowlist_ignore, DONE+escalations, L1 message rules), views (digest/brief/index/queue/resume), ingest (hash, byte-identical archive, deposit parser, receipts), wip (temp-index snapshots to refs/wip, prune 20).
- 30 unittest cases pass; real-repo `agent_lint.py` reports GREEN.

## IN_PROGRESS

- Building the design-context ledger, AUTONOMY.md, thinker lane files.

## NEXT_ACTION

Write docs/agent-system/AUTONOMY.md, context/INGEST.md, context/THINKER-PROTOCOL.md, context/inbox + insights dirs, first insights (allowlist_ignore decision, hook-target conflict), missions/INDEX.md via agent_views.py; run lint; commit with STATE touch.

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

## RESUME

1. Read AGENTS.md, then docs/agent-system/context/DIGEST.md, then this file.
2. Check `git status` and `git branch --show-current` (expect mission/amp-1).
3. Continue from NEXT_ACTION above; update this STATE and commit on the mission branch.
