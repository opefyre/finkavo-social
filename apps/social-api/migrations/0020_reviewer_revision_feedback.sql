-- A rejection used to retire the topic: the concept was blocked, its slot held, and the
-- reviewer's comment was stored for display and never read again. There was no way to
-- hand a post back to the model with notes — only to reopen the identical draft or to
-- rewrite it by hand. These two columns carry the reviewer's words into the next
-- generation, and count the rounds so a topic cannot loop forever.
ALTER TABLE social_post_concept ADD COLUMN IF NOT EXISTS revision_feedback STRING NULL;
ALTER TABLE social_post_concept ADD COLUMN IF NOT EXISTS revision_round INT NOT NULL DEFAULT 0;
