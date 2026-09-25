# VIVIM Program — Completeness & Missing Control Model

> Classification: DERIVED — CURRENT PROGRAM MODEL
> Purpose: identify what is still missing in the management system around the destination architecture, not merely what is missing in the product.
> Scope: program governance, traceability, sequencing, ownership, evidence, risk, research, delivery, and release control.

## 1. The current program is strong in four areas

The repository now has:

1. a durable architecture/proof portfolio (P1);
2. a product/delivery lens (D1–D6);
3. a destination map, maturity model, dependency graph, and frontier inventory;
4. a cooperative agent system that preserves work across sessions.

That is a strong base.

The remaining concern is that these views do not yet form one closed management loop.

## 2. Closed-loop program model

The target management loop is:

```
DESTINATION
   ↓
REQUIREMENTS / JOURNEYS
   ↓
DEPENDENCIES
   ↓
WORK / OWNERS
   ↓
EVIDENCE
   ↓
MILESTONE VERDICT
   ↓
PROGRAM STATE
   ↓
NEXT WORK
   ↺
```

Today the repository is strongest at:

```
DESTINATION → DEPENDENCIES → SOME WORK → EVIDENCE
```

The weaker links are:

- requirements/journey traceability;
- explicit ownership;
- dependency-specific acceptance criteria;
- risk/assumption management;
- research frontier intake;
- product/release readiness;
- automated synchronization between evidence and program state.

---

## 3. Programmatic gaps

### PG-1 — Requirements-to-evidence traceability

**Current:** destination journeys and P1 workstreams exist, but there is no canonical matrix mapping every important destination requirement to:

```
requirement
→ journey
→ dependency
→ workstream
→ implementation
→ proof
→ release gate
```

**Risk:** a feature can appear “covered” because several adjacent components exist even though no one has demonstrated the complete requirement.

**Needed:** a lightweight traceability matrix covering the eight canonical journeys and the major keystone dependencies.

**Complexity:** 6/10.

---

### PG-2 — One owner per outcome

**Current:** several P1 entries still have TBD owners, while D1/D2/product-surface ownership is explicitly missing.

**Risk:** cross-cutting product outcomes become everyone’s responsibility and therefore nobody's responsibility.

**Needed:** one accountable owner/role for every active milestone and every delivery track, even when implementation is distributed.

**Complexity:** 4/10.

---

### PG-3 — Dependency-specific acceptance criteria

**Current:** the program has milestone descriptions and falsifiers, but not every keystone dependency has a standard “what proves the level changed?” contract.

**Risk:** implementation can increase without maturity actually moving.

**Needed:** each L-level transition should name its required evidence.

Example:

```
L1 → L2
bounded working scenario

L2 → L3
cross-domain integration proof

L3 → L4
real external / owner-machine proof

L4 → L5
normal-user lifecycle proof

L5 → L6
sovereignty + replacement + recovery + evolution proof
```

**Complexity:** 6/10.

---

### PG-4 — Dual critical path

**Current:** PROGRAM-BOARD emphasizes the current Phase-1/V0 proof chain.

The destination dependency model exposes a second path: building the actual sovereign product.

**Risk:** the team can confuse “we are proving the architecture” with “we are progressing toward the full product.”

**Needed:** explicitly maintain:

**Proof Critical Path**
```
P1-08 → P1-06 → P1-07 → P1-09
```

and separately:

**Destination Build Path**
```
Product Environment
→ World
→ Interaction
→ Provider/Account
→ Work
→ Continuity
→ Evolution
→ Product lifecycle
```

These paths interact but are not identical.

**Complexity:** 5/10.

---

### PG-5 — Research-frontier intake

**Current:** L-1 frontier areas are now visible, but there is no canonical queue for deciding which uncharacterized area deserves research next.

**Risk:** the program reacts to interesting ideas rather than strategic dependency leverage.

**Needed:** every L-1 frontier gets:

```
question
→ why destination needs it
→ dependencies touched
→ existing evidence searched
→ unknowns
→ characterization experiment
→ decision
```

No implementation begins at L-1.

**Complexity:** 5/10.

---

### PG-6 — Assumption / hypothesis register

**Current:** assumptions are distributed across decisions, workstream docs, and conversations.

**Risk:** a hidden assumption can survive long enough to become architecture.

**Needed:** one small register for claims such as:

- “this provider can support the required browser flow”;
- “this local OS integration can remain sovereign”;
- “this workspace model scales to the whole world”;
- “this routing policy is understandable to normal users.”

Each assumption gets a state:

```
HYPOTHESIS
→ TESTING
→ SUPPORTED
→ FALSIFIED
→ RETIRED
```

**Complexity:** 4/10.

---

### PG-7 — Risk register tied to dependencies

**Current:** risk appears in individual docs but is not aggregated against the keystone graph.

**Risk:** high-risk low-maturity dependencies can be buried under normal work.

**Needed:** risk record at dependency level with:

- likelihood;
- impact;
- uncertainty;
- mitigation;
- evidence required;
- trigger for escalation.

**Complexity:** 5/10.

---

### PG-8 — Evidence / claim index

**Current:** evidence is strong but distributed across workstreams, decision records, tests, gates, and handoffs.

**Risk:** program state becomes manually interpreted, increasing the chance that a stale claim survives.

**Needed:** a lightweight index:

```
claim
→ current state
→ evidence artifact
→ evidence date
→ superseded?
→ revalidation trigger
```

This should remain an index, not a new source of truth.

**Complexity:** 6/10.

---

### PG-9 — Vertical-slice registry

**Current:** the repo has V0–V6 milestones and J1–J8 journeys, but does not yet maintain a canonical set of minimum end-to-end slices proving progressive user value.

**Risk:** subsystems can all improve while no complete user journey reaches the next maturity level.

**Needed:** define a small sequence such as:

~~~text
VS0 governed send
VS1 open/restore a local world
VS2 import an AI conversation into a project
VS3 choose an account/provider and act
VS4 delegate durable work
VS5 return to a changed world
VS6 create/modify a capability
~~~

Each slice should identify exactly which dependencies it exercises.

**Complexity:** 6/10.

---

### PG-10 — Product readiness gate

**Current:** `omega:gate`, tests, and architectural proof are much stronger than product-readiness control.

**Risk:** “green engineering” becomes “release ready” by implication.

**Needed:** separate readiness dimensions:

```
ENGINEERING
DATA SAFETY
SECURITY / AUTHORITY
LIVE PROVIDER
USER EXPERIENCE
INSTALL / UPDATE
RECOVERY / EXIT
OBSERVABILITY
```

A product milestone is green only when its relevant gates are green.

**Complexity:** 8/10.

---

### PG-11 — Change impact / dependency revalidation

**Current:** P1-02 handles repository drift, and decisions are durable.

**Missing:** an explicit rule for what must be revalidated when a high-centrality dependency changes.

**Example:**

If the ontology identity model changes, automatically require review of:

- world projection;
- context;
- routing;
- work;
- evidence;
- exit.

**Complexity:** 7/10.

---

### PG-12 — Program capacity / concurrency control

**Current:** workstreams have next actions, but there is no explicit rule limiting how many high-complexity destination efforts can be active simultaneously.

**Risk:** many XL workstreams open simultaneously, reducing actual throughput.

**Needed:** a simple WIP policy, e.g.:

```
1 current keystone BUILD
+
1 supporting integration
+
L-1 research only where it protects the next build
```

The exact limits should be tuned from observed cycle data.

**Complexity:** 3/10.

---

### PG-13 — Release / deprecation / migration policy

**Current:** evolution and rollback are architecturally present.

**Missing:** product-level rules for:

- when a capability version becomes deprecated;
- migration of user data/configuration;
- provider replacement;
- plugin compatibility;
- old composition handling.

**Risk:** the evolving system can preserve historical truth but still break the user's working environment.

**Complexity:** 8/10.

---

### PG-14 — User validation loop

**Current:** architecture has strong falsifiers; product discovery has largely been internal/repository-driven.

**Missing:** systematic evidence from real human use.

**Needed:**

```
prototype
→ real task
→ observed friction
→ evidence
→ product decision
→ implementation
→ re-test
```

This does not require a large formal research program. It requires at least a handful of representative user journeys once the shell is usable.

**Complexity:** 6/10.

---

### PG-15 — Operating model for “done”

**Current:** P1 has PROVEN / DONE / IMPLEMENTED / BLOCKED etc., but “done” means different things at architecture, product, and destination levels.

**Needed:** explicit state relationship:

```
IMPLEMENTED
≠ VERIFIED
≠ LIVE
≠ INTEGRATED
≠ PRODUCTIZED
≠ DESTINATION-GRADE
```

A milestone must declare which level it is claiming.

**Complexity:** 3/10.

---

## 4. Programmatic keystone controls

The highest-leverage management controls are:

| Control | Why it matters | Complexity |
|---|---|---:|
| **PG-1 Traceability** | prevents orphan requirements | 6 |
| **PG-3 Acceptance by maturity level** | prevents fake progress | 6 |
| **PG-4 Dual critical paths** | separates proof from product construction | 5 |
| **PG-5 Frontier intake** | controls unscoped territory | 5 |
| **PG-8 Evidence index** | keeps state trustworthy | 6 |
| **PG-9 Vertical-slice registry** | forces actual user-value convergence | 6 |
| **PG-10 Product readiness gate** | prevents engineering-green/release-green confusion | 8 |
| **PG-11 Impact revalidation** | protects high-centrality dependencies | 7 |
| **PG-13 Evolution/deprecation policy** | protects long-lived user state | 8 |

These are more important than adding another planning taxonomy.

---

## 5. What the program should NOT add

Do not create:

- another P1 portfolio;
- another project-management tracker;
- a separate architecture authority;
- a second evidence system;
- a parallel backlog for every destination concept;
- an “AI roadmap” disconnected from the product graph.

The program already has enough structure.

The missing step is to **connect the existing structure into a closed loop**.

---

## 6. Recommended next operating model

### Phase A — Close V0 truth

Keep the existing live-proof critical path:

```
P1-08
→ P1-06
→ P1-07
→ P1-09
```

Do not reopen mature architecture unless live evidence falsifies it.

### Phase B — Launch destination product controls

Before a large post-V0 implementation cycle, establish:

1. requirement/journey traceability;
2. dependency acceptance criteria;
3. vertical-slice registry;
4. L-1 research intake;
5. product readiness dimensions;
6. ownership for D1/D2.

### Phase C — Build one complete destination slice at a time

Move through:

```
V1  RUN MY VIVIM
↓
V2  BRING IN MY AI HISTORY
↓
V3  ACT ACROSS PROVIDERS
↓
V4  SURVIVE PROVIDER CHANGE
↓
V5  UNDERSTAND MY WORLD
↓
V6  EXTEND / EVOLVE VIVIM
```

Each outcome pulls multiple keystone dependencies upward together.

### Phase D — Use the frontier graph deliberately

While a vertical slice is being built:

- identify the highest-centrality L-1 frontier it depends on;
- research only that frontier;
- promote it to L0/L1 before implementation;
- record the resulting dependency edges;
- update the scorecard.

This prevents speculative architecture expansion.

---

## 7. The program's real bottleneck

The program is no longer primarily lacking architecture.

It is lacking **convergence discipline between architecture, product, and evidence**.

The central management problem is now:

> many things are individually plausible; how do we force them to become one demonstrated user-owned environment?

The answer is:

```
KEYSTONE DEPENDENCY
      +
VERTICAL SLICE
      +
OWNER
      +
ACCEPTANCE CRITERIA
      +
EVIDENCE
      =
PROGRAM PROGRESS
```

---

## 8. Desired future board

The program board should eventually show one compact row per keystone:

| Dependency | Current L | Target | Complexity | State | Blocking frontier | Active slice | Evidence | Owner |
|---|---:|---:|---:|---|---|---|---|---|

And one compact row per destination slice:

| Slice | User outcome | Dependencies | Current level | Next gate | State |
|---|---|---|---:|---|---|

That would be the single screen from which the program can be managed.

Everything else remains in source artifacts.

## 9. Bottom line

The architecture has been mapped.

The destination has been mapped.

The major missing program work is now **control of convergence**:

**requirements → dependencies → ownership → implementation level → vertical slice → evidence → release decision → next dependency.**

That is the program layer we were missing.

## 16. Evolution controls now have a destination research boundary

PG-11 (change impact / dependency revalidation) and PG-13 (release / deprecation / migration policy) are now explicitly consumed by the destination **Evolution, Reconciliation & Self-Maintenance** design.

The new lane does not add another program tracker. It supplies the semantic model needed to answer:

```
what changed?
what is affected?
what remains compatible?
what must be revalidated?
what can be automated?
what requires authority?
what can be rolled back?
what evidence survives the change?
```

Until those questions are researched and falsified, “self-evolving” remains an architectural destination claim rather than a production capability claim.
