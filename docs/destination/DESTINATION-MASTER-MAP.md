# VIVIM Destination — Master Mapping

> Classification: DERIVED — WORKING PROGRAM MODEL
> Status: current synthesis from repository evidence as of 2026-09-25.

## 1. Destination model

VIVIM is a user-owned computing environment in which:

~~~text
MY WORLD
   ↓
what is relevant now
   ↓
what I want
   ↓
what can do it
   ↓
what I allow
   ↓
what work is performed
   ↓
what actually happened
   ↓
what becomes part of my continuing world
~~~

The persistent concepts are World, Thing, Space, Relationship, Context, Attention, Address, Intent, Capability, Account, Agent, Work, Authority, Evidence, Memory, Time, Configuration, Composition, Plugin, Realization, and Forge.

## 2. Destination-to-repository mapping

| Destination concept | Ω / current material | Strongest VIVIM mine evidence | Current truth | Destination requirement |
|---|---|---|---|---|
| World | WorldModel, vivim.mind, vault | projects, knowledge, memory, provider/account stores | Strong but bounded | One coherent world projection over permitted domains |
| Thing | EntityView, live objects, ontology | project/conversation/provider/canvas primitives | Good vocabulary | Stable identity with many representations |
| Space | canvas/object placement | workspace, canvas layers, presets | Strong mine evidence | Spatial context without becoming canonical storage |
| Surface | surface contracts + projections | canvas layers, built-in panels | Strong rule, richer mine | One thing may have many useful views |
| Context | D-443 deterministic context substrate | context assembly/binder | Strong substrate | Product-level current-work context on top |
| Attention | partial concept | notifications/proactive routers | Underdeveloped | Standing interests and watch behavior become first-class |
| Address | NLCL grounding/ref grammar | intent routers/command refs | Strong basis | Address any meaningful target |
| Intent | intent IR/resolution/visual spec | NLCL classifiers/resolvers | Strong offline proof | One universal intent path |
| Capability | routed op + capability registry | live/unified capability registry | Strong | User-readable capability universe |
| Plugin | manifests/compositions/runtime | plugin manager/builder | Strong substrate | Universal extension boundary |
| Realization | ProviderRealization + discovery | provider plugins/onboarding/health | Strong model, live gap | Swappable, attributable implementation |
| Provider | provider registry | provider definitions/plugins/mux | Strong raw evidence | External system remains external |
| Account | credentials + partial realization context | ProviderAccount, profiles, fleet | Major gap | First-class relationship between person and provider |
| Model | provider realization/probabilistic kind | model catalogs + AI registry | Mine evidence exists | User can choose/constrain model |
| Routing | simple Ω realization selection | ProviderMux preferences/priority/cost/learned | Major product gap | User-owned provider/account/model policy |
| Work | intent plans + agent execution | automation/workflow/scheduler | Fragmented | Durable inspectable work lifecycle |
| Agent | identity/scope/delegation | legacy agent loop | Governance strong, breadth limited | Governed worker using capabilities |
| Authority | law/consent/delegation | capability permissions | Very strong | Safe ordinary-user controls |
| Evidence | vault refs/provenance/ledger | evidence/observability | Strong | Visible when trust matters |
| Memory | vault + epistemic kinds | memory engines | Strong raw material | Emerges from world/work/history |
| Time | revisions/history/replay concepts | event/history/sync | Strong substrate | Understand/recover changes |
| Configuration | composition config | legacy config/UI resolution | Strong mechanics, fragmented UX | Configuration is ordinary interaction |
| Composition | JSON compositions | capability composer/workflows | Strong | Compose capabilities into behavior |
| Forge | forge.author/proposal/promotion | plugin builder | Strong architecture | Build from inside VIVIM |
| Exit | vault roundtrip/local-first | memory export/storage contracts | Partial | Full recovery/reconstruction journey |

## 3. The critical provider/account/realization distinction

These must never collapse into one object.

### Provider

The external service, website, application, or system.

### Account

The person's authenticated relationship with that provider.

An account may have its own identity, plan, login state, browser profile, session, permissions, and available models/capabilities.

### Realization

The implementation of a semantic capability.

~~~text
CAPABILITY
   ↓
candidate realizations
   ↓
ACCOUNT + MODEL + SESSION
   ↓
USER ROUTING POLICY
   ↓
AUTHORIZED WORK
~~~

This is the missing bridge behind “my accounts / my intelligence / my rules.”

## 4. User-facing control hierarchy

The person should mainly experience five levels:

1. What is in my world? Projects, people, conversations, documents, accounts, services, tasks, ideas, memories, agents.
2. What am I doing now? Current space, focus, context, attention.
3. What can be done? Capabilities described as useful actions.
4. Who or what will do it? A local tool, provider, realization, account, model, or agent when choice matters.
5. What happened? Outcome, evidence, provenance, change, pending approval, next action.

The system performs the machinery between those levels.

## 5. Universal interaction contract

The same semantic model should power the universal prompt and direct manipulation.

A request such as:

> “Send an update on Project X to John using my usual AI, then email it.”

should conceptually resolve into:

~~~text
Address       → Project X + John + VIVIM
Intent        → produce-and-send-update
Context       → current Project X state
Capabilities  → read project context + synthesize + message.send
Choice        → user's routing policy
Authority     → user's standing rules / approval boundary
Work          → durable task
Evidence      → source rows + generated result + send receipt
Memory        → project communication updated
~~~

The exact syntax is not the product. The invariant is that one semantic interaction layer can reach the whole environment.

## 6. Product assembly

The final product is not one giant composition. It is a user-owned installation composed from:

~~~text
FOUNDATION
  law / vault / runtime / ontology / evidence / time

INTELLIGENCE
  mind / intent / context / provider-realization

WORLD
  things / spaces / relationships / conversations / projects /
  files / accounts / memory

AGENCY
  capabilities / agents / work / automation / attention

SURFACES
  canvas / prompt / object views / application-like views

EVOLUTION
  compositions / Forge / discovery / repair / healing
~~~

## 7. Harvest rule

The VIVIM mine is evidence, not destination authority.

Harvest provider accounts and per-account Chrome profiles, ProviderMux routing strategies, capability UI resolution and configuration, adaptive workspaces and presets, canvas primitives/layers/designer, project/conversation organization, provider onboarding/discovery, plugin builder, and browser automation/healing techniques.

Re-express harvested behavior through Ω evidence, capability, authority, and representation rules. Do not import legacy architecture merely because the behavior is useful.

## 8. Canonical product journeys

**J1 — Open and orient:** open → see world → see changes → see current work → continue.

**J2 — Continue work:** open a project → relevant conversations/files/people/context appear → continue without reconstructing state.

**J3 — Universal interaction:** address anything → state intent → understand → show material effect → act.

**J4 — Delegated action:** describe outcome → durable work → agent/tool/provider acts → progress/result/evidence.

**J5 — Provider choice:** request intelligence/action → available realizations → user policy → correct account/session.

**J6 — Background continuity:** leave → authorized work continues → return to truthful summary and pending decisions.

**J7 — Evolution:** request new ability → capability gap → forge/configure → test → promote → use.

**J8 — Exit:** export → restore → reconnect providers/accounts → reconstruct working world.

## 9. Destination completion test

Destination maturity is not “all subsystems exist.”

It is the eight journeys working through one environment while preserving sovereignty, explicit authority, evidence, replaceability, composability, continuity, and ordinary-user configurability.
