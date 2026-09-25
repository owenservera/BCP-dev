# Recovery and Replay Harvest

## Replay evidence

- `src/engines/autonomous-replay.ts`
- `src/engines/autonomous-execution.ts`
- `tests/unit/engines/autonomous-replay.test.ts`

Legacy can replay in place or create a branch. Branch replay gives the variant new ids, preserves the original timeline, executes the new path and produces a diff.

**Invariant:** alternative execution has its own identity and causal relationship to the original.

**Destination:** preserve branching/lineage; prefer child Work/revision semantics. In-place replay should not mutate historical evidence.

## Recovery evidence

- `src/engines/storage-relocation-engine.ts`
- `src/engines/backup-manager.ts`

Storage relocation writes a crash marker before switching, detects incomplete migrations at boot and rolls back to the original location. Backups are created before migration and retained under a bounded policy.

**Invariant:** interrupted transitions are detectable, explainable and recoverable.

**Destination:** rebuild around vault revisions, explicit migration phases, verification before cutover and durable recovery evidence.

## Export evidence

`src/engines/export.ts` supports scoped export, a manifest, optional passphrase encryption and table-aware import ordering.

**Destination:** portable artifacts should be canonical object/vault envelopes, not table dumps.

## Questions

- Are original Work/evidence histories immutable under replay?
- Does restore create new revisions?
- Can interrupted restore resume safely?
- Are Work/evidence semantics included in portable scope?
- Are external secrets/account resources separately controlled?
