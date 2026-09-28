# Adjacent standard research: Git worktrees

Collected 2026-09-28.

Primary source: https://git-scm.com/docs/git-worktree

Git documents worktrees as multiple working trees attached to one repository, allowing different branches to be checked out simultaneously while maintaining administrative metadata that distinguishes each working tree.

The command surface includes creation, listing, locking, moving, removing, repairing and pruning worktrees.

## Relevance to autonomous OpenCode agents

This directly supports the Ω project rule that concurrently active agents should not share one mutable checkout.

A strong agent workspace unit is:

`one agent identity + one isolated worktree/clone + one owned branch + one coherent task`

Worktrees are especially useful where agents share the same object database but need filesystem/index separation. Separate clones provide a stronger boundary when an agent is untrusted or likely to mutate Git metadata.

This research does not change the existing Ω project Git protocol; it provides upstream documentation supporting the isolation mechanism already chosen there.
