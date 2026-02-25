from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import os, sys, traceback
from dotenv import load_dotenv

# Ensure the project root is on sys.path so we can import src.rag.*
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))

load_dotenv()

# ──────────────────────────────────────────────────────────────
# FastAPI app
# ──────────────────────────────────────────────────────────────
app = FastAPI(
    title="Vedan AI - Tax & Policy Assistant API",
    description="RAG-based API for answering questions about Indian tax law (CGST/GST)",
    version="2.0.0",
)

# CORS – allow all origins for MVP
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ──────────────────────────────────────────────────────────────
# Pydantic models
# ──────────────────────────────────────────────────────────────
class QueryRequest(BaseModel):
    question: str
    k: Optional[int] = 10


class Source(BaseModel):
    source: str
    page: int
    content: str


class QueryResponse(BaseModel):
    question: str
    answer: str
    sources: List[Source]


class HealthResponse(BaseModel):
    status: str
    message: str


class StatsResponse(BaseModel):
    total_documents: int
    database: str


# ──────────────────────────────────────────────────────────────
# RAG engine (lazy-loaded on first request to avoid Render port timeout)
# ──────────────────────────────────────────────────────────────
rag_engine = None


def get_engine():
    """Lazy-load the RAG engine on first request.
    
    The import is deferred here because sentence-transformers / PyTorch
    take minutes to import on Render's free tier, which would block
    uvicorn from opening the port in time.
    """
    global rag_engine
    if rag_engine is None:
        print("First request — importing heavy libraries...", flush=True)
        from src.rag.supabase_query_engine import SupabaseRAGEngine
        print("Initializing RAG engine...", flush=True)
        rag_engine = SupabaseRAGEngine()
        print("RAG engine ready!", flush=True)
    return rag_engine


# ──────────────────────────────────────────────────────────────
# Endpoints
# ──────────────────────────────────────────────────────────────
@app.get("/", tags=["Root"])
async def root():
    return {"message": "Vedan AI API is running. Use /query to ask questions."}


@app.get("/health", response_model=HealthResponse, tags=["Health"])
async def health_check():
    try:
        get_engine()
        return {"status": "healthy", "message": "RAG system is operational"}
    except Exception as e:
        raise HTTPException(status_code=503, detail=f"RAG engine not ready: {str(e)}")


@app.get("/stats", response_model=StatsResponse, tags=["Stats"])
async def get_stats():
    try:
        engine = get_engine()
        return engine.get_stats()
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error getting stats: {str(e)}")


@app.post("/query", response_model=QueryResponse, tags=["Query"])
async def query(request: QueryRequest):
    if not request.question or not request.question.strip():
        raise HTTPException(status_code=400, detail="Question cannot be empty")

    # Step 1: Get engine
    try:
        print(f"[QUERY] Step 1: Getting engine...", flush=True)
        engine = get_engine()
        print(f"[QUERY] Step 1: OK", flush=True)
    except Exception as e:
        print(f"[QUERY] Step 1 FAILED — engine init error:", flush=True)
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Engine init failed: {str(e)}")

    # Step 2: Search (embedding + Supabase RPC)
    try:
        print(f"[QUERY] Step 2: Searching for '{request.question[:50]}'...", flush=True)
        docs = engine._search(request.question, k=request.k)
        print(f"[QUERY] Step 2: OK — {len(docs)} docs found", flush=True)
    except Exception as e:
        print(f"[QUERY] Step 2 FAILED — search error:", flush=True)
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Search failed: {str(e)}")

    # Step 3: Generate answer with Gemini
    try:
        print(f"[QUERY] Step 3: Generating answer...", flush=True)
        result = engine.query(request.question, k=request.k)
        print(f"[QUERY] Step 3: OK — answer length={len(result['answer'])}", flush=True)
    except Exception as e:
        print(f"[QUERY] Step 3 FAILED — generation error:", flush=True)
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Generation failed: {str(e)}")

    # Step 4: Build response
    try:
        print(f"[QUERY] Step 4: Building response...", flush=True)
        resp = {
            "question": request.question,
            "answer": result["answer"],
            "sources": result["sources"],
        }
        print(f"[QUERY] Step 4: OK — returning response", flush=True)
        return resp
    except Exception as e:
        print(f"[QUERY] Step 4 FAILED — response build error:", flush=True)
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Response build failed: {str(e)}")


# ──────────────────────────────────────────────────────────────
# Debug endpoints – REMOVE after fixing the 500 error
# ──────────────────────────────────────────────────────────────
@app.get("/debug-models", tags=["Debug"])
async def debug_models():
    """List available Gemini models for the configured API key."""
    try:
        from google import genai
        api_key = os.getenv("GOOGLE_API_KEY")
        if not api_key:
            return {"error": "GOOGLE_API_KEY not set"}
        client = genai.Client(api_key=api_key)
        models = client.models.list()
        model_names = [m.name for m in models]
        return {"models": model_names, "count": len(model_names)}
    except Exception as e:
        traceback.print_exc()
        return {"error": str(e)}


@app.get("/debug-search", tags=["Debug"])
async def debug_search():
    """Test just the search (embedding + RPC) without generation."""
    try:
        engine = get_engine()
        docs = engine._search("What is GST?", k=2)
        return {
            "status": "ok",
            "doc_count": len(docs),
            "docs": docs,
        }
    except Exception as e:
        traceback.print_exc()
        return {"status": "error", "error": str(e)}


@app.get("/debug-env", tags=["Debug"])
async def debug_env():
    """Check which env vars are set (without revealing values)."""
    return {
        "SUPABASE_URL": "SET" if os.getenv("SUPABASE_URL") else "MISSING",
        "SUPABASE_KEY": "SET" if os.getenv("SUPABASE_KEY") else "MISSING",
        "GOOGLE_API_KEY": "SET" if os.getenv("GOOGLE_API_KEY") else "MISSING",
    }


# ──────────────────────────────────────────────────────────────
# Run with: python src/api/main.py
# ──────────────────────────────────────────────────────────────
if __name__ == "__main__":
    import uvicorn

    port = int(os.getenv("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)
