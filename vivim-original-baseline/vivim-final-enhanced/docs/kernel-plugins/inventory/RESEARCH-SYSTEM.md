# Atomic Inventory — Research & Exposure System

> **Purpose:** Produce a 150–200 item, product-language, code-anchored inventory of every atomic feature/capability and show which layer it belongs to — so a non-engineer can read, debate, and lock the boundaries. Then keep the inventory live (repeatable) as the codebase evolves.

---

## 1. The Three Levels (product language, not file paths)

| Level | Plain English | Ask yourself | Can a customer disable it? | Can a plugin replace it? |
|-------|---------------|--------------|----------------------------|--------------------------|
| **CORE KERNEL** | The foundations the product cannot run without — like the foundation, plumbing, and electrical of a building. | "If this broke, would the whole product stop working — not just one feature?" | No | No |
| **CORE DEFAULT PLUGINS** | Features that ship with the product, on by default, but are modular — like kitchen appliances that come with an apartment but can be swapped. | "Is this a feature a user recognizes and could imagine turning off, even though it ships by default?" | Yes (disable) | Yes (replace via trusted plugin) |
| **GENERIC PLUGIN CAPABILITIES** | What any plugin author (you, a partner, a customer) can add — like what a tenant is allowed to renovate. | "If a plugin author wanted this, would they need the kernel to allow it?" | N/A — plugins add | N/A — this *is* the surface |

**Tooling** (`docs/kernel-plugins` Layer 3) is separate: scaffolding, dev server, validator — the tools that *build* plugins, not the plugins themselves.

**Rule of thumb for this document:** If you hesitate between CORE and DEFAULT PLUGIN, ask "would we ship a version of Vivim *without* this and still call it Vivim?" If yes, it is not CORE.

---

## 2. How the Inventory Was Built (repeatable)

This is not hand-waving. Four passes, each grounded in a concrete source file list, so the next person can re-run it after any refactor.

### Pass 1 — Enumerate raw material (machine)

Sources scanned in this clone on 2026-08-28:

- **Engines:** 186 files in `src/engines/*.ts` (`Get-ChildItem src/engines -Filter *.ts | Measure-Object` → 186)
- **Storage contracts:** 40+ files in `src/storage/contracts/*.ts`
- **Prisma models:** 200 `model` blocks in `prisma/schema.prisma` (`Select-String "^model "` → 200)
- **Engines kernel:** 10 files in `src/engines/kernel/`
- **Frontend components:** ~80 in `frontend/src/components/canvas/*` + `frontend/src/shared/*` (36 modules)
- **Providers:** 9 manifests in `seeds/providers/*.json` + `manifests.ts`
- **Conceptual model:** `shared/conceptual-model.ts` (ProviderTypeSlug, PrimitiveScope, slots, interaction grammar)

A small probe script (future: `inventory/probe.ts`, not hand-written lists) walks those directories, extracts exported symbols / model names / component names, and emits a deduped raw list. For I-2 we ran the walk manually via `Get-ChildItem` + `Select-String` and transcribed into `ATOMIC-INVENTORY.md`. For I-3 the probe script will be checked in so the inventory can be regenerated with `bun run inventory:probe`.

### Pass 2 — Translate to product language (human)

Each raw item was translated from engineering name → product sentence:

- `ProviderAccount` → "Provider account — save and switch logins (Claude, ChatGPT, Gemini…)"
- `SandboxedNode.tsx` → "Sandboxed UI frame — plugins run in an isolated iframe that cannot touch the product"
- `harness-command-registry.ts` → "Harness commands — reusable browser-automation recipes"

One line = one atomic capability a customer could roughly explain to another customer.

### Pass 3 — Classify by layer (human + rule)

For each line, apply the three-level test (§1) plus the code-anchoring rules from `PLAN.md` D1–D7 and audit B1–B6:

- File lives in `src/server/bootstrap/*`, `src/schema/node.ts`, `src/storage/contracts/*`, `src/engines/capability-event-bus*`, `src/engines/kernel/*`, `shared/ui-component.ts` (shape) → strong CORE candidate.
- File is an engine whose feature is user-visible and could be disabled (e.g., `memory-engine.ts`, `chrome-governor.ts`, `workflow-engine.ts`, `knowledge-extractor.ts`, `mcp-*`) → CORE DEFAULT PLUGIN candidate.
- Contribution type appears in `PluginManifest.contributes` (`schema`, `ui.generated`, `services`) → GENERIC PLUGIN CAPABILITY. Future `harness`, `features`, `ui.compiled` → GENERIC (v2, flagged).
- Borderline items are marked **[DEBATE]** in the inventory so the lock-in discussion focuses on them, not on the 80% that are obvious.

### Pass 4 — Expose (machine + human)

Outputs:

- `ATOMIC-INVENTORY.md` — single markdown with 150–200 numbered rows, each row: `ID · Product sentence · Layer tag · Code anchor · One-line note · [DEBATE?]` — printable, checkable.
- `visual/inventory.html` — filterable HTML (layer toggle, search, debate-only filter). Open directly, no build.
- `STATUS.md` references the inventory as the boundary-lock artifact; once the user and agent lock it, `MAP.md` and `PLAN.md` are updated in the same PR.

---

## 3. How We Iterate and Lock

1. **Read** `ATOMIC-INVENTORY.md` top to bottom — 180 rows, grouped by product domain, not by engineering folder.
2. **Mark** each **[DEBATE]** row with your call: CORE | DEFAULT PLUGIN | GENERIC. Add comments inline or in `visual/inventory.html` (each row has a note field that exports to JSON).
3. **Agent reclassifies** flagged rows and updates `MAP.md` (layer taxonomy) + `PLAN.md` (per-axis contracts) + `STATUS.md` (phase tracker) in one follow-up PR.
4. **Re-probe** after any large refactor: `bun run inventory:probe` regenerates raw list; diff against previous `ATOMIC-INVENTORY.md` to catch drift.

A row is "locked" when it has no **[DEBATE]** marker and a code anchor. The inventory is locked when zero debate rows remain.

---

## 4. Layer Fit Test (printable decision tree)

For any new feature that appears later, run this test and file it under the answer:

```
Q1: Does the feature give a new capability to plugins? (e.g., "let plugins add X")
  → YES → GENERIC PLUGIN CAPABILITY (add to manifest contributes)
  → NO ↓
Q2: Is the feature user-visible and could be turned off while the product still runs?
  → YES → CORE DEFAULT PLUGIN (ship in plugins/core/, trusted:true, can be disabled)
  → NO ↓
Q3: Is it infra that every other feature depends on (boot, events, storage, sandbox, encryption, config)?
  → YES → CORE KERNEL (src/plugin-kernel or src/schema or src/storage/contracts, never pluggable)
  → NO → Re-ask Q1 with sharper product sentence — the sentence is probably too broad.
```

---

## 5. What Counts as "Atomic"

One line = one thing a customer can point to. Not "Memory System" (too broad), not "fsrs-scheduler.ts line 42" (too narrow). Instead:

- Good: "Memory — recall a previous conversation by meaning, not just keywords" (`memory-engine.ts` + `SemanticMemory` model)
- Bad: "Memory Engine (1500 lines)"

If a row feels like it hides two product capabilities, split it. If two rows always ship together and a customer cannot distinguish them, merge them. The 150–200 target forces atomicity without pedantry.

---

*Next: `ATOMIC-INVENTORY.md` — the 180-row list produced by Passes 1–3 in I-2. `visual/inventory.html` — the explorable twin.*
