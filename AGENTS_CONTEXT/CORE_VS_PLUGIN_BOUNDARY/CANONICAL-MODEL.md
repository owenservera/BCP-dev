# Canonical Model — Boundary Distillation

## Boundary classes

| Class | Meaning | Primary question |
|---|---|---|
| K0_CORE | Irreducible runtime/trust mechanism | Must this exist before plugins can safely exist? |
| K1_CONTRACT | Shared protocol/vocabulary | Must plugins agree on this, without the kernel owning the product behavior? |
| SYSTEM_PLUGIN | First-party product capability | Can this be replaced/evolved behind the boundary? |
| EXTENSION_PLUGIN | User/third-party capability | Can an external actor implement it using the same governed surface? |
| TOOLING | Development/research/CI/diagnostic machinery | Does it need to exist in the product runtime at all? |

## Ownership dimensions

Every classified responsibility should identify:

- semantic owner;
- runtime owner;
- canonical data owner;
- authority owner;
- evidence owner;
- replacement/evolution seam;
- dependencies and dependents.

## Split rule

Use the strongest separation available:

~~~text
MECHANISM → Core
SHARED VOCABULARY → Contract
DOMAIN / PRODUCT MEANING → Plugin
POLICY CONTENT → Policy plugin
USER EXPERIENCE / PROJECTION → Surface plugin
EXTERNAL REALIZATION → Provider/plugin
DEVELOPMENT SUPPORT → Tooling
~~~

## Important nuance

One conceptual area may be split across classes.

Example:

~~~text
Capability
  contract/reference      → K1
  boundary enforcement   → K0
  capability definition → plugin
  implementation        → plugin
  policy                → law/policy plugin
~~~

The research must prefer such decompositions over forcing an entire concept into one class.