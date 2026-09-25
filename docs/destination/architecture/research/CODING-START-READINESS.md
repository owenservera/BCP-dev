# Coding Start Readiness

> Classification: DERIVED — STEWARD CONVERGENCE
> Date: 2026-09-25
> Status: coding-start boundary established
> Authority: Ω ratified law remains authoritative; this is the repository's derived build boundary.

## 1. Decision

**Coding can begin now.**

The repository has crossed the useful preparation threshold because the first factory boundary, building language, reference pieces, first composition, factory UX invariants, and proof path are sufficiently aligned. Remaining open items are concrete implementation/proof work inside an already-characterized architecture, not unresolved assumptions likely to require a different factory model.

The operating loop is now:

```text
FIND → SYNTHESIZE → DECIDE → BUILD → LEARN
```

Do not start another broad architecture archaeology pass before the first build.

## 2. Round 1 convergence

All four bounded investigations returned READY:

| Investigation | Result | Durable output | Commit |
|---|---|---|---|
| Factory Boundary | READY | `docs/destination/architecture/research/FACTORY-BOUNDARY-BASELINE.md` | `65f108e` |
| Reference Legos | READY | `docs/destination/architecture/research/REFERENCE-LEGOS-BASELINE.md` | `f592a55` |
| First Composition | READY | `docs/destination/architecture/research/FIRST-COMPOSITION-BASELINE.md` | `d98e315` |
| Factory UX | READY | `docs/destination/architecture/research/FACTORY-UX-INVARIANTS.md` | `e53eb60` |

The four branches remain separate so their lineage is inspectable.

## 3. Factory boundary

The smallest credible factory is:

```text
K0 Ω
  admission / integrity
  isolation / Port transport
  capability egress / fencing
  atomic activation / recovery
  crypto / canonical primitives
  generic runtime lifecycle
        ↓
K1
  Recipe / Manifest / Port / refs / refusal
  shared capability, intent, work, object, evidence vocabulary
        ↓
System plugins
        ↕
Extension plugins
        ↓
Compositions
        ↓
Product Instance
```

This is a **compositional factory**, not the final VIVIM product.

The host remains constitutional infrastructure. Product meaning stays outside K0.

Repository evidence:
- `omega-baseline/omega-final/docs/decisions/CURRENT-INVARIANTS.md`
- `omega-baseline/omega-final/contracts/src/recipe.ts`
- `omega-baseline/omega-final/contracts/src/manifest.ts`
- `omega-baseline/omega-final/host/src/index.ts`
- `docs/destination/CORE-VS-PLUGIN-BOUNDARY-DISTILLATION.md`

## 4. Building language

No new ontology is required.

The first implementation can use the already-established vocabulary:

```text
Capability
Plugin
Contract
Composition
Object
Surface
Realization
Authority
Work
Evidence
Forge
Evolution
Product Instance
```

The critical semantic distinctions remain:

- capability ≠ realization;
- realization ≠ authority;
- work ≠ execution mechanism;
- evidence ≠ authority;
- representation ≠ canonical reality;
- candidate ≠ promoted/active realization.

Recipe + Manifest are the admission/build language. Port is the interoperability boundary. Plugin contributions carry product semantics. Composition selects a set of contributions. The Product Instance owns continuity; the vault owns durable truth.

## 5. K0 / K1 / plugin / tooling placement

### K0

Only the non-bypassable domain-neutral mechanisms:

- signed admission and content integrity;
- compartment/Port transport;
- capability egress verification;
- revocation/generation fencing;
- atomic activation/fail-closed recovery;
- generic lifecycle;
- required crypto/canonical primitives;
- minimal platform seam.

### K1

Shared interoperability vocabulary:

- Recipe / Manifest;
- Port;
- capability/plugin references;
- lifecycle;
- refusal/outcome envelopes;
- intent/work/object/evidence references;
- other contracts needed for interoperability without product ownership.

### System plugins

First-party VIVIM semantics, including:

- law policy content;
- vault;
- run/work;
- mind/world projection;
- NLCL/intent;
- providers/account/session;
- browser realization;
- Forge;
- product surfaces;
- attention/memory/context as they become integrated.

### Extension plugins

Third-party and user-created contributions through the same governed boundary.

### Tooling

Generators, research utilities, diagnostics, proof tools and CI outside runtime authority.

**First-party does not mean Core. Importance does not mean Core.**

## 6. Smallest reference-piece set

The first-party/reference set is:

1. `vivim.law`
2. `vivim.vault`
3. `vivim.run`
4. `vivim.mind`
5. existing NLCL/intent path
6. `provider-browser`
7. Forge / `forge.author`

The first E2E product composition only needs the first six; Forge becomes the reference for the next factory loop: creation and evolution.

This set demonstrates:

```text
Address / Intent
  ↓
Capability
  ↓
Realization
  ↓
Authority
  ↓
Work
  ↓
Execution
  ↓
Evidence / Vault
  ↓
World projection
  ↓
Factory evolution
```

Legacy behavior is harvested selectively rather than structurally imported:
ChromeGovernor/profile isolation, ProviderMux routing behavior, semantic grounding, guided provider probing, stream alignment, parser/selector repair, provider health, replay fixtures, and mature workspace/canvas/conversation behaviors.

Sources:
- `research/steward-product-experience:docs/destination/product-experience/research/PRODUCT-EXPERIENCE-ARCHAEOLOGY.md`
- `docs/destination/legacy-harvest/HARVEST-SYNTHESIS.md`
- System Intelligence SI-02 / SI-05.

## 7. First meaningful composition

### Research → Evidence → World

User expression:

> “Research this for my project and save what you find.”

Exact language is not canonical. The compositional invariant is:

```text
User
  ↓
factory surface / composition
  ↓
Address + Intent
  ↓
Context / World
  ↓
research capability
  ↓
provider-browser realization
  ↓
Authority / consent
  ↓
durable Work where consequential
  ↓
browser execution
  ↓
Vault evidence + result
  ↓
World projection
  ↓
Product Instance continuity
```

This composition proves the factory without pretending that all routing, providers, projects, surfaces, or background agency are finished.

### Why this is the factory rather than a fixed product

The visible outcome is only one composition.

The invariant factory machinery is reusable for other compositions such as:
- files + search + report;
- email + contact + project;
- monitoring + attention + background Work.

A user's instance can therefore differ without changing K0 or inventing a second application architecture.

## 8. Factory UX invariants

Stable factory affordances are:

**discover → address → understand → compose → configure → govern → inspect → create → replace → evolve → remove**

Instance-level outcomes are variable:
- the user's world;
- spaces/workspaces;
- chosen pieces;
- projects;
- conversations;
- routing rules;
- surfaces;
- Work;
- attention;
- personalized compositions.

The factory must not require a privileged developer mode.

The ordinary creator/composer path eventually becomes:

```text
discover gap
  ↓
describe capability/set
  ↓
construct candidate
  ↓
inspect dependencies + effects + authority
  ↓
test / falsify
  ↓
promote
  ↓
use as ordinary piece/set
  ↓
inspect / replace / evolve / remove
```

## 9. What Ω is reused

The build should **compose and extend Ω**, not redesign it:

### Reuse directly

- Recipe/Manifest admission;
- µhost/Port;
- capability token verification;
- law/consent gate;
- vault durability and revisioned evidence;
- canonical intent persistence;
- ProviderRealization vocabulary;
- provider-browser fixture-first machinery;
- mind as a derived world lens;
- Forge promotion/rollback machinery.

### Extend around Ω

- Product Instance lifecycle and activation wrapper;
- finished factory surface/creator UX;
- the canonical Work/product continuity join;
- bounded account/routing UX;
- world projection breadth;
- normal-user composition editing and inspection.

### Replace only at explicit seams

Provider realization, surface implementation, storage implementations behind contracts, and other replaceable contributions should evolve through plugin/evolution governance rather than host rewrites.

## 10. Dangerous unknowns versus ordinary implementation

### Architecture-blocking unknowns

None remain that currently require a different factory model.

### Explicit implementation/proof gates

#### A. B1 executable-entry confinement

The ratified law is already clear; the current implementation is known not to close it fully. Fix the implementation **inside the existing K0 admission boundary**. Because B5 is at 1500/1500 LOC, obey remove-to-add discipline.

#### B. Generic bootstrap / zero-plugin semantics

The current genesis mechanism is real and bounded, but the generic factory bootstrap obligation remains a proof item. Implement/test it without introducing product semantics into K0.

#### C. State / Graph / Grant / Generation reduction

Reduce these to the minimum generic kernel mechanisms actually required. Do not promote whole product systems into Core.

#### D. First-party / third-party symmetry

Use the same Recipe/Manifest/Port path for a first-party-shaped and extension-shaped test plugin.

#### E. Active Work across replacement

Bind consequential Work to the semantics/contract basis it was authorized against. Replacement must continue, migrate, pause or refuse through explicit compatibility policy; never silently reinterpret active Work.

#### F. Product Instance activation

Current evidence distinguishes verified candidate from activated composition. The first product lifecycle implementation must preserve the prior active composition until the new candidate is compatible and successfully ready.

#### G. Live provider proof

Current evidence distinguishes fixture/code proof from live external proof. Keep the V1 browser-first fixture/replay path and run the owner-machine live-provider ceremony as verification; never treat fixture success as live proof.

These are build gates, not reasons to reopen the factory ontology.

## 11. Single E2E proof path

The first executable proof is:

1. initialize/open one Product Instance;
2. load an admissible composition containing the reference pieces;
3. address a project/topic through the existing intent path;
4. assemble bounded context;
5. resolve one research capability;
6. select one declared browser realization;
7. pass the ordinary law/consent boundary;
8. create durable Work when the action is consequential;
9. execute via the Chrome/browser realization;
10. persist result and evidence in the vault;
11. read the result through the World projection;
12. close the instance;
13. reopen the same instance;
14. verify the same canonical result/evidence is still present.

Acceptance must preserve:

```text
same Product Instance identity
same canonical evidence
same world basis
same governed attribution
different runtime process/session allowed
```

The test is deliberately narrow. It demonstrates interoperability and continuity rather than feature breadth.

## 12. Ordinary user creation requirement

The first build does not need a fully general creator UI, but it must preserve the path toward it.

A user-created piece and user-created set must eventually be ordinary governed contributions.

The system must therefore never bake a developer-only authority path into:
- plugin admission;
- capability grants;
- composition activation;
- Forge output;
- replacement.

The Personal Agent can explain and guide construction, but does not gain extra authority.

## 13. Explicitly out of scope at coding start

Do **not** wait for:

- full 125-row implementation;
- complete World/Surface coverage;
- all providers/accounts/routing policies;
- autonomous self-evolution;
- full provider healing;
- full attention/notification platform;
- complete native Windows shell;
- universal digital-world acquisition;
- multi-device continuity/sharing;
- full extension distribution;
- final product packaging/installers;
- a new ontology;
- a new architecture portfolio/backlog.

These are later implementation/research surfaces whose absence does not invalidate the factory cut line.

## 14. Exact stop condition for preparation

Preparation is complete when the first implementation can answer, in code and proof:

> **Can one governed composition made from replaceable pieces produce a useful user outcome, preserve evidence and canonical state, and be closed/reopened without losing the user's environment identity?**

The repository now has:
- a stable factory boundary;
- concrete building language;
- reference pieces;
- one first composition;
- stable factory UX invariants;
- explicit dangerous unknowns;
- one E2E path;
- a bounded owner-machine proof gap.

At this point, further architecture preparation has lower information value than building the experiment.

## 15. First coding tranche

Code in this order, keeping changes inside the established seams:

```text
1. harden K0 admission/bootstrap falsifiers
2. establish Product Instance activation/continuity boundary
3. assemble the six-piece first composition
4. connect Intent → Capability → Realization → Authority → Work
5. persist Evidence/World result
6. implement close/reopen proof
7. only then expand factory creation/evolution UX
```

Every substantive implementation should record:

```text
BoundaryClass
SemanticOwner
WhyNotCore
Dependencies
AuthorityBoundary
ReplacementSeam
EvolutionClass
Falsifier
```

## 16. Readiness conclusion

The architectural question is no longer:

> “What architecture should we design?”

It is:

> **“Does the smallest compositional factory work when we actually build it?”**

The next meaningful evidence must therefore come from implementation and falsification.

CODING STATUS: GO