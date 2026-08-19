-- A document is identified by its source URL, not by its text.
--
-- Two distinct official pages can normalise to identical visible text — an alias URL, a
-- thin landing page, or two service pages sharing boilerplate. With content_hash unique,
-- ingesting the second one failed with a duplicate-key error and aborted the whole run,
-- so briefs citing it were held for lack of a source.
--
-- content_hash stays on the row: it is how change detection works. It just is not an
-- identity. document_source_url_key (0017) is the real key.
DROP INDEX IF EXISTS document_content_hash_key CASCADE;

CREATE INDEX IF NOT EXISTS document_content_hash_idx ON document (content_hash);
