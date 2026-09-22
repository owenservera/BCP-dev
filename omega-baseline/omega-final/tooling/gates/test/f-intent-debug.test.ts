// tooling/gates/test/f-intent-debug.test.ts — the F-INTENT-DEBUG falsifier (D-434, Ω-2.6).
// Generated as a RED stub by `omega:loop --stub D-434`, then implemented.
//  F-INTENT-DEBUG.1 exact-replay — a pinned corpus of utterances resolves twice to byte-identical derivation traces (the walk is a pure function of utterance + lexicon state)
//  F-INTENT-DEBUG.2 lexicon-attribution — a lexicon entry ("lab" → ns research) changes a resolution with entryId cited in the trace; revoking the entry reverts resolution exactly
//  F-INTENT-DEBUG.3 auto-apply-refused — a realization path writing a lexicon row directly refuses INTENT_LEXICON_AUTO_APPLY_REFUSED — proposals are the only path to acceptance
//  F-INTENT-DEBUG.4 leakage-tripwire — a grafted probabilistic/nondeterministic call in the walk makes replay diverge → INTENT_RESOLUTION_NONDETERMINISTIC names the case
//  F-INTENT-DEBUG.5 diff-debugging — a planted lexicon/policy change between two runs is localized by intent.trace.diff naming the changed step
//  F-INTENT-DEBUG.6 headless — traces/diffs/lexicon are CLI/daemon ops; any graph view is a derived projection
import { describe, test, expect } from "bun:test";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import {
  acceptProposal, activeEntries, lexiconDigest, makePrincipalEntry, makeProposal,
  parseEntryRow, type LexiconEntry, type LexiconProposalSpec,
} from "../../../plugins/vivim-intent/src/lexicon.ts";
import { diffTraces, resolveWithTrace, traceBytes, type BaseResolver } from "../../../plugins/vivim-intent/src/trace.ts";
import { auditReplay, scanForRealizationImports } from "../../../plugins/vivim-intent/src/audit.ts";

/** A deterministic base resolver: keyword → op (the NLCL stub). */
const stubBase: BaseResolver = (normalized: string) => {
  if (normalized.includes("vault") && normalized.includes("query")) return [{ op: "vault.query@1", score: 0.9 }];
  if (normalized.includes("chat") || normalized.includes("send")) return [{ op: "chat.send@1", score: 0.8 }];
  if (normalized.includes("notes") || normalized.includes("lab")) return [{ op: "notes.open@1", score: 0.7 }];
  return [];
};

const CORPUS = [
  "query the vault",
  "send a chat message",
  "open the lab notes",
  "vault query everything",
  "chat to alice",
  "show me my notes",
];

function entry(from: string, spec: LexiconProposalSpec): LexiconEntry {
  const made = makePrincipalEntry(from, spec, 1000);
  if ("refused" in made) throw new Error(`fixture refused: ${made.refused.sentence}`);
  return made.entry;
}

describe("F-INTENT-DEBUG.1 (exact-replay)", () => {
  test("the pinned corpus resolves twice to byte-identical traces (with and without lexicon state)", () => {
    const labEntry = entry("user:alice", { kind: "alias", payload: { word: "lab", op: "vault.query@1" }, scope: "global" });
    for (const entries of [[], [labEntry]] as LexiconEntry[][]) {
      const first = CORPUS.map((u) => traceBytes(resolveWithTrace(u, entries, stubBase)));
      const second = CORPUS.map((u) => traceBytes(resolveWithTrace(u, entries, stubBase)));
      expect(second).toEqual(first);
      // every trace is self-describing and pinned
      for (const t of CORPUS.map((u) => resolveWithTrace(u, entries, stubBase))) {
        expect(t.kind).toBe("intent.trace@1");
        expect(t.replayable).toBe(true);
        expect(t.resolverDigest).toMatch(/^sha256:[0-9a-f]{64}$/);
        expect(t.steps.length).toBeGreaterThanOrEqual(4);
        expect(t.steps.map((s) => s.kind)).toEqual(["normalize", "parse", "lexicon", "disambiguate", "resolve"]);
      }
    }
  });
});

describe("F-INTENT-DEBUG.2 (lexicon-attribution)", () => {
  test("the alias changes a resolution with entryId cited; revocation reverts it exactly", () => {
    const utterance = "open the lab notes";
    const before = resolveWithTrace(utterance, [], stubBase);
    expect(before.resolvedIntent?.op).toBe("notes.open@1");
    // the entry: "lab" → vault.query@1 (the research reading)
    const lab = entry("user:alice", { kind: "alias", payload: { word: "lab", op: "vault.query@1" }, scope: "global" });
    const after = resolveWithTrace(utterance, [lab], stubBase);
    expect(after.resolvedIntent?.op).not.toBe(before.resolvedIntent?.op);
    // the hit is cited by entryId in the trace
    expect(after.lexiconHits.length).toBe(1);
    expect(after.lexiconHits[0]!.entryId).toBe(lab.entryId);
    expect(after.lexiconDigest).not.toBe(before.lexiconDigest);
    // revocation: the tombstone reverts the resolution AND the digest exactly
    const revoked = { ...lab, revokedAt: 2000 };
    const reverted = resolveWithTrace(utterance, [revoked], stubBase);
    expect(reverted.resolvedIntent?.op).toBe(before.resolvedIntent?.op);
    expect(reverted.lexiconDigest).toBe(before.lexiconDigest);
    expect(lexiconDigest([revoked])).toBe(lexiconDigest([]));
    expect(activeEntries([revoked]).length).toBe(0);
  });
});

describe("F-INTENT-DEBUG.3 (auto-apply-refused)", () => {
  test("a realization writing a lexicon row directly refuses; the proposal → acceptance ceremony is the only path", () => {
    const spec: LexiconProposalSpec = { kind: "alias", payload: { word: "boop", op: "chat.send@1" }, scope: "global" };
    // the realization tries to write directly → refused, named
    const rogue = makePrincipalEntry("agent:helper", spec, 1000);
    expect("refused" in rogue).toBe(true);
    if ("refused" in rogue) expect(rogue.refused.code).toBe("INTENT_LEXICON_AUTO_APPLY_REFUSED");
    // the realization proposes (legal — proposals are data waiting for a person)
    const proposal = makeProposal("agent:helper", spec, ["chat:42 asked twice for boop"], 1000);
    expect("proposal" in proposal).toBe(true);
    // a realization trying to ACCEPT its own proposal is auto-apply too
    if ("proposal" in proposal) {
      const selfAccept = acceptProposal("agent:helper", proposal.proposal, 1100);
      expect("refused" in selfAccept).toBe(true);
      if ("refused" in selfAccept) expect(selfAccept.refused.code).toBe("INTENT_LEXICON_AUTO_APPLY_REFUSED");
      // the principal accepts: the entry lands with proposalRef cited
      const accepted = acceptProposal("user:alice", proposal.proposal, 1200);
      expect("entry" in accepted).toBe(true);
      if ("entry" in accepted) {
        expect(accepted.entry.origin.kind).toBe("accepted-proposal");
        expect(accepted.entry.origin.proposalRef).toBe(proposal.proposal.proposalId);
      }
      // expiry: past 30d the proposal dies (an unreviewed suggestion is not a standing temptation)
      const late = acceptProposal("user:alice", { ...proposal.proposal, proposedAt: 0, expiresAt: proposal.proposal.expiresAt }, proposal.proposal.expiresAt + 1);
      expect("refused" in late).toBe(true);
      if ("refused" in late) expect(late.status).toBe("expired");
    }
  });
});

describe("F-INTENT-DEBUG.4 (leakage-tripwire)", () => {
  test("a grafted probabilistic call makes replay diverge and the audit names the case; the deterministic walk stays green", () => {
    // the grafted call: a resolver that varies per invocation (the probabilistic leak)
    let calls = 0;
    const leaky: BaseResolver = (n) => {
      calls++;
      return calls % 2 === 0 ? [{ op: "vault.query@1" }] : [{ op: "notes.open@1" }];
    };
    const result = auditReplay([{ utterance: "open the lab notes" }], [], leaky);
    expect(result.ok).toBe(false);
    expect(result.findings.length).toBeGreaterThan(0);
    expect(result.findings[0]!.code).toBe("INTENT_RESOLUTION_NONDETERMINISTIC");
    expect(result.findings[0]!.sentence).toContain("open the lab notes");
    // the deterministic walk over the same corpus: green
    const clean = auditReplay(CORPUS.map((utterance) => ({ utterance })), [], stubBase);
    expect(clean.ok).toBe(true);
    // the static provenance scan: the walk sources import no realization surface
    const srcs = ["lexicon.ts", "trace.ts", "audit.ts"].map((f) => ({
      path: f,
      src: readFileSync(join(import.meta.dir, "..", "..", "..", "plugins", "vivim-intent", "src", f), "utf-8"),
    }));
    expect(scanForRealizationImports(srcs)).toEqual([]);
    // and a planted import IS caught (the scan is not a rubber stamp)
    expect(scanForRealizationImports([{ path: "rogue.ts", src: `import { x } from "@vivim/omega-sdk";` }]).length).toBe(1);
  });
});

describe("F-INTENT-DEBUG.5 (diff-debugging)", () => {
  test("a planted lexicon change is localized by the diff, naming the changed step", () => {
    const utterance = "open the lab notes";
    const a = resolveWithTrace(utterance, [], stubBase);
    // the planted change: the lab alias arrives
    const lab = entry("user:alice", { kind: "alias", payload: { word: "lab", op: "vault.query@1" }, scope: "global" });
    const b = resolveWithTrace(utterance, [lab], stubBase);
    const diff = diffTraces(a, b);
    expect(diff.same).toBe(false);
    expect(diff.utteranceSame).toBe(true);
    expect(diff.lexiconChanged).toBe(true);
    expect(diff.resolvedSame).toBe(false);
    expect(diff.firstDivergence).not.toBeNull();
    // the divergence is at the lexicon step (step 3) — the change is localized, not "somewhere"
    expect(diff.firstDivergence).toBe(3);
    expect(diff.divergedSteps.length).toBeGreaterThan(0);
    expect(diff.divergedSteps[0]!.a).toContain("no active entries");
    expect(diff.divergedSteps[0]!.b).toContain(lab.entryId);
  });
});

describe("F-INTENT-DEBUG.6 (headless)", () => {
  test("the lexicon/trace/audit modules import no canvas/surface dependency; no DOM globals used", () => {
    for (const f of ["lexicon.ts", "trace.ts", "audit.ts"] as const) {
      const src = readFileSync(join(import.meta.dir, "..", "..", "..", "plugins", "vivim-intent", "src", f), "utf-8");
      expect(/from\s+"@vivim\/(omega-)?(surfaces|canvas|web|daemon-client)/.test(src)).toBe(false);
      expect(/\b(document|window|navigator)\s*\./.test(src)).toBe(false);
    }
    // tolerant parsing: malformed rows are skipped, never crash the walk
    expect(parseEntryRow(null)).toBeNull();
    expect(parseEntryRow({ entryId: 42 })).toBeNull();
    expect(parseEntryRow({ entryId: "lex:x", kind: "alias", payload: {}, principal: "u", scope: "global", badge: {}, origin: {}, createdAt: 0 })?.entryId).toBe("lex:x");
  });
});
