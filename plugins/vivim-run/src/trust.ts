// vivim-run/src/trust.ts (D-444, Ω-4 — the trust substrate, re-materialized spec paper D-428)
//
// Trust is the mesh that survives the hardware: principal records that can
// never be reused (D-412's floor, inherited), keys with LINEAGE — born in
// ceremonies, windowed in time, verified at their signing time — and
// revocations that scar forward instead of deleting, so trust moves forward
// without invalidating backward (vision §19). Key MATERIAL lives in sealed
// storage, never in the vault: these rows are testimony about trust, never
// the instrument of it.
import { createHash } from "node:crypto";

export const TRUST_KEYS_NS = "trust.keys";  // key-lineage rows (retention: forever, tombstones included)
export const TRUST_MESH_NS = "trust.mesh";  // pairing rows (retention: forever)

export const TRUST_PRINCIPAL_UNRESOLVABLE = "TRUST_PRINCIPAL_UNRESOLVABLE";
export const TRUST_KEY_EXPIRED = "TRUST_KEY_EXPIRED";
export const TRUST_FINGERPRINT_MISMATCH = "TRUST_FINGERPRINT_MISMATCH";
export const TRUST_DUPLICATE_BIND = "TRUST_DUPLICATE_BIND";
export const TRUST_CONSENT_STALE = "TRUST_CONSENT_STALE";
export const TRUST_PAIRING_UNWITNESSED = "TRUST_PAIRING_UNWITNESSED";
export const TRUST_KEY_UNBOUND = "TRUST_KEY_UNBOUND";
export const TRUST_SIGNATURE_INVALID = "TRUST_SIGNATURE_INVALID";
export const PRINCIPAL_REUSED = "PRINCIPAL_REUSED"; // D-412's own code — inherited with the floor

// ---- the D-412 floor (inherited, mirrored at the trust seat — ring-first) ----

/** The D-412 principal record shape. The LIVE rows live in ns `principal`
 *  (writer vivim.law, retention forever); the trust substrate resolves
 *  THROUGH the record, never around it — this mirror is the derivation
 *  source the same way the badge/watch registries are. */
export interface PrincipalRow {
  principal: string;
  kind: string;
  registeredAt: number;
  state: "active" | "retired";
  retiredAt?: number;
  generation: number; // bumped on every record append (register=1, retire=2)
}

export type PrincipalOutcome = { ok: true; row: PrincipalRow; idempotent: boolean } | { ok: false; code: string; sentence: string };

/** D-412's law, mirrored: register is idempotent while active; a retired id
 *  is FOREVER — re-registering refuses PRINCIPAL_REUSED (F-TRUST.1 inherited). */
export function registerPrincipal(
  spec: { principal: string; kind?: string; at: number },
  existing: ReadonlyMap<string, PrincipalRow>,
): PrincipalOutcome {
  if (typeof spec.principal !== "string" || spec.principal.length === 0) {
    return { ok: false, code: TRUST_PRINCIPAL_UNRESOLVABLE, sentence: `${TRUST_PRINCIPAL_UNRESOLVABLE}: a principal must be a non-empty string — there is no record to resolve (D-412, inherited by D-444)` };
  }
  const prior = existing.get(spec.principal);
  if (prior !== undefined && prior.state === "retired") {
    return { ok: false, code: PRINCIPAL_REUSED, sentence: `${PRINCIPAL_REUSED}: principal ${spec.principal} is retired (retiredAt ${prior.retiredAt ?? "?"}) — retired is FOREVER, the string can never become a different record (D-412, inherited by D-444)` };
  }
  if (prior !== undefined) return { ok: true, row: prior, idempotent: true };
  return { ok: true, row: { principal: spec.principal, kind: spec.kind ?? "unknown", registeredAt: spec.at, state: "active", generation: 1 }, idempotent: false };
}

/** D-412's law, mirrored: retirement appends the terminal state (generation +1). */
export function retirePrincipalRow(row: PrincipalRow, at: number): PrincipalRow {
  return { ...row, state: "retired", retiredAt: at, generation: row.generation + 1 };
}

/** Resolve a principal to an ACTIVE record — the seam every trust door walks. */
export function resolvePrincipal(principal: string, principals: ReadonlyMap<string, PrincipalRow>): PrincipalRow | null {
  const rec = principals.get(principal);
  if (rec === undefined || rec.state !== "active") return null;
  return rec;
}

// ---- digests (the badge precedent: canonical JSON, sorted keys) ----

/** Deterministic JSON (sorted keys) — the digest foundation. */
export function canonicalJson(v: unknown): string {
  if (Array.isArray(v)) return `[${v.map(canonicalJson).join(",")}]`;
  if (v !== null && typeof v === "object") {
    return `{${Object.keys(v as Record<string, unknown>).sort().map((k) => `${JSON.stringify(k)}:${canonicalJson((v as Record<string, unknown>)[k])}`).join(",")}}`;
  }
  return JSON.stringify(v) ?? "null";
}

export function trustDigest(row: unknown): string {
  return `sha256:${createHash("sha256").update(canonicalJson(row)).digest("hex")}`;
}

// ---- key lineage (ns trust.keys) ----

export interface KeyRow {
  keyId: string;
  principal: string;                // bound through the D-412 record
  era: { notBefore: number; notAfter?: number }; // the window in which this key's word is law
  fingerprint: string;              // sha256 over the PUBLIC material — testimony, never the material
  state: "active" | "retired" | "revoked";
  successorKeyRef?: string;         // the rotation seam (Ω-4X)
  boundAt: number;
  retiredAt?: number;
  revokedAt?: number;
  revocationReason?: string;        // the SCAR — REVOKED_KEY_ERA | emergency | …; rides forward, never deleted
}

export type BindOutcome = { ok: true; row: KeyRow } | { ok: false; code: string; sentence: string };

/** The era window is half-open: [notBefore, notAfter) — the rotation seam. */
export function eraContains(era: { notBefore: number; notAfter?: number }, at: number): boolean {
  return at >= era.notBefore && (era.notAfter === undefined || at < era.notAfter);
}

/** THE key ceremony (D-444): bind a key to a D-412 principal record. Every
 *  unclear input is a named refusal — never a soft pass. */
export function bindKey(
  spec: { keyId: string; principal: string; notBefore: number; notAfter?: number; fingerprint: string; expectedFingerprint?: string; at: number },
  principals: ReadonlyMap<string, PrincipalRow>,
  existing: ReadonlyMap<string, KeyRow>,
): BindOutcome {
  if (resolvePrincipal(spec.principal, principals) === null) {
    const rec = principals.get(spec.principal);
    return {
      ok: false,
      code: TRUST_PRINCIPAL_UNRESOLVABLE,
      sentence: `${TRUST_PRINCIPAL_UNRESOLVABLE}: the ceremony names principal ${JSON.stringify(spec.principal)}, which has no active record in the mesh${rec !== undefined ? ` (state ${rec.state} — retired is forever)` : ""}; an identity that was never registered cannot vouch for anything (D-444)`,
    };
  }
  if (existing.has(spec.keyId)) {
    return { ok: false, code: TRUST_DUPLICATE_BIND, sentence: `${TRUST_DUPLICATE_BIND}: key ${spec.keyId} is already bound — supersede it through rotation, never re-bind an id (D-444)` };
  }
  if (spec.notAfter !== undefined && (!Number.isFinite(spec.notAfter) || spec.notAfter <= spec.notBefore)) {
    return { ok: false, code: TRUST_KEY_EXPIRED, sentence: `${TRUST_KEY_EXPIRED}: the era window is empty (notAfter ${spec.notAfter} ≤ notBefore ${spec.notBefore}) — a key with no valid moment is expired at birth (D-444)` };
  }
  if (spec.notAfter !== undefined && spec.at >= spec.notAfter) {
    return { ok: false, code: TRUST_KEY_EXPIRED, sentence: `${TRUST_KEY_EXPIRED}: binding at ${spec.at} is past the key's own notAfter ${spec.notAfter} — the ceremony cannot bind a key to an era that already ended (D-444)` };
  }
  if (typeof spec.fingerprint !== "string" || spec.fingerprint.length === 0 || (spec.expectedFingerprint !== undefined && spec.fingerprint !== spec.expectedFingerprint)) {
    return { ok: false, code: TRUST_FINGERPRINT_MISMATCH, sentence: `${TRUST_FINGERPRINT_MISMATCH}: the ceremony's attested fingerprint does not match the key's cited fingerprint (${spec.fingerprint} vs ${spec.expectedFingerprint ?? "(absent)"}) — testimony about material must agree with the material (D-444)` };
  }
  return {
    ok: true,
    row: { keyId: spec.keyId, principal: spec.principal, era: { notBefore: spec.notBefore, ...(spec.notAfter !== undefined ? { notAfter: spec.notAfter } : {}) }, fingerprint: spec.fingerprint, state: "active", boundAt: spec.at },
  };
}

/** Rotation's clean half (the Ω-4X seam): retire the key at `notAfter`, naming
 *  its successor. History signed under the key stays valid — the era is
 *  closed, not erased. */
export function retireKey(row: KeyRow, notAfter: number, successorKeyRef: string | undefined, at: number): KeyRow {
  return { ...row, era: { ...row.era, notAfter }, state: "retired", ...(successorKeyRef !== undefined ? { successorKeyRef } : {}), retiredAt: at };
}

/** Emergency revocation (D-444): NEVER moves notBefore, NEVER deletes — the
 *  scar (revocationReason) rides the row forward; suspect-window signatures
 *  verify under their own law but carry the scar (see verifySignature). */
export function revokeKey(row: KeyRow, reason: string, at: number): KeyRow {
  return { ...row, state: "revoked", revokedAt: at, revocationReason: reason };
}

// ---- the verify fold (era-aware, total resolution, zero soft-pass) ----

export interface SignatureRow {
  keyId: string;
  signedAt: number;  // the mint time — judged under the law of its signing time
  signature: string; // sig:<sha256(fingerprint|signedAt|payload)>
}

/** Sign with a key (pure). The fingerprint stands in for the sealed material —
 *  the real instrument never sleeps in the testimony's bed. */
export function signWith(key: KeyRow, payload: unknown, signedAt: number): SignatureRow {
  return { keyId: key.keyId, signedAt, signature: `sig:${createHash("sha256").update(`${key.fingerprint}|${signedAt}|${canonicalJson(payload)}`).digest("hex")}` };
}

export type VerifyOutcome =
  | { ok: true; key: KeyRow; signature: SignatureRow; scar?: string; detail: string }
  | { ok: false; code: string; sentence: string };

/** THE verify fold (D-444): a signature is judged under the law of its signing
 *  time — the key whose era window contains the mint time, resolved totally
 *  (cited key → successor chain → same-principal era). Unclear is a named
 *  refusal; there is no soft-pass branch. */
export function verifySignature(
  sig: { keyId: string; signedAt: number; signature: string; payload: unknown },
  keys: ReadonlyMap<string, KeyRow>,
): VerifyOutcome {
  const cited = keys.get(sig.keyId);
  if (cited === undefined) {
    return { ok: false, code: TRUST_KEY_UNBOUND, sentence: `${TRUST_KEY_UNBOUND}: this signature cites key ${JSON.stringify(sig.keyId)}, which no principal record or lineage binds; unattributable authority is refused (D-444)` };
  }
  let resolved: KeyRow | undefined = eraContains(cited.era, sig.signedAt) ? cited : undefined;
  if (resolved === undefined && cited.successorKeyRef !== undefined) {
    let hop = keys.get(cited.successorKeyRef); // the rotation chain: A → B → C
    let guard = 0;
    while (hop !== undefined && resolved === undefined && guard < 16) {
      if (eraContains(hop.era, sig.signedAt)) resolved = hop;
      else hop = hop.successorKeyRef !== undefined ? keys.get(hop.successorKeyRef) : undefined;
      guard++;
    }
  }
  if (resolved === undefined) {
    for (const k of keys.values()) {
      if (k.principal === cited.principal && eraContains(k.era, sig.signedAt)) { resolved = k; break; }
    }
  }
  if (resolved === undefined) {
    if (cited.era.notAfter !== undefined && sig.signedAt >= cited.era.notAfter) {
      return { ok: false, code: TRUST_KEY_EXPIRED, sentence: `${TRUST_KEY_EXPIRED}: the signature's mint time ${sig.signedAt} is past key ${cited.keyId}'s notAfter ${cited.era.notAfter} and no successor lineage binds a key valid then — history is judged by its own law, and this signature cites a law that had ended (D-444)` };
    }
    return { ok: false, code: TRUST_KEY_UNBOUND, sentence: `${TRUST_KEY_UNBOUND}: the signature's mint time ${sig.signedAt} precedes key ${cited.keyId}'s notBefore ${cited.era.notBefore} — no lineage binds a key that did not yet exist; unattributable authority is refused (D-444)` };
  }
  const signature: SignatureRow = { keyId: sig.keyId, signedAt: sig.signedAt, signature: sig.signature };
  if (signWith(resolved, sig.payload, sig.signedAt).signature !== sig.signature) {
    return { ok: false, code: TRUST_SIGNATURE_INVALID, sentence: `${TRUST_SIGNATURE_INVALID}: the signature does not verify under key ${resolved.keyId} (the key valid at mint time ${sig.signedAt}); the mesh does not accept approximations of proof (D-444)` };
  }
  if (resolved.state === "revoked" && resolved.revokedAt !== undefined && sig.signedAt < resolved.revokedAt) {
    // suspect-window: signed while the key lived, revoked since — verified
    // UNDER ITS OWN LAW, the scar riding forward (nothing deleted).
    return { ok: true, key: resolved, signature, scar: resolved.revocationReason ?? "REVOKED_KEY_ERA", detail: `verified under key ${resolved.keyId} at mint time ${sig.signedAt} — SCARRED ${resolved.revocationReason ?? "REVOKED_KEY_ERA"} (revoked at ${resolved.revokedAt}; the scar rides forward, nothing deleted)` };
  }
  if (resolved.state === "revoked") {
    return { ok: false, code: TRUST_SIGNATURE_INVALID, sentence: `${TRUST_SIGNATURE_INVALID}: key ${resolved.keyId} was revoked at ${resolved.revokedAt} (reason ${JSON.stringify(resolved.revocationReason ?? "emergency")}) and this signature claims mint time ${sig.signedAt} — the revoked key's next write is a named refusal, never a soft pass (D-444, §19's owed falsifier)` };
  }
  return { ok: true, key: resolved, signature, detail: `verified under key ${resolved.keyId} (principal ${resolved.principal}, era notBefore ${resolved.era.notBefore}) at mint time ${sig.signedAt}` };
}

// ---- consent (generation-counted, resolved through the record) ----

export interface ConsentRow {
  consentId: string;  // the stable hash a refusal can name (D-336/D-353)
  principal: string;
  scope: string;      // the gated op
  generation: number; // bumped on every grant/revoke — a stale generation is a refusal, never a soft pass
  active: boolean;
  grantedAt: number;
  revokedAt?: number;
}

/** The consent id for (principal, op) — a stable hash, so a refusal can name
 *  the exact word the principal must re-grant (the D-336/D-353 discipline). */
export function consentIdFor(principal: string, op: string): string {
  return `consent_${createHash("sha256").update(`${principal}|${op}`).digest("hex").slice(0, 16)}`;
}

export type ConsentOutcome = { ok: true; row: ConsentRow } | { ok: false; code: string; sentence: string };

/** A grant RESOLVES THROUGH the principal record (spec §3.2): the principal
 *  must stand active in the mesh — absent or retired refuses. */
export function grantConsent(spec: { principal: string; op: string; at: number }, principals: ReadonlyMap<string, PrincipalRow>): ConsentOutcome {
  if (resolvePrincipal(spec.principal, principals) === null) {
    const rec = principals.get(spec.principal);
    return { ok: false, code: TRUST_PRINCIPAL_UNRESOLVABLE, sentence: `${TRUST_PRINCIPAL_UNRESOLVABLE}: the grant names principal ${JSON.stringify(spec.principal)}, which has no active record in the mesh${rec !== undefined ? ` (state ${rec.state} — retired is forever)` : ""}; an identity that was never registered cannot vouch for anything (D-444)` };
  }
  return { ok: true, row: { consentId: consentIdFor(spec.principal, spec.op), principal: spec.principal, scope: spec.op, generation: 1, active: true, grantedAt: spec.at } };
}

/** Revocation bumps the generation — the old word is not the current word. */
export function revokeConsentRow(row: ConsentRow, at: number): ConsentRow {
  return { ...row, active: false, revokedAt: at, generation: row.generation + 1 };
}

export type ConsentHoldsOutcome = { ok: true; row: ConsentRow } | { ok: false; code: string; sentence: string };

/** The gated use: a stale-generation consent is a refusal, never a soft pass. */
export function consentHolds(row: ConsentRow, withGeneration: number): ConsentHoldsOutcome {
  if (!row.active || withGeneration !== row.generation) {
    return { ok: false, code: TRUST_CONSENT_STALE, sentence: `${TRUST_CONSENT_STALE}: this consent carries generation ${withGeneration} but the grant ${row.consentId} stands at ${row.generation}${row.active ? "" : " (revoked)"}; it was revoked or re-granted, and the old word is not the current word (D-444)` };
  }
  return { ok: true, row };
}

// ---- the local pairing (ns trust.mesh) ----

export type PairingCeremony = "PAKE-local" | "QR" | "hardware-key";

export interface MeshRow {
  pairId: string;
  principals: [string, string];
  ceremony: PairingCeremony;
  at: number;
  evidenceRefs: string[]; // both principals' witnessed consent rows — the ceremony's only I/O
}

export type PairOutcome = { ok: true; row: MeshRow } | { ok: false; code: string; sentence: string };

/** THE local pairing (D-444): two devices learn to trust each other with ZERO
 *  network authority — the ceremony's only I/O is the vault rows both sign. */
export function pairDevices(
  spec: { pairId: string; a: string; b: string; witnesses: string[]; ceremony: PairingCeremony; at: number },
  principals: ReadonlyMap<string, PrincipalRow>,
  existingPairs: ReadonlyMap<string, MeshRow>,
): PairOutcome {
  for (const p of [spec.a, spec.b]) {
    if (resolvePrincipal(p, principals) === null) {
      return { ok: false, code: TRUST_PRINCIPAL_UNRESOLVABLE, sentence: `${TRUST_PRINCIPAL_UNRESOLVABLE}: the pairing names principal ${JSON.stringify(p)} with no active record in the mesh — one side of the mesh does not exist (D-444)` };
    }
  }
  if (existingPairs.has(spec.pairId)) {
    return { ok: false, code: TRUST_DUPLICATE_BIND, sentence: `${TRUST_DUPLICATE_BIND}: pair ${spec.pairId} already exists — a pairing is bound once; supersede it with a new ceremony, never re-bind an id (D-444)` };
  }
  const witnessed = new Set(spec.witnesses);
  if (!(witnessed.has(spec.a) && witnessed.has(spec.b))) {
    return { ok: false, code: TRUST_PAIRING_UNWITNESSED, sentence: `${TRUST_PAIRING_UNWITNESSED}: a pairing without both principals' consent rows is one device vouching for itself; the mesh refuses it (D-444)` };
  }
  return { ok: true, row: { pairId: spec.pairId, principals: [spec.a, spec.b], ceremony: spec.ceremony, at: spec.at, evidenceRefs: [...witnessed].sort() } };
}

// ---- the render (one fold renders; identical on every surface) ----

/** THE lineage print (D-444): the key's sentence from rows alone — surfaces
 *  may style it, never source it elsewhere. */
export function renderKey(row: KeyRow): string {
  const era = `era ${row.era.notBefore}..${row.era.notAfter ?? "∞"}`;
  const scar = row.state === "revoked"
    ? ` — REVOKED at ${row.revokedAt} (${row.revocationReason ?? "emergency"}; the scar rides forward, nothing deleted)`
    : row.state === "retired"
      ? ` — retired at ${row.retiredAt}${row.successorKeyRef !== undefined ? `, succeeded by ${row.successorKeyRef}` : ""}`
      : "";
  return `key ${row.keyId} of ${row.principal} · ${era} · ${row.state} · fingerprint ${row.fingerprint.slice(0, 22)}…${scar} [${trustDigest(row).slice(0, 22)}…]`;
}

// ---- the in-plugin registry (the vault mirror rides port caps, ring-first) ----

/** The trust registry: principals (the D-412 mirror), keys, consents, pairs. */
export class TrustRegistry {
  readonly principals = new Map<string, PrincipalRow>();
  readonly keys = new Map<string, KeyRow>();
  readonly consents = new Map<string, ConsentRow>();
  readonly pairs = new Map<string, MeshRow>();

  registerPrincipal(spec: { principal: string; kind?: string; at: number }): PrincipalOutcome {
    const out = registerPrincipal(spec, this.principals);
    if (out.ok && !out.idempotent) this.principals.set(out.row.principal, out.row);
    return out;
  }

  retirePrincipal(principal: string, at: number): PrincipalOutcome {
    const row = this.principals.get(principal);
    if (row === undefined) {
      return { ok: false, code: TRUST_PRINCIPAL_UNRESOLVABLE, sentence: `${TRUST_PRINCIPAL_UNRESOLVABLE}: principal ${JSON.stringify(principal)} has no record to retire (D-444)` };
    }
    if (row.state === "retired") {
      return { ok: false, code: PRINCIPAL_REUSED, sentence: `${PRINCIPAL_REUSED}: principal ${principal} is already retired — retired is FOREVER (D-412, inherited by D-444)` };
    }
    const next = retirePrincipalRow(row, at);
    this.principals.set(principal, next);
    return { ok: true, row: next, idempotent: false };
  }

  /** The KeyCeremony door (trust.bind@1). */
  bind(spec: Parameters<typeof bindKey>[0]): BindOutcome {
    const out = bindKey(spec, this.principals, this.keys);
    if (out.ok) this.keys.set(out.row.keyId, out.row);
    return out;
  }

  /** The verify fold door (trust.verify@1). */
  verify(sig: { keyId: string; signedAt: number; signature: string; payload: unknown }): VerifyOutcome {
    return verifySignature(sig, this.keys);
  }

  /** Rotation's clean half: retire at the seam, name the successor. */
  retire(keyId: string, notAfter: number, successorKeyRef: string | undefined, at: number): KeyRow | null {
    const row = this.keys.get(keyId);
    if (row === null || row === undefined) return null;
    const next = retireKey(row, notAfter, successorKeyRef, at);
    this.keys.set(keyId, next);
    return next;
  }

  /** Emergency revocation (trust.revoke@1): the scar rides forward, nothing deletes. */
  revoke(keyId: string, reason: string, at: number): KeyRow | null {
    const row = this.keys.get(keyId);
    if (row === null || row === undefined) return null;
    const next = revokeKey(row, reason, at);
    this.keys.set(keyId, next);
    return next;
  }

  grantConsent(spec: { principal: string; op: string; at: number }): ConsentOutcome {
    const out = grantConsent(spec, this.principals);
    if (out.ok) this.consents.set(out.row.consentId, out.row);
    return out;
  }

  revokeConsent(consentId: string, at: number): ConsentRow | null {
    const row = this.consents.get(consentId);
    if (row === undefined) return null;
    const next = revokeConsentRow(row, at);
    this.consents.set(consentId, next);
    return next;
  }

  consentHolds(consentId: string, withGeneration: number): ConsentHoldsOutcome {
    const row = this.consents.get(consentId);
    if (row === undefined) {
      return { ok: false, code: TRUST_CONSENT_STALE, sentence: `${TRUST_CONSENT_STALE}: consent ${consentId} has no grant row — the word was never given, so it cannot hold (D-444)` };
    }
    return consentHolds(row, withGeneration);
  }

  /** The local pairing door: zero network authority, both principals witness. */
  pair(spec: Parameters<typeof pairDevices>[0]): PairOutcome {
    const out = pairDevices(spec, this.principals, this.pairs);
    if (out.ok) this.pairs.set(out.row.pairId, out.row);
    return out;
  }

  render(keyId: string): string | null {
    const row = this.keys.get(keyId);
    return row === undefined ? null : renderKey(row);
  }

  listKeys(): string[] {
    return [...this.keys.keys()].sort();
  }
}
