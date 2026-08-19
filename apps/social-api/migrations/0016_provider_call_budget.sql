-- Buffer call budgeting.
--
-- Buffer's API allows 250 requests per rolling day. The publish monitor ran every two
-- minutes and issued one call per scheduled job, which is roughly 720 calls a day for
-- monitoring alone. The daily quota was therefore exhausted every day before any post
-- reached its due time, the monitor could never confirm delivery, and nothing ever
-- moved to published.
--
-- Five posts a day genuinely needs about thirty calls. These two additions make the
-- spend measurable and let the monitor back off per job instead of polling blindly.

ALTER TABLE social_publish_job ADD COLUMN IF NOT EXISTS last_provider_check_at TIMESTAMPTZ;

CREATE TABLE IF NOT EXISTS social_provider_call (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider   STRING NOT NULL,
  kind       STRING NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS social_provider_call_recent
  ON social_provider_call (provider, created_at DESC);
