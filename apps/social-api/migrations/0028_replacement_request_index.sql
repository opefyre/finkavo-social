CREATE INDEX IF NOT EXISTS social_replacement_request_open_idx
  ON social_replacement_request (publish_date, status);
