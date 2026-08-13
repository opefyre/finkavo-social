CREATE TABLE IF NOT EXISTS social_reserve_evidence (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  canonical_url STRING NOT NULL,
  authority STRING NOT NULL,
  title STRING NOT NULL,
  original_lang STRING NOT NULL DEFAULT 'pt',
  content_hash STRING NOT NULL,
  visible_text STRING NOT NULL,
  fetched_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  verified_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  available BOOLEAN NOT NULL DEFAULT true,
  UNIQUE (canonical_url, content_hash)
);
CREATE INDEX IF NOT EXISTS social_reserve_evidence_latest_idx ON social_reserve_evidence (canonical_url, verified_at DESC);
