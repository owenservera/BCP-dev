# Step 1.9: Harness / Repair — The Execution Model

**Date:** 2026-08-28
**Read:**
- `kernel/execution/harness-runtime.ts` (500 lines, partial — first 120)
- `kernel/execution/harness-repair-engine.ts` (284 lines, partial — first 100)
- **Status:** READ + ANALYZED

**Critical finding:** The "harness" is two related but distinct systems:
1. **`HarnessRuntime`** — a **server-side capability DAG executor** that runs multi-step CDPs (Chrome DevTools Protocol) commands against a browser. Not user-configurable. Uses an immutable `HarnessNode` AST (sequence, branch, parallel, retry, precondition, step) executed against a `ChromeGovernor`.
2. **`HarnessRepairEngine`** — a **browser-free, LLM-output-tolerant repair pipeline** that takes a string from an LLM and tries to coerce it to match a Zod schema. Quote balancing, trailing-comma fix, alias remapping. Side-table repair metadata, no prototype patching.

Neither is the "execution model" for a user extension. They are the **runtime for chat-provider capabilities** (CDP steps) and the **LLM-output cleaning** layer. A user extension would interact with both indirectly: live capabilities call handlers (Step 1.7), not DAGs.

---

## What the code does

### `HarnessRuntime` (harness-runtime.ts)

From the file header (line 1-5): "HarnessRuntime — server-side capability DAG executor. Executes multi-step capability DAGs by sending atomic CDP commands through the Governor's CDPProxy. **Never blocks Chrome's event loop.** Modules are composable server-side functions registered by capability slug."

**HarnessNode AST** (lines 13-19) — a discriminated union of 6 node types:
- `sequence { steps: HarnessNode[] }` — run steps in order
- `branch { condition: HarnessCondition, then: HarnessNode, alternative?: HarnessNode }` — if/else
- `parallel { steps: HarnessNode[] }` — run in parallel
- `retry { maxRetries, backoffMs, step }` — retry wrapper
- `precondition { checks: string[], step }` — pre-check wrapper
- `step { moduleId, input, outputKey }` — single module call

**HarnessCondition** (lines 21-40) — 10 condition types: `selector_exists`, `element_visible`, `element_contains_text`, `page_url_matches`, `page_title_contains`, `element_count_gt`, `element_has_class`, `url_matches`, `text_contains`, `variable`. All browser-state checks.

**HarnessContext** (lines 42-49) — the runtime API exposed to a module: `query(selector)`, `queryAll(selector)`, `waitFor(selector)`, `getPageState()`, `intercept(pattern)`, `emitTelemetry(event)`. This is the **surface a "harness module" sees.** Browser-aware primitives only.

**HarnessModuleResult** (lines 51-56) — `{ ok, output, domState?, error? }`. Modules return a typed result.

**Telemetry + progress events** (lines 58-72) — modules emit `selector_hit`, `selector_miss`, `dom_interaction`, `network_intercept`, `error`. Progress events report step N of M.

**`HarnessRuntime` class** (lines 82-500):
- `modules: Map<string, HarnessModule>` — a module registry. `register(module)` adds a named module.
- `execute(dag: HarnessDAG)` — walks the AST, builds a `HarnessContext` (real if `governor` + `slaveId` are configured, otherwise a stub), executes top-level as a `sequence`. Emits `capability:progress` events on the bus.
- The execution is recursive over the AST (`executeNode` for the tree walker; not shown in the first 120 lines).

This is the "execute a CDP browser program" layer. **It is not a user-configurable execution model.** The user (or a higher-level system) writes a DAG, the harness runs it against a browser.

### `HarnessRepairEngine` (harness-repair-engine.ts)

From the file header (line 1-12): "Harness I/O Repair Engine (017-harness-command-registry, US2 / FR-006, FR-008). **Browser-free, LLM-output-tolerant repair.** The pasted design proposed a `z.ZodType.prototype.repair` monkey-patch; we instead carry repair metadata in a SIDE-TABLE (`src/schema/repair-metadata.ts`) keyed by the Zod type — no prototype mutation, no global state, works under multiple schema instances. Key defect fixed: the pasted design repaired unbalanced quotes with a blind `'` -> `"` substitution that corrupts legitimate apostrophes ('O'Brien'). We only balance quotes when the count is ODD, and never touch interior apostrophes."

**`RepairResult`** (lines 24-29): `{ ok, data?, repairs: string[], errors: string[] }`.

**`RepairInput`** (lines 31-36): `{ content, schema, conversationId?, commandId? }`.

**`HarnessRepairEngine` class** (lines 38-284):
- Constructor takes a `HarnessRepairStore` (the audit log).
- **`repair(input)`** (line 42) — two-pass repair:
  - Pass 1: `repairStringShape(working, repairs)` — quote balancing, trailing-comma fix, code-fence strip. (Body partially shown, line 99+.)
  - Pass 2: `parseAndCoerce(working, schema, repairs, errors)` — parse and validate/coerce against the Zod schema.
- Saves a `RepairSession` row to the store with the full audit trail (original content, repaired content, strategy, success, errors, repairs).
- On success: returns the parsed data.
- On failure: throws `HarnessRepairError` with the cause + repair log.

The repair metadata lives in a side-table (`src/schema/repair-metadata.ts`) — explicit, no prototype patching. Alias remapping is per-field via `repairString({ aliases: [...] })`.

---

## Key observations

- **The harness is a **DAG executor**, not a "user-configurable program" model.** The AST is concrete (sequence, branch, parallel, retry, precondition, step). The user doesn't write DAGs; the system emits them from capability bindings. `HarnessRuntime.register()` accepts `HarnessModule` — server-side functions keyed by `moduleId`. This is **closed at the user level**; the modules are engine code.

- **`HarnessContext` is browser-only.** The runtime API is `query(selector)`, `waitFor(selector)`, `intercept(pattern)` — all CDP operations. There is no way to call into user code from a `HarnessContext`. A user extension cannot contribute a `HarnessModule`.

- **The harness is the executor for chat-provider capabilities.** It's the bridge between `CapabilityEngine` (which knows about a capability slug) and the browser. The capability binding includes a recipe (DAG); the harness runs it.

- **Harness repair is for LLM output, not user code.** The `HarnessRepairEngine` is called when the LLM (during harness execution) returns text that should match a Zod schema. The repair is **input/output hygiene**, not a user extension point.

- **The repair is schema-aware via a side-table.** The comment at line 6-7 explicitly says "no prototype mutation, no global state, works under multiple schema instances." This is a clean design — `getRepairMetadata(zodType)` returns the repair config for that type. The side-table is the `RepairMetadataRegistry` (not read in this step).

- **The repair preserves apostrophes inside strings.** Lines 9-12 of the header. A defect fix: "O'Brien" was being corrupted. The new behavior: only balance quotes when the count is ODD per line. This is a small but real engineering decision documented in the file.

- **Every repair attempt is audited.** Line 65, 85: `saveRepairSession` writes to the store. The store is `HarnessRepairStore` (storage contract). The audit log is queryable.

- **The harness is event-emitting.** `eventBus.emit({ type: 'capability:progress', step, total, description, moduleId, slaveId })` (line 115-120). So a UI can show progress. The bus is the standard `CapabilityEventBus`.

- **`HarnessModule` is the unit a developer can register.** Line 94. `{ name, run(ctx, input) => HarnessModuleResult }`. The runtime keeps a map. Multiple modules compose into DAGs. This is **developer extensibility, not user extensibility.**

- **The repair engine does NOT execute user code.** It parses, coerces, fixes common LLM errors. It does not eval anything. So the security boundary here is Zod's own — input passes through `schema.parse()` and `schema.safeParse()`.

- **The 10 condition types are all browser-state.** `selector_exists`, `element_visible`, `page_url_matches`, etc. None are about user state, user data, or user files. The harness is the chat-provider world, not the user world.

- **There's a `HarnessProtocolEngine` (9877 lines, not read)** — probably the parser for the "harness program" DSL (the YAML/JSON spec a user might write that compiles to a DAG). Will look at in Phase 3.

- **There's a `HarnessCommandRegistry` (4459 lines, not read)** — semver version resolution, required-field validation. This is the schema repo for harness commands. From the AGENTS.md: "HarnessCommand — versioned command definitions with JSON schema (seeded from `seeds/harness/commands.json`)".

- **There's `HarnessCheckpoint` (2798), `HarnessFeedbackCoordinator` (4324), `HarnessProtocolEngine` (9877).** The harness has at least 4 supporting subsystems. The "execution model" is not one file; it's a family.

- **`HarnessContext.intercept(pattern)` is interesting.** Line 47. A module can register a network-intercept regex and receive the body. This is the "wire-tap" pattern — the harness sees the raw streaming response. Used by parsers to consume the provider's wire format.

- **The harness has a stub context (line 105).** When no governor is configured, the context returns safe defaults. So the harness can be unit-tested without a browser. This is a real testability win.

---

## Key questions raised

1. **Who writes the DAGs?** The harness DAG is the execution plan for a capability binding. The bindings come from `provider_capability` rows in the DB (Step 1.6). The DAG is presumably auto-generated from the binding's `recipe` field. The generation path is `HarnessProtocolEngine` (9877 lines). The user (or developer) writes a YAML/JSON spec; the protocol engine compiles it to a DAG.

2. **Is there a user-facing DSL for the harness?** If `HarnessProtocolEngine` parses user-friendly input, then the "user-configurable program" is the harness program. The DSL is in `reprogrammability/dsl/` (Step 1.4), which is *different* from the harness protocol. Are they the same? Need to compare.

3. **What are `seeds/harness/commands.json`?** AGENTS.md says these are versioned command definitions. They are seeded at boot. A command is presumably a reusable step pattern. The `HarnessCommandRegistry` is the schema + validation.

4. **What's the relationship between `HarnessRepairEngine` and `LiveCapabilityRegistry`?** Both are about LLM output. The repair engine cleans LLM output to match a Zod schema. The live registry's MCP handler routes through `tool-orchestrator-facade.js` which presumably has its own error handling. They are siblings, not integrated.

5. **Where is `repair-metadata.ts`?** The side-table referenced in the header. Not read yet. It's the side-channel for `getRepairMetadata(zodType)`. Probably a module-level Map.

6. **What is `HarnessFeedbackCoordinator`?** 4324 lines. Probably handles retry prompts to the LLM with diffs. From AGENTS.md: "escalating retry prompts with exponential backoff + diff (never repeats same prompt)".

7. **What is `HarnessCheckpoint`?** 2798 lines. Probably saves harness state for resume. The harness can be long-running; checkpoints let it recover.

8. **Does the harness support user-defined modules?** The `HarnessRuntime.register()` is the only public registration API. It's a function. A user (or a plugin) could call it at boot, but there's no discovery mechanism. The modules are likely hard-coded in `default-caps.ts` or in a similar builder.

9. **What is `HarnessRuntime`'s total LOC (500)?** The first 120 lines are types + class signature. Lines 121+ would have `executeNode`, the AST walker, the module dispatch, the error handling, the stub/real context switch. The big questions: is it safe with malformed DAGs? Does it have cycles? What's the failure mode?

10. **Can a user `prog-<capabilitySlug>-<providerId>` slug reference a user-defined capability?** The `setProgramResolver` on `UnifiedCapabilityRegistry` (Step 1.7) takes a `slug → capability` function. If a plugin provides a resolver, yes. Otherwise, only the engine's resolver is used.

---

## Cross-references

- **Step 1.7 (capability system)** — `CapabilityEngine` is a separate system that *uses* harness programs. `prog-*` slugs reference harness programs. The `setProgramResolver` is the bridge.
- **Step 1.6 (provider plugins)** — provider manifests have a `capabilities_config.ui_*_override` and `recovery_strategies` (Step 1.6 question 7). The recovery strategies (`retry_selector`, `navigate_home`, etc.) map to `HarnessCondition` types in the runtime. The bridge is the recipe: provider's `recovery_strategies` → harness program.
- **Step 1.11 (security/sandbox)** — will read next. The inline handler in live caps uses `SandboxRunner`. The harness runtime uses `ChromeGovernor` (browser). These are two different execution sandboxes.
- **`kernel/execution/harness-protocol-engine.ts`** (9877 lines) — likely the YAML/JSON → DAG compiler. The user-facing "harness program" syntax.
- **`kernel/execution/harness-command-registry.ts`** (4459 lines) — semver versioning + validation of harness commands. The schema library.
- **`kernel/execution/harness-feedback-coordinator.ts`** (4324 lines) — LLM retry with backoff and diff.
- **`kernel/execution/harness-checkpoint.ts`** (2798 lines) — save/restore harness state.
- **`work/forge/src/engines/harness/`** — 17 supporting files. `harness-executor-engine.ts` (6365 lines) is the high-level wrapper. `program-schema.ts` (1848) is probably the Zod schema for a program. `recipe-compiler.ts` (7359) compiles recipes to DAGs.
- **`kernel/execution/tool-orchestrator-facade.ts`** (4279 lines) — the 4-stage pipeline. Used by the live MCP handler (Step 1.7).
- **`kernel/execution/execution-kernel.ts`** (9541 lines) — the top-level execution layer. Probably orchestrates harness + capability + tool-orchestrator.
- **`work/forge/src/reprogrammability/dsl/`** — the user-facing DSL. Different from harness. Are they meant to be one? (The `harness-protocol-engine` and `dsl/parser` may be redundant or may serve different layers.)
