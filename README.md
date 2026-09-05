# ContextIQ Backend

AI-powered document intelligence backend that enables document upload, text extraction, hierarchical summarization, semantic retrieval, and Retrieval-Augmented Generation (RAG) for contextual question answering.

## Live Links

### Frontend

https://context-iq-frontend.vercel.app/

### Backend API

https://contextiq-backend-zcck.onrender.com

---

## Features

### Authentication & Security

* JWT Authentication
* Refresh Token Rotation
* Email OTP Verification
* Secure HTTP-only Cookies
* Redis-based OTP Storage
* Session Management

### Document Processing

* PDF Upload Support
* Raw Text Input Support
* Text Extraction Pipeline
* Cloudinary File Storage
* Recursive Text Chunking
* Document Metadata Management

### AI & RAG

* Hierarchical Summarization
* Chunk-Level Summaries
* Final Document Summary Generation
* Hugging Face Embeddings
* pgvector Vector Storage
* Semantic Similarity Search
* Retrieval-Augmented Generation (RAG)
* Context-Aware Follow-up Questions
* Multi-turn Conversation Support

### Database

* PostgreSQL (Supabase)
* pgvector Extension
* Conversation Persistence
* Message History Storage
* Vector Search Indexing

---

## System Architecture

```text
User Uploads Document
        │
        ▼
Text Extraction
        │
        ▼
Recursive Chunking
        │
 ┌──────┴────────┐
 ▼               ▼
Embeddings    Chunk Summaries
 ▼               ▼
pgvector     Combined Context
 │               │
 └──────┬────────┘
        ▼
 Final Summary
        │
        ▼
 Database Storage
        │
        ▼
 User Question
        │
        ▼
 Question Embedding
        │
        ▼
 Semantic Retrieval
        │
        ▼
 Chat History Retrieval
        │
        ▼
 Context + History + Question
        │
        ▼
 OpenRouter LLM
        │
        ▼
 AI Response
```

---

## Tech Stack

### Backend

* Node.js
* Express.js

### Database

* PostgreSQL (Supabase)
* pgvector

### Authentication

* JWT
* Refresh Tokens
* Redis (Upstash)

### AI Layer

* OpenRouter
* Hugging Face Embeddings
* LangChain Recursive Character Text Splitter

### Storage

* Cloudinary

---

## Database Schema

### Users

Stores user information and authentication data.

### Refresh Tokens

Stores active login sessions and refresh token hashes.

### Documents

Stores uploaded document metadata, extracted text, summaries, and processing status.

### Document Chunks

Stores chunked text along with vector embeddings for semantic retrieval.

### Conversations

Stores document-specific chat sessions.

### Messages

Stores user and assistant messages used for follow-up conversations.

---

## API Modules

### Authentication

* Register User
* Verify Email OTP
* Login User
* Logout User
* Refresh Access Token

### Documents

* Upload Document
* Extract Text
* Generate Summary
* Chunk Processing
* Embedding Generation

### AI Engine

* Semantic Retrieval
* Follow-up Questions
* Chat History Retrieval
* RAG-based Question Answering

---

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
├── app.js
└── index.js
```

---

## Environment Variables

```env
PORT=

SUPABASE_DATABASE_URL=

REDIS_URL=

ACCESS_TOKEN_SECRET=
REFRESH_TOKEN_SECRET=

OPENROUTER_API_KEY=

HF_TOKEN=

CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

---

## Installation

```bash
git clone = https://github.com/sakshisingh0101/ContextIQ_backend.git

cd ContextIQ_backend

npm install

npm run dev
```

---

## Future Improvements

* Hybrid Search (Keyword + Vector Search)
* Streaming Responses
* Multi-Document Conversations
* Background Job Queue Processing
* Citation-Based Answers
* MCP Integration
* Docker Deployment
* Team Workspaces

---

## Author

Sakshi Singh

DTU Engineering Student

Built using Node.js, PostgreSQL, pgvector, Redis, LangChain, OpenRouter, Hugging Face Embeddings, and Cloudinary.

