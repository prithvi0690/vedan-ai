import sqlite3
import os

CHROMA_PATH = "data/vector_store/chroma.sqlite3"

if os.path.exists(CHROMA_PATH):
    print(f"Database file exists: {CHROMA_PATH}")
    print(f"File size: {os.path.getsize(CHROMA_PATH)} bytes")
    
    try:
        conn = sqlite3.connect(CHROMA_PATH)
        cursor = conn.cursor()
        
        # Get all tables
        cursor.execute("SELECT name FROM sqlite_master WHERE type='table';")
        tables = cursor.fetchall()
        print(f"\nTables in database: {tables}")
        
        # Try to get count from embeddings table if it exists
        try:
            cursor.execute("SELECT COUNT(*) FROM embeddings;")
            count = cursor.fetchone()[0]
            print(f"Number of embeddings: {count}")
        except:
            print("No embeddings table found or error reading it")
        
        conn.close()
        print("\nDatabase appears to be valid!")
    except Exception as e:
        print(f"Error reading database: {e}")
else:
    print(f"Database file not found at {CHROMA_PATH}")
