-- Durable provider cooldown.
--
-- Buffer rate-limit responses were handled per job: the failing job backed off, but the
-- next scheduled tick called Buffer again immediately. With the publish loop running
-- every two minutes that meant continuously re-hitting a provider that had already said
-- stop, which is how two posts sat in `retrying` while the monitor logged
-- RATE_LIMIT_EXCEEDED on every pass.
--
-- Recording the cooldown centrally lets every Buffer-touching endpoint check one gate,
-- and it survives an API restart.
CREATE TABLE IF NOT EXISTS social_provider_cooldown (
  provider   STRING PRIMARY KEY,
  until      TIMESTAMPTZ NOT NULL,
  reason     STRING,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
