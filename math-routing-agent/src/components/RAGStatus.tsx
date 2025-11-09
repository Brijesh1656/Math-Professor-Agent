/**
 * Component to display RAG pipeline status
 */

import React from 'react';
import { RAGService } from '../services/ragService';

interface RAGStatusProps {
  className?: string;
}

export const RAGStatus: React.FC<RAGStatusProps> = ({ className = '' }) => {
  const stats = RAGService.getStats();

  if (stats.totalChunks === 0) {
    return (
      <div className={`text-sm text-gray-400 ${className}`}>
        📚 No documents in RAG pipeline. Upload a document to get started.
      </div>
    );
  }

  return (
    <div className={`text-sm text-gray-400 ${className}`}>
      📚 RAG Pipeline: {stats.totalChunks} chunks from {stats.documents.length} document(s)
      {stats.documents.length > 0 && (
        <span className="ml-2 text-xs">
          ({stats.documents.slice(0, 2).join(', ')}{stats.documents.length > 2 ? '...' : ''})
        </span>
      )}
    </div>
  );
};

