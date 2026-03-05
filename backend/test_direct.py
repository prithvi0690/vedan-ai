"""Direct test of the RAG engine — no FastAPI, no buffering issues."""
import sys, os
sys.path.insert(0, os.path.join(os.path.dirname(__file__)))

from dotenv import load_dotenv
load_dotenv()

print("=" * 60, flush=True)
print("STEP 1: Importing NeonRAGEngine...", flush=True)
from src.rag.neon_query_engine import NeonRAGEngine
print("  OK", flush=True)

print("=" * 60, flush=True)
print("STEP 2: Creating engine instance...", flush=True)
engine = NeonRAGEngine()
print("  OK", flush=True)

print("=" * 60, flush=True)
print("STEP 3: Testing _search('What is GST?')...", flush=True)
docs = engine._search("What is GST?", k=3)
print(f"  OK — Got {len(docs)} docs", flush=True)
if docs:
    print(f"  First doc keys: {list(docs[0].keys())}", flush=True)
    print(f"  First doc content[:100]: {docs[0].get('content', '')[:100]}", flush=True)

print("=" * 60, flush=True)
print("STEP 4: Testing full query('What is GST?')...", flush=True)
result = engine.query("What is GST?", k=3)
print(f"  OK — Answer length: {len(result['answer'])}", flush=True)
print(f"  Sources: {len(result['sources'])}", flush=True)
print(f"  Answer preview: {result['answer'][:200]}", flush=True)

print("=" * 60, flush=True)
print("ALL STEPS PASSED!", flush=True)
