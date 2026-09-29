/* zcode-workflow
description: "Standing-state sweep of the VIVIM Ω core: five parallel readers
  over Ω law, destination boundary, substrate docs, task queues and the working
  tree; drift claims are independently confirmed before reporting."
whenToUse: At the start of a work session, after returning from a break, or
  whenever durable docs and repository evidence might have diverged.
*/
interface DriftItem {
  /** Where the claim is made, "path:line". */
  claim: string;
  /** One sentence: what the repository actually shows. */
  reality: string;
  /** Reserve "high" for a contradiction that would send work the wrong way. */
  severity: "low" | "medium" | "high";
}
interface ConfirmedDrift {
  /** Where the claim is made, "path:line". */
  claim: string;
  /** One sentence: what the repository actually shows. */
  reality: string;
  /** Reserve "high" for a contradiction that would send work the wrong way. */
  severity: "low" | "medium" | "high";
  /** verified when a fresh reader reproduced the contradiction from the files alone. */
  status: "verified" | "unconfirmed";
}
interface LensState {
  /** Short area label, e.g. "Ω law". */
  area: string;
  /** Two to four sentences: what is currently true in this area. */
  state: string;
  /** Concrete open items, each with owner or path where known. */
  open: string[];
  /** Claims in durable documents that the cited evidence contradicts. */
  drift: ConfirmedDrift[];
  /** Paths (or commands) that produced this picture. */
  evidence: string[];
}

const lenses: { id: string; area: string; brief: string }[] = [
  {
    id: "law",
    area: "Ω law",
    brief:
      "Read omega-baseline/omega-final/docs/decisions/CURRENT-INVARIANTS.md and omega-baseline/omega-final/docs/BUILD-DECISIONS.md, then skim the newest D-records in omega-baseline/omega-final/docs/decisions/. Report the currently binding invariants and every decision the docs themselves mark open or provisional.",
  },
  {
    id: "destination",
    area: "destination boundary",
    brief:
      "Read docs/destination/core-vs-plugin-boundary/DESTINATION-RESPONSIBILITY-MATRIX.md (section headers and cross-cutting view, not every row) and docs/destination/core-vs-plugin-boundary/CURRENT-OMEGA-IMPLEMENTATION-MAP.md. Report what the destination baseline claims and which areas it lists unfinished.",
  },
  {
    id: "substrate",
    area: "Ω substrate",
    brief:
      "Read omega-baseline/omega-final/docs/ROADMAP.md, omega-baseline/omega-final/docs/KNOWN-LIMITS.md and omega-baseline/omega-final/docs/ARCHITECTURE-NEXT-STEPS.md. Report the substrate's own account of its current state and open limits.",
  },
  {
    id: "queues",
    area: "task queues",
    brief:
      "Read AGENTS_CONTEXT/ARCHITECTURE_STEWARD/TASKS.md and every other AGENTS_CONTEXT/*/TASKS.md that exists. Report each entry that is ACTIVE, DOING, BLOCKED or OPEN with its stated next action; note DONE entries only when they look stale or unverified.",
  },
  {
    id: "tree",
    area: "working tree",
    brief:
      "Run read-only git commands (status, branch -a, log --oneline -15 on the current branch and on team/omega-endstate). Report uncommitted material, branch divergence, and anything substantive sitting untracked.",
  },
];

phase("Sweep the five areas in parallel")
const settled: LensState[] = await Promise.all(
  lenses.map(async (l) => {
    const reader = agent(`reader-${l.id}`, {
      system: `You are the ${l.area} reader in a standing-state sweep of the VIVIM Ω core. Read-only: do not edit, create or delete anything. Cite every claim with the path you read it from. If a file named in the brief does not exist, say so instead of guessing.`,
    });
    const state = await reader.ask<LensState>(
      `${l.brief}\n\nReturn the full ${l.area} picture as LensState. Record drift only where a document's own cited evidence contradicts it, not for mere staleness.`,
    );
    const confirmed: ConfirmedDrift[] = await Promise.all(
      state.drift.map(async (d, i) => {
        const checker = agent(`drift-checker-${l.id}-${i}`, {
          system: "You independently confirm or refute one drift claim by reading the repository files yourself. Read-only: do not edit anything.",
        });
        const verdict = await checker.ask<{ reproduced: boolean; note: string }>(
          `A sweep reader claims drift in "${l.area}". Claim: ${d.claim}. Claimed reality: ${d.reality}. Read the files involved and reply reproduced=true only if you reproduced the contradiction yourself.`,
        );
        const status: ConfirmedDrift["status"] = verdict.reproduced ? "verified" : "unconfirmed";
        return { claim: d.claim, reality: d.reality, severity: d.severity, status };
      }),
    );
    return { area: state.area, state: state.state, open: state.open, drift: confirmed, evidence: state.evidence };
  }),
);

phase("Compose the standing-state report")
const synthesizer = agent("synthesizer", {
  system: "You write the Ω standing-state report from the five lens results you are given. Read-only. Ground every statement in the evidence the lenses cite; where lenses disagree, say so; add nothing beyond a short judgement of your own.",
});
const reportMd = await synthesizer.ask<string>(
  `Write the standing-state report for the project owner in markdown. Sections: 1) one-paragraph verdict on where the Ω core actually stands; 2) per-area state; 3) confirmed drift with evidence paths; 4) unconfirmed drift, explicitly labelled suspected; 5) open items worth owner attention, ordered. Lens results:\n${JSON.stringify(settled)}`,
);
await artifact.markdown("report", reportMd, {
  title: "Ω standing-state report",
  description: "What Ω law, destination boundary, substrate docs, task queues and the working tree say today, with drift confirmed against the repository.",
  primary: true,
});

const allDrift = settled.flatMap((s) => s.drift);
return {
  conclusion: `Swept ${settled.length} areas; ${allDrift.length} drift claims, ${allDrift.filter((d) => d.status === "verified").length} confirmed against the repository.`,
  findings: allDrift.map((d) => ({
    where: d.claim,
    what: d.reality,
    evidence: "see the standing-state report artifact",
    status: d.status,
    severity: d.severity,
  })),
  verified: [
    "each area's picture cites the files its reader read",
    "every drift item was re-checked by a fresh reader with no prior context",
  ],
  notCovered: ["the sweep reads documents and the git index; it runs no builds or tests"],
};