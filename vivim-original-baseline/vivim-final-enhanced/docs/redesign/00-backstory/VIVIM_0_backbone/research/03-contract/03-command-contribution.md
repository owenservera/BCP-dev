# Step 3.3: Command Contribution — Design Contract

**Date:** 2026-08-28
**Read:** Phase 1 Step 1.7 (capability system), Phase 2 Step 2.6 (commands synthesis)
**Status:** DESIGNED

---

## The question (from the process)

> "Can an extension add a new command? A new NL pattern? Does the existing `capability` model cover commands, or do we need a separate `command` type?"

## The answer

**The existing `capability` model covers commands. No separate `command` type is needed.**

A "command" in this system is a `UnifiedCapability` with `surfaces: ['cli']` (or any subset). The system already projects the capability to:
- `cli` → CLI command (`cap.cliCommand = { name, aliases, examples }`)
- `mcp` → MCP tool (`cap.mcpToolName`)
- `api` → HTTP endpoint (`cap.apiEndpoint = { method, path }`)
- `workflow` → workflow node type
- `ui` → UI action (`cap.ui` or `cap.uiAction`)

Per the AGENTS.md from forge: "**One Entry Point (v10 Invariant).** Every operation is a `UnifiedCapability`. CLI and frontend are thin NL shells that call `POST /api/interpret` → `POST /api/capabilities/:id/execute`."

So the unification is **already there**. A "command" is just a capability with a CLI surface. No new type needed.

---

## What the design needs to add (to the existing capability model)

From Phase 2.6, the gaps for "command" extensibility:

1. **NL pattern binding is forge-only.** The `nlcl/catalog.ts` (per AGENTS.md) is a static file. A user extension cannot add an NL pattern at runtime.

2. **No `prefix` command support in vivim-next.** `MutationProvenance: 'prefix'` (Step 1.4) exists in the type system but the execution layer is forge-only (reprogrammability).

3. **CLI command paths are static.** The 746-line `registerDefaultCommands` in `surfaces/web/src/cli/commands/shell.ts` is engine-declared. A user extension's capability auto-projects to CLI, but only if the host wires the `auto-populate.ts` bridge.

4. **No "alias" concept beyond `cap.cliCommand.aliases`.** A command can have aliases, but no per-namespace aliasing.

5. **No per-command help / doc URL.** The capability has `description` (string) but no link to docs.

6. **No per-command "scope" (workspace, user, system).** A command is global.

---

## What the `CapabilityContribution` (Step 3.1) ALREADY covers for commands

The proposed `CapabilityContribution.surfaces: ['cli', ...]` declares the command. The host's CLI dispatch reads `cliCommand.name` and registers it in the `ShellCommandStore`. A user can call `vivim <name> ...`.

**No additional contract is needed for "command" as a thing.** It's a `CapabilityContribution` with `surfaces: ['cli']`.

---

## But: 3 things the design SHOULD add to the capability model to fully cover commands

### 3.1. NL pattern binding (currently forge-only)

A user extension should be able to declare: "the phrase 'send to slack' should invoke this capability."

```typescript
// In a CapabilityContribution (extends Step 3.1):
export interface CapabilityContribution {
  // ... existing fields ...
  
  // ── NL bindings (optional) ──
  nlPatterns?: Array<{
    pattern: string             // e.g. "send to {{channel:slug}}"
    examples: string[]          // for training / matching
    priority?: number           // higher wins on tie
  }>
}
```

The host maintains a runtime NL pattern catalog. On `registerLive`, the host adds the patterns. The dispatch layer (NLCL) matches user input against all registered patterns, picks the highest-priority match, gets the capability id, executes.

**This makes NLCL runtime-extensible, not just static.**

### 3.2. Command help / doc URL

```typescript
export interface CapabilityContribution {
  // ... existing ...
  
  // ── Documentation (optional) ──
  docs?: {
    url?: string                // e.g. "https://myext.dev/commands/send_to_slack"
    examples?: Array<{
      description: string       // e.g. "Send a DM"
      input: Record<string, unknown>
      output?: Record<string, unknown>
    }>
  }
}
```

The host renders help on `vivim <name> --help`.

### 3.3. Per-command scope

A command is either:
- **System** — affects the whole installation.
- **User** — affects the current user.
- **Workspace** — affects the current workspace.

The host may scope based on the capability's `category` or a new `scope` field. Today this is implicit (commands are global).

```typescript
export interface CapabilityContribution {
  // ... existing ...
  
  // ── Scope (optional, default: user) ──
  scope?: 'system' | 'user' | 'workspace'
}
```

---

## The "command" abstraction: a thin layer on top of capabilities

If the user wants a "command" mental model, the manifest can group `CapabilityContribution`s into `CommandContribution`s. But this is **optional sugar** — every command is a capability with `surfaces: ['cli']`.

```typescript
// Optional grouping. If used, the manifest is more readable.
// At runtime, this is flattened into CapabilityContribution[].
export interface CommandGroupContribution {
  name: string                 // e.g. "Slack Integration"
  description: string
  commands: CapabilityContribution[]  // each is a command
}
```

---

## Sample command (in `vivim-extension.json`)

```json
{
  "id": "send-to-slack",
  "slug": "send_to_slack",
  "name": "Send to Slack",
  "description": "Post a message to a configured Slack channel",
  "category": "communication",
  "tags": ["slack", "send", "messaging"],
  "handler": {
    "kind": "http",
    "url": "https://slack.com/api/chat.postMessage",
    "method": "POST",
    "consentTarget": "slack.com",
    "consentClassification": "communication"
  },
  "surfaces": ["cli", "mcp", "api"],
  "inputSchema": {
    "type": "object",
    "properties": {
      "channel": { "type": "string" },
      "message": { "type": "string" }
    },
    "required": ["channel", "message"]
  },
  "nlPatterns": [
    {
      "pattern": "send {{message}} to {{channel:slug}}",
      "examples": ["send hello to general", "send 'good morning' to my-dm"],
      "priority": 10
    }
  ],
  "docs": {
    "url": "https://myext.dev/commands/send_to_slack",
    "examples": [
      {
        "description": "Send a message to a channel",
        "input": { "channel": "general", "message": "Hello" },
        "output": { "ok": true, "ts": "1234567890.123" }
      }
    ]
  },
  "scope": "user"
}
```

This is one capability exposed as 3 commands (CLI / MCP / API) with 1 NL pattern and 1 doc example. The host registers it; the user can invoke via `vivim send_to_slack --channel general --message hello`, or `mcp__send_to_slack({...})`, or `POST /api/live/send_to_slack`, or just say "send hello to general."

---

## What this fixes

- ✅ NL patterns are runtime-extensible (not just static).
- ✅ Per-command docs.
- ✅ Per-command scope (system/user/workspace).
- ✅ Single mental model: "every command is a capability."

---

## What this does NOT fix

- **NL pattern matching algorithm** is the host's choice. The contract declares the patterns; the matcher is the host's.
- **Command chaining / pipelines** are not in scope. The capability returns a value; the user composes.
- **Command permissions** are still at the sandbox + consent level (Phase 4).
- **CLI ergonomics** (rich output, progress, cancellation) are not standardized.

---

## Open design questions

1. **Can two extensions claim the same NL pattern?** Yes — priority decides. Highest-priority match wins. The user can override the priority at install time.

2. **What if an NL pattern is too generic?** "send X" could match anything. The host's NLCL has to be smart enough. **The contract is permissive; the matcher is the gate.**

3. **Can a command be in multiple groups?** Yes — `tags: [...]` is the cross-group identifier. Grouping is sugar.

4. **What's the difference between a "command" and a "capability"?** In v1 model: nothing. The word "command" is UI sugar for "a capability with `surfaces: ['cli']`."

5. **How does this interact with the engine-declared CLI commands** (`shell.ts:746`)? Engine commands are static; user commands are runtime. Both project to the same `ShellCommandStore`. The host's dispatch is unified. **The user doesn't see the difference.**

6. **What's the test path for an NL pattern?** The contract includes `examples`. The host can run unit tests on "given input X, does it match pattern Y?" The user can test their patterns before installing.

7. **What about NL patterns for surfacing UI?** A pattern like "show me the citations" could mount a slot override. The mount activation model (Step 3.2) covers this: `mount.when: 'on-event'` with the NL match as the event.

---

## Cross-references

- **Step 1.7 (capability system)** — the unified model. "Every command is a capability."
- **Step 2.6 (commands synthesis)** — the 5 invocation paths.
- **Step 3.1 (capability contribution)** — the contract this extends.
- **AGENTS.md (forge)** — "One Entry Point (v10 Invariant). Every operation is a UnifiedCapability."
- **Phase 3 Step 3.7 (synthesis)** — the unified manifest.
