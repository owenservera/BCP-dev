# State

STATUS: RESEARCH COMPLETE — CHARACTERIZED DESIGN CANDIDATE
Browser: NOT REQUIRED
AI: NOT REQUIRED
Production code: NOT CHANGED

Completed:
- reconciled destination model with System Intelligence Pass 1–3;
- traced START → INITIALIZE → CREATE/OPEN INSTANCE → LOAD COMPOSITION → CREATE/OPEN WORLD → USE → MUTATE → CLOSE → REOPEN;
- characterized durable, reconstructable and ephemeral state;
- analyzed current Ω boot/composition/vault/recovery/export/migration boundaries;
- defined the Product Instance boundary without creating a second storage model;
- documented nine required owner-machine falsifiers and their acceptance criteria;
- documented the current activation-promotion gap and full-instance-export gap;
- produced implementation blueprint and open frontier.

Important current findings:
1. Product Instance must be a durable identity/lifecycle boundary over the existing user-owned vault.
2. The runtime process is a session, not the instance.
3. World remains a projection over canonical vault data/relationships, not a second database.
4. Verified composition is not necessarily activated composition.
5. Current boot can pin an incoming recipe before bootComposition succeeds; activation needs a transaction/rollback boundary.
6. Current vault export/import proves vault reconstruction, not full installed Product Instance reconstruction.
7. Root-of-trust key portability/rebinding remains an unresolved exit dependency.
8. Current recipe schema does not model optional composition entries.
9. Existing vault durability is the strongest current persistence substrate; Product Instance lifecycle metadata should ride that substrate rather than create another store.

Fresh local falsifier execution:
BLOCKED. The session runtime could not resolve github.com for a repository-local clone, so no new local pass/fail claims are made.

Primary artifact:
docs/destination/product-instance-core/PRODUCT-INSTANCE-CORE-RESEARCH.md

Research commit:
0f48d8aa36202ff86242c5f5c94439226461d488

Next gate:
owner-machine execution of F1–F9, then ratification of the Product Instance contract/namespace/writer before implementation.
