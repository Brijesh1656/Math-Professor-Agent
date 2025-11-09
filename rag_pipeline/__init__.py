"""
Semantic Chunking Module for RAG Pipeline

A sophisticated semantic chunking implementation for mathematical documents.
"""

from .semantic_chunker import (
    SemanticChunker,
    Chunk,
    chunk_document,
    chunks_to_faiss_format
)

__version__ = "1.0.0"
__all__ = [
    "SemanticChunker",
    "Chunk",
    "chunk_document",
    "chunks_to_faiss_format"
]

