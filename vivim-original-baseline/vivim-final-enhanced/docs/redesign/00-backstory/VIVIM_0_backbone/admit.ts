#!/usr/bin/env bun
/**
 * Admission Handler — manages net-new feature requests
 *
 * Usage:
 *   bun .backbone/admit.ts propose <slug> "<name>" [rubric-overrides-json]
 *   bun .backbone/admit.ts list
 *   bun .backbone/admit.ts decide <id> admit|research|drop [reason]
 *   bun .backbone/admit.ts <id>           # show details
 *
 * Examples:
 *   bun .backbone/admit.ts propose voice-input "Voice Input" '{"V":5,"KI":3,"T":3,"S":3,"C":2,"R":2,"FI":1}'
 *   bun .backbone/admit.ts decide AR-001 admit "Core for friends alpha"
 *   bun .backbone/admit.ts list
 */

import { readdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";

const BACKBONE = "C:\\0-BlackBoxProject-0\\VIVIM_0\\.backbone";

interface RubricScore {
  V: number;    // Value (V-1..V-5) max 5
  KI: number;   // Kernel Independence max 3
  T: number;    // Testability max 3
  S: number;    // Specificity max 3
  C: number;    // Migration Cost (inverse) max 3
  R: number;    // Reversibility max 3
  FI: number;   // Friend Interest max 2
  IIW?: number; // Independence from In-flight Work max 1
}

const RUBRIC_MAX = { V: 5, KI: 3, T: 3, S: 3, C: 3, R: 3, FI: 2, IIW: 1 };

function scoreRubric(r: RubricScore): { total: number; breakdown: any; verdict: string } {
  const breakdown: any = {};
  let total = 0;
  for (const [k, max] of Object.entries(RUBRIC_MAX)) {
    const got = Math.min((r as any)[k] || 0, max);
    breakdown[k] = { got, max };
    total += got;
  }
  let verdict: string;
  if (total >= 12) verdict = "ADMIT";
  else if (total >= 8) verdict = "RESEARCH";
  else verdict = "DROP";
  return { total, breakdown, verdict };
}

async function readJson(p: string): Promise<any> {
  return JSON.parse(await readFile(p, "utf-8"));
}

async function listAdmissions(): Promise<any[]> {
  const dir = join(BACKBONE, "admissions");
  try {
    const files = await readdir(dir);
    const out: any[] = [];
    for (const f of files) {
      if (f.endsWith(".json")) {
        out.push(await readJson(join(dir, f)));
      }
    }
    return out.sort((a, b) => a.id.localeCompare(b.id));
  } catch {
    return [];
  }
}

async function getNextId(): Promise<string> {
  const existing = await listAdmissions();
  const maxNum = existing.reduce((max, a) => {
    const m = a.id.match(/AR-(\d+)/);
    return m ? Math.max(max, parseInt(m[1])) : max;
  }, 0);
  return `AR-${String(maxNum + 1).padStart(3, "0")}`;
}

async function propose(slug: string, name: string, rubricJson?: string): Promise<void> {
  let rubric: RubricScore;
  if (rubricJson) {
    try {
      rubric = JSON.parse(rubricJson);
    } catch (e: any) {
      console.error(`Invalid JSON: ${e.message}`);
      process.exit(1);
    }
  } else {
    // Default: ask for each value
    console.log("Default rubric (all 0). Pass JSON to score. Example: {\"V\":5,\"KI\":3,\"T\":3,\"S\":3,\"C\":2,\"R\":2,\"FI\":1}");
    rubric = { V: 0, KI: 0, T: 0, S: 0, C: 0, R: 0, FI: 0 };
  }
  const id = await getNextId();
  const scored = scoreRubric(rubric);
  const request = {
    id,
    slug,
    name,
    proposed_at: new Date().toISOString(),
    proposed_by: "user",  // or "pro" if from me
    rubric: rubric,
    rubric_score: scored.total,
    rubric_breakdown: scored.breakdown,
    auto_verdict: scored.verdict,
    final_verdict: scored.verdict,  // can be changed by decide
    status: "PENDING",  // PENDING | ADMITTED | RESEARCH | DROPPED
    reason: ""
  };
  await writeFile(join(BACKBONE, "admissions", `${id}.json`), JSON.stringify(request, null, 2), "utf-8");
  console.log(`\n=== ADMISSION REQUEST ${id} ===`);
  console.log(`Slug: ${slug}`);
  console.log(`Name: ${name}`);
  console.log(`Score: ${scored.total}/22 (threshold 12 to admit)`);
  console.log(`Auto-verdict: ${scored.verdict}`);
  console.log(`\nBreakdown:`);
  for (const [k, v] of Object.entries(scored.breakdown)) {
    console.log(`  ${k}: ${(v as any).got}/${(v as any).max}`);
  }
  console.log(`\nFile: ${BACKBONE}\\admissions\\${id}.json`);
  if (scored.verdict === "ADMIT") {
    console.log(`\nTo promote to a FEATURE_CARD, run: bun .backbone/admit.ts decide ${id} admit "<reason>"`);
  }
}

async function decide(id: string, verdict: string, reason: string): Promise<void> {
  const path = join(BACKBONE, "admissions", `${id}.json`);
  const request = await readJson(path);
  const v = verdict.toUpperCase();
  if (!["ADMIT", "RESEARCH", "DROP"].includes(v)) {
    console.error(`Verdict must be ADMIT, RESEARCH, or DROP`);
    process.exit(1);
  }
  request.final_verdict = v;
  request.status = v === "ADMIT" ? "ADMITTED" : v;
  request.reason = reason;
  request.decided_at = new Date().toISOString();
  await writeFile(path, JSON.stringify(request, null, 2), "utf-8");
  console.log(`${id} → ${v}: ${reason}`);
  if (v === "ADMIT") {
    // Create a MAPPED FEATURE_CARD
    const cardId = await getNextCardId();
    const card = {
      id: cardId,
      slug: request.slug,
      name: request.name,
      category: "PLUGIN",  // default; can be edited
      state: "MAPPED",
      value_targets: [`V-${Math.min(5, request.rubric.V)}`],
      engines: [],
      frontend_paths: [],
      description: `Admitted from ${request.id} on ${request.decided_at}. ${request.reason}`,
      sota_status: "UNKNOWN",
      tests: { unit: 0, integration: 0, e2e: 0, arch: 0, passing: 0, failing: 0 },
      migration: {
        from: "nothing",
        to: "WORKING",
        steps: [],
        effort: "M",
        risk: "MEDIUM",
        reversible: true
      },
      cleanup_debt: { files_to_remove: [], files_to_rename: [], files_to_split: [], dead_code: [], stale_tests: [], stale_docs: [] },
      created: request.decided_at,
      last_verified: request.decided_at,
      evidence_class: "DECISION",
      admitted_from: request.id
    };
    await writeFile(join(BACKBONE, "cards", `${cardId}-${request.slug}.json`), JSON.stringify(card, null, 2), "utf-8");
    console.log(`Created FEATURE_CARD ${cardId}-${request.slug} (state: MAPPED)`);
  }
}

async function getNextCardId(): Promise<string> {
  const dir = join(BACKBONE, "cards");
  const files = (await readdir(dir)).filter(f => f.endsWith(".json") && f !== "SCHEMA.json");
  const maxNum = files.reduce((max, f) => {
    const m = f.match(/^F-(\d+)/);
    return m ? Math.max(max, parseInt(m[1])) : max;
  }, 0);
  return `F-${String(maxNum + 1).padStart(3, "0")}`;
}

async function show(id: string): Promise<void> {
  const path = join(BACKBONE, "admissions", `${id}.json`);
  try {
    const r = await readJson(path);
    console.log(JSON.stringify(r, null, 2));
  } catch {
    console.error(`${id} not found`);
  }
}

async function listAll(): Promise<void> {
  const all = await listAdmissions();
  if (all.length === 0) {
    console.log("No admission requests yet.");
    return;
  }
  console.log(`\n=== ADMISSIONS (${all.length}) ===\n`);
  for (const r of all) {
    console.log(`${r.id} [${r.status}] ${r.slug} — "${r.name}"`);
    console.log(`  Score: ${r.rubric_score}/22 → ${r.final_verdict}`);
    if (r.reason) console.log(`  Reason: ${r.reason}`);
  }
}

const args = process.argv.slice(2);
const cmd = args[0];

if (cmd === "propose" && args[1] && args[2]) {
  await propose(args[1], args[2], args[3]);
} else if (cmd === "decide" && args[1] && args[2]) {
  await decide(args[1], args[2], args.slice(3).join(" ") || "(no reason given)");
} else if (cmd === "list") {
  await listAll();
} else if (cmd && cmd.match(/^AR-\d+$/)) {
  await show(cmd);
} else {
  console.log(`Usage:
  bun .backbone/admit.ts propose <slug> "<name>" [rubric-json]
  bun .backbone/admit.ts list
  bun .backbone/admit.ts decide <id> <admit|research|drop> [reason]
  bun .backbone/admit.ts <id>          # show details

Rubric JSON keys: V(0-5) KI(0-3) T(0-3) S(0-3) C(0-3) R(0-3) FI(0-2) IIW(0-1)
Max: 22, threshold: 12 to admit`);
}
