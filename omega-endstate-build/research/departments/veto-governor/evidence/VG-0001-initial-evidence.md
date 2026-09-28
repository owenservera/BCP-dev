# VG-0001 — Initial Evidence Receipt

Date: 2026-09-28
Branch: work/omega-endstate/STEW-01/bootstrap-team
Reviewer: VETO-01 / COORD-01 audit session

## E-001 — opencode-swarm is an independent orchestration substrate
Source: omega-endstate-build/runtime/vendor/opencode-swarm/src/orchestrator.ts
Observation: The orchestrator creates OpenCode sessions directly through the SDK, records session IDs in its own SQLite state, prompts those sessions itself, and coordinates them through its own MessageBus/SwarmMemory.
Implication: This is structurally different from native OpenCode Task child-session orchestration.
Status: OBSERVED

## E-002 — swarm memory is mutable key/value state
Source: omega-endstate-build/runtime/vendor/opencode-swarm/src/memory.ts
Observation: Memory is keyed by swarm_id + key and an update replaces the prior value.
Implication: Useful shared coordination memory, but not an append-only provenance/evidence chain.
Status: OBSERVED

## E-003 — swarm coordination tools are force-added
Source: omega-endstate-build/runtime/vendor/opencode-swarm/src/orchestrator.ts
Observation: The orchestrator merges the user tool map with SWARM_TOOLS and sets every swarm coordination tool to true.
Implication: An agent-level tools map cannot independently disable the swarm coordination tools once admitted to a swarm. This is a capability-boundary consideration.
Status: OBSERVED

## E-004 — resident lab deliberately keeps native Task as the spawn primitive
Sources: omega-endstate-build/runtime/resident-team-lab/README.md; omega-endstate-build/runtime/resident-team-lab/plugin/resident-team.ts
Observation: The resident lab describes native Task as the experimental worker creation primitive and the plugin currently records Task/session observations rather than replacing the native spawn path.
Status: OBSERVED

## E-005 — local Ω roster and inherited CFA bindings are different organizational surfaces
Sources: omega-endstate-build/team/AGENT-ROSTER.json; .opencode/agents/; docs/agent-system/AUTONOMOUS-TEAM-ARCHITECTURE-2026-09-28.md
Observation: The Ω team roster contains STEW-01 plus proposed PROV-01 and VER-01, while the repository contains inherited bindings for a Steward, ten CFA agents and five worker types.
Implication: There is potential topology duplication/ambiguity. The audit must identify which surfaces are active, inherited, experimental, or merely lineage.
Status: OBSERVED

## E-006 — native OpenCode semantics have moved since the lab's pinned evidence
Sources: omega-endstate-build/runtime/resident-team-lab/docs/CHECKPOINTS.md; https://opencode.ai/v2/docs/agents; https://opencode.ai/v2/docs/permissions; https://github.com/anomalyco/opencode/releases
Observation: The local lab centers OpenCode v1.18.4. Current OpenCode V2 documentation uses agents.<id>.permissions and the subagent permission action; the latest visible release is v1.18.32. V1 syntax remains supported in current migration documentation.
Implication: The lab's v1.18.4 conclusions require re-validation on the actual installed build before being used as current platform truth.
Status: OBSERVED / REQUEST-EVIDENCE FOR LOCAL RUNTIME

## E-007 — Agent Commons has stronger provenance primitives than swarm memory
Sources: AGENTS_CONTEXT/AGENT-COMMONS/runtime/src/crypto.ts; AGENTS_CONTEXT/AGENT-COMMONS/runtime/src/validation.ts; AGENTS_CONTEXT/AGENT-COMMONS/runtime/src/commons.ts
Observation: Commons events carry signatures and previous-hash chaining; validation checks event envelope, identity match, stream sequence, previous hash and signature. Commons supports durable streams, messages, handoffs and derived context.
Implication: Commons is materially closer to the workspace Truth Chain seed than the swarm's mutable memory/message model.
Status: OBSERVED

## E-008 — current Ω design explicitly treats prompt text as insufficient security
Source: docs/agent-system/DELEGATION-AND-CAPABILITY-ENFORCEMENT-2026-09-28.md
Observation: The current design states that prompt text is not security and that runtime capability and tool/resource permission are part of the enforcement hierarchy.
Status: OBSERVED

## Runtime limitation
No Windows/OpenCode live execution occurred in this audit session. Therefore no claim of current installed runtime behavior is execution-verified.