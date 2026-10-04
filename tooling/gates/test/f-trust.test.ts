// tooling/gates/test/f-trust.test.ts — the F-TRUST falsifier (D-444, Ω-4).
// Generated as a RED stub by `omega:loop --stub D-444`, then implemented.
//  F-TRUST.1 non-reuse — register → retire → re-register refuses PRINCIPAL_REUSED (the D-412 F-1 inherited at the trust seat)
//  F-TRUST.2 consent-binding-and-revocation — a grant resolves through the principal record; revoke; the next gated use with the stale generation refuses TRUST_CONSENT_STALE naming the consent id
//  F-TRUST.3 rotation-non-event — 10,000 rows signed under key A → ceremony → key B active → all 10,000 rows still verify mint-time; zero row hashes changed
//  F-TRUST.4 the-local-pairing — two principals pair with zero network authority (the ceremony's only I/O is the rows both sign); a one-signature pairing refuses TRUST_PAIRING_UNWITNESSED
//  F-TRUST.5 refusal-proves — every register code fired by a planted violation; the Ω-4X codes stay proven by F-TRUST-ROTATE and are cited, not re-run
//  F-TRUST.6 headless — 1–5 daemon-only; the lineage renders identically on every surface
//  F-TRUST.7 loud-failure — no soft-pass branch anywhere in verification — unclear is a named refusal
import { describe, test, expect } from "bun:test";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import {
  TrustRegistry, consentIdFor, grantConsent, renderKey, revokeKey, signWith, trustDigest,
  PRINCIPAL_REUSED, TRUST_CONSENT_STALE, TRUST_DUPLICATE_BIND, TRUST_FINGERPRINT_MISMATCH, TRUST_KEY_EXPIRED, TRUST_KEY_UNBOUND, TRUST_PAIRING_UNWITNESSED, TRUST_PRINCIPAL_UNRESOLVABLE, TRUST_SIGNATURE_INVALID,
  type KeyRow,
} from "../../../plugins/vivim-run/src/trust.ts";

describe("F-TRUST.1 (non-reuse)", () => {
  test("register → retire → re-register refuses PRINCIPAL_REUSED (the D-412 F-1 inherited at the trust seat)", () => {
    const reg = new TrustRegistry();
    expect(reg.registerPrincipal({ principal: "user:alice", at: 1000 }).ok).toBe(true);
    expect(reg.retirePrincipal("user:alice", 2000).ok).toBe(true);
    const again = reg.registerPrincipal({ principal: "user:alice", at: 3000 });
    expect(again.ok).toBe(false);
    if (!again.ok) {
      expect(again.code).toBe(PRINCIPAL_REUSED);
      expect(again.sentence).toContain("retired is FOREVER");
    }
    // a fresh principal registers clean; re-register while active is idempotent (D-412's own law)
    expect(reg.registerPrincipal({ principal: "user:bob", at: 1000 }).ok).toBe(true);
    const idem = reg.registerPrincipal({ principal: "user:bob", at: 1100 });
    expect(idem.ok).toBe(true);
    if (idem.ok) expect(idem.idempotent).toBe(true);
    // the retired record cannot vouch for a key either — the floor holds at the bind door
    const bind = reg.bind({ keyId: "k-alice", principal: "user:alice", notBefore: 1000, fingerprint: "sha256:aa", at: 3000 });
    expect(bind.ok).toBe(false);
    if (!bind.ok) expect(bind.code).toBe(TRUST_PRINCIPAL_UNRESOLVABLE);
  });
});

describe("F-TRUST.2 (consent-binding-and-revocation)", () => {
  test("a grant resolves through the principal record; revoke; the next gated use with the stale generation refuses TRUST_CONSENT_STALE naming the consent id", () => {
    const reg = new TrustRegistry();
    expect(reg.registerPrincipal({ principal: "user:carol", at: 1000 }).ok).toBe(true);
    // the grant resolves through the record — and its id is the stable hash a refusal can name
    const grant = reg.grantConsent({ principal: "user:carol", op: "vault.export@1", at: 1500 });
    expect(grant.ok).toBe(true);
    const id = consentIdFor("user:carol", "vault.export@1");
    expect(grant.ok && grant.row.consentId).toBe(id);
    // the gated use holds at generation 1
    expect(reg.consentHolds(id, 1).ok).toBe(true);
    // revoke: the generation bumps
    const revoked = reg.revokeConsent(id, 2000);
    expect(revoked?.active).toBe(false);
    expect(revoked?.generation).toBe(2);
    // the next gated use with the STALE generation refuses, naming the consent id
    const stale = reg.consentHolds(id, 1);
    expect(stale.ok).toBe(false);
    if (!stale.ok) {
      expect(stale.code).toBe(TRUST_CONSENT_STALE);
      expect(stale.sentence).toContain(id);
      expect(stale.sentence).toContain("generation 1");
      expect(stale.sentence).toContain("stands at 2");
    }
    // a grant for an unregistered principal refuses through the record
    const ghost = grantConsent({ principal: "user:ghost", op: "vault.export@1", at: 1500 }, reg.principals);
    expect(ghost.ok).toBe(false);
    if (!ghost.ok) expect(ghost.code).toBe(TRUST_PRINCIPAL_UNRESOLVABLE);
  });
});

describe("F-TRUST.3 (rotation-non-event)", () => {
  test("10,000 rows signed under key A → ceremony → key B active → all 10,000 rows still verify mint-time; zero row hashes changed", () => {
    const reg = new TrustRegistry();
    expect(reg.registerPrincipal({ principal: "device:primary", at: 0 }).ok).toBe(true);
    expect(reg.bind({ keyId: "key-A", principal: "device:primary", notBefore: 1000, fingerprint: "sha256:aaa", at: 1000 }).ok).toBe(true);
    const keyA = reg.keys.get("key-A")!;
    // 10,000 signature rows under key A, each inside A's era
    const payloads = Array.from({ length: 10_000 }, (_, i) => ({ row: i, note: "history" }));
    const sigs = payloads.map((p, i) => signWith(keyA, p, 1100 + i));
    const hashesBefore = sigs.map((s) => `${s.keyId}:${s.signedAt}:${s.signature}`).join("\n");
    const digestsBefore = sigs.map((s) => trustDigest(s)).join("\n");
    // the ceremony: bind key B, retire A at the seam naming its successor
    expect(reg.bind({ keyId: "key-B", principal: "device:primary", notBefore: 20_000, fingerprint: "sha256:bbb", at: 20_000 }).ok).toBe(true);
    const retired = reg.retire("key-A", 20_000, "key-B", 20_000);
    expect(retired?.state).toBe("retired");
    expect(retired?.successorKeyRef).toBe("key-B");
    expect(reg.keys.get("key-B")!.state).toBe("active");
    // all 10,000 rows still verify mint-time — judged under key A, the law of their signing time
    for (let i = 0; i < sigs.length; i++) {
      const v = reg.verify({ ...sigs[i]!, payload: payloads[i]! });
      if (!v.ok) throw new Error(`row ${i} failed the rotation non-event: ${v.sentence}`);
      expect(v.key.keyId).toBe("key-A");
    }
    expect(sigs.length).toBe(10_000);
    // zero row hashes changed
    expect(sigs.map((s) => `${s.keyId}:${s.signedAt}:${s.signature}`).join("\n")).toBe(hashesBefore);
    expect(sigs.map((s) => trustDigest(s)).join("\n")).toBe(digestsBefore);
    // the successor signs the future; A's material past A's era is refused
    const keyB = reg.keys.get("key-B")!;
    const fresh = signWith(keyB, { row: "new" }, 21_000);
    expect(reg.verify({ ...fresh, payload: { row: "new" } }).ok).toBe(true);
    const stale = signWith(keyA, { row: "forged" }, 21_000);
    const vStale = reg.verify({ ...stale, payload: { row: "forged" } });
    expect(vStale.ok).toBe(false);
    if (!vStale.ok) expect(vStale.code).toBe(TRUST_SIGNATURE_INVALID);
  });
});

describe("F-TRUST.4 (the-local-pairing)", () => {
  test("two principals pair with zero network authority (the ceremony's only I/O is the rows both sign); a one-signature pairing refuses TRUST_PAIRING_UNWITNESSED", () => {
    const reg = new TrustRegistry();
    expect(reg.registerPrincipal({ principal: "device:laptop", at: 1000 }).ok).toBe(true);
    expect(reg.registerPrincipal({ principal: "device:phone", at: 1000 }).ok).toBe(true);
    // one-signature pairing: refused — one device vouching for itself
    const solo = reg.pair({ pairId: "pair-1", a: "device:laptop", b: "device:phone", witnesses: ["device:laptop"], ceremony: "PAKE-local", at: 2000 });
    expect(solo.ok).toBe(false);
    if (!solo.ok) {
      expect(solo.code).toBe(TRUST_PAIRING_UNWITNESSED);
      expect(solo.sentence).toContain("one device vouching for itself");
    }
    expect(reg.pairs.size).toBe(0); // nothing landed
    // both witness: the pairing lands — zero network authority, rows only
    const both = reg.pair({ pairId: "pair-1", a: "device:laptop", b: "device:phone", witnesses: ["device:laptop", "device:phone"], ceremony: "PAKE-local", at: 2000 });
    expect(both.ok).toBe(true);
    if (both.ok) {
      expect(both.row.principals).toEqual(["device:laptop", "device:phone"]);
      expect(both.row.evidenceRefs).toEqual(["device:laptop", "device:phone"]);
    }
    // duplicate pairId: refused, named
    const dup = reg.pair({ pairId: "pair-1", a: "device:laptop", b: "device:phone", witnesses: ["device:laptop", "device:phone"], ceremony: "QR", at: 2100 });
    expect(dup.ok).toBe(false);
    if (!dup.ok) expect(dup.code).toBe(TRUST_DUPLICATE_BIND);
    // zero network authority is structural: the pure core has no network imports at all
    const src = readFileSync(join(import.meta.dir, "..", "..", "..", "plugins", "vivim-run", "src", "trust.ts"), "utf-8");
    expect(/from\s+"(node:)?(net|http|https|dgram|dns|tls)/.test(src)).toBe(false);
  });
});

describe("F-TRUST.5 (refusal-proves)", () => {
  test("every register code fired by a planted violation; the Ω-4X codes stay proven by F-TRUST-ROTATE and are cited, not re-run", () => {
    const reg = new TrustRegistry();
    expect(reg.registerPrincipal({ principal: "user:dave", at: 1000 }).ok).toBe(true);
    expect(reg.bind({ keyId: "k1", principal: "user:dave", notBefore: 1000, notAfter: 5000, fingerprint: "sha256:ff", expectedFingerprint: "sha256:ff", at: 1000 }).ok).toBe(true);
    const fired = new Set<string>();
    const refuse = (out: { ok: boolean; code?: string }): string => {
      expect(out.ok).toBe(false);
      return out.code ?? "(none)";
    };
    // TRUST_PRINCIPAL_UNRESOLVABLE — the principal row is absent
    fired.add(refuse(reg.bind({ keyId: "k2", principal: "user:ghost", notBefore: 1000, fingerprint: "sha256:x", at: 1000 })));
    // TRUST_KEY_EXPIRED — binding past the key's own notAfter
    fired.add(refuse(reg.bind({ keyId: "k3", principal: "user:dave", notBefore: 1000, notAfter: 2000, fingerprint: "sha256:x", at: 3000 })));
    // TRUST_FINGERPRINT_MISMATCH — the ceremony's attestation disagrees
    fired.add(refuse(reg.bind({ keyId: "k4", principal: "user:dave", notBefore: 1000, fingerprint: "sha256:x", expectedFingerprint: "sha256:y", at: 1000 })));
    // TRUST_DUPLICATE_BIND — the id is already bound
    fired.add(refuse(reg.bind({ keyId: "k1", principal: "user:dave", notBefore: 1000, fingerprint: "sha256:x", at: 1000 })));
    // TRUST_CONSENT_STALE — the stale generation (F-TRUST.2's law, fired here for the register proof)
    const g = reg.grantConsent({ principal: "user:dave", op: "op:x@1", at: 1200 });
    expect(g.ok).toBe(true);
    reg.revokeConsent(consentIdFor("user:dave", "op:x@1"), 1300);
    fired.add(refuse(reg.consentHolds(consentIdFor("user:dave", "op:x@1"), 1)));
    // TRUST_PAIRING_UNWITNESSED — the one-signature pairing (F-TRUST.4's law, fired here for the register proof)
    expect(reg.registerPrincipal({ principal: "device:x", at: 1000 }).ok).toBe(true);
    fired.add(refuse(reg.pair({ pairId: "p1", a: "user:dave", b: "device:x", witnesses: ["user:dave"], ceremony: "QR", at: 1400 })));
    // TRUST_KEY_UNBOUND — the signature cites a key no lineage binds
    fired.add(refuse(reg.verify({ keyId: "ghost-key", signedAt: 1500, signature: "sig:deadbeef", payload: null })));
    // TRUST_SIGNATURE_INVALID — the signature does not verify under the mint-time key
    const key1 = reg.keys.get("k1")!;
    const good = signWith(key1, { a: 1 }, 2000);
    fired.add(refuse(reg.verify({ ...good, signature: "sig:forged", payload: { a: 1 } })));
    // TRUST_KEY_EXPIRED at the verify door — mint time past the key's era, no successor
    const late = signWith(key1, { a: 2 }, 6000);
    const vLate = reg.verify({ ...late, payload: { a: 2 } });
    expect(vLate.ok).toBe(false);
    fired.add(vLate.ok ? "(none)" : vLate.code);
    // PRINCIPAL_REUSED — D-412's own code, inherited with the floor
    expect(reg.registerPrincipal({ principal: "user:retired", at: 1000 }).ok).toBe(true);
    expect(reg.retirePrincipal("user:retired", 1100).ok).toBe(true);
    fired.add(refuse(reg.registerPrincipal({ principal: "user:retired", at: 1200 })));
    // the register is exactly the record's
    expect(fired).toEqual(new Set([
      TRUST_PRINCIPAL_UNRESOLVABLE, TRUST_KEY_EXPIRED, TRUST_FINGERPRINT_MISMATCH, TRUST_DUPLICATE_BIND,
      TRUST_CONSENT_STALE, TRUST_PAIRING_UNWITNESSED, TRUST_KEY_UNBOUND, TRUST_SIGNATURE_INVALID, PRINCIPAL_REUSED,
    ]));
    // the Ω-4X codes stay proven by F-TRUST-ROTATE and are cited, not re-run (spec §8.5)
    const record = readFileSync(join(import.meta.dir, "..", "..", "..", "docs", "decisions", "D-444-trust-substrate.md"), "utf-8");
    expect(record.includes("TRUST_KEY_LINEAGE_GAP")).toBe(true);
    expect(record.includes("F-TRUST-ROTATE")).toBe(true);
  });
});

describe("F-TRUST.6 (headless)", () => {
  test("1–5 daemon-only; the lineage renders identically on every surface", () => {
    const src = readFileSync(join(import.meta.dir, "..", "..", "..", "plugins", "vivim-run", "src", "trust.ts"), "utf-8");
    expect(/from\s+"@vivim\/(omega-)?(surfaces\/|canvas|web|daemon-client)/.test(src)).toBe(false);
    expect(/\b(document|window|navigator)\s*\./.test(src)).toBe(false);
    // one fold renders: the same row is byte-identical on every surface
    const row: KeyRow = { keyId: "k", principal: "user:x", era: { notBefore: 1 }, fingerprint: "sha256:ff", state: "active", boundAt: 1 };
    const clone: KeyRow = { ...row, era: { ...row.era } };
    expect(renderKey(row)).toBe(renderKey(clone));
    expect(renderKey(row)).toContain("key k of user:x");
    expect(renderKey(row)).toContain("era 1..∞");
    // the scar renders too — the mesh says what happened
    const scarred = revokeKey(row, "REVOKED_KEY_ERA", 99);
    expect(renderKey(scarred)).toContain("REVOKED_KEY_ERA");
    expect(renderKey(scarred)).toContain("nothing deleted");
  });
});

describe("F-TRUST.7 (loud-failure)", () => {
  test("no soft-pass branch anywhere in verification — unclear is a named refusal", () => {
    const reg = new TrustRegistry();
    expect(reg.registerPrincipal({ principal: "user:eve", at: 1000 }).ok).toBe(true);
    expect(reg.bind({ keyId: "kx", principal: "user:eve", notBefore: 1000, fingerprint: "sha256:ee", at: 1000 }).ok).toBe(true);
    const key = reg.keys.get("kx")!;
    const good = signWith(key, { x: 1 }, 2000);
    // every unclear input is a NAMED refusal — never undefined, never null, never a silent pass
    const cases = [
      reg.verify({ keyId: "nope", signedAt: 2000, signature: good.signature, payload: { x: 1 } }), // unbound
      reg.verify({ keyId: "kx", signedAt: 999, signature: good.signature, payload: { x: 1 } }),    // predates the key
      reg.verify({ keyId: "kx", signedAt: 2000, signature: "sig:wrong", payload: { x: 1 } }),      // invalid
      reg.verify({ keyId: "kx", signedAt: 2000, signature: good.signature, payload: { x: 2 } }),   // payload tampered
    ];
    for (const c of cases) {
      expect(c.ok).toBe(false);
      if (!c.ok) {
        expect(c.code.length).toBeGreaterThan(0);
        expect(c.sentence.length).toBeGreaterThan(20);
      }
    }
    // revocation scars forward: the suspect-window signature verifies under its own law, scarred and loud
    const revoked = reg.revoke("kx", "REVOKED_KEY_ERA", 3000);
    expect(revoked?.state).toBe("revoked");
    expect(reg.keys.get("kx")).toBeDefined(); // nothing deleted
    const before = signWith(key, { x: 1 }, 2000);
    const scarred = reg.verify({ ...before, payload: { x: 1 } });
    expect(scarred.ok).toBe(true);
    if (scarred.ok) {
      expect(scarred.scar).toBe("REVOKED_KEY_ERA");
      expect(scarred.detail).toContain("nothing deleted");
    }
    // the revoked key's next write is a named refusal (§19's owed falsifier)
    const after = signWith(key, { x: 3 }, 4000);
    const refused = reg.verify({ ...after, payload: { x: 3 } });
    expect(refused.ok).toBe(false);
    if (!refused.ok) {
      expect(refused.code).toBe(TRUST_SIGNATURE_INVALID);
      expect(refused.sentence).toContain("revoked");
    }
    // zero silent catches in the source
    const src = readFileSync(join(import.meta.dir, "..", "..", "..", "plugins", "vivim-run", "src", "trust.ts"), "utf-8");
    expect(/catch\s*(\([^)]*\))?\s*\{\s*\}/.test(src)).toBe(false);
  });
});
