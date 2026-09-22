#!/usr/bin/env bun
/**
 * Wave Planner — groups WORKING cards into shippable batches
 *
 * Two views from same data:
 *   SHIP track: cards that can ship to friends (low risk, high value)
 *   ARCH track: cards that need kernel work or cleanup before they can ship
 *
 * Usage:
 *   bun .backbone/wave-planner.ts [track]    # track = ship | arch | all
 *
 * Output:
 *   .backbone/waves/WAVES.json
 *   .backbone/waves/<wave-id>.json
 */

import { readdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";

const FORGE = process.argv[2] && !process.argv[2].startsWith("--") ? process.argv[2] : "C:\\0-BlackBoxProject-0\\VIVIM_0\\work\\forge";
const BACKBONE = "C:\\0-BlackBoxProject-0\\VIVIM_0\\.backbone";
const args = process.argv.slice(2);
const track = (args.find(a => a === "ship" || a === "arch" || a === "all") || "all") as "ship" | "arch" | "all";

async function readJson(p: string): Promise<any> {
  return JSON.parse(await readFile(p, "utf-8"));
}

async function loadCards(): Promise<any[]> {
  const dir = join(BACKBONE, "cards");
  const files = (await readdir(dir)).filter(f => f.endsWith(".json") && f !== "SCHEMA.json");
  const cards = [];
  for (const f of files) cards.push(await readJson(join(dir, f)));
  return cards;
}

function isShippable(card: any): boolean {
  // SHIP criteria: WORKING state, no failures, low/medium risk, has V-1
  if (card.state !== "WORKING") return false;
  if (card.tests.failing > 0) return false;
  if (!card.value_targets?.includes("V-1")) return false;
  if (card.migration?.risk === "HIGH") return false;
  return true;
}

function needsArch(card: any): boolean {
  // ARCH criteria: not WORKING, or has high risk, or has cleanup debt
  if (card.state === "DROPPED") return false;
  if (card.state === "WORKING" && card.cleanup_debt && Object.values(card.cleanup_debt).some((v: any) => Array.isArray(v) && v.length > 0)) return true;
  if (card.state === "SCAFFOLDED" || card.state === "PARTIAL" || card.state === "MAPPED" || card.state === "DISCOVERED") return true;
  if (card.migration?.risk === "HIGH") return true;
  return false;
}

function scoreForShip(card: any): number {
  let score = 0;
  if (card.value_targets?.includes("V-1")) score += 10;
  if (card.value_targets?.includes("V-2")) score += 5;
  if (card.category === "KERNEL") score += 3;  // foundation
  if (card.tests.passing > 50) score += 5;
  if (card.tests.passing > 20) score += 3;
  if (card.migration?.risk === "LOW") score += 5;
  if (card.migration?.effort === "XS" || card.migration?.effort === "S") score += 3;
  return score;
}

async function run() {
  const cards = await loadCards();
  const now = new Date().toISOString();

  // SHIP track: group WORKING cards into waves by category
  const shippable = cards.filter(isShippable).sort((a, b) => scoreForShip(b) - scoreForShip(a));

  // Wave W-2026-09-A: "Friends Alpha" — top 5-8 highest-value, lowest-risk
  const alpha = shippable.slice(0, 8);
  const beta = shippable.slice(8, 16);
  const gamma = shippable.slice(16);

  // ARCH track: cards needing kernel work
  const archWork = cards.filter(needsArch).sort((a, b) => {
    // Prioritize by: V-1 alignment, then by lowest test pass rate
    const aV1 = a.value_targets?.includes("V-1") ? 0 : 1;
    const bV1 = b.value_targets?.includes("V-1") ? 0 : 1;
    if (aV1 !== bV1) return aV1 - bV1;
    return (a.tests.passing / Math.max(1, a.tests.passing + a.tests.failing)) -
           (b.tests.passing / Math.max(1, b.tests.passing + b.tests.failing));
  });

  const waves: any = {
    generated_at: now,
    ship: {
      "W-2026-09-A": {
        id: "W-2026-09-A",
        name: "Friends Alpha",
        description: "First wave to friends. Lowest risk, highest value. The 'does it work at all?' test.",
        cards: alpha.map(c => ({ id: c.id, name: c.name, slug: c.slug, value: c.value_targets, tests: c.tests })),
        estimated_effort: "S",
        gates_required: ["G-INSTALL", "G-LAUNCH"],
        friend_testers: 3,
        shipped: false
      },
      "W-2026-09-B": {
        id: "W-2026-09-B",
        name: "Friends Beta",
        description: "Second wave. More features, more friends. Stress-test the alpha + add capabilities.",
        cards: beta.map(c => ({ id: c.id, name: c.name, slug: c.slug, value: c.value_targets, tests: c.tests })),
        estimated_effort: "M",
        gates_required: ["G-INSTALL", "G-LAUNCH", "G-CHAOS"],
        friend_testers: 5,
        shipped: false
      },
      "W-2026-09-C": {
        id: "W-2026-09-C",
        name: "Friends Gamma",
        description: "Third wave. Full feature set that ships. Foundation for any net-new work.",
        cards: gamma.map(c => ({ id: c.id, name: c.name, slug: c.slug, value: c.value_targets, tests: c.tests })),
        estimated_effort: "L",
        gates_required: ["G-INSTALL", "G-LAUNCH", "G-CHAOS", "G-LOAD"],
        friend_testers: 10,
        shipped: false
      }
    },
    arch: {
      "W-ARCH-001": {
        id: "W-ARCH-001",
        name: "Conversation System Hardening",
        description: "Fix the 3 integration test failures in F-001 to advance to WORKING. Then promote to a future ship wave.",
        cards: archWork.filter(c => c.id === "F-001").map(c => ({ id: c.id, name: c.name, state: c.state, blocker: c.tests.failing + " failing tests" })),
        estimated_effort: "S",
        risk: "MEDIUM"
      },
      "W-ARCH-002": {
        id: "W-ARCH-002",
        name: "Provider + CDP Stabilization",
        description: "Fix the 3 failing tests in F-005. Critical for multi-provider value.",
        cards: archWork.filter(c => c.id === "F-005").map(c => ({ id: c.id, name: c.name, state: c.state, blocker: c.tests.failing + " failing tests" })),
        estimated_effort: "M",
        risk: "MEDIUM"
      },
      "W-ARCH-003": {
        id: "W-ARCH-003",
        name: "Infrastructure Coverage",
        description: "F-034 to F-039 (frontend, desktop installer, dual-DB, seeds, devops, test suite) need explicit test strategies. Currently DISCOVERED with no engines.",
        cards: archWork.filter(c => ["F-034","F-035","F-036","F-037","F-038","F-039"].includes(c.id)).map(c => ({ id: c.id, name: c.name, state: c.state })),
        estimated_effort: "M",
        risk: "LOW"
      }
    }
  };

  await writeFile(join(BACKBONE, "waves", "WAVES.json"), JSON.stringify(waves, null, 2), "utf-8");
  for (const [id, wave] of Object.entries(waves.ship)) {
    await writeFile(join(BACKBONE, "waves", `${id}.json`), JSON.stringify(wave, null, 2), "utf-8");
  }
  for (const [id, wave] of Object.entries(waves.arch)) {
    await writeFile(join(BACKBONE, "waves", `${id}.json`), JSON.stringify(wave, null, 2), "utf-8");
  }

  // Print summary
  console.log(`\n=== WAVE PLAN (track=${track}) ===\n`);
  if (track === "ship" || track === "all") {
    console.log(`SHIP TRACK — Friends Alpha/Beta/Gamma`);
    console.log(`  Total shippable cards: ${shippable.length}\n`);
    for (const [id, wave] of Object.entries(waves.ship)) {
      console.log(`  ${id}: ${(wave as any).name} (${(wave as any).cards.length} cards)`);
      for (const c of (wave as any).cards) {
        console.log(`    - ${c.id} ${c.name} (${c.tests.passing} pass, value: ${c.value.join(",")})`);
      }
    }
  }
  if (track === "arch" || track === "all") {
    console.log(`\nARCH TRACK — Migration Waves`);
    console.log(`  Cards needing arch work: ${archWork.length}\n`);
    for (const [id, wave] of Object.entries(waves.arch)) {
      console.log(`  ${id}: ${(wave as any).name} (${(wave as any).cards.length} cards)`);
      for (const c of (wave as any).cards) {
        const blocker = c.blocker || c.state;
        console.log(`    - ${c.id} ${c.name} [${blocker}]`);
      }
    }
  }
}

run().catch(e => { console.error(e); process.exit(1); });
