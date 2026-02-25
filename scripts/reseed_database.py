import os
import json
import time
from dotenv import load_dotenv
from supabase import create_client, Client
from tqdm import tqdm

load_dotenv("backend/.env")

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

if not SUPABASE_URL or not SUPABASE_KEY:
    print("Error: SUPABASE_URL or SUPABASE_KEY not set.")
    exit(1)

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)
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

    # Confirmation
    print("\nWARNING: This process will re-upload data to 'document_chunks'.")
    truncated = input("Did you already TRUNCATE the table manually? (yes/no): ").lower()

    if truncated == "yes":
        print("Skipping deletion step. Proceeding to upload...")
    else:
        print("Attempting to delete existing data (this might fail if too many rows)...")
        # Deleting in batches of IDs to be safe
        ids_to_delete = [c['id'] for c in chunks]
        
        # Limit delete batch size - reduce to 200 to avoid URL length limits
        DELETE_BATCH_SIZE = 200
        for i in range(0, len(ids_to_delete), DELETE_BATCH_SIZE):
            batch_ids = ids_to_delete[i:i + DELETE_BATCH_SIZE]
            print(f"Deleting batch {i}-{i+len(batch_ids)}...")
            try:
                supabase.table("document_chunks").delete().in_("id", batch_ids).execute()
            except Exception as e:
                print(f"Delete failed: {e}. continuing...")
        
        print("Deletion/Check complete. Starting re-upload...")

    # 2. Re-upload
    BATCH_SIZE = 100
    for i in tqdm(range(0, total_chunks, BATCH_SIZE), desc="Uploading Chunks"):
        batch = chunks[i:i + BATCH_SIZE]
        try:
            supabase.table("document_chunks").insert(batch).execute()
            time.sleep(0.1) 
        except Exception as e:
            print(f"\nError uploading batch {i}: {e}")
            # Try continue? or stop?
            # Stop is safer
            exit(1)

    print("\nReseed Complete! Database should be clean and consistent now.")

if __name__ == "__main__":
    reseed_database()
