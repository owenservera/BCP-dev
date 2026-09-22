# OMEGA Artifact #2 — NLCL Per-File Verdicts (137/137 files)

> MSG-01 artifact 2. Code-only: `src/engines/nlcl/` (60) + `src/engines/command-language/` (18)
> + `src/intel/nlcl/` (59) = 137, enumerated by walk + shim scan (`export * from`) +
> import-substring scan + targeted body reads. Verdict key is operational (below), neutral:
> it describes what the file *contains*, not what Omega should do with it.

## Verdict key (applied uniformly)

- **K0-mechanism** — file contains only domain-generic machinery: no provider, category,
  command-name, or trigger-pattern literals; works against injected registries/patterns.
- **K1-content** — file's primary export is domain content: category pattern lists,
  per-category executors, `*-specs` tables, presentation tables, trigger patterns, anchors
  naming categories, single-capability registrations.
- **SPLIT** — both halves separably present; split line names the exact boundary
  (line numbers measured by grep; block names quoted from code).
- **SHIM** suffix — file body is only `export * from '<target>'`; verdict follows the
  canonical target. Shims move by deletion, not by port.

## Migration state (measured, read first)

- 54/60 `engines/nlcl/` files are shims → `intel/nlcl/` (27 top-level + 16 categories +
  11 executors; scan `export * from`, e.g. `catalog.ts:9`, `nlcl-engine.ts:6`).
- 6 `engines/nlcl/` files are REAL with **no intel counterpart** (unmigrated):
  `classifier-resolver.ts`, `composite-splitter.ts`, `dynamic-entity-linker.ts`,
  `categories/_generate.ts`, `categories/builder.ts`, `graph/graph-model.ts`.
- 4 `intel/nlcl/` files have **no engines counterpart** (intel-new):
  `budget-engine.ts`, `embedding-classifier.ts`, `embedding-minilm.ts`, `nl-interpret.ts`.
- `engines/command-language/` (18): zero shims; self-contained subsystem.
- `intel/nlcl/categories/*` headers still read `// src/engines/nlcl/categories/<name>.ts`
  (stale path comments, e.g. `ai.ts:3304B` vs engines stub 241B) — cosmetic only.

## §1 `src/engines/nlcl/` top-level (30: 27 SHIM + 3 real)

| File | Verdict | Evidence |
|------|---------|----------|
| catalog.ts:9 | K1-content (SHIM) | `export * from '../../intel/nlcl/catalog.js'`; target returns concrete pattern list (`getDefaultCommandPatterns`) |
| command-registry.ts | K0-mechanism (SHIM) | re-export; target is `CommandPatternRegistry` data structure (no embedded patterns) |
| confirmation-store.ts | K0-mechanism (SHIM) | re-export; target is a generic confirmation store |
| context-binder.ts | K0-mechanism (SHIM) | re-export; target binds flat context (no domain names) |
| dialogue-session-store.ts | K0-mechanism (SHIM) | re-export; target is a generic session store (`computeDialogueSessionKey`, `resumePendingTurn`) |
| entity-resolution.ts | K0-mechanism (SHIM) | re-export; target is generic entity resolution |
| fuzzy-matcher.ts | K0-mechanism (SHIM) | re-export; target is a string-similarity algorithm |
| fuzzy-resolver.ts | K0-mechanism (SHIM) | re-export; target resolves against *injected* patterns (1 type-only domain ref) |
| help-resolver.ts | SPLIT (SHIM) | re-export; target splits (see §3) |
| index.ts | SPLIT (SHIM) | re-export; target is a mixed barrel (see §3) |
| intent-resolver.ts | K0-mechanism (SHIM) | re-export; target's `DeterministicResolver` takes registry by DI (`constructor(registry)`); LLM resolvers are adapter frameworks (`LocalLLMAdapter`, `ProviderLLMAdapter`, `HybridResolver`) |
| intent-router.ts | K0-mechanism (SHIM) | re-export; target routes to injected resolvers (`IntentRouter`) |
| layered-resolver.ts | K0-mechanism (SHIM) | re-export; target orchestrates layers (`ResolutionLayer = 'deterministic'\|'fuzzy'\|'semantic'\|'classifier'\|'llm'\|'none'`) over injected resolvers |
| llm-slave-resolver.ts | K0-mechanism (SHIM) | re-export; target imports only generic embedding providers (`HfEmbeddingProvider`, `EmbeddingProvider`) + local `BM25Index`/`tokenize`/`denseCosine`; catalog is injected (`CatalogEntry` interface) |
| nl-parser.ts | K0-mechanism (SHIM) | re-export; target is `NLCommandParser` (generic parse) |
| nlcl-engine.ts:6 | SPLIT (SHIM) | re-export; target splits (see §3) |
| nlcl-otel.ts | K0-mechanism (SHIM) | re-export; target emits OTel spans (no domain content) |
| parameter-extraction.ts | K0-mechanism (SHIM) | re-export; target validates against injected zod (`extractParameters`, `validateInput`) |
| pattern-match.ts | K0-mechanism (SHIM) | re-export; target is a shared pattern-matching helper (SOTA Fuzzy+Semantic) |
| prerouter.ts | SPLIT (SHIM) | re-export; target splits (see §3) |
| response-interpreter.ts | K0-mechanism (SHIM) | re-export; target is generic post-processing (`isMeaningful`, `extractFromOutput`, `applyHedging`, `applyDialogueContinuity`, Default vs NoOp) |
| semantic-resolver.ts | K0-mechanism (SHIM) | re-export; target builds docs from *injected* patterns (`buildPatternDocument`), local `denseCosine` |
| text-normalizer.ts | K0-mechanism (SHIM) | re-export; target is Layer-0 normalization (generic text ops) |
| tfidf-embedding-provider.ts | K0-mechanism (SHIM) | re-export; target is a TF-IDF sparse-vector `EmbeddingProvider` |
| tfidf.ts | K0-mechanism (SHIM) | re-export; target is TF-IDF similarity (Layer 3, generic) |
| types.ts | SPLIT (SHIM) | re-export; target splits (see §3) |
| workflow-synthesis-resolver.ts | SPLIT (SHIM) | re-export; target splits (see §3) |
| classifier-resolver.ts | K0-mechanism (REAL, unmigrated) | imports `IntentClassifierProvider`/`NliClassifierProvider` (generic NLI), `CommandPatternRegistry`, `pattern-match`; `ClassifierResolver implements IntentResolver` over injected provider + `humanizeIntent` formatter; no category literals |
| composite-splitter.ts | K0-mechanism (REAL, unmigrated) | `SPLIT_CANDIDATES` regexes are language delimiters (no domain names) + quote/paren guard `isInsideQuotesOrParens`; `detectCompositeSplit` is generic |
| dynamic-entity-linker.ts | SPLIT (REAL, unmigrated) | split line: `WorkspaceStoreContract` (line 101) + `WorkspaceEntityLinker` (line 119) → K1; `EntityLinkResult`/`EntityCandidate`/`EntityLinkerProvider` (lines 34-53) + `DynamicEntityLinker` (line 64) → K0 |

## §2 `src/engines/nlcl/categories/` + `executors/` + `graph/` (30: 27 SHIM + 3 real)

| File | Verdict | Evidence |
|------|---------|----------|
| categories/_generate.ts | K0-mechanism (REAL, tooling) | header: "Generates `categories/*.ts` from the original catalog.ts" — codegen script, not shipped content |
| categories/builder.ts | K0-mechanism (REAL) | `pattern()` factory + `extractEmails`/`dayToCron` domain-neutral text helpers (2253B, no category literals) |
| categories/{ai,app,automation,browser,canvas,channel,conversation,email,file,llm,memory,opencode,provider-cap,session,system,workflow}.ts (16) | K1-content (SHIM each) | each `export * from '../../../intel/nlcl/categories/<name>.js'`; targets are per-category pattern lists (domain hits 6-26 per file) |
| executors/{app,browser,capability,conversation,email,file,generic-browser,provider-llm,system,workflow}-executor.ts + index.ts (11) | K1-content (SHIM each) | re-exports of per-category executors (4 domain refs each = executor wiring); note `index.ts` re-exports `src/`-rooted paths (absolute-ish `src/intel/…`, unlike siblings' relative paths — normalize on move) |
| graph/graph-model.ts | K0-mechanism (REAL, unmigrated) | `NlclNodeKind`, `NlclGraphNode/Edge` (mirror Prisma rows), `IntentVocabulary`, `NormalizationConfig`, `slugify`, `NclGraph` class; generic graph infra, no category literals |

## §3 `src/intel/nlcl/` canonical (59)

K0-mechanism (34): `budget-engine.ts` (budget policy engine, no category literals) ·
`command-registry.ts` (`CommandPatternRegistry`, `RegisterCallback` — empty data structure) ·
`confirmation-store.ts` · `context-binder.ts` · `dialogue-session-store.ts` ·
`embedding-minilm.ts` (MiniLM provider impl) · `entity-resolution.ts` · `fuzzy-matcher.ts` (algorithm) ·
`fuzzy-resolver.ts` (injected patterns) · `intent-resolver.ts` (DI registry + adapter frameworks; body-read §evidence above) ·
`intent-router.ts` · `layered-resolver.ts` · `llm-slave-resolver.ts` (generic embeddings + injected catalog; imports measured) ·
`nl-parser.ts` · `nlcl-otel.ts` · `parameter-extraction.ts` · `pattern-match.ts` ·
`response-interpreter.ts` (generic hedging/continuity; no trigger tables) ·
`semantic-resolver.ts` (docs built from injected patterns) · `text-normalizer.ts` ·
`tfidf.ts` · `tfidf-embedding-provider.ts`.

K1-content (17): `catalog.ts` (`getDefaultCommandPatterns`, `getPatternsByCategory` — 45 domain refs, concrete list) ·
`cate
...[truncated 3013 chars]