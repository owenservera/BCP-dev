// vivim-intent/src/lexicon.ts — the principal-owned deterministic lexicon (D-434, Ω-2.6).
//
// The tuning knob of the human door: your jargon as typed, deterministic,
// revocable entries — alias | pattern | default | disambiguation-rule —
// evaluated INSIDE the resolution walk (trace.ts), never a model call.
// The one law this module exists to enforce mechanically: ML PROPOSES, THE
// PRINCIPAL DISPOSES. A realization (agent, plugin, composition) can never
// write a lexicon row directly — INTENT_LEXICON_AUTO_APPLY_REFUSED — and a
// proposal that is not accepted within 30 days expires (an unreviewed
// suggestion is not a standing temptation).
//
// Pure core: every function here is deterministic data-in/data-out; the op
// layer (index.ts) supplies `now` and the vault. No clocks, no randomness.

import { createHash } from "node:crypto";
import type { ProvenanceTier } from "@vivim/omega-contracts";

// ---- the refusal register (D-434 §7; exact codes, ledgered sentences) ----

export const INTENT_LEXICON_AUTO_APPLY_REFUSED = "INTENT_LEXICON_AUTO_APPLY_REFUSED";
export const INTENT_LEXICON_SCOPE_INVALID = "INTENT_LEXICON_SCOPE_INVALID";

export const AUTO_APPLY_SENTENCE =
  "A realization proposed a lexicon entry and something tried to apply it without your acceptance; proposals wait for you, and this attempt is refused and ledgered.";
export const SCOPE_INVALID_SENTENCE =
  "This entry tries to bind scope {scope} it cannot own; your words may tune your door, not rewire the house.";

/** lexicon-proposals-30d — the retention name IS the law. */
export const PROPOSAL_TTL_MS = 30 * 24 * 60 * 60 * 1000;

// ---- entry shapes ----

export type LexiconKind = "alias" | "pattern" | "default" | "disambiguation-rule";

/** §2.1 of the Intent Layer amendment lineage: no unlabelled generality.
 *  Lexicon entries are the principal's personal data by construction. */
export type LexiconGenerality = "GEN_PERSONAL" | "GEN_GENERIC";

export interface LexiconBadge {
  tier: ProvenanceTier;
  generality: LexiconGenerality;
}

/** alias: a word that means an op ("lab" → vault.query@1) — projected through
 *  the taught-verb mechanism the walk already trusts, at command-word positions. */
export interface AliasPayload { word: string; op: string; note?: string }

/** pattern: a trigger pattern → canonical intent hint (regex source, matched
 *  case-insensitively against the folded utterance inside the walk). */
export interface PatternPayload { pattern: string; op: string; note?: string }

/** default: default parameters for a target op, applied to the winning
 *  candidate's payload when the slot is missing (never over a filled one). */
export interface DefaultPayload { op: string; params: Record<string, unknown> }

/** disambiguation-rule: prefer one intent, optionally among a named set —
 *  the tie-break the walk cites by entryId when it decides. */
export interface DisambiguationRulePayload { prefer: string; among?: string[] }

export type LexiconPayload = AliasPayload | PatternPayload | DefaultPayload | DisambiguationRulePayload;

export interface LexiconOrigin {
  kind: "principal-authored" | "accepted-proposal";
  proposalRef?: string;
  realizationRef?: string;
}

export interface LexiconEntry {
  entryId: string;                 // "lex:<16hex>" — content-derived, deterministic
  principal: string;
  kind: LexiconKind;
  payload: LexiconPayload;
  scope: string;                   // legal vocabulary below (the scope law)
  badge: LexiconBadge;
  origin: LexiconOrigin;
  createdAt: number;               // supplied by the op layer, never Date.now() here
  revokedAt?: number;              // tombstone — revocation is append-only state
}

export interface LexiconProposalSpec {
  kind: LexiconKind;
  payload: LexiconPayload;
  scope: string;
}

export interface LexiconProposal {
  proposalId: string;              // "prop:<16hex>"
  realizationRef: string;          // the badged proposer
  proposedEntry: LexiconProposalSpec;
  evidence: string[];              // the interaction history that motivates it
  status: "proposed" | "accepted" | "rejected" | "expired";
  proposedAt: number;
  expiresAt: number;               // proposedAt + PROPOSAL_TTL_MS
}

export interface LexiconRefusal {
  code: typeof INTENT_LEXICON_AUTO_APPLY_REFUSED | typeof INTENT_LEXICON_SCOPE_INVALID;
  sentence: string;
}

// ---- the scope law: your words may tune your door, not rewire the house ----

const LEGAL_SCOPE_RE = /^(?:global|surface:[a-z0-9-]+|namespace:[a-z0-9.-]+|capability-family:[a-z0-9-]+)$/;

/** Validate a scope against the legal vocabulary. Null when legal; the refusal
 *  (code + sentence with the scope named) when not. Pure. */
export function checkScope(scope: string): LexiconRefusal | null {
  if (typeof scope === "string" && LEGAL_SCOPE_RE.test(scope)) return null;
  return {
    code: INTENT_LEXICON_SCOPE_INVALID,
    sentence: `${INTENT_LEXICON_SCOPE_INVALID}: ${SCOPE_INVALID_SENTENCE.replace("{scope}", JSON.stringify(String(scope)))} (D-434, Ω-2.6)`,
  };
}

// ---- principals vs realizations (§3.3 lineage: the authenticated caller is
//      the only authority — never the payload) ----

export type CallerKind = "principal" | "realization";

/** root and user:* are the principal; everything else (agent:*, plugin ids,
 *  compositions) is a realization — it may propose, never apply. Pure. */
export function callerKindOf(from: string): CallerKind {
  if (from === "root" || from.startsWith("user:")) return "principal";
  return "realization";
}

/** The write guard, mechanically enforced at every entry-producing op:
 *  the lexicon writer accepts rows only from the principal or from an
 *  acceptance ceremony (whose CALLER is still the principal). Pure. */
export function guardLexiconWrite(from: string): LexiconRefusal | null {
  if (callerKindOf(from) === "principal") return null;
  return {
    code: INTENT_LEXICON_AUTO_APPLY_REFUSED,
    sentence: `${INTENT_LEXICON_AUTO_APPLY_REFUSED}: ${AUTO_APPLY_SENTENCE} (caller: ${from}; D-434, Ω-2.6)`,
  };
}

// ---- canonical serialization (stable digests regardless of key order) ----

/** Deterministic JSON: object keys sorted recursively. The digest foundation —
 *  vault rows may arrive with any key order, the digest never varies. Pure. */
export function canonicalJson(v: unknown): string {
  if (Array.isArray(v)) return `[${v.map(canonicalJson).join(",")}]`;
  if (v !== null && typeof v === "object") {
    const keys = Object.keys(v as Record<string, unknown>).sort();
    return `{${keys.map((k) => `${JSON.stringify(k)}:${canonicalJson((v as Record<string, unknown>)[k])}`).join(",")}}`;
  }
  return JSON.stringify(v) ?? "null";
}

function sha256Hex(s: string): string {
  return createHash("sha256").update(s, "utf-8").digest("hex");
}

/** Content-derived, deterministic entry id — the citation lexiconHits carry. Pure. */
export function entryIdOf(principal: string, kind: LexiconKind, payload: LexiconPayload): string {
  return `lex:${sha256Hex(`${principal}|${kind}|${canonicalJson(payload)}`).slice(0, 16)}`;
}

export function proposalIdOf(realizationRef: string, spec: LexiconProposalSpec, proposedAt: number): string {
  return `prop:${sha256Hex(`${realizationRef}|${canonicalJson(spec)}|${proposedAt}`).slice(0, 16)}`;
}

// ---- entry validation (shape + scope; total, never throws) ----

const LEGAL_TIERS: ProvenanceTier[] = ["untrusted", "signed", "verified", "first-party", "system"];
const OP_RE = /^[a-z][a-z0-9.-]*@[0-9]+$/;

/** Validate a proposed entry spec (shape + scope + pattern compilability).
 *  Pure; returns the refusal when invalid, null when legal. A malformed
 *  pattern is refused HERE so the walk can never crash on lexicon data. */
export function validateEntrySpec(spec: LexiconProposalSpec): LexiconRefusal | null {
  const scopeRefusal = checkScope(spec.scope);
  if (scopeRefusal) return scopeRefusal;
  const p = spec.payload as Record<string, unknown>;
  if (spec.kind === "alias") {
    if (typeof p["word"] !== "string" || !/^[a-z][a-z0-9-]*$/.test(String(p["word"]))) {
      return { code: INTENT_LEXICON_SCOPE_INVALID, sentence: `${INTENT_LEXICON_SCOPE_INVALID}: alias payload needs a lowercase word (letters/digits/dashes) — got ${JSON.stringify(String(p["word"]))} (D-434, Ω-2.6)` };
    }
    if (typeof p["op"] !== "string" || !OP_RE.test(String(p["op"]))) {
      return { code: INTENT_LEXICON_SCOPE_INVALID, sentence: `${INTENT_LEXICON_SCOPE_INVALID}: alias payload needs a target op "<id>@<version>" — got ${JSON.stringify(String(p["op"]))} (D-434, Ω-2.6)` };
    }
  } else if (spec.kind === "pattern") {
    if (typeof p["pattern"] !== "string" || String(p["pattern"]).length === 0) {
      return { code: INTENT_LEXICON_SCOPE_INVALID, sentence: `${INTENT_LEXICON_SCOPE_INVALID}: pattern payload needs a non-empty regex source (D-434, Ω-2.6)` };
    }
    try {
      void new RegExp(String(p["pattern"]), "i");
    } catch {
      return { code: INTENT_LEXICON_SCOPE_INVALID, sentence: `${INTENT_LEXICON_SCOPE_INVALID}: pattern ${JSON.stringify(String(p["pattern"]))} does not compile — the walk may never crash on lexicon data (D-434, Ω-2.6)` };
    }
    if (typeof p["op"] !== "string" || !OP_RE.test(String(p["op"]))) {
      return { code: INTENT_LEXICON_SCOPE_INVALID, sentence: `${INTENT_LEXICON_SCOPE_INVALID}: pattern payload needs a target op "<id>@<version>" — got ${JSON.stringify(String(p["op"]))} (D-434, Ω-2.6)` };
    }
  } else if (spec.kind === "default") {
    if (typeof p["op"] !== "string" || !OP_RE.test(String(p["op"]))) {
      return { code: INTENT_LEXICON_SCOPE_INVALID, sentence: `${INTENT_LEXICON_SCOPE_INVALID}: default payload needs a target op "<id>@<version>" (D-434, Ω-2.6)` };
    }
    if (p["params"] === null || typeof p["params"] !== "object" || Array.isArray(p["params"]) || Object.keys(p["params"] as object).length === 0) {
      return { code: INTENT_LEXICON_SCOPE_INVALID, sentence: `${INTENT_LEXICON_SCOPE_INVALID}: default payload needs a non-empty params object (D-434, Ω-2.6)` };
    }
  } else if (spec.kind === "disambiguation-rule") {
    if (typeof p["prefer"] !== "string" || !OP_RE.test(String(p["prefer"]))) {
      return { code: INTENT_LEXICON_SCOPE_INVALID, sentence: `${INTENT_LEXICON_SCOPE_INVALID}: disambiguation-rule payload needs "prefer": "<op>@<version>" (D-434, Ω-2.6)` };
    }
    if (p["among"] !== undefined && (!Array.isArray(p["among"]) || !(p["among"] as unknown[]).every((x) => typeof x === "string"))) {
      return { code: INTENT_LEXICON_SCOPE_INVALID, sentence: `${INTENT_LEXICON_SCOPE_INVALID}: disambiguation-rule "among" must be a list of op ids (D-434, Ω-2.6)` };
    }
  } else {
    return { code: INTENT_LEXICON_SCOPE_INVALID, sentence: `${INTENT_LEXICON_SCOPE_INVALID}: kind must be alias | pattern | default | disambiguation-rule — got ${JSON.stringify(String(spec.kind))} (D-434, Ω-2.6)` };
  }
  return null;
}

/** Personal entries are GEN_PERSONAL by law — the badge is not caller data. */
export function personalBadge(tier: ProvenanceTier = "first-party"): LexiconBadge {
  return { tier, generality: "GEN_PERSONAL" };
}

// ---- the pure constructors (the op layer adds rows; these make them) ----

/** Build a principal-authored entry. Refuses realizations (the auto-apply
 *  guard), illegal scopes, and malformed shapes. Pure. */
export function makePrincipalEntry(
  from: string,
  spec: LexiconProposalSpec,
  now: number,
): { entry: LexiconEntry } | { refused: LexiconRefusal } {
  const guard = guardLexiconWrite(from);
  if (guard) return { refused: guard };
  const invalid = validateEntrySpec(spec);
  if (invalid) return { refused: invalid };
  return {
    entry: {
      entryId: entryIdOf(from, spec.kind, spec.payload),
      principal: from,
      kind: spec.kind,
      payload: spec.payload,
      scope: spec.scope,
      badge: personalBadge(),
      origin: { kind: "principal-authored" },
      createdAt: now,
    },
  };
}

/** Build a proposal row from a badged realization. Realizations may propose
 *  freely — the proposal is data waiting for a person, never a live input. Pure. */
export function makeProposal(
  realizationRef: string,
  spec: LexiconProposalSpec,
  evidence: string[],
  now: number,
): { proposal: LexiconProposal } | { refused: LexiconRefusal } {
  const invalid = validateEntrySpec(spec);
  if (invalid) return { refused: invalid };
  return {
    proposal: {
      proposalId: proposalIdOf(realizationRef, spec, now),
      realizationRef,
      proposedEntry: spec,
      evidence: evidence.filter((e) => typeof e === "string"),
      status: "proposed",
      proposedAt: now,
      expiresAt: now + PROPOSAL_TTL_MS,
    },
  };
}

/** The acceptance ceremony: principal-only (the guard refuses a realization
 *  attempting it — that IS auto-apply), expiry-checked, citation-carrying. Pure. */
export function acceptProposal(
  from: string,
  proposal: LexiconProposal,
  now: number,
): { entry: LexiconEntry } | { refused: LexiconRefusal; status?: LexiconProposal["status"] } {
  const guard = guardLexiconWrite(from);
  if (guard) return { refused: guard };
  if (now > proposal.expiresAt) {
    return {
      refused: {
        code: INTENT_LEXICON_AUTO_APPLY_REFUSED,
        sentence: `${INTENT_LEXICON_AUTO_APPLY_REFUSED}: proposal ${proposal.proposalId} expired ${(Math.round((now - proposal.expiresAt) / 86400000))}d ago — an unreviewed suggestion is not a standing temptation (lexicon-proposals-30d); ${proposal.realizationRef} may re-propose (D-434, Ω-2.6)`,
      },
      status: "expired",
    };
  }
  if (proposal.status !== "proposed") {
    return {
      refused: {
        code: INTENT_LEXICON_AUTO_APPLY_REFUSED,
        sentence: `${INTENT_LEXICON_AUTO_APPLY_REFUSED}: proposal ${proposal.proposalId} is ${proposal.status}, not proposed — acceptance is a one-time ceremony over a live proposal (D-434, Ω-2.6)`,
      },
      status: proposal.status,
    };
  }
  const spec = proposal.proposedEntry;
  const invalid = validateEntrySpec(spec);
  if (invalid) return { refused: invalid };
  return {
    entry: {
      entryId: entryIdOf(from, spec.kind, spec.payload),
      principal: from,
      kind: spec.kind,
      payload: spec.payload,
      scope: spec.scope,
      badge: personalBadge(),
      origin: { kind: "accepted-proposal", proposalRef: proposal.proposalId, realizationRef: proposal.realizationRef },
      createdAt: now,
    },
  };
}

/** Revoke: the tombstone a principal appends over their own entry. Pure. */
export function revokeEntry(from: string, entry: LexiconEntry, now: number): { entry: LexiconEntry } | { refused: LexiconRefusal } {
  const guard = guardLexiconWrite(from);
  if (guard) return { refused: guard };
  if (entry.revokedAt !== undefined) {
    return { refused: { code: INTENT_LEXICON_SCOPE_INVALID, sentence: `entry ${entry.entryId} is already revoked (at ${entry.revokedAt}) — revocation is append-only, never re-cut (D-434, Ω-2.6)` } };
  }
  return { entry: { ...entry, revokedAt: now } };
}

// ---- the active state + the digest every trace pins ----

/** The active lexicon state: unrevoked, well-formed rows in canonical
 *  (entryId) order — the pure function of the rows the walk consumes.
 *  Malformed rows degrade to ignored, never crash the walk. Pure. */
export function activeEntries(entries: LexiconEntry[]): LexiconEntry[] {
  return entries
    .filter((e) => e !== null && typeof e === "object")
    .filter((e) => e.revokedAt === undefined)
    .filter((e) => typeof e?.entryId === "string" && typeof e?.kind === "string" && e?.payload !== undefined)
    .sort((a, b) => (a.entryId < b.entryId ? -1 : a.entryId > b.entryId ? 1 : 0));
}

/** The lexicon digest: sha256 over the canonical active-state serialization.
 *  Revoked entries do not participate — revocation reverts the digest exactly.
 *  This is the "lexicon version" the resolverDigest pins into every trace. Pure. */
export function lexiconDigest(entries: LexiconEntry[]): string {
  const canon = activeEntries(entries)
    .map((e) => canonicalJson({ entryId: e.entryId, kind: e.kind, payload: e.payload, scope: e.scope, principal: e.principal }))
    .join("\n");
  return `sha256:${sha256Hex(canon)}`;
}

/** Parse a lexicon row from vault data (tolerant: a malformed row is skipped,
 *  never crashed on — the walk stays total). Pure. */
export function parseEntryRow(data: unknown): LexiconEntry | null {
  if (data === null || typeof data !== "object" || Array.isArray(data)) return null;
  const r = data as Record<string, unknown>;
  if (typeof r["entryId"] !== "string" || typeof r["kind"] !== "string" || r["payload"] === undefined) return null;
  if (typeof r["principal"] !== "string" || typeof r["scope"] !== "string") return null;
  if (!["alias", "pattern", "default", "disambiguation-rule"].includes(String(r["kind"]))) return null;
  const badge = (r["badge"] !== null && typeof r["badge"] === "object" && !Array.isArray(r["badge"])) ? r["badge"] as Record<string, unknown> : {};
  const origin = (r["origin"] !== null && typeof r["origin"] === "object" && !Array.isArray(r["origin"])) ? r["origin"] as Record<string, unknown> : {};
  const tier = LEGAL_TIERS.includes(badge["tier"] as ProvenanceTier) ? badge["tier"] as ProvenanceTier : "untrusted";
  return {
    entryId: String(r["entryId"]),
    principal: String(r["principal"]),
    kind: String(r["kind"]) as LexiconKind,
    payload: r["payload"] as LexiconPayload,
    scope: String(r["scope"]),
    badge: { tier, generality: badge["generality"] === "GEN_GENERIC" ? "GEN_GENERIC" : "GEN_PERSONAL" },
    origin: {
      kind: origin["kind"] === "accepted-proposal" ? "accepted-proposal" : "principal-authored",
      ...(typeof origin["proposalRef"] === "string" ? { proposalRef: origin["proposalRef"] } : {}),
      ...(typeof origin["realizationRef"] === "string" ? { realizationRef: origin["realizationRef"] } : {}),
    },
    createdAt: typeof r["createdAt"] === "number" ? r["createdAt"] : 0,
    ...(typeof r["revokedAt"] === "number" ? { revokedAt: r["revokedAt"] } : {}),
  };
}

/** Parse a proposal row from vault data (same tolerance). Pure. */
export function parseProposalRow(data: unknown): LexiconProposal | null {
  if (data === null || typeof data !== "object" || Array.isArray(data)) return null;
  const r = data as Record<string, unknown>;
  if (typeof r["proposalId"] !== "string" || typeof r["realizationRef"] !== "string") return null;
  const spec = r["proposedEntry"];
  if (spec === null || typeof spec !== "object" || Array.isArray(spec)) return null;
  const s = spec as Record<string, unknown>;
  if (typeof s["kind"] !== "string" || s["payload"] === undefined || typeof s["scope"] !== "string") return null;
  const status = ["proposed", "accepted", "rejected", "expired"].includes(String(r["status"])) ? String(r["status"]) as LexiconProposal["status"] : "proposed";
  return {
    proposalId: String(r["proposalId"]),
    realizationRef: String(r["realizationRef"]),
    proposedEntry: { kind: String(s["kind"]) as LexiconKind, payload: s["payload"] as LexiconPayload, scope: String(s["scope"]) },
    evidence: Array.isArray(r["evidence"]) ? r["evidence"].filter((e): e is string => typeof e === "string") : [],
    status,
    proposedAt: typeof r["proposedAt"] === "number" ? r["proposedAt"] : 0,
    expiresAt: typeof r["expiresAt"] === "number" ? r["expiresAt"] : 0,
  };
}
