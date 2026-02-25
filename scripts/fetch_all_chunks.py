import os
import json
import time
from dotenv import load_dotenv
from supabase import create_client, Client

load_dotenv("backend/.env")

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

if not SUPABASE_URL or not SUPABASE_KEY:
    print("Error: SUPABASE_URL or SUPABASE_KEY not set.")
    exit(1)

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

def fetch_all_chunks():
    print("Fetching all chunks from Supabase to ensure we have a full backup...")
    
    all_chunks = []
    offset = 0
    limit = 1000
    
    while True:
        print(f"Fetching offset {offset}...")
        response = supabase.table("document_chunks")\
            .select("*")\
            .range(offset, offset + limit - 1)\
            .execute()
        
        data = response.data
        if not data:
            break
            
        all_chunks.extend(data)
        print(f"Fetched {len(data)} rows. Total so far: {len(all_chunks)}")
        
        if len(data) < limit:
            break
            
        offset += limit
        time.sleep(0.5) # Be nice to the API

    print(f"Finished! Total chunks fetched: {len(all_chunks)}")
    
    output_file = "full_backup.json"
    with open(output_file, "w", encoding="utf-8") as f:
        json.dump(all_chunks, f, ensure_ascii=False, indent=2)
    
    print(f"Saved to {output_file}")

if __name__ == "__main__":
    fetch_all_chunks()
