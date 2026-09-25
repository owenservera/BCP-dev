# Core Kernel Map

| K0 responsibility | Why non-bypassable | K1 contract | Plugin remainder |
|---|---|---|---|
| Recipe/manifest admission | Otherwise code can execute outside declared grant | Manifest/Recipe | plugin declaration |
| Integrity/hash/signature | Trust root cannot be delegated to guest | identity/digest refs | artifact meaning |
| Isolation/Port transport | Guest must not bypass compartment boundary | Port/message protocol | domain behavior |
| Capability egress | Guest cannot be sole judge of authority | capability ref/token | definition and policy |
| Revocation/fencing | Stale authority must be mechanically stopped | generation/refusal protocol | authority policy |
| Atomic activation/recovery | Partial composition cannot become live | activation envelope | domain recovery |
| Minimal platform seam | Runtime needs safe owner-scoped OS boundary | platform ref | OS features |
| Crypto/canonical encoding | Shared trust identity must be stable | identity refs | domain identity |
| Generic lifecycle | Safe admit/stop/recover must not depend on domain semantics | lifecycle protocol | domain lifecycle |

Explicit exclusions: vault implementation, Work implementation, law policy content, consent semantics, objects, relationships, World, Intent interpreter, NLCL, Spatial Intent, Context, Agent, Account, Session, Provider, Browser, Routing, Discovery, Healing, Parser, Chat, Memory, Attention, Forge semantics, Surfaces, Product Instance and product diagnostics.