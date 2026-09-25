# AUTHORITY-MAP — compact current-authority map (2026-09-23 cleanup)

Read `/AGENTS.md` for the ranked authority chain. This file maps each area to
its current authority document. Historical / raw locations listed for contrast.

```text
AREA                         CURRENT AUTHORITY
------------------------------------------------------------
Repo entry / boundaries      /AGENTS.md (new, this cleanup)
Repo build context           /BUILD_CONTEXT.md (new, this cleanup)
Repo truth map               docs/CURRENT-CONTEXT.md (new, this cleanup)
------------------------------------------------------------
BCP control state            bcp-speed/bcp/state/*.yaml via bcp_tool.py ONLY
BCP vocabulary (enforced)    bcp-speed/bcp/state/taxonomy.yaml  [LAW]
BCP tie-breaker              bcp-speed/bcp/RECONCILIATION.md  [LAW]
BCP agent bootstrap          bcp-speed/bcp/agents/bootstrap.md + role files
BCP loop protocol            bcp-speed/bcp/agents/lanes.md §§ universal/LOOP
                             (lane first-lease sequences: HISTORICAL, bannered)
BCP directives (live)        bcp-speed/bcp/agents/inbox/WN.md — coordinator
                             re-issues on resume (2026-09-22 entries: PARKED)
BCP automation               docs/CONTEXT-system.md §6 + workspaces/STATE.json
                             (Tasks 1–6 PASS; plan in docs/archive/project-history/bcp-construction-2026-09-22/:
                             HISTORICAL)
BCP migration model          docs/migration/MIGRATION_MODEL.md
                             (PROPOSED-but-exercised; state promotion deferred
                             by recorded decision — see CONFLICT-REGISTER C9)
BCP migration records        bcp-speed/bcp/migration/index.json → MIG-NNN dirs
BCP migration knowledge      docs/migration/ (13 files, 2026-09-23)
------------------------------------------------------------
Ω ratified decisions         omega-…/docs/BUILD-DECISIONS.md + docs/decisions/  [LAW]
Ω current invariants         omega-…/docs/decisions/CURRENT-INVARIANTS.md  [LAW]
Ω decision contract          omega-…/docs/decisions/README.md  [LAW]
Ω cross-track citations      omega-…/docs/decisions/CROSS-TRACK-REGISTRY.md  [LAW]
Ω current forge sequencing   omega-…/docs/forge/BACKLOG.md
Ω end-state vision           omega-…/docs/forge/OMEGA-ENDSTATE-VISION.md (D-407/D-408)
Ω migration plan             omega-…/docs/migration/ (README/INTENT/FACT-BASE/
                             STRATEGY/WAVE0-NEEDS/STATUS + 40-EVIDENCE/50-RUNBOOKS)
Ω working analysis           omega-…/docs/forge/annex/ (NEVER law, self-declared)
------------------------------------------------------------
VIVIM behavior source        vivim-original-baseline/vivim-final-enhanced/
                             (READ-ONLY mine; evidence, never authority)
------------------------------------------------------------
Historical planning          docs/archive/project-history/bcp-construction-2026-09-22/
                             (ORCHESTRATION-REDESIGN.md, TRACKER.md, setupdocs/)

Raw research                 docs/archive/sessions/ · docs/archive/conversations/
Unknown / hands-off          bcp-algos/ · omega-…/docs/architecture/ (untracked) ·
                             omega-…/examples/plugin-echo2/ (untracked) ·
                             setupdocs.zip (untracked legacy local artifact; do not touch without owner) — see CONFLICT-REGISTER C11
```

## Authority graph (how truth flows)

```text
CURRENT PLAN (EXP-004/005/006 in state/experiments.yaml)
  → directive (agents/inbox/WN.md — parked, re-issued on resume)
    → implementation (bcp work/ scratch + MIG-NNN records + Ω tree)
      → gate (validate.py / sweep.py for BCP; omega:gate + falsifiers for Ω)
        → evidence (log/*.yaml, discoveries, verification-reports, 40-EVIDENCE/)
          → law (Ω D-records; BCP taxonomy + RECONCILIATION.md)

OLD PLAN (docs/archive/project-history/bcp-construction-2026-09-22/ORCHESTRATION-REDESIGN.md,
             docs/archive/project-history/bcp-construction-2026-09-22/setupdocs/01–03, lanes first-leases)
  → SUPERSEDED BY (workspaces/STATE.json 6×PASS; sweep-merge events;
                   MIG-001/MIG-002 VERIFIED)
    → CURRENT DECISION (CONTEXT-system/product/appendix; CURRENT-CONTEXT.md)
```

Supersession direction is append-only everywhere: new records supersede old
ones; old records are bannered, never rewritten (Ω D-law; BCP log/leases
immutability in MY-LOOP.md §5).
