import sys
import os
import requests
import traceback
from dotenv import load_dotenv

# Ensure we can import from src
sys.path.insert(0, os.getcwd()) 
load_dotenv()

from src.rag.supabase_query_engine import SupabaseRAGEngine

print("Starting debug script...", flush=True)

try:
    # 1. Test Supabase Connection & RPC directly first (bypass RAG Engine class to isolate RPC)
    print("\n--- Testing RPC 'match_documents' directly ---", flush=True)
    url = os.getenv("SUPABASE_URL")
    key = os.getenv("SUPABASE_KEY")
    headers = {
        "apikey": key,
        "Authorization": f"Bearer {key}",
        "Content-Type": "application/json",
    }
    
    # Create a dummy 768-dim vector (all zeros)
    dummy_embedding = [0.0] * 768
    
    payload = {
        "query_embedding": dummy_embedding,
        "match_count": 1,
    }
    
    print(f"Target URL: {url}/rest/v1/rpc/match_documents", flush=True)
    response = requests.post(
        f"{url}/rest/v1/rpc/match_documents",
        json=payload,
        headers=headers,
        timeout=30,
    )
    
    print(f"RPC Status Code: {response.status_code}", flush=True)
    if response.status_code != 200:
        print(f"RPC Error Body: {response.text}", flush=True)
    else:
        print("RPC Success! Response:", response.json())

    # 2. Test Full RAG Engine
    print("\n--- Testing Full RAG Engine ---", flush=True)
    engine = SupabaseRAGEngine()
    result = engine.query("test")
    print("RAG Engine Success!")

except Exception:
    traceback.print_exc()
