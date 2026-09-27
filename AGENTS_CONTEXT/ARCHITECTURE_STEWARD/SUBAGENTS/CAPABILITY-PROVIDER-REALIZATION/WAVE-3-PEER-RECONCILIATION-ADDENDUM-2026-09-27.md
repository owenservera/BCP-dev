# CFA-06 — Wave 3 Peer Reconciliation Addendum

> Date: 2026-09-27
> CFA: CFA-06 — Capability / Provider / Realization
> agent_id: `capability-provider-realization`
> Status: **WAVE-3 COMPLETE — BOUNDED PEER RECONCILIATION RECORDED**
> Classification: reconciliation evidence; not Ω law; not a production contract; shared boundaries remain unactivated.

## 1. Scope and execution basis

This turn executes only the CFA-06 row of the Wave-3 queue:

- Q06-05 — Work attribution / external-effect evidence;
- Q06-02 — durable Account / Session / Realization / Resource joins;
- Q06-04 — routing / Authority boundary;
- Q06-07 — Capability / Composition membership and replacement;
- Q06-09 — provider healing / generic Evolution.

The deterministic router was recomputed from current `main`.

Predecessor receipt verified:
`AGENTS_CONTEXT/ARCHITECTURE_STEWARD/SUBAGENTS/AGENCY-WORK-EXECUTION/WAVE-3-PEER-RECONCILIATION-ADDENDUM-2026-09-27.md`

CFA-06 receipt was absent before authoring this document.

No production implementation, shared-boundary activation, Ω-law amendment or Graph attachment is performed.

## 2. Q06-05 — CFA-05: Work attribution / external-effect evidence

### Peer answer

CFA-05's current Wave-3 addendum explicitly proposes:

**Work → CFA-06**
`workId + attemptId + effectIdentity + targetRef + realizationRef/sessionRef + invocation context`

**CFA-06 → CFA-05**
`effectStatus ∈ {APPLIED, NOT_APPLIED, PENDING, UNKNOWN}`
plus:
`evidenceRefs + observedAt + realization/provider context + reconciliation basis`

CFA-05 also explicitly keeps Work/Attempt lifecycle and Outcome semantics with CFA-05 while CFA-06 retains realization-specific evidence meaning.

### CFA-06 response

Accepted as the minimum bounded semantic corridor.

CFA-06 owns interpretation of provider/realization-specific evidence; CFA-05 owns the Work-level consequence. A provider observation may establish evidence about an external effect, but does not itself become the Work Outcome.

### Classification

**RECONCILED**

The exact external-effect query/evidence mechanism remains corridor-specific and is not frozen here.

### Handoff

`Work/Attempt/effect context → realization evidence query → typed effect status + evidence refs → Work reconciliation`

### Falsifiers

- runtime success alone is treated as proof of external effect;
- a provider-specific observation silently becomes canonical Work Outcome;
- uncertain external effect is forced into success/failure without evidence.

## 3. Q06-02 — CFA-02: durable Account / Session / Realization / Resource joins

### Peer answer

CFA-02 explicitly assigns:

- semantic meaning of Account / Session / Resource and realization concepts to CFA-06;
- durable persistence, record identity, revisions, lineage and reconstruction to CFA-02.

CFA-02's working evidence supports typed reference mappings rather than a second identity system. Its current posture is that durable representations carry record/revision/lineage continuity, while semantic meaning remains with the domain owner.

### CFA-06 response

Accepted minimum seam:

`CapabilityRef → RealizationRef → ProviderRef`
with optional typed:
`AccountRef → ModelRef → SessionRef → ResourceRef`

Durable carriage is by CFA-02-owned records/revisions/relations; CFA-06 does not create a competing identity or persistence store.

Mandatory continuity dimensions for this seam are:
- attributable identity/reference;
- revision where the durable record can change;
- lineage sufficient to reconstruct replacement/reassociation;
- source/provenance/evidence linkage where required by the corridor.

### Classification

**RECONCILED**

Exact physical storage, join shape and mandatory field/cardinality matrix remain **UNKNOWN** and stay CFA-02-owned.

### Handoff

CFA-06 provides semantic reference requirements and relationship meaning; CFA-02 provides durable record handles, revision/lineage and reconstruction guarantees.

### Falsifiers

- Account/Session/Realization continuity requires a second identity store;
- provider or session replacement silently rewrites durable semantic identity;
- reconstruction depends on process-local state not represented by durable continuity.

## 4. Q06-04 — CFA-04: routing / Authority boundary

### Peer answer

CFA-04's current reconciliation explicitly separates the semantic request from live authorization and accepts capability/operation, target, intent/plan and relevant context as authorization inputs.

CFA-04 retains exclusive ownership of permission, consent, standing, delegation, scope, expiry, revocation and live authorization state.

CFA-06's aligned boundary retains routing/selection semantics and explicitly states that routing cannot authorize.

### CFA-06 response

Accepted bounded handoff:

CFA-06 exposes the selected candidate/route context necessary for Authority evaluation, including as applicable:
`capabilityRef + operationRef + targetRef(s) + realization/provider/account/model/session context + routing basis`

CFA-04 returns the live authorization verdict. CFA-06 must not persist or reinterpret that verdict as routing truth.

When provider/account/session state is stale, unavailable or unresolved:
- routing availability may become **UNKNOWN**;
- candidate validity may become **UNKNOWN**;
- authorization is **not** inferred from routing state;
- a consequential gate requires the current Authority result where the governing contract requires re-resolution.

### Classification

**RECONCILED**

Exact stale-state taxonomy and physical route-context envelope remain **UNKNOWN**.

### Falsifiers

- a selected route is treated as permission;
- historical authorization is reused as current permission without required re-resolution;
- stale provider/account state is treated as proof of authorization or refusal.

## 5. Q06-07 — CFA-07: Capability / Composition membership and replacement

### Peer answer

CFA-07 explicitly keeps:
- Capability meaning and realization semantics with CFA-06;
- composition identity/membership/assembly with CFA-07.

Its boundary preserves:
`membership != permission`
and:
`provider/realization replacement does not automatically create a new Capability or Composition identity`.

CFA-07's baseline also identifies the exact capability-to-composition representation as an unresolved physical/detail question.

### CFA-06 response

Accepted minimum semantic membership reference:

`capabilityRef + realizationRef`

with optional provider/model/session context where composition semantics require it.

A realization replacement may change the composition member's realization/implementation lineage while preserving Capability meaning. A composition may retain its logical identity when the replacement is genuinely a replacement rather than semantic creation.

### Classification

**RECONCILED**

Exact membership envelope, durable composition-reference shape and survivor field set remain **UNKNOWN**.

### Handoff

CFA-06 supplies capability/realization meaning and validity context; CFA-07 records membership, assembly and composition-side replacement lineage.

### Falsifiers

- composition membership defines or changes Capability meaning;
- membership is interpreted as permission;
- every realization replacement forces a new Capability identity without semantic evidence.

## 6. Q06-09 — CFA-09: provider healing / generic Evolution

### Peer answer

CFA-09 explicitly assigns to CFA-06 provider-specific:
- discovery;
- protocol/parser/selector/op-map knowledge;
- realization health;
- drift characterization;
- rediscovery;
- realization-specific repair and replacement-candidate generation.

CFA-09 owns the broader consequences when the repair becomes a system change:
- generic compatibility;
- cross-domain impact;
- migration;
- replacement lifecycle;
- rollback/recovery;
- safe self-maintenance governance.

### CFA-06 response

Accepted transition rule:

**Provider-specific repair remains CFA-06-owned while its meaning and impact remain bounded to the provider/realization corridor.**

It crosses into a generic Change when evidence shows broader governed consequences, such as:
- cross-domain compatibility impact;
- migration requirement;
- composition/Work/data continuity impact;
- replacement lifecycle requiring generic promotion/rollback/quarantine;
- system-wide self-maintenance implications.

Evidence handed to CFA-09 should minimally preserve:
`repair/change subject + evidence refs + observed drift/failure + affected realization(s) + compatibility impact + replacement lineage + verification state`

### Classification

**RECONCILED**

The exact quantitative threshold for “broader governed change” and final Change envelope remain **UNKNOWN**.

### Falsifiers

- every provider repair automatically becomes global Evolution;
- a provider repair with cross-domain impact remains invisible to Evolution;
- provider-specific repair bypasses compatibility, promotion, rollback or authority/runtime requirements.

## 7. Cross-seam result

| Seam | Classification | Residual UNKNOWN |
|---|---|---|
| Q06-05 CFA-05 | **RECONCILED** | provider-specific evidence mechanism / effect query contract |
| Q06-02 CFA-02 | **RECONCILED** | exact durable storage/join/cardinality |
| Q06-04 CFA-04 | **RECONCILED** | exact stale-state taxonomy / physical route context |
| Q06-07 CFA-07 | **RECONCILED** | exact membership envelope / survivor fields |
| Q06-09 CFA-09 | **RECONCILED** | exact Change threshold / final Change envelope |

**CONFLICTED:** none identified.

The reconciliation closes the bounded semantic handoffs without pretending that physical schemas, live provider proof, or runtime mechanisms are already proven.

## 8. Preserved invariants

- **Routing ≠ Authorization**
- **Capability ≠ Permission**
- **Provider ≠ Account ≠ Session ≠ Resource**
- **Realization evidence ≠ Work Outcome**
- **Provider-specific repair ≠ generic Evolution**
- **Candidate ≠ Admitted ≠ Active**
- **Evidence ≠ Authority**
- **Unknown ≠ Failure**
- realization/provider/session replacement does not by itself redefine semantic Capability identity;
- CFA-02 durable continuity does not become a second semantic identity system;
- CFA-06 does not become an Authority evaluator or Work executor.

## 9. Deferred items

- exact physical data joins and storage envelopes;
- live authenticated provider/account/routing proof;
- provider-specific external-effect query coverage;
- multi-step/batched authority semantics;
- exact generic Change thresholds and envelopes;
- active Work replacement experiments;
- K0 implementation/reduction;
- shared-boundary activation;
- Ω-law changes;
- Graph attachment.

## 10. Final Wave-3 result

**SESSION_STATUS: COMPLETE**

CFA-06 has completed its ordered Wave-3 peer reconciliation.

All five bounded seams classify as **RECONCILED** at the semantic handoff level, with explicit residual UNKNOWNs for representation, live proof and implementation-specific details.

The resulting corridor is:

`Capability
→ valid realization candidate(s)
→ Provider / Account / Model / Session / Resource context
→ routing selection
→ live Authority gate
→ Work / execution
→ realization-specific effect evidence
→ Work reconciliation / Outcome`

No shared boundary is activated by this addendum.

No production implementation is authorized by this addendum.

No Ω law is changed.

No Graph work is performed.

**WAVE-3 STOP CONDITION SATISFIED.**
