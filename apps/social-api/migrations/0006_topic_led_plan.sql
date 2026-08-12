CREATE TABLE IF NOT EXISTS social_editorial_plan_slot (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  plan_version INT8 NOT NULL,
  publish_date DATE NOT NULL,
  publish_time STRING NOT NULL,
  slot_number INT8 NOT NULL,
  pillar STRING NOT NULL,
  angle STRING NOT NULL,
  topic STRING NOT NULL,
  audience STRING NOT NULL,
  risk_level STRING NOT NULL,
  timing_class STRING NOT NULL,
  reserve_kind STRING NOT NULL,
  search_terms JSONB NOT NULL,
  required_authority STRING NOT NULL,
  occurrence_number INT8 NOT NULL,
  status STRING NOT NULL DEFAULT 'planned',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (plan_version, publish_date, slot_number),
  CONSTRAINT social_editorial_plan_slot_status_check CHECK (status IN ('planned','researching','evidence_ready','used','held','replaced'))
);

CREATE INDEX IF NOT EXISTS social_editorial_plan_slot_day_idx
  ON social_editorial_plan_slot (publish_date, slot_number);

CREATE TABLE IF NOT EXISTS social_topic_evidence_bundle (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  plan_slot_id UUID NOT NULL REFERENCES social_editorial_plan_slot(id) ON DELETE CASCADE,
  bundle_hash STRING NOT NULL,
  sources JSONB NOT NULL,
  verification_state STRING NOT NULL,
  verified_at TIMESTAMPTZ NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (plan_slot_id, bundle_hash),
  CONSTRAINT social_topic_evidence_bundle_state_check CHECK (verification_state IN ('candidate','verified','held','stale'))
);

ALTER TABLE social_post_concept ADD COLUMN IF NOT EXISTS plan_slot_id UUID NULL REFERENCES social_editorial_plan_slot(id);
ALTER TABLE social_post_concept ADD COLUMN IF NOT EXISTS evidence_bundle_id UUID NULL REFERENCES social_topic_evidence_bundle(id);
CREATE UNIQUE INDEX IF NOT EXISTS social_post_concept_plan_slot_idx ON social_post_concept (plan_slot_id) WHERE plan_slot_id IS NOT NULL;
