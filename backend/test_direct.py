"""Direct test of the RAG engine — no FastAPI, no buffering issues."""
import sys, os, traceback
sys.path.insert(0, os.path.join(os.path.dirname(__file__)))

from dotenv import load_dotenv
load_dotenv()

print("=" * 60, flush=True)
print("STEP 1: Importing NeonRAGEngine...", flush=True)
try:
    from src.rag.neon_query_engine import NeonRAGEngine
    print("  OK", flush=True)
except Exception:
    traceback.print_exc()
    sys.exit(1)

print("=" * 60, flush=True)
print("STEP 2: Creating engine instance...", flush=True)
try:
    engine = NeonRAGEngine()
    print("  OK", flush=True)
except Exception:
    traceback.print_exc()
    sys.exit(1)

print("=" * 60, flush=True)
print("STEP 3: Testing _search('What is GST?')...", flush=True)
try:
    docs = engine._search("What is GST?", k=3)
    print(f"  OK — Got {len(docs)} docs", flush=True)
    if docs:
        print(f"  First doc keys: {list(docs[0].keys())}", flush=True)
        print(f"  First doc content[:100]: {docs[0].get('content', '')[:100]}", flush=True)
except Exception:
    traceback.print_exc()
    sys.exit(1)

print("=" * 60, flush=True)
print("STEP 4: Testing full query('What is GST?')...", flush=True)
try:
    result = engine.query("What is GST?", k=3)
    print(f"  OK — Answer length: {len(result['answer'])}", flush=True)
    print(f"  Sources: {len(result['sources'])}", flush=True)
    print(f"  Answer preview: {result['answer'][:200]}", flush=True)
except Exception:
    traceback.print_exc()
    sys.exit(1)

print("=" * 60, flush=True)
print("ALL STEPS PASSED!", flush=True)
