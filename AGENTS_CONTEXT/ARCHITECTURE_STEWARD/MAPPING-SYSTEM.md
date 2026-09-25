# Mapping System

## The canonical map

The architecture map is the intersection of:

ARTIFACTS
+ CLAIMS
+ RESPONSIBILITIES
+ BOUNDARIES
+ IMPLEMENTATIONS
+ EVIDENCE
+ DEPENDENCIES
+ PRODUCT OUTCOMES
+ CHANGE STATE

## Mapping pipeline

For every incoming artifact:

1. IDENTIFY — record artifact, source, owner, date/ref.
2. CLASSIFY — authority/evidence/derived/proposal/history/unknown.
3. EXTRACT — claims, requirements, responsibilities, decisions, evidence, code references.
4. DECOMPOSE — split mixed concerns into canonical entities.
5. LOCATE — assign domain/system and documentation depth.
6. CONNECT — add typed dependency/ownership/evidence edges.
7. RECONCILE — compare with existing nodes and current authorities.
8. PROMOTE VIEW — update the appropriate current canonical document.
9. VALIDATE — check orphan nodes, unsupported claims, stale links and broken hierarchy.
10. RECORD — leave lineage/change information.

## Canonical representation rule

The Steward should prefer one shared node with multiple evidence refs over three copied descriptions of the same concept.

Example:

WRONG:
- Provider concept in System Intelligence;
- Provider concept in Product Vision;
- Provider concept in Core research;
- each with slightly different semantics.

RIGHT:
- one canonical Provider responsibility;
- source-specific evidence and views attached to it;
- each document remains allowed to explain the concept from its own perspective.

## View types

### Structural view

What exists and how it is divided.

### Dependency view

What requires/blocks/enables what.

### Evidence view

Why we believe a claim.

### Maturity view

What is characterized/proven/implemented/productized.

### Ownership view

Who defines meaning, owns data, enforces authority and maintains lifecycle.

### Change view

What changed, what is affected, what must be revalidated.

### Frontier view

What is known to matter but not yet adequately characterized.

## Minimum mapping record

```
id
entityType
name
canonicalMeaning
sourceRefs[]
ownerRefs[]
authorityRef[]
evidenceRefs[]
dependencyRefs[]
boundaryRefs[]
depth
maturity
lifecycle
freshness
openQuestions[]
lastReconciled
```

The exact machine-readable schema may evolve; the semantic fields should remain stable unless a deliberate model change occurs.
