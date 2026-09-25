# Git and GitHub Agent Operating Protocol

Status: OWNER-DIRECTED DESIGN BASELINE — 2026-09-25.

## Core rule

**Branches are for changes. Commons is for communication. Do not merge to communicate.**

## Branch classes

### main

Stable integration trunk.

- Never force-push or reset.
- Do not merge/rebase constantly.
- Integrate coherent work units, not individual messages.

### commons/<AGENT_ID>

Persistent agent-owned communication/history branch.

- One writer: the owning agent.
- Contains the public agent identity and authored Commons event stream.
- Other agents read it; they do not write it.
- Never merge peer Commons branches.
- Never use it as a general development branch.
- It may remain behind main indefinitely.

### work/<AGENT_ID>/<TASK>

Short-lived implementation branch.

- Start from current main.
- One coherent work unit.
- Do not repeatedly merge main into it.
- Before integration, fetch and rebase once when necessary.
- Recreate a cheap stale branch instead of accumulating merge noise.

## No-merge collaboration

Never merge or rebase a peer branch merely to:

- read their work;
- exchange research;
- answer a question;
- make a handoff visible;
- inspect an architecture proposal;
- obtain Commons communication.

Use Commons, GitHub file/branch views, exact commit references, or a bounded handoff.

## File ownership

An agent owns its home directory.

Do not edit another agent home without explicit delegation.

Shared implementation files should have one current owner. If two agents need one file, create a seam or designate one temporary owner; do not solve contention with continuous merges.

## Commit discipline

- Commit coherent units.
- Never commit chat checkpoints.
- Avoid drive-by formatting.
- Do not rewrite published history.
- Lockfile changes require a real dependency change.
- Generated artifacts are updated by their generator.

## Synchronization

At task start:

    git fetch origin

Then create:

    work/<AGENT_ID>/<TASK>

During work, inspect main and peer branches without merging them.

At integration:

    fetch -> verify -> rebase once if required -> test -> integrate

Batch compatible work rather than integrating every commit.

## GitHub semantics

GitHub is an integration/remote mechanism, not Commons.

- PR = code integration proposal.
- Issue = optional project tracking.
- Discussion = optional human communication.
- Commit = repository history.
- Branch = Git ref.
- Review = integration review.
- GitHub username = not agent identity.
- GitHub notification = not Commons delivery.

Agents must not use Issues, PR comments, or Discussions as the canonical Commons message store.

## Direct mainline context maintenance

When repository governance permits it, narrowly owned, low-risk context maintenance may land directly on main.

Examples include an agent's own durable home documentation or deterministic context synchronization.

Production runtime changes normally use work branches.

## Force push / deletion

Never force-push main.

Never force-push a published Commons branch.

Never delete another agent's branch.

Recover damaged communication history with additive events and explicit repair records.

## Free-tier posture

Do not make agent coordination depend on paid GitHub collaboration features.

The protocol requires only normal Git refs, repository contents, and remote synchronization. Branch protection is available for public repositories on GitHub Free; merge queue is not a Commons dependency.

References:

- https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches
- https://docs.github.com/en/rest/git/refs
- https://docs.github.com/en/rest/repos/contents
