# CFA-07 — One-Shot Bootstrap Launch

Read and execute:

https://github.com/owenservera/BCP-dev/blob/main/AGENTS_CONTEXT/ARCHITECTURE_STEWARD/SUBAGENTS/CORE-FUNCTION-AREA-ONE-SHOT-BOOTSTRAP.md

## Human execution router

Use the master sequencing/router for launch order and predecessor context:

https://github.com/owenservera/BCP-dev/blob/main/AGENTS_CONTEXT/ARCHITECTURE_STEWARD/SUBAGENTS/CFA-05-10-ONE-SHOT-LAUNCH-ROUTER-2026-09-27.md

The router controls **sequence**, not CFA semantics. The canonical protocol below controls the **bootstrap procedure**.

## Parameters

- CFA_ID: CFA-07
- CANDIDATE_AREA: Composition / Plugin / Forge
- AGENT_SLUG: composition-plugin-forge
- WORKSPACE: `AGENTS_CONTEXT/ARCHITECTURE_STEWARD/SUBAGENTS/COMPOSITION-PLUGIN-FORGE/`
- DOMAIN_SEED: `AGENTS_CONTEXT/ARCHITECTURE_STEWARD/SUBAGENTS/COMPOSITION-PLUGIN-FORGE/LAUNCH-PROMPT.md`
- PRIMARY_PEERS: CFA-06, CFA-05, CFA-09
- PRIMARY_SEAMS: composition identity; admission/extension; Capability; Work; Evolution; replacement

## Before self-design

Read the complete CFA-specific `LAUNCH-PROMPT.md` as a seed. Read CFA-01–04 Round-2 results plus completed CFA-05–06 durable artifacts.

## Execution constraint

Do not create `CORE-AGENT.md` until Owner Dialogue / Alignment is satisfied.

## Output

Follow the canonical completion gate. Commit durable artifacts directly to `main`, then report exact SHA, identity status, completion state, unresolved items and Commons verification.
