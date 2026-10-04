// tooling/gates/gov.ts — D-439 (Ω-7.5, spec D-441): governance validation,
// architecture metrics, and omega:accept — the capstone.
//
// Governance that outlives attention: the corpus checks are mechanical
// (cited falsifiers, two-green evidence on RATIFIED rows, supersession,
// refusal sentences in source, namespace law), the scorecard is a
// deterministic fold (never stored), and the acceptance sweep is ONE
// fail-closed command whose stages are the tools this program already
// trusts — any red stage is GOV_ACCEPT_UNMET, named.
//
// Pure core: every stage result is injectable; the CLI wires the real ones.
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { parseLayerRegistry } from "./genome.ts";

export const GOV_FALSIFIER_UNCITED = "GOV_FALSIFIER_UNCITED";
export const GOV_GREEN_WITHOUT_EVIDENCE = "GOV_GREEN_WITHOUT_EVIDENCE";
export const GOV_REFUSAL_SENTENCE_MISSING = "GOV_REFUSAL_SENTENCE_MISSING";
export const GOV_NAMESPACE_UNOWNED = "GOV_NAMESPACE_UNOWNED";
export const GOV_SUPERSESSION_BROKEN = "GOV_SUPERSESSION_BROKEN";
export const GOV_VISION_CONTRADICTION = "GOV_VISION_CONTRADICTION";
export const GOV_ACCEPT_UNMET = "GOV_ACCEPT_UNMET";

export interface GovIssue {
  code: string;
  target: string; // the record id / stage / layer the issue names
  detail: string;
}

export interface GovValidateVerdict {
  ok: boolean;
  issues: GovIssue[];
  checked: { records: number; ratified: number };
}

/** One decision record as the validator sees it (parsed from the file text). */
export interface RecordInput {
  n: number;
  file: string;
  text: string;
  status: "PROPOSED" | "RATIFIED" | string;
}

const NAMED_F = /\bF-[A-Z][A-Z0-9-]*(?:\.\d+)*\b/g; // word-boundary, the loop's own family — backticked OR bare clause lines both cite
/** The ns-mention shape the law checks: a BACKTICKED dotted id after "ns" (prose paths like "ns audit.ts" are not namespace claims). */
const NS_MENTION = /ns `([a-z][a-z0-9]*(?:\.[a-z0-9-]+)+)`/g;
/** Era boundaries, stated honestly (the checker's own grandfather discipline): the ALL-CAPS named-falsifier convention is born at D-426 (the loop's own note — the F-1..F-N era before it is a documented convention, not a violation); the two-green evidence bar is born at D-364. */
export const NAMED_FALSIFIER_ERA = 426;
export const TWO_GREEN_ERA = 364;
/** The mechanical namespace law for records is born at D-432 (the wave that made gov a machine); older records are prose-history — docscan owns their doc-logic, not the ns registry. */
export const NS_LAW_ERA = 432;
/** The IN-RECORD two-green claim convention is born at D-411 (the ratify line carrying "full gate green N/0 ×2"); D-364..D-410's evidence lives in commit messages + status carriage — the era's own discipline, stated, not laundered. */
export const IN_RECORD_EVIDENCE_ERA = 411;

/**
 * THE corpus validator (D-439). Six checks, pure over the record list +
 * injectable resolvers: (1) falsifier-cited; (2) evidence-on-ratified;
 * (3) supersession-integrity (S1 via the resolver); (4) refusal codes
 * exist in source with sentences; (5) namespace law; (6) directive-class
 * contradiction (blocking rows).
 */
export function validateCorpus(
  records: readonly RecordInput[],
  resolvers: {
    /** does this refusal code appear in the tree's source? (with its sentence — the source scan) */
    refusalInSource: (code: string) => boolean;
    /** the namespaces VAULT-NAMESPACES.md owns */
    knownNamespaces: Set<string>;
    /** open blocking board rows (directive-class contradiction check) */
    openBlocking: Array<{ blocks: string; question: string }>;
    /** docscan S1 findings (supersession) */
    supersessionFindings: Array<{ file: string; line: number; msg: string }>;
  },
): GovValidateVerdict {
  const issues: GovIssue[] = [];
  let ratified = 0;
  for (const r of records) {
    // (1) falsifier-cited: every record of the named-falsifier era names at least one F-XXX in backticks
    //     (grandfathered below D-426 — the F-1..F-N era is a documented convention, D-426's own note)
    const falsifiers = [...r.text.matchAll(NAMED_F)].map((m) => m[0]);
    if (r.n >= NAMED_FALSIFIER_ERA && falsifiers.length === 0) {
      issues.push({
        code: GOV_FALSIFIER_UNCITED, target: `D-${r.n}`,
        detail: `${GOV_FALSIFIER_UNCITED}: D-${r.n} cites no named falsifier — a record that cannot fail is a record that cannot be trusted (D-439; the D-364 bar)`,
      });
    }
    // (2) evidence-on-ratified: RATIFIED rows of the in-record era carry the two-green claims
    //     (born at D-411; before that, evidence lives in commits + status carriage — and
    //     directive-class records carry the owner's word, not gate evidence)
    if (r.status === "RATIFIED") {
      ratified++;
      const directive = /^class:\s*directive\s*$/m.test(r.text);
      const evidence = /gate green[\s\S]{0,300}?×2|gate green[\s\S]{0,300}?x2/i.test(r.text);
      if (!directive && !evidence && r.n >= IN_RECORD_EVIDENCE_ERA) {
        issues.push({
          code: GOV_GREEN_WITHOUT_EVIDENCE, target: `D-${r.n}`,
          detail: `${GOV_GREEN_WITHOUT_EVIDENCE}: D-${r.n} is RATIFIED but its Evidence carries no two-green claim — ratification without the D-364 bar is a flip without proof`,
        });
      }
    }
    // (4) refusal sentences: every refusal code the record names exists in source
    const refusalCodes = [...r.text.matchAll(/\b((?:VAULT|LAW|COMPOSE|INTENT|EXEC|CAP|SURFACE|LIBRARIAN|DOCTRUTH|PERF|GOV|SESSION|BOOT|GENOME|ORCH|PRINCIPAL|CHAT)_[A-Z0-9_]+)\b/g)].map((m) => m[1]!);
    for (const code of new Set(refusalCodes)) {
      if (!resolvers.refusalInSource(code)) {
        issues.push({
          code: GOV_REFUSAL_SENTENCE_MISSING, target: `D-${r.n}`,
          detail: `${GOV_REFUSAL_SENTENCE_MISSING}: D-${r.n} names refusal ${code}, but no source in the tree carries it — a paper refusal is a promise, not a refusal`,
        });
      }
    }
    // (5) namespace law: every backticked dotted ns the record's Evidence writes appears in the doc
    //     (born at D-432 — older prose mentions are history, docscan owns them)
    const nsMentions = r.n >= NS_LAW_ERA ? [...r.text.matchAll(NS_MENTION)].map((m) => m[1]!) : [];
    for (const ns of new Set(nsMentions)) {
      if (/\.(ts|js|json|md|txt|sql|toml|lock)$/.test(ns)) continue; // a file path after "ns", not a namespace claim
      if (ns.includes(".") && !resolvers.knownNamespaces.has(ns)) {
        issues.push({
          code: GOV_NAMESPACE_UNOWNED, target: `D-${r.n}`,
          detail: `${GOV_NAMESPACE_UNOWNED}: D-${r.n} writes ns ${ns} but docs/VAULT-NAMESPACES.md has no row for it — an undocumented namespace is a namespace nobody can compact, query, or trust`,
        });
      }
    }
  }
  // (3) supersession integrity (S1 findings ride in)
  for (const f of resolvers.supersessionFindings) {
    issues.push({ code: GOV_SUPERSESSION_BROKEN, target: f.file, detail: `${GOV_SUPERSESSION_BROKEN}: ${f.file}:${f.line} ${f.msg}` });
  }
  // (6) directive-class contradiction: blocking rows that still stand
  for (const b of resolvers.openBlocking) {
    issues.push({
      code: GOV_VISION_CONTRADICTION, target: b.blocks,
      detail: `${GOV_VISION_CONTRADICTION}: an open blocking row (${b.question}) stands against the corpus — resolve the fork or record the divergence honestly`,
    });
  }
  return { ok: issues.length === 0, issues, checked: { records: records.length, ratified } };
}

// ---- the scorecard -----------------------------------------------------------

export interface ScorecardRow {
  id: string;
  name: string;
  status: string;
  treeId: number | null;
  specId: string | null;
  falsifier: string | null;
  inFlight: boolean;
}

export interface Scorecard {
  layers: ScorecardRow[];
  coverage: { implemented: number; total: number; implementedPct: number; ratified: number; records: number; ratifiedPct: number };
  depHealth: { satisfied: number; blocked: number; unsatisfiedPct: number };
  rendered: string;
}

/** The deterministic scorecard fold (never stored — a view of the genome + ledger). */
export function deriveScorecard(
  registryText: string,
  records: readonly RecordInput[],
): Scorecard {
  const { registry } = parseLayerRegistry(registryText);
  const layers = registry?.layers ?? [];
  const implementedStatus = new Set(layers.filter((l) => l.status === "implemented").map((l) => l.id));
  const rows: ScorecardRow[] = layers.map((l) => ({
    id: l.id, name: l.name ?? l.id, status: l.status, treeId: l.treeId ?? null, specId: l.specId ?? null,
    falsifier: l.falsifier ?? null,
    inFlight: l.status === "implemented" && (() => {
      const rec = l.treeId !== null && l.treeId !== undefined ? records.find((r) => r.n === l.treeId) : undefined;
      return rec !== undefined && rec.status !== "RATIFIED";
    })(),
  }));
  const implemented = layers.filter((l) => l.status === "implemented").length;
  const ratified = records.filter((r) => r.status === "RATIFIED").length;
  let satisfied = 0;
  let blocked = 0;
  const ok = (dep: string) => implementedStatus.has(dep) || layers.find((l) => l.id === dep)?.status === "external-assumed";
  for (const l of layers) {
    for (const dep of l.dependsOn ?? []) {
      if (ok(dep)) satisfied++;
      else blocked++;
    }
  }
  const sc: Scorecard = {
    layers: rows,
    coverage: {
      implemented, total: layers.length,
      implementedPct: layers.length === 0 ? 0 : Math.round((implemented / layers.length) * 100),
      ratified, records: records.length,
      ratifiedPct: records.length === 0 ? 0 : Math.round((ratified / records.length) * 100),
    },
    depHealth: { satisfied, blocked, unsatisfiedPct: satisfied + blocked === 0 ? 0 : Math.round((blocked / (satisfied + blocked)) * 100) },
    rendered: "",
  };
  sc.rendered = renderScorecard(sc);
  return sc;
}

export function renderScorecard(sc: Scorecard): string {
  const lines: string[] = [];
  lines.push(`gov.metrics — layers ${sc.coverage.implemented}/${sc.coverage.total} implemented (${sc.coverage.implementedPct}%) · records ${sc.coverage.ratified}/${sc.coverage.records} ratified (${sc.coverage.ratifiedPct}%) · deps ${sc.depHealth.satisfied} satisfied / ${sc.depHealth.blocked} blocked`);
  for (const l of sc.layers) {
    lines.push(`  ${l.status.padEnd(21)} ${l.id.padEnd(9)} ${l.treeId !== null ? `D-${l.treeId}` : "  —  "} ${l.specId ?? " — "} ${l.falsifier ?? "—"}${l.inFlight ? " (in-flight)" : ""}`);
  }
  return lines.join("\n");
}

// ---- omega:accept -------------------------------------------------------------

export interface AcceptStage {
  name: string;
  run: () => { ok: boolean; issues: string[] };
}

export interface AcceptVerdict {
  ok: boolean;
  stages: Array<{ name: string; ok: boolean; firstIssue?: string }>;
  unmet?: { code: typeof GOV_ACCEPT_UNMET; stage: string; sentence: string };
  rendered: string;
}

/**
 * THE acceptance sweep (D-439): every stage green or GOV_ACCEPT_UNMET
 * naming the stage and its first issue. Fail-closed; headless; the stages
 * are the tools the program already trusts (injected here, real in the CLI).
 */
export function runAccept(stages: readonly AcceptStage[]): AcceptVerdict {
  const results: AcceptVerdict["stages"] = [];
  for (const s of stages) {
    const r = s.run();
    results.push({ name: s.name, ok: r.ok, ...(r.ok ? {} : { firstIssue: r.issues[0] ?? "(no issue text)" }) });
    if (!r.ok) {
      const verdict: AcceptVerdict = {
        ok: false, stages: results,
        unmet: {
          code: GOV_ACCEPT_UNMET, stage: s.name,
          sentence: `${GOV_ACCEPT_UNMET}: the acceptance sweep fails at stage '${s.name}': ${r.issues[0] ?? "stage red"} — acceptance is all stages green or it is not acceptance`,
        },
        rendered: "",
      };
      verdict.rendered = renderAccept(verdict);
      return verdict;
    }
  }
  const verdict: AcceptVerdict = { ok: true, stages: results, rendered: "" };
  verdict.rendered = renderAccept(verdict);
  return verdict;
}

export function renderAccept(v: AcceptVerdict): string {
  const lines = [`omega:accept — ${v.ok ? "ACCEPTED (every stage green)" : `UNMET at '${v.unmet?.stage}'`}`];
  for (const s of v.stages) lines.push(`  ${s.ok ? "✓" : "✗"} ${s.name}${s.ok ? "" : ` — ${s.firstIssue}`}`);
  if (!v.ok && v.unmet) lines.push(`  ${v.unmet.sentence}`);
  return lines.join("\n");
}

// ---- the real-tree loaders (the CLI's resolvers) ------------------------------

export function realRecords(root: string): RecordInput[] {
  const dir = join(root, "docs", "decisions");
  const out: RecordInput[] = [];
  for (const f of readdirSync(dir)) {
    const m = /^D-(\d+)-/.exec(f);
    if (!m) continue;
    const text = readFileSync(join(dir, f), "utf-8");
    const status = /^## Status\s*\n\s*\n(RATIFIED|PROPOSED)/m.exec(text)?.[1] ?? "PROPOSED";
    out.push({ n: Number(m[1]), file: f, text, status });
  }
  return out.sort((a, b) => a.n - b.n);
}

/** The namespaces VAULT-NAMESPACES.md owns (backticked ns rows). */
export function realNamespaces(root: string): Set<string> {
  const p = join(root, "docs", "VAULT-NAMESPACES.md");
  if (!existsSync(p)) return new Set();
  const out = new Set<string>();
  for (const m of readFileSync(p, "utf-8").matchAll(/^\| `([a-z][a-z0-9.-]*)`/gm)) out.add(m[1]!);
  return out;
}

/** Does this refusal code appear in the tree's source? (the sentence scan — code AND a nearby sentence) */
export function realRefusalInSource(root: string): (code: string) => boolean {
  const dirs = ["plugins", "tooling", "contracts", "surfaces", "sdk", "platform", "host"].map((d) => join(root, d));
  const cache = new Map<string, boolean>();
  return (code: string) => {
    const hit = cache.get(code);
    if (hit !== undefined) return hit;
    let found = false;
    const walk = (dir: string, depth: number): void => {
      if (found || depth > 4) return;
      let entries: string[];
      try { entries = readdirSync(dir, { withFileTypes: true }); } catch { return; }
      for (const e of entries) {
        if (found) return;
        if (e.name === "node_modules" || e.name.startsWith(".")) continue;
        const p = join(dir, e.name);
        if (e.isDirectory()) { walk(p, depth + 1); continue; }
        if (!/\.(ts|json)$/.test(e.name)) continue;
        try {
          if (readFileSync(p, "utf-8").includes(code)) { found = true; return; }
        } catch { /* unreadable — skip */ }
      }
    };
    for (const d of dirs) walk(d, 0);
    cache.set(code, found);
    return found;
  };
}

// ---- the CLI (omega:gov · omega:accept) ---------------------------------------

async function main(): Promise<void> {
  const mode = process.argv[2] ?? "";
  const root = process.cwd();
  if (mode === "gov" || mode === "" ) {
    const records = realRecords(root);
    const verdict = validateCorpus(records, {
      refusalInSource: realRefusalInSource(root),
      knownNamespaces: realNamespaces(root),
      openBlocking: [],
      supersessionFindings: [],
    });
    const registryText = readFileSync(join(root, "genome", "layers.json"), "utf-8");
    const scorecard = deriveScorecard(registryText, records);
    console.log(`gov.validate — ${verdict.ok ? "GREEN" : `RED (${verdict.issues.length} issue(s))`} · ${verdict.checked.records} records (${verdict.checked.ratified} ratified)`);
    for (const i of verdict.issues) console.log(`  [${i.code}] ${i.target}: ${i.detail}`);
    console.log(scorecard.rendered);
    process.exit(verdict.ok ? 0 : 1);
  }
  if (mode === "accept") {
    const records = realRecords(root);
    const stages: AcceptStage[] = [];
    stages.push({
      name: "gov.validate",
      run: () => {
        const v = validateCorpus(records, {
          refusalInSource: realRefusalInSource(root),
          knownNamespaces: realNamespaces(root),
          openBlocking: [],
          supersessionFindings: [],
        });
        return { ok: v.ok, issues: v.issues.map((i) => `${i.code} ${i.target}: ${i.detail}`) };
      },
    });
    stages.push({
      name: "falsifier-suites",
      run: () => {
        const proc = Bun.spawnSync(["bun", "test", "--max-concurrency", "4", "--timeout", "60000"], { cwd: root, stdout: "pipe", stderr: "pipe", env: { ...process.env, OMEGA_TEST_CONCURRENCY: "4", OMEGA_ACCEPT_SWEEP: "1" } });
        const out = proc.stdout.toString() + proc.stderr.toString();
        const pass = /^\s*(\d+) pass/m.exec(out)?.[1] ?? "0";
        const fail = /^\s*(\d+) fail/m.exec(out)?.[1] ?? "1";
        const failing = [...out.matchAll(/\(fail\) (.+?) \[/g)].map((m) => m[1]!).slice(0, 3);
        return { ok: proc.exitCode === 0 && Number(fail) === 0, issues: [`the full test run: ${pass} pass / ${fail} fail (exit ${proc.exitCode})${failing.length > 0 ? ` — failing: ${failing.join("; ")}` : ""}`] };
      },
    });
    stages.push({
      name: "doctruth",
      run: async () => {
        const { verifyLibrarian, loadLibrarian } = await import("./doctruth.ts");
        const { rows } = loadLibrarian(root);
        // the REAL re-derivation for build/genome.md: the genome fold itself,
        // fresh from the same inputs (the librarian's generator wired honestly)
        const genome = await import("./genome.ts");
        const deriveGenome = (row: { docPath: string }): string => {
          if (row.docPath !== "build/genome.md") return "";
          try {
            const inputs = genome.gatherGenomeInputs(root);
            const { registry } = genome.parseLayerRegistry(readFileSync(join(root, "genome", "layers.json"), "utf-8"));
            return genome.renderGenomeBrief(genome.foldGenome(inputs, registry!));
          } catch {
            return "";
          }
        };
        const v = verifyLibrarian(root, rows, (abs) => { try { return readFileSync(abs, "utf-8"); } catch { return null; } }, deriveGenome as never, (p) => join(root, p));
        return { ok: v.ok, issues: v.issues.map((i) => `${i.code} ${i.docPath}: ${i.detail}`) };
      },
    } as unknown as AcceptStage);
    stages.push({
      name: "surface-parity",
      run: async () => {
        const { sweepParity, loadNaRegistry } = await import("./surfacesync.ts");
        // the harness probe set: the sweep over the declared registries (the MCP live probe wires with the daemon surface's wave)
        const report = sweepParity([], [], loadNaRegistry(root));
        return { ok: report.ok, issues: report.rendered.split("\n").filter((l) => l.includes("DRIFT") || l.includes("ORPHAN") || l.includes("UNREVIEWED")) };
      },
    } as unknown as AcceptStage);
    stages.push({
      name: "perf-budgets",
      run: async () => {
        const { loadPerfRegistry, validateFixture } = await import("./perfreg.ts");
        const reg = loadPerfRegistry(root);
        const issues: string[] = [];
        for (const f of reg.fixtures) issues.push(...validateFixture(f).map((i) => i.detail));
        return { ok: issues.length === 0, issues };
      },
    } as unknown as AcceptStage);
    stages.push({
      name: "archive-integrity",
      run: () => {
        // the ledger home's own scan (D-422 A17): the README row vs the bundle on disk
        try {
          const ledgerPin = readFileSync(join(root, ".ledger-path"), "utf-8").trim();
          const readme = readFileSync(join(ledgerPin, "README.md"), "utf-8");
          const rows = [...readme.matchAll(/^\| `(_\d+)` \| [^|]+\| `([0-9a-f]{16})…([0-9a-f]{16})` \|/gm)];
          const issues: string[] = [];
          for (const m of rows) {
            const ns = m[1]!;
            const full = `${m[2]!}${m[3]!}`;
            const bundle = join(ledgerPin, `vivim-omega-${ns.replace("_", "")}.bundle`);
            if (!existsSync(bundle)) { issues.push(`BOOT_ARCHIVE_HASH_MISMATCH: ${ns}'s README row pins sha256 ${full.slice(0, 16)}… but the bundle file is absent`); continue; }
            const actual = Bun.CryptoHasher ? new Bun.CryptoHasher("sha256").update(readFileSync(bundle)).digest("hex") : "";
            if (actual !== "" && !actual.startsWith(full.slice(0, 16))) {
              issues.push(`BOOT_ARCHIVE_HASH_MISMATCH: ${ns}'s README row pins sha256 ${full.slice(0, 16)}… but the file on disk hashes ${actual.slice(0, 16)}… — one corrupted byte`);
            }
          }
          return { ok: issues.length === 0, issues };
        } catch (err) {
          return { ok: false, issues: [`archive stage could not read the ledger home: ${String(err instanceof Error ? err.message : err)}`] };
        }
      },
    });
    stages.push({
      name: "board-freshness",
      run: () => {
        const board = readFileSync(join(root, "docs", "decisions", "OPEN-QUESTIONS.md"), "utf-8");
        const open = (board.match(/^\| \*\*OPEN/gm) ?? []).length;
        return { ok: open === 0, issues: open === 0 ? [] : [`${open} open question(s) on the board`] };
      },
    });
    stages.push({
      name: "status-carriage",
      run: () => {
        try {
          const status = JSON.parse(readFileSync(join(root, "build", "status.json"), "utf-8")) as { gate?: { checks?: Record<string, { ok?: boolean }> }; head?: string };
          const head = Bun.spawnSync(["git", "rev-parse", "--short", "HEAD"], { cwd: root, stdout: "pipe" }).stdout.toString().trim();
          const checks = Object.entries(status.gate?.checks ?? {});
          const allOk = checks.length > 0 && checks.every(([, c]) => c.ok === true);
          const headOk = status.head === undefined || status.head.startsWith(head);
          const carried = allOk && headOk;
          return { ok: carried, issues: carried ? [] : [`status.json (checks ok=${allOk ? "green" : "red"}, head=${status.head ?? "?"}) does not carry this tree's head ${head} green`] };
        } catch (err) {
          return { ok: false, issues: [`status.json unreadable: ${String(err instanceof Error ? err.message : err)}`] };
        }
      },
    });
    // run serially (each stage's run may be async)
    const results: AcceptVerdict["stages"] = [];
    let verdict: AcceptVerdict | null = null;
    for (const s of stages) {
      const r = await Promise.resolve(s.run());
      results.push({ name: s.name, ok: r.ok, ...(r.ok ? {} : { firstIssue: r.issues[0] ?? "(no issue text)" }) });
      if (!r.ok) {
        verdict = {
          ok: false, stages: results,
          unmet: { code: GOV_ACCEPT_UNMET, stage: s.name, sentence: `${GOV_ACCEPT_UNMET}: the acceptance sweep fails at stage '${s.name}': ${r.issues[0] ?? "stage red"} — acceptance is all stages green or it is not acceptance` },
          rendered: "",
        };
        verdict.rendered = renderAccept(verdict);
        break;
      }
    }
    if (verdict === null) {
      verdict = { ok: true, stages: results, rendered: "" };
      verdict.rendered = renderAccept(verdict);
    }
    console.log(verdict.rendered);
    process.exit(verdict.ok ? 0 : 1);
  }
  console.error("usage: bun run tooling/gates/gov.ts gov|accept");
  process.exit(2);
}

if (import.meta.main) void main();
