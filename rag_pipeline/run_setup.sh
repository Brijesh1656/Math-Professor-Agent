#!/bin/bash
# Quick setup and run script for semantic chunker

echo "=========================================="
echo "Semantic Chunker - Setup & Run Script"
echo "=========================================="
echo ""

# Navigate to script directory
cd "$(dirname "$0")"

echo "Step 1: Installing dependencies..."
pip3 install -r requirements.txt

if [ $? -ne 0 ]; then
    echo "⚠️  Error installing dependencies. Trying with pip..."
    pip install -r requirements.txt
fi

echo ""
echo "Step 2: Downloading spaCy model..."
python3 -m spacy download en_core_web_sm

echo ""
echo "Step 3: Verifying installation..."
python3 -c "from semantic_chunker import SemanticChunker; print('✓ Installation successful!')"

if [ $? -eq 0 ]; then
    echo ""
    echo "=========================================="
    echo "✓ Setup complete! Running examples..."
    echo "=========================================="
    echo ""
    python3 example_usage.py
else
    echo ""
    echo "⚠️  Installation verification failed. Please check the errors above."
    exit 1
fi

