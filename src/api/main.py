from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from pydantic import BaseModel
from typing import List, Optional
import os
from dotenv import load_dotenv
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_community.vectorstores import Chroma
import google.generativeai as genai

load_dotenv()

# Initialize FastAPI app
app = FastAPI(
    title="Vedan AI - CGST Question Answering API",
    description="RAG-based API for answering questions about CGST documents",
    version="1.0.0"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configuration
CHROMA_PATH = "data/vector_store"

# Global RAG engine (initialized on startup)
rag_engine = None

class QueryRequest(BaseModel):
    question: str
    k: Optional[int] = 10  # Number of chunks to retrieve

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
    vector_store_path: str

class SimpleRAGEngine:
    def __init__(self):
        print("Initializing RAG engine...")
        self.embeddings = HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")
        self.db = Chroma(persist_directory=CHROMA_PATH, embedding_function=self.embeddings)
        
        api_key = os.getenv("GEMINI_API_KEY")
        if not api_key:
            raise ValueError("GEMINI_API_KEY not found in .env file")
        
        genai.configure(api_key=api_key)
        self.model = genai.GenerativeModel('gemini-2.5-flash')
        print("RAG engine initialized successfully!")
    
    def query(self, question: str, k: int = 10):
        """Query the RAG system."""
        docs = self.db.similarity_search(question, k=k)
        
        if not docs:
            return {
                "answer": "I couldn't find any relevant information in the documents.",
                "sources": []
            }
        
        # Build context with citations
        context_parts = []
        for i, doc in enumerate(docs, 1):
            source = doc.metadata.get("source", "Unknown")
            page = doc.metadata.get("page", "Unknown")
            context_parts.append(
                f"[Document {i} - Source: {source}, Page: {page}]\n{doc.page_content}\n"
            )
        
        context = "\n".join(context_parts)
        
        # Create prompt
        prompt = f"""You are a helpful assistant answering questions about CGST documents.

Use the context below to answer the question. Always cite sources using [Source: filename, Page: X] format.

Context:
{context}

Question: {question}

Answer with citations:"""
        
        # Get answer from Gemini
        response = self.model.generate_content(prompt)
        answer = response.text
        
        # Format sources
        sources = []
        for doc in docs:
            sources.append({
                "content": doc.page_content[:200] + "..." if len(doc.page_content) > 200 else doc.page_content,
                "source": doc.metadata.get("source", "Unknown"),
                "page": doc.metadata.get("page", "Unknown"),
            })
        
        return {"answer": answer, "sources": sources}
    
    def get_stats(self):
        """Get database statistics."""
        return {
            "total_documents": self.db._collection.count(),
            "vector_store_path": CHROMA_PATH
        }

@app.on_event("startup")
async def startup_event():
    """Initialize RAG engine on startup."""
    global rag_engine
    try:
        rag_engine = SimpleRAGEngine()
        print("API ready to serve requests!")
    except Exception as e:
        print(f"Error initializing RAG engine: {e}")
        raise

@app.get("/")
async def root():
    """Serve the web UI."""
    return FileResponse("static/index.html")

# Mount static files
app.mount("/static", StaticFiles(directory="static"), name="static")

@app.get("/health", response_model=HealthResponse)
async def health_check():
    """Health check endpoint."""
    if rag_engine is None:
        raise HTTPException(status_code=503, detail="RAG engine not initialized")
    return {
        "status": "healthy",
        "message": "RAG system is operational"
    }

@app.get("/stats", response_model=StatsResponse)
async def get_stats():
    """Get database statistics."""
    if rag_engine is None:
        raise HTTPException(status_code=503, detail="RAG engine not initialized")
    
    try:
        stats = rag_engine.get_stats()
        return stats
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error getting stats: {str(e)}")

@app.post("/query", response_model=QueryResponse)
async def query(request: QueryRequest):
    """Query the RAG system with a question."""
    if rag_engine is None:
        raise HTTPException(status_code=503, detail="RAG engine not initialized")
    
    if not request.question or not request.question.strip():
        raise HTTPException(status_code=400, detail="Question cannot be empty")
    
    try:
        result = rag_engine.query(request.question, k=request.k)
        return {
            "question": request.question,
            "answer": result["answer"],
            "sources": result["sources"]
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing query: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)
