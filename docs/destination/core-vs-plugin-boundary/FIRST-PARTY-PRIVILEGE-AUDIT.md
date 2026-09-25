# FIRST-PARTY-PRIVILEGE-AUDIT

| Plugin | Host capabilities requested | Direct runtime APIs observed | Special boot/routing treatment | Symmetry read |
|---|---|---|---|---|
| vivim.law | host.journal.append; host.tokens.revoke; host.kernel.lens; vault ports | plugin-local data structures; no host source import observed | bootPhase 0 is hardcoded in Recipe verifier | UNDERPROVEN because boot-role identity is privileged |
| vivim.agent | vault/law/invoke/message ports; no host capability in manifest | node:crypto direct import observed | normal worker plugin | PROVEN boundary symmetry, subject to ambient runtime privilege |
| vivim.run | host.compartment.admin plus port capability | worker/process-related plugin logic | manages scheduling/quarantine through host ops | UNDERPROVEN until third-party path tested |
| provider.browser | vault/credential.redact/law forbidden ports; no host capability | node:crypto; localhost CDP adapter | provider-specific ChatGPT realization | PROVEN SYSTEM PLUGIN; no Core privilege justified |
| vivim.mind | read-only law/vault ports | plugin-local data derivation | normal worker plugin | PROVEN SYSTEM PLUGIN |
| vivim.nlcl | mind.snapshot port | deterministic NLCL library import | normal worker plugin | PROVEN SYSTEM PLUGIN |
| vivim.vault | no requested capabilities | filesystem/database runtime APIs are intrinsic to its storage role | none beyond bootstrap ordering/dependency | PROVEN SYSTEM PLUGIN; OS access is not evidence of Core |

## Key finding FP-01

First-party plugins are not uniformly privileged by manifest capability alone. However, current source does not yet prove complete third-party symmetry because the runtime shim/worker model does not provide a demonstrated hostile-extension sandbox at the OS level.

## Key finding FP-02

vivim.law has a special boot-phase role in ratified Ω law. This is not proof that all of law belongs in Core. The preferred reduction is a generic signed bootstrap-role mechanism.

## Key finding FP-03

vivim.run receives host compartment-admin capabilities because transport/lifecycle administration is currently split between host and system plugin. The capability itself is host-enforced. The remaining question is whether the scheduling/quarantine semantics truly need that host capability or can be exposed through a smaller generic lifecycle contract.

## Audit result

PROVEN SYSTEM PLUGIN for the seven first-party domains as domains. Complete privilege symmetry remains UNDERPROVEN pending a third-party hostile-plugin experiment and a bootstrap-role replacement experiment.