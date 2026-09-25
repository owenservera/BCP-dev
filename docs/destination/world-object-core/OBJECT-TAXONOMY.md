
# Object Taxonomy and Semantic Boundaries

> Classification: DERIVED — DESIGN-CANDIDATE
> Goal: resolve the requested product nouns without creating redundant persistence truths.

| Concept | Canonical? | Meaning | Main source of truth |
|---|---|---|---|
| World | No | Derived view of accessible canonical reality | canonical objects + relationships |
| Object / Thing | Yes | Generic durable semantic record | vault object |
| Message | Yes | One communication unit | typed message object / chat domain |
| Conversation | Yes | Durable communication container/context | typed conversation object |
| Document | Yes | Durable semantic content object | object payload/content ref |
| File | Yes | Storage/resource representation | object + source/content refs |
| Artifact | Role | Produced/deliverable role | Work/provenance relationship |
| Project | Yes | User-meaningful organizing/work object | canonical object + relations |
| Space | Yes | Durable semantic environment | canonical object |
| Workspace | Derived/config | Configured interaction arrangement | projection/configuration |
| Relationship | Yes | Semantic claim between objects | relationship object |
| Revision | Substrate | One historical object state | (ns,id,rev) + changelog |
| Source Identity | Mapping | External identity evidence | source mapping |
| Projection | No | Rebuildable derivation | derived computation |
| Alias | Mapping | Alternate address to canonical ref | identity mapping record |
| Tombstone | State pattern | Explicit delete/retirement marker | latest object revision |
| Export | Operation | Portable canonical state | vault + manifest |
| Restore | Operation | Reconstruct canonical state | import + reconstruction |

## Message

Message is not merely text. It includes communication role/order and may carry provider realization, stream provenance and source identity.

## Conversation

Conversation is a canonical object that may contain messages through semantic relationships and/or domain ordering. A conversation view can project the ordered sequence without making the view authoritative.

## Document

Document means semantic content intended to be read or edited as a coherent work. Its content can be inline structured data or a content reference.

## File

File identifies a resource in local or external storage. Source location, bytes and semantic meaning are distinct. A file path can change without changing a user's canonical document identity.

## Relationship

Relationships are first-class because important facts cannot be encoded safely in either endpoint without duplication.

Examples:
~~~text
project --[contains]--> conversation
conversation --[contains-message]--> message
message --[produced-by-realization]--> provider-realization
object --[produced-by]--> work
file --[representation-of]--> document
~~~

The final predicate vocabulary remains separately governed.
