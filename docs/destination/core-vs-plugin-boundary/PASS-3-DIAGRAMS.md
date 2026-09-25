# PASS-3 DIAGRAMS

> Eight required adversarial diagrams. Derived research only.

## 1. Actual host call graph

main.ts
  -> ensureVault() -> platform seam + root key bootstrap
  -> bootWithRecovery()
       -> parseRecipe()
       -> verifyRecipeSignature()
       -> verifyCompositionInvariants()
       -> verifyEntryWithRootAsync()
            -> contentHashDirAsync() + signature verification
       -> bootComposition()
            -> bootstrapKernel() -> graph + audit + state + tool registry
            -> PortRouter -> register / registerDormant / mintTokensFor
            -> checkoutCompartment() -> Worker + omega-shim Port

Runtime call:
plugin shim -> PortRouter -> token ownership/generation/scope -> target resolution -> risk/law gate -> queue/dispatch -> target plugin -> PortResult/stream

## 2. K0 responsibility extraction from current host

KEEP K0: admission, integrity, isolation/Port, egress/token enforcement, activation/recovery, generic lifecycle.
REDUCE/PROVE: state arbitration, graph storage/provenance, generation registry.
EXTRACT: CLI, composition compiler, graph analytics, audit export, worker-pool optimization, vault-format initialization and scheduling policy.

## 3. K0 <-> K1 <-> plugin privilege flow

USER-SIGNED RECIPE
      |
      v
   K0 CORE: admit / isolate / enforce egress
      |
    K1 wire
      |
  +---+------------------+
  |                      |
  v                      v
system plugin        extension plugin
  |                      |
  +---------+------------+
            v
      product/domain work
            |
            v
      evidence/result

## 4. First-party versus third-party privilege

SAME GOVERNED BOUNDARY
       |
   +---+---+
   |       |
   v       v
FIRST     THIRD
PARTY     PARTY
 plugin    plugin
   |       |
   +--- K0 egress ---+
             |
           Port
             |
      explicit trust tier

Failure of symmetry is evidence of a missing contract or an explicit trust boundary, not automatic evidence for larger K0.

## 5. Zero-plugin bootstrap

trusted runtime inputs
       -> K0 boot
       -> parse + verify EMPTY composition
       -> valid empty
       -> diagnostic / install state
       -> inspect / explain / install
       -> signed non-empty Recipe
       -> normal VIVIM composition

Current repository reality diverges here: parseRecipe() rejects empty composition and verifyCompositionInvariants() requires vivim.law at bootPhase 0.

## 6. Active Work during plugin replacement

CANONICAL WORK
workId + objective + planRef + authority + evidence
                 |
        implementation binding
                 |
       +---------+---------+
       v                   v
   old plugin          new candidate
       |                   |
       +--- impact -------+
               |
        compatibility
               |
        authority decision
               |
        K0 staged activation
               |
        verify / monitor
          /            \
       continue      migrate / pause / refuse / reconcile

External side effects in flight remain UNKNOWN_EFFECT until evidence resolves them.

## 7. Contract evolution boundary

K1 v1 -> proposal v2 -> impact graph -> compatibility -> authority/migration
                         |
              +----------+----------+
              |                     |
        compatible              breaking
              |                     |
          coexist/activate     migrate/refuse
              |                     |
              +---------+-----------+
                        v
              K0 admits resulting composition

Semantic compatibility cannot be inferred merely from structural TypeScript compatibility.

## 8. Host semantic leakage map

HOST
 |
 +-- product semantics -> extract / contract redesign
 |   vivim.law identity
 |   vault initialization
 |   CLI composition compiler
 |   domain-specific routing/scheduling policy
 |
 +-- universal mechanisms -> K0 candidate
 |   admission
 |   integrity
 |   isolation
 |   egress
 |   activation/recovery
 |
 +-- analysis/optimization -> plugin or tooling
     blast radius
     audit export
     worker pooling