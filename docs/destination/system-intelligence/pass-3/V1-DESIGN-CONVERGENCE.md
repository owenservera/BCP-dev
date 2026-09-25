# V1 Design Convergence

> Classification: DERIVED — CURRENT DESIGN CANDIDATES
> Status: convergence baseline; implementation authority remains external to this pass.

## 1. The coupled systems that must be designed first

### Keystone K1 — External identity/resource chain
```
Provider
  ↓
Account
  ↓
Session
  ↓
Browser Resource
  ↓
External Provider Identity
```

This must be explicit before broad provider routing or agent execution. Otherwise VIVIM can succeed while acting through the wrong account or wrong browser target.

**Status:** DESIGN-CANDIDATE + EXPERIMENT-REQUIRED.

### Keystone K2 — Canonical world object lifecycle
```
CREATE → IDENTIFY → RELATE → MODIFY → VERSION
       → DERIVE → PROJECT → REFERENCE
       → EXPORT → RESTORE → ARCHIVE/DELETE
```

Without this, surfaces and work have nowhere stable to attach.

**Status:** DESIGN-CANDIDATE.

### Keystone K3 — Durable Work
```
request → Work identity → plan → execution → outcome → evidence → continuity
```

Intent and execution state already exist but are not yet the durable product-level outcome object.

**Status:** DESIGN-CANDIDATE.

### Keystone K4 — Provider Knowledge View
```
manifests + discovery + observations + mappings + parser pins + realizations + evidence
                       ↓
              current knowledge view
```

This must be a derived aggregation with explicit freshness, not a second authority database.

**Status:** DESIGN-CANDIDATE.

### Keystone K5 — Self-Knowledge Freshness
```
canonical source revisions / contract versions
             ↓
        basis digest
             ↓
      current or stale view
```

This prevents “self-description” from being mistaken for current truth.

**Status:** DESIGN-CANDIDATE.

## 2. What must be experimentally proven

The following cannot be closed through documentation alone:
- exact provider-account identity verification;
- Chrome profile/process/target ownership;
- concurrent account/resource isolation;
- session expiry/reconnect;
- browser process restart recovery;
- behavior of a materially different provider;
- durable work recovery across process restart;
- world/surface reconstruction;
- external provider drift/healing.

**Status:** EXPERIMENT-REQUIRED.

## 3. Legacy behavioral floor for V1

The following behavior families are the minimum meaningful floor because the Legacy mine supplies concrete evidence and they materially shape the destination experience:

1. **Account-aware provider use** — provider accounts are distinct and selectable; execution reaches the intended account.
2. **Profile/resource isolation** — one provider account is not silently executed through another account's browser context.
3. **Conversation continuity** — conversations/messages/history/stream state remain usable after the active browser session changes.
4. **Project/workspace/canvas organization** — user-visible work can be grouped and resumed without rebuilding the structure manually.
5. **Background/long-running continuity** — work can continue, stall or fail with inspectable state.
6. **Export/backup/recovery** — durable state can be reconstructed without depending on replaceable runtime binaries.
7. **Discovery/healing evidence loop** — provider changes can be detected and tested through evidence before promotion.

Not part of the V1 floor solely because Legacy contains them:
- stealth/anti-detection;
- arbitrary telemetry;
- historical P2P/tunnel features;
- old admin/config UI;
- provider-specific monolithic engine structure;
- broad AI API realization when V1 is Chrome-only.

## 4. What can evolve automatically

**PROMOTION-CANDIDATE** for bounded, non-authoritative evolution:
- regenerate derived world/self-knowledge views;
- recompute freshness;
- assemble provider knowledge from source evidence;
- produce routing rankings from observed performance;
- detect provider drift;
- diagnose likely repair targets;
- generate repair/plugin proposals;
- regenerate surfaces/layout projections;
- continue already authorized deterministic/read work under its work contract.

Automatic evolution must not silently:
- change user routing policy;
- change authority;
- promote a new provider realization;
- widen disclosure;
- change a canonical identity;
- replace a contract/core semantic.

## 5. What requires human approval

**EVIDENCE-SUPPORTED boundary:**
- connect/disconnect an external account;
- allow a new external mutation path;
- select/override provider/account/model where standing policy does not determine it;
- accept a generated provider repair that changes external behavior materially;
- promote a generated plugin/composition;
- approve new fallback behavior crossing provider/account boundaries;
- approve generated data migrations that alter canonical meaning;
- widen disclosure/authority scopes.

## 6. What requires developer/core changes

**EVIDENCE-SUPPORTED:**
- new host operations;
- new authority primitives/law;
- new semantic protocol that no existing contract can express;
- canonical identity-rule changes;
- new product-wide lifecycle semantics;
- changes that violate or amend frozen host/Recipe/contract constraints.

These require ordinary repository/decision/gate processes. Forge cannot self-authorize them.

## 7. Smallest design + experiment set

### Design packet D1 — Account/Session/Browser/Routing
Defines:
- Account identity and provider relationship;
- Session binding;
- Browser Resource ownership;
- route policy precedence;
- selection decision evidence.

### Design packet D2 — Canonical Object/Lifecycle
Defines:
- object envelope;
- Message/Artifact/Document/File semantics;
- relationship authority;
- revision/archive/export/restore behavior.

### Design packet D3 — Durable Work
Defines:
- Work identity;
- checkpoint;
- attempt/plan linkage;
- outcome;
- evidence;
- restart behavior.

### Design packet D4 — Provider Knowledge/Freshness
Defines:
- derived knowledge aggregation;
- basis/freshness;
- canonical vs provider extension boundary;
- drift/recovery evidence.

### Design packet D5 — Self-Knowledge
Defines:
- basis references/digest;
- invalidation;
- recomputation;
- stale/conflicted rendering.

### Experiment set E1–E4
1. real account → session → intended resource → governed effect;
2. two-account isolation;
3. concurrent resource work;
4. expiry/restart/recovery.

This is the minimum set that resolves the highest-risk external coupling.

## 8. Implementation unlock after E1–E4

Once E1–E4 are green or their failure yields a bounded redesign:

1. implement canonical Account representation;
2. implement resource/session binding;
3. implement policy-backed routing selection;
4. implement durable Work;
5. implement generic object envelope/relationships;
6. integrate world/surface projections;
7. add ProviderKnowledgeView;
8. wire freshness checks into self-knowledge;
9. run E5 third-provider falsifier;
10. only then promote provider generality beyond the first realization family.

## 9. Design convergence rule

No local subsystem may be optimized at the expense of the chain.

Examples:
- provider abstraction cannot weaken provider identity;
- vault flexibility cannot eliminate semantic object identity;
- browser efficiency cannot weaken account isolation;
- learned routing cannot replace user policy;
- Forge automation cannot replace authority;
- UI richness cannot make the canvas canonical;
- Legacy parity cannot justify reproducing historical architectural coupling.

**Conclusion: PROMOTION-CANDIDATE** — this coupled ordering is sufficiently bounded to guide the next implementation wave, subject to E1–E4 results.
