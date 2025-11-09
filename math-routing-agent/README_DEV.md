# Development Guide

## Running the App with Chunking API

The app now automatically starts both the React frontend and Python chunking API when you run `npm run dev`.

### Quick Start

```bash
# Install dependencies (first time only)
npm install

# Start both React app and Python API
npm run dev
```

This will:
- ✅ Start React dev server on `http://localhost:5173`
- ✅ Start Python chunking API on `http://localhost:5000`
- ✅ Both run concurrently in the same terminal

### Individual Commands

```bash
# Run only React app
npm run dev:react

# Run only Python API
npm run dev:api

# Run both (same as npm run dev)
npm run dev
```

### First Time Setup

If this is your first time running:

1. **Install Node dependencies**:
   ```bash
   npm install
   ```

2. **Python virtual environment will be created automatically** when you run `npm run dev` for the first time.

   Or manually:
   ```bash
   cd ../rag_pipeline
   python3 -m venv venv
   source venv/bin/activate
   pip install -r requirements_api.txt
   python -m spacy download en_core_web_sm
   ```

3. **Create `.env` file** in `math-routing-agent/`:
   ```env
   VITE_API_KEY=your_gemini_api_key
   VITE_CHUNKING_API_URL=http://localhost:5000/chunk
   ```

### Environment Variables

Create a `.env` file in `math-routing-agent/`:

```env
# Required: Google Gemini API Key
VITE_API_KEY=your_gemini_api_key_here

# Optional: Chunking API URL (defaults to http://localhost:5000/chunk)
VITE_CHUNKING_API_URL=http://localhost:5000/chunk
```

### Troubleshooting

#### Python API Not Starting

1. **Check if port 5000 is already in use**:
   ```bash
   lsof -i :5000
   # Kill the process if needed
   kill <PID>
   ```

2. **Check virtual environment**:
   ```bash
   cd ../rag_pipeline
   ls -la venv
   ```

3. **Recreate virtual environment**:
   ```bash
   cd ../rag_pipeline
   rm -rf venv
   python3 -m venv venv
   source venv/bin/activate
   pip install -r requirements_api.txt
   python -m spacy download en_core_web_sm
   ```

#### React App Not Starting

1. **Check if port 5173 is in use**:
   ```bash
   lsof -i :5173
   ```

2. **Clear node_modules and reinstall**:
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

#### API Already Running

If you see "API is already running", the script detected an existing API server. This is fine - it means the API is already up and running.

### Using Chunking in Your Code

```typescript
import { useChunking } from './hooks/useChunking';

// In your component
const { chunkDocument, chunks, isLoading } = useChunking();

// Chunk a document
await chunkDocument(text, {
  document_id: 'my_doc',
  overlap_tokens: 150,
  max_chunk_tokens: 512
});

// Chunks are now available in the `chunks` state
console.log(`Created ${chunks.length} chunks`);
```

### Stopping the Servers

Press `Ctrl+C` in the terminal to stop both servers.

### Production Deployment

For production:
1. Deploy Python API to Railway/Render (see `DEPLOYMENT_GUIDE.md`)
2. Update `VITE_CHUNKING_API_URL` in Vercel environment variables
3. Deploy frontend to Vercel

