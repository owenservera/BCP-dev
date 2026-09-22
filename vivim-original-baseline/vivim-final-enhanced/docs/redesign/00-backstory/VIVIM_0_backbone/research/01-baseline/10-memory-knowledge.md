# Step 1.10: Memory & Knowledge — The "Extension Data" Model

**Date:** 2026-08-28
**Read:**
- `plugins/memory/memory-engine.ts` (882 lines, first 80)
- `plugins/retrieval/knowledge-graph/knowledge-envelope.ts` (43 lines)
- **Status:** READ + ANALYZED

**Critical finding:** Memory and knowledge are **closed, schema-bound data stores** with sophisticated internal models (episodic/semantic/procedural memory, FSRS-6 spaced repetition, knowledge graph nodes/edges, content hashing). They are NOT directly accessible to user extensions. The closest an extension gets is the **Node layer** (the universal database), which is the abstraction over both. Live capabilities cannot read/write memory directly — they go through capabilities like `memory_query` (from Step 1.8's capability bootstrap).

---

## What the code does

### `MemoryEngine` (memory-engine.ts)

From the file header (line 1-2): "MemoryEngine — episodic, semantic, and procedural memory with learning." (Note: the comment says "with learning" — this is a learning system, not a passive store.)

**Three memory types, each its own shape:**

1. **EpisodicMemory** (lines 13-25) — event log of actions: `{ id, providerId, capabilityId?, slaveId?, action, input, output, success, durationMs, timestamp, tags }`. Every capability invocation is an episode. Tags for filtering. This is the "I did X and it worked/failed" log.

2. **SemanticMemory** (lines 39-48) — facts as subject-predicate-object triples: `{ id, subject, predicate, object, confidence, source, timestamp, expiresAt? }`. Confidence + source + expiry. This is a small knowledge graph node.

3. **ProceduralRule** (lines 59-70) — learned if-then rules: `{ id, name, condition, action, confidence, successCount, failureCount, lastTriggered?, createdAt, updatedAt }`. The "I learned to do X when Y" memory. Confidence adjusts with success/failure counts.

**`FsrsScheduler`** — from the import at line 9: `import { type Card, type CardState, FsrsScheduler, type ReviewResult } from './fsrs-scheduler.js'`. FSRS-6 is a spaced-repetition algorithm (Free Spaced Repetition Scheduler, v6). The memory system has a *review* model — like Anki for memory items. Cards have states (New, Learning, Review, Relearning). This is a real, sophisticated learning system, not a simple store.

The engine is 882 lines. Not read in full. But the type structure is clear: episodic, semantic, procedural, plus FSRS-6 card scheduling.

### `KnowledgeEnvelope` (knowledge-envelope.ts)

The **canonical normalization** for every artifact entering the system. From the file header (line 1-4): "Phase 0/4 — Canonical knowledge envelope with content hashing. Every incoming artifact (conversation, file, email, browser capture) is normalized into this envelope before indexing."

**`KnowledgeEnvelopeSchema`** (lines 9-23) — Zod-validated:
- `sourceType: string` (e.g. `'conversation'`, `'file'`, `'email'`, `'browser-capture'`)
- `sourceId: string`
- `sourceAccount?`, `externalId?`, `version` (default 1), `title?`, `content: string`
- `contentType: string` (default `'text/plain'`)
- `createdAt?`, `updatedAt?`, `author?`, `participants: string[]` (default `[]`), `metadata: Record<string, unknown>` (default `{}`)

**`VersionedKnowledgeEnvelope`** (lines 27-29) — extends with `contentHash: string`.

**`normalizeKnowledge(input)`** (lines 35-42) — trims content, computes a SHA-256 hash over `sourceType + sourceId + version + normalized content`. The hash drives **incremental indexing** (line 33 comment: "unchanged content is never re-embedded").

### Other memory & knowledge files (not read in detail)

- `plugins/memory/fsrs-scheduler.ts` (3635 lines) — the FSRS-6 implementation.
- `plugins/memory/memory-export.ts` (4158 lines) — import/export.
- `plugins/memory/memory-indexer.ts` (5365 lines) — indexer.
- `plugins/retrieval/knowledge-graph/knowledge-extractor.ts` (10631 lines) — extracts structured knowledge from text.
- `plugins/retrieval/knowledge-graph/knowledge-ingestion.ts` (10274 lines) — ingestion pipeline.
- `plugins/retrieval/knowledge-graph/knowledge-index-pipeline.ts` (5107 lines) — index pipeline.
- `plugins/retrieval/knowledge-graph/belief-store.ts` (2568 lines) — belief revision (semantic memory's confidence engine).
- `plugins/retrieval/knowledge-graph/knowledge-extractor-continuous.ts` (2190 lines) — background extraction.

The retrieval folder has 20+ other files (embedding providers, classifiers, intent decomposer, context assembly, etc.). Not read in this step.

---

## Key observations

- **Memory is a learning system, not a passive store.** The "with learning" in the file header + the FSRS-6 spaced repetition + the ProceduralRule confidence tracking all confirm: this engine *learns* from episodes. Procedural rules are learned if-then patterns. Confidence goes up with success, down with failure. This is a long-running adaptive system.

- **The Node layer is the abstraction above this.** From the AGENTS.md (forge): "Node-Layer v2 — Universal Node DB. Node + NodeVersion + NodeAlias + NodeEdge. ACU-proven fields (`contentHash`, `version`, `state`, `securityLevel`, `contentType`, `authorDid`, `signature`, `acl`, `quality`, `validFrom`/`validUntil`, `parentVersion`). `MemoryEngine.recordMemory()` emits `cap-store.memory` Nodes with FSRS-6 initial state." So memory is **persisted as Nodes** under the universal Node layer. The MemoryEngine is a typed interface over Node rows.

- **Knowledge envelope is the universal ingest format.** Line 4 comment: "Every incoming artifact (conversation, file, email, browser capture) is normalized into this envelope before indexing." The 4 source types in the comment are 4 entry points to the same pipeline. A user extension that wants to ingest a custom source type would need to produce a `KnowledgeEnvelope`. **This is a real extension point** — the envelope is the contract.

- **Content hashing makes re-indexing cheap.** The SHA-256 over sourceType+sourceId+version+content means "unchanged content is never re-embedded" (line 33). For a user extension, this means: re-submitting the same source is idempotent. Stable to incremental updates.

- **The `version` field is part of the hash.** Line 14, 39. So a "v2" of the same sourceId is a different hash. The system tracks versions.

- **FSRS-6 is a real, complex algorithm.** 3635 lines. The memory system uses spaced repetition — the same algorithm Anki uses. This is not a CRUD store; it's a *cognitive* system. An extension can't easily tap into this without going through the engine's API.

- **Three memory kinds, three different semantics.** Episodic (events), Semantic (facts with confidence), Procedural (learned rules). The user-facing question "what did I tell Claude last week?" is episodic. "What's the user's timezone?" is semantic. "When should I auto-summarize?" is procedural. The engine is the integration point.

- **Confidence is tracked everywhere it matters.** Semantic memory has `confidence` (line 45). Procedural has `confidence` + `successCount` + `failureCount` (line 64-66). Belief revision is its own subsystem (`belief-store.ts`). The system distinguishes "high-confidence" from "low-confidence" knowledge.

- **`expiry` is a first-class field on semantic memory.** Line 47. Knowledge can expire. The system has a TTL model.

- **Knowledge ingestion is a 10K-line pipeline.** `knowledge-ingestion.ts` (10274 lines). It's a real, sophisticated system with extractors, indexers, deduplication, entity extraction, decision extraction, embedding generation (Step 1.8's `knowledge_ingest` handler calls into it).

- **The retrieval layer is large (20+ files).** Embedding providers (HF, MiniLM, Ollama), classifiers (NLI, embedding-based), intent decomposer, context assembly (23K lines), DCB projector, etc. This is the "find the right thing to put in the LLM's context window" subsystem. **Closed at the user level** — these are engine internals, not extension points.

- **The memory `tags` field is a free-form string array.** Line 25. So a user can label episodes. But this is internal to MemoryEngine; an extension doesn't see this directly.

- **`source: string` on semantic memory (line 46) is a stringly-typed attribution field.** Could be `'manual'`, `'auto-extract'`, `'user-input'`, etc. The type system doesn't constrain it. A user extension could write its own source label.

- **The `metadata: Record<string, unknown>` on knowledge envelope (line 22) is the extension field.** This is the bag where a user extension can attach custom data to a knowledge artifact. The system preserves it through indexing.

---

## Key questions raised

1. **Is the Node layer the database behind both memory and knowledge?** Yes (per AGENTS.md). So a user extension that wants to write a memory item goes: build a `KnowledgeEnvelope` → call `knowledge_ingest` capability (Step 1.8) → Node layer persists it. The MemoryEngine is a typed interface, but the storage is unified.

2. **What is `cap-store.memory`?** A Node type. Not read in detail. Probably a typed Node row for memory items.

3. **Can a user extension read episodic memory directly?** Not through any extension API. They go through `memory_query` capability. So extensions have query access, not direct DB access. This is the right security model.

4. **What's the security model for the Node layer?** AGENTS.md mentions `securityLevel`, `acl`, `authorDid`, `signature` on Node. So there IS an ACL system. An extension's `authorDid` would constrain what it can read/write. But the enforcement code is not read in this step.

5. **Is the FSRS-6 scheduler driven by user feedback, or by some automatic signal?** 3635 lines. Probably both — user reviews, plus automatic decay for stale memories. The `ReviewResult` type suggests a feedback loop.

6. **What is `belief-store.ts`?** Belief revision for semantic memory. When two pieces of semantic memory conflict, how is the conflict resolved? Probably the higher-confidence one wins, with logging.

7. **Is there a per-extension ACL?** If a user extension writes a memory, can another extension read it? The `acl` field suggests yes, but the policy is not clear.

8. **What's the difference between `EpisodicMemory` (in-memory shape) and the persisted form?** The interface is the in-memory shape. The persistence goes through `MemoryIntelligenceStore` (imported at line 6). The store is the adapter; the engine is the domain model.

9. **Can a user extension write a `ProceduralRule`?** Procedural rules are *learned*, not user-set. So no direct write. But if an extension's actions produce successful episodes, the system may learn a rule from them. This is the learning loop.

10. **Is there a way to query memory by provenance?** The `source` field on semantic memory and the `tags` on episodic memory let you filter. The query interface is in `EpisodeQueryOpts` (line 79+) and similar. Not read.

11. **What is the knowledge graph's edge model?** `NodeEdge` from the AGENTS.md. Weight + direction. Not in the files I read.

---

## Cross-references

- **Step 1.7 (capability system)** — extensions access memory through capabilities: `memory_query`, `memory_recall`, `knowledge_search`, `knowledge_ingest`, `knowledge_synthesize` (all from the bootstrap).
- **Step 1.4 (reprogrammability)** — the "user-configurable program" is, in part, a user writing knowledge artifacts. The envelope is the input contract. Reprogrammability is the mutation model; memory is the storage.
- **Step 1.6 (provider plugins)** — providers have their own protocol config (auth_type, etc.) but not user-specific memory. A user's memory is keyed by userId, not provider.
- **`plugins/storage/contracts/memory-intelligence-store.ts`** — the persistence contract. Not read.
- **`plugins/storage/contracts/node-store.ts`** — the universal Node layer. The actual DB.
- **`plugins/memory/fsrs-scheduler.ts`** (3635 lines) — FSRS-6. The scheduler. Not read.
- **`plugins/retrieval/knowledge-graph/`** — 6 files. The knowledge subsystem. Ingestion, extraction, indexing, belief.
- **`plugins/retrieval/context-assembly.ts`** (23747 lines) — context assembly for LLM prompts. The biggest file in retrieval. Reads from memory, knowledge, conversation, etc.
- **`plugins/retrieval/intent-decomposer.ts`** (9300 lines) — the NL → structured intent. Likely used by the LLM harness (Step 1.9).
- **`kernel/security/`** — Step 1.11. The Node layer's `acl` / `securityLevel` are enforced here.
- **`prisma/schema.prisma`** — the actual schema. Will read in Step 1.13.
