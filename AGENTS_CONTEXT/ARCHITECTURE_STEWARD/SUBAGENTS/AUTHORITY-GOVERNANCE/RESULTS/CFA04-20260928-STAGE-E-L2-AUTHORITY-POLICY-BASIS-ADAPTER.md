SESSION_STATUS: COMPLETE
SESSION_ID: CFA04-20260928-STAGE-E-L2-AUTHORITY-POLICY-BASIS-ADAPTER
CFA / AGENT: CFA-04 / authority-governance
TASK: Characterize the CFA-04 Authority/Policy basis adapter for Stage-E L2.

RESULT: COMPLETE — CHARACTERIZED / PARTIAL.

The adapter identifies the current governing policy basis as policyId `law.policy`, policy version `1.9.0`, law manifest version `0.3.0`, with governed contract references `law.describe@1` and `invoke.check@1`. Current repository file revisions are recorded as evidence. The runtime immutable source binding remains UNKNOWN because the current law manifest contentHash is empty and law.describe@1 does not expose a policy/source digest.

FRESHNESS: A material governing source change is STALE; missing attributable governing basis is UNRESOLVABLE; incompatible declared/source observations are CONFLICTED.

FALSIFIER: change a material policy rule while retaining version 1.9.0; a version-only comparison must not falsely preserve CURRENT status.

BOUNDARY: self-knowledge describes its governing dependency but never interprets freshness as authorization. Live permission remains separately resolved by the existing Authority/law gate.

NO_IMPLEMENTATION: no runtime adapter, schema freeze, Ω-law change, new authority store, or production code.

ARTIFACT: STAGE-E-L2-CFA04-AUTHORITY-POLICY-BASIS-ADAPTER-CHARACTERIZATION-2026-09-28.md
