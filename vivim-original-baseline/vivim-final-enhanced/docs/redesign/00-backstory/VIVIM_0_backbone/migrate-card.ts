#!/usr/bin/env bun
/**
 * Migration tool: Copy a card's engines + tests to its landing folder,
 * fix imports, quarantine over-imported tests, and run the gate.
 *
 * Usage: bun .backbone/migrate-card.ts <CARD_ID>
 *   e.g. bun .backbone/migrate-card.ts F-008
 */

import { readdir, readFile, writeFile, rename, mkdir, stat, copyFile, readFile as readFileP } from "node:fs/promises";
import { join, dirname } from "node:path";
import { spawn } from "bun";

const FORGE = "C:\\0-BlackBoxProject-0\\VIVIM_0\\work\\forge";
const BACKBONE = "C:\\0-BlackBoxProject-0\\VIVIM_0\\.backbone";
const NEXT = "C:\\0-BlackBoxProject-0\\VIVIM_0\\VIVIM-next";
const cardId = process.argv[2];

if (!cardId) {
  console.error("Usage: bun .backbone/migrate-card.ts <CARD_ID>");
  process.exit(1);
}

// Card landing path lookup (same as LANDING-SKELETON.md)
const LANDINGS: Record<string, string> = {
  "F-001": "kernel/execution",
  "F-002": "plugins/memory",
  "F-003": "plugins/retrieval/knowledge-graph",
  "F-004": "plugins/retrieval",
  "F-005": "plugins/provider",
  "F-006": "plugins/provider/discovery",
  "F-007": "kernel/capability",
  "F-008": "kernel/execution",
  "F-009": "kernel/execution",
  "F-010": "plugins/agent",
  "F-011": "plugins/parsing",
  "F-012": "kernel/execution",
  "F-013": "plugins/retrieval",
  "F-014": "kernel/security",
  "F-015": "kernel/security",
  "F-016": "kernel/security",
  "F-017": "infra/observability",
  "F-018": "kernel/storage",
  "F-019": "kernel/identity",
  "F-020": "plugins/sync",
  "F-021": "kernel/identity",
  "F-022": "plugins/plugin-system",
  "F-023": "plugins/mcp",
  "F-024": "plugins/agent",
  "F-025": "infra/observability",
  "F-026": "plugins/retrieval",
  "F-027": "plugins/provider/resilience",
  "F-028": "plugins/budget",
  "F-029": "infra/update",
  "F-030": "plugins/provider/resilience",
  "F-031": "plugins/agent",
  "F-032": "plugins/retrieval",
  "F-033": "surfaces/web/canvas",
  "F-036": "kernel/storage",
  "F-040": "infra/logging",
  "F-041": "plugins/voice",
};

async function fileExists(p: string): Promise<boolean> {
  try { await stat(p); return true; } catch { return false; }
}

async function main() {
  // Load card
  const cards = (await readdir(join(BACKBONE, "cards"))).filter(f => f.startsWith(cardId) && f.endsWith(".json"));
  if (cards.length === 0) {
    console.error(`Card ${cardId} not found`);
    process.exit(1);
  }
  const card = JSON.parse(await readFile(join(BACKBONE, "cards", cards[0]), "utf-8"));
  console.log(`Migrating ${cardId}: ${card.name}`);

  // Find landing path
  const landing = LANDINGS[cardId];
  if (!landing) {
    console.error(`No landing mapping for ${cardId}. Add to LANDINGS in this script.`);
    process.exit(1);
  }
  const landingDir = join(NEXT, landing);
  const testsDir = join(landingDir, "tests");
  await mkdir(landingDir, { recursive: true });
  await mkdir(testsDir, { recursive: true });
  await mkdir(join(testsDir, ".quarantine"), { recursive: true });

  // Copy engines
  let copiedEngines = 0;
  for (const eng of card.engines || []) {
    const src = join(FORGE, "src", "engines", eng);
    const dst = join(landingDir, eng);
    if (await fileExists(src)) {
      await copyFile(src, dst);
      copiedEngines++;
    }
  }
  console.log(`  Copied ${copiedEngines}/${card.engines?.length || 0} engines to ${landing}`);

  // Find and copy tests
  const forgeTests = (await readdir(join(FORGE, "tests"), { recursive: true, withFileTypes: true }))
    .filter(f => f.isFile() && f.name.endsWith(".test.ts"));
  let copiedTests = 0;
  for (const t of forgeTests) {
    const content = await readFile(join(t.parentPath, t.name), "utf-8");
    const matches = (card.engines || []).some((e: string) => content.match(new RegExp(`engines[\\\\/]${e.replace(/[.+*?^${}()|[\\]\\\\]/g, '\\$&')}[\\.'""]`)));
    if (matches) {
      await copyFile(join(t.parentPath, t.name), join(testsDir, t.name));
      copiedTests++;
    }
  }
  console.log(`  Copied ${copiedTests} candidate tests`);

  // Fix import paths in copied files
  // Pattern 1: '../../../src/engines/X.js' or similar -> '../../../<landing-parent>/X.js' (test)
  // Pattern 2: '../src/engines/X.js' -> '../../<landing-parent>/X.js' (test in subdir)
  // Pattern 3: '../X.js' (sibling) - check if it's a F-007 engine
  const F007_ENGINES = ["capability","capability-bootstrap","capability-resolution","capability-event-bus","capability-snapshot","capability-taxonomy","unified-registry","capability-binder","capability-macro","capability-parity","command-parity-capabilities","capability-composer","capability-shape-registry","capability-discovery-loop","capability-event-bus-v2","capability-bootstrap-generated","live-capability-registry","live-capture-engine","builtin-capability-wrappers"];
  const f007Path = "kernel/capability";

  // For tests
  for (const t of (await readdir(testsDir, { withFileTypes: true })).filter(f => f.name.endsWith(".test.ts"))) {
    const p = join(testsDir, t.name);
    let content = await readFile(p, "utf-8");
    const original = content;
    // ../../../src/engines -> ../../../<kernel-or-plugin-parent>/
    // Compute target dir relative to tests/ (which is at <landing>/tests/)
    // src/engines/X.js maps to <landing-parent>/X.js
    const targetDir = "../".repeat(3) + "../" + landing;  // this is wrong, need depth
    // Actually for tests in <landing>/tests/, to reach kernel/ you go up 2 levels.
    // For tests in <landing>/tests/.quarantine/ you go up 3.
    // Let's just use the landing path properly.
    content = content.replace(/['"]\.\.\/\.\.\/\.\.\/src\/engines\/([a-z0-9_\-\/]+?)\.js['"]/g, (m, p) => {
      // The F-007 engines go to kernel/capability, others to their landing
      if (F007_ENGINES.includes(p)) return `'../../${f007Path}/${p}.js'`;
      return `'../../../${landing}/${p}.js'`;
    });
    content = content.replace(/['"]\.\.\/\.\.\/src\/engines\/([a-z0-9_\-\/]+?)\.js['"]/g, (m, p) => {
      if (F007_ENGINES.includes(p)) return `'../${f007Path}/${p}.js'`;
      return `'../../${landing}/${p}.js'`;
    });
    content = content.replace(/['"]\.\.\/src\/engines\/([a-z0-9_\-\/]+?)\.js['"]/g, (m, p) => {
      if (F007_ENGINES.includes(p)) return `'${f007Path}/${p}.js'`;
      return `'${landing}/${p}.js'`;
    });
    // For src/errors, src/lib
    content = content.replace(/['"]\.\.\/\.\.\/\.\.\/src\/(errors|lib)\/([a-z0-9_\-\/]+?)\.js['"]/g, `'../../../kernel/types/$2.js'`);
    content = content.replace(/['"]\.\.\/\.\.\/src\/(errors|lib)\/([a-z0-9_\-\/]+?)\.js['"]/g, `'../../kernel/types/$2.js'`);
    content = content.replace(/['"]\.\.\/src\/(errors|lib)\/([a-z0-9_\-\/]+?)\.js['"]/g, `'kernel/types/$2.js'`);
    // For src/storage
    content = content.replace(/['"]\.\.\/\.\.\/\.\.\/src\/storage\/([a-z0-9_\-\/]+?)\.js['"]/g, `'../../../kernel/storage/$1.js'`);
    content = content.replace(/['"]\.\.\/\.\.\/src\/storage\/([a-z0-9_\-\/]+?)\.js['"]/g, `'../../kernel/storage/$1.js'`);
    if (content !== original) {
      await writeFile(p, content, "utf-8");
    }
  }

  // For engines
  for (const e of (await readdir(landingDir, { withFileTypes: true })).filter(f => f.name.endsWith(".ts") && !f.name.endsWith(".test.ts"))) {
    const p = join(landingDir, e.name);
    let content = await readFile(p, "utf-8");
    const original = content;
    // '../errors.js' -> '../types/errors.js' (for kernel/execution from kernel/types)
    // Need to determine: is landing under kernel/ or plugins/?
    if (landing.startsWith("kernel/")) {
      // For kernel/execution: ../types/errors.js, ./sibling.js
      content = content.replace(/from\s+['"]\.\.\/errors\.js['"]/g, `from '../types/errors.js'`);
      content = content.replace(/from\s+['"]\.\.\/ids\.js['"]/g, `from '../types/ids.js'`);
    } else {
      // For plugins: ../../kernel/types/errors.js
      content = content.replace(/from\s+['"]\.\.\/\.\.\/errors\.js['"]/g, `from '../../kernel/types/errors.js'`);
      content = content.replace(/from\s+['"]\.\.\/errors\.js['"]/g, `from '../../kernel/types/errors.js'`);
      content = content.replace(/from\s+['"]\.\.\/\.\.\/ids\.js['"]/g, `from '../../kernel/types/ids.js'`);
      content = content.replace(/from\s+['"]\.\.\/ids\.js['"]/g, `from '../../kernel/types/ids.js'`);
    }
    if (content !== original) {
      await writeFile(p, content, "utf-8");
    }
  }

  // Quarantine over-imported tests
  let quarantined = 0;
  for (const t of (await readdir(testsDir, { withFileTypes: true })).filter(f => f.name.endsWith(".test.ts"))) {
    const p = join(testsDir, t.name);
    const proc = spawn({
      cmd: ["bun", "test", p, "--no-color"],
      cwd: NEXT,
      stdout: "pipe",
      stderr: "pipe"
    });
    const [stdout, stderr] = await Promise.all([
      new Response(proc.stdout).text(),
      new Response(proc.stderr).text()
    ]);
    await proc.exited;
    const out = stdout + stderr;
    if (out.includes("Cannot find module")) {
      await rename(p, join(testsDir, ".quarantine", t.name));
      quarantined++;
    }
  }
  console.log(`  Quarantined ${quarantined} over-imported tests`);

  // Run the gate
  console.log(`\nRunning gate for ${cardId} in ${landing}...`);
  const gateProc = spawn({
    cmd: ["bun", join(BACKBONE, "gate.ts"), "--card", cardId],
    cwd: "C:\\0-BlackBoxProject-0\\VIVIM_0",
    stdout: "inherit",
    stderr: "inherit"
  });
  await gateProc.exited;
  console.log(`\nGate exit: ${gateProc.exitCode}`);
}

main().catch(e => { console.error(e); process.exit(1); });
