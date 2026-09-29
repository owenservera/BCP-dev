/* zcode-workflow
description: "The Ω Board session: establishes ground truth from the repository,
  the CEO tables up to 3 strategic proposals (each extending an existing roadmap
  document), the Governor/Research/Delivery officers challenge every proposal,
  the CEO amends and settles with dissent recorded, and the session closes with
  a gap scan and publishes minutes for owner ratification."
whenToUse: When the owner convenes the board ("convene the board"), or on the
  standing weekly cadence — for strategy-level proposing and debating, never
  direct execution.
args:
  focus:
    type: string
    description: Optional question or focus the board should prioritize this
      session. Empty = standing agenda.
    required: false
*/
interface Posture {
  /** What is actually true right now in this domain, 3-6 sentences, evidence-cited. */
  state: string;
  /** Top open items in this domain. */
  concerns: string[];
  /** Anything that could not be verified, labelled UNKNOWN with its reason. */
  unknowns: string[];
}
interface Proposal {
  /** Short id, P1, P2, P3. */
  id: string;
  /** One line: what is proposed. */
  title: string;
  /** 2-4 sentences: what changes and why now. */
  statement: string;
  /** Supporting evidence, with paths, and the existing roadmap/backlog document this extends or amends. */
  rationale: string;
  /** What observation would prove this proposal wrong. */
  falsifier: string;
  /** Rough cost: effort, risk, what it displaces. */
  cost: string;
}
interface Challenge {
  /** Proposal id. */
  proposalId: string;
  /** The challenging officer: Governor / Research / Delivery. */
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
  /** One line: what is missing. */
  gap: string;
  /** Class: evidence / capability / role / process. */
  kind: string;
  /** What standing it up would take. */
  proposal: string;
}

const focus = String(args.focus ?? "").trim();
const focusLine = focus ? `The owner asked this session to prioritize: ${focus}` : "Standing agenda: state of the gates, drift since the last session, strategic proposals, gap scan.";

phase("Establish the shared ground truth")
const lenses: { id: string; area: string; brief: string }[] = [
  {
    id: "law-gates",
    area: "law and gates",
    brief:
      "Read omega-baseline/omega-final/docs/decisions/CURRENT-INVARIANTS.md, omega-baseline/omega-final/docs/BUILD-DECISIONS.md and docs/decisions/OPEN-QUESTIONS.md under omega-baseline/omega-final/docs/decisions/. Report which decisions are binding, which gates are red (run `bun --cwd omega-baseline/omega-final run omega:quick` if useful, read-only), and where the decision corpus contradicts itself. Read-only: do not edit anything.",
  },
  {
    id: "roadmap",
    area: "roadmap and backlog",
    brief:
      "Read omega-baseline/omega-final/docs/forge/BACKLOG.md and omega-baseline/omega-final/docs/decisions/D-410-*.md (the authoritative sequencing per ROADMAP.md:8), plus docs/destination/DESTINATION-MASTER-MAP.md and docs/destination/MATURITY-AND-GAPS.md. Note that omega-baseline/omega-final/docs/ROADMAP.md is superseded by its own line 8 — use it only for history. Report what the current plan corpus actually says is next, and where it is silent. Read-only.",
  },
  {
    id: "delivery",
    area: "delivery and queues",
    brief:
      "Read AGENTS_CONTEXT/ARCHITECTURE_STEWARD/TASKS.md, docs/agent-system/FULL-INTEGRATION-TASK-LIST.md (if present) and run read-only git commands (status, log --oneline -15). Report what is actually in flight, what recently landed, and where queue claims contradict repository evidence. Read-only.",
  },
];
const postures: { area: string; posture: Posture }[] = await Promise.all(
  lenses.map(async (l) => {
    const gatherer = agent(`posture-${l.id}`, {
      system: `You are the evidence gatherer for the ${l.area} domain of an Ω Board session. You serve the officers, not any proposal. Cite every claim with a path or command. If a file is missing, say so. Read-only: do not edit, create or delete anything.`,
    });
    return { area: l.area, posture: await gatherer.ask<Posture>(l.brief) };
  }),
);
log(`Ground truth gathered from ${postures.length} domains`);

phase("Table the strategic proposals")
const ceo = agent("CEO-01", {
  system: `You are CEO-01, Chief Executive of the VIVIM Ω build. Governing mission: "Full VIVIM beta ready to distribute for free." You translate evidence into strategy. Hard rules: table at most 3 proposals; every proposal MUST name the existing roadmap/backlog/destination document it extends or amends (designing a fresh roadmap is forbidden — the corpus is authoritative and the board enhances it); every proposal states its own falsifier and its cost. You hold no ratification authority: your output is proposals, subject to challenge. You may not contradict binding Ω law; if a proposal would, say so plainly instead.`,
});
const proposals: Proposal[] = await ceo.ask<Proposal[]>(
  `Board session. ${focusLine}\n\nGround truth (evidence gatherers):\n${JSON.stringify(postures)}\n\nTable up to 3 strategic proposals that best advance the mission given this ground truth. Prefer enhancing what exists over inventing new structures.`,
);

phase("Challenge every proposal")
const [governorChallenges, researchChallenges, deliveryChallenges] = await Promise.all([
  agent("GOVERNOR-01", {
    system: `You are GOVERNOR-01, the Mission Governor in the Truth & Trust department. You protect the trust chain: trust belongs to a traceable chain, never to confidence, agreement or position. Challenge every proposal: what would break it, what is UNKNOWN, where it violates law, gates or the boundary (DOCUMENTATION is not IMPLEMENTATION; CANDIDATE is not REALIZATION). Where warranted, record an explicit advisory-veto with your reason. You advise; you never set product direction. Read-only.`,
  }).ask<Challenge[]>(
    `Challenge each proposal below. Respond with one Challenge per objection you actually hold; an empty list means you have none. Proposals:\n${JSON.stringify(proposals)}\n\nGround truth:\n${JSON.stringify(postures)}`,
  ),
  agent("RESEARCH-01", {
    system: `You are RESEARCH-01, director of Research & Alignment. You turn uncertainty into evidence and keep the organization aligned with reality. For each proposal: cite supporting or contradicting evidence from the repository, flag evidence-gaps (what would need to be proven before the proposal is safe), and check the proposal against the destination documents. Your findings are never authority. Read-only.`,
  }).ask<Challenge[]>(
    `Assess each proposal below for evidence support and alignment. Respond with one Challenge per substantive point; an empty list means you have none. Proposals:\n${JSON.stringify(proposals)}\n\nGround truth:\n${JSON.stringify(postures)}`,
  ),
  agent("DELIVERY-01", {
    system: `You are DELIVERY-01, director of delivery for the Ω core. You cost work honestly from actual receipts and gate status — effort, risk, what it displaces, what is already landed in that area. You may not promise unverified capability, and you flag when a proposal duplicates work the queues already record. Read-only.`,
  }).ask<Challenge[]>(
    `Cost and feasibility-check each proposal below against the delivery state. Respond with one Challenge per substantive point; an empty list means you have none. Proposals:\n${JSON.stringify(proposals)}\n\nGround truth:\n${JSON.stringify(postures)}`,
  ),
]);
const challenges: Challenge[] = [...governorChallenges, ...researchChallenges, ...deliveryChallenges];
log(`${challenges.length} challenge(s) recorded`);

phase("Amend and settle")
const dispositions: Disposition[] = await ceo.ask<Disposition[]>(
  `The officers challenged your proposals:\n${JSON.stringify(challenges)}\n\nAmend or withdraw each proposal in light of the challenges and return one Disposition per proposal. Record every unresolved objection as dissent naming its holder, every question only the owner can answer under ownerQuestions, and every remaining UNKNOWN under unknowns. Do not adopt a proposal that still has an open advisory-veto without recording the veto in dissent.`,
);

phase("Scan for gaps and publish the minutes")
const gapScan: Gap[] = await agent("gap-scanner", {
  system: "You identify what the organization is missing — evidence, capability, roles or process — from an Ω Board session's record. Concrete and small: a gap must name what standing it up would take. Read-only: do not edit anything.",
}).ask<Gap[]>(
  `From the postures, proposals, challenges and dispositions below, identify the 3-6 most load-bearing gaps in the organization itself (not the product backlog): missing evidence the board keeps needing, missing capability, missing roles, broken process. For each, say what standing it up would take.\n\nPostures:\n${JSON.stringify(postures)}\n\nProposals:\n${JSON.stringify(proposals)}\n\nChallenges:\n${JSON.stringify(challenges)}\n\nDispositions:\n${JSON.stringify(dispositions)}`,
);
const minutes = [
  "# Ω Board minutes",
  "",
  `> Status: PROPOSED — awaiting owner ratification. Advisory vetoes are recorded, not enacted. ${focusLine}`,
  "",
  "## Ground truth",
  ...postures.map((p) => `### ${p.area}\n${p.posture.state}\n\nConcerns: ${p.posture.concerns.join("; ") || "none recorded"}\nUNKNOWNs: ${p.posture.unknowns.join("; ") || "none recorded"}`),
  "",
  "## Proposals and dispositions",
  ...dispositions.map(
    (d) =>
      `### ${d.id} — ${d.title} [${d.status.toUpperCase()}]\n${d.statement}\n\n- Owner questions: ${d.ownerQuestions.join("; ") || "none"}\n- UNKNOWNs: ${d.unknowns.join("; ") || "none"}\n- Dissent: ${d.dissent.join("; ") || "none"}`,
  ),
  "",
  "## Challenges recorded",
  ...challenges.map((c) => `- **${c.type}** from ${c.from} on ${c.proposalId}: ${c.body} (evidence: ${c.evidence})`),
  "",
  "## Gap scan",
  ...gapScan.map((g) => `- [${g.kind}] ${g.gap} — proposal: ${g.proposal}`),
].join("\n");
await artifact.markdown("minutes", minutes, {
  title: "Ω Board minutes",
  description: "Strategic proposals, officer challenges, dispositions, dissent, owner questions and the gap scan — PROPOSED, awaiting owner ratification.",
  primary: true,
});

const vetoCount = challenges.filter((c) => c.type === "advisory-veto").length;
return {
  conclusion: `Board session settled ${dispositions.length} proposal(s) — ${dispositions.filter((d) => d.status === "adopted" || d.status === "amended").length} adopted/amended, ${vetoCount} advisory veto(s) recorded, ${gapScan.length} organization gaps identified. Minutes are PROPOSED awaiting owner ratification.`,
  findings: dispositions.flatMap((d) =>
    d.ownerQuestions.map((q) => ({
      where: `proposal ${d.id} (${d.title})`,
      what: q,
      evidence: "owner question recorded in the minutes",
      status: "unconfirmed" as const,
      severity: "medium" as const,
    })),
  ),
  verified: [
    "ground truth was gathered by three independent evidence gatherers citing paths and commands",
    "every proposal was challenged in role by the Governor, Research and Delivery officers",
    "unresolved disagreement and advisory vetoes are recorded in the minutes, not smoothed away",
  ],
  notCovered: [
    "the board proposes only; no ratification or execution happened in this session",
    ...postures.flatMap((p) => p.posture.unknowns.map((u) => `${p.area}: ${u}`)),
  ],
};