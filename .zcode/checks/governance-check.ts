// .zcode/checks/governance-check.ts — D-TEAM-025
//
// Standing instruments (`.zcode/workflows/*.dwf.ts`) spend the owner's tokens and write to
// the repo. Until this check existed, nothing verified that each one still existed on purpose:
// the set grew to ten while TEAM.md still claimed seven, and the charter governed *adding*
// an instrument but was silent on *changing* one.
//
// Three checks, each of which has already caught a real drift — not hypotheticals:
//
//   1. ORPHAN WORKFLOW  — a file in .zcode/workflows/ with no row in WORKFLOW-REGISTRY.md.
//   2. UNSOURCED ROW    — a registry row with no lineage (no gap row / decision / charter).
//   3. STALE COUNT      — the workflow count stated in TEAM.md disagrees with the disk.
//
// Plus a non-fatal CORRIDOR report: an open writer corridor means any gate run right now is
// CONTAMINATED, not a measurement (D-TEAM-017). That is reported, never failed — the check
// cannot know whether a gate is being taken.
//
// Deliberately not here: judging whether a workflow is any good. This file answers "does this
// exist on purpose", nothing wider. Run it from the repo root or anywhere; paths are resolved
// relative to this file.

import { Glob } from "bun";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const HERE = dirname(fileURLToPath(import.meta.url));
const ZCODE = join(HERE, "..");
const REPO = join(ZCODE, "..");

interface Issue {
  check: string;
  what: string;
  where: string;
  severity: "high" | "low";
}

const issues: Issue[] = [];

const read = (p: string): string => {
  try { return readFileSync(p, "utf-8"); } catch { return ""; }
};

// ---- 1 · orphan workflows ----------------------------------------------------
const workflows = [...new Glob("*.dwf.ts").scanSync({ cwd: join(ZCODE, "workflows"), onlyFiles: true })]
  .map((f) => f.replace(/\.dwf\.ts$/, ""))
  .sort();

const registry = read(join(ZCODE, "WORKFLOW-REGISTRY.md"));
for (const w of workflows) {
  if (!registry.includes(`\`${w}\``)) {
    issues.push({
      check: "ORPHAN_WORKFLOW",
      what: `${w} exists on disk with no row in WORKFLOW-REGISTRY.md — a standing instrument nobody stands behind`,
      where: `.zcode/workflows/${w}.dwf.ts`,
      severity: "high",
    });
  }
}

// ---- 2 · registry rows without lineage ---------------------------------------
// A row is a table line naming a workflow; it must cite something that justifies it.
for (const line of registry.split("\n")) {
  if (!line.startsWith("| `")) continue;
  const name = /^\| `([^`]+)`/.exec(line)?.[1];
  if (!name) continue;
  const cells = line.split("|").map((c) => c.trim());
  const lineage = cells[3] ?? "";
  if (!lineage || lineage === "" || lineage === "—") {
    issues.push({
      check: "UNSOURCED_ROW",
      what: `${name} has a registry row with no lineage — nothing records why this instrument exists`,
      where: ".zcode/WORKFLOW-REGISTRY.md",
      severity: "high",
    });
  }
  // A row for a workflow that is no longer on disk is the mirror-image drift.
  if (!workflows.includes(name)) {
    issues.push({
      check: "ROW_WITHOUT_FILE",
      what: `${name} has a registry row but no file on disk — either restore the instrument or remove the row`,
      where: ".zcode/WORKFLOW-REGISTRY.md",
      severity: "high",
    });
  }
}

// ---- 3 · the stated count ----------------------------------------------------
const team = read(join(ZCODE, "TEAM.md"));
const stated = [...team.matchAll(/\b(\d+)\s+saved workflows\b/g)].map((m) => Number(m[1]));
for (const n of stated) {
  if (n !== workflows.length) {
    issues.push({
      check: "STALE_COUNT",
      what: `TEAM.md says "${n} saved workflows"; there are ${workflows.length} on disk — the charter's map of its own substrate is wrong`,
      where: ".zcode/TEAM.md",
      severity: "low",
    });
  }
}

// ---- report (never fails) — open corridors -----------------------------------
const tracking = read(join(ZCODE, "TRACKING.md"));
const openCorridors = tracking
  .split("\n")
  .filter((l) => l.startsWith("| `") && /\bOPEN\b|\bIN FLIGHT\b/.test(l))
  .map((l) => /^\| `([^`]+)`/.exec(l)?.[1])
  .filter(Boolean) as string[];

const high = issues.filter((i) => i.severity === "high");
console.log(
  JSON.stringify(
    {
      ok: high.length === 0,
      workflows: workflows.length,
      registryRows: registry.split("\n").filter((l) => l.startsWith("| `")).length,
      issues,
      // CONTAMINATED, not a measurement: D-TEAM-017.
      openCorridors,
      note:
        openCorridors.length > 0
          ? "a writer corridor is OPEN — any gate result taken now is CONTAMINATED, not a measurement"
          : undefined,
    },
    null,
    2,
  ),
);

process.exit(high.length === 0 ? 0 : 1);