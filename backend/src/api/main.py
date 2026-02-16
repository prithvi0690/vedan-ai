from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import os, sys
from dotenv import load_dotenv

# Ensure the project root is on sys.path so we can import src.rag.*
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))

from src.rag.supabase_query_engine import SupabaseRAGEngine

load_dotenv()

# ──────────────────────────────────────────────────────────────
# FastAPI app
# ──────────────────────────────────────────────────────────────
app = FastAPI(
    title="Vedan AI - Tax & Policy Assistant API",
    description="RAG-based API for answering questions about Indian tax law (CGST/GST)",
    version="2.0.0",
)

# CORS – allow the Vercel frontend (and localhost for dev)
FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:5173")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        FRONTEND_URL,
        "http://localhost:5173",
        "http://localhost:3000",
    ],
    allow_credentials=True,
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
# RAG engine (initialised on startup)
# ──────────────────────────────────────────────────────────────
rag_engine: Optional[SupabaseRAGEngine] = None


def get_engine() -> SupabaseRAGEngine:
    """Lazy-load the RAG engine on first request (avoids Render port timeout)."""
    global rag_engine
    if rag_engine is None:
        print("First request — initializing RAG engine...", flush=True)
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

    try:
        engine = get_engine()
        result = engine.query(request.question, k=request.k)
        return {
            "question": request.question,
            "answer": result["answer"],
            "sources": result["sources"],
        }
    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Error processing query: {str(e)}"
        )


# ──────────────────────────────────────────────────────────────
# Run with: python src/api/main.py
# ──────────────────────────────────────────────────────────────
if __name__ == "__main__":
    import uvicorn

    port = int(os.getenv("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)
