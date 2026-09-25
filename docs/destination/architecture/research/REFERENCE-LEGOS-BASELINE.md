# Reference Legos Baseline

> Classification: DERIVED — CODING-READINESS RECONCILIATION
> Date: 2026-09-25
> Scope: smallest useful first-party/reference pieces.
> Authority: derived from Ω law, System Intelligence, destination mappings and Legacy evidence.

## Selection rule

A reference piece earns a place in the first set when it both:
1. gives the person a recognizable capability; and
2. exercises a reusable factory seam.

The goal is not a feature catalog. The goal is a **small reference ecosystem whose pieces teach the building language by working together**.

## Smallest useful reference set

### 1. vivim.law — authority reference

Purpose:
- demonstrates that capability availability is not permission;
- supplies the governed action/effect boundary.

Factory seam exercised:
Capability → Authority → refusal/consent.

Evidence:
- `omega-baseline/omega-final/plugins/vivim-law/plugin.json`
- SI-010104 and SI-050104 in `docs/destination/system-intelligence/`
- current Ω law in `docs/decisions/CURRENT-INVARIANTS.md`.

### 2. vivim.vault — durable truth/evidence reference

Purpose:
- gives the composition a durable local home;
- preserves revisions and evidence;
- demonstrates the product/data boundary.

Factory seam:
Object/Work/Evidence → durable vault.

Evidence:
- `omega-baseline/omega-final/plugins/vivim-vault/plugin.json`
- SI-010103, SI-050105, SI-050107.

### 3. vivim.run — Work/execution reference

Purpose:
- turns a capability request into an attributable execution subject;
- provides the first bridge from interaction to useful work.

Factory seam:
Capability → Work → execution → result/evidence.

Evidence:
- `omega-baseline/omega-final/plugins/vivim-run/plugin.json`
- `docs/destination/AGENCY-BACKGROUND-ATTENTION-RECONCILIATION.md`
- SI-050105.

### 4. vivim.mind — World/context reference

Purpose:
- exposes a bounded derived WorldModel lens;
- demonstrates that canonical world truth is not owned by a surface.

Factory seam:
Vault/canonical state → World projection → context.

Evidence:
- `omega-baseline/omega-final/plugins/vivim-mind/plugin.json`
- `docs/destination/WORLD-WORKSPACE-CANVAS-RECONCILIATION.md`
- SI-050106.

### 5. vivim.nlcl / intent path — universal interaction reference

Purpose:
- gives the person a common way to address a target and express intent;
- demonstrates convergence of natural/symbolic interaction onto deterministic intent.

Factory seam:
Address → Intent → Capability.

Evidence:
- `omega-baseline/omega-final/contracts/src/intent.ts`
- D-411 / current invariants;
- `AGENTS_CONTEXT/PERSONAL_AGENT/AGENT.md`;
- `docs/destination/INTERACTION-INTENT-WORK-RECONCILIATION.md`.

### 6. provider-browser — first external realization reference

Purpose:
- demonstrates that one semantic capability can be realized through an authenticated external/browser path;
- enforces the V1 Chrome-only decision.

Factory seam:
Capability → Realization → Account/Session → browser execution → evidence.

Evidence:
- `omega-baseline/omega-final/plugins/provider-browser/`
- SI-050102 / SI-050103;
- D-418 and D-456;
- current V1 law says no AI-API realization ships.

### 7. Forge / forge.author — factory creation reference

Purpose:
- demonstrates the meta-capability that lets the ordinary user eventually create or modify a piece;
- remains a plugin, not a privileged Core path.

Factory seam:
Factory → candidate plugin → proof/promotion → ordinary plugin.

Evidence:
- `omega-baseline/omega-final/docs/forge/OMEGA-FORGE-ARCHITECTURE.md`
- `CURRENT-INVARIANTS.md` Forge constitution;
- `docs/destination/EVERYTHING-IS-A-PLUGIN-EVOLUTION-CONSTITUTION.md`.

## Why these seven are enough

Together they cover the minimum semantic chain:

```text
Address / Intent
      ↓
Capability
      ↓
Realization
      ↓
Authority
      ↓
Work
      ↓
Execution
      ↓
Evidence / Vault
      ↓
World projection
      ↓
Factory evolution
```

They intentionally do **not** attempt to deliver:
- all provider families;
- all accounts/routing policies;
- a complete project/canvas product;
- universal acquisition;
- autonomous evolution;
- a complete notification/attention platform.

## Legacy harvest attached to the references

Harvest behavior, not architecture:

| Legacy evidence | First-build treatment |
|---|---|
| ChromeGovernor/profile isolation | informs provider-browser substrate/account/session discipline |
| ProviderMux | informs later user-owned routing policy; do not port as authority |
| SemanticGroundingEngine | informs address/context grounding |
| Guided Interaction Probing | informs provider realization discovery |
| StreamAlignment | informs browser stream evidence/repair |
| ParserSynthesis / SelectorHealer | later provider-maintenance realization |
| ProviderHealthKernel | later health/degradation lifecycle |
| replay fixtures | immediate proof asset |
| adaptive-workspace / canvas / conversation organization | later product surface/reference composition |

Sources:
- `docs/destination/product-experience/research/PRODUCT-EXPERIENCE-ARCHAEOLOGY.md` on `research/steward-product-experience`;
- `docs/destination/legacy-harvest/HARVEST-SYNTHESIS.md`;
- System Intelligence SI-02 and SI-05 evidence.

## Reference-piece criterion

A piece is “reference” when a future third-party author can inspect it and learn:
- what it declares;
- how it enters a composition;
- how it receives capability authority;
- how it exposes/consumes contracts;
- how it persists or produces evidence;
- how it can later be replaced.

The reference set is therefore intentionally small and asymmetric: it prioritizes architectural teaching value over product breadth.

ROUND 1 FINDING: READY