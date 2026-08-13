ALTER TABLE social_reserve_evidence ADD COLUMN IF NOT EXISTS document_id UUID NULL REFERENCES document(id);
CREATE INDEX IF NOT EXISTS social_reserve_evidence_document_idx ON social_reserve_evidence (document_id);
