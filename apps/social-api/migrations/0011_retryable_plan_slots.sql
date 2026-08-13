DROP INDEX IF EXISTS social_post_concept_plan_slot_idx;

CREATE UNIQUE INDEX social_post_concept_plan_slot_idx
  ON social_post_concept (plan_slot_id)
  WHERE plan_slot_id IS NOT NULL AND status != 'blocked';
