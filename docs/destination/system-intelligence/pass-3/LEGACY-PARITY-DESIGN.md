# Pass 3 — Legacy Parity Design

> Classification: DERIVED — BEHAVIORAL FLOOR
> Status: Legacy is evidence for behavior, not architecture law.

## 1. Evidence-backed Legacy strengths

The Legacy mine explicitly documents:
- provider/account/session separation;
- one Chrome profile per provider/account pattern;
- ProviderMux routing strategies and fallbacks;
- ChromeGovernor as a single CDP authority;
- browser watchdog/discovery/mutex/circuit-breaker machinery;
- conversation/history/message identity and stream blocks;
- canvas/workspace/project organization;
- background/automation machinery;
- export/backup and lifecycle tooling;
- provider manifests and parser chains;
- discovery/onboarding/healing pipeline.

The Prisma schema also contains direct account/session/profile links, including:
```
ProviderAccount
  providerId
  loginState
  debugPort
  profileDir
  chromeSlaveId

ProviderSession
  providerId
  accountId
  vivimSessionId

ProfileSession
  providerSessionId
  profileDir
  chromeSlaveId
  port
  state
```

These are strong behavioral clues about the minimum product concepts that must be preserved.

## 2. Mandatory V1 floor

V1 should not claim meaningful Legacy parity unless it preserves:
- intended-account execution;
- provider/account/session/resource separation;
- conversation continuity;
- workspace/project organization;
- inspectable long-running/background state;
- export/recovery behavior;
- discovery/healing evidence path.

## 3. Harvest vs rebuild

### Harvest
- Account identity behavior;
- profile-per-account strategy as an experiment;
- ProviderMux strategy families;
- ChromeGovernor supervision concepts;
- parser/stream fixtures;
- conversation identity/stream continuity;
- workspace/canvas behavioral patterns;
- background continuity patterns;
- backup/recovery workflows.

### Rebuild under destination contracts
- Account;
- Session;
- Browser Resource;
- routing policy;
- Work;
- canonical object envelope;
- world relationships;
- ProviderKnowledgeView;
- self-knowledge freshness.

### Do not carry forward automatically
- anti-detection/stealth stack;
- historical telemetry architecture;
- tunnel/P2P machinery;
- monolithic engine hierarchy;
- DB-driven universal parser authority;
- admin/config UX.

## 4. Parity acceptance model

Parity is behavioral, not line-count or engine-count.

For each Legacy capability:
```
OBSERVED
→ CHARACTERIZED
→ IMPLEMENTED
→ VERIFIED
→ LIVE (where external)
```

A Legacy behavior belongs in the V1 floor when:
- it materially supports a destination journey;
- it is supported by concrete repository behavior;
- removing it would break the intended product continuity/agency.

A feature does not enter the floor merely because it exists in Legacy.

## 5. Negative-space test

Before copying any Legacy mechanism ask:
- Is this a semantic product concept?
- Is it a reusable realization technique?
- Is it provider-specific?
- Is it historical infrastructure?
- Does Ω already solve the underlying problem better?

This prevents “parity” from becoming architectural regression.

**Conclusion: PROMOTION-CANDIDATE** — the seven behavioral floor families above are the parity target, while implementation shape remains open.
