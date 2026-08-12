CREATE TABLE IF NOT EXISTS social_editorial_rule (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug STRING NOT NULL UNIQUE,
  title STRING NOT NULL,
  category STRING NOT NULL,
  audience STRING NOT NULL,
  risk_level STRING NOT NULL,
  recurrence JSONB NOT NULL,
  campaign JSONB NOT NULL,
  source_url STRING NOT NULL,
  source_label STRING NOT NULL,
  verification_cadence_days INT8 NOT NULL,
  active BOOL NOT NULL DEFAULT true,
  config_version INT8 NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS social_editorial_occurrence (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  rule_id UUID NOT NULL REFERENCES social_editorial_rule(id) ON DELETE CASCADE,
  due_date DATE NOT NULL,
  source_verified_at TIMESTAMPTZ NULL,
  status STRING NOT NULL DEFAULT 'needs_verification',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (rule_id, due_date),
  CONSTRAINT social_editorial_occurrence_status_check CHECK (status IN ('needs_verification','verified','changed','cancelled'))
);

ALTER TABLE social_post_concept ADD COLUMN IF NOT EXISTS occurrence_id UUID NULL REFERENCES social_editorial_occurrence(id);
ALTER TABLE social_post_concept ADD COLUMN IF NOT EXISTS campaign_stage STRING NULL;
ALTER TABLE social_post_concept ADD COLUMN IF NOT EXISTS reason STRING NULL;
ALTER TABLE social_post_concept ADD COLUMN IF NOT EXISTS expires_at TIMESTAMPTZ NULL;
ALTER TABLE social_post_concept ADD COLUMN IF NOT EXISTS repeat_allowed BOOL NOT NULL DEFAULT false;
ALTER TABLE social_post_concept ADD COLUMN IF NOT EXISTS score INT8 NOT NULL DEFAULT 0;
CREATE INDEX IF NOT EXISTS social_post_concept_daily_idx ON social_post_concept (planned_for, status, score DESC);
ALTER TABLE social_post ADD COLUMN IF NOT EXISTS post_intent STRING NOT NULL DEFAULT 'evergreen_explainer';
ALTER TABLE social_post ADD COLUMN IF NOT EXISTS search_keywords JSONB NOT NULL DEFAULT '[]'::JSONB;
ALTER TABLE social_post_revision ADD COLUMN IF NOT EXISTS post_intent STRING NOT NULL DEFAULT 'evergreen_explainer';
ALTER TABLE social_post_revision ADD COLUMN IF NOT EXISTS search_keywords JSONB NOT NULL DEFAULT '[]'::JSONB;
