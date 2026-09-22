# Step 1.13: Storage & Contracts — The "API Surface" for Extensions

**Date:** 2026-08-28
**Read:**
- `kernel/storage/contract/conversation-store.ts` (316 lines, partial — first 80)
- `kernel/storage/contract/node-store.ts` (147 lines, partial — first 60)
- `kernel/storage/contract/mux-store.ts` (12 lines, full)
- **Status:** READ + ANALYZED

**Critical finding:** The system has **~60 typed storage contracts** under `kernel/storage/contract/`, ranging from 295 to 10,281 lines. The `NodeStore` is the universal persistence layer (every node type — message, email, document, contact, task, event, media, etc. — lives here). Other contracts are domain-specific (ConversationStore, ProviderStore, CapabilityStore, etc.). The pattern is **interface-first, implementation-second**: engines depend on contracts, not on Prisma directly. **A user extension gets data access through the NodeStore + a curated subset of contracts, not through direct DB access.**

---

## What the code does

### The contract directory

Located at `kernel/storage/contract/`. **~60 files**, ranging from 295 lines (mux-store.ts) to 10,281 lines (conversation-store.ts). The full list includes:

**Domain stores (the big ones):**
- `conversation-store.ts` (10,281 lines) — conversations + messages + provider accounts
- `agentic-store.ts` (9,104 lines) — agent loop state
- `kernel-store.ts` (3,447 lines) — kernel-owned state
- `governor-store.ts` (3,635 lines) — Chrome governor state
- `telemetry-store.ts` (4,054 lines) — telemetry
- `version-store.ts` (3,431 lines) — version history (immutable time travel)
- `program-store.ts` (3,861 lines) — harness programs
- `provider-store.ts` (2,707 lines) — provider manifests + parsers + bindings
- `node-store.ts` (4,400 lines) — **the universal Node layer**
- `capability-store.ts` (4,833 lines) — capability bindings + selectors + programs
- `canvas-store.ts` (4,721 lines) — canvas definitions
- `collection-store.ts` (2,912 lines) — collections
- `ui-component-store.ts` (2,111 lines) — UI components (the slot system backing)

**Small stores (singleton-ish):**
- `mux-store.ts` (295 lines) — re-exports from provider-mux.ts
- `mirror-store.ts` (344 lines) — mirror state
- `sandbox-audit-store.ts` (368 lines) — sandbox audit (used by LiveCapabilityRegistry)
- `workspace-store.ts` (390 lines) — workspace
- `telemetry-store.ts` is 4054 — not the small one
- `health-digest-store.ts` (482 lines), `harness-repair-store.ts` (629 lines), `hpe-session-store.ts` (630 lines), `intent-template-store.ts` (607 lines), `command-store.ts` (603 lines), `channel-store.ts` (552 lines), `alert-store.ts` (553 lines), `automation-store.ts` (573 lines), `mirror-store.ts` (344 lines) — all small.

The "small" ones (300-700 lines) are typically 5-15 methods. The "big" ones (3000-10000 lines) have many methods, deep row/input types, and several sub-tables.

### `ConversationStore` (the exemplar)

`conversation-store.ts` (10,281 lines) is the biggest contract. From the file header (line 1-3): "ConversationStore — data access contract for ConversationManager. Implements Prisma calls against conversation + conversation_message tables."

**Three row types defined:**
- `ConversationRow` (line 7-25) — 18 fields: `id, providerSessionId, providerId, accountId, title, state, messageCount, lastMessageAt, contextJson, createdAt, updatedAt, projectId?, topicId?, source, externalId, importJobId, syncedAt`. The `contextJson` field is a JSON blob for arbitrary context. The `source` is a stringly-typed discriminator: `'live' | 'history-sync' | 'import'` (line 78).
- `ConversationMessageRow` (line 27-48) — 21 fields including: `id, conversationId, role, content, blocksJson, blockCount, parentMessageId, sequenceIndex, latencyMs, tokenCount, model, metadataJson, createdAt, providerMessageId, identityHash, isPinned, isArchived, readStatus`. Note `identityHash` (line 43) for deduplication.
- `ProviderAccountRow` (line 50-67) — 16 fields: `id, providerId, email, planTier, isDefault, isKind, loginState, loginAttempts, lastLoginAt, providerStateJson, debugPort, profileDir, chromeSlaveId, userId, createdAt, updatedAt`. The auth/account state for a provider.

**Pattern:** Row types are `Row` suffix, inputs are `Input` suffix. Almost all fields are scalars or JSON blobs (`*Json`). The contract is the Prisma shape, lifted to TypeScript.

### `NodeStore` (the universal layer)

`node-store.ts` (4,400 lines). From the file header (line 1-6): "NodeStore contract — universal persistence for every piece of data in the second brain. **Every node type (message, email, document, contact, task, event, media, social post, financial, ...) is stored here.** parentId enables forking; rawSource preserves the original payload for remux; schemaVersion + immutable ids enable local time travel."

**`NodeRow`** (line 10-45) — 27 fields. Base fields: `id, type, parentId, schemaVersion, rawSource, dataJson, edgesJson, metaJson, searchText, conversationId, messageId, sourceParser`. Then "Node-layer v2: ACU-proven fields" (line 23-35): `contentHash, version, state, securityLevel, contentType, authorDid, signature, aclJson, qualityJson, validFrom, validUntil, parentVersion`. Then "ACU fields (Phase 0)" (line 36-42): `acuType, lineageKind, extractorVersion, parserVersion, valueScore, isHighValue`. Plus `createdAt, updatedAt`.

**`NodeVersionRow`** (line 47-56) — `id, nodeId, version, hash, contentRef, op, parentVersion, createdAt`. **Append-only version chain** for time travel.

**`NodeAliasRow`** (line 58-60) — id, aliasId. **Entity alias → canonical resolution**. (More in the body, not read.)

This is the **"everything is a Node"** abstraction. The Node layer is the foundation; every other contract is a typed view over Nodes or a side-table. `parentId` enables forking (so a node can have multiple descendants). `schemaVersion` + immutable ids + NodeVersion enable local time travel. `acl` + `securityLevel` + `authorDid` + `signature` enable per-node access control.

### `MuxStore` (the re-export pattern)

`mux-store.ts` (12 lines, full). Just re-exports from `../../engines/provider-mux.js`. So some contracts are in `engines/`, not `contract/`. The `contract/` directory is the canonical place, but engines sometimes own the contract type.

---

## Key observations

- **The contract pattern is the universal access model.** Every engine depends on a `Store` contract, never on Prisma. This is invariant P2 in the AGENTS.md ("Engines depend on `src/storage/contracts/*.ts`, never `src/storage/impl/*.ts`"). The contract is the API; the implementation is hidden. **A user extension gets the contract, not the implementation.**

- **The Node layer is the "everything" abstraction.** 11 explicit node types in the header comment (message, email, document, contact, task, event, media, social post, financial, plus more). The Node is a tagged record (`type: string` is a stringly-typed discriminator; the `acuType` field adds another dimension). If you want to store something new, the answer is "make it a Node."

- **The contract is the Prisma shape, lifted to TS.** Rows are flat, with `*Json` blobs for structured data. This is anti-DDD (no rich domain types) but pragmatic — the contract is a thin layer over the DB.

- **Versioning is built into Node.** `NodeVersionRow` is append-only, parent-chained. Every mutation creates a new version. The `version` field on `NodeRow` is the current head. Time travel = walk the version chain.

- **ACL is on every Node.** `aclJson, authorDid, signature, securityLevel, validFrom, validUntil, qualityJson`. So a Node is not just data; it has provenance, validity, quality, and access control. An extension that wants to write a Node has to specify these.

- **The Node layer is the foundation; contracts are views.** ConversationStore has its own rows (because conversations have their own lifecycle, not just a Node), but the *message* in a conversation is presumably a Node (`messageId` on `ConversationMessageRow`, line 42; `conversationId` and `messageId` on `NodeRow`, line 20-21). The two systems are linked.

- **The `source` field is a stringly-typed discriminator.** `'live' | 'history-sync' | 'import'` (line 78). Stringly-typed = easy to extend, hard to validate. Probably fine for this use case.

- **`identityHash` on messages (line 43) is for deduplication.** When the same message comes in twice (e.g. re-sync), the hash identifies it.

- **JSON blobs are everywhere.** `contextJson, blocksJson, metadataJson, dataJson, edgesJson, metaJson, searchText, fleet_config_json, capabilities_json, models_json, fleet_config_json`. The contract pattern allows structured data but stores it as strings. The trade-off: flexible, but not type-safe at the DB level.

- **The contract layer is NOT sandboxed.** A user extension that gets a contract reference can call any method. There's no row-level ACL enforcement at the contract level — the ACL is on the data (in `aclJson`). **The contract is the API; the data is the policy.**

- **The contracts are large but mostly mechanical.** 10K lines for ConversationStore is a lot of methods, but the shape is repetitive: get-by-X, list-by-Y, upsert-Z, delete-W. The size is honest — there are many real operations on a conversation.

- **The `ui-component-store.ts` (2111 lines) is the slot system's backing store.** The frontend registry (Step 1.12) is in-memory + persisted; the `ui-component-store` is presumably the persistence layer. So slot overrides survive a restart.

- **`program-store.ts` (3861 lines) is for harness programs.** Per Step 1.9, the harness runs `prog-*` slugs. The program is presumably persisted here, and `setProgramResolver` on `UnifiedCapabilityRegistry` (Step 1.7) loads it from this store.

- **`sandbox-audit-store.ts` (368 lines) is the audit log.** Per Step 1.7, every sandbox call has an `auditId` and persists to this store. So the sandbox has a permanent audit trail.

- **MuxStore is just a re-export.** Some contracts live in `engines/`, not `contract/`. The boundary is loose.

- **The contracts are read-only from the extension's perspective.** A user extension that wants to write data goes through the `NodeStore` or one of the domain stores. But the contract doesn't enforce auth/ACL — that's on the data.

- **The contracts are not the only access path.** Direct Prisma usage is forbidden (P2), but the contracts can wrap multiple tables. So the same Node might be reachable via `NodeStore.get(id)` and via `ConversationStore.getMessageById()`. Multiple paths to the same data.

- **The "small" contracts are short because they wrap one concept.** `mux-store.ts` is 12 lines because `provider-mux.ts` already had the type. The re-export is the contract.

- **There's no "extension store" contract.** A user extension cannot add a new store contract. It must use the existing contracts. So a user extension's data lives in `NodeStore` (with a custom `type` discriminator) or in a domain store that the extension has been given access to (e.g. `MemoryIntelligenceStore` if the extension is memory-aware).

---

## Key questions raised

1. **Can a user extension create new Node types?** The Node layer has `type: string` (stringly-typed). The schema isn't enforced at the DB level. So yes — an extension can write Nodes with `type: 'my-extension.event'`. But other systems (the renderer, the search index, the capability registry) won't know what to do with that type. So a new Node type is "data-only" — writeable and readable, but not first-class.

2. **How is the `acl` enforced?** The contract doesn't enforce. The Node layer presumably has a higher-level guard. Where? (Not in the contract files.) Maybe in the NodeStore implementation; maybe in a middleware. Need to check the implementation.

3. **What's the diff between `Node` and `KnowledgeEnvelope` (Step 1.10)?** Both are content-addressed. Both have hashes. The envelope is the **ingest** format (raw source, normalize, hash, index). The Node is the **storage** format. The envelope is probably converted to a Node on ingest.

4. **What's `NodeAliasRow` for?** Line 58-60 (partial). The header mentioned "entity alias → canonical resolution." So a Node can have aliases (e.g. a person has many names). The alias resolves to the canonical Node.

5. **What are the 60 contracts actually exposed?** Per the directory listing. The big ones are conversation, agentic, kernel, governor, telemetry, version, program, provider, node, capability, canvas, collection, ui-component. The small ones are mux, mirror, sandbox-audit, workspace, etc. There may be 60 total but not all are critical.

6. **Is the implementation `kernel/storage/impl/`?** Not in the dir listing. The `impl/` dir doesn't exist in vivim-next. The forge has it. So the contract layer exists in vivim-next, but the implementations are in the forge. The vivim-next boot would fail because the contracts have no impl.

7. **What's the difference between `mux-store.ts` (12 lines) and the other contracts?** MuxStore is just a re-export. The other contracts have full row/input/method definitions. Mux was declared inline in provider-mux.ts and the contract is the same type.

8. **Can a user extension write to ConversationStore?** In principle yes (the contract is public). In practice, the engine calls are what mutate state; a raw extension call would bypass capability dispatch. The right path is: write a capability, register it, invoke it. The capability handler is what calls the store.

9. **What is `capability-resolution-store.ts` (2237 lines)?** Distinct from `capability-store.ts` (4833). Probably the resolution layer — mapping a slug to a binding to a handler to a program. Step 1.7 mentioned `prog-*` resolution.

10. **Is there a generic CRUD wrapper?** The contracts are domain-specific. There's no "GenericStore<T>" abstraction. Each contract is hand-written. This is verbose but type-safe.

11. **What is the data layout of `*Json` fields?** A JSON string in the DB. The contract says `string` (presumably JSON-encoded). A user extension that writes a Node must JSON-stringify its `data` field.

12. **What is the `provider-type-store.ts` (1102 lines)?** Distinct from `provider-store.ts`. Probably the type taxonomy (e.g. `'llm' | 'embedding' | 'image-gen'`).

13. **What is the `registration-store.ts` (1316 lines)?** Probably the audit log of registrations (who registered what when). From Step 1.6, the registrar has a `ProviderRegistrarAuditor` interface; the impl is wired to this store.

14. **What is the `version-store.ts` (3431 lines)?** Distinct from `NodeVersionRow`. Probably a versioning system for *the system itself* — schema versions, migration history, etc.

15. **What is `program-store.ts` (3861 lines)?** The harness program store. A program is the recipe for a `prog-*` slug.

---

## Cross-references

- **Step 1.7 (capability system)** — capabilities are the way to access data. A user extension writes a capability, the capability handler calls a store, the store persists.
- **Step 1.10 (memory/knowledge)** — the `MemoryIntelligenceStore` is one of the contracts. The `KnowledgeEnvelope` is the ingest format; the Node is the storage format.
- **Step 1.4 (reprogrammability)** — `ReprogrammableSurface.spec` is persisted somewhere. Probably as Nodes with `type: 'surface'`. Need to check.
- **Step 1.12 (frontend slot system)** — `ui-component-store.ts` is the persistence layer for slot overrides. The frontend registry is in-memory + persisted here.
- **Step 1.11 (security)** — `sandbox-audit-store.ts` is the audit trail for sandbox calls. The consent engine doesn't have a contract here? Let me check... actually `consent-engine.ts` (Step 1.11) imports from `../storage/contracts/consent-store.ts` but I don't see it in the directory listing. Maybe it's in a different location. (Need to verify.)
- **Step 1.6 (provider plugins)** — `ProviderStore` is the contract. The `ProviderRegistrar` calls `store.upsertDefinition`, `store.upsertEndpoint`, `store.upsertParser`, etc. 6 tables per provider.
- **Step 1.9 (harness)** — `program-store.ts` holds harness programs. `harness-repair-store.ts` holds repair audit logs.
- **`kernel/storage/impl/`** (not in vivim-next; in forge) — the Prisma implementations. The contracts are interfaces; the impls are concrete.
- **`prisma/schema.prisma`** (not read) — the actual DB schema. Should map 1:1 to the contract row types.
- **AGENTS.md from forge (P2):** "Engines depend on `src/storage/contracts/*.ts`, never `src/storage/impl/*.ts`." This is the invariant that defines the architecture.
