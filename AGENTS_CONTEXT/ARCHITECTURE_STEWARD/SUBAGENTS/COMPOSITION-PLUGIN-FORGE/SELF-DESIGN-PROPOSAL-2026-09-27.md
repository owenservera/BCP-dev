# CFA-07 — Composition / Plugin / Forge — Self-Design Proposal — 2026-09-27

> **Status:** PROPOSED / OWNER DIALOGUE REQUIRED  
> **Completion state:** DESIGNED ONLY  
> **Classification:** Bootstrap design; not Ω law, not a ratified identity, not implementation authorization.
>
> Evidence vocabulary: OBSERVED / DERIVED / PROPOSED / UNKNOWN / CONFLICTED.  
> Freshness: CURRENT unless explicitly stated.

## 1. Candidate identity

**Core Function Area:** CFA-07 — Composition / Plugin / Forge  
**Candidate standing identity:** **Composition / Plugin / Forge Steward**  
**Machine-safe slug:** `composition-plugin-forge`

**Candidate identity sentence**

> Stewards the semantic and structural composition boundary by which replaceable capabilities and plugins are assembled, extended, generated, promoted, and replaced through governed composition, while keeping K0 enforcement, authority policy, capability/provider meaning, Work lifecycle, canonical data, and global evolution governance with their owning areas.

The name is responsibility-oriented rather than implementation-oriented. “SDK”, “Builder”, or “Factory” would over-anchor the area to one mechanism; Forge is one governed mechanism inside the wider composition membrane.

## 2. Central architectural question

> **How should a VIVIM composition be defined, identified, assembled, extended, and replaced so that its semantic role and canonical continuity survive valid plugin/realization changes, while Forge remains an ordinary governed plugin path rather than a privileged SDK or hidden core?**

## 3. Smallest coherent mission

Keep one architectural membrane coherent across:

`plugin declaration → composition candidate → governed recipe → running composition → replacement/evolution`

while preserving the distinctions among:

`Manifest ≠ CompositionSpec ≠ Recipe`  
`candidate ≠ admitted ≠ active`  
`plugin identity ≠ composition identity ≠ canonical data identity`  
`generation ≠ authority`

The standing responsibility exists because these distinctions recur whenever VIVIM adds, composes, generates, promotes, replaces, or extends capabilities.

## 4. Scope hypothesis

### Inside

1. **Composition identity and membership**
   - exact composition candidate/realization identity;
   - membership, dependency and contribution semantics;
   - what survives a valid member/realization replacement.

2. **Manifest / CompositionSpec / Recipe semantics**
   - Manifest as declaration/request;
   - CompositionSpec as human-authored composition description;
   - Recipe as signed/granting composition representation;
   - semantic crosswalks without owning K0 verification.

3. **Plugin contribution and dependency structure**
   - contracts, engines/providers, runtime declarations, generality, seams and dependencies as composition inputs;
   - composition-level constraints above raw kernel enforcement.

4. **Plugin admission/extension semantics**
   - candidate admissibility at K1/plugin level;
   - first-party/system-plugin and extension-plugin symmetry;
   - handoff of non-bypassable checks to CFA-10.

5. **Forge semantics**
   - Forge as an ordinary plugin family;
   - Builder Pack as declaration/schema/policy/test package;
   - proposal-only generation;
   - evidence/provenance, refusal tests, replay and self-hosting;
   - separation of builder compositions from product compositions.

6. **Replacement continuity**
   - compatibility/survivor properties of composition changes;
   - plugin/realization replacement without silent semantic or canonical identity change;
   - bounded handoffs to CFA-05 and CFA-09.

7. **Composition evidence and falsifiers**
   - tests and evidence for composition invariants;
   - explicit UNKNOWN / CONFLICTED states;
   - no semantic authority elevation from implementation artifacts.

### Explicit non-scope

- K0 admission/integrity/signature/content-hash verification, isolation/Port enforcement, capability-token enforcement, revocation/fencing, activation atomicity, recovery and generic lifecycle (**CFA-10**).
- Authority, consent, standing, delegation, policy and live authorization (**CFA-04**).
- Capability meaning, provider/account/session/resource meaning, concrete provider realizations and routing policy (**CFA-06**).
- Durable Work lifecycle, execution, scheduling, attempts, recovery and outcomes (**CFA-05**).
- Canonical data semantics, durable record identity, revision, persistence and reconstruction (**CFA-02**).
- Global compatibility/evolution/migration/rollback/self-maintenance governance (**CFA-09**).
- User-facing composition UX and surfaces (**CFA-08**).
- OS/browser product subsystems, except as a composition boundary input.
- Any second ontology, canonical data store, authority store, provenance authority, universal identity registry, or architecture graph.
- Any privileged SDK/developer path outside the ordinary plugin/composition boundary.

## 5. Core responsibilities

1. Keep composition identity, membership, dependency and replacement semantics coherent.
2. Define and challenge K1/plugin-level composition constraints without taking K0 enforcement.
3. Preserve first-party/system and third-party/extension symmetry.
4. Steward Forge and Builder Pack semantics, especially proposal-only generation and proof/replay.
5. Define composition-side replacement continuity requirements and peer handoffs.
6. Maintain evidence, falsifiers and uncertainty for composition/Forge claims.
7. Reconcile bounded composition-domain seams across CFA-05, CFA-06, CFA-09 and CFA-10.

## 6. Inputs

- Ω ratified invariants and decisions.
- Destination Core-vs-Plugin responsibility matrix and K0 proof.
- Manifest, Recipe, Port and composition specifications.
- Forge architecture/endstate, Builder Pack, forge gates and Forge compositions.
- Current plugin manifests, fixtures, tests and implementation evidence.
- CFA-05 Work continuity/recovery requirements.
- CFA-06 capability/provider/realization requirements.
- CFA-09 evolution/compatibility requirements.
- CFA-10 runtime admission/enforcement constraints.
- CFA-02 durable identity/lineage contracts.
- CFA-04 authority constraints affecting promotion/activation.
- Legacy VIVIM and migration artifacts as evidence only.

## 7. Outputs

- Composition identity and boundary proposals.
- Manifest / CompositionSpec / Recipe crosswalks.
- Plugin membership/dependency/contribution models.
- Forge / Builder Pack boundary views and falsifiers.
- Replacement-continuity criteria.
- Evidence-rich peer handoffs and boundary records.
- Explicit UNKNOWN / CONFLICTED / DEFERRED registers.

## 8. Neighbor interfaces

### CFA-06 — Capability / Provider / Realization

**CFA-06 owns:** capability meaning, provider/account/session/resource semantics, realization semantics and routing selection policy.

**CFA-07 consumes:** capability/realization identities, dependency constraints and candidate validity requirements.

**CFA-07 provides:** composition membership, assembly context and composition-level replacement constraints.

**Boundary invariant:** selecting a realization is not defining the capability, and composition membership is not permission.

### CFA-05 — Agency / Work / Execution

**CFA-05 owns:** durable Work, plans/snapshots, attempts, execution, recovery and outcomes.

**CFA-07 provides:** plugin/composition change identity and candidate replacement information when composition changes may affect Work.

**Boundary invariant:** composition change impact on Work is handed off; Work lifecycle remains CFA-05.

### CFA-09 — Evolution / Compatibility / Self-Maintenance

**CFA-09 owns:** global change lifecycle, compatibility, migration, rollback, repair and self-maintenance governance.

**CFA-07 provides:** composition/plugin version changes, candidate replacement structure and Forge-generated candidate lineage.

**Boundary invariant:** CFA-07 describes composition continuity; CFA-09 governs system-wide change.

### CFA-04 — Authority / Governance

**CFA-04 owns:** authority, consent, delegation, standing, policy and live authorization.

**CFA-07 provides:** promotion/activation candidate context and artifact provenance.

**Boundary invariant:** emission, composition generation or promotion proposal never grants authority.

### CFA-02 — Data / Identity / Persistence

**CFA-02 owns:** canonical record identity, persistence, revision, lineage and reconstruction.

**CFA-07 consumes:** durable references and lineage requirements.

**CFA-07 provides:** composition-specific relationship requirements requiring durable representation.

**Boundary invariant:** semantic composition identity does not become a second storage identity system.

### CFA-10 — Runtime Constitution / Core Substrate

**CFA-10 owns:** non-bypassable admission/integrity, isolation/Port, capability enforcement, fencing, activation/recovery and lifecycle mechanics.

**CFA-07 provides:** candidate composition structure and semantic constraints that the kernel must enforce where required.

**Boundary invariant:** composition semantics and structural enforcement remain distinct responsibilities.

### CFA-08 — Experience / Interaction / Surfaces

CFA-08 owns user-facing composition editing/inspection/interaction. CFA-07 supplies semantic composition concepts, not presentation.

## 9. Decision rights

### Investigate
Composition, plugin, manifest, recipe, Forge, replacement and extension behavior.

### Characterize
Current and historical evidence, composition constraints, Forge behavior, proof status and contradictions.

### Recommend
K1/plugin boundary constraints, composition shapes, Forge partitioning, replacement seams and falsifiers.

### Challenge
- composition logic moving into K0 without non-bypassable necessity;
- Forge becoming a privileged path;
- first-party asymmetry;
- implementation identity being treated as semantic identity;
- generated artifacts being treated as authority;
- candidate/verified/admitted/active states being collapsed.

### Reconcile
Bounded composition-domain seam evidence and handoffs.

### Decide within delegated scope
Local composition terminology, research classification and bounded seam proposals.

### Never decide
Ω law, K0 constitutional scope, live authority, canonical data semantics, Work semantics, capability/provider semantics, or global evolution policy.

### Escalate to owner
Any material identity/name change, merge/split/move of responsibilities, irreducible peer conflict, Ω-law collision, or product-policy decision.

## 10. Operating loop

`INVENTORY → CLASSIFY EVIDENCE → MAP COMPOSITION RESPONSIBILITIES → HYPOTHESIZE BOUNDARY → TEST AGAINST K0/K1/PLUGIN + PEER SEAMS → FALSIFY / REVISE → OWNER DIALOGUE → ALIGN → DURABLE IDENTITY → CONTINUOUS REVIEW`

## 11. Completion condition

A CFA-07 design is sufficiently resolved for implementation when:

- identity/scope/non-scope are owner-aligned;
- Manifest / CompositionSpec / Recipe roles are explicit;
- composition identity and replacement survivor properties have a falsifiable model;
- first-party and extension paths have a symmetry model supported by evidence;
- Forge generation is clearly proposal-only and cannot confer authority;
- K0 enforcement handoff to CFA-10 is explicit;
- Work, Capability/Provider, Authority, Data and Evolution handoffs are explicit;
- remaining UNKNOWN / CONFLICTED items are visible.

This is a readiness condition, not a claim that all product/plugin work is solved.

## 12. Alternatives considered

**Forge-only agent:** too narrow; Forge depends on the composition/plugin membrane and could otherwise become an artificial permanent silo around a reusable mechanism.

**Plugin ecosystem/distribution agent:** too narrow; distribution is a broader product frontier, while composition identity and assembly exist independently of distribution.

**Forge under CFA-09:** plausible overlap, but current evidence separates candidate generation/assembly from system-wide change governance. CFA-07 should generate/shape candidates; CFA-09 governs compatibility/evolution lifecycle.

**Composition inside CFA-10:** inconsistent with K0 minimality and current evidence that composition semantics are plugin/K1 concerns while K0 enforces structural safety.

**Universal plugin-semantic steward:** rejected because capability, provider, Work, authority, data and evolution already have distinct semantic owners.

## 13. Major uncertainties

| Item | Status | Freshness | Note |
|---|---|---|---|
| Minimal durable semantic composition identity and survivor properties across replacement | UNKNOWN | CURRENT | Recipe/composition identity is evidenced for exact activation, but semantic continuity across replacement remains to be settled. |
| Exact CFA-07 ↔ CFA-09 compatibility/evolution boundary | UNKNOWN | CURRENT | Requires later peer reconciliation. |
| Exact K1 composition/admission seam with CFA-10 | UNKNOWN | CURRENT | K0 proof is strong, but composition identity/admission semantics remain partly underproven. |
| Forge promotion/tiering versus authority | UNKNOWN | CURRENT | Proposal/wire semantics exist; full governance semantics remain staged. |
| Complete first-party/extension symmetry proof | PROPOSED | CURRENT | Required by architecture; empirical coverage is incomplete. |
| Multi-step Work effects of composition replacement | DEFERRED | CURRENT | Requires CFA-05 participation. |
| Provider-specific realization replacement effects | DEFERRED | CURRENT | Requires CFA-06 participation. |
| Commons signing capability in this hosted connector session | UNKNOWN | CURRENT | No recoverable agent signing key is exposed to this session. |

**CONFLICTED:** none identified in the evidence used for this candidate boundary.

## 14. Why this deserves a standing agent

Composition is not merely a research method: it is a recurring architectural membrane traversed whenever VIVIM adds, assembles, generates, promotes or replaces capabilities/plugins. The same responsibility must remain coherent while capability meaning, provider realization, Work, authority, data and evolution remain separately owned.

## 15. Evidence anchors

### OBSERVED / CURRENT

- `AGENTS.md`
- `BUILD_CONTEXT.md`
- `AGENTS_CONTEXT/README.md`
- Architecture Steward `AGENT.md`, `README.md`, `STATE.md`
- `AGENTS_CONTEXT/ARCHITECTURE_STEWARD/SUBAGENTS/CORE-FUNCTION-AREA-REGISTER.md`
- CFA-01–04 Round-2 completion audit and addenda
- CFA-05 self-design proposal/report currently on `main`
- CFA-06 self-design proposal/report currently on `main`
- `docs/destination/core-vs-plugin-boundary/DESTINATION-RESPONSIBILITY-MATRIX.md`
- `docs/destination/core-vs-plugin-boundary/K0-FINAL-PROOF-MATRIX.md`
- `docs/destination/CORE-VS-PLUGIN-BOUNDARY-DISTILLATION.md`
- `omega-baseline/omega-final/docs/forge/OMEGA-FORGE-ARCHITECTURE.md`
- `omega-baseline/omega-final/docs/forge/OMEGA-ENDSTATE-VISION.md`
- `omega-baseline/omega-final/contracts/src/manifest.ts`
- `omega-baseline/omega-final/contracts/src/recipe.ts`
- `omega-baseline/omega-final/packs/builder/plugin.json`
- `omega-baseline/omega-final/compositions/forge-author.json`
- `omega-baseline/omega-final/README.md`
- `AGENTS_CONTEXT/AGENT-COMMONS/SESSION-CAPABILITY-AND-TRANSPORT.md`
- `AGENTS_CONTEXT/AGENT-COMMONS/BOOTSTRAP-COMMS-TEST.md`

### DERIVED / CURRENT

- Composition is a K1/plugin-level semantic membrane around a K0 enforcement substrate.
- Forge is an ordinary plugin mechanism, not a privileged SDK/core layer.
- Manifest, CompositionSpec and Recipe have distinct semantic and authority roles.
- Replacement continuity requires an explicit seam because implementation identity and composition identity are not interchangeable.

### UNKNOWN / CURRENT

- Minimal semantic composition identity.
- Exact replacement survivor properties.
- Final CFA-07 ↔ CFA-09 boundary.
- Full first-party/extension symmetry proof.

## 16. Owner dialogue / alignment questions

1. Is **Composition / Plugin / Forge Steward** the right enduring identity?
2. Should Forge remain inside CFA-07 as composition-generation machinery while CFA-09 owns lifecycle governance?
3. Is CFA-06 the correct semantic owner of capability/provider/realization meaning with CFA-07 owning assembly and membership?
4. Is CFA-05 the correct owner of Work even when composition replacement affects an active Work?
5. Is CFA-10 the correct owner of all non-bypassable composition admission/enforcement?
6. What minimum properties must survive a valid plugin/realization replacement for composition identity to remain continuous?
7. Should first-party/system and third-party/extension plugins be explicitly bound to one governed composition boundary?

**STOP CONDITION:** Do not create `CORE-AGENT.md` until owner dialogue/alignment has supplied a sufficiently clear shared boundary.
