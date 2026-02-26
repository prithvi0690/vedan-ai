from pydantic import BaseModel, Field, ValidationError
from typing import Optional

class QueryRequest(BaseModel):
    question: str
    k: Optional[int] = Field(default=10, ge=1, le=20)

def test_query_request():
    print("Testing QueryRequest validation...")

    # Valid cases
    try:
        q = QueryRequest(question="What is GST?", k=10)
        print("  OK: k=10 is valid")
        q = QueryRequest(question="What is GST?", k=1)
        print("  OK: k=1 is valid")
        q = QueryRequest(question="What is GST?", k=20)
        print("  OK: k=20 is valid")
        q = QueryRequest(question="What is GST?")
        print("  OK: default k=10 is valid")
    except ValidationError as e:
        print(f"  Unexpected error for valid input: {e}")

    # Invalid cases
    invalid_ks = [0, 21, -1, 100]
    for k in invalid_ks:
        try:
            QueryRequest(question="What is GST?", k=k)
            print(f"  FAIL: k={k} should be invalid but was accepted")
        except ValidationError:
            print(f"  OK: k={k} is correctly caught as invalid")

if __name__ == "__main__":
    try:
        test_query_request()
    except Exception as e:
        print(f"Could not run tests: {e}")
