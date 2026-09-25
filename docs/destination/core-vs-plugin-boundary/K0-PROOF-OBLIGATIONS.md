# K0 Proof Obligations

A K0 claim requires evidence that the responsibility cannot safely be delegated to a plugin.

Every K0 candidate records:

1. Protected invariant.
2. Concrete bypass scenario if the responsibility moves outward.
3. Cross-plugin universality argument.
4. Domain-neutrality argument.
5. Smallest mechanism that blocks the bypass.
6. Removal experiment.
7. Observable falsifier.
8. Change class: ordinary evolution or constitutional evolution.

## Proof families

### Admission
A plugin cannot execute by inventing or modifying its own admission grant.

### Isolation
A plugin cannot reach another compartment through an undocumented privileged path.

### Egress
A plugin cannot mint, widen or replay authority outside the runtime-enforced capability boundary.

### Activation
An invalid or partially verified composition cannot become the running composition.

### Recovery
A failed activation has an auditable path back to a known-good composition.

### Integrity
The bytes executed are the bytes actually admitted.

### Constitutional amendment
Ordinary runtime behavior cannot rewrite the trust root or structural K0 invariants.

## Anti-pattern

Do not prove Core membership from centrality. “Everything depends on it” proves only graph centrality. K0 requires a property that cannot be safely delegated.