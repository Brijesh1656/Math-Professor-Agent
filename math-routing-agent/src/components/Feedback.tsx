import React, { useState } from 'react';
import { ThumbsUpIcon, ThumbsDownIcon } from '../constants';

interface FeedbackProps {
  messageId: number;
  onFeedback: (messageId: number, feedback: string) => void;
}

const Feedback: React.FC<FeedbackProps> = ({ messageId, onFeedback }) => {
  const [showInput, setShowInput] = useState(false);
  const [feedbackText, setFeedbackText] = useState('');
  const [feedbackSent, setFeedbackSent] = useState(false);

  const handleFeedbackClick = (isGood: boolean) => {
      if (isGood) {
          onFeedback(messageId, 'The answer was correct and helpful.');
          setFeedbackSent(true);
      } else {
          setShowInput(true);
      }
  };

  const handleSendFeedback = () => {
    if (feedbackText.trim()) {
      onFeedback(messageId, feedbackText);
      setShowInput(false);
      setFeedbackText('');
      setFeedbackSent(true);
    }
  };

  if (feedbackSent) {
      return <p className="text-xs text-gray-400 italic">Thank you for your feedback!</p>
  }

  return (
    <div className="mt-3 text-sm">
      {!showInput && (
        <div className="flex items-center space-x-4">
          <span className="text-xs text-gray-400">Was this helpful?</span>
          <button onClick={() => handleFeedbackClick(true)} className="p-1 text-gray-400 hover:text-green-400 rounded-full transition-colors" aria-label="Good answer">
            <ThumbsUpIcon />
          </button>
          <button onClick={() => handleFeedbackClick(false)} className="p-1 text-gray-400 hover:text-red-400 rounded-full transition-colors" aria-label="Bad answer">
            <ThumbsDownIcon />
          </button>
        </div>
      )}

      {showInput && (
        <div className="mt-2 space-y-2">
          <textarea
            value={feedbackText}
            onChange={(e) => setFeedbackText(e.target.value)}
            placeholder="Provide feedback to refine the answer..."
            rows={2}
            className="w-full text-xs p-2 border border-white/10 rounded-md bg-slate-900/50 text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
          />
          <button
            onClick={handleSendFeedback}
            className="px-3 py-1 text-xs font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-500 disabled:bg-gray-600 transition-colors"
            disabled={!feedbackText.trim()}
          >
            Refine Answer
          </button>
        </div>
      )}
    </div>
  );
};

export default Feedback;