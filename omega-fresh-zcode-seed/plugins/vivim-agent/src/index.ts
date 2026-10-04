// vivim.agent — index.ts (D-309, Ω Control Plane v0)
// Agents are DATA, not processes: this plugin mints and governs AgentIdentity
// and BehaviorContract vault objects. Wiring only — all decisions live in the
// pure ./agent.ts machinery (same split as vivim.mind's derive.ts).
//
// Ops exposed (ENGINE contributions — no risk BY KIND, READ semantics by kind;
// the ops below APPEND vault data objects through the port, exactly like
// director.rule@1 does: the write is data, gated by the port grant):
//   agent.spawn@1      {parentId?, behaviorContractId, requestedScope, task?} → Outcome<{identity, scope}>
//   agent.describe@1   {agentId} → Outcome<{identity, contract}>
//   agent.exec@1       {agentId, op, payload?, realizationRef?} → Outcome (B1a D-327: one agent acts once)
//   agent.snapshot@1   {agentId} → Outcome<AgentSnapshot> (D-328a: identity + contract + ledger cursor)
//   agent.delegate@1   {parentAgentId, behaviorContractId, authority, task?, ...} → Outcome (D-328b handoff)
//   evolution.propose@1/evaluate@1/promote@1/rollback@1 → Outcome (D-328b governed evolution)
//   behavior.propose@1 {id, version, preconditions, invariants, forbiddenActions, requiredCapabilities, recovery, provenance?} → Outcome<{rev, id, state}>
//   behavior.promote@1 {contractId, evidence: VaultProvenanceRef[]} → Outcome<{rev}>
//   behavior.rollback@1 {contractId} → Outcome<{quarantinedRev, reactivatedRev, rev}>
//   decision.record@1  {decisionId, subject, priorState, proposedState, actor, evidence?, parentDecisions} → Outcome<{rev, decisionId}>
//   delegate.chain@1   {delegationId, carriedAuthority?, depthBudget?} → Outcome (D-454, Ω-15: the vault-recomputed chain fold)
//   delegate.revoke@1  {delegationId} → Outcome (D-454, Ω-15: the subtree revocation cascade)
//   adapt.propose@1    {proposalId, target, diffRef, rollbackPoint, census, censusBasis?, treatyChecks, window} → Outcome (D-455, Ω-16: open the ceremony)
//   adapt.ratify@1     {proposalId, census, treatyChecks?, ratifier} → Outcome (D-455, Ω-16: the signed flip)
//   adapt.read@1       {proposalId?} → Outcome (D-455, Ω-16: the ceremony renders headless)
//
// LEDGER RULE (stated before code, per the V2 risk discipline): every exec
// attempt appends exactly one row to vault ns "agent" (id `exec:<causationId>`)
// BEFORE its Outcome is returned — settled and refused alike. A refusal
// without a ledger row is a silent drop; a settlement without one is an
// unattributable mutation. Ledger-append failure → throw → DEGRADED
// (fail-closed: never claim an outcome without its proof). There is no
// mid-flight abort path by construction: admission is checked once, the
// admitted call runs to settlement, and a post-settle head re-read only
// annotates `quarantinedMidFlight` (D-315(a) finish-then-halt, ratified).
//
// PRINCIPAL HONESTY (host limitation, documented not hidden): the µhost sets
// the dispatch principal to the CALLING compartment (`vivim.agent`), so the
// gated target call below is NOT natively dispatched as `agent:<id>` — no
// plugin can mint a foreign dispatch principal through the port. The agent
// authority is instead enforced in three pre-call steps that ARE under the
// agent's identity: (1) admission (contract active + version-pinned +
// identity non-terminal), (2) scope subset (call scope ⊆ recorded
// capabilityToken), (3) an explicit law.check@1 probe with
// principal `agent:<id>` (forbidden overlay + policy evaluated FOR the
// agent; deny/require-consent → ledgered REFUSED, target never called).
// The ledger row records the agent principal for every attempt, so the
// audit trail attributes the call to the agent even though the transport
// principal is the acting compartment — same entries as a director tick
// (attempt + outcome + causation), never silently retried.
import { definePlugin, startPlugin } from "@vivim/omega-shim";
import type { PluginContext, CallMeta } from "@vivim/omega-shim";
import type { AgentIdentity, BehaviorContract, Outcome, PortResult, VaultProvenanceRef } from "@vivim/omega-contracts";
import {
  delegationId, evolutionId,
  type DelegationRecord, type EvolutionEvaluation, type EvolutionProposal, type EvolutionTransition,
} from "@vivim/omega-contracts";
import { fail } from "@vivim/omega-contracts";
import { randomBytes } from "node:crypto";
import {
  asProvenanceRef, buildAgentIdentity, buildDecisionRecord, checkPromote,
  decideExecAdmission, decideRollback, decisionRefs, execCallScope, execLedgerId,
  execQuarantinedMidFlight, isAgentActor, parseBehaviorProposeInput, parseDecisionInput,
  parseDelegateInput, parseDescribeInput, parseEvolutionEvaluateInput, parseEvolutionPromoteInput,
  parseEvolutionProposeInput, parseEvolutionRollbackInput, parseExecInput, parseSnapshotInput,
  parseSpawnInput, resolveSpawnAuthority, stageBehaviorContract, type RevState,
} from "./agent.ts";
import { isSubset } from "./tokens.ts";
import {
  chainRowId, foldChain, parseChainOpInput, parseRevokeOpInput, planRevocation,
  renderChain,
} from "./delegation.ts";
import {
  ADAPT_NS, adaptProposalId, buildProposal, censusRefs, parseAdaptProposeOpInput,
  parseAdaptRatifyOpInput, parseAdaptReadOpInput, parseAdaptRow, ratifierRefs,
  ratifyProposal, renderCeremony, type AdaptProposalRow,
} from "./adaptation.ts";
import { PHASE1_CAPABILITY, AGENCY_NS, eventId, validateRequest, type GovernedEvent } from "./governance.ts";

const AGENT_NS = "agent";
const BEHAVIOR_NS = "behavior";
const DECISION_NS = "decision";
/** Vault ns for handoff + evolution records (first written by D-328b). */
const CONTROL_NS = "control";
/** Bound: ledger-cursor scan over ns "agent" exec rows per snapshot. */
const SNAPSHOT_CURSOR_CAP = 200;
/** Bound: delegation-chain row scan over ns "control" chain: rows per fold (D-454). */
const CHAIN_SCAN_CAP = 500;
/** Bound: adaptation proposal scan over ns "adapt" proposal: rows per read (D-455). */
const ADAPT_SCAN_CAP = 500;

/** Port call that fails closed: a non-ok vault/law result becomes a thrown error → DEGRADED. */
async function portCall<T>(ctx: PluginContext, op: string, payload: unknown): Promise<T> {
  const r: PortResult = await ctx.port.call(op, payload);
  if (!r.ok) throw new Error(`vivim.agent: ${op} ${r.error}: ${r.detail ?? ""}`);
  return r.value as T;
}

interface VaultGetResult { rev: number; cid: string; data: unknown; meta: unknown; refs: unknown }
interface VaultAppendResult { rev: number; cid: string; seq: number }
interface VaultRow { id: string; rev: number; cid: string }

async function vaultGet(ctx: PluginContext, ns: string, id: string, rev?: number): Promise<VaultGetResult | null> {
  const r: PortResult = await ctx.port.call("vault.get@1", rev === undefined ? { ns, id } : { ns, id, rev });
  if (!r.ok) return null; // not found / absent (cold-miss reads as absent — the caller decides)
  return r.value as VaultGetResult;
}

function asAgentIdentity(op: string, v: unknown): AgentIdentity | null {
  if (v === null || typeof v !== "object" || Array.isArray(v)) return null;
  const o = v as Record<string, unknown>;
  if (typeof o.id !== "string" || typeof o.behaviorContractId !== "string" || typeof o.capabilityToken !== "string") return null;
  void op;
  return v as AgentIdentity;
}

function asBehaviorContract(v: unknown): BehaviorContract | null {
  if (v === null || typeof v !== "object" || Array.isArray(v)) return null;
  const o = v as Record<string, unknown>;
  if (typeof o.id !== "string" || typeof o.version !== "string" || typeof o.state !== "string") return null;
  return v as BehaviorContract;
}

/** Actor accountability for governed evolution (D-328b): agent actors must
 *  resolve to a live, non-terminal identity under an ACTIVE, version-pinned
 *  contract — agents never self-authorize evolution without an accountable,
 *  governed identity. Non-agent actors (human/root) pass: the evidence
 *  requirement is the authorization floor (no second auth model, per the
 *  non-goals). Returns a fail Outcome when the actor may not proceed, else null. */
async function checkEvolutionActor(ctx: PluginContext, op: string, actor: string): Promise<Outcome | null> {
  if (!isAgentActor(actor)) return null;
  const row = await vaultGet(ctx, AGENT_NS, actor);
  const identity = row ? asAgentIdentity(op, row.data) : null;
  if (!identity) {
    return fail("REFUSED", `evolution actor "${actor}" is not a live agent identity — agents cannot self-authorize evolution without one`);
  }
  if (identity.state === "quarantined" || identity.state === "retired") {
    return fail("REFUSED", `evolution actor "${actor}" is "${identity.state}" (terminal — cannot authorize evolution)`);
  }
  const head = await vaultGet(ctx, BEHAVIOR_NS, identity.behaviorContractId);
  const contract = head ? asBehaviorContract(head.data) : null;
  if (!contract || contract.state !== "active" || contract.version !== identity.behaviorVersion) {
    return fail("REFUSED", `evolution actor "${actor}" is not under an active, version-pinned contract (governed identity required)`);
  }
  return null;
}

/** Resolve every cited ref at its exact rev (proof-adjacent, like
 *  behavior.promote): any unresolvable ref → EVALUATION_FAILED outcome. */
async function resolveEvolutionEvidence(
  ctx: PluginContext, evidence: VaultProvenanceRef[],
): Promise<Outcome | null> {
  for (const ref of evidence) {
    const got = await vaultGet(ctx, ref.ns, ref.id, ref.rev);
    if (!got) return fail("EVALUATION_FAILED", `evidence ref ${ref.ns}/${ref.id}@${ref.rev} does not resolve`);
  }
  return null;
}

startPlugin(definePlugin({
  onInit: (ctx) => {
    ctx.log("vivim.agent up (D-309) — control plane v0: spawn/describe/propose/promote/rollback/decision over vault data");
  },

  ops: {
    /** P1-06 Phase-1 governed chain: principal -> consent -> D-452 frame
     * -> fixed capability -> governed event. Consent is the only authority
     * form in this slice; standing/delegation/budget/adaptation are absent.
     */
    "agency.execute@1": async (payload: unknown, ctx: PluginContext, meta: CallMeta): Promise<Outcome> => {
      const request = validateRequest(payload);
      const causationId = meta.causationId;
      const at = request.now ?? Date.now();
      const frame = {
        caller: request.principal.principal, behalf: request.principal.principal,
        op: PHASE1_CAPABILITY, scope: PHASE1_CAPABILITY,
        authority: { kind: "consent" as const, ref: request.authority.consentRef },
        ...(request.intentRef !== undefined ? { intentRef: request.intentRef } : {}),
      };
      // Resolve the actual current consent registry first. The chain never
      // turns the caller's assertion into "live: true"; law.describe is the
      // source of the current consent rows for this principal.
      const lawState = await portCall<{
        principal: string;
        consents: Array<{ consentId: string; active: boolean; scope?: string }>;
      }>(ctx, "law.describe@1", { principal: request.principal.principal });
      const liveConsent = lawState.consents.find((c) =>
        c.consentId === request.authority.consentRef &&
        c.active === true &&
        (c.scope === undefined || c.scope === PHASE1_CAPABILITY)
      );
      const invocation = await portCall<{
        verdict: "framed" | "refused"; code?: string; sentence?: string;
        frameDigest: string | null; authorityResolved: "consent" | null; causationId: string;
      }>(ctx, "invoke.check@1", {
        frame,
        target: { op: PHASE1_CAPABILITY, opClass: "EXTERNAL_MUTATION" },
        knownOps: [PHASE1_CAPABILITY],
        consents: [{
          consentId: request.authority.consentRef,
          principal: request.authority.principal,
          op: PHASE1_CAPABILITY,
          live: liveConsent !== undefined,
        }],
        delegations: [], standings: [], rootPrincipals: [], now: at, causationId,
      });
      if (invocation.verdict === "refused") {
        const event: GovernedEvent = {
          kind: "governed-action@1", eventId: eventId(causationId), at, causationId,
          principal: request.principal, authority: request.authority, capability: PHASE1_CAPABILITY,
          consentChecked: true,
          invocation: {
            frameDigest: invocation.frameDigest, verdict: "refused",
            authorityResolved: invocation.authorityResolved,
          },
          execution: { attempted: false, completed: false }, outcome: "REFUSED",
          ...(invocation.code !== undefined ? { reasonCode: invocation.code } : {}),
          ...(invocation.sentence !== undefined ? { reasonSentence: invocation.sentence } : {}),
          ...(request.intentRef !== undefined ? { intentRef: request.intentRef } : {}),
        };
        await portCall(ctx, "vault.append@1", {
          ns: AGENCY_NS, id: event.eventId, data: event,
          meta: { type: event.kind, capability: PHASE1_CAPABILITY, outcome: event.outcome },
          refs: [{ ns: "invoke", id: "inv:" + causationId }],
        });
        return fail(
          "REFUSED",
          (event.reasonCode ?? "INVOKE_REFUSED") + ": " +
          (event.reasonSentence ?? "governance refused the invocation"),
        );
      }
      const target = await portCall<unknown>(ctx, PHASE1_CAPABILITY, request.payload);
      const event: GovernedEvent = {
        kind: "governed-action@1", eventId: eventId(causationId), at, causationId,
        principal: request.principal, authority: request.authority, capability: PHASE1_CAPABILITY,
        consentChecked: true,
        invocation: {
          frameDigest: invocation.frameDigest, verdict: "framed",
          authorityResolved: invocation.authorityResolved,
        },
        execution: { attempted: true, completed: true }, outcome: "EXECUTED",
        ...(request.intentRef !== undefined ? { intentRef: request.intentRef } : {}),
        targetResult: target,
      };
      await portCall(ctx, "vault.append@1", {
        ns: AGENCY_NS, id: event.eventId, data: event,
        meta: { type: event.kind, capability: PHASE1_CAPABILITY, outcome: event.outcome },
        refs: [{ ns: "invoke", id: "inv:" + causationId }],
      });
      return {
        status: "OK",
        value: { eventId: event.eventId, capability: PHASE1_CAPABILITY, outcome: "EXECUTED", target },
      };
    },


    "agent.spawn@1": async (payload: unknown, ctx: PluginContext, meta: CallMeta): Promise<Outcome> => {
      const input = parseSpawnInput(payload); // throws on malformed → DEGRADED
      // 1. resolve the behavior contract (must exist and be active)
      const contractRow = await vaultGet(ctx, BEHAVIOR_NS, input.behaviorContractId);
      const contract = contractRow ? asBehaviorContract(contractRow.data) : null;
      if (!contract) return fail("UNKNOWN", `behavior contract "${input.behaviorContractId}" not found`);
      if (contract.state !== "active") {
        return fail("UNSUPPORTED", `behavior contract "${input.behaviorContractId}" is "${contract.state}", not active`);
      }
      // 2. resolve the parent scope (vault-recorded) for child spawns
      let parent: AgentIdentity | null = null;
      let parentRev: number | null = null;
      if (input.parentId !== undefined) {
        const parentRow = await vaultGet(ctx, AGENT_NS, input.parentId);
        const found = parentRow ? asAgentIdentity("agent.spawn@1", parentRow.data) : null;
        if (!found) return fail("UNKNOWN", `parent agent "${input.parentId}" not found`);
        parent = found;
        parentRev = parentRow!.rev;
      }
      // 3. pure authority decision (subset math over recorded scopes + composition grants)
      const auth = resolveSpawnAuthority({
        parent,
        ownCaps: ctx.capabilities,
        requestedScope: input.requestedScope,
        contract,
      });
      if (auth.status !== "OK" || !auth.value) return auth as Outcome;
      // 4. register forbidden actions BEFORE the identity exists, so no tick
      //    can ever observe an unenforced agent (fail-closed: set failure aborts the spawn)
      const agentId = `agent_${randomBytes(8).toString("hex")}`;
      if (contract.forbiddenActions.length > 0) {
        await portCall(ctx, "law.forbidden.set@1", { principal: agentId, ops: contract.forbiddenActions });
      }
      return await finishSpawn(ctx, meta, input, contract, contractRow!.rev, auth.value.scope, parentRev, agentId);
    },

    "agent.describe@1": async (payload: unknown, ctx: PluginContext): Promise<Outcome> => {
      const { agentId } = parseDescribeInput(payload);
      const row = await vaultGet(ctx, AGENT_NS, agentId);
      const identity = row ? asAgentIdentity("agent.describe@1", row.data) : null;
      if (!identity) return fail("UNKNOWN", `agent "${agentId}" not found`);
      const contractRow = await vaultGet(ctx, BEHAVIOR_NS, identity.behaviorContractId);
      const contract = contractRow ? asBehaviorContract(contractRow.data) : null;
      if (!contract) return fail("UNKNOWN", `behavior contract "${identity.behaviorContractId}" not found`);
      return { status: "OK", value: { identity, contract } };
    },

    /** Self-orientation slice (D-328a): identity + resolved contract + ledger
     *  cursor (this agent's exec attempts, latest first-by-rev). READ-only.
     *  UNKNOWN for ghosts — never a crash. */
    "agent.snapshot@1": async (payload: unknown, ctx: PluginContext): Promise<Outcome> => {
      const { agentId } = parseSnapshotInput(payload); // throws on malformed → DEGRADED
      const row = await vaultGet(ctx, AGENT_NS, agentId);
      const identity = row ? asAgentIdentity("agent.snapshot@1", row.data) : null;
      if (!identity) return fail("UNKNOWN", `agent "${agentId}" not found`);
      const contractRow = await vaultGet(ctx, BEHAVIOR_NS, identity.behaviorContractId);
      const contract = contractRow ? asBehaviorContract(contractRow.data) : null;
      if (!contract || !contractRow) return fail("UNKNOWN", `behavior contract "${identity.behaviorContractId}" not found`);
      // Ledger cursor: this agent's exec rows (bounded scan; the ledger is the
      // authority, memory is nothing — same discipline as the director tick).
      const q: PortResult = await ctx.port.call("vault.query@1", { ns: AGENT_NS, filter: { idPrefix: "exec:" } });
      if (!q.ok) throw new Error(`vivim.agent: vault.query@1 ${q.error}: ${q.detail ?? ""}`);
      let attempts = 0;
      let latest: { id: string; rev: number } | null = null;
      for (const erow of ((q.value as VaultRow[] | null) ?? []).slice(0, SNAPSHOT_CURSOR_CAP)) {
        const g = await vaultGet(ctx, AGENT_NS, erow.id);
        if (!g) continue;
        if ((g.data as { agentId?: unknown }).agentId !== agentId) continue;
        attempts++;
        if (!latest || g.rev > latest.rev) latest = { id: erow.id, rev: g.rev };
      }
      return {
        status: "OK",
        value: {
          agentId, identity, contract, contractRev: contractRow.rev,
          ledgerCursor: { attempts, latest }, at: Date.now(),
        },
      };
    },

    /** Structured handoff (D-328b): spawn a child under the parent's recorded
     *  authority and journal the envelope to ns "control". The child
     *  re-discovers its contract via agent.describe/agent.snapshot — envelope
     *  claims are routing hints, the vault is the authority. The delegation
     *  record follows the spawn (a staged child without a delegation row is
     *  exactly a normal spawn — safe by construction, never live). */
    "agent.delegate@1": async (payload: unknown, ctx: PluginContext, meta: CallMeta): Promise<Outcome> => {
      const input = parseDelegateInput(payload); // throws on malformed → DEGRADED
      const parentRow = await vaultGet(ctx, AGENT_NS, input.parentAgentId);
      const parent = parentRow ? asAgentIdentity("agent.delegate@1", parentRow.data) : null;
      if (!parent || !parentRow) return fail("UNKNOWN", `parent agent "${input.parentAgentId}" not found`);
      if (parent.state === "quarantined" || parent.state === "retired") {
        return fail("REFUSED", `parent agent "${input.parentAgentId}" is "${parent.state}" (terminal — cannot delegate)`);
      }
      const contractRow = await vaultGet(ctx, BEHAVIOR_NS, input.behaviorContractId);
      const contract = contractRow ? asBehaviorContract(contractRow.data) : null;
      if (!contract || !contractRow) return fail("UNKNOWN", `behavior contract "${input.behaviorContractId}" not found`);
      if (contract.state !== "active") {
        return fail("UNSUPPORTED", `behavior contract "${input.behaviorContractId}" is "${contract.state}", not active`);
      }
      const auth = resolveSpawnAuthority({
        parent,
        ownCaps: ctx.capabilities,
        requestedScope: input.authority,
        contract,
      });
      if (auth.status !== "OK" || !auth.value) return auth as Outcome;
      const childId = `agent_${randomBytes(8).toString("hex")}`;
      if (contract.forbiddenActions.length > 0) {
        await portCall(ctx, "law.forbidden.set@1", { principal: childId, ops: contract.forbiddenActions });
      }
      const spawned = await finishSpawn(ctx, meta, {
        parentId: input.parentAgentId,
        behaviorContractId: input.behaviorContractId,
        requestedScope: input.authority,
        ...(input.task !== undefined ? { task: input.task } : {}),
      }, contract, contractRow.rev, auth.value.scope, parentRow.rev, childId);
      if (spawned.status !== "OK" || !spawned.value) return spawned;
      const record: DelegationRecord = {
        ...input,
        childId,
        actor: input.parentAgentId,
        buildDecisionRef: "D-328",
        createdAt: Date.now(),
      };
      const d = await portCall<VaultAppendResult>(ctx, "vault.append@1", {
        ns: CONTROL_NS, id: delegationId(childId), data: record,
        refs: (spawned.value.identity as AgentIdentity).provenance,
        meta: { type: "delegation", child: childId, parent: input.parentAgentId },
      });
      return { status: "OK", value: { ...(spawned.value as object), delegationRev: d.rev, childId } };
    },

    "behavior.propose@1": async (payload: unknown, ctx: PluginContext): Promise<Outcome> => {
      const staged = stageBehaviorContract(parseBehaviorProposeInput(payload));
      const r = await portCall<VaultAppendResult>(ctx, "vault.append@1", {
        ns: BEHAVIOR_NS, id: staged.id, data: staged,
      });
      return { status: "OK", value: { rev: r.rev, id: staged.id, state: staged.state } };
    },

    "behavior.promote@1": async (payload: unknown, ctx: PluginContext): Promise<Outcome> => {
      const p = payload as Record<string, unknown>;
      const contractId = typeof p?.contractId === "string" && p.contractId.length > 0
        ? p.contractId
        : (() => { throw new Error("behavior.promote@1: contractId must be a non-empty string"); })();
      const evidence = Array.isArray(p?.evidence)
        ? (p.evidence as unknown[]).map((e, i) => asProvenanceRef("behavior.promote@1", `evidence[${i}]`, e))
        : (() => { throw new Error("behavior.promote@1: evidence must be an array of {ns, id, rev}"); })();
      const row = await vaultGet(ctx, BEHAVIOR_NS, contractId);
      const current = row ? asBehaviorContract(row.data) : null;
      const gate = checkPromote(current, evidence);
      if (gate.status !== "OK" || !gate.value) return gate as Outcome;
      // proof-adjacent: every cited ref must actually resolve (citable, not vibes)
      for (const ref of evidence) {
        const got = await vaultGet(ctx, ref.ns, ref.id, ref.rev);
        if (!got) return fail("EVALUATION_FAILED", `evidence ref ${ref.ns}/${ref.id}@${ref.rev} does not resolve`);
      }
      const r = await portCall<VaultAppendResult>(ctx, "vault.append@1", {
        ns: BEHAVIOR_NS, id: contractId, data: gate.value,
        refs: [{ ns: BEHAVIOR_NS, id: contractId, rev: row!.rev }],
      });
      return { status: "OK", value: { rev: r.rev } };
    },

    "behavior.rollback@1": async (payload: unknown, ctx: PluginContext): Promise<Outcome> => {
      const p = payload as Record<string, unknown>;
      const contractId = typeof p?.contractId === "string" && p.contractId.length > 0
        ? p.contractId
        : (() => { throw new Error("behavior.rollback@1: contractId must be a non-empty string"); })();
      const head = await vaultGet(ctx, BEHAVIOR_NS, contractId);
      if (!head) return fail("UNKNOWN", `behavior contract "${contractId}" not found`);
      // rev-walk newest→oldest collecting (rev, version, state) triples.
      // No early break: a staged rev of the SAME version doesn't satisfy
      // rollback (it must be a different version), so the whole chain is
      // scanned. Bounded at 100 (histories are short; the cap guards depth).
      const revs: RevState[] = [];
      for (let rev = head.rev; rev >= 1 && revs.length < 100; rev--) {
        const got = await vaultGet(ctx, BEHAVIOR_NS, contractId, rev);
        if (!got) break; // cold gap or compacted past keep — stop honestly
        const data = got.data as { version?: unknown; state?: unknown };
        revs.push({
          rev,
          version: typeof data.version === "string" ? data.version : "?",
          state: typeof data.state === "string" ? data.state : "?",
        });
      }
      const plan = decideRollback(revs);
      if (plan.status !== "OK" || !plan.value) return plan as Outcome;
      const activeRow = await vaultGet(ctx, BEHAVIOR_NS, contractId, plan.value.quarantineRev);
      const priorRow = await vaultGet(ctx, BEHAVIOR_NS, contractId, plan.value.reactivateRev);
      if (!activeRow || !priorRow) return fail("EVALUATION_FAILED", "rollback target revisions unreadable");
      const q = await portCall<VaultAppendResult>(ctx, "vault.append@1", {
        ns: BEHAVIOR_NS, id: contractId,
        data: { ...(activeRow.data as object), state: "quarantined" },
        refs: [{ ns: BEHAVIOR_NS, id: contractId, rev: plan.value.quarantineRev }],
      });
      const r = await portCall<VaultAppendResult>(ctx, "vault.append@1", {
        ns: BEHAVIOR_NS, id: contractId,
        data: { ...(priorRow.data as object), state: "active" },
        refs: [{ ns: BEHAVIOR_NS, id: contractId, rev: q.rev }],
      });
      // Return the DECIDED revs (what was quarantined / reactivated) plus the new head.
      return { status: "OK", value: { quarantinedRev: plan.value.quarantineRev, reactivatedRev: plan.value.reactivateRev, rev: r.rev } };
    },

    "decision.record@1": async (payload: unknown, ctx: PluginContext): Promise<Outcome> => {
      const input = parseDecisionInput(payload);
      // every parent must resolve (genealogy integrity — no dangling refs, G0 §4)
      const parentRevs: number[] = [];
      for (const id of input.parentDecisions) {
        const row = await vaultGet(ctx, DECISION_NS, id);
        if (!row) return fail("UNKNOWN", `parent decision "${id}" not found`);
        parentRevs.push(row.rev);
      }
      const { decisionId } = input;
      const data = buildDecisionRecord(input);
      const appendRefs = decisionRefs(input, parentRevs);
      const r = await portCall<VaultAppendResult>(ctx, "vault.append@1", {
        ns: DECISION_NS, id: decisionId, data, refs: appendRefs,
      });
      return { status: "OK", value: { rev: r.rev, decisionId } };
    },

    /** Propose an improvement (D-328b): stages the behavior contract through
     *  the IDENTICAL pure gate as behavior.propose and mirrors the proposal
     *  to ns "control" (genealogy-distinct name, same mechanics). Thin alias,
     *  evidence-carrying, never codegen. */
    "evolution.propose@1": async (payload: unknown, ctx: PluginContext): Promise<Outcome> => {
      const input = parseEvolutionProposeInput(payload); // throws on malformed → DEGRADED
      const gated = await checkEvolutionActor(ctx, "evolution.propose@1", input.actor);
      if (gated) return gated;
      const staged = stageBehaviorContract(input.behavior);
      const b = await portCall<VaultAppendResult>(ctx, "vault.append@1", {
        ns: BEHAVIOR_NS, id: staged.id, data: staged,
      });
      const proposal: EvolutionProposal = {
        kind: "proposal", id: staged.id, version: staged.version,
        preconditions: staged.preconditions, invariants: staged.invariants,
        forbiddenActions: staged.forbiddenActions,
        requiredCapabilities: staged.requiredCapabilities, recovery: staged.recovery,
        actor: input.actor, evidence: input.evidence, behaviorRev: b.rev,
        buildDecisionRef: "D-328", createdAt: Date.now(),
      };
      const e = await portCall<VaultAppendResult>(ctx, "vault.append@1", {
        ns: CONTROL_NS, id: evolutionId(staged.id), data: proposal,
        refs: [...staged.provenance, ...input.evidence, { ns: BEHAVIOR_NS, id: staged.id, rev: b.rev }],
        meta: { type: "evolution", kind: "proposal", id: staged.id },
      });
      return { status: "OK", value: { rev: b.rev, evolutionRev: e.rev, id: staged.id, state: staged.state } };
    },

    /** Evaluate a proposal (D-328b): evidence-backed verdict recorded to ns
     *  "control". Informs promotion, never performs it. Evidence-required:
     *  empty evidence throws → DEGRADED; unresolvable refs → EVALUATION_FAILED. */
    "evolution.evaluate@1": async (payload: unknown, ctx: PluginContext): Promise<Outcome> => {
      const input = parseEvolutionEvaluateInput(payload);
      const gated = await checkEvolutionActor(ctx, "evolution.evaluate@1", input.actor);
      if (gated) return gated;
      const head = await vaultGet(ctx, BEHAVIOR_NS, input.contractId);
      if (!head) return fail("UNKNOWN", `behavior contract "${input.contractId}" not found`);
      const failed = await resolveEvolutionEvidence(ctx, input.evidence);
      if (failed) return failed;
      const evaluation: EvolutionEvaluation = {
        kind: "evaluation", id: input.contractId, verdict: input.verdict,
        ...(input.note !== undefined ? { note: input.note } : {}),
        actor: input.actor, evidence: input.evidence, createdAt: Date.now(),
      };
      const e = await portCall<VaultAppendResult>(ctx, "vault.append@1", {
        ns: CONTROL_NS, id: evolutionId(input.contractId), data: evaluation,
        refs: [...input.evidence, { ns: BEHAVIOR_NS, id: input.contractId, rev: head.rev }],
        meta: { type: "evolution", kind: "evaluation", id: input.contractId },
      });
      return { status: "OK", value: { evolutionRev: e.rev, verdict: input.verdict } };
    },

    /** Promote through governance (D-328b): the IDENTICAL staged+evidence
     *  gates as behavior.promote, plus a mirror record to ns "control".
     *  Confidence never promotes alone — here or anywhere. */
    "evolution.promote@1": async (payload: unknown, ctx: PluginContext): Promise<Outcome> => {
      const input = parseEvolutionPromoteInput(payload);
      const gated = await checkEvolutionActor(ctx, "evolution.promote@1", input.actor);
      if (gated) return gated;
      const row = await vaultGet(ctx, BEHAVIOR_NS, input.contractId);
      const current = row ? asBehaviorContract(row.data) : null;
      const gate = checkPromote(current, input.evidence);
      if (gate.status !== "OK" || !gate.value) return gate as Outcome;
      const failed = await resolveEvolutionEvidence(ctx, input.evidence);
      if (failed) return failed;
      const b = await portCall<VaultAppendResult>(ctx, "vault.append@1", {
        ns: BEHAVIOR_NS, id: input.contractId, data: gate.value,
        refs: [{ ns: BEHAVIOR_NS, id: input.contractId, rev: row!.rev }],
      });
      const transition: EvolutionTransition = {
        kind: "promotion", id: input.contractId, actor: input.actor,
        evidence: input.evidence, behaviorRev: b.rev, createdAt: Date.now(),
      };
      const e = await portCall<VaultAppendResult>(ctx, "vault.append@1", {
        ns: CONTROL_NS, id: evolutionId(input.contractId), data: transition,
        refs: [...input.evidence, { ns: BEHAVIOR_NS, id: input.contractId, rev: b.rev }],
        meta: { type: "evolution", kind: "promotion", id: input.contractId },
      });
      return { status: "OK", value: { rev: b.rev, evolutionRev: e.rev } };
    },

    /** Roll back through governance (D-328b): the IDENTICAL rev-walk as
     *  behavior.rollback, plus a mirror record to ns "control" naming the
     *  quarantined and reactivated revs. Append-only, nothing deleted. */
    "evolution.rollback@1": async (payload: unknown, ctx: PluginContext): Promise<Outcome> => {
      const input = parseEvolutionRollbackInput(payload);
      const gated = await checkEvolutionActor(ctx, "evolution.rollback@1", input.actor);
      if (gated) return gated;
      const head = await vaultGet(ctx, BEHAVIOR_NS, input.contractId);
      if (!head) return fail("UNKNOWN", `behavior contract "${input.contractId}" not found`);
      const revs: RevState[] = [];
      for (let rev = head.rev; rev >= 1 && revs.length < 100; rev--) {
        const got = await vaultGet(ctx, BEHAVIOR_NS, input.contractId, rev);
        if (!got) break;
        const data = got.data as { version?: unknown; state?: unknown };
        revs.push({
          rev,
          version: typeof data.version === "string" ? data.version : "?",
          state: typeof data.state === "string" ? data.state : "?",
        });
      }
      const plan = decideRollback(revs);
      if (plan.status !== "OK" || !plan.value) return plan as Outcome;
      const activeRow = await vaultGet(ctx, BEHAVIOR_NS, input.contractId, plan.value.quarantineRev);
      const priorRow = await vaultGet(ctx, BEHAVIOR_NS, input.contractId, plan.value.reactivateRev);
      if (!activeRow || !priorRow) return fail("EVALUATION_FAILED", "rollback target revisions unreadable");
      const q = await portCall<VaultAppendResult>(ctx, "vault.append@1", {
        ns: BEHAVIOR_NS, id: input.contractId,
        data: { ...(activeRow.data as object), state: "quarantined" },
        refs: [{ ns: BEHAVIOR_NS, id: input.contractId, rev: plan.value.quarantineRev }],
      });
      const r = await portCall<VaultAppendResult>(ctx, "vault.append@1", {
        ns: BEHAVIOR_NS, id: input.contractId,
        data: { ...(priorRow.data as object), state: "active" },
        refs: [{ ns: BEHAVIOR_NS, id: input.contractId, rev: q.rev }],
      });
      const transition: EvolutionTransition = {
        kind: "rollback", id: input.contractId, actor: input.actor, evidence: [],
        behaviorRev: r.rev, quarantinedRev: plan.value.quarantineRev,
        reactivatedRev: plan.value.reactivateRev, createdAt: Date.now(),
      };
      const e = await portCall<VaultAppendResult>(ctx, "vault.append@1", {
        ns: CONTROL_NS, id: evolutionId(input.contractId), data: transition,
        refs: [{ ns: BEHAVIOR_NS, id: input.contractId, rev: r.rev }],
        meta: { type: "evolution", kind: "rollback", id: input.contractId },
      });
      return {
        status: "OK",
        value: {
          quarantinedRev: plan.value.quarantineRev, reactivatedRev: plan.value.reactivateRev,
          rev: r.rev, evolutionRev: e.rev,
        },
      };
    },

    /** One agent acts once (B1a, D-327; D-315(a) finish-then-halt, ratified).
     *  Payload {agentId, op: "<id>@<version>", payload?, realizationRef?}.
     *  See the LEDGER RULE + PRINCIPAL HONESTY notes at the top of this file:
     *  every attempt ledgers exactly once to ns "agent" id `exec:<causationId>`;
     *  refused-and-ledgered is a legitimate outcome, never silently retried. */
    "agent.exec@1": async (payload: unknown, ctx: PluginContext, meta: CallMeta): Promise<Outcome> => {
      const input = parseExecInput(payload); // throws on malformed → DEGRADED
      const ledgerId = execLedgerId(meta.causationId);
      const at = Date.now();

      // 1. resolve identity + head contract (both must exist).
      const agentRow = await vaultGet(ctx, AGENT_NS, input.agentId);
      const identity = agentRow ? asAgentIdentity("agent.exec@1", agentRow.data) : null;
      if (!identity) return fail("UNKNOWN", `agent "${input.agentId}" not found`);
      const headRow = await vaultGet(ctx, BEHAVIOR_NS, identity.behaviorContractId);
      const head = headRow ? asBehaviorContract(headRow.data) : null;
      if (!head || !headRow) return fail("UNKNOWN", `behavior contract "${identity.behaviorContractId}" not found`);
      const admittedRev = headRow.rev;
      const admittedVersion = head.version;

      // Ledger helper: exactly one append per attempt; failure throws → DEGRADED.
      const ledger = async (data: Record<string, unknown>, refs: VaultProvenanceRef[]): Promise<number> => {
        const r = await portCall<VaultAppendResult>(ctx, "vault.append@1", {
          ns: AGENT_NS, id: ledgerId, data, refs,
          meta: { type: "exec", agentId: input.agentId, op: input.op },
        });
        return r.rev;
      };
      const baseRefs: VaultProvenanceRef[] = [
        { ns: BEHAVIOR_NS, id: identity.behaviorContractId, rev: admittedRev },
        ...(input.realizationRef !== null ? [input.realizationRef] : []),
      ];

      // 2. admission (D-315 refuse-new): contract active + version-pinned + non-terminal.
      const admission = decideExecAdmission({
        contractState: head.state,
        contractVersion: head.version,
        identityState: identity.state,
        identityVersion: identity.behaviorVersion,
      });
      if (!admission.admittable) {
        const rev = await ledger({
          agentId: input.agentId, op: input.op, decision: "refused:admission",
          reason: admission.reason, admittedContractRev: admittedRev,
          realizationRef: input.realizationRef, quarantinedMidFlight: head.state !== "active",
          callOk: false, at,
        }, baseRefs);
        return fail("REFUSED", `agent.exec refused admission: ${admission.reason}`, [{ ns: AGENT_NS, id: ledgerId, rev }]);
      }

      // 3. call-scope derivation (v0: vault.* only; shape errors throw → DEGRADED).
      const scope = execCallScope(input.op, input.payload);
      if (scope.kind === "unsupported" || scope.kind === "unattributable") {
        const reason = scope.kind === "unsupported"
          ? `op "${scope.op}" is outside the v0 exec verb scope (vault.* only — B1b widens)`
          : `op "${scope.op}" carries no attributable payload ns (call scope underivable)`;
        const rev = await ledger({
          agentId: input.agentId, op: input.op, decision: scope.kind,
          reason, admittedContractRev: admittedRev,
          realizationRef: input.realizationRef, quarantinedMidFlight: false, callOk: false, at,
        }, baseRefs);
        return fail("UNSUPPORTED", `agent.exec: ${reason}`, [{ ns: AGENT_NS, id: ledgerId, rev }]);
      }

      // 4. scope subset: the call must sit inside the agent's recorded authority.
      let covered = false;
      try {
        covered = isSubset(scope.scope, identity.capabilityToken);
      } catch {
        covered = false;
      }
      if (!covered) {
        const rev = await ledger({
          agentId: input.agentId, op: input.op, callScope: scope.scope,
          decision: "refused:scope",
          reason: `call scope "${scope.scope}" exceeds agent authority "${identity.capabilityToken}"`,
          admittedContractRev: admittedRev, realizationRef: input.realizationRef,
          quarantinedMidFlight: false, callOk: false, at,
        }, baseRefs);
        return fail("REFUSED", `call scope "${scope.scope}" exceeds agent authority`, [{ ns: AGENT_NS, id: ledgerId, rev }]);
      }

      // 5. realization proof (when cited): must resolve and be PROMOTED.
      if (input.realizationRef !== null) {
        const real = await vaultGet(ctx, input.realizationRef.ns, input.realizationRef.id, input.realizationRef.rev);
        const status = (real?.data as { status?: unknown } | undefined)?.status;
        if (!real) {
          const rev = await ledger({
            agentId: input.agentId, op: input.op, callScope: scope.scope,
            decision: "refused:realization",
            reason: `realization ref ${input.realizationRef.ns}/${input.realizationRef.id}@${input.realizationRef.rev} does not resolve`,
            admittedContractRev: admittedRev, realizationRef: input.realizationRef,
            quarantinedMidFlight: false, callOk: false, at,
          }, baseRefs);
          return fail("UNKNOWN", "cited realization does not resolve (proof, not confidence)", [{ ns: AGENT_NS, id: ledgerId, rev }]);
        }
        if (status !== "PROMOTED") {
          const rev = await ledger({
            agentId: input.agentId, op: input.op, callScope: scope.scope,
            decision: "refused:realization",
            reason: `realization ${input.realizationRef.id}@${input.realizationRef.rev} is "${String(status)}", not PROMOTED`,
            admittedContractRev: admittedRev, realizationRef: input.realizationRef,
            quarantinedMidFlight: false, callOk: false, at,
          }, baseRefs);
          return fail("REFUSED", `realization is "${String(status)}", not PROMOTED — proof promotes`, [{ ns: AGENT_NS, id: ledgerId, rev }]);
        }
      }

      // 6. law pre-check FOR the agent principal (forbidden overlay + policy).
      const gate: PortResult = await ctx.port.call("law.check@1", {
        principal: input.agentId, op: input.op, payload: input.payload, causationId: meta.causationId,
      });
      if (!gate.ok) throw new Error(`vivim.agent: law.check@1 ${gate.error}: ${gate.detail ?? ""}`);
      const decision = (gate.value ?? {}) as { decision?: unknown; reason?: unknown; consentId?: unknown };
      if (decision.decision === "deny" || decision.decision === "require-consent") {
        const rev = await ledger({
          agentId: input.agentId, op: input.op, callScope: scope.scope,
          decision: "refused:forbidden",
          reason: `law.check for "${input.agentId}" → ${String(decision.decision)}: ${String(decision.reason ?? "")}`,
          admittedContractRev: admittedRev, realizationRef: input.realizationRef,
          quarantinedMidFlight: false, callOk: false, at,
        }, baseRefs);
        return fail("REFUSED", `law denies this call for ${input.agentId}: ${String(decision.reason ?? decision.decision)}`, [{ ns: AGENT_NS, id: ledgerId, rev }]);
      }

      // 7. settle: the admitted call runs to completion (no abort path — D-315 finish).
      const target: PortResult = await ctx.port.call(input.op, input.payload);
      if (!target.ok && (target.error === "DEGRADED" || target.error === "BUDGET")) {
        // Unexpected failure: ledger best-effort, then propagate fail-closed.
        try {
          await ledger({
            agentId: input.agentId, op: input.op, callScope: scope.scope,
            decision: "settled:transport-failure",
            reason: `target ${input.op} ${target.error}: ${target.detail ?? ""}`,
            admittedContractRev: admittedRev, realizationRef: input.realizationRef,
            quarantinedMidFlight: false, callOk: false, at,
          }, baseRefs);
        } catch { /* ledger best-effort on the failure path only */ }
        throw new Error(`vivim.agent: ${input.op} ${target.error}: ${target.detail ?? ""}`);
      }
      if (!target.ok) {
        const rev = await ledger({
          agentId: input.agentId, op: input.op, callScope: scope.scope,
          decision: "refused:target",
          reason: `target ${input.op} ${target.error}: ${target.detail ?? ""}`,
          admittedContractRev: admittedRev, realizationRef: input.realizationRef,
          quarantinedMidFlight: false, callOk: false, at,
        }, baseRefs);
        return fail("REFUSED", `target refused: ${target.error}: ${target.detail ?? ""}`, [{ ns: AGENT_NS, id: ledgerId, rev }]);
      }

      // 8. post-settle annotation (never aborts — the call already settled).
      const postRow = await vaultGet(ctx, BEHAVIOR_NS, identity.behaviorContractId);
      const post = postRow ? asBehaviorContract(postRow.data) : null;
      const quarantinedMidFlight = !post || !postRow
        ? true
        : execQuarantinedMidFlight({
          admittedRev, admittedVersion,
          headRev: postRow.rev, headVersion: post.version, headState: post.state,
        });
      const rev = await ledger({
        agentId: input.agentId, op: input.op, callScope: scope.scope,
        decision: "settled", admittedContractRev: admittedRev,
        realizationRef: input.realizationRef, quarantinedMidFlight,
        callOk: true, result: target.value ?? null, at,
      }, baseRefs);
      return {
        status: "OK",
        value: {
          agentId: input.agentId, op: input.op, callOk: true,
          result: target.value ?? null, ledgerRev: rev,
          admittedContractRev: admittedRev, quarantinedMidFlight,
        },
      };
    },

    // ---- D-454 (Ω-15): the delegation boundary ops ----

    /** The chain fold (D-454, READ): resolve + verify a delegation chain
     *  from ns "control" chain rows — vault-recomputed authority (carried
     *  claims are routing hints), per-edge mechanical subset attenuation,
     *  clock-pinned expiry at every hop, subtree revocation discovery, and
     *  the authorityChain digest for Ω-12 frames to cite. */
    "delegate.chain@1": async (payload: unknown, ctx: PluginContext): Promise<Outcome> => {
      const input = parseChainOpInput(payload); // throws on malformed → DEGRADED
      const snapshot = await loadChainRows(ctx);
      const fold = foldChain({
        rows: snapshot.rows.map((r) => r.data),
        leafDelegationId: input.delegationId,
        now: Date.now(),
        ...(input.depthBudget !== undefined ? { depthBudget: input.depthBudget } : {}),
        ...(input.carriedAuthority !== undefined ? { carriedAuthority: input.carriedAuthority } : {}),
      });
      if (!fold.ok) return fail("REFUSED", fold.sentence);
      return { status: "OK", value: { ...fold.value, text: renderChain(fold.value) } };
    },

    /** The cascade (D-454, MUTATION): revoke a hop and its whole descendant
     *  subtree in one append-only sweep (latest-wins per id; genealogy via
     *  append refs; already-closed rows stay closed). Descendants discover
     *  at their next fold — gate-time pull, no cached authority; the sweep
     *  is atomic in this vault, so zero live descendants remain. */
    "delegate.revoke@1": async (payload: unknown, ctx: PluginContext): Promise<Outcome> => {
      const input = parseRevokeOpInput(payload); // throws on malformed → DEGRADED
      const snapshot = await loadChainRows(ctx);
      const plan = planRevocation(snapshot.rows.map((r) => r.data), input.delegationId, Date.now());
      if (!plan.ok) return fail("REFUSED", plan.sentence);
      const cascade: Array<{ delegationId: string; rev: number }> = [];
      for (const entry of plan.value.cascade) {
        const prior = snapshot.byId.get(chainRowId(entry.delegationId));
        const r = await portCall<VaultAppendResult>(ctx, "vault.append@1", {
          ns: CONTROL_NS, id: chainRowId(entry.delegationId), data: entry.row,
          ...(prior ? { refs: [{ ns: CONTROL_NS, id: chainRowId(entry.delegationId), rev: prior.rev }] } : {}),
          meta: { type: "delegation-chain", kind: "revocation", revokedThrough: plan.value.revokedThrough },
        });
        cascade.push({ delegationId: entry.delegationId, rev: r.rev });
      }
      return {
        status: "OK",
        value: {
          revokedAt: plan.value.revokedAt, revokedThrough: plan.value.revokedThrough,
          cascade, liveDescendants: 0,
        },
      };
    },

    // ---- D-455 (Ω-16): the adaptation governance ops ----

    /** Open the ceremony (D-455, MUTATION): the diff + the rollback point
     *  (REQUIRED — the way back) + the census (empty only with its cited
     *  basis) + the treaty checks + the window. Born proposed, never
     *  ratified by construction — the flip is a signature, not a state
     *  flip. */
    "adapt.propose@1": async (payload: unknown, ctx: PluginContext): Promise<Outcome> => {
      const input = parseAdaptProposeOpInput(payload); // throws on malformed → DEGRADED
      const row = buildProposal(input, Date.now());
      if (!row.ok) return fail("REFUSED", row.sentence);
      const r = await portCall<VaultAppendResult>(ctx, "vault.append@1", {
        ns: ADAPT_NS, id: adaptProposalId(row.value.proposalId), data: row.value,
        refs: [row.value.diffRef, row.value.rollbackPoint, ...censusRefs(row.value.census)],
        meta: { type: "adaptation", kind: "proposal", target: `${row.value.target.kind}:${row.value.target.ref}` },
      });
      return {
        status: "OK",
        value: { proposalId: row.value.proposalId, status: row.value.status, censusDigest: row.value.censusDigest, rev: r.rev },
      };
    },

    /** The flip (D-455, MUTATION): window-checked, census re-digested at
     *  the flip (the census must describe the world being changed, not the
     *  world that proposed), treaty-guarded, signed — a human principal or
     *  a live auto-with-proof standing, both cited and resolved (the chain
     *  of the yes). */
    "adapt.ratify@1": async (payload: unknown, ctx: PluginContext): Promise<Outcome> => {
      const input = parseAdaptRatifyOpInput(payload); // throws on malformed → DEGRADED
      const head = await vaultGet(ctx, ADAPT_NS, adaptProposalId(input.proposalId));
      if (!head) return fail("UNKNOWN", `adaptation proposal "${input.proposalId}" not found`);
      const row = parseAdaptRow(head.data);
      if (!row) return fail("UNKNOWN", `adaptation proposal "${input.proposalId}" does not parse as a ceremony row`);
      if (input.ratifier !== undefined) {
        for (const ref of ratifierRefs(input.ratifier)) {
          const got = await vaultGet(ctx, ref.ns, ref.id, ref.rev);
          if (!got) return fail("UNKNOWN", `ratifier ref ${ref.ns}/${ref.id}@${ref.rev} does not resolve — the signature is proof, not confidence`);
        }
      }
      const ratified = ratifyProposal(row, {
        ...(input.census !== undefined ? { census: input.census } : {}),
        ...(input.treatyChecks !== undefined ? { treatyChecks: input.treatyChecks } : {}),
        ...(input.ratifier !== undefined ? { ratifier: input.ratifier } : {}),
      }, Date.now());
      if (!ratified.ok) return fail("REFUSED", ratified.sentence);
      const r = await portCall<VaultAppendResult>(ctx, "vault.append@1", {
        ns: ADAPT_NS, id: adaptProposalId(input.proposalId), data: ratified.value,
        refs: [
          { ns: ADAPT_NS, id: adaptProposalId(input.proposalId), rev: head.rev },
          ...censusRefs(ratified.value.census),
          ...(ratified.value.ratifier !== undefined ? ratifierRefs(ratified.value.ratifier) : []),
        ],
        meta: { type: "adaptation", kind: "ratification", id: input.proposalId },
      });
      return {
        status: "OK",
        value: { proposalId: input.proposalId, status: "ratified", ratifier: ratified.value.ratifier, rev: r.rev },
      };
    },

    /** The ceremony renders headless (D-455, READ): rows before pixels. */
    "adapt.read@1": async (payload: unknown, ctx: PluginContext): Promise<Outcome> => {
      const input = parseAdaptReadOpInput(payload);
      if (input.proposalId !== undefined) {
        const head = await vaultGet(ctx, ADAPT_NS, adaptProposalId(input.proposalId));
        const row = head ? parseAdaptRow(head.data) : null;
        if (!row) return fail("UNKNOWN", `adaptation proposal "${input.proposalId}" not found`);
        return { status: "OK", value: { proposal: row, text: renderCeremony([row]) } };
      }
      const q: PortResult = await ctx.port.call("vault.query@1", { ns: ADAPT_NS, filter: { idPrefix: "proposal:" } });
      if (!q.ok) throw new Error(`vivim.agent: vault.query@1 ${q.error}: ${q.detail ?? ""}`);
      const rows: AdaptProposalRow[] = [];
      for (const vrow of ((q.value as VaultRow[] | null) ?? []).slice(0, ADAPT_SCAN_CAP)) {
        const got = await vaultGet(ctx, ADAPT_NS, vrow.id);
        const row = got ? parseAdaptRow(got.data) : null;
        if (row) rows.push(row);
      }
      return { status: "OK", value: { proposals: rows, text: renderCeremony(rows) } };
    },
  },
}));

/** Latest-wins snapshot of the ns "control" delegation-chain rows (D-454,
 *  bounded scan — the vault is the authority, memory is nothing). */
async function loadChainRows(ctx: PluginContext): Promise<{
  rows: Array<{ id: string; rev: number; data: unknown }>;
  byId: Map<string, { id: string; rev: number; data: unknown }>;
}> {
  const q: PortResult = await ctx.port.call("vault.query@1", { ns: CONTROL_NS, filter: { idPrefix: "chain:" } });
  if (!q.ok) throw new Error(`vivim.agent: vault.query@1 ${q.error}: ${q.detail ?? ""}`);
  const rows: Array<{ id: string; rev: number; data: unknown }> = [];
  for (const vrow of ((q.value as VaultRow[] | null) ?? []).slice(0, CHAIN_SCAN_CAP)) {
    const got = await vaultGet(ctx, CONTROL_NS, vrow.id);
    if (got) rows.push({ id: vrow.id, rev: got.rev, data: got.data });
  }
  return { rows, byId: new Map(rows.map((r) => [r.id, r])) };
}

/** Shared spawn finalization (identity append with lineage refs). */
async function finishSpawn(
  ctx: PluginContext, meta: CallMeta,
  input: ReturnType<typeof parseSpawnInput>,
  contract: BehaviorContract, contractRev: number,
  scope: string, parentRev: number | null, agentId: string,
): Promise<Outcome> {
  const identity = buildAgentIdentity({
    id: agentId, input, contract, scope,
    createdBy: input.parentId ?? meta.from,
    parentRev, contractRev,
  });
  const r = await portCall<VaultAppendResult>(ctx, "vault.append@1", {
    ns: AGENT_NS, id: agentId, data: identity, refs: identity.provenance,
  });
  return { status: "OK", value: { identity, scope, rev: r.rev } };
}
