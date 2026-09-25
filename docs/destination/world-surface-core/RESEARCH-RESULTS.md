# F — World / Surface Projection Core — Research Results

> Classification: DERIVED — RESEARCH RESULT
> Status: PROPOSED DESIGN — not ratified law
> Branch: `research/F-world-surface`
> Scope: canonical World/Object state → user-facing Surface projections.
> Constraint: no production implementation; no browser or AI required.

## 1. Executive finding

The correct boundary is:

```
CANONICAL WORLD / OBJECT / RELATIONSHIP STATE
                |
                v
        PROJECTION QUERY / SNAPSHOT
                |
                +----> Surface
                |       +-- View
                |       +-- Layout
                |       +-- Interaction state
                |       +-- selection/focus
                |
                +----> Work / Attention projection
                |
                v
       USER INTERACTION / INTENT
                |
                v
        GOVERNED CANONICAL INTENT
                |
                v
      CANONICAL MUTATION + REVISION
                |
                v
              EVIDENCE
                |
                v
          PROJECTION REFRESH
```

A Surface is neither a second object store nor an authority boundary. A Projection is a reproducible read model. Layout and interaction state are surface-local state. Selection/focus may contribute context but never grants authority. A surface-originated mutation must become canonical intent and pass the ordinary authority path; the UI must not write canonical state directly.

The strongest existing Ω rule is D-383's pointer model: surfaces are clients of the Ω surface contract rather than a second product/data platform. D-436 adds the complementary requirement that derived surfaces have measurable parity and tamper/drift detection.

## 2. Vocabulary

### Surface
A concrete interaction boundary through which a person or external consumer experiences a projection.

Examples: canvas, project workspace, chat surface, panel, CLI, MCP, web surface.

A surface has identity and configuration, but does not own the identity of the Things it represents.

### Projection
A deterministic or explicitly versioned derivation of canonical state into a surface-oriented representation.

A projection may contain denormalized display data, ordering, grouping, affordances and references. It is disposable and reconstructable.

### View
A semantic presentation mode over the same projected subject.

Examples: project overview, conversation, graph, timeline, board.

A View changes representation, not canonical identity.

### Layout
Surface-local spatial/presentation state: positions, sizes, z-order, docking, viewport, grouping arrangement, panel geometry.

Layout can be durable user preference, but it is not canonical Thing identity and must not be required to reconstruct the World.

### Interaction State
Ephemeral or session-local state such as hover, expanded/collapsed sections, draft text, current tool mode, selection handles, drag state and pending optimistic UI.

It may be persisted when useful, but persistence does not promote it to canonical world truth.

### Object Selection
A surface reference to one or more canonical object IDs.

Selection is a context seed. It is not an authority grant and must resolve against current canonical state before consequential action.

### Context
The evidence-backed subset of world/work state relevant to the current interaction.

Surface state may seed context; context assembly remains governed by the deterministic context substrate.

### Mutation
A requested change to canonical state.

A surface emits an Intent, not a database write. The canonical system determines whether/how that intent becomes a mutation.

### Work Projection
A surface representation of durable Work state: requested, running, waiting, succeeded, failed, refused, cancelled, reviewed, plus relevant evidence/result references.

### Attention Projection
A surface representation of what currently merits the user's attention, derived from standing intent, work, world changes, approvals, failures and configured attention policy.

## 3. Canonical boundary

The destination reconciliation already states "the world is not the canvas" and "the workspace is not a second database." This research sharpens that into a three-way separation:

| Concern | Canonical owner | Surface may store |
|---|---|---|
| Thing identity | World/Object model | object reference |
| Thing attributes | canonical object state | display snapshot |
| Relationships | canonical relationship state | projected edges |
| Revision/history | canonical revision/evidence system | last-seen revision |
| Spatial placement | surface/space organization | layout record |
| View choice | surface configuration | view id/config |
| Selection/focus | interaction/context layer | selected IDs |
| Drag/resize state | interaction layer | ephemeral state |
| Work lifecycle | Work system | projection |
| Attention | Attention system/policy | projection |
| Authority | law/consent | never inferred from UI state |

The important consequence is that deleting every surface record must not delete the world.

## 4. Projection model

Use a stable projection envelope rather than storing arbitrary UI copies:

```
Projection {
  projectionId
  surfaceId
  subjectRefs[]
  sourceRevisionRefs[]
  projectionKind
  projectionVersion
  generatedAt
  freshness
  payload
  layoutRef?
  viewRef?
}
```

This is a design envelope, not a proposed database schema.

The key semantic properties are:

1. `subjectRefs` point to canonical Things.
2. `sourceRevisionRefs` make freshness/evidence inspectable.
3. `payload` is disposable representation.
4. `layoutRef` points to surface-local organization.
5. Projection version identifies the derivation contract.
6. Staleness is explicit; stale data is not silently treated as canonical.

A projection may be computed on demand instead of persisted. Persistence is an optimization/cache or user preference, never a requirement for truth.

## 5. Surface lifecycle

```
DECLARE / DISCOVER
      ↓
BIND to canonical subjects + capabilities
      ↓
PROJECT
      ↓
INTERACT
      ↓
INTENT
      ↓
GOVERN
      ↓
CANONICAL REVISION
      ↓
EVIDENCE
      ↓
INVALIDATE / REFRESH
      ↓
PROJECT AGAIN
```

A surface can disappear at any point. Reopening it must reconstruct from canonical state plus explicitly durable surface configuration.

## 6. Mutation rule

The correct flow is:

```
surface gesture
  → semantic interaction
  → canonical Intent
  → capability resolution
  → authority/consent
  → canonical mutation
  → revision/event/evidence
  → projection invalidation
  → re-projection
```

Never:

```
surface gesture → mutate projection blob → assume world changed
```

The legacy VIVIM canvas is useful evidence here but also exposes why the distinction matters. `CanvasMirror` supports optimistic region state and mutation history; `mutation-caps.ts` records canvas mutation events. Those are valuable interaction mechanisms, but their state cannot become destination canonical World state merely because the old canvas stored it.

## 7. Staleness

Every projection needs a meaningful freshness posture:

- **CURRENT** — source revisions match the projection's captured references.
- **STALE** — canonical source revision advanced after projection generation.
- **UNKNOWN** — source cannot currently be verified.
- **INVALID** — projection contract/version cannot be interpreted.
- **REBUILDING** — projection is being regenerated.

Unknown is not failure. Stale is not canonical truth.

A surface may render stale information with an explicit status when useful, but consequential mutation must re-resolve against current canonical state.

This is especially important for long-lived canvases and background Work.

## 8. Multiple surfaces

One canonical Thing may simultaneously appear as:

- a project tile;
- a conversation participant;
- a graph node;
- a search result;
- a timeline entry;
- a canvas object;
- a Work attachment.

These are multiple projections of one identity, not duplicate Things.

The inverse mapping must therefore be reference-based:

```
surface-instance-id → canonical subjectRef
```

not identity-by-pixels, DOM node, panel position, or generated label.

## 9. Workspace and Canvas

### Space
A semantic environment/context containing Things, relationships, Work and available surfaces.

### Workspace
A configured presentation arrangement for a Space.

### Canvas
A spatial Surface capable of representing many subjects and supporting direct manipulation.

Therefore:

```
World
  → Space
     → Workspace
        → Surface(s)
           → View(s)
              → Layout / interaction state
```

A workspace may be saved and restored, but it must be possible to reconstruct it from the World plus workspace configuration. A canvas coordinate is never a canonical identity.

## 10. Chat and panels

Chat is a Surface, not an alternative world.

A chat message may refer to canonical Things and produce Intent/Work. A panel is another Surface over the same subjects.

The old VIVIM `UnifiedEntry` demonstrates a useful single-entry interaction pattern, but the destination interpretation is broader: the entry point addresses VIVIM, a Space, Thing, Work item, provider/account, capability, agent or Surface. It should ultimately feed the same canonical interaction path rather than create a second command system.

## 11. Work and Attention

Work is projected, not embedded into a canvas.

A surface can show:

- active work;
- waiting approvals;
- completed work;
- failures;
- results;
- evidence;
- next actions.

Attention is a further projection over World + Work + standing intent + policy.

This prevents the UI feed from becoming a hidden task database.

The product return experience can therefore be derived:

```
world changes
+ work changes
+ standing intent
+ attention policy
→ attention projection
→ return surface
```

## 12. Canonical revision and evidence

A surface mutation is not complete when the UI changes.

The authoritative sequence is:

1. user gesture/request;
2. semantic intent;
3. governance decision;
4. canonical revision;
5. evidence/event;
6. projection refresh;
7. surface acknowledgement.

Optimistic UI may precede steps 4–6, but it must be visibly provisional and must reconcile or revert.

The legacy CanvasMirror's `confirmedAt`, optimistic update, revert and mutation history are useful harvest candidates for this interaction behavior.

## 13. Reconstruction

The strongest falsifier is deliberately destructive:

> delete every disposable projection/layout/interaction record and reconstruct the surface from canonical World/Object state.

Expected result:

- canonical Things remain identical;
- canonical relationships remain identical;
- canonical revisions remain identical;
- a valid surface can be regenerated;
- loss is limited to intentionally non-canonical UI state;
- no hidden object identity is discovered in the UI store.

If a feature cannot survive this test, its supposed "surface state" is carrying canonical responsibility and the boundary is wrong.

## 14. Thin inspection/projection harness

Only after the semantic boundary is accepted, build a small harness with six pure pieces:

1. **Canonical fixture** — tiny World with project/person/conversation/document/work.
2. **Projection adapter** — canonical fixture → surface projection.
3. **Layout adapter** — subject refs → surface placement.
4. **Mutation adapter** — surface intent → canonical revision fixture.
5. **Freshness checker** — source revision vs projection revision.
6. **Reconstructor** — canonical fixture + optional durable surface config → surface.

The harness should have no browser, AI, React, Next.js, database dependency, or production runtime dependency.

It should emit evidence records sufficient to compare:

```
before canonical hash
→ intent
→ governed mutation
→ after canonical hash
→ projection hash
```

## 15. Falsifier results / expected invariants

| ID | Falsifier | Required invariant |
|---|---|---|
| F1 | reconstruct surface from canonical world | surface is valid without prior UI state |
| F2 | same object on two surfaces | both resolve to same canonical subject |
| F3 | mutate from surface | canonical revision changes; projection follows |
| F4 | delete projection state | world survives; projection regenerates |
| F5 | canonical revision while surface open | surface becomes stale/refreshes; stale UI cannot silently become truth |
| F6 | corrupt layout | canonical world survives; surface can rebuild |
| F7 | Work projected | Work lifecycle remains canonical; surface is a view |
| F8 | restore world before projection | canonical world restores independently |
| F9 | zero prior UI state | default surface derives from canonical state + declared configuration |

No live runtime result is claimed here; these are research falsifiers to execute in the later harness phase.

## 16. Harvest conclusions

### Harvest
- CanvasMirror optimistic/reconcile/revert behavior.
- Canvas mutation history as interaction evidence pattern.
- OracleReader's self-describing manifest idea.
- CanvasDesigner / workspace presets as surface authoring/configuration concepts.
- AdaptiveWorkspaceEngine as adaptive presentation with stable semantics.
- LivingCanvas direct manipulation, selection, viewport and multiple layout modes.
- UnifiedEntry as a unified interaction affordance.

### Do not harvest as authority
- canvas coordinates as object identity;
- UI component trees as canonical schema;
- legacy workspace storage as a second world database;
- optimistic mirror state as canonical revision;
- frontend route handlers / Prisma as the destination data layer;
- any surface-local cache as evidence of object existence.

## 17. Relationship to Ω law

This research does not create or amend ratified law.

It conforms to existing destination/Ω constraints:

- D-383: pointer/default surface boundary;
- D-359: shared `surfaceOpMeta` derivation;
- D-436: measurable surface parity, derivation stamps and tamper/drift protection;
- destination rule: Canvas ≠ canonical World storage;
- evidence ≠ representation ≠ authority.

The research therefore fills a semantic gap between canonical state and concrete product surfaces without introducing a competing data model.

## 18. Remaining open questions

1. Exact canonical shape of Space vs Workspace configuration.
2. Whether layout persistence belongs to a dedicated surface namespace or a broader composition/configuration mechanism.
3. How projection revision references should bind to the final Product Instance/Object contracts.
4. How real-time invalidation/subscription is represented without making the surface a second event authority.
5. How collaborative/multi-principal surfaces interact with the current single-principal Ω boundary.
6. Which surface state is worth durable persistence versus cheap reconstruction.
7. The exact boundary between View configuration and user-created Composition.

These are intentionally left open rather than smuggled into this research result as settled schema.

## 19. Conclusion

The reusable destination primitive is not "Canvas."

It is:

**Canonical subject → governed projection → surface interaction → canonical intent → revision/evidence → projection refresh.**

Canvas, Workspace, Chat, panels and future 3D surfaces are different realizations of that same projection contract.

That is the boundary that allows VIVIM to evolve its UI indefinitely without turning the UI into the source of truth.
