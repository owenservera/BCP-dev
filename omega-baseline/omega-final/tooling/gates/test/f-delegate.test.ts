// tooling/gates/test/f-delegate.test.ts — the F-DELEGATE falsifier (D-454, Ω-15).
// Generated as a RED stub by `omega:loop --stub D-454`, then implemented.
//  F-DELEGATE.1 the-narrowing-proof — a three-hop chain whose hop three names a superset → DELEGATE_ATTENUATION_VIOLATED naming both grammars; with a subset → the fold's authorityChain digest is stable and citable
//  F-DELEGATE.2 the-cascade — revoke hop two → the whole descendant subtree appends revoked rows in one sweep (zero live descendants); a descendant's next fold refuses DELEGATE_REVOKED_CASCADE citing the revocation row
//  F-DELEGATE.3 the-lapsed-subtree — expire the root (clock-pinned) → the whole chain refuses DELEGATE_EXPIRED; renewal is a fresh chain citing the old (visible genealogy)
//  F-DELEGATE.4 the-unverified-envelope — tamper the carried authority → DELEGATE_ENVELOPE_UNVERIFIED (the vault recomputation wins); a dangling parent row → DELEGATE_CHAIN_BROKEN
//  F-DELEGATE.5 the-treaty-row — a two-principal crossing with one signature → DELEGATE_TREATY_UNSIGNED; both signatures + both mirrors validate; expiry fires exactly on schedule
//  F-DELEGATE.6 headless — 1–5 daemon/CLI-only, zero pixels; the fold renders text
//  F-DELEGATE.7 loud-failure — zero cached authority; every broken, widened, lapsed, too-deep, or unsigned edge is a named refusal with a sentence
import { describe, test, expect } from "bun:test";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import {
  authorityChainDigest, chainRowId, DEFAULT_DEPTH_BUDGET, foldChain, parseChainRow,
  planRevocation, renderChain, validateTreatyRow,
  DELEGATE_ATTENUATION_VIOLATED, DELEGATE_CHAIN_BROKEN, DELEGATE_CHAIN_TOO_DEEP,
  DELEGATE_ENVELOPE_UNVERIFIED, DELEGATE_EXPIRED, DELEGATE_REVOKED_CASCADE,
  DELEGATE_TREATY_UNSIGNED,
  type DelegationChainRow, type DelegationStatus, type TreatyRow,
} from "../../../plugins/vivim-agent/src/delegation.ts";

const NOW = 1_000_000;
const FAR = NOW + 10_000_000; // every live hop expires far in the future

const hop = (
  delegationId: string, parent: string | null, grantee: string, attenuatedScope: string,
  expiresAt = FAR, status: DelegationStatus = "live",
): DelegationChainRow => ({ delegationId, parent, grantee, attenuatedScope, expiresAt, status });

/** A lawful three-hop chain: vault ⊃ vault.append:ns=email ⊃ …:box=inbox. */
const narrowChain = (): DelegationChainRow[] => [
  hop("root", null, "agent_root", "vault"),
  hop("h1", "root", "agent_1", "vault.append:ns=email"),
  hop("h2", "h1", "agent_2", "vault.append:ns=email:box=inbox"),
];

/** A widening chain: hop three names a SUPERSET of its parent's grant. */
const wideningChain = (): DelegationChainRow[] => [
  hop("root", null, "agent_root", "vault"),
  hop("h1", "root", "agent_1", "vault.append:ns=email"),
  hop("h2", "h1", "agent_2", "vault.append"), // drops ns=email → wider than h1
];

describe("F-DELEGATE (D-454)", () => {
  test("F-DELEGATE.1 (the-narrowing-proof)", () => {
    // hop three names a superset → the mechanical per-edge subset check refuses, naming BOTH grammars
    const wide = foldChain({ rows: wideningChain(), leafDelegationId: "h2", now: NOW });
    expect(wide.ok).toBe(false);
    if (!wide.ok) {
      expect(wide.code).toBe(DELEGATE_ATTENUATION_VIOLATED);
      expect(wide.sentence).toContain("vault.append"); // the child's grammar, named
      expect(wide.sentence).toContain("vault.append:ns=email"); // the parent's grammar, named
      expect(wide.sentence).toContain("escape");
    }
    // with a subset → the fold resolves and the digest is stable and citable
    const a = foldChain({ rows: narrowChain(), leafDelegationId: "h2", now: NOW });
    const b = foldChain({ rows: [...narrowChain()].reverse(), leafDelegationId: "h2", now: NOW }); // row order in the snapshot is irrelevant
    expect(a.ok).toBe(true);
    if (a.ok && b.ok) {
      expect(a.value.depth).toBe(3);
      expect(a.value.effectiveScope).toBe("vault.append:box=inbox:ns=email"); // the narrowest, recomputed from rows (canonical spelling)
      expect(a.value.authorityChain).toBe(b.value.authorityChain); // stable across replays
      expect(a.value.authorityChain).toMatch(/^[0-9a-f]{64}$/); // a citable digest
      expect(a.value.authorityChain).toBe(authorityChainDigest(a.value.hops)); // derived, never stored vibes
      // a different chain is a different digest (the digest means something)
      const other = foldChain({ rows: narrowChain().map((r) => r.delegationId === "h2" ? hop("h2", "h1", "agent_9", "vault.append:ns=email:box=archive") : r), leafDelegationId: "h2", now: NOW });
      expect(other.ok).toBe(true);
      if (other.ok) expect(other.value.authorityChain).not.toBe(a.value.authorityChain);
    }
  });

  test("F-DELEGATE.2 (the-cascade)", () => {
    // root → h1 → {h2 → h3, h2b}: revoking h1 must sweep the WHOLE subtree
    const rows = [
      hop("root", null, "agent_root", "vault"),
      hop("h1", "root", "agent_1", "vault.append:ns=email"),
      hop("h2", "h1", "agent_2", "vault.append:ns=email:box=inbox"),
      hop("h3", "h2", "agent_3", "vault.append:ns=email:box=inbox:flags=seen"),
      hop("h2b", "h1", "agent_4", "vault.append:ns=email:box=drafts"),
    ];
    const plan = planRevocation(rows, "h1", NOW);
    expect(plan.ok).toBe(true);
    if (!plan.ok) return;
    expect(plan.value.revokedThrough).toBe("h1");
    const cascaded = plan.value.cascade.map((e) => e.delegationId).sort();
    expect(cascaded).toEqual(["h1", "h2", "h2b", "h3"]); // the whole descendant subtree, one sweep
    for (const e of plan.value.cascade) {
      expect(e.row.status).toBe("revoked");
      expect(e.row.revokedAt).toBe(NOW);
      expect(e.row.revokedThrough).toBe("h1");
    }
    // apply the cascade (the vault appends; here the rows land) → zero live descendants
    const after = [...rows.filter((r) => !cascaded.includes(r.delegationId)), ...plan.value.cascade.map((e) => e.row)];
    const liveInSubtree = after.filter((r) => cascaded.includes(r.delegationId) && r.status === "live");
    expect(liveInSubtree).toEqual([]); // zero live descendants
    // a descendant's NEXT fold refuses, citing the revocation row (gate-time pull — no cached authority)
    const fold = foldChain({ rows: after, leafDelegationId: "h3", now: NOW });
    expect(fold.ok).toBe(false);
    if (!fold.ok) {
      expect(fold.code).toBe(DELEGATE_REVOKED_CASCADE);
      expect(fold.sentence).toContain(chainRowId("h1")); // cites the revocation row
    }
    // the cascade is surgical: the revoked hop's own ancestors stay live
    const root = foldChain({ rows: after, leafDelegationId: "root", now: NOW });
    expect(root.ok).toBe(true);
  });

  test("F-DELEGATE.3 (the-lapsed-subtree)", () => {
    // the root's expiry lapsed (clock-pinned) → the whole chain refuses
    const lapsed = narrowChain().map((r) => r.delegationId === "root" ? hop("root", null, "agent_root", "vault", NOW - 1) : r);
    const fold = foldChain({ rows: lapsed, leafDelegationId: "h2", now: NOW });
    expect(fold.ok).toBe(false);
    if (!fold.ok) {
      expect(fold.code).toBe(DELEGATE_EXPIRED);
      expect(fold.sentence).toContain("root"); // the lapsed hop is named
      expect(fold.sentence).toContain("fresh chain"); // renewal is a fresh chain, not a stretch
    }
    // a recorded lapsed status fires the same refusal even before the clock says so
    const recorded = narrowChain().map((r) => r.delegationId === "h1" ? hop("h1", "root", "agent_1", "vault.append:ns=email", FAR, "lapsed") : r);
    const rec = foldChain({ rows: recorded, leafDelegationId: "h2", now: NOW });
    expect(rec.ok).toBe(false);
    if (!rec.ok) expect(rec.code).toBe(DELEGATE_EXPIRED);
    // renewal: a fresh root citing the old one (visible genealogy) — the new chain lives
    const renewedRoot = { ...hop("root-r2", null, "agent_root", "vault"), renews: "root" };
    const renewed = [
      ...narrowChain(), // the old chain stays in the vault — history is never deleted
      renewedRoot,
      hop("h1-r2", "root-r2", "agent_1b", "vault.append:ns=email"),
    ];
    const fresh = foldChain({ rows: renewed, leafDelegationId: "h1-r2", now: NOW });
    expect(fresh.ok).toBe(true);
    expect(parseChainRow(renewedRoot)?.renews).toBe("root"); // the genealogy is the row's own, never re-typed away
    // and the OLD chain still refuses — renewal never stretched it
    const old = foldChain({ rows: renewed, leafDelegationId: "h2", now: NOW });
    expect(old.ok).toBe(true); // the old chain's rows are all live in this fixture (expiry was the other branch)…
    const oldLapsed = foldChain({ rows: [...renewed, ...lapsed], leafDelegationId: "h2", now: NOW });
    expect(oldLapsed.ok).toBe(false);
    if (!oldLapsed.ok) expect(oldLapsed.code).toBe(DELEGATE_EXPIRED);
  });

  test("F-DELEGATE.4 (the-unverified-envelope)", () => {
    // tamper the envelope's authority string → the fold refuses; the vault recomputation wins
    const tampered = foldChain({ rows: narrowChain(), leafDelegationId: "h2", now: NOW, carriedAuthority: "vault.append" });
    expect(tampered.ok).toBe(false);
    if (!tampered.ok) {
      expect(tampered.code).toBe(DELEGATE_ENVELOPE_UNVERIFIED);
      expect(tampered.sentence).toContain("hints that lie are refused");
    }
    // the honest claim verifies
    const honest = foldChain({ rows: narrowChain(), leafDelegationId: "h2", now: NOW, carriedAuthority: "vault.append:ns=email:box=inbox" });
    expect(honest.ok).toBe(true);
    // canonical spelling does not matter — the grammar does
    const reordered = foldChain({ rows: narrowChain(), leafDelegationId: "h2", now: NOW, carriedAuthority: "vault.append:box=inbox:ns=email" });
    expect(reordered.ok).toBe(true);
    // a dangling parent → the chain is broken, and a broken chain grants nothing
    const orphan = foldChain({ rows: [hop("h1", "ghost", "agent_1", "vault.append:ns=email")], leafDelegationId: "h1", now: NOW });
    expect(orphan.ok).toBe(false);
    if (!orphan.ok) expect(orphan.code).toBe(DELEGATE_CHAIN_BROKEN);
    // a missing leaf is the same disease
    const missing = foldChain({ rows: narrowChain(), leafDelegationId: "nope", now: NOW });
    expect(missing.ok).toBe(false);
    if (!missing.ok) expect(missing.code).toBe(DELEGATE_CHAIN_BROKEN);
  });

  test("F-DELEGATE.5 (the-treaty-row)", () => {
    const treaty = (over: Partial<TreatyRow> = {}): TreatyRow => ({
      treatyId: "tr-email-crossing",
      parties: ["sovereign:alpha", "sovereign:beta"],
      delegatedCapabilityGrammar: "vault.append:ns=email",
      scope: "vault.append:ns=email:box=inbox",
      expiresAt: NOW + 60_000,
      signatures: ["sovereign:alpha", "sovereign:beta"],
      mirroredLedgerRefs: ["ledger:alpha/ref-1", "ledger:beta/ref-1"],
      ...over,
    });
    // one signature → the crossing refuses
    const unsigned = validateTreatyRow(treaty({ signatures: ["sovereign:alpha"] }), NOW);
    expect(unsigned.ok).toBe(false);
    if (!unsigned.ok) {
      expect(unsigned.code).toBe(DELEGATE_TREATY_UNSIGNED);
      expect(unsigned.sentence).toContain("one-sided doors");
    }
    // one mirror → the same refusal
    const unmirrored = validateTreatyRow(treaty({ mirroredLedgerRefs: ["ledger:alpha/ref-1"] }), NOW);
    expect(unmirrored.ok).toBe(false);
    if (!unmirrored.ok) expect(unmirrored.code).toBe(DELEGATE_TREATY_UNSIGNED);
    // both signatures + both mirrors, within the grammar → the crossing validates
    expect(validateTreatyRow(treaty(), NOW).ok).toBe(true);
    // expiry fires EXACTLY on schedule (F11): at the boundary the treaty is dead, one tick before it lives
    expect(validateTreatyRow(treaty({ expiresAt: NOW }), NOW).ok).toBe(false);
    const onTick = validateTreatyRow(treaty({ expiresAt: NOW + 1 }), NOW);
    expect(onTick.ok).toBe(true);
    const dead = validateTreatyRow(treaty({ expiresAt: NOW }), NOW);
    if (!dead.ok) {
      expect(dead.code).toBe(DELEGATE_EXPIRED);
      expect(dead.sentence).toContain("exactly on schedule");
    }
    // a crossing scope outside the declared grammar is malformed — it throws, never passes
    expect(() => validateTreatyRow(treaty({ scope: "vault.append:ns=calendar" }), NOW)).toThrow();
  });

  test("F-DELEGATE.6 (headless)", () => {
    const src = readFileSync(join(import.meta.dir, "..", "..", "..", "plugins", "vivim-agent", "src", "delegation.ts"), "utf-8");
    expect(/from\s+"@vivim\/(omega-)?(surfaces\/|canvas|web|daemon-client)/.test(src)).toBe(false); // no surface imports
    expect(/\b(?:const|let|var)\s+(?:window|document|navigator)\b/.test(src)).toBe(false); // no DOM globals as variables
    // the fold renders text — the chain as headless rows, root first
    const fold = foldChain({ rows: narrowChain(), leafDelegationId: "h2", now: NOW });
    expect(fold.ok).toBe(true);
    if (fold.ok) {
      const text = renderChain(fold.value);
      expect(text).toContain("delegate.chain — 3 hop(s)");
      expect(text).toContain("root → agent_root @ vault");
      expect(text).toContain("h2 → agent_2 @ vault.append:ns=email:box=inbox");
      expect(text).toContain("authorityChain");
    }
  });

  test("F-DELEGATE.7 (loud-failure)", () => {
    const src = readFileSync(join(import.meta.dir, "..", "..", "..", "plugins", "vivim-agent", "src", "delegation.ts"), "utf-8");
    for (const code of [
      DELEGATE_ATTENUATION_VIOLATED, DELEGATE_REVOKED_CASCADE, DELEGATE_CHAIN_BROKEN,
      DELEGATE_EXPIRED, DELEGATE_ENVELOPE_UNVERIFIED, DELEGATE_TREATY_UNSIGNED, DELEGATE_CHAIN_TOO_DEEP,
    ]) {
      expect(src.includes(code)).toBe(true); // every register code is real, in-source
    }
    expect(/catch\s*(\([^)]*\))?\s*\{\s*\}/.test(src)).toBe(false); // no silent swallows
    // the depth budget: a declared policy row, amendable — never a vibes constant
    const deep: DelegationChainRow[] = [hop("r0", null, "a0", "vault")];
    for (let i = 1; i <= 5; i++) deep.push(hop(`r${i}`, `r${i - 1}`, `a${i}`, "vault.append:ns=email"));
    expect(deep.length).toBe(6);
    const tooDeep = foldChain({ rows: deep, leafDelegationId: "r5", now: NOW });
    expect(tooDeep.ok).toBe(false);
    if (!tooDeep.ok) {
      expect(tooDeep.code).toBe(DELEGATE_CHAIN_TOO_DEEP);
      expect(tooDeep.sentence).toContain(String(DEFAULT_DEPTH_BUDGET)); // the declared default, named
    }
    const amended = foldChain({ rows: deep, leafDelegationId: "r5", now: NOW, depthBudget: 6 }); // the amended policy row
    expect(amended.ok).toBe(true);
    // a row without expiresAt is not a chain row → a NAMED refusal, never a crash
    const malformed = foldChain({ rows: [{ delegationId: "x", parent: null, grantee: "g", attenuatedScope: "vault" }], leafDelegationId: "x", now: NOW });
    expect(malformed.ok).toBe(false);
    if (!malformed.ok) expect(malformed.code).toBe(DELEGATE_CHAIN_BROKEN);
    // the empty vault degrades honestly — loud, named, zero exceptions
    const empty = foldChain({ rows: [], leafDelegationId: "anything", now: NOW });
    expect(empty.ok).toBe(false);
    if (!empty.ok) expect(empty.code).toBe(DELEGATE_CHAIN_BROKEN);
    // revoking a ghost is loud too
    const ghost = planRevocation([], "ghost", NOW);
    expect(ghost.ok).toBe(false);
    if (!ghost.ok) expect(ghost.code).toBe(DELEGATE_CHAIN_BROKEN);
  });
});
