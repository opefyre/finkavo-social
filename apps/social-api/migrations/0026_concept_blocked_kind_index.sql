-- Its own file because CockroachDB runs ADD COLUMN as a background job: an index in the
-- same batch as the column it covers can be planned before the column exists.
CREATE INDEX IF NOT EXISTS social_post_concept_blocked_kind_idx ON social_post_concept (blocked_kind, blocked_at DESC);
