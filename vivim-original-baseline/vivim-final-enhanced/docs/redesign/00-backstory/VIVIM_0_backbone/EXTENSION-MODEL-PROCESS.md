# EXTENSION-MODEL RESEARCH PROCESS

> **Purpose:** A structured, atomic, code-only research process to design the VS Code-style extension model for vivim-next. Each step is one file/area, one output artifact, one commit. New sessions can pick up where this one left off.
>
> **Rule:** Read the code. No docs. No assumptions from the outside. The code is the only source of truth.

---

## The 5 Phases

```
Phase 1: BASELINE      (what exists today for plugins/extensions)
Phase 2: EXTENSION POINTS (every place the system can be extended)
Phase 3: CONTRACT SURFACE (what an extension would actually need to access)
Phase 4: SECURITY MODEL (what extensions can vs cannot do)
Phase 5: LIFECYCLE & DISTRIBUTION (load, unload, hot-reload, marketplace)
```

**Order matters.** Each phase depends on the previous. Don't skip.

---

## Phase 1: BASELINE — What Exists Today

**Goal:** Understand exactly what's already there. No design opinions.

### Step 1.1: F-022 plugin-system (the "plugin system" the code calls itself)
- **Read:** `plugins/plugin-system/plugin-system.ts`
- **Record:** What `ProviderPlugin` interface exposes. What hooks exist. Who calls `register()`. What events fire.
- **Output:** `research/01-baseline/01-f022-plugin-system.md`
- **Already done:** See `EXTENSION-MODEL-RESEARCH/01-f022-plugin-system.md` (if exists) or do it fresh.

### Step 1.2: F-022 plugin-hot-reload
- **Read:** `plugins/plugin-system/plugin-hot-reload.ts`
- **Record:** What directory it watches. What file types. How `loadPlugin()` / `unloadByPath()` work. What's the ProviderPlugin shape here vs plugin-system.ts (different!).
- **Output:** `research/01-baseline/02-f022-plugin-hot-reload.md`
- **Key question to answer:** Are the two `ProviderPlugin` interfaces in the same card the same interface? Or are they competing designs?

### Step 1.3: F-022 router-capability-bridge
- **Read:** `plugins/plugin-system/router-capability-bridge.ts`
- **Record:** What this is NOT (not a plugin runtime — it's a static table that auto-registers HTTP routes as capabilities). Confirm it has nothing to do with extensions.
- **Output:** `research/01-baseline/03-f022-router-bridge.md`
- **Key question to answer:** Is this misnamed? Does "plugin" in the filename have a different meaning here?

### Step 1.4: Reprogrammability module (the "user-configurable programs" concept)
- **Find:** All files related to "reprogram", "reprogrammability", "reconfigur"
- **Read:** Whatever exists — there is no dedicated dir, this is a concept
- **Record:** What "reprogrammable" means in the codebase. Where surfaces are defined. How mutations work.
- **Output:** `research/01-baseline/04-reprogrammability.md`
- **Expected:** This may be aspirational / minimal. Note what's there vs what's missing.

### Step 1.5: Surface system (the "canvas" / "screen" extension point)
- **Read:** `surfaces/web/src/canvas/*.ts` — start with `live-config.ts`, then `store.ts`, then `commands.ts`
- **Record:** What a "Surface" is. How surfaces are registered. How mutations are applied. The SurfaceKind enum and its current values.
- **Output:** `research/01-baseline/05-surface-system.md`
- **Key question to answer:** Is the surface system designed to be extended by user code, or just by us?

### Step 1.6: Provider plugin system (chatgpt, claude, etc as "plugins")
- **Read:** `plugins/provider/provider-registrar.ts` + look at how `chatgpt`, `claude`, `gemini` get registered
- **Record:** This is a "plugin" today — provider plugins. Understand the registration pattern. Is it data-driven (manifest + parsers) or code-driven (imports + class)?
- **Output:** `research/01-baseline/06-provider-plugins.md`
- **Key question to answer:** How much of the "VS Code extension model" is already in the provider plugin design?

### Step 1.7: Capability system (the "command palette" equivalent)
- **Read:** `kernel/capability/capability.ts`, `unified-registry.ts`, `live-capability-registry.ts`
- **Record:** What a `UnifiedCapability` is. How commands are registered. The category system. Surface flags.
- **Output:** `research/01-baseline/07-capability-system.md`
- **Key question to answer:** Could a "capability" be the unit an extension provides?

### Step 1.8: Capability bootstrap (the "manifest" equivalent)
- **Read:** `kernel/capability/capability-bootstrap.ts`, `capability-bootstrap-generated.ts`
- **Record:** How capabilities get registered at boot. Is there a manifest? Is it generated? Manual?
- **Output:** `research/01-baseline/08-capability-bootstrap.md`
- **Key question to answer:** Is the capability system the natural place where extensions would register what they provide?

### Step 1.9: Harness / repair (the "execution" model)
- **Read:** `kernel/execution/harness-runtime.ts`, `harness-repair-engine.ts`
- **Record:** How actions are executed. What "harness commands" are. How repair works on failures.
- **Output:** `research/01-baseline/09-harness-system.md`
- **Key question to answer:** Could an extension provide a custom harness command (like VS Code's `commands.registerCommand`)?

### Step 1.10: Memory & knowledge (the "extension data" model)
- **Read:** `plugins/memory/memory-engine.ts`, `plugins/retrieval/knowledge-graph/knowledge-envelope.ts`
- **Record:** How memory is stored. How knowledge graphs work. Can extensions read/write to memory?
- **Output:** `research/01-baseline/10-memory-knowledge.md`
- **Key question to answer:** Is there a "data API" an extension would use, or do they have to import internals?

### Step 1.11: Security & sandbox (the "trust boundary")
- **Read:** `kernel/security/safe-eval.ts`, `sandbox-runner.ts`, `kernel/security/consent-engine.ts`
- **Record:** What code is sandboxed today. What's the sandbox model. How is consent/permission handled (if at all).
- **Output:** `research/01-baseline/11-security-sandbox.md`
- **Key question to answer:** Is there ANY sandbox we could re-use for extension code?

### Step 1.12: Frontend plugin system (UI side)
- **Find:** `surfaces/web/src/plugin*` or `surfaces/web/src/extension*`
- **Read:** Whatever exists
- **Record:** Is there a frontend extension model? How are UI plugins loaded?
- **Output:** `research/01-baseline/12-frontend-extensibility.md`
- **Key question to answer:** Is the frontend as extensible as the backend, or is it a closed system?

### Step 1.13: Storage & contracts (the "API surface" for extensions)
- **Read:** `kernel/storage/contract/` — read 3-4 representative contracts
- **Record:** How contracts work. The pattern for storage. How a new contract would be added.
- **Output:** `research/01-baseline/13-storage-contracts.md`
- **Key question to answer:** Are contracts the right way for extensions to access data, or is there a different pattern?

### Step 1.14: Distribution (how plugins reach users)
- **Find:** Anywhere that mentions "marketplace", "install", "update", "version" for plugins
- **Read:** Whatever exists
- **Record:** Is there any distribution mechanism? How do providers get added today?
- **Output:** `research/01-baseline/14-distribution.md`
- **Key question to answer:** What would a marketplace need to integrate with today?

### Step 1.15: BASELINE SYNTHESIS
- **Write:** `research/01-baseline/00-SYNTHESIS.md`
- **Contents:** Map of what exists, what doesn't, what's aspirational, what's real. The "real extension surface" today vs the "aspirational extension surface" in design docs.
- **Critical output:** This is the foundation for Phase 2.

**Commit after each step.** Each output file is one commit. Atomic.

---

## Phase 2: EXTENSION POINTS — Every Way the System Can Be Extended

**Goal:** Catalog every existing extension point. Each one is a candidate for what user extensions would also touch.

### Step 2.1: Scan for "register" / "add" / "extend" patterns
- **Search:** All files matching: `register(`, `addListener(`, `extend(`, `mount(`, `install(`, `subscribe(`
- **Record:** For each match, what is being registered, by whom, and how it integrates
- **Output:** `research/02-extension-points/01-register-patterns.md`
- **Key question to answer:** What's the consistent shape of "register something" across the codebase?

### Step 2.2: Catalog every interface/contract
- **Read:** List of all TypeScript interfaces in `kernel/`, `plugins/`, `surfaces/`
- **Record:** What they accept, what they return, what implements them
- **Output:** `research/02-extension-points/02-interfaces.md`
- **Key question to answer:** Which interfaces are "stable contract" vs "internal implementation detail"?

### Step 2.3: Find the "lifecycle" hooks
- **Search:** `onRegister`, `onAction`, `onParse`, `onProjectState`, `onResolveCapabilities`, `onMount`, `onLoad`, `onUnload`
- **Record:** For each lifecycle hook, when it fires, what it can do, who calls it
- **Output:** `research/02-extension-points/03-lifecycle-hooks.md`
- **Key question to answer:** Is there a consistent "thing that runs at X time" pattern, or is it ad hoc?

### Step 2.4: Find the "data" surfaces
- **Search:** Prisma models, storage contracts, `*Store` types
- **Record:** What data exists. What can be read/written. Where the boundaries are.
- **Output:** `research/02-extension-points/04-data-surfaces.md`
- **Key question to answer:** Could an extension read/write to user data without corrupting the schema?

### Step 2.5: Find the "UI" surfaces
- **Read:** How a UI surface (chat composer, message list, sidebar) gets rendered
- **Record:** Are UI surfaces hard-coded, configurable, or extensible?
- **Output:** `research/02-extension-points/05-ui-surfaces.md`
- **Key question to answer:** Could an extension add a new button, panel, or view?

### Step 2.6: Find the "command" surfaces
- **Search:** Where `commands.*` is registered, where `slashes.*` is defined, where NLCL patterns live
- **Record:** All the "things the user can invoke" — by command, by name, by NL phrase
- **Output:** `research/02-extension-points/06-commands.md`
- **Key question to answer:** Is there a single "command palette" or are commands scattered?

### Step 2.7: EXTENSION POINTS SYNTHESIS
- **Write:** `research/02-extension-points/00-SYNTHESIS.md`
- **Contents:** The complete map of every place the system can be extended. Each marked as: (a) already supports user extensions, (b) supports our extensions only, (c) closed / hard-coded.
- **Critical output:** This is the foundation for Phase 3 — "what an extension would need to touch."

---

## Phase 3: CONTRACT SURFACE — What an Extension Would Need

**Goal:** Design the API surface that an extension would see. Not the implementation — the contract.

### Step 3.1: Capability contribution
- **Question:** Can an extension add a new capability? How?
- **Read:** Phase 1.7 + Phase 1.8 outputs. Look at `UnifiedCapability` shape.
- **Output:** `research/03-contract/01-capability-contribution.md`
- **Question to answer:** Is the existing `capability` field in plugin-system.ts (Phase 1.1) the right model? Or does it need to be more general?

### Step 3.2: Surface contribution
- **Question:** Can an extension add a new UI surface? A new canvas panel? A new sidebar tab?
- **Read:** Phase 1.5 (live-config) + `reprogrammability/contract.ts`
- **Output:** `research/03-contract/02-surface-contribution.md`
- **Question to answer:** Is the ReprogrammableSurface design (Phase 1.4) the right contract?

### Step 3.3: Command contribution
- **Question:** Can an extension add a new command? A new NL pattern?
- **Read:** Phase 2.6 (commands surface)
- **Output:** `research/03-contract/03-command-contribution.md`
- **Question to answer:** Does the existing `capability` model cover commands, or do we need a separate `command` type?

### Step 3.4: Provider contribution (chat backend)
- **Question:** Can an extension add a new chat provider (like a new LLM service)?
- **Read:** Phase 1.6 (provider plugins)
- **Output:** `research/03-contract/04-provider-contribution.md`
- **Question to answer:** Is the data-driven provider system (manifest + parsers) reusable as the "extension" model for LLM providers?

### Step 3.5: Storage contribution
- **Question:** Can an extension add a new storage type (a new table, a new file format)?
- **Read:** Phase 1.13 (storage contracts)
- **Output:** `research/03-contract/05-storage-contribution.md`
- **Question to answer:** Is the contract pattern the right model, or do extensions need a different access pattern?

### Step 3.6: Lifecycle contribution
- **Question:** Can an extension hook lifecycle events (boot, shutdown, conv-start, etc)?
- **Read:** Phase 2.3 (lifecycle hooks) + look at `CapabilityEventBus`
- **Output:** `research/03-contract/06-lifecycle-contribution.md`
- **Question to answer:** Is the event bus the right hook surface, or do we need a more structured lifecycle?

### Step 3.7: CONTRACT SYNTHESIS
- **Write:** `research/03-contract/00-SYNTHESIS.md`
- **Contents:** A single "extension manifest schema" — what an extension's package.json / vivim-extension.json would look like. Synthesized from 3.1-3.6.
- **Critical output:** This is THE artifact for Phase 4. It defines the surface area.

---

## Phase 4: SECURITY MODEL — What Extensions Can vs Cannot Do

**Goal:** Trust boundaries. What's a capability? What's a permission? What's off-limits?

### Step 4.1: Existing permission system
- **Read:** `kernel/security/consent-engine.ts`, `policy-engine.ts`, `governance-engine.ts`
- **Record:** What permissions exist. How consent is requested. What's blocked today.
- **Output:** `research/04-security/01-existing-permissions.md`
- **Question to answer:** Is the existing consent/policy model the right base for extension permissions?

### Step 4.2: Existing sandbox model
- **Read:** `kernel/security/safe-eval.ts`, `sandbox-runner.ts`, `sandbox-runner-quickjs.ts`
- **Record:** What's sandboxed. How code runs in the sandbox. Limits.
- **Output:** `research/04-security/02-existing-sandbox.md`
- **Question to answer:** Can extension code run in the QuickJS sandbox? What can it do there vs outside?

### Step 4.3: Trust levels
- **Question:** What trust does a user extension get? A system extension? A bundled extension?
- **Read:** Whatever exists; may need to design from scratch
- **Output:** `research/04-security/03-trust-levels.md`
- **Question to answer:** Is there a 3-tier system (user / workspace / system) like VS Code? Or just one tier?

### Step 4.4: Resource limits
- **Question:** How would we cap an extension's CPU, memory, network, storage?
- **Read:** Whatever exists
- **Output:** `research/04-security/04-resource-limits.md`
- **Question to answer:** Are there existing rate limiters, budgets, or quota systems we can reuse?

### Step 4.5: Supply chain (signing, updates)
- **Question:** How would we know an extension is from who it says it's from?
- **Read:** Whatever exists; likely nothing
- **Output:** `research/04-security/05-supply-chain.md`
- **Question to answer:** Is the user OK with no signing in v1? Or is this a blocker for "VS Code-style"?

### Step 4.6: SECURITY SYNTHESIS
- **Write:** `research/04-security/00-SYNTHESIS.md`
- **Contents:** The trust model. What an extension can do, can't do, must declare. Permissions schema. Sandbox model.
- **Critical output:** Defines the security contract for every extension.

---

## Phase 5: LIFECYCLE & DISTRIBUTION

**Goal:** How does an extension get from "user wants it" to "running in their app" to "removed"?

### Step 5.1: Install path
- **Question:** How does an extension get installed?
- **Read:** Whatever exists (look for `install`, `setup`, `seed`)
- **Output:** `research/05-lifecycle/01-install.md`
- **Question to answer:** Is it a file drop, a manifest install, a marketplace fetch, or something else?

### Step 5.2: Load & activate
- **Question:** When does an extension actually start running?
- **Read:** Phase 1.2 (hot-reload) + bootstrap phases
- **Output:** `research/05-lifecycle/02-load-activate.md`
- **Question to answer:** Eager (load all at boot) or lazy (load when first used)?

### Step 5.3: Hot-reload
- **Question:** Can extensions be updated without restarting?
- **Read:** Phase 1.2 (hot-reload)
- **Output:** `research/05-lifecycle/03-hot-reload.md`
- **Question to answer:** Is the existing hot-reload mechanism reusable for user extensions?

### Step 5.4: Disable / uninstall
- **Question:** How does a user turn off or remove an extension?
- **Read:** Whatever exists
- **Output:** `research/05-lifecycle/04-disable-uninstall.md`
- **Question to answer:** What's the cleanup story?

### Step 5.5: Marketplace (v2 — out of scope for v1 but document it)
- **Question:** What's the future marketplace story?
- **Read:** Nothing (this is forward-looking)
- **Output:** `research/05-lifecycle/05-marketplace-future.md`
- **Question to answer:** What would a marketplace need from the v1 design to slot in?

### Step 5.6: FINAL SYNTHESIS — The Extension Model
- **Write:** `research/EXTENSION-MODEL.md`
- **Contents:** The complete design. From all 5 phases. This is the document that becomes the basis for admitting F-042+ sub-cards.
- **Sections:**
  1. What exists today (from Phase 1)
  2. The extension contract (from Phase 3)
  3. The security model (from Phase 4)
  4. The lifecycle (from Phase 5)
  5. What's out of scope for v1
  6. Open questions
  7. Sub-cards to admit (proposed list)

---

## Output Structure

```
research/
  01-baseline/
    00-SYNTHESIS.md
    01-f022-plugin-system.md
    02-f022-plugin-hot-reload.md
    ...
  02-extension-points/
    00-SYNTHESIS.md
    01-register-patterns.md
    ...
  03-contract/
    00-SYNTHESIS.md
    01-capability-contribution.md
    ...
  04-security/
    00-SYNTHESIS.md
    01-existing-permissions.md
    ...
  05-lifecycle/
    00-SYNTHESIS.md
    01-install.md
    ...
  EXTENSION-MODEL.md          ← the final design doc
  .progress                  ← what's been done, what's next
```

**Every file is a single commit.** Atomic. Easy to review. Easy to resume.

---

## Per-Step Discipline (How to Do Each Step)

For each step:

1. **Read the code.** Use the read tool. No skimming, no shortcuts. Read every line of the file(s) in the step.
2. **Write the output file** to `research/<phase>/<step>.md`. Use this template:

```markdown
# Step X.Y: [Name]

**Date:** YYYY-MM-DD
**Read:** `path/to/file.ts` (NNN lines)
**Status:** READ | ANALYZED | DRAFTED

## What the code does
[Direct description from the code. Not interpretation.]

## Key observations
[What I noticed. File:line citations.]

## Key questions raised
[What I don't know. Open questions.]

## Cross-references
[Other files/systems this connects to.]
```

3. **Commit** the output file.
4. **Move to the next step.**

If a step takes longer than 30 minutes, split it. Don't combine steps.

---

## Progress Tracking

`research/.progress` — append-only log:

```
2026-08-28 14:00 — research process designed, no steps done yet
2026-08-28 14:30 — 1.1 done: F-022 plugin-system read
2026-08-28 15:00 — 1.2 done: plugin-hot-reload read
...
```

When a new session picks up, the first thing it does is read `research/.progress` to know where the last session left off.

---

## How a New Session Picks Up

1. Read `HANDOFF.md` — know the project state
2. Read `.backbone/BACKBONE.md` — know the backbone
3. Read `research/.progress` — know where this research project left off
4. Continue from the next step in the process
5. If the process itself needs to change, amend this doc (in a commit) and note why

---

## What's NOT in This Process (Out of Scope)

- **Implementation.** This process is design-only. Once EXTENSION-MODEL.md is written, a separate process starts for admitting sub-cards as F-042, F-043, etc and implementing them.
- **The marketplace.** v1 is "extensions from the team + from files the user puts in a directory." Marketplace is v2.
- **Signing.** v1 may not have signing. Note it as a security gap to address later.
- **The user-facing UX for installing extensions.** That's a surface card, not part of this design process.

---

*This process was designed based on actual code review of F-022 + adjacent systems. Update it as findings emerge.*
