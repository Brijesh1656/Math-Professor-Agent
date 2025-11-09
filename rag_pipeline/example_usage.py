"""
Example usage of the semantic chunking module.

This script demonstrates how to use the semantic chunker to process
mathematical documents and prepare chunks for FAISS indexing.
"""

import json
from semantic_chunker import SemanticChunker, chunk_document, chunks_to_faiss_format


def example_basic_chunking():
    """Basic example of chunking a mathematical document."""
    
    # Sample mathematical document
    sample_text = """
    The Pythagorean theorem is a fundamental principle in Euclidean geometry.
    It states that in a right-angled triangle, the square of the length of the
    hypotenuse (the side opposite the right angle) is equal to the sum of the
    squares of the lengths of the other two sides. This can be written as:
    a² + b² = c², where c represents the length of the hypotenuse, and a and b
    represent the lengths of the other two sides.
    
    To prove this theorem, we can use several methods. One common approach is
    the geometric proof using squares. Another method involves algebraic
    manipulation. The theorem has numerous applications in mathematics, physics,
    and engineering.
    
    For example, if we have a right triangle with sides of length 3 and 4,
    we can find the length of the hypotenuse using the Pythagorean theorem:
    c² = 3² + 4² = 9 + 16 = 25, so c = 5.
    
    The converse of the Pythagorean theorem is also true: if a² + b² = c² for
    a triangle with sides a, b, and c, then the triangle is right-angled.
    This is useful for determining whether a triangle is right-angled.
    
    Derivatives are another important concept in calculus. The derivative of a
    function measures the rate of change of the function with respect to its
    variable. For a function f(x), the derivative is denoted as f'(x) or df/dx.
    
    The derivative can be computed using the limit definition:
    f'(x) = lim(h→0) [f(x+h) - f(x)] / h
    
    For example, if f(x) = x², then f'(x) = 2x. This means that the rate of
    change of x² is 2x at any point x.
    """
    
    print("=" * 80)
    print("Example 1: Basic Semantic Chunking")
    print("=" * 80)
    
    # Create chunker with default settings
    chunker = SemanticChunker(
        overlap_tokens=150,
        min_chunk_tokens=50,
        max_chunk_tokens=512,
        similarity_threshold=0.7
    )
    
    # Chunk the document
    chunks = chunker.chunk_text(sample_text, document_id="math_doc_001")
    
    print(f"\nCreated {len(chunks)} chunks:\n")
    
    for i, chunk in enumerate(chunks, 1):
        print(f"Chunk {i} (ID: {chunk.chunk_id}):")
        print(f"  Tokens: {chunk.token_length}")
        print(f"  Characters: {chunk.start_char}-{chunk.end_char}")
        print(f"  Has Math: {chunk.metadata.get('has_math', False)}")
        print(f"  Preview: {chunk.text[:100]}...")
        print()
    
    return chunks


def example_custom_chunking():
    """Example with custom chunking parameters."""
    
    sample_text = """
    Linear algebra is the branch of mathematics concerning linear equations,
    linear functions, and their representations through matrices and vector spaces.
    
    A matrix is a rectangular array of numbers arranged in rows and columns.
    For example, a 2x3 matrix has 2 rows and 3 columns. Matrix multiplication
    is defined when the number of columns in the first matrix equals the number
    of rows in the second matrix.
    
    The determinant of a square matrix is a scalar value that can be computed
    from its elements. For a 2x2 matrix [[a, b], [c, d]], the determinant is
    ad - bc. The determinant is zero if and only if the matrix is singular
    (non-invertible).
    
    Eigenvalues and eigenvectors are fundamental concepts in linear algebra.
    An eigenvector of a matrix A is a non-zero vector v such that Av = λv,
    where λ is the corresponding eigenvalue. Eigenvalues and eigenvectors
    have applications in many areas, including differential equations, quantum
    mechanics, and data analysis.
    """
    
    print("=" * 80)
    print("Example 2: Custom Chunking Parameters")
    print("=" * 80)
    
    # Create chunker with custom settings
    chunker = SemanticChunker(
        overlap_tokens=100,  # Smaller overlap
        min_chunk_tokens=30,
        max_chunk_tokens=256,  # Smaller max chunks
        similarity_threshold=0.65  # Lower threshold for more splits
    )
    
    chunks = chunker.chunk_text(sample_text, document_id="linear_algebra_001")
    
    print(f"\nCreated {len(chunks)} chunks with custom parameters:\n")
    
    for i, chunk in enumerate(chunks, 1):
        print(f"Chunk {i}:")
        print(f"  {chunk.text[:150]}...")
        print(f"  Tokens: {chunk.token_length}")
        print()
    
    return chunks


def example_faiss_integration():
    """Example showing how to prepare chunks for FAISS indexing."""
    
    sample_text = """
    Integration is the reverse process of differentiation. The indefinite
    integral of a function f(x) is denoted as ∫f(x)dx and represents the
    family of all antiderivatives of f(x).
    
    The fundamental theorem of calculus connects differentiation and integration.
    It states that if F(x) is an antiderivative of f(x), then:
    ∫[a to b] f(x)dx = F(b) - F(a)
    
    This theorem allows us to compute definite integrals by finding antiderivatives.
    For example, to compute ∫[0 to 1] x²dx, we find that the antiderivative of
    x² is x³/3, so the integral equals (1³/3) - (0³/3) = 1/3.
    """
    
    print("=" * 80)
    print("Example 3: FAISS Integration Format")
    print("=" * 80)
    
    # Use convenience function
    chunks = chunk_document(sample_text, document_id="calculus_001")
    
    # Convert to FAISS-ready format
    faiss_data = chunks_to_faiss_format(chunks)
    
    print(f"\nPrepared {len(faiss_data)} chunks for FAISS:\n")
    
    # Show first chunk in FAISS format
    print("First chunk in FAISS format:")
    print(json.dumps(faiss_data[0], indent=2))
    print()
    
    # Example: How to use with FAISS
    print("Example FAISS integration code:")
    print("""
    import faiss
    import numpy as np
    from sentence_transformers import SentenceTransformer
    
    # Load embedding model
    model = SentenceTransformer('all-MiniLM-L6-v2')
    
    # Generate embeddings for chunks
    texts = [chunk['text'] for chunk in faiss_data]
    embeddings = model.encode(texts)
    
    # Create FAISS index
    dimension = embeddings.shape[1]
    index = faiss.IndexFlatL2(dimension)
    
    # Add embeddings to index
    index.add(embeddings.astype('float32'))
    
    # Store metadata separately (FAISS doesn't store metadata)
    chunk_metadata = {i: chunk for i, chunk in enumerate(faiss_data)}
    """)
    
    return faiss_data


def example_file_processing():
    """Example of processing a text file."""
    
    print("=" * 80)
    print("Example 4: Processing a File")
    print("=" * 80)
    
    # Simulate reading from a file
    file_path = "sample_math_document.txt"
    
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        chunks = chunk_document(content, document_id="file_001")
        
        print(f"\nProcessed file '{file_path}' into {len(chunks)} chunks")
        
        # Save chunks to JSON
        output_file = "chunks_output.json"
        faiss_data = chunks_to_faiss_format(chunks)
        
        with open(output_file, 'w', encoding='utf-8') as f:
            json.dump(faiss_data, f, indent=2, ensure_ascii=False)
        
        print(f"Saved chunks to '{output_file}'")
        
    except FileNotFoundError:
        print(f"File '{file_path}' not found. Skipping file processing example.")
        print("To use this example, create a text file with mathematical content.")


def main():
    """Run all examples."""
    
    print("\n" + "=" * 80)
    print("Semantic Chunking Module - Usage Examples")
    print("=" * 80 + "\n")
    
    try:
        # Example 1: Basic chunking
        chunks1 = example_basic_chunking()
        
        print("\n" + "-" * 80 + "\n")
        
        # Example 2: Custom parameters
        chunks2 = example_custom_chunking()
        
        print("\n" + "-" * 80 + "\n")
        
        # Example 3: FAISS integration
        faiss_data = example_faiss_integration()
        
        print("\n" + "-" * 80 + "\n")
        
        # Example 4: File processing
        example_file_processing()
        
        print("\n" + "=" * 80)
        print("All examples completed successfully!")
        print("=" * 80)
        
    except Exception as e:
        print(f"\nError running examples: {e}")
        import traceback
        traceback.print_exc()


if __name__ == "__main__":
    main()

