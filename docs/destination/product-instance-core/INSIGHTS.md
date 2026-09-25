# Product Instance Core — Insights

> Classification: DERIVED — RESEARCH FINDINGS
> Scope: Product Instance / persistence boundary only.

## I-01 — Instance is a continuity boundary, not a process

A process start/stop is ephemeral. Product Instance identity must survive process restart, executable replacement and runtime reconstruction.

The durable anchor belongs to the user's persistent environment, not to a process ID, worker fleet, browser session, or current in-memory router.

## I-02 — The vault is the persistence spine; do not create a second world store

Current Ω already provides append-only history, revisions, CAS, evidence, recovery, migration and export/import mechanisms.

Product Instance metadata should ride that same persistence substrate. It should describe instance identity and lifecycle without copying canonical world data into another database.

## I-03 — Verification is not activation

Current bootWithRecovery verifies an incoming recipe and pins it before bootComposition completes.

That is safe against invalid signatures/content, but it does not fully protect against a later activation failure. Product Instance activation therefore needs a candidate → verified → compatible → activated boundary, with the prior activation preserved until readiness succeeds.

## I-04 — Vault export is not full Product Instance export

Current D-432 export/import is a strong vault reconstruction mechanism, but it does not by itself capture the complete installed environment: instance identity, active composition materialization, user configuration/presentation state, or trust-key portability/rebinding.

The correct extension is an instance export wrapper around the vault archive, not a second runtime storage format.

## I-05 — World and projection must remain separate

The Product Instance should reopen the canonical world from durable vault facts and relationships.

A corrupted mind snapshot, search index, surface cache or other derived projection must be disposable/rebuildable. Durable user-authored presentation state such as layout is different: it has its own history and should restore from a valid revision or safe default without rewriting canonical world data.

## I-06 — Current Ω does not model optional composition entries

CompositionEntry has no optional flag or failure-tolerant dependency state.

Therefore a missing active recipe entry is currently a composition boot failure. Product-level optionality must not be claimed until an explicit contract is designed.

## I-07 — Bootstrap artifacts are durable but not canonical world truth

The current system keeps root trust key material, format.json, recipe.pinned and built composition material outside the vault changelog.

They remain important verified inputs. Product Instance should record references/digests to them for lifecycle/activation evidence, while keeping the vault as the canonical durable data substrate.

## I-08 — Format compatibility is currently under-specified

ensureVault creates format.json when missing but does not semantically validate an existing value.

A Product Instance open ceremony must validate vault format/schema compatibility before declaring the instance usable.

## I-09 — Full owner-machine falsification remains mandatory

The requested nine local falsifiers were translated into reproducible protocols, but this session could not execute a repository-local clone because the runtime could not resolve github.com.

No fresh local pass/fail result is claimed. Existing repository falsifier evidence remains separately identified as pre-existing evidence.
