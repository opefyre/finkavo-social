-- Which provider a spend belongs to. Without it the ledger could tell you the day's total
-- but not which account it was charged against, and the per-provider ceiling that keeps a
-- possibly-billable standby bounded had nothing to rebuild itself from after a restart.
ALTER TABLE social_llm_spend ADD COLUMN IF NOT EXISTS provider STRING NULL;
