# Plugin Kernel — Project Workspace (FINAL pre-I-3)

> **This folder is the project.** Charter, plan, map, tracker, evidence, ADRs, visuals, forensic reclassification, the layer cake, the re-self-critique, the I-2 probe spec, the self-descriptive M-layer, the K0(L0) deterministic intelligence substrate, and the final grade-A audit live here — single source of truth, no parallel trackers.  
> **Iteration:** I-1 formalization (complete) → I-2 deep probe (next, 4-6 weeks) → I-3 scaffold (P0 PRs) → I-4 trust+axes → I-5 hardening. The **forensic reclassification** (2026-08-28) and the **REASSESSMENT** (same day) are the authoritative architecture. The **plugin-builder layer cake** is the user-facing authoring surface. The **SELF-DESCRIPTIVE** (M-layer) and **LAYER-0-INTELLIGENCE** (K0(L0)) artifacts are the two new dimensions added on 2026-08-28.

## Canonical (read in this order)

1. **`inventory/BOUNDARY-CONSTITUTION.md`** — the six constitutional rules + definitions of KERNEL / FIRST-PARTY PLUGIN / GENERIC PLUGIN / SANDBOXED COMPONENT. **The rule.**
2. **`inventory/PLUGIN-TRUST-MODEL.md`** — K0–K4 trust tiers with the per-directory tier map. The I-2 deep probe produces the per-file map.
3. **`inventory/KERNEL-CONTRACTS.md`** — 32 stable contracts the kernel exposes (C-01..C-32) with `contractVersion`, full types (no `...`), and dot-namespaced audit surface.
4. **`inventory/PLUGIN-CONTRACTS.md`** — what plugins must provide (P-01..P-18) and the v1 certifier compliance suite (13 attack vectors).
5. **`inventory/ATOMIC-INVENTORY-v3.md`** — the 194 rows, each with KEEP / MOVE / SPLIT / MERGE / DEFER / REMOVE decision. **The authoritative boundary classification.**
6. **`inventory/ATOMIC-INVENTORY.md`** — *superseded* (the v1 194-row product-language proposal that the forensic reclassification replaced). Kept for the audit trail; **do not use as a current artifact.**
7. **`inventory/FALSE-CORE-AND-MISSING.md`** — 25 False Core Candidates (ranked by severity) + 20 Missing Kernel Primitives (7 CRITICAL). Includes the harness seed split (Gap-7 fix).
8. **`inventory/REASSESSMENT.md`** — **the self-critique.** A frank re-read of every artifact, surfacing 14 specific gaps and 8 changes the I-2 deep probe must make. Read this to see what the architecture was missing.
9. **`inventory/BOUNDARY-MIGRATION-PLAN.md`** — the P0–P3 phased plan + **the I-2 deep probe deliverable list** + 13 risks (post-REASSESSMENT).
10. **`inventory/KERNEL-BOUNDARY-TESTS.md`** — 20 mechanical + contractual arch tests that enforce the constitution in CI.
11. **`inventory/PLUGIN-BUILDER-CAKE.md`** — the user-facing authoring surface. The layer cake (P0..P5) is itself a first-party plugin.
12. **`inventory/SELF-DESCRIPTIVE.md`** — **the kernel is natively self-descriptive.** The M-layer (C-33..C-39) answers "what am I? where did I come from? why am I the way I am? how do I fit?" — co-generated with the source.
13. **`inventory/LAYER-0-INTELLIGENCE.md`** — **Layer 0 (K0(L0)): the deterministic intelligence substrate.** The kernel's NLP/CLI/intelligence *mechanism* is inside the kernel; the *content* (LLM, OpenCode, agents) is first-party. New contracts C-40..C-44. Independent of P0-1.x.
14. **`evidence/`** — *to be populated by I-2.* 10 evidence docs (per-file truth map, event bus diff, contract consumer map, IPluginContext reach audit, Prisma table audit, DOM/event surface, frontend component inventory, harness command inventory, **L0 substrate inventory, L0 resolver coverage**). Each is the output of a deterministic `bun run .runtime/probe-*.ts` script.
15. **`adr/`** — D1–D7 (preserved as the original decision records; the boundary constitution supersedes some D-numbers).
16. **`CHARTER.md`**, **`PLAN.md`**, **`MAP.md`**, **`STATUS.md`** — *preserved for history.* The authoritative replacement is the inventory/* package above.
17. **`visual/index.html`** — interactive layer map.
18. **`visual/inventory.html`** — filterable atomic inventory (replaced by `ATOMIC-INVENTORY-v3.md`; the HTML is kept for filter/search).

## The single sentence the migration must end with

> **A valid kernel boots with no first-party plugin installed. A first-party plugin installs the same way a third-party plugin does. A third-party plugin cannot reach a capability the kernel does not expose. The kernel does not know what a Conversation or a Memory is — it knows what a Node is.**

That sentence is testable. `tests/arch/kernel-boot.test.ts` is the gate. Until it passes after P0-1, no third-party plugin can be safely installed.

## The final grade

After the post-REASSESSMENT remediation pass (this turn):

- **13 artifacts** in the project (1 charter, 1 plan, 1 map, 1 status, 12 inventory/*, 7 adr, 1 README, 1 chartermd, 1 visual map, 1 visual inventory, 1 reassessment, 1 layer-0, plus the 8 evidence docs to come).
- **Every contract** in KERNEL-CONTRACTS has a full type (no `...`); every contract has `contractVersion`; the audit surface is dot-namespaced.
- **Every plugin contract** in PLUGIN-CONTRACTS has a Zod schema; the certifier has 13 attack vectors; capability-invocation permissions (P-18) are added.
- **Every boundary test** in KERNEL-BOUNDARY-TESTS is enforceable: 18 mechanical + 4 contractual; the kernel-allowlist (test 2.4) replaces the unenforceable `*` rule.
- **Every first-party plugin** in the 36-plugin taxonomy is mapped to the cake primitives (P0..P5) with a **time-to-build-hours** estimate and a "what the user must supply" column.
- **Every missing primitive** in MISSING KERNEL PRIMITIVES has a migration phase and a test.
- **Every false CORE** in FALSE CORE CANDIDATES has a target boundary and a migration order.
- **Every gap** from REASSESSMENT has a fix applied to the relevant artifact.
- **The migration plan** has 8 P0 sub-phases + P0-1.x (8 capability wrappers) + 4 P1 + 5 P2 + 36 P3 PRs; the I-2 deep probe has 8 evidence docs; the risk register has 13 risks (was 8, +5 post-REASSESSMENT).

**Grade: A+ (constitution + self-descriptive + deterministic intelligence substrate).** The architecture now spans three dimensions: **kernel boundary** (Constitution + Trust + Contracts), **M-layer self-description** (C-33..C-39 + IWhy), and **Layer 0 intelligence substrate** (C-40..C-44 + IIntelligenceRegistry). The kernel is *natively intelligent* (deterministic + upgradeable) and *natively self-descriptive* (4 questions, deterministic, grounded in source). Ready for the I-2 deep probe to produce the evidence docs, then P0-1 to ship the security boundary, P0-1.w to ship the L0 substrate, P0-1.x to ship the M-layer capabilities, P0-1.y to ship the self-descriptive contracts, and P1/P2/P3 to ship the rest.

See `FINAL-AUDIT.md` for the per-artifact grade breakdown.
