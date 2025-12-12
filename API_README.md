# Vedan AI - FastAPI Backend

## Quick Start

### 1. Start the API Server

```bash
python src/api/main.py
```

Or using uvicorn directly:

```bash
uvicorn src.api.main:app --reload --host 0.0.0.0 --port 8000
```

The API will be available at: `http://localhost:8000`

### 2. Access Interactive Documentation

Open your browser and visit:
- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

## API Endpoints

### `GET /`
Root endpoint - returns API status

### `GET /health`
Health check endpoint

**Response:**
```json
{
  "status": "healthy",
  "message": "RAG system is operational"
}
```

### `GET /stats`
Get database statistics

**Response:**
```json
{
  "total_documents": 1456,
  "vector_store_path": "data/vector_store"
}
```

### `POST /query`
Query the RAG system with a question

**Request:**
```json
{
  "question": "What is CGST?",
  "k": 10
}
```

**Response:**
```json
{
  "question": "What is CGST?",
  "answer": "CGST stands for Central Goods and Services Tax...",
  "sources": [
    {
      "source": "data/raw/cgst-act_2017.pdf",
      "page": 5,
      "content": "The Central Goods and Services Tax Act..."
    }
  ]
}
```

## Testing with cURL

### Health Check
```bash
curl http://localhost:8000/health
```

### Get Statistics
```bash
curl http://localhost:8000/stats
```

### Query the System
```bash
curl -X POST http://localhost:8000/query \
  -H "Content-Type: application/json" \
  -d "{\"question\": \"What is CGST?\"}"
```

## Testing with Python

```python
import requests

# Query the API
response = requests.post(
    "http://localhost:8000/query",
    json={"question": "What is CGST?", "k": 10}
)

result = response.json()
print("Answer:", result["answer"])
print("\nSources:")
for i, source in enumerate(result["sources"], 1):
    print(f"{i}. {source['source']} (Page {source['page']})")
```

## Features

- ✅ RESTful API with JSON responses
- ✅ Automatic API documentation (Swagger/ReDoc)
- ✅ CORS enabled for web integration
- ✅ Health checks and statistics
- ✅ Citations with source file and page numbers
- ✅ Configurable retrieval count (k parameter)
