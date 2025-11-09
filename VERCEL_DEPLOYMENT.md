# Vercel Deployment Guide

## ✅ Vercel Configuration

Your app is configured to deploy on Vercel. The frontend (React app) will deploy on Vercel, while the Python chunking API needs to be deployed separately.

## 🚀 Deployment Steps

### Step 1: Deploy Python API (Required)

The Python chunking API **cannot** run on Vercel (Vercel doesn't support long-running Python processes). You need to deploy it separately:

#### Option A: Railway (Recommended)

1. Go to [railway.app](https://railway.app)
2. Create new project → Deploy from GitHub
3. Select your repository
4. Set root directory: `rag_pipeline`
5. Railway auto-detects Python and deploys
6. Get your API URL: `https://your-project.railway.app`

#### Option B: Render

1. Go to [render.com](https://render.com)
2. Create Web Service
3. Connect GitHub repository
4. Settings:
   - Root Directory: `rag_pipeline`
   - Build Command: `pip install -r requirements_api.txt && python -m spacy download en_core_web_sm`
   - Start Command: `gunicorn api_server:app`
5. Deploy and get URL: `https://your-service.onrender.com`

### Step 2: Deploy Frontend to Vercel

1. **Push to GitHub** (if not already done):
   ```bash
   git add .
   git commit -m "Add RAG pipeline integration"
   git push origin main
   ```

2. **Deploy on Vercel**:
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Vercel auto-detects Vite configuration
   - Add environment variables (see below)
   - Deploy

### Step 3: Configure Environment Variables

In Vercel project settings, add these environment variables:

#### Required:
- **Name**: `VITE_API_KEY`
- **Value**: Your Google Gemini API key

#### Required (for RAG):
- **Name**: `VITE_CHUNKING_API_URL`
- **Value**: Your Python API URL (from Railway/Render)
  - Example: `https://your-project.railway.app/chunk`
  - Or: `https://your-service.onrender.com/chunk`

## 📋 Vercel Configuration

Your `vercel.json` is already configured:

```json
{
  "buildCommand": "cd math-routing-agent && npm run build",
  "outputDirectory": "math-routing-agent/dist",
  "installCommand": "cd math-routing-agent && npm install"
}
```

This tells Vercel to:
1. Install dependencies in `math-routing-agent/`
2. Build the React app
3. Serve from `math-routing-agent/dist/`

## ⚠️ Important Notes

### Python API Cannot Run on Vercel

Vercel doesn't support:
- Long-running Python processes
- Python serverless functions (limited support)
- Python dependencies (spaCy, sentence-transformers)

**Solution**: Deploy Python API separately on Railway/Render/Fly.io

### Frontend Will Work on Vercel

The React frontend will work perfectly on Vercel:
- ✅ Vite build works
- ✅ Static files served correctly
- ✅ Environment variables work
- ✅ API calls to external Python API work

## 🔧 Environment Variables Setup

### In Vercel Dashboard:

1. Go to your project → Settings → Environment Variables
2. Add:

```
VITE_API_KEY=your_gemini_api_key
VITE_CHUNKING_API_URL=https://your-python-api.railway.app/chunk
```

### For Different Environments:

- **Production**: Set for `production` environment
- **Preview**: Set for `preview` environment
- **Development**: Set for `development` environment

## 🧪 Testing Deployment

### 1. Test Python API

```bash
curl https://your-api.railway.app/health
```

Should return: `{"status":"healthy","chunking_available":true}`

### 2. Test Frontend

1. Visit your Vercel URL
2. Check browser console for errors
3. Test document upload
4. Test question answering

### 3. Check Logs

- **Vercel**: Project → Deployments → View Function Logs
- **Railway/Render**: Check service logs

## 🐛 Troubleshooting

### Issue: Chunking Not Working

**Check:**
1. Python API is deployed and accessible
2. `VITE_CHUNKING_API_URL` is set correctly in Vercel
3. API URL is accessible (test with curl)

**Solution:**
- Verify Python API is running
- Check environment variables in Vercel
- Test API endpoint directly

### Issue: Build Fails

**Check:**
1. Build command is correct
2. Dependencies are installed
3. No TypeScript errors

**Solution:**
- Check Vercel build logs
- Run `npm run build` locally to test
- Fix any TypeScript errors

### Issue: API Calls Fail

**Check:**
1. CORS is enabled on Python API
2. API URL is correct
3. API is accessible from browser

**Solution:**
- Enable CORS on Python API (already done in `api_server.py`)
- Verify API URL in environment variables
- Check browser console for CORS errors

## 📊 Deployment Architecture

```
┌─────────────────┐
│   User Browser  │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Vercel (CDN)   │  ← Frontend (React App)
│  Frontend App   │
└────────┬────────┘
         │
         │ HTTP API Calls
         ▼
┌─────────────────┐
│ Railway/Render  │  ← Python Chunking API
│  Python API     │
└─────────────────┘
```

## ✅ Deployment Checklist

- [ ] Python API deployed on Railway/Render
- [ ] Python API URL obtained
- [ ] Environment variables set in Vercel
- [ ] Frontend pushed to GitHub
- [ ] Vercel deployment successful
- [ ] Test document upload
- [ ] Test question answering
- [ ] Check console for errors
- [ ] Verify RAG pipeline works

## 🎉 You're Ready!

Once deployed:
1. Frontend runs on Vercel
2. Python API runs on Railway/Render
3. They communicate via HTTP
4. RAG pipeline works end-to-end

## 📝 Next Steps

1. **Deploy Python API** to Railway/Render
2. **Get API URL** from deployment
3. **Set environment variables** in Vercel
4. **Deploy frontend** to Vercel
5. **Test everything** works

Your app is ready for production deployment! 🚀

