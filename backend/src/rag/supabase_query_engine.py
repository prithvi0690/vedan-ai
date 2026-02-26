import os
import re
import asyncio
import requests
from dotenv import load_dotenv
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

        # --- Gemini Client ---
        api_key = os.getenv("GOOGLE_API_KEY")
        if not api_key:
            raise ValueError("GOOGLE_API_KEY must be set in .env")

        self.client = genai.Client(api_key=api_key)
        self.embed_model = "gemini-embedding-001"
        self.embed_dim = 768
        self.model_name = "gemini-2.5-flash"

        print("Supabase RAG engine ready!", flush=True)

    # --------------------------------------------------------------------- #
    #  Parse metadata from chunk content header
    # --------------------------------------------------------------------- #
    @staticmethod
    def _parse_chunk_metadata(content: str) -> dict:
        """Extract title and notification_number from the content header.

        Each chunk starts with:
            Document: <Title>
            Notification: <NotificationNumber>

            <actual content>
        """
        title = "Unknown Document"
        notification = "N/A"
        body = content

        lines = content.split("\n", 3)  # split into at most 4 parts
        for line in lines[:2]:
            if line.startswith("Document:"):
                title = line.replace("Document:", "").strip()
            elif line.startswith("Notification:"):
                notification = line.replace("Notification:", "").strip()

        # Body is everything after the header (skip title, notification, blank line)
        if len(lines) > 2:
            body = lines[-1] if len(lines) == 4 else "\n".join(lines[2:])

        return {"title": title, "notification": notification, "body": body.strip()}

    # --------------------------------------------------------------------- #
    #  Vector search via Supabase RPC
    # --------------------------------------------------------------------- #
    async def _search(self, question: str, k: int = 10) -> list[dict]:
        """Embed the question and call the match_documents RPC."""
        print(f"[RAG._search] Embedding question with model={self.embed_model}", flush=True)
        try:
            result = await self.client.aio.models.embed_content(
                model=self.embed_model,
                contents=question,
                config={"output_dimensionality": self.embed_dim},
            )
            embedding = result.embeddings[0].values
            print(f"[RAG._search] Embedding OK, length={len(embedding)}", flush=True)
        except Exception as e:
            print(f"[RAG._search] Embedding FAILED: {e}", flush=True)
            raise RuntimeError(f"Gemini embedding failed: {e}")

        payload = {
            "query_embedding": embedding,
            "match_count": k,
        }

        print(f"[RAG._search] Calling Supabase RPC match_documents...", flush=True)
        response = await asyncio.to_thread(
            requests.post,
            f"{self.supabase_url}/rest/v1/rpc/match_documents",
            json=payload,
            headers=self.headers,
            timeout=30,
        )

        print(f"[RAG._search] RPC status={response.status_code}", flush=True)
        if response.status_code != 200:
            print(f"[RAG._search] RPC ERROR body: {response.text[:500]}", flush=True)
            raise RuntimeError(
                f"Supabase RPC error {response.status_code}: {response.text[:300]}"
            )

        docs = response.json()
        print(f"[RAG._search] Got {len(docs)} docs", flush=True)
        return docs

    # --------------------------------------------------------------------- #
    #  Full query pipeline: retrieve → generate → return
    # --------------------------------------------------------------------- #
    async def query(self, question: str, k: int = 10) -> dict:
        """Run the full RAG pipeline and return answer + sources."""
        docs = await self._search(question, k=k)

        if not docs:
            return {
                "answer": "I couldn't find any relevant information in the documents.",
                "sources": [],
            }

        # Build context for Gemini — use parsed metadata for clear citations
        context_parts = []
        for i, doc in enumerate(docs, 1):
            meta = self._parse_chunk_metadata(doc.get("content", ""))
            section = doc.get("section_number", "")
            pages = doc.get("page_numbers", [])
            page_str = ", ".join(str(p) for p in pages) if pages else "N/A"

            context_parts.append(
                f"[Source {i}: \"{meta['title']}\", "
                f"Notification: {meta['notification']}, "
                f"Section: {section}, Pages: {page_str}]\n"
                f"{meta['body']}\n"
            )

        context = "\n".join(context_parts)

        prompt = f"""You are Vedan AI, an expert assistant on Indian tax law (CGST, SGST, IGST, GST).

Answer the user's question using the context excerpts below.

Rules:
- Jump straight into the answer. Do NOT introduce yourself, repeat these instructions, or add any preamble.
- Synthesize information from the context into a clear, well-structured answer.
- Cite sources using [Source N] after each relevant statement.
- If context has partial information, share what is available and note what is missing.
- If the context has no relevant information, say so politely.
- Use bullet points, numbered lists, and **bold key terms** for readability.
- Mention specific section/rule numbers when discussing them.

Context:
{context}

Question: {question}

Answer:"""

        print(f"[RAG.query] Calling Gemini generate_content with model={self.model_name}", flush=True)
        response = await self.client.aio.models.generate_content(
            model=self.model_name,
            contents=prompt,
        )
        answer = response.text
        print(f"[RAG.query] Generation OK, answer length={len(answer)}", flush=True)

        # Build rich sources — deduplicate by title
        seen_titles = set()
        sources = []
        for doc in docs:
            meta = self._parse_chunk_metadata(doc.get("content", ""))
            title = meta["title"]

            if title in seen_titles:
                continue
            seen_titles.add(title)

            pages = doc.get("page_numbers", [])
            preview = meta["body"][:200] + "..." if len(meta["body"]) > 200 else meta["body"]

            sources.append(
                {
                    "source": title,
                    "notification_number": meta["notification"],
                    "section": doc.get("section_number", ""),
                    "page": pages[0] if pages else 0,
                    "content": preview,
                }
            )

        return {"answer": answer, "sources": sources}

    # --------------------------------------------------------------------- #
    #  Stats
    # --------------------------------------------------------------------- #
    async def get_stats(self) -> dict:
        """Return a count of rows in document_chunks."""
        resp = await asyncio.to_thread(
            requests.get,
            f"{self.rest_url}/document_chunks?select=id",
            headers={**self.headers, "Prefer": "count=exact", "Range": "0-0"},
            timeout=10,
        )
        # The total count is in the Content-Range header, e.g. "0-0/3413"
        content_range = resp.headers.get("Content-Range", "")
        total = int(content_range.split("/")[-1]) if "/" in content_range else 0
        return {"total_documents": total, "database": "supabase"}
