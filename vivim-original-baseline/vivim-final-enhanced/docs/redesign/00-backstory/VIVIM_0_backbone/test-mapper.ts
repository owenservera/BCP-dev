#!/usr/bin/env bun
/**
 * Test Mapper — maps test files to FEATURE_CARDs based on engine paths
 *
 * Each test file imports the engine it tests. We walk the imports,
 * match against card engines, and produce a test_per_card tally.
 *
 * Usage:
 *   bun .backbone/test-mapper.ts [forge-path]
 */

import { readdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";

const FORGE = process.argv[2] || "C:\\0-BlackBoxProject-0\\VIVIM_0\\work\\forge";
const BACKBONE = "C:\\0-BlackBoxProject-0\\VIVIM_0\\.backbone";

interface TestInfo {
  path: string;
  relative: string;
  kind: "unit" | "integration" | "e2e" | "arch" | "other";
  imports: string[];
  matched_engines: string[];
}

async function readJson(p: string): Promise<any> {
  return JSON.parse(await readFile(p, "utf-8"));
}

async function walkTests(dir: string, base = dir): Promise<string[]> {
  const out: string[] = [];
  try {
    const entries = await readdir(dir, { withFileTypes: true });
    for (const e of entries) {
      const full = join(dir, e.name);
      if (e.isDirectory()) {
        out.push(...await walkTests(full, base));
      } else if (e.name.endsWith(".test.ts")) {
        out.push(full);
      }
    }
  } catch {}
  return out;
}

function detectKind(path: string): TestInfo["kind"] {
  if (path.includes("\\tests\\unit\\") || path.includes("/tests/unit/")) return "unit";
  if (path.includes("\\tests\\integration\\") || path.includes("/tests/integration/")) return "integration";
  if (path.includes("\\tests\\e2e\\") || path.includes("/tests/e2e/")) return "e2e";
  if (path.includes("\\tests\\arch\\") || path.includes("/tests/arch/")) return "arch";
  return "other";
}

function extractImports(content: string): string[] {
  const imports: string[] = [];
  // Match: import ... from '...'; import '...'; from '...'
  const re = /(?:from\s+|import\s+|import\()\s*['"]([^'"]+)['"]/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(content)) !== null) {
    const spec = m[1];
    let cleaned = spec;
    if (cleaned.startsWith("@/")) cleaned = "src/" + cleaned.slice(2);
    // Now look for engines/<name> in the path
    const engMatch = cleaned.match(/(?:\.\.\/|\.\/)*src\/engines\/([a-z0-9_-]+)/i) ||
                     cleaned.match(/^engines\/([a-z0-9_-]+)/i);
    if (engMatch) {
      imports.push(engMatch[1] + ".ts");
    } else {
      // Also match any path that includes engines/ (handles @/engines/x, src/engines/x, etc.)
      const altMatch = cleaned.match(/engines\/([a-z0-9_-]+)/i);
      if (altMatch) {
        imports.push(altMatch[1] + ".ts");
      }
    }
  }
  return [...new Set(imports)];
}

async function run() {
  // Load cards
  const cardsDir = join(BACKBONE, "cards");
  const cardFiles = (await readdir(cardsDir)).filter(f => f.endsWith(".json") && f !== "SCHEMA.json");
  const cards: any[] = [];
  for (const f of cardFiles) {
    cards.push(await readJson(join(cardsDir, f)));
  }

  // Build engine -> card index
  const engineToCard = new Map<string, string>();
  for (const c of cards) {
    for (const e of (c.engines || [])) {
      engineToCard.set(e, c.id);
    }
  }

  // Walk tests
  const testFiles = await walkTests(join(FORGE, "tests"));
  const tests: TestInfo[] = [];
  for (const tf of testFiles) {
    const content = await readFile(tf, "utf-8");
    const imports = extractImports(content);
    const matched = imports.filter(i => engineToCard.has(i));
    tests.push({
      path: tf,
      relative: tf.replace(FORGE + "\\", "").replace(/\\/g, "/"),
      kind: detectKind(tf),
      imports,
      matched_engines: matched
    });
  }

  // Aggregate per card
  const cardTestStats: Record<string, any> = {};
  for (const c of cards) {
    cardTestStats[c.id] = {
      card: c.id,
      name: c.name,
      unit: 0,
      integration: 0,
      e2e: 0,
      arch: 0,
      total: 0,
      covered: false
    };
  }
  for (const t of tests) {
    if (t.matched_engines.length === 0) continue;
    for (const eng of t.matched_engines) {
      const cardId = engineToCard.get(eng);
      if (!cardId) continue;
      cardTestStats[cardId][t.kind]++;
      cardTestStats[cardId].total++;
    }
  }
  for (const stats of Object.values(cardTestStats) as any[]) {
    stats.covered = stats.total > 0;
  }

  // Update cards with test stats + auto-advance state if SCAFFOLDED+ has tests
  let updated = 0;
  for (const c of cards) {
    const stats = cardTestStats[c.id];
    c.tests = {
      unit: stats.unit,
      integration: stats.integration,
      e2e: stats.e2e,
      arch: stats.arch,
      passing: 0,  // requires running tests
      failing: 0
    };
    // Auto-advance DISCOVERED -> MAPPED if engines exist; MAPPED -> SCAFFOLDED if tests exist
    if (c.state === "DISCOVERED" && c.engines && c.engines.length > 0) {
      c.state = "MAPPED";
    }
    if (c.state === "MAPPED" && stats.total > 0) {
      c.state = "SCAFFOLDED";
    }
    c.last_verified = new Date().toISOString();
    await writeFile(join(cardsDir, `${c.id}-${c.slug}.json`), JSON.stringify(c, null, 2), "utf-8");
    updated++;
  }

  // Write test map
  const mapPath = join(BACKBONE, "test-map.json");
  await writeFile(mapPath, JSON.stringify({
    timestamp: new Date().toISOString(),
    total_tests: tests.length,
    by_kind: {
      unit: tests.filter(t => t.kind === "unit").length,
      integration: tests.filter(t => t.kind === "integration").length,
      e2e: tests.filter(t => t.kind === "e2e").length,
      arch: tests.filter(t => t.kind === "arch").length,
      other: tests.filter(t => t.kind === "other").length
    },
    card_coverage: cardTestStats,
    unmatched_tests: tests.filter(t => t.matched_engines.length === 0).map(t => t.relative)
  }, null, 2), "utf-8");

  // Summary
  console.log(`\n=== TEST MAPPER ===`);
  console.log(`Total test files: ${tests.length}`);
  console.log(`  unit:        ${tests.filter(t => t.kind === "unit").length}`);
  console.log(`  integration: ${tests.filter(t => t.kind === "integration").length}`);
  console.log(`  e2e:         ${tests.filter(t => t.kind === "e2e").length}`);
  console.log(`  arch:        ${tests.filter(t => t.kind === "arch").length}`);
  console.log(`Cards updated: ${updated}`);
  const covered = Object.values(cardTestStats).filter((s: any) => s.covered).length;
  console.log(`Cards with tests: ${covered} / ${cards.length}`);
  const uncovered = Object.values(cardTestStats).filter((s: any) => !s.covered).map((s: any) => s.card);
  if (uncovered.length > 0) {
    console.log(`\nCards WITHOUT tests (gaps):`);
    uncovered.forEach(c => console.log(`  ${c}`));
  }
  const orphanTests = tests.filter(t => t.matched_engines.length === 0);
  if (orphanTests.length > 0) {
    console.log(`\nTests not matched to any card (${orphanTests.length}):`);
    orphanTests.slice(0, 10).forEach(t => console.log(`  ${t.relative}`));
    if (orphanTests.length > 10) console.log(`  ... and ${orphanTests.length - 10} more`);
  }
}

run().catch(e => { console.error(e); process.exit(1); });
