# Top 10 Cutting-Edge Computer-Use Automation Papers — 2025-09-29 → 2026-09-29

> Curation date: 2026-09-29
> Window: papers first posted from 2025-09-29 through 2026-09-29.
> Lens: autonomous computer control, GUI/desktop automation, browser automation, long-horizon execution, grounding, tool/action selection, training, safety, and reproducible evaluation.
> Selection is a research-relevance curation, not a universal academic ranking.

## 1. Wuying-Browser-Agent — Real-World Centric Fundamental Long-Horizon Browser Agents

**Date:** 2026-08-18  
**arXiv:** https://arxiv.org/abs/2608.17319

Wuying argues that strong short browser demos do not translate directly into reliable real-world automation. Its stack combines a structured browser harness, decision-oriented context management, recovery trajectories, UI-specialized curriculum training, and divergence-aware online GRPO. It also introduces BrowserBench, 350 bilingual real-web tasks averaging 37.9 steps.

**Reported result:** Wuying-Browser-Agent-27B reaches 65.1% on BrowserBench, 66.7% on Online-Mind2Web and 80.6% on WebVoyager in the paper's evaluation.

**Why it matters:** It treats browser automation as an end-to-end systems problem—execution substrate, context, recovery, training, optimization and evaluation—not merely a better model.

**Automation implication:** A production browser agent needs a stable control substrate plus recovery and state-tracking mechanisms; the model alone is not the automation system.

## 2. SCALECUA — Scaling Computer Use Agents with Verifiable Task Synthesis and Efficient Online RL

**Date:** 2026-07-13  
**arXiv:** https://arxiv.org/abs/2607.11185

ScaleCUA attacks the two bottlenecks in computer-use RL: scarce verifiable training tasks and expensive online interaction. VeriGen generates executable, verifiable tasks through iterative Docker interaction and a multi-agent feedback loop; Frontier Sampling concentrates training on the current learning frontier; Visual Context Segmentation improves training efficiency.

**Reported result:** 24K+ verifiable tasks and nearly 3K high-quality RL tasks; 68.7% on OSWorld and 54.0% on ScienceBoard.

**Why it matters:** It shows that automation quality can be scaled through the environment and data-generation pipeline, not only model size.

**Automation implication:** Treat the environment, task factory, verifier and trajectory pipeline as first-class infrastructure.

## 3. OSWorld 2.0 — Benchmarking Computer Use Agents on Long-Horizon Real-World Tasks

**Date:** 2026-06-28  
**arXiv:** https://arxiv.org/abs/2606.29537

OSWorld 2.0 expands the benchmark from relatively short interactions to 108 long-horizon workflows across everyday and professional tasks. Tasks take human users a median of ~1.6 hours and can require hundreds of tool calls.

**Key result:** In the paper's primary 500-step setting, the best reported model reaches only 20.6% binary completion with 54.8% partial score.

**Why it matters:** The frontier failure mode is shifting from basic clicking to maintaining constraints, discovering hidden state, handling mid-task information and deciding when to verify or ask the user.

**Automation implication:** A realistic automation substrate must model state continuity and recovery, not simply execute a sequence of mouse clicks.

## 4. WeaveBench — A Long-Horizon, Real-World Benchmark for Computer-Use Agents with Hybrid Interfaces

**Date:** 2026-06-08  
**arXiv:** https://arxiv.org/abs/2606.09426

WeaveBench tests workflows that deliberately combine GUI control with CLI, code editing and external tools. It contains 114 tasks across eight real-world domains and evaluates trajectories using deliverables, files, screenshots, logs and action traces.

**Key result:** The strongest model/runtime pairing in the study achieves 41.2% PassRate; the trajectory-aware judge shows outcome-only grading can substantially overestimate performance.

**Why it matters:** This is very close to how actual computer automation works: an agent crosses interfaces rather than staying inside one API or one GUI.

**Automation implication:** Hybrid interface orchestration should be considered a core capability, not an edge case.

## 5. AgentCIBench — Capable but Careless: Do Computer-Use Agents Follow Contextual Integrity?

**Date:** 2026-06-22  
**arXiv:** https://arxiv.org/abs/2606.23189

AgentCIBench evaluates privacy failures caused by cross-application context. It tests visual co-location, ambiguity-driven oversharing and recipient misalignment using deterministically scored end-to-end scenarios.

**Key result:** 11 of 15 evaluated frontier agents leaked on more than half of scenarios, with 67.9% average leakage across the benchmark.

**Why it matters:** Once an automation agent has access to a person's desktop, the danger is no longer merely prompt injection or unsafe clicking; it can also leak information from the wrong context.

**Automation implication:** Capability boundaries and contextual authorization must be part of the computer-use runtime.

## 6. MacAgentBench — Benchmarking AI Agents on Real-World macOS Desktop

**Date:** 2026-06-21  
**arXiv:** https://arxiv.org/abs/2606.22557

MacAgentBench contains 676 tasks across 25 applications, with nearly 60% requiring both GUI and CLI interaction. It uses deterministic evaluation and fine-grained multi-checkpoint scoring.

**Key result:** In its experiments, Claude Opus 4.6 on OpenClaw reaches 73.7% Pass@1; the paper attributes much of the advantage to the skill library rather than the framework alone.

**Why it matters:** It provides direct evidence that reusable procedural knowledge can materially change computer-use performance.

**Automation implication:** Skills are not just prompt convenience; they can be a major performance layer in a real automation system.

## 7. IntentScore — Intent-Conditioned Action Evaluation for Computer-Use Agents

**Date:** 2026-04-06  
**arXiv:** https://arxiv.org/abs/2604.05157

IntentScore learns to evaluate candidate GUI actions in the context of the agent's current plan. It trains on 398K GUI interaction steps from three operating systems and uses state-action relevance plus action-correctness objectives.

**Reported result:** 97.5% pairwise discrimination on held-out evaluation; used as a reranker it improved Agent S3's OSWorld success by 6.9 points in the authors' experiment.

**Why it matters:** A computer-use agent should not simply choose an action; it should assess whether that action is appropriate for its intent before committing to it.

**Automation implication:** Add a deliberative action-quality gate between perception/planning and irreversible execution.

## 8. The Unreasonable Effectiveness of Scaling Agents for Computer Use

**Date:** 2025-10-02  
**arXiv:** https://arxiv.org/abs/2510.02250

Agent S3 introduces Behavior Best-of-N (bBoN): generate multiple agent rollouts and select among them using behavior narratives and trajectory understanding rather than blindly trusting one rollout.

**Reported result:** 69.9% on OSWorld in the paper's setting, approaching the ~72% human reference reported for the benchmark at that time.

**Why it matters:** Robustness can come from searching over multiple behaviors, not only from improving a single policy.

**Automation implication:** For expensive or high-risk tasks, parallel candidate trajectories plus evidence-based selection can be a powerful reliability layer.

## 9. MAI-UI — Real-World Centric Foundation GUI Agents

**Date:** 2025-12-26  
**arXiv:** https://arxiv.org/abs/2512.22047

MAI-UI builds GUI agents across model scales and explicitly targets four deployment problems: native agent-user interaction, UI-only limitations, deployment architecture, and brittle dynamic environments. It combines a self-evolving data pipeline, MCP tool calls, native device-cloud collaboration and online RL.

**Reported results:** 73.5% ScreenSpot-Pro, 70.9% OSWorld-G and 76.7% AndroidWorld; the paper reports lower cloud-call volume and improved on-device performance from its device-cloud design.

**Why it matters:** It treats computer use as a deployment architecture with local/cloud routing and tool integration, not just a GUI model.

**Automation implication:** The boundary between local execution, remote model inference, tools and privacy becomes an architectural control point.

## 10. Video2GUI — Synthesizing Large-Scale Interaction Trajectories for Generalized GUI Agent Pretraining

**Date:** 2026-05-14  
**arXiv:** https://arxiv.org/abs/2605.14747

Video2GUI automatically mines GUI demonstrations from unlabeled internet videos and converts them into structured interaction trajectories. The authors construct WildGUI with 12 million trajectories spanning 1,500+ applications and websites.

**Reported result:** Pretraining on WildGUI yields 5–20% improvements across several GUI grounding/action benchmarks in their experiments.

**Why it matters:** It addresses the data bottleneck by harvesting naturally occurring demonstrations rather than depending on expensive manual annotation.

**Automation implication:** Real-world UI behavior can become a continuously harvested corpus for learning and capability improvement.

---

# Cross-paper synthesis

## The computer-use stack is becoming a control system

The papers increasingly converge on this architecture:

```
USER INTENT
    ↓
TASK / PLAN
    ↓
STATE + CONTEXT MODEL
    ↓
PERCEPTION / GROUNDING
    ↓
CANDIDATE ACTIONS
    ↓
ACTION QUALITY / RISK CHECK
    ↓
GUI / CLI / BROWSER / TOOL EXECUTION
    ↓
OBSERVE NEW STATE
    ↓
VERIFY / SCORE
    ↓
RECOVER / REPLAN
    ↓
TRAJECTORY + EVIDENCE
```

The important shift is from:

```
LLM → click/type → repeat
```

to:

```
INTENT → STATE → PLAN → ACT → OBSERVE → VERIFY → RECOVER → LEARN
```

## The strongest technical findings

### 1. Long-horizon state is the real frontier

OSWorld 2.0 makes this especially clear: modern agents increasingly handle basic GUI mechanics, but struggle when a task spans hundreds of actions and requires remembering constraints, reacting to newly arriving information and recovering hidden state.

### 2. Grounding is still a fundamental bottleneck

IntentScore and the broader grounding work show that precise action selection is separable from high-level reasoning. The best system may need both a planner and a specialized grounding/action-evaluation layer.

### 3. Skills materially change automation

MacAgentBench's result is especially relevant to the current OpenCode/ZCode work: the paper reports that framework-plus-model performance differences were strongly influenced by the skill library.

This supports treating procedural automation knowledge as a versioned capability layer.

### 4. The trajectory is becoming the primary evidence object

WeaveBench evaluates more than final outputs. Its judge inspects files, screenshots, logs and action traces and penalizes shortcut behavior.

This converges with the idea that a successful final state alone does not establish trustworthy execution.

### 5. Safety is context-sensitive

AgentCIBench exposes a different class of failure from simple prompt injection: an agent can perform the requested action correctly and still disclose information from the wrong context.

A sovereign computer agent therefore needs **authority boundaries around information flow**, not just execution permissions.

---

# Particularly relevant to the VIVIM Provider Lab

There is a very strong fit between this literature and a Chrome-first automation substrate:

```
Chrome / desktop state
      ↓
AX + DOM + visual observation
      ↓
semantic grounding
      ↓
candidate interaction
      ↓
risk / authorization gate
      ↓
real browser action
      ↓
observe resulting state
      ↓
capture evidence
      ↓
repair / replay / adapt
```

This literature also supports keeping **browser state, observations, actions, trajectories and evidence distinct**. That matters for your selector-drift/replay work: a selector or coordinate is an execution mechanism, not canonical truth.

# Research priorities for the OpenCode/ZCode wiring lane

The papers suggest seven concrete capabilities worth testing in OpenCode:

1. **Skill library** — reusable application/workflow knowledge.
2. **Grounding layer** — screenshot/AX/DOM-to-action mapping.
3. **Action gate** — evaluate intent/risk before irreversible actions.
4. **Hybrid execution** — browser + shell + code + MCP.
5. **Trajectory store** — durable action/observation history.
6. **Verifier** — independent state/evidence validation.
7. **Recovery loop** — detect drift and replan rather than blindly retry.

The particularly interesting architecture is therefore not a "computer-use model."

It is:

```
OpenCode TUI
      ↓
Agent / planner
      ↓
computer-use skill
      ↓
grounding + action evaluation
      ↓
governed execution substrate
      ↓
trajectory
      ↓
verification/evidence
      ↓
recovery
      ↓
learned skill improvement
```

That is much closer to a **general-purpose sovereign automation substrate** than a conventional RPA tool.

## Sources

Primary arXiv sources:
- Wuying-Browser-Agent — https://arxiv.org/abs/2608.17319
- SCALECUA — https://arxiv.org/abs/2607.11185
- OSWorld 2.0 — https://arxiv.org/abs/2606.29537
- WeaveBench — https://arxiv.org/abs/2606.09426
- AgentCIBench — https://arxiv.org/abs/2606.23189
- MacAgentBench — https://arxiv.org/abs/2606.22557
- IntentScore — https://arxiv.org/abs/2604.05157
- Agent S3 — https://arxiv.org/abs/2510.02250
- MAI-UI — https://arxiv.org/abs/2512.22047
- Video2GUI — https://arxiv.org/abs/2605.14747
