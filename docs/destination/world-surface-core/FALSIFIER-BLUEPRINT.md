# F — Falsifier Blueprint

> Status: DESIGNED — not executed
> Purpose: define the smallest deterministic inspection harness after semantic boundaries are accepted.

## Harness rule

No browser, AI provider, React, Next.js, Prisma, or network is required.

Use an in-memory canonical fixture with explicit revision numbers/hashes. Surface state is disposable test state.

## F1 — Reconstruction

Delete projection and interaction state.

**Pass:** the same canonical subjects, relationships and revisions produce a valid surface.

**Fail:** missing UI records cause missing canonical objects or relationships.

## F2 — Multiple surfaces / one object

Project the same Thing into Canvas and Chat.

**Pass:** both carry the same canonical subject reference and canonical revision.

**Fail:** each surface creates an independent identity.

## F3 — Surface mutation

Move/rename/configure an object through a semantic surface action.

**Pass:** action becomes Intent → governed mutation → canonical revision → evidence → refreshed projection.

**Fail:** UI store changes without canonical revision/evidence.

## F4 — Projection deletion

Delete all projection records while retaining canonical state.

**Pass:** reconstruction succeeds.

**Fail:** object identity, relationship or history is lost.

## F5 — Stale projection

Advance canonical revision while holding an old projection.

**Pass:** freshness becomes STALE/UNKNOWN and consequential action re-resolves canonical state.

**Fail:** old surface snapshot is accepted as current authority.

## F6 — Layout corruption

Replace layout with invalid/corrupt coordinates/configuration.

**Pass:** canonical world remains intact and a default surface can be regenerated.

**Fail:** corrupt layout makes canonical state unrecoverable.

## F7 — Work projection

Project a durable Work item into a surface, then advance Work independently.

**Pass:** surface reflects lifecycle/evidence without becoming the Work store.

**Fail:** editing the projection changes Work without the ordinary Work mutation path.

## F8 — World restore before UI restore

Restore canonical World/Object state without restoring surface records.

**Pass:** world is complete and surface can be rebuilt.

**Fail:** restoration requires old UI state.

## F9 — Zero prior UI state

Start with canonical World + declared default surface configuration and no prior UI state.

**Pass:** VIVIM opens to a valid, explainable surface.

**Fail:** first launch requires hidden UI persistence.

## Cross-falsifier invariants

- Projection deletion never deletes canonical state.
- Layout corruption never corrupts canonical state.
- Selection never grants authority.
- Stale data never silently becomes canonical.
- Optimistic state is never treated as confirmed evidence.
- Two surfaces never imply two canonical identities.
- Surface capability binding is derived/governed, not an authority bypass.
- Reconstruction is deterministic for identical canonical inputs and declared configuration.

## Evidence shape

Each test should record only what is needed to reconstruct the claim:

```
fixtureCanonicalRevision
projectionInputRevision
surfaceId
subjectRefs
intent?
governanceVerdict?
canonicalRevisionAfter?
evidenceRef?
projectionRevisionAfter?
verdict
```

No visual screenshot is required for these semantic falsifiers.
