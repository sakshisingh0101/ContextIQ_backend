# ContextIQ Backend

AI-powered document and meeting intelligence platform that transforms PDFs, notes, and transcripts into structured insights using hierarchical summarization, semantic search, and Retrieval-Augmented Generation (RAG).

## Features

* User Authentication (JWT + Refresh Tokens)
* Email OTP Verification
* PDF and Text Document Upload
* Text Extraction from Uploaded Files
* Hierarchical AI Summarization
* Semantic Search with Vector Embeddings
* Retrieval-Augmented Generation (RAG)
* Context-Aware Question Answering
* PostgreSQL + pgvector Integration
* Redis-based OTP Storage
* Cloudinary File Storage

## Architecture

```text
Document Upload
      │
      ▼
Text Extraction
      │
      ▼
Chunking
      │
 ┌────┴────┐
 ▼         ▼
Embeddings  Chunk Summaries
 ▼         ▼
pgvector   Combined Summary
 │         ▼
 │     Final Summary
 ▼
Semantic Retrieval
      │
      ▼
Question Answering
```

## Tech Stack

### Backend

* Node.js
* Express.js

### Database

* PostgreSQL
* pgvector

### Authentication

* JWT
* Refresh Tokens
* Redis OTP Verification

### AI & RAG

* OpenRouter
* Hugging Face Embeddings
* LangChain Text Splitters

### Storage

* Cloudinary

## Database Schema

### Users

Stores user account information.

### Refresh Tokens

Maintains secure login sessions.

### Documents

Stores uploaded document metadata, extracted text, and generated summaries.

### Document Chunks

Stores text chunks and vector embeddings for semantic retrieval.

## API Modules

### Authentication

* Register User
* Verify Email OTP
* Login
* Logout
* Refresh Access Token

### Documents

* Upload Document
* Extract Text
* Generate Summary
* Store Embeddings

### AI Engine

* Semantic Retrieval
* Context-Aware Q&A
* RAG Pipeline

## Project Structure

```text
src
├── controllers
├── routes
├── middlewares
├── db
├── utils
├── services
├── constants
└── app.js
```

## Environment Variables

```env
PORT=

POSTGRES_URL=

REDIS_URL=

ACCESS_TOKEN_SECRET=
REFRESH_TOKEN_SECRET=

OPENROUTER_API_KEY=

HF_TOKEN=

CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

## Setup

```bash
git clone <repo-url>

npm install

npm run dev
```

## Future Improvements

* Meeting Action Item Extraction
* Conversation History Memory
* Hybrid Search (Keyword + Vector)
* Multi-Document Chat
* Async Background Processing
* MCP Integration
* Docker Deployment

## Status

🚧 Currently under active development.

```
```
