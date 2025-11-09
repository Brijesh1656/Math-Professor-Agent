"""
Standalone Python API server for semantic chunking
Can be deployed on Railway, Render, Fly.io, or any Python hosting service
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
import sys
import os

# Add current directory to path
sys.path.insert(0, os.path.dirname(__file__))

try:
    from semantic_chunker import chunk_document, chunks_to_faiss_format
    CHUNKING_AVAILABLE = True
except ImportError as e:
    CHUNKING_AVAILABLE = False
    print(f"Warning: Chunking module not available: {e}")

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes


@app.route('/health', methods=['GET'])
def health():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'chunking_available': CHUNKING_AVAILABLE
    })


@app.route('/chunk', methods=['POST', 'OPTIONS'])
def chunk():
    """
    Chunk a document using semantic chunking
    
    Request body:
    {
        "text": "document text to chunk",
        "document_id": "optional_doc_id",
        "overlap_tokens": 150,
        "max_chunk_tokens": 512,
        "min_chunk_tokens": 50,
        "similarity_threshold": 0.7
    }
    
    Returns:
    {
        "success": true,
        "chunks": [...],
        "total_chunks": 5,
        "document_id": "doc_001"
    }
    """
    if request.method == 'OPTIONS':
        return '', 200
    
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({
                'success': False,
                'error': 'Missing request body'
            }), 400
        
        text = data.get('text', '')
        document_id = data.get('document_id', None)
        overlap_tokens = data.get('overlap_tokens', 150)
        max_chunk_tokens = data.get('max_chunk_tokens', 512)
        min_chunk_tokens = data.get('min_chunk_tokens', 50)
        similarity_threshold = data.get('similarity_threshold', 0.7)
        
        if not text:
            return jsonify({
                'success': False,
                'error': 'Missing required field: text'
            }), 400
        
        if not CHUNKING_AVAILABLE:
            return jsonify({
                'success': False,
                'error': 'Chunking module not available. Please check dependencies.'
            }), 503
        
        # Chunk the document
        chunks = chunk_document(
            text=text,
            document_id=document_id,
            overlap_tokens=overlap_tokens,
            max_chunk_tokens=max_chunk_tokens,
            min_chunk_tokens=min_chunk_tokens,
            similarity_threshold=similarity_threshold
        )
        
        # Convert to FAISS format
        faiss_data = chunks_to_faiss_format(chunks)
        
        return jsonify({
            'success': True,
            'chunks': faiss_data,
            'total_chunks': len(faiss_data),
            'document_id': document_id
        })
        
    except Exception as e:
        print(f"Error in chunk endpoint: {str(e)}")
        import traceback
        traceback.print_exc()
        
        return jsonify({
            'success': False,
            'error': f'Internal server error: {str(e)}'
        }), 500


if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=False)

