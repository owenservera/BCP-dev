# Step 3.5: Storage Contribution — Design Contract

**Date:** 2026-08-28
**Read:** Phase 1 Step 1.13 (storage contracts), Phase 2 Step 2.4 (data surfaces)
**Status:** DESIGNED

---

## The question (from the process)

> "Can an extension add a new storage type (a new table, a new file format)? Is the contract pattern the right model, or do extensions need a different access pattern?"

## The answer

**No, an extension cannot add a new storage type (no new table, no new contract).** The ~60 storage contracts are hardcoded. But an extension CAN add a new **shape** within the existing `NodeStore` (the universal layer) — a new `type` string with a `dataJson` of the extension's choosing.

The proposed `StorageContribution` is the contract for declaring those shapes + the access pattern.

---

## Why not a new table?

- **Schema changes require a Prisma migration.** Extensions can't run migrations.
- **Adding a new contract requires writing a TypeScript interface and a Prisma impl.** The extension runs in the host; it can't add new source files to the host's type system.
- **The Node layer IS the universal extension data sink.** Per Phase 2.4: "If you want to add a new 'kind of thing' to the system, the answer is 'make it a Node with a custom `type`.'"

So the design accommodates extensions via the Node layer, not via new tables.

---

## The proposed `StorageContribution` shape

```typescript
// In an extension manifest, this is a JSON object.
// At runtime, this is metadata registered with the host's NodeStore.
export interface StorageContribution {
  // ── Identity (required) ──
  id: string                       // unique within extension; e.g. "my-tasks"
  
  // ── The node type this contribution creates (required) ──
  nodeType: string                 // e.g. "myext.task"
                                  // must be namespaced (prefix with extension id)
  
  // ── Schema (required) ──
  dataSchema: {
    type: 'object'
    properties: Record<string, unknown>  // JSON schema
    required?: string[]
  }
  
  // ── Default data (optional) ──
  defaultData?: Record<string, unknown>
  
  // ── ACL (required) ──
  acl: {
    defaultSecurityLevel: number   // 0-100; default 50
    defaultACL: Array<{            // default row-level ACL
      principal: string            // user did or 'self' or 'workspace' or 'extension:<id>'
      permission: 'read' | 'write' | 'delete' | 'admin'
    }>
  }
  
  // ── Indexing (optional) ──
  index?: {
    searchTextFields?: string[]    // which fields to copy to searchText
    embeddingFields?: string[]     // which fields to embed for semantic search
  }
  
  // ── Capabilities the extension declares for its data (optional) ──
  // These become live caps that other extensions/users can invoke.
  capabilities?: Array<{
    id: string                     // e.g. "myext.list_tasks"
    name: string
    description: string
    inputSchema: Record<string, unknown>
    surfaces: ('cli' | 'ui' | 'workflow' | 'mcp' | 'api')[]
    // The handler is auto-generated from the data shape:
    // - 'list' — list all myext.task nodes
    // - 'get' — get one myext.task by id
    // - 'create' — create a myext.task
    // - 'update' — update a myext.task
    // - 'delete' — delete a myext.task
    operation: 'list' | 'get' | 'create' | 'update' | 'delete'
  }>
  
  // ── Migrations (optional) ──
  // If the extension's data shape changes between versions, the host
  // can run a migration on every myext.task node.
  migrations?: Array<{
    fromVersion: string
    toVersion: string
    transform: {
      kind: 'rename-field' | 'add-field' | 'remove-field' | 'set-field'
      // ... per-kind details
    }
  }>
  
  // ── Cleanup on uninstall (optional) ──
  uninstall?: {
    deleteData: 'all' | 'archive' | 'keep'  // default: 'archive'
  }
}
```

---

## What this fixes

- ✅ Extensions can declare a new node `type` with a JSON schema.
- ✅ Extensions can declare a default ACL.
- ✅ Extensions can declare search + embedding fields.
- ✅ Extensions can auto-generate CRUD capabilities (list/get/create/update/delete).
- ✅ Extensions can declare a data migration path.
- ✅ Extensions can declare cleanup behavior on uninstall.

---

## What this does NOT fix

- **The extension can't add a new column to the Node table.** It can only add fields within `dataJson`.
- **The extension can't add a new index.** The host's Node table has its own indexes; the extension's `index` field is a hint for the host to copy to `searchText` or embed.
- **The extension can't add a new query API.** It can declare CRUD capabilities; advanced queries must be hand-written as a `CapabilityContribution` with an `inline` handler.
- **The extension can't choose the storage backend.** It writes to `NodeStore`, which is whatever the host uses (Prisma, etc.).
- **The extension can't bypass the ACL.** The ACL is enforced in the impl layer (forge). The contract declares the policy; the host enforces it.

---

## Auto-generated CRUD capabilities

A `StorageContribution` with `capabilities: [...]` registers N live caps at install time. Each is a `CapabilityContribution` with the auto-generated handler:

- **`list` handler:** `NodeStore.listByType('myext.task')`.
- **`get` handler:** `NodeStore.get(id)`.
- **`create` handler:** `NodeStore.create({ type: 'myext.task', dataJson: JSON.stringify(input), ...})`.
- **`update` handler:** `NodeStore.update(id, patch)`.
- **`delete` handler:** `NodeStore.delete(id)`.

The handlers run with the extension's identity (the host sets `authorDid` and `aclJson` per the contribution's ACL).

**This is the "extensibility by data shape" pattern.** A user extension that wants to store tasks just declares a `StorageContribution` for `myext.task` and gets CRUD capabilities for free.

---

## Sample storage contribution (in `vivim-extension.json`)

```json
{
  "id": "my-tasks",
  "nodeType": "myext.task",
  "dataSchema": {
    "type": "object",
    "properties": {
      "title": { "type": "string" },
      "due": { "type": "string", "format": "date-time" },
      "status": { "type": "string", "enum": ["pending", "done", "cancelled"] },
      "tags": { "type": "array", "items": { "type": "string" } }
    },
    "required": ["title"]
  },
  "defaultData": {
    "status": "pending",
    "tags": []
  },
  "acl": {
    "defaultSecurityLevel": 50,
    "defaultACL": [
      { "principal": "self", "permission": "admin" },
      { "principal": "workspace", "permission": "read" }
    ]
  },
  "index": {
    "searchTextFields": ["title", "tags"],
    "embeddingFields": ["title"]
  },
  "capabilities": [
    {
      "id": "myext.list_tasks",
      "name": "List tasks",
      "description": "List all tasks",
      "inputSchema": { "type": "object", "properties": { "status": { "type": "string" } } },
      "surfaces": ["cli", "mcp", "api"],
      "operation": "list"
    },
    {
      "id": "myext.create_task",
      "name": "Create task",
      "description": "Create a new task",
      "inputSchema": {
        "type": "object",
        "properties": {
          "title": { "type": "string" },
          "due": { "type": "string" }
        },
        "required": ["title"]
      },
      "surfaces": ["cli", "mcp", "api"],
      "operation": "create"
    },
    {
      "id": "myext.update_task",
      "name": "Update task",
      "description": "Update a task",
      "inputSchema": { "type": "object", "properties": { "id": { "type": "string" } } },
      "surfaces": ["cli", "mcp", "api"],
      "operation": "update"
    },
    {
      "id": "myext.delete_task",
      "name": "Delete task",
      "description": "Delete a task",
      "inputSchema": { "type": "object", "properties": { "id": { "type": "string" } } },
      "surfaces": ["cli", "mcp", "api"],
      "operation": "delete"
    }
  ],
  "uninstall": {
    "deleteData": "archive"
  }
}
```

This is one storage contribution that gives the user 4 capabilities (list, create, update, delete) backed by Nodes of `type: 'myext.task'`. The user can:
- `vivim myext.list_tasks --status pending`
- `vivim myext.create_task --title "Buy milk"`
- `mcp__myext.update_task({ id: "...", status: "done" })`
- `POST /api/live/myext.delete_task { "id": "..." }`

And the data lives in `NodeStore` with the right ACL, indexed, embedded, and migratable.

---

## What's the trade-off vs custom inline handlers?

A user can also write the capabilities as a `CapabilityContribution` with `kind: 'inline'` and a custom handler. The advantage of `StorageContribution` is auto-generation + the migration path. The disadvantage is the operations are limited to CRUD (no joins, no aggregations, no complex queries).

For complex queries, the extension can declare BOTH:
- A `StorageContribution` for the data shape.
- A `CapabilityContribution` with a custom handler that queries the data via the host's API.

---

## Open design questions

1. **What if two extensions declare the same `nodeType`?** Slug collision. The install fails. (Same as capability slug collision.)

2. **What about the `migrations[]` field?** The host has a migration runner (per the AGENTS.md from forge: "Data migrations ... go through the SchemaMeta-backed `MigrationRunner`"). The extension's migrations are user-data migrations, not schema migrations. The host can run them on `myext.task` nodes when the extension updates.

3. **What if the extension's `dataSchema` is wrong at runtime?** Zod validation is the gate. The host validates `dataJson` against the schema on every read/write. A mismatch is rejected.

4. **What about the embedding fields?** The host has an embedding pipeline. The extension's `embeddingFields` is a hint for which fields to embed. The host may ignore the hint if the fields are not in the embedding schema.

5. **What about querying?** The auto-generated `list` capability supports a single `status` filter (per the example). More complex queries require a custom capability.

6. **What's the `uninstall.deleteData: 'archive'` semantic?** The host moves the data to a `node.archive` table (or marks `state: 'archived'` on the Node). The data is recoverable. `deleteData: 'all'` is a hard delete. `deleteData: 'keep'` leaves the data; the extension is "uninstalled" but the data remains. **The default should be 'archive'.**

7. **What about cross-extension data sharing?** Extension A can write `type: 'myext.task'`; Extension B can read it. The ACL is the gate. If Extension A says `defaultACL: [{ principal: 'self', permission: 'admin' }]`, only A can read. If it says `[{ principal: 'workspace', permission: 'read' }]`, anyone in the workspace can read.

8. **What about Node relationships?** Edges. The Node layer has `edgesJson` (a JSON blob of edges to other nodes). The `StorageContribution` should declare edge types. (Not in the design yet; deferred to v2.)

---

## Cross-references

- **Step 1.10 (memory/knowledge)** — `KnowledgeEnvelope`, `Node` layer.
- **Step 1.13 (storage contracts)** — `NodeStore`, ~60 contracts.
- **Step 2.4 (data surfaces)** — NodeStore universal; ACL on data.
- **Step 3.1 (capability contribution)** — `StorageContribution` auto-generates `CapabilityContribution`s.
- **Phase 3 Step 3.7 (synthesis)** — the unified `vivim-extension.json`.
