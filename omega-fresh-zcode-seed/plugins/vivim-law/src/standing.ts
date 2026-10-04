// vivim.law — standing.ts
// D-453 (Ω-13, spec paper `D-445`, re-materialized): standing — yes once,
// precisely, and it holds. Authority acquires duration: a principal's durable
// "this agent may do X in context Y" becomes a standing row — named, scoped,
// expiring, revocable, inspectable — so consent stops being a tax on every
// operation and no grant outlives the moment it was granted for.
//
// The law of this module:
//   expiresAt        REQUIRED — no perpetual standing (STANDING_PERPETUAL_
//                    REFUSED at the store door; authority without duration
//                    is not standing, it is surrender)
//   expiry           a REFUSAL, not a cleanup job — the lapsed radius refuses
//                    STANDING_EXPIRED naming the renewal path; lapsed rows are
//                    evidence, never deleted
//   renewal          a FRESH grant citing the old (renewedFrom — the chain
//                    visible); extending in place refuses
//                    STANDING_RENEWAL_AS_EXTENSION
//   revocation       immediate and loud — revokedAt lands now, the next check
//                    refuses STANDING_REVOKED; a second revoke refuses loudly
//   resolution       gate-time, never cached: checkStanding is a pure function
//                    of (row, target, now) — Ω-12's frames re-resolve through
//                    it at EVERY check
//   escalation       ONE sentence-shaped card with a deadline; unanswered past
//                    deadline it dies loudly (STANDING_ESCALATION_STALLED) —
//                    never auto-yes
//
// LOUD FAILURE BY CONSTRUCTION (F-STANDING.7): zero catch blocks, zero console
// writes, zero auto-yes paths. Every anomaly is a named refusal with a
// sentence, or a ledgered escalation row. The port-call layer (index.ts) owns
// persistence and journaling — the same import-safe split conflict.ts and
// forbidden.ts established.
import { createHash } from "node:crypto";

// ---- the row (§14's seven fields: principal, capability, scope, duration,
// approval mode, revocation, evidence — the row IS the registry) ------------

export type ApprovalMode = "ask" | "auto" | "auto-with-proof";
export const APPROVAL_MODES: ApprovalMode[] = ["ask", "auto", "auto-with-proof"];

export interface StandingRow {
  standingId: string;            // "standing:<grantId>" — stable hash of (principal, grantee, scope, context)
  principal: string;             // the grantor (whose authority this zones)
  grantee: string;               // who may act under it (usually agent:)
  scope: string;                 // op-class/capability grammar: exact | prefix-* | * (the tokens.ts subset)
  context?: string;              // matcher: ns | tile | time-window | proof-condition
  approvalMode: ApprovalMode;
  expiresAt: number;             // REQUIRED — no perpetual standing
  grantedAt: number;
  revokedAt?: number;            // set the moment revoke lands — immediate
  revokeReason?: string;
  consentRef?: string;           // the consent that created this standing (provenance)
  evidence: string[];            // what the grantor saw when granting
  renewedFrom?: string;          // renewal cites the old — the chain visible
}

// ---- the refusal register (D-453: sentences verbatim from the spec) --------

export const STANDING_EXPIRED = "STANDING_EXPIRED";
export const STANDING_REVOKED = "STANDING_REVOKED";
export const STANDING_SCOPE_EXCEEDED = "STANDING_SCOPE_EXCEEDED";
export const STANDING_PERPETUAL_REFUSED = "STANDING_PERPETUAL_REFUSED";
export const STANDING_CONTEXT_UNMATCHED = "STANDING_CONTEXT_UNMATCHED";
export const STANDING_ESCALATION_STALLED = "STANDING_ESCALATION_STALLED";
export const STANDING_RENEWAL_AS_EXTENSION = "STANDING_RENEWAL_AS_EXTENSION";
export const STANDING_SCOPE_INVALID = "STANDING_SCOPE_INVALID";
// store-door errors (the LAW_POLICY_ROW_INVALID class — named, at the door)
export const STANDING_ROW_INVALID = "STANDING_ROW_INVALID";
export const STANDING_UNKNOWN = "STANDING_UNKNOWN";

export function expiredSentence(expiresAt: number): string {
  return `The radius lapsed at ${expiresAt}; it held exactly as long as it was granted, and holding longer would be a grant nobody made. Renew it with a fresh ceremony citing this one.`;
}
export function revokedSentence(revokedAt: number, reason: string): string {
  return `The radius was revoked ${revokedAt} — ${reason}; the gate does not honor dead authority.`;
}
export function scopeExceededSentence(scope: string): string {
  return `The request exceeds the radius's scope (${scope}); escalation is one sentence away, and guessing is not on the menu.`;
}
export const PERPETUAL_SENTENCE =
  "The grant names no expiry; authority without duration is not standing, it is surrender.";
export function contextUnmatchedSentence(context: string): string {
  return `The context does not match (${context}); a radius is a place and a time, not a passport.`;
}
export const ESCALATION_STALLED_SENTENCE =
  "The escalation card went unanswered past its deadline; the request dies loudly — an ignored question is never a yes.";
export const RENEWAL_AS_EXTENSION_SENTENCE =
  "A lapsed standing cannot be extended in place; renewal is a new grant citing the old — the chain stays visible.";

// ---- the grantId grammar (stable hash — same grant, same id) ---------------

export function canonicalJson(value: unknown): string {
  if (value === null || typeof value !== "object") return JSON.stringify(value) ?? "null";
  if (Array.isArray(value)) return `[${value.map(canonicalJson).join(",")}]`;
  const rec = value as Record<string, unknown>;
  return `{${Object.keys(rec).sort().map((k) => `${JSON.stringify(k)}:${canonicalJson(rec[k])}`).join(",")}}`;
}

export function sha256Hex(s: string): string {
  return createHash("sha256").update(s).digest("hex");
}

/** The stable grantId: hash of (grantor, grantee, scope, context) — a renewal
 *  with a fresh expiry but identical shape would collide, so renewals MUST
 *  vary the shape or take the derived id (they cite the old via renewedFrom). */
export function grantIdOf(grant: { principal: string; grantee: string; scope: string; context?: string }, salt?: string): string {
  return `standing:${sha256Hex(canonicalJson({ ...grant, ...(salt !== undefined ? { salt } : {}) })).slice(0, 24)}`;
}

// ---- the scope grammar (the D-328b subset discipline: grantee ⊑ grantor) ----

/** Does the scope grammar cover the op? exact | prefix-* | * — the same idiom
 *  as policy.ts/conflict.ts scopeMatches (one matcher grammar tree-wide). */
export function scopeCovers(scope: string, op: string): boolean {
  if (scope === "*" || scope === op) return true;
  if (scope.endsWith("*")) return op.startsWith(scope.slice(0, -1));
  return false;
}

/** A valid scope grammar: non-empty, no whitespace, at most one trailing *,
 *  and a real op-ish body before it (op ids carry dots and @versions).
 *  Throws STANDING_SCOPE_INVALID. */
export function validateScope(scope: string): string {
  if (typeof scope !== "string" || scope.length === 0) {
    throw new Error(`STANDING_SCOPE_INVALID: scope must be a non-empty op grammar (got ${JSON.stringify(scope)})`);
  }
  if (/\s/.test(scope)) throw new Error(`STANDING_SCOPE_INVALID: scope "${scope}" contains whitespace`);
  if (scope !== "*" && !/^[a-zA-Z0-9:@_\-.]+(\*)?$/.test(scope)) {
    throw new Error(`STANDING_SCOPE_INVALID: scope "${scope}" is not an op grammar (exact op id, prefix-*, or *)`);
  }
  return scope;
}

/** Context match: an absent context is any context; otherwise exact or
 *  prefix (a radius is a place and a time, not a passport). */
export function contextMatches(context: string | undefined, target: string | undefined): boolean {
  if (context === undefined || context === "") return true;
  if (target === undefined) return false;
  return target === context || (context.endsWith("*") && target.startsWith(context.slice(0, -1)));
}

// ---- the check (gate-time, pure, never cached) -----------------------------

export interface StandingCheckInput {
  op?: string;            // the op the caller wants to run under this radius
  context?: string;       // the invocation's context (ns | tile | window)
  proofPassed?: boolean;  // the auto-with-proof evidence condition (default: passed)
  now: number;            // the clock — expiry is a refusal, not a cleanup job
}

export interface StandingCheck {
  verdict: "standing" | "ask" | "refused";
  code?: typeof STANDING_EXPIRED | typeof STANDING_REVOKED | typeof STANDING_SCOPE_EXCEEDED | typeof STANDING_CONTEXT_UNMATCHED;
  sentence?: string;
  row: StandingRow;
  mode: ApprovalMode;
  walk: string[];
}

/** THE resolution (D-453). A pure function of (row, target, now): revoked →
 *  STANDING_REVOKED (immediate — revokedAt always ≤ now by construction);
 *  lapsed → STANDING_EXPIRED; scope/context mismatch → their sentences;
 *  auto-with-proof with a failing proof → verdict "ask" (the zoned yes
 *  without the silent yes — the radius holds, the ceremony prompts). */
export function checkStanding(row: StandingRow, target: StandingCheckInput): StandingCheck {
  const walk: string[] = [`standing ${row.standingId}: grantee ${row.grantee}, scope ${row.scope}, expiresAt ${row.expiresAt}, now ${target.now}`];
  if (row.revokedAt !== undefined) {
    walk.push(`revoked at ${row.revokedAt} (${row.revokeReason ?? "no reason recorded"}) — the gate does not honor dead authority`);
    walk.push(`verdict: refused STANDING_REVOKED`);
    return { verdict: "refused", code: STANDING_REVOKED, sentence: revokedSentence(row.revokedAt, row.revokeReason ?? "no reason recorded"), row, mode: row.approvalMode, walk };
  }
  if (target.now >= row.expiresAt) {
    walk.push(`lapsed at ${row.expiresAt} — expiry is a refusal, not a cleanup job`);
    walk.push(`verdict: refused STANDING_EXPIRED`);
    return { verdict: "refused", code: STANDING_EXPIRED, sentence: expiredSentence(row.expiresAt), row, mode: row.approvalMode, walk };
  }
  if (target.op !== undefined && !scopeCovers(row.scope, target.op)) {
    walk.push(`op ${target.op} outside scope ${row.scope}`);
    walk.push(`verdict: refused STANDING_SCOPE_EXCEEDED`);
    return { verdict: "refused", code: STANDING_SCOPE_EXCEEDED, sentence: scopeExceededSentence(row.scope), row, mode: row.approvalMode, walk };
  }
  if (target.context !== undefined && !contextMatches(row.context, target.context)) {
    walk.push(`context ${target.context} does not match ${row.context ?? "(any)"}`);
    walk.push(`verdict: refused STANDING_CONTEXT_UNMATCHED`);
    return { verdict: "refused", code: STANDING_CONTEXT_UNMATCHED, sentence: contextUnmatchedSentence(row.context ?? "(any)"), row, mode: row.approvalMode, walk };
  }
  if (row.approvalMode === "auto-with-proof" && target.proofPassed === false) {
    walk.push(`auto-with-proof: the proof condition FAILED — the radius falls to ask (never a silent yes)`);
    walk.push(`verdict: ask`);
    return { verdict: "ask", row, mode: row.approvalMode, walk };
  }
  walk.push(`radius covers${row.approvalMode === "ask" ? " (mode ask — the ceremony prompts, the radius holds)" : ""}`);
  walk.push(`verdict: standing`);
  return { verdict: "standing", row, mode: row.approvalMode, walk };
}

// ---- the store (append-only trust history: lapsed rows are evidence) -------

/** Validate + normalize one standing row. Throws STANDING_ROW_INVALID on
 *  shape, STANDING_PERPETUAL_REFUSED when expiresAt is absent — the door is
 *  where perpetual authority dies. */
export function validateStanding(row: unknown): StandingRow {
  if (row === null || typeof row !== "object" || Array.isArray(row)) {
    throw new Error("STANDING_ROW_INVALID: row must be an object");
  }
  const r = row as Record<string, unknown>;
  const standingId = reqStr(r["standingId"], "standingId");
  const principal = reqStr(r["principal"], "principal");
  const grantee = reqStr(r["grantee"], "grantee");
  const scope = validateScope(reqStr(r["scope"], "scope"));
  const expiresAt = r["expiresAt"];
  if (typeof expiresAt !== "number" || !Number.isFinite(expiresAt)) {
    throw new Error(`${STANDING_PERPETUAL_REFUSED}: ${PERPETUAL_SENTENCE} (expiresAt must be a finite epoch-ms number; got ${JSON.stringify(expiresAt)})`);
  }
  const grantedAt = typeof r["grantedAt"] === "number" && Number.isFinite(r["grantedAt"]) ? r["grantedAt"] : 0;
  const modeRaw = r["approvalMode"] ?? "ask";
  if (typeof modeRaw !== "string" || !APPROVAL_MODES.includes(modeRaw as ApprovalMode)) {
    throw new Error(`STANDING_ROW_INVALID: approvalMode must be one of ${APPROVAL_MODES.join("|")} (got ${JSON.stringify(modeRaw)})`);
  }
  const evidence = Array.isArray(r["evidence"]) ? (r["evidence"] as unknown[]).filter((e): e is string => typeof e === "string") : [];
  const out: StandingRow = {
    standingId, principal, grantee, scope,
    approvalMode: modeRaw as ApprovalMode,
    expiresAt, grantedAt, evidence,
  };
  if (r["context"] !== undefined && r["context"] !== null) out.context = reqStr(r["context"], "context");
  if (r["revokedAt"] !== undefined) {
    if (typeof r["revokedAt"] !== "number" || !Number.isFinite(r["revokedAt"])) {
      throw new Error("STANDING_ROW_INVALID: revokedAt must be a finite epoch-ms number");
    }
    out.revokedAt = r["revokedAt"];
  }
  if (r["revokeReason"] !== undefined) out.revokeReason = reqStr(r["revokeReason"], "revokeReason");
  if (r["consentRef"] !== undefined) out.consentRef = reqStr(r["consentRef"], "consentRef");
  if (r["renewedFrom"] !== undefined) out.renewedFrom = reqStr(r["renewedFrom"], "renewedFrom");
  return out;
}

function reqStr(v: unknown, field: string): string {
  if (typeof v !== "string" || v.length === 0) {
    throw new Error(`STANDING_ROW_INVALID: ${field} must be a non-empty string (got ${JSON.stringify(v)})`);
  }
  return v;
}

/**
 * The standing registry. Memory-first (the conflict-store posture): the LIVE
 * writers are standing.grant@1 / standing.revoke@1; the RESTORE writer is the
 * boot reload. Persistence lives in index.ts (the port-call layer).
 */
export class StandingStore {
  private rows = new Map<string, StandingRow>();
  private lastAppended: string | null = null;

  /** Grant a radius. Throws STANDING_PERPETUAL_REFUSED (no expiresAt),
   *  STANDING_ROW_INVALID (malformed), STANDING_RENEWAL_AS_EXTENSION (an id
   *  that already exists — live OR lapsed: renewal is a fresh citing grant,
   *  never an in-place extension). */
  grant(row: StandingRow): StandingRow {
    const clean = validateStanding(row);
    if (this.rows.has(clean.standingId)) {
      const prior = this.rows.get(clean.standingId)!;
      const state = prior.revokedAt !== undefined ? "revoked" : prior.expiresAt <= (clean.grantedAt || Date.now()) ? "lapsed" : "live";
      throw new Error(
        `${STANDING_RENEWAL_AS_EXTENSION}: ${RENEWAL_AS_EXTENSION_SENTENCE} (standing "${clean.standingId}" already exists, ${state} since ${prior.grantedAt})`,
      );
    }
    this.rows.set(clean.standingId, clean);
    this.lastAppended = clean.standingId;
    return clean;
  }

  /** The rollback primitive: remove the row the ceremony JUST appended. */
  rollback(id: string): boolean {
    if (this.lastAppended !== id) return false;
    this.rows.delete(id);
    this.lastAppended = null;
    return true;
  }

  /** Revoke a radius — immediate and loud. Throws STANDING_UNKNOWN (no such
   *  row) and STANDING_REVOKED on a SECOND revoke (the gate does not honor
   *  dead authority twice — never a silent idempotent success). */
  revoke(standingId: string, opts: { reason?: string; now: number }): StandingRow {
    const row = this.rows.get(standingId);
    if (row === undefined) {
      throw new Error(`STANDING_UNKNOWN: no standing "${standingId}" — the radius list is the registry, nothing else`);
    }
    if (row.revokedAt !== undefined) {
      throw new Error(`${STANDING_REVOKED}: ${revokedSentence(row.revokedAt, row.revokeReason ?? "no reason recorded")} — a second revoke refuses loudly (nothing is idempotent about dead authority)`);
    }
    row.revokedAt = opts.now;
    row.revokeReason = opts.reason ?? "revoked by the grantor";
    return row;
  }

  /** Renewal: a FRESH row citing the old via renewedFrom. The old may be
   *  lapsed (that is the point); the new id salts on the old so the chain
   *  never collides with its root (grant enforces the no-extension law). */
  renew(oldId: string, next: Omit<StandingRow, "standingId" | "renewedFrom">, salt?: string): StandingRow {
    const old = this.rows.get(oldId);
    if (old === undefined) {
      throw new Error(`STANDING_UNKNOWN: cannot renew "${oldId}" — no such standing`);
    }
    const granted = validateStanding({
      ...next,
      standingId: grantIdOf({ principal: next.principal, grantee: next.grantee, scope: next.scope, context: next.context }, salt ?? oldId),
    } as StandingRow);
    const fresh = { ...granted, renewedFrom: oldId };
    return this.grant(fresh);
  }

  get(id: string): StandingRow | null {
    return this.rows.get(id) ?? null;
  }

  size(): number {
    return this.rows.size;
  }

  list(): StandingRow[] {
    return [...this.rows.values()].sort((a, b) => (a.standingId < b.standingId ? -1 : a.standingId > b.standingId ? 1 : 0));
  }

  /** The §14 radius view: every radius for a principal (grantor or grantee),
   *  named, scoped, expiring, revocation state on the row — a query, as rows. */
  listFor(principal: string): StandingRow[] {
    return this.list().filter((r) => r.principal === principal || r.grantee === principal);
  }

  /** The live view Ω-12 re-resolves at every check (never cached). */
  liveRows(now: number): StandingRow[] {
    return this.list().filter((r) => r.revokedAt === undefined && now < r.expiresAt);
  }
}

// ---- the escalation ceremony (ONE sentence-shaped card, loud stall) --------

export interface EscalationRequest {
  principal: string;   // whose authority is being asked for
  grantee?: string;    // who would act under it
  scope: string;       // the requested radius
  reason: string;      // why the system is asking
  deadline: number;    // unanswered past this → STANDING_ESCALATION_STALLED
  requestedAt: number;
}

export interface EscalationRow {
  kind: "standing.escalation@1";
  escalationId: string;      // "escalation:<seq>" — one id per card
  requestKey: string;        // principal|grantee|scope — idempotence: ONE card per ask
  principal: string;
  grantee?: string;
  scope: string;
  reason: string;
  sentence: string;          // the single sentence (§14: it does not guess and does not nag)
  deadline: number;
  requestedAt: number;
  answeredAt?: number;
  answer?: "yes" | "no";
}

/** The one sentence: principal, scope, reason — a card, not a prompt storm. */
export function escalationSentence(req: EscalationRequest): string {
  return `May ${req.principal} let ${req.grantee ?? "the requester"} do ${req.scope} — ${req.reason}? Answer before ${req.deadline}; an ignored question is never a yes.`;
}

/**
 * The escalation book: surface() ONE card per request (a second surface of
 * the same ask returns the SAME card — the single-card law), answer() records
 * the ceremony, stalled() names every card left unanswered past its deadline.
 * A stalled card authorizes NOTHING — checkStanding never consults this book.
 */
export class EscalationBook {
  private rows = new Map<string, EscalationRow>();
  private seq = 0;

  surface(req: EscalationRequest): EscalationRow {
    const key = `${req.principal}|${req.grantee ?? ""}|${req.scope}`;
    for (const row of this.rows.values()) {
      if (row.requestKey === key && row.answeredAt === undefined) return row; // ONE card, not a storm
    }
    const row: EscalationRow = {
      kind: "standing.escalation@1",
      escalationId: `escalation:${String(++this.seq).padStart(6, "0")}`,
      requestKey: key,
      principal: req.principal,
      ...(req.grantee !== undefined ? { grantee: req.grantee } : {}),
      scope: req.scope,
      reason: req.reason,
      sentence: escalationSentence(req),
      deadline: req.deadline,
      requestedAt: req.requestedAt,
    };
    this.rows.set(row.escalationId, row);
    return row;
  }

  answer(escalationId: string, answer: "yes" | "no", now: number): EscalationRow {
    const row = this.rows.get(escalationId);
    if (row === undefined) throw new Error(`STANDING_UNKNOWN: no escalation "${escalationId}"`);
    if (now > row.deadline) {
      throw new Error(`${STANDING_ESCALATION_STALLED}: ${ESCALATION_STALLED_SENTENCE} (deadline ${row.deadline} passed at ${now})`);
    }
    row.answeredAt = now;
    row.answer = answer;
    return row;
  }

  /** Every card unanswered past its deadline — the loud stall, never auto-yes. */
  stalled(now: number): EscalationRow[] {
    return [...this.rows.values()].filter((r) => r.answeredAt === undefined && now > r.deadline).sort((a, b) => (a.escalationId < b.escalationId ? -1 : 1));
  }

  list(): EscalationRow[] {
    return [...this.rows.values()].sort((a, b) => (a.escalationId < b.escalationId ? -1 : 1));
  }
}

// ---- the vault record mapping ----------------------------------------------

export function toVaultRecord(row: StandingRow): StandingRow {
  return { ...row };
}

export function fromVaultRecord(data: unknown): StandingRow {
  return validateStanding(data);
}
