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
      className="inline-block bg-slate-700/50 text-blue-300 text-xs font-medium px-2.5 py-1 rounded-full hover:bg-slate-600/70 hover:text-blue-200 transition-colors truncate max-w-xs border border-white/10"
      title={source.title}
    >
      {source.title || new URL(source.uri).hostname}
    </a>
  );
};

export default SourcePill;