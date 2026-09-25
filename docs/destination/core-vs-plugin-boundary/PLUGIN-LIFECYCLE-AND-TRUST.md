# Plugin Lifecycle and Trust

## Lifecycle

A plugin is a temporal object:

proposed → verified candidate → staged → active → degraded/quarantined → deprecated → retired

K0 enforces the generic transition boundary. Plugins determine domain health, compatibility, migration and user-facing consequences.

## Trust dimensions

Keep these separate:

- provenance: where the artifact came from;
- integrity: whether the admitted bytes match;
- generality: what independent contexts it has been proven against;
- capability authority: what it may do;
- semantic confidence: how certain an interpretation is;
- runtime health: whether it currently functions.

The Ω manifest model already separates provenance from generality. First-party does not imply generic, and third-party does not imply incapable of generic behavior.

## System versus extension

A system plugin is selected by the default composition. An extension plugin is user/third-party supplied. Both pass through the same structural admission, protocol and egress boundary.

Any trust-tier difference should be explicit data, not an undocumented private host path.

## Authority chain

plugin declares capability → composition grants capability → K0 validates invocation authority → plugin performs behavior → evidence records result

Creation does not confer authority.

## Health does not imply authority

A healthy plugin can lack permission for a specific action. An authorized plugin can be degraded. These dimensions must not collapse into one “trusted” flag.