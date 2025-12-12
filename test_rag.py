import os
import sys
from datetime import datetime
from dotenv import load_dotenv
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_community.vectorstores import Chroma
import google.generativeai as genai

load_dotenv()

CHROMA_PATH = "data/vector_store"
QUESTIONS_FILE = "test_questions.txt"
RESULTS_FILE = f"test_results_{datetime.now().strftime('%Y%m%d_%H%M%S')}.md"

class RAGTester:
    def __init__(self):
        print("Initializing RAG system for testing...", flush=True)
        self.embeddings = HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")
        self.db = Chroma(persist_directory=CHROMA_PATH, embedding_function=self.embeddings)
        
        api_key = os.getenv("GEMINI_API_KEY")
        if not api_key:
            raise ValueError("GEMINI_API_KEY not found in .env file")
        
        genai.configure(api_key=api_key)
        self.model = genai.GenerativeModel('gemini-2.5-flash')
        print("Ready!\n", flush=True)
    
    def query(self, question: str, k: int = 10):
        """Query the RAG system and return detailed results."""
        docs = self.db.similarity_search(question, k=k)
        
        if not docs:
            return {
                "answer": "I couldn't find any relevant information.",
                "sources": [],
                "retrieved_chunks": []
            }
        
        # Build context with citations
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
        
        # Format sources and chunks
        sources = []
        chunks = []
        for i, doc in enumerate(docs, 1):
            source_file = doc.metadata.get("source", "Unknown")
            page = doc.metadata.get("page", "Unknown")
            
            sources.append({
                "source": source_file,
                "page": page,
            })
            
            chunks.append({
                "rank": i,
                "source": source_file,
                "page": page,
                "content": doc.page_content
            })
        
        return {
            "answer": response.text,
            "sources": sources,
            "retrieved_chunks": chunks
        }

def load_questions(filename):
    """Load questions from file."""
    if not os.path.exists(filename):
        print(f"Error: {filename} not found!")
        return []
    
    questions = []
    with open(filename, 'r', encoding='utf-8') as f:
        for line in f:
            line = line.strip()
            if line and not line.startswith('#'):
                questions.append(line)
    
    return questions

def save_results(results, filename):
    """Save test results to markdown file."""
    with open(filename, 'w', encoding='utf-8') as f:
        f.write("# RAG System Test Results\n\n")
        f.write(f"**Generated:** {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n\n")
        f.write(f"**Total Questions:** {len(results)}\n\n")
        f.write("---\n\n")
        
        for i, result in enumerate(results, 1):
            f.write(f"## Question {i}\n\n")
            f.write(f"**Q:** {result['question']}\n\n")
            
            f.write("### Answer\n\n")
            f.write(f"{result['answer']}\n\n")
            
            f.write("### Citations\n\n")
            for j, source in enumerate(result['sources'], 1):
                f.write(f"{j}. **{source['source']}** - Page {source['page']}\n")
            f.write("\n")
            
            f.write("### Retrieved Chunks (for validation)\n\n")
            for chunk in result['retrieved_chunks']:
                f.write(f"**Chunk {chunk['rank']}** - {chunk['source']} (Page {chunk['page']})\n\n")
                f.write(f"```\n{chunk['content']}\n```\n\n")
            
            f.write("---\n\n")

def main():
    print("="*70)
    print("RAG SYSTEM VALIDATION TEST")
    print("="*70)
    print()
    
    # Load questions
    questions = load_questions(QUESTIONS_FILE)
    if not questions:
        print(f"No questions found in {QUESTIONS_FILE}")
        print("Please add your questions to the file (one per line)")
        return
    
    print(f"Loaded {len(questions)} questions from {QUESTIONS_FILE}\n")
    
    # Initialize RAG
    tester = RAGTester()
    
    # Run tests
    results = []
    for i, question in enumerate(questions, 1):
        print(f"[{i}/{len(questions)}] Testing: {question}")
        result = tester.query(question)
        results.append({
            "question": question,
            "answer": result["answer"],
            "sources": result["sources"],
            "retrieved_chunks": result["retrieved_chunks"]
        })
        print(f"    ✓ Retrieved {len(result['sources'])} sources\n")
    
    # Save results
    save_results(results, RESULTS_FILE)
    
    print("="*70)
    print(f"✅ Test complete! Results saved to: {RESULTS_FILE}")
    print("="*70)
    print()
    print("Review the results file to validate:")
    print("  1. Answer quality and accuracy")
    print("  2. Citation correctness (source file + page number)")
    print("  3. Relevance of retrieved chunks")
    print()

if __name__ == "__main__":
    main()
