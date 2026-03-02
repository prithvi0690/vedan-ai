"""
Reseed the Neon PostgreSQL database from the local full_backup.json file.

Usage:
    python scripts/reseed_database.py
"""

import os
import json
import psycopg2
from dotenv import load_dotenv
from tqdm import tqdm

load_dotenv("backend/.env")

DATABASE_URL = os.getenv("DATABASE_URL")
if not DATABASE_URL:
    print("Error: DATABASE_URL not set in backend/.env")
    exit(1)

BACKUP_FILE = "full_backup.json"


def reseed_database():
    if not os.path.exists(BACKUP_FILE):
        print(f"Error: {BACKUP_FILE} not found. Run fetch_all_chunks.py first.")
        exit(1)

    print(f"Loading backup from {BACKUP_FILE}...")
    with open(BACKUP_FILE, "r", encoding="utf-8") as f:
        chunks = json.load(f)

    total_chunks = len(chunks)
    print(f"Loaded {total_chunks} chunks.")

    print("\nWARNING: This process will re-upload data to 'document_chunks'.")
    truncated = input("Did you already TRUNCATE the table manually? (yes/no): ").lower()

    conn = psycopg2.connect(DATABASE_URL)
    cur = conn.cursor()

    if truncated == "yes":
        print("Skipping deletion step. Proceeding to upload...")
    else:
        print("Deleting existing data...")
        cur.execute("DELETE FROM document_chunks")
        conn.commit()
        print("Deletion complete. Starting re-upload...")

    # Re-upload in batches
    BATCH_SIZE = 100
    for i in tqdm(range(0, total_chunks, BATCH_SIZE), desc="Uploading Chunks"):
        batch = chunks[i : i + BATCH_SIZE]
        for chunk in batch:
            embedding = chunk.get("embedding")
            page_numbers = chunk.get("page_numbers", [])

            cur.execute(
                """INSERT INTO document_chunks
                   (id, document_id, chunk_index, total_chunks, section_number,
                    content, embedding, tokens, page_numbers, created_at)
                   VALUES (%s, %s, %s, %s, %s, %s, %s::vector, %s, %s, %s)""",
                (
                    chunk["id"],
                    chunk.get("document_id"),
                    chunk.get("chunk_index"),
                    chunk.get("total_chunks"),
                    chunk.get("section_number"),
                    chunk.get("content"),
                    str(embedding) if embedding else None,
                    chunk.get("tokens"),
                    page_numbers if page_numbers else [],
                    chunk.get("created_at"),
                ),
            )
        conn.commit()

    cur.close()
    conn.close()
    print("\nReseed Complete! Database should be clean and consistent now.")


if __name__ == "__main__":
    reseed_database()
