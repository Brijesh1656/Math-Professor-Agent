/**
 * Custom hook for semantic chunking integration
 * Integrates with the Python chunking API
 */

import { useState, useCallback } from 'react';
import { chunkDocument, Chunk, ChunkingOptions } from '../services/chunkingService';

export interface UseChunkingReturn {
  chunks: Chunk[];
  isLoading: boolean;
  error: string | null;
  chunkDocument: (text: string, options?: ChunkingOptions) => Promise<void>;
  clearChunks: () => void;
}

export const useChunking = (): UseChunkingReturn => {
  const [chunks, setChunks] = useState<Chunk[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChunkDocument = useCallback(async (
    text: string,
    options: ChunkingOptions = {}
  ) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await chunkDocument(text, options);
      
      if (response.success && response.chunks) {
        setChunks(response.chunks);
      } else {
        throw new Error(response.error || 'Failed to chunk document');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      console.error('Chunking error:', errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearChunks = useCallback(() => {
    setChunks([]);
    setError(null);
  }, []);

  return {
    chunks,
    isLoading,
    error,
    chunkDocument: handleChunkDocument,
    clearChunks,
  };
};

