# VIVIM Core vs Plugin Boundary — Archaeological Distillation

> Classification: DERIVED — PROPOSED DEVELOPMENT CRITERION
> Status: initial distillation from Ω law, Ω migration archaeology, VIVIM legacy boundary archaeology, destination reconciliation, and Evolution/Everything-is-a-Plugin design.
> Date: 2026-09-25
> Authority: not Ω law; must not override ratified decisions.

## Executive conclusion

The archaeology supports three architectural strata plus tooling, not a simple binary:

~~~text
K0  Ω KERNEL
    irreducible, non-bypassable enforcement substrate

K1  CORE CONTRACTS / PROTOCOLS
    shared vocabulary at the plugin boundary; mostly types/rules, not product implementations

P   PLUGINS
    first-party system plugins + user/third-party extension plugins

T   OUT-OF-TREE TOOLING
    development, research, generators, tests, diagnostics, CI
~~~

The key rule is:

> **Core contains the minimum machinery required to make plugins safely exist. Plugins contain the meaning, behavior, product, domain knowledge, storage implementations, policy content, and evolution candidates that make VIVIM useful.**

A first-party plugin can be essential to the default product and still not be Core.

## 1. The archaeological answer

Across the current Ω law and older VIVIM boundary work, the same pattern appears repeatedly:

### Ω current law

The ratified Ω snapshot explicitly establishes B1–B5: signed Recipe and content-hash admission; isolated plugin compartments and Port Protocol; host-side capability-token verification; fail-closed verification with pinned-recipe recovery; and a deliberately bounded µhost. The same law states that everything else is a plugin and the host is transport, not policy.

### Ω migration archaeology

The Layered Cake places the µhost first, contracts second, shim/platform next, and product capabilities in plugin layers. It states that if a harvest needs host code, the design is wrong and the responsibility should move to a plugin or out-of-tree tooling.

### Legacy VIVIM boundary archaeology

The old boundary material repeatedly distinguishes:

~~~text
mechanism = kernel
content   = plugin
~~~

It explicitly identifies conversation, memory, provider catalogs, NLCL, browser automation, harness semantics, product data, and canvas UI as product responsibilities rather than kernel responsibilities.

The archaeology therefore strengthens the Ω boundary instead of arguing for a larger Core.

## 2. The Core Test

A new responsibility belongs in K0 Core only when the following are substantially true.

### C1 — Plugin-independent necessity

The mechanism must exist before an arbitrary plugin can safely run.

### C2 — Non-bypassable enforcement

If implemented as a plugin, that plugin could potentially bypass, redefine, or weaken the boundary it is supposed to enforce.

### C3 — Domain neutrality

The mechanism must not contain knowledge specific to chat, email, browser providers, memory, projects, canvas, AI models, or another product domain.

### C4 — Cross-plugin universality

The mechanism applies to essentially every plugin rather than only one family of capabilities.

### C5 — Stable constitutional responsibility

Changing it has system-wide compatibility, security, or integrity consequences and therefore belongs behind the strongest change-control boundary.

### C6 — Minimality

If the job can be expressed as a contract, manifest contribution, plugin, composition, or out-of-tree tool, it does not belong in K0.

### C7 — No product semantics

The mechanism must not answer what VIVIM should remember, what a conversation is, how a provider behaves, what a project means, what the user wants, or how a surface should look.

A proposed K0 addition that fails these tests defaults to plugin or contract until a named falsifier demonstrates otherwise.

## 3. What belongs in K0

### K0.1 Boot and integrity

Core owns the non-bypassable admission mechanism:

- signed Recipe verification;
- manifest verification;
- content hashing;
- composition integrity;
- duplicate routed-op rejection where required for safe admission;
- boot-phase ordering enforcement;
- fail-closed verification boundaries.

Plugin responsibility: declare what it is and what it requests.
Core responsibility: determine structural admissibility.

### K0.2 Plugin isolation and transport

Core owns:

- compartment creation;
- worker/process boundary mechanics required by the current Ω tier;
- Port Protocol transport;
- message-boundary enforcement;
- readiness/fencing primitives;
- safe termination.

Plugins own application behavior and domain semantics.

### K0.3 Capability egress enforcement

Core owns the mechanism answering whether a caller is actually allowed to invoke a granted capability.

That includes:

- capability-token verification;
- token ownership;
- revocation mechanics;
- generation/fencing semantics;
- egress enforcement.

Plugin/domain responsibility: capability definitions, policy content, and capability implementations.

~~~text
WHAT capability exists        → plugin
WHO may use it                → authority/policy domain
CAN the boundary enforce it   → Core
~~~

### K0.4 Atomic activation and recovery substrate

Core owns only the boundary needed to prevent invalid or partially activated compositions from becoming the running system:

- atomic activation boundary;
- pinned-recipe fallback;
- verification-before-execution;
- crash-safe transition/fencing primitives;
- quarantine/refusal mechanics required at admission.

Domain-specific recovery remains plugin-owned.

### K0.5 Platform seam

Core/platform owns the minimal OS-aware substrate required by the runtime:

- owner-scoped data-directory resolution;
- platform-safe filesystem/process primitives;
- one narrow OS boundary for the runtime.

It must not become a Windows product subsystem, file manager, desktop automation system, browser manager, notification manager, or app launcher.

### K0.6 Cryptographic and identity primitives

Core may own the mechanisms required for:

- content hashing;
- signature verification;
- canonical encoding;
- capability identity;
- plugin/composition identity;
- stable protocol references.

It must not own domain identities such as projects, conversations, provider accounts, memories, or external people.

### K0.7 Boundary lifecycle

Core owns generic runtime lifecycle mechanics:

~~~text
admit → instantiate → ready → route → isolate → stop → recover
~~~

It does not own the domain lifecycle of Work, agent, account, provider, memory, surface, or Product Instance.

## 4. Core contracts are not Core features

This is the most important anti-confusion rule.

Some concepts must be universally understood at the plugin boundary without their implementations belonging to the kernel.

Examples include:

~~~text
Manifest
Recipe
Port
Lifecycle
Outcome / refusal envelope
Capability reference
Plugin reference
Revision/reference primitives
Evidence reference
Intent reference
Work reference
Object reference
~~~

These are K1 protocol contracts, not automatically K0 implementations.

Examples:

| Shared contract | Implementation | Boundary |
|---|---|---|
| Work contract | vivim.run | Plugin |
| Object/revision references | domain object implementations | Contract + Plugin |
| Intent contract | NCLL / language realization | Contract + Plugin |
| Evidence envelope | evidence store | Contract + Plugin |
| Capability invocation contract | individual capability implementation | Core enforcement + Plugin behavior |

## 5. Major destination classification

| Destination concept | K0 Core | K1 Contract | Plugin | Classification |
|---|---:|---:|---:|---|
| Plugin admission | YES | YES | — | Non-bypassable kernel responsibility |
| Manifest / Recipe | — | YES | contributions | Shared boundary protocol |
| Isolation / Port transport | YES | YES | — | Non-bypassable substrate |
| Capability token enforcement | YES | YES | definitions | Core enforcement, plugin meaning |
| Law enforcement boundary | YES, mechanism | YES | law plugin / policy content | Enforcement in Core, policy in plugin |
| Consent semantics | — | YES | YES | Authority/product behavior |
| Vault durability implementation | — | YES | YES | Storage belongs to vault plugin |
| Canonical Object / Revision | — | YES | YES | Generic refs + plugin semantics |
| Relationship model | — | YES | YES | Generic edges + domain predicates |
| World | — | YES | YES | Product/world projection |
| Intent | — | YES | YES | Canonical semantic contract + plugin interpreter |
| NCLL / symbolic language | — | YES | YES | Upgradeable language capability |
| Spatial Intent Circuit | — | YES where shared | YES | Product semantic surface |
| Context assembly | — | YES | YES | Product/context strategy |
| Durable Work | — | YES | YES | vivim.run owns domain semantics |
| Agent | — | YES | YES | Actor/delegation domain |
| Account | — | YES | YES | External identity domain |
| Session | — | YES | YES | Resource relationship domain |
| Provider | — | YES | YES | External-system knowledge |
| Browser / Chrome | — | YES | YES | Provider realization |
| Routing | — | YES | YES | Candidate selection / policy |
| Discovery | — | YES | YES | External reality intelligence |
| Provider healing | — | YES | YES | Governed external repair |
| Parser | — | YES | YES | Replaceable realization knowledge |
| Chat | — | YES | YES | Product domain |
| Memory | — | YES | YES | Epistemic/product domain |
| Attention | — | YES | YES | Product behavior |
| Background automation | — | YES | YES | Work/scheduling domain |
| Personal Agent | — | YES | YES | Principal-facing intelligence |
| Self-Knowledge | — | YES | YES | Derived projection |
| Forge | — | YES | YES | Extension mechanism itself |
| Evolution analysis | — | YES | YES | Analysis is replaceable |
| Migration engine | — | YES | YES | Core supplies safe primitives |
| Compatibility engine | — | YES | YES | Core requires result; plugin computes it |
| Impact engine | — | YES | YES | Core requires disposition; plugin derives it |
| Evidence store | — | YES | YES | Store implementation stays outside Core |
| Surface / Canvas | — | YES | YES | Projection and UX |
| Product Instance | — | YES | YES | Product lifecycle domain |
| OS product integration | minimal seam | YES | YES | Core seam, plugin capabilities |
| Resource enforcement | minimal substrate | YES | YES | Core bounds; plugin owns policy/economics |
| Development tooling | — | — | — | Out-of-tree tooling |

## 6. First-party system plugins are still plugins

The following can be essential, bundled, first-party, and even boot-required without being Core:

~~~text
vivim-law
vivim-vault
vivim-run
vivim-mind
vivim-nlcl / vivim-nlcl-pure
vivim-director
vivim-agent
vivim-providers
vivim-credentials
vivim-chat
discovery-*
provider-browser
Forge / authoring
surfaces
context / attention / memory
Product Instance
~~~

The phrase to preserve is:

> **system plugin ≠ optional plugin**

A system plugin may be mandatory in the default composition and still be replaceable through the same governed plugin boundary.

## 7. The three most important split patterns

### Policy versus enforcement

Wrong:

~~~text
µhost contains VIVIM's permission rules
~~~

Correct:

~~~text
µhost → enforces the capability/authority boundary
law plugin → owns policy content and decisions
~~~

### Data versus persistence mechanism

Wrong:

~~~text
Core owns all VIVIM data schemas
~~~

Correct:

~~~text
Core → persistence / reference boundary
vault plugin → storage implementation
plugins → domain schemas and data
~~~

### Evolution analysis versus evolution gate

Wrong:

~~~text
Core contains one giant EvolutionEngine
~~~

Correct:

~~~text
Core → enforces the constitutional activation boundary
plugins → observe / compare / impact / compatibility / migrate / repair / propose
Forge/providers → create candidates
law + Core → enforce final authority boundary
~~~

## 8. Everything-is-a-Plugin as the development criterion

Every substantive new implementation request should begin with:

~~~text
WHAT IS THIS?
   ↓
mechanism / contract / domain behavior / policy / projection / realization / tooling
~~~

Then:

~~~text
Does a plugin need this to exist before it can safely run?
        │
      YES → candidate K0
        │
       NO
        ↓
Can it be expressed as a shared contract without runtime ownership?
        │
      YES → K1
        │
       NO
        ↓
Can it vary, evolve, or be domain-specific?
        │
      YES → Plugin
        │
       NO
        ↓
prove the exceptional case before adding to Core
~~~

## 9. Required boundary record before implementation

Every substantive new component should record:

~~~text
BoundaryClass:
  K0_CORE
  K1_CONTRACT
  SYSTEM_PLUGIN
  EXTENSION_PLUGIN
  TOOLING

SemanticOwner:
  ...

WhyNotCore:
  ...

Dependencies:
  ...

AuthorityBoundary:
  ...

ReplacementSeam:
  ...

EvolutionClass:
  ...

Falsifier:
  ...
~~~

## 10. The Why-Not-Core rule

The burden of proof is asymmetric.

For a plugin:

> “It works behind the existing boundary.”

For Core:

> “The system cannot remain safely generic without this mechanism being inside the non-bypassable kernel.”

Therefore:

> **The default answer to “Could this be Core?” is no, unless the non-bypassable kernel responsibility is demonstrated.**

## 11. Core size is semantic, not just LOC

B5's 1,500 LOC freeze is a mechanical guard. The deeper guard is responsibility.

A healthy Core has responsibilities that look like:

~~~text
verify
admit
isolate
route
enforce
fence
recover
~~~

A Core showing responsibilities like:

~~~text
chat
memory
providers
projects
canvas
browser
LLM
routing policy
Forge logic
notifications
workflows
~~~

is architectural regression even if the implementation remains small.

## 12. Boundary criterion for the development program

Before code is written:

1. Name the responsibility.
2. Identify its semantic owner.
3. Classify K0 / K1 / System Plugin / Extension Plugin / Tooling.
4. Explain why it cannot live one level farther out.
5. Identify the replacement seam.
6. Identify dependencies and impact.
7. Name the falsifier.

Only after this boundary is accepted should implementation begin.

## 13. Initial boundary verdict

~~~text
                    ┌──────────────────────────────┐
                    │          K0 Ω CORE           │
                    │                              │
                    │  boot / integrity            │
                    │  isolation / transport       │
                    │  capability enforcement      │
                    │  activation / recovery       │
                    │  platform seam               │
                    │  crypto / identity primitives│
                    └──────────────┬───────────────┘
                                   │
                          K1 contracts/protocols
                                   │
          ┌────────────────────────┼────────────────────────┐
          │                        │                        │
          ▼                        ▼                        ▼
   SYSTEM PLUGINS            SYSTEM PLUGINS          EXTENSION PLUGINS
   law / vault / run         mind / nlcl / chat     user / third-party
   providers / forge         world / work / PA      capabilities
   discovery / surfaces      memory / attention      domain plugins
          │                        │                        │
          └────────────────────────┼────────────────────────┘
                                   ▼
                              canonical World
                              + Work + Evidence
                                   │
                                   ▼
                             user experience
~~~

## 14. Working conclusion

> **Ω should be a microkernel for governed capability composition, not a reduced copy of VIVIM.**

VIVIM is the collection of plugins, contracts, canonical data, compositions, and surfaces running under that kernel.

This is the most direct synthesis supported by the current archaeology and the Everything-is-a-Plugin + Evolution design.

## 15. Evidence anchors

| Source | Relevance |
|---|---|
| omega-baseline/omega-final/docs/decisions/CURRENT-INVARIANTS.md | Ratified B1–B5, everything-else-is-plugin boundary, law/plugin and host/transport split |
| omega-baseline/omega-final/docs/migration/00-ASSESSMENT/02-LAYERED-CAKE.md | Explicit layered partition: µhost → contracts → shim/platform → plugins |
| omega-baseline/omega-final/docs/migration/STRATEGY-OMEGA-PLUGIN-REBUILD.md | Plugin-pure migration rule and anti-shapes |
| vivim-original-baseline/vivim-final-enhanced/docs/kernel-plugins/inventory/BOUNDARY-CONSTITUTION.md | Legacy mechanism-versus-content boundary and false-core analysis |
| vivim-original-baseline/vivim-final-enhanced/docs/kernel-plugins/inventory/ATOMIC-INVENTORY.md | Concrete legacy CORE/GENERIC/PLUGIN classifications |
| docs/destination/EVERYTHING-IS-A-PLUGIN-EVOLUTION-CONSTITUTION.md | Plugin boundaries as extensibility/replacement seams under evolution governance |
| docs/destination/EVOLUTION-RECONCILIATION.md | Change classes, evolution loop, continuity and constitutional boundary |
| docs/destination/DEPENDENCY-GRAPHS-AND-KEYSTONE-SCORECARD.md | Cross-cutting dependency model |
| docs/agent-system/PROGRAM-COMPLETENESS-AND-CONTROLS.md | Program-level change-impact and evolution controls |