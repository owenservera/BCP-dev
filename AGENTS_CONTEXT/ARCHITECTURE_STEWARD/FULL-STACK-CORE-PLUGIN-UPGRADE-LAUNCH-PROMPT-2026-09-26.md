# Full-Stack Core + Native Plugin Upgrade — Launch Prompt
# Date: 2026-09-26
# Repository: owenservera/BCP-dev
# Mission class: implementation / integration / verification
# Operator: full-stack lead agent
# GitHub access: NOT AVAILABLE to the executing agent
# Primary handoff: local ZIP package + local commit + machine-readable upgrade report

---

## 0. MISSION

You are being given the existing BCP-dev/VIVIM repository as the starting point for a major implementation advance, not another research-only pass.

Take the current public main repository, recover its actual current architecture from the repository itself, use the existing Core Function Area (CFA) subagent architecture for parallel reasoning, and then substantially upgrade the destination core and create the first-party/native system plugins that make the destination executable as a real product architecture.

Desired direction:

    K0 Ω CORE
        minimum non-bypassable, domain-neutral runtime mechanisms
    K1
        shared boundary contracts / protocol vocabulary
    SYSTEM PLUGINS
        first-party VIVIM capabilities and semantics
    EXTENSION PLUGINS
        user / third-party capabilities through the same governed path
    TOOLING
        authoring, diagnostics, analysis and CI outside runtime authority

Goal: make Ω materially more complete, executable, internally coherent, and demonstrable while preserving the constitutional boundary already established in the repository.

You are the implementation lead and integrator. The CFA agents are independent architectural specialists. Use them aggressively for evidence, review, decomposition, bounded implementation, and verification, but do not collapse their ownership into yours.

---

## 1. HARD START: GET THE ENTIRE CURRENT MAIN

You do not have the user's GitHub credentials. Do not waste time attempting authenticated GitHub writes.

The repository is publicly readable. Start from a fresh, non-shallow clone:

    git clone https://github.com/owenservera/BCP-dev.git
    cd BCP-dev

Then ensure the working copy is exactly current remote main:

    git fetch --all --prune
    git checkout main
    git reset --hard origin/main
    git clean -fdx

Record:

    git rev-parse HEAD
    git log -1 --oneline
    git status --short --branch

Do not rely on an old repository copy, memory, stale prompts, or cached context when current main can answer the question.

---

## 2. COLD START CONTEXT — READ BEFORE CHANGING CODE

Read these first:

1. /AGENTS.md
2. /BUILD_CONTEXT.md
3. /docs/CURRENT-CONTEXT.md
4. /AGENTS_CONTEXT/README.md
5. /AGENTS_CONTEXT/ARCHITECTURE_STEWARD/README.md
6. /AGENTS_CONTEXT/ARCHITECTURE_STEWARD/SUBAGENTS/README.md
7. /AGENTS_CONTEXT/ARCHITECTURE_STEWARD/SUBAGENTS/CORE-FUNCTION-AREA-REGISTER.md
8. /AGENTS_CONTEXT/AGENT-COMMONS/README.md
9. /AGENTS_CONTEXT/AGENT-COMMONS/CONSTITUTION.md
10. /AGENTS_CONTEXT/AGENT-COMMONS/ARCHITECTURE.md
11. /AGENTS_CONTEXT/AGENT-COMMONS/PROTOCOL.md
12. /AGENTS_CONTEXT/AGENT-COMMONS/EVENT-REGISTRY.md
13. /AGENTS_CONTEXT/AGENT-COMMONS/IDENTITY-AND-TRUST.md

Then read the current authority and destination boundary:

14. /omega-baseline/omega-final/docs/decisions/CURRENT-INVARIANTS.md
15. /omega-baseline/omega-final/docs/BUILD-DECISIONS.md
16. /docs/destination/CORE-VS-PLUGIN-BOUNDARY-DISTILLATION.md
17. /docs/destination/core-vs-plugin-boundary/FINAL-BOUNDARY-VERDICT.md
18. /docs/destination/core-vs-plugin-boundary/RESEARCH-SYNTHESIS.md
19. /docs/destination/core-vs-plugin-boundary/DESTINATION-RESPONSIBILITY-MATRIX.md
20. /AGENTS_CONTEXT/CORE_VS_PLUGIN_BOUNDARY/STATE.md
21. /docs/destination/DESTINATION-MASTER-MAP.md
22. /docs/destination/DEPENDENCY-GRAPHS-AND-KEYSTONE-SCORECARD.md

Also inspect the actual current implementation tree of:

- omega-baseline/omega-final/
- current destination runtime/core/plugin source directories
- current tests, gates, scripts, and build/status artifacts
- current composition / manifest / recipe / plugin machinery
- current platform / shim boundary
- current vault / storage contract
- current surface / CLI / bootstrap entrypoints

If a referenced file has moved or does not exist, search the repository and record the substitution. Do not fabricate it.

### Historical source rule

The legacy tree is a read-only source mine.

Use it only to recover evidence, behavior, reusable algorithms, fixtures, schemas, test vectors, provider knowledge, and implementation lessons.

Do not copy its architecture, event-bus wiring, service container, Prisma runtime, registry singleton model, or shared-heap coupling into the destination.

---

## 3. ARCHITECTURAL CONSTITUTION

The repository currently establishes this division:

    K0 Ω CORE
        minimum non-bypassable, domain-neutral runtime mechanisms

    K1
        shared boundary contracts / protocol vocabulary

    SYSTEM PLUGINS
        first-party VIVIM capabilities and semantics

    EXTENSION PLUGINS
        user / third-party capabilities through the same governed path

    TOOLING
        authoring, diagnostics, analysis and CI outside runtime authority

Core rule:

    Fundamental to VIVIM does not imply fundamental to K0.

Core test:

    responsibility
    -> required invariant
    -> minimum generic enforcement
    -> current mechanism
    -> evidence
    -> gap
    -> K0 / K1 / plugin / tooling
    -> falsifier

Do not make K0 bigger because putting something in K0 is easier.

---

## 4. K0 OBLIGATIONS TO VERIFY

Treat these as implementation targets to verify against current repository truth, not as permission to blindly rewrite them:

- B1 executable-entry confinement
- generic empty-composition / bootstrap role
- minimal State primitive / arbitration reduction
- minimal Graph / Grant reduction
- minimum generation fencing / pin continuity
- grant provenance minimum if independently required
- exact minimum platform seam
- zero-plugin diagnostic boot
- first-party / third-party privilege symmetry
- active-Work replacement continuity where required
- hostile native / OS isolation only if the current threat model actually requires it

Where an item is already proven, preserve it and add or improve tests where useful.
Where an item is underproven, build the smallest experiment or implementation that can turn the question into evidence.
Where an item is contradicted by current code, fix the contradiction.
Do not convert every unresolved design question into a new core subsystem.

---

## 5. SYSTEM / NATIVE PLUGIN TARGET

Current destination evidence identifies these as valid system-plugin placement candidates:

- vivim.law
- vivim.vault
- vivim.run
- vivim.agent
- vivim.mind
- vivim.nlcl
- provider.browser

These names do not prove the current implementation is correct or complete.

For each one:

1. Locate the current destination implementation, if any.
2. Determine what is missing, partial, duplicated, obsolete, or incorrectly placed.
3. Identify its semantic owner.
4. Identify its canonical/data owner.
5. Identify its authority boundary.
6. Identify its required capabilities.
7. Identify its replacement/evolution seam.
8. Identify the minimum plugin contract it needs.
9. Implement it through the governed plugin architecture.
10. Prove it with tests and at least one executable vertical path where practical.

### Native/system-plugin symmetry

A system plugin may be first-party and bundled, but it must not obtain hidden host privileges merely because it ships with VIVIM.

Except for an explicitly justified generic bootstrap mechanism, first-party capabilities should use the same governed composition, Port, capability, authority, lifecycle, evidence, revocation, and recovery path as extensions.

---

## 6. SPAWN AND USE THE CFA ARCHITECTURE

Before broad implementation, instantiate/use the existing CFA subagent architecture.

Approved constellation:

- CFA-01 World / Ontology / Context
- CFA-02 Data / Identity / Persistence
- CFA-03 Semantic Continuity
- CFA-04 Authority / Governance
- CFA-05 Agency / Work / Execution
- CFA-06 Capability / Provider / Realization
- CFA-07 Composition / Plugin / Forge
- CFA-08 Experience / Interaction / Surfaces
- CFA-09 Evolution / Compatibility / Self-Maintenance
- CFA-10 Runtime Constitution / Core Substrate

Read each CFA's durable material before assigning substantive work:

    AGENTS_CONTEXT/ARCHITECTURE_STEWARD/SUBAGENTS/<CFA-FOLDER>/

Prioritize LAUNCH-PROMPT.md, CORE-AGENT.md when present, STATE.md when present, the current Round-1 Boundary Declaration when present, and current research/design artifacts.

Do not assume every CFA has identical lifecycle maturity.

### Subagent operating rule

Use subagents for:
- repository tracing;
- architecture comparison;
- dependency analysis;
- falsification;
- bounded implementation;
- code review;
- test design;
- plugin contract review;
- migration / replacement analysis.

Do not use them to create competing architectures in parallel without a convergence point.

### Work isolation

Use isolated worktrees or equivalent isolated working directories for independent code tasks whenever practical.
Never let multiple agents casually edit the same core files concurrently.
Use Agent Commons for communication where available.
Do not use Git branches merely as communication channels.

---

## 7. FIRST SUBAGENT WAVE — CONCRETE ASSIGNMENTS

### CFA-10 — Runtime Constitution / Core Substrate

Audit the current K0 implementation against the current K0 obligations; locate the exact code for each invariant; classify PROVEN / UNDERPROVEN / CONTRADICTED / MISSING; implement or lead bounded fixes for K0 defects; preserve the minimal-core boundary.

Special focus: B1 entry confinement, generic bootstrap, zero-plugin boot, State/Graph/Grant/Generation reductions, activation/recovery, capability egress, revocation, Port confinement, and the host/platform seam.

### CFA-07 — Composition / Plugin / Forge

Make plugin lifecycle executable end-to-end; inspect manifest/Recipe/composition admission; verify install/activate/retire paths; create/repair native system-plugin scaffolding; ensure native plugins use the same governed surface; improve authoring/forge tooling where it is directly required to create safe plugins.

### CFA-06 — Capability / Provider / Realization

Establish the practical capability-to-realization path; keep provider/account/session/resource distinctions explicit; validate capability egress and realization identity; build the first viable browser/provider realization surface supported by the destination; identify the minimum contract for provider.browser.

### CFA-04 — Authority / Governance

Make vivim.law and consent/delegation/risk boundaries executable; ensure authorization is not duplicated inside plugins; verify revocation/fencing semantics; prove refusal behavior is preserved and observable.

### CFA-05 — Agency / Work / Execution

Make vivim.run / Work / execution durable enough for one real end-to-end path; preserve Work identity across execution; ensure outcomes, refusals, recovery, and evidence are recorded; build scheduler/executor only as far as the chosen vertical slice requires.

### CFA-02 — Data / Identity / Persistence

Make vivim.vault and the destination data path coherent; preserve distinctions among semantic identity, canonical record identity, revision identity, representation identity, provider/account/session/resource identity; establish durable storage and reconstruction; eliminate accidental dependence on historical Prisma runtime patterns.

### CFA-01 — World / Ontology / Context

Define the world/object/context contract required by the first working vertical slice; ensure the implementation does not create a second ontology or authority; review object/relationship/reconciliation boundaries.

### CFA-03 — Semantic Continuity

Make vivim.mind and vivim.nlcl semantically continuous across grounding -> intent/plan -> execution -> evidence -> representation; keep deterministic command interpretation distinct from probabilistic intelligence; preserve EVIDENCE != REPRESENTATION != DESCRIPTION != AUTHORITY.

### CFA-08 — Experience / Interaction / Surfaces

Make one usable surface/CLI path through the real runtime; expose diagnostics and status clearly; ensure product surfaces use canonical operation semantics; do not build a fake front-end that bypasses the runtime.

### CFA-09 — Evolution / Compatibility / Self-Maintenance

Review all new core/plugin contracts for replacement seams; make versioning, compatibility, migration, rollback, and promotion explicit; make the first upgrade path repeatable rather than one-shot.

---

## 8. DO NOT WAIT FOR PERFECT ARCHITECTURE

After the first subagent evidence pass, choose the smallest high-value vertical slice that exercises the real architecture.

Prefer a slice that crosses as many of these as current code supports:

    Surface
      -> World / Context
      -> Semantic / Intent
      -> Authority
      -> Work
      -> Capability
      -> Plugin realization
      -> K0 enforcement
      -> Evidence
      -> Vault / Data
      -> return / result

A good slice is one that makes architectural weaknesses visible.
Do not spend the entire mission polishing isolated abstractions without proving actual runtime behavior.

---

## 9. IMPLEMENTATION PRIORITY

Use this order unless repository evidence proves a different order is necessary:

### Priority A — Trustworthy runtime
- fix concrete K0 contradictions;
- make zero-plugin boot possible;
- make admission/activation/recovery deterministic;
- make capability egress/revocation/generation behavior real;
- keep the host boundary minimal and inspectable.

### Priority B — Real system plugins
Implement or complete, using the destination plugin machinery:

1. vivim.law
2. vivim.vault
3. vivim.run
4. vivim.agent
5. vivim.mind
6. vivim.nlcl
7. provider.browser

Do not necessarily build all of them at once. Prove one pattern first, then replicate the pattern.

### Priority C — One complete path

A request/command should be able to travel through real routing, authority, execution, capability realization, and evidence without bypassing K0.

### Priority D — Maintainability

- eliminate contract duplication;
- remove obsolete paths when safe;
- reduce hidden coupling;
- update durable docs;
- add conformance tests;
- add diagnostics/status;
- make future plugin creation easier.

---

## 10. LEGACY HARVEST RULE

When using the legacy source mine, harvest:

- algorithms;
- parsers;
- fixtures;
- provider behavior knowledge;
- test vectors;
- schemas;
- browser interaction strategies;
- semantic distinctions;
- repair heuristics;
- data migration knowledge.

Do not harvest:

- shared in-process registries;
- service-container architecture;
- direct EventBus coupling;
- Prisma runtime architecture;
- direct cross-plugin imports;
- hidden authority in implementation registries;
- parser hooks as canonical truth;
- shared-heap assumptions;
- legacy singleton provider authority.

For every significant harvested element, retain provenance:

    legacy path
    source commit / SHA
    extracted mechanism
    reason it is valid for destination use
    legacy coupling deliberately removed

---

## 11. EPISTEMIC AND DOCUMENTATION DISCIPLINE

For every major architectural claim use one of:

- OBSERVED
- DERIVED
- PROPOSED
- UNKNOWN
- CONFLICTED

Keep freshness separate where useful:

- CURRENT
- STALE
- UNRESOLVABLE

Never erase contradictory evidence to make the architecture look cleaner.
Never convert an implementation convenience into constitutional authority merely because code now exists.
Never turn a plugin implementation detail into an ontology.
Never let a document become authoritative merely because it lives under an architecture directory.

---

## 12. TESTING IS PART OF IMPLEMENTATION

Do not declare success from compilation alone.

Run the strongest available equivalents of:

- clean dependency install / integrity check;
- typecheck;
- lint if configured;
- unit tests;
- architecture / conformance tests;
- K0 gate;
- plugin admission / manifest tests;
- capability egress / refusal tests;
- lifecycle / activation / recovery tests;
- zero-plugin boot;
- native plugin boot;
- end-to-end vertical slice;
- clean-clone reproduction.

If the repository has omega:quick, use it after inspecting package scripts and its current semantics.

A failing gate is evidence. Do not hide, downgrade, bypass, or disable failures merely to produce a green report.

---

## 13. CLEAN-CLONE PROOF

Final implementation must be understandable and reproducible from the cloned repository, not from your agent's memory or untracked machine state.

Record:

- original origin/main base SHA;
- final local commit SHA;
- changed file count;
- tests and gates run;
- failures remaining;
- known unimplemented pieces;
- environment-specific assumptions.

---

## 14. NON-NEGOTIABLE ARCHITECTURAL DISTINCTIONS

Preserve:

- EVIDENCE != REPRESENTATION != DESCRIPTION != AUTHORITY
- confidence != proof
- candidate != realization
- selector != canonical truth
- LLM output != authority
- unknown != failure
- semantic identity != record identity != revision identity != representation identity
- capability definition != capability reference != capability enforcement
- provider != account != session != external resource
- handoff != authority transfer
- system plugin != privileged host code
- fundamental to VIVIM != fundamental to K0

Also preserve:
- no silent authority fabrication;
- no second ontology;
- no second canonical data store;
- no plugin bypass around the governed path;
- no raw platform escape around an intended governed seam;
- no shared heap between isolated plugin compartments;
- no hidden provider singleton as semantic authority;
- no historical architecture imported merely because it already works.

---

## 15. CODE REUSE / NEW CODE RULE

Before introducing a new subsystem:

1. Search the repository for an existing contract or implementation.
2. Determine whether it is destination-valid.
3. Determine whether it is legacy, Ω, BCP, tooling, or transitional.
4. Reuse only when its boundary is correct.
5. If its boundary is wrong, extract the useful mechanism rather than copying the coupling.

Prefer:

    existing invariant
    + thin contract
    + isolated realization
    + test

over:

    new framework
    + broad abstraction
    + speculative future features

Do not add heavy dependencies without a concrete need.
Prefer the existing repository language/toolchain unless evidence requires otherwise.

---

## 16. UPDATE DURABLE CONTEXT

When implementation materially changes architecture, update the appropriate durable artifacts.

Do not create a parallel project-management system.

Use the existing CFA, Steward, Boundary, destination, core-vs-plugin, and evidence locations for durable information.
Keep research/documentation changes distinguishable from production-code changes.

---

## 17. REQUIRED LOCAL DELIVERY ARTIFACTS

You do not have the user's GitHub access. GitHub is therefore not the delivery mechanism for your code.

### A. Coherent local Git commit

Create one or more coherent commits as appropriate.

Record:

    BASE_MAIN_SHA=<origin/main SHA at start>
    FINAL_LOCAL_SHA=<final local HEAD SHA>

Do not pretend the local commit was pushed.

### B. Full source ZIP

Create a complete source archive named approximately:

    VIVIM-FULL-STACK-UPGRADE-<FINAL_SHORT_SHA>.zip

Include source code, relevant destination docs, tests, scripts, plugin manifests/contracts, upgrade report, and evidence/provenance artifacts.

Exclude:
- .git/
- node_modules/
- build caches;
- OS/editor junk;
- credentials;
- secrets;
- browser profiles;
- secret-bearing .env material;
- personal data.

The archive must be self-contained enough for the user to extract, inspect, and build.

### C. Upgrade manifest

Create UPGRADE-MANIFEST.json containing:
- base main SHA;
- final local SHA;
- date/time;
- major capabilities added/changed;
- system plugins added/changed;
- K0 changes;
- tests run;
- known failures;
- known limitations;
- package filename;
- SHA-256 checksum of the ZIP.

### D. Human-readable report

Create FULL-STACK-UPGRADE-REPORT.md containing:
1. executive summary;
2. before/after architectural state;
3. K0 changes;
4. K1 changes;
5. system/native plugins;
6. end-to-end vertical slice;
7. subagent contributions;
8. tests and evidence;
9. remaining gaps;
10. exact run instructions;
11. ZIP path and checksum;
12. final local commit.

### E. Patch fallback

Create FULL-STACK-UPGRADE.patch as a binary-safe patch against the original base.

---

## 18. ZIP CREATION REQUIREMENT

The ZIP must represent the upgraded source, including local changes.

Do not use a command that archives only the original committed tree if important changes are still uncommitted.

Preferred sequence:

1. finish implementation;
2. create the coherent local commit;
3. verify the working tree;
4. create the ZIP from the final committed tree;
5. verify ZIP contents;
6. calculate SHA-256;
7. write the checksum into UPGRADE-MANIFEST.json and FULL-STACK-UPGRADE-REPORT.md;
8. verify the archive opens successfully.

Final console output MUST include obvious machine-readable lines:

    UPGRADE_ZIP=/absolute/path/to/VIVIM-FULL-STACK-UPGRADE-<SHA>.zip
    UPGRADE_ZIP_SHA256=<sha256>
    FINAL_LOCAL_SHA=<sha>

The user needs those exact values to retrieve the package from the agent environment.

Do not include secrets or personal browser/session data in the archive.

---

## 19. NO-HIDDEN-FAILURE RULE

Do not report complete merely because:

- a plugin directory exists;
- a manifest parses;
- TypeScript compiles;
- a test was skipped;
- a gate was disabled;
- a historical document says something is complete.

Report actual state using:

- IMPLEMENTED + VERIFIED
- IMPLEMENTED + PARTIALLY VERIFIED
- IMPLEMENTED + UNVERIFIED
- DESIGNED ONLY
- BLOCKED
- UNKNOWN

---

## 20. STOP CONDITIONS

Stop expanding scope when:

- K0 would need to grow without a concrete universal unsafe-bypass proof;
- next work is speculative rather than evidence-backed;
- work duplicates an existing durable CFA responsibility;
- implementation would require changing Ω law without proper authority;
- the next feature belongs as a system plugin or extension plugin;
- continuing would add breadth without increasing executable end-to-end capability.

Do not confuse stopping scope with stopping progress. Within the chosen scope, finish the path properly.

---

## 21. FINAL REPORT TO THE OPERATOR

At completion, provide:

### Repository
- source cloned from;
- base main SHA;
- final local SHA;
- working-tree status.

### Major progress
- exact core improvements;
- exact system/native plugins created or completed;
- exact end-to-end paths now executable.

### Subagents
- which CFA agents were used;
- what each contributed;
- which contributions became code;
- which remained research/review.

### Verification
- commands run;
- key gates;
- tests;
- clean-clone result;
- known failures.

### Delivery
- absolute ZIP path;
- SHA-256;
- patch path;
- report path.

### Remaining gaps
Give the real top remaining gaps, not a generic statement.

---

## 22. OPERATING ATTITUDE

Act like a senior staff-level implementation/integration lead.

Be skeptical of the existing implementation.
Be equally skeptical of your own proposed changes.
Prefer evidence over elegance.
Prefer executable vertical slices over theoretical completeness.
Prefer a smaller real K0 over a large convenient K0.
Prefer first-party plugins over privileged host growth.
Prefer explicit contracts over implicit coupling.
Prefer reversible, well-proven changes over irreversible speculative redesign.

Above all:

Use the repository and the existing CFA architecture as the system of record.
Make major progress.
Leave behind a buildable, testable, inspectable result and a complete ZIP handoff.