# VIVIM Product Instance / Persistence Core

Research/design lane C. Browser and AI providers are not required.

Mission: characterize the durable user-owned VIVIM Product Instance boundary without turning the runtime process into the instance or creating a second storage model.

## Research result

Status: CHARACTERIZED DESIGN CANDIDATE.

Primary research artifact:
docs/destination/product-instance-core/PRODUCT-INSTANCE-CORE-RESEARCH.md

State:
docs/destination/product-instance-core/STATE.md

Launch prompt:
docs/destination/product-instance-core/LAUNCH-PROMPT.md

## Core conclusion

Product Instance = durable identity/lifecycle boundary over the user's existing vault.

Vault = canonical durable truth.

World = deterministic projection over canonical data/relationships.

Composition = replaceable executable capability.

Process = ephemeral session.

The research also identifies two immediate implementation prerequisites:
- separate candidate recipe verification from active composition promotion;
- add a Product Instance export/reconstruction wrapper above the existing vault export/import.

## Execution note

The launch prompt's owner-machine falsifiers were specified, but no fresh local run is claimed because the execution environment could not establish a repository-local clone. Existing repository falsifier/evidence is cited as existing evidence, not as a new test run.

No production code was changed in this research lane.
