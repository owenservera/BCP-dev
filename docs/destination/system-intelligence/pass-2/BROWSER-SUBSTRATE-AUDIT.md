# Browser Substrate Audit

Legacy: ChromeGovernor owns CDP, slave lifecycle and account-oriented browser control.

Ω: provider-browser owns a local CDP client, accepts a local debug port, selects/creates page targets and captures ChatGPT network responses.

Missing current Ω evidence: master/slave fleet lifecycle, profile ownership, account binding, locking, concurrent-task isolation, idle cleanup, crash recovery and session-expiry recovery.

**Classification: REQUIRES-EXPERIMENT.**

The experiment should prove one account → one intended profile → one session → one target → one effect, then concurrency, expiry and browser restart.
