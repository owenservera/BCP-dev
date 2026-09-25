# K0-FINAL-PROOF-MATRIX

| Candidate | Protected invariant | Exact bypass | Why plugin cannot safely own it | Minimal mechanism | Universal? | Domain-neutral? | Current implementation | Result |
|---|---|---|---|---|---|---|---|---|
| Recipe admission | Only granted composition executes | Plugin self-admits | Guest cannot be its own trust root | Verify signed Recipe before spawn | YES | YES | boot.ts / recipe.ts | PROVEN K0 |
| Manifest integrity | Declared manifest bytes are admitted bytes | Mutable manifest accepted | Guest could alter its declaration | Manifest hash + signature verification | YES | YES | recipe.ts | PROVEN K0 |
| Content integrity | Plugin bytes match admitted digest | Changed bytes execute | Plugin must not certify itself | Content hash verification | YES | YES | canon.ts / recipe.ts | PROVEN K0 |
| Signature verification | Untrusted signer cannot masquerade as grantor | Fake signature accepted | Verification root cannot be guest-owned | Ed25519 verification | YES | YES | canon.ts | PROVEN K0 |
| Plugin identity | Composition refers to stable admitted identities | Identity collision/substitution | Identity root cannot be delegated | Stable root/bootstrap identity | YES | YES | genesis.ts / recipe.ts | UNDERPROVEN |
| Composition identity | One exact composition is activated | Ambiguous/changed composition becomes live | Activation identity must be bound | Signed Recipe identity + hash | YES | YES | recipe.ts | UNDERPROVEN |
| Plugin isolation | Plugin cannot bypass compartment boundary | Direct cross-plugin runtime state | Guest cannot define its own isolation | Separate Worker + Port | YES | YES | worker.ts / shim | PROVEN K0 for coupling; UNDERPROVEN as OS sandbox |
| Port transport | All inter-compartment calls cross one boundary | Ambient private channel | Duplicate transport path defeats enforcement | postMessage Port path | YES | YES | worker.ts / ports.ts / shim | PROVEN K0 |
| Capability token verification | Caller cannot invoke ungranted host capability | Forged/reused token | Guest cannot be sole authority | Host-side token check | YES | YES | ports.ts | PROVEN K0 |
| Token ownership | Token cannot transfer silently | Leaked token used by another plugin | Ownership must be outside guest | pluginId binding | YES | YES | ports.ts | PROVEN K0 |
| Revocation | Old capability remains unusable | Stale grant after revocation | Guest cannot police all callers | Host generation/revocation | YES | YES | ports.ts | PROVEN K0 |
| Generation fencing | In-flight call stays on authorized generation | Mid-call implementation swap | Continuity boundary is runtime-wide | Held target/generation pin | YES | YES | contract.ts / ports.ts | UNDERPROVEN K0 |
| Activation atomicity | No partial composition becomes live | Torn pin/swap | Guest cannot atomically control trust root | tmp + atomic rename | YES | YES | canon.ts / recipe.ts | PROVEN K0 |
| Recovery boundary | Failure returns to known-good composition | Broken incoming recipe destroys working pin | Guest cannot own recovery root | Verify-then-pin + pinned fallback | YES | YES | recovery.ts | PROVEN K0 |
| State arbitration | Shared state cannot race into corruption | Two writers interleave | Universal runtime race needs one trusted arbiter | Keyed acquisition/fence | YES | YES | state.ts | UNDERPROVEN K0 |
| Graph lookup | Runtime can resolve exactly one routed implementation | Duplicate/ambiguous target | Guest cannot redefine safe dispatch globally | Minimal immutable op→impl map | YES | YES | graph.ts / ports.ts | EXPERIMENT-REQUIRED |
| Generation resolution | Caller sees compatible implementation | Unsafe version drift | Could be protocol/plugin logic | Range match + held resolution | YES | YES | contract.ts | EXPERIMENT-REQUIRED |
| Grant provenance | Granted edges cannot be fabricated | Unproven capability edge enters kernel state | Trust boundary needs integrity binding | Verify signed grant before admission | YES | YES | audit.ts / graph.ts | UNDERPROVEN K0 |
| Platform seam | Runtime has a safe owner-scoped OS boundary | Arbitrary path/identity crossing | Lowest OS boundary cannot be delegated | Minimal platform adapter | YES | YES | boot.ts / omega-platform | UNDERPROVEN K0 |
| Lifecycle containment | Invalid lifecycle transition cannot bypass activation fence | Execute before ready/after revoke | Generic lifecycle must remain enforced | Admit/start/stop/recover state transitions | YES | YES | worker.ts / boot.ts | PROVEN K0 |
| Executable-entry confinement | Executed file must be inside admitted hashed tree | Manifest entry escapes source dir | Guest cannot choose unhashed bytes | Canonical in-tree entry validation | YES | YES | recipe.ts + worker.ts | CONTRADICTED |

## Reduction result

The current host contains more than the irreducible kernel. The strongest proven K0 nucleus is admission/integrity, isolation/transport, egress enforcement, revocation/fencing, atomic activation/recovery and generic lifecycle. State arbitration, graph provenance and generation continuity remain K0 candidates but are not fully reduction-proven.