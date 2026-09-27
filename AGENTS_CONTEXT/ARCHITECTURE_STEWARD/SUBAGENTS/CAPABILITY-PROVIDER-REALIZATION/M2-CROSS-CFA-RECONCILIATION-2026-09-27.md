# CFA-06 — M2 Cross-CFA Reconciliation — 2026-09-27

> Status: PARTIAL RECONCILIATION COMPLETE — ADOPTION DEFERRED
> Scope: M2 minimum join shape
> Inputs: CFA-06 M2 research + current peer-owned repository evidence
> No production implementation

## 1. Executive result

The M2 join proposal survives current cross-CFA evidence as a non-authoritative reference projection, but it is not yet eligible for contract adoption.

Current peer evidence establishes:
- CFA-02: durable identity, revision, lineage and reconstruction remain Data concerns; explicit mappings/references are preferred over a universal identity or second store.
- CFA-04: live authorization remains a separate gate; provider/realization/session are CFA-06 semantics; historical authority citation may be persisted for reconstruction but is not current permission.
- CFA-05: realization/session context belongs to CFA-06 as execution attribution; Work/Attempt owns execution lifecycle; exact reference placement/cardinality remains explicitly UNKNOWN and is not frozen.

Therefore the current CFA-06 proposal remains valid as a research-level join shape:

Capability → Realization → Provider → Account? → Model? → Session? → Resource?

No new canonical entity is justified yet.

## 2. Reconciliation by blocking peer

### CFA-02 — DURABLE DATA SEAM

Current evidence: DATA-MODEL-STEWARD/BOUNDARY-ROUND-2-ADDENDUM-2026-09-27.md

Status: SATISFIED FOR RESEARCH / NOT A CONTRACT FREEZE

Relevant accepted posture:
- durable record identity, revision, lineage and reconstruction stay with CFA-02;
- semantic identity remains distinct from record identity;
- explicit relation/mapping references are preferred;
- Data may preserve durable mappings without redefining World/Semantic/Authority meaning;
- no universal identity layer is justified;
- historical AuthorityCitation can be preserved without Data re-evaluating live authority.

Implication for M2: the proposed join may use revisioned record references such as {ns,id,rev} and may be computed from canonical records.

It must not become a second identity system, infer semantic equivalence from matching record/provider identifiers, or make the projection itself canonical data.

Remaining UNKNOWN: exact physical Account/Session/Model/Resource record envelopes are not defined by this evidence.

Gate: G2 data seam remains open for implementation details, but no fundamental contradiction was found.

### CFA-04 — LIVE AUTHORITY SEAM

Current evidence: AUTHORITY-GOVERNANCE/AUTHORITY-CORRIDOR-EVIDENCE-PACK-2026-09-27.md

Status: SATISFIED FOR BOUNDARY / LIVE PROOF STILL OPEN

Relevant evidence:
- CFA-06 owns capability/effect meaning and provider/realization/session semantics;
- CFA-04 owns live authority semantics and invocation framing;
- authority is re-resolved at the invocation gate;
- provider/realization/session references are execution context, not permission;
- minimum reconstruction includes capability/target reference, authority basis, liveness inputs, invocation frame/verdict, runtime observation, Work/Outcome when execution occurs, and provider observation when applicable.

Implication for M2: the join must not contain a canonical authorized/consented verdict.

Authority may consume the join’s selected route context, but the route remains merely a candidate until the live gate.

Expiry/revocation changes the live authority result, not the semantic capability, Account identity or Session identity by mutation.

Remaining UNKNOWN: the final durable AuthorityCitation storage/join remains unresolved, consistently with CFA-02/CFA-05 current evidence.

Gate: G1/G3 boundary is sufficiently characterized; live end-to-end proof remains later M4 work.

### CFA-05 — WORK / ATTEMPT SEAM

Current evidence: AGENCY-WORK-EXECUTION/M1-WORK-ENVELOPE-CHARACTERIZATION-2026-09-27.md

Status: EXPLICIT UNKNOWN / OWNER ESCALATION

Confirmed current posture:
- Work is the canonical durable execution subject;
- CFA-06 owns capability, provider, account, model, realization and session semantics;
- CFA-05 owns Work/Step/Attempt lifecycle, execution attribution and Work-level recovery/reconciliation;
- provider/account/session replacement does not create a new Work identity by itself;
- Work may carry capabilityRef, realizationRef and sessionRef as execution attribution candidates.

But CFA-05 explicitly leaves unresolved:
- exact Work field requiredness/cardinality;
- exact authority citation/join;
- retry/resume semantics under session replacement;
- final Work transition algebra;
- active replacement/fencing behavior.

Therefore CFA-06 must not decide whether the eventual route context belongs on Work, Attempt, both, or only in referenced evidence.

Gate: G4 remains blocked on the final Work/Attempt attachment contract.

## 3. Effect on the M2 minimum join

The RealizationJoin remains the smallest safe conceptual projection:

capability / archetype
  → realizationRef
  → provider service identity
  + mediation identity where applicable
  + accountRef?
  + modelRef?
  + sessionRef?
  + resourceRef?
  + evidenceRefs

The proposal remains intentionally non-authoritative and non-durable by default.

Not yet admitted as contract decisions:
- first-class Account entity shape;
- first-class Model entity shape;
- generalized Resource taxonomy;
- browser-vs-upstream Provider/mediation naming;
- exact Work/Attempt route-context placement;
- exact AuthorityCitation relation;
- mandatory versus optional cardinality of route components.

## 4. Cross-CFA invariant set now supported

Current repository evidence supports these as DERIVED / CURRENT working invariants:
1. Capability ≠ Realization
2. Provider ≠ Account
3. Provider ≠ Session
4. Account ≠ Session
5. Session ≠ Resource
6. Routing ≠ Authority
7. Historical authority citation ≠ current permission
8. Work identity ≠ realization/session identity
9. Evidence ≠ Authority
10. External success ≠ authorization proof
11. Revision identity ≠ semantic identity
12. A projection/view ≠ canonical store

## 5. Required evidence before M2 contract adoption

Blocking:
- CFA-05: exact execution-attribution seam for realizationRef / sessionRef and its Work-versus-Attempt placement.

High-value:
- CFA-01: Resource ↔ World meaning;
- CFA-03: semantic continuity of capability identity through provider/account/session replacement;
- CFA-09: provider-replacement and healing handoff;
- CFA-10: runtime observability needed for live realization attribution.

Additional CFA-06 evidence:
- one concrete two-account distinction;
- one session-reconnect case;
- explicit provider-versus-mediation vocabulary;
- at least one heterogeneous-model example if model selection becomes material.

## 6. Adoption decision

Decision: DO NOT ADOPT AS A CONTRACT YET.

The research proposal is accepted as the working design candidate, but implementation is deferred until:
- CFA-05 resolves the Work/Attempt attachment seam;
- the remaining high-value World/Semantic/Evolution questions are reconciled where they materially affect M2;
- the owner/Steward confirms that no new shared boundary or canonical-store change is required.

This is a research decision, not an Ω-law change.

## 7. Falsifiers still in force

- A second canonical identity/data store becomes necessary.
- Account identity cannot be separated from Session without semantic loss.
- Authority requires a cached decision inside the join.
- Work must own provider/account/session semantics rather than reference them.
- Resource cannot be defined without collapsing it into World, Session or Account.
- Provider replacement necessarily changes semantic capability identity.
- The browser/provider distinction proves to be a single semantic identity rather than mediation/service roles.

## 8. Next valid action

Wait for the blocking CFA-05 execution-attribution answer through the shared reconciliation process.

Do not modify provider contracts, extend SessionRecord with speculative Account/Resource fields, create Account/Model/Resource stores, add a route cache, freeze the Work/Attempt attachment, or modify Ω law.

