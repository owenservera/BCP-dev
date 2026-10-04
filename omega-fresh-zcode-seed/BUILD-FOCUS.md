# Build Focus — Where to Over-Resource the Work

These are focus areas, not a prescribed roadmap. Their purpose is to tell the autonomous build where deeper analysis, parallel investigation, stronger tests, and disproportionate engineering attention are likely to pay off.

The project should re-rank them from evidence as reality changes.

## 1. Constitutional control loop

Focus: Vault → evidence/event → law/authority → canonical intent → execution.

This is the product's load-bearing spine. Every new surface or capability becomes cheaper and safer if it flows through one coherent control path. Watch especially for duplicate execution paths, authority checks occurring after side effects, opaque interpretation steps, and state that exists only in a projection.

The key question is not "does this feature work?" but "does it work through the same governing machinery as everything else?"

## 2. Natural-language control and self-knowledge

Focus: deterministic NLCL, intent artifacts, explainability, self-description, context assembly, and eventually a system that can understand enough of itself to act as its own development environment.

Ω's differentiator is not simply accepting natural language. It is turning language into inspectable, reproducible operations while keeping authority outside the model.

Invest deeply in the boundary between perception and authority, especially around ambiguity, canonicalization, replay, context grounding, and explaining why a resolution occurred.

## 3. Vault, provenance, evidence, and replay

Focus: one authoritative memory substrate with durable lineage.

The vault is the long-term continuity layer. Changes should remain attributable; evidence should resolve; projections should be rebuildable; important decisions should be replayable; corruption and crash cases should fail loudly.

Treat provenance and replay as product capabilities, not merely audit features.

A consequential claim should remain reconstructable after the worker, process, browser session, or other transient mechanism that produced it disappears. Evidence that expires before the claim does is a design defect.

## 4. Forge and self-extension

Focus: making the plugin and composition ecosystem genuinely generative rather than merely declarative.

The important progression is:

describe → shape → emit → test/prove → use → learn/generalize

The self-hosting and second-mine ideas are particularly valuable because they test whether Ω's extensibility is actually generic rather than tuned to its own codebase.

Avoid creating a new privileged SDK-like layer to make the Forge convenient.

## 5. Browser-mediated provider realization

Focus: Chrome master/slave, provider.browser, reliable discovery, evidence-backed realization, attachment and containment, and healing.

The current shippable V1 direction is browser-mediated rather than direct AI APIs. That makes the provider boundary one of the most important practical product paths.

Pay special attention to the difference between selector/DOM convenience and authoritative truth. Browser interaction should produce evidence; the browser is not the source of constitutional authority.

## 6. Runtime containment, resource governance, and failure semantics

Focus: process isolation, watchdog behavior, resource budgets, cancellation, recovery, crash loops, named refusal/failure states, and observable execution state.

As Ω becomes capable of running many extensions and potentially many concurrent realizations, resource behavior becomes architectural.

Treat interruption and recovery as normal states, not exceptional afterthoughts. The runtime should be able to distinguish active work from completed work and retryable failure where evidence permits.

The goal is not theoretical sandbox perfection. The goal is honest, measurable containment with bounded failure and no silent escalation of privilege.

## 7. Identity, authority, and multi-party trust

Focus: stable identity, key binding, consent, capability delegation, trust lineage, eventual multi-device and multi-principal semantics, and adaptation authority.

Do not let identity become an afterthought that forces every historical row to be reinterpreted later.

At the same time, do not build speculative distributed identity infrastructure before a real product need justifies it.

## 8. Surfaces, canvas, and live-object semantics

Focus: deriving multiple surfaces from one operation vocabulary; canvas as authoritative-state projection; durable spatial state; live objects; accessibility and legibility.

The surface layer should expose the constitutional system, not become a second application with its own state machine.

A strong litmus test: the same consequential action should be explainable and enforceable whether it arrived from language, CLI, MCP, automation, or canvas.

## 9. Healing and governed adaptation

Focus: discovery → evidence → propose/repair → verify → install → recover.

Healing is strategically important because Ω is intended to operate in a changing external world. But the healing loop must remain evidence-driven and reversible.

The dangerous failure mode is autonomous change that becomes authority by accident.

Any self-improvement mechanism should also be able to show whether a change actually improved the behavior it was intended to change. Activity, rule count, or successful execution alone are not evidence of improvement.

## 10. Product coherence and beta reality

Focus: one compelling end-to-end user journey, not ten half-built subsystems.

Regularly step outside architecture and ask:

Can a real person do something valuable with this yet?

Use the answer to collapse unnecessary work, sequence dependencies, and decide where engineering effort has the highest user return.

## Cross-cutting questions worth keeping alive

- Where is the single source of truth?
- What exactly proves that this happened?
- Who was authorized, and on whose behalf?
- Can the operation be replayed or explained?
- What happens when the system is uncertain?
- What happens when a component lies, hangs, crashes, disappears, or is replaced?
- Can this be a plugin rather than a special case?
- Is this architecture genuinely generic, or merely tuned to Vivim?
- Can we prove the claim with a small falsifier?
- Does the evidence survive the transient mechanism that produced it?
- Did the intervention measurably change the behavior it targeted?
- Is the current structure still the simplest one?

These questions are more important than preserving any particular current roadmap.
