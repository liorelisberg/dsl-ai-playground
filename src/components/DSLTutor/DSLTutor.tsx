
import React, { useState } from 'react';
import ChatPanel from './ChatPanel';
import CodeEditor from './CodeEditor';
import { ChatMessage } from '../../types/chat';

const DSLTutor = () => {
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([
    {
      role: 'assistant',
      content: 'Welcome to DSL Tutor! I\'m here to help you learn and experiment with our JavaScript-like domain-specific language for data parsing and transformation. Feel free to ask questions or try out expressions in the code editor.',
      timestamp: new Date().toISOString()
    }
  ]);

  const handleNewMessage = (message: ChatMessage) => {
    setChatHistory(prev => {
      const newHistory = [...prev, message];
      // Keep only last 8 messages (4 conversation turns)
      return newHistory.slice(-8);
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <header className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-700 shadow-sm px-6 py-8">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-gradient-to-r from-indigo-600 to-emerald-500 rounded-2xl flex items-center justify-center shadow-lg">
            <span className="text-white font-bold text-xl">DSL</span>
          </div>
          <div>
            <h1 className="text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-emerald-500">
              DSL Tutor <span className="text-slate-500 dark:text-slate-400 font-semibold">Playground</span>
            </h1>
            <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">Learn & experiment with domain-specific expressions</p>
          </div>
        </div>
      </header>
      
      <div className="flex flex-col lg:flex-row h-[calc(100vh-120px)] gap-6 p-6">
        {/* Chat Panel - Left Side */}
        <div className="w-full lg:w-1/2">
          <div className="h-full bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
            <ChatPanel 
              chatHistory={chatHistory} 
              onNewMessage={handleNewMessage}
            />
          </div>
        </div>
        
        {/* Code Editor - Right Side */}
        <div className="w-full lg:w-1/2">
          <div className="h-full bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
            <CodeEditor />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DSLTutor;
