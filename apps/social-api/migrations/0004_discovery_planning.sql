CREATE TABLE IF NOT EXISTS social_discovery (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  canonical_url STRING NOT NULL,
  title STRING NOT NULL,
  publisher STRING NULL,
  locale STRING NOT NULL DEFAULT 'en',
  published_at TIMESTAMPTZ NULL,
  fetched_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  content_hash STRING NOT NULL,
  source_kind STRING NOT NULL DEFAULT 'news_discovery',
  evidence_state STRING NOT NULL DEFAULT 'discovery_only',
  category STRING NOT NULL DEFAULT 'general',
  risk_level STRING NOT NULL DEFAULT 'medium',
  raw_metadata JSONB NOT NULL DEFAULT '{}'::JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (canonical_url, content_hash),
  CONSTRAINT social_discovery_evidence_check CHECK (evidence_state IN ('discovery_only','promoted','ignored'))
);

CREATE INDEX IF NOT EXISTS social_discovery_recent_idx ON social_discovery (published_at DESC, created_at DESC);

CREATE TABLE IF NOT EXISTS social_post_concept (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  document_id UUID NULL REFERENCES document(id),
  discovery_id UUID NULL REFERENCES social_discovery(id),
  topic STRING NOT NULL,
  category STRING NOT NULL,
  risk_level STRING NOT NULL,
  priority INT8 NOT NULL DEFAULT 0,
  timeliness STRING NOT NULL DEFAULT 'evergreen',
  locale STRING NOT NULL DEFAULT 'en',
  fingerprint STRING NOT NULL UNIQUE,
  status STRING NOT NULL DEFAULT 'eligible',
  planned_for DATE NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT social_post_concept_status_check CHECK (status IN ('eligible','planned','used','blocked'))
);

CREATE INDEX IF NOT EXISTS social_post_concept_plan_idx ON social_post_concept (status, priority DESC, created_at);
