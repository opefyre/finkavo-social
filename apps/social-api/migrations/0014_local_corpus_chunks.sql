CREATE TABLE IF NOT EXISTS chunk (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  document_id UUID NOT NULL REFERENCES document(id) ON DELETE CASCADE,
  chunk_index INT NOT NULL,
  text STRING NOT NULL,
  token_count INT NOT NULL DEFAULT 0,
  lang STRING NOT NULL DEFAULT 'pt',
  content_hash STRING NULL,
  vault_doc_id UUID NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (document_id, chunk_index)
);

CREATE INDEX IF NOT EXISTS chunk_document_id_idx ON chunk (document_id);
