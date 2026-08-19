-- News discovery collected 208 items a day but promoted almost none: triage would only
-- promote a URL already present in the canonical corpus, which a newly published
-- official page never is, and a newspaper URL never can be. Triage now tries to reach
-- official evidence for an item, either by ingesting the official page itself or by
-- following an official link out of the article. Both cost a fetch, so the attempt is
-- recorded and not repeated every quarter hour.
ALTER TABLE social_discovery ADD COLUMN IF NOT EXISTS corroboration_attempted_at TIMESTAMPTZ;
ALTER TABLE social_discovery ADD COLUMN IF NOT EXISTS corroborating_url STRING;
