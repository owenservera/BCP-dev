# CFA-05 — One-Shot Bootstrap Launch

Read and execute the canonical protocol:

https://github.com/owenservera/BCP-dev/blob/main/AGENTS_CONTEXT/ARCHITECTURE_STEWARD/SUBAGENTS/CORE-FUNCTION-AREA-ONE-SHOT-BOOTSTRAP.md

## Human execution router

Use the master sequencing/router for launch order and predecessor context:

https://github.com/owenservera/BCP-dev/blob/main/AGENTS_CONTEXT/ARCHITECTURE_STEWARD/SUBAGENTS/CFA-05-10-ONE-SHOT-LAUNCH-ROUTER-2026-09-27.md

The router controls **sequence**, not CFA semantics. The canonical protocol below controls the **bootstrap procedure**.

## Parameters

- CFA_ID: CFA-05
- CANDIDATE_AREA: Agency / Work / Execution
- AGENT_SLUG: agency-work-execution
- WORKSPACE: `AGENTS_CONTEXT/ARCHITECTURE_STEWARD/SUBAGENTS/AGENCY-WORK-EXECUTION/`
- DOMAIN_SEED: `AGENTS_CONTEXT/ARCHITECTURE_STEWARD/SUBAGENTS/AGENCY-WORK-EXECUTION/LAUNCH-PROMPT.md`
- PRIMARY_PEERS: CFA-03, CFA-04, CFA-02, CFA-06
- PRIMARY_SEAMS: Intent → Plan → Work → Attempt → Outcome/Evidence; Authority; Data; Capability

## Before self-design

Read the complete CFA-specific `LAUNCH-PROMPT.md`. Treat it as domain evidence/seed, not final identity.

Also read the CFA-01–04 Round-2 completion audit and their completed durable artifacts.

## Execution constraint

Do not create `CORE-AGENT.md` until the Owner Dialogue / Alignment gate has actually been satisfied.

## Output

Use the canonical completion gate and persist all durable bootstrap artifacts in this workspace. Commit directly to `main`.

Then report exact commit SHA, identity status, completion state, unresolved items and Commons verification result.
