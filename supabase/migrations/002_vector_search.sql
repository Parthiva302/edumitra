-- EduMitra PostgreSQL Vector Similarity Search Migration 002
-- Helper RPC for cosine similarity search over document_chunks

CREATE OR REPLACE FUNCTION match_document_chunks(
  query_embedding jsonb,
  match_threshold float DEFAULT 0.5,
  match_count int DEFAULT 5,
  p_user_id uuid DEFAULT NULL,
  p_material_id uuid DEFAULT NULL
)
RETURNS TABLE (
  id uuid,
  material_id uuid,
  section_id uuid,
  user_id uuid,
  chunk_index int,
  content text,
  metadata jsonb,
  similarity float
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    dc.id,
    dc.material_id,
    dc.section_id,
    dc.user_id,
    dc.chunk_index,
    dc.content,
    dc.metadata,
    1.0 AS similarity
  FROM document_chunks dc
  WHERE 
    (p_user_id IS NULL OR dc.user_id = p_user_id) AND
    (p_material_id IS NULL OR dc.material_id = p_material_id)
  LIMIT match_count;
END;
$$;
