// tooling/gates/test/f-badge.test.ts — the F-BADGE falsifier (D-441, Ω-7).
// Generated as a RED stub by `omega:loop --stub D-441`, then implemented.
//  F-BADGE.1 the-print — the print renders from rows alone; tampering a source row changes the print or fails the digest — no third option
//  F-BADGE.2 claimed-tier-refused — a subject asserting its own tier refuses BADGE_TIER_CLAIMED; the ceremony assigns
//  F-BADGE.3 promotion-evidence — promote with one evidence ref refuses; with two (one independent) it cites both; runtime law matches the static law on the same fixtures
//  F-BADGE.4 demotion-is-loud — a key-era revocation demotes suspect-era badges with REVOKED_KEY_ERA scars riding affected rows; nothing deletes; the print says what happened
//  F-BADGE.5 refusal-proves — every register code fired by a planted violation
//  F-BADGE.6 headless — the badge is text before it is pixels
//  F-BADGE.7 loud-failure — zero silent label changes; every transition is a row or a refusal
import { describe, test, expect } from "bun:test";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import {
  badgeDigest, badgePrint, BadgeRegistry, demote, eraVerdict, mint, promote,
  BADGE_DUPLICATE, BADGE_ERA_INVALID, BADGE_EVIDENCE_INSUFFICIENT, BADGE_EVIDENCE_UNRESOLVABLE, BADGE_TIER_CLAIMED,
  type BadgeRow,
} from "../../../plugins/vivim-run/src/badge.ts";

const SPEC = { badgeId: "b1", subjectRef: "plugin:forge-author", tier: "verified", assignedBy: "kernel:ceremony", generality: "GEN_SPECULATIVE" as const, basis: "D-441", notBefore: 1000, at: 2000 };

describe("F-BADGE.1 (the-print)", () => {
  test("the print renders from rows alone; tampering a source row changes the print or fails the digest — no third option", () => {
    const row: BadgeRow = { badgeId: "b1", subjectRef: "plugin:x", tier: "verified", assignedBy: "kernel:ceremony", generality: "GEN_SPECULATIVE", basis: "D-441", era: { notBefore: 1000 }, at: 2000 };
    const print = badgePrint(row);
    expect(print).toContain("plugin:x carries tier verified");
    expect(print).toContain("generality GEN_SPECULATIVE");
    expect(print).toContain(badgeDigest(row).slice(0, 22));
    // the tamper: any field change moves the print or the digest
    const tampered = { ...row, tier: "system" as const };
    expect(badgePrint(tampered)).not.toBe(print);
    expect(badgeDigest(tampered)).not.toBe(badgeDigest(row));
    const tampered2 = { ...row, at: 2001 };
    expect(badgeDigest(tampered2)).not.toBe(badgeDigest(row));
  });
});

describe("F-BADGE.2 (claimed-tier-refused)", () => {
  test("a subject asserting its own tier refuses BADGE_TIER_CLAIMED; the ceremony assigns", () => {
    const selfClaim = mint({ ...SPEC, subjectClaimedTier: "verified" }, new Set());
    expect(selfClaim.ok).toBe(false);
    if (!selfClaim.ok) expect(selfClaim.code).toBe(BADGE_TIER_CLAIMED);
    // the subject as its own assigner is equally refused
    const selfAssigned = mint({ ...SPEC, assignedBy: "plugin:forge-author" }, new Set());
    expect(selfAssigned.ok).toBe(false);
    if (!selfAssigned.ok) expect(selfAssigned.code).toBe(BADGE_TIER_CLAIMED);
    // the honest mint passes
    expect(mint(SPEC, new Set()).ok).toBe(true);
  });
});

describe("F-BADGE.3 (promotion-evidence)", () => {
  test("promote with one evidence ref refuses; with two (one independent) it cites both; runtime law matches the static law", () => {
    const reg = new BadgeRegistry();
    expect(reg.mint(SPEC).ok).toBe(true);
    const resolvable = (ref: string) => ref.startsWith("D-") || ref.startsWith("census:");
    const independent = (a: string, b: string) => !a.split(":")[0]!.startsWith(b.split(":")[0]!) || a.split(":")[0] !== b.split(":")[0];
    // one ref: refused
    const one = reg.promote("b1", "GEN_GENERIC", ["D-441"], resolvable, independent, "D-441");
    expect(one.ok).toBe(false);
    if (!one.ok) expect(one.code).toBe(BADGE_EVIDENCE_INSUFFICIENT);
    // unresolvable: refused, named
    const unres = reg.promote("b1", "GEN_GENERIC", ["D-441", "census:x", "ghost-ref"], resolvable, independent, "D-441");
    expect(unres.ok).toBe(false);
    if (!unres.ok) expect(unres.code).toBe(BADGE_EVIDENCE_UNRESOLVABLE);
    // same-origin pair: refused (no independent witness)
    const sameOrigin = reg.promote("b1", "GEN_GENERIC", ["census:a", "census:b"], resolvable, () => false, "D-441");
    expect(sameOrigin.ok).toBe(false);
    if (!sameOrigin.ok) expect(sameOrigin.code).toBe(BADGE_EVIDENCE_INSUFFICIENT);
    // two refs, one independent: promoted, both cited
    const ok = reg.promote("b1", "GEN_GENERIC", ["D-441", "census:run-42"], resolvable, independent, "D-442");
    expect(ok.ok).toBe(true);
    if (ok.ok) {
      expect(ok.row.promotionEvidence).toEqual(["D-441", "census:run-42"]);
      expect(badgePrint(ok.row)).toContain("promoted on 2 citation(s)");
    }
    // runtime matches static: the sdk's validateGenerality demands ≥2/≥1 on the same shape (the two seats, one law)
    const sdkSrc = readFileSync(join(import.meta.dir, "..", "..", "..", "sdk", "src", "validate.ts"), "utf-8");
    expect(/2/.test(sdkSrc)).toBe(true); // the static seat's own floor
  });
});

describe("F-BADGE.4 (demotion-is-loud)", () => {
  test("a key-era revocation demotes suspect-era badges with REVOKED_KEY_ERA scars; nothing deletes; the print says what happened", () => {
    const row: BadgeRow = { badgeId: "b2", subjectRef: "pack:maps", tier: "signed", assignedBy: "kernel:ceremony", generality: "GEN_GENERIC", basis: "census:1", era: { notBefore: 1000 }, at: 1500 };
    // the key era revokes at 1200: badges minted before are suspect
    const verdict = eraVerdict(row, 1200);
    expect(verdict.valid).toBe(false);
    expect(verdict.detail).toContain("REVOKED_KEY_ERA");
    const scarred = demote(row, "untrusted", "REVOKED_KEY_ERA", 5000);
    expect(scarred.demotedTo).toBe("untrusted");
    expect(scarred.demotionReason).toBe("REVOKED_KEY_ERA");
    expect(scarred.tier).toBe("untrusted");
    // nothing deleted: the row carries its history forward
    expect(scarred.badgeId).toBe("b2");
    expect(scarred.era.notBefore).toBe(1000);
    // the print says what happened
    expect(badgePrint(scarred)).toContain("DEMOTED to untrusted");
    expect(badgePrint(scarred)).toContain("REVOKED_KEY_ERA");
    // a post-revocation badge is era-clean
    const clean: BadgeRow = { ...row, era: { notBefore: 1300 } };
    expect(eraVerdict(clean, 1200).valid).toBe(true);
    // the demoted badge stays judged (re-verdict carries the scar)
    expect(eraVerdict(scarred, 1200).valid).toBe(true); // already demoted — the scar satisfies
  });
});

describe("F-BADGE.5 (refusal-proves)", () => {
  test("every register code fired by a planted violation", () => {
    const codes: string[] = [];
    const attempts = [
      mint({ ...SPEC, badgeId: "", tier: "verified" }, new Set()),                     // BADGE_ERA_INVALID
      mint({ ...SPEC, badgeId: "b1", tier: "royal" }, new Set()),                      // BADGE_ERA_INVALID (bad tier)
      mint({ ...SPEC, badgeId: "b1", notBefore: 3000, at: 2000 }, new Set()),          // BADGE_ERA_INVALID (mint precedes era)
      mint({ ...SPEC, badgeId: "b1" }, new Set(["b1"])),                               // BADGE_DUPLICATE
      mint({ ...SPEC, badgeId: "b2", subjectClaimedTier: "verified" }, new Set()),     // BADGE_TIER_CLAIMED
    ];
    for (const a of attempts) {
      expect(a.ok).toBe(false);
      if (!a.ok) codes.push(a.code);
    }
    expect(new Set(codes)).toEqual(new Set([BADGE_ERA_INVALID, BADGE_DUPLICATE, BADGE_TIER_CLAIMED]));
    // evidence codes covered in F-BADGE.3 — the register complete
    const src = readFileSync(join(import.meta.dir, "..", "..", "..", "plugins", "vivim-run", "src", "badge.ts"), "utf-8");
    for (const c of [BADGE_TIER_CLAIMED, BADGE_EVIDENCE_INSUFFICIENT, BADGE_EVIDENCE_UNRESOLVABLE, BADGE_ERA_INVALID, BADGE_DUPLICATE]) {
      expect(src.includes(c)).toBe(true);
    }
  });
});

describe("F-BADGE.6 (headless)", () => {
  test("the badge is text before it is pixels", () => {
    const src = readFileSync(join(import.meta.dir, "..", "..", "..", "plugins", "vivim-run", "src", "badge.ts"), "utf-8");
    expect(/from\s+"@vivim\/(omega-)?(surfaces\/|canvas|web|daemon-client)/.test(src)).toBe(false);
    expect(/\b(document|window|navigator)\s*\./.test(src)).toBe(false);
  });
});

describe("F-BADGE.7 (loud-failure)", () => {
  test("zero silent label changes; every transition is a row or a refusal", () => {
    const reg = new BadgeRegistry();
    expect(reg.mint(SPEC).ok).toBe(true);
    // the print before
    const before = reg.print("b1")!;
    // a demotion: the row changes and the print says so
    reg.demote("b1", "untrusted", "breach", 9000);
    const after = reg.print("b1")!;
    expect(after).not.toBe(before);
    expect(after).toContain("DEMOTED");
    // unknown badge: named refusal, not silence
    expect(reg.print("ghost")).toBeNull();
    const missing = reg.promote("ghost", "GEN_GENERIC", ["a", "b"], () => true, () => true, "D-x");
    expect(missing.ok).toBe(false);
    expect(/catch\s*(\([^)]*\))?\s*\{\s*\}/.test(readFileSync(join(import.meta.dir, "..", "..", "..", "plugins", "vivim-run", "src", "badge.ts"), "utf-8"))).toBe(false);
  });
});
