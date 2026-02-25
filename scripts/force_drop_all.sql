-- FORCE DROP ALL match_documents functions
-- Run this in Supabase SQL Editor

DO $$
DECLARE
    r RECORD;
BEGIN
    FOR r IN 
        SELECT ns.nspname, p.proname, pg_get_function_identity_arguments(p.oid) as args
        FROM pg_proc p
        JOIN pg_namespace ns ON p.pronamespace = ns.oid
        WHERE p.proname = 'match_documents' AND ns.nspname = 'public'
    LOOP
        EXECUTE 'DROP FUNCTION public.match_documents(' || r.args || ');';
        RAISE NOTICE 'Dropped function: match_documents(%)', r.args;
    END LOOP;
END $$;

-- Verify they are gone (should verify 0 rows)
SELECT count(*) as remaining_functions
FROM pg_proc p
JOIN pg_namespace ns ON p.pronamespace = ns.oid
WHERE p.proname = 'match_documents' AND ns.nspname = 'public';

-- Now Recreate ONLY the correct one
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
