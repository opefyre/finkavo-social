CREATE TABLE IF NOT EXISTS social_post (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  status STRING NOT NULL DEFAULT 'draft',
  topic STRING NOT NULL,
  audience STRING NOT NULL DEFAULT 'English-speaking people in Portugal',
  source_document_id UUID NULL REFERENCES document(id),
  source_url STRING NOT NULL,
  source_title STRING NOT NULL,
  source_authority STRING NULL,
  source_fetched_at TIMESTAMPTZ NULL,
  hook STRING NOT NULL,
  caption STRING NOT NULL,
  call_to_action STRING NOT NULL,
  hashtags JSONB NOT NULL DEFAULT '[]'::JSONB,
  slides JSONB NOT NULL,
  model STRING NULL,
  prompt_version STRING NOT NULL DEFAULT 'v1',
  approved_at TIMESTAMPTZ NULL,
  approved_by STRING NULL,
  rendered_at TIMESTAMPTZ NULL,
  render_files JSONB NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT social_post_status_check CHECK (status IN ('draft', 'approved', 'rendered', 'scheduled', 'published', 'rejected', 'failed'))
);

CREATE INDEX IF NOT EXISTS social_post_status_created_idx ON social_post (status, created_at DESC);
CREATE INDEX IF NOT EXISTS social_post_source_document_idx ON social_post (source_document_id);

CREATE TABLE IF NOT EXISTS social_claim (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID NOT NULL REFERENCES social_post(id) ON DELETE CASCADE,
  claim_text STRING NOT NULL,
  evidence_quote STRING NOT NULL,
  source_url STRING NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS social_claim_post_idx ON social_claim (post_id);

CREATE TABLE IF NOT EXISTS social_event (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID NULL REFERENCES social_post(id) ON DELETE CASCADE,
  event_type STRING NOT NULL,
  payload JSONB NOT NULL DEFAULT '{}'::JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS social_event_post_created_idx ON social_event (post_id, created_at DESC);
