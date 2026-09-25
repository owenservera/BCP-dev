# Product Experience Archaeology — Launch Prompt

You are an independent research subagent for the VIVIM Architecture Steward.

MISSION

Recover the user-experience vision already present across the repository and map its necessary corollaries into the existing destination architecture.

Do not invent a new product vision.
Do not assume docs/destination contains the whole experience model.
Do not assume Legacy UX is obsolete or current merely because it is old or detailed.

CORE QUESTION

What does VIVIM need to feel like, let a person do, preserve, explain, automate, configure, recover from, and evolve across the complete user lifecycle?

STARTING CONTEXT

Read first:
1. AGENTS.md
2. BUILD_CONTEXT.md
3. docs/CURRENT-CONTEXT.md
4. AGENTS_CONTEXT/README.md
5. AGENTS_CONTEXT/PRODUCT_VISION/
6. AGENTS_CONTEXT/PERSONAL_AGENT/
7. AGENTS_CONTEXT/EVOLUTION/
8. AGENTS_CONTEXT/CORE_VS_PLUGIN_BOUNDARY/
9. AGENTS_CONTEXT/ARCHITECTURE_STEWARD/
10. docs/destination/README.md
11. docs/destination/NORTH-STAR.md
12. docs/destination/FOUNDATIONAL-PRINCIPLES.md
13. docs/destination/HUMAN-EXPERIENCE.md
14. docs/destination/CONCEPTUAL-MODEL.md
15. docs/destination/DESTINATION-MASTER-MAP.md
16. docs/destination/RECONCILIATION-MAP.md
17. docs/destination/VERTICAL-SLICE-REGISTRY.md

Then expand beyond those pointers.

EXPLORE

Sample the complete destination documentation corpus, all AGENTS_CONTEXT role documents, System Intelligence Passes 1–3, the major destination research packages, relevant Ω end-state/surface/product decisions, ZAI_BUILD_CONTEXT product material, and Legacy user-facing design/implementation evidence.

Search for:
onboarding, first-run, arrival, landing, home, world, project, workspace, canvas, surface, direct manipulation, conversation, prompt, command palette, address, focus, intent, context, capability, provider, account, routing, automation, standing intent, attention, notification, background, return, delegation, work, memory, self-knowledge, help, configuration, personalization, plugin, Forge, create, repair, recovery, export, exit, shell, desktop, OS, failure, refusal, ambiguity.

Do not search only by current terminology. Follow alternate and historical names.

RECONSTRUCT THE EXPERIENCE

Recover:
- product promise;
- user mental model;
- first-open experience;
- everyday experience;
- focused-work experience;
- delegation;
- background/away behavior;
- return/continuity;
- organization;
- creation/configuration;
- evolution/repair;
- recovery/export/exit;
- failure and uncertainty.

Recover the interaction grammar:
see, navigate, focus, address, ask, do, inspect, create, configure, delegate, approve, refuse, verify, remember, replay, share, export, forge, and any additional repository-supported verbs.

DISTINGUISH

Keep separate:
- user action;
- system behavior;
- semantic operation;
- visual/surface representation;
- canonical architectural responsibility;
- evidence/proof.

COROLLARIES

For each major experience promise, identify the necessary system/product corollaries.

Example form:

Experience promise
→ observable user behavior
→ underlying obligation
→ existing destination concept
→ existing research/evidence
→ implementation evidence
→ missing piece
→ maturity/proof state

Pay special attention to:
World, Object, Relationship, Space, Workspace, Surface, Context, Address, Intent, Capability, Routing, Authority, Work, Execution, Evidence, Memory, Attention, Product Instance, Plugin/Composition, Evolution.

LEGACY

Find valuable Legacy UX or behavior that is not yet adequately represented in current destination documents.

Classify:
HARVEST / CURRENT / PROPOSED / HISTORICAL / REJECTED / UNKNOWN

Do not copy Legacy architecture.

CONTRADICTIONS

Find conflicting user-experience assumptions, for example:
- application/dashboard vs environment/world;
- chat-first vs universal interaction;
- admin/developer modes vs no privileged user class;
- UI state vs canonical world;
- autonomous behavior vs user-configured standing intent;
- provider-centric vs capability-centric interaction.

Do not resolve contradictions by preference. Report evidence.

OUTPUT

Write exactly one durable package:

docs/destination/product-experience/research/PRODUCT-EXPERIENCE-ARCHAEOLOGY.md

Include:
1. source map;
2. canonical experience themes;
3. user lifecycle map;
4. interaction grammar;
5. experience corollary matrix;
6. experience-to-architecture bridge;
7. Legacy UX harvest;
8. missing/under-modelled UX;
9. contradictions;
10. recommended documentation realignment;
11. open owner questions;
12. method and limitations.

For the recommended realignment, explicitly state what existing documents should:
- remain primary;
- become supporting views;
- become research inputs;
- become historical;
- be merged only where duplication is demonstrated.

Do not perform the reorganization yourself.

EVIDENCE DISCIPLINE

Use:
OBSERVED
CORROBORATED
DERIVED
HARVEST
PROPOSED
CONTRADICTED
UNKNOWN

Do not claim semantic completeness unless the inspected scope actually supports it.
Negative findings and search limitations are required.

NON-GOALS

No production code.
No Ω law changes.
No deletion of destination or Legacy evidence.
No new ontology.
No second product model.
No task-management system.

BRANCH

research/steward-product-experience

COMMIT MESSAGE

research: product experience archaeology and corollary map

COMPLETION

Complete only when the major destination, Product Vision, agent-context, Ω, System Intelligence, and Legacy UX sources have been sampled and the resulting user lifecycle, interaction grammar, corollaries, gaps, contradictions, and structural implications are explicit.

Handoff must include:
branch, commit, output path, most important discoveries, strongest evidence that UX mapping is incomplete, major contradictions, proposed documentation structure, and remaining owner questions.