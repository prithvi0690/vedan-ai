-- ============================================================
-- Neon PostgreSQL Setup for Vedan AI
-- Run this in the Neon SQL Editor (Dashboard > SQL Editor)
-- ============================================================

-- 1. Enable pgvector extension
CREATE EXTENSION IF NOT EXISTS vector;

-- 2. Create documents table
CREATE TABLE IF NOT EXISTS documents (
    id UUID PRIMARY KEY,
    notification_number TEXT,
    issue_date TEXT,
    effective_date TEXT,
    issuing_authority TEXT,
    ministry TEXT,
    department TEXT,
    tax_type TEXT,
    document_type TEXT,
    category TEXT,
    title TEXT,
    subject TEXT,
    total_pages INTEGER,
    status TEXT,
    metadata JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Create document_chunks table with vector column
CREATE TABLE IF NOT EXISTS document_chunks (
    id UUID PRIMARY KEY,
    document_id TEXT,
    chunk_index INTEGER,
    total_chunks INTEGER,
    section_number TEXT,
    content TEXT,
    embedding vector(768),
    tokens INTEGER,
    page_numbers INTEGER[],
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Create vector similarity search function
CREATE OR REPLACE FUNCTION match_documents(
    query_embedding vector(768),
    match_count int DEFAULT 10
)
RETURNS TABLE (
    id uuid,
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

-- 5. Create index for faster vector search (IVFFlat)
-- NOTE: Run this AFTER uploading data. IVFFlat needs existing rows to build.
-- CREATE INDEX ON document_chunks USING ivfflat (embedding vector_cosine_ops) WITH (lists = 50);
