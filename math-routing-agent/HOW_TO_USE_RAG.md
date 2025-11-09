# How to Use the RAG Pipeline

## ✅ RAG Pipeline is Now Integrated!

Your app now has a complete RAG pipeline that works automatically alongside your Math Professor AI app.

## 🚀 Quick Start

### 1. Start the App

```bash
cd math-routing-agent
npm run dev
```

This starts:
- ✅ React app on `http://localhost:5173`
- ✅ Python chunking API on `http://localhost:5000`

### 2. Verify RAG is Working

#### Step 1: Upload a Document

1. Open `http://localhost:5173`
2. Click the upload button (📎)
3. Upload a PDF or TXT file with math content

**What happens:**
- Document is chunked using Python API
- Chunks are stored in RAG pipeline
- Questions are extracted
- You'll see: `✅ Document processed! I've stored X chunks in the RAG pipeline`

#### Step 2: Ask a Question

1. Ask a question related to the uploaded document
2. The RAG pipeline will:
   - Search for relevant chunks
   - Use chunks as context for the answer
   - Generate answer using document context

**What you'll see:**
- Console log: `🔍 RAG: Retrieved X relevant chunks from Y total chunks`
- Answer uses context from your document

## 🔍 How to Verify It's Working

### Check Console Logs

Open browser DevTools (F12) → Console tab:

**When uploading a document:**
```
✅ RAG Pipeline: Stored X chunks from filename.pdf
```

**When asking a question:**
```
🔍 RAG: Retrieved X relevant chunks from Y total chunks
```

### Check Browser Storage

1. Open DevTools (F12)
2. Go to Application → Local Storage
3. Look for `math_rag_chunks` key
4. You should see your stored chunks

### Test the Flow

1. **Upload a document** with math content (e.g., "The Pythagorean theorem states that a² + b² = c²...")
2. **Ask a question** like "What is the Pythagorean theorem?"
3. **Check the answer** - it should reference your document content

## 📊 RAG Pipeline Flow

### Document Upload Flow

```
User uploads document
    ↓
Extract text
    ↓
Chunk document (Python API)
    ↓
Generate embeddings
    ↓
Store in vector store (localStorage)
    ↓
Extract questions
    ↓
Display to user
```

### Question Answering Flow

```
User asks question
    ↓
Guardrail check (is it math?)
    ↓
RAG: Retrieve relevant chunks
    ↓
If chunks found: Use as context
    ↓
If not: Fallback to keyword search
    ↓
If still not: Use web search
    ↓
Generate answer with context
    ↓
Display answer
```

## 🎯 How It Works

### 1. Document Processing

When you upload a document:
- Text is extracted
- Document is sent to Python chunking API
- Chunks are created with semantic boundaries
- Embeddings are generated for each chunk
- Chunks are stored in localStorage (vector store)

### 2. Question Retrieval

When you ask a question:
- Question embedding is generated
- Similarity search finds relevant chunks
- Top 3 most relevant chunks are retrieved
- Chunks are used as context for the LLM

### 3. Answer Generation

The LLM receives:
- Your question
- Relevant chunks from RAG pipeline
- Instructions to use context

The answer is generated using your document content!

## 📝 Example Usage

### Upload a Document

1. Create a text file with math content:
   ```
   The Pythagorean theorem states that in a right triangle, 
   a² + b² = c², where c is the hypotenuse.
   ```

2. Upload it through the app

3. You'll see: `✅ Document processed! I've stored X chunks`

### Ask Questions

Ask questions related to your document:
- "What is the Pythagorean theorem?"
- "Explain the formula a² + b² = c²"
- "What is the hypotenuse?"

The answers will use context from your uploaded document!

## 🔧 Configuration

### Environment Variables

Make sure you have `.env` file:

```env
VITE_API_KEY=your_gemini_api_key
VITE_CHUNKING_API_URL=http://localhost:5000/chunk
```

### Python API

The Python API should be running:
```bash
npm run dev  # Starts both React and Python API
```

## 🐛 Troubleshooting

### RAG Not Working?

1. **Check Python API is running:**
   ```bash
   curl http://localhost:5000/health
   ```
   Should return: `{"status":"healthy","chunking_available":true}`

2. **Check console for errors:**
   - Open DevTools → Console
   - Look for error messages

3. **Check environment variables:**
   - Verify `VITE_CHUNKING_API_URL` is set
   - Check `.env` file exists

### Chunks Not Stored?

1. **Check localStorage:**
   - DevTools → Application → Local Storage
   - Look for `math_rag_chunks`

2. **Check console logs:**
   - Should see: `✅ RAG Pipeline: Stored X chunks`

### Chunks Not Retrieved?

1. **Check if chunks exist:**
   - DevTools → Application → Local Storage
   - Verify chunks are stored

2. **Check question relevance:**
   - Question should be related to uploaded document
   - Try asking about specific content from document

## 📊 Check RAG Status

You can check RAG pipeline status in code:

```typescript
import { RAGService } from './services/ragService';

const stats = RAGService.getStats();
console.log(`Total chunks: ${stats.totalChunks}`);
console.log(`Documents: ${stats.documents.join(', ')}`);
```

## 🎉 You're All Set!

The RAG pipeline is now fully integrated and working automatically:

- ✅ Documents are chunked when uploaded
- ✅ Chunks are stored in vector store
- ✅ Questions retrieve relevant chunks
- ✅ Answers use RAG context

Just upload documents and ask questions - the RAG pipeline handles everything!

## 📚 Next Steps

1. **Test with multiple documents** - Upload several documents and ask questions
2. **Check retrieval quality** - See how well chunks are retrieved
3. **Improve embeddings** - For production, use better embedding models
4. **Add vector database** - Replace localStorage with a real vector DB

## 🔗 Related Files

- `src/services/ragService.ts` - RAG pipeline service
- `src/hooks/useRAG.ts` - React hook for RAG
- `src/components/RAGStatus.tsx` - Status component
- `RAG_INTEGRATION_GUIDE.md` - Detailed integration guide

