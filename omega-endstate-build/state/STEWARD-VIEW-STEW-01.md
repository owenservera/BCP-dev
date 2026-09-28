# STEW-01 — First-Session Steward View

> Date: 2026-09-28
> Evidence: `state/REALITY-AUDIT-STEW-01.md`
> Route: `roadmap/ROADMAP-V1.md`
> Status: independent first-cycle judgement. Expected to be revised by evidence.

## 1. What VIVIM is trying to become

A local, owned environment in which a person's **existing** relationships with their digital
world become one coherent surface. The load-bearing commitment is negative: VIVIM must not
require the user to obtain a new VIVIM account, buy VIVIM tokens, or hand over provider API keys
in order to get the core experience. Everything else — providers, routing, memory, work — is in
service of that one promise. The honest test of any proposal is whether it *reduces* or
*increases* what the user must set up.

## 2. What Ω actually provides today

More than I expected, and less than the corpus implies.

**Genuinely valuable:**
- A small, disciplined, fail-closed kernel with a real LOC budget regime and 30+ verification
  gates. The *discipline* is an asset, not just the code.
- A real local Chrome DevTools Protocol client with exactly the right safety instincts:
  localhost-only, exact outgoing-value verification, one submit click, no credential reads, no
  automatic login, never resend after post-click failure.
- A coherent `chat.*` vocabulary writing to `ns "chat"` in a user-owned vault.
- A version-pinned parser discipline (`D-355`) that lets one pin cover both fixture replay and
  live SSE.
- Substantial governance machinery: 161 decision records, a genome, invariants, evidence gates.

**Not working, contrary to inherited claims:**
- The browser module does not load (duplicate binding, on `main` too). The composition's own M0
  falsifier is red.
- The recorded 1418-green gate is a **stale artifact dated before the break**.
- The only chat realization is sim-only and needs an API key no composition grants.
- Claude and Gemini do not exist. Zero references.

## 3. The major gaps and tensions

**The central one:** Ω has a browser substrate proven against an *email* archetype and a chat
vocabulary realized only through an *API-key* path — and nothing joins them. The destination
needs the join. That is the whole gap, and it is not named in any inherited document.

Secondary tensions I consider real:
- **Abstraction vs. fidelity.** The risk is building either a bespoke integration per provider or
  an abstraction that cannot express real provider difference. The complexity map is right that
  this is the hard design question.
- **Routing vs. authority.** A learned ranking that silently rewrites user rules is the failure
  mode; the destination explicitly forbids it.
- **Simulated continuity vs. real continuity.** `ns "chat"` rows that are sim-synthetic look
  exactly like real ones in the vault. Evidence quality is a first-class concern, not a nicety.
- **Evidence discipline vs. velocity.** This repository's real weakness is not architecture — it
  is that a stale generated artifact read as current truth, and a hard syntax error survived
  four days and a branch integration undetected.

## 4. The highest-value unknowns

Ordered by how much the answer would change the plan:

1. **Can a multi-turn browser conversation be reliably re-entered?** If a VIVIM
   `conversationId` cannot be rehydrated into a provider thread, the "continue the conversation
   I had yesterday" promise fails and the substrate choice is in question.
2. **What is the real current test baseline?** Everything inherited is unverified. One command
   answers it and I have not yet run the full suite.
3. **How fast does ChatGPT actually drift, and what breaks first — selector, AX tree, or SSE
   format?** This determines whether self-healing is an architecture or a maintenance chore. I
   refuse to design a healer before observing a real failure.
4. **Is the fail-closed discipline affordable at real-world cadence?** If every send needs four
   verifications and a promotion lifecycle, throughput may be too low for a background Work
   system. Genuinely unknown and consequential.
5. **How much of the 125-row responsibility matrix is load-bearing for the first honest proof?**
   My working answer is: very little. That is a claim I should be willing to lose.

## 5. Development organization I think is needed

Three roles, not ten. Justified by observed bottleneck, not by the complexity map:

- **STEW-01** — strategy, evidence standards, integration. Owns context; must stay small.
- **PROV-01** — provider investigator. Live browser work is serial, session-bound and slow.
  Isolating it protects Steward context and lets it proceed in parallel with Steward reasoning.
- **VER-01** — independent verifier. A Steward that verifies its own work is not verifying.
  The cheapest possible check against my own bias, and the F0 repair is a perfect first proof.

Retire-when-idle applies to all three. No architecture, tooling, evolution or journey agents until
a responsibility actually recurs.

## 6. Tools worth building

Two, both small, both justified by a failure I actually observed:

1. **A current-evidence probe** — scoped test run emitting fresh pass/fail with toolchain and
   SHA. Fixes the exact failure that nearly cost me this cycle: a four-day-stale artifact
   readable as current truth.
2. **A module-load / duplicate-binding guard** — prevents the F0 break class recurring silently.

Everything else is deferred. I would rather have a small reliable tool than a framework nobody
runs.

## 7. Most informative product route

One real authenticated ChatGPT conversation, end to end, through the user's existing web
session, into the user's own vault — repeatedly, then broken and repaired. Then Claude, then
Gemini. Then a surface.

The informative part is not the destination, it is the **falsifier**: if adding the second
provider requires a new architecture, the abstraction boundary is wrong and I must redesign it
before going further. That test is worth more than any amount of additional breadth.

## 8. What would change my mind

| Evidence | What I would change |
|---|---|
| Full suite re-derivation shows a baseline materially below the inherited claim | Re-scope everything; the substrate is weaker than believed. |
| Multi-turn re-entry proves unreliable in CDP | Reconsider the substrate — but **not** the chat seam, which is substrate-independent. |
| The second provider needs a new architecture | Stop and redesign the abstraction boundary. This is the strongest single falsifier. |
| Repairs turn out to be cheap and rare | Demote self-healing from architecture to maintenance. |
| The fail-closed lifecycle proves too slow for background work | Re-negotiate the safety regime explicitly, with evidence, rather than quietly dropping bars. |
| Ω's gates turn out to be a tax rather than an asset | Simplify. The discipline is only worth keeping if it buys reliability. |

## Honest self-assessment

My strongest contribution this cycle is negative: I found that the designated proving ground does
not compile, that the green gate is stale, that two of three seed providers do not exist, and
that the actual missing piece is a single un-named join. My weakest is that I have not yet
verified the full baseline, and I have read the end-state seed and complexity map but not yet
mined the legacy VIVIM tree or the prior Steward research branches — which are likely to contain
discarded designs and hard-won evidence that would sharpen §4 considerably.

Next: F0, then the §4 unknowns in order.
