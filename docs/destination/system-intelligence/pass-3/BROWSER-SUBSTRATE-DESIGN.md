# Pass 3 — Browser Substrate Design

> Classification: DERIVED — EXPERIMENT-FIRST DESIGN
> Status: browser/resource semantics are bounded enough to experiment, not proven enough to implement broadly.

## 1. Current Ω substrate

Current provider-browser evidence proves:
- localhost CDP only;
- attached session prerequisite;
- PROMOTED realization prerequisite;
- parser pin prerequisite;
- exact-once send attempt;
- response capture and parser chain;
- evidence refs back to session/capture.

But current `SessionRecord` and `LiveSessionDescriptor` do not prove:
- account ownership;
- profile ownership;
- browser process ownership;
- target ownership;
- lock ownership;
- session expiry;
- reconnect behavior;
- cross-account isolation.

The live client can select an existing ChatGPT page or create one. That is intentionally minimal proof code, but it is insufficient as a canonical identity mechanism.

## 2. Browser resource boundary

Candidate:
```
BrowserResource
  = the smallest externally observable browser unit
    that VIVIM can own, lease, inspect, recover and release.
```

It should be smaller than “Chrome” and larger than a raw tab selector:
- profile is an identity boundary;
- process is a resource boundary;
- target/page is an execution target;
- local endpoint is a transport locator.

## 3. Ownership invariant candidates

1. A debugPort never alone proves account identity.
2. A targetId never alone proves account identity.
3. A profile reference must be tied to the Account relationship.
4. A Session must identify the exact BrowserResource used.
5. A BrowserResource may serve only the account/session scopes allowed by its ownership contract.
6. A concurrent acquisition without an available lock/lease refuses.
7. A lost process/target turns the resource stale rather than silently re-binding to another page.
8. Recovery can rebind only when identity evidence is sufficient.

## 4. Master / slave resource graph

```
VIVIM RESOURCE SUPERVISOR
        │
        ├── Resource A ─ profile A ─ process A ─ target(s)
        │        └── Session A ─ Account A
        │
        └── Resource B ─ profile B ─ process B ─ target(s)
                 └── Session B ─ Account B
```

The same browser resource may support multiple tabs only when the resource contract explicitly permits it; otherwise one target lease is the safe default to test.

## 5. Recovery

Recovery sequence candidate:
```
session detects stale resource
→ inspect known resource identity
→ if same profile/process/target lineage is provable, reattach
→ if only provider page is known, do NOT guess
→ allocate/launch intended resource if policy permits
→ otherwise request re-authentication or user action
```

This is a direct response to the Pass 2 falsifier: “restart Chrome/process and recover intended session/account.”

## 6. Concurrency

Concurrency must be modeled as resource leases, not as a best-effort mutex hidden in provider code.

A Work holds a resource lease through Session.
The lease carries:
- owner Work/Session;
- acquiredAt;
- expiry/heartbeat;
- lock mode;
- release reason.

The exact granularity is experimental.

## 7. Legacy harvest/rebuild

Harvest:
- one-profile-per-account behavior;
- ChromeGovernor resource supervision;
- watchdog;
- discovery;
- circuit breaker;
- mutex/concurrency concepts;
- trace fields accountId/slaveId/cdp method.

Rebuild:
- Account/Session/BrowserResource semantic chain;
- governed evidence;
- plugin boundary;
- provider-specific execution.

Reject:
- making ChromeGovernor a new privileged Ω host surface;
- assuming debugPort/profileDir is canonical identity by string equality alone;
- copying legacy engine hierarchy wholesale.

## 8. Browser experiment acceptance

A browser substrate design is implementable only after:
- E1 proves one account identity chain;
- E2 proves account isolation;
- E3 proves concurrency ownership;
- E4 proves restart/expiry recovery.

**Conclusion: EXPERIMENT-REQUIRED → PROMOTION-CANDIDATE after E1–E4.**
