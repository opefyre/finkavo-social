-- Re-ingesting a canonical source must update the existing document rather than add a
-- second copy of the same page. Evidence research requires a brief's canonical URL to be
-- present, and duplicates would let one stale copy shadow a freshly fetched one.
--
-- The 14 existing documents already have distinct source_url values, so this is additive.
CREATE UNIQUE INDEX IF NOT EXISTS document_source_url_key ON document (source_url);
