-- Until now a blocked concept recorded only why it was *created*, never why it was
-- retired. Reconstructing that meant joining three tables and normalising event
-- payloads by hand, and the answer was usually "the model had a bad minute" rather
-- than anything about the topic. These columns make the retirement legible at the row.
ALTER TABLE social_post_concept ADD COLUMN IF NOT EXISTS blocked_reason STRING NULL;

-- The kind is what decides whether a topic can come back:
--   infrastructure   provider timeout, rate limit, malformed JSON — the topic was never judged
--   content_quality  the draft repeatedly failed an editorial rule
--   evidence         the source could not be verified or had gone stale
--   duplicate        genuinely already covered by a live post
--   relevance        outside the editorial policy
--   no_source        no verified official document backs it yet
--   reviewer         a human said no
--   superseded       a duplicate row for a topic that is alive elsewhere
ALTER TABLE social_post_concept ADD COLUMN IF NOT EXISTS blocked_kind STRING NULL;

-- A generation failure is an attempt, not a verdict. Counting attempts lets a topic
-- return to the bank until it has genuinely earned retirement.
ALTER TABLE social_post_concept ADD COLUMN IF NOT EXISTS generation_attempts INT8 NOT NULL DEFAULT 0;

ALTER TABLE social_post_concept ADD COLUMN IF NOT EXISTS blocked_at TIMESTAMPTZ NULL;

