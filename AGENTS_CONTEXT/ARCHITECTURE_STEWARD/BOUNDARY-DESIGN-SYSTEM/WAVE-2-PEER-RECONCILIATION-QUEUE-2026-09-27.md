# CFA-05–10 Wave 3 Peer Reconciliation Queue — 2026-09-27

> Status: **READY — NEXT ROUTING ENABLED**
> Coordinator: Architecture Steward
> Execution: one CFA at a time
> Sequence: **CFA-05 → CFA-06 → CFA-07 → CFA-08 → CFA-09 → CFA-10**
> Authority: bounded coordination queue; not Ω law or semantic authority.

## Router rule

A bare **Next** sent to the currently routed CFA means **perform that CFA's Wave-3 row only, then STOP**.

No CFA may skip ahead because a later seam appears easier.

A CFA receiving **Next** before its turn must report **WAITING FOR PREDECESSOR** and do no substantive reconciliation.

A completed CFA must report its exact commit SHA and leave the next CFA for the human router.

## Wave-3 order

### 1. CFA-05 — Agency / Work / Execution

**Objective:** resolve the minimum execution-continuity handoffs without absorbing peer ownership.

**Peer questions:**

**Q05-03 — CFA-03**
- What minimum semantic Plan reference/version must cross into an executable Work basis?
- What makes the executable basis attributable and immutable/versioned?
- What execution findings, if any, return to semantic continuity?

**Q05-04 — CFA-04**
- What minimum durable authority citation is sufficient for Work reconstruction?
- What must be re-resolved on retry/resume?
- How are expiry/revocation/refusal represented without mutating semantic meaning?

**Q05-02 — CFA-02**
- What minimum Work/Attempt/Outcome identity and lineage references must be durable?
- What reconstruction guarantees are required?
- Which fields remain semantic Work requirements versus Data representation choices?

**Q05-06 — CFA-06**
- What realization-side effect evidence minimum is required after ambiguous invocation?
- How is external-effect UNKNOWN represented to Work?
- How does realization/session replacement preserve Work identity?

**Q05-10 — CFA-10**
- Which runtime lifecycle/fencing facts are sufficient for Work recovery?
- What is the minimum stale-worker/generation reference, if any?
- How are runtime facts kept distinct from Work Outcome?

**Required output:** one Wave-3 addendum classifying each seam RECONCILED/UNKNOWN/CONFLICTED/DEFERRED, with exact handoff proposals and falsifiers.

**Hard stop:** no scheduler implementation, Work production implementation, shared-boundary activation or Graph work.

---

### 2. CFA-06 — Capability / Provider / Realization

**Objective:** resolve the capability/realization corridor after CFA-05 has recorded the execution-side requirements.

**Peer questions:**

**Q06-05 — CFA-05**
- What realization/session/effect references does Work actually need for attribution and reconciliation?
- What external-effect evidence is sufficient for a Work-level decision?

**Q06-02 — CFA-02**
- How are Account/Session/Realization/Resource references durably represented without a second identity store?
- What lineage/reconstruction dimensions are mandatory?

**Q06-04 — CFA-04**
- What selection facts must be visible to live Authority without turning routing into permission?
- What must remain UNKNOWN when provider/account state is stale?

**Q06-07 — CFA-07**
- What typed capability/realization reference can participate in Composition membership?
- How does realization replacement affect composition membership without changing capability meaning?

**Q06-09 — CFA-09**
- When does provider-specific repair become a generic Change?
- What evidence/impact is handed to Evolution?

**Q06-10 — CFA-10**
- What minimum structural capability/token facts cross into runtime enforcement?
- Which facts are semantic and must remain outside K0?

**Required output:** one Wave-3 addendum classifying each seam and preserving routing != authorization.

**Hard stop:** no provider registry rebuild, no runtime enforcement implementation, no second data store.

---

### 3. CFA-07 — Composition / Plugin / Forge

**Objective:** resolve composition membership, admission and replacement seams using CFA-05 and CFA-06 predecessor evidence.

**Peer questions:**

**Q07-06 — CFA-06**
- What is the minimum capability/realization reference needed for membership?
- What replacement facts preserve Composition identity?

**Q07-10 — CFA-10**
- What minimum candidate/admission/integrity envelope crosses into K0?
- How are Forge-generated candidates kept outside authority?

**Q07-05 — CFA-05**
- What member replacement facts must Work receive to classify active Work impact?
- What survivor semantics preserve Work continuity?

**Q07-09 — CFA-09**
- What change envelope is required for promotion/rollback/compatibility?
- Which lineage/evidence remains Composition-owned?

**Q07-08 — CFA-08**
- What semantic composition object is exposed to Experience?
- Which editing/projection state remains surface-local?

**Required output:** one Wave-3 addendum; candidate != admitted != active remains invariant.

**Hard stop:** no composition admission implementation or plugin trust bypass.

---

### 4. CFA-08 — Experience / Interaction / Surfaces

**Objective:** resolve truthful projection, semantic write-back and continuity/re-entry seams.

**Peer questions:**

**Q08-01 — CFA-01**
- What minimum World/Space reference/result is needed for truthful presentation?
- How are unresolved/stale/conflicted states represented?

**Q08-03 — CFA-03**
- What typed mutation/handoff is required from interaction to canonical semantic Intent/Plan handling?
- What presentation state must never become semantic truth?

**Q08-05 — CFA-05**
- What Work status/control/result facts are safe to project?
- What is explicitly not inferable from UI state?

**Q08-04 — CFA-04**
- Which authority/refusal/consent facts may be presented?
- How is historical citation distinguished from current permission?

**Q08-06 — CFA-06**
- What capability/provider/realization choice information can be presented without exposing routing as authorization?

**Q08-07 — CFA-09**
- Which change/replacement events must invalidate or stale a surface projection?
- What re-entry/reconstruction facts are required?

**Q08-02 — CFA-02**
- What must persist for surface continuity versus remaining presentation-local?

**Q08-10 — CFA-10**
- What generic runtime status envelope is safe to expose?
- How are runtime facts kept non-canonical?

**Required output:** one Wave-3 addendum preserving presentation != canonical state and explicit write-back.

**Hard stop:** no frontend/product implementation.

---

### 5. CFA-09 — Evolution / Compatibility / Self-Maintenance

**Objective:** resolve cross-domain change semantics only after predecessor positions are durable.

**Peer questions:**

**Q09-02 — CFA-02**
- What is the minimum Change→Data continuity relation?
- What remains UNKNOWN because CFA-02 is provisional?

**Q09-06 — CFA-06**
- What provider-repair threshold causes a generic Change?
- What evidence/impact is required before promotion?

**Q09-07 — CFA-07**
- What composition replacement/promotion facts are needed?
- How are rollback and survivor lineage preserved?

**Q09-05 — CFA-05**
- What active Work impact categories are required?
- What recovery/retry/refuse consequences belong to Work?

**Q09-04 — CFA-04**
- Which change conditions require authority re-resolution?
- How is the historical decision distinguished from the current decision?

**Q09-10 — CFA-10**
- What runtime admission/fencing facts belong in a Change Envelope?
- What activation/replacement evidence is required?

**Q09-08 — CFA-08**
- What change signals invalidate/stale a projection?
- What continuity/re-entry evidence is needed?

**Required output:** one Wave-3 addendum; compatibility != authorization and rollback != deletion remain explicit.

**Hard stop:** no generic self-modification implementation or universal evolution registry.

---

### 6. CFA-10 — Runtime Constitution / Core Substrate

**Objective:** resolve only the minimum runtime-side contract shapes after all prior five CFA positions are durable.

**Peer questions:**

**Q10-04 — CFA-04**
- What mechanical gate result must K0 receive?
- Which live semantic authority decisions remain outside K0?

**Q10-05 — CFA-05**
- What invocation/lifecycle reference must runtime return for Work attribution?
- Which runtime states must remain separate from Work Outcome?

**Q10-06 — CFA-06**
- What structural capability/token facts are sufficient for egress enforcement?
- What provider/realization information must remain outside K0?

**Q10-07 — CFA-07**
- What is the minimum admissible composition/Recipe integrity envelope?
- Which Forge artifacts are never sufficient for admission by themselves?

**Q10-09 — CFA-09**
- What activation/replacement/fencing facts are required for change governance?
- What remains Evolution-owned?

**Q10-08 — CFA-08**
- What generic runtime status is safe for truthful projection?
- How are stale/refused states represented?

**Q10-02 — CFA-02**
- What atomicity/integrity guarantee can be relied upon without prematurely ratifying the physical Data/runtime join?

**B1**
- Preserve the existing underproven status.
- Identify only the minimum evidence/falsifier needed for closure.
- Do not promote Graph/State/Grant/Generation experiments into K0 by assertion.

**Required output:** one Wave-3 addendum classifying all bounded seams and explicitly listing residual UNKNOWN/CONFLICTED/DEFERRED.

**Hard stop:** no K0 expansion by terminology, no Graph attachment, no Ω-law change, no production restructuring.

## Wave-3 completion rule

A peer seam becomes **RECONCILED** only where the current CFA and the relevant peer have both explicitly answered the bounded question.

Otherwise classify it precisely as:

- **UNKNOWN** — insufficient evidence/answer;
- **CONFLICTED** — materially incompatible claims;
- **DEFERRED** — valid question intentionally postponed with a named dependency.

No similar wording, shared term, matching implementation name or historical precedent constitutes peer agreement.

## Graph Gate

**CLOSED until Wave 4.**

Wave 3 creates evidence for the Steward's final audit; it does not activate boundaries or attach implementation nodes to the Architecture Graph.
