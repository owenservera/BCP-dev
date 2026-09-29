# Top 10 Cutting-Edge Agentic Engineering Papers — 2025-09-29 → 2026-09-29

> Curation date: 2026-09-29
> Window: papers first posted from 2025-09-29 through 2026-09-29.
> Lens: relevance to agentic software engineering, coding agents, multi-agent engineering, reusable skills, self-evolution, runtime composition, and trustworthy evaluation.
> This is a curated engineering-relevance ranking, not a claim of universal academic prestige.

## 1. Meta-Team — Evolve as a Team: Collaborative Self-Evolution for LLM-based Multi-Agent Systems

**Authors:** Zhezheng Hao et al.  
**Date:** 2026-05-28  
**arXiv:** https://arxiv.org/abs/2605.29790

Meta-Team treats the execution history of an entire multi-agent system as evolution material. It preserves each agent's execution context, coordinates post-task communication, and turns distributed evidence into improvements at three scales: agent behavior, inter-agent coordination, and team organization.

**Why it matters:** This is one of the clearest research formulations of a persistent team that can learn from its own work rather than merely running a fixed workflow.

**Omega implication:** The swarm should preserve trajectories, peer observations, outcomes, and evolution decisions as first-class durable artifacts; team-level evolution should be distinct from individual-worker improvement.

## 2. OneManCompany — From Skills to Talent: Organising Heterogeneous Agents as a Real-World Company

**Authors:** Zhengxu Yu et al.  
**Date:** 2026-04-24  
**arXiv:** https://arxiv.org/abs/2604.22446

OneManCompany introduces an organizational layer above individual agents. It packages skills, tools, and runtime configuration into portable agent identities called Talents; a Talent Market supports dynamic recruitment; and an Explore-Execute-Review (E²R) tree search connects decomposition, execution, evaluation, and refinement.

**Why it matters:** It moves beyond "agent + tools" toward a workforce model with identity, capability packaging, recruitment, hierarchy, accountability, and review.

**Omega implication:** This is directly relevant to the desired separation between persistent specialists, bounded workers, capabilities/skills, and organizational coordination.

## 3. Swarm Skills — A Portable, Self-Evolving Multi-Agent System Specification for Coordination Engineering

**Authors:** Xinyu Zhang et al.  
**Date:** 2026-05-11  
**arXiv:** https://arxiv.org/abs/2605.10052

Swarm Skills makes multi-agent coordination itself a portable artifact containing roles, workflows, execution bounds, and self-evolution semantics. It proposes turning successful trajectories into new or patched coordination skills using effectiveness, utilization, and freshness signals.

**Why it matters:** It explicitly separates the coordination specification from the runtime host and treats coordination know-how as a reusable, evolvable asset.

**Omega implication:** This is perhaps the closest paper to a "Lego factory for swarms": coordination should be packageable, inspectable, portable, versioned, and improvable.

## 4. Live-SWE-agent — Can Software Engineering Agents Self-Evolve on the Fly?

**Authors:** Chunqiu Steven Xia et al.  
**Date:** 2025-11-17  
**arXiv:** https://arxiv.org/abs/2511.13646

Live-SWE-agent is designed to modify and improve its own agent scaffold while solving software-engineering tasks, rather than requiring an offline redesign/training cycle.

**Why it matters:** It demonstrates self-evolution *during* real coding work, which is a stronger notion of autonomy than periodically retraining a fixed agent.

**Reported result:** 75.4% solve rate on SWE-bench Verified and 45.8% on SWE-Bench Pro in the paper's evaluation.

**Omega implication:** Separate "doing the work" from "improving the worker" while retaining strict gates around self-modification and requiring proof that the new behavior is actually better.

## 5. CODESKILL — Learning Self-Evolving Skills for Coding Agents

**Authors:** Yanzhou Li et al.  
**Date:** 2026-05-25  
**arXiv:** https://arxiv.org/abs/2605.25430

CODESKILL treats coding-agent trajectories as material from which reusable procedural skills can be learned and maintained. It uses a learnable management policy rather than a fixed heuristic skill-update process.

**Reported result:** average pass-rate improvement of 9.69 over no-skill baselines and 4.01 over the strongest prompt/memory baseline across EnvBench, SWE-Bench Verified, and Terminal-Bench 2.

**Why it matters:** It provides a concrete research basis for turning experience into compact procedures rather than stuffing more history into prompts.

**Omega implication:** Skills should be a durable knowledge layer with provenance, quality signals, lifecycle, and retirement—not merely Markdown prompts.

## 6. Agint — Agentic Graph Compilation for Software Engineering Agents

**Authors:** Abhi Chivukula et al.  
**Date:** 2025-11-24  
**arXiv:** https://arxiv.org/abs/2511.19635

Agint proposes typed, effect-aware graph compilation from natural-language instructions into executable DAGs, with a compiler/interpreter/runtime split and support for refinement, reproducibility, speculative evaluation, and parallel composition.

**Why it matters:** It attacks a central problem of agentic engineering: free-form agent behavior is difficult to reproduce, parallelize, and reason about.

**Omega implication:** A mature swarm may need an explicit intermediate representation between intent and execution, allowing planning, dependency structure, effects, and verification to become inspectable rather than remaining implicit in model reasoning.

## 7. SWE-Master — Unleashing the Potential of Software Engineering Agents via Post-Training

**Authors:** Huatong Song et al.  
**Date:** 2026-02-03  
**arXiv:** https://arxiv.org/abs/2602.03411

SWE-Master studies the complete development pipeline for software-engineering agents: teacher trajectory synthesis, data curation, long-horizon supervised fine-tuning, reinforcement learning with real execution feedback, and inference-time scaling.

**Reported result:** 61.4% resolve rate with Qwen2.5-Coder-32B on SWE-bench Verified, reaching 70.8% with TTS@8 in the paper's setup.

**Why it matters:** It demonstrates that agent performance is a property of the complete training + scaffold + execution system, not just the base model.

**Omega implication:** Keep model capability, agent scaffold, skills, coordination, and execution feedback as separable layers so improvements in one do not require redesigning the others.

## 8. SWE-Bench Pro Verified — A Reliable Benchmark for Software Engineering Agents

**Authors:** Pujun Zheng et al.  
**Date:** 2026-09-08  
**arXiv:** https://arxiv.org/abs/2609.08149

This paper audits SWE-Bench Pro for reward hacking and task-quality problems, then produces a verified benchmark with anti-leakage safeguards and task refinement.

**Why it matters:** It demonstrates that benchmark scores can be misleading when the benchmark itself leaks solutions or contains weak/mis-scoped tests.

**Omega implication:** "Agent says it succeeded" is never enough. The evaluation substrate, verifier, oracle, and task definition also require validation. Evidence quality is part of agent engineering.

## 9. What Makes a Terminal-Bench Task Hard? Separating Genuine Hardness from Fake-Hardness on an Adjudicated Agentic Corpus

**Authors:** Edward Lue Chee Lip et al.  
**Date:** 2026-09-20  
**arXiv:** https://arxiv.org/abs/2609.26826

This very recent paper studies all-fail tasks in a production benchmark record using reference-solution runs, empty-solution controls, adversarial trials, trajectories, telemetry, and review records.

**Key finding:** among 125 tasks with no honest pass, only 78 survived its certification process as genuinely unsolved candidates; other failures were attributable to broken oracles, infrastructure failures, verifier bypasses, or uncertified solvability.

**Why it matters:** It upgrades "failure" from a raw score into an evidence-classification problem.

**Omega implication:** Store the basis for every success/failure judgment: task validity, environment validity, execution evidence, verifier behavior, and agent trajectory—not just pass/fail.

## 10. Developing LLM-based Multi-Agent Systems in Software Engineering: A Mixed-Method Experience Report

**Authors:** Mariama Celi Serafim De Oliveira et al.  
**Date:** 2026-08-12  
**arXiv:** https://arxiv.org/abs/2608.11965

This experience report surveys and experimentally compares open-source multi-agent frameworks used in software engineering. It reports that basic MAS capabilities are broadly covered, while more advanced areas such as agent telemetry remain weak.

**Why it matters:** It is useful reality-check research on the gap between the conceptual richness of agent frameworks and what developers actually get operationally.

**Omega implication:** Telemetry, observability, coordination diagnostics, and operational evidence should be treated as core engineering infrastructure rather than optional dashboard features.

---

# Cross-paper synthesis

## The emerging agentic-engineering stack

Across these papers, a coherent architecture is appearing:

```
INTENT
  ↓
PLAN / GRAPH / WORKFLOW
  ↓
ORGANIZATIONAL DECOMPOSITION
  ↓
ROLE / TALENT
  ↓
SKILL / PROCEDURE
  ↓
TOOLS / ENVIRONMENT
  ↓
EXECUTION TRAJECTORY
  ↓
VERIFICATION / EVIDENCE
  ↓
REVIEW
  ↓
LEARNED IMPROVEMENT
  ↓
UPDATED SKILL / ROLE / COORDINATION
```

The key shift is that **the unit being engineered is no longer just the model prompt**.

Researchers are increasingly treating the following as independently designable and improvable:

- agent scaffold;
- persistent memory;
- procedural skills;
- organizational roles;
- coordination protocols;
- execution graphs;
- verification mechanisms;
- evaluation environments;
- evolution operators.

## Three especially strong signals for the OpenCode/ZCode wiring study

### 1. Skills are becoming the portable unit of intelligence

CODESKILL and Swarm Skills converge on the idea that successful experience can be distilled into reusable procedural assets.

This strongly supports investigating an OpenCode-native full-stack Skill rather than hard-coding ZCode behavior into a master agent prompt.

### 2. The organization is becoming a runtime object

OneManCompany and Meta-Team both move above the single-agent abstraction.

The frontier question becomes:

```
Who should do this?
Why that worker?
With which capabilities?
Under what bounds?
How do peers contribute evidence?
How does the team learn afterwards?
```

That is much closer to the target of the current swarm research.

### 3. Verification is becoming part of the agent architecture

SWE-Bench Pro Verified and the Terminal-Bench adjudication paper show that the environment and verifier can be as important as the agent itself.

The engineering loop therefore has to be:

```
ACT → OBSERVE → VERIFY → CLASSIFY EVIDENCE → REVISE
```

not merely:

```
PROMPT → CODE → PASS?
```

# Most important research direction for this workstream

The strongest convergence is toward a **self-improving organizational runtime** in which:

- models are replaceable compute;
- agents are persistent roles;
- skills are portable procedures;
- coordination is an explicit artifact;
- work produces trajectories/evidence;
- review changes future behavior;
- the organization itself can evolve.

That is the research seam where the Z.ai/ZCode full-stack pattern, OpenCode's native primitives, and the current swarm research intersect most directly.

## Adjacent papers worth retaining in the corpus

- Self-Evolving Coding Agents — survey/taxonomy of what, when, and from which evidence coding agents evolve: https://arxiv.org/abs/2608.03392
- Self-Improvements in Modern Agentic Systems — system-level survey of models plus scaffolds, memory, tools, and control logic: https://arxiv.org/abs/2607.13104
- Rethinking the Value of Agent-Generated Tests — empirical study of whether agent-written tests materially improve SWE outcomes: https://arxiv.org/abs/2602.07900
- Terminal-Bench: Benchmarking Agents on Hard, Realistic Tasks in Command Line Interfaces: https://arxiv.org/abs/2601.11868
- Agentic Much? Adoption of Coding Agents on GitHub — large-scale real-world evidence of coding-agent adoption and GitHub traces: https://arxiv.org/abs/2601.18341
- SWE-World — learned execution surrogate for software-engineering agents: https://arxiv.org/abs/2602.03419
- Self-Evolving Software Agents — BDI + LLM architecture for autonomous goal/reasoning/code evolution: https://arxiv.org/abs/2604.27264
