// vivim-run/src/aperture.ts (D-448, Ω-9 — the aperture, re-materialized spec paper D-433)
//
// Not all eyes see the same row: every read of a capability's state is a
// projection at a declared width over a tiny ordered lattice, so the same
// evidence serves the owner, the deputy, and the stranger as three different
// honest views. Elision is law-side (renderer-side elision is leakage with a
// scrollbar), honest ({count, kinds}, never fabrication, never silent
// truncation), and fail-closed — a requester with no scope row is served the
// coarsest summary-of-existence, and an explicit width without a scope is a
// named refusal, never a fallback to full width. Widening is a governed event
// with a cited ceremony and a receipt row; the standing posture is not an
// event, crossing it is.
//
// Pure core: no timers, no I/O, zero pixels (F1 by construction). The ops
// layer supplies the principal; the vault mirror rides port caps when present
// (ring-first, the health.ts precedent).
import { canonicalJson, sha256Hex } from "./planstate.ts";

export const APERTURE_NS = "aperture";
export const DISCLOSURE_WIDTH_INVALID = "DISCLOSURE_WIDTH_INVALID";
export const DISCLOSURE_SCOPE_CONFLICT = "DISCLOSURE_SCOPE_CONFLICT";
export const DISCLOSURE_WIDENING_UNCITED = "DISCLOSURE_WIDENING_UNCITED";
export const DISCLOSURE_SCOPE_UNKNOWN = "DISCLOSURE_SCOPE_UNKNOWN";
export const DISCLOSURE_TARGET_UNRESOLVED = "DISCLOSURE_TARGET_UNRESOLVED";
export const DISCLOSURE_SCOPE_FOREIGN_WRITER = "DISCLOSURE_SCOPE_FOREIGN_WRITER";
export const DISCLOSURE_VIEW_NONDETERMINISTIC = "DISCLOSURE_VIEW_NONDETERMINISTIC";
export const DISCLOSURE_RECEIPT_UNWRITTEN = "DISCLOSURE_RECEIPT_UNWRITTEN";

/** THE width lattice (D-448): granularity, orthogonal to permission. Widths
 *  are law, not adjectives — ordered, comparable, refusable, printable. */
export type Width = "summary" | "body" | "detail" | "raw";
export const WIDTH_LATTICE: readonly Width[] = ["summary", "body", "detail", "raw"];
export const WIDTH_ORDER: Record<Width, number> = { summary: 0, body: 1, detail: 2, raw: 3 };

export function isWidth(w: unknown): w is Width {
  return typeof w === "string" && (WIDTH_LATTICE as readonly string[]).includes(w);
}

/** One disclosure scope row (ns `aperture`, id `scope:<target>:<principal>`):
 *  the target's declaring owner says what THIS requester may see, and at what
 *  width. Latest-wins with append history; amendments cite the prior row. */
export interface DisclosureScopeRow {
  target: string;            // ns | capabilityRef — one cannot scope what does not exist
  principal: string;         // the requester this scope governs
  width: Width;              // the granted width on the lattice
  setBy: string;             // the declaring principal (the target's owner)
  at: number;
  supersedes?: string;       // the prior scope row id (the amendment citation)
}

/** One evidence field as the fold sees it: a value visible from a width up. */
export interface EvidenceField { name: string; width: Width; value: unknown }

/** One vault row of the target's evidence (the fold's only input). */
export interface EvidenceRow { id: string; ns: string; fields: EvidenceField[] }

/** One view receipt (ns `aperture`, id `view:<hex>`): written per WIDENING —
 *  who was widened to what, citing the evidence digest of exactly what became
 *  viewable, under which consent. The audit trail of the aperture. */
export interface ViewReceipt {
  kind: "aperture.receipt@1";
  receiptId: string;
  requester: string;
  target: string;
  width: Width;
  evidenceDigest: string;
  consentRef: string;
  at: number;
}

/** THE projection (D-448): the deterministic fold's answer — what THIS
 *  requester sees at THIS width, which scope row authorized the slice, and
 *  exactly what was elided (honest, mechanically diffable). */
export interface Projection {
  kind: "aperture.view@1";
  target: string;
  requester: string;
  width: Width;
  scopeRef: string;          // the scope row that authorized this slice (or the named fail-closed posture)
  rows: Array<{ id: string; ns: string; fields: Array<{ name: string; value: unknown }> }>;
  elided: { count: number; kinds: string[] };
  evidenceDigest: string;    // over exactly what was viewed — same inputs, same bytes, forever
  sentence?: string;         // the posture note (fail-closed views say so)
}

export type ScopeOutcome = { ok: true; row: DisclosureScopeRow } | { ok: false; code: string; sentence: string };
export type ViewOutcome = { ok: true; projection: Projection } | { ok: false; code: string; sentence: string };
export type WidenOutcome = { ok: true; row: DisclosureScopeRow; receipt: ViewReceipt | null; widened: boolean } | { ok: false; code: string; sentence: string };

export function scopeRowId(target: string, principal: string): string {
  return `${APERTURE_NS}:scope:${target}:${principal}`;
}

/** THE scope door (D-448): widths validated at the door, owners are the
 *  anti-forgery, amendments cite the prior row, and widening demands a cited
 *  ceremony — the aperture does not open because someone asked nicely. */
export function setScope(
  spec: { target: string; principal: string; width: Width; setBy: string; at: number; cites?: readonly string[]; supersedes?: string },
  existing: DisclosureScopeRow | null,
  owner: string | null,
): ScopeOutcome {
  if (!isWidth(spec.width)) {
    return { ok: false, code: DISCLOSURE_WIDTH_INVALID, sentence: `${DISCLOSURE_WIDTH_INVALID}: width ${JSON.stringify(spec.width)} is not on the lattice (summary|body|detail|raw) — widths are law, not adjectives (D-448, Ω-9)` };
  }
  if (typeof spec.target !== "string" || spec.target.length === 0) {
    return { ok: false, code: DISCLOSURE_TARGET_UNRESOLVED, sentence: `${DISCLOSURE_TARGET_UNRESOLVED}: the disclosure target is empty — one cannot scope what does not exist (D-448)` };
  }
  if (typeof spec.principal !== "string" || spec.principal.length === 0) {
    return { ok: false, code: DISCLOSURE_TARGET_UNRESOLVED, sentence: `${DISCLOSURE_TARGET_UNRESOLVED}: the scope names no principal — a scope that governs nobody is a mood, not a policy (D-448)` };
  }
  if (typeof spec.setBy !== "string" || spec.setBy.length === 0) {
    return { ok: false, code: DISCLOSURE_SCOPE_FOREIGN_WRITER, sentence: `${DISCLOSURE_SCOPE_FOREIGN_WRITER}: the scope names no declaring writer — an anonymous declaration is a forgery by default (D-448)` };
  }
  if (owner !== null && spec.setBy !== owner) {
    return { ok: false, code: DISCLOSURE_SCOPE_FOREIGN_WRITER, sentence: `${DISCLOSURE_SCOPE_FOREIGN_WRITER}: ${spec.setBy} amends the scope for ${spec.target} but ${owner} declared it — sole-writer is the anti-forgery (D-448)` };
  }
  if (existing !== null) {
    if (spec.width !== existing.width && spec.supersedes !== scopeRowId(existing.target, existing.principal)) {
      return { ok: false, code: DISCLOSURE_SCOPE_CONFLICT, sentence: `${DISCLOSURE_SCOPE_CONFLICT}: a scope already governs ${spec.target} for ${spec.principal} at ${existing.width}; the amendment must cite the prior row (supersedes ${scopeRowId(existing.target, existing.principal)}) — two uncited scopes for one requester is how two truths are born (D-448)` };
    }
    if (WIDTH_ORDER[spec.width] > WIDTH_ORDER[existing.width] && (spec.cites ?? []).length === 0) {
      return { ok: false, code: DISCLOSURE_WIDENING_UNCITED, sentence: `${DISCLOSURE_WIDENING_UNCITED}: widening ${spec.principal}'s view of ${spec.target} from ${existing.width} to ${spec.width} cites no ceremony — consent ${consentRefFor(spec.target, spec.principal)} or a decision ref is required; the aperture does not open because someone asked nicely (D-448)` };
    }
  }
  return {
    ok: true,
    row: { target: spec.target, principal: spec.principal, width: spec.width, setBy: spec.setBy, at: spec.at, ...(spec.supersedes !== undefined ? { supersedes: spec.supersedes } : {}) },
  };
}

/** The consent id a widening of this (target, principal) would be cited by. */
export function consentRefFor(target: string, principal: string): string {
  return `consent:aperture:${target}:${principal}`;
}

/** THE projection fold (D-448): a pure function of the evidence rows at the
 *  width. Fields become visible at their declared width and stay visible up
 *  the lattice; what drops is counted and named, never fabricated, never
 *  silently truncated. Deterministic: rows sort by id, fields by name. */
export function projectAt(
  spec: { target: string; requester: string; width: Width; scopeRef: string; sentence?: string },
  rows: readonly EvidenceRow[],
): Projection {
  const kept = [...rows]
    .sort((a, b) => (a.id < b.id ? -1 : a.id > b.id ? 1 : 0))
    .map((row) => ({
      id: row.id,
      ns: row.ns,
      fields: row.fields
        .filter((f) => WIDTH_ORDER[f.width] <= WIDTH_ORDER[spec.width])
        .sort((a, b) => (a.name < b.name ? -1 : a.name > b.name ? 1 : 0))
        .map((f) => ({ name: f.name, value: f.value })),
    }));
  const droppedKinds = new Set<string>();
  let count = 0;
  for (const row of rows) {
    for (const f of row.fields) {
      if (WIDTH_ORDER[f.width] > WIDTH_ORDER[spec.width]) {
        count += 1;
        droppedKinds.add(f.name);
      }
    }
  }
  const projection: Projection = {
    kind: "aperture.view@1",
    target: spec.target,
    requester: spec.requester,
    width: spec.width,
    scopeRef: spec.scopeRef,
    rows: kept,
    elided: { count, kinds: [...droppedKinds].sort() },
    evidenceDigest: `sha256:${sha256Hex(canonicalJson({ target: spec.target, requester: spec.requester, width: spec.width, rows: kept }))}`,
    ...(spec.sentence !== undefined ? { sentence: spec.sentence } : {}),
  };
  return projection;
}

/** The mechanically diffable elision law (F-DISCLOSURE.4): the (row,field)
 *  pairs the raw projection keeps that THIS view drops — `raw` minus the view
 *  equals exactly the elided set, checkable by machine, not by vibe. */
export function droppedPairs(raw: Projection, atWidth: Projection): string[] {
  const kept = new Set(atWidth.rows.flatMap((row) => row.fields.map((f) => `${row.id}:${f.name}`)));
  return raw.rows
    .flatMap((row) => row.fields.map((f) => `${row.id}:${f.name}`))
    .filter((pair) => !kept.has(pair))
    .sort();
}

/** THE view door (D-448): the fold over the target's rows for THIS requester.
 *  No scope → fail-closed to summary (proof-of-existence), never full width;
 *  an explicit width without a scope refuses DISCLOSURE_SCOPE_UNKNOWN; an
 *  explicit width beyond the scope's refuses DISCLOSURE_WIDENING_UNCITED. */
export function view(
  spec: { target: string; requester: string; width?: Width },
  scopes: ReadonlyMap<string, DisclosureScopeRow>,   // key: scopeRowId(target, principal)
  rows: readonly EvidenceRow[],
): ViewOutcome {
  const key = scopeRowId(spec.target, spec.requester);
  const scope = scopes.get(key) ?? null;
  if (spec.width !== undefined && !isWidth(spec.width)) {
    return { ok: false, code: DISCLOSURE_WIDTH_INVALID, sentence: `${DISCLOSURE_WIDTH_INVALID}: width ${JSON.stringify(spec.width)} is not on the lattice (summary|body|detail|raw) — widths are law, not adjectives (D-448, Ω-9)` };
  }
  if (scope === null) {
    if (spec.width !== undefined && spec.width !== "summary") {
      return { ok: false, code: DISCLOSURE_SCOPE_UNKNOWN, sentence: `${DISCLOSURE_SCOPE_UNKNOWN}: no disclosure scope governs ${spec.target} for ${spec.requester}; absent law the aperture serves the owner everything and the stranger only proof-of-existence — never a guess, never full width (D-448)` };
    }
    return {
      ok: true,
      projection: projectAt(
        { target: spec.target, requester: spec.requester, width: "summary", scopeRef: `${APERTURE_NS}:fail-closed`, sentence: `${DISCLOSURE_SCOPE_UNKNOWN}: no scope governs this target for this requester — the fail-closed summary-of-existence posture, never a fallback to full width (D-448)` },
        rows,
      ),
    };
  }
  const width = spec.width ?? scope.width;
  if (WIDTH_ORDER[width] > WIDTH_ORDER[scope.width]) {
    return { ok: false, code: DISCLOSURE_WIDENING_UNCITED, sentence: `${DISCLOSURE_WIDENING_UNCITED}: ${spec.requester} requests ${width} on ${spec.target} but the scope grants ${scope.width}; the wider view needs a cited ceremony (${consentRefFor(spec.target, spec.requester)}) — the aperture does not open because someone asked nicely (D-448)` };
  }
  return { ok: true, projection: projectAt({ target: spec.target, requester: spec.requester, width, scopeRef: key }, rows) };
}

/** The headless render: the aperture is data, renderable by anything (F1). */
export function renderAperture(scopes: readonly DisclosureScopeRow[], receipts: readonly ViewReceipt[]): string {
  const lines = [`aperture.read — ${scopes.length} scope(s), ${receipts.length} receipt(s)`];
  for (const s of [...scopes].sort((a, b) => (a.target < b.target ? -1 : a.target > b.target ? 1 : a.principal < b.principal ? -1 : 1))) {
    lines.push(`  ${s.target} / ${s.principal} → ${s.width} (by ${s.setBy}, at ${s.at}${s.supersedes !== undefined ? `, supersedes ${s.supersedes}` : ""})`);
  }
  for (const r of [...receipts].sort((a, b) => a.at - b.at)) {
    lines.push(`  receipt ${r.receiptId} — ${r.requester} widened to ${r.width} on ${r.target} via ${r.consentRef} (evidence ${r.evidenceDigest.slice(0, 22)}…)`);
  }
  return lines.join("\n");
}

/** The in-plugin registry (ring-first; the vault mirror rides port caps). */
export class ApertureRegistry {
  private scopes = new Map<string, DisclosureScopeRow>();
  private owners = new Map<string, string>();
  private receipts: ViewReceipt[] = [];
  private evidence = new Map<string, EvidenceRow[]>();

  setScope(spec: { target: string; principal: string; width: Width; setBy: string; at: number; cites?: readonly string[]; supersedes?: string }): ScopeOutcome {
    const key = scopeRowId(spec.target, spec.principal);
    const out = setScope(spec, this.scopes.get(key) ?? null, this.owners.get(spec.target) ?? null);
    if (out.ok) {
      this.scopes.set(key, out.row);
      if (!this.owners.has(out.row.target)) this.owners.set(out.row.target, out.row.setBy);
    }
    return out;
  }

  /** The widening ceremony: consent-cited, receipt-first — a receipt that
   *  fails to persist rolls the widening back loudly and nothing widens. */
  widen(spec: { target: string; requester: string; width: Width; consentRef: string; by: string; at: number; persistReceipt?: (r: ViewReceipt) => boolean }): WidenOutcome {
    const key = scopeRowId(spec.target, spec.requester);
    const existing = this.scopes.get(key) ?? null;
    const owner = this.owners.get(spec.target) ?? null;
    if (!isWidth(spec.width)) {
      return { ok: false, code: DISCLOSURE_WIDTH_INVALID, sentence: `${DISCLOSURE_WIDTH_INVALID}: width ${JSON.stringify(spec.width)} is not on the lattice (summary|body|detail|raw) — widths are law, not adjectives (D-448, Ω-9)` };
    }
    if (existing === null) {
      return { ok: false, code: DISCLOSURE_SCOPE_UNKNOWN, sentence: `${DISCLOSURE_SCOPE_UNKNOWN}: no disclosure scope governs ${spec.target} for ${spec.requester}; there is nothing to widen — declare the scope first (D-448)` };
    }
    if (typeof spec.consentRef !== "string" || spec.consentRef.length === 0) {
      return { ok: false, code: DISCLOSURE_WIDENING_UNCITED, sentence: `${DISCLOSURE_WIDENING_UNCITED}: the wider view was requested without the required consent — cite ${consentRefFor(spec.target, spec.requester)}; the aperture does not open because someone asked nicely (D-448)` };
    }
    if (owner !== null && spec.by !== owner) {
      return { ok: false, code: DISCLOSURE_SCOPE_FOREIGN_WRITER, sentence: `${DISCLOSURE_SCOPE_FOREIGN_WRITER}: ${spec.by} runs the widening ceremony for ${spec.target} but ${owner} declared it — sole-writer is the anti-forgery (D-448)` };
    }
    if (WIDTH_ORDER[spec.width] <= WIDTH_ORDER[existing.width]) {
      return { ok: true, row: existing, receipt: null, widened: false }; // not a crossing — the standing posture is not an event
    }
    const projection = projectAt({ target: spec.target, requester: spec.requester, width: spec.width, scopeRef: key }, this.evidence.get(spec.target) ?? []);
    const receipt: ViewReceipt = {
      kind: "aperture.receipt@1",
      receiptId: `view:${sha256Hex(canonicalJson({ key, width: spec.width, at: spec.at, consentRef: spec.consentRef })).slice(0, 16)}`,
      requester: spec.requester,
      target: spec.target,
      width: spec.width,
      evidenceDigest: projection.evidenceDigest,
      consentRef: spec.consentRef,
      at: spec.at,
    };
    const persisted = spec.persistReceipt !== undefined ? spec.persistReceipt(receipt) : this.persist(receipt);
    if (!persisted) {
      return { ok: false, code: DISCLOSURE_RECEIPT_UNWRITTEN, sentence: `${DISCLOSURE_RECEIPT_UNWRITTEN}: the widening of ${spec.requester} to ${spec.width} on ${spec.target} succeeded but its receipt failed to persist; the view is rolled back and reported loudly — an unrecorded widening is an unaccountable one (D-448)` };
    }
    const amended: DisclosureScopeRow = { target: spec.target, principal: spec.requester, width: spec.width, setBy: spec.by, at: spec.at, supersedes: key };
    this.scopes.set(key, amended);
    return { ok: true, row: amended, receipt, widened: true };
  }

  /** Load the target's evidence rows (the fold's only input — the caller is
   *  the vault's mirror; the aperture never invents evidence). */
  putEvidence(target: string, rows: readonly EvidenceRow[]): void {
    this.evidence.set(target, [...rows]);
  }

  /** THE fold, served: computed twice, digest-compared — a view the system
   *  cannot re-derive is a view it must not serve. */
  view(target: string, requester: string, width?: Width): ViewOutcome {
    const rows = this.evidence.get(target) ?? [];
    const first = view({ target, requester, ...(width !== undefined ? { width } : {}) }, this.scopes, rows);
    if (!first.ok) return first;
    const second = view({ target, requester, ...(width !== undefined ? { width } : {}) }, this.scopes, rows);
    if (!second.ok || second.projection.evidenceDigest !== first.projection.evidenceDigest) {
      return { ok: false, code: DISCLOSURE_VIEW_NONDETERMINISTIC, sentence: `${DISCLOSURE_VIEW_NONDETERMINISTIC}: the projection of ${target} for ${requester} did not re-derive identically; a view the system cannot re-derive is a view it must not serve (D-448)` };
    }
    return first;
  }

  receiptsOf(target?: string): ViewReceipt[] {
    return this.receipts.filter((r) => target === undefined || r.target === target);
  }

  scopeOf(target: string, principal: string): DisclosureScopeRow | null {
    return this.scopes.get(scopeRowId(target, principal)) ?? null;
  }

  scopeList(): DisclosureScopeRow[] {
    return [...this.scopes.values()].sort((a, b) => (a.target < b.target ? -1 : a.target > b.target ? 1 : a.principal < b.principal ? -1 : 1));
  }

  /** The headless read: scopes + receipts (the audit trail), as text. */
  read(): { scopes: DisclosureScopeRow[]; receipts: ViewReceipt[]; rendered: string } {
    return { scopes: this.scopeList(), receipts: this.receipts, rendered: renderAperture(this.scopeList(), this.receipts) };
  }

  private persist(r: ViewReceipt): boolean {
    this.receipts.push(r);
    return true;
  }
}
