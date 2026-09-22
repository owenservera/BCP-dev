// tooling/gates/test/f-adapt.test.ts — the F-ADAPT falsifier (D-455, Ω-16).
// Generated as a RED stub by `omega:loop --stub D-455`, then implemented.
//  F-ADAPT.1 the-honest-census — a behavior change cited by three compositions → the census lists all three with principals; ratifying with no census → ADAPT_CENSUS_UNCITED; a fourth dependent after the proposal → ADAPT_BLAST_RADIUS_CHANGED at the flip
//  F-ADAPT.2 the-signed-flip — a human principal → the row carries the signature + decisionRef; without → ADAPT_SILENT_PROMOTION; via a live auto-with-proof standing → the row cites the standing, which cites the original consent — the chain of the yes
//  F-ADAPT.3 the-treaty-guard — behavior promised in a live treaty → ADAPT_TREATY_UNCHECKED naming the treaty; both parties re-sign → the change ratifies
//  F-ADAPT.4 the-way-back — within the window, rollback returns to the point in one op citing the rows; past the window → ADAPT_WINDOW_CLOSED with the new-adaptation sentence; ratifying before notBefore → ADAPT_WINDOW_CLOSED
//  F-ADAPT.5 the-model-swap-diff — a realization swap proposal carries the resolution battery diff and the ratified row cites it; a proposal without a rollback point → ADAPT_ROLLBACK_POINT_MISSING
//  F-ADAPT.6 the-last-boundary — a self-governance proposal that does not count the ceremony among its dependents → ADAPT_SELF_GOVERNANCE; one that does → the ceremony amends only through itself, the recursion holds
//  F-ADAPT.7 headless-and-loud — 1–6 daemon-only, rows before pixels; zero unsigned flips; every refusal a sentence; every census, treaty impact, and rollback point a row
import { describe, test, expect } from "bun:test";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import {
  ADAPT_CEREMONY_REF, ADAPT_NS, buildProposal, censusDigestOf, ratifyProposal,
  renderCeremony, rollbackProposal,
  ADAPT_BLAST_RADIUS_CHANGED, ADAPT_CENSUS_UNCITED, ADAPT_ROLLBACK_POINT_MISSING,
  ADAPT_SELF_GOVERNANCE, ADAPT_SILENT_PROMOTION, ADAPT_TREATY_UNCHECKED, ADAPT_WINDOW_CLOSED,
  type CensusDependentKind, type CensusEntry, type ProposeInput, type ProvenanceRef, type Ratifier,
} from "../../../plugins/vivim-agent/src/adaptation.ts";

const NOW = 1_000_000;
const OPEN = NOW - 1; // notBefore already open
const CLOSE = NOW + 1_000_000; // notAfter far away

const ref = (ns: string, id: string, rev = 1): ProvenanceRef => ({ ns, id, rev });
const entry = (dependent: string, kind: CensusDependentKind, r: ProvenanceRef): CensusEntry => ({ dependent, kind, ref: r });

/** Three compositions (with principals) depend on the target — the honest census. */
const CENSUS_3: CensusEntry[] = [
  entry("comp:daily-digest", "composition", ref("behavior", "summarizer", 3)),
  entry("agent:agent_71", "agent", ref("agent", "agent_71", 2)),
  entry("standing:auto-heal", "standing", ref("law", "standing-1", 1)),
];

const propose = (over: Partial<ProposeInput> = {}): ProposeInput => ({
  proposalId: "ap-1",
  target: { kind: "behavior", ref: "summarizer" },
  diffRef: ref("behavior", "summarizer-diff", 1),
  rollbackPoint: ref("behavior", "summarizer", 3), // the row-cited way back
  census: CENSUS_3,
  treatyChecks: [],
  window: { notBefore: OPEN, notAfter: CLOSE },
  ...over,
});

const HUMAN: Ratifier = { kind: "human", principal: "user:alice", decisionRef: ref("decision", "d-412-consent", 4) };
const STANDING: Ratifier = {
  kind: "standing",
  standingRef: ref("standing", "auto-heal", 2), // the live auto-with-proof standing
  consentRef: ref("decision", "consent-9", 1), // …which cites the original consent
};

/** Propose then flip — the happy path both ceremonies share. */
function ratified(over: Partial<ProposeInput> = {}, ratifier: Ratifier = HUMAN) {
  const p = buildProposal(propose(over), NOW - 1);
  expect(p.ok).toBe(true);
  if (!p.ok) throw new Error(p.sentence);
  const r = ratifyProposal(p.value, { census: p.value.census, ratifier }, NOW);
  expect(r.ok).toBe(true);
  if (!r.ok) throw new Error(r.sentence);
  return r.value;
}

describe("F-ADAPT (D-455)", () => {
  test("F-ADAPT.1 (the-honest-census)", () => {
    // a behavior change cited by three compositions → the census lists all three, with principals, digest-pinned
    const p = buildProposal(propose(), NOW);
    expect(p.ok).toBe(true);
    if (!p.ok) return;
    expect(p.value.status).toBe("proposed");
    expect(p.value.census.map((e) => e.dependent)).toEqual(["comp:daily-digest", "agent:agent_71", "standing:auto-heal"]);
    expect(p.value.census.every((e) => e.ref.ns.length > 0 && e.ref.rev >= 1)).toBe(true); // vault-cited
    expect(p.value.censusDigest).toBe(censusDigestOf(CENSUS_3)); // pinned at propose
    // ratify with NO census → the refusal names the counting law
    const bare = ratifyProposal(p.value, { ratifier: HUMAN }, NOW);
    expect(bare.ok).toBe(false);
    if (!bare.ok) {
      expect(bare.code).toBe(ADAPT_CENSUS_UNCITED);
      expect(bare.sentence).toContain("have not counted");
    }
    // a fourth dependent appears after the proposal → the world moved; the flip refuses the stale map
    const FOURTH = [...CENSUS_3, entry("treaty:tr-email", "treaty", ref("control", "tr-email", 2))];
    const moved = ratifyProposal(p.value, { census: FOURTH, ratifier: HUMAN }, NOW);
    expect(moved.ok).toBe(false);
    if (!moved.ok) {
      expect(moved.code).toBe(ADAPT_BLAST_RADIUS_CHANGED);
      expect(moved.sentence).toContain("never ratify a stale map");
    }
    // the census digest is order-free: the same dependents in any order still match
    const shuffled = ratifyProposal(p.value, { census: [...CENSUS_3].reverse(), ratifier: HUMAN }, NOW);
    expect(shuffled.ok).toBe(true);
  });

  test("F-ADAPT.2 (the-signed-flip)", () => {
    const p = buildProposal(propose(), NOW);
    expect(p.ok).toBe(true);
    if (!p.ok) return;
    // a human principal → the ratified row carries the signature + decisionRef
    const human = ratifyProposal(p.value, { census: CENSUS_3, ratifier: HUMAN }, NOW);
    expect(human.ok).toBe(true);
    if (human.ok) {
      expect(human.value.status).toBe("ratified");
      expect(human.value.ratifier?.kind).toBe("human");
      expect((human.value.ratifier as { principal?: string }).principal).toBe("user:alice"); // signedBy
      expect((human.value.ratifier as { decisionRef?: ProvenanceRef }).decisionRef?.id).toBe("d-412-consent");
      expect(human.value.ratifiedAt).toBe(NOW);
    }
    // attempt without a signature → the quiet flip refuses, loudly (§29)
    const silent = ratifyProposal(p.value, { census: CENSUS_3 }, NOW);
    expect(silent.ok).toBe(false);
    if (!silent.ok) {
      expect(silent.code).toBe(ADAPT_SILENT_PROMOTION);
      expect(silent.sentence).toContain("never quiet");
    }
    // an anonymous human is not a signature either
    const anon = ratifyProposal(p.value, { census: CENSUS_3, ratifier: { kind: "human", principal: "", decisionRef: ref("decision", "d", 1) } }, NOW);
    expect(anon.ok).toBe(false);
    if (!anon.ok) expect(anon.code).toBe(ADAPT_SILENT_PROMOTION);
    // via a live auto-with-proof standing → the row cites the standing, which cites the original consent — the chain of the yes
    const auto = ratifyProposal(p.value, { census: CENSUS_3, ratifier: STANDING }, NOW);
    expect(auto.ok).toBe(true);
    if (auto.ok) {
      expect(auto.value.ratifier?.kind).toBe("standing");
      const st = auto.value.ratifier as { standingRef?: ProvenanceRef; consentRef?: ProvenanceRef };
      expect(st.standingRef?.id).toBe("auto-heal");
      expect(st.consentRef?.id).toBe("consent-9");
    }
  });

  test("F-ADAPT.3 (the-treaty-guard)", () => {
    // behavior promised in a live treaty, not re-signed → the flip refuses, naming the treaty
    const p = buildProposal(propose({ treatyChecks: [{ treatyId: "tr-email", impacted: true, resigned: false }] }), NOW);
    expect(p.ok).toBe(true);
    if (!p.ok) return;
    const guarded = ratifyProposal(p.value, { census: CENSUS_3, ratifier: HUMAN }, NOW);
    expect(guarded.ok).toBe(false);
    if (!guarded.ok) {
      expect(guarded.code).toBe(ADAPT_TREATY_UNCHECKED);
      expect(guarded.sentence).toContain("tr-email"); // the treaty is named
      expect(guarded.sentence).toContain("not yours to change alone");
    }
    // both parties re-sign (the fresh checks arrive at the flip) → the change ratifies
    const resigned = ratifyProposal(p.value, {
      census: CENSUS_3, ratifier: HUMAN,
      treatyChecks: [{ treatyId: "tr-email", impacted: true, resigned: true }],
    }, NOW);
    expect(resigned.ok).toBe(true);
    if (resigned.ok) {
      expect(resigned.value.treatyChecks[0]?.resigned).toBe(true); // the row mirrors the re-signature
    }
    // an unimpacted treaty never blocks
    const aside = buildProposal(propose({ treatyChecks: [{ treatyId: "tr-other", impacted: false, resigned: false }] }), NOW);
    expect(aside.ok).toBe(true);
    if (aside.ok) {
      const ok = ratifyProposal(aside.value, { census: CENSUS_3, ratifier: HUMAN }, NOW);
      expect(ok.ok).toBe(true);
    }
  });

  test("F-ADAPT.4 (the-way-back)", () => {
    // ratifying before the window opens → refused (the ratifier signs over evidence, not over haste)
    const early = buildProposal(propose({ window: { notBefore: NOW + 500, notAfter: CLOSE } }), NOW);
    expect(early.ok).toBe(true);
    if (early.ok) {
      const hasty = ratifyProposal(early.value, { census: CENSUS_3, ratifier: HUMAN }, NOW);
      expect(hasty.ok).toBe(false);
      if (!hasty.ok) {
        expect(hasty.code).toBe(ADAPT_WINDOW_CLOSED);
        expect(hasty.sentence).toContain("has not opened");
      }
    }
    // ratifying after the window closed → refused (a flip that can never be taken back is a trap)
    const late = buildProposal(propose({ window: { notBefore: NOW - 100, notAfter: NOW - 10 } }), NOW);
    expect(late.ok).toBe(true);
    if (late.ok) {
      const trapped = ratifyProposal(late.value, { census: CENSUS_3, ratifier: HUMAN }, NOW);
      expect(trapped.ok).toBe(false);
      if (!trapped.ok) {
        expect(trapped.code).toBe(ADAPT_WINDOW_CLOSED);
        expect(trapped.sentence).toContain("trap");
      }
    }
    // WITHIN the window: rollback returns behavior to the point in one op, citing the rows
    const row = ratified();
    const back = rollbackProposal(row, NOW + 100);
    expect(back.ok).toBe(true);
    if (back.ok) {
      expect(back.value.status).toBe("rolled-back");
      expect(back.value.rolledBackAt).toBe(NOW + 100);
      expect(back.value.rollbackPoint).toEqual(ref("behavior", "summarizer", 3)); // the point's rows, cited
      expect(back.value.diffRef).toEqual(ref("behavior", "summarizer-diff", 1)); // the attribution survives the way back
    }
    // PAST the window → the way back ends where it was drawn; past it lies only a new adaptation
    const past = rollbackProposal(row, CLOSE + 1);
    expect(past.ok).toBe(false);
    if (!past.ok) {
      expect(past.code).toBe(ADAPT_WINDOW_CLOSED);
      expect(past.sentence).toContain("only a new adaptation");
    }
  });

  test("F-ADAPT.5 (the-model-swap-diff)", () => {
    // a realization swap carries the resolution battery diff; the ratified row cites it — the 3am silent swap, now impossible
    const batteryDiff = ref("resolve", "battery-diff-model-b", 7); // WHAT answers would change, not just who
    const swap = ratified({
      proposalId: "ap-swap",
      target: { kind: "realization", ref: "model-b" },
      diffRef: batteryDiff,
      rollbackPoint: ref("providers", "model-a", 12),
    });
    expect(swap.target.kind).toBe("realization");
    expect(swap.diffRef).toEqual(batteryDiff); // the ratifier's row cites the battery diff
    expect(swap.rollbackPoint).toEqual(ref("providers", "model-a", 12)); // the way back is the prior realization
    // a proposal without a rollback point refuses — a bet placed with the house's money
    const pointfree = buildProposal(propose({ rollbackPoint: undefined }), NOW);
    expect(pointfree.ok).toBe(false);
    if (!pointfree.ok) {
      expect(pointfree.code).toBe(ADAPT_ROLLBACK_POINT_MISSING);
      expect(pointfree.sentence).toContain("house's money");
    }
    // an empty census without its proof of emptiness refuses the same counting law
    const uncounted = buildProposal(propose({ census: [] }), NOW);
    expect(uncounted.ok).toBe(false);
    if (!uncounted.ok) expect(uncounted.code).toBe(ADAPT_CENSUS_UNCITED);
    // an empty census WITH its cited basis proposes honestly (provably nothing cites the target)
    const provablyEmpty = buildProposal(propose({ census: [], censusBasis: "vault.query adapt-scan: zero rows cite policy:retention@3" }), NOW);
    expect(provablyEmpty.ok).toBe(true);
    if (provablyEmpty.ok) {
      expect(provablyEmpty.value.censusBasis).toBe("vault.query adapt-scan: zero rows cite policy:retention@3");
      // and it ratifies with the matching (still-empty) fresh census
      const flip = ratifyProposal(provablyEmpty.value, { census: [], ratifier: HUMAN }, NOW);
      expect(flip.ok).toBe(true);
    }
  });

  test("F-ADAPT.6 (the-last-boundary)", () => {
    // a proposal amending the ceremony itself, without counting the ceremony among its dependents → the recursion refuses
    const selfish = buildProposal(propose({
      proposalId: "ap-self",
      target: { kind: "policy", ref: ADAPT_CEREMONY_REF },
      census: [entry("comp:daily-digest", "composition", ref("behavior", "summarizer", 3))], // dependents, but not the ceremony
    }), NOW);
    expect(selfish.ok).toBe(false);
    if (!selfish.ok) {
      expect(selfish.code).toBe(ADAPT_SELF_GOVERNANCE);
      expect(selfish.sentence).toContain("recursion is law");
    }
    // counting the ceremony (a census entry citing ns adapt) → the amendment goes through the ceremony itself
    const honest = buildProposal(propose({
      proposalId: "ap-self",
      target: { kind: "policy", ref: ADAPT_CEREMONY_REF },
      census: [
        entry("comp:daily-digest", "composition", ref("behavior", "summarizer", 3)),
        entry("adapt.ceremony", "standing", ref(ADAPT_NS, "proposal:ap-0", 4)), // the ceremony counts itself first
      ],
    }), NOW);
    expect(honest.ok).toBe(true);
    if (honest.ok) {
      expect(honest.value.status).toBe("proposed"); // born proposed — never ratified by construction
      // the ONLY path to ratified is the ceremony's own flip: census, signature, window — no bypass exists
      const flipped = ratifyProposal(honest.value, {
        census: honest.value.census,
        ratifier: HUMAN, // amending the ceremony still takes a signature
      }, NOW);
      expect(flipped.ok).toBe(true);
      if (flipped.ok) expect(flipped.value.status).toBe("ratified");
    }
  });

  test("F-ADAPT.7 (headless-and-loud)", () => {
    const src = readFileSync(join(import.meta.dir, "..", "..", "..", "plugins", "vivim-agent", "src", "adaptation.ts"), "utf-8");
    expect(/from\s+"@vivim\/(omega-)?(surfaces\/|canvas|web|daemon-client)/.test(src)).toBe(false); // no surface imports
    expect(/\b(?:const|let|var)\s+(?:window|document|navigator)\b/.test(src)).toBe(false); // no DOM globals as variables (row-shape property names are data, not globals)
    for (const code of [
      ADAPT_CENSUS_UNCITED, ADAPT_TREATY_UNCHECKED, ADAPT_WINDOW_CLOSED, ADAPT_SELF_GOVERNANCE,
      ADAPT_SILENT_PROMOTION, ADAPT_ROLLBACK_POINT_MISSING, ADAPT_BLAST_RADIUS_CHANGED,
    ]) {
      expect(src.includes(code)).toBe(true); // every register code is real, in-source
    }
    expect(/catch\s*(\([^)]*\))?\s*\{\s*\}/.test(src)).toBe(false); // no silent swallows
    // rows before pixels: every census, treaty impact, and rollback point is a row on the proposal
    const row = ratified({ proposalId: "ap-render" });
    expect(row.census.every((e) => e.ref.rev >= 1)).toBe(true); // the census is rows
    expect(Array.isArray(row.treatyChecks)).toBe(true); // the treaty impact is rows
    expect(row.rollbackPoint.rev).toBe(3); // the rollback point is a row
    expect(row.ratifier?.kind).toBe("human"); // the flip is signed
    // the ceremony renders headless — proposed first, signatures named, text only
    const proposed = buildProposal(propose({ proposalId: "ap-proposed" }), NOW);
    const text = renderCeremony([row, proposed.ok ? proposed.value : row, { ...row, status: "rolled-back", proposalId: "ap-gone" }]);
    expect(text).toContain("adapt.read — 3 proposal(s)");
    expect(text).toContain("ap-proposed behavior:summarizer");
    expect(text).toContain("signedBy user:alice");
    expect(text.indexOf("ap-proposed")).toBeLessThan(text.indexOf("ap-render")); // proposed first
    // zero unsigned flips: a settled ceremony never re-flips (the way back is rollback, not re-ratify)
    const again = ratifyProposal(row, { census: CENSUS_3, ratifier: HUMAN }, NOW);
    expect(again.ok).toBe(false);
    if (!again.ok) expect(again.code).toBe("UNSUPPORTED");
    const rolledTwice = rollbackProposal({ ...row, status: "rolled-back", rolledBackAt: NOW }, NOW);
    expect(rolledTwice.ok).toBe(false);
  });
});
