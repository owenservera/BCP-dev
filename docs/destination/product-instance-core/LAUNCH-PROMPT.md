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