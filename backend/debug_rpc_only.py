import os
import requests
import json
from dotenv import load_dotenv

load_dotenv()

print("Starting RPC test...", flush=True)

url = os.getenv("SUPABASE_URL")
key = os.getenv("SUPABASE_KEY")

if not url or not key:
    print("Error: Missing env vars")
    exit(1)

headers = {
    "apikey": key,
    "Authorization": f"Bearer {key}",
    "Content-Type": "application/json",
}

print(f"Connecting to: {url}", flush=True)

# 768-dim vector of zeros
dummy_embedding = [0.0] * 768

payload = {
    "query_embedding": dummy_embedding,
    "match_count": 1,
}

try:
    response = requests.post(
        f"{url}/rest/v1/rpc/match_documents",
        json=payload,
        headers=headers,
        timeout=10,
    )
    print(f"Status: {response.status_code}")
    print(f"Body: {response.text}")
except Exception as e:
    print(f"Request failed: {e}")
