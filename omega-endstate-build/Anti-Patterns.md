# Anti-Patterns

These are failure modes the Omega build should actively detect and reject.

### Trust & authority
- Name-equals-authority; permission-equals-authority; self-granted authority; authority laundering.
- Confidence-equals-proof; agreement-equals-correctness; result-equals-proof.
- Documentation, research or a generated summary silently becoming implementation law.
- Source/runtime disagreement being erased instead of investigated.

### Organization
- Organizational hierarchy being mistaken for execution or failure-supervision hierarchy.
- Premature specialization, organizational inflation or permanent agents without recurring demand.
- Coordination volume, consensus or agent count becoming a proxy for importance.
- The organization optimizing for its own continuation instead of the product mission.

### Execution
- Shared checkouts for concurrent autonomous work.
- Session trees being treated as the canonical work/dependency graph.
- Completion being treated as acceptance.
- Retry without idempotency, restart without bounds, or recovery without explicit re-admission.
- Hidden schedulers or background mechanisms acquiring semantic authority.

### Context & knowledge
- Context flooding, global-transcript-everything, or producer framing becoming reviewer truth.
- Session/process identity being mistaken for durable identity.
- Checkpoints storing transcripts but not objective, state, evidence, ownership and dependencies.

### Evolution & governance
- Live self-mutation during consequential work.
- Broad fixes for local failures without necessity.
- Evolution without baseline, holdout evaluation, archive, lineage or rollback.
- Veto inflation, veto paralysis, permanent veto or vague vetoes without targets/release conditions.
- Reviewers becoming implementers or approval authorities by implication.

**Meta-rule:** preserve distinctions, expose uncertainty, minimize blast radius, and prefer evidence over narrative.