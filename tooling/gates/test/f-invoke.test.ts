// tooling/gates/test/f-invoke.test.ts — the F-INVOKE falsifier (D-452, Ω-12).
// Generated as a RED stub by `omega:loop --stub D-452`, then implemented.
//  F-INVOKE.1 (the-framed-run) — one op through a complete frame → the inv row carries caller, behalf, op, scope, authority, intentRef and the frameDigest; the digest replays byte-identically; journal + EXECUTED :res row cite the same causationId
//  F-INVOKE.2 (the-frameless-refusal) — an unframed EXTERNAL_MUTATION → INVOKE_FRAME_MISSING with sentence; a frame missing elements → INVOKE_FRAME_INCOMPLETE; a READ-class op frames best-effort (never refused for framelessness)
//  F-INVOKE.3 (the-deputy-trace) — an agent invokes on behalf of user:ada with a live delegation → framed, the walk carrying the chain; revoke the delegation (or the standing) → the NEXT identical call refuses INVOKE_DEPUTY_CHAIN_BROKEN — re-resolution is structural, no cache anywhere
//  F-INVOKE.4 (scope-undos-evidence) — "undo everything agent:X did in the window" → the compensation set is exactly the inv rows with caller agent:X in the window — a query, not archaeology
//  F-INVOKE.5 (pairing-audit) — delete one inv row (simulated corruption) → the pairing fold reports INVOKE_PAIRING_DRIFT naming the orphan; both sides of the orphan drift are findings
//  F-INVOKE.6 (headless) — 1–5 daemon-only, CLI-answerable, zero pixels: no surface imports, no window/document/navigator
//  F-INVOKE.7 (loud-failure) — zero implicit frames; root without a declared root-act refuses like anyone else; every refusal a sentence; every drift a finding — no branch resolves silently
import { describe, test, expect } from "bun:test";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import {
  INVOKE_FRAME_MISSING, INVOKE_AUTHORITY_UNRESOLVED, INVOKE_SCOPE_EXCEEDED, INVOKE_UNKNOWN_OP,
  INVOKE_DEPUTY_CHAIN_BROKEN, INVOKE_PAIRING_DRIFT, INVOKE_FRAME_INCOMPLETE, INVOKE_CAUSATION_REUSED,
  InvocationLedger, auditPairing, checkInvocation, frameDigest, validateFrame,
  type InvokeCheckInput, type InvokeRow,
} from "../../../plugins/vivim-law/src/invocation.ts";
import { def } from "../../../plugins/vivim-law/src/index.ts";

const NOW = 1_770_000_000_000;
const GRAPH = ["vault.append@1", "vault.get@1", "chat.send@1", "email.digest@1", "email.search@1"];
const META = { causationId: "c_inv_452", deadlineMs: 5000, from: "root" } as never;

function input(overrides: Partial<InvokeCheckInput> = {}): InvokeCheckInput {
  return {
    opClass: "EXTERNAL_MUTATION",
    knownOps: GRAPH,
    consents: [],
    delegations: [],
    standings: [],
    rootPrincipals: ["root"],
    now: NOW,
    ...overrides,
  };
}

function invRowOf(causationId: string, caller: string, at: number): InvokeRow {
  return {
    kind: "invoke@1", id: `inv:${causationId}`, frameDigest: `digest:${causationId}`, verdict: "framed",
    caller, behalf: caller, op: "vault.append@1", authorityKind: "consent", at,
  };
}

describe("F-INVOKE.1 (the-framed-run)", () => {
  test("one op through a complete frame → the inv row carries caller, behalf, op, scope, authority, intentRef and the frameDigest; journal + EXECUTED :res row cite the same causationId", () => {
    const frame = {
      caller: "user:ada", op: "vault.append@1", scope: "vault.*",
      authority: { kind: "consent", ref: "c-1" }, intentRef: "intent:42",
    };
    const v = checkInvocation(frame, { op: "vault.append@1", opClass: "EXTERNAL_MUTATION" }, input({
      consents: [{ consentId: "c-1", principal: "user:ada", op: "vault.append@1", live: true }],
    }), "cause-1");
    expect(v.verdict).toBe("framed");
    expect(v.behalf).toBe("user:ada"); // explicit with caller-default
    expect(v.authorityResolved).toBe("consent");
    expect(v.invRow).toMatchObject({
      kind: "invoke@1", id: "inv:cause-1", frameDigest: frameDigest(frame), verdict: "framed",
      caller: "user:ada", behalf: "user:ada", op: "vault.append@1", authorityKind: "consent",
      intentRef: "intent:42", at: NOW,
    });
    // the digest replays byte-identically; any material field changes it
    expect(frameDigest(frame)).toBe(frameDigest({ ...frame }));
    expect(frameDigest(frame)).not.toBe(frameDigest({ ...frame, behalf: "user:bob" }));
    expect(frameDigest(frame)).not.toBe(frameDigest({ ...frame, scope: "*" }));
    // the pairing is clean: journal + inv + EXECUTED :res cite the same causationId
    const ledger = new InvocationLedger();
    ledger.record(v.invRow!);
    const exec = [{ causationId: "cause-1", intentRef: "intent:42", at: NOW }];
    expect(auditPairing(exec, ledger.list()).refused).toBe(false);
    expect(auditPairing(exec, ledger.list()).paired).toBe(1);
    // validateFrame is the door: the complete frame passes untouched
    expect(validateFrame(frame).intentRef).toBe("intent:42");
  });
});

describe("F-INVOKE.2 (the-frameless-refusal)", () => {
  test("an unframed EXTERNAL_MUTATION refuses INVOKE_FRAME_MISSING with sentence; a frame missing elements refuses INVOKE_FRAME_INCOMPLETE; a READ-class op frames best-effort", () => {
    const missing = checkInvocation(null, { op: "chat.send@1", opClass: "EXTERNAL_MUTATION" }, input(), "cause-2");
    expect(missing.verdict).toBe("refused");
    expect(missing.code).toBe(INVOKE_FRAME_MISSING);
    expect(missing.sentence).toContain("nothing runs on an implied");
    expect(missing.invRow).toBeNull();
    // a frame present but incomplete names the missing elements
    const incomplete = checkInvocation({ caller: "user:ada", op: "chat.send@1" } as never, { op: "chat.send@1", opClass: "EXTERNAL_MUTATION" }, input(), "cause-2b");
    expect(incomplete.code).toBe(INVOKE_FRAME_INCOMPLETE);
    expect(incomplete.sentence).toContain("scope, authority");
    expect(() => validateFrame({ caller: "x", op: "y" })).toThrow(new RegExp(INVOKE_FRAME_INCOMPLETE));
    // a READ-class op frames best-effort — never refused for framelessness
    const bestEffort = checkInvocation(null, { op: "vault.get@1", opClass: "READ" }, input(), "cause-2c");
    expect(bestEffort.verdict).toBe("best-effort");
    // a framed READ resolves its frame like any framed call
    const framedRead = checkInvocation(
      { caller: "user:ada", op: "vault.get@1", scope: "vault.get@1", authority: { kind: "consent", ref: "c-r" } },
      { op: "vault.get@1", opClass: "READ" }, input({
        consents: [{ consentId: "c-r", principal: "user:ada", op: "vault.get@1", live: true }],
      }), "cause-2d",
    );
    expect(framedRead.verdict).toBe("framed");
  });
});

describe("F-INVOKE.3 (the-deputy-trace)", () => {
  test("an agent invokes on behalf of user:ada with a live delegation → framed with the chain digest; revoke the delegation or the standing → the NEXT identical call refuses — re-resolution is structural, no cache anywhere", async () => {
    const frame = {
      caller: "agent:x", behalf: "user:ada", op: "email.digest@1", scope: "email.*",
      authority: { kind: "consent", ref: "c-ada" },
    };
    const consents = [{ consentId: "c-ada", principal: "user:ada", op: "email.digest@1", live: true }];
    const chain = { delegator: "user:ada", delegatee: "agent:x", live: true, chainDigest: "chain:9" };
    const live = checkInvocation(frame, { op: "email.digest@1", opClass: "EXTERNAL_MUTATION" }, input({ consents, delegations: [chain] }), "cause-3");
    expect(live.verdict).toBe("framed");
    expect(live.authorityResolved).toBe("consent");
    expect(live.deputyChainDigest).toBe("chain:9");
    // the inv row carries caller, behalf — the deputy is JOURNALED, never implicit
    expect(live.invRow).toMatchObject({ caller: "agent:x", behalf: "user:ada", op: "email.digest@1" });
    // revoke the chain (Ω-15's op — the row flips dead) → the NEXT identical call refuses
    const dead = checkInvocation(frame, { op: "email.digest@1", opClass: "EXTERNAL_MUTATION" }, input({
      consents, delegations: [{ ...chain, live: false }],
    }), "cause-3");
    expect(dead.verdict).toBe("refused");
    expect(dead.code).toBe(INVOKE_DEPUTY_CHAIN_BROKEN);
    // a dead CONSENT is equally loud: the same frame, no live grant
    const noConsent = checkInvocation(frame, { op: "email.digest@1", opClass: "EXTERNAL_MUTATION" }, input({
      consents: [{ ...consents[0]!, live: false }], delegations: [chain],
    }), "cause-3");
    expect(noConsent.code).toBe(INVOKE_AUTHORITY_UNRESOLVED);
    // structural re-resolution THROUGH THE OPS: a standing granted via
    // standing.grant@1 authorizes the frame; revoke it; the SAME frame refuses next check
    const grant = (await def.ops!["standing.grant@1"]!({
      principal: "user:ada", grantee: "agent:y", scope: "email.digest@1",
      approvalMode: "auto", expiresAt: NOW + 10_000, now: NOW, evidence: ["F-INVOKE.3"],
    }, null, META)) as { standing: { standingId: string } };
    const sid = grant.standing.standingId;
    const deputyFrame = {
      caller: "agent:y", behalf: "user:ada", op: "email.digest@1", scope: "email.digest@1",
      authority: { kind: "standing", ref: sid },
    };
    const target = { op: "email.digest@1", opClass: "EXTERNAL_MUTATION" as const };
    const v1 = (await def.ops!["invoke.check@1"]!({ frame: deputyFrame, target, knownOps: GRAPH, now: NOW, causationId: "cause-3y" }, null, META)) as Record<string, unknown>;
    expect(v1["verdict"]).toBe("framed");
    expect(v1["deputyChainDigest"]).toBe(sid); // the standing IS the deputy authority — the radius traces the chain
    await def.ops!["standing.revoke@1"]!({ standingId: sid, reason: "mid-flight revocation", now: NOW + 1 }, null, META);
    const v2 = (await def.ops!["invoke.check@1"]!({ frame: deputyFrame, target, knownOps: GRAPH, now: NOW + 2, causationId: "cause-3z" }, null, META)) as Record<string, unknown>;
    expect(v2["verdict"]).toBe("refused");
    expect(v2["code"]).toBe(INVOKE_AUTHORITY_UNRESOLVED);
    expect(String(v2["sentence"])).toContain("dead authority"); // the standing's own refusal rides the sentence as evidence
  });
});

describe("F-INVOKE.4 (scope-undos-evidence)", () => {
  test("undo everything agent:X did in the window → the compensation set is exactly the inv rows with caller agent:X in the window — a query, not archaeology", () => {
    const ledger = new InvocationLedger();
    ledger.record(invRowOf("c1", "agent:x", NOW + 100));
    ledger.record(invRowOf("c2", "agent:x", NOW + 200));
    ledger.record(invRowOf("c3", "agent:x", NOW + 300));
    ledger.record(invRowOf("c4", "agent:z", NOW + 150));
    ledger.record(invRowOf("c5", "agent:x", NOW - 100)); // BEFORE the window — not compensation
    const set = ledger.undoSet("agent:x", { from: NOW, to: NOW + 1000 });
    expect(set.map((r) => r.id)).toEqual(["inv:c1", "inv:c2", "inv:c3"]);
    // behalf is carried too — §15 filters by principal + window, the deputy's work separates from the principal's
    const deputy = { ...invRowOf("c6", "agent:x", NOW + 400), behalf: "user:ada" };
    ledger.record(deputy);
    const withDeputy = ledger.undoSet("agent:x", { from: NOW, to: NOW + 1000 });
    expect(withDeputy).toHaveLength(4);
    expect(withDeputy.find((r) => r.id === "inv:c6")!.behalf).toBe("user:ada");
  });
});

describe("F-INVOKE.5 (pairing-audit)", () => {
  test("delete one inv row (simulated corruption) → the pairing fold reports INVOKE_PAIRING_DRIFT naming the orphan; both sides of the orphan drift are findings", () => {
    const ledger = new InvocationLedger();
    for (const c of ["c1", "c2", "c3"]) ledger.record(invRowOf(c, "agent:a", NOW));
    const execs = ["c1", "c2", "c3"].map((c) => ({ causationId: c, at: NOW }));
    // clean: one-for-one, no drift
    const clean = auditPairing(execs, ledger.list());
    expect(clean.refused).toBe(false);
    expect(clean.paired).toBe(3);
    // delete one inv row (simulated corruption)
    expect(ledger.corrupt("inv:c2")).toBe(true);
    const drifted = auditPairing(execs, ledger.list());
    expect(drifted.refused).toBe(true);
    expect(drifted.refusedWith).toBe(INVOKE_PAIRING_DRIFT);
    const orphan = drifted.drift.find((d) => d.causationId === "c2")!;
    expect(orphan).toBeTruthy();
    expect(orphan.side).toBe("exec");
    expect(orphan.kind).toBe("invoke.drift@1");
    expect(orphan.sentence).toContain("c2");
    // the other side: an inv row with no EXECUTED :res row is drift too
    const extra = auditPairing(execs, [...ledger.list(), invRowOf("c9", "agent:a", NOW)]);
    expect(extra.drift.some((d) => d.causationId === "c9" && d.side === "inv")).toBe(true);
    expect(extra.refused).toBe(true);
  });
});

describe("F-INVOKE.6 (headless)", () => {
  test("1–5 daemon-only, CLI-answerable, zero pixels: no surface imports, no window/document/navigator, and the op answers with ctx null", async () => {
    for (const f of ["invocation.ts", "standing.ts"] as const) {
      const src = readFileSync(join(import.meta.dir, "..", "..", "..", "plugins", "vivim-law", "src", f), "utf-8");
      expect(/from\s+"@vivim\/(omega-)?(surfaces|canvas|web|daemon-client)/.test(src)).toBe(false);
      expect(/\b(document|window|navigator)\s*\./.test(src)).toBe(false);
    }
    // the op answers daemon-only (ctx null — no surface, no host)
    const r = (await def.ops!["invoke.check@1"]!({
      frame: { caller: "root", op: "vault.append@1", scope: "*", authority: { kind: "root-act" } },
      target: { op: "vault.append@1", opClass: "EXTERNAL_MUTATION" },
      knownOps: GRAPH, now: NOW, causationId: "cause-6",
    }, null, META)) as Record<string, unknown>;
    expect(r["verdict"]).toBe("framed");
  });
});

describe("F-INVOKE.7 (loud-failure)", () => {
  test("zero implicit frames; root without a declared root-act refuses like anyone else; every refusal a sentence; every drift a finding — no branch resolves silently", () => {
    // root WITHOUT a frame refuses exactly like anyone else — a frame kind, not an exemption
    const rootFrameless = checkInvocation(null, { op: "vault.append@1", opClass: "EXTERNAL_MUTATION" }, input(), "c7");
    expect(rootFrameless.code).toBe(INVOKE_FRAME_MISSING);
    // root WITH the declared root-act frame is framed
    const rootFramed = checkInvocation(
      { caller: "root", op: "vault.append@1", scope: "*", authority: { kind: "root-act" } },
      { op: "vault.append@1", opClass: "EXTERNAL_MUTATION" }, input(), "c7",
    );
    expect(rootFramed.verdict).toBe("framed");
    expect(rootFramed.authorityResolved).toBe("root-act");
    // a NON-root claiming root-act refuses — the declared kind is reserved to root
    const fakeRoot = checkInvocation(
      { caller: "agent:q", op: "vault.append@1", scope: "*", authority: { kind: "root-act" } },
      { op: "vault.append@1", opClass: "EXTERNAL_MUTATION" }, input(), "c7",
    );
    expect(fakeRoot.code).toBe(INVOKE_AUTHORITY_UNRESOLVED);
    // root-act on behalf of another refuses — root acts for itself
    const rootDeputy = checkInvocation(
      { caller: "root", behalf: "user:ada", op: "vault.append@1", scope: "*", authority: { kind: "root-act" } },
      { op: "vault.append@1", opClass: "EXTERNAL_MUTATION" }, input(), "c7",
    );
    expect(rootDeputy.code).toBe(INVOKE_AUTHORITY_UNRESOLVED);
    // every remaining register code fires with a sentence
    const unknown = checkInvocation(
      { caller: "user:ada", op: "ghost.op@9", scope: "*", authority: { kind: "consent", ref: "c" } },
      { op: "ghost.op@9", opClass: "EXTERNAL_MUTATION" }, input(), "c7",
    );
    expect(unknown.code).toBe(INVOKE_UNKNOWN_OP);
    expect(unknown.sentence!.length).toBeGreaterThan(20);
    const exceeded = checkInvocation(
      { caller: "user:ada", op: "chat.send@1", scope: "vault.*", authority: { kind: "consent", ref: "c" } },
      { op: "chat.send@1", opClass: "EXTERNAL_MUTATION" }, input(), "c7",
    );
    expect(exceeded.code).toBe(INVOKE_SCOPE_EXCEEDED);
    expect(exceeded.sentence).toContain("where the op stops");
    const unresolved = checkInvocation(
      { caller: "user:ada", op: "chat.send@1", scope: "chat.*", authority: { kind: "consent", ref: "ghost" } },
      { op: "chat.send@1", opClass: "EXTERNAL_MUTATION" }, input(), "c7",
    );
    expect(unresolved.code).toBe(INVOKE_AUTHORITY_UNRESOLVED);
    // the ledger door: a re-used causationId refuses by name — one inv row per execution
    const ledger = new InvocationLedger();
    ledger.record(invRowOf("cx", "agent:a", NOW));
    expect(() => ledger.record(invRowOf("cx", "agent:a", NOW))).toThrow(new RegExp(INVOKE_CAUSATION_REUSED));
    // no warn-and-continue: the pure cores contain no empty catch branch
    for (const f of ["invocation.ts", "standing.ts"] as const) {
      const src = readFileSync(join(import.meta.dir, "..", "..", "..", "plugins", "vivim-law", "src", f), "utf-8");
      expect(/catch\s*(\([^)]*\))?\s*\{\s*\}/.test(src)).toBe(false);
      expect(/catch\s*(\([^)]*\))?\s*\{\s*\/\*/.test(src)).toBe(false);
    }
  });
});
