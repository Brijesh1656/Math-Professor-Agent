import React from 'react';

interface ExtractedQuestionsProps {
  questions: string[];
  onQuestionSelect: (question: string) => void;
}

const ExtractedQuestions: React.FC<ExtractedQuestionsProps> = ({ questions, onQuestionSelect }) => {
  if (questions.length === 0) return null;

  return (
    <div className="mt-4 flex flex-col space-y-3">
      {questions.map((q, index) => (
        <button
          key={index}
          onClick={() => onQuestionSelect(q)}
          className="w-full text-left p-4 bg-slate-700/50 rounded-lg hover:bg-slate-600/70 border border-white/10 hover:border-cyan-400/50 transition-all duration-300 group"
        >
          <p className="text-sm text-gray-300 group-hover:text-white transition-colors">{q}</p>
        </button>
      ))}
    </div>
  );
};

export default ExtractedQuestions;
