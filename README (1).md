# 🏛️ Vedan AI — GST & Tax Compliance Intelligence Platform

An AI-powered citation-first compliance engine for Indian taxation. Built with RAG (Retrieval-Augmented Generation) to deliver audit-safe, hallucination-resistant answers grounded strictly in official government notifications.

![Python](https://img.shields.io/badge/Python-3.10+-blue.svg)
![FastAPI](https://img.shields.io/badge/FastAPI-0.100+-green.svg)
![AWS S3](https://img.shields.io/badge/AWS-S3-orange.svg)
![License](https://img.shields.io/badge/License-MIT-yellow.svg)

> Built for the **AI for Bharat Hackathon** — Powered by AWS

---

## ✨ Features

- 🔍 **Audit-Safe Citations** — Every answer is backed by a specific GST notification or Act clause
- 🤖 **Hallucination-Resistant RAG** — Refuses to answer beyond its corpus instead of making things up
- 📚 **GST 2017 Corpus** — Full CGST document set indexed and queryable
- 🌐 **Vernacular Access** — Bhashini ASR + NMT integration planned for 22+ Indian languages
- 📱 **Responsive UI** — Clean chat interface, works on desktop and mobile

---

## 🏗️ Architecture

This MVP is built for rapid prototyping. The production architecture is designed for full AWS deployment — migration in progress.

### Current MVP Stack
| Layer | Technology |
|---|---|
| Backend | FastAPI, Python |
| AI / LLM | LLM API (Claude-compatible interface) |
| Embeddings | HuggingFace Embeddings |
| Vector Store | ChromaDB (local) |
| Orchestration | LangChain |
| Document Storage | Amazon S3 ✅ |
| Frontend | HTML, Tailwind CSS |
| Dev Workflow | Kiro (Agentic IDE) ✅ |

### Proposed Production Architecture (AWS)
| Layer | Service |
|---|---|
| Foundation Model | Amazon Bedrock (Claude) |
| Document Store | Amazon S3 |
| Vector Index | Bedrock Knowledge Bases |
| API Layer | AWS Lambda + API Gateway |
| Database | Amazon DynamoDB |
| Frontend Hosting | AWS Amplify |
| Vernacular NLP | Bhashini ASR + NMT |

---

## 🚀 Quick Start

### Prerequisites
- Python 3.10+
- LLM API Key (set in `.env`)

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
   # Edit .env and add your API key
   ```

5. **Run the application**
   ```bash
   python src/api/main.py
   ```

6. **Open in browser**
   ```
   http://localhost:8000
   ```

---

## 📁 Project Structure

```
vedan-ai/
├── src/
│   ├── api/
│   │   └── main.py                  # FastAPI server
│   └── rag/
│       └── simple_query_engine.py   # RAG pipeline logic
├── static/
│   ├── index.html                   # Web UI
│   └── app.js                       # Frontend logic
├── data/
│   ├── documents/                   # Source PDFs (also on Amazon S3)
│   └── vector_store/                # ChromaDB embeddings
├── requirements.txt
├── .env.example
└── README.md
```

---

## 💡 Why Citation-First?

Generic LLMs hallucinate legal clauses. In tax compliance, a wrong answer creates real liability for Chartered Accountants and their clients. Vedan AI is engineered to:

1. **Only answer from indexed source documents** — no model memory, no guessing
2. **Always cite the source** — every answer references the specific notification it pulled from
3. **Refuse gracefully** — if the answer isn't in the corpus, it says so instead of making something up

This is the core design principle, not just a technical constraint.

---

## 🗺️ Roadmap

- [x] GST 2017 document corpus ingestion
- [x] Citation-backed RAG pipeline
- [x] Chat interface (home + query screens)
- [x] Amazon S3 document storage
- [ ] Bhashini vernacular integration (Hindi, Tamil, Telugu, 22+ languages)
- [ ] Migration to Amazon Bedrock
- [ ] Income Tax corpus expansion
- [ ] CA Dashboard with client context
- [ ] AWS Lambda + API Gateway deployment

---

## 🛠️ Tech Stack

- **Backend**: FastAPI, Python
- **AI/ML**: RAG Pipeline, LangChain, HuggingFace Embeddings, LLM API
- **Vector Store**: ChromaDB
- **Document Storage**: Amazon S3
- **Dev Workflow**: Kiro
- **Frontend**: HTML, Tailwind CSS, Lucide Icons

---

## 📝 License

MIT License

---

Made with ❤️ for simplifying Indian tax compliance — **AI for Bharat Hackathon 2025**
