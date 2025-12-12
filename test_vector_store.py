import os
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_community.vectorstores import Chroma

CHROMA_PATH = "data/vector_store"

def test_vector_store():
    print("Initializing local embedding model...", flush=True)
    embeddings = HuggingFaceEmbeddings(
        model_name="all-MiniLM-L6-v2",
    )
    
    db = Chroma(
        persist_directory=CHROMA_PATH,
        embedding_function=embeddings
    )
    
    # Get collection stats
    collection = db._collection
    count = collection.count()
    print(f"\nTotal documents in vector store: {count}")
    
    if count == 0:
        print("No documents found in the vector store!")
        return
    
    # Test a simple query
    print("\nTesting similarity search for 'CGST'...")
    results = db.similarity_search("CGST", k=3)
    
    print(f"\nTest query results (top 3):")
    for i, doc in enumerate(results, 1):
        print(f"\n--- Result {i} ---")
        print(f"Content preview: {doc.page_content[:200]}...")
        print(f"Metadata: {doc.metadata}")
        print(f"  - Source: {doc.metadata.get('source', 'N/A')}")
        print(f"  - Page: {doc.metadata.get('page', 'N/A')}")

if __name__ == "__main__":
    test_vector_store()
