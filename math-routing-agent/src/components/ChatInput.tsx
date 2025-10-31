import React, { useState } from 'react';
import { SendIcon } from '../constants';

interface ChatInputProps {
  onSendMessage: (text: string) => void;
  disabled: boolean;
  children?: React.ReactNode;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, disabled, children }) => {
  const [text, setText] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim() && !disabled) {
      onSendMessage(text);
      setText('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center space-x-3 p-4">
      {children}
      <div className="flex-grow relative">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Ask me anything about mathematics..."
          disabled={disabled}
          className="w-full px-6 py-4 bg-white/5 text-gray-100 placeholder-gray-500 focus:outline-none transition-all duration-300 rounded-2xl border-2 border-transparent focus:border-blue-400/50 focus:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed"
        />
        {text && (
          <div className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-gray-500">
            {text.length}
          </div>
        )}
      </div>
      <button
        type="submit"
        disabled={disabled || !text.trim()}
        className="relative p-4 rounded-2xl text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-lg hover:shadow-xl btn-hover-lift group"
        aria-label="Send message"
      >
        <SendIcon className="w-6 h-6 transform group-hover:translate-x-0.5 transition-transform" />
        {!disabled && text.trim() && (
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse"></span>
        )}
      </button>
    </form>
  );
};

export default ChatInput;