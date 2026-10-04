// tooling/gates/test/f-standing.test.ts — the F-STANDING falsifier (D-453, Ω-13).
// Generated as a RED stub by `omega:loop --stub D-453`, then implemented.
//  F-STANDING.1 (the-zoned-yes) — auto-with-proof standing for provider.gmail healings → ten passing-proof checks run with zero prompts (verdict standing each); a failing proof falls to ask → exactly one escalation card surfaces
//  F-STANDING.2 (the-expiry) — a standing lapsed clock-pinned → the next check refuses STANDING_EXPIRED naming expiresAt and the renewal path; renewal produces a new row citing the old; re-granting the same id refuses STANDING_RENEWAL_AS_EXTENSION
//  F-STANDING.3 (the-single-card) — exceed the radius → STANDING_SCOPE_EXCEEDED and exactly one escalation row with principal/scope/reason in a sentence; a second surface of the same request is the SAME card; ignored past deadline → STANDING_ESCALATION_STALLED, nothing executed
//  F-STANDING.4 (the-inspection) — the radius list for a principal → every radius with scope, context, mode, expiry, and revocation state — the §14 query answered as rows
//  F-STANDING.5 (the-revocation) — revoke mid-flight → the next check refuses STANDING_REVOKED (immediate and loud, naming revokedAt and reason); a second revoke refuses loudly; no cached authority survives anywhere in the tree
//  F-STANDING.6 (headless) — 1–5 daemon-only — the card is a row before it is a pixel: no surface imports, no window/document/navigator
//  F-STANDING.7 (loud-failure) — zero auto-yes paths: a grant without expiresAt refuses STANDING_PERPETUAL_REFUSED, malformed rows refuse STANDING_ROW_INVALID at the door, every lapse/stall/exceedance is a sentence — never a silent default
import { describe, test, expect } from "bun:test";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import {
  STANDING_EXPIRED, STANDING_REVOKED, STANDING_SCOPE_EXCEEDED, STANDING_PERPETUAL_REFUSED,
  STANDING_CONTEXT_UNMATCHED, STANDING_ESCALATION_STALLED, STANDING_RENEWAL_AS_EXTENSION,
  STANDING_SCOPE_INVALID, STANDING_ROW_INVALID, STANDING_UNKNOWN,
  EscalationBook, StandingStore, checkStanding, contextMatches, expiredSentence, grantIdOf,
  revokedSentence, scopeCovers, validateStanding,
  type StandingRow,
} from "../../../plugins/vivim-law/src/standing.ts";
import { def } from "../../../plugins/vivim-law/src/index.ts";

const NOW = 1_770_000_000_000;
const META = { causationId: "c_std_453", deadlineMs: 5000, from: "root" } as never;

function radius(overrides: Partial<StandingRow> = {}): StandingRow {
  return {
    standingId: "standing:test-1",
    principal: "user:ada",
    grantee: "agent:g",
    scope: "provider.gmail.heal@1",
    approvalMode: "auto",
    expiresAt: NOW + 86_400_000,
    grantedAt: NOW,
    evidence: ["consent-card:signed"],
    ...overrides,
  };
}

describe("F-STANDING.1 (the-zoned-yes)", () => {
  test("auto-with-proof standing for provider.gmail healings → ten passing-proof checks run with zero prompts; a failing proof falls to ask → exactly one escalation card surfaces", () => {
    const store = new StandingStore();
    store.grant(radius({ approvalMode: "auto-with-proof" }));
    // ten passing-proof healings run with ZERO prompts — the zoned yes
    for (let i = 0; i < 10; i++) {
      const v = checkStanding(store.get("standing:test-1")!, { op: "provider.gmail.heal@1", proofPassed: true, now: NOW + i });
      expect(v.verdict).toBe("standing");
      expect(v.mode).toBe("auto-with-proof");
    }
    // the eleventh with a failing proof falls to ASK — never a silent yes, never a refusal
    const ask = checkStanding(store.get("standing:test-1")!, { op: "provider.gmail.heal@1", proofPassed: false, now: NOW + 11 });
    expect(ask.verdict).toBe("ask");
    expect(ask.code).toBeUndefined();
    // → exactly one escalation surfaces: a row with principal/scope/reason in a sentence
    const book = new EscalationBook();
    const card = book.surface({
      principal: "user:ada", grantee: "agent:g", scope: "provider.gmail.heal@1",
      reason: "the proof report failed", deadline: NOW + 86_400_000, requestedAt: NOW + 11,
    });
    expect(card.kind).toBe("standing.escalation@1");
    expect(card.sentence).toContain("user:ada");
    expect(card.sentence).toContain("provider.gmail.heal@1");
    expect(card.sentence).toContain("the proof report failed");
    expect(book.list()).toHaveLength(1);
    // a plain "auto" radius never asks: passing or failing, the radius holds (proof is auto-with-proof's condition)
    const auto = checkStanding(radius({ approvalMode: "auto" }), { op: "provider.gmail.heal@1", proofPassed: false, now: NOW });
    expect(auto.verdict).toBe("standing");
  });
});

describe("F-STANDING.2 (the-expiry)", () => {
  test("a standing lapsed clock-pinned refuses STANDING_EXPIRED naming expiresAt and the renewal path; renewal produces a new row citing the old; re-granting the same id refuses STANDING_RENEWAL_AS_EXTENSION", () => {
    const store = new StandingStore();
    store.grant(radius({ standingId: "standing:e1", scope: "email.digest@1", expiresAt: NOW + 1000 }));
    expect(checkStanding(store.get("standing:e1")!, { op: "email.digest@1", now: NOW + 999 }).verdict).toBe("standing");
    // clock-pinned lapse — expiry is a refusal, not a cleanup job
    const lapsed = checkStanding(store.get("standing:e1")!, { op: "email.digest@1", now: NOW + 1000 });
    expect(lapsed.verdict).toBe("refused");
    expect(lapsed.code).toBe(STANDING_EXPIRED);
    expect(lapsed.sentence).toContain(String(NOW + 1000));
    expect(lapsed.sentence).toContain("fresh ceremony");
    // renewal is a FRESH grant citing the old — the chain visible
    const renewed = store.renew("standing:e1", radius({ scope: "email.digest@1", expiresAt: NOW + 9000, grantedAt: NOW + 2000, evidence: ["renewal-card"] }));
    expect(renewed.renewedFrom).toBe("standing:e1");
    expect(renewed.standingId).not.toBe("standing:e1");
    expect(renewed.standingId.startsWith("standing:")).toBe(true);
    expect(checkStanding(renewed, { op: "email.digest@1", now: NOW + 2500 }).verdict).toBe("standing");
    // the lapsed row is evidence, never deleted
    expect(store.get("standing:e1")).not.toBeNull();
    // re-granting the SAME id refuses — cannot be extended in place
    expect(() => store.grant(radius({ standingId: "standing:e1", scope: "email.digest@1", expiresAt: NOW + 1000 }))).toThrow(new RegExp(STANDING_RENEWAL_AS_EXTENSION));
    expect(expiredSentence(NOW).length).toBeGreaterThan(20);
  });
});

describe("F-STANDING.3 (the-single-card)", () => {
  test("exceed the radius → STANDING_SCOPE_EXCEEDED and exactly one escalation row in a sentence; a second surface is the SAME card; ignored past deadline → STANDING_ESCALATION_STALLED, nothing executed", () => {
    const store = new StandingStore();
    const row = radius({ standingId: "standing:s1", scope: "email.digest@1" });
    store.grant(row);
    const exceeded = checkStanding(row, { op: "chat.send@1", now: NOW });
    expect(exceeded.verdict).toBe("refused");
    expect(exceeded.code).toBe(STANDING_SCOPE_EXCEEDED);
    expect(exceeded.sentence).toContain("escalation is one sentence away");
    // exactly ONE escalation row + consent request with principal/scope/reason in a sentence
    const book = new EscalationBook();
    const req = { principal: "user:ada", grantee: "agent:g", scope: "chat.send@1", reason: "the frame exceeds every radius", deadline: NOW + 100, requestedAt: NOW };
    const card1 = book.surface(req);
    const card2 = book.surface(req); // the same ask again — ONE card, not a storm
    expect(card2.escalationId).toBe(card1.escalationId);
    expect(book.list()).toHaveLength(1);
    // a DIFFERENT ask is a different card (single card per ask, not per principal)
    const other = book.surface({ ...req, scope: "vault.append@1" });
    expect(other.escalationId).not.toBe(card1.escalationId);
    expect(book.list()).toHaveLength(2);
    // ignore it past deadline → STANDING_ESCALATION_STALLED, nothing executed
    const stalled = book.stalled(NOW + 101);
    expect(stalled.map((s) => s.escalationId)).toContain(card1.escalationId);
    expect(stalled.map((s) => s.escalationId)).toContain(other.escalationId);
    // answering past the deadline refuses loudly — an ignored question is never a yes
    expect(() => book.answer(card1.escalationId, "yes", NOW + 200)).toThrow(new RegExp(STANDING_ESCALATION_STALLED));
    // nothing executed: a stalled card authorizes NOTHING — the radius alone decides
    expect(checkStanding(row, { op: "email.digest@1", now: NOW + 200 }).verdict).toBe("standing"); // the ORIGINAL scope still holds
    expect(checkStanding(row, { op: "chat.send@1", now: NOW + 200 }).verdict).toBe("refused"); // the stalled ask granted nothing new
  });
});

describe("F-STANDING.4 (the-inspection)", () => {
  test("the radius list for a principal → every radius with scope, context, mode, expiry, and revocation state — the §14 query answered as rows", () => {
    const store = new StandingStore();
    store.grant(radius({ standingId: "standing:i1", scope: "email.*", context: "ns:email" }));
    store.grant(radius({ standingId: "standing:i2", scope: "provider.gmail.heal@1", approvalMode: "auto-with-proof" }));
    store.grant(radius({ standingId: "standing:i3", principal: "user:bob", grantee: "agent:h", scope: "chat.send@1" }));
    const radii = store.listFor("user:ada");
    expect(radii).toHaveLength(2);
    for (const r of radii) {
      expect(r.principal).toBe("user:ada");
      expect(typeof r.scope).toBe("string");
      expect(typeof r.expiresAt).toBe("number");
      expect(["ask", "auto", "auto-with-proof"]).toContain(r.approvalMode);
      expect(r.revokedAt === undefined || typeof r.revokedAt === "number").toBe(true);
      expect(Array.isArray(r.evidence)).toBe(true);
    }
    // revocation state rides the row — inspectable the moment it lands
    store.revoke("standing:i1", { reason: "project over", now: NOW + 5 });
    const revokedRow = store.listFor("user:ada").find((r) => r.standingId === "standing:i1")!;
    expect(revokedRow.revokedAt).toBe(NOW + 5);
    expect(revokedRow.revokeReason).toBe("project over");
    // the grantee view answers too — "what may my agents do?" from either side
    expect(store.listFor("agent:g")).toHaveLength(2);
    expect(store.listFor("agent:h")).toHaveLength(1);
    // the context matcher: a radius is a place and a time, not a passport
    expect(contextMatches("ns:email", "ns:email")).toBe(true);
    expect(contextMatches(undefined, "ns:anything")).toBe(true);
    const cm = checkStanding(radius({ context: "ns:email" }), { op: "provider.gmail.heal@1", context: "ns:calendar", now: NOW });
    expect(cm.code).toBe(STANDING_CONTEXT_UNMATCHED);
  });
});

describe("F-STANDING.5 (the-revocation)", () => {
  test("revoke mid-flight → the next check refuses STANDING_REVOKED (immediate and loud, naming revokedAt and reason); a second revoke refuses loudly; no cached authority survives anywhere", async () => {
    const store = new StandingStore();
    store.grant(radius({ standingId: "standing:r1" }));
    // revoke mid-flight — immediate and loud
    const revoked = store.revoke("standing:r1", { reason: "mid-flight", now: NOW + 5 });
    expect(revoked.revokedAt).toBe(NOW + 5);
    expect(revoked.revokeReason).toBe("mid-flight");
    // the next check refuses — no cached authority anywhere
    const v = checkStanding(revoked, { op: "provider.gmail.heal@1", now: NOW + 6 });
    expect(v.verdict).toBe("refused");
    expect(v.code).toBe(STANDING_REVOKED);
    expect(v.sentence).toContain(String(NOW + 5));
    expect(v.sentence).toContain("mid-flight");
    expect(revokedSentence(NOW, "why").length).toBeGreaterThan(20);
    // a second revoke refuses LOUDLY — never a silent idempotent success
    expect(() => store.revoke("standing:r1", { now: NOW + 7 })).toThrow(new RegExp(STANDING_REVOKED));
    // an unknown id refuses by name
    expect(() => store.revoke("standing:ghost", { now: NOW })).toThrow(new RegExp(STANDING_UNKNOWN));
    // the op path end-to-end: grant → check standing → revoke → check refuses (fresh every call)
    const g = (await def.ops!["standing.grant@1"]!({
      principal: "user:ada-ops", grantee: "agent:ops", scope: "chat.send@1",
      approvalMode: "auto", expiresAt: NOW + 1000, now: NOW, evidence: ["F-STANDING.5"],
    }, null, META)) as { standing: StandingRow };
    const sid = g.standing.standingId;
    expect(sid.startsWith("standing:")).toBe(true);
    const ok = (await def.ops!["standing.check@1"]!({ standingId: sid, op: "chat.send@1", now: NOW + 1 }, null, META)) as { verdict: string };
    expect(ok.verdict).toBe("standing");
    await def.ops!["standing.revoke@1"]!({ standingId: sid, reason: "mid-flight op", now: NOW + 2 }, null, META);
    const refused = (await def.ops!["standing.check@1"]!({ standingId: sid, op: "chat.send@1", now: NOW + 3 }, null, META)) as { verdict: string; code?: string };
    expect(refused.verdict).toBe("refused");
    expect(refused.code).toBe(STANDING_REVOKED);
    // a second revoke through the op refuses loudly too
    await expect(def.ops!["standing.revoke@1"]!({ standingId: sid, now: NOW + 4 }, null, META)).rejects.toThrow(new RegExp(STANDING_REVOKED));
  });
});

describe("F-STANDING.6 (headless)", () => {
  test("1–5 daemon-only — the card is a row before it is a pixel: no surface imports, no window/document/navigator, and the ops answer with ctx null", async () => {
    for (const f of ["standing.ts"] as const) {
      const src = readFileSync(join(import.meta.dir, "..", "..", "..", "plugins", "vivim-law", "src", f), "utf-8");
      expect(/from\s+"@vivim\/(omega-)?(surfaces|canvas|web|daemon-client)/.test(src)).toBe(false);
      expect(/\b(document|window|navigator)\s*\./.test(src)).toBe(false);
    }
    // the card is a ROW before it is a pixel — pure serializable data
    const book = new EscalationBook();
    const card = book.surface({ principal: "user:ada", scope: "chat.send@1", reason: "headless check", deadline: NOW + 1, requestedAt: NOW });
    expect(JSON.parse(JSON.stringify(card)).kind).toBe("standing.escalation@1");
    // the ops answer daemon-only (ctx null — no surface, no host)
    const r = (await def.ops!["standing.grant@1"]!({
      principal: "user:headless", grantee: "agent:headless", scope: "vault.get@1",
      approvalMode: "ask", expiresAt: NOW + 5000, now: NOW, evidence: [],
    }, null, META)) as { standing: StandingRow };
    expect(r.standing.standingId.startsWith("standing:")).toBe(true);
    const c = (await def.ops!["standing.check@1"]!({ standingId: r.standing.standingId, op: "vault.get@1", now: NOW + 1 }, null, META)) as { verdict: string };
    expect(c.verdict).toBe("standing");
  });
});

describe("F-STANDING.7 (loud-failure)", () => {
  test("zero auto-yes paths: a grant without expiresAt refuses STANDING_PERPETUAL_REFUSED, malformed rows refuse at the door, every lapse/stall/exceedance is a sentence — never a silent default", async () => {
    // a grant without expiresAt — authority without duration is not standing, it is surrender
    expect(() => new StandingStore().grant({
      standingId: "standing:p", principal: "user:ada", grantee: "agent:g", scope: "*", grantedAt: NOW, evidence: [],
    } as never)).toThrow(new RegExp(STANDING_PERPETUAL_REFUSED));
    // ... through the OP door too: standing.grant@1 without expiresAt refuses the same way
    await expect(def.ops!["standing.grant@1"]!({
      principal: "user:ada", grantee: "agent:g", scope: "*", now: NOW, evidence: [],
    }, null, META)).rejects.toThrow(new RegExp(STANDING_PERPETUAL_REFUSED));
    // malformed rows refuse STANDING_ROW_INVALID at the door
    expect(() => validateStanding({ standingId: "", principal: "p", grantee: "g", scope: "*", expiresAt: 1, grantedAt: 0, evidence: [] })).toThrow(new RegExp(STANDING_ROW_INVALID));
    expect(() => validateStanding({ standingId: "s", principal: "p", grantee: "g", scope: "*", expiresAt: 1, grantedAt: 0, approvalMode: "always", evidence: [] })).toThrow(new RegExp(STANDING_ROW_INVALID));
    expect(() => validateStanding({ standingId: "s", principal: "p", grantee: "g", scope: "a b", expiresAt: 1, grantedAt: 0, evidence: [] })).toThrow(new RegExp(STANDING_SCOPE_INVALID));
    // the scope grammar is real: exact, prefix-*, * — and nothing else
    expect(scopeCovers("chat.send@1", "chat.send@1")).toBe(true);
    expect(scopeCovers("chat.*", "chat.send@1")).toBe(true);
    expect(scopeCovers("*", "anything@9")).toBe(true);
    expect(scopeCovers("chat.send@1", "chat.read@1")).toBe(false);
    // the grantId grammar is stable: same shape, same id
    expect(grantIdOf({ principal: "p", grantee: "g", scope: "s" })).toBe(grantIdOf({ principal: "p", grantee: "g", scope: "s" }));
    expect(grantIdOf({ principal: "p", grantee: "g", scope: "s" })).not.toBe(grantIdOf({ principal: "p", grantee: "g", scope: "t" }));
    // every register sentence is a sentence — spot-check the family
    expect(expiredSentence(1).length).toBeGreaterThan(20);
    expect(revokedSentence(1, "r").length).toBeGreaterThan(20);
    // no warn-and-continue: the pure core contains no empty catch branch
    const src = readFileSync(join(import.meta.dir, "..", "..", "..", "plugins", "vivim-law", "src", "standing.ts"), "utf-8");
    expect(/catch\s*(\([^)]*\))?\s*\{\s*\}/.test(src)).toBe(false);
    expect(/catch\s*(\([^)]*\))?\s*\{\s*\/\*/.test(src)).toBe(false);
    // zero auto-yes: an unanswered stalled escalation never becomes a standing —
    // the only doors are grant (expiresAt REQUIRED) and renew (a fresh citing row)
    const book = new EscalationBook();
    const card = book.surface({ principal: "user:ada", scope: "x@1", reason: "r", deadline: NOW, requestedAt: NOW });
    expect(book.stalled(NOW + 1)).toHaveLength(1);
    expect(() => book.answer(card.escalationId, "yes", NOW + 1)).toThrow(new RegExp(STANDING_ESCALATION_STALLED));
  });
});
