/* zcode-workflow
description: "Decision packager: takes an open question or a blocked corridor, extracts the governing records and the frozen constraints, falsifies every claim that an option is blocked, adversarially challenges the survivor, and emits a D-record-ready packet with severity, evidence, alternatives, rollback and revisit condition. It does not decide — it makes the decision cheap and unfalsifiable-in-error."
whenToUse: "When work is blocked on an OPEN SUB-FORK or an undecided question rather than on code — the case gap G-03 was filed for. SF2 (snapshot bytes) is the first user. Not for ranking options you already have a decision on, and not for implementation."
args:
  question:
    type: string
    description: "The open question, or the gap-id / lane it came from. Cite the record if there is one."
    required: true
  scope:
    type: string
    default: ""
    description: "Optional: extra paths the scout must read (e.g. the frozen catalog or a decision record)."
*/
interface Constraint {
  /** Workspace-relative path of the record or rule that constrains the question. */
  path: string;
  /** One line: the line number(s) if known, quoting what it says. */
  cite: string;
  /** One sentence: the rule, stated so a later reader can check it without opening the file. */
  rule: string;
}

interface Option {
  /** Short name of a candidate resolution. */
  name: string;
  /** One sentence: what would be decided or built. */
  proposal: string;
  /** The frozen rule this option is claimed to violate, if any. */
  claimedBlocker: string;
}

interface Falsification {
  /** Option name this verdict is about. */
  option: string;
  /** "upheld" when the claimed blocker is real; "refuted" when the option is actually available; "unknown" when the path could not be opened. */
  verdict: "upheld" | "refuted" | "unknown";
  /** What the agent actually read: path:line and the text found. */
  evidence: string;
  /** One sentence: what this means for the decision. */
  consequence: string;
}

interface Challenge {
  /** What a challenger claims would go wrong with the leading option. */
  objection: string;
  /** The evidence behind it, with a path:line. */
  evidence: string;
  /** "high" when the objection would change the decision. */
  severity: "low" | "medium" | "high";
}

interface Finding {
  /** Workspace-relative path:line, or the gap/decision id. */
  where: string;
  /** One sentence: what was found. */
  what: string;
  /** What showed it. */
  evidence: string;
  /** "verified" when a separate subagent or a command confirmed it; "unconfirmed" otherwise. */
  status: "verified" | "unconfirmed";
  /** How much it matters. */
  severity: "low" | "medium" | "high";
}

interface WorkflowReport {
  /** Two or three sentences: is this question actually blocked, and on what. */
  conclusion: string;
  findings: Finding[];
  /** What the run checked and how. */
  verified: string[];
  /** What the run did not look at, and why. */
  notCovered: string[];
}

const question = String(args.question);
const extraScope = String(args.scope ?? "").trim();

artifact.table("options", {
  title: "Candidate resolutions — do the claimed blockers hold?",
  key: "option",
  columns: [
    { field: "option", label: "Option" },
    { field: "verdict", label: "Blocker holds?" },
    { field: "what", label: "What it means" },
  ],
});

phase("Extract the governing records and the constraints they impose");
const scouting = await agent("constraint scout", {
  system:
    "You read a corpus and report what constrains a question. You are read-only. You cite " +
    "path:line for every claim and you never assert a rule you did not open and read. Where " +
    "the corpus is silent you say it is silent — that is a result, not a failure. If your " +
    "instructions and the files contradict each other, say so plainly.",
}).ask<{ constraints: Constraint[]; options: Option[]; corpusSilent: string }>(
  `Question to unblock: ${question}\n\n` +
    (extraScope ? `Additional paths to read: ${extraScope}\n\n` : "") +
    `The substrate lives in omega-baseline/omega-final. Its authority is: ratified records in\n` +
    `omega-baseline/omega-final/docs/decisions/ (D-NNN), the frozen op catalog at\n` +
    `omega-baseline/omega-final/packs/builder/contract/forge-ops.md, the gate that enforces the\n` +
    `boundary (omega-baseline/omega-final/tooling/gates/forge-surface.ts) and the host LOC wall\n` +
    `(omega-baseline/omega-final/tooling/gates/gate.ts). The project's own gap ledger is at\n` +
    `.zcode/board/GAP-LEDGER.md and its decision ledger at .zcode/board/DECISIONS.md.\n\n` +
    `Return:\n` +
    `1. constraints — every rule that bears on this question, each with its path, its line ` +
    `numbers, a short quote, and the rule in one sentence.\n` +
    `2. options — every candidate resolution the corpus supports. For each, the rule it is ` +
    `claimed to violate, or "none claimed" if no blocker is on record.\n` +
    `3. corpusSilent — what the corpus does NOT settle about this question. Be specific; this ` +
    `is often where the real work is.`,
);
const constraints = scouting.constraints ?? [];
const options = scouting.options ?? [];
log(`Found ${constraints.length} constraints and ${options.length} candidate resolutions`);
if (scouting.corpusSilent) log(`Corpus is silent on: ${clip(scouting.corpusSilent)}`);

phase("Try to break every option's claimed blocker");
const verdicts = (
  await Promise.allSettled(
    options.map((opt, i) =>
      agent(`falsifier ${i}`, {
        system:
          "You try to REFUTE a claim that an option is blocked. Read-only. The default " +
          "skeptical answer is 'the blocker is real' only if you actually opened the file and " +
          "found the rule. If the claimed blocker is softer, narrower, or does not actually " +
          "apply, say so — that is the most valuable thing you can return. If you cannot open " +
          "the path, say unknown rather than guessing.",
      }).ask<Falsification>(
        `Try to refute the claim that this option is blocked.\n\n` +
          `Question: ${question}\n` +
          `Option: ${opt.name} — ${opt.proposal}\n` +
          `Claimed blocker: ${opt.claimedBlocker}\n\n` +
          `The constraints on record:\n${constraints.map((c) => `  - ${c.path} ${c.cite}: ${c.rule}`).join("\n")}\n\n` +
          `Open the cited paths and check whether the blocker actually applies to THIS option. ` +
          `Watch for: the rule being narrower than the claim, the rule living in a file that is ` +
          `not enforced by any gate, a superseding record, and the option being achievable by a ` +
          `route nobody has written down.\n\n` +
          `Report verdict "refuted" if the option is genuinely available, "upheld" if the blocker ` +
          `is real, "unknown" if you could not open the path. Quote what you read.`,
      ),
    ),
  )
).map((settled, i) => {
  const opt = options[i];
  if (settled?.status === "fulfilled" && settled.value) return settled.value;
  return {
    option: opt?.name ?? `option-${i}`,
    verdict: "unknown" as const,
    evidence: `falsifier did not return: ${settled?.status === "rejected" ? String(settled.reason).slice(0, 160) : "no result"}`,
    consequence: "this option's blocker is untested",
  };
});

const refuted = verdicts.filter((v) => v.verdict === "refuted");
const upheld = verdicts.filter((v) => v.verdict === "upheld");
const unknown = verdicts.filter((v) => v.verdict === "unknown");
for (const v of verdicts) {
  report(
    {
      option: v.option,
      verdict: v.verdict,
      what: v.consequence,
      evidence: v.evidence,
      status: v.verdict === "unknown" ? "unconfirmed" : "verified",
      severity: v.verdict === "refuted" ? "high" : "medium",
    },
    "options",
  );
}
log(
  `${refuted.length} blocker claim(s) refuted · ${upheld.length} upheld · ${unknown.length} unknown`,
);

phase("Challenge the leading option before anyone builds on it");
const leading = (refuted[0] ?? upheld[0])?.option ?? options[0]?.name ?? "(none)";
const challenges = (
  await Promise.allSettled(
    ["cost of being wrong", "what the corpus does not rule out", "the cheapest reversible step"].map(
      (lens, i) =>
        agent(`challenger ${i}`, {
          system:
            "You argue against the leading option. Read-only. Find the objection that would " +
            "change the decision, not the stylistic nit. If the option is genuinely sound, say " +
            "so plainly rather than manufacturing an objection.",
        }).ask<Challenge>(
          `Argue against "${leading}" as the resolution to: ${question}\n\n` +
            `Your lens: ${lens}\n` +
            `Constraints on record:\n${constraints.map((c) => `  - ${c.path} ${c.cite}: ${c.rule}`).join("\n")}\n` +
            `Falsification results:\n${verdicts.map((v) => `  - ${v.option}: ${v.verdict} — ${v.evidence.slice(0, 200)}`).join("\n")}\n\n` +
            `Open the cited paths. What would go wrong, and what does the corpus leave open? ` +
            `Cite path:line.`,
        ),
    ),
)
).map((s, i) => {
  if (s?.status === "fulfilled" && s.value) return s.value;
  return {
    objection: `challenger ${i} did not return`,
    evidence: s?.status === "rejected" ? String(s.reason).slice(0, 160) : "no result",
    severity: "medium" as const,
  };
});

phase("Write the decision packet and the gap-ledger row");
const writer = await agent("packet writer", {
  system:
    "You write decision packets in this project's house style, from the supplied findings " +
    "only. You never invent evidence, never resolve an unknown into a claim, and you say so " +
    "when the corpus does not settle something. You are not deciding — you are packaging a " +
    "decision so the board can take it in one sitting.",
});
const packet = await writer.ask<string>(
  `Write a D-record-ready decision packet for the board.\n\n` +
    `QUESTION: ${question}\n\n` +
    `CONSTRAINTS ON RECORD:\n${constraints.map((c) => `  - ${c.path} ${c.cite}: ${c.rule}`).join("\n")}\n\n` +
    `CANDIDATE RESOLUTIONS:\n${options.map((o) => `  - ${o.name}: ${o.proposal}`).join("\n")}\n\n` +
    `FALSIFICATION RESULTS (which blockers actually hold):\n${verdicts.map((v) => `  - ${v.option}: ${v.verdict} — ${v.evidence}`).join("\n")}\n\n` +
    `CHALLENGES TO THE LEADING OPTION (${leading}):\n${challenges.map((c) => `  - [${c.severity}] ${c.objection} (${c.evidence})`).join("\n")}\n\n` +
    `WHERE THE CORPUS IS SILENT: ${scouting.corpusSilent}\n\n` +
    `Produce markdown with these exact sections, in this order:\n` +
    `**Decision** (one line, or "NO DECISION AVAILABLE — the blockers are not real" if that is ` +
    `what the evidence shows)\n**Severity** (S1/S2/S3 with why that severity and not the one below)\n` +
    `**Reason**\n**Evidence** (each claim with its path:line)\n**Alternatives considered** (each, ` +
    `with why it lost)\n**Rollback** (what it would take to undo)\n**Revisit if** (the condition ` +
    `that would reopen this)\n**Dissent and unknowns** (what the evidence does NOT settle)\n\n` +
    `Be honest about unknowns. A packet that says "the corpus is silent on X" is more useful than ` +
    `one that guesses.`,
);

await artifact.markdown("packet", packet, {
  title: `Decision packet — ${question.slice(0, 60)}`,
  description: `${refuted.length} blocker claim(s) refuted, ${upheld.length} upheld, ${unknown.length} unknown. Ready for the board.`,
  primary: true,
});

const findings: Finding[] = verdicts.map((v) => ({
  where: v.option,
  what: v.consequence,
  evidence: v.evidence,
  status: v.verdict === "unknown" ? ("unconfirmed" as const) : ("verified" as const),
  severity: v.verdict === "refuted" ? ("high" as const) : ("medium" as const),
}));

const isBlocked = upheld.length > 0 && refuted.length === 0;
const silentNote = scouting.corpusSilent ? `Corpus is silent on: ${clip(scouting.corpusSilent)}` : "";
return {
  conclusion: isBlocked
    ? `The question is genuinely blocked: ${upheld.length} of ${options.length} candidate resolutions collide with a frozen rule that a separate pass confirmed by opening the cited path. ${silentNote}`
    : refuted.length > 0
      ? `The question is NOT actually blocked. ${refuted.length} candidate resolution(s) survive falsification — at least one claimed blocker does not hold, so the "blocked" status was a claim nobody had checked. ${silentNote}`
      : `Nothing could be settled: ${unknown.length} of ${options.length} options could not be checked at all. The corpus could not be read, which is a different problem from a block.`,
  findings,
  verified: [
    `${constraints.length} constraints were extracted with path:line citations`,
    `${verdicts.length} candidate resolutions each got an independent attempt to refute their claimed blocker`,
    `${upheld.length} blocker claim(s) held up on re-reading the cited path; ${refuted.length} did not`,
  ],
  notCovered: [
    ...(unknown.length ? [`${unknown.length} option(s) could not be falsified: ${unknown.map((v) => v.option).join(", ")}`] : []),
    "this run does not DECIDE — it packages the decision. omega-board still settles it, and the owner may override",
    "no code was written and no gate was run; a resolution that survives here still has to be built and gated",
  ],
} satisfies WorkflowReport;

/** Keep a log line readable without pulling in a Node API. */
function clip(s: string): string {
  return s.length > 220 ? `${s.slice(0, 220)}…` : s;
}
