# VIVIM V1 Build Map

> Derived from Pass 3. This is sequencing control, not product law.

## 0. Protect
G0 — Ω foundation

Protect:
- Vault / evidence primitives.
- Law / authority path.
- Recipe / runtime composition.
- Canonical Intent.
- Provider realization lifecycle.
- Forge proposal/promotion separation.

Exit: no change unless a downstream experiment falsifies an existing assumption.

## 1. External substrate
D1 → E1 → E2 → E3 → E4

Provider → Account → Session → BrowserResource → Routing → Realization → Effect → Evidence

D1 must close:
- Account vs Session vs Resource meaning.
- identity evidence.
- ownership/lifecycle.
- routing precedence.
- selection-decision evidence.

Exit: account identity, isolation, concurrency, and recovery are bounded enough to implement without guessing.

## 2. Canonical world + durable work
D2 + D3 → E6 + E7

Object/Relationship/Lifecycle ↔ Work/Checkpoint/Outcome/Evidence

D2 closes object envelope, typed Message / Artifact / Document / File semantics, relationships, revisions, archive/delete, export/restore.

D3 closes Work identity, Intent linkage, Plan linkage, checkpoint, external-effect boundary, outcome/evidence, continuation.

Exit: a new durable object and an interrupted Work can both be reconstructed.

## 3. Knowledge and freshness
D4 + D5 → E8

D4: derived ProviderKnowledgeView, evidence basis, provider-specific extensions, drift/repair state.
D5: basis refs, basis digest, dependency versions, freshness, invalidation/recompute.

Exit: derived knowledge can be shown as current only when its basis supports currentness.

## 4. Minimum bridge implementation
Implement only the contracts now exercised:
- Account representation.
- Session ↔ Account binding.
- Browser Resource ownership/lease.
- policy-backed routing.
- durable Work.
- canonical object envelope + typed payloads.
- relationship references.
- basis-aware derived views.

Exit: first complete product spine is executable and restartable.

## 5. World / Surface
Connect canonical objects, workspace/project/canvas organization, Work state, projections, continuity.

Surface remains a consumer/projection, not canonical storage.

## 6. Provider generality
E5 — third-provider falsifier

Choose a provider with materially different auth/composer/stream/conversation behavior.

Exit: provider contract generality is supported or the contract gap is explicitly designed.

## 7. Legacy behavioral floor
Integrate:
1. account-aware provider use;
2. profile/resource isolation;
3. conversation continuity;
4. workspace/project/canvas organization;
5. background/long-running state;
6. export/backup/recovery;
7. discovery/healing evidence loop.

Do not copy the Legacy implementation hierarchy.

## 8. Product Instance
After the critical spine is real:
- first-run empty-world semantics;
- durable instance identity;
- composition load;
- restart;
- export/restore;
- executable replacement boundary;
- end-user shell/productization.

## Parallel lane
While E1–E4 require owner-machine evidence, local work may advance on D2/D3 pure data design, object/relationship fixtures, Work checkpoint tests, and D4/D5 pure assembly/freshness logic.

Never label these live-provider proof.
