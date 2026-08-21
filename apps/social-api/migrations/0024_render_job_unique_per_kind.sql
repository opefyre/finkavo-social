-- One render per revision was right when a revision had one shape. A reel is a second
-- render of the same revision — the same approved words, produced as a video instead of
-- slides — and the old index refused it, so queueing a reel failed against the carousel
-- that already existed. The rule is still one active render per revision *per kind*.
DROP INDEX IF EXISTS social_render_job_active_idx;
CREATE UNIQUE INDEX IF NOT EXISTS social_render_job_active_idx
  ON social_render_job (post_id, revision_id, kind)
  WHERE status IN ('pending', 'leased', 'retrying', 'completed');
