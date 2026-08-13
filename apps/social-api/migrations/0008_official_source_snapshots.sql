CREATE TABLE IF NOT EXISTS social_official_source_snapshot (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  canonical_url STRING NOT NULL,
  http_status INT8 NOT NULL,
  content_hash STRING NOT NULL,
  content_length INT8 NOT NULL,
  changed BOOLEAN NOT NULL DEFAULT false,
  fetched_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (canonical_url, content_hash)
);

CREATE INDEX IF NOT EXISTS social_official_source_snapshot_latest_idx
  ON social_official_source_snapshot (canonical_url, fetched_at DESC);
