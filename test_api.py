"""
Simple test script for the Vedan AI API
"""

import requests
import json

BASE_URL = "http://localhost:8000"

def test_health():
    """Test health endpoint."""
    print("Testing /health endpoint...")
    response = requests.get(f"{BASE_URL}/health")
    print(f"Status: {response.status_code}")
    print(f"Response: {json.dumps(response.json(), indent=2)}\n")

def test_stats():
    """Test stats endpoint."""
    print("Testing /stats endpoint...")
    response = requests.get(f"{BASE_URL}/stats")
    print(f"Status: {response.status_code}")
    print(f"Response: {json.dumps(response.json(), indent=2)}\n")

def test_query(question):
    """Test query endpoint."""
    print(f"Testing /query endpoint with question: '{question}'")
    response = requests.post(
        f"{BASE_URL}/query",
        json={"question": question, "k": 5}
    )
    print(f"Status: {response.status_code}")
    
    if response.status_code == 200:
        result = response.json()
        print("\nAnswer:")
        print(result["answer"])
        print("\nSources:")
        for i, source in enumerate(result["sources"], 1):
            print(f"\n{i}. {source['source']} (Page {source['page']})")
            print(f"   {source['content'][:100]}...")
    else:
        print(f"Error: {response.text}")
    print()

def main():
    print("="*70)
    print("VEDAN AI API - TEST SCRIPT")
    print("="*70)
    print()
    
    try:
        # Test health
        test_health()
        
        # Test stats
        test_stats()
        
        # Test queries
        test_query("What is CGST?")
        test_query("What are the thresholds for GST registration?")
        
        print("="*70)
        print("All tests completed!")
        print("="*70)
        
    except requests.exceptions.ConnectionError:
        print("ERROR: Could not connect to API server.")
        print("Make sure the server is running: python src/api/main.py")
    except Exception as e:
        print(f"ERROR: {e}")

if __name__ == "__main__":
    main()
