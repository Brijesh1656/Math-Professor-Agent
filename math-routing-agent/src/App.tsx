import React, { useState, useCallback, useRef, useEffect } from 'react';
import { GoogleGenAI } from '@google/genai';
import * as pdfjsLib from 'pdfjs-dist';
import { Message, AppState, Role, KnowledgeSource } from './types';
import { generateSolution, refineSolution, extractQuestionsFromFile, isMathQuestion } from './services/geminiService';
import { useKnowledgeBase } from './hooks/useKnowledgeBase';
import { RAGService } from './services/ragService';
import ChatInput from './components/ChatInput';
import MessageBubble from './components/MessageBubble';
import FileUpload from './components/FileUpload';
import { MathIcon } from './constants';

// Configure PDF.js worker to use the same CDN as the library, ensuring version consistency.
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://aistudiocdn.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.js`;

const App: React.FC = () => {
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
      // FIX: Use import.meta.env.VITE_API_KEY instead of process.env.API_KEY
      const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_API_KEY });

      // 1. Input Guardrail Check
      const isMath = await isMathQuestion(ai, text);
      if (!isMath) {
        const guardrailMessage: Message = { ...loadingMessage, isLoading: false, text: "As a mathematics professor, my focus is on math-related topics. Please ask me a question about mathematics." };
        setMessages(prev => prev.map(m => m.id === loadingMessage.id ? guardrailMessage : m));
        return;
      }
      
      // 2. RAG Pipeline: Retrieve relevant chunks from uploaded documents
      const ragResult = await RAGService.retrieveChunks(text, 3);
      let ragContext: string | null = null;
      let knowledgeSource = KnowledgeSource.WEB_SEARCH;
      
      if (ragResult.chunks.length > 0) {
        ragContext = ragResult.context;
        knowledgeSource = KnowledgeSource.KNOWLEDGE_BASE;
        console.log(`🔍 RAG: Retrieved ${ragResult.chunks.length} relevant chunks from ${ragResult.totalChunks} total chunks`);
      } else {
        // Fallback to keyword-based search if no RAG chunks found
        const kbResult = searchKB(text);
        if (kbResult) {
          ragContext = kbResult;
          knowledgeSource = KnowledgeSource.KNOWLEDGE_BASE;
          console.log('📚 Using keyword-based knowledge base');
        }
      }

      // 3. Generate Solution (using RAG context or Web Search)
      const { answer, sources } = await generateSolution(ai, text, ragContext);
      
      const agentMessage: Message = {
        ...loadingMessage,
        isLoading: false,
        text: answer,
        sources: sources,
        knowledgeSource: knowledgeSource,
      };
      setMessages(prev => prev.map(m => m.id === loadingMessage.id ? agentMessage : m));
    } catch (error) {
      console.error(error);
      const errorMessage: Message = {
        ...loadingMessage,
        isLoading: false,
        text: error instanceof Error ? error.message : 'Sorry, I encountered an error. Please check your API key and try again.',
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
      // FIX: Use import.meta.env.VITE_API_KEY instead of process.env.API_KEY
      const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_API_KEY });
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
        text: error instanceof Error ? error.message : 'Sorry, I could not refine the answer. Please try again.',
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
      
      // Step 1: Process document through RAG pipeline (chunking + storage)
      const loadingChunkMessage: Message = { 
        ...loadingMessage, 
        text: `Processing ${file.name} through RAG pipeline...` 
      };
      setMessages(prev => prev.map(m => m.id === loadingMessage.id ? loadingChunkMessage : m));
      
      const { chunks } = await RAGService.processDocument(content, file.name);
      console.log(`✅ RAG Pipeline: Stored ${chunks.length} chunks from ${file.name}`);
      
      // Step 2: Extract questions from document
      const loadingQuestionMessage: Message = { 
        ...loadingMessage, 
        text: `Extracting questions from ${file.name}...` 
      };
      setMessages(prev => prev.map(m => m.id === loadingMessage.id ? loadingQuestionMessage : m));
      
      const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_API_KEY });
      const questions = await extractQuestionsFromFile(ai, content);
      
      let agentResponseText: string;
      let questionsForMessage: string[] | undefined;
      if (questions.length > 0) {
        agentResponseText = `✅ Document processed! I've stored ${chunks.length} chunks in the RAG pipeline. Found ${questions.length} question(s). Select one to begin, or ask me anything about the document.`;
        questionsForMessage = questions;
      } else {
        agentResponseText = `✅ Document processed! I've stored ${chunks.length} chunks in the RAG pipeline. I couldn't find specific questions, but you can ask me anything about the document's content.`;
      }

      const infoMessage: Message = { ...loadingMessage, isLoading: false, text: agentResponseText, extractedQuestions: questionsForMessage };
      setMessages(prev => prev.map(m => m.id === loadingMessage.id ? infoMessage : m));
    } catch (error) {
      console.error(error);
      const errorMessage: Message = { 
        ...loadingMessage, 
        isLoading: false, 
        text: error instanceof Error ? error.message : 'Could not extract questions from the file. The file might be empty or in an unsupported format.', 
        isError: true 
      };
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
    <div className="flex flex-col h-screen font-sans text-gray-100 relative z-10">
      {/* Header with Glassmorphism */}
      <header className="fixed top-0 left-0 right-0 z-50 p-4 glass-strong shadow-2xl">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl md:text-3xl font-bold text-center gradient-text mb-1">
            🧮 Math Professor AI
          </h1>
          <p className="text-center text-sm text-gray-400">Your AI-Powered Mathematics Companion</p>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex flex-col flex-grow w-full h-full max-w-6xl mx-auto pt-28 pb-32 px-4">
        <main ref={chatContainerRef} className="flex-grow overflow-y-auto space-y-6 scroll-smooth">
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full text-center">
              {/* Hero Section */}
              <div className="mb-8 relative">
                <div className="absolute inset-0 blur-3xl opacity-30 bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-500 rounded-full"></div>
                <div className="relative w-24 h-24 md:w-32 md:h-32 mx-auto text-blue-400 glow-blue rounded-full p-6 glass">
                  <MathIcon />
                </div>
              </div>
              
              <h2 className="text-3xl md:text-5xl font-bold mb-3 text-white">
                How can I help you today?
              </h2>
              <p className="max-w-2xl mb-12 text-gray-400 text-lg">
                Ask any math question or upload a document with problems to get started
              </p>
              
              {/* Example Questions Grid */}
              <div className="w-full max-w-3xl grid grid-cols-1 md:grid-cols-2 gap-4">
                  {exampleQuestions.map((q, index) => (
                      <button 
                        key={q} 
                        onClick={() => handleSendMessage(q)} 
                        className="group text-left p-6 glass rounded-2xl hover:glass-strong card-hover border-2 border-transparent hover:border-blue-500/50 transition-all duration-300"
                        style={{ animationDelay: `${index * 100}ms` }}
                      >
                          <div className="flex items-start gap-3">
                            <span className="text-2xl">💡</span>
                            <span className="text-gray-300 group-hover:text-white transition-colors flex-1">
                              {q}
                            </span>
                          </div>
                          <div className="mt-3 flex items-center text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity">
                            <span className="text-sm">Ask this question</span>
                            <svg className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </div>
                      </button>
                  ))}
              </div>
              
              {/* Features Section */}
              <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl">
                <div className="text-center p-6 glass rounded-2xl">
                  <div className="text-3xl mb-3">🤖</div>
                  <h3 className="font-semibold text-white mb-2">AI-Powered</h3>
                  <p className="text-sm text-gray-400">Advanced Gemini AI for accurate solutions</p>
                </div>
                <div className="text-center p-6 glass rounded-2xl">
                  <div className="text-3xl mb-3">📚</div>
                  <h3 className="font-semibold text-white mb-2">Step-by-Step</h3>
                  <p className="text-sm text-gray-400">Detailed explanations for every problem</p>
                </div>
                <div className="text-center p-6 glass rounded-2xl">
                  <div className="text-3xl mb-3">📄</div>
                  <h3 className="font-semibold text-white mb-2">Document Upload</h3>
                  <p className="text-sm text-gray-400">Extract questions from PDF & TXT files</p>
                </div>
              </div>
            </div>
          )}
          
          {/* Messages */}
          {messages.map((msg) => (
            <MessageBubble key={msg.id} message={msg} onFeedback={handleFeedback} onQuestionSelect={handleQuestionSelect} />
          ))}
        </main>
        
        {/* Input Area with Enhanced Glassmorphism */}
        <footer className="fixed bottom-0 left-0 right-0 z-50 pb-6">
           <div className="max-w-6xl mx-auto px-4">
              <div className="glass-strong rounded-3xl shadow-2xl glow-blue border-2 border-white/10 overflow-hidden">
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
