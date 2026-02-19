"""
Re-embed all document_chunks in Supabase using Gemini Embedding API.

Usage:
    python re_embed_gemini.py

Features:
    - Uses gemini-embedding-001 with 768 dimensions
    - Batches of 100 for API calls
    - Checkpoint file to resume on crash
    - Saves embeddings locally to embedded_chunks_gemini.json
    - Updates Supabase directly
"""

import os
import json
import time
import requests
from dotenv import load_dotenv
from google import genai
from tqdm import tqdm

load_dotenv(os.path.join(os.path.dirname(__file__), "..", "backend", ".env"), override=True)

# ── Config ──────────────────────────────────────────────────────
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")
GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")

EMBED_MODEL = "gemini-embedding-001"
EMBED_DIM = 768
BATCH_SIZE = 20
CHECKPOINT_FILE = "reembed_checkpoint.json"
LOCAL_EMBEDDINGS_FILE = "embedded_chunks_gemini.json"

HEADERS = {
    "apikey": SUPABASE_KEY,
    "Authorization": f"Bearer {SUPABASE_KEY}",
    "Content-Type": "application/json",
    "Prefer": "return=minimal",
}

# ── Helpers ──────────────────────────────────────────────────────

def fetch_all_chunks():
    """Fetch all chunk IDs, content and metadata from Supabase (paginated)."""
    all_chunks = []
    offset = 0
    page_size = 1000

    while True:
        url = (
            f"{SUPABASE_URL}/rest/v1/document_chunks"
            f"?select=id,content,document_id,section_number,page_numbers"
            f"&order=id.asc"
            f"&offset={offset}&limit={page_size}"
        )
        resp = requests.get(url, headers=HEADERS, timeout=30)
        if resp.status_code != 200:
            raise RuntimeError(f"Supabase fetch error {resp.status_code}: {resp.text[:300]}")

        page = resp.json()
        if not page:
            break
        all_chunks.extend(page)
        offset += page_size
        print(f"  Fetched {len(all_chunks)} chunks so far...")

    return all_chunks


def load_checkpoint():
    """Load checkpoint of already-processed IDs."""
    if os.path.exists(CHECKPOINT_FILE):
        with open(CHECKPOINT_FILE, "r") as f:
            data = json.load(f)
        print(f"  Resuming from checkpoint: {len(data['processed_ids'])} already done.")
        return set(data["processed_ids"])
    return set()


def save_checkpoint(processed_ids):
    """Save checkpoint to disk."""
    with open(CHECKPOINT_FILE, "w") as f:
        json.dump({"processed_ids": list(processed_ids)}, f)


def load_local_embeddings():
    """Load existing local embeddings file."""
    if os.path.exists(LOCAL_EMBEDDINGS_FILE):
        with open(LOCAL_EMBEDDINGS_FILE, "r", encoding="utf-8") as f:
            return json.load(f)
    return []


def save_local_embeddings(data):
    """Save embeddings to local JSON file."""
    with open(LOCAL_EMBEDDINGS_FILE, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2, ensure_ascii=False)


def embed_texts(client, texts, max_retries=5):
    """Embed a batch of texts using Gemini embedding API with 768 dimensions."""
    for attempt in range(max_retries):
        try:
            result = client.models.embed_content(
                model=EMBED_MODEL,
                contents=texts,
                config={
                    "output_dimensionality": EMBED_DIM,
                },
            )
            return [e.values for e in result.embeddings]
        except Exception as e:
            error_str = str(e)
            if "429" in error_str or "RESOURCE_EXHAUSTED" in error_str:
                if "PerDay" in error_str:
                    print(f"\n  [WARNING] Daily quota reached! Progress has been saved.")
                    print(f"  Run this script again later to resume.")
                    return None
                # Per-minute rate limit — wait and retry
                wait_time = 30 * (attempt + 1)
                print(f"\n  Rate limited. Waiting {wait_time}s before retry {attempt+1}/{max_retries}...")
                time.sleep(wait_time)
                continue
            print(f"\n  Embedding API error: {e}")
            if attempt < max_retries - 1:
                print(f"  Retrying in 15 seconds...")
                time.sleep(15)
                continue
            raise
    print(f"\n  [WARNING] Max retries reached. Progress has been saved.")
    return None


def update_embedding(chunk_id, embedding):
    """Update a single row's embedding in Supabase."""
    url = f"{SUPABASE_URL}/rest/v1/document_chunks?id=eq.{chunk_id}"
    payload = {"embedding": embedding}
    resp = requests.patch(url, json=payload, headers=HEADERS, timeout=30)
    if resp.status_code not in (200, 204):
        raise RuntimeError(f"Supabase update error for id={chunk_id}: {resp.status_code} {resp.text[:200]}")


# ── Main ────────────────────────────────────────────────────────

def main():
    print("=" * 60)
    print("Gemini Re-Embedding Script")
    print(f"Model: {EMBED_MODEL} | Dimensions: {EMBED_DIM} | Batch: {BATCH_SIZE}")
    print("=" * 60)

    # Validate env
    if not all([SUPABASE_URL, SUPABASE_KEY, GOOGLE_API_KEY]):
        print("ERROR: Missing environment variables. Check .env file.")
        return

    # Init Gemini client
    client = genai.Client(api_key=GOOGLE_API_KEY)

    # Fetch all chunks
    print("\n[1/4] Fetching all chunks from Supabase...")
    chunks = fetch_all_chunks()
    print(f"  Total chunks: {len(chunks)}")

    # Load checkpoint
    print("\n[2/4] Checking for existing checkpoint...")
    processed_ids = load_checkpoint()

    # Load local embeddings file
    print("\n[3/4] Loading local embeddings file...")
    local_embeddings = load_local_embeddings()
    local_ids = {item["id"] for item in local_embeddings}
    print(f"  Local file has {len(local_embeddings)} entries.")

    # Filter out already-processed chunks
    remaining = [c for c in chunks if c["id"] not in processed_ids]
    print(f"  Remaining to process: {len(remaining)}")

    if not remaining:
        print("\n  All chunks already processed! Nothing to do.")
        return

    # Process in batches
    print(f"\n[4/4] Re-embedding {len(remaining)} chunks...")
    total_batches = (len(remaining) + BATCH_SIZE - 1) // BATCH_SIZE

    for batch_idx in tqdm(range(0, len(remaining), BATCH_SIZE), total=total_batches, desc="Batches"):
        batch = remaining[batch_idx : batch_idx + BATCH_SIZE]
        texts = [c["content"] for c in batch]

        # Get embeddings from Gemini
        embeddings = embed_texts(client, texts)

        # If rate-limited, save and exit
        if embeddings is None:
            save_checkpoint(processed_ids)
            save_local_embeddings(local_embeddings)
            print(f"\n  Progress saved: {len(processed_ids)}/{len(chunks)} chunks done.")
            print(f"  Remaining: {len(chunks) - len(processed_ids)} chunks.")
            print(f"  Local file: {LOCAL_EMBEDDINGS_FILE} ({len(local_embeddings)} entries)")
            return

        # Update each row in Supabase + save locally
        for chunk, emb in zip(batch, embeddings):
            update_embedding(chunk["id"], emb)
            processed_ids.add(chunk["id"])

            # Add to local file (with metadata)
            if chunk["id"] not in local_ids:
                local_embeddings.append({
                    "id": chunk["id"],
                    "content": chunk["content"],
                    "document_id": chunk.get("document_id", ""),
                    "section_number": chunk.get("section_number", ""),
                    "page_numbers": chunk.get("page_numbers", []),
                    "embedding": emb,
                })
                local_ids.add(chunk["id"])

        # Save checkpoint + local file after every batch
        save_checkpoint(processed_ids)
        save_local_embeddings(local_embeddings)

        # Small delay to avoid rate limits
        time.sleep(5)

    print("\n" + "=" * 60)
    print(f"Done! Re-embedded {len(processed_ids)} chunks with {EMBED_MODEL}.")
    print(f"Dimensions: {EMBED_DIM}")
    print(f"Local file: {LOCAL_EMBEDDINGS_FILE} ({len(local_embeddings)} entries)")
    print("=" * 60)


if __name__ == "__main__":
    main()
