ALTER TABLE social_post ADD COLUMN IF NOT EXISTS category STRING NOT NULL DEFAULT 'general';
ALTER TABLE social_post ADD COLUMN IF NOT EXISTS risk_level STRING NOT NULL DEFAULT 'medium';
ALTER TABLE social_post ADD COLUMN IF NOT EXISTS current_revision_id UUID NULL;
ALTER TABLE social_post ADD COLUMN IF NOT EXISTS approved_revision_id UUID NULL;
ALTER TABLE social_post ADD COLUMN IF NOT EXISTS scheduled_at TIMESTAMPTZ NULL;
ALTER TABLE social_post ADD COLUMN IF NOT EXISTS buffer_post_id STRING NULL;
ALTER TABLE social_post ADD COLUMN IF NOT EXISTS instagram_id STRING NULL;
ALTER TABLE social_post ADD COLUMN IF NOT EXISTS published_at TIMESTAMPTZ NULL;
ALTER TABLE social_post DROP CONSTRAINT IF EXISTS social_post_status_check;
ALTER TABLE social_post ADD CONSTRAINT social_post_status_check CHECK (status IN ('draft','researching','ready_for_review','approved','render_queued','rendered','scheduled','published','rejected','blocked','failed'));

CREATE TABLE IF NOT EXISTS social_post_revision (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID NOT NULL REFERENCES social_post(id) ON DELETE CASCADE,
  revision_number INT8 NOT NULL,
  locale STRING NOT NULL DEFAULT 'en',
  template_version STRING NOT NULL,
  hook STRING NOT NULL,
  caption STRING NOT NULL,
  call_to_action STRING NOT NULL,
  hashtags JSONB NOT NULL,
  slides JSONB NOT NULL,
  alt_texts JSONB NOT NULL,
  source_bundle JSONB NOT NULL,
  evidence_hash STRING NOT NULL,
  content_hash STRING NOT NULL,
  model STRING NULL,
  prompt_version STRING NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (post_id, revision_number),
  UNIQUE (post_id, content_hash)
);

CREATE INDEX IF NOT EXISTS social_post_revision_post_idx ON social_post_revision (post_id, created_at DESC);

ALTER TABLE social_claim ADD COLUMN IF NOT EXISTS revision_id UUID NULL REFERENCES social_post_revision(id) ON DELETE CASCADE;
ALTER TABLE social_claim ADD COLUMN IF NOT EXISTS risk_type STRING NOT NULL DEFAULT 'general';
ALTER TABLE social_claim ADD COLUMN IF NOT EXISTS review_state STRING NOT NULL DEFAULT 'supported';

CREATE TABLE IF NOT EXISTS social_claim_evidence (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  claim_id UUID NOT NULL REFERENCES social_claim(id) ON DELETE CASCADE,
  document_id UUID NOT NULL REFERENCES document(id),
  source_url STRING NOT NULL,
  source_title STRING NOT NULL,
  publisher STRING NULL,
  locale STRING NOT NULL,
  retrieved_at TIMESTAMPTZ NOT NULL,
  content_hash STRING NOT NULL,
  supporting_excerpt STRING NOT NULL,
  verification_method STRING NOT NULL DEFAULT 'canonical_corpus',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS social_claim_evidence_claim_idx ON social_claim_evidence (claim_id);

CREATE TABLE IF NOT EXISTS social_approval (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID NOT NULL REFERENCES social_post(id) ON DELETE CASCADE,
  revision_id UUID NOT NULL REFERENCES social_post_revision(id) ON DELETE CASCADE,
  evidence_hash STRING NOT NULL,
  decision STRING NOT NULL,
  reviewer STRING NOT NULL,
  comment STRING NULL,
  decided_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT social_approval_decision_check CHECK (decision IN ('approved', 'rejected'))
);

CREATE INDEX IF NOT EXISTS social_approval_post_idx ON social_approval (post_id, decided_at DESC);

CREATE TABLE IF NOT EXISTS social_review_token (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  token_hash STRING NOT NULL UNIQUE,
  post_id UUID NOT NULL REFERENCES social_post(id) ON DELETE CASCADE,
  revision_id UUID NOT NULL REFERENCES social_post_revision(id) ON DELETE CASCADE,
  evidence_hash STRING NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  used_at TIMESTAMPTZ NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS social_render_job (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID NOT NULL REFERENCES social_post(id) ON DELETE CASCADE,
  revision_id UUID NOT NULL REFERENCES social_post_revision(id) ON DELETE CASCADE,
  idempotency_key STRING NOT NULL UNIQUE,
  status STRING NOT NULL DEFAULT 'pending',
  manifest JSONB NOT NULL,
  manifest_hash STRING NOT NULL,
  attempt_count INT8 NOT NULL DEFAULT 0,
  available_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  lease_owner STRING NULL,
  lease_expires_at TIMESTAMPTZ NULL,
  output_files JSONB NULL,
  error_code STRING NULL,
  error_message STRING NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT social_render_job_status_check CHECK (status IN ('pending','leased','retrying','completed','failed'))
);

CREATE UNIQUE INDEX IF NOT EXISTS social_render_job_active_idx ON social_render_job (post_id, revision_id) WHERE status IN ('pending','leased','retrying','completed');
CREATE INDEX IF NOT EXISTS social_render_job_claim_idx ON social_render_job (status, available_at, created_at);

CREATE TABLE IF NOT EXISTS social_render_attempt (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id UUID NOT NULL REFERENCES social_render_job(id) ON DELETE CASCADE,
  attempt_number INT8 NOT NULL,
  worker_id STRING NOT NULL,
  started_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  finished_at TIMESTAMPTZ NULL,
  outcome STRING NULL,
  error_code STRING NULL,
  error_message STRING NULL,
  UNIQUE (job_id, attempt_number)
);

CREATE TABLE IF NOT EXISTS social_publish_job (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID NOT NULL REFERENCES social_post(id) ON DELETE CASCADE,
  revision_id UUID NOT NULL REFERENCES social_post_revision(id) ON DELETE CASCADE,
  render_job_id UUID NOT NULL REFERENCES social_render_job(id),
  provider STRING NOT NULL DEFAULT 'buffer',
  idempotency_key STRING NOT NULL UNIQUE,
  status STRING NOT NULL DEFAULT 'pending',
  scheduled_at TIMESTAMPTZ NOT NULL,
  provider_post_id STRING NULL,
  provider_status STRING NULL,
  attempt_count INT8 NOT NULL DEFAULT 0,
  available_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  error_code STRING NULL,
  error_message STRING NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT social_publish_job_status_check CHECK (status IN ('pending','retrying','scheduled','published','failed'))
);

CREATE UNIQUE INDEX IF NOT EXISTS social_publish_job_active_idx ON social_publish_job (post_id, provider) WHERE status IN ('pending','retrying','scheduled','published');
CREATE INDEX IF NOT EXISTS social_publish_job_process_idx ON social_publish_job (status, available_at, created_at);

CREATE TABLE IF NOT EXISTS social_publish_attempt (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id UUID NOT NULL REFERENCES social_publish_job(id) ON DELETE CASCADE,
  attempt_number INT8 NOT NULL,
  request_fingerprint STRING NOT NULL,
  started_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  finished_at TIMESTAMPTZ NULL,
  outcome STRING NULL,
  provider_correlation_id STRING NULL,
  error_code STRING NULL,
  error_message STRING NULL,
  UNIQUE (job_id, attempt_number)
);

CREATE TABLE IF NOT EXISTS social_renderer_heartbeat (
  worker_id STRING PRIMARY KEY,
  version STRING NOT NULL,
  last_seen_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  details JSONB NOT NULL DEFAULT '{}'::JSONB
);
