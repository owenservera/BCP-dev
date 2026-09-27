# CFA-10 — B1 Target-Runtime Closure Handoff
## 2026-09-27

> Status: **READY FOR LOCAL RUNTIME EXECUTION**
> This is an execution handoff, not a production implementation plan.

## Why this handoff exists

The hosted architecture session can read and write the repository but cannot execute a local BCP-dev checkout: DNS resolution for \`github.com\` is unavailable to the execution container. The queued B1 closure therefore cannot honestly be marked executed here.

## Required execution environment

Run from a real checkout of the exact current \`main\` commit.

Required:
- Bun runtime compatible with the repository;
- full checkout of \`BCP-dev\`;
- filesystem access sufficient to create temporary source trees and symlinks;
- on Windows, native Windows path semantics.

Starting commands:

\`\`\`powershell
git checkout main
git pull --ff-only
git rev-parse HEAD
cd omega-baseline/omega-final
bun install
bun --version
bun test host/test/adversarial.test.ts
\`\`\`

Record the exact HEAD SHA and Bun version in the result.

## B1 corpus to execute

Use the M1 matrix in:
\`M1-K0-EVIDENCE-FALSIFIER-MATRIX-2026-09-27.md\`

Required cases:
- B1-01 valid in-tree executable entry: ALLOW;
- B1-02 relative traversal: REFUSE;
- B1-03 nested traversal: REFUSE;
- B1-04 POSIX absolute spelling: record actual runtime result, do not assume;
- B1-05 Windows drive-qualified spelling: execute on Windows and record result;
- B1-06 Windows UNC spelling: execute on Windows and record result;
- B1-07 \`e.source\` out-of-tree: REFUSE;
- B1-08 \`e.manifestPath\` out-of-tree: REFUSE;
- B1-09 source-root symlink: REFUSE;
- B1-10 entry symlink: REFUSE;
- B1-11 non-file executable target: REFUSE;
- B1-12 verify, mutate, then boot: no mutated uncovered bytes execute;
- B1-13 verify, replace path with different bytes, then boot: no replacement bytes execute;
- B1-14 content mismatch: REFUSE.

## Additional proof requirements

For every refusal:
- record whether refusal occurs before Worker creation;
- record stable error text/code if one already exists;
- do not invent a new refusal code during the experiment.

For byte binding:
- capture the integrity-covered bytes or their digest;
- capture the bytes actually loaded/executed;
- show equality or a fail-closed refusal;
- do not infer byte identity merely from path equality.

For B4:
- repeat representative invalid B1 cases through recovery;
- confirm invalid incoming state is not pinned;
- confirm known-good pinned state remains the recovery target;
- confirm corrupt pinned state still refuses.

## Non-goals

Do not:
- modify \`omega-baseline/omega-final/host/src/*\`;
- amend Ω law;
- choose immutable snapshots, file descriptors or another byte-binding mechanism;
- claim OS sandboxing;
- promote B1 to PROVEN without the complete replay.

## Required result artifact

Create:
\`RESULTS/CFA10-B1-TARGET-RUNTIME-CLOSURE-2026-09-27.md\`

It must contain:
- exact runtime/OS/toolchain;
- exact starting main SHA;
- case-by-case results B1-01..B1-14;
- evidence for source-root/manifest-root containment;
- evidence for verify→execute byte identity;
- B4 recovery observations;
- OBSERVED / DERIVED / UNKNOWN classification;
- residual falsifiers;
- final M1/B1 status;
- exact commit SHA.

## Exit condition

B1 may be called CLOSED only if the M1 exit gate is satisfied. Otherwise preserve **UNDERPROVEN** and name the residual gaps precisely.
