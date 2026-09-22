# L4 — Prisma Columns (201 models; full field lists in `generated/gen-prisma-columns-*.md`)

> Generated source: `generated/gen-prisma-columns-system.md` (111) + `gen-prisma-columns-user.md` (90),
> parsed from `prisma/system/schema.prisma` + `prisma/user/schema.prisma` as `field:Type` in schema order.
> This file is the semantic overlay: conventions + hot columns + join keys. For exact
> nullability/defaults/indexes/`@@map`, read the schema file (it is the law).

## Conventions (observed across all 201 models)
- No `enum` in either schema (verified: zero `^enum `). Statuses are string columns (`status`, `state`, `kind`) + zod unions in `src/schema/*` — SQLite-compatible, app-validated.
- PKs are ULID strings (`newId()`, `src/ids.ts`); times are epoch-ms `number` (`createdAt/updatedAt/lastMessageAt`); booleans are `0|1` numbers; evolving shapes are `*Json` TEXT (`configJson`, `blocksJson`, `promotionHistoryJson`, `availabilityJson`).
- Cross-DB: zero Prisma `@relation` across DBs (`dual-db-boundary.test.ts`). Joins are string keys: `slave:{provider}:{account}`, `cap:{provider}:{slug}`, `bind:{global}:{provider}`, `prog:{binding}:v{n}`, `sel:{cap}:{provider}:{name}`, sha256/fnv1a content hashes.

## System DB hot columns (what to select first)
- `ProviderDefinition{id,isActive}` → active set for snapshot (`POST /api/system/refresh-provider-snapshot`).
- `CapabilityBinding{globalId,providerId,status,bestProgramId,confidence}` + `CapabilityProgram{bindingId,version,isActive,status}` → resolution read.
- `SelectorStrategy{capabilityId,providerId,strategyType,selectorValue,priority,hitCount,isActive}` → execution read.
- `ProviderParser{providerId,logic_type,parser_logic_code}` (`logic_type='inline'` only) → parser load.
- `TelemetrySummaryDaily/CycleLog`, `ProviderHealth{score}`, `CircuitBreakerState`, `ConfigEntry{key}` → ops reads.

## User DB hot columns
- `Conversation{id,providerSessionId,state,messageCount,lastMessageAt}` + `ConversationMessage{conversationId,sequenceIndex,role,identityHash,blocksJson}` → thread tail by `sequenceIndex`.
- `StreamBlock{conversationId}` paginated; `Node{hash}` + `NodeVersion` deduped by `hashContent`.
- `Episodic/Semantic/Procedural` + `MemoryEmbedding{provider,vector}` (hf/minilm/ollama) → ANN search.
- `MirrorState/Snapshot`, `OptimisticUpdate`, `SyncLog/SyncState`, `ConversationSyncState/Log` → `/ws` convergence.

Full 201 × field lists: `generated/gen-prisma-columns-system.md` + `gen-prisma-columns-user.md`.
