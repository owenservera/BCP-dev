# State — Evolution, Reconciliation & Self-Maintenance

Updated: 2026-09-25

Status: **SETUP COMPLETE / DESIGN INITIALIZED / RESEARCH NOT YET COMPLETE**

## Established design

The destination now treats self-maintenance and self-extension as governed system evolution.

Three classes of change are explicitly separated:

1. **Deterministic maintenance**
   - recompute
   - refresh
   - rebuild
   - reindex
   - reconnect
   - retry/reconcile
   - quarantine
   - restore disposable projections

2. **Governed evolution**
   - plugin/capability/composition changes
   - provider-realization repair
   - migration
   - routing/configuration evolution
   - replacement/deprecation
   - generated extension

3. **Constitutional evolution**
   - authority semantics
   - canonical identity laws
   - evidence semantics
   - ownership/sovereignty rules
   - core protocol/constitutional invariants

Constitutional evolution cannot be self-authorized by ordinary runtime behavior.

## Core loop

OBSERVE → DETECT → UNDERSTAND → PROPOSE → IMPACT → COMPATIBILITY → AUTHORITY → CHANGE → VERIFY → PROMOTE → MONITOR → ROLLBACK/QUARANTINE

## Important existing evidence

Ω already contains substantial ingredients:

- Forge proposal/evaluation/promotion/rollback;
- behavior version staging/activation/quarantine;
- vault dry-run migration and cited rollback points;
- append-only revisions;
- discovery and promotion evidence;
- provider healing;
- impact/revalidation identified as a program control;
- plugin manifest/contract boundaries.

The missing work is the **single cross-domain semantic constitution for change**.

## Current integration decision

Treat this lane as the semantic foundation beneath D5 “Self-Knowledge & Evolution” and alongside the Forge/Provider/Work/Product lifecycle boundaries.

Do not create a second P1 portfolio.

## Next

Research and reconcile:

- dynamic/evolving data model;
- object and relationship evolution;
- identity correspondence;
- temporal continuity;
- compatibility algebra;
- change-impact derivation;
- migration/recovery;
- resource/lifecycle economics;
- extension/promotion;
- self-maintenance safety;
- evidence across versions;
- constitutional amendment rules.


## Plugin architecture integration

A key refinement is now established:

**Everything-is-a-Plugin is the extensibility/replacement architecture; Evolution is the temporal/governance dimension of that architecture.**

The research must therefore treat plugin boundaries, contribution metadata, contract/version semantics, canonical data ownership, Work continuity, evidence, Forge recursion, and host constitutional enforcement as one coupled problem.

New integration artifact:
`docs/destination/EVERYTHING-IS-A-PLUGIN-EVOLUTION-CONSTITUTION.md`.

## Core/plugin boundary integration

The archaeology-derived development criterion is now recorded at `docs/destination/CORE-VS-PLUGIN-BOUNDARY-DISTILLATION.md`.

Refined model:

- K0 = irreducible Ω kernel / non-bypassable enforcement;
- K1 = shared plugin-boundary contracts/protocols;
- System plugins = first-party VIVIM capabilities that may be essential but remain replaceable;
- Extension plugins = user/third-party capabilities;
- Tooling = out-of-tree development machinery.

The default classification is not Core. A K0 addition requires an explicit why-not-plugin rationale and falsifier.

## Factory / composition implication

Evolution applies to the entire compositional ecosystem, not only to self-maintenance or provider repair.

A user may evolve both:
- an individual piece/capability; and
- a composition/set made from multiple pieces.

The ordinary product path is therefore capable of:
discover → compose → use → inspect → modify → replace → extend → remove
with the same governed evolution rules that protect identity, evidence, authority, compatibility and recovery.

The first-party ecosystem should provide reference pieces and compositions that demonstrate these rules in practice, so interoperability is learned from working examples rather than designed only as abstract specification.
