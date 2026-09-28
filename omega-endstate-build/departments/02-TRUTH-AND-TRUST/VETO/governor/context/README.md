# Context Store

This directory holds reusable context bundles and cold-start packets.

Context is a derived view over durable evidence.

Do not treat a bundle as permanent truth.

Each bundle should identify:

- task;
- generation date;
- source revisions;
- included evidence;
- known exclusions;
- unresolved uncertainty.

Prefer small task-specific bundles over one ever-growing master prompt.
