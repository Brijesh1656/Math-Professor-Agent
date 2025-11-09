"""
Vercel Serverless Function for Semantic Chunking
This endpoint processes text and returns semantic chunks for RAG pipeline.
"""

from http.server import BaseHTTPRequestHandler
import json
import sys
import os

# Add rag_pipeline to path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', 'rag_pipeline'))

try:
    from semantic_chunker import chunk_document, chunks_to_faiss_format
    CHUNKING_AVAILABLE = True
except ImportError as e:
    CHUNKING_AVAILABLE = False
    print(f"Chunking module not available: {e}")


class handler(BaseHTTPRequestHandler):
    def do_OPTIONS(self):
        """Handle CORS preflight requests"""
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()
    
    def do_POST(self):
        """Handle POST requests for chunking"""
        try:
            # Read request body
            content_length = int(self.headers.get('Content-Length', 0))
            body = self.rfile.read(content_length)
            body_data = json.loads(body.decode('utf-8'))
            
            # Extract parameters
            text = body_data.get('text', '')
            document_id = body_data.get('document_id', None)
            overlap_tokens = body_data.get('overlap_tokens', 150)
            max_chunk_tokens = body_data.get('max_chunk_tokens', 512)
            min_chunk_tokens = body_data.get('min_chunk_tokens', 50)
            similarity_threshold = body_data.get('similarity_threshold', 0.7)
            
            if not text:
                self.send_error_response(400, 'Missing required field: text')
                return
            
            if not CHUNKING_AVAILABLE:
                self.send_error_response(503, 'Chunking module not available. Please check dependencies.')
                return
            
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
            
            # Send success response
            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            
            response = {
                'success': True,
                'chunks': faiss_data,
                'total_chunks': len(faiss_data),
                'document_id': document_id
            }
            
            self.wfile.write(json.dumps(response).encode('utf-8'))
            
        except json.JSONDecodeError:
            self.send_error_response(400, 'Invalid JSON in request body')
        except Exception as e:
            print(f"Error in chunk handler: {str(e)}")
            import traceback
            traceback.print_exc()
            self.send_error_response(500, f'Internal server error: {str(e)}')
    
    def send_error_response(self, status_code, error_message):
        """Helper to send error responses"""
        self.send_response(status_code)
        self.send_header('Content-Type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.end_headers()
        
        response = {
            'success': False,
            'error': error_message
        }
        
        self.wfile.write(json.dumps(response).encode('utf-8'))
