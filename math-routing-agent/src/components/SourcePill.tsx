import React from 'react';
import { Source } from '../types';

interface SourcePillProps {
  source: Source;
}

const SourcePill: React.FC<SourcePillProps> = ({ source }) => {
  return (
    <a
      href={source.uri}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-2 glass text-blue-300 text-xs font-medium px-3 py-2 rounded-xl hover:glass-strong hover:text-blue-200 transition-all duration-300 truncate max-w-xs border-2 border-blue-400/30 hover:border-blue-400/50 transform hover:scale-105 group"
      title={source.title}
    >
      <span className="text-sm">🔗</span>
      <span className="group-hover:underline">{source.title || new URL(source.uri).hostname}</span>
      <svg className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
      </svg>
    </a>
  );
};

export default SourcePill;