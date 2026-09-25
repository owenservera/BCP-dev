# D2 — World, Workspace & Canvas Reconciliation

> Classification: DERIVED — WORKING DESIGN / RESEARCH
> Status: initial destination reconciliation.
> Scope: connect the persistent-world destination experience to existing Ω world/projection semantics and legacy VIVIM workspace/canvas evidence.

## 1. Why this slice

The destination experience is not “open a dashboard.”

It is:

> Open VIVIM and find an already-existing world of projects, conversations, files, people, accounts, work, memories, and current context.

The repository already contains the necessary ingredients:

- Ω WorldModel and mind;
- ontology/evidence semantics;
- vault-backed domain rows;
- Ω live-object/canvas projection rules;
- legacy projects/conversations;
- legacy workspace/preset/adaptive-workspace behavior;
- legacy canvas layers, primitives, designer, and sandbox.

The missing work is the product projection that makes those pieces behave like one world.

## 2. Canonical boundary

The world is not the canvas.

The canvas is a surface over the world.

The workspace is not a second database.

The workspace is a user-visible spatial/contextual organization of things and surfaces.

Therefore:

```
EVIDENCE / VAULT
      ↓
CANONICAL THINGS + RELATIONSHIPS
      ↓
WORLD PROJECTION
      ↓
SPACE / WORKSPACE
      ↓
SURFACES / LIVE OBJECTS
      ↓
DIRECT MANIPULATION
```

A spatial action may create or change a relationship/placement record, but the visual position itself is never the only canonical truth.

## 3. Existing Ω material

### WorldModel

`vivim.mind` already derives a deterministic world representation from evidence.

It currently includes:

- plugins;
- routable operations;
- entities;
- lexicon;
- automation rules;
- current context;
- capability declarations;
- capability gaps;
- attachments;
- focus;
- warnings.

This is a strong grounding lens.

### Live objects

Ω defines live spatial objects as durable references/representations with identity, composition, vault binding, spatial placement, and provenance.

That gives us the right abstraction for canvas objects.

### Surfaces

Ω treats surfaces as projections/interaction forms.

The same underlying thing may have more than one useful surface.

## 4. Existing VIVIM mine evidence

The legacy tree already contains:

- `CanvasEngine`;
- canvas definitions and layers;
- core primitives for workspace/projects/knowledge/agents/providers/conversations;
- sandboxed capability bindings;
- canvas designer;
- canvas mutation capabilities;
- workspace manager contracts;
- workspace presets;
- adaptive workspace modes;
- project/conversation organization;
- conversation tree construction.

This is highly relevant product evidence.

It should be selectively harvested, not copied wholesale into Ω.

## 5. Destination world model

The product-level world should expose at least these classes of thing when the user has authorized the underlying source:

- person/contact;
- project;
- conversation;
- message;
- document/file;
- repository;
- application;
- service/provider;
- account;
- task/work item;
- agent;
- automation/standing intent;
- memory;
- idea;
- view/surface;
- composition;
- evidence/event.

These are not required to become a giant monolithic schema.

The key is that they are **meaningful, addressable, related, and representable**.

## 6. Space semantics

A space is a way of organizing and experiencing things.

Candidate spaces include:

- home;
- project;
- research;
- conversation;
- application-like;
- focused task;
- temporary investigation.

A space can have:

- membership;
- spatial arrangement;
- default surface;
- default context;
- attention rules;
- available capabilities;
- entry/exit behavior.

A space should not become a hidden persistence silo.

## 7. Workspace semantics

The legacy workspace implementation suggests a useful distinction:

### Space

Semantic environment/context.

### Workspace

A configured presentation/interaction arrangement for a space.

That means a workspace can contain:

- surfaces;
- panels;
- canvases;
- object arrangements;
- context selection;
- shortcuts;
- preferred interaction modes.

This makes adaptive workspace behavior reusable without making “chat/expert/agent” into permanent product classes.

## 8. Canvas semantics

The canvas should be:

- infinite;
- composable;
- direct-manipulation friendly;
- multi-surface;
- capability-aware;
- safe by default;
- derived from world state.

The user should be able to:

- place;
- move;
- group;
- connect;
- resize;
- open;
- inspect;
- switch surface;
- create;
- configure;
- hide;
- restore.

A thing's visual representation is replaceable without changing its canonical identity.

## 9. The “my project” destination object

This is the first key product integration target.

A project should be able to expose, in one space:

```
PROJECT X
 ├── status
 ├── people
 ├── conversations
 ├── messages
 ├── documents
 ├── repositories
 ├── tasks/work
 ├── decisions
 ├── memories
 ├── agents/automations
 └── next actions
```

These are projections/relationships, not necessarily one storage record.

The important experience is:

> “I opened Project X and VIVIM already knows what belongs here.”

## 10. Current focus

The existing mind model already has a focus shape.

Destination use of focus should answer:

- what thing/space is active;
- what work is active;
- what attachments matter;
- what recent actions matter;
- what standing intent matters;
- what the user has explicitly pinned.

Focus is a context seed, not an authorization grant.

## 11. World projection pipeline

The target derivation is:

```
sources / vault
      ↓
ontology identity
      ↓
relationships
      ↓
world projection
      ↓
current focus / attention
      ↓
space/workspace projection
      ↓
surface selection
      ↓
canvas
```

The same underlying source may therefore appear simultaneously in:

- a project;
- a conversation;
- a search result;
- a timeline;
- an account view;
- a canvas tile.

This is a core destination property.

## 12. “Open VIVIM” behavior

The product should not begin by asking:

> “Which application do you want?”

Instead it should restore the most useful view of the user's world.

A first-run or post-install environment may be seeded from the available default capability set.

A later return should use:

- last meaningful space;
- unfinished work;
- recent changes;
- attention state;
- standing intent;
- pending decisions.

The exact ranking can evolve, but it must remain explainable and user-configurable.

## 13. Adaptive behavior

Legacy `AdaptiveWorkspaceEngine` shows that the environment can change its presentation based on interaction mode.

Destination interpretation:

**adaptive presentation, stable semantics.**

The world does not change identity because the surface changes.

Example:

```
same Project X
    → compact project tile
    → full project workspace
    → conversation surface
    → graph surface
    → agent/work surface
```

All reference the same underlying world entities.

## 14. Conversation integration

The legacy conversation organizer shows the beginning of the experience:

project → topics → conversations.

Ω `vivim.chat` already provides a canonical chat writer and history reader.

The reconciliation target is:

```
imported / native conversation
        ↓
canonical conversation thing
        ↓
project / space relationships
        ↓
context
        ↓
surface
```

That is what turns AI history from an imported dataset into part of the user's world.

## 15. Product maturity path

### W0 — characterized

Inventory existing WorldModel, live-object, canvas, workspace, and project/conversation behavior.

### W1 — unified identity

Project/conversation/person/file/account objects all resolve through the ontology without duplicate product identities.

### W2 — world projection

A deterministic projection can answer “what is in my world?” for the supported domains.

### W3 — space/workspace

A user can enter a meaningful space and receive the correct relevant things and surfaces.

### W4 — canvas

Objects can be directly manipulated and their placement survives restart without becoming canonical object truth.

### W5 — continuity

Reopening VIVIM restores useful world state and current work.

### W6 — productized world

Normal users can reorganize, customize, and configure the environment without learning its internal schema.

### W7 — evolving world

New plugins/providers/domains automatically contribute objects, capabilities, and surfaces without fragmenting the user's mental model.

## 16. Critical gaps

### G-W1 — Domain projection breadth

The current WorldModel is strong but narrow.

Need a governed mechanism for adding new domain projections without turning mind into an unbounded warehouse.

### G-W2 — Relationship model in daily UX

The destination requires people/projects/conversations/files/accounts/etc. to connect naturally.

Current ontology provides the semantics; product-level projection and navigation still need composition.

### G-W3 — Space/workspace distinction

Legacy workspace code is useful, but the destination needs one stable semantic meaning for space versus presentation workspace.

### G-W4 — Canvas/world synchronization

Need a clean, durable mapping between world objects and spatial instances.

### G-W5 — Return-state synthesis

Need a product-level “what changed / what am I doing / what needs attention” view.

### G-W6 — Multi-surface identity

Need one thing to safely support multiple surface representations without accidental duplicated state.

### G-W7 — User-created organization

Moving/connecting/grouping objects should be able to express useful organization without forcing the user to become a database designer.

## 17. Harvest matrix

| Legacy mechanism | Destination treatment |
|---|---|
| CanvasEngine | Harvest interaction orchestration; preserve Ω projection/authority rule |
| canvas primitives | Harvest as product vocabulary where still useful |
| CanvasDefinition/layers | Harvest surface schema ideas |
| sandbox/capability bridge | Preserve the capability boundary principle |
| CanvasDesigner | Harvest native surface-authoring behavior |
| workspace presets | Harvest as user compositions/templates |
| AdaptiveWorkspaceEngine | Harvest adaptive presentation behavior |
| ConversationOrganizer | Harvest relationship/organization behavior |
| project/topic tree | Harvest navigation projection |
| legacy knowledge graph | Assay relationship semantics; do not blindly import schema |
| canvas-agent tools | Harvest direct-manipulation capabilities |
| live mirror | Harvest synchronization technique |
| legacy frontend panels | Treat as historical UX experiments |

## 18. Thin falsifier

Use one real project containing at least:

- one person;
- one imported/native conversation;
- one document;
- one work item;
- one provider/account relationship.

Prove:

1. these are distinct canonical things;
2. their relationships can be derived;
3. the project space can project them;
4. a canvas can represent them;
5. moving a visual object does not mutate its canonical identity accidentally;
6. restart reconstructs the same world from evidence;
7. the user can continue work without rebuilding context manually.

## 19. Dependencies

Consumes:

- P1-03 ontology/evidence;
- P1-04 self-knowledge/context;
- P1-05 runtime/surfaces;
- P1-08 imported/harvested behavior.

Feeds:

- P1-09 integrated proof;
- D3 universal work interaction;
- D5 attention/evolution.

Does not require P1-10 implementation.

## 20. Immediate implementation sequence

### D2-1 — world-domain inventory

Map supported source domains to canonical thing kinds and relationships.

### D2-2 — project projection

Build the minimum “open project” projection over existing evidence.

### D2-3 — workspace/space bridge

Map legacy workspace behavior into a destination space/presentation model.

### D2-4 — canvas projection

Map live objects to world things and prove restart reconstruction.

### D2-5 — return continuity

Add current-work/recent-change/pending-decision projection.

### D2-6 — cross-domain proof

Run the thin falsifier with project + conversation + document + work + provider/account.

## 21. Working conclusion

The product should not be built as:

**dashboard → apps → integrations.**

It should be built as:

**world → spaces → things → relationships → context → surfaces.**

The canvas is the user's spatial language for that world.

The workspace is the configured way of experiencing a space.

The underlying truth remains the governed world/evidence system.

That is the bridge between the Ω architecture and the actual VIVIM experience described in the destination foundation.
