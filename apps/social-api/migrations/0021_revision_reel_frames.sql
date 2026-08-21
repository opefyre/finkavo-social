-- The reel version of a revision, written in the same generation call. Kept beside the
-- slides rather than in its own table because it is the same post in another shape: it
-- shares the revision's evidence, its approval and its fate. Null means this post goes
-- out as a carousel only, which is a normal outcome and not a failure.
ALTER TABLE social_post_revision ADD COLUMN IF NOT EXISTS reel_frames JSONB NULL;
ALTER TABLE social_post_revision ADD COLUMN IF NOT EXISTS reel_rejected_reason STRING NULL;
