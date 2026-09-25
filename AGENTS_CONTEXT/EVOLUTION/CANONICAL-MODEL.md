# Canonical Model — Evolution, Reconciliation & Self-Maintenance

## 1. Canonical subjects of change

A change proposal may target one or more canonical subjects:

- object type/schema;
- object instance/data;
- relationship/assertion;
- identity correspondence;
- plugin;
- capability/contract;
- realization;
- composition;
- configuration/policy;
- language/semantic contribution;
- surface/projection;
- Work/Plan definition;
- Product Instance;
- external-resource representation.

A proposal must name what is actually changing. “The system changed” is not a sufficient semantic unit.

## 2. Evolution record

Every governed evolution should be representable as a durable record containing at least:

```
changeId
subjectRefs
previousStateRefs
proposedStateRefs
requestedBy
causedBy
reason
changeClass
impactSet
compatibilityResult
authorityResult
testEvidence
verificationEvidence
promotionState
rollbackReference
createdAt
```

Exact storage namespace/contract remains a research item; this is not permission to create a second database.

## 3. Change classes

### Maintenance

Deterministic and bounded. No semantic invention.

### Evolution

Introduces or changes a capability/data/configuration/realization under explicit compatibility and authority rules.

### Constitutional amendment

Changes an invariant that governs other changes.

This must have a separate authority path and must not be ordinary Forge output.

## 4. State machine

```
OBSERVED
  ↓
CHARACTERIZED
  ↓
PROPOSED
  ↓
IMPACTED
  ↓
COMPATIBILITY-CHECKED
  ↓
AUTHORIZED
  ↓
APPLIED
  ↓
VERIFIED
  ↓
PROMOTED / ACTIVE

Any applicable stage may instead lead to:
REFUSED
BLOCKED
QUARANTINED
ROLLED-BACK
RETIRED
```

“Applied” does not imply “trusted”.
“Verified” does not imply “compatible”.
“Compatible” does not imply “authorized”.

## 5. Version semantics

Versions are identifiers, not trust labels.

Trust/state must remain separately represented:

```
candidate ≠ tested ≠ verified ≠ compatible ≠ promoted ≠ active
```

Historical versions remain addressable where required for continuity, audit, replay, and rollback.

## 6. Identity continuity

When a change affects identity, VIVIM must distinguish:

```
same canonical object, new revision
        vs
new canonical object, related to old object
        vs
external entity now corresponded to local object
        vs
two prior objects reconciled as one semantic identity
```

No data migration may silently collapse these cases.

## 7. Relationship continuity

Relationships are first-class evolving facts.

Their evolution must preserve:

- subject/object identity references;
- assertion provenance;
- time/version context;
- supersession;
- contradiction/conflict where present.

The research task must explicitly solve relationship evolution rather than only record-schema migration.

## 8. Derived state

Projections, caches, indexes, self-knowledge portraits, and surfaces remain reconstructible from canonical state.

Maintenance may destroy and rebuild these when semantics are preserved.

A projection failure must not require mutating canonical truth merely to recover the UI.
