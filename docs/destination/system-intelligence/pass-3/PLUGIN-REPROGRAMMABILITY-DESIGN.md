# Pass 3 — Plugin / Reprogrammability Design

> Classification: DERIVED — DESIGN CANDIDATES
> Status: extends existing Ω composition/Forge boundaries; no runtime law changes.

## 1. Runtime graph

The relevant graph is not the import graph.

```
Plugin
  ↓
Manifest / Contract
  ↓
Composition / Recipe
  ↓
Dependency grants
  ↓
Port calls
  ↓
State / Vault
  ↓
Events / Evidence
  ↓
Authority / Ledger
```

A plugin is replaceable only within the semantics of the contract and composition that admit it.

## 2. Shared vs bespoke

| Concern | Shared | Bespoke |
|---|---|---|
| canonical identity envelope | YES | no |
| evidence refs | YES | provider/source-specific evidence inside |
| capability semantics | YES | extension details |
| routing policy | YES | provider ranking inputs |
| realization lifecycle | YES | provider realization internals |
| parser contract/pinning | YES | parser implementation |
| browser resource lifecycle | shared substrate | provider-specific target details |
| surface projection | shared surface contract | surface layout |
| healing lifecycle | shared lifecycle | provider-specific diagnosis/repair |
| self-knowledge freshness | YES | source-specific basis collection |
| authority/law | existing shared Ω | never provider-owned |
| provider selectors / DOM | no | YES |
| provider stream decoder | no | YES |
| provider auth observations | no | YES |

## 3. Reprogrammability test

A change is plugin-extensible when:
- the semantic capability already exists;
- the contract can express inputs/outputs;
- authority is already expressible;
- durable state can use existing object/evidence primitives;
- no new host operation is needed.

Examples:
- new provider realization for an existing capability — plugin/realization work;
- new parser implementation under the pinned parser contract — plugin work;
- new surface using existing data/surface contract — plugin/surface work;
- new routing rule using existing policy semantics — configuration/data.

A change requires contract/runtime/data-model work when:
- it introduces a new semantic capability family;
- it needs new lifecycle semantics;
- it introduces a canonical identity relationship not representable today;
- it needs new cross-plugin ports;
- it needs a new authoritative persistent namespace with a new law.

A change requires core/developer work when:
- it needs a new host operation;
- it changes Recipe authority;
- it changes B-law/authority semantics;
- it changes frozen contract/export surfaces in a governed way.

## 4. Forge authority boundary

Forge can:
- inspect;
- compose candidate artifacts;
- generate proposals;
- run tests/simulations in bounded lanes;
- compare evidence;
- produce a promotion candidate.

Forge cannot by itself:
- grant a capability token;
- sign/approve a Recipe;
- promote an external mutation realization;
- create a new authority path;
- silently rewrite canonical identity;
- ratify Ω law.

## 5. Product evolution classes

### Automatic
- derived views;
- freshness recomputation;
- provider knowledge assembly;
- drift detection;
- repair proposals;
- safe read-only work within standing policy;
- layout/projection regeneration;
- candidate ranking.

### Human-approved
- external account connection;
- policy changes;
- external mutation activation;
- generated plugin/composition acceptance;
- realization promotion;
- new provider fallback across account boundaries;
- data migrations changing canonical meaning.

### Developer/core
- new semantic contracts;
- new authority primitives;
- new host operations;
- new canonical identity/lifecycle rules;
- Ω law changes.

## 6. Rejected designs

**REJECTED:** “everything self-programs itself.”
Reason: current Forge is intentionally proposal-only and Ω authority is separate.

**REJECTED:** “every repeated module is a plugin.”
Reason: reuse and replacement are not the same semantic boundary.

**REJECTED:** “new provider means new core code path.”
Reason: the existing realization model explicitly targets multiple implementations.

**Conclusion: PROMOTION-CANDIDATE** for contract-relative extensibility; provider-generalization remains EXPERIMENT-REQUIRED.
