# STEW-01 — First Reality Audit

> Agent: STEW-01
> Date: 2026-09-28
> Workspace at time of audit: `C:\0-BlackBoxProject-0\Vivim-omega\omega-endstate-workspaces\STEW-01-bootstrap-team`
> Workspace now: `C:\0-BlackBoxProject-0\Vivim-omega\omega-endstate-worktrees\STEW-01-bootstrap-team` (relocated 2026-09-29; `omega-endstate-workspaces` is obsolete and is no longer an execution location)
> Branch: `work/omega-endstate/STEW-01/bootstrap-team`
> Base SHA: `ff8e141a4a611ddaa6a35315e71557832cef2a5d` (= remote `team/omega-endstate` tip at allocation)
> Status: COMPLETE — first bootstrap cycle
> Method: repository is evidence. Every claim below is reproducible with the stated command.

This audit exists because the starting corpus asserts substantially more working product than
the tree currently demonstrates. It is the Steward's independent reading, not an inherited summary.

---

## 1. Environment facts (verified)

| Fact | Value | Command |
|---|---|---|
| Repository root | `C:/0-BlackBoxProject-0/Vivim-omega/BCP-dev` | `git rev-parse --show-toplevel` |
| Origin | `https://github.com/owenservera/BCP-dev.git` | `git remote -v` |
| Remote tip `team/omega-endstate` | `ff8e141a` | `git rev-parse refs/remotes/origin/team/omega-endstate` |
| Remote tip `main` | `09f7ed24` | `git rev-parse refs/remotes/origin/main` |
| Toolchain | bun `1.3.14`, node `v24.11.1` | `bun --version` / `node --version` |
| Install | `bun install --frozen-lockfile` OK, 52 packages | run in `omega-baseline/omega-final` |
| Workspace verifier | `valid: true`, `dirty: false` | `Verify-AgentWorkspace.ps1` |

The recorded build toolchain in `omega-baseline/omega-final/build/status.json` (`bun 1.3.14`)
matches the local toolchain, so local execution is a legitimate reproduction environment.

---

## 2. Blocking defect — the designated proving ground does not load

**This is the most important finding of the first cycle.**

`bun test plugins/provider-browser` fails:

```
error: compartment vivim.law crashed
(fail) D-357 — the M0 falsifier on one real boot of compositions/browser.json
SyntaxError: Cannot export a duplicate function name: 'parseChatGptStream'.

 14 pass   2 fail   1 error   16 tests across 4 files
```

### Root cause

`omega-baseline/omega-final/plugins/provider-browser/src/live.ts` declares the identifier
`parseChatGptStream` **twice in the same module scope**:

- line 20 — `import { PARSER_VERSION, parseChatGptStream, resolveParser } from "./parsers.ts";`
- line 21 — `export { parseChatGptStream };`
- line 529 — `export function parseChatGptStream(rawBody: string) {...}`

A module-scope `import` binding and a `function` declaration of the same name is a duplicate
declaration. This is a hard ESM link-time error in any conformant engine, not a test artifact.

### Provenance

Introduced by commit `4d34a611` — *"P1-08: fix pinned parser import and live result shape"*
(2026-09-25 00:26:38 +0200). That commit **added** lines 20–21 on top of the pre-existing local
function at line 529:

```
+import { PARSER_VERSION, parseChatGptStream, resolveParser } from "./parsers.ts";
+export { parseChatGptStream };
```

Before that commit the file had only the local function. The commit's intent was to pin live
parsing to the version-pinned parser in `parsers.ts`; the implementation added a conflicting
import instead of reconciling the two.

### Blast radius — this is not branch-local

`git merge-base --is-ancestor 4d34a611 origin/main` → exit `0`
`git merge-base --is-ancestor 4d34a611 origin/team/omega-endstate` → exit `0`

The break is present on **`main` as well as `team/omega-endstate`**. It is not introduced by
this development path and must not be repaired under a "branch-local redesign" framing.

### The fix is a real design decision, not a deletion

The live send path at `live.ts:676` **already** routes through the pinned parser:

```ts
const chunks = resolveParser(PARSER_VERSION).transform(stream.body);
```

So the local function at line 529 is not on the live execution path. However the two are not
interchangeable:

- `parsers.ts:118` — `parseChatGptStream(rawBody): ParsedChunk[]`
- `live.ts:529` — `parseChatGptStream(rawBody): { providerMessageId?: string; chunks: ParsedChunk[] }`

The local variant additionally extracts `providerMessageId`, which `provider.browser`'s manifest
declares as a live-only result field and `LiveSendResult` carries. **Deleting line 529
wholesale would silently drop a declared capability.** The correct repair is to keep the
`providerMessageId` extraction while delegating chunk construction to the pinned parser.

Recorded as `decisions/STEW-D-001-browser-live-parser-reconciliation.md`.

---

## 3. Recorded gate evidence is stale

`omega-baseline/omega-final/build/status.json` advertises:

```
tests.pass 1418   tests.fail 0
gate.checks.* all ok:true   (19 compositions, 161 decisions, 135 ratified records)
```

`generatedAt` is **`2026-09-21T08:34:55.460Z`** — four days *before* the breaking commit
`4d34a611` (2026-09-25). The green gate therefore describes a tree that no longer exists.

Additionally, the **working-tree** copy of `status.json` had been locally regenerated on Windows
and the regeneration **dropped the entire `gate` block** (267 deleted lines, leaving only
`waves`/`benchmarks`). A degraded artifact was written over a good one in a shared checkout.

**Consequence for the team:** no inherited metric in this repository may be cited as current
evidence without re-deriving it on the working tree. The 161 decisions / 135 ratified records /
19 compositions figures are inherited claims, not verified current state.

---

## 4. What Ω actually provides (positive findings)

Ω is real, substantial engineering — not a prototype skeleton. Verified structure under
`omega-baseline/omega-final/`: `host/` (13 src), `contracts/` (24 src), 25 plugins,
`surfaces/{daemon,web,cli,mcp,daemon-client}`, `platform/`, `sdk/`, `testkit/`,
`compositions/` (19), `packs/`, `genome/`, `fixtures/`, `tooling/` (30+ gate scripts),
plus a disciplined LOC budget regime (host 1500 / anvil 860, frozen by D-404).

`provider-browser/src/live.ts` (27 KB) is a genuine local Chrome DevTools Protocol client —
not a mock. It is deliberately narrow: `localhost` only, caller supplies the debug port, and it
refuses to accept an arbitrary websocket URL or remote host. It creates/attaches a page target,
resolves a composer by selector, injects text, **verifies the outgoing composer value exactly**,
performs **one** submit click, captures the ChatGPT conversation **SSE**, parses it through a
version-pinned deterministic parser, emits ordered chunks, and appends a pack-schema-exact
outbound row to the user's vault. No credentials are read and no login is automated;
post-click failures never resend.

This fail-closed posture (day-one fence, session attached, realization PROMOTED through
`discovery.verify@1`, verified parser pin) is exactly the right instinct for the destination, and
it is worth preserving regardless of what else changes.

---

## 5. The central architectural gap — browser and chat are two disconnected halves

This is the finding that should drive the roadmap.

**The browser half** proves real web-app control, but against an **email** archetype:
`provider.browser` contributes `browser.attach`, `browser.release`, `message.send@1`
(`EXTERNAL_MUTATION`, `ns "email"`, `to`/`subject`/`body`). It can operate a live authenticated
ChatGPT page. **It cannot hold a conversation.**

**The chat half** has a real vocabulary — `vivim.chat` contributes `chat.open`, `chat.append`,
`chat.history`, `chat.resolve`, plus a `history.import` parser, writing `ns "chat"` rows through
the vault. But its only realization is `provider.llm`, whose live HTTP leg is, by its own source
comments, **"OWNER-MACHINE ONLY … owner-machine-only dead code in-sandbox"**. It requires
`credential.use` (`port:credential.use@1`), which **no in-sandbox composition grants**, and it
stores **sim-synthetic REFERENCE rows only**. `compositions/chat.json` therefore composes a
simulation, not a provider.

### Verified negatives

- `claude.ai`, `gemini.google`, `anthropic.com` — **zero** matches across all
  `plugins/*/src/*.ts` and `plugins/*/plugin.json`.
- `parser.claude.sse.v1` and `parser.claude-sse-v2` (`parser.claude.sse.v2`) both exist as
  competing/duplicated Claude SSE parsers, but **no Claude web-interaction path consumes them**.
- No Gemini artifact of any kind.

### The seam

The owner destination is *browser-mediated chat across ChatGPT, Claude and Gemini through the
user's existing web relationships*. Ω currently has:

```
browser/CDP substrate  ──real, email-archetype──▶  message.send@1
chat vocabulary        ──sim-only, API-key─────▶  chat.open / chat.append / history / resolve
                                                    ▲
                                          (nothing connects these)
```

**The join — a browser-mediated `chat` archetype — does not exist, and is not named as the
frontier anywhere in the seed corpus.** The seed `ROADMAP.md` is deliberately empty and
mandates the team create its own; nothing inherited points at this seam.

This also explains why the API-key question in the owner direction is load-bearing rather than
rhetorical: the only chat path Ω has *requires the thing the product promises not to require*.

---

## 6. Session-start discrepancies (repository vs. prompt)

| # | Prompt / assumption | Repository reality | Resolution |
|---|---|---|---|
| D1 | `.\omega-endstate-build\scripts\Bootstrap-Steward.ps1` exists in the checkout | `omega-endstate-build/` existed **only on the remote tip**; local `team/omega-endstate` was stale at `a85646ce` | Fast-forwarded local branch to `ff8e141a` (no history rewrite). Safe: the dirty `status.json` is not in the incoming range. |
| D2 | — | Shared checkout carried **unowned** dirty state: modified `status.json` (degraded Windows regeneration) plus untracked `OmegaBuildBootstrap.txt`, `local-team.md`, `session-ses_f1fc.md`, `docs/Reality-engine/` | **Preserved untouched.** Not cleaned, not stashed, not committed. Recoverability first. |
| D3 | — | A pre-existing, **unregistered** worktree `BCP-dev-steward` on branch `steward/session-work` at `origin/main` (`09f7ed24`), with no `.omega-agent` manifest and no registry entry | **Left in place.** Predates the allocator; not mine to retire. Recorded for a future Steward. |
| D4 | Provider seed should be buildable | Browser proving-ground module has a hard `SyntaxError`, on `main` too (§2) | **Not repaired in this cycle.** Repair is decision `STEW-D-001`; recorded with root cause. |
| D5 | Corpus implies a green 1418-test gate | `status.json` gate is dated 2026-09-21, predating the break (§3) | Recorded. No inherited metric to be treated as current without re-derivation. |
| D6 — **hypothesis withdrawn** | Console rendered `Ω` as `�` in `live.ts` and prompt copies, suggesting encoding corruption | Byte scan: **zero** `EF BF BD` sequences in `live.ts`; the character at line 16 is `937` = `Ω` U+03A9 | **Not a defect.** The substitution was the Windows console codepage in my own output path. Recorded because it would otherwise be re-investigated by the next agent. |

---

## 7. Summary judgement

| Claim in inherited corpus | Verdict |
|---|---|
| Ω is a disciplined, real kernel with meaningful engineering | **True** — verified |
| Ω's browser substrate can operate a real authenticated web app | **True in design and code; currently not loadable** (§2) |
| 1418 tests green / gate green | **Stale** (§3) |
| Chat is available through the product | **False in-sandbox** — sim-only, needs an API key no composition grants (§5) |
| Claude / Gemini paths exist | **False** — zero references (§5) |
| The browser seed is the proving ground | **True as destination, but the chat seam is the actual missing piece** (§5) |

**Bottom line:** Ω buys a credible fail-closed kernel, a real CDP substrate, a vault, and a
discipline of evidence. It does **not** yet buy a working browser-mediated conversation — which
is the entire seed. The fastest route to meaningful product proof is to close the §5 seam, not to
broaden the architecture.
