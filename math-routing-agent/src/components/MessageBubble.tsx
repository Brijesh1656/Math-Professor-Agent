import React from 'react';
import { marked } from 'marked';
import { Message, Role, KnowledgeSource } from '../types';
import Feedback from './Feedback';
import SourcePill from './SourcePill';
import { DownloadIcon, BotIcon } from '../constants';
import ExtractedQuestions from './ExtractedQuestions';

interface MessageBubbleProps {
  message: Message;
  onFeedback?: (messageId: number, feedback: string) => void;
  onQuestionSelect?: (question: string) => void;
}

const TypingIndicator: React.FC = () => (
    <div className="flex items-center space-x-2 p-2">
        <div className="w-2.5 h-2.5 bg-cyan-400 rounded-full animate-pulse" style={{animationDelay: '0s'}}></div>
        <div className="w-2.5 h-2.5 bg-cyan-400 rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>
        <div className="w-2.5 h-2.5 bg-cyan-400 rounded-full animate-pulse" style={{animationDelay: '0.4s'}}></div>
    </div>
);

const MessageBubble: React.FC<MessageBubbleProps> = ({ message, onFeedback, onQuestionSelect }) => {
  const isUser = message.role === Role.USER;

  const downloadAnswer = () => {
    const markdownContent = `
# Math Agent Solution

---

**Answer:**
${message.text}

---
**Source:** ${message.knowledgeSource || 'N/A'}
${message.sources && message.sources.length > 0 ? `
**Web Sources:**
${message.sources.map(s => `- [${s.title}](${s.uri})`).join('\n')}
` : ''}
    `;

    const blob = new Blob([markdownContent.trim()], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `math_agent_solution_${message.id}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };
  
  const renderMessageContent = () => {
    if (message.isLoading) {
      return <TypingIndicator />;
    }
    const sanitizedHtml = marked.parse(message.text.replace(/<script.*?>.*?<\/script>/gi, ''));
    return <div className="prose prose-sm prose-invert max-w-none prose-p:text-gray-300 prose-headings:text-white prose-strong:text-white prose-code:text-cyan-300 prose-a:text-blue-400" dangerouslySetInnerHTML={{ __html: sanitizedHtml as string }} />;
  };

  const bubbleBaseClasses = "w-full p-5 rounded-2xl shadow-lg message-bubble";

  return (
    <div className={`flex items-start gap-4 ${isUser ? 'flex-row-reverse' : ''}`}>
       {!isUser && (
         <div className="w-10 h-10 flex-shrink-0 flex items-center justify-center bg-slate-700 rounded-full border-2 border-cyan-400/50">
           <BotIcon className="w-6 h-6 text-cyan-300" />
         </div>
       )}
      <div className={`max-w-2xl ${isUser ? 'ml-auto' : 'mr-auto'}`}>
          <div className={`${bubbleBaseClasses} ${
              isUser
                ? 'bg-blue-600/50 text-white rounded-br-none'
                : message.isError 
                ? 'bg-red-900/50 text-red-200 rounded-bl-none border border-red-500/50'
                : 'bg-slate-800/80 text-gray-200 rounded-bl-none border border-white/10 relative overflow-hidden'
            }`}
          >
             {!isUser && !message.isError && (
              <div className="absolute top-0 left-0 h-full w-1 bg-gradient-to-b from-cyan-400 to-blue-500"></div>
             )}
            <div className="whitespace-pre-wrap">{renderMessageContent()}</div>
            
            {message.extractedQuestions && onQuestionSelect && (
              <ExtractedQuestions questions={message.extractedQuestions} onQuestionSelect={onQuestionSelect} />
            )}
            
            {!isUser && !message.isError && !message.isLoading && message.text && (
              <div className="mt-4 pt-4 border-t border-white/10">
                 {message.knowledgeSource && (
                    <div className="flex items-center justify-between mb-3">
                        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                            message.knowledgeSource === KnowledgeSource.KNOWLEDGE_BASE
                                ? 'bg-green-900/50 text-green-300'
                                : 'bg-purple-900/50 text-purple-300'
                        }`}>
                           Source: {message.knowledgeSource}
                        </span>
                        <button onClick={downloadAnswer} className="p-1 text-gray-400 hover:text-blue-400 transition-colors" aria-label="Download answer as Markdown">
                            <DownloadIcon className="w-5 h-5" />
                        </button>
                    </div>
                )}
                 {message.isRefined && (
                    <p className="text-xs text-green-400 mb-2 italic">This answer has been refined based on your feedback.</p>
                )}
                
                {message.sources && message.sources.length > 0 && (
                  <div className="mt-2">
                    <h4 className="text-xs font-bold text-gray-400 mb-2">Web Sources:</h4>
                    <div className="flex flex-wrap gap-2">
                      {message.sources.map((source, index) => (
                        <SourcePill key={index} source={source} />
                      ))}
                    </div>
                  </div>
                )}

                {onFeedback && !message.isRefined && !message.extractedQuestions && <Feedback messageId={message.id} onFeedback={onFeedback} />}
              </div>
            )}
          </div>
      </div>
    </div>
  );
};

export default MessageBubble;