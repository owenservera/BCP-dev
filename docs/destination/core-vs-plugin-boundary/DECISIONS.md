# Boundary Decisions

D-01 — K0 is an enforcement kernel, not a product feature set.

D-02 — K1 is a protocol vocabulary layer and must not become a second privileged runtime.

D-03 — First-party system plugins remain plugins even when bundled, essential or boot-required.

D-04 — Policy enforcement and policy content are separate responsibilities.

D-05 — Canonical domain data and product ontology remain outside K0; Core protects generic integrity and boundary mechanics.

D-06 — Provider/browser machinery remains replaceable realization/plugin behavior.

D-07 — Evolution is a governed temporal dimension of the plugin architecture, not a reason to grow Core.

D-08 — Zero-plugin bootstrap is a valid runtime state and must not secretly depend on product plugins.

D-09 — Plugin dependency metadata should support change impact without making the complete product graph a kernel concern.

D-10 — Any K0 addition requires a why-not-plugin argument, named falsifier and evidence before implementation.