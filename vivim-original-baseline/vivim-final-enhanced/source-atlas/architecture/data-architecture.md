# Data Architecture — why two databases + how IDs stitch them (from schemas + ids + rows)

## 1. Two databases, two cadences

| | System DB (`prisma/system/schema.prisma`, 111 models) | User DB (`prisma/user/schema.prisma`, 90 models) |
|---|---|---|
| **Owns** | Providers, taxonomy, bindings, programs, selectors, telemetry, workflows, kernel, discovery, MCP, config | Sessions, conversations, messages, stream blocks, nodes, mirror, memories, entities, sync, contacts, platform mirrors |
| **Ships with** | The app release (seeded fresh per version) | The user (survives reinstalls, exportable) |
| **Migrates on** | Release cadence (`migrate --source all` + TS runner) | User-data cadence (backup/snapshot safe) |
| **Seeded by** | `seeds/{taxonomy,capabilities,parsers,providers,adapters,system}/**` | `seeds/user/**` + live traffic |
| **Never contains** | Message content, embeddings, personal entities | Provider manifests, taxonomy definitions |

Join rule (I-3): **no Prisma `@relation` crosses the boundary** (`dual-db-boundary.test.ts`
fails the build if one appears). Cross-DB correlation uses opaque string keys below.

## 2. ID derivations as join keys (from `src/ids.ts`, 52 lines)

```
newId()                                ULID — every PK in both DBs (sortable, merge-safe)
slave:{provider}:{account}             ProviderAccount (sys) ↔ ProviderSession/ProfileSession (user)
cap:{provider}:{slug}                  CapabilityTaxonomy ↔ ProviderCapability ↔ CapabilityBinding
bind:{global}:{provider}               CapabilityBinding ↔ CapabilityProgram candidates
prog:{binding}:v{n}                    CapabilityProgram versions + ProgramVersionMetric
sel:{cap}:{provider}:{name}            SelectorStrategy ↔ SelectorHealthHistory
hashContent(content) → sha256 hex      ConversationMessage.identityHash + Node dedup
                                       (FNV-1a `fnv1a:*` fallback is dedup-only, never integrity)
```

Read any FK column: if it matches one of the six patterns, you know both ends without
opening the schema. If it doesn't match, flag it (probable ad-hoc join — see risks).

## 3. Row conventions (from `storage/contracts/*` — all 67 files)

- Time = Unix-epoch **numbers** (`createdAt: number`), never `Date` — SQLite-compatible,
  no timezone drift, trivial range scans.
- Booleans = `0|1` **numbers** (`isActive: number`) — same reason; coerce at the edge
  (`src/schema/*` zod transforms to real booleans for API responses).
- Evolving shapes = `*Json` **TEXT columns** (`contextJson`, `promotionHistoryJson`,
  `availabilityJson`, `dependsOnJson`…) — schema stays stable while capability semantics
  evolve; parse cost paid on read, migration cost avoided on write.
- Status enums as **strings** (`prospect→test-1→test-2→stable→flaky→broken→retired`,
  `PlanTier free|pro|max|enterprise`) — human-greppable in SQLite shells, no lookup tables.

## 4. Write path per cluster (contract → tables)

```
capability write   resolution → CapabilityBinding + BindingStatusLog + ProgramVersionMetric
conversation write ConversationManager → Conversation + ConversationMessage (+identityHash)
                     → StreamBlock → Node/NodeVersion (+MessageLink/MessageEntity)
memory write       MemoryEngine → Episodic/Semantic/Procedural + MemoryEmbedding
                     → MemoryLink/MemoryAccess + ReflectionLog (quota: MemoryWardenQuotaError)
telemetry write    logger → TraceEntry → TelemetryAggregator → TelemetrySummaryDaily/CycleLog
                     → HealthTick + CapabilityTelemetry + ProviderLatency/CostLog
workflow write     WorkflowEngine → WorkflowExecution + NodeExecution + (RetryQueue on failure)
discovery write    discovery-runner → DiscoverySession + DiscoveryResult + DiscoveredDomEntity
                     + ProtocolFingerprint + ParserCandidate + ParserTestResult
```

## 5. Read patterns (what's hot)

- Resolution hot path: `CapabilityBinding(globalId, providerId)` + best `CapabilityProgram`
  + `SelectorStrategy` set — cached in `capability-resolution-store` + `selector-cache.ts`;
  invalidated by `ManifestDrift`/`ManifestChangeLog`.
- Conversation hot path: `Conversation(lastMessageAt)` + tail `ConversationMessage(sequenceIndex)`
  + `StreamBlock(conversationId)` — paginated, never full-table.
- Memory hot path: `MemoryEmbedding` ANN (hf/minilm/ollama providers) → `SemanticMemory` →
  `Entity/EntityMention` grounding. Embedding provider chosen in knowledge phase
  (`embeddingProvider` on context).
