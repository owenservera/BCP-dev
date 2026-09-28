# VETO-01 Self-Audit Protocol

> Status: OPERATIONAL
> Purpose: detect drift or weakness in the department itself without silently granting new authority.

A self-audit asks whether VETO-01 can still be cold-started, understood, evidenced, recovered and governed as declared.

## When to run
- bootstrap of a fresh department session;
- recovery after interruption;
- before activating department self-evolution;
- after consequential department changes;
- when explicitly requested by the owner.

## Audit sequence
1. **Contract integrity** — compare AGENTS.md, manifest, STATE.json, protocols and templates.
2. **State integrity** — verify tasks, claims, queue view and freshness are reconstructible.
3. **Evidence integrity** — separate observed facts, verification, inference and unknowns.
4. **Operational integrity** — inspect convenience tools against their documented semantics.
5. **Organizational integrity** — look for authority creep, hidden scheduling, role duplication, context flooding and self-preservation.
6. **Evolution integrity** — require recurrence, baseline, experiment, falsifier, rollback and owner ratification for operating-model changes.

## Output
A self-audit should leave:
1. a durable result;
2. ledger entries for structural observations;
3. explicit activated changes versus proposals;
4. unresolved evidence gaps;
5. follow-up tasks where experimentation is warranted.

Static inspection is useful; live execution is stronger evidence.

## Non-negotiable boundary
Self-audit may discover and propose changes.
It may not use self-audit to grant VETO-01 additional authority.
