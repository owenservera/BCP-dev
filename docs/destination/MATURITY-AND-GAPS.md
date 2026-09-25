# VIVIM Destination — Maturity and Gap Model

> Classification: DERIVED — WORKING PROGRAM MODEL
> Purpose: distinguish conceptual strength, implementation maturity, proof maturity, and product maturity.

## 1. Maturity scale

**M0 — Idea:** destination behavior exists only as a goal.

**M1 — Characterized:** repository evidence exists and the concept is mapped.

**M2 — Mechanized:** working implementation exists somewhere in the program.

**M3 — Verified:** implementation has reproducible automated/deterministic proof.

**M4 — Live:** real runtime/external environment is exercised and proven.

**M5 — Integrated:** behavior composes with neighboring destination primitives in a cross-domain scenario.

**M6 — Productized:** a normal user can use it without architecture knowledge; lifecycle, state, errors, and recovery are coherent.

**M7 — Sovereign / Evolving:** user can configure, replace, extend, repair, and recover it while the environment remains coherent and governed.

## 2. Current maturity by destination capability

| Capability | Current maturity | Evidence | Main gap |
|---|---:|---|---|
| Sovereign local data foundation | M4-ish | Ω vault, append-only evidence, verification, roundtrip | Full product recovery journey |
| Ontology/evidence/representation | M3 | P1-03 baseline PASS; strong contracts/provenance | Broader product-domain coverage |
| Plugin runtime | M3–M4 | Ω runtime/compositions/capability boundaries | Product-scale composition/lifecycle |
| Law/authority | M3–M4 | consent, law registry, scope, delegation, ledgers | Wider execution surface |
| Natural-language interaction | M3 | deterministic NLCL/intent, traces, visual spec | Whole-world addressing |
| Context substrate | M3–M4 | D-443 deterministic cited assemblies | Current-work semantics |
| Self-knowledge | M3 | mind snapshot/query/portrait | Whole-world model |
| Conversation storage | M3 | vivim.chat pilot | World/workspace/provider integration |
| AI history import | M3 | ChatGPT/Claude/Gemini parsers | User-facing import and organization |
| Provider realization | M3 | realization registry and promotion lifecycle | Live proof + choice model |
| Browser provider | M2–M3 | implementation + fixture proof | M4 live Chrome |
| Provider accounts | M2 legacy / M1 Ω | ProviderAccount, profiles, fleet | First-class Ω account object |
| Provider/model routing | M2 legacy / M1 Ω | ProviderMux preferences, priority, cost, learned | Canonical user policy |
| Canvas/spatial UI | M2–M3 legacy / M1–M2 Ω | canvas/workspace machinery | Ω world integration |
| Workspaces/projects | M2 legacy / M1 Ω | adaptive workspace, presets | Unified spaces/context |
| Agents | M3 governance / M2 execution breadth | identity, scope, delegation, revocation | General capability execution |
| Automation | M3 | director rules/tick/ledger | General work engine |
| Background work | M2–M3 | daemon/tick/scheduler | Return-to-user continuity |
| Attention/standing intent | M1 | concept + scattered proactive features | First-class model |
| Forge/self-extension | M3 | forge.author and proposal/promotion | Ordinary-user creation UX |
| Provider healing | M2–M3 proving | discovery + healing fixtures | Live reality + autonomous maintenance |
| Temporal sovereignty | M2–M3 | revisions/history/replay concepts | Product undo/replay/fork |
| Exit/reconstruction | M2–M3 | vault roundtrip/export concepts | Full installed-environment journey |

## 3. The important asymmetry

The repository is strongest in machine-side truth:

- ontology;
- law;
- vault;
- plugin runtime;
- deterministic language;
- evidence.

It is weakest in user-side assembly:

- account experience;
- provider choice;
- whole-world projection;
- workspace/canvas integration;
- background continuity;
- attention;
- product lifecycle.

The program should therefore avoid spending the next large cycle merely making already-strong foundations more elaborate.

## 4. Critical gap register

### G1 — Account object

Connect person → provider → account → authentication/profile/session → capabilities/models → policy.

### G2 — Routing policy

Represent user intent such as default provider, account constraints, model preference, forbidden combinations, fallback, and approval boundaries.

The legacy ProviderMux is strong behavioral evidence, but not yet the canonical Ω policy model.

### G3 — Whole-world projection

Expand the World projection across permitted domains without turning mind into an authoritative warehouse.

### G4 — Canvas as product face

Make the spatial surface a live projection of world, context, work, and attention.

### G5 — Current context

Connect D-443 deterministic context assembly to “what am I working on now?”

### G6 — General work lifecycle

Unify requested → planned → running → waiting → succeeded/failed/refused → reviewed → remembered.

### G7 — Background continuity

Turn background execution into a truthful return experience.

### G8 — Attention

Unify interests, watches, reports, notifications, standing requests, and autonomous triggers.

### G9 — Configuration

Expose fine-grained configuration through ordinary interaction rather than architecture-facing administration.

### G10 — Native self-extension

Turn capability gaps into a user-facing forge/configure/test/promote flow.

### G11 — Live external reality

Prove the browser/account path against real Chrome and real authenticated provider sessions.

### G12 — Product lifecycle

Own install, first run, connection, defaults, update, recovery, export, and reconstruction as a product track.

## 5. Cross-cutting maturity gates

A destination capability should pass, as applicable:

1. **Semantic** — canonical meaning and identity.
2. **Governed** — explicit authority, scope, refusal.
3. **Proven** — reproducible evidence.
4. **Live** — real environment proof where external reality is involved.
5. **Composed** — participates in a real destination journey.
6. **Human** — usable without architecture knowledge.
7. **Sovereign** — inspectable, configurable, replaceable, recoverable, extensible.

A capability may be useful before all seven. It should not be called destination-grade until the relevant gates are crossed.

## 6. Anti-patterns

Architecture maturity is not product maturity.

More features are not automatically more destination progress.

More providers are not provider intelligence until account, realization, routing, live behavior, and healing compose.

More canvas is not a better environment unless it improves understanding and manipulation of the world.

More agents are not more autonomy unless work state, authority, evidence, and continuity are coherent.
