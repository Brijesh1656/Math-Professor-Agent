#!/usr/bin/env python3
"""
Simple example to quickly test the semantic chunker.
Run this after installing dependencies.
"""

from semantic_chunker import chunk_document

# Sample mathematical text
text = """
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
"""

print("=" * 80)
print("Semantic Chunker - Simple Example")
print("=" * 80)
print()

# Chunk the document
print("Chunking document...")
chunks = chunk_document(text, document_id="example_001")

print(f"\n✓ Created {len(chunks)} chunks\n")

# Display chunks
for i, chunk in enumerate(chunks, 1):
    print(f"Chunk {i} (ID: {chunk.chunk_id}):")
    print(f"  • Tokens: {chunk.token_length}")
    print(f"  • Has Math: {chunk.metadata.get('has_math', False)}")
    print(f"  • Preview: {chunk.text[:150]}...")
    print()

print("=" * 80)
print("✓ Example completed successfully!")
print("=" * 80)

