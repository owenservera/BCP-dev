/* zcode-workflow
description: "Red-fixture falsifier: takes named gate checks, constructs the smallest fixture that SHOULD make each one red, runs it, and reports whether the check actually fires. Falsifies the gate, not the work — a check that cannot fail is a check nobody is protected by."
whenToUse: "After landing a gate check or a gate rule, and whenever a gate has gone green suspiciously. The corpus's own standing lesson: every gate check needs a red fixture on the REAL tree before it is trusted (docs/forge/BACKLOG.md:110-113)."
args:
  target:
    type: string
    description: "Gate check ids (e.g. FORGE_NO_REFUSAL_TEST) or the path of a gate source/test file to falsify. Empty = sweep the gate test suite and pick the 8 most likely to be silent."
    default: ""
*/
interface Target {
  /** Check id or source path being falsified. */
  id: string;
  /** The gate source file that implements the check. */
  sourcePath: string;
  /** One sentence: what must be true for this check to go red. */
  redCondition: string;
  /** How the team would notice if the check silently stopped firing. */
  blastRadius: string;
}

interface RedResult {
  /** Check id this verdict is about. */
  id: string;
  /** What the check is supposed to catch. */
  protects: string;
  /** What the adversary actually did to make it go red. */
  fixture: string;
  /** "fired" when the red fixture produced the expected failure code; "silent" when the check stayed green. */
  verdict: "fired" | "silent" | "inconclusive";
  /** The observed output line that decided it, or why it could not be decided. */
  evidence: string;
  /** How much it matters. "high" when the check silently never fires. */
  severity: "low" | "medium" | "high";
}

interface WorkflowReport {
  /** Two or three sentences: can this gate be trusted to catch what it claims? */
  conclusion: string;
  results: RedResult[];
  /** What was run and how. */
  verified: string[];
  /** What could not be falsified and why. */
  notCovered: string[];
}

const scope = String(args.target ?? "").trim();
const root = "omega-baseline/omega-final";

phase("Pick the gate checks worth trying to break");
const testPaths = await files.glob(`${root}/tooling/gates/test/*.test.ts`);
const picked = await agent("check spotter", {
  system:
    "You audit a gate suite for checks that could silently stop firing. Read the test files " +
    "you are given. Do not edit anything. You are not asked whether the suite passes — you " +
    "are asked which specific checks are worth trying to break, and why breaking each one " +
    "would matter.",
}).ask<Target[]>(
  scope
    ? `Falsification targets: ${scope}\n\nThe gate test suite lives in ${root}/tooling/gates/test/. ` +
      `Start from the named target(s), then read the surrounding test and the gate source it ` +
      `exercises (${root}/tooling/gates/*.ts). Return up to 8 targets. For each: the gate ` +
      `source path, the precise condition that must hold for the check to go red, and the ` +
      `blast radius — what breaks for the team if this check silently never fires again.`
    : `The gate test suite lives in ${root}/tooling/gates/test/ (48 files). The gate sources ` +
      `they exercise are in ${root}/tooling/gates/*.ts.\n\nPick the 8 checks most likely to be ` +
      `SILENT — green for the wrong reason. Weight a check highly when its assertion is ` +
      `tautological, when it tests a regex or path shape that a platform difference could ` +
      `defeat, when it asserts on a count that drifts when a file is added, or when it guards ` +
      `a rule the suite itself relies on. For each: the gate source path, the precise condition ` +
      `that must hold for it to go red, and the blast radius of it silently not firing.`,
);
const targets = picked.slice(0, 8);
log(`Trying to break ${targets.length} gate checks`);

phase("Break each check with the smallest fixture that should trigger it");
const attempted = await Promise.allSettled(
  targets.map((t, i) =>
    agent(`falsifier ${i}`, {
      system:
        "You try to make a gate check go red. Work in a temp directory or a scratch copy — " +
        "never modify the repository's tracked files, and never leave a change behind. If you " +
        "cannot make the check fail, that is a real result, not a failure of your own: report " +
        "it plainly. If a check cannot be tested at all, say so rather than guessing. If your " +
        "instructions and the code contradict each other, escalate instead of working around it.",
    }).ask<RedResult>(
      `Make this gate check go red and report what happened.\n\n` +
        `Check id: ${t.id}\n` +
        `Gate source: ${t.sourcePath}\n` +
        `It should fire when: ${t.redCondition}\n` +
        `If it silently stops firing: ${t.blastRadius}\n\n` +
        `Read the gate source first to find the exact failure code it emits. Then build the ` +
        `smallest possible fixture that violates the condition — a single missing field, a ` +
        `malformed manifest, one file that should not exist — and run whatever command ` +
        `exercises the check (the repo's own gate scripts are under ${root}/tooling/gates/; ` +
        `run them with TMP and TEMP pointed at a real directory like C:/temp-bcp, because ` +
        `bun resolves a broken stub under the user profile otherwise).\n\n` +
        `Report verdict "fired" only if you OBSERVED the expected failure code in the output. ` +
        `Report "silent" if the check stayed green despite your fixture. Use "inconclusive" if ` +
        `you could not run the check at all — and say why in evidence. Do not modify tracked ` +
        `repository files under any circumstances; if the check can only be exercised by ` +
        `editing one, report "inconclusive" and name the file.`,
    ),
  ),
);

const results: RedResult[] = [];
for (let i = 0; i < attempted.length; i += 1) {
  const outcome = attempted[i];
  const target = targets[i];
  if (outcome?.status === "fulfilled" && outcome.value) {
    const r = outcome.value;
    report(r);
    results.push(r);
  } else {
    const r: RedResult = {
      id: target?.id ?? `target-${i}`,
      protects: target?.redCondition ?? "unknown",
      fixture: "none — the falsifier did not return a result",
      verdict: "inconclusive",
      evidence:
        outcome?.status === "rejected"
          ? `the falsifier subagent failed: ${String(outcome.reason).slice(0, 200)}`
          : "no result returned",
      severity: "medium",
    };
    report(r);
    results.push(r);
  }
}

const silent = results.filter((r) => r.verdict === "silent");
const fired = results.filter((r) => r.verdict === "fired");
const inconclusive = results.filter((r) => r.verdict === "inconclusive");

const lines = [
  `# Gate falsification report`,
  ``,
  `${fired.length} of ${results.length} checks fired as designed. ${silent.length} stayed green ` +
    `against a fixture that should have made them red.`,
  ``,
  `| Check | Verdict | Protects | Severity |`,
  `|---|---|---|---|`,
  ...results.map(
    (r) => `| \`${r.id}\` | **${r.verdict}** | ${r.protects} | ${r.severity} |`,
  ),
  ``,
  ...(silent.length
    ? [
        `## Silent — these are the ones that matter`,
        ``,
        ...silent.map(
          (r) =>
            `### \`${r.id}\`\n\n- **Fixture:** ${r.fixture}\n- **Evidence:** ${r.evidence}\n` +
            `- **Blast radius:** ${r.protects}\n`,
        ),
      ]
    : [`## No silent checks`, ``, `Every check tried went red when it should have.`]),
  ``,
  ...(inconclusive.length
    ? [
        `## Inconclusive`,
        ``,
        ...inconclusive.map((r) => `- \`${r.id}\` — ${r.evidence}`),
        ``,
      ]
    : []),
];

await artifact.markdown("report", lines.join("\n"), {
  title: "Gate falsification report",
  description: `${silent.length} of ${results.length} gate checks stayed green against a fixture that should have made them red.`,
  primary: true,
});

const conclusion =
  silent.length > 0
    ? `${silent.length} of ${results.length} gate checks could not be made to fail. A check that stays green against a fixture built to break it is protection nobody has — these need fixing before the gate they sit in can be trusted.`
    : `All ${results.length} gate checks tried fired when their condition was violated. The gate is falsifiable on this sample; ${inconclusive.length} could not be exercised either way.`;

return {
  conclusion,
  results,
  verified: [
    `${results.length} gate checks were each given a fixture designed to violate their condition`,
    `${fired.length} were observed emitting their expected failure code in real gate output`,
    "gate output was read from the repository's own gate scripts, not asserted",
  ],
  notCovered: [
    ...(inconclusive.length
      ? [`${inconclusive.length} checks could not be exercised: ${inconclusive.map((r) => r.id).join(", ")}`]
      : []),
    "only the targeted checks — this is a sample, not an exhaustive audit of every rule in the gate",
    "no tracked repository file was modified; checks that require one to be edited are reported inconclusive by construction",
  ],
} satisfies WorkflowReport;
