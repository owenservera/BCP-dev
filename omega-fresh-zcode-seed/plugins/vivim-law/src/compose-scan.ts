// vivim.law — compose-scan.ts
// D-433 (Ω-2.5, spec `D-434`): the composition security scan — no composition
// may activate until a static analysis pass has proven it free of hardcoded
// secrets, ungranted capabilities, stored-truth selectors, and undeclared
// mutations. A composition is a signed set of capabilities, but its payload
// can smuggle; without this scan the signature vouches for the smuggler.
//
// The pattern sets are VERSIONED, INSPECTABLE DATA (exported, never hidden
// constants): a secret scanner whose patterns you cannot inspect is a scanner
// that can be taught to miss (Ω-2.5 choicepoint 4). Checks are written
// against the REAL composition manifest shape (compositions/*.json):
// {name, entries[].{id, source, bootPhase, grant.{capabilities, contracts},
// config, budget?}, mutations?}.
//
// LOUD FAILURE BY CONSTRUCTION (F-LAW-COHERENCE.6): zero catch blocks, zero
// console writes in this module — every check either passes clean, or emits a
// named finding carrying the exact refusal code and locator. The activation
// gate turns findings into refusals with sentences; nothing is warn-and-
// continue. The port-call persistence layer lives in index.ts (the
// forbidden.ts import-safe split).
import { canonicalJson, sha256Hex } from "./conflict.ts";

// ---- the versioned pattern sets (inspectable data, not hidden constants) ----

export interface SecretPattern { id: string; name: string; regex: string; flags?: string }

/** Curated secret patterns. Version 1. Bumping the version is an amendment:
 *  the set is evidence, and a pattern that quietly disappears is a hole. */
export const SECRET_PATTERN_SET_V1: { version: "1"; description: string; patterns: SecretPattern[] } = {
  version: "1",
  description: "curated, versioned, inspectable — hardcoded keys, tokens, passwords, and PEM blocks in composition payloads (Ω-2.5 choicepoint 4)",
  patterns: [
    { id: "aws-access-key", name: "AWS access key id", regex: "AKIA[0-9A-Z]{16}" },
    { id: "github-token", name: "GitHub token", regex: "gh[pousr]_[A-Za-z0-9]{20,}" },
    { id: "slack-token", name: "Slack token", regex: "xox[baprs]-[0-9A-Za-z-]{10,}" },
    { id: "openai-style-key", name: "OpenAI-style API key", regex: "sk-[A-Za-z0-9_-]{20,}" },
    { id: "google-api-key", name: "Google API key", regex: "AIza[0-9A-Za-z_-]{30}" },
    { id: "pem-private-key", name: "PEM private key block", regex: "-----BEGIN [A-Z ]*PRIVATE KEY-----" },
    { id: "bearer-literal", name: "Bearer credential literal", regex: "Bearer\\s+[A-Za-z0-9._+/-]{20,}" },
    {
      id: "assigned-secret", name: "assigned secret literal",
      regex: "(?:password|passwd|secret|api[_-]?key|access[_-]?token|client[_-]?secret)['\"]?\\s*[:=]\\s*['\"][^'\"\\s]{8,}['\"]",
      flags: "i",
    },
  ],
};

export interface SelectorValueShape { id: string; regex: string }

/** Selector-as-truth shapes: a durable field whose KEY names a selector and
 *  whose VALUE is a DOM/CSS/XPath selector — the stored-truth anti-pattern
 *  (selectors are re-derived observations, never stored facts). */
export const SELECTOR_PATTERN_SET_V1: {
  version: "1";
  keyPattern: string;
  valueShapes: SelectorValueShape[];
} = {
  version: "1",
  keyPattern: "(?:dom|css|click|ui|element|target)?selectors?$|^xpath$",
  valueShapes: [
    { id: "css-id", regex: "^#[A-Za-z][\\w-]*$" },
    { id: "css-class", regex: "^\\.[A-Za-z][\\w-]*$" },
    { id: "css-composite", regex: "^[a-z][a-z0-9]*(?:[.#[]|::)" },
    { id: "css-combinator", regex: "^[#.]?[\\w-]+\\s*[>+~]\\s*[#.]?[\\w-]*" },
    { id: "xpath", regex: "^//" },
  ],
};

/** An op-shaped mutation reference: "vault.append@1", "law.check@1", … */
export const OP_SHAPE = /^[a-z][a-z0-9]*(?:\.[a-z0-9-]+)+@\d+$/;

/** Stream/loop-shaped contracts (the Ω-2 budget-binding domain). */
export const STREAM_SHAPE = /(?:^|\.)(?:stream|loop)(?:\.|@)/;

/** Capability-shaped strings: "host.journal.append", "port:vault.append@1". */
export const CAP_SHAPE = /^(?:host|port):[A-Za-z0-9._@-]+$/;

// ---- findings + sentences (the refusal register, verbatim) -------------------

export type ComposeCheck = "secret-pattern" | "grant-coverage" | "selector-as-truth" | "mutation-declaration" | "budget-binding";

export interface Finding {
  check: ComposeCheck;
  code: string;
  locator: string;   // the path into the manifest, e.g. "entries[2].config.apiKey"
  detail: string;    // the smuggled thing itself (the secret redacted, the cap, the selector, the op)
  blocking: boolean;
}

export function findingSentence(f: Finding): string {
  switch (f.code) {
    case "COMPOSE_SCAN_SECRET_FOUND":
      return `This composition carries what looks like a hardcoded secret at ${f.locator}; secrets live in the Trust Mesh, not in payloads, and activation is refused.`;
    case "COMPOSE_UNGRANTED_CAPABILITY":
      return `This composition references capability ${f.detail} without a live grant from you; it is refused until you grant it or the composition drops it.`;
    case "COMPOSE_SELECTOR_AS_TRUTH":
      return `This composition stores selector ${f.detail} as durable truth; selectors are re-derived observations, never stored facts, and activation is refused.`;
    case "COMPOSE_UNDECLARED_MUTATION":
      return `This composition mutates ${f.detail} without declaring it in its manifest; undeclared side effects are smuggling, and activation is refused.`;
    case "COMPOSE_UNBUDGETED_LOOP":
      return `This composition runs ${f.detail} without a declared budget; unbounded loops and streams do not activate once Ω-2's budget ledger lands (non-blocking until then — the hookup, stated).`;
    default:
      return `${f.code}: ${f.detail} at ${f.locator}`;
  }
}

// ---- the walk ---------------------------------------------------------------

interface Leaf { path: string; key: string; value: string }

function walkStrings(value: unknown, path: string, key: string, out: Leaf[]): void {
  if (typeof value === "string") {
    out.push({ path, key, value });
    return;
  }
  if (value === null || typeof value !== "object") return;
  if (Array.isArray(value)) {
    value.forEach((x, i) => walkStrings(x, `${path}[${i}]`, key, out));
    return;
  }
  for (const k of Object.keys(value as Record<string, unknown>)) {
    walkStrings((value as Record<string, unknown>)[k], path === "" ? k : `${path}.${k}`, k, out);
  }
}

// ---- the five checks ---------------------------------------------------------

export interface ComposeScanVerdict {
  manifestHash: string;
  findings: Finding[];
  blocking: number;
  verdict: "pass" | "refused";
}

export function manifestHashOf(manifest: unknown): string {
  return sha256Hex(canonicalJson(manifest));
}

export function compositionRefOf(manifest: unknown): string {
  if (manifest !== null && typeof manifest === "object" && !Array.isArray(manifest)) {
    const name = (manifest as Record<string, unknown>)["name"];
    if (typeof name === "string" && name.length > 0) return name;
  }
  return "unnamed";
}

/** The composition's declared mutation surface: every granted contract, plus
 *  the top-level `mutations` declaration when present. An op-shaped string
 *  anywhere in the manifest outside this surface is an undeclared mutation. */
function declaredSurface(manifest: Record<string, unknown>): { ops: Set<string>; mutations: string[] } {
  const ops = new Set<string>();
  const mutations: string[] = [];
  const entries = Array.isArray(manifest["entries"]) ? (manifest["entries"] as unknown[]) : [];
  for (const e of entries) {
    if (e === null || typeof e !== "object") continue;
    const grant = (e as Record<string, unknown>)["grant"];
    if (grant === null || typeof grant !== "object") continue;
    const contracts = (grant as Record<string, unknown>)["contracts"];
    if (Array.isArray(contracts)) for (const c of contracts) if (typeof c === "string") ops.add(c);
  }
  const declared = manifest["mutations"];
  if (Array.isArray(declared)) for (const m of declared) if (typeof m === "string") mutations.push(m);
  for (const m of mutations) if (OP_SHAPE.test(m)) ops.add(m);
  return { ops, mutations };
}

function hasBudget(entry: unknown): boolean {
  if (entry === null || typeof entry !== "object") return false;
  const e = entry as Record<string, unknown>;
  if (e["budget"] !== undefined && e["budget"] !== null) return true;
  const config = e["config"];
  if (config !== null && typeof config === "object" && !Array.isArray(config)) {
    const b = (config as Record<string, unknown>)["budget"];
    if (b !== undefined && b !== null) return true;
  }
  return false;
}

/**
 * THE composition security scan (D-433). Five checks over the manifest bytes:
 * secret-pattern · grant-coverage · selector-as-truth · mutation-declaration ·
 * budget-binding. Pure: the same manifest + the same grants replay the same
 * verdict byte-for-byte; `manifestHash` pins the exact bytes scanned.
 */
export function scanComposition(manifest: unknown, grants: readonly string[]): ComposeScanVerdict {
  const findings: Finding[] = [];
  const leaves: Leaf[] = [];
  walkStrings(manifest, "", "", leaves);
  const manifestHash = manifestHashOf(manifest);
  const grantSet = new Set(grants);
  const isObj = manifest !== null && typeof manifest === "object" && !Array.isArray(manifest);
  const rec = isObj ? (manifest as Record<string, unknown>) : {};
  const declared = declaredSurface(rec);
  const topBudget = rec["budget"] !== undefined && rec["budget"] !== null;
  const selectorKey = new RegExp(SELECTOR_PATTERN_SET_V1.keyPattern, "i");
  const secretRes = SECRET_PATTERN_SET_V1.patterns.map((p) => ({ p, re: new RegExp(p.regex, p.flags ?? "") }));
  const selectorRes = SELECTOR_PATTERN_SET_V1.valueShapes.map((s) => ({ s, re: new RegExp(s.regex) }));

  for (const leaf of leaves) {
    // 1 · secret-pattern — hardcoded keys/tokens/passwords in ANY manifest string
    for (const { p, re } of secretRes) {
      if (!re.test(leaf.value)) continue;
      findings.push({
        check: "secret-pattern", code: "COMPOSE_SCAN_SECRET_FOUND",
        locator: leaf.path,
        detail: `${p.name} (${p.id}, pattern set v${SECRET_PATTERN_SET_V1.version}): ${redact(leaf.value)}`,
        blocking: true,
      });
      break; // one finding per leaf — the locator names the exact field
    }
    // 3 · selector-as-truth — a durable field whose key names a selector and whose value is one
    if (selectorKey.test(leaf.key)) {
      for (const { s, re } of selectorRes) {
        if (!re.test(leaf.value)) continue;
        findings.push({
          check: "selector-as-truth", code: "COMPOSE_SELECTOR_AS_TRUTH",
          locator: leaf.path, detail: leaf.value, blocking: true,
        });
        break;
      }
    }
    // 4 · mutation-declaration — op-shaped references outside the declared surface
    if (OP_SHAPE.test(leaf.value) && !declared.ops.has(leaf.value) && !leaf.path.endsWith(".contracts") && !leaf.path.startsWith("mutations")) {
      findings.push({
        check: "mutation-declaration", code: "COMPOSE_UNDECLARED_MUTATION",
        locator: leaf.path, detail: leaf.value, blocking: true,
      });
    }
  }

  // 2 · grant-coverage — every referenced capability is in the principal's live grants
  const referenced = new Map<string, string>(); // cap -> locator (first sighting)
  const entries = Array.isArray(rec["entries"]) ? (rec["entries"] as unknown[]) : [];
  for (const e of entries) {
    if (e === null || typeof e !== "object") continue;
    const grant = (e as Record<string, unknown>)["grant"];
    if (grant === null || typeof grant !== "object" || Array.isArray(grant)) continue;
    const caps = (grant as Record<string, unknown>)["capabilities"];
    const eid = typeof (e as Record<string, unknown>)["id"] === "string" ? (e as Record<string, unknown>)["id"] as string : "?";
    if (Array.isArray(caps)) {
      caps.forEach((c, i) => {
        if (typeof c === "string" && !referenced.has(c)) referenced.set(c, `entries[${entries.indexOf(e)}].grant.capabilities[${i}] (entry ${eid})`);
      });
    }
  }
  for (const leaf of leaves) {
    if (CAP_SHAPE.test(leaf.value) && !leaf.path.endsWith(".capabilities") && !referenced.has(leaf.value)) {
      referenced.set(leaf.value, leaf.path);
    }
  }
  for (const [cap, locator] of [...referenced.entries()].sort((a, b) => (a[0] < b[0] ? -1 : 1))) {
    if (grantSet.has(cap)) continue;
    findings.push({
      check: "grant-coverage", code: "COMPOSE_UNGRANTED_CAPABILITY",
      locator, detail: cap, blocking: true,
    });
  }

  // 5 · budget-binding — stream/loop-shaped contracts without a declared budget
  //     (the Ω-2 hookup: recorded NON-BLOCKING until the budget ledger lands)
  for (const e of entries) {
    if (e === null || typeof e !== "object") continue;
    const en = e as Record<string, unknown>;
    const grant = en["grant"];
    if (grant === null || typeof grant !== "object") continue;
    const contracts = (grant as Record<string, unknown>)["contracts"];
    if (!Array.isArray(contracts)) continue;
    const streams = contracts.filter((c) => typeof c === "string" && STREAM_SHAPE.test(c)) as string[];
    if (streams.length === 0) continue;
    if (hasBudget(e) || topBudget) continue;
    findings.push({
      check: "budget-binding", code: "COMPOSE_UNBUDGETED_LOOP",
      locator: `entries[${entries.indexOf(e)}].grant.contracts (entry ${String(en["id"] ?? "?")})`,
      detail: streams.join(", "), blocking: false,
    });
  }

  const blocking = findings.filter((f) => f.blocking).length;
  return { manifestHash, findings, blocking, verdict: blocking > 0 ? "refused" : "pass" };
}

function redact(value: string): string {
  return value.length <= 8 ? "…" : `${value.slice(0, 4)}…${value.slice(-2)} (${value.length} chars)`;
}

// ---- the scan row + the activation gate --------------------------------------

export interface ComposeScanRow {
  kind: "compose.scan@1";
  compositionRef: string;
  manifestHash: string;
  findings: Finding[];
  verdict: "pass" | "refused";
  scannedAt: number;
}

export const COMPOSE_SCAN_NOT_RUN = "COMPOSE_SCAN_NOT_RUN";
export const COMPOSE_SCAN_NOT_RUN_SENTENCE =
  "This composition has no scan row matching its manifest hash; unscanned code does not activate, full stop.";

export type ActivationVerdict =
  | { ok: true; row: ComposeScanRow }
  | { ok: false; code: typeof COMPOSE_SCAN_NOT_RUN; sentence: string; manifestHash: string; scannedHashes: string[] }
  | { ok: false; code: string; sentence: string; findings: Finding[]; manifestHash: string };

/**
 * THE activation gate (D-433): activation requires a PASSING scan row whose
 * manifestHash matches the manifest being activated. A stale or missing row is
 * COMPOSE_SCAN_NOT_RUN; a red row is refused naming every finding's code and
 * locator. Compositions can be built dirty for testing; they cannot RUN dirty.
 */
export function activationGate(manifest: unknown, rows: readonly ComposeScanRow[], compositionRef: string): ActivationVerdict {
  const manifestHash = manifestHashOf(manifest);
  const mine = rows.filter((r) => r.compositionRef === compositionRef);
  const matching = mine.filter((r) => r.manifestHash === manifestHash);
  // only non-blocking findings ⇒ verdict "pass" by construction (the Ω-2 hookup posture)
  const passing = matching.find((r) => r.verdict === "pass");
  if (passing !== undefined) return { ok: true, row: passing };
  const latest = matching[matching.length - 1];
  if (latest !== undefined) {
    const blocking = latest.findings.filter((f) => f.blocking);
    const first = blocking[0];
    if (first !== undefined) {
      return { ok: false, code: first.code, sentence: findingSentence(first), findings: latest.findings, manifestHash };
    }
    return { ok: true, row: latest }; // defensive: a row cannot be "refused" without a blocking finding
  }
  return {
    ok: false, code: COMPOSE_SCAN_NOT_RUN, sentence: COMPOSE_SCAN_NOT_RUN_SENTENCE,
    manifestHash, scannedHashes: [...new Set(mine.map((r) => r.manifestHash))],
  };
}

/**
 * The scan-row ledger. Memory-first (the forbidden-overlay posture); the vault
 * persistence (ns compose.scan, ids scan:<hash12>) lives in index.ts. Rows are
 * keyed by compositionRef + manifestHash: a re-scan of identical bytes REPLAYS
 * (returns the recorded row — recorded once), and changed bytes land a new row.
 */
export class ComposeScanLedger {
  private rows = new Map<string, ComposeScanRow>();

  record(compositionRef: string, verdict: ComposeScanVerdict, scannedAt: number): ComposeScanRow {
    const key = `${compositionRef}:${verdict.manifestHash}`;
    const existing = this.rows.get(key);
    if (existing !== undefined) return existing; // identical bytes — the row is the record, replays are reads
    const row: ComposeScanRow = {
      kind: "compose.scan@1", compositionRef, manifestHash: verdict.manifestHash,
      findings: verdict.findings, verdict: verdict.verdict, scannedAt,
    };
    this.rows.set(key, row);
    return row;
  }

  rowsList(): ComposeScanRow[] {
    return [...this.rows.values()].sort((a, b) => (a.scannedAt === b.scannedAt ? (a.compositionRef < b.compositionRef ? -1 : 1) : a.scannedAt - b.scannedAt));
  }

  get(compositionRef: string, manifestHash: string): ComposeScanRow | null {
    return this.rows.get(`${compositionRef}:${manifestHash}`) ?? null;
  }
}
