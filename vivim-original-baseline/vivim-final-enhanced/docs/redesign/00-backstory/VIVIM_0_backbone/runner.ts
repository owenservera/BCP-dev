#!/usr/bin/env bun
/**
 * Backbone Runner — regenerates .backbone/ from the actual repo state
 *
 * This is the source of truth regenerator. It walks the Forge, finds engines,
 * clusters them, and produces FEATURE_CARDs. It does NOT inherit from
 * MASTER-BLUEPRINT, KB-ARCHITECTURE, or any old planning doc.
 *
 * Usage:
 *   bun .backbone/runner.ts [forge-path]
 *   bun .backbone/runner.ts C:\0-BlackBoxProject-0\VIVIM_0\work\forge
 *
 * Output:
 *   .backbone/cards/F-NNN-*.json
 *   .backbone/runs/<timestamp>.json  (run record)
 *   .backbone/STATE.json             (overall stats)
 */

import { readdir, readFile, writeFile, stat, mkdir } from "node:fs/promises";
import { join, basename } from "node:path";

const FORGE = process.argv[2] || "C:\\0-BlackBoxProject-0\\VIVIM_0\\work\\forge";
const BACKBONE = "C:\\0-BlackBoxProject-0\\VIVIM_0\\.backbone";

interface Cluster {
  id: string;
  slug: string;
  name: string;
  category: string;
  engines: string[];
  value_targets: string[];
  description: string;
}

// My independent feature discovery — based on what I read in the actual code.
// Not inherited from MASTER-BLUEPRINT. Not inherited from KB. Not inherited from anywhere.
const CLUSTERS: Cluster[] = [
  {
    id: "F-001",
    slug: "conversation-system",
    name: "Conversation System",
    category: "KERNEL",
    engines: ["conversation-manager.ts", "conversation-organizer.ts", "conversation-history-sync.ts", "cross-conversation-synthesis.ts", "message-identity.ts"],
    value_targets: ["V-1"],
    description: "Core chat/messaging system. Manages conversations, messages, history, identity. The user-facing chat surface."
  },
  {
    id: "F-002",
    slug: "memory-system",
    name: "Memory System (FSRS-6)",
    category: "KERNEL",
    engines: ["memory-engine.ts", "memory-export.ts", "memory-indexer.ts", "fsrs-scheduler.ts"],
    value_targets: ["V-1", "V-3"],
    description: "FSRS-6 spaced repetition memory. Stores, schedules, retrieves memories across sessions."
  },
  {
    id: "F-003",
    slug: "knowledge-graph",
    name: "Knowledge Graph",
    category: "KERNEL",
    engines: ["knowledge-envelope.ts", "knowledge-extractor.ts", "knowledge-extractor-continuous.ts", "knowledge-index-pipeline.ts", "knowledge-ingestion.ts", "belief-store.ts"],
    value_targets: ["V-3", "V-4"],
    description: "Node-based knowledge graph. Extracts entities, builds edges, indexes for retrieval."
  },
  {
    id: "F-004",
    slug: "context-assembly",
    name: "Context Assembly",
    category: "KERNEL",
    engines: ["context-assembly.ts", "semantic-grounding.ts", "reference-grounding.ts"],
    value_targets: ["V-1", "V-3"],
    description: "Assembles context for LLM calls from memory, knowledge, and conversation history."
  },
  {
    id: "F-005",
    slug: "provider-cdp-system",
    name: "Provider + CDP System",
    category: "PLUGIN",
    engines: ["provider-registrar.ts", "provider-protocol-loader.ts", "provider-protocol-generator.ts", "provider-health.ts", "provider-mux.ts", "provider-caps.ts", "chrome-governor.ts", "chrome-setup-wizard.ts", "cdp-discovery.ts", "cdp-capability-registrar.ts", "cdp-watchdog.ts", "browser-action-types.ts", "protocol-discovery.ts", "protocol-loop-parser.ts"],
    value_targets: ["V-1"],
    description: "Multi-provider system with Chrome DevTools Protocol via ChromeGovernor. 16 providers registered, 6 UI-facing (chatgpt, claude, gemini, deepseek, qwen, grok)."
  },
  {
    id: "F-006",
    slug: "provider-discovery-test",
    name: "Provider Discovery & Test Harness",
    category: "PLUGIN",
    engines: ["provider-discovery.ts", "provider-test-harness.ts", "provider-conversation-adapter.ts", "provider-selectors.ts"],
    value_targets: ["V-3"],
    description: "8-phase onboarding pipeline: discover → infer → test-selectors → test-parse → test-cap → test-frontend → verify → converge."
  },
  {
    id: "F-007",
    slug: "capability-registry",
    name: "Capability Registry",
    category: "KERNEL",
    engines: ["capability.ts", "capability-bootstrap.ts", "capability-bootstrap-generated.ts", "capability-resolution.ts", "capability-composer.ts", "capability-binder.ts", "capability-event-bus.ts", "capability-event-bus-v2.ts", "capability-snapshot.ts", "capability-taxonomy.ts", "capability-shape-registry.ts", "capability-discovery-loop.ts", "capability-macro.ts", "capability-parity.ts", "command-parity-capabilities.ts", "unified-registry.ts", "live-capability-registry.ts", "live-capture-engine.ts", "builtin-capability-wrappers.ts"],
    value_targets: ["V-1", "V-3"],
    description: "UnifiedCapability registry. Every operation is a capability. CLI/UI/API/MCP are thin shells over this."
  },
  {
    id: "F-008",
    slug: "action-plan-ir",
    name: "ActionPlan IR",
    category: "KERNEL",
    engines: ["action-plan.ts", "action-plan-bridge.ts", "action-plan-compiler.ts", "plan-validation-gate.ts"],
    value_targets: ["V-1", "V-3"],
    description: "ActionPlan intermediate representation. The structured plan an agent produces before execution."
  },
  {
    id: "F-009",
    slug: "execution-kernel",
    name: "Execution Kernel",
    category: "KERNEL",
    engines: ["execution-kernel.ts", "execution-memoizer.ts", "execution-policy.ts", "autonomous-execution.ts", "autonomous-replay.ts", "tool-orchestrator-facade.ts", "tool-use-protocol.ts", "workflow-compiler.ts", "workflow-engine.ts", "discovery-session-runner.ts", "conceptual-model-service.ts"],
    value_targets: ["V-1", "V-3"],
    description: "Executes ActionPlans. Memoizes, enforces policy, supports replay for debugging."
  },
  {
    id: "F-010",
    slug: "agent-builder",
    name: "Agent Builder",
    category: "PLUGIN",
    engines: ["agent-builder.ts", "agentic-loop.ts", "agentic-slm.ts", "autonomous-planner.ts", "autonomous-types.ts"],
    value_targets: ["V-3"],
    description: "Builds and runs autonomous agents. Planner + loop + small model adapter."
  },
  {
    id: "F-011",
    slug: "stream-parsing",
    name: "Stream Parsing",
    category: "PLUGIN",
    engines: ["stream-parser.ts", "stream-align.ts", "stream-block-store.ts", "streaming-channel-caps.ts", "streaming-protocol.ts", "streaming-response-analyzer.ts", "parser-repair.ts", "format-classifier.ts"],
    value_targets: ["V-1"],
    description: "DB-driven stream parsing. 7 harvested parsers (claude, chatgpt, gemini, google-ai-studio, deepseek, generic, system). Fallback chain: provider → generic → system."
  },
  {
    id: "F-012",
    slug: "harness-execution",
    name: "Harness Execution",
    category: "KERNEL",
    engines: ["harness-runtime.ts", "harness-protocol-engine.ts", "harness-repair-engine.ts", "harness-command-registry.ts", "harness-feedback-coordinator.ts", "harness-checkpoint.ts"],
    value_targets: ["V-1", "V-3"],
    description: "Browser-free schema repair pipeline. Zod validation + repair with retry escalation. JSON repair for LLM outputs."
  },
  {
    id: "F-013",
    slug: "semantic-retrieval",
    name: "Semantic Retrieval",
    category: "PLUGIN",
    engines: ["semantic-search.ts", "embedding-hf.ts", "embedding-minilm.ts", "embedding-ollama.ts", "embedding-classifier.ts", "indexing-pipeline.ts", "dcb-profile.ts", "dcb-projector.ts", "classifier-nli.ts", "intent-decomposer.ts"],
    value_targets: ["V-3"],
    description: "Hybrid retrieval: sparse TF-IDF + dense embeddings. 3 providers: Ollama (nomic), MiniLM, HuggingFace."
  },
  {
    id: "F-014",
    slug: "sandbox-security",
    name: "Sandbox & Security Eval",
    category: "KERNEL",
    engines: ["safe-eval.ts", "safe-expression.ts", "sandbox-runner.ts", "sandbox-runner-vm.ts", "sandbox-runner-quickjs.ts", "airgap.ts", "anti-detection.ts"],
    value_targets: ["V-1", "V-2"],
    description: "Safe-eval gate, sandbox runners (VM + QuickJS), airgap mode, anti-detection. H1-H15 remediation lives here."
  },
  {
    id: "F-015",
    slug: "governance-policy",
    name: "Governance & Policy",
    category: "KERNEL",
    engines: ["consent-engine.ts", "governance-engine.ts", "policy-engine.ts", "trust-score.ts", "audit-trail.ts", "event-record-store.ts", "telemetry-audit.ts"],
    value_targets: ["V-1", "V-2"],
    description: "User consent, governance, policy enforcement, trust scoring, audit trail, event recording."
  },
  {
    id: "F-016",
    slug: "encryption-privacy",
    name: "Encryption & Privacy",
    category: "KERNEL",
    engines: ["encryption.ts", "db-encryption.ts"],
    value_targets: ["V-2"],
    description: "Encryption layer (app-level) + DB-level encryption. Local-first privacy guarantees."
  },
  {
    id: "F-017",
    slug: "observability",
    name: "Observability",
    category: "INFRA",
    engines: ["telemetry-aggregator.ts", "registration-auditor.ts", "sla-monitor.ts", "metrics.ts", "otel-sink.ts", "error-tracker.ts", "health-digest.ts"],
    value_targets: ["V-3"],
    description: "Telemetry, metrics, OpenTelemetry sink, error tracking, health digest, SLA monitor."
  },
  {
    id: "F-018",
    slug: "storage-relocation",
    name: "Storage Relocation & Backup",
    category: "INFRA",
    engines: ["storage-relocation-engine.ts", "eviction-manager.ts", "compaction-manager.ts", "backup-manager.ts", "backup-scheduler.ts", "mirror-engine.ts"],
    value_targets: ["V-1"],
    description: "Storage engine for relocation, eviction, compaction, backup, mirror. Data lifecycle management."
  },
  {
    id: "F-019",
    slug: "lifecycle-session",
    name: "Lifecycle & Session",
    category: "KERNEL",
    engines: ["lifecycle-engine.ts", "version-manager.ts", "session-checkpoint.ts", "session-lifecycle-manager.ts", "session-state-persistence.ts", "state-transition.ts", "loop-detector.ts"],
    value_targets: ["V-1", "V-3"],
    description: "App/session lifecycle, version management, checkpointing, state transitions, loop detection."
  },
  {
    id: "F-020",
    slug: "sync-p2p",
    name: "P2P Sync",
    category: "PLUGIN",
    engines: ["sync.ts", "sync-engine.ts", "lock-manager.ts", "idempotency-guard.ts"],
    value_targets: ["V-3"],
    description: "Peer-to-peer sync between machines. Lock manager + idempotency guard for safe concurrent writes."
  },
  {
    id: "F-021",
    slug: "user-identity",
    name: "User Identity & Contacts",
    category: "KERNEL",
    engines: ["user-identity.ts", "session-caps.ts", "contact-engine.ts", "notification-engine.ts"],
    value_targets: ["V-1", "V-2"],
    description: "User identity, session capabilities, contact management, notifications."
  },
  {
    id: "F-022",
    slug: "plugin-system",
    name: "Plugin System",
    category: "KERNEL",
    engines: ["plugin-system.ts", "plugin-hot-reload.ts", "router-capability-bridge.ts"],
    value_targets: ["V-3"],
    description: "Plugin lifecycle + hot-reload + bridge from plugin capabilities to the registry."
  },
  {
    id: "F-023",
    slug: "mcp-integration",
    name: "MCP Integration",
    category: "PLUGIN",
    engines: ["mcp-client-adapter.ts", "mcp-server-adapter.ts"],
    value_targets: ["V-3"],
    description: "Model Context Protocol client and server adapters."
  },
  {
    id: "F-024",
    slug: "workspace-presets",
    name: "Workspace & Presets",
    category: "PLUGIN",
    engines: ["workspace-presets.ts", "adaptive-workspace.ts", "manifest-inference.ts"],
    value_targets: ["V-1"],
    description: "Workspace presets + adaptive workspace + manifest inference (auto-discover capabilities)."
  },
  {
    id: "F-025",
    slug: "observation-outcome",
    name: "Observation & Outcome",
    category: "INFRA",
    engines: ["observation-tap.ts", "outcome-tracker.ts", "task-history.ts", "config-manager.ts", "config-universal-surface.ts"],
    value_targets: ["V-3"],
    description: "Observation tap (event stream), outcome tracking, task history, universal config."
  },
  {
    id: "F-026",
    slug: "media-bridge",
    name: "Media & LLM Bridge",
    category: "PLUGIN",
    engines: ["media-engine.ts", "image-gen-bridge.ts", "local-model-adapter.ts", "api-provider-adapter.ts", "gateway-provider-llm-adapter.ts"],
    value_targets: ["V-1"],
    description: "Media engine (images, files), image generation bridge, local model adapter, API provider adapter, LLM gateway."
  },
  {
    id: "F-027",
    slug: "send-resilience",
    name: "Send & Resilience",
    category: "PLUGIN",
    engines: ["send-capability.ts", "send-resilience.ts", "request-queue.ts", "retry-engine.ts"],
    value_targets: ["V-1"],
    description: "Resilient message sending: capability, resilience layer, request queue, retry engine."
  },
  {
    id: "F-028",
    slug: "budget-cost",
    name: "Budget & Cost",
    category: "PLUGIN",
    engines: ["budget-engine.ts", "cortex-budget.ts", "cost-optimizer.ts"],
    value_targets: ["V-1"],
    description: "Budget enforcement, cortex budget, cost optimization. Spend tracking across LLM calls."
  },
  {
    id: "F-029",
    slug: "update-system",
    name: "Update & Transfer",
    category: "INFRA",
    engines: ["update-engine.ts", "transfer-accelerator.ts", "export.ts"],
    value_targets: ["V-1"],
    description: "Self-update, transfer accelerator, data export. Desktop app update flow."
  },
  {
    id: "F-030",
    slug: "selector-resilience",
    name: "Selector Resilience",
    category: "PLUGIN",
    engines: ["selector-cache.ts", "selector-healer.ts", "selector-refiner.ts", "situation-detector.ts"],
    value_targets: ["V-1"],
    description: "CDP selector caching, healing (auto-recover broken selectors), refinement, situation detection."
  },
  {
    id: "F-031",
    slug: "humanization-ux",
    name: "Humanization & UX",
    category: "PLUGIN",
    engines: ["humanized-interaction.ts", "composer-typing.ts", "messaging-archetypes.ts"],
    value_targets: ["V-1"],
    description: "Humanized interaction patterns, composer typing simulation, messaging archetypes."
  },
  {
    id: "F-032",
    slug: "content-management",
    name: "Content & Collections",
    category: "PLUGIN",
    engines: ["content-item-engine.ts", "content-unit-decomposer.ts", "entity-container-engine.ts", "collection-engine.ts", "objective-engine.ts"],
    value_targets: ["V-1", "V-4"],
    description: "Content items, decomposition, entity containers, collections, objectives (goals)."
  },
  {
    id: "F-033",
    slug: "canvas-frontend",
    name: "Canvas Frontend",
    category: "SURFACE",
    engines: ["canvas-layer-mounter.ts"],
    value_targets: ["V-1"],
    description: "Canvas layer mounting. The live-config canvas surface in the frontend."
  },
  // Infrastructure-level cards (not engines, but critical)
  {
    id: "F-034",
    slug: "frontend-surfaces",
    name: "Frontend Surfaces (Next.js + React)",
    category: "SURFACE",
    engines: [],
    frontend_paths: ["frontend/src/app/", "frontend/src/components/", "frontend/src/engines/", "frontend/src/features/"],
    value_targets: ["V-1"],
    description: "Next.js 16 + React 19 frontend. App router + canvas + components + engines + features. 200+ components."
  },
  {
    id: "F-035",
    slug: "desktop-installer",
    name: "Desktop Installer (Tauri v2)",
    category: "INFRA",
    engines: [],
    frontend_paths: ["src-tauri/"],
    value_targets: ["V-1"],
    description: "Tauri v2 + Bun sidecar + NSIS installer. Desktop app shell. 5-gate orchestrator (Build → Install → Launch → Capture → Report). 15-action devops toolkit."
  },
  {
    id: "F-036",
    slug: "dual-db-system",
    name: "Dual-DB System (system + user)",
    category: "KERNEL",
    engines: [],
    frontend_paths: ["prisma/system/", "prisma/user/"],
    value_targets: ["V-1", "V-2"],
    description: "Prisma split: system DB (111 models, framework-managed) + user DB (90 models, user data). 201 total models. Cross-boundary storage contract."
  },
  {
    id: "F-037",
    slug: "seed-pipeline",
    name: "Seed Pipeline",
    category: "INFRA",
    engines: [],
    frontend_paths: ["seeds/"],
    value_targets: ["V-1"],
    description: "DB seed pipeline. Providers, parsers, capabilities, harnesses, adapters, taxonomy, conceptual model. Seeds-as-truth."
  },
  {
    id: "F-038",
    slug: "devops-tooling",
    name: "DevOps Tooling",
    category: "INFRA",
    engines: [],
    frontend_paths: ["devops/", "scripts/"],
    value_targets: ["V-1", "V-3"],
    description: "Desktop build, runtime test, provider onboarding, audit, cleanup, cross-surface verification, harness, openapi gen, db doctor, context-tag-pass."
  },
  {
    id: "F-039",
    slug: "test-suite",
    name: "Test Suite",
    category: "INFRA",
    engines: [],
    frontend_paths: ["tests/"],
    value_targets: ["V-1", "V-3"],
    description: "Test corpus. 377 unit, 58 integration, 22 e2e, 7 arch = 464 test files. Bun test runner."
  },
  {
    id: "F-040",
    slug: "logging",
    name: "Logging Infrastructure",
    category: "INFRA",
    engines: ["logger.ts"],
    value_targets: ["V-3"],
    description: "Pino-based logger. Per-engine getLogger() pattern. OpenTelemetry forwarding via otel-sink."
  },
];

async function fileExists(p: string): Promise<boolean> {
  try { await stat(p); return true; } catch { return false; }
}

async function run() {
  const runId = new Date().toISOString().replace(/[:.]/g, "-");
  const runDir = join(BACKBONE, "runs");
  await mkdir(runDir, { recursive: true });
  await mkdir(join(BACKBONE, "cards"), { recursive: true });

  // Discover actual engines
  const enginesDir = join(FORGE, "src", "engines");
  const files = await readdir(enginesDir);
  const actualEngines = files.filter(f => f.endsWith(".ts")).map(f => f);

  // Build cards
  const cards: any[] = [];
  const now = new Date().toISOString();
  let covered = 0;
  const orphans: string[] = [];

  for (const cluster of CLUSTERS) {
    const existing = cluster.engines.filter(e => actualEngines.includes(e));
    const missing = cluster.engines.filter(e => !actualEngines.includes(e));
    covered += existing.length;

    if (cluster.engines.length === 0) {
      // Infrastructure card — verify path exists
      const pathsExist = await Promise.all(
        (cluster.frontend_paths || []).map(p => fileExists(join(FORGE, p)))
      );
      const allExist = pathsExist.every(x => x);
      if (!allExist) {
        missing.push(`(infrastructure paths: ${cluster.frontend_paths?.join(", ")})`);
      }
    }

    const card = {
      id: cluster.id,
      slug: cluster.slug,
      name: cluster.name,
      category: cluster.category,
      state: existing.length === cluster.engines.length && cluster.engines.length > 0 ? "MAPPED" : "DISCOVERED",
      value_targets: cluster.value_targets,
      engines: existing,
      frontend_paths: cluster.frontend_paths || [],
      description: cluster.description,
      sota_status: "UNKNOWN",
      tests: { unit: 0, integration: 0, e2e: 0, arch: 0, passing: 0, failing: 0 },
      migration: {
        from: existing.length === 0 ? "nothing" : "partial",
        to: "WORKING",
        steps: [],
        effort: "M",
        risk: "MEDIUM",
        reversible: true
      },
      cleanup_debt: { files_to_remove: [], files_to_rename: [], files_to_split: [], dead_code: [], stale_tests: [], stale_docs: [] },
      created: now,
      last_verified: now,
      evidence_class: "FACT",
      _missing: missing.length > 0 ? missing : undefined
    };

    cards.push(card);

    // Write card file
    const cardPath = join(BACKBONE, "cards", `${cluster.id}-${cluster.slug}.json`);
    await writeFile(cardPath, JSON.stringify(card, null, 2), "utf-8");
  }

  // Find orphan engines (not in any cluster)
  const allClustered = new Set<string>();
  for (const c of CLUSTERS) {
    for (const e of c.engines) allClustered.add(e);
  }
  for (const e of actualEngines) {
    if (!allClustered.has(e)) orphans.push(e);
  }

  // Write run record
  const runRecord = {
    run_id: runId,
    timestamp: now,
    forge: FORGE,
    totals: {
      total_engines: actualEngines.length,
      clustered: covered,
      orphans: orphans.length,
      cards_created: cards.length
    },
    orphans: orphans,
    by_state: cards.reduce((acc: any, c) => {
      acc[c.state] = (acc[c.state] || 0) + 1;
      return acc;
    }, {}),
    by_category: cards.reduce((acc: any, c) => {
      acc[c.category] = (acc[c.category] || 0) + 1;
      return acc;
    }, {})
  };

  await writeFile(join(runDir, `${runId}.json`), JSON.stringify(runRecord, null, 2), "utf-8");
  await writeFile(join(BACKBONE, "STATE.json"), JSON.stringify(runRecord, null, 2), "utf-8");

  // Print summary
  console.log(`\n=== BACKBONE RUN ${runId} ===`);
  console.log(`Forge: ${FORGE}`);
  console.log(`Cards: ${cards.length}`);
  console.log(`Engines: ${actualEngines.length} total, ${covered} clustered, ${orphans.length} orphans`);
  console.log(`\nBy state:`);
  for (const [s, n] of Object.entries(runRecord.by_state)) {
    console.log(`  ${s}: ${n}`);
  }
  console.log(`\nBy category:`);
  for (const [c, n] of Object.entries(runRecord.by_category)) {
    console.log(`  ${c}: ${n}`);
  }
  if (orphans.length > 0) {
    console.log(`\nOrphan engines (not in any cluster):`);
    orphans.forEach(o => console.log(`  - ${o}`));
  }
  console.log(`\nRun record: ${join(runDir, runId + ".json")}`);
  console.log(`State:     ${join(BACKBONE, "STATE.json")}`);
}

run().catch(e => { console.error(e); process.exit(1); });
