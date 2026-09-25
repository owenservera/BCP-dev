# LAUNCH PROMPT — VIVIM Core vs Plugin Boundary — PASS 3: ADVERSARIAL CLOSURE

Repository:
https://github.com/owenservera/BCP-dev

Branch:
research/core-vs-plugin-boundary

PR:
#46

This is Pass 3 — Adversarial Core Boundary Closure.

Pass 1 established the boundary model.
Pass 2 tied it to concrete Ω host/plugin implementation and expanded the evidence layer.

Do not restart the research. Do not merely add prose. Do not implement production code.

MISSION

Determine whether the current K0/K1/System-Plugin boundary is strong enough to become the implementation gate for future VIVIM work.

The governing test is:

> K0 is the smallest non-bypassable, domain-neutral runtime mechanism required to let plugins safely exist.

Attack both directions:
- FALSE POSITIVE: something classified K0 does not actually need to be K0.
- FALSE NEGATIVE: something classified K1/plugin actually requires non-bypassable kernel authority.

Use these classifications only:
PROVEN K0
PROVEN K1
PROVEN SYSTEM PLUGIN
PROVEN EXTENSION PLUGIN
TOOLING / OUTSIDE RUNTIME
UNDERPROVEN
EXPERIMENT-REQUIRED
CONTRADICTED

Do not promote underproven claims through narrative confidence.

FIRST READ

Read the existing project/program context in the established order, then:
- docs/destination/core-vs-plugin-boundary/RESEARCH-SYNTHESIS.md
- BOUNDARY-CONSTITUTION.md
- K0-PROOF-OBLIGATIONS.md
- RESPONSIBILITY-DECISION-LEDGER.md
- CURRENT-OMEGA-IMPLEMENTATION-MAP.md
- K0-K1-PLUGIN-REVIEW-CHECKLIST.md
- MINIMUM-ZERO-PLUGIN-STATE.md
- STRESS-CASE-RESULTS.md
- PLUGIN-LIFECYCLE-AND-TRUST.md
- CONTRACT-EVOLUTION.md
- docs/destination/CORE-VS-PLUGIN-BOUNDARY-DISTILLATION.md
- omega-baseline/omega-final/docs/decisions/CURRENT-INVARIANTS.md
- omega-baseline/omega-final/docs/BUILD-DECISIONS.md
- docs/agent-system/workstreams/WS-005/PHASE-1-KERNEL-BASELINE.md

CODE-LEVEL SCOPE

Audit all current Ω host source:
omega-baseline/omega-final/host/src/

In particular:
audit.ts
boot.ts
canon.ts
contract.ts
genesis.ts
graph.ts
main.ts
ports.ts
recipe.ts
recovery.ts
state.ts
worker.ts

Also audit:
omega-baseline/omega-final/contracts/src/
omega-baseline/omega-final/shim/src/

And representative first-party/system plugins:
vivim-law
vivim-agent
vivim-run
provider-browser
vivim-mind
vivim-nlcl
vivim-vault

Trace imports, calls, authority, mutable state, capability flows, and execution paths. Host placement is NOT proof of K0 necessity.

PASS 3A — HOST FILE-BY-FILE AUDIT

For every host file classify:
- responsibility
- K0/K1/plugin-like/mixed
- invariant protected
- exact bypass if externalized
- domain/product semantics present
- state ownership
- authority ownership
- replacement seam
- falsifier
- confidence

Deeply attack:
state.ts:
- Is StateArbitrator genuinely K0?
- What universal corruption occurs without it?
- Can a smaller compare/fence primitive replace it?
- Is it semantic policy?

graph.ts:
separate graph storage, lookup, grant representation, capability identity, routing, impact analysis, provenance, and snapshots.
Determine what, if anything, is truly K0.

contract.ts:
separate version identity, publication, range matching, generation resolution, pinning, execution lifetime.
Find the smallest continuity primitive.

audit.ts:
separate cryptographic integrity/signing, provenance, grant history, audit storage/querying, evidence semantics.
Identify the irreducible K0 portion.

genesis.ts:
audit every hardcoded identity. Explain why it cannot be signed bootstrap data or earlier trust material.

canon.ts:
separate canonical encoding, hashing, signature verification/signing, atomic write, filesystem mechanics, key storage, content hashing.

boot.ts / recipe.ts:
trace parse → compile → verify → admit → activate → fallback → spawn.
Identify exact trust boundary and avoid mixing tooling, contracts, and K0.

worker.ts:
separate compartment creation, transport, readiness, termination, crash propagation, resource monitoring, pool policy, platform mechanics.

ports.ts:
trace plugin call → token validation → scope → target → law gate → queue → deadline → dispatch → result → failure.
Mark every responsibility K0/K1/plugin-like/historical convenience.
Especially inspect callLaw, host-op dispatch, risk handling, routing, queue priority, budgets, lazy spawn, graph registration, token minting, journal, state acquisition, audit export, dormant entries, generation resolution.

PASS 3B — SEMANTIC LEAKAGE

Search host/contracts for product semantics including:
chat, provider, account, session, browser, Chrome, canvas, workspace, memory, attention, project, World, NLCL, intent, routing policy, consent, delegation, surface, Forge, healing, parser, model/provider selection.

For every finding:
current location → semantic meaning → why it exists → constitutional necessity → extraction location → replacement seam.

Search imports, special-case plugin IDs, string literals, product enums, boot branches, routing exceptions, and host APIs created solely for current system plugins.

Question:
> Does the host know anything it does not need to know in order to protect the boundary?

PASS 3C — FIRST-PARTY PRIVILEGE AUDIT

For vivim.law, vivim.agent, vivim.run, provider-browser, vivim.mind, vivim-nlcl, vivim-vault determine:
- host capabilities
- host operations
- direct host imports
- direct worker/filesystem/process APIs
- undocumented runtime access
- private host assumptions
- special boot/routing/trust treatment
- whether an equivalent third-party plugin gets the same boundary

Use UNKNOWN where evidence is missing.

PASS 3D — K1 CONTRACT AUDIT

Audit:
Manifest, Recipe, Port, Lifecycle, Capability, Outcome/Refusal, Plugin reference, Object reference, Revision reference, Evidence reference, Intent reference, Work reference, Authority frame, Change reference, Provider realization, Runtime tier, resource/budget declarations.

For each determine:
true protocol / semantic API / product API / historical artifact / host-only vocabulary.

Ask:
- must every plugin understand it?
- can an unrelated third-party plugin implement it?
- does it exchange meaning or define meaning?
- does it require host enforcement?
- does it privilege VIVIM semantics?
- how can its meaning evolve?

PASS 3E — FORMAL K0 PROOF MATRIX

Create:
Candidate | Protected invariant | Exact bypass | Why plugin cannot safely own it | Minimal mechanism | Universal? | Domain-neutral? | Current implementation | Falsifier | Result

At minimum:
Recipe admission
Manifest integrity
Content integrity
Signature verification
Plugin identity
Composition identity
Plugin isolation
Port transport
Capability token verification
Token ownership
Revocation
Generation fencing
Activation atomicity
Recovery boundary
State arbitration
Graph lookup
Generation resolution
Grant provenance
Platform seam
Lifecycle containment

For each candidate, attempt to shrink it. Do not accept a whole subsystem when only a primitive is constitutional.

PASS 3F — FALSE-NEGATIVE SEARCH

Attack current plugin/K1 classification of:
Vault, Work, Law, Intent, Authority, World, Evidence, Object identity, Relationship identity, Product Instance, Evolution, Migration, Impact, Provider, Account, Session, Browser, Routing, Discovery, Self-Knowledge, Spatial Intent, Agent, Forge, Memory, Attention, Surface.

Ask whether any universal safety property becomes unenforceable without K0. If yes, isolate only the minimum mechanism rather than moving the subsystem wholesale into K0.

PASS 3G — ZERO-PLUGIN BOOT

Turn MINIMUM-ZERO-PLUGIN-STATE.md into an explicit proof model:
boot inputs, initial identities, contracts, capabilities, diagnostics, admission mechanism, valid empty composition, inspectability, unavailable functions, failure when no composition exists.

Distinguish real constitutional dependency from implementation convenience.

PASS 3H — ACTIVE WORK REPLACEMENT

Define the exact boundary for replacing Work implementation while Work is active:
canonical Work identity, Plan version, implementation plugin, Attempt, effect identity, authority context, evidence, replacement candidate, compatibility, continuation/migration.

Determine:
what stays stable; what may change; who computes compatibility; who decides authority; what K0 enforces; what Work owns; what Evolution owns; what happens when continuation is impossible.

PASS 3I — B5 HOST MINIMALITY

Host is currently 1500/1500 LOC under B5.

Audit every current host responsibility:
must remain K0? could shrink? could move K1? could move plugin/tooling? estimated extraction path?

Optimize semantic minimality, not LOC for its own sake. Do not exceed the constitutional host cap merely to make the proof convenient.

PASS 3J — FINAL VERDICT

Produce:
K0 PROVEN
K0 UNDERPROVEN
K1 PROVEN
SYSTEM PLUGINS PROVEN
EXTENSION PLUGINS PROVEN
TOOLING
EXPERIMENT REQUIRED

For every underproven K0 item:
missing evidence → resolving experiment → whether implementation is blocked.

REQUIRED NEW ARTIFACTS

Under docs/destination/core-vs-plugin-boundary/ create:
HOST-SEMANTIC-LEAKAGE-AUDIT.md
K0-FINAL-PROOF-MATRIX.md
HOST-RESPONSIBILITY-BY-FILE.md
K1-CONTRACT-BOUNDARY-AUDIT.md
FIRST-PARTY-PRIVILEGE-AUDIT.md
K0-MINIMALITY-AND-B5-AUDIT.md
ZERO-PLUGIN-BOOT-PROOF.md
ACTIVE-WORK-REPLACEMENT-BOUNDARY.md
FINAL-BOUNDARY-VERDICT.md
PASS-3-EVIDENCE-INDEX.md

Update existing package artifacts where conclusions change. Do not silently overwrite earlier conclusions; record overturned decisions and evidence.

REQUIRED DIAGRAMS

1. Actual host call graph
2. K0 responsibility extraction from current host
3. K0 ↔ K1 ↔ plugin privilege flow
4. First-party versus third-party privilege paths
5. Zero-plugin bootstrap
6. Active Work during plugin replacement
7. Contract evolution boundary
8. Host semantic leakage map

REQUIRED FALSIFIERS

At minimum:
F-P3-01 current K0 file contains safely extractable product semantics
F-P3-02 plugin-owned responsibility bypasses a universal safety property
F-P3-03 first-party plugin requires undocumented privilege
F-P3-04 K1 contract requires first-party implementation knowledge
F-P3-05 zero-plugin boot depends on product plugin
F-P3-06 active Work continuation requires Work semantics in K0
F-P3-07 StateArbitrator can safely live outside K0
F-P3-08 capability graph can be reduced below current host implementation
F-P3-09 generation resolution does not require current host placement
F-P3-10 grant provenance can survive without current host audit subsystem
F-P3-11 host rule is product policy rather than universal enforcement
F-P3-12 B1 executable-entry confinement remains unresolved
F-P3-13 B5 cap prevents necessary constitutional enforcement despite valid extraction opportunities

RULES

1. Importance is not proof of K0.
2. Technical implementability outside K0 is not enough; test the safety property.
3. Separate concept from mechanism.
4. Preserve ratified Ω law.
5. No production code.
6. Prefer shrinking K0 and strengthening K1 over enlarging K0.
7. No undocumented first-party privilege.
8. Record UNKNOWN honestly.
9. Treat host placement as archaeological evidence, not constitutional proof.
10. Do not create another research lane unless a genuinely distinct architectural problem emerges.

COMPLETION GATE

Pass 3 is complete only when:
- every host/src file has a responsibility classification;
- every K0 responsibility has an explicit bypass proof;
- every K0 candidate has been reduction-tested;
- major plugin responsibilities have been attacked for K0 necessity;
- K1 contracts have been audited for semantic leakage;
- first-party privilege symmetry has been checked from source;
- zero-plugin boot has an explicit proof model;
- active Work replacement has a complete boundary model;
- B5 has been audited;
- B1 entry confinement is explicitly resolved or clearly left open;
- all unresolved K0 candidates are named;
- every conclusion has evidence status;
- the package is internally consistent;
- no production code is introduced.

FINAL OUTPUT

End with:
FINAL K0:
FINAL K1:
SYSTEM PLUGINS:
EXTENSION PLUGINS:
TOOLING:
UNDERPROVEN:
REAL K0 GAPS:
FALSE-CORE FINDINGS:
B1 STATUS:
ZERO-PLUGIN STATUS:
ACTIVE-WORK REPLACEMENT STATUS:
B5 STATUS:
IMPLEMENTATION BLOCKERS:
NEXT RESEARCH NEEDED:

Then report:
branch
commit SHA
PR
package root
files added
files updated
production code changed: NO

The intended outcome is a defensible implementation gate for Core vs K1 vs plugin, not another conceptual essay.