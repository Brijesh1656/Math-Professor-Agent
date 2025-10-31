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
    <form onSubmit={handleSubmit} className="flex items-center space-x-2 p-2">
      {children}
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Ask a math question..."
        disabled={disabled}
        className="flex-grow w-full px-4 py-3 bg-transparent text-gray-200 placeholder-gray-500 focus:outline-none transition duration-200"
      />
      <button
        type="submit"
        disabled={disabled || !text.trim()}
        className="p-3 rounded-full text-white bg-blue-600 hover:bg-blue-500 disabled:bg-gray-600 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-blue-400"
        aria-label="Send message"
      >
        <SendIcon className="w-5 h-5" />
      </button>
    </form>
  );
};

export default ChatInput;