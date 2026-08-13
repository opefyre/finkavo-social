ALTER TABLE social_editorial_plan_slot ADD COLUMN IF NOT EXISTS subject_family STRING NULL;
ALTER TABLE social_editorial_plan_slot ADD COLUMN IF NOT EXISTS user_question STRING NULL;
ALTER TABLE social_editorial_plan_slot ADD COLUMN IF NOT EXISTS content_intent STRING NULL;
ALTER TABLE social_editorial_plan_slot ADD COLUMN IF NOT EXISTS occurrence_key STRING NULL;
ALTER TABLE social_editorial_plan_slot ADD COLUMN IF NOT EXISTS campaign_stage STRING NULL;
ALTER TABLE social_editorial_plan_slot ADD COLUMN IF NOT EXISTS brief JSONB NULL;

ALTER TABLE social_post_concept ADD COLUMN IF NOT EXISTS subject_family STRING NULL;
ALTER TABLE social_post_concept ADD COLUMN IF NOT EXISTS user_question STRING NULL;
ALTER TABLE social_post_concept ADD COLUMN IF NOT EXISTS content_intent STRING NULL;
ALTER TABLE social_post_concept ADD COLUMN IF NOT EXISTS occurrence_key STRING NULL;

ALTER TABLE social_post ADD COLUMN IF NOT EXISTS subject_family STRING NULL;
ALTER TABLE social_post ADD COLUMN IF NOT EXISTS user_question STRING NULL;
ALTER TABLE social_post ADD COLUMN IF NOT EXISTS content_intent STRING NULL;
ALTER TABLE social_post ADD COLUMN IF NOT EXISTS occurrence_key STRING NULL;

CREATE INDEX IF NOT EXISTS social_editorial_plan_identity_idx
  ON social_editorial_plan_slot (subject_family, user_question, audience, content_intent, occurrence_key);

CREATE INDEX IF NOT EXISTS social_post_concept_identity_idx
  ON social_post_concept (subject_family, user_question, content_intent, occurrence_key);

CREATE INDEX IF NOT EXISTS social_post_identity_idx
  ON social_post (subject_family, user_question, audience, content_intent, occurrence_key);
