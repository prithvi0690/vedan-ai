import os
import re
import psycopg2
from dotenv import load_dotenv
from google import genai

load_dotenv()


class NeonRAGEngine:
    """RAG engine using Neon PostgreSQL (pgvector) for retrieval and Gemini for generation."""

    def __init__(self):
        print("Initializing Neon RAG engine...", flush=True)

        # --- Neon PostgreSQL connection ---
        self.database_url = os.getenv("DATABASE_URL")
        if not self.database_url:
            raise ValueError("DATABASE_URL must be set in .env")

        # Test connection
        conn = psycopg2.connect(self.database_url)
        conn.close()

        # --- Gemini Client ---
        api_key = os.getenv("GOOGLE_API_KEY")
        if not api_key:
            raise ValueError("GOOGLE_API_KEY must be set in .env")

        self.client = genai.Client(api_key=api_key)
        self.embed_model = "gemini-embedding-001"
        self.embed_dim = 768
        self.model_name = "gemini-2.5-flash"

        print("Neon RAG engine ready!", flush=True)

    # --------------------------------------------------------------------- #
    #  Helper: get a fresh DB connection
    # --------------------------------------------------------------------- #
    def _get_conn(self):
        return psycopg2.connect(self.database_url)

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
    #  Vector search via Neon PostgreSQL
    # --------------------------------------------------------------------- #
    def _search(self, question: str, k: int = 10) -> list[dict]:
        """Embed the question and call the match_documents function."""
        print(f"[RAG._search] Embedding question with model={self.embed_model}", flush=True)
        try:
            result = self.client.models.embed_content(
                model=self.embed_model,
                contents=question,
                config={"output_dimensionality": self.embed_dim},
            )
            embedding = result.embeddings[0].values
            print(f"[RAG._search] Embedding OK, length={len(embedding)}", flush=True)
        except Exception as e:
            print(f"[RAG._search] Embedding FAILED: {e}", flush=True)
            raise RuntimeError(f"Gemini embedding failed: {e}")

        print(f"[RAG._search] Querying Neon match_documents...", flush=True)
        conn = self._get_conn()
        try:
            cur = conn.cursor()
            cur.execute(
                "SELECT * FROM match_documents(%s::vector, %s)",
                (str(embedding), k),
            )
            columns = [desc[0] for desc in cur.description]
            rows = cur.fetchall()
            cur.close()
        finally:
            conn.close()

        docs = []
        for row in rows:
            doc = dict(zip(columns, row))
            # Convert page_numbers from list to the expected format
            if doc.get("page_numbers") is None:
                doc["page_numbers"] = []
            docs.append(doc)

        print(f"[RAG._search] Got {len(docs)} docs", flush=True)
        return docs

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
        response = self.client.models.generate_content(
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
    def get_stats(self) -> dict:
        """Return a count of rows in document_chunks."""
        conn = self._get_conn()
        try:
            cur = conn.cursor()
            cur.execute("SELECT COUNT(*) FROM document_chunks")
            total = cur.fetchone()[0]
            cur.close()
        finally:
            conn.close()
        return {"total_documents": total, "database": "neon"}
