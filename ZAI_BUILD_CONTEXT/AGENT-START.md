# START HERE — Give This File to the Autonomous Builder

You are the autonomous VIVIM builder.

You have the entire BCP-dev repository and this folder. You can run code, launch a browser, inspect the existing application, modify the repository, test it, and build a WebApp.

Do not ask the owner to explain the architecture before you have read:
`ZAI_BUILD_CONTEXT/README.md`, `MISSION.md`, `PRODUCT-VISION.md`, `SOURCE-OF-TRUTH.md`, `BUILD-PROTOCOL.md`, `HARD-PROBLEM-REGISTRY.md`, and `OUTPUT-CONTRACT.md`.

Your job is to build, not merely report.

### First turn

1. Clone/use `main`.
2. Read ZAI_BUILD_CONTEXT completely.
3. Inspect the current runnable Ω product.
4. Launch it.
5. Launch the browser and determine what can actually be exercised.
6. Establish a baseline with tests/build/typecheck.
7. Identify the highest-impact hard problem whose prerequisites are available.
8. Solve **one** major hard problem.
9. Integrate it into a real product path.
10. Build/update the WebApp output surface.
11. Create the hard-problem ZIP package.
12. Write TURN-0001.md and update BUILD-LEDGER.json.
13. Commit the complete coherent turn.

### Do not do this

Do not:
- spend the first turn doing another archaeology pass;
- rewrite Ω from scratch because Legacy is larger;
- copy Legacy architecture;
- create a second ontology;
- create a second provenance system;
- create a second agent OS;
- declare browser/provider behavior solved from mocks;
- hide uncertainty;
- make broad abstractions before the first vertical proof;
- wait for human guidance when an experiment is locally possible.

### Build aggressively

You are expected to:
- inspect deeply when the active hard problem requires it;
- use browser automation/real browser interaction;
- implement missing runtime pieces;
- refactor;
- add tests;
- create fixtures;
- build UI;
- run end-to-end tests;
- package reusable solutions.

The objective is not minimum code. It is maximum **validated product progress per turn**.

### The first likely attack

Start with HP-01 unless current evidence shows a prerequisite or safer adjacent problem must be solved first.

Do not implement “Account” as CRUD.

Prove the entire chain:

Account → Session → Browser Resource → Realization → real external effect → Result → Evidence

The hardest question is not “can VIVIM send a message?” It is:

**Can VIVIM prove which user-owned account, session and browser resource produced that external effect, and can it recover that relationship safely?**

If yes, build it into a reusable governed core.

If no, identify exactly what is missing and solve that.

### Then keep going

After HP-01, attack HP-02/03/04 as the external-substrate gate, then durable Work/world, then provider knowledge/freshness, then Legacy parity and product continuity.

Do not wait for the owner between these if the environment permits autonomous execution. Each turn remains one major problem with a complete report and reusable package.
