# PROCESS: How We Generate the Complete vivim-next Spec

> This document defines the multi-pass spec generation process.
> The process was designed to prevent "Architecture Astronaut" paralysis
> while still achieving hyper-comprehensive coverage.
> Read MASTER-SPEC.md first. This tells you how to fill in the gaps.

---

## The Core Problem

A single pass at an architecture document will miss things.
This is guaranteed. The question is not "will we miss things" but
"how do we systematically surface what we missed."

The VIVIM_0 research showed a 5-phase process works:
- Phase 1: Baseline audit (what exists)
- Phase 2: Extension point mapping (what is hookable)
- Phase 3: Contract synthesis (what the API surface is)
- Phase 4: Security model (what is allowed vs blocked)
- Phase 5: Lifecycle & distribution (how things arrive and leave)

We adapt that process here for the redesign.

---

## The 6 Spec Passes

### Pass 1: ZONE CONSTITUTION (DONE - see MASTER-SPEC.md)

What was written:
- 5 zones with boundary rules
- 17 K0 subsystems
- 12 boot phases
- 41 migrated feature cards
- 10 net-new features
- 8 open questions

What was NOT written (passes 2-6 cover this):
- Per-subsystem TypeScript contract files
- Per-plugin manifest schemas
- UX flow specs (conversation, canvas, voice, reprogrammability)
- Security attack surface in detail
- Storage schema (full Prisma)
- PMM scoring for all 51 cards
- Test architecture (what tests exist where)
- Frontend design system
- Performance budget
- Deployment architecture

### Pass 2: KERNEL CONTRACTS (target: 02-kernel-contracts/)

For each of the 17 K0 subsystems, write:
- The full TypeScript interface (every method, every type)
- The invariants it enforces
- The error types it can throw
- The events it emits on the bus (with dot-namespace)
- The test contract (how to verify it works in isolation)

Output files:
- 02-kernel-contracts/K0-SUBSYSTEMS.md (index)
- 02-kernel-contracts/K0-01-capability-registry.ts (interface)
- 02-kernel-contracts/K0-02-execution-kernel.ts
- ... (one per subsystem)
- 02-kernel-contracts/IPluginContext.ts (the master interface)
- 02-kernel-contracts/IIntelContext.ts
- 02-kernel-contracts/IScopedStorage.ts
- 02-kernel-contracts/IScopedEventBus.ts
- 02-kernel-contracts/IWhy.ts

Progress tracking: 02-kernel-contracts/.progress

### Pass 3: INTELLIGENCE SUBSTRATE (target: 03-intelligence-substrate/)

For the 6-tier pipeline:
- Per-tier spec (input contract, output contract, confidence threshold, config keys)
- Hot-swap protocol (full DB schema for intel_config)
- Training data format for TF-IDF / ONNX classifier
- NL-to-MutationOp entity schema design
- IIntelContext full TypeScript interface
- Performance budget (per-tier latency targets)
- Fallback behavior spec (what happens when tier N fails hard)

Output files:
- 03-intelligence-substrate/PIPELINE-SPEC.md
- 03-intelligence-substrate/TIER-1-regex.md
- 03-intelligence-substrate/TIER-2-fuzzy.md
- 03-intelligence-substrate/TIER-3-tfidf.md
- 03-intelligence-substrate/TIER-4-onnx.md
- 03-intelligence-substrate/TIER-5-llm-slave.md
- 03-intelligence-substrate/TIER-6-fallback.md
- 03-intelligence-substrate/HOT-SWAP-PROTOCOL.md
- 03-intelligence-substrate/TRAINING-DATA.md

### Pass 4: REPROGRAMMABILITY & M-LAYER (target: 04-reprogrammability/ + 05-self-knowledge-mlayer/)

For ReprogrammableSurface:
- Full TypeScript types for all 8 MutationOps
- Invariant declaration format
- SurfaceSlot manifest format
- Time-machine protocol (snapshot + restore + undo chain)
- NL-to-MutationOp translation spec

For M-Layer:
- Full IWhy TypeScript interface
- DB schema (ArtifactIdentity, MutationRecord, ProvenanceChain, DecisionRecord)
- Living Librarian v4 architecture (ingestion pipeline, wiki output format)
- M-Quadruple query DSL (how to ask "why?" about anything)

### Pass 5: PLUGIN CATALOG & UX FLOWS (target: 06-plugins-catalog/)

For each of the 41 migrated + 10 net-new features:
- 1 FEATURE_CARD.json (state: MAPPED)
- 1 migration verdict entry
- 1 UX flow (if user-facing): the screens, the state machine, the happy path + error paths

Priority UX flows to write first:
- Conversation flow (F-001): message send => stream => render
- Provider CDP flow (F-005): discover => connect => authenticate => send => receive
- Memory flow (F-002): store => retrieve => forget
- Voice input flow (F-041): capture => transcribe => resolve => execute
- Reprogrammability flow (N-007): speak command => resolve => preview => apply => undo
- Self-query flow (N-002): ask "why" => M-Layer query => answer rendered in surface

### Pass 6: PMM & PRIORITIZATION (target: 07-prioritization-matrix-pmm/)

For each of 51 features (41 migrated + 10 net-new):
- Admission rubric score (8 criteria, 22 max)
- Wave assignment
- Dependency graph (what must exist before this can be implemented)
- Effort estimate (S/M/L/XL)
- User value tier (V-1..V-5)

Output:
- 07-prioritization-matrix-pmm/FULL-MATRIX.md (51 rows)
- 07-prioritization-matrix-pmm/WAVES.md (wave-by-wave plan)
- 07-prioritization-matrix-pmm/DEPENDENCY-GRAPH.md (Mermaid diagram)
- 07-prioritization-matrix-pmm/CRITICAL-PATH.md (minimum viable product path)

---

## Per-Step Discipline (How to Do Each Step)

1. READ the relevant backstory files in 00-backstory/ first
2. WRITE the output file following the template for that pass
3. UPDATE .progress for this pass (append-only log)
4. CROSS-REFERENCE: add links to MASTER-SPEC.md where relevant
5. COMMIT (one file per commit, message: "spec(pass-N): <description>")

---

## Progress State

```
.progress (append-only, one line per completed step):

[DONE] Pass 1: MASTER-SPEC.md (zone constitution, 51 features, 12 boot phases)
[TODO] Pass 2: Kernel contracts (17 subsystems, IPluginContext v2)
[TODO] Pass 3: Intelligence substrate (6-tier pipeline, hot-swap)
[TODO] Pass 4: Reprogrammability + M-Layer (8 ops, IWhy, Living Librarian)
[TODO] Pass 5: Plugin catalog + UX flows (41+10 features)
[TODO] Pass 6: PMM matrix + prioritization (51 cards scored)
```

---

## How a New Session Picks Up

1. Read MASTER-SPEC.md (the constitution)
2. Read this file (the process)
3. Read .progress (where we are)
4. Continue from the first [TODO] step
5. When done with a step: update .progress, commit

---

## What the Spec Does NOT Cover (Out of Scope)

- Implementation code (that is Phase 0-7 of migration strategy in MASTER-SPEC.md)
- Actual DB migrations (generated from Prisma schema in kernel/storage/schemas/)
- Test code (scaffolded in tests/ during implementation)
- UI component code (built during surfaces/ phase)
- Deployment infrastructure (Tauri build, NSIS installer, update server)

The spec covers DESIGN. Implementation is driven by the spec.
