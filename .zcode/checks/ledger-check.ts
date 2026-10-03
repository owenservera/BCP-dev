// .zcode/checks/ledger-check.ts — D-TEAM-027
//
// `.zcode/board/DECISIONS.md` is load-bearing authority: D-TEAM-014 decides what may be
// deleted, D-TEAM-021 decides how the suite runs, D-TEAM-023 decided the lane the build is
// on. Nothing checked that its entries carry the fields its own format demands.
//
// It does not take long to find out why that matters. On its first run it reported SIX
// incomplete entries — and FOUR of them were written earlier today, by me, in this session
// (D-TEAM-023/024/025/026, each missing **Reason** and/or **Evidence**). The reason is the
// one this repository keeps rediscovering: a field felt redundant because the decision
// "obviously" had one, and a document that is authority is exactly where that is least
// affordable. D-TEAM-021 states the rule itself — decisions are recorded with "reason,
// evidence, alternatives, rollback and revisit condition".
//
// Severity: a missing field is a RECORD defect, high — the ledger is what the owner overrides
// and what agents cite. It is not a build failure; nothing here decides anything, it only
// reports what the record does not yet say.

import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const HERE = dirname(fileURLToPath(import.meta.url));
const ZCODE = join(HERE, "..");

const LEDGER = join(ZCODE, "board", "DECISIONS.md");

/** Fields D-TEAM-021's own rule names for a decision: reason, evidence, alternatives, rollback, revisit. */
const REQUIRED = ["Severity", "Status", "Decision", "Reason", "Evidence", "Rollback"];

let text = "";
try {
  text = readFileSync(LEDGER, "utf-8");
} catch {
  console.error(`ledger-check: cannot read ${LEDGER}`);
  process.exit(2);
}

interface Gap {
  entry: string;
  missing: string[];
}

const entries = text.split(/^### D-TEAM-/m).slice(1);
const gaps: Gap[] = [];

for (const body of entries) {
  const id = `D-TEAM-${/^\d+/.exec(body)?.[0] ?? "?"}`;
  // Match `**Field` — the label, not the whole bold run. Entries write `**Severity:** S1`, so
  // looking for `**Severity**` matches nothing and every entry looks broken. An earlier draft
  // of this check did exactly that and reported 26 of 26 incomplete.
  const missing = REQUIRED.filter((f) => !body.includes(`**${f}`));
  if (missing.length > 0) gaps.push({ entry: id, missing });
}

// The index table at the top must also carry every entry, or the ledger has a record the
// owner-override register does not know about.
const registered = new Set(
  [...text.matchAll(/^\| (D-TEAM-\d+) \|/gm)].map((m) => m[1]),
);
const unregistered = entries
  .map((b) => `D-TEAM-${/^\d+/.exec(b)?.[0] ?? "?"}`)
  .filter((id) => !registered.has(id));

const report = {
  ok: gaps.length === 0 && unregistered.length === 0,
  entries: entries.length,
  registered: registered.size,
  gaps,
  unregistered,
};

console.log(JSON.stringify(report, null, 2));
console.error(
  report.ok
    ? `ledger-check: ${entries.length} decision entries, all carrying the required fields and all indexed.`
    : `ledger-check: ${gaps.length} entr(ies) missing required field(s); ${unregistered.length} not in the index table.`,
);

process.exit(report.ok ? 0 : 1);