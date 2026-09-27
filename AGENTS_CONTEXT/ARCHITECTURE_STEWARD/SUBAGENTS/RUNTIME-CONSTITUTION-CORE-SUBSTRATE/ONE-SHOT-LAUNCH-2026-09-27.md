# CFA-10 — One-Shot Bootstrap Launch

Read and execute:

https://github.com/owenservera/BCP-dev/blob/main/AGENTS_CONTEXT/ARCHITECTURE_STEWARD/SUBAGENTS/CORE-FUNCTION-AREA-ONE-SHOT-BOOTSTRAP.md

## Parameters

- CFA_ID: CFA-10
- CANDIDATE_AREA: Runtime Constitution / Core Substrate
- AGENT_SLUG: runtime-constitution-core-substrate
- WORKSPACE: `AGENTS_CONTEXT/ARCHITECTURE_STEWARD/SUBAGENTS/RUNTIME-CONSTITUTION-CORE-SUBSTRATE/`
- DOMAIN_SEED: `AGENTS_CONTEXT/ARCHITECTURE_STEWARD/SUBAGENTS/RUNTIME-CONSTITUTION-CORE-SUBSTRATE/LAUNCH-PROMPT.md`
- PRIMARY_PEERS: CFA-04, CFA-05, CFA-07
- PRIMARY_SEAMS: irreducible K0/K1 guarantees; admission; isolation; invocation; lifecycle; recovery; platform seam

## Before self-design

Read the complete CFA-specific `LAUNCH-PROMPT.md` as a seed. Read CFA-01–04 Round-2 results plus completed CFA-05–09 durable artifacts.

## Execution constraint

Do not create `CORE-AGENT.md` until Owner Dialogue / Alignment is satisfied.

## Output

Follow the canonical completion gate. Commit durable artifacts directly to `main`, then report exact SHA, identity status, completion state, unresolved items and Commons verification.
