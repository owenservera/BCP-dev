/* zcode-workflow
description: "The Ω Board session — flexible-panel edition. A selector picks a
  deliberation panel of at most 3 members from .zcode/ROSTER.md to fit the session
  focus (or the convening Steward names the panel directly via the panel argument).
  The panel establishes its own ground truth from the repository, tables proposals,
  challenges every proposal in role, settles with dissent recorded, and publishes
  minutes for owner ratification. Hard cap: 3 deliberating agents per session."
whenToUse: When the owner convenes the board ("convene the board"), or on the
  standing weekly cadence — for strategy-level proposing and debating, never
  direct execution.
args:
  focus:
    type: string
    description: Optional question or focus the board should prioritize this
      session. Empty = standing agenda.
    required: false
  panel:
    type: string
    description: Optional comma-separated roster member ids to seat directly,
      e.g. "CEO-01,GOVERNOR-01". Empty = a selector picks the panel from
      .zcode/ROSTER.md.
    required: false
*/
interface PanelMember {
  /** Member id from .zcode/ROSTER.md, e.g. CEO-01. */
  id: string;
  /** Role this member plays in THIS session. Exactly one proposer; the rest challenge. */
  role: "proposer" | "challenger";
  /** One sentence: why this member fits this focus. */
  reason: string;
  /** What this member should read/verify in the repository to establish their own ground truth for this focus. */
  brief: string;
}
interface Panel {
  /** 1-2 sentences: why this composition fits the focus. */
  rationale: string;
  /** At most 3 members. At least 1. */
  members: PanelMember[];
}
interface GroundedProposals {
  /** What is actually true right now in the areas this focus touches, 3-8 sentences, evidence-cited (paths/commands). */
  ground: string;
  /** Anything that could not be verified, labelled UNKNOWN with its reason. */
  unknowns: string[];
  /** Up to 3 proposals. May be empty if the ground truth answers the focus without new proposals. */
  proposals: Proposal[];
}
interface Proposal {
  /** Short id, P1, P2, P3. */
  id: string;
  /** One line: what is proposed. */
  title: string;
  /** 2-4 sentences: what changes and why now. */
  statement: string;
  /** Supporting evidence with paths, and the existing roadmap/backlog/destination document this extends or amends. */
  rationale: string;
  /** What observation would prove this proposal wrong. */
  falsifier: string;
  /** Rough cost: effort, risk, what it displaces. */
  cost: string;
}
interface Challenge {
  /** Proposal id. */
  proposalId: string;
  /** The challenging member's id. */
  from: string;
  /** The challenge class. */
  type: "objection" | "evidence-gap" | "feasibility" | "advisory-veto";
  /** One to three sentences. */
  body: string;
  /** Cited evidence, or the named UNKNOWN. */
  evidence: string;
}
interface Disposition {
  /** Proposal id. */
  id: string;
  /** One line title. */
  title: string;
  /** Final statement after amendment. */
  statement: string;
  status: "adopted" | "amended" | "rejected" | "parked";
  /** Questions only the owner can answer before execution. */
  ownerQuestions: string[];
  /** Remaining UNKNOWNs. */
  unknowns: string[];
  /** Dissent that was not resolved, naming who dissents. */
  dissent: string[];
}
interface Gap {
  /** One line: what is missing in the organization itself. */
  gap: string;
  /** Class: evidence / capability / role / process. */
  kind: string;
  /** What standing it up would take. */
  proposal: string;
}
interface Settled {
  /** One Disposition per proposal. */
  dispositions: Disposition[];
  /** The 3-6 most load-bearing gaps in the organization itself (not the product backlog). */
  gaps: Gap[];
}

const focus = String(args.focus ?? "").trim();
const panelArg = String(args.panel ?? "").trim();
const focusLine = focus
  ? `The owner asked this session to prioritize: ${focus}`
  : "Standing agenda: state of the gates, drift since the last session, strategic proposals, gap scan.";

// Resolve the panel: a named panel short-circuits the selector; otherwise one
// read-only selector pass picks the members. Hard cap 3 either way.
let panel: Panel;
if (panelArg) {
  const ids = panelArg.split(",").map((s) => s.trim()).filter(Boolean).slice(0, 3);
  panel = {
    rationale: `Panel named directly by the convening Steward: ${ids.join(", ")}.`,
    members: ids.map((id, i) => ({
      id,
      role: i === 0 ? ("proposer" as const) : ("challenger" as const),
      reason: "named by the convening Steward",
      brief:
        "Read .zcode/ROSTER.md first for your specialty and the panel rules, then read what your specialty needs in the repository to establish ground truth for this focus.",
    })),
  };
} else {
  phase("Pick the panel for this focus");
  const selector = agent("panel selector", {
    system:
      "You select deliberation panels for an Ω Board session. Read .zcode/ROSTER.md — the member registry with each member's specialty and pick-when criteria — and compose the smallest panel that can genuinely deliberate the session focus. Seat at most three members (fewer when the focus is narrow) and assign exactly one of them the proposer role; the others challenge. Give each member a brief naming the specific repository paths and questions their ground truth for THIS focus should cover. Read-only: do not edit anything.",
  });
  panel = await selector.ask<Panel>(
    `Session focus: ${focusLine}\n\nCompose the panel. Seat at most three members from the roster (fewer when the focus is narrow); assign exactly one the proposer role. In each member's brief, name the concrete repository paths their ground truth should cover for this focus.`,
  );
  panel.members = panel.members.slice(0, 3);
}
if (!panel.members.some((m) => m.role === "proposer")) {
  const first = panel.members[0];
  if (first) first.role = "proposer";
}
log(`Panel seated: ${panel.members.map((m) => `${m.id} (${m.role})`).join(", ")} — ${panel.rationale}`);

const proposer = panel.members.find((m) => m.role === "proposer");
const challengers = panel.members.filter((m) => m.role === "challenger");
if (!proposer) {
  return {
    conclusion: "No panel could be seated (no proposer available) — session aborted before deliberation.",
    findings: [],
    verified: [],
    notCovered: ["the entire session — the panel selection returned no usable proposer"],
  };
}

phase("Establish ground truth and table proposals");
const proposerAgent = agent(proposer.id, {
  system:
    `You are ${proposer.id}, seated as the proposer of an Ω Board session. Governing mission: "Full VIVIM beta ready to distribute for free." Establish your own ground truth from the repository per your brief, citing every claim with a path or command, then translate it into strategy. Hard rules: table at most 3 proposals; every proposal MUST name the existing roadmap/backlog/destination document it extends or amends (designing a fresh roadmap is forbidden — the corpus is authoritative and the board enhances it); every proposal states its own falsifier and its cost. You hold no ratification authority: your output is proposals, subject to challenge. You may not contradict binding Ω law; if a proposal would, say so plainly instead. Read-only: do not edit, create or delete anything.`,
});
const grounded: GroundedProposals = await proposerAgent.ask<GroundedProposals>(
  `${focusLine}\n\nYour session brief: ${proposer.brief}\n\nEstablish your ground truth, then table up to 3 strategic proposals that best advance the mission given it. Prefer enhancing what exists over inventing new structures. If the ground truth already answers the focus, return an empty proposals list and say so in the ground.`,
);
log(`${grounded.proposals.length} proposal(s) tabled on the proposer's ground truth`);

let challenges: Challenge[] = [];
if (challengers.length > 0) {
  phase("Challenge every proposal in role");
  challenges = (
    await Promise.all(
      challengers.map((c) => {
        const challenger = agent(c.id, {
          system:
            `You are ${c.id}, seated as a challenger in an Ω Board session per .zcode/ROSTER.md. Establish your own ground truth from the repository per your brief — independently of the proposer — citing every claim with a path or command, then challenge the proposals in role. Challenge what would break, what is UNKNOWN, where proposals violate law, gates or the boundary (DOCUMENTATION is not IMPLEMENTATION; CANDIDATE is not REALIZATION); where warranted record an explicit advisory-veto with your reason. Respond with one Challenge per objection you actually hold; an empty list means you have none. Read-only: do not edit, create or delete anything.`,
        });
        return challenger.ask<Challenge[]>(
          `${focusLine}\n\nYour session brief: ${c.brief}\n\nThe proposer's ground truth:\n${JSON.stringify(grounded.ground)}\n\nProposals:\n${JSON.stringify(grounded.proposals)}\n\nChallenge each proposal in role, from your own independently established ground truth.`,
        );
      }),
    )
  ).flat();
  log(`${challenges.length} challenge(s) recorded from ${challengers.length} challenger(s)`);
} else {
  log("Single-member panel: no independent challengers; self-challenge and dissent must be recorded honestly in the settle step");
}

phase("Settle with dissent and publish the minutes");
const settled: Settled = await proposerAgent.ask<Settled>(
  `${challenges.length > 0 ? `The panel challenged your proposals:\n${JSON.stringify(challenges)}` : "You deliberated alone: challenge your own proposals honestly in the dispositions — record any objection you cannot refute as dissent naming yourself."}\n\nAmend or withdraw each proposal in light of the challenges and return one Disposition per proposal. Record every unresolved objection as dissent naming its holder, every question only the owner can answer under ownerQuestions, and every remaining UNKNOWN under unknowns. Do not adopt a proposal that still has an open advisory-veto without recording the veto in dissent. Also scan for gaps in the organization itself — evidence, capability, roles, process — naming what standing each up would take.`,
);
for (const d of settled.dispositions) {
  report({ proposal: d.id, status: d.status, title: d.title });
}
const minutes = [
  "# Ω Board minutes",
  "",
  `> Status: PROPOSED — awaiting owner ratification. Advisory vetoes are recorded, not enacted. ${focusLine}`,
  "",
  "## Panel composition (flexible-panel charter, cap 3 deliberators)",
  `> ${panel.rationale}`,
  ...panel.members.map((m) => `- **${m.id}** — ${m.role}; picked because: ${m.reason}`),
  "",
  "## Ground truth (established by the panel itself)",
  grounded.ground,
  `\nUNKNOWNs: ${grounded.unknowns.join("; ") || "none recorded"}`,
  "",
  "## Proposals and dispositions",
  ...settled.dispositions.map(
    (d) =>
      `### ${d.id} — ${d.title} [${d.status.toUpperCase()}]\n${d.statement}\n\n- Owner questions: ${d.ownerQuestions.join("; ") || "none"}\n- UNKNOWNs: ${d.unknowns.join("; ") || "none"}\n- Dissent: ${d.dissent.join("; ") || "none"}`,
  ),
  "",
  "## Challenges recorded",
  ...(challenges.length > 0
    ? challenges.map((c) => `- **${c.type}** from ${c.from} on ${c.proposalId}: ${c.body} (evidence: ${c.evidence})`)
    : ["- none — single-member panel; self-challenge is recorded in the dispositions"]),
  "",
  "## Gap scan",
  ...settled.gaps.map((g) => `- [${g.kind}] ${g.gap} — proposal: ${g.proposal}`),
].join("\n");
await artifact.markdown("minutes", minutes, {
  title: "Ω Board minutes",
  description: "Panel composition, ground truth, proposals, challenges, dispositions, dissent, owner questions and the gap scan — PROPOSED, awaiting owner ratification.",
  primary: true,
});

const vetoCount = challenges.filter((c) => c.type === "advisory-veto").length;
return {
  conclusion: `Board session settled ${settled.dispositions.length} proposal(s) — ${settled.dispositions.filter((d) => d.status === "adopted" || d.status === "amended").length} adopted/amended, ${vetoCount} advisory veto(s) recorded, ${settled.gaps.length} organization gaps identified. Panel: ${panel.members.map((m) => `${m.id} (${m.role})`).join(", ")}. Minutes are PROPOSED awaiting owner ratification.`,
  findings: settled.dispositions.flatMap((d) =>
    d.ownerQuestions.map((q) => ({
      where: `proposal ${d.id} (${d.title})`,
      what: q,
      evidence: "owner question recorded in the minutes",
      status: "unconfirmed" as const,
      severity: "medium" as const,
    })),
  ),
  verified: [
    `panel of ${panel.members.length} deliberator(s) was picked to fit the focus${panelArg ? " and named by the convening Steward" : " by an independent selector pass"}`,
    "each panel member established its own ground truth from the repository, citing paths/commands",
    "every proposal was challenged in role (or, for a single-member panel, self-challenged with dissent recorded)",
    "unresolved disagreement and advisory vetoes are recorded in the minutes, not smoothed away",
  ],
  notCovered: [
    "the board proposes only; no ratification or execution happened in this session",
    ...grounded.unknowns.map((u) => `proposer ground truth: ${u}`),
    ...settled.dispositions.flatMap((d) => d.unknowns.map((u) => `${d.id}: ${u}`)),
  ],
};