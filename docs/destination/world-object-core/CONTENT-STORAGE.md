
# Content and Source Storage Boundary

> Classification: DERIVED — DESIGN-CANDIDATE
> Status: semantic rule settled; large/binary backing still experiment-required.

## 1. Three different identities

~~~text
Object identity  -> this thing
Source identity  -> this external record
Content identity -> these exact bytes/serialized data
~~~

They may point to one another but must not collapse.

## 2. Structured object content

For ordinary Ω objects, the existing canonical JSON CAS is appropriate.

The vault already canonicalizes, hashes, stores, deduplicates, verifies, exports and restores.

Thus a new object kind can use existing persistence without a new storage engine.

## 3. Large/binary content

Files and media introduce a boundary the current JSON CAS does not fully settle.

Candidate semantic shape:
~~~text
content:
  mode = inline | content-ref
  mediaType?
  size?
  cid?
  encoding?
~~~

A file's local path is a source locator, not necessarily its canonical content location.

## 4. File vs Document

A document may have a native semantic body, one or more file representations, or imported external source identities.

A file may simply represent bytes at a storage resource.

Therefore a document is not just a file, and a file is not automatically the canonical semantic document.

## 5. No duplicate canonical bytes

When the same canonical content is used by multiple objects, store it once at the content layer where practical while retaining separate object identity and provenance.

Work results should reference produced canonical objects rather than embed another complete copy.

## Open experiment

Use a large local file and prove:
1. stable object identity across path changes;
2. content dedup by CID;
3. export/restore of content;
4. no second semantic copy is required.
