-- RUN THIS IN SUPABASE SQL EDITOR

-- 1. Force Refresh Schema Cache (Crucial if you just ran the fix)
NOTIFY pgrst, 'reload';

-- 2. Check what functions actually exist now
-- We expect EXACTLY ONE row with arguments: "query_embedding vector, match_count integer DEFAULT 10"
SELECT 
    n.nspname as schema,
    p.proname as name,
    pg_catalog.pg_get_function_arguments(p.oid) as arguments
FROM pg_proc p
LEFT JOIN pg_namespace n ON n.oid = p.pronamespace
WHERE p.proname = 'match_documents';
