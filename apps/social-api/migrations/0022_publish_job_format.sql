-- Which shape this post goes out in, decided when it is given a slot rather than when it
-- is handed over, so the day's mix can be counted while it is still being built.
ALTER TABLE social_publish_job ADD COLUMN IF NOT EXISTS format STRING NOT NULL DEFAULT 'carousel';
ALTER TABLE social_publish_job ADD COLUMN IF NOT EXISTS format_reason STRING NULL;
CREATE INDEX IF NOT EXISTS social_publish_job_format_day_idx ON social_publish_job (scheduled_at, format);
