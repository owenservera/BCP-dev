# V1 Critical Areas

No composite score is used. The dimensions below remain independent.

| Area | Dependency reach | Product reach | Boundary count | External reality | Complexity | Uncertainty | Evidence | Legacy dependence | Experiment | Design | Implementation |
|---|---|---|---|---|---|---|---|---|---|---|---|
| Provider abstraction | high | high | high | high | high | high | mixed | high | YES | YES | YES |
| Provider protocol knowledge | high | high | high | high | high | high | mixed | very high | YES | YES | YES |
| Provider onboarding/healing | high | J5/J7 | high | very high | high | high | mixed | very high | YES | YES | YES |
| Routing | high | J3/J5 | high | high | high | high | weak/mixed | very high | YES | YES | YES |
| Account/session lifecycle | very high | J3/J5/J8 | very high | very high | high | very high | weak | very high | YES | YES | YES |
| Chrome substrate | high | J3/J5/J7 | very high | very high | high | very high | very high | mixed | YES | YES | YES |
| Shared vs bespoke | high | cross-cutting | high | high | high | high | mixed | high | YES | YES | YES |
| Plugin capability graph | high | J3/J7 | high | medium | medium-high | medium | strong | medium | targeted | YES | YES |
| Self-knowledge | high | J1/J7/J8 | high | medium | high | high | mixed | medium | targeted | YES | YES |
| Reprogrammability | high | J7 | very high | medium | high | high | mixed | high | YES | YES | YES |
| Product Instance/persistence | very high | J1/J2/J8 | high | low | high | high | mixed | medium | YES | YES | YES |
| Legacy parity | high | J1/J2/J4/J6/J8 | many | medium | high | high | strong legacy | very high | targeted | YES | YES |
| Durable Work/continuity | very high | J4/J6/J7 | high | medium-high | high | very high | weak/mixed | very high | YES | YES | YES |
| Self-evolving data model | high | cross-cutting | high | medium | high | high | mixed | high | YES | YES | YES |

## Immediate interpretation

The largest V1 risks are not isolated plugins. They are **Account/Session/Browser identity, routing, Product Instance persistence, canonical data evolution, and durable Work/continuity**. Those seams cross many subsystems and have weak external or product proof.
