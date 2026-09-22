# ADR 008 — LLM-Driven Migration (P0/P0-1.w) vs Deterministic Probes

Date: 2026-08-29
Status: accepted
DRI: migration-lead + boundary-auditor

## Context

The I-2 deep probe (I-2-PROBE-SPEC.md) defines 8 deterministic probe scripts that emit evidence docs (per-file truth map, contract-consumer, context-reach, prisma audit). The kidx + migration-table then proposes a per-file target (by-file.yaml) via automated AST + rules.

Risk identified: running the kidx targets as a batch ``Copy-Item`` + shim loop is not a migration — it relocates bytes without proving the constitution (Rule B mechanism vs product, Rule D security vs policy) or the K0/K1 split. For sensitive work (P0 security boundary, P0-1.w L0 substrate, P0-2 policy split), the file’s *actual* imports must be classified against KERNEL-CONTRACTS.md (C-02 the critical one) and PLUGIN-TRUST-MODEL.md, not trusted blindly from kidx. The by-file target is a proposal, not a verdict.

## Decision

1. **Deterministic probes remain evidence, not execution.** The 8 probes are the source of truth for “what exists today” (every file, every Prisma model, every event kind). They are runnable via ``bun run .runtime/probe-*.ts`` and exit 1 on surprises. They do not move files.

2. **Per-PR execution is LLM-driven and auditable.** For each PR’s file, the agent must:
   a. Read the source file.
   b. Enumerate its imports and classify each as **K0 (universal)** vs **K1 (VIVIM-specific)** against PLUGIN-TRUST-MODEL and KERNEL-CONTRACTS C-02.
   c. Decide **MOVE vs SPLIT vs KEEP** on the file’s real content (e.g. types.ts: branded IDs + VIVIM_AI_PROTOCOL stay K0, provider shapes → plugin contracts). The kidx target is a proposal.
   d. Do the work surgically (mechanism to K0, product to K1, fix imports by contract map — no regex).
   e. Prove it with the 3-gate per-PR check: kernel-l0-isolation (K0 file must not import from K1), boot-without-l0-substrate (kernel boots with TF-IDF only), contractVersion (every new contract pinned by a test).

3. **Gates are hard.** P0-1 and P0-1.w require **two-reviewer** before merge. The orchestrator’s ``gate`` (14/24 + 12/12 + 0) is mandatory; the 3-gate per-PR check is mandatory for P0-1.w and P0-3.

4. **Batch shimming is not P0 execution.** Moving 31 NLCL categories by batch is not a P0-1.w pass — it is relocation. The auditable P0-1.w pass re-migrates those files one by one with the steps above, collapsing shims where the split was wrong.

## Consequences

- The loop is **per-PR, not per-batch**. ``continue`` means one audited cycle (gate → read → classify → work → 3-gate → complete → advance → next). ``/migrate`` in full-batch mode is blocked until the by-file targets are reconciled with the truth map.
- The migration plan’s P0-1.w section is updated (see BOUNDARY-MIGRATION-PLAN.md §P0-1.w addendum).
- New status and dashboard fields: ``evidenceVerified`` per PR (probe output exists) and ``contractVerified`` per PR (C-02 check passed).
- No change to the constitution or contract surfaces — only to execution discipline.

## Alternatives considered

- **Run kidx targets as-is.** Rejected: the constitution’s Rule B/D splits are not AST-derivable without contract classification.
- **Defer all LLM work to “later re-migration.”** Rejected: that leaves the boundary unverified on the path to release.
