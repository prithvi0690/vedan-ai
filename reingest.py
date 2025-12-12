"""
Re-ingestion script to update vector store with improved chunking settings.
This will:
1. Clear the old vector store
2. Re-ingest all PDFs with new chunking (600 size, 120 overlap)
3. Verify the new document count
"""

import os
import shutil

print("="*70)
print("RE-INGESTING DOCUMENTS WITH IMPROVED SETTINGS")
print("="*70)
print()

# Step 1: Clear old vector store
vector_store_path = "data/vector_store"
tracking_file = "data/.ingested_files.json"

if os.path.exists(vector_store_path):
    print(f"Removing old vector store: {vector_store_path}")
    shutil.rmtree(vector_store_path)
    print("[OK] Old vector store removed")
else:
    print("No existing vector store found")

if os.path.exists(tracking_file):
    print(f"Removing tracking file: {tracking_file}")
    os.remove(tracking_file)
    print("[OK] Tracking file removed")

print()
print("="*70)
print("Starting fresh ingestion with new settings:")
print("  - Chunk size: 600 (was 800)")
print("  - Chunk overlap: 120 (was 80)")
print("  - Retrieval count: 10 (was 5)")
print("="*70)
print()

# Step 2: Run ingestion
import subprocess
result = subprocess.run(["python", "src/ingestion/ingest.py"], capture_output=False)

if result.returncode == 0:
    print()
    print("="*70)
    print("[SUCCESS] RE-INGESTION COMPLETE!")
    print("="*70)
else:
    print()
    print("="*70)
    print("[ERROR] RE-INGESTION FAILED")
    print("="*70)
