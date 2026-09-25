# Red Team

1. Duplicate side effect → stable effectId + idempotency/reconciliation.
2. Stale approval → authority recheck at dispatch.
3. Zombie worker → lease epoch fencing.
4. Scheduler privilege escalation → scheduler only changes eligibility.
5. AI privilege escalation → AI output remains untrusted candidate data.
6. Checkpoint forgery → revision/evidence continuity and impossible-transition refusal.
7. Retry storm → attempt/deadline/backoff budget.
8. Attention becomes hidden DB → all durable action is Work.
9. Plan mutation → Work pins Plan revision.
10. Replay causes live effect → replay uses frozen/recorded outcomes.
11. Compensation lies → compensation is new governed action with evidence.
12. Resource starvation → fair capacity policy and budgets.
13. Evidence inflation → distinguish claim, observation, verification and authority.

Primary containment lines: durable Work state, authority boundary, evidence model.