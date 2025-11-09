# Complete RAG Pipeline Implementation: A to Z

## 📋 Overview

This document explains how the complete RAG (Retrieval-Augmented Generation) pipeline was built from scratch and integrated into your Math Professor AI app.

---

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    User Uploads Document                    │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│  1. Document Processing (Frontend)                          │
│     - Extract text from PDF/TXT                              │
│     - Send to Python Chunking API                            │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│  2. Semantic Chunking (Python API)                          │
│     - Split document into semantic chunks                    │
│     - Use sentence boundaries & topic shifts                │
│     - Add ~150 token overlaps                               │
│     - Return chunks with metadata                            │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│  3. Embedding Generation (Frontend)                         │
│     - Generate embeddings for each chunk                     │
│     - Store embeddings with chunks                           │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│  4. Vector Store (localStorage)                              │
│     - Store chunks with embeddings                           │
│     - Store metadata (document name, timestamps)             │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│  5. User Asks Question                                       │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│  6. Query Processing (Frontend)                             │
│     - Generate embedding for question                        │
│     - Search vector store for similar chunks                 │
│     - Retrieve top K most relevant chunks                    │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│  7. Context Assembly                                         │
│     - Combine retrieved chunks into context                  │
│     - Format for LLM                                         │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│  8. LLM Generation (Gemini)                                 │
│     - Send question + context to LLM                         │
│     - Generate answer using RAG context                       │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│  9. Display Answer to User                                   │
└─────────────────────────────────────────────────────────────┘
```

---

## 🔧 Step-by-Step Implementation

### **Step 1: Python Semantic Chunking Module**

**File**: `rag_pipeline/semantic_chunker.py`

**What it does:**
- Implements semantic chunking (not fixed-size)
- Groups text by mathematical concepts, sentence boundaries, and topic shifts
- Uses ~150 token overlaps for continuity
- Returns chunks ready for embedding

**Key Components:**

```python
class SemanticChunker:
    def __init__(self):
        # Initialize NLP tools
        - spaCy for sentence segmentation
        - tiktoken for token counting
        - sentence-transformers for semantic similarity
        
    def chunk_text(self, text):
        # 1. Split into sentences
        sentences = self.split_into_sentences(text)
        
        # 2. Detect topic shifts using semantic similarity
        topic_shifts = self.find_topic_shifts(sentences)
        
        # 3. Group sentences into semantic units
        semantic_units = self._group_sentences(sentences, topic_shifts)
        
        # 4. Create chunks with overlaps
        chunks = self._create_chunks_with_overlaps(semantic_units)
        
        return chunks
```

**How it works:**
1. **Sentence Segmentation**: Uses spaCy to split text into sentences
2. **Topic Shift Detection**: Compares consecutive sentences using semantic similarity
3. **Semantic Grouping**: Groups related sentences together
4. **Chunk Creation**: Creates chunks with controlled overlaps (~150 tokens)
5. **Metadata Generation**: Adds chunk IDs, token counts, character positions

---

### **Step 2: Python API Server**

**File**: `rag_pipeline/api_server.py`

**What it does:**
- Exposes chunking functionality via REST API
- Handles HTTP requests from frontend
- Returns chunks in JSON format

**Key Components:**

```python
@app.route('/chunk', methods=['POST'])
def chunk():
    # 1. Receive text from frontend
    text = request.json.get('text')
    
    # 2. Chunk the document
    chunks = chunk_document(text, document_id)
    
    # 3. Convert to FAISS format
    faiss_data = chunks_to_faiss_format(chunks)
    
    # 4. Return JSON response
    return jsonify({
        'success': True,
        'chunks': faiss_data,
        'total_chunks': len(faiss_data)
    })
```

**How it works:**
1. Receives POST request with text
2. Calls semantic chunker
3. Converts chunks to JSON format
4. Returns chunks to frontend

---

### **Step 3: Frontend Chunking Service**

**File**: `math-routing-agent/src/services/chunkingService.ts`

**What it does:**
- Calls Python API to chunk documents
- Handles API communication
- Returns chunks to components

**Key Components:**

```typescript
export const chunkDocument = async (
  text: string,
  options: ChunkingOptions
): Promise<ChunkingResponse> => {
  // 1. Call Python API
  const response = await fetch(apiUrl, {
    method: 'POST',
    body: JSON.stringify({ text, ...options })
  });
  
  // 2. Parse response
  const data = await response.json();
  
  // 3. Return chunks
  return data;
};
```

**How it works:**
1. Sends text to Python API
2. Receives chunks in JSON format
3. Returns chunks to caller

---

### **Step 4: RAG Service (Core Pipeline)**

**File**: `math-routing-agent/src/services/ragService.ts`

**What it does:**
- Orchestrates the entire RAG pipeline
- Handles document processing
- Manages vector store
- Performs semantic retrieval

**Key Components:**

#### **4.1. Vector Store (localStorage-based)**

```typescript
class VectorStore {
  static async storeChunks(chunks: Chunk[], documentName: string) {
    // Store chunks in localStorage
    const stored = JSON.stringify(chunks);
    localStorage.setItem('math_rag_chunks', stored);
  }
  
  static getChunks(): StoredChunk[] {
    // Retrieve chunks from localStorage
    const stored = localStorage.getItem('math_rag_chunks');
    return JSON.parse(stored || '[]');
  }
}
```

**How it works:**
- Stores chunks in browser localStorage
- Each chunk includes: text, embedding, metadata
- Can be replaced with real vector DB (Pinecone, Weaviate, etc.)

#### **4.2. Embedding Service**

```typescript
class EmbeddingService {
  static async generateEmbedding(text: string): Promise<number[]> {
    // Simple TF-IDF-like embedding
    // In production, use real embedding model
    const words = text.toLowerCase().split(/\s+/);
    const wordFreq = {};
    words.forEach(word => {
      wordFreq[word] = (wordFreq[word] || 0) + 1;
    });
    
    // Create normalized vector
    const vector = Object.values(wordFreq);
    const magnitude = Math.sqrt(vector.reduce((sum, val) => sum + val * val, 0));
    return vector.map(val => val / magnitude);
  }
  
  static cosineSimilarity(vec1: number[], vec2: number[]): number {
    // Calculate cosine similarity between vectors
    let dotProduct = 0;
    let mag1 = 0;
    let mag2 = 0;
    
    for (let i = 0; i < vec1.length; i++) {
      dotProduct += vec1[i] * vec2[i];
      mag1 += vec1[i] * vec1[i];
      mag2 += vec2[i] * vec2[i];
    }
    
    return dotProduct / (Math.sqrt(mag1) * Math.sqrt(mag2));
  }
}
```

**How it works:**
- Generates embeddings for text (simplified version)
- Calculates cosine similarity between vectors
- In production, use real embedding models (OpenAI, Cohere, etc.)

#### **4.3. Document Processing**

```typescript
static async processDocument(text: string, documentName: string) {
  // Step 1: Chunk the document
  const chunkingResponse = await chunkDocument(text, {
    document_id: `doc_${Date.now()}`,
    overlap_tokens: 150,
    max_chunk_tokens: 512
  });
  
  const chunks = chunkingResponse.chunks;
  
  // Step 2: Generate embeddings
  const chunksWithEmbeddings = await Promise.all(
    chunks.map(async (chunk) => {
      const embedding = await EmbeddingService.generateEmbedding(chunk.text);
      return { ...chunk, embedding, documentName };
    })
  );
  
  // Step 3: Store in vector store
  await VectorStore.storeChunks(chunksWithEmbeddings, documentName);
  
  return { chunks: chunksWithEmbeddings, stored: true };
}
```

**How it works:**
1. Calls Python API to chunk document
2. Generates embeddings for each chunk
3. Stores chunks with embeddings in vector store

#### **4.4. Semantic Retrieval**

```typescript
static async retrieveChunks(query: string, topK: number = 3) {
  // Step 1: Get all chunks from vector store
  const allChunks = VectorStore.getChunks();
  
  // Step 2: Generate embedding for query
  const queryEmbedding = await EmbeddingService.generateEmbedding(query);
  
  // Step 3: Calculate similarity for each chunk
  const chunksWithSimilarity = allChunks.map(chunk => {
    const similarity = chunk.embedding
      ? EmbeddingService.cosineSimilarity(queryEmbedding, chunk.embedding)
      : 0;
    return { chunk, similarity };
  });
  
  // Step 4: Sort by similarity and get top K
  const topChunks = chunksWithSimilarity
    .sort((a, b) => b.similarity - a.similarity)
    .slice(0, topK)
    .map(item => item.chunk);
  
  // Step 5: Create context from retrieved chunks
  const context = topChunks
    .map((chunk, index) => `[Chunk ${index + 1}]\n${chunk.text}`)
    .join('\n\n');
  
  return { chunks: topChunks, context, totalChunks: allChunks.length };
}
```

**How it works:**
1. Retrieves all chunks from vector store
2. Generates embedding for user query
3. Calculates similarity between query and each chunk
4. Sorts by similarity and retrieves top K chunks
5. Combines chunks into context string

---

### **Step 5: Integration with App**

**File**: `math-routing-agent/src/App.tsx`

**What it does:**
- Integrates RAG pipeline into file upload flow
- Integrates RAG retrieval into question answering flow

#### **5.1. File Upload Integration**

```typescript
const handleFileSelect = async (file: File) => {
  // Step 1: Extract text from file
  const content = await parseFileContent(file);
  
  // Step 2: Process document through RAG pipeline
  const { chunks } = await RAGService.processDocument(content, file.name);
  
  // Step 3: Extract questions (existing functionality)
  const questions = await extractQuestionsFromFile(ai, content);
  
  // Step 4: Display results
  setMessages(prev => [...prev, {
    text: `✅ Document processed! I've stored ${chunks.length} chunks in the RAG pipeline.`,
    extractedQuestions: questions
  }]);
};
```

**How it works:**
1. User uploads document
2. Text is extracted
3. Document is processed through RAG pipeline (chunking + storage)
4. Questions are extracted (existing functionality)
5. Results are displayed to user

#### **5.2. Question Answering Integration**

```typescript
const handleSendMessage = async (text: string) => {
  // Step 1: Guardrail check (is it math-related?)
  const isMath = await isMathQuestion(ai, text);
  if (!isMath) return;
  
  // Step 2: Retrieve relevant chunks from RAG pipeline
  const ragResult = await RAGService.retrieveChunks(text, 3);
  let ragContext: string | null = null;
  
  if (ragResult.chunks.length > 0) {
    // Use RAG context
    ragContext = ragResult.context;
    console.log(`🔍 RAG: Retrieved ${ragResult.chunks.length} chunks`);
  } else {
    // Fallback to keyword search
    const kbResult = searchKB(text);
    if (kbResult) ragContext = kbResult;
  }
  
  // Step 3: Generate answer with context
  const { answer, sources } = await generateSolution(ai, text, ragContext);
  
  // Step 4: Display answer
  setMessages(prev => [...prev, { text: answer, sources }]);
};
```

**How it works:**
1. User asks question
2. Guardrail checks if it's math-related
3. RAG pipeline retrieves relevant chunks
4. If chunks found, use as context
5. If not, fallback to keyword search
6. Generate answer using context
7. Display answer to user

---

### **Step 6: LLM Integration**

**File**: `math-routing-agent/src/services/geminiService.ts`

**What it does:**
- Uses RAG context in LLM prompts
- Generates answers using retrieved chunks

**Key Components:**

```typescript
export const generateSolution = async (
  ai: GoogleGenAI,
  question: string,
  knowledgeBaseResult: string | null  // This is RAG context
) => {
  let finalPrompt = `User's question: "${question}". Provide a simplified, step-by-step solution.`;
  
  if (knowledgeBaseResult) {
    // Use RAG context in prompt
    finalPrompt = `Based on the following context from uploaded documents and knowledge base, answer the user's question.

Context from RAG Pipeline:
${knowledgeBaseResult}

${finalPrompt}

If the context doesn't fully answer the question, provide additional information based on your knowledge.`;
  }
  
  // Generate answer with Gemini
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-pro',
    contents: finalPrompt
  });
  
  return { answer: response.text, sources: [] };
};
```

**How it works:**
1. Receives question and RAG context
2. Constructs prompt with context
3. Sends to Gemini LLM
4. Returns generated answer

---

## 🔄 Complete Flow Example

### **Example 1: Uploading a Document**

```
User Action: Uploads "math_textbook.pdf"

1. Frontend (App.tsx):
   - parseFileContent() extracts text
   - Calls RAGService.processDocument()

2. RAG Service (ragService.ts):
   - Calls chunkingService.chunkDocument()
   - Sends text to Python API

3. Python API (api_server.py):
   - Receives text
   - Calls semantic_chunker.chunk_text()
   - Returns chunks

4. Semantic Chunker (semantic_chunker.py):
   - Splits into sentences
   - Detects topic shifts
   - Creates semantic chunks
   - Returns chunks with metadata

5. RAG Service (ragService.ts):
   - Receives chunks
   - Generates embeddings
   - Stores in VectorStore (localStorage)

6. Frontend (App.tsx):
   - Displays: "✅ Document processed! I've stored 15 chunks"
```

### **Example 2: Asking a Question**

```
User Action: Asks "What is the Pythagorean theorem?"

1. Frontend (App.tsx):
   - handleSendMessage() called
   - Guardrail check passes

2. RAG Service (ragService.ts):
   - retrieveChunks() called
   - Generates query embedding
   - Searches vector store
   - Finds top 3 relevant chunks

3. RAG Service (ragService.ts):
   - Combines chunks into context
   - Returns context string

4. Frontend (App.tsx):
   - Calls generateSolution() with context

5. Gemini Service (geminiService.ts):
   - Constructs prompt with RAG context
   - Sends to Gemini LLM

6. Gemini LLM:
   - Generates answer using RAG context
   - Returns answer

7. Frontend (App.tsx):
   - Displays answer to user
```

---

## 📊 Data Flow Diagram

```
┌──────────────┐
│   Document   │
└──────┬───────┘
       │
       ▼
┌─────────────────┐     ┌──────────────┐
│  Extract Text   │────▶│  Python API  │
└─────────────────┘     └──────┬───────┘
                               │
                               ▼
                    ┌──────────────────┐
                    │ Semantic Chunker │
                    └──────┬───────────┘
                           │
                           ▼
                    ┌──────────────┐
                    │    Chunks    │
                    └──────┬───────┘
                           │
                           ▼
                    ┌──────────────┐
                    │ Embeddings   │
                    └──────┬───────┘
                           │
                           ▼
                    ┌──────────────┐
                    │ Vector Store │
                    └──────┬───────┘
                           │
                           ▼
                    ┌──────────────┐
                    │   Question   │
                    └──────┬───────┘
                           │
                           ▼
                    ┌──────────────┐
                    │  Retrieval   │
                    └──────┬───────┘
                           │
                           ▼
                    ┌──────────────┐
                    │   Context    │
                    └──────┬───────┘
                           │
                           ▼
                    ┌──────────────┐
                    │     LLM      │
                    └──────┬───────┘
                           │
                           ▼
                    ┌──────────────┐
                    │    Answer    │
                    └──────────────┘
```

---

## 🎯 Key Design Decisions

### **1. Why Semantic Chunking?**
- **Fixed-size chunks** break sentences and lose context
- **Semantic chunking** preserves meaning and context
- **Topic shifts** create natural boundaries
- **Overlaps** ensure continuity across chunks

### **2. Why Python API?**
- **NLP libraries** (spaCy, sentence-transformers) are Python-based
- **Separation of concerns** - chunking logic separate from frontend
- **Scalability** - can be deployed separately
- **Reusability** - can be used by other services

### **3. Why localStorage?**
- **Simple** - no backend needed
- **Fast** - client-side storage
- **Demo-friendly** - works out of the box
- **Production**: Replace with real vector DB

### **4. Why Simple Embeddings?**
- **No API calls** - works offline
- **Fast** - no network latency
- **Demo-friendly** - no external dependencies
- **Production**: Use OpenAI, Cohere, or sentence-transformers API

---

## 🔧 How It's Managed in the App

### **1. Automatic Startup**

**File**: `math-routing-agent/package.json`

```json
{
  "scripts": {
    "dev": "concurrently \"npm run dev:react\" \"npm run dev:api\"",
    "dev:react": "vite",
    "dev:api": "bash scripts/start-api.sh"
  }
}
```

**How it works:**
- `npm run dev` starts both React app and Python API
- Uses `concurrently` to run both processes
- Python API starts automatically

### **2. Service Integration**

**File**: `math-routing-agent/src/services/ragService.ts`

**How it works:**
- Single service handles all RAG operations
- Clean API for components
- Handles errors gracefully

### **3. Component Integration**

**File**: `math-routing-agent/src/App.tsx`

**How it works:**
- RAG pipeline integrated into existing flows
- No UI changes needed
- Works transparently

---

## 📝 Summary

### **What Was Built:**

1. ✅ **Python Semantic Chunking Module** - Chunks documents semantically
2. ✅ **Python API Server** - Exposes chunking via REST API
3. ✅ **Frontend Chunking Service** - Calls Python API
4. ✅ **RAG Service** - Orchestrates entire pipeline
5. ✅ **Vector Store** - Stores chunks with embeddings
6. ✅ **Embedding Service** - Generates embeddings
7. ✅ **Retrieval Service** - Finds relevant chunks
8. ✅ **App Integration** - Integrated into file upload and Q&A flows

### **How It Works:**

1. **Document Upload** → Chunk → Embed → Store
2. **Question Asked** → Embed Query → Search → Retrieve → Generate Answer

### **Key Features:**

- ✅ Semantic chunking (not fixed-size)
- ✅ Topic shift detection
- ✅ Controlled overlaps (~150 tokens)
- ✅ Embedding-based retrieval
- ✅ Automatic integration
- ✅ Fallback to keyword search
- ✅ Works with existing app

---

## 🚀 Next Steps for Production

1. **Replace localStorage** with real vector DB (Pinecone, Weaviate)
2. **Use real embeddings** (OpenAI, Cohere, sentence-transformers API)
3. **Add server-side storage** for chunks
4. **Implement proper vector search** with FAISS or similar
5. **Add chunk metadata** for better filtering
6. **Implement chunk versioning** for updates

---

This is the complete A-to-Z explanation of how the RAG pipeline was built and integrated into your app!

