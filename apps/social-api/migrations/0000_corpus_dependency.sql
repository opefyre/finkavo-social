-- Minimal local corpus table required by the standalone social pipeline.
-- The main Finkavo application owns a richer version of this table, but the
-- social service only relies on these columns and foreign-key identity.
CREATE TABLE IF NOT EXISTS document (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source_tier STRING NOT NULL,
  source_url STRING NOT NULL,
  source_authority STRING NULL,
  title STRING NOT NULL,
  original_lang STRING NOT NULL,
  content_hash STRING NOT NULL UNIQUE,
  fetched_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  last_verified_at TIMESTAMPTZ NULL,
  freshness_confidence STRING NOT NULL DEFAULT 'fresh',
  last_upstream_check_at TIMESTAMPTZ NULL,
  verified_still_available BOOL NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS document_source_url_idx ON document (source_url);
