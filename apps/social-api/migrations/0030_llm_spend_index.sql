CREATE INDEX IF NOT EXISTS social_llm_spend_recent_idx ON social_llm_spend (created_at DESC, paid);
