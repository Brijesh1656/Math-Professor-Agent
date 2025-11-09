/**
 * React hook for RAG pipeline operations
 */

import { useState, useCallback } from 'react';
import { RAGService } from '../services/ragService';
import { Chunk } from '../services/chunkingService';

export interface UseRAGReturn {
  processDocument: (text: string, documentName: string) => Promise<Chunk[]>;
  retrieveChunks: (query: string, topK?: number) => Promise<string>;
  getStats: () => { totalChunks: number; documents: string[] };
  clearStore: () => void;
  isLoading: boolean;
  error: string | null;
}

export const useRAG = (): UseRAGReturn => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const processDocument = useCallback(async (
    text: string,
    documentName: string
  ): Promise<Chunk[]> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await RAGService.processDocument(text, documentName);
      return result.chunks;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to process document';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const retrieveChunks = useCallback(async (
    query: string,
    topK: number = 3
  ): Promise<string> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await RAGService.retrieveChunks(query, topK);
      return result.context;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to retrieve chunks';
      setError(errorMessage);
      return '';
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getStats = useCallback(() => {
    return RAGService.getStats();
  }, []);

  const clearStore = useCallback(() => {
    RAGService.clearStore();
  }, []);

  return {
    processDocument,
    retrieveChunks,
    getStats,
    clearStore,
    isLoading,
    error,
  };
};

