-- Infrastructure failures deliberately do not count against a concept's judged attempts,
-- which left nothing capping them at all: one concept was attempted 84 times while its
-- generation_attempts column read 6. This counts every attempt regardless of cause so an
-- unworkable concept can be retired before it spends another day's worth of calls.
ALTER TABLE social_post_concept ADD COLUMN IF NOT EXISTS total_generation_attempts INT NOT NULL DEFAULT 0;
