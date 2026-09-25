# Experiment Report

## Completed evidence
**EVIDENCE-SUPPORTED:** GitHub inspection verified the Legacy agentic/workflow family and Ω runtime/evidence/law material named in this package.

**EVIDENCE-SUPPORTED:** current primary modern documentation verifies durable orchestration, timers/events, retries, approvals, tracing and deterministic orchestration/activity separation.

## Runtime status
**EXPERIMENT-REQUIRED — NOT CLAIMED AS RUN.** No production code was changed or executed in this research tranche, and no verified local runtime session was available. It would be false to claim crash/timer/lease/idempotency tests passed.

## Required falsifiers
F1 kill before dispatch; F2 kill after dispatch before acknowledgement; F3 duplicate trigger; F4 duplicate timer; F5 concurrent lease race; F6 stale lease fencing; F7 side-effect retry; F8 corrupted checkpoint; F9 revoked approval; F10 Plan revision during active Work; F11 budget exhaustion; F12 approval after restart; F13 child Work failure; F14 no AI; F15 no browser; F16 replay with live effects disabled.

Promotion requires deterministic repeatable evidence for each.