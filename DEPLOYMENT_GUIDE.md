# Deployment Guide: Integrating Python Chunking with Vercel Frontend

This guide shows you how to integrate the Python semantic chunking module with your React/TypeScript app and deploy everything to Vercel.

## Architecture Overview

You have two options:

### Option 1: Separate Python API (Recommended)
- **Frontend**: Deploy on Vercel (React/TypeScript)
- **Python API**: Deploy on Railway, Render, or Fly.io
- **Communication**: Frontend calls Python API via HTTP

### Option 2: Vercel Python Functions (Advanced)
- **Frontend + API**: Both on Vercel
- **Python Functions**: Use Vercel's Python runtime
- **Limitations**: More complex setup, limited Python support

## Option 1: Separate Python API (Recommended)

### Step 1: Deploy Python API

#### Option A: Deploy on Railway (Easiest)

1. **Create Railway Account**
   - Go to [railway.app](https://railway.app)
   - Sign up with GitHub

2. **Create New Project**
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Select your repository

3. **Configure Project**
   - Set root directory: `rag_pipeline`
   - Set start command: `python api_server.py` or `gunicorn api_server:app`
   - Add environment variables (if needed)

4. **Deploy**
   - Railway will auto-detect Python
   - Install dependencies from `requirements_api.txt`
   - Get your API URL: `https://your-project.railway.app`

#### Option B: Deploy on Render

1. **Create Render Account**
   - Go to [render.com](https://render.com)
   - Sign up with GitHub

2. **Create Web Service**
   - Click "New" → "Web Service"
   - Connect your repository
   - Settings:
     - **Name**: `math-chunking-api`
     - **Root Directory**: `rag_pipeline`
     - **Environment**: `Python 3`
     - **Build Command**: `pip install -r requirements_api.txt && python -m spacy download en_core_web_sm`
     - **Start Command**: `gunicorn api_server:app`

3. **Deploy**
   - Render will build and deploy
   - Get your API URL: `https://your-service.onrender.com`

#### Option C: Deploy on Fly.io

1. **Install Fly CLI**
   ```bash
   curl -L https://fly.io/install.sh | sh
   ```

2. **Create Fly App**
   ```bash
   cd rag_pipeline
   fly launch
   ```

3. **Configure**
   - Follow prompts
   - Set start command: `gunicorn api_server:app`

4. **Deploy**
   ```bash
   fly deploy
   ```

### Step 2: Update Frontend Configuration

1. **Add API URL to Environment Variables**

   Create/update `.env` in `math-routing-agent/`:
   ```env
   VITE_CHUNKING_API_URL=https://your-api-url.railway.app/chunk
   ```

   Or for Render:
   ```env
   VITE_CHUNKING_API_URL=https://your-service.onrender.com/chunk
   ```

2. **Update chunkingService.ts** (already done)

   The service already uses `import.meta.env.VITE_CHUNKING_API_URL` or falls back to `/api/chunk`.

### Step 3: Deploy Frontend to Vercel

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Add semantic chunking integration"
   git push origin main
   ```

2. **Deploy on Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Import your repository
   - Add environment variable:
     - **Name**: `VITE_CHUNKING_API_URL`
     - **Value**: Your Python API URL (e.g., `https://your-api.railway.app/chunk`)
   - Deploy

### Step 4: Test Integration

1. **Test API Health**
   ```bash
   curl https://your-api-url.railway.app/health
   ```

2. **Test Chunking**
   ```bash
   curl -X POST https://your-api-url.railway.app/chunk \
     -H "Content-Type: application/json" \
     -d '{"text": "The Pythagorean theorem states that a² + b² = c²."}'
   ```

3. **Test in Frontend**
   - Upload a document
   - Check browser console for chunking results

## Option 2: Vercel Python Functions (Advanced)

### Step 1: Update vercel.json

```json
{
  "buildCommand": "cd math-routing-agent && npm run build",
  "outputDirectory": "math-routing-agent/dist",
  "installCommand": "cd math-routing-agent && npm install",
  "functions": {
    "api/chunk.py": {
      "runtime": "python3.9"
    }
  },
  "rewrites": [
    {
      "source": "/api/(.*)",
      "destination": "/api/$1"
    },
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

### Step 2: Create requirements.txt at Root

Create `/requirements.txt`:
```
spacy>=3.7.0
tiktoken>=0.5.0
sentence-transformers>=2.2.0
numpy>=1.24.0
```

### Step 3: Deploy

1. **Push to GitHub**
2. **Deploy on Vercel**
   - Vercel will detect Python functions
   - Install dependencies automatically
   - Deploy

**Note**: Vercel Python functions have limitations:
- Cold start times can be slow
- Limited Python package support
- May need to download models on each invocation

## Integration with Your App

### Using Chunking in File Upload

Update `App.tsx` to use chunking:

```typescript
import { useChunking } from './hooks/useChunking';

// In your component
const { chunkDocument, chunks, isLoading: chunkingLoading } = useChunking();

// In handleFileSelect
const handleFileSelect = useCallback(async (file: File) => {
  // ... existing code ...
  
  try {
    const content = await parseFileContent(file);
    
    // Chunk the document
    await chunkDocument(content, {
      document_id: `file_${file.name}_${Date.now()}`,
      overlap_tokens: 150,
      max_chunk_tokens: 512
    });
    
    // Now you have chunks ready for RAG
    // You can store them, create embeddings, etc.
    
    // Continue with existing question extraction
    const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_API_KEY });
    const questions = await extractQuestionsFromFile(ai, content);
    
    // ... rest of your code ...
  } catch (error) {
    // ... error handling ...
  }
}, [chunkDocument]);
```

### Storing Chunks for RAG

After chunking, you can:

1. **Generate Embeddings** (client-side or server-side)
2. **Store in Vector DB** (Pinecone, Weaviate, etc.)
3. **Use for Retrieval** in your RAG pipeline

Example:
```typescript
// After chunking
const chunks = await chunkDocument(text);

// Generate embeddings (if you have a client-side model)
// Or send to your backend to generate embeddings

// Store chunks with metadata
chunks.forEach(chunk => {
  // Store in your vector database
  // Or send to your backend API
});
```

## Environment Variables

### Frontend (.env in math-routing-agent/)

```env
VITE_API_KEY=your_gemini_api_key
VITE_CHUNKING_API_URL=https://your-python-api-url.com/chunk
```

### Python API (Railway/Render)

```env
PORT=5000
# Add any other environment variables needed
```

## Troubleshooting

### Issue: CORS Errors

**Solution**: Make sure your Python API has CORS enabled:
```python
from flask_cors import CORS
CORS(app)  # Enable CORS
```

### Issue: API Not Found

**Solution**: 
- Check your API URL in environment variables
- Verify API is deployed and running
- Test API health endpoint

### Issue: Chunking Module Not Available

**Solution**:
- Check Python dependencies are installed
- Verify spaCy model is downloaded: `python -m spacy download en_core_web_sm`
- Check API logs for errors

### Issue: Slow Chunking

**Solution**:
- First run downloads models (~80MB)
- Subsequent runs are faster
- Consider caching models
- Use smaller models for faster processing

## Production Checklist

- [ ] Python API deployed and accessible
- [ ] CORS enabled on API
- [ ] Environment variables set in Vercel
- [ ] API health endpoint working
- [ ] Chunking endpoint tested
- [ ] Frontend integration tested
- [ ] Error handling implemented
- [ ] Logging configured

## Next Steps

1. **Deploy Python API** (Railway/Render recommended)
2. **Update frontend** to use chunking
3. **Test integration** end-to-end
4. **Add embeddings** generation
5. **Integrate with vector DB** for RAG
6. **Deploy to production**

## Support

- Check API logs for errors
- Test API endpoints with curl/Postman
- Verify environment variables
- Check browser console for frontend errors

