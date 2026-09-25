# VIVIM SYSTEM INTELLIGENCE
## Pass 2 — Structural Coverage & Falsification

Repository:
`https://github.com/owenservera/BCP-dev`

Source archaeology branch:
`research/system-intelligence-archaeology`

Source tip:
`a7971a0557c464786b0db922cff34ae799e91767`

## Purpose

Pass 1 asked: **WHAT EXISTS?**

Pass 2 asks: **WHAT DID WE MISS, OVER-SIMPLIFY, MISCONNECT, OR ASSUME?**

This is a read-only structural audit and falsification pass.

Do not implement production code.
Do not redesign Ω.
Do not create a second ontology or agent system.
Do not turn findings into architecture law.
Do not overwrite Pass 1.

## Read first

Read:
- /AGENTS.md
- /BUILD_CONTEXT.md
- /docs/CURRENT-CONTEXT.md
- all docs/destination/system-intelligence apparatus
- all Pass 1 synthesis and indexes
- relevant destination/program documents

## Core audit targets

1. Self-evolving data model:
   prompts, commands, conversations, messages, attachments, artifacts, documents, files, structured outputs, provider/account/session state, work, evidence, memory, relationships, derived knowledge.
   Trace CREATE → REPRESENT → MODIFY → PERSIST → QUERY → TRANSFORM → DERIVE → REFERENCE → EXPORT → RESTORE.
   Determine canonical vs derived/projection, provenance, versioning, schema evolution, unknown-field tolerance, and whether new object types require core redesign.

2. Provider system:
   Provider → Account → Session → Model → Capability → Protocol → Realization → Parser → Execution → Result → Evidence.
   Reconstruct onboarding and healing:
   Discover → Capture → Understand → Model → Realize → Test → Promote → Monitor → Drift → Repair → Verify → Rollback.
   Distinguish code/test/fixture/live proof/proposed/historical/absent.
   Falsify shared abstractions with a third-provider test.

3. Provider protocol knowledge:
   Find exactly where knowledge is stored, how it is queried, versioned, updated, validated, linked to realizations, used by parsers/execution, and whether it can be learned/repaired safely.

4. Routing:
   Reconstruct provider/account/model/realization selection under explicit user policy; find implicit routing and hidden authority.

5. Browser substrate:
   Master → Profile → Account → Session → Tab/Page → Extension/CDP → Provider.
   Inspect process/profile/session ownership, sharing, isolation, concurrency, locking, reuse, idle lifecycle, startup/attachment cost, crash/restart/recovery and resource evidence.
   Compare Legacy ChromeGovernor, current BCP Ω and standalone Ω without assuming historical design is correct.

6. Shared vs bespoke:
   For common abstractions, identify independent consumers, material differences and what a third provider would break.
   Find provider-specific leakage into canonical models.

7. Plugin graph / reprogrammability:
   Treat Plugin → Capability → Dependency → State → Event → Authority → Other Capability as a graph.
   Find hidden imports, singleton escape hatches, lifecycle coupling, state ownership ambiguity, circular dependencies, direct host/runtime bypasses, and update/replacement limits.
   For adding a provider, artifact type, capability, surface, parser, routing rule, realization or repair path classify whether it is composable, contract-extensible, requires core/data/runtime change, or unknown.

8. Self-knowledge:
   Determine what VIVIM actually knows about itself, where it is represented, who updates it, whether it is evidence-backed/current/runtime-accessible/actionable, how staleness is detected, and whether agents can safely use it to extend/repair the system.

9. Legacy parity:
   Search actual Legacy VIVIM for meaningful user-facing behavior, not just destination docs.
   Build:
   Legacy capability → evidence → V1 parity candidate → destination support → current implementation → proof.
   Also find destination capabilities missing from both Legacy and current BCP.

10. Boundary falsification:
    Attack Provider/Account, Account/Session, Session/Browser, Intent/Capability, Capability/Realization, Capability/Authority, Work/Evidence, Vault/World, Plugin/Runtime, Composition/Product Instance, Surface/Canonical Data, Artifact/Message, Artifact/Document, Canonical Data/Provider Representation, Canonical Data/Self-Knowledge.

## Structural probes

Use these where applicable:
- Orphan
- Phantom
- Hidden fan-out
- Hidden dependency
- False shared abstraction
- Missing reverse trace
- Lifecycle hole
- Evolution hole
- Authority hole
- External-reality hole
- Resource hole
- Self-knowledge hole

## Third-variation tests

Data:
message → rich message → artifact/new object.

Provider:
A → B → C.

Plugin:
A → A+B → replacement/new Forge-created plugin.

Browser:
one account → multiple accounts → concurrent tasks → expiry → restart.

Work:
synchronous → streaming → background → interrupted/resumed.

Ask whether the same conceptual structure survives variation.

## Outputs

Create a separate Pass 2 namespace under:
`docs/destination/system-intelligence/pass-2/`

Produce role artifacts and final synthesis including:

- STRUCTURAL-COVERAGE-AUDIT.md
- HIDDEN-DEPENDENCY-MAP.md
- DATA-EVOLUTION-AUDIT.md
- PROVIDER-SYSTEM-AUDIT.md
- BROWSER-SUBSTRATE-AUDIT.md
- PLUGIN-GRAPH-AND-REPROGRAMMABILITY-AUDIT.md
- SELF-KNOWLEDGE-AUDIT.md
- LEGACY-PARITY-AND-NEGATIVE-SPACE.md
- BOUNDARY-FALSIFICATION.md
- V1-CRITICAL-AREAS.md
- OPEN-FRONTIER.md
- RED-TEAM.md
- separate ATOMS/EDGES/EVIDENCE indexes

## V1 Critical Areas

Evaluate at minimum:
1. self-evolving data model
2. provider abstraction
3. provider protocol knowledge
4. provider onboarding
5. provider parsing/translation
6. provider healing
7. routing
8. account/session lifecycle
9. Chrome master/slave substrate
10. shared vs bespoke
11. plugin capability graph
12. self-knowledge
13. reprogrammability
14. Product Instance/persistence
15. Legacy capability parity
16. Durable Work/continuity

Use independent dimensions:
dependency reach, product/user reach, boundary exposure, external reality, uncertainty, evidence strength, complexity, legacy dependence, reprogrammability impact, experimentation requirement, design requirement, implementation requirement.

Do not produce one composite score.

## Required classification

For significant findings use:
PROVEN
IMPLEMENTED-BUT-UNDERPROVEN
IMPLEMENTED-BUT-STRUCTURALLY-WEAK
DESTINATION-DESIGNED-BUT-NOT-IMPLEMENTED
PARTIAL
LEGACY-ONLY
HISTORICAL
PROVIDER-SPECIFIC
MISSING
UNKNOWN
REQUIRES-DESIGN
REQUIRES-EXPERIMENT
REQUIRES-IMPLEMENTATION

## Stop

Stop after Pass 2 synthesis.

Do not immediately implement.
Do not automatically launch every earlier deep dive.

For each major area, recommend:
DESIGN FIRST
EXPERIMENT FIRST
IMPLEMENT FIRST
SAFE TO DEFER

The final question is:

**If we attempted to build VIVIM V1 now, where would substantial new design or hard engineering be required that is not obvious from the current Ω surface?**

Also answer:

**What did Legacy VIVIM already know how to do that V1 must preserve, but Ω/BCP does not yet convincingly reproduce?**

And:

**What parts of VIVIM are genuinely designed to evolve themselves, versus still fundamentally depending on us as developers?**
