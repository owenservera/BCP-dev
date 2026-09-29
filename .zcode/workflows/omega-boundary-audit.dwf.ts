/* zcode-workflow
description: "Core-vs-plugin boundary audit: maps the destination responsibility
  matrix into sections, audits each against the real Ω implementation in
  omega-baseline/omega-final in parallel, independently confirms every
  claimed-implemented row, and reports where the boundary actually stands."
whenToUse: Before planning core work, after landing a structural change, or
  whenever the boundary needs re-verification against the matrix.
args:
  section:
    type: string
    description: "Optional: audit only the matrix section whose name matches this
      text. Empty = audit the whole matrix."
    required: false
*/
interface RowVerdict {
  /** Matrix row identifier or short subject, e.g. "R-041 Provider". */
  row: string;
  /** Where the responsibility actually lives today. */
  status: "implemented" | "partial" | "missing" | "doc-only";
  /** Implementation or doc paths that decided the verdict. */
  evidence: string;
  /** One sentence when something is surprising; empty string otherwise. */
  note: string;
}
interface SectionAudit {
  /** Section name from the responsibility matrix. */
  section: string;
  verdicts: RowVerdict[];
  /** What this section could not check and why. */
  gaps: string[];
}
interface Section {
  /** Matrix section name. */
  name: string;
  /** Which rows or subjects the section covers, as guidance for the auditor. */
  scope: string;
}

const sectionArg = String(args.section ?? "").trim();

phase("Map the matrix into auditable sections")
const scout = agent("scout", {
  system: "You map the destination responsibility matrix into auditable sections. Read-only: do not edit anything.",
});
let sections = await scout.ask<Section[]>(
  `Read docs/destination/core-vs-plugin-boundary/DESTINATION-RESPONSIBILITY-MATRIX.md. ${
    sectionArg
      ? `Audit ONLY the section(s) matching: "${sectionArg}".`
      : "Split the matrix into at most 8 coherent sections of related rows; never merge unrelated rows to fit the cap."
  } List each section with the row range or subjects it covers. Sanity-check that the rows you listed account for the matrix's full row count.`,
);
if (sections.length > 8) sections = sections.slice(0, 8);
log(`Auditing ${sections.length} boundary section(s)`);

phase("Audit each section against the Ω implementation in parallel")
const audits: SectionAudit[] = await Promise.all(
  sections.map(async (s, i) => {
    const auditor = agent(`auditor-${i}`, {
      system: "You are a boundary auditor for the VIVIM Ω core: for each responsibility row you decide where it actually lives in omega-baseline/omega-final. Read-only: do not edit anything. Cite file paths for every verdict.",
    });
    const audit = await auditor.ask<SectionAudit>(
      `Matrix section "${s.name}" — ${s.scope}. For every row in the section, look inside omega-baseline/omega-final (contracts/, host/, platform/, plugins/, packs/, surfaces/, sdk/, tooling/) for real runtime code, and classify: implemented (runtime code owns it), partial (some code, clearly incomplete), missing (nothing), doc-only (specified but no code). If a row is deliberately deferred or archived, classify doc-only with a note saying so. Record what you could not check in gaps.`,
    );
    const confirmedImpl: RowVerdict[] = await Promise.all(
      audit.verdicts
        .filter((v) => v.status === "implemented")
        .map(async (v, j) => {
          const checker = agent(`impl-checker-${i}-${j}`, {
            system: "You independently verify that one claimed-implemented responsibility really has runtime code behind it. Read-only: do not edit anything.",
          });
          const verdict = await checker.ask<{ holds: boolean; note: string }>(
            `Row "${v.row}" was classified implemented with evidence: ${v.evidence}. Open the cited paths under omega-baseline/omega-final and confirm real runtime code (not just types or docs) exists. Reply holds=true only if you saw the code yourself.`,
          );
          return verdict.holds
            ? v
            : { row: v.row, status: "partial" as const, evidence: v.evidence, note: `implementation claim unconfirmed: ${verdict.note}` };
        }),
    );
    const others = audit.verdicts.filter((v) => v.status !== "implemented");
    report({ section: s.name, rows: confirmedImpl.length + others.length, gaps: audit.gaps.length });
    return { section: s.name, verdicts: confirmedImpl.concat(others), gaps: audit.gaps };
  }),
);

phase("Compose the boundary audit report")
const synthesizer = agent("synthesizer", {
  system: "You write the Ω core-vs-plugin boundary audit report from the section audits you are given. Read-only. Do not add verdicts of your own; judge only what the audits support.",
});
const reportMd = await synthesizer.ask<string>(
  `Write the boundary audit report for the project owner in markdown. Sections: 1) one-paragraph verdict on how well the implementation matches the responsibility matrix; 2) per-section tables of row verdicts with evidence paths; 3) the rows that would mislead someone if trusted as-is (unconfirmed implemented claims, surprising verdicts); 4) what could not be checked. Section audits:\n${JSON.stringify(audits)}`,
);
await artifact.markdown("report", reportMd, {
  title: "Ω boundary audit report",
  description: "Where the core-vs-plugin boundary actually stands: every responsibility row classified against the real implementation, with implemented claims independently confirmed.",
  primary: true,
});

const gapRows = audits.flatMap((a) => a.verdicts.filter((v) => v.status !== "implemented"));
return {
  conclusion: `Audited ${audits.length} section(s): ${gapRows.filter((v) => v.status === "missing").length} missing, ${gapRows.filter((v) => v.status === "partial").length} partial, ${gapRows.filter((v) => v.status === "doc-only").length} doc-only responsibilities.`,
  findings: gapRows.map((v) => ({
    where: v.evidence || v.row,
    what: `${v.row}: ${v.status}${v.note ? ` — ${v.note}` : ""}`,
    evidence: v.evidence || "no implementation path found",
    status: v.note.startsWith("implementation claim unconfirmed") ? ("verified" as const) : ("unconfirmed" as const),
    severity: v.status === "doc-only" ? ("low" as const) : ("medium" as const),
  })),
  verified: [
    "every claimed-implemented row was re-checked by a fresh reader that opened the cited code",
  ],
  notCovered: [
    "missing/partial/doc-only classifications come from one auditor each and were not independently re-checked",
  ],
};