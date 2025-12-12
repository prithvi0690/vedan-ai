# 🏛️ Vedan AI - Tax & Policy Assistant

An AI-powered question-answering system for Indian tax laws (CGST) and government policies. Built with RAG (Retrieval-Augmented Generation) using Google Gemini and local embeddings.

![Python](https://img.shields.io/badge/Python-3.10+-blue.svg)
![FastAPI](https://img.shields.io/badge/FastAPI-0.100+-green.svg)
![License](https://img.shields.io/badge/License-MIT-yellow.svg)

## ✨ Features

- 🔍 **Smart Document Search** - Retrieves relevant information from CGST documents
- 🤖 **AI-Powered Answers** - Uses Google Gemini for accurate, cited responses
- 📚 **Source Citations** - Every answer includes references to source documents
- 🌙 **Dark Mode** - Easy on the eyes with a beautiful Royal Blue theme
- 📱 **Responsive Design** - Works on desktop and mobile

## 🚀 Quick Start

### Prerequisites
- Python 3.10+
- Google Gemini API Key

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/YOUR_USERNAME/vedan-ai.git
   cd vedan-ai
   ```

2. **Create virtual environment**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env and add your GEMINI_API_KEY
   ```

5. **Run the application**
   ```bash
   python src/api/main.py
   ```

6. **Open in browser**
   ```
   http://localhost:8000
   ```

## 📁 Project Structure

```
vedan-ai/
├── src/
│   ├── api/
│   │   └── main.py          # FastAPI server
│   └── rag/
│       └── simple_query_engine.py  # RAG logic
├── static/
│   ├── index.html           # Web UI
│   └── app.js               # Frontend logic
├── data/
│   ├── documents/           # Source PDFs
│   └── vector_store/        # ChromaDB embeddings
├── requirements.txt
├── .env.example
└── README.md
```

## 🔧 Configuration

Create a `.env` file with:
```env
GEMINI_API_KEY=your_api_key_here
```

## 🛠️ Tech Stack

- **Backend**: FastAPI, Python
- **AI/ML**: Google Gemini, LangChain, HuggingFace Embeddings
- **Vector Store**: ChromaDB
- **Frontend**: HTML, Tailwind CSS, Lucide Icons

## 📝 License

MIT License - feel free to use this project for your own purposes.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

Made with ❤️ for simplifying Indian tax laws
