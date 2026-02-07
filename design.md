# Vedan AI – System Design

## Overview
Vedan AI is designed as a verified compliance intelligence system, not a generic chatbot. 
It uses a Retrieval-Augmented Generation (RAG) approach to ensure all answers are grounded 
in official government documents.

## High-Level Architecture
The system consists of three main layers:

1. User Interface Layer
- Web or mobile interface for entering queries.
- Supports text and voice-based inputs.

2. Processing & Intelligence Layer
- Interprets user intent (GST, tax, or schemes).
- Retrieves relevant official documents from a vector database.
- Uses an LLM to generate answers strictly from retrieved content.

3. Data Layer
- Stores official government documents (PDFs).
- Maintains embeddings and metadata such as notification number and date.

## Key Design Principles
- Verification-first: No answer without a source.
- Audit-safe outputs with citations.
- Modular architecture for future scaling.
- Designed for Indian regulatory complexity.

## Current Stage
This design represents a Proof of Concept (POC) and will evolve based on user feedback.
