# Boundary Diagrams

## 1. Kernel / contracts / plugins / tooling

```text
                 CONSTITUTIONAL TRUST
                        │
                        ▼
                 ┌──────────────┐
                 │   K0 CORE     │
                 │ admission    │
                 │ isolation    │
                 │ egress       │
                 │ integrity    │
                 └──────┬───────┘
                        │ K1 protocols
        ┌───────────────┼────────────────┐
        ▼               ▼                ▼
 system plugins   extension plugins   surfaces
        │               │                │
        └───────────────┴────────────────┘
                        ▲
                        │ evidence / contracts
                    TOOLING / FORGE
              (outside runtime authority)
```

## 2. Capability invocation

```text
caller → intent/work → capability reference → K0 egress check → plugin → outcome/evidence
                                      │
                                      └→ refusal if authority/integrity fails
```

## 3. Canonical data

```text
K0: identity/integrity/reference mechanics
        │
K1: object/revision/evidence protocols
        │
Plugin: canonical domain data + semantics + storage implementation
        │
Surface: projection only
```

## 4. Policy split

```text
policy content → law/policy plugin
                         │
                         ▼
                 K1 authority contract
                         │
                         ▼
                 K0 enforcement mechanism
```

## 5. Replacement

```text
observe → propose → impact → compatibility → authority
                                      │
                                      ▼
                             stage new plugin
                                      │
                                      ▼
                            atomic K0 activation
                                      │
                               verify/monitor
                              ↙              ↘
                         promote          rollback
```

## 6. First-party / third-party symmetry

```text
             same K1 + K0 boundary
                    │
          ┌─────────┴─────────┐
          ▼                   ▼
   first-party plugin   third-party plugin
          │                   │
          └────── same Port ──┘
             explicit trust tier only
```

## 7. Impact graph

```text
plugin/contract change
        ↓
metadata graph traversal
        ↓
dependent capabilities / data / Work / slices
        ↓
revalidation set
        ↓
compatibility + authority decision
```

## 8. Trust boundary

```text
constitutional K0
      ↓
protocol K1
      ↓
system plugins
      ↓
extension plugins
      ↓
external providers / realizations

Evidence may cross upward as evidence; it does not become authority merely by crossing the boundary.
```

## 9. Default product

```text
VIVIM default composition
 = Core + contracts + law + vault + work + mind + language
 + agent + providers + credentials + chat + discovery
 + Forge + surfaces + memory/attention + Product Instance

All product rows are replaceable composition members; Core remains minimal.
```