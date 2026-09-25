# Launch Prompt — VIVIM Product Instance / Persistence Core

Repository: https://github.com/owenservera/BCP-dev

Clone current main.

This is ONE focused deep research/design task:

> Determine and design the canonical VIVIM Product Instance and durable persistence boundary.

Read the destination North Star/principles/conceptual model, VIVIM-PRODUCT-INSTANCE-CORE.md, latest System Intelligence Pass 1–3, Ω boot/composition/vault/recovery code, and export/restore mechanisms.

Do not build the full UI. Do not design browser/provider/account semantics. Do not invent a second storage model. Do not treat the runtime process as the user's instance.

Trace:
START → INITIALIZE → CREATE/OPEN INSTANCE → LOAD COMPOSITION → CREATE/OPEN WORLD → USE → MUTATE → CLOSE → REOPEN.

Determine exactly what survives each boundary and how failure is represented.

Run local falsifiers:
1. crash during boot;
2. crash during persistence;
3. restart after world mutation;
4. missing optional composition/plugin;
5. incompatible composition;
6. export/restore;
7. executable replacement;
8. interrupted migration;
9. corrupted projection with canonical world intact.

Produce an evidence-backed design, implementation blueprint and open frontier.

No production code during research.

## Mandatory repository landing requirement

The research task is not complete while deliverables exist only in the agent workspace, chat, or a downloadable bundle.

Before declaring completion you MUST:
1. Write all required research/design deliverables into `docs/destination/product-instance-core/`.
2. Include the required synthesis, evidence, indexes/experiment results and supporting artifacts defined by this workspace.
3. Update `STATE.md` with final status and exact commit SHA.
4. Commit the complete research package to this research branch.
5. Return the commit SHA and exact paths of key deliverables.
6. Keep/update the GitHub PR so the work is reviewable.

A ZIP is optional/secondary. The committed repository files are the canonical research landing place.

If literal local cloning is unavailable, use the accessible repository interface against the pinned source and still satisfy the GitHub commit/PR requirement. Do not stop at an external bundle.
