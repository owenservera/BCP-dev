# MASTER-SPEC: vivim-next End-State Architecture

> **Status:** DRAFT v0.1 — authoritative design document for the clean-room redesign.
> **Source of truth:** This file. Everything else (code, tooling, migrations) derives from it.
> **Update discipline:** Any change that contradicts this spec MUST amend this file first.

---

## 0. What vivim-next Is

vivim-next is a **local-first AI conversation operating system** — a substrate on which intelligent, composable, privacy-preserving AI workflows run. It is not a chat wrapper. It is not a browser extension. It is a programmable kernel for human-AI interaction.

Three properties define it:

1. **Hot-swappable intelligence.** The reasoning engine is a pluggable, versioned artifact. You can swap, tune, or reprogram it without touching the kernel or restarting the runtime. NLP, NLCL, and LLM escalation are deterministic, composable tiers — not monolithic magic.

2. **Natural language reprogrammability.** Every visible and controllable surface obeys a closed mutation grammar. Users and agents can reshape the product at runtime, down to the kernel level, using near-natural language commands. The kernel logs, versions, and can roll back every mutation cryptographically.

3. **Native self-knowledge.** The system is self-referential and self-descriptive. It maintains a living, auto-generated wiki that answers "What am I? Why am I this way? What changed and why?" without human documentation effort. This same self-model drives autonomous documentation, onboarding, and product-linked change tracking.

---

## 1. Non-Negotiable Design Principles

These are inviolable. Any feature, migration decision, or implementation choice that violates them is rejected without exception.

### P-01 — Minimum Kernel
The kernel contains ONLY what the system cannot function without. No product vocabulary (no "conversation," "provider," "model" at the kernel API level). No UI concepts. No external service dependencies. The kernel must boot in a hermetic test with zero network access.

### P-02 — Mechanism, Not Policy
The kernel provides mechanisms. Policy is plugin territory. The sandbox exists in the kernel; the governance rules that use it live in a plugin. The event bus exists in the kernel; the handlers that react to events live in plugins.

### P-03 — Dogfooding
Vivim own first-party features (Chat, Canvas, Memory, Providers, Workflows) are K1 plugins. They get exactly the same IPluginContext that third-party developers get. There are no "internal" shortcuts, hidden APIs, or special fast-paths for first-party code.

### P-04 — Strict Layer Dependency
kernel => intel => plugins => surfaces

No layer may import from a layer above it. Violations are caught by arch tests at commit time. Infra (infra/) is a build-time concern only — never imported at runtime by kernel, plugins, or surfaces.

### P-05 — Atomic Mutability
Every surface mutation is a typed, logged, reversible, cryptographically-provenance operation. No ad-hoc style.color = "red". Mutations travel through the mutation DSL, get recorded by the M-Layer, and can be replayed or rolled back as a unit.

### P-06 — No Runaway Creation
Resource creation is bounded. One profile per (provider, account). One plugin instance per plugin ID. Fleet limits enforced at kernel boot. No infinite spawn loops.

### P-07 — Local-First, Network-Optional
The kernel boots and runs core operations with zero network. Network is a plugin capability, not a kernel assumption. AI inference is local-first (K0(L0) 6-tier pipeline); remote LLM is an escalation path, not a dependency.

### P-08 — Test-First Architecture
No contract is final until it has an arch test. No plugin is WORKING until its gate passes. No wave ships until the safety net is clean.

---

## 2. Zone Architecture (5 Zones, Locked)

The repo is structured in exactly 5 zones. No zone is optional. No zone merges with another.

```
vivim-next/
+-- kernel/          ZONE 0: K0 -- Minimum kernel (irreducible)
+-- intel/           ZONE 1: K0(L0) -- Intelligence substrate (deterministic)
+-- plugins/         ZONE 2: K1 -- First-party + third-party plugins
|   +-- core/               First-party (owned by vivim team)
+-- surfaces/        ZONE 3: K3 -- UI surfaces (web, desktop, CLI, API)
|   +-- web/
|   +-- desktop/
|   +-- cli/
|   +-- api/
+-- infra/           ZONE 4: K4 -- Build, seed, devops, logging (non-runtime)
    +-- build/
    +-- seed/
    +-- devops/
    +-- logging/
    +-- observability/
```

Cross-cutting directories (not zones):

```
tests/    Cross-layer: unit, integration, e2e, arch, fuzz, chaos
specs/    Net-new feature specs (proposed => approved => implemented)
docs/     User-facing only. No design notes.
.backbone/  Tracking system (cards, waves, gates, rubric)
```

### Zone Boundary Rules

| From => To | kernel | intel | plugins | surfaces | infra |
|------------|--------|-------|---------|----------|-------|
| kernel     | YES internal | NO | NO | NO | NO |
| intel      | YES via kernel contracts | YES internal | NO | NO | NO |
| plugins    | YES via IPluginContext only | YES via IIntelContext only | YES internal | NO | NO |
| surfaces   | YES via surface contracts | YES via IIntelContext | YES via plugin APIs | YES internal | NO |
| infra      | YES reads config | YES reads config | NO | NO | YES internal |

CRITICAL: No direct imports across zone boundaries. All cross-zone communication uses closed TypeScript interfaces defined in kernel/types/. Violations are caught by the arch test suite (T-01..T-28).

---

## 3. The 17 K0 Kernel Subsystems

| ID | Name | Location | Contract |
|----|------|----------|----------|
| K0-01 | Capability Registry | kernel/capability/ | ICapabilityRegistry |
| K0-02 | Execution Kernel | kernel/execution/ | IExecutionKernel |
| K0-03 | ActionPlan IR | kernel/execution/action-plan/ | ActionPlan |
| K0-04 | Storage Contracts | kernel/storage/contracts/ | IStorageContract |
| K0-05 | Identity & Session | kernel/identity/ | IIdentityKernel |
| K0-06 | Lifecycle Manager | kernel/identity/lifecycle/ | ILifecycleManager |
| K0-07 | Sandbox Runner | kernel/security/sandbox/ | ISandboxRunner |
| K0-08 | Governance Engine | kernel/security/governance/ | IGovernanceEngine |
| K0-09 | Consent Engine | kernel/security/consent/ | IConsentEngine |
| K0-10 | Core Types | kernel/types/ | (shared interfaces) |
| K0-11 | Event Bus | kernel/bus/ | IEventBus (dot-namespace enforced) |
| K0-12 | Plugin Context Factory | kernel/plugin-context/ | IPluginContextFactory |
| K0-13 | Surface Registry | kernel/surface/registry/ | ISurfaceRegistry |
| K0-14 | Mutation Engine | kernel/surface/mutations/ | IMutationEngine |
| K0-15 | M-Layer Core | kernel/m-layer/ | IWhy |
| K0-16 | Version Store | kernel/surface/versions/ | IVersionStore |
| K0-17 | Boot Orchestrator | kernel/boot/ | IBootOrchestrator |

What K0 is NOT:
- No ChromeGovernor, no CDP, no browser (K1 plugins)
- No conversation model, no message schema (K1)
- No provider abstraction (K1)
- No ML model loading (K0(L0) in intel/)

---

## 4. The Closed Interface: IPluginContext

Every plugin — first or third party — receives exactly this interface and nothing more.

IPluginContext fields:
- pluginId (readonly string)
- version (readonly string)
- registerCapability(cap) — register a capability
- resolveCapability(name) — resolve another plugin capability
- storage: IScopedStorage — reads/writes scoped to pluginId namespace
- bus: IScopedEventBus — dot-namespaced "plugin.<id>.*"
- intel: IIntelContext — read-only access to K0(L0)
- surface?: ISurfaceRegistration — optional UI slot registration
- log: IScopedLogger — scoped log lines tagged with pluginId
- onBoot(fn) — lifecycle hook
- onShutdown(fn) — lifecycle hook
- onConversationStart(fn) — lifecycle hook

What is NOT in IPluginContext:
- No db (raw database) — storage is scoped and contract-based
- No kernel object — kernel internals are sealed
- No wildcard storage access — every read/write is namespaced
- No vm or eval — execution happens through the capability system

---

## 5. K0(L0) — Intelligence Substrate (6-Tier Pipeline)

The intelligence substrate is the deterministic, hot-swappable intelligence engine. Lives in intel/ and is consumed by K1 plugins via IIntelContext.

### 5.1 The 6-Tier Resolution Pipeline

```
Input (raw user text / agent command)
   |
   v
TIER 1: REGEX PATTERN MATCH
   Zero-latency, zero-AI, deterministic
   Explicit pattern library: /^\/(\w+)\s*(.*)/
   Covers: slash commands, hotkeys, exact triggers
   Exit condition: pattern match confidence >= 0.99
   |
   v
TIER 2: FUZZY KEYWORD MATCH
   Levenshtein + Jaro-Winkler edit distance
   Keyword dictionary compiled from capability registrations
   Covers: typos, partial commands, near-matches
   Exit condition: match score >= 0.85
   |
   v
TIER 3: TF-IDF INTENT CLASSIFIER
   Local, no-network, ~2ms inference
   Trained on vivim command corpus (seeded at boot)
   Covers: intent classification from free-form text
   Exit condition: top-1 class confidence >= 0.75
   |
   v
TIER 4: LOCAL ML CLASSIFIER (ONNX / CoreML)
   Embedded model, no API calls
   Covers: semantic intent matching, entity extraction
   Exit condition: confidence >= 0.65 AND entity extraction complete
   |
   v
TIER 5: LLM-SLAVE ESCALATION
   Calls external LLM (via the provider plugin - K1)
   Structured prompt: intent + entity extraction
   Covers: novel intents, complex multi-step commands
   Exit condition: structured JSON response validated
   |
   v
TIER 6: FALLBACK / CLARIFICATION REQUEST
   Could not resolve with sufficient confidence
   Returns ClarificationRequest to the surface
   Surface presents disambiguation UI to user
```

### 5.2 Hot-Swap Protocol

The intelligence configuration is a versioned record in the system Prisma schema (intel_config table). Swapping it is a set_property mutation: the kernel applies it, intel/ reloads the new config, the next command flows through the new tiers. Zero downtime. Zero kernel restart. Fully logged by M-Layer.

### 5.3 IIntelContext (Plugin-Facing API)

- resolve(input: string) => ResolutionResult
- extractEntities(text, schema) => EntityMap
- classifyIntent(text) => IntentClassification
- isCommand(text) => boolean
- activeVersion (readonly string)

---

## 6. ReprogrammableSurface & The Mutation DSL

### 6.1 The 8 Atomic Mutation Operations

```
MutationOp (union):
  replace      { target, replacement }
  insert       { target, node, position }
  remove       { target }
  reorder      { parent, children[] }
  restyle      { target, style }
  rebind       { target, binding }
  set_property { target, key, value }
  set_slot     { target, slotId, content }
```

Every mutation:
1. Validated against surface invariants (invariant-violating mutations are rejected)
2. Logged by M-Layer with full provenance (who, what, when, why, source command)
3. Produces a new SurfaceVersion record (sha256 hash of new state)
4. Can be rolled back with undo(mutationId)

### 6.2 Natural Language to Mutation Translation

The reprogrammability engine in intel/reprogrammability/:
1. Accepts NL: "make the sidebar 20px narrower"
2. Passes through K0(L0) pipeline with entity schema {target, property, value}
3. Converts resolution to typed MutationOp (e.g. restyle)
4. Validates against surface invariants
5. Applies and logs

The translation layer is itself hot-swappable (versioned intel config artifact).

### 6.3 ReprogrammableSurface Contract

Interface fields:
- surfaceId (readonly string)
- version (readonly string)
- slots: SurfaceSlot[]
- invariants: SurfaceInvariant[]
- apply(op: MutationOp) => MutationResult
- snapshot() => SurfaceSnapshot
- restore(snapshot) => void

---

## 7. M-Layer — Native Self-Knowledge Engine

The M-Layer answers the M-Quadruple for every artifact in the system:

| Layer | Question | Output |
|-------|----------|--------|
| M1 Identity | What am I? | Canonical name, type, version, slot ID, owning plugin |
| M2 Provenance | Where did I come from? | Creation event, creator, source command, parent artifact |
| M3 Rationale | Why am I this way? | Decision log, ADR link, mutation trail, intent classification |
| M4 Graph | How do I relate to everything else? | Dependency graph, capability deps, surface bindings |

### 7.1 IWhy — Self-Description Interface

- describe(artifactId) => MQuadruple
- provenance(artifactId) => ProvenanceChain
- rationale(decisionId) => DecisionRecord
- graph(artifactId, depth?) => DependencyGraph
- ask(question: string) => IWhyAnswer  (NL query against self-knowledge graph)

### 7.2 Living Wiki Generator (Librarian v4)

The M-Layer drives the Living Librarian — automated documentation that:
1. Ingests every artifact registration, mutation, boot event, capability registration
2. Synthesizes a structured wiki (Markdown + JSON) with per-artifact pages
3. Links artifacts to source code via AST-derived line references
4. Publishes to a local SQLite wiki DB queryable via IWhy

Runs as an infra/ background process. NOT a kernel component.

Auto-generated pages:
- Per-plugin: what it registers, what it consumes, who uses it
- Per-surface: exposed slots, mutations applied
- Per-decision: the ADR, rationale, mutations that enacted it
- Per-version: diff + prose from vN to vN+1

### 7.3 M-Layer DB Schema (system Prisma schema)

ArtifactIdentity: id, kind, name, version, ownerId, registeredAt, provenance (M2), rationale (M3), graph (M4)
MutationRecord: id (ulid), surfaceId, op, payload, appliedAt, appliedBy, command?, intentId?, hash (post), prevHash (pre)

---

## 8. K1 First-Party Plugin Catalog

### 8.1 Migrated Features (41 cards from vivim-final)

| ID | Name | Destination | Verdict |
|----|------|-------------|---------|
| F-001 | conversation-system | plugins/core/conversation/ | REWRITE |
| F-002 | memory-system | plugins/core/memory/ | COPY |
| F-003 | knowledge-graph | plugins/core/knowledge-graph/ | COPY |
| F-004 | context-assembly | plugins/core/context-assembly/ | COPY |
| F-005 | provider-cdp-system | plugins/core/provider-cdp/ | COPY+FIX |
| F-006 | provider-discovery | plugins/core/provider-discovery/ | COPY |
| F-007 | capability-registry | kernel/ (K0-01) | COPY => kernel |
| F-008 | action-plan-ir | kernel/ (K0-03) | COPY => kernel |
| F-009 | execution-kernel | kernel/ (K0-02) | COPY => kernel |
| F-010 | agent-builder | plugins/core/agent/ | COPY |
| F-011 | stream-parsing | plugins/core/parsing/ | COPY |
| F-012 | harness-execution | kernel/ (K0-02) | COPY => kernel |
| F-013 | semantic-retrieval | plugins/core/retrieval/ | COPY |
| F-014 | sandbox-security | kernel/ (K0-07) | COPY => kernel |
| F-015 | governance-policy | kernel/ (K0-08) | COPY => kernel |
| F-016 | encryption-privacy | plugins/core/encryption/ | COPY |
| F-017 | observability | infra/observability/ | COPY => infra |
| F-018 | storage-relocation | kernel/ (K0-04) | COPY => kernel |
| F-019 | lifecycle-session | kernel/ (K0-06) | COPY => kernel |
| F-020 | sync-p2p | plugins/core/sync/ | COPY |
| F-021 | user-identity | kernel/ (K0-05) | COPY => kernel |
| F-022 | plugin-system | kernel/ (K0-12) | REWRITE => IPluginContext factory |
| F-023 | mcp-integration | plugins/core/mcp/ | COPY |
| F-024 | workspace-presets | plugins/core/workspace/ | COPY |
| F-025 | observation-outcome | infra/observability/ | COPY => infra |
| F-026 | media-bridge | plugins/core/media/ | COPY |
| F-027 | send-resilience | plugins/core/provider-resilience/ | COPY |
| F-028 | budget-cost | plugins/core/budget/ | COPY |
| F-029 | update-system | infra/update/ | COPY => infra |
| F-030 | selector-resilience | plugins/core/provider-resilience/ | COPY (merge F-027) |
| F-031 | humanization-ux | plugins/core/humanization/ | COPY |
| F-032 | content-management | plugins/core/content/ | COPY |
| F-033 | canvas-frontend | surfaces/web/canvas/ | COPY => surfaces |
| F-034 | frontend-surfaces | surfaces/web/ | REWRITE (new slot system) |
| F-035 | desktop-installer | surfaces/desktop/ + infra/build/ | SPLIT |
| F-036 | dual-db-system | kernel/ (K0-04) | COPY => kernel |
| F-037 | seed-pipeline | infra/seed/ | COPY => infra |
| F-038 | devops-tooling | infra/devops/ | COPY => infra |
| F-039 | test-suite | tests/ | RESTRUCTURE |
| F-040 | logging | infra/logging/ | COPY => infra |
| F-041 | voice-input | plugins/core/voice/ | SPEC FIRST (AR-001) |

### 8.2 Net-New Features (vivim-next Exclusive, 10 items)

| ID | Name | Destination | Status |
|----|------|-------------|--------|
| N-001 | Intelligence Substrate (6-tier) | intel/ | SPEC COMPLETE -> Section 5 |
| N-002 | M-Layer Self-Knowledge | kernel/ (K0-15) | SPEC COMPLETE -> Section 7 |
| N-003 | Mutation DSL Engine | kernel/ (K0-14) | SPEC COMPLETE -> Section 6 |
| N-004 | Version Store / Time Machine | kernel/ (K0-16) | SPEC COMPLETE |
| N-005 | Living Librarian v4 | infra/librarian/ | SPEC COMPLETE -> Section 7.2 |
| N-006 | IPluginContext v2 (closed) | kernel/ (K0-12) | SPEC COMPLETE -> Section 4 |
| N-007 | NL Reprogrammability Engine | intel/reprogrammability/ | SPEC COMPLETE -> Section 6.2 |
| N-008 | Surface Slot System v2 | kernel/surface/ | IN DESIGN |
| N-009 | Admission Rubric Toolchain | infra/devops/.backbone/ | PORT FROM VIVIM_0 |
| N-010 | Hot-Intel Swap Protocol | intel/swap/ | IN DESIGN |

---

## 9. Boot Sequence (12 Ordered Phases)

```
PHASE 0: KERNEL TYPES (<1ms)
  Load kernel/types/ (interfaces, value objects, error types)
  No I/O. No network. Pure in-memory.

PHASE 1: STORAGE SUBSTRATE (~50ms)
  Init Prisma (system + user schemas)
  Verify migrations are current
  Load storage contracts
  GATE: system schema tables accessible

PHASE 2: IDENTITY & SESSION (~20ms)
  Load identity kernel (users, sessions)
  Restore active sessions from DB
  GATE: user record exists OR first-boot flag set

PHASE 3: SECURITY SUBSTRATE (~30ms)
  Init QuickJS sandbox runner
  Load governance engine (policy rules from DB)
  Load consent engine
  GATE: sandbox can execute "1+1"

PHASE 4: EVENT BUS (~5ms)
  Init IEventBus with dot-namespace enforcement
  Start auto-recording (all events logged to M-Layer)
  GATE: bus can publish+receive "kernel.boot.phase4.complete"

PHASE 5: CAPABILITY REGISTRY (~10ms)
  Init capability registry (K0-01)
  Register kernel built-in capabilities
  GATE: capability "kernel.health" resolves

PHASE 6: EXECUTION KERNEL (~20ms)
  Init ActionPlan compiler
  Bind to capability registry
  GATE: no-op ActionPlan compiles and executes

PHASE 7: SURFACE REGISTRY & MUTATION ENGINE (~15ms)
  Init surface registry
  Init mutation engine (load invariant validators)
  Init version store
  GATE: test surface can receive set_property mutation

PHASE 8: M-LAYER (~30ms)
  Init M-Layer (IWhy, provenance recorder)
  Index existing artifacts from DB
  GATE: M-Layer.describe("kernel") returns valid MQuadruple

PHASE 9: INTELLIGENCE SUBSTRATE (~100ms)
  Load active intel config from DB
  Init 6-tier pipeline
  Load pattern library + keyword dictionary
  GATE: resolve("list capabilities") returns ActionPlan

PHASE 10: PLUGIN LOADER (variable)
  Enumerate plugin manifests
  For each plugin in dependency order:
    a. Validate manifest schema
    b. Score against security rubric
    c. Construct scoped IPluginContext
    d. Execute plugin.onBoot() in sandbox
    e. Register declared capabilities
  GATE: all CORE plugins WORKING

PHASE 11: SURFACE BINDING (~50ms)
  Bind surface implementations to registered surface slots
  Apply persisted surface mutations (restore user customizations)
  GATE: at least one surface bound and responding

PHASE 12: SYSTEM READY
  Emit "kernel.boot.complete" on event bus
  Log boot telemetry to M-Layer
  Activate Living Librarian background indexer (dev mode)
```

---

## 10. Storage Architecture

### 10.1 Three-Schema Prisma Model

```
kernel/storage/schemas/
  system.prisma  -- System-owned (plugins, surfaces, intel config, M-Layer, boot records)
  user.prisma    -- User-owned (conversations, messages, memory, sessions, preferences)
  root.prisma    -- Root (migrations, schema version, install ID)
```

Rule: No plugin writes to system tables directly. No kernel writes to user tables without an IStorageContract bound to a user context.

### 10.2 Per-Plugin Storage Scoping

Each plugin IScopedStorage is automatically namespaced:
  plugin.memory.*         => only memory plugin records
  plugin.conversation.*   => only conversation plugin records
  kernel.*                => kernel-only, no plugin can access

Cross-plugin reads are mediated by explicit capability registration. A plugin cannot directly read another plugin storage.

---

## 11. Security & Trust Model

### 11.1 Three Trust Tiers

| Tier | Who | Sandbox |
|------|-----|---------|
| KERNEL | vivim kernel code | None (trusted) |
| CORE | vivim first-party plugins (K1) | Soft (monitored, main V8) |
| USER | Third-party / user-installed | Hard QuickJS sandbox |

### 11.2 Capability Manifest

Plugins declare requirements and provisions in manifest.json:
  requires: ["kernel.storage.read", "kernel.bus.subscribe"]
  provides: ["memory.store", "memory.retrieve", "memory.forget"]

The governance engine validates requires against the trust tier. USER tier plugins cannot request kernel.storage.*.

### 11.3 12 Attack Vectors (All Must Be Rejected by Certifier)

1. Prototype pollution via IPluginContext method calls
2. Storage namespace escape (plugin.id.../../kernel.*)
3. Event bus wildcard subscription (kernel.*)
4. Direct sandbox vm module import
5. Cross-plugin direct import (bypassing capability system)
6. Manifest schema injection (ULID validation bypass)
7. Capability escalation at runtime
8. Storage write to foreign namespace
9. Bus publish with non-dot-namespaced kind
10. Sync execution of async-only kernel contracts
11. Plugin self-modification of IPluginContext
12. Boot sequence phase bypass

---

## 12. User Experience Model

### 12.1 Natural Language Command Resolution

| Command Type | Example | Resolution Tier |
|--------------|---------|-----------------|
| Slash command | /summarize this thread | Tier 1 (regex) |
| Near-match | /sumarise | Tier 2 (fuzzy) |
| Intent phrase | "summarize what we talked about" | Tier 3/4 (classifier) |
| Complex NL | "make sidebar show only unread convos" | Tier 4/5 (ML + LLM) |
| Surface mutation | "make the font 2pt bigger" | NL Reprogrammability Engine |
| Self-query | "why does the sidebar look like this?" | M-Layer (IWhy) |

### 12.2 Dogfooding Examples

- Documentation: Living Librarian uses vivim knowledge-graph plugin to index+link docs
- Changelog: Surface mutations automatically surface as changelog entries via M3 Rationale
- Self-repair: When plugin fails, diagnostic capability surfaces rationale + fix suggestions
- Onboarding: First-run generated from M-Layer identity index (self-described tour)

### 12.3 Surface Slot IDs (web surface)

SLOT_IDS:
  surface.web.sidebar.top
  surface.web.sidebar.bottom
  surface.web.canvas.toolbar
  surface.web.canvas.panel
  surface.web.statusbar
  surface.web.command-palette
  surface.web.settings

Plugins register slot contributions via IPluginContext.surface.registerSlot(slotId, component).

---

## 13. Developer Experience & PMM

### 13.1 Admission Rubric (8 Criteria, Threshold 12/22)

| # | Criterion | Max |
|---|-----------|-----|
| 1 | User value (V-1..V-5) | 5 |
| 2 | Kernel independence | 3 |
| 3 | Testability | 3 |
| 4 | Specificity (no coupling) | 3 |
| 5 | Migration cost (inverse) | 3 |
| 6 | Reversibility | 3 |
| 7 | Friend/user interest | 2 |
| 8 | Independence from in-flight | 1 |

Total: 22 max. Threshold: 12 to ADMIT.

### 13.2 Feature Card State Machine

DISCOVERED => MAPPED => DESIGNED => SCAFFOLDED => PARTIAL => WORKING => SHIPPED => MAINTAINED
                                                                     |
                                                                DROPPED (with reason)

No card transitions to WORKING with failing tests.
No wave ships with a failing safety net.

### 13.3 Wave Plan

| Wave | Cards | Target | Value |
|------|-------|--------|-------|
| W-KERNEL-1 | K0-01..K0-10 | Internal | P-01, P-02 |
| W-KERNEL-2 | K0-11..K0-17 + N-001..N-007 | Internal | P-03, P-04, P-05 |
| W-ALPHA-1 | F-007, F-009, F-015, F-014, F-019, F-021, F-002, F-004 | Friends alpha | V-1, V-3 |
| W-ALPHA-2 | F-001, F-005, F-010, F-011, F-013 | Friends alpha | V-1, V-2 |
| W-BETA-1 | F-003, F-020, F-023, F-033, F-034 | Friends beta | V-2, V-3 |
| W-BETA-2 | F-041 (voice), N-008 (slots v2) | Friends beta | V-2 |

---

## 14. What Does NOT Exist in vivim-next

- No src/ at top level
- No shared/, common/, utils/ directories
- No frontend/ at top level (UI is in surfaces/web/)
- No prisma/ at top level (schemas in kernel/storage/schemas/)
- No tests/ inside plugin folders
- No archive/, legacy/, old/
- No migration simulation tools (if it writes nothing to disk, it is deleted)
- No BootstrapContext with 60+ fields (replaced by closed IPluginContext)
- No vm module (QuickJS only)
- No safe-eval (ISandboxRunner is the only execution path)

---

## 15. Open Questions (Requiring Decision Before W-KERNEL-1)

| # | Question | Default | Urgency |
|---|----------|---------|---------|
| OQ-01 | Is conversation/ kernel or plugin? | Plugin (K1) | HIGH |
| OQ-02 | Does intel/ need its own Prisma schema? | Uses system schema | MEDIUM |
| OQ-03 | Hot-swap: DB-driven or file-driven intel config? | DB-driven | MEDIUM |
| OQ-04 | Surfaces: React or Web Components? | React (Next.js) | HIGH |
| OQ-05 | Does M-Layer log ALL mutations or only significant ones? | ALL | MEDIUM |
| OQ-06 | Voice input: Tier 0 or parallel input channel? | Parallel channel | LOW |
| OQ-07 | CORE plugins: QuickJS or main V8 context? | Main V8 for CORE | HIGH |
| OQ-08 | Backend server: surfaces/api/ or infra/backend-server/? | surfaces/api/ | MEDIUM |

---

## 16. Migration Strategy: vivim-final => vivim-next

Phase 0: Skeleton (Week 1) -- create repo, zone folders, READMEs, port .backbone/, init arch tests
Phase 1: Kernel Foundation (Weeks 2-3) -- K0-01..K0-10, unit tests, gate: all K0 arch tests pass
Phase 2: Intelligence Substrate (Week 4) -- intel/ from scratch, 6-tier pipeline, gate: resolve() works
Phase 3: M-Layer & Mutation DSL (Week 5) -- K0-14, K0-15, K0-16, gate: mutation logged with M-Quadruple
Phase 4: IPluginContext v2 (Week 6) -- K0-12, 12 attack vector rejections, gate: certifier passes
Phase 5: K1 Core Plugins (Weeks 7-10) -- F-001..F-041 in wave order, gate per card via gate.ts
Phase 6: Surfaces (Weeks 11-13) -- surfaces/web/ (canvas, slot system), surfaces/desktop/ (Tauri)
Phase 7: Friends Alpha (Week 14) -- ship W-ALPHA-1 (8 cards) to 3 friends, collect feedback

---

*This specification is version-controlled. Every amendment generates an ADR in docs/decisions/.*
*Last updated: see git log.*
