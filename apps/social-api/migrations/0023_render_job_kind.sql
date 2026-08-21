-- A render job now says what it is producing. A carousel job yields five PNGs; a reel job
-- yields an MP4 and the cover frame Instagram would otherwise pick badly for itself. They
-- share the queue, the leases and the retry behaviour, because none of that cares what
-- comes out at the end.
ALTER TABLE social_render_job ADD COLUMN IF NOT EXISTS kind STRING NOT NULL DEFAULT 'carousel';
CREATE INDEX IF NOT EXISTS social_render_job_kind_idx ON social_render_job (kind, status);
