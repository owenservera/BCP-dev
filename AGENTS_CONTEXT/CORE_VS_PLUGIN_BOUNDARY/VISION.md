# Vision — Core vs Plugin Boundary

VIVIM should be able to evolve its product without continually expanding the trusted kernel.

The desired architecture is:

~~~text
Ω CORE
  enforces the conditions under which computation may safely exist

CONTRACTS
  define the common language across boundaries

PLUGINS
  supply product meaning, domain behavior, realizations, projections, and evolution candidates

TOOLING
  develops, verifies, studies, and operates the system without becoming runtime authority
~~~

The end state is not a tiny VIVIM with its features removed. It is a VIVIM whose features are genuinely plugin-native.

That means the default product itself should be able to demonstrate its own plugin model: first-party behavior should use the same boundary contracts available to legitimate extensions, subject only to explicitly justified trust-tier differences.

The kernel should become harder to grow and easier to trust as the product becomes more capable.