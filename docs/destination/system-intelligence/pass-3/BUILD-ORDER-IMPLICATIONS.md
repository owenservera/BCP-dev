# Pass 3 — Build Order Implications

> Classification: DERIVED — BUILD ORDER FROM CHARACTERIZATION
> Status: research/design complete enough to guide next implementation sequencing.

## 1. Required progression

```
ARCHITECTURE
  ↓
CHARACTERIZATION
  ↓
DESIGN
  ↓
EXPERIMENT
  ↓
PROOF
  ↓
IMPLEMENTATION
```

## 2. Order

### Step 0 — Protect proven foundation
Do not redesign:
- vault;
- law;
- Recipe/runtime;
- provider realization lifecycle;
- canonical intent;
- Forge authority boundary.

### Step 1 — Account/Session/Browser/Routing design
Finish D1 semantics before broad route or account implementation.

**Gate:** no unresolved meaning for Account vs Session vs Resource.

### Step 2 — E1–E4 external substrate experiments
Use the existing provider-browser leg as the test harness.

**Gate:** identity, isolation, concurrency and recovery are bounded.

### Step 3 — Canonical object + relationship + lifecycle design
Define D2 including Message/Artifact/Document/File.

**Gate:** E6 design package can be executed without inventing a second storage model.

### Step 4 — Durable Work design
Define identity, checkpoints, attempt semantics, recovery and evidence.

**Gate:** E7 can distinguish interrupted work from repeated side effects.

### Step 5 — Provider Knowledge / Self-Knowledge design
Define D4/D5:
- derived provider knowledge;
- freshness basis;
- invalidation/recompute.

**Gate:** E8 has a crisp falsifier.

### Step 6 — Minimum bridge implementation
Implement only the smallest contracts needed:
- Account representation;
- Session ↔ Account relation;
- Browser Resource manager;
- policy-backed routing;
- Durable Work;
- common object envelope;
- basis-aware derived views.

Do not add broad provider abstractions beyond demonstrated need.

### Step 7 — World/Surface integration
Connect canonical objects and Work to surfaces/layout/project/workspace behavior.

### Step 8 — Third-provider falsifier E5
Use a materially different provider before calling the abstraction general.

### Step 9 — Legacy parity integration
Bring in the seven behavioral floor families as end-to-end journeys.

### Step 10 — Product-instance/productization
Assemble the complete first-run/restart/export/recovery user loop.

## 3. Parallelization

While E1–E4 are blocked on owner-machine access, implementation may proceed on:
- local canonical object envelopes;
- relationship semantics;
- Work data model;
- self-knowledge basis computation;
- ProviderKnowledgeView pure assembly.

Do not claim live-provider maturity until E1–E4 are run.

## 4. Anti-churn rule

Any implementation that changes a boundary should cite:
- the Pass 3 design artifact;
- the relevant experiment;
- the failing/green acceptance criterion;
- whether the change promotes, narrows, or rejects the candidate.

This keeps fast implementation from becoming untracked architecture.

**Conclusion: PROMOTION-CANDIDATE.**
