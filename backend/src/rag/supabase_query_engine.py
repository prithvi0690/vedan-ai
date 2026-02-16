import os
import requests
from dotenv import load_dotenv
from sentence_transformers import SentenceTransformer
from google import genai

load_dotenv()


class SupabaseRAGEngine:
    """RAG engine using Supabase pgvector for retrieval and Gemini for generation."""

    def __init__(self):
        print("Initializing Supabase RAG engine...", flush=True)

        # --- Supabase connection ---
        self.supabase_url = os.getenv("SUPABASE_URL")
        self.supabase_key = os.getenv("SUPABASE_KEY")
        if not self.supabase_url or not self.supabase_key:
            raise ValueError("SUPABASE_URL and SUPABASE_KEY must be set in .env")

        self.rest_url = f"{self.supabase_url}/rest/v1"
        self.headers = {
            "apikey": self.supabase_key,
            "Authorization": f"Bearer {self.supabase_key}",
            "Content-Type": "application/json",
        }

        # --- Embedding model (same one used during ingestion) ---
        print("Loading embedding model (all-MiniLM-L6-v2)...", flush=True)
        self.embed_model = SentenceTransformer("all-MiniLM-L6-v2")

        # --- Gemini LLM ---
        api_key = os.getenv("GOOGLE_API_KEY")
        if not api_key:
            raise ValueError("GOOGLE_API_KEY must be set in .env")

        self.client = genai.Client(api_key=api_key)
        self.model_name = "gemini-2.5-flash"

        print("Supabase RAG engine ready!", flush=True)

    # --------------------------------------------------------------------- #
    #  Vector search via Supabase RPC
    # --------------------------------------------------------------------- #
    def _search(self, question: str, k: int = 10) -> list[dict]:
        """Embed the question and call the match_documents RPC."""
        embedding = self.embed_model.encode(question).tolist()

        payload = {
            "query_embedding": embedding,
            "match_count": k,
        }

        response = requests.post(
            f"{self.supabase_url}/rest/v1/rpc/match_documents",
            json=payload,
            headers=self.headers,
            timeout=30,
        )

        if response.status_code != 200:
            raise RuntimeError(
                f"Supabase RPC error {response.status_code}: {response.text[:300]}"
            )

        return response.json()

    # --------------------------------------------------------------------- #
    #  Full query pipeline: retrieve → generate → return
    # --------------------------------------------------------------------- #
    def query(self, question: str, k: int = 10) -> dict:
        """Run the full RAG pipeline and return answer + sources."""
        docs = self._search(question, k=k)

        if not docs:
            return {
                "answer": "I couldn't find any relevant information in the documents.",
                "sources": [],
            }

        # Build context for Gemini
        context_parts = []
        for i, doc in enumerate(docs, 1):
            doc_id = doc.get("document_id", "Unknown")
            section = doc.get("section_number", "")
            pages = doc.get("page_numbers", [])
            page_str = ", ".join(str(p) for p in pages) if pages else "N/A"
            context_parts.append(
                f"[Document {i} – ID: {doc_id}, Section: {section}, Pages: {page_str}]\n"
                f"{doc['content']}\n"
            )

        context = "\n".join(context_parts)

        prompt = f"""You are **Vedan AI**, an expert assistant on Indian tax law (CGST / GST).

Use ONLY the context below to answer the question.
• Cite every claim with [Source: document_id, Section: X, Page: Y].
• If the context does not contain enough information, say so clearly.

Context:
{context}

Question: {question}

Answer with citations:"""

        response = self.client.models.generate_content(
            model=self.model_name,
            contents=prompt,
        )
        answer = response.text

        # Format sources for the frontend
        sources = []
        for doc in docs:
            pages = doc.get("page_numbers", [])
            sources.append(
                {
                    "source": doc.get("document_id", "Unknown"),
                    "page": pages[0] if pages else 0,
                    "content": (
                        doc["content"][:200] + "..."
                        if len(doc["content"]) > 200
                        else doc["content"]
                    ),
                }
            )

        return {"answer": answer, "sources": sources}

    # --------------------------------------------------------------------- #
    #  Stats
    # --------------------------------------------------------------------- #
    def get_stats(self) -> dict:
        """Return a count of rows in document_chunks."""
        resp = requests.get(
            f"{self.rest_url}/document_chunks?select=id",
            headers={**self.headers, "Prefer": "count=exact", "Range": "0-0"},
            timeout=10,
        )
        # The total count is in the Content-Range header, e.g. "0-0/3413"
        content_range = resp.headers.get("Content-Range", "")
        total = int(content_range.split("/")[-1]) if "/" in content_range else 0
        return {"total_documents": total, "database": "supabase"}
