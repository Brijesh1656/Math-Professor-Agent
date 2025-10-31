import React, { useState, useCallback, useRef, useEffect } from 'react';
import { GoogleGenAI } from '@google/genai';
import * as pdfjsLib from 'pdfjs-dist';
import { Message, AppState, Role, KnowledgeSource } from './types';
import { generateSolution, refineSolution, extractQuestionsFromFile, isMathQuestion } from './services/geminiService';
import { useKnowledgeBase } from './hooks/useKnowledgeBase';
import ChatInput from './components/ChatInput';
import MessageBubble from './components/MessageBubble';
import FileUpload from './components/FileUpload';
import { MathIcon } from './constants';

// Configure PDF.js worker to use the same CDN as the library, ensuring version consistency.
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://aistudiocdn.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.js`;

const App: React.FC = () => {
  // FIX: Removed useState for API key to fix `import.meta.env` error and align with guidelines. API key is now handled by process.env.API_KEY.
  const [messages, setMessages] = useState<Message[]>([]);
  const [appState, setAppState] = useState<AppState>(AppState.IDLE);
  const { searchKB } = useKnowledgeBase();
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback(() => {
    chatContainerRef.current?.scrollTo({
      top: chatContainerRef.current.scrollHeight,
      behavior: 'smooth',
    });
  }, []);

  useEffect(() => {
      scrollToBottom();
  }, [messages, scrollToBottom]);

  const handleSendMessage = useCallback(async (text: string) => {
    if (!text.trim()) return;

    const userMessage: Message = { id: Date.now(), text, role: Role.USER };
    const loadingMessage: Message = { id: Date.now() + 1, text: '', role: Role.AGENT, isLoading: true };

    setMessages(prev => [...prev, userMessage, loadingMessage]);
    setAppState(AppState.LOADING);

    try {
      // FIX: Initialize GoogleGenAI with process.env.API_KEY as per guidelines.
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

      // 1. Input Guardrail Check
      const isMath = await isMathQuestion(ai, text);
      if (!isMath) {
        const guardrailMessage: Message = { ...loadingMessage, isLoading: false, text: "As a mathematics professor, my focus is on math-related topics. Please ask me a question about mathematics." };
        setMessages(prev => prev.map(m => m.id === loadingMessage.id ? guardrailMessage : m));
        return;
      }
      
      // 2. Knowledge Base Search (RAG)
      const kbResult = searchKB(text);

      // 3. Generate Solution (from KB or Web Search)
      const { answer, sources } = await generateSolution(ai, text, kbResult);
      
      const agentMessage: Message = {
        ...loadingMessage,
        isLoading: false,
        text: answer,
        sources: sources,
        knowledgeSource: kbResult ? KnowledgeSource.KNOWLEDGE_BASE : KnowledgeSource.WEB_SEARCH,
      };
      setMessages(prev => prev.map(m => m.id === loadingMessage.id ? agentMessage : m));
    } catch (error) {
      console.error(error);
      const errorMessage: Message = {
        ...loadingMessage,
        isLoading: false,
        text: 'Sorry, I encountered an error. Please check your API key and try again.',
        isError: true,
      };
      setMessages(prev => prev.map(m => m.id === loadingMessage.id ? errorMessage : m));
    } finally {
      setAppState(AppState.IDLE);
    }
  }, [searchKB]);

  const handleFeedback = useCallback(async (messageId: number, feedback: string) => {
    const originalMessageIndex = messages.findIndex(m => m.id === messageId);
    if (originalMessageIndex === -1 || originalMessageIndex === 0) return;

    const originalMessage = messages[originalMessageIndex];
    const userQuestion = messages[originalMessageIndex - 1].text;
    
    setAppState(AppState.LOADING);
    // Optimistically update the message to show feedback is being processed.
    setMessages(prev => prev.map(m => m.id === messageId ? {...m, isRefined: true} : m));

    try {
      // FIX: Initialize GoogleGenAI with process.env.API_KEY as per guidelines.
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const refinedAnswer = await refineSolution(ai, userQuestion, originalMessage.text, feedback);
      const refinedMessage: Message = {
        ...originalMessage,
        id: Date.now(),
        text: refinedAnswer,
        isRefined: true,
      };
      setMessages(prev => prev.map(m => m.id === messageId ? refinedMessage : m));

    } catch (error) {
      console.error(error);
       const errorMessage: Message = {
        id: Date.now() + 1,
        text: 'Sorry, I could not refine the answer. Please try again.',
        role: Role.AGENT,
        isError: true,
      };
      setMessages(prev => [...prev, errorMessage]);
      // Revert optimistic update on failure
      setMessages(prev => prev.map(m => m.id === messageId ? {...m, isRefined: false} : m));
    } finally {
      setAppState(AppState.IDLE);
    }
  }, [messages]);

  const handleQuestionSelect = useCallback(async (question: string) => {
    await handleSendMessage(question);
  }, [handleSendMessage]);

  const parseFileContent = async (file: File): Promise<string> => {
    if (file.type === 'application/pdf') {
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await pdfjsLib.getDocument(arrayBuffer).promise;
        let textContent = '';
        for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i);
            const text = await page.getTextContent();
            textContent += text.items.map(s => (s as any).str).join(' ');
        }
        return textContent;
    } else { // Assumes .txt
        return file.text();
    }
  };

  const handleFileSelect = useCallback(async (file: File) => {
    if (!file || (!file.type.startsWith('text/') && file.type !== 'application/pdf')) {
        const errorMessage: Message = { id: Date.now(), text: 'Please upload a valid .txt or .pdf file.', role: Role.AGENT, isError: true };
        setMessages(prev => [...prev, errorMessage]);
        return;
    }
    
    const loadingMessage: Message = { id: Date.now() + 1, text: `Analyzing ${file.name}...`, role: Role.AGENT, isLoading: true };
    setMessages(prev => [...prev, loadingMessage]);
    setAppState(AppState.LOADING);

    try {
      const content = await parseFileContent(file);
      if (!content.trim()) throw new Error("File is empty or could not be read.");
      
      // FIX: Initialize GoogleGenAI with process.env.API_KEY as per guidelines.
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const questions = await extractQuestionsFromFile(ai, content);
      
      let agentResponseText: string;
      let questionsForMessage: string[] | undefined;
      if (questions.length > 0) {
        agentResponseText = `I have analyzed the document and found these questions. Select one to begin.`;
        questionsForMessage = questions;
      } else {
        agentResponseText = "I've analyzed the document, but I couldn't find any specific mathematical questions. You can ask me a question about the document's content directly.";
      }

      const infoMessage: Message = { ...loadingMessage, isLoading: false, text: agentResponseText, extractedQuestions: questionsForMessage };
      setMessages(prev => prev.map(m => m.id === loadingMessage.id ? infoMessage : m));
    } catch (error) {
      console.error(error);
      const errorMessage: Message = { ...loadingMessage, isLoading: false, text: 'Could not extract questions from the file. The file might be empty or in an unsupported format.', isError: true };
      setMessages(prev => prev.map(m => m.id === loadingMessage.id ? errorMessage : m));
    } finally {
      setAppState(AppState.IDLE);
    }
  }, []);

  const exampleQuestions = [
      "What is the Pythagorean theorem?",
      "How do you find the area of a circle with radius 5?",
      "Solve for x: 2x^2 - 8x - 10 = 0"
  ];

  return (
    <div className="flex flex-col h-screen font-sans text-gray-200">
      <header className="fixed top-0 left-0 right-0 z-10 p-4 border-b border-white/10 bg-black/30 backdrop-blur-md">
        <h1 className="text-xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">
          Math Routing Agent
        </h1>
        <p className="text-center text-sm text-gray-400">Your AI Professor for Step-by-Step Mathematical Solutions</p>
      </header>

      {/* FIX: Removed API key input UI and conditional rendering to comply with guidelines. */}
      <div className="flex flex-col flex-grow w-full h-full max-w-4xl mx-auto pt-24 pb-28">
        <main ref={chatContainerRef} className="flex-grow p-4 md:p-6 overflow-y-auto space-y-8">
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full text-center text-gray-400">
              <div className="w-20 h-20 mb-6 text-cyan-400">
                <MathIcon />
              </div>
              <h2 className="text-3xl font-bold mb-2 text-white">How can I help you today?</h2>
              <p className="max-w-md mb-8">Ask any math question or upload a TXT/PDF file with problems.</p>
              <div className="w-full max-w-md space-y-3">
                  {exampleQuestions.map(q => (
                      <button 
                        key={q} 
                        onClick={() => handleSendMessage(q)} 
                        className="w-full text-left p-4 bg-slate-800/50 border border-white/10 rounded-lg hover:bg-slate-700/70 hover:border-cyan-400/50 transition-all duration-300 group"
                      >
                          <span className="text-gray-300 group-hover:text-white transition-colors">{q}</span>
                      </button>
                  ))}
              </div>
            </div>
          )}
          {messages.map((msg) => (
            <MessageBubble key={msg.id} message={msg} onFeedback={handleFeedback} onQuestionSelect={handleQuestionSelect} />
          ))}
        </main>
        <footer className="fixed bottom-0 left-0 right-0 z-10">
           <div className="max-w-4xl mx-auto p-4">
              <div className="bg-black/30 backdrop-blur-md border border-white/10 rounded-2xl shadow-2xl">
                  <ChatInput onSendMessage={handleSendMessage} disabled={appState === AppState.LOADING}>
                      <FileUpload onFileSelect={handleFileSelect} disabled={appState === AppState.LOADING} />
                  </ChatInput>
              </div>
           </div>
        </footer>
      </div>
    </div>
  );
};

export default App;