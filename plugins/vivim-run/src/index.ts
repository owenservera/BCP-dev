// vivim.run — index.ts: the Ω3 spine plugin.
// Scheduling policy only: the µhost owns transport (spawn/terminate/stats);
// we administer compartment lifecycle through capability-gated host ops.
// Ops contributed: run.submit@1 (bounded task execution), run.stats@1,
// run.health@1 (compartment snapshot + quarantine ledger + event ring).
import { cpus } from "node:os"; // capacity default reads machine shape — OS contact outside the os-surface fence BY DESIGN (the fence covers tmp/platform/chmod; cpus() is the named seventh touchpoint, grandfathered — see MERGED-MASTER ISS-020)
import { setTimeout as nodeSetTimeout } from "node:timers";
import { definePlugin, startPlugin } from "@vivim/omega-shim";
import { TaskPool, type SubmitOutcome, type TaskResult } from "./pool.ts";
import { clampDeadline, normalizePriority, type TaskRequest } from "./queue.ts";
import { HealthMonitor } from "./health.ts";
import { ProcessBroker, parseBrokerConfig, type ProcessCallRequest } from "./process-broker.ts";
import { PlanRegistry, renderPlanState, type RegisteredPlan } from "./planstate.ts";
import { renderWatchList, WatchRegistry } from "./watch.ts";
import { BudgetLedger } from "./budget.ts";
import { ContextRegistry, renderContextWindow } from "./context.ts";
import { BadgeRegistry } from "./badge.ts";
import { LayoutRegistry, renderLayout } from "./layout.ts";
import { defaultSimExec, renderSimReceipt, SimulationRegistry } from "./simulation.ts";
import { intervene } from "./intervene.ts";
import { deprecate, lifecycleView, useCapability, type LifecycleRow } from "./capability.ts";
import { TrustRegistry, renderKey } from "./trust.ts";
import { AnalyticsRegistry } from "./analytics.ts";
import { ApertureRegistry, isWidth, scopeRowId, type Width } from "./aperture.ts";
import { PartialEvalRegistry, renderPartial } from "./partialeval.ts";
import { isLivenessState, LivenessRegistry } from "./liveness.ts";

function metaFrom(p: Record<string, unknown>): string {
  const by = p["__caller"];
  return typeof by === "string" && by.length > 0 ? by : "unknown";
}

/** run.submit never blocks the caller past deadline + this slack (Ω3 budget law). */
const SUBMIT_SLACK_MS = 2_000;

const sleep = (ms: number): Promise<void> => new Promise((r) => nodeSetTimeout(r, ms));

function defaultCapacity(): number {
  return Math.max(2, Math.floor(cpus().length / 2));
}

let pool: TaskPool | null = null;
let health: HealthMonitor | null = null;
let broker: ProcessBroker | null = null;
let plans: PlanRegistry | null = null;              // D-435: the plan registry (exec.inspect/intervene substrate)
let watches: WatchRegistry | null = null;            // D-440: the watch substrate registry (Ω-1)
let budgets: BudgetLedger | null = null;              // D-442: the budget substrate ledger (Ω-2)
let contexts: ContextRegistry | null = null;          // D-443: the context substrate registry (Ω-3)
const badges = new BadgeRegistry();                    // D-441: the badge substrate registry (Ω-7)
const layouts = new LayoutRegistry();                  // D-446: the layout substrate registry (Ω-6)
const sims = new SimulationRegistry();                // D-447: the simulation substrate registry (Ω-8)
const trusts = new TrustRegistry();                    // D-444: the trust substrate registry (Ω-4)
const analytics = new AnalyticsRegistry();              // D-445: the analytics substrate registry (Ω-5)
const apertures = new ApertureRegistry();              // D-448: the aperture registry (Ω-9)
const partials = new PartialEvalRegistry();            // D-449: the partial-evaluation registry (Ω-10)
const liveness = new LivenessRegistry();               // D-450: the liveness registry (Ω-14)
const capabilities = new Map<string, LifecycleRow>(); // D-435: the capability lifecycle rows (ns capability.lifecycle)

function watchdogOutcome(req: TaskRequest, deadlineMs: number): TaskResult {
  return {
    accepted: true,
    taskId: "watchdog",
    op: String(req.op ?? ""),
    priority: normalizePriority(req.priority),
    status: "error",
    freshness: "STALE",
    result: {
      ok: false,
      error: "BUDGET",
      detail: `run.submit watchdog: task did not settle within deadline ${deadlineMs}ms + ${SUBMIT_SLACK_MS}ms slack`,
    },
    deadlineMs,
    queuedMs: 0,
    execMs: 0,
    totalMs: deadlineMs + SUBMIT_SLACK_MS,
  };
}

startPlugin(
  definePlugin({
    onInit(ctx) {
      const raw = (ctx.config as { capacity?: unknown } ?? {}).capacity;
      const capacity =
        typeof raw === "number" && Number.isFinite(raw) && raw >= 1
          ? Math.floor(raw)
          : defaultCapacity();
      pool = new TaskPool({ capacity, caller: ctx.port, log: (m) => ctx.log(`[run] ${m}`) });
      health = new HealthMonitor({ caller: ctx.port, log: (m) => ctx.log(`[health] ${m}`) });
      health.start();
      // D-374: the polyglot process tier — pools live ONLY in signed config (composition data passthrough)
      broker = new ProcessBroker(parseBrokerConfig(ctx.config, (m) => ctx.log(m)), (m) => ctx.log(m));
      plans = new PlanRegistry();
      watches = new WatchRegistry();
      budgets = new BudgetLedger();
      contexts = new ContextRegistry();
      ctx.log(`vivim.run booted: capacity=${capacity} (cpus=${cpus().length})`);
    },

    onShutdown() {
      health?.stop();
      void broker?.shutdownAll();
    },

    ops: {
      "run.submit@1": (payload: unknown): Promise<SubmitOutcome> => {
        const req = (payload ?? {}) as TaskRequest;
        const deadlineMs = clampDeadline(req.deadlineMs);
        // bounded by deadline + slack — a lost task can never hang a caller
        return Promise.race([
          pool!.submit(req),
          sleep(deadlineMs + SUBMIT_SLACK_MS).then(() => watchdogOutcome(req, deadlineMs)),
        ]);
      },

      "run.stats@1": () => pool!.stats(),

      "run.health@1": () => health!.snapshot(50),

      // D-374: the polyglot process tier — one routable op, pools from signed config only
      "run.process.call@1": (payload: unknown): Promise<ProcessCallResult> => {
        const req = (payload ?? {}) as ProcessCallRequest;
        return broker!.call(req);
      },

      // ---- D-435 (Ω-3.5): the execution debugging door + the capability lifecycle ----

      // contract: exec.inspect@1 — the plan.state derived view (live), with stall sweep.
      "exec.inspect@1": (payload: unknown) => {
        const p = (payload ?? {}) as Record<string, unknown>;
        const registry = plans!;
        const now = Date.now();
        if (typeof p["planId"] === "string" && p["planId"].length > 0) {
          const state = registry.stateOf(p["planId"], now);
          const stalls = registry.stallCheck(now).filter((e) => e.planId === p["planId"]);
          return { state, stalls, rendered: renderPlanState(state) };
        }
        // no planId: the ps view — every plan, stalled first (omega:exec ps)
        const states = registry.list().map((id) => registry.stateOf(id, now));
        states.sort((a, b) => (a.stalled === b.stalled ? a.planId.localeCompare(b.planId) : a.stalled ? -1 : 1));
        const stalls = registry.stallCheck(now);
        return { states, stalls, rendered: states.map(renderPlanState).join("\n\n") || "(no plans registered)" };
      },

      // contract: exec.intervene@1 — the four verbs, law-gated and ledgered (the op IS the gate witness).
      "exec.intervene@1": (payload: unknown) => {
        const p = (payload ?? {}) as Record<string, unknown>;
        const planId = p["planId"];
        const verb = p["verb"];
        if (typeof planId !== "string" || planId.length === 0) throw new Error("exec.intervene@1: planId must be a non-empty string");
        if (verb !== "pause" && verb !== "resume" && verb !== "step" && verb !== "cancel") {
          throw new Error(`exec.intervene@1: verb must be pause|resume|step|cancel (got ${JSON.stringify(verb)}) (D-435)`);
        }
        const stepId = typeof p["stepId"] === "string" ? p["stepId"] : undefined;
        // the op layer IS the gated path (the law gate dispatches here); the
        // ungated refusal fires when the pure core is called around it — the
        // falsifier proves both. Here: gated by construction, caller from meta.
        const out = intervene(plans!, planId, verb, { gated: true, from: metaFrom(p) }, Date.now(), stepId);
        if (!out.ok) throw new Error(out.sentence);
        return out.row; // the ledger row (the caller persists it; the op is its witness)
      },

      // contract: capability.deprecate@1 — census-first, successor-named, shim-windowed.
      "capability.deprecate@1": (payload: unknown) => {
        const p = (payload ?? {}) as Record<string, unknown>;
        const capability = p["capability"];
        if (typeof capability !== "string" || capability.length === 0) throw new Error("capability.deprecate@1: capability must be a non-empty string");
        const census = Array.isArray(p["census"]) ? (p["census"] as Array<Record<string, unknown>>) : [];
        const spec = {
          capability,
          ...(typeof p["successor"] === "string" && p["successor"].length > 0 ? { successor: p["successor"] } : {}),
          census: census.map((c, i) => ({ ref: String(c["ref"] ?? `census[${i}]`), kind: String(c["kind"] ?? "unknown") })),
          censusCited: p["census"] !== undefined, // the census must be TAKEN (present), even if empty
          decisionRef: String(p["decisionRef"] ?? ""),
          now: Date.now(),
          ...(typeof p["sunsetAfterMs"] === "number" ? { sunsetAfterMs: p["sunsetAfterMs"] } : {}),
        };
        const out = deprecate(spec);
        if (!out.ok) throw new Error(out.sentence);
        capabilities!.set(capability, out.row);
        return { row: lifecycleView(out.row), flagged: out.flagged };
      },

      // ---- D-440 (Ω-1): the watch substrate ops ----

      // contract: watch.register@1 — the registration door (malformed watches refuse, named).
      "watch.register@1": (payload: unknown) => {
        const p = (payload ?? {}) as Record<string, unknown>;
        const reg = {
          watchId: String(p["watchId"] ?? ""),
          principal: String(p["principal"] ?? (p["__caller"] ?? "unknown")),
          scope: p["scope"],
          subject: String(p["subject"] ?? ""),
          predicate: p["predicate"],
          ...(typeof p["heartbeatMs"] === "number" ? { heartbeatMs: p["heartbeatMs"] } : {}),
          budgetRef: String(p["budgetRef"] ?? ""),
          action: p["action"] ?? "flag",
        };
        const out = watches!.register(reg as never);
        if (!out.ok) throw new Error(out.sentence);
        return { watchId: out.row.watchId, scope: out.row.scope, subject: out.row.subject };
      },

      // contract: watch.observe@1 — record one raw observation and return the evaluated verdict.
      "watch.observe@1": (payload: unknown) => {
        const p = (payload ?? {}) as Record<string, unknown>;
        const watchId = String(p["watchId"] ?? "");
        if (typeof p["raw"] !== "object" || p["raw"] === null) throw new Error("watch.observe@1: raw observation object required (D-440)");
        watches!.record(watchId, p["raw"] as never);
        if (typeof p["watcherHeartbeatAt"] === "number") watches!.watcherBeat(watchId, p["watcherHeartbeatAt"]);
        const sweep = watches!.sweep(Date.now()).filter((o) => o.watchId === watchId);
        return sweep[0] ?? null;
      },

      // ---- D-442 (Ω-2): the budget substrate ops ----

      // contract: budget.declare@1 — the declaration door (append-only; amendment cites the prior row's ref).
      "budget.declare@1": (payload: unknown) => {
        const p = (payload ?? {}) as Record<string, unknown>;
        const limits = (p["limits"] ?? {}) as Record<string, unknown>;
        const win = (p["window"] ?? {}) as Record<string, unknown>;
        const out = budgets!.declare({
          budgetId: String(p["budgetId"] ?? ""),
          principal: String(p["principal"] ?? (p["__caller"] ?? "unknown")),
          scope: p["scope"],
          limits: {
            cpuMs: Number(limits["cpuMs"] ?? NaN),
            memMB: Number(limits["memMB"] ?? NaN),
            ...(typeof limits["opsCount"] === "number" ? { opsCount: limits["opsCount"] } : {}),
          },
          window: { burnIntervalMs: Number(win["burnIntervalMs"] ?? NaN) },
          basis: String(p["basis"] ?? ""),
          ...(typeof p["supersedes"] === "string" ? { supersedes: p["supersedes"] } : {}),
          at: Date.now(),
        } as never);
        if (!out.ok) throw new Error(out.sentence);
        return { budgetId: out.row.budgetId, scope: out.row.scope, principal: out.row.principal, amendmentOf: out.amendmentOf };
      },

      // contract: budget.consume@1 — record consumption; refuses GOV_BUDGET_EXCEEDED when over (refused work never spends).
      "budget.consume@1": (payload: unknown) => {
        const p = (payload ?? {}) as Record<string, unknown>;
        const spend = (p["spend"] ?? {}) as Record<string, unknown>;
        const out = budgets!.consume(
          String(p["budgetId"] ?? ""),
          String(p["consumer"] ?? (p["__caller"] ?? "unknown")),
          {
            ...(typeof spend["cpuMs"] === "number" ? { cpuMs: spend["cpuMs"] } : {}),
            ...(typeof spend["memMB"] === "number" ? { memMB: spend["memMB"] } : {}),
            ...(typeof spend["opsCount"] === "number" ? { opsCount: spend["opsCount"] } : {}),
          },
          Date.now(),
        );
        if (!out.ok) throw new Error(out.sentence);
        // EXHAUSTED rides an ok verdict — a visible state, never a quiet freeze
        return { budgetId: out.budgetId, state: out.state, ...(out.code !== undefined ? { code: out.code, sentence: out.sentence } : {}), consumed: out.consumed, limits: out.limits };
      },

      // contract: budget.read@1 — the derived burn-vs-declared view (freshness, predicted exhaustion), headless.
      "budget.read@1": (payload: unknown) => {
        const p = (payload ?? {}) as Record<string, unknown>;
        const budgetId = typeof p["budgetId"] === "string" && p["budgetId"].length > 0 ? p["budgetId"] : undefined;
        const view = budgets!.read(budgetId, Date.now());
        return { rows: view.rows, rendered: view.rendered };
      },

      // ---- D-443 (Ω-3): the context substrate ops ----

      // contract: context.assemble@1 — the deterministic assembly fold (cited sources, named eviction, digest).
      "context.assemble@1": (payload: unknown) => {
        const p = (payload ?? {}) as Record<string, unknown>;
        const sources = Array.isArray(p["sources"])
          ? (p["sources"] as Array<Record<string, unknown>>).map((s) => ({ ns: String(s["ns"] ?? ""), role: String(s["role"] ?? "") }))
          : [];
        const eviction = Array.isArray(p["eviction"])
          ? (p["eviction"] as Array<Record<string, unknown>>).map((e) => ({ ns: String(e["ns"] ?? ""), rule: String(e["rule"] ?? "") }))
          : [];
        const rows = Array.isArray(p["rows"])
          ? (p["rows"] as Array<Record<string, unknown>>).map((r) => ({
              ns: String(r["ns"] ?? ""), id: String(r["id"] ?? ""), rev: Number(r["rev"] ?? 0),
              ...(typeof r["epistemicKind"] === "string" ? { epistemicKind: r["epistemicKind"] } : {}),
              bytes: String(r["bytes"] ?? ""),
            }))
          : [];
        const caps: Record<string, number> = {};
        if (p["caps"] !== null && typeof p["caps"] === "object") {
          for (const [k, v] of Object.entries(p["caps"] as Record<string, unknown>)) if (typeof v === "number") caps[k] = v;
        }
        const out = contexts!.assemble({
          assemblyId: typeof p["assemblyId"] === "string" ? p["assemblyId"] : "",
          principal: String(p["principal"] ?? (p["__caller"] ?? "unknown")),
          query: String(p["query"] ?? ""),
          sources,
          ...(eviction.length > 0 ? { eviction } : {}),
          budgetRef: String(p["budgetRef"] ?? ""),
          ...(Object.keys(caps).length > 0 ? { caps } : {}),
          rows,
          knownNamespaces: Array.isArray(p["namespaces"]) ? (p["namespaces"] as unknown[]).filter((x): x is string => typeof x === "string") : [],
          vaultVersion: Number(p["vaultVersion"] ?? 0),
        }, Date.now());
        if (!out.ok) throw new Error(out.sentence);
        return {
          assemblyId: out.row.assemblyId, digest: out.row.digest, cached: out.cached, v: out.row.v,
          included: out.row.sources.reduce((n, s) => n + s.included.length, 0),
        };
      },

      // contract: context.read@1 — fetch an assembly by id or digest; provenance rows ride along; the light call rides the version check.
      "context.read@1": (payload: unknown) => {
        const p = (payload ?? {}) as Record<string, unknown>;
        const principal = String(p["principal"] ?? (p["__caller"] ?? "unknown"));
        const key = typeof p["assemblyId"] === "string" && p["assemblyId"].length > 0
          ? p["assemblyId"]
          : typeof p["digest"] === "string" && p["digest"].length > 0 ? p["digest"] : "";
        if (key === "") throw new Error("context.read@1: assemblyId or digest required (D-443)");
        if (typeof p["vaultVersion"] === "number") {
          const light = contexts!.versionCheck(principal, key, p["vaultVersion"]);
          if (light.unchanged && light.row !== null) {
            return { unchanged: true, row: light.row, rendered: renderContextWindow(light.row) };
          }
        }
        const out = contexts!.read(key, principal);
        if (!out.ok) throw new Error(out.sentence);
        return { unchanged: false, row: out.row, rendered: out.rendered };
      },

      // contract: badge.mint@1 — the kernel ceremony assigns the tier (self-claims refused).
      "badge.mint@1": (payload: unknown) => {
        const p = (payload ?? {}) as Record<string, unknown>;
        const out = badges.mint({
          badgeId: String(p["badgeId"] ?? ""),
          subjectRef: String(p["subjectRef"] ?? ""),
          tier: String(p["tier"] ?? ""),
          assignedBy: String(p["assignedBy"] ?? "kernel:ceremony"),
          generality: (p["generality"] ?? "GEN_SPECULATIVE") as never,
          basis: String(p["basis"] ?? ""),
          notBefore: Number(p["notBefore"] ?? Date.now()),
          at: Number(p["at"] ?? Date.now()),
          ...(typeof p["subjectClaimedTier"] === "string" ? { subjectClaimedTier: p["subjectClaimedTier"] } : {}),
        });
        if (!out.ok) throw new Error(out.sentence);
        return { badgeId: out.row.badgeId, tier: out.row.tier, digest: badgePrint(out.row) };
      },

      // contract: badge.promote@1 — two resolvable, one independent (the static law at runtime).
      "badge.promote@1": (payload: unknown) => {
        const p = (payload ?? {}) as Record<string, unknown>;
        const evidence = Array.isArray(p["evidence"]) ? (p["evidence"] as unknown[]).filter((x): x is string => typeof x === "string") : [];
        const out = badges.promote(String(p["badgeId"] ?? ""), (p["to"] ?? "GEN_GENERIC") as never, evidence, (ref) => /^[Dc]/.test(ref), (a, b) => a.split(":")[0] !== b.split(":")[0], String(p["decisionRef"] ?? ""));
        if (!out.ok) throw new Error(out.sentence);
        return { badgeId: out.row.badgeId, generality: out.row.generality, evidence: out.row.promotionEvidence ?? [] };
      },

      // contract: badge.demote@1 — reason-carrying, scarring, never deleting.
      "badge.demote@1": (payload: unknown) => {
        const p = (payload ?? {}) as Record<string, unknown>;
        const row = badges.demote(String(p["badgeId"] ?? ""), (p["to"] ?? "untrusted") as never, String(p["reason"] ?? "breach"), Date.now());
        if (!row) throw new Error(`badge.demote@1: badge ${String(p["badgeId"])} not found (D-441)`);
        return { badgeId: row.badgeId, demotedTo: row.demotedTo, reason: row.demotionReason, print: badgePrint(row) };
      },

      // contract: badge.print@1 — THE renderer (surfaces may style, never source).
      "badge.print@1": (payload: unknown) => {
        const p = (payload ?? {}) as Record<string, unknown>;
        const text = badges.print(String(p["badgeId"] ?? ""));
        if (text === null) throw new Error(`badge.print@1: badge ${String(p["badgeId"])} not found (D-441)`);
        return { print: text };
      },

      // contract: watch.list@1 — the headless listing (escalated first).
      "watch.list@1": () => {
        const sweep = watches!.sweep(Date.now());
        return { rendered: renderWatchList(sweep), observations: sweep };
      },

      // contract: capability.lifecycle.read@1 — the honest view of one capability's lifecycle.
      "capability.lifecycle.read@1": (payload: unknown) => {
        const p = (payload ?? {}) as Record<string, unknown>;
        const capability = p["capability"];
        if (typeof capability !== "string" || capability.length === 0) throw new Error("capability.lifecycle.read@1: capability must be a non-empty string");
        const row = capabilities!.get(capability);
        if (!row) return { capability, state: "active" as const, note: "no lifecycle row — the capability was never deprecated" };
        const now = Date.now();
        const use = useCapability(row, capability, now);
        return { ...lifecycleView(row), useNow: use.ok ? { ok: true, routed: use.routed } : { ok: false, code: use.code, sentence: use.sentence } };
      },

      // ---- D-446 (Ω-6): the layout substrate ops (ns layout — canvas stays reserved) ----

      // contract: layout.snapshot@1 — record a versioned placement snapshot (digest-folded, geometry-gated, fork-refusing).
      "layout.snapshot@1": (payload: unknown) => {
        const p = (payload ?? {}) as Record<string, unknown>;
        const out = layouts.snapshot({
          layoutId: String(p["layoutId"] ?? ""),
          principal: String(p["principal"] ?? (p["__caller"] ?? "unknown")),
          tiles: Array.isArray(p["tiles"]) ? (p["tiles"] as never[]) : [],
          ...(typeof p["parentSnapshot"] === "string" && p["parentSnapshot"].length > 0 ? { parentSnapshot: p["parentSnapshot"] } : {}),
        });
        if (!out.ok) throw new Error(out.sentence);
        return { layoutId: out.row.layoutId, digest: out.row.digest, tiles: out.row.tiles.length, rendered: renderLayout(out.row) };
      },

      // contract: layout.restore@1 — verified re-hydration (digest-checked, never blind; refuses LAYOUT_DIGEST_MISMATCH with the diffs).
      "layout.restore@1": (payload: unknown) => {
        const p = (payload ?? {}) as Record<string, unknown>;
        let row;
        if (Array.isArray(p["tiles"])) {
          // a full vault row (the post-reinstall path): {layoutId, principal, tiles, digest, parentSnapshot?}
          row = {
            layoutId: String(p["layoutId"] ?? ""),
            principal: String(p["principal"] ?? (p["__caller"] ?? "unknown")),
            tiles: p["tiles"] as never,
            digest: String(p["digest"] ?? ""),
            ...(typeof p["parentSnapshot"] === "string" && p["parentSnapshot"].length > 0 ? { parentSnapshot: p["parentSnapshot"] } : {}),
          };
        } else {
          // an in-ledger restore by id
          const id = String(p["layoutId"] ?? "");
          const existing = layouts.get(id);
          if (!existing) throw new Error(`layout.restore@1: layout ${id} is not in the ledger (D-446)`);
          row = existing;
        }
        const out = layouts.restore(row as never);
        if (!out.ok) throw new Error(out.sentence);
        return { layoutId: out.row.layoutId, digest: out.row.digest, result: "exact", diffs: out.diffs, rendered: renderLayout(out.row) };
      },

      // contract: layout.read@1 — the headless view (snapshots, merge records, the active placement).
      "layout.read@1": (payload: unknown) => {
        const p = (payload ?? {}) as Record<string, unknown>;
        return layouts.read(typeof p["layoutId"] === "string" && p["layoutId"].length > 0 ? p["layoutId"] : undefined);
      },

      // ---- D-447 (Ω-8): the simulation substrate ops (advisory-for-production; the citing record owns blocking) ----

      // contract: sim.record@1 — pin a scenario (named, seeded, step-grammar-gated; self-citation refused).
      "sim.record@1": (payload: unknown) => {
        const p = (payload ?? {}) as Record<string, unknown>;
        const steps = Array.isArray(p["steps"]) ? (p["steps"] as Array<Record<string, unknown>>).map((s) => ({ op: String(s?.["op"] ?? ""), inputDigest: String(s?.["inputDigest"] ?? "") })) : [];
        const out = sims.record({
          scenarioId: String(p["scenarioId"] ?? ""),
          seed: String(p["seed"] ?? ""),
          steps,
          ...(typeof p["recordedFrom"] === "string" && p["recordedFrom"].length > 0 ? { recordedFrom: p["recordedFrom"] } : {}),
          ...(Array.isArray(p["cites"]) ? { cites: (p["cites"] as unknown[]).filter((x): x is string => typeof x === "string") } : {}),
        });
        if (!out.ok) throw new Error(out.sentence);
        return { scenarioId: out.row.scenarioId, seed: out.row.seed, steps: out.row.steps.length, ...(out.row.recordedFrom !== undefined ? { recordedFrom: out.row.recordedFrom } : {}) };
      },

      // contract: sim.replay@1 — run the fold (deterministic ×passes; refuses SIM_REPLAY_DIVERGENT on divergence; contained writes only).
      "sim.replay@1": (payload: unknown) => {
        const p = (payload ?? {}) as Record<string, unknown>;
        // the op-layer executor is the contained deterministic fold; real-machinery executors bind through the pure core's exec seam (D-447)
        const out = sims.replay({ scenarioId: String(p["scenarioId"] ?? ""), exec: defaultSimExec, passes: typeof p["passes"] === "number" ? p["passes"] : 2 });
        if (!out.ok) throw new Error(out.sentence);
        return { runRef: out.receipt.runRef, replayDigest: out.receipt.replayDigest, bytes: out.receipt.bytes, advisoryForProduction: true, rendered: renderSimReceipt(out.receipt) };
      },

      // contract: sim.read@1 — the headless view (scenarios, run receipts, containment breaches — divergence is the product).
      "sim.read@1": (payload: unknown) => {
        const p = (payload ?? {}) as Record<string, unknown>;
        return sims.read(typeof p["scenarioId"] === "string" && p["scenarioId"].length > 0 ? p["scenarioId"] : undefined);
      },

      // ---- D-444 (Ω-4): the trust substrate ops ----

      // contract: trust.bind@1 — the key ceremony: bind a key to a D-412 principal record.
      "trust.bind@1": (payload: unknown) => {
        const p = (payload ?? {}) as Record<string, unknown>;
        const keyId = String(p["keyId"] ?? "");
        if (keyId.length === 0) throw new Error("trust.bind@1: keyId must be a non-empty string (D-444)");
        const out = trusts.bind({
          keyId,
          principal: String(p["principal"] ?? ""),
          notBefore: Number(p["notBefore"] ?? Date.now()),
          ...(p["notAfter"] !== undefined ? { notAfter: Number(p["notAfter"]) } : {}),
          fingerprint: String(p["fingerprint"] ?? ""),
          ...(typeof p["expectedFingerprint"] === "string" ? { expectedFingerprint: p["expectedFingerprint"] } : {}),
          at: Number(p["at"] ?? Date.now()),
        });
        if (!out.ok) throw new Error(out.sentence);
        return { keyId: out.row.keyId, principal: out.row.principal, state: out.row.state, print: renderKey(out.row) };
      },

      // contract: trust.verify@1 — the era-aware verify fold (a signature is judged under the law of its signing time).
      "trust.verify@1": (payload: unknown) => {
        const p = (payload ?? {}) as Record<string, unknown>;
        // refusal-as-data: a READ judgment reports its verdict; the named refusal IS the answer
        return trusts.verify({
          keyId: String(p["keyId"] ?? ""),
          signedAt: Number(p["signedAt"] ?? Date.now()),
          signature: String(p["signature"] ?? ""),
          payload: p["payload"] ?? null,
        });
      },

      // contract: trust.revoke@1 — emergency revocation: the scar rides forward, nothing deletes.
      "trust.revoke@1": (payload: unknown) => {
        const p = (payload ?? {}) as Record<string, unknown>;
        const keyId = String(p["keyId"] ?? "");
        if (keyId.length === 0) throw new Error("trust.revoke@1: keyId must be a non-empty string (D-444)");
        const row = trusts.revoke(keyId, String(p["reason"] ?? "emergency"), Number(p["at"] ?? Date.now()));
        if (row === null) throw new Error(`trust.revoke@1: key ${keyId} not found — TRUST_KEY_UNBOUND: no principal record or lineage binds it (D-444)`);
        return { keyId: row.keyId, state: row.state, reason: row.revocationReason, print: renderKey(row) };
      },

      // ---- D-445 (Ω-5): the analytics substrate ops ----

      // contract: analytics.record@1 — the event sink (the attention wall enforced at write).
      "analytics.record@1": (payload: unknown) => {
        const p = (payload ?? {}) as Record<string, unknown>;
        const out = analytics.record({
          eventNs: String(p["eventNs"] ?? ""),
          kind: String(p["kind"] ?? ""),
          ...(typeof p["principal"] === "string" && p["principal"].length > 0 ? { principal: p["principal"] } : {}),
          ...(p["at"] !== undefined ? { at: Number(p["at"]) } : {}),
          ...(p["payload"] !== undefined ? { payload: p["payload"] } : {}),
          ...(typeof p["claimedDigest"] === "string" ? { claimedDigest: p["claimedDigest"] } : {}),
        });
        if (!out.ok) throw new Error(out.sentence);
        return { eventNs: out.row.eventNs, kind: out.row.kind, at: out.row.at, payloadDigest: out.row.payloadDigest };
      },

      // contract: analytics.query@1 — the observation read (headless render).
      "analytics.query@1": (payload: unknown) => {
        const p = (payload ?? {}) as Record<string, unknown>;
        return analytics.query({
          ...(typeof p["eventNs"] === "string" ? { eventNs: p["eventNs"] } : {}),
          ...(typeof p["kind"] === "string" ? { kind: p["kind"] } : {}),
          ...(p["from"] !== undefined ? { from: Number(p["from"]) } : {}),
          ...(p["to"] !== undefined ? { to: Number(p["to"]) } : {}),
          ...(p["limit"] !== undefined ? { limit: Number(p["limit"]) } : {}),
        });
      },

      // contract: analytics.counters@1 — the counter fold read (drift is a finding, never an overwrite).
      "analytics.counters@1": (payload: unknown) => {
        const p = (payload ?? {}) as Record<string, unknown>;
        const to = p["to"] !== undefined ? Number(p["to"]) : Date.now();
        const from = p["from"] !== undefined ? Number(p["from"]) : 0;
        return analytics.countersView({ from, to });
      },

      // ---- D-448 (Ω-9): the aperture ops (progressive disclosure — ns aperture) ----

      // contract: aperture.scope.set@1 — the disclosure-scope door: width lattice, owner-gated, cited amendments, ceremony-cited widening.
      "aperture.scope.set@1": (payload: unknown) => {
        const p = (payload ?? {}) as Record<string, unknown>;
        const cites = Array.isArray(p["cites"]) ? (p["cites"] as unknown[]).filter((x): x is string => typeof x === "string" && x.length > 0) : [];
        const out = apertures.setScope({
          target: String(p["target"] ?? ""),
          principal: String(p["principal"] ?? ""),
          width: p["width"],
          setBy: String(p["setBy"] ?? (p["__caller"] ?? "unknown")),
          at: Date.now(),
          ...(cites.length > 0 ? { cites } : {}),
          ...(typeof p["supersedes"] === "string" && p["supersedes"].length > 0 ? { supersedes: p["supersedes"] } : {}),
        });
        if (!out.ok) throw new Error(out.sentence);
        return { target: out.row.target, principal: out.row.principal, width: out.row.width, scopeRef: scopeRowId(out.row.target, out.row.principal) };
      },

      // contract: aperture.view@1 — the projection fold (READ): the requester's honest view at their scope's width; the evidence batch rides the payload (the vault mirror path, the context.assemble precedent).
      "aperture.view@1": (payload: unknown) => {
        const p = (payload ?? {}) as Record<string, unknown>;
        const target = String(p["target"] ?? "");
        const requester = String(p["requester"] ?? (p["__caller"] ?? "unknown"));
        if (Array.isArray(p["evidence"])) apertures.putEvidence(target, p["evidence"] as never[]);
        const out = apertures.view(target, requester, isWidth(p["width"]) ? p["width"] : undefined);
        if (!out.ok) throw new Error(out.sentence);
        return out.projection;
      },

      // contract: aperture.read@1 — the audit trail (READ): scopes + widening receipts, headless.
      "aperture.read@1": () => apertures.read(),

      // ---- D-449 (Ω-10): the partial-evaluation ops (ns eval) ----

      // contract: partial.evaluate@1 — the partial fold (READ over plan IR + rows): determined prefix, named unknowns, the gated residual; digest-guarded.
      "partial.evaluate@1": (payload: unknown) => {
        const p = (payload ?? {}) as Record<string, unknown>;
        const steps = Array.isArray(p["steps"])
          ? (p["steps"] as Array<Record<string, unknown>>).map((s) => ({
              stepId: String(s?.["stepId"] ?? ""),
              op: String(s?.["op"] ?? ""),
              inputs: Array.isArray(s?.["inputs"]) ? (s!["inputs"] as unknown[]).map(String) : [],
              dependsOn: Array.isArray(s?.["dependsOn"]) ? (s!["dependsOn"] as unknown[]).map(String) : [],
            }))
          : [];
        const bindings = Array.isArray(p["bindings"])
          ? (p["bindings"] as Array<Record<string, unknown>>).map((b) => ({ inputId: String(b?.["inputId"] ?? ""), value: b?.["value"] }))
          : [];
        const unknowns = Array.isArray(p["unknowns"])
          ? (p["unknowns"] as Array<Record<string, unknown>>).map((u) => ({
              inputId: String(u?.["inputId"] ?? ""),
              name: String(u?.["name"] ?? ""),
              source: u?.["source"],
              ...(Array.isArray(u?.["cites"]) ? { cites: (u!["cites"] as unknown[]).filter((x): x is string => typeof x === "string") } : {}),
            }))
          : [];
        const scopeWidths: Record<string, Width> = {};
        if (p["inputScopeWidths"] !== null && typeof p["inputScopeWidths"] === "object") {
          for (const [k, v] of Object.entries(p["inputScopeWidths"] as Record<string, unknown>)) if (isWidth(v)) scopeWidths[k] = v;
        }
        const out = partials.evaluateChecked({
          plan: { planRef: String(p["planRef"] ?? ""), steps },
          bindings,
          ...(unknowns.length > 0 ? { unknowns: unknowns as never } : {}),
          ...(p["defaults"] !== null && typeof p["defaults"] === "object" ? { defaults: p["defaults"] as Record<string, unknown> } : {}),
          ...(isWidth(p["width"]) ? { width: p["width"] } : {}),
          ...(Object.keys(scopeWidths).length > 0 ? { inputScopeWidths: scopeWidths } : {}),
          at: Date.now(),
        });
        if (!out.ok) throw new Error(out.sentence);
        return { partialRef: out.row.partialRef, resultDigest: out.row.resultDigest, determined: out.row.determined.length, unknowns: out.row.unknowns, width: out.row.width, rendered: renderPartial(out.row) };
      },

      // contract: partial.read@1 — the partial rows with their unknowns (permanent luggage) + the residual runs, headless.
      "partial.read@1": (payload: unknown) => {
        const p = (payload ?? {}) as Record<string, unknown>;
        return partials.read(typeof p["partialRef"] === "string" && p["partialRef"].length > 0 ? p["partialRef"] : undefined);
      },

      // ---- D-450 (Ω-14): the liveness ops (ns liveness) ----

      // contract: liveness.set@1 — the ceremony door (MUTATION): placement/sleep/shed/suspend — lawful edges only, typed suspend reasons, §18 badge sentences on the row.
      "liveness.set@1": (payload: unknown) => {
        const p = (payload ?? {}) as Record<string, unknown>;
        const out = liveness.set({
          tileId: String(p["tileId"] ?? ""),
          to: p["to"],
          ...(isLivenessState(p["from"]) ? { from: p["from"] } : {}),
          ...(typeof p["reason"] === "string" && p["reason"].length > 0 ? { reason: p["reason"] } : {}),
          ...(p["suspendReason"] === "battery" || p["suspendReason"] === "pressure" || p["suspendReason"] === "law" ? { suspendReason: p["suspendReason"] } : {}),
          ...(typeof p["weightMB"] === "number" ? { weightMB: p["weightMB"] } : {}),
          by: String(p["by"] ?? (p["__caller"] ?? "unknown")),
          at: Date.now(),
        });
        if (!out.ok) throw new Error(out.sentence);
        return { tileId: out.row.tileId, state: out.row.state, since: out.row.since, ...(out.row.badgeSentence !== undefined ? { badgeSentence: out.row.badgeSentence } : {}) };
      },

      // contract: liveness.wake@1 — the budget-check-first framed hydration ceremony (MUTATION); the trade is named on refusal, the wakeProof on success.
      "liveness.wake@1": (payload: unknown) => {
        const p = (payload ?? {}) as Record<string, unknown>;
        const out = liveness.wake({
          tileId: String(p["tileId"] ?? ""),
          ...(isLivenessState(p["to"]) ? { to: p["to"] } : {}),
          budgetRef: String(p["budgetRef"] ?? ""),
          gateRef: String(p["gateRef"] ?? ""),
          ...(typeof p["capacityMB"] === "number" ? { capacityMB: p["capacityMB"] } : {}),
          ...(typeof p["profileRef"] === "string" && p["profileRef"].length > 0 ? { profileRef: p["profileRef"] } : {}),
          by: String(p["by"] ?? (p["__caller"] ?? "unknown")),
          at: Date.now(),
        });
        if (!out.ok) throw new Error(out.sentence);
        return { tileId: out.row.tileId, state: out.row.state, since: out.row.since, wakeProof: out.row.wakeProof ?? null };
      },

      // contract: liveness.read@1 — the headless view (READ): states, transition history, dormancy proofs, and the badge sentences the renderer would print.
      "liveness.read@1": () => liveness.read(),
    },
  }),
);
