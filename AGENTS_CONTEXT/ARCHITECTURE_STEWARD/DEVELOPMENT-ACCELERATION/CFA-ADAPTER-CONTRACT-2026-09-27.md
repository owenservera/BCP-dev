# CFA Adapter Contract — Development Acceleration Substrate
## 2026-09-27

> Status: PROPOSED — CFA-REFINABLE
> Purpose: define the narrow seam where domain intelligence enters the central development substrate.
> Authority: not Ω law and not a cross-CFA semantic ratification.

## 1. Principle

The central kernel knows how to carry, validate, index, retrieve and report.

A CFA adapter defines what its domain means.

## 2. Adapter inputs

Each adapter may provide:

### Vocabulary
Canonical seam terms, definitions, anti-definitions, evidence pointers and freshness.

### Subjects
Subject kinds, reference encoding rules, identity dimensions and allowed peer references.

### Seams
Inputs, outputs, prohibited crossings, invariants, falsifiers and open questions.

### Evidence
Authoritative source classes, implementation evidence, experiment/fixture evidence, historical evidence and relevance hints.

### Proof
Canonical fixtures, replay scenarios, domain invariants, proof-level requirements and failure/refusal cases.

### Decisions
Human/CFA decision gates and escalation conditions.

## 3. Adapter contract

CfaAdapter {
  cfaId: string
  version: string
  vocabulary: TermDefinition[]
  subjects: SubjectKindDefinition[]
  seams: SeamDefinition[]
  evidenceSources: EvidenceSourceDefinition[]
  falsifiers: FalsifierDefinition[]
  replayScenarios: ReplayScenarioDefinition[]
  proofRequirements: ProofRequirement[]
  decisionGates: DecisionGateDefinition[]
}

Lineage is mandatory for every definition.

## 4. Central validation

The kernel validates structure, unique IDs, lineage, enum values, reference shape, deterministic serialization, schema compatibility and no-clobber rules.

It does not validate the truth of a domain definition.

## 5. Domain validation

The adapter validates domain semantics, invariants, falsifier meaning, scenario expectations, accepted transformations, consequential behavior and owner decision conditions.

Domain validators may call central primitives. Central primitives do not invent domain meaning.

## 6. Reference rules

A typed reference must identify its semantic owner and state:

- what it identifies;
- whether it is stable across replacement;
- whether it is usable as a dependency;
- what evidence is required to resolve it.

No adapter may declare its identifier to be universal identity.

## 7. Proof rules

Each proof requirement states target, scenario/fixture, invariant, expected failure/refusal, evidence produced, proof level and environment.

A local targeted green cannot be upgraded to LIVE or PRODUCT by the adapter alone.

## 8. Initial payloads

CFA-01: World terms and falsifiers; World/Data, World/Semantic, World/Authority seams.

CFA-02: continuity reference roles and reconstruction constraints.

CFA-03: semantic trace and Intent evidence; Plan/Work gap preserved as UNKNOWN.

CFA-04: authority citation/result vocabulary and live re-resolution/refusal requirements.

CFA-05: Work/Plan/Attempt/Outcome semantics and recovery.

CFA-06: capability/provider/mediation/upstream/session/account/resource roles.

CFA-07: Composition identity/revision/Recipe/member and replacement-survivor semantics.

CFA-08: subject reference, projection, View, Layout, Interaction State and re-entry/write-back.

CFA-09: Change subject/state/lifecycle/history plus semantic delta/impact/compatibility.

CFA-10: K0 invariant rows, B1 cases, proof levels and containment constraints.

## 9. Acceptance

An adapter is accepted when its terms have owner/evidence metadata, references are explicit, seam invariants have falsifiers, evidence sources are named, unresolved questions remain visible, and no definition depends on a hidden central semantic assumption.

