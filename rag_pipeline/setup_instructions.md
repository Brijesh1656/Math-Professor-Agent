# Setup Instructions

## Quick Setup

### 1. Install Python Dependencies

```bash
cd rag_pipeline
pip install -r requirements.txt
```

### 2. Download spaCy Model

```bash
python -m spacy download en_core_web_sm
```

### 3. Verify Installation

```bash
python -c "from semantic_chunker import SemanticChunker; print('Installation successful!')"
```

## Detailed Setup

### Option 1: Using pip (Recommended)

```bash
# Navigate to the rag_pipeline directory
cd rag_pipeline

# Install all dependencies
pip install -r requirements.txt

# Download spaCy English model
python -m spacy download en_core_web_sm
```

### Option 2: Using Virtual Environment (Best Practice)

```bash
# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Linux/Mac:
source venv/bin/activate
# On Windows:
# venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Download spaCy model
python -m spacy download en_core_web_sm
```

### Option 3: Using conda

```bash
# Create conda environment
conda create -n rag_chunking python=3.9
conda activate rag_chunking

# Install dependencies
pip install -r requirements.txt

# Download spaCy model
python -m spacy download en_core_web_sm
```

## Testing the Installation

Run the example script to verify everything works:

```bash
python example_usage.py
```

You should see output showing chunked documents with metadata.

## Troubleshooting

### Issue: spaCy model not found

**Error**: `OSError: Can't find model 'en_core_web_sm'`

**Solution**:
```bash
python -m spacy download en_core_web_sm
```

### Issue: tiktoken installation fails

**Error**: `ModuleNotFoundError: No module named 'tiktoken'`

**Solution**:
```bash
pip install --upgrade pip
pip install tiktoken
```

### Issue: sentence-transformers download slow

**Note**: First run will download the model (~80MB). This is normal and only happens once.

**Solution**: Wait for the download to complete. Subsequent runs will use the cached model.

### Issue: Import errors

**Error**: `ImportError: cannot import name 'SemanticChunker'`

**Solution**: Make sure you're in the `rag_pipeline` directory or have it in your Python path:
```bash
export PYTHONPATH="${PYTHONPATH}:$(pwd)"
```

## Optional: Install FAISS

If you plan to use FAISS for vector indexing:

```bash
# CPU version (recommended for most users)
pip install faiss-cpu

# GPU version (if you have CUDA)
pip install faiss-gpu
```

## System Requirements

- Python 3.8 or higher
- 2GB+ RAM (for sentence-transformers model)
- Internet connection (for first-time model downloads)

## Next Steps

1. Read `README_CHUNKING.md` for detailed usage
2. Run `example_usage.py` to see examples
3. Integrate into your RAG pipeline

