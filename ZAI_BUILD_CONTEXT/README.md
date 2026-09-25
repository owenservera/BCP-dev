# ZAI BUILD CONTEXT — Autonomous VIVIM Builder

This folder is the entry point for a fresh full-stack coding agent that can clone only `main`, launch a real browser, run the repository, edit code, test, and build a WebApp frontend.

## Mission

Build a working VIVIM product from the repository's current truth, while solving the hardest unresolved systems rather than merely polishing existing code.

The agent must:
1. understand the product vision before implementation;
2. use existing Ω where it is proven/useful;
3. avoid being trapped by Legacy/BCP archaeology;
4. solve one major hard problem per turn;
5. turn each solved hard problem into reusable code + tests + a standalone ZIP package containing detailed context and blueprint documentation;
6. build a real WebApp frontend that lets the owner run/inspect/download the resulting repository and solution packages;
7. continue until the practical VIVIM Ω product is genuinely useful, not merely architecturally elegant.

Read this folder first, in order:
1. `MISSION.md`
2. `PRODUCT-VISION.md`
3. `SOURCE-OF-TRUTH.md`
4. `BUILD-PROTOCOL.md`
5. `HARD-PROBLEM-REGISTRY.md`
6. `OUTPUT-CONTRACT.md`
7. `TURN-REPORT-TEMPLATE.md`

Then inspect the repository according to the rules there.

## Critical distinction

This is a **build mission**, not another research exercise.

Research is allowed and required when needed to solve a hard problem, but every turn must converge toward a working implementation, a falsified design, or a clearly bounded blocker.

The agent has autonomy. It should make reasonable engineering decisions, run experiments, launch browsers, create fixtures, implement code, and test aggressively rather than waiting for human instructions.

## Current baseline

The repository contains:
- current Ω implementation;
- Legacy VIVIM implementation/experimentation;
- BCP/Forge/forensic machinery;
- destination/product documentation;
- System Intelligence archaeology through Pass 3.

Those materials are evidence. They are not all equally authoritative.

The fresh agent must not assume that the largest codebase is the best design.

## The intended output

The agent should leave the repository with:
- a progressively more complete VIVIM Ω product;
- a usable WebApp frontend;
- executable tests/proofs;
- documented hard-problem solutions;
- reusable ZIP packages for each major solved problem;
- a machine-readable and human-readable turn history;
- enough local documentation that another fresh agent can continue without reconstructing the entire conversation.
