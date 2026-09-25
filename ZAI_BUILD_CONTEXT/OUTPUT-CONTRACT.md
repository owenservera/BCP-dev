# Output Contract

The agent is NOT a local CLI-only coding agent. The owner needs a usable WebApp to access the result.

## A. WebApp frontend is mandatory

Build a real frontend in the repository that provides at minimum:
- current build status;
- completed hard-problem list;
- active problem/turn;
- test/proof status;
- major architectural decisions;
- links to generated documentation;
- downloadable repository/build artifact;
- downloadable solution packages;
- visible warnings for UNPROVEN/EXPERIMENT-REQUIRED claims.

The WebApp must work from the normal VIVIM/local runtime and must not require a central SaaS backend.

If the repository already contains a suitable surface, extend it rather than creating a parallel application.

## B. Downloadable repository artifact

The agent must provide a way from the WebApp to obtain a packaged snapshot/build artifact suitable for the owner to download.

At minimum produce a ZIP containing:
- source;
- relevant docs;
- package manifests;
- build metadata;
- turn history/state.

Do not include secrets, browser profiles, cookies, tokens, local credential stores, node_modules, build caches, or other private machine state.

## C. One reusable ZIP per major hard problem

For every solved major hard problem create:

`artifacts/hard-problems/HP-####-<slug>.zip`

The ZIP must contain a self-contained solution package:

`HP-####-<slug>/`
- `README.md`
- `PROBLEM.md`
- `SOLUTION-BLUEPRINT.md`
- `ARCHITECTURE.md`
- `CONTRACTS.md`
- `DATA-MODEL.md` when applicable
- `STATE-MACHINE.md` when applicable
- `FLOWS.md`
- `TEST-AND-PROOF.md`
- `INTEGRATION.md`
- `FAILURES-AND-FALSIFIERS.md`
- `KNOWN-LIMITATIONS.md`
- `HARVEST-AND-REUSE.md`
- `SOURCE-MANIFEST.json`
- `CHANGE-MANIFEST.json`
- `examples/`
- relevant minimal source/test files needed to understand/reuse the solution.

The package must explain not merely what was coded, but **why this boundary was chosen, what evidence forced it, what alternatives were rejected, and how another project could reuse it.**

## D. Hard-problem package quality

A package is only complete when another capable engineer could:
- understand the problem;
- understand the chosen solution;
- reproduce the core behavior;
- understand dependencies;
- run its tests;
- integrate it elsewhere;
without reading the entire VIVIM repository.

## E. Package source hygiene

Packages must be reproducible and sanitized.

Never package:
- secrets;
- API keys;
- cookies;
- auth headers;
- browser profiles;
- personal data;
- machine-specific credentials;
- huge dependency trees.

Use fixtures/synthetic data where possible.

## F. Turn records

Create:
`ZAI_BUILD_CONTEXT/turns/TURN-####.md`

Each turn record must contain:
- objective;
- why it matters;
- starting state;
- evidence inspected;
- experiment;
- implementation;
- tests;
- proof level;
- files changed;
- architectural decisions;
- rejected alternatives;
- known limitations;
- package path;
- next recommended hard problem.

## G. Build ledger

Maintain:
`ZAI_BUILD_CONTEXT/BUILD-LEDGER.json`

Every turn updates it with:
- turn;
- hard problem;
- status;
- proof level;
- commit;
- tests;
- package;
- product journey unlocked;
- dependencies;
- remaining risks.

## H. Owner handoff

The WebApp must expose a concise “What changed?” and “What should happen next?” view so the owner does not need to inspect git manually.
