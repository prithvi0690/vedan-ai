import os
import sys
from dotenv import load_dotenv
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_community.vectorstores import Chroma
import google.generativeai as genai

load_dotenv()

CHROMA_PATH = "data/vector_store"

class SimpleRAGEngine:
    def __init__(self):
        """Initialize RAG engine with local embeddings and direct Gemini API."""
        print("Loading RAG engine...", flush=True)
        self.embeddings = HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")
        self.db = Chroma(persist_directory=CHROMA_PATH, embedding_function=self.embeddings)
        
        api_key = os.getenv("GEMINI_API_KEY")
        if not api_key:
            raise ValueError("GEMINI_API_KEY not found in .env file")
        
        genai.configure(api_key=api_key)
        self.model = genai.GenerativeModel('gemini-2.5-flash')
        print("Ready!\n", flush=True)
    
    def query(self, question: str, k: int = 10):
        """Query the RAG system."""
        docs = self.db.similarity_search(question, k=k)
        
        if not docs:
            return {"answer": "I couldn't find any relevant information.", "sources": []}
        
        context_parts = []
        for i, doc in enumerate(docs, 1):
            source = doc.metadata.get("source", "Unknown")
            page = doc.metadata.get("page", "Unknown")
            context_parts.append(f"[Document {i} - Source: {source}, Page: {page}]\n{doc.page_content}\n")
        
        context = "\n".join(context_parts)
        
        prompt = f"""You are a helpful assistant answering questions about CGST documents.

Use the context below to answer the question. Always cite sources using [Source: filename, Page: X] format.

Context:
{context}

Question: {question}

Answer with citations:"""
        
        response = self.model.generate_content(prompt)
        
        sources = []
        for doc in docs:
            sources.append({
                "content": doc.page_content[:150] + "..." if len(doc.page_content) > 150 else doc.page_content,
                "source": doc.metadata.get("source", "Unknown"),
                "page": doc.metadata.get("page", "Unknown"),
            })
        
        return {"answer": response.text, "sources": sources}

def main():
    if len(sys.argv) > 1:
        # Command line mode: python ask.py "your question here"
        question = " ".join(sys.argv[1:])
        engine = SimpleRAGEngine()
        result = engine.query(question)
        
        print("="*60)
        print("ANSWER:")
        print("="*60)
        print(result["answer"])
        print("\n" + "="*60)
        print("SOURCES:")
        print("="*60)
        for i, source in enumerate(result["sources"], 1):
            print(f"\n{i}. {source['source']} (Page {source['page']})")
            print(f"   {source['content']}")
    else:
        # Interactive mode
        print("="*60)
        print("VEDAN AI - CGST Question Answering System")
        print("="*60)
        engine = SimpleRAGEngine()
        
        print("Type your questions (or 'quit' to exit)\n")
        
        while True:
            question = input("Question: ").strip()
            
            if question.lower() in ['quit', 'exit', 'q']:
                print("Goodbye!")
                break
            
            if not question:
                continue
            
            print("\nSearching...", flush=True)
            result = engine.query(question)
            
            print("\n" + "="*60)
            print("ANSWER:")
            print("="*60)
            print(result["answer"])
            print("\n" + "="*60)
            print("SOURCES:")
            print("="*60)
            for i, source in enumerate(result["sources"], 1):
                print(f"\n{i}. {source['source']} (Page {source['page']})")
                print(f"   {source['content']}")
            print("\n")

if __name__ == "__main__":
    main()
