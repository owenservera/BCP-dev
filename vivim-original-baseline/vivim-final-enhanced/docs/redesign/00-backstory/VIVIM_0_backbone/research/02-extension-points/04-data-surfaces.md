# Step 2.4: Data Surfaces — What Extensions Can Read and Write

**Date:** 2026-08-28
**Scope:** VIVIM-next source
**Status:** CATALOGED

---

## The data topology

```
        ┌─────────────────────────┐
        │  NodeStore (universal)  │ ← every "thing" can be a Node
        └────────────▲────────────┘
                     │
       ┌─────────────┼─────────────┐
       │             │             │
   ┌───▼───┐   ┌─────▼─────┐   ┌───▼────┐
   │ Conv  │   │  Memory   │   │ Canvas │  ← domain stores
   │ Store │   │  Store    │   │  Store │
   └───▲───┘   └─────▲─────┘   └───▲────┘
       │             │             │
       └─────────────┼─────────────┘
                     │
        ┌────────────┴────────────┐
        │   capability layer      │  ← extensions access here
        │   (UnifiedCapability    │
        │    handler)             │
        └─────────────────────────┘
                     ▲
                     │
        ┌────────────┴────────────┐
        │   live cap handler      │  ← runtime-registered extensions
        │   (mcp/http/inline)     │
        └─────────────────────────┘
```

**Key insight:** An extension does NOT touch the storage layer directly. It goes through a capability handler, which is the only code that calls a `Store`. The Store contract is the API; the implementation is hidden. **This is the trust boundary.**

---

## What extensions can READ

Through a capability handler, an extension can call:

- **`memory_query`** — episodic/semantic/procedural memory recall.
- **`knowledge_search`** — semantic search over the knowledge graph.
- **`knowledge_synthesize`** — cross-conversation synthesis.
- **`conversation_list`** — list conversations.
- **`provider_health`** — provider health.
- **`capability_list`** — list all capabilities.
- **`capability_search`** — search capabilities by name/category/tag.
- **`nl_interpret`** — interpret natural language into a capability.
- Many more — every capability in the bootstrap is readable.

**Through a NodeStore query (if the extension is given a NodeStore reference)**, it can:
- Read any Node by id (`NodeStore.get(id)`).
- List Nodes by type / parent / conversation / message (`NodeStore.listByType(...)`).
- Read Node version history (`NodeStore.getVersions(id)`).
- Resolve aliases (`NodeStore.resolveAlias(aliasId)`).

---

## What extensions can WRITE

Through a capability handler:

- **`memory_record`** — record a memory item.
- **`knowledge_ingest`** — ingest a knowledge artifact (creates a `KnowledgeEnvelope`, normalizes, indexes).
- **`conversation_create`** — create a conversation.
- **`conversation_send`** — send a message (drives a chat provider).
- **`live_capability:registered`** — register a new capability at runtime. (This is the most powerful write.)
- **`live_capability:revoked`** — revoke a runtime capability.

Through a NodeStore:

- **`NodeStore.create(node)`** — create a new Node.
- **`NodeStore.update(id, patch)`** — update a Node.
- **`NodeStore.delete(id)`** — delete a Node.
- **`NodeStore.registerAlias(nodeId, aliasId)`** — register an alias.

Through Reprogrammability (forge only, not in vivim-next):

- **`SurfaceRegistry.register(surface)`** — register a new ReprogrammableSurface.
- **`SurfaceMutationPlan`** — apply a series of mutations to existing surfaces.
- **`surfaceRegistry.unregister(surfaceId)`** — remove a surface.

---

## The ACL model (from the data side)

Per Step 1.13, every Node has:
- `aclJson: string` — JSON-encoded ACL.
- `authorDid: string` — the author (DID = decentralized identifier).
- `signature: string` — cryptographic signature.
- `securityLevel: number` — a numeric level.
- `validFrom, validUntil: number` — temporal validity.

**This means the data itself is access-controlled, not the contract.** A user extension that gets a `NodeStore` reference can call `get(id)`, but the implementation should check the ACL. The enforcement code is not in the contract files (would be in the impl layer, which is in the forge).

**The contract layer is the API; the data layer is the policy.** A user extension that wants to write a Node must set `authorDid` and `aclJson` correctly. If it doesn't, the implementation rejects the write.

---

## The stringly-typed fields that ARE the extension point

These are the "you can write anything here" fields:

- **`NodeRow.type`** (line 12 of node-store.ts) — `string`. Extensions can write `type: 'my-extension.event'`. The system doesn't know what to do with it, but the data is persisted.
- **`NodeRow.dataJson`** (line 16) — stringified JSON. The actual content of the node.
- **`NodeRow.edgesJson`** (line 17) — stringified JSON. Edges to other nodes.
- **`NodeRow.metaJson`** (line 18) — stringified JSON. Metadata.
- **`NodeRow.searchText`** (line 19) — full-text search field.
- **`KnowledgeEnvelope.metadata`** (Step 1.10) — `Record<string, unknown>`. Custom metadata.
- **`KnowledgeEnvelope.contentType`** — `string`. Custom content type.

These are the "loose fields" — type-safe at the field level (string) but free-form at the value level. **A user extension can persist custom data without modifying the schema.** It just won't be first-class (no renderer, no search index, no capability).

---

## What extensions CANNOT do (today)

- **Cannot add a new column to the schema.** Schema changes require Prisma migration.
- **Cannot add a new storage contract.** The ~60 contracts are hardcoded.
- **Cannot add a new Node type that the system recognizes.** New `type` strings are data-only; other systems ignore them.
- **Cannot change the ACL model.** The fields are fixed.
- **Cannot bypass the consent engine** — except for live HTTP handlers (Step 1.11 gap).
- **Cannot register a `HarnessModule`** (Step 1.9) — harness is closed to user code.
- **Cannot directly invoke another plugin's hook.** Plugin hooks are private to the system.
- **Cannot modify the registry of registries** (e.g. add a new `Live*` registry). The system has fixed registries.

---

## What extensions CAN do (today)

- **Register a `LiveCapabilitySpec`** with handler of `mcp | http | inline` (Step 1.7). Get full cross-surface (CLI/UI/MCP/API/workflow).
- **Add a SlotOverrideClaim** for any of 30 frontend slots (Step 1.12). Get a custom component rendered.
- **Write a Node** with a custom `type` (data only).
- **Ingest a KnowledgeEnvelope** with a custom `sourceType` and `contentType`.
- **Read any data the host makes available** through a capability (the host decides which capabilities are exposed).
- **Emit events on the bus** (the bus is public).
- **Listen to events on the bus** (the bus is public).

---

## Key observations

- **The data layer is strongly typed at the row level, free-form at the JSON-blob level.** Most user data lives in JSON blobs. The extension model can lean on this — extensions write data into blobs, the system doesn't need to know the shape.

- **The Node layer is the universal extension data sink.** `NodeStore.create({ type: 'my-extension.event', dataJson: '...', ... })` is the pattern. The cost: the system doesn't know the type, so the data is unsearched, unrendered, uncategorized.

- **The capability layer is the universal extension API surface.** A user extension is best modeled as a set of capabilities (with handlers). Each capability can read/write data through the Store layer. The user extension never touches Prisma directly.

- **The ACL is on the data, not the contract.** An extension that has a `NodeStore` reference can attempt to read any Node. The enforcement is in the impl. This is the right model (the contract is the API; the data is the policy) but it means an extension with a `NodeStore` reference is fully trusted.

- **The stringly-typed `type` and `dataJson` fields are the de facto extension point.** If you want to add a new "kind of thing" to the system, the answer is "make it a Node with a custom `type`." This is a low-friction path.

- **The taxonomy pool JSON is the canonical capability source.** Per Step 1.8. But it's not in vivim-next, so the generated bootstrap is a no-op. **For vivim-next, the *only* way to add a capability is via `LiveCapabilityRegistry`.**

- **The trust boundary for an extension is: "What capabilities does it have?"** A live cap is sandboxed (inline = QuickJS; http = consent-gated fetch if audit is wired). The cap's `surfaces[]` declares which user-facing surfaces it appears on. The cap's `handlerSpec.kind` declares its execution model.

---

## Key questions raised

1. **Can an extension have a private NodeStore (per-extension database)?** No. The NodeStore is a singleton. But an extension can use `type: 'my-extension.event'` and only write/read its own type. Other extensions could see it if they know the type. (No row-level isolation unless the ACL is set.)

2. **Can an extension encrypt its data?** `kernel/security/db-encryption.ts` (Step 1.11) is at-rest encryption. The extension's data would be encrypted if the host configures it.

3. **Can an extension have a "private" capability?** Live caps have `id: 'live:<id>'`. The id is opaque. But anyone can `getById(id)`. So a live cap is discoverable but not encrypted. (Same answer as Nodes.)

4. **Can an extension share data with another extension?** Yes, by writing a Node with a shared `type` or by writing a KnowledgeEnvelope with a shared `sourceType`. The consent engine doesn't gate reads (only writes). So extensions can read each other's data if they know the type/sourceType.

5. **What's the data backup story?** Per NodeVersion (Step 1.13), every mutation is a new version. Time travel is built in. But there's no "export my extension's data" capability. (Not read.)

6. **What's the data migration story when an extension updates?** The extension must write new data in a new `type` (or a new version of the envelope). The old data stays. So updates are not destructive.

7. **What's the limit on Node size?** `dataJson: string` — no explicit limit. A user could write a 1GB dataJson. The system would persist it. (Likely the DB column has a TEXT or BLOB limit, but not in the contract.)

8. **Is there a "private channel" between extensions?** No. Extensions are isolated in execution (sandboxed inline handlers) but not in storage. They share the Node layer.

9. **Can an extension define its own `KnowledgeEnvelope.sourceType`?** Yes. The field is `string`, not enum. So a user extension can ingest artifacts with `sourceType: 'my-extension.thing'`. The ingestion pipeline normalizes + indexes; the index doesn't know the type, but the data is there.

10. **Is there a per-extension audit log?** The `SandboxAuditStore` audits inline handler calls (Step 1.11). The `NodeVersion` chain audits data writes (Step 1.13). But there's no "this extension did X at Y" log per extension.

---

## Cross-references

- **Step 1.10 (memory/knowledge)** — `MemoryIntelligenceStore`, `KnowledgeEnvelope`, `NodeStore` relationship.
- **Step 1.13 (storage contracts)** — full list of ~60 contracts.
- **Step 1.7 (live-capability-registry)** — `LiveCapabilitySpec.handlerSpec` is the execution model.
- **Step 1.11 (security)** — `SandboxPermissions`, `ConsentEngine`. The trust boundary.
- **Step 1.4 (reprogrammability)** — `SurfaceRegistry` is a registry; the forge has it, vivim-next doesn't.
- **Step 1.12 (UIComponentStore)** — slot override persistence.
- **Step 1.6 (provider)** — 6-table upsert is the "provider data" pattern. Different from general extensions.
- **Phase 1 synthesis (Step 1.15)** — the 4 extension surfaces and their data access.
- **`prisma/schema.prisma`** (not read) — the actual DB schema; the contracts map 1:1.
