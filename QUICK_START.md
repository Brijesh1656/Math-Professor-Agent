# 🚀 Quick Start - Run Everything with `npm run dev`

## ✅ Setup Complete!

Your app is now configured to run both the React frontend and Python chunking API together with a single command.

## 🎯 Run Everything

```bash
cd math-routing-agent
npm run dev
```

This will start:
- ✅ **React App** on `http://localhost:5173`
- ✅ **Python Chunking API** on `http://localhost:5000`
- ✅ Both run concurrently in the same terminal

## 📋 First Time Setup

### 1. Install Node Dependencies

```bash
cd math-routing-agent
npm install
```

### 2. Create `.env` File

Create `math-routing-agent/.env`:

```env
VITE_API_KEY=your_gemini_api_key_here
VITE_CHUNKING_API_URL=http://localhost:5000/chunk
```

### 3. Run the App

```bash
npm run dev
```

**Note**: The first time you run `npm run dev`, it will:
- Create Python virtual environment (if needed)
- Install Python dependencies (if needed)
- Download spaCy model (if needed)
- Start both servers

This may take a few minutes the first time.

## 🎮 Available Commands

```bash
# Run both React and Python API (recommended)
npm run dev

# Run only React app
npm run dev:react

# Run only Python API
npm run dev:api

# Build for production
npm run build
```

## ✅ Verify It's Working

1. **Check React App**: Open `http://localhost:5173`
2. **Check Python API**: Open `http://localhost:5000/health` in browser
   - Should see: `{"status":"healthy","chunking_available":true}`

## 🧪 Test Chunking

```bash
# Test the chunking API
curl -X POST http://localhost:5000/chunk \
  -H "Content-Type: application/json" \
  -d '{"text": "The Pythagorean theorem states that a² + b² = c²."}'
```

## 📝 Using Chunking in Your Code

```typescript
import { useChunking } from './hooks/useChunking';

const { chunkDocument, chunks, isLoading } = useChunking();

// Chunk a document
await chunkDocument(text, {
  document_id: 'my_doc',
  overlap_tokens: 150,
  max_chunk_tokens: 512
});

// Chunks are now in the `chunks` state
console.log(`Created ${chunks.length} chunks`);
```

## 🛑 Stopping

Press `Ctrl+C` in the terminal to stop both servers.

## ⚠️ Troubleshooting

### Port Already in Use

If you see "port already in use":
```bash
# Kill process on port 5000
lsof -ti:5000 | xargs kill

# Kill process on port 5173
lsof -ti:5173 | xargs kill
```

### Python API Not Starting

1. Check if virtual environment exists:
   ```bash
   ls ../rag_pipeline/venv
   ```

2. Manually create it:
   ```bash
   cd ../rag_pipeline
   python3 -m venv venv
   source venv/bin/activate
   pip install -r requirements_api.txt
   python -m spacy download en_core_web_sm
   ```

### API Already Running

If you see "API is already running", that's fine! It means the API is already up and running from a previous session.

## 🎉 You're Ready!

Just run `npm run dev` and both servers will start automatically!

