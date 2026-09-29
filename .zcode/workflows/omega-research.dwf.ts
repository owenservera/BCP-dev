/* zcode-workflow
description: "Research resident: decomposes a question into bounded lenses,
  investigates every lens in parallel with read-only workers, independently
  confirms each material finding, and synthesizes an evidence-cited answer with
  gaps stated."
whenToUse: For any bounded research question about the Ω core, the destination,
  or prior art — the standing replacement for ad-hoc repo digging.
args:
  question:
    type: string
    description: The research question, stated precisely.
    required: true
*/
interface Finding {
  /** One sentence: the finding itself. */
  what: string;
  /** Evidence: the file paths (with lines) or command output that showed it. */
  evidence: string;
  /** How load-bearing this is for the question. */
  confidence: "high" | "medium" | "low";
}
interface LensFinding {
  /** Short lens label, e.g. "prior art", "current contracts". */
  lens: string;
  findings: Finding[];
  /** What this lens could not answer and why. */
  gaps: string[];
}

const question = String(args.question ?? "").trim();
if (!question) throw new Error("args.question is required: state the research question precisely.");

phase("Size the question into lenses")
const scout = agent("scout", {
  system: "You decompose a research question into 2-6 independent bounded lenses, each answerable by one read-only session. Read-only: do not edit anything.",
});
let lenses = await scout.ask<{ lens: string; task: string }[]>(
  `Question: ${question}\n\nReturn 2-6 lenses. Each lens gets a short label and a self-contained task naming the paths or search targets that answer it (the Ω substrate lives in omega-baseline/omega-final, destination docs in docs/destination/, repository context in AGENTS.md and docs/CURRENT-CONTEXT.md). Lenses must not depend on each other's answers.`,
);
if (lenses.length > 6) lenses = lenses.slice(0, 6);
log(`Researching ${lenses.length} lens(es) in parallel`);

phase("Investigate every lens and confirm its findings")
const results: LensFinding[] = await Promise.all(
  lenses.map(async (l, i) => {
    const investigator = agent(`investigator-${i}`, {
      system: "You are a research investigator answering one bounded lens of a question about the VIVIM Ω project. Read-only: do not edit anything. Every finding must cite the file path or command output that showed it; say plainly what you could not answer.",
    });
    const found = await investigator.ask<LensFinding>(l.task);
    const material = found.findings.filter((f) => f.confidence !== "low");
    const checked: Finding[] = await Promise.all(
      material.map(async (f, j) => {
        const confirmer = agent(`confirmer-${i}-${j}`, {
          system: "You independently reproduce one research finding from its cited evidence before it is reported. Read-only: do not edit anything.",
        });
        const verdict = await confirmer.ask<{ reproduced: boolean; note: string }>(
          `A researcher answered the question "${question}" with this finding: ${f.what}\nCited evidence: ${f.evidence}\nCheck the cited evidence yourself and reply reproduced=true only if you saw it.`,
        );
        return verdict.reproduced
          ? f
          : { what: f.what, evidence: `${f.evidence} — unconfirmed: ${verdict.note}`, confidence: "low" as const };
      }),
    );
    const low = found.findings.filter((f) => f.confidence === "low");
    return { lens: l.lens, findings: checked.concat(low), gaps: found.gaps };
  }),
);

phase("Synthesize the answer")
const synthesizer = agent("synthesizer", {
  system: "You write the answer to a research question from the lens results you are given. Read-only. Ground every statement in the cited evidence; mark anything unconfirmed or gapped explicitly; add nothing the lenses did not find.",
});
const reportMd = await synthesizer.ask<string>(
  `Answer this question for the project owner in markdown: "${question}"\n\nStructure: 1) the answer in a short paragraph; 2) supporting findings per lens with evidence; 3) unconfirmed or low-confidence items, labelled; 4) what remains unknown. Lens results:\n${JSON.stringify(results)}`,
);
await artifact.markdown("report", reportMd, {
  title: "Ω research answer",
  description: `Answer to: ${question}`,
  primary: true,
});

const unconfirmed = results.flatMap((r) => r.findings.filter((f) => f.evidence.includes("unconfirmed")));
return {
  conclusion: `Researched ${results.length} lens(es) for "${question}"; ${results.reduce((n, r) => n + r.findings.length, 0)} findings, ${unconfirmed.length} unconfirmed.`,
  findings: results.flatMap((r) =>
    r.findings.map((f) => ({
      where: f.evidence,
      what: f.what,
      evidence: f.evidence,
      status: f.evidence.includes("unconfirmed") ? ("unconfirmed" as const) : ("verified" as const),
      severity: "medium" as const,
    })),
  ),
  verified: ["every high/medium-confidence finding was independently reproduced from its cited evidence"],
  notCovered: results.flatMap((r) => r.gaps.map((g) => `${r.lens}: ${g}`)),
};