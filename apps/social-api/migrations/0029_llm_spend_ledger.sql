-- The daily token budget and the paid-provider caps lived only in the process. Every
-- restart — a deploy, a crash, launchd respawning the service — set both back to zero,
-- so "fifteen paid calls a day" was really "fifteen paid calls per restart". On a crash
-- loop that is not a ceiling at all, which is the opposite of what the caps were added
-- to guarantee. Spend is recorded here so it survives the process that spent it.
CREATE TABLE IF NOT EXISTS social_llm_spend (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  paid BOOL NOT NULL DEFAULT false,
  -- Signed: a reservation is written before the call, and the difference between what
  -- was reserved and what was actually billed is written after it. Summing gives the
  -- true spend, and a crash between the two over-counts rather than under-counts.
  tokens INT8 NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
