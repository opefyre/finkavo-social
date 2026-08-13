ALTER TABLE social_post ADD COLUMN IF NOT EXISTS planned_for DATE NULL;
CREATE INDEX IF NOT EXISTS social_post_planned_for_status_idx ON social_post (planned_for, status, created_at DESC);
