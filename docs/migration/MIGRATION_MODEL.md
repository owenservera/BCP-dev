# BCP Migration Model — ontology, state machine, pipelines (Prompt 2, §§5–13)

> Status: PROPOSED minimal model, derived from MIG-001's trace + designed to
> be tested by MIG-002. Promote to BCP-enforced only after #2 passes unchanged
> or with recorded amendments. Reuses BCP concepts (capabilities, deps,
> leases, experiments, events, discoveries) — adds only what migration needs.

## B. Ontology (persistent concepts; smallest set that reasons explicitly)

```text
Migration            — one VIVIM→Ω traversal (id MIG-NNN-slug; see index.json)
SourceCapability     — named legacy behavior + pinned source_locations (hashes)
Observation          — claim + confidence {PROVEN,OBSERVED,STRONGLY_INFERRED,
                       WEAKLY_INFERRED,UNKNOWN} + source (never promote silently)
BehaviorSpec         — inputs/behavior/invariants/failures/side-effects/unknowns,
                       implementation-independent
Canonicality         — verdict {PRESERVE,TRANSFORM,REIMPLEMENT,REPLACE,
                       DEPRECATE,DISCARD,UNKNOWN} + rationale + decided_by
OmegaMapping         — source behavior → contract_op + plugin; preserved /
                       changed / unresolved semantics; new/removed dependencies
VerificationPlan     — named checks V-n with expected result
VerificationResult   — verdict {IDENTICAL,SEMANTICALLY_EQUIVALENT,
                       INTENTIONALLY_TRANSFORMED,INTENTIONALLY_REMOVED,
                       UNKNOWN,UNVERIFIED} + detail
ProofLadder          — {static, integration, live, regression} each PROVEN or
                       UNVERIFIED-with-unblock (fixture must never read "live")
MigrationEvidence    — assay + spec + mapping + record + verification-report +
                       BCP discovery refs + proof ladder
Disposition          — {Preserved,Transformed,Reimplemented,
                       IntentionallyDiscarded,Unresolved,Blocked}
SharedLeg            — already-assayed subsystem cited by record-ref instead of
                       re-pinning (e.g. MIG-002 cites MIG-001's Governor/CDP,
                       stream-parser-chain, conversation-lifecycle legs)
```

No new BCP state tables yet. Records live as JSON under
`bcp-speed/bcp/migration/MIG-NNN-*/` conforming to
`migration-record.schema.json`; the registry is `bcp-speed/bcp/migration/index.json`
(id → status → record path). State-table promotion (`state/migrations.yaml`,
sweep guards) waits for post-#2 evidence per 00-AUDIT-AND-EVALUATION plan.

## C. State machine (lifecycle with gates)

```text
DISCOVERED → ASSAYING → ASSESSED → SPECIFIED → MAPPED → READY_TO_IMPLEMENT
  → IMPLEMENTING → IMPLEMENTED → VERIFYING → VERIFIED → INTEGRATED
  ↘ BLOCKED / UNRESOLVED / REJECTED / DISCARDED (from any state, with reason)
```

| Transition | Entry condition | Exit condition (gate) | Required artifacts | Evidence |
|---|---|---|---|---|
| DISCOVERED→ASSAYING | source capability named | assay started | source_locations pinned w/ hashes | record skeleton |
| ASSAYING→ASSESSED | assay complete | every claim confidence-tagged; ≥1 UNKNOWN or explicit "no unknowns" + why | assay doc | observations[] |
| ASSESSED→SPECIFIED | behavior drafted | invariants + failures + unknowns written, implementation-free | behavior-spec | spec ref in record |
| SPECIFIED→MAPPED | canonicality decided | verdict + rationale + decided_by (human-confirm if OBSOLETE/DEPRECATE) | canonicality | record field |
| MAPPED→READY | Ω target chosen | contract_op resolves to real contract file; new-contracts justified or empty | omega-mapping | mapping json |
| READY→IMPLEMENTING | lease acquired (existing BCP lease machinery = task vehicle) | semantic payload attached (contract/invariants/tests refs) | implementation plan | lease + log event |
| IMPLEMENTING→IMPLEMENTED | additive change only (0 core edits unless justified) | no monolith import (V-4); no Ω law weakened | files + BCP discoveries via tool | diff + log |
| IMPLEMENTED→VERIFYING | verification plan exists | independent actor (not the builder) re-runs checks | verification-report | report doc |
| VERIFYING→VERIFIED | all deterministic checks green | proof ladder honest (V-5); verdict recorded | ladder + verdict | checker output |
| VERIFIED→INTEGRATED | human approval (commit / merge decision) | artifacts committed; disposition set; graph updated | commit SHA | git log |

Failure handling: BLOCKED carries blocking-dep + unblock procedure; UNRESOLVED
carries the question + what evidence would resolve it; silent disappearance is
a migration failure (a discarded behavior without rationale fails verification).

## D. Assay pipeline (legacy implementation → behavioral knowledge)
1. Pin sources (path + line count + sha256). 2. Extract entry points, inputs,
outputs, side effects, error behavior, state changes, tests. 3. Tag every
claim OBSERVED / INFERRED / DOCUMENTED / ASSUMED / UNKNOWN. 4. List invariants
with confidence. 5. Cite SharedLegs by record-ref where a prior migration
already assayed the subsystem (MIG-002 does this for 4 legs). 6. Emit assay
doc + observations[] — never promote inference to fact (V-6 enforces).

## E. Ω translation pipeline (semantic behavior → Ω-native contract)
1. Name the semantic requirement (not the file). 2. Resolve to existing
contract_op (V-2 checks); new contract only with justification + dependency +
law analysis. 3. Record preserved / changed / unresolved semantics explicitly.
4. Mechanism must be one-way adapter (data/contract, never monolith import —
V-4 refuses). 5. Attach parser-pin / session / realization deps actually
required by the bars the turn passes.

## F. Verification pipeline (semantic preservation, independently established)
Deterministic checks (checker, re-runnable by anyone): V-1 schema · V-2
contract resolution · V-4 monolith refusal · V-5 ladder honesty · V-6 UNKNOWN
discipline · V-3 informative scan. Human/agent judgments (with provenance):
verdict, canonicality, mapping, risk. Live proof requires an independent
witness + trace + parser log; fixture proof must be labeled fixture. Implementer
never self-certifies (builder ≠ verifier, separate shells).
