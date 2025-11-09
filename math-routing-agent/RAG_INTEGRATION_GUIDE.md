# RAG Pipeline Integration Guide

## ✅ RAG Pipeline is Now Integrated!

Your app now has a complete RAG (Retrieval-Augmented Generation) pipeline that works alongside your Math Professor AI app.

## 🔄 How It Works

### 1. **Document Upload Flow**

When a user uploads a document:

```
User uploads PDF/TXT
    ↓
Extract text from document
    ↓
Chunk document using Python API (semantic chunking)
    ↓
Generate embeddings for each chunk
    ↓
Store chunks in vector store (localStorage)
    ↓
Extract questions from document
    ↓
Display questions to user
```

### 2. **Question Answering Flow**

When a user asks a question:

```
User asks question
    ↓
Guardrail check (is it math-related?)
    ↓
RAG Pipeline: Retrieve relevant chunks
    ↓
If chunks found: Use chunks as context
    ↓
If no chunks: Fallback to keyword search
    ↓
If still nothing: Use web search
    ↓
Generate answer with context
    ↓
Display answer to user
```

## 📊 What's Integrated

### ✅ Components Created

1. **`ragService.ts`** - Complete RAG pipeline service
   - Document processing (chunking + storage)
   - Semantic retrieval
   - Vector store (localStorage-based)
   - Embedding generation

2. **`useRAG.ts`** - React hook for RAG operations
   - Easy-to-use hook for components
   - Loading states
   - Error handling

3. **`RAGStatus.tsx`** - Status component
   - Shows RAG pipeline stats
   - Displays document count

### ✅ Updated Components

1. **`App.tsx`** - Integrated RAG into:
   - File upload flow (processes documents)
   - Question answering (retrieves chunks)

2. **`geminiService.ts`** - Updated to use RAG context

## 🚀 How to Use

### 1. **Upload a Document**

When a user uploads a document:
- The document is automatically chunked
- Chunks are stored in the RAG pipeline
- Questions are extracted
- User can ask questions about the document

### 2. **Ask Questions**

When a user asks a question:
- The RAG pipeline searches for relevant chunks
- If found, uses chunks as context for the answer
- If not found, falls back to keyword search or web search

### 3. **Check RAG Status**

You can add the RAG status component anywhere:

```typescript
import { RAGStatus } from './components/RAGStatus';

// In your component
<RAGStatus />
```

## 🔍 How to Verify It's Working

### 1. **Check Console Logs**

When you upload a document, you should see:
```
✅ RAG Pipeline: Stored X chunks from filename.pdf
```

When you ask a question, you should see:
```
🔍 RAG: Retrieved X relevant chunks from Y total chunks
```

### 2. **Check Browser Storage**

Open browser DevTools → Application → Local Storage:
- Look for `math_rag_chunks` key
- Should contain your stored chunks

### 3. **Test the Flow**

1. **Upload a document** with math content
2. **Ask a question** related to the document
3. **Check the answer** - it should use context from the document

## 📝 Example Usage

### In Your Components

```typescript
import { useRAG } from './hooks/useRAG';

const { processDocument, retrieveChunks, getStats } = useRAG();

// Process a document
const chunks = await processDocument(text, 'my_document.pdf');

// Retrieve relevant chunks
const context = await retrieveChunks('What is the Pythagorean theorem?');

// Get stats
const stats = getStats();
console.log(`Total chunks: ${stats.totalChunks}`);
```

## 🎯 Current Implementation

### Vector Store
- **Storage**: localStorage (client-side)
- **Embeddings**: Simple TF-IDF-like embeddings (for demo)
- **Search**: Cosine similarity

### Production Recommendations

For production, consider:

1. **Real Vector Database**:
   - Pinecone
   - Weaviate
   - Qdrant
   - FAISS (server-side)

2. **Better Embeddings**:
   - Use sentence-transformers API
   - OpenAI embeddings
   - Cohere embeddings

3. **Server-Side Storage**:
   - Store chunks in database
   - Generate embeddings server-side
   - Use proper vector search

## 🔧 Configuration

### Environment Variables

Make sure you have:

```env
VITE_API_KEY=your_gemini_api_key
VITE_CHUNKING_API_URL=http://localhost:5000/chunk
```

### Python API

The Python chunking API should be running:
```bash
npm run dev  # Starts both React and Python API
```

## 📊 RAG Pipeline Stats

You can check RAG pipeline status:

```typescript
import { RAGService } from './services/ragService';

const stats = RAGService.getStats();
console.log(`Total chunks: ${stats.totalChunks}`);
console.log(`Documents: ${stats.documents.join(', ')}`);
```

## 🧪 Testing the RAG Pipeline

### Test 1: Upload Document

1. Upload a PDF or TXT file with math content
2. Check console for: `✅ RAG Pipeline: Stored X chunks`
3. Check localStorage for stored chunks

### Test 2: Ask Question

1. Ask a question related to the uploaded document
2. Check console for: `🔍 RAG: Retrieved X relevant chunks`
3. Verify answer uses document context

### Test 3: Multiple Documents

1. Upload multiple documents
2. Ask questions about different documents
3. Verify RAG retrieves from correct documents

## 🐛 Troubleshooting

### Chunks Not Stored

- Check if Python API is running
- Check console for errors
- Verify `VITE_CHUNKING_API_URL` is set

### Chunks Not Retrieved

- Check if chunks exist in localStorage
- Verify question is related to document content
- Check console for retrieval logs

### Embeddings Not Working

- Current implementation uses simple embeddings
- For production, use a real embedding service
- Check embedding generation in console

## 🎉 You're All Set!

Your RAG pipeline is now fully integrated and working! 

- ✅ Documents are chunked when uploaded
- ✅ Chunks are stored in vector store
- ✅ Questions retrieve relevant chunks
- ✅ Answers use RAG context

The pipeline works automatically - just upload documents and ask questions!

