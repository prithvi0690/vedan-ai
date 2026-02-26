import unittest
from unittest.mock import patch, MagicMock
from fastapi.testclient import TestClient
import sys
import os

# Add the backend directory to sys.path to allow imports from src
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from src.api.main import app

class TestHealthCheck(unittest.TestCase):
    def setUp(self):
        self.client = TestClient(app)

    @patch('src.api.main.get_engine')
    def test_health_check_success(self, mock_get_engine):
        # Setup mock
        mock_get_engine.return_value = MagicMock()

        # Call the endpoint
        response = self.client.get("/health")

        # Assertions
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json(), {
            "status": "healthy",
            "message": "RAG system is operational"
        })
        mock_get_engine.assert_called_once()

    @patch('src.api.main.get_engine')
    def test_health_check_failure(self, mock_get_engine):
        # Setup mock to raise an exception
        mock_get_engine.side_effect = Exception("Engine initialization failed")

        # Call the endpoint
        response = self.client.get("/health")

        # Assertions
        self.assertEqual(response.status_code, 503)
        self.assertIn("RAG engine not ready", response.json()["detail"])
        self.assertIn("Engine initialization failed", response.json()["detail"])
        mock_get_engine.assert_called_once()

if __name__ == "__main__":
    unittest.main()
