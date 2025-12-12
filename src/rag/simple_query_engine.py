import os
from dotenv import load_dotenv
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_community.vectorstores import Chroma
import google.generativeai as genai

load_dotenv()

CHROMA_PATH = "data/vector_store"

class SimpleRAGEngine:
    def __init__(self):
        """Initialize RAG engine with local embeddings and direct Gemini API."""
        print("Loading embedding model...", flush=True)
        self.embeddings = HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")
        
        print("Loading vector store...", flush=True)
        self.db = Chroma(
            persist_directory=CHROMA_PATH,
            embedding_function=self.embeddings
        )
        
        print("Initializing Gemini...", flush=True)
        api_key = os.getenv("GEMINI_API_KEY")
        if not api_key:
            raise ValueError("GEMINI_API_KEY not found in .env file")
        
        genai.configure(api_key=api_key)
        self.model = genai.GenerativeModel('gemini-2.5-flash')
        
        print("RAG Engine ready!", flush=True)
    
    def query(self, question: str, k: int = 10):
        """Query the RAG system."""
        import time
        start_total = time.time()
        
        # Step 1: Retrieve relevant documents
        print(f"\nSearching for relevant documents...", flush=True)
        start_retrieval = time.time()
        docs = self.db.similarity_search(question, k=k)
        end_retrieval = time.time()
        print(f"Found {len(docs)} relevant documents in {end_retrieval - start_retrieval:.2f}s", flush=True)
        
        if not docs:
            return {
                "answer": "I couldn't find any relevant information.",
                "sources": []
            }
        
        # Step 2: Build context with citations
        context_parts = []
        for i, doc in enumerate(docs, 1):
            source = doc.metadata.get("source", "Unknown")
            page = doc.metadata.get("page", "Unknown")
            context_parts.append(
                f"[Document {i} - Source: {source}, Page: {page}]\n{doc.page_content}\n"
            )
        
        context = "\n".join(context_parts)
        
        # Step 3: Create prompt
        prompt = f"""You are a helpful assistant answering questions about CGST documents.

Use the context below to answer the question. Always cite sources using [Source: filename, Page: X] format.

Context:
{context}

Question: {question}

Answer with citations:"""
        
        # Step 4: Get answer from Gemini
        print("Generating answer...", flush=True)
        start_generation = time.time()
        response = self.model.generate_content(prompt)
        answer = response.text
        end_generation = time.time()
        print(f"Answer generated in {end_generation - start_generation:.2f}s", flush=True)
        print(f"Total query time: {end_generation - start_total:.2f}s", flush=True)
        
        # Step 5: Format sources
        sources = []
        for doc in docs:
            sources.append({
                "content": doc.page_content[:200] + "..." if len(doc.page_content) > 200 else doc.page_content,
                "source": doc.metadata.get("source", "Unknown"),
                "page": doc.metadata.get("page", "Unknown"),
            })
        
        return {"answer": answer, "sources": sources}

def main():
    print("="*50)
    print("Initializing Simple RAG Engine...")
    print("="*50)
    
    engine = SimpleRAGEngine()
    
    print("\n" + "="*50)
    test_question = "What is CGST?"
    print(f"Question: {test_question}")
    print("="*50)
    
    result = engine.query(test_question)
    
    print("\n" + "="*50)
    print("ANSWER:")
    print("="*50)
    print(result["answer"])
    
    print("\n" + "="*50)
    print("SOURCES:")
    print("="*50)
    for i, source in enumerate(result["sources"], 1):
        print(f"\n{i}. Source: {source['source']}")
        print(f"   Page: {source['page']}")
        print(f"   Preview: {source['content']}")

if __name__ == "__main__":
    main()
