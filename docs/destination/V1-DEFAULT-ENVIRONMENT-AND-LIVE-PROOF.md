# VIVIM V1 — Default Environment and Live-Proof Reconciliation

> Classification: DERIVED — WORKING PRODUCT / PROOF PLAN
> Status: prepared execution seam; not a release declaration.

## 1. Two things V1 must solve

V1 has two separate requirements.

### Product requirement

A new user must install VIVIM and receive a useful environment immediately.

### Truth requirement

The shipped external-action substrate must actually work against real authenticated Chrome, not only recorded fixtures.

These must not be confused.

## 2. Default V1 environment

V1 should ship as:

~~~text
VIVIM CORE
+
DEFAULT FREE CAPABILITY / PROVIDER SET
+
OPTIONAL CONNECTED ACCOUNTS
+
USER ROUTING / CONFIGURATION
~~~

The default set is release configuration, not a special architectural class.

A bundled provider has the same provider/account/realization semantics as a provider the user later adds.

The product should therefore avoid a permanent distinction between “built-in” and “installed” once the environment is running.

## 3. Default-set selection criteria

The default free set should be chosen by product evidence, not technical convenience.

For each candidate provider/plugin record:

- capability coverage;
- browser-mediated viability;
- free access at release;
- login/onboarding friction;
- account/profile isolation;
- model visibility;
- reliability;
- legal/terms fit;
- failure/recovery behavior;
- user value;
- replaceability.

The exact provider lineup is a release decision and should be verified against then-current provider terms before shipping. This document deliberately does not hard-code a commercial list.

## 4. First-run experience

Conceptually:

~~~text
INSTALL
  ↓
START VIVIM
  ↓
LOCAL VAULT CREATED
  ↓
DEFAULT CAPABILITIES AVAILABLE
  ↓
USER SEES WORLD / EMPTY-WORLD ORIENTATION
  ↓
CONNECT ACCOUNTS
  ↓
VIVIM DISCOVERS AVAILABLE CAPABILITIES
  ↓
USER CONFIGURES DEFAULTS / ROUTING
  ↓
READY TO WORK
~~~

The first run must not require the user to understand plugins, manifests, compositions, or realization status.

Those are inspectable system concepts, not onboarding prerequisites.

## 5. Account onboarding

The user should be able to:

1. choose a provider;
2. authenticate through the provider's normal flow;
3. associate the account with a local VIVIM account object;
4. assign/inspect a browser profile/session realization;
5. see available capabilities/models;
6. accept or modify the initial routing choice.

No secret material should be copied into ordinary work payloads.

The credentials spine remains reference-only.

## 6. V1 routing defaults

Default routing should be visible as user configuration, not a mystery.

A simple first-run configuration could conceptually be:

~~~text
For:
  writing
  research
  coding
  messages
  browsing

Use:
  provider / account / model
~~~

A provider may be the default for one capability and not another.

A project/space can override the global default.

A one-off user instruction can override the standing default within its allowed scope.

## 7. Live-proof boundary

D-418/D-420 establish:

- Chrome master/slave is the shippable substrate;
- no AI-API realization ships in V1;
- browser composition is the shippable composition.

The remaining proof requirement is the real external execution seam.

### Live proof order

1. attach-only to an existing authenticated Chrome session;
2. prove live capture can substitute for the recorded fixture format;
3. prove parser output remains equivalent;
4. perform one real supported operation;
5. verify outgoing payload before submission;
6. capture the provider response;
7. parse the response through the pinned parser;
8. persist result/evidence;
9. release session;
10. repeat with failure/refusal cases.

No new external-operation ambition should be added before this path is green.

## 8. Live account proof

The decisive account falsifier is not simply “login succeeded.”

It is:

~~~text
USER CHOOSES ACCOUNT A
        ↓
ROUTER CHOOSES ACCOUNT A
        ↓
SESSION BINDS ACCOUNT A
        ↓
PROVIDER ACTION RUNS IN ACCOUNT A
        ↓
EVIDENCE IDENTIFIES ACCOUNT A
~~~

A silent substitution to Account B is a product failure even if the action itself succeeds.

## 9. Live provider proof

A provider realization should not become PROMOTED merely because the plugin loads.

Promotion requires the normal discovery/verification lifecycle and evidence.

For the shippable browser path:

~~~text
real authenticated session
        ↓
attach
        ↓
recognized provider
        ↓
recognized archetype
        ↓
verified parser pin
        ↓
governed operation
        ↓
provider result
        ↓
evidence / receipt
~~~

## 10. V1 maturity gates

### V1-G1 — installable

A normal user can install and start VIVIM locally.

### V1-G2 — durable

User data has a known durable location and survives restart.

### V1-G3 — useful

The default environment provides immediately useful capabilities.

### V1-G4 — connected

A user can connect an account through the intended provider path.

### V1-G5 — selectable

The user can see and control provider/account/model choices.

### V1-G6 — live

At least the shipped browser path is proven against a real authenticated provider session.

### V1-G7 — governed

External actions remain law/consent gated and attributable.

### V1-G8 — recoverable

The state of the environment can be backed up/exported/restored.

### V1-G9 — understandable

The user can understand what VIVIM did without reading architecture documents.

### V1-G10 — extensible

The user can add another provider/plugin without changing the product's mental model.

## 11. Product release path

### R1 — foundation

Local install + vault + default environment.

### R2 — account connection

At least one real provider/account path.

### R3 — controlled action

One real action through the standard interaction/routing/law path.

### R4 — multi-provider choice

Two or more valid realizations of a capability and a user-controlled selection.

### R5 — persistent workspace

World/project/context experience works across restart.

### R6 — background work

Authorized work continues and returns with a truthful summary.

### R7 — extension

A new provider/plugin joins through the same capability/realization model.

## 12. What remains blocked by external reality

The repository can complete the following without a user's live machine:

- semantic mapping;
- policy definition;
- contract design;
- fixture falsifiers;
- account data model;
- routing logic;
- product UX specification.

The following require real owner-machine evidence:

- authenticated Chrome session;
- live provider interaction;
- account identity verification in that session;
- real provider response;
- real provider drift;
- long-running/background browser interaction.

Those are explicit proof gates, not reasons to redesign the architecture.

## 13. Immediate owner-machine proof packet

When the live run is available, execute the existing provider-browser test and full Ω gate on the current tree.

The proof packet should capture:

- exact branch/commit;
- live Chrome/profile/account identity;
- attach result;
- capture substitution result;
- parser result;
- governed send result;
- resulting evidence;
- refusal/failure results;
- gate output.

The owner-machine run is evidence for the program; it does not change destination semantics.

## 14. Working conclusion

V1 is not:

> “the first version of every future VIVIM capability.”

It is:

> **a useful sovereign environment, shipped with a default capability set, whose external browser-mediated actions are real, governed, inspectable, and extensible.**

The architecture should therefore optimize V1 around a small complete environment, not a large incomplete inventory.
