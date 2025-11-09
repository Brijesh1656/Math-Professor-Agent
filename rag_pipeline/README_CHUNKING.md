# Semantic Chunking Module for RAG Pipeline

A sophisticated semantic chunking implementation designed specifically for mathematical documents in RAG (Retrieval-Augmented Generation) systems. This module groups text by mathematical concepts, sentence boundaries, and logical topic shifts, creating coherent, self-contained chunks with controlled overlaps.

## Features

- **Semantic Chunking**: Uses semantic similarity to detect topic shifts and group related content
- **Mathematical Concept Detection**: Identifies mathematical concepts, formulas, and terminology
- **Sentence Boundary Awareness**: Respects sentence boundaries for natural chunk breaks
- **Controlled Overlaps**: Implements ~150 token overlaps to preserve continuity across reasoning steps
- **FAISS Integration**: Output format ready for FAISS vector indexing
- **Flexible Configuration**: Customizable chunk sizes, overlap amounts, and similarity thresholds

## Installation

### Prerequisites

- Python 3.8 or higher
- pip package manager

### Install Dependencies

```bash
# Install core dependencies
pip install -r requirements.txt

# Download spaCy English model (required for sentence segmentation)
python -m spacy download en_core_web_sm
```

### Dependencies

- **spacy**: Natural language processing for sentence segmentation
- **tiktoken**: Accurate token counting (OpenAI's tokenizer)
- **sentence-transformers**: Semantic similarity computation
- **numpy**: Numerical operations for embeddings

## Quick Start

### Basic Usage

```python
from semantic_chunker import chunk_document

# Your mathematical document text
text = """
The Pythagorean theorem states that in a right triangle, a² + b² = c².
This theorem has many applications in geometry and trigonometry.
"""

# Chunk the document
chunks = chunk_document(text, document_id="math_doc_001")

# Access chunk information
for chunk in chunks:
    print(f"Chunk ID: {chunk.chunk_id}")
    print(f"Tokens: {chunk.token_length}")
    print(f"Text: {chunk.text}")
    print(f"Has Math: {chunk.metadata.get('has_math', False)}")
    print()
```

### Advanced Usage

```python
from semantic_chunker import SemanticChunker

# Create chunker with custom parameters
chunker = SemanticChunker(
    overlap_tokens=150,          # Overlap between chunks
    min_chunk_tokens=50,          # Minimum chunk size
    max_chunk_tokens=512,         # Maximum chunk size
    similarity_threshold=0.7,     # Topic shift detection threshold
    use_spacy=True               # Use spaCy for sentence segmentation
)

# Chunk text
chunks = chunker.chunk_text(text, document_id="custom_doc")
```

### FAISS Integration

```python
from semantic_chunker import chunk_document, chunks_to_faiss_format
from sentence_transformers import SentenceTransformer
import faiss
import numpy as np

# Chunk document
chunks = chunk_document(text, document_id="faiss_doc")

# Convert to FAISS format
faiss_data = chunks_to_faiss_format(chunks)

# Generate embeddings
model = SentenceTransformer('all-MiniLM-L6-v2')
texts = [chunk['text'] for chunk in faiss_data]
embeddings = model.encode(texts)

# Create FAISS index
dimension = embeddings.shape[1]
index = faiss.IndexFlatL2(dimension)
index.add(embeddings.astype('float32'))

# Store metadata separately (FAISS doesn't store metadata)
chunk_metadata = {i: chunk for i, chunk in enumerate(faiss_data)}

# Search example
query = "Pythagorean theorem"
query_embedding = model.encode([query])
k = 3  # Number of results
distances, indices = index.search(query_embedding.astype('float32'), k)

# Retrieve chunks
for idx in indices[0]:
    chunk = chunk_metadata[idx]
    print(f"Chunk: {chunk['text'][:100]}...")
```

## Architecture

### Chunking Strategy

The chunking process follows these steps:

1. **Sentence Segmentation**: Split text into sentences using spaCy or fallback methods
2. **Topic Shift Detection**: Use semantic similarity to identify topic boundaries
3. **Semantic Grouping**: Group sentences into coherent semantic units
4. **Chunk Creation**: Create chunks with controlled overlaps (~150 tokens)
5. **Metadata Generation**: Add metadata for FAISS integration

### Chunk Structure

Each chunk contains:

- `chunk_id`: Unique identifier (e.g., "doc_001_chunk_0")
- `text`: The chunk text content
- `token_length`: Number of tokens in the chunk
- `start_char`: Starting character position in original document
- `end_char`: Ending character position in original document
- `metadata`: Additional metadata including:
  - `has_math`: Boolean indicating mathematical content
  - `unit_index`: Index of semantic unit
  - `sub_index`: Sub-index for split units

## Configuration Options

### SemanticChunker Parameters

| Parameter | Default | Description |
|-----------|---------|-------------|
| `model_name` | "all-MiniLM-L6-v2" | Sentence transformer model for semantic similarity |
| `overlap_tokens` | 150 | Number of tokens to overlap between chunks |
| `min_chunk_tokens` | 50 | Minimum tokens per chunk |
| `max_chunk_tokens` | 512 | Maximum tokens per chunk |
| `similarity_threshold` | 0.7 | Threshold for topic shift detection (0-1) |
| `use_spacy` | True | Whether to use spaCy for sentence segmentation |
| `use_llm_boundary` | False | Future: Use LLM for boundary detection |

### Tuning Guidelines

- **Smaller chunks** (lower `max_chunk_tokens`): Better for precise retrieval, more chunks
- **Larger chunks** (higher `max_chunk_tokens`): Better context, fewer chunks
- **Higher similarity threshold**: Fewer topic shifts, larger semantic units
- **Lower similarity threshold**: More topic shifts, smaller semantic units
- **More overlap**: Better continuity, more redundant chunks
- **Less overlap**: Less redundancy, potential context loss

## Mathematical Concept Detection

The module includes pattern-based detection for mathematical concepts:

- Mathematical keywords: theorem, lemma, proof, definition, etc.
- Operations: solve, calculate, compute, derive, prove
- Structures: equation, formula, function, variable
- Symbols: =, <, >, ≤, ≥, ≠, ≈, ∫, ∑, ∏, √, ∞
- Advanced concepts: integral, derivative, limit, matrix, vector

## Examples

See `example_usage.py` for comprehensive examples:

```bash
python example_usage.py
```

Examples include:
1. Basic semantic chunking
2. Custom chunking parameters
3. FAISS integration
4. File processing

## Performance Considerations

- **Sentence Transformers**: First run downloads the model (~80MB)
- **spaCy**: First run downloads the English model (~15MB)
- **Token Counting**: tiktoken is fast and accurate
- **Semantic Similarity**: Computed for consecutive sentence pairs

For large documents (10k+ tokens), consider:
- Processing in batches
- Using faster models (e.g., "all-MiniLM-L6-v2" is fast)
- Adjusting similarity threshold to reduce computations

## Error Handling

The module includes fallback mechanisms:

- If spaCy is unavailable, uses simple sentence splitting
- If sentence-transformers is unavailable, uses word overlap for similarity
- If tiktoken is unavailable, uses character-based token approximation
- All errors are logged with warnings, allowing graceful degradation

## Integration with RAG Pipeline

### Typical Workflow

1. **Document Ingestion**: Load documents (PDF, TXT, etc.)
2. **Text Extraction**: Extract text from documents
3. **Semantic Chunking**: Use this module to create chunks
4. **Embedding Generation**: Generate embeddings for each chunk
5. **FAISS Indexing**: Store embeddings in FAISS index
6. **Retrieval**: Query FAISS for relevant chunks
7. **Generation**: Use retrieved chunks as context for LLM

### Example Pipeline

```python
# 1. Load document
with open("math_textbook.pdf", "rb") as f:
    text = extract_text_from_pdf(f)

# 2. Chunk document
chunks = chunk_document(text, document_id="textbook_001")

# 3. Generate embeddings
model = SentenceTransformer('all-MiniLM-L6-v2')
embeddings = model.encode([chunk.text for chunk in chunks])

# 4. Create FAISS index
index = faiss.IndexFlatL2(embeddings.shape[1])
index.add(embeddings.astype('float32'))

# 5. Query
query_embedding = model.encode(["What is the Pythagorean theorem?"])
distances, indices = index.search(query_embedding.astype('float32'), k=3)

# 6. Retrieve context
context_chunks = [chunks[i] for i in indices[0]]
context = "\n\n".join([chunk.text for chunk in context_chunks])

# 7. Generate answer with LLM
answer = llm.generate(context, query)
```

## Troubleshooting

### Common Issues

1. **spaCy model not found**
   ```bash
   python -m spacy download en_core_web_sm
   ```

2. **Sentence transformer download slow**
   - First run downloads the model
   - Subsequent runs use cached model
   - Consider using smaller models for faster startup

3. **Chunks too large/small**
   - Adjust `max_chunk_tokens` and `min_chunk_tokens`
   - Modify `similarity_threshold` to change grouping behavior

4. **Memory issues with large documents**
   - Process documents in batches
   - Use streaming chunking for very large files

## License

This module is part of the Math Professor AI RAG system.

## Contributing

When contributing:
- Follow PEP 8 style guidelines
- Add docstrings to all functions
- Include unit tests for new features
- Update documentation

## References

- [FAISS Documentation](https://github.com/facebookresearch/faiss)
- [Sentence Transformers](https://www.sbert.net/)
- [spaCy Documentation](https://spacy.io/)
- [tiktoken](https://github.com/openai/tiktoken)

