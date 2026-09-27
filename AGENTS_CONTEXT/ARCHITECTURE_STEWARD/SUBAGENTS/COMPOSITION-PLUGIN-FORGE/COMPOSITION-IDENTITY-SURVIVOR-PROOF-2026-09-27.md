# CFA-07 — Composition Identity + Replacement Survivor Proof Pack
## 2026-09-27

> **Status:** DESIGN / EVIDENCE CLOSURE — no production implementation
> **CFA:** CFA-07 — Composition / Plugin / Forge
> **agent_id:** `composition-plugin-forge`
> **Purpose:** Close the first bounded M1 contract/evidence question: the smallest semantic Composition identity and falsifiable survivor properties across valid plugin/realization replacement.
> **Authority:** CFA-local evidence artifact; not Ω law, not a new canonical store, and not a peer-semantic decision.
>
> Evidence is classified as `OBSERVED | DERIVED | PROPOSED | UNKNOWN | CONFLICTED`. Freshness is tracked separately.

## 1. Strategic question

Can VIVIM identify a composition independently of its plugin implementations, current Recipe bytes, display name, or one concrete realization, while preserving enough lineage to determine whether a later replacement is:

- the same semantic composition with a changed implementation/realization;
- a new revision of the same composition;
- or a materially different composition whose identity continuity requires further adjudication?

The answer must not create a second ontology, data store, authority system, or runtime admission path.

## 2. Current repository evidence

### OBSERVED / CURRENT — CompositionSpec

Current `CompositionSpec` is:

`{ name, entries[] }`

with each entry carrying:

`{ id, source, bootPhase, grant{capabilities, contracts}, config? }`

Source: `omega-baseline/omega-final/contracts/src/recipe.ts` and `sdk/src/schema.ts`.

Interpretation:
- `name` is currently required and appears to identify the composition in human-authored/generated files.
- There is no separate explicit `compositionId` field in the current CompositionSpec contract.
- Entry `id` identifies a plugin/member, not the composition.

### OBSERVED / CURRENT — Recipe

Current `Recipe` is:

`{ recipeVersion, hashAlgo, name, composition[], rootOfTrust, signature }`

Each Recipe entry carries:

`{ id, version, source, manifestPath, manifestHash, contentHash, grant, bootPhase, config? }`

Interpretation:
- Recipe `name` is retained from the composition and the Recipe is the grant-bearing signed representation.
- `manifestHash` and `contentHash` identify member artifacts/content at a particular admitted state.
- Recipe signature proves the signed representation/grant; it is not evidence that the logical composition identity should change.

### OBSERVED / CURRENT — Matrix/generator

`compositions/_matrix.json` currently has 18 composition entries keyed by name:

`agent, browser, chat, console, credentials, demo, discovery, discovery-mind, email, forge-author, healing, kernel, law, llm, notes, run, spine, vault`.

The generator emits `<name>.json` from the matrix and provides a byte-identity drift falsifier.

Interpretation:
- Matrix key, filename and `name` are currently coupled representation identifiers.
- This coupling is useful for deterministic generation but is not, by itself, proof of semantic identity semantics.

### OBSERVED / CURRENT — composition scan

`plugins/vivim-law/src/compose-scan.ts` defines:

`compositionRefOf(manifest)`

which returns the manifest's `name` when present, otherwise `"unnamed"`.

The scan ledger then stores:

`{ kind:"compose.scan@1", compositionRef, manifestHash, findings[], verdict, scannedAt }`.

Interpretation:
- Current security/evidence infrastructure treats composition **name** as the composition reference.
- That is a current implementation fact, not proof that name is the correct durable semantic identity.
- Rename continuity is therefore currently **under-specified**.

### OBSERVED / CURRENT — K0 boundary

The current K0 proof model places Recipe admission, Manifest integrity, isolation/Port and capability enforcement in the runtime substrate.

Interpretation:
- Composition identity should remain a K1/domain semantic concern.
- K0 needs the information required to safely admit a composition; it does not need to own composition meaning.

### OBSERVED / CURRENT — Capability/realization peer evidence

CFA-06 states:

`Capability identity → selection history → old realization → new realization → same Account / canonical data where applicable → continuous evidence / lineage`.

CFA-06 explicitly says a realization can be replaced without changing semantic Capability identity.

Interpretation:
- Member/realization replacement is not automatically a semantic capability change.
- CFA-07 can therefore model composition-side replacement lineage without redefining capability meaning.

### OBSERVED / CURRENT — Evolution peer evidence

CFA-09's roadmap defines a first-class change unit with explicit semantic delta, subject/state references, impact, compatibility, authority, evidence, promotion and rollback references.

Interpretation:
- CFA-07 should not create a second global Change object.
- Composition replacement lineage should provide composition-side facts to CFA-09 rather than absorb generic evolution governance.

## 3. Primary finding

### DERIVED / CURRENT

**Current `name` is functioning as a composition reference, but the repository does not yet prove that `name` is a durable semantic identity.**

The evidence supports keeping these concepts distinct:

```
Composition semantic identity
        ≠
human/display name
        ≠
CompositionSpec representation
        ≠
Recipe signed representation
        ≠
member Plugin identity
        ≠
member manifest/content hash
```

A Recipe hash or manifest/content hash identifies a concrete admitted representation/state. A display name labels the composition. Neither alone is sufficient evidence of immutable semantic identity.

## 4. Smallest candidate identity model

### PROPOSED / CURRENT PLANNING POSITION

The smallest model that appears sufficient without inventing a second store is:

```
CompositionIdentity
  ├─ immutable logical identity
  ├─ current semantic revision/reference
  └─ lineage to prior revisions/changes
```

The representation should remain conceptually:

```
CompositionIdentity
    ↓
CompositionRevision / semantic representation
    ↓
Recipe / admitted signed representation
    ↓
Member plugin + manifest/content identities
```

### Proposed properties

| Property | Role | Classification |
|---|---|---|
| stable Composition identity | answers “which logical composition is this?” across valid representation/member replacement | PROPOSED |
| human/display name | user-facing label; may change without necessarily changing identity | PROPOSED |
| semantic revision/digest | identifies the specific composition definition being evaluated/used | PROPOSED |
| previous-revision/lineage reference | connects successive representations | PROPOSED |
| Recipe signature/hash | identifies signed/admitted representation | OBSERVED existing mechanism |
| member plugin id/version | identifies composition member implementation contribution | OBSERVED existing mechanism |
| manifest/content hash | pins concrete admitted member artifacts | OBSERVED existing mechanism |
| change/evolution reference | points to generic lifecycle governance when applicable | REQUIRED PEER HANDOFF / not CFA-07-owned |
| Work impact reference | points to affected Work when replacement is consequential | REQUIRED PEER HANDOFF / not CFA-07-owned |

**Important:** this is a design candidate, not a proposed Ω schema amendment.

## 5. What must survive replacement

The following are the minimum survivor properties CFA-07 should attempt to prove.

### S1 — Logical composition identity
A valid implementation/realization replacement does not change the logical Composition identity merely because member artifacts change.

### S2 — Member lineage
The old member/reference remains historically addressable and is linked to the replacement member.

### S3 — Semantic contract reference
The composition continues to point to the same semantic operation/capability contract when the replacement is contract-compatible.

### S4 — Concrete admitted state
The new Recipe/manifest/content hashes are recorded as the new admitted representation; old admitted state remains reconstructable through history.

### S5 — Selection/realization lineage
Where a member is a provider realization, the replacement preserves the capability-side lineage supplied by CFA-06 rather than inventing a new Capability identity.

### S6 — Work impact visibility
If active Work is affected, the replacement carries an explicit impact/handoff to CFA-05; CFA-07 does not silently mutate Work.

### S7 — Evolution/change linkage
When replacement is part of a broader change, CFA-07 provides composition-side facts to CFA-09; it does not define global compatibility/rollback policy.

### S8 — Authority continuity/separation
Composition continuity never implies permission continuity. Consequential replacement still goes through the authority path.

### S9 — Runtime re-admission
A changed admitted representation still traverses the ordinary K0 admission/activation path; continuity cannot bypass runtime verification.

### S10 — Data lineage
Any durable data continuity is represented through CFA-02-owned lineage/persistence semantics where applicable; Composition does not become a second data identity.

## 6. Replacement class matrix

| Class | Example | Composition identity | What changes | Survivor expectation | Status |
|---|---|---|---|---|---|
| R0 — implementation replacement | same routed op, different plugin implementation | **SHOULD SURVIVE** | member identity/version/content | contract reference + composition identity survive; implementation lineage changes | HIGH-CONFIDENCE hypothesis |
| R1 — realization replacement | provider realization A → compatible realization B for same capability/op | **SHOULD SURVIVE** | realization/member + hashes + selection lineage | capability meaning survives; composition-side member lineage changes | HIGH-CONFIDENCE hypothesis from CFA-06 |
| R2 — representation-only change | file formatting/order/note/serialization change with same semantic content | **MUST SURVIVE** | representation only | semantic identity unchanged | HIGH-CONFIDENCE hypothesis |
| R3 — configuration change | composition config changes behavior but not semantic purpose | **UNRESOLVED** | config / revision | likely same logical identity, new semantic revision; exact threshold needs evidence | UNKNOWN |
| R4 — membership change | add/remove a plugin/member | **UNRESOLVED** | membership + possibly capabilities | could remain same composition with new revision or become new composition; requires semantic-delta evidence | UNKNOWN |
| R5 — contract-compatible replacement | new plugin id, same routed op contract | **SHOULD SURVIVE** | member identity + Recipe representation | routed semantic reference survives; old/new member lineage explicit | HIGH-CONFIDENCE hypothesis |
| R6 — contract version change | `op@1 → op@2` | **UNRESOLVED** | semantic contract + consumers | never silently treat as mere implementation replacement; exact composition identity consequence requires M1/M4 peer evidence | UNKNOWN |
| R7 — meaning-changing composition redesign | composition's purpose/semantic behavior materially changes | **UNKNOWN / LIKELY NEW SEMANTIC REVISION OR IDENTITY** | semantic composition meaning | prior composition must remain reconstructable; exact identity split needs owner/evolution evidence | UNKNOWN |
| R8 — authority-breaking change | hidden unsigned path, weakened admission, bypassed Port | **MUST NOT SURVIVE AS A VALID REPLACEMENT** | constitutional invariant | stop/refuse; this is not a normal replacement | PROVEN boundary principle |

## 7. Falsifiers

### F1 — Rename falsifier
Take an existing composition representation and change only `name`.

Question:
- Does the system interpret that as a new composition, or merely a renamed representation?

Current status:
**NOT RUN** in this webapp session; current `compositionRefOf` implementation makes the ambiguity explicit.

### F2 — Implementation replacement
Keep routed op identity constant while changing the member implementation identity/content.

Expected:
- semantic Composition identity survives;
- new member/hash lineage is visible;
- old state remains reconstructable.

Proof vehicle:
existing conformance/replay fixture infrastructure.

### F3 — Compatible realization replacement
Replace a CFA-06 realization while keeping capability/op semantics constant.

Expected:
- composition identity survives;
- capability identity survives;
- realization lineage changes;
- normal re-admission still applies.

Proof dependency:
CFA-06 realization replacement evidence + later runtime admission evidence.

### F4 — Contract version change
Change `X@1 → X@2`.

Expected:
- classifier refuses to call this R0/R1;
- semantic compatibility/change handling is explicit;
- no silent continuation claim.

### F5 — Admission bypass
Attempt to treat composition continuity as permission to skip Recipe/K0 admission.

Expected:
- refusal at the runtime boundary.

Proof owner:
CFA-10.

### F6 — Work continuity
Change a composition member while an active Work depends on it.

Expected:
- composition emits an explicit impact handoff;
- CFA-05 retains control of Work reconciliation.

Proof owner:
CFA-05.

## 8. Peer evidence gates

### CFA-06 — BLOCKING for survivor-rule closure

Need:
- one concrete capability→realization replacement;
- exact identity fields that CFA-06 considers stable;
- exact external-effect/validity evidence retained across replacement.

Decision unlocked:
- whether R1 can safely be a continuity-preserving class.

Minimum acceptable evidence:
- one documented before/after realization example showing semantic Capability continuity and changed realization identity.

### CFA-05 — BLOCKING for active-Work replacement closure

Need:
- what Work requires from a composition change;
- pause/reconcile/resume/refuse implications;
- what must remain historically addressable.

Decision unlocked:
- minimum S6 payload and whether any replacement class can be Work-transparent.

Minimum acceptable evidence:
- one active Work + replacement example, even if fixture-only.

### CFA-09 — BLOCKING for evolution boundary closure

Need:
- minimum change subject/delta references;
- compatibility/impact result linkage;
- rollback/quarantine disposition shape.

Decision unlocked:
- which lineage belongs in CFA-07 and which is handed to generic evolution.

Minimum acceptable evidence:
- one replacement change record with explicit semantic delta and prior/current state references.

### CFA-02 — HIGH-VALUE / conditional

Need:
- durable join semantics for CompositionIdentity/Revision to canonical data lineage;
- reconstruction expectations.

Decision unlocked:
- whether composition history needs a durable reference beyond existing Recipe/hash lineage.

Minimum acceptable evidence:
- one reconstructable cross-domain reference case.

### CFA-10 — BLOCKING for admission handoff, not for local identity hypothesis

Need:
- exact universal admission inputs;
- re-admission behavior after changed Recipe/member hashes;
- refusal behavior for bypass.

Decision unlocked:
- which survivor properties are K1 facts versus K0 enforcement inputs.

Minimum acceptable evidence:
- current K0 proof matrix plus one changed-composition admission/refusal case.

### CFA-04 — HIGH-VALUE

Need:
- whether any replacement class requires new authority or consent;
- distinction between composition continuity and permission continuity.

Decision unlocked:
- S8 and promotion/activation handoff.

Minimum acceptable evidence:
- one consequential replacement with live authority result.

## 9. Current conclusion

### DERIVED / CURRENT

The repository supports a strong architectural distinction:

```
logical Composition identity
    ↓
semantic revision
    ↓
Recipe / admission representation
    ↓
member identities + artifact hashes
```

The current system does **not** yet prove that a stable logical identity exists as a first-class persisted semantic field. Instead, `name` currently doubles as the composition reference in the security-scan path.

Therefore:

> **Do not promote `name` into an immutable canonical identity by assumption, and do not immediately add a new CompositionId field by architectural instinct. First close the replacement/continuity semantics with CFA-06, CFA-05, CFA-09, CFA-10, and the conditional CFA-02 evidence identified above.**

The smallest evidence-backed next move is a falsifier harness around existing composition/Recipe fixtures, not a new runtime component.

## 10. Tooling disposition

| Tool | Decision |
|---|---|
| Existing composition generator | **REUSE** |
| Existing Recipe/manifest validators | **REUSE** |
| Existing conformance/replay fixtures | **REUSE** |
| New composition replacement fixture set | **SMALL EXTENSION JUSTIFIED** |
| General-purpose composition identity framework | **NOT JUSTIFIED** |
| New persistence store | **REJECTED** |
| Runtime/K0 changes | **NOT JUSTIFIED** |
| User-facing composition editor | **OUTSIDE THIS TASK / CFA-08** |

## 11. Implementation boundary

No production implementation is authorized by this proof pack.

Any future schema/contract change must wait for:
- peer evidence closure;
- explicit decision-gate outcome;
- falsifier definition;
- appropriate Ω amendment/owner process if the wire changes.

The current deliverable is the semantic classification and proof plan.

## 12. Evidence index

- `omega-baseline/omega-final/contracts/src/recipe.ts`
- `omega-baseline/omega-final/sdk/src/schema.ts`
- `omega-baseline/omega-final/contracts/src/manifest.ts`
- `omega-baseline/omega-final/compositions/_matrix.json`
- `omega-baseline/omega-final/compositions/browser.json`
- `omega-baseline/omega-final/compositions/forge-author.json`
- `omega-baseline/omega-final/tooling/generate/generate.ts`
- `omega-baseline/omega-final/tooling/gates/test/generate.test.ts`
- `omega-baseline/omega-final/plugins/vivim-law/src/compose-scan.ts`
- `omega-baseline/omega-final/plugins/vivim-law/src/index.ts`
- `omega-baseline/omega-final/docs/decisions/D-433-policy-coherence.md`
- `omega-baseline/omega-final/docs/architecture/OMEGA_REPLACEMENT_MODEL.md`
- `docs/destination/core-vs-plugin-boundary/K0-FINAL-PROOF-MATRIX.md`
- `docs/destination/core-vs-plugin-boundary/CORE-VS-PLUGIN-BOUNDARY-DISTILLATION.md`
- CFA-06 `CORE-AGENT.md`, `STATE.md`, `OWNER-ALIGNMENT-2026-09-27.md`
- CFA-05 `DOMAIN-ROADMAP-2026-09-27.md`
- CFA-09 `DOMAIN-ROADMAP-2026-09-27.md`
- CFA-02 `DOMAIN-ROADMAP-2026-09-27.md`

## 13. Status

**Design closure:** PARTIAL  
**Composition identity:** UNKNOWN / explicitly bounded  
**Replacement survivor model:** PROPOSED with evidence-backed R0/R1/R5 hypotheses  
**Peer closure:** NOT COMPLETE  
**Implementation:** NOT STARTED  
**Ω law:** UNCHANGED  
**Shared boundaries:** UNACTIVATED
