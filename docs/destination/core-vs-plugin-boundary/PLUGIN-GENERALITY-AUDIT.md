# Plugin Generality Audit

The same boundary should be usable by first-party and third-party plugins.

1. A system plugin declares identity, dependencies, capabilities and contracts exactly as an extension does.
2. Both cross the same Port and capability egress mechanisms.
3. Both are admitted through the same structural integrity rules.
4. Both expose lifecycle and refusal/outcome contracts.
5. Both participate in dependency and impact metadata.
6. Both are replaceable unless a separately documented constitutional dependency exists.

Trust tiers may differ in permissions or provenance, but not by an undocumented privileged execution path.

Stress cases: remove vivim.chat; replace vivim-nlcl; replace vivim-vault; replace browser realization; add an object plugin; add a third-party surface; add a Forge-generated plugin. A failure of these cases should identify the missing contract or explicit trust seam, not automatically enlarge K0.