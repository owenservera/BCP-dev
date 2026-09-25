# Pass 3 — Provider System Design

> Classification: DERIVED — DESIGN CANDIDATES
> Status: provider/account/routing/knowledge convergence package.

## 1. Provider, Account, Realization, Session

```
PROVIDER
  external service/system identity
      ↓
ACCOUNT
  user's authenticated relationship
      ↓
REALIZATION
  verified implementation of a semantic capability
      ↓
SESSION
  current execution relationship
      ↓
BROWSER RESOURCE (where applicable)
  concrete profile/process/target resource
```

These are distinct because they answer different questions.

## 2. Account data candidate

```
Account
  accountId
  providerId
  userScope
  localLabel
  externalIdentity
  authState
  capabilityRefs[]
  modelRefs[]
  realizationRefs[]
  sessionRefs[]
  routingPolicyRefs[]
  health
  provenance/evidence
  createdAt
  updatedAt
```

Credentials are not embedded. They remain reference-only under existing credential law.

External identity may be provider-specific. The canonical field is a relationship to verified provider observations, not a guessed email string.

### Account states

Use domain state separate from the generic runtime LifecycleState:

```
DISCOVERED
→ AUTHENTICATED
→ ACTIVE
→ DEGRADED
→ EXPIRED / REAUTH_REQUIRED
→ DISCONNECTED
→ RETIRED
```

These are design labels, not a new Ω lifecycle enum.

## 3. Session data candidate

```
Session
  sessionId
  accountRef
  providerRef
  realizationRef
  browserResourceRef?
  state
  authObservationRef
  acquiredAt
  lastSeen
  lease/refreshedUntil?
  reconnectPolicy
  failureReason?
  releaseReason?
  provenance/evidence
```

A Session must not become a second Account record.

### Session states

```
NEW
→ ATTACHING
→ READY
→ IN_USE
→ STALE / AUTH_EXPIRED
→ RECONNECTING
→ RELEASED / FAILED
```

Current Ω `ATTACHED/RELEASED` is therefore best treated as a minimal implementation state, not the final product semantics.

## 4. Browser Resource data candidate

```
BrowserResource
  resourceId
  accountRef?
  browserFamily
  profileRef
  processRef
  targetRef
  localEndpointRef
  ownershipProof
  lockState
  state
  capabilityScope
  generation
  createdAt
  lastSeen
```

The debugPort is a locator, not the identity.

### Resource states

```
ALLOCATED
→ ATTACHING
→ READY
→ BUSY
→ IDLE
→ STALE
→ RESTARTING
→ RELEASED / QUARANTINED
```

The actual process/profile/target identity model is **EXPERIMENT-REQUIRED**.

## 5. Master / slave design candidate

Legacy behavior supplies the naming and behavior evidence.

Design candidate:
- **Master** = local resource/session supervisor that allocates, tracks, recovers and releases browser resources.
- **Slave** = one controlled browser process/profile resource owned by the master and associated with an account/session scope.

This is intentionally not a host-layer requirement. Under Ω B5, it belongs in plugin/platform/resource management unless experiments prove a host primitive is unavoidable.

A future implementation can rename these concepts without changing the semantics if the resource ownership contract remains.

## 6. Routing policy

Routing selects **among already valid candidates**.

Candidate policy shape:
```
RoutingPolicy
  policyId
  scope
  match
  candidateOrder[]
  constraints[]
  fallback
  learningMode
  approvalMode
  priority
```

Precedence candidate:
```
hard forbidden constraints
→ explicit one-shot instruction
→ scoped user policy
→ global user policy
→ authorized fallback
→ learned ranking
→ unresolved / ask
```

No learned ranking can:
- grant authority;
- violate a hard user constraint;
- silently substitute an account;
- create a new realization.

## 7. Selection decision

Every consequential selection should reconstruct:
```
intent/request
capability
policy scope
candidate set
excluded candidates
selection
account
model
realization
session
authority result
actual outcome
evidence
```

This is richer than the current computation `ResolveDecision`, which proves computation classification but does not yet encode the complete provider/account selection product semantics.

## 8. Provider Knowledge View

Derived from:
```
provider manifests
+ discovery candidates/observations/mappings/graphs
+ parser definitions/pins
+ realization rows
+ provider/account/session observations
+ evidence
```

Outputs:
- provider identity;
- capabilities;
- provider extensions;
- known models;
- realization families;
- parser versions;
- verification state;
- account observations;
- current freshness;
- unresolved contradictions.

The view is **not authoritative**. It is a recomputable projection.

## 9. Discovery/healing lifecycle

```
DISCOVER
→ OBSERVE
→ INFER
→ MAP
→ VERIFY
→ REALIZE
→ EXECUTE
→ EVIDENCE

DRIFT
→ DETECT
→ DIAGNOSE
→ REPAIR
→ TEST
→ PROBATION
→ PROMOTE / REJECT / ROLLBACK
```

Promotion remains governed by existing realization lifecycle and authority. Forge may produce candidate repairs/proposals but cannot grant promotion.

## 10. Canonical vs provider-specific

Canonical:
- capability meaning;
- user Account relationship;
- Work;
- Evidence;
- policy;
- standard lifecycle questions.

Provider-specific:
- DOM selectors;
- page structure;
- stream format;
- target discovery heuristics;
- model naming quirks;
- auth observations;
- provider-only capability extensions.

The second provider is the decisive falsifier.

## 11. Acceptance criteria

A provider design is ready for implementation when:
- account identity can be verified;
- session binding is attributable;
- routing produces deterministic policy-explainable selection;
- provider-specific knowledge stays inside realization/extension boundaries;
- live execution records the actual account/session/resource path;
- drift can move a realization out of promotion without deleting history.

**Conclusion: PROMOTION-CANDIDATE after E1–E5.**
