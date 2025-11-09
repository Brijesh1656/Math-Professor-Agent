# Quick Start Guide - Running the Semantic Chunker

## Step-by-Step Instructions

### Step 1: Navigate to the Directory

```bash
cd /home/brijesh/Documents/Math/rag_pipeline
```

### Step 2: Install Dependencies

```bash
# Install all required packages
pip install -r requirements.txt

# OR if you need to use pip3:
pip3 install -r requirements.txt
```

**Note**: This will install:
- spacy (for sentence segmentation)
- tiktoken (for token counting)
- sentence-transformers (for semantic similarity)
- numpy (for numerical operations)

### Step 3: Download spaCy Model

```bash
python3 -m spacy download en_core_web_sm
```

**Note**: First time will download ~15MB model. This is required for sentence segmentation.

### Step 4: Verify Installation

```bash
python3 -c "from semantic_chunker import SemanticChunker; print('✓ Installation successful!')"
```

If you see "✓ Installation successful!", you're ready to go!

### Step 5: Run Examples

#### Option A: Run the Complete Example Script

```bash
python3 example_usage.py
```

This will show:
- Basic semantic chunking
- Custom chunking parameters
- FAISS integration format
- File processing example

#### Option B: Run Tests

```bash
python3 test_chunker.py
```

This will run unit tests to verify everything works correctly.

#### Option C: Use in Your Own Code

Create a new Python file (e.g., `my_chunker.py`):

```python
from semantic_chunker import chunk_document

# Your text
text = """
The Pythagorean theorem states that in a right triangle, a² + b² = c².
This theorem has many applications in geometry and trigonometry.
"""

# Chunk the document
chunks = chunk_document(text, document_id="my_doc_001")

# Print results
for chunk in chunks:
    print(f"Chunk ID: {chunk.chunk_id}")
    print(f"Tokens: {chunk.token_length}")
    print(f"Text: {chunk.text[:100]}...")
    print()
```

Then run:
```bash
python3 my_chunker.py
```

## Common Issues & Solutions

### Issue 1: "ModuleNotFoundError: No module named 'spacy'"

**Solution**:
```bash
pip3 install spacy
python3 -m spacy download en_core_web_sm
```

### Issue 2: "OSError: Can't find model 'en_core_web_sm'"

**Solution**:
```bash
python3 -m spacy download en_core_web_sm
```

### Issue 3: "ModuleNotFoundError: No module named 'tiktoken'"

**Solution**:
```bash
pip3 install tiktoken
```

### Issue 4: "ModuleNotFoundError: No module named 'sentence_transformers'"

**Solution**:
```bash
pip3 install sentence-transformers
```

**Note**: First run will download a model (~80MB). This is normal!

### Issue 5: Permission Denied

**Solution**: Use `pip3 install --user` or create a virtual environment:

```bash
# Create virtual environment
python3 -m venv venv

# Activate it
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
python -m spacy download en_core_web_sm
```

## Using Virtual Environment (Recommended)

```bash
# 1. Create virtual environment
cd /home/brijesh/Documents/Math/rag_pipeline
python3 -m venv venv

# 2. Activate it
source venv/bin/activate

# 3. Install dependencies
pip install -r requirements.txt

# 4. Download spaCy model
python -m spacy download en_core_web_sm

# 5. Run examples
python example_usage.py
```

## Quick Test

Run this one-liner to test if everything works:

```bash
python3 -c "
from semantic_chunker import chunk_document
text = 'The Pythagorean theorem states that a² + b² = c².'
chunks = chunk_document(text, document_id='test')
print(f'✓ Created {len(chunks)} chunks')
for c in chunks:
    print(f'  - {c.chunk_id}: {c.token_length} tokens')
"
```

If this works, you're all set!

## Next Steps

1. **Read the documentation**: `README_CHUNKING.md`
2. **See examples**: `example_usage.py`
3. **Run tests**: `python3 test_chunker.py`
4. **Integrate into your RAG pipeline**

## Need Help?

- Check `setup_instructions.md` for detailed setup
- Check `README_CHUNKING.md` for usage documentation
- Run `python3 test_chunker.py` to verify installation

