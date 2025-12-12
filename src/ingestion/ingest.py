import os
import sys
from dotenv import load_dotenv
from langchain_community.document_loaders import PyPDFLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_community.vectorstores import Chroma
import time
import sys

# Load environment variables
load_dotenv()

# Configuration
DATA_PATH = "data/raw"
CHROMA_PATH = "data/vector_store"
BATCH_SIZE = 50  # Process in smaller batches to avoid timeouts

def load_documents():
    """Loads all PDF documents from the data/raw directory."""
    documents = []
    if not os.path.exists(DATA_PATH):
        os.makedirs(DATA_PATH)
        print(f"Created directory: {DATA_PATH}")
        return []

    files = [f for f in os.listdir(DATA_PATH) if f.endswith(".pdf")]
    if not files:
        print(f"No PDF files found in {DATA_PATH}")
        return []

    for filename in files:
        file_path = os.path.join(DATA_PATH, filename)
        print(f"Loading {filename}...", flush=True)
        try:
            loader = PyPDFLoader(file_path)
            docs = loader.load()
            print(f"  Loaded {len(docs)} pages from {filename}", flush=True)
            documents.extend(docs)
        except Exception as e:
            print(f"Error loading {filename}: {e}", flush=True)
            
    return documents

def split_documents(documents):
    """Splits documents into smaller chunks."""
    print("Splitting documents into chunks...", flush=True)
    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=600,
        chunk_overlap=120,
        length_function=len,
        is_separator_regex=False,
    )
    chunks = text_splitter.split_documents(documents)
    print(f"Created {len(chunks)} chunks", flush=True)
    return chunks

def add_to_chroma(chunks):
    """Adds document chunks to the Chroma vector store in batches."""
    if not chunks:
        print("No chunks to add.", flush=True)
        return False

    try:
        # Initialize local embeddings (no API key needed!)
        print("Initializing local embedding model (this may take a moment on first run)...", flush=True)
        embeddings = HuggingFaceEmbeddings(
            model_name="all-MiniLM-L6-v2",  # Fast and efficient model
        )
        print("Embedding model loaded successfully!", flush=True)

        # Initialize/Load Chroma
        print("Initializing Vector Store...", flush=True)
        db = Chroma(
            persist_directory=CHROMA_PATH,
            embedding_function=embeddings
        )

        # Process in batches
        total_chunks = len(chunks)
        successful_batches = 0
        failed_batches = 0
        
        print(f"Adding {total_chunks} chunks to the vector store in batches of {BATCH_SIZE}...", flush=True)
        
        for i in range(0, total_chunks, BATCH_SIZE):
            batch = chunks[i:i+BATCH_SIZE]
            batch_num = (i // BATCH_SIZE) + 1
            total_batches = (total_chunks + BATCH_SIZE - 1) // BATCH_SIZE
            
            print(f"\nProcessing batch {batch_num}/{total_batches} ({len(batch)} chunks)...", flush=True)
            
            try:
                # Add documents
                ids = db.add_documents(batch)
                print(f"  ✓ Batch {batch_num} added successfully ({len(ids)} documents)", flush=True)
                successful_batches += 1
                
                # Verify the batch was added
                current_count = db._collection.count()
                print(f"  Current total in DB: {current_count}", flush=True)
                
                time.sleep(0.5)  # Small delay between batches
            except Exception as e:
                print(f"  ✗ Error adding batch {batch_num}: {e}", flush=True)
                failed_batches += 1
                import traceback
                traceback.print_exc()
                continue
        
        # Final verification
        final_count = db._collection.count()
        print(f"\n{'='*50}", flush=True)
        print(f"Batch processing complete!", flush=True)
        print(f"  Successful batches: {successful_batches}/{total_batches}", flush=True)
        print(f"  Failed batches: {failed_batches}/{total_batches}", flush=True)
        print(f"  Final document count in DB: {final_count}", flush=True)
        print(f"{'='*50}", flush=True)
        
        return final_count > 0
        
    except Exception as e:
        print(f"Error in add_to_chroma: {e}", flush=True)
        import traceback
        traceback.print_exc()
        return False

def main():
    print("=" * 50, flush=True)
    print("Starting ingestion process...", flush=True)
    print("=" * 50, flush=True)
    
    try:
        documents = load_documents()
        if not documents:
            print("Skipping ingestion due to no documents.", flush=True)
            return

        chunks = split_documents(documents)
        print(f"\nSplit {len(documents)} pages into {len(chunks)} chunks.", flush=True)

        add_to_chroma(chunks)
        print("\n" + "=" * 50, flush=True)
        print("Ingestion complete!", flush=True)
        print("=" * 50, flush=True)
        
    except Exception as e:
        print(f"\nFatal error: {e}", flush=True)
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    main()
