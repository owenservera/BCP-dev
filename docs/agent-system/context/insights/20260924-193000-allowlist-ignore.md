# Pre-existing untracked surfaces are allowlist-ignored, never allowlisted

> **Classification: DERIVED — CURRENT**

```yaml
id: INS-20260924-193000
date: 20260924
author: IMPL-04
mission: AMP-1
kind: DECISION
status: ADOPTED
confidence: high
sources: agent-tools/agent_lint.py (check_allowlist), docs/agent-system/missions/amp-1/CHARTER.md, git status (bcp-algos/, setupdocs.zip, docs/REPO-CLEANUP-PROMPT-V2.md untracked)
```

## Claim

Charters carry `allowlist_ignore` for pre-existing untracked paths the
mission will never touch; the L1 gate skips those paths instead of
refusing them.

## Why

The first real-repo lint run refused three paths (`bcp-algos/`,
`setupdocs.zip`, `docs/REPO-CLEANUP-PROMPT-V2.md`) that pre-date the
mission and are hands-off Tier 2 surfaces the agent must neither write
nor delete. Refusing them would pin lint red permanently with no
compliant action available.

## Alternatives considered or rejected

- Refuse all untracked paths outside the allowlist: rejected, leaves no
  compliant path (agent cannot delete Tier 2 surfaces to satisfy the gate).
- Silently exempt all untracked files: rejected, an agent could then
  create files anywhere (e.g. under omega-.../) without a gate refusal.
- Require deleting/ignoring via .gitignore: rejected, touching ignore
  rules for hands-off surfaces is itself out of scope.

## Consequences

In force for the mission: `allowlist_ignore` is explicit, auditable, and
checked before `write_allowlist`. New files outside both lists are still
refused. Template updated so future charters declare ignores up front.

## Evidence

`agent_lint.py` GREEN on the real repo after the change; unit test
`test_allowlist_ignore_covers_preexisting` passes (ignored path allowed,
unlisted path refused).
