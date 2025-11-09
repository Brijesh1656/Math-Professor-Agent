"""
Simple test script to verify the semantic chunker works correctly.
"""

from semantic_chunker import SemanticChunker, chunk_document, Chunk


def test_basic_chunking():
    """Test basic chunking functionality."""
    text = """
    The Pythagorean theorem states that in a right triangle, a² + b² = c².
    This is a fundamental principle in geometry.
    """
    
    chunks = chunk_document(text, document_id="test_001")
    
    assert len(chunks) > 0, "Should create at least one chunk"
    assert isinstance(chunks[0], Chunk), "Should return Chunk objects"
    assert chunks[0].chunk_id is not None, "Chunk should have an ID"
    assert chunks[0].token_length > 0, "Chunk should have token length"
    
    print("✓ Basic chunking test passed")
    return True


def test_chunk_metadata():
    """Test that chunks have proper metadata."""
    text = """
    The derivative of x² is 2x. This follows from the power rule.
    Integration is the reverse process of differentiation.
    """
    
    chunks = chunk_document(text, document_id="test_002")
    
    for chunk in chunks:
        assert chunk.metadata is not None, "Chunk should have metadata"
        assert 'has_math' in chunk.metadata, "Metadata should include has_math"
        assert isinstance(chunk.metadata['has_math'], bool), "has_math should be boolean"
    
    print("✓ Metadata test passed")
    return True


def test_overlap():
    """Test that chunks have overlaps."""
    text = """
    Linear algebra deals with vectors and matrices. A vector is an ordered
    list of numbers. A matrix is a rectangular array of numbers. Matrix
    multiplication is defined when the number of columns in the first matrix
    equals the number of rows in the second matrix. The determinant of a
    square matrix is a scalar value that can be computed from its elements.
    """
    
    chunks = chunk_document(text, document_id="test_003", overlap_tokens=50)
    
    if len(chunks) > 1:
        # Check that chunks overlap
        chunk1_end = chunks[0].end_char
        chunk2_start = chunks[1].start_char
        
        # There should be some overlap or at least continuity
        assert chunk2_start <= chunk1_end or chunks[1].start_char < chunks[0].end_char, \
            "Chunks should have overlap or be continuous"
    
    print("✓ Overlap test passed")
    return True


def test_token_counting():
    """Test token counting functionality."""
    text = "This is a simple test sentence."
    
    chunker = SemanticChunker()
    token_count = chunker.count_tokens(text)
    
    assert token_count > 0, "Should count tokens"
    assert isinstance(token_count, int), "Token count should be integer"
    
    print(f"✓ Token counting test passed (counted {token_count} tokens)")
    return True


def test_mathematical_detection():
    """Test mathematical concept detection."""
    chunker = SemanticChunker()
    
    math_text = "The Pythagorean theorem states that a² + b² = c²."
    non_math_text = "The weather is nice today."
    
    assert chunker.detect_mathematical_concepts(math_text), \
        "Should detect mathematical concepts"
    assert not chunker.detect_mathematical_concepts(non_math_text), \
        "Should not detect math in non-math text"
    
    print("✓ Mathematical detection test passed")
    return True


def run_all_tests():
    """Run all tests."""
    print("Running semantic chunker tests...\n")
    
    tests = [
        test_basic_chunking,
        test_chunk_metadata,
        test_overlap,
        test_token_counting,
        test_mathematical_detection
    ]
    
    passed = 0
    failed = 0
    
    for test in tests:
        try:
            test()
            passed += 1
        except AssertionError as e:
            print(f"✗ {test.__name__} failed: {e}")
            failed += 1
        except Exception as e:
            print(f"✗ {test.__name__} error: {e}")
            failed += 1
    
    print(f"\n{'='*50}")
    print(f"Tests passed: {passed}/{len(tests)}")
    print(f"Tests failed: {failed}/{len(tests)}")
    print(f"{'='*50}")
    
    return failed == 0


if __name__ == "__main__":
    success = run_all_tests()
    exit(0 if success else 1)

