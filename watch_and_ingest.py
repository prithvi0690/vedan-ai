import os
import time
import json
from pathlib import Path
from watchdog.observers import Observer
from watchdog.events import FileSystemEventHandler
from dotenv import load_dotenv
from langchain_community.document_loaders import PyPDFLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_community.vectorstores import Chroma

load_dotenv()

DATA_PATH = "data/raw"
CHROMA_PATH = "data/vector_store"
TRACKING_FILE = "data/.ingested_files.json"
BATCH_SIZE = 50

class PDFIngestHandler(FileSystemEventHandler):
    def __init__(self):
        self.embeddings = None
        self.db = None
        self.ingested_files = self.load_tracking()
        print("Initializing embedding model and vector store...")
        self._init_components()
        print("File watcher ready! Monitoring:", DATA_PATH)
        print("Drop PDF files into this folder to auto-ingest.\n")
    
    def _init_components(self):
        """Initialize embeddings and vector store."""
        self.embeddings = HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")
        self.db = Chroma(persist_directory=CHROMA_PATH, embedding_function=self.embeddings)
    
    def load_tracking(self):
        """Load list of already ingested files."""
        if os.path.exists(TRACKING_FILE):
            with open(TRACKING_FILE, 'r') as f:
                return json.load(f)
        return []
    
    def save_tracking(self):
        """Save list of ingested files."""
        os.makedirs(os.path.dirname(TRACKING_FILE), exist_ok=True)
        with open(TRACKING_FILE, 'w') as f:
            json.dump(self.ingested_files, f, indent=2)
    
    def on_created(self, event):
        """Called when a file is created."""
        if event.is_directory:
            return
        
        if event.src_path.endswith('.pdf'):
            # Wait a bit to ensure file is fully written
            time.sleep(2)
            self.ingest_file(event.src_path)
    
    def ingest_file(self, file_path):
        """Ingest a single PDF file."""
        filename = os.path.basename(file_path)
        
        # Check if already ingested
        if file_path in self.ingested_files:
            print(f"⏭️  Skipping {filename} (already ingested)")
            return
        
        print(f"\n{'='*60}")
        print(f"📄 New PDF detected: {filename}")
        print(f"{'='*60}")
        
        try:
            # Load PDF
            print(f"Loading {filename}...", flush=True)
            loader = PyPDFLoader(file_path)
            docs = loader.load()
            print(f"  ✓ Loaded {len(docs)} pages", flush=True)
            
            # Split into chunks
            print("Splitting into chunks...", flush=True)
            text_splitter = RecursiveCharacterTextSplitter(
                chunk_size=600,
                chunk_overlap=120,
                length_function=len,
                is_separator_regex=False,
            )
            chunks = text_splitter.split_documents(docs)
            print(f"  ✓ Created {len(chunks)} chunks", flush=True)
            
            # Add to vector store in batches
            print(f"Adding to vector store...", flush=True)
            total_chunks = len(chunks)
            successful = 0
            
            for i in range(0, total_chunks, BATCH_SIZE):
                batch = chunks[i:i+BATCH_SIZE]
                batch_num = (i // BATCH_SIZE) + 1
                total_batches = (total_chunks + BATCH_SIZE - 1) // BATCH_SIZE
                
                try:
                    self.db.add_documents(batch)
                    successful += len(batch)
                    print(f"  ✓ Batch {batch_num}/{total_batches} added ({len(batch)} chunks)", flush=True)
                    time.sleep(0.5)
                except Exception as e:
                    print(f"  ✗ Error in batch {batch_num}: {e}", flush=True)
            
            # Mark as ingested
            self.ingested_files.append(file_path)
            self.save_tracking()
            
            # Final summary
            total_in_db = self.db._collection.count()
            print(f"\n{'='*60}")
            print(f"✅ Successfully ingested {filename}")
            print(f"   Added: {successful}/{total_chunks} chunks")
            print(f"   Total in database: {total_in_db}")
            print(f"{'='*60}\n")
            
        except Exception as e:
            print(f"\n❌ Error ingesting {filename}: {e}\n")
            import traceback
            traceback.print_exc()

def main():
    print("="*60)
    print("VEDAN AI - Auto Document Ingestion Service")
    print("="*60)
    print()
    
    # Ensure data directory exists
    os.makedirs(DATA_PATH, exist_ok=True)
    
    # Create event handler and observer
    event_handler = PDFIngestHandler()
    observer = Observer()
    observer.schedule(event_handler, DATA_PATH, recursive=False)
    observer.start()
    
    print("🔍 Watching for new PDF files...")
    print("📁 Drop PDFs into:", os.path.abspath(DATA_PATH))
    print("⏹️  Press Ctrl+C to stop\n")
    
    try:
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        print("\n\n⏹️  Stopping file watcher...")
        observer.stop()
    
    observer.join()
    print("✅ File watcher stopped.")

if __name__ == "__main__":
    main()
