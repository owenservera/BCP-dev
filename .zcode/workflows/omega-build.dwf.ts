/* zcode-workflow
description: "Implementation corridor for the Ω core: plan from the real code,
  fresh-eyes plan review (up to 3 rounds), one builder implements, the Ω gates
  run deterministically (omega:test, then omega:quick), and a verifier checks
  every plan step landed."
whenToUse: For any bounded implementation task in omega-baseline/omega-final —
  the standing way to land core changes with gates.
args:
  task:
    type: string
    description: The implementation task, stated precisely, with the intended files
      or area if known.
    required: true
*/
/**
 * True when the command actually did the work, as opposed to exiting 0 without
 * running anything. `bun` prints its usage banner and still exits 0 when the argv
 * it was handed does not name a script it can resolve, so exit code alone cannot
 * tell "the gate passed" from "the gate never ran" — that is a green claim from a
 * check that cannot fail.
 */
function executed(r: { stdout: string; stderr: string }): boolean {
  return !(r.stdout.includes("Usage: bun run") || r.stderr.includes("Usage: bun run"));
}

interface PlanStep {
  /** One bounded step. */
  step: string;
  /** Files it touches, workspace-relative. */
  files: string[];
}
interface Plan {
  /** One sentence: the approach. */
  approach: string;
  steps: PlanStep[];
  risks: string[];
}
interface PlanReview {
  approve: boolean;
  /** What would break or is missing; empty when approving. */
  findings: string[];
}
interface BuildResult {
  /** Steps fully implemented. */
  done: string[];
  /** Steps deliberately not done, with reason. */
  skipped: string[];
  notes: string;
}
interface StepVerdict {
  /** The plan step. */
  step: string;
  /** Did the change land and look correct? */
  landed: boolean;
  /** One sentence of evidence: file:line or command output. */
  note: string;
}

const task = String(args.task ?? "").trim();
if (!task) throw new Error("args.task is required: state the implementation task precisely.");

phase("Plan the change from the real code")
const planner = agent("planner", {
  system: "You plan one bounded implementation task for the VIVIM Ω core in omega-baseline/omega-final. Read the code the task touches before planning; never plan from names alone. Read-only: do not edit anything. Keep the plan small enough for one builder session.",
});
let plan = await planner.ask<Plan>(
  `Task: ${task}\n\nRead the Ω code around what the task touches, then return a bounded Plan with concrete steps and the exact files each step touches. If the task conflicts with omega-baseline/omega-final/docs/decisions/CURRENT-INVARIANTS.md, say so in risks instead of planning around it silently.`,
);

phase("Fresh-eyes review of the plan")
const reviewer = agent("plan-reviewer", {
  system: "You review an implementation plan against the actual code with fresh eyes: read the files the plan touches, find what would break and what is missing, and approve only when the plan would land the change correctly. Read-only: do not edit anything.",
});
let feedback = "none yet";
let approved = false;
for (let round = 1; round <= 3; round += 1) {
  const review = await reviewer.ask<PlanReview>(
    `Plan (round ${round} of 3): ${JSON.stringify(plan)}\nPrevious feedback: ${feedback}\nFind what would break and what is missing. Approve only if the plan is sound against the real code.`,
  );
  if (review.approve) {
    approved = true;
    break;
  }
  feedback = review.findings.join("; ");
  plan = await planner.ask<Plan>(`The reviewer found: ${feedback}\nRevise the plan to address it.`);
}

phase("Implement the approved plan")
const builder = agent("builder", {
  system: "You implement the approved plan in the VIVIM Ω core. Edit only the files the plan names; match the repository's existing code style. When done, every plan step must be either done or explicitly skipped in your result. If the task proves impossible as planned, say so in notes instead of improvising a different task.",
});
const built = await builder.ask<BuildResult>(
  `Approved plan: ${JSON.stringify(plan)}\nImplement every step now.${
    approved ? "" : " No reviewer approved this plan within 3 rounds; implement the best revision and say so in notes."
  }`,
);

phase("Run the Ω gates")
const unit = await world.run("bun", ["run", "--cwd", "omega-baseline/omega-final", "omega:test"], { timeoutMs: 1200000 });
if (!executed(unit)) {
  // No failures to fix — the command never ran. Sending a fixer after a phantom
  // failure would have it "repair" working code to satisfy output that was never produced.
  log("omega:test did not execute: the gate command printed bun's usage and exited 0. The suite is recorded as NOT RUN, not green.");
} else if (unit.exitCode !== 0) {
  const fixer = agent("gate-fixer", {
    system: "You fix failing Ω tests without expanding the task's scope. Edit only files the plan touches. If a failure predates the change, say so instead of fixing unrelated code.",
  });
  await fixer.ask(`omega:test failed:\n${unit.stderr.slice(-8000)}\nThe plan was: ${JSON.stringify(plan)}\nFix the failures.`);
}
const gate = await world.run("bun", ["run", "--cwd", "omega-baseline/omega-final", "omega:quick"], { timeoutMs: 1200000 });

phase("Verify the build against the plan")
const changed = await git.changedFiles();
const verifier = agent("verifier", {
  system: "You verify a finished implementation against its plan by reading the changed code yourself. Read-only for code; read-only git commands are allowed. Do not edit anything.",
});
const verdicts = await verifier.ask<StepVerdict[]>(
  `Plan: ${JSON.stringify(plan)}\nChanged files: ${JSON.stringify(changed)}\nBuilder report: ${JSON.stringify(built)}\nRead the changes and return one StepVerdict per plan step: did it land, and is it correct? Also flag any edit outside the plan's file list.`,
);

const unitGreen = unit.exitCode === 0 && executed(unit);
const gateGreen = unitGreen && gate.exitCode === 0 && executed(gate);
const failed = verdicts.filter((v) => !v.landed);
const reportMd = [
  `# Ω build corridor: ${task}`,
  "",
  `**Approach:** ${plan.approach}`,
  `**Gates:** omega:test ${unitGreen ? "green" : "red"}, omega:quick ${gateGreen ? "green" : "red"}`,
  "",
  "## Step verdicts",
  ...verdicts.map((v) => `- ${v.landed ? "✅" : "❌"} ${v.step} — ${v.note}`),
  "",
  "## Builder notes",
  built.notes,
].join("\n");
await artifact.markdown("report", reportMd, {
  title: "Ω build report",
  description: "What was implemented, the gate results, and each plan step's verification.",
  primary: true,
});

return {
  conclusion: `${built.done.length} of ${plan.steps.length} plan steps landed; gates ${gateGreen ? "green" : "red"} (omega:test, omega:quick); ${failed.length} step(s) not landed.`,
  findings: failed.map((v) => ({
    where: "see the build report artifact",
    what: `Step not landed: ${v.step} — ${v.note}`,
    evidence: v.note,
    status: "verified" as const,
    severity: "high" as const,
  })),
  verified: [
    `omega:test ran after implementation (exit ${unit.exitCode}, output showed the suite actually executed: ${executed(unit)})`,
    `omega:quick ran after implementation (exit ${gate.exitCode}, output showed the gate actually executed: ${executed(gate)})`,
    "each plan step was checked by a verifier reading the changed code",
  ],
  notCovered: built
    .skipped
    .concat(approved ? [] : ["the plan never received an approving review"])
    .concat(executed(unit) && executed(gate) ? [] : ["a gate reported exit 0 without executing — the argv it was given did not name a runnable script"]),
};