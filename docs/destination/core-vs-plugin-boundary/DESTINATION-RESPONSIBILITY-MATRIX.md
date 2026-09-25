# VIVIM Destination — Expanded Responsibility & Boundary Matrix

> **Pass-3 correction:** the previous matrix was too coarse. It bundled multiple independently-owned semantic responsibilities into ~20 rows and therefore understated the destination responsibility universe.
>
> This matrix is now the canonical **responsibility inventory used for Core adequacy analysis**. It distinguishes:
>
> - **K0** — irreducible, non-bypassable, domain-neutral runtime mechanism
> - **K1** — shared boundary vocabulary/protocol
> - **SP** — first-party/system plugin
> - **EP** — user/third-party extension plugin
> - **T** — tooling / outside runtime
> - **CC** — cross-cutting semantic/control concern implemented through K1 + plugins unless a specific K0 primitive is proven
>
> **Important:** being fundamental to VIVIM does not imply being K0.

## 1. Boundary test

A responsibility belongs in K0 only when all of the following remain true after attempted extraction:

1. plugin-independent necessity;
2. non-bypassable enforcement requirement;
3. domain neutrality;
4. cross-plugin universality;
5. stable constitutional responsibility;
6. minimal mechanism;
7. a concrete unsafe bypass if moved outward.

Default classification is therefore **not K0**.

## 2. Complete responsibility universe

| ID | Responsibility | What it owns | Boundary class | Semantic owner | Canonical/data owner | Authority / enforcement | Replacement seam | Current status |
|---|---|---|---|---|---|---|---|---|
| R-001 | Composition identity | exact installed composition identity | K0+K1 | core protocol | composition record/receipt | K0 admission | signed Recipe | RATIFIED |
| R-002 | Composition admission | whether a composition may enter runtime | K0+K1 | core protocol | admission receipt | K0 | constitutional | PROVEN K0 |
| R-003 | Manifest integrity | admitted plugin declaration integrity | K0+K1 | core protocol | manifest | K0 | manifest contract | PROVEN K0 |
| R-004 | Executable/content integrity | exact executable bytes bound to admission | K0+K1 | core protocol | content digest | K0 | content contract | B1 BLOCKED |
| R-005 | Signature / trust-root verification | proof that signer is trusted | K0 | core protocol | trust receipt | K0 | trust protocol | PROVEN K0 |
| R-006 | Plugin identity | stable plugin identity and substitution prevention | K0+K1 | core protocol | plugin ref | K0 admission | PluginRef | UNDERPROVEN |
| R-007 | Generic bootstrap role | bootstrap without hardcoded product plugin identity | K0+K1 | core protocol | Recipe role | K0 admission | signed bootstrap-role declaration | DESIGN/EXPERIMENT |
| R-008 | Isolation / compartment | plugin execution containment | K0+K1 | core protocol | runtime | K0 | worker/compartment seam | PROVEN for runtime coupling |
| R-009 | Port transport | mandatory inter-compartment communication path | K0+K1 | core protocol | runtime | K0 | Port contract | PROVEN K0 |
| R-010 | Capability definition | semantic powers exposed by plugins | K1+SP/EP | capability plugin | plugin-owned | K0 egress | capability contract | DERIVED |
| R-011 | Capability reference | stable reference to a capability | K1 | core protocol | capability ref | K0 egress | capability contract | PROVEN K1 |
| R-012 | Capability token | invocation grant carrier | K1 + K0 enforcement | core protocol | token/grant | K0 | capability token | PROVEN K0 enforcement |
| R-013 | Ownership / principal identity | who owns, requests, acts, or delegates | K1+SP | identity/authority | identity records | law + K0 enforcement | principal contract | DESIGN-REQUIRED |
| R-014 | Scope enforcement | limits of an invocation grant | K0 | core protocol | token/grant | K0 | capability contract | PROVEN K0 |
| R-015 | Revocation | invalidation of prior grants | K0 | core protocol | grant generation | K0 | revocation primitive | PROVEN K0 |
| R-016 | Generation fencing | prevent stale implementations/calls from crossing authority generations | K0 candidate | core protocol | runtime grant state | K0 | generation fence | UNDERPROVEN |
| R-017 | Invocation lifetime pinning | keep an invocation bound to its authorized realization/version | K0 candidate | runtime | runtime | K0 | call-lifetime pin | EXPERIMENT-REQUIRED |
| R-018 | Runtime lifecycle containment | admit/start/ready/stop/recover/retire state machine enforcement | K0 | core protocol | runtime state | K0 | lifecycle contract | PROVEN K0 |
| R-019 | Atomic activation | prevent partial/torn composition activation | K0 | core protocol | composition pin | K0 | atomic activation | PROVEN K0 |
| R-020 | Crash recovery boundary | return to known-good admitted state | K0 | core protocol | recovery receipts | K0 | pinned fallback | PROVEN K0 |
| R-021 | Safe state arbitration | generic concurrent mutation/fencing primitive | K0 candidate | runtime | runtime state | K0 | keyed arbitration | UNDERPROVEN |
| R-022 | Minimal routing lookup | resolve one safe invocation target | K0 candidate | runtime | routing map | K0 | minimal op→implementation map | EXPERIMENT-REQUIRED |
| R-023 | Grant provenance | prove admitted grants/edges were legitimately established | K0 candidate | core protocol | grant receipts | K0 | signed grant proof | UNDERPROVEN |
| R-024 | Minimal platform seam | owner-scoped filesystem/process/platform access needed by runtime | K0 seam | core/platform | platform refs | K0 | platform contract | UNDERPROVEN |
| R-025 | Cryptographic primitives | hashing, signatures, canonical encoding | K0 | core protocol | receipts/content refs | K0 | crypto primitive layer | PROVEN |
| R-026 | Storage substrate protocol | generic driver boundary for durable local storage | K1 | storage contract | vault implementation | law/owner | storage driver contract | PROVEN K1 |
| R-027 | Canonical vault/storage | durable local canonical storage | K1+SP | vault | vault | authority/law | vault protocol | PARTIAL |
| R-028 | Canonical object identity | stable local identity for world objects | K1+SP | ontology/domain plugins | object records | authority | object contract | PARTIAL |
| R-029 | Object lifecycle | create, modify, version, archive, restore, delete | K1+SP | domain plugins | canonical object | authority | object lifecycle contract | DESIGN-REQUIRED |
| R-030 | Revision / history | exact object revision identity and history | K1+SP | vault/world | revision log | evidence/authority | revision ref | PARTIAL |
| R-031 | Relationship model | typed relations among canonical objects | K1+SP | ontology/domain plugins | relationship records | authority | relationship contract | DESIGN-REQUIRED |
| R-032 | Identity reconciliation | determine correspondence / merge / split without fabricating equivalence | K1+SP | reconciliation | identity assertions | authority/evidence | reconciliation contract | DESIGN-REQUIRED |
| R-033 | Relationship reconciliation | reconcile changing/competing relationships over time | K1+SP | reconciliation | relationship history | evidence | reconciliation contract | DESIGN-REQUIRED |
| R-034 | Provenance / source genealogy | where canonical information originated | K1+SP | evidence/provenance | provenance refs | authority/evidence | provenance contract | PARTIAL |
| R-035 | Evidence model | claims/events/effects supported by evidence | K1+SP | evidence | evidence records | authority | evidence contract | PARTIAL |
| R-036 | Audit / system history | durable record of runtime/governance transitions | K1+SP | audit/evidence | audit records | authority | audit contract | PARTIAL |
| R-037 | Verification | independent confirmation of state/effect/claim | K1+SP | evidence/verification | verification records | authority | verification contract | DESIGN-REQUIRED |
| R-038 | Epistemic state | known/unknown/candidate/observed/verified/stale/conflicted | K1+SP | epistemic/evidence | state records | authority | epistemic contract | DESIGN-REQUIRED |
| R-039 | Schema / data-shape evolution | evolve object shapes without silent loss | K1+SP | data evolution | schema/version records | evolution authority | migration contract | DESIGN-REQUIRED |
| R-040 | Semantic evolution | preserve meaning across semantic changes | K1+SP | evolution | change records | constitutional/law | change contract | DESIGN-REQUIRED |
| R-041 | Identity evolution | migrate identities with explicit correspondence | K1+SP | reconciliation/evolution | identity history | authority | migration contract | DESIGN-REQUIRED |
| R-042 | Relationship evolution | migrate relationship meaning/history | K1+SP | reconciliation/evolution | relation history | authority | migration contract | DESIGN-REQUIRED |
| R-043 | Query / retrieval | search, filter, lookup, traversal, retrieval | K1+SP | world/query | indexes/projections | authority | query contract | DESIGN-REQUIRED |
| R-044 | Derivation / projection | derive representations from canonical state | K1+SP | world/mind/surface | derived state | source/evidence | projection contract | PARTIAL |
| R-045 | Import / acquisition | bring external user-owned information into canonical world | K1+SP | acquisition | canonical objects + provenance | authority | acquisition contract | PARTIAL |
| R-046 | Export / exit | reconstruct/export user-owned data and evidence | K1+SP | vault/product | exported package | owner | export contract | DESIGN-REQUIRED |
| R-047 | Restore / reconstruction | recover environment from durable state | K1+SP + K0 substrate | product/vault | vault/composition | authority | restore contract | PARTIAL |
| R-048 | Ontology | semantic types and relationships that describe the user's world | K1+SP | ontology | ontology records | authority/evolution | ontology contract | PARTIAL |
| R-049 | World projection | deterministic world view from canonical records | K1+SP | world | projection | law/authority | world contract | PARTIAL |
| R-050 | Context assembly | select relevant canonical/derived information for an intent/work | K1+SP | context/mind | context refs | authority | context contract | DESIGN-REQUIRED |
| R-051 | Memory | durable contextual/learned information distinct from source truth | K1+SP | mind/memory | memory records | authority | memory contract | DESIGN-REQUIRED |
| R-052 | Self-Knowledge | model of VIVIM itself: capabilities, plugins, config, health, deps, history | K1+SP | vivim.mind | derived projection | evidence/authority | self-knowledge contract | PARTIAL |
| R-053 | Self-Knowledge freshness | detect stale/conflicted/unresolvable self-model bases | K1+SP | vivim.mind | freshness metadata | evidence | derivation contract | PARTIAL |
| R-054 | Self-diagnostics / explanation | explain state, causes, evidence, uncertainty, next actions | K1+SP | mind/diagnostics | derived view | evidence/authority | diagnostic contract | DESIGN-REQUIRED |
| R-055 | Language lexing / grammar | deterministic language primitives and parsing | K1+SP | vivim.nlcl | language package | authority | language plugin | PROVEN SYSTEM PLUGIN |
| R-056 | Symbolic command system | stable primitive command families and symbolic IR | K1+SP | vivim.nlcl | grammar/data | law | language contract | RATIFIED |
| R-057 | Language frames | operation-specific grammar frames and slot semantics | SP | vivim.nlcl | language plugin/data | authority | language plugin | RATIFIED |
| R-058 | Language grounding | map utterances to canonical objects/participants | K1+SP | nlcl + world | world refs | authority | grounding contract | DESIGN-REQUIRED |
| R-059 | Intent formation | typed representation of user goal/request | K1+SP | vivim.intent | intent records | law | Intent contract | PARTIAL |
| R-060 | Plan formation | versioned proposed execution strategy | K1+SP | vivim.intent/run | plan records | authority | plan contract | PARTIAL |
| R-061 | Spatial Intent Circuit | visible, editable semantic plan/control surface | K1+SP | interaction plugin | intent/work refs | law | interaction contract | DESIGN-REQUIRED |
| R-062 | Deterministic feedback / interpretation preview | show machine reading before execution | SP | nlcl/surface | derived interpretation | authority | interpretation contract | PARTIAL |
| R-063 | Teaching / reprogrammability | user-defined language/rules represented as data | SP | vivim.director | vault objects | law/consent | director contract | PROVEN SYSTEM PLUGIN |
| R-064 | Authority model | represent who may authorize an action/change | K1+SP | law/authority | authority records | K0 enforcement | authority contract | PARTIAL |
| R-065 | Law / policy semantics | user/system rules for permitted action | SP | vivim.law | law/vault | K0 enforcement | policy contract | PARTIAL |
| R-066 | Consent | explicit owner permission for consequential action | SP | law/authority | consent records | K0 enforcement | consent contract | PARTIAL |
| R-067 | Delegation | bounded authority granted to an agent/actor | SP | law/agent | delegation records | K0 enforcement | delegation contract | DESIGN-REQUIRED |
| R-068 | Risk classification | generic effect risk metadata | K1 + K0 enforcement | capability/law | capability declarations | K0 generic gate | risk contract | PARTIAL |
| R-069 | Durable Work | canonical subject of durable execution | K1+SP | vivim.run | work records | authority | Work contract | PARTIAL |
| R-070 | Plan / step / attempt semantics | durable execution decomposition and attribution | K1+SP | run | work records | authority | Work contract | PARTIAL |
| R-071 | Work recovery / reconciliation | recover after crash/unknown external effect | K1+SP | run/evidence | work history | authority | recovery contract | PARTIAL |
| R-072 | Agent | actor that performs Work under authority | K1+SP | vivim.agent | agent records | law | agent contract | PARTIAL |
| R-073 | Execution realization | concrete implementation that performs a capability | SP/EP | implementing plugin | implementation state | K0 admission + law | realization contract | PARTIAL |
| R-074 | Scheduler / triggers / durable waits | standing intent, wake conditions, timers, reports | K1+SP | run/background | trigger/work records | authority | trigger contract | DESIGN-REQUIRED |
| R-075 | Resource governance | CPU/GPU/network/storage/session/model budgets and reservations | K1+SP + K0 safety | resource/run | resource state | K0 safety fence + policy plugin | resource contract | DESIGN-REQUIRED |
| R-076 | Provider identity | external provider/service identity | K1+SP | provider plugins | provider records | authority | provider contract | UNDERPROVEN |
| R-077 | Account identity | user's authenticated relationship with a provider | K1+SP | provider/accounts | account records | authority | account contract | UNDERPROVEN |
| R-078 | Session identity | active provider interaction relationship/profile | K1+SP | provider/session | session records | authority | session contract | UNDERPROVEN |
| R-079 | External resource identity | Chrome profile/process/page/native app/device/endpoint/model runtime | K1+SP | resource/provider | resource records | authority | resource contract | UNDERPROVEN |
| R-080 | External resource lifecycle | discovered/available/active/suspended/expired/unavailable/hydrated | K1+SP | resource layer | resource state | authority | lifecycle contract | DESIGN-REQUIRED |
| R-081 | Provider realization | concrete provider-specific implementation of a capability | SP/EP | provider plugin | provider/plugin state | K0 admission + law | realization contract | IMPLEMENTATION-REQUIRED |
| R-082 | Routing / selection | choose valid capability realization/account/model | SP/EP | routing/provider | routing state | user policy | routing contract | PROPOSED |
| R-083 | Fallback / preference / constraints | priorities, forbidden combinations, cost/performance rules | SP | routing/law | routing policy | law | policy contract | DESIGN-REQUIRED |
| R-084 | Provider knowledge | versioned knowledge of external provider behavior/protocol | SP | provider intelligence | knowledge records | evolution | provider-knowledge contract | DESIGN-REQUIRED |
| R-085 | Discovery | discover provider/resource/capability candidates | SP | discovery | discovery evidence | authority | discovery contract | PARTIAL |
| R-086 | Healing / repair | detect drift and propose/verify realization repair | SP | provider intelligence/evolution | change records | evolution/law | repair contract | PARTIAL |
| R-087 | Browser realization | browser-mediated external interaction | SP/EP | provider.browser | session/resource | authority | browser realization contract | IMPLEMENTATION-REQUIRED |
| R-088 | Credentials / secret references | acquire/use/rotate/revoke secrets without normal data leakage | K1+SP | credentials/security | credential refs | authority + platform | credential contract | PARTIAL |
| R-089 | Local secret integration | bridge to owner-controlled OS secret facilities | K0 seam + SP | platform/security | secret refs | owner | platform contract | UNDER-MODELLED |
| R-090 | Attention | decide what deserves user attention | SP | attention | attention state | authority | attention contract | DESIGN-REQUIRED |
| R-091 | Notification / delivery | deliver attention via surface/OS channels | SP/EP | attention/product | notification state | authority | notification contract | UNCHARACTERIZED |
| R-092 | Background continuity | continue authorized Work/standing intent after interaction ends | K1+SP | run/background | work/trigger records | authority | continuity contract | DESIGN-REQUIRED |
| R-093 | Return / re-entry continuity | summarize changes, work, failure, required-user actions, next state | SP | mind/attention/product | derived continuity view | evidence | continuity contract | DESIGN-REQUIRED |
| R-094 | Workspace / space model | organize world/project/context spatially | SP/EP | world/surface | workspace state | user | workspace contract | PARTIAL |
| R-095 | Surface / view model | representations of canonical objects/context | SP/EP | surface | presentation state | aperture/law | surface contract | PARTIAL |
| R-096 | Canvas / spatial layout | positions, grouping, movement, focus, connections | SP/EP | surface/canvas | layout state | user | canvas contract | PRODUCT FRONTIER |
| R-097 | Direct manipulation | navigate, focus, move, group, open, inspect, resize, reorganize | SP/EP | interaction/surface | interaction/layout | authority where consequential | interaction contract | DESIGN-REQUIRED |
| R-098 | Native product shell | launchable environment users inhabit | SP/EP + platform seam | product | product state | owner/platform | product-shell contract | L-1 |
| R-099 | OS / filesystem / application integration | native machine interaction | K0 seam + SP/EP | platform/product | OS resource refs | owner + law | platform contract | L-1 |
| R-100 | Desktop interaction substrate | keyboard/mouse/clipboard/window/application interaction | SP/EP | desktop plugin | interaction state | law | desktop contract | L-1 |
| R-101 | Install / update / downgrade | product lifecycle and safe executable transitions | K1+SP + K0 activation substrate | product/evolution | product lifecycle | authority | lifecycle contract | L-1 |
| R-102 | Product Instance identity | durable identity boundary around one user-owned environment | K1+SP | product lifecycle | product state | owner/law | product contract | PARTIAL |
| R-103 | Product persistence / continuity | reconnect instance, composition, world, config and history | K1+SP | product/vault | product state | owner | continuity contract | PARTIAL |
| R-104 | Configuration | user-owned configuration, routing rules, surfaces, policies | K1+SP | configuration | config records | law/owner | config contract | DESIGN-REQUIRED |
| R-105 | Backup / recovery / reconstruction | restore working environment without hidden central dependency | K1+SP | product/vault | backup package | owner | recovery contract | DESIGN-REQUIRED |
| R-106 | Multi-device continuity | preserve/reconstruct owned environment across machines | K1+SP | sync/product | replicated state | owner/authority | sync contract | L-1 |
| R-107 | Sharing / collaboration | share selected data/capabilities/work with others | K1+SP/EP | sharing | sharing records | authority | sharing contract | L-1 |
| R-108 | Cross-machine delegation | delegate authority/work across owned or trusted machines | K1+SP | delegation | delegation/work records | authority | delegation contract | L-1 |
| R-109 | Universal digital-world acquisition | bring files, messages, people, projects, services and history into world | K1+SP | acquisition | canonical objects + provenance | authority | acquisition contract | L-1 |
| R-110 | Local/network discovery | discover devices, endpoints and services | SP/EP | discovery | resource records | authority | discovery contract | L-1 |
| R-111 | Generic web/resource substrate | represent arbitrary web resources and changing external resources coherently | SP/EP | web/resource plugins | resource records | authority | resource contract | L-1 |
| R-112 | Local intelligence/model lifecycle | install/select/run/replace local models and reasoning resources | SP/EP | intelligence/model plugin | model/resource records | authority | model contract | L-1 |
| R-113 | Forge | generate/combine/test/promote capability candidates | SP | Forge | proposals/artifacts | K0 admission + law/evolution | evolution contract | PARTIAL |
| R-114 | Plugin distribution / ecosystem | acquire, inspect, trust, update, disable and share plugins | SP/EP | ecosystem | plugin records | K0 admission + law | distribution contract | L-1 |
| R-115 | Evolution | govern changes to data, plugins, configurations and product behavior | K1+SP | evolution | change records | constitutional/law | change contract | DESIGN-REQUIRED |
| R-116 | Compatibility | multidimensional compatibility of replacements | K1+SP | compatibility/evolution | compatibility records | authority | compatibility contract | DESIGN-REQUIRED |
| R-117 | Impact analysis | derive affected dependencies, Work, resources, projections | K1+SP/T | evolution/graph | impact records | authority | impact contract | PARTIAL |
| R-118 | Migration | perform semantic/data/executable transitions with preserved history | K1+SP | evolution | migration records | authority | migration contract | DESIGN-REQUIRED |
| R-119 | Promotion / activation | move candidate → verified → compatible → active | K0 substrate + SP policy | evolution/runtime | lifecycle records | K0 activation + law | lifecycle contract | PARTIAL |
| R-120 | Rollback / quarantine / retirement | safely reverse/deactivate without erasing evidence/history | K1+SP + K0 recovery substrate | evolution | lifecycle/history | authority | lifecycle contract | DESIGN-REQUIRED |
| R-121 | Observability | inspect runtime/product state and evidence | K1+SP/T | diagnostics/mind | projections | authority | observability contract | DESIGN-REQUIRED |
| R-122 | Product diagnostics / repair UX | user-facing explain/repair/restore/quarantine flow | SP | product/diagnostics | recovery/change records | authority | diagnostics contract | L-1 |
| R-123 | Plugin compatibility / replacement | replace implementations while preserving canonical data and authorized Work | K1+SP | evolution/work | Work/plugin refs | authority + K0 activation | replacement contract | EXPERIMENT-REQUIRED |
| R-124 | Interoperability | exchange data/capabilities with external systems | K1+SP/EP | integration | imported/exported objects | authority | interoperability contract | L-1 |
| R-125 | Developer / research tooling | CI, compilers, graph lenses, audit export, diagnostics generators | T | tooling | repo/dev artifacts | outside runtime | tool interface | CURRENT |

## 3. Cross-cutting responsibilities

The following are intentionally shown as **cross-cutting concerns**, not hidden inside whichever subsystem first implemented them:

| Concern | Touches | Default placement |
|---|---|---|
| Ownership / principal | Product Instance, Work, Account, Data, Sharing, Delegation | K1 + system plugins |
| Evidence / provenance | Data, Work, Provider, Evolution, Self-Knowledge | K1 + evidence plugins |
| Authority / consent | Intent, Work, Provider, Resources, Evolution, Sharing | K1 + law; K0 only generic enforcement |
| Freshness | Self-Knowledge, Provider Knowledge, Resources, Projections | plugins |
| Identity | Plugin, Product Instance, Object, Provider, Account, Session, Resource | K1 contracts + semantic plugins |
| Version / compatibility | Plugins, contracts, data, Work, providers | K1 + evolution |
| Temporal state | Work, Session, Resource, Attention, Evolution | K1 + semantic plugins; K0 fencing where required |
| Configuration | Routing, authority, language, surfaces, product | system plugins |
| Recovery | Runtime, Product Instance, Work, Data, Provider, Evolution | K0 substrate + plugins |
| Security / secrets | credentials, platform, capabilities, provider resources | K0 seam + security plugins |
| Resource economics | CPU/GPU/network/storage/browser/model capacity | policy/plugin; K0 safety limits only |
| Observability | runtime, world, work, provider, evolution | projections/plugins |
| Uncertainty | evidence, grounding, provider state, Work, evolution | semantic/evidence plugins |

## 4. What this changes about Core analysis

The expanded inventory reveals three different classes of “fundamental” responsibility.

### Fundamental to the product, but not Core

Examples:

- Self-Knowledge
- NCLL / command language
- dynamic data model
- Ontology
- World
- Intent
- Spatial Intent Circuit
- Work
- Provider/Account/Session
- Routing
- Memory
- Attention
- Forge
- Evolution
- Product Instance

These can remain replaceable semantic systems if the K0/K1 boundary gives them the generic guarantees they require.

### Fundamental to the architecture and potentially K0

Examples:

- exact admission
- executable/content integrity
- isolation/transport
- capability egress
- revocation/fencing
- atomic activation
- recovery boundary
- lifecycle containment
- minimal platform/crypto seam

The unresolved K0 candidates are narrowly:

- State arbitration
- minimal routing lookup
- grant provenance
- generation pin/lifetime fencing
- generic bootstrap role
- executable-entry confinement
- stronger OS containment if the threat model requires adversarial native code

### Product-frontier responsibilities

The destination also contains large areas that are neither Core gaps nor simple missing plugins yet:

- native shell
- OS/desktop integration
- install/update lifecycle
- multi-device continuity
- sharing/cross-machine delegation
- universal acquisition
- generic web/resource substrate
- local intelligence/model lifecycle
- product diagnostics/repair
- extension distribution

These require characterization before implementation.

## 5. Required distinction for future architecture work

Every future responsibility decision should record:

1. **What capability does VIVIM need?**
2. **What invariant must hold for that capability to be safe/correct?**
3. **Which layer owns the semantic meaning?**
4. **Which layer enforces the invariant?**
5. **What canonical data does it own?**
6. **What evidence does it produce/consume?**
7. **What dependencies does it have?**
8. **What survives replacement?**
9. **What is the replacement seam?**
10. **What concrete bypass would appear if moved into a plugin—or why no such bypass exists?**

## 6. Relationship to the Core-vs-Plugin verdict

This matrix does **not** enlarge K0 merely because the responsibility inventory is larger.

Instead, it makes the adequacy test stronger:

**Full destination responsibility universe**
→ required invariants
→ minimum generic enforcement
→ K0/K1 mechanism
→ plugin semantics
→ current Ω implementation
→ evidence
→ gap classification.

That is the basis for deciding whether K0 needs adjustment rather than assuming it.

## 7. Immediate corrections exposed by the expanded inventory

The previous coarse matrix understated at least these first-class areas:

- Ownership / Principal identity
- Composition and plugin lifecycle
- Capability registry/discovery
- Dynamic data/schema/semantic evolution
- Identity reconciliation
- Relationship reconciliation
- Query/retrieval
- Verification and epistemic state
- Self-Knowledge and freshness
- NCLL, symbolic language, grounding and teaching
- Intent, plan and Spatial Intent Circuit
- Consent and delegation
- Work scheduling/waits/reconciliation
- Resource governance
- Provider / Account / Session / Resource as separate identities
- Credentials/secrets
- Attention / notification / return continuity
- Workspace / surface / canvas / direct manipulation
- Product shell / OS / desktop
- Configuration
- Acquisition / export / restore
- Multi-device continuity
- Sharing / cross-machine delegation
- Local intelligence/model lifecycle
- Evolution / compatibility / impact / migration / rollback
- Diagnostics / repair UX
- Plugin distribution / interoperability

The previous matrix should no longer be used as the completeness baseline.
