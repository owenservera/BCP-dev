# Step 2.6: Command Surfaces — Every Way to Invoke

**Date:** 2026-08-28
**Scope:** VIVIM-next source
**Status:** CATALOGED

---

## The 5 ways to invoke something

| Path | Mechanism | Where defined | Extensibility |
|---|---|---|---|
| **Capability** (unified) | `UnifiedCapabilityRegistry.execute(id, input, ctx)` | `kernel/capability/unified-registry.ts` | Live + Engine registration |
| **Live capability** | `LiveCapabilityRegistry.registerLive(spec)` | `kernel/capability/live-capability-registry.ts` | **Runtime add** |
| **CLI command** | `ShellCommandStore` + `CommandSpec[]` | `surfaces/web/src/cli/commands/shell.ts` | Static `registerDefaultCommands` (746 lines) |
| **NL pattern** (NLCL) | NL phrase → `capabilityId` mapping | `nlcl/catalog.ts` (forge, not in vivim-next) | Static binding |
| **Slash/tag/mention** | Prefix commands | `MutationProvenance: 'prefix'` (Step 1.4) | `Reprogrammability` (forge only) |

---

## The capability path (the primary)

Per Step 1.7, every capability is a `UnifiedCapability` registered in `UnifiedCapabilityRegistry`. It has 5 surfaces:

- **`cli`** — `cap.cliCommand = { name, aliases, examples }`. The CLI invokes via name.
- **`ui`** — `cap.ui = { component, position, group?, order, icon?, shortcut? }`. The UI renders a button/menu.
- **`workflow`** — `cap.workflowNodeType`. Workflow editor can drop a node of this type.
- **`mcp`** — `cap.mcpToolName`. MCP server exposes this as a tool.
- **`api`** — `cap.apiEndpoint = { method, path }`. HTTP API at the path.

**A user extension adds a capability by calling `LiveCapabilityRegistry.registerLive(spec)`.** The spec's `surfaces[]` field declares which surfaces to expose. The cross-surface bindings are auto-generated.

---

## The CLI path

The CLI commands are registered via `registerDefaultCommands(store)` in `surfaces/web/src/cli/commands/shell.ts` (746 lines). Each command has:

```ts
{
  path: ['admin', 'db', 'status'],      // multi-word path
  description: 'Show database row counts + file size',
  capabilityId: 'cap:admin:db_status',  // the underlying capability
  handler: async (args, ctx) => ok(ctx, '...'),  // stub or real
}
```

The comment at line 6-9 is critical: "The canvas `cap:canvas:shell-command` capability dispatches through the SAME registry (FRONTEND=BACKEND two-way, invariant 5)."

**The CLI command is a frontend projection of a backend capability.** The CLI handler is a stub (line 30 comment: "Each command's handler is a stub that returns a ShellCommandResult; production swaps in real capability dispatch"). In production, the handler calls `POST /api/capabilities/:id/execute`.

**A user extension adds a CLI command by adding a capability with `surfaces: ['cli']` + `cliCommand: { name, ... }`.** The frontend's CLI auto-populates from the capability list (via `auto-populate.ts` per Step 2.1).

**The 746-line `registerDefaultCommands` is the static list of engine-declared CLI commands.** A user extension doesn't edit this file; it adds a capability and the CLI picks it up.

---

## The NL pattern (NLCL)

NLCL = Natural Language Command Language. The system has `MutationProvenance: 'nlcl'` (Step 1.4) but the catalog itself is **NOT in vivim-next**. The forge has `src/engines/nlcl/catalog.ts` (per AGENTS.md). The pattern binding is `pattern → capabilityId`. The dispatcher (also forge) matches user input to a pattern, gets the capability id, executes it.

**A user extension adds an NL pattern by adding to `nlcl/catalog.ts`.** (In the forge, not the vivim-next target.) The catalog is a static file, not a runtime registration.

---

## The prefix command (slash/tag/mention)

`MutationProvenance: 'prefix'` is one of the 6 tags (Step 1.4). Slash commands like `/help`, `@bot`, `#channel` are "prefix" commands. The execution path is: prefix detected → handler invoked → `SurfaceMutationPlan` applied. **Forge only** — the reprogrammability substrate is not in vivim-next.

---

## The MCP path

Per Step 1.7, a capability with `surfaces: ['mcp']` gets a `mcpToolName`. The MCP server exposes the capability as a tool. The tool is a thin wrapper that calls the capability.

---

## The API path

Every capability with `surfaces: ['api']` gets an `apiEndpoint = { method, path }`. The HTTP server routes the path to the capability. The bridge is the **router-capability-bridge** (Step 1.3) which auto-registers 70+ HTTP endpoints as capabilities (falling back to a fetch proxy if no real capability exists).

---

## The `ActionRegistry` (frontend command dispatch)

Per Step 2.1, the frontend has an `ActionRegistry` (separate from the backend `UnifiedCapabilityRegistry`). `auto-populate.ts:62` calls `ActionRegistry.register(cap.slug, ...)` to sync backend capabilities into the frontend dispatch table. The frontend's UI components look up actions in the ActionRegistry.

**`ActionRegistry` is the frontend's "command palette."** The backend `UnifiedCapabilityRegistry` is the source of truth.

---

## Are commands scattered or unified?

**Mostly unified, with 3 sibling registries:**

- **Backend: `UnifiedCapabilityRegistry`** — the single source of truth. Every capability lives here.
- **Backend: `LiveCapabilityRegistry`** — extends Unified, adds runtime registration.
- **Frontend: `ActionRegistry`** — a projection of the backend. Auto-synced.
- **Frontend: `ShellCommandStore`** — the CLI's command tree. Multi-word commands (`admin db status`). Stub handlers; production dispatches via `capabilities/:id/execute`.
- **Frontend: `UIComponentRegistry` slot overrides** — slot-based, not command-based. UI positioning rather than invocation.

**There is ONE command palette** (the capability registry), but it has 4 surface projections:
- `cli` → CLI commands (auto-populated from `cliCommand.name`).
- `ui` → UI components (slot-based, not command-based).
- `workflow` → workflow nodes.
- `mcp` → MCP tools.
- `api` → HTTP endpoints.

So a user adding a new "command" adds ONE capability, and the system surfaces it on all 4 transports.

---

## What's "open" for a user extension

- **Add a capability** (engine-time) — edit `default-caps.ts` in forge, or extend the handler map.
- **Add a capability** (runtime) — `LiveCapabilityRegistry.registerLive(spec)`. This is the primary path.
- **Add an NL pattern** — edit `nlcl/catalog.ts` (forge only).
- **Add a CLI command** — add a capability with `surfaces: ['cli']`. Auto-projected.
- **Add an MCP tool** — add a capability with `surfaces: ['mcp']`. Auto-projected.
- **Add an API endpoint** — add a capability with `surfaces: ['api']`. Auto-projected.
- **Add a UI action** — add a capability with `surfaces: ['ui']` + `ui` or `uiAction`. Auto-projected.
- **Add a slot override** — `UIComponentRegistry.register(...)` (Step 1.12). Decoupled from capabilities.
- **Add a workflow node** — add a capability with `surfaces: ['workflow']`. Auto-projected.

## What's "closed"

- **Add a new `CapabilitySurface`** (cli/ui/workflow/mcp/api) — the enum is closed.
- **Add a new command path** outside the capability system (you'd have to bypass the dispatcher).
- **Add a new NLCL primitive** (the pattern matcher is a fixed DSL).
- **Reorder surface precedence** (capabilitySlug > providerSlug > default is fixed).
- **Add a custom transport** (e.g. a `gRPC` surface) without editing the registry.

---

## The command palette UX

From the slot system (Step 1.12), there is no `command.palette` slot. But AGENTS.md mentions: "`Ctrl+K` / `⌘K` — Command Palette — `CommandPalette.tsx`." So there is a command palette component, but its slot id is not in the 30-slot catalog. **It might be `entry.unified` or a different mechanism.** Not deep-dived.

---

## Key observations

- **The capability registry IS the command palette.** Every "command" is a capability. Every transport (CLI/UI/MCP/API/workflow) is a projection.

- **The "live" path is the primary runtime extension point.** A user extension adds ONE capability → it appears in 4 transports automatically. The "spec" is the manifest; the spec's `surfaces[]` declares visibility.

- **The CLI is a projection, not a source.** The 746-line `registerDefaultCommands` is a static list of engine-declared commands; the runtime dispatch is via the backend capability registry. So a user extension doesn't edit `registerDefaultCommands`.

- **The `nlcl/catalog.ts` is the only NL extension point.** (Forge only, not vivim-next.) A user extension adds an NL pattern by editing this file. No runtime NL pattern registration.

- **The `ActionRegistry` (frontend) is auto-populated from the backend.** `auto-populate.ts:62` is the bridge. So a user extension's `LiveCapability` automatically appears in the frontend's action palette. (Assuming the frontend subscribes to the bridge.)

- **The router-capability-bridge covers 70+ HTTP endpoints** that don't have a real capability. This means a user CAN hit a backend HTTP route via the capability system, even if the route has no explicit capability declaration. (Gap from Step 1.3.)

- **`requiresConfirmation` is hardcoded `false` for live caps.** A user extension's capability will run without confirmation. The engine's `registerOrReplace` can override this; the live registry's `specToUnifiedCapability` cannot. (Step 1.7 gap.)

- **The "command palette" UX is `Ctrl+K`.** But the slot catalog doesn't list a palette slot. So the palette is either part of `entry.unified` or a separate concept.

- **The 4 user-facing producers of mutations (Composer, Modal, Builder, LLM Harness) are not in vivim-next.** Reprogrammability is forge-only. **The "user-configurable program" UX is not present in vivim-next.**

---

## Key questions raised

1. **Where is `nlcl/catalog.ts` in vivim-next?** Not found in the search. The forge has it. The migration may have skipped it.

2. **What is `auto-populate.ts`?** 62 lines. Reads capabilities and registers them in the frontend's `ActionRegistry`. Not deep-read.

3. **What is the `CommandPalette` component?** Per AGENTS.md, it's the `Ctrl+K` UI. Not in the slot catalog. Where is it?

4. **Can a user extension add a slash command (prefix command)?** The `MutationProvenance: 'prefix'` exists in reprogrammability (forge). The implementation of slash commands is not in vivim-next.

5. **What is the `CommandRegistry` referenced in the comment at shell.ts:7?** Probably the `ShellCommandStore` (the same thing). The comment calls it "the ShellCommandStore (CommandRegistry)" — same registry, two names.

6. **What is `admin db status` etc. in the CLI?** Engine-declared commands. Stub handlers return formatted text. In production, they call `capabilities/:id/execute`. So a user extension doesn't write CLI handlers; it writes capabilities.

7. **Can a user extension add a `requiresConfirmation: true` capability?** The live registry hardcodes `false`. The engine can use `registerOrReplace` to override. So a user can get confirmation if they take the engine-time path. The runtime path can't.

8. **Is there a per-capability "category" filter for the command palette?** `UnifiedCapability.category: string`. The palette presumably filters by category. Not deep-dived.

9. **What's the relationship between `nlcl/catalog.ts` patterns and capability ids?** The catalog is `{ pattern, capabilityId }`. The dispatcher matches input to pattern, gets the capability id, calls `execute(id, ...)`. So NLCL is a thin pattern matcher on top of the capability registry.

10. **Can a user add NL patterns at runtime?** No. The catalog is a static file. (Per the codebase pattern.)

---

## Cross-references

- **Step 1.7 (capability system)** — `UnifiedCapability`, `LiveCapabilitySpec`, `LiveCapabilityRegistry`, the 5 surfaces.
- **Step 1.3 (router-capability-bridge)** — covers 70+ HTTP endpoints.
- **Step 1.4 (reprogrammability)** — `MutationProvenance: 'prefix' | 'nlcl'`, the DSL.
- **Step 1.12 (frontend slot system)** — `UIComponentRegistry` is UI-positioning, not command-dispatch.
- **Step 1.14 (distribution)** — the install endpoint doesn't wire up NL patterns.
- **`surfaces/web/src/cli/commands/shell.ts:746`** — the static engine CLI command list.
- **`surfaces/web/src/actions/auto-populate.ts:62`** — the bridge from backend capabilities to frontend `ActionRegistry`.
- **`auto-populate.ts`** is the "ActionRegistry.register" pattern from Step 2.1.
- **`command-parity-capabilities.ts:303`** — registers "command parity" capabilities (a meta-capability).
- **`provider-caps.ts:204`** — provider-specific capabilities.
- **AGENTS.md (forge)** — "One Entry Point (v10 Invariant). Every operation is a UnifiedCapability. CLI and frontend are thin NL shells that call POST /api/interpret → POST /api/capabilities/:id/execute."
