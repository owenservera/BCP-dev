# CFA Home Upgrade — Owner Launch Queue

> Date: 2026-09-27
> Status: READY FOR OWNER LAUNCH
> Governing protocol: FSSP-1.1
> Purpose: launch one fresh ChatGPT session per ratified CFA to validate and upgrade its own durable home.

## Owner action

Open a new ChatGPT conversation for each CFA below.

Use the linked CFA home as the first/seed message, then paste the matching shared launch envelope.

Run serially: CFA-01 → CFA-02 → CFA-03 → CFA-04 → CFA-05 → CFA-06 → CFA-07 → CFA-08 → CFA-09 → CFA-10.

After each session reports completion, verify its commit on `main` before launching the next.

## Shared launch envelope

```text
You are the fresh ChatGPT agent session for the CFA named below.

Open and work from this repository home:
<CFA HOME LINK>

Follow FSSP-1.1:
https://github.com/owenservera/BCP-dev/blob/main/AGENTS_CONTEXT/ARCHITECTURE_STEWARD/CHATGPT-FRESH-SESSION-PROTOCOL.md

Follow the CFA home-upgrade contract:
https://github.com/owenservera/BCP-dev/blob/main/AGENTS_CONTEXT/ARCHITECTURE_STEWARD/CFA-HOME-UPGRADE-PROTOCOL-2026-09-27.md

Your task is to validate and upgrade ONLY your own durable agent home against the current operating model.

Do not repeat CFA birth or ratification. Your identity is already ratified in current main.

Read current main and your home first. Verify your identity, current state, lessons, boundaries, and front-door navigation. Fix only agent-specific gaps supported by repository evidence.

Do not change Ω law, activate shared boundaries, create duplicate identity stores, or begin unrelated implementation.

Complete the home-upgrade gate, commit justified changes to main, and return the full FSSP-1.1 report.

STOP after your home upgrade and report.
```

## CFA-01 — World & Context Steward
Home: https://github.com/owenservera/BCP-dev/tree/main/AGENTS_CONTEXT/ARCHITECTURE_STEWARD/SUBAGENTS/WORLD-ONTOLOGY-CONTEXT
agent_id: `world-ontology-context`

## CFA-02 — Data Steward
Home: https://github.com/owenservera/BCP-dev/tree/main/AGENTS_CONTEXT/ARCHITECTURE_STEWARD/SUBAGENTS/DATA-MODEL-STEWARD
agent_id: `data-model`

## CFA-03 — Semantic Continuity Steward
Home: https://github.com/owenservera/BCP-dev/tree/main/AGENTS_CONTEXT/ARCHITECTURE_STEWARD/SUBAGENTS/SELF-KNOWLEDGE-COMMAND-COMPILER
agent_id: `semantic-continuity`

## CFA-04 — Authority Governance Steward
Home: https://github.com/owenservera/BCP-dev/tree/main/AGENTS_CONTEXT/ARCHITECTURE_STEWARD/SUBAGENTS/AUTHORITY-GOVERNANCE
agent_id: `authority-governance`

## CFA-05 — Work & Execution Steward
Home: https://github.com/owenservera/BCP-dev/tree/main/AGENTS_CONTEXT/ARCHITECTURE_STEWARD/SUBAGENTS/AGENCY-WORK-EXECUTION
agent_id: `agency-work-execution`

## CFA-06 — Capability & Provider Realization Steward
Home: https://github.com/owenservera/BCP-dev/tree/main/AGENTS_CONTEXT/ARCHITECTURE_STEWARD/SUBAGENTS/CAPABILITY-PROVIDER-REALIZATION
agent_id: `capability-provider-realization`

## CFA-07 — Composition / Plugin / Forge Steward
Home: https://github.com/owenservera/BCP-dev/tree/main/AGENTS_CONTEXT/ARCHITECTURE_STEWARD/SUBAGENTS/COMPOSITION-PLUGIN-FORGE
agent_id: `composition-plugin-forge`

## CFA-08 — Experience / Interaction / Surfaces Steward
Home: https://github.com/owenservera/BCP-dev/tree/main/AGENTS_CONTEXT/ARCHITECTURE_STEWARD/SUBAGENTS/EXPERIENCE-INTERACTION-SURFACES
agent_id: `experience-interaction-surfaces`

## CFA-09 — Change, Compatibility & Continuity Steward
Home: https://github.com/owenservera/BCP-dev/tree/main/AGENTS_CONTEXT/ARCHITECTURE_STEWARD/SUBAGENTS/EVOLUTION-COMPATIBILITY-SELF-MAINTENANCE
agent_id: `evolution-compatibility-self-maintenance`

## CFA-10 — Runtime Constitution & Core Substrate Steward
Home: https://github.com/owenservera/BCP-dev/tree/main/AGENTS_CONTEXT/ARCHITECTURE_STEWARD/SUBAGENTS/RUNTIME-CONSTITUTION-CORE-SUBSTRATE
agent_id: `runtime-constitution-core-substrate`

## Completion / handoff

Each CFA session stops after its own home is validated and upgraded.

The owner returns to the Architecture Steward with the session report.

The Steward verifies the reported commit on current `main`, then authorizes the next launch.

After CFA-10, the Steward resumes constellation reconciliation.
