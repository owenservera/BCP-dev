/* zcode-workflow
description: "Fixture forger: builds a pinned second synthetic mine with its own MANIFEST and rootHash, byte-stable under line-ending normalisation, so replay and second-mine checks have a corpus to run against. The rootHash is computed by a second agent that shares no code with the builder."
whenToUse: "Before landing forge.proof.replay@1 or forge.proof.secondmine@1, or whenever a check needs a second pinned corpus and only synthetic-v0 exists."
args:
  name:
    type: string
    description: "Short name of the fixture mine to build, e.g. synthetic-v1."
    required: true
*/
interface FixtureSpec {
  /** Directory name of the fixture, e.g. "synthetic-v1". */
  name: string;
  /** One sentence: what property this second mine has that synthetic-v0 does not. */
  purpose: string;
  /** The file list, with each file's content described in one line. */
  files: { path: string; content: string }[];
}

interface BuildOutcome {
  /** The rootHash the BUILDER's own code computed. */
  builderRootHash: string;
  /** The rootHash an INDEPENDENT walk computed, sharing no code with the builder. */
  verifierRootHash: string;
  /** Whether the two agree. */
  agree: boolean;
  /** Files created. */
  fileCount: number;
  /** Anything that went wrong. */
  notes: string;
}

interface WorkflowReport {
  /** Two or three sentences: does the second mine exist, and is it trustworthy? */
  conclusion: string;
  results: BuildOutcome[];
  /** What was run and how. */
  verified: string[];
  /** What could not be checked and why. */
  notCovered: string[];
}

const name = String(args.name);
const root = "omega-baseline/omega-final";
const mineDir = `${root}/testkit/test/fixtures/mines/${name}`;

phase("Design the second mine so it tests something the first one cannot");
const spec = await agent("fixture designer", {
  system:
    "You design a small, deterministic test corpus for a content-hash system. Read the " +
    "existing pinned fixture and the capture plugin before designing. Do not write any files " +
    "yet — return the design only. Keep it small: this is a fixture, not a product.",
}).ask<FixtureSpec>(
  `Design a second pinned synthetic mine named "${name}".\n\n` +
    `The existing one is at ${root}/testkit/test/fixtures/mines/synthetic-v0/ — read its ` +
    `MANIFEST.json and a few of its files first, and read the hash convention in ` +
    `${root}/plugins/forge-mine-capture/ (README.md and src/receipt.ts) so you match it exactly.\n\n` +
    `The second mine must exist to test something synthetic-v0 cannot: give it a property that ` +
    `is deliberately different (empty directories, a deeply nested path, an unusual but legal ` +
    `filename, a file with non-ASCII content, a file large enough to matter for hashing — pick ` +
    `what actually exercises replay and diff). State that property in one sentence.\n\n` +
    `Return the exact file list with each file's intended content. Keep it under 20 files.`,
);
log(`Designing ${spec.files.length} files for ${name}: ${spec.purpose}`);

phase("Write the mine and compute its hash");
const built = await agent("fixture builder", {
  system:
    "You build a deterministic test fixture in the repository and compute its content hash. " +
    "Write only inside the fixture directory you are told to use. Never modify any existing " +
    "file. Report the hash your own code computed — do not ask another agent for it, and do " +
    "not assume the value of anything you did not compute.",
}).ask<BuildOutcome>(
  `Build this fixture mine at ${mineDir}:\n\n${JSON.stringify(spec.files, null, 2)}\n\n` +
    `Its purpose: ${spec.purpose}\n\n` +
    `Then compute its rootHash the way the capture plugin does — read ` +
    `${root}/plugins/forge-mine-capture/src/receipt.ts and README.md for the exact convention ` +
    `(CRLF to LF normalisation per file, then sha256 over "path:hexhash" lines joined with ` +
    `newlines in path order) — and write a MANIFEST.json beside the files pinning the file ` +
    `list, the count and the rootHash, in the same shape as synthetic-v0's.\n\n` +
    `Report the rootHash YOUR code computed. Do not write anything outside ${mineDir}.`,
);
report(built);

phase("Recompute the hash independently and check the manifest is the fold");
const verified = await agent("independent hasher", {
  system:
    "You verify a content hash by computing it a second way, independently. You must NOT read " +
    "or reuse the builder's hashing code — write your own walk from the specification. If your " +
    "two numbers disagree, say so plainly and report both; do not adjust one to match the " +
    "other. Do not modify any file.",
}).ask<BuildOutcome>(
  `Independently verify the fixture mine at ${mineDir}.\n\n` +
    `The builder reported a rootHash of: ${built.builderRootHash}\n\n` +
    `Write your own walk from the specification in ${root}/plugins/forge-mine-capture/README.md ` +
    `(do not import or copy the builder's code — the whole point is independence), compute the ` +
    `rootHash over the files that are actually on disk, and report it as verifierRootHash.\n\n` +
    `Also confirm the MANIFEST.json in that directory matches the files on disk: same count, ` +
    `same paths, same ordering. Report agree=true only if your independently computed hash ` +
    `equals the builder's AND the manifest matches the tree.`,
);
report(verified);

const agree = verified.verifierRootHash === built.builderRootHash && verified.agree;
const conclusion = agree
  ? `${name} is built with ${built.fileCount} files and its rootHash ${built.builderRootHash} was reproduced by an independent walk that shares no code with the builder. It is pinned and usable as a second corpus.`
  : `${name} is built but NOT trustworthy yet: the builder reported ${built.builderRootHash} and an independent walk computed ${verified.verifierRootHash}. Do not use this fixture until the two agree — and do not adjust one to match the other.`;

await artifact.markdown("report", [
  `# Fixture mine ${name}`,
  ``,
  `**${agree ? "Pinned and independently reproduced." : "NOT pinned — the hashes disagree."}**`,
  ``,
  `Purpose: ${spec.purpose}`,
  ``,
  `| | |`,
  `|---|---|`,
  `| Builder rootHash | \`${built.builderRootHash}\` |`,
  `| Independent rootHash | \`${verified.verifierRootHash}\` |`,
  `| Agree | ${agree ? "yes" : "**no**"} |`,
  `| Files | ${built.fileCount} |`,
  `| Location | \`${mineDir}\` |`,
  ``,
  ...(built.notes ? [`Builder notes: ${built.notes}`, ``] : []),
  ...(verified.notes ? [`Verifier notes: ${verified.notes}`, ``] : []),
].join("\n"), {
  title: `Fixture mine ${name}`,
  description: agree
    ? "A second pinned corpus, rootHash independently reproduced."
    : "A second corpus whose hash did NOT reproduce — do not use until it does.",
  primary: true,
});

return {
  conclusion,
  results: [built, verified],
  verified: [
    "the builder's rootHash was recomputed by a separate agent using its own walk, sharing no code",
    "the MANIFEST file list, count and ordering were checked against the files on disk",
  ],
  notCovered: [
    "byte-stability under core.autocrlf is implied by the hash convention, not exercised here — run the fixture across a checkout before trusting it",
    "no gate was run against the new fixture; this workflow produces the corpus, not the checks that consume it",
  ],
} satisfies WorkflowReport;
