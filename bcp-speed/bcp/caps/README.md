# Capability Context Cards

Auto-generatable one-pagers, one per capability: `caps/{FAM-nn.n}.md`.
Not required to operate BCP-SPEED, but cuts agent cold-start time a lot
once you have more than a handful of capabilities in flight.

Suggested shape for a card:

```markdown
# FAM-09.3 — Progressive Disclosure & Manifest Generation

**Invariant:** Disclosure is pull-based; push is injection.
**Current depth:** L1 (owner: AGT-beta, EXP-2026-003)
**Done criteria for L2:** happy path works, error path handled, logged.
**Depends on:** FAM-09.1 (>= L2)
**Blocks:** FAM-09.4
**Related discoveries:** DISC-004 (see state/discoveries.yaml)
**Related failures:** FAIL-002
**Pattern:** PAT-progressive-disclosure (if one exists)
```

These are cheap to generate on demand from `state/*.yaml` — you don't need
to maintain them by hand for every capability, only for the ones agents are
actively working that would benefit from a single reference doc.
