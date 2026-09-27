# CFA-09 — One-Shot Bootstrap Launch

Read and execute:

https://github.com/owenservera/BCP-dev/blob/main/AGENTS_CONTEXT/ARCHITECTURE_STEWARD/SUBAGENTS/CORE-FUNCTION-AREA-ONE-SHOT-BOOTSTRAP.md

## Human execution router

Use the master sequencing/router for launch order and predecessor context:

https://github.com/owenservera/BCP-dev/blob/main/AGENTS_CONTEXT/ARCHITECTURE_STEWARD/SUBAGENTS/CFA-05-10-ONE-SHOT-LAUNCH-ROUTER-2026-09-27.md

The router controls **sequence**, not CFA semantics. The canonical protocol below controls the **bootstrap procedure**.

## Parameters

- CFA_ID: CFA-09
- CANDIDATE_AREA: Evolution / Compatibility / Self-Maintenance
- AGENT_SLUG: evolution-compatibility-self-maintenance
- WORKSPACE: `AGENTS_CONTEXT/ARCHITECTURE_STEWARD/SUBAGENTS/EVOLUTION-COMPATIBILITY-SELF-MAINTENANCE/`
- DOMAIN_SEED: `AGENTS_CONTEXT/ARCHITECTURE_STEWARD/SUBAGENTS/EVOLUTION-COMPATIBILITY-SELF-MAINTENANCE/LAUNCH-PROMPT.md`
- PRIMARY_PEERS: CFA-02, CFA-06, CFA-07
- PRIMARY_SEAMS: change/migration/replacement; Data continuity; Capability; Composition; rollback/recovery

## Before self-design

Read the complete CFA-specific `LAUNCH-PROMPT.md` as a seed. Read CFA-01–04 Round-2 results plus completed CFA-05–08 durable artifacts.

## Execution constraint

Do not create `CORE-AGENT.md` until Owner Dialogue / Alignment is satisfied.

## Output

Follow the canonical completion gate. Commit durable artifacts directly to `main`, then report exact SHA, identity status, completion state, unresolved items and Commons verification.
