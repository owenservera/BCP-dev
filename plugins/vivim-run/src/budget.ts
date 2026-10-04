// vivim-run/src/budget.ts (D-442, Ω-2 — the governance/budget substrate, re-materialized spec paper D-426)
//
// No resource without a budget (§18): every metered scope DECLARES before it
// runs, burns against the declaration attributable to a principal, and
// exhausts LOUDLY — a quiet freeze is a lie of omission. Burn rows are
// SAMPLED at the declared cadence (measuring the meter is the failure mode);
// enforcement stays exact. The fold over declaration + burn rows is the only
// truth — no stored summary exists to disagree.
//
// Pure core: the ops layer supplies `now`; the vault mirror rides port caps
// when present (ring-first, the health.ts precedent). No timers, no I/O.

export const GOV_BUDGET_NS = "gov.budget";
export const GOV_BURN_NS = "gov.burn";
export const GOV_BUDGET_UNDECLARED = "GOV_BUDGET_UNDECLARED";
export const GOV_BUDGET_SCOPE_INVALID = "GOV_BUDGET_SCOPE_INVALID";
export const GOV_BUDGET_AMENDMENT_UNCITED = "GOV_BUDGET_AMENDMENT_UNCITED";
export const GOV_BUDGET_EXHAUSTED = "GOV_BUDGET_EXHAUSTED";
export const GOV_BUDGET_EXCEEDED = "GOV_BUDGET_EXCEEDED";

export const BUDGET_SCOPES = ["task", "plan", "watch", "context", "realization"] as const;
export type BudgetScope = (typeof BUDGET_SCOPES)[number];
export type Freshness = "CURRENT" | "LAGGING" | "STALE";

export interface BudgetLimits { cpuMs: number; memMB: number; opsCount?: number }

/** The accounting window — the SAMPLE cadence is itself a declared limit field. */
export interface BudgetWindow { burnIntervalMs: number }

export interface BudgetDeclaration {
  budgetId: string;
  principal: string;        // burn accrues here — "who melted the laptop" answers from this row
  scope: BudgetScope;
  limits: BudgetLimits;
  window: BudgetWindow;
  basis: string;            // the citation: manifest runtime.budget · plan budgetMs · run.submit deadlineMs
  supersedes?: string;      // amendment: a NEW row citing the prior declaration's ref, never an edit
  at: number;
}

export interface Spend { cpuMs?: number; memMB?: number; opsCount?: number }
export type ExactSpend = { cpuMs: number; memMB: number; opsCount: number };

/** One SAMPLED burn row (ns gov.burn) — the cadence batches the accounting, never the enforcement. */
export interface BurnSample {
  kind: "gov.burn@1";
  budgetId: string;
  consumer: string;         // who spent — attribution rides every row
  at: number;               // the sample's close
  from: number;             // the interval the sample covers [from, at]
  spent: ExactSpend;        // the summed spend of the interval
  refs: string[];
}

export type BudgetVerdictState = "CURRENT" | "EXHAUSTED" | "EXCEEDED";

export interface BudgetVerdict {
  ok: boolean;              // false only for refusals — refused work never records
  code?: string;            // EXHAUSTED rides an ok verdict: a visible state, not a refusal
  sentence?: string;
  budgetId: string;
  consumer: string;
  state: BudgetVerdictState;
  consumed: ExactSpend;
  limits: BudgetLimits;
}

export type DeclareOutcome = { ok: true; row: BudgetDeclaration; amendmentOf: string | null } | { ok: false; code: string; sentence: string };

/** The append-only row ref — amendments cite the prior row's ref, never edit it. */
export function declarationRef(decl: BudgetDeclaration): string {
  return `${GOV_BUDGET_NS}:${decl.budgetId}@${decl.at}`;
}

function zeroSpend(): ExactSpend { return { cpuMs: 0, memMB: 0, opsCount: 0 }; }

function addSpend(a: ExactSpend, b: Spend): ExactSpend {
  return {
    cpuMs: a.cpuMs + (b.cpuMs ?? 0),
    memMB: a.memMB + (b.memMB ?? 0),
    opsCount: a.opsCount + (b.opsCount ?? 0),
  };
}

/** THE pure consumption fold (D-442): sum the sampled rows (+ accrued unsampled spend). */
export function foldSpent(samples: readonly BurnSample[], budgetId?: string, accrued?: Spend): ExactSpend {
  let out = zeroSpend();
  for (const s of samples) {
    if (budgetId !== undefined && s.budgetId !== budgetId) continue;
    out = addSpend(out, s.spent);
  }
  if (accrued !== undefined) out = addSpend(out, accrued);
  return out;
}

function limitsText(consumed: ExactSpend, limits: BudgetLimits): string {
  const ops = limits.opsCount !== undefined ? ` · ops ${consumed.opsCount}/${limits.opsCount}` : "";
  return `cpuMs ${consumed.cpuMs}/${limits.cpuMs} · memMB ${consumed.memMB}/${limits.memMB}${ops}`;
}

/** THE declaration door (D-442): malformed budgets refuse, named; nothing declares. */
export function validateDeclaration(
  decl: BudgetDeclaration,
  prior: BudgetDeclaration | null,
): DeclareOutcome {
  if (typeof decl.budgetId !== "string" || decl.budgetId.length === 0) {
    return { ok: false, code: GOV_BUDGET_SCOPE_INVALID, sentence: `${GOV_BUDGET_SCOPE_INVALID}: budgetId must be a non-empty string (D-442)` };
  }
  if (!(BUDGET_SCOPES as readonly string[]).includes(decl.scope as string)) {
    return { ok: false, code: GOV_BUDGET_SCOPE_INVALID, sentence: `${GOV_BUDGET_SCOPE_INVALID}: a budget must name task · plan · watch · context · realization; ${JSON.stringify(decl.scope)} names nothing meterable (D-442, Ω-2)` };
  }
  const lim = decl.limits as Partial<BudgetLimits> | null;
  if (lim === null || typeof lim !== "object"
    || typeof lim.cpuMs !== "number" || !Number.isFinite(lim.cpuMs) || lim.cpuMs < 0
    || typeof lim.memMB !== "number" || !Number.isFinite(lim.memMB) || lim.memMB < 0) {
    return { ok: false, code: GOV_BUDGET_SCOPE_INVALID, sentence: `${GOV_BUDGET_SCOPE_INVALID}: limits must carry finite non-negative cpuMs and memMB (got ${JSON.stringify(decl.limits)}) (D-442)` };
  }
  const win = decl.window as Partial<BudgetWindow> | null;
  if (win === null || typeof win !== "object" || typeof win.burnIntervalMs !== "number" || !Number.isFinite(win.burnIntervalMs) || win.burnIntervalMs < 0) {
    return { ok: false, code: GOV_BUDGET_SCOPE_INVALID, sentence: `${GOV_BUDGET_SCOPE_INVALID}: the accounting window must carry a finite non-negative burnIntervalMs — the sample cadence is itself a declared limit field (D-442)` };
  }
  if (prior !== null) {
    // amendment: append-only — a NEW row citing the prior one, never an edit
    if (typeof decl.basis !== "string" || decl.basis.length === 0 || decl.supersedes !== declarationRef(prior)) {
      return { ok: false, code: GOV_BUDGET_AMENDMENT_UNCITED, sentence: `${GOV_BUDGET_AMENDMENT_UNCITED}: amending budget ${decl.budgetId} requires a basis citation and the prior declaration's ref (${declarationRef(prior)}) — budgets move by evidence, not by vibes (D-442, Ω-2)` };
    }
  }
  return { ok: true, row: decl, amendmentOf: prior !== null ? declarationRef(prior) : null };
}

/**
 * THE assert fold (D-442) — pure over its inputs: the declaration, the burn
 * rows, and the accrued unsampled spend. Over-consumption refuses
 * GOV_BUDGET_EXCEEDED naming the budget AND the consumer; landing exactly at
 * the limits is the visible EXHAUSTED state (the work ran, the budget is
 * spent); no declaration refuses GOV_BUDGET_UNDECLARED (§18).
 */
export function assertBudget(
  budgetId: string,
  decl: BudgetDeclaration | undefined,
  consumer: string,
  spend: Spend,
  samples: readonly BurnSample[],
  accrued?: Spend,
): BudgetVerdict {
  const consumed = foldSpent(samples, budgetId, accrued);
  if (decl === undefined) {
    return {
      ok: false, code: GOV_BUDGET_UNDECLARED,
      sentence: `${GOV_BUDGET_UNDECLARED}: budget ${budgetId} has no declaration — this scope wants to run metered resources and nothing live runs unmetered (§18); the request by ${consumer} is refused (D-442, Ω-2)`,
      budgetId, consumer, state: "EXCEEDED", consumed, limits: { cpuMs: 0, memMB: 0 },
    };
  }
  const next = addSpend(consumed, spend);
  const over = next.cpuMs > decl.limits.cpuMs
    || next.memMB > decl.limits.memMB
    || (decl.limits.opsCount !== undefined && next.opsCount > decl.limits.opsCount);
  if (over) {
    return {
      ok: false, code: GOV_BUDGET_EXCEEDED,
      sentence: `${GOV_BUDGET_EXCEEDED}: budget ${budgetId} is exhausted (${limitsText(next, decl.limits)}); the work by ${consumer} is refused — degrade by declared policy or amend the budget with a cited basis (D-442, Ω-2)`,
      budgetId, consumer, state: "EXCEEDED", consumed, limits: decl.limits,
    };
  }
  const atLimit = (next.cpuMs === decl.limits.cpuMs && decl.limits.cpuMs > 0)
    || (next.memMB === decl.limits.memMB && decl.limits.memMB > 0)
    || (decl.limits.opsCount !== undefined && next.opsCount === decl.limits.opsCount);
  if (atLimit) {
    return {
      ok: true, code: GOV_BUDGET_EXHAUSTED,
      sentence: `${GOV_BUDGET_EXHAUSTED}: budget ${budgetId} reached its limits exactly (${limitsText(next, decl.limits)}) — the budget is spent, the state is visible, and the next unit of work by ${consumer} refuses GOV_BUDGET_EXCEEDED (D-442)`,
      budgetId, consumer, state: "EXHAUSTED", consumed: next, limits: decl.limits,
    };
  }
  return { ok: true, budgetId, consumer, state: "CURRENT", consumed: next, limits: decl.limits };
}

/** The derived burn-vs-declared view row — computed, never stored. */
export interface BudgetViewRow {
  budgetId: string;
  principal: string;
  scope: BudgetScope;
  limits: BudgetLimits;
  consumed: ExactSpend;
  freshness: Freshness;
  exhausted: boolean;
  predictedExhaustionMs: number | null;
  consumers: string[];        // who spent — attribution answers from the view rows
  samples: number;
  amendments: number;
}

/** The headless listing: text, exhausted first. */
export function renderBudgetState(rows: readonly BudgetViewRow[]): string {
  const sorted = [...rows].sort((a, b) => {
    const rank = (r: BudgetViewRow) => (r.exhausted ? 0 : r.freshness === "STALE" ? 1 : r.freshness === "LAGGING" ? 2 : 3);
    return rank(a) - rank(b) || (a.budgetId < b.budgetId ? -1 : 1);
  });
  const lines = [`budget.read — ${rows.length} budget(s), exhausted first`];
  for (const r of sorted) {
    const state = r.exhausted ? "EXHAUSTED" : r.freshness;
    const predicted = r.predictedExhaustionMs !== null ? ` — predicted exhaustion in ${Math.round(r.predictedExhaustionMs)}ms` : "";
    const consumers = r.consumers.length > 0 ? ` — consumers ${r.consumers.join(",")}` : "";
    lines.push(`  ${state.padEnd(9)} ${r.budgetId} (${r.scope}, principal ${r.principal}) — ${limitsText(r.consumed, r.limits)} — freshness ${r.freshness}${predicted}${consumers} — ${r.samples} sample(s), ${r.amendments} amendment(s)`);
  }
  return lines.join("\n");
}

/** The in-plugin ledger (ring-first; the vault mirror rides port caps). */
export class BudgetLedger {
  private declarations: BudgetDeclaration[] = [];   // ns gov.budget — append-only
  private samples: BurnSample[] = [];               // ns gov.burn — sampled, not per-op
  private pending = new Map<string, { consumer: string; spend: ExactSpend; from: number }>(); // budgetId::consumer
  private clock = new Map<string, number>();         // budgetId → the sample-tick clock (starts at first burn)

  declare(decl: BudgetDeclaration): DeclareOutcome {
    const prior = this.current(decl.budgetId);
    const v = validateDeclaration(decl, prior);
    if (!v.ok) return v;
    this.declarations.push(v.row);
    return v;
  }

  /** Records consumption — refuses when exceeded (refused work never spends). */
  consume(budgetId: string, consumer: string, spend: Spend, now: number): BudgetVerdict {
    const decl = this.current(budgetId) ?? undefined;
    const verdict = assertBudget(budgetId, decl, consumer, spend, this.samples, this.accrued(budgetId));
    if (!verdict.ok) return verdict;
    // accrue — enforcement counts every unit, sampled or pending
    const key = `${budgetId}::${consumer}`;
    const p = this.pending.get(key) ?? { consumer, spend: zeroSpend(), from: now };
    p.spend = addSpend(p.spend, spend);
    this.pending.set(key, p);
    // the tick clock starts at the first burn
    if (!this.clock.has(budgetId)) this.clock.set(budgetId, now);
    // the SAMPLE cadence: rows batch at the tick, the fold never does
    const cadence = decl!.window;
    if (now - this.clock.get(budgetId)! >= cadence.burnIntervalMs) {
      for (const [k, pend] of this.pending) {
        if (!k.startsWith(`${budgetId}::`)) continue;
        this.samples.push({ kind: "gov.burn@1", budgetId, consumer: pend.consumer, at: now, from: pend.from, spent: pend.spend, refs: [`${GOV_BUDGET_NS}:${budgetId}`] });
        this.pending.delete(k);
      }
      this.clock.set(budgetId, now);
    }
    return verdict;
  }

  /** The derived view (the fold, recomputed every call — never a stored summary). */
  read(budgetId: string | undefined, now: number): { rows: BudgetViewRow[]; rendered: string } {
    const ids = budgetId !== undefined ? [budgetId] : this.list();
    const rows: BudgetViewRow[] = [];
    for (const id of ids) {
      const decl = this.current(id) ?? undefined;
      if (decl === undefined) continue;
      const mine = this.samples.filter((s) => s.budgetId === id);
      const consumed = foldSpent(this.samples, id, this.accrued(id));
      const exhausted = consumed.cpuMs === decl.limits.cpuMs && decl.limits.cpuMs > 0
        || consumed.memMB === decl.limits.memMB && decl.limits.memMB > 0
        || decl.limits.opsCount !== undefined && consumed.opsCount === decl.limits.opsCount;
      const { burnIntervalMs: interval } = decl.window;
      const tick = this.clock.get(id);
      const freshness: Freshness = tick === undefined
        ? "CURRENT" // never burned — nothing to be stale about
        : now - tick <= interval ? "CURRENT" : now - tick <= 2 * interval ? "LAGGING" : "STALE";
      let predictedExhaustionMs: number | null = null;
      if (mine.length >= 2 && consumed.cpuMs > 0) {
        const elapsed = mine[mine.length - 1]!.at - mine[0]!.at;
        if (elapsed > 0 && consumed.cpuMs < decl.limits.cpuMs) {
          predictedExhaustionMs = ((decl.limits.cpuMs - consumed.cpuMs) * elapsed) / consumed.cpuMs;
        } else if (elapsed > 0 && consumed.cpuMs >= decl.limits.cpuMs) predictedExhaustionMs = 0;
      }
      const consumers = [
        ...new Set([
          ...mine.map((s) => s.consumer),
          ...[...this.pending.keys()].filter((k) => k.startsWith(`${id}::`)).map((k) => k.slice(id.length + 2)),
        ]),
      ].sort();
      rows.push({
        budgetId: id, principal: decl.principal, scope: decl.scope, limits: decl.limits,
        consumed, freshness, exhausted, predictedExhaustionMs, consumers,
        samples: mine.length, amendments: this.declarations.filter((d) => d.budgetId === id).length - 1,
      });
    }
    return { rows, rendered: renderBudgetState(rows) };
  }

  list(): string[] {
    return [...new Set(this.declarations.map((d) => d.budgetId))].sort();
  }

  sampleRows(): readonly BurnSample[] { return this.samples; }

  private current(budgetId: string): BudgetDeclaration | null {
    let out: BudgetDeclaration | null = null;
    for (const d of this.declarations) if (d.budgetId === budgetId) out = d; // the latest row is current (append-only)
    return out;
  }

  private accrued(budgetId: string): Spend {
    const out = zeroSpend();
    for (const [k, p] of this.pending) if (k.startsWith(`${budgetId}::`)) out.cpuMs += p.spend.cpuMs, out.memMB += p.spend.memMB, out.opsCount += p.spend.opsCount;
    return out;
  }
}
