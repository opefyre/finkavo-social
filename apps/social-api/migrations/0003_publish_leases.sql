ALTER TABLE social_publish_job ADD COLUMN IF NOT EXISTS lease_owner STRING NULL;
ALTER TABLE social_publish_job ADD COLUMN IF NOT EXISTS lease_expires_at TIMESTAMPTZ NULL;
ALTER TABLE social_publish_job DROP CONSTRAINT IF EXISTS social_publish_job_status_check;
ALTER TABLE social_publish_job ADD CONSTRAINT social_publish_job_status_v2_check CHECK (status IN ('pending','processing','retrying','scheduled','published','blocked','failed'));
