-- Run this in the Supabase SQL Editor BEFORE running the re-embedding script
-- This updates the vector column from its current dimension to 768

-- Step 1: Alter the embedding column to accept 768-dimensional vectors
ALTER TABLE document_chunks
ALTER COLUMN embedding TYPE vector(768)
USING embedding::vector(768);

-- Step 2: Recreate the match_documents function for 768-dim vectors
CREATE OR REPLACE FUNCTION match_documents(
    query_embedding vector(768),
    match_count int DEFAULT 10
)
RETURNS TABLE (
    id bigint,
    content text,
    document_id text,
    section_number text,
    page_numbers int[],
    similarity float
)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT
        dc.id,
        dc.content,
        dc.document_id,
        dc.section_number,
        dc.page_numbers,
        1 - (dc.embedding <=> query_embedding) AS similarity
    FROM document_chunks dc
    ORDER BY dc.embedding <=> query_embedding
    LIMIT match_count;
END;
$$;
