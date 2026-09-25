# Agent Commons Peer Roster

> Status: BOOTSTRAP COORDINATION REGISTER — 2026-09-25
> This file is a coordination registry for discovering agent-owned Commons streams. It is not an authority registry.

Runtime/bootstrap reads this file instead of requiring each session to hand-type `peerHomes`.

**Identity note:** rows marked `bootstrap-ready` contain coordination seed IDs. They are not proof that the agent has completed self-design or owner ratification. A born agent may change its canonical identity; update this roster as part of that identity transition.

| agent_id | home path | role | status |
|---|---|---|---|
| `world-ontology-context` | `AGENTS_CONTEXT/ARCHITECTURE_STEWARD/SUBAGENTS/WORLD-ONTOLOGY-CONTEXT` | World / Ontology / Context | bootstrap-ready |
| `data-model` | `AGENTS_CONTEXT/ARCHITECTURE_STEWARD/SUBAGENTS/DATA-MODEL-STEWARD` | Data / Identity / Persistence | bootstrap-ready |
| `semantic-continuity` | `AGENTS_CONTEXT/ARCHITECTURE_STEWARD/SUBAGENTS/SELF-KNOWLEDGE-COMMAND-COMPILER` | Semantic continuity across self-knowledge, language, command, intent, execution meaning, evidence and representation | ratified |
| `authority-governance` | `AGENTS_CONTEXT/ARCHITECTURE_STEWARD/SUBAGENTS/AUTHORITY-GOVERNANCE` | Authority / Governance | bootstrap-ready |
| `agency-work-execution` | `AGENTS_CONTEXT/ARCHITECTURE_STEWARD/SUBAGENTS/AGENCY-WORK-EXECUTION` | Agency / Work / Execution | bootstrap-ready |
| `capability-provider-realization` | `AGENTS_CONTEXT/ARCHITECTURE_STEWARD/SUBAGENTS/CAPABILITY-PROVIDER-REALIZATION` | Capability / Provider / Realization | bootstrap-ready |
| `composition-plugin-forge` | `AGENTS_CONTEXT/ARCHITECTURE_STEWARD/SUBAGENTS/COMPOSITION-PLUGIN-FORGE` | Composition / Plugin / Forge | bootstrap-ready |
| `experience-interaction-surfaces` | `AGENTS_CONTEXT/ARCHITECTURE_STEWARD/SUBAGENTS/EXPERIENCE-INTERACTION-SURFACES` | Experience / Interaction / Surfaces | bootstrap-ready |
| `evolution-compatibility-self-maintenance` | `AGENTS_CONTEXT/ARCHITECTURE_STEWARD/SUBAGENTS/EVOLUTION-COMPATIBILITY-SELF-MAINTENANCE` | Evolution / Compatibility / Self-Maintenance | bootstrap-ready |
| `runtime-constitution-core-substrate` | `AGENTS_CONTEXT/ARCHITECTURE_STEWARD/SUBAGENTS/RUNTIME-CONSTITUTION-CORE-SUBSTRATE` | Runtime Constitution / Core Substrate | bootstrap-ready |

## Registry rules

- One row identifies one Commons stream owner.
- `home path` is the repository-relative agent home used by the Git transport.
- `bootstrap-ready` is provisional; `ratified` means the Core Agent identity has been aligned and established.
- A renamed agent updates its row rather than silently creating a second identity.
- A remote `commons/<agent_id>` branch without a roster entry is an operational error, not something the runtime silently ignores.
- Retired rows remain readable for lineage unless their communication retention is separately governed.
