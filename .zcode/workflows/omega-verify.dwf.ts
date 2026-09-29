/* zcode-workflow
description: "Durable completion gate: extracts every completion claim from a
  receipt, report or text, verifies each claim against durable repository
  evidence in parallel, and delivers an itemized
  verified/partial/unproven/refuted verdict."
whenToUse: Whenever work is reported DONE — chat-reported completion is never
  trusted until this gate says so.
args:
  claim:
    type: string
    description: Path to a receipt/report document in the workspace, or the claim
      text itself.
    required: true
*/
interface Claim {
  /** Claim id, c1, c2, ... */
  id: string;
  /** One testable completion claim. */
  claim: string;
  /** The evidence the document cites for it (commit, path, test). */
  evidence: string;
}
interface Verdict {
  /** Claim id. */
  id: string;
  /** One sentence restating the claim. */
  claim: string;
  /** Durable-evidence verdict. */
  verdict: "verified" | "partial" | "unproven" | "refuted";
  /** What was actually checked: paths, commands, commits. */
  evidence: string;
  /** One sentence of judgement. */
  note: string;
}

const claimRef = String(args.claim ?? "").trim();
if (!claimRef) throw new Error("args.claim is required: a path to a receipt/report in the workspace, or the claim text itself.");
const looksLikePath = claimRef.includes("/") || /\.(md|txt|json)$/.test(claimRef);

phase("Extract the completion claims")
const extractor = agent("claim-extractor", {
  system: "You extract testable completion claims from a document or text. Read-only: do not edit anything.",
});
const claims = await extractor.ask<Claim[]>(
  looksLikePath
    ? `Read the file ${claimRef} and return every distinct completion claim it makes, with the evidence each one cites. If the file does not exist, return a single claim saying so. Number ids c1, c2, ...`
    : `Decompose this reported work into every distinct testable completion claim, with any evidence the text cites. Number ids c1, c2, ...\n\n${claimRef}`,
);
log(`Verifying ${claims.length} claim(s)`);

phase("Verify each claim against the repository in parallel")
const verdicts: Verdict[] = await Promise.all(
  claims.map(async (c, i) => {
    const verifier = agent(`verifier-${i}`, {
      system: "You verify one completion claim against the repository itself. Read files and run read-only commands (git log, git show, directory listings) as needed. Do not edit anything. A claim is verified only by durable repository evidence — a commit plus the artifact it claims to deliver — never by a document's own assertion.",
    });
    return await verifier.ask<Verdict>(
      `Claim ${c.id}: ${c.claim}\nCited evidence: ${c.evidence}\nDecide verified / partial / unproven / refuted. verified = the cited commit and artifact exist and contain the claimed result; refuted = repository evidence contradicts the claim; unproven = nothing durable backs it. Cite exactly what you checked.`,
    );
  }),
);

const notVerified = verdicts.filter((v) => v.verdict !== "verified");
const reportMd = [
  "# Durable completion gate",
  "",
  `Checked ${verdicts.length} claim(s) from \`${claimRef}\`: ${verdicts.filter((v) => v.verdict === "verified").length} verified, ${notVerified.length} not verified.`,
  "",
  ...verdicts.map((v) => `- **${v.verdict.toUpperCase()}** (${v.id}) ${v.claim} — ${v.note} Evidence: ${v.evidence}`),
].join("\n");
await artifact.markdown("report", reportMd, {
  title: "Completion gate verdict",
  description: `Itemized verdict on the ${verdicts.length} completion claim(s) from ${claimRef}.`,
  primary: true,
});

return {
  conclusion: `${verdicts.length} claim(s) checked; ${verdicts.filter((v) => v.verdict === "verified").length} verified by durable repository evidence, ${notVerified.length} not verified.`,
  findings: notVerified.map((v) => ({
    where: claimRef,
    what: `${v.id}: ${v.claim} — ${v.verdict}`,
    evidence: v.evidence,
    status: "verified" as const,
    severity: v.verdict === "refuted" ? ("high" as const) : ("medium" as const),
  })),
  verified: ["each claim was checked against the repository by an independent verifier"],
  notCovered: ["claims whose cited evidence is outside this repository could only be checked for absence here"],
};