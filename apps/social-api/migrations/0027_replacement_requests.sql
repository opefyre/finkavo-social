-- When a post was lost late — evidence revalidation failing just before publication, or
-- a review handoff that never completed — nothing said so. The day simply counted one
-- fewer good post and hoped the next recovery cycle would notice it was short. If that
-- cycle had already run, the slot stayed empty and the shortfall was invisible until the
-- queue ran dry. A lost post now files an explicit request for a replacement, and that
-- request is either filled or it raises an alert. Neither outcome is silence.
CREATE TABLE IF NOT EXISTS social_replacement_request (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  publish_date DATE NOT NULL,
  reason STRING NOT NULL,
  source_post_id UUID NULL,
  source_job_id UUID NULL,
  -- open: still owed. filled: a replacement post reached a publishable state.
  -- unfillable: the day ran out of topics, budget or time, and someone was told.
  status STRING NOT NULL DEFAULT 'open',
  filled_post_id UUID NULL,
  alerted_at TIMESTAMPTZ NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT social_replacement_request_status_check CHECK (status IN ('open','filled','unfillable'))
);

-- One open request per lost job, so a retry loop cannot file the same debt twice.
CREATE UNIQUE INDEX IF NOT EXISTS social_replacement_request_job_idx
  ON social_replacement_request (source_job_id) WHERE source_job_id IS NOT NULL AND status='open';
