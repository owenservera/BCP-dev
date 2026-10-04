// vivim-run/src/liveness.ts (D-450, Ω-14 — liveness, re-materialized spec paper D-446)
//
// Asleep is still alive, and awake is budgeted: every live object wears a
// governed liveness state — ghost, dormant, hydrated, suspended — and every
// transition is a ceremony, never spontaneous. Wake is budget-check-first
// (the machine is sovereign territory too); suspend is never a quiet freeze
// (typed reason + the §18 badge sentence on the row); ghosts watch, they
// never write; and a dormant thing proves its nap with cheap signed proofs
// against the vault watch — a proof older than the declared watch cadence
// means the watch died, and the nap is now a death.
//
// Pure core: no timers, no I/O, zero pixels (F1 by construction). The
// watchdog/supervisor keep the process tier (D-360/D-397); this is the
// governed boundary above them. The vault mirror rides port caps when
// present (ring-first, the health.ts precedent).
import { canonicalJson, sha256Hex } from "./planstate.ts";

export const LIVENESS_NS = "liveness";
export const LIVENESS_STATE_INVALID = "LIVENESS_STATE_INVALID";
export const LIVENESS_PROOF_STALE = "LIVENESS_PROOF_STALE";
export const LIVENESS_GHOST_WRITE = "LIVENESS_GHOST_WRITE";
export const LIVENESS_WAKE_BUDGET_UNDECLARED = "LIVENESS_WAKE_BUDGET_UNDECLARED";
export const LIVENESS_BUDGET_REFUSED = "LIVENESS_BUDGET_REFUSED";
export const LIVENESS_WAKE_UNGATED = "LIVENESS_WAKE_UNGATED";
export const LIVENESS_STATE_DRIFT = "LIVENESS_STATE_DRIFT";

/** The §18 lifecycle, as law: a tiny state machine with named edges only. */
export type LivenessState = "ghost" | "dormant" | "hydrated" | "suspended";
export const LIVENESS_STATES: readonly LivenessState[] = ["ghost", "dormant", "hydrated", "suspended"];
export type SuspendReason = "battery" | "pressure" | "law";

export function isLivenessState(s: unknown): s is LivenessState {
  return typeof s === "string" && (LIVENESS_STATES as readonly string[]).includes(s);
}

/** THE state machine (D-450): ghost wakes (light or full); dormant wakes,
 *  sheds, or is suspended; hydrated sleeps (pause or shed) or is suspended;
 *  suspended re-enters via wake only. Lifecycle is law, not improvisation. */
export const LAWFUL_TRANSITIONS: Record<LivenessState, readonly LivenessState[]> = {
  ghost: ["dormant", "hydrated"],
  dormant: ["hydrated", "ghost", "suspended"],
  hydrated: ["dormant", "ghost", "suspended"],
  suspended: ["dormant", "hydrated"],
};

/** The states a tile may be PLACED in (no prior row): identity + layout +
 *  vault watch first — spawning hydrated would bypass the budget door. */
export const INITIAL_STATES: readonly LivenessState[] = ["ghost", "dormant"];

/** §18's exact badge sentences — the suspend is never invisible, and the row
 *  renders headless exactly what the badge would print. */
export const SUSPEND_SENTENCES: Record<SuspendReason, string> = {
  battery: "Suspended to save battery. Tap to wake.",
  pressure: "Suspended to relieve pressure. Tap to wake.",
  law: "Suspended by law. Resolve the cited law first.",
};

/** THE liveness-state row (ns `liveness`, id `state:<tileId>`): latest-wins,
 *  with the append-only transition history riding the same namespace. */
export interface LivenessRow {
  tileId: string;
  state: LivenessState;
  since: number;
  budgetRef?: string;        // the Ω-2 seam: hydration declares its budget or does not happen
  wakeProof?: { gateRef: string; hydratedAt: number; digest: string };
  weightMB?: number;         // the §18 resource profile weight — the budget fold's input
  suspendReason?: SuspendReason;
  badgeSentence?: string;    // §18's sentence — on the row, never only on the badge
  by: string;
}

export interface TransitionRow {
  kind: "liveness.transition@1";
  tileId: string;
  from: LivenessState | "none";
  to: LivenessState;
  reason?: string;
  budgetRef?: string;
  by: string;
  at: number;
}

/** THE dormancy proof (ns `liveness`, id `proof:<tileId>:<ts>`): the sleeping
 *  thing's testimony — "I'm asleep, the watch is live, this is the revision I
 *  resume from," signed by the realization identity, cheap and regenerable. */
export interface DormancyProof {
  kind: "liveness.proof@1";
  tileId: string;
  watchedRev: number;        // the vault-watch revision the proof resumes from
  signedBy: string;          // the realization identity
  at: number;
  digest: string;            // over {tileId, watchedRev, signedBy, at} — the probe re-derives it
}

/** The D-435 handshake (Ω-14 owns the stethoscope): what a plan needing this
 *  realization reads as `blockedOn: liveness`. */
export interface StethoscopeVerdict {
  tileId: string;
  blocked: boolean;
  blocker: "liveness";
  state: LivenessState;
  stateRef: string;
  detail: string;
}

export type SetOutcome = { ok: true; row: LivenessRow; transition: TransitionRow } | { ok: false; code: string; sentence: string };
export type WakeOutcome = { ok: true; row: LivenessRow; transition: TransitionRow } | { ok: false; code: string; sentence: string };
export type WriteOutcome = { ok: true } | { ok: false; code: string; sentence: string };
export type ProbeOutcome = { ok: true; proof: DormancyProof } | { ok: false; code: string; sentence: string };
export type SignOutcome = { ok: true; proof: DormancyProof } | { ok: false; code: string; sentence: string };

/** THE ceremony door (D-450): `liveness.set@1` — placement, sleep, shed, and
 *  the governor's suspend all pass here. Lawful edges only; drift refused;
 *  suspends typed and badged. */
export function setLiveness(
  spec: {
    tileId: string;
    to: LivenessState;
    from?: LivenessState;
    reason?: string;
    suspendReason?: SuspendReason;
    weightMB?: number;
    by: string;
    at: number;
  },
  prior: LivenessRow | null,
): SetOutcome {
  if (typeof spec.tileId !== "string" || spec.tileId.length === 0) {
    return { ok: false, code: LIVENESS_STATE_INVALID, sentence: `${LIVENESS_STATE_INVALID}: the liveness row names no tileId — identity has no anonymous form (D-450)` };
  }
  if (!isLivenessState(spec.to)) {
    return { ok: false, code: LIVENESS_STATE_INVALID, sentence: `${LIVENESS_STATE_INVALID}: state ${JSON.stringify(spec.to)} is not in the state machine (ghost|dormant|hydrated|suspended) — lifecycle is law, not improvisation (D-450, Ω-14)` };
  }
  if (spec.to === "suspended") {
    const r = spec.suspendReason;
    if (r !== "battery" && r !== "pressure" && r !== "law") {
      return { ok: false, code: LIVENESS_STATE_INVALID, sentence: `${LIVENESS_STATE_INVALID}: a suspend without a typed reason (battery|pressure|law) is a quiet freeze wearing a badge shape — degradation is never invisible (D-450, §18)` };
    }
  }
  if (prior === null) {
    if (!(INITIAL_STATES as readonly string[]).includes(spec.to)) {
      return { ok: false, code: LIVENESS_STATE_INVALID, sentence: `${LIVENESS_STATE_INVALID}: ${spec.tileId} has no liveness row and cannot be placed as ${spec.to} — placement starts at ghost or dormant; hydration is the wake ceremony's business and the budget door is not optional (D-450)` };
    }
  } else {
    if (spec.from !== undefined && spec.from !== prior.state) {
      return { ok: false, code: LIVENESS_STATE_DRIFT, sentence: `${LIVENESS_STATE_DRIFT}: the transition claims from=${spec.from} but the row shows ${prior.state}; a liveness the rows cannot derive is a liveness the badge may not print (D-450)` };
    }
    if (spec.to === prior.state) {
      return { ok: false, code: LIVENESS_STATE_INVALID, sentence: `${LIVENESS_STATE_INVALID}: ${spec.tileId} is already ${prior.state} — a ceremony that changes nothing is not a ceremony (D-450)` };
    }
    if (!(LAWFUL_TRANSITIONS[prior.state] as readonly string[]).includes(spec.to)) {
      return { ok: false, code: LIVENESS_STATE_INVALID, sentence: `${LIVENESS_STATE_INVALID}: the transition ${prior.state}→${spec.to} is not in the state machine; lifecycle is law, not improvisation (D-450, Ω-14)` };
    }
  }
  const row: LivenessRow = {
    tileId: spec.tileId,
    state: spec.to,
    since: spec.at,
    ...(spec.weightMB !== undefined ? { weightMB: spec.weightMB } : prior?.weightMB !== undefined ? { weightMB: prior.weightMB } : {}),
    ...(spec.to === "suspended" && spec.suspendReason !== undefined ? { suspendReason: spec.suspendReason, badgeSentence: SUSPEND_SENTENCES[spec.suspendReason] } : {}),
    ...(prior?.budgetRef !== undefined ? { budgetRef: prior.budgetRef } : {}),
    by: spec.by,
  };
  const transition: TransitionRow = {
    kind: "liveness.transition@1",
    tileId: spec.tileId,
    from: prior?.state ?? "none",
    to: spec.to,
    ...(spec.reason !== undefined ? { reason: spec.reason } : {}),
    ...(spec.to === "suspended" && spec.suspendReason !== undefined ? { reason: `suspend:${spec.suspendReason}` } : {}),
    ...(prior?.budgetRef !== undefined ? { budgetRef: prior.budgetRef } : {}),
    by: spec.by,
    at: spec.at,
  };
  return { ok: true, row, transition };
}

/** THE wake ceremony (D-450): budget check FIRST — undeclared budget refuses,
 *  an unaffordable hydration refuses with the trade named — then the frame
 *  citation (turning things on is doing, and doing pays the gate), then the
 *  law of the edge, then hydration, then the row, always with wakeProof. */
export function wake(
  spec: {
    tileId: string;
    to?: LivenessState;        // default hydrated; suspended re-enters via wake too
    budgetRef: string;
    gateRef: string;
    capacityMB?: number;       // the declared profile capacity — the budget fold's ceiling
    profileRef?: string;
    by: string;
    at: number;
  },
  prior: LivenessRow | null,
  committedMB: number,
): WakeOutcome {
  if (typeof spec.budgetRef !== "string" || spec.budgetRef.length === 0) {
    return { ok: false, code: LIVENESS_WAKE_BUDGET_UNDECLARED, sentence: `${LIVENESS_WAKE_BUDGET_UNDECLARED}: the wake of ${spec.tileId} declares no budgetRef — hydration is expensive and the budget check comes FIRST; every wake declares its budget or does not happen (D-450, Ω-14, §18)` };
  }
  if (prior === null) {
    return { ok: false, code: LIVENESS_STATE_INVALID, sentence: `${LIVENESS_STATE_INVALID}: cannot wake ${spec.tileId} — no liveness row derives any state for it; place it first (D-450)` };
  }
  const to: LivenessState = spec.to ?? "hydrated";
  if (!isLivenessState(to) || to === "suspended") {
    return { ok: false, code: LIVENESS_STATE_INVALID, sentence: `${LIVENESS_STATE_INVALID}: a wake lands in ghost|dormant|hydrated (got ${JSON.stringify(spec.to)}) — nobody wakes INTO suspension (D-450)` };
  }
  if (spec.capacityMB !== undefined && to === "hydrated") {
    const cost = prior.weightMB ?? 0;
    if (committedMB + cost > spec.capacityMB) {
      return { ok: false, code: LIVENESS_BUDGET_REFUSED, sentence: `${LIVENESS_BUDGET_REFUSED}: hydrating ${spec.tileId} (${cost}MB on top of ${committedMB}MB committed) would exceed the declared budget${spec.profileRef !== undefined ? ` (${spec.profileRef}, capacity ${spec.capacityMB}MB)` : ""}; suspend or shed something first — the machine is sovereign territory too (D-450, §18)` };
    }
  }
  if (typeof spec.gateRef !== "string" || spec.gateRef.length === 0) {
    return { ok: false, code: LIVENESS_WAKE_UNGATED, sentence: `${LIVENESS_WAKE_UNGATED}: the wake of ${spec.tileId} was attempted without a framed authority; turning things on is doing, and doing pays the gate (D-450, Ω-14)` };
  }
  if (to === prior.state) {
    return { ok: false, code: LIVENESS_STATE_INVALID, sentence: `${LIVENESS_STATE_INVALID}: ${spec.tileId} is already ${prior.state} — a ceremony that changes nothing is not a ceremony (D-450)` };
  }
  if (!(LAWFUL_TRANSITIONS[prior.state] as readonly string[]).includes(to)) {
    return { ok: false, code: LIVENESS_STATE_INVALID, sentence: `${LIVENESS_STATE_INVALID}: the transition ${prior.state}→${to} is not in the state machine; lifecycle is law, not improvisation (D-450, Ω-14)` };
  }
  const wakeProof = {
    gateRef: spec.gateRef,
    hydratedAt: spec.at,
    digest: `sha256:${sha256Hex(canonicalJson({ tileId: spec.tileId, to, gateRef: spec.gateRef, at: spec.at }))}`,
  };
  const row: LivenessRow = {
    tileId: spec.tileId,
    state: to,
    since: spec.at,
    budgetRef: spec.budgetRef,
    ...(prior.weightMB !== undefined ? { weightMB: prior.weightMB } : {}),
    wakeProof,
    by: spec.by,
  };
  const transition: TransitionRow = {
    kind: "liveness.transition@1",
    tileId: spec.tileId,
    from: prior.state,
    to,
    reason: `wake${spec.profileRef !== undefined ? ` (${spec.profileRef})` : ""}`,
    budgetRef: spec.budgetRef,
    by: spec.by,
    at: spec.at,
  };
  return { ok: true, row, transition };
}

/** THE ghost law (D-450, §6): ghosts watch, they never write. A ghost's
 *  mutation attempt is the crime — no queued write exists anywhere. */
export function attemptWrite(tileId: string, prior: LivenessRow | null): WriteOutcome {
  if (prior === null) {
    return { ok: false, code: LIVENESS_STATE_DRIFT, sentence: `${LIVENESS_STATE_DRIFT}: ${tileId} attempts a mutation but no liveness row derives any state for it; a liveness the rows cannot derive is a liveness the badge may not print (D-450)` };
  }
  if (prior.state === "ghost") {
    return { ok: false, code: LIVENESS_GHOST_WRITE, sentence: `${LIVENESS_GHOST_WRITE}: a ghost attempted a mutation (${tileId}); ghosts watch, they never write — wake first, through the gate, and no write is queued anywhere in the tree (D-450, Ω-14, §6)` };
  }
  return { ok: true };
}

/** THE proof signing (D-450): only a dormant thing naps — the proof is its
 *  testimony, signed by the realization identity, citing the watched revision
 *  it resumes from. */
export function signProof(
  spec: { tileId: string; signedBy: string; watchedRev: number; at: number },
  prior: LivenessRow | null,
): SignOutcome {
  if (prior === null) {
    return { ok: false, code: LIVENESS_STATE_DRIFT, sentence: `${LIVENESS_STATE_DRIFT}: ${spec.tileId} signs a dormancy proof but no liveness row derives any state for it (D-450)` };
  }
  if (prior.state !== "dormant") {
    return { ok: false, code: LIVENESS_STATE_DRIFT, sentence: `${LIVENESS_STATE_DRIFT}: ${spec.tileId} is ${prior.state}, not dormant — dormancy proofs are the napping thing's testimony, and only a nap can be proven (D-450)` };
  }
  if (typeof spec.signedBy !== "string" || spec.signedBy.length === 0 || !Number.isFinite(spec.watchedRev) || spec.watchedRev < 0) {
    return { ok: false, code: LIVENESS_PROOF_STALE, sentence: `${LIVENESS_PROOF_STALE}: the proof for ${spec.tileId} names no signer or no watched revision — testimony without a witness is not testimony (D-450)` };
  }
  const proof: DormancyProof = {
    kind: "liveness.proof@1",
    tileId: spec.tileId,
    watchedRev: spec.watchedRev,
    signedBy: spec.signedBy,
    at: spec.at,
    digest: `sha256:${sha256Hex(canonicalJson({ tileId: spec.tileId, watchedRev: spec.watchedRev, signedBy: spec.signedBy, at: spec.at }))}`,
  };
  return { ok: true, proof };
}

/** THE probe (D-450): the dormancy proof, judged. A proof whose bytes the
 *  fold cannot re-derive is drift; a proof older than the declared watch
 *  cadence (in time or in watched revisions) means the watch died — and the
 *  nap is now a death. */
export function probe(
  tileId: string,
  proof: DormancyProof | null,
  spec: { now: number; watchWindowMs: number; currentWatchRev: number; watchWindowRevs: number },
): ProbeOutcome {
  if (proof === null) {
    return { ok: false, code: LIVENESS_PROOF_STALE, sentence: `${LIVENESS_PROOF_STALE}: no dormancy proof exists for ${tileId} — an unprovable nap is indistinguishable from death until the wake fails (D-450)` };
  }
  const rederived = `sha256:${sha256Hex(canonicalJson({ tileId: proof.tileId, watchedRev: proof.watchedRev, signedBy: proof.signedBy, at: proof.at }))}`;
  if (rederived !== proof.digest) {
    return { ok: false, code: LIVENESS_STATE_DRIFT, sentence: `${LIVENESS_STATE_DRIFT}: the dormancy proof for ${tileId} does not re-derive — testimony the fold cannot reproduce is a claim, not a proof (D-450)` };
  }
  const aged = spec.now - proof.at > spec.watchWindowMs;
  const lagged = spec.currentWatchRev - proof.watchedRev > spec.watchWindowRevs;
  if (aged || lagged) {
    return { ok: false, code: LIVENESS_PROOF_STALE, sentence: `${LIVENESS_PROOF_STALE}: the dormancy proof for ${tileId} cites watched revision ${proof.watchedRev} (now ${spec.currentWatchRev}) aged ${spec.now - proof.at}ms against a ${spec.watchWindowMs}ms watch cadence; the watch died, and the nap is now a death (D-450, Ω-14)` };
  }
  return { ok: true, proof };
}

/** The stethoscope (D-435's two-sided handshake): what a plan reads when it
 *  needs this realization — `blockedOn: liveness` citing the state row. */
export function stethoscope(prior: LivenessRow | null, tileId: string): StethoscopeVerdict {
  const stateRef = `${LIVENESS_NS}:state:${tileId}`;
  if (prior === null) {
    return { tileId, blocked: true, blocker: "liveness", state: "ghost", stateRef, detail: `no liveness row for ${tileId} — the plan cannot cite a state that does not exist (D-450)` };
  }
  if (prior.state === "hydrated") {
    return { tileId, blocked: false, blocker: "liveness", state: prior.state, stateRef, detail: `hydrated since ${prior.since} — the realization is live (D-450)` };
  }
  return { tileId, blocked: true, blocker: "liveness", state: prior.state, stateRef, detail: `${prior.state} since ${prior.since}${prior.badgeSentence !== undefined ? ` — ${prior.badgeSentence}` : ""}; wake it through the ceremony (D-450)` };
}

/** The headless render: liveness.read answers every question the badge could
 *  print — states, the badge sentences, proofs. */
export function renderLiveness(rows: readonly LivenessRow[], proofs: readonly DormancyProof[]): string {
  const lines = [`liveness.read — ${rows.length} tile(s), ${proofs.length} proof(s)`];
  for (const r of [...rows].sort((a, b) => (a.tileId < b.tileId ? -1 : 1))) {
    lines.push(`  ${r.tileId}: ${r.state} since ${r.since}${r.weightMB !== undefined ? ` (${r.weightMB}MB)` : ""}${r.budgetRef !== undefined ? ` budget ${r.budgetRef}` : ""}${r.wakeProof !== undefined ? ` wake-proven` : ""}${r.badgeSentence !== undefined ? ` — "${r.badgeSentence}"` : ""}`);
  }
  for (const p of [...proofs].sort((a, b) => a.at - b.at)) {
    lines.push(`  proof ${p.tileId} @ rev ${p.watchedRev} by ${p.signedBy} at ${p.at} (${p.digest.slice(0, 22)}…)`);
  }
  return lines.join("\n");
}

/** The in-plugin registry (ring-first; the vault mirror rides port caps). */
export class LivenessRegistry {
  private rows = new Map<string, LivenessRow>();
  private history: TransitionRow[] = [];
  private proofs = new Map<string, DormancyProof[]>();
  private watchRev = 0;

  set(spec: Parameters<typeof setLiveness>[0]): SetOutcome {
    const out = setLiveness(spec, this.rows.get(spec.tileId) ?? null);
    if (out.ok) {
      this.rows.set(out.row.tileId, out.row);
      this.history.push(out.transition);
    }
    return out;
  }

  /** The wake ceremony, registry-folded: the committed MB is derived from the
   *  hydrated rows themselves — the budget check reads the tree, not a vibe. */
  wake(spec: Parameters<typeof wake>[0]): WakeOutcome {
    const out = wake(spec, this.rows.get(spec.tileId) ?? null, this.committedMB());
    if (out.ok) {
      this.rows.set(out.row.tileId, out.row);
      this.history.push(out.transition);
    }
    return out;
  }

  attemptWrite(tileId: string): WriteOutcome {
    return attemptWrite(tileId, this.rows.get(tileId) ?? null);
  }

  signProof(spec: Parameters<typeof signProof>[0]): SignOutcome {
    const out = signProof(spec, this.rows.get(spec.tileId) ?? null);
    if (out.ok) {
      const list = this.proofs.get(spec.tileId) ?? [];
      list.push(out.proof);
      this.proofs.set(spec.tileId, list.slice(-8)); // proofs are cheap, frequent, regenerable — the last 8 ride
    }
    return out;
  }

  probe(tileId: string, spec: { now: number; watchWindowMs: number; watchWindowRevs: number }): ProbeOutcome {
    const list = this.proofs.get(tileId) ?? [];
    return probe(tileId, list.length > 0 ? list[list.length - 1]! : null, { ...spec, currentWatchRev: this.watchRev });
  }

  /** The vault watch's revision tick — proofs cite it; the probe judges lag
   *  against it (D-440's substrate, cited from the boundary above it). */
  watchTick(): number {
    this.watchRev += 1;
    return this.watchRev;
  }

  stethoscope(tileId: string): StethoscopeVerdict {
    return stethoscope(this.rows.get(tileId) ?? null, tileId);
  }

  committedMB(): number {
    let total = 0;
    for (const r of this.rows.values()) if (r.state === "hydrated") total += r.weightMB ?? 0;
    return total;
  }

  get(tileId: string): LivenessRow | null { return this.rows.get(tileId) ?? null; }
  historyOf(tileId?: string): TransitionRow[] { return this.history.filter((t) => tileId === undefined || t.tileId === tileId); }
  proofList(): DormancyProof[] { return [...this.proofs.values()].flat().sort((a, b) => a.at - b.at); }

  /** The headless read: rows, history, proofs — the badge sentences included. */
  read(): { rows: LivenessRow[]; history: TransitionRow[]; proofs: DormancyProof[]; rendered: string } {
    const rows = [...this.rows.values()].sort((a, b) => (a.tileId < b.tileId ? -1 : 1));
    return { rows, history: this.history, proofs: this.proofList(), rendered: renderLiveness(rows, this.proofList()) };
  }
}
