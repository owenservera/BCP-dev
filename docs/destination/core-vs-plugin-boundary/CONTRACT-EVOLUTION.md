# Contract Evolution

K1 is where plugin-native architecture can quietly become a kernel API if contracts become over-specified.

## Change classes

### Additive
New optional capability does not invalidate existing consumers.

### Compatible extension
New version preserves semantic guarantees while adding capability.

### Breaking semantic change
The wire shape remains similar but the meaning changes. This requires impact and migration evidence even if types still compile.

### Constitutional contract change
The contract governs a K0 invariant. This enters the constitutional amendment process.

## Rules

1. Contracts define observable behavior, not implementation ownership.
2. Contract text cannot depend on a specific provider, UI framework or storage engine.
3. Consumers declare contract versions/ranges.
4. Semantic compatibility is tested, not inferred from type compatibility.
5. Historical evidence preserves the old contract/version reference.
6. Contract evolution does not automatically imply new K0 code.

## Falsifier

If two unrelated plugin families cannot implement the contract without importing product-specific host logic, test whether the contract is simply over-specified before considering any kernel expansion.