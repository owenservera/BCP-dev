#!/usr/bin/env bun
/**
 * Card Gate — runs tests per card, validates atomic state transitions
 *
 * This is the BACKBONE GATE. It runs the test suite for each card's engines
 * and determines if the card can advance to WORKING.
 *
 * Usage:
 *   bun .backbone/gate.ts [forge-path] [--card F-005] [--quick]
 *
 * Output:
 *   .backbone/runs/gate-<timestamp>.json
 *   Updated cards with passing/failing counts
 */

import { readdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { spawn } from "bun";

const args = process.argv.slice(2);
const cardIdx = args.indexOf("--card");
const onlyCard = cardIdx >= 0 ? args[cardIdx + 1] : null;
const quick = args.includes("--quick");
// First non-flag arg is the forge path
const pathArgs = args.filter(a => !a.startsWith("--") && a !== onlyCard);
const FORGE = pathArgs[0] || "C:\\0-BlackBoxProject-0\\VIVIM_0\\work\\forge";
const BACKBONE = "C:\\0-BlackBoxProject-0\\VIVIM_0\\.backbone";

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

async function loadTestMap(): Promise<any> {
  try { return await readJson(join(BACKBONE, "test-map.json")); }
  catch { return null; }
}

async function findTestFilesForCard(card: any, testMap: any): Promise<string[]> {
  // For each engine in the card, find test files that import it
  const tests: string[] = [];
  for (const eng of (card.engines || [])) {
    // Strip .ts extension robustly
    const baseName = eng.endsWith(".ts") ? eng.slice(0, -3) : eng;
    // Try common test naming patterns
    const candidates = [
      `tests/unit/engines/${baseName}.test.ts`,
      `tests/integration/engines/${baseName}.test.ts`,
      `tests/unit/${baseName}.test.ts`,
      `tests/integration/${baseName}.test.ts`,
    ];
    for (const c of candidates) {
      const full = join(FORGE, c);
      try {
        await readFile(full);
        tests.push(c);
      } catch {}
    }
  }
  return [...new Set(tests)];
}

async function runBunTest(testFile: string): Promise<{ pass: number; fail: number; error: string | null }> {
  try {
    const proc = spawn({
      cmd: ["bun", "test", testFile, "--no-color"],
      cwd: FORGE,
      stdout: "pipe",
      stderr: "pipe",
      env: { ...process.env, NO_COLOR: "1" }
    });
    const [stdout, stderr] = await Promise.all([
      new Response(proc.stdout).text(),
      new Response(proc.stderr).text()
    ]);
    const exitCode = await proc.exited;
    const out = stdout + stderr;
    // Parse bun test output: lines like " 10 pass" or " 0 fail"
    const lines = out.split('\n');
    let pass = 0, fail = 0;
    for (const line of lines) {
      const pMatch = line.match(/^\s*(\d+)\s+pass\s*$/);
      const fMatch = line.match(/^\s*(\d+)\s+fail\s*$/);
      if (pMatch) pass += parseInt(pMatch[1]);
      if (fMatch) fail += parseInt(fMatch[1]);
    }
    return { pass, fail, error: exitCode !== 0 && fail === 0 ? out.slice(-500) : null };
  } catch (e: any) {
    return { pass: 0, fail: 0, error: e.message };
  }
}

async function run() {
  const cards = await loadCards();
  const testMap = await loadTestMap();
  const targets = onlyCard ? cards.filter(c => c.id === onlyCard) : cards;

  const results: any[] = [];
  const totalStart = Date.now();

  for (const card of targets) {
    if (!card.engines || card.engines.length === 0) {
      results.push({ card: card.id, name: card.name, state: card.state, tests: card.tests, skipped: "no-engines" });
      continue;
    }
    const testFiles = await findTestFilesForCard(card, testMap);
    if (testFiles.length === 0) {
      results.push({ card: card.id, name: card.name, state: card.state, tests: card.tests, skipped: "no-tests" });
      continue;
    }

    console.log(`\n[${card.id}] ${card.name} — ${testFiles.length} test files`);
    let pass = 0, fail = 0, errors: string[] = [];
    for (const tf of testFiles) {
      process.stdout.write(`  ${tf}: `);
      const r = await runBunTest(tf);
      console.log(`${r.pass} pass / ${r.fail} fail`);
      pass += r.pass;
      fail += r.fail;
      if (r.error) errors.push(`${tf}: ${r.error}`);
    }

    // Determine if card can advance
    const total = pass + fail;
    const ratio = total > 0 ? pass / total : 0;
    let nextState = card.state;
    let canAdvance = false;
    let blocker: string | null = null;
    const alreadyWorking = card.state === "WORKING" || card.state === "SHIPPED" || card.state === "MAINTAINED";
    if (card.state === "SCAFFOLDED" && total > 0 && fail === 0) {
      nextState = "WORKING";
      canAdvance = true;
    } else if (card.state === "SCAFFOLDED" && ratio >= 0.5) {
      nextState = "PARTIAL";
    } else if (card.state === "SCAFFOLDED" && total > 0 && ratio < 0.5) {
      blocker = `${fail}/${total} tests failing (<50% pass rate)`;
    }
    if (alreadyWorking && fail === 0 && total > 0) {
      canAdvance = true;  // Already working, just verifying
    }

    results.push({
      card: card.id,
      name: card.name,
      state: card.state,
      next_state: nextState,
      can_advance: canAdvance,
      blocker,
      tests: { ...card.tests, passing: pass, failing: fail, total },
      test_files: testFiles
    });

    // Update card
    card.tests = { ...card.tests, passing: pass, failing: fail };
    if (canAdvance) card.state = nextState;
    card.last_verified = new Date().toISOString();
    await writeFile(join(BACKBONE, "cards", `${card.id}-${card.slug}.json`), JSON.stringify(card, null, 2), "utf-8");
  }

  // Write gate record
  const gateId = new Date().toISOString().replace(/[:.]/g, "-");
  const totalDur = Date.now() - totalStart;
  const record = {
    gate_id: gateId,
    timestamp: new Date().toISOString(),
    duration_ms: totalDur,
    cards_evaluated: results.length,
    cards_advanced: results.filter(r => r.can_advance).length,
    cards_blocked: results.filter(r => r.blocker).length,
    totals: {
      pass: results.reduce((s, r) => s + (r.tests?.passing || 0), 0),
      fail: results.reduce((s, r) => s + (r.tests?.failing || 0), 0)
    },
    results
  };
  await writeFile(join(BACKBONE, "runs", `gate-${gateId}.json`), JSON.stringify(record, null, 2), "utf-8");

  // Summary
  console.log(`\n=== GATE ${gateId} ===`);
  console.log(`Duration: ${(totalDur / 1000).toFixed(1)}s`);
  console.log(`Cards evaluated: ${results.length}`);
  console.log(`Advanced: ${record.cards_advanced} | Blocked: ${record.cards_blocked}`);
  console.log(`Tests: ${record.totals.pass} pass, ${record.totals.fail} fail`);

  if (record.cards_advanced > 0) {
    console.log(`\nAdvanced to WORKING:`);
    results.filter(r => r.can_advance).forEach(r => console.log(`  ${r.card} (${r.tests.passing}/${r.tests.total} pass)`));
  }
  if (record.cards_blocked > 0) {
    console.log(`\nBlocked:`);
    results.filter(r => r.blocker).forEach(r => console.log(`  ${r.card}: ${r.blocker}`));
  }
}

run().catch(e => { console.error(e); process.exit(1); });
