// tooling/gates/doctruth.ts — D-437 (Ω-5.5, spec D-439): the librarian's law.
//
// Self-knowledge that cannot lie: every governed doc carries a source
// manifest (path + sha256 + role, hash-pinned); generated-era docs
// re-derive byte-exactly (the generator injected — omega:genome and
// omega:questions wire their own artifacts); every claim's citations
// resolve at print or the claim refuses to print; docscan's S1–S6 run as
// the internal-docs stage (absorbed = imported, never deleted); hand-era
// docs are report-only FOREVER (their facts are acts of authorship).
//
// Pure core: generators and commit lookups are INJECTED; the only I/O is
// the registry loader + file hashing (deterministic).
import { createHash } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { scanDocs } from "./docscan.ts";

export const DOCTRUTH_DRIFT = "DOCTRUTH_DRIFT";
export const LIBRARIAN_CLAIM_UNCITED = "LIBRARIAN_CLAIM_UNCITED";
export const LIBRARIAN_SOURCE_MANIFEST_MISSING = "LIBRARIAN_SOURCE_MANIFEST_MISSING";
export const LIBRARIAN_GENERATOR_DRIFT = "LIBRARIAN_GENERATOR_DRIFT";
export const LIBRARIAN_CITATION_UNRESOLVABLE = "LIBRARIAN_CITATION_UNRESOLVABLE";

/** One source a governed doc derives from. */
export interface SourceRef {
  path: string;
  role: string;        // what this source contributes (prose-role, not just a path)
  sha256: string;      // the pinned hash at last regeneration
}

/** One librarian registry row (docs/librarian.json). */
export interface LibrarianRow {
  docPath: string;
  era: "generated" | "hand";
  sources: SourceRef[];
  generator: string;   // the tool that may write this doc (the D-436 grant)
}

/** A summary claim: prose + the citations that make it printable. */
export interface ClaimRow {
  text: string;
  cites: Array<{ kind: "record" | "commit" | "file"; ref: string }>;
}

export interface LibrarianIssue {
  code: string;
  docPath: string;
  detail: string;
  blastRadius: number; // dependents counting: sources + citations touching this doc
}

export interface LibrarianVerdict {
  ok: boolean;
  issues: LibrarianIssue[];
  checked: { docs: number; sources: number; regenerated: number; internalFindings: number };
  rendered: string;
}

/** sha256 of a file's bytes (the manifest pin). */
export function hashFile(absPath: string): string | null {
  try {
    return createHash("sha256").update(readFileSync(absPath)).digest("hex");
  } catch {
    return null;
  }
}

/** Load the registry (tolerant: absent file = no governed docs yet). */
export function loadLibrarian(root: string): { rows: LibrarianRow[]; malformed: number } {
  const p = join(root, "docs", "librarian.json");
  if (!existsSync(p)) return { rows: [], malformed: 0 };
  try {
    const parsed = JSON.parse(readFileSync(p, "utf-8")) as { rows?: unknown };
    if (!Array.isArray(parsed.rows)) return { rows: [], malformed: 1 };
    const rows: LibrarianRow[] = [];
    let malformed = 0;
    for (const r of parsed.rows) {
      if (r === null || typeof r !== "object" || Array.isArray(r)) { malformed++; continue; }
      const x = r as Record<string, unknown>;
      if (typeof x["docPath"] !== "string" || (x["era"] !== "generated" && x["era"] !== "hand") || !Array.isArray(x["sources"]) || typeof x["generator"] !== "string") { malformed++; continue; }
      rows.push({
        docPath: x["docPath"],
        era: x["era"],
        generator: x["generator"],
        sources: (x["sources"] as Array<Record<string, unknown>>).filter((s): s is SourceRef =>
          typeof s["path"] === "string" && typeof s["role"] === "string" && typeof s["sha256"] === "string"),
      });
    }
    return { rows, malformed };
  } catch {
    return { rows: [], malformed: 1 };
  }
}

/** The injected re-derivation: (row) => the bytes the generator produces now. */
export type Generator = (row: LibrarianRow) => string;

/** The injected commit lookup: does this commit ref resolve in the object store? */
export type CommitExists = (ref: string) => boolean;

/**
 * THE librarian verify (D-437). Pure over (registry, file reader, injected
 * generator, docscan's own scan): source drift, generator drift, missing
 * manifests, and the absorbed internal-docs stage — one verdict.
 */
export function verifyLibrarian(
  root: string,
  rows: readonly LibrarianRow[],
  readFile: (abs: string) => string | null,
  generator: Generator,
  governedAbs: (docPath: string) => string,
): LibrarianVerdict {
  const issues: LibrarianIssue[] = [];
  let sources = 0;
  let regenerated = 0;
  for (const row of [...rows].sort((a, b) => (a.docPath < b.docPath ? -1 : 1))) {
    // the manifest: every source hashed and compared
    for (const src of row.sources) {
      sources++;
      const now = hashFile(join(root, src.path));
      if (now === null) {
        issues.push({ code: DOCTRUTH_DRIFT, docPath: row.docPath, blastRadius: row.sources.length, detail: `source ${src.path} (${src.role}) is ABSENT — a manifest source that disappeared is drift squared` });
        continue;
      }
      if (now !== src.sha256) {
        issues.push({ code: DOCTRUTH_DRIFT, docPath: row.docPath, blastRadius: row.sources.length, detail: `source ${src.path} (${src.role}) changed since the last regeneration (${src.sha256.slice(0, 8)}… → ${now.slice(0, 8)}…) — regenerate or the doc lies about its inputs` });
      }
    }
    // the generator: generated-era docs re-derive byte-exactly
    const current = readFile(governedAbs(row.docPath));
    if (current === null) {
      issues.push({ code: LIBRARIAN_SOURCE_MANIFEST_MISSING, docPath: row.docPath, blastRadius: row.sources.length, detail: `governed doc ${row.docPath} is absent — a registry row whose doc vanished` });
      continue;
    }
    if (row.era === "generated") {
      regenerated++;
      const derived = generator(row);
      if (derived !== current) {
        issues.push({ code: LIBRARIAN_GENERATOR_DRIFT, docPath: row.docPath, blastRadius: row.sources.length, detail: `re-derivation diverges from the committed bytes (${derived.length} vs ${current.length} chars) — the doc was hand-edited or the generator drifted; only ${row.generator} may write it` });
      }
    }
    // hand-era: report-only forever — no re-derivation, no byte-diff (as-built: the flip law)
  }
  // the absorbed internal-docs stage: docscan's S1–S6, verdicts identical
  const internal = scanDocs(root);
  for (const f of internal.findings) {
    issues.push({ code: `DOCSCAN-${f.rule}`, docPath: f.file, blastRadius: 0, detail: `${f.file}:${f.line} ${f.msg}` });
  }
  const rendered = renderDrift(issues);
  return {
    ok: issues.length === 0,
    issues,
    checked: { docs: rows.length, sources, regenerated, internalFindings: internal.findings.length },
    rendered,
  };
}

/**
 * THE citation law (D-437): a claim prints only when every citation
 * resolves. A record id with no record file, a commit the store does not
 * hold, a file:line past the file's length — LIBRARIAN_CLAIM_UNCITED, the
 * claim is dropped from the render and the refusal is named.
 */
export function claimCited(
  claim: ClaimRow,
  recordExists: (id: string) => boolean,
  commitExists: CommitExists,
  lineCountOf: (path: string) => number | null,
): { ok: true } | { ok: false; code: typeof LIBRARIAN_CLAIM_UNCITED; sentence: string } {
  for (const c of claim.cites) {
    if (c.kind === "record" && !recordExists(c.ref)) {
      return { ok: false, code: LIBRARIAN_CLAIM_UNCITED, sentence: `${LIBRARIAN_CLAIM_UNCITED}: the claim "${claim.text.slice(0, 60)}…" cites record ${c.ref}, which does not exist — an uncited claim refuses to print (fabrication is not a rendering option)` };
    }
    if (c.kind === "commit" && !commitExists(c.ref)) {
      return { ok: false, code: LIBRARIAN_CLAIM_UNCITED, sentence: `${LIBRARIAN_CLAIM_UNCITED}: the claim "${claim.text.slice(0, 60)}…" cites commit ${c.ref}, which the object store does not hold — a citation to nothing; an uncited claim refuses to print` };
    }
    if (c.kind === "file") {
      const m = /^(.*?):(\d+)$/.exec(c.ref);
      const path = m !== null ? m[1]! : c.ref;
      const line = m !== null ? Number(m[2]) : 1;
      const lines = lineCountOf(path);
      if (lines === null || line < 1 || line > lines) {
        return { ok: false, code: LIBRARIAN_CLAIM_UNCITED, sentence: `${LIBRARIAN_CLAIM_UNCITED}: the claim "${claim.text.slice(0, 60)}…" cites ${c.ref}, which does not resolve (file absent or line past the end) — pointers point or they do not print` };
      }
    }
  }
  return { ok: true };
}

/**
 * The summary render: claims that cite print, claims that do not are DROPPED
 * with the refusal named — the summary is shorter and honest, never fabricated.
 */
export function summarizeRows(
  claims: readonly ClaimRow[],
  recordExists: (id: string) => boolean,
  commitExists: CommitExists,
  lineCountOf: (path: string) => number | null,
): { text: string; refused: string[] } {
  const lines: string[] = [];
  const refused: string[] = [];
  for (const c of claims) {
    const v = claimCited(c, recordExists, commitExists, lineCountOf);
    if (v.ok) lines.push(`- ${c.text}`);
    else refused.push(v.sentence);
  }
  return { text: lines.join("\n"), refused };
}

/** The drift report, sorted by blast radius (the docs with the most dependents first). */
export function renderDrift(issues: readonly LibrarianIssue[]): string {
  if (issues.length === 0) return "librarian: GREEN — every governed doc's sources pin, generators re-derive byte-exact, and every claim cites";
  const sorted = [...issues].sort((a, b) => b.blastRadius - a.blastRadius || (a.docPath < b.docPath ? -1 : 1));
  const lines = [`librarian: RED — ${sorted.length} issue(s), blast-radius sorted`];
  for (const i of sorted) lines.push(`  [${i.code}] ${i.docPath} (blast ${i.blastRadius}): ${i.detail}`);
  return lines.join("\n");
}

/** The drift read op's fold: the verdict's issues, radius-sorted, as rows. */
export function driftReport(v: LibrarianVerdict): LibrarianIssue[] {
  return [...v.issues].sort((a, b) => b.blastRadius - a.blastRadius || (a.docPath < b.docPath ? -1 : 1));
}
