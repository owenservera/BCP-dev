# VIVIM System Intelligence — Pass 3
> Classification: DERIVED — CURRENT CHARACTERIZATION / DESIGN CONVERGENCE
> Status: design candidates and experiment requirements; no production implementation; no Ω law changes.
> Date: 2026-09-25

## Mission

Pass 3 converts Pass 1 reconstruction and Pass 2 structural falsification into a small set of coupled design boundaries that can be experimentally tested before V1 implementation accelerates.

This pass is deliberately **not**:
- production implementation;
- another broad archaeology pass;
- a new ontology/provenance/agent system;
- an Ω redesign;
- a commitment that any design candidate below is already law.

## Source basis

Primary current evidence:
- Pass 1: `research/system-intelligence-archaeology` @ `a7971a0557c464786b0db922cff34ae799e91767`
- Pass 2: `research/system-intelligence-pass2` @ `bc07a9434728dad768ef6bc946bea1264e10b48b`
- current Ω code/contracts under `omega-baseline/omega-final/`
- Legacy behavioral evidence under `vivim-original-baseline/vivim-final-enhanced/`
- destination and V1 sprint documents under `docs/destination/`

Requested `AGENTS_CONTEXT/PRODUCT_VISION/HANDOFF-2026-09-25.md` and `CONVERSATION-2026-09-25-SYSTEM-INTELLIGENCE.json` were not present at the requested paths on the Pass 2 tree and are therefore **not treated as read evidence**. The durable `STATE.md` and repository artifacts were used instead.

## Method

Six coupled characterization streams were reconciled:
- DC-01 External Identity / Browser
- DC-02 World / Data Evolution
- DC-03 Provider Knowledge / Healing
- DC-04 Composition / Reprogrammability
- DC-05 Self-Knowledge / Product Continuity
- DC-06 Legacy Parity / Cross-System Red Team

Every major boundary was traced through:
**control flow + data flow + authority flow + evidence flow + lifecycle/recovery flow**.

## Design status vocabulary

- **OBSERVED** — directly present in current repository behavior or code.
- **EVIDENCE-SUPPORTED** — supported by multiple current/legacy artifacts or established destination rules.
- **DESIGN-CANDIDATE** — proposed shape to test before implementation authority.
- **EXPERIMENT-REQUIRED** — external or behavioral uncertainty blocks safe generalization.
- **UNRESOLVED** — materially open design question.
- **REJECTED** — candidate explicitly excluded by the evidence or governing architecture.
- **PROMOTION-CANDIDATE** — design or mechanism ready for implementation consideration after named experiment/proof.

## Central conclusion

The critical V1 coupling is not four independent subsystems. It is one chain:

```
USER INTENT
  ↓
CANONICAL CAPABILITY
  ↓
VALID REALIZATION
  ↓
ACCOUNT
  ↓
SESSION
  ↓
BROWSER RESOURCE / EXTERNAL PROVIDER
  ↓
RESULT
  ↓
DURABLE WORK + EVIDENCE
  ↓
WORLD / SURFACE
  ↓
SELF-KNOWLEDGE
```

The smallest design set that unlocks the most implementation is therefore:
1. Account / Session / Browser Resource relationship contract.
2. Routing policy and selection-decision model.
3. Canonical object envelope + relationship/lifecycle rules.
4. Durable Work identity/checkpoint/evidence model.
5. Provider Knowledge derived aggregation + freshness basis.
6. Self-Knowledge freshness/invalidation rule.

These designs must be paired with the eight mandatory experiments in `EXPERIMENT-MATRIX.md`.

## Hard boundary

No document in this directory changes Ω law. Where a candidate needs a new contract, namespace, runtime rule, host surface, or law amendment, this pass records that as an implementation prerequisite rather than making the change.

## Exit condition

Pass 3 is complete when:
- these coupled boundaries are explicit;
- each mandatory experiment has a falsifier and acceptance criteria;
- Legacy behavioral floor is identified;
- automatic vs human-approved vs developer/core evolution boundaries are explicit;
- V1 build order can proceed without guessing across the critical seams.
