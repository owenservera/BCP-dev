// vivim.law — invocation.ts
// D-452 (Ω-12, spec paper `D-444`, re-materialized): invocation — nothing
// runs without a frame. Every invocation of every capability carries an
// explicit frame — who calls, on whose behalf, which op, in what scope, under
// which authority — resolved through the law gate before anything runs.
//
// The law of this module:
//   the frame         {caller, behalf?, op, scope, authority, intentRef?} —
//                     behalf defaults to caller (the implicit deputy is the
//                     bug this layer kills); authority is consentRef |
//                     standingRef | root-act (declared, root only — an
//                     exemption is still a frame, so root gets a frame KIND,
//                     never a pass)
//   re-resolution     authority resolves from the LIVE rows at EVERY check —
//                     a cached consent is a stale consent. This is
//                     structural: checkInvocation takes the authority rows as
//                     inputs and holds ZERO module state; the wiring passes
//                     the live registries on every call
//   the refusals      INVOKE_FRAME_MISSING (unframed EXTERNAL_MUTATION) ·
//                     INVOKE_FRAME_INCOMPLETE (missing elements) ·
//                     INVOKE_UNKNOWN_OP (not in the capability graph) ·
//                     INVOKE_SCOPE_EXCEEDED (outside the declared scope) ·
//                     INVOKE_AUTHORITY_UNRESOLVED (no live consent, standing,
//                     or declared root act — the sentence carries the reason) ·
//                     INVOKE_DEPUTY_CHAIN_BROKEN (behalf ≠ caller with no
//                     live delegation or standing)
//   the pairing law   every EXECUTED :res row resolves to exactly one inv
//                     row and vice versa — the audit fold's drift findings
//                     are INVOKE_PAIRING_DRIFT, loud and ledgered, never a
//                     migration
//   scope-undo        the §15 compensation set is exactly the inv rows with
//                     caller in the window — a query, not archaeology
//
// LOUD FAILURE BY CONSTRUCTION (F-INVOKE.7): zero catch blocks, zero console
// writes, zero implicit frames. READ-class ops frame best-effort (journaled
// when cited); every refusal is a sentence. The port-call layer (index.ts)
// owns persistence and journaling.
import { checkStanding, type StandingRow } from "./standing.ts";
import { canonicalJson, sha256Hex } from "./apertureprivacy.ts";

// ---- the frame --------------------------------------------------------------

export type AuthorityKind = "consent" | "standing" | "root-act";

export interface FrameAuthority {
  kind: AuthorityKind;
  /** consentRef (per-op) | standingRef (Ω-13) — root-act carries none: the
   *  declaration IS the frame kind, reserved to root callers. */
  ref?: string;
}

export interface InvocationFrame {
  caller: string;            // the requesting principal (user: | agent:)
  behalf?: string;           // the principal the effect is for (defaults to caller; a deputy names its grantor)
  op: string;                // the capability-graph-resolved op
  scope: string;             // declared scope matcher: exact | prefix-* | * (ns | capability | tile context)
  authority: FrameAuthority;
  intentRef?: string;        // the D-411 citation when the call came through the fabric
}

/** Does `pattern` (exact | prefix-* | *) match the op id — the one matcher
 *  grammar tree-wide (policy.ts / standing.ts / tokens.ts subset). */
export function scopeMatches(pattern: string, op: string): boolean {
  if (pattern === "*" || pattern === op) return true;
  if (pattern.endsWith("*")) return op.startsWith(pattern.slice(0, -1));
  return false;
}

/** The frame digest: sha256 over the canonical frame — replayable identity
 *  for the inv row and the deputy chain. */
export function frameDigest(frame: InvocationFrame): string {
  return sha256Hex(canonicalJson(frame));
}

// ---- the refusal register (D-452: sentences verbatim from the spec) --------

export const INVOKE_FRAME_MISSING = "INVOKE_FRAME_MISSING";
export const INVOKE_AUTHORITY_UNRESOLVED = "INVOKE_AUTHORITY_UNRESOLVED";
export const INVOKE_SCOPE_EXCEEDED = "INVOKE_SCOPE_EXCEEDED";
export const INVOKE_UNKNOWN_OP = "INVOKE_UNKNOWN_OP";
export const INVOKE_DEPUTY_CHAIN_BROKEN = "INVOKE_DEPUTY_CHAIN_BROKEN";
export const INVOKE_PAIRING_DRIFT = "INVOKE_PAIRING_DRIFT";
export const INVOKE_FRAME_INCOMPLETE = "INVOKE_FRAME_INCOMPLETE";
// store-door error (the LAW_POLICY_ROW_DUPLICATE class)
export const INVOKE_CAUSATION_REUSED = "INVOKE_CAUSATION_REUSED";

export const FRAME_MISSING_SENTENCE =
  "An EXTERNAL_MUTATION-class op was invoked without a frame; nothing runs on an implied 'because I hold a grant.'";
export const AUTHORITY_UNRESOLVED_SENTENCE =
  "The frame names no live consent, standing, or declared root act; authority must be pointed at, not presumed.";
export const SCOPE_EXCEEDED_SENTENCE =
  "The invocation runs outside its frame's declared scope; a frame is a promise about where the op stops.";
export const UNKNOWN_OP_SENTENCE =
  "The op does not resolve in the capability graph; one cannot frame what the system cannot name.";
export const DEPUTY_CHAIN_BROKEN_SENTENCE =
  "The on-behalf-of chain does not resolve to a live delegation or standing; borrowed authority must trace, or the call does not happen.";
export const PAIRING_DRIFT_SENTENCE =
  "An EXECUTED row and its invocation row disagree, or one is missing; execution without pairing is drift, and drift is ledgered, not tolerated.";
export function frameIncompleteSentence(missing: string[]): string {
  return `The frame is incomplete — ${missing.join(", ")} absent; a frame is a promise about who calls, for whom, which op, and where it stops.`;
}

// ---- the live authority inputs (re-resolved at EVERY check) -----------------

export interface ConsentAuthority {
  consentId: string;
  principal: string;   // whose consent (matched against behalf)
  op: string;          // the op the consent covers
  live: boolean;
}

export interface DelegationChain {
  delegator: string;   // the grantor (matched against behalf)
  delegatee: string;   // the deputy (matched against caller)
  live: boolean;
  dataReach?: "open" | "internal" | "principal" | "secret";
  chainDigest?: string;
}

export interface InvokeCheckInput {
  opClass: "EXTERNAL_MUTATION" | "READ";  // the target op's risk class
  knownOps: string[];                     // the capability graph
  consents: ConsentAuthority[];
  delegations: DelegationChain[];
  standings: StandingRow[];               // the LIVE radius rows (Ω-13) — passed fresh every check
  rootPrincipals: string[];
  now: number;
}

// ---- the inv rows (ns invoke, ids inv:<causationId>) -----------------------

export interface InvokeRow {
  kind: "invoke@1";
  id: string;            // "inv:<causationId>"
  frameDigest: string;
  verdict: "framed" | "best-effort" | "refused";
  caller: string;
  behalf: string;
  op: string;
  authorityKind: AuthorityKind;
  intentRef?: string;
  at: number;
  outcomeRef?: string;
}

/** Validate + normalize one frame. Throws INVOKE_FRAME_INCOMPLETE with the
 *  missing-element sentence — the door where framelessness becomes loud. */
export function validateFrame(frame: unknown): InvocationFrame {
  if (frame === null || typeof frame !== "object" || Array.isArray(frame)) {
    throw new Error(`${INVOKE_FRAME_INCOMPLETE}: ${frameIncompleteSentence(["the whole frame"])}`);
  }
  const f = frame as Record<string, unknown>;
  const missing: string[] = [];
  if (typeof f["caller"] !== "string" || (f["caller"] as string).length === 0) missing.push("caller");
  if (typeof f["op"] !== "string" || (f["op"] as string).length === 0) missing.push("op");
  if (typeof f["scope"] !== "string" || (f["scope"] as string).length === 0) missing.push("scope");
  const authority = f["authority"];
  let auth: FrameAuthority | undefined;
  if (authority === null || typeof authority !== "object" || typeof (authority as FrameAuthority)["kind"] !== "string") {
    missing.push("authority");
  } else {
    const a = authority as Record<string, unknown>;
    if (a["kind"] !== "consent" && a["kind"] !== "standing" && a["kind"] !== "root-act") {
      throw new Error(`${INVOKE_FRAME_INCOMPLETE}: authority.kind must be consent|standing|root-act (got ${JSON.stringify(a["kind"])})`);
    }
    auth = { kind: a["kind"] as AuthorityKind, ...(typeof a["ref"] === "string" && (a["ref"] as string).length > 0 ? { ref: a["ref"] as string } : {}) };
  }
  if (missing.length > 0) throw new Error(`${INVOKE_FRAME_INCOMPLETE}: ${frameIncompleteSentence(missing)}`);
  const out: InvocationFrame = {
    caller: f["caller"] as string,
    op: f["op"] as string,
    scope: f["scope"] as string,
    authority: auth!,
  };
  if (typeof f["behalf"] === "string" && (f["behalf"] as string).length > 0) out.behalf = f["behalf"];
  if (typeof f["intentRef"] === "string" && (f["intentRef"] as string).length > 0) out.intentRef = f["intentRef"];
  return out;
}

// ---- THE check (pure; authority re-resolves from the inputs every call) ----

export interface InvokeVerdict {
  verdict: "framed" | "best-effort" | "refused";
  code?: string;
  sentence?: string;
  frame: InvocationFrame | null;
  behalf: string;
  frameDigest: string | null;
  authorityResolved: "consent" | "standing" | "root-act" | null;
  deputyChainDigest: string | null;
  walk: string[];
  invRow: InvokeRow | null;
}

/** THE frame resolution (D-452). Pure over (frame, target, input, causationId):
 *  no cache, no memo, no module state — the caller feeds the LIVE authority
 *  rows, so a revocation between two identical calls flips the verdict at the
 *  very next check. Unframed EXTERNAL_MUTATION refuses; READ-class ops frame
 *  best-effort. Root gets a DECLARED frame kind (root-act), never an exemption. */
export function checkInvocation(
  frame: InvocationFrame | null | undefined,
  target: { op: string; opClass: "EXTERNAL_MUTATION" | "READ" },
  input: InvokeCheckInput,
  causationId: string,
): InvokeVerdict {
  const walk: string[] = [`invoke.check ${target.op} (${target.opClass}) — causationId ${causationId}`];
  const refuse = (code: string, sentence: string, f: InvocationFrame | null, authority: InvokeVerdict["authorityResolved"]): InvokeVerdict => {
    walk.push(`verdict: refused ${code} — ${sentence}`);
    return {
      verdict: "refused", code, sentence, frame: f,
      behalf: f?.behalf ?? f?.caller ?? "",
      frameDigest: f !== null ? frameDigest(f) : null,
      authorityResolved: authority,
      deputyChainDigest: null,
      walk,
      invRow: f !== null
        ? { kind: "invoke@1", id: `inv:${causationId}`, frameDigest: frameDigest(f), verdict: "refused", caller: f.caller, behalf: f.behalf ?? f.caller, op: target.op, authorityKind: f.authority.kind, ...(f.intentRef !== undefined ? { intentRef: f.intentRef } : {}), at: input.now }
        : null,
    };
  };
  if (frame === null || frame === undefined) {
    if (target.opClass === "EXTERNAL_MUTATION") {
      walk.push("no frame carried — an EXTERNAL_MUTATION never runs on an implied 'because I hold a grant'");
      return refuse(INVOKE_FRAME_MISSING, FRAME_MISSING_SENTENCE, null, null);
    }
    walk.push("no frame carried on a READ-class op — best-effort, journaled when cited");
    return { verdict: "best-effort", frame: null, behalf: "", frameDigest: null, authorityResolved: null, deputyChainDigest: null, walk, invRow: null };
  }
  let f: InvocationFrame;
  try {
    f = validateFrame(frame);
  } catch (e) {
    walk.push(String(e));
    return refuse(INVOKE_FRAME_INCOMPLETE, String(e).replace(/^INVOKE_FRAME_INCOMPLETE: /, ""), null, null);
  }
  const behalf = f.behalf ?? f.caller;
  walk.push(`frame: caller ${f.caller}, behalf ${behalf}, scope ${f.scope}, authority ${f.authority.kind}${f.authority.ref !== undefined ? ` ${f.authority.ref}` : ""}${f.intentRef !== undefined ? `, intentRef ${f.intentRef}` : ""}`);
  // the capability graph: one cannot frame what the system cannot name
  if (!input.knownOps.includes(target.op)) {
    walk.push(`op ${target.op} does not resolve in the capability graph (${input.knownOps.length} known)`);
    return refuse(INVOKE_UNKNOWN_OP, UNKNOWN_OP_SENTENCE, f, null);
  }
  // the declared scope: a frame is a promise about where the op stops
  if (!scopeMatches(f.scope, target.op)) {
    walk.push(`op ${target.op} outside declared scope ${f.scope}`);
    return refuse(INVOKE_SCOPE_EXCEEDED, SCOPE_EXCEEDED_SENTENCE, f, null);
  }
  // authority — re-resolved from the LIVE inputs, every check, never cached
  let authorityResolved: InvokeVerdict["authorityResolved"] = null;
  if (f.authority.kind === "consent") {
    const c = input.consents.find((x) => x.consentId === f.authority!.ref && x.live);
    if (c === undefined) {
      walk.push(`consent ${f.authority.ref ?? "(none named)"} resolves to no live grant`);
      return refuse(INVOKE_AUTHORITY_UNRESOLVED, AUTHORITY_UNRESOLVED_SENTENCE, f, null);
    }
    if (c.principal !== behalf || !scopeMatches(c.op, target.op)) {
      walk.push(`consent ${c.consentId} is live but does not cover this invocation (principal ${c.principal} vs behalf ${behalf}, op ${c.op})`);
      return refuse(INVOKE_AUTHORITY_UNRESOLVED, AUTHORITY_UNRESOLVED_SENTENCE, f, null);
    }
    authorityResolved = "consent";
    walk.push(`authority: consent ${c.consentId} live, covers behalf ${behalf} op ${target.op}`);
  } else if (f.authority.kind === "standing") {
    const row = input.standings.find((s) => s.standingId === f.authority!.ref);
    if (row === undefined) {
      walk.push(`standing ${f.authority.ref ?? "(none named)"} resolves to no radius row`);
      return refuse(INVOKE_AUTHORITY_UNRESOLVED, AUTHORITY_UNRESOLVED_SENTENCE, f, null);
    }
    const check = checkStanding(row, { op: target.op, now: input.now });
    if (check.verdict !== "standing") {
      walk.push(`standing ${row.standingId} refuses: ${check.code} — ${check.sentence}`);
      return refuse(INVOKE_AUTHORITY_UNRESOLVED, `${AUTHORITY_UNRESOLVED_SENTENCE} (the standing refuses: ${check.sentence})`, f, null);
    }
    authorityResolved = "standing";
    walk.push(`authority: standing ${row.standingId} live, covers op ${target.op} (mode ${row.approvalMode})`);
  } else {
    // root-act: a DECLARED frame kind, never an exemption — root frames itself, or refuses like everyone else
    if (!input.rootPrincipals.includes(f.caller)) {
      walk.push(`root-act declared by non-root caller ${f.caller}`);
      return refuse(INVOKE_AUTHORITY_UNRESOLVED, `${AUTHORITY_UNRESOLVED_SENTENCE} (a declared root act is a frame kind reserved to root — not a pass anyone can claim)`, f, null);
    }
    if (behalf !== f.caller) {
      walk.push(`root-act on behalf of ${behalf} — root acts for itself; deputies carry chains or standings`);
      return refuse(INVOKE_AUTHORITY_UNRESOLVED, `${AUTHORITY_UNRESOLVED_SENTENCE} (a declared root act names root and no one else)`, f, null);
    }
    authorityResolved = "root-act";
    walk.push(`authority: declared root act by ${f.caller} — a frame kind, not an exemption`);
  }
  // the deputy chain: behalf ≠ caller requires a live delegation OR the
  // resolved standing itself (the radius IS the deputy authority)
  let deputyChainDigest: string | null = null;
  if (behalf !== f.caller) {
    const chain = input.delegations.find((d) => d.delegatee === f.caller && d.delegator === behalf && d.live);
    const standingCovers = authorityResolved === "standing"
      && input.standings.some((s) => s.standingId === f.authority!.ref && s.grantee === f.caller && s.principal === behalf);
    if (chain !== undefined) {
      deputyChainDigest = chain.chainDigest ?? sha256Hex(canonicalJson({ delegator: chain.delegator, delegatee: chain.delegatee }));
      walk.push(`deputy chain live: ${f.caller} for ${behalf} (digest ${deputyChainDigest.slice(0, 16)})`);
    } else if (standingCovers) {
      deputyChainDigest = f.authority.ref!;
      walk.push(`deputy authority is the standing ${f.authority.ref} (grantee ${f.caller}, principal ${behalf})`);
    } else {
      walk.push(`no live delegation or standing traces ${f.caller} to ${behalf}`);
      return refuse(INVOKE_DEPUTY_CHAIN_BROKEN, DEPUTY_CHAIN_BROKEN_SENTENCE, f, authorityResolved);
    }
  }
  const digest = frameDigest(f);
  walk.push(`verdict: framed (frameDigest ${digest.slice(0, 16)})`);
  return {
    verdict: "framed", frame: f, behalf, frameDigest: digest, authorityResolved, deputyChainDigest, walk,
    invRow: {
      kind: "invoke@1", id: `inv:${causationId}`, frameDigest: digest, verdict: "framed",
      caller: f.caller, behalf, op: target.op, authorityKind: f.authority.kind,
      ...(f.intentRef !== undefined ? { intentRef: f.intentRef } : {}),
      at: input.now,
    },
  };
}

// ---- the inv ledger + the pairing fold --------------------------------------

/**
 * The invocation ledger: one inv row per causationId (ns invoke, ids
 * inv:<causationId>). The pairing law's subject — the audit fold below is
 * its verifier; drift is a finding, never a migration.
 */
export class InvocationLedger {
  private rows = new Map<string, InvokeRow>();

  record(row: InvokeRow): InvokeRow {
    if (this.rows.has(row.id)) {
      throw new Error(`INVOKE_CAUSATION_REUSED: inv row ${row.id} already exists — one invocation row per execution, causation ids never repeat`);
    }
    this.rows.set(row.id, row);
    return row;
  }

  /** Simulated corruption for the audit falsifier: remove one row. */
  corrupt(id: string): boolean {
    return this.rows.delete(id);
  }

  get(id: string): InvokeRow | null {
    return this.rows.get(id) ?? null;
  }

  list(): InvokeRow[] {
    return [...this.rows.values()].sort((a, b) => (a.id < b.id ? -1 : 1));
  }

  /** §15 scope-undo evidence: the compensation set is exactly the inv rows
   *  with caller in the span — a query, not archaeology. */
  undoSet(caller: string, span: { from: number; to: number }): InvokeRow[] {
    return this.list().filter((r) => r.caller === caller && r.at >= span.from && r.at <= span.to);
  }
}

/** An EXECUTED :res row (the D-411 intent fabric's outcome citation). */
export interface ExecResRow {
  causationId: string;
  intentRef?: string;
  outcomeRef?: string;
  at: number;
}

export interface PairingDriftRow {
  kind: "invoke.drift@1";
  causationId: string;
  side: "exec" | "inv";       // which side is the orphan
  sentence: string;
}

export interface PairingAuditResult {
  paired: number;
  drift: PairingDriftRow[];
  refused: boolean;           // any drift makes the audit itself a refusal
  refusedWith: typeof INVOKE_PAIRING_DRIFT | undefined;
}

/** The pairing fold (invoke.audit@1's core): every EXECUTED row resolves to
 *  exactly one inv row, and vice versa. Drift is loud and ledgered — one
 *  finding per orphan, naming the side and the causationId. */
export function auditPairing(execRows: ExecResRow[], invRows: InvokeRow[]): PairingAuditResult {
  const invIds = new Set(invRows.map((r) => r.id.replace(/^inv:/, "")));
  const execIds = new Set(execRows.map((r) => r.causationId));
  const drift: PairingDriftRow[] = [];
  for (const exec of [...execRows].sort((a, b) => (a.causationId < b.causationId ? -1 : 1))) {
    if (!invIds.has(exec.causationId)) {
      drift.push({ kind: "invoke.drift@1", causationId: exec.causationId, side: "exec", sentence: `${PAIRING_DRIFT_SENTENCE} (EXECUTED :res row for causationId ${exec.causationId} has no inv row)` });
    }
  }
  for (const inv of invRows) {
    const cid = inv.id.replace(/^inv:/, "");
    if (!execIds.has(cid)) {
      drift.push({ kind: "invoke.drift@1", causationId: cid, side: "inv", sentence: `${PAIRING_DRIFT_SENTENCE} (inv row for causationId ${cid} has no EXECUTED :res row)` });
    }
  }
  return { paired: execIds.size - drift.filter((d) => d.side === "exec").length, drift, refused: drift.length > 0, refusedWith: drift.length > 0 ? INVOKE_PAIRING_DRIFT : undefined };
}
