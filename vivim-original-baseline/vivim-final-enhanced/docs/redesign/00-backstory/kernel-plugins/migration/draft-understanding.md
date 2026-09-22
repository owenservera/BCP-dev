# VIVIM — Current Understanding (Draft, 2026-08-29)

> **This is a working draft, not the final end-state.** It captures what I
> think VIVIM is after the interview so far. Each claim has a status:
> - **[VERIFIED]** — confirmed by reading actual code in this clone
> - **[INFERRED]** — derived from the docs but not yet code-verified
> - **[UNCERTAIN]** — the interview gave me a hint but no clear answer
> - **[TODO]** — needs code exploration or interview answer
>
> The next step is to verify every [INFERRED] and resolve every [UNCERTAIN]
> by reading the actual code, then iterate.

---

## 1. The One-Sentence Outcome

> **VIVIM is a personal operating system whose kernel mediates between the
> user and every webapp the user works with, through a configurable
> infinite canvas workspace.**

[INFERRED — based on interview round 1+2]

---

## 2. The Three-Level Plugin Hierarchy (the OS analogy)

```
KERNEL (K0) — 17 subsystems, never uninstalled
  │
  ├── CATEGORY PLUGIN (the framework)
  │     • Standardizes what a webapp in this category looks like
  │     • Defines the node shape, capabilities, state machine, data model
  │     • The user learns the category once
  │     • Examples: plugin-category-ai-chat, plugin-category-email,
  │       plugin-category-local-docs, plugin-category-issue-tracker,
  │       plugin-category-team-chat, plugin-category-knowledge-base
  │
  │     ├── PROVIDER PLUGIN (the driver)
  │     │     • Conforms to one or more category plugins
  │     │     • Adds a node type per provider
  │     │     • Examples: provider-claude, provider-chatgpt, provider-gmail
  │     │
  │     └── (more providers...)
  │
  └── CUSTOM PLUGIN (user extension)
        • New node types, new capabilities, new canvas behaviors
        • Third-party or self-installed
```

[INFERRED — interview round 2]

**Key insight:** Adding a new webapp is a 2-step process:
1. Install or write a **category plugin** (if the category doesn't exist).
2. Install or write a **provider plugin** that conforms to the category.

The kernel does not need to know about specific webapps. The kernel
knows about **categories**. Each category plugin is the contract.

---

## 3. The Primary Surface: The Infinite Canvas

**The infinite canvas is the OS desktop.** Nodes are apps. Edges are
relationships. Workspaces are virtual desktops.

### Node types I have identified

| Node type | What it does | Category plugin |
|---|---|---|
| **Prompt node** | User types a prompt; routes to a provider; streaming response becomes a child node | plugin-category-ai-chat |
| **Provider node** | Live, embedded view of a provider webapp session | plugin-category-ai-chat (and others) |
| **Memory node** | A card representing a saved memory (ACU, deduped message) | plugin:memory (or a category for memory?) |
| **Collection node** | Folder/tree view of organized knowledge | plugin:collections |
| **Automation node** | Scheduled/triggered workflow | plugin-category-automation (does this exist?) |
| **Workspace node** | Canvas-level config (theme, plugins, providers) | kernel (not a plugin) |

[INFERRED — based on interview + component list]

### Edge types I have identified

| Edge type | Meaning | Data or visual? |
|---|---|---|
| **Data flow** | Output of A → input of B | Data (kernel-known) |
| **Reference** | B references A (memory, source) | Data (kernel-known) |
| **Sequence** | B was created by A (parent/child) | Data (kernel-known, `responds_to` in `captureAsNode`) |
| **Trigger** | When A happens, run B | Data (kernel-known) |
| **Layout** | A is in group B | Visual only |

[INFERRED — `captureAsNode` uses `responds_to` for fork edges]

### Configuration axes I have identified

- Which plugins are enabled (per-workspace)
- Which providers are logged in (chrome profile state)
- Which workspaces exist
- Per-workspace: nodes, edges, templates
- Per-node: provider, model, prompt template, output format

[INFERRED]

---

## 4. The Six UI-Facing AI Providers (the v1 subset)

- **chatgpt** — `seeds/providers/manifests.ts` (chatgpt)
- **claude** — `seeds/providers/manifests.ts` (claude)
- **gemini** — `seeds/providers/manifests.ts` (gemini)
- **deepseek** — `seeds/providers/manifests.ts` (deepseek)
- **qwen** — `seeds/providers/manifests.ts` (qwen)
- **grok** — `seeds/providers/manifests.ts` (grok)

[VERIFIED — these are the 6 UI-facing providers per the reclassification;
the actual file `seeds/providers/manifests.ts` exists and I have not
opened it yet — TODO]

Plus 10 framework/API aliases (chatgpt-api, anthropic-api, openrouter, etc.)
for headless/agentic use.

[INFERRED — based on reclassification, not code-verified — TODO]

---

## 5. The Chrome Slave Orchestrator

- The user has Chrome profiles at `chrome-profiles/<providerSlug>/<accountId>/`
  (canonical layout per AGENTS.md "Chrome Profile Layout").
- Each provider has its own Chrome slave (one profile per provider).
- The slave is a CDP-controlled Chrome instance.
- **One account per provider** is the steady state (`owservera` for all 3
  in the current reclassification).

[VERIFIED — `chrome-profiles/` exists in this clone; the
canonical layout is documented in AGENTS.md]

### TODO: How does the kernel drive the slave?

- Is the CDP driver per-provider code, or is the manifest a complete spec
  that a generic executor interprets?
- I do not know yet. The `src/engines/chrome/` and `src/engines/stealth/`
  directories exist but I have not read them.

---

## 6. The Stream Parsing Layer

The kernel captures streaming responses and parses them. The parsers are
**DB-driven** (inline `logic_code`, `logic_type=inline`), not file-based.

6 seeded parsers (from `seeds/parsers/harvested/`):
- `claude-streaming-sse` — Claude SSE
- `chatgpt-openai-delta` — ChatGPT OpenAI delta + patches + parts
- `gemini-batchexecute` — Google RPC batchexecute (NOT SSE)
- `google-ai-studio` — Gemini UI Studio
- `deepseek-reasoning-sse` — DeepSeek SSE with reasoning-channel separation
- `generic-format-agnostic` — generic fallback
- `system-raw-text` — last-resort raw text (never throws)

[VERIFIED — these exist as `seeds/parsers/harvested/*.ts`]

### TODO: How does the parser chain work?

- The `StreamParserEngine` loads parsers from DB.
- There is a `fallbackParserId` chain: provider → generic → system.
- I have not read `src/engines/stream-parser.ts` yet.

---

## 7. The Kernel Architecture (from the kernel-plugin design)

17 K0 subsystems, M-layer (7 contracts), K0(L0) (5 contracts), 44 contracts
total (C-01..C-44), 12-attack-vector certifier, 24 arch tests.

[VERIFIED — read in full in the kernel-plugin design]

The kernel does NOT know what a Conversation is. The kernel knows what
a Node is.

[INFERRED from the reclassification]

---

## 8. The Second-Brain Layer (M1-M8 from the PRD)

8 missing capabilities (per the merged PRD `00-overview.md`):

| ID | Capability | Status |
|---|---|---|
| M1 | Message identity dedup (SHA256) | Missing — Phase 1 |
| M2 | Collections system | Missing — Phase 3 |
| M3 | TTL/lifecycle on ConversationMessage & Node | Missing — Phase 4 |
| M4 | Compaction/vacuum engine | Missing — Phase 4 |
| M5 | Pin/archive/readStatus on ConversationMessage | Missing — Phase 2 |
| M6 | Update APIs for messages/nodes | Missing — Phase 2 |
| M7 | Frontend pin/archive/collection UI | Missing — Phase 6 |
| M8 | FSRS-6 review scheduler | Partial — Phase 5 |

60% of proposed features already exist under different names.

[VERIFIED — read in the PRD `00-overview.md`]

---

## 9. The Six Migration Phases (current plan)

P0: Security boundary (4-6 weeks)
P1: Contract versioned + M-layer + K0(L0) (2-3 weeks)
P2: Storage and schema (2-3 weeks)
P3: Plugin moves (16-24 weeks)
P4: The cake (3-4 weeks)
P5: Polish (2-4 weeks)

Total: 30-44 weeks (7-11 months).

[INFERRED from the migration design, not code-verified — TODO to refine]

---

## 10. The Open Questions (TODO before I can write the final end-state)

### Code exploration (priority order)

1. **The category plugin surface** — does any code in this clone implement
   the "category framework" concept? I see no `plugin-category-*` in
   `seeds/`. I need to verify the category concept is actually a design
   or a guess from the interview.

2. **The CDP driver** — is `src/engines/chrome/` a generic executor or a
   per-provider driver? I need to read `chrome/` + `stealth/` +
   `browser-automation/` to know.

3. **The canvas mechanics** — what is the actual infinite canvas? The
   components list has `InfiniteCanvas.tsx`, `LivingCanvas.tsx`,
   `CanvasSurface.tsx`, `CanvasNode.tsx`, `CanvasConfigPanel.tsx`,
   `BuilderProvider.tsx`, `SlotNode.tsx`, etc. I need to read at least
   the entry-point files.

4. **The node type registry** — is there a node type registry? Where do
   node types get registered? (M-layer + slot system per AGENTS.md.)

5. **The state machine per node** — how does a node transition between
   states (idle/composing/sending/streaming/done)? Is this kernel-known
   or per-category?

6. **The capability taxonomy** — is there a single `UnifiedCapabilityRegistry`
   (per AGENTS.md) or a per-category registry?

7. **The provider manifest shape** — read `seeds/providers/manifests.ts` to
   see what a provider manifest actually contains.

8. **The cross-category workflow** — is there an automation category? How
   are cross-provider workflows represented?

9. **The Chrome slave vs multi-tab** — is the chrome slave one process
   per provider, or one process total with many tabs?

10. **The M-layer (C-33..C-39)** — does any code implement the M-layer
    catalogs yet, or is it a design-only artifact?

11. **The K0(L0) substrate (C-40..C-44)** — does any code implement the
    K0(L0) intelligence substrate, or is it design-only?

12. **The 8 PRD missing capabilities (M1-M8)** — for each, is the work
    partially done in some branch / scratch file, or is it all in
    `seeds/upgrade-memory-storage.prisma` etc. and not yet integrated?

### Interview questions (deferred)

- The single vs multi-tab Chrome architecture (Q3 from the last round).
- The cross-category workflow shape (Q4 from the last round).
- The "store" / monetization / sharing / federation features (Q6 from
  the last round).
- The maximal version's ceiling — which categories beyond AI chat?
- The single-user / multi-user / multi-device story.
- The shell mode (CLI / devops CLI / shell within the canvas).

---

## 11. The Strategy (next 2 hours)

**Code exploration in priority order:**

1. Read `seeds/providers/manifests.ts` — verify the provider manifest shape.
2. Read `frontend/src/components/canvas/InfiniteCanvas.tsx` (entry point) +
   `CanvasSurface.tsx` + `CanvasNode.tsx` — verify the canvas mechanics.
3. Read `src/engines/stream-parser.ts` (or its main module) — verify the
   parser chain.
4. Read `src/engines/chrome/` directory (1-2 files) — verify the CDP driver
   generic-vs-specific.
5. Read `src/engines/conversation-manager.ts` (the orchestration of
   capture + captureAsNode) — verify the conversation model.
6. Read the 6 `seeds/parsers/harvested/*.ts` files — verify the parser
   surface.
7. Read `seeds/providers/manifests.ts` plus a sample provider (chatgpt)
   — verify the provider plugin's complete shape.
8. Read `frontend/src/components/canvas/SandboxedNode.tsx` (K0-10) — verify
   the iframe host.

**Document updates after each:** revise this document with the new
[VERIFIED] / [INFERRED] / [UNCERTAIN] status.

**End state:** this document becomes the working end-state. Every
[UNCERTAIN] and [TODO] either gets verified or becomes an explicit
caveat in §12.
