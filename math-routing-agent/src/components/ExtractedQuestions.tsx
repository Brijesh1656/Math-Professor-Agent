import React from 'react';

interface ExtractedQuestionsProps {
  questions: string[];
  onQuestionSelect: (question: string) => void;
}

const ExtractedQuestions: React.FC<ExtractedQuestionsProps> = ({ questions, onQuestionSelect }) => {
  if (questions.length === 0) return null;

  return (
    <div className="mt-6 flex flex-col space-y-3">
      <h4 className="text-sm font-semibold text-gray-300 flex items-center gap-2">
        <span>📋</span>
        <span>Extracted Questions</span>
      </h4>
      {questions.map((q, index) => (
        <button
          key={index}
          onClick={() => onQuestionSelect(q)}
          className="group w-full text-left p-4 glass rounded-xl hover:glass-strong border-2 border-white/10 hover:border-blue-400/50 transition-all duration-300 card-hover"
        >
          <div className="flex items-start gap-3">
            <span className="text-blue-400 font-bold text-sm mt-0.5">{index + 1}.</span>
            <p className="text-sm text-gray-300 group-hover:text-white transition-colors flex-1">{q}</p>
            <svg className="w-5 h-5 text-blue-400 opacity-0 group-hover:opacity-100 transition-all transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </button>
      ))}
    </div>
  );
};

export default ExtractedQuestions;
