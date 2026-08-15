ALTER TABLE social_post ADD COLUMN IF NOT EXISTS archived_at TIMESTAMPTZ NULL;
ALTER TABLE social_post ADD COLUMN IF NOT EXISTS archived_by STRING NULL;
ALTER TABLE social_post ADD COLUMN IF NOT EXISTS archive_note STRING NULL;

CREATE INDEX IF NOT EXISTS social_post_archived_idx ON social_post (archived_at DESC) WHERE archived_at IS NOT NULL;
