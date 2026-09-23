# Chrome Governor Contract — authority, lifecycle, identity, evidence

> Pinned from VIVIM code (OBSERVED) + Ω constraints. Every invariant is tagged
> [MECHANICAL] (enforced in code/gate today) or [DOCUMENTARY] (claimed, needs
> proof). Documentary invariants are tech debt, not law.

## 1. Authority

- G-1 [DOCUMENTARY]: `ChromeGovernor` is the sole browser I/O authority. Claim
  source: file header + Governor Canon invariant. Proof owed: import scan showing
  zero non-Governor importers of `BunCdpClient`/`cdp-transport` (verification V-3).
- G-2 [DOCUMENTARY]: `CDPProxy` does not bypass Governor rules for any of
  `Runtime.evaluate`, `Input.*`, navigation, network capture, harness actions.
  Proof owed: per-method audit against the proxy (349 lines).
- G-3 [MECHANICAL on Ω side]: Ω never imports the Governor. The Ω browser leg is
  the `provider-browser` BROWSER_MEDIATED realization, fixture-only in sandbox;
  the CDP leg is owner-machine-only future work and is never silently simulated
  (plugin header contract). Violation of this separation fails the slice.

## 2. Lifecycle

- G-4 [OBSERVED VIVIM]: slaves auto-launch on first need (lazy startup);
  FleetSupervisor bounds creation (limits + ProfileAllocator singleton + spawn guard).
- G-5 [OBSERVED VIVIM]: health checks, circuit breakers, reconnect exist as
  mechanisms; exact reconnect exactness is UNKNOWN (risk register).
- G-6 [MECHANICAL on Ω side]: session lifecycle is `browser.attach@1` →
  ops → `browser.release@1`; attach resolves row + ATTACHED + provider-browser +
  archetype `message.send`, else the send bar refuses with a named error.

## 3. Identity

- G-7 [OBSERVED VIVIM]: one profile per (provider, account); cookie files in the
  profile directory are the login-truth source, not the DB row.
- G-8 [OBSERVED Ω]: session ids use the `session:` prefix; vault realization ids
  are `realization:<archetypeSlug>:<providerId>` (single constructor,
  `providerRealizationId`, throws on `:` in parts — MECHANICAL).
- G-9 [DOCUMENTARY]: provider/account → slave resolution is deterministic and
  stable across restarts. Proof owed: resolution-path trace + restart test.

## 4. Execution serialization

- G-10 [INFERRED VIVIM]: Governor serializes execution per slave (AsyncMutex
  re-export observed; exact scope needs confirmation).
- G-11 [MECHANICAL on Ω side]: stream chunks are sequence-checked
  (`checkStreamSeq`); emit-after-final throws → DEGRADED; unknown ops REFUSED;
  handler-throw → DEGRADED (never crash); oversized captures refused, never truncated.

## 5. Health / reconnect / recovery

- G-12 [OBSERVED VIVIM mechanisms, UNKNOWN guarantees]: health ticks, fleet
  events, circuit-breaker state, provider health rows exist as data.
- G-13 [DOCUMENTARY]: auth recovery (`isAuthenticated` → relogin-ready flow)
  is a real production path, not a compatibility stub. Proof owed: live test.
- G-14 [MECHANICAL on Ω side]: realization status degrades on measured drift
  (PROMOTED→DEGRADED via healing past threshold; probation back to TESTING).
  Status is written only by verify/heal — never self-declared.

## 6. Trace / evidence

- G-15 [OBSERVED VIVIM]: trace entries, fleet events, parser execution logs,
  binding status logs, program version metrics exist as persisted telemetry.
- G-16 [MECHANICAL on Ω side]: every migrated send lands a vault evidence chain
  (capture → redaction → integrity hash over redacted bytes → session/realization
  refs → outcome with `EvidenceRef {ns,id,rev}`); the four send bars run in order
  on every send.
- G-17 [MECHANICAL on Ω side]: recorded fixture proof is attested as fixture;
  it is never presented as live proof (evidence-law invariant).

## 7. Governor questions — status after MIG-001

| Q | Answer |
|---|---|
| Q1 sole I/O authority? | Claimed; import scan outstanding (V-3). DOCUMENTARY. |
| Q2 direct CDP reach? | UNKNOWN — same scan answers it. |
| Q3 proxy bypass? | UNKNOWN — per-method audit outstanding. |
| Q4 equal governance across Runtime.evaluate/Input/nav/capture/harness? | UNKNOWN — same audit. |
| Q5 deterministic provider/account→slave? | INFERRED yes; restart proof outstanding. |
| Q6 stable profile mapping? | OBSERVED invariant (cookie-files-are-truth + singleton); live proof outstanding. |
| Q7 durable across death? | Profile dir + DB rows durable; runtime-only state lost — INFERRED, needs kill test. |
| Q8 lost on death? | In-flight streams, unflushed chunks, mutex states — INFERRED. |
| Q9 response reconstructable? | INFERRED yes from StreamBlock/Message rows; replay proof is future work. |
| Q10 independently replayable? | UNKNOWN — replay harness is explicitly out of slice scope. |
