"""
Upload CSV backups to Neon PostgreSQL.

Usage:
    python scripts/upload_to_neon.py

Reads:
    - document_chunks_backup.csv
    - documents_backup.csv

Requires DATABASE_URL in backend/.env
"""

import os
import csv
import json
import ast
import psycopg2
from dotenv import load_dotenv
from tqdm import tqdm

load_dotenv("backend/.env")

DATABASE_URL = os.getenv("DATABASE_URL")
if not DATABASE_URL:
    print("Error: DATABASE_URL not set in backend/.env")
    exit(1)


def parse_pg_array(val: str) -> list:
    """Parse a PostgreSQL array literal like {1,2,3} or JSON [1,2,3] into a Python list."""
    if not val or val.strip() in ("", "{}", "[]"):
        return []
    val = val.strip()
    # Try JSON first (handles [1, 2, 3])
    try:
        parsed = json.loads(val)
        if isinstance(parsed, list):
            return [int(x) for x in parsed]
    except (json.JSONDecodeError, ValueError):
        pass
    # Fallback: PostgreSQL array format {1,2,3}
    val = val.strip("{}")
    if not val:
        return []
    return [int(x) for x in val.split(",")]


def parse_embedding(val: str) -> list:
    """Parse embedding string — could be JSON array or PostgreSQL vector literal."""
    if not val or val.strip() == "":
        return None
    val = val.strip()
    # Handle PostgreSQL vector format: [0.1,0.2,...] or JSON array
    try:
        return json.loads(val)
    except json.JSONDecodeError:
        pass
    # Try ast.literal_eval as fallback
    try:
        return ast.literal_eval(val)
    except (ValueError, SyntaxError):
        pass
    return None


def upload_documents(conn, csv_path: str):
    """Upload documents_backup.csv to the documents table."""
    if not os.path.exists(csv_path):
        print(f"Skipping {csv_path} (file not found)")
        return

    print(f"\n[DOCS] Uploading documents from {csv_path}...")

    with open(csv_path, "r", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        rows = list(reader)

    if not rows:
        print("  No rows found.")
        return

    cur = conn.cursor()

    # Clear existing data
    cur.execute("DELETE FROM documents")
    conn.commit()

    cols = [
        "id", "notification_number", "issue_date", "effective_date",
        "issuing_authority", "ministry", "department", "tax_type",
        "document_type", "category", "title", "subject", "total_pages",
        "status", "metadata", "created_at", "updated_at"
    ]

    inserted = 0
    for row in tqdm(rows, desc="  Documents"):
        values = []
        for col in cols:
            val = row.get(col, "")
            if col == "total_pages":
                values.append(int(val) if val else None)
            elif col == "metadata":
                if val and val.strip():
                    try:
                        values.append(json.dumps(json.loads(val)))
                    except json.JSONDecodeError:
                        values.append(None)
                else:
                    values.append(None)
            elif val == "":
                values.append(None)
            else:
                values.append(val)

        placeholders = ", ".join(["%s"] * len(cols))
        col_names = ", ".join(cols)
        cur.execute(
            f"INSERT INTO documents ({col_names}) VALUES ({placeholders})",
            values
        )
        inserted += 1

    conn.commit()
    cur.close()
    print(f"  OK - Inserted {inserted} documents")


def upload_chunks(conn, csv_path: str):
    """Upload document_chunks_backup.csv to the document_chunks table."""
    if not os.path.exists(csv_path):
        print(f"Error: {csv_path} not found!")
        exit(1)

    print(f"\n[CHUNKS] Uploading chunks from {csv_path}...")

    with open(csv_path, "r", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        rows = list(reader)

    if not rows:
        print("  No rows found.")
        return

    cur = conn.cursor()

    # Clear existing data
    cur.execute("DELETE FROM document_chunks")
    conn.commit()

    BATCH_SIZE = 100
    inserted = 0
    skipped = 0

    for i in tqdm(range(0, len(rows), BATCH_SIZE), desc="  Chunks"):
        batch = rows[i : i + BATCH_SIZE]

        for row in batch:
            embedding = parse_embedding(row.get("embedding", ""))
            page_numbers = parse_pg_array(row.get("page_numbers", ""))

            chunk_index = int(row["chunk_index"]) if row.get("chunk_index") else None
            total_chunks = int(row["total_chunks"]) if row.get("total_chunks") else None
            tokens = int(row["tokens"]) if row.get("tokens") else None

            if embedding is None:
                skipped += 1
                continue

            cur.execute(
                """INSERT INTO document_chunks
                   (id, document_id, chunk_index, total_chunks, section_number,
                    content, embedding, tokens, page_numbers, created_at)
                   VALUES (%s, %s, %s, %s, %s, %s, %s::vector, %s, %s, %s)""",
                (
                    row["id"],
                    row.get("document_id"),
                    chunk_index,
                    total_chunks,
                    row.get("section_number"),
                    row.get("content"),
                    str(embedding),
                    tokens,
                    page_numbers,
                    row.get("created_at"),
                ),
            )
            inserted += 1

        conn.commit()

    cur.close()
    print(f"  OK - Inserted {inserted} chunks ({skipped} skipped - no embedding)")


def verify(conn):
    """Print row counts for verification."""
    cur = conn.cursor()
    cur.execute("SELECT COUNT(*) FROM documents")
    doc_count = cur.fetchone()[0]
    cur.execute("SELECT COUNT(*) FROM document_chunks")
    chunk_count = cur.fetchone()[0]
    cur.close()

    print(f"\n[VERIFY] Verification:")
    print(f"   documents:       {doc_count} rows")
    print(f"   document_chunks: {chunk_count} rows")


def main():
    print("Connecting to Neon PostgreSQL...")
    conn = psycopg2.connect(DATABASE_URL)
    print("Connected!\n")

    upload_documents(conn, "documents_backup.csv")
    upload_chunks(conn, "document_chunks_backup.csv")
    verify(conn)

    conn.close()
    print("\nUpload complete!")


if __name__ == "__main__":
    main()
