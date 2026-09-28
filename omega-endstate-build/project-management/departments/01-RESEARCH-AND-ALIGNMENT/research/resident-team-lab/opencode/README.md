# OpenCode Research Gateway

> Status: ACTIVE RESEARCH
> Last reviewed: 2026-09-28
> Scope: OpenCode-specific evidence for the Ω resident-team program

This directory is the OpenCode-specific companion to the broader resident-team research in this parent folder.

It answers a narrower question:

> **What does OpenCode actually provide as a runtime substrate for durable residents, bounded workers, delegation, coordination, and future self-evolution — and what must Ω prove or add around it?**

## Read first

1. [00-SOURCE-INDEX.md](00-SOURCE-INDEX.md) — authoritative navigation into primary OpenCode sources, local substrate, examples, and issue watch.
2. [01-NATIVE-SUBSTRATE.md](01-NATIVE-SUBSTRATE.md) — mental model of agents, Task, permissions, sessions, plugins, and alternate execution surfaces.
3. [02-KNOWN-WORKING-EXAMPLES.md](02-KNOWN-WORKING-EXAMPLES.md) — working OpenCode-native examples, especially the vendored `opencode-swarm`.
4. [03-VERSION-WATCH.md](03-VERSION-WATCH.md) — version boundaries and drift protocol.
5. [04-WINDOWS-AND-HEADLESS.md](04-WINDOWS-AND-HEADLESS.md) — Windows and unattended-execution constraints.
6. [05-EVIDENCE-AND-GAPS.md](05-EVIDENCE-AND-GAPS.md) — what is source-exact, externally corroborated, locally exercised, or still unknown.
7. [06-CONTEXT-ARCHITECTURE-AND-SPAWN-BALANCE.md](06-CONTEXT-ARCHITECTURE-AND-SPAWN-BALANCE.md) — session/context separation, handoff, compaction, and fresh-vs-resume balance.
8. [07-RESIDENCY-DEPARTMENT-AND-PRESENCE-KERNEL.md](07-RESIDENCY-DEPARTMENT-AND-PRESENCE-KERNEL.md) — functional departments, master/resident identity, worker capability, dormancy, background presence, context epochs, and attention budgets.
10. [08-CROSS-DOMAIN-ORGANIZATIONAL-RUNTIME-SYNTHESIS.md](08-CROSS-DOMAIN-ORGANIZATIONAL-RUNTIME-SYNTHESIS.md) — cross-domain synthesis from virtual actors, controllers, supervision, blackboards, capability allocation, durable execution, and context engineering.
11. [upgrades/README.md](upgrades/README.md) — upgrade-wave index.
12. [upgrades/U2A/README.md](upgrades/U2A/README.md) — proposed residency/presence upgrade lane.
13. [upgrades/U1/README.md](upgrades/U1/README.md) — current U1 research lane.

## Evidence hierarchy

Use these labels consistently:

| Class | Meaning |
|---|---|
| SOURCE-EXACT | Directly inspected OpenCode source at the relevant version. |
| OFFICIAL-DOCS | Current OpenCode documentation; useful for supported concepts, not proof of historical behavior. |
| EXTERNAL-CORROBORATION | Public issue/report demonstrating a related failure class. |
| LOCAL-KNOWN-WORKING | Behavior exercised by the vendored or lab implementation. |
| LIVE-PROOF-REQUIRED | Must be reproduced on the installed target before becoming a design dependency. |
| DESIGN-CONCLUSION | Ω interpretation derived from evidence. |
| UNKNOWN | Material fact not yet established. |

Never collapse these classes.

## Version rule

The resident-team lab targets **OpenCode v1.18.4** as its pinned experimental substrate.

OpenCode is moving quickly. The upstream release stream reached **v1.18.33 on 2026-09-28**, so current documentation/source may describe behavior that differs from the lab target.

Therefore:

`v1.18.4` = lab evidence boundary  
`current` = compatibility/watch input  
`future` = experiment trigger, not authority

See [03-VERSION-WATCH.md](03-VERSION-WATCH.md).

## Relationship to the rest of the research

The parent `research/` library asks framework-independent questions about resident organization, coordination, evolution, isolation, and governance.

This OpenCode track maps those ideas onto an actual execution host.

The existing U1 design and checkpoints remain under:

- `../../docs/FIRST-MAJOR-UPGRADE-DESIGN.md`
- `../../docs/FIRST-MAJOR-UPGRADE-RESEARCH-BASIS.md`
- `../../docs/CHECKPOINTS.md`

This directory should link to those documents rather than silently creating a second U1 law.

## Current working thesis

OpenCode can provide a useful native execution substrate:

`resident decision -> native Task -> bounded child session -> observable result`

But OpenCode's session, permission, and task primitives are not identical to Ω's durable identity, authority, Work, evidence, acceptance, or governance semantics.

The central research job is therefore **boundary mapping**, not replacing OpenCode and not treating OpenCode's model-visible capabilities as Ω authority.

## Research maintenance rule

When OpenCode changes materially:

```
version/change observed
       |
       +--> inspect exact source/docs
       +--> compare against pinned v1.18.4 behavior
       +--> identify affected invariant/checkpoint
       +--> add or update experiment
       +--> only then update design dependency
```

A current release note never retroactively changes historical proof.
