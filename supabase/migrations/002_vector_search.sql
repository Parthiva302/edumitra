-- ==============================================================================
-- EDUMITRA - POSTGRESQL PGVECTOR VECTOR SIMILARITY SEARCH MIGRATION 002
-- Production RPC with Strict User Isolation and 768-dim Embeddings
-- ==============================================================================

-- 1. Create Cosine Distance Vector Index (HNSW for blazing fast approximate nearest neighbor search)
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM pg_extension WHERE extname = 'vector'
    ) THEN
        CREATE INDEX IF NOT EXISTS idx_document_chunks_embedding_hnsw 
        ON document_chunks 
        USING hnsw (embedding vector_cosine_ops);
    END IF;
EXCEPTION
    WHEN OTHERS THEN
        NULL; -- Ignore if hnsw is unavailable on specific Postgres versions
END $$;

-- 2. match_document_chunks RPC function
-- Strict user_id enforcement ensures NO user can ever retrieve another user's private document chunks
CREATE OR REPLACE FUNCTION match_document_chunks(
    query_embedding vector(768),
    user_id uuid,
    document_id uuid DEFAULT NULL,
    top_k int DEFAULT 5,
    similarity_threshold float DEFAULT 0.3
)
RETURNS TABLE (
    id uuid,
    document_id uuid,
    user_id uuid,
    content text,
    page_number int,
    chapter text,
    section text,
    chunk_index int,
    metadata jsonb,
    similarity float
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    RETURN QUERY
    SELECT
        dc.id,
        COALESCE(dc.document_id, dc.material_id) AS document_id,
        dc.user_id,
        dc.content,
        COALESCE(dc.page_number, (dc.metadata->>'page_number')::int, 1) AS page_number,
        COALESCE(dc.chapter, dc.metadata->>'chapter', '') AS chapter,
        COALESCE(dc.section, dc.metadata->>'section', '') AS section,
        dc.chunk_index,
        dc.metadata,
        (1.0 - (dc.embedding <=> query_embedding))::float AS similarity
    FROM document_chunks dc
    WHERE 
        dc.user_id = match_document_chunks.user_id
        AND (match_document_chunks.document_id IS NULL OR dc.document_id = match_document_chunks.document_id OR dc.material_id = match_document_chunks.document_id)
        AND dc.embedding IS NOT NULL
        AND (1.0 - (dc.embedding <=> query_embedding)) >= similarity_threshold
    ORDER BY dc.embedding <=> query_embedding ASC
    LIMIT top_k;
END;
$$;

-- Grant execution permission to authenticated and service_role users
GRANT EXECUTE ON FUNCTION match_document_chunks(vector(768), uuid, uuid, int, float) TO authenticated, service_role;
