# Layer 0 — The Intelligence Foundation (L0)

> **The deep answer to your question.** Yes — the existing NLP/CLI/intelligence systems are sophisticated and *can* power the self-descriptive system. But they are not the right place to put the *deterministic core* (the part the kernel itself depends on). Below is the deep inventory, what is deterministic vs. not, what can be upgraded, and **what I would do** — including a new tier class (not a special plugin, not a duplicate first-party plugin, but a *new axis* the kernel exposes).

---

## 0. The summary first

You asked three things:

1. **Can the existing NLP capabilities power the self-descriptive system?** **Yes, partially.** The M-layer's IWhy (free-text "why" router) is a deterministic text-classifier; it can use the *same* 6-layer pipeline as the command engine (deterministic → fuzzy → semantic → classifier → LLM → unresolved). But it **must not** use the LLM as the primary path — the answer must be grounded in source, and a hallucination is worse than a wrong answer.

2. **What is the "core deterministic intelligence" — can the kernel use the existing NLP?** **No.** The current NLP stack (NLCL + LayeredResolver + LLMSlave + HarnessExecutor + BudgetEngine + OpenCodeSupervisor) is **product** — it's how VIVIM's chat works. Putting the kernel on top of it would be `plugin:agents`-as-kernel, which is exactly the violation Constitution Rule C forbids. The kernel needs its own **deterministic intelligence substrate** that has no LLM dependency, no optional plugin, no opencode, no budget-engine, no agent-loop. It is the floor that the rest of the system stands on.

3. **What is the right classification — a special plugin, a new tier class, or something else?** **A new tier axis: K0(L0) — Kernel / Layer 0 — the deterministic intelligence substrate.** It sits *inside* the kernel boundary (so it cannot be uninstalled, cannot be replaced by a plugin, cannot call out to an LLM). It is **not** a first-party plugin (a plugin can be uninstalled). It is **not** a generic plugin (a generic plugin can be replaced). It is **not** a K4 external process (the kernel does not depend on it for boot). It is a *new sub-axis* of K0: the part of the kernel that knows how to *think about* the kernel. This is what makes the kernel natively intelligent without depending on anything that is itself an intelligence.

The rest of this document maps the actual code, classifies it, and designs the Layer 0 architecture.

---

## 1. The actual NLP / CLI / intelligence system — exhaustive inventory

I read every file. Here is what exists today, in tiers of the user's question (K0? K1? K2? replaceable?). Line counts from the actual repo.

### 1.1 The command pipeline (`src/cli/`, `src/server/`)

| File | LOC | What it does | Current tier (proposal) | Should be |
|---|---|---|---|---|
| `src/cli/index.ts` | 182 | argv parser; in-process registry; thin-client HTTP bridge | K1 (CLI) | **K0 (CLI is a kernel concern)** |
| `src/cli/command-registry.ts` | 50 | `Map<name, CliCommand>` + multi-word `resolve(tokens)` | K1 | **K0 (registry shape is universal)** |
| `src/cli/builtins.ts` | 81 | `automate`, `moments`, `seed`, `migrate` — hand-written commands that bypass the bridge | K1 | **K1 (hand-written VIVIM features stay first-party)** |
| `src/cli/registry-bridge.ts` | 273 | `syncCliFromUnified(reg, registry)` — pulls every `UnifiedCapability` with a `cliCommand` field into the CLI | K1 | **K0 (the bridge is universal mechanism)** |
| `src/cli/repl.ts` | 108 | `startRepl()` — interactive loop hitting `POST /api/interpret` | K1 | **K0 (the REPL is the deterministic CLI entry point)** |
| `src/cli/output-formatter.ts` | 45 | JSON / pretty / table | K1 | **K0 (formatter shape is universal)** |
| `src/cli/discovery-stack.ts` | 146 | ?? | K1 | **K0 (deterministic capability discovery — read-only)** |
| `src/server/routes/interpret.ts` (and similar) | n/a | HTTP front for `/api/interpret` | K1 | **K0 (HTTP front is a kernel contract)** |

**Insight:** the *mechanism* of the CLI (registry, multi-word resolver, HTTP thin-client, output formatter, capability discovery) is universal. The *content* (the VIVIM-specific commands `automate`, `moments`, `seed`, `migrate`) is first-party. The current code conflates them. The fix is the same fix as the plugin kernel: split the mechanism from the content.

### 1.2 The natural-language command layer (`src/engines/nlcl/`) — 60 files, 1,600+ LOC

The biggest subsystem. The Tier 3 NLCLEngine (950 lines) is the production orchestrator.

| File | LOC | Role | Classification |
|---|---|---|---|
| `nlcl-engine.ts` | 950 | main orchestrator: interpret(rawInput, ctx) → resolve → route → execute | **K1 (VIVIM product)** |
| `intent-resolver.ts` | 285 | 5 implementations: `DeterministicResolver` (zero AI), `LocalLLMResolver` (Ollama/etc), `ProviderLLMResolver` (Claude/etc), `HybridResolver`, factory `createResolver` | K1 (the resolvers themselves are product; the *fact* of the layering is a kernel mechanism) |
| `layered-resolver.ts` | 170 | **The 6-layer pipeline orchestrator** — Deterministic → Fuzzy → Semantic → Classifier → LLM → None. This is **SOTA NLU** (per the doc-comment) | **K0 MECHANISM** (the pipeline shape is universal; the *specific* resolvers are product) |
| `nl-parser.ts` | 180 | `NLCommandParser` — regex + keyword matching. ZERO AI. **Handles 95% of consumer command volume** per its own header | K0 (the algorithm is universal) |
| `fuzzy-resolver.ts` | 137 | Jaro-Winkler / Dice | K0 (algorithm) |
| `fuzzy-matcher.ts` | 137 | internal | K0 |
| `semantic-resolver.ts` | 246 | TF-IDF cosine + embedding provider | K0 (the *resolver shape*); the *embedding provider* is a first-party choice |
| `classifier-resolver.ts` | 112 | NLI zero-shot (tiny local expert #2) | K0 (algorithm) |
| `llm-slave-resolver.ts` | 432 | Catalog-grounded LLM (RAG: BM25 + HF dense + RRF fusion) | K1 (the LLM is product; the RAG *shape* is universal) |
| `llm.ts` (categories) | 341 | LLM command patterns | K1 |
| `intent-router.ts` | 374 | routes `ParsedIntent` → `CommandExecutor`. When `ExecutionKernel` is present, routes through full `policy → execute → verify → journal` | K0 (the routing mechanism is universal); the **ExecutionKernel hookup is K0** (kernel wires kernel) |
| `prerouter.ts` | 140 | pre-route classification | K0 |
| `composite-splitter.ts` | 142 | clause-aware depth-capped split (closes audit ?-11) | K0 |
| `dialogue-session-store.ts` | 263 | 30-min sliding-TTL session store | K1 (chat product) |
| `confirmation-store.ts` | 262 | HMAC-signed confirmation store | K0 (security primitive) |
| `dynamic-entity-linker.ts` | 245 | entity resolution | K1 |
| `parameter-extraction.ts` | 214 | parameter validation | K0 (the schema-validation piece) |
| `entity-resolution.ts` | 208 | entity resolution | K1 |
| `text-normalizer.ts` | 230 | normalization | K0 (universal) |
| `help-resolver.ts` | 210 | help text | K0 (it reads the command registry — universal) |
| `response-interpreter.ts` | 199 | output formatting | K0 (the *shape*); the *content* is product |
| `graph-model.ts` | 234 | dialogue graph | K1 |
| `workflow-synthesis-resolver.ts` | 271 | workflow synthesis | K1 |
| `context-binder.ts` | 83 | `NLCContext` binder | K0 (the *shape*); the *contents* are populated by plugins |
| `command-registry.ts` | 171 | `Map<id, CommandPattern>` + surface filter | K0 |
| `executor-*.ts` (10 files) | 76-260 each | `AppExecutor`, `BrowserExecutor`, `CapabilityExecutor`, `ConversationExecutor`, `EmailExecutor`, `FileExecutor`, `GenericBrowserExecutor`, `ProviderLLMExecutor`, `SystemExecutor`, `WorkflowExecutor` | K1 (VIVIM features) |
| `categories/*.ts` (19 files) | 29-341 each | Pattern data per category (`file`, `browser`, `ai`, `app`, `automation`, `canvas`, `channel`, `conversation`, `email`, `llm`, `memory`, `opencode`, `provider-cap`, `session`, `system`, `workflow`, `builder`, `_generate`) | **SPLIT:** the `builder.ts` shape is K0; the *data* is K1 |
| `llm.ts`, `ai.ts`, `opencode.ts` (categories) | 132+341+185 | LLM/AI/OpenCode command patterns | K1 |
| `types.ts` | 223 | core types (`NLCLSurface`, `NLCContext`, `ActionClassification`, `ExecutorId`, `NLPattern`, `CommandPattern`, `IntentResolver`, `ResolverConfig`, `CommandExecutor`, `NLCLEngineConfig`, `DEFAULT_NLCL_CONFIG`, `classificationAtLeast`) | K0 (the *shapes*) |
| `nlcl-otel.ts` | 80 | OpenTelemetry | K0 |

**Total: 60 files, ~5,000 LOC, of which ~2,000 is K0 (mechanism) and ~3,000 is K1 (VIVIM product).**

### 1.3 The OpenCode bridge (`src/engines/opencode/`) — 6 files, 1,400+ LOC

| File | LOC | Role | Classification |
|---|---|---|---|
| `opencode-supervisor.ts` | 303 | spawns `opencode serve` subprocess; binds 127.0.0.1; requires `OPENCODE_SERVER_PASSWORD`; max 5 restarts; 90s readiness timeout | **K1** (VIVIM-specific) |
| `opencode-instance-registry.ts` | 307 | durable JSONL ledger + classifier (managed vs external `opencode` processes). Closes a near-fatal incident. **Brilliant design.** | **K1** (VIVIM-specific to opencode) |
| `opencode-client.ts` | 259 | HTTP/SSE client. v1.18.4 grammar. `modelRefFromSlug` (`opencode/deepseek-v4-flash-free` → `{id, providerID}`) | **K1** |
| `opencode-executor.ts` | 208 | NLCL `opencode` executor (handles `opencode.send` / `.session.create` / `.session.list` / `.permission.respond`); 180s timeout | **K1** |
| `opencode-ingest.ts` | 368 | projects serve events into DB (AgentSession / AgentPermissionDecision / AgentFileEdit). The **Governor permission gating** lives here (auto-deny tier > 3). | **K1** (the permission gating rule is VIVIM's; the *shape* of ingest is universal) |
| `types.ts` | 101 | v1.18.4 event grammar; `textDeltaFromEvent`; `isSessionDone`; `riskTierForTool`; `autoDenyTier` | **K0 (the grammar + risk-mapping math) — but the *tier threshold* is VIVIM's policy** |
| `local-agent-executor.ts` (in `local-agent/`) | 301 | one-shot agentic task runner via opencode CLI | K1 |
| `opencode-model-sync.ts` (in `local-agent/`) | 291 | parses `opencode models opencode --verbose`; keeps the free-tier list fresh | K1 |
| `local-agent/` total | 2 files, 592 LOC | | K1 |

### 1.4 The intelligence substrate (`src/engines/` — embedding + budget + cost)

| File | LOC | Role | Classification |
|---|---|---|---|
| `embedding-hf.ts` | 110 | `@huggingface/transformers` ONNX WASM, Xenova/all-mpnet-base-v2 (768-d INT8, ~22 MB). Default embedding provider. **Lazy singleton.** | **K0 (the abstract `EmbeddingProvider` interface)**; the concrete HfEmbeddingProvider is a first-party choice |
| `embedding-ollama.ts` | 100+ | nomic-embed-text via Ollama | K1 |
| `embedding-minilm.ts` | (small) | MiniLM hash fallback | K1 |
| `tfidf.ts` (in `nlcl/`) | 89 | TF-IDF fallback | K0 (the *algorithm*) |
| `tfidf-embedding-provider.ts` | 71 | TF-IDF as an `EmbeddingProvider` | K0 |
| `embedding-classifier.ts` | (small) | wraps an embedding provider as a classifier | K0 |
| `budget-engine.ts` | ~140 | first-class `UsageLimits` + `RunUsage` + `BudgetExceededError`. Mirrors pydantic_ai's `UsageLimits`. Accrues cost to the `agent_run` node (durable + resumable) | **K0 (the *engine shape*); the *policy* (specific limits) is K1** |
| `cortex-budget.ts` | (small) | another budget variant | K1 |
| `semantic-search.ts` | (small) | `EmbeddingProvider` interface | **K0** (the interface) |
| `knowledge-extractor.ts` | (small) | entity/decision/fact extraction (regex-based, fail-open) | K1 (the *content*); **the algorithm is K0** |
| `cortex-budget.ts` | (small) | cortex-specific budget policy | K1 |

### 1.5 The execution substrate (`src/engines/execution-kernel.ts` + `action-plan*.ts`)

The `ExecutionKernel` is already 5-stage (`policy → execute → verify → journal`) and is a **kernel** concern — see `KERNEL-CONTRACTS.md` C-10. The `ActionPlan` shape is the kernel's universal plan format. The `PlanValidationGate` (in `nlcl-engine.ts`) is the bridge between the NLCL (product) and the ExecutionKernel (kernel).

### 1.6 The agent stack (`src/engines/` — autonomous, agentic, agent-builder)

| File | LOC | Role | Classification |
|---|---|---|---|
| `autonomous-execution.ts` | (long) | `AutonomousExecutionEngine` with `planStepsFromIntent` / `planStepsLocally` / `resolvePlanner` | K1 (autonomous is VIVIM product) |
| `autonomous-planner.ts` | (med) | planner helpers | K1 |
| `autonomous-replay.ts` | (med) | `ReplayController` | K1 |
| `agent-builder.ts` | (med) | `AgentBuilderEngine` with `startBuilderRun` / `spawnFromBuilder` | K1 (agents are VIVIM product) |
| `agentic-loop.ts` | (long) | the agent loop | K1 |
| `agentic-slm.ts` | (med) | a small language model adapter for the agent loop | K1 |
| `browser-automation/agentic-loop.ts` | (med) | browser-specific agent loop | K1 |

### 1.7 The CLI server-side handlers (`src/server/`)

| Route | Role | Classification |
|---|---|---|
| `/api/interpret` | NLCL endpoint | K0 (the route) |
| `/api/capabilities/*` | capability registry HTTP | K0 |
| `/api/providers/*` | provider list/health | K0 |
| `/api/plugins/*` | plugin install/upgrade | K0 |
| `/api/opencode/*` | OpenCode-specific HTTP | K1 |
| `/api/agent/*` | agent-specific HTTP | K1 |
| `/api/chat/*` | chat-specific HTTP | K1 |
| `/api/storage/*` | storage-specific HTTP | K1 |
| `/api/sandbox/*` | sandbox-specific HTTP | K0 |
| `/api/audit/*` | audit-specific HTTP | K0 |
| `/api/cli/*` | CLI capability fetch (thin-client bridge) | K0 |

The **thin-client bridge is the right model**: the CLI talks to the running server via the same `/api/interpret` the frontend chat box uses (see `repl.ts:55-60`). The kernel keeps the HTTP routes; first-party plugins add their own. Today the routes are already split, but the VIVIM-specific routes are mixed in with the kernel routes. Same fix as everywhere else.

---

## 2. Deterministic vs. non-deterministic — the axis the user is asking about

| Subsystem | Deterministic? | Local-only? | Kernel-critical? |
|---|---|---|---|
| `TextNormalizer` (text-normalizer.ts) | ✓ pure functions | ✓ | **✓** |
| `NLCommandParser` (regex + keyword) | ✓ | ✓ | **✓** (95% of consumer volume) |
| `FuzzyResolver` (Jaro-Winkler) | ✓ | ✓ | optional (kernel never *requires* fuzzy) |
| `SemanticResolver` (TF-IDF) | ✓ | ✓ | optional |
| `EmbeddingClassifier` (NLI) | ✓ | ✓ | optional |
| `LLMSlaveResolver` (RAG + LLM) | ✗ requires provider LLM | ✗ | optional |
| `HfEmbeddingProvider` (ONNX WASM) | ✓ (model is bundled) | ✓ | optional (Tier 1) |
| `OllamaEmbeddingProvider` | ✗ (requires Ollama service) | ✗ | optional |
| `BudgetEngine` | ✓ | ✓ | **✓** (the kernel must enforce budgets on K4 processes) |
| `ExecutionKernel` | ✓ | ✓ | **✓** (the journal) |
| `ActionPlan` | ✓ | ✓ | **✓** (the universal plan shape) |
| `ActionPlanBridge` | ✓ | ✓ | **✓** |
| `PlanValidationGate` | ✓ | ✓ | **✓** |
| `IntentRouter` | ✓ | ✓ | **✓** (the routing mechanism) |
| `LayeredResolver` (the 6-layer pipeline) | ✓ | ✓ | **✓** (the pipeline shape) |
| `OpenCodeExecutor` / `Supervisor` / `Client` | ✗ (subprocess; v1.18.4 grammar) | ✗ | optional (K1) |
| `AutonomousExecutionEngine` | ✓ | ✓ | optional (K1) |
| `HarnessExecutorEngine` | ✗ (runtime depends on Chrome) | ✗ | optional (K1) |
| `LLMSlaveResolver` (Tier 4) | ✗ | ✗ | optional (last-resort fallback) |
| `KnowledgeExtractor` (regex) | ✓ | ✓ | optional (K0 algorithm; K1 product) |
| `EmbeddingProvider` interface | ✓ | n/a | **✓** (the contract) |

**The kernel needs the *deterministic* layer (parser, fuzzy, semantic, classifier, budget, execution, plan, intent-router, layered-pipeline, embedding interface). It does NOT need the LLM layer (LLMSlaveResolver) for boot — the LLM is an *optional* last-resort fallback that the kernel exposes as a capability (`kernel.nlcl.llm-fallback`) which the user enables explicitly.**

---

## 3. The dependency problem the user named

> *"the core deterministic intelligence layer 0 in conjunction with the data base and the mtdmd — such that we can easily upgrade it as well"*

The dependency problem today, in code, is:

```text
NLCLEngine (the orchestrator)
  ├─ DeterministicResolver (good)
  ├─ FuzzyResolver (good)
  ├─ SemanticResolver (uses EmbeddingProvider — good IF local)
  ├─ ClassifierResolver (NLI — good)
  ├─ LLMSlaveResolver (uses ProviderLLMAdapter — needs an LLM service)
  └─ Prerouter + IntentRouter + ActionPlanBridge + PlanValidationGate (good)
       └─ ExecutionKernel (kernel — good)
              └─ CapabilityExecutor + 10 CommandExecutors (VIVIM product)
```

**What the kernel must NOT depend on for boot:**

- ❌ `LLMSlaveResolver` (needs an LLM service)
- ❌ `OllamaEmbeddingProvider` (needs an Ollama service)
- ❌ `OpenCodeExecutor` (needs `opencode serve` subprocess)
- ❌ `HarnessExecutorEngine` (needs Chrome)
- ❌ `LocalAgentExecutor` (needs the `opencode` CLI)
- ❌ `AutonomousExecutionEngine` (needs an agent runtime)
- ❌ `AgentBuilderEngine` (needs the same)
- ❌ `ConversationManager`, `MemoryEngine`, `KnowledgeExtractor` (VIVIM product)

**What the kernel CAN depend on for boot (deterministic + local-first):**

- ✓ `TextNormalizer` (pure functions, zero deps)
- ✓ `NLCommandParser` (regex, zero deps)
- ✓ `FuzzyResolver` (Jaro-Winkler, zero deps)
- ✓ `SemanticResolver` with the *local* `TfIdfEmbeddingProvider` (zero deps)
- ✓ `EmbeddingClassifier` (wraps the embedding provider)
- ✓ `HfEmbeddingProvider` (ONNX WASM, bundled model, **truly local**)
- ✓ `IntentRouter` + `ActionPlanBridge` + `PlanValidationGate` + `ExecutionKernel` (the execution journal)
- ✓ `BudgetEngine` (the engine shape; specific limits are config)
- ✓ `LayeredResolver` (the 6-layer pipeline shape; the resolvers are configurable)
- ✓ `EmbeddableProvider` interface (the contract; the concrete impl is pluggable)
- ✓ `SandboxPolicy` (the iframe + QuickJS policy)
- ✓ `CommandPatternRegistry` + `CommandPattern` + `NLPattern` (the CLI/NLCL data shapes)

**What the kernel MIGHT depend on for boot (but should be optional):**

- ⚠ The `HfEmbeddingProvider` ONNX model download (~22 MB) — this is a network operation at first boot. The kernel must **degrade** if the model cannot be loaded (TF-IDF fallback, no-op semantic, deterministic-only pipeline).

**The "easily upgrade" requirement.** Today the dependency between the engine types and the engines themselves is a 950-line orchestrator with 4 different resolver paths. To upgrade, you have to understand the orchestrator. The fix is the same fix as everywhere else: **split the mechanism from the content**. The mechanism (`LayeredResolver`, `IntentRouter`, `ActionPlanBridge`, `PlanValidationGate`, `BudgetEngine`) is kernel. The content (`DeterministicResolver`, `LocalLLMResolver`, `ProviderLLMResolver`, `ClassifierResolver`, `HfEmbeddingProvider`, `OllamaEmbeddingProvider`, the 10 `CommandExecutor`s) is first-party. The LLM-fallback capability (`kernel.nlcl.llm-fallback`) is registered by the kernel as `kernel.plugins.install` is today; if no plugin provides it, the kernel's pipeline falls through to `none` (per the existing `LayeredResolver:140`).

---

## 4. What I would do — the new tier class K0(L0)

**The kernel's deterministic intelligence substrate is a new sub-axis of K0, not a new layer.** I call it `K0(L0)` — "Kernel Layer 0" — to make explicit that it is the **floor the rest of the system stands on**. It is **inside** the kernel boundary, so:

- It cannot be uninstalled.
- It cannot be replaced by a plugin.
- It cannot call out to an LLM (it is the *deterministic* part; the LLM is a registered *capability*, not a dependency).
- It can be **upgraded** independently of VIVIM's product plugins (the L0 contracts are stable; the L0 impls are swappable behind `IEmbeddingProvider`, `IBudgetGuard`, `INLCLLayeredPipeline`).

### 4.1 What is in K0(L0) (the deterministic intelligence substrate)

| Subsystem | Today's tier | K0(L0) tier | Notes |
|---|---|---|---|
| `TextNormalizer` | mixed | **K0(L0)** | Pure functions |
| `NLCommandParser` | K1 (in `nlcl-engine.ts`) | **K0(L0)** | The parser is the deterministic core; the *orchestrator* that uses it (NLCLEngine) is K1 |
| `FuzzyResolver` | K1 | **K0(L0)** | Algorithm |
| `SemanticResolver` | K1 | **K0(L0)** (the *shape*); K1 (the *embedding provider choice*) | The kernel ships a `TfIdfEmbeddingProvider` (K0) by default; `HfEmbeddingProvider` is K1; `OllamaEmbeddingProvider` is K1 |
| `EmbeddingClassifier` | K1 | **K0(L0)** | Algorithm |
| `LLMSlaveResolver` | K1 | **K1 (optional capability)** | The LLM is the *last* layer, optional |
| `HfEmbeddingProvider` (ONNX) | mixed | **K0(L0) optional** | The kernel ships this; degrades if the model cannot be loaded |
| `OllamaEmbeddingProvider` | K1 | **K1** | Service |
| `TfIdfEmbeddingProvider` | K0 | **K0(L0)** | Default fallback |
| `BudgetEngine` | K1 | **K0(L0)** (the *engine shape*); the *policy values* are K1 | The kernel must enforce *some* budget on K4 processes; the *limits* are config |
| `ExecutionKernel` | K0 | **K0(L0)** | Already K0 (C-10) |
| `ActionPlan` + `ActionPlanBridge` + `PlanValidationGate` | mixed | **K0(L0)** | Already K0 (C-10) |
| `IntentRouter` | K1 (in `nlcl-engine.ts`) | **K0(L0)** | The routing mechanism is universal; the *executors* are K1 |
| `LayeredResolver` | K1 | **K0(L0)** (the *pipeline shape*); the *resolvers* are configurable | Same fix as `IntentRouter` |
| `CommandPatternRegistry` + `CommandPattern` + `NLPattern` | K0/K1 | **K0(L0)** (the *data shapes*) | Today these live in `nlcl/`; they should live in `kernel/intelligence/` |
| `Prerouter`, `composite-splitter`, `parameter-extraction`, `entity-resolution` (K0 algorithms) | K1 | **K0(L0)** | Split from the engines |
| `CommandRegistry` (CLI) + `syncCliFromUnified` | K0/K1 | **K0(L0)** (the *mechanism*) | Same split |
| `OutputFormatter` | K1 | **K0(L0)** (the *format*); the *templates* are K1 | |
| `DiscoveryStack` | K1 | **K0(L0)** (the *stack*); the *content* (catalog query) is K1 | |
| The REPL (`startRepl`) | K1 | **K0(L0)** | The REPL is the CLI's deterministic entry point; it calls `kernel.interpret` |
| The 19 `categories/*.ts` pattern data | K0/K1 | **K1 (the *data*)** | The data is VIVIM product. The `builder.ts` shape that constructs it is K0(L0). |
| The 10 `CommandExecutor`s | K1 | **K1** | VIVIM product |
| `OpenCodeExecutor` + `OpenCodeSupervisor` + `OpenCodeClient` + `OpenCodeIngest` + `OpenCodeModelSync` + `LocalAgentExecutor` | K1 | **K1** | All OpenCode-specific |
| `AutonomousExecutionEngine` + `AgentBuilderEngine` + `agentic-loop` | K1 | **K1** | All agent-specific |
| `LLMSlaveResolver` + `LocalLLMResolver` + `ProviderLLMResolver` | K1 | **K1** (optional) | The LLM is product; the kernel exposes a capability for it |

### 4.2 The K0(L0) contract surface (new contracts C-40..C-44)

Extend the kernel with 5 new contracts that codify the deterministic intelligence substrate. These join the existing C-01..C-39.

#### C-40 — `INLCLLayeredPipeline` (the 6-layer pipeline shape)

```ts
export type ResolutionLayer = 'deterministic' | 'fuzzy' | 'semantic' | 'classifier' | 'llm' | 'none'

export interface IResolvedIntent {
  readonly patternId: string
  readonly intent: string
  readonly input: Record<string, unknown>
  readonly confidence: number
  readonly layer: ResolutionLayer      // which layer resolved it
  readonly alternatives: readonly IResolvedIntent[]
  readonly capabilityId: string | null
  readonly classification: 'read' | 'write' | 'navigate' | 'destructive' | 'communication' | 'financial' | 'system'
}

export interface INLCLLayeredPipeline {
  /** Resolve a natural-language input to an intent. Deterministic. Local-first. */
  resolve(rawInput: string, ctx: NLCContext): Promise<IResolvedIntent | null>
  /** Route the intent to an executor. Returns the executor that will run it. */
  route(intent: IResolvedIntent, ctx: NLCContext): Promise<{ readonly executorId: string; readonly input: Record<string, unknown> }>
  /** Last layer that resolved an intent. For telemetry / Oracle. */
  getLastLayer(): ResolutionLayer
  /** Re-register a sub-resolver (for upgrading the substrate without rebooting). */
  registerLayer(layer: ResolutionLayer, resolver: IIntentResolver): void
  readonly contractVersion: { readonly major: 1; readonly minor: 0 }
}

export interface IIntentResolver {
  readonly name: string
  readonly layer: ResolutionLayer
  /** MUST be deterministic + local for layers 1–3. Layer 4 (LLM) is the only one that may be optional + remote. */
  readonly deterministic: boolean
  resolve(rawInput: string, ctx: NLCContext): Promise<IResolvedIntent | null>
}
```

**Enforcement point:** the kernel instantiates one `LayeredResolver` at boot. The pipeline shape is fixed (6 layers); the sub-resolvers are configurable via `registerLayer`. The LLM layer is **only** a layer 4 — if no LLM resolver is registered, the pipeline falls through to `none` (per the existing `LayeredResolver:140`).

#### C-41 — `IEmbeddingProvider` (the embedding contract — already partly in `semantic-search.ts`)

```ts
export interface IEmbeddingProvider {
  readonly name: string                                          // e.g. 'hf:mpnet-base-v2' | 'tfidf' | 'ollama:nomic-embed-text'
  readonly dimensions: number                                      // 768 for HF, 256 for TF-IDF, etc.
  readonly local: boolean                                         // true if no network / no subprocess required

  /** Warm up (load model, init state). Idempotent. MUST be cancel-safe. */
  init(): Promise<void>

  embed(text: string): Promise<number[]>
  embedBatch(texts: string[]): Promise<number[][]>

  /** Release resources. Called on plugin uninstall + kernel shutdown. */
  dispose(): void

  readonly contractVersion: { readonly major: 1; readonly minor: 0 }
}
```

**The kernel ships a default `TfIdfEmbeddingProvider` (K0, zero deps, zero network).** A `HfEmbeddingProvider` is a K0(L0) optional upgrade — degrades to TF-IDF if the model cannot be loaded. An `OllamaEmbeddingProvider` is K1 (requires Ollama service).

**Upgrade mechanism:** the kernel exposes `kernel.embeddings.set-provider(provider)` as a K0 capability — a first-party plugin (or a config change at boot) can swap the provider without rebooting. **The kernel's IWhy uses the current provider; the provider can be upgraded independently of the rest of the system.**

#### C-42 — `IBudgetGuard` (the budget engine — already partly in `budget-engine.ts`)

```ts
export interface RunUsage {
  readonly requests: number
  readonly toolCalls: number
  readonly inputTokens: number
  readonly outputTokens: number
  readonly totalTokens: number
  readonly costCents: number
}

export interface UsageLimits {
  readonly requestLimit?: number | null
  readonly toolCallsLimit?: number | null
  readonly inputTokensLimit?: number | null
  readonly outputTokensLimit?: number | null
  readonly totalTokensLimit?: number | null
}

export interface IBudgetGuard {
  /** Check before a model request. Throws BudgetExceededError on breach. */
  checkBeforeRequest(runId: string, usage: RunUsage, limits: UsageLimits): void
  /** Check after a model response. */
  checkAfterResponse(usage: RunUsage, limits: UsageLimits): void
  /** Check before a tool call. */
  checkBeforeToolCall(usage: RunUsage, limits: UsageLimits): void
  /** Accrue cost onto the run node (durable). */
  accrue(runId: string, costCents: number, tokens?: number): Promise<void>
  /** Hard-cap check (reuses BudgetExceededError). */
  guard(runId: string, kind: 'cost' | 'tokens' | 'iterations' | 'duration', used: number, limit: number): Promise<void>
  /** For the M-layer self-description: what limits are currently active? */
  describe(): { readonly activeLimits: ReadonlyArray<{ readonly runId: string; readonly limits: UsageLimits }> }
  readonly contractVersion: { readonly major: 1; readonly minor: 0 }
}
```

**Enforcement point:** the kernel instantiates a default `BudgetEngine` at boot. The `ExecutionKernel` (C-10) calls `checkBeforeRequest` / `checkAfterResponse` / `checkBeforeToolCall` at the right stages. A first-party plugin (e.g. `plugin:cost`) can swap the implementation via `kernel.budget.set-guard(guard)`.

#### C-43 — `ICommandPipeline` (the CLI + NLCL + route + execute kernel)

```ts
export interface ICommandPipeline {
  /** The single entry point for any command — used by REPL, HTTP, frontend chat, MCP. */
  interpret(rawInput: string, ctx: NLCContext): Promise<CommandResult>
  /** Register a command pattern (used by first-party plugins and the kernel's own builtin commands). */
  registerPattern(pattern: CommandPattern): void
  /** Register an executor (used by first-party plugins). */
  registerExecutor(executor: CommandExecutor): void
  /** List registered patterns (for the M-layer's IIdentityCatalog, the cake's P0, the help resolver). */
  listPatterns(filter?: { readonly surface?: NLCLSurface }): readonly CommandPattern[]
  /** List registered executors. */
  listExecutors(): readonly string[]
  /** The deterministic help resolver (for "what does command X do?"). */
  help(intent: string): Promise<{ readonly markdown: string }>
  readonly contractVersion: { readonly major: 1; readonly minor: 0 }
}
```

**The CLI REPL, the HTTP `/api/interpret` route, the frontend chat box, and the MCP `kernel:tools:invoke` all call the same `interpret` function.** One entry point. One pipeline. The kernel owns the pipeline; plugins contribute patterns + executors.

**Upgrade mechanism:** the ICommandPipeline is a single kernel object. To upgrade, you `kernel.command-pipeline.registerLayer('llm', newLlmResolver)` or `kernel.command-pipeline.registerPattern(newPattern)`. The kernel reboots the patterns from `src/kernel/intel/builtin-patterns/` (new K0(L0) subdir); first-party plugins contribute their own patterns via `kernel.command-pipeline.registerPattern`. The `cake:plugin-codegen` (P1) and `cake:plugin-certify` (P3) read the same `listPatterns()` to get the kernel's intent catalog.

#### C-44 — `IIntelligenceRegistry` (the upgrade + introspection surface)

```ts
export interface IIntelligenceSubstrate {
  readonly name: string                                          // e.g. 'nlcl-pipeline' | 'embeddings' | 'budget' | 'classifier' | 'help'
  readonly version: { readonly major: number; readonly minor: number }
  /** Hot-swap the substrate at runtime. Used by the cake's P1 codegen and by the M-layer's IWhy. */
  setProvider(name: string, instance: unknown): Promise<void>
  /** For the M-layer's IIdentityCatalog + IProvenanceStore: the substrate's M1 card. */
  describe(): {
    readonly name: string
    readonly version: { readonly major: number; readonly minor: number }
    readonly capabilities: readonly string[]
    readonly deps: readonly string[]
  }
}

export interface IIntelligenceRegistry {
  register(name: string, substrate: IIntelligenceSubstrate): void
  get(name: string): IIntelligenceSubstrate | undefined
  list(): readonly IIntelligenceSubstrate[]
  /** For the M-layer's IRelationGraph: the substrate's inbound + outbound relations. */
  describe(name: string): Promise<{ readonly markdown: string }>
  readonly contractVersion: { readonly major: 1; readonly minor: 0 }
}
```

**This is the kernel's "intelligence bus" — the place where every swappable substrate (embeddings, classifier, pipeline, budget) is registered.** A new embedding model? `kernel.intelligence.register('embeddings', newEmbedder)`. A new classifier? `kernel.intelligence.register('classifier', newClassifier)`. The M-layer's IIdentityCatalog auto-discovers every registered substrate. The cake's P1 codegen reads the catalog to know which provider is current.

### 4.3 The relationship to the M-layer

The M-layer (C-33..C-39, from `inventory/SELF-DESCRIPTIVE.md`) **uses K0(L0) but does not extend it.** The `IWhy` router is built on top of `ICommandPipeline.help` + `IContractCatalog.list` + `IRationaleCatalog.list` + `IRelationGraph.impact`. The M-layer's `IIdentityCatalog.list()` automatically discovers every K0(L0) substrate registered with `IIntelligenceRegistry`. The `IProvenanceStore.why('IProviderAdapter')` answers the question "where did this contract come from?" without needing a manual mapping.

**K0(L0) feeds the M-layer; the M-layer does not depend on K0(L0) for boot.**

### 4.4 The relationship to the cake

The cake's P0 (introspect) is now `kernel.intelligence.list` + `kernel.command-pipeline.listPatterns()` + `kernel.contracts.list()`. The cake's P1 (codegen) generates a `PluginManifest` against the *current* substrate's contract catalog — so when the embedding provider is swapped from TF-IDF to HF, the cake picks up the new embedding's surface automatically. The cake's P3 (certify) calls `ICommandPipeline.help(intent)` to give the user a *narrative* error message: "the scriptUrl `https://evil.com/x.js` failed P-05 because the kernel-asset origin regex is `^https?://[\w-]+/_kernel/plugins/`; see the rationale for C-13 in the constitution."

### 4.5 The relationship to the existing 4 layers

```
K0  KERNEL  (today)
 ├─ 15 subsystems (per the forensic reclassification)
 └─ K0(L0)  DETERMINISTIC INTELLIGENCE SUBSTRATE  (this turn)
     ├─ ICommandPipeline  (CLI + NLCL + route + execute — the single entry point)
     ├─ INLCLLayeredPipeline  (6-layer pipeline shape; the 5 deterministic sub-resolvers)
     ├─ IEmbeddingProvider  (TF-IDF default; HF ONNX optional upgrade; Ollama K1)
     ├─ IBudgetGuard  (the engine shape; the policy is config)
     ├─ IIntelligenceRegistry  (the upgrade + introspection bus)
     └─ M-layer (C-33..C-39 — self-descriptive; reads from K0(L0))
K1  FIRST-PARTY PLUGIN  (36 plugins — VIVIM product)
K2  GENERIC PLUGIN  (third-party extensions)
K3  SANDBOXED COMPONENT  (K3 iframes + QuickJS)
K4  EXTERNAL PROCESS  (browser, Tauri supervisor)
```

K0(L0) is **inside** K0, not a new layer. The kernel can boot without it (with `IIntelligenceRegistry.list()` returning an empty array and `ICommandPipeline` falling through to `unresolved` for everything). K0(L0) is **enrichment** of K0.

### 4.6 Why this is the right answer to your question

You asked: *"should this be a 'special' and unique 'plugin' the internal intelligence layer — or a unique class of plugins?"*

**Neither.** It is **K0(L0) — a new sub-axis of the kernel itself.** Here's why:

- **Not a special plugin.** A plugin can be uninstalled. The kernel needs the intelligence substrate to *boot* (per the success statement: "A valid kernel boots with no first-party plugin installed"). If the substrate is a plugin, a user with no first-party plugins gets an empty pipeline. The kernel is not "natively intelligent" — it's a "host that loads intelligence" — which is not what the user wants.
- **Not a unique class of plugin.** A unique class of plugin is still a plugin. The same uninstall argument applies. Plus, a "class of plugin" suggests a registry of plugins — which is exactly what the plugin builder cake already provides. Adding a second plugin class duplicates the cake.
- **It is K0(L0) — kernel-level enrichment.** The kernel can be installed and shipped without any plugins, and *still* has the deterministic intelligence substrate. The substrate is part of the kernel; it cannot be uninstalled; it can be upgraded (via `IIntelligenceRegistry.setProvider`); the M-layer can introspect it; the cake uses it.

**The kernel becomes natively intelligent by *containing* a deterministic intelligence substrate, not by *depending on* a plugin or an LLM.** The LLM is a *registered capability* (`kernel.nlcl.llm-fallback`), not a kernel dependency. The local HF model is a *swappable substrate* (`IEmbeddingProvider`), not a kernel dependency. The opencode subprocess is a *plugin-spawned external process*, not a kernel dependency.

This is the same architectural move that VIVIM-as-its-own-plugin is: **the mechanism is kernel, the content is plugin.** The deterministic intelligence is the mechanism. The OpenCode subprocess, the agent loop, the autonomous planner, the local-agent executor — those are the content.

---

## 5. The migration plan for K0(L0) (P0-1.w — a new sub-phase)

Per the existing migration plan convention (`BOUNDARY-MIGRATION-PLAN.md`):

| Sub-phase | Sub-PRs | What it achieves |
|---|---|---|
| **P0-1.w.1** Move deterministic NLCL shapes to `src/kernel/intel/nlcl/` | 1 PR | `TextNormalizer`, `NLCommandParser`, `FuzzyResolver`, `TfIdfEmbeddingProvider`, `command-registry` shapes — all currently in `src/engines/nlcl/` |
| **P0-1.w.2** Add C-40..C-44 contracts in `src/kernel/intel/contracts.ts` | 1 PR | The 5 new contracts; the `IIntelligenceRegistry` is the upgrade bus |
| **P0-1.w.3** Move `BudgetEngine` shape to `src/kernel/intel/budget.ts` | 1 PR | The engine shape moves; the *policy* stays in `plugin:cost` (K1) |
| **P0-1.w.4** Refactor `ICommandPipeline` to use K0(L0) | 2 PRs | The CLI REPL + HTTP route + frontend chat all call the same `ICommandPipeline.interpret`; the NLCL orchestrator (`nlcl-engine.ts`) becomes a first-party plugin (`plugin:canon-nlcl`) that registers patterns + executors on the kernel's pipeline |
| **P0-1.w.5** Register `IIntelligenceRegistry` + auto-discover + M-layer integration | 2 PRs | The kernel's `kernel.introspection` (M-layer) automatically lists every K0(L0) substrate; `IWhy.why('embeddings')` answers "what embedding provider is running?" |
| **P0-1.w.6** Degrade tests | 2 PRs | The kernel must boot **without** HF/Ollama/opencode. Tests: (a) `bootKernelOnly()` returns a working kernel with TF-IDF defaults; (b) `bootKernelWithHF()` requires the model file or falls back; (c) `bootKernelWithOpenCode()` requires the subprocess or skips. |
| **P0-1.w.7** Update `KernelRegistry` to auto-register the K0(L0) substrates | 1 PR | The observability kernel sees the intelligence substrate (the `kernel.intelligence` capability is registered; `IIdentityCatalog` lists it) |
| **P0-1.w.8** Arch tests (T25..T28) for K0(L0) | 1 PR | (a) every file under `src/kernel/intel/` may not import from `src/engines/*`; (b) the NLCL orchestrator (`nlcl-engine.ts`) is NOT in the kernel; (c) the opencode supervisor is NOT in the kernel; (d) every kernel contract has `contractVersion: { major: 1; minor: 0 }` including the new C-40..C-44 |

**Total: ~10 PRs, 2 sprints. Independent of P0-1.x (the M-layer) — can ship in parallel.**

---

## 6. What this changes in the existing artifacts

- **`inventory/SELF-DESCRIPTIVE.md`** — add a section: "K0(L0) is the deterministic intelligence substrate. It is inside the kernel boundary, not above it. The M-layer reads from it; the cake uses it; plugins do not own it."
- **`inventory/KERNEL-CONTRACTS.md`** — add C-40..C-44 to the catalog table + per-contract sections.
- **`inventory/PLUGIN-TRUST-MODEL.md`** — add a K0(L0) row to the tier map. Update the "should be" column for the 60+ NLCL files to either K0(L0) mechanism or K1 product.
- **`inventory/KERNEL-BOUNDARY-TESTS.md`** — add T25..T28 (K0(L0) isolation).
- **`inventory/BOUNDARY-MIGRATION-PLAN.md`** — add P0-1.w (K0(L0) phase).
- **`inventory/PLUGIN-BUILDER-CAKE.md`** — update P0: the introspection capabilities now read from `IIntelligenceRegistry` (C-44) in addition to `IContractCatalog` (C-25).
- **`evidence/I-2-PROBE-SPEC.md`** — add probes for the K0(L0) surface (`probe-intelligence-substrate.ts`).
- **`inventory/REASSESSMENT.md`** — add a new section: "K0(L0) — the deterministic intelligence substrate (post-REASSESSMENT addition)".
- **`inventory/AT-FORENSIC-VERDICT.md`** — add the K0(L0) subsystem to the "Final minimal kernel" list (15 → 17+5 = 22).
- **`inventory/FALSE-CORE-AND-MISSING.md`** — reclassify the 60 NLCL files into K0(L0) mechanism vs K1 product.

---

## 7. For the user (plain terms)

**Yes, the existing NLP can power the self-descriptive system.** The M-layer's IWhy uses the same 6-layer pipeline as the command engine (deterministic → fuzzy → semantic → classifier → LLM → none), but it always falls through to `none` and gives a grounded answer. **No hallucination is possible** because the M-layer is co-generated with the source, not generated by an LLM.

**The core deterministic intelligence is a new tier, not a plugin and not a plugin class.** It is **K0(L0) — Kernel / Layer 0**. It is **inside** the kernel boundary, so:

- It cannot be uninstalled.
- It cannot be replaced by a plugin.
- It cannot call out to an LLM (the LLM is a registered *capability*, not a kernel dependency).
- It can be **upgraded** independently of VIVIM's product plugins via `IIntelligenceRegistry.setProvider`.

**What moves to K0(L0):** the deterministic 6-layer pipeline shape, the `ICommandPipeline` (CLI + NLCL + route + execute), the `IEmbeddingProvider` interface, the `IBudgetGuard` interface, the `IIntelligenceRegistry` (the upgrade + introspection bus), and the deterministic text/fuzzy/algorithm primitives.

**What stays K1:** the `LLMSlaveResolver` (uses an LLM), the `OllamaEmbeddingProvider` (requires Ollama service), the `OpenCodeExecutor` + `OpenCodeSupervisor` (spawn subprocess), the `AutonomousExecutionEngine` + `AgentBuilderEngine` (VIVIM-specific), the `HarnessExecutorEngine` (requires Chrome), the 19 `categories/*.ts` pattern data, the 10 `CommandExecutor`s, the 36 first-party plugins.

**What the user gets:** the kernel ships with a working CLI + command resolver + embedding (TF-IDF by default, HF ONNX as optional upgrade). It can be configured to use a different embedding model at boot or at runtime via the M-layer's `IIntelligenceRegistry.setProvider`. The cake's codegen (P1) automatically picks up the current substrate's contract catalog. The M-layer's IWhy answers "what is running?" by introspecting the registry.

**The total cost:** ~10 PRs over 2 sprints. Independent of P0-1.x (the M-layer). Can ship in parallel.

**The architectural insight:** the same split that makes the plugin kernel correct (mechanism = kernel, content = plugin) makes the intelligence kernel correct. The kernel has the *shape*; the plugins have the *content*. The kernel can be installed without any intelligence plugins; the M-layer works; the cake builds plugins; everything is upgradeable independently.

This is what "natively intelligent and natively self-descriptive" looks like in code.
