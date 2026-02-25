-- FIX FOR 500 ERROR (Ambiguous Function)
-- Run this in the Supabase Dashboard > SQL Editor

-- 1. Drop ALL versions of match_documents to clear ambiguity
DROP FUNCTION IF EXISTS match_documents(vector(384), int);
DROP FUNCTION IF EXISTS match_documents(vector(384), int, jsonb);
DROP FUNCTION IF EXISTS match_documents(vector(768), int);
DROP FUNCTION IF EXISTS match_documents(vector(768), int, jsonb);
DROP FUNCTION IF EXISTS match_documents(vector, int);
DROP FUNCTION IF EXISTS match_documents(vector, int, jsonb);

-- 2. Recreate the correct function for 768 dimensions
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
