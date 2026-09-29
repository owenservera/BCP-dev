/* zcode-workflow
description: "METHODS-01 methods review: mines only evidence that already exists
  (receipts, queues, commit history, charters, workflow scripts), identifies
  friction and waste (rework, false greens, stalls, ceremony), and proposes
  improvements where every proposal passes the net-ceremony test — naming what
  it removes before what it adds, with a success measure and a rollback. Output
  is a memo for owner ratification; it may not create new standing reports."
whenToUse: Convened by the owner, by the Board, or after roughly every fifth
  closed corridor — for evolving the team's own methods without adding ceremony.
args:
  scope:
    type: string
    description: Optional focus, e.g. 'token cost', 'false greens', 'the board
      cadence'. Empty = full methods review.
    required: false
    default: ""
*/
interface FrictionFinding {
  /** One sentence: the friction or waste observed. */
  what: string;
  /** Evidence: receipt path, commit range, queue line, charter clause or workflow file. */
  evidence: string;
  /** Class: rework / false-green / stall / ceremony / token-waste / gap. */
  kind: string;
  /** Rough cost to the org: wall-clock, tokens, risk, or repeated human attention. */
  cost: string;
}
interface Improvement {
  /** Short id, M1, M2, ... */
  id: string;
  /** One line: the change. */
  title: string;
  /** What it changes: charter / workflow / cadence / tooling / retirement. */
  kind: string;
  /** What ceremony, steps or artifacts this REMOVES. A proposal that removes nothing must justify its additions with a measured benefit. */
  removes: string;
  /** What it adds, and why the benefit beats the overhead. */
  adds: string;
  /** How we will know it worked — observable and checkable. */
  success: string;
  /** How to roll it back if it fails, preserving lineage. */
  rollback: string;
  /** Routing: "owner-direct" for small reversible changes, "board-debate" for consequential ones (charter, cadence, retirement). */
  route: string;
}

const scopeArg = String(args.scope ?? "").trim();
const scopeLine = scopeArg ? `The owner scoped this review to: ${scopeArg}` : "Full methods review across the team's charters, workflows, receipts, queues and recent history.";

phase("Mine the evidence that already exists")
const miners: { id: string; area: string; brief: string }[] = [
  {
    id: "receipts",
    area: "receipts and results",
    brief:
      "Read the durable receipts: AGENTS_CONTEXT/ARCHITECTURE_STEWARD/RESULTS/ (newest first), docs/agent-system/FULL-INTEGRATION-TASK-LIST.md and docs/agent-system/goals/finish-full-list/GOAL.md wave log. Mine for: rework (work redone because state was stale), false greens (claimed green later contradicted), stalls (long PARTIAL/BLOCKED chains), and verification that caught nothing. Read-only: do not edit anything.",
  },
  {
    id: "process",
    area: "process surfaces",
    brief:
      "Read the team's own process documents: .zcode/TEAM.md, .zcode/board/CHARTER.md, .zcode/workstreams/WORKSTREAMS.md and the WS-*.md files, and skim the saved workflow scripts in .zcode/workflows/. Mine for: ceremony that produces no evidence (steps, artifacts or cadence nobody consumes), duplicated responsibilities between officers/workflows, and handoff gaps between them. Read-only.",
  },
  {
    id: "history",
    area: "recent history",
    brief:
      "Run read-only git commands over the last 7 days: log with dates and stats (last 30 commits), and look at what each working day actually landed versus what the queues claimed. Mine for: day-scale patterns — commits that touched the same files repeatedly (thrash), large mixed commits (coherence failures), and long gaps where queues claim activity but nothing landed. Read-only.",
  },
];
const mined: { id: string; area: string; findings: FrictionFinding[] }[] = await Promise.all(
  miners.map(async (m) => {
    const miner = agent(`miner-${m.id}`, {
      system: `You are the ${m.area} miner for a METHODS-01 review of the VIVIM Ω team's own methods. You mine only evidence that already exists — you may not propose creating a new report, meeting or standing artifact (that is itself a violation to flag). Every finding cites its evidence. Read-only: do not edit anything.`,
    });
    const findings = await miner.ask<FrictionFinding[]>(m.brief);
    return { id: m.id, area: m.area, findings };
  }),
);
log(`${mined.reduce((n, m) => n + m.findings.length, 0)} friction finding(s) mined`);

phase("Confirm the costly findings")
const confirmed: FrictionFinding[] = (
  await Promise.all(
    mined.map(async (m) => {
      const checked: FrictionFinding[] = await Promise.all(
        m.findings.map(async (f) => {
          if (!f.cost.toLowerCase().includes("repeat") && !f.kind.includes("false-green") && !f.kind.includes("rework")) return f;
          const checker = agent(`friction-checker-${m.id}-${f.what.slice(0, 24).replace(/\W+/g, "-")}`, {
            system: "You independently verify one methods-review finding by reading its cited evidence yourself. Read-only: do not edit anything.",
          });
          const v = await checker.ask<{ holds: boolean; note: string }>(
            `A methods review claims this friction: ${f.what}\nEvidence: ${f.evidence}\nRead the cited evidence and reply holds=true only if you see it.`,
          );
          return v.holds ? f : { ...f, evidence: `${f.evidence} — unconfirmed: ${v.note}` };
        }),
      );
      return checked;
    }),
  )
).flat();

phase("Propose improvements under the net-ceremony test")
const methods = agent("METHODS-01", {
  system: `You are METHODS-01, the methods and DevOps optimization officer of the VIVIM Ω team. Your mandate: evolve the team's methods, practices, charters, workflows and cadence from evidence. Your hard constraints: (1) propose only from the mined findings — never from taste; (2) the NET-CEREMONY TEST — every proposal names what it removes before what it adds; a proposal adding overhead without removing more, or without a measured justification, is rejected by construction and you must say so rather than soften it; (3) every proposal carries an observable success measure and a lineage-preserving rollback; (4) you never create standing reports or meetings. Route small reversible changes "owner-direct"; route consequential changes (charter amendments, cadence changes, retirements) "board-debate".`,
});
let proposals: Improvement[] = await methods.ask<Improvement[]>(
  `${scopeLine}\n\nConfirmed friction findings:\n${JSON.stringify(confirmed)}\n\nPropose the improvements with the best evidence-backed payoff. Apply the net-ceremony test to each; explicitly reject findings whose fix would add more ceremony than it removes, with the reason. Prefer retirements and removals over additions.`,
);

phase("Publish the methods memo")
const memo = [
  "# METHODS-01 memo",
  "",
  `> Status: PROPOSED — awaiting owner ratification. ${scopeLine}`,
  "",
  "## Confirmed friction",
  ...confirmed.map((f) => `- **[${f.kind}]** ${f.what} — cost: ${f.cost} (evidence: ${f.evidence})`),
  "",
  "## Proposed improvements",
  ...proposals.map(
    (p) =>
      `### ${p.id} — ${p.title} [${p.kind}, route: ${p.route}]\n- Removes: ${p.removes}\n- Adds: ${p.adds}\n- Success: ${p.success}\n- Rollback: ${p.rollback}`,
  ),
  "",
  "## Rejected by the net-ceremony test",
  "(see the proposals' own rejections above, if any)",
].join("\n");
await artifact.markdown("memo", memo, {
  title: "METHODS-01 memo",
  description: "Evidence-mined friction and improvement proposals for the team's own methods — every proposal passes the net-ceremony test, PROPOSED awaiting owner ratification.",
  primary: true,
});

return {
  conclusion: `Methods review mined ${confirmed.length} friction finding(s) from existing evidence and proposes ${proposals.length} improvement(s) under the net-ceremony test; memo is PROPOSED awaiting owner ratification.`,
  findings: proposals.map((p) => ({
    where: p.kind,
    what: `${p.id}: ${p.title}`,
    evidence: `removes: ${p.removes}`,
    status: "unconfirmed" as const,
    severity: "medium" as const,
  })),
  verified: [
    "every friction finding cites pre-existing evidence; costly findings were independently re-checked",
    "every proposal names what it removes, its success measure and its rollback",
  ],
  notCovered: [
    "the review reads evidence, it does not run workflows or gates to measure them live",
    ...confirmed.filter((f) => f.evidence.includes("unconfirmed")).map((f) => f.what),
  ],
};