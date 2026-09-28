# Agentic setup findings — research synthesis

Date: 2026-09-28

## 1. OpenCode already provides the primitive layers

Current documentation and source together expose a layered substrate:

`rules/instructions -> agent definitions -> permissions -> tools/skills/MCP -> Task/subagents -> sessions -> models/providers`

That is enough to build a sophisticated engineering organization without assuming a third-party orchestration framework is mandatory.

## 2. Agent identity and capability should stay separate

An agent's role/description/mode answers “who is this worker?” while permissions and tool availability answer “what may it do?”. Skills add reusable behavior/knowledge that can be loaded on demand.

This separation is valuable for Ω because responsibilities may evolve without requiring capability grants to evolve at the same time.

## 3. Context is a first-class resource

Rules, skills, session history, compaction, external resources, and model context all affect what the agent knows at execution time. A durable team should therefore record not only decisions and tasks, but also the context sources used to make them.

## 4. Delegation is a runtime boundary

Task creates child sessions and derives child permissions. Therefore “delegation” is not just a prompt convention. It is an executable runtime relationship that can be tested.

## 5. Workspace isolation is outside OpenCode

OpenCode's permission system is not a replacement for OS/filesystem/Git isolation. The team should keep both layers:

- runtime capability controls inside OpenCode;
- workspace/branch/process isolation outside the model.

## 6. v1 and v2 must be modeled separately

OpenCode's current site exposes v2 documentation/specs while the v1 configuration surface remains active. Ω research should tag every configuration claim with its source generation and exact version/ref.

## 7. MCP expands the capability plane

MCP is the natural interoperability boundary for external capabilities, but a local sovereign design must track transport, credential, authorization and remote/server trust separately.

## 8. Community orchestration is a design laboratory

Projects such as Oh-My-OpenAgent/OpenCode demonstrate valuable patterns for orchestration, categorization, fallbacks and team workflows. They should be treated as a pattern library to mine, not as a dependency decision.

## Immediate research questions for the Ω team

- What should be OpenCode configuration versus an Ω-owned control plane?
- When should Ω create an OpenCode subagent versus a process/worktree versus an external worker?
- What state must survive session compaction or model/provider changes?
- What evidence is required before an agent is granted broader permissions?
- How should agent capabilities be versioned and tested?
- How can Ω detect that OpenCode changed its agent/session/permission semantics?

These questions are intentionally unanswered here; they define the next research frontier.
