# Product Environment — Open Frontier

## 1. Shell architecture

Still unresolved:

- native host technology and hosting strategy;
- process topology;
- runtime/bootstrap boundary;
- multiple surfaces/windows;
- startup ordering;
- shell/runtime version compatibility;
- single-instance behavior;
- child-process management.

## 2. Windows resource model

Need a canonical taxonomy for:

- filesystem resources;
- process/application resources;
- windows;
- displays;
- input devices;
- clipboard;
- notifications;
- installed applications;
- devices;
- network resources;
- power/session state;
- machine identity.

The model must distinguish durable identity from transient handles.

## 3. Desktop interaction

Need a governed model for:

- focus;
- pointer;
- keyboard;
- clipboard;
- window control;
- screenshots/observation;
- native application interaction;
- cross-window workflows.

The research must determine which interactions can be deterministic local capabilities and which require stronger authority or human presence.

## 4. Product lifecycle

Need exact semantics for:

- installation;
- first-run initialization;
- upgrades;
- database/schema migration;
- plugin compatibility;
- rollback;
- crash recovery;
- interrupted update;
- restore;
- uninstall without destructive data loss.

## 5. Resource lifecycle / hydration

Ω already contains liveness/hydration concepts, but their relationship to product resources is incomplete.

Need to determine:

- dormant versus unavailable versus suspended;
- resource discovery and observation;
- leases and fencing;
- wake/hydration;
- release/shed behavior;
- stale resource handles;
- account/session resource boundaries.

## 6. Local security and secrets

Need to characterize:

- Windows credential/secret stores;
- process isolation;
- least-privilege OS permissions;
- user-mediated access;
- secret reference semantics;
- audit/evidence without secret disclosure;
- recovery when a secret is unavailable.

## 7. Notification and attention

Need to connect the existing attention/standing-intent model to actual Windows delivery mechanisms without duplicating attention semantics.

## 8. Diagnostics and repair

Need a product-level model for:

```
OBSERVE
→ CLASSIFY
→ EXPLAIN
→ PROPOSE
→ AUTHORIZE
→ REPAIR
→ VERIFY
```

with quarantine and rollback where required.

## 9. Framework choice

No framework should be selected merely because it is popular.

The research should compare viable current Windows approaches against:

- local-first constraints;
- startup/runtime control;
- native OS access;
- security boundaries;
- embedded web surface needs;
- process and resource management;
- update/recovery requirements;
- development ergonomics;
- dependency footprint;
- long-term replaceability.

## 10. Owner-machine evidence

At least these questions may require live Windows experiments:

- application/window enumeration;
- deterministic focus/input behavior;
- clipboard isolation and permissions;
- notification delivery;
- crash/startup recovery;
- update interruption and rollback;
- secret-store behavior;
- filesystem/application observation;
- resource hydration and process lifecycle.
