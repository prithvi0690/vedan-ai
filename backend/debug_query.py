import sys
import os
# Ensure we can import from src
sys.path.insert(0, os.getcwd()) 

from dotenv import load_dotenv
load_dotenv()

from src.rag.neon_query_engine import NeonRAGEngine

print("Starting debug script...", flush=True)
try:
    print("Initializing Engine...", flush=True)
    engine = NeonRAGEngine()
    print("Engine initialized. Running query...", flush=True)
    result = engine.query("What is GST?")
    print("Query success!")
    print(result)
except Exception as e:
    print("\nERROR OCCURRED:", flush=True)
    import traceback
    traceback.print_exc()
