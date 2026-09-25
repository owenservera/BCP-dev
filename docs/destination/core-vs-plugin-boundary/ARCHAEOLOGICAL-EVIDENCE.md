# Archaeological Evidence — Core vs Plugin Boundary

> Derived evidence ledger. Ratified Ω law remains authoritative.

## Current Ω host evidence

### B1 — admission and integrity
CURRENT-INVARIANTS establishes that code executes only when a signed manifest entry in the user-signed Recipe references the content hash. Delegating this check to a guest would let that guest redefine its own admission condition. This is direct K0 evidence.

### B2 — isolation and transport
omega-baseline/omega-final/host/src/worker.ts implements one worker-thread compartment per plugin and states that the host owns transport while lifecycle policy belongs outside the host. It also records an important limitation: worker isolation protects coupling but current Bun behavior does not fully bound process exhaustion. This separates K0 isolation mechanics from plugin/resource economics.

### B3 — egress authority
omega-baseline/omega-final/host/src/ports.ts contains host-side token ownership, generation, revocation and operation-to-capability enforcement. It checks token ownership before revocation, rejects undeclared caller ranges, and routes through graph/tool resolution. This is K0 enforcement around K1 capability vocabulary and plugin-owned capability meaning.

### B4 — recovery boundary
omega-baseline/omega-final/host/src/canon.ts provides the atomic-write primitive used by the rename boundary. CURRENT-INVARIANTS defines verification failure, pinned-recipe fallback and atomic durability as recovery law. The generic safety boundary is kernel territory; domain recovery remains outside.

### B5 — host minimality
The ratified law freezes host/src at 1,500 LOC with a remove-to-add rule. This is architectural evidence, not just a budget: product growth is expected to happen through plugins rather than by turning the host into a product monolith.

## Genesis evidence

omega-baseline/omega-final/host/src/genesis.ts is a particularly clean K0 example. It hardcodes only a closed bootstrap identity set and says later plugins, tools and grants are ordinary Recipe data. The kernel exposes generic graph/audit/state/tool machinery rather than chat, provider or canvas semantics.

The StateArbitrator is kernel-adjacent because it prevents an authority race at the runtime boundary; what it arbitrates is not product policy.

## Contract evidence

contracts/src/lifecycle.ts defines host operations, host capabilities and their deterministic mapping. contracts/src/manifest.ts defines contribution kinds, risk classes, runtime tiers, dependency references, budgets, content hashes, granularity and generality metadata. The manifest is a request; the signed Recipe is the grantor.

This is exactly the K1 pattern: rich declarations cross the boundary without turning every declaration into host code.

## Plugin-law evidence

plugins/vivim-law/src/invocation.ts and standing.ts demonstrate that rich authority semantics can live in plugins while structural enforcement remains at the runtime boundary.

plugins/vivim-law/src/apertureprivacy.ts places privacy classes, taint, ratchets and disclosure decisions in law code. The host need not know what a secret means; it needs only the enforcement seam that blocks unauthorized egress.

## Evolution evidence

plugins/vivim-agent/src/delegation.ts and adaptation.ts demonstrate that delegation, expiry, attenuation, revocation and adaptation ceremonies can remain plugin behavior. This is important because these are highly security-sensitive semantics without being reasons to encode policy content in K0.

## Liveness evidence

plugins/vivim-run/src/liveness.ts demonstrates that even resource-sensitive lifecycle behavior can remain a plugin. Budgets, hydration, suspension states and dormancy proofs are domain semantics. K0 only needs generic resource and lifecycle enforcement primitives.

## Overall finding

The repository already contains the desired pattern: hard trust boundary → generic protocol → rich plugin law/domain behavior. The risk is future semantic leakage back into the host, not lack of architectural justification for a larger kernel.