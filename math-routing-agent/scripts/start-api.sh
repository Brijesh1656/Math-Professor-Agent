#!/bin/bash
# Script to start the Python chunking API server

# Navigate to rag_pipeline directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
RAG_PIPELINE_DIR="$SCRIPT_DIR/../../rag_pipeline"

cd "$RAG_PIPELINE_DIR" || exit 1

# Check if API is already running
if curl -s http://localhost:5000/health > /dev/null 2>&1; then
    echo "✅ Python Chunking API is already running on http://localhost:5000"
    exit 0
fi

# Check if virtual environment exists
if [ ! -d "venv" ]; then
    echo "⚠️  Virtual environment not found. Creating one..."
    python3 -m venv venv
    source venv/bin/activate
    pip install --upgrade pip --quiet
    echo "📦 Installing dependencies (this may take a minute)..."
    pip install -r requirements_api.txt --quiet
    echo "📥 Downloading spaCy model..."
    python -m spacy download en_core_web_sm --quiet
    echo "✅ Virtual environment created and dependencies installed"
else
    # Activate virtual environment
    source venv/bin/activate
fi

# Check if API server file exists
if [ ! -f "api_server.py" ]; then
    echo "❌ Error: api_server.py not found in $RAG_PIPELINE_DIR"
    exit 1
fi

# Start the API server
echo "🚀 Starting Python Chunking API on http://localhost:5000"
python3 api_server.py

