// tooling/gates/test/f-aperture-privacy.test.ts — the F-APERTURE-PRIVACY falsifier (D-451, Ω-11).
// Generated as a RED stub by `omega:loop --stub D-451`, then implemented.
//  F-APERTURE-PRIVACY.1 (the-generalized-fence) — a cross-principal read against ns email (not just chat) → REFUSED verdict + ns privacy refusal row naming owner/caller/class; the owner's read still succeeds
//  F-APERTURE-PRIVACY.2 (the-derived-leak) — a summary row written into an open namespace citing principal-class inputs → APERTURE_TAINT_MISMATCH at write; the same summary written with class principal succeeds — and the fence then guards it
//  F-APERTURE-PRIVACY.3 (the-deputy-ceiling) — a deputy delegated without dataReach reading principal-class rows → APERTURE_REACH_UNDECLARED (absent = none, fail closed); a declared ceiling below the class → APERTURE_DEPUTY_OVERREACH; with dataReach principal → the read succeeds and the grantor's own view caps it (min)
//  F-APERTURE-PRIVACY.4 (fail-closed-default) — a namespace with no class row → reads refuse APERTURE_CLASS_UNKNOWN; declaring the class opens it exactly as declared; a write weakening the fail-closed baseline refuses APERTURE_CLASS_WEAKENED
//  F-APERTURE-PRIVACY.5 (grandfather-honesty) — the D-379 chat-fence envelope shape reads identically under the general law (strict superset; the refusal_* row family generalized, the precedent rows untouched)
//  F-APERTURE-PRIVACY.6 (headless) — 1–5 daemon-only, zero pixels: the module imports no surface dependency and never touches window/document/navigator
//  F-APERTURE-PRIVACY.7 (loud-failure) — zero silent degradation: every fence crossing is a verdict + row; every taint finding is ledgered, never auto-fixed; an export carrying secrets refuses APERTURE_EXPORT_WITH_SECRETS
import { describe, test, expect } from "bun:test";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import {
  APERTURE_CROSS_PRINCIPAL, APERTURE_DEPUTY_OVERREACH, APERTURE_DERIVED_LEAK, APERTURE_CLASS_UNKNOWN,
  APERTURE_CLASS_WEAKENED, APERTURE_TAINT_MISMATCH, APERTURE_RATCHET_WEAKENED, APERTURE_REACH_UNDECLARED,
  APERTURE_EXPORT_WITH_SECRETS, APERTURE_CLASS_DUPLICATE, CLASS_LATTICE, PRIVACY_CLASSES,
  PrivacyClassStore, PrivacyRefusalLedger, activeClassMap, auditTaint, deputyCeiling, effectiveClass,
  exportGate, fenceCheck, taintFold, validateClassRow, withLedgerRef, writeGate,
  type PrivacyClass, type PrivacyClassRow,
} from "../../../plugins/vivim-law/src/apertureprivacy.ts";
import { def } from "../../../plugins/vivim-law/src/index.ts";

const NOW = 1_770_000_000_000;
const META = { causationId: "c_ap_451", deadlineMs: 5000, from: "root" } as never;

function classRows(decls: Array<[string, PrivacyClass]>): PrivacyClassRow[] {
  return decls.map(([ns, cls], i) => ({ id: `class:${ns}`, ns, class: cls, at: NOW + i }));
}
function mapOf(...decls: Array<[string, PrivacyClass]>): Map<string, PrivacyClass> {
  return activeClassMap(classRows(decls));
}

describe("F-APERTURE-PRIVACY.1 (the-generalized-fence)", () => {
  test("a cross-principal read against ns email (not just chat) refuses as a REFUSED verdict + ns privacy refusal row naming owner/caller/class; the owner's read still succeeds", async () => {
    const map = mapOf(["email", "principal"]);
    const v = fenceCheck({ ns: "email", id: "msg:42", owner: "user:ada", reader: "user:bob" }, map, undefined, NOW);
    expect(v.verdict).toBe("REFUSED");
    expect(v.code).toBe(APERTURE_CROSS_PRINCIPAL);
    expect(v.sentence).toContain("user:ada");
    expect(v.sentence).toContain("user:bob");
    expect(v.sentence).toContain("principal");
    expect(v.refusalRow).toMatchObject({
      kind: "privacy.refusal@1", target: "email/msg:42", owner: "user:ada", caller: "user:bob",
      op: "vault.get@1", class: "principal", at: NOW,
    });
    // the refusal lands a row in ns privacy (the D-379 discipline, centralized)
    const ledger = new PrivacyRefusalLedger();
    const led = withLedgerRef(v, ledger);
    expect(ledger.list()).toHaveLength(1);
    expect(led.envelope!.ledgerRef.ns).toBe("privacy");
    expect(led.envelope!.ledgerRef.id.startsWith("refusal:")).toBe(true);
    // the owner's read still succeeds
    const own = fenceCheck({ ns: "email", id: "msg:42", owner: "user:ada", reader: "user:ada" }, map, undefined, NOW);
    expect(own.verdict).toBe("allow");
    // open-class data stays world-readable — the fence is class law, not a blanket
    const open = fenceCheck({ ns: "notes-public", id: "n1", owner: "user:ada", reader: "user:bob" }, mapOf(["notes-public", "open"]), undefined, NOW);
    expect(open.verdict).toBe("allow");
    // the op path: privacy.check@1 (action read) returns the verdict + the ledgered envelope — daemon-only, ctx null
    const r = (await def.ops!["privacy.check@1"]!({
      action: "read",
      classes: classRows([["email", "principal"]]),
      read: { ns: "email", id: "msg:42", owner: "user:ada", reader: "user:bob" },
    }, null, META)) as Record<string, unknown>;
    expect(r["verdict"]).toBe("REFUSED");
    expect(r["code"]).toBe(APERTURE_CROSS_PRINCIPAL);
    expect(r["ledgered"]).toBe(true);
    const env = r["envelope"] as { refused: boolean; error: string; ledgerRef: { id: string } };
    expect(env.refused).toBe(true);
    expect(env.error).toBe("REFUSED");
    expect(env.ledgerRef.id.startsWith("refusal:")).toBe(true);
  });
});

describe("F-APERTURE-PRIVACY.2 (the-derived-leak)", () => {
  test("a summary written into an open namespace citing principal-class inputs refuses APERTURE_TAINT_MISMATCH at write; written with class principal it succeeds — and the fence then guards it", async () => {
    const map = mapOf(["notes", "open"], ["email", "principal"]);
    const cites = [{ ns: "email", id: "msg:7", rev: 3, class: "principal" as PrivacyClass }];
    const bad = writeGate({ ns: "notes", id: "summary:1", owner: "user:ada", cites }, map, undefined, NOW);
    expect(bad.verdict).toBe("refused");
    expect(bad.code).toBe(APERTURE_TAINT_MISMATCH);
    expect(bad.sentence).toContain("laundered");
    expect(bad.taint).toBe("principal");
    // the same summary written WITH class principal succeeds
    const good = writeGate({ ns: "notes", id: "summary:1", owner: "user:ada", class: "principal", cites }, map, undefined, NOW);
    expect(good.verdict).toBe("allow");
    expect(good.effectiveClass).toBe("principal");
    // and the fence then guards it (privacy died in the fold — never again)
    const fenced = fenceCheck({ ns: "notes", id: "summary:1", owner: "user:ada", reader: "user:bob", class: "principal" }, map, undefined, NOW);
    expect(fenced.verdict).toBe("REFUSED");
    expect(fenced.code).toBe(APERTURE_CROSS_PRINCIPAL);
    // the taint fold op: max over cited inputs, mixed lattice
    const r = (await def.ops!["privacy.taint@1"]!({
      cites: [
        { ns: "notes", id: "n1", class: "open" },
        { ns: "notes", id: "n2", class: "internal" },
        { ns: "email", id: "msg:7", class: "principal" },
      ],
    }, null, META)) as { taint: PrivacyClass };
    expect(r.taint).toBe("principal");
    expect(taintFold([{ ns: "a", id: "x", class: "secret" }, { ns: "b", id: "y", class: "principal" }], map).taint).toBe("secret");
    // a citation into an undeclared namespace fails closed to secret + surfaces unverified
    const fc = taintFold([{ ns: "undeclared-ns", id: "z" }], map);
    expect(fc.taint).toBe("secret");
    expect(fc.unverified).toEqual(["undeclared-ns/z"]);
    // ... and the write gate quarantines such a fold rather than guessing
    const quarantined = writeGate({ ns: "notes", id: "summary:2", owner: "user:ada", class: "secret", cites: [{ ns: "undeclared-ns", id: "z" }] }, map, undefined, NOW);
    expect(quarantined.verdict).toBe("refused");
    expect(quarantined.code).toBe("APERTURE_TAINT_UNVERIFIED");
  });
});

describe("F-APERTURE-PRIVACY.3 (the-deputy-ceiling)", () => {
  test("absent dataReach refuses APERTURE_REACH_UNDECLARED (none, fail closed); a declared ceiling below the class refuses APERTURE_DEPUTY_OVERREACH; dataReach principal reads and the grantor's view caps it (min)", () => {
    const map = mapOf(["email", "principal"]);
    const read = { ns: "email", id: "msg:9", owner: "user:ada", reader: "agent:x" };
    // dataReach ABSENT → none, fail closed — working for someone is not seeing like them
    const absent = fenceCheck(read, map, { grantor: "user:ada" }, NOW);
    expect(absent.verdict).toBe("REFUSED");
    expect(absent.code).toBe(APERTURE_REACH_UNDECLARED);
    // declared BELOW the class → overreach
    const low = fenceCheck(read, map, { grantor: "user:ada", dataReach: "internal" }, NOW);
    expect(low.code).toBe(APERTURE_DEPUTY_OVERREACH);
    // the grantor's own lawful view caps the declared reach (the min fold)
    const capped = fenceCheck(read, map, { grantor: "user:ada", dataReach: "secret", grantorView: "internal" }, NOW);
    expect(capped.code).toBe(APERTURE_DEPUTY_OVERREACH);
    expect(deputyCeiling({ grantor: "user:ada", dataReach: "secret", grantorView: "internal" })).toBe("internal");
    // with dataReach principal → the read succeeds, the amendment visible in the grammar
    const ok = fenceCheck(read, map, { grantor: "user:ada", dataReach: "principal" }, NOW);
    expect(ok.verdict).toBe("allow");
    expect(deputyCeiling({ grantor: "user:ada", dataReach: "principal" })).toBe("principal");
    // an absent reach still covers open + internal (choicepoint 4's exact ruling)
    const openNs = fenceCheck({ ns: "notes-public", id: "n", owner: "user:ada", reader: "agent:x" }, mapOf(["notes-public", "open"]), { grantor: "user:ada" }, NOW);
    expect(openNs.verdict).toBe("allow");
    const internalNs = fenceCheck({ ns: "notes-team", id: "n", owner: "user:ada", reader: "agent:x" }, mapOf(["notes-team", "internal"]), { grantor: "user:ada" }, NOW);
    expect(internalNs.verdict).toBe("allow");
    // a deputy acting for a NON-owner crosses the fence — the resolved reader is the chain's root
    const cross = fenceCheck({ ns: "email", id: "msg:9", owner: "user:carol", reader: "agent:x" }, map, { grantor: "user:ada", dataReach: "secret" }, NOW);
    expect(cross.code).toBe(APERTURE_CROSS_PRINCIPAL);
  });
});

describe("F-APERTURE-PRIVACY.4 (fail-closed-default)", () => {
  test("a namespace with no class row refuses APERTURE_CLASS_UNKNOWN; declaring opens it exactly as declared; weakening the fail-closed baseline and lowering an existing taint both refuse", () => {
    const map = mapOf(["notes", "open"]);
    // a namespace with no class row → unclassifiable data is unreadable data (even the owner's)
    const owner = fenceCheck({ ns: "fresh-ns", id: "x", owner: "user:ada", reader: "user:ada" }, map, undefined, NOW);
    expect(owner.verdict).toBe("REFUSED");
    expect(owner.code).toBe(APERTURE_CLASS_UNKNOWN);
    expect(owner.sentence).toContain("unclassifiable");
    // the effective class fails closed to secret
    expect(effectiveClass("fresh-ns", map)).toBe("secret");
    // declaring the class opens it exactly as declared
    const asOpen = fenceCheck({ ns: "fresh-ns", id: "x", owner: "user:ada", reader: "user:bob" }, mapOf(["fresh-ns", "open"]), undefined, NOW);
    expect(asOpen.verdict).toBe("allow");
    const asPrincipal = fenceCheck({ ns: "fresh-ns", id: "x", owner: "user:ada", reader: "user:bob" }, mapOf(["fresh-ns", "principal"]), undefined, NOW);
    expect(asPrincipal.code).toBe(APERTURE_CROSS_PRINCIPAL);
    // a write weakening the fail-closed baseline refuses — classes ratchet up, never down
    const weakened = writeGate({ ns: "fresh-ns", id: "x", owner: "user:ada", class: "open" }, map, undefined, NOW);
    expect(weakened.verdict).toBe("refused");
    expect(weakened.code).toBe(APERTURE_CLASS_WEAKENED);
    // the strengthen-only ratchet over time: a write may not LOWER an existing row's taint
    const lowered = writeGate({ ns: "notes", id: "n1", owner: "user:ada", class: "principal" }, mapOf(["notes", "open"]), "secret", NOW);
    expect(lowered.code).toBe(APERTURE_RATCHET_WEAKENED);
    // strengthening passes (principal → secret over an open ns)
    const raised = writeGate({ ns: "notes", id: "n1", owner: "user:ada", class: "secret" }, mapOf(["notes", "open"]), "principal", NOW);
    expect(raised.verdict).toBe("allow");
    expect(raised.effectiveClass).toBe("secret");
  });
});

describe("F-APERTURE-PRIVACY.5 (grandfather-honesty)", () => {
  test("the D-379 chat-fence envelope shape reads identically under the general law — strict superset, the refusal_* family generalized, precedent rows untouched", () => {
    const map = mapOf(["chat", "principal"]);
    const v = fenceCheck({ ns: "chat", id: "conv:ada-1", owner: "user:ada", reader: "user:bob", op: "chat.history@1" }, map, undefined, NOW);
    expect(v.verdict).toBe("REFUSED");
    expect(v.code).toBe(APERTURE_CROSS_PRINCIPAL);
    const ledger = new PrivacyRefusalLedger();
    const led = withLedgerRef(v, ledger);
    // the PrincipalRefusal envelope (vivim-chat, D-379), field for field
    const env = led.envelope!;
    expect(env.refused).toBe(true);
    expect(env.error).toBe("REFUSED");
    expect(env.op).toBe("chat.history@1");
    expect(typeof env.detail).toBe("string");
    expect(env.detail.length).toBeGreaterThan(10);
    expect(env.ledgered).toBe(true);
    expect(env.ledgerRef).toEqual({ ns: "privacy", id: led.refusalRow!.id, rev: 1 });
    // the generalized refusal_* family: the row kind + id family read identically
    expect(led.refusalRow!.kind).toBe("privacy.refusal@1");
    expect(led.refusalRow!.id.startsWith("refusal:")).toBe(true);
    // the pilot's invariant holds under the general law: the owner reads fine
    const own = fenceCheck({ ns: "chat", id: "conv:ada-1", owner: "user:ada", reader: "user:ada", op: "chat.history@1" }, map, undefined, NOW);
    expect(own.verdict).toBe("allow");
  });
});

describe("F-APERTURE-PRIVACY.6 (headless)", () => {
  test("the module imports no surface dependency, never touches window/document/navigator, and the ops answer daemon-only", async () => {
    for (const f of ["apertureprivacy.ts"] as const) {
      const src = readFileSync(join(import.meta.dir, "..", "..", "..", "plugins", "vivim-law", "src", f), "utf-8");
      expect(/from\s+"@vivim\/(omega-)?(surfaces|canvas|web|daemon-client)/.test(src)).toBe(false);
      expect(/\b(document|window|navigator)\s*\./.test(src)).toBe(false);
    }
    // the lattice is inspectable data, not hidden behavior
    expect(PRIVACY_CLASSES).toEqual(["open", "internal", "principal", "secret"]);
    expect(CLASS_LATTICE.open).toBeLessThan(CLASS_LATTICE.internal);
    expect(CLASS_LATTICE.internal).toBeLessThan(CLASS_LATTICE.principal);
    expect(CLASS_LATTICE.principal).toBeLessThan(CLASS_LATTICE.secret);
    // the ops answer daemon-only (ctx null — no surface, no host) — 1-5 ran exactly so
    const r = (await def.ops!["privacy.taint@1"]!({ cites: [{ ns: "email", id: "m", class: "principal" }] }, null, META)) as { taint: PrivacyClass };
    expect(r.taint).toBe("principal");
  });
});

describe("F-APERTURE-PRIVACY.7 (loud-failure)", () => {
  test("zero silent degradation: malformed rows refuse at the door, taint findings are ledgered never auto-fixed, and an export carrying secrets refuses APERTURE_EXPORT_WITH_SECRETS", () => {
    // malformed class rows refuse AT THE DOOR with the named error
    expect(() => validateClassRow({ ns: "x", class: "magenta" })).toThrow(/APERTURE_CLASS_ROW_INVALID/);
    expect(() => validateClassRow({ ns: "", class: "open" })).toThrow(/APERTURE_CLASS_ROW_INVALID/);
    expect(() => validateClassRow({ ns: "x", class: "open", id: "hand-authored" })).toThrow(/APERTURE_CLASS_ROW_INVALID/);
    // a governed namespace re-declares only through amendment (the append-only discipline)
    const store = new PrivacyClassStore();
    store.append({ id: "class:email", ns: "email", class: "principal", at: 1 });
    expect(() => store.append({ id: "class:email", ns: "email", class: "open", at: 2 })).toThrow(new RegExp(APERTURE_CLASS_DUPLICATE));
    store.append({ id: "class:email", ns: "email", class: "secret", at: 3, supersedes: "class:email" });
    expect(store.classMap().get("email")).toBe("secret");
    // taint findings are ledgered DATA, never auto-fixed: the audit reports, it never mutates
    const map = mapOf(["email", "principal"], ["notes", "open"]);
    const finding = auditTaint([{ ns: "notes", id: "dirty:1", class: "open", cites: [{ ns: "email", id: "msg:1", class: "principal" }] }], map);
    expect(finding.findings).toHaveLength(1);
    expect(finding.findings[0]!.code).toBe(APERTURE_DERIVED_LEAK);
    expect(finding.checked).toBe(1);
    // an export carrying secrets refuses; principal crosses only under treaty
    const withSecret = exportGate([{ ns: "keys", id: "k1", class: "secret" }], map);
    expect(withSecret.verdict).toBe("refused");
    expect(withSecret.code).toBe(APERTURE_EXPORT_WITH_SECRETS);
    expect(withSecret.refused).toEqual(["keys/k1"]);
    const principalNoTreaty = exportGate([{ ns: "email", id: "m1" }], map);
    expect(principalNoTreaty.verdict).toBe("refused");
    const underTreaty = exportGate([{ ns: "email", id: "m1" }], map, "treaty:omega-15");
    expect(underTreaty.verdict).toBe("allow");
    // no warn-and-continue: the pure core contains no empty catch branch
    const src = readFileSync(join(import.meta.dir, "..", "..", "..", "plugins", "vivim-law", "src", "apertureprivacy.ts"), "utf-8");
    expect(/catch\s*(\([^)]*\))?\s*\{\s*\}/.test(src)).toBe(false);
    expect(/catch\s*(\([^)]*\))?\s*\{\s*\/\*/.test(src)).toBe(false);
  });
});
