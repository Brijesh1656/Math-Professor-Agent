/**
 * RAG Service - Complete RAG Pipeline Integration
 * 
 * This service handles:
 * 1. Chunking documents using the Python API
 * 2. Generating embeddings for chunks
 * 3. Storing chunks in vector store (localStorage for now)
 * 4. Retrieving relevant chunks for queries
 * 5. Using chunks as context for LLM
 */

import { chunkDocument, Chunk } from './chunkingService';

export interface StoredChunk extends Chunk {
  embedding?: number[];
  documentName?: string;
  uploadedAt?: number;
}

export interface RAGResult {
  chunks: StoredChunk[];
  context: string;
  totalChunks: number;
}

// Vector store using localStorage (can be replaced with real vector DB)
class VectorStore {
  private static STORAGE_KEY = 'math_rag_chunks';
  private static EMBEDDINGS_KEY = 'math_rag_embeddings';

  static async storeChunks(chunks: Chunk[], documentName: string): Promise<void> {
    const storedChunks: StoredChunk[] = chunks.map(chunk => ({
      ...chunk,
      documentName,
      uploadedAt: Date.now(),
    }));

    // Get existing chunks
    const existing = this.getChunks();
    const allChunks = [...existing, ...storedChunks];

    // Store in localStorage
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(allChunks));
    
    console.log(`✅ Stored ${storedChunks.length} chunks from ${documentName}`);
  }

  static getChunks(): StoredChunk[] {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    if (!stored) return [];
    
    try {
      return JSON.parse(stored);
    } catch {
      return [];
    }
  }

  static clearChunks(): void {
    localStorage.removeItem(this.STORAGE_KEY);
    localStorage.removeItem(this.EMBEDDINGS_KEY);
    console.log('✅ Cleared all chunks from vector store');
  }

  static getChunkCount(): number {
    return this.getChunks().length;
  }
}

// Simple embedding generation using text similarity
// In production, use a proper embedding model (e.g., sentence-transformers)
class EmbeddingService {
  /**
   * Generate a simple embedding vector from text
   * This is a simplified version - in production, use a real embedding model
   */
  static async generateEmbedding(text: string): Promise<number[]> {
    // Simple TF-IDF-like embedding (for demo purposes)
    // In production, call an embedding API or use a client-side model
    const words = text.toLowerCase().split(/\s+/);
    const wordFreq: Record<string, number> = {};
    
    words.forEach(word => {
      wordFreq[word] = (wordFreq[word] || 0) + 1;
    });

    // Create a simple vector (normalized)
    const vector = Object.values(wordFreq);
    const magnitude = Math.sqrt(vector.reduce((sum, val) => sum + val * val, 0));
    
    return magnitude > 0 
      ? vector.map(val => val / magnitude)
      : new Array(100).fill(0); // Default empty vector
  }

  /**
   * Calculate cosine similarity between two vectors
   */
  static cosineSimilarity(vec1: number[], vec2: number[]): number {
    if (vec1.length !== vec2.length) return 0;
    
    let dotProduct = 0;
    let mag1 = 0;
    let mag2 = 0;
    
    for (let i = 0; i < vec1.length; i++) {
      dotProduct += vec1[i] * vec2[i];
      mag1 += vec1[i] * vec1[i];
      mag2 += vec2[i] * vec2[i];
    }
    
    const magnitude = Math.sqrt(mag1) * Math.sqrt(mag2);
    return magnitude > 0 ? dotProduct / magnitude : 0;
  }
}

/**
 * RAG Service - Main interface for RAG operations
 */
export class RAGService {
  /**
   * Process and store a document in the RAG pipeline
   * 1. Chunk the document
   * 2. Generate embeddings
   * 3. Store in vector store
   */
  static async processDocument(
    text: string,
    documentName: string
  ): Promise<{ chunks: Chunk[]; stored: boolean }> {
    try {
      console.log(`📄 Processing document: ${documentName}`);
      
      // Step 1: Chunk the document
      const chunkingResponse = await chunkDocument(text, {
        document_id: `doc_${Date.now()}`,
        overlap_tokens: 150,
        max_chunk_tokens: 512,
      });

      if (!chunkingResponse.success || !chunkingResponse.chunks) {
        throw new Error(chunkingResponse.error || 'Failed to chunk document');
      }

      const chunks = chunkingResponse.chunks;
      console.log(`✅ Created ${chunks.length} chunks`);

      // Step 2: Generate embeddings for each chunk
      console.log('🔢 Generating embeddings...');
      const chunksWithEmbeddings: StoredChunk[] = await Promise.all(
        chunks.map(async (chunk) => {
          const embedding = await EmbeddingService.generateEmbedding(chunk.text);
          return {
            ...chunk,
            embedding,
            documentName,
            uploadedAt: Date.now(),
          };
        })
      );

      // Step 3: Store chunks in vector store
      await VectorStore.storeChunks(chunksWithEmbeddings, documentName);

      return {
        chunks: chunksWithEmbeddings,
        stored: true,
      };
    } catch (error) {
      console.error('Error processing document:', error);
      throw error;
    }
  }

  /**
   * Retrieve relevant chunks for a query using semantic search
   */
  static async retrieveChunks(
    query: string,
    topK: number = 3
  ): Promise<RAGResult> {
    try {
      const allChunks = VectorStore.getChunks();
      
      if (allChunks.length === 0) {
        return {
          chunks: [],
          context: '',
          totalChunks: 0,
        };
      }

      // Generate embedding for query
      const queryEmbedding = await EmbeddingService.generateEmbedding(query);

      // Calculate similarity for each chunk
      const chunksWithSimilarity = allChunks.map(chunk => {
        const similarity = chunk.embedding
          ? EmbeddingService.cosineSimilarity(queryEmbedding, chunk.embedding)
          : 0; // Fallback to 0 if no embedding

        return {
          chunk,
          similarity,
        };
      });

      // Sort by similarity and get top K
      const topChunks = chunksWithSimilarity
        .sort((a, b) => b.similarity - a.similarity)
        .slice(0, topK)
        .map(item => item.chunk);

      // Create context from retrieved chunks
      const context = topChunks
        .map((chunk, index) => `[Chunk ${index + 1}]\n${chunk.text}`)
        .join('\n\n');

      console.log(`🔍 Retrieved ${topChunks.length} relevant chunks for query`);

      return {
        chunks: topChunks,
        context,
        totalChunks: allChunks.length,
      };
    } catch (error) {
      console.error('Error retrieving chunks:', error);
      return {
        chunks: [],
        context: '',
        totalChunks: 0,
      };
    }
  }

  /**
   * Get statistics about the RAG pipeline
   */
  static getStats(): {
    totalChunks: number;
    documents: string[];
  } {
    const chunks = VectorStore.getChunks();
    const documents = [...new Set(chunks.map(c => c.documentName).filter(Boolean))] as string[];

    return {
      totalChunks: chunks.length,
      documents,
    };
  }

  /**
   * Clear all stored chunks
   */
  static clearStore(): void {
    VectorStore.clearChunks();
  }
}

